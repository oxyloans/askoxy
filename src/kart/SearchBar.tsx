import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import Fuse from "fuse.js";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../Config";

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
}

interface SearchParams {
  page: number;
  size?: number;
  weight?: number;
  itemName?: string;
  categoryName?: string;
}

const defaultSuggestions = [
  "HMT",
  "Sonamasoori",
  "Brown Rice",
  "Kolam Rice",
  "Low GI",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added to check for incoming state
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optional: Initialize searchValue from location state if navigated back with a value
  useEffect(() => {
    if (location.state?.selectedItemName) {
      setSearchValue(location.state.selectedItemName);
    }
  }, [location.state]);

  const fetchSearchResults = async (query: string): Promise<SearchItem[]> => {
    if (!query.trim()) {
      console.log("Query is empty, returning empty results");
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }
    setIsSearching(true);
    console.log("Starting search for:", query);
    try {
      const token = localStorage.getItem("accessToken");
      const lowercaseQuery = query.trim().toLowerCase();
      // Map query to default suggestion case if it matches
      const matchedSuggestion = defaultSuggestions.find(
        (suggestion) => suggestion.toLowerCase() === lowercaseQuery
      );
      const normalizedQuery = matchedSuggestion || query.trim();
      const isNumericQuery = !isNaN(Number(query));
      let params: SearchParams = { page: 0, size: 10 };
      let results: SearchItem[] = [];

      if (isNumericQuery) {
        params = { ...params, weight: Number(query) };
        console.log("Weight search params:", params);
        try {
          const response = await axios.get(
            `${BASE_URL}/product-service/search`,
            {
              params,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          console.log("Weight search raw response:", response.data);
          results = flattenResponse(response.data);
        } catch (error) {
          console.warn("Weight search failed:", error);
          params = { page: 0, size: 10, categoryName: normalizedQuery };
          console.log("Fallback categoryName params:", params);
          const fallbackResponse = await axios.get(
            `${BASE_URL}/product-service/search`,
            {
              params,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          console.log("Fallback raw response:", fallbackResponse.data);
          results = flattenResponse(fallbackResponse.data);
        }
      } else {
        params = { ...params, categoryName: normalizedQuery };
        console.log("CategoryName search params:", params);
        const response = await axios.get(`${BASE_URL}/product-service/search`, {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log("CategoryName raw response:", response.data);
        results = flattenResponse(response.data);
      }

      // Apply Fuse.js for fuzzy, case-insensitive search
      if (!isNumericQuery && results.length > 0) {
        const fuse = new Fuse(results, {
          keys: ["itemName", "categoryName"], // Include categoryName for broader matching
          isCaseSensitive: false,
          threshold: 0.3, // Tighter matching for more relevant results
          includeScore: true,
          shouldSort: true,
          minMatchCharLength: 1,
        });
        const fuseResults = fuse.search(lowercaseQuery);
        results = fuseResults.map((result) => result.item);
      }

      const filteredSearchResults = results.filter(
        (item) => item.itemMrp > 0 && item.categoryName !== "Sample Rice"
      );

      console.log("Fetched and filtered results:", filteredSearchResults);
      setSearchResults(filteredSearchResults); // Ensure state is updated
      setIsSearching(false);
      return filteredSearchResults;
    } catch (error) {
      console.error("Error searching items:", error);
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }
  };

  const flattenResponse = (data: any): SearchItem[] => {
    console.log("Raw data to flatten:", data);

    if (!Array.isArray(data)) {
      console.warn("Response data is not an array:", data);
      return [];
    }

    const items: SearchItem[] = data.flatMap((category: any) => {
      if (
        !category.itemsResponseDtoList ||
        !Array.isArray(category.itemsResponseDtoList)
      ) {
        console.warn("Category missing itemsResponseDtoList:", category);
        return [];
      }

      return category.itemsResponseDtoList
        .filter((item: any) => item.itemMrp > 0)
        .map((item: any) => ({
          itemId: item.itemId || "",
          itemName: item.itemName || "", // Keep original case for display
          itemMrp: item.itemMrp || 0,
          units: item.units || null,
          itemImage: item.itemImage || "",
          weight: item.weight || 0,
          saveAmount: item.saveAmount || 0,
          itemDescription: item.itemDescription || "",
          savePercentage: item.savePercentage || null,
          itemPrice: item.itemPrice || 0,
          quantity: item.quantity || null,
          categoryName: category.categoryName || "",
        }));
    });

    console.log("Flattened and filtered items:", items);
    return items;
  };

  useEffect(() => {
    const fetchAndUpdateResults = async () => {
      if (searchValue.trim().length > 0) {
        console.log("Fetching search results for:", searchValue);
        const results = await fetchSearchResults(searchValue);
        console.log("Setting searchResults:", results);
        setSearchResults(results.slice(0, 10));
      } else if (isFocused) {
        console.log(
          "Input focused with empty value, setting default suggestions"
        );
        setSearchResults(
          defaultSuggestions.map((name, index) => ({
            itemId: `temp-${index}`,
            itemName: name,
            itemMrp: 0,
            units: "kg",
            itemImage: "",
            weight: 1,
            saveAmount: 0,
            itemDescription: "",
            savePercentage: null,
            itemPrice: 0,
            quantity: null,
            categoryName: name,
          }))
        );
      } else {
        console.log("Input not focused and empty, clearing results");
        setSearchResults([]);
      }
    };

    fetchAndUpdateResults();
  }, [searchValue, isFocused]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const results = await fetchSearchResults(searchValue);
      console.log("Results for navigation:", results);
      navigate("search-main", { state: { searchResults: results } });
      setIsFocused(false);
    }
  };

  const handleItemClick = async (item: SearchItem) => {
    setSearchValue(item.itemName);
    setIsFocused(false); // Close suggestions immediately

    const isDefaultSuggestion = defaultSuggestions.some(
      (suggestion) => suggestion.toLowerCase() === item.itemName.toLowerCase()
    );

    if (isDefaultSuggestion) {
      try {
        const token = localStorage.getItem("accessToken");
        // Use the exact case from defaultSuggestions
        const matchedSuggestion = defaultSuggestions.find(
          (suggestion) =>
            suggestion.toLowerCase() === item.itemName.toLowerCase()
        );
        const categoryName = matchedSuggestion || item.itemName;
        const params: SearchParams = {
          page: 0,
          size: 10,
          categoryName,
        };
        const response = await axios.get(`${BASE_URL}/product-service/search`, {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const fetchedResults = flattenResponse(response.data);
        navigate("search-main", {
          state: {
            searchResults: fetchedResults,
            categoryName,
            selectedItemName: item.categoryName,
          },
        });
      } catch (error) {
        console.error("Error fetching category items:", error);
        setSearchResults([]);
        navigate("search-main", {
          state: { searchResults: [], categoryName: item.categoryName },
        });
      }
    } else {
      // Navigate to item details directly
      navigate(`/main/itemsdisplay/${item.itemId}`, {
        state: { item, selectedItemName: item.itemName },
      });
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          console.log("Input focused, isFocused:", true);
        }}
        onBlur={(e) => {
          // Delay blur to allow click to register
          setTimeout(() => {
            if (document.activeElement !== inputRef.current) {
              setIsFocused(false);
              console.log("Input blurred, isFocused:", false);
            }
          }, 100); // 200ms delay
        }}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500"
        placeholder="Search by name, category, or weight..."
        aria-label="Search"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")} // Clear the input
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <FaTimes className="text-base" />
          </button>
        )}
        <button
          type="submit"
          className="ml-2 text-gray-400 hover:text-purple-500"
        >
          <FaSearch className="text-base" />
        </button>
      </div>
      {isFocused && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <p className="text-gray-500 text-sm p-2">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item.itemId}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent default to avoid blur interference
                  handleItemClick(item);
                }}
                className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex justify-between">
                  <span>{item.itemName}</span>
                  <span className="text-gray-500 text-sm">
                    {/* {item.categoryName} - {item.weight} {item.units || "kg"} */}
                  </span>
                </div>
              </div>
            ))
          ) : searchValue.length >= 1 ? (
            <p className="text-gray-500 text-sm p-2">No results found</p>
          ) : (
            <p className="text-gray-500 text-sm p-2">
              Choose a suggestion or type to search...
            </p>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
