import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sider";

interface CampaignForm {
  campaignType: string;
  campaignDescription: string;
  imageUrl: string;
  campaignTypeAddBy: string;
}

const CampaignsAdd: React.FC = () => {
  const [formData, setFormData] = useState<CampaignForm>({
    campaignType: "",
    campaignDescription: "",
    imageUrl: "",
    campaignTypeAddBy: "RAMA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const requestPayload = {
      askOxyCampaignDto: [
        {
          campaignDescription: formData.campaignDescription,
          campaignType: formData.campaignType,
          campaignTypeAddBy: formData.campaignTypeAddBy,
          imageUrl: formData.imageUrl,
        },
      ],
    };

    try {
      const response = await axios.patch(
        "https://meta.oxyloans.com/api/auth-service/auth/addCampaignTypes",
        requestPayload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        alert(`Campaign "${formData.campaignType}" added successfully!`);
        setFormData({
          campaignType: "",
          campaignDescription: "",
          imageUrl: "",
          campaignTypeAddBy: "Rama",
        });
      } else {
        setErrorMessage("Failed to add campaign. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to add campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full p-4">
        <Sidebar />
      </div>

      {/* Form Section */}
      <div className="lg:w-3/4 w-full p-6 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Campaign
          </h1>
          <form onSubmit={handleSubmit}>
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
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Campaign Type Add By */}
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
