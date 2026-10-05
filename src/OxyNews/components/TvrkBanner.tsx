export default function TvrkBanner({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://tvradhakrishna.com/"
      target="_blank"
      rel="noreferrer"
      className={`shrink-0 inline-flex flex-col items-center rounded-xl overflow-hidden transition-all hover:shadow-lg ${className}`}
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)",
        border: "1px solid #bae6fd",
        boxShadow: "0 2px 12px rgba(14,165,233,0.1)",
      }}
    >
      <div
        className="w-full flex items-center justify-center py-0.5 px-4"
        style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1, #a855f7)" }}
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">Sponsored by</span>
      </div>
      <div className="flex flex-col items-center px-4 py-2 gap-1">
        <div
          className="rounded-lg overflow-hidden bg-white"
          style={{ border: "1px solid #e0f2fe", padding: "3px 8px" }}
        >
          <img
            src="https://i.ibb.co/Rw9zb11/tvrklogo.png"
            alt="TVRADHAKRISHNA.COM"
            className="h-6 w-auto object-contain"
          />
        </div>
        <p
          className="text-xs font-black tracking-tight leading-snug text-center whitespace-nowrap"
          style={{ color: "#0f172a" }}
        >
          Every Journey.{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            One Partner.
          </span>
        </p>
      </div>
    </a>
  );
}
