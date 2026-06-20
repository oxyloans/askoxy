import React, { useEffect, useRef, useState } from "react";
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

  const [pos, setPos] = useState<{ top: number }>({ top: 38 });
  const dragRef = useRef<{ dragging: boolean; startY: number; startTop: number }>({ dragging: false, startY: 0, startTop: 38 });

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.dragging) return;
      const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const delta = clientY - dragRef.current.startY;
      const newTop = Math.min(90, Math.max(10, dragRef.current.startTop + (delta / window.innerHeight) * 100));
      setPos({ top: newTop });
    };
    const onUp = () => { dragRef.current.dragging = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = "touches" in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    dragRef.current = { dragging: true, startY: clientY, startTop: pos.top };
  };

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
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      aria-label="View your combo offers"
      title="Your exclusive offers — tap to open"
      className="floating-gift-offers-btn"
      style={{ top: `${pos.top}%`, transform: "translateY(-50%)", cursor: "grab" }}
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
