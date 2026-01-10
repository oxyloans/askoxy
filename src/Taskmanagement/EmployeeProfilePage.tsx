import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Grid,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import {
  PhoneOutlined,
  ReloadOutlined,
  SaveOutlined,
 
} from "@ant-design/icons";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface MobileNumberUpdateProps {
  currentMobileNumber?: string;
  onUpdateSuccess?: () => void;
  onUpdateError?: (error: any) => void;
}

const MobileNumberUpdate: React.FC<MobileNumberUpdateProps> = ({
  currentMobileNumber = "",
  onUpdateSuccess,
  onUpdateError,
}) => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();

  const userId = sessionStorage.getItem("userId") || "";

  const [isUpdating, setIsUpdating] = useState(false);
  const [inlineError, setInlineError] = useState<string>("");

  const isMobile = useMemo(() => !screens.md, [screens.md]);

  useEffect(() => {
    form.setFieldsValue({
      mobileNumber: (currentMobileNumber || "").replace(/\D/g, "").slice(0, 10),
    });
  }, [currentMobileNumber, form]);

  const onlyDigits10 = (value: string) =>
    (value || "").replace(/\D/g, "").slice(0, 10);

  const handleReset = () => {
    setInlineError("");
    form.setFieldsValue({
      mobileNumber: onlyDigits10(currentMobileNumber || ""),
    });
  };

  const updateMobileNumber = async () => {
    setInlineError("");

    try {
      const raw = form.getFieldValue("mobileNumber");
      const mobileNumber = onlyDigits10(raw);

      if (!mobileNumber || mobileNumber.length !== 10) {
        setInlineError("Please enter a valid 10-digit mobile number.");
        return;
      }

      if (!userId) {
        setInlineError("User ID not found. Please login again.");
        return;
      }

      setIsUpdating(true);

      await axios.patch(
        `${BASE_URL}/user-service/users/${userId}/empMobile`,
        null,
        {
          params: { mobileNumber },
        }
      );

      message.success("Mobile number updated successfully");
      onUpdateSuccess?.();
    } catch (err: any) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update mobile number. Please try again.";

      setInlineError(errorMessage);
      message.error(errorMessage);
      onUpdateError?.(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <UserPanelLayout>
      <div
        style={{
          padding: isMobile ? 12 : 20,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={18} lg={14}>
            <Card
              bordered
              style={{
                borderRadius: 14,
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: isMobile ? 16 : 22 }}
              title={
                <Space>
                  <PhoneOutlined style={{ color: "#1677ff" }} />
                  <span>Update Mobile Number</span>
                </Space>
              }
            >
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    Enter your new number
                  </Title>
                  <Text type="secondary">
                    Please provide a valid 10-digit Indian mobile number.
                  </Text>
                </div>

                {/* <Alert
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  message="Tip"
                  description="Only digits are allowed. Country code is fixed as +91."
                /> */}

                {inlineError ? (
                  <Alert type="error" showIcon message={inlineError} />
                ) : null}

                <Spin spinning={isUpdating} tip="Updating..." size="large">
                  <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={() => {
                      if (inlineError) setInlineError("");
                    }}
                  >
                    <Form.Item
                      label="Mobile Number"
                      name="mobileNumber"
                      rules={[
                        {
                          required: true,
                          message: "Mobile number is required",
                        },
                        {
                          validator: async (_, value) => {
                            const v = onlyDigits10(value || "");
                            if (!v || v.length !== 10) {
                              return Promise.reject(
                                new Error("Enter exactly 10 digits")
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        prefix={<span style={{ color: "#6b7280" }}>+91</span>}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        disabled={isUpdating}
                        onChange={(e) => {
                          const cleaned = onlyDigits10(e.target.value);
                          form.setFieldsValue({ mobileNumber: cleaned });
                        }}
                        style={{
                          height: isMobile ? 46 : 40,
                          borderRadius: 10,
                        }}
                      />
                    </Form.Item>

                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={12}>
                        <Button
                          icon={<SaveOutlined />}
                          block
                          onClick={updateMobileNumber}
                          disabled={isUpdating}
                          style={{
                            height: isMobile ? 46 : 40,
                            borderRadius: 10,
                            backgroundColor: "#008cba",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          Update Mobile Number
                        </Button>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Button
                          icon={<ReloadOutlined />}
                          block
                          onClick={handleReset}
                          disabled={isUpdating}
                          style={{
                            height: isMobile ? 46 : 40,
                            borderRadius: 10,
                            fontWeight: 600,
                          }}
                        >
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Spin>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  Note: Your updated mobile number will be used for future
                  communication and verification.
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </UserPanelLayout>
  );
};

export default MobileNumberUpdate;
