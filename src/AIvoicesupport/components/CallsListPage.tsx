import React, { useEffect, useState } from "react";
import { DatePicker, Table, Button, message, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import {
  RiPhoneLine,
  RiPhoneFindLine,
  RiHeadphoneLine,
} from "react-icons/ri";
import { getInboundCalls, getOutboundCalls, getTranscriptByNumber } from "../api";
import type { CallListItem, CallsResponse } from "../types";
import TranscriptModal from "./TranscriptModal";
import VoiceAdminLayout from "./VoiceAdminLayout";

const { RangePicker } = DatePicker;
const API_DATE_FORMAT = "DD-MM-YYYY";

interface CallsListPageProps {
  direction: "inbound" | "outbound";
}

const CallsListPage: React.FC<CallsListPageProps> = ({ direction }) => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CallsResponse | null>(null);
  const [selected, setSelected] = useState<CallListItem | null>(null);
  const [modalTranscript, setModalTranscript] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const isInbound = direction === "inbound";
  const HeaderIcon = isInbound ? RiPhoneLine : RiPhoneFindLine;

  const fetchData = async (start: Dayjs, end: Dayjs) => {
    setLoading(true);
    try {
      const fetcher =
        direction === "inbound" ? getInboundCalls : getOutboundCalls;
      const res = await fetcher(
        start.format(API_DATE_FORMAT),
        end.format(API_DATE_FORMAT),
      );
      setData(res);
    } catch (err) {
      message.error("Failed to load calls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range[0], range[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  const handleSelectCall = async (record: CallListItem) => {
    setSelected(record);
    const existing = record.transcript || (record as any).conversation;
    if (
      existing &&
      (Array.isArray(existing)
        ? existing.length > 0
        : String(existing).trim().length > 0)
    ) {
      setModalTranscript(existing);
      return;
    }

    const phone = record.callerNumber || record.phoneNumber;
    if (phone) {
      setModalLoading(true);
      try {
        const detail = await getTranscriptByNumber(phone);
        if (detail && detail.transcript) {
          setModalTranscript(detail.transcript);
        } else {
          setModalTranscript(record.rawTranscript || []);
        }
      } catch (e) {
        setModalTranscript(record.rawTranscript || []);
      } finally {
        setModalLoading(false);
      }
    } else {
      setModalTranscript(record.rawTranscript || []);
    }
  };

  const handleCloseModal = () => {
    setSelected(null);
    setModalTranscript(null);
    setModalLoading(false);
  };

  const columns: ColumnsType<CallListItem> = [
    {
      title: "Phone Number",
      key: "phoneNumber",
      render: (_, record) => {
        const num = record.phoneNumber || record.callerNumber;
        return <span className="font-medium text-gray-900">{num || "—"}</span>;
      },
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (v) =>
        v ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-50 to-white text-[#b8860b] border border-amber-200">
            {v}
          </span>
        ) : (
          <span className="text-xs text-gray-400">TVRADHAKRISHNA</span>
        ),
    },
    {
      title: "Purpose",
      key: "callPurpose",
      render: (_, record) => {
        const p = record.callPurpose || record.purpose || record.callScenario;
        return <span className="text-gray-700">{p || "General Inquiry"}</span>;
      },
    },
    {
      title: "Summary",
      key: "callSummary",
      ellipsis: true,
      render: (_, record) => {
        const s = record.callSummary || record.summary;
        return <span className="text-gray-600">{s || "—"}</span>;
      },
    },
    {
      title: "Recording",
      key: "recording",
      width: 120,
      render: (_, record) =>
        record.recordingUrl ? (
          <Tag
            color="gold"
            className="!rounded-full !px-2.5 !py-0.5 !text-xs !font-medium inline-flex items-center gap-1"
          >
            <RiHeadphoneLine /> Audio
          </Tag>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      title: "Time",
      key: "timestamp",
      render: (_, record) => {
        const t = record.timestamp || record.date;
        return (
          <span className="text-gray-500 text-xs">
            {t ? dayjs(t).format("DD MMM YYYY, hh:mm A") : "—"}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleSelectCall(record)}
          className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 !font-medium"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <VoiceAdminLayout activeKey={direction}>
      {/* Hero + KPI row */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-white rounded-lg p-6 mb-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm">
              <HeaderIcon className="text-[#b8860b] text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isInbound ? "Inbound" : "Outbound"} Calls
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {data?.startDate} — {data?.endDate}
              </p>
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-6 py-3 min-w-[110px]">
            <div className="text-2xl font-semibold text-slate-900">
              {data?.totalCalls ?? 0}
            </div>
            <div className="text-slate-500 text-xs mt-1">Total Calls</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-3">
        <RangePicker
          value={range}
          format={API_DATE_FORMAT}
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
          rowKey={(r, idx) => r.id || `${r.callerNumber || r.phoneNumber}-${idx}`}
          loading={loading}
          columns={columns}
          dataSource={data?.calls || []}
          pagination={{ pageSize: 10 }}
          bordered
          className="[&_.ant-table-thead_th]:!bg-amber-50 [&_.ant-table-thead_th]:!text-slate-800 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-tbody_td]:!text-slate-700 [&_.ant-table-tbody_tr:hover_td]:!bg-amber-50/40"
        />
      </div>

      <TranscriptModal
        open={!!selected}
        onClose={handleCloseModal}
        loading={modalLoading}
        meta={
          selected
            ? {
                callerNumber: selected.callerNumber || selected.phoneNumber || "",
                phoneNumber: selected.phoneNumber || selected.callerNumber || "",
                platform: selected.platform,
                callDirection: selected.callDirection,
                callScenario: selected.callScenario,
                purpose: selected.callPurpose || selected.purpose,
                summary: selected.callSummary || selected.summary,
                timestamp: selected.timestamp || selected.date,
                recordingUrl: selected.recordingUrl,
                nextFollowup: selected.nextFollowupAt || selected.nextFollowup,
                disposition: selected.disposition,
                customerSentiment: selected.customerSentiment,
              }
            : null
        }
        transcript={modalTranscript}
      />
    </VoiceAdminLayout>
  );
};

export default CallsListPage;
