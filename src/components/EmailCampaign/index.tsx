import React, { useState } from "react";
import type { SectionKey } from "./constants";
import EmailCampaignLayout from "./EmailCampaignLayout";
import CompanyUploadPanel from "./CompanyUploadPanel";
import CampaignPanel from "./CampaignPanel";

const EmailCampaign: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>("upload");

  return (
    <EmailCampaignLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === "upload" ? <CompanyUploadPanel /> : <CampaignPanel />}
    </EmailCampaignLayout>
  );
};

export default EmailCampaign;
