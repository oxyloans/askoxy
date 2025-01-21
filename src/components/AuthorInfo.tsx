import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { message } from "antd";

interface AuthorInfoProps {
  name: string;
  location: string;
  email: string;
  icon?: React.ReactNode;
  number: string; // Optional prop for avatar image URL
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  name,
  location,
  email,
  number,
  icon,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState(
    name.split(" ")[0] || ""
  ); // Extract first name
  const [updatedLastName, setUpdatedLastName] = useState(
    name.split(" ")[1] || ""
  ); // Extract last name
  const [updatedLocation, setUpdatedLocation] = useState(location);
  const [updatedEmail, setUpdatedEmail] = useState(email);

  // Error states
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Regular expression to allow only alphabetic characters and spaces
  const nameValidationRegex = /^[A-Za-z\s]*$/;

  // Handler to validate first name input
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (nameValidationRegex.test(value)) {
      setUpdatedFirstName(value);
      setFirstNameError(null); // Clear error if valid
    } else {
      setFirstNameError("First name should only contain letters and spaces.");
    }
  };

  // Handler to validate last name input
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (nameValidationRegex.test(value)) {
      setUpdatedLastName(value);
      setLastNameError(null); // Clear error if valid
    } else {
      setLastNameError("Last name should only contain letters and spaces.");
    }
  };

  // Regular expression for basic email format validation
  const emailValidationRegex =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdatedEmail(value);

    // Validate email format
    if (!emailValidationRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null); // Clear error if email is valid
    }
  };

  const userId = localStorage.getItem("userId");

  // Handle profile update
  const handleUpdate = async () => {
    if (!updatedFirstName) {
      setFirstNameError("Please enter your first name.");
      return;
    }

    if (!updatedLastName) {
      setLastNameError("Please enter your last name.");
      return;
    }

    if (!updatedLocation) {
      setLocationError("Please enter your location.");
      return;
    }

    if (!updatedEmail || emailError) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.patch(
        "https://meta.oxyloans.com/api/student-service/user/profile/update",
        {
          userId,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          city: updatedLocation,
          email: updatedEmail,
        }
      );

      console.log("Profile updated successfully:", response.data);
      localStorage.setItem("email", updatedEmail); // Store email in localStorage
      message.success("Profile updated successfully");
      setShowModal(false); // Close modal after save
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error updating profile");
    }
  };

  useEffect(() => {
    if (showModal) {
      setUpdatedFirstName(name.split(" ")[0] || ""); // Extract first name from full name
      setUpdatedLastName(name.split(" ")[1] || ""); // Extract last name from full name
      setUpdatedLocation(location);
      setUpdatedEmail(email);
    }
  }, [showModal, name, location, email]);

  const isProfileUpdated = name && name.trim() !== "";

  return (
    <div className="relative inline-block">
      {/* Avatar or Icon */}
      <span
        className="flex items-center justify-center text-blue-500 cursor-pointer font-semibold h-10 w-10 bg-white rounded-full border border-gray-300 shadow-md"
        onClick={() => setShowModal(true)}
      >
        {isProfileUpdated ? (
          name.charAt(0).toUpperCase()
        ) : (
          <FaUserCircle className="w-8 h-8 text-gray-600" />
        )}
      </span>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-lg text-black font-bold mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-black font-semibold mb-1">
                  Enter your First Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedFirstName}
                  onChange={handleFirstNameChange}
                  placeholder="Enter your first name"
                  required
                />
                {firstNameError && (
                  <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-black font-semibold mb-1">
                  Enter your Last Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedLastName}
                  onChange={handleLastNameChange}
                  placeholder="Enter your last name"
                  required
                />
                {lastNameError && (
                  <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-black font-semibold mb-1">
                  Enter your Location
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedLocation}
                  onChange={(e) => setUpdatedLocation(e.target.value)}
                  placeholder="Enter your location"
                  required
                />
                {locationError && (
                  <p className="text-red-500 text-sm mt-1">{locationError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-black font-semibold mb-1">
                  Enter your Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Update Button */}
              <div className="mt-4 flex space-x-2">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
                <button
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
