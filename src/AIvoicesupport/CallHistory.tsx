import React, { useState } from "react";
import { Input, Button, message, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiSearchLine,
  RiHistoryLine,
  RiPlayCircleLine,
  RiHeadphoneLine,
} from "react-icons/ri";
import dayjs from "dayjs";
import { getCallHistory, getTranscriptByNumber } from "./api";
import type { CallHistoryItem, CallDetail } from "./types";
import TranscriptModal, { CallMeta } from "./components/TranscriptModal";
import VoiceAdminLayout from "./components/VoiceAdminLayout";

const normalizeCallerNumber = (raw: string): string => {
  let digits = raw.trim().replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(-10);
  }
  if (!digits.startsWith("0")) {
    digits = `0${digits}`;
  }
  return digits;
};

const CallHistory: React.FC = () => {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CallHistoryItem[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchedNumber, setSearchedNumber] = useState("");

  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [modalMeta, setModalMeta] = useState<CallMeta | null>(null);
  const [modalTranscript, setModalTranscript] = useState<any>(null);

  const handleSearch = async () => {
    if (!number.trim()) {
      message.warning("Enter a caller number to search.");
      return;
    }
    const normalized = normalizeCallerNumber(number);
    setNumber(normalized);
    setLoading(true);
    setSearched(true);
    setSearchedNumber(normalized);
    try {
      const res = await getCallHistory(normalized);
      setHistory(res);
    } catch (err) {
      message.error("Failed to load call history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCall = async (record: CallHistoryItem) => {
    const meta: CallMeta = {
      callerNumber: record.callerNumber,
      phoneNumber: record.phoneNumber || record.callerNumber,
      platform: record.platform || "TVRADHAKRISHNA",
      callDirection: record.callDirection,
      callScenario: record.callScenario,
      purpose: record.purpose || record.callPurpose || record.callScenario,
      summary: record.summary || record.callSummary,
      timestamp: record.date || record.timestamp,
      date: record.date,
      recordingUrl: record.recordingUrl,
      disposition: record.disposition,
      customerSentiment: record.customerSentiment,
      nextFollowup: record.nextFollowupAt || record.nextFollowup,
      promisedPaymentDate: record.promisedPaymentDate,
    };

    setModalMeta(meta);
    setTranscriptOpen(true);

    const existingTranscript =
      record.transcript ||
      record.conversation ||
      (record as any).rawTranscript;

    if (
      existingTranscript &&
      (Array.isArray(existingTranscript)
        ? existingTranscript.length > 0
        : String(existingTranscript).trim().length > 0)
    ) {
      setModalTranscript(existingTranscript);
      setTranscriptLoading(false);
      return;
    }

    setTranscriptLoading(true);
    try {
      const detail: CallDetail = await getTranscriptByNumber(record.callerNumber);
      if (detail && detail.transcript) {
        setModalTranscript(detail.transcript);
        if (!meta.summary && detail.summary) {
          setModalMeta((prev) => (prev ? { ...prev, summary: detail.summary } : prev));
        }
        if (!meta.recordingUrl && detail.recordingUrl) {
          setModalMeta((prev) => (prev ? { ...prev, recordingUrl: detail.recordingUrl } : prev));
        }
      } else {
        setModalTranscript([]);
      }
    } catch (err) {
      setModalTranscript([]);
    } finally {
      setTranscriptLoading(false);
    }
  };

  const handleCloseModal = () => {
    setTranscriptOpen(false);
    setModalMeta(null);
    setModalTranscript(null);
    setTranscriptLoading(false);
  };

  const columns: ColumnsType<CallHistoryItem> = [
    {
      title: "Direction",
      dataIndex: "callDirection",
      key: "callDirection",
      width: 120,
      render: (v) => (
        <Tag
          className="!rounded-full !px-3 !py-1 !font-semibold !text-xs"
          color={v === "INBOUND" ? "blue" : "purple"}
        >
          {v}
        </Tag>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (v) => (
        <span className="text-slate-600 text-xs">
          {v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "—"}
        </span>
      ),
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (v) =>
        v ? (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-white text-[#b8860b] border border-amber-200">
            {v}
          </span>
        ) : (
          <span className="text-xs text-gray-400">TVRADHAKRISHNA</span>
        ),
    },
    {
      title: "Purpose",
      key: "purpose",
      render: (_, record) => {
        const p = record.purpose || record.callPurpose || record.callScenario;
        return <span className="text-slate-700 text-xs">{p || "General Inquiry"}</span>;
      },
    },
    {
      title: "Summary",
      key: "summary",
      ellipsis: true,
      render: (_, record) => {
        const s = record.summary || record.callSummary;
        return <span className="text-slate-600 text-xs">{s || "—"}</span>;
      },
    },
    {
      title: "Recording",
      key: "recording",
      width: 110,
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
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          icon={<RiPlayCircleLine />}
          onClick={() => handleViewCall(record)}
          className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 !font-medium"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <VoiceAdminLayout activeKey="history">
      {/* Intro hero */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-white rounded-lg p-6 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm">
            <RiHistoryLine className="text-[#b8860b] text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Call History Lookup
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Search every past call, summary, voice recording, and conversation turns for a specific number
            </p>
          </div>
        </div>
      </div>

      {!searched ? (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-16 text-center">
          <RiSearchLine className="text-4xl text-amber-200 mx-auto mb-3" />
          <p className="text-slate-400 mb-5">
            Search a caller number to see their call history
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              size="large"
              placeholder="Enter caller number, e.g. 09849257032 or 9849257032"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<RiSearchLine className="text-gray-400" />}
              className="rounded-lg"
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              loading={loading}
              style={{
                background: "linear-gradient(to right, #c9a24b, #b8860b)",
                border: "none",
                fontWeight: 600,
              }}
            >
              Search
            </Button>
          </div>
        </div>
      ) : (
        <Spin spinning={loading}>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 to-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 whitespace-nowrap">
                History for {searchedNumber} ({history?.length || 0} calls found)
              </h3>
              <div className="flex gap-2 w-full md:w-auto md:max-w-sm">
                <Input
                  placeholder="Enter caller number, e.g. 09849257032"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<RiSearchLine className="text-gray-400" />}
                  className="rounded-lg"
                />
                <Button
                  type="primary"
                  onClick={handleSearch}
                  loading={loading}
                  style={{
                    background: "linear-gradient(to right, #c9a24b, #b8860b)",
                    border: "none",
                    fontWeight: 600,
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
            <Table
              rowKey={(record, idx) =>
                `${record.callerNumber}-${record.date || record.timestamp}-${idx}`
              }
              columns={columns}
              dataSource={history || []}
              pagination={{ pageSize: 10 }}
              bordered
              locale={{
                emptyText: (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No history found for this number
                  </div>
                ),
              }}
              className="[&_.ant-table-thead_th]:!bg-amber-50 [&_.ant-table-thead_th]:!text-slate-800 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-tbody_td]:!text-slate-700 [&_.ant-table-tbody_tr:hover_td]:!bg-amber-50/40"
            />
          </div>
        </Spin>
      )}

      <TranscriptModal
        open={transcriptOpen}
        onClose={handleCloseModal}
        loading={transcriptLoading}
        meta={modalMeta}
        transcript={modalTranscript}
      />
    </VoiceAdminLayout>
  );
};

export default CallHistory;
