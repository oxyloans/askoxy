import React from "react";
import { Card, Space, Tabs, Typography, Grid } from "antd";
import { MailOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import {
  cardStyle,
  COLOR_BORDER,
  COLOR_PRIMARY,
  COLOR_TEXT,
  SECTION_META,
} from "./constants";
import SingleClientCampaign from "./SingleClientCampaign";
import BulkClientCampaign from "./BulkClientCampaign";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const CampaignPanel: React.FC = () => {
  const screens = useBreakpoint();

  const tabItems = [
    {
      key: "single",
      label: (
        <span>
          <UserOutlined /> Single Client
        </span>
      ),
      children: <SingleClientCampaign />,
    },
    {
      key: "bulk",
      label: (
        <span>
          <TeamOutlined /> Bulk Upload
        </span>
      ),
      children: <BulkClientCampaign />,
    },
  ];

  return (
    <Card
      className="ec-pro-card"
      title={
        <Space>
          <MailOutlined style={{ color: COLOR_PRIMARY }} />
          <Text strong style={{ fontSize: 16, color: COLOR_TEXT }}>
            {SECTION_META.campaign.cardTitle}
          </Text>
        </Space>
      }
      style={cardStyle}
      styles={{
        header: {
          background: "#ffffff",
          borderBottom: `1px solid ${COLOR_BORDER}`,
          minHeight: 58,
        },
        body: { padding: screens.xs ? 16 : 24 },
      }}
    >
      <Tabs
        className="ec-campaign-tabs"
        defaultActiveKey="single"
        items={tabItems}
      />
    </Card>
  );
};

export default CampaignPanel;
