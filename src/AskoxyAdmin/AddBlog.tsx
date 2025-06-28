import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import { message, Upload, Button, Modal } from "antd";
import {
  UploadOutlined,
  CopyOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

interface MediaItem {
  url: string;
  status: boolean;
  type: "image" | "video";
  fileName?: string;
}

interface CampaignForm {
  campaignType: string;
  campaignDescription: string;
  socialMediaCaption: string;
  mediaUrls: MediaItem[];
  campaignTypeAddBy: string;
  campainInputType: string;
}

interface CampaignResponse {
  imageUrls: string[] | null;
  campaignType: string | null;
  message: string;
  campaignTypeAddBy: string | null;
  campaignDescription: string | null;
  campaignStatus: string | null;
  campaignId: string;
  campainInputType: string | null;
  facebookCampaignUrl: string;
  instagramCampaignUrl: string;
}

const AddBlog: React.FC = () => {
  const [formData, setFormData] = useState<CampaignForm>({
    campaignType: "",
    campaignDescription: "",
    socialMediaCaption: "",
    mediaUrls: [],
    campaignTypeAddBy: "",
    campainInputType: "SERVICE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mediaErrorMessage, setMediaErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [descErrormessage, setDescErrorMessage] = useState<string>("");
  const [socialMediaCaptionErrorMessage, setSocialMediaCaptionErrorMessage] =
    useState<string>("");
  const [typeErrorMessage, setTypeErrorMessage] = useState<string>("");

  const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: "",
    instagram: "",
  });
  const primaryType = localStorage.getItem("primaryType");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation for social media caption
    if (name === "socialMediaCaption") {
      if (value.length < 25) {
        setSocialMediaCaptionErrorMessage(
          "Social Media Caption must be between 25 and 30 characters"
        );
      } else {
        setSocialMediaCaptionErrorMessage("");
      }
    }
  };

  const isVideoFile = (file: File): boolean => {
    const videoTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
    ];
    return videoTypes.includes(file.type);
  };

  const isImageFile = (file: File): boolean => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png"];
    return imageTypes.includes(file.type);
  };

  const handleMediaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const accessToken = localStorage.getItem("accessToken");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const isAlreadyUploaded = formData.mediaUrls.some(
        (item) => item.fileName === file.name
      );

      if (isAlreadyUploaded) {
        setMediaErrorMessage(`${file.name} already added`);
        continue;
      }

      if (!isImageFile(file) && !isVideoFile(file)) {
        setMediaErrorMessage(`${file.name} is not a supported file type`);
        continue;
      }

      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await axios.post(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.uploadStatus === "UPLOADED") {
          const mediaType = isVideoFile(file) ? "video" : "image";
          setFormData((prev) => ({
            ...prev,
            mediaUrls: [
              ...prev.mediaUrls,
              {
                url: response.data.documentPath,
                status: true,
                type: mediaType,
                fileName: file.name,
              },
            ],
          }));

          setMediaErrorMessage("");
        } else {
          setMediaErrorMessage(
            `Failed to upload ${file.name}. Please try again.`
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setMediaErrorMessage(
          `Failed to upload ${file.name}. Please try again.`
        );
      } finally {
        setIsUploading(false);
      }
    }
    event.target.value = "";
  };

  const handleDeleteMedia = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    message.success("Link copied to clipboard!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setNameErrorMessage("");
    setDescErrorMessage("");
    setSocialMediaCaptionErrorMessage("");
    setTypeErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to add the Blog",
      content: "Please confirm that all details are correct before submitting.",
      onOk: () => {
        setIsSubmitting(true);
        submitCampaign();
      },
      onCancel: () => {
        setIsSubmitting(false);
      },
    });
  };

  const submitCampaign = async () => {
    const images = formData.mediaUrls.map((item) => ({
      imageUrl: item.url,
      status: item.status,
    }));

    const disclaimerText = `### ✅ **Blog Disclaimer**
    *This blog is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [team@askoxy.ai](mailto:team@askoxy.ai)*`;

    const finalCampaignDescription =
      (formData.campaignDescription || "") + disclaimerText;

    const requestPayload = {
      askOxyCampaignDto: [
        {
          campaignDescription: finalCampaignDescription,
          campaignType: formData.campaignType,
          socialMediaCaption: formData.socialMediaCaption,
          campaignTypeAddBy: formData.campaignTypeAddBy,
          images: images,
          campainInputType: "BLOG",
        },
      ],
    };

    try {
      const response = await axios.patch<CampaignResponse>(
        BASE_URL + "/marketing-service/campgin/addCampaignTypes",
        requestPayload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        message.success("Blog Added Successfully...!");
        setSocialMediaLinks({
          facebook: response.data.facebookCampaignUrl,
          instagram: response.data.instagramCampaignUrl,
        });
        setIsLinksModalVisible(true);
        setFormData({
          campaignType: "",
          campaignDescription: "",
          socialMediaCaption: "",
          mediaUrls: [],
          campaignTypeAddBy: "",
          campainInputType: "SERVICE",
        });
      } else {
        setErrorMessage("Failed to add blog. Please try again.");
        message.error("Failed to add blog. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to add blog. Please try again.");
      message.error("Failed to add blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (formData.campaignType.trim() === "") {
      setNameErrorMessage("Campaign Name is required");
      isValid = false;
    }

    if (formData.campaignDescription.trim() === "") {
      setDescErrorMessage("Campaign description is required");
      isValid = false;
    }

    if (formData.socialMediaCaption.trim() === "") {
      setSocialMediaCaptionErrorMessage("Social Media Caption is required");
      isValid = false;
    } else if (formData.socialMediaCaption.length < 25) {
      setSocialMediaCaptionErrorMessage(
        "Social Media Caption must be between 25 and 30 characters"
      );
      isValid = false;
    }

    return isValid;
  };

  const images = formData.mediaUrls.filter((item) => item.type === "image");
  const videos = formData.mediaUrls.filter((item) => item.type === "video");

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-1 justify-center py-6">
        <div className="w-full max-w-2xl bg-gray-50 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add New Blog
          </h1>
          <form>
            <div className="mb-4">
              <label
                htmlFor="campaignType"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Name
              </label>
              <input
                type="text"
                id="campaignType"
                name="campaignType"
                value={formData.campaignType}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {nameErrorMessage && (
                <div className="text-red-500 text-sm mb-4">
                  {nameErrorMessage}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="campaignDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Description
              </label>
              <textarea
                id="campaignDescription"
                name="campaignDescription"
                value={formData.campaignDescription}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
              {descErrormessage && (
                <div className="text-red-500 text-sm mb-4">
                  {descErrormessage}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="socialMediaCaption"
                className="block text-sm font-medium text-gray-700"
              >
                Social Media Caption
              </label>
              <textarea
                id="socialMediaCaption"
                name="socialMediaCaption"
                value={formData.socialMediaCaption}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter social media caption for this blog post (25-30 characters)..."
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
              {socialMediaCaptionErrorMessage && (
                <div className="text-red-500 text-sm mb-4">
                  {socialMediaCaptionErrorMessage}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Images & Videos
              </label>
              <div className="flex flex-col gap-2 mt-2">
                <label className="relative">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition-colors w-fit">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span>Choose Files</span>
                  </div>
                  <input
                    type="file"
                    onChange={handleMediaChange}
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4,.avi,.mov,.wmv,.flv,.webm"
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600">
                  Upload images (JPG, PNG) and videos (MP4, AVI, MOV, WMV, FLV,
                  WEBM). Each file should be below{" "}
                  <span className="font-bold">1MB</span>.
                </p>
                {isUploading && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 mr-2 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
                    Uploading files...
                  </div>
                )}
                {mediaErrorMessage && (
                  <p className="text-sm text-red-600">{mediaErrorMessage}</p>
                )}
              </div>

              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Images ({images.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={`image-${index}`} className="relative group">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200">
                          <div className="aspect-[4/3]">
                            <img
                              src={image.url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <button
                            onClick={() =>
                              handleDeleteMedia(
                                formData.mediaUrls.findIndex(
                                  (item) => item === image
                                )
                              )
                            }
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            Image {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Videos ({videos.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((video, index) => (
                      <div key={`video-${index}`} className="relative group">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                          <div className="aspect-video bg-black">
                            <video
                              src={video.url}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <button
                            onClick={() =>
                              handleDeleteMedia(
                                formData.mediaUrls.findIndex(
                                  (item) => item === video
                                )
                              )
                            }
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                            Video {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="campaignTypeAddBy"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Added By
              </label>
              {primaryType === "HELPDESKSUPERADMIN" ? (
                <select
                  id="campaignTypeAddBy"
                  name="campaignTypeAddBy"
                  value={formData.campaignTypeAddBy}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="RADHA">RADHA</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="campaignTypeAddBy"
                  name="campaignTypeAddBy"
                  value={formData.campaignTypeAddBy}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              )}
            </div>

            {typeErrorMessage && (
              <div className="text-red-500 text-sm mb-4">
                {typeErrorMessage}
              </div>
            )}

            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}

            <button
              type="submit"
              className={`w-full p-2 text-white rounded ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Blog"}
            </button>
          </form>
        </div>
      </div>
      <Modal
        title="Social Media Links"
        open={isLinksModalVisible}
        onCancel={() => setIsLinksModalVisible(false)}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FacebookOutlined className="text-blue-600 text-xl" />
            <a
              href={socialMediaLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              {socialMediaLinks.facebook}
            </a>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(socialMediaLinks.facebook)}
            >
              Copy
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <InstagramOutlined className="text-pink-600 text-xl" />
            <a
              href={socialMediaLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              {socialMediaLinks.instagram}
            </a>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(socialMediaLinks.instagram)}
            >
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBlog;
