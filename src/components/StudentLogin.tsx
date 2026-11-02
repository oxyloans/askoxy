import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { store } from "../store";
import { setCredentials, updateAccessToken, updateRefreshToken } from "../store/authSlice";
import { setCustomerAccessToken, setRefreshToken } from "../utils/cookieUtils";

/**
 * Configure via VITE_STUDENT_AUTH_URL in environment or fallback to BASE_URL endpoint
 */
const AUTH_URL = `${BASE_URL}/user-service/studentRegistration`;

const DEFAULT_REDIRECT_PATH = "/main/viewjobdetails/default/ALL";
const WAIT_SECONDS = 30;

export type AuthResponse = {
  accessToken?: string | null;
  refreshToken?: string | null;
  userId?: string | null;
  mobileOtpSession?: string | null;
  mobileNumber?: string | null;
  errorMessage?: string | null;
  message?: string | null;
  statusCode?: number | string | null;
};

export type StudentLoginProps = {
  onLoginSuccess?: (result: AuthResponse) => void;
  redirectTo?: string;
};

type Stage = "mobile" | "otp";

async function requestAuth(
  body: Record<string, string>,
  signal?: AbortSignal
): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
      credentials: "omit",
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error("Unable to connect to the authentication server.");
  }

  const raw = await res.text();
  let data: AuthResponse = {};
  try {
    data = raw ? (JSON.parse(raw) as AuthResponse) : {};
  } catch {
    throw new Error(raw );
  }

  // If server returns error status or error message, pass the exact API message
  if (!res.ok || data.errorMessage || (data.statusCode != null && Number(data.statusCode) >= 400)) {
    throw new Error(data.message || data.errorMessage || `Request failed (${res.status}).`);
  }

  return data;
}

