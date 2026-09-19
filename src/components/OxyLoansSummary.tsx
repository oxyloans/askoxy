import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  ConfigProvider,
  Descriptions,
  Empty,
  Spin,
  Tabs,
  Tag,
  Typography,
  theme,
} from "antd";
import type { TabsProps } from "antd";
import { TeamOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const API_BASE = `${BASE_URL.replace(/\/$/, "")}/user-service/integration/oxyloans`;

type DashboardData = {
  askoxyUserId: string;
  borrowerSummary: unknown;
  lenderSummary: unknown;
  partnerSummary: unknown;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const readJson = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getUserId = () => {
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

const getAccessToken = () => {
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

const apiRequest = async <T,>(path: string): Promise<ApiEnvelope<T>> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Your login session is missing. Please sign in again.");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload as ApiEnvelope<T>;
};

const humanize = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const SummaryContent: React.FC<{ value: unknown }> = ({ value }) => {
  if (
    value == null ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value as object).length === 0)
  ) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No summary data available."
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <Card key={index} size="small">
            {typeof item === "object" ? (
              <SummaryContent value={item} />
            ) : (
              <Text>{String(item)}</Text>
            )}
          </Card>
        ))}
      </div>
    );
  }

  if (typeof value !== "object") {
    return <Text>{String(value)}</Text>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Descriptions
        column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
        bordered
        size="small"
        className="min-w-0"
      >
        {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
          <Descriptions.Item key={key} label={humanize(key)}>
            {typeof item === "boolean" ? (
              <Tag color={item ? "success" : "default"}>
                {item ? "Yes" : "No"}
              </Tag>
            ) : item != null && typeof item === "object" ? (
              <SummaryContent value={item} />
            ) : (
              <Text>{item == null || item === "" ? "—" : String(item)}</Text>
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
};

const OxyLoansSummary: React.FC = () => {
  const askoxyUserId = useMemo(() => getUserId(), []);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("borrower");

  useEffect(() => {
    if (!askoxyUserId) {
      setError("We could not find your AskOxy user ID. Please sign in again.");
      setLoading(false);
      return;
    }

    apiRequest<DashboardData>(`/dashboard/${encodeURIComponent(askoxyUserId)}`)
      .then((result) => setDashboard(result.data || null))
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load OxyLoans summary.",
        ),
      )
      .finally(() => setLoading(false));
  }, [askoxyUserId]);

  const tabItems: TabsProps["items"] = dashboard
    ? [
        {
          key: "borrower",
          label: (
            <span className="flex items-center gap-2">
              <UserOutlined />
              <span>Borrower</span>
            </span>
          ),
          children: (
            <Card
              bordered={false}
              className="shadow-sm"
              styles={{ body: { padding: 16 } }}
            >
              <SummaryContent value={dashboard.borrowerSummary} />
            </Card>
          ),
        },
        {
          key: "lender",
          label: (
            <span className="flex items-center gap-2">
              <WalletOutlined />
              <span>Lender</span>
            </span>
          ),
          children: (
            <Card
              bordered={false}
              className="shadow-sm"
              styles={{ body: { padding: 16 } }}
            >
              <SummaryContent value={dashboard.lenderSummary} />
            </Card>
          ),
        },
        {
          key: "partner",
          label: (
            <span className="flex items-center gap-2">
              <TeamOutlined />
              <span>Partner</span>
            </span>
          ),
          children: (
            <Card
              bordered={false}
              className="shadow-sm"
              styles={{ body: { padding: 16 } }}
            >
              <SummaryContent value={dashboard.partnerSummary} />
            </Card>
          ),
        },
      ]
    : [];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 10,
          borderRadiusLG: 12,
        },
      }}
    >
      <div className="min-h-full">
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          <Title level={3} className="!mb-4 !mt-0 !text-xl sm:!text-2xl">
            OxyLoans Summary
          </Title>

          {error && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message="Unable to load OxyLoans summary"
              description={error}
            />
          )}

          {loading ? (
            <Card bordered={false} className="shadow-sm">
              <div className="flex min-h-[280px] items-center justify-center">
                <Spin size="large" />
              </div>
            </Card>
          ) : dashboard ? (
            <div className="space-y-4">
              <Card
                bordered={false}
                className="overflow-hidden shadow-sm"
                styles={{ body: { padding: 0 } }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={tabItems}
                  size="large"
                  animated
                  tabBarGutter={20}
                  className="oxyloans-summary-tabs"
                  tabBarStyle={{
                    margin: 0,
                    padding: "0 16px",
                  }}
                />
              </Card>

              {/* {dashboard.askoxyUserId && (
                <Text
                  type="secondary"
                  className="block text-center text-xs"
                >
                  AskOxy User ID: {dashboard.askoxyUserId}
                </Text>
              )} */}
            </div>
          ) : (
            <Card bordered={false} className="shadow-sm">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No OxyLoans summary available."
              />
            </Card>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansSummary;
