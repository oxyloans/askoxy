import React, { useEffect, useMemo, useState } from "react";
import {
  ApartmentOutlined,
  CheckCircleFilled,
  DownloadOutlined,
  NotificationOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Empty,
  Grid,
  Input,
  Progress,
  Select,
  Skeleton,
  Tag,
  message,
  theme,
} from "antd";
import dayjs from "dayjs";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Search } = Input;
const { useBreakpoint } = Grid;

interface JourneyInterestedUser {
  userId: string | null;
  mobileNumber: string | null;
  address?: string | null;
  projectType?: string | null;
  userRole?: string | null;
  deliveryType?: string | null;
  createdAt: string | number | null;
}

interface JourneyCampaign {
  campaignId: string;
  campaignType: string;
  campaignDescription?: string | null;
  campaignStatus: boolean;
  interestedUsers?: JourneyInterestedUser[] | null;
}

interface JourneyCampaignApiItem {
  journeyId: string;
  journeyName: string;
  campaigns?: JourneyCampaign[] | null;
}

interface JourneyCampaignApiResponse {
  data?: JourneyCampaignApiItem[];
  status?: boolean;
  message?: string;
}

interface JourneySummaryRow {
  journeyId: string;
  journeyName: string;
  campaignCount: number;
  activeCampaignCount: number;
  interestedUsersCount: number;
  interestedMobiles: string[];
  campaignTypes: string[];
  latestInterestedAt: number;
}

type JourneyInterestView = "ALL" | "WITH_INTEREST" | "WITHOUT_INTEREST";

const toMs = (value: string | number | null | undefined): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct.getTime();

  const parsed = dayjs(value);
  if (parsed.isValid()) return parsed.valueOf();

  const fixed = dayjs(String(value).replace(" ", "T"));
  return fixed.isValid() ? fixed.valueOf() : 0;
};

const formatDate = (value: string | number | null | undefined): string => {
  const ms = toMs(value);
  return ms ? dayjs(ms).format("DD MMM YYYY") : "—";
};

const formatDateTime = (value: string | number | null | undefined): string => {
  const ms = toMs(value);
  return ms ? dayjs(ms).format("DD MMM YYYY, hh:mm A") : "—";
};

const csvCell = (value: unknown) => {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
};

