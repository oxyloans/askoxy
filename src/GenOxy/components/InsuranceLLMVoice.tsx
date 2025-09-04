import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Send,
  Zap,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { message } from "antd";
import { voiceSessionService } from "../hooks/useMessages";
import { useNavigate } from "react-router-dom";
import { ChatMessage,LanguageConfig } from "../types/types";

interface Assistant {
  name: string;
  type: string;
  image: string;
  color: string;
  assistantId: string;
}

const InsuranceLLmVoice: React.FC = () => {
  const [currentView, setCurrentView] = useState<"selection" | "conversation">(
    "selection"
  );
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig>({
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    speechLang: "en-US",
    imageUrl:
      "https://tse4.mm.bing.net/th/id/OIP.TQik09Bkc-yFML5XGCUq7AHaLH?r=0&w=996&h=1494&rs=1&pid=ImgDetMain&o=7&rm=3",
    assistantName: "Laila",
  });
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] =
    useState<boolean>(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const languageConfigs: LanguageConfig[] = [
    {
      code: "te",
      name: "Telugu",
      nativeName: "తెలుగు",
      flag: "🇮🇳",
      speechLang: "te-IN",
      imageUrl:
        "https://img.freepik.com/premium-photo/portrait-beautiful-indian-girl-wearing-kameez-long-black-hair-beautiful-body-looking-camera_973228-1209.jpg",
      assistantName: "లైలా",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      speechLang: "en-US",
      imageUrl:
        "https://tse4.mm.bing.net/th/id/OIP.TQik09Bkc-yFML5XGCUq7AHaLH?r=0&w=996&h=1494&rs=1&pid=ImgDetMain&o=7&rm=3",
      assistantName: "Laila",
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिंदी",
      flag: "🇮🇳",
      speechLang: "hi-IN",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/02/19/16/23/ai-generated-8583701_1280.jpg",
      assistantName: "लैला",
    },
  ];

  const assistants: Assistant[] = [
    {
      name: "Laila",
      type: "Life Insurance",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.TQik09Bkc-yFML5XGCUq7AHaLH?r=0&w=996&h=1494&rs=1&pid=ImgDetMain&o=7&rm=3",
      color: "from-green-500 to-red-500",
      assistantId: "asst_G2jtvsfDcWulax5QDcyWhFX1",
    },
    {
      name: "Jennie",
      type: "General Insurance",
      image:
        "https://cdn.pixabay.com/photo/2024/02/19/16/23/ai-generated-8583701_1280.jpg",
      color: "from-red-500 to-pink-500",
      assistantId: "asst_bRxg1cfAfcQ05O3UGUjcAwwC",
    },
  ];

  const getInstructionsForLang = (lang: LanguageConfig) => {
    const assistantType = selectedAssistant?.type || "";
    const assistantName = selectedLanguage.assistantName;

    const baseInstructions = (language: string) => `
You are ${assistantName}, a real-time voice assistant created by Genoxy specializing in ${assistantType}.
- Speak only in ${language}, avoid mixing with other languages.
- Keep responses short, clear, and direct (to reduce cost).
- Maintain a friendly, natural, and professional tone.
- Always give factually correct and up-to-date answers (beyond 2023).
- Greet the user briefly at the start of the first interaction (e.g., "Hello! How can I help you today?").
- If this is the first time in the session and your role is about "${assistantType}", ask 1 relevant starter question (e.g., for Life Insurance: "Would you like to know the benefits or premium details?").
- Do not repeat the greeting or starter question again after the first time.
- After that, only respond to the user's input and keep them engaged with short, meaningful answers.
`;

    switch (lang.code) {
      case "te":
        return baseInstructions("Telugu");
      case "hi":
        return baseInstructions("Hindi");
      case "en":
      default:
        return baseInstructions("English");
    }
  };

  const getTranslatedText = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      start_conversation: {
        en: "Start Conversation",
        te: "సంభాషణ ప్రారంభించండి",
        hi: "बातचीत शुरू करें",
      },
      back: {
        en: "Back",
        te: "వెనుకకు",
        hi: "वापस",
      },
      i_am: {
        en: "I am",
        te: "నేను",
        hi: "मैं हूं",
      },
      life_insurance: {
        en: "Life Insurance",
        te: "జీవిత బీమా",
        hi: "जीवन बीमा",
      },
      general_insurance: {
        en: "General Insurance",
        te: "సాధారణ బీమా",
        hi: "सामान्य बीमा",
      },
      text_mode: {
        en: "Text Mode",
        te: "టెక్స్ట్ మోడ్",
        hi: "टेक्स्ट मोड",
      },
      hide_text_mode: {
        en: "Hide Text Mode",
        te: "టెక్స్ట్ మోడ్ దాచు",
        hi: "टेक्स्ट मोड छुपाएं",
      },
      enable_camera: {
        en: "Enable Camera",
        te: "కెమెరా చేతనం చేయండి",
        hi: "कैमरा चालू करें",
      },
      disable_camera: {
        en: "Disable Camera",
        te: "కెమెరా నిష్క్రియం చేయండి",
        hi: "कैमरा बंद करें",
      },
      listening: {
        en: "Listening...",
        te: "వింటున్నాను...",
        hi: "सुन रहा हूँ...",
      },
      live_conversation: {
        en: "Live Conversation",
        te: "ప్రత్యక్ష సంభాషణ",
        hi: "लाइव बातचीत",
      },
      real_time_voice: {
        en: "Real-time voice interaction",
        te: "నిజ-సమయ వాయిస్ పరస్పర చర్య",
        hi: "रीयल-टाइम वॉयस इंटरैक्शन",
      },
      click_to_start: {
        en: "Click to start conversation",
        te: "సంభాషణ ప్రారంభించడానికి క్లిక్ చేయండి",
        hi: "बातचीत शुरू करने के लिए क्लिक करें",
      },
      start_voice: {
        en: "Start Voice",
        te: "వాయిస్ ప్రారంభించండి",
        hi: "आवाज शुरू करें",
      },
      stop_voice: {
        en: "Stop Voice",
        te: "వాయిస్ ఆపండి",
        hi: "आवाज बंद करें",
      },
      select_insurance: {
        en: "Please select an insurance type to continue",
        te: "కొనసాగించడానికి దయచేసి బీమా రకాన్ని ఎంచుకోండి",
        hi: "जारी रखने के लिए कृपया बीमा का प्रकार चुनें",
      },
      switch_to_text: {
        en: "Switch to Text",
        te: "టెక్స్ట్‌కు మార్చు",
        hi: "टेक्स्ट में बदलें",
      },
    };

    return (
      translations[key]?.[selectedLanguage.code] ||
      translations[key]?.["en"] ||
      key
    );
  };

  const getLocalizedAssistantName = (name: string): string => {
    const nameTranslations: Record<string, Record<string, string>> = {
      Laila: {
        en: "Laila",
        te: "లైలా",
        hi: "लैला",
      },
      Jennie: {
        en: "Jennie",
        te: "జెన్నీ",
        hi: "जेनी",
      },
    };

    return nameTranslations[name]?.[selectedLanguage.code] || name;
  };

  const handleAssistantSelect = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    const updatedLanguage = {
      ...selectedLanguage,
      assistantName: getLocalizedAssistantName(assistant.name),
      imageUrl: assistant.image,
    };
    setSelectedLanguage(updatedLanguage);
    setCurrentView("conversation");
  };

  const handleLanguageChange = (lang: LanguageConfig) => {
    const updatedLang = {
      ...lang,
      assistantName: selectedAssistant
        ? getLocalizedAssistantName(selectedAssistant.name)
        : lang.assistantName,
      imageUrl: lang.imageUrl,
    };
    setSelectedLanguage(updatedLang);
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraEnabled(true);
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const disableCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraEnabled(false);
  };

  const startVoiceConversation = async () => {
    if (!selectedAssistant) {
      message.info(getTranslatedText("select_insurance"));
      return;
    }

    setIsListening(true);
    try {
      //   await enableCamera();
      await voiceSessionService.startSession(
        selectedAssistant.assistantId,
        selectedLanguage,
        getInstructionsForLang(selectedLanguage),
        (message: ChatMessage) => {
          setChat((prev) => [...prev, message]);
          setCurrentConversation(message.text);
        },
        setIsAssistantSpeaking,
        () => setCurrentView("selection")
      );
    } catch (error) {
      console.error("Failed to start voice conversation:", error);
      setIsListening(false);
      disableCamera();
    }
  };

  const stopVoiceConversation = () => {
    setChat([]);
    voiceSessionService.stopSession();
    setIsListening(false);
    setCurrentConversation("");
    // setChat([]);
    disableCamera();
  };

  const handleBack = () => {
    stopVoiceConversation();
    disableCamera();
    setChat([]);
    setCurrentView("selection");
    setSelectedAssistant(null);
  };

  const switchToTextMode = () => {
    // console.log("Switching to text mode...");
    navigate("/genoxy/chat?a=insurance-llm");
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [chat]);

  if (currentView === "selection") {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 opacity-10 z-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(cyan 1px, transparent 1px),
                linear-gradient(90deg, cyan 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Animated Lines */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
          <div className="w-full h-px bg-cyan-400 animate-pulse absolute top-1/4"></div>
          <div
            className="w-full h-px bg-orange-400 animate-pulse absolute top-2/4"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="w-full h-px bg-blue-400 animate-pulse absolute top-3/4"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="p-4 shrink-0">
          <div className="flex justify-between border-b-4 border-cyan-500 mb-6 items-center">
            <div>
              <h1 className="text-4xl font-bold text-yellow-500 ">GENOXY</h1>
              <p className="text-white text-sm">
                VOICE ASSISTANT - INSURANCE AI LLM
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
            {assistants.map((assistant) => (
              <div
                key={assistant.name}
                onClick={() => handleAssistantSelect(assistant)}
                className="group cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:border-cyan-400/50 overflow-hidden"
              >
                {/* Image Section on Top */}
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  <img
                    src={assistant.image}
                    alt={assistant.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: "center" }}
                  />
                </div>

                {/* Text Section Below */}
                <div className="p-6 text-center">
                  <div className="mb-4">
                    <p className="text-lg text-gray-300 group-hover:text-white transition-colors">
                      {getTranslatedText("i_am")}{" "}
                      <span className="font-bold text-cyan-400 text-xl">
                        {getLocalizedAssistantName(assistant.name)}
                      </span>{" "}
                      your
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg font-semibold text-cyan-300">
                      {getTranslatedText(
                        assistant.type.toLowerCase().replace(" ", "_")
                      )}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      voice Assistant
                    </h3>
                  </div>

                  <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                if (!selectedAssistant) {
                  message.info(getTranslatedText("select_insurance"));
                } else {
                  startVoiceConversation();
                }
              }}
              className="relative px-10 py-4 rounded-full font-semibold flex items-center gap-3 
             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
             text-black shadow-lg border border-yellow-300
             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 
             hover:shadow-yellow-400/50 transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-full bg-yellow-300 opacity-20 blur-lg animate-pulse"></span>
              <Mic size={20} className="relative z-10" />
              <span className="relative z-10">
                {getTranslatedText("start_conversation")}
              </span>
            </button>

            <button
              onClick={switchToTextMode}
              className="relative px-10 py-4 rounded-full font-semibold flex items-center gap-3 
             bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 
             text-white shadow-lg border border-gray-300
             hover:from-gay-500 hover:via-gray-600 hover:to-gray-700 
             hover:gray-yellow-400/50 transition-all duration-300"
            >
              <ArrowLeft size={20} />
              {getTranslatedText("back")}
            </button>

            <button
              onClick={switchToTextMode}
              className="relative px-10 py-4 rounded-full font-semibold flex items-center gap-3 
             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
             text-black shadow-lg border border-yellow-300
             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 
             hover:shadow-yellow-400/50 transition-all duration-300"
            >
              <MessageCircle size={20} />
              {getTranslatedText("switch_to_text")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-10 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="w-full h-px bg-cyan-400 animate-pulse absolute top-1/4"></div>
        <div
          className="w-full h-px bg-orange-400 animate-pulse absolute top-2/4"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="w-full h-px bg-blue-400 animate-pulse absolute top-3/4"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <div className="p-2 border-b-4 border-cyan-500 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Left Side: Title */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 leading-tight">
                GENOXY
              </h1>
              <p className="text-white text-xs md:text-sm">
                VOICE ASSISTANT - INSURANCE AI LLM
              </p>
            </div>

            {/* Right Side: Buttons */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              <button
                onClick={
                  isListening ? stopVoiceConversation : startVoiceConversation
                }
                disabled={status === "inactive"}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isListening
              ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md animate-pulse"
              : "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md hover:from-teal-600 hover:to-blue-700"
          }`}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-full bg-red-400 opacity-30 blur-lg animate-ping"></span>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {isListening ? (
                    <span className="text-base">🔴</span>
                  ) : (
                    <Mic size={16} />
                  )}
                  <span className="text-sm">
                    {isListening
                      ? getTranslatedText("stop_voice")
                      : getTranslatedText("start_voice")}
                  </span>
                </span>
              </button>

              <button
                onClick={handleBack}
                className="relative flex items-center gap-2 px-5 py-2 rounded-full font-medium 
          bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md 
          hover:from-red-600 hover:to-red-800 hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft size={16} className="relative z-10" />
                <span className="relative z-10 text-sm">
                  {getTranslatedText("back")}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-auto">
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center">
            <div className="flex gap-3 w-full max-w-2xl justify-center flex-wrap mb-4">
              {languageConfigs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                    selectedLanguage.code === lang.code
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25"
                      : "bg-gray-800/50 border border-gray-600 backdrop-blur-md hover:bg-gray-700/50"
                  }`}
                >
                  <img
                    src={lang.imageUrl}
                    alt={lang.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm">{lang.nativeName}</span>
                </button>
              ))}
            </div>

            <div className="w-96 h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl flex items-center justify-center">
              <img
                src={selectedLanguage.imageUrl}
                alt="Assistant"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              onClick={switchToTextMode}
              className="relative px-10 py-4 rounded-full font-semibold flex items-center gap-3 
             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
             text-black shadow-lg border border-yellow-300
             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 
             hover:shadow-yellow-400/50 transition-all duration-300"
            >
              <Send size={18} />
              {getTranslatedText("switch_to_text")}
            </button>
          </div>

          <div className="w-full md:w-1/3 p-6 flex flex-col relative">
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 md:block hidden">
              <ArrowRight className="text-cyan-400 animate-pulse" size={40} />
            </div>

            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 md:block hidden">
              <ArrowLeft className="text-cyan-400 animate-pulse" size={40} />
            </div>

            <div className="flex-1 bg-gray-800/30 backdrop-blur-md border border-gray-400/30 rounded-2xl p-6 shadow-2xl flex flex-col">
              <div
                ref={conversationRef}
                className="flex-1 overflow-y-auto space-y-4 max-h-[500px]"
              >
                {chat.length > 0 ? (
                  <div className="flex flex-col justify-end space-y-4">
                    {chat.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-[80%] mx-auto p-4 rounded-2xl text-center ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white"
                            : "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white"
                        }`}
                      >
                        <p className="text-lg leading-relaxed">{msg.text}</p>
                        <span className="block text-xs opacity-70 mt-2">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Heading */}
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">
                          {getTranslatedText("live_conversation")}
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base">
                          {getTranslatedText("real_time_voice")}
                        </p>
                      </div>

                      {/* Mic Icon */}
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <Mic className="text-gray-400" size={32} />
                      </div>

                      {/* Status Text */}
                      <p className="text-gray-400 text-lg md:text-xl font-medium">
                        {isListening
                          ? getTranslatedText("listening")
                          : getTranslatedText("click_to_start")}
                      </p>

                      {/* Action Button */}
                      <button
                        onClick={
                          isListening
                            ? stopVoiceConversation
                            : startVoiceConversation
                        }
                        disabled={status === "inactive"}
                        className={`relative flex items-center justify-center gap-3 px-8 py-3 rounded-full font-semibold text-base md:text-lg transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isListening
            ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg animate-pulse"
            : "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md hover:from-teal-600 hover:to-blue-700"
        }`}
                      >
                        {isListening && (
                          <span className="absolute inset-0 rounded-full bg-red-400 opacity-30 blur-lg animate-ping"></span>
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {isListening ? (
                            <span className="text-lg">🔴</span>
                          ) : (
                            <Mic size={20} />
                          )}
                          <span>
                            {isListening
                              ? getTranslatedText("stop_voice")
                              : getTranslatedText("start_voice")}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - User Camera */}
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center relative">
            <div className="w-96 h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
              {isCameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover transform scale-90"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                    <p className="text-gray-300 text-xl font-medium">
                      Your Camera
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Camera will activate with voice
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Camera Control Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={enableCamera}
                disabled={isCameraEnabled}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={20} />
                {getTranslatedText("enable_camera")}
              </button>
              <button
                onClick={disableCamera}
                disabled={!isCameraEnabled}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold hover:from-red-600 hover:to-rose-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CameraOff size={20} />
                {getTranslatedText("disable_camera")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceLLmVoice;
