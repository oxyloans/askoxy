import React, { useEffect, useState } from "react";
import BASE_URL, { uploadurlwithId } from "../Config";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Grid,
  Modal,
  message,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  UploadOutlined,
  
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import customerApi from "../utils/axiosInstances";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";
const PURPLE = "#7e22ce";

type Freelancer = {
  id: string;
  email: string;
  userId: string;
  perHour: number | null;
  perDay: number | null;
  perWeek: number | null;
  perMonth: number | null;
  perYear: number | null;
  openForFreeLancing: "YES" | "NO" | string;
  amountNegotiable: "YES" | "NO" | string;
  resumeUrl: string | null;
};

function formatMoney(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN");
}

const RatesCell: React.FC<{ r: Freelancer }> = ({ r }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 11 }}>₹/Hr</Text>
          <div><b>{formatMoney(r.perHour)}</b></div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 11 }}>₹/Day</Text>
          <div><b>{formatMoney(r.perDay)}</b></div>
        </div>
      </div>
      {expanded && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 11 }}>₹/Week</Text>
            <div><b>{formatMoney(r.perWeek)}</b></div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 11 }}>₹/Month</Text>
            <div><b>{formatMoney(r.perMonth)}</b></div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 11 }}>₹/Year</Text>
            <div><b>{formatMoney(r.perYear)}</b></div>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <Button
          type="link"
          size="small"
          style={{ padding: 0, fontSize: 11, color: PRIMARY }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "View Less ▲" : "View More ▼"}
        </Button>
      </div>
    </div>
  );
};

