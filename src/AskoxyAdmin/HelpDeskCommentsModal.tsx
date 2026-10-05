import { Modal, Spin, Select, Button, message, SelectProps, Input } from "antd";
import React, { useEffect, useState } from "react";
import { adminApi } from "../utils/axiosInstances";
import axios from "axios";
import DEFAULT_BASE_URL from "../Config";

const { TextArea } = Input;

interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate: string;
  customerBehaviour?: string;
  callingType?: string;
  dataType?: string;
  isActive?: boolean | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (newComment: string, details?: any) => void;
  userId?: string;
  updatedBy?: string | null | undefined;
  storedUniqueId?: string | null | undefined;
  record?: any;
  BASE_URL?: string;
  dataType?: string;
  initialIsActive?: boolean | null;
}

const HelpDeskCommentsModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  userId,
  updatedBy,
  storedUniqueId,
  record,
  BASE_URL = DEFAULT_BASE_URL,
  dataType,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userResponse, setUserResponse] = useState<string | undefined>();
  const [callingType, setCallingType] = useState<string | undefined>();
  const [orderId, setOrderId] = useState("");

  const emojiOptions: SelectProps["options"] = [
    { label: "😊 Polite", value: "POLITE" },
    { label: "😎 Friendly", value: "FRIENDLY" },
    { label: "😎 Cool", value: "COOL" },
    { label: "😤 Frustrated", value: "FRUSTRATED" },
    { label: "😞 Disappointed", value: "DISAPPOINTED" },
    { label: "😠 Rude", value: "RUDE" },
    { label: "😡 Angry", value: "ANGRY" },
    { label: "🤝 Understanding", value: "UNDERSTANDING" },
    { label: "😕 Confused", value: "CONFUSED" },
    { label: "📞 Busy", value: "BUSY" },
    { label: "📴 Out of Service", value: "OUTOFSERVICE" },
    { label: "❌ Not Connected", value: "NOTCONNECTED" },
    { label: "🔌 Disconnected", value: "DISCONNECTED" },
    { label: "⏳ Call Waiting", value: "CALLWAITING" },
  ];

  const isCallingTypeOptions: SelectProps["options"] = [
    { label: "RICE", value: "RICE" },
    { label: "GOLD", value: "GOLD" },
    { label: "BOTH", value: "BOTH" },
    { label: "OFFICIAL DATA", value: "OFFICIAL_DATA" },
    { label: "OFFICIAL", value: "OFFICIAL" },
    { label: "GENERAL", value: "GENERAL" },
  ];

  // Helper function to get emoji for customer behaviour
  const getCustomerBehaviourEmoji = (behaviour: string | undefined) => {
    if (!behaviour) return "";
    const option = emojiOptions.find((opt) => opt.value === behaviour);
    return option ? option.label : behaviour;
  };

  useEffect(() => {
    if (open && (userId || record?.id || record?.userId)) {
      const targetUserId = userId || record?.id || record?.userId;
      fetchComments(targetUserId);
    }
  }, [open, userId, record]);

  const formatDate = (input: string) => {
    if (!input) return "";
    const date = new Date(input);
    if (isNaN(date.getTime())) return input;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchComments = async (targetId?: string): Promise<void> => {
    const idToFetch = targetId || userId || record?.id || record?.userId;
    if (!idToFetch) return;

    setLoadingComments(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/fetchAdminComments`,
        { userId: idToFetch },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const commentsData = Array.isArray(response.data) ? response.data : [];
        setComments(commentsData);
      }
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            message.error("Bad request. Please check the user ID.");
            break;
          case 401:
            message.error("Unauthorized. Please login again.");
            break;
          case 403:
            message.error("Access forbidden. You don't have permission.");
            break;
          case 404:
          case 500:
            // No previous comments
            break;
          case 502:
          case 503:
            message.error("Service unavailable. Please try again later.");
            break;
          default:
            break;
        }
      }
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleUserResponseChange = (value: string) => {
    setUserResponse(value);
  };

  const handleCallingTypeChange = (value: string) => {
    setCallingType(value);
  };

  const handleSubmitComment = async (): Promise<void> => {
    if (!userResponse?.trim()) {
      message.warning("Please select user response");
      return;
    }
    if (!callingType?.trim()) {
      message.warning("Please select calling type");
      return;
    }
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    let commentText = newComment.trim();
    if (orderId) {
      commentText = `Regarding order Id ${orderId}: ${commentText}`;
    }

    const currentUserName =
      updatedBy || localStorage.getItem("admin_userName")?.toUpperCase() || "ADMIN";
    const currentAdminId =
      storedUniqueId || localStorage.getItem("admin_uniquId") || "";
    let commentBy = currentUserName;
    if (localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN") {
      commentBy = "ADMIN";
    }

    const targetUserId = userId || record?.id || record?.userId;
    const effectiveDataType = dataType || record?.dataType;

    setSubmittingComment(true);
    try {
      const requestData: any = {
        adminComments: commentText,
        adminUserId: currentAdminId,
        commentsUpdateBy: commentBy,
        userId: targetUserId,
        callingType: callingType,
        customerBehaviour: userResponse,
      };

      if (effectiveDataType) {
        requestData.dataType = effectiveDataType;
      }

      await adminApi.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Comment added successfully");
      if (onSuccess) {
        onSuccess(commentText, {
          customerBehaviour: userResponse,
          callingType,
          dataType: effectiveDataType,
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const resetForm = () => {
    setComments([]);
    setOrderId("");
    setNewComment("");
    setUserResponse(undefined);
    setCallingType(undefined);
  };

  const colorOptions = [
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];

  return (
    <Modal
      zIndex={1050}
      title="HelpDesk Comments"
      open={open}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={null}
      width={560}
      destroyOnClose
    >
      <div className="flex flex-col">
        {/* Recent Comments Section */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Recent Comments
          </h3>
          {loadingComments ? (
            <div className="flex items-center justify-center py-6">
              <Spin />
              <span className="ml-3 text-gray-500">Loading comments...</span>
            </div>
          ) : comments.length > 0 ? (
            <div className="w-full max-h-64 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white divide-y divide-gray-100">
              {comments.map((comment, index) => {
                const initials = (comment.commentsUpdateBy || "U")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();
                const color =
                  colorOptions[
                    (comment.commentsUpdateBy?.length || 0) %
                      colorOptions.length
                  ];

                return (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center mb-1">
                      <div
                        className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-semibold mr-2 shrink-0`}
                      >
                        {initials}
                      </div>
                      <span className="font-medium text-sm text-gray-800 truncate mr-2">
                        {comment.commentsUpdateBy || "Unknown"}
                      </span>
                      <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
                        {comment.customerBehaviour && (
                          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                            {getCustomerBehaviourEmoji(
                              comment.customerBehaviour
                            )}
                          </span>
                        )}
                        {comment.callingType && (
                          <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                            {comment.callingType}
                          </span>
                        )}
                        {comment.dataType && (
                          <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                            {comment.dataType}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatDate(comment.commentsCreatedDate)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 pl-8 mt-0.5 leading-relaxed break-words whitespace-pre-wrap">
                      {comment.adminComments}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
              <svg
                className="w-6 h-6 text-gray-400 mx-auto mb-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm text-gray-500">No comments available</p>
            </div>
          )}
        </div>

        {/* User Response */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">
            User Response <span className="text-red-500">*</span>
          </h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a response"
            options={emojiOptions}
            value={userResponse}
            onChange={handleUserResponseChange}
          />
        </div>

        {/* Calling Type */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">
            Calling Type <span className="text-red-500">*</span>
          </h3>
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Select a calling type"
            options={isCallingTypeOptions}
            value={callingType}
            onChange={handleCallingTypeChange}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              String(option?.value ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </div>

        {/* New Comment */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">
            Comment <span className="text-red-500">*</span>
          </h3>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="text-sm rounded-lg border-gray-300"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={submittingComment}
              onClick={handleSubmitComment}
              className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HelpDeskCommentsModal;
