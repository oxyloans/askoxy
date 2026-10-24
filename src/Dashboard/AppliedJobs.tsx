import React, { useEffect, useState } from "react";
import {
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
  Pagination,
  Alert,
} from "antd";
import BASE_URL from "../Config";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import {
  Building2,
  MapPin,
  Clock3,
  Briefcase,
  Calendar,
  User,
} from "lucide-react";
import customerApi from "../utils/axiosInstances";
import { useNavigate } from "react-router-dom";

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
  userId?: string;
  appliedAt?: string;
  updatedAt?: string;
  jobStatus?: boolean; // backend field
  atsScoreViewerId?: string | null; // null = no exam feature for this application
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

export const buildFullResumeUrl = (
  url?: string | null,
  targetUserId?: string | null,
): string => {
  if (!url) return "";
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }
  const uid = targetUserId || localStorage.getItem("userId") || "";
  const baseUrl = `https://oxybricksv1test.s3.ap-south-1.amazonaws.com/null/${uid}`;
  const relativePath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return `${baseUrl}${relativePath}`;
};

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
  candidateExamStatus: string;
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

// Company Avatar Helper with initial/icon fallback
const CompanyAvatar: React.FC<{ logo?: string | null; name?: string | null }> = ({
  logo,
  name,
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "Company")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (logo && !imgError) {
    return (
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
        <img
          src={logo}
          alt={name || "Company"}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
      {initials || <Building2 className="w-6 h-6 text-white/90" />}
    </div>
  );
};

const AppliedJobs: React.FC = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  // 🔒 Block all back/forward history — one allowed back goes to job list
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    let allowedOnce = true;
    const handlePopState = () => {
      if (allowedOnce) {
        allowedOnce = false;
        navigate("/main/viewjobdetails/default/ALL", { replace: true });
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Pagination (backend: 0-based, fixed to 10 items)
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [totalElements, setTotalElements] = useState(0);

  // Cover letter modal
  const [openCover, setOpenCover] = useState(false);
  const [coverText, setCoverText] = useState<string>("");

  // Exam result modal
  const [openExam, setOpenExam] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [examData, setExamData] = useState<ExamResultData | null>(null);

  // Resume modal
  const [resumeModal, setResumeModal] = useState<boolean>(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [resumeError, setResumeError] = useState<boolean>(false);

  const isMobile = !screens.md;

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
    setCoverText(text || "No cover letter provided.");
    setOpenCover(true);
  };

  // Fetch and show exam results
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-white p-3 sm:p-6 lg:p-8">
      <div className="mx-auto min-w-0 max-w-7xl">
        {/* Header Section with reduced font size */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                My Job Applications
              </h1>
             
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Track and manage all your submitted job applications.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            href="/main/viewjobdetails/default/ALL"
            className="!h-9 !rounded-xl !bg-[#0089c4] hover:!bg-[#007ba6] !text-xs !font-semibold !px-4"
          >
            Browse Jobs
          </Button>
        </div>

        {/* Content Body: Responsive Cards Only */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <Spin size="large" />
            <p className="mt-4 text-xs font-medium text-slate-500">
              Loading your applications...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-10 sm:p-14 text-center shadow-xs">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-50 text-[#0089c4] flex items-center justify-center mb-3">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No Applications Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              You haven't applied to any jobs yet. Browse available job openings
              and submit your first application!
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              href="/main/viewjobdetails/default/ALL"
              className="!h-9 !rounded-xl !bg-[#0089c4] !px-5 !text-xs !font-semibold"
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <>
            {/* Responsive Card Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {jobs.map((job) => {
                const display = getAppliedJobDisplayData(job);
                return (
                  <div
                    key={job.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                  >
                    <div>
                      {/* Top Header: Logo + Job Title (line-clamp-2) + Company */}
                      <div className="flex items-start gap-3">
                        <CompanyAvatar
                          logo={display.companyLogo}
                          name={display.companyName}
                        />
                        <div className="min-w-0 flex-1">
                          <h3
                            className="text-sm sm:text-base md:text-lg font-bold text-slate-900 group-hover:text-[#0089c4] transition-colors line-clamp-2 leading-snug"
                            title={display.jobTitle || ""}
                          >
                            {display.jobTitle || "Job Title"}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate mt-0.5">
                            {display.companyName || "N/A"}
                          </p>
                          {display.jobDesignation &&
                            display.jobDesignation !== "N/A" &&
                            display.jobDesignation !== display.jobTitle && (
                              <p className="text-[11px] text-slate-400 truncate">
                                {display.jobDesignation}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Meta Tags: Location, Experience, Notice Period */}
                      <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-600">
                        {display.jobLocations &&
                          display.jobLocations !== "N/A" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[130px] sm:max-w-[160px]">
                                {display.jobLocations}
                              </span>
                            </span>
                          )}

                        {display.experience && display.experience !== "N/A" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{display.experience}</span>
                          </span>
                        )}

                        {job.noticePeriod && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                            <Clock3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Notice: {job.noticePeriod}</span>
                          </span>
                        )}

                        {job.userName && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {job.userName}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Skill Assessment / Exam Banner if atsScoreViewerId exists */}
                      {job.atsScoreViewerId && (
                        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-blue-50 border border-sky-100 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                              <TrophyOutlined className="text-base" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                Skill Assessment
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                Exam report available
                              </div>
                            </div>
                          </div>

                          <Button
                            size="small"
                            icon={<TrophyOutlined />}
                            onClick={() => openExamResult(job.atsScoreViewerId)}
                            className="!rounded-lg !text-xs !font-semibold !h-8 !border-sky-500 !text-sky-600 hover:!bg-sky-50 shrink-0"
                          >
                            View Result
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Section: Timeline & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      {/* Dates */}
                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Applied {formatDate(job.appliedAt)}</span>
                        </div>
                        {job.updatedAt && job.updatedAt !== job.appliedAt && (
                          <span>Updated {formatDate(job.updatedAt)}</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openCoverLetter(job.coverLetter)}
                          className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                        >
                          <FileTextOutlined className="text-slate-500" />
                          Cover Letter
                        </button>

                        {job.resumeUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const fullUrl = buildFullResumeUrl(
                                  job.resumeUrl,
                                  job.userId,
                                );
                                const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
                                  fullUrl,
                                )}&embedded=true`;
                                setResumeUrl(viewerUrl);
                                setIframeLoading(true);
                                setResumeError(false);
                                setResumeModal(true);
                              } catch (error) {
                                console.error("Invalid resume URL:", error);
                                setResumeError(true);
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-[#0089c4] hover:bg-[#007ba6] text-xs font-semibold text-white transition-colors shadow-2xs"
                          >
                            <FilePdfOutlined />
                            View Resume
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-slate-100 text-xs font-medium text-slate-400 cursor-not-allowed border border-slate-200/50"
                          >
                            <FilePdfOutlined />
                            No Resume
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls - Fixed to 10 items */}
            {totalElements > 0 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="text-xs sm:text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {page * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min((page + 1) * 10, totalElements)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {totalElements}
                  </span>{" "}
                  applications
                </div>

                <Pagination
                  current={page + 1}
                  pageSize={10}
                  total={totalElements}
                  showSizeChanger={false}
                  size={isMobile ? "small" : "default"}
                  responsive
                  onChange={(newPage) => {
                    setPage(newPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Cover Letter Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-sky-600" />
            <span className="font-bold text-slate-800">Cover Letter</span>
          </div>
        }
        open={openCover}
        onCancel={() => setOpenCover(false)}
        width={isMobile ? "calc(100vw - 24px)" : 540}
        centered
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setOpenCover(false)}
            className="!rounded-xl !bg-[#0089c4]"
          >
            Close
          </Button>,
        ]}
      >
        <div className="max-h-[50vh] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 border border-slate-200/70">
          {coverText}
        </div>
      </Modal>

      {/* Resume Viewer Modal */}
      <Modal
        title={
          <Space>
            <FilePdfOutlined style={{ color: "#008cba" }} />
            <span style={{ fontWeight: 700 }}>Resume Viewer</span>
          </Space>
        }
        open={resumeModal}
        onCancel={() => {
          setResumeModal(false);
          setIframeLoading(true);
          setResumeError(false);
        }}
        footer={<Button onClick={() => setResumeModal(false)}>Close</Button>}
        width={isMobile ? "calc(100vw - 24px)" : 700}
        style={{ maxWidth: 700 }}
        centered
        styles={{ body: { height: "60vh", padding: 0, overflow: "hidden" } }}
        destroyOnClose
        maskClosable
      >
        {iframeLoading && !resumeError && (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" tip="Loading resume..." />
          </div>
        )}
        {resumeError && (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Alert
              type="error"
              message="Unable to load resume"
              description="The file could not be displayed."
              showIcon
            />
          </div>
        )}
        {!resumeError && (
          <iframe
            src={resumeUrl}
            title="Resume Viewer"
            className="w-full h-full border-none"
            style={{ display: iframeLoading ? "none" : "block" }}
            onLoad={() => setIframeLoading(false)}
            onError={() => {
              setIframeLoading(false);
              setResumeError(true);
            }}
          />
        )}
      </Modal>

      {/* Exam Result Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-amber-500" />
            <span className="font-bold text-slate-800">Exam Result</span>
          </div>
        }
        open={openExam}
        onCancel={() => setOpenExam(false)}
        width={isMobile ? "calc(100vw - 24px)" : 720}
        centered
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setOpenExam(false)}
            className="!rounded-xl !bg-[#0089c4]"
          >
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
            <Descriptions
              bordered
              size="small"
              column={isMobile ? 1 : 2}
              className="mb-4"
            >
              <Descriptions.Item label="Score">
                <span className="font-bold text-slate-800">
                  {examData.examAttempt.score} /{" "}
                  {examData.examAttempt.totalQuestions}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Percentage">
                <span className="font-bold text-emerald-600">
                  {examData.examAttempt.percentage}%
                </span>
              </Descriptions.Item>
            </Descriptions>

            <Title level={5}>Question Breakdown</Title>
            <div className="max-h-[45vh] overflow-auto pr-1">
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
                    <List.Item className="!py-3">
                      <div className="w-full">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <Text
                            strong
                            className="min-w-0 break-words text-sm text-slate-900"
                          >
                            {idx + 1}. {q.question}
                          </Text>
                          {isCorrect ? (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Correct
                            </span>
                          ) : (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Incorrect
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-slate-600 pl-2 border-l-2 border-slate-200">
                          {q.options?.map((opt) => (
                            <div key={opt}>{opt}</div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs">
                          <Text type="secondary">
                            Your answer:{" "}
                            <span
                              className={
                                isCorrect
                                  ? "text-emerald-600 font-semibold"
                                  : "text-rose-600 font-semibold"
                              }
                            >
                              {q.userAnswer || "N/A"}
                            </span>{" "}
                            • Correct answer:{" "}
                            <span className="text-slate-800 font-semibold">
                              {(q.openAiAnswer || []).join(", ")}
                            </span>
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
