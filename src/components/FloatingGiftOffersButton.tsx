import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { getActiveCombos } from "../ChatScreen/agentApi";
import "./FloatingGiftOffersButton.css";

/** Auth / registration — no offers pill */
const AUTH_ROUTE_PREFIXES = [
  "/userlogin",
  "/whatsapplogin",
  "/whatsappregister",
  "/userregister",
  "/partnerlogin",
  "/employee-login",
  "/employee-register",
  "/adminregister",
  "/login-admin",
  "/admin",
];

function isAuthRoute(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return AUTH_ROUTE_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(`${prefix}/`),
  );
}

/**
 * Offers are for the logged-in shopper app under /main only.
 * Hides on landing (/), login, marketing landings, and /main/agent-offers.
 */
function shouldShowOffersIcon(pathname: string): boolean {
  const p = pathname.toLowerCase();
  if (p.includes("/agent-offers")) return false;
  if (isAuthRoute(p)) return false;
  // Only after entering the main app shell (not root landing or public pages)
  return p === "/main" || p.startsWith("/main/");
}

/**
 * Floating gift button (mirrors phone call pill on the right).
 * Sits above the green phone button; opens /main/agent-offers.
 */
const FloatingGiftOffersButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offerCount, setOfferCount] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (
      !userId ||
      !shouldShowOffersIcon(location.pathname)
    ) {
      setOfferCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const combos = await getActiveCombos(userId);
        if (!cancelled) {
          setOfferCount(Array.isArray(combos) ? combos.length : 0);
        }
      } catch {
        if (!cancelled) {
          setOfferCount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, location.pathname]);

  if (!userId || !shouldShowOffersIcon(location.pathname)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/main/agent-offers")}
      aria-label="View your combo offers"
      title="Your exclusive offers — tap to open"
      className="floating-gift-offers-btn"
    >
      <span className="floating-gift-offers-btn__icon-wrap">
        <Gift className="floating-gift-offers-btn__icon" strokeWidth={2.4} />
        {offerCount > 0 && (
          <span className="floating-gift-offers-btn__badge">
            {offerCount > 9 ? "9+" : offerCount}
          </span>
        )}
      </span>
      <span className="floating-gift-offers-btn__label">Offers</span>
    </button>
  );
};

export default FloatingGiftOffersButton;
