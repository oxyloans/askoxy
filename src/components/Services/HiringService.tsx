import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, X } from "lucide-react";
import Footer from "../Footer";
import Header1 from "../Header";
import { message, Modal } from "antd";
import {
  checkUserInterest,
  submitInterest,
  submitWriteToUsQuery,
} from "../servicesapi";

const HiringService: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [interested, setInterested] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const navigate = useNavigate();

  // Memoize values that don't change during component lifecycle
  const { submitclicks, userId, finalMobileNumber, email, formData } =
    useMemo(() => {
      const submitclicks = sessionStorage.getItem("submitclicks");
      const userId = localStorage.getItem("userId");
      const whatsappNumber = localStorage.getItem("whatsappNumber");
      const mobileNumber = localStorage.getItem("mobileNumber");
      const profileData = JSON.parse(
        localStorage.getItem("profileData") || "{}"
      );
      const email = profileData.customerEmail || null;
      const finalMobileNumber = whatsappNumber || mobileNumber || null;

      const formData = {
        askOxyOfers: "WEAREHIRING",
        userId: userId,
        mobileNumber: finalMobileNumber,
        projectType: "ASKOXY",
      };

      return { submitclicks, userId, finalMobileNumber, email, formData };
    }, []); // Empty dependency array since these values shouldn't change

  // Memoized callback to prevent unnecessary re-renders
  const handleLoadOffersAndCheckInterest = useCallback(async () => {
    if (!userId) return;

    try {
      const hasInterest = await checkUserInterest(userId, "WEAREHIRING");
      setInterested(hasInterest);
      if (submitclicks) {
        handleSubmit(hasInterest);
      }
    } catch (error) {
      console.error("Error while fetching offers:", error);
      setInterested(false);
    }
  }, [userId, submitclicks]); // Only depend on userId and submitclicks

  useEffect(() => {
    handleLoadOffersAndCheckInterest();
  }, [handleLoadOffersAndCheckInterest]);

  const handleRoleToggle = useCallback((role: string) => {
    setSelectedRole((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }, []);

  const handleRoleSelection = useCallback(
    (roles: string[]) => {
      if (roles.length > 0) {
        setIsRoleModalOpen(false);
        showConfirmationModal(interested, roles.join(" "));
      }
    },
    [interested]
  );

  const handleSubmit = useCallback(
    (isAlreadyInterested: boolean) => {
      sessionStorage.setItem("submitclicks", "true");

      if (!userId) {
        navigate("/whatsappregister");
        sessionStorage.setItem("redirectPath", "/main/services/we-are-hiring");
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

      setIsRoleModalOpen(true);
    },
    [userId, navigate]
  );

  const showConfirmationModal = useCallback(
    (isAlreadyInterested: boolean, role: string) => {
      if (isAlreadyInterested) {
        message.warning("You have already participated. Thank you!", 5);
        setTimeout(() => {
          sessionStorage.removeItem("submitclicks");
        }, 7000);
        return;
      }
      Modal.confirm({
        title: "Confirm Participation",
        content: `Are you sure you want to participate in the We Are Hiring offer as ${
          role || "a participant"
        }?`,
        okText: "Yes, I'm sure",
        cancelText: "Cancel",
        onOk: () => submitInterestHandler(role),
        onCancel: () => {
          sessionStorage.removeItem("submitclicks");
          setSelectedRole([]);
        },
      });
    },
    []
  );

  const submitInterestHandler = useCallback(
    async (role: string) => {
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
            "Thank you for showing interest in our *We Are Hiring* offer!"
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
    },
    [isButtonDisabled, formData]
  );

  const handleWriteToUs = useCallback(() => {
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
  }, [email, finalMobileNumber]);

  const handlePopUpOk = useCallback(() => {
    setIsProfileOpen(false);
    navigate("/main/profile");
  }, [navigate]);

  const handleWriteToUsSubmitButton = useCallback(async () => {
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
        "WEAREHIRING",
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
      setQueryError("Failed to submit your query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [query, email, finalMobileNumber, userId]);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuery(e.target.value);
      if (e.target.value.trim()) setQueryError(undefined);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
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
              onClick={() => handleSubmit(interested)}
              disabled={interested || isButtonDisabled}
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

      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white text-center p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl text-center font-bold mb-2">
              <span className="text-green-400">Digital Ambassadors</span>
            </h1>
            <p className="text-lg opacity-90">
              Join Our Dynamic Team and Embark on a Digital Journey!
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      {isRoleModalOpen && (
        <>
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
                  Choose how you'd like to participate in our WEAREHIRING offer
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
                        Collaborate on platform development and content creation
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
                        Engage with our platforms and services
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
                        Promote our platforms and earn commissions
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
        </>
      )}

      {/* Write To Us Modal */}
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
                  onChange={handleQueryChange}
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

      {/* Profile Alert Modal */}
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

      {/* Success Modal */}
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