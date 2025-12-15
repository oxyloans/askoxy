import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Select, Table, Modal, Spin, Button } from "antd";
import Sider from "./Sider";
// import { setEmitFlags } from "typescript";
import BASE_URL from "../Config";

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
  userQueryDocumentStatus: {
    userDocumentId: string;
    filePath: string;
  };
}

const AllQueries: React.FC = () => {
  const [queryStatus, setQueryStatus] = useState<string>("PENDING");
  const [askOxyOffersFilter, setAskOxyOffersFilter] =
    useState<string>("ALL");
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  // const userId = localStorage.getItem("userId");

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

    const requestPayload: any = {
      projectType: "ASKOXY",
      queryStatus,
      // userId,
    };

    if (askOxyOffersFilter !== "ALL") {
      requestPayload.askOxyOfers = askOxyOffersFilter;
    }
      const response = await axios.post(
        `${BASE_URL}/user-service/write/getAllQueries`,
        requestPayload
      );

     const sortedQueries = [...response.data].sort(
       (a: Query, b: Query) =>
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
     );

     setQueries(sortedQueries);
     
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
        askOxyOfers: selectedQuery?.askOxyOfers || "",
        comments: comments,
        email: selectedQuery?.email,
        id: selectedQuery?.id,
        mobileNumber: selectedQuery?.mobileNumber,
        projectType: "ASKOXY",
        query: selectedQuery?.query,
        queryStatus: action,
        resolvedBy: "admin",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        userId: selectedQuery?.userId,
      };
    }
    if (action === "COMPLETED") {
      data = {
        adminDocumentId: "",
        askOxyOfers: selectedQuery?.askOxyOfers || "",
        comments: comments,
        email: selectedQuery?.email,
        id: selectedQuery?.id,
        mobileNumber: selectedQuery?.mobileNumber,
        projectType: "ASKOXY",
        query: selectedQuery?.query,
        queryStatus: "COMPLETED",
        resolvedBy: "admin",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        userId: selectedQuery?.userId,
      };
    }

    try {
      const response = await fetch(`${BASE_URL}/user-service/write/saveData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

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
      width: 20,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "User Info",
      dataIndex: "userInfo",
      width: 220,
      render: (_: any, record: Query) => (
        <div>
          <div>
            <strong>Name:</strong> {record.name}
          </div>
          <div>
            <strong>Email:</strong> {record.email}
          </div>
          <div>
            <strong>Mobile :</strong> {record.mobileNumber}
          </div>
          <div>
            <strong>Ticket Id:</strong> {record.randomTicketId}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(record.createdAt).toLocaleDateString("en-GB")}
          </div>
          <div>
            <strong>AskOxy Offer:</strong> {record.askOxyOfers}
          </div>
        </div>
      ),
    },
    {
      title: "User Query",
      dataIndex: "query",
      width: 220,
      render: (_: any, record: Query) => {
        const filePath = record.userQueryDocumentStatus?.filePath;

        return (
          <div style={{ position: "relative", paddingBottom: "2rem" }}>
            <p>{record.query}</p>

            {filePath && (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setSelectedFilePath(filePath);
                  setIsModalOpen(true);
                }}
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                View doc
              </Button>
            )}
          </div>
        );
      },
    },

    {
      title: "Admin & User Replies",
      dataIndex: "replies",
      width: 300,
      render: (_: any, record: Query) => (
        <div className="space-y-2">
          {/* Replies from userPendingQueries */}
          {record.userPendingQueries && record.userPendingQueries.length > 0
            ? record.userPendingQueries.map((reply, index) => (
                <div key={index} className="mb-2 border-b pb-1">
                  <div className="flex justify-between items-start">
                    <span
                      className={`block text-sm font-semibold ${
                        reply.resolvedBy === "admin"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {reply.resolvedBy === "admin" ? "Admin" : "User"}:
                    </span>

                    {reply.resolvedOn && (
                      <span className="text-xs text-gray-400">
                        {new Date(reply.resolvedOn).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <span className="block text-sm text-gray-700">
                    {reply.pendingComments || "No comment provided"}
                  </span>
                </div>
              ))
            : null}

          {/* Top-level admin comment (final reply) */}
          {record.comments && (
            <div className="mb-2 border-b pb-1">
              <span className="block text-sm font-semibold text-blue-600">
                Admin
              </span>
              <span className="block text-sm text-gray-700">
                {record.comments}
              </span>
              {record.resolvedOn && (
                <span className="block text-xs text-gray-400">
                  {new Date(record.resolvedOn).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* If no replies at all */}
          {!record.comments &&
            (!record.userPendingQueries ||
              record.userPendingQueries.length === 0) && (
              <div className="text-sm text-gray-500 italic">No replies yet</div>
            )}
        </div>
      ),
    },

    ...(queryStatus === "PENDING"
      ? [
          {
            title: "Action",
            dataIndex: "uploadedFile",
            width: 100,
            render: (_: any, record: Query) => (
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
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
    <div className="flex flex-col md:flex-row min-h-screen mt-4">
      <div className="flex-1 ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Queries Raised by Users
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              placeholder="Select Query Status"
              value={queryStatus}
              onChange={(value) => setQueryStatus(value)}
              className="w-60"
              dropdownStyle={{ borderRadius: "8px" }}
              style={{ borderRadius: "8px" }}
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELLED">CANCELLED</Option>
            </Select>

            <Select
              placeholder="Filter by ASK OXY Offers"
              value={askOxyOffersFilter}
              onChange={(value) => setAskOxyOffersFilter(value)}
              className="w-60"
              allowClear
              dropdownStyle={{ borderRadius: "8px" }}
              style={{ borderRadius: "8px" }}
            >
              <Option value="ALL">ALL</Option>
              <Option value="FREESAMPLE">RICE QUERIES</Option>
              <Option value="BLOGS">BLOG QUERIES</Option>
              <Option value="SERVICES">SERVICES QUERIES</Option>
              {/* <Option value="LAUNCHAGENTS">AGENT QUERIES</Option> */}

              {/* <Option value="STUDYABROAD">STUDY ABROAD</Option>
              <Option value="FREERUDRAKSHA">FREE RUDRAKSHA</Option>
              <Option value="FREEAI">FREE AI</Option>
              <Option value="ROTARIAN">ROTARIAN</Option> */}
              <Option value="WEAREHIRING">JOB QUERIES</Option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center ">
            <Spin size="large" />
          </div>
        ) : queries.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table
              dataSource={queries}
              columns={columns.map((col) => ({
                ...col,
                className: "py-4",
                render:
                  col.render ||
                  ((text) => <span className="text-gray-700">{text}</span>),
              }))}
              rowKey={(record) => record.id}
              bordered
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                position: ["bottomCenter"],
                className: "my-6",
              }}
              className="w-full"
              scroll={{ x: true }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">No queries found.</p>
              <p className="text-sm">
                Try adjusting your filters to see more results.
              </p>
            </div>
          </div>
        )}
        {/* </div> */}
      </div>

      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: "24px" }}
        className="rounded-lg"
      >
        {selectedQuery && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-indigo-800">
              Review the Document
            </h3>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <label className="text-gray-700 font-medium">Upload File</label>
              </div>

              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {selectedFile && isImage(selectedFile) && (
              <div className="mb-6 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                />
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <label className="text-gray-700 font-medium">Comments</label>
              </div>

              <textarea
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter your comments here..."
                value={comments}
                onChange={handleOnChange}
                rows={4}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleActionButtonClick("PENDING")}
                className="flex items-center gap-1 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mark as Pending
              </button>
              <button
                onClick={() => handleActionButtonClick("COMPLETED")}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
              <button
                onClick={() => {
                  setModalVisible(false);
                  setError("");
                  setComments("");
                }}
                className="flex items-center gap-1 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 p-6 text-white text-center rounded-lg shadow-lg flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-lg font-medium">
              Query Resolved successfully!
            </span>
          </div>
        </div>
      )}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="User Document"
        width={400} // smaller width
        bodyStyle={{ maxHeight: "400px", overflowY: "auto" }} // limit height
      >
        {selectedFilePath && (
          <img
            src={selectedFilePath}
            alt="User Document"
            style={{ width: "100%", borderRadius: 8 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AllQueries;