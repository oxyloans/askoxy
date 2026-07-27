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
  Mic,
  Plus,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { message, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/askoxylogonew.png";
import oxyloansLogo from "../../assets/img/image1.png";

// Image tiles
import s4 from "../../assets/img/a3.png";
import s7 from "../../assets/img/a5.png";
import s10 from "../../assets/img/a4.png";
import s12 from "../../assets/img/a2.png";
import s13 from "../../assets/img/s14.png";
import s14 from "../../assets/img/a1.png";

interface WelcomeScreenProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleFileUpload: (files: File[], prompt: string) => void;
  remainingPrompts?: string | null;
  selectedFile: File[];
  setSelectedFile: React.Dispatch<React.SetStateAction<File[]>>;
}

// Tile interface
type Tile = {
  id: string;
  src: string;
  route?: string; // Make route optional since some tiles might show modals
  title: string;
  showModal?: boolean; // New property to indicate if this tile should show a modal
};

// tiles
const tiles: Tile[] = [
  {
    id: "s13",
    src: s13,
    route: "/services/6e44/ai-agents-2-earn-money-zero-in",
    title: "AI Agents Earn Money",
  },
  { id: "s7", src: s7, route: "/genoxy/chat", title: "AI LLMs" },
  { id: "s11", src: s14, route: "/campaign/6972eb83",title: "AI Book"},
  { id: "s12", src: s12, route: "/ai-videos", title: "AI Videos" },
  { id: "s4", src: s4, route: "/ai-masterclasses", title: "AI Masterclasses" },
  {
    id: "s10",
    src: s10,
    route: "/voiceAssistant/welcome",
    title: "OXY Voice Assistant",
  },
];

