import { Modal, Spin, Select, Button, message, SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate: string;
  customerBehaviour?: string;
  isActive?: boolean | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  userId?: string;
  updatedBy: string | null | undefined;
  storedUniqueId: string | null | undefined;
  record: any;
  BASE_URL: string;
  initialIsActive?: boolean | null;
}

const HelpDeskCommentsModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  updatedBy,
  storedUniqueId,
  record,
  BASE_URL,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userResponse, setUserResponse] = useState<string | undefined>();
  const [callingType, setCallingType] = useState<string | undefined>();
  const [orderId, setOrderId] = useState("");
  const [isActive, setIsActive] = useState<string | undefined>();
  const [currentIsActiveStatus, setCurrentIsActiveStatus] = useState<
    boolean | null | undefined
  >(null);
  const { Option } = Select;

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

  const isActiveOptions: SelectProps["options"] = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];
  const isCallingTypeOptions: SelectProps["options"] = [
    { label: "RICE", value: "RICE" },
    { label: "GOLD", value: "GOLD" },
    { label: "BOTH", value: "BOTH" },
  ];

  // Helper function to get emoji for customer behaviour
  const getCustomerBehaviourEmoji = (behaviour: string | undefined) => {
    if (!behaviour) return "";
    const option = emojiOptions.find((opt) => opt.value === behaviour);
    return option ? option.label : behaviour;
  };

  // Helper function to get display text for isActive status
  const getIsActiveDisplayText = (status: boolean | null | undefined) => {
    if (status === null || status === undefined) return "Not Set";
    return status ? "Active" : "Inactive";
  };

  // Helper function to get badge color for isActive status
  const getIsActiveBadgeColor = (status: boolean | null | undefined) => {
    if (status === null || status === undefined)
      return "bg-gray-100 text-gray-700";
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  useEffect(() => {
    console.log(userId, "userId in HelpDeskCommentsModal");

    if (open && userId) {
      fetchComments();
      // Get current isActive status from record or set from latest comment
      setCurrentIsActiveStatus(
        record?.isActive !== undefined ? record.isActive : null,
      );
      setIsActive(record?.isActive !== undefined ? record.isActive : null);
    }
  }, [open, userId, record]);

  const formatDate = (input: string) => {
    const date = new Date(input);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fetchComments = async (): Promise<void> => {
    setLoadingComments(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/fetchAdminComments`,
        { userId },
        { headers: { "Content-Type": "application/json" } },
      );
      const commentsData = Array.isArray(response.data) ? response.data : [];
      setComments(commentsData);

      // If no record isActive status, get from latest comment
      if (
        commentsData.length > 0 &&
        (record?.isActive === undefined || record?.isActive === null)
      ) {
        const latestComment = commentsData[0];
        setCurrentIsActiveStatus(latestComment.isActive);
        setIsActive(latestComment.isActive);
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        message.info("No comments found");
      } else {
        message.error("Failed to load comments. Please try again later.");
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

  const handleIsActiveChange = (value: string) => {
    setIsActive(value);
  };

  const handleSubmitComment = async (): Promise<void> => {
    if (!userResponse?.trim()) {
      message.warning("Please enter customer behaviour");
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

    // If status is being updated, include it; otherwise skip
    const shouldUpdateIsActive =
      currentIsActiveStatus === null || currentIsActiveStatus === undefined;

    let commentText = newComment;
    if (orderId) {
      commentText = `Regarding order Id ${orderId} ${newComment}`;
    }

    let commentBy = updatedBy;
    if (localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN") {
      commentBy = "ADMIN";
    }

    setSubmittingComment(true);
    try {
      const requestData: any = {
        adminComments: commentText,
        adminUserId: storedUniqueId,
        commentsUpdateBy: commentBy,
        userId,
        callingType: callingType,
        customerBehaviour: userResponse,
      };

      // Include isActive only if selected by user
      if (shouldUpdateIsActive && isActive !== undefined) {
        requestData.isActive = isActive === "true";
      }

      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        requestData,
        { headers: { "Content-Type": "application/json" } },
      );
      message.success("Comment added successfully");
      setNewComment("");
      setUserResponse(undefined);
      setCallingType(undefined);
      setIsActive(undefined);
      await fetchComments();
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
    setIsActive(undefined);
    setCurrentIsActiveStatus(null);
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
      zIndex={150}
      title="HelpDesk Comments"
      open={open}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={null}
      width={550}
    >
      <div className="flex flex-col">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Recent Comments
          </h3>
          {loadingComments ? (
            <div className="flex items-center justify-center py-6">
              <Spin />
              <span className="ml-3 text-gray-500">Loading comments...</span>
            </div>
          ) : comments.length > 0 ? (
            <div className="w-full max-w-xl max-h-80 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white">
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
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="px-3 py-1.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center mb-0.5">
                        <div
                          className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-semibold mr-2`}
                        >
                          {initials}
                        </div>
                        <span className="font-medium text-sm text-gray-800">
                          {comment.commentsUpdateBy || "Unknown"}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          {comment.customerBehaviour && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border">
                              {getCustomerBehaviourEmoji(
                                comment.customerBehaviour,
                              )}
                            </span>
                          )}
                          {comment.isActive !== undefined &&
                            comment.isActive !== null && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getIsActiveBadgeColor(
                                  comment.isActive,
                                )}`}
                              >
                                {getIsActiveDisplayText(comment.isActive)}
                              </span>
                            )}
                          <span className="text-[10px] text-gray-400">
                            {formatDate(comment.commentsCreatedDate)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 pl-8 mt-0.5 leading-snug">
                        {comment.adminComments}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
              <svg
                className="w-6 h-6 text-gray-400 mx-auto mb-2"
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
        <div className="mt-4">
          {/* User Response */}
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            User Response
          </h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a response"
            options={emojiOptions}
            value={userResponse}
            onChange={handleUserResponseChange}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Calling Type
          </h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a calling type"
            options={isCallingTypeOptions}
            value={callingType}
            onChange={handleCallingTypeChange}
          />
        </div>

        {/* User Active Status */}
        <div className="mt-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            User Active (Yes / No)
          </h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select user active status"
            options={isActiveOptions}
            value={isActive ?? "true"} // ✅ Default to "Yes"
            onChange={handleIsActiveChange}
          />

          {currentIsActiveStatus !== null &&
            currentIsActiveStatus !== undefined && (
              <div className="mt-2 text-sm text-gray-600">
                <span>Current Status: </span>
                <span
                  className={`px-3 py-1 rounded-full border ${getIsActiveBadgeColor(
                    currentIsActiveStatus,
                  )}`}
                >
                  {getIsActiveDisplayText(currentIsActiveStatus)}
                </span>
              </div>
            )}
        </div>

        {/* New Comment */}
        <div className="pt-4 mt-4">
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

          <div className="flex justify-end gap-3 pt-3">
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
