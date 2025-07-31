
import React from "react";
import { Menu, Share, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../types/types";
interface HeaderProps {
  clearChat: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  messages: Message[]; 
}

const Header: React.FC<HeaderProps> = ({
  clearChat,
  toggleSidebar,
  isSidebarOpen,
  messages,
}) => {
  const shareChat = async () => {
    try {
      // Generate a unique conversation ID
      const conversationId = uuidv4();
      // Mock URL for the shared conversation (replace with actual backend endpoint if available)
      const shareUrl = `${window.location.origin}/genoxy/share/${conversationId}`;

      // Simulate storing the conversation snapshot (in a real app, this would be sent to a backend)
      const conversationSnapshot = {
        id: conversationId,
        messages: messages.map(({ role, content }) => ({ role, content })), // Snapshot of current messages
        timestamp: new Date().toISOString(),
      };
      console.log("Sharing conversation snapshot:", conversationSnapshot);

      // Copy the URL to the clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert(
        "Link copied to clipboard! Share it with others to view the conversation. Note: Anyone with the link can view it, so avoid sharing sensitive information."
      );
    } catch (error) {
      console.error("Failed to share conversation:", error);
      alert("Failed to copy share link. Please try again.");
    }
  };




  // const shareChat = async () => {
  //   try {
  //     if (!messages.length) {
  //       alert("No conversation to share.");
  //       return;
  //     }

  //     const chatSnapshot = {
  //       messages: messages.map(({ role, content }) => ({ role, content })),
  //       createdAt: new Date().toISOString(),
  //     };

  //     // Encode the data to base64
  //     const encoded = btoa(JSON.stringify(chatSnapshot));
  //     const shareUrl = `${window.location.origin}/genoxy/share?data=${encoded}`;

  //     // Save it locally too (optional)
  //     localStorage.setItem(
  //       `genoxy_share_${Date.now()}`,
  //       JSON.stringify(chatSnapshot)
  //     );

  //     // Copy to clipboard
  //     await navigator.clipboard.writeText(shareUrl);

  //     alert("✅ Share link copied to clipboard!");
  //   } catch (error) {
  //     console.error("Share error:", error);
  //     alert("❌ Failed to share the conversation.");
  //   }
  // };
  return (
    

    <header className="flex-shrink-0 sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="relative flex items-center justify-between">
          {/* LEFT: Menu Icon (mobile only) */}
          <div className="sm:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              data-testid="sidebar-toggle-button"
              data-state={isSidebarOpen ? "open" : "closed"}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Sparkles + GENOXY */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-700 text-sm dark:bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
              GENOXY
            </span>
          </div>

          {/* RIGHT: Share button */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={shareChat}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white  dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200"
            >
              <Share className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline font-semibold text-purple-600">
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