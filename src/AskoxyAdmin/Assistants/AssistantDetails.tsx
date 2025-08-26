import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Assistant,
  Tool,
  updateAssistant,
  uploadFile,
  getModels,
  Model,
  createVectorStore,
  addFileToVectorStore,
  deleteAssistant,
} from "./assistantApi";
import {
  Input,
  InputNumber,
  Button,
  Select,
  Switch,
  Upload,
  message,
  Space,
  Divider,
  Spin,
  Modal,
  Card,
  Tag,
  Typography,
  Tooltip,
  Slider,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  SaveOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;

interface AssistantDetailsProps {
  assistant: Assistant | null;
  onAssistantUpdated?: (assistant: Assistant) => void;
  onAssistantDeleted?: () => void;
}

type KV = { key: string; value: string };

const RESPONSE_FORMAT_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Text", value: "text" },
  { label: "JSON Object", value: "json_object" },
];

const RANKER_OPTIONS = [
  { label: "Default (2024-08-21)", value: "default_2024_08_21" },
  { label: "Auto", value: "auto" },
];

const AssistantDetails: React.FC<AssistantDetailsProps> = ({
  assistant,
  onAssistantUpdated,
  onAssistantDeleted,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formState, setFormState] = useState<Partial<Assistant>>(
    assistant || {}
  );
  const [editingFunctionIndex, setEditingFunctionIndex] = useState<number>(-1);
  const [singleFunctionText, setSingleFunctionText] = useState("");
  const [addingNewFunction, setAddingNewFunction] = useState(false);

  const [models, setModels] = useState<Model[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [customFunctionsEnabledState, setCustomFunctionsEnabledState] =
    useState(false);
  const [customFunctionsModalVisible, setCustomFunctionsModalVisible] =
    useState(false);
  const [customFunctionsText, setCustomFunctionsText] = useState("");
  const [customFunctionsEnabled, setCustomFunctionsEnabled] = useState(false);

  // Store original state for comparison
  const [originalState, setOriginalState] = useState<Partial<Assistant>>({});

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await getModels();
        if (Array.isArray(res)) setModels(res);
      } catch {
        setModels([
          { id: "gpt-4o", object: "model", created: 0, owned_by: "default" },
          {
            id: "gpt-4o-mini",
            object: "model",
            created: 0,
            owned_by: "default",
          },
          {
            id: "gpt-4-turbo",
            object: "model",
            created: 0,
            owned_by: "default",
          },
          {
            id: "gpt-3.5-turbo",
            object: "model",
            created: 0,
            owned_by: "default",
          },
        ]);
        message.error("Failed to fetch models. Using defaults.");
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    if (assistant) {
      setFormState(assistant);
      setOriginalState(assistant);
      setHasUnsavedChanges(false);

      // Set vector store IDs from tool_resources
      const vectorStoreIds =
        assistant.tool_resources?.file_search?.vector_store_ids || [];
      setVectorStoreIds(vectorStoreIds);

      // Set file search options from tools
      const fileSearchTool = assistant.tools?.find(
        (t) => t.type === "file_search"
      );
      if (fileSearchTool?.file_search?.ranking_options) {
        setFileSearchRanker(
          fileSearchTool.file_search.ranking_options.ranker ||
            "default_2024_08_21"
        );
        setFileSearchScoreThreshold(
          fileSearchTool.file_search.ranking_options.score_threshold || 0
        );
      }

      // Handle functions from tools array instead of separate functions property
      const functionTools =
        assistant.tools?.filter((t) => t.type === "function") || [];
      if (functionTools.length > 0) {
        setCustomFunctionsEnabled(true);
        setCustomFunctionsEnabledState(true);
        const functions = functionTools.map((tool: any) => tool.function);
        setCustomFunctionsText(JSON.stringify({ functions }, null, 2));
      } else {
        setCustomFunctionsEnabled(false);
        setCustomFunctionsEnabledState(false);
        setCustomFunctionsText("");
      }
    }
  }, [assistant]);

  const handleCustomFunctionsToggle = (enabled: boolean) => {
    setCustomFunctionsEnabledState(enabled);
    setCustomFunctionsEnabled(enabled);
    if (enabled) {
      setCustomFunctionsModalVisible(true);
    } else {
      setCustomFunctionsText("");
      // Remove all function tools when disabled
      setFormState((prev) => ({
        ...prev,
        tools: (prev.tools || []).filter((t) => t.type !== "function"),
      }));
    }
  };

  const handleCustomFunctionsSave = () => {
    try {
      if (customFunctionsText.trim()) {
        const parsed = JSON.parse(customFunctionsText);
        if (parsed.functions && Array.isArray(parsed.functions)) {
          // Update tools in formState instead of separate functions property
          setFormState((prev) => {
            const nonFunctionTools = (prev.tools || []).filter(
              (t) => t.type !== "function"
            );
            const functionTools = parsed.functions.map((fn: any) => ({
              type: "function",
              function: fn,
            }));
            return {
              ...prev,
              tools: [...nonFunctionTools, ...functionTools],
            };
          });
          setCustomFunctionsEnabled(true);
          setCustomFunctionsModalVisible(false);
        } else {
          message.error(
            'Invalid format. Please ensure you have a "functions" array.'
          );
        }
      } else {
        // Remove all function tools
        setFormState((prev) => ({
          ...prev,
          tools: (prev.tools || []).filter((t) => t.type !== "function"),
        }));
        setCustomFunctionsEnabled(false);
        setCustomFunctionsModalVisible(false);
      }
    } catch (error) {
      message.error("Invalid JSON format. Please check your syntax.");
    }
  };

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formState) !== JSON.stringify(originalState);
    setHasUnsavedChanges(hasChanges);
  }, [formState, originalState]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleChange = useCallback((field: keyof Assistant, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const initialVectorStores: string[] = useMemo(
    () => assistant?.tool_resources?.file_search?.vector_store_ids || [],
    [assistant]
  );
  const [vectorStoreIds, setVectorStoreIds] =
    useState<string[]>(initialVectorStores);

  const [metadataList, setMetadataList] = useState<KV[]>(
    assistant?.metadata
      ? Object.entries(assistant.metadata).map(([k, v]) => ({
          key: k,
          value: typeof v === "string" ? v : JSON.stringify(v),
        }))
      : []
  );

  const [fileSearchRanker, setFileSearchRanker] = useState<string>(
    () =>
      assistant?.tools?.find((t) => t.type === "file_search")?.file_search
        ?.ranking_options?.ranker || "default_2024_08_21"
  );

  const [fileSearchScoreThreshold, setFileSearchScoreThreshold] =
    useState<number>(
      () =>
        assistant?.tools?.find((t) => t.type === "file_search")?.file_search
          ?.ranking_options?.score_threshold || 0
    );

  // Replace the simple change detection useEffect with this enhanced version:
  useEffect(() => {
    // Create current state snapshot for comparison
    const currentSnapshot = {
      ...formState,
      tool_resources: {
        ...(toolEnabled("file_search") && vectorStoreIds.length > 0
          ? { file_search: { vector_store_ids: vectorStoreIds } }
          : {}),
      },
      metadata: metadataList.reduce((acc, kv) => {
        if (kv.key.trim()) {
          try {
            acc[kv.key] = JSON.parse(kv.value);
          } catch {
            acc[kv.key] = kv.value;
          }
        }
        return acc;
      }, {} as Record<string, any>),
    };

    const hasChanges =
      JSON.stringify(currentSnapshot) !== JSON.stringify(originalState);
    setHasUnsavedChanges(hasChanges);
  }, [
    formState,
    originalState,
    vectorStoreIds,
    metadataList,
    fileSearchRanker,
    fileSearchScoreThreshold,
  ]);

  const toolEnabled = (toolType: string) =>
    (formState.tools || []).some((t) => t.type === toolType);

  const setToolEnabled = (toolType: string, enabled: boolean) => {
    setFormState((prev) => {
      let tools = prev.tools || [];
      if (enabled && !tools.some((t) => t.type === toolType)) {
        if (toolType === "file_search") {
          tools.push({
            type: "file_search",
            file_search: {
              ranking_options: {
                ranker: fileSearchRanker,
                score_threshold: fileSearchScoreThreshold,
              },
            },
          } as Tool);
        } else tools.push({ type: toolType } as Tool);
      }
      if (!enabled) tools = tools.filter((t) => t.type !== toolType);
      return { ...prev, tools };
    });
  };

  const updateFileSearchOptionsOnState = () => {
    setFormState((prev) => {
      const tools = (prev.tools || []).map((t) =>
        t.type === "file_search"
          ? ({
              type: "file_search",
              file_search: {
                ranking_options: {
                  ranker: fileSearchRanker,
                  score_threshold: fileSearchScoreThreshold,
                },
              },
            } as Tool)
          : t
      );
      return { ...prev, tools };
    });
  };

  const handleFileUpload = async (file: File) => {
    setFileLoading(true);
    try {
      const res = await uploadFile(file);
      const fileId = res?.id || res?.file?.id;
      if (!fileId) throw new Error("No file ID returned");

      let vectorStoreId: string;

      // Check if there are existing vector stores
      if (vectorStoreIds.length > 0) {
        // Use the first existing vector store
        vectorStoreId = vectorStoreIds[0];
        message.info(`Using existing vector store: ${vectorStoreId}`);
      } else {
        // Create a new vector store only if none exist
        const vectorStoreRes = await createVectorStore({
          name: `${file.name} Vector Store`,
        });
        vectorStoreId = vectorStoreRes?.id;
        if (!vectorStoreId) throw new Error("Failed to create vector store");

        // Add the new vector store ID to the list
        setVectorStoreIds((prev) => [...prev, vectorStoreId]);

        // Update form state with the new vector store
        setFormState((prev) => ({
          ...prev,
          tool_resources: {
            ...(prev.tool_resources || {}),
            file_search: {
              vector_store_ids: [
                ...(prev.tool_resources?.file_search?.vector_store_ids || []),
                vectorStoreId,
              ],
            },
          },
        }));

        message.success(`Created new vector store: ${vectorStoreId}`);
      }

      // Add file to the vector store (existing or newly created)
      await addFileToVectorStore(vectorStoreId, fileId);

      message.success(
        `File "${file.name}" uploaded and attached successfully!`
      );
    } catch (err: any) {
      message.error(err.message || "File upload failed.");
    } finally {
      setFileLoading(false);
    }
    return false;
  };

  const handleSingleFunctionSave = () => {
    try {
      if (singleFunctionText.trim()) {
        const parsed = JSON.parse(singleFunctionText);

        // Validate required fields
        if (!parsed.name) {
          message.error("Function name is required.");
          return;
        }

        if (addingNewFunction) {
          // Check if function name already exists
          const existingNames = (formState.tools || [])
            .filter((t) => t.type === "function")
            .map((tool: any) => tool.function?.name);

          if (existingNames.includes(parsed.name)) {
            message.error(
              `Function with name "${parsed.name}" already exists.`
            );
            return;
          }

          // Add new function
          setFormState((prev) => ({
            ...prev,
            tools: [
              ...(prev.tools || []),
              {
                type: "function",
                function: parsed,
              },
            ],
          }));
          message.success(`Function "${parsed.name}" added successfully!`);
        } else if (editingFunctionIndex >= 0) {
          // Update existing function
          setFormState((prev) => {
            const functionTools = (prev.tools || []).filter(
              (t) => t.type === "function"
            );
            const nonFunctionTools = (prev.tools || []).filter(
              (t) => t.type !== "function"
            );

            functionTools[editingFunctionIndex] = {
              type: "function",
              function: parsed,
            };

            return {
              ...prev,
              tools: [...nonFunctionTools, ...functionTools],
            };
          });
          message.success(`Function "${parsed.name}" updated successfully!`);
        }

        setCustomFunctionsModalVisible(false);
        setAddingNewFunction(false);
        setEditingFunctionIndex(-1);
        setSingleFunctionText("");
      }
    } catch (error) {
      message.error("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleDelete = () => {
    if (hasUnsavedChanges) {
      confirm({
        title: "Unsaved Changes",
        icon: <ExclamationCircleOutlined />,
        content:
          "You have unsaved changes. Do you want to save them before deleting?",
        okText: "Save & Delete",
        cancelText: "Delete Without Saving",
        onOk: async () => {
          await handleUpdate();
          showDeleteConfirmation();
        },
        onCancel: () => {
          showDeleteConfirmation();
        },
      });
    } else {
      showDeleteConfirmation();
    }
  };

  const showDeleteConfirmation = () => {
    confirm({
      title: "Delete Assistant",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${
        assistant?.name || "this assistant"
      }"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!assistant?.id) return;

        setDeleteLoading(true);
        try {
          await deleteAssistant(assistant.id);
          message.success("Assistant deleted successfully");
          setHasUnsavedChanges(false);
          onAssistantDeleted?.();
          navigate("/admn/assistants");
        } catch (error: any) {
          message.error(
            error?.response?.data?.error?.message ||
              "Failed to delete assistant"
          );
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  if (!assistant)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
        <span className="ml-3 text-purple-600">
          Loading assistant details...
        </span>
      </div>
    );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const metadata: Record<string, any> = {};
      metadataList
        .filter((kv) => kv.key.trim())
        .forEach((kv) => {
          try {
            metadata[kv.key] = JSON.parse(kv.value);
          } catch {
            metadata[kv.key] = kv.value;
          }
        });

      // Build tools array properly
      const tools: Tool[] = [];

      // Add code interpreter if enabled
      if (toolEnabled("code_interpreter")) {
        tools.push({ type: "code_interpreter" });
      }

      // Add file search if enabled
      if (toolEnabled("file_search")) {
        tools.push({
          type: "file_search",
          file_search: {
            ranking_options: {
              ranker: fileSearchRanker,
              score_threshold: fileSearchScoreThreshold,
            },
          },
        } as Tool);
      }

      // Add function tools from formState
      const functionTools = (formState.tools || []).filter(
        (t) => t.type === "function"
      );
      tools.push(...functionTools);

      const payload: Partial<Assistant> = {
        name: formState.name?.trim(),
        model: formState.model || assistant.model,
        instructions: formState.instructions || "",
        description: formState.description || "",
        temperature:
          typeof formState.temperature === "number"
            ? formState.temperature
            : undefined,
        top_p:
          typeof formState.top_p === "number" ? formState.top_p : undefined,
        response_format: formState.response_format || { type: "auto" },
        tools,
        tool_resources: {
          ...(toolEnabled("file_search") && vectorStoreIds.length > 0
            ? { file_search: { vector_store_ids: vectorStoreIds } }
            : {}),
        },
        metadata,
      };

      const updated = await updateAssistant(assistant.id, payload);
      message.success("Assistant updated successfully!");

      // Trigger the onAssistantUpdated callback to refresh parent component
      if (onAssistantUpdated) {
        onAssistantUpdated(updated);
      }

      setOriginalState(updated);
      setHasUnsavedChanges(false);
    } catch (error: any) {
      message.error(
        error?.response?.data?.error?.message || "Failed to update assistant"
      );
    } finally {
      setLoading(false);
    }
  };

  const addEmptyMetadataRow = () =>
    setMetadataList((prev) => [...prev, { key: "", value: "" }]);
  const removeMetadataRow = (idx: number) =>
    setMetadataList((prev) => prev.filter((_, i) => i !== idx));

  const isFileSearchEnabled = toolEnabled("file_search");

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
      <Spin spinning={loading || deleteLoading}>
        {/* Unsaved Changes Banner */}
        {hasUnsavedChanges && (
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <ExclamationCircleOutlined className="text-orange-600 text-base sm:text-lg flex-shrink-0" />
              <Text className="text-orange-800 font-medium text-sm sm:text-base">
                You have unsaved changes. Don't forget to update your assistant.
              </Text>
            </div>
            <Button
              type="primary"
              size="small"
              onClick={handleUpdate}
              loading={loading}
              className="bg-orange-600 border-orange-600 hover:bg-orange-700 w-full sm:w-auto"
            >
              Update Now
            </Button>
          </div>
        )}

        {/* Header with Name and Actions */}
        <Card className="shadow-2xl border-0 bg-gradient-to-r from-purple-500 to-indigo-500">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full">
              {editingName ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <Input
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onPressEnter={() => setEditingName(false)}
                    onBlur={() => setEditingName(false)}
                    className="text-lg sm:text-2xl font-bold bg-white border-2 border-white text-gray-800 placeholder-gray-500"
                    style={{
                      fontSize: window.innerWidth >= 640 ? "24px" : "18px",
                      fontWeight: "bold",
                      backgroundColor: "white",
                      color: "#1f2937",
                    }}
                    placeholder="Assistant Name"
                    autoFocus
                  />
                  <Button
                    icon={<SaveOutlined />}
                    onClick={() => setEditingName(false)}
                    className="bg-white text-purple-600 border-white hover:bg-gray-100 w-full sm:w-auto"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <Title
                    level={window.innerWidth >= 640 ? 1 : 2}
                    className="text-white m-0 break-words"
                    style={{ color: "white" }}
                  >
                    {formState.name || "Unnamed Assistant"}
                  </Title>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditingName(true)}
                    className="bg-white text-purple-600 border-white hover:bg-gray-100"
                    size="small"
                  />
                </div>
              )}
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleteLoading}
              size="large"
              className="w-full lg:w-auto"
              style={{
                backgroundColor: "#f87171",
                borderColor: "#f87171",
                color: "white",
              }}
            >
              Delete Assistant
            </Button>
          </div>
        </Card>

        {/* Assistant Information */}
        <Card
          title={
            <span className="text-purple-600 font-semibold text-sm sm:text-base">
              Assistant Information
            </span>
          }
          className="shadow-lg border border-purple-200"
          headStyle={{
            backgroundColor: "#faf5ff",
            borderBottom: "2px solid #a855f7",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <Text strong className="text-purple-600 text-sm">
                ID:
              </Text>
              <div className="flex items-center gap-2">
                <Text
                  code
                  className="bg-purple-100 px-2 py-1 rounded text-xs sm:text-sm break-all"
                  style={{ wordBreak: "break-all" }}
                >
                  {assistant.id}
                </Text>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => copyToClipboard(assistant.id)}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 flex-shrink-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Text strong className="text-purple-600 text-sm">
                Created:
              </Text>
              <div className="text-gray-700 text-sm">
                {new Date(assistant.created_at * 1000).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Text strong className="text-purple-600 text-sm">
                Model:
              </Text>
              <Select
                value={formState.model}
                onChange={(v) => handleChange("model", v)}
                options={models.map((m) => ({
                  label: m.id,
                  value: m.id,
                }))}
                className="w-full"
                size="large"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text strong className="text-purple-600 text-sm">
                  Temperature:
                </Text>
                <Text className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                  {formState.temperature ?? 1}
                </Text>
              </div>
              <Slider
                min={0}
                max={2}
                step={0.01}
                value={formState.temperature ?? 1}
                onChange={(v) => handleChange("temperature", v)}
                tooltip={{
                  formatter: (value) => {
                    if (value === undefined || value === null) return "1";
                    return `${value} (${
                      value === 0
                        ? "Deterministic"
                        : value < 0.3
                        ? "Focused"
                        : value < 0.7
                        ? "Balanced"
                        : value < 1.2
                        ? "Creative"
                        : "Very Creative"
                    })`;
                  },
                }}
                trackStyle={{ backgroundColor: "#a855f7" }}
                handleStyle={{ borderColor: "#a855f7" }}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Deterministic</span>
                <span>Creative</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text strong className="text-purple-600 text-sm">
                  Top P:
                </Text>
                <Text className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                  {formState.top_p ?? 1}
                </Text>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={formState.top_p ?? 1}
                onChange={(v) => handleChange("top_p", v)}
                tooltip={{
                  formatter: (value) => {
                    if (value === undefined || value === null) return "1";
                    return `${value} (${
                      value < 0.1
                        ? "Very Focused"
                        : value < 0.5
                        ? "Focused"
                        : value < 0.8
                        ? "Balanced"
                        : "Diverse"
                    })`;
                  },
                }}
                trackStyle={{ backgroundColor: "#a855f7" }}
                handleStyle={{ borderColor: "#a855f7" }}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Focused</span>
                <span>Diverse</span>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Text strong className="text-purple-600 text-sm">
                Response Format:
              </Text>
              <Select
                value={formState.response_format?.type || "text"}
                onChange={(v) => handleChange("response_format", { type: v })}
                options={RESPONSE_FORMAT_OPTIONS}
                className="w-full"
                size="large"
              />
            </div> */}
          </div>

          <div className="mt-6 space-y-2">
            <Text strong className="text-purple-600 text-sm">
              Description:
            </Text>
            <TextArea
              value={formState.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the assistant..."
              rows={2}
              className="w-full"
            />
          </div>
        </Card>

        <Card
          title={
            <span className="text-purple-600 font-semibold text-sm sm:text-base">
              Instructions
            </span>
          }
          className="shadow-lg border border-purple-200"
          headStyle={{
            backgroundColor: "#faf5ff",
            borderBottom: "2px solid #a855f7",
          }}
        >
          <TextArea
            value={formState.instructions || ""}
            onChange={(e) => handleChange("instructions", e.target.value)}
            rows={6}
            placeholder="Describe how the assistant should behave and respond to users..."
            className="resize-none"
            size="large"
          />
        </Card>

        {/* Tools & Capabilities */}
        <Card
          title={
            <span className="text-purple-600 font-semibold text-sm sm:text-base">
              Tools & Capabilities
            </span>
          }
          className="shadow-lg border border-purple-200"
          headStyle={{
            backgroundColor: "#faf5ff",
            borderBottom: "2px solid #a855f7",
          }}
        >
          <Space direction="vertical" className="w-full" size="large">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 gap-3">
                <div className="flex-1">
                  <Text strong className="text-purple-600 text-sm sm:text-base">
                    Code Interpreter
                  </Text>
                  <br />
                  <Text className="text-xs sm:text-sm text-gray-600">
                    Execute Python code and analyze data
                  </Text>
                </div>
                <Switch
                  checked={toolEnabled("code_interpreter")}
                  onChange={(v) => setToolEnabled("code_interpreter", v)}
                  className="bg-purple-200 self-start sm:self-center"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 gap-3">
                <div className="flex-1">
                  <Text strong className="text-purple-600 text-sm sm:text-base">
                    File Search
                  </Text>
                  <br />
                  <Text className="text-xs sm:text-sm text-gray-600">
                    Search through uploaded documents
                  </Text>
                </div>
                <Switch
                  checked={isFileSearchEnabled}
                  onChange={(v) => setToolEnabled("file_search", v)}
                  className="bg-purple-200 self-start sm:self-center"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 gap-3">
                <div className="flex-1">
                  <Text strong className="text-purple-600 text-sm sm:text-base">
                    Custom Functions
                  </Text>
                  <br />
                  <Text className="text-xs sm:text-sm text-gray-600">
                    Add custom function definitions
                  </Text>
                </div>
                <Switch
                  checked={customFunctionsEnabled}
                  onChange={handleCustomFunctionsToggle}
                  className="bg-purple-200 self-start sm:self-center"
                />
              </div>
            </div>

            {customFunctionsEnabled && (
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <Text
                      strong
                      className="text-purple-600 text-sm sm:text-base"
                    >
                      Custom Functions (
                      {
                        (formState.tools || []).filter(
                          (t) => t.type === "function"
                        ).length
                      }
                      )
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        type="primary"
                        onClick={() => {
                          setAddingNewFunction(true);
                          setSingleFunctionText("");
                          setCustomFunctionsModalVisible(true);
                        }}
                        className="bg-green-500 border-green-500 hover:bg-green-600 w-full sm:w-auto"
                        icon={<PlusOutlined />}
                        size="small"
                      >
                        Add Function
                      </Button>
                      <Button
                        onClick={() => {
                          const functions = (formState.tools || [])
                            .filter((t) => t.type === "function")
                            .map((tool: any) => tool.function);
                          setCustomFunctionsText(
                            JSON.stringify({ functions }, null, 2)
                          );
                          setAddingNewFunction(false);
                          setEditingFunctionIndex(-1);
                          setCustomFunctionsModalVisible(true);
                        }}
                        className="bg-purple-500 border-purple-500 text-white hover:bg-purple-600 w-full sm:w-auto"
                        size="small"
                      >
                        Edit All
                      </Button>
                    </div>
                  </div>

                  {formState.tools && (
                    <div className="space-y-2">
                      {(formState.tools || [])
                        .filter((t) => t.type === "function")
                        .map((tool: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 rounded-lg border border-purple-200 gap-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1">
                              <Tag
                                color="purple"
                                className="text-xs sm:text-sm font-medium"
                              >
                                {tool.function?.name || `Function ${index + 1}`}
                              </Tag>
                              <Text className="text-gray-600 text-xs sm:text-sm break-words">
                                {tool.function?.description || "No description"}
                              </Text>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditingFunctionIndex(index);
                                  setSingleFunctionText(
                                    JSON.stringify(tool.function, null, 2)
                                  );
                                  setAddingNewFunction(false);
                                  setCustomFunctionsModalVisible(true);
                                }}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50 flex-1 sm:flex-initial"
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => {
                                  const functionTools = (
                                    formState.tools || []
                                  ).filter((t) => t.type === "function");
                                  const nonFunctionTools = (
                                    formState.tools || []
                                  ).filter((t) => t.type !== "function");

                                  functionTools.splice(index, 1);

                                  setFormState((prev) => ({
                                    ...prev,
                                    tools: [
                                      ...nonFunctionTools,
                                      ...functionTools,
                                    ],
                                  }));

                                  message.success(
                                    "Function deleted successfully!"
                                  );
                                }}
                                className="flex-1 sm:flex-initial"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Space>
        </Card>

        {/* File Search Configuration - Only show when File Search is enabled */}
        {isFileSearchEnabled && (
          <Card
            title={
              <span className="text-purple-600 font-semibold text-sm sm:text-base">
                File Search Configuration
              </span>
            }
            className="shadow-lg border border-purple-200"
            headStyle={{
              backgroundColor: "#faf5ff",
              borderBottom: "2px solid #a855f7",
            }}
          >
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Text strong className="text-purple-600 text-sm">
                      Ranking Algorithm:
                    </Text>
                    <Select
                      value={fileSearchRanker}
                      onChange={setFileSearchRanker}
                      onBlur={updateFileSearchOptionsOnState}
                      options={RANKER_OPTIONS}
                      className="w-full"
                      size="large"
                    />
                  </div>

                  <div className="space-y-2">
                    <Text strong className="text-purple-600 text-sm">
                      Score Threshold:
                    </Text>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.01}
                      value={fileSearchScoreThreshold}
                      onChange={(v) => setFileSearchScoreThreshold(v ?? 0)}
                      onBlur={updateFileSearchOptionsOnState}
                      className="w-full"
                      size="large"
                    />
                  </div>
                </div>

                <Divider className="border-purple-300" />

                <div className="space-y-2">
                  <Text strong className="text-purple-600 text-sm">
                    Vector Store IDs:
                  </Text>
                  <Select
                    mode="tags"
                    value={vectorStoreIds}
                    onChange={setVectorStoreIds}
                    placeholder="Add vector store IDs..."
                    className="w-full"
                    size="large"
                    tokenSeparators={[",", " "]}
                  />
                  {vectorStoreIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {vectorStoreIds.map((id) => (
                        <Tag
                          key={id}
                          color="purple"
                          className="text-xs break-all"
                        >
                          {id}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* File Upload - Only show when File Search is enabled */}
        {isFileSearchEnabled && (
          <Card
            title={
              <span className="text-purple-600 font-semibold text-sm sm:text-base">
                File Management
              </span>
            }
            className="shadow-lg border border-purple-200"
            headStyle={{
              backgroundColor: "#faf5ff",
              borderBottom: "2px solid #a855f7",
            }}
          >
            <div className="space-y-4">
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                className="w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={fileLoading}
                  size="large"
                  className="w-full h-12 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600 font-semibold text-sm sm:text-base"
                >
                  {fileLoading ? "Uploading..." : "Upload File to Vector Store"}
                </Button>
              </Upload>
              <Text className="text-xs sm:text-sm text-gray-500 block text-center">
                Supported formats: PDF, TXT, CSV. Files will be processed and
                added to a vector store for search below 100MB.
              </Text>
            </div>
          </Card>
        )}

        {/* Metadata */}
        <Card
          title={
            <span className="text-purple-600 font-semibold text-sm sm:text-base">
              Metadata
            </span>
          }
          className="shadow-lg border border-purple-200"
          headStyle={{
            backgroundColor: "#faf5ff",
            borderBottom: "2px solid #a855f7",
          }}
        >
          <div className="space-y-4">
            {metadataList.map((kv, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <Input
                  placeholder="Key"
                  value={kv.key}
                  onChange={(e) =>
                    setMetadataList((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, key: e.target.value } : x
                      )
                    )
                  }
                  className="w-full sm:flex-1 sm:max-w-xs"
                  size="large"
                />
                <Input
                  placeholder="Value (string or JSON)"
                  value={kv.value}
                  onChange={(e) =>
                    setMetadataList((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, value: e.target.value } : x
                      )
                    )
                  }
                  className="w-full sm:flex-1"
                  size="large"
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => removeMetadataRow(idx)}
                  danger
                  size="large"
                  className="w-full sm:w-auto"
                />
              </div>
            ))}

            <Button
              icon={<PlusOutlined />}
              onClick={addEmptyMetadataRow}
              className="w-full bg-purple-500 text-white border-purple-500 hover:bg-purple-600 hover:border-purple-600"
              size="large"
            >
              Add Metadata Field
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
          <Button
            size="large"
            className="px-6 sm:px-8 w-full sm:w-auto order-2 sm:order-1"
            onClick={() => {
              if (hasUnsavedChanges) {
                confirm({
                  title: "Unsaved Changes",
                  content:
                    "You have unsaved changes. Are you sure you want to discard them?",
                  onOk: () => {
                    setFormState(originalState);
                    setHasUnsavedChanges(false);
                  },
                });
              }
            }}
          >
            {hasUnsavedChanges ? "Discard Changes" : "Cancel"}
          </Button>
          <Button
            type="primary"
            onClick={handleUpdate}
            loading={loading}
            size="large"
            icon={<SaveOutlined />}
            className="px-6 sm:px-8 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 border-0 hover:from-purple-600 hover:to-indigo-600 order-1 sm:order-2"
            disabled={!hasUnsavedChanges}
          >
            Update Assistant
          </Button>
        </div>
      </Spin>

      {/* Custom Functions Modal */}
      <Modal
        title={
          <span className="text-sm sm:text-base">
            {addingNewFunction
              ? "Add New Function"
              : editingFunctionIndex >= 0
              ? "Edit Function"
              : "Custom Functions Configuration"}
          </span>
        }
        open={customFunctionsModalVisible}
        onOk={() => {
          if (addingNewFunction || editingFunctionIndex >= 0) {
            handleSingleFunctionSave();
          } else {
            handleCustomFunctionsSave();
          }
        }}
        onCancel={() => {
          setCustomFunctionsModalVisible(false);
          setAddingNewFunction(false);
          setEditingFunctionIndex(-1);
          setSingleFunctionText("");
        }}
        width="90%"
        style={{ maxWidth: 800 }}
        okText={
          addingNewFunction
            ? "Add Function"
            : editingFunctionIndex >= 0
            ? "Update Function"
            : "Save All Functions"
        }
        cancelText="Cancel"
        className="custom-functions-modal"
      >
        <div className="space-y-4">
          <Text className="text-gray-600 text-xs sm:text-sm block">
            {addingNewFunction || editingFunctionIndex >= 0
              ? "Define a single function with its name, description, and parameters:"
              : "Define custom functions that the assistant can use. Follow the JSON structure below:"}
          </Text>

          <TextArea
            value={
              addingNewFunction || editingFunctionIndex >= 0
                ? singleFunctionText
                : customFunctionsText
            }
            onChange={(e) => {
              if (addingNewFunction || editingFunctionIndex >= 0) {
                setSingleFunctionText(e.target.value);
              } else {
                setCustomFunctionsText(e.target.value);
              }
            }}
            placeholder={
              addingNewFunction || editingFunctionIndex >= 0
                ? `{
  "name": "functionName",
  "description": "Description of what the function does",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Description of parameter"
      }
    },
    "required": ["param1"]
  }
}`
                : `{
  "functions": [
    {
      "name": "getCurrentDate",
      "description": "Returns the current date",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  ]
}`
            }
            rows={addingNewFunction || editingFunctionIndex >= 0 ? 15 : 20}
            className="font-mono text-xs sm:text-sm"
            style={{ fontSize: window.innerWidth >= 640 ? "14px" : "12px" }}
          />
        </div>
      </Modal>

      <style>{`
        @media (max-width: 640px) {
          .ant-card-head-title {
            font-size: 14px !important;
          }
          
          .ant-typography h1 {
            font-size: 20px !important;
          }
          
          .ant-typography h2 {
            font-size: 18px !important;
          }
          
          .custom-functions-modal .ant-modal {
            margin: 10px !important;
          }
          
          .custom-functions-modal .ant-modal-content {
            margin: 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .ant-card {
            margin: 0 !important;
          }
          
          .ant-card-body {
            padding: 12px !important;
          }
          
          .ant-card-head {
            padding: 0 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AssistantDetails;
