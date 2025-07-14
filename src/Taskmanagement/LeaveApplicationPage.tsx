import React, { useState, useEffect } from "react";
import {
  Form,
  DatePicker,
  Input,
  Button,
  message,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Avatar,
  Badge,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";
import axios from "axios";
import dayjs from "dayjs";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Interface for the leave request payload
interface LeaveRequestPayload {
  endDate: string;
  fromDate: string;
  name: string;
  requestSummary: string;
  userId: string;
}

// Form values interface
interface LeaveFormValues {
  fromDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  requestSummary: string;
}

const LeaveApplicationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [leaveDays, setLeaveDays] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [screenSize, setScreenSize] = useState<string>("");

  useEffect(() => {
    // Get username from localStorage
    const name = localStorage.getItem("Name");
    if (name) {
      setUserName(name);
    }

    // Add resize listener for responsive handling
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setScreenSize("xs");
      } else if (window.innerWidth >= 576 && window.innerWidth < 992) {
        setScreenSize("sm");
      } else {
        setScreenSize("lg");
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to disallow past dates
  const disabledDate: DatePickerProps["disabledDate"] = (current, info) => {
    return current && current < dayjs().startOf("day");
  };

  // Calculate days between dates when either date changes
  const calculateDays = () => {
    const fromDate = form.getFieldValue("fromDate");
    const endDate = form.getFieldValue("endDate");

    if (fromDate && endDate) {
      const days = endDate.diff(fromDate, "day") + 1;
      setLeaveDays(days > 0 ? days : 0);
    } else {
      setLeaveDays(null);
    }
  };

  // Handle from date change
  const handleFromDateChange = () => {
    calculateDays();

    // If end date is earlier than from date, reset end date
    const fromDate = form.getFieldValue("fromDate");
    const endDate = form.getFieldValue("endDate");

    if (fromDate && endDate && endDate.isBefore(fromDate)) {
      form.setFieldsValue({ endDate: null });
      setLeaveDays(null);
    }
  };

  // Handle end date change
  const handleEndDateChange = () => {
    calculateDays();
  };

  // Submit handler
  const onFinish = async (values: LeaveFormValues) => {
    setLoading(true);

    try {
      // Get username and userId from localStorage
      const username = localStorage.getItem("Name");
      const userId = localStorage.getItem("userId");

      if (!username || !userId) {
        message.error("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      // Format dates to YYYY-MM-DD
      const fromDate = values.fromDate.format("YYYY-MM-DD");
      const endDate = values.endDate.format("YYYY-MM-DD");

      // Create payload
      const payload: LeaveRequestPayload = {
        fromDate,
        endDate,
        name: username,
        requestSummary:
          values.requestSummary || `Request Leave ${leaveDays} days`,
        userId,
      };

      // Make API call
      const response = await axios.patch(
        `${BASE_URL}/user-service/write/requestLeaveApplication`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        message.success("Leave application submitted successfully!");
        form.resetFields();
        setLeaveDays(null);
      }
    } catch (error) {
      console.error("Error submitting leave application:", error);
      message.error("Failed to submit leave application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserPanelLayout>
      <div
        style={{
          padding: screenSize === "xs" ? "12px" : "24px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Card
          bordered={false}
          className="leave-application-card"
          style={{
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            background: "linear-gradient(to right, #ffffff, #f9f9ff)",
            width: "100%",
            padding: screenSize === "xs" ? "12px" : "24px",
          }}
          bodyStyle={{
            padding: screenSize === "xs" ? "12px" : "24px",
          }}
        >
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 16 }}
            gutter={[16, 16]}
            wrap
          >
            <Col xs={24} sm={12}>
              <Title
                level={screenSize === "xs" ? 3 : 2}
                style={{
                  marginBottom: 0,
                  fontSize: screenSize === "xs" ? "1rem" : "1.4rem",
                }}
              >
                <Space wrap>
                  <CalendarOutlined style={{ color: "#1890ff" }} />Leave
                  Application
                </Space>
              </Title>
            </Col>
            <Col
              xs={24}
              sm={12}
              style={{ textAlign: screenSize === "xs" ? "left" : "right" }}
            >
              <Space wrap>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
                <div>
                  <Text strong>{userName}</Text>
                </div>
              </Space>
            </Col>
          </Row>

          {/* <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            Request time off by selecting your leave dates and providing a
            reason
          </Paragraph> */}

          <Divider style={{ marginTop: 0 }} />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
            scrollToFirstError
            style={{ width: "100%" }}
          >
            <Row
              gutter={[
                { xs: 8, sm: 16, md: 24 },
                { xs: 8, sm: 16 },
              ]}
            >
              <Col xs={24} sm={12}>
                <Form.Item
                  name="fromDate"
                  label={
                    <Text strong>
                      From Date<Text type="danger">*</Text>
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please select start date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%", height: "40px" }}
                    disabledDate={disabledDate}
                    format="YYYY-MM-DD"
                    placeholder="Select start date"
                    onChange={handleFromDateChange}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="endDate"
                  label={
                    <Text strong>
                      To Date<Text type="danger">*</Text>
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please select end date" },
                  ]}
                  dependencies={["fromDate"]}
                  validateFirst
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <DatePicker
                    style={{ width: "100%", height: "40px" }}
                    disabledDate={(current) => {
                      const fromDate = form.getFieldValue("fromDate");
                      return (
                        disabledDate(current, { type: "date" }) ||
                        (fromDate && current.isBefore(fromDate))
                      );
                    }}
                    format="YYYY-MM-DD"
                    placeholder="Select end date"
                    onChange={handleEndDateChange}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            </Row>

            {leaveDays !== null && (
              <div
                style={{
                  background: "rgba(24, 144, 255, 0.1)",
                  padding: screenSize === "xs" ? "12px" : "16px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  borderLeft: "4px solid #1890ff",
                  overflowX: "auto",
                  width: "100%",
                }}
              >
                <Space wrap={screenSize === "xs"}>
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  <Text strong>
                    Leave Duration: {leaveDays} day{leaveDays !== 1 ? "s" : ""}
                  </Text>
                  {leaveDays > 5 && <Tag color="orange">Extended Leave</Tag>}
                </Space>
              </div>
            )}

            <Form.Item
              name="requestSummary"
              label={
                <Text strong>
                  Reason for Leave<Text type="danger">*</Text>
                </Text>
              }
              rules={[
                {
                  required: true,
                  message: "Please provide a reason for your leave",
                },
              ]}
            >
              <TextArea
                rows={screenSize === "xs" ? 3 : 4}
                placeholder="Briefly describe the reason for your leave request"
                showCount
                maxLength={2000}
                style={{
                  borderRadius: "8px",
                  padding: screenSize === "xs" ? "8px" : "12px",
                }}
              />
            </Form.Item>

            <Form.Item
              style={{
                marginTop: screenSize === "xs" ? 24 : 32,
                marginBottom: 8,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size={screenSize === "xs" ? "middle" : "large"}
                icon={<SendOutlined />}
                style={{
                  height: screenSize === "xs" ? "40px" : "48px",
                  borderRadius: "8px",
                  background: "#1890ff",
                  boxShadow: "0 2px 8px rgba(24, 144, 255, 0.35)",
                }}
              >
                Submit Leave Request
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default LeaveApplicationPage;
