import React, { useState } from "react";
import {
  Form,
  DatePicker,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Tag,
} from "antd";
import Swal from "sweetalert2";
import {
  CalendarOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { employeeApi } from "../utils/axiosInstances";
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
  const [userName] = useState<string>(() => sessionStorage.getItem("Name") || "");

  // Function to disallow past dates and future years
  const disabledDate = (current: dayjs.Dayjs | null): boolean => {
    if (!current) return false;

    const today = dayjs().startOf("day");
    const currentYear = dayjs().year();
    const selectedYear = current.year();

    // Disable past dates
    if (current < today) return true;

    // Disable future years (only allow current year)
    if (selectedYear > currentYear) return true;

    return false;
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
      const username = sessionStorage.getItem("Name");
      const userId = sessionStorage.getItem("userId");

      if (!username || !userId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User information not found. Please login again.",
        });
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
      const response = await employeeApi.patch(
        `${BASE_URL}/user-service/write/requestLeaveApplication`,
        payload,
      );
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Leave Request Submitted",
          text: "Your leave request has been submitted successfully for review.",
          confirmButtonText: "OK",
        });

        form.resetFields();
        setLeaveDays(null);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Unable to Submit Leave Request",
        text:
          error?.response?.data?.message ||
          error?.response?.data ||
          "Unable to submit your leave request at this time. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setLeaveDays(null);
  };

  return (
    <UserPanelLayout>
      <div className="leave-page">
        <div className="leave-shell">
          <div className="leave-hero">
            <div>
              <Title level={2} className="leave-title">
                Leave Application
              </Title>
              <Paragraph className="leave-subtitle">
                Fill in the details below to apply for leave.
              </Paragraph>
            </div>

            <div className="leave-hero-icon" aria-hidden="true">
              <CalendarOutlined />
            </div>
          </div>

          <div className="leave-info">
            <InfoCircleOutlined />
            <Text>
              Please select appropriate dates and provide a reason for your leave request.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            scrollToFirstError
            className="leave-form"
          >
            <Row gutter={[24, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fromDate"
                  label={
                    <span className="field-label">
                      From Date <span>*</span>
                    </span>
                  }
                  extra="Select start date of leave"
                  rules={[{ required: true, message: "Please select start date" }]}
                >
                  <DatePicker
                    className="leave-picker"
                    disabledDate={disabledDate}
                    format="YYYY-MM-DD"
                    placeholder="Select start date"
                    onChange={handleFromDateChange}
                    allowClear={false}
                    picker="date"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="endDate"
                  label={
                    <span className="field-label">
                      End Date <span>*</span>
                    </span>
                  }
                  extra="Select end date of leave"
                  rules={[{ required: true, message: "Please select end date" }]}
                  dependencies={["fromDate"]}
                  validateFirst
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <DatePicker
                    className="leave-picker"
                    disabledDate={(current) => {
                      const fromDate = form.getFieldValue("fromDate");
                      if (!current) return false;
                      return (
                        disabledDate(current) ||
                        Boolean(fromDate && current.isBefore(fromDate, "day"))
                      );
                    }}
                    format="YYYY-MM-DD"
                    placeholder="Select end date"
                    onChange={handleEndDateChange}
                    allowClear={false}
                    picker="date"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 8]} align="stretch">
              <Col xs={24} md={12}>
                <div className="duration-section">
                  <div className="field-label">Leave Days</div>

                  <div className={`duration-card ${leaveDays === null ? "empty" : ""}`}>
                    <div className="duration-icon">
                      <CalendarOutlined />
                    </div>

                    <div>
                      <div className="duration-value">
                        {leaveDays === null
                          ? "Select dates"
                          : `${leaveDays} Day${leaveDays !== 1 ? "s" : ""}`}
                      </div>
                      <div className="duration-help">
                        Total leave duration (including start and end dates)
                      </div>
                    </div>

                    {leaveDays !== null && leaveDays > 5 && (
                      <Tag color="orange" className="extended-tag">
                        Extended Leave
                      </Tag>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="requestSummary"
                  label={
                    <span className="field-label">
                      Reason / Summary <span>*</span>
                    </span>
                  }
                  extra="Provide reason for your leave request"
                  validateFirst
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please provide a professional reason for your leave",
                    },
                    {
                      min: 10,
                      message: "Reason must be at least 10 characters long",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Briefly describe the reason for your leave request"
                    showCount
                    maxLength={2000}
                    className="leave-textarea"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="applying-as">
              <span className="user-dot">👤</span>
              <Text>
                Applying as: <strong>{userName || "Employee"}</strong>
              </Text>
            </div>

            <div className="leave-actions">
              <Button
                size="large"
                className="reset-button"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SendOutlined />}
                className="submit-button"
              >
                Submit Application
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <style>{`
        .leave-page {
          width: 100%;
          padding: 16px;
          background: #ffffff;
          min-height: calc(100vh - 64px);
          box-sizing: border-box;
        }

        .leave-shell {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
          background: #ffffff;
        }

        .leave-hero {
          min-height: 110px;
          padding: 24px 28px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .leave-title.ant-typography {
          margin: 0 0 6px !important;
          color: #0f172a;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .leave-subtitle.ant-typography {
          margin: 0 !important;
          color: #64748b;
          font-size: 13px;
        }

        .leave-hero-icon {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 28px;
          color: #2563eb;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .leave-info {
          margin: 16px 28px 0;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          color: #475569;
        }

        .leave-info .ant-typography {
          color: #475569;
          font-size: 13px;
        }

        .leave-form {
          padding: 20px 28px 26px;
        }

        .field-label {
          color: #172554;
          font-size: 13px;
          font-weight: 650;
        }

        .field-label > span {
          color: #ef4444;
        }

        .leave-form .ant-form-item {
          margin-bottom: 16px;
        }

        .leave-form .ant-form-item-extra {
          min-height: 18px;
          padding-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .leave-picker {
          width: 100%;
          height: 46px;
          border-radius: 8px;
          border-color: #dbe3ef;
        }

        .leave-picker:hover,
        .leave-picker.ant-picker-focused {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .duration-section {
          margin-bottom: 16px;
        }

        .duration-section > .field-label {
          display: block;
          margin-bottom: 8px;
        }

        .duration-card {
          min-height: 90px;
          box-sizing: border-box;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .duration-card.empty {
          border-color: #e2e8f0;
          background: #ffffff;
        }

        .duration-icon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #16a34a;
          font-size: 18px;
        }

        .duration-card.empty .duration-icon {
          background: #ffffff;
          color: #94a3b8;
        }

        .duration-value {
          color: #0f172a;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }

        .duration-card.empty .duration-value {
          color: #94a3b8;
          font-size: 15px;
        }

        .duration-help {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 10px;
        }

        .extended-tag {
          margin-left: auto;
        }

        .leave-textarea {
          min-height: 102px !important;
          padding: 12px;
          border-radius: 8px;
          border-color: #dbe3ef;
          resize: vertical;
        }

        .leave-textarea:hover,
        .leave-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .applying-as {
          min-height: 40px;
          padding: 8px 12px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .applying-as .ant-typography {
          color: #475569;
          font-size: 12px;
        }

        .applying-as strong {
          color: #0f172a;
        }

        .user-dot {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f1f5f9;
          font-size: 12px;
        }

        .leave-actions {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .reset-button,
        .submit-button {
          height: 44px;
          border-radius: 8px;
          font-weight: 650;
        }

        .reset-button {
          min-width: 118px;
          border-color: #cbd5e1;
          color: #334155;
          background: #ffffff;
        }

        .submit-button {
          min-width: 190px;
          border: none;
          background: #008cba;
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.2);
        }

        .submit-button:hover {
          background: #008cba !important;
        }

        @media (max-width: 991px) {
          .leave-page {
            padding: 14px;
          }

          .leave-hero {
            min-height: 100px;
            padding: 20px 22px;
          }

          .leave-info {
            margin: 14px 22px 0;
          }

          .leave-form {
            padding: 18px 22px 24px;
          }
        }

        @media (max-width: 767px) {
          .leave-page {
            padding: 10px;
          }

          .leave-shell {
            border-radius: 10px;
          }

          .leave-hero {
            min-height: 90px;
            padding: 16px 14px;
          }

          .leave-title.ant-typography {
            font-size: 18px;
          }

          .leave-subtitle.ant-typography {
            font-size: 12px;
          }

          .leave-hero-icon {
            width: 46px;
            height: 46px;
            flex-basis: 46px;
            border-radius: 10px;
            font-size: 22px;
          }

          .leave-info {
            margin: 12px 10px 0;
            padding: 8px 10px;
            align-items: flex-start;
          }

          .leave-info .ant-typography {
            font-size: 11px;
            line-height: 1.5;
          }

          .leave-form {
            padding: 14px 10px 18px;
          }

          .leave-form .ant-form-item {
            margin-bottom: 12px;
          }

          .leave-picker {
            height: 42px;
          }

          .duration-card {
            min-height: 76px;
            padding: 12px;
          }

          .duration-value {
            font-size: 15px;
          }

          .leave-actions {
            display: grid;
            grid-template-columns: 1fr 1.35fr;
            gap: 8px;
          }

          .reset-button,
          .submit-button {
            width: 100%;
            min-width: 0;
            height: 40px;
            padding-inline: 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 390px) {
          .leave-page {
            padding: 6px;
          }

          .leave-hero {
            padding: 14px 10px;
          }

          .leave-hero-icon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
            font-size: 18px;
          }

          .leave-title.ant-typography {
            font-size: 16px;
          }

          .leave-actions {
            grid-template-columns: 0.9fr 1.4fr;
          }
        }
      `}</style>
    </UserPanelLayout>
  );
};

export default LeaveApplicationPage;