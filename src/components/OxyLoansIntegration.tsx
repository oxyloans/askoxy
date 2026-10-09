import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleFilled,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

const { Title, Text } = Typography;

const API_BASE = `${BASE_URL.replace(/\/$/, "")}/user-service/integration/oxyloans`;

type Role = "BORROWER" | "LENDER" | "PARTNER";

type TrackingItem = {
  trackingId: string;
  askoxyUserId: string;
  oxyloansUserId: string | null;
  role: string;
  registered: boolean;
  registrationDate: string | null;
  lastLogin: string | null;
  loginCount: number;
  status: string;
  lastSyncedAt: string | null;
};

type UserStatus = {
  borrowerRegistered: boolean;
  lenderRegistered: boolean;
  partnerRegistered: boolean;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type RoleConfig = {
  title: string;
  icon: React.ReactNode;
  registeredKey: keyof UserStatus;
  accent: string;
  soft: string;
  border: string;
  benefits: [string, string];
  startLabel: string;
};

const roleConfig: Record<Role, RoleConfig> = {
  LENDER: {
    title: "Lender",
    icon: <WalletOutlined />,
    registeredKey: "lenderRegistered",
    accent: "#6D28D9",
    soft: "#F7F3FF",
    border: "#E8DEFF",
    benefits: [
      "Earn up to 1.75% monthly ROI",
      "Start lending from ₹500",
    ],
    startLabel: "Start Lending",
  },
  BORROWER: {
    title: "Borrower",
    icon: <UserOutlined />,
    registeredKey: "borrowerRegistered",
    accent: "#2563EB",
    soft: "#F2F7FF",
    border: "#DCE9FF",
    benefits: [
      "Loans up to ₹10 lakh for eligible users",
      "Simple guided digital application journey",
    ],
    startLabel: "Apply for Loan",
  },
  PARTNER: {
    title: "Partner",
    icon: <TeamOutlined />,
    registeredKey: "partnerRegistered",
    accent: "#0F766E",
    soft: "#F1FBF9",
    border: "#D5F1EC",
    benefits: [
      "Refer lenders and borrowers",
      "Grow through the OxyLoans partner network",
    ],
    startLabel: "Join as Partner",
  },
};

const readJson = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getUserId = (): string => {
  const direct = localStorage.getItem("userId")?.trim();
  if (direct) return direct;

  for (const key of ["user", "auth", "authData", "loginData"]) {
    const value = readJson(key);
    const id =
      value?.userId ||
      value?.data?.userId ||
      value?.data?.body?.userId ||
      value?.body?.userId;

    if (id) return String(id);
  }

  return "";
};

const getApiMessage = (error: unknown): string => {
  const data = (error as { response?: { data?: { message?: string } } })
    ?.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "";
};

const showToast = (
  icon: "success" | "warning" | "error",
  title: string,
) => {
  if (!title) return;

  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toastEl) => {
      toastEl.onmouseenter = Swal.stopTimer;
      toastEl.onmouseleave = Swal.resumeTimer;
    },
  }).fire({ icon, title });
};

const apiGet = async <T,>(path: string): Promise<ApiEnvelope<T>> => {
  const response = await customerApi.get(`${API_BASE}${path}`);
  const payload = response.data as ApiEnvelope<T>;

  if (payload?.success === false) {
    throw new Error(payload?.message || "");
  }

  return payload;
};

const apiPost = async <T,>(
  path: string,
  body: unknown,
): Promise<ApiEnvelope<T>> => {
  const response = await customerApi.post(`${API_BASE}${path}`, body);
  const payload = response.data as ApiEnvelope<T>;

  if (payload?.success === false) {
    throw new Error(payload?.message || "");
  }

  return payload;
};

