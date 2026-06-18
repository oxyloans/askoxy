import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UseCaseSelector from "./UseCaseSelector";
import FileUploadZone from "./FileUploadZone";
import {
  PROVIDER_MODELS,
  BACKEND_STACKS,
  FRONTEND_STACKS,
  DATABASE_TYPES,
} from "../hooks/providerModels";
import { USE_CASE_REGISTRY } from "../hooks/useCaseRegistry";
import { engineApi } from "../hooks/engineApi";
import { useEngineStore } from "../hooks/engineStore";
import type { UseCase } from "../type/useCases";

const FRAMEWORK_BADGE_CLASSES: Record<string, string> = {
  CBUAE: "text-[#1E6FD9] bg-[#1E6FD9]/10 border border-[#1E6FD9]/20",
  RBI: "text-[#E85D00] bg-[#E85D00]/10 border border-[#E85D00]/20",
  SAMA: "text-[#00875A] bg-[#00875A]/10 border border-[#00875A]/20",
};

interface FormState {
  selectedUseCase: string;
  regulatoryFramework: string;
  bankName: string;
  backendStack: string;
  frontendStack: string;
  databaseType: string;
  aiProvider: string;
  aiModelId: string;
  existingServices: string[];
  frameworkOverride: boolean;
}

interface FormErrors {
  selectedUseCase?: string;
  bankName?: string;
  backendStack?: string;
  frontendStack?: string;
  databaseType?: string;
  aiProvider?: string;
  aiModelId?: string;
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function FormSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl p-7 transition-all duration-200 hover:border-[#00D4FF]/25">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#00D4FF]/10 border border-[#00D4FF] rounded-full flex items-center justify-center text-sm font-bold text-[#00D4FF] shrink-0">
          {number}
        </div>
        <h4 className="text-[#F0F4FF] text-base font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// ─── Summary Panel ────────────────────────────────────────────────────────────
function SummaryPanel({
  form,
  selectedUC,
  isReady,
}: {
  form: FormState;
  selectedUC: UseCase | undefined;
  isReady: boolean;
}) {
  const checks = [
    {
      label: "Use Case",
      value: selectedUC?.name,
      done: !!form.selectedUseCase,
    },
    {
      label: "Framework",
      value: form.regulatoryFramework,
      done: !!form.regulatoryFramework,
    },
    { label: "Bank Name", value: form.bankName, done: !!form.bankName },
    {
      label: "Backend Stack",
      value: BACKEND_STACKS.find((s) => s.value === form.backendStack)?.label,
      done: !!form.backendStack,
    },
    {
      label: "Frontend Stack",
      value: FRONTEND_STACKS.find((s) => s.value === form.frontendStack)?.label,
      done: !!form.frontendStack,
    },
    {
      label: "Database",
      value: DATABASE_TYPES.find((s) => s.value === form.databaseType)?.label,
      done: !!form.databaseType,
    },
    {
      label: "AI Provider",
      value: PROVIDER_MODELS[form.aiProvider]?.label,
      done: !!form.aiProvider,
    },
    { label: "AI Model", value: form.aiModelId, done: !!form.aiModelId },
  ];

  return (
    <div className="bg-white/[0.03] border border-[#00D4FF]/12 rounded-2xl p-6 sticky top-[88px]">
      <h4 className="text-[14px] mb-5 text-[#8B9CC8] font-bold tracking-wider uppercase">
        Configuration Summary
      </h4>

      {selectedUC && (
        <div className="p-3 px-3.5 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/20 mb-4">
          <div className="text-[11px] text-[#4A5580] mb-1">Selected</div>
          <div className="text-[14px] font-semibold text-[#F0F4FF]">
            {selectedUC.name}
          </div>
          {selectedUC.framework && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold tracking-wider uppercase mt-1.5 ${FRAMEWORK_BADGE_CLASSES[selectedUC.framework]}`}
            >
              {selectedUC.framework}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {checks.map(({ label, value, done }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border-[1.5px] transition-all duration-200 ${
                done
                  ? "bg-[#00E676]/15 border-[#00E676]"
                  : "bg-white/5 border-[#00D4FF]/20"
              }`}
            >
              {done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="#00E676"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#4A5580] tracking-wider uppercase">
                {label}
              </div>
              {done && value && (
                <div className="text-xs text-[#C8D0E8] truncate">{value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-none border-t border-[#00D4FF]/12 my-6" />

      {isReady ? (
        <div className="p-3 px-3.5 rounded-xl bg-[#00E676]/8 border border-[#00E676]/30 flex items-center gap-2.5">
          <svg
            className="shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="#00E676"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <div className="text-xs font-semibold text-[#00E676]">
              Ready to Proceed
            </div>
            <div className="text-[11px] text-[#8B9CC8] mt-0.5">
              All required fields are complete
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 px-3.5 rounded-xl bg-[#FFB700]/5 border border-[#FFB700]/20 flex items-center gap-2.5">
          <svg
            className="shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="#FFB700" strokeWidth="2" />
            <path
              d="M12 8v4M12 16h.01"
              stroke="#FFB700"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-xs text-[#FFB700]">Complete required fields</div>
        </div>
      )}
    </div>
  );
}

// ─── Stage1Page ───────────────────────────────────────────────────────────────
export default function Stage1Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSessionId, setStage1Data } = useEngineStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [apiFile, setApiFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormState>({
    selectedUseCase: "",
    regulatoryFramework: "",
    bankName: "",
    backendStack: "JAVA_SPRING",
    frontendStack: "REACT_TS",
    databaseType: "POSTGRESQL",
    aiProvider: "CLAUDE",
    aiModelId: PROVIDER_MODELS.CLAUDE.defaultModel,
    existingServices: [],
    frameworkOverride: false,
  });

  // Pre-select use case from navigation state
  useEffect(() => {
    const state = location.state as { selectedUseCase?: string } | null;
    if (state?.selectedUseCase) {
      const uc = USE_CASE_REGISTRY.find((u) => u.id === state.selectedUseCase);
      if (uc) {
        setForm((prev) => ({
          ...prev,
          selectedUseCase: uc.id,
          regulatoryFramework: uc.framework,
        }));
      }
    }
  }, [location.state]);

  const selectedUC = USE_CASE_REGISTRY.find(
    (uc) => uc.id === form.selectedUseCase,
  );

  const isReady = !!(
    form.selectedUseCase &&
    form.regulatoryFramework &&
    form.bankName.trim() &&
    form.backendStack &&
    form.frontendStack &&
    form.databaseType &&
    form.aiProvider &&
    form.aiModelId
  );

  const handleUseCaseChange = (id: string, uc: UseCase) => {
    setForm((prev) => ({
      ...prev,
      selectedUseCase: id,
      regulatoryFramework: prev.frameworkOverride
        ? prev.regulatoryFramework
        : uc.framework,
    }));
    setErrors((prev) => ({ ...prev, selectedUseCase: undefined }));
  };

  const handleProviderChange = (provider: string) => {
    const pm = PROVIDER_MODELS[provider];
    setForm((prev) => ({
      ...prev,
      aiProvider: provider,
      aiModelId: pm?.defaultModel ?? "",
    }));
  };

  const toggleService = (id: string) => {
    setForm((prev) => ({
      ...prev,
      existingServices: prev.existingServices.includes(id)
        ? prev.existingServices.filter((s) => s !== id)
        : [...prev.existingServices, id],
    }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.selectedUseCase)
      errs.selectedUseCase = "Please select a use case";
    if (!form.bankName.trim()) errs.bankName = "Bank name is required";
    if (!form.backendStack) errs.backendStack = "Backend stack is required";
    if (!form.frontendStack) errs.frontendStack = "Frontend stack is required";
    if (!form.databaseType) errs.databaseType = "Database is required";
    if (!form.aiProvider) errs.aiProvider = "AI provider is required";
    if (!form.aiModelId) errs.aiModelId = "AI model ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("selectedUseCase", form.selectedUseCase);
      formData.append("regulatoryFramework", form.regulatoryFramework);
      formData.append("bankName", form.bankName.trim());
      formData.append("backendStack", form.backendStack);
      formData.append("frontendStack", form.frontendStack);
      formData.append("databaseType", form.databaseType);
      formData.append("aiProvider", form.aiProvider);
      formData.append("aiModelId", form.aiModelId);
      // Append each existing service as a separate form field (Spring @RequestParam List<String>)
      form.existingServices.forEach((svc) =>
        formData.append("existingServices", svc),
      );
      if (apiFile) formData.append("specFile", apiFile);

      const { data } = await engineApi.startGeneration(formData);
      const sessionId = data.sessionId;

      setSessionId(sessionId);
      setStage1Data({
        selectedUseCase: form.selectedUseCase,
        regulatoryFramework: form.regulatoryFramework,
        bankName: form.bankName.trim(),
        backendStack: form.backendStack,
        frontendStack: form.frontendStack,
        databaseType: form.databaseType,
        aiProvider: form.aiProvider,
        aiModelId: form.aiModelId,
        existingServices: form.existingServices,
      });

      navigate(`/generating/${sessionId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to start generation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in py-10 pb-20">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Page header */}
        <div className="mb-10">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      s === 1
                        ? "bg-[#00D4FF] text-[#0A0F1E]"
                        : "bg-white/5 border border-white/10 text-white/30"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-8 h-px ${s < 1 ? "bg-[#00D4FF]" : "bg-white/10"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <span className="ml-1 text-[11px] font-semibold text-[#00D4FF] tracking-widest uppercase">
              Step 1 of 3
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#F0F4FF] tracking-tight mb-3">
            Design Your Solution
          </h2>

          {/* Pipeline stages */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className="px-2.5 py-1 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF]">
              AI Analysis
            </span>
            <span className="text-white/20">›</span>
            <span className="px-2.5 py-1 rounded-2xl bg-white/5 border border-white/10 text-white/35">
              Stage 2 Config
            </span>
            <span className="text-white/20">›</span>
            <span className="px-2.5 py-1 rounded-2xl bg-white/5 border border-white/10 text-white/35">
              Generation
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            {/* ── Left: Form ── */}
            <div className="flex flex-col gap-5">
              <FormSection number={1} title="Select Use Case">
                <UseCaseSelector
                  value={form.selectedUseCase}
                  onChange={handleUseCaseChange}
                  error={errors.selectedUseCase}
                />
              </FormSection>

              {/* 2. Regulatory Framework */}
              <FormSection number={2} title="Regulatory Framework">
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        key: "CBUAE",
                        flag: "🇦🇪",
                        name: "CBUAE",
                        sub: "UAE Central Bank",
                        color: "#1E6FD9",
                        glow: "rgba(30,111,217,0.12)",
                      },
                      {
                        key: "RBI",
                        flag: "🇮🇳",
                        name: "RBI",
                        sub: "Reserve Bank of India",
                        color: "#E85D00",
                        glow: "rgba(232,93,0,0.12)",
                      },
                      {
                        key: "SAMA",
                        flag: "🇸🇦",
                        name: "SAMA",
                        sub: "Saudi Central Bank",
                        color: "#00875A",
                        glow: "rgba(0,135,90,0.12)",
                      },
                    ] as const
                  ).map((fw) => {
                    const isSelected = form.regulatoryFramework === fw.key;
                    return (
                      <button
                        key={fw.key}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            regulatoryFramework: fw.key,
                          }))
                        }
                        className="relative flex items-center gap-3 py-3 px-4 rounded-xl border cursor-pointer transition-all duration-200 select-none w-full"
                        style={{
                          borderColor: isSelected
                            ? fw.color
                            : "rgba(0,212,255,0.08)",
                          background: isSelected
                            ? fw.glow
                            : "rgba(255,255,255,0.02)",
                        }}
                      >
                        <span className="text-xl shrink-0">{fw.flag}</span>
                        <div className="text-left min-w-0">
                          <div
                            className="text-[13px] font-semibold leading-tight"
                            style={{ color: isSelected ? fw.color : "#C8D0E8" }}
                          >
                            {fw.name}
                          </div>
                          <div className="text-[10px] text-[#4A5580] mt-0.5 leading-tight truncate">
                            {fw.sub}
                          </div>
                        </div>
                        {isSelected && (
                          <div
                            className="ml-auto shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: fw.color }}
                          >
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M20 6L9 17l-5-5"
                                stroke="#fff"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!form.regulatoryFramework && (
                  <p className="text-[14px] text-slate-400 mt-2">
                    Auto-populated from use case, or select manually
                  </p>
                )}
              </FormSection>

              {/* 3. Bank Information */}
              <FormSection number={3} title="Bank Information">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold text-[#8B9CC8] tracking-wider uppercase"
                    htmlFor="bankName"
                  >
                    Bank Name <span className="text-[#FF1744] ml-0.5">*</span>
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[15px] px-4 py-3 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-4 focus:ring-[#00D4FF]/15 ${errors.bankName ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                    value={form.bankName}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, bankName: undefined }));
                    }}
                    placeholder="e.g. Emirates NBD, HDFC Bank, Al Rajhi Bank"
                  />
                  {errors.bankName && (
                    <span className="text-[13px] text-[#FF6B6B] mt-1">
                      ⚠ {errors.bankName}
                    </span>
                  )}
                </div>
              </FormSection>

              {/* 4. Technology Stack */}
              <FormSection number={4} title="Technology Stack">
                <div className="grid grid-cols-3 gap-3">
                  {/* Backend */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                      htmlFor="backendStack"
                    >
                      Backend <span className="text-[#FF1744]">*</span>
                    </label>
                    <select
                      id="backendStack"
                      className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.backendStack ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                      value={form.backendStack}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          backendStack: e.target.value,
                        }))
                      }
                    >
                      {BACKEND_STACKS.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          className="bg-[#0F1525] text-[#F0F4FF]"
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {errors.backendStack && (
                      <span className="text-[11px] text-[#FF6B6B]">
                        ⚠ {errors.backendStack}
                      </span>
                    )}
                  </div>

                  {/* Frontend */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                      htmlFor="frontendStack"
                    >
                      Frontend <span className="text-[#FF1744]">*</span>
                    </label>
                    <select
                      id="frontendStack"
                      className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.frontendStack ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                      value={form.frontendStack}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          frontendStack: e.target.value,
                        }))
                      }
                    >
                      {FRONTEND_STACKS.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          className="bg-[#0F1525] text-[#F0F4FF]"
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {errors.frontendStack && (
                      <span className="text-[11px] text-[#FF6B6B]">
                        ⚠ {errors.frontendStack}
                      </span>
                    )}
                  </div>

                  {/* Database */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                      htmlFor="databaseType"
                    >
                      Database <span className="text-[#FF1744]">*</span>
                    </label>
                    <select
                      id="databaseType"
                      className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.databaseType ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                      value={form.databaseType}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          databaseType: e.target.value,
                        }))
                      }
                    >
                      {DATABASE_TYPES.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          className="bg-[#0F1525] text-[#F0F4FF]"
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {errors.databaseType && (
                      <span className="text-[11px] text-[#FF6B6B]">
                        ⚠ {errors.databaseType}
                      </span>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* 5. AI Provider Configuration */}
              <FormSection number={5} title="AI Provider Configuration">
                <p className="text-[14px] text-slate-400 mb-3">
                  Used by the generated service for intelligent decisioning —
                  not the engine itself.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Provider */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                      htmlFor="aiProvider"
                    >
                      Provider <span className="text-[#FF1744]">*</span>
                    </label>
                    <select
                      id="aiProvider"
                      className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.aiProvider ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                      value={form.aiProvider}
                      onChange={(e) => handleProviderChange(e.target.value)}
                    >
                      <option value="" className="bg-[#0F1525] text-[#8B9CC8]">
                        — Select Provider —
                      </option>
                      {Object.entries(PROVIDER_MODELS).map(
                        ([key, { label }]) => (
                          <option
                            key={key}
                            value={key}
                            className="bg-[#0F1525] text-[#F0F4FF]"
                          >
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                    {errors.aiProvider && (
                      <span className="text-[11px] text-[#FF6B6B]">
                        ⚠ {errors.aiProvider}
                      </span>
                    )}
                  </div>

                  {/* Model */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[10px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                      htmlFor="aiModelId"
                    >
                      Model <span className="text-[#FF1744]">*</span>
                    </label>
                    {form.aiProvider &&
                    PROVIDER_MODELS[form.aiProvider]?.models.length > 0 ? (
                      <select
                        id="aiModelId"
                        className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.aiModelId ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                        value={form.aiModelId}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            aiModelId: e.target.value,
                          }))
                        }
                      >
                        <option
                          value=""
                          className="bg-[#0F1525] text-[#8B9CC8]"
                        >
                          — Select Model —
                        </option>
                        {PROVIDER_MODELS[form.aiProvider].models.map((m) => (
                          <option
                            key={m}
                            value={m}
                            className="bg-[#0F1525] text-[#F0F4FF]"
                          >
                            {m}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="aiModelId"
                        type="text"
                        className={`bg-white/5 border rounded-lg text-[#F0F4FF] font-sans text-[13px] px-3 py-2.5 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${errors.aiModelId ? "border-[#FF1744]" : "border-[#00D4FF]/10"}`}
                        value={form.aiModelId}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            aiModelId: e.target.value,
                          }))
                        }
                        placeholder={
                          form.aiProvider === "AZURE_OPENAI"
                            ? "Azure deployment name"
                            : form.aiProvider === "OLLAMA"
                              ? "e.g. llama3.2, mistral"
                              : "Enter model ID"
                        }
                      />
                    )}
                    {errors.aiModelId && (
                      <span className="text-[11px] text-[#FF6B6B]">
                        ⚠ {errors.aiModelId}
                      </span>
                    )}
                  </div>
                </div>
              </FormSection>
              {/* 6. Existing System Integration */}
              <FormSection
                number={6}
                title="Existing System Integration (Optional)"
              >
                <div className="flex flex-col gap-2">
                  {/* Upload row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-[#00D4FF]/20 bg-white/[0.02] hover:border-[#00D4FF]/40 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      document.getElementById("apiFileInput")?.click()
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0 text-[#00D4FF]"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      {apiFile ? (
                        <span className="text-[13px] text-[#00D4FF] truncate block">
                          {apiFile.name}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#4A5580]">
                          Drop or <span className="text-[#00D4FF]">browse</span>{" "}
                          — swagger.json, openapi.yaml, postman_collection.json
                        </span>
                      )}
                    </div>
                    {apiFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setApiFile(null);
                        }}
                        className="shrink-0 text-[#4A5580] hover:text-[#FF6B6B] transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Hidden input */}
                  <input
                    id="apiFileInput"
                    type="file"
                    accept=".json,.yaml,.yml"
                    className="hidden"
                    onChange={(e) => setApiFile(e.target.files?.[0] ?? null)}
                  />

                  {/* File preview */}
                  {apiFile && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#00D4FF]/10 bg-white/[0.02]">
                      {/* Extension badge */}
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-[#00D4FF] tracking-wider uppercase">
                          {apiFile.name.split(".").pop()}
                        </span>
                      </div>

                      {/* File meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[#C8D0E8] font-medium truncate">
                          {apiFile.name}
                        </p>
                        <p className="text-[11px] text-[#4A5580] mt-0.5">
                          {(apiFile.size / 1024).toFixed(1)} KB
                          {apiFile.lastModified
                            ? ` · ${new Date(
                                apiFile.lastModified,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}`
                            : ""}
                        </p>
                      </div>

                      {/* Ready badge */}
                      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/20">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="#00E676"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-[10px] font-semibold text-[#00E676]">
                          Ready
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>

              {/* Submit error */}
              {submitError && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-[#FF1744]/30 bg-[#FF1744]/8 text-xs text-[#FF1744] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[260px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-sans text-[13px] sm:text-[15px] font-semibold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.3)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,212,255,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin-custom shrink-0" />
                    <span className="sm:hidden">Analyzing...</span>
                    <span className="hidden sm:inline">
                      Analyzing & Starting...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="shrink-0 sm:w-[18px] sm:h-[18px]"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span className="sm:hidden">Analyze & Generate</span>
                    <span className="hidden sm:inline">
                      Analyze & Generate Dynamic Requirements
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* ── Right: Summary Panel ── */}
            <SummaryPanel
              form={form}
              selectedUC={selectedUC}
              isReady={isReady}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
