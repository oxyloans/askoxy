import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  X,
  Mic,
  Trash2,
  Sparkles,
  Loader2,
  Square,
  Package,
  MapPin,
  Home,
  ShoppingBag,
  Receipt,
  Star,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Bot,
  HelpCircle,
  UploadCloud,
  FileText,
  RefreshCcw,
  Send,
} from "lucide-react";
import { message } from "antd";
import { customerApi } from "../utils/axiosInstance";
import BASE_URL from "../Config";

interface ProductItem {
  itemId: string;
  itemName: string;
  itemMrp?: number;
  itemPrice?: number;
  itemImage?: string;
  imageUrl?: string;
  itemLogo?: string;
  units?: string;
  weight?: number | string;
  saveAmount?: number;
  savePercentage?: number;
  itemDescription?: string;
  bmvCoins?: number;
  quantity?: number | null;
  barcodeValue?: string | null;
  status?: string;
  id?: string;
  name?: string;
  price?: number | string;
  itemprice?: number | string;
  mrp?: number | string | null;
  itemUnit?: string | null;
  image?: string;
  itemUrl?: string | null;
}

function optionalNumber(value: any): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function getProductPrice(item: ProductItem): number | undefined {
  return optionalNumber(item.itemPrice) ?? optionalNumber(item.itemprice) ?? optionalNumber(item.price);
}

function getProductMrp(item: ProductItem): number | undefined {
  return optionalNumber(item.itemMrp) ?? optionalNumber(item.mrp);
}

interface ProductCategory {
  categoryName?: string;
  categoryLogo?: string;
  itemsResponseDtoList?: ProductItem[];
}

interface WalletTransaction {
  id?: string;
  amount?: number | string | null;
  transactionType?: string | null;
  description?: string | null;
  createdAt?: string | null;
  status?: string | null;
}

interface WalletResponse {
  walletAmount?: number | string | null;
  walletTransactions?: WalletTransaction[];
  status?: boolean;
}

interface ProfileResponse {
  email?: string | null;
  address?: string | null;
  id?: string | null;
  mobileNumber?: string | null;
  isActive?: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  flatNo?: string | null;
  whatsappNumber?: string | null;
  errorMessage?: string | null;
  alterMobileNumber?: string | null;
  mobileVerified?: boolean | null;
  whatsappVerified?: boolean | null;
  countryCode?: string | null;
  pincode?: string | null;
  created_at?: string | null;
}

interface AddressItem {
  flatNo?: string | null;
  landMark?: string | null;
  pincode?: string | null;
  area?: string | null;
  address?: string | null;
  residenceName?: string | null;
  houseType?: string | null;
  addressType?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  userId?: string | null;
  id: string;
  createdAt?: string | null;
}

interface CartItem {
  itemName?: string;
  units?: string;
  priceMrp?: number;
  itemPrice?: number;
  weight?: number | string;
  saveAmount?: number;
  cartQuantity?: number;
  savePercentage?: number;
  quantity?: number;
  status?: string;
  image?: string;
  totalPrice?: number;
  itemId?: string;
  gstAmount?: number;
  cartId?: string;
  deliveryBoyFee?: number | null;
  itemUrl?: string | null;
  goldMakingCost?: number;
  goldGst?: number;
  goldMakingCostAndGst?: number;
  itemDiscountedBackPrice?: number;
  combo?: boolean;
}

interface CartResponse {
  errorMessage?: string | null;
  offerElgible?: boolean | null;
  customerCartResponseList?: CartItem[];
  totalCartValue?: number;
  freeItemPriceTotal?: number;
  amountToPay?: number;
  discountedByFreeItems?: number;
  totalGstAmountToPay?: number;
}

interface PreviousOrder {
  orderId?: string;
  orderStatus?: string | number;
  newOrderId?: string | null;
  subTotal?: number;
  grandTotal?: number;
  deliveryFee?: number;
  paymentStatus?: string | null;
  paymentType?: number | string | null;
  orderDate?: string | null;
  expectedDeliveryDate?: string | null;
  timeSlot?: string | null;
  dayOfWeek?: string | null;
  message?: string | null;
  reason?: string | null;
  invoiceUrl?: string | null;
}

interface SubscriptionPlan {
  amount?: number;
  getAmount?: number;
  planId?: string;
  limitAmount?: number;
  status?: boolean;
}

interface VoiceMessage {
  id: string;
  type:
    | "user"
    | "ai"
    | "loading"
    | "products"
    | "bestMatch"
    | "addresses"
    | "cart"
    | "orders"
    | "subscriptions"
    | "wallet"
    | "profile"
    | "addressConfirm";
  text?: string;
  responseType?: string;
  data?:
    | ProductCategory[]
    | AddressItem[]
    | CartResponse
    | ProductItem
    | ProductItem[]
    | PreviousOrder[]
    | SubscriptionPlan[]
    | WalletResponse
    | ProfileResponse;
  createdAt: Date;
}

interface VoiceWindowProps {
  onClose: () => void;
}

const VOICE_API_URL = `${BASE_URL}/product-service/voice-assistance`;

const SILENCE_LIMIT_MS = 4000;
const MIN_RECORDING_MS = 1200;

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function toNumber(value?: number | string) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalizeProduct(item: any): ProductItem | null {
  if (!item || typeof item !== "object") return null;

  const itemId = item.itemId || item.id;
  const itemName = item.itemName || item.name;

  if (!itemId || !itemName) return null;

  const itemPrice =
    optionalNumber(item.itemPrice) ??
    optionalNumber(item.itemprice) ??
    optionalNumber(item.price);

  const itemMrp = optionalNumber(item.itemMrp) ?? optionalNumber(item.mrp);

  return {
    ...item,
    itemId,
    itemName: String(itemName).trim(),
    itemPrice,
    itemMrp,
    itemImage: item.itemImage || item.imageUrl || item.itemLogo || item.image || item.itemUrl || "",
    imageUrl: item.imageUrl || item.itemImage || item.itemLogo || item.image || item.itemUrl || "",
    units: item.units || item.itemUnit || item.unit || "",
    itemDescription: item.itemDescription || item.description || "",
    saveAmount:
      item.saveAmount !== undefined ? toNumber(item.saveAmount) : undefined,
    savePercentage:
      item.savePercentage !== undefined
        ? toNumber(item.savePercentage)
        : undefined,
    bmvCoins: item.bmvCoins !== undefined ? toNumber(item.bmvCoins) : undefined,
    status: item.status || item.offerStatus || item.itemStatus || "",
  };
}

function parseOffersResponse(rawOffers: any): ProductCategory[] {
  if (!Array.isArray(rawOffers)) return [];

  const normalizedOffers = rawOffers
    .map((item) => normalizeProduct(item))
    .filter(Boolean) as ProductItem[];

  if (!normalizedOffers.length) return [];

  return [
    {
      categoryName: "Available Offers",
      itemsResponseDtoList: normalizedOffers,
    },
  ];
}

function flattenProducts(categories: ProductCategory[]): ProductItem[] {
  return safeArray(categories).flatMap(
    (category) =>
      safeArray(category?.itemsResponseDtoList)
        .map((item) => normalizeProduct(item))
        .filter(Boolean) as ProductItem[],
  );
}

function mergeProducts(
  previousProducts: ProductItem[],
  nextProducts: ProductItem[],
): ProductItem[] {
  const map = new Map<string, ProductItem>();

  safeArray(previousProducts).forEach((item) => {
    if (item?.itemId) map.set(item.itemId, item);
  });

  safeArray(nextProducts).forEach((item) => {
    if (item?.itemId) {
      map.set(item.itemId, {
        ...map.get(item.itemId),
        ...item,
      });
    }
  });

  return Array.from(map.values());
}

function formatCurrency(value?: number | string) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "₹0";
  return `₹${num.toFixed(2).replace(/\.00$/, "")}`;
}

function getShortDescription(text?: string, max = 110) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function getAddressLabel(address: AddressItem) {
  return address.addressType || address.houseType || "Address";
}

function getFullAddressLine(address: AddressItem) {
  return [
    address.flatNo,
    address.residenceName,
    address.address,
    address.area,
    address.landMark,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function sanitizeBase64Audio(input?: string) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/^data:audio\/[a-zA-Z0-9+.-]+;base64,/, "")
    .replace(/\s/g, "")
    .trim();
}

