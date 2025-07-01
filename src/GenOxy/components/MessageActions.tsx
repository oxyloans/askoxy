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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const shareContent = (text: string) => {
    if (navigator.share) {
      navigator
        .share({ text })
        .catch((error) => alert("Sharing failed: " + error));
    } else {
      alert("Sharing is not supported on this browser.");
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
        {/* Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {message.timestamp &&
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>

        {/* Action Buttons */}
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



// import React, { useState } from "react";
// import { Download, Loader2 } from "lucide-react";
// import {
//   ClipboardIcon,
//   ShareIcon,
//   SpeakerWaveIcon,
//   SpeakerXMarkIcon,
// } from "@heroicons/react/24/outline";

// import { Message } from "../types/types";

// interface MessageActionsProps {
//   message: Message;
//   index: number;
// }

// const MessageActions: React.FC<MessageActionsProps> = ({ message, index }) => {
//   const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
//   const [readingAloudId, setReadingAloudId] = useState<string | null>(null);

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard
//       .writeText(text)
//       .then(() => {
//         // Create a temporary toast notification
//         const toast = document.createElement("div");
//         toast.textContent = "Copied to clipboard!";
//         toast.className =
//           "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300";
//         document.body.appendChild(toast);

//         setTimeout(() => {
//           toast.style.opacity = "0";
//           setTimeout(() => document.body.removeChild(toast), 300);
//         }, 2000);
//       })
//       .catch(() => {
//         alert("Failed to copy to clipboard");
//       });
//   };

//   const shareContent = (text: string) => {
//     if (navigator.share) {
//       navigator
//         .share({ text })
//         .catch((error) => console.error("Sharing failed:", error));
//     } else {
//       // Fallback: copy to clipboard
//       copyToClipboard(text);
//     }
//   };

//   const readAloud = (text: string, id: string) => {
//     if (!("speechSynthesis" in window)) {
//       alert("Text-to-speech not supported.");
//       return;
//     }

//     window.speechSynthesis.cancel();

//     if (readingAloudId === id) {
//       setReadingAloudId(null);
//       return;
//     }

//     setReadingAloudId(id);
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onend = () => setReadingAloudId(null);
//     utterance.onerror = () => setReadingAloudId(null);
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleImageDownload = async (imageUrl: string) => {
//     setDownloadingImage(imageUrl);

//     try {
//       // Method 1: Try direct fetch first (works for same-origin or CORS-enabled URLs)
//       try {
//         const response = await fetch(imageUrl);
//         if (response.ok) {
//           const blob = await response.blob();
//           downloadBlob(blob, imageUrl);
//           return;
//         }
//       } catch (e) {
//         console.log("Direct fetch failed, trying alternative method");
//       }

//       // Method 2: Create canvas and convert image to blob
//       const img = new Image();
//       img.crossOrigin = "anonymous";

//       const downloadPromise = new Promise<void>((resolve, reject) => {
//         img.onload = () => {
//           try {
//             const canvas = document.createElement("canvas");
//             const ctx = canvas.getContext("2d");

//             if (!ctx) {
//               reject(new Error("Canvas context not available"));
//               return;
//             }

//             canvas.width = img.naturalWidth;
//             canvas.height = img.naturalHeight;
//             ctx.drawImage(img, 0, 0);

//             canvas.toBlob((blob) => {
//               if (blob) {
//                 downloadBlob(blob, imageUrl);
//                 resolve();
//               } else {
//                 reject(new Error("Failed to create blob"));
//               }
//             }, "image/png");
//           } catch (error) {
//             reject(error);
//           }
//         };

//         img.onerror = () => reject(new Error("Failed to load image"));
//       });

//       img.src = imageUrl;
//       await downloadPromise;
//     } catch (error) {
//       console.error("Download failed:", error);

//       // Method 3: Fallback - open in new tab
//       const link = document.createElement("a");
//       link.href = imageUrl;
//       link.target = "_blank";
//       link.download = getImageFileName();

//       // Try to trigger download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Show user message
//       const toast = document.createElement("div");
//       toast.textContent = "Image opened in new tab. Right-click to save.";
//       toast.className =
//         "fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
//       document.body.appendChild(toast);

//       setTimeout(() => {
//         toast.style.opacity = "0";
//         setTimeout(() => document.body.removeChild(toast), 300);
//       }, 3000);
//     } finally {
//       setDownloadingImage(null);
//     }
//   };

//   const downloadBlob = (blob: Blob, originalUrl: string) => {
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = getImageFileName();

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     // Success notification
//     const toast = document.createElement("div");
//     toast.textContent = "Image downloaded successfully!";
//     toast.className =
//       "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
//     document.body.appendChild(toast);

//     setTimeout(() => {
//       toast.style.opacity = "0";
//       setTimeout(() => document.body.removeChild(toast), 300);
//     }, 2000);
//   };

//   const getImageFileName = () => {
//     const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
//     return `genoxy-image-${timestamp}.png`;
//   };

//   return (
//     <>
//       {message.isImage && (
//         <button
//           onClick={() => handleImageDownload(message.content)}
//           disabled={downloadingImage === message.content}
//           className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 rounded-lg p-2 opacity-80 hover:opacity-100 transition-all duration-200 shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
//           title="Download image"
//         >
//           {downloadingImage === message.content ? (
//             <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
//           ) : (
//             <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//           )}
//         </button>
//       )}
//       <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
//         <div className="text-xs text-gray-500 dark:text-gray-400">
//           {message.timestamp &&
//             new Date(message.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={() => copyToClipboard(message.content)}
//             className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
//             title="Copy message"
//             aria-label="Copy message"
//           >
//             <ClipboardIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => shareContent(message.content)}
//             className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
//             title="Share message"
//             aria-label="Share message"
//           >
//             <ShareIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() =>
//               readAloud(
//                 message.content,
//                 message.id !== undefined ? String(message.id) : String(index)
//               )
//             }
//             className={`text-gray-500 hover:text-gray-700 dark:hover:text-white transition ${
//               readingAloudId === (message.id || String(index))
//                 ? "text-indigo-600"
//                 : ""
//             }`}
//             title={
//               readingAloudId === (message.id || String(index))
//                 ? "Stop reading"
//                 : "Read aloud"
//             }
//             aria-label={
//               readingAloudId === (message.id || String(index))
//                 ? "Stop reading"
//                 : "Read aloud"
//             }
//           >
//             {readingAloudId === (message.id || String(index)) ? (
//               <SpeakerXMarkIcon className="w-5 h-5" />
//             ) : (
//               <SpeakerWaveIcon className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MessageActions;