export default function StudentLogin({ onLoginSuccess, redirectTo }: StudentLoginProps) {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("mobile");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [session, setSession] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [seconds, setSeconds] = useState(0);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const sending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (stage !== "otp" || seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [seconds, stage]);

  useEffect(() => {
    if (stage === "otp") {
      inputs.current[0]?.focus();
    }
  }, [stage]);

  const sendCode = async (resend = false) => {
    if (sending.current) return;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    sending.current = true;
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const result = await requestAuth({ mobileNumber: phone });

      // If server returns null session or an API response message like "mobile Number not registered"
      if (!result.mobileOtpSession) {
        if (mounted.current) {
          setError(result.message || result.errorMessage || "Mobile number not registered.");
        }
        return;
      }

      if (!mounted.current) return;

      setSession(result.mobileOtpSession);
      localStorage.setItem("mobileOtpSession", result.mobileOtpSession || "");
      localStorage.setItem("primaryType", "STUDENT");
      sessionStorage.setItem("primaryType", "STUDENT");
      setOtp(Array(6).fill(""));
      setSeconds(WAIT_SECONDS);
      setStage("otp");

      // Display exact message from server if returned, or confirmation
      if (result.message) {
        setSuccess(result.message);
      } else {
        setSuccess("Verification code sent successfully.");
      }
      if (resend) {
        inputs.current[0]?.focus();
      }
    } catch (e) {
      if (mounted.current) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      sending.current = false;
      if (mounted.current) setPending(false);
    }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending.current) return;

    const code = otp.join("");
    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (!session) {
      setError("Session expired. Please request a new code.");
      return;
    }

    sending.current = true;
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const result = await requestAuth({
        mobileNumber: phone,
        otpSession: session,
        otpValue: code,
      });

      if (!result.accessToken || !result.userId) {
        if (mounted.current) {
          setError(result.message || result.errorMessage || "Verification failed.");
        }
        return;
      }

      if (!mounted.current) return;

      // 1. Set Customer Access & Refresh Cookies
      setCustomerAccessToken(result.accessToken);
      if (result.refreshToken) {
        setRefreshToken(result.refreshToken);
      }

      // 2. Update Redux store
      store.dispatch(updateAccessToken(result.accessToken));
      if (result.refreshToken) {
        store.dispatch(updateRefreshToken(result.refreshToken));
      }
      store.dispatch(
        setCredentials({
          userId: result.userId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken || "",
          mobileNumber: phone,
        })
      );

      // 3. Persist and automatically update all localStorage authentication values (matching WhatsappLogin.tsx)
      localStorage.setItem("primaryType", "STUDENT");
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("mobileNumber", phone);
      sessionStorage.setItem("primaryType", "STUDENT");

      // 4. Remove stale OTP session tokens
      localStorage.removeItem("mobileOtpSession");
      localStorage.removeItem("salt");
      localStorage.removeItem("expiryTime");

      // 5. Sync user details from /user-service/me if available
      try {
        const userRes = await fetch(`${BASE_URL}/user-service/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${result.accessToken}`,
            accessToken: result.accessToken,
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData?.userId) {
            localStorage.setItem("userId", String(userData.userId));
          }
        }
      } catch (err) {
        console.error("Error fetching user details in StudentLogin:", err);
      }

      // 3. Callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }

      // 4. Resolve destination path
      const rawRedirect = sessionStorage.getItem("redirectPath");
      const isValidRedirect =
        rawRedirect &&
        rawRedirect.trim() !== "" &&
        rawRedirect !== "/" &&
        !rawRedirect.includes("login") &&
        !rawRedirect.includes("register");

      const targetPath = redirectTo || (isValidRedirect ? rawRedirect : DEFAULT_REDIRECT_PATH);

      if (result.message) {
        setSuccess(result.message);
      } else {
        setSuccess("Login successful! Redirecting to dashboard...");
      }

      setTimeout(() => {
        sessionStorage.removeItem("redirectPath");
        navigate(targetPath, { replace: true });
      }, 700);
    } catch (e) {
      if (mounted.current) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      sending.current = false;
      if (mounted.current) setPending(false);
    }
  };

  const changeDigit = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    const next = [...otp];
    if (!digits) {
      next[index] = "";
    } else {
      digits
        .slice(0, 6 - index)
        .split("")
        .forEach((digit, pos) => {
          next[index + pos] = digit;
        });
    }
    setOtp(next);
    setError("");
    const last = Math.min(5, index + Math.max(digits.length, 1));
    if (digits) {
      inputs.current[last]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6 - index);
    if (!digits) return;
    event.preventDefault();
    changeDigit(index, digits);
  };

  return (
    <main className="min-h-screen w-full bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-[420px]">
        {/* Centered Login Card */}
        <section
          className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/50"
          aria-label="Sign In"
        >
          {/* Header Icon Badge (No Image Logo) */}
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5 shadow-sm">
            {stage === "mobile" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>

          {/* Heading and Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {stage === "mobile" ? "Sign in to your account" : "Verify Mobile Number"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {stage === "mobile" ? (
                "Enter your mobile number to securely access your account and applications."
              ) : (
                <>
                  Enter the 6-digit verification code sent to{" "}
                  <strong className="text-slate-800 font-semibold">
                    +91 {phone.slice(0, 2)}••••{phone.slice(-4)}
                  </strong>
                </>
              )}
            </p>
          </div>

          {/* Error Alert Box - Displays exact API response message */}
          {error && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 flex items-start justify-between gap-2.5 shadow-sm transition-all"
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <svg
                  className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium leading-relaxed break-words">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600 p-0.5 rounded transition cursor-pointer"
                aria-label="Dismiss error message"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Success Alert Box - Displays exact API response message */}
          {success && (
            <div
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-800 flex items-start justify-between gap-2.5 shadow-sm transition-all"
              role="status"
            >
              <div className="flex items-start gap-2.5">
                <svg
                  className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium leading-relaxed break-words">{success}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccess("")}
                className="text-emerald-500 hover:text-emerald-700 p-0.5 rounded transition cursor-pointer"
                aria-label="Dismiss success message"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {stage === "mobile" ? (
            /* STAGE 1: ENTER MOBILE NUMBER */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendCode();
              }}
              noValidate
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="student-mobile"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Mobile Number <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all overflow-hidden shadow-sm">
                  <span className="px-3.5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200 select-none">
                    +91
                  </span>
                  <input
                    id="student-mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phone}
                    placeholder="Enter 10-digit mobile number"
                    disabled={pending}
                    aria-invalid={!!error}
                    aria-describedby="student-mobile-help"
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setError("");
                      setSuccess("");
                    }}
                    required
                    className="w-full px-3.5 py-3 bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <p id="student-mobile-help" className="mt-2 text-[11px] text-slate-500">
                  We will send a one-time 6-digit verification code to this number.
                </p>
              </div>

              <button
                type="submit"
                disabled={pending || phone.length !== 10}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {pending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Sending code…</span>
                  </>
                ) : (
                  <span>Continue with OTP →</span>
                )}
              </button>
            </form>
          ) : (
            /* STAGE 2: ENTER OTP */
            <form onSubmit={verify} noValidate className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="student-otp-0"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                >
                  6-Digit Verification Code <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 my-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`student-otp-${index}`}
                      ref={(el) => {
                        inputs.current[index] = el;
                      }}
                      aria-label={`OTP digit ${index + 1}`}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      type="text"
                      maxLength={6}
                      value={digit}
                      disabled={pending}
                      aria-invalid={!!error}
                      onChange={(e) => changeDigit(index, e.target.value)}
                      onPaste={(e) => handlePaste(e, index)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          inputs.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowLeft" && index > 0) {
                          inputs.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowRight" && index < 5) {
                          inputs.current[index + 1]?.focus();
                        }
                      }}
                      className="h-12 sm:h-14 w-full rounded-xl border border-slate-300 bg-white text-center text-lg sm:text-xl font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5">
                  <span>{seconds > 0 ? `Resend in ${seconds}s` : "Didn't receive the code?"}</span>
                  <button
                    type="button"
                    disabled={pending || seconds > 0}
                    onClick={() => void sendCode(true)}
                    className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending || otp.join("").length !== 6}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {pending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Verifying…</span>
                  </>
                ) : (
                  <span>Verify & Sign In →</span>
                )}
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setStage("mobile");
                  setSession("");
                  setOtp(Array(6).fill(""));
                  setError("");
                  setSuccess("");
                  setSeconds(0);
                }}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition pt-2 cursor-pointer"
              >
                ← Change mobile number
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );

 
}

export { DEFAULT_REDIRECT_PATH as DASHBOARD_PATH };
