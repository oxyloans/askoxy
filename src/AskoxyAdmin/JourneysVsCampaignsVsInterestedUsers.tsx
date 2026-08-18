import React, { useEffect, useRef, useMemo, useState } from "react";
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
  Modal,
  Select,
  Skeleton,
  Tag,
  message,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Search } = Input;
const { useBreakpoint } = Grid;

interface CampaignComment {
  id: string;
  campaignId: string;
  personName: string | null;
  comments: string | null;
  status: string | null;
  createdAt: string | number | null;
  updatedAt?: string | number | null;
}

interface JourneyInterestedUser {
  id: string;
  userId: string | null;
  mobileNumber: string | null;
  address?: string | null;
  projectType?: string | null;
  userRole?: string | null;
  deliveryType?: string | null;
  createdAt: string | number | null;
  comments?: CampaignComment[] | null;
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

interface CampaignCommentApiResponse {
  data?: CampaignComment;
  message?: string;
  status?: boolean;
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
  const location = useLocation();
  const navigate = useNavigate();

  const [journeys, setJourneys] = useState<JourneyCampaignApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [journeyInterestView, setJourneyInterestView] = useState<JourneyInterestView>("ALL");
  const journeyListRef = useRef<HTMLDivElement>(null);
  // true while the URL-param effect is applying its selection — prevents auto-reset
  const applyingUrlParam = useRef(false);

  const [commentPersonName, setCommentPersonName] = useState(
    () => localStorage.getItem("admin_userName") || "",
  );
  const [userComment, setUserComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentModalUser, setCommentModalUser] =
    useState<JourneyInterestedUser | null>(null);
  const [viewCommentsUser, setViewCommentsUser] =
    useState<JourneyInterestedUser | null>(null);
  const [commentErrors, setCommentErrors] = useState<{
    personName?: string;
    comments?: string;
  }>({});

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

