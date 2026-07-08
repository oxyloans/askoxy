import React, { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { BUSINESS_CARD_THEME } from "./businessCardTheme";

interface BusinessCardThemeProviderProps {
  children: ReactNode;
}

const BusinessCardThemeProvider: React.FC<BusinessCardThemeProviderProps> = ({
  children,
}) => (
  <ConfigProvider theme={BUSINESS_CARD_THEME} componentSize="middle">
    {children}
  </ConfigProvider>
);

export default BusinessCardThemeProvider;
