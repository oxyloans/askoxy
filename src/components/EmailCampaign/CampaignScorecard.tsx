import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Row, Spin, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { COLOR_PRIMARY, COLOR_TEXT } from "./constants";
import BASE_URL from "../../Config";  
import customerApi from "../../utils/axiosInstances";
const { Text, Title, Paragraph } = Typography;

const BASE = `${BASE_URL}/ai-automation`;



interface ScorecardData {
  campaignId: string;
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  totalReplied: number;
  totalNoReply: number;
  lastComputedAt: string;
}

interface CampaignDetail {
  campaignId: string;
  campaignName: string;
  csvFileName: string;
  csvS3Key: string;
  totalRecipients: number;
  status: string;
  createdAt: string;
  lastUpdatedAt: string;
  completedAt: string;
}

interface DetailRow {
  key: string;
  campaignId: React.ReactNode;
  campaignName: string;
  csvFileName: string;
  totalRecipients: number;
  status: React.ReactNode;
  createdAt: string;
  lastUpdatedAt: string;
  completedAt: string;
  csvS3Key: React.ReactNode;
}

/* ── helpers ── */
const STATUS_COLOR: Record<string, string> = {
  COMPLETED: "success",
  PENDING: "warning",
  PROCESSING: "processing",
  FAILED: "error",
};

const fmtDate = (v?: string) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
       
      })
    : "—";

const STAT_CARDS = [
  { label: "Total Recipients", value: (s: ScorecardData) => s.totalRecipients, bg: "#e6f4ff", color: "#0958d9", border: "#91caff" },
  { label: "Sent",             value: (s: ScorecardData) => s.totalSent,       bg: "#f6ffed", color: "#389e0d", border: "#b7eb8f" },
  { label: "Failed",           value: (s: ScorecardData) => s.totalFailed,     bg: "#fff1f0", color: "#cf1322", border: "#ffa39e" },
  { label: "Replied",          value: (s: ScorecardData) => s.totalReplied,    bg: "#f9f0ff", color: "#531dab", border: "#d3adf7" },
  { label: "No Reply",         value: (s: ScorecardData) => s.totalNoReply,    bg: "#fffbe6", color: "#d46b08", border: "#ffe58f" },
  {
    label: "Reply Rate",
    value: (s: ScorecardData) =>
      `${s.totalSent > 0 ? ((s.totalReplied / s.totalSent) * 100).toFixed(1) : "0.0"}%`,
    bg: "#e6fffb", color: "#08979c", border: "#87e8de",
  },
];

const ch = () => ({ style: { textAlign: "center" as const, fontWeight: 700, background: "#fafafa" } });
const cc = () => ({ style: { textAlign: "center" as const, color: "#111827" } });

const detailColumns: ColumnsType<DetailRow> = [
  { title: "Campaign ID",      dataIndex: "campaignId",      key: "campaignId",      onHeaderCell: ch, onCell: cc },
  { title: "Campaign Name",    dataIndex: "campaignName",    key: "campaignName",    onHeaderCell: ch, onCell: cc },
  { title: "CSV File",         dataIndex: "csvFileName",     key: "csvFileName",     onHeaderCell: ch, onCell: cc },
  { title: "Total Recipients", dataIndex: "totalRecipients", key: "totalRecipients", onHeaderCell: ch, onCell: cc },
 
  { title: "Created Date",    dataIndex: "createdAt",    key: "createdAt",    onHeaderCell: ch, onCell: cc, render: fmtDate },
  { title: "Last Updated",  dataIndex: "lastUpdatedAt", key: "lastUpdatedAt", onHeaderCell: ch, onCell: cc, render: fmtDate },
  { title: "Completed Date",  dataIndex: "completedAt",  key: "completedAt",  onHeaderCell: ch, onCell: cc, render: fmtDate },
  { title: "Status",           dataIndex: "status",          key: "status",          onHeaderCell: ch, onCell: cc },
];

