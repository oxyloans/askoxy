import { useCallback, useState, useEffect } from "react";
import BASE_URL from "../../Config";
import { Message } from "../types/types";
import axios from "axios";
import { message } from "antd";
import { LanguageConfig, ChatMessage } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";

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
  questionCount: number;
  setQuestionCount: React.Dispatch<React.SetStateAction<number>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const cleanContent = (content: string): string => {
  return content
    .replace(/\?\d+:\d+\?source\?/g, "")
    .replace(/(\w+)\?s/g, "$1")
    .replace(/\?.*?\?/g, "")
    .trim();
};

// --- NEW: robust image/url extraction ---
const extractImageUrl = (raw: string): { isImage: boolean; url?: string } => {
  const data = raw.trim();

  // data:image base64
  if (data.startsWith("data:image/")) {
    return { isImage: true, url: data };
  }

  // Markdown image: ![alt](url)
  const md = data.match(/!\[[^\]]*]\((https?:\/\/[^\s)]+)\)/i);
  if (md?.[1]) {
    return { isImage: true, url: md[1] };
  }

  // HTML <img src="...">
  const html = data.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html?.[1]) {
    return { isImage: true, url: html[1] };
  }

  // Bare URL (accept likely image links or signed urls with query)
  const bare = data.match(/https?:\/\/[^\s]+/i)?.[0];
  if (bare) {
    // If it ends with common image extensions OR has a querystring (often signed)
    if (
      /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(bare) ||
      /\?/.test(bare)
    ) {
      return { isImage: true, url: bare };
    }
  }

  return { isImage: false };
};

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
  questionCount, // Updated: Received as prop to check limit
  setQuestionCount, // Updated: Received as prop to increment count
  setShowModal, // Updated: Received as prop to show modal when limit reached
}: UseMessagesProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLogin = localStorage.getItem("userId");
    // Show modal when user tries to ask their 5th question
    if (questionCount >= 4 && !isLogin) {
      setShowModal(true);
    }
  }, [questionCount]);
  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent || input.trim();
      if (!textToSend) return;
      // Updated: Added check for question limit before sending; show modal and prevent send if limit reached for non-logged-in users
      const isLoggedIn = !!localStorage.getItem("userId");
      if (!isLoggedIn && questionCount >= 4) {
        setShowModal(true);
        return;
      }
      const userMessage: Message = { role: "user", content: textToSend };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setLoading(true);
      setQuestionCount((prevCount) => prevCount + 1);
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
        if (!response.ok) throw new Error(`Error: ${data}`);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);

        const { isImage, url } = extractImageUrl(data);
        const assistantReply: Message = {
          role: "assistant",
          // IMPORTANT: do NOT clean/strip when it's an image url (fixes "Failed to load image")
          content: isImage ? url || data.trim() : cleanContent(data),
          isImage,
        };

        setTimeout(() => setMessages((prev) => [...prev, assistantReply]), 50);
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

          // keep your redirect after first send from welcome screen
          if (location.pathname === "/genoxy") {
            navigate("/genoxy/chat");
          }
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
      location,
      navigate,
      questionCount, // Updated: Dependency for limit check
      setQuestionCount, // Updated: Dependency for increment
      setShowModal, // Updated: Dependency for showing modal
    ]
  );

  const handleEdit = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;
      const isLoggedIn = !!localStorage.getItem("userId");
      if (!isLoggedIn && questionCount >= 4) {
        setShowModal(true);
        return;
      }

      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);
      setQuestionCount((prev) => prev + 1);
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
        if (!response.ok) throw new Error(`Error: ${data}`);

        const { isImage, url } = extractImageUrl(data);
        const assistantReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: isImage ? url || data.trim() : cleanContent(data),
          isImage,
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
    [
      messages,
      setMessages,
      setLoading,
      messagesEndRef,
      abortControllerRef,
      questionCount,
      setQuestionCount,
      setShowModal,
    ]
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
      if (file && threadId === null) formData.append("file", file);
      formData.append("prompt", userPrompt);
      if (threadId) formData.append("threadId", threadId);

      const response = await axios.post(
        `${BASE_URL}/student-service/user/chat-with-file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const {
        answer,
        threadId: newThreadId,
        remainingPrompts: updatedPrompts,
      } = response.data;

      setThreadId(newThreadId);
      setRemainingPrompts(updatedPrompts);

      const { isImage, url } = extractImageUrl(answer);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isImage
          ? url || String(answer).trim()
          : cleanContent(String(answer)),
        isImage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (location.pathname === "/genoxy") {
        navigate("/genoxy/chat");
      }

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

  return { handleSend, handleEdit, handleFileUpload };
};

class VoiceSessionService {
  private peerConnection: RTCPeerConnection | null = null;
  private micStream: MediaStream | null = null;
  private recognition: any = null;
  private dataChannel: RTCDataChannel | null = null;
  private sessionTimeoutId: number | null = null;

  async getEphemeralToken(
    instructions: string,
    assistantId: string
  ): Promise<string> {
    try {
      const res = await fetch(
        `${BASE_URL}/student-service/user/token?assistnatId=${assistantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instructions }),
        }
      );
      const data = await res.json();
      return data.client_secret.value;
    } catch (error) {
      console.error("Failed to get ephemeral token:", error);
      throw error;
    }
  }

  async startSession(
    assistantId: string,
    selectedLanguage: LanguageConfig,
    selectedInstructions: string,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    navigate: (path: string) => void
  ): Promise<RTCDataChannel> {
    try {
      const EPHEMERAL_KEY = await this.getEphemeralToken(
        selectedInstructions,
        assistantId
      );

      const pc = new RTCPeerConnection();
      this.peerConnection = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(this.micStream.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      this.dataChannel = dc;

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

      this.setupSpeechRecognition(selectedLanguage, onMessage);
      this.setupDataChannelHandlers(
        dc,
        onMessage,
        onAssistantSpeaking,
        assistantId
      );

      // ✅ Removed 80s session timeout

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
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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
        // this.sendMessage(transcript);
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

  private setupDataChannelHandlers(
    dc: RTCDataChannel,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    assistantId: string
  ) {
    let buffer = "";

    dc.onmessage = async (e) => {
      try {
        const event = JSON.parse(e.data);

        // Session started
        if (event.status === "session_started") {
          console.log("✅ Realtime session started");
          return;
        }

        // Assistant typing
        if (event.type === "response.output_text.delta" && event.delta) {
          buffer += event.delta;
          onAssistantSpeaking(true);
          onMessage({
            role: "assistant",
            text: buffer,
            timestamp: new Date().toLocaleTimeString(),
          });
        }

        // Audio streaming
        if (event.type === "response.audio.delta") {
          onAssistantSpeaking(true);
        }

        // Assistant finished
        if (event.type === "response.stop") {
          onAssistantSpeaking(false);
          buffer = "";
        }

        // Tool call from assistant
        if (event.type === "response.required_action") {
          const requiredAction = event.response.required_action;
          if (requiredAction.type === "submit_tool_outputs") {
            const toolCalls = requiredAction.submit_tool_outputs.tool_calls;
            for (const toolCall of toolCalls) {
              const functionName = toolCall.function.name;
              if (functionName === "get_detailed_info") {
                const args = JSON.parse(toolCall.function.arguments);
                const query = args.query;
                await this.handleToolCall(toolCall.id, query, assistantId);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse assistant event:", err, e.data);
      }
    };

    dc.onopen = () => console.log("Data channel opened ✅");
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

  private async handleToolCall(
    toolCallId: string,
    query: string,
    assistantId: string
  ) {
    try {
      const res = await fetch(
        `${BASE_URL}/student-service/user/askquestion?assistantId=${assistantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: query,
              },
            ],
          }),
        }
      );
      const toolOutput = await res.json();

      const submitJson = {
        type: "response.submit_tool_outputs",
        response_id: toolCallId,
        tool_outputs: [{ tool_call_id: toolCallId, output: toolOutput.answer }],
      };

      this.dataChannel?.send(JSON.stringify(submitJson));
      console.log("✅ Tool output submitted back to assistant");
    } catch (err) {
      console.error("Failed to handle tool call:", err);
    }
  }

  // 7️⃣ Stop session
  stopSession() {
    if (this.sessionTimeoutId !== null) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }

    this.dataChannel?.close();
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.peerConnection?.close();
    (this.recognition as any)?.stop();
    this.dataChannel = null;
    this.micStream = null;
    this.peerConnection = null;
    this.recognition = null;
  }
}

export const voiceSessionService = new VoiceSessionService();
