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
  Descriptions,
  List,
  Space,
} from "antd";
import BASE_URL from "../Config";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import customerApi from "../utils/axiosInstances";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

type MarketingJobInfo = {
  companyName?: string | null;
  companyLogo?: string | null;
  jobTitle?: string | null;
  jobDesignation?: string | null;
  jobLocations?: string | null;
  experience?: string | null;
};

type JobRow = {
  id: string;
  userName?: string;
  companyName?: string;
  companyLogo?: string;
  jobTitle?: string;
  jobDesignation?: string;
  jobLocations?: string;
  experience?: string;
  coverLetter?: string;
  noticePeriod?: string;
  resumeUrl?: string;
  appliedAt?: string;
  updatedAt?: string;
  jobStatus?: boolean; // ✅ backend field
  atsScoreViewerId?: string | null; // ✅ null = no exam feature for this application
  marketingJobs?: MarketingJobInfo | null;
};

export const getAppliedJobDisplayData = (
  job: Partial<JobRow> & { marketingJobs?: MarketingJobInfo | null },
) => ({
  companyName: job.marketingJobs?.companyName || job.companyName || "N/A",
  companyLogo: job.marketingJobs?.companyLogo || job.companyLogo || "",
  jobTitle: job.marketingJobs?.jobTitle || job.jobTitle || "N/A",
  jobDesignation:
    job.marketingJobs?.jobDesignation || job.jobDesignation || "N/A",
  jobLocations: job.marketingJobs?.jobLocations || job.jobLocations || "N/A",
  experience: job.marketingJobs?.experience || job.experience || "N/A",
});

type ExamQuestion = {
  question: string;
  questionType: "single" | "multiple" | string;
  options: string[];
  openAiAnswer: string[];
  userAnswer: string;
};

type AtsHistoryEntry = {
  id: string;
  atsScoreViewerId: string;
  candidateExamStatus: string; // e.g. STARTED, COMPLETED_ELIGIBLE, COMPLETED_INELIGIBLE
  totalQuestions: number;
  createdAt: number;
  updatedAt: number;
};

type ExamAttempt = {
  id: string;
  userId: string;
  jobId: string;
  atsScoreViewerId: string;
  score: number;
  percentage: number;
  status: boolean;
  totalQuestions: number;
  appliedAt: number;
  updatedAt: number;
  examQuestions: ExamQuestion[];
};

