import { useCallback, useState, useEffect } from "react";
import Papa from "papaparse";
import BASE_URL from "../../Config";
import { Message } from "../types/types";
import axios from "axios";
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
      questionCount,
      setQuestionCount,
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
  files: File[] | null,
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

    // append multiple
    if (files && threadId === null) {
      files.forEach((file) => formData.append("files", file));
    }

    formData.append("prompt", userPrompt);
    if (threadId) formData.append("threadId", threadId);

    const response = await axios.post(
      `${BASE_URL}/student-service/user/chat-with-files`,
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
      content: isImage ? url || String(answer).trim() : cleanContent(String(answer)),
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

  private fileUrl: string | null = null;
  private fileContent: Record<string, any[]> = {}; // brand → data
  private sheetMap: Record<string, string | string[]> = {
    lenovo: "0",
    acer: "1427934623",
    hp: "1411153632",
    dell: "1170071782",
    asus: "1461294814",
    motorola: "374851585",
    iphone: "1266860599",
    samsung: "868260221",
    oppo: "1286876298",
    Realme:"1601014869",
    vivo: "1244878989",
    others: [
      "1244878989",
      "1286876298",
      "1266860599",
      "868260221",
      "0",
      "1427934623",
      "1170071782",
      "1411153632",
      "374851585",
    ], // multiple GIDs
  };

  constructor(fileUrl?: string) {
    if (fileUrl) this.fileUrl = fileUrl;
  }

  async getEphemeralToken(
    instructions: string,
    assistantId: string,
    voicemode: string
  ): Promise<string> {
    try {
      const res = await fetch(
        `${BASE_URL}/student-service/user/voicetoken?assistantId=${assistantId}&voicemode=${voicemode}`,
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

  private async fetchSheetByBrand(brand: string): Promise<any[]> {
    const lowerBrand = brand.toLowerCase();
    let gids = this.sheetMap[lowerBrand] || this.sheetMap["others"];
    if (!this.fileUrl) return [];

    // Convert single GID to array
    if (!Array.isArray(gids)) gids = [gids];

    // Return cached data if available
    if (this.fileContent[lowerBrand]) {
      console.log(`⚡ Using cached data for ${lowerBrand}`);
      return this.fileContent[lowerBrand];
    }

    const mergedData: any[] = [];

    try {
      const spreadsheetIdMatch = this.fileUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!spreadsheetIdMatch) throw new Error("Invalid Google Sheet URL");
      const spreadsheetId = spreadsheetIdMatch[1];

      for (const gid of gids) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
        const res = await fetch(csvUrl);

        if (!res.ok) {
          console.warn(`⚠️ Failed to fetch sheet for GID: ${gid}`);
          continue;
        }

        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        mergedData.push(...(parsed.data as any[]));
      }

      this.fileContent[lowerBrand] = mergedData;
      console.log(
        `📄 Fetched "${lowerBrand}" sheets, total rows: ${mergedData.length}`
      );
      return mergedData;
    } catch (error) {
      console.error("❌ Error fetching sheet:", error);
      return [];
    }
  }

  // ------------------ Start voice session ------------------
  async startSession(
    assistantId: string,
    selectedLanguage: LanguageConfig,
    selectedInstructions: string,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    navigate: (path: string) => void,
    voicemode: string
  ): Promise<RTCDataChannel> {
    this.stopSession();
    try {
      const EPHEMERAL_KEY = await this.getEphemeralToken(
        selectedInstructions,
        assistantId,
        voicemode
      );

      const pc = new RTCPeerConnection();
      this.peerConnection = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(this.micStream.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      this.dataChannel = dc;

      dc.addEventListener("open", () => {
        console.log("🟢 Data channel opened");
        this.configureSessionTools();
      });

      this.setupDataChannelHandlers(
        dc,
        onMessage,
        onAssistantSpeaking,
        assistantId
      );
      this.setupSpeechRecognition(selectedLanguage, onMessage);

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

      return dc;
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    }
  }

  private configureSessionTools() {
    if (!this.dataChannel) return;
    const event = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        tools: [
          {
            type: "function",
            name: "getProductDetails",
            description:
              "Fetches the relevant sheet based on user query (brand, model, etc.)",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "User query mentioning brand, price, color, etc.",
                },
              },
              required: ["query"],
            },
          },
        ],
      },
    };
    this.dataChannel.send(JSON.stringify(event));
    console.log("🧩 Registered tool: getProductDetails");
  }

  private async handleToolCall(query: string) {
    console.log("🔹 Tool call triggered with query:", query);

    const lowerQuery = query.toLowerCase();

    // Detect brand from query
    const brands = Object.keys(this.sheetMap);
    const matchedBrand = brands.find((b) => lowerQuery.includes(b)) || "others";

    console.log("🏷️ Matched brand:", matchedBrand);

    // Fetch only that sheet
    const brandData = await this.fetchSheetByBrand(matchedBrand);

    if (!brandData || brandData.length === 0) {
      return { text: `No data found for ${matchedBrand}` };
    }

    // Return full sheet data to assistant
    return { brand: matchedBrand, fullData: brandData };
  }

  // ------------------ Speech recognition ------------------
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
        onMessage({
          role: "user",
          text: transcript,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    };

    recognition.onerror = (e: any) =>
      console.error("Speech recognition error:", e);
    recognition.onend = () => recognition.start();

    recognition.start();
    this.recognition = recognition;
  }

  // ------------------ Data channel handlers ------------------
  private setupDataChannelHandlers(
    dc: RTCDataChannel,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    assistantId: string
  ) {
    let pendingArgs: Record<string, string> = {};

    dc.onmessage = async (e) => {
      try {
        const event = JSON.parse(e.data);

        if (event.type === "response.function_call_arguments.delta") {
          if (!pendingArgs[event.call_id]) pendingArgs[event.call_id] = "";
          pendingArgs[event.call_id] += event.delta;
        }

        if (event.type === "response.function_call_arguments.done") {
          const callId = event.call_id;
          const args = JSON.parse(pendingArgs[callId] || "{}");
          const result = await this.handleToolCall(args.query);

          dc.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: callId,
                output: JSON.stringify(result),
              },
            })
          );
          dc.send(JSON.stringify({ type: "response.create" }));
          delete pendingArgs[callId];
        }
      } catch (err) {
        console.error("Failed to parse assistant message:", err, e.data);
      }
    };
  }

  sendMessage(text: string) {
    if (!this.dataChannel) return;
    this.dataChannel.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      })
    );
    this.dataChannel.send(JSON.stringify({ type: "response.create" }));
  }

  stopSession() {
    console.log("🛑 Stopping voice session...");
    if (this.sessionTimeoutId !== null) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
    if (this.recognition) {
      this.recognition.onend = null; // prevent auto-restart
      this.recognition.stop();
      this.recognition = null;
      console.log("🎙️ Speech recognition stopped");
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => {
        track.stop();
        this.peerConnection?.removeTrack(
          this.peerConnection
            .getSenders()
            .find((sender) => sender.track === track)!
        );
      });
      this.micStream = null;
      console.log("🎧 Microphone stream stopped");
    }
    if (this.dataChannel) {
      if (this.dataChannel.readyState !== "closed") {
        this.dataChannel.close();
        console.log("📡 Data channel closed");
      }
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.close();
      this.peerConnection = null;
      console.log("🔌 Peer connection closed");
    }
    this.fileContent = {};

    console.log("✅ Voice session fully stopped and cleaned up");
  }
}

export const voiceSessionService = new VoiceSessionService(
  "https://docs.google.com/spreadsheets/d/1LOPzkaogUk3VenBt0A3-OiMHNzO8oXoodLkbXgpOeoE"
);
