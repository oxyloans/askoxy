import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  ClipboardIcon,
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { Message } from "../types/types";

interface MessageActionsProps {
  message: Message;
  index: number;
}

const MessageActions: React.FC<MessageActionsProps> = ({ message, index }) => {
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
  const [readingAloudId, setReadingAloudId] = useState<string | null>(null);

  // Extract code block if exists
  const extractCodeFromMarkdown = (markdown: string) => {
    const codeMatch = markdown.match(/```(?:\w*\n)?([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : markdown;
  };

  const copyToClipboard = (text: string | object) => {
    const plainText =
      typeof text === "string"
        ? extractCodeFromMarkdown(text)
        : JSON.stringify(text, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(plainText)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => alert("Failed to copy text: " + err));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const successful = document.execCommand("copy");
        alert(successful ? "Copied to clipboard!" : "Failed to copy text.");
      } catch (err) {
        alert("Copy not supported");
      }
      document.body.removeChild(textarea);
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
    <>
      {message.isImage && (
        <button
          onClick={() => handleImageDownload(message.content)}
          disabled={downloadingImage === message.content}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 rounded-lg p-2 opacity-80 hover:opacity-100 transition-all duration-200 shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          title="Download image"
        >
          {downloadingImage === message.content ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {message.timestamp &&
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>

        <div className="flex items-center gap-3">
          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(message.content)}
            className="group relative p-1.5 rounded-full text-gray-500 hover:text-white dark:hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition"
            title="Copy message"
            aria-label="Copy message"
          >
            <ClipboardIcon className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => shareContent(message.content)}
            className="group relative p-1.5 rounded-full text-gray-500 hover:text-white dark:hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition"
            title="Share message"
            aria-label="Share message"
          >
            <ShareIcon className="w-5 h-5" />
          </button>

          {/* Read Aloud Button */}
          <button
            onClick={() =>
              readAloud(
                message.content,
                message.id !== undefined ? String(message.id) : String(index)
              )
            }
            className={`group relative p-1.5 rounded-full transition ${
              readingAloudId === (message.id || String(index))
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600"
            }`}
            title={
              readingAloudId === (message.id || String(index))
                ? "Stop reading"
                : "Read aloud"
            }
            aria-label={
              readingAloudId === (message.id || String(index))
                ? "Stop reading"
                : "Read aloud"
            }
          >
            {readingAloudId === (message.id || String(index)) ? (
              <SpeakerXMarkIcon className="w-5 h-5" />
            ) : (
              <SpeakerWaveIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageActions;
