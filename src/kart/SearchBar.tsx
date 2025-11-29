// SearchBar.tsx
import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
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

const defaultSuggestions = [
  "Low GI",
  "Sonamasoori",
  "Brown Rice",
  "Kolam Rice",
  "HMT",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const MIN_SEARCH_LENGTH = 3;

  useEffect(() => {
    if (location.state?.selectedItemName) {
      setSearchValue(location.state.selectedItemName);
    }
  }, [location.state]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedValue(searchValue);
  }, 300);
  return () => clearTimeout(timer);
}, [searchValue]);

// ⭐ AUTO-NAVIGATE TO SEARCH-MAIN WHEN USER TYPES 3+ LETTERS
useEffect(() => {
  if (debouncedValue.trim().length >= MIN_SEARCH_LENGTH) {
    setIsFocused(false); // ⭐ closes dropdown when auto search happens
    setSearchResults([]); // ⭐ avoid blank dropdown area
    navigate("/main/search-main", {
      state: { searchQuery: debouncedValue.trim() },
    });
  }
}, [debouncedValue]);


  useEffect(() => {
    if (isFocused && searchValue.trim() === "") {
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
        }))
      );
    } else if (!isFocused && searchValue.trim() === "") {
      setSearchResults([]);
    }
  }, [isFocused, searchValue]);

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
    if (!query.trim() || query.trim().length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/product-service/dynamicSearch`,
        {
          params: { q: query },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const products = (response.data.items || []).flatMap(
        (category: Category) =>
          category.itemsResponseDtoList
            .filter((p) => p.itemPrice > 0 && p.itemMrp > 0 && p.quantity > 0)
            .map((product: Product) => ({
              ...product,
              categoryName: category.categoryName,
            }))
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
      navigate("/main/search-main", { state: { searchQuery: trimmed } });
      setIsFocused(false);
      setSearchResults([]);
    } else {
      navigate("/main/dashboard/home");
      setIsFocused(false);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    navigate("/main/dashboard/home");
  };

  const handleItemClick = (item: SearchItem) => {
    setSearchValue(item.itemName);
    setIsFocused(false);
    setSearchResults([]);

    const isDefaultSuggestion =
      item.isDefaultSuggestion ||
      defaultSuggestions.some(
        (suggestion) => suggestion.toLowerCase() === item.itemName.toLowerCase()
      );

    if (isDefaultSuggestion) {
      navigate("/main/search-main", {
        state: { searchQuery: item.itemName },
      });
    } else {
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
          <button
            type="submit"
            className="p-1 text-gray-400 hover:text-purple-500 transition-all duration-200"
          >
            <FaSearch className="text-base" />
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {isFocused && (
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
