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
  border: string;
  icon: React.ReactNode;
};

type ChartSlice = {
  name: string;
  value: number;
};

type RoleTone = {
  accent: string;
  soft: string;
  border: string;
  iconBg: string;
};

const COLORS = {
  blue: {
    color: "#2563EB",
    background: "#EFF6FF",
    border: "#DBEAFE",
  },
  indigo: {
    color: "#4F46E5",
    background: "#EEF2FF",
    border: "#E0E7FF",
  },
  purple: {
    color: "#7C3AED",
    background: "#F5F3FF",
    border: "#EDE9FE",
  },
  pink: {
    color: "#DB2777",
    background: "#FDF2F8",
    border: "#FCE7F3",
  },
  red: {
    color: "#DC2626",
    background: "#FEF2F2",
    border: "#FEE2E2",
  },
  orange: {
    color: "#EA580C",
    background: "#FFF7ED",
    border: "#FFEDD5",
  },
  amber: {
    color: "#D97706",
    background: "#FFFBEB",
    border: "#FEF3C7",
  },
  green: {
    color: "#16A34A",
    background: "#F0FDF4",
    border: "#DCFCE7",
  },
  teal: {
    color: "#0F766E",
    background: "#F0FDFA",
    border: "#CCFBF1",
  },
};

const CHART_COLORS = [
  COLORS.blue.color,
  COLORS.teal.color,
  COLORS.purple.color,
  COLORS.orange.color,
  COLORS.green.color,
];

