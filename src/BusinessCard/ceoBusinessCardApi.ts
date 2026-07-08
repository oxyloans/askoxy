import BASE_URL from "../Config";
import { businessCardApi } from "../utils/axiosInstances";

const resolveAiAgentBase = (): string => {
  const fromEnv = process.env.REACT_APP_AI_SERVICE_AGENT_BASE?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  // if (process.env.NODE_ENV === "development") {
  //   const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  //   return `http://${host}:9040/api/ai-service/agent`;
  // }
  return `${BASE_URL}/ai-service/agent`;
};

const AI_AGENT_BASE = resolveAiAgentBase();

export interface CeoDetailsRequest {
  id?: string;
  content?: string | null;
  companyName?: string | null;
  eventName?: string | null;
  eventType?: string | null;
  ceoId?: string;
  ceoName?: string | null;
  designation?: string | null;
  mobile?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  linkedin?: string | null;
  location?: string | null;
  emailSubjectName?: string | null;
  active?: boolean;
}

export interface CeoDetailsResponse {
  id?: string;
  ceoId?: string;
  content?: string;
  companyName?: string;
  eventName?: string;
  eventType?: string;
  cratedAt?: string;
  ceoName?: string;
  designation?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  linkedin?: string;
  location?: string;
  emailSubjectName?: string;
  active?: boolean;
}

export interface BusinessUploadDataDto {
  id?: string;
  personName?: string;
  email?: string;
  mobileNumber?: string;
  companyName?: string;
  originalImage?: string;
  image?: string;
  businessCard?: string;
  eventId?: string;
}

export interface BusinessUploadDataResponse {
  eventType?: string;
  list?: BusinessUploadDataDto[];
}

export interface BusinessUploadDataGroup {
  eventType: string;
  list: BusinessUploadDataDto[];
}

type RawUploadItem = BusinessUploadDataDto & {
  Image?: string;
  businessCard?: string;
};

const normalizeUploadItem = (item: RawUploadItem): BusinessUploadDataDto => {
  const profileImage = item.image || item.Image;
  const businessCard = item.businessCard || undefined;

  return {
    id: item.id,
    personName: item.personName,
    email: item.email,
    mobileNumber: item.mobileNumber,
    companyName: item.companyName,
    eventId: item.eventId,
    businessCard,
    image: profileImage,
    originalImage: profileImage,
  };
};

export const parseCeoUploadResponseGroups = (
  data: BusinessUploadDataResponse | BusinessUploadDataResponse[]
): BusinessUploadDataGroup[] => {
  const groups = Array.isArray(data) ? data : [data];

  return groups.map((group) => ({
    eventType: group.eventType || "",
    list: (group.list || []).map((item) => normalizeUploadItem(item as RawUploadItem)),
  }));
};

/** @deprecated Use parseCeoUploadResponseGroups for event-type grouped data */
export const normalizeCeoUploadResponse = (
  data: BusinessUploadDataResponse | BusinessUploadDataResponse[]
): BusinessUploadDataResponse => {
  const groups = parseCeoUploadResponseGroups(data);

  if (!groups.length) {
    return { eventType: "", list: [] };
  }

  const list = groups.flatMap((group) => group.list);
  const eventTypes = Array.from(
    new Set(groups.map((group) => group.eventType).filter(Boolean))
  );

  return {
    eventType: eventTypes.join(", ") || groups[0].eventType || "",
    list,
  };
};

export const getLoggedInUserId = (): string | null =>
  sessionStorage.getItem("userId");

export const pickLatestCeoRecord = (
  records: CeoDetailsResponse[],
  userId?: string | null
): CeoDetailsResponse | null => {
  if (!records.length) return null;

  const resolvedUserId = userId?.trim() || getLoggedInUserId();
  const ownedRecords = resolvedUserId
    ? records.filter((record) => String(record.ceoId || "") === resolvedUserId)
    : records;

  if (!ownedRecords.length) return null;

  return [...ownedRecords].sort((a, b) => {
    const aTime = a.cratedAt ? Date.parse(a.cratedAt) : 0;
    const bTime = b.cratedAt ? Date.parse(b.cratedAt) : 0;
    return bTime - aTime;
  })[0];
};

