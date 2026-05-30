// // /src/AdminTasks.tsx
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Table,
//   Image,
//   Typography,
//   Input,
//   Button,
//   Popconfirm,
//   Tag,
//   Modal,
//   Space,
//   Empty,
//   Select,
  
// } from "antd";
// import { Row, Col } from "antd";
// import Swal from "sweetalert2";
// import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
//   import { employeeApi } from "../utils/axiosInstances";
// import UserPanelLayout from "./UserPanelLayout";
// import BASE_URL from "../Config";

// const { Text, Paragraph } = Typography;
// const { Option } = Select;

// interface CommentType {
//   commentsBy: string;
//   comments: string;
//   status?: string;
// }

// interface Task {
//   id: string;
//   image?: string | null;
//   status: string;
//   taskAssignBy: string;
//   taskAssignTo: string[] | string;
//   taskName: string;
//   taskAssignedDate: string;
//   taskCompleteDate: string | null;
//   tastCreatedDate?: string;
// }
// type StatusFilter = "all" | "assigned" | "COMPLETED";

// const STATUS_CONFIG: Record<
//   StatusFilter,
//   { color: string; bg: string; border: string; label: string }
// > = {
//   all: {
//     color: "#666",
//     bg: "#f5f5f5",
//     border: "#d9d9d9",
//     label: "All",
//   },

//   assigned: {
//     color: "#008cba",
//     bg: "#e8f6fb",
//     border: "#008cba",
//     label: "Assigned",
//   },

//   COMPLETED: {
//     color: "#1ab394",
//     bg: "#e8f8f5",
//     border: "#1ab394",
//     label: "Completed",
//   },
// };
// const Assignedtasksbasedstatus: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [allSearchTasks, setAllSearchTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [commentsModalVisible, setCommentsModalVisible] = useState(false);
//   const [commentsData, setCommentsData] = useState<CommentType[]>([]);
//   const [comments, setComments] = useState("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(50);
//   const [totalElements, setTotalElements] = useState<number>(0);
// const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

//   const isSearchMode = searchText.trim().length > 0;

//   const normalizeTasks = (list: any[]): Task[] => {
//     return (Array.isArray(list) ? list : []).filter((task: any) => {
//       const assigned = task?.taskAssignTo;
//       const hasValidAssignee = Array.isArray(assigned)
//         ? assigned.some((a: string) => a && String(a).trim() !== "")
//         : typeof assigned === "string" && assigned.trim() !== "";

//       const hasValidTaskName =
//         typeof task?.taskName === "string" && task.taskName.trim() !== "";

//       return task?.id && hasValidAssignee && hasValidTaskName;
//     });
//   };

//   const filterByStatus = (list: Task[], status: string) => {
//     return list.filter(
//       (task) => task.status?.toUpperCase() === status.toUpperCase(),
//     );
//   };

