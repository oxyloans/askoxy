import React, { useEffect, useState } from "react";
import { DatePicker, Table, Button, message } from "antd";
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { RiPhoneLine, RiPhoneFindLine } from "react-icons/ri";
import { getInboundCalls, getOutboundCalls } from "../api";
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

  const columns: ColumnsType<CallListItem> = [
    {
      title: "Caller Number",
      dataIndex: "callerNumber",
      key: "callerNumber",
      render: (v) => <span className="font-medium text-gray-900">{v}</span>,
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (v) =>
        v ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200">
            {v}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Unknown</span>
        ),
    },
    {
      title: "Purpose",
      dataIndex: "callPurpose",
      key: "callPurpose",
      render: (v) => <span className="text-gray-600">{v || "—"}</span>,
    },
    {
      title: "Summary",
      dataIndex: "callSummary",
      key: "callSummary",
      ellipsis: true,
      render: (v) => <span className="text-gray-600">{v || "—"}</span>,
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (v) => (
        <span className="text-gray-500">
          {dayjs(v).format("DD MMM YYYY, hh:mm A")}
        </span>
      ),
      // sorter: (a, b) =>
      //   dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf(),
      // defaultSortOrder: "descend",
    },

    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelected(record)}
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
        {" "}
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
            {" "}
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
          rowKey="id"
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
        onClose={() => setSelected(null)}
        meta={
          selected
            ? {
                callerNumber: selected.callerNumber,
                platform: selected.platform,
                callDirection: selected.callDirection,
                purpose: selected.callPurpose,
                summary: selected.callSummary,
                timestamp: selected.timestamp,
                recordingUrl: selected.recordingUrl,
              }
            : null
        }
        transcript={selected?.transcript}
      />
    </VoiceAdminLayout>
  );
};

export default CallsListPage;
