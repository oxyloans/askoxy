import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Empty,
  Button,
  Tag,
  Typography,
  message,
  Modal,
  Grid,
} from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

type JobRow = {
  id: string;
  jobTitle?: string;
  coverLetter?: string;
  noticePeriod?: string;
  resumeUrl?: string;
  appliedAt?: string;
  updatedAt?: string;
  jobStatus?: boolean; // ✅ backend field
  // status?: boolean; // ❌ avoid confusion
};

const AppliedJobs: React.FC = () => {
  const screens = useBreakpoint();

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Pagination (backend: 0-based)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Cover letter modal
  const [openCover, setOpenCover] = useState(false);
  const [coverText, setCoverText] = useState<string>("");

  const isMobile = !screens.md; // < md = mobile/tablet small

  useEffect(() => {
    fetchJobs(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const fetchJobs = async (pg = 0, size = 10) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId") || "";
      const res = await axios.get(
        `${BASE_URL}/marketing-service/campgin/getuserandallusersappliedjobs?page=${pg}&size=${size}&userId=${userId}`
      );

      const data = res.data;
      setJobs(data?.content || []);
      setTotalElements(data?.totalElements || 0);
      setPage(data?.number || 0);
      setPageSize(data?.size || 10);
    } catch (error) {
      console.error(error);
      message.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openCoverLetter = (text?: string) => {
    setCoverText(text || "N/A");
    setOpenCover(true);
  };

  const handleStatusToggle = (jobId: string, currentStatus?: boolean) => {
    confirm({
      title: "Confirm Status Change",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this job?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          setUpdateLoading(jobId);

          const response = await fetch(
            `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: jobId,
                jobStatus: !currentStatus,
              }),
            }
          );

          if (!response.ok) throw new Error("Failed to update job status");

          setJobs((prev) =>
            prev.map((job) =>
              job.id === jobId ? { ...job, jobStatus: !currentStatus } : job
            )
          );

          message.success(
            `Job ${!currentStatus ? "activated" : "deactivated"} successfully`
          );
        } catch (error) {
          console.error(error);
          message.error("Failed to update job status. Please try again.");
        } finally {
          setUpdateLoading(null);
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        title: "S.No.",
        key: "serial",
        align: "center" as const,
        width: 80,
        render: (_: any, __: JobRow, index: number) =>
          page * pageSize + index + 1,
        responsive: ["md"] as any, // show only on md+
      },
      {
        title: "Name",
        dataIndex: "userName",
        key: "userName",
        render: (userName: string) => <Text strong>{userName || "N/A"}</Text>,
      },
      {
        title: "Job Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
        render: (jobTitle: string) => <Text strong>{jobTitle || "N/A"}</Text>,
      },
      {
        title: "Notice Period",
        dataIndex: "noticePeriod",
        key: "noticePeriod",
        align: "center" as const,
        responsive: ["lg"] as any, // show only on lg+
        render: (text: string) => text || "N/A",
      },
      {
        title: "Cover Letter",
        dataIndex: "coverLetter",
        key: "coverLetter",
        align: "center" as const,
        responsive: ["md"] as any,
        render: (text: string) => (
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => openCoverLetter(text)}
          >
            View
          </Button>
        ),
      },
      {
        title: "Resume",
        dataIndex: "resumeUrl",
        key: "resumeUrl",
        align: "center" as const,
        responsive: ["md"] as any,
        render: (url: string) =>
          url ? (
            <Button
              size="small"
              type="link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </Button>
          ) : (
            "N/A"
          ),
      },
      {
        title: "Applied",
        dataIndex: "appliedAt",
        key: "appliedAt",
        align: "center" as const,
        responsive: ["lg"] as any,
        render: (date: string) => formatDate(date),
      },
    
      //   {
      //     title: "Action",
      //     key: "actions",
      //     align: "center" as const,
      //     width: 140,
      //     render: (_: any, record: JobRow) => (
      //       <Button
      //         size="small"
      //         loading={updateLoading === record.id}
      //         onClick={() => handleStatusToggle(record.id, record.jobStatus)}
      //         style={{
      //           background: record.jobStatus ? "#1ab394" : "#dc2626",
      //           borderColor: record.jobStatus ? "#1ab394" : "#dc2626",
      //           color: "white",
      //           borderRadius: 8,
      //           width: 110,
      //         }}
      //       >
      //         {record.jobStatus ? "Deactivate" : "Activate"}
      //       </Button>
      //     ),
      //   },
    ],
    [page, pageSize, updateLoading]
  );

  // ✅ Mobile Card UI (best UX)
  const MobileCards = () => (
    <div className="grid gap-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold text-slate-900 truncate">
                {job.jobTitle || "N/A"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Applied: {formatDate(job.appliedAt)} • Updated:{" "}
                {formatDate(job.updatedAt)}
              </div>
            </div>

            <div>
              {job.jobStatus ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => openCoverLetter(job.coverLetter)}
            >
              Cover Letter
            </Button>

            {job.resumeUrl ? (
              <Button
                size="small"
                type="link"
                href={job.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </Button>
            ) : (
              <Button size="small" disabled>
                Resume N/A
              </Button>
            )}

            <Button
              size="small"
              loading={updateLoading === job.id}
              onClick={() => handleStatusToggle(job.id, job.jobStatus)}
              style={{
                background: job.jobStatus ? "#0089c4" : "#dc2626",
                borderColor: job.jobStatus ? "#0089c4" : "#dc2626",
                color: "white",
                borderRadius: 8,
              }}
            >
              {job.jobStatus ? "Deactivate" : "Activate"}
            </Button>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            <span className="font-medium">Notice:</span>{" "}
            {job.noticePeriod || "N/A"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="!m-0">
              My Job Applications
            </Title>
            <Text type="secondary">
              View your applied jobs and track status easily.
            </Text>
          </div>

          <Button
           
            icon={<PlusOutlined />}
            href="/main/jobDetails"
            style={{ borderRadius: 10,backgroundColor: '#0089c4', borderColor: '#0089c4',color:'white' }}
          >
            Browse Jobs
          </Button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading..." />
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <Empty description="No jobs found." />
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-2 sm:p-4 shadow-sm">
            {isMobile ? (
              <MobileCards />
            ) : (
              <Table
                columns={columns as any}
                dataSource={jobs}
                rowKey="id"
                pagination={{
                  current: page + 1,
                  pageSize,
                  total: totalElements,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} jobs`,
                  onChange: (newPage, newSize) => {
                    setPage(newPage - 1);
                    setPageSize(newSize || 10);
                  },
                }}
                scroll={{ x: true }}
                bordered={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Cover Letter Modal */}
      <Modal
        title="Cover Letter"
        open={openCover}
        onCancel={() => setOpenCover(false)}
        footer={[
          <Button key="close" onClick={() => setOpenCover(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="max-h-[50vh] overflow-auto whitespace-pre-wrap text-sm text-slate-700">
          {coverText}
        </div>
      </Modal>
    </div>
  );
};

export default AppliedJobs;
