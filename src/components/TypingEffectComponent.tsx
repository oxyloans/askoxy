import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaRegCopy, FaVolumeUp, FaVolumeOff, FaShareAlt } from 'react-icons/fa';
import Example from './Example';

interface Message {
  type: 'question' | 'answer';
  content: string;
}

interface TypingEffectComponentProps {
  messages: Message[];
  isLoading: boolean;
  isReading: boolean;
  handleCopy: (content: string) => void;
  handleReadAloud: (content: string) => void;
  handleShare: (content: string) => void;
}

const TypingEffectComponent: React.FC<TypingEffectComponentProps> = ({
  messages,
  isLoading,
  isReading,
  handleCopy,
  handleReadAloud,
  handleShare,
}) => {
  const [displayedContents, setDisplayedContents] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!isLoading) {
      messages.forEach((message, index) => {
        if (message.type === 'answer' && !displayedContents[index]) {
          const content = message.content;
          let i = 0;
          setDisplayedContents((prev) => ({ ...prev, [index]: '' }));

          const typingInterval = setInterval(() => {
            if (i < content.length) {
              setDisplayedContents((prev) => ({
                ...prev,
                [index]: prev[index] + content[i],
              }));
              i++;
            } else {
              clearInterval(typingInterval);
            }
          }, 50); // Adjust speed here (50ms between characters)

          return () => clearInterval(typingInterval);
        }
      });
    }
  }, [messages, isLoading, displayedContents]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-24">
          {/* Replace with your loading component */}
          <Example variant="loading01" />
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`col-span-8 mb-6 p-3 rounded-md ${
                message.type === 'question' ? 'bg-blue-200 col-span-3 text-black' : 'bg-green-200 col-span-5 text-black'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.type === 'answer' && (
                <>
                  <div className="mt-2">
                    <ReactMarkdown>{displayedContents[index] || ''}</ReactMarkdown>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    {/* Copy Button */}
                    <button
                      className="mr bg-white p-2"
                      onClick={() => handleCopy(message.content)}
                      title="Copy"
                    >
                      <FaRegCopy />
                    </button>

                    {/* Speaker (Read Aloud) Button */}
                    {isReading ? (
                      <button
                        className="mr bg-white p-2"
                        onClick={() => window.speechSynthesis.cancel()}
                        title="Stop Read Aloud"
                      >
                        <FaVolumeOff />
                      </button>
                    ) : (
                      <button
                        className="mr bg-white p-2"
                        onClick={() => handleReadAloud(message.content)}
                        title="Read Aloud"
                      >
                        <FaVolumeUp />
                      </button>
                    )}

                    {/* Share Button */}
                    <button
                      className="mr bg-white p-2"
                      onClick={() => handleShare(message.content)}
                      title="Share"
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default TypingEffectComponent;
