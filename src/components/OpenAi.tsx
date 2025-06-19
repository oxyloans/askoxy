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
} from "lucide-react";
import BASE_URL from "../Config";
// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  if (!text) return text;
  
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(.*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Line breaks
    .replace(/\n/g, '<br>');
};

interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

const OpenAi: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleImageDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" }); // Ensure CORS is allowed
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      link.download = `ai-image-${timestamp}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image download failed:", error);
      window.open(imageUrl, "_target"); // Open in new tab if download fails
      
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

  const suggestionPrompts = [
    {
      text: "Create an image of a serene sunset",
      icon: <Camera className="w-2 h-2 sm:w-4 sm:h-4" />,
      gradient: "from-emerald-500 to-teal-600",
      category: "Nature",
    },
    {
      text: "Visualize a futuristic city skyline",
      icon: <Zap className="w-2 h-2 sm:w-4 sm:h-4" />,
      gradient: "from-blue-500 to-purple-600",
      category: "Futuristic",
    },
    {
      text: "Generate portraits of cute animals",
      icon: <Palette className="w-2 h-2 sm:w-4 sm:h-4" />,
      gradient: "from-amber-500 to-orange-600",
      category: "Lifestyle",
    },
    {
      text: "What are the current OxyLoans interest rates?",
      icon: <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />,
      gradient: "from-pink-500 to-rose-600",
      category: "Finance",
    },
    {
      text: "How can I apply for a loan on OxyLoans?",
      icon: <Camera className="w-3 h-3 sm:w-4 sm:h-4" />,
      gradient: "from-gray-500 to-slate-600",
      category: "Finance",
    },
    {
      text: "What is Askoxy.AI and how does it work?",
      icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />,
      gradient: "from-green-500 to-emerald-600",
      category: "AI Assistant",
    },
  ];
  
  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    handleSend(prompt);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Fixed Header - Responsive */}
      {messages.length > 0 && (
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ASKOXY.AI
              </span>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content - Responsive */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full px-3 sm:px-4 lg:px-6 py-3 sm:py-6">
          <div className="max-w-4xl mx-auto h-full">
            {/* Welcome Section - Responsive */}
            {messages.length === 0 && (
              <div className="text-center space-y-4 sm:space-y-8 pt-4 sm:pt-12">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent px-4">
                    ASKOXY.AI
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600 max-w-lg mx-auto px-4">
                    Transform your imagination into stunning visuals with
                    AI-powered creativity
                  </p>
                </div>

                {/* Sample Images Grid - Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto px-4">
                  {[
                    "photo-1507525428034-b723cf961d3e",
                    "photo-1516321318423-f06f85e504b3",
                    "photo-1495474472287-4d71bcdd2085",
                    "photo-1506744038136-46273834b3fb",
                  ].map((id, i) => (
                    <div
                      key={i}
                      className="relative group overflow-hidden rounded-xl sm:rounded-2xl"
                    >
                      <img
                        src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop`}
                        alt={`Sample ${i + 1}`}
                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>

                {/* Responsive Suggestion Prompts */}
                <div className="max-w-5xl mx-auto px-4 space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      ✨ Get Started with These Prompts
                    </h3>
                    <p className="text-sm text-gray-600">Click any prompt to begin your creative journey</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {suggestionPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptSelect(prompt.text)}
                        className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/50 hover:border-gray-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 text-left w-full hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${prompt.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                          >
                            {prompt.icon}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {prompt.category}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-900 leading-relaxed">
                              {prompt.text}
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
             
            )}

            {/* Messages - Responsive */}
            <div className="space-y-4 sm:space-y-6 pb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="animate-fade-in">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="flex items-end gap-2 sm:gap-3 max-w-[85%] sm:max-w-2xl">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg text-xs sm:text-sm leading-relaxed">
                          {msg.content}
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-2xl w-full">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm text-xs sm:text-sm leading-relaxed flex-1 min-w-0">
                          {msg.isImage ? (
                            <div className="relative group">
                              <img
                                src={msg.content}
                                alt="AI Generated"
                                className="rounded-xl sm:rounded-2xl w-full max-h-64 sm:max-h-96 object-contain shadow-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling!.textContent =
                                    "Failed to load image";
                                }}
                              />
                              <div className="hidden text-red-500 text-xs sm:text-sm mt-2">
                                Failed to load image
                              </div>
                              <button
                                onClick={() => handleImageDownload(msg.content)}
                                className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 hover:bg-black/80 text-white rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                title="Download image"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="prose prose-sm max-w-none break-words"
                              dangerouslySetInnerHTML={{ 
                                __html: parseMarkdown(msg.content) 
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Enhanced Loading Animation - Responsive */}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg border border-gray-100">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          ASKOXY.AI is thinking
                        </span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Input Section - Responsive */}
      <div className="flex-shrink-0 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
          <div className="bg-white shadow-xl border border-gray-200/50 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-end gap-2 sm:gap-4 p-3 sm:p-4">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyPress}
                placeholder="Describe your creative vision in detail..."
                disabled={loading}
                rows={1}
                className="flex-1 text-xs sm:text-sm resize-none focus:outline-none placeholder-gray-400 leading-relaxed min-w-0"
                style={{
                  minHeight: "32px",
                  maxHeight: "120px",
                  lineHeight: "1.5",
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }
        
        @media (min-width: 640px) {
          ::-webkit-scrollbar {
            width: 6px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }

        .prose h1, .prose h2, .prose h3 {
          color: #374151;
        }
        
        .prose pre {
          font-size: 0.875rem;
        }
        
        .prose code {
          color: #374151;
          font-size: 0.875rem;
        }
        
        @media (max-width: 640px) {
          .prose {
            font-size: 0.875rem;
          }
          
          .prose pre {
            font-size: 0.75rem;
          }
          
          .prose code {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OpenAi;