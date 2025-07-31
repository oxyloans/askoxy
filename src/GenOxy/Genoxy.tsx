// import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
// import { Loader2, Menu, X } from "lucide-react";
// import { useMessages } from "./hooks/useMessages";
// import { useDarkMode } from "./hooks/useDarkMode";
// import { useTextarea } from "./hooks/useTextarea";
// import Header from "./components/Header";
// import WelcomeScreen from "./components/WelcomeScreen";
// import ChatMessages from "./components/ChatMessages";
// import InputBar from "./components/InputBar";
// import Sidebar from "./components/Sidebar";
// import { Message } from "./types/types";
// import "./styles/OpenAi.css";

// interface OpenAiProps {}

// const GenOxy: React.FC<OpenAiProps> = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chatHistory, setChatHistory] = useState<Message[][]>([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);
//   const { darkMode } = useDarkMode();

//   const { handleSend } = useMessages({
//     messages,
//     setMessages,
//     input,
//     setInput,
//     setLoading,
//     messagesEndRef,
//   });

//   const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       await handleSend();
//       // Save current chat to history if it contains messages
//       if (messages.length > 0) {
//         setChatHistory((prev) => [...prev, [...messages]]);
//       }
//     }
//   };

//   const clearChat = () => {
//     if (messages.length > 0) {
//       setChatHistory((prev) => [...prev, [...messages]]);
//     }
//     setMessages([]);
//     setIsSidebarOpen(false);
//   };

//   const loadChat = (chat: Message[]) => {
//     setMessages(chat);
//     setIsSidebarOpen(false);
//   };

//   const showCenteredLayout = messages.length === 0 && !loading;

//   return (
//     <div
//       className={`h-screen flex flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 ${
//         darkMode ? "dark" : ""
//       }`}
//     >
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-30 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } w-64 md:w-64 lg:w-64 sm:relative sm:translate-x-0 sm:flex sm:flex-col`}
//       >
//         <Sidebar
//           chatHistory={chatHistory}
//           loadChat={loadChat}
//           clearHistory={() => setChatHistory([])}
//           toggleSidebar={() => setIsSidebarOpen(false)}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {/* Sticky Header */}
//         {!showCenteredLayout && (
//           <Header
//             clearChat={clearChat}
//             toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//             isSidebarOpen={isSidebarOpen}
//           />
//         )}

//         {showCenteredLayout ? (
//           <WelcomeScreen
//             input={input}
//             setInput={setInput}
//             handleSend={handleSend}
//             handleKeyPress={handleKeyPress}
//             loading={loading}
//             textareaRef={textareaRef}
//           />
//         ) : (
//           <div className="flex-1 flex flex-col min-h-0 relative">
//             {/* Scrollable message container */}
//             <div className="flex-1 flex flex-col min-h-0 relative">
//               <ChatMessages
//                 messages={messages}
//                 messagesEndRef={messagesEndRef}
//                 loading={loading}
//               />
//             </div>

//             {/* Fixed Input Bar */}
//             <div className="shrink-0">
//               <InputBar
//                 input={input}
//                 setInput={setInput}
//                 handleSend={handleSend}
//                 handleKeyPress={handleKeyPress}
//                 loading={loading}
//                 textareaRef={textareaRef}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GenOxy;




import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";

import { Loader2, Menu, X } from "lucide-react";
import { useMessages } from "./hooks/useMessages";
import { useDarkMode } from "./hooks/useDarkMode";
import { useTextarea } from "./hooks/useTextarea";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import InputBar from "./components/InputBar";
import Sidebar from "./components/Sidebar";
import { Message } from "./types/types";
import "./styles/OpenAi.css";

interface OpenAiProps {}

const GenOxy: React.FC<OpenAiProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // Track message being edited
  const { darkMode } = useDarkMode();

  const { handleSend, handleEdit } = useMessages({
    messages,
    setMessages,
    input,
    setInput,
    setLoading,
    messagesEndRef,
    abortControllerRef, // Pass AbortController ref
  });
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setEditingMessageId(null); // Exit edit mode if stopped
  };

  // const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     await handleSend();
  //     // Save current chat to history if it contains messages
  //     if (messages.length > 0) {
  //       setChatHistory((prev) => [...prev, [...messages]]);
  //     }
  //   }
  // };

  // Handle Enter key press for sending or editing messages
  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      if (editingMessageId) {
        await handleEdit(editingMessageId, e.currentTarget.value);
        setEditingMessageId(null);
      } else {
        await handleSend();
        if (messages.length > 0) {
          setChatHistory((prev) => [...prev, [...messages]]);
        }
      }
    }
  };

  const clearChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => [...prev, [...messages]]);
    }
    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
  };

  const loadChat = (chat: Message[]) => {
    setMessages(chat);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
  };

  // Pre-fill textarea with message content for editing
  const editMessage = (messageId: string, content: string) => {
    setInput(content);
    setEditingMessageId(messageId);
    textareaRef.current?.focus();
  };

  const showCenteredLayout = messages.length === 0 && !loading;

  return (
    <div
      className={`h-screen flex flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Sidebar - Only shown when not in WelcomeScreen */}
      {!showCenteredLayout && (
        <div
          className={`fixed inset-y-0 left-0 z-30 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 sm:w-64 md:w-68 lg:w-72 sm:relative sm:translate-x-0 sm:flex sm:flex-col`}
        >
          <Sidebar
            chatHistory={chatHistory}
            loadChat={loadChat}
            clearHistory={() => setChatHistory([])}
            toggleSidebar={() => setIsSidebarOpen(false)}
            clearChat={clearChat}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sticky Header - Only shown when not in WelcomeScreen */}
        {!showCenteredLayout && (
          <Header
            clearChat={clearChat}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            messages={messages}
          />
        )}

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
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Scrollable message container */}
            <div className="flex-1 flex flex-col min-h-0 relative">
              <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
                loading={loading}
                onEditMessage={editMessage}
              />
            </div>

            {/* Fixed Input Bar */}
            <div className="shrink-0">
              <InputBar
                input={input}
                setInput={setInput}
                // handleSend={handleSend}
                handleSend={
                  editingMessageId
                    ? () => handleEdit(editingMessageId, input)
                    : handleSend
                }
                handleKeyPress={handleKeyPress}
                loading={loading}
                textareaRef={textareaRef}
                stopGeneration={stopGeneration}
                isEditing={!!editingMessageId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
