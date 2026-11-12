import React from "react";
import JobViewPage from "./JobsViewPage";

const AskOxyJobsPage: React.FC = () => {
  return <JobViewPage forcedCompany="ASKOXY_AI" isAskOxyPage={true} />;
};

export default AskOxyJobsPage;