/* ── component ── */
const CampaignScorecard: React.FC = () => {
  const { batchId: paramBatchId } = useParams<{ batchId: string }>();
  
  const isStandalone = !!paramBatchId;
  const [selectedId, setSelectedId]     = useState<string>(paramBatchId ?? "");
  const [scorecard, setScorecard]       = useState<ScorecardData | null>(null);
  const [detail, setDetail]             = useState<CampaignDetail | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

const fetchScorecard = useCallback(async (batchId: string) => {
    if (!batchId) return;
    setLoading(true);
    setError("");
    try {
      const [sc, dt] = await  Promise.all([
        customerApi.get<ScorecardData>(`${BASE}/${batchId}/scorecard`).then((r) => r.data),
        customerApi.get<CampaignDetail>(`${BASE}/${batchId}`).then((r) => r.data),
      ]);
      setScorecard(sc);
      setDetail(dt);
      setLastRefreshed(new Date());
    } catch (e: any) {
      setError(e?.message ?? "Failed to load scorecard data.");
    } finally {
      setLoading(false);
    }
  }, []);

 
  useEffect(() => {
    if (!selectedId) return;
    fetchScorecard(selectedId);
   
  }, [selectedId, fetchScorecard]);



  const detailRows: DetailRow[] = detail
    ? [
        {
          key: "1",
          campaignId:      <Text code style={{ fontSize: 13 }}>{detail.campaignId}</Text>,
          campaignName:    detail.campaignName,
          csvFileName:     detail.csvFileName,
          totalRecipients: detail.totalRecipients,
          status: (
            <Tag color={STATUS_COLOR[detail.status] ?? "default"} style={{ fontWeight: 700, borderRadius: 20, fontSize: 13, padding: "2px 12px" }}>
              {detail.status}
            </Tag>
          ),
          createdAt:     detail.createdAt,
          lastUpdatedAt: detail.lastUpdatedAt,
          completedAt:   detail.completedAt,
          csvS3Key: <Text type="secondary" style={{ wordBreak: "break-all", fontSize: 12 }}>{detail.csvS3Key}</Text>,
        },
      ]
    : [];



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* back button for standalone mode */}
      {isStandalone && (
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => { window.location.href = "/email-campaign/all-campaigns"; }}
            style={{ borderRadius: 8, fontWeight: 400, borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY }}
          >
            Back to Campaign Details
          </Button>
        </div>
      )}

  
      {selectedId && (
        <>
          {error && <Alert type="error" showIcon message={error} style={{ borderRadius: 10 }} />}

          {loading && !scorecard && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 14, color: "#6b7280" }}>Loading scorecard…</Paragraph>
            </div>
          )}

          {scorecard && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <Title level={5} style={{ margin: 0, color: COLOR_TEXT }}>
                    Email Delivery Scorecard &nbsp;
                    
                  </Title>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                 
                  <Button
                    size="small"
                    icon={<ReloadOutlined spin={loading} />}
                    loading={loading}
                    onClick={() => fetchScorecard(selectedId)}
                    style={{ borderRadius: 8, borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                {STAT_CARDS.map((card) => (
                  <Col key={card.label} xs={12} sm={8} md={4}>
                    <div
                      style={{
                        background: card.bg,
                        border: `1.5px solid ${card.border}`,
                        borderRadius: 14,
                        padding: "20px 12px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                    >
                      <Text style={{ fontSize: 30, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                        {card.value(scorecard)}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: 600, color: card.color, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {card.label}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {detail && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <Title level={5} style={{ margin: 0, color: COLOR_TEXT }}>Campaign Details</Title>
                <Tag color={STATUS_COLOR[detail.status] ?? "default"} style={{ fontWeight: 700, borderRadius: 20, fontSize: 13, padding: "2px 14px" }}>
                  {detail.status}
                </Tag>
              </div>
              <Table<DetailRow>
                columns={detailColumns}
                dataSource={detailRows}
                pagination={false}
                scroll={{ x: true }}
                size="middle"

                style={{ background: "transparent" }}
                className="ec-scorecard-table"
                rowClassName={(_, idx) => (idx % 2 === 0 ? "ec-row-even" : "ec-row-odd")}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignScorecard;
