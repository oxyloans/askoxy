import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Grid,
  Input,
  Modal,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CommentOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { adminApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

interface CallbackComment {
  comment: string;
  commentBy: string;
  createdAt: number | string;
}

interface CallbackRequest {
  id: string;
  askOxyOffers: string;
  projectType: string;
  mobileNumber: string;
  comments: string | null;
  status: string | null;
  message: string | null;
  createdAt: number;
  updatedAt: number;
}

const LIST_API = "/marketing-service/campgin/request-call-back/admin";
const PAGE_SIZE = 20;

const CallingTeamCallbackRequests: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRequest, setSelectedRequest] =
    useState<CallbackRequest | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [commentBy, setCommentBy] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      /*
       * The /callingteam GET endpoint is returning HTTP 500.
       * Load the same lender callback records from the working admin endpoint.
       */
      const response = await adminApi.get<CallbackRequest[]>(
        `${BASE_URL}${LIST_API}`,
        {
          headers: {
            accept: "*/*",
          },
        },
      );

      const data = Array.isArray(response.data) ? response.data : [];

      setRequests(
        [...data].sort(
          (first, second) =>
            Number(second.createdAt || 0) - Number(first.createdAt || 0),
        ),
      );
    } catch (error: any) {
      console.error("Failed to load lender callback requests:", {
        status: error?.response?.status,
        data: error?.response?.data,
        error,
      });

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to load lender callback requests.";

      setRequests([]);
      setErrorMessage(apiMessage);
      message.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((request) =>
      [request.mobileNumber, request.projectType, request.askOxyOffers]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [requests, searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [currentPage, filteredRequests.length]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRequests.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredRequests]);

  const completedFollowUps = useMemo(
    () =>
      requests.filter((request) => parseComments(request.comments).length > 0)
        .length,
    [requests],
  );

  const openCommentModal = (request: CallbackRequest) => {
    setSelectedRequest(request);
    setComment("");
    setCommentBy(""); // Always empty
    setCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    if (savingComment) return;

    setSelectedRequest(null);
    setComment("");
    setCommentBy("");
    setCommentModalOpen(false);
  };

  const submitComment = async () => {
    if (!selectedRequest) return;

    const finalComment = comment.trim();
    const finalCommentBy = commentBy.trim();

    if (!finalComment) {
      message.warning("Please enter a calling comment.");
      return;
    }

    if (!finalCommentBy) {
      message.warning("Please enter the caller name.");
      return;
    }

    const endpoint =
      `${BASE_URL}/marketing-service/campgin/request-call-back/` +
      `${selectedRequest.id}/comment`;

    /*
     * Exact request body from the supplied cURL:
     * {
     *   "comment": "hello testing",
     *   "commentBy": "sudheesh"
     * }
     */
    const payload = {
      comment: finalComment,
      commentBy: finalCommentBy,
    };

    try {
      setSavingComment(true);

      const response = await adminApi.post(endpoint, payload, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      console.log("Comment saved:", response.data);

      message.success("Calling comment saved successfully.");

      closeCommentModal();
      await fetchRequests();
    } catch (error: any) {
      console.error("Failed to save calling comment:", {
        endpoint,
        payload,
        status: error?.response?.status,
        response: error?.response?.data,
        error,
      });

      const responseData = error?.response?.data;
      const apiMessage =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === "string" ? responseData : "");

      message.error(
        apiMessage ||
          "Unable to save the calling comment. Please check the backend comment API.",
      );
    } finally {
      setSavingComment(false);
    }
  };

  const columns: ColumnsType<CallbackRequest> = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 70,
      align: "center",
      render: (_value, _record, index) =>
        (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 180,
      render: (mobileNumber: string) => (
        <a
          href={`tel:${mobileNumber}`}
          className="font-semibold text-slate-900 hover:text-blue-600"
        >
          <PhoneOutlined className="mr-2 text-blue-500" />
          {mobileNumber || "Not Available"}
        </a>
      ),
    },
    {
      title: "Lender Service",
      key: "service",
      width: 240,
      render: (_value, record) => (
        <Space direction="vertical" size={4}>
          <Tag color="blue">{formatLabel(record.projectType)}</Tag>

          <Text strong>{formatLabel(record.askOxyOffers)}</Text>
        </Space>
      ),
    },
    {
      title: "Requested Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (first, second) =>
        Number(first.createdAt) - Number(second.createdAt),
      defaultSortOrder: "descend",
      render: (createdAt: number) => (
        <div>
          <Text className="block font-medium">{formatDate(createdAt)}</Text>

          <Text type="secondary" className="text-xs">
            {formatTime(createdAt)}
          </Text>
        </div>
      ),
    },
    {
      title: "Latest Comment",
      key: "latestComment",
      width: 320,
      render: (_value, record) => {
        const comments = parseComments(record.comments);
        const latestComment = comments[comments.length - 1];

        if (!latestComment) {
          return <Text type="secondary">No comments added</Text>;
        }

        return (
          <div className="max-w-[300px]">
            <Text className="line-clamp-2 block">{latestComment.comment}</Text>

            <Text type="secondary" className="mt-1 block text-xs">
              {latestComment.commentBy || "Unknown"}
              {latestComment.createdAt
                ? ` • ${formatDateTime(latestComment.createdAt)}`
                : ""}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_value, record) => {
        const hasComments = parseComments(record.comments).length > 0;

        return (
          <Tag color={hasComments ? "green" : "orange"}>
            {hasComments ? "IN PROGRESS" : "PENDING"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 230,
      fixed: "right",
      align: "center",
      render: (_value, record) => (
        <Space>
          <Button
            icon={<PhoneOutlined />}
            href={`tel:${record.mobileNumber}`}
            disabled={!record.mobileNumber}
          >
            Call
          </Button>

          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => openCommentModal(record)}
          >
            Add Comment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-3 sm:p-5 lg:p-6">
      <Card
        className="mx-auto w-full max-w-[1550px] overflow-hidden rounded-2xl border-slate-200 shadow-sm"
        bodyStyle={{ padding: 0 }}
      >
        <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Title level={3} className="!mb-1 !text-slate-900">
                Lender Calling Follow-ups
              </Title>

              <Text type="secondary">
                Call lenders and update their follow-up comments.
              </Text>
            </div>

            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchRequests}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50/80 p-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[180px_180px_180px_minmax(320px,1fr)] xl:items-stretch">
            <SummaryCard label="Total Requests" value={requests.length} />

            <SummaryCard
              label="Pending"
              value={requests.length - completedFollowUps}
            />

            <SummaryCard
              label="Follow-ups"
              value={completedFollowUps}
            />

            <div className="flex min-h-[82px] items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:col-span-2 xl:col-span-1">
              <Input
                allowClear
                size="large"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Search mobile number, project or lender service"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="px-4 pt-4 sm:px-6">
            <Alert
              showIcon
              type="error"
              message="Unable to load requests"
              description={errorMessage}
              action={
                <Button size="small" onClick={fetchRequests}>
                  Retry
                </Button>
              }
            />
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 lg:p-8">
          <Spin spinning={loading}>
            {!loading && filteredRequests.length === 0 ? (
              <div className="grid min-h-72 place-items-center">
                <Empty description="No lender callback requests found" />
              </div>
            ) : isMobile ? (
              <>
                <div className="space-y-4">
                  {paginatedRequests.map((request, index) => (
                    <MobileRequestCard
                      key={request.id}
                      request={request}
                      serialNumber={(currentPage - 1) * PAGE_SIZE + index + 1}
                      onAddComment={openCommentModal}
                    />
                  ))}
                </div>

                {filteredRequests.length > PAGE_SIZE && (
                  <div className="mt-5 flex justify-center border-t border-slate-200 pt-5">
                    <Pagination
                      current={currentPage}
                      pageSize={PAGE_SIZE}
                      total={filteredRequests.length}
                      showSizeChanger={false}
                      size="small"
                      onChange={setCurrentPage}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total}`
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              <Table<CallbackRequest>
                rowKey="id"
                columns={columns}
                dataSource={filteredRequests}
                pagination={{
                  current: currentPage,
                  pageSize: PAGE_SIZE,
                  total: filteredRequests.length,
                  showSizeChanger: false,
                  hideOnSinglePage: true,
                  responsive: true,
                  onChange: setCurrentPage,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} requests`,
                }}
                scroll={{ x: 1400 }}
                size="middle"
              />
            )}
          </Spin>
        </div>
      </Card>

      <Modal
        open={commentModalOpen}
        onCancel={closeCommentModal}
        footer={null}
        centered
        width={650}
        destroyOnClose
        title={
          <div>
            <Title level={4} className="!mb-1">
              Add Calling Comment
            </Title>

            <Text type="secondary">
              Mobile: {selectedRequest?.mobileNumber || "Not Available"}
            </Text>
          </div>
        }
      >
        {selectedRequest && (
          <div className="space-y-5 pt-3">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Information
                label="Project"
                value={formatLabel(selectedRequest.projectType)}
              />

              <Information
                label="Service"
                value={formatLabel(selectedRequest.askOxyOffers)}
              />

              <Information
                label="Requested Date"
                value={formatDateTime(selectedRequest.createdAt)}
                fullWidth
              />
            </div>

            <div>
              <Text strong className="mb-2 block">
                Caller Name
              </Text>

              <Input
                size="large"
                value={commentBy}
                onChange={(e) => setCommentBy(e.target.value)}
                placeholder="Enter caller name"
                maxLength={100}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Text strong>Calling Comment</Text>

                <Text type="secondary" className="text-xs">
                  {comment.length}/1000
                </Text>
              </div>

              <TextArea
                rows={5}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Enter the lender call update"
                maxLength={1000}
              />
            </div>

            <PreviousComments
              comments={parseComments(selectedRequest.comments)}
            />

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <Button
                size="large"
                disabled={savingComment}
                onClick={closeCommentModal}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                size="large"
                icon={<CommentOutlined />}
                loading={savingComment}
                onClick={submitComment}
              >
                Save Comment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const SummaryCard: React.FC<{
  label: string;
  value: number;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <div
    className={`flex min-h-[82px] flex-col justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${className}`}
  >
    <Text type="secondary" className="text-xs font-semibold uppercase">
      {label}
    </Text>

    <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
  </div>
);

const MobileRequestCard: React.FC<{
  request: CallbackRequest;
  serialNumber: number;
  onAddComment: (request: CallbackRequest) => void;
}> = ({ request, serialNumber, onAddComment }) => {
  const comments = parseComments(request.comments);
  const latestComment = comments[comments.length - 1];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 p-4">
        <div>
          <Text type="secondary" className="text-xs">
            Request #{serialNumber}
          </Text>

          <a
            href={`tel:${request.mobileNumber}`}
            className="mt-1 block text-lg font-bold text-slate-900"
          >
            <PhoneOutlined className="mr-2 text-blue-500" />
            {request.mobileNumber || "Not Available"}
          </a>
        </div>

        <Tag color={comments.length > 0 ? "green" : "orange"}>
          {comments.length > 0 ? "IN PROGRESS" : "PENDING"}
        </Tag>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <Information
            label="Project"
            value={formatLabel(request.projectType)}
          />

          <Information
            label="Service"
            value={formatLabel(request.askOxyOffers)}
          />

          <Information label="Date" value={formatDate(request.createdAt)} />

          <Information label="Time" value={formatTime(request.createdAt)} />
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <Text type="secondary" className="text-xs font-semibold uppercase">
            Latest Comment
          </Text>

          <Text className="mt-2 block text-sm">
            {latestComment?.comment || "No comments added yet."}
          </Text>

          {latestComment && (
            <Text type="secondary" className="mt-1 block text-xs">
              {latestComment.commentBy || "Unknown"}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            size="large"
            icon={<PhoneOutlined />}
            href={`tel:${request.mobileNumber}`}
            disabled={!request.mobileNumber}
          >
            Call
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<CommentOutlined />}
            onClick={() => onAddComment(request)}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

const Information: React.FC<{
  label: string;
  value: string;
  fullWidth?: boolean;
}> = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <Text type="secondary" className="text-[11px] font-semibold uppercase">
      {label}
    </Text>

    <Text className="mt-1 block break-words text-sm font-semibold">
      {value || "Not Available"}
    </Text>
  </div>
);

const PreviousComments: React.FC<{
  comments: CallbackComment[];
}> = ({ comments }) => (
  <div>
    <Text strong className="mb-3 block">
      Previous Comments ({comments.length})
    </Text>

    {comments.length === 0 ? (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center">
        <Text type="secondary">No previous comments</Text>
      </div>
    ) : (
      <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
        {[...comments].reverse().map((item, index) => (
          <div
            key={`${String(item.createdAt)}-${index}`}
            className="rounded-lg border border-slate-200 p-3"
          >
            <Text className="block">{item.comment}</Text>

            <Text type="secondary" className="mt-2 block text-xs">
              {item.commentBy || "Unknown"}
              {item.createdAt ? ` • ${formatDateTime(item.createdAt)}` : ""}
            </Text>
          </div>
        ))}
      </div>
    )}
  </div>
);

const parseComments = (commentsValue: string | null): CallbackComment[] => {
  if (!commentsValue?.trim()) return [];

  try {
    const parsed = JSON.parse(commentsValue);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        comment: String(item?.comment || ""),
        commentBy: String(item?.commentBy || "Unknown"),
        createdAt: item?.createdAt || "",
      }))
      .filter((item) => item.comment.trim());
  } catch {
    return [
      {
        comment: commentsValue,
        commentBy: "Unknown",
        createdAt: "",
      },
    ];
  }
};

const formatLabel = (value?: string | null): string => {
  if (!value) return "Not Available";

  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value: number | string): string => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not Available"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatTime = (value: number | string): string => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
};

const formatDateTime = (value: number | string): string => {
  if (!value) return "Not Available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not Available"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default CallingTeamCallbackRequests;