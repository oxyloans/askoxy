import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  Select,
  message,
} from "antd";
import {
  RocketOutlined,
  MailOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import {
  successButtonStyle,
} from "./constants";
import type { CampaignResponse } from "./types";
import { getApiErrorMessage } from "./utils";

const PLATFORM_OPTIONS = [
  { label: "OxyLoans",  value: "oxyloans"  },
  { label: "OxyBricks", value: "oxybricks" },
  { label: "AskOxy",   value: "askoxy"    },
  { label: "OxyBFSAI", value: "oxybfsai"  },
];


const SingleClientCampaign: React.FC = () => {
  const [form] = Form.useForm();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [campaignLoading, setCampaignLoading] = useState(false);

  const handleSendCampaign = async (values: {
    clientName: string;
    clientEmail: string;
    platform: string;
  }) => {
    setCampaignLoading(true);

    try {
      const { data } = await customerApi.post<CampaignResponse>(
        `${BASE_URL}/ai-automation/email/send-campaign`,
        {
          clientName: values.clientName.trim(),
          clientEmail: values.clientEmail.trim(),
          platform: values.platform,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (data.success) {
        message.success(data.message || "Campaign sent successfully.");
        resetCampaign();
      } else {
        message.error(data.message || "Campaign could not be sent. Please try again.");
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, "Campaign could not be sent. Please try again."));
    } finally {
      setCampaignLoading(false);
    }
  };

  const resetCampaign = () => {
    setClientName("");
    setClientEmail("");
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ clientName, clientEmail }}
      onFinish={handleSendCampaign}
    >
      <Form.Item
        name="platform"
        label={
          <span className="ec-form-label">
            Platform <span className="ec-required">*</span>
          </span>
        }
        rules={[{ required: true, message: "Please select a platform." }]}
      >
        <Select
          size="large"
          placeholder="Select platform"
          suffixIcon={<AppstoreOutlined style={{ color: "#9ca3af" }} />}
          options={PLATFORM_OPTIONS}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="clientName"
        label={
          <span className="ec-form-label">
            Client Full Name <span className="ec-required">*</span>
          </span>
        }
        rules={[
          { required: true, whitespace: true, message: "Client name cannot be empty or spaces." },
          { min: 2, message: "Name must be at least 2 characters." },
          { max: 100, message: "Name must not exceed 100 characters." },
          { pattern: /^[a-zA-Z\s.'-]+$/, message: "Name can only contain letters, spaces, dots, hyphens and apostrophes." },
        ]}
        validateTrigger={["onBlur", "onChange"]}
      >
        <Input
          size="large"
          className="ec-form-input"
          prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
          placeholder="Example: John Smith"
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
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
          { required: true, message: "Please enter the client email address." },
          { type: "email", message: "Please enter a valid email address (e.g. john@company.com)." },
          { max: 150, message: "Email must not exceed 150 characters." },
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
          onChange={(event) => setClientEmail(event.target.value)}
        />
      </Form.Item>

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
