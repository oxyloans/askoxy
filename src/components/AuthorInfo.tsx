

import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import {message} from 'antd'

interface AuthorInfoProps {
  name: string;
  location: string;
  email: string;
  icon?: React.ReactNode;
  number: string; // Optional prop for avatar image URL
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ name, location, email,number, icon }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState(name.split(" ")[0] || ""); // Extract first name
  const [updatedLastName, setUpdatedLastName] = useState(name.split(" ")[1] || ""); // Extract last name
  const [updatedLocation, setUpdatedLocation] = useState(location);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const[updateMobileNumber,setUpdateMobileNumber] = useState(number)  
  const popoverRef = useRef<HTMLDivElement>(null);
  

  // Error states
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  // Regular expression to allow only alphabetic characters and spaces
  const nameValidationRegex = /^[A-Za-z\s]*$/;

  // Handler to validate first name input
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Check if the value matches the regex (only alphabets and spaces)
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
    // Check if the value matches the regex (only alphabets and spaces)
    if (nameValidationRegex.test(value)) {
      setUpdatedLastName(value);
      setLastNameError(null); // Clear error if valid
    } else {
      setLastNameError("Last name should only contain letters and spaces.");
    }
  };

  // Regular expression for basic email format validation
  const emailValidationRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

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


  // Toggle information display
  const toggleInfo = () => setShowInfo(!showInfo);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverRef]);

  // Handle profile update
  const handleUpdate = async () => {
   // Basic validation
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
          mobileNumber:updateMobileNumber
        }
      );

      console.log("Profile updated successfully:", response.data);
      localStorage.setItem("email", updatedEmail); // Store email in localStorage 
   // Store mobile number in localStorage  
      message.success('Profile updated successfully');
      setShowModal(false); // Close modal after save
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error('Error updating profile');
     
    }
  };
const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  // Allow only digits and limit to 10 characters
  if (/^\d{0,10}$/.test(value)) {
    setMobileNumber(value);
    setMobileError(""); // Clear error if input is valid
  } else {
    setMobileError("Please enter a valid 10-digit mobile number.");
  }
};

const validateMobileNumber = () => {
  if (mobileNumber.length !== 10) {
    setMobileError("Mobile number must be exactly 10 digits.");
    return false;
  }
  setMobileError(""); // Clear error if validation passes
  return true;
};
  // Ensure the modal fields reflect the correct state when opened
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
        onClick={toggleInfo}
      >
        {isProfileUpdated ? (
          name.charAt(0).toUpperCase()
        ) : (
          <FaUserCircle className="w-8 h-8 text-gray-600" />
        )}
      </span>

      {/* Popover */}
      {showInfo && (
        <div
          ref={popoverRef}
          className="absolute z-20 mt-4 w-72 bg-white border border-gray-200 shadow-lg rounded-lg p-5 transform right-0"
        >
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            {icon ? (
              <FaUserCircle size={40} className="text-gray-500" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            )}
            <div>
              <h4 className="text-xl font-semibold text-gray-800">
                {name || "N/A"}
              </h4>
              <p className="text-sm text-gray-500">
                UserId: {userId?.slice(-5) || "N/A"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-300" />

          {/* Details Section */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-800">Email:</span>
              <span className="text-sm text-gray-600">
                {email || "Not provided"}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-800">Location:</span>
              <span className="text-sm text-gray-600">
                {location || "Not provided"}
              </span>
            </div>
          </div>
          {/* <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-800">
                Mobile Number:
              </span>
              <span className="text-sm text-gray-600">
                {number || "Not provided"}
              </span>
            </div>
           
          </div> */}

          {/* Edit Button */}
          <button
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring focus:ring-indigo-300"
            onClick={() => setShowModal(true)}
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
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
                <label className="block text-black text-sm font-semibold mb-1">
                  Enter Your Mobile Number
                </label>
                <input
                  type="text" // Changed to text for better control over input
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  onBlur={validateMobileNumber}
                  required
                  placeholder="Enter your Mobile Number"
                />
                {mobileError && (
                  <p className="text-red-500 text-sm mt-1">{mobileError}</p>
                )}
              </div>
              <div>
                <label className="block text-black text-sm font-semibold mb-1">
                  Enter Your Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedEmail}
                  onChange={handleEmailChange}
                  required
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-black font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-full text-black placeholder-gray-500"
                  value={updatedLocation}
                  onChange={(e) => setUpdatedLocation(e.target.value)}
                  placeholder="Enter your location"
                />
                {locationError && (
                  <p className="text-red-500 text-sm mt-1">{locationError}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black py-1 px-4 rounded-full text-sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded-full text-sm"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