/** Matches backend process-business-card, which uses the active CEO profile. */
export const pickActiveCeoRecord = (
  records: CeoDetailsResponse[],
  userId?: string | null
): CeoDetailsResponse | null => {
  if (!records.length) return null;

  const resolvedUserId = userId?.trim() || getLoggedInUserId();
  const ownedRecords = resolvedUserId
    ? records.filter((record) => String(record.ceoId || "") === resolvedUserId)
    : records;

  if (!ownedRecords.length) return null;

  const activeRecord = ownedRecords.find((record) => record.active === true);
  return activeRecord ?? pickLatestCeoRecord(ownedRecords, resolvedUserId);
};

export const mapCeoRecordToForm = (record: CeoDetailsResponse): CeoDetailsRequest => ({
  id: record.id,
  ceoName: record.ceoName ?? "",
  eventType: record.eventType ?? "",
  eventName: record.eventName ?? "",
  companyName: record.companyName ?? "",
  designation: record.designation ?? "",
  mobile: record.mobile ?? "",
  whatsapp: record.whatsapp ?? "",
  email: record.email ?? "",
  linkedin: record.linkedin ?? "",
  location: record.location ?? "",
  content: record.content ?? "",
  emailSubjectName: record.emailSubjectName ?? "",
  active: record.active,
});

/** Keep what the user entered when the save API returns only id/ceoId. */
export const applySavedCeoFormState = (
  currentForm: CeoDetailsRequest,
  saved: CeoDetailsResponse
): CeoDetailsRequest => {
  const hasSavedFields =
    saved.ceoName != null ||
    saved.eventType != null ||
    saved.mobile != null ||
    saved.companyName != null ||
    saved.content != null;

  if (hasSavedFields) {
    return mapCeoRecordToForm(saved);
  }

  return {
    ...currentForm,
    id: saved.id ?? currentForm.id,
  };
};

export const filterOwnedCeoRecords = (
  records: CeoDetailsResponse[],
  userId?: string | null
): CeoDetailsResponse[] => {
  const resolvedUserId = userId?.trim() || getLoggedInUserId();
  if (!resolvedUserId) return records;
  return records.filter((record) => String(record.ceoId || "") === resolvedUserId);
};

export const pickInactiveCeoRecords = (
  records: CeoDetailsResponse[],
  userId?: string | null
): CeoDetailsResponse[] =>
  filterOwnedCeoRecords(records, userId).filter((record) => record.active !== true);

/** Active first, then newest by created date. */
export const sortCeoRecordsByActive = (
  records: CeoDetailsResponse[]
): CeoDetailsResponse[] =>
  [...records].sort((a, b) => {
    if (a.active === true && b.active !== true) return -1;
    if (b.active === true && a.active !== true) return 1;
    const aTime = a.cratedAt ? Date.parse(a.cratedAt) : 0;
    const bTime = b.cratedAt ? Date.parse(b.cratedAt) : 0;
    return bTime - aTime;
  });

/** Clears fields that do not apply to the selected CEO details type before save. */
export const buildCeoDetailsSavePayload = (
  form: CeoDetailsRequest
): CeoDetailsRequest => {
  const isNewRecord = !form.id?.trim();
  const payload: CeoDetailsRequest = {
    ...form,
    id: form.id?.trim() || undefined,
    ceoName: form.ceoName?.trim() || null,
    eventType: form.eventType?.trim() || null,
    eventName: form.eventName?.trim() || null,
    companyName: form.companyName?.trim() || null,
    designation: form.designation?.trim() || null,
    mobile: form.mobile?.trim() || null,
    whatsapp: form.whatsapp?.trim() || null,
    email: form.email?.trim() || null,
    linkedin: form.linkedin?.trim() || null,
    location: form.location?.trim() || null,
    content: form.content?.trim() || null,
    emailSubjectName: form.emailSubjectName?.trim() || null,
    active: isNewRecord ? true : form.active,
  };

  if (isBusinessEventType(payload.eventType ?? undefined)) {
    return payload;
  }

  return {
    ...payload,
    companyName: null,
    designation: null,
    email: null,
    linkedin: null,
    emailSubjectName: null,
  };
};

