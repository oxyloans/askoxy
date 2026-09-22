import React, { useEffect, useMemo, useState } from "react";
import {
  ConfigProvider,
  Empty,
  Spin,
  Typography,
  theme,
} from "antd";
import {
  AccountBookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FundOutlined,
  GiftOutlined,
  RiseOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

const { Title, Text } = Typography;
const API_BASE = `${BASE_URL.replace(/\/$/, "")}/user-service/integration/oxyloans`;

type BorrowerSummary = {
  activeLoan: number;
  emiPaid: number;
  emiPending: number;
  outstandingLoan: number;
  oxyloansUserId: string;
  totalLoan: number;
  totalLoans: number;
  trackingId: string;
  updatedAt: string;
};

type LenderSummary = {
  activeDeals: number;
  activeInvestment: number;
  activeLoans: number;
  closedDeals: number;
  interestEarned: number;
  investedAmount: number;
  oxyloansUserId: string;
  roi: number;
  totalDeals: number;
  trackingId: string;
  updatedAt: string;
};

type PartnerSummary = {
  approvedLoans: number;
  commission: number;
  oxyloansUserId: string;
  rejectedLoans: number;
  totalLeads: number;
  trackingId: string;
  updatedAt: string;
};

type DashboardData = {
  askoxyUserId: string;
  borrowerSummary: BorrowerSummary | null;
  lenderSummary: LenderSummary | null;
  partnerSummary: PartnerSummary | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type StatItem = {
  label: string;
  value: string;
  color: string;
  background: string;
  icon: React.ReactNode;
};

type ChartSlice = {
  name: string;
  value: number;
};

const ANTD = {
  blue: { color: "#1677ff", background: "#e6f4ff" },
  geekblue: { color: "#2f54eb", background: "#f0f5ff" },
  purple: { color: "#722ed1", background: "#f9f0ff" },
  magenta: { color: "#eb2f96", background: "#fff0f6" },
  red: { color: "#ff4d4f", background: "#fff1f0" },
  volcano: { color: "#fa541c", background: "#fff2e8" },
  orange: { color: "#fa8c16", background: "#fff7e6" },
  gold: { color: "#faad14", background: "#fffbe6" },
  green: { color: "#52c41a", background: "#f6ffed" },
  cyan: { color: "#13c2c2", background: "#e6fffb" },
};

const CHART_COLORS = [
  ANTD.blue.color,
  ANTD.cyan.color,
  ANTD.purple.color,
  ANTD.orange.color,
  ANTD.green.color,
];

const CHART_TEXT = {
  pieTitle: "#722ed1",
  barTitle: "#08979c",
  axis: "#475569",
  muted: "#64748b",
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

const formatMoney = (value?: number | null) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatCount = (value?: number | null) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatCard: React.FC<StatItem> = ({ label, value, color, background, icon }) => (
  <div
    className="flex min-h-[112px] flex-col justify-between rounded-xl p-4 sm:p-5"
    style={{ background, color }}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80 sm:text-[13px]">
        {label}
      </span>
      <span className="text-base opacity-90">{icon}</span>
    </div>
    <div className="mt-4 break-words text-xl font-semibold leading-7 sm:text-2xl">
      {value}
    </div>
  </div>
);

const SummaryPie: React.FC<{ data: ChartSlice[] }> = ({ data }) => {
  const slices = data.filter((item) => Number(item.value) > 0);
  if (!slices.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No chart data" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={80}
          paddingAngle={2}
        >
          {slices.map((entry, index) => (
            <Cell
              key={`${entry.name}-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value: string, _entry, index: number) => (
            <span
              style={{
                color: CHART_COLORS[index % CHART_COLORS.length],
                fontWeight: 600,
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SummaryBars: React.FC<{ data: ChartSlice[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ANTD.geekblue.background} />
      <XAxis
        dataKey="name"
        tick={{ fontSize: 12, fill: CHART_TEXT.axis, fontWeight: 600 }}
        axisLine={{ stroke: "#cbd5e1" }}
        tickLine={{ stroke: "#cbd5e1" }}
      />
      <YAxis
        tick={{ fontSize: 12, fill: CHART_TEXT.muted, fontWeight: 500 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip />
      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
        {data.map((entry, index) => (
          <Cell
            key={`${entry.name}-${index}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const DashboardPanel: React.FC<{
  stats: StatItem[];
  pieTitle: string;
  pieData: ChartSlice[];
  barTitle: string;
  barData: ChartSlice[];
  updatedAt?: string | null;
}> = ({ stats, pieTitle, pieData, barTitle, barData, updatedAt }) => {
  const updatedLabel = formatDate(updatedAt);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 py-4">
      <div
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:gap-7 ${stats.length >= 6 ? "xl:grid-cols-6" : "xl:grid-cols-4"
          }`}
      >
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-2xl bg-purple-50/40 p-4 sm:p-5">
          <Text
            strong
            className="mb-5 block !text-lg sm:!text-xl"
            style={{ color: CHART_TEXT.pieTitle, fontWeight: 700 }}
          >
            {pieTitle}
          </Text>
          <div className="h-[240px] w-full">
            <SummaryPie data={pieData} />
          </div>
        </div>
        <div className="rounded-2xl bg-cyan-50/40 p-4 sm:p-5">
          <Text
            strong
            className="mb-5 block !text-lg sm:!text-xl"
            style={{ color: CHART_TEXT.barTitle, fontWeight: 700 }}
          >
            {barTitle}
          </Text>
          <div className="h-[240px] w-full">
            <SummaryBars data={barData} />
          </div>
        </div>
      </div>

      {updatedLabel ? (
        <Text className="block text-xs" style={{ color: ANTD.geekblue.color }}>
          Last updated {updatedLabel}
        </Text>
      ) : null}
    </div>
  );
};

const OxyLoansSummary: React.FC = () => {
  const askoxyUserId = useMemo(() => getUserId(), []);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!askoxyUserId) {
      showToast(
        "error",
        "We could not find your AskOxy user ID. Please sign in again.",
      );
      setLoading(false);
      return;
    }

    customerApi
      .get(`${API_BASE}/dashboard/${encodeURIComponent(askoxyUserId)}`)
      .then((response) => {
        const payload = response.data as ApiEnvelope<DashboardData>;
        if (payload?.success === false) {
          const message = payload?.message || "";
          if (message) showToast("error", message);
          setDashboard(null);
          return;
        }
        setDashboard(payload?.data || null);
      })
      .catch((err) => {
        const message = getApiMessage(err);
        if (message) showToast("error", message);
      })
      .finally(() => setLoading(false));
  }, [askoxyUserId]);

  const summarySections = useMemo(() => {
    if (!dashboard) return [];

    const sections: Array<{
      key: string;
      title: string;
      icon: React.ReactNode;
      content: React.ReactNode;
    }> = [];

    if (dashboard.borrowerSummary != null) {
      const summary = dashboard.borrowerSummary;
      sections.push({
        key: "borrower",
        title: "Borrower",
        icon: <UserOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              { label: "Total loans", value: formatCount(summary.totalLoans), icon: <FileDoneOutlined />, ...ANTD.blue },
              { label: "Active loan", value: formatCount(summary.activeLoan), icon: <FundOutlined />, ...ANTD.geekblue },
              { label: "Outstanding", value: formatMoney(summary.outstandingLoan), icon: <ClockCircleOutlined />, ...ANTD.red },
              { label: "Total amount", value: formatMoney(summary.totalLoan), icon: <DollarOutlined />, ...ANTD.purple },
              { label: "EMI paid", value: formatCount(summary.emiPaid), icon: <CheckCircleOutlined />, ...ANTD.green },
              { label: "EMI pending", value: formatCount(summary.emiPending), icon: <AccountBookOutlined />, ...ANTD.orange },
            ]}
            pieTitle="EMI mix"
            pieData={[
              { name: "EMI paid", value: Number(summary.emiPaid || 0) },
              { name: "EMI pending", value: Number(summary.emiPending || 0) },
            ]}
            barTitle="Loan amounts"
            barData={[
              { name: "Total", value: Number(summary.totalLoan || 0) },
              { name: "Outstanding", value: Number(summary.outstandingLoan || 0) },
            ]}
          />
        ),
      });
    }

    if (dashboard.lenderSummary != null) {
      const summary = dashboard.lenderSummary;
      sections.push({
        key: "lender",
        title: "Lender",
        icon: <WalletOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              { label: "Invested amount", value: formatMoney(summary.investedAmount), icon: <WalletOutlined />, ...ANTD.purple },
              { label: "Active investment", value: formatMoney(summary.activeInvestment), icon: <FundOutlined />, ...ANTD.geekblue },
              { label: "Interest earned", value: formatMoney(summary.interestEarned), icon: <RiseOutlined />, ...ANTD.green },
              { label: "Active deals", value: formatCount(summary.activeDeals), icon: <SwapOutlined />, ...ANTD.magenta },
              { label: "Closed deals", value: formatCount(summary.closedDeals), icon: <CheckCircleOutlined />, ...ANTD.gold },
              { label: "Total deals", value: formatCount(summary.totalDeals), icon: <FileDoneOutlined />, ...ANTD.volcano },
            ]}
            pieTitle="Deal mix"
            pieData={[
              { name: "Active deals", value: Number(summary.activeDeals || 0) },
              { name: "Closed deals", value: Number(summary.closedDeals || 0) },
            ]}
            barTitle="Investment amounts"
            barData={[
              { name: "Invested", value: Number(summary.investedAmount || 0) },
              { name: "Active", value: Number(summary.activeInvestment || 0) },
              { name: "Interest", value: Number(summary.interestEarned || 0) },
            ]}
          />
        ),
      });
    }

    if (dashboard.partnerSummary != null) {
      const summary = dashboard.partnerSummary;
      sections.push({
        key: "partner",
        title: "Partner",
        icon: <TeamOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              { label: "Total leads", value: formatCount(summary.totalLeads), icon: <TeamOutlined />, ...ANTD.cyan },
              { label: "Approved loans", value: formatCount(summary.approvedLoans), icon: <CheckCircleOutlined />, ...ANTD.green },
              { label: "Rejected loans", value: formatCount(summary.rejectedLoans), icon: <CloseCircleOutlined />, ...ANTD.red },
              { label: "Commission", value: formatMoney(summary.commission), icon: <GiftOutlined />, ...ANTD.gold },
            ]}
            pieTitle="Lead outcome"
            pieData={[
              { name: "Approved", value: Number(summary.approvedLoans || 0) },
              { name: "Rejected", value: Number(summary.rejectedLoans || 0) },
            ]}
            barTitle="Lead volume"
            barData={[
              { name: "Leads", value: Number(summary.totalLeads || 0) },
              { name: "Approved", value: Number(summary.approvedLoans || 0) },
              { name: "Rejected", value: Number(summary.rejectedLoans || 0) },
            ]}
          />
        ),
      });
    }

    return sections;
  }, [dashboard]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: ANTD.blue.color,
          borderRadius: 10,
          borderRadiusLG: 12,
          colorBgContainer: "#ffffff",
        },
      }}
    >
      <div className="min-h-full bg-white">
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          {/* <Title
            level={3}
            className="!mb-4 !text-purple-800 !mt-0 !text-xl sm:!text-2xl"
          >
            OxyLoans Summary
          </Title> */}

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Spin size="default" />
            </div>
          ) : dashboard && summarySections.length > 0 ? (
            <div className="space-y-12 sm:space-y-14">
              {summarySections.map((section) => (
                <section key={section.key} className=" bg-white p-3 sm:p-5">
                  <div className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
                    <span className="text-blue-600">{section.icon}</span>
                    <span>{section.title}</span> Summury
                  </div>
                  {section.content}
                </section>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No summary available."
            />
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansSummary;
