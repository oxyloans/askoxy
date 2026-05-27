import type { AgentComboCard } from "../ChatScreen/agentApi";

export const AGENT_COMBO_DISPLAY_KEY = "askoxy_active_agent_combo_display";

export interface AgentComboDisplayPayload {
  comboOfferId: string;
  title: string;
  bundlePrice: number;
  mrpTotal: number;
  savings: number;
  componentItemIds: string[];
  savedAt: number;
}

export interface ComboCartLine {
  itemId: string;
  itemPrice: string | number;
  cartQuantity: number;
  status?: string;
}

export interface ComboPricingResult {
  active: boolean;
  display: AgentComboDisplayPayload | null;
  catalogComboSubtotal: number;
  bundlePrice: number;
  savings: number;
  nonComboSubtotal: number;
  adjustedItemSubtotal: number;
  incomplete: boolean;
}

export function buildAgentComboDisplayPayload(
  offer: AgentComboCard,
): AgentComboDisplayPayload {
  return {
    comboOfferId: offer.comboOfferId,
    title: offer.title || offer.comboCode || "Combo offer",
    bundlePrice: Number(offer.bundlePrice) || 0,
    mrpTotal: Number(offer.mrpTotal) || 0,
    savings: Number(offer.savings) || 0,
    componentItemIds: (offer.components || [])
      .map((c) => (c.itemId != null ? String(c.itemId) : ""))
      .filter(Boolean),
    savedAt: Date.now(),
  };
}

export function saveAgentComboDisplay(offer: AgentComboCard): AgentComboDisplayPayload {
  const payload = buildAgentComboDisplayPayload(offer);
  try {
    sessionStorage.setItem(AGENT_COMBO_DISPLAY_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
  return payload;
}

export function loadAgentComboDisplay(): AgentComboDisplayPayload | null {
  try {
    const raw = sessionStorage.getItem(AGENT_COMBO_DISPLAY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AgentComboDisplayPayload;
    if (!parsed?.comboOfferId || !Array.isArray(parsed.componentItemIds)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearAgentComboDisplay(): void {
  try {
    sessionStorage.removeItem(AGENT_COMBO_DISPLAY_KEY);
  } catch {
    /* ignore */
  }
}

export function isComboItemInCart(
  itemId: string,
  display: AgentComboDisplayPayload | null,
): boolean {
  if (!display) return false;
  const id = String(itemId).toLowerCase();
  return display.componentItemIds.some((c) => String(c).toLowerCase() === id);
}

export function isComboCompleteInCart(
  display: AgentComboDisplayPayload,
  cartItems: Array<{ itemId: string }>,
): boolean {
  const inCart = new Set(
    cartItems.map((i) => String(i.itemId).toLowerCase()),
  );
  return display.componentItemIds.every((id) =>
    inCart.has(String(id).toLowerCase()),
  );
}

export function cartLineTotal(
  item: ComboCartLine,
  quantityOverride?: number,
): number {
  if (item.status === "FREE") return 0;
  const price =
    typeof item.itemPrice === "string"
      ? parseFloat(item.itemPrice)
      : Number(item.itemPrice);
  const qty =
    quantityOverride != null
      ? quantityOverride
      : Number(item.cartQuantity) || 1;
  if (Number.isNaN(price)) return 0;
  return price * qty;
}

const PAYABLE_STATUSES = new Set(["ADD", "COMBO", "REORDER"]);

export function computeComboPricing(
  display: AgentComboDisplayPayload | null,
  cartItems: ComboCartLine[],
  quantityByItemId?: Record<string, number>,
): ComboPricingResult {
  const inactive: ComboPricingResult = {
    active: false,
    display: null,
    catalogComboSubtotal: 0,
    bundlePrice: 0,
    savings: 0,
    nonComboSubtotal: 0,
    adjustedItemSubtotal: 0,
    incomplete: false,
  };

  if (!display || display.componentItemIds.length === 0) {
    return inactive;
  }

  const comboIds = new Set(
    display.componentItemIds.map((id) => String(id).toLowerCase()),
  );

  let catalogComboSubtotal = 0;
  let nonComboSubtotal = 0;

  for (const item of cartItems) {
    if (item.status === "FREE") continue;
    if (item.status && !PAYABLE_STATUSES.has(item.status)) continue;

    const id = String(item.itemId).toLowerCase();
    const qtyOverride = quantityByItemId?.[item.itemId];
    const line = cartLineTotal(item, qtyOverride);

    if (comboIds.has(id)) {
      catalogComboSubtotal += line;
    } else {
      nonComboSubtotal += line;
    }
  }

  const complete = isComboCompleteInCart(display, cartItems);
  if (!complete) {
    return {
      ...inactive,
      display,
      incomplete: true,
      catalogComboSubtotal,
      nonComboSubtotal,
      adjustedItemSubtotal: catalogComboSubtotal + nonComboSubtotal,
    };
  }

  const bundlePrice = Number(display.bundlePrice) || 0;
  const savings = Math.max(0, catalogComboSubtotal - bundlePrice);

  return {
    active: true,
    display,
    catalogComboSubtotal,
    bundlePrice,
    savings,
    nonComboSubtotal,
    adjustedItemSubtotal: nonComboSubtotal + bundlePrice,
    incomplete: false,
  };
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
