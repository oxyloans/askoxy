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
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl ">
      {isRecording && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
          🎤 Recording... Tap mic to stop
        </div>
      )}
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl blur bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-30 transition duration-300 pointer-events-none" />
          <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4">
              <div className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-800 rounded-3xl shadow-inner border border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Textarea */}
                <div className="flex-grow">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={loading}
                    rows={1}
                    className="w-full text-sm sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-60 overflow-auto p-1"
                  />
                </div>

                {/* Buttons aligned bottom with space-between */}
                <div className="mt-2 flex justify-between items-end">
                  {/* Voice Button */}
                  <button
                    onClick={handleToggleVoice}
                    title="Voice Input"
                    disabled={loading}
                    className={`w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition ${
                      isRecording
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                    aria-label="Voice input"
                  >
                    <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className={`w-8 h-12 sm:w-8 sm:h-8 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      input.trim() && !loading
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin" />
                    ) : (
                      <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
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
