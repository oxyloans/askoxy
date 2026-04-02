import { GenerationResult } from "../type/types";

const CAPABILITIES = [
  { icon: "🏦", label: "Core Banking",     sub: "Accounts · Ledger · Txns" },
  { icon: "💳", label: "FinTech Payments", sub: "UPI · Wallets · Gateways" },
  { icon: "🔄", label: "P2P Lending",      sub: "Credit scoring · Disburse" },
  { icon: "🛍️", label: "E-Commerce",       sub: "Shop · Checkout · Orders" },
  { icon: "🪪", label: "KYC / AML",        sub: "Identity · Verification" },
  { icon: "🛡️", label: "Insurance",        sub: "Policy · Claims · Settle" },
  { icon: "📈", label: "Wealth Mgmt",      sub: "Portfolio · Trading · SIP" },
  { icon: "🪙", label: "Crypto / DeFi",    sub: "Web3 · Exchange · Contracts" },
  { icon: "🏠", label: "NBFC / Lending",   sub: "Loans · EMI · Compliance" },
  { icon: "📊", label: "Analytics",        sub: "Dashboards · Reports · BI" },
];

interface SidebarProps {
  running: boolean;
  result: GenerationResult | null;
  codeViewResult: GenerationResult | null;
}

export function Sidebar({ running, result, codeViewResult }: SidebarProps) {
  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col overflow-hidden"
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #EAECF2",
        boxShadow: "1px 0 0 0 #F0F2F8",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-3 shrink-0"
        style={{ borderBottom: "1px solid #F0F2F8" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{
            background: "linear-gradient(135deg, #3B6FFF 0%, #7C3AED 100%)",
            boxShadow: "0 4px 12px rgba(59,111,255,0.28)",
          }}
        >
          F
        </div>
        <div>
          <p className="text-[13px] font-bold leading-none tracking-tight" style={{ color: "#0D1117" }}>
            FINVIBE
          </p>
          <p className="text-[9px] mt-1 uppercase tracking-[0.18em] font-semibold" style={{ color: "#A0AABF" }}>
            App Builder
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-2 shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "#3B6FFF" }}>
          Capabilities
        </p>
      </div>

      {/* Capability list */}
      <div
        className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.label}
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-default"
            style={{ color: "#0D1117" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F4F6FF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <span className="text-sm leading-none shrink-0">{cap.icon}</span>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold leading-none truncate" style={{ color: "#1A2035" }}>
                {cap.label}
              </p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: "#8A96AD" }}>
                {cap.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status pill */}
      <div className="px-4 pb-5 shrink-0">
        <div
          className="rounded-xl px-3.5 py-2.5 flex items-center justify-between"
          style={{ background: "#F6F8FF", border: "1px solid #E4E8F8" }}
        >
          <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: "#8A96AD" }}>
            Status
          </p>
          <div className="flex items-center gap-1.5">
            {codeViewResult ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span className="text-[11px] font-semibold text-violet-600">Code View</span>
              </>
            ) : running ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-semibold text-blue-600">Building…</span>
              </>
            ) : result ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-600">Complete</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C5CDDF" }} />
                <span className="text-[11px] font-semibold" style={{ color: "#8A96AD" }}>Ready</span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}