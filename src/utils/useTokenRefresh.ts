import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { startTokenRefresh, stopTokenRefresh } from "./tokenRefresh";
import { getRefreshToken, getCustomerAccessToken } from "./cookieUtils";

export const useTokenRefresh = (): void => {
  const reduxToken = useAppSelector((state) => state.auth.accessToken);
  const isAuth = !!(reduxToken || getCustomerAccessToken());

  useEffect(() => {
    const refreshToken = getRefreshToken();

    if (!isAuth || !refreshToken) {
      stopTokenRefresh();
      return;
    }

    startTokenRefresh();

    return () => {
      stopTokenRefresh();
    };
  }, [isAuth]);
};