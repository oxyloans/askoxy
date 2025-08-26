import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAssistant,
  uploadFile,
  createVectorStore,
  addFileToVectorStore,
  Assistant,
  Tool,
  ToolResources,
  getModels,
  Model,
} from "./assistantApi";
import {
  Button,
  Input,
  Form,
  Slider,
  message,
  Upload,
  Checkbox,
  InputNumber,
  Select,
  Space,
  Divider,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  RobotOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;
export const RESPONSE_FORMATS = ["auto", "json_object"];

interface KV {
  key: string;
  value: string;
}

const CreateAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [enableCodeInterpreter, setEnableCodeInterpreter] = useState(false);
  const [enableFileSearch, setEnableFileSearch] = useState(false);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [fileSearchRanker, setFileSearchRanker] =
    useState("default_2024_08_21");
  const [fileSearchScore, setFileSearchScore] = useState(0);
  const [metadataList, setMetadataList] = useState<KV[]>([]);
  const [fileLoading, setFileLoading] = useState(false);

  const [form] = Form.useForm();

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await getModels();
        if (Array.isArray(res) && res.length) setModels(res);
      } catch (err) {
        console.error("Failed to fetch models:", err);
        message.error("Failed to load models, using default.");
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
      }
    };
    fetchModels();
  }, []);

  const handleFileUpload = async (file: File) => {
    setFileLoading(true);
    try {
      const res = await uploadFile(file);
      const id = res?.id || res?.file?.id;
      if (id) {
        setUploadedFileIds((prev) => [...prev, id]);
        message.success(`File "${file.name}" uploaded`);
      } else {
        message.warning("Uploaded, but no file ID returned");
      }
    } catch {
      message.error(`Failed to upload: ${file.name}`);
    } finally {
      setFileLoading(false);
    }
    return false; // prevent auto-upload
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const tools: Tool[] = [];
      const tool_resources: ToolResources = {};

      if (enableCodeInterpreter) tools.push({ type: "code_interpreter" });

      if (enableFileSearch && uploadedFileIds.length > 0) {
        const vsRes = await createVectorStore({ name: values.name + "_store" });
        const vectorStoreId = vsRes?.id;
        if (!vectorStoreId) throw new Error("Failed to create vector store");

        for (const fileId of uploadedFileIds) {
          await addFileToVectorStore(vectorStoreId, fileId);
        }

        tools.push({
          type: "file_search",
          file_search: {
            ranking_options: {
              ranker: fileSearchRanker,
              score_threshold: fileSearchScore,
            },
          },
        });
        tool_resources.file_search = { vector_store_ids: [vectorStoreId] };
      }

      const metadata: Record<string, any> = {};
      metadataList.forEach((kv) => {
        if (kv.key) metadata[kv.key] = kv.value;
      });

      const payload: Partial<Assistant> = {
        name: values.name.trim(),
        description: values.description?.trim(),
        model: values.model,
        instructions: values.instructions?.trim(),
        temperature: values.temperature,
        top_p: values.top_p,
        // reasoning_effort: values.reasoning_effort,
        response_format: values.response_format,
        tools,
        tool_resources: Object.keys(tool_resources).length
          ? tool_resources
          : undefined,
        metadata: Object.keys(metadata).length ? metadata : undefined,
      };

      const created = await createAssistant(payload);

      message.success(`Assistant "${created.name}" created!`);
      navigate(`/admn/conversation/${created.id}`);
    } catch (e) {
      console.error(e);
      message.error("Failed to create assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-3">
            <RobotOutlined className="text-white text-lg" />
          </div>
          <Title level={2} className="mb-1 text-purple-700">
            Create Assistant
          </Title>
        </div>

        <Card className="shadow-lg border-0" style={{ borderRadius: "12px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              model: "gpt-4o",
              top_p: 1,
              temperature: 1,
              reasoning_effort: "low",
              response_format: RESPONSE_FORMATS[0],
            }}
          >
            {/* Basic Information */}
            <Row gutter={[20, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Assistant name"
                    size="large"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Model"
                  name="model"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { label: "gpt-4o", value: "gpt-4o" },
                      ...models
                        .filter((m) => m.id !== "gpt-4o")
                        .map((m) => ({
                          label: m.id,
                          value: m.id,
                        })),
                    ]}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[20, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Description" name="description">
                  <TextArea
                    rows={3}
                    placeholder="Brief description (optional)"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Response Format" name="response_format">
                  <Select
                    options={RESPONSE_FORMATS.map((r) => ({
                      label: r,
                      value: r,
                    }))}
                    size="large"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Instructions" name="instructions">
              <TextArea
                rows={4}
                placeholder="Detailed instructions for assistant behavior"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Divider className="my-6" />

            {/* Model Parameters */}
            <Title level={4} className="text-purple-700 mb-4">
              Model Parameters
            </Title>
            <Row gutter={[20, 16]}>
              <Col xs={24} md={8}>
                <Form.Item label="Temperature" name="temperature">
                  <div className="px-4 py-3 bg-purple-50 rounded-lg">
                    <Slider min={0} max={2} step={0.01} />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Top P" name="top_p">
                  <div className="px-4 py-3 bg-purple-50 rounded-lg">
                    <Slider min={0} max={1} step={0.01} />
                  </div>
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={8}>
                <Form.Item
                  label="Reasoning Effort"
                  name="reasoning_effort"
                  rules={[
                    {
                      required: true,
                      message: "Please select reasoning effort",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select reasoning effort"
                    size="large"
                    style={{ width: "100%", borderRadius: "8px" }}
                  >
                    <Select.Option value="low">Low</Select.Option>
                    <Select.Option value="medium">Medium</Select.Option>
                    <Select.Option value="high">High</Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>

            <Divider className="my-6" />

            {/* Tools */}
            <Title level={4} className="text-purple-700 mb-4">
              Tools & Capabilities
            </Title>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg mb-6">
              <Row gutter={[20, 16]}>
                <Col xs={24} sm={12}>
                  <Checkbox
                    checked={enableCodeInterpreter}
                    onChange={(e) => setEnableCodeInterpreter(e.target.checked)}
                    className="text-base"
                  >
                    <span className="font-medium text-purple-700">
                      Code Interpreter
                    </span>
                  </Checkbox>
                </Col>
                <Col xs={24} sm={12}>
                  <Checkbox
                    checked={enableFileSearch}
                    onChange={(e) => setEnableFileSearch(e.target.checked)}
                    className="text-base"
                  >
                    <span className="font-medium text-purple-700">
                      File Search
                    </span>
                  </Checkbox>
                </Col>
              </Row>
            </div>

            {enableFileSearch && (
              <Card
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 mb-6"
                style={{ borderRadius: "12px" }}
              >
                <Form.Item label="Upload Files">
                  <Upload
                    beforeUpload={handleFileUpload}
                    multiple
                    showUploadList
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={fileLoading}
                      size="large"
                      className="w-full bg-white border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700"
                      style={{ borderRadius: "8px", height: "50px" }}
                    >
                      Click to Upload Files
                    </Button>
                  </Upload>
                </Form.Item>
              </Card>
            )}

            {/* Metadata */}
            {metadataList.length > 0 || (
              <div className="mb-6">
                <Row gutter={[20, 0]} align="middle">
                  <Col flex="auto">
                    <Title level={4} className="text-purple-700 mb-0">
                      Metadata
                    </Title>
                  </Col>
                  <Col>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() =>
                        setMetadataList((ms) => [...ms, { key: "", value: "" }])
                      }
                      type="dashed"
                      size="large"
                      className="border-purple-300 text-purple-600 hover:border-purple-400"
                      style={{ borderRadius: "8px" }}
                    >
                      Add Metadata
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {metadataList.length > 0 && (
              <Card
                className="bg-purple-50 mb-6"
                style={{ borderRadius: "12px" }}
              >
                <div className="mb-4 flex justify-between items-center">
                  <Title level={4} className="text-purple-700 mb-0">
                    Metadata
                  </Title>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      setMetadataList((ms) => [...ms, { key: "", value: "" }])
                    }
                    type="dashed"
                    size="large"
                    className="border-purple-300 text-purple-600 hover:border-purple-400"
                    style={{ borderRadius: "8px" }}
                  >
                    Add
                  </Button>
                </div>

                {metadataList.map((kv, i) => (
                  <div key={i} className="mb-3 p-4 bg-white rounded-lg">
                    <Row gutter={[16, 0]} align="middle">
                      <Col xs={24} sm={10}>
                        <Input
                          placeholder="Key"
                          value={kv.key}
                          onChange={(e) => {
                            const v = e.target.value;
                            setMetadataList((ms) =>
                              ms.map((x, idx) =>
                                idx === i ? { ...x, key: v } : x
                              )
                            );
                          }}
                          size="large"
                          style={{ borderRadius: "8px" }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <Input
                          placeholder="Value"
                          value={kv.value}
                          onChange={(e) => {
                            const v = e.target.value;
                            setMetadataList((ms) =>
                              ms.map((x, idx) =>
                                idx === i ? { ...x, value: v } : x
                              )
                            );
                          }}
                          size="large"
                          style={{ borderRadius: "8px" }}
                        />
                      </Col>
                      <Col xs={24} sm={2}>
                        <Button
                          icon={<CloseOutlined />}
                          onClick={() =>
                            setMetadataList((ms) =>
                              ms.filter((_, idx) => idx !== i)
                            )
                          }
                          danger
                          shape="circle"
                          size="large"
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card>
            )}

            {/* Submit Button */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 border-0 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                style={{
                  borderRadius: "8px",
                  height: "50px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Create Assistant
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssistant;
