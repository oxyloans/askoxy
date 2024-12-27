import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [currentCampaign, setCurrentCampaign] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle campaign selection and update the URL
  const handleCampaignClick = (campaignName: string) => {
    setCurrentCampaign(campaignName);
    navigate(`?campaign=${campaignName.replace(/\s+/g, "")}`); // Update the URL with a clean campaign name
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left Side - Campaigns */}
      <div style={{ width: "30%", borderRight: "1px solid #ddd" }}>
        <h3>Campaigns</h3>
        <div
          onClick={() => handleCampaignClick("Campaign A")}
          style={{ cursor: "pointer" }}
        >
          <h4>Campaign A</h4>
          <p>Description of Campaign A</p>
        </div>
        <div
          onClick={() => handleCampaignClick("Campaign B")}
          style={{ cursor: "pointer" }}
        >
          <h4>Campaign B</h4>
          <p>Description of Campaign B</p>
        </div>
        <div
          onClick={() => handleCampaignClick("Campaign C")}
          style={{ cursor: "pointer" }}
        >
          <h4>Campaign C</h4>
          <p>Description of Campaign C</p>
        </div>
      </div>

      {/* Right Side - Chat/History */}
      <div style={{ width: "70%", padding: "10px" }}>
        <h3>Chat History</h3>
        {currentCampaign ? (
          <p>Now viewing: {currentCampaign}</p>
        ) : (
          <p>Select a campaign to view details.</p>
        )}
        <p>Current URL: {location.pathname + location.search}</p>
      </div>
    </div>
  );
};

export default Dashboard;
