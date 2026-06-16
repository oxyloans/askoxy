import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Upload,
  Space,
  Tag,
  Spin,
  Empty,
  Modal,
  Form,
  message,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  InboxOutlined,
  DeleteOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { GrRefresh } from "react-icons/gr";
import { AxiosError } from "axios";
import { adminApi as axiosInstance } from "../../utils/axiosInstances";
import BASE_URL from "../../Config";
const BASE = `${BASE_URL}/ai-automation/vector-store`;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string; error?: string }>;
  const status = err.response?.status;
  const data = err.response?.data;
  const msg = data?.message || data?.error;
  if (msg) return status ? `[${status}] ${msg}` : msg;
  if (status) return `[${status}] ${fallback}`;
  return `Network error — ${fallback}`;
};

interface VectorStore {
  id: string;
  name: string;
  status: string;
}

interface VectorFile {
  fileId: string;
  fileName: string;
}

interface VectorStoreListResponse {
  success?: boolean;
  message?: string;
  data?: VectorStore[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

const btnPrimary = { background: "#008cba", color: "#fff", border: "none" };
const btnGreen = { background: "#1ab394", color: "#fff", border: "none" };

const VectorStorePage: React.FC = () => {
  const [stores, setStores] = useState<VectorStore[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingMoreStores, setLoadingMoreStores] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreStores, setHasMoreStores] = useState(false);
  const [storePage, setStorePage] = useState(1);

  const [createModal, setCreateModal] = useState(false);
  const [createForm] = Form.useForm();
  const [creating, setCreating] = useState(false);

  const [renameModal, setRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<VectorStore | null>(null);
  const [renameForm] = Form.useForm();
  const [renaming, setRenaming] = useState(false);

  const [uploadModal, setUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<VectorStore | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [searchId, setSearchId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredStores, setFilteredStores] = useState<VectorStore[] | null>(
    null,
  );

 const handleSearchStore = async () => {
   const search = searchId.trim();

   if (!search) {
     setFilteredStores(null);
     return;
   }

   setSearchLoading(true);

   try {
     const { data: json } = await axiosInstance.get(
       `${BASE}/searchVectorStore`,
       {
         params: { search },
       },
     );

     if (json.success && json.data) {
       setFilteredStores(Array.isArray(json.data) ? json.data : [json.data]);
       setStorePage(1);
     } else {
       message.error(json.message || "Vector Store not found.");
       setFilteredStores([]);
     }
   } catch (error) {
     message.error(getErrorMessage(error, "Failed to search store."));
     setFilteredStores([]);
   } finally {
     setSearchLoading(false);
   }
  };
useEffect(() => {
  const search = searchId.trim();

  if (!search) {
    setFilteredStores(null);
    setSearchLoading(false);
    return;
  }

  setSearchLoading(true);

  const timer = setTimeout(() => {
    handleSearchStore();
  }, 500);

  return () => clearTimeout(timer);
}, [searchId]);
  const handleClearSearch = () => {
    setSearchId("");
    setFilteredStores(null);
  };

  const [viewModal, setViewModal] = useState(false);
  const [viewTarget, setViewTarget] = useState<VectorStore | null>(null);
  const [files, setFiles] = useState<VectorFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filePage, setFilePage] = useState(1);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [fileSearchName, setFileSearchName] = useState("");
  const [fileSearchLoading, setFileSearchLoading] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState<VectorFile[] | null>(null);

  const handleFileSearch = async () => {
    const fileName = fileSearchName.trim();
    if (!fileName) {
      setFilteredFiles(null);
      return;
    }
    if (!viewTarget) return;
    setFileSearchLoading(true);
    try {
      const { data: json } = await axiosInstance.get(
        `${BASE}/${viewTarget.id}/files/search`,
        { params: { fileName } },
      );
      if (json.success) {
        setFilteredFiles([json.data]);
        setFilePage(1);
      } else {
        message.error(json.message || "File not found.");
        setFilteredFiles([]);
      }
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to search file."));
    } finally {
      setFileSearchLoading(false);
    }
  };

  const normalizeStoreListResponse = (json: VectorStoreListResponse) => {
    return {
      data: json.data ?? [],
      nextCursor: json.nextCursor ?? null,
      hasMore: Boolean(json.hasMore),
    };
  };

  const fetchAllStores = async (options?: {
    after?: string;
    append?: boolean;
  }) => {
    const isLoadMore = Boolean(options?.append);

    if (isLoadMore) setLoadingMoreStores(true);
    else setLoadingStores(true);

    try {
      const { data: json } = await axiosInstance.get<VectorStoreListResponse>(
        `${BASE}/getAllVectorStore`,
        {
          params: {
            limit: 20,
            ...(options?.after ? { after: options.after } : {}),
          },
        },
      );

      if (json.success === false) {
        message.error(json.message || "Failed to fetch stores.");
        return;
      }

      const result = normalizeStoreListResponse(json);

      setStores((prev) =>
        options?.append ? [...prev, ...result.data] : result.data,
      );
      setNextCursor(result.nextCursor);
      setHasMoreStores(result.hasMore);

      if (!options?.append) setStorePage(1);
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to fetch stores."));
    } finally {
      if (isLoadMore) setLoadingMoreStores(false);
      else setLoadingStores(false);
    }
  };

  const refreshStores = async () => {
    setFilteredStores(null);
    setSearchId("");
    await fetchAllStores();
  };

  const loadMoreStores = async () => {
    if (!nextCursor || loadingMoreStores) return;
    await fetchAllStores({ after: nextCursor, append: true });
  };

  useEffect(() => {
    fetchAllStores();
  }, []);

  const handleCreate = async (values: { name: string }) => {
   
    setCreating(true);
    try {
      const { data: json } = await axiosInstance.post(
        `${BASE}/createVectorStore`,
        { name: values.name.trim() },
      );
      if (json.success) {
        message.success(
          `Vector Store "${json.data.name}" created successfully!`,
        );
        createForm.resetFields();
        setCreating(false);
        setCreateModal(false);
        await refreshStores();
      } else {
        message.error(json.message || "Failed to create store.");
        setCreating(false);
      }
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to create store."));
    } finally {
      setCreating(false);
    }
  };

  const openRenameModal = (store: VectorStore) => {
    setRenameTarget(store);
    renameForm.setFieldsValue({ name: store.name });
    setRenameModal(true);
  };

  const handleRename = async (values: { name: string }) => {
    if (!renameTarget) return;

    const newName = values.name.trim();
   

    if (newName === renameTarget.name.trim()) {
      message.info("No changes found.");
      return;
    }

    setRenaming(true);
    try {
      const { data: json } = await axiosInstance.patch(
        `${BASE}/${renameTarget.id}/update-name`,
        null,
        { params: { name: newName } },
      );

      if (json.success) {
        message.success(
          json.message || "Vector Store name updated successfully.",
        );
        setRenameModal(false);
        setRenameTarget(null);
        renameForm.resetFields();
        await refreshStores();
      } else {
        message.error(json.message || "Failed to update store name.");
      }
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to update store name."));
    } finally {
      setRenaming(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadTarget || !uploadFile) {
      message.warning("Please select a file to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      const { data: json } = await axiosInstance.post(
        `${BASE}/${uploadTarget.id}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (json.success) {
        message.success(`"${json.data.fileName}" uploaded successfully!`);
        setUploadFile(null);
        setUploadModal(false);
      } else {
        message.error(json.message || "Upload failed.");
      }
    } catch (error) {
      message.error(getErrorMessage(error, "Upload failed."));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (store: VectorStore) => {
    Modal.confirm({
      title: "Delete Vector Store",
      content: (
        <span>
          Are you sure you want to delete <strong>{store.name}</strong>? This
          action cannot be undone.
        </span>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        setDeleting(store.id);
        try {
          const { data: json } = await axiosInstance.delete(
            `${BASE}/${store.id}`,
          );
          if (json.success) {
            message.success(`"${store.name}" deleted successfully!`);
            await refreshStores();
          } else {
            message.error(json.message || "Failed to delete store.");
          }
        } catch (error) {
          message.error(getErrorMessage(error, "Failed to delete store."));
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleDeleteFile = (file: VectorFile) => {
    if (!viewTarget) return;
    Modal.confirm({
      title: "Delete File",
      content: (
        <span>
          Are you sure you want to delete <strong>{file.fileName}</strong>? This
          cannot be undone.
        </span>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        setDeletingFile(file.fileId);
        try {
          const { data: json } = await axiosInstance.delete(
            `${BASE}/${viewTarget.id}/files/${file.fileId}`,
          );
          if (json.success) {
            message.success(`"${file.fileName}" deleted successfully!`);
            setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
          } else {
            message.error(json.message || "Failed to delete file.");
          }
        } catch (error) {
          message.error(getErrorMessage(error, "Failed to delete file."));
        } finally {
          setDeletingFile(null);
        }
      },
    });
  };

  const openViewModal = async (store: VectorStore) => {
    setViewTarget(store);
    setViewModal(true);
    setLoadingFiles(true);
    setFilePage(1);
    setFiles([]);
    setFileSearchName("");
    setFilteredFiles(null);
    try {
      const { data: json } = await axiosInstance.get(
        `${BASE}/${store.id}/files`,
      );
      if (json.success) setFiles(json.data);
      else message.error(json.message || "Failed to fetch files.");
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to fetch files."));
    } finally {
      setLoadingFiles(false);
    }
  };

  const storeColumns = [
    {
      title: "SNo.",
      key: "index",
      align: "center" as const,
      width: 56,
     render: (_: any, __: any, i: number) => (
  <span className="text-gray-500 text-sm">{i + 1}</span>
),
    },
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      render: (name: string) => (
        <div className="text-center whitespace-normal break-words">
          <span className="font-semibold text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: "Store ID",
      dataIndex: "id",
      key: "id",
      align: "center" as const,
      render: (id: string) => (
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded select-all">
          {id}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => (
        <h3 style={{ color: status === "ACTIVE" ? "#1ab394" : "#008cba" }}>
          {status}
        </h3>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: VectorStore) => (
        <Space size={8}>
          <Tooltip title="Edit Store">
            <Button
              size="middle"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => openRenameModal(record)}
            />
          </Tooltip>
          <Tooltip title="Upload File">
            <Button
              size="middle"
              shape="circle"
              icon={<UploadOutlined />}
              style={btnPrimary}
              onClick={() => {
                setUploadTarget(record);
                setUploadFile(null);
                setUploadModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="View Files">
            <Button
              size="middle"
              shape="circle"
              icon={<FolderOpenOutlined />}
              style={btnGreen}
              onClick={() => openViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="middle"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              loading={deleting === record.id}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fileColumns = [
    {
      title: "SNo.",
      key: "index",
      align: "center" as const,

      render: (_: any, __: any, i: number) => (
        <span className="text-gray-500 text-sm">{i + 1}</span>
      ),
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      align: "center" as const,
      key: "fileName",
      render: (name: string) => <span className="text-gray-800">{name}</span>,
    },
    {
      title: "File ID",
      dataIndex: "fileId",
      key: "fileId",
      align: "center" as const,
      render: (id: string) => (
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded select-all">
          {id}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: VectorFile) => (
        <Tooltip title="Delete File">
          <Button
            size="small"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            loading={deletingFile === record.fileId}
            onClick={() => handleDeleteFile(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 p-2 pt-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title Section */}
          <div className="w-full lg:w-auto">
            <h1 className="m-0 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
              Vector Store Manager
            </h1>

            {/* <p className="text-gray-500 text-sm sm:text-base mt-1 mb-0 max-w-2xl">
              Create and manage your vector stores — upload files and view
              contents
            </p> */}
          </div>

          {/* Actions Section */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <Input
              placeholder="Search by Store ID or Store Name…"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              allowClear
              onClear={handleClearSearch}
              className="w-full rounded-lg sm:w-[260px]"
            />

            {/* <Button
              size="middle"
              loading={searchLoading}
              style={btnPrimary}
              className="w-full rounded-lg font-semibold sm:w-auto"
              onClick={handleSearchStore}
            >
              Search
            </Button> */}

            <Button
              size="middle"
              style={btnPrimary}
              className="w-full rounded-lg font-semibold shadow-md sm:w-auto whitespace-nowrap"
              onClick={() => {
                createForm.resetFields();
                setCreateModal(true);
              }}
            >
              Create Vector Store
            </Button>
          </div>
        </div>

        {/* Stores table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-800 m-0">
                All Vector Stores
              </h2>
              {/* <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {stores.length}
                {hasMoreStores ? "+" : ""}
              </span> */}
            </div>
            <Button
              size="middle"
              loading={loadingStores}
              onClick={refreshStores}
              icon={<GrRefresh />}
              className="rounded-md text-gray-600 border-gray-300"
            >
              Reload
            </Button>
          </div>

          <Table
            dataSource={filteredStores ?? stores}
            columns={storeColumns}
            rowKey="id"
            loading={loadingStores || searchLoading}
            pagination={false}
            bordered
            // pagination={{
            //   pageSize: 20,
            //   current: storePage,
            //   onChange: (p) => setStorePage(p),
            //   showSizeChanger: false,
            //   showTotal: (total, range) =>
            //     `${range[0]}–${range[1]} of ${total}`,
            // }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-500">
                      No vector stores yet.{" "}
                      <span
                        className="cursor-pointer font-medium"
                        style={{ color: "#008cba" }}
                        onClick={() => setCreateModal(true)}
                      >
                        Create one now →
                      </span>
                    </span>
                  }
                />
              ),
            }}
            scroll={{ x: true }}
            className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-600 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-tbody>tr>td]:border-b-gray-100 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
            footer={() =>
              !filteredStores && hasMoreStores ? (
                <div className="flex justify-center">
                  <Button
                    loading={loadingMoreStores}
                    disabled={!nextCursor}
                    onClick={loadMoreStores}
                    style={btnPrimary}
                    className="rounded-lg font-semibold"
                  >
                    {loadingMoreStores
                      ? "Loading more…"
                      : "Load More Vector Stores"}
                  </Button>
                </div>
              ) : null
            }
          />
        </div>
      </div>

      {/* MODAL 1 — Create Vector Store */}
      <Modal
        title={
          <span className="font-bold text-base text-gray-800">
            New Vector Store
          </span>
        }
        open={createModal}
        onCancel={() => {
          if (creating) return;
          createForm.resetFields();
          setCreateModal(false);
        }}
        centered
        width={440}
        footer={null}
        maskClosable={!creating}
        closable={!creating}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label={
              <span className="font-medium text-gray-700">Store Name</span>
            }
            rules={[
              { required: true, message: "Store name is required." },
              { min: 2, message: "Name must be at least 2 characters." },
              { max: 60, message: "Name cannot exceed 60 characters." },
              {
                pattern: /^[a-zA-Z0-9_\- ]+$/,
                message: "Only letters, numbers, spaces, - and _ allowed.",
              },
            ]}
          >
            <Input
              placeholder="e.g. my-knowledge-base"
              size="large"
              autoFocus
              allowClear
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="middle"
              onClick={() => {
                createForm.resetFields();
                setCreateModal(false);
              }}
              disabled={creating}
              className="rounded-lg"
            >
              Discard
            </Button>
            <Button
              size="middle"
              htmlType="submit"
              loading={creating}
              style={btnPrimary}
              className="rounded-lg font-semibold"
            >
              {creating ? "Creating…" : "Create Store"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2 — Rename Vector Store */}
      <Modal
        title={
          <span className="font-bold text-base text-gray-800">
            Edit Vector Store Details
          </span>
        }
        open={renameModal}
        onCancel={() => {
          if (renaming) return;
          renameForm.resetFields();
          setRenameTarget(null);
          setRenameModal(false);
        }}
        centered
        width={440}
        footer={null}
        maskClosable={!renaming}
        closable={!renaming}
      >
        <Form form={renameForm} layout="vertical" onFinish={handleRename}>
          <Form.Item
            name="name"
            label={
              <span className="font-medium text-gray-700">Store Name</span>
            }
            rules={[
              { required: true, message: "Store name is required." },
              { min: 2, message: "Name must be at least 2 characters." },
              { max: 60, message: "Name cannot exceed 60 characters." },
              {
                pattern: /^[a-zA-Z0-9_\- ]+$/,
                message: "Only letters, numbers, spaces, - and _ allowed.",
              },
            ]}
          >
            <Input
              placeholder="Enter updated store name"
              size="large"
              autoFocus
              allowClear
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="middle"
              onClick={() => {
                renameForm.resetFields();
                setRenameTarget(null);
                setRenameModal(false);
              }}
              disabled={renaming}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="middle"
              htmlType="submit"
              loading={renaming}
              style={btnPrimary}
              className="rounded-lg font-semibold"
            >
              {renaming ? "Updating…" : "Update Details"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2 — Upload File */}
      <Modal
        title={
          <span className="font-bold text-base text-gray-800">
            Upload Document
          </span>
        }
        open={uploadModal}
        onCancel={() => {
          if (uploading) return;
          setUploadFile(null);
          setUploadModal(false);
        }}
        centered
        width={480}
        maskClosable={!uploading}
        closable={!uploading}
        footer={
          <div className="flex items-center justify-between">
            <div>
              {uploadFile && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CheckCircleOutlined style={{ color: "#1ab394" }} />
                  <span className="truncate max-w-[200px]">
                    {uploadFile.name}
                  </span>
                </div>
              )}
            </div>
            <Space>
              <Button
                size="middle"
                onClick={() => {
                  setUploadFile(null);
                  setUploadModal(false);
                }}
                disabled={uploading}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                size="middle"
                onClick={handleUpload}
                loading={uploading}
                disabled={!uploadFile}
                style={btnGreen}
                className="rounded-lg font-semibold"
              >
                {uploading ? "Uploading…" : "Confirm Upload"}
              </Button>
            </Space>
          </div>
        }
      >
        {uploadTarget && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
            <span className="text-sm text-gray-600">
              Destination:{" "}
              <span className="font-semibold text-gray-800">
                {uploadTarget.name}
              </span>
            </span>
          </div>
        )}

        <Upload.Dragger
          name="file"
          multiple={false}
          beforeUpload={(file) => {
            setUploadFile(file);
            return false;
          }}
          showUploadList={false}
          disabled={uploading}
          className="rounded-xl"
          style={{
            borderColor: uploadFile ? "#1ab394" : "#d9d9d9",
            background: uploadFile ? "#f0fdf9" : "#fafafa",
          }}
        >
          {uploading ? (
            <div className="py-6 text-center">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 36, color: "#1ab394" }}
                    spin
                  />
                }
              />
              <p className="mt-3 text-sm font-medium text-gray-600">
                Uploading, please wait…
              </p>
            </div>
          ) : uploadFile ? (
            <div className="py-6 text-center">
              <CheckCircleOutlined style={{ fontSize: 36, color: "#1ab394" }} />
              <p className="mt-2 font-semibold text-gray-800 text-sm">
                {uploadFile.name}
              </p>
              <p className="text-xs text-gray-400 m-0">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="py-6 text-center">
              <InboxOutlined style={{ fontSize: 40, color: "#008cba" }} />
              <p className="mt-2 font-semibold text-gray-700">
                Click or drag a file here to upload
              </p>
              <p className="text-xs text-gray-400 m-0">
                Supports PDF, DOCX, TXT, images and more
              </p>
            </div>
          )}
        </Upload.Dragger>
      </Modal>

      {/* MODAL 3 — View Files */}
      <Modal
        title={
          <span className="font-bold  text-base text-gray-800">
            View Files —{" "}
            <span style={{ color: "#008cba" }}>{viewTarget?.name}</span>
          </span>
        }
        open={viewModal}
        onCancel={() => {
          setViewModal(false);
          setFiles([]);
          setViewTarget(null);
          setFileSearchName("");
          setFilteredFiles(null);
        }}
        centered
        width={720}
        footer={
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">
                {files.length}
              </span>{" "}
              {files.length !== 1 ? "documents" : "document"} found
            </span>
            <Space>
              <Button
                size="middle"
                loading={loadingFiles}
                onClick={() => {
                  setFileSearchName("");
                  setFilteredFiles(null);
                  viewTarget && openViewModal(viewTarget);
                }}
                className="rounded-lg border-gray-300 text-gray-600"
              >
                Reload
              </Button>
              <Button
                size="middle"
                onClick={() => {
                  setViewModal(false);
                  setFiles([]);
                  setViewTarget(null);
                  setFileSearchName("");
                  setFilteredFiles(null);
                }}
                style={btnPrimary}
                className="rounded-lg"
              >
                Close
              </Button>
            </Space>
          </div>
        }
      >
        {viewTarget && (
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Store Name</p>
              <p className="font-semibold text-gray-800 m-0">
                {viewTarget.name}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Status</p>
              <Tag
                className="rounded-full border-0 text-white font-medium"
                style={{
                  background:
                    viewTarget.status === "ACTIVE" ? "#1ab394" : "#008cba",
                }}
              >
                {viewTarget.status}
              </Tag>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Search by file name…"
            value={fileSearchName}
            onChange={(e) => {
              setFileSearchName(e.target.value);
              if (!e.target.value.trim()) setFilteredFiles(null);
            }}
            onPressEnter={handleFileSearch}
            allowClear
            onClear={() => {
              setFileSearchName("");
              setFilteredFiles(null);
            }}
            className="rounded-lg"
          />
          <Button
            loading={fileSearchLoading}
            style={btnPrimary}
            className="rounded-lg font-semibold"
            onClick={handleFileSearch}
          >
            Search
          </Button>
        </div>

        <Table
          dataSource={filteredFiles ?? files}
          columns={fileColumns}
          rowKey="fileId"
          loading={loadingFiles}
          pagination={{
            pageSize: 20,
            current: filePage,
            onChange: (p) => setFilePage(p),
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500">
                    No documents uploaded to this store yet.
                  </span>
                }
              />
            ),
          }}
          scroll={{ x: true }}
          size="small"
          bordered
          className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-600 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
        />
      </Modal>
    </div>
  );
};

export default VectorStorePage;
