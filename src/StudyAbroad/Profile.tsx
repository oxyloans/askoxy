import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  X,
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

// Indian States
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Andaman and Nicobar Islands"
];

// Popular Colleges/Universities
const POPULAR_COLLEGES = [
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Madras",
  "Indian Institute of Technology (IIT) Kanpur",
  "Indian Institute of Technology (IIT) Kharagpur",
  "Indian Institute of Science (IISc) Bangalore",
  "Jawaharlal Nehru University (JNU)",
  "University of Delhi",
  "Banaras Hindu University (BHU)",
  "Aligarh Muslim University (AMU)",
  "Jadavpur University",
  "Anna University",
  "Osmania University",
  "University of Hyderabad",
  "Jamia Millia Islamia",
  "BITS Pilani",
  "VIT University",
  "SRM Institute of Science and Technology",
  "Manipal Academy of Higher Education",
  "Amity University"
];

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
  
  // New state for edit modes
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  
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
      const isComplete = Boolean(mappedProfileData.userFirstName);
      
      setEditStatus(isComplete);
      setProfileSaved(isComplete);
      // Updated to match the API response field name
      setIsWhatsappVerified(Boolean(data.whatsappVerified || data.isWhatsappVerified));
      setIsMobileNumberVerified(Boolean(data.mobileVerified || data.isMobileVerified));
      
      console.log("Updated formData:", mappedProfileData);
      console.log("Profile complete:", isComplete);
      console.log("WhatsApp verified:", data.whatsappVerified);
      
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
        whatsappNumber: whatsappNumber,
        mobileNumber: "",
      }));
    } else {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData((prev) => ({
        ...prev,
        mobileNumber: mobileNumber,
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
  }, [customerId, token]);

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

  // SIMPLIFIED: Only validate first name as mandatory
  const validateProfileForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Only first name validation
    if (!formData.userFirstName.trim()) {
      errors.push("First name is required");
    }

    return { isValid: errors.length === 0, errors };
  };

  // REMOVED: Education validation - accept any values
  const validateEducationForm = (): { isValid: boolean; errors: string[] } => {
    // No validation - always return valid
    return { isValid: true, errors: [] };
  };

  // Handle input change without trimming during typing
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
          ? { ...edu, [field]: value }
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
      // If we're editing this item, close the edit mode
      if (editingEducationIndex === index) {
        setEditingEducationIndex(null);
      }
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
      setIsEditingProfile(false);
      localStorage.setItem("profileData", JSON.stringify(formData));
      await fetchProfileData();
    } else {
      setSuccessMessage("Education details updated successfully!");
      setEditingEducationIndex(null);
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
    const validation = validateProfileForm();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsValidationPopupOpen(true);
      return;
    }

    try {
      setLoadingProfile(true);
      const payload = {
        ...formData,
        userFirstName: formData.userFirstName.trim(),
        userLastName: formData.userLastName.trim(),
        customerEmail: formData.customerEmail.trim(),
        alterMobileNumber: formData.alterMobileNumber.trim(),
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

      await handleSuccessfulSave('profile');
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveEducation = async (index?: number) => {
    const validation = validateEducationForm();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsValidationPopupOpen(true);
      return;
    }

    try {
      setLoadingEducation(true);
      console.log("Saving education details for userId:", customerId);

      // If index is provided, save only that education detail
      const educationsToSave = index !== undefined ? [educationDetails[index]] : educationDetails;

      for (const education of educationsToSave) {
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
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {university ? `Application to ${university}` : "My Profile"}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {university? `Complete your application for ${courseName} at ${university}`
          : "Please complete your profile details to proceed"
            }
          </p>
          </div>
          
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
          
          {profileSaved && (
            <div className="flex items-center mt-2 sm:mt-0">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-600 font-medium">Profile Complete</span>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 mb-2">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 mb-2">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Header with Edit Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            {isEditingProfile ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-1" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.userFirstName}
                onChange={(e) => handleInputChange("userFirstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Enter your first name"
                disabled={loadingProfile || !isEditingProfile}
              />
            </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.userLastName}
                onChange={(e) => handleInputChange("userLastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Enter your last name"
                disabled={loadingProfile || !isEditingProfile}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Enter your email address"
                disabled={loadingProfile || !isEditingProfile}
              />
            </div>

          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled={isMethodDisabled || loadingProfile || !isEditingProfile}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="Enter mobile number"
                  disabled={isMethodDisabled || loadingProfile || !isEditingProfile}
                />
                {isMobileNumberVerified && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2 mt-2" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Mobile Number
              </label>
              <input
                type="tel"
                value={formData.alterMobileNumber}
                onChange={(e) => handleInputChange("alterMobileNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Enter alternate mobile number"
                disabled={loadingProfile || !isEditingProfile}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled={isMethodDisabled || loadingProfile || !isEditingProfile}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="Enter WhatsApp number"
                  disabled={isMethodDisabled || loadingProfile || !isEditingProfile}
                />
                {!isWhatsappVerified && formData.whatsappNumber && isEditingProfile && (
                  <button
                    onClick={sendWhatsappOTP}
                    className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    disabled={loadingProfile}
                  >
                    Verify
                  </button>
                )}
                {isWhatsappVerified && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2 mt-2" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        {isEditingProfile && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={loadingProfile}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loadingProfile ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* Education Details Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-800">Education Details</h4>
          <button
            onClick={addEducationDetail}
            className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Education
          </button>
        </div>

        {loadingEducation ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading education details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {educationDetails.map((education, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-md font-medium text-gray-700">
                    Education {index + 1}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingEducationIndex(editingEducationIndex === index ? null : index)}
                      className="flex items-center px-2 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      {editingEducationIndex === index ? (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </>
                      )}
                    </button>
                    {/* {educationDetails.length > 1 && (
                      <button
                        onClick={() => removeEducationDetail(index)}
                        className="flex items-center px-2 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    )} */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College/Institution
                    </label>
                    <input
                      type="text"
                      list={`colleges-${index}`}
                      value={education.college}
                      onChange={(e) => handleEducationChange(index, "college", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="Enter college name"
                      disabled={editingEducationIndex !== index}
                    />
                    <datalist id={`colleges-${index}`}>
                      {POPULAR_COLLEGES.map((college) => (
                        <option key={college} value={college} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Type
                    </label>
                    <select
                      value={education.graduationType}
                      onChange={(e) => handleEducationChange(index, "graduationType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      disabled={editingEducationIndex !== index}
                    >
                      <option value="Intermediate">Intermediate</option>
                      <option value="UG">Undergraduate</option>
                      <option value="PG">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={education.qualification}
                      onChange={(e) => handleEducationChange(index, "qualification", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="e.g., B.Tech, M.Tech, MBA"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={education.specification}
                      onChange={(e) => handleEducationChange(index, "specification", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="e.g., Computer Science, Mechanical"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks/Percentage
                    </label>
                    <input
                      type="number"
                      value={education.marks}
                      onChange={(e) => handleEducationChange(index, "marks", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="Enter marks/percentage"
                      min="0"
                      max="100"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Passing
                    </label>
                    <input
                      type="text"
                      value={education.yearOfPassing}
                      onChange={(e) => handleEducationChange(index, "yearOfPassing", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="e.g., 2023"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      value={education.state}
                      onChange={(e) => handleEducationChange(index, "state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      disabled={editingEducationIndex !== index}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={education.city}
                      onChange={(e) => handleEducationChange(index, "city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="Enter city"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={education.dob}
                      onChange={(e) => handleEducationChange(index, "dob", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      disabled={editingEducationIndex !== index}
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Home Address
                    </label>
                    <textarea
                      value={education.homeAddress}
                      onChange={(e) => handleEducationChange(index, "homeAddress", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      placeholder="Enter home address"
                      rows={3}
                      disabled={editingEducationIndex !== index}
                    />
                  </div>
                </div>

                {editingEducationIndex === index && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveEducation(index)}
                      disabled={loadingEducation}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loadingEducation ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Education
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Verification Modal */}
      {showWhatsappVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify WhatsApp Number</h3>
            <p className="text-gray-600 mb-4">
              Enter the verification code sent to your WhatsApp number
            </p>
            <input
              type="text"
              value={whatsappVerificationCode}
              onChange={(e) => setWhatsappVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter verification code"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowWhatsappVerificationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsappVerification}
                disabled={loadingProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Popup */}
      {isValidationPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Validation Errors</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-600">
                  {error}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setIsValidationPopupOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;