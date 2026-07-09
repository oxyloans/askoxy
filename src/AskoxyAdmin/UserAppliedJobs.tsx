import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  Empty,
  Button,
  Typography,
  message,
  Modal,
  Select,
  Input,
  Divider,
  DatePicker,
  Space,
  Card,
  Row,
  Col,
  Alert,
} from "antd";
import { adminApi as axiosInstance } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import dayjs, { Dayjs } from "dayjs";
import {
  FileTextOutlined,
  SearchOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// ── Interfaces ────────────────────────────────────────────────────────────────

interface AppliedJob {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string | null;
  noticePeriod: string | null;
  applicationStatus: string | null;
  resumeUrl: string | null;
  mobileNumber: string | null;
  userName: string | null;
  jobTitle: string | null;
  appliedAt: string;
  updatedAt: string;
  message: string | null;
  status: boolean;
  atsScoreViewerId: string | null;
}

interface ExamQuestion {
  question: string;
  questionType: string;
  options: string[];
  openAiAnswer: string[];
  userAnswer: string;
}

interface ExamAttempt {
  id: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  examQuestions: ExamQuestion[];
}

interface AtsHistory {
  id: string;
  atsScoreViewerId: string;
  candidateExamStatus: string;
  totalQuestions: number;
  createdAt: number;
  updatedAt: number;
}

interface ResultData {
  examAttempt: ExamAttempt;
  atsHistory: AtsHistory[];
  isEligible: boolean;
}

interface PagedResponse {
  content: AppliedJob[];
  totalElements: number;
  number: number;
  size: number;
}

interface SearchResponse {
  data: AppliedJob[];
  count: number;
}

interface DateSearchResponse {
  data: AppliedJob[];
  count: number;
}

interface ResultResponse {
  success: boolean;
  data: ResultData;
}

// ── Main Component ────────────────────────────────────────────────────────────

const AppliedJobsDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Search
  const [searchText, setSearchText] = useState<string>("");
  const [searchCount, setSearchCount] = useState<number>(0);
  const [searchFiltered, setSearchFiltered] = useState<boolean>(false);
  const [clientPage, setClientPage] = useState<number>(1);

  // Date filter
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [dateFiltered, setDateFiltered] = useState<boolean>(false);
  const [dateCount, setDateCount] = useState<number>(0);

  // Cover letter modal
  const [openCover, setOpenCover] = useState<boolean>(false);
  const [coverText, setCoverText] = useState<string>("");

  // Resume modal
  const [resumeModal, setResumeModal] = useState<boolean>(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [resumeError, setResumeError] = useState<boolean>(false);

  // Result modal
  const [resultModal, setResultModal] = useState<boolean>(false);
  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  useEffect(() => {
    fetchJobs(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const fetchJobs = async (pg: number = 0, size: number = 10): Promise<void> => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<PagedResponse>(
        `${BASE_URL}/marketing-service/campgin/getuserandallusersappliedjobs?page=${pg}&size=${size}`
      );
      const data = res.data;
      const list = data?.content || [];
      setJobs(list);
      setFilteredJobs(list);
      setTotalElements(data?.totalElements || 0);
      setPage(data?.number ?? pg);
      setPageSize(data?.size ?? size);
    } catch (error) {
      console.error(error);
      message.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string): Promise<void> => {
    const val = (text || "").trim();
    if (!val) {
      setSearchFiltered(false);
      setSearchCount(0);
      fetchJobs(0, pageSize);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get<SearchResponse>(
        `${BASE_URL}/marketing-service/campgin/searchAppliedJobs?search=${encodeURIComponent(val)}`
      );
      const list = res.data?.data || [];
      setFilteredJobs(list);
      setSearchCount(res.data?.count ?? list.length);
      setSearchFiltered(true);
      setClientPage(1);
    } catch {
      message.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchByDate = async (start: Dayjs, end: Dayjs): Promise<void> => {
    if (!start || !end) return;
    setDateFiltered(true);
    setLoading(true);
    try {
      const res = await axiosInstance.get<DateSearchResponse>(
        `${BASE_URL}/marketing-service/campgin/searchAppliedJobsByDate?startDate=${start.format("YYYY-MM-DD")}&endDate=${end.format("YYYY-MM-DD")}`
      );
      const list = res.data?.data || [];
      setJobs(list);
      setFilteredJobs(list);
      setTotalElements(list.length);
      setDateCount(res.data?.count ?? list.length);
      setClientPage(1);
    } catch {
      message.error("Failed to fetch jobs by date");
    } finally {
      setLoading(false);
    }
  };

  const clearDateFilter = (): void => {
    setStartDate(null);
    setEndDate(null);
    setDateFiltered(false);
    setDateCount(0);
    setSearchFiltered(false);
    setSearchCount(0);
    setSearchText("");
    fetchJobs(0, pageSize);
  };

  const openCoverLetter = (text: string | null): void => {
    setCoverText(text || "");
    setOpenCover(true);
  };

  const openViewResult = async (atsScoreViewerId: string | null): Promise<void> => {
    if (!atsScoreViewerId) {
      message.warning("No exam result available for this applicant.");
      return;
    }
    setResultData(null);
    setResultModal(true);
    setResultLoading(true);
    try {
      const res = await axiosInstance.get<ResultResponse>(
        `${BASE_URL}/marketing-service/campgin/answers-info-of-applied-job?atsScoreViewerId=${atsScoreViewerId}`
      );
      if (res.data?.success) {
        setResultData(res.data.data);
      } else {
        message.error("Failed to load result");
        setResultModal(false);
      }
    } catch {
      message.error("Error fetching result");
      setResultModal(false);
    } finally {
      setResultLoading(false);
    }
  };

  const isSearchActive = searchFiltered || dateFiltered;

  const columns = [
    {
      title: "S.NO",
      key: "serial",
      align: "center" as const,
      width: 70,
      render: (_: unknown, __: AppliedJob, index: number) =>
        isSearchActive
          ? (clientPage - 1) * pageSize + index + 1
          : page * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      align: "center" as const,
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      align: "center" as const,
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center" as const,
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Email",
      dataIndex: "message",
      key: "email",
      align: "center" as const,
      render: (_: unknown, record: AppliedJob) => record.message || "N/A",
    },
    {
      title: "Cover Letter",
      dataIndex: "coverLetter",
      key: "coverLetter",
      align: "center" as const,
      responsive: ["md"] as ("md")[],
      render: (text: string | null) => (
        <Button size="small" icon={<FileTextOutlined />} onClick={() => openCoverLetter(text)}>
          View
        </Button>
      ),
    },
    {
      title: "Notice Period",
      dataIndex: "noticePeriod",
      key: "noticePeriod",
      align: "center" as const,
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      key: "resumeUrl",
      align: "center" as const,
      render: (url: string | null) => (
        <Button
          size="small"
          icon={<FilePdfOutlined />}
          disabled={!url}
          style={url ? { background: "#008cba", borderColor: "#008cba", color: "#fff" } : {}}
          onClick={() => {
            if (!url) return;
            setResumeUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
            setIframeLoading(true);
            setResumeError(false);
            setResumeModal(true);
          }}
        >
          View Resume
        </Button>
      ),
    },
    {
      title: "Applied Date",
      dataIndex: "appliedAt",
      key: "appliedAt",
      align: "center" as const,
      render: (v: string) => (v ? dayjs(v).format("YYYY-MM-DD") : "N/A"),
      sorter: (a: AppliedJob, b: AppliedJob) =>
        new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
      defaultSortOrder: "descend" as const,
    },
    {
      title: "View Result",
      key: "viewResult",
      align: "center" as const,
      render: (_: unknown, record: AppliedJob) => (
        <Button
          size="small"
          icon={<TrophyOutlined />}
          style={{ background: "#1ab394", borderColor: "#1ab394", color: "#fff" }}
          onClick={() => openViewResult(record.atsScoreViewerId)}
        >
          Result
        </Button>
      ),
    },
  ];

  return (
    <Card className="shadow-lg">
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="!m-0">
            Applied Jobs by Users
          </Title>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Show</span>
            <Select
              value={pageSize}
              onChange={(value: number) => { setPageSize(value); setPage(0); }}
              style={{ width: 110 }}
            >
              {[10, 20, 30, 40].map((num) => (
                <Option key={num} value={num}>{num}</Option>
              ))}
            </Select>
            <span>entries</span>
          </div>

          <Space wrap>
            <DatePicker
              placeholder="Start date"
              value={startDate}
              onChange={(date: Dayjs | null) => {
                setStartDate(date);
                if (!date) clearDateFilter();
                else if (endDate) fetchByDate(date, endDate);
              }}
              allowClear
              style={{ width: 140 }}
            />
            <DatePicker
              placeholder="End date"
              value={endDate}
              disabledDate={(d: Dayjs) => !!(startDate && d.isBefore(startDate, "day"))}
              onChange={(date: Dayjs | null) => {
                setEndDate(date);
                if (!date) clearDateFilter();
                else if (startDate) fetchByDate(startDate, date);
              }}
              allowClear
              style={{ width: 140 }}
            />
            <Input
              placeholder="Search by mobile number, name"
              value={searchText}
              allowClear
              prefix={<SearchOutlined />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setSearchText(value);
                handleSearch(value);
              }}
              style={{ width: 280 }}
            />
          </Space>
        </div>

        {searchFiltered && (
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid #e8e8e8",
                background: "#fafafa",
              }}
            >
              <span style={{ fontSize: 12, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Results found
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#262626" }}>{searchCount}</span>
              <span style={{ fontSize: 12, color: "#8c8c8c" }}>for &quot;{searchText}&quot;</span>
            </div>
          </div>
        )}

        {dateFiltered && (
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid #e8e8e8",
                background: "#fafafa",
              }}
            >
              <span style={{ fontSize: 12, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Applications found
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#262626" }}>{dateCount}</span>
              {startDate && (
                <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                  {startDate.format("DD MMM YYYY")}
                  {endDate && !endDate.isSame(startDate, "day") ? ` – ${endDate.format("DD MMM YYYY")}` : ""}
                </span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading jobs..." />
          </div>
        ) : filteredJobs.length === 0 ? (
          <Empty description="No jobs found." />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="id"
            loading={loading}
            pagination={
              isSearchActive
                ? {
                    current: clientPage,
                    pageSize: pageSize,
                    total: filteredJobs.length,
                    showSizeChanger: false,
                    showTotal: (total: number, range: [number, number]) =>
                      `${range[0]}-${range[1]} of ${total} jobs`,
                    onChange: (p: number) => setClientPage(p),
                  }
                : {
                    current: page + 1,
                    pageSize: pageSize,
                    total: totalElements,
                    showSizeChanger: false,
                    showTotal: (total: number, range: [number, number]) =>
                      `${range[0]}-${range[1]} of ${total} jobs`,
                    onChange: (newPage: number) => setPage(newPage - 1),
                  }
            }
            scroll={{ x: true }}
            bordered
          />
        )}

        {/* Resume Modal */}
        <Modal
          title={
            <Space>
              <FilePdfOutlined style={{ color: "#008cba" }} />
              <span style={{ fontWeight: 700 }}>Resume Viewer</span>
            </Space>
          }
          open={resumeModal}
          onCancel={() => { setResumeModal(false); setIframeLoading(true); setResumeError(false); }}
          footer={<Button onClick={() => setResumeModal(false)}>Close</Button>}
          width="75vw"
          style={{ top: 16, maxWidth: 1000 }}
          styles={{ body: { height: "78vh", padding: 0, overflow: "hidden" } }}
          destroyOnClose
          maskClosable
        >
          {iframeLoading && !resumeError && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Spin size="large" tip="Loading resume..." />
            </div>
          )}
          {resumeError && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 24 }}>
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
              style={{ width: "100%", height: "100%", border: "none", display: iframeLoading ? "none" : "block" }}
              onLoad={() => setIframeLoading(false)}
              onError={() => { setIframeLoading(false); setResumeError(true); }}
            />
          )}
        </Modal>

        {/* Cover Letter Modal */}
        <Modal
          title="Cover Letter"
          open={openCover}
          onCancel={() => setOpenCover(false)}
          footer={[<Button key="close" onClick={() => setOpenCover(false)}>Close</Button>]}
        >
          <div className="max-h-[50vh] overflow-auto whitespace-pre-wrap text-sm text-slate-700">
            {coverText || "N/A"}
          </div>
        </Modal>

        {/* View Result Modal */}
        <Modal
          title={
            <Space>
              <TrophyOutlined style={{ color: "#1ab394" }} />
              <span>Exam Result</span>
            </Space>
          }
          open={resultModal}
          onCancel={() => { setResultModal(false); setResultData(null); }}
          footer={[<Button key="close" onClick={() => { setResultModal(false); setResultData(null); }}>Close</Button>]}
          width={780}
        >
          {resultLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin tip="Loading result..." />
            </div>
          ) : resultData ? (
            <ResultView data={resultData} />
          ) : null}
        </Modal>
      </div>
    </Card>
  );
};

// ── Result View Component ──────────────────────────────────────────────────────

const ResultView: React.FC<{ data: ResultData }> = ({ data }) => {
  const { examAttempt, atsHistory, isEligible } = data;

  const correctCount =
    examAttempt?.examQuestions?.filter((q) => {
      const correct = (q.openAiAnswer || []).sort().join(",").toUpperCase();
      const user = (q.userAnswer || "").toUpperCase().split(",").map((a) => a.trim()).sort().join(",");
      return correct === user;
    }).length ?? 0;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Summary strip */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #e8e8e8",
        }}
      >
        {[
          { label: "Score", value: `${examAttempt?.score ?? "—"} / ${examAttempt?.totalQuestions ?? "—"}` },
          { label: "Percentage", value: examAttempt?.percentage != null ? `${examAttempt.percentage}%` : "—" },
          { label: "Correct", value: `${correctCount} / ${examAttempt?.totalQuestions ?? "—"}` },
          { label: "Eligible", value: isEligible ? "Yes" : "No" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "12px 16px",
              textAlign: "center",
              borderRight: i < 3 ? "1px solid #e8e8e8" : "none",
              background: i % 2 === 0 ? "#fafafa" : "#fff",
            }}
          >
            <div style={{ fontSize: 11, color: "#8c8c8c", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#262626" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ATS History */}
      {atsHistory?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Exam History
          </Text>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {atsHistory.map((h) => (
              <span
                key={h.id}
                style={{
                  fontSize: 12,
                  padding: "2px 10px",
                  borderRadius: 4,
                  border: "1px solid #d9d9d9",
                  background: "#fafafa",
                  color: "#595959",
                }}
              >
                {h.candidateExamStatus} &mdash; {dayjs(h.createdAt).format("DD MMM YYYY, hh:mm A")}
              </span>
            ))}
          </div>
        </div>
      )}

      <Divider style={{ margin: "12px 0" }} />

      {/* Questions */}
      <div style={{ maxHeight: 440, overflowY: "auto", paddingRight: 4 }}>
        {(examAttempt?.examQuestions || []).map((q, idx) => {
          const correctAnswers = (q.openAiAnswer || []).map((a) => a.toUpperCase());
          const userAnswers = (q.userAnswer || "").toUpperCase().split(",").map((a) => a.trim());
          const isCorrect = correctAnswers.sort().join(",") === userAnswers.sort().join(",");

          return (
            <div
              key={idx}
              style={{
                marginBottom: 12,
                padding: "12px 14px",
                borderRadius: 6,
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderLeft: `3px solid ${isCorrect ? "#52c41a" : "#ff4d4f"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: 600, color: "#262626", flex: 1, paddingRight: 8 }}>
                  Q{idx + 1}. {q.question}
                </Text>
                {isCorrect
                  ? <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 15, flexShrink: 0 }} />
                  : <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 15, flexShrink: 0 }} />}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                {(q.options || []).map((opt, oi) => {
                  const letter = opt.charAt(0).toUpperCase();
                  const isUserPick = userAnswers.includes(letter);
                  const isCorrectPick = correctAnswers.includes(letter);
                  const isWrongPick = isUserPick && !isCorrectPick;
                  return (
                    <div
                      key={oi}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 4,
                        border: `1px solid ${isCorrectPick ? "#52c41a" : isWrongPick ? "#ff4d4f" : "#e8e8e8"}`,
                        background: isCorrectPick ? "#f6ffed" : isWrongPick ? "#fff2f0" : "#fafafa",
                        color: "#262626",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {isCorrectPick && <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 11 }} />}
                      {isWrongPick && <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 11 }} />}
                      {opt}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 12, color: "#595959", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>
                  <span style={{ color: "#8c8c8c" }}>Your answer: </span>
                  <span style={{ fontWeight: 600, color: isCorrect ? "#52c41a" : "#ff4d4f" }}>
                    {q.userAnswer || "—"}
                  </span>
                </span>
                <span>
                  <span style={{ color: "#8c8c8c" }}>Correct: </span>
                  <span style={{ fontWeight: 600, color: "#262626" }}>{(q.openAiAnswer || []).join(", ")}</span>
                </span>
                <span style={{ color: "#8c8c8c", textTransform: "capitalize" }}>{q.questionType}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppliedJobsDashboard;
