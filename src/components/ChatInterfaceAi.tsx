import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Menu,
  X,
  User,
  Crown,
  Briefcase,
  MessageSquare,
  ChevronDown,
  Share2,
  Plus,
} from "lucide-react";
import BASE_URL from "../Config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Role {
  id: "USER" | "CEO" | "PROVIDER";
  name: string;
  icon: React.ReactNode;
  instruction: string;
}

interface Assistant {
  id: string;
  name: string;
  color: string;
}

const ChatInterface: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant>({
    id: "asst_PGnuKq3mSvx96598PTed2XGy",
    name: "IRDAI",
    color: "bg-blue-600",
  });
  const [selectedRole, setSelectedRole] = useState<Role>({
    id: "USER",
    name: "User Guide",
    icon: <User className="w-5 h-5" />,
    instruction:
      "You are a helpful, empathetic, and friendly guide speaking directly to an everyday user.",
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistants: Assistant[] = [
    {
      id: "asst_PGnuKq3mSvx96598PTed2XGy",
      name: "IRDAI",
      color: "bg-blue-600",
    },
    {
      id: "asst_5g20JJbZ88NvcSgNYLMeQTm2",
      name: "HYDTIE",
      color: "bg-purple-600",
    },
  ];

  const roles: Role[] = [
    {
      id: "USER",
      name: "User Guide",
      icon: <User className="w-5 h-5" />,
      instruction: "You are a helpful, empathetic, and friendly guide...",
    },
    {
      id: "CEO",
      name: "CEO Advisor",
      icon: <Crown className="w-5 h-5" />,
      instruction:
        "You are a highly strategic CEO with decades of experience...",
    },
    {
      id: "PROVIDER",
      name: "Service Provider",
      icon: <Briefcase className="w-5 h-5" />,
      instruction: "You are an expert service or product provider...",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const payload = [{ role: "user", content: userMessage.content }];
      const instruction = `hello your name is ${selectedAssistant.name.toLowerCase()} ${
        selectedRole.instruction
      }`;

      const response = await fetch(
        `${BASE_URL}/student-service/user/askquestion?assistantId=${
          selectedAssistant.id
        }&instruction=${encodeURIComponent(instruction)}`,
        {
          method: "POST",
          headers: { accept: "*/*", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.text();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data || "Sorry, I couldn't process your request.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Error: Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setShowRoleDropdown(false);
    setSidebarOpen(false);
    setMessages([]); // new chat when switching assistant
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">AI Chat</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Assistants */}
          <div className="p-4 space-y-2 flex-1 overflow-y-auto">
            <h3 className="text-gray-300 text-sm font-medium mb-2">
              Assistants
            </h3>
            {assistants.map((assistant) => (
              <button
                key={assistant.id}
                onClick={() => selectAssistant(assistant)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                  selectedAssistant.id === assistant.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div
                  className={`w-9 h-9 ${assistant.color} rounded-lg flex items-center justify-center text-white font-bold`}
                >
                  {assistant.name.charAt(0)}
                </div>
                <span className="font-medium">{assistant.name}</span>
              </button>
            ))}
          </div>

          {/* Role Selection */}
          <div className="p-4 border-t border-gray-700">
            <h4 className="text-gray-300 text-sm font-medium mb-2">Role</h4>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              <div className="flex items-center space-x-2">
                {selectedRole.icon}
                <span>{selectedRole.name}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showRoleDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showRoleDropdown && (
              <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => selectRole(role)}
                    className={`w-full flex items-center space-x-2 p-3 hover:bg-gray-700 ${
                      selectedRole.id === role.id ? "bg-gray-700" : ""
                    }`}
                  >
                    {role.icon}
                    <span className="text-white">{role.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div
                className={`w-9 h-9 ${selectedAssistant.color} rounded-lg flex items-center justify-center text-white font-bold`}
              >
                {selectedAssistant.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-semibold">{selectedAssistant.name}</h1>
                <p className="text-sm text-gray-500">{selectedRole.name}</p>
              </div>
            </div>
          </div>

          {/* Right side header actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={startNewChat}
              className="flex items-center space-x-1 px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className={`w-16 h-16 ${selectedAssistant.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3`}
              >
                {selectedAssistant.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome to {selectedAssistant.name}
              </h2>
              <p className="text-gray-600 mb-3">
                I'm your {selectedRole.name}. How can I help you today?
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    message.role === "user"
                      ? `${selectedAssistant.color} text-white ml-auto`
                      : "bg-white text-gray-900 shadow border"
                  }`}
                >
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {message.content}
                  </ReactMarkdown>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow px-4 py-3 rounded-lg text-sm text-gray-500 flex items-center space-x-2">
                <span className="animate-pulse">...</span>
                <span>{selectedAssistant.name} is typing</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto flex items-end space-x-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedAssistant.name}...`}
              className="flex-1 resize-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 text-sm max-h-40"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputValue.trim()}
              className={`p-3 rounded-lg ${selectedAssistant.color} text-white hover:opacity-80 disabled:opacity-50`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