//   const formatDate = (dateString?: string | null) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
//       return date.toLocaleDateString("en-IN", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         weekday: "short",
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const fetchTasks = useCallback(
//     async (
//       page: number = currentPage,
//       size: number = pageSize,
//       status: string = statusFilter,
//       search: string = searchText,
//     ) => {
//       setLoading(true);

//       try {
//         const cleanSearch = search.trim();

//         if (cleanSearch) {
//           /*
//             Search API:
//             GET /api/ai-service/agent/messages?search=may

//             This API returns a direct array, so pagination is handled on frontend
//             for a smooth user experience.
//           */
//           const response = await employeeApi.get(
//             `${BASE_URL}/ai-service/agent/messages`,
//             { params: { search: cleanSearch } },
//           );

//           const searchedTasks = normalizeTasks(response.data || []);
//           const statusFilteredTasks = filterByStatus(searchedTasks, status);
//           const startIndex = (page - 1) * size;
//           const endIndex = startIndex + size;

//           setAllSearchTasks(statusFilteredTasks);
//           setTasks(statusFilteredTasks.slice(startIndex, endIndex));
//           setTotalElements(statusFilteredTasks.length);
//           return;
//         }

//       let response;

//       if (status === "all") {
//         response = await employeeApi.get(
//           `${BASE_URL}/ai-service/agent/messagesBasedOnStatus`,
//         );
//       } else {
//         response = await employeeApi.get(
//           `${BASE_URL}/ai-service/agent/messagesBasedOnStatus`,
//           {
//             params: {
//               status,
//             },
//           },
//         );
//       }

//         /*
//           Status API:
//           GET /api/ai-service/agent/messagesBasedOnStatus?status=assigned
//           GET /api/ai-service/agent/messagesBasedOnStatus?status=completed

//           This API returns a direct array, not { content: [] }.
//         */
//         const data = response.data;
//         const rawList = Array.isArray(data) ? data : data?.content || [];
//         const pageTasks = normalizeTasks(rawList);
//       const filteredContent =
//         status === "all" ? pageTasks : filterByStatus(pageTasks, status);
//         const startIndex = (page - 1) * size;
//         const endIndex = startIndex + size;

//         setAllSearchTasks([]);
//         setTasks(filteredContent.slice(startIndex, endIndex));
//         setTotalElements(
//           Array.isArray(data)
//             ? filteredContent.length
//             : data?.totalElements || filteredContent.length || 0,
//         );
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to fetch tasks",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [currentPage, pageSize, statusFilter, searchText],
//   );

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchText(searchInput.trim());
//       setCurrentPage(1);
//     }, 450);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   useEffect(() => {
//     fetchTasks(currentPage, pageSize, statusFilter, searchText);
//   }, [currentPage, pageSize, statusFilter, searchText, fetchTasks]);



//   const handleResetFilters = () => {
//     setSearchInput("");
//     setSearchText("");
//   setStatusFilter("all");
//     setCurrentPage(1);
//   };

//   const handleStatusUpdate = async (id: string, newStatus: string) => {
//     try {
//       await employeeApi.patch(
//         `${BASE_URL}/ai-service/agent/taskUpdate?id=${id}&status=${newStatus}`,
//         {},
//       );
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `Task marked as ${newStatus.toLowerCase()}`,
//       });
//       await fetchTasks(currentPage, pageSize, statusFilter, searchText);
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update task status",
//       });
//     }
//   };

//   const handleCommentsUpdate = async () => {
//     if (!comments.trim()) {
//       Swal.fire({
//         icon: "warning",
//         title: "Warning",
//         text: "Please enter a comment before submitting.",
//       });
//       return;
//     }

//     try {
//       await employeeApi.post(
//         `${BASE_URL}/ai-service/agent/userAndRadhaSirComments`,
//         {
//           taskId: selectedTask?.id,
//           comments,
//           commentsBy: "EMPLOYEE",
//         },
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Comment added successfully!",
//       });

//       setCommentsModalVisible(false);
//       setComments("");
//       await fetchTasks(currentPage, pageSize, statusFilter, searchText);
//       if (selectedTask) handleViewComments(selectedTask);
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to add comment",
//       });
//     }
//   };

//   const handleViewComments = async (task: Task) => {
//     try {
//       setLoading(true);
//       setSelectedTask(task);
//       const response = await employeeApi.get(
//         `${BASE_URL}/ai-service/agent/taskedIdBasedOnComments`,
//         { params: { taskId: task.id } },
//       );
//       setCommentsData(response.data || []);
//       setViewModalVisible(true);
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch comments",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAssignedToText = (taskAssignTo: string[] | string) => {
//     if (Array.isArray(taskAssignTo)) {
//       return taskAssignTo
//         .map((item) => String(item).replace(/^\[|\]$/g, "").trim())
//         .filter(Boolean)
//         .join(", ");
//     }

//     return String(taskAssignTo || "")
//       .replace(/^\[|\]$/g, "")
//       .trim();
//   };

//   const renderFileCell = (url?: string | null) => {
//     if (!url) {
//       return <span style={{ color: "#bbb", fontSize: 12 }}>No File</span>;
//     }

//     const lower = url.toLowerCase();
//     const isImage = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/.test(lower);
//     const isPdf = lower.includes(".pdf");
//     const isExcel = /\.(xls|xlsx)(\?.*)?$/.test(lower);

//     if (isImage) {
//       return (
//         <Image
//           width={72}
//           height={72}
//           src={url}
//           preview
//           style={{ borderRadius: 8, objectFit: "cover" }}
//         />
//       );
//     }

//     return (
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ fontSize: 12, color: "#008cba", fontWeight: 600 }}
//       >
//         {isPdf ? "View PDF" : isExcel ? "View Excel" : "View File"}
//       </a>
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         title: "#",
//         key: "serial",
//         width: 55,
//         align: "center" as const,
//         render: (_: any, __: Task, index: number) => (
//           <span style={{ fontWeight: 600, color: "#888", fontSize: 13 }}>
//             {index + 1 + (currentPage - 1) * pageSize}
//           </span>
//         ),
//       },
//       {
//         title: "Task Details",
//         key: "task_info",
//         width: 230,
//         render: (_: any, record: Task) => {
//           const assignedTo = getAssignedToText(record.taskAssignTo);

//           return (
//             <div style={{ minWidth: 210 }}>
//               <div style={{ marginBottom: 6 }}>
//                 <Tag
//                   color="geekblue"
//                   style={{ fontSize: 11, margin: 0, borderRadius: 4 }}
//                 >
//                   #{record.id.slice(-6).toUpperCase()}
//                 </Tag>
//               </div>

