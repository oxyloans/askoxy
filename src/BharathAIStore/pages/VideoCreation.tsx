import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
import {
  Video,
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  Plus,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../Config";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  videoUrl?: string;
  videoId?: string;
  isCreating?: boolean;
}

const VideoCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [referrer] = useState(() => document.referrer);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createVideo = async (prompt: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/ai-service/agent/createVideo`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Video creation failed:", error);
      throw error;
    }
  };

  const getVideoStatus = async (videoId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/getVideoStatus/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Get video status failed:", error);
      throw error;
    }
  };

  const getVideoContent = async (videoId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/${videoId}/content`,
        {
          responseType: "blob",
          headers: {
            Accept: "video/mp4,video/webm,video/*",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.data || response.data.size === 0) {
        throw new Error("Empty video content received");
      }

      return response.data;
    } catch (error) {
      console.error("Get video content failed:", error);
      throw error;
    }
  };

  const downloadVideo = (videoUrl: string, videoId: string) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `ai-video-${videoId}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVideoCreation = async (prompt: string) => {
    if (!prompt.trim()) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      notification.error({
        message: "Authentication Required",
        description: "Please login to create videos",
      });
      return;
    }

    const userContextRaw = sessionStorage.getItem("userJewelryContext");
    let enhancedPrompt = prompt;

    if (userContextRaw) {
      const gender = userContextRaw.match(/Gender:\s*([^,]+)/)?.[1]?.trim();
      const age = userContextRaw.match(/Age:\s*([^,]+)/)?.[1]?.trim();
      const skinTone = userContextRaw
        .match(/Skin Tone:\s*([^,]+)/)?.[1]
        ?.trim();
      const event = userContextRaw.match(/Event:\s*([^,]+)/)?.[1]?.trim();

      enhancedPrompt = `
${prompt}
The user details are: ${age}, ${gender}, ${skinTone}, ${event}.
    `;
    }

    const userMessage: ChatMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setCanSend(false);

    const loadingMessage: ChatMessage = {
      role: "assistant",
      content: "Creating your video request...",
      isCreating: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const createResponse = await createVideo(enhancedPrompt);
      const { videoId } = createResponse;

      // Update message to show video ID
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.isCreating
            ? {
                ...msg,
                content: "Your video is being created...",
                videoId: videoId,
              }
            : msg,
        ),
      );
      setLoading(false);

      const pollStatus = async (): Promise<void> => {
        try {
          const statusResponse = await getVideoStatus(videoId);

          if (statusResponse.status === "completed") {
            const videoBlob = await getVideoContent(videoId);

            if (!videoBlob || videoBlob.size === 0) {
              throw new Error("Invalid video content received");
            }

            const finalBlob = videoBlob.type
              ? videoBlob
              : new Blob([videoBlob], { type: "video/mp4" });
            const videoUrl = URL.createObjectURL(finalBlob);

            setMessages((prev) =>
              prev.map((msg) =>
                msg.videoId === videoId
                  ? {
                      ...msg,
                      content: "🎉 Your video has been created successfully!",
                      videoUrl: videoUrl,
                      isCreating: false,
                    }
                  : msg,
              ),
            );
            setCanSend(true);
          } else if (statusResponse.status === "failed") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.videoId === videoId
                  ? {
                      ...msg,
                      content:
                        "❌ Video creation failed. Please try again with a different prompt.",
                      isCreating: false,
                    }
                  : msg,
              ),
            );
            setCanSend(true);
          } else {
            setTimeout(pollStatus, 5000);
          }
        } catch (error) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.videoId === videoId
                ? {
                    ...msg,
                    content:
                      "❌ Something went wrong while creating your video. Please try again.",
                    isCreating: false,
                  }
                : msg,
            ),
          );
          setCanSend(true);
        }
      };

      setTimeout(pollStatus, 5000);
    } catch (error) {
      notification.error({
        message: "Video Creation Failed",
        description: "Failed to create video. Please try again.",
      });
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.isCreating
            ? {
                ...msg,
                content: "❌ Failed to create video. Please try again.",
                isCreating: false,
              }
            : msg,
        ),
      );
      setCanSend(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading && canSend) {
        handleVideoCreation(input);
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !loading && canSend) {
      handleVideoCreation(input);
    }
  };

  const handleCreateNew = () => {
    setMessages([]);
    setInput("");
    setLoading(false);
    setCanSend(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Video Creator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transform ideas into stunning videos
                </p>
              </div>
            </div>

            {/* Right side - Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (referrer.includes('/goldandsilveranddiamonds')) {
                    navigate('/goldandsilveranddiamonds');
                  } else {
                    navigate(-1);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Store</span>
              </button>

              {messages.length > 0 && (
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Create New Video</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Welcome Section - Fixed when no messages */}
          {messages.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-3xl shadow-2xl animate-pulse">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  Create Your AI Video
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into stunning videos using our advanced AI
                technology. Simply describe what you want to see, and we'll
                create it for you!
              </p>

              {/* Example Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                {[
                  "A serene sunset over a calm ocean with gentle waves",
                  "A futuristic city with flying cars and neon lights",
                  "A peaceful forest with sunlight filtering through trees",
                  "A cozy coffee shop on a rainy day with warm lighting",
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages - Scrollable */}
          {messages.length > 0 && (
            <div className="space-y-6 pb-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className={`max-w-[95%] rounded-2xl p-5 ${
                      msg.role === "user"
                        ? "bg-white text-black rounded-xl hover:shadow-lg transition"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed mb-2">
                      {msg.content}
                    </p>

                    {msg.videoId && msg.isCreating && (
                      <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                            Creating your video...
                          </span>
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-400">
                          Video ID:{" "}
                          <span className="font-mono bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded">
                            {msg.videoId}
                          </span>
                        </div>
                      </div>
                    )}

                    {msg.videoUrl && (
                      <div className="mt-4 relative">
                        <button
                          onClick={() =>
                            downloadVideo(msg.videoUrl!, msg.videoId!)
                          }
                          className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white hover:bg-black/70 rounded-lg transition-all"
                          title="Download video"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <video
                          controls
                          className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-2xl"
                          style={{ maxHeight: "600px", minWidth: "100%" }}
                          preload="metadata"
                          onError={(e) => {
                            console.error("Video error:", e);
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const errorDiv = document.createElement("div");
                            errorDiv.className =
                              "p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm";
                            errorDiv.textContent =
                              "Failed to load video. The video format may not be supported.";
                            target.parentNode?.insertBefore(
                              errorDiv,
                              target.nextSibling,
                            );
                          }}
                        >
                          <source src={msg.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-3 shadow-2xl flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
            <div className="flex items-center gap-2 p-2">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    loading
                      ? "Creating video..."
                      : "Describe the video you want to create..."
                  }
                  disabled={loading}
                  rows={1}
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none text-sm py-1"
                  style={{
                    minHeight: "16px",
                    maxHeight: "60px",
                    lineHeight: "1.2",
                  }}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 60)}px`;
                  }}
                />
              </div>
              {canSend && (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="font-bold">Note:</span> Videos are limited to{" "}
            <span className="font-bold">4 seconds</span> and cannot be
            <span className="font-bold"> edited </span>after creation
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default VideoCreationPage;