function base64ToUint8Array(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

function guessAudioMimeType(base64: string) {
  if (base64.startsWith("UklGR")) return "audio/wav";
  if (base64.startsWith("T2dnUw")) return "audio/ogg";
  if (base64.startsWith("SUQz") || base64.startsWith("//")) return "audio/mpeg";
  return "audio/mpeg";
}

function removeBestMatchFromCategories(
  categories: ProductCategory[],
  bestMatch?: ProductItem | null,
): ProductCategory[] {
  if (!bestMatch?.itemId) return categories;

  return safeArray(categories)
    .map((category) => ({
      ...category,
      itemsResponseDtoList: safeArray(category.itemsResponseDtoList).filter(
        (item) => normalizeProduct(item)?.itemId !== bestMatch.itemId,
      ),
    }))
    .filter((category) => safeArray(category.itemsResponseDtoList).length > 0);
}

function extractBestMatchProduct(rawBestMatch: any): ProductItem | null {
  if (!rawBestMatch) return null;

  if (Array.isArray(rawBestMatch)) {
    for (const entry of rawBestMatch) {
      if (entry && typeof entry === "object") {
        if (Array.isArray(entry.itemsResponseDtoList)) {
          const firstItem = entry.itemsResponseDtoList
            .map((item: any) => normalizeProduct(item))
            .filter(Boolean)[0] as ProductItem | undefined;
          if (firstItem) return firstItem;
        }

        const normalizedEntry = normalizeProduct(entry);
        if (normalizedEntry) return normalizedEntry;
      }
    }
    return null;
  }

  if (rawBestMatch && typeof rawBestMatch === "object") {
    if (Array.isArray(rawBestMatch.itemsResponseDtoList)) {
      return (
        (rawBestMatch.itemsResponseDtoList
          .map((item: any) => normalizeProduct(item))
          .filter(Boolean)[0] as ProductItem | undefined) || null
      );
    }

    return normalizeProduct(rawBestMatch);
  }

  return null;
}

function parseProductsResponse(
  rawProducts: any,
  bestMatch?: ProductItem | null,
): ProductCategory[] {
  if (!Array.isArray(rawProducts)) return [];

  const looksLikeCategoryList = rawProducts.some(
    (item) =>
      item &&
      typeof item === "object" &&
      Array.isArray(item.itemsResponseDtoList),
  );

  if (looksLikeCategoryList) {
    const normalizedCategories: ProductCategory[] = rawProducts.map(
      (category: any) => ({
        categoryName: category?.categoryName,
        categoryLogo: category?.categoryLogo,
        itemsResponseDtoList: safeArray(category?.itemsResponseDtoList)
          .map((item) => normalizeProduct(item))
          .filter(Boolean) as ProductItem[],
      }),
    );

    return removeBestMatchFromCategories(normalizedCategories, bestMatch);
  }

  const normalizedItems = rawProducts
    .map((item) => normalizeProduct(item))
    .filter(Boolean) as ProductItem[];

  const filteredItems = bestMatch?.itemId
    ? normalizedItems.filter((item) => item.itemId !== bestMatch.itemId)
    : normalizedItems;

  if (!filteredItems.length) return [];

  return [
    {
      categoryName: "Recommended Products",
      itemsResponseDtoList: filteredItems,
    },
  ];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatKeyLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function formatAskOxyServices(services: any[]) {
  return services
    .map((service, index) => {
      const title = service?.title || service?.name || "Service";
      const description = service?.description || service?.Description || "";
      const link =
        service?.learn_more_link ||
        service?.learnMoreLink ||
        service?.link ||
        service?.url ||
        service?.URL ||
        "";

      return (
        `${index + 1}. **${title}**\n` +
        `${description}${description ? "\n" : ""}` +
        `${link ? `[Learn More](${link})` : ""}`
      ).trim();
    })
    .join("\n\n");
}

const HIDDEN_AI_RESPONSE_KEYS = new Set([
  "type",
  "responseType",
  "actionType",
  "transcript",
  "audio",
  "file",
]);

function normalizeAiMarkdownText(text?: string) {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")
    // Keep markdown numbered lists stable even when API sends spaces like " 1. Text"
    .replace(/^\s*(\d+)\.\s+/gm, "$1. ")
    // Keep bullet lists stable
    .replace(/^\s*[-•]\s+/gm, "- ")
    // Remove extra blank lines from API response
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function formatAnyJsonToReadableText(data: any, level = 0): string {
  if (data === null || data === undefined || data === "") return "";

  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return String(data);
  }

  if (Array.isArray(data)) {
    return data
      .map((item, index) => {
        const value = formatAnyJsonToReadableText(item, level + 1).trim();
        if (!value) return "";
        return `${index + 1}. ${value}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  if (typeof data === "object") {
    const primaryText =
      data?.gptAnswer ||
      data?.displayText ||
      data?.response ||
      data?.speechText ||
      data?.message ||
      data?.answer;

    if (primaryText) {
      return extractReadableTextFromApi(primaryText);
    }

    const services = data?.info?.["ASKOXY.AI_services"];
    if (Array.isArray(services)) return formatAskOxyServices(services);

    return Object.entries(data)
      .map(([key, value]) => {
        if (HIDDEN_AI_RESPONSE_KEYS.has(key)) return "";
        if (value === null || value === undefined || value === "") return "";

        const title = formatKeyLabel(key);

        if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) {
          return `**${title}:** [Open Link](${value.trim()})`;
        }

        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return `**${title}:** ${String(value)}`;
        }

        const nested = formatAnyJsonToReadableText(value, level + 1).trim();
        if (!nested) return "";

        return `**${title}:**\n${nested}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

function stripJsonCodeFence(value: string) {
  return value
    .replace(/^\s*```json\s*/i, "")
    .replace(/^\s*```\s*/i, "")
    .replace(/```\s*$/g, "")
    .trim();
}

function extractReadableTextFromApi(value: any): string {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "object") {
    return (
      extractReadableTextFromApi(value.gptAnswer) ||
      extractReadableTextFromApi(value.response) ||
      extractReadableTextFromApi(value.displayText) ||
      extractReadableTextFromApi(value.speechText) ||
      extractReadableTextFromApi(value.message) ||
      extractReadableTextFromApi(value.answer) ||
      formatAnyJsonToReadableText(value)
    );
  }

  if (typeof value !== "string") return String(value);

  const clean = stripJsonCodeFence(value);

  try {
    const parsed = JSON.parse(clean);
    return (
      extractReadableTextFromApi(parsed?.gptAnswer) ||
      extractReadableTextFromApi(parsed?.response) ||
      extractReadableTextFromApi(parsed?.displayText) ||
      extractReadableTextFromApi(parsed?.speechText) ||
      extractReadableTextFromApi(parsed?.message) ||
      extractReadableTextFromApi(parsed?.answer) ||
      formatAnyJsonToReadableText(parsed) ||
      clean
    );
  } catch {
    return clean;
  }
}

function getAiResponseText(result: any, fallback = "No response available") {
  return (
    extractReadableTextFromApi(result?.displayText) ||
    extractReadableTextFromApi(result?.gptAnswer) ||
    extractReadableTextFromApi(result?.speechText) ||
    extractReadableTextFromApi(result?.response) ||
    extractReadableTextFromApi(result?.message) ||
    extractReadableTextFromApi(result?.answer) ||
    extractReadableTextFromApi(result) ||
    fallback
  );
}

function formatGeneralResponse(text?: string) {
  const readableText = extractReadableTextFromApi(text);
  if (!readableText) return "";

  let formatted = escapeHtml(readableText);

  formatted = formatted.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`,
  );

  formatted = formatted.replace(
    /(^|\s)(https?:\/\/[^\s<]+)/g,
    `$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>`,
  );

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}

function hasMeaningfulVoiceInput(text?: string, audioBlob?: Blob) {
  const clean = (text || "").trim();
  const hasText = clean.length > 0;
  const hasAudio = !!audioBlob && audioBlob.size > 1200;
  return hasText || hasAudio;
}

function getCleanSpokenText(text?: string) {
  return (text || "").trim();
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";

  const normalized = value.includes(" ")
    ? value.replace(" ", "T")
    : value.includes("-") && value.length === 10
      ? `${value}T00:00:00`
      : value;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: normalized.includes("T") ? "2-digit" : undefined,
    minute: normalized.includes("T") ? "2-digit" : undefined,
  });
}

function getOrderStatusMeta(status?: string | number) {
  const value = String(status ?? "").trim();

  switch (value) {
    case "1":
      return { label: "Placed", className: "placed" };
    case "2":
      return { label: "Confirmed", className: "confirmed" };
    case "3":
      return { label: "Packed", className: "packed" };
    case "4":
      return { label: "Delivered", className: "delivered" };
    case "5":
      return { label: "Completed", className: "completed" };
    case "6":
      return { label: "Cancelled", className: "cancelled" };
    default:
      return { label: value || "Unknown", className: "default" };
  }
}

function getPaymentTypeLabel(type?: string | number | null) {
  const value = String(type ?? "").trim();

  switch (value) {
    case "1":
      return "COD";
    case "2":
      return "Online";
    case "COD":
      return "COD";
    default:
      return value || "-";
  }
}

function getShortOrderId(order?: PreviousOrder) {
  if (order?.newOrderId) return `#${order.newOrderId}`;
  if (order?.orderId) return `#${order.orderId.slice(-4)}`;
  return "#----";
}

function normalizeOrders(rawOrders: any): PreviousOrder[] {
  if (!Array.isArray(rawOrders)) return [];
  return rawOrders.filter((item) => item && typeof item === "object");
}

function normalizePlans(rawPlans: any): SubscriptionPlan[] {
  if (!Array.isArray(rawPlans)) return [];
  return rawPlans.filter((item) => item && typeof item === "object");
}

function normalizeWallet(rawWallet: any): WalletResponse | null {
  if (!rawWallet || typeof rawWallet !== "object") return null;
  return {
    walletAmount:
      rawWallet.walletAmount !== undefined ? rawWallet.walletAmount : null,
    walletTransactions: Array.isArray(rawWallet.walletTransactions)
      ? rawWallet.walletTransactions
      : [],
    status: !!rawWallet.status,
  };
}

function normalizeProfile(rawProfile: any): ProfileResponse | null {
  if (!rawProfile || typeof rawProfile !== "object") return null;
  return rawProfile;
}

const VoiceWindow: React.FC<VoiceWindowProps> = ({ onClose }) => {
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [payloadProducts, setPayloadProducts] = useState<ProductItem[]>([]);
  const [payloadBestMatch, setPayloadBestMatch] = useState<ProductItem | null>(
    null,
  );
  const [voiceActionType, setVoiceActionType] = useState<string>("");

  const [isListening, setIsListening] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  const [availableAddresses, setAvailableAddresses] = useState<AddressItem[]>(
    [],
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [confirmedAddressId, setConfirmedAddressId] = useState<string>("");
  const [showAddressConfirmButton, setShowAddressConfirmButton] =
    useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({ items: {}, status: {} });
  const [recordingMode, setRecordingMode] = useState<"normal" | "help">(
    "normal",
  );
  const [pendingHelpText, setPendingHelpText] = useState("");
  const [pendingHelpAudioBlob, setPendingHelpAudioBlob] = useState<Blob | null>(
    null,
  );
  const [isQueryPromptActive, setIsQueryPromptActive] = useState(false);
  const [isHelpPending, setIsHelpPending] = useState(false);
  const [queryAttachment, setQueryAttachment] = useState<File | null>(null);
  const [isUploadingQueryAttachment, setIsUploadingQueryAttachment] =
    useState(false);
  const [pendingQueryType, setPendingQueryType] = useState<string>("query");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const finalTranscriptRef = useRef<string>("");
  const lastUserSpokenTextRef = useRef<string>("");
  const latestUserTranscriptRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number>(0);
  const isListeningRef = useRef(false);
  const isVoiceLoadingRef = useRef(false);
  const shouldKeepVoiceRecognitionRef = useRef(false);

  const assistantAudioRef = useRef<HTMLAudioElement | null>(null);
  const assistantAudioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isVoiceLoadingRef.current = isVoiceLoading;
  }, [isVoiceLoading]);

  const clearVoiceSilenceTimer = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopCurrentVoiceRecording = () => {
    clearVoiceSilenceTimer();
    setIsListening(false);
    stopSpeechRecognition();

    try {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    } catch {
      //
    }
  };

  const startVoiceSilenceTimer = () => {
    clearVoiceSilenceTimer();

    silenceTimerRef.current = window.setTimeout(() => {
      const recordedFor = Date.now() - recordingStartedAtRef.current;

      if (
        recordedFor >= MIN_RECORDING_MS &&
        isListeningRef.current &&
        !isVoiceLoadingRef.current
      ) {
        stopCurrentVoiceRecording();
      } else if (isListeningRef.current) {
        startVoiceSilenceTimer();
      }
    }, SILENCE_LIMIT_MS);
  };

  const getCurrentUserId = () =>
    localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";

  const showWelcome = useMemo(
    () => voiceMessages.length === 0 && !isListening && !isVoiceLoading,
    [voiceMessages.length, isListening, isVoiceLoading],
  );

  const footerTitle = isQueryPromptActive
    ? "Asking your query..."
    : isListening
      ? recordingMode === "help"
        ? "Listening for your query..."
        : "Listening..."
      : isVoiceLoading
        ? "Processing your voice..."
        : isAssistantSpeaking
          ? "Assistant speaking..."
          : isHelpPending
            ? "Query ready"
            : "Tap to speak";

  const footerSubtitle = isQueryPromptActive
    ? "Assistant will ask what your query is, then recording will start."
    : isListening
      ? liveTranscript || "Please tell your query now."
      : isVoiceLoading
        ? "Please wait while I understand your request"
        : isAssistantSpeaking
          ? "Audio response is playing"
          : isHelpPending
            ? "Upload attachment if needed, then Submit or Cancel."
            : "Ask anything about products, cart, delivery, or orders";

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [voiceMessages, liveTranscript, isVoiceLoading, isMinimized]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setSpeechSupported(!!SpeechRecognition);
    fetchCartData();

    return () => {
      clearVoiceSilenceTimer();
      stopSpeechRecognition();
      stopAllTracks();
      stopAssistantAudio();
    };
  }, []);

  // background page scroll unlock fix
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverflowY = document.body.style.overflowY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverflowY = document.documentElement.style.overflowY;

    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "auto";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overflowY = prevBodyOverflowY;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overflowY = prevHtmlOverflowY;
    };
  }, []);

  const getImageSrc = (item: any) => {
    return (
      item?.itemImage ||
      item?.imageUrl ||
      item?.itemLogo ||
      item?.image ||
      item?.itemUrl ||
      ""
    );
  };

  const fetchCartData = async (itemId: string = "") => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    const currentUserId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!currentUserId || !accessToken) {
      setCartItems({});
      return;
    }

    if (itemId) {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: true },
      }));
    }

    try {
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${currentUserId}`,
      );

      const customerCart: CartItem[] =
        response.data?.customerCartResponseList || [];

      const cartItemsMap: Record<string, number> = customerCart.reduce(
        (acc: Record<string, number>, item: CartItem) => {
          if (item.status === "ADD" && item.itemId) {
            const quantity = item.cartQuantity ?? 0;
            acc[item.itemId] = (acc[item.itemId] ?? 0) + quantity;
          }
          return acc;
        },
        {},
      );

      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
    }
  };

  const handleAddToCart = async (item: ProductItem & { status?: string }) => {
    const accessToken = localStorage.getItem("accessToken");
    const currentUserId = localStorage.getItem("userId");

    if (!item?.itemId) {
      message.error("Invalid item. Please try again.");
      return;
    }

    if ((item.quantity ?? 1) <= 0) {
      message.warning("This item is currently out of stock");
      return;
    }

    if (!accessToken || !currentUserId) {
      message.warning("Please login to add items to the cart.");
      return;
    }

    try {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: true },
        status: { ...prev.status, [item.itemId]: "add" },
      }));

      const requestBody: any = {
        customerId: currentUserId,
        itemId: item.itemId,
        quantity: 1,
      };

      if (item.status === "COMBO") {
        requestBody.status = "COMBO";
      }

      await customerApi.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        requestBody,
      );
      await fetchCartData(item.itemId);
      message.success("Item added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add item to cart. Please try again.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
        status: { ...prev.status, [item.itemId]: "" },
      }));
    }
  };

  const handleQuantityChange = async (
    item: ProductItem,
    increment: boolean,
    status: string,
  ) => {
    if (!item?.itemId) {
      message.error("Invalid item. Please try again.");
      return;
    }

    if ((cartItems[item.itemId] || 0) === (item.quantity || 0) && increment) {
      message.warning("Sorry, Maximum quantity reached.");
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!currentUserId || !accessToken) {
      message.error("Please login to update cart.");
      return;
    }

    try {
      const endpoint = increment
        ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
        : `${BASE_URL}/cart-service/cart/minusCartItem`;

      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: true },
        status: { ...prev.status, [item.itemId]: status },
      }));

      const payload: any = { customerId: currentUserId, itemId: item.itemId };
      if (item.status === "COMBO") payload.status = "COMBO";

      await customerApi[increment ? "post" : "patch"](endpoint, payload);
      await fetchCartData(item.itemId);
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
        status: { ...prev.status, [item.itemId]: "" },
      }));
    }
  };

  const stopAssistantAudio = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (assistantAudioRef.current) {
        assistantAudioRef.current.pause();
        assistantAudioRef.current.currentTime = 0;
        assistantAudioRef.current.src = "";
        assistantAudioRef.current = null;
      }

      if (assistantAudioUrlRef.current) {
        URL.revokeObjectURL(assistantAudioUrlRef.current);
        assistantAudioUrlRef.current = null;
      }
    } catch {
      //
    } finally {
      setIsAssistantSpeaking(false);
      setIsQueryPromptActive(false);
    }
  };

  const playAssistantAudio = async (audioBase64?: string) => {
    try {
      const cleanBase64 = sanitizeBase64Audio(audioBase64);
      if (!cleanBase64) return;

      stopAssistantAudio();

      const bytes = base64ToUint8Array(cleanBase64);
      const mimeType = guessAudioMimeType(cleanBase64);
      const blob = new Blob([bytes], { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio();
      audio.preload = "auto";
      audio.src = audioUrl;

      assistantAudioRef.current = audio;
      assistantAudioUrlRef.current = audioUrl;

      audio.onplay = () => setIsAssistantSpeaking(true);
      audio.onended = () => stopAssistantAudio();
      audio.onpause = () => setIsAssistantSpeaking(false);
      audio.onerror = () => stopAssistantAudio();

      await audio.play();
    } catch {
      setIsAssistantSpeaking(false);
    }
  };

  const clearVoiceChat = () => {
    setVoiceMessages([]);
    setPayloadProducts([]);
    setPayloadBestMatch(null);
    setVoiceActionType("");
    setLiveTranscript("");
    setAvailableAddresses([]);
    setSelectedAddressId("");
    setConfirmedAddressId("");
    setShowAddressConfirmButton(false);
    setIsPlacingOrder(false);

    setRecordingMode("normal");
    setPendingHelpText("");
    setPendingHelpAudioBlob(null);
    setIsHelpPending(false);
    setQueryAttachment(null);
    setIsUploadingQueryAttachment(false);
    setPendingQueryType("query");
    setUploadedDocumentId("");

    resetVoiceTranscriptRefs();
    stopSpeechRecognition();
    stopAssistantAudio();
  };

  const stopAllTracks = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const cleanTranscriptText = (value: string) =>
    value
      .replace(/\s+/g, " ")
      .replace(/\s+([.,!?])/g, "$1")
      .trim();

  const resetVoiceTranscriptRefs = () => {
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    lastUserSpokenTextRef.current = "";
    latestUserTranscriptRef.current = "";
    setLiveTranscript("");
  };

  const stopSpeechRecognition = () => {
    shouldKeepVoiceRecognitionRef.current = false;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch {
      recognitionRef.current = null;
    }
  };

  const startLiveSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    stopSpeechRecognition();

    shouldKeepVoiceRecognitionRef.current = true;
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    latestUserTranscriptRef.current = "";

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript || "";

        if (result.isFinal) {
          finalTranscriptRef.current = cleanTranscriptText(
            `${finalTranscriptRef.current} ${transcript}`,
          );
        } else {
          interimTranscript = cleanTranscriptText(
            `${interimTranscript} ${transcript}`,
          );
        }
      }

      const spokenText = cleanTranscriptText(
        `${finalTranscriptRef.current} ${interimTranscript}`,
      );

      if (spokenText) {
        transcriptRef.current = spokenText;
        latestUserTranscriptRef.current = spokenText;
        lastUserSpokenTextRef.current = spokenText;
        setLiveTranscript(spokenText);
        startVoiceSilenceTimer();
      }
    };

    recognition.onerror = (event: any) => {
      if (event?.error === "no-speech" || event?.error === "aborted") return;

      shouldKeepVoiceRecognitionRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      recognitionRef.current = null;

      if (
        shouldKeepVoiceRecognitionRef.current &&
        isListeningRef.current &&
        !isVoiceLoadingRef.current
      ) {
        window.setTimeout(() => {
          try {
            startLiveSpeechRecognition();
          } catch {
            // Browser may already be restarting recognition.
          }
        }, 150);
      }
    };

    try {
      recognition.start();
    } catch {
      // Browser may already have an active recognition instance.
    }
  };

  const speakText = (text: string, onEnd?: () => void) => {
    if (!("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    setIsAssistantSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsAssistantSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsAssistantSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleHelpClick = async () => {
    if (!speechSupported) {
      message.warning("Voice is not supported in this browser.");
      return;
    }

    if (isVoiceLoading || isHelpPending) return;

    if (isListening || isAssistantSpeaking || isQueryPromptActive) {
      handleStopVoiceAssistant();
    }

    setRecordingMode("help");
    setPendingHelpText("");
    setPendingHelpAudioBlob(null);
    setIsHelpPending(false);
    setQueryAttachment(null);
    setUploadedDocumentId("");
    setPendingQueryType("query");
    setVoiceActionType("query");
    setIsQueryPromptActive(true);
    setLiveTranscript("");

    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    lastUserSpokenTextRef.current = "";
    latestUserTranscriptRef.current = "";

    setVoiceMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-query-ask`,
        type: "ai",
        text: "What is your query? Please tell me about it.",
        responseType: "general",
        createdAt: new Date(),
      },
    ]);

    speakText("What is your query? Please tell me about it.", async () => {
      setIsQueryPromptActive(false);
      await handleVoiceRecord("help");
    });
  };

  const handleHelpCancel = () => {
    setPendingHelpText("");
    setPendingHelpAudioBlob(null);
    setIsHelpPending(false);
    setQueryAttachment(null);
    setIsUploadingQueryAttachment(false);
    setPendingQueryType("query");
    setUploadedDocumentId("");
    setVoiceActionType("normal");
    setRecordingMode("normal");
    setLiveTranscript("");
    setIsQueryPromptActive(false);

    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    lastUserSpokenTextRef.current = "";
    latestUserTranscriptRef.current = "";
  };
  const uploadQueryAttachment = async (): Promise<string> => {
    if (!queryAttachment) return "";

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      message.warning("User ID not found. Please login again.");
      return "";
    }

    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (!accessToken) {
      message.error("Session expired. Please login again.");
      return "";
    }

    try {
      setIsUploadingQueryAttachment(true);

      const formData = new FormData();
      console.log("Selected query attachment:", queryAttachment);

      formData.append("file", queryAttachment);
      formData.append("fileType", "kyc");
      formData.append("projectType", "ASKOXY");

      const response = await customerApi.post(
        `${BASE_URL}/user-service/write/uploadQueryScreenShot?userId=${encodeURIComponent(
          currentUserId,
        )}`,
        formData,
        {
          headers: {
            accessToken,
            "Content-Type": undefined,
          },
        },
      );

      const documentId =
        response.data?.documentId ||
        response.data?.docId ||
        response.data?.id ||
        response.data?.data?.documentId ||
        response.data?.data?.docId ||
        response.data?.data?.id ||
        response.data?.response?.documentId ||
        response.data?.response?.docId ||
        "";

      if (!documentId) {
        message.error("Attachment uploaded, but document ID not found.");
        return "";
      }

      setUploadedDocumentId(String(documentId));
      message.success("Attachment uploaded successfully.");
      return String(documentId);
    } catch (error: any) {
      console.error("Error uploading query attachment:", error);

      if (error?.response?.status === 401) {
        message.error("Unauthorized. Please login again.");
      } else {
        message.error("Attachment upload failed. Please try again.");
      }

      return "";
    } finally {
      setIsUploadingQueryAttachment(false);
    }
  };

  const submitQueryToBackend = async (
    queryText: string,
    queryType: string,
    documentId?: string,
    audioBlob?: Blob | null,
  ) => {
    try {
      setIsVoiceLoading(true);

      const currentUserId = getCurrentUserId();

      if (!currentUserId) {
        message.warning("User ID not found. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("userId", currentUserId);
      formData.append("actionType", queryType || "query");
      formData.append("transcript", queryText || "");

      if (audioBlob) {
        formData.append("file", audioBlob, "query-voice.webm");
      }

      if (documentId) {
        formData.append("documentId", documentId);
      }

      const response = await fetch(VOICE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const result = await response.json();

      const aiText = getAiResponseText(
        result,
        "Your query has been submitted successfully.",
      );

      setVoiceMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `${Date.now()}-ai-query-success`,
          type: "ai",
          text: aiText,
          responseType: result?.type || result?.responseType || "",
          createdAt: new Date(),
        },
      ]);

      if (result?.audio) {
        await playAssistantAudio(result.audio);
      }

      setVoiceActionType("normal");
    } catch (error) {
      console.error("Query submit failed:", error);

      setVoiceMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `${Date.now()}-query-error`,
          type: "ai",
          text: "Sorry, your query could not be submitted. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleHelpSubmit = async () => {
    const queryText = pendingHelpText.trim();

    if (!queryText && !pendingHelpAudioBlob) {
      message.warning("Please record your query first.");
      return;
    }

    let documentId = uploadedDocumentId;

    if (queryAttachment && !documentId) {
      documentId = await uploadQueryAttachment();
      if (!documentId) return;
    }

    setVoiceMessages((prev) => [
      ...prev,
      ...(queryText
        ? ([
            {
              id: `${Date.now()}-query-user`,
              type: "user",
              text: queryText, // ONLY actual user spoken text
              createdAt: new Date(),
            },
          ] as VoiceMessage[])
        : []),
      {
        id: `${Date.now()}-loading`,
        type: "loading",
        text: "Submitting your query...",
        createdAt: new Date(),
      },
    ]);

    await submitQueryToBackend(
      queryText,
      pendingQueryType || "query",
      documentId,
      pendingHelpAudioBlob,
    );

    setPendingHelpText("");
    setPendingHelpAudioBlob(null);
    setQueryAttachment(null);
    setUploadedDocumentId("");
    setIsHelpPending(false);
    setRecordingMode("normal");
    setPendingQueryType("query");
  };

  const handleStopVoiceAssistant = () => {
    shouldKeepVoiceRecognitionRef.current = false;
    stopAssistantAudio();
    clearVoiceSilenceTimer();

    if (isListening) {
      setIsListening(false);
      stopSpeechRecognition();

      try {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      } catch {
        //
      }

      stopAllTracks();
    }

    // Do not clear transcript refs here while stopping a recording.
    // recorder.onstop uses these values to keep the user's question visible.
    if (!isListening) {
      setLiveTranscript("");
      transcriptRef.current = "";
      finalTranscriptRef.current = "";
      lastUserSpokenTextRef.current = "";
      latestUserTranscriptRef.current = "";
    }

    if (recordingMode === "help") {
      setIsQueryPromptActive(false);
    }
  };

  const handleVoiceRecord = async (mode: "normal" | "help" = "normal") => {
    try {
      if (!isListening) {
        stopAssistantAudio();
        stopSpeechRecognition();
        clearVoiceSilenceTimer();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const recorder = new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recordingStartedAtRef.current = Date.now();
        transcriptRef.current = "";
        finalTranscriptRef.current = "";
        latestUserTranscriptRef.current = "";
        setLiveTranscript("");
        setRecordingMode(mode);

        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          clearVoiceSilenceTimer();

          shouldKeepVoiceRecognitionRef.current = false;
          stopSpeechRecognition();

          const spokenText = cleanTranscriptText(
            finalTranscriptRef.current ||
              transcriptRef.current ||
              latestUserTranscriptRef.current ||
              lastUserSpokenTextRef.current ||
              "",
          );

          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const isValidInput = hasMeaningfulVoiceInput(spokenText, audioBlob);

          if (!isValidInput) {
            setLiveTranscript("");
            transcriptRef.current = "";
            finalTranscriptRef.current = "";
            lastUserSpokenTextRef.current = "";
            latestUserTranscriptRef.current = "";
            stopAllTracks();
            setIsListening(false);
            setRecordingMode("normal");
            return;
          }

          const cleanUserText = getCleanSpokenText(spokenText);
          lastUserSpokenTextRef.current = cleanUserText;

          if (mode === "help") {
            setPendingHelpText(cleanUserText);
            setPendingHelpAudioBlob(audioBlob);
            setIsHelpPending(true);

            setLiveTranscript("");
            transcriptRef.current = "";
            finalTranscriptRef.current = "";
            latestUserTranscriptRef.current = "";

            stopAllTracks();
            setIsListening(false);
            return;
          }

          const tempId = `${Date.now()}-user`;


          setVoiceMessages((prev) => [
            ...prev,
            ...(cleanUserText
              ? ([
                  {
                    id: tempId,
                    type: "user",
                    text: cleanUserText, // ONLY actual user spoken text
                    createdAt: new Date(),
                  },
                ] as VoiceMessage[])
              : []),
            {
              id: `${Date.now()}-loading`,
              type: "loading",
              text: "Processing...",
              createdAt: new Date(),
            },
          ]);

          await sendAudioToBackend(audioBlob, tempId, cleanUserText);

          setLiveTranscript("");
          transcriptRef.current = "";
          finalTranscriptRef.current = "";
          latestUserTranscriptRef.current = "";
          stopAllTracks();
        };

        recorder.start();
        startLiveSpeechRecognition();
        setIsListening(true);
        startVoiceSilenceTimer();
      } else {
        stopCurrentVoiceRecording();
      }
    } catch {
      setIsListening(false);
      stopSpeechRecognition();
      setRecordingMode("normal");
    }
  };

  const sendAudioToBackend = async (
    audioBlob: Blob,
    tempId: string,
    fallbackText: string,
    forcedActionType?: string,
  ) => {
    try {
      setIsVoiceLoading(true);

      const requestActionType = (
        forcedActionType ??
        voiceActionType?.trim() ??
        ""
      ).trim();

      const formData = new FormData();
      formData.append("actionType", requestActionType);
      formData.append("file", audioBlob, "voice.webm");
      formData.append("transcript", fallbackText || "");
      const currentUserId = getCurrentUserId();
      formData.append("userId", currentUserId);
      formData.append("products", JSON.stringify(payloadProducts || []));

      if (payloadBestMatch) {
        formData.append("bestMatch", JSON.stringify(payloadBestMatch));
      }

      if (confirmedAddressId) {
        formData.append("addressId", confirmedAddressId);
      }

      const response = await fetch(VOICE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const result = await response.json();

      if ((result?.type || "").toLowerCase() === "query") {
        const queryText =
          getCleanSpokenText(fallbackText) ||
          getCleanSpokenText(lastUserSpokenTextRef.current) ||
          getCleanSpokenText(latestUserTranscriptRef.current) ||
          getCleanSpokenText(finalTranscriptRef.current) ||
          getCleanSpokenText(transcriptRef.current) ||
          "";

        setPendingHelpText(queryText);
        setPendingHelpAudioBlob(audioBlob);
        setPendingQueryType(result?.type || "query");
        setUploadedDocumentId("");
        setIsHelpPending(true);
        setRecordingMode("help");
        setQueryAttachment(null);
        setVoiceActionType("normal");

        setVoiceMessages((prev) => [
          ...prev.filter((m) => m.type !== "loading"),
          {
            id: `${Date.now()}-query-preview`,
            type: "ai",
            text: "Please review your query below. You can upload an attachment if needed, then click Submit.",
            responseType: "general",
            createdAt: new Date(),
          },
        ]);

        return;
      }

      const aiText = getAiResponseText(result);

      const apiResponseType = result?.type || result?.responseType || "";

      const nextBestMatch = extractBestMatchProduct(result?.bestMatch);
      const productCategories = parseProductsResponse(
        result?.products,
        nextBestMatch,
      );
      const offerCategories = parseOffersResponse(result?.offers);
      const nextCategories = [...productCategories, ...offerCategories];
      const nextFlatProducts = flattenProducts(nextCategories);

      const nextAddresses: AddressItem[] = Array.isArray(result?.addresses)
        ? result.addresses
        : [];

      const nextCartResponse: CartResponse | null =
        result?.cartResponse && typeof result.cartResponse === "object"
          ? result.cartResponse
          : result?.cartDetails && typeof result?.cartDetails === "object"
            ? result.cartDetails
            : null;

      const nextWallet: WalletResponse | null = normalizeWallet(result?.wallet);
      const nextProfile: ProfileResponse | null = normalizeProfile(
        result?.profile,
      );
      const nextOrders: PreviousOrder[] = normalizeOrders(result?.orders);
      const nextPlans: SubscriptionPlan[] = normalizePlans(
        result?.plans ?? result?.subscriptions,
      );

      const nextActionType =
        requestActionType === "query"
          ? "normal"
          : result?.actionType || result?.type || voiceActionType || "";

      const normalizedAction = (nextActionType || "").toLowerCase();
      const wantsPlaceOrder =
        normalizedAction === "placeorder" || normalizedAction === "place_order";

      setPayloadProducts((prev) =>
        nextFlatProducts.length > 0
          ? mergeProducts(prev, nextFlatProducts)
          : prev,
      );

      if (nextBestMatch) {
        setPayloadBestMatch(nextBestMatch);
      }

      setVoiceActionType(nextActionType);

      if (nextAddresses.length > 0) {
        setAvailableAddresses(nextAddresses);

        setSelectedAddressId((prev) => {
          const stillExists = nextAddresses.some((addr) => addr.id === prev);
          return stillExists ? prev : "";
        });

        setConfirmedAddressId((prev) => {
          const stillExists = nextAddresses.some((addr) => addr.id === prev);
          return stillExists ? prev : "";
        });
      }

      setShowAddressConfirmButton(wantsPlaceOrder && nextAddresses.length > 0);

      setVoiceMessages((prev) => {
        const cleaned = prev.filter((m) => m.type !== "loading");

        const updated = [...cleaned];


        updated.push({
          id: `${Date.now()}-ai`,
          type: "ai",
          text: aiText,
          responseType: apiResponseType,
          createdAt: new Date(),
        });

        if (nextOrders.length > 0) {
          updated.push({
            id: `${Date.now()}-orders`,
            type: "orders",
            data: nextOrders,
            createdAt: new Date(),
          });
        }

        if (nextPlans.length > 0) {
          updated.push({
            id: `${Date.now()}-subscriptions`,
            type: "subscriptions",
            data: nextPlans,
            createdAt: new Date(),
          });
        }

        if (nextProfile) {
          updated.push({
            id: `${Date.now()}-profile`,
            type: "profile",
            data: nextProfile,
            createdAt: new Date(),
          });
        }

        if (nextWallet) {
          updated.push({
            id: `${Date.now()}-wallet`,
            type: "wallet",
            data: nextWallet,
            createdAt: new Date(),
          });
        }

        if (nextCartResponse?.customerCartResponseList?.length) {
          updated.push({
            id: `${Date.now()}-cart`,
            type: "cart",
            data: nextCartResponse,
            createdAt: new Date(),
          });
        }

        if (nextBestMatch) {
          updated.push({
            id: `${Date.now()}-bestmatch`,
            type: "bestMatch",
            data: nextBestMatch,
            createdAt: new Date(),
          });
        }

        if (nextCategories.length > 0) {
          updated.push({
            id: `${Date.now()}-products`,
            type: "products",
            data: nextCategories,
            createdAt: new Date(),
          });
        }

        if (nextAddresses.length > 0) {
          updated.push({
            id: `${Date.now()}-addresses`,
            type: "addresses",
            data: nextAddresses,
            createdAt: new Date(),
          });

          if (wantsPlaceOrder) {
            updated.push({
              id: `${Date.now()}-address-confirm`,
              type: "addressConfirm",
              text: "Please select and confirm your delivery address to place the order.",
              createdAt: new Date(),
            });
          }
        }

        return updated;
      });

      if (nextBestMatch?.itemId) {
        fetchCartData(nextBestMatch.itemId);
      }

      if (result?.audio) {
        await playAssistantAudio(result.audio);
      }
    } catch {
      setVoiceMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `${Date.now()}-error`,
          type: "ai",
          text: "Sorry, I couldn't process your voice. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsVoiceLoading(false);
      setIsListening(false);
    }
  };

  const renderProfileCard = (profile: ProfileResponse) => {
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="va-summary-card">
        <div className="va-section-label">
          <Bot size={14} />
          Profile Details
        </div>

        <div className="va-summary-grid">
          <div className="va-summary-box">
            <span className="va-summary-box-label">Name</span>
            <span className="va-summary-box-value">{fullName || "-"}</span>
          </div>

          <div className="va-summary-box">
            <span className="va-summary-box-label">Mobile</span>
            <span className="va-summary-box-value">
              {profile.countryCode || ""} {profile.mobileNumber || "-"}
            </span>
          </div>

          <div className="va-summary-box">
            <span className="va-summary-box-label">WhatsApp</span>
            <span className="va-summary-box-value">
              {profile.whatsappNumber || "-"}
            </span>
          </div>

          <div className="va-summary-box va-email-box">
            <span className="va-summary-box-label">Email</span>
            <span className="va-summary-box-value va-email-value">
              {profile.email || "-"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderWalletCard = (wallet: WalletResponse) => {
    const walletAmount =
      wallet.walletAmount === null || wallet.walletAmount === undefined
        ? "₹0"
        : formatCurrency(wallet.walletAmount);

    const transactions = wallet.walletTransactions || [];

    return (
      <div className="va-summary-card">
        <div className="va-section-label">
          <Receipt size={14} />
          Wallet Details
        </div>

        <div className="va-summary-grid" style={{ marginBottom: 12 }}>
          <div className="va-summary-box">
            <span className="va-summary-box-label">Wallet Balance</span>
            <span className="va-summary-box-value">{walletAmount}</span>
          </div>

          <div className="va-summary-box">
            <span className="va-summary-box-label">Transactions</span>
            <span className="va-summary-box-value">{transactions.length}</span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="va-summary-text">No wallet transactions found.</p>
        ) : (
          <div className="va-order-list">
            {transactions.map((txn, index) => (
              <div
                key={`${txn.id || "txn"}-${index}`}
                className="va-order-card"
              >
                <div className="va-order-top">
                  <div>
                    <p className="va-order-id">
                      {txn.transactionType || "Transaction"}
                    </p>
                    <p className="va-order-date">
                      {formatDisplayDate(txn.createdAt)}
                    </p>
                  </div>
                  <span className="va-order-status default">
                    {txn.amount !== undefined && txn.amount !== null
                      ? formatCurrency(txn.amount)
                      : "₹0"}
                  </span>
                </div>

                <p className="va-order-meta">
                  {txn.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleConfirmSelectedAddress = () => {
    if (!selectedAddressId) {
      setVoiceMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-address-select-warning`,
          type: "ai",
          text: "Please select an address first.",
          createdAt: new Date(),
        },
      ]);
      return;
    }

    setConfirmedAddressId(selectedAddressId);

    setVoiceMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-address-confirmed-msg`,
        type: "ai",
        text: "Address confirmed successfully. Now I can place the order.",
        createdAt: new Date(),
      },
    ]);
  };

  const extractOrderIdFromResponse = (result: any): string => {
    return String(
      result?.orderId ||
        result?.data?.orderId ||
        result?.response?.orderId ||
        result?.order?.orderId ||
        result?.newOrderId ||
        result?.data?.newOrderId ||
        result?.order?.newOrderId ||
        "",
    );
  };

  const fetchOrderByOrderId = async (
    orderId: string,
  ): Promise<PreviousOrder[]> => {
    if (!orderId) return [];

    try {
      const response = await customerApi.get(
        `${BASE_URL}/order-service/getOrdersByOrderId/${encodeURIComponent(
          orderId,
        )}`,
      );

      const data = response.data;

      if (Array.isArray(data)) return normalizeOrders(data);
      if (Array.isArray(data?.orders)) return normalizeOrders(data.orders);
      if (Array.isArray(data?.data)) return normalizeOrders(data.data);
      if (Array.isArray(data?.response)) return normalizeOrders(data.response);
      if (data && typeof data === "object") return normalizeOrders([data]);

      return [];
    } catch (error) {
      console.error("Failed to fetch placed order details:", error);
      return [];
    }
  };

  const handleConfirmAddressOrder = async () => {
    try {
      if (!confirmedAddressId) {
        setVoiceMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-address-warning`,
            type: "ai",
            text: "Please confirm your address first.",
            createdAt: new Date(),
          },
        ]);
        return;
      }

      setIsPlacingOrder(true);
      setIsVoiceLoading(true);

      setVoiceMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-placing-loading`,
          type: "loading",
          text: "Placing your order...",
          createdAt: new Date(),
        },
      ]);

      const formData = new FormData();
      formData.append("actionType", "placeOrder");
      formData.append(
        "file",
        new Blob([], { type: "audio/webm" }),
        "empty.webm",
      );
      const currentUserId = getCurrentUserId();
      formData.append("userId", currentUserId);
      formData.append("addressId", confirmedAddressId);
      formData.append("products", JSON.stringify(payloadProducts || []));

      if (payloadBestMatch) {
        formData.append("bestMatch", JSON.stringify(payloadBestMatch));
      }

      const response = await fetch(VOICE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const result = await response.json();

      const successText = getAiResponseText(
        result,
        "Order placed successfully.",
      );

      let placedOrderDetails: PreviousOrder[] = [];

      if (
        Array.isArray(result?.orderDetails) &&
        result.orderDetails.length > 0
      ) {
        placedOrderDetails = normalizeOrders(result.orderDetails);
      } else {
        const placedOrderId = extractOrderIdFromResponse(result);
        placedOrderDetails = placedOrderId
          ? await fetchOrderByOrderId(placedOrderId)
          : [];
      }

      const nextCartResponse: CartResponse | null =
        result?.cartResponse && typeof result.cartResponse === "object"
          ? result.cartResponse
          : result?.cartDetails && typeof result.cartDetails === "object"
            ? result.cartDetails
            : null;

      setVoiceMessages((prev) => {
        const cleaned = prev.filter((m) => m.type !== "loading");

        const updated: VoiceMessage[] = [
          ...cleaned,
          {
            id: `${Date.now()}-order-success`,
            type: "ai",
            text: successText,
            responseType: result?.type || result?.responseType || "",
            createdAt: new Date(),
          },
        ];

        if (nextCartResponse?.customerCartResponseList?.length) {
          updated.push({
            id: `${Date.now()}-order-cart`,
            type: "cart",
            data: nextCartResponse,
            createdAt: new Date(),
          });
        }

        if (placedOrderDetails.length > 0) {
          updated.push({
            id: `${Date.now()}-placed-order-details`,
            type: "orders",
            data: placedOrderDetails,
            createdAt: new Date(),
          });
        }

        return updated;
      });

      setShowAddressConfirmButton(false);
      setVoiceActionType("");
      setAvailableAddresses([]);
      setSelectedAddressId("");
      setConfirmedAddressId("");

      if (result?.audio) {
        await playAssistantAudio(result.audio);
      }
    } catch {
      setVoiceMessages((prev) => [
        ...prev.filter((m) => m.type !== "loading"),
        {
          id: `${Date.now()}-order-error`,
          type: "ai",
          text: "Sorry, order could not be placed. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsPlacingOrder(false);
      setIsVoiceLoading(false);
    }
  };

  const handleClose = () => {
    shouldKeepVoiceRecognitionRef.current = false;

    if (isListening) {
      setIsListening(false);
      stopSpeechRecognition();
      mediaRecorderRef.current?.stop();
    }
    stopAssistantAudio();
    onClose();
  };

  const renderAiMessageText = (msg: VoiceMessage) => {
    const markdownText = normalizeAiMarkdownText(
      extractReadableTextFromApi(msg.text) || msg.text || "",
    );

    return (
      <div className="va-rich-text va-clean-ai-text">
        <ReactMarkdown
          components={{
            p: ({ children }: any) => <p className="va-ai-para">{children}</p>,
            ol: ({ children }: any) => <ol className="va-ai-list va-ai-ol">{children}</ol>,
            ul: ({ children }: any) => <ul className="va-ai-list va-ai-ul">{children}</ul>,
            li: ({ children }: any) => <li className="va-ai-list-item">{children}</li>,
            a: ({ href, children, ...props }: any) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="va-clean-ai-link"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {markdownText}
        </ReactMarkdown>
      </div>
    );
  };

  const renderCartControl = (item: ProductItem) => {
    const itemCount = cartItems[item.itemId] || 0;
    const isLoading = loadingItems.items[item.itemId];
    const loadingStatus = loadingItems.status[item.itemId];

    if (itemCount === 0) {
      return (
        <button
          onClick={() => handleAddToCart(item)}
          disabled={isLoading}
          className="va-cart-btn va-cart-btn-add"
        >
          {isLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>Add</span>
            </>
          )}
        </button>
      );
    }

    return (
      <div className="va-stepper">
        <button
          onClick={() => handleQuantityChange(item, false, "decrease")}
          disabled={isLoading && loadingStatus === "decrease"}
          className="va-stepper-btn"
        >
          {isLoading && loadingStatus === "decrease" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "−"
          )}
        </button>

        <span className="va-stepper-count">{itemCount}</span>

        <button
          onClick={() => handleQuantityChange(item, true, "increase")}
          disabled={isLoading && loadingStatus === "increase"}
          className="va-stepper-btn"
        >
          {isLoading && loadingStatus === "increase" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "+"
          )}
        </button>
      </div>
    );
  };

  const renderProductCard = (item: ProductItem, highlight = false) => {
    const itemCount = cartItems[item.itemId] || 0;
    const imageSrc = getImageSrc(item);
    const displayPrice = getProductPrice(item);
    const displayMrp = getProductMrp(item);
    const hasDisplayPrice = displayPrice !== undefined && displayPrice > 0;

    if (highlight) {
      return (
        <div key={item.itemId} className="va-best-card">
          <div className="va-best-grid">
            <div className="va-best-image-shell">
              <span className="va-best-chip">
                <Star size={12} />
                Best Match
              </span>

              {!!item.savePercentage && (
                <span className="va-discount-chip">
                  {item.savePercentage}% OFF
                </span>
              )}

              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={item.itemName}
                  className="va-best-image"
                />
              ) : (
                <div className="va-best-image va-no-image">
                  <Package size={34} />
                </div>
              )}
            </div>

            <div className="va-best-content">
              <div>
                <div className="va-info-pill">
                  <Sparkles size={14} />
                  Smart recommendation
                </div>

                <h3 className="va-best-title">{item.itemName}</h3>

                <div className="va-tag-row">
                  {!!item.weight && !!item.units && (
                    <span className="va-mini-tag">
                      {item.weight} {item.units}
                    </span>
                  )}

                  {!!item.bmvCoins && (
                    <span className="va-mini-tag va-mini-tag-purple">
                      {item.bmvCoins} coins
                    </span>
                  )}

                  {!!item.saveAmount && (
                    <span className="va-mini-tag va-mini-tag-green">
                      Save {formatCurrency(item.saveAmount)}
                    </span>
                  )}
                </div>

                {!!item.itemDescription && (
                  <p className="va-best-desc">
                    {getShortDescription(item.itemDescription, 220)}
                  </p>
                )}
              </div>

              <div className="va-footer-row va-footer-row-best">
                <div className="va-price-box">
                  <span className="va-price-main">
                    {hasDisplayPrice ? formatCurrency(displayPrice) : "Special Offer"}
                  </span>
                  {!!displayMrp && displayMrp > 0 && (
                    <span className="va-price-mrp">
                      {formatCurrency(displayMrp)}
                    </span>
                  )}
                </div>

                <div className="va-control-box">{renderCartControl(item)}</div>
              </div>

              {itemCount > 0 && (
                <div className="va-cart-note">
                  <CheckCircle2 size={14} />
                  {itemCount} item{itemCount > 1 ? "s" : ""} already in cart
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={item.itemId} className="va-product-card">
        <div className="va-product-image-shell">
          {!!item.savePercentage && (
            <span className="va-small-discount-chip">
              {item.savePercentage}% OFF
            </span>
          )}

          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.itemName}
              className="va-product-image"
            />
          ) : (
            <div className="va-product-image va-no-image">
              <Package size={24} />
            </div>
          )}
        </div>

        <div className="va-product-content">
          <p className="va-product-title">{item.itemName}</p>

          <div className="va-tag-row va-tag-row-small">
            {!!item.weight && !!item.units && (
              <span className="va-mini-tag">
                {item.weight} {item.units}
              </span>
            )}

            {!!item.bmvCoins && (
              <span className="va-mini-tag va-mini-tag-purple">
                {item.bmvCoins} coins
              </span>
            )}
          </div>

          {!!item.itemDescription && (
            <p className="va-product-desc">
              {getShortDescription(item.itemDescription, 85)}
            </p>
          )}

          <div className="va-product-footer">
            <div className="va-price-box va-price-box-small">
              <span className="va-price-small">
                {hasDisplayPrice ? formatCurrency(displayPrice) : "Offer"}
              </span>
              {!!displayMrp && displayMrp > 0 && (
                <span className="va-price-mrp-small">
                  {formatCurrency(displayMrp)}
                </span>
              )}
            </div>

            <div className="va-control-box va-control-box-full">
              {renderCartControl(item)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCartCard = (item: CartItem, index: number, msgId: string) => {
    const imageSrc = getImageSrc(item);

    return (
      <div key={`${msgId}-${index}`} className="va-cart-card">
        <div className="va-cart-card-top">
          <div className="va-cart-image-shell">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={item.itemName || "Cart Item"}
                className="va-cart-image"
              />
            ) : (
              <div className="va-cart-image va-no-image">
                <ShoppingBag size={24} />
              </div>
            )}
          </div>

          <div className="va-cart-main">
            <div className="va-cart-heading-row">
              <p className="va-cart-item-title">
                {item.itemName || "Cart Item"}
              </p>
              <span className="va-cart-qty-badge">
                Qty {item.cartQuantity || 0}
              </span>
            </div>

            <div className="va-cart-meta-row">
              {!!item.weight && !!item.units && (
                <span className="va-mini-tag">
                  {item.weight} {item.units}
                </span>
              )}

              {!!item.saveAmount && (
                <span className="va-mini-tag va-mini-tag-green">
                  Save {formatCurrency(item.saveAmount)}
                </span>
              )}

              {!!item.savePercentage && (
                <span className="va-mini-tag va-mini-tag-purple">
                  {item.savePercentage}% OFF
                </span>
              )}
            </div>

            <div className="va-cart-price-line">
              <div className="va-cart-price-block">
                <span className="va-cart-price-label">Price</span>
                <strong className="va-cart-price-value">
                  {formatCurrency(item.itemPrice)}
                </strong>
              </div>

              <div className="va-cart-divider" />

              <div className="va-cart-price-block">
                <span className="va-cart-price-label">Total</span>
                <strong className="va-cart-total-value">
                  {formatCurrency(item.totalPrice)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderCard = (
    order: PreviousOrder,
    index: number,
    msgId: string,
  ) => {
    const statusMeta = getOrderStatusMeta(order.orderStatus);

    return (
      <div
        key={`${msgId}-order-${index}`}
        className="va-order-card va-simple-order-card"
      >
        <div className="va-order-top">
          <div>
            <p className="va-order-id">{getShortOrderId(order)}</p>
            <p className="va-order-date">
              {formatDisplayDate(order.orderDate)}
            </p>
          </div>

          <span className={`va-order-status ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>

        <div className="va-order-detail-row">
          <span>Total Amount</span>
          <strong>{formatCurrency(order.grandTotal || order.subTotal)}</strong>
        </div>

        <div className="va-order-detail-row">
          <span>Payment</span>
          <strong>{getPaymentTypeLabel(order.paymentType)}</strong>
        </div>

        <div className="va-order-delivery-section">
          <span className="va-order-section-label">Delivery</span>
          <div className="va-order-delivery-pill">
            <Receipt size={17} />
            <strong>{order.expectedDeliveryDate || "-"}</strong>
            <span>•</span>
            <span>{order.timeSlot || "Anytime"}</span>
          </div>
        </div>

        {(order.message || order.reason) && (
          <div className="va-order-note">{order.message || order.reason}</div>
        )}

        {order.invoiceUrl && (
          <a
            href={order.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="va-primary-wide-btn va-view-order-btn"
          >
            View Order Details
          </a>
        )}
      </div>
    );
  };

  const renderSubscriptionCard = (
    plan: SubscriptionPlan,
    index: number,
    msgId: string,
  ) => {
    const isActive = !!plan.status;
    const benefit = toNumber(plan.getAmount) - toNumber(plan.amount);

    return (
      <div
        key={`${msgId}-plan-${index}`}
        className={`va-plan-card ${isActive ? "active" : "inactive"}`}
      >
        <div className="va-plan-top">
          <div>
            <p className="va-plan-title">Subscription Plan</p>
            <p className="va-plan-id">
              {plan.planId ? `ID: ${plan.planId.slice(0, 8)}...` : "Plan"}
            </p>
          </div>

          <span className={`va-plan-badge ${isActive ? "active" : "inactive"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="va-plan-main-amount">{formatCurrency(plan.amount)}</div>

        <div className="va-plan-grid">
          <div className="va-plan-box">
            <span className="va-plan-box-label">You Get</span>
            <strong className="va-plan-box-value">
              {formatCurrency(plan.getAmount)}
            </strong>
          </div>

          <div className="va-plan-box">
            <span className="va-plan-box-label">Limit Amount</span>
            <strong className="va-plan-box-value">
              {formatCurrency(plan.limitAmount)}
            </strong>
          </div>

          <div className="va-plan-box">
            <span className="va-plan-box-label">Benefit</span>
            <strong className="va-plan-box-value primary">
              {formatCurrency(benefit)}
            </strong>
          </div>
        </div>
      </div>
    );
  };

  const minimizedBubble = (
    <div className="va-mini-dock">
      <div className="va-mini-wrap">
        <div
          className={`va-mini-pill ${isListening ? "listening" : ""} ${
            isVoiceLoading ? "processing" : ""
          } ${isAssistantSpeaking ? "speaking" : ""}`}
          onClick={() => setIsMinimized(false)}
        >
          <span className="va-mini-pill-pulse" />
          <span className="va-mini-pill-pulse va-mini-pill-pulse-delay" />

          <div className="va-mini-pill-top">
            <span className="va-mini-dot" />
            <span className="va-mini-title">Voice Assistant</span>
            <Maximize2 size={14} />
          </div>

          <p className="va-mini-sub">
            {isListening
              ? "Listening..."
              : isVoiceLoading
                ? "Processing..."
                : isAssistantSpeaking
                  ? "Speaking..."
                  : "Tap to open"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseRing {
          0% { transform: scale(0.88); opacity: 0.45; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        @keyframes typingDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        @keyframes vaMiniPulse {
          0% { transform: scale(0.92); opacity: 0.28; }
          70% { transform: scale(1.12); opacity: 0.08; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes vaMiniDotBlink {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
          }
          50% {
            transform: scale(1.25);
            box-shadow: 0 0 0 8px rgba(34,197,94,0.08);
          }
        }

.va-shell {
          position: fixed;
          top: 92px;
          right: 16px;
          bottom: 16px;
          z-index: 9998;
          pointer-events: none;
          width: 35%;
          min-width: 360px;
          max-width: 560px;
        }

        .va-panel {
          width: 100%;
          height: 100%;
          max-height: calc(100vh - 108px);
          display: flex;
          flex-direction: column;
          pointer-events: auto;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.55);
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.72), rgba(255,255,255,0.06) 40%),
            linear-gradient(180deg, rgba(255,255,255,0.96), rgba(249,247,255,0.98));
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow:
            0 18px 48px rgba(17,24,39,0.16),
            inset 0 1px 0 rgba(255,255,255,0.78);
          overscroll-behavior: contain;
        }

        .va-header {
          position: relative;
          padding: 16px 16px 14px;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 35%),
            linear-gradient(135deg, #7c3aed 0%, #6d28d9 45%, #5b21b6 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.16);
          flex-shrink: 0;
        }

        .va-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .va-header-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.26);
        }

        .va-header-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.2;
        }

        .va-header-subtitle {
          margin: 4px 0 0;
          font-size: 12px;
          opacity: 0.9;
          line-height: 1.5;
        }

.va-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.va-icon-btn {
  width: 34px;
  height: 34px;
  min-width: 34px;
  padding: 0;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  line-height: 1;
  vertical-align: middle;
  transform: translateZ(0);
}

.va-icon-btn svg {
  flex-shrink: 0;
  display: block;
}

.va-icon-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.18);
}

.va-header-help-btn {
  width: auto;
  min-width: 76px;
  height: 34px;
  padding: 0 10px;
  gap: 5px;
  white-space: nowrap;
  background: rgba(34, 197, 94, 0.22);
  border-color: rgba(187, 247, 208, 0.35);
}

.va-header-help-btn:disabled,
.va-icon-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 420px) {
  .va-header-actions {
    gap: 5px;
  }

  .va-icon-btn {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 10px;
  }

  .va-header-help-btn {
    min-width: 68px;
    height: 32px;
    padding: 0 8px;
    font-size: 12px;
  }
}

        .va-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 14px;
          background:
            linear-gradient(180deg, rgba(250,248,255,0.74), rgba(255,255,255,0.94));
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .va-body::-webkit-scrollbar {
          width: 6px;
        }

        .va-body::-webkit-scrollbar-thumb {
          background: rgba(124,58,237,0.18);
          border-radius: 999px;
        }

        .va-welcome {
          animation: fadeUp .25s ease;
          border-radius: 24px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.95), rgba(249,245,255,0.95));
          border: 1px solid rgba(237,233,254,0.95);
          box-shadow: 0 12px 28px rgba(124,58,237,0.08);
        }

        .va-welcome-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .va-welcome-bot {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px rgba(124,58,237,0.22);
        }

        .va-welcome-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #111827;
        }

        .va-welcome-sub {
          margin: 4px 0 0;
          font-size: 13px;
          color: #6b7280;
        }

        .va-quick-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .va-quick-chip {
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #6d28d9;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
        }

        .va-msg-block {
          display: flex;
          margin-bottom: 12px;
          animation: fadeUp .25s ease;
        }

        .va-msg-block.user { justify-content: flex-end; }
        .va-msg-block.ai { justify-content: flex-start; }

        .va-msg {
          max-width: 88%;
          border-radius: 22px;
          padding: 12px 14px;
          font-size: 13px;
          line-height: 1.6;
          box-shadow: 0 10px 22px rgba(15,23,42,0.06);
          word-break: break-word;
          white-space: pre-line;
        }

        .va-msg.user {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          border-bottom-right-radius: 8px;
        }

        .va-msg.ai {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,250,251,0.98));
          color: #111827;
          border: 1px solid #ede9fe;
          border-bottom-left-radius: 8px;
        }

        .va-msg.loading {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
        }

        .va-live-bubble {
          margin-top: 8px;
          background: linear-gradient(180deg, #f5f3ff, #fff);
          border: 1px dashed #c4b5fd;
          color: #5b21b6;
        }

        .va-rich-text {
          font-size: 14px;
          line-height: 1.6;
          color: #1f2937;
          word-break: normal;
        }

        .va-clean-ai-text {
          max-width: 100%;
          background: linear-gradient(180deg, #ffffff, #fbfaff);
          border: 1px solid #eee7ff;
          border-radius: 18px;
          padding: 14px 15px;
          box-shadow: 0 8px 22px rgba(109, 40, 217, 0.06);
        }

        .va-ai-para {
          margin: 0 0 8px;
        }

        .va-ai-para:last-child {
          margin-bottom: 0;
        }

        .va-ai-list {
          margin: 8px 0 10px;
          padding-left: 0;
        }

        .va-ai-ol {
          counter-reset: va-ai-counter;
          list-style: none;
        }

        .va-ai-ul {
          list-style: none;
        }

        .va-ai-list-item {
          position: relative;
          margin: 7px 0;
          padding-left: 30px;
          line-height: 1.55;
        }

        .va-ai-ol > .va-ai-list-item {
          counter-increment: va-ai-counter;
        }

        .va-ai-ol > .va-ai-list-item::before {
          content: counter(va-ai-counter);
          position: absolute;
          left: 0;
          top: 1px;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ede9fe;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 900;
        }

        .va-ai-ul > .va-ai-list-item::before {
          content: "";
          position: absolute;
          left: 8px;
          top: 10px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #7c3aed;
        }

        .va-clean-ai-text strong {
          color: #111827;
          font-weight: 800;
        }

        .va-clean-ai-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #6d28d9 !important;
          font-weight: 800;
          text-decoration: none !important;
          background: #f3efff;
          border: 1px solid #ddd2fe;
          border-radius: 999px;
          padding: 3px 9px;
          margin: 0 2px;
          word-break: break-word;
        }

        .va-clean-ai-link::after {
          content: "↗";
          font-size: 11px;
          line-height: 1;
        }

        .va-clean-ai-link:hover {
          color: #4c1d95 !important;
          background: #ede9fe;
          border-color: #c4b5fd;
        }

        .va-rich-text em {
          font-style: italic;
        }

        .va-summary-box {
          min-width: 0;
          overflow: hidden;
        }

        .va-summary-box-value {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
          line-height: 1.35;
        }

        .va-email-box {
          grid-column: 1 / -1;
        }

        .va-email-value {
          font-size: 13px;
          overflow-wrap: anywhere;
          word-break: break-word;
        }


        .va-card-wrap {
          margin-bottom: 12px;
          animation: fadeUp .25s ease;
        }

        .va-section-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #6d28d9;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          padding: 7px 10px;
          border-radius: 999px;
        }

        .va-best-card {
          border-radius: 24px;
          border: 1px solid rgba(196,181,253,0.7);
          background: linear-gradient(180deg, rgba(252,251,255,0.98), rgba(255,255,255,0.98));
          box-shadow: 0 16px 32px rgba(124,58,237,0.1);
          overflow: hidden;
        }

        .va-best-grid {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 14px;
          padding: 14px;
        }

        .va-best-image-shell {
          position: relative;
          border-radius: 20px;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.92), rgba(245,243,255,0.9)),
            linear-gradient(180deg, #fff, #f8fafc);
          min-height: 156px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          overflow: hidden;
          border: 1px solid rgba(237,233,254,0.95);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .va-best-image,
        .va-product-image,
        .va-cart-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .va-best-image { height: 130px; }
        .va-product-image { height: 118px; }
        .va-cart-image { height: 82px; }

        .va-no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          background: linear-gradient(135deg,#f5f3ff,#faf5ff);
          border-radius: 16px;
        }

        .va-best-chip,
        .va-discount-chip,
        .va-small-discount-chip {
          position: absolute;
          z-index: 2;
          font-size: 10px;
          font-weight: 800;
          border-radius: 999px;
          padding: 5px 8px;
        }

        .va-best-chip {
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #fff;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
        }

        .va-discount-chip,
        .va-small-discount-chip {
          top: 10px;
          right: 10px;
          color: #fff;
          background: #ef4444;
        }

        .va-best-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
        }

        .va-info-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #6d28d9;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          border-radius: 999px;
          padding: 6px 10px;
          margin-bottom: 10px;
        }

        .va-best-title {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.45;
          color: #111827;
        }

        .va-best-desc,
        .va-product-desc {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.6;
        }

        .va-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .va-tag-row-small {
          margin-top: 4px;
        }

        .va-mini-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          font-size: 11px;
          font-weight: 700;
          color: #4b5563;
          background: #f3f4f6;
          border-radius: 999px;
        }

        .va-mini-tag-purple {
          color: #6d28d9;
          background: #f5f3ff;
        }

        .va-mini-tag-green {
          color: #047857;
          background: #ecfdf5;
        }

        .va-footer-row,
        .va-product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .va-price-box {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
        }

        .va-price-main {
          font-size: 20px;
          font-weight: 800;
          color: #7c3aed;
        }

        .va-price-mrp {
          font-size: 12px;
          text-decoration: line-through;
          color: #9ca3af;
        }

        .va-price-small {
          font-size: 16px;
          font-weight: 800;
          color: #7c3aed;
        }

        .va-price-mrp-small {
          font-size: 11px;
          text-decoration: line-through;
          color: #9ca3af;
        }

        .va-cart-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          color: #6d28d9;
          background: rgba(124,58,237,0.07);
          padding: 7px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }
