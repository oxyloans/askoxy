// src/AskoxyAdmin/hiringpages.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { fetchCampaigns, Campaign } from "../components/servicesapi";

const HiringPages: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      .slice(0, 30);

  // Normalize input-type key (API sometimes sends "campainInputType" vs "campaignInputType")
  const getInputType = (c: Campaign & { campainInputType?: string; campaignInputType?: string }) =>
    c?.campainInputType ?? c?.campaignInputType ?? "";

const handleCampaignClick = (
  campaign: Campaign & { campainInputType?: string; campaignInputType?: string }
) => {
  if (!campaign?.campaignId || !campaign?.campaignType) return;

  const inputType = getInputType(campaign);
  const slug = slugify(campaign.campaignType);
  const shortId = campaign.campaignId.slice(-4);

  // Determine target path
  let targetPath = "";
  if (inputType === "SERVICE" || inputType === "PRODUCT") {
    targetPath = `${base}/services/${shortId}/${slug}`;
  } else if (inputType === "BLOG") {
    targetPath = `${base}/blog/${shortId}/${slug}`;
  } else if (inputType === "CATEGORY") {
    targetPath = `${base}/categories/${shortId}/${slug}`;
  }

  if (!targetPath) return;

  // ✅ If not logged in, store redirect path and go to login
  if (!accessToken) {
    localStorage.setItem("redirectAfterLogin", targetPath);
    navigate("/login"); // change if your login route differs
    return;
  }

  // ✅ If logged in, go directly
  navigate(targetPath);
};


  const getPrimaryImageUrl = (c: any) => {
    const imgs = c?.imageUrls as Array<{ imageUrl?: string; status?: boolean }> | undefined;
    if (!imgs || imgs.length === 0) return undefined;
    const active = imgs.find((i) => i?.status && i?.imageUrl);
    return (active?.imageUrl || imgs[0]?.imageUrl) ?? undefined;
  };

  // ---------- NEW: filter by addServiceType === "WEAREHIRING" ----------
  const weAreHiringCampaigns = useMemo(() => {
    return (campaigns || [])
      .filter((c: any) => {
        const inputType = getInputType(c);
        const notBlog = inputType !== "BLOG";
        const active = c?.campaignStatus !== false; // accept true/undefined/"ACTIVE"
        const isHiring = c?.addServiceType === "WEAREHIRING";
        return isHiring && notBlog && active;
      })
      // Optional: sort newest first if createdAt exists
      .sort((a: any, b: any) => {
        const ta = new Date(a?.createdAt || 0).getTime();
        const tb = new Date(b?.createdAt || 0).getTime();
        return tb - ta;
      });
  }, [campaigns]);

  return (
    <div className="min-h-screen">
      {/* Back */}
      <div className="flex items-start px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-purple-700 hover:shadow-md transition-all duration-200"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 mx-4 lg:mx-8">
        <div className="p-3 lg:p-4">
          <h1 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            We Are Hiring
          </h1>

          {loading ? (
            <div className="w-full py-16 text-center text-gray-500">Loading…</div>
          ) : weAreHiringCampaigns.length === 0 ? (
            <div className="w-full py-16 text-center text-gray-500">No active campaigns.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
              {weAreHiringCampaigns.map((c: any) => {
                const img = getPrimaryImageUrl(c);
                return (
                  <div
                    key={c.campaignId}
                    className="w-full max-w-[22rem] bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleCampaignClick(c)}
                  >
                    <div className="p-4 flex flex-col items-center">
                      {img ? (
                        <img
                          src={img}
                          alt={c.campaignType}
                          className="w-80 h-48 object-contain border border-gray-200 rounded-lg"
                        />
                      ) : (
                        <div className="w-80 h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                          No Image
                        </div>
                      )}
                      <h3 className="mt-3 text-center text-base font-semibold text-gray-900 line-clamp-2">
                        {c.campaignType}
                      </h3>
                     
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringPages;