import { usePrompts } from "../hooks/usePrompts";
import React, {
  ChangeEvent,
  useState,
  useRef,
  KeyboardEvent,
  useEffect,
} from "react";
import { ArrowUp, Loader2, Sparkles, Paperclip, Mic } from "lucide-react";

interface WelcomeScreenProps {
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

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  input,
  setInput,
  handleSend,
  loading,
  textareaRef,
}) => {
  const {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
  } = usePrompts(handleSend, setInput);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
      setShowDropdown(false);
    }
  };

useEffect(() => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Scroll to the bottom if content overflows
    textarea.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    <div className="fixed inset-0 overflow-y-auto pointer-events-auto z-0 bg-white dark:bg-gray-900">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 max-w-6xl pt-19 mx-auto  w-full pointer-events-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            GENOXY
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            Your intelligent AI companion for creativity, learning, and
            problem-solving
          </p>
        </div>

        {/* Chat Input Box */}
        <div className="w-full max-w-3xl sticky bottom-0 z-10 bg-white dark:bg-gray-900 px-3 py-3">
          <div className="relative group">
            {isRecording && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
                🎤 Recording... Tap mic to stop
              </div>
            )}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex items-end px-4 py-2 sm:py-3 sm:px-6 gap-3">
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
                className="flex-1 resize-none overflow-auto bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-lg leading-[1.4] p-3 m-0 max-h-48"
              />

              <button
                onClick={handleToggleVoice}
                title="Voice Input"
                disabled={loading}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={async () => {
                  await handleSend();
                  setShowDropdown(false);
                }}
                disabled={!input.trim() || loading}
                title="Send"
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
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

        {/* Suggestion Prompts */}
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
    </div>
  );
};

export default WelcomeScreen;
