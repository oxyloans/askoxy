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
  isDefaultSuggestion?: boolean;
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
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/product-service/showGroupItemsForCustomrs`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        console.log(
          "Raw response from showGroupItemsForCustomrs:",
          response.data
        );
        const items = flattenResponse(response.data);
        console.log("Flattened items:", items);
        setAllItems(
          items.filter(
            (item) => item.itemMrp > 0 && item.categoryName !== "Sample Rice"
          )
        );
      } catch (error) {
        console.error(
          "Error fetching items from showGroupItemsForCustomrs:",
          error
        );
        setAllItems([]);
      }
    };

    fetchAllItems();
  }, []);

  useEffect(() => {
    if (location.state?.selectedItemName) {
      setSearchValue(location.state.selectedItemName);
    }
  }, [location.state]);

  const flattenResponse = (data: any): SearchItem[] => {
    console.log("Raw data to flatten:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Response data is not an array or is empty:", data);
      return [];
    }

    const items: SearchItem[] = data.flatMap((group: any) => {
      if (!group.categories || !Array.isArray(group.categories)) {
        console.warn("Group missing categories:", group);
        return [];
      }

      return group.categories.flatMap((category: any) => {
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
            itemName: item.itemName || "",
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
    });

    console.log("Flattened and filtered items:", items);
    return items;
  };

  const performSearch = (query: string): SearchItem[] => {
    if (!query.trim()) {
      console.log("Query is empty, returning empty results");
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }

    setIsSearching(true);
    console.log("Starting client-side search for:", query);
    const lowercaseQuery = query.trim().toLowerCase();
    const queryWords = lowercaseQuery
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const matchedSuggestion = defaultSuggestions.find(
      (suggestion) => suggestion.toLowerCase() === lowercaseQuery
    );
    const normalizedQuery = matchedSuggestion || query.trim();
    const isNumericQuery = !isNaN(Number(query));

    let results = allItems;
    console.log("All items available for search:", allItems); // Debug allItems content

    if (isNumericQuery) {
      results = allItems.filter((item) =>
        item.weight.toString().includes(query.trim())
      );
    } else {
      if (
        ["rain", "raincoat", "rain coat", "rain suit"].includes(lowercaseQuery)
      ) {
        results = allItems.filter(
          (item) =>
            item.categoryName.toLowerCase() === "monsoon magic" &&
            !item.itemName.toLowerCase().includes("umbrella")
        );
      } else if (["bulb", "bulbs"].includes(lowercaseQuery)) {
        results = allItems.filter(
          (item) =>
            item.categoryName.toLowerCase() === "bulb & batteries" &&
            item.itemName.toLowerCase().includes("bulb")
        );
      } else if (["battery", "batteries"].includes(lowercaseQuery)) {
        results = allItems.filter(
          (item) =>
            item.categoryName.toLowerCase() === "bulb & batteries" &&
            item.itemName.toLowerCase().includes("battery")
        );
      } else {
        const fuse = new Fuse(allItems, {
          keys: ["itemName", "categoryName"],
          isCaseSensitive: false,
          threshold: 0.3,
          includeMatches: true,
          includeScore: true,
          shouldSort: true,
          minMatchCharLength: 2,
        });
        const fuseResults = fuse.search(normalizedQuery);
        console.log("Fuse search raw results with scores:", fuseResults); // Debug raw results

        results = fuseResults
          .map((result) => result.item)
          .filter((item) => {
            return queryWords.some(
              (word: string) =>
                item.itemName.toLowerCase().includes(word) ||
                item.categoryName.toLowerCase().includes(word)
            );
          });
      }
    }

    const filteredResults = results.filter(
      (item) => item.itemMrp > 0 && item.categoryName !== "Sample Rice"
    );

    console.log("Filtered search results:", filteredResults);
    setSearchResults(filteredResults.slice(0, 10));
    setIsSearching(false);
    return filteredResults;
  };

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      console.log("Performing search for:", searchValue);
      const results = performSearch(searchValue);
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
    } else {
      console.log("Input not focused and empty, clearing results");
      setSearchResults([]);
    }
  }, [searchValue, isFocused, allItems]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const results = performSearch(searchValue);
      console.log("Results for navigation:", results);
      navigate("search-main", { state: { searchResults: results } });
      setIsFocused(false);
    }
  };

  const handleItemClick = (item: SearchItem) => {
    setSearchValue(item.itemName);
    setIsFocused(false);

    const isDefaultSuggestion = defaultSuggestions.some(
      (suggestion) => suggestion.toLowerCase() === item.itemName.toLowerCase()
    );

    if (isDefaultSuggestion) {
      const matchedSuggestion = defaultSuggestions.find(
        (suggestion) => suggestion.toLowerCase() === item.itemName.toLowerCase()
      );
      const itemName = matchedSuggestion || item.itemName;
      const lowercaseQuery = itemName.toLowerCase();
      const queryWords = lowercaseQuery
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const fuse = new Fuse(allItems, {
        keys: ["itemName", "categoryName"],
        isCaseSensitive: false,
        threshold: 0.3,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 2,
      });
      const fetchedResults = fuse
        .search(itemName)
        .map((result) => result.item)
        .filter((item) => {
          if (
            ["rain", "raincoat", "rain coat", "rain suit"].includes(
              lowercaseQuery
            )
          ) {
            return (
              item.categoryName.toLowerCase() === "monsoon magic" &&
              !item.itemName.toLowerCase().includes("umbrella")
            );
          } else if (["bulb", "bulbs"].includes(lowercaseQuery)) {
            return (
              item.categoryName.toLowerCase() === "bulb & batteries" &&
              item.itemName.toLowerCase().includes("bulb")
            );
          } else if (["battery", "batteries"].includes(lowercaseQuery)) {
            return (
              item.categoryName.toLowerCase() === "bulb & batteries" &&
              item.itemName.toLowerCase().includes("battery")
            );
          }
          return queryWords.some(
            (word: string) =>
              item.itemName.toLowerCase().includes(word) ||
              item.categoryName.toLowerCase().includes(word)
          );
        });
      navigate("search-main", {
        state: {
          searchResults: fetchedResults,
          itemName,
          selectedItemName: item.itemName,
        },
      });
    } else {
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
          setTimeout(() => {
            if (document.activeElement !== inputRef.current) {
              setIsFocused(false);
              console.log("Input blurred, isFocused:", false);
            }
          }, 100);
        }}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500"
        placeholder="Search by name, category, or weight..."
        aria-label="Search"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
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
                  e.preventDefault();
                  handleItemClick(item);
                }}
                className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex justify-between">
                  <span>{item.itemName}</span>
                  {!item.isDefaultSuggestion && (
                    <span className="text-gray-500 text-sm">
                      {item.weight} {item.units || "kg"} ({item.categoryName})
                    </span>
                  )}
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
