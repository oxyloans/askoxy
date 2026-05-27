import React, { useEffect } from "react";

const platformLinks: Record<string, string> = {
  oxyloans: "https://oxyloans.com/",
  oxygold: "https://www.oxygold.ai/",
  oxybricks: "https://www.oxybricks.world/",
};

export default function PlatformRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("target") || "";

    const storedUrl =
      sessionStorage.getItem("platformRedirectUrl") ||
      localStorage.getItem("platformRedirectUrl");

    const finalUrl = storedUrl || platformLinks[target] || "/";

    const timer = setTimeout(() => {
      sessionStorage.removeItem("redirectPath");
      sessionStorage.removeItem("platformRedirectUrl");
      localStorage.removeItem("platformRedirectUrl");

      if (finalUrl.startsWith("http")) {
        window.location.href = finalUrl;
      } else {
        window.location.href = "/";
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f4efff] via-white to-[#ece5ff] px-6">
      <div className="relative text-center">
        <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B35C7]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto h-[90px] w-[90px] rounded-full border-[6px] border-[#e9dcff] border-t-[#6B35C7] shadow-[0_10px_35px_rgba(107,53,199,0.18)] animate-spin" />

          <h1 className="mt-10 text-[28px] font-extrabold tracking-[-0.03em] text-[#2f1758] sm:text-[36px]">
            Redirecting to Dedicated Platform
          </h1>

          <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-[1.7] text-[#6d5f8d] sm:text-[16px]">
            Please wait while we securely connect you to the selected platform.
          </p>
        </div>
      </div>
    </div>
  );
}