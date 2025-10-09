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

  private fileUrl: string | null = null;
  private fileContent: any[] | null = null;
  private dataUploaded: boolean = false;

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

  public async fetchFileContent(): Promise<any[]> {
    if (!this.fileUrl) return [];

    // Your sheet GIDs
    const sheetGIDs = [
      "0",
      "1427934623",
      "1411153632",
      "1170071782",
      "1461294814",
      "374851585",
      "1266860599",
      "868260221",
      "1286876298",
      "1244878989",
    ];

    try {
      const spreadsheetIdMatch = this.fileUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!spreadsheetIdMatch) throw new Error("Invalid Google Sheet URL");
      const spreadsheetId = spreadsheetIdMatch[1];

      const allData: any[] = [];

      for (const gid of sheetGIDs) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
        const res = await fetch(csvUrl);
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        allData.push(...(parsed.data as any[]));
      }

      this.fileContent = allData;
      console.log("📄 Fetched all sheets data:", this.fileContent);
      return this.fileContent;
    } catch (err) {
      console.error("Error fetching sheets:", err);
      return [];
    }
  }

  async startSession(
    assistantId: string,
    selectedLanguage: LanguageConfig,
    selectedInstructions: string,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    navigate: (path: string) => void,
    voicemode: string
  ): Promise<RTCDataChannel> {
    try {
      const EPHEMERAL_KEY = await this.getEphemeralToken(
        selectedInstructions,
        assistantId,
        voicemode
      );

      const pc = new RTCPeerConnection();
      this.peerConnection = pc;

      // 🔊 Incoming audio from assistant
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

      // 🎙️ Microphone input
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(this.micStream.getTracks()[0]);

      // 📡 Data channel for tool calls and events
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

      // Create and send SDP offer
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

      // Preload file data
      if (!this.fileContent && this.fileUrl) {
        await this.fetchFileContent();
      }

      return dc;
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    }
  }

  // -------------------- Configure single tool --------------------
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
              "Retrieves product details from uploaded CSV file by name",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Product name or keyword to search in CSV file",
                },
              },
              required: ["query"],
            },
          },
        ],
      },
    };
    this.dataChannel.send(JSON.stringify(event));
    console.log("🧩 Registered single tool: getProductDetails");
  }

  // -------------------- Speech recognition --------------------
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

  // -------------------- Handle assistant messages --------------------
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

        // 🧩 Function call argument chunks
        if (event.type === "response.function_call_arguments.delta") {
          if (!pendingArgs[event.call_id]) pendingArgs[event.call_id] = "";
          pendingArgs[event.call_id] += event.delta;
        }

        // ✅ Complete function call
        if (event.type === "response.function_call_arguments.done") {
          const callId = event.call_id;
          const responseId = event.response_id;
          const fnName = event.name || "getProductDetails";

          console.log(`📞 Function call received: ${fnName}`);

          const args = JSON.parse(pendingArgs[callId] || "{}");
          console.log("🔧 Arguments parsed:", args);

          const result = await this.handleToolCall(args.query);

          // Send result back to assistant
          const outputEvent = {
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: callId,
              output: JSON.stringify(result),
            },
          };

          dc.send(JSON.stringify(outputEvent));
          dc.send(JSON.stringify({ type: "response.create" }));

          delete pendingArgs[callId];
        }
      } catch (err) {
        console.error("Failed to parse assistant message:", err, e.data);
      }
    };
  }

  private async handleToolCall(query: string) {
    console.log("🔹 Tool call triggered with query:", query);

    try {
      if (!this.fileContent || this.fileContent.length === 0) {
        await this.fetchFileContent();
      }

      const normalizedQuery = query.toLowerCase().trim();
      const queryWords = normalizedQuery.split(/\s+/);
      const brandAliases: Record<string, string[]> = {
        lenovo: ["len", "lenovo"],
        dell: ["dell"],
        hp: ["hp", "hewlett-packard"],
        acer: ["acer"],
        samsung: ["samsung", "sam"],
        oppo: ["oppo"],
        motorola: ["motorola", "moto"],
        apple: ["apple", "iphone"],
        vivo: ["vivo"],
      };

      const commonWords = [
        "mobile",
        "mobiles",
        "phone",
        "phones",
        "smartphone",
        "smartphones",
        "look",
        "for",
        "find",
        "show",
      ];

      // All columns that may contain product info

      const filteredQueryWords = queryWords.filter(
        (word) => !commonWords.includes(word)
      );
      // Convert user query words to full brand names if they match an alias
      const normalizeBrand = (word: string): string => {
        word = word.toLowerCase();
        for (const [brand, aliases] of Object.entries(brandAliases)) {
          if (aliases.includes(word)) return brand;
        }
        return word;
      };

      const normalizedQueryWords = filteredQueryWords.map(normalizeBrand);

      const matches =
        this.fileContent?.filter((row) => {
          const combinedText = Object.values(row)
            .map((v) => v?.toString().toLowerCase() || "")
            .join(" ");

          if (!combinedText.trim()) return false;

          // Check if all normalized query words exist in combined text (partial match)
          return normalizedQueryWords.every((word) => {
            const rowWords = combinedText.split(/\s+/);
            return rowWords.some((rw) => rw.includes(word));
          });
        }) || [];

      const topMatches = matches.slice(0, 10);

      if (topMatches.length === 0) {
        console.log("⚠️ No matching products found");
        return { text: "Product not available" };
      }

      console.log("✅ Matching products found:", topMatches);
      return { products: topMatches };
    } catch (error) {
      console.error("❌ Error handling tool call:", error);
      return { text: "Error occurred while fetching product details" };
    }
  }

  // -------------------- Send user text --------------------
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

  // -------------------- Stop session --------------------
  stopSession() {
    if (this.sessionTimeoutId !== null) clearTimeout(this.sessionTimeoutId);
    this.dataChannel?.close();
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.peerConnection?.close();
    (this.recognition as any)?.stop();
    this.dataChannel = null;
    this.micStream = null;
    this.peerConnection = null;
    this.recognition = null;
    this.dataUploaded = false;
  }
}

export const voiceSessionService = new VoiceSessionService(
  "https://docs.google.com/spreadsheets/d/1LOPzkaogUk3VenBt0A3-OiMHNzO8oXoodLkbXgpOeoE/export?format=csv"
);
