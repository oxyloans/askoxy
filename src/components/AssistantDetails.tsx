import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Send, User, Bot, Mic, PlusCircle } from "lucide-react";
import { Copy, Share2, Volume2, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { message } from "antd";
import {
  getAssistantDetails,
  askAssistant,
} from "../AskoxyAdmin/Assistants/assistantApi";

interface Assistant {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

const AssistantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingAssistant, setIsFetchingAssistant] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

const handleReadAloud = (content: string, idx: number) => {
  const synth = window.speechSynthesis;

  // If the same message is being spoken, stop it
  if (speakingIdx === idx) {
    synth.cancel();
    setSpeakingIdx(null);
    return;
  }

  // Stop any existing speech
  synth.cancel();

  // Start speaking
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = "en-US";
  utterance.onend = () => setSpeakingIdx(null);

  synth.speak(utterance);
  setSpeakingIdx(idx);
};
  /** ✅ Fetch Assistant Details */
  useEffect(() => {
    const fetchAssistant = async () => {
      if (!id) return;
      setIsFetchingAssistant(true);
      try {
        const data = await getAssistantDetails(id);
        setAssistant(data);
      } catch {
        message.error("Failed to load assistant details.");
        navigate(-1);
      } finally {
        setIsFetchingAssistant(false);
      }
    };
    fetchAssistant();
  }, [id, navigate]);

  /** ✅ Auto Scroll to Latest Message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** ✅ Send Message Handler */
  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading || !id) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAssistant(id, [...messages, userMsg]);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, id]);

  /** ✅ Speech-to-Text Handler */
  const handleVoiceToggle = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        message.error("Speech Recognition is not supported in this browser.");
        return;
      }

      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
        return;
      }

      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false; // better for mobile
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
        message.info("🎤 Listening... Speak now!");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) transcript += result[0].transcript + " ";
        }
        if (transcript.trim()) {
          setInput((prev) => (prev + " " + transcript).trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          message.error(
            "Microphone permission denied. Enable it in browser settings."
          );
        } else {
          message.error("Speech recognition error. Try again.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      console.error("Voice init error:", error);
      message.error("Failed to start voice input.");
    }
  };
   /** ✅ New Chat Handler */
  const handleNewChat = () => {
    setMessages([]);
    message.info("🆕 New chat started");
  };
   const handleBack = () => {
     window.history.back();
   };

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-50">
      {/* ✅ Top Header */}
      <header
        className="flex items-center justify-between px-4 sm:px-6  
bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md 
  sticky top-0 z-20 py-1"
      >
        {/* Left Side - Assistant Name */}
        <div
         
          className="flex  items-center flex-1 min-w-0"
        >
          <button  onClick={handleBack} className="text-base sm:text-lg font-semibold text-gray-800 ">
            {assistant?.name || "Assistant"}
          </button>
        </div>

        {/* Right Side - New Chat Button */}
        <div className="flex items-center ml-4">
          <button
            onClick={handleNewChat}
            className="flex items-center text-lg font-medium gap-2 px-3 py-2 rounded-lg   text-gray-600 hover:text-gray-700 transition-colors duration-200 shrink-0"
            title="Start New Chat"
          >
            {/* New Chat Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328ZM15.7791 4.2207C15.3753 3.81702 14.7366 3.79124 14.3035 4.14453L14.2195 4.2207L9.17261 9.26856C8.81541 9.62578 8.56774 10.0756 8.45679 10.5654L8.41772 10.7773L8.28296 11.7158L9.22241 11.582L9.43433 11.543C9.92426 11.432 10.3749 11.1844 10.7322 10.8271L15.7791 5.78027L15.8552 5.69629C16.185 5.29194 16.1852 4.708 15.8552 4.30371L15.7791 4.2207Z"></path>
            </svg>

            {/* Text - Hidden on mobile, shown on larger screens */}
            <span className="hidden sm:inline text-lg font-medium">
              New Chat
            </span>
          </button>
        </div>
      </header>

      {/* Loader */}
      {isFetchingAssistant ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Chat Area */}
          <div
            className="flex-1  px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto w-full"
            style={{ paddingBottom: "7rem" }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow">
                  <Bot className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Welcome to {assistant?.name}
                </h2>
                <p className="text-gray-500 max-w-md mt-2">
                  {assistant?.description ||
                    "Start chatting to explore how this assistant can help you."}
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex mb-3 sm:mb-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 shadow-md ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex gap-2">
                        {msg.role === "assistant" ? (
                          <Bot className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                        ) : (
                          <User className="w-5 h-5 text-white shrink-0 mt-1" />
                        )}
                        <ReactMarkdown
                          className={`prose prose-sm sm:prose-base max-w-none ${
                            msg.role === "assistant"
                              ? "prose-indigo"
                              : "prose-invert"
                          }`}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.role === "assistant" && (
                        <div className="flex justify-end gap-2 mt-2">
                          {/* Copy */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              message.success("Copied to clipboard");
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Share */}
                          <button
                            onClick={async () => {
                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: assistant?.name || "Assistant",
                                    text: msg.content,
                                  });
                                } catch (err) {
                                  console.error(
                                    "Share cancelled or failed:",
                                    err
                                  );
                                }
                              } else {
                                navigator.clipboard.writeText(msg.content);
                                message.info("Copied text to share manually");
                              }
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          {/* Read Aloud (Toggle Start/Stop) */}
                          <button
                            onClick={() => handleReadAloud(msg.content, idx)}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                            title={
                              speakingIdx === idx
                                ? "Stop Reading"
                                : "Read Aloud"
                            }
                          >
                            {speakingIdx === idx ? (
                              <Square className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-3 sm:mb-4">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      <span>Assistant is thinking...</span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent px-3 sm:px-4 pb-4 pt-2">
            <div className="w-full max-w-3xl mx-auto flex items-center gap-2 rounded-full border border-gray-300 bg-white shadow-md px-3 sm:px-5 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              {/* ➕ Optional Add Button */}
              {/* <button
                className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                aria-label="Add"
              >
                <span className="text-lg text-gray-500 font-bold">+</span>
              </button> */}

              <button
                onClick={handleVoiceToggle}
                className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* 📝 Input Field */}
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent outline-none px-2 p-1 text-sm sm:text-base placeholder-gray-400"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />

              {/* 🎤 Mic Button */}
              {/* <button
                onClick={handleVoiceToggle}
                className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button> */}

              {/* 📤 Send Button */}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full  text-gray-500 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssistantDetails;
