import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { ColumnsType } from "antd/es/table";
import {
  FaArrowLeft,
  FaFilter,
  FaFile,
  FaComments,
  FaBan,
  FaPen,
} from "react-icons/fa";
import {
  Modal,
  Spin,
  Select,
  Tag,
  Button,
  Card,
  Empty,
  Row,
  Col,
  message,
} from "antd";
import BASE_URL from "../Config";
import { Table } from "antd";


const { Option } = Select;

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
  resolvedOn: string;
  userQueryDocumentStatus: {
    fileName: string | null;
    filePath: string | null;
  };
  userPendingQueries: Comment[];
}

interface Comment {
  resolvedBy: string;
  resolvedOn: string | null;
  pendingComments: string;
  adminFileName: string;
  adminFilePath: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}
type TicketRow = {
  key: string;
  sno: number;
  ticketId: Ticket;
  query: Ticket;
  actions: Ticket;
  comments: string;
};

const TicketHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem("userId") || "";
  const storedProfileData = localStorage.getItem("profileData") || "";

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("PENDING");
  const [askOxyOffersFilter, setAskOxyOffersFilter] =
    useState<string>("FREESAMPLE");

  // Data
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelLoader, setCancelLoader] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Load initial profile
  useEffect(() => {
    if (storedProfileData) {
      try {
        setProfileData(JSON.parse(storedProfileData));
      } catch (error) {
        console.error("Error parsing profile data");
      }
    }
  }, [storedProfileData]);

  // Load tickets on filter change
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, askOxyOffersFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        BASE_URL + "/user-service/write/getAllQueries",
        {
          askOxyOfers:
            askOxyOffersFilter ||
            "FREERUDRAKSHA,FREEAI,ROTARIAN,WEAREHIRING,LEGALSERVICES,LAUNCHAGENTS,BLOGS,SERVICES,STUDYABROAD,FREESAMPLE",
          userId: storedUserId,
          projectType: "ASKOXY",
          queryStatus: selectedStatus,
        }
      );

      const fetchedTickets: Ticket[] = (response.data || []).map(
        (item: any) => ({
          id: item.id,
          randomTicketId: item.randomTicketId,
          createdAt: item.createdAt?.substring(0, 10) || "",
          name: item.email,
          query: item.query,
          comments: item.comments || "",
          date: item.resolvedOn
            ? new Date(item.resolvedOn).toLocaleDateString()
            : "",
          status: item.queryStatus,
          resolvedOn: item.resolvedOn || "",
          userQueryDocumentStatus: {
            fileName: item.userQueryDocumentStatus?.fileName || null,
            filePath: item.userQueryDocumentStatus?.filePath || null,
          },
          userPendingQueries: item.userPendingQueries || [],
        })
      );

      setTickets(fetchedTickets);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tickets. Please try again.");
      message.error("Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showComments = (value: Comment[]) => {
    setComments(value || []);
    setIsCommentsModalOpen(true);
  };

  const cancelQuery = async () => {
    if (!reason.trim()) {
      message.warning("Please enter a cancellation reason.");
      return;
    }

    if (!selectedTicketId) {
      message.error("No ticket selected.");
      return;
    }

    setCancelLoader(true);
    try {
      await axios.post(BASE_URL + "/user-service/write/saveData", {
        adminDocumentId: "",
        askOxyOfers: "FREESAMPLE",
        comments: reason,
        email: profileData.email,
        id: selectedTicketId,
        mobileNumber: profileData.whatsappNumber,
        projectType: "ASKOXY",
        query: "",
        queryStatus: "CANCELLED",
        resolvedBy: "user",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        userId: storedUserId,
      });

      message.success("Ticket cancelled successfully.");
      setReason("");
      setReasonModal(false);
      fetchTickets();
    } catch (error) {
      console.error(error);
      message.error("Failed to cancel query. Please try again.");
    } finally {
      setCancelLoader(false);
    }
  };

  const getStatusTag = (status: TicketStatus) => {
    switch (status) {
      case "PENDING":
        return <Tag color="gold">Pending</Tag>;
      case "COMPLETED":
        return <Tag color="green">Resolved</Tag>;
      case "CANCELLED":
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };
const getHelpText = () => {
  return selectedStatus === "PENDING"
    ? "Need more help? Reply or add a comment."
    : "View conversation history.";
};
  const openFile = (filePath: string | null) => {
    if (filePath) window.open(filePath, "_blank");
  };
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const dataSource: TicketRow[] = tickets.map((ticket, index) => ({
  key: ticket.id,
  sno: index + 1,
  ticketId: ticket,
  query: ticket,
  actions: ticket,
  comments: ticket.comments,
}));


 const columns: ColumnsType<TicketRow> = [
   {
     title: "SNO",
     dataIndex: "sno",
     key: "sno",
     width: 80,
     align: "center" as const,
   },
   {
     title: "Ticket Id",
     dataIndex: "ticketId",
     key: "ticketId",
     width: 260,
     render: (ticket: Ticket) => (
       <div>
         <div className="font-semibold text-gray-800">
           {ticket.randomTicketId}
         </div>

         <div className="text-xs text-gray-500">
           Received On: {formatDate(ticket.createdAt)}
         </div>

         <div className="mt-1">{getStatusTag(ticket.status)}</div>

         {ticket.resolvedOn && (
           <div className="text-xs text-gray-500 mt-1">
             Resolved On: {formatDate(ticket.resolvedOn)}
           </div>
         )}
       </div>
     ),
   },
   {
     title: "Query",
     dataIndex: "query",
     key: "query",

     render: (_: any, record: TicketRow) => {
       const ticket = record.ticketId;

       return (
         <div className="text-gray-800 text-sm font-medium">
           {/* User Query */}
           <p>{ticket.query}</p>

           {/* User Attachment */}
           {ticket.userQueryDocumentStatus?.fileName && (
             <Button
               type="link"
               onClick={() => openFile(ticket.userQueryDocumentStatus.filePath)}
               className="flex items-center gap-1 text-xs p-0 mt-1"
             >
               <FaFile /> {ticket.userQueryDocumentStatus.fileName}
             </Button>
           )}

           {/* Admin Comments (only comment text, no box) */}
           {ticket.comments && selectedStatus !== "PENDING" && (
             <p className="text-xs text-gray-700 mt-2">
               Admin Comments: {ticket.comments}
             </p>
           )}
         </div>
       );
     },
   },

   {
     title: "Actions",
     dataIndex: "actions",
     key: "actions",
     align: "center" as const,
     render: (ticket: Ticket) => (
       <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
         <Button
          
           icon={<FaComments />}
           onClick={() => showComments(ticket.userPendingQueries)}
           style={{
             backgroundColor: "#008cba",
             borderColor: "#a5b4fc",
             color: "#ffffff",
           }}
         >
           View Comments
         </Button>

         {selectedStatus === "PENDING" && (
           <Button
            
             icon={<FaPen />}
             className="border-green-500 text-green-600"
             style={{
               backgroundColor: "#1ab394",
               borderColor: "#a5b4fc",
               color: "#ffffff",
             }}
             onClick={() =>
               navigate(
                 `/main/writetous/${ticket.id}?userQuery=${encodeURIComponent(
                   ticket.query
                 )}`,
                 {
                   state: {
                     fromTicketHistory: true,
                     askOxyOffer: askOxyOffersFilter || "FREESAMPLE",
                   },
                 }
               )
             }
           >
             Reply
           </Button>
         )}

         {selectedStatus === "PENDING" && (
           <Button
            
             danger
             icon={<FaBan />}
             onClick={() => {
               setReasonModal(true);
               setSelectedTicketId(ticket.id);
             }}
           >
             Cancel
           </Button>
         )}
       </div>
     ),
   },
 ];
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex-1 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
        <div className="max-w-7xl mx-auto">
          {/* ---------- PAGE HEADER ---------- */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <Button
                  type="text"
                  icon={<FaArrowLeft />}
                  className="hidden sm:inline-flex"
                  onClick={() => navigate(-1)}
                />
                <div>
                  <div
                    role="heading"
                    aria-level={1}
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                  >
                    Ticket History
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                icon={<FaPen />}
                style={{
                  backgroundColor: "#6b21a8",
                  borderColor: "#6b21a8",
                  color: "#ffffff",
                }}
                size="middle"
                onClick={() => navigate("/main/writetous")}
              >
                New Ticket
              </Button>
            </div>

            {profileData?.firstName && (
              <p className="text-xs sm:text-sm text-slate-500">
                Logged in as{" "}
                <span className="font-semibold text-slate-700">
                  {profileData.firstName} {profileData.lastName}
                </span>{" "}
                ({profileData.email})
              </p>
            )}
          </div>

          <Card
            className="shadow-sm border border-slate-100 rounded-2xl"
            bodyStyle={{ padding: 0 }}
          >
            {/* ---------- FILTER SECTION ---------- */}
            <div className="px-4 py-4 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/60">
              <Row gutter={[16, 12]} align="middle">
                <Col xs={24} md={8}>
                  <div className="flex items-center gap-2 mb-1">
                    <FaFilter className="text-slate-400" />
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Filter by Status
                    </span>
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as TicketStatus)
                    }
                    className="w-full mt-1 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">RESOLVED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </Col>

                <Col xs={24} md={8}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Filter by Offer
                    </span>
                  </div>
                  <Select
                    placeholder="Filter by Offer"
                    value={askOxyOffersFilter}
                    onChange={(value) => setAskOxyOffersFilter(value)}
                    className="w-full mt-1"
                    size="middle"
                  >
                    <Option value="FREESAMPLE">RICE QUERIES</Option>
                    <Option value="BLOGS">BLOG QUERIES</Option>
                    <Option value="SERVICES">SERVICES QUERIES</Option>
                    <Option value="WEAREHIRING">JOB QUERIES</Option>
                  </Select>
                </Col>

                <Col xs={24} md={8}>
                  <div className="flex md:justify-end mt-2 md:mt-6">
                    <Button type="default" size="middle" onClick={fetchTickets}>
                      Refresh
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {/* ---------- TICKETS SECTION ---------- */}
            <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <Button type="primary" onClick={fetchTickets}>
                    Try Again
                  </Button>
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-10">
                  <Empty
                    description={
                      <span className="text-slate-500 text-sm">
                        No tickets found for the selected filters.
                      </span>
                    }
                  />
                </div>
              ) : (
                <Table<TicketRow>
                  dataSource={dataSource}
                  columns={columns}
                  bordered
                  pagination={false}
                  className="text-sm"
                  scroll={{ x: "true" }}
                />
              )}
            </div>
          </Card>
        </div>
        <Footer />
        {/* ---------- COMMENTS MODAL ---------- */}
        <Modal
  title="Ticket Comments History"
  open={isCommentsModalOpen}
  onCancel={() => setIsCommentsModalOpen(false)}
  footer={null}
  width={800}
