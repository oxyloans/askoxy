import React, { useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  message,
  Row,
  Col,
  Tag,
  ConfigProvider,
  Alert,
  AutoComplete,
  Tabs,
  Badge,
  Select,
  Switch,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  SendOutlined,
  IdcardOutlined,
  ShopOutlined,
  ToolOutlined,
  BulbFilled,
  PhoneOutlined,
  BankOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  EyeOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  FileImageOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text, Paragraph } = Typography;

export type ProductCondition = "NEW" | "USED" | "REFURBISHED";
export type ServiceMode = "ONLINE" | "OFFLINE" | "HYBRID";
export type PriceType = "FIXED" | "HOURLY" | "NEGOTIABLE" | "PER_SESSION";
export type MembersType = "PRODUCT" | "SERVICE";

interface RotaryProductService {
  id?: string;
  memberId?: string;
  membersType?: MembersType;
  // Shared fields
  category?: string;
  subCategory?: string;
  name?: string;
  description?: string;
  keyFeatures?: string;
  price?: number;
  availability?: string;
  imageUrl?: string;
  color?: string;
  gstNumber?: string;
  gstDocumentUrl?: string;
  paymentModes?: string;
  // Product fields
  brand?: string;
  quantity?: number;
  quantityUnit?: string;
  variant?: string;
  mrp?: number;
  stockQuantity?: number;
  productCondition?: ProductCondition;
  returnAvailable?: boolean;
  returnDays?: string;
  warrantyAvailable?: boolean;
  warrantyPeriod?: string;
  deliveryTime?: string;
  // Service fields
  providerName?: string;
  businessName?: string;
  serviceMode?: ServiceMode;
  serviceLocation?: string;
  serviceDuration?: string;
  priceType?: PriceType;
  bookingRequired?: boolean;
  targetCustomers?: string;
  cancellationPolicy?: string;
  refundPolicy?: string;
  brochureUrl?: string;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

interface RotaryMemberDetails {
  id?: string;
  // Personal
  rotary_id?: string;
  name?: string;
  club?: string;
  district?: string;
  location?: string;
  state?: string;
  blood_group?: string;
  birthday?: string;
  anniversary?: string;
  // Contact
  email?: string;
  primary_mobile?: string;
  secondary_mobile?: string;
  // Business
  designation?: string;
  classification?: string;
  business_name?: string;
  keywords?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  gst_number?: string;
  gst_document_url?: string;
  products?: RotaryProductService[] | null;
  services?: RotaryProductService[] | null;
}

interface ProductEntry {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  variant: string;
  color: string;
  price: string;
  priceType: PriceType | "";
  mrp: string;
  quantity: string;
  quantityUnit: string;
  stockQuantity: string;
  productCondition: ProductCondition | "";
  availability: string;
  deliveryTime: string;
  returnAvailable: boolean | null;
  returnDays?: string;
  warrantyAvailable: boolean | null;
  warrantyPeriod?: string;
  keyFeatures: string;
  description: string;
  imageUrl: string;
  gstNumber: string;
  gstDocumentUrl: string;
  paymentModes: string;
}

interface ServiceEntry {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  providerName: string;
  businessName: string;
  serviceMode: ServiceMode | "";
  serviceLocation: string;
  serviceDuration: string;
  price: string;
  priceType: PriceType | "";
  availability: string;
  bookingRequired: boolean | null;
  targetCustomers: string;
  cancellationPolicy: string;
  refundPolicy: string;
  brochureUrl: string;
  imageUrl: string;
  gstNumber: string;
  gstDocumentUrl: string;
  paymentModes: string;
  keyFeatures: string;
  description: string;
}

interface RotaryApiMember {
  id: string;
  rotaryId: string | null;
  name: string | null;
  clubName: string | null;
  districtId: number | null;
  emails: string | null; // comma-separated
  mobileNumbers: string | null; // comma-separated
  city: string | null;
  address: string | null;
  state: string | null;
  classification: string | null;
  bloodGroup: string | null;
  secondaryMobile: string | null;
  businessName: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  gstNumber: string | null;
  gstDocumentUrl: string | null;
  anniversary: string | null;
  products?: RotaryProductService[] | null;
  services?: RotaryProductService[] | null;
}

interface RotaryApiResponse {
  data: RotaryApiMember[];
  message: string;
  status: boolean;
}

const splitFirst = (val: unknown): string => {
  if (!val) return "";
  const str = String(val);
  return str.split(",")[0]?.trim() ?? "";
};
const splitSecond = (val: unknown): string => {
  if (!val) return "";
  const str = String(val);
  const parts = str.split(",");
  return parts[1]?.trim() ?? "";
};

const formatAnniversaryForDisplay = (val: string | number | null): string => {
  if (!val) return "";
  const num = Number(val);
  if (!isNaN(num)) {
    const d = new Date(num);
    if (!isNaN(d.getTime())) {
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
      return `${d.getDate()} ${months[d.getMonth()]}`;
    }
  }
  return String(val);
};

const mapApiMemberToDetails = (m: RotaryApiMember): RotaryMemberDetails => ({
  id: m.id ?? "",
  rotary_id: m.rotaryId ?? "",
  name: m.name ?? "",
  club: m.clubName ?? "",
  district: m.districtId != null ? String(m.districtId) : "",
  location: m.city ?? "",
  state: m.state ?? "",
  blood_group: m.bloodGroup ?? "",
  birthday: "", // not present in API yet
  anniversary: formatAnniversaryForDisplay(m.anniversary),
  email: splitFirst(m.emails),
  primary_mobile: splitFirst(m.mobileNumbers),
  secondary_mobile: m.secondaryMobile ?? splitSecond(m.mobileNumbers),
  designation: "", // not present in API yet
  classification: m.classification ?? "",
  business_name: m.businessName ?? "",
  keywords: "", // not present in API yet
  business_email: m.businessEmail ?? "",
  business_phone: m.businessPhone ?? "",
  business_address: m.businessAddress ?? m.address ?? "",
  gst_number: m.gstNumber ?? "",
  gst_document_url: m.gstDocumentUrl ?? "",
  products: m.products || [],
  services: m.services || [],
});

type ProductFieldErrors = Partial<
  Record<keyof Omit<ProductEntry, "id">, string>
>;
type ServiceFieldErrors = Partial<
  Record<keyof Omit<ServiceEntry, "id">, string>
>;

type FieldType = "text" | "email" | "mobile" | "bloodGroup" | "autocomplete";
type Section = "personal" | "contact" | "business";

interface FieldDef {
  key: keyof RotaryMemberDetails;
  label: string;
  placeholder: string;
  type: FieldType;
  section: Section;
  options?: string[];
  // Mandatory only when a brand-new member fills the form.
  essential?: boolean;
  // Never editable once a member record already exists.
  lockedForExisting?: boolean;
}

const CLASSIFICATION_OPTIONS = [
  "Investment Banker",
  "Doctor",
  "Advocate / Lawyer",
  "Chartered Accountant",
  "Real Estate Agent",
  "Entrepreneur",
  "Software Engineer",
  "Consultant",
  "Teacher / Educator",
  "Architect",
];

const DESIGNATION_OPTIONS = [
  "Founder",
  "Founder Partner",
  "Managing Director",
  "Director",
  "Partner",
  "Proprietor",
  "CEO",
  "President",
];

const FIELD_CONFIG: FieldDef[] = [
  // Personal
  {
    key: "rotary_id",
    label: "Rotary ID",
    placeholder: "e.g. 3401821",
    type: "text",
    section: "personal",
    essential: true,
    lockedForExisting: true,
  },
  {
    key: "name",
    label: "Full Name",
    placeholder: "e.g. Ramu",
    type: "text",
    section: "personal",
    essential: true,
  },
  {
    key: "club",
    label: "Club",
    placeholder: "e.g. Abhyuday Hyderabad",
    type: "text",
    section: "personal",
    essential: true,
    lockedForExisting: true,
  },
  {
    key: "district",
    label: "District",
    placeholder: "e.g. 3150",
    type: "text",
    section: "personal",
    essential: true,
    lockedForExisting: true,
  },
  {
    key: "location",
    label: "Location",
    placeholder: "e.g. Hyderabad",
    type: "text",
    section: "personal",
  },
  {
    key: "state",
    label: "State",
    placeholder: "e.g. Telangana",
    type: "text",
    section: "personal",
  },
  {
    key: "blood_group",
    label: "Blood Group",
    placeholder: "e.g. A+",
    type: "bloodGroup",
    section: "personal",
  },
  // {
  //   key: "birthday",
  //   label: "DOB",
  //   placeholder: "e.g. 26 Apr",
  //   type: "text",
  //   section: "personal",
  // },
  {
    key: "anniversary",
    label: "DOB",
    placeholder: "e.g. 12 Aug",
    type: "text",
    section: "personal",
  },
  // Contact
  {
    key: "email",
    label: "Email",
    placeholder: "e.g. name@example.com",
    type: "email",
    section: "contact",
    essential: true,
  },
  {
    key: "primary_mobile",
    label: "Primary Mobile",
    placeholder: "e.g. +91 9966644446",
    type: "mobile",
    section: "contact",
    essential: true,
  },
  {
    key: "secondary_mobile",
    label: "Secondary Mobile",
    placeholder: "e.g. +91 9293850544",
    type: "mobile",
    section: "contact",
  },
  // Business
  {
    key: "classification",
    label: "Classification",
    placeholder: "e.g. Investment Banker",
    type: "autocomplete",
    section: "business",
    options: CLASSIFICATION_OPTIONS,
  },
  {
    key: "business_name",
    label: "Business Name",
    placeholder: "e.g. Invictus FinServ LLP",
    type: "text",
    section: "business",
  },
  {
    key: "business_email",
    label: "Business Email",
    placeholder: "e.g. name@company.com",
    type: "email",
    section: "business",
  },
  {
    key: "business_phone",
    label: "Business Phone",
    placeholder: "e.g. 9966644446",
    type: "mobile",
    section: "business",
  },
  {
    key: "business_address",
    label: "Business Address",
    placeholder: "e.g. Madadi Road, Macherla, AP, 522426",
    type: "text",
    section: "business",
  },
  {
    key: "gst_number",
    label: "GST Number (GSTIN)",
    placeholder: "e.g. 36AAAAA0000A1Z5",
    type: "text",
    section: "business",
  },
];

const MOBILE_REGEX = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const BLOOD_GROUP_REGEX =
  /^(A|B|AB|O)\s?[+-]$|^(A|B|AB|O)\s?(ve|Ve|VE)$|^(A|B|AB|O)\s?(pos|Pos|neg|Neg)$/i;

const getRulesForField = (
  type: FieldType,
  required: boolean,
  label: string,
) => {
  const rules: any[] = required
    ? [{ required: true, message: `${label} is required` }]
    : [];
  if (type === "email")
    rules.push({ type: "email", message: "Enter a valid email address" });
  if (type === "mobile")
    rules.push({
      pattern: MOBILE_REGEX,
      message: "Enter a valid 10-digit mobile number",
    });
  if (type === "bloodGroup")
    rules.push({
      pattern: BLOOD_GROUP_REGEX,
      message: "e.g. A+, O-, AB+, B+ ve",
    });
  return rules;
};

const PRODUCT_CATEGORY_OPTIONS = [
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
].map((v) => ({ value: v }));

const SERVICE_CATEGORY_OPTIONS = [
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
].map((v) => ({ value: v }));

const AVAILABILITY_OPTIONS = [
  "Always Available",
  "In Stock",
  "Made to Order",
  "By Appointment Only",
  "Weekdays Only",
  "Seasonal",
].map((v) => ({ value: v }));

const PRODUCT_CONDITION_OPTIONS: { value: ProductCondition; label: string }[] =
  [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
    { value: "REFURBISHED", label: "Refurbished" },
  ];

const SERVICE_MODE_OPTIONS: { value: ServiceMode; label: string }[] = [
  { value: "ONLINE", label: "Online / Virtual" },
  { value: "OFFLINE", label: "In-Person / Onsite" },
  { value: "HYBRID", label: "Hybrid (Online & In-Person)" },
];

const PRICE_TYPE_OPTIONS: { value: PriceType; label: string }[] = [
  { value: "FIXED", label: "Fixed Price" },
  { value: "HOURLY", label: "Hourly Rate" },
  { value: "NEGOTIABLE", label: "Negotiable" },
  { value: "PER_SESSION", label: "Per Session / Consultation" },
];

const QUANTITY_UNIT_OPTIONS = [
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
].map((v) => ({ value: v }));

const PAYMENT_MODE_OPTIONS = [
  "UPI",
  "Net Banking",
  "Credit / Debit Cards",
  "Cash on Delivery",
  "Cheque",
  "UPI, Net Banking & Cards",
  "All Payment Modes Accepted",
].map((v) => ({ value: v }));

const fetchMemberByMobile = async (
  searchValue: string,
): Promise<RotaryMemberDetails | null> => {
  const res = await fetch(
    `${BASE_URL}/marketing-service/campgin/rotary-data-search?search=${encodeURIComponent(searchValue)}`,
    { headers: { accept: "*/*" } },
  );

  if (!res.ok && res.status !== 404) {
    throw new Error(`Search failed with status ${res.status}`);
  }

  const json: RotaryApiResponse = await res.json();
  if (!json.status || !json.data || json.data.length === 0) return null;

  return mapApiMemberToDetails(json.data[0]);
};

const uid = () => Math.random().toString(36).slice(2, 10);
const genUUID = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const isUUID = (str?: string): boolean =>
  Boolean(
    str &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str),
  );

