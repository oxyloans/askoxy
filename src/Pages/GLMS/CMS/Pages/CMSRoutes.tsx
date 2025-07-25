// pages/CASRouteRenderer.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCMSRoutes } from "../Routes/useCmsRoutes";
import { Menu, X } from "react-feather";
import { message } from "antd";
import Askoxylogo from "../../../assets/img/askoxylogonew.png";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import BASE_URL from "../../../../Config";

interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
  timestamp?: Date;
  sender?: "user" | "ai"; // Keep for backward compatibility
  text?: string; // Keep for backward compatibility
}
const CMSRouteRenderer: React.FC = () => {
  const { useCaseId, type } = useParams<{ useCaseId: string; type: string }>();
  const useCase = useCMSRoutes[useCaseId || ""];
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false); // Changed to false by default
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [hasAutoQuestionSent, setHasAutoQuestionSent] = useState(false);

  const handleCMSClick = () => (window.location.href = "/cms");
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to limit response to 50 words
  const limitToFiftyWords = (text: string): string => {
    const words = text.split(" ");
    if (words.length <= 2000) return text;

    const limitedWords = words.slice(0, 2000);
    const limitedText = limitedWords.join(" ");

    // Ensure it ends with proper punctuation
    if (
      !limitedText.endsWith(".") &&
      !limitedText.endsWith("!") &&
      !limitedText.endsWith("?")
    ) {
      return limitedText + ".";
    }
    return limitedText;
  };

  // Auto-generate question based on use case
  const generateAutoQuestion = (useCaseTitle: string, type: string) => {
    const questions = [
      `What would you like to know about  ${useCaseTitle}?`,
      `How does ${useCaseTitle} help ${
        type === "business" ? "businesses" : "systems"
      }?`,
      `What are the benefits of implementing ${useCaseTitle}?`,
      `Can you explain how ${useCaseTitle} works?`,
      `What makes ${useCaseTitle} unique in the market?`,
    ];

    // Select a random question
    return questions[Math.floor(Math.random() * questions.length)];
  };

  // Auto-send question when use case is loaded
  useEffect(() => {
    if (
      useCase &&
      type &&
      chatOpen &&
      !hasAutoQuestionSent &&
      messages.length === 0
    ) {
      const autoQuestion = generateAutoQuestion(useCase.title, type);

      // Add auto question as user message
      const autoUserMessage: Message = {
        role: "user",
        content: autoQuestion,
        timestamp: new Date(),
        sender: "user",
        text: autoQuestion,
      };

      setMessages([autoUserMessage]);
      setHasAutoQuestionSent(true);
      simulateAIResponse(autoQuestion);
    }
  }, [useCase, type, chatOpen, hasAutoQuestionSent, messages.length]);

  // Reset auto question flag when chat is reopened
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setHasAutoQuestionSent(false);
    }
  }, [chatOpen]);

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

  if (!useCase || (type !== "business" && type !== "system")) {
    return (
      <div className="text-red-600 text-center mt-8">
        Invalid use case or type
      </div>
    );
  }
  const handleInterest = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      sessionStorage.setItem("submitclicks", "true");
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      message.warning("Please login to submit your interest.");
      sessionStorage.setItem("submitclicks", "true");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        "/main/services/a6b5/glms-open-source-hub-job-stree"
      );
    }
  };

  // API-based chat handler with 50-word limit
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
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

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessages),
      });

      const data = await response.text();
      const isImageUrl = data.startsWith("http");

      // Limit API response to 50 words if it's text
      const limitedData = isImageUrl ? data : limitToFiftyWords(data);

      const assistantReply: Message = {
        role: "assistant",
        content: limitedData,
        isImage: isImageUrl,
        timestamp: new Date(),
        sender: "ai",
        text: limitedData,
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback to simulated response on API error
      simulateAIResponse(input.trim());
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler (combines both approaches)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Try API first, fallback to simulation
      handleSend();
    }
  };

  const handleThumbsUp = (messageIndex: number) => {
    console.log(`Thumbs up for message ${messageIndex}`);
    // TODO: Implement feedback API call
  };
  // Enhanced AI response simulation with 50-word limit
  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
        aiResponse =
          "Our pricing is customized based on your specific needs and usage requirements. We offer flexible plans for different business sizes. Contact our sales team for detailed pricing options and personalized quotes. We ensure competitive rates with excellent value for your investment.";
      } else if (
        lowerMessage.includes("feature") ||
        lowerMessage.includes("functionality") ||
        lowerMessage.includes("key features")
      ) {
        aiResponse = `${useCase.title} includes comprehensive features for ${
          type === "business" ? "business" : "system"
        } requirements. Key capabilities include advanced analytics, seamless integration, robust security measures, and scalable architecture. The solution offers real-time monitoring, automated workflows, and user-friendly interfaces for optimal performance.`;
      } else if (
        lowerMessage.includes("demo") ||
        lowerMessage.includes("trial")
      ) {
        aiResponse =
          "You can request a demo or trial by clicking 'I'm Interested' button. Our team will schedule a personalized demonstration and set up a trial environment. Experience all features hands-on with guided support from our experts during the trial period.";
      } else if (lowerMessage.includes("integration")) {
        aiResponse =
          "Our solution offers flexible integration options with various platforms through REST APIs, webhooks, and pre-built connectors. We support popular business tools and custom integrations. Our technical team provides comprehensive integration support and documentation for seamless implementation.";
      } else if (lowerMessage.includes("support")) {
        aiResponse =
          "We provide comprehensive support including 24/7 technical assistance, detailed documentation, video tutorials, and dedicated account management. Our experienced support team ensures quick resolution of issues. We offer multiple support channels for your convenience and success.";
      } else if (lowerMessage.includes("security")) {
        aiResponse =
          "Security is our top priority with enterprise-grade measures including end-to-end encryption, secure authentication, and regular security audits. We comply with industry standards like SOC 2 and GDPR. Your data protection and privacy are guaranteed with our robust security framework.";
      } else if (
        lowerMessage.includes("benefits") ||
        lowerMessage.includes("help")
      ) {
        aiResponse = `${useCase.title} helps ${
          type === "business" ? "businesses" : "systems"
        } by streamlining operations, reducing costs, and improving efficiency. It automates complex processes, provides valuable insights, and enhances productivity. Users experience faster decision-making, better resource management, and improved overall performance with measurable results.`;
      } else if (
        lowerMessage.includes("how") &&
        lowerMessage.includes("work")
      ) {
        aiResponse = `${useCase.title} works through intelligent automation and advanced algorithms to process data efficiently. The system analyzes requirements, executes tasks automatically, and provides real-time feedback. It integrates seamlessly with existing infrastructure while maintaining high performance and reliability standards.`;
      } else if (
        lowerMessage.includes("unique") ||
        lowerMessage.includes("different")
      ) {
        aiResponse = `${useCase.title} stands out with its innovative approach, cutting-edge technology, and user-centric design. Our solution offers superior performance, scalability, and customization options. We provide exceptional customer support, competitive pricing, and continuous updates to ensure market-leading capabilities.`;
      } else {
        aiResponse = `Welcome to ${
          useCase.title
        }! This powerful solution is designed for ${
          type === "business" ? "business" : "system"
        } excellence. I'm here to help you understand features, pricing, demos, integrations, security, and benefits. Feel free to ask specific questions about our capabilities and how we can help you succeed.`;
      }

      // Limit response to 50 words
      const limitedResponse = limitToFiftyWords(aiResponse);

      // Add message in the new format
      const newMessage: Message = {
        role: "assistant",
        content: limitedResponse,
        timestamp: new Date(),
        sender: "ai",
        text: limitedResponse,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };
  const handleThumbsDown = (messageIndex: number) => {
    console.log(`Thumbs down for message ${messageIndex}`);
    // TODO: Implement feedback API call
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setIsFullScreen(false);
    // Reset auto question when chat is closed
    setMessages([]);
    setHasAutoQuestionSent(false);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setIsFullScreen(false);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const AIIcon = () => (
    <svg
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.30957 15C0.30957 23.2722 7.0374 30 15.3096 30C23.5817 30 30.3096 23.2722 30.3096 15C30.3019 6.72783 23.5741 0 15.3096 0C7.0374 0 0.30957 6.72783 0.30957 15Z"
        fill="url(#paint0_radial_160_60080)"
      />
      <path
        d="M13.6455 21.057C13.5983 21.057 13.551 21.057 13.5041 21.057C13.3933 21.0302 13.3542 20.9442 13.3261 20.8457C13.1889 20.3651 13.0727 19.877 12.9077 19.4059C12.4838 18.1958 11.6402 17.4199 10.4123 17.0635C10.0089 16.9463 9.6041 16.8339 9.2 16.7188C9.10624 16.6919 9.02452 16.6494 9 16.5427C9 16.4953 9 16.448 9 16.4004C9.02679 16.2892 9.1126 16.2503 9.2109 16.2223C9.66562 16.093 10.1253 15.9783 10.5732 15.8288C11.8221 15.4117 12.623 14.5571 12.9864 13.2898C13.1004 12.8925 13.2128 12.4945 13.3267 12.0972C13.3651 11.9637 13.4546 11.8902 13.5751 11.8904C13.6957 11.8904 13.7835 11.9643 13.8232 12.0979C13.9776 12.6167 14.0882 13.1501 14.2832 13.6546C14.729 14.8078 15.5631 15.5442 16.7491 15.8819C17.1493 15.9959 17.5495 16.1094 17.9493 16.2248C18.0905 16.2655 18.17 16.3604 18.1666 16.4774C18.1632 16.5932 18.0885 16.6785 17.9493 16.719C17.4492 16.8649 16.9386 16.9818 16.4503 17.16C15.2653 17.5924 14.5088 18.4375 14.1633 19.6524C14.0491 20.0538 13.9358 20.4552 13.8214 20.8566C13.7946 20.9508 13.7515 21.032 13.6455 21.057Z"
        fill="white"
      />
      <path
        d="M18.6208 14.2236C18.5925 14.2236 18.5641 14.2236 18.5359 14.2236C18.4695 14.2075 18.446 14.1559 18.4291 14.0968C18.3469 13.8084 18.2771 13.5156 18.1781 13.233C17.9238 12.5069 17.4176 12.0413 16.6809 11.8275C16.4388 11.7572 16.196 11.6898 15.9535 11.6207C15.8972 11.6046 15.8482 11.579 15.8335 11.515C15.8335 11.4866 15.8335 11.4582 15.8335 11.4297C15.8496 11.3629 15.9011 11.3396 15.96 11.3228C16.2329 11.2452 16.5087 11.1764 16.7774 11.0867C17.5267 10.8364 18.0073 10.3236 18.2254 9.5633C18.2937 9.32491 18.3612 9.08612 18.4295 8.84774C18.4526 8.7676 18.5062 8.7235 18.5786 8.72363C18.6509 8.72363 18.7036 8.76801 18.7274 8.84815C18.8201 9.15944 18.8864 9.47947 19.0034 9.78216C19.2709 10.4741 19.7714 10.9159 20.4829 11.1185C20.7231 11.1869 20.9632 11.255 21.2031 11.3243C21.2878 11.3487 21.3355 11.4056 21.3334 11.4758C21.3314 11.5453 21.2866 21.5965 21.2031 11.6208C20.903 11.7083 20.5967 11.7785 20.3037 11.8854C19.5927 12.1448 19.1388 12.6519 18.9315 13.3808C18.863 13.6217 18.795 13.8625 18.7264 14.1033C18.7103 14.1599 18.6844 14.2086 18.6208 14.2236Z"
        fill="white"
      />
      <defs>
        <radialGradient
          id="paint0_radial_160_60080"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(11 22.2236) rotate(-40.3331) scale(34.7635 34.7635)"
        >
          <stop offset="0.0705463" stopColor="#5433EB" />
          <stop offset="0.667546" stopColor="#A533EB" />
          <stop offset="1" stopColor="#5433EB" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
  const SelectedComponent = useCase[type];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white/80"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div onClick={handleInterest} className="cursor-pointer">
              <img src={Askoxylogo} alt="Logo" className="h-12" />
            </div>

            <div className="hidden md:flex gap-3">
              <button
                onClick={handleCMSClick}
                className="bg-indigo-100 text-blue-700 hover:bg-indigo-200 px-5 py-2 rounded-md transition"
              >
                Go To CMS
              </button>
              <button
                onClick={toggleChat}
                aria-label={chatOpen ? "Close AI Chat" : "Open AI Chat"}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-2 rounded-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{chatOpen ? "Close AI Chat" : "AI Chat"}</span>
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 hover:bg-green-200 px-5 py-2 rounded-md font-medium transition hover:scale-105"
              >
                I'm Interested
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-2">
              <button
                onClick={toggleChat}
                aria-label={chatOpen ? "Close AI Chat" : "Open AI Chat"}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-2 rounded-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{chatOpen ? "Close AI Chat" : "AI Chat"}</span>
              </button>

              <button
                onClick={handleCMSClick}
                className="w-full bg-indigo-100 text-blue-700 hover:bg-indigo-200 px-4 py-2 rounded-md transition text-sm"
              >
                Go To CMS
              </button>
              <button
                onClick={handleInterest}
                className="w-full bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-md font-medium transition text-sm"
              >
                I'm Interested
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto  p-4 sm:p-6">{SelectedComponent}</div>
      </main>
      <footer className="bg-gray-900 text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Global Lending Management Solutions. All
        rights reserved.
      </footer>

      {/* AI Assistant Chat Window */}
      {chatOpen && (
        <div
          data-testid="chat-window"
          className={`flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ${
            isFullScreen
              ? "fixed inset-0 z-50 h-screen w-screen rounded-none"
              : "fixed z-50 bg-white shadow-2xl " +
                "bottom-4 left-4 right-4 h-[calc(100vh-120px)] max-h-[500px] " +
                "xs:bottom-6 xs:left-6 xs:right-6 xs:h-[360px] " +
                "sm:bottom-6 sm:left-6 sm:right-6 sm:h-[360px] " +
                "md:bottom-6 md:right-6 md:left-auto md:w-[360px] md:h-[400px] " +
                "lg:bottom-6 lg:right-6 lg:w-[360px] lg:h-[520px] " +
                "xl:w-[380px] xl:h-[550px]"
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <p className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                CMS AI Assistant
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                aria-label={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                onClick={toggleFullScreen}
                className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {isFullScreen ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V8H3M21 8H16V3M16 21V16H21M3 16H8V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              <button
                type="button"
                aria-label="Close AI Chat"
                onClick={handleCloseChat}
                className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex grow flex-col overflow-hidden">
            <div className="relative flex grow flex-col overflow-hidden bg-white">
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" || msg.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] sm:max-w-[75%] ${
                        msg.role === "user" || msg.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-start gap-2 sm:gap-3`}
                    >
                      {(msg.role === "assistant" || msg.sender === "ai") && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8">
                            <AIIcon />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div
                          className={`rounded-lg p-2 sm:p-3 text-sm sm:text-base leading-relaxed ${
                            msg.role === "assistant" || msg.sender === "ai"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-600 text-white"
                          } shadow-sm`}
                        >
                          {msg.isImage ? (
                            <img
                              src={msg.content || msg.text}
                              alt="AI Response"
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <ReactMarkdown className="break-words">
                              {msg.content || msg.text || ""}
                            </ReactMarkdown>
                          )}
                        </div>
                        {(msg.role === "assistant" || msg.sender === "ai") && (
                          <div className="flex items-center gap-1 mt-2">
                            <button
                              type="button"
                              onClick={() => handleThumbsUp(index)}
                              className="rounded-full p-1.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                              aria-label="Thumbs up"
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
                                  d="M7 11H3V20H7M7 11V20M7 11L11 3H11.6156C12.843 3 13.7808 4.09535 13.5917 5.3081L13.0161 9H18.0631C19.8811 9 21.2813 10.6041 21.0356 12.4053L20.3538 17.4053C20.1511 18.8918 18.8815 20 17.3813 20H7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleThumbsDown(index)}
                              className="rounded-full p-1.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
                {(isTyping || loading) && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%] sm:max-w-[75%] flex-row items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8">
                          <AIIcon />
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2 sm:p-3 shadow-sm">
                        <div className="flex space-x-1">
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
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-2 sm:p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center justify-between gap-3 border border-gray-300 bg-gray-50 rounded-full px-4 py-2.5 sm:py-3 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm"
            >
              <input
                type="text"
                name="message"
                placeholder="Ask about this use case..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || loading}
                className="flex-grow bg-transparent text-sm sm:text-base focus:outline-none placeholder-gray-500 disabled:cursor-not-allowed"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping || loading}
                aria-label="Send message"
                className={`flex items-center justify-center rounded-full p-2.5 transition-all duration-200 ${
                  input.trim() && !isTyping && !loading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                } shadow-sm`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 10L12 4M12 4L18 10M12 4V20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSRouteRenderer;
