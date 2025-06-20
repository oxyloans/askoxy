import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import {
  Send,
  Download,
  Bot,
  User,
  Sparkles,
  Zap,
  Camera,
  Palette,
  Wand2,
  Plus,
  ArrowUp,
  Loader2,
  Copy,
  Check,
  MoreVertical,
  RefreshCw,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import BASE_URL from "../Config";

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  if (!text) return text;

  return (
    text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto text-sm"><code>$1</code></pre>'
      )
      // Inline code
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>'
      )
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>'
      )
      // Line breaks
      .replace(/\n/g, "<br>")
  );
};

interface Message {
  id?: string | number;
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
  timestamp?: string | number;
}

const OpenAi: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [relatedOptions, setRelatedOptions] = useState<string[]>([]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Fixed image download function
  const handleImageDownload = async (imageUrl: string) => {
    setDownloadingImage(imageUrl);
    try {
      // Create a proxy URL to handle CORS issues
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${imageUrl}`;

      // Try direct download first
      const response = await fetch(imageUrl, {
        method: "GET",
        mode: "no-cors",
      }).catch(() => {
        // If direct fetch fails, try with proxy
        return fetch(proxyUrl, { method: "GET" });
      });

      // Alternative approach: Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      link.download = `askoxy-ai-image-${timestamp}.png`;

      // For mobile compatibility
      if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
        // On mobile, open in new tab
        window.open(imageUrl, "_blank");
      } else {
        // On desktop, try to download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Image download failed:", error);
      // Fallback: open image in new tab
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadingImage(null);
    }
  };

  const handleSend = async (messageContent?: string) => {
    const textToSend = messageContent || input.trim();
    if (!textToSend) return;

    const userMessage: Message = { role: "user", content: textToSend };
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

      if (!response.ok) {
        throw new Error(`Error: ${data}`);
      }

      const isImageUrl = data.startsWith("http");

      const assistantReply: Message = {
        role: "assistant",
        content: data,
        isImage: isImageUrl,
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        isImage: false,
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Updated suggestion prompts - only 3 prompts for mobile-friendly layout
  const suggestionPrompts = [
    {
      text: "Create Image",
      icon: <Camera className="w-4 h-4" />,
      gradient: "from-emerald-500 to-teal-600",
      related: [
        "Generate a beautiful sunset image",
        "Create an AI image of a beach sunset",
        "Show a sunset over the mountains",
        "Design a peaceful evening sky image",
      ],
    },
    {
      text: "Learning",
      icon: <Wand2 className="w-4 h-4" />,
      gradient: "from-pink-500 to-rose-600",
      related: [
        "Best online learning platforms in 2025",
        "How to study effectively with AI",
        "AI tips for mastering coding",
        "Create a learning schedule",
      ],
    },
    {
      text: "Programming Solving",
      icon: <Sparkles className="w-4 h-4" />,
      gradient: "from-blue-500 to-purple-600",
      related: [
        "Write a React component for a navbar",
        "Fix a bug in this JavaScript code",
        "Explain closures in JavaScript",
        "Create a REST API in Node.js",
      ],
    },
    {
      text: "Latest News",
      icon: <Sparkles className="w-4 h-4" />,
      gradient: "from-yellow-500 to-orange-500",
      related: [
        "What's the latest in AI technology?",
        "Top tech headlines today",
        "Recent trends in global economy",
        "Highlights from today's news",
      ],
    },
  ];
  

  // const suggestionPrompts = [
  //   {
  //     text: "Create Image Sunset",
  //     icon: <Camera className="w-4 h-4" />,
  //     gradient: "from-emerald-500 to-teal-600",
  //   },
  //   {
  //     text: "Learning",
  //     icon: <Wand2 className="w-4 h-4" />,
  //     gradient: "from-pink-500 to-rose-600",
  //   },
  //   {
  //     text: "Programming",
  //     icon: <Sparkles className="w-4 h-4" />,
  //     gradient: "from-blue-500 to-purple-600",
  //   },
  //   {
  //     text: "Latest News",
  //     icon: <Sparkles className="w-4 h-4" />,
  //     gradient: "from-yellow-500 to-orange-500",
  //   },
  // ];

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  // Handle suggestion prompt click
  // const handlePromptSelect = (promptText: string) => {
  //   setInput(promptText); // Set the input value
  //   handleSend(promptText);
  // };
  const handlePromptSelect = (promptText: string, related: string[]) => {
    setSelectedPrompt(promptText);
    setRelatedOptions(related);
  };
  
  

  // Determine if we should show the centered layout
  const showCenteredLayout = messages.length === 0 && !loading;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Enhanced Header */}
      {!showCenteredLayout && (
        <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Enhanced Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div> */}
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ASKOXY.AI
                  </span>
                </div>
              </div>

              {/* Enhanced Controls */}
              <div className="flex items-center gap-2">
                {/* New Chat Button */}
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      {showCenteredLayout && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0">
            {/* Bubble 1 */}
            <div
              className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-float-bubble"
              style={{
                left: "10%",
                top: "20%",
                animationDelay: "0s",
                animationDuration: "8s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full animate-ping"
                style={{ animationDelay: "0s", animationDuration: "3s" }}
              />
            </div>

            {/* Bubble 2 */}
            <div
              className="absolute w-6 h-6 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-float-bubble"
              style={{
                right: "15%",
                top: "30%",
                animationDelay: "2s",
                animationDuration: "10s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-ping"
                style={{ animationDelay: "2s", animationDuration: "4s" }}
              />
            </div>

            {/* Bubble 3 */}
            <div
              className="absolute w-3 h-3 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full animate-float-bubble"
              style={{
                left: "25%",
                bottom: "25%",
                animationDelay: "4s",
                animationDuration: "7s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full animate-ping"
                style={{ animationDelay: "4s", animationDuration: "2.5s" }}
              />
            </div>

            {/* Bubble 4 */}
            <div
              className="absolute w-5 h-5 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full animate-float-bubble"
              style={{
                right: "30%",
                bottom: "40%",
                animationDelay: "1s",
                animationDuration: "9s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-ping"
                style={{ animationDelay: "1s", animationDuration: "3.5s" }}
              />
            </div>

            {/* Bubble 5 */}
            <div
              className="absolute w-7 h-7 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full animate-float-bubble"
              style={{
                left: "5%",
                top: "60%",
                animationDelay: "3s",
                animationDuration: "11s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full animate-ping"
                style={{ animationDelay: "3s", animationDuration: "4.5s" }}
              />
            </div>

            {/* Bubble 6 */}
            <div
              className="absolute w-4 h-4 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full animate-float-bubble"
              style={{
                right: "8%",
                top: "70%",
                animationDelay: "5s",
                animationDuration: "8s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-full animate-ping"
                style={{ animationDelay: "5s", animationDuration: "3s" }}
              />
            </div>

            {/* Bubble 7 */}
            <div
              className="absolute w-8 h-8 bg-gradient-to-r from-rose-400/15 to-pink-400/15 rounded-full animate-float-bubble"
              style={{
                left: "70%",
                top: "15%",
                animationDelay: "6s",
                animationDuration: "12s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-rose-400/25 to-pink-400/25 rounded-full animate-ping"
                style={{ animationDelay: "6s", animationDuration: "5s" }}
              />
            </div>

            {/* Bubble 8 */}
            <div
              className="absolute w-3 h-3 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-float-bubble"
              style={{
                left: "50%",
                bottom: "15%",
                animationDelay: "7s",
                animationDuration: "6s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full animate-ping"
                style={{ animationDelay: "7s", animationDuration: "2s" }}
              />
            </div>

            {/* Bubble 9 */}
            <div
              className="absolute w-5 h-5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-float-bubble"
              style={{
                right: "25%",
                top: "50%",
                animationDelay: "8s",
                animationDuration: "9s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-ping"
                style={{ animationDelay: "8s", animationDuration: "3.5s" }}
              />
            </div>

            {/* Bubble 10 */}
            <div
              className="absolute w-6 h-6 bg-gradient-to-r from-violet-400/15 to-purple-400/15 rounded-full animate-float-bubble"
              style={{
                left: "80%",
                bottom: "30%",
                animationDelay: "9s",
                animationDuration: "10s",
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-violet-400/25 to-purple-400/25 rounded-full animate-ping"
                style={{ animationDelay: "9s", animationDuration: "4s" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 ${
          showCenteredLayout ? "flex flex-col" : "overflow-y-auto"
        }`}
      >
        {showCenteredLayout ? (
          /* Enhanced Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 max-w-6xl mx-auto w-full">
            {/* Animated Logo */}
            <div className="text-center mb-12">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                ASKOXY.AI
              </h1>
              <p className="text-xl md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
                Your intelligent AI companion for creativity, learning, and
                problem-solving
              </p>
            </div>

            {/* Enhanced Input */}
            <div className="w-full max-w-3xl mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={loading}
                    rows={1}
                    className="w-full text-lg resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-6 pr-16 rounded-3xl"
                    style={{ minHeight: "80px", maxHeight: "150px" }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                      input.trim() && !loading
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <ArrowUp className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Small Rounded Suggestion Buttons */}
            {/* <div className="w-full max-w-5xl mx-auto px-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestionPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptSelect(prompt.text)}
                    className="flex items-center px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300"
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-br ${prompt.gradient} text-white text-xs`}
                    >
                      {prompt.icon}
                    </div>
                    <span className="text-xs font-medium">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div> */}

            <div className="w-full max-w-5xl mx-auto px-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestionPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handlePromptSelect(prompt.text, prompt.related)
                    }
                    className="flex items-center px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300"
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-br ${prompt.gradient} text-white text-xs`}
                    >
                      {prompt.icon}
                    </div>
                    <span className="text-xs font-medium">{prompt.text}</span>
                  </button>
                ))}
              </div>

              {relatedOptions.length > 0 && (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center">
    {relatedOptions.map((question, index) => (
      <button
        key={index}
        onClick={() => {
          setInput(question);
          handleSend(question);
          setRelatedOptions([]);
          setSelectedPrompt(null);
        }}
        className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm transition-all"
      >
        {question}
      </button>
    ))}
  </div>
)}

            </div>
          </div>
        ) : (
          /* Enhanced Chat Messages */
          <div className="px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className="animate-fade-in-up">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="flex items-start gap-3 max-w-[85%] group">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-5 py-3 shadow-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[85%] w-full group">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl px-5 py-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                            {msg.isImage ? (
                              <div className="relative group/image">
                                <img
                                  src={msg.content}
                                  alt="AI Generated"
                                  className="rounded-xl w-full max-h-96 object-contain shadow-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextElementSibling) {
                                      (
                                        e.currentTarget
                                          .nextElementSibling as HTMLElement
                                      ).textContent = "Failed to load image";
                                      e.currentTarget.nextElementSibling.classList.remove(
                                        "hidden"
                                      );
                                    }
                                  }}
                                />
                                <div className="hidden text-red-500 text-sm mt-2">
                                  Failed to load image
                                </div>
                                <button
                                  onClick={() =>
                                    handleImageDownload(msg.content)
                                  }
                                  disabled={downloadingImage === msg.content}
                                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 disabled:bg-black/50 text-white rounded-lg p-2 opacity-0 group-hover/image:opacity-100 transition-all duration-200"
                                  title="Download image"
                                >
                                  {downloadingImage === msg.content ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <div
                                className="prose prose-sm max-w-none break-words text-gray-900 dark:text-white"
                                dangerouslySetInnerHTML={{
                                  __html: parseMarkdown(msg.content),
                                }}
                              />
                            )}

                            {/* Message Actions */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {msg.timestamp &&
                                  new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Enhanced Loading Animation */}
              {loading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ASKOXY.AI is thinking
                        </span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Bottom Input */}
      {!showCenteredLayout && (
        <div className="flex-shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 sticky bottom-0 z-10 shadow-2xl">
          <div className="max-w-4xl mx-auto p-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
                <div className="flex items-end gap-3 p-4">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setInput(e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                      placeholder="Ask anything..."
                      disabled={loading}
                      rows={1}
                      className="w-full text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[24px] max-h-[120px]"
                    />
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                      input.trim() && !loading
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowUp className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Input Enhancement Bar */}
                <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {/* <div
                      className={`w-2 h-2 rounded-full ${
                        loading ? "bg-orange-400 animate-pulse" : "bg-green-400"
                      }`}
                    ></div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Styles */}
      <style>{`


  @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }
        
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-in-delayed {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out;
      }
      
      .animate-fade-in-delayed {
        animation: fade-in-delayed 0.7s ease-out 0.2s both;
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
      }

      /* Enhanced prose styling */
      .prose h1, .prose h2, .prose h3 {
        color: inherit;
        font-weight: 600;
      }
      
      .prose pre {
        font-size: 0.875rem;
        line-height: 1.5;
      }
      
      .prose code {
        color: inherit;
        font-size: 0.875rem;
        font-weight: 500;
      }
      
      .prose li {
        list-style: none;
        position: relative;
        padding-left: 1.5rem;
      }
      
      .prose li::before {
        content: "•";
        color: #6366f1;
        font-weight: bold;
        position: absolute;
        left: 0;
      }

      /* Mobile optimizations */
      @media (max-width: 640px) {
        .prose {
          font-size: 14px;
          line-height: 1.6;
        }
        
        /* Prevent horizontal overflow */
        body {
          overflow-x: hidden;
        }
        
        /* Better touch targets */
        button {
          min-height: 44px;
          min-width: 44px;
        }
      }

      /* iOS input zoom prevention */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        select, textarea, input[type="text"] {
          font-size: 16px;
        }
      }

      /* Safe area handling */
      @supports (padding: max(0px)) {
        .safe-area-pb {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      }

      /* Glassmorphism effects */
      .glass {
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }

      /* Enhanced hover effects */
      .hover-lift {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      /* Gradient text animations */
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
      }

      /* Loading shimmer effect */
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }
      
      .shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
      }

      /* Enhanced focus states */
      .focus-ring:focus {
        outline: none;
        ring: 3px;
        ring-color: rgba(99, 102, 241, 0.3);
        ring-offset: 2px;
      }

      /* Smooth transitions for all interactive elements */
      * {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }

      /* Enhanced button states */
      .btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        color: white;
        font-weight: 600;
        border-radius: 12px;
        padding: 12px 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .btn-primary:hover::before {
        left: 100%;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
      }
      
      .btn-primary:active {
        transform: translateY(0);
      }

      /* Message bubble animations */
      .message-bubble {
        animation: bubble-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      @keyframes bubble-in {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      /* Typing indicator */
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #6366f1;
        animation: typing 1.4s infinite ease-in-out;
      }
      
      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes typing {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Dark mode enhancements */
      .dark {
        color-scheme: dark;
      }
      
      .dark .glass {
        background: rgba(17, 24, 39, 0.8);
      }
      
      .dark .message-bubble {
        border: 1px solid rgba(55, 65, 81, 0.3);
      }

      /* Accessibility improvements */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .btn-primary {
          border: 2px solid currentColor;
        }
        
        .message-bubble {
          border: 2px solid currentColor;
        }
      }

      /* Better text rendering */
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
    `}</style>
    </div>
  );
};

export default OpenAi;
