import React, { useCallback, useEffect, useState } from "react";
import { FaExternalLinkAlt, FaHandHoldingUsd } from "react-icons/fa";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
const OXYLOANS_CLICK_URL =
  `${BASE_URL}/user-service/integration/oxyloans/click`;

type ClickResponse = {
  data?: {
    redirectUrl?: string;
    trackingId?: string;
  };
  message?: string;
  success?: boolean;
};

const getBrowser = () => {
  const userAgent = navigator.userAgent;
  const match = userAgent.match(/(Edg|Chrome|Firefox|Version)\/(\d+)/);
  if (!match) return navigator.appName || "Unknown browser";

  const names: Record<string, string> = {
    Edg: "Edge",
    Chrome: "Chrome",
    Firefox: "Firefox",
    Version: "Safari",
  };
  return `${names[match[1]] || match[1]} ${match[2]}`;
};

const getDevice = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || "Unknown platform";

  if (/Android/i.test(userAgent)) {
    const version = userAgent.match(/Android\s([\d.]+)/)?.[1];
    const model = userAgent.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build)?[;)]/)?.[1];
    return [`Android${version ? ` ${version}` : ""}`, model]
      .filter(Boolean)
      .join(" / ");
  }
  if (/iPhone|iPad|iPod/i.test(userAgent)) return `iOS / ${platform}`;
  return platform;
};

const getPublicIp = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) return "UNKNOWN";
    const body = (await response.json()) as { ip?: string };
    return body.ip || "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
};

const isAllowedRedirect = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (url.hostname === "oxyloans.com" || url.hostname.endsWith(".oxyloans.com"));
  } catch {
    return false;
  }
};

const OxyLoansRedirect: React.FC = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const continueToOxyLoans = useCallback(async () => {
    const askoxyUserId = localStorage.getItem("userId");
    if (!askoxyUserId) {
      setError("Your AskOxy user ID was not found. Please sign in again.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const ipAddress = await getPublicIp();
      const postBody = {
        askoxyUserId,
        browser: getBrowser(),
        device: getDevice(),
        ipAddress,
        role: "BORROWER",
      };

      const response = await customerApi.post(OXYLOANS_CLICK_URL, postBody, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      const result = response.data as ClickResponse;
      const redirectUrl = result.data?.redirectUrl;

      if (response.status < 200 || response.status >= 300 || !result.success || !redirectUrl) {
        throw new Error(result.message || "OxyLoans could not be opened right now.");
      }
      if (!isAllowedRedirect(redirectUrl)) {
        throw new Error("The OxyLoans service returned an invalid redirect URL.");
      }

      window.location.assign(redirectUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "OxyLoans could not be opened right now.",
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void continueToOxyLoans();
  }, [continueToOxyLoans]);

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <FaHandHoldingUsd size={30} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Opening OxyLoans</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {isLoading
            ? "Creating your secure borrower link. You will be redirected shortly."
            : "Continue to the OxyLoans borrower portal."}
        </p>

        {isLoading && (
          <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
        )}

        {error && (
          <div className="mt-6">
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void continueToOxyLoans()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Try again <FaExternalLinkAlt size={13} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default OxyLoansRedirect;
