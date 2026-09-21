import React, { useEffect, useState } from "react";
import axios from "axios";
import { Gem, Loader2, Tag } from "lucide-react";
import BASE_URL from "../Config";

interface GoldRateBreakdown {
  gstAmount: number;
  totalAmount: number;
  itemPrice: number;
  gstPercentage: number;
  itemAmount: number;
  makingAmount: number;
  makingCharges: number;
  discountAmount?: number;
}

interface SilverPriceBreakdownProps {
  itemId: string;
  weight?: string | number;
  units?: string;
  className?: string;
}

export const SilverPriceBreakdown: React.FC<SilverPriceBreakdownProps> = ({
  itemId,
  weight,
  units = "",
  className = "",
}) => {
  const [breakdown, setBreakdown] = useState<GoldRateBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/product-service/getAllGoldAndSilverRates?itemId=${itemId}`,
        );
        if (isMounted) {
          setBreakdown(res.data);
        }
      } catch (err) {
        console.error("Error fetching silver rates:", err);
        if (isMounted) {
          setBreakdown(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (itemId) {
      fetchRates();
    }

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  const rawWeight = weight;
  const weightNum =
    rawWeight !== undefined && rawWeight !== null
      ? parseFloat(String(rawWeight).replace(/[^0-9.]/g, ""))
      : null;
  const weightUnit = units || "";

  const silverItemPrice = breakdown?.itemPrice ?? 0;
  const silverGstAmount = breakdown?.gstAmount ?? 0;
  const silverTotalAmount = breakdown?.totalAmount ?? 0;
  const gstPercent = breakdown?.gstPercentage ?? 0;
  const silverDiscount =
    breakdown?.discountAmount !== undefined
      ? breakdown.discountAmount
      : silverGstAmount;
  const silverGrandTotal = silverTotalAmount - silverDiscount;

  const rate =
    silverItemPrice && weightNum
      ? (silverItemPrice / weightNum).toFixed(2)
      : null;

  return (
    <div
      className={`mt-3 w-full rounded-2xl overflow-hidden shadow-md border border-amber-100 ${className}`}
    >
      <style>{`
.silver-invoice-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
}

.silver-invoice-table thead th {
  padding: 10px 14px; 
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #8a8a8a;
  background: #ffffff;
  border-bottom: 1px solid #ececec;
}

.silver-invoice-table thead th:nth-child(2),
.silver-invoice-table thead th:nth-child(3) {
  text-align: center;
}

.silver-invoice-table thead th:last-child {
  text-align: right;
}

.silver-invoice-table tbody td {
  padding: 11px 14px;  
  font-size: 13px; 
  color: #333333;
  background: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  vertical-align: middle;
}

.silver-invoice-table tbody tr:last-child td {
  border-bottom: none;
}

.silver-invoice-table tbody td:first-child {
  font-weight: 600;
  color: #1a1a1a;
}

.silver-invoice-table tbody td:nth-child(2),
.silver-invoice-table tbody td:nth-child(3) {
  text-align: center;
  color: #555555;
  font-size: 13px;
  font-weight: 400;
}

.silver-invoice-table tbody td:last-child {
  text-align: right;
  font-weight: 700;
  color: #1a1a1a;
  font-size: 14px;
  white-space: nowrap;
}

.silver-invoice-table tbody tr:hover td {
  background: #fafafa;
}

.silver-invoice-table tbody tr.subtotal-line td {
  background: #f7f7f7;
  font-weight: 600;
  color: #1a1a1a;
}

.silver-invoice-table tbody tr.discount-line td {
  color: #b0793a;
  font-weight: 600;
  font-size: 13px;
}

.silver-invoice-table tbody tr.discount-line td:last-child {
  color: #c07d2e;
  font-size: 14px;
}

.silver-invoice-table tfoot td {
  padding: 14px 14px;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  background: #fdf6e9;
  border-top: 1px solid #f1e2bd;
}

.silver-invoice-table tfoot td:last-child {
  text-align: right;
  font-size: 17px;
  font-weight: 800;
  color: #b8752f;
  white-space: nowrap;
}
`}</style>

      {/* HEADER */}
      <div className="relative px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-300 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Gem className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-neutral-900 text-sm leading-tight">
            Price Breakup
          </h4>
          <span className="text-[11px] text-neutral-500 font-medium">
            Silver{weightNum ? ` · ${weightNum}${weightUnit}` : ""}
          </span>
        </div>
      </div>

      {/* BODY */}
      {loading ? (
        <div className="flex items-center text-xs text-gray-500 p-4 bg-white">
          <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 text-purple-600" />
          Loading price breakdown...
        </div>
      ) : breakdown ? (
        <div className="p-2 sm:p-3 bg-white overflow-x-auto">
          <table className="silver-invoice-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Rate</th>
                <th>Weight</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {weightNum ? `${weightNum}${weightUnit} ` : ""}Silver
                </td>
                <td>{rate ? `₹${rate}` : "-"}</td>
                <td>{weightNum ? `${weightNum}${weightUnit}` : "-"}</td>
                <td>₹{silverItemPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td>GST ({gstPercent}%)</td>
                <td>-</td>
                <td>-</td>
                <td>₹{silverGstAmount.toFixed(2)}</td>
              </tr>
              <tr className="subtotal-line">
                <td>Total</td>
                <td>-</td>
                <td>-</td>
                <td>₹{silverTotalAmount.toFixed(2)}</td>
              </tr>
              <tr className="discount-line">
                <td>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    Discount
                  </span>
                </td>
                <td>-</td>
                <td>-</td>
                <td>-₹{silverDiscount.toFixed(2)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Grand Total</td>
                <td>₹{silverGrandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-xs text-gray-500 p-4 bg-white">
          Unable to load price breakdown.
        </p>
      )}
    </div>
  );
};

export default SilverPriceBreakdown;
