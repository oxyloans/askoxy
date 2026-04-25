import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Mic,
  Trash2,
  Sparkles,
  Volume2,
  Loader2,
  Square,
  Phone,
} from "lucide-react";

interface VoiceMessage {
  id: string;
  type: "user" | "ai" | "loading" | "products";
  text?: string;
  transcript?: string;
  data?: any[];
  createdAt: Date;
}

interface VoiceWindowProps {
  onClose: () => void;
}

const VOICE_API_URL =
  "http://65.0.147.157:9027/api/product-service/voice-assistance";

const quickQuestions = [
  "Show today's rice and grocery offers",
  "Which rice varieties are trending now?",
  "Check today's gold prices",
  "Explain what AskOxy.ai can do",
  "How can I create my own AI agent?",
  "Track my recent order",
  "What payment methods are available?",
  "What is BMV coin and how can I use it?",
  "What are the benefits of AI agents?",
];

const VoiceWindow: React.FC<VoiceWindowProps> = ({ onClose }) => {
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [voiceActionType, setVoiceActionType] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = localStorage.getItem("userId") || "";
  const addressId = localStorage.getItem("addressId") || "";

  const showWelcome = useMemo(
    () => voiceMessages.length === 0 && !isListening && !isVoiceLoading,
    [voiceMessages.length, isListening, isVoiceLoading]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [voiceMessages, liveTranscript, isVoiceLoading]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setSpeechSupported(!!SpeechRecognition);

    return () => {
      stopSpeechRecognition();
      stopAllTracks();
    };
  }, []);

  const clearVoiceChat = () => {
    setVoiceMessages([]);
    setProducts([]);
    setVoiceActionType("");
    setLiveTranscript("");
    transcriptRef.current = "";
  };

  const stopAllTracks = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const stopSpeechRecognition = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (error) {
      console.error("Speech recognition stop error:", error);
    }
  };

  const startLiveSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";

        if (result.isFinal) {
          finalText += text + " ";
        } else {
          interimText += text + " ";
        }
      }

      const combined = `${finalText}${interimText}`.trim();
      transcriptRef.current = combined;
      setLiveTranscript(combined);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event?.error);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Speech recognition start error:", error);
    }
  };

  const sendQuickQuestion = async (question: string) => {
    const tempUserMessageId = `${Date.now()}-quick-user`;

    setVoiceMessages((prev) => [
      ...prev,
      {
        id: tempUserMessageId,
        type: "user",
        text: question,
        transcript: question,
        createdAt: new Date(),
      },
      {
        id: `${Date.now()}-loading`,
        type: "loading",
        text: "Processing...",
        createdAt: new Date(),
      },
    ]);

    try {
      setIsVoiceLoading(true);

      const formData = new FormData();
      formData.append("actionType", voiceActionType?.trim() || "");
      formData.append("userId", userId);
      formData.append("addressId", addressId);
      formData.append("products", JSON.stringify(products || []));

      const textBlob = new Blob([question], { type: "text/plain" });
      formData.append("file", textBlob, "voice.txt");

      const response = await fetch(VOICE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Voice API failed with status ${response.status}`);
      }

      const result = await response.json();

      const aiText =
        result?.speechText ||
        result?.response ||
        result?.message ||
        "No response available";

      const nextProducts = Array.isArray(result?.products)
        ? result.products
        : [];

      const nextActionType = result?.actionType || result?.type || "";

      setProducts(nextProducts);
      setVoiceActionType(nextActionType);

      setVoiceMessages((prev) => {
        const cleaned = prev.filter((msg) => msg.type !== "loading");
        const updated = [...cleaned];

        updated.push({
          id: `${Date.now()}-ai`,
          type: "ai",
          text: aiText,
          createdAt: new Date(),
        });

        if (nextProducts.length > 0) {
          updated.push({
            id: `${Date.now()}-products`,
            type: "products",
            data: nextProducts,
            createdAt: new Date(),
          });
        }

        return updated;
      });
    } catch (error) {
      console.error("Quick question error:", error);

      setVoiceMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "loading"),
        {
          id: `${Date.now()}-error`,
          type: "ai",
          text: "Sorry, I could not process your request right now. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleVoiceRecord = async () => {
    try {
      if (!isListening) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        transcriptRef.current = "";
        setLiveTranscript("");

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const savedTranscript =
            transcriptRef.current.trim() || liveTranscript.trim();

          const tempUserMessageId = `${Date.now()}-user`;

          setVoiceMessages((prev) => [
            ...prev,
            {
              id: tempUserMessageId,
              type: "user",
              text: savedTranscript || "Voice input",
              transcript: savedTranscript || "Voice input",
              createdAt: new Date(),
            },
            {
              id: `${Date.now()}-loading`,
              type: "loading",
              text: "Processing your voice...",
              createdAt: new Date(),
            },
          ]);

          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          await sendAudioToBackend(audioBlob, tempUserMessageId, savedTranscript);

          setLiveTranscript("");
          transcriptRef.current = "";
          stopAllTracks();
        };

        recorder.start();
        startLiveSpeechRecognition();
        setIsListening(true);
      } else {
        setIsListening(false);
        stopSpeechRecognition();
        mediaRecorderRef.current?.stop();
      }
    } catch (error) {
      console.error("Microphone access error:", error);
      setIsListening(false);
      stopSpeechRecognition();
    }
  };

  const sendAudioToBackend = async (
    audioBlob: Blob,
    tempUserMessageId: string,
    fallbackTranscript: string
  ) => {
    try {
      setIsVoiceLoading(true);

      const formData = new FormData();
      formData.append("actionType", voiceActionType?.trim() || "");
      formData.append("file", audioBlob, "voice.webm");
      formData.append("userId", userId);
      formData.append("addressId", addressId);
      formData.append("products", JSON.stringify(products || []));

      const response = await fetch(VOICE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Voice API failed with status ${response.status}`);
      }

      const result = await response.json();

      const transcript =
        result?.transcript ||
        result?.userText ||
        fallbackTranscript ||
        "Voice input";

      const aiText =
        result?.speechText ||
        result?.response ||
        result?.message ||
        "No response available";

      const nextProducts = Array.isArray(result?.products)
        ? result.products
        : [];

      const nextActionType = result?.actionType || result?.type || "";

      setProducts(nextProducts);
      setVoiceActionType(nextActionType);

      setVoiceMessages((prev) => {
        const cleaned = prev.filter((msg) => msg.type !== "loading");

        const updatedMessages = cleaned.map((msg) =>
          msg.id === tempUserMessageId
            ? {
                ...msg,
                text: transcript,
                transcript,
              }
            : msg
        );

        updatedMessages.push({
          id: `${Date.now()}-ai`,
          type: "ai",
          text: aiText,
          createdAt: new Date(),
        });

        if (nextProducts.length > 0) {
          updatedMessages.push({
            id: `${Date.now()}-products`,
            type: "products",
            data: nextProducts,
            createdAt: new Date(),
          });
        }

        return updatedMessages;
      });
    } catch (error) {
      console.error("Voice API Error:", error);

      setVoiceMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "loading"),
        {
          id: `${Date.now()}-error`,
          type: "ai",
          text: "Sorry, I could not process your voice right now. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleClose = () => {
    if (isListening) {
      try {
        setIsListening(false);
        stopSpeechRecognition();
        mediaRecorderRef.current?.stop();
      } catch (error) {
        console.error(error);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/35 backdrop-blur-[2px]">
      <div className="ml-auto flex h-full w-full max-w-[940px] flex-col overflow-hidden border-l border-purple-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 px-5 py-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold leading-none">ASKOXY.AI</h3>
                <p className="mt-1 text-xs text-purple-100">
                  Smart Voice Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearVoiceChat}
                className="rounded-full p-2 transition hover:bg-white/15"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={handleClose}
                className="rounded-full p-2 transition hover:bg-white/15"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-5">
          {showWelcome ? (
            <div className="flex h-full flex-col">
              <div className="mb-6 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-800">
                  Welcome to ASKOXY.AI
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  How can I assist you today? Choose a quick question or speak.
                </p>
              </div>

              <div className="mb-6 flex items-center justify-center gap-4">
                <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 py-4 text-lg font-semibold text-white shadow-lg">
                  <Sparkles size={22} />
                  Voice Chat
                </button>

                <button
                  onClick={handleVoiceRecord}
                  disabled={isVoiceLoading}
                  className="flex items-center gap-2 rounded-2xl bg-gray-100 px-8 py-4 text-lg font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  <Phone size={22} />
                  {isListening ? "Stop Voice" : "Start Voice"}
                </button>
              </div>

              <div className="mx-auto w-full max-w-5xl">
                <p className="mb-4 text-xl font-medium text-gray-600">
                  Quick Questions:
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickQuestion(question)}
                      className="rounded-2xl border border-purple-200 bg-purple-50 px-5 py-5 text-left text-[16px] font-medium text-gray-700 transition hover:border-purple-300 hover:bg-purple-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {!speechSupported && (
                <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-amber-600">
                  Live browser speech-to-text is not supported here. Audio will still be sent,
                  and transcript will appear after backend response.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isListening && (
                <div className="flex justify-end">
                  <div className="max-w-[78%]">
                    <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 px-5 py-4 text-white shadow-sm">
                      <div className="mb-1 flex items-center gap-2">
                        <Mic size={16} />
                        <span className="text-sm font-semibold">You are saying</span>
                      </div>
                      <p className="min-h-[24px] whitespace-pre-wrap break-words text-sm leading-6">
                        {liveTranscript || "Listening..."}
                      </p>
                    </div>
                    <div className="mt-1 px-2 text-right text-[11px] text-gray-400">
                      now
                    </div>
                  </div>
                </div>
              )}

              {voiceMessages.map((msg) => {
                if (msg.type === "user") {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[78%]">
                        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 px-5 py-4 text-white shadow-sm">
                          <div className="mb-1 flex items-center gap-2">
                            <Mic size={16} />
                            <span className="text-sm font-semibold">You said</span>
                          </div>
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {msg.transcript || msg.text}
                          </p>
                        </div>
                        <div className="mt-1 px-2 text-right text-[11px] text-gray-400">
                          {msg.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.type === "ai") {
                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[78%]">
                        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-800 shadow-sm">
                          <div className="mb-1 flex items-center gap-2 text-purple-700">
                            <Volume2 size={16} />
                            <span className="text-sm font-semibold">Assistant</span>
                          </div>
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                            {msg.text}
                          </p>
                        </div>
                        <div className="mt-1 px-2 text-left text-[11px] text-gray-400">
                          {msg.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.type === "loading") {
                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 size={16} className="animate-spin text-purple-600" />
                          Processing your voice...
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.type === "products" && msg.data?.length) {
                  return (
                    <div key={msg.id} className="space-y-4">
                      {msg.data.map((category: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <h4 className="mb-4 text-base font-bold text-gray-800">
                            {category.categoryName || "Products"}
                          </h4>

                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {(category.itemsResponseDtoList || []).map((item: any) => (
                              <div
                                key={item.itemId}
                                className="min-w-[190px] rounded-2xl border border-gray-100 bg-gray-50 p-3"
                              >
                                <div className="relative mb-3 rounded-xl bg-white p-3">
                                  {item.savePercentage ? (
                                    <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                      {item.savePercentage}% OFF
                                    </div>
                                  ) : null}

                                  <img
                                    src={item.itemImage}
                                    alt={item.itemName}
                                    className="h-[120px] w-full object-contain"
                                  />
                                </div>

                                <p className="min-h-[40px] line-clamp-2 text-sm font-medium text-gray-800">
                                  {item.itemName}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {item.weight} {item.units}
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-base font-bold text-purple-700">
                                    ₹{item.itemPrice}
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{item.itemMrp}
                                  </span>
                                </div>

                                <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-2.5 text-sm font-semibold text-white">
                                  + Add
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Footer like AI chat */}
        <div className="border-t border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 text-sm text-gray-400">
              {isListening
                ? liveTranscript || "Listening..."
                : "Tap the microphone and speak here..."}
            </div>

            <button
              onClick={handleVoiceRecord}
              disabled={isVoiceLoading}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-br from-purple-600 to-purple-700"
              } ${isVoiceLoading ? "cursor-not-allowed opacity-70" : ""}`}
              title={isListening ? "Stop recording" : "Start recording"}
            >
              {isListening ? <Square size={22} /> : <Mic size={22} />}
            </button>
          </div>

          <div className="mt-2 text-center text-xs text-gray-400">
            {isListening
              ? "Your speech appears above in chat format"
              : "Speak naturally and get AI response"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceWindow;