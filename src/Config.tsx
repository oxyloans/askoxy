// const userType = "live"

// const BASE_URL = userType === "live" 
//     ? "https://meta.oxyloans.com/api" 
//     : "https://meta.oxyglobal.tech/api";

// export default BASE_URL;

const userType = localStorage.getItem("userType") || "live";

const BASE_URL =
  userType === "live"
    ? "https://meta.oxyloans.com/api"
    : "https://meta.oxyglobal.tech/api";

const DEFAULT_CART_AGENT_BASE = `${BASE_URL}/cart-service/agent`;

/**
 * Cart agent APIs (offers, chat) — always local cart-management-service in dev.
 * REACT_APP_CART_AGENT_BASE may override (e.g. /local-api/... via setupProxy.js).
 * Production meta URLs are ignored so offers never call meta.oxyloans.com.
 */
export function resolveCartAgentBase(): string {
  const fromEnv = process.env.REACT_APP_CART_AGENT_BASE?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  return DEFAULT_CART_AGENT_BASE;
}

export const CART_AGENT_LOCAL_BASE = resolveCartAgentBase();
    
// encrypted URL
const encryptedUploadUrl =
"aHR0cHM6Ly9veHlicmlja3N2MS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vbnVsbC80NTg4MGU2Mi1hY2FmLTQ2NDUtYTgzZS1kMWM4NDk4ZTkyM2U="

// decrypt function
export const uploadurlwithId = atob(encryptedUploadUrl);

// export const uploadurlwithId = "d15sy6qj2uhi5q.cloudfront.net/null/45880e62-acaf-4645-a83e-d1c8498e923e";

export default BASE_URL;

export const askoxyImgUrl = () => {
  return "d15sy6qj2uhi5q.cloudfront.net";
};

export const resolveAskoxyUrl = (url?: string | null): string => {
  if (!url) return "";
  const cleanUrl = url.trim();
  if (cleanUrl.includes("askoxy.s3.ap-south-1.amazonaws.com")) {
    return cleanUrl.replace("askoxy.s3.ap-south-1.amazonaws.com", askoxyImgUrl());
  }
  if (cleanUrl.includes("oxybricksv1.s3.ap-south-1.amazonaws.com")) {
    return cleanUrl.replace("oxybricksv1.s3.ap-south-1.amazonaws.com", askoxyImgUrl());
  }
  if (cleanUrl.includes("askoxy.s3.amazonaws.com")) {
    return cleanUrl.replace("askoxy.s3.amazonaws.com", askoxyImgUrl());
  }
  if (cleanUrl.startsWith("/")) {
    return `https://${askoxyImgUrl()}${cleanUrl}`;
  }
  if (!/^https?:\/\//i.test(cleanUrl) && !cleanUrl.startsWith("data:") && !cleanUrl.startsWith("static/")) {
    return `https://${askoxyImgUrl()}/${cleanUrl}`;
  }
  return cleanUrl;
};

