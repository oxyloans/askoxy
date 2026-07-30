import React, { useEffect, useState } from "react";
import { DatePicker, Button, message, Table, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import {
  RiCalendarScheduleLine,
  RiPhoneLine,
  RiTimeLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiLoader4Line,
  RiPulseLine,
} from "react-icons/ri";
import { getScheduledCalls } from "./api";
import type { ScheduledCallItem, ScheduledCallsResponse } from "./types";
import TranscriptModal from "./components/TranscriptModal";
import VoiceAdminLayout from "./components/VoiceAdminLayout";
import { OUTBOUND_SCENARIO_LABELS } from "./types";

const { RangePicker } = DatePicker;
const API_DATE_FORMAT = "DD-MM-YYYY";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  ANSWERED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: <RiCheckboxCircleFill className="text-emerald-500" />,
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: <RiCheckboxCircleFill className="text-emerald-500" />,
  },
  IN_PROGRESS: {
    bg: "bg-amber-50",
    text: "text-[#b8860b]",
    border: "border-amber-200",
    icon: <RiPulseLine className="text-[#c9a24b] animate-pulse" />,
  },
  INITIATED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <RiLoader4Line className="text-blue-500" />,
  },
  SCHEDULED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <RiTimeLine className="text-blue-500" />,
  },
  NO_ANSWER: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: <RiCloseCircleFill className="text-orange-500" />,
  },
  BUSY: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: <RiCloseCircleFill className="text-orange-500" />,
  },
  FAILED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: <RiCloseCircleFill className="text-rose-500" />,
  },
};