  // ── Apply URL params once data is loaded ──────────────────────────────────
  useEffect(() => {
    if (loading || !journeys.length) return;

    const params = new URLSearchParams(location.search);
    const journeyParam = params.get("journeyId");
    const campaignParam = params.get("campaignId");

    if (!journeyParam) return;

    const matchedJourney = journeys.find((j) => j.journeyId === journeyParam);
    if (!matchedJourney) return;

    const campaigns = matchedJourney.campaigns || [];
    const campaignToOpen =
      (campaignParam ? campaigns.find((c) => c.campaignId === campaignParam) : null) ||
      campaigns.find((c) => (c.interestedUsers || []).length > 0) ||
      campaigns[0] ||
      null;

    applyingUrlParam.current = true;
    setSelectedJourneyId(matchedJourney.journeyId);
    setSelectedCampaignId(campaignToOpen?.campaignId ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, journeys]);

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

  // ── Auto-select first journey when none is selected ───────────────────────
  useEffect(() => {
    if (applyingUrlParam.current) return;
    if (!filteredJourneys.length) { setSelectedJourneyId(null); return; }
    const exists = filteredJourneys.some((j) => j.journeyId === selectedJourneyId);
    if (!exists) setSelectedJourneyId(filteredJourneys[0].journeyId);
  }, [filteredJourneys]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset campaign when journey changes (skip when URL param applied) ──────
  useEffect(() => {
    if (applyingUrlParam.current) { applyingUrlParam.current = false; return; }
    setSelectedCampaignId(null);
  }, [selectedJourneyId]);

  // ── Auto-select first campaign when none selected ──────────────────────────
  useEffect(() => {
    if (!visibleCampaigns.length) { setSelectedCampaignId(null); return; }
    const exists = visibleCampaigns.some((c) => c.campaignId === selectedCampaignId);
    if (!exists) setSelectedCampaignId(visibleCampaigns[0].campaignId);
  }, [visibleCampaigns]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync selected journeyId into URL (admin manual click) ─────────────────
  useEffect(() => {
    if (loading) return;
    const current = new URLSearchParams(location.search);
    const urlJourneyId = current.get("journeyId");
    if (urlJourneyId === selectedJourneyId) return; // already in sync
    const next = new URLSearchParams();
    if (selectedJourneyId) next.set("journeyId", selectedJourneyId);
    navigate({ pathname: location.pathname, search: next.toString() ? `?${next}` : "" }, { replace: true });
  }, [selectedJourneyId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll selected journey into view in sidebar ───────────────────────────
  useEffect(() => {
    if (!selectedJourneyId || !journeyListRef.current) return;
    const id = window.requestAnimationFrame(() => {
      const el = journeyListRef.current?.querySelector<HTMLButtonElement>(`[data-journey-id="${selectedJourneyId}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [selectedJourneyId]);

  const openWriteComment = (user: JourneyInterestedUser) => {
    setCommentModalUser(user);
    setUserComment("");
    setCommentErrors({});
  };

  const closeWriteComment = () => {
    if (commentSubmitting) return;
    setCommentModalUser(null);
    setUserComment("");
    setCommentErrors({});
  };

  const saveCampaignComment = async () => {
    if (!commentModalUser?.id) {
      message.warning("Unable to identify this interested-user record.");
      return;
    }

    const personName = commentPersonName.trim();
    const comments = userComment.trim();
    const nextErrors: { personName?: string; comments?: string } = {};

    if (!personName) {
      nextErrors.personName = "Person name is required.";
    } else if (personName.length < 2) {
      nextErrors.personName = "Enter at least 2 characters.";
    }

    if (!comments) {
      nextErrors.comments = "Comment is required.";
    } else if (comments.length < 3) {
      nextErrors.comments = "Enter at least 3 characters.";
    }

    if (Object.keys(nextErrors).length) {
      setCommentErrors(nextErrors);
      message.warning("Please complete the required comment details.");
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentErrors({});

      // IMPORTANT: Backend calls this field `campaignId`, but this endpoint
      // expects the interested-user record id returned inside interestedUsers[].id.
      const interestedUserRecordId = commentModalUser.id;

      const response = await axios.post<CampaignCommentApiResponse>(
        `${BASE_URL}/marketing-service/campgin/save-or-update-campaign-comment`,
        {
          campaignId: interestedUserRecordId,
          comments,
          personName,
          status: "INTERESTED",
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status === false || !response.data?.data) {
        throw new Error(
          response.data?.message || "Unable to save the user comment.",
        );
      }

      const savedComment = response.data.data;

      setJourneys((currentJourneys) =>
        currentJourneys.map((journey) => ({
          ...journey,
          campaigns: (journey.campaigns || []).map((campaign) => ({
            ...campaign,
            interestedUsers: (campaign.interestedUsers || []).map((user) =>
              user.id === interestedUserRecordId
                ? {
                  ...user,
                  comments: [savedComment, ...(user.comments || [])],
                }
                : user,
            ),
          })),
        })),
      );

      message.success(
        response.data?.message || "Comment saved successfully.",
      );
      setCommentModalUser(null);
      setUserComment("");
      setCommentErrors({});
    } catch (err) {
      console.error("Failed to save interested-user comment", err);
      message.error(
        err instanceof Error
          ? err.message
          : "Unable to save the comment. Please try again.",
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

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

  const metricCards = [
    {
      label: "Journeys",
      value: totalJourneys,
      note: "Available journeys",
      icon: <ApartmentOutlined />,
      iconBg: "#008cba",
      valuColor: "#008cba",
    },
    {
      label: "Campaigns",
      value: totalCampaigns,
      note: `${totalActiveCampaigns} currently active`,
      icon: <NotificationOutlined />,
      iconBg: "#1ab394",
      valuColor: "#1ab394",
    },
    {
      label: "Interested Users",
      value: totalInterestedUsers,
      note: "Interest records across campaigns",
      icon: <TeamOutlined />,
      iconBg: "#008cba",
      valuColor: "#008cba",
    },
    {
      label: "Not Interested Journeys",
      value: journeysWithoutInterest,
      note: "Journeys with zero interested users",
      icon: <CheckCircleFilled />,
      iconBg: "#f59e0b",
      valuColor: "#b45309",
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
      <>
        <div
          className="min-h-screen bg-[#f7f9fc] text-slate-900"
          style={{ colorScheme: "light" }}
        >
          <header className="   backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-5 md:flex-row md:items-center md:justify-between lg:px-7">
              <div className="min-w-0">

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
                  className="!h-10 !rounded-xl !border-blue-500 !bg-gradient-to-b !from-[#008cba] !to-[#008cba] !px-4 !font-semibold !shadow-[0_6px_16px_rgba(37,99,235,0.22)] hover:!from-[#008cba] hover:!to-[#008cba]"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-5 lg:px-7 lg:py-6">
            <section className="overflow-hidden ">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {metricCards.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: metric.iconBg }}
                      >
                        {metric.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          {metric.label}
                        </div>

                        <div
                          className="mt-1 text-2xl font-black"
                          style={{ color: metric.valuColor }}
                        >
                          {loading ? "—" : metric.value}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {metric.note}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                    className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${journeyInterestView === "ALL"
                      ? "border-blue-300 bg-gradient-to-b from-white via-blue-50/80 to-blue-100/70 shadow-[0_7px_18px_rgba(37,99,235,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_7px_16px_rgba(37,99,235,0.1)]"
                      }`}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${journeyInterestView === "ALL"
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
                    className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 ${journeyInterestView === "WITH_INTEREST"
                      ? "border-emerald-300 bg-gradient-to-b from-white via-emerald-50/80 to-emerald-100/70 shadow-[0_7px_18px_rgba(5,150,105,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_7px_16px_rgba(5,150,105,0.1)]"
                      }`}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${journeyInterestView === "WITH_INTEREST"
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
                    className={`relative overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/25 ${journeyInterestView === "WITHOUT_INTEREST"
                      ? "border-amber-300 bg-gradient-to-b from-white via-amber-50/80 to-amber-100/70 shadow-[0_7px_18px_rgba(217,119,6,0.14)]"
                      : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_3px_10px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_7px_16px_rgba(217,119,6,0.1)]"
                      }`}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base ${journeyInterestView === "WITHOUT_INTEREST"
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
                      onChange={(value: string) => {
                        setSelectedJourneyId(value);
                      }}
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

                      <div className="max-h-[760px] overflow-y-auto" ref={journeyListRef}>
                        {filteredJourneys.map((journey) => {
                          const selected =
                            journey.journeyId === selectedJourneyId;
                          const noInterest = journey.interestedUsersCount === 0;

                          return (
                            <button
                              type="button"
                              key={journey.journeyId}
                              data-journey-id={journey.journeyId}
                              onClick={() => {
                                setSelectedJourneyId(journey.journeyId);
                              }}
                              className={`w-full border-b border-slate-200 px-4 py-3.5 text-left transition ${selected
                                ? "bg-white shadow-[inset_4px_0_0_#2563eb]"
                                : "hover:bg-white"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={`break-words text-sm font-extrabold leading-5 ${selected
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
                                      className={`rounded-md px-2 py-1 text-[10px] font-bold ${noInterest
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
                                  className={`mt-1 text-[10px] ${selected ? "text-blue-600" : "text-slate-300"
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
                                        onClick={() => {
                                          setSelectedCampaignId(campaign.campaignId);
                                        }}
                                        className={`w-full px-4 py-4 text-left transition sm:px-5 lg:px-6 ${selected
                                          ? "bg-blue-50/70"
                                          : "hover:bg-slate-50"
                                          }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div
                                            className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[11px] font-black ${selected
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
                                                className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${users.length
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
                                            className={`mt-1 text-[10px] ${selected
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
                                          key={user.id || `${user.userId || user.mobileNumber || "user"}-${index}`}
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

                                          <div className="mt-3 grid gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] text-slate-500">
                                            <div className="truncate" title={user.id}>
                                              Interest Record ID: {user.id}
                                            </div>
                                            {user.userId && (
                                              <div className="truncate" title={user.userId}>
                                                User ID: {user.userId}
                                              </div>
                                            )}
                                          </div>

                                          {user.address && (
                                            <div className="mt-2 text-[11px] leading-4 text-slate-500">
                                              {user.address}
                                            </div>
                                          )}

                                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                                            <Button
                                              style={{ backgroundColor: "#008cba", color: "white", border: "#008cba" }}
                                              size="small"
                                              onClick={() => openWriteComment(user)}
                                              className="!rounded-lg !font-semibold"
                                            >
                                              Write Comments
                                            </Button>
                                            <Button
                                              size="small"
                                              onClick={() => setViewCommentsUser(user)}
                                              className="!rounded-lg !font-semibold"
                                            >
                                              View Comments ({(user.comments || []).length})
                                            </Button>
                                            {/* {(user.comments || []).length > 0 && (
                                              <Tag color="green" className="m-0">
                                                {(user.comments || []).length} saved
                                              </Tag>
                                            )} */}
                                          </div>
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

        <Modal
          title="Write Interested User Comment"
          open={Boolean(commentModalUser)}
          onCancel={closeWriteComment}
          onOk={() => void saveCampaignComment()}
          okText="Save Comment"
          cancelText="Cancel"
          confirmLoading={commentSubmitting}
          maskClosable={!commentSubmitting}
          keyboard={!commentSubmitting}
          destroyOnClose
          centered
          width={isMobile ? "calc(100vw - 24px)" : 560}
        >
          {commentModalUser && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-500">Interested User</div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {commentModalUser.mobileNumber || "No mobile number"}
                </div>
                <div className="mt-2 break-all text-[11px] text-slate-500">
                  Record ID: {commentModalUser.id}
                </div>
                <div className="mt-2">
                  <Tag color="blue" className="m-0">INTERESTED</Tag>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Person Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={commentPersonName}
                  status={commentErrors.personName ? "error" : undefined}
                  onChange={(event) => {
                    setCommentPersonName(event.target.value);
                    if (commentErrors.personName) {
                      setCommentErrors((current) => ({ ...current, personName: undefined }));
                    }
                  }}
                  placeholder="Enter person name"
                  maxLength={120}
                  autoComplete="name"
                />
                {commentErrors.personName && (
                  <div className="mt-1 text-xs font-medium text-red-600">
                    {commentErrors.personName}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Comment <span className="text-red-500">*</span>
                </label>
                <Input.TextArea
                  value={userComment}
                  status={commentErrors.comments ? "error" : undefined}
                  onChange={(event) => {
                    setUserComment(event.target.value);
                    if (commentErrors.comments) {
                      setCommentErrors((current) => ({ ...current, comments: undefined }));
                    }
                  }}
                  placeholder="Write the follow-up comment"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={1000}
                  showCount
                />
                {commentErrors.comments && (
                  <div className="mt-1 text-xs font-medium text-red-600">
                    {commentErrors.comments}
                  </div>
                )}
              </div>


            </div>
          )}
        </Modal>

        <Modal
          title={`Comments${viewCommentsUser?.mobileNumber ? ` · ${viewCommentsUser.mobileNumber}` : ""}`}
          open={Boolean(viewCommentsUser)}
          onCancel={() => setViewCommentsUser(null)}
          footer={null}
          centered
          width={isMobile ? "calc(100vw - 24px)" : 640}
        >
          {viewCommentsUser && (
            <div className="pt-2">
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Interested User Record
                </div>
                <div className="mt-1 break-all text-xs text-slate-700">
                  {viewCommentsUser.id}
                </div>
              </div>

              {(viewCommentsUser.comments || []).length === 0 ? (
                <Empty description="No comments have been added for this user yet" />
              ) : (
                <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
                  {[...(viewCommentsUser.comments || [])]
                    .sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt))
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-black text-slate-900">
                              {comment.personName || "Unknown person"}
                            </div>
                            <div className="mt-0.5 text-[10px] text-slate-400">
                              {formatDateTime(comment.createdAt)}
                            </div>
                          </div>
                          <Tag color={comment.status === "INTERESTED" ? "green" : "default"} className="m-0">
                            {comment.status || "—"}
                          </Tag>
                        </div>
                        <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {comment.comments || "—"}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      </>
    </ConfigProvider>
  );
};

export default JourneysVsCampaignsVsInterestedUsers;