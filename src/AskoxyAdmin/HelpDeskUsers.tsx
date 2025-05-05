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
  Divider,
  Empty,
  Tooltip,
  Select,
  Switch,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EyeOutlined,
  WhatsAppOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import dayjs, { Dayjs } from "dayjs";

interface HelpDeskUser {
  mail: string;
  userId: string;
  createdAt: string;
  emailVerified: string;
  name: string;
  lastFourDigitsUserId: string;
  testUserStatus: boolean;
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

interface UserData {
  userId: string;
  id: string;
  userType: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string | null;
  countryCode: string | null;
  whatsappVerified: boolean;
  mobileVerified: boolean;
  registeredFrom: string | null;
  ericeCustomerId: number;
  alterNativeMobileNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  longitude: string | null;
  latitude: string | null;
  pincode: string | null;
  flatNo: string | null;
  landMark: string | null;
  addressType: string | null;
  address: string | null;
  panNumber: string | null;
  lastFourDigitsUserId: string;
  userRegisterDate: number;
  userRegisterCreatedDate: string;
  aadharNumber: string | null;
  gender: string | null;
  assignCoins: string;
  mutliChainCreatedAt: string | null;
  multiChainAddress: string | null;
  assignedTo: string;
}

interface UserDetail {
  userId: string;
  userType: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string;
  countryCode: string;
  whatsappVerified: boolean;
  mobileVerified: boolean;
  registeredFrom: string;
  ericeCustomerId: string;
  alterNativeMobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  longitude: string;
  latitude: string;
  pincode: string;
  flatNo: string;
  landMark: string;
  addressType: string;
  address: string;
  panNumber: null | string;
  lastFourDigitsUserId: string;
  userRegisterDate: number;
  userRegisterCreatedDate: string;
  aadharNumber: null | string;
  gender: string;
  assignCoins: string;
  mutliChainCreatedAt: number;
  multiChainAddress: string;
  assignedTo: null | string;
}

interface TableUser extends HelpDeskUser {
  key: string;
}

interface UserDetailsLoadingState {
  [commentId: number]: boolean;
}

interface UserDetailsState {
  [commentId: number]: UserDetail | null;
}

interface UserDetailsVisibilityState {
  [commentId: number]: boolean;
}

const { Header, Content } = Layout;
const { Title } = Typography;

const HelpDeskUsers: React.FC = () => {
  const [selectedCaller, setSelectedCaller] = useState<string>("All");
  const [users, setUsers] = useState<HelpDeskUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] =
    useState<UserDetailsLoadingState>({});
  const [userDetailsData, setUserDetailsData] = useState<UserDetailsState>({});
  const [userDetailsVisible, setUserDetailsVisible] =
    useState<UserDetailsVisibilityState>({});
  const [assignUserData, setAssignUserData] = useState([]);
  const [assignUserModalVisible, setAssignUserModalVisible] = useState(false);
  const [assignUserPage, setAssignUserPage] = useState(1);
  const [assignUserTotal, setAssignUserTotal] = useState(0);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignUserLoading, setAssignUserLoading] = useState(false);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Reset user details data when reportData changes
    setUserDetailsData({});
    setUserDetailsVisible({});
  }, [reportData]);

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

  const fetchUserDetails = async (userId: string, commentIndex: number) => {
    setUserDetailsLoading((prev) => ({ ...prev, [commentIndex]: true }));
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
        {
          userId: userId,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.activeUsersResponse &&
        response.data.activeUsersResponse.length > 0
      ) {
        setUserDetailsData((prev) => ({
          ...prev,
          [commentIndex]: response.data.activeUsersResponse[0],
        }));
      } else {
        setUserDetailsData((prev) => ({ ...prev, [commentIndex]: null }));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetailsData((prev) => ({ ...prev, [commentIndex]: null }));
    } finally {
      setUserDetailsLoading((prev) => ({ ...prev, [commentIndex]: false }));
    }
  };

  const handleViewUserDetails = (userId: string, commentIndex: number) => {
    // If we already have the data, just toggle visibility
    if (userDetailsData[commentIndex]) {
      setUserDetailsVisible((prev) => ({
        ...prev,
        [commentIndex]: !prev[commentIndex],
      }));
    } else {
      // Otherwise fetch the data and set visibility to true
      fetchUserDetails(userId, commentIndex);
      setUserDetailsVisible((prev) => ({
        ...prev,
        [commentIndex]: true,
      }));
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
    setUserDetailsData({});
    setUserDetailsVisible({});
    setSelectedDate(dayjs());
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
    setReportData(null);
    setUserDetailsData({});
    setUserDetailsVisible({});
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

  const handleAssignUsers = async (userId: string, pageNo = 1) => {
    setAssignUserId(userId);
    setAssignUserModalVisible(true);
    setAssignUserLoading(true);
    try {
      setAssignUserId(userId);
      const response = await axios.post(
        `${BASE_URL}/user-service/assigned-users/${userId}`,
        {
          pageNo,
          pageSize: 10,
        }
      );

      const result = response?.data;

      setAssignUserData(
        Array.isArray(result?.activeUsersResponse)
          ? result.activeUsersResponse
          : []
      );
      setAssignUserTotal(result?.totalCount || 0);
      setAssignUserPage(pageNo);
      setAssignUserModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch assigned users", error);
      setAssignUserData([]);
    } finally {
      setAssignUserLoading(false);
    }
  };

  const handleAssignUserPageChange = (page: number) => {
    if (assignUserId) {
      handleAssignUsers(assignUserId, page);
    }
  };

  const handleToggleTestUser = async (record: HelpDeskUser) => {
    setLoading(true);
    const payload = {
      id: record.userId,
      testUser: !record.testUserStatus,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/user-service/updateTestUsers`,
        payload
      );

      if (response.status === 200) {
        message.success("User status updated successfully");
        setLoading(false);
        fetchUsers();
      } else {
        message.error("Failed to update user status");
      }
    } catch (error) {
      message.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<TableUser> = [
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
      title: "User Status",
      dataIndex: "testUserStatus",
      key: "testUserStatus",
      render: (status: boolean, record: HelpDeskUser) => (
        <Switch
          checked={!status}
          onChange={() => handleToggleTestUser(record)}
          checkedChildren="Active"
          unCheckedChildren="Leave"
          className={!status ? "bg-green-500" : "bg-red-500"}
        />
      ),
    },

    {
      title: "Assigned Users",
      key: "assignedUsers",
      render: (_: any, record: TableUser) => (
        <Button
          size="small"
          className="border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 font-medium rounded px-1.5 py-0.5 text-sm transition-all duration-200"
          onClick={() => handleAssignUsers(record.userId)}
        >
          Assigned Users
        </Button>
      ),
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

  const assignedUserColumns: ColumnsType<UserData> = [
    {
      title: "User ID",
      dataIndex: "lastFourDigitsUserId",
      key: "lastFourDigitsUserId",
      width: 50,
      render: (text: string) => (
        <Tag color="blue" className="font-normal text-sm">
          {text}
        </Tag>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 90,
      render: (_: string, record: UserData) => {
        const mobile = record.mobileNumber;
        const whatsapp = record.whastappNumber;
        const alterNativeMobileNumber = record.alterNativeMobileNumber;

        const tagStyle = {
          fontSize: "14px",
          width: "120px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        };

        const tags = [];

        if (mobile) {
          tags.push(
            <Tag color="purple" style={tagStyle} key="mobile">
              <PhoneOutlined className="mr-1" />
              {mobile}
            </Tag>
          );
        }

        if (whatsapp && whatsapp !== mobile) {
          tags.push(
            <Tag color="green" style={tagStyle} key="whatsapp">
              <WhatsAppOutlined className="mr-1" />
              {whatsapp}
            </Tag>
          );
        }

        if (
          alterNativeMobileNumber &&
          alterNativeMobileNumber !== mobile &&
          alterNativeMobileNumber !== whatsapp
        ) {
          tags.push(
            <Tag color="blue" style={tagStyle} key="alt">
              <PhoneOutlined className="mr-1" />
              {alterNativeMobileNumber}
            </Tag>
          );
        }

        return tags.length > 0 ? (
          <div className="flex flex-col gap-1">{tags}</div>
        ) : null;
      },
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      width: 90,
      render: (_text, record) => {
        const fullName = `${record.firstName || ""} ${
          record.lastName || ""
        }`.trim();
        return (
          <Tooltip title={fullName || "No Name"}>
            <span className="flex items-center">
              {/* <UserOutlined className="mr-2 text-gray-500" /> */}
              {fullName ? (
                fullName
              ) : (
                <span className="text-gray-400">No Name</span>
              )}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text || "No Email"}>
          <span className="flex items-center">
            {/* <MailOutlined className="mr-2 text-gray-500" /> */}
            {text ? (
              text.length > 25 ? (
                `${text.substring(0, 25)}...`
              ) : (
                text
              )
            ) : (
              <span className="text-gray-400">No Email</span>
            )}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "userRegisterCreatedDate",
      key: "userRegisterCreatedDate",
      width: 90,
      render: (date: string) => (
        <span className="flex items-center">
          {/* <CalendarOutlined className="mr-2 text-gray-500" /> */}
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Registered From",
      dataIndex: "userType",
      key: "userType",
      width: 80,
      render: (_: string, record: UserData) => (
        <>
          <Tag className="mb-1" color="green">
            {record.userType}
          </Tag>
          <Tag color="geekblue">{record.registeredFrom}</Tag>
        </>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 120,
      ellipsis: true,
      render: (text: string | null) => (
        <Tooltip title={text || "No Address Provided"}>
          <span className="flex items-center">
            {/* <HomeOutlined className="mr-2 text-gray-500" /> */}
            {text ? (
              text.length > 15 ? (
                `${text.substring(0, 15)}...`
              ) : (
                text
              )
            ) : (
              <span className="text-gray-400">No Address</span>
            )}
          </span>
        </Tooltip>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 140, // increased to accommodate both buttons with space
    //   render: (_text, record) => (
    //     <div className="flex gap-2">
    //       <Button
    //         type="default"
    //         size="small"
    //         onClick={() => {
    //           setRecord(record);
    //           showCommentsModal(record);
    //         }}
    //         className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100"
    //       >
    //         Comments
    //       </Button>
    //       <Button
    //         type="default"
    //         size="small"
    //         onClick={() => viewOrderDetails(record)}
    //         className="rounded-md border border-green-400 text-green-600 hover:bg-green-100"
    //       >
    //         Orders
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

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
  const formatUserRegisterDate = (
    dateValue: string | number | undefined
  ): string => {
    return dateValue ? new Date(dateValue).toLocaleDateString() : "N/A";
  };

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
              pagination={{ pageSize: 30 }}
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
        width={700}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
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
                        title="Total Calls Count"
                        value={reportData.totalCount}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card>
                      <Statistic
                        title="Today Calls Count"
                        value={reportData.dayCount}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                </Row>

                <div className="flex flex-col gap-4">
                  {reportData.response.length > 0 ? (
                    reportData.response.map((item, index) => (
                      <Card key={index} className="mb-2">
                        {/* Header with date and caller tag */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-700">
                            {formatDate(item.createdDate)}
                          </span>
                          <Tag color="blue">{item.caller}</Tag>
                        </div>

                        {/* Comments section with highlight */}
                        <div className="mb-3">
                          <span className="font-semibold">Comments: </span>
                          <span className="font-bold text-black">
                            {item.comments}
                          </span>
                        </div>

                        {/* View User Details Button */}
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            handleViewUserDetails(item.userId, index)
                          }
                          loading={userDetailsLoading[index]}
                          className="p-0 mb-2"
                        >
                          {userDetailsVisible[index]
                            ? "Hide User Details"
                            : "View User Details"}
                        </Button>

                        {/* User details section - only show if visible and data exists */}
                        {userDetailsVisible[index] && (
                          <>
                            <Divider style={{ margin: "12px 0" }} />

                            {userDetailsLoading[index] ? (
                              <div className="flex justify-center py-2">
                                <Spin size="small" />
                              </div>
                            ) : userDetailsData[index] ? (
                              <div className="bg-gray-50 p-3 rounded">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <UserOutlined className="mr-1" />
                                  User Details
                                </h4>
                                <Row gutter={[16, 8]}>
                                  <Col span={12}>
                                    <div className="text-sm">
                                      <span className="text-gray-500">
                                        Name:
                                      </span>{" "}
                                      <span className="font-medium">
                                        {userDetailsData[index]?.userName ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="text-sm">
                                      <span className="text-gray-500">
                                        User Type:
                                      </span>{" "}
                                      <span className="font-medium">
                                        {userDetailsData[index]?.userType ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="text-sm">
                                      <span className="text-gray-500">
                                        Registration:
                                      </span>{" "}
                                      <span className="font-medium">
                                        {formatUserRegisterDate(
                                          userDetailsData[index]
                                            ?.userRegisterDate
                                        )}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="text-sm flex items-center">
                                      <span className="text-gray-500">
                                        Mobile:
                                      </span>{" "}
                                      <span className="font-medium flex items-center">
                                        <PhoneOutlined className="mx-1" />
                                        {userDetailsData[index]?.countryCode ||
                                          ""}{" "}
                                        {userDetailsData[index]?.mobileNumber ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col span={24}>
                                    <div className="text-sm">
                                      <span className="text-gray-500">
                                        Address:
                                      </span>{" "}
                                      <span className="font-medium">
                                        {userDetailsData[index]?.flatNo
                                          ? `${userDetailsData[index]?.flatNo}, `
                                          : ""}
                                        {userDetailsData[index]?.address
                                          ? `${userDetailsData[index]?.address}, `
                                          : ""}
                                        {userDetailsData[index]?.pincode ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                              <div className="text-center py-2 text-gray-500 text-sm">
                                No user details available
                              </div>
                            )}
                          </>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Empty description="No call data available for the selected date" />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </Modal>

      <Modal
        title="Assigned Users"
        open={assignUserModalVisible}
        onCancel={() => setAssignUserModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Spin spinning={assignUserLoading}>
          <div className="overflow-x-auto">
            <Table
              columns={assignedUserColumns}
              dataSource={assignUserData}
              rowKey="userId"
              pagination={{
                current: assignUserPage,
                total: assignUserTotal,
                pageSize: 10,
                onChange: handleAssignUserPageChange,
              }}
              className="border border-gray-200 rounded-lg"
              scroll={{ x: 1200 }}
              size="middle"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />
          </div>
        </Spin>
      </Modal>
    </Layout>
  );
};

export default HelpDeskUsers;
