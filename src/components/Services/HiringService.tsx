import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../Config";
import { ArrowLeft, Mail, X } from "lucide-react";
import Footer from "../Footer";

const HiringService: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [interested, setInterested] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userId = localStorage.getItem("userId");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");

  const email = profileData.customerEmail || null;
  const finalMobileNumber = whatsappNumber || mobileNumber || null;

  const [formData, setFormData] = useState({
    askOxyOfers: "WEAREHIRING",
    userId: userId,
    mobileNumber: finalMobileNumber,
    projectType: "ASKOXY",
  });

  const navigate = useNavigate();

  useEffect(() => {
    handleGetOffer();
  }, []);

  const handleGetOffer = () => {
    const data = localStorage.getItem("userInterest");
    if (data) {
      const parsedData = JSON.parse(data);
      const hasHiringOffer = parsedData.some(
        (offer: any) => offer.askOxyOfers === "WEAREHIRING"
      );
      setInterested(hasHiringOffer);
    } else {
      setInterested(false);
    }
  };

  const handleSubmit = async () => {
    if (interested) {
      showMessage("You have already participated. Thank you!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        formData
      );

      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);
      showMessage(
        "Thank you for showing interest in our *We Are Hiring* offer!"
      );
      setInterested(true);

      setTimeout(() => {
        window.dispatchEvent(new Event("refreshOffers"));
      }, 200);
    } catch (error) {
      console.error("API Error:", error);
      showMessage("Failed to submit your interest. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (
    content: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    // Simple alert for now - you can replace with a proper notification system
    if (type === "error") {
      alert(`Error: ${content}`);
    } else if (type === "warning") {
      alert(`Warning: ${content}`);
    } else {
      alert(content);
    }
  };

  const handleWriteToUs = () => {
    if (
      !email ||
      email === "null" ||
      !finalMobileNumber ||
      finalMobileNumber === "null"
    ) {
      setIsProfileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handlePopUpOk = () => {
    setIsProfileOpen(false);
    navigate("/main/profile");
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    setIsLoading(true);
    const payload = {
      email: email,
      mobileNumber: finalMobileNumber,
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: "WEAREHIRING",
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

    const accessToken = localStorage.getItem("accessToken");
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/saveData`,
        payload,
        { headers }
      );
      if (response.data) {
        setSuccessOpen(true);
        setIsOpen(false);
        setQuery("");
      }
    } catch (error) {
      console.error("Error sending the query:", error);
      showMessage("Failed to submit your query. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              className="bg-[#04AA6D] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={handleSubmit}
              disabled={isLoading || interested}
            >
              {interested
                ? "Already Applied"
                : isLoading
                ? "Processing..."
                : "Join Us Now"}
            </button>

            <button
              className="bg-[#008CBA] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              onClick={handleWriteToUs}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4" /> Write To Us
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white text-center p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl text-center font-bold mb-2">
              <span className="text-green-400">Digital Ambassadors</span>
            </h1>
            <p className="text-lg opacity-90">
              Join Our Dynamic Team and Embark on a Digital Journey!
            </p>
          </div>

          {/* Content Sections */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-purple-900 mb-3">
                    Role Overview
                  </h2>
                  <p className="text-gray-700">
                    As a Digital Ambassador, you will play a pivotal role in
                    driving the digital transformation of our platforms,
                    including our Study Abroad Platform and others powered by
                    Askoxy.ai.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-purple-900 mb-3">
                    What You'll Do
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Content Creation: Write engaging blogs and posts.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Social Media Engagement: Create and share videos.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Customer Interaction: Visit customers to showcase our
                        platform.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Community Outreach: Engage with local communities.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Follow-Up Communication: Call customers and guide them.
                      </span>
                    </li>
                  </ul>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-purple-900 mb-3">
                    Requirements
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Bring your own laptop to take on this exciting role.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Passion for content creation and customer engagement.
                      </span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-purple-900 mb-3">
                    Why Join Us?
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Be a part of the Study Abroad Digital Journey.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>Work on platforms powered by Askoxy.ai.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                      <span>
                        Gain experience in content creation, social media, and
                        customer interaction.
                      </span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">Write To Us</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  disabled={true}
                  value={finalMobileNumber || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled={true}
                  value={email || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Query
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.trim()) setQueryError(undefined);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your query"
                />
                {queryError && (
                  <p className="mt-1 text-sm text-red-600">{queryError}</p>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleWriteToUsSubmitButton}
                  disabled={isLoading}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-md font-medium transition-colors"
                >
                  {isLoading ? "Sending..." : "Submit Query"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">
                Complete Your Profile
              </h2>
              <p className="text-gray-700 mt-2">
                Please fill your profile details before submitting a query.
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handlePopUpOk}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <div className="text-green-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-xl font-bold mt-2">Success!</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Your query has been successfully submitted.
            </p>

            <button
              onClick={() => setSuccessOpen(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringService;
