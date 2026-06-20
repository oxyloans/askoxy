import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Input, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import { COLOR_BORDER, COLOR_PRIMARY } from "./constants";

const { Text, Title } = Typography;

const BASE = "http://65.0.147.157:9041/api/ai-automation";

interface CampaignRow {
  key: string;
  serial: number;
  campaignId: string;
  totalClients: number;
}

const ch = () => ({ style: { textAlign: "center" as const, fontWeight: 700, background: "#fafafa" } });
const cc = () => ({ style: { textAlign: "center" as const, color: "#111827" } });

const tableStyle = `
  .ec-camp-table .ant-table { background: transparent !important; }
  .ec-camp-table .ant-table-container { border-radius: 0 !important; box-shadow: none !important; }
  .ec-camp-table .ant-table-thead > tr > th { background: #fafafa !important; border-bottom: 2px solid ${COLOR_BORDER} !important; }
  .ec-camp-table .ant-table-tbody > tr.ec-row-even > td { background: #ffffff !important; }
  .ec-camp-table .ant-table-tbody > tr.ec-row-odd > td { background: #fafafa !important; }
  .ec-camp-table .ant-table-tbody > tr:hover > td { background: #e6f4ff !important; }
  .ec-camp-table .ant-table-tbody > tr > td { border-bottom: 1px solid ${COLOR_BORDER} !important; }
`;

const AllCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${BASE}/admin/campaigns/ids`);
      if (!r.ok) throw new Error(`Failed to load campaigns (${r.status})`);
      const data: { campaignId: string; totalClients: number }[] = await r.json();
      setCampaigns(
        data.map((d, i) => ({ key: d.campaignId, serial: i + 1, campaignId: d.campaignId, totalClients: d.totalClients }))
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = campaigns.filter((c) => {
    const q = search.trim().toLowerCase();
    return !q || c.campaignId.toLowerCase().includes(q);
  });

  const columns: ColumnsType<CampaignRow> = [
    { title: "S.No", dataIndex: "serial", key: "serial",onHeaderCell: ch, onCell: cc },
    {
      title: "Campaign ID", dataIndex: "campaignId", key: "campaignId",
      onHeaderCell: ch, onCell: cc,
      render: (v: string) => (
        <Text code>
          {v}
        </Text>
      ),
    },
    {
      title: "Total Clients", dataIndex: "totalClients", key: "totalClients", 
      onHeaderCell: ch, onCell: cc,
      render: (v: number) => <Text strong >{v}</Text>,
    },
    {
      title: "Actions", key: "actions",
      onHeaderCell: ch,
      onCell: () => ({ style: { textAlign: "center" as const } }),
      render: (_: any, row: CampaignRow) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            size="middle"
            type="primary"
            style={{ borderRadius: 8, fontWeight: 400, background: COLOR_PRIMARY, borderColor: COLOR_PRIMARY }}
            onClick={() => { window.location.href = `/email-campaign/scorecard/${row.campaignId}`; }}
          >
            View Scorecard
          </Button>
          <Button
            size="middle"
            style={{ borderRadius: 8, fontWeight: 600, borderColor: "#531dab", color: "#531dab" }}
            onClick={() => { window.location.href = `/email-campaign/conversations/${row.campaignId}`; }}
          >
            View Conversations
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{tableStyle}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>Campaign Manager</Title>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Input.Search
            placeholder="Search by campaign ID"
            allowClear
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            onSearch={(v) => { setSearch(v); setPage(1); }}
            style={{ width: 240, borderRadius: 8 }}
          />
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={fetchAll}
            style={{ borderRadius: 8, borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY, fontWeight: 600 }}
          >
            Reload
          </Button>
        </div>
      </div>

      {error && <Alert type="error" showIcon message={error} style={{ borderRadius: 10 }} />}

      <Table<CampaignRow>
        columns={columns}
        dataSource={filtered}
        loading={loading}
        bordered
        scroll={{ x: true }}
        size="middle"
        // style={{ background: "transparent" }}
        className="ec-camp-table"
        rowClassName={(_, idx) => (idx % 2 === 0 ? "ec-row-even" : "ec-row-odd")}
        pagination={{
          current: page,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (t) => `Total ${t} campaigns`,
          onChange: (p) => setPage(p),
        }}
        locale={{ emptyText: <Text type="secondary">No campaigns found.</Text> }}
      />
    </div>
  );
};

export default AllCampaignsPage;
