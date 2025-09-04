import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Send, User, Bot, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { message } from "antd";
import {
  getAssistantDetails,
  askAssistant,
} from "../AskoxyAdmin/Assistants/assistantApi";
import BASE_URL from "../Config";

interface Assistant {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AssistantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingAssistant, setIsFetchingAssistant] = useState(true);
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Initialize with empty array
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch assistant details
  useEffect(() => {
    const fetchAssistant = async () => {
      if (!id) return;
      setIsFetchingAssistant(true);
      try {
        const assistantData = await getAssistantDetails(id);
        setAssistant(assistantData);
      } catch (error) {
        message.error("Failed to load assistant details. Please try again.");
        navigate(-1);
      } finally {
        setIsFetchingAssistant(false);
      }
    };
    fetchAssistant();
  }, [id, navigate]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !id) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const assistantResponse = await askAssistant(id, [
        ...messages,
        userMessage,
      ]);
      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Loading State for Assistant Details */}
      {isFetchingAssistant && (
        <div className="flex-1 flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="ml-2 text-gray-600">
            Loading assistant details...
          </span>
        </div>
      )}

      {/* Welcome Message (Centered) */}
      {!isFetchingAssistant && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4 shadow">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to {assistant?.name || "Assistant"}!
            </h2>
            <p className="text-gray-500 mb-4">
              {assistant?.description ||
                "Start chatting to explore how this assistant can help you."}
            </p>
            <p className="text-gray-500 italic">
              Type your question below to get started.
            </p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      {!isFetchingAssistant && messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-md ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                  ) : (
                    <User className="w-5 h-5 text-white mt-1 shrink-0" />
                  )}
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl shadow flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span>Assistant is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
            disabled={loading || isFetchingAssistant}
          />
          <button
            onClick={sendMessage}
            disabled={loading || isFetchingAssistant || !input.trim()}
            className="bg-indigo-600 text-white rounded-lg p-3 hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantDetails;
