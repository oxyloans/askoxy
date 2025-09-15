import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Send,
  User,
  Bot,
  Mic,
  Copy,
  Share2,
  Volume2,
  Square,
  Pencil,
  RefreshCcw,
} from "lucide-react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { message } from "antd";
import MarkdownRenderer from "../../GenOxy/components/MarkdownRenderer";
import {
  getAssistantDetails,
  askAssistant,
} from "../../AskoxyAdmin/Assistants/assistantApi";
import axios from "axios";
import BASE_URL from "../../Config";

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

const INPUT_BAR_HEIGHT = 64; // px
const MAX_TEXTAREA_HEIGHT = 120; // px (reduced so the input never gets too tall)
const NEAR_BOTTOM_PX = 140; // auto-scroll only if within this distance from bottom

const ChatInterface1: React.FC = () => {
  const { id, agentId } = useParams<{ id: string; agentId: string }>();
  const navigate = useNavigate();

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingAssistant, setIsFetchingAssistant] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStopped = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll control (true when user is already near the bottom)
  const autoScrollRef = useRef(true);

  const [prompts, setPrompts] = useState<string[]>([]);
 useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const getConversationStarters = async (agentId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/getConversation/${agentId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation starters:", error);
      message.warning("Could not load suggested prompts.");
      return [];
    }
  };

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const fetchAssistant = async () => {
      if (!id || !agentId) {
        message.error("Invalid assistant or agent ID.");
        navigate(-1);
        return;
      }
      setIsFetchingAssistant(true);
      try {
        const data = await getAssistantDetails(id);
        setAssistant(data);

        const convData = await getConversationStarters(agentId);
        if (convData && convData.length > 0) {
          const starters = [
            convData[0].conStarter1,
            convData[0].conStarter2,
            convData[0].conStarter3,
            convData[0].conStarter4,
          ].filter((s: string) => s && s.trim()) as string[];
          setPrompts(starters);
        } else {
          setPrompts([]);
        }
      } catch {
        message.error("Failed to load assistant details.");
        navigate(-1);
      } finally {
        setIsFetchingAssistant(false);
      }
    };
    fetchAssistant();
  }, [id, agentId, navigate]);

  // Helper: are we near bottom?
  const isNearBottom = () => {
    const c = scrollContainerRef.current;
    if (!c) return true;
    return c.scrollHeight - (c.scrollTop + c.clientHeight) < NEAR_BOTTOM_PX;
  };

  // Helper: scroll to bottom
  const scrollToBottom = (smooth = true) => {
    const c = scrollContainerRef.current;
    if (!c) return;
    c.scrollTo({ top: c.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // Track whether user is near the bottom
  useEffect(() => {
    const c = scrollContainerRef.current;
    if (!c) return;

    const onScroll = () => {
      autoScrollRef.current = isNearBottom();
    };
    c.addEventListener("scroll", onScroll, { passive: true });

    return () => c.removeEventListener("scroll", onScroll);
  }, []);

  // Observe DOM changes (e.g., images/markdown rendering) and keep bottom when near bottom
  useEffect(() => {
    const c = scrollContainerRef.current;
    if (!c) return;

    const observer = new MutationObserver(() => {
      if (autoScrollRef.current) scrollToBottom(false);
    });
    observer.observe(c, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Scroll to bottom whenever messages change or loading toggles
  useEffect(() => {
    if (autoScrollRef.current) scrollToBottom(true);
  }, [messages.length, loading]);

  // Auto-resize textarea, keep view pinned
  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const newHeight = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT);
    ta.style.height = `${newHeight}px`;

    if (autoScrollRef.current) scrollToBottom(false);
  }, [input]);

  const sendMessage = useCallback(
    async (prompt?: string, skipAddUser: boolean = false) => {
      const messageContent = prompt || input;
      if (!messageContent.trim() && !skipAddUser) return;
      if (loading || !id) return;

      // as soon as user sends, we want to stay at bottom
      autoScrollRef.current = true;

      let userMsg: ChatMessage | undefined;
      if (!skipAddUser) {
        userMsg = { role: "user", content: messageContent };
        setMessages((prev) => [...prev, userMsg!]);
        if (!prompt) setInput("");
      }

      isStopped.current = false;
      setLoading(true);

      try {
        const history = skipAddUser ? messages : [...messages, userMsg!];
        // smooth scroll on next paint
        requestAnimationFrame(() => scrollToBottom(true));

        const response = await askAssistant(id, history);
        if (!isStopped.current) {
          setMessages((prev) => [...prev, response]);
        }
      } catch {
        if (!isStopped.current) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "⚠️ Something went wrong. Try again.",
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, id]
  );

  const handleStop = () => {
    isStopped.current = true;
    setLoading(false);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditingContent(messages[idx].content);
  };

  const handleEditSave = async (idx: number, newContent: string) => {
    if (!newContent.trim()) return;

    const newMsgs = messages
      .map((m, i) => (i === idx ? { ...m, content: newContent } : m))
      .slice(0, idx + 1);

    setMessages(newMsgs);
    setEditingIndex(null);

    isStopped.current = false;
    setLoading(true);

    try {
      const response = await askAssistant(id!, newMsgs);
      if (!isStopped.current) {
        setMessages((prev) => [...prev, response]);
      }
    } catch {
      if (!isStopped.current) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Something went wrong. Try again." },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (idx: number) => {
    const truncated = messages.slice(0, idx);
    setMessages(truncated);
    sendMessage(undefined, true);
  };

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
      recognition.continuous = false;
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

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    window.speechSynthesis?.cancel();
    autoScrollRef.current = true;
    requestAnimationFrame(() => scrollToBottom(false));
  };

  const handleReadAloud = (content: string, idx: number) => {
    const synth = window.speechSynthesis;

    if (speakingIdx === idx) {
      synth.cancel();
      setSpeakingIdx(null);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    utterance.onend = () => setSpeakingIdx(null);

    synth.speak(utterance);
    setSpeakingIdx(idx);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handlePromptClick = (prompt: string) => {
    if (prompt.trim() && !loading && id) {
      sendMessage(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-16 px-4 sm:px-6 lg:px-8 max-w-3xl w-full mx-auto"
        style={{
          paddingBottom: `calc(${
            INPUT_BAR_HEIGHT + 16
          }px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {" "}
        {/* Sticky top header with Back (left) & New Chat (right) */}
        <div className="sticky top-0    border-b border-gray-200 dark:border-gray-700">
          <div
            className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
            role="toolbar"
            aria-label="Chat header"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-base sm:text-lg text-black dark:text-white min-w-0"
            >
              <ArrowLeftIcon className="h-5 w-5 shrink-0" />
              <span className="truncate">{assistant?.name || "Assistant"}</span>
            </button>

            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.2555 2.6687 11.333 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328Z"></path>
              </svg>
              New Chat
            </button>
          </div>
        </div>
        {isFetchingAssistant ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="animate-spin w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  {assistant?.avatar ? (
                    <img
                      src={assistant.avatar}
                      alt={assistant.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Bot className="w-7 h-7 text-white" />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {assistant?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mt-1 line-clamp-3 text-sm">
                  {assistant?.description}
                </p>

                {/* Prompt chips — shorter & single-line */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full max-w-2xl">
                  {(prompts || []).slice(0, 4).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="h-10 px-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 truncate text-left"
                      title={prompt}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) =>
                  msg.role === "user" ? ( // Updated: For user messages, wrap in a relative group div to show buttons on hover outside the bubble
                    <div
                      key={idx}
                      className={`flex mb-3 sm:mb-4 justify-end group relative`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white`}
                      >
                        <div className="flex gap-2">
                          <User className="w-5 h-5 text-purple-700 dark:text-white shrink-0 mt-1" />
                          {editingIndex === idx ? ( // Updated: Conditional for editing mode
                            <div className="w-full">
                              <textarea
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 text-purple-700 dark:text-white"
                                rows={3}
                                value={editingContent}
                                onChange={(e) =>
                                  setEditingContent(e.target.value)
                                }
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    handleEditSave(idx, editingContent)
                                  }
                                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                >
                                  Save & Submit
                                </button>
                                <button
                                  onClick={() => setEditingIndex(null)}
                                  className="px-3 py-1 bg-gray-200 text-black dark:bg-gray-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <MarkdownRenderer
                              className={`prose prose-sm sm:prose-base max-w-none prose-invert text-purple-700 dark:text-white`}
                              content={msg.content}
                            />
                          )}
                        </div>
                      </div>
                      {editingIndex !== idx && ( // Updated: Show buttons only if not editing, positioned absolutely at bottom right, visible on hover
                        <div className="absolute bottom-0 right-0 flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Updated: Copy button for user messages */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              message.success("Copied to clipboard");
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {/* Updated: Edit button for user messages */}
                          <button
                            onClick={() => handleEdit(idx)}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Updated: For assistant messages, keep the original structure with buttons inside
                    <div
                      key={idx}
                      className={`flex mb-3 sm:mb-4 justify-start`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-600`}
                      >
                        <div className="flex gap-2">
                          <Bot className="w-5 h-5 text-purple-700 dark:text-white shrink-0 mt-1" />
                          <MarkdownRenderer
                            className={`prose prose-sm sm:prose-base max-w-none prose-indigo dark:prose-invert text-purple-700 dark:text-white`}
                            content={msg.content}
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          {/* Updated: Always show copy for assistant */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              message.success("Copied to clipboard");
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Updated: Show share and read aloud only for assistant messages */}
                          <>
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
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleReadAloud(msg.content, idx)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
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
                          </>

                          {idx === messages.length - 1 && ( // Updated: Regenerate button for last assistant message
                            <button
                              onClick={() => handleRegenerate(idx)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                              title="Regenerate"
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
                {loading && (
                  <div className="flex justify-start mb-3 sm:mb-4">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 shadow flex items-center gap-2 text-gray-700 dark:text-white">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-700 dark:text-white" />
                      <span>Assistant is thinking...</span>
                      {/* Updated: Removed stop button from loading message */}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* INPUT BAR */}
      {/* Chat composer (sticky) */}
      <div
        className="sticky bottom-0 inset-x-0 z-20 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-700"
        style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
        role="region"
        aria-label="Message composer"
      >
        <div className="w-full max-w-screen-lg md:max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5">
          <form
            className="flex items-end gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-700/70 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-600 shadow-sm px-2.5 sm:px-3 py-1.5 sm:py-2 focus-within:ring-2 focus-within:ring-purple-500 transition"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && input.trim()) sendMessage();
            }}
          >
            {/* Voice toggle */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`shrink-0 h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full touch-manipulation transition-colors ${
                isRecording
                  ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Message textarea (auto-grow, mobile-friendly) */}
            <textarea
              ref={textareaRef}
              rows={1}
              inputMode={isIOS ? "text" : undefined}
              autoCapitalize="sentences"
              autoCorrect="on"
              spellCheck
              className="flex-1 min-h-[40px] sm:min-h-[44px] max-h-40 bg-transparent outline-none text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none py-2 leading-6"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
              disabled={loading}
              aria-label="Message"
            />

            {/* Stop / Send */}
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-manipulation"
                title="Stop"
                aria-label="Stop generating"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full text-purple-600 dark:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none transition-colors touch-manipulation"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface1;
