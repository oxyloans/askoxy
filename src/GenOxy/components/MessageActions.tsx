import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  ClipboardIcon,
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import BASE_URL from "../../Config";

import { Message } from "../types/types";

interface MessageActionsProps {
  message: Message;
  index: number;
}

const MessageActions: React.FC<MessageActionsProps> = ({ message, index }) => {
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
  const [readingAloudId, setReadingAloudId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const shareContent = (text: string) => {
    if (navigator.share) {
      navigator
        .share({
          text,
        })
        .catch((error) => {
          alert("Sharing failed: " + error);
        });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const readAloud = (text: string, id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported in this browser.");
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
      const timestamp = new Date().toISOString().slice(0, 19).replace(":", "-");
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
          className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 disabled:bg-black/50 text-white rounded-lg p-2 opacity-0 group-hover/image:opacity-100 transition-all duration-200"
          title="Download image"
        >
          {downloadingImage === message.content ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {message.timestamp &&
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(message.content)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
            title="Copy message"
            aria-label="Copy message"
          >
            <ClipboardIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => shareContent(message.content)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
            title="Share message"
            aria-label="Share message"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              readAloud(
                message.content,
                message.id !== undefined ? String(message.id) : String(index)
              )
            }
            className={`text-gray-500 hover:text-gray-700 dark:hover:text-white transition ${
              readingAloudId === (message.id || String(index))
                ? "text-indigo-600"
                : ""
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
