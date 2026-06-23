import React, { useRef, useState } from "react";
import { Button, Form, Upload, Typography, message } from "antd";
import {
  FileExcelOutlined,
  RocketOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import { COLOR_PRIMARY, successButtonStyle } from "./constants";
import type { BulkCampaignResponse } from "./types";
import { getApiErrorMessage, isValidBulkCampaignFile } from "./utils";

const { Dragger } = Upload;
const { Paragraph } = Typography;

type GeneratedEmail = {
  subject?: string;
  body?: string;
};

type UpdatedBulkCampaignResponse = BulkCampaignResponse & {
  totalClients?: number;
  batchId?: string;
  generatedEmail?: GeneratedEmail;
};

const BulkClientCampaign: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (isValidBulkCampaignFile(selectedFile)) {
      setFile(selectedFile);
      return true;
    }
    message.error("Please choose a valid CSV or Excel file (.csv, .xlsx, .xls).");
    return false;
  };

  const handleBulkUpload = async () => {
    if (!file) {
      message.error("Please select a CSV or Excel file before uploading.");
      return;
    }

    setUploadLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await customerApi.post<UpdatedBulkCampaignResponse>(
        `${BASE_URL}/ai-automation/email/send-campaign/bulk`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (data.success) {
        message.success(data.message || "Bulk campaign sent successfully.");
        setSent(true);
        if (data.batchId) {
          sessionStorage.setItem("campaignBatchId", data.batchId);
          setTimeout(() => {
            window.location.href = `/email-campaign/scorecard/${data.batchId}`;
          }, 1800);
        }
      } else {
        message.error(data.message || "Bulk campaign could not be sent. Please try again.");
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, "Bulk campaign could not be sent. Please try again."));
    } finally {
      setUploadLoading(false);
    }
  };

  const resetBulkUpload = () => {
    setFile(null);
    setSent(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFileList: UploadFile[] = file
    ? [{ uid: "-1", name: file.name, status: "done", size: file.size }]
    : [];

  return (
    <div>
      <Paragraph style={{ color: "#6b7280", marginBottom: 16 }}>
        Upload a CSV or Excel file with client name and client email. The
        campaign will be generated and sent to admin for WhatsApp approval.
      </Paragraph>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="ec-hidden-file-input"
        aria-label="Upload CSV or Excel file"
        title="Upload CSV or Excel file"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) handleFileSelect(selectedFile);
        }}
      />

      <Form layout="vertical" requiredMark={false}>
        <Form.Item
          label={
            <span className="ec-form-label">
              Client List File <span className="ec-required">*</span>
            </span>
          }
          extra={<span className="ec-form-hint">Accepted formats: .csv, .xlsx, .xls only.</span>}
        >
          <Dragger
            className="ec-upload-dragger"
            accept=".csv,.xlsx,.xls"
            multiple={false}
            fileList={uploadFileList}
            beforeUpload={(selectedFile) => { handleFileSelect(selectedFile); return false; }}
            onRemove={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined style={{ color: COLOR_PRIMARY, fontSize: 44 }} />
            </p>
            <p className="ant-upload-text ec-upload-title">Drop your CSV or Excel file here</p>
            <p className="ant-upload-hint">or click to browse and select one file</p>
          </Dragger>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        size="large"
        block
        className="ec-success-btn"
        icon={sent ? <UploadOutlined /> : <RocketOutlined />}
        loading={uploadLoading}
        disabled={!file && !sent}
        onClick={sent ? resetBulkUpload : handleBulkUpload}
        style={{ ...successButtonStyle, minHeight: 46, letterSpacing: 0.25 }}
      >
        {sent ? "Upload Another File" : "Send Bulk Campaign"}
      </Button>
    </div>
  );
};

export default BulkClientCampaign;
