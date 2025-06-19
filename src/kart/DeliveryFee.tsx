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
  const storeLat = 17.485833; // Store coordinates
  const storeLng = 78.424194;

  let distance = getDistanceInKm(storeLat, storeLng, userLat, userLng);

  // Adjust with road buffer (30%)
  distance = distance * 1.3;

  if (distance > 25) return null; // Out of service range
  if (distance <= 5) return 5; // ₹5 for first 5km
  if (distance > 20) return 30; // Fixed ₹30 for 20-25km

  const extraDistance = distance - 5;
  const additionalFee = Math.ceil(extraDistance) * 2; // ₹2 per km for 5-20km

  return Math.min(5 + additionalFee, 30); // Max ₹30
};

const DeliveryFee: React.FC<DeliveryFeeProps> = ({
  userLat,
  userLng,
  onFeeCalculated,
}) => {
  useEffect(() => {
    if (userLat != null && userLng != null) {
      const fee = calculateDeliveryFee(userLat, userLng);
      onFeeCalculated(fee);
      if (fee === null) {
        message.error("Delivery not available for this location");
      }
    } else {
      onFeeCalculated(0); // Default to 0 if coordinates are missing
    }
  }, [userLat, userLng, onFeeCalculated]);

  return null; // No UI rendering needed
};

export default DeliveryFee;
