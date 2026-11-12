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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiRobot2Line,
  RiAddLine,
  RiRefreshLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckboxCircleLine,
  RiCloseLine,
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
    if (!searchFilter.trim()) return entries;
    const lower = searchFilter.toLowerCase();
    return entries.filter(
      (e) =>
        e.intentKey.toLowerCase().includes(lower) ||
        e.queryMatchPatterns.toLowerCase().includes(lower) ||
        e.verifiedAnswer.toLowerCase().includes(lower) ||
        (e.teluguAnswer && e.teluguAnswer.toLowerCase().includes(lower)),
    );
  }, [entries, searchFilter]);

  // Tab 1 Columns: Pending Caller Questions
  const gapColumns: ColumnsType<CustomerKnowledgeGap> = [
    {
      title: "Frequency",
      dataIndex: "occurrenceCount",
      key: "occurrenceCount",
      width: 110,
      render: (count: number) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-white text-[#b8860b] border border-amber-200 whitespace-nowrap">
          {count} {count > 1 ? "callers" : "caller"}
        </span>
      ),
    },
    {
      title: "Caller's Question",
      key: "question",
      render: (_, record) => (
        <div className="py-1">
          <div className="font-semibold text-slate-900 text-xs leading-relaxed">
            "{record.rawCallerQuestion}"
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Topic: <strong className="text-slate-600">{record.callerIntent}</strong></span>
            <span>•</span>
            <span>{record.createdAt ? dayjs(record.createdAt).format("DD MMM, hh:mm A") : "—"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      width: 130,
      render: (v: string) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-white text-[#b8860b] border border-amber-200 whitespace-nowrap">
          {v || "TVRADHAKRISHNA"}
        </span>
      ),
    },
    {
      title: "AI Suggested Answer",
      dataIndex: "suggestedAnswer",
      key: "suggestedAnswer",
      render: (ans: string) => (
        <div className="text-slate-600 text-xs leading-relaxed max-w-md">
          {ans || "—"}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 170,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<RiEditLine />}
            onClick={() => openReviewModal(record)}
            className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 !font-medium text-xs whitespace-nowrap"
          >
            Review & Edit
          </Button>
          <Popconfirm
            title="Dismiss Question"
            description="Remove this inquiry from review?"
            onConfirm={() => handleReject(record.id)}
            okText="Dismiss"
            cancelText="Cancel"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<RiCloseLine />}
              className="text-xs"
            >
              Dismiss
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Tab 2 Columns: Live Active Knowledge Library
  const entryColumns: ColumnsType<DynamicKnowledgeEntry> = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      width: 130,
      render: (v: string) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-white text-[#b8860b] border border-amber-200 whitespace-nowrap">
          {v}
        </span>
      ),
    },
    {
      title: "Topic Intent",
      dataIndex: "intentKey",
      key: "intentKey",
      width: 150,
      render: (v: string) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {v}
        </span>
      ),
    },
    {
      title: "Trigger Keywords",
      dataIndex: "queryMatchPatterns",
      key: "queryMatchPatterns",
      width: 200,
      render: (patterns: string) => (
        <span className="text-xs text-slate-600 leading-relaxed">
          {patterns || "—"}
        </span>
      ),
    },
    {
      title: "Verified Answers",
      key: "answers",
      render: (_, record) => (
        <div className="flex flex-col gap-1 text-xs py-1 leading-relaxed max-w-md">
          <div>
            <strong className="text-slate-800">EN: </strong>
            <span className="text-slate-600">{record.verifiedAnswer}</span>
          </div>
          {record.teluguAnswer && (
            <div>
              <strong className="text-amber-800">TE: </strong>
              <span className="text-slate-600">{record.teluguAnswer}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Calls Used",
      dataIndex: "usageCount",
      key: "usageCount",
      width: 100,
      sorter: (a, b) => a.usageCount - b.usageCount,
      render: (count: number) => (
        <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
          {count || 0} calls
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: 90,
      render: (active: boolean) =>
        active ? (
          <Tag color="gold" className="!rounded-full !px-2.5 !py-0.5 !text-xs !font-medium">
            Active
          </Tag>
        ) : (
          <Tag className="!rounded-full !px-2.5 !py-0.5 !text-xs text-gray-400">
            Paused
          </Tag>
        ),
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="small"
            icon={<RiEditLine />}
            onClick={() => openEditEntryModal(record)}
            className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 !font-medium text-xs whitespace-nowrap"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Knowledge"
            description="Delete this entry from live calls?"
            onConfirm={() => handleDeleteEntry(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<RiDeleteBinLine />}
              className="text-xs"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <VoiceAdminLayout activeKey="selflearning">
      {/* ── Intro Hero (Standard Light Gradient Theme) ─────────────────────── */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm shrink-0">
              <RiRobot2Line className="text-[#b8860b] text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Self-Learning Knowledge
              </h2>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                Review unanswered caller questions and manage verified answers for live AI calls
              </p>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
            <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                {gaps.length}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Pending Review</div>
            </div>
            <div className="text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 min-w-[100px]">
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                {entries.length}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Active Facts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Action Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-slate-600">Platform:</span>
          <Select
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            className="w-44 sm:w-48 text-xs"
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
        <div>
          <Button
            type="primary"
            icon={<RiAddLine />}
            onClick={() => setCreateModalVisible(true)}
            className="w-full sm:w-auto text-xs"
            style={{
              background: "linear-gradient(to right, #c9a24b, #b8860b)",
              border: "none",
              fontWeight: 500,
            }}
          >
            Teach AI a New Answer
          </Button>
        </div>
      </div>

      {/* ── Main Tabbed Content & Table Container ──────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 overflow-hidden">
        <Tabs
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
                        className="!rounded-full !border-amber-200 !bg-amber-50 !text-[#b8860b] hover:!bg-amber-100 hover:!border-amber-300 text-xs font-medium"
                      >
                        Teach AI a New Answer Directly
                      </Button>
                    </div>
                  ) : (
                    <Table
                      rowKey="id"
                      loading={gapsLoading}
                      columns={gapColumns}
                      dataSource={gaps}
                      pagination={{ pageSize: 10, showSizeChanger: false }}
                      scroll={{ x: 800 }}
                      bordered
                      className="[&_.ant-table-thead_th]:!bg-amber-50 [&_.ant-table-thead_th]:!text-slate-800 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-tbody_td]:!text-slate-700 [&_.ant-table-tbody_tr:hover_td]:!bg-amber-50/40 text-xs"
                    />
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-slate-500">
                      Live verified answers spoken during calls
                    </span>
                    <Input
                      prefix={<RiSearchLine className="text-gray-400" />}
                      placeholder="Search knowledge by topic or words..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full sm:w-72 rounded-md text-xs"
                      allowClear
                    />
                  </div>
                  <Table
                    rowKey="id"
                    loading={entriesLoading}
                    columns={entryColumns}
                    dataSource={filteredEntries}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    scroll={{ x: 850 }}
                    bordered
                    className="[&_.ant-table-thead_th]:!bg-amber-50 [&_.ant-table-thead_th]:!text-slate-800 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-tbody_td]:!text-slate-700 [&_.ant-table-tbody_tr:hover_td]:!bg-amber-50/40 text-xs"
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

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
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #c9a24b, #b8860b)",
            border: "none",
            fontWeight: 500,
          },
        }}
        width={620}
        style={{ maxWidth: "95vw" }}
      >
        {selectedGap && (
          <div className="space-y-4 py-3">
            <div className="bg-amber-50/40 p-3 rounded-lg border border-amber-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">
                Caller's Question:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
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
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #c9a24b, #b8860b)",
            border: "none",
            fontWeight: 500,
          },
        }}
        width={600}
        style={{ maxWidth: "95vw" }}
      >
        {editingEntry && (
          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-xs text-slate-500 block">Topic Intent:</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {editingEntry.intentKey}
                </span>
              </div>
              <div className="flex items-center gap-2">
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
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #c9a24b, #b8860b)",
            border: "none",
            fontWeight: 500,
          },
        }}
        width={600}
        style={{ maxWidth: "95vw" }}
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
    </VoiceAdminLayout>
  );
};

export default SelfLearningKnowledge;
