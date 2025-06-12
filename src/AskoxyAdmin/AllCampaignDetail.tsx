import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import {
  message,
  Modal,
  Button,
  Input,
  Upload,
  Table,
  Tag,
  Spin,
  Tabs,
} from "antd";

import BASE_URL from "../Config";

const { TabPane } = Tabs;

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface Campaign {
  imageUrls: Image[];
  campaignType: string;
  campaignDescription: string;
  campaignTypeAddBy: string;
  campaignStatus: string;
  campaignId: string;
  campainInputType: string;
}

const AllCampaignsDetails: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [fileList, setFileList] = useState<Image[]>([]);
  const [imageErrorMessage, setImageErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Campaign>({
    campaignType: "",
    campaignDescription: "",
    imageUrls: [],
    campaignTypeAddBy: "",
    campaignStatus: "",
    campaignId: "",
    campainInputType: "",
  });

  const baseUrl = window.location.href.includes("sandbox")
    ? "https://www.sandbox.askoxy.ai"
    : "https://www.askoxy.ai";

  const authUrl = `${baseUrl}/main/services/`;
  const noAuthUrl = `${baseUrl}/services/`;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    console.log(fileList);
  }, [formData, fileList]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        BASE_URL + "/marketing-service/campgin/getAllCampaignDetails",
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const filteredCampaigns = response.data.filter(
        (campaign: Campaign) => campaign.campaignStatus !== null
      );
      setCampaigns(filteredCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to load campaign details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = (campaign: Campaign) => {
    Modal.confirm({
      title: "Confirm",
      content: `Are you sure you want to update to ${
        !campaign.campaignStatus ? "Active" : "Inactive"
      } ?`,
      okText: "Yes",
      onOk: async () => {
        try {
          const response = await axios.patch(
            BASE_URL +
              "/marketing-service/campgin/activate-deactivate-campaign",
            {
              askOxyCampaignDto: [
                {
                  campaignType: campaign.campaignType,
                  campaignStatus: !campaign.campaignStatus,
                },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            message.success("Campaign status updated successfully.");
          } else {
            message.error("Failed to update campaign status.");
          }
        } catch (error) {
          message.error("Error while updating campaign status.");
          console.error(error);
        }
        fetchCampaigns();
      },
    });
  };

  const handleUpdate = (campaign: Campaign) => {
    setImageErrorMessage("");
    setCurrentCampaign(campaign);
    setFormData({
      campaignType: campaign.campaignType,
      campaignDescription: campaign.campaignDescription,
      imageUrls: campaign.imageUrls,
      campaignTypeAddBy: campaign.campaignTypeAddBy,
      campaignStatus: campaign.campaignStatus,
      campaignId: campaign.campaignId,
      campainInputType: campaign.campainInputType,
    });
    setIsUpdateModalVisible(true);
  };

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const accessToken = localStorage.getItem("accessToken");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

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
          setFileList((prev) => [
            ...prev,
            {
              imageUrl: response.data.documentPath,
              status: true,
              imageId: response.data.id,
            },
          ]);

          setImageErrorMessage("");
        } else {
          setImageErrorMessage("Failed to upload the file. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setImageErrorMessage("Failed to upload the file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
    event.target.value = "";
  };

  const handleDeleteImage = (imageIdToDelete: string) => {
    setFileList((prev) =>
      prev.filter((image) => image.imageId !== imageIdToDelete)
    );
  };

  const handleDeleteImagestatus = (imageIdToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((image) =>
        image.imageId === imageIdToDelete ? { ...image, status: false } : image
      ),
    }));
  };

  const handleCopy = (url: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => message.success("URL copied to clipboard!"))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (url: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    message.success("URL copied to clipboard!");
  };

  const handleUpdateSubmit = async () => {
    setIsSubmitting(true);
    setImageErrorMessage("");
    setFileList([]);
    const requestPayload = {
      askOxyCampaignDto: [
        {
          campaignDescription: formData.campaignDescription,
          campaignId: formData.campaignId,
          campaignType: formData.campaignType,
          campaignTypeAddBy: formData.campaignTypeAddBy,
          campainInputType: formData.campainInputType,
          images: [
            ...formData.imageUrls,
            ...fileList.map((file) => ({
              imageUrl: file.imageUrl,
              status: file.status,
            })),
          ],
        },
      ],
    };

    try {
      const response = await axios.patch(
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
        message.success("Campaign updated successfully!");
        setIsSubmitting(false);
        setFormData({
          campaignType: "",
          campaignDescription: "",
          imageUrls: [],
          campaignTypeAddBy: "",
          campaignStatus: "",
          campaignId: "",
          campainInputType: "",
        });
        setIsUpdateModalVisible(false);
      } else {
        setImageErrorMessage("Failed to update campaign. Please try again.");
      }
    } catch (error) {
      setImageErrorMessage("Failed to update campaign. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
    fetchCampaigns();
  };

  const handleModalCancel = () => {
    setIsUpdateModalVisible(false);
    setFileList([]);
  };

  // Helper function to check if URL is a video
  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = [
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mkv",
    ];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Media renderer for images and videos
  const renderMedia = (imageUrls: Image[]) => {
    if (!imageUrls || imageUrls.length === 0) {
      return <div className="text-gray-500 text-sm">No media found</div>;
    }

    if (imageUrls.length === 1) {
      const media = imageUrls[0];
      return isVideoUrl(media.imageUrl) ? (
        <video
          src={media.imageUrl}
          controls
          className="w-20 h-20 object-cover rounded"
        />
      ) : (
        <img
          src={media.imageUrl}
          alt="Media"
          className="w-20 h-20 object-cover rounded"
        />
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {imageUrls.slice(0, 3).map((item, index) => (
          <div key={index} className="relative">
            {isVideoUrl(item.imageUrl) ? (
              <video
                src={item.imageUrl}
                className="w-16 h-16 object-cover rounded"
                muted
              />
            ) : (
              <img
                src={item.imageUrl}
                alt={`Media ${index + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            {index === 2 && imageUrls.length > 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  +{imageUrls.length - 3}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const getColumns = (type: string) => [
    {
      title: <div className="text-center">Media</div>,
      dataIndex: "imageUrls",
      key: "imageUrls",
      render: renderMedia,
    },
    {
      title: <div className="text-center">{type} Type</div>,
      dataIndex: "campaignType",
      key: "campaignType",
      render: (text: string) => (
        <div className="max-w-xs break-words">{text}</div>
      ),
    },
    {
      title: <div className="text-center">Description</div>,
      dataIndex: "campaignDescription",
      key: "campaignDescription",
      width: 250,
      render: (text: any) => (
        <div className="w-[200px] h-[120px] overflow-y-auto overflow-x-hidden scrollbar-hide">
          {text}
        </div>
      ),
    },
    {
      title: (
        <div className="text-center">Service Url (Without Authorization)</div>
      ),
      key: "noAuthCampaignUrl",
      render: (_: any, record: Campaign) => {
        const isBlog = record.campainInputType === "BLOG";
        const slugifiedCampaignType = slugify(record.campaignType);
        const campaignUrl = isBlog
          ? `${baseUrl}/blog/${record.campaignId.slice(
              -4
            )}/${slugifiedCampaignType}`
          : `${noAuthUrl}${record.campaignId.slice(
              -4
            )}/${slugifiedCampaignType}`;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <span>without Authorization url :</span>
            <a
              href={campaignUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {campaignUrl}
            </a>
            <button
              onClick={() => handleCopy(campaignUrl)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-center">Service Url (With Authorization)</div>
      ),
      key: "authCampaignUrl",
      render: (_: any, record: Campaign) => {
        const isBlog = record.campainInputType === "BLOG";
        const slugifiedCampaignType = slugify(record.campaignType);
         const campaignUrl = isBlog
          ? `${baseUrl}/main/blog/${record.campaignId.slice(
              -4
            )}/${slugifiedCampaignType}`
          : `${authUrl}${record.campaignId.slice(
              -4
            )}/${slugifiedCampaignType}`;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <span>Authorization url :</span>
            <a
              href={campaignUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {campaignUrl}
            </a>
            <button
              onClick={() => handleCopy(campaignUrl)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        );
      },
    },
    {
      title: <div className="text-center">Actions</div>,
      key: "actions",
      render: (_: any, campaign: Campaign) => (
        <div className="flex flex-col items-center gap-2">
          <Button
            className={
              campaign.campaignStatus
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }
            onClick={() => handleStatus(campaign)}
          >
            {campaign.campaignStatus ? "Active" : "Inactive"}
          </Button>
          <Button type="primary" onClick={() => handleUpdate(campaign)}>
            Update
          </Button>
        </div>
      ),
    },
  ];

  // Filter campaigns by type
  const serviceCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "SERVICE"
  );
  const productCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "PRODUCT"
  );
  const blogCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "BLOG"
  );

  const renderTable = (data: Campaign[], type: string) => (
    <div className="overflow-x-auto">
      <Table
        columns={getColumns(type)}
        dataSource={data}
        rowKey={(record) => record.campaignId}
        pagination={{ pageSize: 50 }}
        className="border border-gray-300 table-auto"
        scroll={{ x: window.innerWidth < 768 ? 1200 : undefined }}
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-3 pt-0 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-full">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
          All Campaign Details
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spin tip="Loading Campaigns..." size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="service" type="card">
            <TabPane
              tab={`Services (${serviceCampaigns.length})`}
              key="service"
            >
              {renderTable(serviceCampaigns, "Service")}
            </TabPane>
            <TabPane
              tab={`Products (${productCampaigns.length})`}
              key="product"
            >
              {renderTable(productCampaigns, "Product")}
            </TabPane>
            <TabPane tab={`Blogs (${blogCampaigns.length})`} key="blog">
              {renderTable(blogCampaigns, "Blog")}
            </TabPane>
          </Tabs>
        )}
      </div>

      <Modal
        title={`Update ${currentCampaign?.campainInputType || "Campaign"}`}
        visible={isUpdateModalVisible}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
            {isSubmitting ? "Submitting..." : `Update`}
          </Button>,
        ]}
      >
        {currentCampaign && (
          <div>
            <h1 className="mb-4 bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded">
              {formData.campaignType}
            </h1>

            <Input.TextArea
              rows={4}
              value={formData.campaignDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  campaignDescription: e.target.value,
                })
              }
              placeholder={`Update ${currentCampaign.campainInputType.toLowerCase()} description`}
              className="mb-4"
            />

            {/* File Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors w-fit">
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
                  <span>Choose Images/Videos</span>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleUploadChange(e)}
                  multiple
                  accept=".jpg,.jpeg,.png,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv"
                  className="hidden"
                />
              </label>

              {/* Uploading Indicator */}
              {isUploading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-4 h-4 mr-2 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  Uploading...
                </div>
              )}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {/* Display Existing Media */}
              {formData.imageUrls.map(
                (media, index) =>
                  media.status && (
                    <div key={index} className="relative group">
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                        <div className="aspect-[4/3]">
                          {isVideoUrl(media.imageUrl) ? (
                            <video
                              src={media.imageUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={media.imageUrl}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          onClick={() => handleDeleteImagestatus(media.imageId)}
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
                          Media {index + 1} of {formData.imageUrls.length}
                        </div>
                      </div>
                    </div>
                  )
              )}

              {/* Display Newly Uploaded Media */}
              {fileList.map((media, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                    <div className="aspect-[4/3]">
                      {isVideoUrl(media.imageUrl) ? (
                        <video
                          src={media.imageUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={media.imageUrl}
                          alt={`Uploaded Media ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={() => handleDeleteImage(media.imageId)}
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
                      Media {index + 1} of {fileList.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message for Media */}
            {imageErrorMessage && (
              <p className="text-red-500 mt-2">{imageErrorMessage}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCampaignsDetails;
