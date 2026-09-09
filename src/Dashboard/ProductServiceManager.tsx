import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
import Swal from "sweetalert2";
const USER_ID_STORAGE_KEY = "userId";



type ProductCondition = "NEW" | "USED" | "REFURBISHED";
type ServiceMode = "ONLINE" | "OFFLINE" | "HYBRID";
type PriceType = "FIXED" | "HOURLY" | "NEGOTIABLE" | "PER_SESSION";
type EntryKind = "PRODUCT" | "SERVICE" | "COMPANY";
type TriState = "" | "true" | "false";

interface ProductEntry {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  keyFeatures: string;
  price: string;
  availability: string;
  imageUrl: string;
  color: string;
  brand: string;
  quantity: string;
  quantityUnit: string;
  variant: string;
  mrp: string;
  stockQuantity: string;
  productCondition: ProductCondition | "";
  returnAvailable: TriState;
  returnDays: string;
  warrantyAvailable: TriState;
  warrantyPeriod: string;
  deliveryTime: string;
  priceType: PriceType;
}

interface ServiceEntry {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  keyFeatures: string;
  price: string;
  availability: string;
  imageUrl: string;
  providerName: string;
  businessName: string;
  serviceMode: ServiceMode | "";
  serviceLocation: string;
  serviceDuration: string;
  priceType: PriceType;
  bookingRequired: TriState;
  targetCustomers: string;
  cancellationPolicy: string;
  refundPolicy: string;
  brochureUrl: string;
}

interface CompanyEntry {
  id: string;
  companyDescription: string;
  companyName: string;
  gstDocumentUrl: string;
  gstNumber: string;
  linkedinUrl: string;
  locations: string;
  logoUrl: string;
  type: string;
  websiteUrl: string;
}

type FieldErrors = Record<string, string | undefined>;

type SaveStatus = "idle" | "saving" | "saved" | "error";


const PRODUCT_CATEGORIES = [
  "Medical & Pharmacy",
  "Food & Beverages",
  "Textiles & Apparel",
  "Electronics",
  "Agriculture & Farming",
  "Automobile & Spares",
  "Handicrafts",
  "Books & Stationery",
  "Home & Kitchen",
  "Jewellery",
  "Health & Fitness",
  "Sports",
];

const SERVICE_CATEGORIES = [
  "Healthcare",
  "Education & Training",
  "Financial & Insurance",
  "Legal Services",
  "IT & Software",
  "Home Services",
  "Event Management",
  "Consulting",
  "Transportation",
  "Real Estate",
  "Health & Fitness",
  "Sports",
];

const AVAILABILITY_OPTIONS = [
  "Always Available",
  "In Stock",
  "Made to Order",
  "By Appointment Only",
  "Weekdays Only",
  "Seasonal",
];

const QUANTITY_UNITS = [
  "Units",
  "Pieces (pcs)",
  "Kg",
  "Grams (g)",
  "Liters (L)",
  "Boxes",
  "Packets",
  "Meters",
  "Bottles",
  "Sets",
  "Dozens",
];

const PRODUCT_CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
];

const SERVICE_MODES: { value: ServiceMode; label: string }[] = [
  { value: "ONLINE", label: "Online / Virtual" },
  { value: "OFFLINE", label: "In-Person / Onsite" },
  { value: "HYBRID", label: "Hybrid (Online & In-Person)" },
];

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const PRICE_TYPES: { value: PriceType; label: string }[] = [
  { value: "FIXED", label: "Fixed Price" },
  { value: "HOURLY", label: "Hourly Rate" },
  { value: "NEGOTIABLE", label: "Negotiable" },
  { value: "PER_SESSION", label: "Per Session / Consultation" },
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: string) => UUID_REGEX.test(v);
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];

const uid = () => Math.random().toString(36).slice(2, 10);



const emptyProduct = (): ProductEntry => ({
  id: uid(),
  name: "",
  category: "",
  subCategory: "",
  description: "",
  keyFeatures: "",
  price: "",
  availability: "",
  imageUrl: "",
  color: "",
  brand: "",
  quantity: "",
  quantityUnit: "",
  variant: "",
  mrp: "",
  stockQuantity: "",
  productCondition: "",
  returnAvailable: "",
  returnDays: "",
  warrantyAvailable: "",
  warrantyPeriod: "",
  deliveryTime: "",
  priceType: "FIXED",
});

const emptyService = (): ServiceEntry => ({
  id: uid(),
  name: "",
  category: "",
  subCategory: "",
  description: "",
  keyFeatures: "",
  price: "",
  availability: "",
  imageUrl: "",
  providerName: "",
  businessName: "",
  serviceMode: "",
  serviceLocation: "",
  serviceDuration: "",
  priceType: "FIXED",
  bookingRequired: "",
  targetCustomers: "",
  cancellationPolicy: "",
  refundPolicy: "",
  brochureUrl: "",
});

const emptyCompany = (): CompanyEntry => ({
  id: "",
  companyDescription: "",
  companyName: "",
  gstDocumentUrl: "",
  gstNumber: "",
  linkedinUrl: "",
  locations: "",
  logoUrl: "",
  type: "",
  websiteUrl: "",
});



const toNumberOrNull = (v: string): number | null =>
  v.trim() !== "" && !isNaN(Number(v)) ? Number(v) : null;

const toIntOrNull = (v: string): number | null =>
  v.trim() !== "" && !isNaN(Number(v)) ? parseInt(v, 10) : null;

const triToBool = (v: TriState): boolean | null =>
  v === "true" ? true : v === "false" ? false : null;

function buildProductPayload(entry: ProductEntry, memberId: string) {
  return {
    id: isUUID(entry.id) ? entry.id : null,
    memberId,
    membersType: "PRODUCT" as const,
    name: entry.name.trim(),
    category: entry.category.trim(),
    subCategory: entry.subCategory.trim() || null,
    description: entry.description.trim() || null,
    keyFeatures: entry.keyFeatures.trim() || null,
    price: toNumberOrNull(entry.price),
    availability: entry.availability.trim() || null,
    imageUrl: entry.imageUrl.trim() || null,
    paymentModes: "",
    color: entry.color.trim() || null,
    brand: entry.brand.trim() || null,
    quantity: toNumberOrNull(entry.quantity),
    quantityUnit: entry.quantityUnit.trim() || null,
    variant: entry.variant.trim() || null,
    mrp: toNumberOrNull(entry.mrp),
    stockQuantity: toIntOrNull(entry.stockQuantity),
    productCondition: entry.productCondition || null,
    returnAvailable: triToBool(entry.returnAvailable),
    returnDays:
      entry.returnAvailable === "true"
        ? toIntOrNull(entry.returnDays.replace(/\D/g, ""))
        : null,
    warrantyAvailable: triToBool(entry.warrantyAvailable),
    warrantyPeriod:
      entry.warrantyAvailable === "true"
        ? entry.warrantyPeriod.trim() || null
        : null,
    deliveryTime: entry.deliveryTime.trim() || null,
    priceType: entry.priceType || "FIXED",
  };
}

function buildServicePayload(entry: ServiceEntry, memberId: string) {
  return {
    id: isUUID(entry.id) ? entry.id : null,
    memberId,
    membersType: "SERVICE" as const,
    name: entry.name.trim(),
    category: entry.category.trim(),
    subCategory: entry.subCategory.trim() || null,
    description: entry.description.trim() || null,
    keyFeatures: entry.keyFeatures.trim() || null,
    price: toNumberOrNull(entry.price),
    availability: entry.availability.trim() || null,
    imageUrl: entry.imageUrl.trim() || null,
    paymentModes: "",
    color: null,
    providerName: entry.providerName.trim() || null,
    businessName: entry.businessName.trim() || null,
    serviceMode: entry.serviceMode || null,
    serviceLocation: entry.serviceLocation.trim() || null,
    serviceDuration: entry.serviceDuration.trim() || null,
    priceType: entry.priceType || "FIXED",
    bookingRequired: triToBool(entry.bookingRequired),
    targetCustomers: entry.targetCustomers.trim() || null,
    cancellationPolicy: entry.cancellationPolicy.trim() || null,
    refundPolicy: entry.refundPolicy.trim() || null,
    brochureUrl: entry.brochureUrl.trim() || null,
  };
}

