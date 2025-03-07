import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import BASE_URL from "../../Config";

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

const InputField = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => (
  <div className="w-full">
    <label className="text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`border p-2 rounded-md w-full text-gray-900 focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-indigo-500"
      }`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const response = await axios.get<UserProfile>(
          `${BASE_URL}/user-service/getProfile/${userId}`
        );
        setIsLoading(true);
        console.log(response.data);

        setUserProfile(response.data);

        localStorage.setItem("email", response.data.email);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user profile.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const validateInputs = () => {
    let validationErrors: { [key: string]: string } = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!nameRegex.test(userProfile.firstName.trim())) {
      validationErrors.firstName = "First name should only contain letters.";
    }
    if (!nameRegex.test(userProfile.lastName.trim())) {
      validationErrors.lastName = "Last name should only contain letters.";
    }
    if (!nameRegex.test(userProfile.city.trim())) {
      validationErrors.city = "City name should not contain numbers.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const requestPayload = {
      // address: userProfile.address,
      city: userProfile.city,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userId: userId,
      gender: userProfile.gender,
    };

    try {
      await axios.patch(
        `${BASE_URL}/user-service/profile/update`,
        requestPayload
      );

      localStorage.setItem("user", JSON.stringify({ profileCompleted: true }));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile.",
      });
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-xl">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
        Profile Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            name="firstName"
            value={userProfile.firstName}
            placeholder="Enter your first name"
            onChange={(e) =>
              setUserProfile({ ...userProfile, firstName: e.target.value })
            }
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={userProfile.lastName}
            placeholder="Enter your last name"
            onChange={(e) =>
              setUserProfile({ ...userProfile, lastName: e.target.value })
            }
            error={errors.lastName}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={userProfile.email}
            placeholder="Enter your email"
            onChange={(e) =>
              setUserProfile({ ...userProfile, email: e.target.value })
            }
            error={errors.email}
          />
          <InputField
            label="City"
            name="city"
            value={userProfile.city}
            placeholder="Enter your city"
            onChange={(e) =>
              setUserProfile({ ...userProfile, city: e.target.value })
            }
            error={errors.city}
          />
          <InputField
            label="Gender"
            name="gender"
            value={userProfile.gender}
            placeholder="Enter your gender"
            onChange={(e) =>
              setUserProfile({ ...userProfile, gender: e.target.value })
            }
            error={errors.gender}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none transition duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
