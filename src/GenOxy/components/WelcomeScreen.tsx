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
  Image as ImageIcon,
} from "lucide-react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/askoxylogonew.png";
import oxyloansLogo from "../../assets/img/image1.png";

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
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for smooth-scroll targets
  const inputBarRef = useRef<HTMLDivElement | null>(null);
  const promptsSectionRef = useRef<HTMLDivElement | null>(null);
  const relatedDropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
    setAfterSelectScrollTarget, // NEW: tells hook where to scroll
  } = usePrompts(handleSend, setInput);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Preview for image files
  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [selectedFile]);

  // URL query bootstrap
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

  // Autosize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input, textareaRef]);

  // When dropdown appears, scroll it into view smoothly (mobile + web)
  useEffect(() => {
    if (showDropdown && relatedDropdownRef.current) {
      relatedDropdownRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showDropdown]);

  const smoothScrollTo = (el?: HTMLElement | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-4 h-4" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Tell the hook where to scroll after selecting a prompt (to the prompts block)
  useEffect(() => {
    setAfterSelectScrollTarget(() => () => {
      // First scroll to the prompts section so the “related” block feels connected
      smoothScrollTo(promptsSectionRef.current);
      // Then tiny delay to center the dropdown if it opens below
      setTimeout(() => smoothScrollTo(relatedDropdownRef.current), 250);
      // Also focus input for immediate typing
      if (textareaRef.current) textareaRef.current.focus();
    });
  }, [setAfterSelectScrollTarget]);

  return (
    <div className="fixed inset-0 overflow-y-auto pointer-events-auto z-0 bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col items-center justify-start px-3 py-6 max-w-6xl pt-16 sm:pt-20 mx-auto w-full pointer-events-auto">
        {/* HERO */}
        <div className="text-center mb-6">
          <div className="relative mb-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* 3-line headline (25% smaller) with stronger highlight */}
          {/* <h3 className="text-[21px] leading-snug sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            <span className="marker-underline marker-underline-strong">
              LLM
            </span>{" "}
            for every company,
          </h3>
          <h3 className="mt-1.5 text-[21px] leading-snug sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            <span className="marker-underline">SLM</span> for every department,
          </h3>
          <h3 className="mt-1.5 text-[21px] leading-snug sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            and{" "}
            <span className="marker-underline marker-underline-strong">
              AI twin
            </span>{" "}
            for every employee.
          </h3> */}

          {/* Explore button with extra glow/highlight */}
          {/* <div className="mt-5">
            <button
              onClick={() => navigate("/genoxy/chat")}
              className="relative px-7 py-3.5 rounded-2xl font-extrabold text-white text-base sm:text-lg
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out
                hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-lg -z-10"></span>
              Explore AI LLMs
            </button>
          </div> */}

          {/* Tagline + welcome */}
          {/* <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Select an AI LLM and let’s get started
          </p> */}

          <h2 className="mt-1 text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Welcome to GENOXY
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            How can I assist you today?
          </p>
        </div>

        {/* Decorative backdrop (kept) */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
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
                style={{ animationDelay: `${3 + i}s`, animationDuration: "4s" }}
              />
            </div>
          ))}

          <style>{`
            @keyframes bubble-float {
              0% { transform: translateY(0) scale(1) rotate(0deg); }
              50% { transform: translateY(-10px) scale(1.05) rotate(5deg); }
              100% { transform: translateY(0) scale(1) rotate(0deg); }
            }
            @keyframes bubble-pulse {
              0%,100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.15); opacity: 1; }
            }
            @keyframes snow-fall {
              0% { transform: translateY(0); opacity: 0.5; }
              100% { transform: translateY(-100vh); opacity: 0; }
            }
            .animate-bubble-float { animation: bubble-float infinite ease-in-out; }
            .animate-bubble-pulse { animation: bubble-pulse infinite ease-in-out; }
            .animate-snow-fall { animation: snow-fall infinite linear; }
          `}</style>
        </div>
        {/* highlight style */}
        <style>{`
            .marker-underline {
              position: relative;
              background-image: linear-gradient(
                to top,
                rgba(250, 204, 21, 0.7) 0,
                rgba(250, 204, 21, 0.7) 45%,
                transparent 45%,
                transparent 100%
              );
              background-size: 100% 100%;
              background-repeat: no-repeat;
              padding: 0 2px;
              border-radius: 2px;
            }
            @media (prefers-color-scheme: dark) {
              .marker-underline {
                background-image: linear-gradient(
                  to top,
                  rgba(234, 179, 8, 0.55) 0,
                  rgba(234, 179, 8, 0.55) 45%,
                  transparent 45%,
                  transparent 100%
                );
              }
            }
          `}</style>

        {/* INPUT BAR (smaller, simpler icons) */}
        <div
          ref={inputBarRef}
          className="w-full max-w-3xl sticky bottom-0 z-10 bg-white dark:bg-gray-900 px-3 py-3"
        >
          <div className="relative group">
            {isRecording && (
              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2.5 py-1 rounded-full text-[11px] shadow-lg animate-pulse">
                🎤 Recording... Tap mic to stop
              </div>
            )}
            <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-35 transition duration-300" />
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
                <div className="flex-1 px-5 py-2 flex flex-col">
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
                      className="w-full text-[13px] sm:text-sm resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 overflow-auto p-1"
                      style={{ minHeight: "20px" }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between items-end flex-wrap sm:flex-nowrap gap-2">
                    <div className="flex gap-1.5">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const isAllowed = [
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
                          ].includes(file.type);
                          if (!isAllowed) {
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
                        className={`inline-flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 lg:w-8 lg:h-8 rounded-xl transition-all duration-200 cursor-pointer
                          ${
                            selectedFile
                              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        title="Upload file"
                        aria-label="Upload file"
                      >
                        <Plus className="w-4 h-4" />
                      </label>

                      <button
                        onClick={handleToggleVoice}
                        title="Voice Input"
                        aria-label="Voice input"
                        disabled={loading}
                        className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 w-9 h-9 sm:w-9 sm:h-9 lg:w-8 lg:h-8 
                          ${
                            isRecording
                              ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        <Mic className="w-4 h-4" />
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
                      aria-label="Send"
                      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 w-9 h-9 sm:w-9 sm:h-9 lg:w-8 lg:h-8 
                        ${
                          (input.trim() || selectedFile) && !loading
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUGGESTIONS */}
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

        {/* Related Questions Dropdown */}
        {showDropdown && relatedOptions.length > 0 && (
          <div className="w-full flex justify-center px-3 sm:px-0">
            <div className="max-h-[200px] overflow-y-auto sm:overflow-visible  rounded-lg  px-4 py-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {relatedOptions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      handleSend(question);
                      setShowDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white hover:bg-gray-600 transition duration-300 text-xs sm:text-sm min-h-[40px]"
                  >
                    <span className="font-medium truncate">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      {/* Powered by – footer logos */}
      <footer className="w-full max-w-6xl mx-auto mt-10 mb-6 px-3">
        {/* New Buttons Section */}
        {/* <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => navigate("/genoxy/llm-faqs")}
            className="px-6 py-3.5 rounded-2xl font-semibold text-white text-sm sm:text-base
              bg-purple-600 hover:bg-purple-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-purple-500
              shadow-md transition-all"
          >
            Insurance AI LLM 100 FAQs
          </button>

          <button
            onClick={() => navigate("/genoxy/faqslide")}
            className="px-6 py-3.5 rounded-2xl font-semibold text-white text-sm sm:text-base
              bg-pink-600 hover:bg-pink-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-pink-500
              shadow-md transition-all"
          >
            FAQ Slide
          </button>
        </div> */}

        {/* Existing footer logos */}
        <div className="flex flex-col items-center gap-3 py-4 dark:border-gray-700">
  {/* Powered By Label */}
  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
    Powered by
  </span>

  {/* Logo Row */}
  <div className="flex items-center gap-6 sm:gap-10">
    {/* ASKOXY.AI Logo */}
    <a
      href="https://www.askoxy.ai/"
      target="_blank"
      rel="noreferrer"
      className="inline-flex transition-transform hover:scale-105"
      title="ASKOXY.AI"
      aria-label="Visit ASKOXY.AI"
    >
      <img
        src={Logo}
        alt="ASKOXY.AI Logo"
        loading="lazy"
        className="h-10 sm:h-12 md:h-14 w-auto object-contain"
      />
    </a>

    {/* OxyLoans Logo */}
    <a
      href="https://oxyloans.com/"
      target="_blank"
      rel="noreferrer"
      className="inline-flex transition-transform hover:scale-105"
      title="OxyLoans"
      aria-label="Visit OxyLoans"
    >
      <img
        src={oxyloansLogo}
        alt="OxyLoans Logo"
        loading="lazy"
        className="h-10 sm:h-12 md:h-14 w-auto object-contain"
      />
    </a>
  </div>
</div>

      </footer>
    </div>
  );
};

export default WelcomeScreen;
