import React from "react";
import { Gift } from "lucide-react";
import type { ComboPricingResult } from "./agentComboDisplay";
import { formatInr } from "./agentComboDisplay";

type Props = {
  pricing: ComboPricingResult;
  compact?: boolean;
};

const AgentComboPricingSummary: React.FC<Props> = ({ pricing, compact }) => {
  if (!pricing.display) return null;

  if (pricing.incomplete) {
    return (
      <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">Combo offer: {pricing.display.title}</p>
        <p className="mt-1">
          Add all items from this combo to your cart to unlock the offer price of{" "}
          {formatInr(pricing.display.bundlePrice)}.
        </p>
      </div>
    );
  }

  if (!pricing.active) return null;

  return (
    <div
      className={`rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 ${
        compact ? "p-3" : "p-4 mb-4"
      }`}
    >
      <div className="flex items-start gap-2">
        <Gift className="shrink-0 text-purple-600" size={compact ? 20 : 24} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-purple-900">
            Combo offer applied: {pricing.display.title}
          </p>
          <div className={`mt-2 space-y-1 text-sm ${compact ? "" : "text-base"}`}>
            <div className="flex justify-between text-gray-600">
              <span>Regular price (combo items)</span>
              <span className="line-through">
                {formatInr(pricing.catalogComboSubtotal)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-purple-800">
              <span>Combo offer price</span>
              <span>{formatInr(pricing.bundlePrice)}</span>
            </div>
            {pricing.savings > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>You save on combo</span>
                <span>{formatInr(pricing.savings)}</span>
              </div>
            )}
            {pricing.nonComboSubtotal > 0 && (
              <div className="flex justify-between text-gray-700 pt-1 border-t border-purple-100">
                <span>Other items in cart</span>
                <span>{formatInr(pricing.nonComboSubtotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-purple-900 pt-2 border-t border-purple-200">
              <span>Items subtotal (with combo)</span>
              <span>{formatInr(pricing.adjustedItemSubtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentComboPricingSummary;
