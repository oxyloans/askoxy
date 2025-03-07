import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBriefcase,
  FaMapMarkerAlt,
  FaTrash,
  FaPen,
} from "react-icons/fa";
import { Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react";
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Footer from "../components/Footer";

import axios from "axios";
import { isWithinRadius } from "./LocationCheck";
import BASE_URL from "../Config";



interface Address {
  id?: string;
  flatNo: string;
  landmark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface ProfileFormData {
  userFirstName: string;
  userLastName: string;
  customerEmail: string;
  alterMobileNumber: string;
  customerId: string;
  whatsappNumber: string;
  mobileNumber: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [whatsappVerificationCode, setWhatsappVerificationCode] = useState("");
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [isMobileNumberVerified,setIsMobileNumberVerified] = useState(false)
  const [showWhatsappVerificationModal, setShowWhatsappVerificationModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [verifyLoader,setVerifyLoader] = useState(false)
  const [addressFormData, setAddressFormData] = useState<Address>({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormErrors, setAddressFormErrors] = useState({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
  });
  const customerId = localStorage.getItem("userId") || "";
  const [formData, setFormData] = useState<ProfileFormData>({
    userFirstName: "",
    userLastName: "",
    customerEmail: "",
    alterMobileNumber: "",
    customerId: customerId || "",
    whatsappNumber: "",
    mobileNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isValidationPopupOpen, setIsValidationPopupOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editStatus, setEditStatus] = useState(true);
  const [salt,setSalt] = useState();
  const [whatsappOtpSession,setWhatsappOtpSession] = useState()
 
  const token = localStorage.getItem("token") || "";
  const loginMethod = localStorage.getItem("loginMethod") || "";
  const isFromWhatsApp = loginMethod === "whatsapp";


  useEffect(() => {
    // Determine login method and set numbers accordingly
    if (loginMethod === "whatsapp") {
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      setFormData(prev => ({
        ...prev,
        whatsappNumber: whatsappNumber,
        mobileNumber: "", // Clear mobile number
      }));
    } else if (loginMethod === "mobile") {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData(prev => ({
        ...prev,
        mobileNumber: mobileNumber,
        whatsappNumber: "", // Clear WhatsApp number
      }));
    }
  }, [loginMethod]);

  useEffect(() => {
    const phoneNumber = formData.mobileNumber || formData.whatsappNumber;
    
    if (phoneNumber) {
      try {
        const phoneNumberS = parsePhoneNumber(phoneNumber);
        console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
        
        const detectedCountryCode = phoneNumberS?.countryCallingCode 
          ? `+${phoneNumberS.countryCallingCode}` 
          : "+91"; // Default to India if unable to detect
        
        setCountryCode(detectedCountryCode);
        setIsMethodDisabled(true); // Disable method selection when number is entered
      } catch (error) {
        console.error("Error parsing phone number", error);
        setCountryCode("+91");
        setIsMethodDisabled(false);
      }
    } else {
      setCountryCode("+91"); // Reset to default
      setIsMethodDisabled(false); // Enable method selection when number is empty
    }
  }, [formData.mobileNumber, formData.whatsappNumber]);


  useEffect(() => {
    if (isFromWhatsApp) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: localStorage.getItem("whatsappNumber") || "",
        mobileNumber: "",  // mobileNumber should be empty if from WhatsApp
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: localStorage.getItem("mobileNumber") || "",
        whatsappNumber: "",  // whatsappNumber should be empty if from Mobile login
      }));
    }
  }, [isFromWhatsApp]);

  useEffect(() => {
    // Determine login method and set numbers accordingly
    if (loginMethod === "whatsapp") {
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      setFormData(prev => ({
        ...prev,
        whatsappNumber: whatsappNumber,
        mobileNumber: "", // Clear mobile number
      }));
    } else if (loginMethod === "mobile") {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData(prev => ({
        ...prev,
        mobileNumber: mobileNumber,
        whatsappNumber: "", // Clear WhatsApp number
      }));
    }
  }, [loginMethod]);

useEffect(() => {
    if (customerId) {
      fetchProfileData();
      fetchAddresses();
    }
    setCartCount(parseInt(localStorage.getItem("cartCount") || "0"));
  }, [customerId]);

 const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails`,
        {
          params: { customerId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      if (!data || !data.firstName || !data.lastName || !data.email) {
        setEditStatus(false);
      } else {
        setEditStatus(true);
      }
      const profileData = {
        userFirstName: data.firstName || "",
        userLastName: data.lastName || "",
        customerEmail: data.email || "",
        alterMobileNumber: data.alterMobileNumber || "",
        whatsappNumber: data.whatsappNumber || "",
        mobileNumber: data.mobileNumber || "",
        customerId: customerId || "",
      };

      setFormData(profileData);
      
      // Determine WhatsApp verification status
      setIsWhatsappVerified(data.whatsappVerified);
      setIsMobileNumberVerified(data.mobileVerified)
    } catch (error) {
      setError("Error fetching profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsappOTP = async () => {
    try {
      setIsLoading(true);
      if(formData.whatsappNumber==""){
        setError('Please enter whatsapp number')
        return
      }
      
      const response = await axios.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber,
          countryCode: countryCode,
          id:customerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
          if(response.data.whatsappOtpSession==null || response.data.salt==null){
            setError("This whatsapp number is already in use")
          }else{
        setSalt(response.data.salt)
        setWhatsappOtpSession(response.data.whatsappOtpSession)
        setSuccessMessage("OTP sent to your WhatsApp number");
        setTimeout(()=>{
        setShowWhatsappVerificationModal(true);
         },1000)
          }
      } else {
        setError("Failed to send OTP");
      }
    } catch (error) {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappVerification = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber,
          countryCode: countryCode,
          id:customerId,
          whatsappOtp: whatsappVerificationCode,
          whatsappOtpSession:whatsappOtpSession,
          salt:salt
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setIsWhatsappVerified(true);
        setShowWhatsappVerificationModal(false);
        setSuccessMessage("WhatsApp number verified successfully!");
        // Update profile with verified WhatsApp number
        await handleSaveProfile();
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      setError("Failed to verify WhatsApp number");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data);
    } catch (error) {
      setError("Error fetching addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    // First Name validation
    if (!formData.userFirstName.trim()) {
      errors.userFirstName = "First name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.userFirstName.trim())) {
      errors.userFirstName = "First name should only contain letters";
    }

    // Last Name validation
    if (!formData.userLastName.trim()) {
      errors.userLastName = "Last name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.userLastName.trim())) {
      errors.userLastName = "Last name should only contain letters";
    }

    // Email validation
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = "Please enter a valid email address";
    }

    // Alternate mobile number validation
    if (!formData.alterMobileNumber.trim()) {
      errors.alterMobileNumber = "Alternate mobile number is required";
    } else if (!/^\d{10}$/.test(formData.alterMobileNumber)) {
      errors.alterMobileNumber = "Please enter a valid 10-digit mobile number";
    }

    // WhatsApp number validation
    if (!formData.whatsappNumber) {
      errors.whatsappNumber = "WhatsApp number is required";
    }

    // Cross-number validations
    if (formData.alterMobileNumber === formData.whatsappNumber) {
      errors.alterMobileNumber = "Alternate mobile number and WhatsApp number must be different.";
      errors.whatsappNumber = "Alternate mobile number and WhatsApp number must be different.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddressForm = () => {
    const errors = {
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo.trim())
      errors.flatNo = "Flat/House number is required";
    if (!addressFormData.landmark.trim())
      errors.landmark = "Landmark is required";
    if (!addressFormData.address.trim()) errors.address = "Address is required";
    if (!addressFormData.pincode.trim())
      errors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(addressFormData.pincode))
      errors.pincode = "Please enter a valid 6-digit PIN code";

    setAddressFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      setIsValidationPopupOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        whatsappNumber: formData.whatsappNumber,
        mobileNumber: formData.mobileNumber.replace(countryCode,"")
      };

      await axios.patch(`${BASE_URL}/user-service/profileUpdate`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Profile updated successfully!");
      setEditStatus(true);
      localStorage.setItem("profileData", JSON.stringify(payload));
    } catch (error) {
      setError("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  // Auto-hide messages after 5 seconds
  React.useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleAddressSubmit = async (): Promise<void> => {
    if (!validateAddressForm()) return;

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const fullAddress = `${addressFormData.flatNo}, ${addressFormData.landmark}, ${addressFormData.address}, ${addressFormData.pincode}`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        setError("Unable to find location coordinates");
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      if (!withinRadius) {
        setError("Sorry, we do not deliver to this location");
        return;
      }

      const data = {
        userId: customerId,
        flatNo: addressFormData.flatNo,
        landMark: addressFormData.landmark,
        address: addressFormData.address,
        pincode: addressFormData.pincode,
        addressType: addressFormData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingAddressId) {
        await axios.put(
          `${BASE_URL}/user-service/updateAddress/${editingAddressId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccessMessage("Address updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Address added successfully!");
      }

      // Clear error on success
      setError("");

      // Fetch updated addresses
      await fetchAddresses();

      // Reset form after short delay to allow user to see success message
      setTimeout(resetAddressForm, 3000);
    } catch (err) {
      setSuccessMessage("");
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      return null;
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${BASE_URL}/user-service/deleteAddress/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Address deleted successfully!");
      await fetchAddresses();
    } catch (error) {
      setError("Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressFormData(address);
    setEditingAddressId(address.id || null);
    setShowAddressForm(true);
    setError("");
    setSuccessMessage("");
  };

  const resetAddressForm = () => {
    setAddressFormData({
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
    setAddressFormErrors({
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showWhatsappVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Verify WhatsApp Number</h2>
              <button
                onClick={() => setShowWhatsappVerificationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 4-digit verification code sent to your WhatsApp number
              </p>
              <input
                type="text"
                value={whatsappVerificationCode}
                onChange={(e) => setWhatsappVerificationCode(e.target.value)}
                placeholder="Enter 4-digit code"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleWhatsappVerification}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Verify
                </button>
                <button
                  onClick={() => setShowWhatsappVerificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6"></div>
        {/* Mobile Navigation Bar */}

        {/* Main Content */}
        <div className="pt-4 lg:pt-0 px-2 lg:px-6">
          {/* Desktop Navigation */}
          <div className="border-b border-gray-200 mb-2">
            <div className="flex space-x-8">
              <button
                className={`pb-4 px-4 ${activeTab === "personal"
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "text-gray-500"
                  }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>
              <button
                className={`pb-4 px-4 ${activeTab === "addresses"
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "text-gray-500"
                  }`}
                onClick={() => setActiveTab("addresses")}
              >
                Address
              </button>
            </div>
          </div>

          <div className="max-w-7xl">
            {/* Personal Information Form */}
            {activeTab === "personal" && (
              <div className="bg-white p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      pattern="^[A-Za-z]+$"
                      value={formData.userFirstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          userFirstName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all
                                     ${validationErrors.userFirstName
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      placeholder="Enter your first name"
                      disabled={editStatus}
                    />
                    {validationErrors.userFirstName && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.userFirstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      pattern="^[A-Za-z]+$"
                      value={formData.userLastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          userLastName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all
                                     ${validationErrors.userLastName
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      placeholder="Enter your last name"
                      disabled={editStatus}
                    />
                    {validationErrors.userLastName && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.userLastName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all
                                     ${validationErrors.customerEmail
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      placeholder="Enter your email"
                      disabled={editStatus}
                    />
                    {validationErrors.customerEmail && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.customerEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Alternate Mobile Number{" "}
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-1">
                        (If unavailable, we'll contact this number)
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      pattern="\d*"
                      value={formData.alterMobileNumber.trim()}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alterMobileNumber: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-all
                                     ${validationErrors.alterMobileNumber
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      placeholder="Enter alternate number"
                      disabled={editStatus}
                    />
                    {validationErrors.alterMobileNumber && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.alterMobileNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mobile Number {isFromWhatsApp ? "" : <span className="text-red-500">*</span>}
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={formData.mobileNumber}
                      disabled={isMobileNumberVerified}
                      onChange={(value) => setFormData({ ...formData, mobileNumber: value || "" })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all
          ${validationErrors.mobileNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-500"}
        `}
                      placeholder="Enter mobile number"
                    />
                    {validationErrors.mobileNumber && (
                      <p className="text-red-500 text-sm">{validationErrors.mobileNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <PhoneInput
                    defaultCountry="IN"
                    disabled={isWhatsappVerified} // Disable input only during OTP verification
                    international={true} // Allow country change for WhatsApp
                    value={formData.whatsappNumber}
                    onChange={(value) => {
                      setFormData({ ...formData, whatsappNumber: value || "" });
                      setIsWhatsappVerified(false);
                    }}
                    className={`flex-grow px-4 py-3 rounded-lg border transition-all
                      ${validationErrors.whatsappNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-500"}
                    `}
                    placeholder="Enter WhatsApp number"
                  />
                  {!isWhatsappVerified && (
                    <button
                      onClick={sendWhatsappOTP}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
                {validationErrors.whatsappNumber && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.whatsappNumber}
                  </p>
                )}
              </div>
                </div>

                <div className="space-y-4">
                  {successMessage && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-800">
                          Success
                        </div>
                        <div className="text-green-700 text-sm">
                          {successMessage}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-800">Error</div>
                        <div className="text-red-700 text-sm">{error}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    {!editStatus ? (
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading || !isWhatsappVerified}
                        className="w-full md:w-auto px-6 py-3  bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg transition-colors shadow-md hover:bg-purple-700 disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditStatus(false)}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg transition-colors shadow-md hover:bg-purple-700"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Section */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                {!showAddressForm ? (
                  <>
                    <div className="flex justify-end mb-6">
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2  bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                      >
                        <FaMapMarkerAlt />
                        Add New Address
                      </button>
                    </div>
                    {addresses.length === 0 && (
                      <div className="text-center py-12">
                        <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No addresses found
                        </h3>
                        <p className="text-gray-500">
                          Add your first address to get started!
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow relative group"
                        >
                          {/* Address card content */}
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                              {address.addressType === "Home" ? (
                                <FaHome className="text-purple-600" />
                              ) : address.addressType === "Work" ? (
                                <FaBriefcase className="text-purple-600" />
                              ) : (
                                <FaMapMarkerAlt className="text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {address.addressType}
                              </span>
                              <h3 className="mt-2 font-medium text-gray-900 truncate">
                                {address.flatNo}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 truncate">
                                {address.landmark}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {address.address}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                PIN: {address.pincode}
                              </p>
                            </div>
                            <div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50"
                                >
                                  {/* <FaPen className="w-4 h-4" /> */}
                                </button>
                                {/* <button
                                                                    onClick={() => address.id && handleDeleteAddress(address.id)}
                                                                    className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                                                                >
                                                                    <FaTrash className="w-4 h-4" />
                                                                </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className=" mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>
                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flat/House Number
                          </label>
                          <input
                            type="text"
                            value={addressFormData.flatNo}
                            onChange={(e) =>
                              setAddressFormData({
                                ...addressFormData,
                                flatNo: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter flat/house number"
                          />
                          {addressFormErrors.flatNo && (
                            <p className="mt-1 text-sm text-red-600">
                              {addressFormErrors.flatNo}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                          </label>
                          <input
                            type="text"
                            value={addressFormData.landmark}
                            onChange={(e) =>
                              setAddressFormData({
                                ...addressFormData,
                                landmark: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter landmark"
                          />
                          {addressFormErrors.landmark && (
                            <p className="mt-1 text-sm text-red-600">
                              {addressFormErrors.landmark}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complete Address
                        </label>
                        <textarea
                          value={addressFormData.address}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              address: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                          placeholder="Enter complete address"
                        />
                        {addressFormErrors.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressFormErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={addressFormData.pincode}
                            onChange={(e) =>
                              setAddressFormData({
                                ...addressFormData,
                                pincode: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter 6-digit PIN code"
                            maxLength={6}
                          />
                          {addressFormErrors.pincode && (
                            <p className="mt-1 text-sm text-red-600">
                              {addressFormErrors.pincode}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type
                          </label>
                          <select
                            value={addressFormData.addressType}
                            onChange={(e) =>
                              setAddressFormData({
                                ...addressFormData,
                                addressType: e.target.value as
                                  | "Home"
                                  | "Work"
                                  | "Others",
                              })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Error Message */}
                        {error && (
                          <div
                            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                            role="alert"
                          >
                            <span className="font-medium">Error:</span> {error}
                          </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                          <div
                            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
                            role="alert"
                          >
                            <span className="font-medium">Success:</span>{" "}
                            {successMessage}
                          </div>
                        )}

                        {/* Form Fields would go here */}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddressSubmit}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                {editingAddressId ? "Updating..." : "Adding..."}
                              </>
                            ) : editingAddressId ? (
                              "Update Address"
                            ) : (
                              "Add Address"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
