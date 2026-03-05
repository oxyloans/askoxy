import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  titleSize: number;
  subtitleSize: number;
  bodySize: number;
  borderRadius: number;
  logoSize: number;
  clubNameSize: number;
}

interface FormData {
  clubNumber: string;
  clubName: string;
  customClubNumber: string;
  date: string;
  time: string;
  place: string;
  title: string;
  subtitle: string;
  speakerName: string;
  speakerDesignation: string;
  contactName: string;
  contactPhone: string;
  uploadedImageCaptions: string[];
}

interface PosterData extends FormData {
  dateFormatted: string;
  timeFormatted: string;
  districtLabel?: string;
}

interface TemplateProps {
  d: PosterData;
  theme: ThemeConfig;
  uploadedImages: { url: string; caption: string }[];
  dgImage?: string;
  dgName?: string;
  showDgImage?: boolean;
}

type ThemesMap = Record<number, ThemeConfig>;

interface DistrictInfo {
  name: string;
  governorName: string;
  governorImage: string;
}

const KNOWN_DISTRICTS: Record<string, DistrictInfo> = {
  "3000": {
    name: "District 3190",
    governorName: "Rtn. J. Karthik",
    governorImage:
      "https://rotaryindia.org/Documents/AGDG/GOVERNOR210820251034040398296AM.png",
  },
  "3141": {
    name: "District 3190",
    governorName: "Rtn. Manish Ramesh",
    governorImage:
      "https://rotaryindia.org/Documents/directory/1_Dr_Manish_Motwani05042024082639PM.jpg",
  },
  "3150": {
    name: "District 3150",
    governorName: "Rtn. Ram Prasad",
    governorImage:
      "https://th.bing.com/th/id/OIP._4XjmLufsYcPJbepEPm0VQHaHa?w=179&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
  },
  "3160": {
    name: "District 3160",
    governorName: "Rtn. M.K. Ravindra",
    governorImage:
      "https://rotaryindia.org/Documents/directory/20250217_195814_cd8b01c4-e897-4e95-995d-864bc3c15cde01082025065247PM.JPG",
  },
  "3170": {
    name: "District 3170",
    governorName: "Rtn. Arun Daniel",
    governorImage:
      "https://rotaryindia.org/Documents/directory/F5C83540-FE0C-4F37-B7C0-210228483FC324052024010524AM.jpeg",
  },
  "3080": {
    name: "District 3080",
    governorName: "Rtn. Ravi Prakash",
    governorImage:
      "https://rotaryindia.org/Documents/directory/8E602A8F-440F-45F3-A76B-D05C0CFDA78115032024071112AM.jpeg",
  },
};

const useScript = (src: string): boolean => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
      setLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, [src]);
  return loaded;
};

const CLUBS = [{ clubNumber: "3150", clubName: "Rotary Club Telangana" }];
const ROTARY_LOGO =
  "https://tse4.mm.bing.net/th/id/OIP.bQ1Msi7bnrhxmvIpbCKENAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3";
const THEME = "Create Hope in the World";

function activeDgDistrict(d: PosterData): string {
  return (d as any).districtLabel || "District 3150";
}

const fmtDate = (d: string): string => {
  if (!d) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
};
const fmtTime = (t: string): string => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};
const onImgErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.target as HTMLImageElement).style.visibility = "hidden";
};
const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.target as HTMLImageElement).style.visibility = "visible";
};

// ─── IMAGE ORIENTATION TRACKER ────────────────────────────────────────────────
type Orientation = "portrait" | "landscape" | "square";

function useImageOrientations(
  images: { url: string }[],
): Record<string, Orientation> {
  const [orientations, setOrientations] = useState<Record<string, Orientation>>(
    {},
  );
  useEffect(() => {
    images.forEach(({ url }) => {
      if (!url) return;
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        const orient: Orientation =
          ratio > 1.15 ? "landscape" : ratio < 0.85 ? "portrait" : "square";
        setOrientations((prev) =>
          prev[url] === orient ? prev : { ...prev, [url]: orient },
        );
      };
      img.src = url;
    });
  }, [images]);
  return orientations;
}

// Derive a dominant orientation from a map — if ANY image is landscape, treat all as landscape
function dominantOrientation(
  urls: string[],
  map: Record<string, Orientation>,
): Orientation {
  const vals = urls.map((u) => map[u]).filter(Boolean);
  if (vals.length === 0) return "portrait";
  if (vals.includes("landscape")) return "landscape";
  if (vals.every((v) => v === "square")) return "square";
  return "portrait";
}

// ─── IMAGE SIZE CALCULATOR (FIXED) ───────────────────────────────────────────
// Now uses actual available width so 1-2 images fill the template width properly
function getImgSize(
  total: number,
  containerW: number,
  orientation: Orientation = "portrait",
): { w: number; h: number } {
  if (total === 0) return { w: 0, h: 0 };

  const padding = 32; // total horizontal padding inside the image row container
  const gap = total > 5 ? 6 : total > 3 ? 8 : 10;
  const gapTotal = (total - 1) * gap;
  const availW = containerW - padding - gapTotal;

  let w: number;
  if (total === 1) {
    // Single image: portrait uses 70% width (tall & prominent), landscape uses 85%
    w =
      orientation === "landscape"
        ? Math.round(availW * 0.85)
        : Math.round(availW * 0.7);
  } else if (total === 2) {
    // Two images: each gets ~47% so they fill the row
    w = Math.round(availW * 0.47);
  } else if (total === 3) {
    w = Math.round(availW / 3);
  } else if (total === 4) {
    w = Math.round(availW / 4);
  } else if (total === 5) {
    w = Math.round(availW / 5);
  } else if (total === 6) {
    w = Math.round(availW / 6);
  } else {
    w = Math.round(availW / Math.min(total, 7));
  }

  // Minimum readable size
  w = Math.max(w, 60);

  const h =
    orientation === "landscape"
      ? Math.round(w * 0.68)
      : orientation === "square"
        ? Math.round(w * 1.0)
        : Math.round(w * 1.35);

  return { w: Math.round(w), h };
}

// Caption truncation helper
function truncateCaption(caption: string, maxChars: number): string {
  if (!caption) return "";
  return caption.length > maxChars
    ? caption.slice(0, maxChars - 1) + "…"
    : caption;
}

const TEMPLATE_DEFAULTS: Record<number, ThemeConfig> = {
  1: {
    primary: "#c9a227",
    secondary: "#0a1628",
    accent: "#f5e07a",
    bg: "#0a1628",
    text: "#ffffff",
    titleSize: 34,
    subtitleSize: 13,
    bodySize: 12,
    borderRadius: 12,
    logoSize: 100,
    clubNameSize: 22,
  },
  2: {
    primary: "#2563b0",
    secondary: "#1a3a6b",
    accent: "#bfdbfe",
    bg: "#ffffff",
    text: "#0f172a",
    titleSize: 34,
    subtitleSize: 13,
    bodySize: 12,
    borderRadius: 12,
    logoSize: 100,
    clubNameSize: 20,
  },
  3: {
    primary: "#B91C1C",
    secondary: "#7F1D1D",
    accent: "#FECACA",
    bg: "#FFF5F5",
    text: "#0F172A",
    titleSize: 24,
    subtitleSize: 10,
    bodySize: 10,
    borderRadius: 10,
    logoSize: 82,
    clubNameSize: 18,
  },
  4: {
    primary: "#15803D",
    secondary: "#14532D",
    accent: "#BBF7D0",
    bg: "#F0FAF4",
    text: "#0F172A",
    titleSize: 24,
    subtitleSize: 10,
    bodySize: 10,
    borderRadius: 10,
    logoSize: 82,
    clubNameSize: 18,
  },
  5: {
    primary: "#EA580C",
    secondary: "#7C2D12",
    accent: "#FED7AA",
    bg: "#FFF7ED",
    text: "#0F172A",
    titleSize: 24,
    subtitleSize: 10,
    bodySize: 10,
    borderRadius: 12,
    logoSize: 82,
    clubNameSize: 18,
  },
  6: {
    primary: "#0891B2",
    secondary: "#0F172A",
    accent: "#CFFAFE",
    bg: "#ffffff",
    text: "#0F172A",
    titleSize: 26,
    subtitleSize: 10,
    bodySize: 10,
    borderRadius: 4,
    logoSize: 82,
    clubNameSize: 18,
  },
  7: {
    primary: "#ea580c",
    secondary: "#7c2d12",
    accent: "#fed7aa",
    bg: "#7c2d12",
    text: "#ffffff",
    titleSize: 32,
    subtitleSize: 12,
    bodySize: 11,
    borderRadius: 16,
    logoSize: 100,
    clubNameSize: 22,
  },
  8: {
    primary: "#14b8a6",
    secondary: "#0f766e",
    accent: "#ccfbf1",
    bg: "#f0fdfa",
    text: "#0f172a",
    titleSize: 30,
    subtitleSize: 12,
    bodySize: 11,
    borderRadius: 12,
    logoSize: 100,
    clubNameSize: 22,
  },
  9: {
    primary: "#9333EA",
    secondary: "#581C87",
    accent: "#E9D5FF",
    bg: "#FAF5FF",
    text: "#0F172A",
    titleSize: 26,
    subtitleSize: 11,
    bodySize: 11,
    borderRadius: 10,
    logoSize: 88,
    clubNameSize: 22,
  },
  10: {
    primary: "#DC2626",
    secondary: "#991B1B",
    accent: "#FEE2E2",
    bg: "#FFFBEB",
    text: "#0F172A",
    titleSize: 28,
    subtitleSize: 11,
    bodySize: 11,
    borderRadius: 12,
    logoSize: 88,
    clubNameSize: 22,
  },
};

