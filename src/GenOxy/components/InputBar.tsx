import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import { ArrowUp, Loader2, Mic } from "lucide-react";

interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  stopGeneration: () => void; // New prop to stop ongoing response
   isEditing: boolean; // Indicates if editing a message
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
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

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

    recognition.onstart = () => {
      console.log("🎙️ Voice recording started...");
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + " ";
        }
      }

      if (transcript.trim()) {
        setInput((prev) => (prev.trim() + " " + transcript.trim()).trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("❌ Voice recognition error:", event.error);
      alert("Voice input failed: " + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("🛑 Voice recognition stopped.");
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
      {isRecording && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
          🎤 Recording...Tap mic to stop
        </div>
      )}
      <div className="max-w-4xl mx-auto p-2">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl blur bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-30 transition duration-300 pointer-events-none" />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
            <div className="flex">
              <div className="flex-1 px-6 py-2 flex flex-col">
                {/* Textarea */}
                <div className="flex-grow">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder={
                      isEditing
                        ? "Edit your message..."
                        : "Type your message..."
                    }
                    disabled={loading}
                    rows={1}
                    className="w-full text-sm sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 overflow-auto p-1"
                    style={{ minHeight: "20px" }}
                  />
                </div>

                {/* Buttons aligned bottom with space-between */}
                <div className="mt-2 flex justify-between items-end">
                  {/* Voice Button */}
                  <button
                    onClick={handleToggleVoice}
                    title="Voice Input"
                    disabled={loading || isEditing}
                    // className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    //   isRecording
                    //     ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                    //     : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    // }`}

                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      isRecording
                        ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={loading ? stopGeneration : () => handleSend()}
                    disabled={!loading && (!input.trim() || isRecording)}
                    aria-label={
                      loading
                        ? "Stop generation"
                        : isEditing
                        ? "Save message"
                        : "Send message"
                    }
                    // className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    //   input.trim() && !loading
                    //     ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    //     : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    // }`}

                    className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      loading
                        ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 shadow-lg"
                        : input.trim() && !isRecording
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

            {input?.length > 0 && (
              <div className="absolute bottom-full right-4 text-xs text-gray-500 dark:text-gray-400 pb-1">
                {input.length} characters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
