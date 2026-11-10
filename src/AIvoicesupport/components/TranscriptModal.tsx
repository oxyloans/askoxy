import React from "react";
import { Modal, Empty, Spin, Tag, Button } from "antd";
import {
  RiTimeLine,
  RiUserVoiceLine,
  RiRobot2Line,
  RiHeadphoneLine,
  RiExternalLinkLine,
  RiCalendarEventLine,
  RiEmotionHappyLine,
  RiCheckDoubleLine,
} from "react-icons/ri";
import dayjs from "dayjs";
import type { TranscriptMessage } from "../types";

export interface CallMeta {
  callerNumber?: string | null;
  phoneNumber?: string | null;
  platform?: string | null;
  callDirection?: string | null;
  callScenario?: string | null;
  purpose?: string | null;
  summary?: string | null;
  timestamp?: string | null;
  date?: string | null;
  recordingUrl?: string | null;
  disposition?: string | null;
  customerSentiment?: string | null;
  nextFollowup?: string | null;
  nextFollowupAt?: string | null;
  promisedPaymentDate?: string | null;
  talkDurationSeconds?: number | null;
}

interface TranscriptModalProps {
  open: boolean;
  onClose: () => void;
  meta: CallMeta | null;
  transcript: TranscriptMessage[] | string | any[] | null | undefined;
  loading?: boolean;
}

const normalizeSpeakerName = (rawSpeaker: any): "AI" | "Caller" => {
  if (!rawSpeaker) return "Caller";
  const s = String(rawSpeaker).trim().toLowerCase();
  if (
    s === "ai" ||
    s === "agent" ||
    s === "assistant" ||
    s === "priya" ||
    s === "bot" ||
    s === "system" ||
    s.includes("radha krishna")
  ) {
    return "AI";
  }
  return "Caller";
};

const parsePlainTextTranscript = (text: string): TranscriptMessage[] => {
  const turns: TranscriptMessage[] = [];
  const lines = text.split(/\r?\n/);
  let currentSpeaker = "";
  let currentText = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sepIdx = line.indexOf(":");
    if (sepIdx > 0 && sepIdx < 25) {
      const candidate = line.substring(0, sepIdx).trim();
      if (
        /^(ai|assistant|priya|agent|bot|caller|customer|user|human|radha krishna)/i.test(
          candidate,
        )
      ) {
        if (currentSpeaker && currentText) {
          turns.push({
            speaker: normalizeSpeakerName(currentSpeaker),
            text: currentText.trim(),
          });
          currentText = "";
        }
        currentSpeaker = candidate;
        currentText = line.substring(sepIdx + 1).trim();
        continue;
      }
    }

    if (currentSpeaker) {
      currentText = currentText ? `${currentText} ${line}` : line;
    } else {
      currentSpeaker = "Caller";
      currentText = line;
    }
  }

  if (currentSpeaker && currentText) {
    turns.push({
      speaker: normalizeSpeakerName(currentSpeaker),
      text: currentText.trim(),
    });
  }

  return turns;
};

export const normalizeTranscript = (raw: any): TranscriptMessage[] => {
  if (!raw) return [];

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return normalizeTranscript(parsed);
        }
      } catch (e) {
        // Fall back to plain text parsing
      }
    }
    return parsePlainTextTranscript(trimmed);
  }

  if (Array.isArray(raw)) {
    const list: TranscriptMessage[] = [];
    for (const item of raw) {
      if (!item) continue;
      if (typeof item === "string") {
        list.push(...parsePlainTextTranscript(item));
      } else if (typeof item === "object") {
        const rawSpeaker =
          item.speaker ||
          item.role ||
          item.sender ||
          item.name ||
          (item.ai ? "AI" : "Caller");
        const text =
          item.text || item.content || item.message || item.transcript || "";
        if (text && String(text).trim()) {
          list.push({
            speaker: normalizeSpeakerName(rawSpeaker),
            text: String(text).trim(),
          });
        }
      }
    }
    return list;
  }

  return [];
};

