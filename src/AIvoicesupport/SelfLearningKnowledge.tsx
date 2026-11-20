import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Tabs,
  Button,
  Modal,
  Input,
  Tag,
  Select,
  Popconfirm,
  message,
  Switch,
  Flex,
  ConfigProvider,
  Typography,
} from "antd";
import type { ModalProps, ThemeConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import {
  RiRobot2Line,
  RiAddLine,
  RiRefreshLine,
  RiSearchLine,
  RiEditLine,
  RiCheckboxCircleLine,
  RiQuestionLine,
} from "react-icons/ri";
import dayjs from "dayjs";
import VoiceAdminLayout from "./components/VoiceAdminLayout";
import {
  getKnowledgeGaps,
  getActiveKnowledgeEntries,
  approveKnowledgeGap,
  rejectKnowledgeGap,
  createDirectKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
} from "./api";
import {
  CustomerKnowledgeGap,
  DynamicKnowledgeEntry,
  PLATFORMS,
  PLATFORM_LABELS,
} from "./types";

const { TextArea } = Input;

type KnowledgeDetails =
  | { kind: "entry"; record: DynamicKnowledgeEntry }
  | { kind: "gap"; record: CustomerKnowledgeGap };

const previewText = (value?: string | null) => (value || "").replace(/\s+/g, " ").trim();
const compactText = (value?: string | null, limit = 80) => {
  const text = previewText(value);
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text || "—";
};

const KNOWLEDGE_THEME: ThemeConfig = {
  components: {
    Button: {
      colorPrimary: "#946b08",
      colorPrimaryHover: "#805b06",
      colorPrimaryActive: "#654506",
      colorError: "#be123c",
      colorErrorHover: "#9f1239",
      colorErrorBg: "#fff5f6",
      colorErrorBgHover: "#ffe4e9",
      controlHeight: 38,
      controlHeightSM: 32,
      borderRadius: 9,
      fontWeight: 600,
      primaryShadow: "0 2px 4px rgb(148 107 8 / 14%)",
      defaultBg: "#ffffff",
      defaultColor: "#475569",
      defaultBorderColor: "#e2e8f0",
    },
    Table: {
      headerBg: "#fffbeb",
      headerColor: "#1e293b",
      rowHoverBg: "#fffbeb",
      cellFontSizeSM: 13,
      cellPaddingBlockSM: 8,
      cellPaddingInlineSM: 8,
    },
  },
};

const COPY_CLASSES = "min-w-0 max-w-full whitespace-pre-wrap break-normal [overflow-wrap:anywhere] leading-[1.65]";
const ROW_CLASSES = "flex min-w-0 flex-wrap items-center justify-between gap-4";
const ACTION_BUTTON_CLASSES = "min-w-0 max-w-full flex-1 !h-8 !gap-1 !px-2 !text-xs [&_.anticon]:shrink-0 [&_.anticon]:!text-[13px]";
const TABLE_CLASSES = "knowledge-table min-w-0 max-w-full [&_.ant-table-cell]:!align-middle [&_.ant-table-cell]:!overflow-hidden [&_.ant-table-cell]:!whitespace-nowrap [&_.ant-table-cell]:!text-[13px] [&_.ant-table-cell]:!leading-5";
const TABS_CLASSES = [
  "knowledge-tabs min-w-0 max-w-full",
  "[&_.ant-tabs-content-holder]:min-w-0 [&_.ant-tabs-tabpane]:min-w-0 [&_.ant-tabs-tabpane]:max-w-full",
  "[&>.ant-tabs-nav_.ant-tabs-nav-list]:w-full [&>.ant-tabs-nav_.ant-tabs-tab]:!m-0",
  "[&>.ant-tabs-nav_.ant-tabs-tab]:min-w-0 [&>.ant-tabs-nav_.ant-tabs-tab]:flex-1",
  "[&>.ant-tabs-nav_.ant-tabs-tab]:justify-center [&>.ant-tabs-nav_.ant-tabs-tab]:px-2 [&>.ant-tabs-nav_.ant-tabs-tab]:py-3",
  "[&>.ant-tabs-nav_.ant-tabs-tab-btn]:whitespace-normal [&>.ant-tabs-nav_.ant-tabs-tab-btn]:text-center",
  "[&>.ant-tabs-nav_.ant-tabs-tab-btn]:leading-normal [&>.ant-tabs-nav_.ant-tabs-tab-btn]:[overflow-wrap:anywhere]",
].join(" ");
const CONFIRM_CLASSES = [
  "knowledge-action-confirm max-w-[min(320px,calc(100vw-24px))]",
  "[&_.ant-popover-inner]:!rounded-xl [&_.ant-popover-inner]:border [&_.ant-popover-inner]:border-slate-100",
  "[&_.ant-popover-inner]:!p-4 [&_.ant-popover-inner]:!shadow-xl [&_.ant-popconfirm-description]:leading-relaxed",
  "[&_.ant-popconfirm-buttons_.ant-btn]:!rounded-lg [&_.ant-popconfirm-buttons_.ant-btn]:!h-8",
  "[&_.ant-popconfirm-buttons_.ant-btn]:!px-3 [&_.ant-popconfirm-buttons_.ant-btn]:!text-xs",
].join(" ");
const EDITOR_MODAL_PROPS: Pick<ModalProps, "className" | "classNames" | "footer" | "okButtonProps" | "cancelButtonProps"> = {
  className: "knowledge-editor-modal !top-4 !max-w-[calc(100vw-24px)] pb-4 [overflow-wrap:anywhere]",
  classNames: {
    content: "!flex !max-h-[calc(100vh-32px)] !flex-col supports-[height:100dvh]:!max-h-[calc(100dvh-32px)] max-sm:!p-4",
    header: "!shrink-0 !pr-6",
    body: [
      "min-h-0 overflow-y-auto break-normal ![overflow-wrap:anywhere]",
      "[&_.ant-tag]:max-w-full [&_.ant-tag]:whitespace-normal [&_.ant-tag]:[overflow-wrap:anywhere]",
      "max-sm:[&_.ant-input]:!text-base max-sm:[&_.ant-select-selection-item]:!text-base",
      "max-sm:[&_.ant-select-selection-search-input]:!text-base",
    ].join(" "),
    footer: "!shrink-0",
  },
  footer: (_, { OkBtn, CancelBtn }) => (
    <Flex gap={8} justify="flex-end" className="flex-col-reverse sm:flex-row [&_.ant-btn+.ant-btn]:!ms-0">
      <CancelBtn />
      <OkBtn />
    </Flex>
  ),
  okButtonProps: { className: "max-sm:!w-full max-sm:!min-h-10" },
  cancelButtonProps: { className: "max-sm:!w-full max-sm:!min-h-10" },
};

export const SelfLearningKnowledge: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("gaps");

  // State: Questions callers asked that need approval
  const [gaps, setGaps] = useState<CustomerKnowledgeGap[]>([]);
  const [gapsLoading, setGapsLoading] = useState<boolean>(false);

  // State: Active knowledge entries
  const [entries, setEntries] = useState<DynamicKnowledgeEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [usageSort, setUsageSort] = useState<"ascend" | "descend" | null>(null);
  const [viewingDetails, setViewingDetails] = useState<KnowledgeDetails | null>(null);

  // Modal 1: Review & Edit Answer Before Approving
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [selectedGap, setSelectedGap] = useState<CustomerKnowledgeGap | null>(null);
  const [reviewEnglishAnswer, setReviewEnglishAnswer] = useState<string>("");
  const [reviewTeluguAnswer, setReviewTeluguAnswer] = useState<string>("");
  const [approving, setApproving] = useState<boolean>(false);

  // Modal 2: Edit Existing Live Knowledge Entry
  const [editEntryModalVisible, setEditEntryModalVisible] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<DynamicKnowledgeEntry | null>(null);
  const [editPatterns, setEditPatterns] = useState<string>("");
  const [editEnglish, setEditEnglish] = useState<string>("");
  const [editTelugu, setEditTelugu] = useState<string>("");
  const [editActive, setEditActive] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Modal 3: Teach AI a New Answer Directly
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [createPlatform, setCreatePlatform] = useState<string>("TVRADHAKRISHNA");
  const [createIntent, setCreateIntent] = useState<string>("");
  const [createPatterns, setCreatePatterns] = useState<string>("");
  const [createEnglish, setCreateEnglish] = useState<string>("");
  const [createTelugu, setCreateTelugu] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  // Fetch pending caller questions
  const fetchGaps = async () => {
    setGapsLoading(true);
    try {
      const data = await getKnowledgeGaps(
        selectedPlatform === "ALL" ? undefined : selectedPlatform,
        "PENDING",
      );
      setGaps(data || []);
    } catch (err: any) {
      message.error(err?.message || "Failed to load pending questions");
    } finally {
      setGapsLoading(false);
    }
  };

  // Fetch live active knowledge entries
  const fetchEntries = async () => {
    setEntriesLoading(true);
    try {
      const data = await getActiveKnowledgeEntries(
        selectedPlatform === "ALL" ? undefined : selectedPlatform,
      );
      setEntries(data || []);
    } catch (err: any) {
      message.error(err?.message || "Failed to load live knowledge base");
    } finally {
      setEntriesLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
    fetchEntries();
  }, [selectedPlatform]);

  // Open Review & Edit Modal
  const openReviewModal = (gap: CustomerKnowledgeGap) => {
    setSelectedGap(gap);
    setReviewEnglishAnswer(gap.suggestedAnswer || "");
    setReviewTeluguAnswer("");
    setReviewModalVisible(true);
  };

  // Submit approved answer
  const handleApproveSubmit = async () => {
    if (!selectedGap) return;
    if (!reviewEnglishAnswer.trim()) {
      message.warning("Please enter an answer before approving.");
      return;
    }

    setApproving(true);
    try {
      await approveKnowledgeGap(
        selectedGap.id,
        reviewEnglishAnswer.trim(),
        reviewTeluguAnswer.trim() || undefined,
      );
      message.success("Approved! Live calls will now use this answer.");
      setReviewModalVisible(false);
      fetchGaps();
      fetchEntries();
    } catch (err: any) {
      message.error(err?.message || "Failed to publish answer");
    } finally {
      setApproving(false);
    }
  };

  // Dismiss question
  const handleReject = async (gapId: number) => {
    try {
      await rejectKnowledgeGap(gapId);
      message.info("Question dismissed");
      fetchGaps();
    } catch (err: any) {
      message.error(err?.message || "Failed to dismiss question");
    }
  };

  // Open Edit Modal for existing live entry
  const openEditEntryModal = (entry: DynamicKnowledgeEntry) => {
    setEditingEntry(entry);
    setEditPatterns(entry.queryMatchPatterns || "");
    setEditEnglish(entry.verifiedAnswer || "");
    setEditTelugu(entry.teluguAnswer || "");
    setEditActive(entry.active !== false);
    setEditEntryModalVisible(true);
  };

  // Update existing live entry
  const handleUpdateEntrySubmit = async () => {
    if (!editingEntry) return;
    if (!editEnglish.trim()) {
      message.warning("English answer cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      await updateKnowledgeEntry(editingEntry.id, {
        queryMatchPatterns: editPatterns.trim(),
        verifiedAnswer: editEnglish.trim(),
        teluguAnswer: editTelugu.trim() || undefined,
        active: editActive,
      });
      message.success("Knowledge updated! Applied to live calls.");
      setEditEntryModalVisible(false);
      fetchEntries();
    } catch (err: any) {
      message.error(err?.message || "Failed to update entry");
    } finally {
      setUpdating(false);
    }
  };

  // Delete live entry
  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteKnowledgeEntry(id);
      message.success("Knowledge entry deleted from live calls");
      fetchEntries();
    } catch (err: any) {
      message.error(err?.message || "Failed to delete entry");
    }
  };

  // Directly teach AI a new answer
  const handleDirectCreate = async () => {
    if (!createIntent.trim() || !createPatterns.trim() || !createEnglish.trim()) {
      message.warning("Please fill in Topic, Keywords, and the English Answer.");
      return;
    }

    setCreating(true);
    try {
      await createDirectKnowledgeEntry({
        platform: createPlatform,
        intentKey: createIntent.trim(),
        queryMatchPatterns: createPatterns.trim(),
        verifiedAnswer: createEnglish.trim(),
        teluguAnswer: createTelugu.trim() || undefined,
      });
      message.success("New verified Q&A published to live voice calls!");
      setCreateModalVisible(false);
      setCreateIntent("");
      setCreatePatterns("");
      setCreateEnglish("");
      setCreateTelugu("");
      setActiveTab("entries");
      fetchEntries();
    } catch (err: any) {
      message.error(err?.message || "Failed to create knowledge entry");
    } finally {
      setCreating(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const lower = searchFilter.trim().toLowerCase();
    const matchingEntries = lower ? entries.filter(
      (e) =>
        e.intentKey.toLowerCase().includes(lower) ||
        e.queryMatchPatterns.toLowerCase().includes(lower) ||
        e.verifiedAnswer.toLowerCase().includes(lower) ||
        (e.teluguAnswer && e.teluguAnswer.toLowerCase().includes(lower)),
    ) : [...entries];
    if (usageSort) {
      matchingEntries.sort((a, b) => usageSort === "ascend"
        ? (a.usageCount || 0) - (b.usageCount || 0)
        : (b.usageCount || 0) - (a.usageCount || 0));
    }
    return matchingEntries;
  }, [entries, searchFilter, usageSort]);

  const renderCellPreview = (value: string | null | undefined, details: KnowledgeDetails, label: string) => (
    <Button
      type="link"
      size="small"
      icon={<EyeOutlined className="!text-xs" />}
      onClick={() => setViewingDetails(details)}
      aria-label={label}
      title={label}
      className="knowledge-cell-preview !flex !h-auto !w-full !min-w-0 !justify-start !gap-1 !p-0 !text-left !text-[13px]"
    >
      <span className="block min-w-0 flex-1 truncate">{compactText(value)}</span>
    </Button>
  );

  const renderGapActions = (record: CustomerKnowledgeGap) => (
    <Flex gap={6} align="center" className="knowledge-actions min-w-0 w-full">
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={() => openReviewModal(record)}
        title="Review and edit answer"
        className={ACTION_BUTTON_CLASSES}
      >
        Review
      </Button>
      <Popconfirm
        title="Dismiss Question"
        description="Remove this inquiry from review?"
        onConfirm={() => handleReject(record.id)}
        okText="Dismiss"
        cancelText="Cancel"
        placement="top"
        rootClassName={CONFIRM_CLASSES}
        icon={<ExclamationCircleFilled className="!text-[#b8860b]" />}
      >
        <Button
          size="small"
          icon={<CloseOutlined />}
          className={`${ACTION_BUTTON_CLASSES} !bg-slate-50 !text-slate-600 hover:!bg-slate-100`}
        >
          Dismiss
        </Button>
      </Popconfirm>
    </Flex>
  );

  const renderEntryActions = (entry: DynamicKnowledgeEntry) => (
    <Flex gap={6} align="center" className="knowledge-actions knowledge-entry-actions min-w-0 w-full">
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={() => openEditEntryModal(entry)}
        className={ACTION_BUTTON_CLASSES}
      >
        Edit
      </Button>
      <Popconfirm
        title="Delete knowledge entry?"
        description="This answer will be removed from live AI calls."
        onConfirm={() => handleDeleteEntry(entry.id)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, type: "primary" }}
        placement="top"
        rootClassName={CONFIRM_CLASSES}
        icon={<ExclamationCircleFilled className="!text-rose-600" />}
      >
        <Button
          size="small"
          danger
          color="danger"
          variant="filled"
          icon={<DeleteOutlined />}
          className={`${ACTION_BUTTON_CLASSES} !border-rose-200 hover:!border-rose-300 focus-visible:!outline-rose-600`}
        >
          Delete
        </Button>
      </Popconfirm>
    </Flex>
  );

  const renderPlatform = (platform: string) => (
    <Tag color="gold" className="!m-0 !inline-block max-w-full truncate !rounded-full !px-2 !text-[11px]">
      {compactText(platform, 30)}
    </Tag>
  );

  const gapColumns: ColumnsType<CustomerKnowledgeGap> = [
    { title: "Platform", dataIndex: "platform", width: 130, ellipsis: { showTitle: false },
      render: (platform: string) => renderPlatform(platform || "TVRADHAKRISHNA") },
    { title: "Caller question", key: "question", width: 260, ellipsis: { showTitle: false },
      render: (_, record) => renderCellPreview(record.rawCallerQuestion, { kind: "gap", record }, "View full question") },
    { title: "Suggested answer", key: "answer", width: 324, ellipsis: { showTitle: false },
      render: (_, record) => renderCellPreview(record.suggestedAnswer, { kind: "gap", record }, "View full suggestion") },
    { title: "Asked", dataIndex: "occurrenceCount", width: 66, align: "center" },
    { title: "Actions", key: "actions", width: 180, align: "center",
      render: (_, record) => renderGapActions(record) },
  ];

  const entryColumns: ColumnsType<DynamicKnowledgeEntry> = [
    { title: "Topic", dataIndex: "intentKey", width: 160, ellipsis: { showTitle: false },
      render: (topic: string) => <span className="block truncate font-mono text-xs font-semibold">{compactText(topic, 40)}</span> },
    { title: "Platform", dataIndex: "platform", width: 130, ellipsis: { showTitle: false },
      render: (platform: string) => renderPlatform(platform) },
    { title: "Keywords", dataIndex: "queryMatchPatterns", width: 180, ellipsis: { showTitle: false },
      render: (keywords: string) => <span className="block truncate">{compactText(keywords, 60)}</span> },
    { title: "Verified answer", key: "answer", width: 162, ellipsis: { showTitle: false },
      render: (_, record) => renderCellPreview(record.verifiedAnswer || record.teluguAnswer, { kind: "entry", record }, "View full answer") },
    { title: "Calls", dataIndex: "usageCount", width: 72, align: "center",
      sorter: (a, b) => (a.usageCount || 0) - (b.usageCount || 0), sortOrder: usageSort,
      render: (count: number) => count || 0 },
    { title: "Status", dataIndex: "active", width: 76,
      render: (active: boolean) => <Tag color={active ? "gold" : undefined} className="!m-0 !rounded-full !px-2 !text-[11px]">{active ? "Active" : "Paused"}</Tag> },
    { title: "Actions", key: "actions", width: 180, align: "center",
      render: (_, record) => renderEntryActions(record) },
  ];

  return (
    <ConfigProvider theme={KNOWLEDGE_THEME}>
    <VoiceAdminLayout activeKey="selflearning">
      <div className="self-learning-knowledge min-w-0 [container-type:inline-size] [overflow-wrap:anywhere]">
      {/* ── Intro Hero (Standard Light Gradient Theme) ─────────────────────── */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-sm">
        <div className={ROW_CLASSES}>
          <div className="flex min-w-0 flex-[1_1_340px] items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm shrink-0">
              <RiRobot2Line className="text-[#b8860b] text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900">
                Self-Learning Knowledge
              </h2>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                Review unanswered caller questions and manage verified answers for live AI calls
              </p>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid min-w-0 max-w-[320px] flex-[1_1_240px] grid-cols-2 gap-3">
            <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 min-w-0">
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                {gaps.length}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Pending Review</div>
            </div>
            <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-3 sm:px-5 py-2.5 sm:py-3 min-w-0">
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                {entries.length}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Active Facts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Action Bar ────────────────────────────────────────────── */}
      <div className={`${ROW_CLASSES} mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4`}>
        <div className="flex min-w-0 flex-[1_1_340px] flex-wrap items-center gap-3 [@container(max-width:560px)]:grid [@container(max-width:560px)]:grid-cols-[minmax(0,1fr)_auto] [@container(max-width:560px)]:basis-full">
          <span className="text-xs font-medium text-slate-600 [@container(max-width:560px)]:col-span-full">Platform:</span>
          <Select
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            className="min-w-0 max-w-[240px] flex-[1_1_140px] [@container(max-width:560px)]:w-full [@container(max-width:560px)]:max-w-none"
            aria-label="Filter by platform"
            options={[
              { value: "ALL", label: "All Platforms" },
              ...PLATFORMS.map((p) => ({
                value: p,
                label: PLATFORM_LABELS[p] || p,
              })),
            ]}
          />
          <Button
            icon={<RiRefreshLine />}
            onClick={() => {
              fetchGaps();
              fetchEntries();
            }}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>

        {/* Accessible Add New Answer Button */}
        <div className="min-w-0 max-w-full [@container(max-width:560px)]:w-full">
          <Button
            type="primary"
            icon={<RiAddLine />}
            onClick={() => setCreateModalVisible(true)}
            className="[@container(max-width:560px)]:w-full"
          >
            Teach AI a New Answer
          </Button>
        </div>
      </div>

      {/* ── Knowledge tables ──────────────────────────────────────────────── */}
      <div className="min-w-0 max-w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <Tabs
          className={TABS_CLASSES}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "gaps",
              label: (
                <span className="font-medium text-xs sm:text-sm">
                  Questions Needing Review ({gaps.length})
                </span>
              ),
              children: (
                <div className="pt-2">
                  {gaps.length === 0 && !gapsLoading ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-8 sm:p-12 text-center">
                      <RiCheckboxCircleLine className="text-4xl text-amber-300 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm font-medium mb-1">
                        All caught up! Zero pending questions.
                      </p>
                      <p className="text-slate-400 text-xs max-w-md mx-auto mb-4">
                        When a customer asks a question the AI cannot answer, it will appear here for review.
                      </p>
                      <Button
                        icon={<RiAddLine />}
                        onClick={() => setCreateModalVisible(true)}
                        className="!h-auto min-h-10 max-w-full whitespace-normal !rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 text-xs font-medium"
                      >
                        Teach AI a New Answer Directly
                      </Button>
                    </div>
                  ) : (
                    <div className="min-w-0 max-w-full">
                    <p className="mb-2 text-xs text-slate-500 [@container(min-width:1000px)]:hidden">
                      Scroll horizontally to see all columns.
                    </p>
                    <Table<CustomerKnowledgeGap>
                      rowKey="id"
                      size="small"
                      loading={gapsLoading}
                      columns={gapColumns}
                      dataSource={gaps}
                      tableLayout="fixed"
                      scroll={{ x: 960 }}
                      pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true, responsive: true, showLessItems: true }}
                      className={TABLE_CLASSES}
                    />
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "entries",
              label: (
                <span className="font-medium text-xs sm:text-sm">
                  Active Knowledge Library ({entries.length})
                </span>
              ),
              children: (
                <div className="pt-2 flex flex-col gap-3">
                  <div className={ROW_CLASSES}>
                    <span className="text-xs text-slate-500">
                      Live verified answers spoken during calls
                    </span>
                    <div className="flex min-w-0 max-w-full flex-[1_1_320px] flex-wrap justify-end gap-2 [@container(max-width:560px)]:w-full [@container(max-width:560px)]:max-w-none">
                    <Input
                      prefix={<RiSearchLine className="text-gray-400" />}
                      placeholder="Search knowledge by topic or words..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="min-w-0 max-w-[360px] flex-[1_1_240px] [@container(max-width:560px)]:w-full [@container(max-width:560px)]:max-w-none max-sm:[&_input]:!text-base"
                      aria-label="Search knowledge"
                      allowClear
                    />
                    <div className="min-w-0 max-w-[200px] flex-[1_1_160px] [@container(max-width:560px)]:w-full [@container(max-width:560px)]:max-w-none">
                      <Select<"default" | "ascend" | "descend">
                        aria-label="Sort knowledge by usage"
                        value={usageSort || "default"}
                        onChange={(value) => setUsageSort(value === "default" ? null : value)}
                        options={[
                          { value: "default", label: "Default order" },
                          { value: "descend", label: "Most used first" },
                          { value: "ascend", label: "Least used first" },
                        ]}
                        className="w-full"
                      />
                    </div>
                    </div>
                  </div>
                  <div className="min-w-0 max-w-full">
                  <p className="mb-2 text-xs text-slate-500 [@container(min-width:1000px)]:hidden">
                    Scroll horizontally to see all columns.
                  </p>
                  <Table<DynamicKnowledgeEntry>
                    rowKey="id"
                    size="small"
                    loading={entriesLoading}
                    columns={entryColumns}
                    dataSource={filteredEntries}
                    tableLayout="fixed"
                    scroll={{ x: 960 }}
                    onChange={(_, __, sorter) => setUsageSort(Array.isArray(sorter) ? null : sorter.order || null)}
                    pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true, responsive: true, showLessItems: true }}
                    locale={{ emptyText: "No matching knowledge entries" }}
                    className={TABLE_CLASSES}
                  />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal
        {...EDITOR_MODAL_PROPS}
        className={`${EDITOR_MODAL_PROPS.className} knowledge-details-modal`}
        title={viewingDetails?.kind === "entry" ? "Verified answer" : "Question details"}
        open={viewingDetails !== null}
        onCancel={() => setViewingDetails(null)}
        width={960}
        destroyOnClose
        footer={
          <Button
            type="primary"
            onClick={() => setViewingDetails(null)}
            className="max-sm:!w-full max-sm:!min-h-10"
          >
            Close
          </Button>
        }
      >
        {viewingDetails && (
          <div className="space-y-4 py-1">
            <Flex gap={8} align="center" wrap>
              <Tag color="gold" className="!m-0 !rounded-full">
                {viewingDetails.record.platform || "TVRADHAKRISHNA"}
              </Tag>
              <Typography.Text className="line-clamp-2 min-w-0 font-mono !text-xs !text-slate-500">
                {viewingDetails.kind === "entry" ? viewingDetails.record.intentKey : viewingDetails.record.callerIntent}
              </Typography.Text>
            </Flex>

            {viewingDetails.kind === "entry" ? (
              <>
                <Tabs
                  size="small"
                  defaultActiveKey={!viewingDetails.record.verifiedAnswer && viewingDetails.record.teluguAnswer ? "telugu" : "english"}
                  className="knowledge-answer-languages min-w-0 [&_.ant-tabs-tabpane]:min-w-0"
                  items={[
                    {
                      key: "english",
                      label: "English",
                      children: (
                        <Typography.Paragraph className={`knowledge-full-answer !mb-0 !text-sm ${COPY_CLASSES}`}>
                          {viewingDetails.record.verifiedAnswer || "No English answer available."}
                        </Typography.Paragraph>
                      ),
                    },
                    ...(viewingDetails.record.teluguAnswer ? [{
                      key: "telugu",
                      label: "Telugu",
                      children: (
                        <Typography.Paragraph className={`knowledge-full-answer !mb-0 !text-sm ${COPY_CLASSES}`}>
                          {viewingDetails.record.teluguAnswer}
                        </Typography.Paragraph>
                      ),
                    }] : []),
                  ]}
                />
                <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-slate-500">Topic</h3>
                    <div className={`font-mono text-xs ${COPY_CLASSES}`}>{viewingDetails.record.intentKey}</div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-semibold text-slate-500">Trigger keywords</h3>
                    <div className={`knowledge-full-keywords text-sm ${COPY_CLASSES}`}>
                      {viewingDetails.record.queryMatchPatterns || "—"}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-slate-500">Caller's question</h3>
                  <Typography.Paragraph className={`knowledge-full-question !mb-0 !text-sm ${COPY_CLASSES}`}>
                    {viewingDetails.record.rawCallerQuestion}
                  </Typography.Paragraph>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">AI suggested answer</h3>
                  <Typography.Paragraph className={`knowledge-full-answer !mb-0 !text-sm ${COPY_CLASSES}`}>
                    {viewingDetails.record.suggestedAnswer || "No suggested answer yet."}
                  </Typography.Paragraph>
                </div>
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-500">Topic</h3>
                  <div className={`font-mono text-xs ${COPY_CLASSES}`}>{viewingDetails.record.callerIntent}</div>
                </div>
                <Typography.Text type="secondary" className="!text-xs">
                  Asked {viewingDetails.record.occurrenceCount} times
                  {viewingDetails.record.createdAt ? ` · ${dayjs(viewingDetails.record.createdAt).format("DD MMM YYYY, hh:mm A")}` : ""}
                </Typography.Text>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* ── MODAL 1: Review & Edit Answer Before Approving ────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <RiQuestionLine className="text-[#b8860b] text-lg" />
            <span className="font-semibold text-slate-900 text-sm sm:text-base">
              Review & Approve Answer
            </span>
          </div>
        }
        open={reviewModalVisible}
        onOk={handleApproveSubmit}
        onCancel={() => setReviewModalVisible(false)}
        confirmLoading={approving}
        okText="Approve for Live Calls"
        {...EDITOR_MODAL_PROPS}
        width={620}
      >
        {selectedGap && (
          <div className="space-y-4 py-3">
            <div className="bg-amber-50/40 p-3 rounded-lg border border-amber-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">
                Caller's Question:
              </span>
              <p className={`${COPY_CLASSES} text-sm font-semibold text-slate-900`}>
                "{selectedGap.rawCallerQuestion}"
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                <Tag color="gold">{selectedGap.platform}</Tag>
                <span>Topic: <strong>{selectedGap.callerIntent}</strong></span>
                <span>• Asked {selectedGap.occurrenceCount} times</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Verified English Answer:
              </label>
              <TextArea
                rows={4}
                value={reviewEnglishAnswer}
                onChange={(e) => setReviewEnglishAnswer(e.target.value)}
                placeholder="The exact response the AI will speak to callers in English..."
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Verified Telugu Answer (Optional):
              </label>
              <TextArea
                rows={3}
                value={reviewTeluguAnswer}
                onChange={(e) => setReviewTeluguAnswer(e.target.value)}
                placeholder="Telugu response if caller chooses Telugu..."
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL 2: Edit Existing Live Knowledge Entry ───────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <RiEditLine className="text-[#b8860b] text-lg" />
            <span className="font-semibold text-slate-900 text-sm sm:text-base">
              Edit Live Knowledge
            </span>
          </div>
        }
        open={editEntryModalVisible}
        onOk={handleUpdateEntrySubmit}
        onCancel={() => setEditEntryModalVisible(false)}
        confirmLoading={updating}
        okText="Save Changes"
        {...EDITOR_MODAL_PROPS}
        width={600}
      >
        {editingEntry && (
          <div className="space-y-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className={`${COPY_CLASSES} flex-1`}>
                <span className="text-xs text-slate-500 block">Topic Intent:</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {editingEntry.intentKey}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-600">Active:</span>
                <Switch
                  checked={editActive}
                  onChange={setEditActive}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Trigger Keywords (comma separated):
              </label>
              <Input
                value={editPatterns}
                onChange={(e) => setEditPatterns(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Verified English Answer:
              </label>
              <TextArea
                rows={4}
                value={editEnglish}
                onChange={(e) => setEditEnglish(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Verified Telugu Answer (Optional):
              </label>
              <TextArea
                rows={3}
                value={editTelugu}
                onChange={(e) => setEditTelugu(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL 3: Teach AI a New Answer Directly ───────────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <RiAddLine className="text-[#b8860b] text-lg" />
            <span className="font-semibold text-slate-900 text-sm sm:text-base">
              Teach AI a New Answer
            </span>
          </div>
        }
        open={createModalVisible}
        onOk={handleDirectCreate}
        onCancel={() => setCreateModalVisible(false)}
        confirmLoading={creating}
        okText="Publish to Live Calls"
        {...EDITOR_MODAL_PROPS}
        width={600}
      >
        <div className="space-y-4 py-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Platform:
            </label>
            <Select
              value={createPlatform}
              onChange={setCreatePlatform}
              className="w-full text-xs"
              options={PLATFORMS.map((p) => ({
                value: p,
                label: PLATFORM_LABELS[p] || p,
              }))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Topic Intent (Short identifier):
            </label>
            <Input
              placeholder="e.g. walkin_timings, interest_rates"
              value={createIntent}
              onChange={(e) => setCreateIntent(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Trigger Keywords (Comma separated):
            </label>
            <Input
              placeholder="e.g. walk in time, office timing, working hours"
              value={createPatterns}
              onChange={(e) => setCreatePatterns(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Verified English Answer:
            </label>
            <TextArea
              rows={3}
              placeholder="The concise response the AI will speak in English..."
              value={createEnglish}
              onChange={(e) => setCreateEnglish(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Verified Telugu Answer (Optional):
            </label>
            <TextArea
              rows={3}
              placeholder="The response the AI will speak in Telugu..."
              value={createTelugu}
              onChange={(e) => setCreateTelugu(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
        </div>
      </Modal>
      </div>
    </VoiceAdminLayout>
    </ConfigProvider>
  );
};

export default SelfLearningKnowledge;