const FreelancersByUserId: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [data, setData] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;



  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [resumeModal, setResumeModal] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [updateRecord, setUpdateRecord] = useState<Freelancer | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [newResumeUrl, setNewResumeUrl] = useState<string | null>(null);
  const [updateForm] = Form.useForm();

  const getAccessToken = () => localStorage.getItem("accessToken");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    let userId = localStorage.getItem("userId");
    let token = getAccessToken();

    if (!token || !userId) {
      await new Promise((r) => setTimeout(r, 400));
      token = getAccessToken();
      userId = localStorage.getItem("userId");
      if (!token || !userId) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await customerApi.get<Freelancer[]>(
        `${BASE_URL}/ai-service/agent/getFreeLancersData/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load";
      setError(e?.response?.status === 401 ? "Session expired. Please login again." : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openResumeModal = (url: string) => {
    setResumePreviewUrl("");
    setResumeLoading(true);
    setResumeModal(true);
    setTimeout(() => { setResumePreviewUrl(`${uploadurlwithId}${url}`); }, 50);
  };

  const openUpdateModal = (r: Freelancer) => {
    setUpdateRecord(r);
    setNewResumeUrl(null);
    updateForm.resetFields();
    updateForm.setFieldsValue({
      email: r.email,
      perHour: r.perHour,
      perDay: r.perDay,
      perWeek: r.perWeek,
      perMonth: r.perMonth,
      perYear: r.perYear,
      openForFreeLancing: r.openForFreeLancing,
      amountNegotiable: r.amountNegotiable,
    });
    setShowUpdateModal(true);
  };



  const handleUpdate = async () => {
    if (!updateRecord) return;
    try {
      await updateForm.validateFields();
      const values = updateForm.getFieldsValue();
      setUpdateLoading(true);
      await customerApi.patch(
        `${BASE_URL}/ai-service/agent/freeLancerInfo/${updateRecord.id}`,
        {
          email: values.email ?? updateRecord.email,
          userId: updateRecord.userId,
          ...values,
          resumeUrl: newResumeUrl ?? updateRecord.resumeUrl,
        },
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      message.success("Updated successfully!");
      setShowUpdateModal(false);
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns: ColumnsType<Freelancer> = [
    {
      title: "S.No",
      key: "sno",
      align: "center",
      width: 60,
      render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (v: string) => <Text strong>{v || "-"}</Text>,
    },
    {
      title: "Rates",
      key: "rates",
      align: "center",
      render: (_, r) => <RatesCell r={r} />,
    },
    {
      title: "Available",
      dataIndex: "openForFreeLancing",
      key: "openForFreeLancing",
      align: "center",
     
      render: (v: string) => <Tag color={v === "YES" ? "green" : "red"}>{v || "-"}</Tag>,
    },
    {
      title: "Negotiable",
      dataIndex: "amountNegotiable",
      key: "amountNegotiable",
      align: "center",
     
      render: (v: string) => <Tag color={v === "YES" ? "geekblue" : "default"}>{v || "-"}</Tag>,
    },
    {
      title: "Resume",
      key: "resume",
      align: "center",
    
      render: (_, r) => (
        <Button
          size="small"
          disabled={!r.resumeUrl}
          onClick={() => r.resumeUrl && openResumeModal(r.resumeUrl)}
          style={{ background: PRIMARY, borderColor: PRIMARY, color: "#fff", borderRadius: 6 }}
        >
          View Resume
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
    
      render: (_, r) => (
        <Button
         
          size="small"
          onClick={() => openUpdateModal(r)}
          style={{ background: "#1ab394", borderColor: "#1ab394", color: "#fff", borderRadius: 6 }}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? 12 : 24, background: "white", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: "#1a1a2e" }}>
             Freelancer Applications
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage and review all freelancer profiles
          </Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              style={{ color: PRIMARY, borderColor: PRIMARY }}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
          <Spin size="large" tip="Loading freelancers..." />
        </div>
      ) : error ? (
        <Alert
          type="error"
          message="Error"
          description={error}
          showIcon
          action={<Button type="primary" onClick={fetchData}>Try Again</Button>}
        />
      ) : data.length === 0 ? (
        <Alert type="info" message="No freelancers found" description="No applications yet." showIcon />
      ) : (
        <div style={{  overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            bordered
            size={isMobile ? "small" : "middle"}
            scroll={{ x: "true" }}
            pagination={{ pageSize, onChange: setCurrentPage, showSizeChanger: false }}
          />
        </div>
      )}

      <Modal
        title="📄 Resume Preview"
        open={resumeModal}
        onCancel={() => { setResumeModal(false); setResumePreviewUrl(""); setResumeLoading(false); }}
        footer={[
       
          <Button key="close" type="primary" onClick={() => { setResumeModal(false); setResumePreviewUrl(""); setResumeLoading(false); }}>Close</Button>,
        ]}
        width={860}
        styles={{ body: { padding: 0, height: "75vh", position: "relative" } }}
        centered
        destroyOnClose
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {resumeLoading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", zIndex: 10 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTop: "4px solid #008cba", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />
              <span style={{ fontSize: 13, color: "#6b7280" }}>Loading resume…</span>
            </div>
          </div>
        )}
        {resumePreviewUrl && (
          <iframe
            key={resumePreviewUrl}
            src={`https://docs.google.com/gview?url=${encodeURIComponent(resumePreviewUrl)}&embedded=true`}
            title="Resume"
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "70vh", display: "block" }}
            onLoad={() => setResumeLoading(false)}
          />
        )}
      </Modal>

      {/* Update Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: PURPLE }} />
            <span style={{ fontWeight: 700 }}>Update Freelancer Profile</span>
          </Space>
        }
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        onOk={handleUpdate}
        confirmLoading={updateLoading}
        okText="Save Changes"
        okButtonProps={{ style: { background: PURPLE, borderColor: PURPLE } }}
        width={isMobile ? "95vw" : 520}
        centered
        destroyOnClose
      >
        <Form form={updateForm} layout="vertical" style={{ marginTop: 8 }}>
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            {[
              { label: "Per Hour", name: "perHour" },
              { label: "Per Day", name: "perDay" },
              { label: "Per Week", name: "perWeek" },
              { label: "Per Month", name: "perMonth" },
              { label: "Per Year", name: "perYear" },
            ].map(({ label, name }) => (
              <Col xs={8} sm={8} key={name}>
                <Form.Item label={label} name={name}>
                  <Input type="number" prefix="₹" placeholder="0" />
                </Form.Item>
              </Col>
            ))}
            <Col xs={8} sm={8}>
              <Form.Item label="Open for Freelancing" name="openForFreeLancing">
                <Select options={[{ value: "YES", label: "Yes" }, { value: "NO", label: "No" }]} />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8}>
              <Form.Item label="Amount Negotiable" name="amountNegotiable">
                <Select options={[{ value: "YES", label: "Yes" }, { value: "NO", label: "No" }]} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Upload Resume">
                <Upload
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={async (file) => {
                    setUploadLoading(true);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await customerApi.post(
                        `${BASE_URL}/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${getAccessToken()}`,
                          },
                        }
                      );
                      setNewResumeUrl(res.data.documentPath);
                      message.success("Resume uploaded successfully!");
                    } catch {
                      message.error("Upload failed. Please try again.");
                    } finally {
                      setUploadLoading(false);
                    }
                    return false;
                  }}
                >
                  <Button
                    icon={uploadLoading ? <Spin size="small" /> : <UploadOutlined />}
                    disabled={uploadLoading}
                    style={{ width: "100%" }}
                  >
                    {uploadLoading ? "Uploading..." : "Click or Drag to Upload"}
                  </Button>
                </Upload>
                {newResumeUrl && (
                  <Text style={{ color: "#10b981", fontSize: 12, display: "block", marginTop: 4 }}>
                    ✓ New resume ready to save
                  </Text>
                )}
                {!newResumeUrl && updateRecord?.resumeUrl && (
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                    Current: {updateRecord.resumeUrl.split("/").pop()}
                  </Text>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>


    </div>
  );
};

export default FreelancersByUserId;
