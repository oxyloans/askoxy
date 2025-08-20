import React, { useEffect } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "../types/types";
import MessageActions from "./MessageActions";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  onEditMessage: (messageId: string, content: string) => void;
}
// Utility function to clean unwanted characters from content
const cleanContent = (content: string): string => {
  // Remove ?number:number?source? or similar patterns
  
  return content
    .replace(/\?\d+:\d+\?source\?/g, "") // Remove ?number:number?source? patterns
    .replace(/(\w+)\?s/g, "$1") // Remove ?s from words like company?s, year?s
    .replace(/\?.*?\?/g, "") // Remove any other ?...? patterns
    .trim(); // Remove leading/trailing whitespace
};
const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
  loading,
  onEditMessage,
}) => {
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }
    };
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-2 sm:px-4 py-6 pb-28 sm:pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className="animate-fade-in-up">
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] relative group">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md break-words whitespace-pre-wrap">
                      {cleanContent(msg.content)}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-8 right-10 hidden group-hover:flex z-10 space-x-2">
                      <MessageActions
                        message={msg}
                        index={idx}
                        onEdit={() =>
                          onEditMessage(msg.id!, cleanContent(msg.content))
                        }
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
                        {msg.isImage ? (
                          <div className="relative group/image">
                            <img
                              src={msg.content}
                              alt="AI Generated"
                              className="rounded-xl w-full max-h-96 object-contain"
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
                          <MarkdownRenderer
                            content={cleanContent(msg.content)}
                          />
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
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      GENOXY is thinking
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

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
