import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Spin,
  Alert,
  Tag,
  Button,
  Modal,
  DatePicker,
  List,
  Collapse,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin

dayjs.extend(utc); // Enable UTC plugin

// Define the type for a help desk user
interface HelpDeskUser {
  mail: string;
  userId: string;
  createdAt: string;
  emailVerified: string;
  name: string;
  lastFourDigitsUserId: string;
}

interface ReportResponse {
  totalCount: string;
  dayCount: string;
  response: {
    userId: string;
    helpAdminUserId: string;
    comments: string;
    createdDate: string;
    caller: string;
  }[];
}

// Interface for the data source including the key property
interface TableUser extends HelpDeskUser {
  key: string;
}

const { Header, Content } = Layout;
const { Title } = Typography;

const HelpDeskUsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<HelpDeskUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/user-service/getAllHelpDeskUsers`
        );
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch help desk users. Please try again later.");
        console.error("Error fetching help desk users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchReportData = async (userId: string, date: Dayjs | null) => {
    setReportLoading(true);
    try {
      const formattedDate = date
        ? date.format("YYYY-MM-DD") + "T00:00:00.000Z"
        : dayjs().format("YYYY-MM-DD") + "T00:00:00.000Z";
      const response = await axios.post(
        `${BASE_URL}/user-service/getCallersCallingDataAndCount`,
        {
          helpAdminUserId: userId,
          specificDate: formattedDate,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData({ totalCount: "0", dayCount: "0", response: [] });
    } finally {
      setReportLoading(false);
    }
  };

  const handleReportClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
    fetchReportData(userId, selectedDate);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
    setReportData(null);
    setSelectedDate(dayjs());
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
    setReportData(null);
    setSelectedDate(dayjs());
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleGetData = () => {
    if (selectedUserId) {
      fetchReportData(selectedUserId, selectedDate);
    }
  };

  // Format the createdAt date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Table columns configuration for the main table
  const columns: ColumnsType<TableUser> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: TableUser, b: TableUser) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: "#2c3e50" }}>
          {text.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "User ID",
      dataIndex: "lastFourDigitsUserId",
      key: "lastFourDigitsUserId",
      render: (text: string) => (
        <Tag
          color="blue"
          style={{ fontWeight: 500, width: "100%", textAlign: "center" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: TableUser, b: TableUser) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (text: string) => formatDate(text),
    },
    {
      title: "Report",
      key: "report",
      render: (_: any, record: TableUser) => (
        <Button
          type="link"
          className="text-blue-500"
          onClick={() => handleReportClick(record.userId)}
        >
          Report
        </Button>
      ),
    },
  ];

  // Get the most recent registration
  const getLatestRegistration = () => {
    if (users.length === 0) return "N/A";

    const sortedUsers = [...users].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return formatDate(sortedUsers[0].createdAt);
  };

  // Prepare data source with keys for the table
  const dataSource: TableUser[] = users.map((user) => ({
    ...user,
    key: user.userId,
  }));

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading help desk users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            float: "left",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            HelpDesk Team
          </Title>
        </div>
      </Header>
      <Content
        style={{
          padding: "24px",
          background: "#f0f2f5",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Stats cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={users.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Verified Users"
                  value={
                    users.filter((user) => user.emailVerified === "true").length
                  }
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Latest Registration"
                  value={getLatestRegistration()}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ fontSize: "16px" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Users table */}
          <Card title="Help Desk Team Members" bordered={false}>
            <Table<TableUser>
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              rowClassName={(record) =>
                record.emailVerified === "true" ? "" : "ant-table-row-error"
              }
            />
          </Card>
        </Space>
      </Content>
      <Modal
        title="Call Report"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block mb-1">Select Date:</label>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                className="w-[200px]"
                format="YYYY-MM-DD"
              />
            </div>
            <Button
              type="primary"
              className="bg-[rgb(0,140,186)] w-[90px] text-white mt-6"
              onClick={handleGetData}
              loading={reportLoading}
            >
              Get Data
            </Button>
          </div>
          {reportLoading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : (
            reportData && (
              <div className="mt-4">
                <Row gutter={[16, 16]} className="mb-4">
                  <Col xs={12}>
                    <Card>
                      <Statistic
                        title="Total Count"
                        value={reportData.totalCount}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card>
                      <Statistic
                        title="Day Count"
                        value={reportData.dayCount}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                </Row>
                <div className="flex flex-col gap-3">
                  {reportData.response.length > 0 ? (
                    reportData.response.map((item, index) => (
                      <Card key={index} className="p-0">
                        {/* Header with gray background */}
                        <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-t-md border-b">
                          <span className="text-sm text-gray-700">
                            {formatDate(item.createdDate)}
                          </span>
                          <Tag color="blue">{item.caller}</Tag>
                        </div>
                        {/* Comment section */}
                        <div className="p-4">
                          <span className="font-semibold">Comments: </span>
                          {item.comments}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No call data available for the selected date
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default HelpDeskUsersDashboard;
