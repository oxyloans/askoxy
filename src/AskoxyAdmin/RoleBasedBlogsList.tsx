import React, { useEffect, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

interface GamesBlogItem {
  campaignId?: string;
  id?: string;
  campaignTitle?: string;
  campaignTypeAddBy?: string;
  type?: string;
  team1?: string;
  team2?: string;
  team3?: string;
  team4?: string;
  pollEndTime?: number | string;
  campaignDescription?: string;
  socialMediaCaption?: string;
  campaignStatus?: boolean | string | number;
  imageUrl?: string;
  imageUrls?: string[];
  images?: { imageUrl?: string; status?: boolean }[];
  createdAt?: string | number;
  updatedAt?: string | number;
}

const GET_GAMES_BLOGS_API = `${BASE_URL}/marketing-service/campgin/get-all-games?type=ADMIN`;
const UPDATE_GAMES_BLOG_API = `${BASE_URL}/marketing-service/campgin/add-games-blog`;

const RoleBasedBlogsList: React.FC = () => {
  const [blogs, setBlogs] = useState<GamesBlogItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState("");

  const navigate = useNavigate();

  const baseUrl = window.location.href.includes("sandbox")
    ? "https://www.sandbox.askoxy.ai"
    : "https://www.askoxy.ai";

  const normalizeBlogs = (raw: any): GamesBlogItem[] => {
    let data: GamesBlogItem[] = [];

    if (Array.isArray(raw)) data = raw;
    else if (Array.isArray(raw?.data)) data = raw.data;
    else if (Array.isArray(raw?.response)) data = raw.response;
    else if (Array.isArray(raw?.content)) data = raw.content;
    else if (Array.isArray(raw?.campaigns)) data = raw.campaigns;
    else if (Array.isArray(raw?.result)) data = raw.result;

    return data.map((item) => ({
      ...item,
      type:
        typeof item?.type === "string" && item.type.trim()
          ? item.type.trim()
          : "ADMIN",
      campaignTypeAddBy:
        typeof item?.campaignTypeAddBy === "string" &&
        item.campaignTypeAddBy.trim()
          ? item.campaignTypeAddBy.trim()
          : "ADMIN",
    }));
  };

  const formatReadableDate = (value?: number | string) => {
    if (!value) return "-";

    const numericValue =
      typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : Number(value);

    const date = new Date(numericValue);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    const textDate = new Date(String(value));
    if (!Number.isNaN(textDate.getTime())) {
      return textDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return String(value);
  };

  const getPreviewImage = (item: GamesBlogItem) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.imageUrls?.length) return item.imageUrls[0];
    if (item.images?.length && item.images[0]?.imageUrl) return item.images[0].imageUrl;
    return "";
  };

  const getStatusValue = (status: GamesBlogItem["campaignStatus"]) => {
    if (typeof status === "boolean") return status;

    if (typeof status === "number") return status === 1;

    if (typeof status === "string") {
      const normalized = status.trim().toLowerCase();
      return (
        normalized === "true" ||
        normalized === "active" ||
        normalized === "1" ||
        normalized === "yes"
      );
    }

    return false;
  };

  const slugify = (text?: string) =>
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

  const getNormalizedId = (item: GamesBlogItem) => item.id || item.campaignId || "";

  const getWithoutAuthUrl = (item: GamesBlogItem) => {
    const id = getNormalizedId(item);
    const slug = slugify(item.campaignTitle);
    return `${baseUrl}/blog/${id.slice(-4)}/${slug}`;
  };

  const getWithAuthUrl = (item: GamesBlogItem) => {
    const id = getNormalizedId(item);
    const slug = slugify(item.campaignTitle);
    return `${baseUrl}/main/blog/${id.slice(-4)}/${slug}`;
  };

  const handleCopy = async (url: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      message.success("URL copied successfully");
    } catch {
      message.error("Failed to copy URL");
    }
  };

  const renderInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      parts.push(<strong key={`bold-${key++}`}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const renderDescription = (value?: string) => {
    const content = String(value || "").trim();
    if (!content) return <p>-</p>;

    const lines = content.split("\n");

    return (
      <>
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={`line-${index}`} className="h-2" />;
          }

          if (trimmed.startsWith("• ")) {
            return (
              <div key={`line-${index}`} className="flex gap-1.5">
                <span className="mt-[1px]">•</span>
                <span>{renderInlineMarkdown(trimmed.slice(2))}</span>
              </div>
            );
          }

          return <p key={`line-${index}`}>{renderInlineMarkdown(line)}</p>;
        })}
      </>
    );
  };

  const fetchGamesBlogs = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(GET_GAMES_BLOGS_API);
      const parsedBlogs = normalizeBlogs(response?.data);
      setBlogs(parsedBlogs);
    } catch (error: any) {
      console.error("Fetch games blogs error:", error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      message.error(apiMessage || "Failed to fetch poll blogs");
      setBlogs([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchGamesBlogs();
  }, []);

  const handleEdit = (item: GamesBlogItem) => {
    const normalizedId = getNormalizedId(item);

    navigate("/admn/addroleblogs", {
      state: {
        blogData: {
          ...item,
          id: normalizedId,
          campaignId: item.campaignId || normalizedId,
          type: item.type || "ADMIN",
          campaignTypeAddBy: item.campaignTypeAddBy || "ADMIN",
        },
      },
    });
  };

  const handleOpenWithoutAuth = (item: GamesBlogItem) => {
    window.open(getWithoutAuthUrl(item), "_blank", "noopener,noreferrer");
  };

  const handleToggleStatus = async (item: GamesBlogItem) => {
    const normalizedId = getNormalizedId(item);
    if (!normalizedId) {
      message.error("Blog id not found");
      return;
    }

    const currentStatus = getStatusValue(item.campaignStatus);
    const nextStatus = !currentStatus;

    const confirmMessage = currentStatus
      ? "Do you want to inactive this blog?"
      : "Do you want to active this blog?";

    const confirmAction = window.confirm(confirmMessage);
    if (!confirmAction) return;

    try {
      setStatusLoadingId(normalizedId);

      const payload = {
        id: normalizedId,
        type: item.type || "ADMIN",
        campaignId: item.campaignId || normalizedId,
        campaignTitle: item.campaignTitle || "",
        campaignTypeAddBy: item.campaignTypeAddBy || "ADMIN",
        team1: item.team1 || "",
        team2: item.team2 || "",
        team3: item.team3 || "",
        team4: item.team4 || "",
        pollEndTime: item.pollEndTime || null,
        campaignDescription: item.campaignDescription || "",
        socialMediaCaption: item.socialMediaCaption || "",
        campaignStatus: nextStatus,
        imageUrl: item.imageUrl || getPreviewImage(item) || "",
      };

      await axios.patch(UPDATE_GAMES_BLOG_API, payload);

      setBlogs((prev) =>
        prev.map((blog) => {
          const blogId = getNormalizedId(blog);
          if (blogId === normalizedId) {
            return {
              ...blog,
              campaignStatus: nextStatus,
              type: blog.type || "ADMIN",
              campaignTypeAddBy: blog.campaignTypeAddBy || "ADMIN",
            };
          }
          return blog;
        })
      );

      message.success(
        nextStatus ? "Blog activated successfully" : "Blog inactivated successfully"
      );

      navigate("/admn/allroleblogs", { replace: true });
    } catch (error: any) {
      console.error("Update status error:", error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      message.error(apiMessage || "Failed to update blog status");
    } finally {
      setStatusLoadingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2.5 py-3.5 sm:px-3.5 md:px-5 md:py-5">
      <div className="mx-auto max-w-[1380px]">
        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-3.5 py-4 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-lg font-bold text-white sm:text-xl md:text-[1.65rem]">
                  Poll Based Blogs
                </h1>
                <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                  View, open and update poll blogs
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admn/addroleblogs")}
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:text-sm"
              >
                Add Poll Blog
              </button>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 md:p-5">
            {isFetching ? (
              <div className="py-14 text-center text-slate-500 text-sm">Loading poll blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="py-14 text-center text-slate-500 text-sm">No blogs found</div>
            ) : (
              <>
                <div className="hidden xl:grid xl:grid-cols-[110px_1.35fr_1.65fr_1.45fr_1.45fr_1fr_125px] gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-center text-xs font-semibold text-slate-700">
                  <div>Media</div>
                  <div>Blog Type</div>
                  <div>Description</div>
                  <div>Service Url (Without Authorization)</div>
                  <div>Service Url (With Authorization)</div>
                  <div>Added By</div>
                  <div>Actions</div>
                </div>

                <div className="mt-3.5 space-y-3.5">
                  {blogs.map((item, index) => {
                    const itemId = getNormalizedId(item) || `row-${index}`;
                    const previewImage = getPreviewImage(item);
                    const isActive = getStatusValue(item.campaignStatus);
                    const withoutAuthUrl = getWithoutAuthUrl(item);
                    const withAuthUrl = getWithAuthUrl(item);
                    const isStatusLoading = statusLoadingId === itemId;
                    const finalType = item.type || "ADMIN";
                    const finalCampaignType = item.campaignTypeAddBy || "ADMIN";

                    return (
                      <div
                        key={itemId}
                        className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                      >
                        <div className="hidden xl:grid xl:grid-cols-[110px_1.35fr_1.65fr_1.45fr_1.45fr_1fr_125px] gap-3 px-3.5 py-4">
                          <div className="flex items-center justify-center">
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt={item.campaignTitle || "Media"}
                                className="h-20 w-full rounded-lg border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-20 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-400">
                                No Media
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-5 break-words text-xs font-semibold leading-7 text-slate-800 sm:text-sm">
                              {item.campaignTitle || "-"}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <div className="max-h-36 overflow-y-auto pr-1.5 space-y-1.5 break-words text-xs leading-6 text-slate-700 sm:text-sm">
                              {renderDescription(item.campaignDescription)}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="mb-1.5 text-xs text-slate-700 sm:text-sm">
                              Without Authorization url :
                            </p>
                            <a
                              href={withoutAuthUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-xs text-blue-600 underline sm:text-sm"
                            >
                              {withoutAuthUrl}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(withoutAuthUrl)}
                              className="mt-2.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 sm:text-sm"
                            >
                              Copy
                            </button>
                          </div>

                          <div className="min-w-0">
                            <p className="mb-1.5 text-xs text-slate-700 sm:text-sm">
                              Authorization url :
                            </p>
                            <a
                              href={withAuthUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-xs text-blue-600 underline sm:text-sm"
                            >
                              {withAuthUrl}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(withAuthUrl)}
                              className="mt-2.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 sm:text-sm"
                            >
                              Copy
                            </button>
                          </div>

                          <div className="text-xs text-slate-700 sm:text-sm">
                            <p className="break-words font-medium">Type: {finalType}</p>
                            <p className="break-words mt-1 font-medium">
                              Campaign Type: {finalCampaignType}
                            </p>
                            <p className="mt-1.5">
                              <span className="font-semibold">Created:</span>{" "}
                              {formatReadableDate(item.createdAt)}
                            </p>
                            <p className="mt-1">
                              <span className="font-semibold">Updated:</span>{" "}
                              {formatReadableDate(item.updatedAt)}
                            </p>
                            <p className="mt-2.5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 sm:text-sm"
                            >
                              Update
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenWithoutAuth(item)}
                              className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-700 sm:text-sm"
                            >
                              Open
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item)}
                              disabled={isStatusLoading}
                              className={`rounded-lg px-3 py-2 text-xs font-medium text-white transition sm:text-sm ${
                                isActive
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-emerald-600 hover:bg-emerald-700"
                              } ${isStatusLoading ? "cursor-not-allowed opacity-70" : ""}`}
                            >
                              {isStatusLoading
                                ? "Updating..."
                                : isActive
                                ? "Inactive"
                                : "Active"}
                            </button>
                          </div>
                        </div>

                        <div className="xl:hidden p-3.5 sm:p-4">
                          <div className="flex flex-col gap-3.5 lg:flex-row">
                            <div className="w-full shrink-0 lg:w-52">
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt={item.campaignTitle || "Media"}
                                  className="h-36 w-full rounded-lg border border-slate-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-36 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-400">
                                  No Media
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-3.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="break-words text-base font-bold text-slate-800 sm:text-[1.05rem]">
                                  {item.campaignTitle || "-"}
                                </h2>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                              </div>

                              <div className="rounded-lg bg-slate-50 p-2.5">
                                <p className="mb-1 text-[11px] font-semibold text-slate-500">
                                  Description
                                </p>
                                <div className="space-y-1.5 break-words text-xs leading-5 text-slate-700 sm:text-sm">
                                  {renderDescription(item.campaignDescription)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[11px] font-semibold text-slate-500">
                                    Without Authorization URL
                                  </p>
                                  <a
                                    href={withoutAuthUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block break-all text-xs text-blue-600 underline sm:text-sm"
                                  >
                                    {withoutAuthUrl}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(withoutAuthUrl)}
                                    className="mt-2.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 sm:text-sm"
                                  >
                                    Copy
                                  </button>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[11px] font-semibold text-slate-500">
                                    With Authorization URL
                                  </p>
                                  <a
                                    href={withAuthUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block break-all text-xs text-blue-600 underline sm:text-sm"
                                  >
                                    {withAuthUrl}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(withAuthUrl)}
                                    className="mt-2.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 sm:text-sm"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[11px] font-semibold text-slate-500">Added By</p>
                                  <p className="mt-1 break-words text-xs text-slate-800 sm:text-sm">
                                    Type: {finalType}
                                  </p>
                                  <p className="mt-1 break-words text-xs text-slate-800 sm:text-sm">
                                    Campaign Type: {finalCampaignType}
                                  </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[11px] font-semibold text-slate-500">Created</p>
                                  <p className="mt-1 text-xs text-slate-800 sm:text-sm">
                                    {formatReadableDate(item.createdAt)}
                                  </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[11px] font-semibold text-slate-500">Updated</p>
                                  <p className="mt-1 text-xs text-slate-800 sm:text-sm">
                                    {formatReadableDate(item.updatedAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(item)}
                                  className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-blue-700 sm:text-sm"
                                >
                                  Update
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenWithoutAuth(item)}
                                  className="rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-violet-700 sm:text-sm"
                                >
                                  Open
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(item)}
                                  disabled={isStatusLoading}
                                  className={`rounded-lg px-3.5 py-2 text-xs font-medium text-white transition sm:text-sm ${
                                    isActive
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-emerald-600 hover:bg-emerald-700"
                                  } ${isStatusLoading ? "cursor-not-allowed opacity-70" : ""}`}
                                >
                                  {isStatusLoading
                                    ? "Updating..."
                                    : isActive
                                    ? "Inactive"
                                    : "Active"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedBlogsList;