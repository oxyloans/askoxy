import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Spin, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { COLOR_BORDER, COLOR_PRIMARY, COLOR_TEXT } from "./constants";
import BASE_URL from "../../Config";
import customerApi from "../../utils/axiosInstances";
const { Text, Title, Paragraph } = Typography;

const BASE = `${BASE_URL}/ai-automation`;

/* ── interfaces ── */
interface ReplyRound {
  sessionId: string;
  clientReplyContent: string;
  generatedSubject: string;
  generatedBody: string;
  status: string;
  accumulatedFeedback: string;
  createdAt: string;
  lastUpdatedAt: string;
}

interface Conversation {
  clientEmail: string;
  clientName: string;
  replyStatus: string;
  originalEmail: {
    subject: string;
    body: string;
    status: string;
    sentMessageId: string;
    sentAt: string;
  };
  replyRounds: ReplyRound[];
}

interface ConversationsResponse {
  campaignId: string;
  totalClients: number;
  conversations: Conversation[];
}

interface ConvRow {
  key: string;
  serial: number;
  clientName: string;
  clientEmail: string;
  replyStatus: string;
  originalSubject: string;
  sentAt: string;
  replyRounds: ReplyRound[];
}

/* ── helpers ── */
const fmtDate = (v?: string) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        // hour: "2-digit", minute: "2-digit",
      })
    : "—";

const REPLY_STATUS_COLOR: Record<string, string> = {
  REPLIED: "success",
  NO_REPLY: "warning",
  PENDING: "processing",
  FAILED: "error",
};

const ch = () => ({ style: { textAlign: "center" as const, fontWeight: 700, background: "#fafafa" } });
const cc = () => ({ style: { textAlign: "center" as const, color: "#111827" } });

