import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message as antdMessage } from "antd";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import InputBar from "./components/InputBar";

import { useMessages } from "./hooks/useMessages";
import { useDarkMode } from "./hooks/useDarkMode";

import BASE_URL from "../Config";
import { Message } from "./types/types";

import "./styles/OpenAi.css";

/* ================================
 * Assistants & Roles
 * ================================ */

type RoleKey = "ceo" | "user" | "provider";

interface AssistantOption {
  id: string;
  name: string;
  description?: string;
}

const ASSISTANTS: AssistantOption[] = [
  { id: "asst_5g20JJbZ88NvcSgNYLMeQTm2", name: "Tie Hyd" },
  { id: "asst_PGnuKq3mSvx96598PTed2XGy", name: "IRDAI" },
];

const ROLE_LABELS: Record<RoleKey, { title: string }> = {
  ceo: { title: "CEO" },
  user: { title: "User" },
  provider: { title: "Provider" },
};

const ROLE_INSTRUCTIONS: Record<RoleKey, string> = {
  ceo: `You are a highly strategic CEO with decades of leadership experience. Focus on big-picture vision, long-term growth, competitive positioning, market trends, and high-impact decision-making. Avoid minor operational details unless they are critical for strategic clarity. Speak with confidence, authority, and clarity. Prioritize vision, risk assessment, ROI, and market opportunities in all responses. Use executive-level language and keep answers concise but impactful.`,
  user: `You are a helpful, empathetic, and friendly guide speaking directly to an everyday user. Focus on explaining concepts simply, solving immediate problems, and improving usability and experience. Avoid technical jargon unless necessary, and define it in plain language when used. Use relatable examples, step-by-step explanations, and a conversational tone so the user feels confident and supported.`,
  provider: `You are an expert service or product provider with deep technical and operational knowledge. Focus on accuracy, detailed execution steps, industry standards, and compliance. Provide comprehensive, process-oriented, and precise responses. Include clear instructions, best practices, and potential pitfalls. Use professional but approachable language to ensure other experts can follow and apply your advice immediately.`,
};

const ASK_ENDPOINT = `${BASE_URL.replace(/\/$/, "")}/student-service/user/askquestion`;