//               <div style={{ marginBottom: 4 }}>
//                 <span style={{ fontSize: 11, color: "#999" }}>By: </span>
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#351664" }}>
//                   {record.taskAssignBy || "—"}
//                 </span>
//               </div>

//               <div>
//                 <span style={{ fontSize: 11, color: "#999" }}>To: </span>
//                 <span style={{ fontSize: 12, fontWeight: 500, color: "#008cba" }}>
//                   {assignedTo || "—"}
//                 </span>
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         title: "Task Description",
//         dataIndex: "taskName",
//         key: "taskName",
//         width: 430,
//         render: (text: string) => (
//           <div style={{ maxHeight: 150, overflowY: "auto", paddingRight: 8 }}>
//             <Paragraph
//               style={{
//                 margin: 0,
//                 fontSize: 13,
//                 color: "#333",
//                 lineHeight: 1.6,
//                 whiteSpace: "pre-wrap",
//                 wordBreak: "break-word",
//               }}
//             >
//               {text}
//             </Paragraph>
//           </div>
//         ),
//       },
//       {
//         title: "Date & Status",
//         key: "timeline",
//         width: 180,
//         render: (_: any, record: Task) => {
//           const statusKey = record.status?.toUpperCase() as StatusFilter;
//           const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.assigned;

//           return (
//             <div>
//               <div style={{ marginBottom: 6 }}>
//                 <span style={{ fontSize: 12, color: "#555" }}>
//                   {record.taskAssignedDate
//                     ? formatDate(record.taskAssignedDate)
//                     : "—"}
//                 </span>
//               </div>

//               {record.tastCreatedDate && (
//                 <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
//                   {record.tastCreatedDate}
//                 </div>
//               )}

//               <Tag
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 600,
//                   borderRadius: 20,
//                   padding: "2px 10px",
//                   border: `1px solid ${statusConfig.border}`,
//                   background: statusConfig.bg,
//                   color: statusConfig.color,
//                 }}
//               >
//                 {record.status}
//               </Tag>
//             </div>
//           );
//         },
//       },
//       {
//         title: "Attachment",
//         dataIndex: "image",
//         key: "image",
//         width: 110,
//         align: "center" as const,
//         render: (url?: string | null) => renderFileCell(url),
//       },
//       {
//         title: "Actions",
//         key: "actions",
//         width: 165,
//         align: "center" as const,
//         render: (_: any, record: Task) => (
//           <Space direction="vertical" size={6} style={{ width: "100%" }}>
//             {record.status?.toLowerCase() !== "completed" && (
//               <Popconfirm
//                 title="Mark this task as completed?"
//                 onConfirm={() => handleStatusUpdate(record.id, "COMPLETED")}
//                 okText="Yes"
//                 cancelText="No"
//                 okButtonProps={{
//                   style: { background: "#1ab394", borderColor: "#1ab394" },
//                 }}
//               >
//                 <Button
//                   size="small"
//                   block
//                   style={{
//                     background: "#1ab394",
//                     borderColor: "#1ab394",
//                     color: "#fff",
//                     borderRadius: 6,
//                     fontWeight: 500,
//                   }}
//                 >
//                   Complete
//                 </Button>
//               </Popconfirm>
//             )}

//             <Button
//               size="small"
//               block
//               style={{
//                 background: "#008cba",
//                 borderColor: "#008cba",
//                 color: "#fff",
//                 borderRadius: 6,
//                 fontWeight: 500,
//               }}
//               onClick={() => {
//                 setSelectedTask(record);
//                 setCommentsModalVisible(true);
//               }}
//             >
//               Add Comment
//             </Button>

//             <Button
//               size="small"
//               block
//               style={{
//                 background: "#351664",
//                 borderColor: "#351664",
//                 color: "#fff",
//                 borderRadius: 6,
//                 fontWeight: 500,
//               }}
//               onClick={() => handleViewComments(record)}
//             >
//               View Comments
//             </Button>
//           </Space>
//         ),
//       },
//     ],
//     [currentPage, pageSize],
//   );

//   const cfg = STATUS_CONFIG[statusFilter];

//   return (
//     <UserPanelLayout>
//       <div style={{ padding: "20px 16px", minHeight: "100vh" }}>
//         <Row
//           gutter={[16, 16]}
//           align="middle"
//           justify="space-between"
//           style={{ marginBottom: 20 }}
//         >
//           {/* Left Side */}
//           <Col xs={24} md={10} lg={12}>
//             <div>
//               <div
//                 style={{
//                   color: "#111",
//                   fontSize: 22,
//                   fontWeight: 700,
//                   lineHeight: 1.3,
//                 }}
//               >
//                 WhatsApp Assigned Tasks
//               </div>

