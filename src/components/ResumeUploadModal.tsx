import React, { useState, useEffect } from "react";
import { Modal, Upload, Button, message, Spin, Steps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

type Props = {
  open: boolean;
  onClose: () => void;
  onExamAlreadyPassed?: () => void;
  userId: string;
  jobId: string;
  jobDesignation: string;
  companyName: string;
};

const ResumeUploadModal: React.FC<Props> = ({
  open,
  onClose,
  onExamAlreadyPassed,
  userId,
  jobId,
  jobDesignation,
  companyName,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [statusText, setStatusText] = useState<string>("");

  const navigate = useNavigate();

  // 🔹 If candidate has already passed exam (status: true) for this jobId, bypass upload and trigger cover letter modal
  useEffect(() => {
    if (!open || !jobId || !userId) return;

    const checkAlreadyPassed = async () => {
      const isLocallyPassed =
        sessionStorage.getItem(`examPassed_${jobId}`) === "true" ||
        localStorage.getItem(`examPassed_${jobId}`) === "true" ||
        localStorage.getItem(`examPassed_${userId}_${jobId}`) === "true";

      if (isLocallyPassed) {
        onClose();
        if (onExamAlreadyPassed) {
          onExamAlreadyPassed();
        }
        return;
      }

      try {
        const historyId =
          sessionStorage.getItem(`atsScoreHistoryId_${jobId}`) ||
          localStorage.getItem(`atsScoreHistoryId_${jobId}`) ||
          sessionStorage.getItem("atsScoreHistoryId") ||
          localStorage.getItem("atsScoreHistoryId") ||
          "";
        const historyQuery = historyId
          ? `&atsScoreHistoryId=${encodeURIComponent(historyId)}`
          : "";
        const res = await axios.get(
          `${BASE_URL}/marketing-service/campgin/exam-score-new?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}${historyQuery}`,
        );

        if (res.data?.status === true) {
          sessionStorage.setItem("examPassed", "true");
          sessionStorage.setItem(`examPassed_${jobId}`, "true");
          localStorage.setItem(`examPassed_${jobId}`, "true");
          if (userId) {
            localStorage.setItem(`examPassed_${userId}_${jobId}`, "true");
          }

          if (res.data?.atsScoreViewerId) {
            const vId = String(res.data.atsScoreViewerId);
            sessionStorage.setItem("atsScoreViewerId", vId);
            sessionStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
            localStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
            if (userId) {
              localStorage.setItem(`atsScoreViewerId_${userId}_${jobId}`, vId);
            }
          }

          onClose();
          if (onExamAlreadyPassed) {
            onExamAlreadyPassed();
          }
        }
      } catch (err) {
        // Not passed or error, proceed with normal upload modal
      }
    };

    checkAlreadyPassed();
  }, [open, jobId, userId, onClose, onExamAlreadyPassed]);

  const handleFileChange = async (info: any) => {
    const file = info.file;
    if (!file) return;

    setLoading(true);

    try {
      // 🔹 STEP 1: Upload
      setCurrentStep(0);
      setStatusText("Uploading Resume...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("fileType", "resume");
      formData.append("jobId", jobId);

      const uploadRes = await axios.post(
        `${BASE_URL}/marketing-service/campgin/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const fileUrl = uploadRes.data?.documentPath;

      if (!fileUrl) {
        message.error("Upload failed");
        return;
      }

      setFileList([file]);

      // 🔹 Persist resumeUrl in sessionStorage and localStorage scoped by jobId
      sessionStorage.setItem("resumeUrl", fileUrl);
      sessionStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
      localStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
      if (userId) {
        localStorage.setItem(`resumeUrl_${userId}_${jobId}`, fileUrl);
      }

      // 🔹 STEP 2: ATS
      setCurrentStep(1);
      setStatusText("Checking ATS...");

      const atsRes = await axios.post(
        `${BASE_URL}/marketing-service/campgin/response-api/ats-score-checker-new`,
        {
          userId,
          jobId,
          resumeUrl: fileUrl,
          type: "ATS",
        },
      );

      const isEligible = atsRes.data?.status === true;

      const atsScoreHistoryId = atsRes.data?.atsHistoryData?.id;
      if (atsScoreHistoryId) {
        sessionStorage.setItem("atsScoreHistoryId", String(atsScoreHistoryId));
        sessionStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
        localStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
      }

      // 🔹 STEP 3: EXAM STEP
      setCurrentStep(2);

      if (isEligible) {
        setStatusText("Eligible! Starting your exam... 🎯");
        message.success("You are eligible for the exam!");

        // ⏳ Small delay for UX
        setTimeout(() => {
          navigate("/main/exam", {
            state: {
              // Migrated identifier (OpenAI Responses API). runId/threadId are
              // kept only for backward compatibility with older links.
              responseId: atsRes.data.responseId,
              runId: atsRes.data.runId,
              threadId: atsRes.data.threadId,
              jobId,
              jobDesignation,
              companyName,
              matchScore: atsRes.data?.data?.matchScore,
              atsScoreHistoryId,
              fileUrl,
            },
          });
        }, 1500);
      } else {
        setStatusText("Not eligible. Redirecting...");
        message.warning(atsRes.data?.message || "You are not eligible.");

        setTimeout(() => {
          navigate("/main/job-analysis-result", {
            state: {
              atsData: atsRes.data,
              jobId,
              jobDesignation,
              companyName,
            },
          });
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
      setCurrentStep(-1);
      setStatusText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Upload Resume"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {/* Upload */}
      <Upload
        customRequest={() => {}}
        beforeUpload={() => false}
        onChange={handleFileChange}
        fileList={fileList}
        accept=".pdf,.doc,.docx"
        maxCount={1}
        disabled={loading}
      >
        <Button icon={<UploadOutlined />} loading={loading} block size="large">
          {loading ? "Processing..." : "Upload Resume"}
        </Button>
      </Upload>

      {/* ✅ STEPS */}
      {currentStep >= 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-xl">
          <Steps
            current={currentStep}
            size="small"
            items={[
              { title: "Upload" },
              { title: "ATS Check" },
              { title: "Exam 🎯" }, // ✅ UPDATED
            ]}
          />

          <div className="text-center mt-4">
            <Spin spinning={loading} />
            <p className="mt-2 text-gray-600 font-medium">{statusText}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ResumeUploadModal;
