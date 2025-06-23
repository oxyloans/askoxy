import React from "react";
import { Bot, User } from "lucide-react";

import { parseMarkdown } from "../utils/markdown";

import MessageActions from "./MessageActions";
import { Message } from "../types/types";

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
  return (
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
                        </div>
                      ) : (
                        <div
                          className="prose prose-sm max-w-none break-words text-gray-900 dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(msg.content),
                          }}
                        />
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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
