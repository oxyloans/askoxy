import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Define types for EducationDetails and UserProfile
interface EducationDetail {
  graduationType: string;
  qualification: string;
  college: string;
  specification: string;
  marks: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  city: string;
  pinCode: string;
  organization: string;
  designation: string;
  state: string;
  country: string;
  educationDetailsModelList: EducationDetail[];
}

// Reusable InputField Component
const InputField = ({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    className="border border-gray-300 rounded-md p-2 text-sm text-black w-full focus:outline-none focus:border-indigo-500"
    placeholder={placeholder}
  />
);

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    city: "",
    pinCode: "",
    organization: "",
    designation: "",
    state: "",
    country: "",
    educationDetailsModelList: [
      {
        graduationType: "",
        qualification: "",
        college: "",
        specification: "",
        marks: 0,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [emailError, setEmailError] = useState<string>(""); // Email error state
  const [firstNameError, setFirstNameError] = useState<string>(""); // First name error state
  const [lastNameError, setLastNameError] = useState<string>(""); // Last name error state
  const [cityError, setCityError] = useState<string>(""); // City error state
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      try {
        const response = await axios.get<UserProfile>(
          `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`
        );

        setUserProfile(response.data);
        localStorage.setItem("email", response.data.email); // Store email in localStorage
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user profile.",
        });
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchUserProfile();
  }, []);

  // Validate inputs before form submission
  const validateInputs = () => {
    let isValid = true;

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(""); // Clear the error if valid
    }

    // Regular expression for name validation
    const nameRegex = /^[a-zA-Z\s]+$/;

    // Validate first name
    if (!nameRegex.test(userProfile.firstName)) {
      setFirstNameError(
        "First name should not contain numbers or special characters."
      );
      isValid = false;
    } else {
      setFirstNameError(""); // Clear the error if valid
    }

    // Validate last name
    if (!nameRegex.test(userProfile.lastName)) {
      setLastNameError(
        "Last name should not contain numbers or special characters."
      );
      isValid = false;
    } else {
      setLastNameError(""); // Clear the error if valid
    }

    // Validate city
    if (!nameRegex.test(userProfile.city)) {
      setCityError("City should not contain numbers or special characters.");
      isValid = false;
    } else {
      setCityError(""); // Clear the error if valid
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await axios.patch(
        "https://meta.oxyloans.com/api/student-service/user/profile/update",
        userProfile
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="spinner">Loading...</div>; // Loading state (replace with a spinner or animation)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold" style={{ color: "gray" }}>
        Profile Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label>Please Enter Your First Name:</label>
            <InputField
              name="firstName"
              value={userProfile.firstName}
              placeholder="First Name"
              onChange={(e) =>
                setUserProfile({ ...userProfile, firstName: e.target.value })
              }
            />
            {firstNameError && (
              <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
            )}
          </div>
          <div>
            <label>Please Enter Your Last Name:</label>
            <InputField
              name="lastName"
              value={userProfile.lastName}
              placeholder="Last Name"
              onChange={(e) =>
                setUserProfile({ ...userProfile, lastName: e.target.value })
              }
            />
            {lastNameError && (
              <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
            )}
          </div>
          <div>
            <label>Please Enter Your Email:</label>
            <InputField
              name="email"
              type="email"
              value={userProfile.email}
              placeholder="Email"
              onChange={(e) =>
                setUserProfile({ ...userProfile, email: e.target.value })
              }
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label>Please Enter Your City:</label>
            <InputField
              name="city"
              value={userProfile.city}
              placeholder="City"
              onChange={(e) =>
                setUserProfile({ ...userProfile, city: e.target.value })
              }
            />
            {cityError && (
              <p className="text-red-500 text-sm mt-1">{cityError}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
