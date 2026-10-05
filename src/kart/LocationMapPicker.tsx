import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Search,
  Navigation,
  MapPin,
  Check,
  Loader2,
  ArrowRight,
  Target,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { FaLocationCrosshairs } from "react-icons/fa6";

declare global {
  interface Window {
    L: any;
  }
}

interface LocationMapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLocation: (locationData: {
    flatNo: string;
    landmark: string;
    address: string;
    pincode: string;
    lat?: number;
    lng?: number;
    formattedAddress?: string;
  }) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";

// Haversine formula to compute distance between device GPS and selected pin
const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  isOpen,
  onClose,
  onConfirmLocation,
  initialCoords,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialCoords?.lat ?? 17.4483, 
    lng: initialCoords?.lng ?? 78.3915,
  });
  const [deviceGpsCoords, setDeviceGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [locationDetails, setLocationDetails] = useState<{
    primaryTitle: string;
    flatNo: string;
    landmark: string;
    address: string;
    pincode: string;
    formattedAddress: string;
  }>({
    primaryTitle: "Detecting Location...",
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
    formattedAddress: "Detecting location...",
  });

  // Load Leaflet JS & CSS dynamically + Inject container styles
  useEffect(() => {
    if (!isOpen) return;

    if (!document.getElementById("leaflet-custom-styles")) {
      const style = document.createElement("style");
      style.id = "leaflet-custom-styles";
      style.innerHTML = `
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          background: #f1f5f9 !important;
          z-index: 10 !important;
        }
        .leaflet-tile-container img {
          max-width: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const existingScript = document.getElementById("leaflet-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => setLeafletLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, [isOpen]);

  // Reverse Geocode using Google Geocoding API
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const result = response.data?.results?.[0];
      if (response.data?.status === "OK" && result) {
        const components: any[] = result?.address_components || [];
        const get = (type: string) =>
          components.find((c) => c.types?.includes(type))?.long_name || "";

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

        const primaryTitle =
          premise ||
          building ||
          sublocality1 ||
          neighborhood ||
          sublocality2 ||
          locality ||
          "Selected Location";

        const landmark = route || neighborhood || sublocality3 || sublocality2 || sublocality1 || "";
        const parts = [
          route,
          neighborhood,
          sublocality3,
          sublocality2,
          sublocality1,
          locality || district,
        ].filter(Boolean);

        const addressStr =
          Array.from(new Set(parts)).join(", ") ||
          (result?.formatted_address || "")
            .replace(/,?\s*India$/i, "")
            .replace(/,?\s*\d{6}(?:\s*,?\s*[^,]+)?$/i, "")
            .trim();

        const formatted =
          result?.formatted_address ||
          [addressStr, pincode].filter(Boolean).join(", ");

        setLocationDetails({
          primaryTitle,
          flatNo,
          landmark,
          address: addressStr,
          pincode,
          formattedAddress: formatted,
        });
      } else {
        setLocationDetails((prev) => ({
          ...prev,
          primaryTitle: "Selected Location",
          formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        }));
      }
    } catch {
      setLocationDetails((prev) => ({
        ...prev,
        primaryTitle: "Selected Location",
        formattedAddress: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      }));
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Map Canvas when Leaflet is loaded
  useEffect(() => {
    if (!isOpen || !leafletLoaded || !mapRef.current) return;

    try {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
      }

      const map = window.L.map(mapRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 17,
        zoomControl: false,
      });
      leafletMapInstance.current = map;

      // OpenStreetMap tile layer (Free, high-contrast, zero watermark)
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Custom Pin Marker
      const pinIcon = window.L.divIcon({
        className: "custom-red-pin-marker",
        html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
          <div style="width:34px;height:34px;background:#7c3aed;border-radius:50%;border:3px solid white;box-shadow:0 6px 16px rgba(124,58,237,0.4);display:flex;align-items:center;justify-content:center;color:white;">
            <div style="width:10px;height:10px;background:white;border-radius:50%;"></div>
          </div>
          <div style="width:3px;height:12px;background:#7c3aed;border-radius:2px;"></div>
        </div>`,
        iconSize: [34, 46],
        iconAnchor: [17, 46],
      });

      const marker = window.L.marker([coords.lat, coords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);
      markerInstance.current = marker;

      // Trigger size invalidation to fix white/blank container issue on modal mount
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 150);

      // Marker Drag End
      marker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Click Map -> Moves pin to clicked position
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Map Pan / Move End -> Moves pin to center of map
      map.on("moveend", () => {
        const center = map.getCenter();
        marker.setLatLng(center);
        setCoords({ lat: center.lat, lng: center.lng });
        reverseGeocode(center.lat, center.lng);
      });

      // Initial reverse geocode
      reverseGeocode(coords.lat, coords.lng);
    } catch (err) {
      console.error("Map initialization error", err);
    }
  }, [isOpen, leafletLoaded]);

  // Recalculate map size when modal opens
  useEffect(() => {
    if (isOpen && leafletMapInstance.current) {
      const timer = setTimeout(() => {
        leafletMapInstance.current.invalidateSize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Request user GPS on open
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setDeviceGpsCoords({ lat, lng });
          setCoords({ lat, lng });

          if (leafletMapInstance.current && markerInstance.current) {
            leafletMapInstance.current.setView([lat, lng], 17);
            markerInstance.current.setLatLng([lat, lng]);
            setTimeout(() => leafletMapInstance.current?.invalidateSize(), 150);
          }
          reverseGeocode(lat, lng);
        },
        () => {
          // Keep default coords
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [isOpen]);

  // Search Input change & Geocoding lookup
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length < 3) {
      setSearchSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          val
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data?.status === "OK" && response.data?.results) {
        setSearchSuggestions(response.data.results.slice(0, 5));
      } else {
        setSearchSuggestions([]);
      }
    } catch {
      setSearchSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select Search Suggestion -> Automatically updates map position & pin marker!
  const handleSelectSuggestion = (item: any) => {
    const loc = item.geometry?.location;
    if (!loc) return;

    const lat = loc.lat;
    const lng = loc.lng;
    setCoords({ lat, lng });

    if (leafletMapInstance.current && markerInstance.current) {
      leafletMapInstance.current.setView([lat, lng], 17);
      markerInstance.current.setLatLng([lat, lng]);
      setTimeout(() => leafletMapInstance.current?.invalidateSize(), 100);
    }

    setSearchSuggestions([]);
    setSearchQuery(item.formatted_address || "");
    reverseGeocode(lat, lng);
  };

  // Re-center Map to Device GPS Location
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;

    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setDeviceGpsCoords({ lat, lng });
        setCoords({ lat, lng });

        if (leafletMapInstance.current && markerInstance.current) {
          leafletMapInstance.current.setView([lat, lng], 17);
          markerInstance.current.setLatLng([lat, lng]);
          setTimeout(() => leafletMapInstance.current?.invalidateSize(), 100);
        }
        reverseGeocode(lat, lng);
      },
      () => {
        setIsGeocoding(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onConfirmLocation({
      flatNo: locationDetails.flatNo,
      landmark: locationDetails.landmark,
      address: locationDetails.address,
      pincode: locationDetails.pincode,
      lat: coords.lat,
      lng: coords.lng,
      formattedAddress: locationDetails.formattedAddress,
    });
    onClose();
  };

  const distanceKm =
    deviceGpsCoords
      ? getDistanceInKm(
          deviceGpsCoords.lat,
          deviceGpsCoords.lng,
          coords.lat,
          coords.lng
        )
      : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 transition-all">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-md md:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header & Floating Search Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="h-11 w-11 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer border border-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          <div className="relative flex-1">
            <div className="flex items-center bg-white rounded-full shadow-md px-3.5 py-2.5 border border-gray-100">
              <Search className="h-4 w-4 text-purple-600 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for building, street or area..."
                className="w-full text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchSuggestions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-13 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-40 divide-y divide-gray-50 max-h-56 overflow-y-auto">
                {searchSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50/60 transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-gray-800 line-clamp-2">
                      {item.formatted_address}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map Area */}
        <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[420px] bg-slate-100">
          {leafletLoaded ? (
            <div ref={mapRef} className="w-full h-full min-h-[380px] sm:min-h-[420px] relative z-10" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-purple-50/80 to-indigo-50/50">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-gray-800">
                Loading Interactive Map...
              </p>
            </div>
          )}

          {/* Floating Pill Button: "Use my current Location" */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              type="button"
              onClick={handleLocateMe}
              className="bg-white text-purple-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-xl border border-purple-100 flex items-center gap-2 transition-all hover:bg-purple-50/90 active:scale-95 cursor-pointer"
            >
              {isGeocoding ? (
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              ) : (
                <FaLocationCrosshairs  className="h-4 w-4 text-purple-600" />
              )}
              <span>Use my current Location</span>
            </button>
          </div>
        </div>

        {/* Bottom Sheet Card: Selected Address & Confirm */}
        <div className="p-5 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 space-y-3 z-30">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">Deliver To</h4>
            <p className="text-[11px] text-gray-500 font-medium">
              Use your current location or manually Select location on map to guide delivery partners.
            </p>
          </div>

          {/* Distance Alert Warning if Pin is moved far away from current GPS */}
          {distanceKm > 0.5 && (
            <p className="text-[11px] font-semibold text-amber-600">
              Pin location is {distanceKm} Km far away from your device current location.
            </p>
          )}

          {/* Selected Location Details Card */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4.5 w-4.5 text-purple-700 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {isGeocoding ? (
                    <span className="inline-flex items-center gap-2 text-purple-600">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching location details...
                    </span>
                  ) : (
                    locationDetails.primaryTitle
                  )}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                  {locationDetails.address || locationDetails.formattedAddress}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isGeocoding}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer text-sm shadow-md"
            >
              <span>Confirm & Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