const emptyProduct = (): ProductEntry => ({
  id: uid(),
  name: "",
  category: "",
  subCategory: "",
  brand: "",
  variant: "",
  color: "",
  price: "",
  priceType: "FIXED",
  mrp: "",
  quantity: "",
  quantityUnit: "",
  stockQuantity: "",
  productCondition: "",
  availability: "",
  deliveryTime: "",
  returnAvailable: null,
  returnDays: "",
  warrantyAvailable: null,
  warrantyPeriod: "",
  keyFeatures: "",
  description: "",
  imageUrl: "",
  gstNumber: "",
  gstDocumentUrl: "",
  paymentModes: "",
});

const emptyService = (): ServiceEntry => ({
  id: uid(),
  name: "",
  category: "",
  subCategory: "",
  providerName: "",
  businessName: "",
  serviceMode: "",
  serviceLocation: "",
  serviceDuration: "",
  price: "",
  priceType: "FIXED",
  availability: "",
  bookingRequired: null,
  targetCustomers: "",
  cancellationPolicy: "",
  refundPolicy: "",
  brochureUrl: "",
  imageUrl: "",
  gstNumber: "",
  gstDocumentUrl: "",
  paymentModes: "",
  keyFeatures: "",
  description: "",
});

const uploadCompanyFile = async (
  file: File,
  fileType: string = "company",
  targetUserId: string,
): Promise<string> => {
  if (!targetUserId || !targetUserId.trim()) {
    message.warning(
      "User ID not found. Please search or load user details first.",
    );
    throw new Error("User ID is required to upload");
  }

  const formData = new FormData();
  formData.append("file", file);

  const uploadUrl = `${BASE_URL}/marketing-service/campgin/upload-company-logo?fileType=company&userId=${encodeURIComponent(
    targetUserId.trim(),
  )}`;

  const accessToken = await ensureAccessToken();

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      accept: "*/*",
      contentType: "application.json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }

  const text = await res.text();
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
};

const SectionHeading: React.FC<{
  children: React.ReactNode;
  accent?: string;
}> = ({ children, accent = "#0E6B4F" }) => (
  <div
    className="flex items-center gap-2 mt-1 mb-3 pb-2"
    style={{ borderBottom: `1.5px solid ${accent}33` }}
  >
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: accent }}
    />
    <Text
      strong
      className="text-[16px]"
      style={{ color: accent, fontFamily: "'Fraunces', Georgia, serif" }}
    >
      {children}
    </Text>
  </div>
);

const FieldLabel: React.FC<{
  label: string;
  required?: boolean;
  hint?: boolean;
}> = ({ label, required, hint }) => (
  <div className="rbc-input-label">
    <span>{label}</span>
    {required && <span style={{ color: "#ff4d4f" }}>*</span>}
    {hint && <SuggestionHint />}
  </div>
);

const SuggestionHint: React.FC<{ text?: string; title?: string }> = ({
  text = "You can choose from the dropdown suggestions or type your own custom details directly.",
  title = "Custom Input Allowed",
}) => {
  return (
    <span className="relative inline-flex items-center group cursor-pointer ml-1.5 align-middle select-none">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 shadow-sm"
        style={{
          background: "#EBF5F0",
          color: "#0E6B4F",
          border: "1px solid #C2E3D3",
        }}
      >
        i
      </span>
      {/* Floating Tooltip Card */}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left"
        style={{
          background: "linear-gradient(145deg, #1A2721 0%, #121C17 100%)",
          border: "1px solid #2F4D3F",
          boxShadow:
            "0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(14, 107, 79, 0.2)",
        }}
      >
        <span className="flex items-center gap-1.5 font-bold text-[#E5B54F] text-[11px] tracking-wide uppercase mb-1">
          <BulbFilled className="text-[12px] text-[#FFD700]" />
          {title}
        </span>
        <span className="text-gray-200 block font-normal text-[12px] leading-relaxed">
          {text}
        </span>
        {/* Downward Arrow Pointer */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #121C17",
          }}
        />
      </span>
    </span>
  );
};

interface CompactUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  userId: string;
  placeholder?: string;
  accept?: string;
  isImage?: boolean;
}

const HIDDEN_LOGIN_MOBILE = "9849257032";

const ensureAccessToken = async (): Promise<string> => {
  const existing = localStorage.getItem("accessToken");
  if (existing) return existing;

  const res = await fetch(
    `https://meta.oxyloans.com/api/user-service/hiddenLoginByMobileNumber/${HIDDEN_LOGIN_MOBILE}`,
    {
      method: "POST",
      headers: { accept: "*/*" },
    },
  );
  if (!res.ok) {
    throw new Error(`Auto-login failed (${res.status})`);
  }
  const json = await res.json();
  const token = json?.accessToken;
  if (!token) {
    throw new Error("Auto-login did not return an access token");
  }
  localStorage.setItem("accessToken", token);
  return token;
};

