import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

import RealTimeHeader from "./RealTimeHeader";
import RealTimeWelcomeScreen from "./RealTimeWellcomescreen";
import StartScreen from "./RealTimeStartScreen";
import ConversationScreen from "./RealTImeConversation";

import { useState, useEffect } from "react";
import { LanguageConfig, ChatMessage } from "../types/types";
import { voiceSessionService } from "../hooks/useMessages";

type Screen = "welcome" | "start" | "conversation";

const RealtimePage: React.FC = () => {
  const { screen } = useParams<{ screen?: Screen }>();
  const navigate = useNavigate();

  // States for language, chat etc
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageConfig | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<string>("");

  // Default to 'welcome' if screen param is invalid or missing
  const currentScreen: Screen =
    screen === "start" || screen === "conversation" ? screen : "welcome";

  // When screen changes to welcome, reset language and session states
  useEffect(() => {
    if (currentScreen === "welcome") {
      setSelectedLanguage(null);
      setIsSessionActive(false);
      setIsAssistantSpeaking(false);
      setChat([]);
      setIsConnecting(false);
      setSelectedInstructions("");
    }
  }, [currentScreen]);

  // Navigation helpers to move between screens via URL
  const goToScreen = (newScreen: Screen) => {
    navigate(`/voiceAssistant/${newScreen}`);
  };

  const handleLanguageSelect = (
    language: LanguageConfig,
    instructions: string
  ) => {
    setSelectedLanguage(language);
    setSelectedInstructions(instructions);
    goToScreen("start");
  };

  const handleBackToWelcome = () => {
    goToScreen("welcome");
  };

  const handleStartSession = async () => {
    if (!selectedLanguage) return;

    setIsConnecting(true);
    try {
      await voiceSessionService.startSession(
        "",
        selectedLanguage,
        selectedInstructions,
        (message: ChatMessage) => {
          setChat((prev) => {
            if (message.role === "assistant") {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage && lastMessage.role === "assistant") {
                const updated = [...prev];
                updated[updated.length - 1] = message;
                return updated;
              }
            }
            return [...prev, message];
          });
        },
        (speaking: boolean) => {
          setIsAssistantSpeaking(speaking);
        },
        navigate
      );

      setIsSessionActive(true);
      goToScreen("conversation");
      setChat([]);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStopSession = () => {
    voiceSessionService.stopSession();
    setIsSessionActive(false);
    setIsAssistantSpeaking(false);
    setChat([]);
    setSelectedLanguage(null);
    goToScreen("welcome");
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChat((prev) => [...prev, userMessage]);
    voiceSessionService.sendMessage(message);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <RealTimeWelcomeScreen onLanguageSelect={handleLanguageSelect} />
        );

      case "start":
        return selectedLanguage ? (
          <StartScreen
            selectedLanguage={selectedLanguage}
            isConnecting={isConnecting}
            onStartSession={handleStartSession}
          />
        ) : (
          // If no language selected, fallback to welcome screen
          <RealTimeWelcomeScreen onLanguageSelect={handleLanguageSelect} />
        );

      case "conversation":
        return selectedLanguage ? (
          <ConversationScreen
            selectedLanguage={selectedLanguage}
            chat={chat}
            isAssistantSpeaking={isAssistantSpeaking}
            onSendMessage={handleSendMessage}
          />
        ) : (
          // If no language selected, fallback to welcome screen
          <RealTimeWelcomeScreen onLanguageSelect={handleLanguageSelect} />
        );

      default:
        return (
          <RealTimeWelcomeScreen onLanguageSelect={handleLanguageSelect} />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {currentScreen !== "welcome" && (
        <RealTimeHeader
          selectedLanguage={selectedLanguage}
          isSessionActive={isSessionActive}
          isConnecting={isConnecting}
          onBackClick={handleBackToWelcome}
          onStartSession={handleStartSession}
          onStopSession={handleStopSession}
          currentScreen={currentScreen}
        />
      )}
      {renderCurrentScreen()}
    </div>
  );
};

export default RealtimePage;
