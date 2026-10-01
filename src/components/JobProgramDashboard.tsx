"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Progress,
  Tag,
  Button,
  Spin,
  Typography,
  Alert,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  LoginOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

const { Title, Text, Paragraph } = Typography;

interface DayProgress {
  dayNumber: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress: number;
}

interface JobProgramDashboardResponse {
  currentDay: number;
  totalDays: number;
  daysCompleted: number;
  daysVisited: number;
  overallProgress: number;
  totalTimeSpentMinutes: number;
  status: string;
  interestLocked: boolean;
  extensionRequested: boolean;
  examEligible: boolean;
  days: DayProgress[];
}

interface JobProgramDashboardProps {
  userId?: string;
}

const API_BASE_URL =
  `${BASE_URL}/marketing-service/campgin/job-program/dashboard`;

export default function JobProgramDashboard({
  userId: propUserId,
}: JobProgramDashboardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Resolve userId from props, URL query parameter, localStorage, or sessionStorage
  const resolvedUserId =
    propUserId ||
    searchParams.get("userId") ||
    searchParams.get("userid") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("userid") ||
    localStorage.getItem("customerId") ||
    sessionStorage.getItem("userId") ||
    sessionStorage.getItem("userid") ||
    "";

  const [data, setData] = useState<JobProgramDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    if (!resolvedUserId || resolvedUserId === "null" || resolvedUserId.trim() === "") {
      setLoading(false);
      setError("Please log in to view your Job Program Dashboard.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await customerApi.get(
        `${API_BASE_URL}?userId=${encodeURIComponent(resolvedUserId.trim())}`
      );

      const resData = response?.data?.data ?? response?.data;
      if (resData && typeof resData === "object") {
        setData({
          currentDay: resData.currentDay ?? 1,
          totalDays: resData.totalDays ?? 9,
          daysCompleted: resData.daysCompleted ?? 0,
          daysVisited: resData.daysVisited ?? 0,
          overallProgress: resData.overallProgress ?? 0,
          totalTimeSpentMinutes: resData.totalTimeSpentMinutes ?? 0,
          status: resData.status || "ACTIVE",
          interestLocked: Boolean(resData.interestLocked),
          extensionRequested: Boolean(resData.extensionRequested),
          examEligible: Boolean(resData.examEligible),
          days: Array.isArray(resData.days) ? resData.days : [],
        });
      } else {
        setError("Invalid response format received from server.");
      }
    } catch (err: any) {
      console.error("Job program dashboard error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to load job program dashboard.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Loading State with Ant Design Card & Spin
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl text-center py-20 bg-white"
        >
          <Spin size="large" />
          <Title level={4} className="mt-4 !mb-1 text-gray-800">
            Loading Job Program Dashboard...
          </Title>
          <Text type="secondary">
            Fetching your curriculum progress and day-wise activities.
          </Text>
        </Card>
      </div>
    );
  }

  // Error State with Ant Design Card & Alert
  if (error) {
    const isLoginError =
      !resolvedUserId ||
      resolvedUserId === "null" ||
      error.toLowerCase().includes("log in") ||
      error.toLowerCase().includes("user id");

    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl p-4 sm:p-6 bg-white"
        >
          <Alert
            message={
              <span className="font-semibold text-base">
                {isLoginError ? "Authentication Required" : "Unable to Load Dashboard"}
              </span>
            }
            description={
              <div className="mt-2">
                <Paragraph type="secondary" className="!mb-4">
                  {error}
                </Paragraph>
                {isLoginError ? (
                  <Button
                    type="primary"
                    icon={<LoginOutlined />}
                    size="large"
                    onClick={() => {
                      sessionStorage.setItem("redirectPath", window.location.pathname);
                      navigate("/whatsapplogin");
                    }}
                  >
                    Go to Login
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    size="large"
                    onClick={fetchDashboard}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            }
            type={isLoginError ? "warning" : "error"}
            showIcon
          />
        </Card>
      </div>
    );
  }

  // Empty State with Ant Design Card & Empty
  if (!data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Card bordered={false} className="shadow-sm rounded-2xl text-center py-16 bg-white">
          <Empty
            description={
              <span className="text-gray-500 font-medium">
                No job program dashboard data found.
              </span>
            }
          >
            <Button type="primary" onClick={fetchDashboard}>
              Reload Dashboard
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  const hoursSpent = (data.totalTimeSpentMinutes / 60).toFixed(1);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 bg-white min-h-screen">
      {/* ─── 1. Header (Clean, no card background, no top-left border, no refresh button) ─── */}
      <div className="pb-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <Title level={2} className="!mb-0 !font-bold text-gray-900 tracking-tight">
            Job Program Progress    
          </Title>
          
        </div>
        <Paragraph type="secondary" className="!mt-1 !mb-0 text-sm text-gray-500">
          Track your 9-day program journey, monitor module completion, and stay prepared for upcoming assessments.
        </Paragraph>
      </div>

      {/* ─── 2. Metric Stat Cards ─── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            className="shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md border border-gray-100 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Current Milestone
                </Text>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  Day {data.currentDay}
                </div>
                <Text type="secondary" className="text-xs text-gray-500">
                  of {data.totalDays} Total Days
                </Text>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <CalendarOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            className="shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md border border-gray-100 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Days Completed
                </Text>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {data.daysCompleted} / {data.totalDays}
                </div>
                <Text type="secondary" className="text-xs text-gray-500">
                  Milestones Accomplished
                </Text>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircleOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            className="shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md border border-gray-100 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Days Visited
                </Text>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {data.daysVisited} Days
                </div>
                <Text type="secondary" className="text-xs text-gray-500">
                  Active Platform Sessions
                </Text>
              </div>
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <EyeOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            className="shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md border border-gray-100 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Learning Time Invested
                </Text>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {data.totalTimeSpentMinutes} min
                </div>
                <Text type="secondary" className="text-xs text-gray-500">
                  ≈ {hoursSpent} hours focused study
                </Text>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <ClockCircleOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ─── 3. Program Status & Eligibility Row ─── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="shadow-sm rounded-2xl h-full border border-gray-100 flex flex-col justify-between bg-white"
          >
            <div>
              <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Enrollment Standing
              </Text>
              <Title level={5} className="!mt-1 !mb-1 text-gray-900">
                Program Status
              </Title>
              <Text type="secondary" className="text-xs text-gray-500">
                Current participation status
              </Text>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <Tag
                color={data.status === "ACTIVE" ? "success" : "default"}
                className="px-3 py-0.5 font-semibold rounded-md"
              >
                {data.status || "ACTIVE"}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="shadow-sm rounded-2xl h-full border border-gray-100 flex flex-col justify-between bg-white"
          >
            <div>
              <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Job Preferences
              </Text>
              <Title level={5} className="!mt-1 !mb-1 text-gray-900">
                Interest Locking
              </Title>
              <Text type="secondary" className="text-xs text-gray-500">
                {data.interestLocked
                  ? "Your job preferences are confirmed & locked"
                  : "Preferences open for editing"}
              </Text>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Lock State</span>
              <Tag
                icon={data.interestLocked ? <LockOutlined /> : <UnlockOutlined />}
                color={data.interestLocked ? "error" : "processing"}
                className="px-3 py-0.5 font-semibold rounded-md"
              >
                {data.interestLocked ? "LOCKED" : "UNLOCKED"}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            className="shadow-sm rounded-2xl h-full border border-gray-100 flex flex-col justify-between bg-white"
          >
            <div>
              <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Assessment Clearance
              </Text>
              <Title level={5} className="!mt-1 !mb-1 text-gray-900">
                Exam Eligibility
              </Title>
              <Text type="secondary" className="text-xs text-gray-500">
                {data.examEligible
                  ? "Eligible to appear for certification exam"
                  : "Complete program days to unlock final exam"}
              </Text>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Eligibility</span>
              <Tag
                icon={data.examEligible ? <SafetyCertificateOutlined /> : <HourglassOutlined />}
                color={data.examEligible ? "success" : "warning"}
                className="px-3 py-0.5 font-semibold rounded-md"
              >
                {data.examEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ─── 4. Extension Request Card ─── */}
      <Card
        bordered={false}
        className={`shadow-sm rounded-2xl border ${
          data.extensionRequested
            ? "border-amber-300 bg-amber-50/60"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                data.extensionRequested
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <HourglassOutlined className="text-xl" />
            </div>
            <div>
              <Title level={5} className="!mb-0 text-gray-900 font-semibold">
                Program Extension Request
              </Title>
              <Paragraph type="secondary" className="!mb-0 text-sm">
                {data.extensionRequested
                  ? "An extension request has been submitted for your learning track. Our team is processing it."
                  : "Standard learning timeline active. No extension requested."}
              </Paragraph>
            </div>
          </div>

          <Tag
            color={data.extensionRequested ? "warning" : "default"}
            className="self-start sm:self-center px-3 py-1 font-semibold rounded-md"
          >
            {data.extensionRequested ? "REQUESTED" : "NOT REQUESTED"}
          </Tag>
        </div>
      </Card>

      {/* ─── 6. Program Days Grid with Ant Design Cards ─── */}
      <Card
        bordered={false}
        className="shadow-sm rounded-2xl bg-white border border-gray-100"
      >
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-blue-600 text-xl" />
            <Title level={4} className="!mb-0 font-bold text-gray-900">
              Daily Program Roadmap
            </Title>
          </div>
          <Paragraph type="secondary" className="!mt-1 !mb-0 text-sm">
            Step-by-step progress across each day. Complete all tasks to advance to the next day.
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          {(data.days || []).map((day) => {
            const isCurrent = day.dayNumber === data.currentDay;
            const isCompleted = day.status === "COMPLETED";

            let tagColor = "default";
            let statusLabel = "NOT STARTED";
            if (isCompleted) {
              tagColor = "success";
              statusLabel = "COMPLETED";
            } else if (isCurrent) {
              tagColor = "processing";
              statusLabel = "CURRENT DAY";
            } else if (day.status === "IN_PROGRESS") {
              tagColor = "warning";
              statusLabel = "IN PROGRESS";
            }

            return (
              <Col xs={24} sm={12} lg={8} key={day.dayNumber}>
                <Card
                  bordered={false}
                  hoverable
                  className={`rounded-2xl transition-all duration-300 h-full border ${
                    isCurrent
                      ? "border-blue-400 bg-blue-50/40 shadow-md ring-1 ring-blue-300"
                      : isCompleted
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Text
                        type="secondary"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        Module Milestone
                      </Text>
                      <Title level={4} className="!mt-1 !mb-0 text-gray-900">
                        Day {day.dayNumber}
                      </Title>
                    </div>

                    <Tag
                      color={tagColor}
                      className="px-2.5 py-0.5 text-xs font-bold rounded-full"
                    >
                      {statusLabel}
                    </Tag>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                      <span className="text-gray-500">Day Progress</span>
                      <span className="text-gray-800 font-bold">{day.progress}%</span>
                    </div>

                    <Progress
                      percent={Math.min(Math.max(day.progress, 0), 100)}
                      strokeColor={
                        isCompleted
                          ? "#10b981"
                          : isCurrent
                          ? "#2563eb"
                          : "#94a3b8"
                      }
                      size="small"
                      status={
                        isCompleted
                          ? "success"
                          : isCurrent
                          ? "active"
                          : "normal"
                      }
                      showInfo={false}
                    />

                    <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
                      <span>
                        {isCompleted
                          ? "Completed ✓"
                          : isCurrent
                          ? "Active today"
                          : "Upcoming module"}
                      </span>
                      {isCurrent && (
                        <span className="text-blue-600 font-semibold">In Progress</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
}