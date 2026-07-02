import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  Square,
  Loader2,
  Trash2,
  X,
  Bot,
  MessageCircle,
  Smartphone,
  LogIn,
  UserPlus,
  Sparkles,
  Volume2,
} from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";
import BASE_URL from "../Config";

interface VoiceLoginPageProps {
  onClose: () => void;
}

interface VoiceAuthMessage {
  id: string;
  type: "user" | "ai" | "loading";
  text?: string;
  createdAt: Date;
}

type UserType = "Login" | "Register";
type RegistrationType = "whatsapp" | "mobile";

const VOICE_LOGIN_API = `${BASE_URL}/user-service/loginOrregisterThroughVoice`;

const SILENCE_LIMIT_MS = 4000;
const MIN_RECORDING_MS = 1200;

function sanitizeBase64Audio(input?: string) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/^data:audio\/[a-zA-Z0-9+.-]+;base64,/, "")
    .replace(/\s/g, "")
    .trim();
}

function guessAudioMimeType(base64: string) {
  if (base64.startsWith("UklGR")) return "audio/wav";
  if (base64.startsWith("T2dnUw")) return "audio/ogg";
  if (base64.startsWith("SUQz") || base64.startsWith("//")) return "audio/mpeg";
  return "audio/mpeg";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatRichText(text?: string) {
  if (!text) return "";
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

function extractMobileNumber(text: string) {
  const wordMap: Record<string, string> = {
    zero: "0",
    oh: "0",
    o: "0",
    one: "1",
    won: "1",
    two: "2",
    to: "2",
    too: "2",
    three: "3",
    tree: "3",
    four: "4",
    for: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    ate: "8",
    nine: "9",
  };

  let cleaned = (text || "").toLowerCase();

  Object.keys(wordMap).forEach((word) => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "g"), wordMap[word]);
  });

  cleaned = cleaned.replace(/\D/g, "");

  if (cleaned.length > 10 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.length > 10) {
    cleaned = cleaned.slice(-10);
  }

  return cleaned.length === 10 ? cleaned : "";
}

function hasMeaningfulVoiceInput(text?: string, audioBlob?: Blob | null) {
  return (text || "").trim().length > 0 || (!!audioBlob && audioBlob.size > 1200);
}

