import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import type { TableProps } from "antd";
import {
  BankOutlined,
  CalendarOutlined,
  IdcardOutlined,
  SearchOutlined,
  UserOutlined,
  CommentOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { adminApi } from "../utils/axiosInstances";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "../AskoxyAdmin/HelpDeskCommentsModal";

const { Text, Title } = Typography;

export interface FDBucketRecord {
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
  comments?: string | null;
}

interface FDBucketResponse {
  content: FDBucketRecord[];
  totalElements: number;
  number: number;
  size: number;
}

interface AdminCommentRecord {
  adminComments?: string | null;
  commentsUpdateBy?: string | null;
  commentsCreatedDate?: string | null;
  customerBehaviour?: string | null;
  callingType?: string | null;
  dataType?: string | null;
}

const display = (value: unknown) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const formatDate = (value: FDBucketRecord["createdAt"]) => {
  if (!value) return "—";
  const date = new Date(
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value
  );
  if (Number.isNaN(date.getTime())) return String(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
};

const formatAmount = (value: string | null) => {
  if (!value) return "—";
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)
    : value;
};

const isValidComment = (value: string | null | undefined) => {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  return text !== "" && text.toLowerCase() !== "null";
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

  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminCommentRecord | null | "loading">
  >({});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedCommentRecord, setSelectedCommentRecord] =
    useState<FDBucketRecord | null>(null);

  const fetchCommentsForRows = useCallback((rows: FDBucketRecord[]) => {
    rows.forEach(async (u) => {
      const id = u.id || u.borrowerId || u.applicantName || u.name;
      if (!id) return;
      setCommentsMap((prev) => ({ ...prev, [id]: "loading" }));
      try {
        const res = await axios.post(
          `${BASE_URL}/user-service/fetchAdminComments`,
          { userId: id },
          { headers: { "Content-Type": "application/json" } }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const latest = list.length > 0 ? list[0] : null;
        setCommentsMap((prev) => ({ ...prev, [id]: latest }));
      } catch {
        setCommentsMap((prev) => ({ ...prev, [id]: null }));
      }
    });
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.get<FDBucketResponse>(
        `${BASE_URL}/ai-service/agent/getFDBucketData`,
        { params: { page: page - 1, size: pageSize } }
      );
      const rows = Array.isArray(response.data?.content)
        ? response.data.content
        : [];
      setRecords(rows);
      setTotal(Number(response.data?.totalElements) || 0);
      fetchCommentsForRows(rows);
    } catch (requestError) {
      console.error("Failed to fetch FD bucket data:", requestError);
      setRecords([]);
      setError("Unable to load FD bucket data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, fetchCommentsForRows]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openCommentModal = (record: FDBucketRecord) => {
    setSelectedCommentRecord(record);
    setCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedCommentRecord(null);
  };

  const filteredRecords = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return records;

    return records.filter((record) =>
      [
        record.applicantName,
        record.name,
        record.mobileNumber,
        record.borrowerId,
        record.occupation,
        record.bankName,
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [records, searchText]);

  const columns: TableProps<FDBucketRecord>["columns"] = [
    {
      title: "S.No",
      width: 65,
      align: "center",
      render: (_value, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: <Text strong>Applicant</Text>,
      key: "applicant",
      width: 180,
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
      width: 130,
      align: "center",
      render: (value) => <Text strong>{display(value)}</Text>,
    },
    {
      title: <Text strong>Required Amount</Text>,
      dataIndex: "requiredAmount",
      width: 140,
      render: (value) => (
        <Text strong style={{ color: "#008cba" }}>
          {formatAmount(value)}
        </Text>
      ),
      align: "center",
    },
    {
      title: "Profile",
      key: "profile",
      width: 140,
      align: "center",
      render: (_value, record) => (
        <Space direction="vertical" size={2}>
          <span style={{ fontSize: 12 }}>{display(record.occupation)}</span>
          {record.country && <Tag color="blue">{record.country}</Tag>}
        </Space>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      width: 110,
      align: "center",
      render: (value) => (value ? <Tag color="purple">{value}</Tag> : "—"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 110,
      align: "center",
      render: formatDate,
    },
    {
      title: "Admin Comments",
      key: "comments",
      width: 260,
      render: (_value, record) => {
        const id = record.id || record.borrowerId || record.applicantName || record.name;
        const commentInfo = id ? commentsMap[id] : null;

        if (commentInfo === "loading") {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12 }}>
              <Spin size="small" /> <span>Loading...</span>
            </div>
          );
        }

        const commentText = commentInfo?.adminComments || record.comments;
        const hasComment = isValidComment(commentText);

        if (!hasComment) {
          return (
            <Tag
              color="default"
              style={{
                borderRadius: 12,
                fontSize: 11,
                padding: "2px 8px",
                cursor: "pointer",
                color: "#6b7280",
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
              onClick={() => openCommentModal(record)}
            >
              <PlusOutlined style={{ marginRight: 4 }} /> Add Comment
            </Tag>
          );
        }

        return (
          <div
            style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}
            onClick={() => openCommentModal(record)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <Tag color="success" style={{ margin: 0, borderRadius: 10, fontSize: 10, padding: "0 5px" }}>
                <CommentOutlined style={{ marginRight: 2 }} /> Comment
              </Tag>
              {commentInfo?.customerBehaviour && (
                <span style={{ fontSize: 10, background: "#eff6ff", color: "#1d4ed8", padding: "0 4px", borderRadius: 6, border: "1px solid #dbeafe" }}>
                  {commentInfo.customerBehaviour}
                </span>
              )}
            </div>
            <Tooltip title={commentText} placement="topLeft">
              <div
                style={{
                  fontSize: 12,
                  color: "#1f2937",
                  fontWeight: 500,
                  maxWidth: 240,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {commentText}
              </div>
            </Tooltip>
            {commentInfo?.commentsUpdateBy && (
              <div style={{ fontSize: 10, color: "#9ca3af" }}>
                By: {commentInfo.commentsUpdateBy}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      render: (_value, record) => (
        <Space size={6}>
          <Button
            type="primary"
            size="small"
            style={{ background: "#008cba", borderColor: "#008cba", fontSize: 12, borderRadius: 6 }}
            onClick={() => setSelected(record)}
          >
            View
          </Button>
          <Button
            size="small"
            style={{ borderColor: "#1ab394", color: "#1ab394", fontSize: 12, borderRadius: 6 }}
            icon={<EditOutlined />}
            onClick={() => openCommentModal(record)}
          >
            Comment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5">
      <div className="mx-auto max-w-7xl">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Title level={3} style={{ margin: 0 }}>
                FD Bucket Data
              </Title>
              <Text type="secondary">
                AskOxy AI applicant and borrower submissions
              </Text>
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

          {error && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message={error}
              action={
                <Button
                  type="primary"
                  size="small"
                  style={{ background: "#1ab394", borderColor: "#1ab394" }}
                  onClick={fetchRecords}
                >
                  Retry
                </Button>
              }
            />
          )}

          <div style={{ width: "100%", overflowX: "auto" }}>
            <Table<FDBucketRecord>
              rowKey="id"
              columns={columns}
              dataSource={filteredRecords}
              loading={loading}
              scroll={{ x: 1250 }}
              size="middle"
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
          </div>
        </Card>

        {/* View Details Modal */}
        <Modal
          title={
            <Space>
              <IdcardOutlined />
              <span>FD Applicant Details</span>
            </Space>
          }
          open={Boolean(selected)}
          onCancel={() => setSelected(null)}
          footer={
            <Button
              type="primary"
              style={{ background: "#008cba", borderColor: "#008cba" }}
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          }
          width={860}
          centered
          styles={{
            body: { maxHeight: "75vh", overflowY: "auto", paddingTop: 16 },
          }}
        >
          {selected && (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Card
                size="small"
                style={{ background: "#f2fbfd", borderColor: "#008cba" }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col flex="auto">
                    <Text type="secondary">
                      <UserOutlined /> Applicant
                    </Text>
                    <Title level={4} style={{ margin: "2px 0" }}>
                      {display(selected.applicantName || selected.name)}
                    </Title>
                    <Text>{display(selected.mobileNumber)}</Text>
                  </Col>
                  <Col xs={24} sm={9}>
                    <Statistic
                      title={<Text strong>Required Amount</Text>}
                      value={formatAmount(selected.requiredAmount)}
                      valueStyle={{
                        color: "#008cba",
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                size="small"
                title={
                  <Space>
                    <IdcardOutlined />
                    <Text strong>Loan Information</Text>
                  </Space>
                }
              >
                <Descriptions
                  size="small"
                  bordered
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                  contentStyle={{ fontWeight: 500 }}
                >
                  <Descriptions.Item label="Borrower ID">
                    <Text strong>{display(selected.borrowerId)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Source">
                    {selected.source ? (
                      <Tag color="purple">{selected.source}</Tag>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tenure">
                    {selected.tenure ? `${selected.tenure} months` : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Interest Rate">
                    {selected.interest ? `${selected.interest}%` : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Interest Paid in Advance" span={2}>
                    <Text strong>
                      {formatAmount(selected.interestPaidInAdvance)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                size="small"
                title={
                  <Space>
                    <UserOutlined />
                    <Text strong>Applicant Profile</Text>
                  </Space>
                }
              >
                <Descriptions
                  size="small"
                  bordered
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                >
                  <Descriptions.Item label="Occupation">
                    {display(selected.occupation)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Country">
                    {selected.country ? (
                      <Tag color="blue">{selected.country}</Tag>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="University" span={2}>
                    {display(selected.university)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lead Name">
                    {display(selected.leadName)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    <CalendarOutlined /> {formatDate(selected.createdAt)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                size="small"
                title={
                  <Space>
                    <BankOutlined />
                    <Text strong>Bank Details</Text>
                  </Space>
                }
              >
                <Descriptions
                  size="small"
                  bordered
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                >
                  <Descriptions.Item label="Bank Name" span={2}>
                    {display(selected.bankName)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Account Number">
                    <Text>{display(selected.accountNumber)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="IFSC Code">
                    <Text>{display(selected.ifscCode)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Branch" span={2}>
                    {display(selected.branchName)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {(selected.fileNumber ||
                selected.fileDate ||
                selected.fileInfo) && (
                <Card size="small" title={<Text strong>File Information</Text>}>
                  <Descriptions
                    size="small"
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                  >
                    <Descriptions.Item label="File Number">
                      {display(selected.fileNumber)}
                    </Descriptions.Item>
                    <Descriptions.Item label="File Date">
                      {display(selected.fileDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="File Information" span={2}>
                      {display(selected.fileInfo)}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              )}

              {selected.image && (
                <Card size="small" title={<Text strong>Uploaded Document</Text>}>
                  <div style={{ textAlign: "center" }}>
                    <Image
                      src={selected.image}
                      alt={
                        selected.applicantName ||
                        selected.name ||
                        "Applicant document"
                      }
                      style={{
                        maxHeight: 300,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Card>
              )}
            </Space>
          )}
        </Modal>

        {/* Comments Modal */}
        <HelpDeskCommentsModal
          open={commentModalOpen}
          onClose={closeCommentModal}
          onSuccess={(newComment, details) => {
            if (selectedCommentRecord) {
              const id =
                selectedCommentRecord.id ||
                selectedCommentRecord.borrowerId ||
                selectedCommentRecord.applicantName ||
                selectedCommentRecord.name;
              if (id) {
                setCommentsMap((prev) => ({
                  ...prev,
                  [id]: {
                    adminComments: newComment,
                    commentsUpdateBy: localStorage.getItem("admin_userName")?.toUpperCase() || "ADMIN",
                    commentsCreatedDate: new Date().toISOString(),
                    ...details,
                  },
                }));
              }
              setRecords((prev) =>
                prev.map((item) =>
                  item.id === selectedCommentRecord.id
                    ? { ...item, comments: newComment }
                    : item
                )
              );
            }
          }}
          userId={
            selectedCommentRecord?.id ||
            selectedCommentRecord?.borrowerId ||
            selectedCommentRecord?.applicantName ||
            selectedCommentRecord?.name ||
            undefined
          }
          record={selectedCommentRecord}
          dataType="FD_BUCKET_DATA"
          BASE_URL={BASE_URL}
        />
      </div>
    </div>
  );
};

export default FDBucketData;
