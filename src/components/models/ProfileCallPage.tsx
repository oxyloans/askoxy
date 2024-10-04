import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  dateOfBirth: string; // Changed to date for better handling
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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const usedId=localStorage.getItem("userId")
      try {
        const response = await axios.get<UserProfile>(`https://meta.oxyloans.com/api/student-service/user/profile?id=${usedId}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.patch('https://meta.oxyloans.com/api/student-service/user/profile/update', userProfile);
      alert('Profile updated successfully!'); // Show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.'); // Show an error message
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold"  style={{color:'gray'}}>Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* First Name and Last Name */}
          <input
            type="text"
            name="firstName"
            value={userProfile.firstName}
            onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={userProfile.lastName}
            onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Last Name"
          />
          {/* Email and Mobile Number */}
          <input
            type="email"
            name="email"
            value={userProfile.email}
            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Email"
          />
          <input
            type="tel"
            name="mobileNumber"
            value={userProfile.mobileNumber}
            onChange={(e) => setUserProfile({ ...userProfile, mobileNumber: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Mobile Number"
          />
          {/* Date of Birth and Address */}
          <input
            type="date"
            name="dateOfBirth"
            value={userProfile.dateOfBirth}
            onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
          />
          <input
            type="text"
            name="address"
            value={userProfile.address}
            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Address"
          />
          {/* City and Pin Code */}
          <input
            type="text"
            name="city"
            value={userProfile.city}
            onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="City"
          />
          <input
            type="text"
            name="pinCode"
            value={userProfile.pinCode}
            onChange={(e) => setUserProfile({ ...userProfile, pinCode: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Pin Code"
          />
          {/* Organization and Designation */}
          <input
            type="text"
            name="organization"
            value={userProfile.organization}
            onChange={(e) => setUserProfile({ ...userProfile, organization: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Organization"
          />
          <input
            type="text"
            name="designation"
            value={userProfile.designation}
            onChange={(e) => setUserProfile({ ...userProfile, designation: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Designation"
          />
          {/* State and Country */}
          <input
            type="text"
            name="state"
            value={userProfile.state}
            onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="State"
          />
          <input
            type="text"
            name="country"
            value={userProfile.country}
            onChange={(e) => setUserProfile({ ...userProfile, country: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm text-black"
         
            placeholder="Country"
          />
        </div>

  
        <div className="mt-4 flex justify-between">
          {/* <button type="button" onClick={() => setIsEditing(!isEditing)} className="bg-blue-500 text-white py-2 px-4 rounded">
            {isEditing ? 'Cancel' : 'Edit'}
          </button> */}
      
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
              Save Changes
            </button>
   
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
