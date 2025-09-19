// /components/fanofog/BananaImageGenerate.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Download,
  X,
  Camera,
  Sparkles,
  ArrowLeft,
  Sword,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import BASE_URL from "../Config"

/** ---------- Endpoints ---------- */
const UPLOAD_IMAGE_ENDPOINT = `${BASE_URL}/product-service/uploadComboImages`;
const EDIT_GEMINI_ENDPOINT = `${BASE_URL}/ai-service/agent/editGeminiImage`;

/** ---------- Types ---------- */
interface UploadedImage {
  imageUrl: string;
  status: boolean;
}
interface FormDataShape {
  imageUrl?: string;
}
interface EditGeminiImageResponse {
  imageUrl?: string;
  url?: string;
  dataUrl?: string;
  base64?: string;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { data?: string; mimeType?: string };
        text?: string;
      }>;
    };
  }>;
}
type GenderType = "Boy" | "Girl";
type CinematicOpeningProps = { onDone?: () => void };

/** ---------- Prompts ---------- */
const BOY_PROMPT = `A 4K ultra-realistic cinematic poster of a man leaning stylishly against the side of a 1973 Chevrolet Chevelle Malibu in glossy black, shown in the exact same angle and direction as the reference image. The man is posed confidently, leaning on the car door, with one hand in his pocket and the other holding a small transparent Indian cutting chai glass (without handle), gripped naturally between his fingers. The chai glass is filled with steaming hot tea, with visible vapor rising upwards.

The man is dressed in a black leather jacket over a dark maroon/burgundy shirt with the top buttons open, paired with large flared black bell-bottom pants and polished black shoes. His face is clearly visible (no sunglasses), with a calm, charismatic expression.

Text styling on the car door:
Line 1 (top): “THE FAN OF” in bold white uppercase.
Line 2 (below): “OG” in much larger distressed bold red letters.
Placement is carefully adjusted so the text is clearly visible and not overlapped by the character’s body, blending naturally with the glossy black surface.

The background is a cinematic bluish-grey overcast sky, slightly brightened for clarity. Several black birds are scattered across the sky in different positions and directions, creating natural depth and motion (not aligned in a straight line). The ground is dark asphalt with faint red reflections, adding intensity. Soft cinematic lighting highlights the folds of the jacket, the deep tone of the maroon shirt, the flare of the bell-bottom pants, the steam from the chai glass, the polished reflections of the Chevelle Malibu, and the bold impactful text on the car door.`;

const GIRL_PROMPT = `A 4K ultra-realistic cinematic poster of a woman leaning stylishly against the side of a 1973 Chevrolet Chevelle Malibu in glossy black, shown in the exact same angle and direction as the reference image. The woman is posed confidently, leaning on the car door, with one hand in her pocket and the other holding a small transparent Indian cutting chai glass (without handle), gripped naturally between her fingers. The chai glass is filled with steaming hot tea, with visible vapor rising upwards.

The woman is dressed in a sleek black leather jacket layered over a fitted dark maroon/burgundy round-neck t-shirt, paired with large flared black bell-bottom pants and polished black shoes. Her face is clearly visible (no sunglasses), with a calm, charismatic expression, giving a strong cinematic aura.

Text styling on the car door:
Line 1 (top): “THE FAN OF” in bold white uppercase.
Line 2 (below): “OG” in much larger distressed bold red letters.
Placement is carefully adjusted so the text is clearly visible and not overlapped by the character’s body, blending naturally with the glossy black surface.

The background is a cinematic bluish-grey overcast sky, slightly brightened for clarity. Several black birds are scattered across the sky in different positions and directions, creating natural depth and motion (not aligned in a straight line). The ground is dark asphalt with faint red reflections, adding intensity. Soft cinematic lighting highlights the folds of the leather jacket, the deep tone of the maroon round-neck t-shirt, the flare of the bell-bottom pants, the steam from the chai glass, and the polished reflections of the Chevelle Malibu, and the bold impactful text on the car door.`;

/** ---------- Helpers ---------- */
const pickPrompt = (gender: GenderType) =>
  gender === "Boy" ? BOY_PROMPT : GIRL_PROMPT;
const looksLikeBase64 = (x?: string) =>
  !!x && /^[A-Za-z0-9+/=\s\n]+$/.test(x) && x.replace(/\s/g, "").length > 100;

