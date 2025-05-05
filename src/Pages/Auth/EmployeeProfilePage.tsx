import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../Config";
import UserPanelLayout from "./UserPanelLayout";

interface MobileNumberUpdateProps {
  currentMobileNumber?: string;
  onUpdateSuccess?: () => void;
  onUpdateError?: (error: any) => void;
}

const MobileNumberUpdate: React.FC<MobileNumberUpdateProps> = ({
  currentMobileNumber = "",
  onUpdateSuccess,
  onUpdateError,
}) => {
  const [mobileNumber, setMobileNumber] = useState(currentMobileNumber);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const userId = localStorage.getItem("userId") || "";

  // Clear success message after delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (message) {
      setShowToast(true);
      timer = setTimeout(() => {
        setShowToast(false);
        setTimeout(() => {
          setMessage("");
        }, 300); // Additional delay after animation completes
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, "");
    setMobileNumber(value);

    // Clear any previous messages when user is typing
    if (message || error) {
      setMessage("");
      setError("");
      setShowToast(false);
    }
  };

  const updateMobileNumber = async () => {
    // Basic validation
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsUpdating(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.patch(
        `${BASE_URL}/user-service/users/${userId}/empMobile`,
        null, // No request body needed since we're using query params
        {
          params: {
            mobileNumber: mobileNumber,
          },
        }
      );

      if (response.data) {
        setMessage("Mobile number updated successfully");
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update mobile number";
      setError(errorMessage);
      if (onUpdateError) {
        onUpdateError(err);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <UserPanelLayout>
      <div className="max-w-md mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Update Mobile Number
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please enter your new 10-digit mobile number
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mobile Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    disabled={isUpdating}
                    autoComplete="tel-national"
                  />
                </div>
                {mobileNumber &&
                  mobileNumber.length > 0 &&
                  mobileNumber.length < 10 && (
                    <p className="mt-2 text-xs text-amber-600">
                      Please enter all 10 digits of your mobile number
                    </p>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  onClick={updateMobileNumber}
                  disabled={
                    isUpdating || !mobileNumber || mobileNumber.length < 10
                  }
                  className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex justify-center items-center"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Updating...
                    </>
                  ) : (
                    "Update Mobile Number"
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileNumber(currentMobileNumber);
                    setError("");
                    setMessage("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 text-sm font-medium"
                  disabled={isUpdating}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Messages - Now at Top Center */}
        {error && (
          <div className="fixed top-4 left-0 right-0 mx-auto w-full max-w-sm bg-red-50 border border-red-300 p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in z-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError("")}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {message && showToast && (
          <div className="fixed top-4 left-0 right-0 mx-auto w-full max-w-sm bg-green-50 border border-green-300 p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in z-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-700">{message}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => {
                      setShowToast(false);
                      setTimeout(() => setMessage(""), 300);
                    }}
                    className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
};

// Add keyframe animations for toast notifications
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-fade-out {
    animation: fadeOut 0.3s ease-in forwards;
  }
  
  /* Additional responsive styles */
  @media (max-width: 640px) {
    input[type="tel"] {
      font-size: 16px; /* Prevent iOS zoom on input focus */
      height: 48px; /* Larger touch target */
    }
    
    button {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }
`;
document.head.appendChild(styles);

export default MobileNumberUpdate;
