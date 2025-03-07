import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { message, notification } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface Campaign {
  campaignType: string;
  campaignDescription: string;
  imageUrls: Image[];
  campaignTypeAddBy: string;
  campaignStatus: boolean;
}

const CampaignDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/"); // Split path into parts
  const campaignType = decodeURIComponent(pathParts[pathParts.length - 1]);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const email = localStorage.getItem("email");
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const campaign = campaigns.find((c) => c.campaignType === campaignType);
  const mobileNumber = localStorage.getItem("whatsappNumber");
  const [formData, setFormData] = useState({
    askOxyOfers: campaignType,
    userId: userId,
    projectType: "ASKOXY",
  });

  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Campaign[]>(
          `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`
        );
        setCampaigns(response.data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleWriteToUs = () => {
    if (
      !email ||
      email === "null" ||
      !mobileNumber ||
      mobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return; // Exit the function if the query is invalid
    }
    // Payload with the data to send to the API
    const payload = {
      email: email,
      mobileNumber: mobileNumber,
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: "FREEAI",
      adminDocumentId: "",
      comments: "",
      id: "",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      query: query,
      userId: userId,
    };

    // Log the query to check the input before sending
    console.log("Query:", query);
    const accessToken = localStorage.getItem("accessToken");

    const apiUrl = `${BASE_URL}writetous-service/saveData`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // Sending the POST request to the API
      const response = await axios.post(apiUrl, payload, { headers: headers });

      // Check if the response was successful
      if (response.data) {
        console.log("Response:", response.data);
        setSuccessOpen(true);
        setIsOpen(false);
      }
    } catch (error) {
      // Handle error if the request fails
      console.error("Error sending the query:", error);
      message.error("Failed to send query. Please try again.");
    }
  };

  const handleSubmit = async () => {
    console.log(campaignType);

    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        `${BASE_URL}marketing-service/campgin/askOxyOfferes`,
        {
          askOxyOfers: campaignType,
          userId: userId,
          projectType: "ASKOXY",
        }
      );
      notification.success({
        message: "Success!",
        description: `Your interest has been submitted successfully!`,
        placement: "top",
        duration: 2,
        style: {
          width: 300,
          fontSize: "14px",
          padding: "10px",
        },
      });
    } catch (error: any) {
      if (error.response?.status === 500 || error.response?.status === 400) {
        notification.warning({
          message: "Warning!",
          description: `You have already participated. Thank you!`,
          placement: "top",
          duration: 2,
          style: {
            width: 300,
            fontSize: "14px",
            padding: "10px",
          },
        });
      } else {
        console.error("API Error:", error);
        notification.error({
          message: "Error!",
          description: "Failed to submit your interest. Please try again.",
          duration: 2,
          placement: "top",
          style: {
            width: 300,
            fontSize: "14px",
            padding: "10px",
          },
        });
      }
      setIsButtonDisabled(false);
    }
  };

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const renderNotFoundPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
        <div className="text-center">
          <div className="mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Campaign Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The campaign "{campaignType}" is currently inactive or unavailable.
          </p>
          <button
            onClick={() => navigate("/main")}
            className="px-6 py-3 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#2a1d4e] transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
              size="large"
            />
            <p className="mt-4 text-gray-600">Loading campaign details...</p>
          </div>
        </div>
      ) : !campaign ? (
        renderNotFoundPage()
      ) : !campaign.campaignStatus ? (
        renderNotFoundPage()
      ) : (
        <div>
          <div className="flex flex-col mb-6 w-full">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
              {campaign.campaignType}
            </h1>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                aria-label="Visit our site"
                disabled={isButtonDisabled}
              >
                I'm Interested
              </button>
              <button
                className="px-4 py-2 bg-[#f9b91a] text-white rounded-lg shadow-lg hover:bg-[#f9b91a] transition-all"
                aria-label="Write To Us"
                onClick={handleWriteToUs}
              >
                Write To Us
              </button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="flex flex-col gap-8 mb-8">
            {/* Image Container */}
            {campaign.imageUrls && campaign.imageUrls.length > 0 ? (
              campaign.imageUrls.length === 1 ? (
                <div className="flex justify-center px-4 sm:px-6">
                  <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                    {/* Loading placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>

                    <div className="min-h-[200px] bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={campaign.imageUrls[0].imageUrl}
                        alt={campaign.campaignType}
                        className="w-full h-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          const aspectRatio =
                            img.naturalWidth / img.naturalHeight;
                          const container = img.parentElement;

                          // Set container aspect ratio based on image orientation
                          if (container) {
                            if (aspectRatio > 1.2) {
                              // Horizontal image
                              container.style.aspectRatio = "16/9";
                              img.style.maxHeight = "480px";
                            } else if (aspectRatio < 0.8) {
                              // Vertical image
                              container.style.aspectRatio = "2/3";
                              img.style.maxHeight = "600px";
                            } else {
                              // Square-ish image
                              container.style.aspectRatio = "1";
                              img.style.maxHeight = "500px";
                            }
                          }

                          // Remove loading spinner
                          const spinner = container?.previousElementSibling;
                          if (spinner && spinner.parentElement) {
                            spinner.remove();
                          }
                          img.style.opacity = "1";
                        }}
                        style={{
                          opacity: "0",
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6">
                  {campaign.imageUrls.map((image, index) => (
                    <div
                      key={image.imageId}
                      className="relative bg-gray-50 rounded-lg overflow-hidden"
                    >
                      {/* Loading placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                      </div>

                      <div className="min-h-[200px] bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={`${campaign.campaignType} - ${index + 1}`}
                          className="w-full h-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            const aspectRatio =
                              img.naturalWidth / img.naturalHeight;
                            const container = img.parentElement;

                            if (container) {
                              // Set container aspect ratio based on image orientation
                              if (aspectRatio > 1.2) {
                                // Horizontal image
                                container.style.aspectRatio = "16/9";
                                img.style.maxHeight = "320px";
                              } else if (aspectRatio < 0.8) {
                                // Vertical image
                                container.style.aspectRatio = "2/3";
                                img.style.maxHeight = "400px";
                              } else {
                                // Square-ish image
                                container.style.aspectRatio = "1";
                                img.style.maxHeight = "360px";
                              }

                              // Center the image if it's smaller than container
                              if (img.naturalWidth < img.offsetWidth) {
                                img.classList.add("mx-auto");
                              }

                              // Remove loading spinner
                              const spinner = container.previousElementSibling;
                              if (spinner && spinner.parentElement) {
                                spinner.remove();
                              }
                            }
                            img.style.opacity = "1";
                          }}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            const container = img.parentElement;
                            if (container) {
                              container.innerHTML =
                                '<div class="flex items-center justify-center h-full p-4 text-red-500">Failed to load image</div>';
                            }
                          }}
                          style={{
                            opacity: "0",
                            transition: "opacity 0.3s ease-in-out",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : null}

            {/* Content Container */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {campaign.campaignDescription && (
                <div className="prose max-w-none">
                  {campaign.campaignDescription
                    .split("\n")
                    .map((paragraph, index) => {
                      if (paragraph.startsWith("###")) {
                        return (
                          <h2
                            key={index}
                            className="text-xl font-bold text-gray-800 mb-4"
                          >
                            {paragraph.replace("###", "").trim()}
                          </h2>
                        );
                      } else if (paragraph.trim().startsWith("-")) {
                        return (
                          <ul key={index} className="list-disc pl-6 mb-4">
                            <li className="text-gray-600">
                              {paragraph.replace("-", "").trim()}
                            </li>
                          </ul>
                        );
                      } else if (paragraph.includes("**")) {
                        return (
                          <p
                            key={index}
                            className="font-bold text-gray-800 mb-4"
                          >
                            {paragraph.replace(/\*\*/g, "").trim()}
                          </p>
                        );
                      } else {
                        return (
                          <p key={index} className="text-gray-600 mb-4">
                            {paragraph.trim()}
                          </p>
                        );
                      }
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
            {/* Close Button */}
            <i
              className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-500"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            />

            {/* Modal Content */}
            <h2 className="text-xl font-bold mb-4 text-[#3d2a71]">
              Write To Us
            </h2>

            {/* Mobile Number Field */}
            <div className="mb-4">
              <label
                className="block text-m text-black font-medium mb-1"
                htmlFor="phone"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                disabled={true}
                value={mobileNumber || ""}
                className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                placeholder="Enter your mobile number"
                style={{ fontSize: "0.8rem" }}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                className="block text-m text-black font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email || ""}
                disabled={true}
                className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                placeholder="Enter your email"
                style={{ fontSize: "0.8rem" }}
              />
            </div>

            {/* Query Field */}
            <div className="mb-4">
              <label
                className="block text-m text-black font-medium mb-1"
                htmlFor="query"
              >
                Query
              </label>
              <textarea
                id="query"
                rows={3}
                className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                placeholder="Enter your query"
                style={{ fontSize: "0.8rem" }}
                onChange={(e) => setQuery(e.target.value)}
              />
              {queryError && (
                <p className="text-red-500 text-sm mt-1">{queryError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#3d2a71] transition-all text-sm md:text-base lg:text-lg"
                onClick={handleWriteToUsSubmitButton}
              >
                Submit Query
              </button>
            </div>
          </div>
        </div>
      )}

      {isprofileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-[#3d2a71] font-bold">Alert...!</h2>
              <button
                className="font-bold text-2xl text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => setIsprofileOpen(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-center text-black mb-6">
              Please fill your profile details.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-[#f9b91a] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#f4a307] focus:outline-none"
                onClick={handlePopUOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {issuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105 text-center">
            <h2 className="text-xl text-green-600 font-bold mb-4">Success!</h2>
            <p className="text-black mb-6">Query submitted successfully...!</p>
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 focus:outline-none"
                onClick={() => setSuccessOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
