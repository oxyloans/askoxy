import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../Config";
import ReactMarkdown from "react-markdown";
import MarkdownRenderer from "../GenOxy/components/MarkdownRenderer";
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWindowProps {
  onExternalRequest?: (message: string) => void;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({ onExternalRequest }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Store conversation history for API
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    []
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle external requests from other components
  const handleExternalRequest = async (
    requestMessage: string,
    isAutomatic: boolean = false
  ) => {
    // For automatic requests, don't show as user message, send directly to AI
    if (!isAutomatic) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: requestMessage,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setIsLoading(true);

    // Expand chat if minimized when external request comes
    if (isMinimized) {
      setIsMinimized(false);
    }

    await sendToAPI(requestMessage, isAutomatic);
  };

  // Function to handle automatic page content injection
  const handlePageContentInjection = async (
    pageContent: string,
    pageName: string
  ) => {
    // Add a system message to show page context has been loaded
    const contextMessage: Message = {
      id: Date.now().toString(),
      text: `📄 Page context loaded: ${pageName}`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, contextMessage]);

    // Send page content to AI without showing as user message
    await handleExternalRequest(
      `Context from ${pageName} page: ${pageContent}`,
      true
    );
  };

  // Expose functions to global scope for route-based access
  useEffect(() => {
    // Store the function references globally so other components can access them
    (window as any).sendToAIChat = handleExternalRequest;
    (window as any).injectPageContent = handlePageContentInjection;

    return () => {
      // Cleanup when component unmounts
      delete (window as any).sendToAIChat;
      delete (window as any).injectPageContent;
    };
  }, []);

  const sendToAPI = async (userInput: string, isAutomatic: boolean = false) => {
    try {
      const token = localStorage.getItem("token") || "";

      // Build conversation history including the new message
      const updatedHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: "user", content: userInput },
      ];

      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedHistory),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get response as text since API returns plain text
      const aiResponseText = await response.text();

      // Only show AI response in chat if it's not an automatic context injection
      if (!isAutomatic || aiResponseText.length < 200) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: isAutomatic
            ? `✅ Context processed successfully`
            : aiResponseText.trim(),
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      }

      // Always update conversation history regardless of display
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: aiResponseText.trim() },
      ]);
    } catch (error) {
      console.error("Error sending message to AI:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    const messageToSend = inputText;
    setInputText("");
    setIsLoading(true);

    await sendToAPI(messageToSend, false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setConversationHistory([]);
  };

return (
  <div
    className={`fixed right-2 top-20 bottom-4 w-full max-w-xs sm:max-w-sm md:w-72 bg-white shadow-lg rounded-md border z-50 flex flex-col transition-all duration-300 ${
      isMinimized ? "h-16" : "h-[90%]"
    }`}
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white px-3 py-2 rounded-t-md flex items-center justify-between shadow">
      <h3 className="font-semibold text-sm">ASKOXY.AI</h3>
      <button
        onClick={clearConversation}
        className="hover:bg-purple-700 p-1 rounded transition"
        title="Clear conversation"
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
    </div>

    {/* Content area with messages and input bar */}
    {!isMinimized && (
      <>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-snug ${
                  message.isUser
                    ? "bg-gray-50 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                 <MarkdownRenderer content={message.text} />

                {/* <span className="text-[10px] opacity-70 mt-1 block text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span> */}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 p-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-700 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed bottom input bar */}
        <div className="p-4 border-t bg-white">
          <div className="relative w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
              placeholder="Type your message..."
              className="w-full pr-10 pl-4 py-2 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isLoading}
            />
            <button
              onClick={(e) => handleSendMessage(e as any)}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
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
      </>
    )}
  </div>
);


};

export default AIChatWindow;