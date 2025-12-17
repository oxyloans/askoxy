import React, { useState, useRef, useEffect } from "react";
import { Mic, Sparkles } from "lucide-react";
import BASE_URL from "../Config";

const parseMarkdown = (text: string) => {
  if (!text) return "";

  // 1️⃣ Fix corrupted rupee symbols
  text = text.replace(/\?(\d)/g, "₹$1");

  // 2️⃣ Fix corrupted apostrophes like Here?s
  text = text.replace(/\u2019|\u2018|\u201A|\u2032|\u2035/g, "'");
  text = text.replace(/([A-Za-z])\?([A-Za-z])/g, "$1'$2");

  // 3️⃣ Remove invisible Unicode causing ??
  text = text.replace(/[\uFFFD\u200B-\u200F\u202A-\u202E]/g, "");

  // 4️⃣ Remove trailing spaces
  text = text.replace(/[ \t]+$/gm, "");

  // 5️⃣ Remove horizontal rules (---)
  text = text.replace(/^---+$/gm, "");

  // 6️⃣ Remove images completely
  text = text.replace(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g, "");
  text = text.replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "");

  // 7️⃣ Normalize blank lines:
  text = text.replace(/\n{3,}/g, "\n\n");

  // 🎯 Handle Markdown formatting into HTML
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

  const [messages, setMessages] = useState<Message[]>(persistedMessages);
  const [loadingText, setLoadingText] = useState("Thinking");

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const welcomeQuestions = [
    "Show today’s rice and grocery offers",
    "Which rice varieties are trending now?",
    "Check today’s gold prices",
    "Show gold offers and investment options",
    "Show the best product offers today",
    "Recommend products based on my needs",
    "Explain what AskOxy.ai can do",
    "What is Bharat AI Store?",
    "Show available AI agents",
    "How can I create my own AI agent?",
    "Show my AI agents",
    "Track my recent order",
    "What payment methods are available?",
    "What are the membership benefits?",
    "What is BMV coin and how can I use it?",
  ];

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  // Animated loading text effect
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
      console.log("AI Response received:", aiResponse);

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

  const handleToggleVoice = () => {
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
  const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="text-center mb-6 flex-shrink-0">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to {botName}!
        </h3>
        <p className="text-base text-gray-600">
          How can I assist you today? Choose a quick question or type your own.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
        <div className="w-full max-w-5xl mx-auto pb-4">
          <p className="text-sm text-gray-500 font-semibold mb-4 sticky top-0 bg-white py-2 z-10">
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

  const containerClass = isMobile
    ? `fixed inset-0 w-full h-full bg-white flex flex-col z-50`
    : `w-full h-full bg-white shadow-2xl rounded-l-lg border-l border-t border-b border-purple-200 flex flex-col overflow-hidden`;

  return (
    <div className={containerClass} style={isMobile ? mobileStyles : {}}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white px-4 py-3 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <Sparkles className="w-6 h-6" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base">{botName}</h3>
              <p className="text-xs text-purple-200">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
            {onClose && (
              <button
                onClick={onClose}
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
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
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
    </div>
  );
};

export default AIChatWindow;
