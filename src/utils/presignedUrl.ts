import React, { useState, useEffect } from "react";
import BASE_URL from "../Config";

const CACHE = new Map<string, { url: string; expiresAt: number }>();

export async function getPresignedUrl(fileUrl: string | null | undefined): Promise<string | null> {
  if (!fileUrl) return null;
  const cached = CACHE.get(fileUrl);
  if (cached && Date.now() < cached.expiresAt) return cached.url;
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
  try {
    const response = await fetch(
      `${BASE_URL}/user-service/presigned-url?fileUrl=${encodeURIComponent(fileUrl)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) return fileUrl;
    const data = await response.json();
    const presigned: string = data.url || data.presignedUrl || data.signedUrl;
    if (!presigned) return fileUrl;
    CACHE.set(fileUrl, { url: presigned, expiresAt: Date.now() + 10 * 60 * 1000 });
    return presigned;
  } catch {
    return fileUrl;
  }
}

export function usePresignedUrl(fileUrl: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!fileUrl) { setUrl(null); return; }
    let cancelled = false;
    getPresignedUrl(fileUrl).then(u => { if (!cancelled) setUrl(u ?? null); });
    return () => { cancelled = true; };
  }, [fileUrl]);
  return url;
}

export function PresignedImage({ src, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string }) {
  const resolved = usePresignedUrl(src ?? null);
  if (!resolved) return null;
  return React.createElement("img", { src: resolved, ...props });
}
