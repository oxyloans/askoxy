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
  } from "@ant-design/icons";
  import BASE_URL from "../Config";

  const { Title, Text, Paragraph } = Typography;

  interface RotaryProductService {
    id: string;
    memberId: string;
    name: string;
    membersType: "PRODUCT" | "SERVICE";
    category: string;
    price: number;
    description: string;
    availability?: string;
    createdAt: number;
    updatedAt: number;
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
    products?: RotaryProductService[] | null;
    services?: RotaryProductService[] | null;
  }

  interface ProductEntry {
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
  }

  interface ServiceEntry {
    id: string;
    name: string;
    category: string;
    price: string;
    availability: string;
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
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
    {
      key: "birthday",
      label: "DOB",
      placeholder: "e.g. 26 Apr",
      type: "text",
      section: "personal",
    },
    {
      key: "anniversary",
      label: "Anniversary",
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
    "Made to Order",
    "By Appointment Only",
    "Weekdays Only",
    "Seasonal",
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
  const emptyProduct = (): ProductEntry => ({
    id: uid(),
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const emptyService = (): ServiceEntry => ({
    id: uid(),
    name: "",
    category: "",
    price: "",
    availability: "",
    description: "",
  });
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
    const TAB_KEYS = ["personal", "contact", "business", "products", "services"] as const;
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
          const personalFields = FIELD_CONFIG.filter((f) => f.section === "personal").map((f) => f.key);
          await detailsForm.validateFields(personalFields);
        } catch {
          message.error("Please fill in all required Personal details correctly.");
          setActiveTab("personal");
          return;
        }
      }

      // If target is business (index 2) or beyond, we must validate contact (index 1)
      if (targetIdx >= 2) {
        try {
          const contactFields = FIELD_CONFIG.filter((f) => f.section === "contact").map((f) => f.key);
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
                id: p.id,
                name: p.name || "",
                category: p.category || "",
                price: String(p.price || ""),
                description: p.description || "",
              })),
            );
          } else {
            setProducts([emptyProduct()]);
          }

          if (result.services && result.services.length > 0) {
            setServices(
              result.services.map((s) => ({
                id: s.id,
                name: s.name || "",
                category: s.category || "",
                price: String(s.price || ""),
                availability: s.availability || "",
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
      value: string,
    ) => {
      setProducts((p) =>
        p.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
      );
      if (submitAttempted && (field === "name" || field === "category")) {
        setProductErrors((e) => ({
          ...e,
          [id]: {
            ...e[id],
            [field]: value.trim()
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
      value: string,
    ) => {
      setServices((s) =>
        s.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
      );
      if (submitAttempted && (field === "name" || field === "category")) {
        setServiceErrors((e) => ({
          ...e,
          [id]: {
            ...e[id],
            [field]: value.trim()
              ? ""
              : `${field === "name" ? "Service name" : "Category"} is required`,
          },
        }));
      }
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
      };
    };

    const saveMemberDetails = async (details: RotaryMemberDetails): Promise<string> => {
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
      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/save-update-member-products-services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "*/*" },
          body: JSON.stringify({
            id: entry.id.length === 36 ? entry.id : "",
            memberId: targetMemberId,
            membersType: type,
            name: entry.name,
            category: entry.category,
            price: Number(entry.price) || 0,
            description: entry.description,
            availability: "availability" in entry ? entry.availability : "",
            createdAt: now,
            updatedAt: now,
          }),
        },
      );
      if (!res.ok)
        throw new Error(`${type === "PRODUCT" ? "Product" : "Service"} save failed (${res.status})`);
    };

    const handleSubmit = async () => {
      setSubmitAttempted(true);

      const newProductErrors: Record<string, ProductFieldErrors> = {};
      products.forEach((p) => {
        const errs: ProductFieldErrors = {};
        if (p.name.trim() || p.category.trim()) {
          if (!p.name.trim()) errs.name = "Product name is required";
          if (!p.category.trim()) errs.category = "Category is required";
        }
        if (Object.keys(errs).length) newProductErrors[p.id] = errs;
      });

      const newServiceErrors: Record<string, ServiceFieldErrors> = {};
      services.forEach((s) => {
        const errs: ServiceFieldErrors = {};
        if (s.name.trim() || s.category.trim()) {
          if (!s.name.trim()) errs.name = "Service name is required";
          if (!s.category.trim()) errs.category = "Category is required";
        }
        if (Object.keys(errs).length) newServiceErrors[s.id] = errs;
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
        const detailsChanged = isNewMember || detailsForm.isFieldsTouched();
        const filledProducts = products.filter(
          (p) => p.name.trim() && p.category.trim(),
        );
        const filledServices = services.filter(
          (s) => s.name.trim() && s.category.trim(),
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

        const finalMember: RotaryMemberDetails = { ...finalDetails, id: activeMemberId };
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
          message.error("Please fill all required fields correctly before submitting.");
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
      const isLocked =
        !isNewMember && !!field.lockedForExisting;
      const isDisabled = isLocked || !isMissing;
      const showAsterisk = !!field.essential;
      const isRequired = isNewMember && !!field.essential;
      return (
        <Col xs={24} sm={12} key={field.key}>
          <Form.Item
            name={field.key}
            label={
              <span className="rbc-field-label text-[#3A2F23] text-[16px] font-semibold">
                {field.label} {showAsterisk && <span style={{ color: "#ff4d4f" }}>*</span>}
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
                    Rotary District 3150
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
              <Text strong className="block mb-2 text-[#2A2118] text-[16px] sm:text-[15px]">
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
                className="mb-6 rounded-2xl border-0"
                style={{
                  background: "linear-gradient(135deg, #0E6B4F 0%, #0A4F3A 100%)",
                  boxShadow: "0 18px 40px -18px rgba(14,107,79,0.55)",
                }}
              >
                <Space align="start" size={12} direction="vertical" style={{ width: "100%" }}>
                  <Space align="center" size={8}>
                    <BulbFilled className="text-amber-300 text-lg" />
                    <Text strong className="!text-amber-300 text-[16px]">
                      Why are we collecting this?
                    </Text>
                  </Space>
                  <div className="text-emerald-50 text-[14px] leading-relaxed">
                    <p className="mb-2">
                      We encourage Rotary members to make the <strong>Rotary family their first choice for help, products, and services:</strong>
                    </p>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px", margin: "0 0 12px 0" }}>
                      <li style={{ marginBottom: "6px" }}>
                        Ensure every member’s latest profession, products, and services are up to date.
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        Quickly find and connect with Rotary professionals nearby — such as doctors, lawyers, and other service providers.
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        Help members discover special offers, support each other’s businesses, and grow business within the Rotary family.
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        Registration is sponsored by <strong>AskOxy.ai</strong>, at no cost to Rotary members.
                      </li>
                      <li style={{ marginBottom: "0px" }}>
                        As per the member’s wish, a portion of eligible fees/transactions between Rotary members may be contributed to the <strong>Rotary Foundation</strong>.
                      </li>
                    </ul>
                    <p className="font-semibold text-amber-200">
                      Avail special offers, support fellow Rotary members, and grow your business within the Rotary family!
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
                        { key: "personal", label: "Personal", icon: <IdcardOutlined /> },
                        { key: "contact", label: "Contact", icon: <PhoneOutlined /> },
                        { key: "business", label: "Business", icon: <BankOutlined /> },
                        { key: "products", label: "Products", icon: <ShopOutlined /> },
                        { key: "services", label: "Services", icon: <ToolOutlined /> },
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
                    onChange={(key) => handleTabChange(key as typeof TAB_KEYS[number])}
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
                                Add the products this member sells. Pick a
                                category or type your own.
                              </Text>
                              <Button
                                type="link"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={addProduct}
                              >
                                Add Product
                              </Button>
                            </div>
                            <Space
                              direction="vertical"
                              className="w-full"
                              size={12}
                            >
                              {products.map((p, idx) => {
                                const errs = productErrors[p.id] || {};
                                return (
                                  <div
                                    key={p.id}
                                    className="rounded-xl p-4 relative"
                                    style={{
                                      background: "#F1F7F4",
                                      border: "1px solid #D3E6DC",
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <Text
                                        strong
                                        className="text-[17px] text-[#3A2F23]"
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
                                      />
                                    </div>
                                    <Row gutter={[12, 4]}>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Product Name *
                                        </Text>
                                        <Input
                                          placeholder="e.g. Ayurvedic Cough Syrup"
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
                                            className="text-[13px]"
                                          >
                                            {errs.name}
                                          </Text>
                                        )}
                                      </Col>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Category *
                                        </Text>
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
                                          placeholder="Select or type a category"
                                        >
                                          <Input
                                            status={errs.category ? "error" : ""}
                                          />
                                        </AutoComplete>
                                        {errs.category && (
                                          <Text type="danger" className="text-xs">
                                            {errs.category}
                                          </Text>
                                        )}
                                      </Col>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Price
                                        </Text>
                                        <Input
                                          placeholder="e.g. ₹250 per bottle"
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
                                      <Col xs={24}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Description
                                        </Text>
                                        <Input.TextArea
                                          placeholder="Brief details a fellow member should know"
                                          value={p.description}
                                          onChange={(e) =>
                                            updateProduct(
                                              p.id,
                                              "description",
                                              e.target.value,
                                            )
                                          }
                                          autoSize={{ minRows: 2, maxRows: 4 }}
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
                              <Text className="text-[#6B5D4F]">
                                Add the services this member offers. Pick a
                                category or type your own.
                              </Text>
                              <Button
                                type="link"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={addService}
                              >
                                Add Service
                              </Button>
                            </div>
                            <Space
                              direction="vertical"
                              className="w-full"
                              size={12}
                            >
                              {services.map((s, idx) => {
                                const errs = serviceErrors[s.id] || {};
                                return (
                                  <div
                                    key={s.id}
                                    className="rounded-xl p-4 relative"
                                    style={{
                                      background: "#FBF8F2",
                                      border: "1px solid #EEE4D1",
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <Text strong className="text-[#3A2F23]">
                                        Service {idx + 1}
                                      </Text>
                                      <Button
                                        type="text"
                                        size="small"
                                        icon={<CloseOutlined />}
                                        onClick={() => removeService(s.id)}
                                        disabled={services.length === 1}
                                        danger
                                      />
                                    </div>
                                    <Row gutter={[12, 4]}>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Service Name *
                                        </Text>
                                        <Input
                                          placeholder="e.g. Home Blood Test Collection"
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
                                          <Text type="danger" className="text-xs">
                                            {errs.name}
                                          </Text>
                                        )}
                                      </Col>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Category *
                                        </Text>
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
                                          placeholder="Select or type a category"
                                        >
                                          <Input
                                            status={errs.category ? "error" : ""}
                                          />
                                        </AutoComplete>
                                        {errs.category && (
                                          <Text type="danger" className="text-xs">
                                            {errs.category}
                                          </Text>
                                        )}
                                      </Col>
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Price / Fee
                                        </Text>
                                        <Input
                                          placeholder="e.g. ₹500 per visit"
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
                                      <Col xs={24} sm={12}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Availability
                                        </Text>
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
                                          placeholder="Select or type availability"
                                        >
                                          <Input />
                                        </AutoComplete>
                                      </Col>
                                      <Col xs={24}>
                                        <Text className="block mb-1 text-[15px] font-semibold text-[#3A2F23]">
                                          Description
                                        </Text>
                                        <Input.TextArea
                                          placeholder="Brief details a fellow member should know"
                                          value={s.description}
                                          onChange={(e) =>
                                            updateService(
                                              s.id,
                                              "description",
                                              e.target.value,
                                            )
                                          }
                                          autoSize={{ minRows: 2, maxRows: 4 }}
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

                <div className="rbc-navigation-container flex justify-between items-center mb-4 py-2 px-1">
                  <Button
                    size="large"
                    onClick={goToPrevTab}
                    disabled={activeTab === TAB_KEYS[0]}
                  >
                    Previous
                  </Button>
                  <Text className="rbc-navigation-step-text text-[13px] text-[#8A7860]">
                    Step {TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]) + 1} of {TAB_KEYS.length}
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    onClick={goToNextTab}
                    disabled={activeTab === TAB_KEYS[TAB_KEYS.length - 1]}
                    style={{
                      background: "linear-gradient(135deg, #0E6B4F 0%, #0A4F3A 100%)",
                      border: "none",
                    }}
                  >
                    Next
                  </Button>
                </div>

                <div
                  className="flex justify-end mb-4 py-3 px-1"
                  style={{
                    background: "rgba(250,246,238,0.92)",
                    backdropFilter: "blur(4px)",
                    borderTop: "1px solid #EEE4D1",
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    onClick={handleSubmit}
                    loading={saving}
                    block
                    className="bg-[rgb(0,_140,_186)] sm:!w-auto"
                    style={{
                      border: "none",
                      boxShadow: "0 10px 25px -8px rgba(201,146,43,0.5)",
                      fontWeight: 700,
                      fontSize: 17,
                      height: 52,
                    }}
                  >
                    Save Details
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
