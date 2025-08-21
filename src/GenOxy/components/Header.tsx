import React, { useState, useRef, useEffect } from "react";
import { Menu, Share, Sparkles, ChevronDown, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../types/types";
import { message } from "antd";

interface AssistantPublic {
  name: string;
  slug: string;
  description?: string;
}

interface HeaderProps {
  clearChat: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  messages: Message[];
  activeAssistantName?: string;

  assistants?: AssistantPublic[];
  activeAssistantSlug?: string | null;
  onPickAssistant?: (assistant: AssistantPublic) => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
  messages,
  activeAssistantName,
  assistants = [],
  activeAssistantSlug = null,
  onPickAssistant,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside (DESKTOP ONLY) & on Escape (both views)
  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      // ✅ Do NOT close on mobile; the sheet handles its own closing.
      if (window.innerWidth < 640) return;
      if (!containerRef.current) return;
      const target = e.target as Node;
      if (!containerRef.current.contains(target)) setPickerOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerOpen(false);
    };

    if (pickerOpen) {
      document.addEventListener("mousedown", onClickAway);
      document.addEventListener("keydown", onKey);
      // Prevent body scroll while mobile sheet is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pickerOpen]);

  const shareChat = async () => {
    try {
      if (!messages.length) {
        message.error("No messages to share.");
        return;
      }
      const conversationId = uuidv4();
      const chatSnapshot = {
        id: conversationId,
        messages: messages.map(({ role, content }) => ({ role, content })),
        createdAt: new Date().toISOString(),
      };
      const storageKey = `genoxy_shared_chat_${conversationId}`;
      localStorage.setItem(storageKey, JSON.stringify(chatSnapshot));
      const shareUrl = `${window.location.origin}/genoxy/share/${conversationId}`;
      if (navigator.share) {
        await navigator.share({
          title: "Shared Chat from Genoxy",
          text: `Check out this conversation:\n${shareUrl}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("🔗 Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("❌ Share failed:", error);
      alert("❌ Failed to share the chat.");
    }
  };

  const centerLabel = activeAssistantName?.trim() || "GENOXY";

  return (
    /**
     * Mobile: fixed header (z-50)
     * Desktop: sticky (z-50)
     */
    <header className="flex-shrink-0 fixed top-0 inset-x-0 z-50 sm:sticky sm:top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-3 py-2">
        <div
          className="relative flex items-center justify-between gap-2"
          ref={containerRef}
        >
          {/* LEFT: Menu Icon (mobile only) */}
          <div className="sm:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              type="button"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* RIGHT: LLMs trigger + Share */}
          <div className="ml-auto flex items-center gap-2">
            {/* LLMs trigger (shows active) */}
            {assistants.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setPickerOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold
                             text-purple-600 hover:text-purple-800 hover:bg-purple-50
                             dark:text-white dark:hover:text-purple-200 dark:hover:bg-gray-700 transition-all"
                  aria-haspopup="dialog"
                  aria-expanded={pickerOpen}
                  type="button"
                >
                  <span className="truncate max-w-[9rem] sm:max-w-[12rem]">
                    {activeAssistantName
                      ? `AI LLMs · ${activeAssistantName}`
                      : "AI LLMs"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Desktop dropdown (right-aligned) */}
                {pickerOpen && (
                  <div
                    role="dialog"
                    aria-label="Choose an Assistant"
                    className="hidden sm:block absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-purple-800 dark:text-white">
                        Choose an AI LLM
                      </div>
                      <button
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setPickerOpen(false)}
                        aria-label="Close"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      Pick an assistant to chat with. You can switch anytime.
                    </p>

                    <div className="max-h-64 overflow-auto space-y-2">
                      {assistants.map((a) => {
                        const active = activeAssistantSlug === a.slug;
                        return (
                          <button
                            key={a.slug}
                            onClick={() => {
                              onPickAssistant && onPickAssistant(a);
                              setPickerOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              active
                                ? "bg-purple-50 border-purple-300 text-purple-900 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-100"
                                : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                            }`}
                            type="button"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-sm">
                                {a.name}
                              </div>
                              {active && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                  Active
                                </span>
                              )}
                            </div>
                            {a.description && (
                              <div className="text-xs opacity-80 mt-0.5">
                                {a.description}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Share (desktop only: labeled button) */}
            <button
              onClick={shareChat}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium
                         text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
              type="button"
            >
              <Share className="w-5 h-5 text-purple-700 dark:text-white" />
              <span className="font-semibold text-purple-600 dark:text-white">
                Share
              </span>
            </button>

            {/* Share (mobile only: icon) */}
            <button
              onClick={shareChat}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-purple-600 dark:text-white"
              aria-label="Share chat"
              title="Share"
              type="button"
            >
              <Share className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE LLMs SHEET (full-width overlay) */}
      {pickerOpen && (
        <div className="sm:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/30"
            onClick={() => setPickerOpen(false)}
            type="button"
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 top-14 p-2">
            <div className="mx-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              {/* Sheet header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-base font-semibold text-purple-800 dark:text-white whitespace-nowrap">
                  Choose an AI LLM
                </div>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setPickerOpen(false)}
                  aria-label="Close"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="px-4 pt-2 pb-3 text-xs text-gray-600 dark:text-gray-300">
                Pick an assistant to chat with. You can switch anytime.
              </p>

              <div className="max-h-[60vh] overflow-auto px-4 pb-4 space-y-2">
                {assistants.map((a) => {
                  const active = activeAssistantSlug === a.slug;
                  return (
                    <button
                      key={a.slug}
                      onClick={() => {
                        onPickAssistant && onPickAssistant(a);
                        setPickerOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        active
                          ? "bg-purple-50 border-purple-300 text-purple-900 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-100"
                          : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      }`}
                      type="button"
                    >
                      <div className="font-semibold text-sm">{a.name}</div>
                      {a.description && (
                        <div className="text-xs opacity-80 mt-0.5">
                          {a.description}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
