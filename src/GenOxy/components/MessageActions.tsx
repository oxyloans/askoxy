





import React, { useState } from "react";
import { Download, Loader2, Copy, Check, Pencil } from "lucide-react";
import {
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { Message } from "../types/types";

interface MessageActionsProps {
  message: Message;
  index: number;
  onEdit?: () => void; // Optional callback for editing (user messages only)
  showOnly?: ("edit" | "copy" | "share" | "speak")[];
  small?: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  index,
  onEdit,
  showOnly = ["edit", "copy", "share", "speak"], // default to show all
  small = false,
}) => {
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
  const [readingAloudId, setReadingAloudId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // Track copy state for feedback

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
const buttonSize = small ? "w-6 h-6 text-xs" : "w-8 h-8";
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

  const readAloud = (text: string, id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    if (readingAloudId === id) {
      setReadingAloudId(null);
      return;
    }

    setReadingAloudId(id);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setReadingAloudId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleImageDownload = async (imageUrl: string) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const proxiedUrl = proxyUrl + imageUrl;
    setDownloadingImage(imageUrl);
    try {
      const response = await fetch(proxiedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      link.download = `ai-image-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadingImage(null);
    }
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      {/* Download Image Button (always shown for images) */}
      {message.isImage && (
        <button
          onClick={() => handleImageDownload(message.content)}
          disabled={downloadingImage === message.content}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          title="Download image"
        >
          {downloadingImage === message.content ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>
      )} <div className={`flex gap-1 mt-1 ${small ? "justify-end" : ""}`}>
      {/* Edit Button (only shown if allowed) */}
      {message.role === "user" && onEdit && showOnly.includes("edit") && (
        <button
          onClick={onEdit}
          title="Edit message"
          className="w-6 h-6 flex items-center justify-center rounded-lg  dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {/* Copy Button (only shown if allowed) */}
      {showOnly.includes("copy") && (
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy message"}
          className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors duration-200 ${
            copied
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : " dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
      {/* Share Button (always shown) */}
      {showOnly.includes("share") && (
        <button
          onClick={() => shareContent(message.content)}
          title="Share message"
          className="w-6 h-6 flex items-center justify-center rounded-lg dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <ShareIcon className="w-4 h-4" />
        </button>
      )}
      {/* Read Aloud Button (always shown) */}
      {showOnly.includes("speak") && (
        <button
          onClick={() =>
            readAloud(
              message.content,
              message.id !== undefined ? String(message.id) : String(index)
            )
          }
          title={
            readingAloudId === (message.id || String(index))
              ? "Stop reading"
              : "Read aloud"
          }
          className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors duration-200 ${
            readingAloudId === (message.id || String(index))
              ? "bg-indigo-600 text-white"
              : " dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {readingAloudId === (message.id || String(index)) ? (
            <SpeakerXMarkIcon className="w-4 h-4" />
          ) : (
            <SpeakerWaveIcon className="w-4 h-4" />
          )}
        </button>
        )}
      </div>
    </div>
  );
};

export default MessageActions;

