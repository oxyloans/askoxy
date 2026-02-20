import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/askoxylogonew.png";
import { message, Skeleton, Tag, Empty, Tooltip, Input, Select } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
const { Option } = Select;


const HiringPages: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [q, setQ] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | undefined>(undefined);
  const [expFilter, setExpFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const base = accessToken ? "/main" : "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchCampaigns();
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading campaigns:", e);
        message.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- helpers ---
  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

  const getInputType = (
    c: Campaign & { campainInputType?: string; campaignInputType?: string },
  ) => c?.campainInputType ?? c?.campaignInputType ?? "";

  const getPrimaryImageUrl = (c: any) => {
    const imgs = c?.imageUrls as
      | Array<{ imageUrl?: string; status?: boolean }>
      | undefined;
    if (!imgs || imgs.length === 0) return undefined;
    const active = imgs.find((i) => i?.status && i?.imageUrl);
    return (active?.imageUrl || imgs[0]?.imageUrl) ?? undefined;
  };

  const toText = (v: any) => (typeof v === "string" ? v : "");
  const normalizeSpaces = (s: string) => s.replace(/\s+/g, " ").trim();

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Extract fields from campaignDescription (best-effort)
  const extractLocation = (desc: string) => {
    const m =
      desc.match(/Location:\s*([^\n\r]+)/i) ||
      desc.match(/Location\s*-\s*([^\n\r]+)/i);
    return m?.[1]?.trim();
  };

  const extractExperience = (desc: string) => {
    const m =
      desc.match(/Experience:\s*([^\n\r]+)/i) ||
      desc.match(/Experience\s*-\s*([^\n\r]+)/i);
    return m?.[1]?.trim();
  };

  const extractEmploymentType = (desc: string) => {
    const m =
      desc.match(/Employment Type:\s*([^\n\r]+)/i) ||
      desc.match(/Employment\s*Type\s*-\s*([^\n\r]+)/i);
    return m?.[1]?.trim();
  };

  const extractCompanyName = (c: any, desc: string) => {
    const fromApi = toText(c?.companyName);
    if (fromApi) return normalizeSpaces(fromApi);

    const m = desc.match(/About the Company[\s\S]*?\n\s*([^\n\r]{3,80})/i);
    if (m?.[1]) {
      const line = normalizeSpaces(m[1]);
      const short = line.replace(/\s+is\s+.*$/i, "").trim();
      return short.length >= 3 ? short : line;
    }
    return "Askoxy.AI";
  };

  const extractKeySkills = (desc: string) => {
    const idx = desc.toLowerCase().indexOf("key skills");
    if (idx === -1) return [];

    const after = desc.slice(idx);
    const stopIdx = after.toLowerCase().indexOf("disclaimer");
    const section = stopIdx >= 0 ? after.slice(0, stopIdx) : after;

    const lines = section
      .split(/\r?\n/)
      .map((l) => normalizeSpaces(l))
      .filter(Boolean);

    const cleaned = lines.filter(
      (l) =>
        !/^key skills$/i.test(l) &&
        !/key skills/i.test(l.replace(/[^a-z\s]/gi, "").trim()),
    );

    const skills = cleaned
      .map((l) => l.replace(/^[-•\u2022]+\s*/g, "").trim())
      .filter((l) => l.length > 1)
      .filter(
        (l) =>
          !/role details/i.test(l) &&
          !/qualifications/i.test(l) &&
          !/required candidate profile/i.test(l),
      );

    const uniq: string[] = [];
    for (const s of skills) {
      const key = s.toLowerCase();
      if (!uniq.find((u) => u.toLowerCase() === key)) uniq.push(s);
      if (uniq.length >= 10) break;
    }
    return uniq;
  };

  const getTimeAgo = (ts: any) => {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0) return "";
    const now = Date.now();
    const diff = Math.max(0, now - n);

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diff < hour) {
      const mins = Math.max(1, Math.floor(diff / minute));
      return `${mins} min ago`;
    }
    if (diff < day) {
      const hrs = Math.floor(diff / hour);
      return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
    }
    if (diff < week) {
      const days = Math.floor(diff / day);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    const weeks = Math.floor(diff / week);
    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

    const months = Math.floor(diff / (30 * day));
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

    const years = Math.floor(diff / (365 * day));
    return `${years} year${years === 1 ? "" : "s"} ago`;
  };

  const getShortPreview = (desc: string) => {
    const plain = desc.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    if (!plain) return "—";
    return plain.length > 170 ? plain.slice(0, 170) + "…" : plain;
  };

  const goToCampaign = (
    campaign: Campaign & {
      campainInputType?: string;
      campaignInputType?: string;
    },
  ) => {
    if (!campaign?.campaignId || !campaign?.campaignType) return;

    const inputType = getInputType(campaign);
    const slug = slugify(campaign.campaignType);
    const shortId = campaign.campaignId.slice(-4);

    if (inputType === "SERVICE" || inputType === "PRODUCT") {
      navigate(`${base}/services/${shortId}/${slug}`);
      return;
    }
    if (inputType === "BLOG") {
      navigate(`${base}/blog/${shortId}/${slug}`);
      return;
    }
    if (inputType === "CATEGORY") {
      navigate(`${base}/categories/${shortId}/${slug}`);
      return;
    }

    // fallback (if any other type comes)
    navigate(`${base}`);
  };

  // ---------- filter ONLY WEAREHIRING + not blog ----------
  const weAreHiringCampaigns = useMemo(() => {
    return (campaigns || [])
      .filter((c: any) => {
        const inputType = getInputType(c);
        const notBlog = inputType !== "BLOG";
        const active = c?.campaignStatus !== false;
        const isHiring = c?.addServiceType === "WEAREHIRING";
        return isHiring && notBlog && active;
      })
      .sort((a: any, b: any) => {
        const ta = Number(a?.createdAt || 0);
        const tb = Number(b?.createdAt || 0);
        return tb - ta;
      });
  }, [campaigns]);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const locations = new Set<string>();
    const experiences = new Set<string>();
    const types = new Set<string>();

    weAreHiringCampaigns.forEach((c: any) => {
      const desc = toText(c?.campaignDescription);
      const loc = normalizeSpaces(extractLocation(desc) || "");
      const exp = normalizeSpaces(extractExperience(desc) || "");
      const typ = normalizeSpaces(extractEmploymentType(desc) || "");

      if (loc) locations.add(loc);
      if (exp) experiences.add(exp);
      if (typ) types.add(typ);
    });

    return {
      locations: Array.from(locations).sort(),
      experiences: Array.from(experiences).sort(),
      types: Array.from(types).sort(),
    };
  }, [weAreHiringCampaigns]);

  // Apply search + filters
  const visibleJobs = useMemo(() => {
    const query = q.trim().toLowerCase();

    return weAreHiringCampaigns.filter((c: any) => {
      const title = toText(c?.campaignType).toLowerCase();
      const desc = toText(c?.campaignDescription).toLowerCase();

      const loc = normalizeSpaces(
        extractLocation(toText(c?.campaignDescription)) || "",
      );
      const exp = normalizeSpaces(
        extractExperience(toText(c?.campaignDescription)) || "",
      );
      const typ = normalizeSpaces(
        extractEmploymentType(toText(c?.campaignDescription)) || "",
      );

      const matchesQuery =
        !query || title.includes(query) || desc.includes(query);
      const matchesLoc = !locationFilter || loc === locationFilter;
      const matchesExp = !expFilter || exp === expFilter;
      const matchesType = !typeFilter || typ === typeFilter;

      return matchesQuery && matchesLoc && matchesExp && matchesType;
    });
  }, [weAreHiringCampaigns, q, locationFilter, expFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Askoxy.ai - We Are Hiring
            </h1>
            <p className="text-gray-600 mt-1">
              Recent Jobs - Explore active openings and view full job details.
            </p>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
            style={{ gridAutoRows: "1fr" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 h-full"
              >
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <Empty description="No active jobs found for selected filters." />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch"
            style={{ gridAutoRows: "1fr" }}
          >
            {visibleJobs.map((c: any) => {
              const img = getPrimaryImageUrl(c);
              const desc = toText(c?.campaignDescription);

              const company = extractCompanyName(c, desc);
              const loc = extractLocation(desc);
              const exp = extractExperience(desc);
              const emp = extractEmploymentType(desc);

              const skills = extractKeySkills(desc);
              const ago = getTimeAgo(c?.createdAt);

              return (
                <div
                  key={c.campaignId}
                  onClick={() => goToCampaign(c)}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden h-full flex flex-col"
                >
                  {/* Inner wrapper to keep equal height */}
                  <div className="p-4 flex flex-col h-full">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      {/* Left: Logo */}
                      {img && (
                        <img
                          src={img}
                          alt="Company logo"
                          className="w-16 h-16 rounded-lg object-contain border border-gray-100 shrink-0"
                        />
                      )}

                      {/* Middle: Title and tags */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700">
                          {toTitleCase(c.campaignType)}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-purple-600 font-semibold truncate">
                            at {company}
                          </span>
                          {(() => {
                            const n = Number(c?.createdAt);
                            if (Number.isFinite(n) && n > 0) {
                              const diff = Date.now() - n;
                              const twoDays = 2 * 24 * 60 * 60 * 1000;
                              if (diff <= twoDays) {
                                return (
                                  <Tag color="green" className="m-0">
                                    Actively hiring
                                  </Tag>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                      </div>

                      {/* Right: Apply button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToCampaign(c);
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] transition shrink-0 h-fit"
                      >
                        Apply now
                      </button>
                    </div>

                    {/* Meta row */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {loc && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                          <EnvironmentOutlined />
                          <span className="truncate max-w-[180px]">{loc}</span>
                        </span>
                      )}
                      {exp && (
                        <span className="text-xs text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                          {exp}
                        </span>
                      )}
                      {emp && (
                        <span className="text-xs text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                          {emp}
                        </span>
                      )}
                    </div>

                    {/* Preview (fixed height by clamp) */}
                    <div className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {getShortPreview(desc)}
                    </div>

                    {/* Skills area (reserve space even if none) */}
                    <div className="mt-3 min-h-[40px]">
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-xs text-gray-700 bg-cyan-50 border border-cyan-100 px-2 py-1 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="text-xs text-gray-500 pt-1">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400"> </div>
                      )}
                    </div>

                    {/* Footer pinned at bottom */}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{ago || ""}</span>

                      <Tooltip title="View full job details">
                        <span className="text-xs font-semibold text-purple-700">
                          View Details →
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiringPages;