/** User-facing labels for CEO profile fields (backend still uses eventType / eventName). */
export const CEO_DETAILS_LABELS = {
  sectionDescription: "Core identity and CEO details for your profile.",
  type: "CEO Details Type",
  typeShort: "CEO details type",
  typePlaceholder: "Select CEO details type",
  typeTooltip: "Choose the CEO details type for this profile.",
  name: "CEO Details Name",
  namePlaceholder: "Enter CEO details name",
  nameBusinessPlaceholder: "Meeting or occasion name",
  nameBusinessTooltip: "Name of the business meeting or occasion.",
  nameCampaignPlaceholder: "Campaign or occasion name",
  filterTitle: "Filter by CEO details",
  filterTooltip: "Options and records update when you change the CEO details type.",
  tableTypeColumn: "CEO Details Type",
  tableNameColumn: "CEO Details Name",
} as const;

export const CEO_EVENT_TYPE_OPTIONS = [
  { label: "Business", value: "BUSINESS" },
  { label: "Conference", value: "CONFERENCE" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Vendor", value: "VENDOR" },
  { label: "Investor", value: "INVESTOR" },
  { label: "Job Interview", value: "JOB_INTERVIEW" },
  { label: "Training", value: "TRAINING" },
  { label: "College", value: "COLLEGE" },
  { label: "Friend", value: "FRIEND" },
  { label: "Family", value: "FAMILY" },
  { label: "Wedding", value: "WEDDING" },
  { label: "Birthday", value: "BIRTHDAY" },
  { label: "Social", value: "SOCIAL" },
  { label: "Other", value: "OTHER" },
] as const;

export const isBusinessEventType = (eventType?: string | null): boolean =>
  eventType?.toUpperCase() === "BUSINESS";

export const formatEventTypeLabel = (eventType?: string): string => {
  if (!eventType) return "-";
  const match = CEO_EVENT_TYPE_OPTIONS.find(
    (option) => option.value === eventType.toUpperCase()
  );
  if (match) return match.label;
  return eventType
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const saveCeoDetails = async (
  payload: CeoDetailsRequest
): Promise<CeoDetailsResponse> => {
  const ceoId = getLoggedInUserId();
  if (!ceoId) {
    throw new Error("User ID not found. Please login again.");
  }

  const body = { ...payload, ceoId };
  const url = `${AI_AGENT_BASE}/ceoDetails`;

  const response = payload.id
    ? await businessCardApi.patch<CeoDetailsResponse>(url, body)
    : await businessCardApi.patch<CeoDetailsResponse>(url, body);

  return response.data;
};

/** @deprecated use saveCeoDetails */
export const patchCeoDetails = saveCeoDetails;

export interface ProcessBusinessCardOptions {
  messageId: string;
  file?: File;
  photo?: File;
  mobileNumber?: string;
}

export const processBusinessCard = async (
  options: ProcessBusinessCardOptions
): Promise<string> => {
  const formData = new FormData();
  formData.append("messageId", options.messageId);

  if (options.file) {
    formData.append("file", options.file);
  }
  if (options.photo) {
    formData.append("photo", options.photo);
  }
  if (options.mobileNumber?.trim()) {
    formData.append("mobileNumber", options.mobileNumber.trim());
  }

  const response = await businessCardApi.post<string>(
    `${AI_AGENT_BASE}/process-business-card`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000,
    }
  );

  return typeof response.data === "string"
    ? response.data
    : "Upload processed successfully.";
};

export const fetchCeoDataUploadDetails = async (
  userId?: string
): Promise<BusinessUploadDataGroup[]> => {
  const resolvedUserId = userId?.trim() || getLoggedInUserId();
  if (!resolvedUserId) {
    throw new Error("User ID not found. Please login again.");
  }

  const response = await businessCardApi.get<
    BusinessUploadDataResponse | BusinessUploadDataResponse[]
  >(
    `${AI_AGENT_BASE}/getCeoDataUploadDetailsBasedOnId`,
    {
      params: { userId: resolvedUserId },
      timeout: 120000,
    }
  );

  return parseCeoUploadResponseGroups(response.data);
};

export const fetchCeoDetailsByUserId = async (
  userId?: string
): Promise<CeoDetailsResponse[]> => {
  const resolvedUserId = userId?.trim() || getLoggedInUserId();
  if (!resolvedUserId) {
    throw new Error("User ID not found. Please login again.");
  }

  const response = await businessCardApi.get<CeoDetailsResponse[]>(
    `${AI_AGENT_BASE}/getCeoDetailsBasedOnId`,
    {
      params: { userId: resolvedUserId },
      timeout: 120000,
    }
  );
  return response.data;
};