const detectBrowser = () => {
  const ua = navigator.userAgent;
  const match =
    ua.match(/Edg\/(\d+)/) ||
    ua.match(/Chrome\/(\d+)/) ||
    ua.match(/Firefox\/(\d+)/) ||
    ua.match(/Version\/(\d+).*Safari/) ||
    ua.match(/OPR\/(\d+)/);

  if (/Edg\//.test(ua)) return `Edge ${match?.[1] || ""}`.trim();
  if (/OPR\//.test(ua)) return `Opera ${match?.[1] || ""}`.trim();
  if (/Chrome\//.test(ua)) return `Chrome ${match?.[1] || ""}`.trim();
  if (/Firefox\//.test(ua)) return `Firefox ${match?.[1] || ""}`.trim();
  if (/Safari\//.test(ua)) return `Safari ${match?.[1] || ""}`.trim();

  return "Unknown browser";
};

const detectDevice = () => {
  const ua = navigator.userAgent;

  if (/Android/i.test(ua)) {
    const version = ua.match(/Android\s([\d.]+)/)?.[1];
    return `Android${version ? ` ${version}` : ""}`;
  }

  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS / iPadOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";

  return navigator.platform || "Unknown device";
};

const getPublicIp = async () => {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);

    const response = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    });

    window.clearTimeout(timer);

    if (!response.ok) return "";

    const data = await response.json();
    return typeof data?.ip === "string" ? data.ip : "";
  } catch {
    return "";
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OxyLoansIntegration: React.FC = () => {
  const askoxyUserId = useMemo(() => getUserId(), []);

  const [tracking, setTracking] = useState<TrackingItem[]>([]);
  const [status, setStatus] = useState<UserStatus>({
    borrowerRegistered: false,
    lenderRegistered: false,
    partnerRegistered: false,
  });
  const [loading, setLoading] = useState(true);
  const [openingRole, setOpeningRole] = useState<Role | null>(null);

  const loadData = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!askoxyUserId) {
        if (!options?.silent) {
          showToast(
            "error",
            "We could not find your AskOxy user ID. Please sign in again.",
          );
        }
        setLoading(false);
        return;
      }

      const [trackingResult, statusResult] = await Promise.allSettled([
        apiGet<TrackingItem[]>(
          `/tracking/${encodeURIComponent(askoxyUserId)}`,
        ),
        apiGet<UserStatus>(
          `/user-status/${encodeURIComponent(askoxyUserId)}`,
        ),
      ]);

      if (trackingResult.status === "fulfilled") {
        setTracking(
          Array.isArray(trackingResult.value.data)
            ? trackingResult.value.data
            : [],
        );
      }

      if (statusResult.status === "fulfilled") {
        setStatus(
          statusResult.value.data || {
            borrowerRegistered: false,
            lenderRegistered: false,
            partnerRegistered: false,
          },
        );
      }

      if (!options?.silent) {
        const failures = [trackingResult, statusResult].filter(
          (result) => result.status === "rejected",
        ) as PromiseRejectedResult[];

        if (failures.length > 0) {
          const message = getApiMessage(failures[0].reason);
          if (message) {
            showToast(failures.length === 2 ? "error" : "warning", message);
          }
        }
      }

      setLoading(false);
    },
    [askoxyUserId],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") {
        loadData({ silent: true });
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [loadData]);

  const getRoleTracking = (role: Role) =>
    tracking.find((item) => item.role?.toUpperCase() === role);

  const isRoleRegistered = (role: Role) => {
    const config = roleConfig[role];
    const item = getRoleTracking(role);

    return Boolean(status[config.registeredKey] || item?.registered);
  };

  const registeredRoles = (
    ["LENDER", "BORROWER", "PARTNER"] as Role[]
  ).filter(isRoleRegistered);

  const hasRegisteredRole = registeredRoles.length > 0;

  const openRoleFlow = async (role: Role) => {
    if (!askoxyUserId || openingRole) return;
    if (hasRegisteredRole && !isRoleRegistered(role)) return;

    setOpeningRole(role);

    const redirectWindow = window.open("about:blank", "_blank");

    try {
      const ipAddress = await getPublicIp();

      const result = await apiPost<{
        trackingId: string;
        redirectUrl: string;
      }>("/click", {
        askoxyUserId,
        browser: detectBrowser(),
        device: detectDevice(),
        ipAddress,
        role,
      });

      const redirectUrl = result.data?.redirectUrl;

      if (!redirectUrl) {
        if (result.message) {
          showToast("error", result.message);
        }
        redirectWindow?.close();
        return;
      }

      if (result.message) {
        showToast("success", result.message);
      }

      await loadData({ silent: true });

      if (redirectWindow && !redirectWindow.closed) {
        redirectWindow.location.href = redirectUrl;
      } else {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      redirectWindow?.close();

      const message = getApiMessage(err);
      if (message) showToast("error", message);
    } finally {
      setOpeningRole(null);
    }
  };

  const roles: Role[] = ["LENDER", "BORROWER", "PARTNER"];

  const displayRoles = hasRegisteredRole
    ? roles.filter((role) => isRoleRegistered(role))
    : roles;

  const trackingColumns: ColumnsType<TrackingItem> = [
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      align: "center",
      render: (value: string) => (
        <Tooltip title={value}>
          <Text code className="text-xs">
            #{value?.slice(-4) || "—"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (value: string) => (
        <Text strong className="text-xs sm:text-sm">
          {value || "—"}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, item) => (
        <Tag
          color={item.registered ? "success" : "processing"}
          className="!m-0 rounded-full !px-2.5"
        >
          {item.registered ? "Registered" : "In progress"}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      align: "center",
      render: (value: string | null) => (
        <Text className="whitespace-nowrap text-xs">
          {formatDate(value)}
        </Text>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (value: string | null) => (
        <Text className="whitespace-nowrap text-xs">
          {formatDate(value)}
        </Text>
      ),
    },
    {
      title: "Last Synced",
      dataIndex: "lastSyncedAt",
      key: "lastSyncedAt",
      align: "center",
      render: (value: string | null) => (
        <Text className="whitespace-nowrap text-xs !text-slate-400">
          {formatDate(value)}
        </Text>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6D28D9",
          borderRadius: 12,
          borderRadiusLG: 16,
          colorBgLayout: "#F8FAFC",
          colorBorderSecondary: "#E5E7EB",
        },
        components: {
          Button: {
            primaryShadow: "none",
          },
          Table: {
            headerBg: "#F8FAFC",
            headerColor: "#475569",
          },
        },
      }}
    >
      <div className="min-h-full bg-white">
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* Page Heading + Referral Network CTA */}
          <div className="mb-5 sm:mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <Title
                  level={2}
                  className="!m-0 !text-[24px] !font-bold !leading-tight !text-slate-900 sm:!text-[28px]"
                >
                  Partner Journeys
                </Title>

                <Text className="mt-1.5 block !text-[13px] !leading-5 !text-slate-500 sm:!text-sm">
                  Choose the journey that matches your requirement.
                </Text>
              </div>

              <Button
                type="default"
                icon={<TeamOutlined />}
                onClick={() => {
                  window.location.href = "/main/oxyloans/referral-network";
                }}
                className="
                  !h-11 w-full shrink-0
                  !rounded-xl
                  !border-violet-200
                  !bg-violet-50
                  !px-4
                  !font-semibold
                  !text-violet-700
                  shadow-none
                  transition-all
                  hover:!border-violet-300
                  hover:!bg-violet-100
                  hover:!text-violet-800
                  sm:w-auto
                "
              >
                <span className="flex items-center justify-center gap-2">
                  View Referral Network
                  <ArrowRightOutlined className="text-[12px]" />
                </span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <Spin />
                <div className="mt-3 text-sm text-slate-500">
                  Loading journeys...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Role Cards */}
              <section
                className={`grid grid-cols-1 gap-4 sm:gap-5 ${
                  displayRoles.length === 1
                    ? "max-w-lg"
                    : displayRoles.length === 2
                      ? "md:grid-cols-2"
                      : "md:grid-cols-3"
                }`}
              >
                {displayRoles.map((role) => {
                  const config = roleConfig[role];
                  const item = getRoleTracking(role);
                  const registered = isRoleRegistered(role);
                  const started = Boolean(item);
                  const isOpening = openingRole === role;

                  const statusLabel = registered
                    ? "Registered"
                    : started
                      ? "In progress"
                      : null;

                  const buttonLabel = registered
                    ? `Open ${config.title}`
                    : started
                      ? `Continue ${config.title}`
                      : config.startLabel;

                  return (
                    <Card
                      key={role}
                      bordered={false}
                      className="
                        group h-full overflow-hidden
                        !rounded-2xl
                        border border-slate-200
                        bg-white
                        shadow-[0_5px_18px_rgba(15,23,42,0.05)]
                        transition-all duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_10px_28px_rgba(15,23,42,0.09)]
                      "
                      styles={{
                        body: {
                          padding: 0,
                          height: "100%",
                        },
                      }}
                    >
                      <div
                        className="h-1 w-full"
                        style={{ backgroundColor: config.accent }}
                      />

                      <div className="flex h-full flex-col p-4 sm:p-5">
                        {/* Title Row */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                              style={{
                                color: config.accent,
                                backgroundColor: config.soft,
                                border: `1px solid ${config.border}`,
                              }}
                            >
                              {config.icon}
                            </div>

                            <Title
                              level={4}
                              className="!m-0 !text-[19px] !font-bold !text-slate-900 sm:!text-[20px]"
                            >
                              {config.title}
                            </Title>
                          </div>

                          {statusLabel && (
                            <Tag
                              color={registered ? "success" : "processing"}
                              className="!m-0 shrink-0 rounded-full !px-2.5 text-[10px] font-medium"
                            >
                              {statusLabel}
                            </Tag>
                          )}
                        </div>

                        {/* Two Benefit Lines Only */}
                        <div className="mt-4 space-y-2.5">
                          {config.benefits.map((benefit) => (
                            <div
                              key={benefit}
                              className="flex items-start gap-2.5"
                            >
                              <CheckCircleFilled
                                className="mt-[3px] shrink-0 text-[14px]"
                                style={{ color: config.accent }}
                              />

                              <span className="text-[13px] leading-5 text-slate-600">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-auto pt-5">
                          <Button
                            type="primary"
                            block
                            loading={isOpening}
                            disabled={Boolean(openingRole) && !isOpening}
                            onClick={() => openRoleFlow(role)}
                            style={{
                              backgroundColor: config.accent,
                              borderColor: config.accent,
                            }}
                            className="!h-11 !rounded-xl !font-semibold shadow-none"
                          >
                            <span className="flex items-center justify-center gap-2">
                              {buttonLabel}
                              {!isOpening && (
                                <ArrowRightOutlined className="transition-transform duration-200 group-hover:translate-x-1" />
                              )}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              {/* Journey Activity */}
              <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <BankOutlined />
                  </div>

                  <Text strong className="!text-[15px] !text-slate-800">
                    Journey Activity
                  </Text>
                </div>

                <div className="overflow-x-auto">
                  <Table<TrackingItem>
                    rowKey={(item) =>
                      item.trackingId ||
                      `${item.role}-${item.askoxyUserId}`
                    }
                    columns={trackingColumns}
                    dataSource={tracking}
                    size="middle"
                    pagination={
                      tracking.length > 10
                        ? {
                            pageSize: 10,
                            showSizeChanger: false,
                          }
                        : false
                    }
                    scroll={{ x: 760 }}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No journey activity yet."
                        />
                      ),
                    }}
                  />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansIntegration;