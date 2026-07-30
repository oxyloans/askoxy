import React, { useEffect, useState } from "react";
import { Input, Button, message, Skeleton, Select } from "antd";
import {
  RiSettings4Line,
  RiSaveLine,
  RiRefreshLine,
  RiPhoneLine,
  RiPhoneFindLine,
  RiChat3Line,
  RiFileTextLine,
  RiApps2Line,
} from "react-icons/ri";
import dayjs from "dayjs";
import {
  getAgentInstructions,
  updateAgentInstructions,
  getInboundGreeting,
  updateInboundGreeting,
  getOutboundGreeting,
  updateOutboundGreeting,
} from "./api";
import {
  PLATFORMS,
  PLATFORM_LABELS,
  Platform,
  InstructionDirection,
  OUTBOUND_SCENARIOS,
  OUTBOUND_SCENARIO_LABELS,
  OutboundScenario,
} from "./types";
import VoiceAdminLayout from "./components/VoiceAdminLayout";

const { TextArea } = Input;

/** Second dropdown's value: "system", "greeting" (inbound only), or an
 * outbound scenario key (acts as "greeting for that scenario"). */
type ContentSelection = "system" | "greeting" | OutboundScenario;

const PLATFORM_GRADIENTS: Record<Platform, string> = {
  OXYLOANS: "from-blue-400 to-blue-500",
  ASKOXY: "from-violet-400 to-violet-500",
  OXYGOLD: "from-amber-400 to-amber-500",
  OXYBRICK: "from-orange-400 to-orange-500",
  STUDYABROAD: "from-cyan-400 to-cyan-500",
  OXYBFSAI: "from-pink-400 to-pink-500",
  OXYGLOBAL: "from-emerald-400 to-emerald-500",
};

const SCENARIO_COLORS: Record<OutboundScenario, string> = {
  CALL_FOLLOWUP: "text-blue-500",
  EMI_REMINDER: "text-rose-500",
  KYC_PENDING: "text-amber-500",
  LEAD_FOLLOWUP: "text-emerald-500",
  ORDER_STATUS_UPDATE: "text-cyan-500",
  BIRTHDAY_WISH: "text-pink-500",
};

