import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Input, Table, Tag, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import { COLOR_BORDER, COLOR_PRIMARY } from "./constants";
import type { PdfRecord } from "./types";
import { getApiErrorMessage } from "./utils";

const { Text, Title } = Typography;

const ch = () => ({ style: { textAlign: "center" as const, fontWeight: 700, background: "#fafafa" } });
const cc = () => ({ style: { textAlign: "center" as const, color: "#111827" } });

const tableStyle = `
  .ec-pdf-table .ant-table { background: transparent !important; }
  .ec-pdf-table .ant-table-container { border-radius: 0 !important; box-shadow: none !important; }
  .ec-pdf-table .ant-table-thead > tr > th { background: #fafafa !important; border-bottom: 2px solid ${COLOR_BORDER} !important; }
  .ec-pdf-table .ant-table-tbody > tr.ec-row-even > td { background: #ffffff !important; }
  .ec-pdf-table .ant-table-tbody > tr.ec-row-odd > td { background: #fafafa !important; }
  .ec-pdf-table .ant-table-tbody > tr:hover > td { background: #e6f4ff !important; }
  .ec-pdf-table .ant-table-tbody > tr > td { border-bottom: 1px solid ${COLOR_BORDER} !important; }
`;

const AllPdfsPage: React.FC = () => {
  const [records, setRecords] = useState<PdfRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await customerApi.get<PdfRecord[]>(`${BASE_URL}/ai-automation/pdf/all`);
      setRecords(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to load PDFs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = records.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.fileName?.toLowerCase().includes(q) || r.fileId?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{tableStyle}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>All Documents</Title>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Input.Search
          placeholder="Search by file name or file ID"
          allowClear
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          style={{ width: 280, borderRadius: 8 }}
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

      <Table<PdfRecord>
        rowKey="fileId"
        loading={loading}
        dataSource={filtered}
        bordered
        scroll={{ x: true }}
        size="middle"
        // style={{ background: "transparent" }}
        className="ec-pdf-table"
        rowClassName={(_, idx) => (idx % 2 === 0 ? "ec-row-even" : "ec-row-odd")}
        pagination={{
          current: page, pageSize: 10, showSizeChanger: true,
          showTotal: (t) => `Total ${t} PDFs`,
          onChange: (p) => setPage(p),
        }}
        locale={{ emptyText: <Text type="secondary">No PDFs uploaded yet.</Text> }}
        columns={[
          {
            title: "S.No", key: "serial",
            onHeaderCell: ch, onCell: cc,
            render: (_: any, __: PdfRecord, idx: number) => (page - 1) * 10 + idx + 1,
          },
          {
            title: "File Name", dataIndex: "fileName", key: "fileName",
            onHeaderCell: ch, onCell: cc,
            render: (v: string) => <Text strong style={{ color: "#111827" }}>{v}</Text>,
          },
          {
            title: "File ID", dataIndex: "fileId", key: "fileId",
            onHeaderCell: ch, onCell: cc,
            render: (v: string) => (
              <Text code >
                {v}
              </Text>
            ),
          },
          {
            title: "Status", dataIndex: "status", key: "status",
            onHeaderCell: ch, onCell: cc,
            render: (v: string) => (
              <Tag color={v === "COMPLETED" ? "success" : "processing"} style={{ borderRadius: 20, fontWeight: 700 }}>
                {v}
              </Tag>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AllPdfsPage;
