import React, { useState } from "react";
import { Input, Button, Select, message } from "antd";
import {
  RiPhoneFindLine,
  RiUser3Line,
  RiApps2Line,
  RiFlashlightLine,
  RiCheckboxCircleLine,
  RiAddLine,
  RiCloseLine,
} from "react-icons/ri";
import { placeOutboundCall } from "../api";
import {
  PLATFORMS,
  PLATFORM_LABELS,
  Platform,
  OUTBOUND_SCENARIOS,
  OUTBOUND_SCENARIO_LABELS,
  OutboundScenario,
} from "../types";
import VoiceAdminLayout from "./VoiceAdminLayout";

/** Solid accent classes per platform, used for the underline-tab picker so each
 *  platform reads as its own color instead of one flat accent for all of them. */
const PLATFORM_ACCENT: Record<
  Platform,
  { dot: string; text: string; border: string; hoverBg: string }
> = {
  OXYLOANS: {
    dot: "bg-blue-400",
    text: "text-blue-600",
    border: "border-blue-600",
    hoverBg: "hover:bg-blue-50/60",
  },
  ASKOXY: {
    dot: "bg-violet-400",
    text: "text-violet-600",
    border: "border-violet-600",
    hoverBg: "hover:bg-violet-50/60",
  },
  OXYGOLD: {
    dot: "bg-amber-400",
    text: "text-amber-600",
    border: "border-amber-600",
    hoverBg: "hover:bg-amber-50/60",
  },
  OXYBRICK: {
    dot: "bg-orange-400",
    text: "text-orange-600",
    border: "border-orange-600",
    hoverBg: "hover:bg-orange-50/60",
  },
  STUDYABROAD: {
    dot: "bg-cyan-400",
    text: "text-cyan-600",
    border: "border-cyan-600",
    hoverBg: "hover:bg-cyan-50/60",
  },
  OXYBFSAI: {
    dot: "bg-pink-400",
    text: "text-pink-600",
    border: "border-pink-600",
    hoverBg: "hover:bg-pink-50/60",
  },
  OXYGLOBAL: {
    dot: "bg-emerald-400",
    text: "text-emerald-600",
    border: "border-emerald-600",
    hoverBg: "hover:bg-emerald-50/60",
  },
};

const SCENARIO_COLORS: Record<OutboundScenario, string> = {
  CALL_FOLLOWUP: "text-blue-500",
  EMI_REMINDER: "text-rose-500",
  KYC_PENDING: "text-amber-500",
  LEAD_FOLLOWUP: "text-emerald-500",
  ORDER_STATUS_UPDATE: "text-cyan-500",
};

const SCENARIO_FIELD_SUGGESTIONS: Record<OutboundScenario, string[]> = {
  CALL_FOLLOWUP: ["Previous Call Date", "Follow-up Reason", "Agent Notes"],
  EMI_REMINDER: ["Loan Account No", "EMI Amount", "Due Date"],
  KYC_PENDING: ["Document Type", "Pending Since"],
  LEAD_FOLLOWUP: ["Lead Source", "Area of Interest"],
  ORDER_STATUS_UPDATE: ["Order ID", "Expected Delivery Date"],
};

interface CustomField {
  id: string;
  label: string;
  value: string;
}

const slugify = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

const emptyField = (): CustomField => ({
  id: crypto.randomUUID(),
  label: "",
  value: "",
});

/**
 * Normalizes a user-entered caller number before it's sent to the API:
 * strips non-digits, keeps the last 10 digits if 12 were entered
 * (country code), and ensures a leading "0".
 */
const normalizeCallerNumber = (raw: string): string => {
  let digits = raw.trim().replace(/\D/g, "");
  if (digits.length === 12) {
    digits = digits.slice(-10);
  }
  if (!digits.startsWith("0")) {
    digits = `0${digits}`;
  }
  return digits;
};

