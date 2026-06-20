import React from "react";
import { Tabs } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { COLOR_BORDER } from "./constants";
import SingleClientCampaign from "./SingleClientCampaign";
import BulkClientCampaign from "./BulkClientCampaign";

const CampaignPanel: React.FC = () => {
  const tabItems = [
    {
      key: "single",
      label: <span><UserOutlined /> Single Client</span>,
      children: <SingleClientCampaign />,
    },
    {
      key: "bulk",
      label: <span><TeamOutlined /> Bulk Upload</span>,
      children: <BulkClientCampaign />,
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${COLOR_BORDER}`,
        borderRadius: 14,
        padding: "24px",
      }}
    >
      <Tabs className="ec-campaign-tabs" defaultActiveKey="single" items={tabItems} />
    </div>
  );
};

export default CampaignPanel;
