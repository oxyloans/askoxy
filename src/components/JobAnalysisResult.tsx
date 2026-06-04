import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";

import {
  Progress,
  Tag,
  Divider,
  Typography,
  Collapse,
  Spin,
  Steps,
  Button,
  Alert,
  Card,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  FileDoneOutlined,
  TrophyOutlined,
  BookOutlined,
  BulbOutlined,
  RocketOutlined,
  StarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const JobAnalysisResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  const { atsData, jobId, jobDesignation, companyName } = state || {};

  const [examData, setExamData] = useState<any>(null);
  const [examStatus, setExamStatus] = useState<string | null>(
    atsData?.examStarted ? "generating" : null,
  );
  const [currentStep, setCurrentStep] = useState<number>(
    atsData?.examStarted ? 1 : 2,
  );

  const isEligible = atsData?.status === true;
  const matchScore = atsData?.data?.matchScore ?? 0;

  useEffect(() => {
    if (!atsData) {
      navigate("/main/viewjobdetails");
      return;
    }
    if (atsData?.examStarted && atsData?.runId && atsData?.threadId) {
      pollExamStatus(atsData.runId, atsData.threadId);
    }
  }, []);


   useEffect(() => {
    if (!atsData) return;


    if (isEligible && atsData?.examStarted && atsData?.runId && atsData?.threadId) {
      navigate("/main/exam", {
        replace: true,
        state: {
          runId: atsData.runId,
          threadId: atsData.threadId,
          jobId,
          jobDesignation,
          companyName,
          matchScore,
        },
      });
    }
  }, []);



  const pollExamStatus = async (runId: string, threadId: string) => {
    setExamStatus("generating");
    setCurrentStep(1);

    const checkStatus = async (): Promise<boolean> => {
      try {
        const response = await axios.get(
          `${BASE_URL}/marketing-service/campgin/exam-status?runId=${runId}&threadId=${threadId}`,
        );
        if (response.data?.status === "completed") {
          setExamData(response.data.exam);
          setExamStatus("completed");
          setCurrentStep(2);
          return true;
        }
        return false;
      } catch {
        setExamStatus("failed");
        setCurrentStep(2);
        return true;
      }
    };

    const done = await checkStatus();
    if (done) return;
    const interval = setInterval(async () => {
      const finished = await checkStatus();
      if (finished) clearInterval(interval);
    }, 5000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return {
        stroke: "#10b981",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        light: "#ecfdf5",
      };
    if (score >= 50)
      return {
        stroke: "#f59e0b",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        light: "#fffbeb",
      };
    return {
      stroke: "#ef4444",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      light: "#fff1f2",
    };
  };

  const colors = getScoreColor(matchScore);

  if (!atsData) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header / Hero Section */}
      <div className="relative bg-[#0f172a] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="!text-slate-400 hover:!text-white !flex items-center gap-2 mb-8 group"
          >
            Back to Application
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <span className="text-indigo-400 font-bold uppercase tracking-[2px] text-xs">
                  Ats Analysis Report
                </span>
              </div>
              <Title
                level={1}
                className="!text-white !mb-2 !text-3xl sm:!text-4xl font-black"
              >
                {jobDesignation}
              </Title>
              <div className="flex items-center gap-2 text-slate-400">
                <Title level={4} className="!text-slate-300 !mb-0 !text-lg">
                  {companyName}
                </Title>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-center gap-6">
              <Progress
                type="circle"
                percent={matchScore}
                width={100}
                strokeColor={colors.stroke}
                trailColor="rgba(255,255,255,0.05)"
                strokeWidth={10}
                format={(p) => (
                  <div className="text-center">
                    <div className="text-2xl font-black text-white leading-none">
                      {p}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                      Match
                    </div>
                  </div>
                )}
              />
              <div className="h-10 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-slate-400 text-xs uppercase tracking-wider">
                  Status
                </div>
                <Tag
                  className="mt-1 font-bold px-3 py-1 border-0 rounded-lg"
                  style={{
                    backgroundColor: colors.light,
                    color: colors.stroke,
                  }}
                >
                  {isEligible ? "ELIGIBLE" : "LACKS QUALIFICATIONS"}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <Space direction="vertical" size={32} className="w-full">
          {/* Steps Card */}
          <Card className="rounded-[24px] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <Steps
              current={currentStep}
              size="small"
              className="px-4"
              items={[
                { title: "Scoring", description: "Completed" },
                {
                  title: isEligible ? "Exam" : "Review",
                  description:
                    examStatus === "generating" ? "Generating..." : "Analyzed",
                },
                { title: "Ready", description: "Application Finalized" },
              ]}
            />
          </Card>

          {/* Detailed Summary Card */}
          <Card className="rounded-[24px] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-2">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-bold flex-shrink-0">
                  <StarOutlined />
                </div>
                <div>
                  <Title level={4} className="!mb-1 font-black">
                    Professional Alignment
                  </Title>
                  <Text className="text-slate-500">
                    How your profile stacks up against the requirements
                  </Text>
                </div>
              </div>

              <div
                className={`${colors.bg} ${colors.border} border rounded-2xl p-6 mb-8`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {isEligible ? (
                    <CheckCircleOutlined className="text-emerald-500 text-xl" />
                  ) : (
                    <InfoCircleOutlined className="text-rose-500 text-xl" />
                  )}
                  <Title level={5} className={`!mb-0 font-bold ${colors.text}`}>
                    {isEligible
                      ? "Qualified for Assessment"
                      : "Skill Gap Detected"}
                  </Title>
                </div>
                <Paragraph className="text-slate-700 text-lg leading-relaxed !mb-0 italic">
                  "{atsData?.data?.summary}"
                </Paragraph>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Title level={5} className="!mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Key
                    Strengths
                  </Title>
                  <div className="flex flex-col gap-3">
                    {atsData?.data?.strengths?.map((s: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
                      >
                        <CheckCircleOutlined className="text-emerald-500 mt-1" />
                        <Text className="text-slate-700 font-medium">{s}</Text>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Title level={5} className="!mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />{" "}
                    Critical Gaps
                  </Title>
                  <div className="flex flex-col gap-3">
                    {atsData?.data?.gaps?.map((g: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-rose-200 transition-colors"
                      >
                        <CloseCircleOutlined className="text-rose-500 mt-1" />
                        <Text className="text-slate-700 font-medium">{g}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations & Optimization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="rounded-[24px] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              title={
                <span className="font-black flex items-center gap-2">
                  <BulbOutlined className="text-amber-500" /> Resume
                  Optimization
                </span>
              }
            >
              <Text
                strong
                className="text-slate-400 uppercase tracking-wider text-[11px] block mb-4"
              >
                Recommended keywords to add
              </Text>
              <div className="flex flex-wrap gap-2">
                {atsData?.data?.atsOptimization?.suggestedKeywordsToAdd?.map(
                  (kw: string, i: number) => (
                    <Tag
                      key={i}
                      className="m-0 bg-amber-50 text-amber-700 border-amber-200 rounded-lg px-3 py-1 font-bold"
                    >
                      + {kw}
                    </Tag>
                  ),
                )}
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <Text strong className="text-slate-700">
                    Ats Match Health
                  </Text>
                  <Text strong className="text-indigo-600">
                    {atsData?.data?.atsOptimization?.keywordMatch}%
                  </Text>
                </div>
                <Progress
                  percent={atsData?.data?.atsOptimization?.keywordMatch}
                  strokeColor="#6366f1"
                  showInfo={false}
                />
              </div>
            </Card>

            <Card
              className="rounded-[24px] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              title={
                <span className="font-black flex items-center gap-2">
                  <RocketOutlined className="text-indigo-500" /> Action Plan
                </span>
              }
            >
              <div className="space-y-6">
                <div>
                  <Text
                    strong
                    className="text-slate-400 uppercase tracking-wider text-[11px] block mb-3"
                  >
                    Priority Skills
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {atsData?.data?.improvements?.skillImprovements?.map(
                      (item: string, i: number) => (
                        <Tag
                          key={i}
                          color="blue"
                          className="rounded-lg font-semibold m-0"
                        >
                          {item}
                        </Tag>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <Text
                    strong
                    className="text-slate-400 uppercase tracking-wider text-[11px] block mb-3"
                  >
                    Resume Edits
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {atsData?.data?.improvements?.resumeUpdates?.map(
                      (item: string, i: number) => (
                        <Tag
                          key={i}
                          color="purple"
                          className="rounded-lg font-semibold m-0"
                        >
                          {item}
                        </Tag>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Learning Plan */}
          {atsData?.data?.learningPlan?.length > 0 && (
            <Card
              className="rounded-[24px] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              title={
                <span className="font-black flex items-center gap-2">
                  <BookOutlined className="text-indigo-500" /> Curated Learning
                  Roadmap
                </span>
              }
            >
              <Collapse
                ghost
                className="custom-collapse"
                items={atsData.data.learningPlan.map(
                  (plan: any, i: number) => ({
                    key: i,
                    label: (
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-bold text-slate-800">
                          {plan.topic}
                        </span>
                        <Tag
                          color={plan.priority === "High" ? "red" : "blue"}
                          className="rounded-md font-black m-0 border-0"
                        >
                          {plan.priority}
                        </Tag>
                      </div>
                    ),
                    children: (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Text className="text-slate-500 block mb-3">
                          Resource references:
                        </Text>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {plan.resources?.map((res: string, j: number) => (
                            <div
                              key={j}
                              className="flex items-center gap-2 text-sm text-slate-700 font-medium"
                            >
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />{" "}
                              {res}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  }),
                )}
              />
            </Card>
          )}

          {/* Exam Section */}
          {isEligible && (
            <div className="space-y-6">
              <Divider className="!my-8">
                <span className="text-slate-400 uppercase tracking-[4px] text-xs font-bold">
                  Skills Assessment
                </span>
              </Divider>

              {examStatus === "generating" && (
                <Card className="rounded-[24px] border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-12 text-center">
                  <Spin size="large" />
                  <Title
                    level={3}
                    className="!mt-6 !mb-2 !text-indigo-900 font-black"
                  >
                    Crafting Your Exam
                  </Title>
                  <Text className="text-indigo-500 text-base">
                    Our AI is generating custom questions based on your
                    profile...
                  </Text>
                </Card>
              )}

              {examStatus === "completed" && examData && (
                <Card
                  className="rounded-[24px] border-0 shadow-[0_20px_40px_rgba(49,46,129,0.08)] overflow-hidden p-0"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-10 text-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div>
                        <Tag
                          color="white"
                          className="!bg-white/20 !border-0 font-black !text-white !mb-4"
                        >
                          VERIFIED ASSESSMENT
                        </Tag>
                        <Title
                          level={2}
                          className="!text-white !mb-2 !text-3xl font-black"
                        >
                          {examData.examTitle}
                        </Title>
                        <Text className="text-indigo-200 text-lg">
                          {examData.jobRole}
                        </Text>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[100px]">
                          <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">
                            Time
                          </div>
                          <div className="text-xl font-bold">
                            {examData.durationMinutes}m
                          </div>
                        </div>
                        <div className="px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[100px]">
                          <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">
                            Items
                          </div>
                          <div className="text-xl font-bold">
                            {examData.totalQuestions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10 space-y-10">
                    <div>
                      <Title
                        level={4}
                        className="!mb-6 flex items-center gap-2"
                      >
                        <InfoCircleOutlined className="text-indigo-500" />{" "}
                        Instructions
                      </Title>
                      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                        <Paragraph className="text-slate-600 mb-6 italic text-base leading-relaxed">
                          "{examData.instructions?.description}"
                        </Paragraph>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {examData.instructions?.rules?.map(
                            (rule: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 text-slate-700 font-medium"
                              >
                                <CheckCircleOutlined className="text-indigo-500" />{" "}
                                {rule}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <Title
                        level={4}
                        className="!mb-2 flex items-center gap-2"
                      >
                        <TrophyOutlined className="text-indigo-500" /> Questions
                      </Title>
                      {examData.questions?.map((q: any, i: number) => (
                        <div key={i} className="group">
                          <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              {q.questionId}
                            </div>
                            <div className="flex-1">
                              <div className="flex gap-2 mb-3">
                                <Tag className="rounded-md border-0 bg-slate-100 text-slate-500 uppercase text-[10px] font-black">
                                  {q.difficulty}
                                </Tag>
                                <Tag className="rounded-md border-0 bg-indigo-50 text-indigo-500 uppercase text-[10px] font-black">
                                  {q.category}
                                </Tag>
                              </div>
                              <Text className="text-xl font-bold text-slate-800 leading-snug block mb-6">
                                {q.question}
                              </Text>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(q.options || {}).map(
                                  ([key, val]: [string, any]) => (
                                    <div
                                      key={key}
                                      className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group/opt"
                                    >
                                      <div className="w-8 h-8 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover/opt:border-indigo-500 group-hover/opt:text-indigo-500 transition-all">
                                        {key}
                                      </div>
                                      <span className="text-slate-700 font-medium">
                                        {val}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0f172a] rounded-[32px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] translate-y-1/2 -translate-x-1/2" />
                      <div className="relative z-10">
                        <Title
                          level={2}
                          className="!text-white !mb-4 font-black"
                        >
                          Ready to apply?
                        </Title>
                        <Paragraph className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                          Review your analysis and proceed to submit your
                          official application. Good luck!
                        </Paragraph>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => navigate(-1)}
                          className="!h-16 !px-12 !rounded-2xl !bg-indigo-600 !border-0 !font-black !text-lg !shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:!scale-105 active:!scale-95 transition-all flex items-center gap-3 mx-auto"
                        >
                          <RocketOutlined /> Proceed to Final Submission
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Ineligibility CTA */}
          {!isEligible && (
            <Card
              className="rounded-[24px] border-0 shadow-lg bg-white overflow-hidden p-0"
              bodyStyle={{ padding: 0 }}
            >
              <div className="bg-rose-600 p-8 sm:p-6 text-center text-white relative">
                <div className="text-5xl mb-6">🎯</div>
                <Title level={2} className="!text-white !mb-4 font-black">
                  Path to Eligibility
                </Title>
                <Paragraph className="text-rose-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                  While you don't meet the current threshold of 80% with a score
                  of <span className="font-black underline">{matchScore}%</span>
                  , you have a clear path to improvement. We recommend focusing
                  on the gaps identified above.
                </Paragraph>
                <Button
                  size="large"
                  onClick={() => navigate(-1)}
                  className="!h-14 !px-10 !rounded-2xl !bg-white !text-rose-600 !border-0 !font-black hover:!shadow-xl transition-all"
                >
                  Back to Job Details
                </Button>
              </div>
            </Card>
          )}
        </Space>
      </div>

      <style>{`
        .ant-steps-item-title { font-weight: 800 !important; color: #1e293b !important; }
        .ant-steps-item-description { font-size: 11px !important; text-transform: uppercase; letter-spacing: 1px; }
        .custom-collapse .ant-collapse-header { padding: 24px !important; border-top: 1px solid #f1f5f9 !important; }
        .custom-collapse .ant-collapse-item:first-child .ant-collapse-header { border-top: 0 !important; }
        .ant-card-head { border-bottom: 0 !important; padding: 24px 32px 0 !important; }
        .ant-card-head-title { font-size: 18px !important; }
        .ant-progress-text { font-family: 'Inter', sans-serif !important; }
      `}</style>
    </div>
  );
};

export default JobAnalysisResult;












