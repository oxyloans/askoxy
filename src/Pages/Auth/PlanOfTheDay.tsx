import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../../Config";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Card,
  Typography,
  Space,
  Divider,
  Avatar,
  Tag,
  notification,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
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

// Array of staff members
const STAFF_OPTIONS: string[] = [
  "GRISHMA",
  "GUNA",
  "GUNASHEKAR",
  "SAIKUMAR",
  "SREEJA",
  "GADISAI",
  "GUTTISAI",
  "NARENDRA",
  "MANI",
  "VARALAKSHMI",
  "VIJAY",
  "NIHARIKA",
  "HARIPRIYA",
  "VINODH",
  "NAVEEN",
  "SRIDHAR",
  "SUBBU",
  "UDAY",
  "HARI",
  "SUDHEESH",
  "ANUSHA",
  "DIVYA",
  "KARTHIK",
  "RAMADEVI",
  "BHARGAV",
  "PRATHIBHA",
  "JYOTHI",
  "HEMA",
  "RAMYAHR",
  "SURESH",
  "SUCHITHRA",
  "ARUNA",
  "VENKATESH",
  "RAKESH",
  "JHON",
  "MOUNIKA",
  "VANDANA",
  "GOPAL",
  "ANUSHAACCOUNT",
  "RADHAKRISHNA",
  "MADHU",
  "RAVI",
  "SAMPATH",
  "CHANDU",
  "SWATHI",
  "SHANTHI",
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
  taskAssignTo: string;
}

interface TaskResponse {
  success: boolean;
  id: string;
}

const PlanOfTheDay: React.FC = () => {
  const [form] = Form.useForm<TaskFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

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

    // In a real application, you might get the userId from local storage, context, etc.
    const storedUserId: string =
      localStorage.getItem("userId") || "b83ed56b-fd00-4a3c-8104-18a143a086af";
    setUserId(storedUserId);
  }, []);

  const onFinish = async (values: TaskFormValues): Promise<void> => {
    setLoading(true);

    try {
      const response = await axios.patch<TaskResponse>(
      `${BASE_URL}/user-service/write/userTaskUpdate`,
        {
          planOftheDay: values.planOftheDay,
          taskAssignTo: values.taskAssignTo,
          taskTeam: values.taskTeam,
          userId: userId,
        }
      );

      localStorage.setItem("taskId", response.data.id); // Store taskId in local storage

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Your plan for the day has been submitted successfully!",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          placement: "topRight",
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

  return (
    <UserPanelLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <Card
          className="max-w-3xl mx-auto shadow-md rounded-lg overflow-hidden border-0"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r  p-6 text-black">
            <div className="flex items-center justify-between">
              <div>
                <Title level={2} className="text-black mb-0">
                  Plan Of The Day
                </Title>
                <Text className="text-[#008CBA]">
                  <CalendarOutlined className="mr-2" />
                  {currentDate}
                </Text>
              </div>
              <Avatar
                size={64}
                icon={<CalendarOutlined />}
                className="bg-white/30 backdrop-blur-sm text-white border-4 border-white/20"
              />
            </div>
          </div>

          <div className="p-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              // initialValues={{
              //   taskTeam: "TECHTEAM",
              //   taskAssignTo: "MANI",
              // }}
              className="space-y-4"
            >
              <Form.Item
                name="planOftheDay"
                label={
                  <span className="text-gray-700 font-medium">
                    What's your plan for today?
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your plan for the day!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Describe your tasks and goals for today..."
                  maxLength={500}
                  showCount
                  className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="taskTeam"
                  label={
                    <span className="text-gray-700 font-medium flex items-center">
                      <TeamOutlined className="mr-2" />
                      Select Team
                    </span>
                  }
                  rules={[{ required: true, message: "Please select a team!" }]}
                >
                  <Select
                    placeholder="Select team"
                    className="rounded-md"
                    optionLabelProp="label"
                  >
                    {TEAM_OPTIONS.map((team) => (
                      <Option key={team} value={team} label={team}>
                        <div className="flex items-center">
                          <Tag
                            color={TEAM_COLORS[team] || "default"}
                            className="mr-2"
                          >
                            {team.charAt(0)}
                          </Tag>
                          <span>{team}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="taskAssignTo"
                  label={
                    <span className="text-gray-700 font-medium flex items-center">
                      <UserOutlined className="mr-2" />
                      Select Employee Name
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a person to assign!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Employee Name"
                    showSearch
                    className="rounded-md"
                    filterOption={(input, option) =>
                      (
                        option?.children as any
                      )?.props?.children[1]?.props?.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {STAFF_OPTIONS.map((staff) => (
                      <Option key={staff} value={staff}>
                        <div className="flex items-center">
                          <Avatar
                            size="small"
                            className="mr-2 bg-blue-100 text-blue-700"
                          >
                            {staff.charAt(0)}
                          </Avatar>
                          <span>{staff}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Divider className="my-6" />

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="small"
                  icon={<SendOutlined />}
                  className="h-12 rounded-md bg-[#008CBA] shadow-sm"
                >
                  Submit Daily Plan
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default PlanOfTheDay;
