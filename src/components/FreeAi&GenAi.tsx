import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Footer from "./Footer";
import { message } from "antd";
import {
  ArrowLeft,
  PlayCircleIcon,
  UsersIcon
} from "lucide-react";
import { notification } from "antd";
import BASE_URL from "../Config";

import FG from "../assets/img/genai.png";

const FreeAiandGenAi: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const userId = localStorage.getItem("userId");
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [interested, setInterested] = useState<boolean>(false);
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");

  const email = profileData.customerEmail || null;
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");

  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const [formData, setFormData] = useState({
    askOxyOfers: "FREEAI",
    mobileNumber: finalMobileNumber,
    userId: userId,
    projectType: "ASKOXY",
  });

  const askOxyOfers = localStorage.getItem("askOxyOfers");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Whatsapp and Video Links (replace with actual links)
  const WHATSAPP_JOIN_GROUP = "https://chat.whatsapp.com/IbsWaPLHADfC0pF5lgGiMe";
  const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/GJntC36RVHsLTuu20zPLR9";
  const INTRO_VIDEO = "https://www.youtube.com/watch?v=dummy-intro-video";
  const COURSE_OVERVIEW_VIDEO = "https://www.askoxy.ai/aiandgenaivsverficationandvalidation";

  const handleSubmit = async () => {
    if (interested) {
      message.warning("You have already participated. Thank you!");
      return;
    }
    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        formData
      );
      console.log("API Response:", response.data);
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);

      message.success(
        "Thank you for showing interest in our *Free AI & Gen Ai Training* offer!"
      );
      setInterested(true);
      setTimeout(() => {
        window.dispatchEvent(new Event("refreshOffers"));
      }, 200);
    } catch (error: any) {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
      setIsButtonDisabled(false);
    }
    window.dispatchEvent(new Event("refreshOffers"));
  };

  const navigate = useNavigate();

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleWriteToUs = () => {
    if (
      !email ||
      email === "null" ||
      !finalMobileNumber ||
      finalMobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    handleGetOffer();
  }, []);

  const handleGetOffer = () => {
    const data = localStorage.getItem("userInterest");
    if (data) {
      const parsedData = JSON.parse(data);
      const hasFreeRudrakshaOffer = parsedData.some(
        (offer: any) => offer.askOxyOfers === "FREEAI"
      );

      if (hasFreeRudrakshaOffer) {
        setInterested(true);
      } else {
        setInterested(false);
      }
    } else {
      setInterested(false);
    }
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    const payload = {
      email: email,
      mobileNumber: finalMobileNumber,
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

    console.log("Query:", query);
    const accessToken = localStorage.getItem("accessToken");

    const apiUrl = `${BASE_URL}/user-service/write/saveData`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.post(apiUrl, payload, { headers: headers });

      if (response.data) {
        console.log("Response:", response.data);
        setSuccessOpen(true);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error sending the query:", error);
    }
  };

  const handleWhatsAppGroupJoin = () => {
    window.open(WHATSAPP_JOIN_GROUP, '_blank');
  };

  const handleCommunityLink = () => {
    window.open(WHATSAPP_COMMUNITY, '_blank');
  };

  const handleIntroVideo = () => {
    window.open(INTRO_VIDEO, '_blank');
  };

  const handleCourseOverviewVideo = () => {
    window.open(COURSE_OVERVIEW_VIDEO, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-purple-50 rounded-full transition-colors duration-200"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-5 w-5 text-purple-700" />
                  </button>
                  <h1 className="text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-500 font-bold text-xl sm:text-2xl md:text-3xl leading-tight">
                    FREE AI & GEN AI TRAINING
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg text-sm md:text-base font-medium transition duration-300 transform hover:-translate-y-0.5"
                    onClick={handleSubmit}
                    aria-label="I'm Interested"
                  >
                    I'm Interested
                  </button>

                  <button
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg text-sm md:text-base font-medium transition duration-300 transform hover:-translate-y-0.5"
                    aria-label="Write To Us"
                    onClick={handleWriteToUs}
                  >
                    Write To Us
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-4 md:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full">
                <div className="w-full md:w-1/2 p-2 flex justify-center transform transition-all duration-500 hover:scale-105">
                  <img
                    src={FG}
                    alt="AI Training Offer"
                    className="w-full max-w-md h-auto rounded-xl shadow-lg object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="w-full md:w-1/2 p-4 space-y-5 text-center md:text-left">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <strong className="text-purple-700">
                      Unlock your career potential
                    </strong>{" "}
                    with{" "}
                    <span className="text-blue-600 font-semibold">ASKOXY.AI</span>
                    's free AI & Generative AI training, combined with Java and
                    Microservices expertise.
                  </p>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    <strong className="text-pink-600">
                      Open to all graduates, pass or fail
                    </strong>
                    , this program empowers freshers to land their first job and
                    helps experienced professionals achieve high-salary roles.
                    <span className="ml-1">🎓</span>
                  </p>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    Gain hands-on experience with free project training, guided by
                    visionary leader{" "}
                    <strong className="text-pink-600">
                      Radhakrishna Thatavarti
                    </strong>
                    , Founder & CEO of ASKOXY.AI.{" "}
                    <strong className="text-blue-600">
                      Transform your future today!
                    </strong>{" "}
                    <span>🌐</span>
                  </p>

                  {/* WhatsApp and Video Section */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleWhatsAppGroupJoin}
                      className="flex items-center justify-center w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 space-x-2"
                    >
                     
                      <span>Join WhatsApp Group</span>
                    </button>

                     <button 
                      onClick={handleCommunityLink}
                      className="flex items-center justify-center w-full p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300 space-x-2"
                    >
                      <UsersIcon className="w-5 h-5" />
                      <span>AI & Gen AI Knowledge Sharing</span>
                    </button> 

                    {/* <button 
                      onClick={handleIntroVideo}
                      className="flex items-center justify-center w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 space-x-2"
                    >
                      <PlayCircleIcon className="w-5 h-5" />
                      <span>Intro Video</span>
                    </button> */}

                    <button 
                      onClick={handleCourseOverviewVideo}
                      className="flex items-center justify-center w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 space-x-2"
                    >
                      <PlayCircleIcon className="w-5 h-5" />
                      <span>AI & GEN AI VIDEOS</span>
                    </button>

                    <button>
                    <a
                      href="https://sites.google.com/view/globalecommercemarketplace/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Oxyloans Training Guide"
                      className="inline-block"
                    >
                      <button className="px-6 py-3 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none">
                        <span className="mr-2">📖</span> Our Training Guide
                      </button>
                    </a>
                    
                    </button>


                  </div>

                  {/* <div className="flex justify-center md:justify-start pt-2">
                    <a
                      href="https://sites.google.com/view/globalecommercemarketplace/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Oxyloans Training Guide"
                      className="inline-block"
                    >
                      <button className="px-6 py-3 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none">
                        <span className="mr-2">📖</span> Our Training Guide
                      </button>
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write To Us Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">
              Write To Us
            </h2>

            <form className="space-y-5">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1.5"
                  htmlFor="phone"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  disabled={true}
                  value={finalMobileNumber || ""}
                  className="block w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-1.5"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email || ""}
                  disabled={true}
                  className="block w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-1.5"
                  htmlFor="query"
                >
                  Query
                </label>
                <textarea
                  id="query"
                  rows={4}
                  className="block w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter your query"
                  onChange={(e) => setQuery(e.target.value)}
                />
                {queryError && (
                  <p className="text-red-500 text-sm mt-1.5">{queryError}</p>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleWriteToUsSubmitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Submit Query"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Alert Modal */}
      {isprofileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-purple-800 font-bold">Alert!</h2>
              <button
                className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsprofileOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-center text-gray-700 mb-6 text-lg">
              Please fill your profile details.
            </p>
            <div className="flex justify-center">
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                onClick={handlePopUOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {issuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl text-green-600 font-bold mb-4">Success!</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Query submitted successfully!
            </p>
            <div className="flex justify-center">
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={() => setSuccessOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FreeAiandGenAi;