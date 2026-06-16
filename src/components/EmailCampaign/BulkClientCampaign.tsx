import React, { useRef, useState } from "react";
import { Button, Alert, Form, Upload, Typography, Card, Divider } from "antd";
import {
  UploadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import { COLOR_PRIMARY, successButtonStyle } from "./constants";
import type { BulkCampaignResponse } from "./types";
import { getApiErrorMessage, isValidBulkCampaignFile } from "./utils";

const { Dragger } = Upload;
const { Text, Paragraph, Title } = Typography;

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
  const [uploadError, setUploadError] = useState("");
  const [bulkResult, setBulkResult] =
    useState<UpdatedBulkCampaignResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (isValidBulkCampaignFile(selectedFile)) {
      setFile(selectedFile);
      setUploadError("");
      setBulkResult(null);
      return true;
    }

    setUploadError(
      "Please choose a valid CSV or Excel file (.csv, .xlsx, .xls).",
    );
    return false;
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setUploadError("Please select a CSV or Excel file before uploading.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await customerApi.post<UpdatedBulkCampaignResponse>(
        `${BASE_URL}/ai-automation/email/send-campaign/bulk`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setBulkResult(data);
      } else {
        setUploadError(
          data.message || "Bulk campaign could not be sent. Please try again.",
        );
      }
    } catch (error) {
      setUploadError(
        getApiErrorMessage(
          error,
          "Bulk campaign could not be sent. Please try again.",
        ),
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const resetBulkUpload = () => {
    setFile(null);
    setBulkResult(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFileList: UploadFile[] = file
    ? [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          size: file.size,
        },
      ]
    : [];

  return (
    <div>
      <Paragraph style={{ color: "#6b7280", marginBottom: 16 }}>
        Upload a CSV or Excel file with client names and email addresses. The
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
          extra={
            <span className="ec-form-hint">
              Accepted formats: .csv, .xlsx, .xls only.
            </span>
          }
        >
          <Dragger
            className="ec-upload-dragger"
            accept=".csv,.xlsx,.xls"
            multiple={false}
            fileList={uploadFileList}
            beforeUpload={(selectedFile) => {
              handleFileSelect(selectedFile);
              return false;
            }}
            onRemove={() => {
              setFile(null);
              setBulkResult(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined
                style={{ color: COLOR_PRIMARY, fontSize: 44 }}
              />
            </p>
            <p className="ant-upload-text ec-upload-title">
              Drop your CSV or Excel file here
            </p>
            <p className="ant-upload-hint">
              or click to browse and select one file
            </p>
          </Dragger>
        </Form.Item>
      </Form>

      {bulkResult && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="Bulk campaign generated successfully"
          description={
            <div>
              <Text>{bulkResult.message}</Text>

              <div style={{ marginTop: 10, lineHeight: 1.8 }}>
                {bulkResult.totalClients != null && (
                  <div>
                    <strong>Total clients:</strong> {bulkResult.totalClients}
                  </div>
                )}

                {bulkResult.batchId && (
                  <div>
                    <strong>Batch ID:</strong> {bulkResult.batchId}
                  </div>
                )}

                {bulkResult.totalProcessed != null && (
                  <div>
                    <strong>Total processed:</strong>{" "}
                    {bulkResult.totalProcessed}
                  </div>
                )}

                {bulkResult.successful != null && (
                  <div>
                    <strong>Successful:</strong> {bulkResult.successful}
                  </div>
                )}

                {bulkResult.failed != null && (
                  <div>
                    <strong>Failed:</strong> {bulkResult.failed}
                  </div>
                )}
              </div>
            </div>
          }
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      {bulkResult?.generatedEmail && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 12,
            borderColor: "#d9f7be",
            background: "#fcfffa",
          }}
          title={
            <span>
              <MailOutlined style={{ marginRight: 8, color: COLOR_PRIMARY }} />
              Generated Email Preview
            </span>
          }
        >
          {bulkResult.generatedEmail.subject && (
            <>
              <Text strong>Subject</Text>
              <Title level={5} style={{ marginTop: 6, marginBottom: 12 }}>
                {bulkResult.generatedEmail.subject}
              </Title>
            </>
          )}

          {bulkResult.generatedEmail.body && (
            <>
              <Divider style={{ margin: "12px 0" }} />
              <Text strong>Email Body</Text>
              <Paragraph
                style={{
                  marginTop: 8,
                  whiteSpace: "pre-line",
                  color: "#374151",
                  lineHeight: 1.7,
                }}
              >
                {bulkResult.generatedEmail.body}
              </Paragraph>
            </>
          )}
        </Card>
      )}

      {uploadError && (
        <Alert
          type="error"
          message={uploadError}
          showIcon
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        className="ec-success-btn"
        icon={bulkResult ? <UploadOutlined /> : <RocketOutlined />}
        loading={uploadLoading}
        disabled={!file && !bulkResult}
        onClick={bulkResult ? resetBulkUpload : handleBulkUpload}
        style={{
          ...successButtonStyle,
          minHeight: 46,
          letterSpacing: 0.25,
        }}
      >
        {bulkResult ? "Upload Another File" : "Send Bulk Campaign"}
      </Button>
    </div>
  );
};

export default BulkClientCampaign;
