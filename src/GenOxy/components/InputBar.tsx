import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import { ArrowUp, Loader2, Mic, X, Plus, FileText, Image } from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  stopGeneration: () => void;
  isEditing: boolean;
  handleFileUpload: (file: File, prompt: string) => void;
  remainingPrompts: string | null;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  questionCount: number;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  /** assistant-specific disclaimer shown via a modal trigger */
  disclaimerText?: string | null;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

const InputBar: React.FC<InputBarProps> = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  loading,
  textareaRef,
  stopGeneration,
  isEditing,
  handleFileUpload,
  remainingPrompts,
  uploadedFile,
  setUploadedFile,
  questionCount,
  showModal,
  setShowModal,
  disclaimerText,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isLocallyUploaded, setIsLocallyUploaded] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const LOGIN_URL = "/whatsapplogin";

  // Handle sign-in logic for redirecting to login or navigating to genoxy
  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/genoxy/chat";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync input bar height for layout consistency
  useEffect(() => {
    const setVar = () => {
      const h = barRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--inputbar-height", `${h}px`);
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, [input, uploadedFile, isLocallyUploaded, showDisclaimer, loading]);

  // Autosize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input, textareaRef]);

  // Close disclaimer modal on ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e as any).key === "Escape") setShowDisclaimer(false);
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, []);

  // Toggle voice input using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) transcript += result[0].transcript + " ";
      }
      if (transcript.trim()) {
        setInput((prev) => (prev.trim() + " " + transcript.trim()).trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      alert("Voice input failed: " + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  // Handle file selection for upload
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsLocallyUploaded(true);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setFilePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      e.target.value = "";
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setIsLocallyUploaded(false);
  };

  // Handle form submission (text or file)
  const handleSubmit = async () => {
    // Check if limit is reached before attempting to submit
    if (isLimitReached) {
      setShowModal(true); // Show modal if user tries to submit after limit
      message.error("You've reached the 4-prompt limit. Please sign in.");
      return;
    }

    const trimmedInput = input.trim();
    const defaultPrompt = "Summarize what this file contains in simple terms.";

    if (!trimmedInput && !uploadedFile) {
      message.error("Please enter a message or upload a file.");
      return;
    }

    if (uploadedFile) {
      const hasPromptsLeft = Number(remainingPrompts) > 0;

      if (remainingPrompts !== null) {
        if (hasPromptsLeft) {
          handleFileUpload(uploadedFile, trimmedInput || defaultPrompt);
        } else if (trimmedInput) {
          await handleSend(trimmedInput);
        } else {
          return;
        }
      } else {
        handleFileUpload(uploadedFile, trimmedInput || defaultPrompt);
      }

      setInput("");
      return;
    }

    await handleSend();
  };

  // Get appropriate icon for uploaded file
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Check if user is logged in and if question limit is reached
  const isLoggedIn = !!localStorage.getItem("userId");
  const isLimitReached = !isLoggedIn && questionCount >= 4;

  // Trigger modal when user focuses on disabled input
  const handleInputFocus = () => {
    if (isLimitReached) {
      setShowModal(true); // Show modal when user tries to type after limit
      message.error("You've reached the 4-prompt limit. Please sign in.");
    }
  };

  return (
    <>
      <div
        ref={barRef}
        className="
          fixed bottom-0 inset-x-0 z-50 md:sticky md:bottom-0
          bg-gradient-to-t from-white via-white/95 to-transparent
          dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent
          border-t border-gray-200/50 dark:border-gray-700/50
          backdrop-blur-sm
        "
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
      >
        {isRecording && (
          <div className="px-3 pt-2">
            <div className="w-full text-center bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-md animate-pulse">
              🎤 Recording... Tap mic to stop
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-2 pb-2 pt-2 md:p-2">
          <div className="relative group">
            <div className="hidden sm:block absolute -inset-1 rounded-2xl blur bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-30 transition duration-300 pointer-events-none" />
            <div
              className="
                relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg sm:shadow-2xl
                border border-gray-200 dark:border-gray-700
                focus-within:border-indigo-500 dark:focus-within:border-indigo-400
                focus-within:ring-4 focus-within:ring-indigo-500/10
                transition-all duration-200 overflow-hidden
              "
            >
              {uploadedFile && isLocallyUploaded && (
                <div className="px-3 pt-1 pb-1 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="File preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        {getFileIcon(uploadedFile)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-white leading-tight truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex">
                <div className="flex-1 px-4 py-2 flex flex-col">
                  <div className="flex-grow">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setInput(e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                      onFocus={handleInputFocus} // Added: Trigger modal on focus if limit reached
                      placeholder={
                        isLimitReached
                          ? "Limit reached! Sign in for unlimited prompts."
                          : isEditing
                          ? "Edit your message..."
                          : uploadedFile
                          ? "Add a message about your file..."
                          : loading
                          ? "Generating reply, no need to wait."
                          : "Type your message..."
                      }
                      disabled={
                        (remainingPrompts !== null &&
                          Number(remainingPrompts) === 0) ||
                        isLimitReached
                      }
                      rows={1}
                      className="w-full text-[16px] sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 overflow-auto p-1"
                      style={{ minHeight: "20px" }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between items-end flex-wrap gap-2">
                    <div className="flex gap-2">
                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center justify-center appearance-none w-11 h-11 sm:w-11 sm:h-11 lg:w-8 lg:h-8 rounded-xl transition-all duration-200 cursor-pointer ${
                          uploadedFile
                            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        title="Upload file"
                      >
                        <Plus className="w-6 h-6" />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />

                      <button
                        onClick={handleToggleVoice}
                        title="Voice Input"
                        disabled={loading || isEditing}
                        className={`inline-flex items-center justify-center appearance-none rounded-xl transition-all duration-200 w-11 h-11 sm:w-11 sm:h-11 lg:w-8 lg:h-8 ${
                          isRecording
                            ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        aria-label="Voice input"
                      >
                        <Mic className="w-6 h-6" />
                      </button>

                      {disclaimerText ? (
                        <button
                          type="button"
                          onClick={() => setShowDisclaimer(true)}
                          title="Show Disclaimer"
                          className="inline-flex items-center justify-center appearance-none w-11 h-11 sm:w-11 sm:h-11 lg:w-8 lg:h-8 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                          aria-haspopup="dialog"
                          aria-controls="disclaimer-modal"
                        >
                          <span className="text-sm font-bold">D</span>
                        </button>
                      ) : null}
                    </div>

                    <button
                      onClick={handleSubmit} // Updated: Use handleSubmit to check limit
                      disabled={
                        (!loading && !input.trim() && !uploadedFile) ||
                        isRecording ||
                        isLimitReached
                      }
                      aria-label={
                        loading
                          ? "Stop generation"
                          : isEditing
                          ? "Save message"
                          : uploadedFile
                          ? "Send file with message"
                          : "Send message"
                      }
                      className={`inline-flex items-center justify-center appearance-none rounded-xl transition-all duration-200 w-11 h-11 sm:w-11 sm:h-11 lg:w-8 lg:h-8 ${
                        loading
                          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 shadow-lg"
                          : (input.trim() || uploadedFile) && !isRecording
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <ArrowUp className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {input?.length > 0 && (
                <div className="absolute bottom-full right-4 text-xs text-gray-500 dark:text-gray-400 pb-1">
                  {input.length} characters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDisclaimer && (
        <div
          id="disclaimer-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onClick={() => setShowDisclaimer(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-[61] max-w-md w-[90%] sm:w-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Disclaimer
              </h3>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close disclaimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {disclaimerText ||
                "Information provided may be incomplete or outdated."}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for prompting login after 4-prompt limit */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowModal(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm sm:max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Free Prompt Limit Reached
            </h3>

            {/* Modal Message */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              You’ve reached the limit of free prompts available for guest
              users. To continue exploring without restrictions, please{" "}
              <span className="font-semibold">sign in</span> and unlock{" "}
              <span className="font-semibold">unlimited prompts</span> plus all
              premium features.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Continue as Guest
              </button>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In & Unlock Unlimited
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputBar;
