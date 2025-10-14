"use client";
import React, { useEffect, useState } from "react";
import { Table, Spin, message, Form, Input, Button,Space, Modal,Tooltip } from "antd";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { MdForum } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

const EmployeeInteractions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [interactionRecord, setInteractionRecord] = useState<any>(null);

  const [form] = Form.useForm(); // ✅ form instance for modal
  const navigate = useNavigate();

  const userId = "91d2f250-20d0-44a5-9b4e-2acb73118b98";
  const adminUserId = sessionStorage.getItem("userId");

  const API_URL = `${BASE_URL}/user-service/write/getAdminUserId?adminUserId=${userId}`;
  const INTERACTION_API = `${BASE_URL}/user-service/write/radhaInteractions`;

  // ✅ IST formatter
  const formatDateIST = (dateString: string):string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toLocaleString("en-IN", { hour12: true });
  };
  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        // ✅ sort by updatedDate (if exists) else createdDate
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(
            a.radhaUpdateDate || a.radhaInstructeddate
          ).getTime();
          const dateB = new Date(
            b.radhaUpdateDate || b.radhaInstructeddate
          ).getTime();
          return dateB - dateA;
        });
        setData(sortedData);
        setFilteredData(sortedData); // ✅ keep consistent with sorting
      } else {
        message.warning("Unexpected response format");
      }
    } catch (err) {
      message.error("Failed to fetch Employee Interactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredData(data);
      return;
    }
    const lowerValue = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.instructionHeader?.toLowerCase().includes(lowerValue) ||
        item.radhaInstructions?.toLowerCase().includes(lowerValue)
    );
    setFilteredData(filtered);
  };

  // Save interaction
  const handleInteractionSave = async (values: any) => {
    if (!interactionRecord) return;
    setSaving(true);
    try {
      const payload = {
        employeeConversation: values.employeeConversation,
        radhaInstructionsId: interactionRecord.radhaInstructionsId,
        type: "EMPLOYEE",
        userid: adminUserId,
      };

      await axios.patch(INTERACTION_API, payload);
      message.success("Interaction saved successfully!");
      setIsInteractionModalOpen(false);
      setInteractionRecord(null);
      form.resetFields(); // ✅ clear modal form after save
    } catch (err) {
      message.error("Failed to save interaction");
    } finally {
      setSaving(false);
    }
  };

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => index + 1,
      align: "center",
    },

    {
      title: "Instruction ID",
      dataIndex: "radhaInstructionsId",
      align: "center",
      render: (text: string) => (text ? `#${text.slice(-4)}` : "-"),
    },
    {
      title: "Instruction Header",
      dataIndex: "instructionHeader",
      align: "center",
    },
    {
      title: "Instructions",
      dataIndex: "radhaInstructions",
      align: "center",
      render: (text) => (
        // <Tooltip title={text}>
        <div
          style={{
            maxWidth: 250,
            textAlign: "center",
            display: "-webkit-box",

            WebkitBoxOrient: "vertical",
            maxHeight: 110, // limit height
            overflowX: "auto", // horizontal scroll
          }}
        >
          {text}
        </div>
        // </Tooltip>
      ),
    },
    {
      title: "Employee Names",
      dataIndex: "employeesName",
      align: "center",
      width: 160,
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 140,
              maxHeight: 80, // limit height
              overflowX: "auto", // horizontal scroll
            }}
          >
            {text || "-"}
          </div>
        </Tooltip>
      ),
    },

    {
      title: "Created/Updated",
      dataIndex: "radhaInstructeddate", // Use one as primary dataIndex, but render will access both
      align: "center",
      render: (text, record) => (
        <div style={{ textAlign: "left" }}>
          <div>
            <span style={{ fontWeight: "400" }}>Created: </span>
            {formatDateIST(record.radhaInstructeddate)}
          </div>
          <div>
            <span style={{ fontWeight: "400" }}>Updated: </span>
            {formatDateIST(record.radhaUpdateDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Space align="center" size="middle">
          {/* Write To Us Button */}
          <Button
            onClick={() => {
              setInteractionRecord(record);
              setIsInteractionModalOpen(true);
              form.resetFields(); // ✅ reset when modal opens
            }}
            style={{ backgroundColor: "#1c84c6", color: "white" }}
            icon={<MessageOutlined />}
          >
            Write To Us
          </Button>

          {/* Chat View Button */}
          <Button
            style={{ backgroundColor: "#8e44ad", color: "white" }}
            icon={<MdForum />}
            onClick={() =>
              navigate(`/taskmanagement/chatview/${record.radhaInstructionsId}`)
            }
          >
            Chat View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <UserPanelLayout>
      {/* Header with search */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-bold mb-2 md:mb-0">
          Employee Interactions
        </h2>
        <Input
          placeholder="Search by header or instructions..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="radhaInstructionsId"
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      )}

      {/* Interaction Modal */}
      <Modal
        title="Add Interaction"
        open={isInteractionModalOpen}
        onCancel={() => setIsInteractionModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleInteractionSave}>
          <Form.Item
            label="Employee Conversation"
            name="employeeConversation"
            rules={[{ required: true, message: "Please enter conversation" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              style={{ backgroundColor: "#1c84c6", color: "white" }}
              block
            >
              Save Interaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </UserPanelLayout>
  );
};

export default EmployeeInteractions;
