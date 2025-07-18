import React, { useState, useEffect } from "react";
import "../StudyAbroad.css";
import "../DiwaliPage.css";
import { useNavigate } from "react-router-dom";
import Header1 from "../Header";
import Footer from "../Footer";
import { message, Modal } from "antd";
import { ArrowLeft, PlayCircleIcon, UsersIcon } from "lucide-react";
import FG from "../../assets/img/genai.png";
import {
  checkUserInterest,
  submitInterest,
  submitWriteToUsQuery,
} from "../servicesapi"; 

const FreeAiandGenAi: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [interested, setInterested] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const submitclicks = sessionStorage.getItem("submitclicks");
  const email = profileData.customerEmail || null;
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
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

  // Whatsapp and Video Links
  const WHATSAPP_JOIN_GROUP =
    "https://chat.whatsapp.com/IbsWaPLHADfC0pF5lgGiMe";
  const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/GJntC36RVHsLTuu20zPLR9";
  const INTRO_VIDEO = "https://www.youtube.com/watch?v=dummy-intro-video";
  const COURSE_OVERVIEW_VIDEO =
    "https://www.askoxy.ai/aiandgenaivsverficationandvalidation";

  const handleRoleToggle = (role: string) => {
    setSelectedRole((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleRoleSelection = (roles: string[]) => {
    if (roles.length > 0) {
      setIsRoleModalOpen(false);
      showConfirmationModal(interested, roles.join(" "));
    }
  };

  const handleSubmit = (isAlreadyInterested: boolean) => {
    sessionStorage.setItem("submitclicks", "true");

    if (!userId) {
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", "/main/services/freeai-genai");
      message.warning("Please login to submit your interest.");
      return;
    }

    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 7);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }

    setIsRoleModalOpen(true); // Show role selection modal
  };

  const showConfirmationModal = (isAlreadyInterested: boolean, role: string) => {
    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 7);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }
    Modal.confirm({
      title: "Confirm Participation",
      content:
        `Are you sure you want to participate in the Free AI & Gen AI Training offer as ${role || "a participant"}?`,
      okText: "Yes, I’m sure",
      cancelText: "Cancel",
      onOk: () => submitInterestHandler(role),
      onCancel: () => {
        sessionStorage.removeItem("submitclicks");
        setSelectedRole([]);
      },
    });
  };

  const submitInterestHandler = async (role: string) => {
    if (isButtonDisabled) return;

    try {
      setIsButtonDisabled(true);
      const success = await submitInterest(
        formData.askOxyOfers,
        formData.mobileNumber,
        formData.userId,
        role
      );

      if (success) {
        message.success(
          "Thank you for showing interest in our *Free AI & Gen Ai Training* offer!"
        );
        setInterested(true);
      } else {
        message.error("Failed to submit your interest. Please try again.");
        setInterested(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
      setInterested(false);
    } finally {
      setIsButtonDisabled(false);
      sessionStorage.removeItem("submitclicks");
      setSelectedRole([]);
    }
  };

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
    handleLoadOffersAndCheckInterest();
  }, []);

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId) return;

    try {
      const hasInterest = await checkUserInterest(userId, "FREEAI");
      setInterested(hasInterest);
      if (submitclicks) {
        handleSubmit(hasInterest);
      }
    } catch (error) {
      console.error("Error while fetching offers:", error);
      setInterested(false);
    }
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const success = await submitWriteToUsQuery(
        email,
        finalMobileNumber,
        query,
        "FREEAI",
        userId
      );

      if (success) {
        setSuccessOpen(true);
        setIsOpen(false);
        setQuery("");
        setQueryError(undefined);
      } else {
        message.error("Failed to submit your query. Please try again.");
      }
    } catch (error) {
      console.error("Error sending the query:", error);
      message.error("Failed to submit your query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppGroupJoin = () => {
    window.open(WHATSAPP_JOIN_GROUP, "_blank");
  };

  const handleCommunityLink = () => {
    window.open(WHATSAPP_COMMUNITY, "_blank");
  };

  const handleIntroVideo = () => {
    window.open(INTRO_VIDEO, "_blank");
  };

  const handleCourseOverviewVideo = () => {
    window.open(COURSE_OVERVIEW_VIDEO, "_blank");
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
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
                    onClick={() => handleSubmit(interested)}
                    aria-label="I'm Interested"
                    disabled={interested}
                  >
                    {!interested ? "I'm Interested" : "Already Participated"}
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
                    <span className="text-blue-600 font-semibold">
                      ASKOXY.AI
                    </span>
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
                    Gain hands-on experience with free project training, guided
                    by visionary leader{" "}
                    <strong className="text-pink-600">
                      Radhakrishna Thatavarti
                    </strong>
                    , Founder & CEO of ASKOXY.AI.{" "}
                    <strong className="text-blue-600">
                      Transform your future today!
                    </strong>{" "}
                    <span>🌐</span>
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      onClick={handleWhatsAppGroupJoin}
                      className="flex items-center justify-center w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 space-x-2"
                    >
                      <span>Join WhatsApp Group</span>
                    </button>

                    <button
                      onClick={handleCommunityLink}
                      className="flex items-center justify-center w-full p-2 bg-[#04AA6D] text-white rounded-lg hover:bg-green-600 transition duration-300 space-x-2"
                    >
                      <UsersIcon className="w-5 h-5" />
                      <span>AI & Gen AI Knowledge Sharing</span>
                    </button>

                    <button
                      onClick={handleCourseOverviewVideo}
                      className="flex items-center justify-center w-full p-3 bg-[#008CBA] text-white rounded-lg hover:bg-blue-600 transition duration-300 space-x-2"
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
                        <button className="px-4 py-3 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none">
                          <span className="mr-2">📖</span> Our Training Guide
                        </button>
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-3xl mx-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Join ASKOXY.AI
              </h2>
              <p className="text-gray-600 text-sm">
                Choose how you'd like to participate in our FREEAI offer
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                  selectedRole.includes("PARTNER")
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("PARTNER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("PARTNER")
                        ? "bg-blue-600"
                        : "bg-blue-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as Partner
                    </h3>
                    <p className="text-xs text-gray-600">
                      Sell your products and services
                    </p>
                  </div>
                </div>
              </button>
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                  selectedRole.includes("USER")
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("USER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("USER")
                        ? "bg-green-600"
                        : "bg-green-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as User
                    </h3>
                    <p className="text-xs text-gray-600">
                      Buy my products and services
                    </p>
                  </div>
                </div>
              </button>
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                  selectedRole.includes("FREELANCER")
                    ? "bg-purple-100 border-purple-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("FREELANCER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("FREELANCER")
                        ? "bg-purple-600"
                        : "bg-purple-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5-7"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as Freelancer
                    </h3>
                    <p className="text-xs text-gray-600">
                      Bring partners and users to earn money
                    </p>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-between">
              <button
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setSelectedRole([]);
                  sessionStorage.removeItem("submitclicks");
                }}
              >
                Cancel
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-white ${
                  selectedRole.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => handleRoleSelection(selectedRole)}
                disabled={selectedRole.length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate:


-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
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