function buildCompanyPayload(entry: CompanyEntry, userId: string) {
  const now = new Date().toISOString();
  return {
    companyDescription: entry.companyDescription.trim(),
    companyName: entry.companyName.trim(),
    ...(isUUID(entry.id) ? { id: entry.id } : {}),
    createdAt: now,
    gstDocumentUrl: entry.gstDocumentUrl.trim(),
    gstNumber: entry.gstNumber.trim(),
    linkedinUrl: entry.linkedinUrl.trim(),
    locations: entry.locations.trim(),
    logoUrl: entry.logoUrl.trim(),
    status: true,
    type: "ADDCOMPANYADDPRODUCTANDSERVICE",
    updatedAt: now,
    userId,
    websiteUrl: entry.websiteUrl.trim(),
  };
}

/* ------------------------------------------------------------------ */
/*  File upload                                                        */
/* ------------------------------------------------------------------ */

/**
 * Uploads a file (image or document) for the given member and returns the
 * hosted file URL, which is then stored back into the relevant *Url field
 * on the product/service entry.
 */
async function uploadMemberFile(
  file: File,
  userId: string,
  fileType: string = "company",
): Promise<string> {
  if (!userId.trim()) {
    throw new Error("Missing user id — please make sure you're logged in.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const uploadUrl = `${BASE_URL}/marketing-service/campgin/upload-company-logo?fileType=${encodeURIComponent(
    fileType,
  )}&userId=${encodeURIComponent(userId.trim())}`;

  const res = await customerApi.post(uploadUrl, formData, {
    headers: { "Content-Type": undefined },
  });

  if (res.status < 200 || res.status >= 300) {
    const errText =
      typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? "");
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }

  const text =
    typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? "");
  try {
    const json = JSON.parse(text);
    if (typeof json === "string") return json;
    if (json.documentPath) return json.documentPath;
    if (json.documentUrl) return json.documentUrl;
    if (json.url) return json.url;
    if (json.fileUrl) return json.fileUrl;
    if (json.data) {
      if (typeof json.data === "string") return json.data;
      if (json.data.documentPath) return json.data.documentPath;
      if (json.data.url) return json.data.url;
      if (json.data.fileUrl) return json.data.fileUrl;
    }
    return json.message || text;
  } catch {
    return text.replace(/^"|"$/g, "");
  }
}

interface SaveResponse {
  status: boolean;
  message: string;
  data?: { id: string;[key: string]: unknown };
}

async function saveEntry(
  payload:
    | ReturnType<typeof buildProductPayload>
    | ReturnType<typeof buildServicePayload>,
): Promise<{ message: string; savedId: string }> {
  const res = await customerApi.post(
    `${BASE_URL}/marketing-service/campgin/save-update-member-products-services`,
    payload,
    { headers: { "Content-Type": "application/json", accept: "*/*" } },
  );
  const json = res.data as SaveResponse | null | undefined;

  if (!json || json.status === false) {
    throw new Error(
      json?.message ||
      `${payload.membersType === "PRODUCT" ? "Product" : "Service"} save failed`,
    );
  }
  return {
    message: json.message || "Saved successfully.",
    savedId: (json.data?.id as string) || "",
  };
}

async function saveCompany(entry: CompanyEntry, userId: string): Promise<string> {
  const res = await customerApi.post(
    `${BASE_URL}/marketing-service/campgin/add-update-company`,
    buildCompanyPayload(entry, userId),
    { headers: { "Content-Type": "application/json", accept: "*/*" } },
  );
  const json = res.data as SaveResponse | null | undefined;
  if (!json || json.status === false) {
    throw new Error(json?.message || "Company save failed");
  }
  return json.message || "Company saved successfully.";
}

/* ------------------------------------------------------------------ */
/*  Small shared UI primitives                                         */
/* ------------------------------------------------------------------ */

const fieldBase =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 " +
  "placeholder:text-gray-400 outline-none transition-all duration-150 focus:ring-2";

const fieldState = (error?: string, valid?: boolean) => {
  if (error) return " border-rose-400 ring-rose-400/10 focus:border-rose-400 focus:ring-rose-400/20";
  if (valid) return " border-emerald-400 ring-emerald-400/10 focus:border-emerald-500 focus:ring-emerald-400/20";
  return " border-gray-200 focus:border-purple-500 focus:ring-purple-500/20";
};

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" />
    <path d="M3.5 6.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Label: React.FC<{ children: React.ReactNode; required?: boolean; counter?: string }> = ({ children, required, counter }) => (
  <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
    <span className="flex-1">{children}{required && <span className="ml-0.5 text-rose-500" title="Required">*</span>}</span>
    {counter && <span className="font-normal normal-case tracking-normal text-gray-400">{counter}</span>}
  </label>
);

const ErrorText: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-rose-600" role="alert">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0"><circle cx="5.5" cy="5.5" r="5" stroke="currentColor" /><path d="M5.5 3.5v2.5M5.5 7.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
      {msg}
    </p>
  ) : null;

const HintText: React.FC<{ msg: string }> = ({ msg }) => (
  <p className="mt-1 text-[11px] text-gray-400">{msg}</p>
);

const TextField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; placeholder?: string; required?: boolean;
  error?: string; list?: string; type?: string; hint?: string; maxLength?: number;
}> = ({ label, value, onChange, onBlur, placeholder, required, error, list, type = "text", hint, maxLength }) => {
  const [touched, setTouched] = useState(false);
  const showValid = touched && !error && value.trim().length > 0;
  return (
    <div>
      <Label required={required} counter={maxLength ? `${value.length}/${maxLength}` : undefined}>{label}</Label>
      <div className="relative">
        <input
          type={type}
          className={fieldBase + fieldState(error, showValid) + (showValid ? " pr-8" : "")}
          value={value} placeholder={placeholder} list={list}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => { setTouched(true); onBlur?.(); }}
          aria-invalid={!!error}
        />
        {showValid && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500"><CheckIcon /></span>
        )}
      </div>
      {error ? <ErrorText msg={error} /> : hint ? <HintText msg={hint} /> : null}
    </div>
  );
};

const TextAreaField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; required?: boolean; error?: string; maxLength?: number; hint?: string;
}> = ({ label, value, onChange, placeholder, rows = 3, required, error, maxLength, hint }) => {
  const [touched, setTouched] = useState(false);
  const showValid = touched && !error && value.trim().length > 0;
  return (
    <div>
      <Label required={required} counter={maxLength ? `${value.length}/${maxLength}` : undefined}>{label}</Label>
      <textarea
        className={fieldBase + " resize-none" + fieldState(error, showValid)}
        rows={rows} value={value} placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={!!error}
      />
      {error ? <ErrorText msg={error} /> : hint ? <HintText msg={hint} /> : null}
    </div>
  );
};

const SelectField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; required?: boolean; error?: string; hint?: string;
}> = ({ label, value, onChange, options, placeholder = "Select…", required, error, hint }) => {
  const [touched, setTouched] = useState(false);
  const showValid = touched && !error && value !== "";
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <select
          className={fieldBase + fieldState(error, showValid) + " appearance-none pr-8"}
          value={value}
          onChange={(e) => { onChange(e.target.value); setTouched(true); }}
          onBlur={() => setTouched(true)}
          aria-invalid={!!error}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {showValid ? (
          <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500"><CheckIcon /></span>
        ) : null}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      {error ? <ErrorText msg={error} /> : hint ? <HintText msg={hint} /> : null}
    </div>
  );
};

const DatalistOptions: React.FC<{ id: string; values: string[] }> = ({
  id,
  values,
}) => (
  <datalist id={id}>
    {values.map((v) => (
      <option key={v} value={v} />
    ))}
  </datalist>
);

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}> = ({ toasts, onDismiss }) => (
  <div className="fixed right-3 top-3 z-[100] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-2 sm:right-5 sm:top-5">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className={
          "flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-xl " +
          (toast.type === "success"
            ? "border-emerald-200 text-emerald-800"
            : toast.type === "error"
              ? "border-rose-200 text-rose-800"
              : "border-amber-200 text-amber-800")
        }
      >
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
        </span>
        <span className="min-w-0 flex-1 break-words">{toast.text}</span>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-lg leading-none opacity-50 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          &times;
        </button>
      </div>
    ))}
  </div>
);

const UploadField: React.FC<{
  label: string;
  value: string;
  onChange: (url: string) => void;
  userId: string;
  isImage?: boolean;
  compact?: boolean;
  required?: boolean;
  validationError?: string;
  onToast?: (type: ToastType, text: string) => void;
}> = ({ label, value, onChange, userId, isImage = false, compact = false, required, validationError, onToast }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const accept = isImage ? "image/jpeg,image/png,image/gif,image/webp,image/svg+xml" : "application/pdf,image/jpeg,image/png,image/gif,image/webp";
  const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
  const allowedLabel = isImage ? "JPG, PNG, GIF, WebP, SVG" : "PDF or image (JPG, PNG, GIF, WebP)";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError(`Only ${allowedLabel} files are allowed. Please select a valid file.`);
      return;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError(
        `File size must be 5 MB or less. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
      );
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setUploading(true);
    try {
      const url = await uploadMemberFile(file, userId, "company");
      onChange(url);
      const message = `${isImage ? "Image" : "File"} uploaded successfully.`;
      setSuccessMsg(message);
      onToast?.("success", message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
      onToast?.("error", message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label required={required}>{label}</Label>
        {value && !isImage && (
          <a href={value} target="_blank" rel="noreferrer"
            className="text-[11px] font-semibold text-purple-700 hover:underline">
            View file
          </a>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      <div className={"flex items-center gap-1.5 rounded-lg border p-1 transition-all " + (error ? "border-rose-400 bg-white" : successMsg ? "border-emerald-400 bg-white" : "border-gray-200 bg-white focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20")}>
        <input
          className="w-full min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          placeholder={isImage ? "Paste image URL or upload" : "Paste PDF/image URL or upload"}
          value={value}
          onChange={(e) => { onChange(e.target.value); setSuccessMsg(null); setError(null); }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-md bg-purple-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
      </div>
      {uploading && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-600">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-purple-300 border-t-purple-700" />
          Uploading, please wait…
        </p>
      )}
      {successMsg && !uploading && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-purple-700">
          ✅ {successMsg}
        </p>
      )}
      {error && <ErrorText msg={error} />}
      {!error && validationError && <ErrorText msg={validationError} />}
      {isImage && value && !uploading && (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2">
          <img src={value} alt={`${label} preview`} className="h-14 w-14 rounded-md bg-white object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700">Image ready</p>
            <p className="truncate text-[11px] text-gray-400">Preview of the uploaded image</p>
          </div>
          <button type="button" onClick={() => { onChange(""); setSuccessMsg(null); }} className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">Remove</button>
        </div>
      )}
      {!compact && !error && !successMsg && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0"><circle cx="5" cy="5" r="4.5" stroke="currentColor" /><path d="M5 3.5V5.5M5 6.5h.01" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
          Allowed: {allowedLabel} · Max 5 MB
        </p>
      )}
    </div>
  );
};

const SectionHeading: React.FC<{
  children: React.ReactNode;
  accent?: string;
}> = ({ children, accent }) => (
  <div className="mb-3 mt-5 flex items-center gap-2 border-b border-gray-100 pb-2 first:mt-0">
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
    <span className="text-[13px] font-bold tracking-wide text-purple-700">
      {children}
    </span>
  </div>
);

const StatusPill: React.FC<{ status: SaveStatus }> = ({ status }) => {
  if (status === "idle") return null;
  const map: Record<Exclude<SaveStatus, "idle">, string> = {
    saving: "bg-white text-amber-700 border-amber-200",
    saved: "bg-white text-purple-700 border-purple-200",
    error: "bg-white text-rose-700 border-rose-200",
  };
  const text = { saving: "Saving…", saved: "Saved", error: "Failed" }[status];
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[status as Exclude<SaveStatus, "idle">]}`}
    >
      {text}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/* ── helper: map API entry → ProductEntry form shape ── */
function apiToProduct(d: Record<string, unknown>): ProductEntry {
  const boolToTri = (v: unknown): TriState =>
    v === true ? "true" : v === false ? "false" : "";
  return {
    id: String(d.id ?? ""),
    name: String(d.name ?? ""),
    category: String(d.category ?? ""),
    subCategory: String(d.subCategory ?? ""),
    description: String(d.description ?? ""),
    keyFeatures: String(d.keyFeatures ?? ""),
    price: d.price != null ? String(d.price) : "",
    availability: String(d.availability ?? ""),
    imageUrl: String(d.imageUrl ?? ""),
    color: String(d.color ?? ""),
    brand: String(d.brand ?? ""),
    quantity: d.quantity != null ? String(d.quantity) : "",
    quantityUnit: String(d.quantityUnit ?? ""),
    variant: String(d.variant ?? ""),
    mrp: d.mrp != null ? String(d.mrp) : "",
    stockQuantity: d.stockQuantity != null ? String(d.stockQuantity) : "",
    productCondition: (d.productCondition as ProductCondition) || "",
    returnAvailable: boolToTri(d.returnAvailable),
    returnDays: d.returnDays != null ? String(d.returnDays) : "",
    warrantyAvailable: boolToTri(d.warrantyAvailable),
    warrantyPeriod: String(d.warrantyPeriod ?? ""),
    deliveryTime: String(d.deliveryTime ?? ""),
    priceType: (d.priceType as PriceType) || "FIXED",
  };
}

function apiToService(d: Record<string, unknown>): ServiceEntry {
  const boolToTri = (v: unknown): TriState =>
    v === true ? "true" : v === false ? "false" : "";
  return {
    id: String(d.id ?? ""),
    name: String(d.name ?? ""),
    category: String(d.category ?? ""),
    subCategory: String(d.subCategory ?? ""),
    description: String(d.description ?? ""),
    keyFeatures: String(d.keyFeatures ?? ""),
    price: d.price != null ? String(d.price) : "",
    availability: String(d.availability ?? ""),
    imageUrl: String(d.imageUrl ?? ""),
    providerName: String(d.providerName ?? ""),
    businessName: String(d.businessName ?? ""),
    serviceMode: (d.serviceMode as ServiceMode) || "",
    serviceLocation: String(d.serviceLocation ?? ""),
    serviceDuration: String(d.serviceDuration ?? ""),
    priceType: (d.priceType as PriceType) || "FIXED",
    bookingRequired: boolToTri(d.bookingRequired),
    targetCustomers: String(d.targetCustomers ?? ""),
    cancellationPolicy: String(d.cancellationPolicy ?? ""),
    refundPolicy: String(d.refundPolicy ?? ""),
    brochureUrl: String(d.brochureUrl ?? ""),
  };
}

function apiToCompany(d: Record<string, unknown>): CompanyEntry {
  return {
    id: String(d.id ?? ""),
    companyDescription: String(d.companyDescription ?? ""),
    companyName: String(d.companyName ?? ""),
    gstDocumentUrl: String(d.gstDocumentUrl ?? ""),
    gstNumber: String(d.gstNumber ?? ""),
    linkedinUrl: String(d.linkedinUrl ?? ""),
    locations: String(d.locations ?? ""),
    logoUrl: String(d.logoUrl ?? ""),
    type: String(d.type ?? ""),
    websiteUrl: String(d.websiteUrl ?? ""),
  };
}

const ProductServiceManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state as { editId?: string; companyId?: string; initialTab?: EntryKind } | null;
  const companyIdFromUrl = new URLSearchParams(location.search).get("companyId") || undefined;
  const editIdFromUrl = new URLSearchParams(location.search).get("editId") || undefined;
  const tabFromUrl = (new URLSearchParams(location.search).get("tab") as EntryKind | null) || undefined;
  const editId = navigationState?.editId || editIdFromUrl;
  const companyId = navigationState?.companyId || companyIdFromUrl || (navigationState?.initialTab === "COMPANY" ? editId : undefined);

  const [memberId, setMemberId] = useState<string>("");
  const [loadingEdit, setLoadingEdit] = useState(!!editId || !!companyId);
  const [hasCompany, setHasCompany] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const mId = localStorage.getItem(USER_ID_STORAGE_KEY) || "";
    setMemberId(mId);
    if (!mId) { setHasCompany(false); return; }
    customerApi
      .get(`${BASE_URL}/marketing-service/campgin/companies-by-userId/${encodeURIComponent(mId)}`)
      .then((res) => {
        const payload = res.data as { data?: unknown[]; status?: boolean } | null;
        const hasAny = Array.isArray(payload?.data) && payload!.data!.length > 0;
        setHasCompany(hasAny);
      })
      .catch(() => setHasCompany(false));
  }, []);

  // Force COMPANY tab when no company exists (unless editing an existing product/service)
  const [activeKind, setActiveKind] = useState<EntryKind>(
    tabFromUrl || navigationState?.initialTab || (companyId ? "COMPANY" : "PRODUCT")
  );

  // Sync tab with URL when user navigates directly
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeKind && !editId) {
      setActiveKind(tabFromUrl);
    }
  }, [tabFromUrl]); // eslint-disable-line

  useEffect(() => {
    if (hasCompany === false && !editId) setActiveKind("COMPANY");
  }, [hasCompany, editId]);
  const [products, setProducts] = useState<ProductEntry[]>([emptyProduct()]);
  const [services, setServices] = useState<ServiceEntry[]>([emptyService()]);
  const [company, setCompany] = useState<CompanyEntry>(() => ({ ...emptyCompany(), id: companyId || "" }));

  /* ── pre-fill form when editing an existing entry ── */
  useEffect(() => {
    const mId = localStorage.getItem(USER_ID_STORAGE_KEY) || "";
    if (!mId || (!editId && !companyId)) { setLoadingEdit(false); return; }

    if (companyId) {
      customerApi
        .get(`${BASE_URL}/marketing-service/campgin/companies-by-userId/${encodeURIComponent(mId)}`)
        .then((res) => {
          const payload = res.data as { data?: Record<string, unknown>[] } | null;
          const companies = payload?.data;
          const entry = Array.isArray(companies)
            ? companies.find((item) => String(item.id) === companyId)
            : undefined;
          if (entry) setCompany(apiToCompany(entry));
        })
        .catch(() => { })
        .finally(() => setLoadingEdit(false));
      return;
    }

    customerApi
      .get(`${BASE_URL}/marketing-service/campgin/products-services/${mId}`)
      .then((res) => {
        const list: Record<string, unknown>[] = Array.isArray(res.data) ? res.data : [];
        const entry = list.find((e) => String(e.id) === editId);
        if (!entry) { setLoadingEdit(false); return; }
        if (String(entry.membersType) === "PRODUCT") {
          setActiveKind("PRODUCT");
          setProducts([apiToProduct(entry)]);
        } else {
          setActiveKind("SERVICE");
          setServices([apiToService(entry)]);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingEdit(false));
  }, [editId, companyId]);

  const [productErrors, setProductErrors] = useState<Record<string, FieldErrors>>({});
  const [serviceErrors, setServiceErrors] = useState<Record<string, FieldErrors>>({});
  const [companyErrors, setCompanyErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Record<string, SaveStatus>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savingAll, setSavingAll] = useState(false);

  const showToast = React.useCallback((type: ToastType, text: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, type === "success" ? 3000 : 5000);
  }, []);

  const dismissToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /* ---------- generic row helpers ---------- */

  const updateProduct = <K extends keyof ProductEntry>(
    id: string,
    key: K,
    value: ProductEntry[K],
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    );
    setStatus((prev) => ({ ...prev, [id]: "idle" }));
    setProductErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: undefined },
    }));
  };

  const updateService = <K extends keyof ServiceEntry>(
    id: string,
    key: K,
    value: ServiceEntry[K],
  ) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    );
    setStatus((prev) => ({ ...prev, [id]: "idle" }));
    setServiceErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: undefined },
    }));
  };

  const updateCompany = <K extends keyof CompanyEntry>(key: K, value: CompanyEntry[K]) => {
    setCompany((prev) => ({ ...prev, [key]: value }));
    setStatus((prev) => ({ ...prev, COMPANY: "idle" }));
    setCompanyErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const removeProduct = async (id: string) => {
    if (products.length === 1) return;
    const product = products.find((item) => item.id === id);

    if (product && isProductFilled(product)) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Remove this product?",
        text: "The details entered for this product will be lost.",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        cancelButtonText: "Keep product",
        confirmButtonColor: "#7C3AED",
        reverseButtons: true,
        focusCancel: true,
      });
      if (!result.isConfirmed) return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setProductErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeService = async (id: string) => {
    if (services.length === 1) return;
    const service = services.find((item) => item.id === id);

    if (service && isServiceFilled(service)) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Remove this service?",
        text: "The details entered for this service will be lost.",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        cancelButtonText: "Keep service",
        confirmButtonColor: "#7C3AED",
        reverseButtons: true,
        focusCancel: true,
      });
      if (!result.isConfirmed) return;
    }

    setServices((prev) => prev.filter((s) => s.id !== id));
    setServiceErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const isProductFilled = (p: ProductEntry) =>
    Object.entries(p).some(
      ([k, v]) => k !== "id" && k !== "priceType" && String(v ?? "").trim(),
    );

  const isServiceFilled = (s: ServiceEntry) =>
    Object.entries(s).some(
      ([k, v]) => k !== "id" && k !== "priceType" && String(v ?? "").trim(),
    );

  const handleKindChange = async (kind: EntryKind) => {
    if (kind === activeKind) return;

    if ((kind === "PRODUCT" || kind === "SERVICE") && !editId) {
      if (hasCompany === null) {
        await Swal.fire({
          icon: "info",
          title: "Checking company details",
          text: "Please wait a moment while we verify your company profile.",
          confirmButtonText: "OK",
          confirmButtonColor: "#7C3AED",
        });
        return;
      }

      if (hasCompany === false) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Add your company first",
          html: `Before adding a <b>${kind === "PRODUCT" ? "product" : "service"}</b>, please save your company details first.`,
          confirmButtonText: "Add Company",
          showCancelButton: true,
          cancelButtonText: "Not now",
          confirmButtonColor: "#7C3AED",
          reverseButtons: true,
        });
        if (result.isConfirmed) setActiveKind("COMPANY");
        return;
      }
    }

    setActiveKind(kind);
  };

  /* ---------- save ---------- */

  const handleSaveAll = async () => {
    setToasts([]);

    if (!memberId) {
      await Swal.fire({
        icon: "error",
        title: "Login required",
        text: "We couldn't find your user ID. Please log in again and retry.",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
      });
      return;
    }

    if (activeKind === "COMPANY") {
      const companyErrors: FieldErrors = {};
      if (!company.companyName.trim()) companyErrors.companyName = "Company name is required";
      if (!company.companyDescription.trim()) companyErrors.companyDescription = "Company description is required";
      if (!company.locations.trim()) companyErrors.locations = "Location is required";
      // if (!company.type.trim()) companyErrors.type = "Company type is required";
      if (company.gstNumber.trim() && !/^[0-9A-Z]{15}$/i.test(company.gstNumber.trim()))
        companyErrors.gstNumber = "GST number must be exactly 15 alphanumeric characters (e.g. 22AAAAA0000A1Z5)";
      const isValidUrl = (value: string) => {
        if (!value.trim()) return true;
        try { new URL(value); return true; } catch { return false; }
      };
      if (!isValidUrl(company.websiteUrl)) companyErrors.websiteUrl = "Enter a valid URL starting with https://";
      if (!isValidUrl(company.linkedinUrl)) companyErrors.linkedinUrl = "Enter a valid LinkedIn URL starting with https://";
      if (company.logoUrl && !isValidUrl(company.logoUrl)) companyErrors.logoUrl = "Upload or enter a valid logo URL";
      if (company.gstDocumentUrl && !isValidUrl(company.gstDocumentUrl)) companyErrors.gstDocumentUrl = "Upload or enter a valid GST document URL";
      setCompanyErrors(companyErrors);
      if (Object.keys(companyErrors).length) {
        setStatus((prev) => ({ ...prev, COMPANY: "error" }));
        await Swal.fire({
          icon: "error",
          title: "Company details need attention",
          text: "Please fix the highlighted fields before continuing.",
          confirmButtonText: "Review fields",
          confirmButtonColor: "#7C3AED",
        });
        return;
      }

      const companyConfirm = await Swal.fire({
        icon: "question",
        title: companyId ? "Update company?" : "Save company?",
        text: companyId
          ? "Your latest company details will replace the existing information."
          : "Please confirm that the company details are correct before saving.",
        showCancelButton: true,
        confirmButtonText: companyId ? "Yes, update company" : "Yes, save company",
        cancelButtonText: "Review details",
        confirmButtonColor: "#7C3AED",
        reverseButtons: true,
        focusCancel: true,
      });
      if (!companyConfirm.isConfirmed) return;
      setSavingAll(true);
      setStatus((prev) => ({ ...prev, COMPANY: "saving" }));
      try {
        const message = await saveCompany(company, memberId);
        setStatus((prev) => ({ ...prev, COMPANY: "saved" }));
        setHasCompany(true);
        setCompanyErrors({});
        await Swal.fire({
          icon: "success",
          title: companyId ? "Company updated" : "Company saved",
          text: message || (companyId ? "Your company details were updated successfully." : "Your company was saved successfully. You can now add products and services."),
          confirmButtonText: "Continue",
          confirmButtonColor: "#7C3AED",
        });
        setCompany(emptyCompany());
        navigate("/main/dashboard/my-companies", { replace: true });
      } catch (error) {
        setStatus((prev) => ({ ...prev, COMPANY: "error" }));
        await Swal.fire({
          icon: "error",
          title: companyId ? "Company update failed" : "Company save failed",
          text: error instanceof Error ? error.message : "Please try again.",
          confirmButtonText: "Try again",
          confirmButtonColor: "#7C3AED",
        });
      } finally {
        setSavingAll(false);
      }
      return;
    }

    if (hasCompany !== true && !editId) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Company required",
        text: `Please save your company before submitting a ${activeKind === "PRODUCT" ? "product" : "service"}.`,
        showCancelButton: true,
        confirmButtonText: "Add Company",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#7C3AED",
        reverseButtons: true,
      });
      if (result.isConfirmed) setActiveKind("COMPANY");
      return;
    }

    const isPositiveNumber = (value: string) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
    const isNonNegativeNumber = (value: string) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
    const isValidUrl = (value: string) => {
      if (!value.trim()) return true;
      try { new URL(value); return true; } catch { return false; }
    };

    const nextProductErrors: Record<string, FieldErrors> = {};
    const filledProducts = products.filter(isProductFilled);
    filledProducts.forEach((p) => {
      const errs: FieldErrors = {};
      if (!p.name.trim()) errs.name = "Product name is required";
      if (!p.category.trim()) errs.category = "Select a product category";
      if (!isPositiveNumber(p.price)) errs.price = "Enter a valid selling price greater than 0";
      if (!p.availability) errs.availability = "Select availability";
      if (!p.priceType) errs.priceType = "Select a price type";
      if (p.quantity && !isPositiveNumber(p.quantity)) errs.quantity = "Enter a valid quantity greater than 0";
      if (p.quantity && !p.quantityUnit) errs.quantityUnit = "Select a quantity unit";
      if (p.mrp && !isPositiveNumber(p.mrp)) errs.mrp = "Enter a valid MRP greater than 0";
      if (p.mrp && p.price && Number(p.mrp) < Number(p.price)) errs.mrp = "MRP cannot be lower than selling price";
      if (p.stockQuantity && (!isNonNegativeNumber(p.stockQuantity) || !Number.isInteger(Number(p.stockQuantity)))) errs.stockQuantity = "Enter a whole stock quantity (0 or more)";
      if (!p.productCondition) errs.productCondition = "Select product condition";
      if (!p.returnAvailable) errs.returnAvailable = "Select return availability";
      if (p.returnAvailable === "true" && (!p.returnDays.trim() || !isPositiveNumber(p.returnDays) || !Number.isInteger(Number(p.returnDays)))) errs.returnDays = "Enter return window in whole days";
      if (!p.warrantyAvailable) errs.warrantyAvailable = "Select warranty availability";
      if (p.warrantyAvailable === "true" && !p.warrantyPeriod.trim()) errs.warrantyPeriod = "Enter warranty period";
      if (!p.imageUrl.trim()) errs.imageUrl = "Upload a product image";
      else if (!isValidUrl(p.imageUrl)) errs.imageUrl = "Upload a valid product image";
      if (Object.keys(errs).length) nextProductErrors[p.id] = errs;
    });

    const nextServiceErrors: Record<string, FieldErrors> = {};
    const filledServices = services.filter(isServiceFilled);
    filledServices.forEach((s) => {
      const errs: FieldErrors = {};
      if (!s.name.trim()) errs.name = "Service name is required";
      if (!s.category.trim()) errs.category = "Select a service category";
      if (!isPositiveNumber(s.price)) errs.price = "Enter a valid service fee greater than 0";
      if (!s.availability) errs.availability = "Select availability";
      if (!s.serviceMode) errs.serviceMode = "Select service mode";
      if (!s.bookingRequired) errs.bookingRequired = "Select booking requirement";
      if (s.imageUrl && !isValidUrl(s.imageUrl)) errs.imageUrl = "Upload a valid service image";
      if (s.brochureUrl && !isValidUrl(s.brochureUrl)) errs.brochureUrl = "Upload a valid brochure or portfolio file";
      if (Object.keys(errs).length) nextServiceErrors[s.id] = errs;
    });

    setProductErrors(nextProductErrors);
    setServiceErrors(nextServiceErrors);

    if (Object.keys(nextProductErrors).length) {
      setActiveKind("PRODUCT");
      await Swal.fire({
        icon: "error",
        title: "Product details need attention",
        text: "Please fix the highlighted product fields before saving.",
        confirmButtonText: "Review fields",
        confirmButtonColor: "#7C3AED",
      });
      window.setTimeout(() => document.getElementById(`entry-${Object.keys(nextProductErrors)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    if (Object.keys(nextServiceErrors).length) {
      setActiveKind("SERVICE");
      await Swal.fire({
        icon: "error",
        title: "Service details need attention",
        text: "Please fix the highlighted service fields before saving.",
        confirmButtonText: "Review fields",
        confirmButtonColor: "#7C3AED",
      });
      window.setTimeout(() => document.getElementById(`entry-${Object.keys(nextServiceErrors)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    const validProducts = filledProducts.filter(
      (p) => p.name.trim() && p.category.trim(),
    );
    const validServices = filledServices.filter(
      (s) => s.name.trim() && s.category.trim(),
    );

    if (!validProducts.length && !validServices.length) {
      await Swal.fire({
        icon: "info",
        title: "Nothing to save yet",
        text: `Add at least one ${activeKind === "PRODUCT" ? "product" : "service"} before continuing.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
      });
      return;
    }

    const totalItems = validProducts.length + validServices.length;
    const entryLabel = editId
      ? activeKind === "PRODUCT" ? "product" : "service"
      : `${totalItems} listing${totalItems === 1 ? "" : "s"}`;
    const saveConfirm = await Swal.fire({
      icon: "question",
      title: editId ? `Update ${entryLabel}?` : `Save ${entryLabel}?`,
      text: editId
        ? `Please confirm the updated ${entryLabel} details are correct.`
        : "Please review the information before submitting.",
      showCancelButton: true,
      confirmButtonText: editId ? "Yes, update" : "Yes, save",
      cancelButtonText: "Review details",
      confirmButtonColor: "#7C3AED",
      reverseButtons: true,
      focusCancel: true,
    });
    if (!saveConfirm.isConfirmed) return;

    setSavingAll(true);
    const nextStatus: Record<string, SaveStatus> = {};
    [...validProducts, ...validServices].forEach(
      (e) => (nextStatus[e.id] = "saving"),
    );
    setStatus((prev) => ({ ...prev, ...nextStatus }));

    const results = await Promise.allSettled([
      ...validProducts.map((p) =>
        saveEntry(buildProductPayload(p, memberId)).then((res) => ({
          id: p.id,
          savedId: res.savedId,
          msg: res.message,
          kind: "PRODUCT" as const,
        })),
      ),
      ...validServices.map((s) =>
        saveEntry(buildServicePayload(s, memberId)).then((res) => ({
          id: s.id,
          savedId: res.savedId,
          msg: res.message,
          kind: "SERVICE" as const,
        })),
      ),
    ]);

    const finalStatus: Record<string, SaveStatus> = {};
    let failCount = 0;
    let successMsg = "";
    let errorMsg = "";

    results.forEach((r) => {
      if (r.status === "fulfilled") {
        finalStatus[r.value.id] = "saved";
        successMsg = r.value.msg;
        // Replace temp id with real UUID so next save does UPDATE
        if (r.value.savedId && r.value.savedId !== r.value.id) {
          if (r.value.kind === "PRODUCT") {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === r.value.id ? { ...p, id: r.value.savedId } : p,
              ),
            );
          } else {
            setServices((prev) =>
              prev.map((s) =>
                s.id === r.value.id ? { ...s, id: r.value.savedId } : s,
              ),
            );
          }
        }
      } else {
        failCount += 1;
        if (!errorMsg) {
          errorMsg =
            r.reason instanceof Error ? r.reason.message : String(r.reason);
        }
      }
    });

    [...validProducts, ...validServices].forEach((e) => {
      if (!finalStatus[e.id]) finalStatus[e.id] = "error";
    });
    setStatus((prev) => ({ ...prev, ...finalStatus }));
    setSavingAll(false);

    if (failCount === 0) {
      const savedKind = activeKind;
      await Swal.fire({
        icon: "success",
        title: editId ? `${savedKind === "PRODUCT" ? "Product" : "Service"} updated` : `${savedKind === "PRODUCT" ? "Product" : "Service"} saved`,
        text: successMsg || `${savedKind === "PRODUCT" ? "Product" : "Service"} saved successfully.`,
        confirmButtonText: "Done",
        confirmButtonColor: "#7C3AED",
      });
      setProducts([emptyProduct()]);
      setServices([emptyService()]);
      setProductErrors({});
      setServiceErrors({});
      setStatus({});
      navigate("/main/dashboard/my-products-services", { replace: true });
    } else {
      await Swal.fire({
        icon: "error",
        title: "Some items were not saved",
        text: `${failCount} item${failCount > 1 ? "s" : ""} failed to save${errorMsg ? `: ${errorMsg}` : ". Please retry."}`,
        confirmButtonText: "Review and retry",
        confirmButtonColor: "#7C3AED",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white px-3 pb-36 pt-5 sm:px-4 sm:pb-32 sm:pt-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {loadingEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
            <p className="text-sm font-semibold text-purple-700">Loading details…</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {(editId || companyId) && (
              <button
                type="button"
                onClick={() => navigate(companyId ? "/main/dashboard/my-companies" : "/main/dashboard/my-products-services")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-purple-300 hover:text-purple-700"
                aria-label="Back"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {editId || companyId ? `Edit ${activeKind === "PRODUCT" ? "Product" : activeKind === "SERVICE" ? "Service" : "Company"}` : `Add ${activeKind === "PRODUCT" ? "Product" : activeKind === "SERVICE" ? "Service" : "Company"}`}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {editId || companyId ? `Update this ${activeKind === "PRODUCT" ? "product" : activeKind === "SERVICE" ? "service" : "company"} and save.` : `Add clear ${activeKind === "PRODUCT" ? "product" : activeKind === "SERVICE" ? "service" : "company"} details so customers can quickly understand your offering.`}
              </p>
            </div>
          </div>
          {/* Kind switch tabs */}
          <div className="grid w-full shrink-0 grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-white p-1 sm:w-auto">
            {(["COMPANY", "PRODUCT", "SERVICE"] as EntryKind[]).map((kind) => {
              const isActive = activeKind === kind;
              const needsCompany = (kind === "PRODUCT" || kind === "SERVICE") && hasCompany !== true && !editId;
              const isCheckingCompany = needsCompany && hasCompany === null;
              const count = kind === "PRODUCT" ? products.length : kind === "SERVICE" ? services.length : (company.companyName ? 1 : 0);
              return (
                <div key={kind} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleKindChange(kind)}
                    disabled={isCheckingCompany}
                    aria-disabled={needsCompany}
                    title={needsCompany ? (hasCompany === null ? "Checking your company profile" : "Add a company first") : undefined}
                    className={
                      "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 " +
                      (isActive
                        ? "bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] text-white shadow"
                        : needsCompany
                          ? "cursor-pointer text-gray-400 bg-gray-50 hover:bg-amber-50 hover:text-amber-700"
                          : "text-gray-500 hover:bg-white hover:text-purple-700")
                    }
                  >
                    {kind === "PRODUCT" ? "Product" : kind === "SERVICE" ? "Service" : "Company"}
                    {!needsCompany && (
                      <span className={"rounded-full px-1.5 py-0.5 text-[11px] font-bold " +
                        (isActive ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500")}>
                        {count}
                      </span>
                    )}
                  </button>
                  {needsCompany && (
                    <div className="pointer-events-none absolute -top-10 left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block">
                      {hasCompany === null ? "Checking company…" : "Add a company first"}
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* PRODUCTS */}
        {activeKind === "PRODUCT" && (
          <div className="space-y-4">
            {products.map((p, idx) => {
              const errs = productErrors[p.id] || {};
              return (
                <div
                  key={p.id}
                  id={`entry-${p.id}`}
                  className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-purple-700">
                        Product {idx + 1}
                      </span>
                      <StatusPill status={status[p.id] ?? "idle"} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(p.id)}
                      disabled={products.length === 1}
                      className="text-[13px] font-semibold text-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-stone-300"
                    >
                      Remove
                    </button>
                  </div>

                  <SectionHeading>Basic information</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      label="Product name"
                      required
                      value={p.name}
                      error={errs.name}
                      placeholder="e.g. Organic Herbal Shampoo"
                      maxLength={120}
                      onChange={(v) => updateProduct(p.id, "name", v)}
                    />
                    <SelectField
                      label="Category"
                      required
                      value={p.category}
                      error={errs.category}
                      placeholder="Select product category"
                      options={toOptions(PRODUCT_CATEGORIES)}
                      onChange={(v) => updateProduct(p.id, "category", v)}
                    />
                    <TextField
                      label="Sub-category"
                      value={p.subCategory}
                      placeholder="e.g. Hair Care"
                      hint="Optional — helps buyers find you faster"
                      onChange={(v) => updateProduct(p.id, "subCategory", v)}
                    />
                    <TextField
                      label="Brand / manufacturer"
                      value={p.brand}
                      placeholder="e.g. Tata, Amul"
                      onChange={(v) => updateProduct(p.id, "brand", v)}
                    />
                  </div>

                  <SectionHeading>Pricing, stock &amp; specifications</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TextField
                      label="Selling price (₹)"
                      required
                      value={p.price}
                      error={errs.price}
                      type="number"
                      placeholder="499"
                      hint="Actual price charged to buyer"
                      onChange={(v) => updateProduct(p.id, "price", v)}
                    />
                    <TextField
                      label="MRP (₹)"
                      value={p.mrp}
                      error={errs.mrp}
                      type="number"
                      placeholder="699"
                      hint="Must be ≥ selling price"
                      onChange={(v) => updateProduct(p.id, "mrp", v)}
                    />
                    <SelectField
                      label="Availability"
                      required
                      value={p.availability}
                      error={errs.availability}
                      placeholder="Select availability"
                      options={toOptions(AVAILABILITY_OPTIONS)}
                      onChange={(v) => updateProduct(p.id, "availability", v)}
                    />
                    <SelectField
                      label="Price type"
                      required
                      value={p.priceType}
                      error={errs.priceType}
                      options={PRICE_TYPES}
                      onChange={(v) =>
                        updateProduct(
                          p.id,
                          "priceType",
                          (v || "FIXED") as PriceType,
                        )
                      }
                    />
                    <TextField
                      label="Pack quantity"
                      value={p.quantity}
                      error={errs.quantity}
                      type="number"
                      placeholder="500, 1, 10"
                      onChange={(v) => updateProduct(p.id, "quantity", v)}
                    />
                    <SelectField
                      label="Quantity unit"
                      required={Boolean(p.quantity)}
                      value={p.quantityUnit}
                      error={errs.quantityUnit}
                      placeholder="Select quantity unit"
                      options={toOptions(QUANTITY_UNITS)}
                      onChange={(v) => updateProduct(p.id, "quantityUnit", v)}
                    />
                    <TextField
                      label="Stock quantity"
                      value={p.stockQuantity}
                      error={errs.stockQuantity}
                      type="number"
                      placeholder="50"
                      onChange={(v) => updateProduct(p.id, "stockQuantity", v)}
                    />
                    <SelectField
                      label="Condition"
                      required
                      value={p.productCondition}
                      error={errs.productCondition}
                      options={PRODUCT_CONDITIONS}
                      onChange={(v) =>
                        updateProduct(
                          p.id,
                          "productCondition",
                          v as ProductCondition | "",
                        )
                      }
                    />
                    <TextField
                      label="Variant / model / size"
                      value={p.variant}
                      placeholder="500ml, XL"
                      onChange={(v) => updateProduct(p.id, "variant", v)}
                    />
                    <TextField
                      label="Color / shade"
                      value={p.color}
                      placeholder="Matte Black"
                      onChange={(v) => updateProduct(p.id, "color", v)}
                    />
                  </div>

                  <SectionHeading>Delivery &amp; policies</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextField
                      label="Delivery time"
                      value={p.deliveryTime}
                      placeholder="1-2 business days"
                      onChange={(v) => updateProduct(p.id, "deliveryTime", v)}
                    />
                    <SelectField
                      label="Return available?"
                      required
                      value={p.returnAvailable}
                      error={errs.returnAvailable}
                      options={[
                        { value: "true", label: "Yes (Returnable)" },
                        { value: "false", label: "No (Non-returnable)" },
                      ]}
                      onChange={(v) => {
                        updateProduct(p.id, "returnAvailable", v as TriState);
                        if (v !== "true") updateProduct(p.id, "returnDays", "");
                      }}
                    />
                    <SelectField
                      label="Warranty available?"
                      required
                      value={p.warrantyAvailable}
                      error={errs.warrantyAvailable}
                      options={[
                        { value: "true", label: "Yes (Included)" },
                        { value: "false", label: "No" },
                      ]}
                      onChange={(v) => {
                        updateProduct(p.id, "warrantyAvailable", v as TriState);
                        if (v !== "true")
                          updateProduct(p.id, "warrantyPeriod", "");
                      }}
                    />
                    {p.returnAvailable === "true" && (
                      <TextField
                        label="Return window (days)"
                        required
                        value={p.returnDays}
                        error={errs.returnDays}
                        type="number"
                        placeholder="7, 10, 30"
                        onChange={(v) => updateProduct(p.id, "returnDays", v)}
                      />
                    )}
                    {p.warrantyAvailable === "true" && (
                      <TextField
                        label="Warranty period"
                        required
                        value={p.warrantyPeriod}
                        error={errs.warrantyPeriod}
                        placeholder="1 Year"
                        onChange={(v) =>
                          updateProduct(p.id, "warrantyPeriod", v)
                        }
                      />
                    )}
                    <UploadField
                      label="Product image"
                      value={p.imageUrl}
                      userId={memberId}
                      isImage
                      required
                      validationError={errs.imageUrl}
                      onToast={showToast}
                      onChange={(v) => updateProduct(p.id, "imageUrl", v)}
                    />
                  </div>

                  <SectionHeading>Features &amp; description</SectionHeading>
                  <div className="grid grid-cols-1 gap-4">
                    <TextAreaField
                      label="Key features / highlights"
                      value={p.keyFeatures}
                      placeholder="100% natural ingredients • 2-year warranty • ISO certified"
                      hint="Use bullet points (•) to list features"
                      maxLength={500}
                      onChange={(v) => updateProduct(p.id, "keyFeatures", v)}
                    />
                    <TextAreaField
                      label="Detailed description"
                      value={p.description}
                      placeholder="Specifications and details a fellow member should know..."
                      rows={4}
                      maxLength={1000}
                      onChange={(v) => updateProduct(p.id, "description", v)}
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setProducts((prev) => [...prev, emptyProduct()])}
              className="w-full rounded-2xl border-2 border-dashed border-purple-300 py-3 text-[14px] font-bold text-purple-700 transition hover:border-purple-500 hover:bg-purple-50"
            >
              + Add another product
            </button>
          </div>
        )}

        {/* SERVICES */}
        {activeKind === "SERVICE" && (
          <div className="space-y-4">
            {services.map((s, idx) => {
              const errs = serviceErrors[s.id] || {};
              return (
                <div
                  key={s.id}
                  id={`entry-${s.id}`}
                  className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-purple-700">
                        Service {idx + 1}
                      </span>
                      <StatusPill status={status[s.id] ?? "idle"} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(s.id)}
                      disabled={services.length === 1}
                      className="text-[13px] font-semibold text-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-stone-300"
                    >
                      Remove
                    </button>
                  </div>

                  <SectionHeading>Basic information</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      label="Service name"
                      required
                      value={s.name}
                      error={errs.name}
                      placeholder="e.g. Legal Advisory & Trademark Registration"
                      maxLength={120}
                      onChange={(v) => updateService(s.id, "name", v)}
                    />
                    <SelectField
                      label="Category"
                      required
                      value={s.category}
                      error={errs.category}
                      placeholder="Select service category"
                      options={toOptions(SERVICE_CATEGORIES)}
                      onChange={(v) => updateService(s.id, "category", v)}
                    />
                    <TextField
                      label="Sub-category"
                      value={s.subCategory}
                      placeholder="e.g. Corporate Law"
                      onChange={(v) => updateService(s.id, "subCategory", v)}
                    />
                    <TextField
                      label="Specialist / provider name"
                      value={s.providerName}
                      placeholder="Dr. Rajesh Kumar"
                      onChange={(v) => updateService(s.id, "providerName", v)}
                    />
                    <TextField
                      label="Business / clinic / firm name"
                      value={s.businessName}
                      placeholder="Sharma & Associates"
                      onChange={(v) => updateService(s.id, "businessName", v)}
                    />
                    <TextField
                      label="Target customers"
                      value={s.targetCustomers}
                      placeholder="Startups, SMEs, Individuals"
                      onChange={(v) =>
                        updateService(s.id, "targetCustomers", v)
                      }
                    />
                  </div>

                  <SectionHeading>Fee, mode &amp; delivery</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField
                      label="Price / fee (₹)"
                      required
                      value={s.price}
                      error={errs.price}
                      type="number"
                      placeholder="1500"
                      hint="Starting price or per-session fee"
                      onChange={(v) => updateService(s.id, "price", v)}
                    />
                    <SelectField
                      label="Pricing model"
                      required
                      value={s.priceType}
                      options={PRICE_TYPES}
                      onChange={(v) =>
                        updateService(
                          s.id,
                          "priceType",
                          (v || "FIXED") as PriceType,
                        )
                      }
                    />
                    <SelectField
                      label="Availability"
                      required
                      value={s.availability}
                      error={errs.availability}
                      placeholder="Select availability"
                      options={toOptions(AVAILABILITY_OPTIONS)}
                      onChange={(v) => updateService(s.id, "availability", v)}
                    />
                    <SelectField
                      label="Service mode"
                      required
                      value={s.serviceMode}
                      error={errs.serviceMode}
                      options={SERVICE_MODES}
                      onChange={(v) =>
                        updateService(
                          s.id,
                          "serviceMode",
                          v as ServiceMode | "",
                        )
                      }
                    />
                    <TextField
                      label="Service location"
                      value={s.serviceLocation}
                      placeholder="At Clinic, Client Site, Virtual"
                      onChange={(v) =>
                        updateService(s.id, "serviceLocation", v)
                      }
                    />
                    <TextField
                      label="Service duration"
                      value={s.serviceDuration}
                      placeholder="45 Mins, 1 Hour"
                      onChange={(v) =>
                        updateService(s.id, "serviceDuration", v)
                      }
                    />
                    <SelectField
                      label="Advance booking required?"
                      required
                      value={s.bookingRequired}
                      error={errs.bookingRequired}
                      options={[
                        { value: "true", label: "Yes (Mandatory)" },
                        { value: "false", label: "No (Walk-in)" },
                      ]}
                      onChange={(v) =>
                        updateService(s.id, "bookingRequired", v as TriState)
                      }
                    />
                    <TextField
                      label="Cancellation policy"
                      value={s.cancellationPolicy}
                      placeholder="Free up to 24 hours prior"
                      onChange={(v) =>
                        updateService(s.id, "cancellationPolicy", v)
                      }
                    />
                    <TextField
                      label="Refund policy"
                      value={s.refundPolicy}
                      placeholder="100% refund on 24-hr notice"
                      onChange={(v) => updateService(s.id, "refundPolicy", v)}
                    />
                  </div>

                  <SectionHeading>Media &amp; documents</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <UploadField
                      label="Service banner / image"
                      value={s.imageUrl}
                      userId={memberId}
                      isImage
                      validationError={errs.imageUrl}
                      onToast={showToast}
                      onChange={(v) => updateService(s.id, "imageUrl", v)}
                    />
                    <UploadField
                      label="Brochure / portfolio"
                      value={s.brochureUrl}
                      userId={memberId}
                      validationError={errs.brochureUrl}
                      onToast={showToast}
                      onChange={(v) => updateService(s.id, "brochureUrl", v)}
                    />
                  </div>

                  <SectionHeading>Features &amp; description</SectionHeading>
                  <div className="grid grid-cols-1 gap-4">
                    <TextAreaField
                      label="Key features / highlights"
                      value={s.keyFeatures}
                      placeholder="15+ years experience • Free initial consultation"
                      hint="Use bullet points (•) to list features"
                      maxLength={500}
                      onChange={(v) => updateService(s.id, "keyFeatures", v)}
                    />
                    <TextAreaField
                      label="Detailed description"
                      value={s.description}
                      placeholder="Comprehensive service specifications and terms..."
                      rows={4}
                      maxLength={1000}
                      onChange={(v) => updateService(s.id, "description", v)}
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setServices((prev) => [...prev, emptyService()])}
              className="w-full rounded-2xl border-2 border-dashed border-purple-300 py-3 text-[14px] font-bold text-purple-700 transition hover:border-purple-500 hover:bg-purple-50"
            >
              + Add another service
            </button>
          </div>
        )}

        {/* COMPANY */}
        {activeKind === "COMPANY" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            {/* {hasCompany === false && !editId && !companyId && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-amber-800">
                <span className="mt-0.5 text-base">⚠️</span>
                <div>
                  <p className="font-semibold">Add your company first</p>
                  <p className="mt-0.5 text-xs text-amber-700">You need to save a company before you can add products or services. Fill in the details below and save.</p>
                </div>
              </div>
            )} */}
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[15px] font-bold text-purple-700">Company details</span>
              <StatusPill status={status.COMPANY ?? "idle"} />
            </div>
            <SectionHeading>Basic information</SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Company name" required value={company.companyName} error={companyErrors.companyName} placeholder="e.g. AskOxy Technologies" onChange={(v) => updateCompany("companyName", v)} maxLength={100} />

              <TextField label="Locations" required value={company.locations} error={companyErrors.locations} placeholder="e.g. Hyderabad, Telangana" hint="City or cities where you operate" onChange={(v) => updateCompany("locations", v)} />
              <TextField label="GST number" value={company.gstNumber} error={companyErrors.gstNumber} placeholder="22AAAAA0000A1Z5" hint="15-character GSTIN (optional)" maxLength={15} onChange={(v) => updateCompany("gstNumber", v.toUpperCase())} />
              <TextField label="Website URL" value={company.websiteUrl} error={companyErrors.websiteUrl} placeholder="https://example.com" hint="Must start with https://" onChange={(v) => updateCompany("websiteUrl", v)} />
              <TextField label="LinkedIn URL" value={company.linkedinUrl} error={companyErrors.linkedinUrl} placeholder="https://linkedin.com/company/..." hint="Your company LinkedIn page" onChange={(v) => updateCompany("linkedinUrl", v)} />
            </div>
            <SectionHeading>Brand and documents</SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UploadField label="Company logo" value={company.logoUrl} userId={memberId} isImage validationError={companyErrors.logoUrl} onToast={showToast} onChange={(v) => updateCompany("logoUrl", v)} />
              <UploadField label="GST document" value={company.gstDocumentUrl} userId={memberId} validationError={companyErrors.gstDocumentUrl} onToast={showToast} onChange={(v) => updateCompany("gstDocumentUrl", v)} />
            </div>
            <SectionHeading>About the company</SectionHeading>
            <TextAreaField label="Company description" required value={company.companyDescription} error={companyErrors.companyDescription} placeholder="Describe your company, what you offer, your mission and key strengths..." rows={5} maxLength={1000} hint="Min 50 characters recommended" onChange={(v) => updateCompany("companyDescription", v)} />
          </div>
        )}

        {/* Save action — normal flow, below Add another Product / Service */}
        <div className="mt-5 flex items-center justify-end gap-2 pb-2">
          {(editId || companyId) && (
            <button
              type="button"
              onClick={() => navigate(companyId ? "/main/dashboard/my-companies" : "/main/dashboard/my-products-services")}
              disabled={savingAll}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-purple-300 hover:text-purple-700 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:from-[#3B0764] hover:via-[#6D28D9] hover:to-[#9333EA] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]"
          >
            {savingAll ? "Saving…" : editId || companyId ? `Update ${activeKind === "PRODUCT" ? "Product" : activeKind === "SERVICE" ? "Service" : "Company"}` : `Save ${activeKind === "PRODUCT" ? "Product" : activeKind === "SERVICE" ? "Service" : "Company"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductServiceManager;
export type { ProductEntry, ServiceEntry, CompanyEntry };
