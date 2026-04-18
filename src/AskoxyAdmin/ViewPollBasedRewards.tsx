import React, { useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import { Input, Spin, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaGift,
  FaSearch,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";

interface PollWinnerItem {
  id?: string;
  userId?: string;
  userName?: string;
  mobileNumber?: string;
  phoneNumber?: string;
  campaignId?: string;
  campaignTitle?: string;
  winningTeam?: string;
  selectedTeam?: string;
  rewardAmount?: number | string;
  reward?: number | string;
  coins?: number | string;
  rewardStatus?: string | boolean;
  status?: string | boolean;
  createdAt?: string | number;
  [key: string]: any;
}

const ViewPollBasedRewards: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialCampaignId =
    (location.state as { campaignId?: string } | null)?.campaignId || "";

  const [campaignId, setCampaignId] = useState(initialCampaignId);
  const [rewards, setRewards] = useState<PollWinnerItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const normalizeList = (raw: any): PollWinnerItem[] => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.response)) return raw.response;
    if (Array.isArray(raw?.result)) return raw.result;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(raw?.winners)) return raw.winners;
    if (Array.isArray(raw?.pollWinners)) return raw.pollWinners;
    return [];
  };

  const formatReadableDateTime = (value?: number | string) => {
    if (!value) return "-";

    const numericValue =
      typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : Number(value);

    const numericDate = new Date(numericValue);
    if (!Number.isNaN(numericDate.getTime())) {
      return numericDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const textDate = new Date(String(value));
    if (!Number.isNaN(textDate.getTime())) {
      return textDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return String(value);
  };

  const getDisplayStatus = (value: any) => {
    if (typeof value === "boolean") return value ? "Success" : "Pending";
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const getStatusClassName = (value: any) => {
    const finalValue = getDisplayStatus(value).trim().toLowerCase();

    if (
      finalValue === "success" ||
      finalValue === "completed" ||
      finalValue === "sent" ||
      finalValue === "true"
    ) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (finalValue === "pending") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-700";
  };

  const getRewardValue = (item: PollWinnerItem) => {
    if (
      item.rewardAmount !== undefined &&
      item.rewardAmount !== null &&
      item.rewardAmount !== ""
    ) {
      return item.rewardAmount;
    }
    if (
      item.reward !== undefined &&
      item.reward !== null &&
      item.reward !== ""
    ) {
      return item.reward;
    }
    if (item.coins !== undefined && item.coins !== null && item.coins !== "") {
      return item.coins;
    }
    return "-";
  };

  const fetchRewards = async (id?: string) => {
    const finalCampaignId = String(id || campaignId).trim();

    if (!finalCampaignId) {
      message.error("Please enter campaign id");
      return;
    }

    try {
      setIsFetching(true);

      const response = await axios.get(
        `${BASE_URL}/marketing-service/campgin/get-poll-Winners?campaignId=${encodeURIComponent(
          finalCampaignId,
        )}`,
      );

      const parsedRewards = normalizeList(response?.data);
      setRewards(parsedRewards);

      if (parsedRewards.length === 0) {
        message.info("No poll based rewards found");
      }
    } catch (error: any) {
      console.error("Fetch poll winners error:", error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message ||
        "Failed to fetch poll based rewards";

      message.error(apiMessage);
      setRewards([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (initialCampaignId) {
      fetchRewards(initialCampaignId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCampaignId]);

  const summary = useMemo(() => {
    const total = rewards.length;

    const successCount = rewards.filter((item) => {
      const status = String(item.rewardStatus ?? item.status ?? "")
        .trim()
        .toLowerCase();

      return (
        status === "success" ||
        status === "completed" ||
        status === "sent" ||
        status === "true"
      );
    }).length;

    return {
      total,
      successCount,
      pendingCount: total - successCount,
    };
  }, [rewards]);

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="bg-white px-4 py-5 sm:px-6 md:px-8 md:py-7 border-b border-slate-200">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  <FaGift className="text-[11px]" />
                  Poll Rewards Dashboard
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  View Poll Based Rewards
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/sendpollbasedrewards")}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Send Rewards
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/allroleblogs")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  All Poll Blogs
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 lg:p-7">
            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Campaign ID
                    </label>
                    <Input
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                      onPressEnter={() => fetchRewards()}
                      size="large"
                      placeholder="Enter campaign id"
                      prefix={<FaSearch className="text-slate-400" />}
                      className="rounded-xl"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchRewards()}
                    disabled={isFetching}
                    className={`h-[44px] rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 ${
                      isFetching ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    {isFetching ? "Loading..." : "Fetch Rewards"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <FaUsers />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Winners
                      </p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {summary.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Success Rewards
                      </p>
                      <p className="mt-1 text-3xl font-bold text-emerald-700">
                        {summary.successCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:col-span-2 xl:col-span-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <FaClock />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Pending / Others
                      </p>
                      <p className="mt-1 text-3xl font-bold text-amber-700">
                        {summary.pendingCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white">
                {isFetching ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-4 text-center">
                    <Spin size="large" />
                    <div>
                      <p className="text-base font-semibold text-slate-700">
                        Loading rewards...
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Please wait while campaign rewards are being fetched.
                      </p>
                    </div>
                  </div>
                ) : rewards.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <FaTrophy className="text-xl" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-slate-800">
                      No rewards found
                    </p>
                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      Enter a valid campaign ID to view poll winners, rewards,
                      and delivery status.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="hidden xl:block overflow-x-auto">
                      <div className="min-w-[1180px]">
                        <div className="grid grid-cols-[70px_1.4fr_1.15fr_0.95fr_0.95fr_120px_140px_170px] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          <div className="text-center">#</div>
                          <div>User</div>
                          <div>Campaign</div>
                          <div>Selected Team</div>
                          <div>Winning Team</div>
                          <div>Reward</div>
                          <div>Status</div>
                          <div>Created At</div>
                        </div>

                        <div className="divide-y divide-slate-200">
                          {rewards.map((item, index) => {
                            const rowKey =
                              item.id || `${item.userId || "row"}-${index}`;

                            return (
                              <div
                                key={rowKey}
                                className="grid grid-cols-[70px_1.4fr_1.15fr_0.95fr_0.95fr_120px_140px_170px] gap-3 px-5 py-4 hover:bg-slate-50 transition"
                              >
                                <div className="flex items-center justify-center">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                                    {index + 1}
                                  </div>
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {item.userName || "-"}
                                  </p>
                                  <p className="mt-1 break-all text-xs text-slate-500">
                                    User ID: {item.userId || "-"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Mobile:{" "}
                                    {item.mobileNumber ||
                                      item.phoneNumber ||
                                      "-"}
                                  </p>
                                </div>

                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                                    {item.campaignTitle || "-"}
                                  </p>
                                  <p className="mt-1 break-all text-xs text-slate-500">
                                    {item.campaignId || campaignId || "-"}
                                  </p>
                                </div>

                                <div className="flex items-center text-sm font-medium text-slate-700">
                                  {item.selectedTeam || "-"}
                                </div>

                                <div className="flex items-center text-sm font-semibold text-violet-700">
                                  {item.winningTeam || "-"}
                                </div>

                                <div className="flex items-center text-sm font-bold text-slate-900">
                                  {getRewardValue(item)}
                                </div>

                                <div className="flex items-center">
                                  <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                                      item.rewardStatus ?? item.status,
                                    )}`}
                                  >
                                    {getDisplayStatus(
                                      item.rewardStatus ?? item.status,
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center text-sm text-slate-700">
                                  {formatReadableDateTime(item.createdAt)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="xl:hidden p-4 sm:p-5">
                      <div className="grid grid-cols-1 gap-4">
                        {rewards.map((item, index) => {
                          const rowKey =
                            item.id || `${item.userId || "row"}-${index}`;

                          return (
                            <div
                              key={rowKey}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                                      {index + 1}
                                    </div>
                                    <p className="truncate text-base font-bold text-slate-900">
                                      {item.userName || "User"}
                                    </p>
                                  </div>
                                  <p className="mt-2 text-xs text-slate-500">
                                    {item.mobileNumber ||
                                      item.phoneNumber ||
                                      "-"}
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${getStatusClassName(
                                    item.rewardStatus ?? item.status,
                                  )}`}
                                >
                                  {getDisplayStatus(
                                    item.rewardStatus ?? item.status,
                                  )}
                                </span>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Campaign
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {item.campaignTitle || "-"}
                                  </p>
                                  <p className="mt-1 break-all text-xs text-slate-500">
                                    {item.campaignId || campaignId || "-"}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Selected Team
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {item.selectedTeam || "-"}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Winning Team
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-violet-700">
                                    {item.winningTeam || "-"}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Reward
                                  </p>
                                  <p className="mt-1 text-sm font-bold text-slate-900">
                                    {getRewardValue(item)}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Created At
                                  </p>
                                  <p className="mt-1 text-sm text-slate-800">
                                    {formatReadableDateTime(item.createdAt)}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    User ID
                                  </p>
                                  <p className="mt-1 break-all text-sm text-slate-700">
                                    {item.userId || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPollBasedRewards;
