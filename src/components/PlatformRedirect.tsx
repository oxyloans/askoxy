import React, { useEffect } from "react";

const platformLinks: Record<string, string> = {
  oxyloans: "https://oxyloans.com/",
  oxygold: "https://www.oxygold.ai/",
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
    }, 1500); // ⏳ slightly smoother delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #eef6ff, #f8fafc)",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      {/* Loader */}
      <div
        style={{
          width: 60,
          height: 60,
          border: "5px solid #e2e8f0",
          borderTop: "5px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Main Heading */}
      <h2
        style={{
          marginTop: 24,
          fontSize: 24,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        Redirecting to our Dedicated Platform...
      </h2>

      {/* Sub text */}
      <p
        style={{
          marginTop: 10,
          color: "#64748b",
          fontSize: 15,
        }}
      >
        Please wait while we securely take you there 🚀
      </p>

      {/* Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}