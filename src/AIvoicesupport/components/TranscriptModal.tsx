import React from "react";
import { Modal, Empty, Spin, Tag } from "antd";
import {
  RiTimeLine,
  RiUserVoiceLine,
  RiRobot2Line,
  RiHeadphoneLine,
} from "react-icons/ri";
import dayjs from "dayjs";
import type { TranscriptMessage } from "../types";

interface CallMeta {
  callerNumber: string;
  platform?: string | null;
  callDirection?: string;
  purpose?: string | null;
  summary?: string | null;
  timestamp?: string | null;
  recordingUrl?: string | null;
}

interface TranscriptModalProps {
  open: boolean;
  onClose: () => void;
  meta: CallMeta | null;
  transcript: TranscriptMessage[] | null | undefined;
  loading?: boolean;
}

const TranscriptModal: React.FC<TranscriptModalProps> = ({
  open,
  onClose,
  meta,
  transcript,
  loading,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 shadow-sm">
            <RiUserVoiceLine className="text-[#b8860b] text-lg" />
          </div>
          <span className="text-slate-900 font-semibold text-base">
            {meta ? `Call with ${meta.callerNumber}` : "Call transcript"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={960}
      destroyOnClose
      styles={{
        content: { borderRadius: 16 },
        header: { borderBottom: "1px solid #f1f5f9", paddingBottom: 16 },
      }}
    >
      <Spin spinning={!!loading}>
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Left column: recording + purpose + summary */}
          <div className="w-full md:w-[360px] shrink-0 flex flex-col gap-4">
            {meta?.recordingUrl && (
              <div className="bg-white border border-amber-100 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shrink-0">
                  <RiHeadphoneLine className="text-[#b8860b] text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 mb-1.5">
                    Call Recording
                  </div>
                  <audio
                    controls
                    src={meta.recordingUrl}
                    className="w-full"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
              </div>
            )}

            {meta && (
              <div className="bg-gradient-to-br from-amber-50/60 via-white to-white rounded-xl p-5 border border-amber-100/80">
                <div className="flex flex-wrap gap-2 mb-4">
                  {meta.callDirection && (
                    <Tag
                      className="!rounded-full !px-3.5 !py-1.5 !text-sm !font-semibold"
                      color={
                        meta.callDirection === "INBOUND" ? "blue" : "purple"
                      }
                    >
                      {meta.callDirection}
                    </Tag>
                  )}

                  {meta.timestamp && (
                    <Tag className="!rounded-full !px-3.5 !py-1.5 !text-sm !border-slate-200 !bg-white !text-slate-600 !font-medium flex items-center gap-1.5">
                      <RiTimeLine className="text-base" />
                      {dayjs(meta.timestamp).format("DD MMM YYYY, hh:mm A")}
                    </Tag>
                  )}
                  <Tag className="!rounded-full !px-3.5 !py-1.5 !text-sm !border-slate-200 !bg-white !text-slate-800 !font-medium">
                    {meta.platform || "Unknown platform"}
                  </Tag>
                </div>

                {meta.purpose && (
                  <div className="mb-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[15px] leading-relaxed">
                      <span className="font-semibold text-slate-900">
                        Purpose:{" "}
                      </span>
                      <span className="text-slate-700">{meta.purpose}</span>
                    </div>
                  </div>
                )}

                {meta.summary && (
                  <div className="text-[15px] leading-relaxed">
                    <span className="font-semibold text-slate-950">
                      Summary:{" "}
                    </span>
                    <span className="text-slate-700">{meta.summary}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: transcript */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 mb-3 px-1">
              <RiRobot2Line className="text-slate-500 text-base" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Conversation
              </span>
            </div>

            <div
              style={{ maxHeight: 460, overflowY: "auto" }}
              className="pr-1 bg-slate-50/60 rounded-xl p-4 border border-slate-100"
            >
              {!transcript || transcript.length === 0 ? (
                <Empty description="No transcript available" />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {transcript.map((msg, idx) => {
                    const isAI = msg.speaker === "AI";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl border shadow-sm ${
                            isAI
                              ? "bg-white border-amber-100 text-slate-800 rounded-bl-sm"
                              : "bg-gradient-to-br from-amber-50 to-amber-100/70 border-amber-200 text-slate-800 rounded-br-sm"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold mb-1 ${
                              isAI ? "text-[#b8860b]" : "text-slate-600"
                            }`}
                          >
                            {msg.speaker}
                          </div>
                          <div className="text-[15px] leading-relaxed text-slate-800">
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
