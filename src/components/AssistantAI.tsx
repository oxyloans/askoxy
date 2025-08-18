import React, { useState, useRef, useEffect } from "react";
import { message as antdMessage } from "antd";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { Mic } from "lucide-react";

// New API endpoint
const CHAT_API = `${BASE_URL}/student-service/user/askquestion`;

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWindowProps {
  botName?: string;
  language?: string;
  isMobile?: boolean;
  assistantId: string; // Add assistantId prop
  onClose?: () => void;
  onExternalRequest?: (message: string) => void;
}

const AssistantAI: React.FC<AIChatWindowProps> = ({
  botName = "ASKOXY.AI",
  isMobile = false,
  assistantId, // Get assistantId from props
  onClose,
  onExternalRequest,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm ${botName}. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    []
  );
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const processUserMessage = async (userInput: string) => {
    try {
      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: "user" as const, content: userInput },
      ];

      const response = await fetch(`${CHAT_API}?assistantId=${assistantId}`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedHistory),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Get response as string
      const aiResponse = await response.text();

      // Update conversation history with both user question and assistant response
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: aiResponse },
      ]);

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Processing error:", err);
      antdMessage.error("Failed to process your request.");

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    // Check if SpeechRecognition API is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      antdMessage.error("Speech Recognition is not supported in this browser.");
      return;
    }

    // If already recording, stop the recognition
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      recognitionRef.current = null;
      return;
    }

    // Initialize new speech recognition instance
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    // Handle start of voice recording
    recognition.onstart = () => {
      console.log("🎙️ Voice recording started...");
      setIsRecording(true);
      antdMessage.info("Voice input started...");
    };

    // Handle speech recognition results
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

    // Handle speech recognition errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("❌ Voice recognition error:", event.error);
      antdMessage.error(`Voice input failed: ${event.error}`);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    // Handle end of speech recognition
    recognition.onend = () => {
      console.log("🛑 Voice recognition stopped.");
      setIsRecording(false);
      recognitionRef.current = null;
      if (inputText.trim()) {
        handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
      }
    };

    // Start speech recognition
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      antdMessage.error("Failed to start voice input.");
      setIsRecording(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: `Hello! I'm ${botName}. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setConversationHistory([]);
    antdMessage.success("Chat cleared successfully!");
  };

  // Three dots loading component
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

  // Mobile styles
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
    : `fixed right-0 top-20 bottom-0 w-full max-w-xs sm:max-w-sm md:w-72 bg-white shadow-lg rounded-lg border z-50 flex flex-col transition-all duration-300 overflow-hidden`;

  return (
    <div className={containerClass} style={isMobile ? mobileStyles : {}}>
      <div
        className={`bg-gradient-to-r from-purple-700 to-purple-600 text-white px-3 py-2 shadow-md ${
          isMobile ? "" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-bold text-sm">{botName}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {/* Clear Chat Button */}
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
            {/* Close Button (only on mobile) */}
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
              <p className="whitespace-pre-wrap break-words leading-relaxed">
                {msg.text}
              </p>
            </div>
            <div
              className={`${
                isMobile ? "text-xs" : "text-[10px]"
              } text-gray-400 mt-1 ${msg.isUser ? "text-right" : "text-left"}`}
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
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-2 border-t flex items-center space-x-2 bg-white"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`flex-1 border border-gray-300 px-3 py-2 sm:px-2 sm:py-1.5 ${
            isMobile ? "text-base min-h-[44px]" : "text-sm"
          } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="button"
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
          type="submit"
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
      </form>
    </div>
  );
};

export default AssistantAI;
