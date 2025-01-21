import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Select, Table, Modal, Spin } from "antd";
import Sider from "./Sider";
import { setEmitFlags } from "typescript";

const { Content } = Layout;
const { Option } = Select;

interface Query {
  id: string;
  userId: string;
  query: string;
  queryStatus: string;
  email: string;
  mobileNumber: string;
  comments: string;
  resolvedBy: string | null;
  resolvedOn: string | null;
  createdAt: string;
  randomTicketId: string;
  name: string;
  projectType: string;
  askOxyOfers: string | null;
  queryCount: number;
  userPendingQueries: Array<{
    pendingComments: string;
    resolvedOn: string;
    resolvedBy: string;
  }>;
}

const AllQueries: React.FC = () => {
  const [queryStatus, setQueryStatus] = useState<string>("PENDING");
  const [askOxyOffersFilter, setAskOxyOffersFilter] =
    useState<string>("FREERUDRAKSHA");
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }

      const requestPayload = {
        askOxyOfers:
          askOxyOffersFilter ||
          "FREERUDRAKSHA,FREEAI,ROTARIAN,WEAREHIRING,LEGALSERVICES,STUDYABROAD,FREESAMPLE",
        projectType: "ASKOXY",
        queryStatus,
        userId,
      };

      const response = await axios.post(
        "https://meta.oxyloans.com/api/write-to-us/student/getAllQueries",
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [queryStatus, askOxyOffersFilter]);

  const handlePendingClick = (query: Query) => {
    setSelectedQuery(query);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedQuery(null);
    setComments("");
    setSelectedFile(null);
    setError("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleActionButtonClick = async (action: "PENDING" | "COMPLETED") => {
    let data = {};
    if (comments.trim() === "") {
      setError("Please enter any comments.");

      setLoading(false);
      return;
    } else {
      setComments(""); // Optionally clear comments after submission
      setError(""); // Clear error on successful submission
      setLoading(true);
      setModalVisible(false);
    }
    if (action === "PENDING") {
      data = {
        adminDocumentId: "",
        askOxyOfers: askOxyOffersFilter,
        comments: comments,
        email: selectedQuery?.email,
        id: selectedQuery?.id,
        mobileNumber: selectedQuery?.mobileNumber,
        projectType: "ASKOXY",
        query: "",
        queryStatus: action,
        resolvedBy: "admin",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        userId: userId,
      };
    }
    if (action === "COMPLETED") {
      data = {
        adminDocumentId: "",
        askOxyOfers: askOxyOffersFilter,
        comments: comments,
        email: selectedQuery?.email,
        id: selectedQuery?.id,
        mobileNumber: selectedQuery?.mobileNumber,
        projectType: "ASKOXY",
        query: "",
        queryStatus: "COMPLETED",
        resolvedBy: "admin",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        userId: userId,
      };
    }

    try {
      const response = await fetch(
        "https://meta.oxyloans.com/api/write-to-us/student/saveData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result != null) {
        setLoading(false);
        setComments("");

        if (result.queryStatus === "COMPLETED") {
          setSuccessMessage(true);
          // Hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(false);
          }, 3000);
        }
      } else {
        console.error("Error saving data:", result);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network error
    } finally {
      setModalVisible(false);
      fetchQueries();
      setComments("");
    }
  };

  const isImage = (file: File | null) => {
    return file && file.type.startsWith("image/");
  };

  const columns = [
    {
      title: "SL.NO",
      dataIndex: "id",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "User Info",
      dataIndex: "userInfo",
      render: (_: any, record: Query) => (
        <div>
          <div>
            <strong>Name:</strong> {record.name}
          </div>
          <div>
            <strong>Email:</strong> {record.email}
          </div>
          <div>
            <strong>Mobile Number:</strong> {record.mobileNumber}
          </div>
          <div>
            <strong>Ticket Id:</strong> {record.randomTicketId}
          </div>
          <div>
            <strong>Created At:</strong> {record.createdAt}
          </div>
        </div>
      ),
    },
    {
      title: "User Query",
      dataIndex: "query",
    },
    {
      title: "Admin & User Replies",
      dataIndex: "replies",
      render: (_: any, record: Query) => (
        <div className="space-y-0">
          {record.userPendingQueries?.map((reply, index) => (
            <div key={index} className="flex items-center">
              <span
                className={`text-sm font-medium ${
                  reply.resolvedBy === "admin"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {reply.resolvedBy === "admin" ? "Admin" : "User"}:
              </span>
              <span className="text-sm text-gray-700 ml-2">
                {reply.pendingComments}
              </span>
            </div>
          ))}
          {(!record.userPendingQueries ||
            record.userPendingQueries.length === 0) && (
            <div className="text-sm text-gray-500 italic">No replies yet</div>
          )}
        </div>
      ),
    },

    ...(queryStatus === "PENDING"
      ? [
          {
            title: "Uploaded File",
            dataIndex: "uploadedFile",
            render: (_: any, record: Query) => (
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded focus:outline-blue-500"
                onClick={() => handlePendingClick(record)}
              >
                Pending
              </button>
            ),
          },
        ]
      : []),
  ];

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sider />
      <div className="flex-1">
        <Content className="p-12">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Query Management
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Select
              placeholder="Select Query Status"
              value={queryStatus}
              onChange={(value) => setQueryStatus(value)}
              className="w-72"
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELLED">CANCELLED</Option>
            </Select>

            {/* ASK OXY Offers Filter */}
            <Select
              placeholder="Filter by ASK OXY Offers"
              value={askOxyOffersFilter}
              onChange={(value) => setAskOxyOffersFilter(value)}
              className="w-72"
              allowClear
            >
              <Option value="FREERUDRAKSHA">FREERUDRAKSHA</Option>
              <Option value="FREEAI">FREEAI</Option>
              <Option value="ROTARIAN">ROTARIAN</Option>
              <Option value="WEAREHIRING">WE ARE HIRING</Option>
              <Option value="LEGALSERVICES">LEGAL SERVICES</Option>
              <Option value="STUDYABROAD">STUDY ABROAD</Option>
              <Option value="FREESAMPLE">FREE SAMPLE</Option>
            </Select>
          </div>

          {loading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : queries.length > 0 ? (
            <Table
              dataSource={queries}
              columns={columns}
              rowKey={(record) => record.id}
              bordered
              pagination={{ pageSize: 10 }}
              className="w-full max-w-7xl mx-auto"
              scroll={{ x: true }}
            />
          ) : (
            <div className="text-center text-gray-500">No queries found.</div>
          )}
        </Content>
      </div>

      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={500}
      >
        {selectedQuery && (
          <div>
            <h3 className="text-lg font-bold mb-4">Review the Document</h3>
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileUpload}
                className="border p-2"
              />
            </div>

            {selectedFile && isImage(selectedFile) && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div className="mb-4">
              <textarea
                className="w-full border p-2"
                placeholder="Enter comments..."
                value={comments}
                onChange={handleOnChange}
                rows={4}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleActionButtonClick("PENDING")}
                className=" text-black border-2 border-gray-500 py-1 px-3 rounded"
              >
                Mark as Pending
              </button>
              <button
                onClick={() => handleActionButtonClick("COMPLETED")}
                className="bg-blue-500 text-white py-1 px-3 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setModalVisible(false);
                  setError("");
                  setComments("");
                }}
                className="text-black border-2 border-gray-500 py-1 px-3 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 p-4 text-white text-center rounded-md">
            Query saved successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQueries;
