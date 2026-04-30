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
    }, 1500);

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
        background: "linear-gradient(135deg, #fff8e1, #ffffff)",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "5px solid #f3e7bd",
          borderTop: "5px solid #d4af37",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <h2
        style={{
          marginTop: 24,
          fontSize: 22,
          fontWeight: 700,
          color: "#2b1800",
        }}
      >
        Redirecting to our Dedicated Platform...
      </h2>

      <p
        style={{
          marginTop: 10,
          color: "#7a6a45",
          fontSize: 15,
        }}
      >
        Please wait while we securely take you there.
      </p>

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