import React, { ChangeEvent, KeyboardEvent ,useState,useRef} from "react";
import { ArrowUp, Loader2, Paperclip, Mic } from "lucide-react";

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
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("🎙️ Voice recording started...");
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .trim();

      console.log("📝 Transcribed text:", transcript);

      if (transcript) {
        setInput(transcript); // ✅ Show in input box
       
      }

      setIsRecording(false);
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
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl safe-area-pb">
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="relative group">
  
          {/* Hover Glow */}
          <div className="absolute -inset-1 rounded-2xl blur bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-30 transition duration-300 pointer-events-none" />
  
          {/* Input Wrapper */}
          <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
            <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">
  
              {/* Text Input */}
              <div className="flex-1 flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800 rounded-3xl shadow-inner border border-gray-200 dark:border-gray-700">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={loading}
                  rows={1}
                  className="w-full text-sm sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[44px] sm:min-h-[24px] max-h-[120px] p-1"
                />
  
                {/* Controls (Mic + Send) */}
                <div className="flex items-center gap-2">
                  {/* Mic Button */}
                  <button
                    onClick={handleToggleVoice}
                    title="Voice Input"
                    disabled={loading}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${
                      isRecording
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                    aria-label="Voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
  
                  {/* Send Button */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className={`w-9 h-9 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      input.trim() && !loading
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
    </div>
  );
  
};

export default InputBar;