const GenOxy: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [activeAssistant, setActiveAssistant] = useState<AssistantOption | null>(null);
  const [showRolePicker, setShowRolePicker] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { darkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatRoute = location.pathname === "/genoxy/chat";

  // useMessages hook for normal chat/file flows
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

  // Save + reset when switching assistants
  function resetChatForNewAssistant() {
    setChatHistory(prev => (messages.length ? [...prev, [...messages]] : prev));
    setMessages([]);
    setInput("");
    setEditingMessageId(null);
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);

    // Reset assistant flow
    setShowRolePicker(true);
    setSelectedRole(null);
    setPendingInstruction(null);

    navigate("/genoxy/chat");
  }

  const flatten = (s: string) => s.replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();

  // Assistants API (always used when assistant+role active)
  async function askAssistant(
    assistantId: string | null | undefined,
    instruction: string | null | undefined,
    userMessage: { role: "user"; content: string }
  ) {
    if (!assistantId) { antdMessage.error("Pick an assistant first."); return; }
    if (!instruction) { antdMessage.error("Select a role for the assistant."); return; }

    const base = (BASE_URL || "").replace(/\/$/, "");
    const url =
      `${base}/student-service/user/askquestion` +
      `?assistantId=${encodeURIComponent(assistantId)}` +
      `&instruction=${encodeURIComponent(instruction)}`;

    const payload = [{ role: userMessage.role, content: userMessage.content }];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${text || "Request failed"}`);

      let serverMsgs: { role: "user" | "assistant"; content: string }[] | null = null;
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          serverMsgs = parsed.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content ?? ""),
          }));
        }
      } catch {}
      const toAppend = serverMsgs ?? [{ role: "assistant", content: text }];

      setMessages(prev => [
        ...prev,
        ...toAppend.map((m, i) => ({
          id: `m_${Date.now()}_${i}`,
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
      ]);
    } catch (e: any) {
      antdMessage.error(e?.message || "Request failed");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  const handlePickAssistant = (assistant: AssistantOption) => {
    // If switching to a different assistant, reset chat
    if (!activeAssistant || activeAssistant.id !== assistant.id) {
      resetChatForNewAssistant();
    } else {
      // Same assistant clicked again → just show role picker
      setShowRolePicker(true);
      setSelectedRole(null);
      setPendingInstruction(null);
    }
    setActiveAssistant(assistant);
  };

  const onChooseRole = (role: RoleKey) => {
    if (!activeAssistant) return;
    setSelectedRole(role);
    setPendingInstruction(ROLE_INSTRUCTIONS[role]);
    setShowRolePicker(false);
    antdMessage.info(
      `Role "${ROLE_LABELS[role].title}" selected for ${activeAssistant.name}. Start chatting.`
    );
  };

  // ALWAYS use assistant API when assistant+role are active
  const handleAssistantSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) { antdMessage.error("Please enter a message."); return; }
    if (!activeAssistant || !selectedRole) { await handleSend(); return; }

    // Add user's message
    setMessages(prev => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");

    // Call askquestion (again and again in the same assistant session)
    await askAssistant(
      activeAssistant.id,
      pendingInstruction || ROLE_INSTRUCTIONS[selectedRole],
      { role: "user", content: trimmed }
    );
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      const trimmedInput = input.trim();
      const defaultPrompt = "Summarize what this file contains in simple terms.";

      if (!trimmedInput && !selectedFile) {
        antdMessage.error("Please enter a message or upload a file.");
        return;
      }

      // File flows
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
        await handleFileUpload(selectedFile, trimmedInput || defaultPrompt);
        setInput("");
        return;
      }

      // === Core Routing ===
      if (activeAssistant && selectedRole) {
        // Assistant mode: ALWAYS askquestion
        await handleAssistantSend();
        return;
      }

      // Normal flow (non-assistant chat): chat1 api (inside useMessages)
      await handleSend();
      if (messages.length > 0) {
        setChatHistory((prev) => [...prev, [...messages]]);
      }
    }
  };

  const clearChat = () => {
    if (messages.length > 0) setChatHistory((prev) => [...prev, [...messages]]);
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);

    // Leaving assistant → future messages use chat1
    setActiveAssistant(null);
    setShowRolePicker(false);
    setSelectedRole(null);
    setPendingInstruction(null);

    navigate("/genoxy");
  };

  const loadChat = (chat: Message[]) => {
    setMessages(chat);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    navigate("/genoxy/chat");
  };

  const editMessage = (messageId: string, content: string) => {
    setInput(content);
    setEditingMessageId(messageId);
    textareaRef.current?.focus();
  };

  const showCenteredLayout = messages.length === 0 && !loading && !isChatRoute;

  /* ================================
   * Inline Role Picker (page, not modal)
   * ================================ */
  const RolePickerInline: React.FC = () =>
    !showRolePicker ? null : (
      <div className="w-full max-w-5xl mx-auto px-4 py-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
            Who are you today?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Pick a role for <b>{activeAssistant?.name}</b> to tailor responses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.keys(ROLE_LABELS) as RoleKey[]).map((k) => (
              <button
                key={k}
                onClick={() => onChooseRole(k)}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left hover:shadow-md transition bg-white dark:bg-gray-800"
              >
                <div className="text-xs text-gray-500 mb-1">ARE YOU</div>
                <div className="text-2xl font-bold mb-2">{ROLE_LABELS[k].title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  /* ================================
   * Derived Send Handler
   * ================================ */
  const resolvedSendHandler =
    selectedFile
      ? async () => { await handleFileUpload(selectedFile, input); }
      : editingMessageId
      ? () => handleEdit(editingMessageId, input)
      : activeAssistant && selectedRole
      ? handleAssistantSend                  // <-- always assistants API while active
      : handleSend;                          // <-- normal (non-assistant) API

  // Hide input bar until role is chosen if an assistant is selected
  const hideInputBar = showRolePicker || (activeAssistant && !selectedRole);

  /* ================================
   * Render
   * ================================ */

  return (
    <div
      className={`h-screen flex flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Sidebar (dockable) */}
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
            assistants={ASSISTANTS}
            activeAssistantId={activeAssistant?.id ?? null}
            onPickAssistant={handlePickAssistant}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {!showCenteredLayout && (
          <Header
            clearChat={clearChat}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            messages={messages}
          />
        )}

        {showCenteredLayout ? (
          <>
            <RolePickerInline />
            {!showRolePicker && (
              <WelcomeScreen
                input={input}
                setInput={setInput}
                handleSend={resolvedSendHandler}
                handleKeyPress={handleKeyPress}
                loading={loading}
                textareaRef={textareaRef}
                handleFileUpload={handleFileUpload}
                remainingPrompts={remainingPrompts}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <RolePickerInline />

            <div className="flex-1 flex flex-col min-h-0 relative">
              <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
                loading={loading}
                onEditMessage={editMessage}
              />
            </div>

            {/* Input bar is hidden until a role is chosen */}
            {!hideInputBar && (
              <div className="shrink-0">
                <InputBar
                  input={input}
                  setInput={setInput}
                  handleSend={resolvedSendHandler}
                  handleKeyPress={handleKeyPress}
                  loading={loading}
                  textareaRef={textareaRef}
                  stopGeneration={() => {
                    if (abortControllerRef.current) {
                      abortControllerRef.current.abort();
                      abortControllerRef.current = null;
                    }
                    setLoading(false);
                    setEditingMessageId(null);
                  }}
                  isEditing={!!editingMessageId}
                  handleFileUpload={handleFileUpload}
                  remainingPrompts={remainingPrompts}
                  uploadedFile={selectedFile}
                  setUploadedFile={setSelectedFile}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
