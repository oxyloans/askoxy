import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumber } from "libphonenumber-js";

interface ProfileFormData {
  userFirstName: string;
  userLastName: string;
  customerEmail: string;
  alterMobileNumber: string;
  customerId: string;
  whatsappNumber: string;
  mobileNumber: string;
}

interface EducationDetail {
  college: string;
  graduationType: "Intermediate" | "UG" | "PG";
  marks: number;
  qualification: string;
  specification: string;
  yearOfPassing: string;
  state: string;
  city: string;
  dob: string;
  homeAddress: string;
}
interface ProfileProps {
  onNavigate?: (tab: string) => void;
}

interface StudentEduInfo {
  city: string;
  college: string;
  dob: string;
  graduationType: "Intermediate" | "UG" | "PG";
  homeAddress: string;
  marks: number;
  qualification: string;
  specification: string;
  state: string;
  userId: string;
  yearOfPassing: string;
}

const BASE_URL = "https://meta.oxyloans.com/api";

const StudentProfile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { university, universityId, courseName } = location.state || {};

  const [formData, setFormData] = useState<ProfileFormData>({
    userFirstName: "",
    userLastName: "",
    customerEmail: "",
    alterMobileNumber: "",
    customerId: "",
    whatsappNumber: "",
    mobileNumber: "",
  });

  const [educationDetails, setEducationDetails] = useState<EducationDetail[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [isValidationPopupOpen, setIsValidationPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [profileSaved, setProfileSaved] = useState<boolean | null>(null);
  const [showWhatsappVerificationModal, setShowWhatsappVerificationModal] = useState(false);
  const [whatsappVerificationCode, setWhatsappVerificationCode] = useState("");
  const [whatsappOtpSession, setWhatsappOtpSession] = useState("");
  const [salt, setSalt] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  
  // Get auth details once and memoize them
  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";
  const loginMethod = localStorage.getItem("loginMethod") || "";
  const isFromWhatsApp = loginMethod === "whatsapp";
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [isMobileNumberVerified, setIsMobileNumberVerified] = useState(false);

  // Add state to track if initial load is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const retryAxiosGet = async (url: string, config: any, retries = 2, delay = 1000): Promise<any> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await axios.get(url, config);
      } catch (err: any) {
        if (attempt === retries) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log(`Retrying ${url} (attempt ${attempt + 1}/${retries})`);
      }
    }
  };

  const fetchProfileData = useCallback(async () => {
    try {
      setLoadingProfile(true);
      setError("");
      console.log("Fetching profile with customerId:", customerId);
      
      const headers = { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      let response;
      try {
        console.log("Trying primary endpoint:", `${BASE_URL}/user-service/customerProfileDetails/${customerId}`);
        response = await retryAxiosGet(
          `${BASE_URL}/user-service/customerProfileDetails/${customerId}`,
          { headers }
        );
      } catch (primaryError: any) {
        console.log("Primary endpoint failed, trying alternative...", primaryError.message);
        response = await retryAxiosGet(
          `${BASE_URL}/user-service/customerProfileDetails`,
          { params: { customerId }, headers }
        );
      }

      console.log("Profile API response:", response.data);
      const data = response.data?.data || response.data;

      if (!data) {
        console.log("No profile data found");
        setEditStatus(false);
        setProfileSaved(false);
        setError("No profile data found. Please create your profile");
        return;
      }

      const mappedProfileData: ProfileFormData = {
        userFirstName: data.firstName || data.firstname || data.userFirstName || "",
        userLastName: data.lastName || data.lastname || data.userLastName || "",
        customerEmail: data.email || data.customerEmail || "",
        alterMobileNumber: data.alterMobileNumber || data.alternateMobileNumber || data.alternateNumber || "",
        whatsappNumber: data.whatsappNumber || data.whatsAppNumber || "",
        mobileNumber: data.mobileNumber || data.mobile || "",
        customerId: customerId,
      };

      setFormData(mappedProfileData);
      const isComplete = Boolean(
        mappedProfileData.userFirstName &&
        mappedProfileData.userLastName &&
        mappedProfileData.customerEmail
      );
      
      setEditStatus(isComplete);
      setProfileSaved(isComplete);
      setIsWhatsappVerified(Boolean(data.whatsappVerified || data.isWhatsappVerified));
      setIsMobileNumberVerified(Boolean(data.mobileVerified || data.isMobileVerified));
      
      console.log("Updated formData:", mappedProfileData);
      console.log("Profile complete:", isComplete);
      
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      let errorMessage = "Error fetching profile data";

      
      console.error("Profile fetch error details:", errorMessage);
      setError(errorMessage);
      setProfileSaved(false);
    } finally {
      setLoadingProfile(false);
    }
  }, [customerId, token, navigate, location.pathname]);

  const fetchEducationData = useCallback(async () => {
    try {
      setLoadingEducation(true);
      setError("");
      console.log("Fetching education with userId:", customerId);
      
      const headers = { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      let educationResponse;
      try {
        console.log("Trying primary education endpoint:", `${BASE_URL}/user-service/student/education-details/${customerId}`);
        educationResponse = await retryAxiosGet(
          `${BASE_URL}/user-service/student/education-details/${customerId}`,
          { headers }
        );
      } catch (primaryError: any) {
        console.log("Primary education endpoint failed, trying alternatives...", primaryError.message);
        try {
          educationResponse = await retryAxiosGet(
            `${BASE_URL}/user-service/student/education/${customerId}`,
            { headers }
          );
        } catch (secondaryError: any) {
          console.log("Secondary education endpoint failed, trying third...", secondaryError.message);
          educationResponse = await retryAxiosGet(
            `${BASE_URL}/user-service/student/education-details`,
            { params: { userId: customerId }, headers }
          );
        }
      }

      console.log("Education API response:", educationResponse.data);
      const educationData = educationResponse.data?.data || educationResponse.data || [];

      if (Array.isArray(educationData) && educationData.length > 0) {
        const mappedEducationData: EducationDetail[] = educationData.map((edu: any) => ({
          city: edu.city || "",
          college: edu.college || edu.institution || edu.collegeName || "",
          dob: edu.dob || edu.dateOfBirth || "",
          graduationType: (edu.graduationType || edu.degree || "UG") as "Intermediate" | "UG" | "PG",
          homeAddress: edu.homeAddress || edu.address || "",
          marks: Number(edu.marks || edu.percentage || edu.cgpa || 0),
          qualification: edu.qualification || edu.degree || "",
          specification: edu.specification || edu.specialization || edu.branch || "",
          state: edu.state || "",
          yearOfPassing: edu.yearOfPassing || edu.passingYear || "",
        }));
        
        setEducationDetails(mappedEducationData);
        console.log("Updated educationDetails:", mappedEducationData);
      } else {
        console.log("No education data found, setting default");
        setEducationDetails([{
          city: "",
          college: "",
          dob: "",
          graduationType: "UG",
          homeAddress: "",
          marks: 0,
          qualification: "",
          specification: "",
          state: "",
          yearOfPassing: "",
        }]);
      }
    } catch (error: any) {
      console.error("Education fetch error:", error);
      let errorMessage = "Error fetching education data";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = "Session expired. Please log in again";
            navigate("/login", { state: { from: location.pathname } });
            break;
          case 403:
            errorMessage = "Access denied. Please check your permissions";
            break;
          case 404:
            console.log("No education data found (404), setting default");
            errorMessage = "";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = responseData?.message || `Error ${status}: ${responseData?.error || "Unknown error"}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection";
      }
      
      if (errorMessage) {
        console.error("Education fetch error details:", errorMessage);
        setError(errorMessage);
      }
      
      // Always set default education data if fetch fails
      setEducationDetails([{
        city: "",
        college: "",
        dob: "",
        graduationType: "UG",
        homeAddress: "",
        marks: 0,
        qualification: "",
        specification: "",
        state: "",
        yearOfPassing: "",
      }]);
    } finally {
      setLoadingEducation(false);
    }
  }, [customerId, token, navigate, location.pathname]);

  // Initialize phone number data based on login method
  useEffect(() => {
    if (isFromWhatsApp) {
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: whatsappNumber.trim(),
        mobileNumber: "",
      }));
    } else {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData((prev) => ({
        ...prev,
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: "",
      }));
    }
  }, [isFromWhatsApp, loginMethod]);

  // Parse phone number and set country code
  useEffect(() => {
    const phoneNumber = formData.mobileNumber || formData.whatsappNumber;
    if (phoneNumber) {
      try {
        const phoneNumberObj = parsePhoneNumber(phoneNumber, "IN");
        const detectedCountryCode = phoneNumberObj?.countryCallingCode
          ? `+${phoneNumberObj.countryCallingCode}`
          : "+91";
        setCountryCode(detectedCountryCode);
        setIsMethodDisabled(true);
      } catch (error) {
        console.error("Error parsing phone number", error);
        setCountryCode("+91");
        setIsMethodDisabled(false);
      }
    } else {
      setCountryCode("+91");
      setIsMethodDisabled(false);
    }
  }, [formData.mobileNumber, formData.whatsappNumber]);

  // MAIN EFFECT: Fetch data when component mounts or credentials change
  useEffect(() => {
    const initializeData = async () => {
      console.log("Initializing data...", { customerId, token: !!token, initialLoadComplete });

      if (initialLoadComplete) {
        console.log("Initial load already complete, skipping");
        return;
      }

      try {
        setLoadingProfile(true);
        setLoadingEducation(true);
        
        // Fetch both profile and education data
        console.log("Starting parallel fetch of profile and education data");
        await Promise.allSettled([
          fetchProfileData(),
          fetchEducationData()
        ]);
        
        setInitialLoadComplete(true);
        console.log("Initial data load completed");
      } catch (error) {
        console.error("Error during initial data load:", error);
      }
    };

    initializeData();
  }, [customerId, token]); // Only depend on credentials

  // Add a separate effect to handle retries if needed
  useEffect(() => {
    const handleRetry = () => {
      if (customerId && token && !loadingProfile && !loadingEducation && !initialLoadComplete) {
        console.log("Retrying data fetch after delay");
        setTimeout(() => {
          fetchProfileData();
          fetchEducationData();
        }, 1000);
      }
    };

    handleRetry();
  }, [customerId, token, loadingProfile, loadingEducation, initialLoadComplete, fetchProfileData, fetchEducationData]);

  const validateProfileForm = () => {
    return (
      formData.userFirstName.trim() &&
      formData.userLastName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail) &&
      (formData.mobileNumber.trim() || formData.whatsappNumber.trim())
    );
  };

  const validateEducationForm = () => {
    return educationDetails.every(
      (edu) =>
        edu.college.trim() &&
        edu.qualification.trim() &&
        edu.specification.trim() &&
        /^[0-9]{4}$/.test(edu.yearOfPassing) &&
        edu.marks > 0 &&
        edu.marks <= 100 &&
        edu.city.trim() &&
        edu.state.trim() &&
        edu.dob &&
        edu.homeAddress.trim()
    );
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationDetail,
    value: any
  ) => {
    setEducationDetails((prev) =>
      prev.map((edu, i) =>
        i === index
          ? { ...edu, [field]: typeof value === "string" ? value.trim() : value }
          : edu
      )
    );
  };

  const addEducationDetail = () => {
    setEducationDetails((prev) => [
      ...prev,
      {
        college: "",
        graduationType: "UG",
        marks: 0,
        qualification: "",
        specification: "",
        yearOfPassing: "",
        state: "",
        city: "",
        dob: "",
        homeAddress: "",
      },
    ]);
  };

  const removeEducationDetail = (index: number) => {
    if (educationDetails.length > 1) {
      setEducationDetails((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const sendWhatsappOTP = async () => {
    try {
      setLoadingProfile(true);
      if (!formData.whatsappNumber) {
        setError("Please enter WhatsApp number");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber.replace(countryCode, "").trim(),
          countryCode,
          id: customerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.whatsappOtpSession && response.data?.salt) {
        setSalt(response.data.salt);
        setWhatsappOtpSession(response.data.whatsappOtpSession);
        setSuccessMessage("OTP sent to your WhatsApp number");
        setTimeout(() => setShowWhatsappVerificationModal(true), 1000);
      } else {
        setError("This WhatsApp number is already in use");
      }
    } catch (error: any) {
      console.error("WhatsApp OTP error:", error);
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleWhatsappVerification = async () => {
    try {
      setLoadingProfile(true);
      if (!whatsappVerificationCode.trim()) {
        setError("Please enter the verification code");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber.replace(countryCode, "").trim(),
          countryCode,
          id: customerId,
          whatsappOtp: whatsappVerificationCode.trim(),
          whatsappOtpSession,
          salt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setIsWhatsappVerified(true);
        setShowWhatsappVerificationModal(false);
        setWhatsappVerificationCode("");
        setSuccessMessage("WhatsApp number verified successfully!");
        await handleSaveProfile();
      } else {
        setError("Invalid verification code");
      }
    } catch (error: any) {
      console.error("WhatsApp verification error:", error);
      setError(error.response?.data?.message || "Failed to verify WhatsApp number");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Add success handler that can navigate to other pages
  const handleSuccessfulSave = async (type: 'profile' | 'education') => {
    if (type === 'profile') {
      setSuccessMessage("Profile updated successfully!");
      setEditStatus(true);
      setProfileSaved(true);
      localStorage.setItem("profileData", JSON.stringify(formData));
      await fetchProfileData();
    } else {
      setSuccessMessage("Education details updated successfully!");
      await fetchEducationData();
    }

    // Show suggestion to complete other sections
    setTimeout(() => {
      const hasDocuments = localStorage.getItem('hasDocuments') === 'true';
      const hasTestScores = localStorage.getItem('hasTestScores') === 'true';
      
      if (!hasDocuments) {
        setSuccessMessage(prev => prev + " Next, upload your documents!");
      } else if (!hasTestScores) {
        setSuccessMessage(prev => prev + " Don't forget to add your test scores!");
      }
    }, 2000);
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      setIsValidationPopupOpen(true);
      return;
    }

    try {
      setLoadingProfile(true);
      const payload = {
        ...formData,
        whatsappNumber: formData.whatsappNumber.trim(),
        mobileNumber: formData.mobileNumber.replace(countryCode, "").trim(),
        customerId: customerId || "0",
        
      };

      console.log("Saving profile with payload:", payload);

      await axios.patch(`${BASE_URL}/user-service/profileUpdate`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof window !== "undefined" && window.gtag) {
        const updatedFields = Object.entries(payload)
          .filter(([_, value]) => value !== "")
          .map(([key]) => key);
        window.gtag("event", "profile_update", {
          method: "form_submission",
          fields_updated: updatedFields.join(","),
        });
      }

      setSuccessMessage("Profile updated successfully!");
      setEditStatus(true);
      setProfileSaved(true);
      localStorage.setItem("profileData", JSON.stringify(payload));
      await fetchProfileData();
       await handleSuccessfulSave('profile');
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveEducation = async () => {
    if (!validateEducationForm()) {
      setIsValidationPopupOpen(true);
      return;
    }

    try {
      setLoadingEducation(true);
      console.log("Saving education details for userId:", customerId);

      for (const education of educationDetails) {
        const eduPayload: StudentEduInfo = {
          city: education.city.trim(),
          college: education.college.trim(),
          dob: education.dob,
          graduationType: education.graduationType,
          homeAddress: education.homeAddress.trim(),
          marks: education.marks,
          qualification: education.qualification.trim(),
          specification: education.specification.trim(),
          state: education.state.trim(),
          userId: customerId,
          yearOfPassing: education.yearOfPassing.trim(),
        };

        console.log("Education payload:", eduPayload);

        await axios.patch(
          `${BASE_URL}/user-service/student/student-EduInfo`,
          eduPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSuccessMessage("Education details updated successfully!");
      await fetchEducationData();
      await handleSuccessfulSave('education');
    } catch (err: any) {
      console.error("Error updating education details:", err);
      setError(
        err.response?.data?.message || "Error updating education details"
      );
    } finally {
      setLoadingEducation(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);


  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {university ? `Application to ${university}` : "My Profile"}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {university
                ? `Complete your profile to apply for ${courseName}`
                : "Manage your personal information and education details"}
            </p>
          </div>
        </div>

        {profileSaved !== null && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              profileSaved
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">
              {profileSaved
                ? "Profile is saved for this user"
                : "No profile found. Please save your profile."}
            </span>
          </div>
        )}

        {(successMessage || error) && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              successMessage
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {successMessage ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{successMessage || error}</span>
          </div>
        )}

        {isValidationPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Validation Error
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Please fill all required fields correctly.
              </p>
              <button
                onClick={() => setIsValidationPopupOpen(false)}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showWhatsappVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Verify WhatsApp Number
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Enter the OTP sent to your WhatsApp number.
              </p>
              <input
                type="text"
                value={whatsappVerificationCode}
                onChange={(e) => setWhatsappVerificationCode(e.target.value.trim())}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent mb-4"
                placeholder="Enter OTP"
                maxLength={6}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowWhatsappVerificationModal(false);
                    setWhatsappVerificationCode("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWhatsappVerification}
                  disabled={loadingProfile || !whatsappVerificationCode}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProfile ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 sm:space-x-6 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
           <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {formData.userFirstName || formData.userLastName
                ? `${formData.userFirstName} ${formData.userLastName}`.trim()
                : "Student Profile"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              {formData.customerEmail || "Complete your profile information"}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.userFirstName}
                onChange={(e) => handleInputChange("userFirstName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.userLastName}
                onChange={(e) => handleInputChange("userLastName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Mobile Number
              </label>
              <input
                type="tel"
                value={formData.alterMobileNumber}
                onChange={(e) => handleInputChange("alterMobileNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter alternate mobile number"
              />
            </div>
            
            {/* Mobile Number Field */}
            {!isFromWhatsApp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                  {isMobileNumberVerified && (
                    <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                  )}
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Enter your mobile number"
                  disabled={isMethodDisabled}
                  required
                />
              </div>
            )}

            {/* WhatsApp Number Field */}
            {isFromWhatsApp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                  {isWhatsappVerified && (
                    <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                  )}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter your WhatsApp number"
                    disabled={isMethodDisabled}
                    required
                  />
                  {!isWhatsappVerified && formData.whatsappNumber && (
                    <button
                      onClick={sendWhatsappOTP}
                      disabled={loadingProfile}
                      className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingProfile ? "Sending..." : "Verify"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education Details Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Education Details
            </h3>
            <button
              onClick={addEducationDetail}
              className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          </div>

          {educationDetails.map((education, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Education {index + 1}
                </h4>
                {educationDetails.length > 1 && (
                  <button
                    onClick={() => removeEducationDetail(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/Institution *
                  </label>
                  <input
                    type="text"
                    value={education.college}
                    onChange={(e) => handleEducationChange(index, "college", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter college name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Type *
                  </label>
                  <select
                    value={education.graduationType}
                    onChange={(e) => handleEducationChange(index, "graduationType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="UG">Undergraduate</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    value={education.qualification}
                    onChange={(e) => handleEducationChange(index, "qualification", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., B.Tech, MBA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={education.specification}
                    onChange={(e) => handleEducationChange(index, "specification", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Passing *
                  </label>
                  <input
                    type="text"
                    value={education.yearOfPassing}
                    onChange={(e) => handleEducationChange(index, "yearOfPassing", e.target.value)}
                    pattern="[0-9]{4}"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., 2023"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks/Percentage *
                  </label>
                  <input
                    type="number"
                    value={education.marks || ""}
                    onChange={(e) => handleEducationChange(index, "marks", Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter marks/percentage"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={education.state}
                    onChange={(e) => handleEducationChange(index, "state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={education.city}
                    onChange={(e) => handleEducationChange(index, "city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={education.dob}
                    onChange={(e) => handleEducationChange(index, "dob", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Address *
                  </label>
                  <textarea
                    value={education.homeAddress}
                    onChange={(e) => handleEducationChange(index, "homeAddress", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter complete home address"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
    <button
      onClick={handleSaveProfile}
      disabled={loadingProfile}
      className="flex items-center justify-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingProfile ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Save className="w-5 h-5" />
      )}
      <span>{loadingProfile ? "Saving..." : "Save Profile"}</span>
    </button>

    <button
      onClick={handleSaveEducation}
      disabled={loadingEducation}
      className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingEducation ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Save className="w-5 h-5" />
      )}
      <span>{loadingEducation ? "Saving..." : "Save Education"}</span>
    </button>

    {/* Quick Navigation Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
      <button
        onClick={() => onNavigate?.('documents')}
        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
      >
        Upload Documents
      </button>
      <button
        onClick={() => onNavigate?.('TestScores')}
        className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
      >
        Add Test Scores
      </button>
    </div>
  </div>

      </div>
    </div>
  );
};

export default StudentProfile;