const statusStyle = (status: string) =>
  STATUS_STYLES[status] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: <RiTimeLine className="text-slate-400" />,
  };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${s.bg} ${s.text} ${s.border}`}
    >
      {s.icon}
      {status.replace(/_/g, " ")}
    </span>
  );
};

const scenarioLabel = (scenario: string) =>
  (OUTBOUND_SCENARIO_LABELS as Record<string, string>)[scenario] || scenario;

/** Inline attempt chips shown directly in the Attempts table cell. */
const AttemptChips: React.FC<{ call: ScheduledCallItem }> = ({ call }) => {
  const attemptCount = call.attempts?.length || 0;
  if (attemptCount === 0) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap gap-1.5 max-w-[280px]">
      {call.attempts.map((a) => {
        const as = statusStyle(a.status);
        return (
          <Tooltip
            key={a.attemptNumber}
            title={
              <div className="text-xs leading-relaxed">
                <div>
                  Scheduled: {dayjs(a.scheduledAt).format("DD MMM, hh:mm:ss A")}
                </div>
                {a.answeredAt && (
                  <div>
                    Answered: {dayjs(a.answeredAt).format("DD MMM, hh:mm:ss A")}
                  </div>
                )}
                {a.endedAt && (
                  <div>Ended: {dayjs(a.endedAt).format("DD MMM, hh:mm:ss A")}</div>
                )}
                {a.talkDurationSeconds != null && (
                  <div>Talk duration: {a.talkDurationSeconds}s</div>
                )}
              </div>
            }
          >
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border bg-white shrink-0 ${as.border} cursor-default`}
            >
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-slate-900 text-white text-[9px] font-bold shrink-0">
                {a.attemptNumber}
              </span>
              <span className={`text-[11px] font-semibold whitespace-nowrap ${as.text}`}>
                {a.status.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {dayjs(a.scheduledAt).format("hh:mm A")}
              </span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

const ScheduledCalls: React.FC = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScheduledCallsResponse | null>(null);
  const [selected, setSelected] = useState<ScheduledCallItem | null>(null);

  const fetchData = async (start: Dayjs, end: Dayjs) => {
    setLoading(true);
    try {
      const res = await getScheduledCalls(
        start.format(API_DATE_FORMAT),
        end.format(API_DATE_FORMAT),
      );
      setData(res);
    } catch (err) {
      message.error("Failed to load scheduled calls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range[0], range[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calls = data?.calls || [];
  const inProgress = calls.filter(
    (c) => c.finalStatus === "IN_PROGRESS" || c.finalStatus === "INITIATED",
  ).length;
  const answered = calls.filter((c) => c.finalStatus === "ANSWERED").length;
  const pending = calls.length - inProgress - answered;

  const columns: ColumnsType<ScheduledCallItem> = [
    {
      title: "Caller Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (v) => (
        <span className="font-medium text-gray-900 inline-flex items-center gap-1.5">
          <RiPhoneLine className="text-slate-400" />
          {v}
        </span>
      ),
    },
    {
      title: "Scenario",
      dataIndex: "scenario",
      key: "scenario",
      render: (v) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 whitespace-nowrap">
          {scenarioLabel(v)}
        </span>
      ),
    },
    {
      title: "Follow-up Reason",
      dataIndex: "followUpReason",
      key: "followUpReason",
      render: (v) => (
        <span className="text-gray-600">{v ? v.replace(/_/g, " ") : "—"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "finalStatus",
      key: "finalStatus",
      render: (v) => <StatusBadge status={v} />,
    },
    {
      title: "Attempts",
      key: "attempts",
      render: (_, record) => <AttemptChips call={record} />,
    },
    {
      title: "Next Retry",
      dataIndex: "nextRetryAt",
      key: "nextRetryAt",
      render: (v) =>
        v ? (
          <span className="text-gray-500">
            {dayjs(v).format("DD MMM YYYY, hh:mm A")}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) =>
        record.callRecording ? (
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelected(record)}
            className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 !font-medium"
          >
            View
          </Button>
        ) : null,
    },
  ];

  return (
    <VoiceAdminLayout activeKey="scheduled">
      {/* Hero + KPI row */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-white rounded-lg p-4 sm:p-6 mb-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm shrink-0">
              <RiCalendarScheduleLine className="text-[#b8860b] text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Scheduled Calls
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2.5 sm:gap-3">
            <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 lg:min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                {data?.totalCalls ?? 0}
              </div>
              <div className="text-slate-500 text-[11px] sm:text-xs mt-1">Total</div>
            </div>
            <div className="text-center bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 lg:min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-[#b8860b]">
                {inProgress}
              </div>
              <div className="text-slate-500 text-[11px] sm:text-xs mt-1">In Progress</div>
            </div>
            <div className="text-center bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 lg:min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-emerald-600">
                {answered}
              </div>
              <div className="text-slate-500 text-[11px] sm:text-xs mt-1">Answered</div>
            </div>
            <div className="text-center bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 lg:min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-slate-600">
                {pending}
              </div>
              <div className="text-slate-500 text-[11px] sm:text-xs mt-1">Other</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <RangePicker
          value={range}
          format={API_DATE_FORMAT}
          className="w-full sm:w-auto"
          onChange={(vals) => {
            if (vals && vals[0] && vals[1]) {
              setRange([vals[0], vals[1]]);
            }
          }}
        />
        <Button
          type="primary"
          onClick={() => fetchData(range[0], range[1])}
          loading={loading}
          className="w-full sm:w-auto"
          style={{
            background: "linear-gradient(to right, #c9a24b, #b8860b)",
            border: "none",
            fontWeight: 500,
          }}
        >
          Submit
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table
          rowKey={(record, idx) => `${record.phoneNumber}-${idx}`}
          loading={loading}
          columns={columns}
          dataSource={calls}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: true }}
          className="[&_.ant-table-thead_th]:!bg-amber-50 [&_.ant-table-thead_th]:!text-slate-800 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-tbody_td]:!text-slate-700 [&_.ant-table-tbody_tr:hover_td]:!bg-amber-50/40"
        />
      </div>

      <TranscriptModal
        open={!!selected}
        onClose={() => setSelected(null)}
        meta={
          selected?.callRecording
            ? {
                callerNumber: selected.callRecording.callerNumber,
                platform: selected.callRecording.platform,
                callDirection: selected.callRecording.callDirection,
                purpose: selected.callRecording.callPurpose,
                summary: selected.callRecording.callSummary,
                timestamp: selected.callRecording.timestamp,
                recordingUrl: selected.callRecording.recordingUrl,
              }
            : null
        }
        transcript={selected?.callRecording?.transcript}
      />
    </VoiceAdminLayout>
  );
};

export default ScheduledCalls;
