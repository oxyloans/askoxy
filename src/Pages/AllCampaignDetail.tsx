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

  // Define the base URL for the images (adjust according to your API or CDN)
  const imageBaseUrl = "https://meta.oxyloans.com/"; // Example base URL, replace if necessary

  // Fetch campaigns data from the API
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 text-white p-6">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Campaign Details
        </h1>
        {loading ? (
          <p className="text-gray-600">Loading campaigns...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Image
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Campaign Type
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700">
                    Added By
                  </th>
                  <th className="border border-gray-300 p-3 text-center text-gray-700">
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
                      <td className="border border-gray-300 p-3">
                        <img
                          src={`${imageBaseUrl}${campaign.imageUrl}`} // Assuming the image URL needs to be appended to the base URL
                          alt={campaign.campaignType}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-3">
                        {campaign.campaignType}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {campaign.campaignDescription}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {campaign.campaignTypeAddBy}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <button
                          onClick={() =>
                            alert(`Edit Campaign: ${campaign.campaignType}`)
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.campaignType)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center p-6 text-gray-500 bg-gray-50"
                    >
                      No campaigns found.
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
