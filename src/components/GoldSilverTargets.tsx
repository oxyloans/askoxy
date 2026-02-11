import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Tag,
  Spin,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Grid,
} from "antd";
import { EditOutlined, GoldOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type TargetData = {
  id: string;
  metalType: string;
  minPrice: number;
  maxPrice: number | null;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

const API_URL_TARGETS =
  "https://meta.oxyloans.com/api/marketing-service/campgin/gold-silver-targets";
const API_URL_SAVE_TARGET =
  "https://meta.oxyloans.com/api/marketing-service/campgin/save-or-update-gold";

const formatINR = (value?: number | null) => {
  if (value === null || value === undefined) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
};

const metalTag = (type: string) => {
  const isGold = type === "GOLD";
  return (
    <Tag
      style={{
        borderRadius: 999,
        padding: "4px 14px",
        fontWeight: 600,
        letterSpacing: 0.5,
        fontSize: 13,
        border: 'none',
      }}
      color={isGold ? "gold" : "cyan"}
      icon={<GoldOutlined />}
    >
      {type}
    </Tag>
  );
};

const GoldSilverTargets: React.FC = () => {
  const screens = useBreakpoint();

  const [targetsData, setTargetsData] = useState<TargetData[]>([]);
  const [targetsLoading, setTargetsLoading] = useState(true);
  const [targetsError, setTargetsError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form] = Form.useForm();

  const fetchTargets = async () => {
    setTargetsLoading(true);
    setTargetsError(null);
    try {
      const res = await fetch(API_URL_TARGETS);
      if (!res.ok) throw new Error("Targets API request failed");
      const data: TargetData[] = await res.json();
      setTargetsData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Targets API Error:", err);
      setTargetsError(err?.message || "Something went wrong");
      Swal.fire({
        icon: "error",
        title: "Unable to load targets",
        text: err?.message || "Something went wrong",
        confirmButtonColor: "#008cba",
      });
    } finally {
      setTargetsLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleEdit = (target: TargetData) => {
    setEditingTarget(target);
    setIsEditModalOpen(true);
    setSaveError(null);

    form.setFieldsValue({
      minPrice: target.minPrice,
      maxPrice: target.maxPrice ?? 0, // 0 => No Limit
    });
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingTarget(null);
    setSaveError(null);
    form.resetFields();
  };

  const handleSave = async () => {
    if (!editingTarget) return;

    try {
      const values = await form.validateFields();
      const minPriceNum = Number(values.minPrice);
      const maxPriceNum = Number(values.maxPrice);

      setIsSaving(true);
      setSaveError(null);

      const payload = {
        id: editingTarget.id,
        metalType: editingTarget.metalType,
        minPrice: minPriceNum,
        maxPrice: !maxPriceNum || isNaN(maxPriceNum) ? null : maxPriceNum,
        isActive: editingTarget.isActive,
      };

      const res = await fetch(API_URL_SAVE_TARGET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save target");

      await fetchTargets();
      handleCloseModal();
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Target updated successfully",
        confirmButtonColor: "#008cba",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      // validateFields throws object; API throws Error
      if (err?.errorFields) return;
      console.error("Save Error:", err);
      setSaveError(err?.message || "Failed to save");
      
      Swal.fire({
        icon: "error",
        title: "Failed to save",
        text: err?.message || "Failed to save target",
        confirmButtonColor: "#008cba",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isMobile = !screens.md; // < 768px
  const isTablet = screens.md && !screens.lg; // 768 - 992

  const columns = useMemo(
    () => [
      {
        title: "Metal",
        dataIndex: "metalType",
        key: "metalType",
        align: "center" as const,
        width: 140,
        render: (type: string) => metalTag(type),
      },
      {
        title: "Min Price",
        dataIndex: "minPrice",
        key: "minPrice",
        align: "center" as const,
        render: (price: number, record: TargetData) => (
          <Text strong style={{ color: record.metalType === "GOLD" ? "#faad14" : "#13c2c2", fontSize: 15 }}>
            {formatINR(price)}
          </Text>
        ),
      },
      {
        title: "Max Price",
        dataIndex: "maxPrice",
        key: "maxPrice",
        align: "center" as const,
        render: (price: number | null, record: TargetData) => (
          <Text strong style={{ color: record.metalType === "GOLD" ? "#faad14" : "#13c2c2", fontSize: 15 }}>
            {price ? formatINR(price) : "No Limit"}
          </Text>
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 120,
        align: "center" as const,
        render: (_: any, record: TargetData) => {
          const btnColor = record.metalType === "GOLD" ? "#faad14" : "#13c2c2";
          const btnHoverColor = record.metalType === "GOLD" ? "#d48806" : "#08979c";
          return (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="middle"
              style={{
                background: btnColor,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = btnHoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.background = btnColor)}
            >
              Edit
            </Button>
          );
        },
      },
    ],
    [],
  );

  // Mobile Card View (Better UX than table on small screens)
  const MobileCards = () => (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      {targetsData.map((t) => (
        <Card
          key={t.id}
          style={{ borderRadius: 14 }}
          bodyStyle={{ padding: 14 }}
        >
          <Row justify="space-between" align="middle">
            <Col>{metalTag(t.metalType)}</Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(t)}
                style={{
                  background: t.metalType === "GOLD" ? "#faad14" : "#13c2c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                Edit
              </Button>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[12, 10]}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 12 }}>Min Price</Text>
              <div>
                <Text strong style={{ color: t.metalType === "GOLD" ? "#faad14" : "#13c2c2", fontSize: 15 }}>{formatINR(t.minPrice)}</Text>
              </div>
            </Col>

            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 12 }}>Max Price</Text>
              <div>
                <Text strong style={{ color: t.metalType === "GOLD" ? "#faad14" : "#13c2c2", fontSize: 15 }}>
                  {t.maxPrice ? formatINR(t.maxPrice) : "No Limit"}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      ))}
    </Space>
  );

  return (
    <div
      style={{
        padding: isMobile ? 12 : 20,
        background: "#f5f7fb",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Row justify="center" style={{ width: "100%" }}>
        <Col xs={24} sm={24} md={22} lg={18} xl={16}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: isMobile ? 14 : 18 }}
          >
            {/* Header */}
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              
              <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: "#008cba", fontWeight: 700 }}>
                Gold & Silver Targets
              </Title>
              <Text style={{ fontSize: isMobile ? 13 : 15, color: "#6b7280", display: "block", marginTop: 8 }}>
                Manage min & max price ranges for campaigns
              </Text>
            </div>

            {/* Content */}
            {targetsLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 10 }}>
                  <Text type="secondary">Loading targets...</Text>
                </div>
              </div>
            ) : targetsError ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text type="secondary">Unable to load targets. Please try again.</Text>
              </div>
            ) : targetsData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text type="secondary">No targets available</Text>
              </div>
            ) : isMobile ? (
              <MobileCards />
            ) : (
              <Table
                columns={columns as any}
                dataSource={targetsData}
                rowKey="id"
                pagination={false}
                size={isTablet ? "middle" : "large"}
                scroll={{ x: 600 }}
                                              style={{ marginTop: 6 }}
                                              bordered
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal
        title={
          <Space>
            <GoldOutlined style={{ color: editingTarget?.metalType === "GOLD" ? "#faad14" : "#13c2c2" }} />
            <span style={{ color: editingTarget?.metalType === "GOLD" ? "#faad14" : "#13c2c2", fontWeight: 600 }}>Edit {editingTarget?.metalType || ""} Target</span>
          </Space>
        }
        open={isEditModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSave}
        okText="Save"
        okButtonProps={{
          style: {
            background: editingTarget?.metalType === "GOLD" ? "#faad14" : "#13c2c2",
            borderColor: editingTarget?.metalType === "GOLD" ? "#faad14" : "#13c2c2",
            fontWeight: 500,
          },
        }}
        confirmLoading={isSaving}
        width={isMobile ? "92%" : 460}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Min Price"
            name="minPrice"
            rules={[
              { required: true, message: "Min Price is required" },
              {
                validator: (_, val) =>
                  val && val > 0
                    ? Promise.resolve()
                    : Promise.reject("Min Price must be > 0"),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter min price"
              prefix="₹"
              min={0}
              disabled={isSaving}
            />
          </Form.Item>

          <Form.Item
            label="Max Price"
            name="maxPrice"
            extra="Enter 0 for No Limit"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter max price (0 = No Limit)"
              prefix="₹"
              min={0}
              disabled={isSaving}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoldSilverTargets;
