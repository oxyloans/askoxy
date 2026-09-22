import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
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
};

const roleConfig: Record<Role, RoleConfig> = {
  LENDER: {
    title: "Lender",
    icon: <WalletOutlined />,
    registeredKey: "lenderRegistered",
    accent: "#722ed1",
    soft: "#f9f0ff",
  },
  BORROWER: {
    title: "Borrower",
    icon: <UserOutlined />,
    registeredKey: "borrowerRegistered",
    accent: "#1677ff",
    soft: "#e6f4ff",
  },
  PARTNER: {
    title: "Partner",
    icon: <TeamOutlined />,
    registeredKey: "partnerRegistered",
    accent: "#13c2c2",
    soft: "#e6fffb",
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
  if (error instanceof Error && error.message.trim()) return error.message.trim();
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

const apiPost = async <T,>(path: string, body: unknown): Promise<ApiEnvelope<T>> => {
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
          showToast("error", "We could not find your AskOxy user ID. Please sign in again.");
        }
        setLoading(false);
        return;
      }

      const [trackingResult, statusResult] = await Promise.allSettled([
        apiGet<TrackingItem[]>(`/tracking/${encodeURIComponent(askoxyUserId)}`),
        apiGet<UserStatus>(`/user-status/${encodeURIComponent(askoxyUserId)}`),
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

        if (failures.length === 2) {
          const message = getApiMessage(failures[0].reason);
          if (message) showToast("error", message);
        } else if (failures.length === 1) {
          const message = getApiMessage(failures[0].reason);
          if (message) showToast("warning", message);
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
      if (document.visibilityState === "visible") loadData({ silent: true });
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

  const registeredRoles = (["BORROWER", "LENDER", "PARTNER"] as Role[]).filter(
    isRoleRegistered,
  );
  const registeredTitles = registeredRoles
    .map((role) => roleConfig[role].title)
    .join(", ");
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
        const message = result.message || "";
        if (message) showToast("error", message);
        redirectWindow?.close();
        return;
      }

      if (result.message) showToast("success", result.message);
      await loadData({ silent: true });

      if (redirectWindow && !redirectWindow.closed)
        redirectWindow.location.href = redirectUrl;
      else window.location.href = redirectUrl;
    } catch (err) {
      redirectWindow?.close();
      const message = getApiMessage(err);
      if (message) showToast("error", message);
    } finally {
      setOpeningRole(null);
    }
  };

  const roles: Role[] = ["BORROWER", "LENDER", "PARTNER"];

  // If any role is already registered, display only the registered role card(s).
  // If nothing is registered yet, display all journey cards.
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
            #{value.slice(-4) || "—"}
          </Text>
        </Tooltip>
      ),
    },
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
    // {
    //   title: "Logins",
    //   dataIndex: "loginCount",
    //   key: "loginCount",
    //   align: "center",
    //   render: (value: number) => value || 0,
    // },
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
  <Title
    level={3}
    className="!m-0 !text-xl !text-purple-800 sm:!text-2xl"
  >
    OxyLoans Journeys
  </Title>
</div>

          {loading ? (
            <Card bordered={false} className="shadow-sm">
              <div className="flex min-h-[220px] items-center justify-center">
                <Space direction="vertical" align="center">
                  <Spin size="default" />
                  <Text type="secondary">
                    Loading your OxyLoans journeys...
                  </Text>
                </Space>
              </div>
            </Card>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                {displayRoles.map((role) => {
                  const config = roleConfig[role];
                  const item = getRoleTracking(role);
                  const registered = isRoleRegistered(role);
                  const started = Boolean(item);
                  const isOpening = openingRole === role;
                  const locked = false;

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

                  const lockHint = hasRegisteredRole
                    ? `You are already registered as ${registeredTitles}. Other roles stay unavailable.`
                    : "";

                  return (
                    <Card
                      key={role}
                      hoverable={!locked}
                      bordered={false}
                      className={`
          group h-full overflow-hidden
          rounded-lg
          border border-transparent
          shadow-sm
          transition-all duration-300
          ${locked ? "opacity-80" : "hover:-translate-y-1 hover:shadow-md"}
        `}
                      style={{
                        background: `linear-gradient(
            135deg,
            ${config.soft} 0%,
            #ffffff 72%
          )`,
                      }}
                      styles={{
                        body: {
                          padding: 0,
                          height: "100%",
                        },
                      }}
                    >
                      <div
                        className="h-[4px] w-full"
                        style={{
                          backgroundColor: config.accent,
                        }}
                      />

                      <div className="flex h-full flex-col p-4 sm:p-5">
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
                                  : locked
                                    ? `Unavailable while you are registered as ${registeredTitles}`
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
                          <Tooltip
                            title={locked ? lockHint : undefined}
                            placement="top"
                          >
                            <span className="block w-full">
                              <Button
                                type="primary"
                                size="middle"
                                block
                                loading={isOpening}
                                disabled={
                                  locked ||
                                  (Boolean(openingRole) && !isOpening)
                                }
                                onClick={() => openRoleFlow(role)}
                                style={{
                                  backgroundColor: locked
                                    ? undefined
                                    : config.accent,
                                  borderColor: locked
                                    ? undefined
                                    : config.accent,
                                }}
                                className="
                !h-10
                !rounded-lg
                !font-medium
                shadow-none
              "
                              >
                                <span className="flex items-center justify-center gap-2">
                                  {locked
                                    ? `${config.title} unavailable`
                                    : buttonLabel}{" "}
                                  {!isOpening && !locked && (
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
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
                  <Avatar
                    size="small"
                    icon={<BankOutlined />}
                    style={{
                      backgroundColor: "#f0f5ff",
                      color: "#2f54eb",
                    }}
                  />

                  <Text strong className="text-base">
                    Journey Activity
                  </Text>
                </div>

                <Table<TrackingItem>
                  rowKey={(item) =>
                    item.trackingId || `${item.role}-${item.askoxyUserId}`
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
              </div>
            </>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansIntegration;
