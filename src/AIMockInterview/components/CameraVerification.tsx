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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: { ideal: "user" },
        },
        audio: false,
      });
      if (!isMountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (!isMountedRef.current) return;
          videoRef.current?.play().catch(() => undefined);
          setStatus("granted");
          setMessage("Camera ready");
          setReady(true);
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      if (isMountedRef.current) { 
        setStatus("denied"); 
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMessage("Camera permission denied. Please allow camera access.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setMessage("No camera found. Please connect a camera.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setMessage("Camera is already in use by another application.");
        } else {
          setMessage("Camera access failed: " + (err.message || "Unknown error"));
        }
      }
    }
  }

  function captureImage() {
    if (capturedRef.current || !videoRef.current) return;
    if (!ready) return;
    
    capturedRef.current = true;
    setCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      capturedRef.current = false;
      setCapturing(false);
      setMessage("Unable to capture photo. Please try again.");
      return;
    }
    ctx.drawImage(video, 0, 0);

    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    onCapture(canvas.toDataURL("image/jpeg", 0.85));
  }

  if (status === "denied") {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 14px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-2xl)", overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
          <div style={{ padding: "24px 24px 18px", textAlign: "center", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--brand-tint)", border: "1px solid var(--brand-ring)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 24 }}>📷</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--t1)", marginBottom: 6 }}>Camera access needed</h2>
            <p style={{ fontSize: 14, color: "var(--t3)", lineHeight: 1.6 }}>{message}</p>
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ fontSize: 13, color: "var(--t2)", background: "var(--s1)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "var(--r-lg)", lineHeight: 1.7, marginBottom: 14 }}>
              Click the camera icon in your browser address bar, choose Allow, then retry. Close other apps if the camera is already in use.
            </div>
            <button className="btn btn-primary btn-primary-lg" style={{ width: "100%" }} onClick={() => { capturedRef.current = false; setStatus("prompt"); setReady(false); setMessage("Starting camera…"); startCamera(); }}>
              Retry Camera Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 14px" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-2xl)", overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>Camera Verification</h2>
            <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.5 }}>Take a clear photo before starting the assessment.</p>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 11px", borderRadius: "var(--r-full)", background: ready ? "var(--success-tint)" : "var(--s1)", border: "1px solid var(--border)", color: ready ? "var(--success)" : "var(--t3)", fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ready ? "var(--success)" : "var(--t4)" }} />
            {ready ? "Ready" : "Connecting"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, padding: 24 }}>
          <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "var(--r-xl)", overflow: "hidden", background: "#050505", border: "1px solid var(--border)" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 14, border: "1.5px dashed rgba(255,255,255,.65)", borderRadius: "var(--r-lg)", pointerEvents: "none" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}>
            <div style={{ padding: "13px 14px", borderRadius: "var(--r-lg)", background: ready ? "var(--success-tint)" : "var(--brand-tint)", border: ready ? "1px solid rgba(5,150,105,.18)" : "1px solid var(--brand-ring)", color: ready ? "var(--success)" : "var(--brand)", fontSize: 13, fontWeight: 600 }}>
              {message}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--t3)", lineHeight: 1.7 }}>
              Keep your face visible and use normal lighting. Capture is allowed once the camera preview is loaded.
            </div>
            <button
              className="btn btn-primary btn-primary-lg"
              style={{ width: "100%" }}
              onClick={captureImage}
              disabled={!ready || capturing}
            >
              {capturing ? "Capturing…" : "Capture Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
