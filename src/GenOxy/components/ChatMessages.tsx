import React, { useEffect } from "react";
import { Bot, User } from "lucide-react";
import { parseMarkdown } from "../utils/markdown";
import MessageActions from "./MessageActions";
import { Message } from "../types/types";
import MarkdownRenderer from "./MarkdownRenderer";

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
  // Auto scroll to bottom on message update
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        // Timeout to ensure layout is rendered before scrolling
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }
    };

    scrollToBottom();
  }, [messages, loading]); // scrolls on every new message or loading state change

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-6 pb-24">
        {/* Bottom padding for input bar space */}
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className="animate-fade-in-up">
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-full sm:max-w-[85%] relative group">
                    {/* Message bubble */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-5 py-3 shadow-lg break-words whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>

                    {/* User avatar */}
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>

                    {/* Hover-only Edit & Copy buttons outside bottom-right of the bubble */}
                    <div className="absolute -bottom-8 right-10 hidden group-hover:flex z-10 space-x-2">
                      <MessageActions
                        message={msg}
                        index={idx}
                        onEdit={() => onEditMessage(msg.id!, msg.content)}
                        showOnly={["edit", "copy"]}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-full sm:max-w-[85%] w-full group">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="p-3 relative rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                        {msg.isImage ? (
                          <div className="relative group/image">
                            <img
                              src={msg.content}
                              alt="AI Generated"
                              className="rounded-xl w-full max-h-96 object-contain shadow"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const next = e.currentTarget.nextElementSibling;
                                if (next) {
                                  next.textContent = "Failed to load image";
                                  next.classList.remove("hidden");
                                }
                              }}
                            />
                            <div className="hidden text-red-500 text-sm mt-2">
                              Failed to load image
                            </div>
                          </div>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                        <div className="flex justify-end">
                          <MessageActions message={msg} index={idx} small />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      GenOxy is thinking
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

          {/* Reference element for auto-scroll */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
