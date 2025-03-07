import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { FaBars, FaTimes, FaArrowLeft, FaFilter, FaFile, FaComments, FaBan, FaPen } from "react-icons/fa";
import { Modal, Spin } from "antd";
import { Menu, X, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, ChevronRight } from 'lucide-react';
import  BASE_URL  from "../Config";

type TicketStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface Ticket {
  id: string;
  createdAt: string;
  randomTicketId: string;
  name: string;
  query: string;
  date: string;
  comments: string;
  status: TicketStatus;
  userQueryDocumentStatus: {
    fileName: string | null;
    filePath: string | null;
  };
  userPendingQueries: Comment[];
  resolvedOn: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}

interface Comment {
  resolvedBy: string;
  resolvedOn: string | null;
  pendingComments: string;
  adminFileName: string;
  adminFilePath: string;
}

const TicketHistoryPage: React.FC = () => {
  const storedUserId = localStorage.getItem("userId") || "";
  const storedProfileData = localStorage.getItem("profileData") || "";
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("PENDING");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<boolean>(false);
  const [reasonModal, setReasonModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [cancelLoader, setCancelLoader] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (storedProfileData) {
      try {
        setProfileData(JSON.parse(storedProfileData));
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
    fetchTickets();
  }, [selectedStatus, storedProfileData]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BASE_URL+"/user-service/write/getAllQueries",
        {
          askOxyOfers: "FREESAMPLE",
          userId: storedUserId,
          projectType: "ASKOXY",
          queryStatus: selectedStatus,
        }
      );
      
      const fetchedTickets = response.data.map((item: any): Ticket => ({
        id: item.id,
        randomTicketId: item.randomTicketId,
        createdAt: item.createdAt?.substring(0, 10) || "",
        name: item.email,
        query: item.query,
        comments: item.comments || "",
        date: item.resolvedOn ? new Date(item.resolvedOn).toLocaleDateString() : "",
        status: item.queryStatus as TicketStatus,
        userQueryDocumentStatus: {
          fileName: item.userQueryDocumentStatus?.fileName || null,
          filePath: item.userQueryDocumentStatus?.filePath || null,
        },
        userPendingQueries: item.userPendingQueries || [],
        resolvedOn: item.resolvedOn || ""
      }));
      
      setTickets(fetchedTickets);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch tickets. Please try again later.");
      setLoading(false);
    }
  };

  const fetchComments = (value: Comment[]) => {
    setComments(value);
    setIsCommentsModalOpen(true);
  };

  const cancelQuery = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason for cancellation");
      return;
    }

    setCancelLoader(true);
    try {
      await axios.post(
        BASE_URL+"/user-service/write/saveData",
        {
          adminDocumentId: "",
          askOxyOfers: "FREESAMPLE",
          comments: reason,
          email: profileData.email,
          id: selectedTicketId,
          mobileNumber: profileData.whatsappNumber,
          projectType: "ASKOXY",
          query: "",
          queryStatus: "CANCELLED" as TicketStatus,
          resolvedBy: "user",
          resolvedOn: "",
          status: "",
          userDocumentId: "",
          userId: storedUserId,
        }
      );
      setCancelLoader(false);
      setReason("");
      setReasonModal(false);
      fetchTickets();
    } catch (error) {
      setCancelLoader(false);
      alert("Failed to cancel query. Please try again.");
    }
  };

  const getStatusBadge = (status: TicketStatus): string => {
    const statusConfig: Record<TicketStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`;
  };

  const handleFileOpen = (filePath: string | null) => {
    if (filePath) {
      window.open(filePath, "_blank");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

    

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Ticket History</h1>
                      <p className="text-sm text-gray-500">Track and manage your support tickets</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/main/writetous")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <FaPen className="text-sm" />
                    Create New Ticket
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
                      className="pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="PENDING">Pending Tickets</option>
                      <option value="COMPLETED">Resolved Tickets</option>
                      <option value="CANCELLED">Cancelled Tickets</option>
                    </select>
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Tickets Section */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tickets found for the selected status.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                            <p className="font-semibold flex items-center gap-2">
                              {ticket.randomTicketId}
                              <span className="text-sm text-gray-500">({ticket.createdAt})</span>
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Query</p>
                            <p className="font-medium">{ticket.query}</p>
                            {ticket.userQueryDocumentStatus?.fileName && (
                              <button
                                onClick={() => handleFileOpen(ticket.userQueryDocumentStatus.filePath)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-1"
                              >
                                <FaFile className="text-xs" />
                                {ticket.userQueryDocumentStatus.fileName}
                              </button>
                            )}
                          </div>

                          {selectedStatus !== "PENDING" && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-500">
                                {selectedStatus === "CANCELLED" ? "Cancellation Reason" : "Admin Comments"}
                              </p>
                              <p className="font-medium">{ticket.comments}</p>
                              <p className="text-sm text-gray-500">{ticket.date}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                          <span className={getStatusBadge(ticket.status)}>
                            {ticket.status.toLowerCase()}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => fetchComments(ticket.userPendingQueries)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <FaComments className="text-xs" />
                              View Comments
                            </button>

                            {selectedStatus === "PENDING" && (
                              <>
                                <button
                                  onClick={() => navigate(`/main/writetous/${ticket.id}?userQuery=${encodeURIComponent(ticket.query)}`)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                >
                                  <FaPen className="text-xs" />
                                  Write Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReasonModal(true);
                                    setSelectedTicketId(ticket.id);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                  <FaBan className="text-xs" />
                                  Cancel Query
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {/* Comments Modal */}
      <Modal
        title="Ticket Comments History"
        open={isCommentsModalOpen}
        onCancel={() => setIsCommentsModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className="mt-4">
          {comments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Resolved By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comments.map((comment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                     <td className="px-4 py-3 text-sm text-gray-900">{comment.resolvedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {comment.resolvedOn ? new Date(comment.resolvedOn).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-col gap-2">
                          <p>{comment.pendingComments}</p>
                          {comment.adminFileName && (
                            <button
                              onClick={() => handleFileOpen(comment.adminFilePath)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <FaFile className="text-xs" />
                              {comment.adminFileName}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No comments found for this ticket.</p>
          )}
        </div>
      </Modal>

      {/* Cancel Reason Modal */}
      <Modal
        title="Cancel Query"
        open={reasonModal}
        onOk={cancelQuery}
        onCancel={() => {
          setReasonModal(false);
          setReason("");
        }}
        confirmLoading={cancelLoader}
        okText="Submit"
        okButtonProps={{
          className: "bg-red-600 hover:bg-red-700",
        }}
      >
        <div className="mt-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Please provide a reason for cancellation
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your reason here..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default TicketHistoryPage;