function cleanTranscriptText(value: string) {
  return (value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
}

const VoiceLoginPage: React.FC<VoiceLoginPageProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<VoiceAuthMessage[]>([]);
  const [userType, setUserType] = useState<UserType>("Login");
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("whatsapp");

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const latestTranscriptRef = useRef("");
  const shouldKeepSpeechRecognitionRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number>(0);
  const shouldSubmitAfterStopRef = useRef(false);
  const isListeningRef = useRef(false);
  const isAssistantSpeakingRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isAssistantSpeakingRef.current = isAssistantSpeaking;
  }, [isAssistantSpeaking]);

  const titleText = useMemo(
    () =>
      `${userType} via ${
        registrationType === "whatsapp" ? "WhatsApp" : "SMS"
      }`,
    [userType, registrationType]
  );

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopAssistantAudio = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    } catch {}
    setIsAssistantSpeaking(false);
  };

  const playAssistantAudio = (base64Audio?: string) => {
    const clean = sanitizeBase64Audio(base64Audio);
    if (!clean) return;

    try {
      stopAssistantAudio();

      const audio = new Audio(`data:${guessAudioMimeType(clean)};base64,${clean}`);
      audioRef.current = audio;
      setIsAssistantSpeaking(true);

      audio.onended = () => {
        setIsAssistantSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsAssistantSpeaking(false);
        audioRef.current = null;
      };

      audio.play().catch(() => {
        setIsAssistantSpeaking(false);
        audioRef.current = null;
      });
    } catch {
      setIsAssistantSpeaking(false);
    }
  };

  const stopSpeechRecognition = () => {
    shouldKeepSpeechRecognitionRef.current = false;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop?.();
        recognitionRef.current = null;
      }
    } catch {
      recognitionRef.current = null;
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      message.warning(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    stopSpeechRecognition();

    shouldKeepSpeechRecognitionRef.current = true;
    finalTranscriptRef.current = "";
    latestTranscriptRef.current = "";
    transcriptRef.current = "";

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript || "";

        if (result.isFinal) {
          finalTranscriptRef.current = cleanTranscriptText(
            `${finalTranscriptRef.current} ${transcript}`
          );
        } else {
          interimTranscript = cleanTranscriptText(
            `${interimTranscript} ${transcript}`
          );
        }
      }

      const spokenText = cleanTranscriptText(
        `${finalTranscriptRef.current} ${interimTranscript}`
      );

      if (spokenText) {
        transcriptRef.current = spokenText;
        latestTranscriptRef.current = spokenText;
        setLiveTranscript(spokenText);
        startSilenceTimer();
      }
    };

    recognition.onerror = (event: any) => {
      if (event?.error === "no-speech" || event?.error === "aborted") {
        return;
      }

      if (isListeningRef.current) {
        startSilenceTimer();
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;

      if (
        shouldKeepSpeechRecognitionRef.current &&
        isListeningRef.current &&
        !isSubmittingRef.current &&
        !isAssistantSpeakingRef.current
      ) {
        window.setTimeout(() => {
          try {
            startSpeechRecognition();
          } catch {
            // Browser may already be restarting recognition.
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      // Recognition may already be running in the browser.
    }
  };

  const {
    status,
    startRecording,
    stopRecording,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    blobPropertyBag: { type: "audio/webm" },
    onStop: async (_blobUrl: string, blob: Blob) => {
      setIsListening(false);
      clearSilenceTimer();

      stopSpeechRecognition();

      if (!shouldSubmitAfterStopRef.current) return;

      shouldSubmitAfterStopRef.current = false;

      if (isAssistantSpeakingRef.current || isSubmittingRef.current) return;

      const finalSpokenText = cleanTranscriptText(
        finalTranscriptRef.current ||
          transcriptRef.current ||
          latestTranscriptRef.current ||
          ""
      );

      await submitVoice(blob, finalSpokenText);
    },
  });

  const startSilenceTimer = () => {
    clearSilenceTimer();

    silenceTimerRef.current = window.setTimeout(() => {
      const recordedFor = Date.now() - recordingStartedAtRef.current;

      if (
        recordedFor >= MIN_RECORDING_MS &&
        isListeningRef.current &&
        !isSubmittingRef.current
      ) {
        handleStopListening();
      } else if (isListeningRef.current) {
        startSilenceTimer();
      }
    }, SILENCE_LIMIT_MS);
  };

  useEffect(() => {
    const container = chatListRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      chatBottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      stopAssistantAudio();
      clearBlobUrl();

      stopSpeechRecognition();
    };
  }, [clearBlobUrl]);

  const clearChat = () => {
    clearSilenceTimer();
    setMessages([]);
    setLiveTranscript("");
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    latestTranscriptRef.current = "";
    shouldSubmitAfterStopRef.current = false;
    stopSpeechRecognition();
    stopAssistantAudio();
    clearBlobUrl();
  };

  const getOtpSuccessText = () =>
    registrationType === "whatsapp"
      ? "OTP sent to WhatsApp successfully"
      : "OTP sent to mobile number successfully";

  const getAuthSuccessText = () =>
    userType === "Login" ? "Login Successfully" : "Register Successfully";

  const containsAny = (value: string, list: string[]) =>
    list.some((item) => value.includes(item));

  const isOtpActuallySent = (result: any) => {
    const combined = JSON.stringify(result || {}).toLowerCase();

    return (
      containsAny(combined, [
        "otp sent",
        "otp has been sent",
        "otp sent successfully",
        "sent to whatsapp",
        "sent to mobile",
        "sent to sms",
        "verification code sent",
      ]) ||
      result?.otpSent === true ||
      result?.isOtpSent === true ||
      result?.data?.otpSent === true ||
      result?.data?.isOtpSent === true
    );
  };

  const extractToken = (result: any) =>
    result?.accessToken ||
    result?.token ||
    result?.jwtToken ||
    result?.authToken ||
    result?.data?.accessToken ||
    result?.data?.token ||
    result?.data?.jwtToken ||
    result?.data?.authToken ||
    "";

  const extractRefreshToken = (result: any) =>
    result?.refreshToken || result?.data?.refreshToken || "";

  const extractUserId = (result: any) =>
    result?.userId ||
    result?.customerId ||
    result?.id ||
    result?.data?.userId ||
    result?.data?.customerId ||
    result?.data?.id ||
    result?.user?.userId ||
    result?.user?.id ||
    result?.data?.user?.userId ||
    result?.data?.user?.id ||
    "";

  const isAuthActuallySuccessful = (result: any, token: string) => {
    const combined = JSON.stringify(result || {}).toLowerCase();

    return (
      !!token ||
      result?.success === true ||
      result?.status === true ||
      result?.authenticated === true ||
      result?.isAuthenticated === true ||
      result?.data?.success === true ||
      result?.data?.authenticated === true ||
      containsAny(combined, [
        "login successful",
        "logged in successfully",
        "register successful",
        "registered successfully",
        "authentication successful",
        "authenticated successfully",
      ])
    );
  };

  const buildAiMessage = (result: any) => {
    const text =
      result?.speechText ||
      result?.message ||
      result?.statusMessage ||
      result?.transcript ||
      result?.data?.speechText ||
      result?.data?.message ||
      "";

    if (String(text || "").trim()) return String(text).trim();
    if (isOtpActuallySent(result)) return getOtpSuccessText();

    return "Done.";
  };

  const fetchUserDetails = async (accessToken: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/user-service/me`, {
        headers: {
          accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = response?.data || {};

      const fetchedUserId =
        userData?.userId ||
        userData?.id ||
        userData?.customerId ||
        userData?.data?.userId ||
        "";

      if (fetchedUserId) {
        localStorage.setItem("userId", String(fetchedUserId));
        sessionStorage.setItem("userId", String(fetchedUserId));
      }

      return userData;
    } catch {
      return null;
    }
  };

  const handleStartListening = async () => {
    if (
      isListening ||
      isLoading ||
      isAssistantSpeaking ||
      isSubmittingRef.current
    ) {
      return;
    }

    try {
      clearSilenceTimer();
      stopAssistantAudio();
      clearBlobUrl();

      setLiveTranscript("");
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      latestTranscriptRef.current = "";
      shouldSubmitAfterStopRef.current = true;
      recordingStartedAtRef.current = Date.now();

      startRecording();
      setIsListening(true);
      isListeningRef.current = true;
      startSpeechRecognition();
      startSilenceTimer();
    } catch {
      setIsListening(false);
      isListeningRef.current = false;
      stopSpeechRecognition();
      clearSilenceTimer();
      message.error("Unable to access microphone.");
    }
  };

  const handleStopListening = () => {
    if (!isListening) return;

    clearSilenceTimer();
    setIsListening(false);
    isListeningRef.current = false;
    shouldSubmitAfterStopRef.current = true;

    stopSpeechRecognition();

    stopRecording();
  };

  const submitVoice = async (audioBlob?: Blob | null, transcript?: string) => {
    if (isAssistantSpeakingRef.current || isSubmittingRef.current) return;

    if (!hasMeaningfulVoiceInput(transcript, audioBlob || null)) {
      setLiveTranscript("");
      transcriptRef.current = "";
      message.error(
        "Voice not detected. Please speak your 10-digit mobile number clearly."
      );
      return;
    }

    const detectedMobileNumber = extractMobileNumber(transcript || "");

    const userText = detectedMobileNumber || (transcript || "").trim();

    const loadingId = `${Date.now()}-loading`;

    setMessages((prev) => [
      ...prev,
      ...(userText
        ? ([
            {
              id: `${Date.now()}-user`,
              type: "user",
              text: userText,
              createdAt: new Date(),
            },
          ] as VoiceAuthMessage[])
        : []),
      {
        id: loadingId,
        type: "loading",
        text: "Processing...",
        createdAt: new Date(),
      },
    ]);

    setIsLoading(true);
    isSubmittingRef.current = true;

    try {
      const formData = new FormData();

      formData.append(
        "file",
        audioBlob || new Blob([], { type: "audio/webm" }),
        `voice-auth-${Date.now()}.webm`
      );

      formData.append("registrationType", registrationType);
      formData.append("userType", userType);
      formData.append("transcript", transcript || "");

      if (detectedMobileNumber) {
        formData.append("mobileNumber", detectedMobileNumber);
        formData.append("mobile", detectedMobileNumber);
        formData.append("phoneNumber", detectedMobileNumber);
      }

      const response = await axios.post(VOICE_LOGIN_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response?.data || {};
      const token = extractToken(result);
      const refreshToken = extractRefreshToken(result);
      let userId = extractUserId(result);

      const otpSent = isOtpActuallySent(result);
      const authSuccessful = isAuthActuallySuccessful(result, token);
      const aiText = buildAiMessage(result);

      if (token) {
        sessionStorage.setItem("accessToken", token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (userId) {
        sessionStorage.setItem("userId", String(userId));
        localStorage.setItem("userId", String(userId));
      }

      if (token && !userId) {
        const userData = await fetchUserDetails(token);

        userId =
          userData?.userId ||
          userData?.id ||
          userData?.customerId ||
          userData?.data?.userId ||
          "";
      }

      setMessages((prev) => [
        ...prev.filter((item) => item.id !== loadingId),
        {
          id: `${Date.now()}-ai`,
          type: "ai",
          text: aiText,
          createdAt: new Date(),
        },
      ]);

      playAssistantAudio(result?.audio || result?.data?.audio);

      if (authSuccessful) {
        if (!userId) {
          message.error("Login succeeded but userId was not received.");
          return;
        }

        message.success(getAuthSuccessText());

        const redirectPath =
          sessionStorage.getItem("redirectPath") || "/main/dashboard/home";

        setTimeout(() => {
          onClose();
          navigate(redirectPath, { replace: true });
        }, 1200);

        return;
      }

      if (otpSent) {
        message.success(getOtpSuccessText());
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev.filter((item) => item.id !== loadingId),
        {
          id: `${Date.now()}-ai-error`,
          type: "ai",
          text:
            error?.response?.data?.message ||
            error?.message ||
            "Unable to process voice authentication.",
          createdAt: new Date(),
        },
      ]);

      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to process voice authentication."
      );
    } finally {
      setIsLoading(false);
      setLiveTranscript("");
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      latestTranscriptRef.current = "";
      isSubmittingRef.current = false;
      shouldSubmitAfterStopRef.current = false;
      clearBlobUrl();
    }
  };

  const handleClose = () => {
    clearSilenceTimer();
    shouldSubmitAfterStopRef.current = false;
    stopSpeechRecognition();

    if (isListeningRef.current) {
      try {
        stopRecording();
      } catch {
        // Recorder may already be stopped.
      }
    }

    setIsListening(false);
    stopAssistantAudio();
    clearBlobUrl();
    onClose();
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .oxy-voice-root {
          position: fixed;
          right: 16px;
          top: 84px;
          bottom: 16px;
          width: min(450px, calc(100vw - 32px));
          z-index: 9999;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          overflow: hidden;
          background: #f3f1f7;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 18px 50px rgba(26, 16, 59, 0.22);
        }

        .oxy-voice-header {
          background: linear-gradient(135deg, #8e30ff 0%, #6128dc 100%);
          color: #fff;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .oxy-voice-header-left {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .oxy-voice-bot-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .oxy-voice-header-text h3 {
          margin: 0;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 800;
          color: #fff;
        }

        .oxy-voice-header-text p {
          margin: 3px 0 0;
          font-size: 11px;
          line-height: 1.35;
          color: rgba(255,255,255,0.9);
        }

        .oxy-voice-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .oxy-voice-icon-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 10px;
          background: rgba(255,255,255,0.14);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .oxy-voice-icon-btn:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }

        .oxy-voice-body {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 10px;
          gap: 10px;
          background: #efedf3;
        }

        .oxy-voice-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: 2px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }

        .oxy-voice-card {
          background: #ffffff;
          border: 1px solid #e8e2f2;
          border-radius: 18px;
          padding: 12px;
        }

        .oxy-voice-intro {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .oxy-voice-intro-icon {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: linear-gradient(135deg, #8c31ff 0%, #6124de 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .oxy-voice-intro-content h4 {
          margin: 1px 0 5px;
          font-size: 14px;
          font-weight: 800;
          color: #181326;
        }

        .oxy-voice-intro-content p {
          margin: 0;
          font-size: 12px;
          line-height: 1.55;
          color: #6f6b81;
        }

        .oxy-voice-section-title {
          font-size: 11px;
          font-weight: 800;
          color: #5c5870;
          margin: 0 0 9px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .oxy-voice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .oxy-voice-option {
          border: 1px solid #e3daf2;
          background: #fff;
          border-radius: 14px;
          padding: 10px 8px;
          min-height: 72px;
          text-align: center;
          cursor: pointer;
          transition: 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          color: #1f1b2d;
        }

        .oxy-voice-option:hover {
          transform: translateY(-1px);
          border-color: #bda7f2;
          background: #faf7ff;
        }

        .oxy-voice-option.active {
          border-color: #a98cf0;
          background: #f4eeff;
        }

        .oxy-voice-option-icon {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #efe7ff;
          color: #7b34f7;
        }

        .oxy-voice-option.active .oxy-voice-option-icon {
          background: linear-gradient(135deg, #8d2fff 0%, #6725de 100%);
          color: #fff;
        }

        .oxy-voice-option strong {
          font-size: 12px;
          font-weight: 800;
          color: #1e1930;
        }

        .oxy-voice-option span {
          font-size: 10px;
          color: #7a758c;
        }

        .oxy-voice-selected,
        .oxy-voice-speaking {
          margin-top: 10px;
          border-radius: 12px;
          padding: 9px 11px;
          background: #f4efff;
          border: 1px solid #e4d8fb;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #6b2ee9;
          font-size: 12px;
          font-weight: 700;
        }

        .oxy-voice-speaking {
          background: #fff7ed;
          border-color: #fed7aa;
          color: #c2410c;
        }

        .oxy-voice-chat {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .oxy-voice-row {
          display: flex;
        }

        .oxy-voice-row.user {
          justify-content: flex-end;
        }

        .oxy-voice-row.ai,
        .oxy-voice-row.loading {
          justify-content: flex-start;
        }

        .oxy-voice-bubble {
          max-width: 84%;
          border-radius: 16px;
          padding: 10px 12px;
          font-size: 12px;
          line-height: 1.6;
          word-break: break-word;
        }

        .oxy-voice-bubble.user {
          background: linear-gradient(135deg, #8d30ff 0%, #6424db 100%);
          color: #fff;
          border-bottom-right-radius: 7px;
        }

        .oxy-voice-bubble.ai {
          background: #ffffff;
          color: #221d30;
          border: 1px solid #e6def2;
          border-bottom-left-radius: 7px;
        }

        .oxy-voice-bubble.loading {
          background: #f4f4f7;
          color: #7a7688;
          border: 1px solid #e4e4ea;
        }

        .oxy-voice-empty {
          background: #ffffff;
          border: 1px dashed #ddd6ea;
          border-radius: 14px;
          padding: 14px;
          text-align: center;
        }

        .oxy-voice-empty p {
          margin: 0;
          color: #7c778c;
          font-size: 11.5px;
          line-height: 1.5;
        }

        .oxy-voice-bottom {
          background: #efedf3;
          padding-top: 2px;
        }

        .oxy-voice-mic-wrap {
          background: #ffffff;
          border: 1px solid #e5dff0;
          border-radius: 18px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .oxy-voice-mic-icon-btn {
          width: 54px;
          height: 54px;
          min-width: 54px;
          border: none;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s ease;
          color: #fff;
          flex-shrink: 0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            0 10px 22px rgba(98, 36, 220, 0.22);
        }

        .oxy-voice-mic-icon-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
        }

        .oxy-voice-mic-icon-btn.start,
        .oxy-voice-mic-icon-btn.loading {
          background: linear-gradient(135deg, #8b2eff 0%, #6324dc 100%);
        }

        .oxy-voice-mic-icon-btn.stop {
          background: linear-gradient(135deg, #ef4444 0%, #d62828 100%);
          animation: pulseMic 1.2s infinite ease-in-out;
        }

        .oxy-voice-mic-icon-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .oxy-voice-mic-info {
          min-width: 0;
          flex: 1;
        }

        .oxy-voice-mic-info strong {
          font-size: 13px;
          font-weight: 800;
          color: #161222;
        }

        .oxy-voice-mic-info span {
          display: block;
          font-size: 11px;
          line-height: 1.45;
          color: #726d82;
          margin-top: 3px;
          word-break: break-word;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseMic {
          0% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.35),
              0 0 0 0 rgba(239, 68, 68, 0.28);
          }
          70% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.35),
              0 0 0 12px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.35),
              0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @media (max-width: 768px) {
          .oxy-voice-root {
            right: 8px;
            left: 8px;
            width: auto;
            top: auto;
            bottom: 8px;
            height: min(84vh, 760px);
            border-radius: 22px;
          }

          .oxy-voice-bubble {
            max-width: 92%;
          }
        }

        @media (max-width: 480px) {
          .oxy-voice-root {
            right: 0;
            left: 0;
            bottom: 0;
            top: auto;
            width: 100%;
            height: 87vh;
            border-radius: 20px 20px 0 0;
          }

          .oxy-voice-header {
            padding: 10px;
          }

          .oxy-voice-header-text h3 {
            font-size: 14px;
          }

          .oxy-voice-header-text p {
            font-size: 10px;
          }

          .oxy-voice-body {
            padding: 8px;
          }

          .oxy-voice-card {
            padding: 10px;
            border-radius: 14px;
          }

          .oxy-voice-option {
            min-height: 68px;
          }

          .oxy-voice-mic-wrap {
            padding: 10px;
            gap: 10px;
          }

          .oxy-voice-mic-icon-btn {
            width: 50px;
            height: 50px;
            min-width: 50px;
          }
        }
      `}</style>

      <div className="oxy-voice-root">
        <div className="oxy-voice-header">
          <div className="oxy-voice-header-left">
            <div className="oxy-voice-bot-icon">
              <Bot size={18} />
            </div>

            <div className="oxy-voice-header-text">
              <h3>Voice Assistant</h3>
              <p>Speak naturally. After 4 seconds pause, it auto submits.</p>
            </div>
          </div>

          <div className="oxy-voice-header-actions">
            <button
              type="button"
              className="oxy-voice-icon-btn"
              onClick={clearChat}
              aria-label="Clear chat"
            >
              <Trash2 size={14} />
            </button>

            <button
              type="button"
              className="oxy-voice-icon-btn"
              onClick={handleClose}
              aria-label="Close voice assistant"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="oxy-voice-body">
          <div className="oxy-voice-scroll" ref={chatListRef}>
            <div className="oxy-voice-card">
              <div className="oxy-voice-intro">
                <div className="oxy-voice-intro-icon">
                  <Sparkles size={16} />
                </div>

                <div className="oxy-voice-intro-content">
                  <h4>How can I help you?</h4>
                  <p>
                    Choose Login or Register, then WhatsApp or SMS. Tap mic and
                    speak your 10-digit mobile number clearly.
                  </p>
                </div>
              </div>
            </div>

            <div className="oxy-voice-card">
              <h5 className="oxy-voice-section-title">Choose Action</h5>

              <div className="oxy-voice-grid">
                <button
                  type="button"
                  className={`oxy-voice-option ${
                    userType === "Login" ? "active" : ""
                  }`}
                  onClick={() => setUserType("Login")}
                  disabled={isLoading || isListening}
                >
                  <div className="oxy-voice-option-icon">
                    <LogIn size={14} />
                  </div>
                  <strong>Login</strong>
                  <span>Existing user</span>
                </button>

                <button
                  type="button"
                  className={`oxy-voice-option ${
                    userType === "Register" ? "active" : ""
                  }`}
                  onClick={() => setUserType("Register")}
                  disabled={isLoading || isListening}
                >
                  <div className="oxy-voice-option-icon">
                    <UserPlus size={14} />
                  </div>
                  <strong>Register</strong>
                  <span>New user</span>
                </button>
              </div>
            </div>

            <div className="oxy-voice-card">
              <h5 className="oxy-voice-section-title">Choose OTP Type</h5>

              <div className="oxy-voice-grid">
                <button
                  type="button"
                  className={`oxy-voice-option ${
                    registrationType === "whatsapp" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("whatsapp")}
                  disabled={isLoading || isListening}
                >
                  <div className="oxy-voice-option-icon">
                    <MessageCircle size={14} />
                  </div>
                  <strong>WhatsApp</strong>
                  <span>Receive OTP on WhatsApp</span>
                </button>

                <button
                  type="button"
                  className={`oxy-voice-option ${
                    registrationType === "mobile" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("mobile")}
                  disabled={isLoading || isListening}
                >
                  <div className="oxy-voice-option-icon">
                    <Smartphone size={14} />
                  </div>
                  <strong>SMS</strong>
                  <span>Receive OTP on mobile</span>
                </button>
              </div>

              <div className="oxy-voice-selected">
                <Sparkles size={13} />
                Selected: {titleText}
              </div>

              {isAssistantSpeaking && (
                <div className="oxy-voice-speaking">
                  <Volume2 size={12} />
                  Assistant is speaking
                </div>
              )}
            </div>

            {messages.length > 0 ? (
              <div className="oxy-voice-chat">
                {messages.map((msg) => (
                  <div key={msg.id} className={`oxy-voice-row ${msg.type}`}>
                    <div className={`oxy-voice-bubble ${msg.type}`}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatRichText(msg.text || ""),
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div ref={chatBottomRef} />
              </div>
            ) : (
              <div className="oxy-voice-empty">
                <p>Your voice request and assistant response will appear here.</p>
              </div>
            )}
          </div>

          <div className="oxy-voice-bottom">
            <div className="oxy-voice-mic-wrap">
              <button
                type="button"
                className={`oxy-voice-mic-icon-btn ${
                  isLoading ? "loading" : isListening ? "stop" : "start"
                }`}
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isLoading || isAssistantSpeaking}
                aria-label={isListening ? "Stop recording" : "Start recording"}
              >
                {isLoading ? (
                  <Loader2 size={22} className="spin" />
                ) : isListening ? (
                  <Square size={20} />
                ) : (
                  <Mic size={22} />
                )}
              </button>

              <div className="oxy-voice-mic-info">
                <strong>
                  {isLoading
                    ? "Processing..."
                    : isListening
                    ? "Listening..."
                    : isAssistantSpeaking
                    ? "Assistant speaking..."
                    : "Tap the mic to speak"}
                </strong>

                <span>
                  {isListening
                    ? liveTranscript ||
                      "Speak your 10-digit mobile number. It auto-submits after 4 seconds pause."
                    : status === "idle"
                    ? titleText
                    : `${titleText}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ); 
};

export default VoiceLoginPage;