>
  {comments.length > 0 ? (
    <Table
      dataSource={comments.map((c, i) => ({
        key: i,
        sno: i + 1,
        resolvedBy: c.resolvedBy,
        resolvedOn: c.resolvedOn,
        pendingComments: c.pendingComments,
        adminFileName: c.adminFileName,
        adminFilePath: c.adminFilePath,
      }))}
      pagination={false}
      bordered
      size="small"
      columns={[
        {
          title: "S.No",
          dataIndex: "sno",
          key: "sno",
          width: 70,
          align: "center",
        },
        {
          title: "Resolved By",
          dataIndex: "resolvedBy",
          key: "resolvedBy",
          align: "center",
          render: (value) => value || "-",
        },
        {
          title: "Date",
          dataIndex: "resolvedOn",
          key: "resolvedOn",
          align: "center",
          render: (value) =>
            value
              ? new Date(value).toLocaleDateString()
              : "-",
        },
        {
          title: "Comments / Attachments",
          dataIndex: "pendingComments",
          key: "pendingComments",
          render: (_, record) => (
            <div style={{ textAlign: "center" }}>
              <div>{record.pendingComments || "-"}</div>

              {record.adminFileName && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => openFile(record.adminFilePath)}
                  icon={<FaFile />}
                >
                  {record.adminFileName}
                </Button>
              )}
            </div>
          ),
        },
      ]}
    />
  ) : (
    <p className="text-center py-4 text-slate-500 text-sm">
      No comments found for this ticket.
    </p>
  )}
</Modal>


        {/* ---------- CANCEL MODAL ---------- */}
        <Modal
          title="Cancel Ticket"
          open={reasonModal}
          onCancel={() => {
            setReasonModal(false);
            setReason("");
          }}
          onOk={cancelQuery}
          okButtonProps={{ className: "bg-red-600" }}
          confirmLoading={cancelLoader}
          okText="Submit"
        >
          <label className="block font-medium text-sm mt-2 mb-1 text-slate-700">
            Reason for cancellation
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Please share why you want to cancel this ticket..."
          />
        </Modal>
      </div>
    </div>
  );

};

export default TicketHistoryPage;
