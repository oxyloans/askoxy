import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
const USER_ID_STORAGE_KEY = "userId";



type ProductCondition = "NEW" | "USED" | "REFURBISHED";
type ServiceMode = "ONLINE" | "OFFLINE" | "HYBRID";
type PriceType = "FIXED" | "HOURLY" | "NEGOTIABLE" | "PER_SESSION";
type EntryKind = "PRODUCT" | "SERVICE";
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

interface FieldErrors {
  name?: string;
  category?: string;
  price?: string;
}

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

/* ------------------------------------------------------------------ */
/*  Small shared UI primitives                                         */
/* ------------------------------------------------------------------ */

const fieldBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 " +
  "placeholder:text-gray-400 outline-none transition focus:border-purple-500 " +
  "focus:ring-2 focus:ring-purple-500/20";

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
    {required && <span className="text-rose-500">*</span>}
  </label>
);

const ErrorText: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="mt-1 flex items-center gap-1 text-xs font-medium text-rose-600"><span>⚠</span>{msg}</p> : null;

const TextField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; placeholder?: string; required?: boolean;
  error?: string; list?: string; type?: string;
}> = ({ label, value, onChange, onBlur, placeholder, required, error, list, type = "text" }) => (
  <div>
    <Label required={required}>{label}</Label>
    <input
      type={type}
      className={fieldBase + (error ? " !border-rose-400 !ring-rose-400/20" : "")}
      value={value} placeholder={placeholder} list={list}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
    <ErrorText msg={error} />
  </div>
);

const TextAreaField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <Label>{label}</Label>
    <textarea
      className={fieldBase + " resize-none"}
      rows={rows} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SelectField: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; required?: boolean; error?: string;
}> = ({ label, value, onChange, options, placeholder = "Select…", required, error }) => (
  <div>
    <Label required={required}>{label}</Label>
    <select
      className={fieldBase + (error ? " !border-rose-400 !ring-rose-400/20" : "")}
      value={value} onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ErrorText msg={error} />
  </div>
);

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