//               <div
//                 style={{
//                   color: "#888",
//                   fontSize: 13,
//                   marginTop: 4,
//                   lineHeight: 1.5,
//                 }}
//               >
//                 Manage, search, and track assigned and completed tasks.
//               </div>
//             </div>
//           </Col>

//           {/* Right Side */}
//           <Col xs={24} md={14} lg={12}>
//             <div
//               style={{
//                 display: "flex",
//                 gap: 12,
//                 justifyContent: "flex-end",
//                 flexWrap: "wrap",
//               }}
//             >
//               <Input
//                 prefix={<SearchOutlined style={{ color: "#bbb" }} />}
//                 suffix={
//                   searchInput ? (
//                     <CloseCircleOutlined
//                       style={{ color: "#999", cursor: "pointer" }}
//                       onClick={() => {
//                         setSearchInput("");
//                         setSearchText("");
//                         setCurrentPage(1);
//                       }}
//                     />
//                   ) : null
//                 }
//                 placeholder="Search names, tasks, month, year..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 allowClear={false}
//                 style={{
//                   width: 300,
//                   maxWidth: "100%",
//                   height: 40,
//                   borderRadius: 22,
//                 }}
//               />

//               <Select
//   value={statusFilter}
//   onChange={(value) => {
//     setCurrentPage(1);
//     setStatusFilter(value as StatusFilter);
//   }}
//   style={{ width: 180 }}
//   size="large"
// >
//   <Option value="all">ALL</Option>
//   <Option value="assigned">ASSIGNED</Option>
//   <Option value="COMPLETED">COMPLETED</Option>
// </Select>
//             </div>
//           </Col>
//         </Row>

//         <Table
//           columns={columns}
//           dataSource={tasks}
//           rowKey={(r) => r.id}
//           loading={loading}
//           bordered
//           locale={{
//             emptyText: (
//               <Empty
//                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 description={
//                   <span style={{ color: "#aaa", fontSize: 14 }}>
//                     {searchText
//                       ? `No tasks found for "${searchText}"`
//                       : `No ${cfg.label.toLowerCase()} tasks`}
//                   </span>
//                 }
//               />
//             ),
//           }}
//           pagination={{
//             current: currentPage,
//             pageSize,
//             total: totalElements,
//             showSizeChanger: true,
//             pageSizeOptions: ["50", "100", "200", "300"],
//             showTotal: (total, range) => (
//               <span style={{ fontSize: 13, color: "#666" }}>
//                 {range[0]}–{range[1]} of <strong>{total}</strong> tasks
//                 {isSearchMode ? " found" : ""}
//               </span>
//             ),
//             onChange: (page, size) => {
//               setCurrentPage(page);
//               if (size !== pageSize) {
//                 setPageSize(size);
//                 setCurrentPage(1);
//               }

//               if (isSearchMode && allSearchTasks.length > 0) {
//                 const nextSize = size || pageSize;
//                 const startIndex = (page - 1) * nextSize;
//                 const endIndex = startIndex + nextSize;
//                 setTasks(allSearchTasks.slice(startIndex, endIndex));
//               }
//             },
//             style: { padding: "12px 16px" },
//           }}
//           showHeader
//           scroll={{ x: true }}
//           style={{ fontSize: 13 }}
//         />
//       </div>

//       <Modal
//         title="Comments"
//         open={viewModalVisible}
//         onCancel={() => setViewModalVisible(false)}
//         footer={
//           <Button
//             onClick={() => {
//               setViewModalVisible(false);
//               setSelectedTask(selectedTask);
//               setCommentsModalVisible(true);
//             }}
//             style={{
//               background: "#008cba",
//               borderColor: "#008cba",
//               color: "#fff",
//               borderRadius: 6,
//             }}
//           >
//             Add Comment
//           </Button>
//         }
//         width={580}
//         styles={{
//           body: { maxHeight: 420, overflowY: "auto", padding: "16px 20px" },
//         }}
//       >
//         {commentsData.length > 0 ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {commentsData.map((comment, index) => (
//               <div
//                 key={index}
//                 style={{
//                   background: "#f8faff",
//                   border: "1px solid #e3eaf5",
//                   borderLeft: "4px solid #008cba",
//                   borderRadius: 8,
//                   padding: "12px 14px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 6,
//                     gap: 8,
//                   }}
//                 >
//                   <div
//                     style={{ display: "flex", alignItems: "center", gap: 6 }}
//                   >
//                     <div
//                       style={{
//                         width: 28,
//                         height: 28,
//                         borderRadius: "50%",
//                         background: "#351664",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#fff",
//                         fontSize: 12,
//                         fontWeight: 700,
//                       }}
//                     >
//                       {(comment.commentsBy || "?")[0].toUpperCase()}
//                     </div>

//                     <span
//                       style={{
//                         fontWeight: 600,
//                         fontSize: 13,
//                         color: "#351664",
//                       }}
//                     >
//                       {comment.commentsBy}
//                     </span>
//                   </div>

