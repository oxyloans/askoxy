import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Empty,
  Space,
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
  ExportOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

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
};

const roleConfig: Record<Role, RoleConfig> = {
  LENDER: {
    title: "Lender",
    icon: <WalletOutlined />,
    registeredKey: "lenderRegistered",
    accent: "#722ed1", // Ant Design purple
    soft: "#f9f0ff", // Ant Design purple-1
  },
  BORROWER: {
    title: "Borrower",
    icon: <UserOutlined />,
    registeredKey: "borrowerRegistered",
    accent: "#1677ff", // Ant Design blue
    soft: "#e6f4ff", // Ant Design blue-1
  },

  PARTNER: {
    title: "Partner",
    icon: <TeamOutlined />,
    registeredKey: "partnerRegistered",
    accent: "#13c2c2", // Ant Design cyan
    soft: "#e6fffb", // Ant Design cyan-1
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

const getAccessToken = (): string => {
  for (const key of ["accessToken", "token", "authToken", "jwtToken"]) {
    const value = localStorage.getItem(key)?.trim();
    if (value) return value.replace(/^Bearer\s+/i, "");
  }

  for (const key of ["user", "auth", "authData", "loginData"]) {
    const value = readJson(key);
    const token =
      value?.accessToken ||
      value?.token ||
      value?.data?.accessToken ||
      value?.data?.token ||
      value?.data?.body?.accessToken;
    if (token) return String(token).replace(/^Bearer\s+/i, "");
  }
  return "";
};

const apiRequest = async <T,>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> => {
  const token = getAccessToken();
  if (!token)
    throw new Error("Your login session is missing. Please sign in again.");

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    // handled below
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "Your session has expired or you are not authorized. Please sign in again.",
    );
  }
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }
  return payload as ApiEnvelope<T>;
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
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    if (!askoxyUserId) {
      setError("We could not find your AskOxy user ID. Please sign in again.");
      setLoading(false);
      return;
    }

    setError("");
    setNotice("");
    const [trackingResult, statusResult] = await Promise.allSettled([
      apiRequest<TrackingItem[]>(
        `/tracking/${encodeURIComponent(askoxyUserId)}`,
      ),
      apiRequest<UserStatus>(
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

    const failures = [trackingResult, statusResult].filter(
      (result) => result.status === "rejected",
    );
    if (failures.length === 2) {
      const first = failures[0] as PromiseRejectedResult;
      setError(
        first.reason instanceof Error
          ? first.reason.message
          : "Unable to load OxyLoans data.",
      );
    } else if (failures.length) {
      setNotice(
        "Some OxyLoans information could not be loaded. Available data is shown below.",
      );
    }
    setLoading(false);
  }, [askoxyUserId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") loadData();
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

  const openRoleFlow = async (role: Role) => {
    if (!askoxyUserId || openingRole) return;
    setOpeningRole(role);
    setError("");
    setNotice("");
    const redirectWindow = window.open("about:blank", "_blank");

    try {
      const ipAddress = await getPublicIp();
      const result = await apiRequest<{
        trackingId: string;
        redirectUrl: string;
      }>("/click", {
        method: "POST",
        body: JSON.stringify({
          askoxyUserId,
          browser: detectBrowser(),
          device: detectDevice(),
          ipAddress,
          role,
        }),
      });

      const redirectUrl = result.data?.redirectUrl;
      if (!redirectUrl)
        throw new Error("OxyLoans did not return a redirect URL.");
      await loadData();

      if (redirectWindow && !redirectWindow.closed)
        redirectWindow.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch (err) {
      redirectWindow?.close();
      setError(
        err instanceof Error
          ? err.message
          : "Unable to open OxyLoans. Please try again.",
      );
    } finally {
      setOpeningRole(null);
    }
  };

  const roles: Role[] = ["BORROWER", "LENDER", "PARTNER"];

  const trackingColumns: ColumnsType<TrackingItem> = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",

      align: "center",
      render: (value: string) => <Text strong>{value || "—"}</Text>,
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, item) => (
        <Tag color={item.registered ? "success" : "processing"}>
          {item.registered ? "Registered" : "In progress"}
        </Tag>
      ),
    },
    {
      title: "Logins",
      dataIndex: "loginCount",
      key: "loginCount",

      align: "center",
      render: (value: number) => value || 0,
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      align: "center",
      render: (value: string | null) => (
        <Text className="whitespace-nowrap text-xs">{formatDate(value)}</Text>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      align: "center",
      render: (value: string | null) => (
        <Text className="whitespace-nowrap text-xs">{formatDate(value)}</Text>
      ),
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      align: "center",

      render: (value: string) => (
        <Tooltip title={value}>
          <Text code className="text-xs">
            {value.slice(-4) || "—"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Last Synced",
      dataIndex: "lastSyncedAt",
      key: "lastSyncedAt",
      align: "center",
      render: (value: string | null) => (
        <Text type="secondary" className="whitespace-nowrap text-xs">
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
          colorPrimary: "#722ed1",
          borderRadius: 10,
          borderRadiusLG: 12,
          colorBgLayout: "#f5f5f5",
          colorBorderSecondary: "#f0f0f0",
        },
        components: {
          Button: { primaryShadow: "none" },
          Card: { headerBg: "#ffffff" },
          Table: { headerBg: "#fafafa", headerColor: "#595959" },
        },
      }}
    >
      <div className="min-h-full ">
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          <div className="mb-4 flex items-center justify-between">
            <Title level={3} className="!m-0 !text-xl sm:!text-2xl">
              OxyLoans
            </Title>
          </div>

          {(error || notice) && (
            <Alert
              className="mb-4"
              type={error ? "error" : "warning"}
              showIcon
              message={
                error ? "Unable to load OxyLoans information" : "Partial update"
              }
              description={error || notice}
            />
          )}

          {loading ? (
            <Card bordered={false} className="shadow-sm">
              <div className="flex min-h-[220px] items-center justify-center">
                <Space direction="vertical" align="center">
                  <Spin size="large" />
                  <Text type="secondary">
                    Loading your OxyLoans journeys...
                  </Text>
                </Space>
              </div>
            </Card>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                {roles.map((role) => {
                  const config = roleConfig[role];
                  const item = getRoleTracking(role);

                  const registered = Boolean(
                    status[config.registeredKey] || item?.registered,
                  );

                  const started = Boolean(item);
                  const isOpening = openingRole === role;

                  const statusLabel = registered
                    ? "Registered"
                    : started
                      ? "In progress"
                      : "Not started";

                  const statusColor = registered
                    ? "success"
                    : started
                      ? "processing"
                      : "default";

                  const buttonLabel = registered
                    ? `Open ${config.title}`
                    : started
                      ? `Continue ${config.title}`
                      : `Start ${config.title}`;

                  return (
                    <Card
                      key={role}
                      hoverable
                      bordered={false}
                      className="
          group h-full overflow-hidden
          rounded-lg
          border border-transparent
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
                      style={{
                        background: `linear-gradient(
            135deg,
            ${config.soft} 0%,
            #ffffff 72%
          )`,
                        // borderColor: `${config.accent}20`,
                      }}
                      styles={{
                        body: {
                          padding: 0,
                          height: "100%",
                        },
                      }}
                    >
                      {/* top accent */}
                      <div
                        className="h-[4px] w-full"
                        style={{
                          backgroundColor: config.accent,
                        }}
                      />

                      <div className="flex h-full flex-col p-4 sm:p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar
                              size={44}
                              icon={config.icon}
                              style={{
                                color: config.accent,
                                backgroundColor: "#ffffff",
                                border: `1px solid ${config.accent}30`,
                                boxShadow: `0 4px 12px ${config.accent}18`,
                              }}
                            />

                            <div className="min-w-0">
                              <Title
                                level={5}
                                className="!mb-0 !mt-0 !font-semibold"
                              >
                                {config.title}
                              </Title>

                              <Text
                                type="secondary"
                                className="mt-1 block text-xs leading-5"
                              >
                                {registered
                                  ? "Your registration is complete"
                                  : started
                                    ? "Continue your existing journey"
                                    : `Start your ${config.title.toLowerCase()} journey`}
                              </Text>
                            </div>
                          </div>

                          <Tag
                            color={statusColor}
                            className="
                !m-0
                shrink-0
                rounded-full
                !px-2.5
                !py-0.5
                text-[11px]
                font-medium
              "
                          >
                            {statusLabel}
                          </Tag>
                        </div>

                        {/* Action area */}
                        <div
                          className="
              mt-4
              flex
              flex-1
              items-end
              border-t
              border-black/[0.05]
              pt-3
            "
                        >
                          <Button
                            type="primary"
                            size="middle"
                            block
                            loading={isOpening}
                            disabled={Boolean(openingRole) && !isOpening}
                            onClick={() => openRoleFlow(role)}
                            style={{
                              backgroundColor: config.accent,
                              borderColor: config.accent,
                            }}
                            className="
                !h-10
                !rounded-lg
                !font-medium
                shadow-none
              "
                          >
                            <span className="flex items-center justify-center gap-2">
                              {buttonLabel}{" "}
                              {!isOpening && (
                                <ArrowRightOutlined
                                  className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                    "
                                />
                              )}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              <Card
                bordered={false}
                className="mt-4 shadow-sm"
                styles={{ body: { padding: 0 } }}
                title={
                  <Space size={10}>
                    <Avatar
                      size="small"
                      icon={<BankOutlined />}
                      style={{ backgroundColor: "#f0f5ff", color: "#2f54eb" }}
                    />
                    <Text strong>Journey Activity</Text>
                  </Space>
                }
              >
                <Table<TrackingItem>
                  rowKey={(item) =>
                    item.trackingId || `${item.role}-${item.askoxyUserId}`
                  }
                  columns={trackingColumns}
                  dataSource={tracking}
                  size="middle"
                  pagination={
                    tracking.length > 10
                      ? { pageSize: 10, showSizeChanger: false }
                      : false
                  }
                  scroll={{ x: true }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No OxyLoans journey activity yet."
                      />
                    ),
                  }}
                />
              </Card>
            </>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansIntegration;
