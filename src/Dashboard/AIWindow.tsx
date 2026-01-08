import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Sparkles, Phone, PhoneOff, MessageSquare } from "lucide-react";
import BASE_URL from "../Config";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const parseMarkdown = (text: string) => {
  if (!text) return "";

  text = text.replace(/\?(\d)/g, "₹$1");
  text = text.replace(/\u2019|\u2018|\u201A|\u2032|\u2035/g, "'");
  text = text.replace(/([A-Za-z])\?([A-Za-z])/g, "$1'$2");
  text = text.replace(/[\uFFFD\u200B-\u200F\u202A-\u202E]/g, "");
  text = text.replace(/[ \t]+$/gm, "");
  text = text.replace(/^---+$/gm, "");
  text = text.replace(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g, "");
  text = text.replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(.*?)\*(?=[^*]|$)/g, "$1<em>$2</em>")
    .replace(
      /```([\s\S]*?)```/g,
      (_, code) =>
        `<pre class="p-3 bg-gray-100 rounded-md text-sm overflow-x-auto"><code>${code.trim()}</code></pre>`
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="px-2 py-1 bg-gray-100 rounded text-sm">$1</code>'
    )
    .replace(
      /^#### (.*)$/gim,
      '<h4 class="text-base font-semibold mt-3 mb-1">$1</h4>'
    )
    .replace(
      /^### (.*)$/gim,
      '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
    )
    .replace(
      /^## (.*)$/gim,
      '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
    )
    .replace(/^# (.*)$/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

  html = html.replace(/([^\n])\n([^\n])/g, "$1<br>$2");
  html = html.replace(/(<br>\s*){2,}/g, "<br>");

  return html.trim();
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

interface AIChatWindowProps {
  botName?: string;
  isMobile?: boolean;
  onClose?: () => void;
  onExternalRequest?: (message: string) => void;
  persistedMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({
  botName = "ASKOXY.AI",
  isMobile = false,
  onClose,
  onExternalRequest,
  persistedMessages = [],
  onMessagesChange,
}) => {
  const getUserId = () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return null;
      }
      return userId;
    } catch (error) {
      console.error("Error reading userId from localStorage:", error);
      return null;
    }
  };

  const [mode, setMode] = useState<"text" | "voice">("text");
  const [messages, setMessages] = useState<Message[]>(persistedMessages);
  const [loadingText, setLoadingText] = useState("Thinking");
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const bufferRef = useRef<string>("");
  const navigate = useNavigate();

  const injectRealtimeTools = (instructions: string) => {
    if (!dataChannelRef.current) return;

    const event = {
      type: "session.update",
      session: {
        instructions,
        modalities: ["text", "audio"],
        tool_choice: "auto",
        tools: [
          {
            type: "function",
            name: "get_detailed_info",
            description:
              "Fetch user-specific or platform-related information such as orders, offers, gold prices, products, services, AI agents, or account details.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
          {
            type: "function",
            name: "raise_query",
            description: "Raises a support query.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
        ],
      },
    };

    dataChannelRef.current.send(JSON.stringify(event));
    console.log("✅ Realtime tools registered");
  };

  // Voice session functions
  const getEphemeralToken = useCallback(
    async (
      instructions: string,
      assistantId: string,
      voicemode: string
    ): Promise<string> => {
      try {
        const res = await fetch(
          `${BASE_URL}/student-service/user/token?assistantId=${""}&voicemode=${voicemode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
    },
    []
  );

  const handleRaisequery = useCallback(
    async (_callId: string, query: string) => {
      const userId = getUserId();
      if (!userId) {
        return { error: "User not logged in" };
      }
      const profileRaw = localStorage.getItem("profileData");
      if (!profileRaw) {
        message.error("Please complete your profile");
        navigate("/main/profile");
        return { error: "Profile data missing" };
      }

      let profile: any;
      try {
        profile = JSON.parse(profileRaw);
      } catch {
        message.error("Please complete your profile");
        navigate("/main/profile");
        return { error: "Invalid profile data" };
      }

      const firstName = profile.userFirstName?.trim() || "";
      const lastName = profile.userLastName?.trim() || "";
      const email = profile.customerEmail?.trim() || null;

      const userName = `${firstName} ${lastName}`.trim();

      const mobileNumber =
        localStorage.getItem("whatsappNumber")?.trim() ||
        localStorage.getItem("mobileNumber")?.trim() ||
        null;

      if (!userName || !email) {
        message.error("Please complete your profile");
        navigate("/main/profile");
        return { error: "Incomplete profile" };
      }

      const payload = {
        email,
        mobileNumber,
        queryStatus: "PENDING",
        projectType: "ASKOXY",
        askOxyOfers: "FREESAMPLE",
        adminDocumentId: "",
        comments: "",
        id: "",
        resolvedBy: "",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        query,
        userId,
      };
      console.log(payload);

      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${BASE_URL}/user-service/write/saveData`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data
          ? {
              success: true,
              message:
                "Your query has been raised successfully. Our support team will contact you soon.",
            }
          : { error: "Failed to raise query" };
      } catch (err) {
        console.error("Error raising query:", err);
        return {
          error:
            "Something went wrong while raising your query. Please try again.",
        };
      }
    },
    []
  );

  const handleToolCall = useCallback(
    async (_callId: string, query: string, _assistantId: string) => {
      const userId = getUserId();
      if (!userId) {
        return { error: "User not found" };
      }

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${BASE_URL}/ai-service/chat1?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: query }),
      });

      const text = await res.text();

      // 🔥 IMPORTANT: return plain text or structured object
      return {
        success: true,
        data: text,
      };
    },
    []
  );

  const setupDataChannelHandlers = useCallback(
    (
      dc: RTCDataChannel,
      onMessage: (message: ChatMessage) => void,
      onAssistantSpeaking: (speaking: boolean) => void,
      assistantId: string,
      selectedInstructions: string
    ) => {
      const pendingArgs: Record<string, string> = {};

      dc.onmessage = async (e) => {
        try {
          const event = JSON.parse(e.data);

          // Session started
          if (event.status === "session_started") {
            console.log("✅ Realtime session started");
            return;
          }

          // Assistant text streaming
          if (event.type === "response.output_text.delta" && event.delta) {
            bufferRef.current += event.delta;
            onAssistantSpeaking(true);
            onMessage({
              role: "assistant",
              text: bufferRef.current,
              timestamp: new Date().toLocaleTimeString(),
            });
            return;
          }

          if (event.type === "response.stop") {
            bufferRef.current = "";
            onAssistantSpeaking(false);
            return;
          }

          // 🔥 FUNCTION CALL ARGUMENTS (STREAMING)
          if (event.type === "response.function_call_arguments.delta") {
            if (!pendingArgs[event.call_id]) {
              pendingArgs[event.call_id] = "";
            }
            pendingArgs[event.call_id] += event.delta;
            return;
          }

          // 🔥 FUNCTION CALL COMPLETE
          if (event.type === "response.function_call_arguments.done") {
            const callId = event.call_id;
            const args = JSON.parse(pendingArgs[callId] || "{}");

            console.log("🛠 Realtime tool called:", event.name);
            console.log("tool called with args :", args);

            let result: any = {};

            if (event.name === "get_detailed_info") {
              result = await handleToolCall(callId, args.query, assistantId);
            }

            if (event.name === "raise_query") {
              result = await handleRaisequery(callId, args.query);
            }

            // 🔥 Send tool output back to Realtime
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

            // 🔁 Ask model to continue
            dc.send(JSON.stringify({ type: "response.create" }));

            delete pendingArgs[callId];
            return;
          }
        } catch (err) {
          console.error("❌ Failed to parse Realtime event:", err, e.data);
        }
      };

      dc.onopen = () => {
        console.log("Voice channel opened ✅");

        // Register tools FIRST
        injectRealtimeTools(selectedInstructions);

        // Then allow model to respond
        setTimeout(() => {
          dc.send(JSON.stringify({ type: "response.create" }));
        }, 300);
      };
    },
    [handleToolCall]
  );

  const startVoiceSession = useCallback(
    async (
      assistantId: string,
      selectedInstructions: string,
      onMessage: (message: ChatMessage) => void,
      onAssistantSpeaking: (speaking: boolean) => void,
      voicemode: string
    ): Promise<void> => {
      try {
        const EPHEMERAL_KEY = await getEphemeralToken(
          selectedInstructions,
          assistantId,
          voicemode
        );

        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0];
        };

        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        pc.addTrack(micStreamRef.current.getTracks()[0]);

        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;

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

        setupDataChannelHandlers(
          dc,
          onMessage,
          onAssistantSpeaking,
          assistantId,
          selectedInstructions
        );
      } catch (error) {
        console.error("Failed to start voice session:", error);
        throw error;
      }
    },
    [getEphemeralToken, setupDataChannelHandlers]
  );

  const sendVoiceMessage = useCallback((text: string) => {
    if (!dataChannelRef.current) return;
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };
    dataChannelRef.current.send(JSON.stringify(event));
    dataChannelRef.current.send(JSON.stringify({ type: "response.create" }));
  }, []);

  const stopVoiceSession = useCallback(() => {
    dataChannelRef.current?.close();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    dataChannelRef.current = null;
    micStreamRef.current = null;
    peerConnectionRef.current = null;
    bufferRef.current = "";
  }, []);

  useEffect(() => {
    return () => {
      if (isVoiceCallActive) {
        stopVoiceSession();
      }
    };
  }, [isVoiceCallActive, stopVoiceSession]);

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const welcomeQuestions = [
    "Show today's rice and grocery offers", //---
    "Which rice varieties are trending now?",
    "Check today's gold prices",
    "Explain what AskOxy.ai can do",
    "How can I create my own AI agent?",
    "Track my recent order",
    "What payment methods are available?",
    "What is BMV coin and how can I use it?",
    "What are the benefits of AI agents?",
  ];

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!isLoading) return;

    const loadingStates = [
      "Thinking",
      "Analyzing",
      "Processing",
      "Digging deeper",
      "Getting response",
      "Almost there",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingStates.length;
      setLoadingText(loadingStates[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handleExternalRequest = (event: CustomEvent) => {
      const { message } = event.detail;
      if (message) {
        processExternalMessage(message);
      }
    };

    window.addEventListener(
      "aiChatExternalRequest",
      handleExternalRequest as EventListener
    );

    return () => {
      window.removeEventListener(
        "aiChatExternalRequest",
        handleExternalRequest as EventListener
      );
    };
  }, []);

  const processExternalMessage = (message: string) => {
    const externalMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, externalMessage]);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => {
      processUserMessage(message);
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    await processUserMessage(currentInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const processUserMessage = async (userInput: string) => {
    try {
      setIsLoading(true);

      const userId = getUserId();

      if (!userId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "Error: User ID not found. Please log in again.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/ai-service/chat1?userId=${userId}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: userInput }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const aiResponse = await response.text();
      // console.log("AI Response received:", aiResponse);

      if (!aiResponse || aiResponse.trim() === "") {
        throw new Error("Empty response from API");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: aiResponse.trim(),
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Processing error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      setShowMicPermissionModal(true);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + " ";
        }
      }

      if (transcript.trim()) {
        setInputText((prev) => (prev.trim() + " " + transcript.trim()).trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Voice recognition error:", event.error);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      setIsRecording(false);
    }
  };

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  };

  const handleStartVoiceCall = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      setShowMicPermissionModal(true);
      return;
    }

    try {
      setIsVoiceCallActive(true);
      setVoiceTranscript("");
      setMode("voice");

      const onVoiceMessage = (msg: ChatMessage) => {
        if (msg.role === "user") {
          setVoiceTranscript(msg.text);
          const userMessage: Message = {
            id: Date.now().toString(),
            text: msg.text,
            isUser: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMessage]);
        } else {
          const aiMessage: Message = {
            id: Date.now().toString(),
            text: msg.text,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      };

      await startVoiceSession(
        "",
        `You are the ASKOXY.AI Voice Assistant.

  SCOPE (MANDATORY):
  Answer ONLY questions related to ASKOXY.AI, its platform, features, services, marketplace offerings, AI agents, and capabilities.
  Do NOT respond to topics unrelated to ASKOXY.AI.
  Do NOT suggest that ASKOXY.AI runs, manages, or owns users’ businesses.

 LANGUAGE & VOICE HANDLING (STRICT):

• English is the default language. Start conversations in English whenever possible.
• If the user speaks in Telugu or Hindi, detect the language and respond in the same language.
• Once detected, lock the response language for that user input.
• Do NOT switch or mix languages in the same response.
• Change language only if the user clearly speaks a different language again.
• Respond ONLY in Telugu, English, or Hindi.
• If the user speaks in any other language, respond politely:
“Sorry, I can assist only in English, Hindi, or Telugu.”
• Ignore background noise, silence, and unclear sounds.
• Do NOT guess or respond to unclear or incomplete speech.
• If the user’s voice is not clear, politely ask them to repeat in the same detected language.

  VOICE STYLE:
  This is a voice-first assistant.
  • Keep responses short, clear, natural, polite, and conversational.
  • Avoid long explanations unless explicitly asked.
  • If a request is unclear or incomplete, ask simple follow-up questions before proceeding.

  ABOUT ASKOXY.AI :
  ASKOXY.AI is an AI-Z marketplace and AI enablement platform.

  ASKOXY.AI provides:
  • A marketplace to sell products such as rice, groceries, gold, and silver
  • Services including study-abroad support, job opportunities, and free AI learning resources
  • A platform where users can create AI agents for personal and business needs

  ASKOXY.AI does NOT run or manage users’ businesses.
  It enables individuals and businesses to build and use AI agents based on their own data, services, and requirements.

  The core foundation of ASKOXY.AI is the Bharath AI Store, which allows users to create, configure, and manage AI agents for automation, support, and information delivery. Explain this clearly when asked.

  TOOL CALLING RULES (CRITICAL — NO EXCEPTIONS):
  For ANY request related to:
  • user data
  • orders
  • offers
  • gold prices
  • products
  • services
  • AI agents
  • account information

  YOU MUST call the get_detailed_info function.
  • Do NOT answer from memory and don't Guess
  • Do NOT respond before the function call
  • Always wait for the function result before replying

  REAL-TIME DATA :
  Whenever a user asks any questions related to products or items (including item details, price, availability, offers, specifications), you must call the get_detailed_info function to fetch the information.

  SUPPORT & QUERY RAISING (SIMPLIFIED FLOW):
  If the user asks for help, support, complaint, or says they want to raise a query:
  • Ask the user to explain the issue clearly in their own words
  • Accept the explanation in Telugu, English, or Hindi
  • If needed, internally convert the issue to English
  • YOU MUST call the raise_query function using ONLY the detailed issue text
  • After the function completes, politely confirm that the query has been raised

  IMPORTANT BEHAVIOR RULES:
  • Never mention APIs, tools, functions, or technical processes
  • Maintain a calm, helpful, and reassuring tone at all times
  • Encourage users to ask questions or raise queries whenever needed
  `,
        onVoiceMessage,
        setIsAssistantSpeaking,
        "alloy"
      );
    } catch (error) {
      console.error("Failed to start voice call:", error);
      message.error(
        "Failed to start voice call. Please check your microphone permissions."
      );
      setIsVoiceCallActive(false);
      setMode("text");
    }
  };

  const handleEndVoiceCall = () => {
    stopVoiceSession();
    setIsVoiceCallActive(false);
    setIsAssistantSpeaking(false);
    setVoiceTranscript("");
    setMode("text");
  };

  const clearChat = () => {
    setMessages([]);
    if (onMessagesChange) {
      onMessagesChange([]);
    }
  };

  const EnhancedLoadingAnimation = () => (
    <div className="flex items-center space-x-2">
      <div
        className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "0.6s" }}
      ></div>
      <div
        className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms", animationDuration: "0.6s" }}
      ></div>
      <div
        className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms", animationDuration: "0.6s" }}
      ></div>
    </div>
  );

  const VoiceCallInterface = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${
              isAssistantSpeaking
                ? "bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse"
                : "bg-gradient-to-br from-purple-600 to-indigo-600"
            } shadow-2xl transition-all duration-300`}
          >
            <Phone className="w-16 h-16 text-white" />
          </div>
          {isAssistantSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Voice Call Active
          </h3>
          <p className="text-gray-600 mt-2">
            {isAssistantSpeaking
              ? "🔊 Assistant is speaking..."
              : "🎤 Listening..."}
          </p>
        </div>

        {voiceTranscript && (
          <div className="bg-white rounded-lg p-4 shadow-md max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-1">You said:</p>
            <p className="text-gray-800">{voiceTranscript}</p>
          </div>
        )}

        <button
          onClick={handleEndVoiceCall}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full shadow-lg transition-all flex items-center space-x-2 mx-auto active:scale-95"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Call</span>
        </button>

        <p className="text-sm text-gray-500 mt-4">
          💡 Speak naturally - the assistant will respond with voice
        </p>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col p-2 overflow-hidden">
      <div className="text-center mb-4 flex-shrink-0">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to {botName}
        </h3>
        <p className="text-base text-gray-600 mb-4">
          How can I assist you today? Choose a quick question or type your own.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              if (isVoiceCallActive) {
                handleEndVoiceCall();
              }
              setMode("text");
            }}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
              mode === "text"
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Text Chat</span>
          </button>

          <button
            onClick={handleStartVoiceCall}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
              mode === "voice"
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Phone className="w-5 h-5" />
            <span>Voice Call</span>
          </button>
        </div>
      </div>

      {mode === "text" && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
          <div className="w-full max-w-5xl mx-auto">
            <p className="text-sm text-gray-500 font-semibold mb-4 sticky bg-white z-10">
              Quick Questions:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {welcomeQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(question);
                    const userMessage: Message = {
                      id: Date.now().toString(),
                      text: question,
                      isUser: true,
                      timestamp: new Date(),
                    };
                    setMessages([userMessage]);
                    setInputText("");
                    setIsLoading(true);
                    processUserMessage(question);
                  }}
                  className="text-left px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 border border-purple-200 hover:border-purple-400 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span className="text-sm font-medium text-gray-700 line-clamp-2">
                    {question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const mobileStyles = isMobile
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100vh",
        zIndex: 50,
        borderRadius: 0,
      }
    : {};

  const MicrophonePermissionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Microphone Permission Required
          </h3>
          <p className="text-gray-600 mb-6">
            To use voice features, please allow microphone access in your
            browser settings and try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ audio: true });
                  setShowMicPermissionModal(false);
                  handleStartVoiceCall();
                } catch (error) {
                  console.error("Permission denied:", error);
                }
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Give Permission
            </button>
            <button
              onClick={() => setShowMicPermissionModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const containerClass = isMobile
    ? `fixed inset-0 w-full h-full bg-white flex flex-col z-50`
    : `w-full h-full bg-white shadow-2xl rounded-l-lg border-l border-t border-b border-purple-200 flex flex-col overflow-hidden`;

  return (
    <>
      {showMicPermissionModal && <MicrophonePermissionModal />}
      <div className={containerClass} style={isMobile ? mobileStyles : {}}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white px-4 py-3 shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <Sparkles className="w-6 h-6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base">{botName}</h3>
                <p className="text-xs text-purple-200">
                  {isVoiceCallActive
                    ? "🎙️ Voice Call Active"
                    : "Always here to help"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isVoiceCallActive && (
                <>
                  <button
                    onClick={handleStartVoiceCall}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title="Start Voice Call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title="Clear Chat"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
              {onClose && (
                <button
                  onClick={() => {
                    if (isVoiceCallActive) {
                      handleEndVoiceCall();
                    }
                    clearChat();
                    onClose();
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  title="Close Chat"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        {isVoiceCallActive ? (
          <VoiceCallInterface />
        ) : messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm ${
                      msg.isUser
                        ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    } ${isMobile ? "text-base" : "text-sm"}`}
                  >
                    {msg.isUser ? (
                      <p className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </p>
                    ) : (
                      <div
                        className="whitespace-pre-wrap break-words leading-relaxed markdown-content"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(msg.text),
                        }}
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      isMobile ? "text-xs" : "text-[11px]"
                    } text-gray-400 mt-1.5 px-2 ${
                      msg.isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-col">
                  <div className="px-2">
                    <EnhancedLoadingAnimation />
                  </div>
                  <div
                    className={`${
                      isMobile ? "text-m" : "text-[11px]"
                    } text-purple-600 font-medium mt-1.5 px-2 animate-pulse`}
                  >
                    {loadingText}...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        )}

        {/* Input Area */}
        {!isVoiceCallActive && (
          <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-3 flex-shrink-0 shadow-lg">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 border-2 border-gray-300 px-4 py-3 ${
                isMobile ? "text-base min-h-[44px]" : "text-sm"
              } rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button
              onClick={handleToggleVoice}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
                isRecording
                  ? "bg-red-100 text-red-600 animate-pulse ring-2 ring-red-300"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
              title={isRecording ? "Stop Voice Input" : "Start Voice Input"}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white flex-shrink-0 ${
                isMobile ? "p-3 min-h-[44px] min-w-[44px]" : "px-5 py-3"
              } rounded-xl disabled:from-gray-400 disabled:to-gray-400 hover:from-purple-700 hover:to-purple-800 active:scale-95 transition-all shadow-md flex items-center justify-center`}
              disabled={isLoading || !inputText.trim()}
              title="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AIChatWindow;
