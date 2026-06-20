import React from "react";
import EmailCampaignLayout from "./EmailCampaignLayout";
import CompanyUploadPanel from "./CompanyUploadPanel";
import CampaignPanel from "./CampaignPanel";
import AllPdfsPage from "./AllPdfsPage";
import AllCampaignsPage from "./AllCampaignsPage";
import CampaignScorecard from "./CampaignScorecard";
import CampaignConversations from "./CampaignConversations";

const wrap = (Page: React.FC) => () => (
  <EmailCampaignLayout>
    <Page />
  </EmailCampaignLayout>
);

export const UploadPage        = wrap(CompanyUploadPanel);
export const SendCampaignPage  = wrap(CampaignPanel);
export const AllDocumentsPage  = wrap(AllPdfsPage);
export const AllCampaignsRoute = wrap(AllCampaignsPage);
export const ScorecardPage     = wrap(CampaignScorecard);
export const ConversationsPage = wrap(CampaignConversations);

// default export redirects to /email-campaign/upload
export { default } from "./EmailCampaignLayout";