// Speech recognition interface
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

  const inputBarRef = useRef<HTMLDivElement | null>(null);
  const promptsSectionRef = useRef<HTMLDivElement | null>(null);
  const relatedDropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
    setAfterSelectScrollTarget,
  } = usePrompts(handleSend, setInput);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // URL query bootstrap
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    if (query && !input) {
      const decodedQuery = decodeURIComponent(query);
      setInput(decodedQuery);
      if (decodedQuery.trim() && !loading && selectedFile.length === 0) {
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

  // Smooth scroll utility
  const smoothScrollTo = (el?: HTMLElement | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // handle enter key
  const handleLocalKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedFile.length > 0) {
        handleFileUpload(
          selectedFile,
          input || "Summarize what these files contain in simple terms."
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

  // speech recognition
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

  // File icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-4 h-4" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Scroll after prompt select
  useEffect(() => {
    setAfterSelectScrollTarget(() => () => {
      smoothScrollTo(promptsSectionRef.current);
      setTimeout(() => smoothScrollTo(relatedDropdownRef.current), 250);
      if (textareaRef.current) textareaRef.current.focus();
    });
  }, [setAfterSelectScrollTarget]);

  return (
    <div className="fixed inset-0 overflow-y-auto pointer-events-auto z-0 bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-start px-3 py-6 max-w-6xl pt-16 sm:pt-20 mx-auto w-full pointer-events-auto">
        <div className="text-center mb-6">
          <h2 className="mt-1 text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Welcome to OXYGPT
          </h2>
        </div>

        {/* INPUT BAR */}
        <div
          ref={inputBarRef}
          className="w-full max-w-3xl sticky bottom-0 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-gray-950/60 px-3 py-3"
        >
          <div className="relative group">
            {isRecording && (
              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2.5 py-1 rounded-full text-[11px] shadow-lg animate-pulse">
                🎤 Recording... Tap mic to stop
              </div>
            )}
            <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-35 transition duration-300" />
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/70 dark:border-gray-700 overflow-hidden">
              {/* MULTI FILE PREVIEW */}
              {selectedFile.length > 0 && (
                <div className="px-3 pt-1 pb-1 border-b border-gray-200 dark:border-gray-700 space-y-1 max-h-40 overflow-y-auto">
                  {selectedFile.map((file, idx) => {
                    const isImage = file.type.startsWith("image/");
                    const url = isImage ? URL.createObjectURL(file) : null;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        {isImage ? (
                          <img
                            src={url!}
                            alt={file.name}
                            className="w-8 h-8 object-contain rounded bg-white"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            {getFileIcon(file)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pl-2">
                          <p className="text-[13px] font-medium text-gray-900 dark:text-white leading-tight truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSelectedFile((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors"
                          title="Remove file"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  {selectedFile.length > 1 && (
                    <button
                      onClick={() => setSelectedFile([])}
                      className="text-xs text-red-500 hover:underline ml-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}

              {/* INPUT AREA */}
              <div className="flex">
                <div className="flex-1 px-5 py-2 flex flex-col">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={handleLocalKeyPress}
                    placeholder={
                      selectedFile.length > 0
                        ? "Ask me anything about these files..."
                        : "Ask Anything..."
                    }
                    disabled={loading}
                    rows={1}
                    className="w-full text-[13px] sm:text-sm resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 overflow-auto p-1"
                    style={{ minHeight: "20px" }}
                  />

                  {/* BUTTONS */}
                  <div className="mt-2 flex justify-between items-end flex-wrap sm:flex-nowrap gap-2">
                    <div className="flex gap-1.5">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          const allowed = [
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                            "text/csv",
                            "text/plain",
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ];
                          const validFiles = files.filter((f) =>
                            allowed.includes(f.type)
                          );
                          if (validFiles.length !== files.length) {
                            alert(
                              "Some files were skipped due to unsupported types."
                            );
                          }
                          setSelectedFile((prev) => [...prev, ...validFiles]);
                          e.target.value = "";
                        }}
                        accept=".jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.pdf,.doc,.docx,image/*,text/csv,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />

                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 lg:w-8 lg:h-8 rounded-xl transition-all duration-200 cursor-pointer
                          ${
                            selectedFile.length > 0
                              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        title="Upload files"
                        aria-label="Upload files"
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
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={async () => {
                        if (selectedFile.length > 0) {
                          handleFileUpload(
                            selectedFile,
                            input || "Please describe these files properly."
                          );
                          setInput("");
                        } else {
                          if (!input.trim()) {
                            message.info(
                              "Please enter a message or upload files."
                            );
                            return;
                          }
                          await handleSend();
                        }
                        setShowDropdown(false);
                      }}
                      disabled={
                        (!input.trim() && selectedFile.length === 0) || loading
                      }
                      title="Send"
                      aria-label="Send"
                      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 w-9 h-9 sm:w-9 sm:h-9 lg:w-8 lg:h-8 
                        ${
                          (input.trim() || selectedFile.length > 0) && !loading
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
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
                className="flex items-center px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
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

          {/* Related Dropdown */}
          {showDropdown && relatedOptions.length > 0 && (
            <div
              className="w-full flex justify-center px-3 sm:px-0"
              ref={relatedDropdownRef}
            >
              <div className="max-h-[200px] overflow-y-auto sm:overflow-visible rounded-lg px-4 py-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                  {relatedOptions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question);
                        handleSend(question);
                        setShowDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-full text-white hover:bg-gray-700 transition duration-300 text-xs sm:text-sm min-h-[40px]"
                    >
                      <span className="font-medium truncate">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* IMAGE TILES */}
        <section className="w-full max-w-6xl mx-auto mt-6 px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {tiles.map((t) => (
              <div key={t.id} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    if (t.showModal) {
                      setShowOfferModal(true);
                    } else if (t.route) {
                      navigate(t.route);
                    }
                  }}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-900 transition"
                  aria-label={t.title}
                  title={t.title}
                >
                  <div className="absolute inset-0 p-2">
                    <img
                      src={t.src}
                      alt={t.title}
                      className="w-full h-full object-contain rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </button>
                <span className="mt-2 text-sm font-bold text-gray-900 dark:text-gray-100 text-center">
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* OFFER MODAL */}
      <Modal
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
        footer={null}
        centered
        destroyOnClose
        title="Offer Information"
        width={520}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div
          style={{
            padding: "16px",
          }}
        >
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 16px 12px",
                borderBottom: "1px solid #f0f0f0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Offer Ended
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                The offer ended on <b>31st December 2025</b>.
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "14px 16px 16px",
                display: "grid",
                gap: 12,
              }}
            >
              {/* Info card */}
              <div
                style={{
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  padding: 12,
                }}
              >
                <div
                  style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}
                >
                  The book will be available again soon in our store.
                </div>
              </div>

              {/* Bid card */}
              <div
                style={{
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  Special Appreciation Bid
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "center",
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  To appreciate our first copy buyer, we are hosting a special
                  bid.
                </div>

                {/* Highlight */}
                <div
                  style={{
                    borderRadius: 10,
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                  >
                    The highest bidder wins the first copy
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "#374151" }}>
                    and an exclusive chit-chat session with our CEO.
                  </div>
                </div>

                {/* Note */}
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 10,
                    background: "#F9FAFB",
                    border: "1px solid #f0f0f0",
                    padding: 10,
                    textAlign: "center",
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Stay tuned for updates!
                </div>
              </div>
            </div>
          </div>

          {/* Responsive width helper */}
          <style>
            {`
        /* Make modal fit nicely on small screens */
        .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }
        .ant-modal-content {
          border-radius: 14px !important;
          overflow: hidden;
        }
      `}
          </style>
        </div>
      </Modal>

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto mt-10 mb-6 px-3">
        <div className="flex flex-col items-center gap-3 py-4">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Powered by
          </span>
          <div className="flex items-center gap-6 sm:gap-10">
            <a
              href="https://www.askoxy.ai/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex transition-transform hover:scale-105"
            >
              <img
                src={Logo}
                alt="ASKOXY.AI Logo"
                loading="lazy"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </a>
            <a
              href="https://oxyloans.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex transition-transform hover:scale-105"
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
