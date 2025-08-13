import { useCallback, useState } from "react";
import BASE_URL from "../../Config";
import { Message } from "../types/types";
import axios from "axios";
import { LanguageConfig, ChatMessage } from "../types/types";

interface UseMessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  remainingPrompts: string | null;
  setRemainingPrompts: React.Dispatch<React.SetStateAction<string | null>>;
  threadId: string | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useMessages = ({
  messages,
  setMessages,
  input,
  setInput,
  setLoading,
  messagesEndRef,
  abortControllerRef,
  remainingPrompts,
  setThreadId,
  setRemainingPrompts,
  threadId,
}: UseMessagesProps) => {
  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent || input.trim();
      if (!textToSend) return;

      const userMessage: Message = { role: "user", content: textToSend };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
          signal: controller.signal,
        });

        const data = await response.text();

        if (!response.ok) {
          throw new Error(`Error: ${data}`);
        }

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);

        const isImageUrl = data.startsWith("http");
        const assistantReply: Message = {
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, assistantReply]);
        }, 50);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          isImage: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setTimeout(() => {
          setLoading(false);
          abortControllerRef.current = null;
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [
      messages,
      input,
      setMessages,
      setInput,
      setLoading,
      messagesEndRef,
      abortControllerRef,
    ]
  );

  const handleEdit = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
          signal: controller.signal,
        });

        const data = await response.text();

        if (!response.ok) {
          throw new Error(`Error: ${data}`);
        }

        const isImageUrl = data.startsWith("http");
        const assistantReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        setMessages((prev) => [...prev, assistantReply]);
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Chat error:", error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            isImage: false,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, setMessages, setLoading, messagesEndRef, abortControllerRef]
  );
  const handleFileUpload = async (
    file: File | null,
    userPrompt: string
  ): Promise<string | null> => {
    if (Number(remainingPrompts) === 0 && remainingPrompts != null) {
      return await Promise.resolve(null);
    }

    setLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const formData = new FormData();
      if (file && threadId === null) {
        formData.append("file", file);
      }
      formData.append("prompt", userPrompt);
      if (threadId) {
        formData.append("threadId", threadId);
      }

      const response = await axios.post(
        `${BASE_URL}/student-service/user/chat-with-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const {
        answer,
        threadId: newThreadId,
        remainingPrompts: updatedPrompts,
      } = response.data;

      setThreadId(newThreadId);
      setRemainingPrompts(updatedPrompts);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      return newThreadId;
    } catch (error) {
      console.error("File upload failed:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, the file upload failed. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSend,
    handleEdit,
    handleFileUpload,
  };
};

class VoiceSessionService {
  private peerConnection: RTCPeerConnection | null = null;
  private micStream: MediaStream | null = null;
  private recognition: any = null;
  private dataChannel: RTCDataChannel | null = null;

  async getEphemeralToken(instructions: string): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/student-service/user/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instructions }),
      });
      const data = await res.json();
      return data.client_secret.value;
    } catch (error) {
      console.error("Failed to get ephemeral token:", error);
      throw error;
    }
  }

  async startSession(
    selectedLanguage: LanguageConfig,
    selectedInstructions: string,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void
  ): Promise<RTCDataChannel> {
    try {
      const EPHEMERAL_KEY = await this.getEphemeralToken(selectedInstructions);

      const pc = new RTCPeerConnection();
      this.peerConnection = pc;

      // Setup audio
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // Setup microphone
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(this.micStream.getTracks()[0]);

      // Setup data channel
      const dc = pc.createDataChannel("oai-events");
      this.dataChannel = dc;

      // Setup WebRTC connection
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const model = "gpt-4o-realtime-preview-2025-06-03";
      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpRes.text(),
      };
      await pc.setRemoteDescription(answer);

      // Setup speech recognition
      this.setupSpeechRecognition(selectedLanguage, onMessage);

      // Setup data channel handlers
      this.setupDataChannelHandlers(dc, onMessage, onAssistantSpeaking);

      return dc;
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    }
  }

  private setupSpeechRecognition(
    selectedLanguage: LanguageConfig,
    onMessage: (message: ChatMessage) => void
  ) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage.speechLang;
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          const msg: ChatMessage = {
            role: "user",
            text: transcript,
            timestamp: new Date().toLocaleTimeString(),
          };
          onMessage(msg);
          this.sendMessage(transcript);
        }
      };

      recognition.onerror = (e: any) =>
        console.error("Speech recognition error:", e);

      recognition.onend = () => {
        if (this.dataChannel) recognition.start();
      };

      recognition.start();
      this.recognition = recognition;
    }
  }

  private setupDataChannelHandlers(
    dc: RTCDataChannel,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void
  ) {
    let buffer = "";

    dc.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        onAssistantSpeaking(true);

        if (event.type === "response.output_text.delta" && event.delta) {
          buffer += event.delta;
          onAssistantSpeaking(true);

          const msg: ChatMessage = {
            role: "assistant",
            text: buffer,
            timestamp: new Date().toLocaleTimeString(),
          };
          onMessage(msg);
        }

        if (event.type === "response.audio.delta") {
          onAssistantSpeaking(true);
        }

        if (event.type === "response.stop") {
          onAssistantSpeaking(false);
          buffer = "";
        }
      } catch (err) {
        console.error("Failed to parse assistant event:", err);
      }
    };

    dc.onopen = () => {
      console.log("Data channel opened");
    };
  }

  sendMessage(text: string) {
    if (!this.dataChannel) return;

    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };

    this.dataChannel.send(JSON.stringify(event));
    this.dataChannel.send(JSON.stringify({ type: "response.create" }));
  }

  stopSession() {
    this.dataChannel?.close();
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.peerConnection?.close();
    this.recognition?.stop();

    this.dataChannel = null;
    this.micStream = null;
    this.peerConnection = null;
    this.recognition = null;
  }
}

export const voiceSessionService = new VoiceSessionService();
