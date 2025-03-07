import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import { message, Modal, Button, Input, Upload, Table, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IndexKind } from "typescript";
import { imageUrls } from "../assets/images";

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
  });

  const TestUrl = window.location.href.includes("sandbox")
    ? "https://www.sandbox.askoxy.ai/main/services/campaign/"
    : "https://www.askoxy.ai/dashboard/";

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
        "https://meta.oxyglobal.tech/api/marketing-service/campgin/getAllCampaignDetails",
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
            "https://meta.oxyglobal.tech/api/marketing-service/campgin/activate-deactivate-campaign",
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
            // setCampaigns((prev) =>
            //   prev.filter((campaign) => campaign.campaignType !== campaign.campaignType)
            // );
            message.success("Campaign deactivated successfully.");
          } else {
            message.error("Failed to deactivate the campaign.");
          }
        } catch (error) {
          message.error("Error while deactivating campaign.");
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
    });
    setIsUpdateModalVisible(true);
    // console.log(formData);
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
          // setFormData((prev) => ({
          //   ...prev,
          //   imageUrls: [
          //     ...prev.imageUrls,
          //     {
          //       imageUrl: response.data.documentPath,
          //       status: true,
          //       imageId: response.data.id,
          //     },
          //   ],
          // }));
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
          setImageErrorMessage("Failed to upload the image. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setImageErrorMessage("Failed to upload the image. Please try again.");
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
      imageUrls: prev.imageUrls.map(
        (image) =>
          image.imageId === imageIdToDelete
            ? { ...image, status: false } // Update the status to false
            : image // Keep the other images unchanged
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
          campaignType: formData.campaignType,
          campaignTypeAddBy: formData.campaignTypeAddBy,
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
        "https://meta.oxyglobal.tech/api/marketing-service/campgin/addCampaignTypes",
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
  const columns = [
    {
      title: <div className="text-center">Images</div>,
      dataIndex: "imageUrls",
      key: "imageUrls",
      render: (imageUrls: Image[]) => (
        <div className="flex flex-col gap-2">
          {imageUrls.map((item, index) => (
            <img
              key={index}
              src={item.imageUrl}
              alt="No Images found"
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      ),
    },
    {
      title: <div className="text-center">Campaign Type</div>,
      dataIndex: "campaignType",
      key: "campaignType",
      titleAlign: "center",
    },
    {
      title: <div className="text-center">Description</div>,
      dataIndex: "campaignDescription",
      key: "campaignDescription",
    },
    {
      title: <div className="text-center">Added By</div>,
      dataIndex: "campaignTypeAddBy",
      key: "campaignTypeAddBy",
    },
    {
      title: <div className="text-center">Campaign Url</div>,
      key: "campaignUrl",
      render: (_: any, record: Campaign) => {
        const encodedCampaignType = encodeURIComponent(record.campaignType);
        const campaignUrl = `${TestUrl}${encodedCampaignType}`;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={campaignUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
              style={{ wordBreak: "break-word" }} // Ensures wrapping
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
        <div className="flex justify-center gap-2">
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      {/* <div className="w-full md:w-64 lg:w-1/5 text-white p-2"> */}
      <Sidebar />
      {/* </div> */}

      {/* Main Content */}
      <div className="flex-3 p-4 sm:p-6 lg:p-8 mx-auto w-full max-w-full md:max-w-7xl">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          All Campaign Details
        </h1>
        {loading ? (
          <p className="text-gray-600">Loading campaigns...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={campaigns}
              rowKey={(record) => record.campaignType}
              pagination={false}
              className="border border-gray-300 table-auto"
              scroll={{ x: window.innerWidth < 768 ? 800 : undefined }}
            />
          </div>
        )}
      </div>

      {/* Update Campaign Modal */}
      <Modal
        title="Update Campaign"
        visible={isUpdateModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
            {isSubmitting ? "Submitting..." : "Add Campaign"}
          </Button>,
        ]}
      >
        {currentCampaign && (
          <div>
            {/* Campaign Description Input */}
            <Input.TextArea
              rows={4}
              value={formData.campaignDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  campaignDescription: e.target.value,
                })
              }
              placeholder="Update campaign description"
              className="mb-4"
            />

            {/* Image Upload Section */}
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
                  <span>Choose Images</span>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleUploadChange(e)}
                  multiple
                  accept=".jpg,.jpeg,.png"
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

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {/* Display Existing Images */}
              {formData.imageUrls.map(
                (image, index) =>
                  image.status && (
                    <div key={index} className="relative group">
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                        <div className="aspect-[4/3]">
                          <img
                            src={image.imageUrl}
                            alt={`Campaign Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          onClick={() => handleDeleteImagestatus(image.imageId)}
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
                          Image {index + 1} of {formData.imageUrls.length}
                        </div>
                      </div>
                    </div>
                  )
              )}

              {/* Display Newly Uploaded Images */}
              {fileList.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                    <div className="aspect-[4/3]">
                      <img
                        src={image.imageUrl}
                        alt={`Uploaded Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={() => handleDeleteImage(image.imageId)}
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
                      Image {index + 1} of {fileList.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message for Images */}
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
