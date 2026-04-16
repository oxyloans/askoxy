// SearchBar.tsx
import React, { useEffect, useState, useRef } from "react";
import { customerApi } from "../utils/axiosInstance";
import {
  FaSearch,
  FaTimes,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../Config";

interface Product {
  itemName: string;
  itemMrp: number;
  units: any;
  itemImage: string;
  weight: number;
  saveAmount: number;
  itemId: string;
  itemDescription: string;
  savePercentage: number | null;
  itemPrice: number;
  bmvCoins: number;
  quantity: number;
  barcodeValue: any;
}

interface Category {
  categoryLogo: string;
  itemsResponseDtoList: Product[];
  categoryName: string;
}

interface ApiResponse {
  agents: any[];
  items: Category[];
  empty: boolean;
}

interface SearchItem {
  itemId: string;
  itemName: string;
  itemMrp: number;
  units: string | null;
  itemImage: string;
  weight: number;
  saveAmount: number;
  itemDescription: string;
  savePercentage: number | null;
  itemPrice: number;
  quantity: number | null;
  categoryName: string;
  isDefaultSuggestion?: boolean;
}
interface VoiceSearchResponse {
  transcript?: string;
  keyword?: string;
  productIds?: string[];
  products?: Category[];
}

const defaultSuggestions = [
  "Basmati Rice",
  "HMT",
  "Cashews",
  "Brown Rice",
  "Gold",
  "SonaMasoori",
  "P2P Lending AI Agent",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<
    "idle" | "listening" | "processing"
  >("idle");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const skipAutoSearchRef = useRef(false);

  const MIN_SEARCH_LENGTH = 3;
  const isVoicePendingRoute = Boolean(location.state?.voiceSearchPending);
  const hasVoiceResponseRoute = Boolean(location.state?.voiceSearchData);
  const isVoiceRouteActive = isVoicePendingRoute || hasVoiceResponseRoute;

  useEffect(() => {
    if (location.state?.selectedItemName) {
      setSearchValue(location.state.selectedItemName);
    }
    // Clear search when clearSearch state is received
    if (location.state?.clearSearch) {
      setSearchValue("");
      setDebouncedValue("");
      setSearchResults([]);
      // Clear the state to prevent repeated clearing
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // ⭐ AUTO-SEARCH: MOBILE = SHOW RESULTS, DESKTOP = NAVIGATE TO SEARCH PAGE
  useEffect(() => {
    if (skipAutoSearchRef.current) {
      skipAutoSearchRef.current = false;
      return;
    }
    if (debouncedValue.trim().length >= MIN_SEARCH_LENGTH) {
      // Detect if mobile device
      const isMobile = window.innerWidth < 640;

      if (isMobile) {
        // Mobile: Perform search directly and show results in dropdown
        performSearch(debouncedValue.trim());
      } else {
        // Desktop: Navigate to search page
        setIsFocused(false); // ⭐ closes dropdown when navigation happens
        setSearchResults([]); // ⭐ avoid blank dropdown area
        navigate(
          `/main/search-main?q=${encodeURIComponent(debouncedValue.trim())}`,
        );
      }
    }
  }, [debouncedValue, navigate]);

  useEffect(() => {
    if (isVoiceRouteActive) return;
    // Only run this auto-back logic when the SearchBar itself is active
    if (!isFocused) return;

    const timer = setTimeout(() => {
      if (
        searchValue.trim() === "" &&
        location.pathname === "/main/search-main"
      ) {
        setIsFocused(false);
        setSearchResults([]);
        navigate("/main/dashboard/home", { state: null });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, location.pathname, isFocused, isVoiceRouteActive, navigate]);
  // ✅ AUTO-REDIRECT TO HOME WHEN USER CLEARS / BACKSPACES BELOW 3 CHARS
  // But keep dropdown visible for suggestions
  useEffect(() => {
    if (isVoiceRouteActive) return;
    const trimmed = searchValue.trim();

    if (
      location.pathname === "/main/search-main" &&
      trimmed.length < MIN_SEARCH_LENGTH
    ) {
      // Don't clear searchResults - let the other useEffect handle showing default suggestions
      setIsFocused(false);
      // setSearchResults([]); // Remove this line to keep dropdown visible
      navigate("/main/dashboard/home", { replace: true, state: null });
    }
  }, [searchValue, location.pathname, isVoiceRouteActive, navigate]);

  useEffect(() => {
    if (isFocused && searchValue.trim() === "") {
      // Show default suggestions only when focused and search is empty
      setSearchResults(
        defaultSuggestions.map((name, index) => ({
          itemId: `temp-${index}`,
          itemName: name,
          itemMrp: 0,
          units: null,
          itemImage: "",
          weight: 0,
          saveAmount: 0,
          itemDescription: "",
          savePercentage: null,
          itemPrice: 0,
          quantity: null,
          categoryName: "",
          isDefaultSuggestion: true,
        })),
      );
    } else if (!isFocused || (searchValue.trim() !== "" && !isFocused)) {
      // Clear results when not focused
      setSearchResults([]);
    }
  }, [searchValue, isFocused]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      // If query is completely empty, don't clear results - let useEffect handle default suggestions
      setIsSearching(false);
      return;
    }
    if (query.trim().length < MIN_SEARCH_LENGTH) {
      // For short queries, don't clear results - let useEffect handle default suggestions
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await customerApi.get<ApiResponse>(
        `${BASE_URL}/product-service/dynamicSearch`,
        {
          params: { q: query },
        },
      );

      const products = (response.data.items || []).flatMap(
        (category: Category) =>
          category.itemsResponseDtoList
            .filter((p) => p.itemPrice > 0 && p.itemMrp > 0 && p.quantity > 0)
            .map((product: Product) => ({
              ...product,
              categoryName: category.categoryName,
            })),
      );

      const mapped = products.map((p) => ({
        itemId: p.itemId || "",
        itemName: p.itemName || "",
        itemMrp: p.itemMrp || 0,
        units: p.units || null,
        itemImage: p.itemImage || "",
        weight: p.weight || 0,
        saveAmount: p.saveAmount || 0,
        itemDescription: p.itemDescription || "",
        savePercentage: p.savePercentage || null,
        itemPrice: p.itemPrice || 0,
        quantity: p.quantity || null,
        categoryName: p.categoryName || "",
      })) as SearchItem[];

      setSearchResults(mapped.slice(0, 10));
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed && trimmed.length >= MIN_SEARCH_LENGTH) {
      navigate(`/main/search-main?q=${encodeURIComponent(trimmed)}`);
      setIsFocused(false);
      // Don't clear searchResults - let default suggestions remain
      // setSearchResults([]);
    } else {
      // For empty or short searches, keep dropdown open with suggestions
      // Don't navigate away or close dropdown
      // The useEffect will ensure default suggestions are shown
    }
  };
  const handleClearSearch = () => {
    setSearchValue("");
    setDebouncedValue(""); // ✅ important: stop auto effect
    if (location.pathname === "/main/search-main") {
      navigate("/main/dashboard/home", {
        replace: true,
        state: { clearSearch: true },
      });
    }
    // Keep dropdown open to show default suggestions
    // The useEffect will automatically show default suggestions when searchValue becomes empty
  };

  const handleItemClick = (item: SearchItem) => {
    setSearchValue(item.itemName);
    setIsFocused(false);
    setSearchResults([]);

    const isDefaultSuggestion =
      item.isDefaultSuggestion ||
      defaultSuggestions.some(
        (suggestion) =>
          suggestion.toLowerCase() === item.itemName.toLowerCase(),
      );

    if (isDefaultSuggestion) {
      // For default suggestions, always navigate to search page (both mobile and desktop)
      navigate(`/main/search-main?q=${encodeURIComponent(item.itemName)}`);
    } else {
      // For actual search results, navigate to item details
      navigate(`/main/itemsdisplay/${item.itemId}`, {
        state: { item, selectedItemName: item.itemName },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(e);
    }
  };

  const submitVoiceFile = async (audioFile: File | Blob) => {
    setVoiceError("");
    setVoiceStatus("processing");
    setIsVoiceLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioFile, `voice-${Date.now()}.webm`);
      const response = await fetch(`${BASE_URL}/product-service/voice-search`, {
        method: "POST",
        headers: {
          accept: "*/*",
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Unable to process voice search");
      }
      const voiceData = (await response.json()) as VoiceSearchResponse;
      const voiceQuery =
        voiceData.keyword?.trim() || voiceData.transcript?.trim() || "";
      if (!voiceData.products?.length) {
        setVoiceError(
          "No products found for this voice search. Please try speaking again.",
        );
        setVoiceStatus("idle");
      } else {
        skipAutoSearchRef.current = true;
        // setSearchValue(voiceData.transcript || voiceQuery); // Remove to prevent triggering text search
        if (location.pathname !== "/main/search-main") {
          navigate("/main/search-main", {
            state: { voiceSearchData: voiceData },
          });
        } else {
          navigate("/main/search-main", {
            state: { voiceSearchData: voiceData },
            replace: true,
          });
        }
        setIsFocused(false);
        setSearchResults([]);
        setVoiceStatus("idle");
      }
    } catch (error) {
      console.error("Voice search failed:", error);
      setVoiceError("Voice search failed. Please try again in a moment.");
      setVoiceStatus("idle");
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError("Voice recording is not supported on this browser.");
      return;
    }
    setVoiceError("");
    setVoiceStatus("listening");
    setIsRecording(true);
    setIsFocused(false);
    setSearchResults([]);
    inputRef.current?.blur();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        stream.getTracks().forEach((track) => track.stop());
        if (!audioBlob.size) {
          setVoiceError("No voice captured. Please try again.");
          setVoiceStatus("idle");
          return;
        }
        await submitVoiceFile(audioBlob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (error) {
      console.error("Microphone permission denied or unavailable:", error);
      setVoiceError("Unable to access microphone. Please allow permission.");
      setVoiceStatus("idle");
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setVoiceStatus("processing");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-4 pr-12 py-2.5 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-400 hover:shadow-md"
          placeholder="Search by items or agents... (min 3 chars)"
          aria-label="Search"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <FaTimes className="text-base" />
            </button>
          )}
          {/* <button
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`p-1 rounded-full transition-all duration-200 ${
              isRecording
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-500"
            } ${isVoiceLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            title={
              isVoiceLoading
                ? "Processing voice search"
                : isRecording
                  ? "Stop recording"
                  : "Start voice search"
            }
            disabled={isVoiceLoading}
            aria-pressed={isRecording}
          >
            {isVoiceLoading ? (
              <FaSpinner className="animate-spin text-base" />
            ) : isRecording ? (
              <FaMicrophoneSlash className="text-base" />
            ) : (
              <FaMicrophone className="text-base" />
            )}
          </button> */}
          <button
            type="submit"
            className="p-1 text-gray-400 hover:text-purple-500 transition-all duration-200"
          >
            <FaSearch className="text-base" />
          </button>
        </div>
      </form>
      {(voiceError || voiceStatus !== "idle") && (
        <p className="mt-2 text-xs text-gray-600">
          {voiceStatus === "listening"
            ? "Listening... speak clearly and tap the mic again to stop."
            : voiceStatus === "processing"
              ? "Processing voice search... please wait."
              : voiceError}
        </p>
      )}

      {/* Dropdown Results */}
      {searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-[1050] mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[320px] md:max-h-96 overflow-y-auto"
          style={{ touchAction: "pan-y" }}
        >
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="text-gray-500 text-sm">Searching...</span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((item) => (
                <button
                  key={item.itemId}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-medium text-sm md:text-base text-gray-800 line-clamp-1">
                      {item.itemName}
                    </span>
                    {!item.isDefaultSuggestion && (
                      <span className="text-gray-500 text-xs flex-shrink-0 hidden sm:block">
                        {item.weight}kg · {item.categoryName}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchValue.length >= MIN_SEARCH_LENGTH ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">No results found</p>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">
                Type at least 3 characters to search...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
