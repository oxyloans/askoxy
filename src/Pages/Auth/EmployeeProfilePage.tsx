import React, { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, "");
    setMobileNumber(value);

    // Clear any previous messages when user is typing
    if (message || error) {
      setMessage("");
      setError("");
    }
  };
const userId = localStorage.getItem("userId") || ""; // Get userId from localStorage
  const updateMobileNumber = async () => {
    // Basic validation
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid mobile number");
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
      <div className="mobile-update-container p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-3">Update Mobile Number</h3>

        <div className="mb-4">
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium mb-1"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            value={mobileNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            disabled={isUpdating}
          />
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        {message && (
          <div className="mb-4 text-green-500 text-sm">{message}</div>
        )}

        <button
          onClick={updateMobileNumber}
          disabled={isUpdating || !mobileNumber}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Mobile Number"}
        </button>
      </div>
    </UserPanelLayout>
  );
};

export default MobileNumberUpdate;
