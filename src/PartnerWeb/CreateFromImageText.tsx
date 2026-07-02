import React, { useState } from "react";
import { Button, Input, Card, message, Spin, Select, Upload } from "antd";
import { UploadOutlined, SendOutlined, DownloadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { partnerApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { TextArea } = Input;
const { Option } = Select;

interface ApiResponse {
  [key: string]: any;
}

const CreateFromImageText: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [language, setLanguage] = useState<string>("english");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleSubmit = async () => {
    if (!imageFile) {
      message.warning("Please select an image");
      return;
    }
    if (!text.trim()) {
      message.warning("Please enter text");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile, imageFile.name);
      formData.append("language", language);
      formData.append("text", text);

      const res = await partnerApi.post(
        `${BASE_URL}/cart-service/agent/create-from-image-text`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResponse(res.data);
      message.success("Created successfully!");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSideBySide = !!(loading || response);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Title */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create From Image & Text
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload an image, choose a language and enter text to generate a video.
        </p>
      </div>

      <div className={`max-w-6xl mx-auto flex flex-col ${showSideBySide ? "lg:flex-row lg:items-stretch" : ""} gap-6`}>
        {/* Form */}
        <div className={`w-full ${showSideBySide ? "lg:w-1/2" : "max-w-2xl"}`}>
          <Card className="shadow-md h-full">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <Upload
                  accept="image/*"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    setImageFile(file);
                    setFileList([{ uid: "-1", name: file.name, status: "done", originFileObj: file }]);
                    return false;
                  }}
                  onRemove={() => {
                    setImageFile(null);
                    setFileList([]);
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} size="large">Select Image</Button>
                </Upload>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <Select
                  value={language}
                  onChange={setLanguage}
                  className="w-full"
                  size="large"
                >
                  <Option value="english">English</Option>
                  <Option value="hindi">Hindi</Option>
                  <Option value="telugu">Telugu</Option>
                  <Option value="tamil">Tamil</Option>
                  <Option value="kannada">Kannada</Option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Text <span className="text-red-500">*</span>
                </label>
                <TextArea
                  rows={5}
                  placeholder="Enter the text you want to include in the video..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  size="large"
                />
              </div>

              <Button
                type="primary"
                icon={<SendOutlined />}
                size="large"
                className="w-full"
                onClick={handleSubmit}
                loading={loading}
              >
                Generate Video
              </Button>
            </div>
          </Card>
        </div>

        {/* Video Panel */}
        {showSideBySide && (
          <div className="w-full lg:w-1/2">
            <Card className="shadow-md h-full flex flex-col justify-center">
              {loading && (
                <div className="flex flex-col justify-center items-center h-64 gap-3">
                  <Spin size="large" />
                  <p className="text-gray-500 text-sm">Generating your video, please wait...</p>
                </div>
              )}

              {!loading && response && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Generated Video</h2>
                    <div className="flex flex-wrap gap-2">
                      {response.format && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                          {response.format}
                        </span>
                      )}
                      {response.aspectRatio && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {response.aspectRatio}
                        </span>
                      )}
                      {response.width && response.height && (
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {response.width} × {response.height}
                        </span>
                      )}
                    </div>
                  </div>

                  {response.videoUrl ? (
                    <>
                      <div className={`w-full ${response.format === "vertical" ? "max-w-[240px]" : "max-w-full"} mx-auto`}>
                        <video
                          src={response.videoUrl}
                          controls
                          playsInline
                          autoPlay
                          className="w-full rounded-xl shadow-md"
                          style={{
                            aspectRatio: response.format === "vertical" ? "9/16" : "16/9",
                            background: "#000",
                          }}
                        />
                      </div>
                      <a
                        href={response.videoUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button icon={<DownloadOutlined />} size="large" type="primary" className="w-full">
                          Download Video
                        </Button>
                      </a>
                    </>
                  ) : (
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap break-words w-full">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFromImageText;
