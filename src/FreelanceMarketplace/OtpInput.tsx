import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

const OTP_LENGTH = 6;

interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value = "",
  onChange,
  disabled = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  useEffect(() => {
    if (!disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [disabled]);

  const emitChange = (next: string[]) => {
    onChange?.(next.join("").replace(/\s/g, ""));
  };

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const next = [...digits.map((d) => (d === " " ? "" : d))];
    next[index] = char;
    emitChange(next);

    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const current = digits[index] === " " ? "" : digits[index];
      if (!current && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const next = [...digits.map((d) => (d === " " ? "" : d))];
        next[index - 1] = "";
        emitChange(next);
      } else {
        const next = [...digits.map((d) => (d === " " ? "" : d))];
        next[index] = "";
        emitChange(next);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = pasted.split("");
    while (next.length < OTP_LENGTH) next.push("");
    emitChange(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digits[index] === " " ? "" : digits[index]}
          aria-label={`OTP digit ${index + 1}`}
          className={`
            h-10 w-9 flex-shrink-0 rounded-xl border text-center text-base font-semibold
            text-slate-800 outline-none transition-all
            sm:h-11 sm:w-10 sm:text-lg
            ${
              disabled
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-300 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            }
          `}
          onChange={(e) => handleChange(index, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

export default OtpInput;
