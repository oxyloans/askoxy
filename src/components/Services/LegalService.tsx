import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Legal from "../../assets/img/legal.png";
import { ArrowLeft } from "lucide-react";
import Header1 from "../Header";
import { message, Modal } from "antd";
import {
  checkUserInterest,
  submitInterest,
  submitWriteToUsQuery,
} from "../servicesapi";

const LegalService: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [interested, setInterested] = useState<boolean>(false);
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const userId = localStorage.getItem("userId");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const submitclicks = sessionStorage.getItem("submitclicks");
  const email = profileData.customerEmail || null;
  const finalMobileNumber = whatsappNumber || mobileNumber || null;

  const [formData, setFormData] = useState({
    askOxyOfers: "LEGALSERVICES",
    userId: userId,
    mobileNumber: finalMobileNumber,
    projectType: "ASKOXY",
  });

  const navigate = useNavigate();

  // Function to handle the load event of the iframe
  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      sessionStorage.setItem("redirectPath", "/main/services/legalservice");
      message.warning("Please login to submit your interest.");
      return;
    }

    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 5);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }

    setIsRoleModalOpen(true); // Show role selection modal
  };

  const showConfirmationModal = (
    isAlreadyInterested: boolean,
    role: string
  ) => {
    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 5);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }
    Modal.confirm({
      title: "Confirm Participation",
      content: `Are you sure you want to participate in the Legal Service offer as ${
        role || "a participant"
      }?`,
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
          "Thank you for showing interest in our *Legal Service* offer!"
        );
        setInterested(true);
        localStorage.setItem("askOxyOfers", formData.askOxyOfers);
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
        "LEGALSERVICES",
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

  useEffect(() => {
    handleLoadOffersAndCheckInterest();
  }, []);

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId) return;

    try {
      const hasInterest = await checkUserInterest(userId, "LEGALSERVICES");
      setInterested(hasInterest.exists);
      if (submitclicks) {
        handleSubmit(hasInterest.exists);
      }
    } catch (error) {
      console.error("Error while fetching offers:", error);
      setInterested(false);
    }
  };

  return (
    <div>
      <div>
        <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
        <header>
          <div className="relative flex flex-col items-center pt-5">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-center leading-tight">
              Legal Knowledge Hub
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6 lg:px-8">
            <button
              className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
              onClick={() => handleSubmit(interested)}
              aria-label="I'm Interested"
              disabled={interested}
            >
              {interested ? "Already Participated" : "I'm Interested"}
            </button>
            <button
              className="bg-[#008CBA] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
              aria-label="Write To Us"
              onClick={handleWriteToUs}
            >
              Write To Us
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-center mt-8 px-4">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
            <img
              src="https://i.ibb.co/1fNpVjbB/Legal-knowledge-hub-9db183177e6a1533ba16.png"
              alt="My Rotarian"
              className="w-full md:w-auto h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-8 space-y-6">
            <div className="text-center md:text-left">
              <strong className="text-[20px] md:text-[24px] text-[#6A1B9A] font-semibold">
                Welcome, Lawyers and Advocates! Elevate Your Legal Practice with
                AskOxy.ai
              </strong>
            </div>
            <div className="space-y-4 text-gray-800">
              <ul className="list-disc pl-6">
                <li>
                  <strong>Enhance Your Professional Presence:</strong> Increase
                  your visibility among individuals seeking legal guidance.
                </li>
                <li>
                  <strong>Share Expertise:</strong> Publish legal insights to
                  educate and establish your authority.
                </li>
                <li>
                  <strong>Collaborate on Legal Publications:</strong> Partner
                  with professionals to create impactful legal content.
                </li>
                <li>
                  <strong>Expand Your Legal Network:</strong> Be part of a
                  vibrant, trusted platform for knowledge sharing and
                  collaboration.
                </li>
              </ul>
              <div className="flex flex-col md:flex-row justify-start gap-4 items-start px-4 mt-8">
                <button
                  className="bg-[#6A1B9A] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#5a1580] text-sm md:text-base lg:text-lg transition duration-300"
                  aria-label="NyayaGpt"
                  onClick={() =>
                    (window.location.href =
                      "/asst_Zhd4SUuUw3c9EWeFvx0YmY0Q/b5a37e56-5070-430a-9740-789d4d9afdf1/nyaya-gpt")
                  }
                >
                  NyayaGpt
                </button>
                <button
                  className="bg-[#FF6B6B] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#ee5a5a] text-sm md:text-base lg:text-lg transition duration-300"
                  aria-label="CelebShield"
                  onClick={() => (window.location.href = "/celebshield")}
                >
                  CelebShield
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center my-14">
          <iframe
            src="https://drive.google.com/file/d/11AI-em7upR9UVcec1mFuxmIPh1Cfx0Ai/preview"
            frameBorder="0"
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full rounded-lg shadow-lg"
            title="PDF Viewer"
            onLoad={handleLoad}
          />
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
                  Choose how you'd like to participate in our LEGALSERVICES
                  offer
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
                        Provide legal services and collaborate
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
                        Seek legal guidance and resources
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
                        Connect legal professionals with clients
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
              <i
                className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-500"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              />
              <h2 className="text-xl font-bold mb-4 text-[#3d2a71]">
                Write To Us
              </h2>
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
                  value={finalMobileNumber || ""}
                  className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                  placeholder="Enter your mobile number"
                  style={{ fontSize: "0.8rem" }}
                />
              </div>
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
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#3d2a71] transition-all text-sm md:text-base lg:text-lg"
                  onClick={handleWriteToUsSubmitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit Query"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Alert Modal */}
        {isprofileOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-[#3d2a71] font-bold">Alert...!</h2>
                <button
                  className="font-bold text-2xl text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() => setIsprofileOpen(false)}
                >
                  ×
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

        {/* Success Modal */}
        {issuccessOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105 text-center">
              <h2 className="text-xl text-green-600 font-bold mb-4">
                Success!
              </h2>
              <p className="text-black mb-6">
                Query submitted successfully...!
              </p>
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
      <Footer />
    </div>
  );
};

export default LegalService;
