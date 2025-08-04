import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../Config";
import CartProvider from "./CartProvider";
// const BASE_URL = "https://meta.oxyglobal.tech/api";

interface SearchResult {
  id: string;
  name: string; // This will hold either item name or category name
  type: "item" | "category"; // Distinguishes result types
}

interface SearchContextType {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchProducts: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim().length >= 2) {
        searchProducts(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    try {
      const [itemsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/product-service/search?searchText=${encodeURIComponent(query)}`),
      ]);

      const formattedResults: SearchResult[] = [
        ...itemsResponse.data.map((item: any) => ({ id: item.id, name: item.productName, type: "item" }))
      ];

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <CartProvider>
      <SearchContext.Provider value={{ searchValue, setSearchValue, searchResults, isSearching, searchProducts }}>
        {children}
      </SearchContext.Provider>
    </CartProvider>
  );
};
