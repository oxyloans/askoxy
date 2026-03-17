import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { startTokenRefresh, stopTokenRefresh } from "./tokenRefresh";
import { getRefreshToken } from "./cookieUtils";

export const useTokenRefresh = (): void => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  console.log("useTokenRefresh - accessToken changed:", { accessToken: !!accessToken });

  useEffect(() => {
    if (accessToken && getRefreshToken()) {
      startTokenRefresh();
    } else {
      stopTokenRefresh();
    }

    return () => {
      stopTokenRefresh();
    };
  }, [accessToken]);
};