.va-help-btn {
  height: 46px;
  min-width: 88px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 0 16px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(34,197,94,0.18);
}

.va-help-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.va-help-panel {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255,255,255,0.78);
  border: 1px solid rgba(15,23,42,0.08);
}

.va-query-upload-box {
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px dashed rgba(124,58,237,0.35);
  background: linear-gradient(180deg, rgba(245,243,255,0.9), rgba(255,255,255,0.92));
}

.va-query-upload-title {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 800;
  color: #4c1d95;
}

.va-query-upload-sub {
  margin: 0 0 10px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.va-query-upload-btn {
  width: 100%;
  min-height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(124,58,237,0.22);
  background: #ffffff;
  color: #5b21b6;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform .18s ease, box-shadow .18s ease;
}

.va-query-upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(124,58,237,0.1);
}

.va-query-file-name {
  margin: 8px 0 0;
  font-size: 12px;
  color: #111827;
  word-break: break-all;
}

.va-bottom-stop-wrap {
  display: flex;
  justify-content: center;
  margin-top: 14px;
}

.va-bottom-stop-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(15,23,42,0.08);
  background: #111827;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.va-bottom-stop-btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

@media (max-width: 640px) {
  .va-footer-row-main {
    flex-wrap: wrap;
    gap: 10px;
  }

  .va-help-btn {
    width: 100%;
  }
}
        .va-products-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .va-product-card {
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,252,0.98));
          border: 1px solid #f0edfd;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(124,58,237,0.06);
        }

        .va-product-image-shell {
          position: relative;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(248,250,252,0.95)),
            linear-gradient(180deg, #fff, #f8fafc);
          min-height: 138px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-bottom: 1px solid rgba(243,244,246,0.95);
        }

        .va-product-content {
          padding: 12px;
        }

        .va-product-title {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: #111827;
          line-height: 1.45;
          min-height: 38px;
        }

        .va-control-box,
        .va-control-box-full {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .va-cart-btn {
          height: 36px;
          border: none;
          border-radius: 12px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          transition: transform .18s ease, opacity .18s ease;
        }

        .va-cart-btn:hover,
        .va-stepper-btn:hover,
        .va-primary-wide-btn:hover,
        .va-secondary-wide-btn:hover,
        .va-mic-btn:hover {
          transform: translateY(-1px);
        }

        .va-cart-btn-add {
          color: #fff;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow: 0 12px 24px rgba(124,58,237,0.2);
        }

        .va-stepper {
          height: 36px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px;
          border-radius: 12px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
        }

        .va-stepper-btn {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 8px;
          background: #fff;
          color: #6d28d9;
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .va-stepper-count {
          min-width: 18px;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          color: #111827;
        }

        .va-address-list,
        .va-cart-list {
          display: grid;
          gap: 12px;
        }

        .va-address-card {
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,250,251,0.98));
          border: 1px solid #ede9fe;
          padding: 12px;
          box-shadow: 0 8px 18px rgba(15,23,42,0.04);
        }

        .va-address-card.confirmed {
          border: 1px solid rgba(34,197,94,0.35);
          box-shadow: 0 10px 22px rgba(34,197,94,0.10);
          background: linear-gradient(180deg, rgba(240,253,244,0.98), rgba(255,255,255,0.98));
        }

        .va-cart-card {
          border-radius: 20px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.99), rgba(250,248,255,0.98));
          border: 1px solid rgba(221,214,254,0.85);
          padding: 12px;
          box-shadow: 0 12px 24px rgba(124,58,237,0.08);
        }

        .va-cart-card-top {
          display: grid;
          grid-template-columns: 92px 1fr;
          gap: 12px;
          align-items: center;
        }

        .va-cart-image-shell {
          height: 92px;
          border-radius: 18px;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(245,243,255,0.95)),
            linear-gradient(180deg, #fff, #f8fafc);
          border: 1px solid rgba(237,233,254,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          overflow: hidden;
        }

        .va-cart-main {
          min-width: 0;
        }

        .va-cart-heading-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .va-cart-item-title {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: #111827;
          line-height: 1.45;
        }

        .va-cart-qty-badge {
          flex-shrink: 0;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          color: #6d28d9;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
        }

        .va-cart-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .va-cart-price-line {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(124,58,237,0.04);
          border: 1px solid rgba(237,233,254,0.95);
        }

        .va-cart-price-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .va-cart-price-label {
          font-size: 10px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .va-cart-price-value {
          font-size: 14px;
          color: #111827;
        }

        .va-cart-total-value {
          font-size: 16px;
          color: #7c3aed;
        }

        .va-cart-divider {
          width: 1px;
          align-self: stretch;
          background: rgba(196,181,253,0.7);
        }

        .va-address-option {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          cursor: pointer;
        }

        .va-address-radio {
          margin-top: 3px;
          accent-color: #7c3aed;
        }

        .va-address-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 6px;
          font-size: 13px;
          font-weight: 800;
          color: #111827;
        }

        .va-address-text,
        .va-summary-text {
          margin: 0;
          font-size: 12px;
          color: #4b5563;
          line-height: 1.6;
        }

        .va-confirmed-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .va-summary-card {
          margin-top: 2px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(109,40,217,0.06), rgba(255,255,255,0.98));
          padding: 14px;
          border: 1px solid rgba(221,214,254,0.95);
          box-shadow: 0 8px 18px rgba(124,58,237,0.05);
        }

        .va-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .va-summary-box {
          border-radius: 14px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(237,233,254,0.95);
          padding: 10px;
        }

        .va-summary-box-label {
          display: block;
          font-size: 10px;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .va-summary-box-value {
          font-size: 15px;
          font-weight: 800;
          color: #111827;
        }

        .va-summary-box-value.primary {
          color: #7c3aed;
        }

        .va-action-strip {
          padding: 10px 14px 0;
          background: transparent;
          flex-shrink: 0;
        }

        .va-action-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .va-primary-wide-btn {
          width: 100%;
          height: 44px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow: 0 12px 24px rgba(124,58,237,0.18);
        }

                .va-stop-voice-btn {
          height: 38px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          background: linear-gradient(135deg, rgba(239,68,68,0.98), rgba(220,38,38,0.98));
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(127,29,29,0.22);
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .va-stop-voice-btn:hover {
          transform: translateY(-1px);
        }

        .va-stop-voice-btn-header {
          margin-right: 2px;
        }

        .va-stop-voice-btn .va-speaker-ring {
          position: static;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 0 0 6px rgba(255,255,255,0.12);
          animation: vaMiniDotBlink 1.2s ease-in-out infinite;
        }

.va-secondary-wide-btn {
          width: 100%;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(212, 175, 55, 0.45);
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          color: #7a5600;
          background: linear-gradient(
            135deg,
            rgba(255, 248, 220, 0.98),
            rgba(255, 223, 128, 0.98)
          );
          box-shadow:
            0 10px 22px rgba(212, 175, 55, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.75);
        }

        .va-footer {
          padding: 12px 14px 14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,248,255,0.98));
          border-top: 1px solid rgba(237,233,254,0.95);
          flex-shrink: 0;
        }

        .va-footer-row-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
        }

        .va-mic-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow: 0 14px 28px rgba(109,40,217,0.30);
          flex-shrink: 0;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .va-mic-btn:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 18px 34px rgba(109,40,217,0.34);
        }

        .va-mic-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .va-mic-btn-listening {
          background: linear-gradient(135deg,#ef4444,#dc2626);
          box-shadow: 0 16px 32px rgba(239,68,68,0.28);
        }

        .va-mic-ring,
        .va-mini-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          animation: pulseRing 1.2s ease-out infinite;
        }

        .va-footer-info {
          min-width: 0;
          width: 100%;
        }

        .va-footer-title {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: #111827;
        }

        .va-footer-sub {
          margin: 3px auto 0;
          font-size: 11px;
          color: #6b7280;
          line-height: 1.45;
          min-height: 0;
          max-width: 360px;
        }

        .va-typing-row {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
        }

        .va-typing-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .va-typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          animation: typingDot 1.2s infinite ease-in-out;
        }

        .va-typing-dots span:nth-child(2) {
          animation-delay: .15s;
        }

        .va-typing-dots span:nth-child(3) {
          animation-delay: .3s;
        }

        .va-typing-text {
          font-size: 11px;
          font-weight: 700;
          color: #6d28d9;
        }

        .va-speaker-badge {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #ecfdf5;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #d1fae5;
        }

        .va-stop-audio-btn {
          border: none;
          cursor: pointer;
        }

        .va-speaker-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          border: 2px solid rgba(16,185,129,0.28);
          animation: pulseRing 1.2s ease-out infinite;
        }

        .va-mini-dock {
          position: fixed;
          right: 24px;
          bottom: 96px;
          z-index: 10020;
          display: flex;
          justify-content: flex-end;
          pointer-events: none;
        }

        .va-mini-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          max-width: calc(100vw - 120px);
          pointer-events: auto;
        }

        .va-mini-pill {
          position: relative;
          min-width: 155px;
          max-width: 176px;
          padding: 11px 12px;
          border-radius: 18px;
          cursor: pointer;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.72), rgba(255,255,255,0.14) 36%),
            linear-gradient(135deg, #fff6c4 0%, #f2c94c 34%, #d4af37 68%, #b8860b 100%);
          border: 1px solid rgba(255, 235, 153, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 14px 28px rgba(180, 138, 0, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.78),
            inset 0 -1px 0 rgba(140, 96, 0, 0.18);
          overflow: visible;
        }

        .va-mini-pill-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 22px;
          background: rgba(255, 215, 0, 0.22);
          z-index: 0;
          animation: vaMiniPulse 1.8s ease-out infinite;
          pointer-events: none;
        }

        .va-mini-pill-pulse-delay {
          animation-delay: 0.9s;
        }

        .va-mini-pill-top,
        .va-mini-sub {
          position: relative;
          z-index: 1;
        }

        .va-mini-pill.listening .va-mini-pill-pulse {
          background: rgba(239, 68, 68, 0.22);
        }

        .va-mini-pill.processing .va-mini-pill-pulse {
          background: rgba(245, 158, 11, 0.2);
        }

        .va-mini-pill.speaking .va-mini-pill-pulse {
          background: rgba(34, 197, 94, 0.2);
        }

        .va-mini-pill-top {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4a3200;
          min-width: 0;
        }

        .va-mini-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
          animation: vaMiniDotBlink 1.2s ease-in-out infinite;
        }

        .va-mini-title {
          font-size: 12px;
          font-weight: 800;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #4a3200;
        }

        .va-mini-sub {
          margin: 6px 0 0;
          font-size: 11px;
          color: #6c5200;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .va-order-list,
        .va-plan-list {
          display: grid;
          gap: 12px;
        }

        .va-order-card,
        .va-plan-card {
          border-radius: 18px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          background: linear-gradient(180deg, #ffffff, #fafafa);
          padding: 14px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
        }

        .va-order-top,
        .va-plan-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }

        .va-order-id,
        .va-plan-title {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          color: #111827;
        }

        .va-order-date,
        .va-plan-id {
          margin: 4px 0 0;
          font-size: 12px;
          color: #6b7280;
        }

        .va-order-status,
        .va-plan-badge {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .va-order-status.placed,
        .va-order-status.packed,
        .va-order-status.default {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .va-order-status.confirmed,
        .va-order-status.completed,
        .va-order-status.delivered {
          color: #059669;
          background: #ecfdf5;
        }

        .va-order-status.cancelled {
          color: #dc2626;
          background: #fef2f2;
        }

        .va-plan-badge.active {
          color: #059669;
          background: #ecfdf5;
        }

        .va-plan-badge.inactive {
          color: #6b7280;
          background: #f3f4f6;
        }

        .va-order-grid,
        .va-plan-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .va-order-box,
        .va-plan-box {
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
        }

        .va-order-box-label,
        .va-plan-box-label {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        .va-order-box-value,
        .va-plan-box-value {
          font-size: 14px;
          font-weight: 800;
          color: #111827;
        }

        .va-plan-box-value.primary {
          color: #7c3aed;
        }

        .va-plan-main-amount {
          font-size: 24px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 12px;
        }

        .va-order-meta-list {
          margin-top: 12px;
          display: grid;
          gap: 8px;
        }

        .va-order-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
          color: #4b5563;
        }

        .va-order-meta-row strong {
          color: #111827;
        }

        .va-order-note {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          font-weight: 600;
        }


        .va-simple-order-card {
          padding: 24px 26px 0;
          overflow: hidden;
        }

        .va-order-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 14px;
          font-size: 15px;
          color: #4b5563;
        }

        .va-order-detail-row strong {
          color: #111827;
          font-size: 16px;
          font-weight: 800;
        }

        .va-order-delivery-section {
          margin-top: 22px;
        }

        .va-order-section-label {
          display: block;
          color: #4b5563;
          font-size: 15px;
          margin-bottom: 8px;
        }

        .va-order-delivery-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          background: #fbf2ff;
          color: #111827;
          font-size: 15px;
        }

        .va-order-delivery-pill svg {
          color: #8b22d9;
          flex-shrink: 0;
        }

        .va-view-order-btn {
          margin: 24px -26px 0;
          width: calc(100% + 52px);
          border-radius: 0;
          min-height: 60px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }



        /* Final compact responsive UI overrides */
        .va-header {
          padding: 13px 14px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .va-header-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
        }

        .va-header-title {
          font-size: 15px;
        }

        .va-header-subtitle {
          font-size: 11px;
          margin-top: 2px;
        }

        .va-header-actions {
          gap: 6px;
        }

        .va-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 11px;
        }

        .va-body {
          padding: 12px;
        }

        .va-welcome {
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 22px rgba(124,58,237,0.07);
        }

        .va-welcome-top {
          gap: 10px;
          margin-bottom: 10px;
        }

        .va-welcome-bot {
          width: 44px;
          height: 44px;
          border-radius: 15px;
        }

        .va-welcome-title {
          font-size: 15px;
        }

        .va-welcome-sub {
          font-size: 12px;
          line-height: 1.45;
        }

        .va-quick-row {
          gap: 7px;
          margin-top: 10px;
        }

        .va-quick-chip {
          padding: 7px 10px;
          font-size: 11px;
        }

        @media (max-width: 1024px) {
          .va-shell {
            width: 48%;
            min-width: 340px;
            max-width: 520px;
          }

          .va-mini-dock {
            right: 20px;
            bottom: 88px;
          }

          .va-mini-pill {
            max-width: 150px;
          }
        }

        @media (max-width: 767px) {
          .va-shell {
            top: 78px;
            right: 10px;
            left: 10px;
            bottom: 10px;
            width: auto;
            min-width: 0;
            max-width: none;
          }

          .va-panel {
            width: 100%;
            max-width: 100%;
            max-height: calc(100vh - 88px);
            border-radius: 22px;
          }

          .va-best-grid {
            grid-template-columns: 1fr;
          }

          .va-products-grid {
            grid-template-columns: 1fr;
          }

          .va-summary-grid,
          .va-order-grid,
          .va-plan-grid {
            grid-template-columns: 1fr;
          }

          .va-cart-card-top {
            grid-template-columns: 78px 1fr;
          }

          .va-footer-row-main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .va-speaker-badge,
          .va-stop-audio-btn {
            grid-column: 1 / -1;
            justify-self: end;
          }

          .va-mini-dock {
            right: 14px;
            bottom: 88px;
          }

          .va-mini-pill {
            min-width: 142px;
            max-width: 160px;
          }

          .va-action-double {
            grid-template-columns: 1fr;
          }
        }


        .va-query-review-card {
          margin-top: 16px;
          padding: 16px;
          border-radius: 22px;
          background:
            radial-gradient(circle at top left, rgba(124,58,237,0.12), transparent 38%),
            linear-gradient(180deg, #ffffff, #faf7ff);
          border: 1px solid rgba(124,58,237,0.14);
          box-shadow: 0 14px 34px rgba(76,29,149,0.10);
        }

        .va-query-review-head { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 14px; }
        .va-query-review-icon { width: 42px; height: 42px; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #fff; background: linear-gradient(135deg, #7c3aed, #5b21b6); box-shadow: 0 10px 22px rgba(124,58,237,0.25); flex-shrink: 0; }
        .va-query-review-title { margin: 0; font-size: 15px; font-weight: 900; color: #111827; }
        .va-query-review-sub { margin: 3px 0 0; font-size: 12px; color: #6b7280; line-height: 1.45; }
        .va-query-text-box { padding: 13px 14px; border-radius: 16px; background: #f8f5ff; border: 1px solid rgba(124,58,237,0.12); margin-bottom: 12px; }
        .va-query-text-box p { margin: 0; font-size: 13px; color: #1f2937; line-height: 1.6; font-weight: 600; }
        .va-query-upload-box { margin-top: 12px; padding: 12px; border-radius: 18px; border: 1px dashed rgba(124,58,237,0.35); background: linear-gradient(180deg, rgba(245,243,255,0.9), rgba(255,255,255,0.95)); }
        .va-query-upload-btn { width: 100%; min-height: 44px; border-radius: 15px; border: 1px solid rgba(124,58,237,0.22); background: #ffffff; color: #5b21b6; font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px; transition: all .18s ease; }
        .va-query-upload-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(124,58,237,0.12); }
        .va-query-file-pill { margin-top: 10px; padding: 9px 11px; border-radius: 13px; background: #ede9fe; color: #4c1d95; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; word-break: break-all; }
        .va-query-action-row {
          display: grid;
          grid-template-columns: 1.35fr 0.95fr;
          gap: 12px;
          margin-top: 16px;
          width: 100%;
        }

        .va-query-submit-btn,
        .va-query-cancel-btn,
        .va-query-record-again-btn {
          position: relative;
          min-height: 48px;
          width: 100%;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .va-query-submit-btn {
          border: 1px solid rgba(22, 163, 74, 0.16);
          color: #ffffff;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0) 42%),
            linear-gradient(135deg, #16a34a 0%, #22c55e 48%, #15803d 100%);
          box-shadow:
            0 14px 28px rgba(22, 163, 74, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .va-query-cancel-btn {
          border: 1px solid rgba(239, 68, 68, 0.18);
          color: #b91c1c;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(254,242,242,0.98));
          box-shadow:
            0 10px 22px rgba(185, 28, 28, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.85);
        }

        .va-query-record-again-btn {
          grid-column: 1 / -1;
          min-height: 46px;
          border: 1px solid rgba(124, 58, 237, 0.18);
          color: #5b21b6;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.88), rgba(245,243,255,0.98));
          box-shadow:
            0 10px 22px rgba(91, 33, 182, 0.09),
            inset 0 1px 0 rgba(255,255,255,0.85);
        }

        .va-query-submit-btn:hover,
        .va-query-cancel-btn:hover,
        .va-query-record-again-btn:hover {
          transform: translateY(-2px);
        }

        .va-query-submit-btn:hover {
          box-shadow:
            0 18px 34px rgba(22, 163, 74, 0.34),
            inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .va-query-cancel-btn:hover {
          background: linear-gradient(180deg, #ffffff, #fee2e2);
          border-color: rgba(239, 68, 68, 0.28);
        }

        .va-query-record-again-btn:hover {
          background: linear-gradient(180deg, #ffffff, #ede9fe);
          border-color: rgba(124, 58, 237, 0.28);
        }

        .va-query-submit-btn:active,
        .va-query-cancel-btn:active,
        .va-query-record-again-btn:active {
          transform: translateY(0) scale(0.99);
        }

        .va-query-submit-btn:disabled,
        .va-query-cancel-btn:disabled,
        .va-query-record-again-btn:disabled,
        .va-query-upload-btn:disabled {
          opacity: 0.62;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .va-query-review-card {
            padding: 14px;
            border-radius: 20px;
          }

          .va-query-action-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .va-query-submit-btn,
          .va-query-cancel-btn,
          .va-query-record-again-btn {
            min-height: 50px;
            border-radius: 15px;
            font-size: 13.5px;
          }

          .va-query-record-again-btn {
            grid-column: auto;
          }
        }

        @media (max-width: 420px) {
          .va-query-action-row {
            gap: 9px;
            margin-top: 14px;
          }

          .va-query-submit-btn,
          .va-query-cancel-btn,
          .va-query-record-again-btn {
            min-height: 48px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="va-shell">
        {isMinimized ? (
          minimizedBubble
        ) : (
          <div className="va-panel">
            <div className="va-header">
              <div className="va-header-left">
                <div className="va-header-icon">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="va-header-title">Voice Assistant</h3>
                  <p className="va-header-subtitle">
                    Ask in voice for products, cart, address and order support
                  </p>
                </div>
              </div>

              <div className="va-header-actions">
                <button
                  type="button"
                  className={`va-icon-btn va-header-help-btn ${
                    isQueryPromptActive || recordingMode === "help"
                      ? "active"
                      : ""
                  }`}
                  onClick={handleHelpClick}
                  disabled={!speechSupported || isVoiceLoading || isHelpPending}
                  title="Help"
                  aria-label="Help"
                >
                  Help <HelpCircle size={16} />
                </button>

                <button
                  type="button"
                  className="va-icon-btn"
                  onClick={() => setIsMinimized(true)}
                  title="Minimize"
                >
                  <Minimize2 size={16} />
                </button>

                <button
                  type="button"
                  className="va-icon-btn"
                  onClick={clearVoiceChat}
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  type="button"
                  className="va-icon-btn"
                  onClick={handleClose}
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="va-body">
              {showWelcome && (
                <div className="va-welcome">
                  <div className="va-welcome-top">
                    <div className="va-welcome-bot">
                      <Bot size={24} />
                    </div>

                    <div>
                      <h4 className="va-welcome-title">How can I help you?</h4>
                      <p className="va-welcome-sub">
                        Speak in natural English to search products, view cart
                        or place order
                      </p>
                    </div>
                  </div>

                  <div className="va-quick-row">
                    <span className="va-quick-chip">Show rice products</span>
                    <span className="va-quick-chip">View my cart</span>
                    <span className="va-quick-chip">Place my order</span>
                  </div>
                </div>
              )}

              {voiceMessages.map((msg) => {
                if (
                  msg.type === "user" ||
                  msg.type === "ai" ||
                  msg.type === "loading" ||
                  msg.type === "addressConfirm"
                ) {
                  return (
                    <div
                      key={msg.id}
                      className={`va-msg-block ${msg.type === "user" ? "user" : "ai"}`}
                    >
                      <div
                        className={`va-msg ${
                          msg.type === "loading"
                            ? "loading"
                            : msg.type === "user"
                              ? "user"
                              : "ai"
                        }`}
                      >
                        {msg.type === "loading" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>{msg.text || "Processing..."}</span>
                          </>
                        ) : msg.type === "ai" ? (
                          renderAiMessageText(msg)
                        ) : msg.text?.trim() ? (
                          <span>{msg.text}</span>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "profile") {
                  const profile = msg.data as ProfileResponse;
                  if (!profile) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      {renderProfileCard(profile)}
                    </div>
                  );
                }

                if (msg.type === "wallet") {
                  const wallet = msg.data as WalletResponse;
                  if (!wallet) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      {renderWalletCard(wallet)}
                    </div>
                  );
                }

                if (msg.type === "bestMatch") {
                  const bestMatch = msg.data as ProductItem;
                  if (!bestMatch) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <Star size={14} />
                        Best Match Product
                      </div>
                      {renderProductCard(bestMatch, true)}
                    </div>
                  );
                }

                if (msg.type === "products") {
                  const categories = (msg.data as ProductCategory[]) || [];
                  const products = flattenProducts(categories);
                  const sectionTitle =
                    categories.length === 1 && categories[0]?.categoryName
                      ? categories[0].categoryName
                      : categories.some((category) => category.categoryName === "Available Offers")
                        ? "Recommended Products & Offers"
                        : "Recommended Products";

                  if (!products.length) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <Package size={14} />
                        {sectionTitle}
                      </div>

                      <div className="va-products-grid">
                        {products.map((item) => renderProductCard(item))}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "addresses") {
                  const addresses = (msg.data as AddressItem[]) || [];
                  if (!addresses.length) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <MapPin size={14} />
                        Delivery Address
                      </div>

                      <div className="va-address-list">
                        {addresses.map((address) => {
                          const isConfirmed = confirmedAddressId === address.id;

                          return (
                            <div
                              key={address.id}
                              className={`va-address-card ${isConfirmed ? "confirmed" : ""}`}
                            >
                              <label className="va-address-option">
                                <input
                                  type="radio"
                                  className="va-address-radio"
                                  checked={selectedAddressId === address.id}
                                  onChange={() => {
                                    setSelectedAddressId(address.id);
                                    if (
                                      confirmedAddressId &&
                                      confirmedAddressId !== address.id
                                    ) {
                                      setConfirmedAddressId("");
                                    }
                                  }}
                                />

                                <div>
                                  <p className="va-address-title">
                                    <Home size={14} />
                                    {getAddressLabel(address)}
                                  </p>

                                  <p className="va-address-text">
                                    {getFullAddressLine(address)}
                                  </p>

                                  {isConfirmed && (
                                    <span className="va-confirmed-chip">
                                      <CheckCircle2 size={13} />
                                      Confirmed
                                    </span>
                                  )}
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "orders") {
                  const orders = (msg.data as PreviousOrder[]) || [];
                  if (!orders.length) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <Receipt size={14} />
                        Previous Orders
                      </div>

                      <div className="va-order-list">
                        {orders.map((order, index) =>
                          renderOrderCard(order, index, msg.id),
                        )}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "subscriptions") {
                  const plans = (msg.data as SubscriptionPlan[]) || [];
                  if (!plans.length) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <Sparkles size={14} />
                        Subscription Plans
                      </div>

                      <div className="va-plan-list">
                        {plans.map((plan, index) =>
                          renderSubscriptionCard(plan, index, msg.id),
                        )}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "cart") {
                  const cartData = msg.data as CartResponse;
                  const cartItemsList =
                    cartData?.customerCartResponseList || [];

                  if (!cartItemsList.length) return null;

                  return (
                    <div key={msg.id} className="va-card-wrap">
                      <div className="va-section-label">
                        <Receipt size={14} />
                        Cart Details
                      </div>

                      <div className="va-cart-list">
                        {cartItemsList.map((item, index) =>
                          renderCartCard(item, index, msg.id),
                        )}
                      </div>

                      <div className="va-summary-card">
                        <p
                          className="va-summary-text"
                          style={{ marginBottom: 10 }}
                        >
                          Your current cart summary
                        </p>

                        <div className="va-summary-grid">
                          <div className="va-summary-box">
                            <span className="va-summary-box-label">
                              Cart Value
                            </span>
                            <span className="va-summary-box-value">
                              {formatCurrency(cartData.totalCartValue)}
                            </span>
                          </div>

                          <div className="va-summary-box">
                            <span className="va-summary-box-label">GST</span>
                            <span className="va-summary-box-value">
                              {formatCurrency(cartData.totalGstAmountToPay)}
                            </span>
                          </div>

                          <div className="va-summary-box">
                            <span className="va-summary-box-label">
                              Amount To Pay
                            </span>
                            <span className="va-summary-box-value primary">
                              {formatCurrency(cartData.amountToPay)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {liveTranscript && isListening && (
                <div className="va-msg-block user">
                  <div className="va-msg va-live-bubble">{liveTranscript}</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showAddressConfirmButton && (
              <div className="va-action-strip">
                <div className="va-action-double">
                  <button
                    onClick={handleConfirmSelectedAddress}
                    disabled={!selectedAddressId || isPlacingOrder}
                    className="va-secondary-wide-btn"
                  >
                    {confirmedAddressId &&
                    confirmedAddressId === selectedAddressId
                      ? "Address Confirmed"
                      : "Confirm Address"}
                  </button>

                  <button
                    onClick={handleConfirmAddressOrder}
                    disabled={isPlacingOrder || !confirmedAddressId}
                    className="va-primary-wide-btn"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}

            <div className="va-footer">
              <div className="va-footer-row-main">
                <button
                  onClick={() => {
                    if (
                      isListening ||
                      isAssistantSpeaking ||
                      isQueryPromptActive
                    ) {
                      handleStopVoiceAssistant();
                    } else {
                      handleVoiceRecord("normal");
                    }
                  }}
                  disabled={!speechSupported || isVoiceLoading || isHelpPending}
                  className={`va-mic-btn ${
                    isListening || isAssistantSpeaking || isQueryPromptActive
                      ? "va-mic-btn-listening"
                      : ""
                  }`}
                  title={
                    isListening || isAssistantSpeaking || isQueryPromptActive
                      ? "Stop"
                      : "Start voice"
                  }
                >
                  {(isListening ||
                    isAssistantSpeaking ||
                    isQueryPromptActive) && <span className="va-mic-ring" />}

                  {isVoiceLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : isListening ||
                    isAssistantSpeaking ||
                    isQueryPromptActive ? (
                    <Square size={18} />
                  ) : (
                    <Mic size={20} />
                  )}
                </button>

                <div className="va-footer-info">
                  <p className="va-footer-title">{footerTitle}</p>
                  <p className="va-footer-sub">{footerSubtitle}</p>

                  {(isListening || isVoiceLoading) && (
                    <div className="va-typing-row">
                      <div className="va-typing-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="va-typing-text">
                        {isListening
                          ? "Listening live"
                          : "Understanding request"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isHelpPending && (
                <div className="va-help-panel va-query-review-card">
                  <div className="va-query-review-head">
                    <div className="va-query-review-icon">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <p className="va-query-review-title">Review Your Query</p>
                      <p className="va-query-review-sub">
                        Check your voice query, upload attachment if needed,
                        then submit.
                      </p>
                    </div>
                  </div>

                  <div className="va-query-text-box">
                    <p>
                      {pendingHelpText.trim() ? pendingHelpText : ""}
                    </p>
                  </div>

                  <div className="va-query-upload-box">
                    <input
                      id="va-query-attachment"
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        setQueryAttachment(file);
                        setUploadedDocumentId("");
                      }}
                    />

                    <button
                      type="button"
                      className="va-query-upload-btn"
                      onClick={() =>
                        document.getElementById("va-query-attachment")?.click()
                      }
                      disabled={isUploadingQueryAttachment || isVoiceLoading}
                    >
                      <UploadCloud size={17} />
                      {queryAttachment
                        ? "Change Attachment"
                        : "Upload Attachment"}
                    </button>

                    {queryAttachment && (
                      <div className="va-query-file-pill">
                        <FileText size={15} />
                        <span>{queryAttachment.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="va-help-actions va-query-action-row">
                    <button
                      onClick={handleHelpSubmit}
                      disabled={isVoiceLoading || isUploadingQueryAttachment}
                      className="va-query-submit-btn"
                    >
                      {isUploadingQueryAttachment ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </>
                      ) : isVoiceLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Query
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleHelpCancel}
                      disabled={isVoiceLoading || isUploadingQueryAttachment}
                      className="va-query-cancel-btn"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPendingHelpText("");
                        setPendingHelpAudioBlob(null);
                        setIsHelpPending(false);
                        setQueryAttachment(null);
                        setUploadedDocumentId("");
                        setLiveTranscript("");

                        transcriptRef.current = "";
                        finalTranscriptRef.current = "";
                        lastUserSpokenTextRef.current = "";

                        handleVoiceRecord("help");
                      }}
                      disabled={isVoiceLoading || isUploadingQueryAttachment}
                      className="va-query-record-again-btn"
                    >
                      <RefreshCcw size={16} />
                      Record Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VoiceWindow;