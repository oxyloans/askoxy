import React, { useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import { message, Modal, Select, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBullhorn, FaCheckCircle, FaGift, FaTrophy } from "react-icons/fa";

const { Option } = Select;

interface BlogStateData {
  campaignId?: string;
  id?: string;
  campaignTitle?: string;
  team1?: string;
  team2?: string;
  team3?: string;
  team4?: string;
  pollEndTime?: number | string;
  campaignStatus?: boolean | string;
}

interface GameCampaignItem {
  campaignId?: string;
  id?: string;
  campaignTitle?: string;
  team1?: string;
  team2?: string;
  team3?: string;
  team4?: string;
  pollEndTime?: number | string;
  campaignStatus?: boolean | string | number;
  imageUrl?: string;
  imageUrls?: string[];
  images?: { imageUrl?: string; status?: boolean }[];
  type?: string;
  campaignTypeAddBy?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
}

const GET_GAMES_BLOGS_API = `${BASE_URL}/marketing-service/campgin/get-all-games?type=ADMIN`;

const SendPollBasedRewards: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const blogData = (location.state as { blogData?: BlogStateData } | null)
    ?.blogData;

  const [campaigns, setCampaigns] = useState<GameCampaignItem[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCampaignKey, setSelectedCampaignKey] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>(
    blogData?.campaignId || blogData?.id || "",
  );
  const [campaignTitle, setCampaignTitle] = useState<string>(
    blogData?.campaignTitle || "",
  );
  const [team1, setTeam1] = useState<string>(blogData?.team1 || "");
  const [team2, setTeam2] = useState<string>(blogData?.team2 || "");
  const [winningTeam, setWinningTeam] = useState<string>("");

  const [campaignIdError, setCampaignIdError] = useState("");
  const [winningTeamError, setWinningTeamError] = useState("");

  const normalizeCampaigns = (raw: any): GameCampaignItem[] => {
    let data: GameCampaignItem[] = [];

    if (Array.isArray(raw)) data = raw;
    else if (Array.isArray(raw?.data)) data = raw.data;
    else if (Array.isArray(raw?.response)) data = raw.response;
    else if (Array.isArray(raw?.content)) data = raw.content;
    else if (Array.isArray(raw?.campaigns)) data = raw.campaigns;
    else if (Array.isArray(raw?.result)) data = raw.result;

    return data.map((item) => ({
      ...item,
      campaignId: item.campaignId || item.id || "",
      id: item.id || item.campaignId || "",
      campaignTitle: item.campaignTitle || "",
      team1: item.team1 || "",
      team2: item.team2 || "",
    }));
  };

  const getNormalizedId = (item: GameCampaignItem) =>
    item.campaignId || item.id || "";

  const winningTeamOptions = useMemo(() => {
    return [team1, team2]
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }, [team1, team2]);

  const clearErrors = () => {
    setCampaignIdError("");
    setWinningTeamError("");
  };

  const fetchCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const response = await axios.get(GET_GAMES_BLOGS_API);
      const parsedCampaigns = normalizeCampaigns(response?.data);
      setCampaigns(parsedCampaigns);

      if (blogData?.campaignId || blogData?.id) {
        const initialId = blogData?.campaignId || blogData?.id || "";
        const matched = parsedCampaigns.find(
          (item) => getNormalizedId(item) === initialId,
        );

        if (matched) {
          setSelectedCampaignKey(getNormalizedId(matched));
          setCampaignId(getNormalizedId(matched));
          setCampaignTitle(matched.campaignTitle || "");
          setTeam1(matched.team1 || "");
          setTeam2(matched.team2 || "");
        }
      }
    } catch (error: any) {
      console.error("Fetch campaigns error:", error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch campaigns";
      message.error(apiMessage);
      setCampaigns([]);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCampaignChange = (value: string) => {
    setSelectedCampaignKey(value);
    setCampaignIdError("");
    setWinningTeamError("");
    setWinningTeam("");

    const selectedCampaign = campaigns.find(
      (item) => getNormalizedId(item) === value,
    );

    if (selectedCampaign) {
      setCampaignId(getNormalizedId(selectedCampaign));
      setCampaignTitle(selectedCampaign.campaignTitle || "");
      setTeam1(selectedCampaign.team1 || "");
      setTeam2(selectedCampaign.team2 || "");
    } else {
      setCampaignId("");
      setCampaignTitle("");
      setTeam1("");
      setTeam2("");
    }
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!campaignId.trim()) {
      setCampaignIdError("Campaign is required");
      isValid = false;
    }

    if (!winningTeam.trim()) {
      setWinningTeamError("Winning team is required");
      isValid = false;
    }

    return isValid;
  };

  const handleDeclareWinner = async () => {
    try {
      setIsSubmitting(true);

      const encodedCampaignId = encodeURIComponent(campaignId.trim());
      const encodedWinningTeam = encodeURIComponent(winningTeam.trim());

      const url = `${BASE_URL}/marketing-service/campgin/declare-poll-winner/${encodedCampaignId}?winningTeam=${encodedWinningTeam}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            accept: "*/*",
          },
        },
      );

      const apiMessage =
        response?.data?.message ||
        response?.data?.responseMessage ||
        response?.data?.statusMessage ||
        "Poll winner declared and rewards sent successfully";

      message.success(apiMessage);

      navigate("/admin/viewpollbasedrewards", {
        state: {
          campaignId: campaignId.trim(),
          winningTeam: winningTeam.trim(),
          blogData: {
            campaignId,
            campaignTitle,
            team1,
            team2,
          },
        },
      });
    } catch (error: any) {
      console.error("Declare poll winner error:", error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message ||
        "Failed to send poll based rewards";

      message.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      message.error("Please fill the required fields");
      return;
    }

    Modal.confirm({
      title: "Confirm Reward Distribution",
      content: `Are you sure you want to declare "${winningTeam}" as the winner and send poll based rewards?`,
      okText: "Send Rewards",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        await handleDeclareWinner();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 md:px-8 md:py-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  <FaGift className="text-[11px]" />
                  Poll Rewards Distribution
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Send Poll Based Rewards
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/allroleblogs")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  All Poll Blogs
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/viewpollbasedrewards")}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  View Rewards
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 lg:p-7">
            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Campaign <span className="text-red-500">*</span>
                </label>

                <Select
                  showSearch
                  value={selectedCampaignKey || undefined}
                  onChange={handleCampaignChange}
                  placeholder="Search and select campaign"
                  loading={isLoadingCampaigns}
                  optionFilterProp="children"
                  className="w-full"
                  size="large"
                  notFoundContent={
                    isLoadingCampaigns ? (
                      <Spin size="small" />
                    ) : (
                      "No campaigns found"
                    )
                  }
                  filterOption={(input, option) =>
                    String(option?.children || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {campaigns.map((item) => {
                    const itemId = getNormalizedId(item);
                    const title = item.campaignTitle || "Untitled Campaign";
                    const t1 = item.team1 || "-";
                    const t2 = item.team2 || "-";

                    return (
                      <Option key={itemId} value={itemId}>
                        {title} - {t1} vs {t2}
                      </Option>
                    );
                  })}
                </Select>

                {campaignIdError && (
                  <p className="mt-2 text-sm text-red-600">{campaignIdError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <FaBullhorn />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Campaign Title
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 break-words">
                        {campaignTitle || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <FaGift />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Campaign ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 break-all">
                        {campaignId || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <FaTrophy />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Team 1
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {team1 || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Team 2
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {team2 || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Winning Team <span className="text-red-500">*</span>
                </label>

                <Select
                  value={winningTeam || undefined}
                  onChange={(value) => {
                    setWinningTeam(value);
                    setWinningTeamError("");
                  }}
                  placeholder="Select winning team"
                  className="w-full"
                  size="large"
                  disabled={!campaignId || winningTeamOptions.length === 0}
                >
                  {winningTeamOptions.map((team) => (
                    <Option key={team} value={team}>
                      {team}
                    </Option>
                  ))}
                </Select>

                {winningTeamError && (
                  <p className="mt-2 text-sm text-red-600">
                    {winningTeamError}
                  </p>
                )}

                {winningTeamOptions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {winningTeamOptions.map((team) => (
                      <span
                        key={team}
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          winningTeam === team
                            ? "border-violet-300 bg-violet-100 text-violet-700"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !campaignId}
                  className={`inline-flex h-[46px] items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 ${
                    isSubmitting || !campaignId
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                >
                  {isSubmitting
                    ? "Sending Rewards..."
                    : "Declare Winner & Send Rewards"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/viewpollbasedrewards", {
                      state: { campaignId },
                    })
                  }
                  className="inline-flex h-[46px] items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Rewards List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPollBasedRewards;
