import React, { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "../types/types";
import MessageActions from "./MessageActions";
import MarkdownRenderer from "./MarkdownRenderer";

/* ================================
   Helpers
   ================================ */

const cleanContent = (content: string): string => {
  return content.replace(/\?\d+:\d+\?source\?/g, "").trim();
};

const extractFirstImageUrl = (content: string): string | null => {
  if (!content) return null;
  const mdMatch = content.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i);
  if (mdMatch?.[1]) return mdMatch[1];

  const urlMatch = content.match(
    /(https?:\/\/[^\s)]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s)]*)?)/i
  );
  if (urlMatch?.[1]) return urlMatch[1];

  const lineUrl = content.split(/\s+/).find((t) => /^https?:\/\/\S+/i.test(t));
  return lineUrl ?? null;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  onEditMessage: (messageId: string, content: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
  loading,
  onEditMessage,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Live padding for content so it never hides behind the input bar
  const bottomPad = `calc(var(--inputbar-height, 96px) + env(safe-area-inset-bottom, 0px) + 16px)`;

  // Keep the list scrolled to the bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      const el = containerRef.current;
      if (!el) return;
      // Directly scroll the container for reliability on mobile
      el.scrollTop = el.scrollHeight;
    };
    // Small delay helps when images/markdown expand after paint
    const id = setTimeout(scrollToBottom, 80);
    return () => clearTimeout(id);
  }, [messages, loading]);

  // Calculate a height that fills the viewport minus input bar and any optional header
  const containerStyle: React.CSSProperties = {
    height: "calc(100vh - var(--inputbar-height, 96px) - var(--header-offset, 0px))",
    overscrollBehaviorY: "contain",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-y-auto"
      style={containerStyle}
    >
      <div className="px-2 sm:px-4 py-4" style={{ paddingBottom: bottomPad }}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => {
            const cleaned = cleanContent(msg.content);
            const discoveredImageUrl =
              msg.isImage ? msg.content : extractFirstImageUrl(cleaned);
            const shouldRenderImage = Boolean(msg.isImage || discoveredImageUrl);

            return (
              <div key={msg.id || idx} className="animate-fade-in-up">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] relative group">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md break-words whitespace-pre-wrap">
                        {cleaned}
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-8 right-10 hidden group-hover:flex z-10 space-x-2">
                        <MessageActions
                          message={msg}
                          index={idx}
                          onEdit={() => onEditMessage(msg.id!, cleaned)}
                          showOnly={["edit", "copy"]}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] w-full group">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-md">
                          {shouldRenderImage ? (
                            <div className="relative group/image">
                              <img
                                src={discoveredImageUrl || msg.content}
                                alt="AI Generated"
                                className="rounded-xl w-full max-h-96 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const next = e.currentTarget
                                    .nextElementSibling as HTMLDivElement | null;
                                  if (next) next.classList.remove("hidden");
                                }}
                              />
                              <div className="hidden mt-2 rounded-lg border border-red-200 dark:border-red-600 bg-red-50/60 dark:bg-red-900/30 p-3 text-sm">
                                <div className="font-medium text-red-700 dark:text-red-300">
                                  Failed to load image
                                </div>
                                <div className="mt-1 text-red-700/80 dark:text-red-200/80 break-words">
                                  The link may be expired or blocked by the browser.
                                </div>

                                {discoveredImageUrl && (
                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <a
                                      href={discoveredImageUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs"
                                    >
                                      Open in new tab
                                    </a>
                                    <button
                                      onClick={() => copyToClipboard(discoveredImageUrl)}
                                      className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs"
                                    >
                                      Copy URL
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <MarkdownRenderer content={cleaned} />
                          )}

                          <div className="flex justify-end mt-2">
                            <MessageActions message={msg} index={idx} small />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      OXYGPT is thinking
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-indigo-500" />
                      <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-purple-500" />
                      <div className="w-2 h-2 rounded-full animate-bounce bg-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* End anchor with scroll margin equal to input bar height */}
          <div
            ref={messagesEndRef}
            style={{ height: 1, scrollMarginBottom: bottomPad as any }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
