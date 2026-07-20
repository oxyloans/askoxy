import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { checkUserInterest } from "./servicesapi";
import LenderEngagementWorkspace, {
  TestimonialVideo,
} from "./LenderEngagementWorkspace";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1FL0dQlXZEh4TY4wUYFfesk7FhXlGFR_s9yAIxEbNVq8/gviz/tq?tqx=out:json";

const ACCESS_KEY = "leagueJourneyAccess";
const SOURCE_ROUTE_KEY = "lenderJourneySourceRoute";
const LIST_ROUTE = "/main/dashboard/services?tab=LEAGUE_JOURNEYS";
const ACCESS_VALIDITY_MS = 12 * 60 * 60 * 1000;

interface LeagueJourneyAccess {
  campaignId: string;
  campaignType: string;
  addServiceType: "LEAGUEJOURNEYS";
  openedAt: number;
}

interface RouteState {
  leagueJourneyAccess?: LeagueJourneyAccess;
  from?: string;
}

const readStoredAccess = (): LeagueJourneyAccess | null => {
  try {
    const value = sessionStorage.getItem(ACCESS_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<LeagueJourneyAccess>;

    if (
      !parsed.campaignId ||
      !parsed.campaignType ||
      parsed.addServiceType !== "LEAGUEJOURNEYS" ||
      typeof parsed.openedAt !== "number" ||
      Date.now() - parsed.openedAt > ACCESS_VALIDITY_MS
    ) {
      sessionStorage.removeItem(ACCESS_KEY);
      return null;
    }

    return parsed as LeagueJourneyAccess;
  } catch {
    sessionStorage.removeItem(ACCESS_KEY);
    return null;
  }
};

const normalizeVideoUrl = (value: string): string =>
  value
    .trim()
    .replace(
      "https://askoxy.s3.ap-south-1.amazonaws.com",
      "https://d15sy6qj2uhi5q.cloudfront.net",
    );

const parseVideos = (text: string): TestimonialVideo[] => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) return [];

    const data = JSON.parse(text.slice(start, end + 1));
    const rows = Array.isArray(data?.table?.rows) ? data.table.rows : [];
    const unique = new Set<string>();

    return rows
      .map((row: any, index: number) => {
        const sheetName = String(row?.c?.[0]?.v || "").trim();
        const videoUrl = normalizeVideoUrl(String(row?.c?.[1]?.v || ""));

        if (
          !videoUrl ||
          sheetName.toLowerCase() === "documentname" ||
          unique.has(videoUrl)
        ) {
          return null;
        }

        unique.add(videoUrl);
        const storyNumber = String(index + 1).padStart(2, "0");

        return {
          id: `testimonial-${index + 1}`,
          title: `Lender Video #${storyNumber}`,
          customerName: sheetName || "OxyLoans Lender",
          designation: "Verified Lender",
          description:
            "A lender shares their experience with the OxyLoans digital lending journey, platform access and support.",
          videoUrl,
          projectType: "OXYLOANS" as const,
        };
      })
      .filter(Boolean) as TestimonialVideo[];
  } catch (error) {
    console.error("Unable to parse testimonial data:", error);
    return [];
  }
};

const LenderHomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state || {}) as RouteState;

  const access = useMemo<LeagueJourneyAccess | null>(() => {
    const routeAccess = routeState.leagueJourneyAccess;

    if (
      routeAccess?.campaignId &&
      routeAccess?.campaignType &&
      routeAccess.addServiceType === "LEAGUEJOURNEYS"
    ) {
      const refreshedAccess: LeagueJourneyAccess = {
        ...routeAccess,
        openedAt: Date.now(),
      };
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify(refreshedAccess));
      return refreshedAccess;
    }

    return readStoredAccess();
  }, [routeState.leagueJourneyAccess]);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);

  useEffect(() => {
    if (routeState.from) {
      sessionStorage.setItem(SOURCE_ROUTE_KEY, routeState.from);
    }
  }, [routeState.from]);

  const goBackToSource = (): void => {
    const sourceRoute =
      routeState.from || sessionStorage.getItem(SOURCE_ROUTE_KEY) || LIST_ROUTE;
    navigate(sourceRoute, { replace: true });
  };

  useEffect(() => {
    const validate = async (): Promise<void> => {
      if (!access) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      const userId =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId") ||
        "";

      if (!userId) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      try {
        const result = await checkUserInterest(userId, access.campaignType);
        setAllowed(Boolean(result?.exists));
      } catch (error) {
        console.error("Unable to validate League Journey access:", error);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    void validate();
  }, [access]);

  useEffect(() => {
    if (!allowed) return;
    const controller = new AbortController();

    const loadVideos = async (): Promise<void> => {
      try {
        const response = await fetch(GOOGLE_SHEET_URL, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Unable to load testimonials: ${response.status}`);
        }
        setVideos(parseVideos(await response.text()));
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") {
          console.error("Unable to load testimonials:", error);
          setVideos([]);
        }
      }
    };

    void loadVideos();
    return () => controller.abort();
  }, [allowed]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8fb]">
        <div className="rounded-2xl border border-[#d7e5ee] bg-white p-6 shadow-xl">
          <Loader2 className="h-9 w-9 animate-spin text-[#008cba]" />
        </div>
      </div>
    );
  }

  if (!access || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8fb] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#d7e5ee] bg-white p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-[#102a43]">Submit interest first</h1>
          <p className="mt-3 text-sm leading-6 text-[#607d8b]">
            This lender journey becomes available after successful participation
            in the selected League Journey campaign.
          </p>
          <button
            type="button"
            onClick={goBackToSource}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#008cba] px-5 text-sm font-black text-white transition hover:bg-[#007aa3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <LenderEngagementWorkspace
      videos={videos}
      campaignTitle={access.campaignType}
      onBack={goBackToSource}
    />
  );
};

export default LenderHomePage;