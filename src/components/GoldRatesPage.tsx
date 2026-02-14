// import React, { useEffect, useMemo, useState, useRef } from "react";
// import axios from "axios";

// const BASE_URL = "https://meta.oxyloans.com/api";
// const REFRESH_MS = 300000; // 5 minutes

// interface GoldRate {
//   id: string;
//   companyName: string;
//   rate22kt: number | null;
//   rate24kt: number | null;
//   silverprice: number | null;
//   updatedTime: number;
// }

// const safeNumber = (v: number | null | undefined) =>
//   typeof v === "number" && Number.isFinite(v) ? v : null;

// const calcChange = (current: number | null, previous: number | null) => {
//   const c = safeNumber(current);
//   const p = safeNumber(previous);
//   if (c === null || p === null || p === 0) return null;

//   const diff = c - p;
//   const pct = (diff / p) * 100;
//   return { diff, pct };
// };

// const formatCurrency = (price: number | null) => {
//   if (price === null || price === undefined) return "—";
//   return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
// };

// const formatCurrency2 = (price: number | null) => {
//   if (price === null || price === undefined) return "—";
//   return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// };

// const formatDiff = (diff: number) => {
//   const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
//   const abs = Math.abs(diff);
//   return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
// };

// const formatPct = (pct: number) => {
//   const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
//   const abs = Math.abs(pct);
//   return `${sign}${abs.toFixed(2)}%`;
// };

// const avg = (nums: Array<number | null>) => {
//   const valid = nums.filter(
//     (n): n is number => typeof n === "number" && Number.isFinite(n),
//   );
//   if (!valid.length) return null;
//   const sum = valid.reduce((a, b) => a + b, 0);
//   return sum / valid.length;
// };

// const GoldRatesPage: React.FC = () => {
//   const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
//   const [oneHourAgoRates, setOneHourAgoRates] = useState<GoldRate[] | null>(
//     null,
//   );
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
//   const [selectedVendorId, setSelectedVendorId] = useState<string>("average"); // "average" or vendor id

//   const lastFetchTimeRef = useRef<number>(Date.now());

//   const fetchGoldRates = async (manual = false) => {
//     manual ? setRefreshing(true) : setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(
//         `${BASE_URL}/product-service/all-different-gold-rates`,
//       );
//       const list: GoldRate[] = Array.isArray(res.data) ? res.data : [];

//       const now = Date.now();
//       const minutesSinceLast = (now - lastFetchTimeRef.current) / 60000;

//       if (minutesSinceLast >= 50 && goldRates.length > 0) {
//         setOneHourAgoRates([...goldRates]);
//       }

//       setGoldRates(list);
//       setLastUpdated(new Date());
//       lastFetchTimeRef.current = now;
//     } catch (e) {
//       setError("Failed to fetch gold rates. Please try again.");
//       console.error(e);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchGoldRates(false);
//     const interval = setInterval(() => fetchGoldRates(false), REFRESH_MS);
//     return () => clearInterval(interval);
//   }, []);

//   // Prepare vendor list for dropdown
//   const vendors = useMemo(() => {
//     const list = goldRates.map((r) => ({
//       id: r.id,
//       name: r.companyName,
//     }));
//     return [{ id: "average", name: "Average of All Vendors" }, ...list];
//   }, [goldRates]);

//   // Get selected rates (either one vendor or average)
//   const selectedRates = useMemo(() => {
//     if (selectedVendorId === "average" || !selectedVendorId) {
//       return goldRates;
//     }
//     const found = goldRates.find((r) => r.id === selectedVendorId);
//     return found ? [found] : [];
//   }, [goldRates, selectedVendorId]);

//   const selectedOneHourAgo = useMemo(() => {
//     if (selectedVendorId === "average" || !selectedVendorId) {
//       return oneHourAgoRates;
//     }
//     const found = oneHourAgoRates?.find((r) => r.id === selectedVendorId);
//     return found ? [found] : null;
//   }, [oneHourAgoRates, selectedVendorId]);

//   // Headline calculation based on selected view
//   const headline = useMemo(() => {
//     const today22 = avg(selectedRates.map((r) => r.rate22kt));
//     const today24 = avg(selectedRates.map((r) => r.rate24kt));
//     const todaySilver = avg(selectedRates.map((r) => r.silverprice));

//     let prev22 = null;
//     let prev24 = null;
//     let prevSilver = null;

//     if (selectedOneHourAgo && selectedOneHourAgo.length > 0) {
//       prev22 = avg(selectedOneHourAgo.map((r) => r.rate22kt));
//       prev24 = avg(selectedOneHourAgo.map((r) => r.rate24kt));
//       prevSilver = avg(selectedOneHourAgo.map((r) => r.silverprice));
//     }

//     return {
//       today22,
//       today24,
//       todaySilver,
//       ch22: calcChange(today22, prev22),
//       ch24: calcChange(today24, prev24),
//       chSilver: calcChange(todaySilver, prevSilver),
//     };
//   }, [selectedRates, selectedOneHourAgo]);

//   const formatTime = (timestamp: number) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const ChangeLine = ({
//     change,
//   }: {
//     change: { diff: number; pct: number } | null;
//   }) => {
//     if (!change) {
//       return <span className="text-xs text-gray-500">— (wait ~1h)</span>;
//     }

//     const up = change.diff > 0;
//     const down = change.diff < 0;

//     const color = up
//       ? "text-emerald-600"
//       : down
//         ? "text-red-500"
//         : "text-gray-600";
//     const arrow = up ? "▲" : down ? "▼" : "•";

//     return (
//       <div
//         className={`text-xs font-medium ${color} flex items-center gap-1 flex-wrap`}
//       >
//         <span>{formatDiff(change.diff)}</span>
//         <span>{arrow}</span>
//         <span className="opacity-80">({formatPct(change.pct)})</span>
//         <span className="text-gray-500 text-[10px]">from ~1h ago</span>
//       </div>
//     );
//   };

//   const StatCard = ({
//     title,
//     unit,
//     value,
//     change,
//   }: {
//     title: string;
//     unit: string;
//     value: number | null;
//     change: { diff: number; pct: number } | null;
//   }) => (
//     <div
//       className="rounded-2xl
//                 border border-amber-100
//                 bg-gradient-to-br from-white via-amber-50/60 to-slate-50
//                 shadow-sm hover:shadow-md hover:ring-1 hover:ring-amber-300
//                 transition-all duration-300
//                 p-4 sm:p-5"
//     >
//       <div className="flex items-baseline justify-between">
//         <div className="text-sm font-semibold bg-gradient-to-r from-purple-700 via-amber-500 to-gray-300 bg-clip-text text-transparent">
//           {title}{" "}
//           <span className="text-xs font-medium text-slate-500 ml-1">
//             {unit}
//           </span>
//         </div>
//         <div className="relative flex items-center gap-1">
//           <span className="text-[10px] font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
//             LIVE
//           </span>
//           <div className="relative">
//             <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
//             <div className="absolute inset-0 h-2 w-2 rounded-full bg-amber-300 animate-ping opacity-70" />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3 flex flex-col gap-1">
//         <div className="text-xl sm:text-2xl font-bold text-gray-900">
//           {value === null ? "—" : formatCurrency(value)}
//         </div>
//         <ChangeLine change={change} />
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="sticky top-0 z-30 backdrop-blur bg-white/75 border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-2xl bg-amber-100 ring-1 ring-amber-200 flex items-center justify-center">
//               <span className="text-amber-700 text-lg">₹</span>
//             </div>
//             <div>
//               <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
//                 ASKOXY.AI
//               </h1>
//               <p className="text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-yellow-400 via-gray-300 via-amber-500 to-slate-400 bg-clip-text text-transparent">
//                 Gold & Silver Rates
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             {/* <select
//               value={selectedVendorId}
//               onChange={(e) => setSelectedVendorId(e.target.value)}
//               className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
//             >
//               {vendors.map((v) => (
//                 <option key={v.id} value={v.id}>
//                   {v.name}
//                 </option>
//               ))}
//             </select> */}