//                   {comment.status && (
//                     <Tag
//                       color={
//                         comment.status.toLowerCase() === "completed"
//                           ? "success"
//                           : comment.status.toLowerCase() === "rejected"
//                             ? "error"
//                             : "processing"
//                       }
//                       style={{ borderRadius: 10, fontSize: 11 }}
//                     >
//                       {comment.status}
//                     </Tag>
//                   )}
//                 </div>

//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: 13,
//                     color: "#444",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   {comment.comments}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <Empty
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//             description="No comments yet for this task."
//           />
//         )}
//       </Modal>

//       <Modal
//         title="Add Comment"
//         open={commentsModalVisible}
//         onCancel={() => {
//           setCommentsModalVisible(false);
//           setComments("");
//         }}
//         onOk={handleCommentsUpdate}
//         okText="Submit"
//         cancelText="Cancel"
//         okButtonProps={{
//           style: {
//             background: "#008cba",
//             borderColor: "#008cba",
//             borderRadius: 6,
//             fontWeight: 600,
//           },
//         }}
//         cancelButtonProps={{ style: { borderRadius: 6 } }}
//         width={500}
//       >
//         <div style={{ marginBottom: 8 }}>
//           <Text style={{ fontSize: 13, color: "#555" }}>
//             Task:{" "}
//             <strong style={{ color: "#351664" }}>
//               {selectedTask?.taskName?.slice(0, 60)}
//               {(selectedTask?.taskName?.length || 0) > 60 ? "…" : ""}
//             </strong>
//           </Text>
//         </div>

//         <Input.TextArea
//           rows={4}
//           value={comments}
//           onChange={(e) => setComments(e.target.value)}
//           placeholder="Write your comment here..."
//           style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
//           maxLength={500}
//           showCount
//         />
//       </Modal>
//     </UserPanelLayout>
//   );
// };

// export default Assignedtasksbasedstatus;
// /src/AdminTasks.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Image,
  Typography,
  Input,
  Button,
  Popconfirm,
  Tag,
  Modal,
  Space,
  Empty,
  Select,
  
} from "antd";
import { Row, Col } from "antd";
import Swal from "sweetalert2";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { employeeApi } from "../utils/axiosInstances";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";

const { Text, Paragraph } = Typography;
const { Option } = Select;

interface CommentType {
  commentsBy: string;
  comments: string;
  status?: string;
}

interface Task {
  id: string;
  image?: string | null;
  status: string;
  taskAssignBy: string;
  taskAssignTo: string[] | string;
  taskName: string;
  taskAssignedDate: string;
  taskCompleteDate: string | null;
  tastCreatedDate?: string;
}
type StatusFilter = "all" | "assigned" | "COMPLETED";

const STATUS_CONFIG: Record<
  StatusFilter,
  { color: string; bg: string; border: string; label: string }
