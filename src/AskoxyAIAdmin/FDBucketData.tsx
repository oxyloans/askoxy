import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Descriptions, Image, Input, Modal, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { BankOutlined, CalendarOutlined, IdcardOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { adminApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Text, Title } = Typography;

interface FDBucketRecord {
  id: string;
  name: string | null;
  mobileNumber: string | null;
  image: string | null;
  text: string | null;
  createdAt: number | string | null;
  applicantName: string | null;
  borrowerId: string | null;
  requiredAmount: string | null;
  country: string | null;
  occupation: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  branchName: string | null;
  tenure: string | null;
  interest: string | null;
  interestPaidInAdvance: string | null;
  source: string | null;
  university: string | null;
  leadName: string | null;
  fileInfo: string | null;
  fileDate: string | null;
  fileNumber: string | null;
}

interface FDBucketResponse {
  content: FDBucketRecord[];
  totalElements: number;
  number: number;
  size: number;
}

const display = (value: unknown) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const formatDate = (value: FDBucketRecord["createdAt"]) => {
  if (!value) return "—";
  const date = new Date(typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value);
  if (Number.isNaN(date.getTime())) return String(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
};

const formatAmount = (value: string | null) => {
  if (!value) return "—";
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
    : value;
};

const FDBucketData: React.FC = () => {
  const [records, setRecords] = useState<FDBucketRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<FDBucketRecord | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.get<FDBucketResponse>(
        `${BASE_URL}/ai-service/agent/getFDBucketData`,
        { params: { page: page - 1, size: pageSize } },
      );
      setRecords(Array.isArray(response.data?.content) ? response.data.content : []);
      setTotal(Number(response.data?.totalElements) || 0);
    } catch (requestError) {
      console.error("Failed to fetch FD bucket data:", requestError);
      setRecords([]);
      setError("Unable to load FD bucket data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return records;

    return records.filter((record) =>
      [record.applicantName, record.name, record.mobileNumber, record.borrowerId]
        .some((value) => String(value ?? "").toLowerCase().includes(query)),
    );
  }, [records, searchText]);

  const columns: TableProps<FDBucketRecord>["columns"] = [
    {
      title: "S.No",
      width: 70,
      render: (_value, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: <Text strong>Applicant</Text>,
      key: "applicant",
      align:"left",
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{display(record.applicantName || record.name)}</Text>
          <Text type="secondary">{display(record.mobileNumber)}</Text>
        </Space>
      ),
    },
    {
      title: <Text strong>Borrower ID</Text>,
      dataIndex: "borrowerId",
      align: "center",
      render: (value) => <Text strong>{display(value)}</Text>,
    },
    {
      title: <Text strong>Required Amount</Text>,
      dataIndex: "requiredAmount",
      render: (value) => <Text strong style={{ color: "#008cba" }}>{formatAmount(value)}</Text>,
      align:"center",
    },
    {
      title: "Profile",
      key: "profile",
      align:"center",
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <span>{display(record.occupation)}</span>
          {record.country && <Tag color="blue">{record.country}</Tag>}
        </Space>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      align:"center",
      render: (value) => (value ? <Tag color="purple">{value}</Tag> : "—"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      align:"center",
      render: formatDate,
    },
    {
      title: "Action",
      key: "action",
      align:"center",
      render: (_value, record) => <Button type="primary" size="small" style={{ background: "#008cba", borderColor: "#008cba" }} onClick={() => setSelected(record)}>View Details</Button>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5">
      <div className="mx-auto max-w-7xl">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title level={3} style={{ margin: 0 }}>FD Bucket Data</Title>
            <Text type="secondary">AskOxy AI applicant and borrower submissions</Text>
          </div>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: "#008cba" }} />}
            placeholder="Search name, mobile number or borrower ID"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            style={{ width: "min(100%, 380px)" }}
          />
        </div>

        {error && <Alert className="mb-4" type="error" showIcon message={error} action={<Button type="primary" size="small" style={{ background: "#1ab394", borderColor: "#1ab394" }} onClick={fetchRecords}>Retry</Button>} />}

        <Table<FDBucketRecord>
          rowKey="id"
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          scroll={{ x: true }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (count, range) => `${range[0]}-${range[1]} of ${count}`,
            onChange: (nextPage, nextSize) => {
              setPage(nextSize !== pageSize ? 1 : nextPage);
              setPageSize(nextSize);
            },
          }}
        />
      </Card>

      <Modal
        title={<Space><IdcardOutlined /><span>FD Applicant Details</span></Space>}
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={<Button type="primary" style={{ background: "#008cba", borderColor: "#008cba" }} onClick={() => setSelected(null)}>Close</Button>}
        width={860}
        centered
        styles={{ body: { maxHeight: "75vh", overflowY: "auto", paddingTop: 16 } }}
      >
        {selected && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card size="small" style={{ background: "#f2fbfd", borderColor: "#008cba" }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="auto">
                  <Text type="secondary"><UserOutlined /> Applicant</Text>
                  <Title level={4} style={{ margin: "2px 0" }}>{display(selected.applicantName || selected.name)}</Title>
                  <Text>{display(selected.mobileNumber)}</Text>
                </Col>
                <Col xs={24} sm={9}>
                  <Statistic title={<Text strong>Required Amount</Text>} value={formatAmount(selected.requiredAmount)} valueStyle={{ color: "#008cba", fontSize: 22, fontWeight: 700 }} />
                </Col>
              </Row>
            </Card>

            <Card size="small" title={<Space><IdcardOutlined /><Text strong>Loan Information</Text></Space>}>
              <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 600, background: "#fafafa" }} contentStyle={{ fontWeight: 500 }}>
                <Descriptions.Item label="Borrower ID"><Text strong>{display(selected.borrowerId)}</Text></Descriptions.Item>
                <Descriptions.Item label="Source">{selected.source ? <Tag color="purple">{selected.source}</Tag> : "-"}</Descriptions.Item>
                <Descriptions.Item label="Tenure">{selected.tenure ? `${selected.tenure} months` : "-"}</Descriptions.Item>
                <Descriptions.Item label="Interest Rate">{selected.interest ? `${selected.interest}%` : "-"}</Descriptions.Item>
                <Descriptions.Item label="Interest Paid in Advance" span={2}><Text strong>{formatAmount(selected.interestPaidInAdvance)}</Text></Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title={<Space><UserOutlined /><Text strong>Applicant Profile</Text></Space>}>
              <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 600, background: "#fafafa" }}>
                <Descriptions.Item label="Occupation">{display(selected.occupation)}</Descriptions.Item>
                <Descriptions.Item label="Country">{selected.country ? <Tag color="blue">{selected.country}</Tag> : "-"}</Descriptions.Item>
                <Descriptions.Item label="University" span={2}>{display(selected.university)}</Descriptions.Item>
                <Descriptions.Item label="Lead Name">{display(selected.leadName)}</Descriptions.Item>
                <Descriptions.Item label="Created At"><CalendarOutlined /> {formatDate(selected.createdAt)}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title={<Space><BankOutlined /><Text strong>Bank Details</Text></Space>}>
              <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 600, background: "#fafafa" }}>
                <Descriptions.Item label="Bank Name" span={2}>{display(selected.bankName)}</Descriptions.Item>
                <Descriptions.Item label="Account Number"><Text>{display(selected.accountNumber)}</Text></Descriptions.Item>
                <Descriptions.Item label="IFSC Code"><Text>{display(selected.ifscCode)}</Text></Descriptions.Item>
                <Descriptions.Item label="Branch" span={2}>{display(selected.branchName)}</Descriptions.Item>
              </Descriptions>
            </Card>

            {(selected.fileNumber || selected.fileDate || selected.fileInfo) && (
              <Card size="small" title={<Text strong>File Information</Text>}>
                <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 600, background: "#fafafa" }}>
                  <Descriptions.Item label="File Number">{display(selected.fileNumber)}</Descriptions.Item>
                  <Descriptions.Item label="File Date">{display(selected.fileDate)}</Descriptions.Item>
                  <Descriptions.Item label="File Information" span={2}>{display(selected.fileInfo)}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {selected.image && <Card size="small" title={<Text strong>Uploaded Document</Text>}><div style={{ textAlign: "center" }}><Image src={selected.image} alt={selected.applicantName || selected.name || "Applicant document"} style={{ maxHeight: 300, maxWidth: "100%", objectFit: "contain" }} /></div></Card>}
          </Space>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default FDBucketData;
