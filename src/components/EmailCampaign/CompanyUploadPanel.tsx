import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Alert,
  Form,
  Input,
  Table,
  Tag,
  Typography,
  Upload,
  Grid,
} from "antd";
import { GrRefresh } from "react-icons/gr";
import {
  UploadOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import customerApi from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
import {
  COLOR_BORDER,
  COLOR_PRIMARY,
  COLOR_TEXT,
  primaryButtonStyle,
} from "./constants";
import type { PdfRecord, UploadResponse } from "./types";
import { getApiErrorMessage } from "./utils";

const { Dragger } = Upload;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 10;

const divSection: React.CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${COLOR_BORDER}`,
  borderRadius: 14,
  padding: 24,
  marginBottom: 20,
};

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
  const [searchText, setSearchText] = useState("");
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

  const filteredRecords = pdfRecords.filter((r) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      r.fileName?.toLowerCase().includes(q) ||
      r.fileId?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Upload section */}
      <div style={divSection}>
        <Text strong style={{ fontSize: 15, color: COLOR_TEXT, display: "block", marginBottom: 16 }}>Upload PDF Document</Text>
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
      </div>
    </div>
  );
};

export default CompanyUploadPanel;
