import React, { useState } from "react";
import {
  Button,
  Input,
  Alert,
  Form,
  Card,
  Space,
  Typography,
  Grid,
} from "antd";
import {
  RocketOutlined,
  CheckCircleOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import {
  COLOR_BORDER,
  COLOR_SUCCESS,
  COLOR_TEXT,
  primaryButtonStyle,
  successButtonStyle,
} from "./constants";
import type { CampaignResponse } from "./types";
import { getApiErrorMessage } from "./utils";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const SingleClientCampaign: React.FC = () => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [campaignResult, setCampaignResult] = useState<CampaignResponse | null>(
    null,
  );
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState("");

  const handleSendCampaign = async (values: {
    clientName: string;
    clientEmail: string;
  }) => {
    setCampaignLoading(true);
    setCampaignError("");

    try {
      const { data } = await customerApi.post<CampaignResponse>(
        `${BASE_URL}/ai-automation/email/send-campaign`,
        {
          clientName: values.clientName.trim(),
          clientEmail: values.clientEmail.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        setCampaignResult(data);
      } else {
        setCampaignError(
          data.message || "Campaign could not be sent. Please try again.",
        );
      }
    } catch (error) {
      setCampaignError(
        getApiErrorMessage(
          error,
          "Campaign could not be sent. Please try again.",
        ),
      );
    } finally {
      setCampaignLoading(false);
    }
  };

  const resetCampaign = () => {
    setClientName("");
    setClientEmail("");
    form.resetFields();
    setCampaignResult(null);
    setCampaignError("");
  };

  if (campaignResult) {
    return (
      <>
        <Card
          className="ec-success-card"
          style={{
            border: "1px solid rgba(26, 179, 148, 0.24)",
            background: "rgba(26, 179, 148, 0.08)",
            marginBottom: 16,
            borderRadius: 14,
            boxShadow: "0 8px 20px rgba(26, 179, 148, 0.10)",
          }}
          styles={{ body: { padding: screens.xs ? 14 : 18 } }}
        >
          <Space align="start">
            <CheckCircleOutlined
              style={{ fontSize: 26, color: COLOR_SUCCESS }}
            />
            <div>
              <Title level={5} style={{ margin: 0, color: "#0f766e" }}>
                Campaign sent for approval
              </Title>
              <Text style={{ color: "#0f766e" }}>{campaignResult.message}</Text>
            </div>
          </Space>
        </Card>

        <Card
          size="small"
          title={
            <Text strong style={{ color: "#008cba" }}>
              Generated Email Preview
            </Text>
          }
          style={{
            marginBottom: 16,
            background: "#ffffff",
            borderRadius: 14,
            border: `1px solid ${COLOR_BORDER}`,
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Form.Item
            label={
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 700 }}>
                SUBJECT
              </Text>
            }
            style={{ marginBottom: 16 }}
          >
            <Paragraph strong style={{ margin: 0, color: COLOR_TEXT }}>
              {campaignResult.generatedEmail.subject}
            </Paragraph>
          </Form.Item>

          <Form.Item
            label={
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 700 }}>
                EMAIL BODY
              </Text>
            }
            style={{ marginBottom: 0 }}
          >
            <Paragraph
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                maxHeight: 340,
                overflow: "auto",
                background: "#f9fafb",
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 12,
                padding: 14,
                color: "#374151",
                lineHeight: 1.7,
              }}
            >
              {campaignResult.generatedEmail.body}
            </Paragraph>
          </Form.Item>
        </Card>

        <Button
          block
          size="large"
          type="primary"
          className="ec-primary-btn"
          onClick={resetCampaign}
          style={primaryButtonStyle}
        >
          Create New Campaign
        </Button>
      </>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ clientName, clientEmail }}
      onFinish={handleSendCampaign}
    >
      <Form.Item
        name="clientName"
        label={
          <span className="ec-form-label">
            Client Full Name <span className="ec-required">*</span>
          </span>
        }
        rules={[
          { required: true, message: "Please enter the client full name." },
          { min: 2, message: "Please enter at least 2 characters." },
        ]}
      >
        <Input
          size="large"
          className="ec-form-input"
          prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
          placeholder="Example: John Smith"
          value={clientName}
          onChange={(event) => {
            setClientName(event.target.value);
            setCampaignError("");
          }}
        />
      </Form.Item>

      <Form.Item
        name="clientEmail"
        label={
          <span className="ec-form-label">
            Client Email Address <span className="ec-required">*</span>
          </span>
        }
        rules={[
          {
            required: true,
            message: "Please enter the client email address.",
          },
          {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        ]}
        validateTrigger={["onBlur", "onChange"]}
      >
        <Input
          size="large"
          className="ec-form-input"
          type="email"
          prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
          placeholder="Example: john@company.com"
          value={clientEmail}
          onChange={(event) => {
            setClientEmail(event.target.value);
            setCampaignError("");
          }}
        />
      </Form.Item>

      {campaignError && (
        <Alert
          type="error"
          message={campaignError}
          showIcon
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      <Form.Item>
        <Button
          type="primary"
          size="large"
          block
          className="ec-success-btn"
          icon={<RocketOutlined />}
          loading={campaignLoading}
          htmlType="submit"
          style={{
            ...successButtonStyle,
            minHeight: 46,
            letterSpacing: 0.25,
          }}
        >
          Send Campaign
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SingleClientCampaign;
