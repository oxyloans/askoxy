import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Alert,
  Space,
  Tag,
  Form,
  Table,
  Typography,
  Upload,
  Grid,
} from "antd";
import { GrRefresh } from "react-icons/gr";
import {
  UploadOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import {
  cardStyle,
  COLOR_BORDER,
  COLOR_PRIMARY,
  COLOR_TEXT,
  primaryButtonStyle,
  SECTION_META,
} from "./constants";
import type { PdfRecord, UploadResponse } from "./types";
import { getApiErrorMessage } from "./utils";

const { Dragger } = Upload;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 5;

const CompanyUploadPanel: React.FC = () => {
  const screens = useBreakpoint();
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [pdfRecords, setPdfRecords] = useState<PdfRecord[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllPdfs = useCallback(async () => {
    setPdfLoading(true);
    setPdfError("");

    try {
      const { data } = await customerApi.get<PdfRecord[]>(
        `${BASE_URL}/ai-automation/pdf/all`,
      );

      if (Array.isArray(data)) {
        setPdfRecords(data);
      } else {
        setPdfRecords([]);
        setPdfError("Unexpected PDF list response.");
      }
    } catch (error) {
      setPdfRecords([]);
      setPdfError(getApiErrorMessage(error, "Failed to load uploaded PDFs."));
    } finally {
      setPdfLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPdfs();
  }, [fetchAllPdfs]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadError("");
      return true;
    }

    setUploadError("Please choose a valid PDF file.");
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a PDF file before uploading.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await customerApi.post<UploadResponse>(
        `${BASE_URL}/ai-automation/pdf/upload`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setUploadResult(data);
        fetchAllPdfs();
      } else {
        setUploadError(data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadError(
        getApiErrorMessage(error, "Upload failed. Please try again."),
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const resetUploadSection = () => {
    setFile(null);
    setUploadResult(null);
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

  const cardHeadStyle = {
    background: "#ffffff",
    borderBottom: `1px solid ${COLOR_BORDER}`,
    minHeight: 58,
  };

  return (
    <div className="space-y-4">
      <Card
        className="ec-pro-card"
        title={
          <Space>
            <FilePdfOutlined style={{ color: COLOR_PRIMARY }} />
            <Text strong style={{ fontSize: 16, color: COLOR_TEXT }}>
              {SECTION_META.upload.cardTitle}
            </Text>
          </Space>
        }
        style={cardStyle}
        styles={{
          header: cardHeadStyle,
          body: { padding: screens.xs ? 16 : 24 },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="ec-hidden-file-input"
          aria-label="Upload PDF file"
          title="Upload PDF file"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) handleFileSelect(selectedFile);
          }}
        />

        <Form layout="vertical" requiredMark={false}>
          <Form.Item
            label={
              <span className="ec-form-label">
                PDF Document <span className="ec-required">*</span>
              </span>
            }
            extra={
              <span className="ec-form-hint">
                Upload only PDF files. Recommended file size: below 10 MB.
              </span>
            }
          >
            <Dragger
              className="ec-upload-dragger"
              accept=".pdf"
              multiple={false}
              fileList={uploadFileList}
              beforeUpload={(selectedFile) => {
                handleFileSelect(selectedFile);
                return false;
              }}
              onRemove={() => {
                setFile(null);
                setUploadResult(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <p className="ant-upload-drag-icon">
                <FilePdfOutlined
                  style={{ color: COLOR_PRIMARY, fontSize: 44 }}
                />
              </p>
              <p className="ant-upload-text ec-upload-title">
                Drop your PDF here
              </p>
              <p className="ant-upload-hint">
                or click to browse and select one file
              </p>
            </Dragger>
          </Form.Item>
        </Form>

        {uploadResult && (
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            message="PDF uploaded successfully"
            description={`"${uploadResult.fileName}" is indexed with ${uploadResult.chunksStored} chunk${
              uploadResult.chunksStored !== 1 ? "s" : ""
            }.`}
            style={{ marginBottom: 16, borderRadius: 12 }}
          />
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
          className="ec-primary-btn"
          icon={<UploadOutlined />}
          loading={uploadLoading}
          disabled={!file}
          onClick={handleUpload}
          style={primaryButtonStyle}
        >
          Upload PDF
        </Button>

        {uploadResult && (
          <Button
            block
            size="large"
            className="ec-outline-btn"
            onClick={resetUploadSection}
            style={{ marginTop: 12 }}
          >
            Upload Another PDF
          </Button>
        )}
      </Card>

      <Card
        className="ec-pro-card"
        title={
          <Space>
            <ThunderboltOutlined style={{ color: COLOR_PRIMARY }} />
            <Text strong style={{ fontSize: 16, color: COLOR_TEXT }}>
              All Uploaded PDFs
            </Text>
          </Space>
        }
        extra={
          <Button
            size="small"
            loading={pdfLoading}
            onClick={fetchAllPdfs}
            icon={<GrRefresh />}
            style={primaryButtonStyle}
          >
            Reload
          </Button>
        }
        style={cardStyle}
        styles={{
          header: cardHeadStyle,
          body: { padding: screens.xs ? 16 : 24 },
        }}
      >
        {pdfError && (
          <Alert
            type="error"
            message={pdfError}
            showIcon
            style={{ marginBottom: 16, borderRadius: 12 }}
          />
        )}

        <Table
          rowKey="fileId"
          loading={pdfLoading}
          dataSource={pdfRecords}
          pagination={{
            pageSize: PAGE_SIZE,
            current: currentPage,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: true }}
          locale={{
            emptyText: (
              <div className="py-6 text-center text-gray-500">
                No PDFs uploaded yet.
              </div>
            ),
          }}
          columns={[
            {
              title: "#",
              key: "index",
              width: 70,
              align: "center" as const,
              render: (_: unknown, __: PdfRecord, index: number) =>
                (currentPage - 1) * PAGE_SIZE + index + 1,
            },
            {
              title: "File Name",
              dataIndex: "fileName",
              align: "center" as const,
              key: "fileName",
              render: (value: string) => (
                <span className="font-medium text-gray-800">{value}</span>
              ),
            },
            {
              title: "File ID",
              dataIndex: "fileId",
              align: "center" as const,
              key: "fileId",
              render: (value: string) => (
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded select-all">
                  {value}
                </span>
              ),
            },
            {
              title: "Total Chunks",
              key: "totalchunks",
              align: "center" as const,
              render: (_: unknown, record: PdfRecord) => (
                <span className="text-gray-700">
                  {record.totalChunks ?? "-"}
                </span>
              ),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              align: "center" as const,
              render: (value: string) => (
                <Tag color={value === "COMPLETED" ? "green" : "blue"}>
                  {value}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CompanyUploadPanel;
