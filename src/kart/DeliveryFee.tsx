import React, { useEffect } from "react";
import { message } from "antd";
import axios from "axios";

const API_BASE_URL = "https://interviews-zadn.onrender.com/api/delivery"

interface DeliveryFeeProps {
  userLat?: number;
  userLng?: number;
  cartAmount: number;
  onFeeCalculated: (fee: number | null, handlingFee: number | null) => void;
}

interface ZoneMatch {
  id: string;
  zonename: string;
  centrallat: number;
  centrallng: number;
  cutofftime: string;
  alloweddistance: number;
  distance: number;
}

interface ZoneCheckResult {
  eligible: boolean;
  matchedZone: ZoneMatch | null;
  message: string;
  error?: string;
}

interface DeliveryFeeResult {
  fee: number | null;
  distance: number;
  note: string | null;
  handlingFee: number;
  grandTotal: number | null;
  walletApplicable: boolean;
  canPlaceOrder: boolean;
  minOrderForWallet: number;
  minOrderToPlace: number;
  minOrderAmount: number; // Backward compatibility alias
  nearestStore?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  };
}

export const getFinalDeliveryFee = async (
  userLat: number,
  userLng: number,
  cartAmount: number
): Promise<DeliveryFeeResult> => {
  if (!userLat || !userLng) {
    return {
      fee: null,
      distance: 0,
      note: null,
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 0,
      minOrderToPlace: 0,
      minOrderAmount: 0
    };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/calculate-fee`, {
      userLat,
      userLng,
      cartAmount
    });
    return response.data;
  } catch (error: any) {
    console.error("API error:", error);
    return {
      fee: null,
      distance: 0,
      note: error.response?.data?.error || "Error calculating fee",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 0,
      minOrderToPlace: 0,
      minOrderAmount: 0
    };
  }
};

export const calculateDeliveryFee = async (
  userLat: number,
  userLng: number,
  cartAmount: number
): Promise<DeliveryFeeResult> => {
  if (
    isNaN(userLat) ||
    isNaN(userLng) ||
    userLat < -90 ||
    userLat > 90 ||
    userLng < -180 ||
    userLng > 180
  ) {
    console.error("Invalid coordinates:", { userLat, userLng });
    message.error("Invalid location coordinates provided.");
    return {
      fee: null,
      distance: 0,
      note: "Invalid coordinates",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 500,
      minOrderToPlace: 499,
      minOrderAmount: 499, // Backward compatibility
    };
  }

  try {
    const result = await getFinalDeliveryFee(userLat, userLng, cartAmount);
    
    if (result.fee === null) {
      message.error(result.note || "Delivery not available for this location");
    }

    console.log(
      `Calculated delivery fee: ₹${result.fee}, handling fee: ₹${result.handlingFee}, total: ₹${result.grandTotal}, walletApplicable: ${result.walletApplicable}, canPlaceOrder: ${result.canPlaceOrder}, cartAmount: ${cartAmount}`
    );

    return result;
  } catch (error) {
    console.error("Error calculating delivery fee:", error);
    message.error("Error calculating delivery fee");
    return {
      fee: null,
      distance: 0,
      note: "Error calculating delivery fee",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 500,
      minOrderToPlace: 499,
      minOrderAmount: 499, // Backward compatibility
    };
  }
};

const DeliveryFee: React.FC<DeliveryFeeProps> = ({
  userLat,
  userLng,
  cartAmount,
  onFeeCalculated,
}) => {
  useEffect(() => {
    const fetchFee = async () => {
      if (userLat != null && userLng != null) {
        console.log(
          `Calculating delivery fee for coordinates: ${userLat}, ${userLng}, cart amount: ₹${cartAmount}`
        );
        const result = await calculateDeliveryFee(userLat, userLng, cartAmount);
        const totalFee =
          result.fee != null ? result.fee + result.handlingFee : null;
        console.log(`Returning combined fee to onFeeCalculated: ₹${totalFee}`);
        onFeeCalculated(result.fee, result.handlingFee);
      } else {
        console.warn("Coordinates missing:", { userLat, userLng });
        message.error(
          "Please provide valid location coordinates to calculate delivery fee"
        );
        onFeeCalculated(null, null);
      }
    };

    fetchFee();
  }, [userLat, userLng, cartAmount, onFeeCalculated]);

  return null; // No UI rendering needed
};

export const checkEligibilityForActiveZones = async (
  userLat: number,
  userLng: number
): Promise<ZoneCheckResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-zone-eligibility`, {
      userLat,
      userLng
    });
    return response.data;
  } catch (error: any) {
    console.error("API error:", error);
    return {
      eligible: false,
      matchedZone: null,
      message: error.response?.data?.error || "Error checking zone eligibility",
      error: error.message
    };
  }
};

export default DeliveryFee;