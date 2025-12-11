import React, { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "../GenOxy/components/MarkdownRenderer";
import { MessageSquare, X, Send, Settings, Users, Search } from "lucide-react";
import BASE_URL from "../Config";

interface Assistant {
  name: string;
  description: string;
  assistantId: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  assistantName?: string;
}

const ChatInterface2: React.FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingAssistants, setFetchingAssistants] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [selectionWarning, setSelectionWarning] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = `${BASE_URL}/ai-service/agent`;
  const EXCHANGE_API = `${BASE_URL}/ai-service/agent/exchangedata`;

  // Fetch assistants
  const fetchAssistants = async (after?: string) => {
    try {
      setFetchingAssistants(true);
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found in localStorage");
        setFetchingAssistants(false);
        return;
      }

      let url = `${API_BASE}/getAllAssistants?limit=50`;
      if (after) url += `&after=${after}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();

      if (Array.isArray(json.data)) {
        const newAssistants: Assistant[] = json.data
          .filter(
            (item: any) =>
              item.status === "APPROVED" && item.activeStatus === true
          )
          .map((item: any) => ({
            name: item.name || "Unnamed Assistant",
            description: item.description || "No description",
            assistantId: item.assistantId,
          }));

        setAssistants((prev) => [...prev, ...newAssistants]);
      }

      if (json.hasMore && json.lastId) {
        await fetchAssistants(json.lastId);
      }

      setFetchingAssistants(false);
    } catch (err) {
      console.error("Error fetching assistants:", err);
      setFetchingAssistants(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleAssistant = (id: string) => {
    setSelectedAssistants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setSelectionWarning("");
  };

  const openAgentSelector = () => {
    setIsAgentModalOpen(true);
    setSelectionWarning("Select at least one AI Agent to start chatting.");
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (selectedAssistants.length === 0) {
      openAgentSelector();
      return;
    }

    if (loading) return;

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Missing authentication token. Please log in.",
        },
      ]);
      return;
    }

    const userMsg: Message = { role: "user", content: inputMessage };
    const currentMessage = inputMessage;
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);
    setSelectionWarning("");

    try {
      const payload = {
        senderId: "asst_BmQqSU84jBnkGxOWsQJxP9pY",
        receiverIds: selectedAssistants,
        userMessage: currentMessage,
        contextId: "CTX-001",
        sequential: true,
      };

      const res = await fetch(EXCHANGE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const result = await res.json();

      if (result.finalMessage) {
        const firstAssistantName =
          selectedAssistants.length > 0
            ? assistants.find((a) => a.assistantId === selectedAssistants[0])
                ?.name || "OxyLoans Assistant"
            : "OxyLoans Assistant";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.finalMessage,
            assistantName: firstAssistantName,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: JSON.stringify(result) },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${err.message || "Network failure"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssistants = assistants.filter((a) => {
    const q = agentSearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  });

  const selectedAssistantNames = assistants
    .filter((a) => selectedAssistants.includes(a.assistantId))
    .map((a) => a.name);

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-50/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight">
                Agent Builder Chat
              </h1>
              <p className="text-xs sm:text-[11px] text-slate-500">
                Ask once. Let multiple AI agents think together.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* {selectedAssistants.length > 0 ? (
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-500">Agents selected</span>
                <div className="flex flex-wrap gap-1 mt-1 max-w-[200px] justify-end">
                  {selectedAssistantNames.slice(0, 2).map((name) => (
                    <span
                      key={name}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px]"
                    >
                      {name}
                    </span>
                  ))}
                  {selectedAssistantNames.length > 2 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px]">
                      +{selectedAssistantNames.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ) : null} */}

            <button
              type="button"
              onClick={() => setIsAgentModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/80 bg-blue-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Users size={14} />
              {selectedAssistants.length > 0
                ? `${selectedAssistants.length} Agent${
                    selectedAssistants.length > 1 ? "s" : ""
                  }`
                : "Select AI Agents"}
            </button>
          </div>
        </div>
      </header>

      {/* Main layout – full width chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional warning bar */}
        {selectionWarning && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-3xl mx-auto px-4 py-2 text-xs text-amber-800 flex items-center justify-between gap-2">
              <span>{selectionWarning}</span>
              <button
                onClick={() => setSelectionWarning("")}
                className="text-amber-700 hover:text-amber-900"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
            {messages.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20">
                <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
                  <MessageSquare className="h-7 w-7 text-gray-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">
                  How can your AI agents help you today?
                </h2>
                <p className="text-sm text-slate-500 max-w-md">
                  First, select one or more AI agents. Then type your question
                  here – they’ll collaborate to give you a better answer.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-500 transition"
                >
                  <Users size={16} />
                  Select AI Agents
                </button>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-sm"
                          : "bg-white text-slate-900 border border-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.assistantName && msg.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-blue-600">
                          <Settings size={11} />
                          {msg.assistantName}
                        </div>
                      )}
                      <div className="prose prose-sm max-w-none">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:120ms]" />
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:240ms]" />
                      </div>
                      <span>Agents are thinking...</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-200 bg-gray-50/90 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-end gap-2 sm:gap-3">
              {/* Combined input + send button box */}
              <div className="flex-1 flex flex-col gap-2">
                {selectedAssistants.length === 0 && (
                  <button
                    type="button"
                    onClick={openAgentSelector}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors self-start"
                  >
                    <Users size={13} />
                    Please select AI Agents to start chatting
                  </button>
                )}

                {/* Row: textarea + send button */}
                <div className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-1.5 shadow-sm">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    onFocus={() => {
                      if (selectedAssistants.length === 0) {
                        openAgentSelector();
                      }
                    }}
                    placeholder={
                      selectedAssistants.length === 0
                        ? "Select AI Agents first, then type your question..."
                        : "Ask your question... (Press Enter to send, Shift+Enter for new line)"
                    }
                    rows={1}
                    className="max-h-32 min-h-[40px] w-full resize-none bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 py-2"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      loading ||
                      !inputMessage.trim().length ||
                      !selectedAssistants.length
                    }
                    className={`flex items-center justify-center rounded-full p-2 transition-all ${
                      loading ||
                      !inputMessage.trim().length ||
                      !selectedAssistants.length
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-1 text-[10px] text-center text-slate-500">
              Your message will be shared with all selected AI agents.
            </p>
          </div>
        </div>
      </div>

      {/* Agent Selector Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg mx-3 rounded-2xl border border-gray-200 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users size={16} />
                  Select AI Agents
                </p>
                <p className="text-[11px] text-slate-500">
                  Choose one or more agents to join this chat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAgentModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                <Search size={14} className="text-gray-500" />
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Search agents..."
                  className="bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 flex-1"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {fetchingAssistants && assistants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-500">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3" />
                  Loading agents...
                </div>
              ) : filteredAssistants.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-10">
                  No agents found. Try a different search.
                </div>
              ) : (
                filteredAssistants.map((assistant) => {
                  const selected = selectedAssistants.includes(
                    assistant.assistantId
                  );
                  return (
                    <button
                      key={assistant.assistantId}
                      type="button"
                      onClick={() => toggleAssistant(assistant.assistantId)}
                      className={`w-full text-left group rounded-xl px-3 py-2.5 text-xs transition-all border ${
                        selected
                          ? "border-blue-500 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center text-[9px] ${
                            selected
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-400 bg-white text-gray-400"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {assistant.name}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {assistant.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setSelectedAssistants([])}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Clear selection
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  {selectedAssistants.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAgentModalOpen(false);
                    setSelectionWarning("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface2;
