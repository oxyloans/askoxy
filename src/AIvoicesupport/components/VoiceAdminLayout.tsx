import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  VoiceAdminSidebar,
  VoiceAdminMobileNav,
  VoiceAdminNavKey,
} from "./VoiceAdminSidebar";
import {
  getAdminAccessToken,
  getAdminRefreshToken,
} from "../../utils/cookieUtils";

const VALID_PRIMARY_TYPE = "HELPDESKSUPERADMIN";

interface VoiceAdminLayoutProps {
  activeKey: VoiceAdminNavKey;
  children: React.ReactNode;
}

const VoiceAdminLayout: React.FC<VoiceAdminLayoutProps> = ({
  activeKey,
  children,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const primaryType = localStorage.getItem("voice_admin_primaryType");
    const acToken = getAdminAccessToken();
    const refreshToken = getAdminRefreshToken();

    if (primaryType !== VALID_PRIMARY_TYPE || !acToken || !refreshToken) {
      message.error({
        content: "You are not authorised to use this application",
        className: "custom-message-error",
      });
      navigate("/voiceadmin");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex bg-[#f4f5f7] overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <VoiceAdminSidebar activeKey={activeKey} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <VoiceAdminMobileNav activeKey={activeKey} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VoiceAdminLayout;
