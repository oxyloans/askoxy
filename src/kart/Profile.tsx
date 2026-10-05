import React, { useState, useEffect } from "react";
import { customerApi } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import { Loader2, AlertCircle, X, CheckCircle2, MapPinned, Navigation, MapPin, Map, Home, Briefcase, Building, Check } from "lucide-react";
import { LocationMapPicker } from "./LocationMapPicker";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
  const [isMobileNumberVerified, setIsMobileNumberVerified] = useState(false);
  const [showWhatsappVerificationModal, setShowWhatsappVerificationModal] =
    useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [verifyLoader, setVerifyLoader] = useState(false);

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

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    { type: "success" | "error" | "info"; message: string } | null
  >(null);
  const [detectedCoordinates, setDetectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  const handleMapLocationConfirmed = (data: {
    flatNo: string;
    landmark: string;
    address: string;
    pincode: string;
    lat?: number;
    lng?: number;
  }) => {
    if (data.lat && data.lng) {
      setDetectedCoordinates({ lat: data.lat, lng: data.lng });
    }
    setAddressFormData((prev) => ({
      ...prev,
      flatNo: data.flatNo || prev.flatNo,
      landmark: data.landmark || prev.landmark,
      address: data.address || prev.address,
      pincode: data.pincode || prev.pincode,
    }));
    setAddressFormErrors((prev) => ({
      ...prev,
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    }));
    setLocationStatus({
      type: "success",
      message: "Location selected from map.",
    });
  };

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
  const [salt, setSalt] = useState();
  const [whatsappOtpSession, setWhatsappOtpSession] = useState();

  const token = localStorage.getItem("accessToken") || "";
  const loginMethod = localStorage.getItem("loginMethod") || "";
  const isFromWhatsApp = loginMethod === "whatsapp";

  useEffect(() => {
    if (loginMethod === "whatsapp") {
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: whatsappNumber,
        mobileNumber: "",
      }));
    } else if (loginMethod === "mobile") {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData((prev) => ({
        ...prev,
        mobileNumber: mobileNumber,
        whatsappNumber: "",
      }));
    }
  }, [loginMethod]);

  useEffect(() => {
    const phoneNumber = formData.mobileNumber || formData.whatsappNumber;

    if (phoneNumber) {
      try {
        const phoneNumberS = parsePhoneNumber(phoneNumber);

        const detectedCountryCode = phoneNumberS?.countryCallingCode
          ? `+${phoneNumberS.countryCallingCode}`
          : "+91";

        setCountryCode(detectedCountryCode);
        setIsMethodDisabled(true);
      } catch (error) {
        setCountryCode("+91");
        setIsMethodDisabled(false);
      }
    } else {
      setCountryCode("+91");
      setIsMethodDisabled(false);
    }
  }, [formData.mobileNumber, formData.whatsappNumber]);

  useEffect(() => {
    if (isFromWhatsApp) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: localStorage.getItem("whatsappNumber") || "",
        mobileNumber: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: localStorage.getItem("mobileNumber") || "",
        whatsappNumber: "",
      }));
    }
  }, [isFromWhatsApp]);

  useEffect(() => {
    if (loginMethod === "whatsapp") {
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: whatsappNumber,
        mobileNumber: "",
      }));
    } else if (loginMethod === "mobile") {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      setFormData((prev) => ({
        ...prev,
        mobileNumber: mobileNumber,
        whatsappNumber: "",
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

      const response = await customerApi.get(
        `${BASE_URL}/user-service/customerProfileDetails`,
        {
          params: { customerId },
        },
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
        whatsappNumber: data.whatsappNumber || data.mobileNumber || "",
        mobileNumber: data.mobileNumber || "",
        customerId: customerId || "",
      };

      setFormData(profileData);
      setIsWhatsappVerified(data.whatsappVerified);
      setIsMobileNumberVerified(data.mobileVerified);
    } catch (error) {
      setError("Error fetching profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsappOTP = async () => {
    try {
      setIsLoading(true);

      if (formData.whatsappNumber == "") {
        setError("Please enter whatsapp number");
        return;
      }

      const response = await customerApi.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber.replace(countryCode, ""),
          countryCode: countryCode,
          id: customerId,
        },
      );

      if (response.data) {
        if (
          response.data.whatsappOtpSession == null ||
          response.data.salt == null
        ) {
          setError("This whatsapp number is already in use");
        } else {
          setSalt(response.data.salt);
          setWhatsappOtpSession(response.data.whatsappOtpSession);
          setSuccessMessage("OTP sent to your WhatsApp number");
          setTimeout(() => {
            setShowWhatsappVerificationModal(true);
          }, 1000);
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

      const response = await customerApi.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId: formData.whatsappNumber.replace(countryCode, ""),
          countryCode: countryCode,
          id: customerId,
          whatsappOtp: whatsappVerificationCode,
          whatsappOtpSession: whatsappOtpSession,
          salt: salt,
        },
      );

      if (response.data) {
        setIsWhatsappVerified(true);
        setShowWhatsappVerificationModal(false);
        setSuccessMessage("WhatsApp number verified successfully!");
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

      const response = await customerApi.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
      );

      const normalizedAddresses = (response.data || []).map((addr: any) => ({
        id: addr.id || addr._id || "",
        flatNo: addr.flatNo || "",
        landmark: addr.landmark || addr.landMark || "", // Handle both naming conventions
        address: addr.address || "",
        pincode: addr.pincode || "",
        addressType: addr.addressType || "Home",
      }));

      setAddresses([...normalizedAddresses].reverse());
    } catch (error) {
      setError("Error fetching addresses");
    } finally {
      setIsLoading(false);
    }
  };
  const getLast10Digits = (value: string | null | undefined) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length > 10 ? digits.slice(-10) : digits;
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    const primaryMobile = getLast10Digits(formData.mobileNumber);
    const whatsappMobile = getLast10Digits(formData.whatsappNumber);
    const alternateMobile = getLast10Digits(formData.alterMobileNumber);

    const effectivePrimaryNumber = primaryMobile || whatsappMobile;

    if (!formData.userFirstName.trim()) {
      errors.userFirstName = "First name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.userFirstName.trim())) {
      errors.userFirstName = "First name should only contain letters";
    }

    if (formData.userLastName.trim()) {
      if (!/^[A-Za-z ]+$/.test(formData.userLastName.trim())) {
        errors.userLastName = "Last name should only contain letters";
      }
    }

    const emailValue = formData.customerEmail.trim();

    if (!emailValue) {
      errors.customerEmail = "Email address is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailValue)) {
        errors.customerEmail = "Please enter a valid email address";
      }
    }

    if (!effectivePrimaryNumber) {
      errors.mobileNumber = "Primary mobile number is required";
    } else if (!/^\d{10}$/.test(effectivePrimaryNumber)) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number";
    } else if (/^0+$/.test(effectivePrimaryNumber)) {
      errors.mobileNumber = "Mobile number cannot be all zeros";
    }

    if (alternateMobile) {
      if (!/^\d{10}$/.test(alternateMobile)) {
        errors.alterMobileNumber =
          "Please enter a valid 10-digit mobile number";
      } else if (/^0+$/.test(alternateMobile)) {
        errors.alterMobileNumber = "Mobile number cannot be all zeros";
      } else if (
        alternateMobile === primaryMobile ||
        alternateMobile === whatsappMobile
      ) {
        errors.alterMobileNumber =
          "Alternate number must be different from primary and WhatsApp number.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateField = (
    field: string,
    value: string,
    updatedFormData?: ProfileFormData,
  ) => {
    const data = updatedFormData || formData;
    let error = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (field) {
      case "userFirstName":
        if (!value.trim()) error = "First name is required";
        else if (!/^[A-Za-z ]+$/.test(value.trim()))
          error = "First name should only contain letters";
        break;

      case "userLastName":
        if (value.length > 0) {
          if (!value.trim()) {
            error = "Last name cannot contain only spaces";
          } else if (!/^[A-Za-z ]+$/.test(value.trim())) {
            error = "Last name should only contain letters";
          }
        }
        break;

      case "customerEmail":
        if (!value.trim()) error = "Email address is required";
        else if (!emailRegex.test(value.trim()))
          error = "Please enter a valid email address";
        break;

      case "mobileNumber":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Please enter a valid 10-digit mobile number";
        else if (/^0+$/.test(value))
          error = "Mobile number cannot be all zeros";
        break;

      case "alterMobileNumber":
        if (value.trim() !== "") {
          if (!/^\d{10}$/.test(value))
            error = "Please enter a valid 10-digit mobile number";
          else if (/^0+$/.test(value))
            error = "Mobile number cannot be all zeros";
          else if (value === data.mobileNumber)
            error = "Alternate and Mobile number must be different";
          else if (value === data.whatsappNumber.replace(/\D/g, ""))
            error = "Alternate and WhatsApp number must be different";
        }
        break;

      case "whatsappNumber":
        if (value.trim() !== "") {
          const digits = value.replace(/\D/g, "");
          if (/^0+$/.test(digits))
            error = "WhatsApp number cannot be all zeros";
          else if (digits === data.alterMobileNumber)
            error = "Alternate and WhatsApp number must be different";
        }
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAddressForm = () => {
    const errors = {
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo?.trim())
      errors.flatNo = "Flat/House number is required";

    if (!addressFormData.landmark?.trim())
      errors.landmark = "Landmark is required";

    if (!addressFormData.address?.trim())
      errors.address = "Address is required";

    if (!addressFormData.pincode?.trim()) {
      errors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(addressFormData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit PIN code";
    } else if (/^0+$/.test(addressFormData.pincode)) {
      errors.pincode = "PIN code cannot be all zeros";
    }

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

      const primaryMobile = getLast10Digits(formData.mobileNumber);
      const whatsappMobile = getLast10Digits(formData.whatsappNumber);
      const finalPrimaryNumber = primaryMobile || whatsappMobile;

      const payload = {
        ...formData,
        mobileNumber: finalPrimaryNumber,
        whatsappNumber: whatsappMobile || finalPrimaryNumber,
        alterMobileNumber: getLast10Digits(formData.alterMobileNumber),
      };

      await customerApi.patch(
        `${BASE_URL}/user-service/profileUpdate`,
        payload,
      );

      setSuccessMessage("Profile updated successfully!");
      setEditStatus(true);
      localStorage.setItem("profileData", JSON.stringify(payload));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Error updating profile. Please try again.";

      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Error updating profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      const coordinates = detectedCoordinates || (await getCoordinates(fullAddress));

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
        id: editingAddressId,
        flatNo: addressFormData.flatNo,
        landMark: addressFormData.landmark,
        address: addressFormData.address,
        pincode: addressFormData.pincode,
        addressType: addressFormData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingAddressId) {
        await customerApi.patch(`${BASE_URL}/user-service/updateAddress`, data);

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "update_address", {
            address_type: addressFormData.addressType,
            editing: true,
          });
        }

        setSuccessMessage("Address updated successfully!");
      } else {
        await customerApi.post(`${BASE_URL}/user-service/addAddress`, data);

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "add_address", {
            address_type: addressFormData.addressType,
          });
        }

        setSuccessMessage("Address added successfully!");
      }

      setError("");
      await fetchAddresses();
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
        address,
      )}&key=${API_KEY}`;

      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      return null;
    }
  };

  const parseLocationResult = (result: any) => {
    const components: any[] = result?.address_components || [];
    const get = (type: string) =>
      components.find((component) => component.types?.includes(type))?.long_name || "";

    const premise = get("premise");
    const subpremise = get("subpremise");
    const streetNumber = get("street_number");
    const building = get("building");
    const flatNoParts = [premise, subpremise, building, streetNumber].filter(Boolean);
    const flatNo = flatNoParts.length > 0 ? Array.from(new Set(flatNoParts)).join(", ") : "";

    const route = get("route");
    const neighborhood = get("neighborhood");
    const sublocality3 = get("sublocality_level_3");
    const sublocality2 = get("sublocality_level_2");
    const sublocality1 = get("sublocality_level_1");
    const locality = get("locality");
    const district = get("administrative_area_level_2");
    const pincode = get("postal_code");

    const landmark = route || neighborhood || sublocality3 || sublocality2 || sublocality1 || "";
    const parts = [
      route,
      neighborhood,
      sublocality3,
      sublocality2,
      sublocality1,
      locality || district,
    ].filter(Boolean);
    const address = Array.from(new Set(parts)).join(", ") || (result?.formatted_address || "")
      .replace(/,?\s*India$/i, "")
      .replace(/,?\s*\d{6}(?:\s*,?\s*[^,]+)?$/i, "")
      .trim();

    return { flatNo, landmark, address, pincode };
  };

  const clearDetectedCoordinates = () => {
    setDetectedCoordinates(null);
    if (locationStatus?.type === "success") setLocationStatus(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        type: "error",
        message: "Current location is not supported by this browser. Please enter your address manually.",
      });
      return;
    }

    setIsFetchingLocation(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setDetectedCoordinates({ lat, lng });

        try {
          const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
          );
          const result = response.data?.results?.[0];

          if (response.data?.status === "OK" && result) {
            const parsed = parseLocationResult(result);
            setAddressFormData((prev) => ({
              ...prev,
              ...(parsed.flatNo ? { flatNo: parsed.flatNo } : {}),
              landmark: parsed.landmark || prev.landmark,
              address: parsed.address || prev.address,
              pincode: parsed.pincode || prev.pincode,
            }));
            setAddressFormErrors((prev) => ({
              ...prev,
              flatNo: "",
              landmark: "",
              address: "",
              pincode: "",
            }));
            setLocationStatus({
              type: "success",
              message: "Location detected successfully. Please review your address details below.",
            });
          } else {
            setLocationStatus({
              type: "error",
              message: "Location detected, but address details could not be parsed. Please enter manually.",
            });
          }
        } catch {
          setLocationStatus({
            type: "error",
            message: "Address lookup failed. Please enter details manually.",
          });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (geoError) => {
        const message =
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission was blocked. Allow location access for this site in your browser settings, then try again."
            : geoError.code === geoError.POSITION_UNAVAILABLE
              ? "Your location is currently unavailable. Check device location services or enter the address manually."
              : geoError.code === geoError.TIMEOUT
                ? "Location detection timed out. Please try again or enter the address manually."
                : "We couldn't detect your location. Please try again or enter the address manually.";
        setDetectedCoordinates(null);
        setLocationStatus({ type: "error", message });
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);

      await customerApi.delete(
        `${BASE_URL}/user-service/deleteAddress/${addressId}`,
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
    setDetectedCoordinates(null);
    setLocationStatus(null);
    setAddressFormData({
      flatNo: address.flatNo || "",
      landmark: address.landmark || "",
      address: address.address || "",
      pincode: address.pincode || "",
      addressType: address.addressType || "Home",
    });
    setEditingAddressId(address.id || null);
    setShowAddressForm(true);
    setError("");
    setSuccessMessage("");
  };

  const resetAddressForm = () => {
    setDetectedCoordinates(null);
    setLocationStatus(null);
    setIsFetchingLocation(false);
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

        <div className="pt-4 lg:pt-0 px-2 lg:px-6">
          <div className="border-b border-gray-200 mb-2">
            <div className="flex space-x-8">
              <button
                className={`pb-4 px-4 ${
                  activeTab === "personal"
                    ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>

              <button
                className={`pb-4 px-4 ${
                  activeTab === "addresses"
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, userFirstName: val });
                        validateField("userFirstName", val);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        validationErrors.userFirstName
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
                      Last Name
                    </label>

                    <input
                      type="text"
                      pattern="^[A-Za-z ]+$"
                      value={formData.userLastName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s{2,}/g, " ");

                        const updated = {
                          ...formData,
                          userLastName: val,
                        };

                        setFormData(updated);
                        validateField("userLastName", val, updated);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        validationErrors.userLastName
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
                      onChange={(e) => {
                        const newEmail = e.target.value;
                        setFormData({ ...formData, customerEmail: newEmail });
                        validateField("customerEmail", newEmail);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        validationErrors.customerEmail
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
                      <span className="text-xs text-gray-500 ml-1">
                        (If unavailable, we'll contact this number)
                      </span>
                    </label>

                    <input
                      type="text"
                      maxLength={10}
                      pattern="\d*"
                      value={formData.alterMobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const updated = {
                          ...formData,
                          alterMobileNumber: value,
                        };
                        setFormData(updated);
                        validateField("alterMobileNumber", value, updated);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        validationErrors.alterMobileNumber
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
                      Primary Mobile Number{" "}
                      {!isFromWhatsApp && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      disabled={true}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border transition-all bg-gray-100 text-gray-600 cursor-not-allowed ${
                        validationErrors.mobileNumber
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Primary Mobile Number"
                    />

                    {validationErrors.mobileNumber && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      WhatsApp Number
                    </label>

                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.whatsappNumber || formData.mobileNumber}
                        readOnly
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed pr-24"
                        placeholder="WhatsApp Number"
                      />

                      {(formData.whatsappNumber || formData.mobileNumber) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      If WhatsApp number is empty, primary mobile number will be
                      used.
                    </p>

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
                        disabled={isLoading}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg transition-colors shadow-md hover:bg-purple-700 disabled:opacity-50"
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

            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                {!showAddressForm ? (
                  <>
                    <div className="flex justify-end mb-6">
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
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
                          className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow relative group overflow-hidden"
                        >
                          <div className="flex items-start gap-3">
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
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {address.addressType}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleEditAddress(address)}
                                    className="flex items-center gap-1 text-gray-400 hover:text-purple-600 transition-colors"
                                    title="Edit"
                                  >
                                    <FaEdit size={15} />
                                    <span>Edit</span>
                                  </button>
                                  {/* <button
                                    onClick={() => handleDeleteAddress(address.id!)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash size={15} />
                                  </button> */}
                                </div>
                              </div>

                              <h3
                                className="mt-2 font-medium text-gray-900 truncate"
                                title={address.flatNo}
                              >
                                {address.flatNo}
                              </h3>

                              <p
                                className="mt-1 text-sm text-gray-500 truncate"
                                title={address.landmark}
                              >
                                {address.landmark}
                              </p>

                              <p
                                className="mt-1 text-sm text-gray-500 line-clamp-2 break-words"
                                title={address.address}
                              >
                                {address.address}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                PIN: {address.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>

                    {addressFormData.address && (
                      <div className="mb-4 p-3 bg-purple-50/80 border border-purple-100 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-7 w-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                              YOUR LOCATION
                            </span>
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {addressFormData.address}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMapPickerOpen(true)}
                          className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 font-medium mb-3">
                      Use your current location or manually Select location on map to guide delivery partners.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isFetchingLocation}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-purple-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isFetchingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600 shrink-0" />
                        ) : (
                          <MapPinned className="h-4 w-4 text-purple-600 shrink-0" />
                        )}
                        <span className="whitespace-nowrap">{isFetchingLocation ? "Detecting location…" : "Use your current location"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMapPickerOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50/80 text-purple-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                      >
                        <Map className="h-4 w-4 text-purple-600 shrink-0" />
                        <span className="whitespace-nowrap">Select location on Map</span>
                      </button>
                    </div>
                    {locationStatus && locationStatus.type !== "info" && (
                      <p
                        className={`mt-2 text-xs font-medium text-center ${
                          locationStatus.type === "error"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {locationStatus.message}
                      </p>
                    )}

                    {/* Divider OR */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="w-full border-t border-gray-200"></div>
                      <span className="absolute bg-white px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        OR
                      </span>
                    </div>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flat / House / Door No <span className="text-red-500">*</span>
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
                            placeholder="e.g. Flat 402, House No 12-3, Door No 5"
                          />

                          {addressFormErrors.flatNo && (
                            <p className="mt-1 text-sm text-red-600 font-medium">
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
                            onChange={(e) => {
                              setAddressFormData({
                                ...addressFormData,
                                landmark: e.target.value,
                              });
                              clearDetectedCoordinates();
                            }}
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
                          onChange={(e) => {
                            setAddressFormData({
                              ...addressFormData,
                              address: e.target.value,
                            });
                            clearDetectedCoordinates();
                          }}
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
                            onChange={(e) => {
                              setAddressFormData({
                                ...addressFormData,
                                pincode: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              });
                              clearDetectedCoordinates();
                            }}
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
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">
                            Address Type
                          </label>

                          <div className="grid grid-cols-3 gap-2.5">
                            {[
                              { type: "Home", icon: Home },
                              { type: "Work", icon: Briefcase },
                              { type: "Others", icon: Building },
                            ].map(({ type, icon: Icon }) => {
                              const isSelected = addressFormData.addressType === type;
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() =>
                                    setAddressFormData((prev) => ({
                                      ...prev,
                                      addressType: type as "Home" | "Work" | "Others",
                                    }))
                                  }
                                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-sm"
                                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50/40"
                                  }`}
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                  <span>{type}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {error && (
                          <div
                            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                            role="alert"
                          >
                            <span className="font-medium">Error:</span> {error}
                          </div>
                        )}

                        {successMessage && (
                          <div
                            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
                            role="alert"
                          >
                            <span className="font-medium">Success:</span>{" "}
                            {successMessage}
                          </div>
                        )}

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
        <LocationMapPicker
          isOpen={isMapPickerOpen}
          onClose={() => setIsMapPickerOpen(false)}
          onConfirmLocation={handleMapLocationConfirmed}
          initialCoords={detectedCoordinates}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