// ─── DG IMAGE PROMPT MODAL ────────────────────────────────────────────────────
interface DgPromptProps {
  districtName: string;
  onYes: () => void;
  onNo: () => void;
}
const DgImagePrompt = ({ districtName, onYes, onNo }: DgPromptProps) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "32px 36px",
        maxWidth: 400,
        width: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        District Governor Image
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#475569",
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Would you like to include the <strong>{districtName}</strong> District
        Governor's photo on the poster?
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={onNo}
          style={{
            padding: "10px 28px",
            borderRadius: 10,
            border: "2px solid #cbd5e1",
            background: "white",
            color: "#475569",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          No, Skip
        </button>
        <button
          onClick={onYes}
          style={{
            padding: "10px 28px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
          }}
        >
          Yes, Include
        </button>
      </div>
    </div>
  </div>
);

// ─── SHARED PERSON CARD (Rectangular) ────────────────────────────────────────
const PersonCard = ({
  url,
  caption,
  subLabel,
  w,
  h,
  borderRadius,
  primary,
  secondary,
  accent,
  orientation = "portrait",
}: {
  url: string;
  caption: string;
  subLabel?: string;
  w: number;
  h: number;
  borderRadius: number;
  primary: string;
  secondary: string;
  accent: string;
  orientation?: Orientation;
}) => {
  const capText = truncateCaption(caption, 28);
  // Scale font size with card width for proper readability
  const fontSize = w < 80 ? 9 : w < 120 ? 10 : w < 180 ? 11 : 12;
  const objectPosition =
    orientation === "landscape" ? "center center" : "top center";
  return (
    <div style={{ flexShrink: 0, textAlign: "center", width: w }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
          overflow: "hidden",
          border: `3px solid ${primary}`,
          boxShadow: `0 6px 20px rgba(0,0,0,0.35)`,
          margin: "0 auto",
        }}
      >
        <img
          src={url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
          alt=""
          onError={onImgErr}
          onLoad={onImgLoad}
          crossOrigin="anonymous"
        />
      </div>
      <div
        style={{
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
          padding: "5px 6px 6px",
          textAlign: "center",
          borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
          minHeight: 28,
          width: w,
          margin: "0 auto",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 800,
            color: "white",
            fontFamily: "sans-serif",
            lineHeight: 1.25,
            wordBreak: "break-word",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {capText || "\u00A0"}
        </div>
        {subLabel && (
          <div
            style={{
              fontSize: 7.5,
              color: accent,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginTop: 2,
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CIRCULAR PERSON CARD ─────────────────────────────────────────────────────
const CircularPersonCard = ({
  url,
  caption,
  subLabel,
  size,
  primary,
  accent,
  secondary,
  orientation = "portrait",
}: {
  url: string;
  caption: string;
  subLabel?: string;
  size: number;
  primary: string;
  accent: string;
  secondary: string;
  orientation?: Orientation;
}) => {
  const capText = truncateCaption(caption, 24);
  const fontSize = size < 80 ? 9 : size < 110 ? 10 : size < 150 ? 11 : 12;
  const objectPosition =
    orientation === "landscape" ? "center center" : "top center";
  return (
    <div style={{ textAlign: "center", flexShrink: 0, maxWidth: size + 16 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${primary}`,
          boxShadow: `0 5px 18px rgba(0,0,0,0.35)`,
          margin: "0 auto",
        }}
      >
        <img
          src={url}
          alt=""
          onError={onImgErr}
          onLoad={onImgLoad}
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
        />
      </div>
      <div
        style={{
          background: `linear-gradient(135deg, ${primary}ee, ${secondary}cc)`,
          borderRadius: 20,
          padding: "4px 8px",
          marginTop: 5,
          display: "inline-block",
          maxWidth: size + 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize,
            fontWeight: 800,
            fontFamily: "sans-serif",
            lineHeight: 1.25,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {capText || "\u00A0"}
        </div>
        {subLabel && (
          <div
            style={{
              color: accent,
              fontSize: 7.5,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 700,
              marginTop: 1,
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CLUB NAME BLOCK ──────────────────────────────────────────────────────────
const ClubNameBlock = ({
  clubName,
  clubNumber,
  districtLabel,
  primary,
  accent,
  secondary,
  text,
  bg,
  variant = "default",
}: {
  clubName: string;
  clubNumber?: string;
  districtLabel?: string;
  primary: string;
  accent: string;
  secondary: string;
  text: string;
  bg: string;
  variant?: "default" | "dark" | "gradient" | "outlined";
}) => {
  const nameSize =
    clubName && clubName.length > 30
      ? 18
      : clubName && clubName.length > 20
        ? 22
        : 26;
  if (variant === "dark") {
    return (
      <div style={{ textAlign: "center", padding: "12px 20px" }}>
        <div
          style={{
            color: primary,
            fontSize: 10,
            letterSpacing: 5,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Presented By
        </div>
        <div
          style={{
            color: "white",
            fontSize: nameSize + 2,
            fontWeight: 900,
            letterSpacing: 0.5,
            fontFamily: "Georgia, serif",
            lineHeight: 1.15,
            textShadow: `0 2px 10px ${primary}88`,
          }}
        >
          {clubName || <span style={{ opacity: 0.3 }}>Club Name</span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          {districtLabel && (
            <span
              style={{
                background: `${primary}33`,
                border: `1px solid ${primary}88`,
                color: primary,
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              {districtLabel}
            </span>
          )}
          {clubNumber && (
            <span
              style={{
                background: `${primary}22`,
                border: `1px solid ${primary}66`,
                color: accent,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              Club #{clubNumber}
            </span>
          )}
        </div>
      </div>
    );
  }
  if (variant === "gradient") {
    return (
      <div
        style={{
          padding: "12px 20px",
          background: `linear-gradient(135deg, ${primary}18, ${accent}44)`,
          borderTop: `3px solid ${primary}`,
        }}
      >
        <div
          style={{
            color: primary,
            fontSize: 9,
            letterSpacing: 5,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 700,
            marginBottom: 3,
          }}
        >
          Organized By
        </div>
        <div
          style={{
            color: text,
            fontSize: nameSize + 2,
            fontWeight: 900,
            letterSpacing: 0.3,
            lineHeight: 1.15,
          }}
        >
          {clubName || <span style={{ opacity: 0.3 }}>Club Name</span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 5,
            flexWrap: "wrap",
          }}
        >
          {districtLabel && (
            <span
              style={{
                background: primary,
                color: "white",
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              {districtLabel}
            </span>
          )}
          {clubNumber && (
            <span
              style={{
                background: `${primary}18`,
                border: `1px solid ${primary}`,
                color: primary,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              Club #{clubNumber}
            </span>
          )}
        </div>
      </div>
    );
  }
  if (variant === "outlined") {
    return (
      <div
        style={{
          padding: "10px 18px",
          border: `2px solid ${primary}`,
          borderRadius: 12,
          background: `${primary}08`,
          display: "inline-block",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: primary,
            fontSize: 9,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          Club
        </div>
        <div
          style={{
            color: text,
            fontSize: nameSize,
            fontWeight: 900,
            letterSpacing: 0.5,
            lineHeight: 1.15,
          }}
        >
          {clubName || <span style={{ opacity: 0.3 }}>Club Name</span>}
        </div>
        {(districtLabel || clubNumber) && (
          <div
            style={{
              color: primary,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "sans-serif",
              marginTop: 3,
            }}
          >
            {districtLabel}
            {clubNumber ? ` · #${clubNumber}` : ""}
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <div
        style={{
          color: primary,
          fontSize: 9,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontFamily: "sans-serif",
          fontWeight: 700,
          marginBottom: 3,
        }}
      >
        Organized By
      </div>
      <div
        style={{
          color: text,
          fontSize: nameSize,
          fontWeight: 900,
          letterSpacing: 0.3,
          lineHeight: 1.15,
        }}
      >
        {clubName || <span style={{ opacity: 0.3 }}>Club Name</span>}
      </div>
      {(districtLabel || clubNumber) && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {districtLabel && (
            <span
              style={{
                background: primary,
                color: "white",
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              {districtLabel}
            </span>
          )}
          {clubNumber && (
            <span
              style={{
                background: `${primary}18`,
                border: `1px solid ${primary}`,
                color: primary,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              Club #{clubNumber}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TEMPLATE 1 ───────────────────────────────────────────────────────────────
// Width: 600px — image container padding ~40px total → availW for sizing = 560
function Template1({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 30 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "Dist. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // T1 is 600px wide; image row has ~20px padding each side = 40px total
  const { w: imgW, h: imgH } = getImgSize(total, 560, orient);

  return (
    <div
      style={{
        width: 600,
        background: t.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${t.primary}22 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          height: 7,
          background: `linear-gradient(90deg,${t.primary},${t.accent},${t.primary})`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px 0",
        }}
      >
        <img
          src={ROTARY_LOGO}
          style={{
            height: t.logoSize,
            background: "white",
            padding: 6,
            borderRadius: t.borderRadius,
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
          }}
          alt="Rotary"
          crossOrigin="anonymous"
          onError={onImgErr}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: t.primary,
              fontSize: 11,
              letterSpacing: 5,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: t.text,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            {activeDgDistrict(d)}
          </div>
          <div
            style={{
              color: `${t.text}99`,
              fontSize: 11,
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            Theme: {THEME}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {d.clubNumber && (
            <div
              style={{
                background: `${t.primary}33`,
                border: `1px solid ${t.primary}`,
                color: t.primary,
                fontSize: 16,
                fontFamily: "sans-serif",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              Club #{d.clubNumber}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg,transparent,${t.primary},transparent)`,
          margin: "10px 28px",
        }}
      />
      {total > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: total > 5 ? 6 : 10,
            padding: "0 20px",
            marginBottom: 10,
            flexWrap: total > 5 ? "wrap" : "nowrap",
          }}
        >
          {allImages.map((img, i) => (
            <PersonCard
              key={i}
              url={img.url}
              caption={img.caption}
              subLabel={img.subLabel}
              w={imgW}
              h={imgH}
              borderRadius={t.borderRadius}
              primary={t.primary}
              secondary={t.secondary}
              accent={t.accent}
              orientation={orientMap[img.url] ?? orient}
            />
          ))}
        </div>
      )}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg,transparent,${t.primary}bb,transparent)`,
          margin: "0 28px 10px",
        }}
      />
      <div style={{ padding: "0 28px", textAlign: "center" }}>
        <div
          style={{
            color: t.primary,
            fontSize: 11,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: 8,
          }}
        >
          Official Felicitation Program
        </div>
        <div
          style={{
            color: t.text,
            fontSize: titleSize,
            fontWeight: "bold",
            lineHeight: 1.2,
            marginBottom: 8,
            textShadow: `0 3px 15px ${t.primary}66`,
          }}
        >
          {d.title || <span style={{ opacity: 0.3 }}>Event Title Here</span>}
        </div>
        {d.subtitle && (
          <div
            style={{
              color: `${t.text}dd`,
              fontSize: t.subtitleSize,
              lineHeight: 1.6,
              marginBottom: 10,
              fontFamily: "sans-serif",
              maxWidth: 460,
              margin: "0 auto 10px",
              fontStyle: "italic",
              background: `${t.primary}11`,
              padding: "6px 14px",
              borderRadius: 8,
              borderLeft: `3px solid ${t.primary}`,
            }}
          >
            {d.subtitle}
          </div>
        )}
        {d.speakerName && (
          <div
            style={{
              background: `${t.primary}1f`,
              border: `1px solid ${t.primary}88`,
              borderRadius: t.borderRadius,
              padding: "10px 24px",
              display: "inline-block",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                color: t.primary,
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              Chief Guest
            </div>
            <div style={{ color: t.text, fontSize: 18, fontWeight: "bold" }}>
              {d.speakerName}
            </div>
            {d.speakerDesignation && (
              <div
                style={{
                  color: `${t.text}99`,
                  fontSize: 12,
                  fontFamily: "sans-serif",
                }}
              >
                {d.speakerDesignation}
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          {d.dateFormatted && (
            <span
              style={{
                background: `${t.primary}2a`,
                border: `1px solid ${t.primary}`,
                borderRadius: 40,
                padding: "8px 16px",
                color: t.text,
                fontSize: t.bodySize,
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              📅 {d.dateFormatted}
            </span>
          )}
          {d.timeFormatted && (
            <span
              style={{
                background: `${t.primary}2a`,
                border: `1px solid ${t.primary}`,
                borderRadius: 40,
                padding: "8px 16px",
                color: t.text,
                fontSize: t.bodySize,
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              🕐 {d.timeFormatted}
            </span>
          )}
          {d.place && (
            <span
              style={{
                background: `${t.primary}2a`,
                border: `1px solid ${t.primary}`,
                borderRadius: 40,
                padding: "8px 16px",
                color: t.text,
                fontSize: t.bodySize,
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              📍 {d.place}
            </span>
          )}
        </div>
        {(d.contactName || d.contactPhone) && (
          <div
            style={{
              marginTop: 8,
              color: `${t.text}88`,
              fontSize: t.bodySize,
              fontFamily: "sans-serif",
            }}
          >
            {d.contactName}
            {d.contactName && d.contactPhone && " • "}
            {d.contactPhone}
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 14,
          background: `linear-gradient(0deg,${t.primary}55,${t.primary}22)`,
          borderTop: `2px solid ${t.primary}66`,
        }}
      >
        <ClubNameBlock
          clubName={d.clubName}
          clubNumber={d.clubNumber}
          districtLabel={activeDgDistrict(d)}
          primary={t.primary}
          accent={t.accent}
          secondary={t.secondary}
          text={t.text}
          bg={t.bg}
          variant="dark"
        />
      </div>
      <div
        style={{
          height: 7,
          background: `linear-gradient(90deg,${t.primary},${t.accent},${t.primary})`,
        }}
      />
    </div>
  );
}

// ─── TEMPLATE 2 ───────────────────────────────────────────────────────────────
// Width: 600px — right pane is ~390px, image area ~340px usable
function Template2({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 28 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "Dist. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // Right pane is ~390px; rows of max 3; available width for images ~340px
  const { w: imgW, h: imgH } = getImgSize(Math.min(total, 3), 340, orient);
  const rows: (typeof allImages)[] = [];
  for (let i = 0; i < allImages.length; i += 3)
    rows.push(allImages.slice(i, i + 3));

  return (
    <div
      style={{
        width: 600,
        background: "white",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Trebuchet MS, sans-serif",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 215,
          height: "100%",
          background: `linear-gradient(160deg, ${t.secondary} 0%, ${t.primary} 60%, ${t.primary}cc 100%)`,
          minHeight: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 185,
          top: 0,
          width: 60,
          height: "100%",
          background: "white",
          transform: "skewX(-7deg)",
          transformOrigin: "top right",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 200,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 14px 20px",
          boxSizing: "border-box",
        }}
      >
        <img
          src={ROTARY_LOGO}
          alt="Rotary"
          crossOrigin="anonymous"
          onError={onImgErr}
          style={{
            height: t.logoSize - 20,
            background: "white",
            padding: 7,
            borderRadius: t.borderRadius,
            marginBottom: 14,
            boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
          }}
        />
        <div
          style={{
            color: "white",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 3,
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 4,
            fontFamily: "sans-serif",
          }}
        >
          Rotary
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 12,
            fontFamily: "sans-serif",
          }}
        >
          International
        </div>
        <div
          style={{
            width: "80%",
            height: 1,
            background: "rgba(255,255,255,0.3)",
            marginBottom: 12,
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            padding: "4px 12px",
            borderRadius: 20,
            fontFamily: "sans-serif",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {activeDgDistrict(d)}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.25)",
            marginBottom: 10,
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 8,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 4,
              fontFamily: "sans-serif",
            }}
          >
            Presented By
          </div>
          <div
            style={{
              color: "white",
              fontSize: t.clubNameSize + 2,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {d.clubName || <span style={{ opacity: 0.4 }}>Club Name</span>}
          </div>
          {d.clubNumber && (
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "rgba(48,43,43,0.9)",
                fontSize: 17,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                fontFamily: "sans-serif",
                marginTop: 5,
                display: "inline-block",
              }}
            >
              Club #{d.clubNumber}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 2,
          padding: "22px 22px 20px 46px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              color: t.primary,
              fontSize: 10,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Rotary International · Official Program
          </div>
          <div
            style={{
              width: 50,
              height: 3,
              background: t.primary,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              color: t.secondary,
              fontSize: 15,
              fontWeight: 900,
              marginBottom: 2,
            }}
          >
            {activeDgDistrict(d)}
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 900,
              color: "#1e293b",
              lineHeight: 1.15,
              marginBottom: 8,
              maxWidth: 310,
            }}
          >
            {d.title || <span style={{ opacity: 0.3 }}>Event Title</span>}
          </div>
          {d.subtitle && (
            <div
              style={{
                fontSize: t.subtitleSize,
                color: "#334155",
                lineHeight: 1.5,
                marginBottom: 10,
                maxWidth: 320,
                fontStyle: "italic",
                background: `${t.primary}11`,
                padding: "7px 12px",
                borderRadius: 8,
                borderLeft: `3px solid ${t.primary}`,
              }}
            >
              {d.subtitle}
            </div>
          )}
        </div>
        {total > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            {rows.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  flexWrap: "nowrap",
                }}
              >
                {row.map((img, ii) => (
                  <PersonCard
                    key={ii}
                    url={img.url}
                    caption={img.caption}
                    subLabel={img.subLabel}
                    w={imgW}
                    h={imgH}
                    borderRadius={t.borderRadius}
                    primary={t.primary}
                    secondary={t.secondary}
                    accent={t.accent}
                    orientation={orientMap[img.url] ?? orient}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {d.speakerName && (
          <div
            style={{
              background: `${t.primary}12`,
              border: `1px solid ${t.primary}44`,
              borderRadius: t.borderRadius,
              padding: "8px 14px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: t.primary,
                fontWeight: 700,
              }}
            >
              Chief Guest
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
              {d.speakerName}
            </div>
            {d.speakerDesignation && (
              <div style={{ fontSize: 10, color: "#64748b" }}>
                {d.speakerDesignation}
              </div>
            )}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            {
              label: "Date",
              value: d.dateFormatted,
              icon: "📅",
              bg: t.secondary,
            },
            {
              label: "Time",
              value: d.timeFormatted,
              icon: "🕐",
              bg: t.primary,
            },
            { label: "Venue", value: d.place, icon: "📍", bg: t.secondary },
          ]
            .filter((item) => item.value)
            .map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: item.bg,
                  borderRadius: t.borderRadius,
                  padding: "9px 14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 8,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: t.bodySize,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {(d.contactName || d.contactPhone) && (
          <div style={{ color: "#64748b", fontSize: 10 }}>
            📞 {d.contactName}
            {d.contactPhone ? ` ${d.contactPhone}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TEMPLATE 3 ───────────────────────────────────────────────────────────────
// Width: 480px — uses circular cards
function Template3({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize =
    d.title && d.title.length > 24 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "Dist. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // Circular cards: 1 image big, 2 images prominent, scale down from there
  const circSize =
    total === 0
      ? 0
      : total === 1
        ? 160
        : total === 2
          ? 130
          : total === 3
            ? 100
            : total <= 4
              ? 85
              : total <= 6
                ? 70
                : 58;
  const headerH = total > 0 ? 54 + circSize + 50 : 54;

  return (
    <div
      style={{
        width: 480,
        background: t.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Gill Sans, Calibri, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerH,
          background: `linear-gradient(150deg, ${t.secondary} 0%, ${t.primary} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: headerH - 22,
          left: 0,
          right: 0,
          height: 44,
          background: t.bg,
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "12px 18px 0",
        }}
      >
        <img
          src={ROTARY_LOGO}
          alt="Rotary"
          onError={onImgErr}
          crossOrigin="anonymous"
          style={{
            height: t.logoSize - 34,
            background: "white",
            padding: 5,
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 900,
              marginTop: 2,
            }}
          >
            {activeDgDistrict(d)}
          </div>
        </div>
        {d.clubNumber ? (
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "white",
              fontSize: 17,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 16,
            }}
          >
            #{d.clubNumber}
          </div>
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>
      {allImages.length > 0 && (
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            gap: total > 5 ? 6 : 10,
            padding: "10px 16px 0",
            alignItems: "flex-end",
            flexWrap: total > 6 ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          {allImages.map((img, i) => (
            <CircularPersonCard
              key={i}
              url={img.url}
              caption={img.caption}
              subLabel={img.subLabel}
              size={circSize}
              primary={t.primary}
              accent={t.accent}
              secondary={t.secondary}
              orientation={orientMap[img.url] ?? orient}
            />
          ))}
        </div>
      )}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "16px 18px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div
            style={{
              display: "inline-block",
              background: t.primary,
              color: "white",
              fontSize: 9,
              letterSpacing: 3.5,
              textTransform: "uppercase",
              padding: "3px 12px",
              borderRadius: 20,
              marginBottom: 8,
            }}
          >
            Official Programme
          </div>
          <div
            style={{
              color: t.text,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.18,
            }}
          >
            {d.title || <span style={{ opacity: 0.2 }}>Event Title</span>}
          </div>
          {d.subtitle && (
            <div
              style={{
                color: "#475569",
                fontSize: t.subtitleSize,
                lineHeight: 1.55,
                marginTop: 6,
                fontStyle: "italic",
                background: `${t.primary}11`,
                padding: "5px 10px",
                borderRadius: 6,
                borderLeft: `2px solid ${t.primary}`,
              }}
            >
              {d.subtitle}
            </div>
          )}
        </div>
        {d.speakerName && (
          <div
            style={{
              border: `2px solid ${t.accent}`,
              background: `${t.primary}11`,
              borderRadius: t.borderRadius,
              padding: "7px 14px",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: t.primary,
                fontSize: 8,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Chief Guest
            </div>
            <div style={{ color: t.text, fontSize: 13, fontWeight: "bold" }}>
              {d.speakerName}
            </div>
            {d.speakerDesignation && (
              <div style={{ color: "#64748B", fontSize: 9.5 }}>
                {d.speakerDesignation}
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 7,
            marginTop: 4,
          }}
        >
          {(
            [
              d.dateFormatted ? ["📅", "Date", d.dateFormatted] : null,
              d.timeFormatted ? ["🕐", "Time", d.timeFormatted] : null,
              d.place ? ["📍", "Venue", d.place] : null,
              d.contactName || d.contactPhone
                ? [
                    "📞",
                    "Contact",
                    [d.contactName, d.contactPhone].filter(Boolean).join(" "),
                  ]
                : null,
            ] as ([string, string, string] | null)[]
          )
            .filter((item): item is [string, string, string] => item !== null)
            .map((item, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: `1px solid ${t.accent}`,
                  borderRadius: 7,
                  padding: "7px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: `${t.primary}11`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {item[0]}
                </div>
                <div>
                  <div
                    style={{
                      color: t.primary,
                      fontSize: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    {item[1]}
                  </div>
                  <div
                    style={{
                      color: t.text,
                      fontSize: t.bodySize,
                      fontWeight: 700,
                    }}
                  >
                    {item[2]}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div style={{ marginTop: 12, marginBottom: 6 }}>
          <ClubNameBlock
            clubName={d.clubName}
            clubNumber={d.clubNumber}
            districtLabel={activeDgDistrict(d)}
            primary={t.primary}
            accent={t.accent}
            secondary={t.secondary}
            text={t.text}
            bg={t.bg}
            variant="gradient"
          />
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 4 ───────────────────────────────────────────────────────────────
// Width: 480px — image box has ~12px margin each side + 12px internal padding = ~40px total
function Template4({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize =
    d.title && d.title.length > 24 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "D. Gov" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // T4 is 480px; image container has margin 12px each side + padding 12px each side = ~48px total
  const { w: imgW, h: imgH } = getImgSize(total, 432, orient);

  return (
    <div
      style={{
        width: 480,
        background: t.bg,
        overflow: "hidden",
        fontFamily: "Cambria, Book Antiqua, serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg, ${t.secondary}, ${t.primary}, ${t.secondary})`,
        }}
      />
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={ROTARY_LOGO}
          alt="Rotary"
          onError={onImgErr}
          crossOrigin="anonymous"
          style={{
            height: t.logoSize - 34,
            background: "white",
            padding: 5,
            borderRadius: 6,
            boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: t.primary,
              fontSize: 9,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: t.secondary,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            {activeDgDistrict(d)}
          </div>
        </div>
        {d.clubNumber ? (
          <div
            style={{
              background: t.primary,
              color: "white",
              fontSize: 14,
              fontWeight: 800,
              textAlign: "right",
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            Club #{d.clubNumber}
          </div>
        ) : (
          <div style={{ width: 46 }} />
        )}
      </div>
      {allImages.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: total > 5 ? 5 : 8,
            margin: "0 12px 10px",
            background: "white",
            borderRadius: 10,
            padding: "10px 12px",
            boxShadow: `0 4px 14px ${t.primary}1f`,
            border: `1px solid ${t.accent}`,
            flexWrap: total > 5 ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          {allImages.map((img, i) => (
            <PersonCard
              key={i}
              url={img.url}
              caption={img.caption}
              subLabel={img.subLabel}
              w={imgW}
              h={imgH}
              borderRadius={8}
              primary={t.primary}
              secondary={t.secondary}
              accent={t.accent}
              orientation={orientMap[img.url] ?? orient}
            />
          ))}
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span
          style={{
            background: t.accent,
            color: t.secondary,
            fontSize: 9,
            letterSpacing: 1.5,
            padding: "3px 12px",
            borderRadius: 20,
            fontFamily: "sans-serif",
            border: `1px solid ${t.primary}66`,
          }}
        >
          {THEME}
        </span>
      </div>
      <div
        style={{
          margin: "0 12px 10px",
          background: "white",
          borderRadius: 10,
          padding: "12px 16px",
          border: `1px solid ${t.accent}`,
          boxShadow: `0 4px 14px ${t.primary}14`,
        }}
      >
        <div
          style={{
            color: t.primary,
            fontSize: 9,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: 6,
          }}
        >
          Official Programme
        </div>
        <div
          style={{
            color: t.text,
            fontSize: titleSize,
            fontWeight: "bold",
            lineHeight: 1.2,
            marginBottom: 5,
          }}
        >
          {d.title || <span style={{ opacity: 0.2 }}>Event Title</span>}
        </div>
        {d.subtitle && (
          <div
            style={{
              color: "#374151",
              fontSize: t.subtitleSize,
              lineHeight: 1.55,
              marginBottom: 8,
              fontFamily: "sans-serif",
              fontStyle: "italic",
              background: t.bg,
              padding: "5px 10px",
              borderRadius: 6,
              border: `1px solid ${t.accent}`,
            }}
          >
            {d.subtitle}
          </div>
        )}
        {d.speakerName && (
          <div
            style={{
              borderLeft: `4px solid ${t.primary}`,
              paddingLeft: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                color: t.primary,
                fontSize: 8,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "sans-serif",
                fontWeight: 700,
              }}
            >
              Chief Guest
            </div>
            <div style={{ color: t.text, fontSize: 13, fontWeight: "bold" }}>
              {d.speakerName}
            </div>
            {d.speakerDesignation && (
              <div
                style={{
                  color: "#6B7280",
                  fontSize: 9.5,
                  fontFamily: "sans-serif",
                }}
              >
                {d.speakerDesignation}
              </div>
            )}
          </div>
        )}
        <div style={{ display: "flex", gap: 7 }}>
          {(
            [
              d.dateFormatted ? ["📅", d.dateFormatted] : null,
              d.timeFormatted ? ["🕐", d.timeFormatted] : null,
              d.place ? ["📍", d.place] : null,
            ] as ([string, string] | null)[]
          )
            .filter((i): i is [string, string] => i !== null)
            .map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: t.bg,
                  border: `1px solid ${t.accent}`,
                  borderRadius: 7,
                  padding: "7px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 2 }}>{item[0]}</div>
                <div
                  style={{
                    color: t.secondary,
                    fontSize: t.bodySize,
                    fontWeight: 700,
                    fontFamily: "sans-serif",
                  }}
                >
                  {item[1]}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div style={{ margin: "0 12px 14px" }}>
        <ClubNameBlock
          clubName={d.clubName}
          clubNumber={d.clubNumber}
          districtLabel={activeDgDistrict(d)}
          primary={t.primary}
          accent={t.accent}
          secondary={t.secondary}
          text={t.text}
          bg={t.bg}
          variant="default"
        />
        {d.contactName && (
          <div
            style={{
              color: "#6B7280",
              fontSize: 9,
              fontFamily: "sans-serif",
              marginTop: 4,
            }}
          >
            📞 {d.contactName}
            {d.contactPhone ? ` ${d.contactPhone}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TEMPLATE 5 ───────────────────────────────────────────────────────────────
// Width: 480px — image container has 14px margin each side + 12px internal padding = ~52px total
function Template5({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize =
    d.title && d.title.length > 24 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "D. Gov" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // T5 is 480px; image container: 14px margin each side + 12px padding each side = ~52px total
  const { w: imgW, h: imgH } = getImgSize(total, 428, orient);

  return (
    <div
      style={{
        width: 480,
        background: `linear-gradient(145deg, ${t.bg} 0%, ${t.accent} 40%, ${t.primary}88 100%)`,
        overflow: "hidden",
        fontFamily: "Trebuchet MS, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -24,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={ROTARY_LOGO}
          alt="Rotary"
          onError={onImgErr}
          crossOrigin="anonymous"
          style={{
            height: t.logoSize - 34,
            background: "white",
            padding: 5,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: t.secondary,
              fontSize: 9,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: t.secondary,
              fontSize: 16,
              fontWeight: 900,
              marginTop: 2,
            }}
          >
            {activeDgDistrict(d)}
          </div>
        </div>
        {d.clubNumber ? (
          <div
            style={{
              background: "rgba(255,255,255,0.45)",
              color: t.secondary,
              fontSize: 17,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 16,
            }}
          >
            #{d.clubNumber}
          </div>
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>
      {allImages.length > 0 && (
        <div
          style={{
            margin: "0 14px 12px",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.55)",
            borderRadius: 14,
            padding: "10px 12px",
            display: "flex",
            alignItems: "flex-start",
            gap: total > 5 ? 5 : 8,
            position: "relative",
            zIndex: 2,
            flexWrap: total > 5 ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          {allImages.map((img, i) => (
            <PersonCard
              key={i}
              url={img.url}
              caption={img.caption}
              subLabel={img.subLabel}
              w={imgW}
              h={imgH}
              borderRadius={10}
              primary={t.primary}
              secondary={t.secondary}
              accent={t.accent}
              orientation={orientMap[img.url] ?? orient}
            />
          ))}
        </div>
      )}
      <div
        style={{
          margin: "0 14px 14px",
          background: "rgba(255,255,255,0.92)",
          borderRadius: 16,
          padding: "14px 18px",
          boxShadow: "0 14px 44px rgba(0,0,0,0.18)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: t.primary,
            fontSize: 9,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          You Are Invited
        </div>
        <div
          style={{
            color: t.text,
            fontSize: titleSize,
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {d.title || <span style={{ opacity: 0.2 }}>Event Title</span>}
        </div>
        {d.subtitle && (
          <div
            style={{
              color: "#475569",
              fontSize: t.subtitleSize,
              lineHeight: 1.55,
              marginBottom: 8,
              fontStyle: "italic",
              background: `${t.primary}11`,
              padding: "6px 12px",
              borderRadius: 8,
              borderLeft: `3px solid ${t.primary}`,
            }}
          >
            {d.subtitle}
          </div>
        )}
        {d.speakerName && (
          <div
            style={{
              background: t.bg,
              border: `1px solid ${t.accent}`,
              borderRadius: 8,
              padding: "7px 10px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                color: t.primary,
                fontSize: 7.5,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Chief Guest
            </div>
            <div style={{ color: t.text, fontSize: 13, fontWeight: "bold" }}>
              {d.speakerName}
            </div>
            {d.speakerDesignation && (
              <div style={{ color: "#64748B", fontSize: 9.5 }}>
                {d.speakerDesignation}
              </div>
            )}
          </div>
        )}
        <div style={{ display: "flex", gap: 7, marginBottom: 7 }}>
          {d.dateFormatted && (
            <div
              style={{
                flex: 1,
                background: t.bg,
                borderRadius: 8,
                padding: "6px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12 }}>📅</div>
              <div
                style={{
                  color: t.primary,
                  fontSize: 7,
                  textTransform: "uppercase",
                }}
              >
                Date
              </div>
              <div
                style={{ color: t.text, fontSize: t.bodySize, fontWeight: 700 }}
              >
                {d.dateFormatted}
              </div>
            </div>
          )}
          {d.timeFormatted && (
            <div
              style={{
                flex: 1,
                background: t.bg,
                borderRadius: 8,
                padding: "6px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12 }}>🕐</div>
              <div
                style={{
                  color: t.primary,
                  fontSize: 7,
                  textTransform: "uppercase",
                }}
              >
                Time
              </div>
              <div
                style={{ color: t.text, fontSize: t.bodySize, fontWeight: 700 }}
              >
                {d.timeFormatted}
              </div>
            </div>
          )}
        </div>
        {d.place && (
          <div
            style={{
              background: t.bg,
              borderRadius: 8,
              padding: "6px 10px",
              marginBottom: 7,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>📍</span>
            <div>
              <div
                style={{
                  color: t.primary,
                  fontSize: 7,
                  textTransform: "uppercase",
                }}
              >
                Venue
              </div>
              <div
                style={{ color: t.text, fontSize: t.bodySize, fontWeight: 700 }}
              >
                {d.place}
              </div>
            </div>
          </div>
        )}
        {d.contactName && (
          <div style={{ color: "#64748B", fontSize: 9.5 }}>
            📞 {d.contactName}
            {d.contactPhone ? ` ${d.contactPhone}` : ""}
          </div>
        )}
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: `2px solid ${t.accent}`,
          }}
        >
          <ClubNameBlock
            clubName={d.clubName}
            clubNumber={d.clubNumber}
            districtLabel={activeDgDistrict(d)}
            primary={t.primary}
            accent={t.accent}
            secondary={t.secondary}
            text={t.text}
            bg={t.bg}
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 6 ───────────────────────────────────────────────────────────────
// Width: 480px — strip image area full width minus ~24px padding = 456px usable
function Template6({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize =
    d.title && d.title.length > 22 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "D. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      subLabel: undefined,
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );

  // T6 strip: 480px wide, 6px border-left, ~12px padding each side = ~450px usable
  const availStripW = 450;
  const gapStrip = total > 1 ? (total - 1) * (total > 5 ? 5 : 8) : 0;
  const stripImgW =
    total === 0
      ? 0
      : total === 1
        ? Math.round((availStripW - gapStrip) * 0.7)
        : total === 2
          ? Math.round((availStripW - gapStrip) * 0.47)
          : total === 3
            ? Math.round((availStripW - gapStrip - 32) / 3)
            : total === 4
              ? Math.round((availStripW - gapStrip - 32) / 4)
              : total <= 6
                ? Math.round((availStripW - gapStrip - 32) / Math.max(total, 1))
                : 60;

  const aspectRatio =
    orient === "landscape" ? 0.68 : orient === "square" ? 1.0 : 1.35;
  const stripImgH = Math.round(stripImgW * aspectRatio);

  return (
    <div
      style={{
        width: 480,
        background: "white",
        overflow: "hidden",
        fontFamily: "Arial Narrow, Helvetica Neue, sans-serif",
        borderLeft: `6px solid ${t.primary}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: t.primary,
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={ROTARY_LOGO}
          alt="Rotary"
          onError={onImgErr}
          crossOrigin="anonymous"
          style={{
            height: t.logoSize - 38,
            background: "white",
            padding: 4,
            borderRadius: 4,
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              marginTop: 2,
            }}
          >
            {activeDgDistrict(d)}
          </div>
        </div>
        {d.clubNumber ? (
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "white",
              fontSize: 17,
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 16,
            }}
          >
            #{d.clubNumber}
          </div>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>
      {total > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: total > 5 ? 5 : 8,
            padding: "10px 12px 0",
            background: `linear-gradient(180deg, ${t.primary}15 0%, transparent 100%)`,
            borderBottom: `2px solid ${t.primary}33`,
            flexWrap: total > 6 ? "wrap" : "nowrap",
          }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              style={{ flexShrink: 0, textAlign: "center", width: stripImgW }}
            >
              <div
                style={{
                  width: stripImgW,
                  height: stripImgH,
                  borderRadius: `${t.borderRadius}px ${t.borderRadius}px 0 0`,
                  overflow: "hidden",
                  border: `3px solid ${t.primary}`,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.22)`,
                  background: "#f1f5f9",
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  crossOrigin="anonymous"
                  onError={onImgErr}
                  onLoad={onImgLoad}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition:
                      orientMap[img.url] === "landscape"
                        ? "center center"
                        : "top center",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  borderRadius: `0 0 ${t.borderRadius}px ${t.borderRadius}px`,
                  padding: "4px 5px 5px",
                  minHeight: 26,
                  width: stripImgW,
                }}
              >
                {img.subLabel && (
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 7,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {img.subLabel}
                  </div>
                )}
                <div
                  style={{
                    color: "white",
                    fontSize: stripImgW < 80 ? 8.5 : stripImgW < 140 ? 10 : 11,
                    fontWeight: 800,
                    textAlign: "center",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {truncateCaption(img.caption, 24) || "\u00A0"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        style={{ display: "flex", padding: "12px 14px 14px", gap: 12, flex: 1 }}
      >
        <div
          style={{
            width: 110,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                color: "#64748B",
                fontSize: 7.5,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 4,
                fontFamily: "sans-serif",
              }}
            >
              Presented By
            </div>
            <div
              style={{
                color: t.text,
                fontSize: t.clubNameSize + 2,
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: 0.3,
              }}
            >
              {d.clubName || <span style={{ opacity: 0.35 }}>Club Name</span>}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span
                style={{
                  background: t.primary,
                  color: "white",
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 20,
                  display: "inline-block",
                }}
              >
                {activeDgDistrict(d)}
              </span>
              {d.clubNumber && (
                <span
                  style={{ color: t.primary, fontSize: 9, fontWeight: 700 }}
                >
                  Club #{d.clubNumber}
                </span>
              )}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <img
              src={ROTARY_LOGO}
              alt=""
              onError={onImgErr}
              crossOrigin="anonymous"
              style={{ height: t.logoSize - 48, opacity: 0.5 }}
            />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              borderBottom: `3px solid ${t.text}`,
              paddingBottom: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                color: t.primary,
                fontSize: 9,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              INVITATION
            </div>
            <div
              style={{
                color: t.text,
                fontSize: titleSize,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: -0.5,
              }}
            >
              {d.title || <span style={{ opacity: 0.2 }}>Event Title</span>}
            </div>
          </div>
          {d.subtitle && (
            <div
              style={{
                color: "#334155",
                fontSize: t.subtitleSize,
                lineHeight: 1.55,
                marginBottom: 10,
                fontStyle: "italic",
                background: "#F8FAFC",
                padding: "7px 12px",
                borderRadius: 6,
                borderLeft: `3px solid ${t.primary}`,
              }}
            >
              {d.subtitle}
            </div>
          )}
          {d.speakerName && (
            <div
              style={{
                borderLeft: `3px solid ${t.primary}`,
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  color: t.primary,
                  fontSize: 7.5,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Chief Guest
              </div>
              <div style={{ color: t.text, fontSize: 13, fontWeight: "bold" }}>
                {d.speakerName}
              </div>
              {d.speakerDesignation && (
                <div style={{ color: "#64748B", fontSize: 9.5 }}>
                  {d.speakerDesignation}
                </div>
              )}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: "auto",
            }}
          >
            {(
              [
                d.dateFormatted ? ["Date", d.dateFormatted] : null,
                d.timeFormatted ? ["Time", d.timeFormatted] : null,
                d.place ? ["Venue", d.place] : null,
                d.contactName || d.contactPhone
                  ? [
                      "Contact",
                      [d.contactName, d.contactPhone]
                        .filter(Boolean)
                        .join(" · "),
                    ]
                  : null,
              ] as ([string, string] | null)[]
            )
              .filter((i): i is [string, string] => i !== null)
              .map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 7,
                    borderBottom: "1px solid #F1F5F9",
                    paddingBottom: 4,
                  }}
                >
                  <div
                    style={{
                      color: t.primary,
                      fontSize: 9,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      width: 48,
                      flexShrink: 0,
                    }}
                  >
                    {item[0]}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "#E2E8F0",
                      marginBottom: 2,
                    }}
                  />
                  <div
                    style={{
                      color: t.text,
                      fontSize: t.bodySize + 1,
                      fontWeight: 700,
                      textAlign: "right",
                      maxWidth: 130,
                    }}
                  >
                    {item[1]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div style={{ height: 5, background: t.primary }} />
    </div>
  );
}

// ─── TEMPLATE 7 ───────────────────────────────────────────────────────────────
// Width: 600px — image row inside padding "0 28px" = 544px usable
function Template7({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 30 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", sub: "District Governor" }]
      : []),
    ...uploadedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      sub: "",
    })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );

  // T7 is 600px; image row padding "0 28px" = 544px; card inner padding ~20px
  const availT7 = 544;
  const gapT7 =
    total > 1 ? (total - 1) * (total > 5 ? 6 : total > 3 ? 8 : 12) : 0;
  const availForImgs =
    availT7 - gapT7 - (total > 0 ? (total <= 3 ? 20 : 12) : 0);
  const imgW =
    total === 0
      ? 0
      : total === 1
        ? Math.round(availForImgs * 0.68)
        : total === 2
          ? Math.round(availForImgs * 0.47)
          : total === 3
            ? Math.round(availForImgs / 3)
            : total === 4
              ? Math.round(availForImgs / 4)
              : total <= 6
                ? Math.round(availForImgs / total)
                : 66;
  const imgH =
    orient === "landscape"
      ? Math.round(imgW * 0.68)
      : orient === "square"
        ? imgW
        : Math.round(imgW * 1.35);

  return (
    <div
      style={{
        width: 600,
        background: `linear-gradient(180deg,${t.secondary} 0%,${t.primary} 50%,${t.accent} 100%)`,
        overflow: "hidden",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 7,
          background: `linear-gradient(90deg,${t.accent},#fdba74,${t.accent})`,
          flexShrink: 0,
        }}
      />
      <div
        style={{ padding: "16px 28px 14px", position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <img
            src={ROTARY_LOGO}
            style={{
              height: t.logoSize,
              background: "white",
              padding: 6,
              borderRadius: 10,
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
            alt="Rotary"
            crossOrigin="anonymous"
            onError={onImgErr}
          />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Rotary International
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {activeDgDistrict(d)}
            </div>
            {d.clubNumber && (
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: 20,
                  marginTop: 4,
                  display: "inline-block",
                }}
              >
                Club #{d.clubNumber}
              </div>
            )}
          </div>
          <div style={{ width: t.logoSize }} />
        </div>
        {allImages.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: total > 5 ? 6 : total > 3 ? 8 : 12,
              marginBottom: 14,
              flexWrap: total > 5 ? "wrap" : "nowrap",
              alignItems: "flex-end",
            }}
          >
            {allImages.map((img, i) => {
              const capText = truncateCaption(img.caption, 28);
              const imgOrient = orientMap[img.url] ?? orient;
              const objPos =
                imgOrient === "landscape" ? "center center" : "top center";
              const capFontSize =
                imgW < 80 ? 9 : imgW < 120 ? 10 : imgW < 180 ? 11 : 12;
              return (
                <div
                  key={i}
                  style={{ flexShrink: 0, textAlign: "center", width: imgW }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 12,
                      padding: total <= 3 ? "10px 10px 8px" : "6px 6px 6px",
                      border: "2px solid rgba(255,255,255,0.35)",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: imgH,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "3px solid white",
                        marginBottom: 6,
                      }}
                    >
                      <img
                        src={img.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: objPos,
                          display: "block",
                        }}
                        alt=""
                        onError={onImgErr}
                        onLoad={onImgLoad}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: capFontSize,
                        fontWeight: 800,
                        textAlign: "center",
                        width: "100%",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                      }}
                    >
                      {capText || "\u00A0"}
                    </div>
                    {img.sub && (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: 8,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          textAlign: "center",
                          marginTop: 2,
                        }}
                      >
                        {img.sub}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 14,
            padding: "18px 22px",
            boxShadow: "0 10px 36px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              color: t.primary,
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Cordially Invites You
          </div>
          <div
            style={{
              color: "#1e293b",
              fontSize: titleSize,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            {d.title || <span style={{ opacity: 0.3 }}>Event Title</span>}
          </div>
          {d.subtitle && (
            <div
              style={{
                color: "#1e293b",
                fontSize: t.subtitleSize,
                textAlign: "center",
                lineHeight: 1.55,
                marginBottom: 12,
                fontStyle: "italic",
                background: "rgba(255,255,255,0.6)",
                padding: "6px 14px",
                borderRadius: 8,
                border: `2px solid ${t.accent}`,
              }}
            >
              {d.subtitle}
            </div>
          )}
          {d.speakerName && (
            <div
              style={{
                background: "#fff7ed",
                border: `2px solid ${t.accent}`,
                borderRadius: 10,
                padding: "10px 18px",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: t.primary,
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Chief Guest
              </div>
              <div
                style={{ color: "#1e293b", fontSize: 16, fontWeight: "bold" }}
              >
                {d.speakerName}
              </div>
              {d.speakerDesignation && (
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  {d.speakerDesignation}
                </div>
              )}
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {d.dateFormatted && (
              <div
                style={{
                  background: `${t.primary}11`,
                  borderRadius: 8,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: t.primary, fontSize: 14 }}>📅</div>
                <div
                  style={{
                    color: "#1e293b",
                    fontSize: t.bodySize,
                    fontWeight: "bold",
                  }}
                >
                  {d.dateFormatted}
                </div>
              </div>
            )}
            {d.timeFormatted && (
              <div
                style={{
                  background: `${t.primary}11`,
                  borderRadius: 8,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: t.primary, fontSize: 14 }}>🕐</div>
                <div
                  style={{
                    color: "#1e293b",
                    fontSize: t.bodySize,
                    fontWeight: "bold",
                  }}
                >
                  {d.timeFormatted}
                </div>
              </div>
            )}
          </div>
          {d.place && (
            <div
              style={{
                background: `${t.primary}11`,
                borderRadius: 8,
                padding: "8px",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ color: t.primary, fontSize: 14 }}>📍</span>{" "}
              <span
                style={{
                  color: "#1e293b",
                  fontSize: t.bodySize,
                  fontWeight: "bold",
                }}
              >
                {d.place}
              </span>
            </div>
          )}
          {(d.contactName || d.contactPhone) && (
            <div
              style={{
                color: "#64748b",
                fontSize: t.bodySize,
                textAlign: "center",
              }}
            >
              {d.contactName} {d.contactPhone}
            </div>
          )}
          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: `2px solid ${t.accent}`,
            }}
          >
            <ClubNameBlock
              clubName={d.clubName}
              clubNumber={d.clubNumber}
              districtLabel={activeDgDistrict(d)}
              primary={t.primary}
              accent={t.accent}
              secondary={t.secondary}
              text="#1e293b"
              bg="white"
              variant="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 8 ───────────────────────────────────────────────────────────────
// Width: 600px — image row inside "padding 24px 36px" = 528px usable
function Template8({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 30 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "D. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({ ...img, subLabel: undefined })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );
  // T8 is 600px; content has padding 24px each side + 8px border-left = ~536px usable
  const { w: imgW, h: imgH } = getImgSize(total, 536, orient);

  return (
    <div
      style={{
        width: 600,
        background: t.bg,
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 280,
          height: 280,
          background: `radial-gradient(circle, ${t.primary} 0%, transparent 70%)`,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          borderLeft: `8px solid ${t.primary}`,
          padding: "24px 36px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <img
            src={ROTARY_LOGO}
            style={{
              height: t.logoSize,
              background: "white",
              padding: 6,
              borderRadius: 8,
            }}
            alt="Rotary"
            crossOrigin="anonymous"
            onError={onImgErr}
          />
          <div>
            <div
              style={{
                color: t.primary,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Rotary International
            </div>
            <div
              style={{
                color: t.secondary,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              {activeDgDistrict(d)}
            </div>
            {d.clubNumber && (
              <div
                style={{
                  background: t.primary,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "2px 10px",
                  borderRadius: 20,
                  display: "inline-block",
                  marginTop: 3,
                }}
              >
                Club #{d.clubNumber}
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: 3,
            background: `linear-gradient(90deg,${t.primary},transparent)`,
            marginBottom: 18,
          }}
        />
        {allImages.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: total > 4 ? 8 : 14,
              marginBottom: 16,
              alignItems: "flex-start",
              flexWrap: total > 5 ? "wrap" : "nowrap",
              justifyContent: "center",
            }}
          >
            {allImages.map((img, i) => (
              <PersonCard
                key={i}
                url={img.url}
                caption={img.caption}
                subLabel={img.subLabel}
                w={imgW}
                h={imgH}
                borderRadius={8}
                primary={t.primary}
                secondary={t.secondary}
                accent={t.accent}
                orientation={orientMap[img.url] ?? orient}
              />
            ))}
          </div>
        )}
        <div
          style={{
            background: "white",
            borderRadius: t.borderRadius,
            padding: "18px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            border: `1px solid ${t.accent}`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              color: t.text,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            {d.title || <span style={{ opacity: 0.3 }}>Event Title</span>}
          </div>
          {d.subtitle && (
            <div
              style={{
                color: "#334155",
                fontSize: t.subtitleSize,
                lineHeight: 1.6,
                marginBottom: 12,
                fontStyle: "italic",
                background: "white",
                padding: "7px 12px",
                borderRadius: 8,
                border: `1px solid ${t.accent}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {d.subtitle}
            </div>
          )}
          {d.speakerName && (
            <div
              style={{
                borderLeft: `4px solid ${t.primary}`,
                paddingLeft: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  color: t.primary,
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Chief Guest
              </div>
              <div style={{ color: t.text, fontSize: 17, fontWeight: "bold" }}>
                {d.speakerName}
              </div>
              {d.speakerDesignation && (
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  {d.speakerDesignation}
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {d.dateFormatted && (
              <div
                style={{
                  flex: 1,
                  minWidth: 130,
                  background: t.bg,
                  border: `1px solid ${t.accent}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                }}
              >
                <div
                  style={{
                    color: t.primary,
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  Date
                </div>
                <div
                  style={{
                    color: t.text,
                    fontSize: t.bodySize,
                    fontWeight: "bold",
                  }}
                >
                  {d.dateFormatted}
                </div>
              </div>
            )}
            {d.timeFormatted && (
              <div
                style={{
                  flex: 1,
                  minWidth: 130,
                  background: t.bg,
                  border: `1px solid ${t.accent}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                }}
              >
                <div
                  style={{
                    color: t.primary,
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  Time
                </div>
                <div
                  style={{
                    color: t.text,
                    fontSize: t.bodySize,
                    fontWeight: "bold",
                  }}
                >
                  {d.timeFormatted}
                </div>
              </div>
            )}
          </div>
          {d.place && (
            <div
              style={{
                marginTop: 10,
                background: t.bg,
                border: `1px solid ${t.accent}`,
                borderRadius: 8,
                padding: "9px 12px",
              }}
            >
              <div
                style={{
                  color: t.primary,
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                Venue
              </div>
              <div
                style={{
                  color: t.text,
                  fontSize: t.bodySize,
                  fontWeight: "bold",
                }}
              >
                {d.place}
              </div>
            </div>
          )}
        </div>
        {d.contactName && (
          <div
            style={{ color: "#64748b", fontSize: t.bodySize, lineHeight: 1.7 }}
          >
            📞 {d.contactName} {d.contactPhone}
          </div>
        )}
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: `3px solid ${t.accent}`,
          }}
        >
          <ClubNameBlock
            clubName={d.clubName}
            clubNumber={d.clubNumber}
            districtLabel={activeDgDistrict(d)}
            primary={t.primary}
            accent={t.accent}
            secondary={t.secondary}
            text={t.text}
            bg={t.bg}
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 9 ───────────────────────────────────────────────────────────────
// Width: 848px — right panel is ~608px, image area ~580px usable
function Template9({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 40 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "Dist. Governor" }]
      : []),
    ...uploadedImages.map((img) => ({ ...img, subLabel: undefined })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );

  // T9 right panel is 848 - 240 = 608px; image area padding 28px each side = ~552px usable
  const availT9 = 552;
  const gapT9 = total > 1 ? (total - 1) * (total > 5 ? 6 : 10) : 0;
  const imgW =
    total === 0
      ? 0
      : total === 1
        ? Math.round((availT9 - gapT9 - 16) * 0.65)
        : total === 2
          ? Math.round((availT9 - gapT9 - 16) * 0.46)
          : total === 3
            ? Math.round((availT9 - gapT9 - 16) / 3)
            : total === 4
              ? Math.round((availT9 - gapT9 - 16) / 4)
              : total <= 6
                ? Math.round((availT9 - gapT9 - 16) / total)
                : 68;
  const imgH =
    orient === "landscape"
      ? Math.round(imgW * 0.68)
      : orient === "square"
        ? imgW
        : Math.round(imgW * 1.35);

  return (
    <div
      style={{
        width: 848,
        background: t.bg,
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg,${t.primary},${t.accent},${t.primary})`,
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            width: 240,
            background: `linear-gradient(160deg, ${t.secondary} 0%, ${t.primary} 100%)`,
            padding: "24px 16px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={ROTARY_LOGO}
            style={{
              height: t.logoSize - 15,
              background: "white",
              padding: 6,
              borderRadius: t.borderRadius,
              marginBottom: 14,
              alignSelf: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            alt="Rotary"
            crossOrigin="anonymous"
            onError={onImgErr}
          />
          <div
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Rotary
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            International
          </div>
          <div
            style={{
              width: "80%",
              height: 1,
              background: "rgba(255,255,255,0.3)",
              marginBottom: 10,
            }}
          />
          <div
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 900,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {activeDgDistrict(d)}
          </div>
          {d.clubNumber && (
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: 15,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 20,
                display: "inline-block",
                marginBottom: 6,
              }}
            >
              Club #{d.clubNumber}
            </div>
          )}
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 9,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Theme: {THEME}
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: "100%",
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.3)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 8,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Organized By
            </div>
            <div
              style={{
                color: "white",
                fontSize: t.clubNameSize + 2,
                fontWeight: 900,
                lineHeight: 1.2,
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {d.clubName || <span style={{ opacity: 0.35 }}>Club Name</span>}
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "22px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                color: t.primary,
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              Official Programme
            </div>
            <div
              style={{
                color: t.text,
                fontSize: titleSize,
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              {d.title || <span style={{ opacity: 0.3 }}>Event Title</span>}
            </div>
            {d.subtitle && (
              <div
                style={{
                  color: "#475569",
                  fontSize: t.subtitleSize,
                  lineHeight: 1.55,
                  fontStyle: "italic",
                  background: "white",
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: `1px solid ${t.accent}`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                {d.subtitle}
              </div>
            )}
          </div>
          {total > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: total > 5 ? 6 : 10,
                flexWrap: total > 5 ? "wrap" : "nowrap",
                alignItems: "flex-end",
                background: `${t.primary}08`,
                borderRadius: t.borderRadius,
                padding: "12px 8px 8px",
                border: `1px solid ${t.accent}`,
              }}
            >
              {allImages.map((img, i) => (
                <PersonCard
                  key={i}
                  url={img.url}
                  caption={img.caption}
                  subLabel={img.subLabel}
                  w={imgW}
                  h={imgH}
                  borderRadius={t.borderRadius}
                  primary={t.primary}
                  secondary={t.secondary}
                  accent={t.accent}
                  orientation={orientMap[img.url] ?? orient}
                />
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.speakerName && (
              <div
                style={{
                  background: `${t.primary}11`,
                  border: `2px solid ${t.accent}`,
                  borderRadius: t.borderRadius,
                  padding: "10px 16px",
                }}
              >
                <div
                  style={{
                    color: t.primary,
                    fontSize: 9,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Chief Guest
                </div>
                <div
                  style={{ color: t.text, fontSize: 15, fontWeight: "bold" }}
                >
                  {d.speakerName}
                </div>
                {d.speakerDesignation && (
                  <div style={{ color: "#64748B", fontSize: 10.5 }}>
                    {d.speakerDesignation}
                  </div>
                )}
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {d.dateFormatted && (
                <div
                  style={{
                    background: "white",
                    border: `1px solid ${t.accent}`,
                    borderRadius: t.borderRadius,
                    padding: "9px 12px",
                    textAlign: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 3 }}>📅</div>
                  <div
                    style={{
                      color: t.primary,
                      fontSize: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    Date
                  </div>
                  <div
                    style={{
                      color: t.text,
                      fontSize: t.bodySize,
                      fontWeight: 700,
                    }}
                  >
                    {d.dateFormatted}
                  </div>
                </div>
              )}
              {d.timeFormatted && (
                <div
                  style={{
                    background: "white",
                    border: `1px solid ${t.accent}`,
                    borderRadius: t.borderRadius,
                    padding: "9px 12px",
                    textAlign: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 3 }}>🕐</div>
                  <div
                    style={{
                      color: t.primary,
                      fontSize: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    Time
                  </div>
                  <div
                    style={{
                      color: t.text,
                      fontSize: t.bodySize,
                      fontWeight: 700,
                    }}
                  >
                    {d.timeFormatted}
                  </div>
                </div>
              )}
              {d.place && (
                <div
                  style={{
                    background: "white",
                    border: `1px solid ${t.accent}`,
                    borderRadius: t.borderRadius,
                    padding: "9px 12px",
                    textAlign: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 3 }}>📍</div>
                  <div
                    style={{
                      color: t.primary,
                      fontSize: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    Venue
                  </div>
                  <div
                    style={{
                      color: t.text,
                      fontSize: t.bodySize,
                      fontWeight: 700,
                    }}
                  >
                    {d.place}
                  </div>
                </div>
              )}
            </div>
            {(d.contactName || d.contactPhone) && (
              <div style={{ color: "#64748B", fontSize: 10 }}>
                📞 {d.contactName}
                {d.contactPhone ? ` ${d.contactPhone}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 10 ──────────────────────────────────────────────────────────────
// Width: 848px — image row inside padding "18px 28px" = 792px usable
function Template10({
  d,
  theme: t,
  uploadedImages,
  dgImage,
  dgName,
  showDgImage,
}: TemplateProps) {
  const titleSize = d.title?.length > 35 ? t.titleSize - 4 : t.titleSize;
  const allImages = [
    ...(showDgImage && dgImage
      ? [{ url: dgImage, caption: dgName || "", subLabel: "D. Gov" }]
      : []),
    ...uploadedImages.map((img) => ({ ...img, subLabel: undefined })),
  ];
  const total = allImages.length;
  const orientMap = useImageOrientations(allImages);
  const orient = dominantOrientation(
    allImages.map((i) => i.url),
    orientMap,
  );

  // T10 is 848px; image row padding 28px each side = 792px; inner container padding ~24px each side = ~744px
  const availT10 = 744;
  const gapT10 = total > 1 ? (total - 1) * (total > 5 ? 8 : 14) : 0;
  const imgW =
    total === 0
      ? 0
      : total === 1
        ? Math.round((availT10 - gapT10) * 0.6)
        : total === 2
          ? Math.round((availT10 - gapT10) * 0.46)
          : total === 3
            ? Math.round((availT10 - gapT10) / 3)
            : total === 4
              ? Math.round((availT10 - gapT10) / 4)
              : total <= 6
                ? Math.round((availT10 - gapT10) / total)
                : 74;
  const imgH =
    orient === "landscape"
      ? Math.round(imgW * 0.68)
      : orient === "square"
        ? imgW
        : Math.round(imgW * 1.35);

  return (
    <div
      style={{
        width: 848,
        background: t.bg,
        overflow: "hidden",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg,${t.primary},${t.secondary},${t.primary})`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          padding: "14px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${t.accent}`,
        }}
      >
        <img
          src={ROTARY_LOGO}
          style={{
            height: t.logoSize,
            background: "white",
            padding: 6,
            borderRadius: t.borderRadius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          alt="Rotary"
          crossOrigin="anonymous"
          onError={onImgErr}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: t.primary,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Rotary International
          </div>
          <div
            style={{
              color: t.text,
              fontSize: 20,
              fontWeight: 900,
              marginTop: 2,
            }}
          >
            {activeDgDistrict(d)}
          </div>
          <div style={{ color: "#64748B", fontSize: 9, marginTop: 2 }}>
            Theme: {THEME}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: t.primary,
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: 3,
            }}
          >
            Organized By
          </div>
          <div
            style={{
              color: t.text,
              fontSize: t.clubNameSize + 4,
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {d.clubName || <span style={{ opacity: 0.3 }}>Club Name</span>}
          </div>
          <div
            style={{
              display: "flex",
              gap: 5,
              justifyContent: "flex-end",
              marginTop: 4,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: t.primary,
                color: "white",
                fontSize: 16,
                fontWeight: 800,
                padding: "2px 10px",
                borderRadius: 20,
                fontFamily: "sans-serif",
              }}
            >
              {activeDgDistrict(d)}
            </span>
            {d.clubNumber && (
              <span
                style={{
                  background: `${t.primary}18`,
                  border: `1px solid ${t.primary}`,
                  color: t.primary,
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontFamily: "sans-serif",
                }}
              >
                #{d.clubNumber}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "18px 28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              color: t.primary,
              fontSize: 10,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            You Are Cordially Invited
          </div>
          <div
            style={{
              color: t.text,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {d.title || <span style={{ opacity: 0.3 }}>Event Title</span>}
          </div>
          {d.subtitle && (
            <div
              style={{
                color: "#475569",
                fontSize: t.subtitleSize,
                lineHeight: 1.55,
                fontStyle: "italic",
                background: `${t.primary}0a`,
                padding: "7px 12px",
                borderRadius: 8,
                borderLeft: `3px solid ${t.primary}`,
              }}
            >
              {d.subtitle}
            </div>
          )}
        </div>
        {total > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: total > 5 ? 8 : 14,
              flexWrap: total > 6 ? "wrap" : "nowrap",
              alignItems: "flex-end",
              background: `${t.primary}08`,
              borderRadius: t.borderRadius,
              padding: "14px 12px 10px",
              border: `1px solid ${t.accent}`,
            }}
          >
            {allImages.map((img, i) => (
              <PersonCard
                key={i}
                url={img.url}
                caption={img.caption}
                subLabel={img.subLabel}
                w={imgW}
                h={imgH}
                borderRadius={t.borderRadius}
                primary={t.primary}
                secondary={t.secondary}
                accent={t.accent}
                orientation={orientMap[img.url] ?? orient}
              />
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {d.speakerName && (
            <div
              style={{
                borderLeft: `4px solid ${t.primary}`,
                paddingLeft: 12,
                background: `${t.primary}08`,
                padding: "8px 12px",
                borderRadius: t.borderRadius,
              }}
            >
              <div
                style={{
                  color: t.primary,
                  fontSize: 9,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Chief Guest
              </div>
              <div style={{ color: t.text, fontSize: 14, fontWeight: "bold" }}>
                {d.speakerName}
              </div>
              {d.speakerDesignation && (
                <div style={{ color: "#64748B", fontSize: 10 }}>
                  {d.speakerDesignation}
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {d.dateFormatted && (
              <div
                style={{
                  background: `${t.primary}15`,
                  border: `1px solid ${t.primary}`,
                  borderRadius: 30,
                  padding: "7px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 13 }}>📅</span>
                <span
                  style={{
                    color: t.text,
                    fontSize: t.bodySize,
                    fontWeight: 700,
                  }}
                >
                  {d.dateFormatted}
                </span>
              </div>
            )}
            {d.timeFormatted && (
              <div
                style={{
                  background: `${t.primary}15`,
                  border: `1px solid ${t.primary}`,
                  borderRadius: 30,
                  padding: "7px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 13 }}>🕐</span>
                <span
                  style={{
                    color: t.text,
                    fontSize: t.bodySize,
                    fontWeight: 700,
                  }}
                >
                  {d.timeFormatted}
                </span>
              </div>
            )}
            {d.place && (
              <div
                style={{
                  background: `${t.primary}15`,
                  border: `1px solid ${t.primary}`,
                  borderRadius: 30,
                  padding: "7px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 13 }}>📍</span>
                <span
                  style={{
                    color: t.text,
                    fontSize: t.bodySize,
                    fontWeight: 700,
                  }}
                >
                  {d.place}
                </span>
              </div>
            )}
          </div>
          {(d.contactName || d.contactPhone) && (
            <div style={{ color: "#64748B", fontSize: 10 }}>
              📞 {d.contactName}
              {d.contactPhone ? ` ${d.contactPhone}` : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TEMPLATE_RENDERERS: Record<number, React.ComponentType<TemplateProps>> = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
  6: Template6,
  7: Template7,
  8: Template8,
  9: Template9,
  10: Template10,
};

const TEMPLATE_META = [
  { id: 1, name: "Ivory Gold Elegance", tag: "Dark Luxury", size: "600×auto" },
  { id: 2, name: "Sky Blue Split", tag: "Modern Clean", size: "600×auto" },
  { id: 3, name: "Crimson Arch", tag: "Bold Festive", size: "480×auto" },
  { id: 4, name: "Sage Garden", tag: "Earthy Natural", size: "480×auto" },
  { id: 5, name: "Peach Sunrise", tag: "Warm Gradient", size: "480×auto" },
  { id: 6, name: "Slate Editorial", tag: "Magazine Style", size: "480×auto" },
  { id: 7, name: "Sunset Orange", tag: "Vibrant Warm", size: "600×auto" },
  { id: 8, name: "Teal Minimalist", tag: "Tech Minimal", size: "600×auto" },
  { id: 9, name: "Purple Horizon", tag: "Horizontal Wide", size: "848×auto" },
  {
    id: 10,
    name: "Ruby Landscape",
    tag: "Horizontal Classic",
    size: "848×auto",
  },
];

declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options?: object,
    ) => Promise<HTMLCanvasElement>;
  }
}

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

interface FieldProps {
  label: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}
const Field = ({ label, required, children, className = "" }: FieldProps) => (
  <div className={className}>
    <label className="block text-sm font-bold text-slate-800 mb-1 leading-none">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

interface ColorPickerProps {
  label: string;
  themeKey: keyof ThemeConfig;
  currentTheme: ThemeConfig;
  updateTheme: (key: string, val: string | number) => void;
}
const ColorPicker = ({
  label,
  themeKey,
  currentTheme,
  updateTheme,
}: ColorPickerProps) => (
  <div className="flex items-center gap-2 mb-2">
    <label className="text-sm font-bold text-slate-700 w-20 shrink-0">
      {label}
    </label>
    <div className="flex items-center gap-1.5 flex-1">
      <input
        type="color"
        value={currentTheme[themeKey] as string}
        onChange={(e) => updateTheme(themeKey, e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-slate-400 p-0.5 shrink-0"
      />
      <input
        type="text"
        value={currentTheme[themeKey] as string}
        onChange={(e) => updateTheme(themeKey, e.target.value)}
        className="flex-1 border border-black rounded px-2 py-1 text-sm font-mono text-slate-900 min-w-0"
      />
    </div>
  </div>
);

interface SliderFieldProps {
  label: string;
  themeKey: keyof ThemeConfig;
  min: number;
  max: number;
  currentTheme: ThemeConfig;
  updateTheme: (key: string, val: string | number) => void;
}
const SliderField = ({
  label,
  themeKey,
  min,
  max,
  currentTheme,
  updateTheme,
}: SliderFieldProps) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <span className="text-sm font-bold text-blue-700">
        {currentTheme[themeKey]}px
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={currentTheme[themeKey] as number}
      onChange={(e) => updateTheme(themeKey, Number(e.target.value))}
      className="w-full h-2 accent-blue-600"
    />
  </div>
);

interface StyleControlsProps {
  currentTheme: ThemeConfig;
  updateTheme: (key: string, val: string | number) => void;
  resetTheme: () => void;
}
const StyleControls = ({
  currentTheme,
  updateTheme,
  resetTheme,
}: StyleControlsProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">
        Style Controls
      </p>
      <button
        onClick={resetTheme}
        className="text-sm text-blue-600 hover:text-blue-800 font-bold"
      >
        ↺ Reset
      </button>
    </div>
    <div className="mb-4">
      <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
        Colors
      </p>
      <ColorPicker
        label="Primary"
        themeKey="primary"
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <ColorPicker
        label="Secondary"
        themeKey="secondary"
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <ColorPicker
        label="Accent"
        themeKey="accent"
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <ColorPicker
        label="Background"
        themeKey="bg"
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <ColorPicker
        label="Text"
        themeKey="text"
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
    </div>
    <div className="mb-4">
      <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
        Typography
      </p>
      <SliderField
        label="Title Size"
        themeKey="titleSize"
        min={18}
        max={52}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <SliderField
        label="Subtitle Size"
        themeKey="subtitleSize"
        min={8}
        max={22}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <SliderField
        label="Body Size"
        themeKey="bodySize"
        min={8}
        max={18}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <SliderField
        label="Logo Size"
        themeKey="logoSize"
        min={50}
        max={140}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
      <SliderField
        label="Club Name Size"
        themeKey="clubNameSize"
        min={12}
        max={36}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
        Shape
      </p>
      <SliderField
        label="Border Radius"
        themeKey="borderRadius"
        min={0}
        max={24}
        currentTheme={currentTheme}
        updateTheme={updateTheme}
      />
    </div>
  </div>
);

const COLOR_PRESETS = [
  {
    name: "Gold Classic",
    primary: "#c9a227",
    secondary: "#0a1628",
    accent: "#f5e07a",
    bg: "#0a1628",
    text: "#ffffff",
  },
  {
    name: "Royal Blue",
    primary: "#2563b0",
    secondary: "#1a3a6b",
    accent: "#bfdbfe",
    bg: "#ffffff",
    text: "#0f172a",
  },
  {
    name: "Crimson Red",
    primary: "#B91C1C",
    secondary: "#7F1D1D",
    accent: "#FECACA",
    bg: "#FFF5F5",
    text: "#0F172A",
  },
  {
    name: "Forest Green",
    primary: "#15803D",
    secondary: "#14532D",
    accent: "#BBF7D0",
    bg: "#F0FAF4",
    text: "#0F172A",
  },
  {
    name: "Sunset Orange",
    primary: "#EA580C",
    secondary: "#7C2D12",
    accent: "#FED7AA",
    bg: "#FFF7ED",
    text: "#0F172A",
  },
  {
    name: "Ocean Teal",
    primary: "#0891B2",
    secondary: "#164E63",
    accent: "#CFFAFE",
    bg: "#F0FDFE",
    text: "#0F172A",
  },
  {
    name: "Deep Purple",
    primary: "#7C3AED",
    secondary: "#4C1D95",
    accent: "#DDD6FE",
    bg: "#F5F3FF",
    text: "#0F172A",
  },
  {
    name: "Rose Pink",
    primary: "#E11D48",
    secondary: "#881337",
    accent: "#FECDD3",
    bg: "#FFF1F2",
    text: "#0F172A",
  },
];

interface ColorPresetsProps {
  onSelect: (preset: Partial<ThemeConfig>) => void;
}
const ColorPresets = ({ onSelect }: ColorPresetsProps) => (
  <div className="flex gap-2 flex-wrap justify-center">
    {COLOR_PRESETS.map((preset) => (
      <button
        key={preset.name}
        onClick={() => onSelect(preset)}
        className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border border-slate-400 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-800"
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: preset.primary,
            display: "inline-block",
            border: "2px solid white",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        />
        <span className="hidden sm:inline">{preset.name}</span>
      </button>
    ))}
  </div>
);

interface TemplateGridProps {
  active: number;
  setActive: (id: number) => void;
  themes: ThemesMap;
  pData: PosterData;
  uploadedImages: { url: string; caption: string }[];
  activeDg: { governorName: string; governorImage: string };
  showDgImage: boolean;
  compact?: boolean;
  isMobile?: boolean;
  onSelect?: () => void;
}
const TemplateGrid = ({
  active,
  setActive,
  themes,
  pData,
  uploadedImages,
  activeDg,
  showDgImage,
  compact = false,
  isMobile = false,
  onSelect,
}: TemplateGridProps) => (
  <div className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2"}`}>
    {TEMPLATE_META.map((tmpl) => {
      const T = TEMPLATE_RENDERERS[tmpl.id];
      const tTheme = themes[tmpl.id];
      const isHorizontal = [9, 10].includes(tmpl.id);
      const w = isHorizontal ? 848 : [1, 2, 7, 8].includes(tmpl.id) ? 600 : 480;
      const thumbW = compact ? 72 : 130;
      const scale = thumbW / w;
      const previewH = compact ? 52 : 110;
      return (
        <div
          key={tmpl.id}
          onClick={() => {
            setActive(tmpl.id);
            if (isMobile && onSelect) onSelect();
          }}
          className="cursor-pointer rounded-lg overflow-hidden transition-all duration-200"
          style={{
            border: `2px solid ${active === tmpl.id ? "#2563EB" : "#94a3b8"}`,
            boxShadow:
              active === tmpl.id
                ? "0 0 0 3px rgba(37,99,235,0.18)"
                : "0 1px 4px rgba(0,0,0,0.1)",
            transform: active === tmpl.id ? "translateY(-2px)" : "none",
          }}
        >
          <div
            style={{
              height: previewH,
              overflow: "hidden",
              position: "relative",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: w,
                pointerEvents: "none",
              }}
            >
              <T
                key={activeDg.governorImage}
                d={pData}
                theme={tTheme}
                uploadedImages={uploadedImages}
                dgImage={activeDg.governorImage}
                dgName={activeDg.governorName}
                showDgImage={showDgImage}
              />
            </div>
            {active === tmpl.id && (
              <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                ✓
              </div>
            )}
          </div>
          {!compact && (
            <div
              className={`px-2 py-1.5 ${active === tmpl.id ? "bg-blue-600" : "bg-white"}`}
            >
              <div
                className={`text-sm font-bold leading-none ${active === tmpl.id ? "text-white" : "text-slate-800"}`}
              >
                {tmpl.name}
              </div>
              <div
                className={`text-xs mt-0.5 font-semibold ${active === tmpl.id ? "text-blue-100" : "text-slate-600"}`}
              >
                {tmpl.tag}
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── MULTI-IMAGE MANAGER ──────────────────────────────────────────────────────
interface MultiImageManagerProps {
  images: { url: string; caption: string }[];
  onAdd: (url: string, caption: string) => void;
  onRemove: (index: number) => void;
  onCaptionChange: (index: number, caption: string) => void;
}
const MultiImageManager = ({
  images,
  onAdd,
  onRemove,
  onCaptionChange,
}: MultiImageManagerProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => onAdd(ev.target?.result as string, "");
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-bold text-slate-800 leading-none">
          Upload Images
        </label>
        <label className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer border border-blue-400 rounded-lg px-2 py-1 hover:bg-blue-50 transition-colors">
          + Add
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {images.length === 0 ? (
        <label className="flex items-center justify-center border border-dashed border-slate-400 rounded-md bg-white cursor-pointer text-sm text-slate-500 hover:border-blue-500 hover:bg-blue-50 transition-colors h-9 gap-1.5 w-full max-w-xs">
          📷 Upload image(s)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 w-44 sm:w-48 shrink-0"
            >
              <img
                src={img.url}
                alt=""
                className="w-8 h-8 object-cover rounded border border-slate-300 shrink-0"
              />
              <input
                type="text"
                value={img.caption}
                onChange={(e) => onCaptionChange(i, e.target.value)}
                placeholder={`Caption ${i + 1}`}
                className="flex-1 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-slate-900 bg-white outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
              />
              <button
                onClick={() => onRemove(i)}
                className="shrink-0 text-red-400 hover:text-red-600 font-bold text-sm leading-none"
              >
                ✕
              </button>
            </div>
          ))}
          <label
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-dashed border-blue-400 bg-blue-50 cursor-pointer text-blue-600 text-lg hover:bg-blue-100 transition-colors self-center shrink-0"
            title="Add more images"
          >
            +
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

// ─── FORM SECTION ─────────────────────────────────────────────────────────────
interface FormSectionProps {
  form: FormData;
  districtInput: string;
  customDgName: string;
  customDgImage: string;
  uploadedImages: { url: string; caption: string }[];
  errors: Record<string, string | undefined>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleClubChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDgImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDistrictInput: (v: string) => void;
  setCustomDgName: (v: string) => void;
  onAddImage: (url: string, caption: string) => void;
  onRemoveImage: (index: number) => void;
  onCaptionChange: (index: number, caption: string) => void;
}

const FormSection = ({
  form,
  districtInput,
  customDgName,
  customDgImage,
  uploadedImages,
  errors,
  handleChange,
  handleClubChange,
  handleDgImageUpload,
  setDistrictInput,
  setCustomDgName,
  onAddImage,
  onRemoveImage,
  onCaptionChange,
}: FormSectionProps) => {
  const inputCls = (name: string) =>
    `w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-500 bg-white outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[name] ? "border-red-500 bg-red-50" : ""}`;
  const autoFilled =
    "border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 bg-slate-100 truncate flex items-center";
  const showDgField =
    districtInput.trim() !== "" && !KNOWN_DISTRICTS[districtInput];

  const DgNameField = () => (
    <Field
      label={
        <>
          DG Name{" "}
          <span className="text-amber-600 font-normal">⚠ not found</span>
        </>
      }
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={customDgName}
          onChange={(e) => setCustomDgName(e.target.value)}
          placeholder="DG Full Name"
          className={inputCls("dgName") + " flex-1 min-w-0"}
        />
        <label className="flex items-center justify-center border border-black border-dashed rounded-md px-3 bg-white cursor-pointer text-sm text-slate-700 hover:border-blue-600 hover:bg-blue-50 transition-colors shrink-0 h-[38px] gap-1 font-semibold">
          📷 {customDgImage ? "✓" : "Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleDgImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </Field>
  );

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden xl:block space-y-3">
        <div className="grid grid-cols-5 gap-4">
          <Field label="Select Club">
            <select
              value={form.clubNumber}
              onChange={handleClubChange}
              className={inputCls("clubNumber")}
            >
              <option value="">— Select Club —</option>
              {CLUBS.map((c) => (
                <option key={c.clubNumber} value={c.clubNumber}>
                  {c.clubNumber} · {c.clubName}
                </option>
              ))}
              <option value="custom">Other / Custom</option>
            </select>
          </Field>
          <Field label="Club Name">
            {form.clubNumber === "custom" ? (
              <input
                type="text"
                name="clubName"
                value={form.clubName}
                onChange={handleChange}
                placeholder="Club name"
                className={inputCls("clubName")}
              />
            ) : (
              <div className={autoFilled}>
                {form.clubName || (
                  <span className="text-slate-500">Auto-filled</span>
                )}
              </div>
            )}
          </Field>
          <Field label="Event Title" required>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rotary AI Hub Launching"
              className={inputCls("title")}
            />
          </Field>
          <Field label="Date" required>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls("date")}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputCls("time")}
            />
          </Field>
        </div>
        {form.clubNumber === "custom" && (
          <div className="grid grid-cols-5 gap-4">
            <Field label="District No.">
              <input
                type="text"
                value={districtInput}
                onChange={(e) => {
                  setDistrictInput(e.target.value);
                  setCustomDgName("");
                }}
                placeholder="e.g. 3150"
                className={inputCls("district")}
              />
            </Field>
            {showDgField && (
              <Field
                label={
                  <>
                    DG Name{" "}
                    <span className="text-amber-600 font-normal">
                      ⚠ not found
                    </span>
                  </>
                }
                className="col-span-2"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDgName}
                    onChange={(e) => setCustomDgName(e.target.value)}
                    placeholder="DG Full Name"
                    className={inputCls("dgName") + " flex-1 min-w-0"}
                  />
                  <label className="flex items-center justify-center border border-black border-dashed rounded-md px-3 bg-white cursor-pointer text-sm text-slate-700 hover:border-blue-600 hover:bg-blue-50 transition-colors shrink-0 h-[38px] gap-1 font-semibold">
                    📷 {customDgImage ? "✓" : "Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDgImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </Field>
            )}
          </div>
        )}
        <div className="grid grid-cols-5 gap-4">
          <Field label="Subtitle" className="col-span-2">
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Brief description"
              className={inputCls("subtitle")}
            />
          </Field>
          <Field label="Venue" required className="col-span-3">
            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="Hotel / Venue, City"
              className={inputCls("place")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <Field label="Chief Guest">
            <input
              type="text"
              name="speakerName"
              value={form.speakerName}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls("speakerName")}
            />
          </Field>
          <Field label="Designation">
            <input
              type="text"
              name="speakerDesignation"
              value={form.speakerDesignation}
              onChange={handleChange}
              placeholder="e.g. District Governor"
              className={inputCls("speakerDesignation")}
            />
          </Field>
          <Field label="Contact Name">
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Contact person"
              className={inputCls("contactName")}
            />
          </Field>
          <Field label="Contact Phone" className="col-span-2">
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={inputCls("contactPhone")}
            />
          </Field>
        </div>
        <MultiImageManager
          images={uploadedImages}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
          onCaptionChange={onCaptionChange}
        />
      </div>

      {/* LAPTOP */}
      <div className="hidden lg:block xl:hidden space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <Field label="Select Club">
            <select
              value={form.clubNumber}
              onChange={handleClubChange}
              className={inputCls("clubNumber")}
            >
              <option value="">— Select Club —</option>
              {CLUBS.map((c) => (
                <option key={c.clubNumber} value={c.clubNumber}>
                  {c.clubNumber} · {c.clubName}
                </option>
              ))}
              <option value="custom">Other / Custom</option>
            </select>
          </Field>
          <Field label="Club Name">
            {form.clubNumber === "custom" ? (
              <input
                type="text"
                name="clubName"
                value={form.clubName}
                onChange={handleChange}
                placeholder="Club name"
                className={inputCls("clubName")}
              />
            ) : (
              <div className={autoFilled}>
                {form.clubName || (
                  <span className="text-slate-500">Auto-filled</span>
                )}
              </div>
            )}
          </Field>
          <Field label="Event Title" required>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rotary AI Hub Launching"
              className={inputCls("title")}
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Brief description"
              className={inputCls("subtitle")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Date" required>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls("date")}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputCls("time")}
            />
          </Field>
          <Field label="Venue" required className="col-span-2">
            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="Hotel / Venue, City"
              className={inputCls("place")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Chief Guest">
            <input
              type="text"
              name="speakerName"
              value={form.speakerName}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls("speakerName")}
            />
          </Field>
          <Field label="Designation">
            <input
              type="text"
              name="speakerDesignation"
              value={form.speakerDesignation}
              onChange={handleChange}
              placeholder="Designation"
              className={inputCls("speakerDesignation")}
            />
          </Field>
          <Field label="Contact Name">
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Contact person"
              className={inputCls("contactName")}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={inputCls("contactPhone")}
            />
          </Field>
        </div>
        <MultiImageManager
          images={uploadedImages}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
          onCaptionChange={onCaptionChange}
        />
      </div>

      {/* TABLET */}
      <div className="hidden sm:block lg:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Select Club">
            <select
              value={form.clubNumber}
              onChange={handleClubChange}
              className={inputCls("clubNumber")}
            >
              <option value="">— Select Club —</option>
              {CLUBS.map((c) => (
                <option key={c.clubNumber} value={c.clubNumber}>
                  {c.clubNumber} · {c.clubName}
                </option>
              ))}
              <option value="custom">Other / Custom</option>
            </select>
          </Field>
          <Field label="Club Name">
            {form.clubNumber === "custom" ? (
              <input
                type="text"
                name="clubName"
                value={form.clubName}
                onChange={handleChange}
                placeholder="Club name"
                className={inputCls("clubName")}
              />
            ) : (
              <div className={autoFilled}>
                {form.clubName || (
                  <span className="text-slate-500">Auto-filled</span>
                )}
              </div>
            )}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Event Title" required>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Event title"
              className={inputCls("title")}
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Brief description"
              className={inputCls("subtitle")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date" required>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls("date")}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputCls("time")}
            />
          </Field>
          <Field label="Venue" required>
            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="Venue, City"
              className={inputCls("place")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Contact Name">
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Contact person"
              className={inputCls("contactName")}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={inputCls("contactPhone")}
            />
          </Field>
        </div>
        <MultiImageManager
          images={uploadedImages}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
          onCaptionChange={onCaptionChange}
        />
      </div>

      {/* MOBILE */}
      <div className="sm:hidden space-y-3">
        <Field label="Select Club">
          <select
            value={form.clubNumber}
            onChange={handleClubChange}
            className={inputCls("clubNumber")}
          >
            <option value="">— Select Club —</option>
            {CLUBS.map((c) => (
              <option key={c.clubNumber} value={c.clubNumber}>
                {c.clubNumber} · {c.clubName}
              </option>
            ))}
            <option value="custom">Other / Custom</option>
          </select>
        </Field>
        <Field label="Club Name">
          {form.clubNumber === "custom" ? (
            <input
              type="text"
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              placeholder="Enter club name"
              className={inputCls("clubName")}
            />
          ) : (
            <div className={autoFilled}>
              {form.clubName || (
                <span className="text-slate-500">Auto-filled</span>
              )}
            </div>
          )}
        </Field>
        {form.clubNumber === "custom" && (
          <>
            <Field label="District No.">
              <input
                type="text"
                value={districtInput}
                onChange={(e) => {
                  setDistrictInput(e.target.value);
                  setCustomDgName("");
                }}
                placeholder="e.g. 3150"
                className={inputCls("district")}
              />
            </Field>
            {showDgField && <DgNameField />}
          </>
        )}
        <Field label="Event Title" required>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Rotary AI Hub Launching"
            className={inputCls("title")}
          />
        </Field>
        <Field label="Subtitle">
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Brief description (optional)"
            className={inputCls("subtitle")}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" required>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls("date")}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputCls("time")}
            />
          </Field>
        </div>
        <Field label="Venue" required>
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            placeholder="Hotel Grand Ballroom, Mumbai"
            className={inputCls("place")}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Chief Guest">
            <input
              type="text"
              name="speakerName"
              value={form.speakerName}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls("speakerName")}
            />
          </Field>
          <Field label="Designation">
            <input
              type="text"
              name="speakerDesignation"
              value={form.speakerDesignation}
              onChange={handleChange}
              placeholder="Designation"
              className={inputCls("speakerDesignation")}
            />
          </Field>
        </div>
        <MultiImageManager
          images={uploadedImages}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
          onCaptionChange={onCaptionChange}
        />
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RotaryPosterStudio() {
  const html2canvasLoaded = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  );
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userId");

  const [active, setActive] = useState<number>(1);
  const [form, setForm] = useState<FormData>({
    clubNumber: "",
    clubName: "",
    customClubNumber: "",
    date: "",
    time: "",
    place: "",
    title: "",
    subtitle: "",
    speakerName: "",
    speakerDesignation: "",
    contactName: "",
    contactPhone: "",
    uploadedImageCaptions: [],
  });
  const [districtInput, setDistrictInput] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; caption: string }[]
  >([]);
  const [customDgImage, setCustomDgImage] = useState<string>("");
  const [customDgName, setCustomDgName] = useState<string>("");
  const [showDgImage, setShowDgImage] = useState<boolean>(false);
  const [dgPromptPending, setDgPromptPending] = useState<boolean>(false);
  const [lastPromptedDistrict, setLastPromptedDistrict] = useState<string>("");
  const [themes, setThemes] = useState<ThemesMap>(() => {
    const t: ThemesMap = {};
    (Object.keys(TEMPLATE_DEFAULTS) as unknown as number[]).forEach((k) => {
      t[k] = { ...TEMPLATE_DEFAULTS[k] };
    });
    return t;
  });
  const [downloading, setDownloading] = useState(false);
  const [errors] = useState<Record<string, string | undefined>>({});
  const posterRef = useRef<HTMLDivElement>(null);
  const [mobileTab, setMobileTab] = useState<
    "details" | "templates" | "style" | "preview"
  >("details");
  const [styleOpen, setStyleOpen] = useState(false);

  const effectiveDistrict = districtInput;
  const districtLabel = effectiveDistrict
    ? `District ${effectiveDistrict}`
    : "";
  const effectiveDistrictInfo = KNOWN_DISTRICTS[effectiveDistrict];
  const activeDg = !effectiveDistrict
    ? { name: "", governorName: "", governorImage: "" }
    : effectiveDistrictInfo
      ? effectiveDistrictInfo
      : {
          name: effectiveDistrict ? `District ${effectiveDistrict}` : "",
          governorName: customDgName,
          governorImage: customDgImage,
        };

  useEffect(() => {
    if (
      effectiveDistrict &&
      activeDg.governorImage &&
      effectiveDistrict !== lastPromptedDistrict
    ) {
      setDgPromptPending(true);
      setLastPromptedDistrict(effectiveDistrict);
    }
    if (!effectiveDistrict) {
      setShowDgImage(false);
      setLastPromptedDistrict("");
    }
  }, [effectiveDistrict, activeDg.governorImage]);

  const currentTheme = themes[active];

  const updateTheme = useCallback(
    (key: string, val: string | number) => {
      setThemes((prev) => ({
        ...prev,
        [active]: {
          ...prev[active],
          [key]:
            typeof val === "string" && val !== "" && !isNaN(Number(val))
              ? Number(val)
              : val,
        },
      }));
    },
    [active],
  );

  const resetTheme = useCallback(() => {
    setThemes((prev) => ({
      ...prev,
      [active]: { ...TEMPLATE_DEFAULTS[active] },
    }));
  }, [active]);

  const applyPreset = useCallback(
    (preset: Partial<ThemeConfig>) => {
      setThemes((prev) => ({
        ...prev,
        [active]: { ...prev[active], ...preset },
      }));
    },
    [active],
  );

  const handleClubChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "custom") {
        setForm((p) => ({
          ...p,
          clubNumber: "custom",
          clubName: "",
          customClubNumber: "",
        }));
      } else {
        const club = CLUBS.find((c) => c.clubNumber === val);
        setForm((p) => ({
          ...p,
          clubNumber: val,
          clubName: club?.clubName || "",
          customClubNumber: "",
        }));
        setDistrictInput(val);
      }
    },
    [],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
    },
    [],
  );

  const handleDgImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setCustomDgImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    [],
  );

  const onAddImage = useCallback((url: string, caption: string) => {
    setUploadedImages((prev) => [...prev, { url, caption }]);
  }, []);
  const onRemoveImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const onCaptionChange = useCallback((index: number, caption: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img)),
    );
  }, []);

  const setDistrictInputCb = useCallback(
    (v: string) => setDistrictInput(v),
    [],
  );
  const setCustomDgNameCb = useCallback((v: string) => setCustomDgName(v), []);

  const effectiveClubNumber =
    form.clubNumber === "custom" ? form.customClubNumber : form.clubNumber;
  const pData: PosterData = {
    ...form,
    clubNumber: effectiveClubNumber,
    dateFormatted: fmtDate(form.date),
    timeFormatted: fmtTime(form.time),
    districtLabel,
  } as any;

  const Tmpl = TEMPLATE_RENDERERS[active];
  const tmplMeta = TEMPLATE_META.find((t) => t.id === active);

  const handleDownload = async () => {
    if (!html2canvasLoaded) {
      alert(
        "Download library not yet loaded, please wait a moment and try again.",
      );
      return;
    }
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await window.html2canvas(posterRef.current, {
        scale: 2,
        allowTaint: false,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to generate image. Please try again.");
          setDownloading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `rotary-poster-${form.title?.replace(/\s+/g, "-") || "event"}-template${active}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      alert("Download failed. Please try again.");
      setDownloading(false);
    }
  };

  const getPosterScale = () => {
    const isHorizontal = [9, 10].includes(active);
    const posterW = isHorizontal
      ? 848
      : [1, 2, 7, 8].includes(active)
        ? 600
        : 480;
    const availW = isMobile
      ? windowWidth - 32
      : isTablet
        ? windowWidth - 380
        : windowWidth - 680;
    return Math.min(1, availW / posterW);
  };

  const posterScale = getPosterScale();
  const isHorizontal = [9, 10].includes(active);
  const posterW = isHorizontal
    ? 848
    : [1, 2, 7, 8].includes(active)
      ? 600
      : 480;

  const formSectionProps: FormSectionProps = {
    form,
    districtInput,
    customDgName,
    customDgImage,
    uploadedImages,
    errors,
    handleChange,
    handleClubChange,
    handleDgImageUpload,
    setDistrictInput: setDistrictInputCb,
    setCustomDgName: setCustomDgNameCb,
    onAddImage,
    onRemoveImage,
    onCaptionChange,
  };

  const templateGridProps = {
    active,
    setActive,
    themes,
    pData,
    uploadedImages,
    activeDg: {
      governorName: activeDg.governorName,
      governorImage: activeDg.governorImage,
    },
    showDgImage,
  };

  const DownloadBtn = ({ full = false }: { full?: boolean }) => (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`${full ? "w-full" : ""} bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl py-3 text-sm shadow transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2`}
    >
      {downloading ? (
        <>
          <span className="animate-spin inline-block">⏳</span> Generating...
        </>
      ) : (
        "⬇ Download PNG"
      )}
    </button>
  );

  // ── MOBILE ──
  if (isMobile) {
    return (
      <div
        className="min-h-screen bg-slate-100 flex flex-col"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {dgPromptPending && (
          <DgImagePrompt
            districtName={activeDg.name || districtLabel}
            onYes={() => {
              setShowDgImage(true);
              setDgPromptPending(false);
            }}
            onNo={() => {
              setShowDgImage(false);
              setDgPromptPending(false);
            }}
          />
        )}
        <header className="bg-white border-b-2 border-slate-300 px-3 py-2 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-lg shadow">
              🎨
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs leading-none">
                Rotary Poster
              </div>
              <div className="text-slate-500 text-xs mt-0.5">10 Templates</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate("/rotarydistrict3150AiAgent")}
              className="text-xs bg-purple-100 text-purple-800 border border-purple-300 font-bold px-2 py-1.5 rounded-lg transition-all"
            >
              💬
            </button>
            <button
              onClick={() =>
                navigate(
                  isLoggedIn ? "/main/services/myrotary" : "/services/myrotary",
                )
              }
              className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-1.5 rounded-lg transition-all"
            >
              🏠
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow transition-all active:scale-95 disabled:opacity-60 flex items-center gap-1"
            >
              {downloading ? <span className="animate-spin">⏳</span> : "⬇"}{" "}
              {downloading ? "..." : "PNG"}
            </button>
          </div>
        </header>
        <div className="bg-white border-b-2 border-slate-300 flex sticky top-[57px] z-20 shadow-sm">
          {(["details", "templates", "style", "preview"] as const).map(
            (tab) => {
              const labels = {
                details: "📋 Details",
                templates: "🎨 Templates",
                style: "🖌️ Style",
                preview: "👁 Preview",
              };
              return (
                <button
                  key={tab}
                  onClick={() => setMobileTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-bold transition-all border-b-2 ${mobileTab === tab ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-slate-700"}`}
                >
                  {labels[tab]}
                </button>
              );
            },
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {mobileTab === "details" && (
            <div className="p-4">
              <h3 className="text-base font-extrabold uppercase tracking-widest mb-3 text-blue-700">
                Event Details
              </h3>
              <FormSection {...formSectionProps} />
            </div>
          )}
          {mobileTab === "templates" && (
            <div className="p-4">
              <h3 className="text-base font-extrabold uppercase tracking-widest mb-3 text-blue-700">
                Choose Template
              </h3>
              <TemplateGrid
                {...templateGridProps}
                isMobile
                onSelect={() => setMobileTab("preview")}
              />
            </div>
          )}
          {mobileTab === "style" && (
            <div className="p-4">
              <StyleControls
                currentTheme={currentTheme}
                updateTheme={updateTheme}
                resetTheme={resetTheme}
              />
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
                  Color Presets
                </p>
                <ColorPresets onSelect={applyPreset} />
              </div>
              <div className="mt-4">
                <DownloadBtn full />
              </div>
            </div>
          )}
          {mobileTab === "preview" && (
            <div className="p-4 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Preview
                  </p>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    {tmplMeta?.name}
                  </h2>
                </div>
                <div className="flex gap-1">
                  {TEMPLATE_META.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setActive(tmpl.id)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: active === tmpl.id ? 20 : 6,
                        height: 6,
                        background: active === tmpl.id ? "#2563EB" : "#94a3b8",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: posterW * posterScale,
                    position: "relative",
                    borderRadius: 12,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    outline: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <div
                    ref={posterRef}
                    style={{
                      width: posterW,
                      transform: `scale(${posterScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Tmpl
                      key={activeDg.governorImage}
                      d={pData}
                      theme={currentTheme}
                      uploadedImages={uploadedImages}
                      dgImage={activeDg.governorImage}
                      dgName={activeDg.governorName}
                      showDgImage={showDgImage}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full max-w-xs">
                <DownloadBtn full />
              </div>
              <div className="mt-4 w-full">
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 text-center">
                  Quick Presets
                </p>
                <ColorPresets onSelect={applyPreset} />
              </div>
              <div className="mt-4 w-full">
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Other Templates
                </p>
                <TemplateGrid
                  {...templateGridProps}
                  compact
                  isMobile
                  onSelect={() => setMobileTab("preview")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── TABLET ──
  if (isTablet) {
    return (
      <div
        className="min-h-screen bg-slate-100 flex flex-col"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {dgPromptPending && (
          <DgImagePrompt
            districtName={activeDg.name || districtLabel}
            onYes={() => {
              setShowDgImage(true);
              setDgPromptPending(false);
            }}
            onNo={() => {
              setShowDgImage(false);
              setDgPromptPending(false);
            }}
          />
        )}
        <header className="bg-white border-b-2 border-slate-300 px-5 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-xl shadow">
              🎨
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base leading-none">
                Rotary Poster Designer
              </div>
              <div className="text-slate-700 text-sm font-bold tracking-wide uppercase mt-0.5">
                10 Templates
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate("/rotarydistrict3150AiAgent")}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl shadow transition-all"
            >
              💬 Chat Agent 3150
            </button>
            <button
              onClick={() =>
                navigate(
                  isLoggedIn ? "/main/services/myrotary" : "/services/myrotary",
                )
              }
              className="text-sm bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl shadow transition-all"
            >
              🏠 Rotary Home
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {downloading ? <span className="animate-spin">⏳</span> : "⬇"}{" "}
              {downloading ? "Generating..." : "Download PNG"}
            </button>
          </div>
        </header>
        <div className="bg-white border-b-2 border-slate-300 px-5 py-4 shadow-sm">
          <h3 className="text-base font-extrabold uppercase tracking-widest mb-3 text-blue-700">
            Event Details →
          </h3>
          <FormSection {...formSectionProps} />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 shrink-0 bg-white border-r-2 border-slate-300 flex flex-col overflow-y-auto">
            <div className="p-4 border-b-2 border-slate-200">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
                Templates
              </p>
              <TemplateGrid {...templateGridProps} />
            </div>
            <div className="p-4">
              <button
                onClick={() => setStyleOpen(!styleOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 hover:text-blue-700 transition-colors"
              >
                <span>Style Controls</span>
                <span className="text-lg">{styleOpen ? "▲" : "▼"}</span>
              </button>
              {styleOpen && (
                <>
                  <StyleControls
                    currentTheme={currentTheme}
                    updateTheme={updateTheme}
                    resetTheme={resetTheme}
                  />
                  <div className="mt-4">
                    <DownloadBtn full />
                  </div>
                </>
              )}
            </div>
          </div>
          <main className="flex-1 bg-slate-100 overflow-auto p-4 flex flex-col items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold text-slate-900">
                  {tmplMeta?.name}{" "}
                  <span className="text-sm font-bold text-slate-600">
                    {tmplMeta?.tag}
                  </span>
                </h2>
                <div className="flex gap-1.5">
                  {TEMPLATE_META.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setActive(tmpl.id)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: active === tmpl.id ? 24 : 8,
                        height: 8,
                        background: active === tmpl.id ? "#2563EB" : "#94a3b8",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  style={{
                    width: posterW * posterScale,
                    position: "relative",
                    borderRadius: 12,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    outline: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <div
                    ref={posterRef}
                    style={{
                      width: posterW,
                      transform: `scale(${posterScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Tmpl
                      key={activeDg.governorImage}
                      d={pData}
                      theme={currentTheme}
                      uploadedImages={uploadedImages}
                      dgImage={activeDg.governorImage}
                      dgName={activeDg.governorName}
                      showDgImage={showDgImage}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 text-center">
                  Quick Color Presets
                </p>
                <ColorPresets onSelect={applyPreset} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── DESKTOP ──
  return (
    <div
      className="min-h-screen bg-slate-100 font-sans flex flex-col"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {dgPromptPending && (
        <DgImagePrompt
          districtName={activeDg.name || districtLabel}
          onYes={() => {
            setShowDgImage(true);
            setDgPromptPending(false);
          }}
          onNo={() => {
            setShowDgImage(false);
            setDgPromptPending(false);
          }}
        />
      )}
      <header className="bg-white border-b-2 border-slate-300 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-xl shadow">
            🎨
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-lg leading-none">
              Rotary Poster Designer
            </div>
            <div className="text-slate-700 text-sm font-bold tracking-wide uppercase mt-0.5">
              District Levels · 10 Templates
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate("/rotarydistrict3150AiAgent")}
            className="text-sm bg-purple-100 text-purple-800 border border-purple-400 hover:bg-purple-200 font-bold px-4 py-2 rounded-xl transition-all hidden lg:inline-block"
          >
            💬 Agent 3150
          </button>
          <button
            onClick={() =>
              navigate(
                isLoggedIn ? "/main/services/myrotary" : "/services/myrotary",
              )
            }
            className="text-sm bg-amber-100 text-amber-800 border border-amber-400 hover:bg-amber-200 font-bold px-4 py-2 rounded-xl transition-all hidden lg:inline-block"
          >
            🏠 Home
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="ml-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-bold px-5 py-2 rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
          >
            {downloading ? <span className="animate-spin">⏳</span> : "⬇"}{" "}
            {downloading ? "Generating..." : "Download PNG"}
          </button>
        </div>
      </header>
      <div className="bg-white border-b-2 border-slate-300 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-base font-extrabold uppercase tracking-widest mb-3 text-blue-700">
            Enter Event Details →
          </h3>
          <FormSection {...formSectionProps} />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden max-w-full">
        <div className="w-72 xl:w-80 shrink-0 bg-white border-r-2 border-slate-300 flex flex-col overflow-y-auto">
          <div className="p-4 border-b-2 border-slate-200">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
              Choose Template
            </p>
            <TemplateGrid {...templateGridProps} />
          </div>
          <div className="p-4 flex-1">
            <StyleControls
              currentTheme={currentTheme}
              updateTheme={updateTheme}
              resetTheme={resetTheme}
            />
            <div className="mt-4">
              <DownloadBtn full />
            </div>
            <p className="text-center text-sm font-semibold text-slate-600 mt-2">
              High-resolution 2× export
            </p>
          </div>
        </div>
        <main className="flex-1 bg-slate-100 overflow-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                  Live Preview
                </p>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {tmplMeta?.name}
                  <span className="ml-2 text-base font-bold text-slate-600">
                    {tmplMeta?.tag}
                  </span>
                </h2>
              </div>
              <div className="flex gap-1.5">
                {TEMPLATE_META.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setActive(tmpl.id)}
                    title={tmpl.name}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: active === tmpl.id ? 28 : 8,
                      height: 8,
                      background: active === tmpl.id ? "#2563EB" : "#94a3b8",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-b from-blue-100 to-transparent rounded-3xl opacity-60 blur-xl pointer-events-none" />
                <div
                  className="relative shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-300"
                  style={{ width: posterW * posterScale }}
                >
                  <div
                    ref={posterRef}
                    style={{
                      width: posterW,
                      transform: `scale(${posterScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Tmpl
                      key={activeDg.governorImage}
                      d={pData}
                      theme={currentTheme}
                      uploadedImages={uploadedImages}
                      dgImage={activeDg.governorImage}
                      dgName={activeDg.governorName}
                      showDgImage={showDgImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 text-center">
                Quick Color Presets
              </p>
              <ColorPresets onSelect={applyPreset} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
