import { usePrompts } from "../hooks/usePrompts";
import React, {
  ChangeEvent,
  useState,
  useRef,
  KeyboardEvent,
  useEffect,
} from "react";
import {
  ArrowUp,
  Loader2,
  Sparkles,
  Mic,
  Plus,
  X,
  FileText,
  Image,
} from "lucide-react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

interface WelcomeScreenProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleFileUpload: (file: File, prompt: string) => void;
  remainingPrompts?: string | null;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  loading,
  textareaRef,
  handleFileUpload,
  selectedFile,
  setSelectedFile,
}) => {
  const {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
  } = usePrompts(handleSend, setInput);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    if (query && !input) {
      const decodedQuery = decodeURIComponent(query);
      setInput(decodedQuery);
      if (decodedQuery.trim() && !loading && !selectedFile) {
        handleSend(decodedQuery).then(() => {
          setShowDropdown(false);
          setInput("");
        });
      }
    }
  }, [
    location.search,
    setInput,
    handleSend,
    loading,
    input,
    selectedFile,
    setShowDropdown,
  ]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input, textareaRef]);

  const handleLocalKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedFile) {
        handleFileUpload(
          selectedFile,
          input || "Summarize what this file contains in simple terms."
        );
        setInput("");
      } else {
        if (!input.trim()) {
          message.info("Please enter a message or upload a file.");
          return;
        }
        await handleSend();
      }
      setShowDropdown(false);
    }
  };

  const handleToggleVoice = (): void => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    recognition.onstart = (): void => setIsRecording(true);
    recognition.onresult = (event: any): void => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) transcript += result[0].transcript + " ";
      }
      if (transcript.trim())
        setInput((prev) => (prev.trim() + " " + transcript.trim()).trim());
    };
    recognition.onerror = (): void => setIsRecording(false);
    recognition.onend = (): void => setIsRecording(false);
    recognition.start();
  };

  const isValidFileType = (file: File): boolean => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/csv",
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".csv",
      ".txt",
      ".pdf",
      ".doc",
      ".docx",
    ];
    const fileExtension =
      "." + (file.name.split(".").pop()?.toLowerCase() || "");
    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension)
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 overflow-y-auto pointer-events-auto z-0 bg-white dark:bg-gray-900">
      {/* Header with button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate("/genoxy/chat")}
          className="px-6 py-3 rounded-xl font-bold text-white 
             bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
             shadow-lg hover:shadow-2xl transform hover:-translate-y-1 
             transition-all duration-300 ease-in-out"
        >
          Explore AI ASSISTANTS
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 max-w-6xl pt-20 mx-auto w-full pointer-events-auto">
        <div className="text-center mb-6">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2">
            Welcome to GenOxy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Pick an assistant from the sidebar to begin.
          </p>
        </div>

        {/* Decorative backdrop (kept) */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Floating Gradient Bubbles */}
          {[
            { left: "10%", top: "20%" },
            { right: "15%", top: "30%" },
            { left: "50%", bottom: "10%" },
          ].map((pos, i) => (
            <div
              key={`g1-${i}`}
              className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-bubble-float"
              style={{
                ...pos,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${8 + i}s`,
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full animate-bubble-pulse"
                style={{
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: "3s",
                }}
              />
            </div>
          ))}

          {/* Snowfall Effect */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute rounded-full bg-white opacity-20 blur-sm animate-snow-fall"
              style={{
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                left: `${Math.random() * 100}%`,
                bottom: `-${Math.random() * 50}px`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${25 + i * 6}s`,
              }}
            />
          ))}

          {/* More Floating Gradients */}
          {[
            { left: "70%", top: "15%" },
            { right: "5%", top: "70%" },
            { left: "25%", bottom: "30%" },
          ].map((pos, i) => (
            <div
              key={`g2-${i}`}
              className="absolute w-5 h-5 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full animate-bubble-float"
              style={{
                ...pos,
                animationDelay: `${2 + i}s`,
                animationDuration: `${7 + i}s`,
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-bubble-pulse"
                style={{
                  animationDelay: `${2 + i}s`,
                  animationDuration: "3.5s",
                }}
              />
            </div>
          ))}

          {[
            { right: "25%", top: "50%" },
            { left: "5%", top: "60%" },
            { left: "80%", bottom: "30%" },
          ].map((pos, i) => (
            <div
              key={`g3-${i}`}
              className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-bubble-float"
              style={{
                ...pos,
                animationDelay: `${3 + i}s`,
                animationDuration: `${9 + i}s`,
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-bubble-pulse"
                style={{
                  animationDelay: `${3 + i}s`,
                  animationDuration: "4s",
                }}
              />
            </div>
          ))}

          {/* Custom animations */}
          <style>{`
          @keyframes bubble-float {
            0% {
              transform: translateY(0) scale(1) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) scale(1.05) rotate(5deg);
            }
            100% {
              transform: translateY(0) scale(1) rotate(0deg);
            }
          }

          @keyframes bubble-pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.15);
              opacity: 1;
            }
          }

          @keyframes snow-fall {
            0% {
              transform: translateY(0);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-100vh);
              opacity: 0;
            }
          }

          .animate-bubble-float {
            animation: bubble-float infinite ease-in-out;
          }

          .animate-bubble-pulse {
            animation: bubble-pulse infinite ease-in-out;
          }

          .animate-snow-fall {
            animation: snow-fall infinite linear;
          }
        `}</style>
        </div>

        {/* Chat input (unchanged) */}
        <div className="w-full max-w-3xl sticky bottom-0 z-10 bg-white dark:bg-gray-900 px-3 py-3">
          <div className="relative group">
            {isRecording && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
                🎤 Recording... Tap mic to stop
              </div>
            )}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {selectedFile && (
                <div className="px-3 pt-1 pb-1 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="File preview"
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                        {getFileIcon(selectedFile)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pl-2">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-white leading-tight truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex">
                <div className="flex-1 px-6 py-2 flex flex-col">
                  <div className="flex-grow">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setInput(e.target.value)
                      }
                      onKeyDown={handleLocalKeyPress}
                      placeholder={
                        selectedFile
                          ? "Ask me anything about this file..."
                          : "Type your message..."
                      }
                      disabled={loading}
                      rows={1}
                      className="w-full text-sm sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 overflow-auto p-1"
                      style={{ minHeight: "20px" }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between items-end flex-wrap sm:flex-nowrap gap-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!isValidFileType(file)) {
                            alert(
                              "Please select only: Images (JPEG, PNG, GIF, WebP), CSV, TXT, PDF, or Word documents (.doc, .docx)"
                            );
                            e.target.value = "";
                            return;
                          }
                          setSelectedFile(file);
                          e.target.value = "";
                        }}
                        accept=".jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.pdf,.doc,.docx,image/*,text/csv,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 cursor-pointer
                        ${
                          selectedFile
                            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        title="Upload file"
                      >
                        <Plus className="w-5 h-5" />
                      </label>

                      <button
                        onClick={handleToggleVoice}
                        title="Voice Input"
                        disabled={loading}
                        className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 w-11 h-11
                          ${
                            isRecording
                              ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={async () => {
                        if (selectedFile) {
                          handleFileUpload(
                            selectedFile,
                            input || "please describe the file content properly"
                          );
                          setInput("");
                        } else {
                          if (!input.trim()) {
                            message.info(
                              "Please enter a message or upload a file."
                            );
                            return;
                          }
                          await handleSend();
                        }
                        setShowDropdown(false);
                      }}
                      disabled={(!input.trim() && !selectedFile) || loading}
                      title="Send"
                      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 w-11 h-11
                        ${
                          (input.trim() || selectedFile) && !loading
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowUp className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions (unchanged) */}
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col gap-6 sm:gap-8">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:flex-wrap sm:justify-center">
            {suggestionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const isMobile = window.innerWidth < 640;
                  if (isMobile) {
                    setInput(prompt.text);
                    handleSend(prompt.text);
                    setShowDropdown(false);
                  } else {
                    handlePromptSelect(prompt.text, prompt.related);
                  }
                }}
                className="flex items-center px-3 py-2 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-br ${prompt.gradient} text-white text-xs`}
                >
                  {prompt.icon}
                </div>
                <span className="font-medium">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
