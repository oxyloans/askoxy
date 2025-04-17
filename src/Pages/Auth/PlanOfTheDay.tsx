import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../../Config";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Divider,
  Avatar,
  Tag,
  notification,
  message,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Array of team options
const TEAM_OPTIONS: string[] = [
  "TECHTEAM",
  "ADMINTEAM",
  "HRTEAM",
  "TELECALLINGTEAM",
  "ACCOUNTINGTEAM",
  "SALESTEAM",
  "MANAGEMENTTEAM",
];

// Map teams to colors for visual representation
const TEAM_COLORS: Record<string, string> = {
  TECHTEAM: "blue",
  ADMINTEAM: "purple",
  HRTEAM: "pink",
  TELECALLINGTEAM: "orange",
  ACCOUNTINGTEAM: "green",
  SALESTEAM: "red",
  MANAGEMENTTEAM: "gold",
};

interface TaskFormValues {
  planOftheDay: string;
  taskTeam: string;
}

interface TaskResponse {
  success: boolean;
  id: string;
}

const PlanOfTheDay: React.FC = () => {
  const [form] = Form.useForm<TaskFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Format today's date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    // Get userId from local storage
    const storedUserId: string =
      localStorage.getItem("userId") || "b83ed56b-fd00-4a3c-8104-18a143a086af";
    setUserId(storedUserId);

    // Get userName from local storage
    const storedUserName: string = localStorage.getItem("userName") || "";
    setUserName(storedUserName);

    // Check if user has already submitted a plan today
    const lastSubmissionDate = localStorage.getItem("lastSubmissionDate");
    if (lastSubmissionDate === today.toDateString()) {
      setIsSubmitted(true);
    }
  }, []);

  const onFinish = async (values: TaskFormValues): Promise<void> => {
    setLoading(true);

    try {
      // Add safety check for userName
      if (!userName) {
        message.warning("User name not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.patch<TaskResponse>(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        {
          planOftheDay: values.planOftheDay,
          taskAssinedBy: localStorage.getItem("userName"),
          taskTeam: values.taskTeam,
          userId: userId,
        }
      );

      if (response.data.success) {
        localStorage.setItem("taskId", response.data.id);
        localStorage.setItem("lastSubmissionDate", new Date().toDateString());

        setIsSubmitted(true);

        notification.success({
          message: "Success",
          description: "Your plan for the day has been submitted successfully!",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          placement: "topRight",
          duration: 4,
        });

        form.resetFields();
      } else {
        message.error("Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      message.error("An error occurred while creating the task.");
    } finally {
      setLoading(false);
    }
  };

  const resetSubmission = () => {
    setIsSubmitted(false);
  };

  return (
    <UserPanelLayout>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <Card
          className="max-w-xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 transition-all duration-300 hover:shadow-xl"
          bodyStyle={{ padding: 0 }}
        >
          {/* Header Section with improved gradient */}
          <div className="bg-gradient-to-r p-5 md:p-6 text-black">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Title
                  level={3}
                  className="text-white mb-1 text-xl sm:text-2xl md:text-3xl font-bold"
                >
                  Plan Of The Day
                </Title>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Text className="text-black text-xs sm:text-sm flex items-center">
                    <CalendarOutlined className="mr-1" />
                    {currentDate}
                  </Text>
                  {userName && (
                    <Tag
                      icon={<UserOutlined />}
                      color="blue"
                      className="ml-0 sm:ml-2 bg-blue-800 border-blue-700"
                    >
                      {userName}
                    </Tag>
                  )}
                </div>
              </div>
              <Avatar
                size={{ xs: 48, sm: 56, md: 64 }}
                icon={<CalendarOutlined />}
                className="bg-white text-blue-700 shadow-md"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="p-5 md:p-6 lg:p-8">
            {isSubmitted ? (
              <div className="text-center py-6">
                <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
                <Title level={4} className="text-gray-800">
                  Daily Plan Submitted!
                </Title>
                <Paragraph className="text-gray-600 mb-6">
                  You've already submitted your plan for today. Have a
                  productive day!
                </Paragraph>
                <Button
                  type="default"
                  onClick={resetSubmission}
                  className="rounded-lg"
                >
                  Submit another plan
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
                  <div className="flex">
                    <BulbOutlined className="text-blue-500 text-xl mr-3 mt-1" />
                    <div>
                      <Text strong className="text-blue-800">
                        Planning Tips
                      </Text>
                      <Paragraph className="text-blue-700 text-sm mb-0">
                        Set clear priorities, be specific about deliverables,
                        and include time estimates for better productivity.
                      </Paragraph>
                    </div>
                  </div>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="space-y-5"
                  size="large"
                >
                  <Form.Item
                    name="planOftheDay"
                    label={
                      <span className="text-gray-700 font-medium text-sm sm:text-base">
                        What's your plan for today?
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter your plan for the day!",
                      },
                      {
                        min: 10,
                        message: "Your plan should be at least 10 characters",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe your tasks and goals for today..."
                      maxLength={500}
                      showCount
                      className="border-gray-300 rounded-lg text-sm focus:border-blue-500 hover:border-blue-400"
                    />
                  </Form.Item>

                  <Form.Item
                    name="taskTeam"
                    label={
                      <span className="text-gray-700 font-medium text-sm sm:text-base flex items-center">
                        <TeamOutlined className="mr-2" />
                        Select Team
                      </span>
                    }
                    rules={[
                      { required: true, message: "Please select a team!" },
                    ]}
                  >
                    <Select
                      placeholder="Select your team"
                      className="rounded-lg"
                      size="large"
                      optionLabelProp="label"
                      dropdownMatchSelectWidth={false}
                      popupClassName="team-select-dropdown"
                    >
                      {TEAM_OPTIONS.map((team) => (
                        <Option key={team} value={team} label={team}>
                          <div className="flex items-center py-1">
                            <Tag
                              color={TEAM_COLORS[team] || "default"}
                              className="mr-2"
                            >
                              {team.charAt(0)}
                            </Tag>
                            <span>{team.replace("TEAM", " Team")}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Divider className="my-6" />

                  <Form.Item className="mb-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      icon={<SendOutlined />}
                      className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 border-none shadow-md hover:shadow-lg font-medium text-base"
                    >
                      Submit Daily Plan
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default PlanOfTheDay;