//             <button
//               onClick={() => fetchGoldRates(true)}
//               disabled={refreshing}
//               className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-700 to-amber-500 text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.97] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {refreshing ? "Refreshing..." : "Refresh"}
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from-slate-50 via-white to-amber-50/40">
//         {error && (
//           <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 mb-6">
//             <div className="flex items-start gap-3">
//               <svg
//                 className="w-5 h-5 text-red-500 mt-0.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <div className="flex-1">
//                 <p className="text-red-800 font-medium text-sm">{error}</p>
//                 <button
//                   onClick={() => fetchGoldRates(true)}
//                   className="mt-2 text-red-700 hover:text-red-900 text-sm underline"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           <StatCard
//             title="24K Gold"
//             unit="/g"
//             value={headline.today24}
//             change={headline.ch24}
//           />
//           <StatCard
//             title="22K Gold"
//             unit="/g"
//             value={headline.today22}
//             change={headline.ch22}
//           />
//           <StatCard
//             title="Silver"
//             unit="/kg"
//             value={headline.todaySilver}
//             change={headline.chSilver}
//           />
//         </div> */}

//         {loading && goldRates.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-600 rounded-full animate-spin mb-4" />
//             <p className="text-gray-700 font-medium">Loading rates…</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop table */}
//             <div className="hidden lg:block bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
//                         Jewellery Brand Name
//                       </th>
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
//                         22K Gold
//                       </th>
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
//                         24K Gold
//                       </th>
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
//                         Silver
//                       </th>
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
//                         Updated
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {goldRates.map((rate) => (
//                       <tr
//                         key={rate.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
//                               {rate.companyName?.charAt(0) || "?"}
//                             </div>
//                             <span className="font-medium text-gray-900">
//                               {rate.companyName}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-semibold text-gray-900">
//                               {formatCurrency2(rate.rate22kt)}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               per gram
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-semibold text-gray-900">
//                               {formatCurrency2(rate.rate24kt)}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               per gram
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-semibold text-gray-900">
//                               {formatCurrency2(rate.silverprice)}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               per kg
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm text-gray-600">
//                             {formatTime(rate.updatedTime)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile cards */}
//             <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//               {goldRates.map((rate) => (
//                 <div
//                   key={rate.id}
//                   className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
//                 >
//                   <div className="bg-gradient-to-r from-slate-50 to-amber-50 px-4 py-3 border-b border-slate-200">
//                     <div className="flex items-center gap-2">
//                       <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-semibold">
//                         {rate.companyName?.charAt(0) || "?"}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 text-sm truncate">
//                           {rate.companyName}
//                         </h3>
//                         <p className="text-xs text-gray-500 truncate">
//                           Updated: {formatTime(rate.updatedTime)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-4 space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">22K Gold</span>
//                       <div className="text-right">
//                         <div className="font-semibold text-gray-900">
//                           {formatCurrency2(rate.rate22kt)}
//                         </div>
//                         <div className="text-xs text-gray-500">/gram</div>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">24K Gold</span>
//                       <div className="text-right">
//                         <div className="font-semibold text-gray-900">
//                           {formatCurrency2(rate.rate24kt)}
//                         </div>
//                         <div className="text-xs text-gray-500">/gram</div>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Silver</span>
//                       <div className="text-right">
//                         <div className="font-semibold text-gray-900">
//                           {formatCurrency2(rate.silverprice)}
//                         </div>
//                         <div className="text-xs text-gray-500">/kg</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {!loading && goldRates.length === 0 && (
//               <div className="text-center py-16">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   No Rates Available
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Unable to fetch gold rates at this moment
//                 </p>
//                 <button
//                   onClick={() => fetchGoldRates(true)}
//                   className="bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-sm"
//                 >
//                   Retry
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <footer className="bg-gradient-to-r from-slate-50 via-white to-amber-50/40 border-t border-slate-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
//           <p
//             className="text-sm font-semibold tracking-wide
//               bg-gradient-to-r
//               from-purple-900
//               via-amber-800
//               via-slate-500
//               to-yellow-500
//               bg-clip-text text-transparent"
//           >
//             © {new Date().getFullYear()} ASKOXY.AI — Gold & Silver Rates
//           </p>
//           <p className="text-xs text-slate-600 mt-2">
//             Prices update regularly. Please verify with jewellers before
//             transactions.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default GoldRatesPage;

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const BASE_URL = "https://meta.oxyloans.com/api";
const REFRESH_MS = 300000; // 5 minutes

interface GoldRate {
  id: string;
  companyName: string;
  rate22kt: number | null;
  rate24kt: number | null;
  silverprice: number | null;
  updatedTime: number;
}

const safeNumber = (v: number | null | undefined) =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const calcChange = (current: number | null, previous: number | null) => {
  const c = safeNumber(current);
  const p = safeNumber(previous);
  if (c === null || p === null || p === 0) return null;

  const diff = c - p;
  const pct = (diff / p) * 100;
  return { diff, pct };
};

const formatCurrency2 = (price: number | null) => {
  if (price === null || price === undefined) return "—";
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDiff = (diff: number) => {
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  const abs = Math.abs(diff);
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const formatPct = (pct: number) => {
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  const abs = Math.abs(pct);
  return `${sign}${abs.toFixed(2)}%`;
};

const avg = (nums: Array<number | null>) => {
  const valid = nums.filter(
    (n): n is number => typeof n === "number" && Number.isFinite(n),
  );
  if (!valid.length) return null;
  const sum = valid.reduce((a, b) => a + b, 0);
  return sum / valid.length;
};

const GoldRatesPage: React.FC = () => {
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [oneHourAgoRates, setOneHourAgoRates] = useState<GoldRate[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const lastFetchTimeRef = useRef<number>(Date.now());

  const fetchGoldRates = async (manual = false) => {
    manual ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${BASE_URL}/product-service/all-different-gold-rates`,
      );
      const list: GoldRate[] = Array.isArray(res.data) ? res.data : [];

      const now = Date.now();
      const minutesSinceLast = (now - lastFetchTimeRef.current) / 60000;

      if (minutesSinceLast >= 50 && goldRates.length > 0) {
        setOneHourAgoRates([...goldRates]);
      }

      setGoldRates(list);
      setLastUpdated(new Date());
      lastFetchTimeRef.current = now;
    } catch (e) {
      setError("Failed to fetch gold rates. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoldRates(false);
    const interval = setInterval(() => fetchGoldRates(false), REFRESH_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headline = useMemo(() => {
    const today22 = avg(goldRates.map((r) => r.rate22kt));
    const today24 = avg(goldRates.map((r) => r.rate24kt));
    const todaySilver = avg(goldRates.map((r) => r.silverprice));

    let prev22 = null;
    let prev24 = null;
    let prevSilver = null;

    if (oneHourAgoRates && oneHourAgoRates.length > 0) {
      prev22 = avg(oneHourAgoRates.map((r) => r.rate22kt));
      prev24 = avg(oneHourAgoRates.map((r) => r.rate24kt));
      prevSilver = avg(oneHourAgoRates.map((r) => r.silverprice));
    }

    return {
      today22,
      today24,
      todaySilver,
      ch22: calcChange(today22, prev22),
      ch24: calcChange(today24, prev24),
      chSilver: calcChange(todaySilver, prevSilver),
    };
  }, [goldRates, oneHourAgoRates]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ChangeLine = ({
    change,
  }: {
    change: { diff: number; pct: number } | null;
  }) => {
    if (!change) {
      return <span className="text-xs text-gray-500">— (wait ~1h)</span>;
    }

    const up = change.diff > 0;
    const down = change.diff < 0;

    const color = up
      ? "text-emerald-600"
      : down
        ? "text-red-500"
        : "text-gray-600";
    const arrow = up ? "▲" : down ? "▼" : "•";

    return (
      <div
        className={`text-xs font-medium ${color} flex items-center gap-1 flex-wrap`}
      >
        <span>{formatDiff(change.diff)}</span>
        <span>{arrow}</span>
        <span className="opacity-80">({formatPct(change.pct)})</span>
        <span className="text-gray-500 text-[10px]">from ~1h ago</span>
      </div>
    );
  };

  const StatCard = ({
    title,
    unit,
    value,
    change,
  }: {
    title: string;
    unit: string;
    value: number | null;
    change: { diff: number; pct: number } | null;
  }) => (
    <div
      className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white via-amber-50/60 to-slate-50
                 shadow-sm hover:shadow-md hover:ring-1 hover:ring-amber-300 transition-all duration-300
                 p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold bg-gradient-to-r from-purple-700 via-amber-500 to-gray-300 bg-clip-text text-transparent truncate">
            {title}{" "}
            <span className="text-xs font-medium text-slate-500 ml-1">
              {unit}
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
            LIVE
          </span>
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-amber-300 animate-ping opacity-70" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="text-xl sm:text-2xl font-bold text-gray-900">
          {value === null
            ? "—"
            : `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
        </div>
        <ChangeLine change={change} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-2xl bg-amber-100 ring-1 ring-amber-200 flex items-center justify-center shrink-0">
                <span className="text-amber-700 text-lg">₹</span>
              </div>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-yellow-500 to-amber-400 bg-clip-text text-transparent truncate">
                  ASKOXY.AI
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-yellow-400 via-gray-300 via-amber-500 to-slate-400 bg-clip-text text-transparent truncate">
                  Gold & Silver Rates
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="shrink-0">
              <button
                onClick={() => fetchGoldRates(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                         bg-gradient-to-r from-purple-700 to-amber-500 text-white shadow-lg hover:shadow-xl hover:brightness-110
                         active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from-slate-50 via-white to-amber-50/40">
        {error && (
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
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
              <div className="flex-1">
                <p className="text-red-800 font-medium text-sm">{error}</p>
                <button
                  onClick={() => fetchGoldRates(true)}
                  className="mt-2 text-red-700 hover:text-red-900 text-sm underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Optional headline cards (enable if you want) */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard title="24K Gold" unit="/g" value={headline.today24} change={headline.ch24} />
          <StatCard title="22K Gold" unit="/g" value={headline.today22} change={headline.ch22} />
          <StatCard title="Silver" unit="/kg" value={headline.todaySilver} change={headline.chSilver} />
        </div> */}

        {loading && goldRates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-700 font-medium">Loading rates…</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="min-w-[920px] w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                        Jewellery Brand Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                        22K Gold
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                        24K Gold
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                        Silver
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {goldRates.map((rate) => (
                      <tr
                        key={rate.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                              {rate.companyName?.charAt(0) || "?"}
                            </div>
                            <span className="font-medium text-gray-900">
                              {rate.companyName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency2(rate.rate22kt)}
                            </span>
                            <span className="text-xs text-gray-500">
                              per gram
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency2(rate.rate24kt)}
                            </span>
                            <span className="text-xs text-gray-500">
                              per gram
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency2(rate.silverprice)}
                            </span>
                            <span className="text-xs text-gray-500">
                              per kg
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatTime(rate.updatedTime)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goldRates.map((rate) => (
                <div
                  key={rate.id}
                  className="bg-white/85 backdrop-blur rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-slate-50 to-amber-50 px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-semibold shrink-0">
                        {rate.companyName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {rate.companyName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          Updated: {formatTime(rate.updatedTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-600">22K Gold</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency2(rate.rate22kt)}
                        </div>
                        <div className="text-xs text-gray-500">/gram</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-600">24K Gold</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency2(rate.rate24kt)}
                        </div>
                        <div className="text-xs text-gray-500">/gram</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-600">Silver</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency2(rate.silverprice)}
                        </div>
                        <div className="text-xs text-gray-500">/kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && goldRates.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Rates Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Unable to fetch gold rates at this moment
                </p>
                <button
                  onClick={() => fetchGoldRates(true)}
                  className="bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gradient-to-r from-slate-50 via-white to-amber-50/40 border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm font-semibold tracking-wide bg-gradient-to-r from-purple-900 via-amber-800 via-slate-500 to-yellow-500 bg-clip-text text-transparent">
            © {new Date().getFullYear()} ASKOXY.AI — Gold & Silver Rates
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Prices update regularly. Please verify with jewellers before
            transactions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GoldRatesPage;
