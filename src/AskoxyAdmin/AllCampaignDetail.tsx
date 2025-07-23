import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
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
  socialMediaCaption: string;
  campaignPostsUrls: PostUrl[];
}
interface PostUrl {
  id: string;
  campaignId: string;
  platform: string;
  postUrl: string;
  platformPostId: string;
}

const AllCampaignsDetails: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [fileList, setFileList] = useState<Image[]>([]);
  const [imageErrorMessage, setImageErrorMessage] = useState<string>("");
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [currentBlogCampaign, setCurrentBlogCampaign] =
    useState<Campaign | null>(null);
  const [socialMediaCaption, setSocialMediaCaption] = useState<string>("");

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
    campaignPostsUrls: [],
    socialMediaCaption: "",
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
                  campaignId: campaign.campaignId,
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
      campaignPostsUrls: [],
      socialMediaCaption: campaign.socialMediaCaption,
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

  const handlePublish = (campaign: Campaign) => {
    setCurrentBlogCampaign(campaign);
    setSocialMediaCaption(campaign.socialMediaCaption || "");
    setIsPublishModalVisible(true);
  };

  const handlePublishModalCancel = () => {
    setIsPublishModalVisible(false);
    setCurrentBlogCampaign(null);
    setSocialMediaCaption("");
  };

  const getPlatformData = (platform: string) => {
    const platforms = {
      instagram: {
        name: "Instagram",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        ),
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        textColor: "text-white",
      },
      linkedin: {
        name: "LinkedIn",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
        color: "bg-blue-600",
        textColor: "text-white",
      },
      facebook: {
        name: "Facebook",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
        color: "bg-blue-500",
        textColor: "text-white",
      },
      twitter: {
        name: "Twitter",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        ),
        color: "bg-sky-500",
        textColor: "text-white",
      },
    };
    return (platforms as any)[platform.toLowerCase()] || null;
  };

  const getPlatformUrl = (platform: string, campaignPostsUrls: PostUrl[]) => {
    return campaignPostsUrls?.find(
      (url) => url.platform.toUpperCase() === platform.toUpperCase()
    );
  };

  const handlePlatformPublish = async (platform: string) => {
    try {
      message.loading(`Publishing to ${platform}...`, 0);

      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/publishposttosocialmedia?campaignId=${
          currentBlogCampaign?.campaignId
        }&platform=${platform.toUpperCase()}&socialMediaCaption=${encodeURIComponent(
          socialMediaCaption.trim()
        )}`,
        "",
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      message.destroy();

      const { status, url, postId } = response.data;

      if (status) {
        message.success(`Successfully published to ${platform}!`);

        if (url && postId) {
          updateCampaignPostUrls(platform, url, postId);
        }
      } else {
        message.error(`Failed to publish to ${platform}`);
      }
    } catch (error) {
      message.destroy();
      console.error(`Error publishing to ${platform}:`, error);

      const err = error as AxiosError;

      const errorMessage =
        (err.response?.data as any)?.message || "Please try again.";

      message.error(`Failed to publish to ${platform}: ${errorMessage}`);
    }
  };

  const updateCampaignPostUrls = (
    platform: string,
    postUrl: string,
    platformPostId: string
  ) => {
    if (currentBlogCampaign) {
      const updatedUrls = [
        ...(currentBlogCampaign.campaignPostsUrls || []),
        {
          platform,
          postUrl,
          platformPostId,
          publishedAt: new Date().toISOString(),
        },
      ];
      setCurrentBlogCampaign({
        ...currentBlogCampaign,
        // campaignPostsUrls: updatedUrls,
      });
    }
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
          // Include socialMediaCaption in the payload
          ...(currentCampaign?.campainInputType === "BLOG" && {
            socialMediaCaption: formData.socialMediaCaption,
          }),
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
        message.success(`${formData.campainInputType} updated successfully!`);
        setIsSubmitting(false);
        setFormData({
          campaignType: "",
          campaignDescription: "",
          imageUrls: [],
          campaignTypeAddBy: "",
          campaignStatus: "",
          campaignId: "",
          campainInputType: "",
          campaignPostsUrls: [],
          socialMediaCaption: "",
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

  const getColumns = (type: string, isBlog: boolean = false) => [
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
          : `${authUrl}${record.campaignId.slice(-4)}/${slugifiedCampaignType}`;

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
      title: <div className="text-center">Added By</div>,
      dataIndex: "campaignTypeAddBy",
      key: "campaignTypeAddBy",
      render: (text: string) => (
        <div className="max-w-xs break-words">{text}</div>
      ),
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
          {isBlog && (
            <Button
              type="default"
              className="bg-purple-500 text-white hover:bg-purple-600"
              onClick={() => handlePublish(campaign)}
            >
              Publish
            </Button>
          )}
        </div>
      ),
    },
  ];

  const serviceCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "SERVICE"
  );
  const productCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "PRODUCT"
  );
  const blogCampaigns = campaigns.filter(
    (campaign) => campaign.campainInputType === "BLOG"
  );

  const renderTable = (
    data: Campaign[],
    type: string,
    isBlog: boolean = false
  ) => (
    <div className="overflow-x-auto">
      <Table
        columns={getColumns(type, isBlog)}
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
              {renderTable(blogCampaigns, "Blog", true)}
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
            <h2 className="mb-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
              {formData.campaignType}
            </h2>

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

            {/* Social Media Caption Input - Show only for BLOG type */}
            {currentCampaign?.campainInputType === "BLOG" && (
              <Input.TextArea
                rows={3}
                value={formData.socialMediaCaption}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMediaCaption: e.target.value,
                  })
                }
                placeholder="Enter social media caption for the blog"
                className="mb-4"
              />
            )}

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

      <Modal
        title="Publish Blog"
        visible={isPublishModalVisible}
        onCancel={handlePublishModalCancel}
        width={900}
        footer={[
          <Button key="cancel" onClick={handlePublishModalCancel}>
            Cancel
          </Button>,
        ]}
      >
        {currentBlogCampaign && (
          <div>
            <h2 className="mb-4 text-lg font-bold w-fit text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg shadow-lg">
              {currentBlogCampaign.campaignType}
            </h2>

            {/* Social Media Caption Section */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-700 flex items-center">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Social Media Caption
              </h3>
              <Input.TextArea
                rows={4}
                value={socialMediaCaption}
                onChange={(e) => setSocialMediaCaption(e.target.value)}
                placeholder="Write your social media caption here..."
                className="mb-4 resize-none"
                maxLength={2000}
                showCount
              />
            </div>

            {/* Social Media Platforms Section */}
            <div className="mb-4">
              <h3 className="mb-4 font-medium text-gray-700 flex items-center">
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
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3-2h6V3H9v1z"
                  />
                </svg>
                Social Media Platforms
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["instagram", "linkedin", "facebook", "twitter"].map(
                  (platform) => {
                    const platformData = getPlatformData(platform);
                    const existingUrl = getPlatformUrl(
                      platform,
                      currentBlogCampaign.campaignPostsUrls || []
                    );

                    return (
                      <div
                        key={platform}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                platformData?.color
                              } ${
                                platformData?.textColor
                              } shadow-lg ring-2 ring-offset-1 ring-opacity-30 ${platformData?.color?.replace(
                                "bg-",
                                "ring-"
                              )}`}
                            >
                              {platformData?.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {platformData?.name}
                              </h4>
                              {existingUrl ? (
                                <p className="text-sm text-green-600 font-semibold">
                                  Published
                                </p>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Not published
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {existingUrl ? (
                              <>
                                <a
                                  href={existingUrl.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                  title="View Post"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                                <button
                                  onClick={() =>
                                    handleCopy(existingUrl.postUrl)
                                  }
                                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                  title="Copy URL"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <Button
                                type="primary"
                                size="small"
                                className={`${platformData?.color} border-none hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold`}
                                onClick={() => handlePlatformPublish(platform)}
                                disabled={!socialMediaCaption.trim()}
                              >
                                Publish
                              </Button>
                            )}
                          </div>
                        </div>

                        {existingUrl && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>
                                <span className="font-medium">Post ID:</span>{" "}
                                {existingUrl.platformPostId}
                              </div>
                              <div className="break-all">
                                <span className="font-medium">URL:</span>
                                <a
                                  href={existingUrl.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline ml-1 font-medium bg-blue-50 px-2 py-1 rounded transition-all duration-200 hover:bg-blue-100"
                                >
                                  {existingUrl.postUrl}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCampaignsDetails;
