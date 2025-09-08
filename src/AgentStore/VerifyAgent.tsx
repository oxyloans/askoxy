import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

/**
 * VerifyIdentity.tsx
 * - Two-card UI (AI Twin / Enabler style) for identity verification
 * - Option A: Indian Citizen -> PAN Verification
 * - Option B: Outside India -> Govt ID Upload
 * - Tailwind only, no external libs
 */

type Mode = "PAN" | "NON_INDIA";

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/; // e.g., ABCDE1234F
const maxFileSizeMB = 5;
const allowedMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export default function VerifyIdentity() {
  const [mode, setMode] = useState<Mode>("PAN");

  // PAN form state
  const [pan, setPan] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [consentIN, setConsentIN] = useState(false);
  const navigate = useNavigate();

  // Non-India form state
  const [country, setCountry] = useState("");
  const [idType, setIdType] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [consentGlobal, setConsentGlobal] = useState(false);

  // UI feedback
  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const today = useMemo(() => new Date(), []);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayISO = `${yyyy}-${mm}-${dd}`;

  function resetFeedback() {
    setErrors([]);
    setSuccessMsg(null);
  }

  function validatePANForm() {
    const e: string[] = [];
    const valPAN = pan.toUpperCase().replace(/\s+/g, "");
    if (!panRegex.test(valPAN)) e.push("Enter a valid PAN (e.g., ABCDE1234F).");
    if (!fullName.trim() || fullName.trim().length < 3)
      e.push("Enter your full name (min 3 characters).");
    if (!dob) e.push("Select your date of birth.");
    else {
      const d = new Date(dob);
      if (isNaN(d.getTime())) e.push("DOB is invalid.");
      if (d > today) e.push("DOB cannot be in the future.");
      if (d.getFullYear() < 1900) e.push("DOB year must be ≥ 1900.");
    }
    if (!consentIN) e.push("You must provide consent to verify your PAN.");
    return e;
  }

  function validateFile(f: File | null, label: string) {
    if (!f) return `${label} is required.`;
    if (!allowedMime.includes(f.type))
      return `${label}: Only PNG/JPEG/WebP/PDF are allowed.`;
    if (f.size > maxFileSizeMB * 1024 * 1024)
      return `${label}: File must be ≤ ${maxFileSizeMB} MB.`;
    return null;
  }

  function validateGlobalForm() {
    const e: string[] = [];
    if (!country) e.push("Select your country.");
    if (!idType) e.push("Choose an ID type.");
    const f1 = validateFile(frontFile, "Front side / Single file");
    if (f1) e.push(f1);
    // Back file optional unless ID has back; we’ll not force here.
    if (!consentGlobal) e.push("You must provide consent to validate your ID.");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetFeedback();

    const formErrors =
      mode === "PAN" ? validatePANForm() : validateGlobalForm();

    if (formErrors.length) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900)); // fake latency
      setSuccessMsg(
        mode === "PAN"
          ? "PAN submitted for verification. You’ll be notified shortly."
          : "ID uploaded for validation. We’ll notify you after checks."
      );

      // ✅ Navigate after short delay
      setTimeout(() => {
        navigate("/bharat-agent");
      }, 1200);
    } catch (err) {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1C0F2E] via-[#1a0f2b] to-[#0F0820] text-white">
      {/* Top header */}
      <header className="mx-auto max-w-6xl px-4 pt-10">
        <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-tight">
          Verify Your Identity
        </h1>
        <p className="mt-3 text-center text-violet-200">
          Choose the correct option and complete a quick verification to keep
          your earnings secure.
        </p>
      </header>

      {/* Cards */}
      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-2">
        {/* Indian Citizen / PAN */}
        <div
          className={`rounded-2xl border ${
            mode === "PAN" ? "border-amber-400" : "border-white/10"
          } bg-white/5 backdrop-blur-sm p-6 md:p-8 shadow-xl hover:shadow-2xl transition`}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30">
              {/* Badge Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-purple-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z" />
              </svg>
            </span>
            <h2 className="text-xl font-semibold">Indian Citizen</h2>
          </div>
          <p className="mt-3 text-sm text-violet-200">
            Verify with your <span className="font-semibold">PAN</span>. Fast,
            compliant, and secure.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-violet-200">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Ideal for residents filing taxes in India.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Name &amp; DOB must match official records.
            </li>
          </ul>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setMode("PAN")}
              className={`w-full md:w-auto rounded-xl px-5 py-2.5 font-medium shadow-md transition
                bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600
                ${mode === "PAN" ? "" : "opacity-90"}`}
            >
              Continue with PAN
            </button>
          </div>
        </div>

        {/* Outside India / Govt ID */}
        <div
          className={`rounded-2xl border ${
            mode === "NON_INDIA" ? "border-amber-400" : "border-white/10"
          } bg-white/5 backdrop-blur-sm p-6 md:p-8 shadow-xl hover:shadow-2xl transition`}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/30">
              {/* Lightning Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M13 2L3 14h7l-1 8 12-14h-7l1-6z" />
              </svg>
            </span>
            <h2 className="text-xl font-semibold">Global Citizen</h2>
          </div>
          <p className="mt-3 text-sm text-violet-200">
            Upload a valid <span className="font-semibold">Government ID</span>{" "}
            (Passport, National ID, etc.).
          </p>
          <ul className="mt-4 space-y-2 text-sm text-violet-200">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Supported files: PDF/PNG/JPG/WebP (max {maxFileSizeMB} MB).
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Ensure your name & DOB are clearly visible.
            </li>
          </ul>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setMode("NON_INDIA")}
              className={`w-full md:w-auto rounded-xl px-5 py-2.5 font-medium shadow-md transition
                bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600
                ${mode === "NON_INDIA" ? "" : "opacity-90"}`}
            >
              Continue with Govt ID
            </button>
          </div>
        </div>
      </section>

      {/* Form Area */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-lg md:text-xl font-semibold">
              {mode === "PAN"
                ? "PAN Verification (India)"
                : "Government ID Validation (Outside India)"}
            </h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-violet-200">
              Step • Identity
            </span>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((er, i) => (
                  <li key={i}>{er}</li>
                ))}
              </ul>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "PAN" ? (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* PAN */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-violet-200 mb-1">
                      PAN
                    </label>
                    <input
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      maxLength={10}
                      value={pan}
                      onChange={(e) =>
                        setPan(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        )
                      }
                      placeholder="ABCDE1234F"
                      className="w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm shadow-sm 
                 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <p className="mt-1 text-xs text-violet-300">
                      Format: <span className="font-semibold">AAAAA9999A</span>
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-violet-200 mb-1">
                      Full Name (as per PAN)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm shadow-sm 
                 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-violet-200 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      max={todayISO}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm shadow-sm 
                 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="consentIN"
                    type="checkbox"
                    checked={consentIN}
                    onChange={(e) => setConsentIN(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10"
                  />
                  <label
                    htmlFor="consentIN"
                    className="text-sm text-violet-200"
                  >
                    I authorize the platform to validate my PAN details for KYC
                    and compliance.
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm text-violet-200 mb-1">
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter your country"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 outline-none placeholder:text-violet-300/60 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-violet-200 mb-1">
                      ID Type
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white text-black px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="" disabled hidden>
                        Select ID Type
                      </option>
                      <option value="Passport">Passport</option>
                      <option value="National ID">National ID</option>
                      <option value="Driver’s License">Driver’s License</option>
                      <option value="Residence Permit">Residence Permit</option>
                      <option value="Other Govt ID">Other Govt ID</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm text-violet-200 mb-1">
                      Optional: DOB
                    </label>
                    <input
                      type="date"
                      max={todayISO}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-violet-200 mb-1">
                      Front Side / Single File
                    </label>
                    <input
                      type="file"
                      accept={allowedMime.join(",")}
                      onChange={(e) =>
                        setFrontFile(e.target.files?.[0] ?? null)
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/10 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                    />
                    {frontFile && (
                      <p className="mt-1 text-xs text-violet-300/80">
                        {frontFile.name} •{" "}
                        {(frontFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-violet-200 mb-1">
                      Back Side (Optional)
                    </label>
                    <input
                      type="file"
                      accept={allowedMime.join(",")}
                      onChange={(e) => setBackFile(e.target.files?.[0] ?? null)}
                      className="w-full rounded-xl border border-white/10 bg-white/10 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                    />
                    {backFile && (
                      <p className="mt-1 text-xs text-violet-300/80">
                        {backFile.name} •{" "}
                        {(backFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="consentGlobal"
                    type="checkbox"
                    checked={consentGlobal}
                    onChange={(e) => setConsentGlobal(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10"
                  />
                  <label
                    htmlFor="consentGlobal"
                    className="text-sm text-violet-200"
                  >
                    I authorize the platform to validate my uploaded Government
                    ID for compliance.
                  </label>
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition
                   bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600
                   disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>Submit for Validation</>
                )}
              </button>
            </div>

            <p className="text-xs text-violet-300/70">
              Your documents are encrypted in transit and at rest. By
              continuing, you agree to our KYC &amp; compliance policy.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
