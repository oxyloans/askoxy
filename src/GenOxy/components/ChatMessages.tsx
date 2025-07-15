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
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
  loading,
}) => {
  // Auto scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]); // Added loading dependency to scroll when loading state changes

  return (
    <div className="flex-1 overflow-y-auto pb-32 sm:pb-24">
      {" "}
      {/* Added padding bottom for input space */}
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
                      <div className="rounded-2xl px-5 py-4 shadow-lg border border-gray-200 te relative">
                        {msg.isImage ? (
                          <div className="relative group/image">
                            <img
                              src={msg.content}
                              alt="AI Generated"
                              className="rounded-xl w-full max-h-96 object-contain shadow-lg"
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
                          // <div
                          //   className="prose prose-sm max-w-none break-words text-gray-900 dark:text-white"
                          //   dangerouslySetInnerHTML={{
                          //     __html: parseMarkdown(msg.content),
                          //   }}
                          // />
                          <MarkdownRenderer content={msg.content} />
                        )}
                        <MessageActions message={msg} index={idx} />
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

          {/* Extra space for better scrolling */}
          <div className="h-4" />
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
