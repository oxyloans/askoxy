import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface images {
  imageUrl: String;
  status: boolean;
}

interface CampaignForm {
  campaignType: string;
  campaignDescription: string;
  imageUrl: images[];
  campaignTypeAddBy: string;
}

const CampaignsAdd: React.FC = () => {
  const [formData, setFormData] = useState<CampaignForm>({
    campaignType: "",
    campaignDescription: "",
    imageUrl: [],
    campaignTypeAddBy: "RAMA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Added isUploading state
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imageErrorMessage, setImageErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  // const [fileList, setFileList] = useState<images[]>([]);

  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [descErrormessage, setDescErrorMessage] = useState<string>("");
  const [typeErrorMessage, setTypeErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const accessToken = localStorage.getItem("accessToken");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const isAlreadyUploaded = formData.imageUrl.some(
        (item) => item.imageUrl === file.name
      );

      if (isAlreadyUploaded) {
        setImageErrorMessage("Image already added");
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
          // Update both formData and fileList
          setFormData((prev) => ({
            ...prev,
            imageUrl: [
              ...prev.imageUrl,
              {
                imageUrl: response.data.documentPath,
                status: true,
              },
            ],
          }));

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

  const handleDeleteImage = (indexToDelete: number) => {
    // Update both formData and fileList
    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, index) => index !== indexToDelete),
    }));

    // setFileList((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    setNameErrorMessage("");
    setDescErrorMessage("");
    setTypeErrorMessage("");
    setSuccessMessage("");

    // Validation flag to track if all conditions pass
    let isValid = true;

    // Validate campaign name
    if (formData.campaignType.trim() === "") {
      setNameErrorMessage("Campaign Name is required");
      isValid = false;
    }

    // Validate image URLs
    // if (formData.imageUrl.length === 0) {
    //   setTypeErrorMessage("At least one image is required");
    //   isValid = false;
    // }

    // Validate campaign description
    if (formData.campaignDescription.trim() === "") {
      setDescErrorMessage("Campaign description is required");
      isValid = false;
    }
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    const requestPayload = {
      askOxyCampaignDto: [
        {
          campaignDescription: formData.campaignDescription,
          campaignType: formData.campaignType,
          campaignTypeAddBy: formData.campaignTypeAddBy,
          images: formData.imageUrl,
        },
      ],
    };

    console.log("requestPayload", requestPayload.askOxyCampaignDto[0].images);

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
        message.success("Campaign Added Successfully...!");
        setFormData({
          campaignType: "",
          campaignDescription: "",
          imageUrl: [],
          campaignTypeAddBy: "RAMA",
        });
      } else {
        setErrorMessage("Failed to add campaign. Please try again.");
        message.error("Failed to add campaign. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to add campaign. Please try again.");
      message.error("Failed to add campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      {/* <div className="lg:w-1/4 w-full p-4"> */}
      <Sidebar />
      {/* </div> */}
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add New Campaign
          </h1>
          <form>
            {/* Campaign Name */}
            <div className="mb-4">
              <label
                htmlFor="campaignType"
                className="block text-sm font-medium text-gray-700"
              >
                Campaign Name
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
            {/* Campaign Description */}
            <div className="mb-4">
              <label
                htmlFor="campaignDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Description
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

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
            </div>

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
                  onChange={handleFileChange}
                  multiple
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
              {isUploading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-4 h-4 mr-2 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  Uploading...
                </div>
              )}
              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}
              {imageErrorMessage && (
                <p className="text-sm text-red-600">{imageErrorMessage}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {formData.imageUrl.map((image, index) => (
                <div key={index} className="relative group">
                  {/* Image Wrapper */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                    {/* Main Image */}
                    <div className="aspect-[4/3]">
                      <img
                        src={image.imageUrl.toString()}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteImage(index)}
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

                    {/* Image Counter */}
                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Image {index + 1} of {formData.imageUrl.length}
                    </div>
                  </div>
                </div>
              ))}
              {typeErrorMessage && (
                <div className="text-red-500 text-sm mb-4">
                  {typeErrorMessage}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="campaignTypeAddBy"
                className="block text-sm font-medium text-gray-700"
              >
                Campaign Added By
              </label>
              <select
                id="campaignTypeAddBy"
                name="campaignTypeAddBy"
                value={formData.campaignTypeAddBy}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="RAMA">RAMA</option>
                <option value="RADHA">RADHA</option>
                <option value="SRIDHAR">SRIDHAR</option>
              </select>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <div>
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
                {isSubmitting ? "Submitting..." : "Add Campaign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignsAdd;
