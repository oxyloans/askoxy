"use client";

import React, { useEffect, useRef, useState } from "react";

interface CameraVerificationProps {
  onCapture: (imageData: string) => void;
}

export function CameraVerification({ onCapture }: CameraVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedRef = useRef(false);
  const isMountedRef = useRef(true);

  const [status, setStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [message, setMessage] = useState("Starting camera…");
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    startCamera();
    return () => {
      isMountedRef.current = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: true,
      });
      if (!isMountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("granted");
      setMessage("Camera ready — click Capture");
      setReady(true);
    } catch {
      if (isMountedRef.current) { setStatus("denied"); setMessage("Camera access denied"); }
    }
  }

  function captureImage() {
    if (capturedRef.current || !videoRef.current) return;
    capturedRef.current = true;
    setCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Stop stream after capture
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    onCapture(canvas.toDataURL("image/jpeg", 0.85));
  }

  if (status === "denied") {
    return (
      <div style={{ maxWidth: 300, margin: "0 auto", padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 12 }}>
          Camera access required. Allow camera in your browser and retry.
        </p>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => { capturedRef.current = false; setStatus("prompt"); startCamera(); }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 320, margin: "0 auto", padding: "0 12px" }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>Camera Verification</p>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Small video preview */}
        <div style={{ position: "relative", width: 100, height: 120, borderRadius: 8, overflow: "hidden", background: "#000", flexShrink: 0 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
          />
          {/* Face guide oval */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "65%", height: "70%",
            border: `1.5px dashed ${ready ? "rgba(15,123,58,0.7)" : "rgba(255,255,255,0.4)"}`,
            borderRadius: "50%", pointerEvents: "none",
          }} />
          {/* Live dot */}
          {ready && (
            <div style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          )}
        </div>

        {/* Status + button */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{
            padding: "6px 9px", borderRadius: 7, fontSize: 11.5,
            background: ready ? "var(--success-bg)" : "var(--surface-1)",
            border: ready ? "1px solid var(--success-border)" : "1px solid var(--border-1)",
            color: ready ? "var(--success)" : "var(--text-3)",
          }}>
            {message}
          </div>

          <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.4 }}>
            🎤 {status === "granted" ? "Mic ready" : "Waiting…"} · face the camera
          </div>

          <button
            className="btn btn-primary"
            style={{ fontSize: 12, padding: "7px 10px" }}
            onClick={captureImage}
            disabled={!ready || capturing}
          >
            {capturing ? "Capturing…" : "📸 Capture"}
          </button>
        </div>
      </div>
    </div>
  );
}