const JourneysVsCampaignsVsInterestedUsers: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [journeys, setJourneys] = useState<JourneyCampaignApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(
    null,
  );
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [journeyInterestView, setJourneyInterestView] =
    useState<JourneyInterestView>("ALL");

  const fetchJourneyCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<JourneyCampaignApiResponse>(
        `${BASE_URL}/marketing-service/campgin/journey/campaigns/list-of-users`,
      );

      const payload = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setJourneys(payload);
    } catch (err) {
      console.error("Failed to load journey campaign users", err);
      setJourneys([]);
      setError("Unable to load Journeys vs Campaigns vs Interested Users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchJourneyCampaigns();
  }, []);

  const summaryRows = useMemo<JourneySummaryRow[]>(() => {
    return journeys.map((journey) => {
      const campaigns = journey.campaigns || [];
      const users = campaigns.flatMap(
        (campaign) => campaign.interestedUsers || [],
      );
      const interestedMobiles = Array.from(
        new Set(
          users
            .map((user) => user.mobileNumber)
            .filter((mobile): mobile is string => Boolean(mobile)),
        ),
      );

      return {
        journeyId: journey.journeyId,
        journeyName: journey.journeyName || "Unnamed Journey",
        campaignCount: campaigns.length,
        activeCampaignCount: campaigns.filter(
          (campaign) => campaign.campaignStatus,
        ).length,
        interestedUsersCount: users.length,
        interestedMobiles,
        campaignTypes: campaigns
          .map((campaign) => campaign.campaignType)
          .filter(Boolean),
        latestInterestedAt: users.reduce(
          (latest, user) => Math.max(latest, toMs(user.createdAt)),
          0,
        ),
      };
    });
  }, [journeys]);

  const filteredJourneys = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    return summaryRows.filter((row) => {
      const matchesInterestGroup =
        journeyInterestView === "ALL" ||
        (journeyInterestView === "WITH_INTEREST"
          ? row.interestedUsersCount > 0
          : row.interestedUsersCount === 0);

      if (!matchesInterestGroup) return false;
      if (!term) return true;

      return (
        row.journeyName.toLowerCase().includes(term) ||
        row.campaignTypes.some((type) => type.toLowerCase().includes(term)) ||
        row.interestedMobiles.some((mobile) =>
          mobile.toLowerCase().includes(term),
        )
      );
    });
  }, [summaryRows, searchText, journeyInterestView]);

  const totalJourneys = summaryRows.length;
  const totalCampaigns = useMemo(
    () => summaryRows.reduce((sum, journey) => sum + journey.campaignCount, 0),
    [summaryRows],
  );
  const totalActiveCampaigns = useMemo(
    () =>
      summaryRows.reduce(
        (sum, journey) => sum + journey.activeCampaignCount,
        0,
      ),
    [summaryRows],
  );
  const totalInterestedUsers = useMemo(
    () =>
      summaryRows.reduce(
        (sum, journey) => sum + journey.interestedUsersCount,
        0,
      ),
    [summaryRows],
  );
  const journeysWithInterest = useMemo(
    () =>
      summaryRows.filter((journey) => journey.interestedUsersCount > 0).length,
    [summaryRows],
  );
  const journeysWithoutInterest = useMemo(
    () =>
      summaryRows.filter((journey) => journey.interestedUsersCount === 0)
        .length,
    [summaryRows],
  );

  const selectedJourney = useMemo(
    () =>
      journeys.find((journey) => journey.journeyId === selectedJourneyId) ||
      null,
    [journeys, selectedJourneyId],
  );

  const selectedJourneySummary = useMemo(
    () =>
      summaryRows.find((journey) => journey.journeyId === selectedJourneyId) ||
      null,
    [summaryRows, selectedJourneyId],
  );

  const visibleCampaigns = useMemo(() => {
    return selectedJourney?.campaigns || [];
  }, [selectedJourney]);

  const selectedCampaign = useMemo(() => {
    return (
      (selectedJourney?.campaigns || []).find(
        (campaign) => campaign.campaignId === selectedCampaignId,
      ) || null
    );
  }, [selectedJourney, selectedCampaignId]);

  useEffect(() => {
    if (!filteredJourneys.length) {
      setSelectedJourneyId(null);
      setSelectedCampaignId(null);
      return;
    }

    const currentExists = filteredJourneys.some(
      (journey) => journey.journeyId === selectedJourneyId,
    );

    if (!currentExists) {
      setSelectedJourneyId(filteredJourneys[0].journeyId);
    }
  }, [filteredJourneys, selectedJourneyId]);

  useEffect(() => {
    setSelectedCampaignId(null);
  }, [selectedJourneyId]);

  useEffect(() => {
    if (!visibleCampaigns.length) {
      setSelectedCampaignId(null);
      return;
    }

    const selectedVisible = visibleCampaigns.some(
      (campaign) => campaign.campaignId === selectedCampaignId,
    );

    if (!selectedVisible) {
      setSelectedCampaignId(visibleCampaigns[0].campaignId);
    }
  }, [visibleCampaigns, selectedCampaignId]);

  const handleExport = () => {
    const rows: string[] = [
      [
        "Journey",
        "Journey ID",
        "Campaign",
        "Campaign ID",
        "Campaign Status",
        "Mobile Number",
        "User ID",
        "Project Type",
        "User Role",
        "Interested At",
      ]
        .map(csvCell)
        .join(","),
    ];

    journeys.forEach((journey) => {
      (journey.campaigns || []).forEach((campaign) => {
        const users = campaign.interestedUsers || [];

        if (!users.length) {
          rows.push(
            [
              journey.journeyName,
              journey.journeyId,
              campaign.campaignType,
              campaign.campaignId,
              campaign.campaignStatus ? "ACTIVE" : "INACTIVE",
              "",
              "",
              "",
              "",
              "",
            ]
              .map(csvCell)
              .join(","),
          );
          return;
        }

        users.forEach((user) => {
          rows.push(
            [
              journey.journeyName,
              journey.journeyId,
              campaign.campaignType,
              campaign.campaignId,
              campaign.campaignStatus ? "ACTIVE" : "INACTIVE",
              user.mobileNumber || "",
              user.userId || "",
              user.projectType || "",
              user.userRole || "",
              formatDateTime(user.createdAt),
            ]
              .map(csvCell)
              .join(","),
          );
        });
      });
    });

    if (rows.length === 1) {
      message.info("No journey campaign data available to export.");
      return;
    }

    const blob = new Blob(["\uFEFF" + rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `journeys-campaigns-interested-users-${dayjs().format(
      "YYYY-MM-DD",
    )}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const activePercent = totalCampaigns
    ? Math.round((totalActiveCampaigns / totalCampaigns) * 100)
    : 0;

  const metricCards = [
    {
      label: "Journeys",
      value: totalJourneys,
      note: "Available journeys",
      icon: <ApartmentOutlined />,
      accent: "bg-blue-50 text-blue-700",
    },
    {
      label: "Campaigns",
      value: totalCampaigns,
      note: `${totalActiveCampaigns} currently active`,
      icon: <NotificationOutlined />,
      accent: "bg-violet-50 text-violet-700",
    },
    {
      label: "Interested Users",
      value: totalInterestedUsers,
      note: "Interest records across campaigns",
      icon: <TeamOutlined />,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Not Interested Journeys",
      value: journeysWithoutInterest,
      note: "Journeys with zero interested users",
      icon: <CheckCircleFilled />,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563eb",
          colorBgBase: "#ffffff",
          colorTextBase: "#0f172a",
          borderRadius: 12,
        },
      }}
    >
      <div
        className="min-h-screen bg-[#f7f9fc] text-slate-900"
        style={{ colorScheme: "light" }}
      >
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-5 md:flex-row md:items-center md:justify-between lg:px-7">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 sm:text-[11px]">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                League Journeys Admin
              </div>
              <h1 className="mt-1 break-words text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-[28px]">
                Journeys vs Campaigns vs Interested Users
              </h1>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm">
                Review journey coverage, campaign activity and user interest
                from one focused admin workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                icon={<ReloadOutlined />}
                loading={loading}
                onClick={() => void fetchJourneyCampaigns()}
                className="!h-10 !rounded-xl !border-slate-200 !bg-gradient-to-b !from-white !to-slate-50 !px-4 !font-semibold !text-slate-700 !shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:!border-blue-300 hover:!text-blue-700"
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                disabled={!journeys.length}
                onClick={handleExport}
                className="!h-10 !rounded-xl !border-blue-500 !bg-gradient-to-b !from-blue-500 !to-blue-600 !px-4 !font-semibold !shadow-[0_6px_16px_rgba(37,99,235,0.22)] hover:!from-blue-600 hover:!to-blue-700"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-4 px-3 py-4 sm:px-5 lg:px-7 lg:py-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 gap-px bg-slate-200 xl:grid-cols-4">
              {metricCards.map((metric) => (
                <div key={metric.label} className="bg-white p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-slate-400 sm:text-xs">
                        {metric.label}
                      </div>
                      <div className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                        {loading ? "—" : metric.value}
                      </div>
                      <div className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                        {metric.note}
                      </div>
                    </div>
                    <div
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 ${metric.accent}`}
                    >
                      {metric.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="w-28 flex-none sm:w-36">
                  <Progress
                    percent={activePercent}
                    size="small"
                    showInfo={false}
                    strokeColor="#2563eb"
                  />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">
                    {activePercent}%
                  </span>{" "}
                  campaign activity
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Flow: Journey group → Journey → Campaign → Interested users
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950 sm:text-lg">
                    Journey Performance Workspace
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Open a journey group, select a journey, then review its
                    campaigns and interested users.
                  </p>
                </div>

                <Search
                  allowClear
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search journey, campaign or mobile"
                  prefix={<SearchOutlined className="text-slate-400" />}
                  className="w-full lg:max-w-[390px]"
                  size={isMobile ? "large" : "middle"}
                />
              </div>
            </div>

            {!error && (
              <div className="grid grid-cols-1 gap-2.5 border-b border-slate-200 bg-white p-3 sm:p-4 md:grid-cols-3 lg:px-6">
                <button
                  type="button"
                  onClick={() => setJourneyInterestView("ALL")}
                  aria-pressed={journeyInterestView === "ALL"}
                  className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                    journeyInterestView === "ALL"
                      ? "border-blue-300 bg-gradient-to-b from-white via-blue-50/80 to-blue-100/70 shadow-[0_7px_18px_rgba(37,99,235,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_7px_16px_rgba(37,99,235,0.1)]"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${
                          journeyInterestView === "ALL"
                            ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        <ApartmentOutlined />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-950 sm:text-base">
                          All Journeys
                        </div>
                      </div>
                    </div>
                    <span className="flex h-8 min-w-8 flex-none items-center justify-center rounded-full bg-blue-50 px-2 text-sm font-black text-blue-700">
                      {loading ? "—" : totalJourneys}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setJourneyInterestView("WITH_INTEREST")}
                  aria-pressed={journeyInterestView === "WITH_INTEREST"}
                  className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 ${
                    journeyInterestView === "WITH_INTEREST"
                      ? "border-emerald-300 bg-gradient-to-b from-white via-emerald-50/80 to-emerald-100/70 shadow-[0_7px_18px_rgba(5,150,105,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_7px_16px_rgba(5,150,105,0.1)]"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${
                          journeyInterestView === "WITH_INTEREST"
                            ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-sm"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <TeamOutlined />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-950 sm:text-base">
                          Interested User Journeys
                        </div>
                      </div>
                    </div>
                    <span className="flex h-8 min-w-8 flex-none items-center justify-center rounded-full bg-emerald-50 px-2 text-sm font-black text-emerald-700">
                      {loading ? "—" : journeysWithInterest}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setJourneyInterestView("WITHOUT_INTEREST")}
                  aria-pressed={journeyInterestView === "WITHOUT_INTEREST"}
                  className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/25 ${
                    journeyInterestView === "WITHOUT_INTEREST"
                      ? "border-amber-300 bg-gradient-to-b from-white via-amber-50/80 to-amber-100/70 shadow-[0_7px_18px_rgba(217,119,6,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_7px_16px_rgba(217,119,6,0.1)]"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${
                          journeyInterestView === "WITHOUT_INTEREST"
                            ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-sm"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <NotificationOutlined />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-950 sm:text-base">
                          Not Interested User Journeys
                        </div>
                      </div>
                    </div>
                    <span className="flex h-8 min-w-8 flex-none items-center justify-center rounded-full bg-amber-50 px-2 text-sm font-black text-amber-700">
                      {loading ? "—" : journeysWithoutInterest}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {loading ? (
              <div className="p-5 sm:p-7">
                <Skeleton active paragraph={{ rows: 10 }} />
              </div>
            ) : error ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                  {error}
                </div>
                <Button
                  className="mt-4"
                  icon={<ReloadOutlined />}
                  onClick={() => void fetchJourneyCampaigns()}
                >
                  Retry
                </Button>
              </div>
            ) : !filteredJourneys.length ? (
              <div className="p-10">
                <Empty
                  description={
                    searchText.trim()
                      ? "No journey matched your search in this group"
                      : journeyInterestView === "ALL"
                        ? "No journeys are available"
                        : journeyInterestView === "WITH_INTEREST"
                          ? "No journeys have interested users"
                          : "No not-interested user journeys are available"
                  }
                />
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 bg-slate-50/80 p-3 lg:hidden">
                  <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
                    Select journey
                  </div>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    value={selectedJourneyId || undefined}
                    onChange={(value: string) => setSelectedJourneyId(value)}
                    className="w-full"
                    size="large"
                    options={filteredJourneys.map((journey) => ({
                      value: journey.journeyId,
                      label: `${journey.journeyName} · ${journey.campaignCount} campaigns · ${journey.interestedUsersCount} users`,
                    }))}
                  />
                </div>

                <div className="grid min-h-[650px] lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
                  <aside className="hidden border-r border-slate-200 bg-slate-50/70 lg:block">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {journeyInterestView === "ALL"
                            ? "All Journeys"
                            : journeyInterestView === "WITH_INTEREST"
                              ? "Interested User Journeys"
                              : "Not Interested User Journeys"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {filteredJourneys.length} journeys shown
                        </div>
                      </div>
                      <Tag
                        color={
                          journeyInterestView === "ALL"
                            ? "blue"
                            : journeyInterestView === "WITH_INTEREST"
                              ? "green"
                              : "gold"
                        }
                        className="m-0"
                      >
                        {filteredJourneys.length}
                      </Tag>
                    </div>

                    <div className="max-h-[760px] overflow-y-auto">
                      {filteredJourneys.map((journey) => {
                        const selected =
                          journey.journeyId === selectedJourneyId;
                        const noInterest = journey.interestedUsersCount === 0;

                        return (
                          <button
                            type="button"
                            key={journey.journeyId}
                            onClick={() =>
                              setSelectedJourneyId(journey.journeyId)
                            }
                            className={`w-full border-b border-slate-200 px-4 py-3.5 text-left transition ${
                              selected
                                ? "bg-white shadow-[inset_4px_0_0_#2563eb]"
                                : "hover:bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`break-words text-sm font-extrabold leading-5 ${
                                    selected
                                      ? "text-blue-700"
                                      : "text-slate-900"
                                  }`}
                                >
                                  {journey.journeyName}
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-1.5">
                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                    {journey.campaignCount} Campaigns
                                  </span>
                                  <span
                                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                                      noInterest
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    {journey.interestedUsersCount} Interested
                                  </span>
                                </div>

                                <div className="mt-2 text-[10px] text-slate-400">
                                  {journey.latestInterestedAt
                                    ? `Latest interest ${formatDate(journey.latestInterestedAt)}`
                                    : "No user interest yet"}
                                </div>
                              </div>
                              <RightOutlined
                                className={`mt-1 text-[10px] ${
                                  selected ? "text-blue-600" : "text-slate-300"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <div className="min-w-0">
                    {!selectedJourney || !selectedJourneySummary ? (
                      <div className="flex min-h-[520px] items-center justify-center p-8">
                        <Empty description="Select a journey" />
                      </div>
                    ) : (
                      <>
                        <div className="border-b border-slate-200 px-4 py-4 sm:px-5 lg:px-6">
                          <div className="min-w-0">
                            <div className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-600">
                              Selected journey
                            </div>
                            <h3 className="mt-1 break-words text-lg font-black text-slate-950 sm:text-xl lg:text-2xl">
                              {selectedJourney.journeyName}
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Tag className="m-0">
                                {selectedJourneySummary.campaignCount} campaigns
                              </Tag>
                              <Tag color="green" className="m-0">
                                {selectedJourneySummary.activeCampaignCount}{" "}
                                active
                              </Tag>
                              <Tag
                                color={
                                  selectedJourneySummary.interestedUsersCount
                                    ? "blue"
                                    : "gold"
                                }
                                className="m-0"
                              >
                                {selectedJourneySummary.interestedUsersCount}{" "}
                                interested users
                              </Tag>
                            </div>
                          </div>
                        </div>

                        <div className="grid xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,.95fr)]">
                          <div className="border-b border-slate-200 xl:border-b-0 xl:border-r">
                            <div className="flex items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
                              <div>
                                <div className="text-sm font-extrabold text-slate-900">
                                  Campaigns
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Select a campaign to view its interested users
                                </div>
                              </div>
                              <Tag className="m-0">
                                {visibleCampaigns.length}
                              </Tag>
                            </div>

                            {!visibleCampaigns.length ? (
                              <div className="border-t border-slate-100 p-8">
                                <Empty description="No campaigns available for this journey" />
                              </div>
                            ) : (
                              <div className="max-h-[590px] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
                                {visibleCampaigns.map((campaign, index) => {
                                  const users = campaign.interestedUsers || [];
                                  const selected =
                                    campaign.campaignId === selectedCampaignId;
                                  const latest = users.reduce(
                                    (max, user) =>
                                      Math.max(max, toMs(user.createdAt)),
                                    0,
                                  );

                                  return (
                                    <button
                                      type="button"
                                      key={campaign.campaignId}
                                      onClick={() =>
                                        setSelectedCampaignId(
                                          campaign.campaignId,
                                        )
                                      }
                                      className={`w-full px-4 py-4 text-left transition sm:px-5 lg:px-6 ${
                                        selected
                                          ? "bg-blue-50/70"
                                          : "hover:bg-slate-50"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[11px] font-black ${
                                            selected
                                              ? "bg-blue-600 text-white"
                                              : "bg-slate-100 text-slate-600"
                                          }`}
                                        >
                                          {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="break-words text-sm font-extrabold leading-5 text-slate-900">
                                            {campaign.campaignType ||
                                              "Unnamed campaign"}
                                          </div>

                                          {campaign.campaignDescription && (
                                            <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                                              {campaign.campaignDescription}
                                            </div>
                                          )}

                                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                            <Tag
                                              color={
                                                campaign.campaignStatus
                                                  ? "success"
                                                  : "default"
                                              }
                                              className="m-0"
                                            >
                                              {campaign.campaignStatus
                                                ? "ACTIVE"
                                                : "INACTIVE"}
                                            </Tag>
                                            <span
                                              className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                                                users.length
                                                  ? "bg-emerald-50 text-emerald-700"
                                                  : "bg-amber-50 text-amber-700"
                                              }`}
                                            >
                                              {users.length} interested
                                            </span>
                                            {latest > 0 && (
                                              <span className="text-[10px] text-slate-400">
                                                Latest {formatDate(latest)}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <RightOutlined
                                          className={`mt-1 text-[10px] ${
                                            selected
                                              ? "text-blue-600"
                                              : "text-slate-300"
                                          }`}
                                        />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="bg-slate-50/70">
                            <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-sm font-extrabold text-slate-900">
                                    Interested Users
                                  </div>
                                  <div className="mt-0.5 text-[11px] text-slate-500">
                                    Users from the selected campaign
                                  </div>
                                </div>
                                {selectedCampaign && (
                                  <Tag color="blue" className="m-0">
                                    {
                                      (selectedCampaign.interestedUsers || [])
                                        .length
                                    }
                                  </Tag>
                                )}
                              </div>
                            </div>

                            {!selectedCampaign ? (
                              <div className="flex min-h-[300px] items-center justify-center p-8">
                                <Empty description="Select a campaign" />
                              </div>
                            ) : (selectedCampaign.interestedUsers || [])
                                .length === 0 ? (
                              <div className="p-5 sm:p-8">
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                                  <div className="text-sm font-extrabold text-amber-800">
                                    No interested users yet
                                  </div>
                                  <div className="mt-1 text-xs leading-5 text-amber-700">
                                    This campaign currently has no user-interest
                                    records returned by the API.
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="max-h-[590px] overflow-y-auto p-3 sm:p-4">
                                <div className="space-y-2.5">
                                  {(selectedCampaign.interestedUsers || []).map(
                                    (user, index) => (
                                      <article
                                        key={`${user.userId || user.mobileNumber || "user"}-${index}`}
                                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0 flex-1">
                                            <div className="break-all text-sm font-black text-slate-950">
                                              {user.mobileNumber ||
                                                "No mobile number"}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                              {user.projectType && (
                                                <Tag className="m-0 text-[10px]">
                                                  {user.projectType}
                                                </Tag>
                                              )}
                                              {user.userRole && (
                                                <Tag
                                                  color="cyan"
                                                  className="m-0 text-[10px]"
                                                >
                                                  {user.userRole}
                                                </Tag>
                                              )}
                                              {user.deliveryType && (
                                                <Tag
                                                  color="purple"
                                                  className="m-0 text-[10px]"
                                                >
                                                  {user.deliveryType}
                                                </Tag>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex-none text-right text-[10px] leading-4 text-slate-400">
                                            {formatDate(user.createdAt)}
                                          </div>
                                        </div>

                                        {user.userId && (
                                          <div
                                            className="mt-3 truncate rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] text-slate-500"
                                            title={user.userId}
                                          >
                                            User ID: {user.userId}
                                          </div>
                                        )}

                                        {user.address && (
                                          <div className="mt-2 text-[11px] leading-4 text-slate-500">
                                            {user.address}
                                          </div>
                                        )}
                                      </article>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </ConfigProvider>
  );
};

export default JourneysVsCampaignsVsInterestedUsers;