/* ── reply rounds sub-table ── */
const roundColumns: ColumnsType<ReplyRound & { key: string; serial: number }> = [
  { title: "S.No",              dataIndex: "serial",               key: "serial",                onHeaderCell: ch, onCell: cc },
  { title: "Session ID",     dataIndex: "sessionId",            key: "sessionId",            onHeaderCell: ch, onCell: cc, render: (v) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
  { title: "Client Reply",   dataIndex: "clientReplyContent",   key: "clientReplyContent",   onHeaderCell: ch, onCell: cc },
  { title: "Gen. Subject",   dataIndex: "generatedSubject",     key: "generatedSubject",     onHeaderCell: ch, onCell: cc },
  // { title: "Gen. Body",      dataIndex: "generatedBody",        key: "generatedBody",        onHeaderCell: ch, onCell: cc,
  //   render: (v: string) => (
  //     <Paragraph ellipsis={{ rows: 2, expandable: true }} style={{ margin: 0, fontSize: 12, maxWidth: 260 }}>{v}</Paragraph>
  //   ),
  // },
  { title: "Status",         dataIndex: "status",               key: "status",               onHeaderCell: ch, onCell: cc,
    render: (v: string) => <Tag color={REPLY_STATUS_COLOR[v] ?? "default"} style={{ borderRadius: 20, fontWeight: 400 }}>{v}</Tag>,
  },
  { title: "Feedback",       dataIndex: "accumulatedFeedback",  key: "accumulatedFeedback",  onHeaderCell: ch, onCell: cc },
  { title: "Created Date",     dataIndex: "createdAt",            key: "createdAt",            onHeaderCell: ch, onCell: cc, render: fmtDate },
  { title: "Last Updated",   dataIndex: "lastUpdatedAt",        key: "lastUpdatedAt",        onHeaderCell: ch, onCell: cc, render: fmtDate },
];

/* ── main columns ── */
const convColumns = (
  expanded: Record<string, boolean>,
  toggleExpand: (key: string) => void
): ColumnsType<ConvRow> => [
  { title: "S.No",            dataIndex: "serial",          key: "serial",          onHeaderCell: ch, onCell: cc },
  { title: "Client Name",  dataIndex: "clientName",      key: "clientName",      onHeaderCell: ch, onCell: cc },
  { title: "Email",        dataIndex: "clientEmail",     key: "clientEmail",     onHeaderCell: ch, onCell: cc },
  {
    title: "Reply Status", dataIndex: "replyStatus", key: "replyStatus", onHeaderCell: ch, onCell: cc,
    render: (v: string) => (
      <Tag color={REPLY_STATUS_COLOR[v] ?? "default"} style={{ borderRadius: 20, fontWeight: 700 }}>{v || "—"}</Tag>
    ),
  },
  { title: "Email Subject", dataIndex: "originalSubject", key: "originalSubject", onHeaderCell: ch, onCell: cc },
  { title: "Sent At",       dataIndex: "sentAt",          key: "sentAt",          onHeaderCell: ch, onCell: cc, render: fmtDate },
  {
    title: "Reply Rounds", key: "rounds", width: 140, onHeaderCell: ch,
    onCell: () => ({ style: { textAlign: "center" as const } }),
    render: (_: any, row: ConvRow) =>
      row.replyRounds.length > 0 ? (
        <Button
          size="small"
          style={{ borderRadius: 8, borderColor: "#531dab", color: "#531dab", fontWeight: 600 }}
          onClick={() => toggleExpand(row.key)}
        >
          {expanded[row.key] ? "Hide" : `View (${row.replyRounds.length})`}
        </Button>
      ) : (
        <Text type="secondary" style={{ fontSize: 12 }}>None</Text>
      ),
  },
];

/* ── component ── */
const CampaignConversations: React.FC = () => {
  const { batchId: paramBatchId } = useParams<{ batchId: string }>();

  const batchId = paramBatchId || sessionStorage.getItem("campaignBatchId") || "";
  const [data, setData]       = useState<ConversationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError("");
    try {
      const r = await customerApi.get<ConversationsResponse>(`${BASE}/admin/campaigns/${batchId}/conversations`);
      const json = r.data;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const rows: ConvRow[] = (data?.conversations ?? []).map((c, i) => ({
    key: `${c.clientEmail}-${i}`,
    serial: i + 1,
    clientName: c.clientName,
    clientEmail: c.clientEmail,
    replyStatus: c.replyStatus,
    originalSubject: c.originalEmail?.subject ?? "—",
    sentAt: c.originalEmail?.sentAt ?? "",
    replyRounds: c.replyRounds ?? [],
  }));

  const tableStyle = `
    .ec-conv-table .ant-table { background: transparent !important; }
    .ec-conv-table .ant-table-container { border-radius: 0 !important; box-shadow: none !important; }
    .ec-conv-table .ant-table-thead > tr > th { background: #fafafa !important; border-bottom: 2px solid ${COLOR_BORDER} !important; }
    .ec-conv-table .ant-table-tbody > tr.ec-row-even > td { background: #ffffff !important; }
    .ec-conv-table .ant-table-tbody > tr.ec-row-odd > td { background: #fafafa !important; }
    .ec-conv-table .ant-table-tbody > tr:hover > td { background: #e6f4ff !important; }
    .ec-conv-table .ant-table-tbody > tr > td { border-bottom: 1px solid ${COLOR_BORDER} !important; }
  `;

  if (!batchId) {
    return (
      <Alert
        type="warning"
        showIcon
        message="No campaign selected"
        description="Go to Campaign Scorecard, choose a campaign and click View Conversations."
        style={{ borderRadius: 12 }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{tableStyle}</style>

      {/* back button */}
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => { window.location.href = "/email-campaign/all-campaigns"; }}
          style={{ borderRadius: 8, fontWeight: 600, borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY }}
        >
          Back to Campaign Details
        </Button>
      </div>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={5} style={{ margin: 0, color: COLOR_TEXT }}>
            Conversations &nbsp;
            {/* <Text code style={{ fontSize: 12, color: "#0958d9", background: "#e6f4ff", border: "1px solid #91caff", borderRadius: 6, padding: "1px 7px" }}>
              {batchId}
            </Text> */}
          </Title>
          {data && (
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
              Total clients: {data.totalClients} · {rows.length} conversations loaded
            </Text>
          )}
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchData}
          style={{ borderRadius: 8, borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY, fontWeight: 600 }}
        >
          Refresh
        </Button>
      </div>

      {error && <Alert type="error" showIcon message={error} style={{ borderRadius: 10 }} />}

      {loading && !data && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 14, color: "#6b7280" }}>Loading conversations…</Paragraph>
        </div>
      )}

      {/* main table */}
      {data && (
        <>
          <Table<ConvRow>
            columns={convColumns(expanded, toggleExpand)}
            dataSource={rows}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} clients` }}
            scroll={{ x: true }}
            size="middle"
            bordered
            style={{ background: "transparent" }}
            className="ec-conv-table"
            rowClassName={(_, idx) => (idx % 2 === 0 ? "ec-row-even" : "ec-row-odd")}
            expandable={{
              expandedRowKeys: Object.keys(expanded).filter((k) => expanded[k]),
              expandedRowRender: (row) =>
                row.replyRounds.length > 0 ? (
                  <div style={{ padding: "12px 0" }}>
                    <Text strong style={{ marginBottom: 10, display: "block", color: "#531dab" }}>
                      Reply Rounds for {row.clientName}
                    </Text>
                    <Table
                      columns={roundColumns}
                      dataSource={row.replyRounds.map((rr, i) => ({ ...rr, key: `${rr.sessionId}-${i}`, serial: i + 1 }))}
                      pagination={false}
                      scroll={{ x: true }}
                      size="small"
                      bordered
                    />
                  </div>
                ) : null,
              rowExpandable: (row) => row.replyRounds.length > 0,
              showExpandColumn: false,
            }}
          />
        </>
      )}
    </div>
  );
};

export default CampaignConversations;