const ROLE_TONES: Record<"borrower" | "lender" | "partner", RoleTone> = {
  borrower: {
    accent: "#2563EB",
    soft: "#EFF6FF",
    border: "#DBEAFE",
    iconBg: "#DBEAFE",
  },
  lender: {
    accent: "#7C3AED",
    soft: "#F5F3FF",
    border: "#EDE9FE",
    iconBg: "#EDE9FE",
  },
  partner: {
    accent: "#0F766E",
    soft: "#F0FDFA",
    border: "#CCFBF1",
    iconBg: "#CCFBF1",
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

const StatCard: React.FC<StatItem> = ({
  label,
  value,
  color,
  background,
  border,
  icon,
}) => (
  <div
    className="group flex min-h-[96px] flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] sm:min-h-[108px] sm:p-4"
    style={{
      background,
      borderColor: border,
    }}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="min-w-0 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 sm:text-[11px]">
        {label}
      </span>

      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm sm:h-9 sm:w-9 sm:text-base"
        style={{
          color,
          backgroundColor: "#fff",
          border: `1px solid ${border}`,
        }}
      >
        {icon}
      </span>
    </div>

    <div
      className="mt-2 break-words text-[18px] font-bold leading-tight sm:text-[22px]"
      style={{ color }}
      title={value}
    >
      {value}
    </div>
  </div>
);

const SummaryPie: React.FC<{ data: ChartSlice[] }> = ({ data }) => {
  const slices = data.filter((item) => Number(item.value) > 0);

  if (!slices.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No chart data"
        />
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
          cy="47%"
          innerRadius="48%"
          outerRadius="72%"
          paddingAngle={3}
        >
          {slices.map((entry, index) => (
            <Cell
              key={`${entry.name}-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
            fontSize: 12,
          }}
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-[11px] font-semibold text-slate-600 sm:text-xs">
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
    <BarChart
      data={data}
      margin={{ top: 8, right: 6, left: -18, bottom: 0 }}
      barCategoryGap="28%"
    >
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#E2E8F0"
      />

      <XAxis
        dataKey="name"
        tick={{
          fontSize: 10,
          fill: "#64748B",
          fontWeight: 600,
        }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        tick={{
          fontSize: 10,
          fill: "#94A3B8",
          fontWeight: 500,
        }}
        axisLine={false}
        tickLine={false}
      />

      <Tooltip
        contentStyle={{
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
          fontSize: 12,
        }}
      />

      <Bar dataKey="value" radius={[8, 8, 3, 3]} maxBarSize={52}>
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
}> = ({
  stats,
  pieTitle,
  pieData,
  barTitle,
  barData,
  updatedAt,
}) => {
  const updatedLabel = formatDate(updatedAt);

  return (
    <div>
      <div
        className={`grid grid-cols-2 gap-2.5 sm:gap-3 ${
          stats.length >= 6
            ? "lg:grid-cols-3 xl:grid-cols-6"
            : "lg:grid-cols-4"
        }`}
      >
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:mt-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="mb-1">
            <Text strong className="!text-[14px] !text-slate-800 sm:!text-[15px]">
              {pieTitle}
            </Text>
          </div>

          <div className="h-[220px] w-full sm:h-[250px]">
            <SummaryPie data={pieData} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="mb-1">
            <Text strong className="!text-[14px] !text-slate-800 sm:!text-[15px]">
              {barTitle}
            </Text>
          </div>

          <div className="h-[220px] w-full sm:h-[250px]">
            <SummaryBars data={barData} />
          </div>
        </div>
      </div>

      {updatedLabel && (
        <div className="mt-2 text-right text-[10px] text-slate-400 sm:text-[11px]">
          Last updated {updatedLabel}
        </div>
      )}
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
      key: "borrower" | "lender" | "partner";
      title: string;
      subtitle: string;
      icon: React.ReactNode;
      content: React.ReactNode;
    }> = [];

    if (dashboard.borrowerSummary) {
      const summary = dashboard.borrowerSummary;

      sections.push({
        key: "borrower",
        title: "Borrower Summary",
        subtitle: "Your loans, EMI progress, and outstanding amount",
        icon: <UserOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              {
                label: "Total Loans",
                value: formatCount(summary.totalLoans),
                icon: <FileDoneOutlined />,
                ...COLORS.blue,
              },
              {
                label: "Active Loan",
                value: formatCount(summary.activeLoan),
                icon: <FundOutlined />,
                ...COLORS.indigo,
              },
              {
                label: "Outstanding",
                value: formatMoney(summary.outstandingLoan),
                icon: <ClockCircleOutlined />,
                ...COLORS.red,
              },
              {
                label: "Total Amount",
                value: formatMoney(summary.totalLoan),
                icon: <DollarOutlined />,
                ...COLORS.purple,
              },
              {
                label: "EMI Paid",
                value: formatCount(summary.emiPaid),
                icon: <CheckCircleOutlined />,
                ...COLORS.green,
              },
              {
                label: "EMI Pending",
                value: formatCount(summary.emiPending),
                icon: <AccountBookOutlined />,
                ...COLORS.orange,
              },
            ]}
            pieTitle="EMI Status"
            pieData={[
              { name: "Paid", value: Number(summary.emiPaid || 0) },
              { name: "Pending", value: Number(summary.emiPending || 0) },
            ]}
            barTitle="Loan Amounts"
            barData={[
              { name: "Total", value: Number(summary.totalLoan || 0) },
              {
                name: "Outstanding",
                value: Number(summary.outstandingLoan || 0),
              },
            ]}
          />
        ),
      });
    }

    if (dashboard.lenderSummary) {
      const summary = dashboard.lenderSummary;

      sections.push({
        key: "lender",
        title: "Lender Summary",
        subtitle: "Your investments, deal activity, and earnings",
        icon: <WalletOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              {
                label: "Invested Amount",
                value: formatMoney(summary.investedAmount),
                icon: <WalletOutlined />,
                ...COLORS.purple,
              },
              {
                label: "Active Investment",
                value: formatMoney(summary.activeInvestment),
                icon: <FundOutlined />,
                ...COLORS.indigo,
              },
              {
                label: "Interest Earned",
                value: formatMoney(summary.interestEarned),
                icon: <RiseOutlined />,
                ...COLORS.green,
              },
              {
                label: "Active Deals",
                value: formatCount(summary.activeDeals),
                icon: <SwapOutlined />,
                ...COLORS.pink,
              },
              {
                label: "Closed Deals",
                value: formatCount(summary.closedDeals),
                icon: <CheckCircleOutlined />,
                ...COLORS.amber,
              },
              {
                label: "Total Deals",
                value: formatCount(summary.totalDeals),
                icon: <FileDoneOutlined />,
                ...COLORS.orange,
              },
            ]}
            pieTitle="Deal Status"
            pieData={[
              {
                name: "Active",
                value: Number(summary.activeDeals || 0),
              },
              {
                name: "Closed",
                value: Number(summary.closedDeals || 0),
              },
            ]}
            barTitle="Investment Overview"
            barData={[
              {
                name: "Invested",
                value: Number(summary.investedAmount || 0),
              },
              {
                name: "Active",
                value: Number(summary.activeInvestment || 0),
              },
              {
                name: "Interest",
                value: Number(summary.interestEarned || 0),
              },
            ]}
          />
        ),
      });
    }

    if (dashboard.partnerSummary) {
      const summary = dashboard.partnerSummary;

      sections.push({
        key: "partner",
        title: "Partner Summary",
        subtitle: "Your leads, approvals, and commission",
        icon: <TeamOutlined />,
        content: (
          <DashboardPanel
            updatedAt={summary.updatedAt}
            stats={[
              {
                label: "Total Leads",
                value: formatCount(summary.totalLeads),
                icon: <TeamOutlined />,
                ...COLORS.teal,
              },
              {
                label: "Approved Loans",
                value: formatCount(summary.approvedLoans),
                icon: <CheckCircleOutlined />,
                ...COLORS.green,
              },
              {
                label: "Rejected Loans",
                value: formatCount(summary.rejectedLoans),
                icon: <CloseCircleOutlined />,
                ...COLORS.red,
              },
              {
                label: "Commission",
                value: formatMoney(summary.commission),
                icon: <GiftOutlined />,
                ...COLORS.amber,
              },
            ]}
            pieTitle="Lead Outcome"
            pieData={[
              {
                name: "Approved",
                value: Number(summary.approvedLoans || 0),
              },
              {
                name: "Rejected",
                value: Number(summary.rejectedLoans || 0),
              },
            ]}
            barTitle="Lead Volume"
            barData={[
              {
                name: "Leads",
                value: Number(summary.totalLeads || 0),
              },
              {
                name: "Approved",
                value: Number(summary.approvedLoans || 0),
              },
              {
                name: "Rejected",
                value: Number(summary.rejectedLoans || 0),
              },
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
          colorPrimary: "#2563EB",
          borderRadius: 12,
          borderRadiusLG: 16,
          colorBgContainer: "#FFFFFF",
          colorBgLayout: "#F8FAFC",
          colorBorderSecondary: "#E2E8F0",
        },
      }}
    >
      <div className="min-h-full bg-[#F8FAFC]">
        <main className="mx-auto w-full max-w-[1600px] px-2.5 py-3 sm:px-4 sm:py-5 lg:px-5 xl:px-6">
          <div className="mb-4 sm:mb-5">
            <Title
              level={2}
              className="!m-0 !text-[22px] !font-bold !leading-tight !text-slate-900 sm:!text-[28px]"
            >
              OxyLoans Summary
            </Title>

            <Text className="mt-1 block !text-[12px] !leading-5 !text-slate-500 sm:!text-sm">
              Track your Borrower, Lender, and Partner activity in one place.
            </Text>
          </div>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <Spin />
                <div className="mt-3 text-xs text-slate-400 sm:text-sm">
                  Loading your summary...
                </div>
              </div>
            </div>
          ) : dashboard && summarySections.length > 0 ? (
            <div className="space-y-5 sm:space-y-6">
              {summarySections.map((section) => {
                const tone = ROLE_TONES[section.key];

                return (
                  <section
                    key={section.key}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_3px_16px_rgba(15,23,42,0.04)]"
                  >
                    <div
                      className="border-b px-3.5 py-3 sm:px-5 sm:py-4"
                      style={{
                        background: `linear-gradient(90deg, ${tone.soft} 0%, #ffffff 72%)`,
                        borderColor: tone.border,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[17px] sm:h-11 sm:w-11"
                          style={{
                            color: tone.accent,
                            backgroundColor: tone.iconBg,
                          }}
                        >
                          {section.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="text-[16px] font-bold leading-5 text-slate-900 sm:text-[18px]">
                            {section.title}
                          </div>

                          <div className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:text-xs">
                            {section.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-5">
                      {section.content}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No summary available."
              />
            </div>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansSummary;