const CompactUploadField: React.FC<CompactUploadFieldProps> = ({
  label,
  value,
  onChange,
  userId,
  placeholder,
  accept,
  isImage = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const defaultAccept = isImage ? "image/*" : ".pdf,.doc,.docx,.png,.jpg,.jpeg";

  const defaultPlaceholder = isImage
    ? "Paste image URL or click Upload"
    : "Paste document URL or click Upload";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      message.error("File size must be under 15MB");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await uploadCompanyFile(file, "company", userId);
      if (
        uploadedUrl &&
        typeof uploadedUrl === "string" &&
        uploadedUrl.trim()
      ) {
        onChange(uploadedUrl.trim());
        message.success(`${label} uploaded successfully!`);
      } else {
        message.error("Upload did not return a valid URL.");
      }
    } catch (err: any) {
      console.error(err);
      message.error("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="inline-flex items-center">
          <Text className="text-[15px] font-semibold text-[#3A2F23]">
            {label}
          </Text>
          <SuggestionHint
            title={isImage ? "Image URL or Upload" : "File URL or Upload"}
            text={
              isImage
                ? "Please enter the image URL or click 'Upload' to select and upload an image from your device."
                : "Please enter the document URL or click 'Upload' to select and upload a file from your device."
            }
          />
        </div>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-[#0E6B4F] hover:underline inline-flex items-center gap-1 font-medium"
          >
            <EyeOutlined /> View {isImage ? "Image" : "File"}
          </a>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept || defaultAccept}
        onChange={handleFileChange}
      />

      <div
        className="rbc-upload-field flex items-center rounded-2xl p-1 gap-1.5 transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E4D9C4",
          boxShadow: "0 2px 8px -4px rgba(58,47,35,0.15)",
        }}
      >
        <Input
          placeholder={placeholder || defaultPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          allowClear
          bordered={false}
          prefix={
            isImage ? (
              <FileImageOutlined className="text-gray-400" />
            ) : (
              <FileTextOutlined className="text-gray-400" />
            )
          }
          style={{ background: "transparent", boxShadow: "none" }}
        />
        <Button
          icon={
            uploading ? (
              <LoadingOutlined />
            ) : value ? (
              <CheckCircleFilled />
            ) : (
              <UploadOutlined />
            )
          }
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="!font-semibold !rounded-xl shrink-0 transition-all hover:!scale-[1.03]"
          style={{
            background: value
              ? "linear-gradient(135deg,#0E6B4F 0%,#0A4F3A 100%)"
              : "linear-gradient(135deg,#12805F 0%,#0A4F3A 100%)",
            border: "none",
            color: "#FFFFFF",
            height: 40,
            paddingLeft: 16,
            paddingRight: 16,
            boxShadow: "0 6px 14px -5px rgba(14,107,79,0.5)",
          }}
        >
          {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
        </Button>
      </div>
      {/* 
      <div className="text-[12px] text-[#7A6B58] mt-1 flex items-center justify-between">
        <span>
          {isImage
            ? "👉 Enter direct image URL, or click 'Upload' to pick from device"
            : "👉 Enter document URL, or click 'Upload' to attach a file"}
        </span>
        <span className="text-gray-400 text-[11px]">Max 15MB</span>
      </div> */}
      <div className="text-[11px] text-gray-400 mt-1 text-right">Max 5MB</div>
    </div>
  );
};

const theme = {
  token: {
    colorPrimary: "#0E6B4F",
    colorSuccess: "#0E6B4F",
    colorWarning: "#C9932B",
    colorError: "#A32642",
    colorInfo: "#0E6B4F",
    borderRadius: 12,
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    controlHeight: 48, // was 42 — bigger tap targets
    fontSize: 16, // was default 14 — base text everywhere
    colorBorder: "#B8AB92",
    colorBorderSecondary: "#B8AB92",
  },
};

const serif = { fontFamily: "'Fraunces', Georgia, serif" };

const BrandMark: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0"
  >
    <defs>
      <linearGradient
        id="brandDisc"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#12805F" />
        <stop offset="1" stopColor="#0A4F3A" />
      </linearGradient>
    </defs>

    {/* outer ring */}
    <circle
      cx="32"
      cy="32"
      r="30"
      fill="none"
      stroke="#C9932B"
      strokeWidth="2.5"
    />
    <circle
      cx="32"
      cy="32"
      r="25"
      fill="none"
      stroke="#C9932B"
      strokeWidth="1"
      strokeOpacity="0.5"
    />

    {/* spoke nub at 12 o'clock, a quiet echo of a wheel */}
    <rect x="29.5" y="0.5" width="5" height="7" rx="2" fill="#C9932B" />

    {/* inner disc */}
    <circle cx="32" cy="32" r="23" fill="url(#brandDisc)" />

    {/* chain-link mark: two interlocking links = connection */}
    <g fill="none" strokeLinecap="round">
      <rect
        x="18"
        y="24"
        width="20"
        height="12"
        rx="6"
        stroke="#F9C851"
        strokeWidth="4"
        transform="rotate(-20 28 30)"
      />
      <rect
        x="26"
        y="28"
        width="20"
        height="12"
        rx="6"
        stroke="#FAF6EE"
        strokeWidth="4"
        transform="rotate(-20 36 34)"
      />
    </g>
  </svg>
);
const tabStyles = `
      .rbc-input-label {
        font-size: 12.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #8A7860;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .rbc-tabs .ant-input,
      .rbc-tabs .ant-input-affix-wrapper,
      .rbc-tabs .ant-select-selector,
      .rbc-tabs textarea.ant-input,
      .rbc-tabs .ant-picker {
        border-radius: 10px !important;
        border-color: #E2D8C3 !important;
        background: #FFFFFF !important;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .rbc-tabs .ant-input:hover,
      .rbc-tabs .ant-input-affix-wrapper:hover,
      .rbc-tabs .ant-select-selector:hover {
        border-color: #0E6B4F !important;
      }
      .rbc-tabs .ant-input:focus,
      .rbc-tabs .ant-input-affix-wrapper-focused,
      .rbc-tabs .ant-select-focused .ant-select-selector {
        border-color: #0E6B4F !important;
        box-shadow: 0 0 0 3px rgba(14,107,79,0.12) !important;
      }
      .rbc-tabs .ant-select-selector {
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
      }

      /* ---- Compact inputs, Products & Services entry cards only ---- */
      .rbc-compact-input .ant-input,
      .rbc-compact-input .ant-input-affix-wrapper,
      .rbc-compact-input .ant-select-selector,
      .rbc-compact-input .ant-picker {
        height: 38px !important;
        font-size: 14px !important;
      }
      .rbc-compact-input .ant-select-selector {
        min-height: 38px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      .rbc-compact-input textarea.ant-input {
        height: auto !important;
        min-height: 56px !important;
        font-size: 14px !important;
        padding: 8px 10px !important;
      }
      .rbc-compact-input .rbc-input-label {
        font-size: 11px;
        margin-bottom: 4px;
      }
      .rbc-compact-input .ant-select-selection-item,
      .rbc-compact-input .ant-input {
        line-height: 38px !important;
      }
      .rbc-compact-input .rbc-upload-field .ant-input {
        line-height: normal !important;
      }

      /* ---- Upload field: single seamless pill, no visible inner border/corner ---- */
      .rbc-upload-field {
        overflow: hidden;
        border-radius: 16px !important;
        background: #FFFFFF !important;
      }
      .rbc-upload-field .ant-input,
      .rbc-upload-field .ant-input-affix-wrapper {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        border-radius: 0 !important;
        height: 40px !important;
        line-height: 40px !important;
      }
      .rbc-upload-field .ant-input-affix-wrapper {
        padding: 0 4px !important;
      }
      .rbc-upload-field .ant-input-affix-wrapper:focus,
      .rbc-upload-field .ant-input-affix-wrapper-focused {
        border: none !important;
        box-shadow: none !important;
      }
      .rbc-upload-field .ant-btn {
        flex-shrink: 0;
      }

      .rbc-tabs .ant-tabs-nav::before { border-bottom-color: #EEE4D1; }
      .rbc-tabs .ant-tabs-nav-list { gap: 4px; }
      .rbc-tabs .ant-tabs-tab {
        padding: 14px 20px !important;
        margin: 0 !important;
        border-radius: 12px 12px 0 0 !important;
        transition: background 0.2s ease, color 0.2s ease;
        position: relative;
      }
      .rbc-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn { color: #0E6B4F !important; }
      .rbc-tabs .ant-tabs-tab-active {
        background: linear-gradient(180deg, rgba(14,107,79,0.16) 0%, rgba(14,107,79,0.05) 100%) !important;
        box-shadow: inset 0 -4px 0 #C9932B;
      }
      .rbc-tabs .ant-tabs-tab-active::after {
        content: "";
        position: absolute;
        left: 14px;
        right: 14px;
        bottom: -1px;
        height: 4px;
        border-radius: 4px 4px 0 0;
        background: #C9932B;
      }
      .rbc-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #0A4F3A !important;
      }
      .rbc-tabs .ant-tabs-tab-active .anticon {
        color: #C9932B !important;
      }
      .rbc-tabs .ant-tabs-tab .ant-tabs-tab-btn {
        color: #8A7860;
        font-weight: 700;
        font-size: 16px; 
        display: flex;
        align-items: center;
      }
      .rbc-tabs .ant-tabs-ink-bar { display: none; }

      .rbc-mobile-switcher {
        display: none;
      }

      /* ---- Mobile-only adjustments (45+ age group: bigger text, bigger tap targets) ---- */
      @media (max-width: 640px) {
        /* Scrolling tabs are hard to discover for this age group — replace with
           the always-visible button grid (.rbc-mobile-switcher) below. */
        .rbc-tabs .ant-tabs-nav { display: none; }
        .rbc-tabs .ant-tabs-tab {
          padding: 12px 16px !important;
        }
        .rbc-tabs .ant-tabs-tab .ant-tabs-tab-btn {
          font-size: 15px;
        }
        .rbc-mobile-search .ant-input,
        .rbc-mobile-search .ant-btn {
          font-size: 17px !important;
        }
        .rbc-field-label {
          font-size: 17px !important;
        }
        .ant-form-item-label > label {
          height: auto !important;
          white-space: normal !important;
        }
        .rbc-mobile-switcher {
          display: grid;
        }
        .rbc-navigation-container {
          padding: 4px 8px !important;
          gap: 8px;
        }
        .rbc-navigation-container .ant-btn {
          height: 48px !important;
          font-size: 16px !important;
          flex: 1;
        }
        .rbc-navigation-step-text {
          font-size: 14px !important;
          color: #8A7860 !important;
          min-width: 80px;
          text-align: center;
        }
      }
    `;

