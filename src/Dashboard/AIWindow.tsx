import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";
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
  // Keep ONE blank line (for paragraph separation)
  text = text.replace(/\n{3,}/g, "\n\n");

  // ≠ DO NOT remove ALL blank lines
  // ≠ DO NOT replace \n with <br> globally (breaks lists/code blocks)

  // 🎯 Handle Markdown formatting into HTML
  let html = text

    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Italic
    .replace(/(^|[^*])\*(.*?)\*(?=[^*]|$)/g, "$1<em>$2</em>")

    // Code block (triple backticks)
    .replace(
      /```([\s\S]*?)```/g,
      (_, code) =>
        `<pre class="p-3 bg-gray-100 rounded-md text-sm overflow-x-auto"><code>${code.trim()}</code></pre>`
    )

    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="px-2 py-1 bg-gray-100 rounded text-sm">$1</code>'
    )

    // Headings
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

  // 🎯 Convert remaining newlines to <br>, BUT safely:
  // ONLY outside lists, code blocks, and paragraphs.
  html = html.replace(/([^\n])\n([^\n])/g, "$1<br>$2");

  // Final cleanup
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
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({
  botName = "ASKOXY.AI",
  isMobile = false,
  onClose,
  onExternalRequest,
}) => {
  // Get userId from localStorage
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
  const [messages, setMessages] = useState<Message[]>([]);

  // Welcome questions that users can click
  const welcomeQuestions = [
    "What products do you have?",
    "What services are available on ASKOXY?",
    "Describe Bharath AI Store in ASKOXY.",
    "Does ASKOXY have jobs or study abroad?",
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
    // Listen for external requests from other pages
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

      // console.log("Sending request with userId:", userId);
      // console.log("User prompt:", userInput);
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
  };

  const ThreeDotsLoading = () => (
    <div className="flex items-center space-x-1">
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Welcome to {botName}! 👋
        </h3>
        <p className="text-sm text-gray-600">How can I assist you today?</p>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <p className="text-xs text-gray-500 font-medium mb-3">
          Quick Questions:
        </p>
        {welcomeQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => {
              setInputText(question);
              // Auto-send the question
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
            className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200 hover:border-purple-300"
          >
            <span className="text-sm text-gray-700">{question}</span>
          </button>
        ))}
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
    ? `fixed inset-0 w-3/4 h-full bg-white flex flex-col z-50`
    : `fixed right-0 top-20 bottom-0 w-full max-w-sm sm:max-w-md md:w-96 bg-white shadow-lg rounded-lg border z-50 flex flex-col transition-all duration-300 overflow-hidden`;

  return (
    <div className={containerClass} style={isMobile ? mobileStyles : {}}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white px-3 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-bold text-sm">{botName}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Clear Chat"
            >
              <svg
                className="w-4 h-4"
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
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Close Chat"
              >
                <svg
                  className="w-4 h-4"
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
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-sm ${msg.isUser ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-2 py-1.5 rounded-lg max-w-[85%] ${
                  msg.isUser
                    ? "bg-purple-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
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
                  isMobile ? "text-xs" : "text-[10px]"
                } text-gray-400 mt-1 ${
                  msg.isUser ? "text-right" : "text-left"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left">
              <div className="inline-block px-2 py-1.5 rounded-lg bg-gray-100">
                <ThreeDotsLoading />
              </div>
              <div
                className={`${
                  isMobile ? "text-xs" : "text-[10px]"
                } text-gray-400 mt-1`}
              >
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-2 border-t flex items-center space-x-2 bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 border border-gray-300 px-3 py-2 sm:px-2 sm:py-1.5 ${
            isMobile ? "text-base min-h-[44px]" : "text-sm"
          } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleToggleVoice}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
            isRecording
              ? "bg-red-100 text-red-600 animate-pulse"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
          title={isRecording ? "Stop Voice Input" : "Start Voice Input"}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={handleSendMessage}
          className={`bg-purple-600 text-white ${
            isMobile ? "p-3 min-h-[44px] min-w-[44px]" : "p-2"
          } rounded-lg disabled:bg-gray-400 hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center justify-center`}
          disabled={isLoading || !inputText.trim()}
          title="Send message"
        >
          <svg
            className="w-4 h-4"
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
