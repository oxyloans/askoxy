import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";

interface Campaign {
  imageUrl: string;
  campaignType: string;
  campaignDescription: string;
  campaignTypeAddBy: string;
}

const AllCampaignsDetails: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const imageBaseUrl = "https://meta.oxyloans.com/";

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://meta.oxyloans.com/api/auth-service/auth/getAllCampaignDetails",
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        alert("Failed to load campaign details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleDelete = (campaignType: string) => {
    if (window.confirm(`Are you sure you want to delete "${campaignType}"?`)) {
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.campaignType !== campaignType)
      );
      alert(`Campaign "${campaignType}" deleted.`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full text-white p-6">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 mx-auto w-full max-w-full md:max-w-7xl">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          All Campaign Details
        </h1>
        {loading ? (
          <p className="text-gray-600">Loading ca mpaigns...</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto scrollbar-hide">
            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base text-gray-700">
                    Image
                  </th>
                  <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base text-gray-700">
                    Campaign Type
                  </th>
                  <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base text-gray-700">
                    Added By
                  </th>
                  <th className="border border-gray-300 p-2 md:p-3 text-center text-sm md:text-base text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length > 0 ? (
                  campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition duration-150 ease-in-out"
                    >
                      <td className="border border-gray-300 p-2 md:p-3">
                        <img
                          src={`${imageBaseUrl}${campaign.imageUrl}`}
                          alt={campaign.campaignType}
                          className="w-12 h-12 md:w-20 md:h-20 rounded-md object-cover"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 md:p-3">
                        {campaign.campaignType}
                      </td>
                      <td className="border border-gray-300 p-2 md:p-3">
                        {campaign.campaignDescription}
                      </td>
                      <td className="border border-gray-300 p-2 md:p-3">
                        {campaign.campaignTypeAddBy}
                      </td>
                      <td className="border border-gray-300 p-2 md:p-3 text-center">
                        <button
                          onClick={() => handleDelete(campaign.campaignType)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm md:text-base font-semibold py-1 px-3 rounded shadow"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-4">
                      No campaigns available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCampaignsDetails;