const RotaryBusinessConnect: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [member, setMember] = useState<RotaryMemberDetails | null>(null);
  const [isNewMember, setIsNewMember] = useState(false);
  const TAB_KEYS = [
    "personal",
    "contact",
    "business",
    "products",
    "services",
  ] as const;
  const [activeTab, setActiveTab] = useState("personal");

  const handleTabChange = async (targetTab: (typeof TAB_KEYS)[number]) => {
    const currentIdx = TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]);
    const targetIdx = TAB_KEYS.indexOf(targetTab);

    if (targetIdx <= currentIdx) {
      setActiveTab(targetTab);
      return;
    }

    // Going forward:
    // If target is contact (index 1) or beyond, we must validate personal (index 0)
    if (targetIdx >= 1) {
      try {
        const personalFields = FIELD_CONFIG.filter(
          (f) => f.section === "personal",
        ).map((f) => f.key);
        await detailsForm.validateFields(personalFields);
      } catch {
        message.error(
          "Please fill in all required Personal details correctly.",
        );
        setActiveTab("personal");
        return;
      }
    }

    // If target is business (index 2) or beyond, we must validate contact (index 1)
    if (targetIdx >= 2) {
      try {
        const contactFields = FIELD_CONFIG.filter(
          (f) => f.section === "contact",
        ).map((f) => f.key);
        await detailsForm.validateFields(contactFields);
      } catch {
        message.error("Please fill in all required Contact details correctly.");
        setActiveTab("contact");
        return;
      }
    }

    setActiveTab(targetTab);
  };

  const goToPrevTab = () => {
    const idx = TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]);
    if (idx > 0) handleTabChange(TAB_KEYS[idx - 1]);
  };
  const goToNextTab = () => {
    const idx = TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]);
    if (idx < TAB_KEYS.length - 1) handleTabChange(TAB_KEYS[idx + 1]);
  };
  const [memberId, setMemberId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const [detailsForm] = Form.useForm();
  const [products, setProducts] = useState<ProductEntry[]>([emptyProduct()]);
  const [services, setServices] = useState<ServiceEntry[]>([emptyService()]);
  const [productErrors, setProductErrors] = useState<
    Record<string, ProductFieldErrors>
  >({});
  const [serviceErrors, setServiceErrors] = useState<
    Record<string, ServiceFieldErrors>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const ROTARY_ID_REGEX = /^\d{5,9}$/; // adjust length bounds if you know the exact range

  const validateSearchInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Enter a mobile number or Rotary ID";
    const isMobile = MOBILE_REGEX.test(trimmed);
    const isRotaryId = ROTARY_ID_REGEX.test(trimmed);
    if (!isMobile && !isRotaryId)
      return "Enter a valid mobile number or Rotary ID";
    return null;
  };
  const handleSearch = async () => {
    const err = validateSearchInput(mobile);
    setMobileError(err);
    if (err) return;

    setLoading(true);
    setSearched(false);
    try {
      const result = await fetchMemberByMobile(mobile);
      setActiveTab("personal");
      if (result) {
        setMember(result);
        setMemberId(result.id || "");
        setIsNewMember(false);
        setSearched(true);
        detailsForm.resetFields();
        detailsForm.setFieldsValue(result);

        if (result.products && result.products.length > 0) {
          setProducts(
            result.products.map((p) => ({
              id: p.id || uid(),
              name: p.name || "",
              category: p.category || "",
              subCategory: p.subCategory || "",
              brand: p.brand || "",
              variant: p.variant || "",
              color: p.color || "",
              price: p.price != null ? String(p.price) : "",
              priceType: p.priceType || "FIXED",
              mrp: p.mrp != null ? String(p.mrp) : "",
              quantity: p.quantity != null ? String(p.quantity) : "",
              quantityUnit: p.quantityUnit || "",
              stockQuantity:
                p.stockQuantity != null ? String(p.stockQuantity) : "",
              productCondition: p.productCondition || "",
              availability: p.availability || "",
              deliveryTime: p.deliveryTime || "",
              returnAvailable:
                p.returnAvailable != null ? p.returnAvailable : null,
              returnDays: p.returnDays || "",
              warrantyAvailable:
                p.warrantyAvailable != null ? p.warrantyAvailable : null,
              warrantyPeriod: p.warrantyPeriod || "",
              keyFeatures: p.keyFeatures || "",
              description: p.description || "",
              imageUrl: p.imageUrl || "",
              gstNumber: p.gstNumber || "",
              gstDocumentUrl: p.gstDocumentUrl || "",
              paymentModes: p.paymentModes || "",
            })),
          );
        } else {
          setProducts([emptyProduct()]);
        }

        if (result.services && result.services.length > 0) {
          setServices(
            result.services.map((s) => ({
              id: s.id || uid(),
              name: s.name || "",
              category: s.category || "",
              subCategory: s.subCategory || "",
              providerName: s.providerName || "",
              businessName: s.businessName || "",
              serviceMode: s.serviceMode || "",
              serviceLocation: s.serviceLocation || "",
              serviceDuration: s.serviceDuration || "",
              price: s.price != null ? String(s.price) : "",
              priceType: s.priceType || "FIXED",
              availability: s.availability || "",
              bookingRequired:
                s.bookingRequired != null ? s.bookingRequired : null,
              targetCustomers: s.targetCustomers || "",
              cancellationPolicy: s.cancellationPolicy || "",
              refundPolicy: s.refundPolicy || "",
              brochureUrl: s.brochureUrl || "",
              imageUrl: s.imageUrl || "",
              gstNumber: s.gstNumber || "",
              gstDocumentUrl: s.gstDocumentUrl || "",
              paymentModes: s.paymentModes || "",
              keyFeatures: s.keyFeatures || "",
              description: s.description || "",
            })),
          );
        } else {
          setServices([emptyService()]);
        }

        message.success("Rotary Member Details Retrieved Successfully.");
      } else {
        const trimmed = mobile.trim();
        const isMobileInput = MOBILE_REGEX.test(trimmed);
        const blankMember: RotaryMemberDetails = {
          rotary_id: isMobileInput ? "" : trimmed,
          primary_mobile: isMobileInput ? trimmed : "",
        };
        setMember(blankMember);
        setMemberId("");
        setIsNewMember(true);
        setSearched(true);
        detailsForm.resetFields();
        detailsForm.setFieldsValue(blankMember);
        setProducts([emptyProduct()]);
        setServices([emptyService()]);
        message.info(
          "We couldn't find this record. Please fill in your details below and save to get listed.",
        );
      }
    } catch {
      message.error(
        "Something went wrong while fetching details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const missingBySection = useMemo(() => {
    const counts: Record<Section, number> = {
      personal: 0,
      contact: 0,
      business: 0,
    };
    if (!member) return counts;
    FIELD_CONFIG.forEach((f) => {
      const v = member[f.key];
      if (!v || String(v).trim() === "") counts[f.section] += 1;
    });
    return counts;
  }, [member]);

  const missingCount =
    missingBySection.personal +
    missingBySection.contact +
    missingBySection.business;

  /* ---------- Products ---------- */
  const addProduct = () => setProducts((p) => [...p, emptyProduct()]);
  const removeProduct = (id: string) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    setProductErrors((e) => {
      const { [id]: _, ...rest } = e;
      return rest;
    });
  };
  const updateProduct = (
    id: string,
    field: keyof Omit<ProductEntry, "id">,
    value: any,
  ) => {
    setProducts((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );
    if (submitAttempted && (field === "name" || field === "category")) {
      setProductErrors((e) => ({
        ...e,
        [id]: {
          ...e[id],
          [field]: String(value || "").trim()
            ? ""
            : `${field === "name" ? "Product name" : "Category"} is required`,
        },
      }));
    }
  };

  /* ---------- Services ---------- */
  const addService = () => setServices((s) => [...s, emptyService()]);
  const removeService = (id: string) => {
    setServices((s) => s.filter((x) => x.id !== id));
    setServiceErrors((e) => {
      const { [id]: _, ...rest } = e;
      return rest;
    });
  };
  const updateService = (
    id: string,
    field: keyof Omit<ServiceEntry, "id">,
    value: any,
  ) => {
    setServices((s) =>
      s.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );
    if (submitAttempted && (field === "name" || field === "category")) {
      setServiceErrors((e) => ({
        ...e,
        [id]: {
          ...e[id],
          [field]: String(value || "").trim()
            ? ""
            : `${field === "name" ? "Service name" : "Category"} is required`,
        },
      }));
    }
  };

  const isProductFilled = (p: ProductEntry): boolean => {
    return Boolean(
      p.name.trim() ||
      p.category.trim() ||
      p.subCategory.trim() ||
      p.brand.trim() ||
      p.variant.trim() ||
      p.color.trim() ||
      p.price.trim() ||
      p.mrp.trim() ||
      p.quantity.trim() ||
      p.quantityUnit.trim() ||
      p.stockQuantity.trim() ||
      p.productCondition ||
      p.availability.trim() ||
      p.deliveryTime.trim() ||
      p.returnAvailable !== null ||
      p.warrantyAvailable !== null ||
      p.keyFeatures.trim() ||
      p.description.trim() ||
      p.imageUrl.trim() ||
      p.gstNumber.trim() ||
      p.gstDocumentUrl.trim() ||
      p.paymentModes.trim(),
    );
  };

  const isServiceFilled = (s: ServiceEntry): boolean => {
    return Boolean(
      s.name.trim() ||
      s.category.trim() ||
      s.subCategory.trim() ||
      s.providerName.trim() ||
      s.businessName.trim() ||
      s.serviceMode ||
      s.serviceLocation.trim() ||
      s.serviceDuration.trim() ||
      s.price.trim() ||
      (s.priceType && s.priceType !== "FIXED") ||
      s.availability.trim() ||
      s.bookingRequired !== null ||
      s.targetCustomers.trim() ||
      s.cancellationPolicy.trim() ||
      s.refundPolicy.trim() ||
      s.brochureUrl.trim() ||
      s.imageUrl.trim() ||
      s.gstNumber.trim() ||
      s.gstDocumentUrl.trim() ||
      s.paymentModes.trim() ||
      s.keyFeatures.trim() ||
      s.description.trim(),
    );
  };

  const buildDetailsPayload = (details: RotaryMemberDetails) => {
    const city = String(details.location || "").trim();
    const state = String(details.state || "").trim();
    const anniversaryRaw = String(details.anniversary || "").trim();
    const anniversaryDate = anniversaryRaw ? new Date(anniversaryRaw) : null;
    const anniversary =
      anniversaryDate && !isNaN(anniversaryDate.getTime())
        ? anniversaryDate.toISOString()
        : anniversaryRaw;

    return {
      id: memberId,
      rotaryId: details.rotary_id || "",
      name: details.name || "",
      clubName: details.club || "",
      districtId: details.district ? parseInt(details.district, 10) || 0 : 0,
      city,
      state,
      address: details.business_address || "",
      classification: details.classification || "",
      bloodGroup: details.blood_group || "",
      anniversary,
      emails: details.email || "",
      mobileNumbers: details.primary_mobile || "",
      secondaryMobile: details.secondary_mobile || "",
      businessName: details.business_name || "",
      businessEmail: details.business_email || "",
      businessPhone: details.business_phone || "",
      businessAddress: details.business_address || "",
      gstNumber: details.gst_number || "",
      gstDocumentUrl: details.gst_document_url || "",
    };
  };

  const saveMemberDetails = async (
    details: RotaryMemberDetails,
  ): Promise<string> => {
    const res = await fetch(
      `${BASE_URL}/marketing-service/campgin/rotary-data-update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(buildDetailsPayload(details)),
      },
    );
    if (!res.ok) throw new Error(`Details update failed (${res.status})`);
    const json = await res.json();
    let returnedId = "";
    if (json) {
      if (json.data) {
        if (Array.isArray(json.data) && json.data.length > 0) {
          returnedId = json.data[0].id || "";
        } else if (typeof json.data === "object") {
          returnedId = json.data.id || "";
        }
      }
      if (!returnedId && json.id) {
        returnedId = json.id;
      }
    }
    return returnedId;
  };

  const saveProductOrService = async (
    entry: ProductEntry | ServiceEntry,
    type: "PRODUCT" | "SERVICE",
    targetMemberId: string,
  ) => {
    const now = new Date().toISOString();
    const payload: any = {
      id: isUUID(entry.id) ? entry.id : null,
      memberId: targetMemberId,
      membersType: type,
      name: entry.name.trim(),
      category: entry.category.trim(),
      subCategory: entry.subCategory ? entry.subCategory.trim() : null,
      description: entry.description ? entry.description.trim() : null,
      keyFeatures: entry.keyFeatures ? entry.keyFeatures.trim() : null,
      price:
        entry.price !== "" && !isNaN(Number(entry.price))
          ? Number(entry.price)
          : null,
      availability: entry.availability ? entry.availability.trim() : null,
      imageUrl: entry.imageUrl ? entry.imageUrl.trim() : null,
      gstNumber:
        (
          entry.gstNumber ||
          detailsForm.getFieldValue("gst_number") ||
          member?.gst_number ||
          ""
        ).trim() || null,
      gstDocumentUrl:
        (
          entry.gstDocumentUrl ||
          detailsForm.getFieldValue("gst_document_url") ||
          member?.gst_document_url ||
          ""
        ).trim() || null,
      paymentModes: "",
      createdAt: now,
      updatedAt: now,
    };

    if (type === "PRODUCT") {
      const p = entry as ProductEntry;
      payload.color = p.color ? p.color.trim() : null;
      payload.brand = p.brand ? p.brand.trim() : null;
      payload.quantity =
        p.quantity !== "" && !isNaN(Number(p.quantity))
          ? Number(p.quantity)
          : null;
      payload.quantityUnit = p.quantityUnit ? p.quantityUnit.trim() : null;
      payload.variant = p.variant ? p.variant.trim() : null;
      payload.mrp =
        p.mrp !== "" && !isNaN(Number(p.mrp)) ? Number(p.mrp) : null;
      payload.stockQuantity =
        p.stockQuantity !== "" && !isNaN(Number(p.stockQuantity))
          ? parseInt(p.stockQuantity, 10)
          : null;
      payload.productCondition = p.productCondition || null;
      payload.returnAvailable =
        p.returnAvailable !== null ? p.returnAvailable : null;
      payload.returnDays =
        p.returnAvailable && p.returnDays
          ? parseInt(String(p.returnDays).replace(/\D/g, ""), 10) || null
          : null;
      payload.warrantyAvailable =
        p.warrantyAvailable !== null ? p.warrantyAvailable : null;
      payload.warrantyPeriod = p.warrantyPeriod
        ? p.warrantyPeriod.trim()
        : null;
      payload.deliveryTime = p.deliveryTime ? p.deliveryTime.trim() : null;
      payload.priceType = p.priceType || "FIXED";
    } else {
      const s = entry as ServiceEntry;
      payload.color = null;
      payload.providerName = s.providerName ? s.providerName.trim() : null;
      payload.businessName = s.businessName ? s.businessName.trim() : null;
      payload.serviceMode = s.serviceMode || null;
      payload.serviceLocation = s.serviceLocation
        ? s.serviceLocation.trim()
        : null;
      payload.serviceDuration = s.serviceDuration
        ? s.serviceDuration.trim()
        : null;
      payload.priceType = s.priceType || "FIXED";
      payload.bookingRequired =
        s.bookingRequired !== null ? s.bookingRequired : null;
      payload.targetCustomers = s.targetCustomers
        ? s.targetCustomers.trim()
        : null;
      payload.cancellationPolicy = s.cancellationPolicy
        ? s.cancellationPolicy.trim()
        : null;
      payload.refundPolicy = s.refundPolicy ? s.refundPolicy.trim() : null;
      payload.brochureUrl = s.brochureUrl ? s.brochureUrl.trim() : null;
    }

    const res = await fetch(
      `${BASE_URL}/marketing-service/campgin/save-update-member-products-services`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(
        `${type === "PRODUCT" ? "Product" : "Service"} save failed (${res.status}): ${errText}`,
      );
    }
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    const newProductErrors: Record<string, ProductFieldErrors> = {};
    products.forEach((p) => {
      if (isProductFilled(p)) {
        const errs: ProductFieldErrors = {};
        if (!p.name.trim()) errs.name = "Product name is required";
        if (!p.category.trim()) errs.category = "Category is required";
        if (Object.keys(errs).length) newProductErrors[p.id] = errs;
      }
    });

    const newServiceErrors: Record<string, ServiceFieldErrors> = {};
    services.forEach((s) => {
      if (isServiceFilled(s)) {
        const errs: ServiceFieldErrors = {};
        if (!s.name.trim()) errs.name = "Service name is required";
        if (!s.category.trim()) errs.category = "Category is required";
        if (Object.keys(errs).length) newServiceErrors[s.id] = errs;
      }
    });

    setProductErrors(newProductErrors);
    setServiceErrors(newServiceErrors);

    try {
      const values = await detailsForm.validateFields();

      if (
        Object.keys(newProductErrors).length ||
        Object.keys(newServiceErrors).length
      ) {
        message.error(
          "Please fix the highlighted product/service fields before submitting.",
        );
        setActiveTab(
          Object.keys(newProductErrors).length ? "products" : "services",
        );
        return;
      }

      const finalDetails: RotaryMemberDetails = { ...member, ...values };

      // Only hit each API when that section actually has data to save.
      const detailsChanged = true;
      const filledProducts = products.filter(
        (p) => isProductFilled(p) && p.name.trim() && p.category.trim(),
      );
      const filledServices = services.filter(
        (s) => isServiceFilled(s) && s.name.trim() && s.category.trim(),
      );
      const productsServicesChanged =
        filledProducts.length > 0 || filledServices.length > 0;

      if (!detailsChanged && !productsServicesChanged) {
        message.info("No changes to save.");
        return;
      }

      setSaving(true);

      let activeMemberId = memberId;

      // 1. Save member details first if changed
      if (detailsChanged) {
        const returnedId = await saveMemberDetails(finalDetails);
        if (returnedId) {
          activeMemberId = returnedId;
          setMemberId(returnedId);
        }
      }

      // 2. Save products and services using activeMemberId
      if (productsServicesChanged) {
        const prodCalls = filledProducts.map((p) =>
          saveProductOrService(p, "PRODUCT", activeMemberId),
        );
        const servCalls = filledServices.map((s) =>
          saveProductOrService(s, "SERVICE", activeMemberId),
        );
        await Promise.all([...prodCalls, ...servCalls]);
      }

      const finalMember: RotaryMemberDetails = {
        ...finalDetails,
        id: activeMemberId,
      };
      setMember(finalMember);
      setIsNewMember(false);
      message.success("Details submitted successfully.");
    } catch (e: any) {
      if (e.errorFields && e.errorFields.length > 0) {
        const firstFailedField = e.errorFields[0].name[0];
        const fieldDef = FIELD_CONFIG.find((f) => f.key === firstFailedField);
        if (fieldDef) {
          setActiveTab(fieldDef.section);
        }
        message.error(
          "Please fill all required fields correctly before submitting.",
        );
      } else {
        message.error(
          e instanceof Error && e.message.includes("failed")
            ? "Something went wrong while saving. Please try again."
            : "Please fill all required fields correctly before submitting.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: FieldDef) => {
    const value = member?.[field.key];
    const isMissing = !value || String(value).trim() === "";
    const isLocked = !isNewMember && !!field.lockedForExisting;
    const isDisabled = isLocked || !isMissing;
    const showAsterisk = !!field.essential;
    const isRequired = isNewMember && !!field.essential;
    return (
      <Col xs={24} sm={12} key={field.key}>
        <Form.Item
          name={field.key}
          label={
            <span className="rbc-field-label text-[#3A2F23] text-[16px] font-semibold inline-flex items-center">
              {field.label}{" "}
              {showAsterisk && <span style={{ color: "#ff4d4f" }}>*</span>}
              {field.type === "autocomplete" && <SuggestionHint />}
            </span>
          }
          rules={getRulesForField(field.type, isRequired, field.label)}
          validateTrigger={["onChange", "onBlur"]}
        >
          {isDisabled ? (
            <Input
              disabled
              className="!text-[#3A2F23] !bg-[#EAF3EE] !border-[#BFE0CD] disabled:!text-[#3A2F23]"
            />
          ) : field.type === "autocomplete" ? (
            <AutoComplete
              options={(field.options || []).map((v) => ({ value: v }))}
              filterOption={(input, option) =>
                (option?.value as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder={field.placeholder}
            >
              <Input />
            </AutoComplete>
          ) : (
            <Input placeholder={field.placeholder} />
          )}
        </Form.Item>
      </Col>
    );
  };

  const tabLabel = (label: string) => <span>{label}</span>;

  return (
    <ConfigProvider theme={theme}>
      <style>{tabStyles}</style>
      <div
        className="min-h-screen pt-4 pb-8 px-4"
        style={{
          background:
            "radial-gradient(circle at 12% 8%, rgba(14,107,79,0.10), transparent 40%), radial-gradient(circle at 90% 15%, rgba(201,147,43,0.14), transparent 45%), #FAF6EE",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header — logo and title side by side */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 text-center sm:text-left">
            <BrandMark size={56} />
            <div className="text-center sm:text-left">
              <Title
                level={2}
                className="!mb-0 !leading-tight !text-[#20180F] !text-[24px] sm:!text-[30px]"
                style={{ ...serif, letterSpacing: "-0.01em" }}
              >
                Rotary Members Look-Up
              </Title>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/70" />
                <Text className="!text-amber-700 tracking-[0.2em] text-xs uppercase font-semibold">
                  Rotary Districts
                </Text>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/70" />
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <Card
            className="mb-6 rounded-2xl border-0"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 16px 35px -18px rgba(32,24,15,0.25)",
            }}
          >
            <Text
              strong
              className="block mb-2 text-[#2A2118] text-[16px] sm:text-[15px]"
            >
              Search by Mobile Number or Rotary ID
            </Text>
            <div className="rbc-mobile-search flex flex-col sm:flex-row gap-3 w-full">
              <div className="sm:flex-1">
                <Input
                  size="large"
                  placeholder="Enter mobile number or Rotary ID"
                  value={mobile}
                  status={mobileError ? "error" : ""}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (mobileError) setMobileError(null);
                  }}
                  onPressEnter={handleSearch}
                  maxLength={15}
                  style={{ height: 48 }}
                />
              </div>
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                loading={loading}
                onClick={handleSearch}
                block
                className="sm:!w-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #0E6B4F 0%, #0A4F3A 100%)",
                  border: "none",
                  height: 48,
                }}
              >
                Search
              </Button>
            </div>
            {mobileError && (
              <Text type="danger" className="block mt-2 text-xs">
                {mobileError}
              </Text>
            )}
          </Card>

          {/* WHY banner */}
          {!searched && (
            <Card
              className="mb-6 rounded-2xl border-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0E6B4F 0%, #0A4F3A 100%)",
                boxShadow: "0 18px 40px -18px rgba(14,107,79,0.55)",
              }}
            >
              <Space
                align="start"
                size={14}
                direction="vertical"
                style={{ width: "100%" }}
              >
                <Space align="center" size={8}>
                  <BulbFilled className="text-amber-300 text-xl" />
                  <Text strong className="!text-amber-300 text-[18px]">
                    Why are we collecting this information?
                  </Text>
                </Space>
                <div className="text-emerald-50 text-[14px] leading-relaxed">
                  <p className="mb-2">
                    We encourage Rotary members to make the{" "}
                    <strong>
                      Rotary family their first choice for help, products, and
                      services:
                    </strong>
                  </p>
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: "20px",
                      margin: "0 0 14px 0",
                    }}
                  >
                    <li style={{ marginBottom: "6px" }}>
                      Ensure every member's latest profession, products, and
                      services are up to date.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Quickly find and connect with Rotary professionals nearby
                      — such as doctors, lawyers, and other service providers.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Help members discover special offers, support each other's
                      businesses, and grow business within the Rotary family.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Registration is sponsored by <strong>AskOxy.ai</strong>,
                      at no cost to Rotary members.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      As per the member's wish, a portion of eligible
                      fees/transactions between Rotary members may be
                      contributed to the <strong>Rotary Foundation</strong>.
                    </li>
                  </ul>

                  <p className="text-[13px] text-emerald-100 mt-3 mb-2 leading-relaxed">
                    <strong className="text-amber-300">
                      Payment Modes & Escrow Mechanism:
                    </strong>{" "}
                    Payments currently happen directly between the
                    product/service provider and the consumer, with the platform
                    serving to promote and showcase your offerings across the
                    Rotary network. We're also building an{" "}
                    <strong>Escrow Payment Mechanism</strong> for an upcoming
                    phase, giving every business member a dedicated virtual
                    escrow account for seamless in-platform payments with
                    end-to-end buyer protection and verified fund release upon
                    delivery.
                  </p>

                  <p className="font-semibold text-amber-200 mt-2 mb-0">
                    Avail special offers, support fellow Rotary members, and
                    grow your business within the Rotary family!
                  </p>
                </div>
              </Space>
            </Card>
          )}

          {searched && isNewMember && member && (
            <Alert
              className="mb-6 rounded-2xl"
              type="warning"
              showIcon
              icon={<ExclamationCircleFilled />}
              message="No matching record found"
              description="We couldn't find this mobile number or Rotary ID in our records. Please fill in your details below to help us know more about you."
            />
          )}
          {member && (
            <Form form={detailsForm} layout="vertical" requiredMark={false}>
              <Card
                className="mb-4 rounded-2xl border-0"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 16px 35px -18px rgba(32,24,15,0.25)",
                }}
                styles={{ body: { paddingTop: 8 } }}
              >
                {/* Mobile-only: always-visible tab switcher (no side-scrolling to discover) */}
                <div className="rbc-mobile-switcher grid-cols-3 gap-1.5 mb-4">
                  {(
                    [
                      {
                        key: "personal",
                        label: "Personal",
                        icon: <IdcardOutlined />,
                      },
                      {
                        key: "contact",
                        label: "Contact",
                        icon: <PhoneOutlined />,
                      },
                      {
                        key: "business",
                        label: "Business",
                        icon: <BankOutlined />,
                      },
                      {
                        key: "products",
                        label: "Products",
                        icon: <ShopOutlined />,
                      },
                      {
                        key: "services",
                        label: "Services",
                        icon: <ToolOutlined />,
                      },
                    ] as const
                  ).map((t) => {
                    const isActive = activeTab === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => handleTabChange(t.key)}
                        className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 px-1 text-[12px] font-semibold leading-tight"
                        style={{
                          background: isActive
                            ? "linear-gradient(180deg, rgba(14,107,79,0.18) 0%, rgba(14,107,79,0.06) 100%)"
                            : "#F7F2E3",
                          border: isActive
                            ? "1.5px solid #0E6B4F"
                            : "1px solid #EEE4D1",
                          color: isActive ? "#0A4F3A" : "#8A7860",
                        }}
                      >
                        <span style={{ fontSize: 15, lineHeight: 1 }}>
                          {t.icon}
                        </span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <Tabs
                  className="rbc-tabs"
                  size="large"
                  activeKey={activeTab}
                  onChange={(key) =>
                    handleTabChange(key as (typeof TAB_KEYS)[number])
                  }
                  items={[
                    {
                      key: "personal",
                      label: tabLabel("Personal"),
                      icon: <IdcardOutlined />,
                      children: (
                        <Row gutter={[16, { xs: 18, sm: 4 }]}>
                          {FIELD_CONFIG.filter(
                            (f) => f.section === "personal",
                          ).map(renderField)}
                        </Row>
                      ),
                    },
                    {
                      key: "contact",
                      label: tabLabel("Contact"),
                      icon: <PhoneOutlined />,
                      children: (
                        <Row gutter={[16, { xs: 18, sm: 4 }]}>
                          {FIELD_CONFIG.filter(
                            (f) => f.section === "contact",
                          ).map(renderField)}
                        </Row>
                      ),
                    },
                    {
                      key: "business",
                      label: tabLabel("Business"),
                      icon: <BankOutlined />,
                      children: (
                        <Row gutter={[16, { xs: 18, sm: 4 }]}>
                          {FIELD_CONFIG.filter(
                            (f) => f.section === "business",
                          ).map(renderField)}
                          <Col xs={24} sm={12} className="!mb-6">
                            <Form.Item>
                              <CompactUploadField
                                label="GST Certificate"
                                value={
                                  detailsForm.getFieldValue(
                                    "gst_document_url",
                                  ) ||
                                  member?.gst_document_url ||
                                  ""
                                }
                                onChange={(url) => {
                                  detailsForm.setFieldsValue({
                                    gst_document_url: url,
                                  });
                                  setMember((prev) =>
                                    prev
                                      ? { ...prev, gst_document_url: url }
                                      : prev,
                                  );
                                }}
                                userId={memberId || member?.id || ""}
                                isImage={false}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      key: "products",
                      label: tabLabel("Products"),
                      icon: <ShopOutlined />,
                      children: (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Text className="text-[15px] text-[#5A4D3D]">
                              Add the products this member sells. Fields marked
                              with <span style={{ color: "#ff4d4f" }}>*</span>{" "}
                              are mandatory.
                            </Text>
                            <Button
                              type="link"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={addProduct}
                              style={{ color: "#0E6B4F", fontWeight: 600 }}
                            >
                              Add Product
                            </Button>
                          </div>

                          <Space
                            direction="vertical"
                            className="w-full"
                            size={16}
                          >
                            {products.map((p, idx) => {
                              const errs = productErrors[p.id] || {};
                              return (
                                <div
                                  key={p.id}
                                  className="rounded-xl p-4 sm:p-5 relative rbc-compact-input"
                                  style={{
                                    background: "#FBF8F2",
                                    border: "1px solid #EEE4D1",
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEE4D1]">
                                    <Text
                                      strong
                                      className="text-[17px] text-[#0A4F3A]"
                                    >
                                      Product {idx + 1}
                                    </Text>
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<CloseOutlined />}
                                      onClick={() => removeProduct(p.id)}
                                      disabled={products.length === 1}
                                      danger
                                    >
                                      Remove
                                    </Button>
                                  </div>

                                  {/* Section 1: Basic Info */}
                                  <SectionHeading accent="#0E6B4F">
                                    Basic Information
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel
                                        label="Product Name"
                                        required
                                      />
                                      <Input
                                        placeholder="e.g. Organic Herbal Shampoo, Steel Wire 5mm"
                                        value={p.name}
                                        status={errs.name ? "error" : ""}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "name",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      {errs.name && (
                                        <Text
                                          type="danger"
                                          className="text-[13px] block mt-0.5"
                                        >
                                          {errs.name}
                                        </Text>
                                      )}
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel
                                        label="Category"
                                        required
                                        hint
                                      />
                                      <AutoComplete
                                        className="w-full"
                                        options={PRODUCT_CATEGORY_OPTIONS}
                                        value={p.category}
                                        filterOption={(input, option) =>
                                          (option?.value as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        onChange={(val) =>
                                          updateProduct(p.id, "category", val)
                                        }
                                        placeholder="Select or type category (e.g. Healthcare, Textiles)"
                                      >
                                        <Input
                                          status={errs.category ? "error" : ""}
                                        />
                                      </AutoComplete>
                                      {errs.category && (
                                        <Text
                                          type="danger"
                                          className="text-[13px] block mt-0.5"
                                        >
                                          {errs.category}
                                        </Text>
                                      )}
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Sub-Category" />
                                      <Input
                                        placeholder="e.g. Hair Care, Cotton Wear, Construction Material"
                                        value={p.subCategory}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "subCategory",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Brand / Manufacturer" />
                                      <Input
                                        placeholder="e.g. OxyCare, Dabur, Tata Steel, Samsung"
                                        value={p.brand}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "brand",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  {/* Section 2: Pricing, Stock & Specifications */}
                                  <SectionHeading accent="#0E6B4F">
                                    Pricing, Stock & Specifications
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24} sm={6}>
                                      <FieldLabel label="Selling Price (₹)" />
                                      <Input
                                        placeholder="e.g. 499"
                                        value={p.price}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "price",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    {/* <Col xs={24} sm={6}>
                                      <FieldLabel label="Price Type" required />
                                      <Select
                                        className="w-full"
                                        value={p.priceType || "FIXED"}
                                        options={PRICE_TYPE_OPTIONS}
                                        onChange={(val) =>
                                          updateProduct(
                                            p.id,
                                            "priceType",
                                            val || "FIXED",
                                          )
                                        }
                                      />
                                    </Col> */}
                                    <Col xs={24} sm={6}>
                                      <FieldLabel label="MRP (₹)" />
                                      <Input
                                        placeholder="e.g. 699"
                                        value={p.mrp}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "mrp",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={6}>
                                      <FieldLabel
                                        label="Availability"
                                        required
                                        hint
                                      />
                                      <AutoComplete
                                        className="w-full"
                                        options={AVAILABILITY_OPTIONS}
                                        value={p.availability}
                                        filterOption={(input, option) =>
                                          (option?.value as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        onChange={(val) =>
                                          updateProduct(
                                            p.id,
                                            "availability",
                                            val,
                                          )
                                        }
                                        placeholder="e.g. In Stock, Made to Order"
                                      >
                                        <Input />
                                      </AutoComplete>
                                    </Col>

                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Pack Quantity" />
                                      <Input
                                        placeholder="e.g. 500, 1, 10"
                                        value={p.quantity}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "quantity",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Quantity Unit" hint />
                                      <AutoComplete
                                        className="w-full"
                                        options={QUANTITY_UNIT_OPTIONS}
                                        value={p.quantityUnit}
                                        filterOption={(input, option) =>
                                          (option?.value as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        onChange={(val) =>
                                          updateProduct(
                                            p.id,
                                            "quantityUnit",
                                            val,
                                          )
                                        }
                                        placeholder="e.g. ml, pcs, kg"
                                      >
                                        <Input />
                                      </AutoComplete>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Available Stock Quantity" />
                                      <Input
                                        placeholder="e.g. 50"
                                        value={p.stockQuantity}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "stockQuantity",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>

                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Variant / Model / Size" />
                                      <Input
                                        placeholder="e.g. 500ml Bottle, Pack of 2, XL"
                                        value={p.variant}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "variant",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Color / Shade" />
                                      <Input
                                        placeholder="e.g. Matte Black, Navy Blue, Silver"
                                        value={p.color}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "color",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Product Condition" />
                                      <Select
                                        className="w-full"
                                        allowClear
                                        placeholder="Select condition"
                                        value={p.productCondition || undefined}
                                        options={PRODUCT_CONDITION_OPTIONS}
                                        onChange={(val) =>
                                          updateProduct(
                                            p.id,
                                            "productCondition",
                                            val || "",
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  {/* Section 3: Delivery, Policies & Media */}
                                  <SectionHeading accent="#0E6B4F">
                                    Delivery, Policies & Media
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Delivery Time" />
                                      <Input
                                        placeholder="e.g. 1-2 business days, Same day"
                                        value={p.deliveryTime}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "deliveryTime",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Return Available?" />
                                      <Select
                                        className="w-full"
                                        allowClear
                                        placeholder="Select return policy"
                                        value={
                                          p.returnAvailable === null
                                            ? undefined
                                            : p.returnAvailable
                                              ? "true"
                                              : "false"
                                        }
                                        options={[
                                          {
                                            value: "true",
                                            label: "Yes (Returnable)",
                                          },
                                          {
                                            value: "false",
                                            label: "No (Non-returnable)",
                                          },
                                        ]}
                                        onChange={(val) => {
                                          const isAvail =
                                            val === "true"
                                              ? true
                                              : val === "false"
                                                ? false
                                                : null;
                                          updateProduct(
                                            p.id,
                                            "returnAvailable",
                                            isAvail,
                                          );
                                          if (!isAvail) {
                                            updateProduct(
                                              p.id,
                                              "returnDays",
                                              "",
                                            );
                                          }
                                        }}
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Warranty Available?" />
                                      <Select
                                        className="w-full"
                                        allowClear
                                        placeholder="Select warranty status"
                                        value={
                                          p.warrantyAvailable === null
                                            ? undefined
                                            : p.warrantyAvailable
                                              ? "true"
                                              : "false"
                                        }
                                        options={[
                                          {
                                            value: "true",
                                            label: "Yes (Warranty included)",
                                          },
                                          {
                                            value: "false",
                                            label: "No (No warranty)",
                                          },
                                        ]}
                                        onChange={(val) => {
                                          const isAvail =
                                            val === "true"
                                              ? true
                                              : val === "false"
                                                ? false
                                                : null;
                                          updateProduct(
                                            p.id,
                                            "warrantyAvailable",
                                            isAvail,
                                          );
                                          if (!isAvail) {
                                            updateProduct(
                                              p.id,
                                              "warrantyPeriod",
                                              "",
                                            );
                                          }
                                        }}
                                      />
                                    </Col>

                                    {/* Conditional Return & Warranty Period Inputs */}
                                    {p.returnAvailable && (
                                      <Col
                                        xs={24}
                                        sm={p.warrantyAvailable ? 12 : 24}
                                      >
                                        <FieldLabel
                                          label="Return Window (Days)"
                                          hint
                                        />
                                        <AutoComplete
                                          className="w-full"
                                          options={[
                                            { value: "7" },
                                            { value: "10" },
                                            { value: "15" },
                                            { value: "30" },
                                          ]}
                                          value={p.returnDays || ""}
                                          onChange={(val) =>
                                            updateProduct(
                                              p.id,
                                              "returnDays",
                                              val,
                                            )
                                          }
                                          placeholder="Enter number of days (e.g. 7, 10, 30)"
                                        >
                                          <Input />
                                        </AutoComplete>
                                      </Col>
                                    )}

                                    {p.warrantyAvailable && (
                                      <Col
                                        xs={24}
                                        sm={p.returnAvailable ? 12 : 24}
                                      >
                                        <FieldLabel
                                          label="Warranty Period (Days / Months / Years)"
                                          hint
                                        />
                                        <AutoComplete
                                          className="w-full"
                                          options={[
                                            { value: "6 Months" },
                                            { value: "1 Year" },
                                            { value: "2 Years" },
                                            { value: "3 Years" },
                                            { value: "5 Years" },
                                            { value: "Lifetime Warranty" },
                                          ]}
                                          value={p.warrantyPeriod || ""}
                                          onChange={(val) =>
                                            updateProduct(
                                              p.id,
                                              "warrantyPeriod",
                                              val,
                                            )
                                          }
                                          placeholder="e.g. 1 Year, 2 Years, 6 Months"
                                        >
                                          <Input />
                                        </AutoComplete>
                                      </Col>
                                    )}

                                    <Col xs={24}>
                                      <CompactUploadField
                                        label="Product Image"
                                        value={p.imageUrl}
                                        onChange={(url) =>
                                          updateProduct(p.id, "imageUrl", url)
                                        }
                                        userId={memberId || member?.id || ""}
                                        isImage={true}
                                      />
                                    </Col>
                                  </Row>

                                  {/* Section 4: Features & Description */}
                                  <SectionHeading accent="#0E6B4F">
                                    Features & Description
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24}>
                                      <FieldLabel label="Key Features / Highlights" />
                                      <Input.TextArea
                                        placeholder="e.g. • 100% natural ingredients • 2-year warranty • ISO certified"
                                        value={p.keyFeatures}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "keyFeatures",
                                            e.target.value,
                                          )
                                        }
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                      />
                                    </Col>
                                    <Col xs={24}>
                                      <FieldLabel label="Detailed Description" />
                                      <Input.TextArea
                                        placeholder="Brief specifications and details a fellow Rotary member should know..."
                                        value={p.description}
                                        onChange={(e) =>
                                          updateProduct(
                                            p.id,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                        autoSize={{ minRows: 2, maxRows: 5 }}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </Space>
                        </div>
                      ),
                    },
                    {
                      key: "services",
                      label: tabLabel("Services"),
                      icon: <ToolOutlined />,
                      children: (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Text className="text-[15px] text-[#5A4D3D]">
                              Add the services this member offers. Fields marked
                              with <span style={{ color: "#ff4d4f" }}>*</span>{" "}
                              are mandatory.
                            </Text>
                            <Button
                              type="link"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={addService}
                              style={{ color: "#A06C1E", fontWeight: 600 }}
                            >
                              Add Service
                            </Button>
                          </div>

                          <Space
                            direction="vertical"
                            className="w-full"
                            size={16}
                          >
                            {services.map((s, idx) => {
                              const errs = serviceErrors[s.id] || {};
                              return (
                                <div
                                  key={s.id}
                                  className="rounded-xl p-4 sm:p-5 relative rbc-compact-input"
                                  style={{
                                    background: "#FBF8F2",
                                    border: "1px solid #EEE4D1",
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEE4D1]">
                                    <Text
                                      strong
                                      className="text-[17px] text-[#784A12]"
                                    >
                                      Service {idx + 1}
                                    </Text>
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<CloseOutlined />}
                                      onClick={() => removeService(s.id)}
                                      disabled={services.length === 1}
                                      danger
                                    >
                                      Remove
                                    </Button>
                                  </div>

                                  {/* Section 1: Basic Info */}
                                  <SectionHeading accent="#A06C1E">
                                    Basic Information
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel
                                        label="Service Name"
                                        required
                                      />
                                      <Input
                                        placeholder="e.g. Legal Advisory & Trademark Registration, Dental Consultation"
                                        value={s.name}
                                        status={errs.name ? "error" : ""}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "name",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      {errs.name && (
                                        <Text
                                          type="danger"
                                          className="text-[13px] block mt-0.5"
                                        >
                                          {errs.name}
                                        </Text>
                                      )}
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel
                                        label="Category"
                                        required
                                        hint
                                      />
                                      <AutoComplete
                                        className="w-full"
                                        options={SERVICE_CATEGORY_OPTIONS}
                                        value={s.category}
                                        filterOption={(input, option) =>
                                          (option?.value as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        onChange={(val) =>
                                          updateService(s.id, "category", val)
                                        }
                                        placeholder="Select or type category (e.g. Legal Services, Healthcare)"
                                      >
                                        <Input
                                          status={errs.category ? "error" : ""}
                                        />
                                      </AutoComplete>
                                      {errs.category && (
                                        <Text
                                          type="danger"
                                          className="text-[13px] block mt-0.5"
                                        >
                                          {errs.category}
                                        </Text>
                                      )}
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Sub-Category" />
                                      <Input
                                        placeholder="e.g. Corporate Law, Cardiology, Tax Audit, Web Development"
                                        value={s.subCategory}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "subCategory",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Specialist / Provider Name" />
                                      <Input
                                        placeholder="e.g. Dr. Rajesh Kumar, Adv. M. Sharma"
                                        value={s.providerName}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "providerName",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Business / Clinic / Firm Name" />
                                      <Input
                                        placeholder="e.g. Sharma & Associates Law Firm, Apollo Diagnostics"
                                        value={s.businessName}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "businessName",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <FieldLabel label="Target Customers / Audience" />
                                      <Input
                                        placeholder="e.g. Startups, SMEs, Individuals, Corporates"
                                        value={s.targetCustomers}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "targetCustomers",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  {/* Section 2: Fee, Mode & Delivery */}
                                  <SectionHeading accent="#A06C1E">
                                    Fee, Mode & Delivery
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Price / Fee (₹)" />
                                      <Input
                                        placeholder="e.g. 1500, 5000"
                                        value={s.price}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "price",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel
                                        label="Pricing Model"
                                        required
                                      />
                                      <Select
                                        className="w-full"
                                        value={s.priceType || "FIXED"}
                                        options={PRICE_TYPE_OPTIONS}
                                        onChange={(val) =>
                                          updateService(
                                            s.id,
                                            "priceType",
                                            val || "FIXED",
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Availability" hint />
                                      <AutoComplete
                                        className="w-full"
                                        options={AVAILABILITY_OPTIONS}
                                        value={s.availability}
                                        filterOption={(input, option) =>
                                          (option?.value as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        onChange={(val) =>
                                          updateService(
                                            s.id,
                                            "availability",
                                            val,
                                          )
                                        }
                                        placeholder="e.g. By Appointment Only, Mon-Sat"
                                      >
                                        <Input />
                                      </AutoComplete>
                                    </Col>

                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Service Mode" />
                                      <Select
                                        className="w-full"
                                        allowClear
                                        placeholder="Select mode"
                                        value={s.serviceMode || undefined}
                                        options={SERVICE_MODE_OPTIONS}
                                        onChange={(val) =>
                                          updateService(
                                            s.id,
                                            "serviceMode",
                                            val || "",
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Service Location" />
                                      <Input
                                        placeholder="e.g. At Clinic/Office, Client Site, Virtual"
                                        value={s.serviceLocation}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "serviceLocation",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Service Duration" />
                                      <Input
                                        placeholder="e.g. 45 Mins, 1 Hour, Project-based"
                                        value={s.serviceDuration}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "serviceDuration",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>

                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Advance Booking Required?" />
                                      <Select
                                        className="w-full"
                                        allowClear
                                        placeholder="Select booking requirement"
                                        value={
                                          s.bookingRequired === null
                                            ? undefined
                                            : s.bookingRequired
                                              ? "true"
                                              : "false"
                                        }
                                        options={[
                                          {
                                            value: "true",
                                            label:
                                              "Yes (Appointment Mandatory)",
                                          },
                                          {
                                            value: "false",
                                            label: "No (Walk-in Welcome)",
                                          },
                                        ]}
                                        onChange={(val) =>
                                          updateService(
                                            s.id,
                                            "bookingRequired",
                                            val === "true"
                                              ? true
                                              : val === "false"
                                                ? false
                                                : null,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Cancellation Policy" />
                                      <Input
                                        placeholder="e.g. Free cancellation up to 24 hours prior"
                                        value={s.cancellationPolicy}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "cancellationPolicy",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                      <FieldLabel label="Refund Policy" />
                                      <Input
                                        placeholder="e.g. 100% refund on 24-hr notice"
                                        value={s.refundPolicy}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "refundPolicy",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  <SectionHeading accent="#A06C1E">
                                    Media & Documents
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    {/* Uploads */}
                                    <Col xs={24} sm={12}>
                                      <CompactUploadField
                                        label="Service Banner / Image"
                                        value={s.imageUrl}
                                        onChange={(url) =>
                                          updateService(s.id, "imageUrl", url)
                                        }
                                        userId={memberId || member?.id || ""}
                                        isImage={true}
                                      />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                      <CompactUploadField
                                        label="Brochure / Portfolio"
                                        value={s.brochureUrl}
                                        onChange={(url) =>
                                          updateService(
                                            s.id,
                                            "brochureUrl",
                                            url,
                                          )
                                        }
                                        userId={memberId || member?.id || ""}
                                        isImage={false}
                                      />
                                    </Col>
                                  </Row>

                                  <SectionHeading accent="#A06C1E">
                                    Features & Description
                                  </SectionHeading>
                                  <Row gutter={[16, { xs: 14, sm: 12 }]}>
                                    <Col xs={24}>
                                      <FieldLabel label="Key Features / Highlights" />
                                      <Input.TextArea
                                        placeholder="e.g. • 15+ years experience • Free initial consultation • Confidential support"
                                        value={s.keyFeatures}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "keyFeatures",
                                            e.target.value,
                                          )
                                        }
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                      />
                                    </Col>
                                    <Col xs={24}>
                                      <FieldLabel label="Detailed Description" />
                                      <Input.TextArea
                                        placeholder="Comprehensive service specifications and terms a fellow Rotary member should know..."
                                        value={s.description}
                                        onChange={(e) =>
                                          updateService(
                                            s.id,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                        autoSize={{ minRows: 2, maxRows: 5 }}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </Space>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>

              <div className="rbc-navigation-container flex justify-between items-center my-5 py-3 px-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#EEE4D1] shadow-sm">
                <Button
                  size="large"
                  icon={<LeftOutlined style={{ fontSize: 13 }} />}
                  onClick={goToPrevTab}
                  disabled={activeTab === TAB_KEYS[0]}
                  className="flex items-center gap-1.5 transition-all !rounded-xl !h-11 !px-5 !font-semibold !text-[14px]"
                  style={{
                    border: "1.5px solid #D5C8B5",
                    color: activeTab === TAB_KEYS[0] ? "#B8AB98" : "#3A2F23",
                    background:
                      activeTab === TAB_KEYS[0] ? "#FAF6EE" : "#FFFFFF",
                    boxShadow:
                      activeTab === TAB_KEYS[0]
                        ? "none"
                        : "0 2px 6px rgba(58, 47, 35, 0.06)",
                  }}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E8] border border-[#E8D8C3] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0E6B4F] animate-pulse"></span>
                  <Text className="text-[13px] font-bold text-[#784A12] tracking-wide">
                    STEP{" "}
                    {TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]) +
                      1}{" "}
                    OF {TAB_KEYS.length}
                  </Text>
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={goToNextTab}
                  disabled={activeTab === TAB_KEYS[TAB_KEYS.length - 1]}
                  className="flex items-center gap-1.5 transition-all !rounded-xl !h-11 !px-6 !font-semibold !text-[14px]"
                  style={{
                    background:
                      activeTab === TAB_KEYS[TAB_KEYS.length - 1]
                        ? "#E2DDD4"
                        : "linear-gradient(135deg, #0E6B4F 0%, #084331 100%)",
                    border: "none",
                    color:
                      activeTab === TAB_KEYS[TAB_KEYS.length - 1]
                        ? "#9E9485"
                        : "#FFFFFF",
                    boxShadow:
                      activeTab === TAB_KEYS[TAB_KEYS.length - 1]
                        ? "none"
                        : "0 6px 16px -2px rgba(14, 107, 79, 0.4)",
                  }}
                >
                  Next
                  <RightOutlined style={{ fontSize: 13 }} />
                </Button>
              </div>

              <div
                className="flex justify-end mb-6 py-4 px-2"
                style={{
                  background: "rgba(250,246,238,0.92)",
                  backdropFilter: "blur(6px)",
                  borderTop: "1px solid #EEE4D1",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined style={{ fontSize: 16 }} />}
                  onClick={handleSubmit}
                  loading={saving}
                  block
                  className="sm:!w-auto !h-12 !px-8 !rounded-xl !font-bold !text-[16px] transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #0E6B4F 0%, #084331 100%)",
                    border: "none",
                    boxShadow: "0 10px 22px -6px rgba(14, 107, 79, 0.45)",
                    color: "#FFFFFF",
                    letterSpacing: "0.3px",
                  }}
                >
                  Save All Details
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RotaryBusinessConnect;
