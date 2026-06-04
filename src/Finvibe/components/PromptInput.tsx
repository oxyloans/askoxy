import { useState, KeyboardEvent } from "react";

interface Props {
  onSubmit: (prompt: string) => void;
  disabled: boolean;
  compact?: boolean;
}

export function PromptInput({ onSubmit, disabled, compact = false }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {};
  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {};

  /* ─── COMPACT MODE ─── */
  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "12px",
          background: "#FFFFFF",
          border: "1px solid #E4E8F4",
          boxShadow: "0 1px 4px rgba(13,17,23,.06)",
          width: "100%",
        }}
      >
        <i
          className="ti ti-lock"
          style={{ fontSize: "13px", color: "#E2534A", flexShrink: 0 }}
          aria-hidden="true"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          placeholder="This feature is disabled. Contact support@askoxy.ai to enable."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#0D1117",
            fontFamily: "inherit",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            color: "#E2534A",
            flexShrink: 0,
            fontWeight: 500,
          }}
        >
          Disabled
        </span>
      </div>
    );
  }

  /* ─── FULL MODE ─── */
  return (
    <>
      <style>{`
        @keyframes fv-spin { to { transform: rotate(360deg); } }
        .pi-disabled-placeholder::placeholder { color: #E2534A; font-weight: 400; }
      `}</style>

      <div
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #E4E8F4",
          borderRadius: "14px",
          padding: "10px 10px 8px 14px",
          boxShadow: "0 2px 10px rgba(13,17,40,.07)",
          transition: "border-color .2s, box-shadow .2s",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#3B6FFF";
          el.style.boxShadow =
            "0 0 0 4px rgba(59,111,255,.09), 0 2px 10px rgba(13,17,40,.07)";
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#E4E8F4";
          el.style.boxShadow = "0 2px 10px rgba(13,17,40,.07)";
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Prompt submission is disabled. Each prompt costs us $80–$100 USD."
          rows={1}
          className="pi-disabled-placeholder"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "13.5px",
            lineHeight: "1.55",
            color: "#0D1117",
            minHeight: "22px",
            maxHeight: "88px",
            overflowY: "auto",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 88) + "px";
          }}
        />

        {/* Toolbar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "13px", color: "#E2534A" }}>🔒</span>
            <span
              style={{ fontSize: "11.5px", color: "#E2534A", fontWeight: 400 }}
            >
              Contact support@askoxy.ai to enable
            </span>
          </div>
          <button
            disabled
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 16px",
              borderRadius: "9px",
              border: "none",
              background: "#F0F2F8",
              color: "#4B5563",
              fontWeight: 700,
              fontSize: "12.5px",
              cursor: "not-allowed",
              transition: "all .2s",
              letterSpacing: "-.01em",
              whiteSpace: "nowrap",
            }}
          >
            🚫 Disabled
          </button>
        </div>
      </div>
    </>
  );
}
