import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert

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
  type = 'text',
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
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    city: '',
    pinCode: '',
    organization: '',
    designation: '',
    state: '',
    country: '',
    educationDetailsModelList: [
      {
        graduationType: '',
        qualification: '',
        college: '',
        specification: '',
        marks: 0,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

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
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch user profile.',
        });
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchUserProfile();
  }, []);

  // Validate inputs before form submission
  const validateInputs = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return false;
    }
    if (!/^\d{10}$/.test(userProfile.mobileNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Mobile Number',
        text: 'Mobile number should be 10 digits.',
      });
      return false;
    }
    if (!/^\d{6}$/.test(userProfile.pinCode)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Pin Code',
        text: 'Pin code should be 6 digits.',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await axios.patch(
        'https://meta.oxyloans.com/api/student-service/user/profile/update',
        userProfile
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
      });
    }
  };

  if (isLoading) {
    return <div className="spinner">Loading...</div>; // Loading state (replace with a spinner or animation)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold" style={{ color: 'gray' }}>Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* First Name and Last Name */}
          <InputField
            name="firstName"
            value={userProfile.firstName}
            placeholder="First Name"
            onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
          />
          <InputField
            name="lastName"
            value={userProfile.lastName}
            placeholder="Last Name"
            onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
          />
          {/* Email and Mobile Number */}
          <InputField
            name="email"
            type="email"
            value={userProfile.email}
            placeholder="Email"
            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
          />
          <InputField
            name="mobileNumber"
            type="tel"
            value={userProfile.mobileNumber}
            placeholder="Mobile Number"
            onChange={(e) => setUserProfile({ ...userProfile, mobileNumber: e.target.value })}
          />
          {/* Date of Birth and Address */}
          <InputField
            name="dateOfBirth"
            type="date"
            value={userProfile.dateOfBirth}
            placeholder="Date of Birth"
            onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: e.target.value })}
          />
          <InputField
            name="address"
            value={userProfile.address}
            placeholder="Address"
            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
          />
          {/* City and Pin Code */}
          <InputField
            name="city"
            value={userProfile.city}
            placeholder="City"
            onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
          />
          <InputField
            name="pinCode"
            value={userProfile.pinCode}
            placeholder="Pin Code"
            onChange={(e) => setUserProfile({ ...userProfile, pinCode: e.target.value })}
          />
          {/* Organization and Designation */}
          <InputField
            name="organization"
            value={userProfile.organization}
            placeholder="Organization"
            onChange={(e) => setUserProfile({ ...userProfile, organization: e.target.value })}
          />
          <InputField
            name="designation"
            value={userProfile.designation}
            placeholder="Designation"
            onChange={(e) => setUserProfile({ ...userProfile, designation: e.target.value })}
          />
          {/* State and Country */}
          <InputField
            name="state"
            value={userProfile.state}
            placeholder="State"
            onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
          />
          <InputField
            name="country"
            value={userProfile.country}
            placeholder="Country"
            onChange={(e) => setUserProfile({ ...userProfile, country: e.target.value })}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
