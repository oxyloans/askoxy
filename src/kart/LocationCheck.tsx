import axios from "axios";

// Define types for coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Cords {
  lat: number;
  lng: number;
}

// Define the central position and radius
const centralPosition: Coordinates = {
  latitude: 17.4752533,
  longitude: 78.3847054,
};

const radius = 20000;

// Utility to check if a position is within a radius
export const isWithinRadius = (coord1: Cords) => {
  console.log("coord1", coord1);
  console.log("centralPosition", centralPosition);

  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth's radius in meters

  if (!coord1.lat || !coord1.lng) {
    console.log("no coor");

    return { status: "error", distanceInKm: 100, isWithin: false, coord1 };
  }

  const lat1 = toRad(coord1.lat);
  const lat2Rad = toRad(centralPosition.latitude);
  const deltaLat = toRad(centralPosition.latitude - coord1.lat);
  const deltaLon = toRad(centralPosition.longitude - coord1.lng);

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  console.log("Calculated Distance (meters):", distance);

  const isWithin = distance <= radius;
  console.log("Is within radius:", isWithin);

  const distanceInKm = (distance / 1000).toFixed(2); // Convert to kilometers

  if (isWithin) {
    return { status: "success", distanceInKm, isWithin, coord1 };
  } else {
    // alert(
    //   `Sorry, we cannot deliver to this address. Your distance is ${distanceInKm} km, which exceeds the ${
    //     radius / 1000
    //   } km radius.`
    // );
    return { status: "error", distanceInKm, isWithin, coord1 };
  }
};

// Function to get coordinates and check if within radius
export const getCoordinates = async (address: string) => {
  console.log("Address:", address);
  console.log("Central Position:", centralPosition);

  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log("Coordinates response:", response.data);

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return isWithinRadius({
        lat: location.lat,
        lng: location.lng,
      });
    } else {
      console.error("Error fetching coordinates:", response.data.status);
      alert("Error: Could not fetch coordinates for the given address.");
      return { status: "error", distanceInKm: 0, isWithin: false };
    }
  } catch (error) {
    console.error("Error making the API call:", error);
    alert("Error: An error occurred while fetching the address details.");
    return { status: "error", distanceInKm: 0, isWithin: false };
  }
};
