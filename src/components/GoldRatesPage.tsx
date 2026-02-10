import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../Config";

interface GoldRate {
  id: string;
  companyName: string;
  rate22kt: number | null;
  rate24kt: number | null;
  silverprice: number | null;
  updatedTime: number;
}

const GoldRatesPage: React.FC = () => {
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchGoldRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/all-different-gold-rates`,
      );
      setGoldRates(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch gold rates. Please try again.");
      console.error("Error fetching gold rates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldRates();
  }, []);

  const formatPrice = (price: number | null): string => {
    if (price === null) return "---";
    return `₹${price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 via-white-50 to-white-50 p-3 sm:p-16 md:p-24 lg:p-40">
      <div className="max-w-5xl mx-auto">
      
     

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800 text-xs sm:text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && goldRates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3 sm:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Loading rates...
            </p>
          </div>
        ) : (
          <>
            {/* ✅ TABLE VIEW (md and above) */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* horizontal scroll safety */}
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[900px] w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                      <tr>
                        <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                          Company
                        </th>
                        <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                          22K Gold (per gram)
                        </th>
                        <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                          24K Gold (per gram)
                        </th>
                        <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                          Silver (per kg)
                        </th>
                        <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                          Updated
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {goldRates.map((rate, idx) => (
                        <tr
                          key={rate.id}
                          className={`border-b ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                          } hover:bg-blue-50 transition`}
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900">
                              {rate.companyName}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                22K
                              </span>
                              <span className="font-bold text-amber-700">
                                {formatPrice(rate.rate22kt)}
                              </span>
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                24K
                              </span>
                              <span className="font-bold text-orange-700">
                                {formatPrice(rate.rate24kt)}
                              </span>
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                Silver
                              </span>
                              <span className="font-bold text-gray-700">
                                {formatPrice(rate.silverprice)}
                              </span>
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-700">
                              {formatTime(rate.updatedTime)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ✅ MOBILE VIEW (cards) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {goldRates.map((rate) => (
                <div
                  key={rate.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-sm font-bold text-gray-800">
                        {rate.companyName}
                      </h2>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm w-fit">
                        {formatTime(rate.updatedTime)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-white">
                          22K
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          Gold (per gram)
                        </span>
                      </div>
                      <span className="font-extrabold text-amber-700">
                        {formatPrice(rate.rate22kt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-400 text-white">
                          24K
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          Gold (per gram)
                        </span>
                      </div>
                      <span className="font-extrabold text-orange-700">
                        {formatPrice(rate.rate24kt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-400 text-white">
                          Silver
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          (per kg)
                        </span>
                      </div>
                      <span className="font-extrabold text-gray-700">
                        {formatPrice(rate.silverprice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          
          </>
        )}
      </div>
    </div>
  );
};

export default GoldRatesPage;
