import { resolveCartAgentBase, uploadurlwithId } from "../Config";
import { customerApi } from "../utils/axiosInstances";

function cartAgentBase(): string {
  return resolveCartAgentBase().replace(/\/$/, "");
}

function cartAgentUrl(path: string): string {
  const base = cartAgentBase();
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export { uploadurlwithId };

export interface AgentChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentComboComponent {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  category?: string;
  imageUrl?: string;
}

export interface AgentComboCard {
  comboOfferId: string;
  comboCode: string;
  title: string;
  description: string;
  bundlePrice: number;
  mrpTotal: number;
  savings: number;
  validUntil: string;
  campaignSegment?: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  components: AgentComboComponent[];
}

export interface AgentChatResponse {
  reply: string;
  combos?: AgentComboCard[];
  sessionId: string;
}

export async function sendAgentMessage(
  userId: string,
  message: string,
  conversationHistory: AgentChatMessage[]
): Promise<AgentChatResponse> {
  const res = await customerApi.post(cartAgentUrl("/chat"), {
    userId,
    message,
    conversationHistory,
  });
  return res.data;
}

export type UserOfferSegment =
  | "FREQUENT_BUYER"
  | "REGISTERED_NO_ORDER"
  | "CHURNED"
  | "CART_ABANDONED";

export async function listManagerSegments() {
  const res = await customerApi.get(cartAgentUrl("/segments"));
  return res.data;
}

export async function bulkPreviewSegment(segment: UserOfferSegment) {
  const res = await customerApi.get(cartAgentUrl("/campaign/bulk-preview"), { params: { segment } });
  return res.data;
}

export interface AgentBulkCampaignResult {
  segment: UserOfferSegment;
  segmentLabel: string;
  maxOffersInBatch: number;
  totalUsersInSegment: number;
  eligibleUserIds: string[];
  pendingOffersCreated: number;
  pendingOffers: AgentComboCard[];
  message: string;
  errors?: string[];
}

export interface AgentCampaignApproveResult {
  segment: UserOfferSegment;
  approvedOfferCount: number;
  totalUsersInSegment: number;
  usersAssigned: number;
  combosAssignedToUsers: number;
  eligibleUserIds: string[];
  approvedOffers: AgentComboCard[];
  message: string;
  errors?: string[];
}

/** Step 1 — create draft combos for admin review */
export async function bulkGenerateForSegment(
  segment: UserOfferSegment,
  maxOffers = 8
): Promise<AgentBulkCampaignResult> {
  const res = await customerApi.post(cartAgentUrl("/campaign/bulk-generate"), null, {
    params: { segment, maxOffers },
  });
  return res.data;
}

export async function listPendingCampaignOffers(segment: UserOfferSegment) {
  const res = await customerApi.get(cartAgentUrl("/campaign/offers/pending"), {
    params: { segment },
  });
  return res.data as AgentComboCard[];
}

export async function listEligibleCampaignUsers(segment: UserOfferSegment) {
  const res = await customerApi.get(cartAgentUrl("/campaign/eligible-users"), {
    params: { segment },
  });
  return res.data as string[];
}

/** Step 2 — approve batch; only eligibleUserIds can see offers */
export async function approveCampaignOffers(
  segment: UserOfferSegment,
  offerIds?: string[]
): Promise<AgentCampaignApproveResult> {
  const res = await customerApi.post(cartAgentUrl("/campaign/approve"), offerIds?.length ? { offerIds } : null, {
    params: { segment },
  });
  return res.data;
}

function normalizeComboComponent(raw: Record<string, unknown>): AgentComboComponent {
  return {
    itemId: raw.itemId != null ? String(raw.itemId) : "",
    itemName: String(raw.itemName ?? ""),
    quantity: Number(raw.quantity ?? 1),
    unitPrice: Number(raw.unitPrice ?? 0),
    mrp: Number(raw.mrp ?? raw.unitPrice ?? 0),
    category: raw.category != null ? String(raw.category) : undefined,
    imageUrl: raw.imageUrl != null ? String(raw.imageUrl) : undefined,
  };
}

function normalizeComboCard(raw: Record<string, unknown>): AgentComboCard {
  const components = Array.isArray(raw.components)
    ? raw.components.map((c) =>
        normalizeComboComponent(c as Record<string, unknown>),
      )
    : [];
  return {
    comboOfferId: raw.comboOfferId != null ? String(raw.comboOfferId) : "",
    comboCode: String(raw.comboCode ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    bundlePrice: Number(raw.bundlePrice ?? 0),
    mrpTotal: Number(raw.mrpTotal ?? 0),
    savings: Number(raw.savings ?? 0),
    validUntil: raw.validUntil != null ? String(raw.validUntil) : "",
    campaignSegment:
      raw.campaignSegment != null ? String(raw.campaignSegment) : undefined,
    approvalStatus: raw.approvalStatus as AgentComboCard["approvalStatus"],
    components,
  };
}

/** Customer — approved campaign combos only (eligible users) */
export async function getActiveCombos(userId: string): Promise<AgentComboCard[]> {
  const res = await customerApi.get(cartAgentUrl(`/combos/${userId}`));
  const data = res.data;
  console.log("Raw offers data:", data);
  if (!Array.isArray(data)) return [];
  return data.map((row) => normalizeComboCard(row as Record<string, unknown>));
}

export async function addComboToCart(comboOfferId: string, userId: string) {
  const res = await customerApi.post(
    cartAgentUrl(`/combos/${comboOfferId}/add-to-cart/${userId}`),
  );
  return res.data;
}

/** Build S3 / CDN URL for product thumbnails */
export function resolveProductImageUrl(raw?: string | null): string | null {
  if (raw == null) return null;
  const path = String(raw).trim();
  if (!path || path === "null" || path === "undefined") return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("null/")) {
    return `https://oxybricksv1.s3.ap-south-1.amazonaws.com/${path.slice(5)}`;
  }
  if (path.includes("amazonaws.com")) {
    return path.startsWith("http") ? path : `https://${path.replace(/^\/+/, "")}`;
  }
  if (!path.includes("/")) {
    return `${uploadurlwithId}${path}`;
  }
  return `https://oxybricksv1.s3.ap-south-1.amazonaws.com/${path.replace(/^\/+/, "")}`;
}
