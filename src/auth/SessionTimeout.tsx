import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SessionTimeout({
  idleMs = 15 * 60 * 1000,
  warnMs = 60 * 1000,
  isAuthenticated = false,
}: {
  idleMs?: number;
  warnMs?: number;
  isAuthenticated?: boolean;
}) {
  const navigate = useNavigate();
  const [showWarn, setShowWarn] = useState(false);
  const [warnLeft, setWarnLeft] = useState(Math.floor(warnMs / 1000));

  const idleTimer = useRef<number | null>(null);
  const warnTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (warnTimer.current) window.clearTimeout(warnTimer.current);
    if (tickTimer.current) window.clearInterval(tickTimer.current);
    idleTimer.current = warnTimer.current = tickTimer.current = null;
  };

  const handleLogout = useCallback(() => {
    clearTimers();
    setShowWarn(false);

    // clear tokens
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");

    // redirect to last entry point
    const lastEntry = localStorage.getItem("entryPoint") || "/";
    Swal.fire({
      icon: "info",
      title: "Session Expired",
      text: "You’ve been signed out due to inactivity.",
      confirmButtonText: "Go to Home",
      confirmButtonColor: "#6D28D9",
      background: "#fff",
    }).then(() => {
      navigate(lastEntry, { replace: true });
    });
  }, [navigate]);

  const startIdleTimer = useCallback(() => {
    if (!isAuthenticated) return;
    clearTimers();
    idleTimer.current = window.setTimeout(() => {
      setWarnLeft(Math.floor(warnMs / 1000));
      setShowWarn(true);

      tickTimer.current = window.setInterval(() => {
        setWarnLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);

      warnTimer.current = window.setTimeout(() => {
        handleLogout();
      }, warnMs);

      Swal.fire({
        title: "Stay signed in?",
        html: `
          <p style="font-size:15px;color:#444;">
            You’ve been inactive for a while.<br/>
            Click <b>Yes</b> to stay signed in.<br/>
            Otherwise, you’ll be logged out in <b>${Math.floor(
              warnMs / 1000
            )} seconds</b>.
          </p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Keep me signed in",
        cancelButtonText: "No, Log me out",
        confirmButtonColor: "#6D28D9",
        cancelButtonColor: "#d33",
        background: "#fff",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          resetAll();
        } else {
          handleLogout();
        }
      });
    }, Math.max(0, idleMs - warnMs));
  }, [idleMs, warnMs, isAuthenticated, handleLogout]);

  const resetAll = useCallback(() => {
    setShowWarn(false);
    clearTimers();
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      setShowWarn(false);
      return;
    }
    startIdleTimer();

    const bump = () => {
      if (showWarn) return;
      startIdleTimer();
    };

    const listeners: Array<[keyof DocumentEventMap, EventListener]> = [
      ["mousemove", bump],
      ["mousedown", bump],
      ["keydown", bump],
      ["scroll", bump],
      ["touchstart", bump],
      [
        "visibilitychange",
        () => {
          if (!document.hidden) bump();
        },
      ],
    ];

    listeners.forEach(([evt, fn]) =>
      document.addEventListener(evt, fn, { passive: true })
    );

    return () => {
      clearTimers();
      listeners.forEach(([evt, fn]) => document.removeEventListener(evt, fn));
    };
  }, [isAuthenticated, showWarn, startIdleTimer]);

  return null;
}
