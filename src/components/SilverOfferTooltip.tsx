import React, { useState } from "react";
import axios from "axios";
import { Popover } from "antd";
import { Gem, Sparkles, Tag, Loader2, CheckCircle2 } from "lucide-react";
import BASE_URL from "../Config";

interface GoldRateBreakdown {
  gstAmount: number;
  totalAmount: number;
  itemPrice: number;
  gstPercentage: number;
  itemAmount?: number;
  makingAmount?: number;
  makingCharges?: number;
  discountAmount?: number;
}

interface SilverOfferTooltipProps {
  itemId: string;
  weight?: string | number;
  units?: string;
  itemName?: string;
  itemPrice?: number;
  categoryType?: string;
  categoryName?: string;
  className?: string;
}

// In-memory cache to prevent multiple duplicate network calls
const ratesCache = new Map<string, GoldRateBreakdown>();

export const isSilverProduct = (item: any): boolean => {
  if (!item) return false;
  const categoryType = (item.categoryType || "").toString().toUpperCase();
  const categoryName = (item.categoryName || "").toString().toUpperCase();
  const itemName = (item.itemName || item.title || "").toString().toLowerCase();

  return (
    categoryType === "SILVER" ||
    categoryName === "SILVER" ||
    itemName.includes("silver")
  );
};

export const SilverOfferTooltip: React.FC<SilverOfferTooltipProps> = ({
  itemId,
  weight,
  units = "gms",
  itemName,
  itemPrice,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<GoldRateBreakdown | null>(
    ratesCache.get(itemId) || null,
  );
  const [loading, setLoading] = useState(false);

  const fetchBreakdown = async () => {
    if (ratesCache.has(itemId)) {
      setBreakdown(ratesCache.get(itemId)!);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/getAllGoldAndSilverRates?itemId=${itemId}`,
      );
      if (response.data) {
        ratesCache.set(itemId, response.data);
        setBreakdown(response.data);
      }
    } catch (error) {
      console.error("Error fetching silver price breakdown:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !breakdown && !loading) {
      fetchBreakdown();
    }
  };

  const weightNum =
    weight !== undefined && weight !== null
      ? parseFloat(String(weight).replace(/[^0-9.]/g, ""))
      : null;

  const gstPercent = breakdown?.gstPercentage ?? 0;
  const silverItemPrice = breakdown?.itemPrice ?? (itemPrice || 0);
  const silverGstAmount = breakdown?.gstAmount ?? 0;
  const silverTotalAmount = breakdown?.totalAmount ?? silverItemPrice;
  const silverDiscount =
    breakdown?.discountAmount !== undefined
      ? breakdown.discountAmount
      : (breakdown?.gstAmount ?? 0);
  const silverGrandTotal = silverTotalAmount - silverDiscount;

  const rate =
    silverItemPrice && weightNum && weightNum > 0
      ? (silverItemPrice / weightNum).toFixed(2)
      : null;

  const grandTotal =
    silverGrandTotal > 0
      ? silverGrandTotal.toFixed(2)
      : itemPrice
        ? itemPrice.toFixed(2)
        : "0.00";

  const popoverContent = (
    <div
      className="w-[270px] sm:w-[295px] max-w-[calc(100vw-32px)] bg-white text-slate-800 rounded-xl overflow-hidden shadow-2xl border border-purple-200 text-xs select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Purple Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white p-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
            <Gem className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">
              Price Breakdown
            </h4>
            <span className="text-[10px] text-purple-200 font-medium">
              Silver · {weightNum ? `${weightNum} ${units}` : "Special"}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm">
          <Sparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
          Offer
        </span>
      </div>

      {loading ? (
        <div className="p-4 flex flex-col items-center justify-center gap-1.5 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span className="text-[11px] font-medium">Loading price breakdown...</span>
        </div>
      ) : (
        <div className="p-2.5 space-y-2">
          {/* Breakdown Table */}
          <div className="bg-purple-50/40 rounded-lg p-2 space-y-1.5 border border-purple-100 text-[11px]">
            {/* Component Base Price */}
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium text-slate-700">
                {weightNum ? `${weightNum} ${units} ` : ""}Silver
                {rate && (
                  <span className="text-[10px] text-purple-700 font-semibold ml-1">
                    (@₹{rate}/gm)
                  </span>
                )}
              </span>
              <span className="font-bold text-slate-900">
                ₹{silverItemPrice.toFixed(2)}
              </span>
            </div>

            {/* Making Charges (₹0) */}
            <div className="flex justify-between items-center text-slate-600">
              <span>Making Charges</span>
              <span className="font-semibold text-emerald-700">₹0</span>
            </div>

            {/* GST */}
            <div className="flex justify-between items-center text-slate-600">
              <span>GST ({gstPercent}%)</span>
              <span className="font-bold text-slate-700 line-through decoration-red-500 decoration-[1.5px]">
                ₹{silverGstAmount.toFixed(2)}
              </span>
            </div>

            {/* Subtotal Total M.R.P. */}
            <div className="flex justify-between items-center border-t border-purple-200/70 pt-1.5">
              <span className="font-bold text-slate-900">
                Total M.R.P.
              </span>
              <span className="font-bold text-red-600 line-through">
                ₹{silverTotalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* GST & Making Charges on Us */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-emerald-900">
                  GST & Making Charges on Us 🎉
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">
                  100% paid by Askoxy.ai
                </div>
              </div>
            </div>
            <div className="text-right font-extrabold text-xs text-emerald-700">
              -₹{silverDiscount.toFixed(2)}
            </div>
          </div>

          {/* Grand Total Footer */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-900 text-[11px]">
                Final Payable Amount
              </div>
              <div className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                You save ₹{silverDiscount.toFixed(2)}!
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-purple-800 leading-none">
                ₹{grandTotal}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer tagline */}
      <div className="bg-slate-50 px-2 py-1 text-center text-[9px] text-purple-800 border-t border-purple-100 font-medium">
        ✨ Zero Making Charges & 100% GST paid by Askoxy.ai
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger={["hover", "click"]}
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
      arrow={false}
      autoAdjustOverflow={true}
      overlayInnerStyle={{
        padding: 0,
        borderRadius: "12px",
        background: "transparent",
        boxShadow:
          "0 15px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 8px -5px rgba(0, 0, 0, 0.06)",
        maxWidth: "calc(100vw - 24px)",
      }}
    >
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs hover:shadow-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleOpenChange(!open);
        }}
        onMouseEnter={() => {
          if (!breakdown && !loading) {
            fetchBreakdown();
          }
        }}
      >
        <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
        <span>View Offer</span>
      </button>
    </Popover>
  );
};

export default SilverOfferTooltip;