const AgentInstructions: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  const [direction, setDirection] = useState<InstructionDirection>("inbound");
  const [selection, setSelection] = useState<ContentSelection>("system");

  const [content, setContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const isScenario = (v: ContentSelection): v is OutboundScenario =>
    (OUTBOUND_SCENARIOS as readonly string[]).includes(v);

  const load = async (
    p: Platform,
    d: InstructionDirection,
    sel: ContentSelection,
  ) => {
    setLoading(true);
    try {
      let res;
      if (sel === "system") {
        res = await getAgentInstructions(p, d);
      } else if (d === "inbound") {
        res = await getInboundGreeting(p);
      } else {
        res = await getOutboundGreeting(p, sel as OutboundScenario);
      }
      setContent(res.content || "");
      setUpdatedAt(res.updatedAt);
      setDirty(false);
    } catch (err) {
      message.error("Failed to load instructions for this selection.");
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(platform, direction, selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, direction, selection]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (selection === "system") {
        res = await updateAgentInstructions(platform, direction, content);
      } else if (direction === "inbound") {
        res = await updateInboundGreeting(platform, content);
      } else {
        res = await updateOutboundGreeting(
          platform,
          selection as OutboundScenario,
          content,
        );
      }
      setUpdatedAt(res.updatedAt);
      setDirty(false);
      message.success(
        `${selection === "system" ? "System instructions" : "Greeting"} updated for ${
          PLATFORM_LABELS[platform]
        } (${direction}${isScenario(selection) ? ` — ${OUTBOUND_SCENARIO_LABELS[selection]}` : ""}).`,
      );
    } catch (err) {
      message.error("Failed to save instructions.");
    } finally {
      setSaving(false);
    }
  };

  const editorTitle = `${selection === "system" ? "System Instructions" : "Greeting Script"} — ${
    PLATFORM_LABELS[platform]
  } (${direction}${isScenario(selection) ? ` — ${OUTBOUND_SCENARIO_LABELS[selection]}` : ""})`;

  const contentTypeOptions =
    direction === "inbound"
      ? [
          {
            value: "system",
            label: (
              <span className="flex items-center gap-2">
                <RiFileTextLine className="text-amber-500" /> System Prompt
              </span>
            ),
          },
          {
            value: "greeting",
            label: (
              <span className="flex items-center gap-2">
                <RiChat3Line className="text-emerald-500" /> Greeting
              </span>
            ),
          },
        ]
      : [
          {
            value: "system",
            label: (
              <span className="flex items-center gap-2">
                <RiFileTextLine className="text-amber-500" /> System Prompt
              </span>
            ),
          },
          ...OUTBOUND_SCENARIOS.map((s) => ({
            value: s,
            label: (
              <span className="flex items-center gap-2">
                <RiChat3Line className={SCENARIO_COLORS[s]} />
                {OUTBOUND_SCENARIO_LABELS[s]}
              </span>
            ),
          })),
        ];

  return (
    <VoiceAdminLayout activeKey="instructions">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-50 via-fuchsia-50/40 to-amber-50 rounded-lg p-6 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-400 to-fuchsia-400 rounded-lg shadow-sm">
            <RiSettings4Line className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Agent Instructions
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Configure Priya's system prompt and greeting scripts per platform
              and call direction
            </p>
          </div>
        </div>
      </div>

      {/* Platform picker */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <RiApps2Line className="text-violet-500" />
          Platform
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {PLATFORMS.map((p) => {
            const active = p === platform;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  active
                    ? `bg-gradient-to-r ${PLATFORM_GRADIENTS[p]} border-transparent text-white shadow-sm`
                    : "bg-white border-gray-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/50"
                }`}
              >
                {PLATFORM_LABELS[p]}
              </button>
            );
          })}
        </div>

        {/* Dropdown filter row */}
        <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-100">
          <div className="pt-4">
            <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">
              Call Direction
            </div>
            <Select
              value={direction}
              onChange={(v) => {
                setDirection(v);
                setSelection("system");
              }}
              style={{ width: 200 }}
              size="large"
              options={[
                {
                  value: "inbound",
                  label: (
                    <span className="flex items-center gap-2">
                      <RiPhoneLine className="text-blue-500" /> Inbound
                    </span>
                  ),
                },
                {
                  value: "outbound",
                  label: (
                    <span className="flex items-center gap-2">
                      <RiPhoneFindLine className="text-violet-500" /> Outbound
                    </span>
                  ),
                },
              ]}
            />
          </div>

          <div className="pt-4">
            <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-2">
              Content
            </div>
            <Select
              value={selection}
              onChange={(v) => setSelection(v)}
              style={{ width: 260 }}
              size="large"
              options={contentTypeOptions}
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 via-white to-amber-50/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {editorTitle}
            </h3>
            {updatedAt && (
              <p className="text-xs text-slate-400 mt-0.5">
                Last updated {dayjs(updatedAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              icon={<RiRefreshLine />}
              onClick={() => load(platform, direction, selection)}
              className="!rounded-lg"
            >
              Reload
            </Button>
            <Button
              type="primary"
              icon={<RiSaveLine />}
              onClick={handleSave}
              loading={saving}
              disabled={!dirty}
              className="!rounded-lg !border-none !font-semibold"
              style={{
                background: dirty
                  ? "linear-gradient(to right, #6366f1, #d946ef)"
                  : undefined,
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
        <div className="p-5">
          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <>
              <TextArea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setDirty(true);
                }}
                autoSize={{ minRows: 10, maxRows: 24 }}
                placeholder="Enter the instructions for this agent..."
                className="rounded-lg font-mono text-sm"
              />
              {dirty && (
                <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-fuchsia-100 to-amber-100 text-fuchsia-700 border border-fuchsia-200">
                  Unsaved changes
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </VoiceAdminLayout>
  );
};

export default AgentInstructions;
