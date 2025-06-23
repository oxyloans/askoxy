import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { useMessages } from "./hooks/useMessages";
import { useDarkMode } from "./hooks/useDarkMode";
import { useTextarea } from "./hooks/useTextarea";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import InputBar from "./components/InputBar";
import { Message } from "./types/types";
import "./styles/OpenAi.css";

interface OpenAiProps {}

const GenOxy: React.FC<OpenAiProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { darkMode } = useDarkMode();
  const { handleSend } = useMessages(
    messages,
    setMessages,
    input,
    setInput,
    setLoading,
    
  );
 
  const showCenteredLayout = messages.length === 0 && !loading;

  // const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };
  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };
  return (
    <div
      className={`h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {!showCenteredLayout && <Header clearChat={() => setMessages([])} />}
      <main
        className={`flex-1 ${
          showCenteredLayout ? "flex flex-col" : "overflow-y-auto"
        }`}
      >
        {showCenteredLayout ? (
          <WelcomeScreen
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyPress={handleKeyPress}
            loading={loading}
            textareaRef={textareaRef}
          />
        ) : (
          <ChatMessages
            messages={messages}
            messagesEndRef={messagesEndRef}
            loading={loading}
          />
        )}
      </main>
      {!showCenteredLayout && (
        <InputBar
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyPress={handleKeyPress}
          loading={loading}
          textareaRef={textareaRef}
        />
      )}
    </div>
  );
};

export default GenOxy;