const UploadField: React.FC<{
  label: string;
  value: string;
  onChange: (url: string) => void;
  userId: string;
  isImage?: boolean;
  compact?: boolean;
}> = ({ label, value, onChange, userId, isImage = false, compact = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const accept = isImage ? "image/*" : ".pdf,.doc,.docx,.png,.jpg,.jpeg";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
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
      setSuccessMsg(`${isImage ? "Image" : "File"} uploaded successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label>{label}</Label>
        {value && (
          <a href={value} target="_blank" rel="noreferrer"
            className="text-[11px] font-semibold text-purple-700 hover:underline">
            View {isImage ? "image" : "file"}
          </a>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-1 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
        <input
          className="w-full min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          placeholder={isImage ? "Paste image URL or upload" : "Paste document URL or upload"}
          value={value}
          onChange={(e) => { onChange(e.target.value); setSuccessMsg(null); }}
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
      {isImage && value && !uploading && (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2">
          <img src={value} alt={`${label} preview`} className="h-14 w-14 rounded-md bg-white object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700">Image ready</p>
            <p className="truncate text-[11px] text-gray-400">Preview of the uploaded image</p>
          </div>
          <button type="button" onClick={() => { onChange(""); setSuccessMsg(null); }} className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">Remove</button>
        </div>
      )}
      {!compact && <p className="mt-1 text-right text-[11px] text-gray-400">Max 5 MB</p>}
    </div>
  );
};

const SectionHeading: React.FC<{
  children: React.ReactNode;
  accent?: string;
}> = ({ children, accent }) => (
  <div className="mb-3 mt-5 flex items-center gap-2 border-b border-purple-100 pb-2 first:mt-0">
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
    <span className="text-[13px] font-bold tracking-wide text-purple-700">
      {children}
    </span>
  </div>
);

const StatusPill: React.FC<{ status: SaveStatus }> = ({ status }) => {
  if (status === "idle") return null;
  const map: Record<Exclude<SaveStatus, "idle">, string> = {
    saving: "bg-amber-50 text-amber-700 border-amber-200",
    saved: "bg-purple-50 text-purple-700 border-purple-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
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

const ProductServiceManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editId: string | undefined = (location.state as { editId?: string } | null)?.editId;

  const [memberId, setMemberId] = useState<string>("");
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  useEffect(() => {
    setMemberId(localStorage.getItem(USER_ID_STORAGE_KEY) || "");
  }, []);

  const [activeKind, setActiveKind] = useState<EntryKind>("PRODUCT");
  const [products, setProducts] = useState<ProductEntry[]>([emptyProduct()]);
  const [services, setServices] = useState<ServiceEntry[]>([emptyService()]);

  // GST — UI only, not sent to backend (backend DTO has no gst fields)
  const [gstNumber, setGstNumber] = useState("");
  const [gstDocumentUrl, setGstDocumentUrl] = useState("");

  /* ── pre-fill form when editing an existing entry ── */
  useEffect(() => {
    if (!editId) return;
    const mId = localStorage.getItem(USER_ID_STORAGE_KEY) || "";
    if (!mId) { setLoadingEdit(false); return; }
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
      .catch(() => {})
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  const [productErrors, setProductErrors] = useState<Record<string, FieldErrors>>({});
  const [serviceErrors, setServiceErrors] = useState<Record<string, FieldErrors>>({});
  const [status, setStatus] = useState<Record<string, SaveStatus>>({});
  const [banner, setBanner] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [savingAll, setSavingAll] = useState(false);

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
    if (key === "name" || key === "category" || key === "price") {
      setProductErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], [key]: undefined },
      }));
    }
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
    if (key === "name" || key === "category" || key === "price") {
      setServiceErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], [key]: undefined },
      }));
    }
  };

  const removeProduct = (id: string) => {
    if (products.length === 1) return;
    const product = products.find((item) => item.id === id);
    if (product && isProductFilled(product) && !window.confirm("Remove this product? Your entered details will be lost.")) return;
    setProducts((prev) =>
      prev.filter((p) => p.id !== id),
    );
    setProductErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeService = (id: string) => {
    if (services.length === 1) return;
    const service = services.find((item) => item.id === id);
    if (service && isServiceFilled(service) && !window.confirm("Remove this service? Your entered details will be lost.")) return;
    setServices((prev) =>
      prev.filter((s) => s.id !== id),
    );
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

  /* ---------- save ---------- */

  const handleSaveAll = async () => {
    setBanner(null);

    if (!memberId) {
      setBanner({
        type: "error",
        text: "We couldn't find your user id — please log in again.",
      });
      return;
    }

    const nextProductErrors: Record<string, FieldErrors> = {};
    const filledProducts = products.filter(isProductFilled);
    filledProducts.forEach((p) => {
      const errs: FieldErrors = {};
      if (!p.name.trim()) errs.name = "Product name is required";
      if (!p.category.trim()) errs.category = "Category is required";
      if (Object.keys(errs).length) nextProductErrors[p.id] = errs;
    });

    const nextServiceErrors: Record<string, FieldErrors> = {};
    const filledServices = services.filter(isServiceFilled);
    filledServices.forEach((s) => {
      const errs: FieldErrors = {};
      if (!s.name.trim()) errs.name = "Service name is required";
      if (!s.category.trim()) errs.category = "Category is required";
      if (Object.keys(errs).length) nextServiceErrors[s.id] = errs;
    });

    setProductErrors(nextProductErrors);
    setServiceErrors(nextServiceErrors);

    if (Object.keys(nextProductErrors).length) {
      setActiveKind("PRODUCT");
      setBanner({
        type: "error",
        text: "Fix the highlighted product fields before saving.",
      });
      window.setTimeout(() => document.getElementById(`entry-${Object.keys(nextProductErrors)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    if (Object.keys(nextServiceErrors).length) {
      setActiveKind("SERVICE");
      setBanner({
        type: "error",
        text: "Fix the highlighted service fields before saving.",
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
      setBanner({
        type: "info",
        text: "Nothing to save yet — fill in at least one product or service.",
      });
      return;
    }

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
      setBanner({
        type: "success",
        text: successMsg || "All products and services saved successfully.",
      });
    } else {
      setBanner({
        type: "error",
        text: `${failCount} item${failCount > 1 ? "s" : ""
          } failed to save${errorMsg ? `: ${errorMsg}` : ". Please retry."
          }`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-white px-3 pb-28 pt-5 sm:px-4 sm:pb-20 sm:pt-8">
      {loadingEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
            <p className="text-sm font-semibold text-purple-700">Loading details…</p>
          </div>
        </div>
      )}
      <DatalistOptions id="product-categories" values={PRODUCT_CATEGORIES} />
      <DatalistOptions id="service-categories" values={SERVICE_CATEGORIES} />
      <DatalistOptions id="availability-options" values={AVAILABILITY_OPTIONS} />
      <DatalistOptions id="quantity-units" values={QUANTITY_UNITS} />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {editId && (
              <button
                type="button"
                onClick={() => navigate("/main/dashboard/my-products-services")}
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
                {editId ? "Edit Product / Service" : "Add Products & Services"}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {editId ? "Update the details below and save." : "Add clear details so customers can quickly understand your offering."}
              </p>
            </div>
          </div>
          {/* Kind switch tabs */}
          <div className="grid w-full shrink-0 grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 sm:w-auto">
            {(["PRODUCT", "SERVICE"] as EntryKind[]).map((kind) => {
              const isActive = activeKind === kind;
              const count = kind === "PRODUCT" ? products.length : services.length;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setActiveKind(kind)}
                  className={
                    "flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 " +
                    (isActive
                      ? "bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] text-white shadow"
                      : "text-gray-500 hover:bg-white hover:text-purple-700")
                  }
                >
                  {kind === "PRODUCT" ? "Products" : "Services"}
                  <span className={"rounded-full px-1.5 py-0.5 text-[11px] font-bold " +
                    (isActive ? "bg-white/25 text-white" : "bg-gray-200 text-gray-500")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* GST details — captured once, shared across all products & services */}
        <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-sm sm:p-5">
          <div className="mb-3">
            <span className="text-[13px] font-bold tracking-wide text-purple-800">
              GST details
            </span>
            <p className="text-[12px] text-gray-400">
              Add this once — it applies to all of your products and services.
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <TextField
              label="GST number"
              value={gstNumber}
              placeholder="36AAAAA0000A1Z5"
              onChange={setGstNumber}
            />
            <UploadField
              label="GST document"
              value={gstDocumentUrl}
              userId={memberId}
              compact
              onChange={setGstDocumentUrl}
            />
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
                      onChange={(v) => updateProduct(p.id, "name", v)}
                    />
                    <TextField
                      label="Category"
                      required
                      value={p.category}
                      error={errs.category}
                      placeholder="e.g. Healthcare, Textiles"
                      list="product-categories"
                      onChange={(v) => updateProduct(p.id, "category", v)}
                    />
                    <TextField
                      label="Sub-category"
                      value={p.subCategory}
                      placeholder="e.g. Hair Care"
                      onChange={(v) => updateProduct(p.id, "subCategory", v)}
                    />
                    <TextField
                      label="Brand / manufacturer"
                      value={p.brand}
                      placeholder="e.g. Tata Steel"
                      onChange={(v) => updateProduct(p.id, "brand", v)}
                    />
                  </div>

                  <SectionHeading>Pricing, stock &amp; specifications</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TextField
                      label="Selling price (₹)"
                      value={p.price}
                      placeholder="499"
                      onChange={(v) => updateProduct(p.id, "price", v)}
                    />
                    <TextField
                      label="MRP (₹)"
                      value={p.mrp}
                      placeholder="699"
                      onChange={(v) => updateProduct(p.id, "mrp", v)}
                    />
                    <TextField
                      label="Availability"
                      value={p.availability}
                      placeholder="In Stock"
                      list="availability-options"
                      onChange={(v) => updateProduct(p.id, "availability", v)}
                    />
                    <SelectField
                      label="Price type"
                      value={p.priceType}
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
                      placeholder="500, 1, 10"
                      onChange={(v) => updateProduct(p.id, "quantity", v)}
                    />
                    <TextField
                      label="Quantity unit"
                      value={p.quantityUnit}
                      placeholder="pcs, kg, ml"
                      list="quantity-units"
                      onChange={(v) => updateProduct(p.id, "quantityUnit", v)}
                    />
                    <TextField
                      label="Stock quantity"
                      value={p.stockQuantity}
                      placeholder="50"
                      onChange={(v) => updateProduct(p.id, "stockQuantity", v)}
                    />
                    <SelectField
                      label="Condition"
                      value={p.productCondition}
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
                      value={p.returnAvailable}
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
                      value={p.warrantyAvailable}
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
                        value={p.returnDays}
                        placeholder="7, 10, 30"
                        onChange={(v) => updateProduct(p.id, "returnDays", v)}
                      />
                    )}
                    {p.warrantyAvailable === "true" && (
                      <TextField
                        label="Warranty period"
                        value={p.warrantyPeriod}
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
                      onChange={(v) => updateProduct(p.id, "imageUrl", v)}
                    />
                  </div>

                  <SectionHeading>Features &amp; description</SectionHeading>
                  <div className="grid grid-cols-1 gap-4">
                    <TextAreaField
                      label="Key features / highlights"
                      value={p.keyFeatures}
                      placeholder="100% natural ingredients • 2-year warranty • ISO certified"
                      onChange={(v) => updateProduct(p.id, "keyFeatures", v)}
                    />
                    <TextAreaField
                      label="Detailed description"
                      value={p.description}
                      placeholder="Specifications and details a fellow member should know..."
                      rows={4}
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
                      onChange={(v) => updateService(s.id, "name", v)}
                    />
                    <TextField
                      label="Category"
                      required
                      value={s.category}
                      error={errs.category}
                      placeholder="e.g. Legal Services, Healthcare"
                      list="service-categories"
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
                      value={s.price}
                      placeholder="1500"
                      onChange={(v) => updateService(s.id, "price", v)}
                    />
                    <SelectField
                      label="Pricing model"
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
                    <TextField
                      label="Availability"
                      value={s.availability}
                      placeholder="By Appointment Only"
                      list="availability-options"
                      onChange={(v) => updateService(s.id, "availability", v)}
                    />
                    <SelectField
                      label="Service mode"
                      value={s.serviceMode}
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
                      value={s.bookingRequired}
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
                      onChange={(v) => updateService(s.id, "imageUrl", v)}
                    />
                    <UploadField
                      label="Brochure / portfolio"
                      value={s.brochureUrl}
                      userId={memberId}
                      onChange={(v) => updateService(s.id, "brochureUrl", v)}
                    />
                  </div>

                  <SectionHeading>Features &amp; description</SectionHeading>
                  <div className="grid grid-cols-1 gap-4">
                    <TextAreaField
                      label="Key features / highlights"
                      value={s.keyFeatures}
                      placeholder="15+ years experience • Free initial consultation"
                      onChange={(v) => updateService(s.id, "keyFeatures", v)}
                    />
                    <TextAreaField
                      label="Detailed description"
                      value={s.description}
                      placeholder="Comprehensive service specifications and terms..."
                      rows={4}
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

        {/* Save bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-purple-100 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(76,29,149,0.10)] backdrop-blur sm:sticky sm:bottom-4 sm:mt-6 sm:rounded-2xl sm:border sm:px-4">
          {banner && (
            <div
              className={
                "mx-auto mb-3 flex max-w-6xl items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium " +
                (banner.type === "success"
                  ? "border-purple-200 bg-purple-50 text-purple-800"
                  : banner.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-amber-200 bg-amber-50 text-amber-800")
              }
              role="status"
              aria-live="polite"
            >
              <span className="flex min-w-0 items-start gap-2">
                <span aria-hidden="true">
                  {banner.type === "success" ? "✅" : banner.type === "error" ? "❌" : "ℹ️"}
                </span>
                <span className="break-words">{banner.text}</span>
              </span>
              <button
                type="button"
                onClick={() => setBanner(null)}
                className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100"
                aria-label="Dismiss message"
              >
                &times;
              </button>
            </div>
          )}
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              {editId ? (
                <>
                  <p className="text-xs font-semibold text-gray-700">Editing existing {activeKind === "PRODUCT" ? "product" : "service"}</p>
                  <p className="hidden text-[11px] text-gray-400 sm:block">Changes will update the saved record.</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-700">{products.filter(isProductFilled).length} product{products.filter(isProductFilled).length === 1 ? "" : "s"} · {services.filter(isServiceFilled).length} service{services.filter(isServiceFilled).length === 1 ? "" : "s"} ready</p>
                  <p className="hidden text-[11px] text-gray-400 sm:block">Your details remain visible after saving.</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editId && (
                <button
                  type="button"
                  onClick={() => navigate("/main/dashboard/my-products-services")}
                  disabled={savingAll}
                  className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-purple-300 hover:text-purple-700 disabled:opacity-50 sm:px-6"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={savingAll}
                className="shrink-0 rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:from-[#3B0764] hover:via-[#6D28D9] hover:to-[#9333EA] disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:text-[15px]"
              >
                {savingAll ? "Saving…" : editId ? "Update Details" : "Save All Details"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductServiceManager;
export type { ProductEntry, ServiceEntry };
