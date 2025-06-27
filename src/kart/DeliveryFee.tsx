import React, { useEffect } from "react";
import { message } from "antd";

interface DeliveryFeeProps {
  userLat?: number;
  userLng?: number;
  onFeeCalculated: (fee: number | null) => void;
}

const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateDeliveryFee = (
  userLat: number,
  userLng: number
): number | null => {
  // Validate coordinates
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
    return null;
  }

  const storeLat = 17.485833; // Store coordinates
  const storeLng = 78.424194;

  const distance = getDistanceInKm(storeLat, storeLng, userLat, userLng);
  console.log(`Raw distance: ${distance.toFixed(2)} km`);

  // Adjust with road buffer (30%)
  const adjustedDistance = distance * 1.3;
  console.log(`Adjusted distance: ${adjustedDistance.toFixed(2)} km`);

  if (adjustedDistance > 25) {
    console.log("Delivery not available: Adjusted distance exceeds 25 km");
    return null; // Out of service range
  }
  if (adjustedDistance <= 5) return 5; // ₹5 for first 5km
  if (adjustedDistance > 20) return 30; // Fixed ₹30 for 20-25km

  const extraDistance = adjustedDistance - 5;
  const additionalFee = Math.ceil(extraDistance) * 2; // ₹2 per km for 5-20km

  const fee = Math.min(5 + additionalFee, 30);
  console.log(`Calculated delivery fee: ₹${fee}`);
  return fee;
};

const DeliveryFee: React.FC<DeliveryFeeProps> = ({
  userLat,
  userLng,
  onFeeCalculated,
}) => {
  useEffect(() => {
    if (userLat != null && userLng != null) {
      console.log(
        `Calculating delivery fee for coordinates: ${userLat}, ${userLng}`
      );
      const fee = calculateDeliveryFee(userLat, userLng);
      onFeeCalculated(fee);
      if (fee === null) {
        message.error("Delivery not available for this location");
      }
    } else {
      console.warn("Coordinates missing:", { userLat, userLng });
      onFeeCalculated(null); // Set to null instead of 0 to align with Cart.tsx checks
      message.error(
        "Please provide valid location coordinates to calculate delivery fee"
      );
    }
  }, [userLat, userLng, onFeeCalculated]);

  return null; // No UI rendering needed
};

export default DeliveryFee;
