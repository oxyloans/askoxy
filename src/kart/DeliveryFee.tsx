import React, { useEffect } from "react";
import { message } from "antd";
import { supabase } from "./supabaseClient";

interface DeliveryFeeProps {
  userLat?: number;
  userLng?: number;
  cartAmount: number;
  onFeeCalculated: (fee: number | null, handlingFee: number | null) => void;
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

const getFeeFromSlab = (
  value: number,
  slabs: any[],
  valueKeys: string[],
  distance: number | null = null
): number => {
  const matched = slabs.filter((slab) => {
    const min = slab[valueKeys[0]];
    const max = slab[valueKeys[1]];
    const active = slab.active;

    const distanceMatch =
      distance === null ||
      ((slab.min_km == null || distance >= slab.min_km) &&
       (slab.max_km == null || distance < slab.max_km));

    return active && value >= min && value < max && distanceMatch;
  });

  if (matched.length > 0) {
    return matched.reduce((min, curr) => (curr.fee < min.fee ? curr : min)).fee;
  }

  return 0;
};

export const calculateDeliveryFee = async (
  userLat: number,
  userLng: number,
  cartAmount: number
): Promise<{
  fee: number | null;
  distance: number;
  note: string | null;
  handlingFee: number;
  grandTotal: number | null;
  walletApplicable: boolean;
  minOrderForWallet: number;
  nearestStore?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  };
}> => {
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
      minOrderForWallet: 500,
    };
  }

  const storeRes = await supabase
    .from("store_locations")
    .select("*")
    .eq("active", true);

  if (storeRes.error || !storeRes.data.length) {
    console.error("Store fetch error:", storeRes.error);
    message.error("No active stores found.");
    return {
      fee: null,
      distance: 0,
      note: "No active stores found",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      minOrderForWallet: 500,
    };
  }

  const storeDistances = storeRes.data.map((store) => {
    const distance = getDistanceInKm(store.lat, store.lng, userLat, userLng) * 1.3;
    return { ...store, distance };
  });

  const nearestStore = storeDistances.reduce((a, b) =>
    a.distance < b.distance ? a : b
  );
  const roundedDistance = parseFloat(nearestStore.distance.toFixed(2));

  const [deliveryRes, handlingRes, globalRes] = await Promise.all([
    supabase.from("delivery_fees").select("*"),
    supabase.from("handling_fees").select("*"),
    supabase.from("global_config").select("*"),
  ]);

  if (deliveryRes.error || handlingRes.error || globalRes.error) {
    console.error("Fee fetch error:", deliveryRes.error || handlingRes.error || globalRes.error);
    message.error("Error loading fee configuration.");
    return {
      fee: null,
      distance: roundedDistance,
      note: "Error loading fee config",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      minOrderForWallet: 500,
    };
  }

  const globalMap: { [key: string]: number } = {};
  globalRes.data.forEach(({ key, value }) => (globalMap[key] = parseFloat(value)));
  const maxDistance = globalMap.max_distance_km ?? 25;
  const minOrderForWallet = globalMap.min_order_for_wallet_use ?? 500;

  if (nearestStore.distance > maxDistance) {
    message.error("Delivery not available: Location out of service range.");
    return {
      fee: null,
      distance: roundedDistance,
      note: "Out of service range",
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      minOrderForWallet,
    };
  }

  const deliveryFee = getFeeFromSlab(nearestStore.distance, deliveryRes.data, ["min_km", "max_km"]);

  // 🟢 Skip handling fee if cartAmount >= 500
  const handlingFee = cartAmount >= minOrderForWallet
    ? 0
    : getFeeFromSlab(cartAmount, handlingRes.data, ["min_cart", "max_cart"], nearestStore.distance);

  const note = `From ${nearestStore.name} → ₹${deliveryFee} delivery + ₹${handlingFee} handling fee`;
  const grandTotal = Math.round(cartAmount + deliveryFee + handlingFee);
  const walletApplicable = cartAmount >= minOrderForWallet;


  console.log(`Calculated delivery fee: ₹${deliveryFee}, handling fee: ₹${handlingFee}, total: ₹${grandTotal},walletApplicable: ${walletApplicable},cartAmount: ${cartAmount}`);

  return {
    fee: deliveryFee,
    distance: roundedDistance,
    note,
    handlingFee,
    grandTotal,
    walletApplicable,
    minOrderForWallet,
    nearestStore: {
      id: nearestStore.id,
      name: nearestStore.name,
      lat: nearestStore.lat,
      lng: nearestStore.lng,
    },
  };
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
        const totalFee = result.fee != null ? result.fee + result.handlingFee : null;
        console.log(`Returning combined fee to onFeeCalculated: ₹${totalFee}`);
        onFeeCalculated(result.fee, result.handlingFee);
        if (result.fee === null) {
          message.error(result.note || "Delivery not available for this location");
        }
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

// export default DeliveryFee;