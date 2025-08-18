import React from "react";
import { Menu, Share, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../types/types";

interface HeaderProps {
  clearChat: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  messages: Message[];
  /** NEW: name of the active assistant; falls back to GENOXY if not set */
  activeAssistantName?: string;
}

const Header: React.FC<HeaderProps> = ({
  clearChat,
  toggleSidebar,
  isSidebarOpen,
  messages,
  activeAssistantName,
}) => {
  const shareChat = async () => {
    try {
      if (!messages.length) {
        alert("No chat to share.");
        return;
      }

      const conversationId = uuidv4();

      // Save snapshot locally
      const chatSnapshot = {
        id: conversationId,
        messages: messages.map(({ role, content }) => ({ role, content })),
        createdAt: new Date().toISOString(),
      };

      const storageKey = `genoxy_shared_chat_${conversationId}`;
      localStorage.setItem(storageKey, JSON.stringify(chatSnapshot));

      // Generate the share URL
      const shareUrl = `${window.location.origin}/genoxy/share/${conversationId}`;

      // Prefer Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: "Shared Chat from Genoxy",
          text: `Check out this conversation:\n${shareUrl}`,
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("🔗 Share link copied to clipboard!");
      }
    } catch (error: any) {
      console.error("❌ Share failed:", error);
      alert("❌ Failed to share the chat.");
    }
  };

  const shareContent = async (text: string) => {
    if (!navigator.share) {
      alert("Sharing is not supported on this browser.");
      return;
    }
    try {
      await navigator.share({
        title: "Shared from MyApp",
        text,
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        alert("Sharing failed: " + error.message);
      }
    }
  };

  const centerLabel = activeAssistantName?.trim() || "GENOXY";

  return (
    <header className="flex-shrink-0 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-2 py-1">
        <div className="relative flex items-center justify-between">
          {/* LEFT: Menu Icon (mobile only) */}
          <div className="sm:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              data-testid="sidebar-toggle-button"
              data-state={isSidebarOpen ? "open" : "closed"}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center badge: shows active assistant name or GENOXY */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-700 transition-all duration-200"
              title={centerLabel}
            >
              <Sparkles className="w-5 h-5 text-purple-700 dark:text-white" />
              <span className="font-semibold text-purple-700 text-sm dark:text-white">
                {centerLabel}
              </span>
            </div>
          </div>

          {/* RIGHT: Share button */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() =>
                shareContent(
                  messages.length
                    ? messages[messages.length - 1].content
                    : "Check out GENOXY!"
                )
              }
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 hover:dark:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200"
            >
              <Share className="w-5 h-5 text-purple-700 dark:text-white" />
              <span className="hidden sm:inline font-semibold text-purple-600 dark:text-white">
                Share
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