type ExamResultData = {
  atsHistory: AtsHistoryEntry[];
  examAttempt: ExamAttempt | null;
  isEligible: boolean;
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

  // Exam result modal
  const [openExam, setOpenExam] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [examData, setExamData] = useState<ExamResultData | null>(null);

  const isMobile = !screens.md; // < md = mobile/tablet small

  useEffect(() => {
    fetchJobs(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const fetchJobs = async (pg = 0, size = 10) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId") || "";
      const res = await customerApi.get(
        `${BASE_URL}/marketing-service/campgin/getuserandallusersappliedjobs?page=${pg}&size=${size}&userId=${userId}`,
      );

      const data = res.data;
      const rawJobs = Array.isArray(data?.content) ? data.content : [];
      const normalizedJobs = rawJobs.map((job: Partial<JobRow>) => ({
        ...job,
        ...getAppliedJobDisplayData(
          job as Partial<JobRow> & { marketingJobs?: MarketingJobInfo | null },
        ),
      }));

      setJobs(normalizedJobs as JobRow[]);
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

  const formatDate = (dateString?: string | number) => {
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

  // ✅ Fetch and show exam results for a job that has an atsScoreViewerId
  const openExamResult = async (atsScoreViewerId?: string | null) => {
    if (!atsScoreViewerId) return;

    setOpenExam(true);
    setExamLoading(true);
    setExamData(null);

    try {
      const res = await customerApi.get(
        `${BASE_URL}/marketing-service/campgin/answers-info-of-applied-job`,
        { params: { atsScoreViewerId } },
      );

      const body = res.data;

      if (!body?.success) {
        message.error(body?.message || "Failed to load exam results");
        setOpenExam(false);
        return;
      }

      setExamData(body.data as ExamResultData);
    } catch (error) {
      console.error(error);
      message.error("Failed to load exam results");
      setOpenExam(false);
    } finally {
      setExamLoading(false);
    }
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

          await customerApi.post(
            `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
            {
              id: jobId,
              jobStatus: !currentStatus,
            },
          );

          setJobs((prev) =>
            prev.map((job) =>
              job.id === jobId ? { ...job, jobStatus: !currentStatus } : job,
            ),
          );

          message.success(
            `Job ${!currentStatus ? "activated" : "deactivated"} successfully`,
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
        responsive: ["md"] as any,
      },
      {
        title: "Name",
        dataIndex: "userName",
        key: "userName",
        render: (userName: string) => <Text strong>{userName || "N/A"}</Text>,
      },
      {
        title: "Company",
        dataIndex: "companyName",
        key: "companyName",
        width: 220,
        render: (_: string, record: JobRow) => {
          const display = getAppliedJobDisplayData(record);
          return (
            <div className="min-w-[180px]">
              <Text strong>{display.companyName || "N/A"}</Text>
              {display.jobDesignation && display.jobDesignation !== "N/A" && (
                <div className="text-xs text-slate-500">
                  {display.jobDesignation}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Job Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
        render: (_: string, record: JobRow) => {
          const display = getAppliedJobDisplayData(record);
          return <Text strong>{display.jobTitle || "N/A"}</Text>;
        },
      },
      {
        title: "Notice Period",
        dataIndex: "noticePeriod",
        key: "noticePeriod",
        align: "center" as const,
        responsive: ["lg"] as any,
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
              type="primary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = url;
                link.download = "resume.pdf";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download
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
      // ✅ New: Exam Result column — only meaningful when atsScoreViewerId exists
      {
        title: "Exam",
        dataIndex: "atsScoreViewerId",
        key: "atsScoreViewerId",
        align: "center" as const,
        width: 150,
        render: (atsScoreViewerId: string | null, record: JobRow) =>
          atsScoreViewerId ? (
            <Button
              size="small"
              icon={<TrophyOutlined />}
              onClick={() => openExamResult(atsScoreViewerId)}
              style={{
                borderRadius: 8,
                borderColor: "#0089c4",
                color: "#0089c4",
              }}
            >
              View Result
            </Button>
          ) : (
            <Text type="secondary">Not required</Text>
          ),
      },
    ],
    [page, pageSize, updateLoading],
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
                {getAppliedJobDisplayData(job).jobTitle || "N/A"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {getAppliedJobDisplayData(job).companyName || "N/A"}
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
                type="primary"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = job.resumeUrl!;
                  link.download = "resume.pdf";
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Resume
              </Button>
            ) : (
              <Button size="small" disabled>
                Resume N/A
              </Button>
            )}

            {job.atsScoreViewerId && (
              <Button
                size="small"
                icon={<TrophyOutlined />}
                onClick={() => openExamResult(job.atsScoreViewerId)}
                style={{
                  borderRadius: 8,
                  borderColor: "#0089c4",
                  color: "#0089c4",
                }}
              >
                Exam Result
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
            href="/main/viewjobdetails/default/ALL"
            style={{
              borderRadius: 10,
              backgroundColor: "#0089c4",
              borderColor: "#0089c4",
              color: "white",
            }}
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

      {/* ✅ Exam Result Modal */}
      <Modal
        title="Exam Result"
        open={openExam}
        onCancel={() => setOpenExam(false)}
        width={720}
        footer={[
          <Button key="close" onClick={() => setOpenExam(false)}>
            Close
          </Button>,
        ]}
      >
        {examLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" tip="Loading exam result..." />
          </div>
        ) : !examData ? (
          <Empty description="No exam data found." />
        ) : !examData.examAttempt ? (
          // Exam started/in-progress but not completed & eligible yet
          <div>
            <Paragraph type="secondary">
              This candidate hasn't completed the exam yet, or didn't meet the
              eligibility threshold.
            </Paragraph>
            <List
              size="small"
              header={<Text strong>Attempt History</Text>}
              bordered
              dataSource={examData.atsHistory}
              renderItem={(h) => (
                <List.Item>
                  <Space direction="vertical" size={0}>
                    <Text>
                      Status: <Tag>{h.candidateExamStatus}</Tag>
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {h.totalQuestions} questions • Updated{" "}
                      {formatDate(h.updatedAt)}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div>
            <Descriptions bordered size="small" column={2} className="mb-4">
              <Descriptions.Item label="Score">
                {examData.examAttempt.score} /{" "}
                {examData.examAttempt.totalQuestions}
              </Descriptions.Item>
              <Descriptions.Item label="Percentage">
                {examData.examAttempt.percentage}%
              </Descriptions.Item>
            </Descriptions>

            <Title level={5}>Question Breakdown</Title>
            <div className="max-h-[45vh] overflow-auto">
              <List
                dataSource={examData.examAttempt.examQuestions || []}
                renderItem={(q, idx) => {
                  const correctSet = new Set(
                    (q.openAiAnswer || []).map((a) => a.trim()),
                  );
                  const userSet = new Set(
                    (q.userAnswer || "")
                      .split(",")
                      .map((a) => a.trim())
                      .filter(Boolean),
                  );
                  const isCorrect =
                    correctSet.size === userSet.size &&
                    Array.from(correctSet).every((a) => userSet.has(a));

                  return (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex items-start justify-between gap-2">
                          <Text strong>
                            {idx + 1}. {q.question}
                          </Text>
                          {isCorrect ? (
                            <Tag color="green">Correct</Tag>
                          ) : (
                            <Tag color="red">Incorrect</Tag>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {q.options?.map((opt) => (
                            <div key={opt}>{opt}</div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs">
                          <Text type="secondary">
                            Your answer: {q.userAnswer || "N/A"} • Correct
                            answer: {(q.openAiAnswer || []).join(", ")}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppliedJobs;
