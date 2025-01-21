import React, { useState, useEffect } from "react";
import { Select, Spin, Table, Modal, Input, message } from "antd";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

interface Query {
  id: string;
  name: string;
  mobileNumber: string;
  randomTicketId: string;
  createdAt: string;
  query: string;
  queryStatus: string;
  askOxyOfers: string;
  projectType: string;
  userId: string;
  email: string;
  userPendingQueries: Array<{
    pendingComments: string;
    resolvedOn: string;
    resolvedBy: string;
  }>;
}

interface CancelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (comment: string) => void;
  loading: boolean;
}

interface ReplyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (comment: string) => void;
  loading: boolean;
}

// Cancel Modal Component
const CancelModal: React.FC<CancelModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError("Please enter a comments before cancelling");
      return;
    }
    onSubmit(comment);
    setComment("");
    setError("");
  };

  const handleCancel = () => {
    setComment("");
    setError("");
    onCancel();
  };

  return (
    <Modal
      title="Cancel Query"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <button
          key="cancel"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 mr-2"
        >
          Cancel
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>,
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please provide a reason for cancellation
          </label>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim()) {
                setError("");
              }
            }}
            placeholder="Enter your comments here..."
            className={`w-full border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

const ReplyModal: React.FC<ReplyModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError("Please enter your comments");
      return;
    }
    onSubmit(comment);
    setComment("");
    setError("");
  };

  const handleCancel = () => {
    setComment("");
    setError("");
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={[
        <button
          key="cancel"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 mr-2"
        >
          Cancel
        </button>,
        <button
          key="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>,
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your comments
          </label>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim()) {
                setError("");
              }
            }}
            placeholder="Enter your comments..."
            className={`w-full border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

const TicketHistory: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [askOxyOffersFilter, setAskOxyOffersFilter] =
    useState<string>("FREERUDRAKSHA");

  const userId = localStorage.getItem("userId");

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/write-to-us/student/getAllQueries",
        {
          askOxyOfers:
            askOxyOffersFilter ||
            "FREERUDRAKSHA,FREEAI,ROTARIAN,WEAREHIRING,LEGALSERVICES,STUDYABROAD,FREESAMPLE",
          projectType: "ASKOXY",
          queryStatus: selectedStatus,
          userId: userId,
        }
      );
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
      message.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (record: Query) => {
    setSelectedQuery(record);
    setReplyModalVisible(true);
  };

  // Add handle reply submit function
  const handleReplySubmit = async (comment: string) => {
    if (!selectedQuery) return;

    setReplyLoading(true);
    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/write-to-us/student/saveData",
        {
          id: selectedQuery.id,
          userId: selectedQuery.userId,
          query: selectedQuery.query,
          queryStatus: "PENDING",
          email: selectedQuery.email,
          mobileNumber: selectedQuery.mobileNumber,
          comments: comment,
          resolvedBy: "user",
          resolvedOn: new Date().toISOString(),
          ticketId: selectedQuery.id,
          randomTicketId: selectedQuery.randomTicketId,
          name: selectedQuery.name,
          projectType: selectedQuery.projectType,
          askOxyOfers: selectedQuery.askOxyOfers,
        }
      );

      if (response.data) {
        message.success("Reply sent successfully");
        setReplyModalVisible(false);
        fetchQueries();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      message.error("Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [selectedStatus, askOxyOffersFilter]);

  const handleCancelClick = (record: Query) => {
    setSelectedQuery(record);
    setCancelModalVisible(true);
  };

  const handleCancelSubmit = async (comment: string) => {
    if (!selectedQuery) return;

    setCancelLoading(true);
    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/write-to-us/student/saveData",
        {
          id: selectedQuery.id,
          userId: selectedQuery.userId,
          query: selectedQuery.query,
          queryStatus: "CANCELLED",
          askOxyOfers: selectedQuery.askOxyOfers,
          projectType: selectedQuery.projectType,
          email: selectedQuery.email,
          mobileNumber: selectedQuery.mobileNumber,
          comments: comment,
          resolvedBy: null,
          resolvedOn: new Date().toISOString(),
          ticketId: null,
          randomTicketId: selectedQuery.randomTicketId,
          name: selectedQuery.name,
        }
      );

      if (response.data) {
        message.success("Query cancelled successfully");
        setCancelModalVisible(false);
        fetchQueries();
      }
    } catch (error) {
      console.error("Error cancelling query:", error);
      message.error("Failed to cancel query");
    } finally {
      setCancelLoading(false);
    }
  };

  const getColumns = (status: string) => {
    const baseColumns = [
      {
        title: <div className="text-center">S.No</div>,
        dataIndex: "sno",
        key: "sno",
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: <div className="text-center">User Info</div>,
        key: "userInfo",
        width: "25%",
        render: (text: string, record: Query) => (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
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
            </div>
          </div>
        ),
      },
      {
        title: <div className="text-center">User Query</div>,
        dataIndex: "query",
        key: "query",
        width: "35%",
        render: (text: string, record: Query) => (
          <div className="whitespace-pre-wrap flex justify-center">
            {text || "No query provided"}
          </div>
        ),
      },
    ];

    if (status === "PENDING") {
      return [
        ...baseColumns,
        {
          title: <div className="text-center">Admin Replies</div>,
          key: "adminReplies",
          width: "20%",
          render: (text: string, record: Query) => (
            <div className="space-y-0">
              {record.userPendingQueries?.map((reply, index) => (
                <div key={index} className=" rounded-lg">
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium ${
                        reply.resolvedBy === "admin"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {reply.resolvedBy === "admin" ? "Admin" : "User"}:
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.resolvedOn).toLocaleString().slice(0, -2)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">
                    {reply.pendingComments}
                  </span>
                </div>
              ))}
              {(!record.userPendingQueries ||
                record.userPendingQueries.length === 0) && (
                <div className="text-sm text-gray-500 italic">
                  No replies yet
                </div>
              )}
            </div>
          ),
        },
        {
          title: <div className="text-center">Actions</div>,
          key: "actions",
          width: "20%",
          render: (text: string, record: Query) => (
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleReplyClick(record)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Reply
              </button>
              <button
                onClick={() => handleCancelClick(record)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          ),
        },
      ];
    } else {
      return [
        ...baseColumns,
        {
          title: <div className="text-center">Admin Replies</div>,
          key: "adminReply",
          width: "25%",
          render: (text: string, record: Query) => (
            <div>
              {record.userPendingQueries?.[0] && (
                <div className="whitespace-pre-wrap mb-2">
                  {record.userPendingQueries[0].pendingComments}
                </div>
              )}
            </div>
          ),
        },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ticket History</h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-end items-center">
        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <Select
            defaultValue="PENDING"
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            style={{ width: "100%" }}
            className="shadow-sm"
          >
            <Option value="PENDING">PENDING</Option>
            <Option value="COMPLETED">COMPLETED</Option>
            <Option value="CANCELLED">CANCELLED</Option>
          </Select>
        </div>

        {/* ASK OXY Offers Filter */}
        <div className="w-full sm:w-72">
          <Select
            defaultValue="FREERUDRAKSHA"
            placeholder="Filter by ASK OXY Offers"
            value={askOxyOffersFilter}
            onChange={(value) => setAskOxyOffersFilter(value)}
            className="w-full"
            allowClear
          >
            <Option value="FREERUDRAKSHA">FREE RUDRAKSHA</Option>
            <Option value="FREEAI">FREE AI</Option>
            <Option value="ROTARIAN">ROTARIAN</Option>
            <Option value="WEAREHIRING">WE ARE HIRING</Option>
            <Option value="LEGALSERVICES">LEGAL SERVICES</Option>
            <Option value="STUDYABROAD">STUDY ABROAD</Option>
            <Option value="FREESAMPLE">FREE SAMPLE</Option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              dataSource={queries}
              columns={getColumns(selectedStatus)}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 10 }}
              className="w-full"
              bordered
              scroll={{ x: window.innerWidth < 768 ? 800 : undefined }}
            />
          </div>
        </div>
      )}

      <CancelModal
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onSubmit={handleCancelSubmit}
        loading={cancelLoading}
      />
      <ReplyModal
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onSubmit={handleReplySubmit}
        loading={replyLoading}
      />
    </div>
  );
};

export default TicketHistory;