const TranscriptModal: React.FC<TranscriptModalProps> = ({
  open,
  onClose,
  meta,
  transcript,
  loading,
}) => {
  const turns = React.useMemo(
    () => normalizeTranscript(transcript),
    [transcript],
  );

  const displayTime = meta?.timestamp || meta?.date;
  const displayNumber = meta?.callerNumber || meta?.phoneNumber || "Call Details";
  const nextFollowup =
    meta?.nextFollowupAt || meta?.nextFollowup || meta?.promisedPaymentDate;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 shadow-sm">
            <RiUserVoiceLine className="text-[#b8860b] text-lg" />
          </div>
          <span className="text-slate-900 font-semibold text-base">
            Call with {displayNumber}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
      styles={{
        content: { borderRadius: 16 },
        header: { borderBottom: "1px solid #f1f5f9", paddingBottom: 16 },
      }}
    >
      <Spin spinning={!!loading}>
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Left column: recording + purpose + summary */}
          <div className="w-full md:w-[380px] shrink-0 flex flex-col gap-4">
            {meta?.recordingUrl ? (
              <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shrink-0">
                      <RiHeadphoneLine className="text-[#b8860b] text-base" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      Call Voice Recording
                    </span>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    icon={<RiExternalLinkLine />}
                    href={meta.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!text-xs !text-[#b8860b] hover:!underline !p-0"
                  >
                    Open Audio
                  </Button>
                </div>
                <audio
                  controls
                  src={meta.recordingUrl}
                  className="w-full"
                  style={{ width: "100%", height: 36 }}
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3 text-slate-500 text-xs">
                <RiHeadphoneLine className="text-slate-400 text-lg shrink-0" />
                <span>No recording file attached for this call.</span>
              </div>
            )}

            {meta && (
              <div className="bg-gradient-to-br from-amber-50/60 via-white to-white rounded-xl p-5 border border-amber-100/80 shadow-sm">
                <div className="flex flex-wrap gap-2 mb-4">
                  {meta.callDirection && (
                    <Tag
                      className="!rounded-full !px-3.5 !py-1 !text-xs !font-semibold"
                      color={
                        meta.callDirection === "INBOUND" ? "blue" : "purple"
                      }
                    >
                      {meta.callDirection}
                    </Tag>
                  )}

                  {displayTime && (
                    <Tag className="!rounded-full !px-3.5 !py-1 !text-xs !border-slate-200 !bg-white !text-slate-600 !font-medium flex items-center gap-1.5">
                      <RiTimeLine className="text-sm" />
                      {dayjs(displayTime).format("DD MMM YYYY, hh:mm A")}
                    </Tag>
                  )}

                  {meta.platform && (
                    <Tag className="!rounded-full !px-3.5 !py-1 !text-xs !border-amber-200 !bg-amber-50 !text-[#b8860b] !font-medium">
                      {meta.platform}
                    </Tag>
                  )}

                  {meta.customerSentiment && (
                    <Tag className="!rounded-full !px-3 !py-1 !text-xs !border-slate-200 !bg-white !text-slate-700 flex items-center gap-1">
                      <RiEmotionHappyLine className="text-sm text-amber-500" />
                      Sentiment: {meta.customerSentiment}
                    </Tag>
                  )}

                  {meta.disposition && (
                    <Tag className="!rounded-full !px-3 !py-1 !text-xs !border-slate-200 !bg-white !text-slate-700 flex items-center gap-1">
                      <RiCheckDoubleLine className="text-sm text-emerald-500" />
                      {meta.disposition.replace(/_/g, " ")}
                    </Tag>
                  )}
                </div>

                {meta.purpose && (
                  <div className="mb-3 rounded-lg border border-amber-200/70 bg-amber-50/40 p-3">
                    <div className="text-sm leading-relaxed">
                      <span className="font-semibold text-slate-900">
                        Purpose:{" "}
                      </span>
                      <span className="text-slate-700">{meta.purpose}</span>
                    </div>
                  </div>
                )}

                <div className="mb-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Call Summary
                  </div>
                  <div className="text-sm leading-relaxed text-slate-800">
                    {meta.summary || "Summary generation in progress or not available."}
                  </div>
                </div>

                {nextFollowup && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 flex items-start gap-2.5">
                    <RiCalendarEventLine className="text-emerald-600 text-base mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-900">
                        Next Follow-up / Promised Date
                      </div>
                      <div className="text-xs text-emerald-800 mt-0.5">
                        {dayjs(nextFollowup).format("DD MMM YYYY, hh:mm A")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: conversation */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <RiRobot2Line className="text-[#b8860b] text-base" />
                <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Conversation ({turns.length} turns)
                </span>
              </div>
              <span className="text-xs text-slate-400">
                AI (Left) • Caller (Right)
              </span>
            </div>

            <div
              style={{ maxHeight: 480, overflowY: "auto" }}
              className="pr-1 bg-slate-50/70 rounded-xl p-4 border border-slate-100"
            >
              {turns.length === 0 ? (
                <Empty
                  description={
                    meta?.summary
                      ? "Conversation turns not itemized, see summary on the left."
                      : "No transcript available yet for this call"
                  }
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {turns.map((msg, idx) => {
                    const isAI = msg.speaker === "AI";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 rounded-2xl border shadow-sm ${
                            isAI
                              ? "bg-white border-amber-200/90 text-slate-900 rounded-bl-sm"
                              : "bg-gradient-to-br from-amber-50 to-amber-100/80 border-amber-300 text-slate-900 rounded-br-sm"
                          }`}
                        >
                          <div
                            className={`text-[11px] font-semibold mb-1.5 flex items-center gap-1.5 ${
                              isAI ? "text-[#b8860b]" : "text-blue-700"
                            }`}
                          >
                            {isAI ? (
                              <>
                                <RiRobot2Line className="text-xs" />
                                <span>AI Assistant (Radha Krishna / Priya)</span>
                              </>
                            ) : (
                              <>
                                <RiUserVoiceLine className="text-xs" />
                                <span>Caller / User</span>
                              </>
                            )}
                            <span className="text-slate-400 font-normal ml-auto text-[10px]">
                              Turn #{idx + 1}
                            </span>
                          </div>
                          <div className="text-[14px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default TranscriptModal;