> = {
  all: {
    color: "#666",
    bg: "#f5f5f5",
    border: "#d9d9d9",
    label: "All",
  },

  assigned: {
    color: "#008cba",
    bg: "#e8f6fb",
    border: "#008cba",
    label: "Assigned",
  },

  COMPLETED: {
    color: "#1ab394",
    bg: "#e8f8f5",
    border: "#1ab394",
    label: "Completed",
  },
};
const Assignedtasksbasedstatus: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allSearchTasks, setAllSearchTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [comments, setComments] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const isSearchMode = searchText.trim().length > 0;

  const normalizeTasks = (list: any[]): Task[] => {
    return (Array.isArray(list) ? list : []).filter((task: any) => {
      const assigned = task?.taskAssignTo;
      const hasValidAssignee = Array.isArray(assigned)
        ? assigned.some((a: string) => a && String(a).trim() !== "")
        : typeof assigned === "string" && assigned.trim() !== "";

      const hasValidTaskName =
        typeof task?.taskName === "string" && task.taskName.trim() !== "";

      return task?.id && hasValidAssignee && hasValidTaskName;
    });
  };

  const filterByStatus = (list: Task[], status: string) => {
    return list.filter(
      (task) => task.status?.toUpperCase() === status.toUpperCase(),
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      });
    } catch {
      return dateString;
    }
  };

  const fetchTasks = useCallback(
    async (
      page: number = currentPage,
      size: number = pageSize,
      status: string = statusFilter,
      search: string = searchText,
    ) => {
      setLoading(true);

      try {
        const cleanSearch = search.trim();

        if (cleanSearch) {
          /*
            Search API:
            GET /api/ai-service/agent/messages?search=may

            This API returns a direct array, so pagination is handled on frontend
            for a smooth user experience.
          */
          const response = await employeeApi.get(
            `${BASE_URL}/ai-service/agent/messages`,
            { params: { search: cleanSearch } },
          );

          const searchedTasks = normalizeTasks(response.data || []);
          const statusFilteredTasks =
            status === "all" ? searchedTasks : filterByStatus(searchedTasks, status);
          const startIndex = (page - 1) * size;
          const endIndex = startIndex + size;

          setAllSearchTasks(statusFilteredTasks);
          setTasks(statusFilteredTasks.slice(startIndex, endIndex));
          setTotalElements(statusFilteredTasks.length);
          return;
        }

      let response;

      if (status === "all") {
        response = await employeeApi.get(
          `${BASE_URL}/ai-service/agent/messagesBasedOnStatus`,
        );
      } else {
        response = await employeeApi.get(
          `${BASE_URL}/ai-service/agent/messagesBasedOnStatus`,
          {
            params: {
              status,
            },
          },
        );
      }

        /*
          Status API:
          GET /api/ai-service/agent/messagesBasedOnStatus?status=assigned
          GET /api/ai-service/agent/messagesBasedOnStatus?status=completed

          This API returns a direct array, not { content: [] }.
        */
        const data = response.data;
        const rawList = Array.isArray(data) ? data : data?.content || [];
        const pageTasks = normalizeTasks(rawList);
      const filteredContent =
        status === "all" ? pageTasks : filterByStatus(pageTasks, status);
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;

        setAllSearchTasks([]);
        setTasks(filteredContent.slice(startIndex, endIndex));
        setTotalElements(
          Array.isArray(data)
            ? filteredContent.length
            : data?.totalElements || filteredContent.length || 0,
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch tasks",
        });
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, statusFilter, searchText],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(searchInput.trim());
      setCurrentPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchTasks(currentPage, pageSize, statusFilter, searchText);
  }, [currentPage, pageSize, statusFilter, searchText, fetchTasks]);



  const handleResetFilters = () => {
    setSearchInput("");
    setSearchText("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const normalizeName = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const getLoggedInUserName = () =>
    normalizeName(sessionStorage.getItem("Name") || "");

  const getAssignedNames = (taskAssignTo: string[] | string) => {
    const assignedText = getAssignedToText(taskAssignTo);

    return assignedText
      .split(",")
      .map((name) => normalizeName(name))
      .filter(Boolean);
  };

  const canLoggedInUserAccessTask = (task: Task) => {
    const loggedInName = getLoggedInUserName();
    const assignedNames = getAssignedNames(task.taskAssignTo);

    if (!loggedInName || assignedNames.length === 0) return false;

    return assignedNames.some(
      (assignedName) =>
        assignedName === loggedInName ||
        assignedName.includes(loggedInName) ||
        loggedInName.includes(assignedName),
    );
  };

  const showAccessRestrictedMessage = (action: "complete" | "comment") => {
    Swal.fire({
      icon: "warning",
      title: "Access Restricted",
      text:
        action === "complete"
          ? "This task is assigned to another employee. Only the assigned employee can mark this task as completed."
          : "This task is assigned to another employee. Only the assigned employee can add comments or update task progress.",
      confirmButtonColor: "#008cba",
    });
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await employeeApi.patch(
        `${BASE_URL}/ai-service/agent/taskUpdate?id=${id}&status=${newStatus}`,
        {},
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Task marked as ${newStatus.toLowerCase()} successfully.`,
      });
      await fetchTasks(currentPage, pageSize, statusFilter, searchText);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update task status",
      });
    }
  };

  const handleCommentsUpdate = async () => {
    if (!comments.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a comment before submitting.",
      });
      return;
    }

    try {
      await employeeApi.post(
        `${BASE_URL}/ai-service/agent/userAndRadhaSirComments`,
        {
          taskId: selectedTask?.id,
          comments,
          commentsBy: "EMPLOYEE",
        },
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Comment added successfully!",
      });

      setCommentsModalVisible(false);
      setComments("");
      await fetchTasks(currentPage, pageSize, statusFilter, searchText);
      if (selectedTask) handleViewComments(selectedTask);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add comment",
      });
    }
  };

  const handleViewComments = async (task: Task) => {
    try {
      setLoading(true);
      setSelectedTask(task);
      const response = await employeeApi.get(
        `${BASE_URL}/ai-service/agent/taskedIdBasedOnComments`,
        { params: { taskId: task.id } },
      );
      setCommentsData(response.data || []);
      setViewModalVisible(true);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch comments",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssignedToText = (taskAssignTo: string[] | string) => {
    if (Array.isArray(taskAssignTo)) {
      return taskAssignTo
        .map((item) => String(item).replace(/^\[|\]$/g, "").trim())
        .filter(Boolean)
        .join(", ");
    }

    return String(taskAssignTo || "")
      .replace(/^\[|\]$/g, "")
      .trim();
  };

  const renderFileCell = (url?: string | null) => {
    if (!url) {
      return <span style={{ color: "#bbb", fontSize: 12 }}>No File</span>;
    }

    const lower = url.toLowerCase();
    const isImage = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/.test(lower);
    const isPdf = lower.includes(".pdf");
    const isExcel = /\.(xls|xlsx)(\?.*)?$/.test(lower);

    if (isImage) {
      return (
        <Image
          width={72}
          height={72}
          src={url}
          preview
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: "#008cba", fontWeight: 600 }}
      >
        {isPdf ? "View PDF" : isExcel ? "View Excel" : "View File"}
      </a>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "#",
        key: "serial",
        width: 55,
        align: "center" as const,
        render: (_: any, __: Task, index: number) => (
          <span style={{ fontWeight: 600, color: "#888", fontSize: 13 }}>
            {index + 1 + (currentPage - 1) * pageSize}
          </span>
        ),
      },
      {
        title: "Task Details",
        key: "task_info",
        width: 230,
        render: (_: any, record: Task) => {
          const assignedTo = getAssignedToText(record.taskAssignTo);

          return (
            <div style={{ minWidth: 210 }}>
              <div style={{ marginBottom: 6 }}>
                <Tag
                  color="geekblue"
                  style={{ fontSize: 11, margin: 0, borderRadius: 4 }}
                >
                  #{record.id.slice(-6).toUpperCase()}
                </Tag>
              </div>

              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#999" }}>By: </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#351664" }}>
                  {record.taskAssignBy || "—"}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "#999" }}>To: </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#008cba" }}>
                  {assignedTo || "—"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Task Description",
        dataIndex: "taskName",
        key: "taskName",
        width: 430,
        render: (text: string) => (
          <div style={{ maxHeight: 150, overflowY: "auto", paddingRight: 8 }}>
            <Paragraph
              style={{
                margin: 0,
                fontSize: 13,
                color: "#333",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {text}
            </Paragraph>
          </div>
        ),
      },
      {
        title: "Date & Status",
        key: "timeline",
        width: 180,
        render: (_: any, record: Task) => {
          const statusKey = record.status?.toUpperCase() as StatusFilter;
          const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.assigned;

          return (
            <div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#555" }}>
                  {record.taskAssignedDate
                    ? formatDate(record.taskAssignedDate)
                    : "—"}
                </span>
              </div>

              {record.tastCreatedDate && (
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
                  {record.tastCreatedDate}
                </div>
              )}

              <Tag
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 20,
                  padding: "2px 10px",
                  border: `1px solid ${statusConfig.border}`,
                  background: statusConfig.bg,
                  color: statusConfig.color,
                }}
              >
                {record.status}
              </Tag>
            </div>
          );
        },
      },
      {
        title: "Attachment",
        dataIndex: "image",
        key: "image",
        width: 110,
        align: "center" as const,
        render: (url?: string | null) => renderFileCell(url),
      },
      {
        title: "Actions",
        key: "actions",
        width: 165,
        align: "center" as const,
        render: (_: any, record: Task) => (
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            {record.status?.toLowerCase() !== "completed" && (
              <Popconfirm
                title="Mark this task as completed?"
                onConfirm={() => {
                  if (!canLoggedInUserAccessTask(record)) {
                    showAccessRestrictedMessage("complete");
                    return;
                  }

                  handleStatusUpdate(record.id, "COMPLETED");
                }}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                  style: { background: "#1ab394", borderColor: "#1ab394" },
                }}
              >
                <Button
                  size="small"
                  block
                  style={{
                    background: "#1ab394",
                    borderColor: "#1ab394",
                    color: "#fff",
                    borderRadius: 6,
                    fontWeight: 500,
                  }}
                >
                  Complete
                </Button>
              </Popconfirm>
            )}

            <Button
              size="small"
              block
              style={{
                background: "#008cba",
                borderColor: "#008cba",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 500,
              }}
              onClick={() => {
                if (!canLoggedInUserAccessTask(record)) {
                  showAccessRestrictedMessage("comment");
                  return;
                }

                setSelectedTask(record);
                setCommentsModalVisible(true);
              }}
            >
              Add Comment
            </Button>

            <Button
              size="small"
              block
              style={{
                background: "#351664",
                borderColor: "#351664",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 500,
              }}
              onClick={() => handleViewComments(record)}
            >
              View Comments
            </Button>
          </Space>
        ),
      },
    ],
    [currentPage, pageSize],
  );

  const cfg = STATUS_CONFIG[statusFilter];

  return (
    <UserPanelLayout>
      <div style={{ padding: "20px 16px", minHeight: "100vh" }}>
        <Row
          gutter={[16, 16]}
          align="middle"
          justify="space-between"
          style={{ marginBottom: 20 }}
        >
          {/* Left Side */}
          <Col xs={24} md={10} lg={12}>
            <div>
              <div
                style={{
                  color: "#111",
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                WhatsApp Assigned Tasks
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: 13,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                Manage, search, and track assigned and completed tasks.
              </div>
            </div>
          </Col>

          {/* Right Side */}
          <Col xs={24} md={14} lg={12}>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Input
                prefix={<SearchOutlined style={{ color: "#bbb" }} />}
                suffix={
                  searchInput ? (
                    <CloseCircleOutlined
                      style={{ color: "#999", cursor: "pointer" }}
                      onClick={() => {
                        setSearchInput("");
                        setSearchText("");
                        setCurrentPage(1);
                      }}
                    />
                  ) : null
                }
                placeholder="Search names, tasks, month, year..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                allowClear={false}
                style={{
                  width: 300,
                  maxWidth: "100%",
                  height: 40,
                  borderRadius: 22,
                }}
              />

              <Select
  value={statusFilter}
  onChange={(value) => {
    setCurrentPage(1);
    setStatusFilter(value as StatusFilter);
  }}
  style={{ width: 180 }}
  size="large"
>
  <Option value="all">ALL</Option>
  <Option value="assigned">ASSIGNED</Option>
  <Option value="COMPLETED">COMPLETED</Option>
</Select>
            </div>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tasks}
          rowKey={(r) => r.id}
          loading={loading}
          bordered
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: "#aaa", fontSize: 14 }}>
                    {searchText
                      ? `No tasks found for "${searchText}"`
                      : `No ${cfg.label.toLowerCase()} tasks`}
                  </span>
                }
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalElements,
            showSizeChanger: true,
            pageSizeOptions: ["50", "100", "200", "300"],
            showTotal: (total, range) => (
              <span style={{ fontSize: 13, color: "#666" }}>
                {range[0]}–{range[1]} of <strong>{total}</strong> tasks
                {isSearchMode ? " found" : ""}
              </span>
            ),
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1);
              }

              if (isSearchMode && allSearchTasks.length > 0) {
                const nextSize = size || pageSize;
                const startIndex = (page - 1) * nextSize;
                const endIndex = startIndex + nextSize;
                setTasks(allSearchTasks.slice(startIndex, endIndex));
              }
            },
            style: { padding: "12px 16px" },
          }}
          showHeader
          scroll={{ x: true }}
          style={{ fontSize: 13 }}
        />
      </div>

      <Modal
        title="Comments"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={
          <Button
            onClick={() => {
              if (selectedTask && !canLoggedInUserAccessTask(selectedTask)) {
                showAccessRestrictedMessage("comment");
                return;
              }

              setViewModalVisible(false);
              setSelectedTask(selectedTask);
              setCommentsModalVisible(true);
            }}
            style={{
              background: "#008cba",
              borderColor: "#008cba",
              color: "#fff",
              borderRadius: 6,
            }}
          >
            Add Comment
          </Button>
        }
        width={580}
        styles={{
          body: { maxHeight: 420, overflowY: "auto", padding: "16px 20px" },
        }}
      >
        {commentsData.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {commentsData.map((comment, index) => (
              <div
                key={index}
                style={{
                  background: "#f8faff",
                  border: "1px solid #e3eaf5",
                  borderLeft: "4px solid #008cba",
                  borderRadius: 8,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#351664",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {(comment.commentsBy || "?")[0].toUpperCase()}
                    </div>

                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#351664",
                      }}
                    >
                      {comment.commentsBy}
                    </span>
                  </div>

                  {comment.status && (
                    <Tag
                      color={
                        comment.status.toLowerCase() === "completed"
                          ? "success"
                          : comment.status.toLowerCase() === "rejected"
                            ? "error"
                            : "processing"
                      }
                      style={{ borderRadius: 10, fontSize: 11 }}
                    >
                      {comment.status}
                    </Tag>
                  )}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#444",
                    lineHeight: 1.6,
                  }}
                >
                  {comment.comments}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No comments yet for this task."
          />
        )}
      </Modal>

      <Modal
        title="Add Comment"
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments("");
        }}
        onOk={handleCommentsUpdate}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: "#008cba",
            borderColor: "#008cba",
            borderRadius: 6,
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        width={500}
      >
        <div style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Task:{" "}
            <strong style={{ color: "#351664" }}>
              {selectedTask?.taskName?.slice(0, 60)}
              {(selectedTask?.taskName?.length || 0) > 60 ? "…" : ""}
            </strong>
          </Text>
        </div>

        <Input.TextArea
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write your comment here..."
          style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
          maxLength={500}
          showCount
        />
      </Modal>
    </UserPanelLayout>
  );
};

export default Assignedtasksbasedstatus;
