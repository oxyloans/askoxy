
import React, { useState } from "react";
import { Modal, Upload, Button, message, Spin, Steps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  jobId: string;
  jobDesignation: string;
  companyName: string;
};

const ResumeUploadModal: React.FC<Props> = ({
  open,
  onClose,
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const fileUrl = uploadRes.data?.documentPath;

      if (!fileUrl) {
        message.error("Upload failed");
        return;
      }

      setFileList([file]);

      // 🔹 STEP 2: ATS
      setCurrentStep(1);
      setStatusText("Checking ATS...");

      const atsRes = await axios.get(
        `${BASE_URL}/marketing-service/campgin/ats-score-checker?jobId=${jobId}&ResumeUrl=${encodeURIComponent(fileUrl)}&type=ATS`
      );

      const isEligible = atsRes.data?.status === true;

      // 🔹 STEP 3: EXAM STEP
      setCurrentStep(2);

      if (isEligible) {
        setStatusText("Eligible! Starting your exam... 🎯");
        message.success("You are eligible for the exam!");

        // ⏳ Small delay for UX
        setTimeout(() => {
          navigate("/main/exam", {
            state: {
              runId: atsRes.data.runId,
              threadId: atsRes.data.threadId,
              jobId,
              jobDesignation,
              companyName,
              matchScore: atsRes.data?.data?.matchScore,
              fileUrl,
            },
          });
        }, 1500);

      } else {
        setStatusText("Not eligible. Redirecting...");
        message.warning(
          atsRes.data?.message || "You are not eligible."
        );

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
        <Button
          icon={<UploadOutlined />}
          loading={loading}
          block
          size="large"
        >
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
            <p className="mt-2 text-gray-600 font-medium">
              {statusText}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ResumeUploadModal;









