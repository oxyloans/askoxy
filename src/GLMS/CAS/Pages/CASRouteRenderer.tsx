import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { useCaseRoutes } from "../Routes/useCaseRoutes";
import Askoxylogo from "../../../assets/img/askoxylogoblack.png";
import {
  Menu,
  X,
  Send,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
  Copy,
  RotateCcw,
} from "react-feather";
import ReactMarkdown from "react-markdown";
import BASE_URL from "../../../Config";

interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
  timestamp?: Date;
  sender?: "user" | "ai";
  text?: string;
  id?: string;
}

const CASRouteRenderer: React.FC = () => {
  const { useCaseId, type } = useParams<{ useCaseId: string; type: string }>();
  const useCase = useCaseRoutes[useCaseId || ""];
  const navigate = useNavigate();

  // Chat state
  const [chatOpen, setChatOpen] = useState(false); // Changed to closed by default for better UX
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState(false);
  const [questionSelected, setQuestionSelected] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Enhanced predefined questions with icons
  const predefinedQuestions = [
    {
      text: `What are the key features of ${
        useCase?.title || "this use case"
      }?`,
      icon: "🎯",
      category: "Features",
    },
    {
      text: `How does ${useCase?.title || "this use case"} benefit ${
        type === "business" ? "businesses" : "systems"
      }?`,
      icon: "💼",
      category: "Benefits",
    },
    {
      text: `Can you explain how ${useCase?.title || "this use case"} works?`,
      icon: "⚙️",
      category: "Process",
    },
    {
      text: `What makes ${
        useCase?.title || "this use case"
      } unique in the market?`,
      icon: "✨",
      category: "Uniqueness",
    },
  ];

  // Function to limit response to 50 words
  const limitToFiftyWords = (text: string): string => {
    const words = text.split(" ");
    if (words.length <= 2000) return text;

    const limitedWords = words.slice(0, 2000);
    const limitedText = limitedWords.join(" ");

    if (
      !limitedText.endsWith(".") &&
      !limitedText.endsWith("!") &&
      !limitedText.endsWith("?")
    ) {
      return limitedText + "...";
    }
    return limitedText;
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add welcome message when chat opens
  useEffect(() => {
    if (chatOpen && messages.length === 0 && showWelcome) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `👋 Hello! I'm your ${
          useCase?.title || "AI"
        } assistant. I'm here to help you learn more about our solutions. What would you like to know?`,
        timestamp: new Date(),
        sender: "ai",
        text: `👋 Hello! I'm your ${
          useCase?.title || "AI"
        } assistant. I'm here to help you learn more about our solutions. What would you like to know?`,
      };
      setMessages([welcomeMessage]);
    }
  }, [chatOpen, useCase, showWelcome]);

  // Route validation
  if (!useCase || (type !== "business" && type !== "system")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Invalid Route
          </h2>
          <p className="text-gray-600">Invalid use case or type specified</p>
        </div>
      </div>
    );
  }

  const handleInterest = () => {
    const userId = localStorage.getItem("userId");
    sessionStorage.setItem("submitclicks", "true");

    if (userId) {
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      message.warning("Please login to submit your interest.");
      sessionStorage.setItem(
        "redirectPath",
        "/main/services/a6b5/glms-open-source-hub-job-stree"
      );
      navigate("/whatsappregister");
    }
  };

  const handleLosClick = () => {
    window.location.href = "/los";
  };

  // Enhanced question selection with better UX
  const handleQuestionSelect = async (
    questionObj: (typeof predefinedQuestions)[0]
  ) => {
    setInput(questionObj.text);
    setQuestionSelected(true);
    setShowWelcome(false);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: questionObj.text,
      timestamp: new Date(),
      sender: "user",
      text: questionObj.text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessages),
      });

      const data = await response.text();
      const isImageUrl = data.startsWith("http");
      const limitedData = isImageUrl ? data : limitToFiftyWords(data);

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: limitedData,
        isImage: isImageUrl,
        timestamp: new Date(),
        sender: "ai",
        text: limitedData,
      };

      setMessages([...updatedMessages, assistantReply]);
      if (!chatOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackResponse: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        sender: "ai",
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages([...updatedMessages, fallbackResponse]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      setInput("");
    }
  };

  // Enhanced send handler
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      sender: "user",
      text: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessages),
      });

      const data = await response.text();
      const isImageUrl = data.startsWith("http");
      const limitedData = isImageUrl ? data : limitToFiftyWords(data);

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: limitedData,
        isImage: isImageUrl,
        timestamp: new Date(),
        sender: "ai",
        text: limitedData,
      };

      setMessages([...updatedMessages, assistantReply]);
      if (!chatOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackResponse: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        sender: "ai",
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages([...updatedMessages, fallbackResponse]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Enhanced feedback handlers
  const handleThumbsUp = (messageIndex: number) => {
    console.log(`Thumbs up for message ${messageIndex}`);
    message.success("Thanks for your feedback!");
    // TODO: Implement feedback API call
  };

  const handleThumbsDown = (messageIndex: number) => {
    console.log(`Thumbs down for message ${messageIndex}`);
    message.info("Thanks for your feedback. We'll work on improving!");
    // TODO: Implement feedback API call
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setIsFullScreen(false);
    setIsMinimized(false);
    setMessages([]);
    setQuestionSelected(false);
    setShowWelcome(true);
    setUnreadCount(0);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const clearChat = () => {
    setMessages([]);
    setQuestionSelected(false);
    setShowWelcome(true);
    // Add welcome message back
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: `👋 Hello! I'm your ${
        useCase?.title || "AI"
      } assistant. I'm here to help you learn more about our solutions. What would you like to know?`,
      timestamp: new Date(),
      sender: "ai",
      text: `👋 Hello! I'm your ${
        useCase?.title || "AI"
      } assistant. I'm here to help you learn more about our solutions. What would you like to know?`,
    };
    setMessages([welcomeMessage]);
  };

  const EnhancedAIIcon = () => (
    <div className="relative">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <MessageCircle className="w-4 h-4 text-white" />
      </div>
    </div>
  );

  const UserIcon = () => (
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
      <User className="w-4 h-4 text-white" />
    </div>
  );

  const SelectedComponent = useCase[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
      {/* Enhanced Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-md shadow-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div onClick={handleInterest} className="cursor-pointer group">
              <img
                src={Askoxylogo}
                alt="Logo"
                className="h-12 transition-transform group-hover:scale-105"
              />
            </div>

            <div className="hidden md:flex gap-3">
              <button
                onClick={handleLosClick}
                className="bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 hover:from-indigo-200 hover:to-blue-200 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Go To LOS
              </button>
              <button
                onClick={handleOpenChat}
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 relative"
              >
                <MessageCircle className="w-4 h-4" />
                <span>GenOxy</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleInterest}
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                I'm Interested
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-3 animate-slide-down">
              <button
                onClick={handleOpenChat}
                className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 relative"
              >
                <MessageCircle className="w-4 h-4" />
                <span>GenOxy</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLosClick}
                className="w-full bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 hover:from-indigo-200 hover:to-blue-200 px-4 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Go To LOS
              </button>
              <button
                onClick={handleInterest}
                className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                I'm Interested
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl  p-6 sm:p-8 border border-gray-200/50">
            {SelectedComponent}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Global Lending Management Solutions.
            All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Chat Button (when chat is closed) */}
      {!chatOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group relative"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce font-bold">
              {unreadCount}
            </span>
          )}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat with GenOxy
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      )}

      {/* Enhanced AI Assistant Chat Window */}
      {chatOpen && (
        <div
          ref={chatContainerRef}
          className={`flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 border border-gray-200/50 ${
            isFullScreen
              ? "fixed inset-0 z-50 h-screen w-screen rounded-none"
              : isMinimized
              ? "fixed bottom-6 right-6 z-50 w-80 h-16 rounded-2xl"
              : "fixed z-50 rounded-2xl " +
                "bottom-6 left-4 right-4 h-[calc(100vh-120px)] max-h-[600px] " +
                "sm:bottom-6 sm:left-6 sm:right-6 sm:h-[500px] " +
                "md:bottom-6 md:right-6 md:left-auto md:w-[400px] md:h-[600px] " +
                "lg:bottom-6 lg:right-6 lg:w-[420px] lg:h-[650px]"
          }`}
        >
          {/* Enhanced Chat Header */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
            {/* Left Section - AI Icon and Titles */}
            <div className="flex items-center gap-3">
              <EnhancedAIIcon />
              <div>
                <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                GenOxy
                </p>
                <p className="text-xs text-gray-500">
                  {useCase.title
                    ? `${useCase.title} Expert`
                    : "Always here to help"}
                </p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Clear Chat Button */}
              {!isMinimized && !isFullScreen && (
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-200 hover:text-purple-700 transition-all"
                  aria-label="Clear Chat"
                  title="Clear Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen / Minimize Toggle */}
              {!isMinimized && (
                <>
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-200 hover:text-purple-700 transition-all"
                    aria-label={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                    title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullScreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Close Chat Button */}
                  <button
                    onClick={handleCloseChat}
                    className="p-2 rounded-xl text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                    aria-label="Close Chat"
                    title="Close Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <div className="flex grow flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${
                      msg.role === "user" || msg.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } animate-fade-in-up`}
                  >
                    <div
                      className={`flex max-w-[85%] ${
                        msg.role === "user" || msg.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-start gap-3`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 mt-1">
                        {msg.role === "assistant" || msg.sender === "ai" ? (
                          <EnhancedAIIcon />
                        ) : (
                          <UserIcon />
                        )}
                      </div>

                      <div className="flex flex-col">
                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl p-4 text-sm leading-relaxed relative group ${
                            msg.role === "assistant" || msg.sender === "ai"
                              ? "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 shadow-md border border-gray-200/50"
                              : "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
                          }`}
                        >
                          {msg.isImage ? (
                            <img
                              src={msg.content || msg.text}
                              alt="AI Response"
                              className="max-w-full h-auto rounded-xl"
                            />
                          ) : (
                            <ReactMarkdown className="break-words prose prose-sm max-w-none">
                              {msg.content || msg.text || ""}
                            </ReactMarkdown>
                          )}

                          {/* Copy button */}
                          <button
                            onClick={() =>
                              copyToClipboard(msg.content || msg.text || "")
                            }
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all duration-200"
                            aria-label="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Timestamp */}
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            msg.role === "user" || msg.sender === "user"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {msg.timestamp?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        {/* Predefined Questions (only for welcome message) */}
                        {(msg.role === "assistant" || msg.sender === "ai") &&
                          index === 0 &&
                          !questionSelected &&
                          showWelcome && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm text-gray-600 font-medium">
                                Quick questions to get started:
                              </p>
                              <div className="grid gap-2">
                                {predefinedQuestions.map((question, qIndex) => (
                                  <button
                                    key={qIndex}
                                    onClick={() =>
                                      handleQuestionSelect(question)
                                    }
                                    className="text-left bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-blue-200/50 flex items-center gap-3"
                                  >
                                    <span className="text-lg">
                                      {question.icon}
                                    </span>
                                    <div>
                                      <div className="font-semibold text-xs text-blue-600 uppercase tracking-wide">
                                        {question.category}
                                      </div>
                                      <div className="text-sm">
                                        {question.text}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Feedback buttons for AI messages */}
                        {(msg.role === "assistant" || msg.sender === "ai") &&
                          index !== 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => handleThumbsUp(index)}
                                className="p-2 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors"
                                aria-label="Thumbs up"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleThumbsDown(index)}
                                className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                                aria-label="Thumbs down"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-gray-500"
                                >
                                  <path
                                    d="M17 13H21L21 4H17M17 13L17 4M17 13L13.0282 21H12.4147C11.1917 21 10.2572 19.9046 10.4456 18.6919L11.0192 15L5.98994 15C4.17839 15 2.78316 13.3959 3.02793 11.5947L3.70735 6.59466C3.90933 5.1082 5.17443 4 6.66936 4H17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="flex-shrink-0 mt-1">
                        <EnhancedAIIcon />
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-md border border-gray-200/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            GenOxy is thinking...
                          </span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-md p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-start gap-3"
                >
                  <div className="relative flex-1">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-4 p-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 text-sm leading-relaxed placeholder-gray-500"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0 self-center"
                    aria-label="Send message"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        /* Enhanced hover effects */
        .group:hover .opacity-0 {
          opacity: 1;
        }

        /* Responsive typography */
        @media (max-width: 640px) {
          .prose {
            font-size: 14px;
          }
        }

        /* Loading animation improvements */
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out both;
        }

        /* Custom gradient animations */
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        /* Message bubble animations */
        .message-bubble {
          animation: fade-in-up 0.4s ease-out;
        }

        /* Improved focus states */
        .focus\:ring-purple-500:focus {
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }

        /* Better mobile responsiveness */
        @media (max-width: 768px) {
          .fixed.bottom-6.left-4.right-4 {
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
          }
        }

        /* Enhanced tooltip styles */
        .tooltip {
          position: relative;
        }

        .tooltip:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 1000;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .tooltip::after {
          opacity: 0;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: all 0.2s ease-in-out;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Enhanced glassmorphism effect */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        /* Improved shadow effects */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Enhanced gradient text */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }

        /* Improved button hover states */
        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        /* Enhanced mobile menu */
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default CASRouteRenderer;