function extractDeepBase64(obj: any): string | null {
  if (obj == null) return null;
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      for (const v of obj) {
        const r = extractDeepBase64(v);
        if (r) return r;
      }
    } else {
      for (const [k, v] of Object.entries(obj)) {
        const lk = k.toLowerCase();
        if (
          (lk.includes("base64") || lk === "data") &&
          typeof v === "string" &&
          looksLikeBase64(v)
        ) {
          return v.replace(/\s/g, "");
        }
        const r = extractDeepBase64(v);
        if (r) return r;
      }
    }
  }
  return null;
}

async function parseAny(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) return await res.json();
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

function pickUploadUrl(payload: any): string | null {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  const direct =
    payload.s3Url ||
    payload.imageUrl ||
    payload.url ||
    payload.documentPath ||
    payload.dataUrl;
  if (direct) return direct;
  if (payload.data) {
    const d = payload.data;
    return (
      d.s3Url || d.imageUrl || d.url || d.documentPath || d.dataUrl || null
    );
  }
  return null;
}

function normalizeBearer(raw?: string | null): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (!t) return null;
  const cleaned = t.toLowerCase().startsWith("bearer ") ? t.slice(7).trim() : t;
  return `Bearer ${cleaned}`;
}

function getAuthHeaderFromStorage(): string | null {
  const t1 =
    (typeof window !== "undefined" && localStorage.getItem("token")) || null;
  const t2 =
    (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
    null;
  return normalizeBearer(t1 || t2);
}

const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<
    "intro" | "zoom" | "reveal" | "slash" | "split" | "complete"
  >("intro");
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // schedule phase changes - 35% faster
    const timers = [
      setTimeout(() => setPhase("zoom"), 400), // was 1000
      setTimeout(() => setPhase("reveal"), 1000), // was 2000
      setTimeout(() => setPhase("slash"), 2000), // was 3500
      setTimeout(() => setPhase("split"), 2500), // was 4500
      setTimeout(() => setPhase("complete"), 3000), // was 5500
      setTimeout(() => {
        setShowModal(false);
        onDone?.(); // notify parent so it can unmount the intro
      }, 3900), // was 6000
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Cinematic black bars */}
        <motion.div
          className="absolute top-0 left-0 w-full h-16 bg-black z-50"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-16 bg-black z-50"
          initial={{ y: 64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Main container with perspective */}
        <motion.div
          className="relative w-[90vw] max-w-[800px] h-[70vh] perspective-1000"
          style={{ perspective: "1000px" }}
          initial={{ scale: 0.3, rotateX: 45, z: -500 }}
          animate={
            phase === "zoom"
              ? { scale: 1, rotateX: 0, z: 0 }
              : phase === "intro"
              ? { scale: 0.3, rotateX: 45, z: -500 }
              : { scale: 1, rotateX: 0, z: 0 }
          }
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Atmospheric particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Dramatic lighting sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%", opacity: 0 }}
            animate={
              phase === "reveal"
                ? { x: "200%", opacity: 1 }
                : phase === "slash"
                ? { x: "200%", opacity: 0 }
                : { x: "-100%", opacity: 0 }
            }
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Paper modal - Left half */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl"
            style={{
              transformOrigin: "right center",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateY: 0 }}
            animate={
              phase === "split"
                ? {
                    rotateY: -120,
                    x: -300,
                    z: -200,
                    opacity: 0.7,
                  }
                : {
                    rotateY: 0,
                    x: 0,
                    z: 0,
                    opacity: 1,
                  }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Paper texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_50%)]" />
          </motion.div>

          {/* Paper modal - Right half */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-white via-gray-50 to-gray-100 shadow-2xl"
            style={{
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateY: 0 }}
            animate={
              phase === "split"
                ? {
                    rotateY: 120,
                    x: 300,
                    z: -200,
                    opacity: 0.7,
                  }
                : {
                    rotateY: 0,
                    x: 0,
                    z: 0,
                    opacity: 1,
                  }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Paper texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.8),transparent_50%)]" />
          </motion.div>

          {/* Katana with dramatic entry */}
          <motion.div
            className="absolute"
            initial={{
              x: -400,
              y: -300,
              rotate: 145,
              scale: 0.5,
              opacity: 0,
            }}
            animate={
              phase === "slash"
                ? {
                    x: 500,
                    y: 400,
                    rotate: 45,
                    scale: 1.5,
                    opacity: 1,
                  }
                : phase === "reveal"
                ? {
                    x: -200,
                    y: -200,
                    rotate: 145,
                    scale: 0.8,
                    opacity: 0.7,
                  }
                : {
                    x: -400,
                    y: -300,
                    rotate: 145,
                    scale: 0.5,
                    opacity: 0,
                  }
            }
            transition={{
              duration: phase === "slash" ? 0.6 : 1,
              ease: "easeInOut",
            }}
          >
            <Sword className="w-32 h-32 text-red-600 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] filter brightness-125" />

            {/* Sword trail */}
            <motion.div
              className="absolute -z-10 w-2 h-48 bg-gradient-to-b from-red-500/80 via-red-600/60 to-transparent origin-bottom"
              style={{
                transform: "translateX(16px) translateY(-24px) rotate(90deg)",
              }}
              initial={{ scaleX: 0 }}
              animate={
                phase === "slash"
                  ? { scaleX: 3, opacity: 0.8 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Slash impact effects */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === "slash"
                ? { scale: 1, opacity: 1 }
                : phase === "split"
                ? { scale: 2, opacity: 0 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.4 }}
          >
            {/* Central impact burst */}
            <div className="relative w-32 h-32">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 w-2 h-16 bg-gradient-to-b from-red-500 to-transparent origin-bottom"
                  style={{
                    transform: `rotate(${i * 45}deg) translateX(-4px)`,
                  }}
                  animate={
                    phase === "slash"
                      ? {
                          scaleY: [1, 2, 0.5],
                          opacity: [1, 0.8, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Electric sparks */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={
                  phase === "slash"
                    ? {
                        x: Math.cos((i * 30 * Math.PI) / 180) * 100,
                        y: Math.sin((i * 30 * Math.PI) / 180) * 100,
                        opacity: [1, 0],
                        scale: [1, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.03,
                  ease: "easeOut",
                }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>

          {/* Diagonal slash line */}
          <motion.div
            className="absolute left-0 top-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ transform: "rotate(35deg)", transformOrigin: "center" }}
          >
            <motion.div
              className="absolute left-1/2 top-0 h-full w-[6px] bg-gradient-to-b from-transparent via-red-500 to-transparent origin-center -translate-x-1/2"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={
                phase === "slash"
                  ? { scaleY: 1, opacity: 1 }
                  : phase === "split"
                  ? { scaleY: 1.2, opacity: 0.3 }
                  : { scaleY: 0, opacity: 0 }
              }
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Glow effect */}
            <motion.div
              className="absolute left-1/2 top-0 h-full w-[20px] bg-gradient-to-b from-transparent via-red-500/30 to-transparent origin-center -translate-x-1/2 blur-sm"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={
                phase === "slash"
                  ? { scaleY: 1, opacity: 1 }
                  : { scaleY: 0, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          {/* Background image with cinematic reveal */}
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={
              phase === "reveal"
                ? { opacity: 0.9, scale: 1 }
                : phase === "slash"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.2 }
            }
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src="https://i.ibb.co/PGfT4xFh/bgimage.png"
              alt="OG background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Cinematic vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
          </motion.div>

          {/* Title with dramatic typography */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0, y: 50, rotateX: 30 }}
            animate={
              phase === "reveal"
                ? { opacity: 1, y: 0, rotateX: 0 }
                : phase === "slash"
                ? { opacity: 1, y: -20, scale: 1.1 }
                : phase === "split"
                ? { opacity: 0, y: -50, scale: 0.8 }
                : { opacity: 0, y: 50, rotateX: 30 }
            }
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="text-center px-6 relative">
              {/* Title glow background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg blur-xl"
                animate={
                  phase === "slash"
                    ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              />

              <motion.h1
                className="relative text-2xl md:text-4xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
                }}
                animate={
                  phase === "slash"
                    ? {
                        textShadow: [
                          "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
                          "2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(255,0,0,0.6)",
                          "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                The Fan of{" "}
                <motion.span
                  className="text-red-600 relative"
                  animate={
                    phase === "slash"
                      ? {
                          color: ["#dc2626", "#ff0000", "#dc2626"],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  OG
                  {/* "OG" glow effect */}
                  <motion.span
                    className="absolute inset-0 text-red-400 blur-sm"
                    animate={
                      phase === "slash"
                        ? { opacity: [0, 1, 0] }
                        : { opacity: 0 }
                    }
                    transition={{ duration: 0.6 }}
                  >
                    OG
                  </motion.span>
                </motion.span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Screen shake effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              phase === "slash"
                ? {
                    x: [0, -2, 2, -1, 1, 0],
                    y: [0, 1, -1, 2, -2, 0],
                  }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>

        {/* Final flash effect */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={
            phase === "split" ? { opacity: [0, 0.8, 0] } : { opacity: 0 }
          }
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

/** ---------- Component ---------- */
const BananaImageGenerate: React.FC = () => {
  const navigate = useNavigate();

  // login guard on page open
  useEffect(() => {
    const userId =
      (typeof window !== "undefined" && localStorage.getItem("userId")) || "";
    if (!userId) {
      const next = "/ThefanofOG";
      sessionStorage.setItem("redirectPath", next);
      navigate(`/whatsapplogin?next=${encodeURIComponent(next)}`, {
        replace: true,
      });
    }
  }, [navigate]);

  const autoUserId =
    (typeof window !== "undefined" && localStorage.getItem("userId")) || "";

  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);
  const [formData, setFormData] = useState<FormDataShape>({});
  const [isUploading, setIsUploading] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [gender, setGender] = useState<GenderType>("Boy");

  // intro modal
  const [showIntro, setShowIntro] = useState(true);

  // Auto-scroll anchor + handler
  const resultRef = useRef<HTMLDivElement | null>(null);
  const handleResultLoad = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  /** ---------- 1) Upload (multipart/form-data) ---------- */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setGeneratedImageUrl("");
    setImageErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setImageErrorMessage("Please upload an image (JPG/JPEG/PNG).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setImageErrorMessage("Max file size is 20MB.");
      return;
    }
    if (!autoUserId) {
      setImageErrorMessage("Please sign in again.");
      return;
    }

    try {
      setIsUploading(true);

      const fd = new FormData();
      fd.append("multiPart", file, file.name);

      const endpoint = `${UPLOAD_IMAGE_ENDPOINT}?fileType=image`;
      const authHeader = getAuthHeaderFromStorage();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
        body: fd,
      });

      if (!res.ok) {
        const body = await parseAny(res);
        console.error("Upload error body:", body);
        throw new Error("upload-failed");
      }

      const payload = await parseAny(res);
      const storageUrl = pickUploadUrl(payload);

      if (!storageUrl) {
        console.warn("Upload succeeded but URL not found. Response:", payload);
        throw new Error("no-url");
      }

      const uploadedObj: UploadedImage = { imageUrl: storageUrl, status: true };
      setUploaded(uploadedObj);
      setFormData({ imageUrl: storageUrl });
      setImageErrorMessage("");
    } catch {
      setImageErrorMessage("Upload failed. Please try again.");
      setUploaded(null);
      setFormData({});
    } finally {
      setIsUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  /** ---------- 2) Generate (scroll handled on image onLoad) ---------- */
  const handleGenerate = async () => {
    if (!formData.imageUrl) {
      setImageErrorMessage("Please upload an image first.");
      return;
    }

    setLoading(true);
    setGeneratedImageUrl("");
    setImageErrorMessage("");

    try {
      const authHeader = getAuthHeaderFromStorage();
      if (!authHeader) {
        setLoading(false);
        setImageErrorMessage("You're logged out. Please sign in again.");
        return;
      }

      const prompt = pickPrompt(gender);

      const res = await fetch(EDIT_GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          imageUrl: formData.imageUrl,
          prompt,
          userId: autoUserId || "",
        }),
      });

      if (!res.ok) {
        const body = await parseAny(res);
        console.error("Gemini edit error:", { status: res.status, body });
        if (res.status === 401 || res.status === 403) {
          setImageErrorMessage("You're logged out. Please sign in again.");
          return;
        }
        setImageErrorMessage("Could not generate the image. Please try again.");
        return;
      }

      const data: EditGeminiImageResponse | string = await parseAny(res);

      if (typeof data === "string") {
        setGeneratedImageUrl(data);
        return;
      }

      const urlCandidate =
        (data as any).imageUrl || (data as any).url || (data as any).dataUrl;
      if (urlCandidate) {
        setGeneratedImageUrl(urlCandidate);
        return;
      }

      const b64 =
        ((data as any).base64 &&
          looksLikeBase64((data as any).base64) &&
          (data as any).base64.replace(/\s/g, "")) ||
        extractDeepBase64(data);

      if (b64) {
        setGeneratedImageUrl(`data:image/png;base64,${b64}`);
        return;
      }

      const inline = (data as any).candidates?.[0]?.content?.parts?.find(
        (p: any) => p.inlineData
      )?.inlineData;
      if (inline?.data && looksLikeBase64(inline.data)) {
        setGeneratedImageUrl(
          `data:${inline.mimeType || "image/png"};base64,${inline.data}`
        );
        return;
      }

      setImageErrorMessage("Could not generate the image. Please try again.");
    } catch (e) {
      console.error("Generate exception:", e);
      setImageErrorMessage("Could not generate the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = generatedImageUrl;
    const isData = generatedImageUrl.startsWith("data:");
    a.download = `generated_${Date.now()}.${isData ? "png" : "jpg"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearAll = () => {
    setUploaded(null);
    setFormData({});
    setGeneratedImageUrl("");
    setImageErrorMessage("");
  };

  /** ---------- UI ---------- */
  return (
    <div className="relative min-h-screen px-4 py-4 md:py-6 overflow-hidden">
      {/* BACK BUTTON (top-left) */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Back"
        title="Back"
        className="fixed left-3 top-3 z-50 inline-flex items-center justify-center
             w-10 h-10 rounded-full bg-black/55 text-white
             border border-white/10 backdrop-blur
             hover:bg-black/70 active:scale-95 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Katana-cut intro modal */}
      {showIntro && <CinematicOpening onDone={() => setShowIntro(false)} />}

      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("https://i.ibb.co/PGfT4xFh/bgimage.png")`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          backgroundColor: "#000",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900/80 to-neutral-900/80"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1100px]">
        {/* Header */}
        <header className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            The Fan of <span className="text-red-500 drop-shadow">OG</span>
          </h1>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-white/80">
            Create your OG image now
          </p>
        </header>

        <main className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 shadow-xl">
          <section className="p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 items-end">
              {/* Gender */}
              <div className="flex flex-col">
                <label className="text-white mb-1 text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Are you an OG Fan Boy or Fan Girl?
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setGender("Boy")}
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-xs md:text-sm transition ${
                      gender === "Boy"
                        ? "bg-white text-black"
                        : "bg-transparent text-white border-white/30 hover:border-white/60"
                    }`}
                  >
                    Fan Boy Image
                  </button>
                  <button
                    onClick={() => setGender("Girl")}
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-xs md:text-sm transition ${
                      gender === "Girl"
                        ? "bg-white text-black"
                        : "bg-transparent text-white border-white/30 hover:border-white/60"
                    }`}
                  >
                    Fan Girl Image
                  </button>
                </div>
              </div>

              {/* Generate */}
              <div className="flex">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !formData.imageUrl}
                  className="w-full inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-sm font-semibold text-white
                             bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-md"
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" /> Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Uploader */}
            <div className="mt-4 md:mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white text-sm font-semibold">
                  Upload image
                </label>
                {(uploaded || formData.imageUrl) && (
                  <button
                    onClick={clearAll}
                    className="text-red-300 hover:text-red-200 text-xs underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-white/15 bg-black/40 p-3 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center gap-1 md:gap-2 ${
                    isUploading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white/70 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-white/70" />
                  )}
                  <span className="text-white/90 font-medium text-xs md:text-sm">
                    {isUploading
                      ? "Uploading…"
                      : "Tap to upload JPG / JPEG / PNG"}
                  </span>
                  <span className="text-white/60 text-xs">Max size 20MB</span>
                </label>

                {imageErrorMessage && (
                  <p
                    className="mt-2 text-red-300 text-xs"
                    role="alert"
                    aria-live="polite"
                  >
                    {imageErrorMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Images container */}
            {(uploaded?.imageUrl || generatedImageUrl) && (
              <div className="mt-4 md:mt-5">
                <div
                  className={`flex ${
                    generatedImageUrl ? "justify-between" : "justify-center"
                  } items-start gap-3 flex-col md:flex-row`}
                >
                  {uploaded?.imageUrl && (
                    <div className="bg-black/40 rounded-2xl border border-white/10 p-3">
                      {/* Header row */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-sm md:text-base flex-1">
                          Reference
                        </h3>
                        <button
                          onClick={clearAll}
                          className="shrink-0 inline-flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white w-10 h-10 md:w-8 md:h-8 shadow-md"
                          aria-label="Remove image"
                          title="Remove"
                        >
                          <X className="w-4 h-4 md:w-3 md:h-3" />
                        </button>
                      </div>

                      {/* Image */}
                      <div className="relative">
                        <img
                          src={uploaded.imageUrl}
                          alt="Reference"
                          className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Result anchor (scroll target) */}
                  <div ref={resultRef} />

                  {generatedImageUrl && (
                    <div
                      ref={resultRef}
                      className="bg-black/40 rounded-2xl border border-white/10 p-3"
                    >
                      {/* Header row */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-sm md:text-base flex-1">
                          Generated Image
                        </h3>
                        <button
                          onClick={handleDownload}
                          className="shrink-0 inline-flex items-center justify-center rounded-full w-10 h-10 md:w-8 md:h-8 bg-green-600 hover:bg-green-700 text-white shadow"
                          aria-label="Download image"
                          title="Download"
                        >
                          <Download className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                      </div>

                      {/* Image */}
                      <a
                        href={generatedImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={generatedImageUrl}
                          alt="AI Generated result"
                          className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                          onLoad={handleResultLoad}
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default BananaImageGenerate;