const MakeCall: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  const [scenario, setScenario] = useState<OutboundScenario>(
    OUTBOUND_SCENARIOS[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([
    emptyField(),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    phoneNumber: string;
    platform: Platform;
    scenario: OutboundScenario;
  } | null>(null);

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
  };

  const handleScenarioChange = (v: OutboundScenario) => {
    setScenario(v);
  };

  const addCustomField = () => {
    setCustomFields((prev) => [...prev, emptyField()]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields((prev) =>
      prev.length > 1 ? prev.filter((f) => f.id !== id) : prev,
    );
  };

  const updateCustomField = (
    id: string,
    key: "label" | "value",
    val: string,
  ) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: val } : f)),
    );
  };

  /** Adds a suggestion as a new field the user just needs to fill the value for.
   *  Reuses a blank trailing row instead of stacking empty rows if one's available. */
  const applySuggestion = (label: string) => {
    setCustomFields((prev) => {
      const alreadyAdded = prev.some(
        (f) => f.label.trim().toLowerCase() === label.toLowerCase(),
      );
      if (alreadyAdded) return prev;
      const blankIdx = prev.findIndex(
        (f) => !f.label.trim() && !f.value.trim(),
      );
      if (blankIdx !== -1) {
        const next = [...prev];
        next[blankIdx] = { ...next[blankIdx], label };
        return next;
      }
      return [...prev, { id: crypto.randomUUID(), label, value: "" }];
    });
  };

  const filledCustomFields = customFields.filter(
    (f) => f.label.trim() && f.value.trim(),
  );
  const suggestions = SCENARIO_FIELD_SUGGESTIONS[scenario] || [];
  const activeLabelsLower = customFields.map((f) =>
    f.label.trim().toLowerCase(),
  );

  // Only phone number and customer name are required — every other field is
  // optional, free-form, and simply omitted from the payload if left blank.
  const isFormValid =
    phoneNumber.trim().length > 0 && customerName.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      message.warning(
        "Please enter a phone number and customer name before placing the call.",
      );
      return;
    }
    const normalized = normalizeCallerNumber(phoneNumber);
    setSubmitting(true);
    try {
      const extraPayload = Object.fromEntries(
        filledCustomFields.map((f) => [slugify(f.label), f.value.trim()]),
      );

      await placeOutboundCall({
        phoneNumber: normalized,
        scenario,
        platform,
        payload: {
          customerName: customerName.trim(),
          ...extraPayload,
        },
      });
      message.success(`Outbound call placed to ${normalized}.`);
      setLastResult({ phoneNumber: normalized, platform, scenario });
      setPhoneNumber("");
      setCustomerName("");
      setCustomFields([emptyField()]);
    } catch (err) {
      message.error("Failed to place the call. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VoiceAdminLayout activeKey="makeacall">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-indigo-50 rounded-lg p-6 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-indigo-400 rounded-lg shadow-sm">
            <RiPhoneFindLine className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Make a Call
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Manually trigger an outbound AI call for a specific platform and
              scenario
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          {/* Platform */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <RiApps2Line className="text-violet-500" />
            Platform
          </div>
          <div className="mb-6">
            <div
              className="flex gap-1 border-b border-slate-200 overflow-x-auto whitespace-nowrap no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {" "}
              {PLATFORMS.map((p) => {
                const active = p === platform;
                const accent = PLATFORM_ACCENT[p];
                return (
                  <button
                    key={p}
                    onClick={() => handlePlatformChange(p)}
                    className={`flex items-center gap-2 px-3 pb-3 pt-1 text-sm whitespace-nowrap border-b-2 rounded-t-md transition-colors ${
                      active
                        ? `${accent.border} ${accent.text} font-semibold`
                        : `border-transparent text-slate-500 hover:text-slate-900 ${accent.hoverBg}`
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${accent.dot} ${active ? "" : "opacity-50"}`}
                    />
                    {PLATFORM_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <RiFlashlightLine className="text-amber-500" />
            Scenario
          </div>
          <Select
            value={scenario}
            onChange={handleScenarioChange}
            size="large"
            className="w-full mb-6"
            options={OUTBOUND_SCENARIOS.map((s) => ({
              value: s,
              label: (
                <span className="flex items-center gap-2">
                  <RiFlashlightLine className={SCENARIO_COLORS[s]} />
                  {OUTBOUND_SCENARIO_LABELS[s]}
                </span>
              ),
            }))}
          />

          {/* Caller details */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <RiUser3Line className="text-blue-500" />
            Caller Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1.5">
                Phone Number
              </div>
              <Input
                size="large"
                placeholder="e.g. 9876123123"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1.5">
                Customer Name
              </div>
              <Input
                size="large"
                placeholder="e.g. Ravi Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Free-form call details, same builder for every platform and scenario */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <RiFlashlightLine className={SCENARIO_COLORS[scenario]} />
              {OUTBOUND_SCENARIO_LABELS[scenario]} Details
            </div>
            <Button
              size="small"
              icon={<RiAddLine />}
              onClick={addCustomField}
              className="!rounded-full !border-violet-200 !bg-violet-50 !text-violet-600 hover:!bg-violet-100"
            >
              Add Field
            </Button>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Optional — add whatever information is relevant for this call.
            Nothing here is required or fixed; leave it blank to send with just
            the caller details.
          </p>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[11px] text-slate-400 mr-0.5">
                Suggestions:
              </span>
              {suggestions.map((label) => {
                const alreadyAdded = activeLabelsLower.includes(
                  label.toLowerCase(),
                );
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => applySuggestion(label)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      alreadyAdded
                        ? "bg-slate-50 border-slate-100 text-slate-300 cursor-default"
                        : "bg-white border-violet-200 text-violet-600 hover:bg-violet-50"
                    }`}
                  >
                    {alreadyAdded ? <RiCheckboxCircleLine /> : <RiAddLine />}
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            {customFields.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <Input
                  size="large"
                  placeholder="Field name, e.g. Due Date"
                  value={f.label}
                  onChange={(e) =>
                    updateCustomField(f.id, "label", e.target.value)
                  }
                  className="rounded-lg"
                />
                <Input
                  size="large"
                  placeholder="Value, e.g. 2026-08-01"
                  value={f.value}
                  onChange={(e) =>
                    updateCustomField(f.id, "value", e.target.value)
                  }
                  className="rounded-lg"
                />
                <Button
                  size="large"
                  icon={<RiCloseLine />}
                  onClick={() => removeCustomField(f.id)}
                  disabled={customFields.length === 1}
                  className="!rounded-lg shrink-0"
                />
              </div>
            ))}
          </div>

          <Button
            type="primary"
            size="large"
            icon={<RiPhoneFindLine />}
            onClick={handleSubmit}
            loading={submitting}
            disabled={!isFormValid}
            className="!rounded-lg !border-none !font-semibold w-full sm:w-auto"
            style={{
              background: isFormValid
                ? "linear-gradient(to right, #10b981, #6366f1)"
                : undefined,
            }}
          >
            Place Outbound Call
          </Button>
        </div>

        {/* Summary / preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-50/60 via-white to-emerald-50/40 rounded-lg border border-indigo-100/70 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Call Preview
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Platform</span>
                <span className="font-semibold text-slate-800">
                  {PLATFORM_LABELS[platform]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scenario</span>
                <span className="font-semibold text-slate-800">
                  {OUTBOUND_SCENARIO_LABELS[scenario]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-800">
                  {phoneNumber ? normalizeCallerNumber(phoneNumber) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer</span>
                <span className="font-semibold text-slate-800">
                  {customerName || "—"}
                </span>
              </div>
              {filledCustomFields.length > 0 ? (
                filledCustomFields.map((f) => (
                  <div key={f.id} className="flex justify-between gap-3">
                    <span className="text-slate-500 truncate">{f.label}</span>
                    <span className="font-semibold text-slate-800 text-right truncate">
                      {f.value}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">
                  No additional fields added yet
                </div>
              )}
            </div>
          </div>

          {lastResult && (
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <RiCheckboxCircleLine className="text-emerald-500 text-lg" />
                <span className="text-sm font-semibold text-slate-800">
                  Last Call Placed
                </span>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>
                  <span className="font-medium text-slate-800">Number: </span>
                  {lastResult.phoneNumber}
                </div>
                <div>
                  <span className="font-medium text-slate-800">Platform: </span>
                  {PLATFORM_LABELS[lastResult.platform]}
                </div>
                <div>
                  <span className="font-medium text-slate-800">Scenario: </span>
                  {OUTBOUND_SCENARIO_LABELS[lastResult.scenario]}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </VoiceAdminLayout>
  );
};

export default MakeCall;
