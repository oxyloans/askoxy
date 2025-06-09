import React, { useState, useEffect } from "react";
import { User, Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";

interface EducationDetail {
  college: string;
  graduationType: "Intermediate" | "Graduate" | "Post Graduate";
  marks: number;
  qualification: string;
  specification: string;
  yearOfPassing: string;
}

interface ProfileData {
  address: string;
  bankVerified: boolean;
  city: string;
  consent: boolean;
  country: string;
  designation: string;
  dob: string;
  educationDetailsModelList: EducationDetail[];
  email: string;
  emailVerified: boolean;
  firstName: string;
  gender: "Female" | "Male" | "Other";
  lastName: string;
  message: string;
  mobileNumber: string;
  nationality: string;
  organization: string;
  panVerified: boolean;
  pinCode: string;
  state: string;
  userId: string;
  whatsappVerified: boolean;
}

const StudentProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    address: "",
    bankVerified: false,
    city: "",
    consent: true,
    country: "",
    designation: "",
    dob: "",
    educationDetailsModelList: [{
      college: "",
      graduationType: "Graduate",
      marks: 0,
      qualification: "",
      specification: "",
      yearOfPassing: ""
    }],
    email: "",
    emailVerified: false,
    firstName: "",
    gender: "Male",
    lastName: "",
    message: "",
    mobileNumber: "",
    nationality: "",
    organization: "",
    panVerified: false,
    pinCode: "",
    state: "",
    userId: "",
    whatsappVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Load existing profile data (you might want to fetch this from an API)
  useEffect(() => {
    try {
      // Note: localStorage is not available in Claude artifacts, so this will be simulated
      // In a real environment, this would work normally
      const savedProfile = null; // localStorage.getItem('profileData');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // Ensure educationDetailsModelList exists and is an array
        setProfileData({
          ...parsedProfile,
          educationDetailsModelList: Array.isArray(parsedProfile.educationDetailsModelList) 
            ? parsedProfile.educationDetailsModelList 
            : [{
                college: "",
                graduationType: "Graduate",
                marks: 0,
                qualification: "",
                specification: "",
                yearOfPassing: ""
              }]
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Keep the default state if there's an error
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index: number, field: keyof EducationDetail, value: any) => {
    setProfileData(prev => ({
      ...prev,
      educationDetailsModelList: prev.educationDetailsModelList.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducationDetail = () => {
    setProfileData(prev => ({
      ...prev,
      educationDetailsModelList: [
        ...prev.educationDetailsModelList,
        {
          college: "",
          graduationType: "Graduate",
          marks: 0,
          qualification: "",
          specification: "",
          yearOfPassing: ""
        }
      ]
    }));
  };

  const removeEducationDetail = (index: number) => {
    if (profileData.educationDetailsModelList.length > 1) {
      setProfileData(prev => ({
        ...prev,
        educationDetailsModelList: prev.educationDetailsModelList.filter((_, i) => i !== index)
      }));
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setUpdateStatus({ type: null, message: '' });
    
    try {
      
      const token = null; // localStorage.getItem('authToken');
      
      if (!token) {
        // Simulate successful update for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUpdateStatus({
          type: 'success',
          message: 'Profile updated successfully!'
        });
        return;
      }

      const response = await fetch('https://meta.oxyloans.com/api/student-service/user/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      // localStorage.setItem('profileData', JSON.stringify(result));
    
      setUpdateStatus({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Safety check to ensure educationDetailsModelList is always an array
  const educationList = Array.isArray(profileData.educationDetailsModelList) 
    ? profileData.educationDetailsModelList 
    : [];

  const getVerificationStats = () => {
    const verifications = [
      { name: 'Email', status: profileData.emailVerified },
      { name: 'WhatsApp', status: profileData.whatsappVerified },
      { name: 'Bank', status: profileData.bankVerified },
      { name: 'PAN', status: profileData.panVerified }
    ];
    
    return {
      total: verifications.length,
      verified: verifications.filter(v => v.status).length,
      pending: verifications.filter(v => !v.status).length
    };
  };

  const stats = getVerificationStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              My Profile
            </h3>
            <p className="text-gray-600">
              Manage your personal information and education details
            </p>
          </div>
          <button
            onClick={updateProfile}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? 'Updating...' : 'Update Profile'}</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Verifications</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <div className="text-sm text-green-600">Verified</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-sm text-amber-600">Pending</div>
          </div>
        </div>

        {/* Status Message */}
        {updateStatus.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
            updateStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {updateStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{updateStatus.message}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {`${profileData.firstName} ${profileData.lastName}` || 'Your Name'}
            </h4>
            <p className="text-gray-600 mb-2">{profileData.designation || 'Student'}</p>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                profileData.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                Email {profileData.emailVerified ? 'Verified' : 'Not Verified'}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                profileData.whatsappVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                WhatsApp {profileData.whatsappVerified ? 'Verified' : 'Not Verified'}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                profileData.bankVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                Bank {profileData.bankVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={profileData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={profileData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={profileData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={profileData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Code
            </label>
            <input
              type="text"
              value={profileData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              value={profileData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Professional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={profileData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization
            </label>
            <input
              type="text"
              value={profileData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Education Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">Education Details</h4>
          <button
            onClick={addEducationDetail}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        </div>
        
        <div className="space-y-6">
          {educationList.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-900">Education {index + 1}</h5>
                {educationList.length > 1 && (
                  <button
                    onClick={() => removeEducationDetail(index)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/Institution
                  </label>
                  <input
                    type="text"
                    value={education.college}
                    onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Type
                  </label>
                  <select
                    value={education.graduationType}
                    onChange={(e) => handleEducationChange(index, 'graduationType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={education.qualification}
                    onChange={(e) => handleEducationChange(index, 'qualification', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specification
                  </label>
                  <input
                    type="text"
                    value={education.specification}
                    onChange={(e) => handleEducationChange(index, 'specification', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks/Percentage
                  </label>
                  <input
                    type="number"
                    value={education.marks}
                    onChange={(e) => handleEducationChange(index, 'marks', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Passing
                  </label>
                  <input
                    type="text"
                    value={education.yearOfPassing}
                    onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;