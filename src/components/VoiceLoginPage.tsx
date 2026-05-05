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
  let formatted = escapeHtml(text);
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/\n/g, "<br/>");
  return formatted;
}

function hasMeaningfulVoiceInput(text?: string, audioBlob?: Blob | null) {
  const clean = (text || "").trim();
  const hasText = clean.length > 0;
  const hasAudio = !!audioBlob && audioBlob.size > 1200;
  return hasText || hasAudio;
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef("");
  const isSubmittingRef = useRef(false);
  const hasProcessedStopRef = useRef(false);

  const titleText = useMemo(() => {
    return `${userType} via ${
      registrationType === "whatsapp" ? "WhatsApp" : "SMS"
    }`;
  }, [userType, registrationType]);

  const selectionMessage = useMemo(() => {
    return `${userType} via ${
      registrationType === "whatsapp" ? "WhatsApp" : "SMS"
    }`;
  }, [userType, registrationType]);

  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let combinedText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        combinedText += event.results[i][0].transcript;
      }
      const finalText = combinedText.trim();
      transcriptRef.current = finalText;
      setLiveTranscript(finalText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  useEffect(() => {
    const container = chatListRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
      chatBottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopAssistantAudio();
      stopRecordingTracks();
    };
  }, []);

  const stopRecordingTracks = () => {
    mediaStreamRef.current?.getTracks()?.forEach((track) => track.stop());
    mediaStreamRef.current = null;
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
      const mimeType = guessAudioMimeType(clean);
      const audio = new Audio(`data:${mimeType};base64,${clean}`);
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

  const clearChat = () => {
    setMessages([]);
    setLiveTranscript("");
    transcriptRef.current = "";
    hasProcessedStopRef.current = false;
    stopAssistantAudio();
  };

  const getOtpSuccessText = () => {
    return registrationType === "whatsapp"
      ? "OTP sent to WhatsApp successfully"
      : "OTP sent to mobile number successfully";
  };

  const getAuthSuccessText = () => {
    return userType === "Login" ? "Login Successfully" : "Register Successfully";
  };

  const containsAny = (value: string, list: string[]) => {
    return list.some((item) => value.includes(item));
  };

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
    const backendText =
      result?.speechText ||
      result?.message ||
      result?.statusMessage ||
      result?.transcript ||
      result?.data?.speechText ||
      result?.data?.message ||
      "";

    const cleanText = String(backendText || "").trim();

    if (cleanText) return cleanText;
    if (isOtpActuallySent(result)) return getOtpSuccessText();

    return "Done.";
  };

  const extractToken = (result: any) => {
    return (
      result?.accessToken ||
      result?.token ||
      result?.jwtToken ||
      result?.authToken ||
      result?.data?.accessToken ||
      result?.data?.token ||
      result?.data?.jwtToken ||
      result?.data?.authToken ||
      ""
    );
  };

  const extractRefreshToken = (result: any) => {
    return result?.refreshToken || result?.data?.refreshToken || "";
  };

  const extractUserId = (result: any) => {
    return (
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
      ""
    );
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
    } catch (error) {
      console.error("Failed to fetch /me after voice auth", error);
      return null;
    }
  };

  const startListening = async () => {
    if (isListening || isLoading || isAssistantSpeaking || isSubmittingRef.current) {
      return;
    }

    try {
      stopAssistantAudio();
      setLiveTranscript("");
      transcriptRef.current = "";
      chunksRef.current = [];
      hasProcessedStopRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (hasProcessedStopRef.current) return;
        hasProcessedStopRef.current = true;

        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stopRecordingTracks();

        if (isAssistantSpeaking || isSubmittingRef.current) return;
        await submitVoice(audioBlob, transcriptRef.current);
      };

      recorder.start();

      try {
        recognitionRef.current?.start?.();
      } catch {}

      setIsListening(true);
    } catch {
      setIsListening(false);
      stopRecordingTracks();
      message.error("Unable to access microphone.");
    }
  };

  const stopListening = () => {
    if (!isListening) return;

    setIsListening(false);

    try {
      recognitionRef.current?.stop?.();
    } catch {}

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch {
      stopRecordingTracks();
    }
  };

  const submitVoice = async (audioBlob?: Blob | null, transcript?: string) => {
    if (isAssistantSpeaking || isSubmittingRef.current) return;

    if (!hasMeaningfulVoiceInput(transcript, audioBlob || null)) {
      setLiveTranscript("");
      transcriptRef.current = "";
      return;
    }

    const userText = (transcript || "").trim() || "Voice input recorded";
    const loadingId = `${Date.now()}-loading`;

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user`,
        type: "user",
        text: userText,
        createdAt: new Date(),
      },
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

      const response = await axios.post(VOICE_LOGIN_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

      setMessages((prev) => {
        const withoutLoading = prev.filter((item) => item.id !== loadingId);
        return [
          ...withoutLoading,
          {
            id: `${Date.now()}-ai`,
            type: "ai",
            text: aiText,
            createdAt: new Date(),
          },
        ];
      });

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
      setMessages((prev) => {
        const withoutLoading = prev.filter((item) => item.id !== loadingId);
        return [
          ...withoutLoading,
          {
            id: `${Date.now()}-ai-error`,
            type: "ai",
            text:
              error?.response?.data?.message ||
              error?.message ||
              "Unable to process voice authentication.",
            createdAt: new Date(),
          },
        ];
      });

      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to process voice authentication."
      );
    } finally {
      setIsLoading(false);
      setLiveTranscript("");
      transcriptRef.current = "";
      isSubmittingRef.current = false;
    }
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

        .oxy-voice-header-text {
          min-width: 0;
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
          border-color: #cdbaf0;
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
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.15;
          color: #1e1930;
        }

        .oxy-voice-option span {
          display: block;
          font-size: 10px;
          line-height: 1.25;
          color: #7a758c;
        }

        .oxy-voice-selected {
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #6b2ee9;
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
          border-bottom-left-radius: 7px;
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
          box-shadow: 0 10px 22px rgba(98, 36, 220, 0.22);
        }

        .oxy-voice-mic-icon-btn.start {
          background: linear-gradient(135deg, #8b2eff 0%, #6324dc 100%);
        }

        .oxy-voice-mic-icon-btn.stop {
          background: linear-gradient(135deg, #ef4444 0%, #d62828 100%);
        }

        .oxy-voice-mic-icon-btn.loading {
          background: linear-gradient(135deg, #8b2eff 0%, #6324dc 100%);
          opacity: 0.8;
          cursor: not-allowed;
        }

        .oxy-voice-mic-info {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .oxy-voice-mic-info strong {
          font-size: 13px;
          font-weight: 800;
          color: #161222;
          line-height: 1.2;
        }

        .oxy-voice-mic-info span {
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

        .oxy-voice-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .oxy-voice-scroll::-webkit-scrollbar-thumb {
          background: #d6d0e2;
          border-radius: 999px;
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

          .oxy-voice-bot-icon {
            width: 34px;
            height: 34px;
            border-radius: 10px;
          }

          .oxy-voice-header-text h3 {
            font-size: 14px;
          }

          .oxy-voice-header-text p {
            font-size: 10px;
          }

          .oxy-voice-icon-btn {
            width: 30px;
            height: 30px;
          }

          .oxy-voice-body {
            padding: 8px;
          }

          .oxy-voice-card {
            padding: 10px;
            border-radius: 14px;
          }

          .oxy-voice-grid {
            gap: 7px;
          }

          .oxy-voice-option {
            min-height: 68px;
            border-radius: 12px;
            padding: 9px 7px;
          }

          .oxy-voice-option-icon {
            width: 26px;
            height: 26px;
          }

          .oxy-voice-option strong {
            font-size: 11.5px;
          }

          .oxy-voice-option span {
            font-size: 9.5px;
          }

          .oxy-voice-mic-wrap {
            padding: 10px;
            gap: 10px;
          }

          .oxy-voice-mic-icon-btn {
            width: 50px;
            height: 50px;
            min-width: 50px;
            border-radius: 15px;
          }

          .oxy-voice-mic-info strong {
            font-size: 12px;
          }

          .oxy-voice-mic-info span {
            font-size: 10.5px;
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
              <p>Ask for login or registration using WhatsApp or mobile OTP</p>
            </div>
          </div>

          <div className="oxy-voice-header-actions">
            <button
              type="button"
              className="oxy-voice-icon-btn"
              onClick={clearChat}
              title="Clear"
            >
              <Trash2 size={14} />
            </button>

            <button
              type="button"
              className="oxy-voice-icon-btn"
              onClick={onClose}
              title="Close"
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
                    First choose Login or Register. Then choose WhatsApp or SMS.
                    After that, tap the mic and speak.
                  </p>
                </div>
              </div>
            </div>

            <div className="oxy-voice-card">
              <h5 className="oxy-voice-section-title">Choose Action</h5>

              <div className="oxy-voice-grid">
                <button
                  type="button"
                  className={`oxy-voice-option ${userType === "Login" ? "active" : ""}`}
                  onClick={() => setUserType("Login")}
                >
                  <div className="oxy-voice-option-icon">
                    <LogIn size={14} />
                  </div>
                  <strong>Login</strong>
                  <span>Existing user</span>
                </button>

                <button
                  type="button"
                  className={`oxy-voice-option ${userType === "Register" ? "active" : ""}`}
                  onClick={() => setUserType("Register")}
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
                Selected: {selectionMessage}
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
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                title={
                  isLoading
                    ? "Processing"
                    : isListening
                    ? "Stop recording"
                    : "Start recording"
                }
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
                    : "Tap the mic to speak"}
                </strong>
                <span>
                  {isListening
                    ? liveTranscript || "Listening for your voice..."
                    : titleText}
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