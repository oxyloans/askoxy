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
import { message } from "antd";
import { ThreeDRotation } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const { darkMode } = useDarkMode();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const location = useLocation(); // Added: Get current location/path
  const navigate = useNavigate(); // Added: For programmatic navigation
const isChatRoute = location.pathname === "/genoxy/chat";
  const { handleSend, handleEdit, handleFileUpload } = useMessages({
    messages,
    setMessages,
    input,
    setInput,
    setLoading,
    threadId,
    setThreadId,
    messagesEndRef,
    abortControllerRef,
    remainingPrompts,
    setRemainingPrompts,
  });

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setEditingMessageId(null);
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      const trimmedInput = input.trim();
      const defaultPrompt =
        "Summarize what this file contains in simple terms.";

      if (!trimmedInput && !selectedFile) {
        message.error("Please enter a message or upload a file.");
        return;
      }

      if (editingMessageId && selectedFile && trimmedInput) {
        await handleFileUpload(selectedFile, trimmedInput);
        setEditingMessageId(null);
        setSelectedFile(null);
        return;
      }

      if (editingMessageId && trimmedInput) {
        await handleEdit(editingMessageId, trimmedInput);
        setEditingMessageId(null);
        return;
      }

      if (selectedFile) {
        const hasPromptsLeft = Number(remainingPrompts) >= 0;

        if (remainingPrompts !== null) {
          if (hasPromptsLeft) {
            await handleFileUpload(selectedFile, trimmedInput || defaultPrompt);
          } else if (trimmedInput) {
            console.log("No prompts left — sending input as normal message...");
            await handleSend(trimmedInput);
          } else {
            return;
          }
        } else {
          // console.log("remainingPrompts is null — uploading file anyway...");
          await handleFileUpload(selectedFile, trimmedInput || defaultPrompt);
        }

        setInput("");
        return;
      }

      await handleSend();
      if (messages.length > 0) {
        setChatHistory((prev) => [...prev, [...messages]]);
      }
    }
  };

  const clearChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => [...prev, [...messages]]);
    }
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    navigate("/genoxy");
  };

  const loadChat = (chat: Message[]) => {
    setMessages(chat);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    navigate("/genoxy/chat"); // Added: Navigate to /genoxy/chat when loading a chat
  };

  const editMessage = (messageId: string, content: string) => {
    setInput(content);
    setEditingMessageId(messageId);
    textareaRef.current?.focus();
  };

 const showCenteredLayout = messages.length === 0 && !loading && !isChatRoute;

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
            handleFileUpload={handleFileUpload}
            remainingPrompts={remainingPrompts}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="flex-1 flex flex-col min-h-0 relative">
              <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
                loading={loading}
                onEditMessage={editMessage}
              />
            </div>

            <div className="shrink-0">
              <InputBar
                input={input}
                setInput={setInput}
                handleSend={
                  selectedFile
                    ? async () => {
                        await handleFileUpload(selectedFile, input);
                      }
                    : editingMessageId
                    ? () => handleEdit(editingMessageId, input)
                    : handleSend
                }
                handleKeyPress={handleKeyPress}
                loading={loading}
                textareaRef={textareaRef}
                stopGeneration={stopGeneration}
                isEditing={!!editingMessageId}
                handleFileUpload={handleFileUpload}
                remainingPrompts={remainingPrompts}
                uploadedFile={selectedFile}
                setUploadedFile={setSelectedFile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
