import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  ArrowRight,
  X,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import Header from "./Header";
import BASE_URL from "../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Type definitions
interface Agreement {
  id?: string;
  agreementName: string;
  agreementDescription?: string;
  cacsName: string;
  caCsEntityId: string;
  cacsType: string;
  categorySubType?: string;
  price?: number;
  priceA?: number;
  priceB?: number;
  priceC?: number;
}

interface Category {
  name: string;
  entityId: string;
  hasSubCategories: boolean;
}

interface CityClassification {
  [state: string]: {
    A: string[];
    B: string[];
    C: string[];
  };
}

const CITY_CLASSIFICATIONS: CityClassification = {
  UTTARAKHAND: { A: [], B: ["Dehradun"], C: ["Other Cities"] },
  "WEST BENGAL": {
    A: ["Kolkata"],
    B: ["Asansol", "Siliguri", "Durgapur"],
    C: ["Other Cities"],
  },
};

export default function CAServicesApp() {
  // Core state
  const [allData, setAllData] = useState<Agreement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filteredAgreements, setFilteredAgreements] = useState<Agreement[]>([]);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Cart states
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Filter states
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCityClass, setSelectedCityClass] = useState<string | null>(
    null
  );
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // User authentication - Debug localStorage values
  const userId = localStorage.getItem("userId");
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");
  const customerId =
    localStorage.getItem("customerId") ||
    localStorage.getItem("userId") ||
    userId;

  // Debug log to see what values we're getting
  console.log("Debug - Auth values:", {
    userId,
    token: token ? "Present" : "Missing",
    customerId,
    allLocalStorage: Object.keys(localStorage),
  });

  // Navigation states
  const [currentView, setCurrentView] = useState<
    "CATEGORIES" | "SUBCATEGORIES" | "AGREEMENTS"
  >("CATEGORIES");

  // Fetch all data initially
  useEffect(() => {
    fetchAllData();
    if (customerId && token) {
      fetchCartItems();
    }
  }, []);

  // Filter agreements when filters change
  useEffect(() => {
    filterAgreements();
  }, [agreements, selectedCityClass]);

  const fetchAllData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(
        BASE_URL + "/product-service/getAllAgreements"
      );
      const data: Agreement[] = await response.json();

      // Filter data to only include CA SERVICE items
      const caServiceData = data.filter(
        (item) => item.cacsType?.toLowerCase() === "ca service"
      );

      setAllData(caServiceData);

      // Extract unique categories from filtered data
      const uniqueCategories = new Map<string, Category>();
      caServiceData.forEach((item) => {
        if (!uniqueCategories.has(item.cacsName)) {
          uniqueCategories.set(item.cacsName, {
            name: item.cacsName,
            entityId: item.caCsEntityId,
            hasSubCategories: false,
          });
        }
      });
      // Check if categories have subcategories
      const categoriesArray: Category[] = Array.from(
        uniqueCategories.values()
      ).map((category) => {
        const categoryItems = caServiceData.filter(
          (item) => item.cacsName === category.name
        );
        const hasNonEmptySubTypes = categoryItems.some(
          (item) =>
            item.categorySubType &&
            item.categorySubType.trim() !== "" &&
            item.categorySubType.trim() !== " "
        );

        return {
          ...category,
          hasSubCategories: hasNonEmptySubTypes,
        };
      });
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      if (!customerId || !token) return;

      const response = await axios.get(
        `https://meta.oxyloans.com/api/cart-service/cart/view?userId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Filter out items with "REMOVE" status
        const activeItems = response.data.filter(
          (item: any) => item.status !== "REMOVE"
        );

        // Extract agreement service IDs from active cart items only
        const cartItemIds = activeItems.map(
          (item: any) => item.agreementServiceId
        );

        setCartItems(new Set(cartItemIds));
        setCartCount(activeItems.length);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems(new Set());
      setCartCount(0);
    }
  };

  const isItemInCart = (agreementId: string) => {
    return cartItems.has(agreementId);
  };

  const handleAddToCart = async (agreement: Agreement) => {
    // Debug current auth state
    console.log("Add to cart - Auth check:", {
      customerId,
      token: token ? "Present" : "Missing",
      userId,
    });

    if (!customerId || !token) {
      // Check all possible localStorage keys for debugging
      const allKeys = Object.keys(localStorage);
      const authKeys = allKeys.filter(
        (key) =>
          key.toLowerCase().includes("token") ||
          key.toLowerCase().includes("user") ||
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("id")
      );

      console.log("Available auth-related localStorage keys:", authKeys);
      alert(
        `Please login to add items to cart. Debug info: customerId=${customerId}, token=${
          token ? "present" : "missing"
        }`
      );
      return;
    }

    // Check if item is already in cart
    if (isItemInCart(agreement.id!)) {
      alert("This service is already in your cart.");
      return;
    }

    try {
      setCartLoading((prev) => ({ ...prev, [agreement.id!]: true }));

      const payload = {
        agreementServiceId: agreement.id,
        agreementServiceName: agreement.agreementName,
        userId: customerId,
      };

      const response = await axios.post(
        "http://meta.oxyloans.com/api/cart-service/cart/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item added to cart successfully:", response.data);

      // Check if response is successful
      if (response.data && response.data.id) {
        // Refresh cart items to get updated state
        await fetchCartItems();

        alert("Service added to cart successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      let errorMessage = "Failed to add service to cart. Please try again.";

      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = "Please login again to add items to cart.";
        } else if (status === 409) {
          errorMessage = "This service is already in your cart.";
          // Update local state to reflect this
        } else if (status === 400) {
          errorMessage = "Invalid request. Please try again.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setCartLoading((prev) => ({ ...prev, [agreement.id!]: false }));
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);

    // Get items for this category
    const categoryItems = allData.filter(
      (item) => item.cacsName === category.name
    );

    if (category.hasSubCategories) {
      // Extract unique subcategories
      const subTypeItems = categoryItems
        .filter(
          (item) =>
            item.categorySubType &&
            item.categorySubType.trim() !== "" &&
            item.categorySubType.trim() !== " "
        )
        .map((item) => item.categorySubType!.trim());

      const uniqueSubCategories = Array.from(new Set(subTypeItems));

      setSubCategories(uniqueSubCategories);
      setCurrentView("SUBCATEGORIES");
    } else {
      // Show agreements directly
      setAgreements(categoryItems);
      setCurrentView("AGREEMENTS");
    }

    // Reset filters
    resetFilters();
  };

  const handleSubCategoryPress = (subCategory: string) => {
    setSelectedSubCategory(subCategory);

    // Get agreements for this subcategory
    const subCategoryItems = allData.filter(
      (item) =>
        item.cacsName === selectedCategory?.name &&
        item.categorySubType &&
        item.categorySubType.trim() === subCategory
    );

    setAgreements(subCategoryItems);
    setCurrentView("AGREEMENTS");

    // Reset filters
    resetFilters();
  };

  const filterAgreements = () => {
    setFilteredAgreements(agreements);
  };

  const resetFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedCityClass(null);
  };

  const handleBackNavigation = () => {
    if (currentView === "AGREEMENTS") {
      if (selectedCategory?.hasSubCategories) {
        setCurrentView("SUBCATEGORIES");
        setSelectedSubCategory(null);
      } else {
        setCurrentView("CATEGORIES");
        setSelectedCategory(null);
      }
    } else if (currentView === "SUBCATEGORIES") {
      setCurrentView("CATEGORIES");
      setSelectedCategory(null);
      setSubCategories([]);
    }

    setAgreements([]);
    setFilteredAgreements([]);
    resetFilters();
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSelectedCity(null);
    setSelectedCityClass(null);
    setShowStateModal(false);
    setShowCityModal(true);
  };

  const handleCitySelect = (city: string, cityClass: string) => {
    setSelectedCity(city);
    setSelectedCityClass(cityClass);
    setShowCityModal(false);
  };

  const getAvailableCities = () => {
    if (!selectedState || !CITY_CLASSIFICATIONS[selectedState]) return [];

    const stateData = CITY_CLASSIFICATIONS[selectedState];
    const cities: Array<{ name: string; class: string }> = [];

    Object.keys(stateData).forEach((cityClass) => {
      stateData[cityClass as keyof typeof stateData].forEach((city) => {
        cities.push({ name: city, class: cityClass });
      });
    });

    return cities;
  };

  const clearFilters = () => {
    resetFilters();
  };

  const getPriceForCityTier = (agreement: Agreement): number | undefined => {
    if (!selectedCityClass) return undefined;

    switch (selectedCityClass) {
      case "A":
        return agreement.priceA || agreement.price;
      case "B":
        return agreement.priceB || agreement.price;
      case "C":
        return agreement.priceC || agreement.price;
      default:
        return agreement.price;
    }
  };

  const formatPrice = (price: number | undefined): string => {
    if (!price) return "Contact for pricing";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handleNavigateToCart = () => {
    console.log("Navigate to cart");
    navigate("/main/cartcaservice");
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>{!userId && <Header />}</div>

      {/* Simple navigation with back button and text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        {currentView !== "CATEGORIES" && (
          <div className="relative flex items-center justify-center mb-4">
            {/* Back Button */}
            <button
              onClick={handleBackNavigation}
              className="absolute left-0 flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>

            {/* Centered Heading */}
            <span className="text-yellow-600 font-bold text-lg text-center">
              {selectedCategory?.name}
              {selectedSubCategory && ` > ${selectedSubCategory}`}
            </span>

            {customerId && token && (
              <button
                className="absolute top-0 right-0 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow border border-gray-200"
                onClick={() => handleNavigateToCart()}
              >
                <ShoppingCart className="w-6 h-6 text-purple-600" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Location & Service Info Bar */}
        {currentView === "AGREEMENTS" && (
          // <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Location Selection - Left Side */}
              {/* <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Location:
                </span>
                <button
                  onClick={() => setShowStateModal(true)}
                  className={`flex items-center px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    selectedState
                      ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-1">
                    {selectedState || "Select State"}
                  </span>
                  <MapPin className="w-3 h-3" />
                </button>

                {selectedState && (
                  <button
                    onClick={() => setShowCityModal(true)}
                    className={`flex items-center px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      selectedCity
                        ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-1">
                      {selectedCity || "Select City"}
                    </span>
                    <MapPin className="w-3 h-3" />
                  </button>
                )}

                {(selectedState || selectedCity) && (
                  <button
                    onClick={clearFilters}
                    className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div> */}

              {/* Service Info - Right Side */}
              {/* <div className="text-right">
                <p className="text-sm text-blue-700 font-medium">
                  {selectedCity
                    ? `Pricing for ${selectedCity} | Click to add to cart`
                    : "Select location for pricing | Click to add to cart"}
                </p>
              </div> */}
            </div>
          // </div>
        )}

        {/* Categories View - Column Layout */}
        {currentView === "CATEGORIES" && (
          <div>
            <div className="text-center mb-8 relative">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                Professional Chartered Accountant Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a service category to get started
              </p>

              {/* Cart Icon in Categories Header */}
              {customerId && token && (
                <button
                  className="absolute top-0 right-0 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow border border-gray-200"
                  onClick={() => handleNavigateToCart()}
                >
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </div>
                  )}
                </button>
              )}
            </div>

            <div className="max-w-4x2 mx-auto">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategoryPress(category)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-400 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.hasSubCategories
                              ? "Multiple services available"
                              : "View service access"}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subcategories View - Column Layout */}
        {currentView === "SUBCATEGORIES" && (
          <div className="p-4">
            {/* Header Removed, replaced with subtle text */}
            <div className="mb-6 text-center">
              <p className="text-base text-gray-700">
                Select the type of service you want to proceed with
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((subCategory, index) => (
                <div
                  key={index}
                  onClick={() => handleSubCategoryPress(subCategory)}
                  className="flex items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{subCategory}</h3>
                    <p className="text-sm text-gray-500">
                      Tap to view services
                    </p>
                  </div>

                  <div className="text-blue-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Agreements View - Constrained Width Column Layout */}
        {currentView === "AGREEMENTS" && (
          <div>
            {/* Two Column Layout */}
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAgreements.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="max-w-sm mx-auto">
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No services found
                      </p>
                      <p className="text-gray-500">
                        Please try again later or contact us directly
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredAgreements.map((agreement, index) => (
                    <div
                      key={agreement.id || index}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-4xl">👨🏻‍🎓</span>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 mb-1">
                              {agreement.agreementName}
                            </p>

                            {selectedCity && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 inline-block">
                                <span className="text-sm font-semibold text-blue-700">
                                  {formatPrice(getPriceForCityTier(agreement))}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add to Cart Button - Show for all users but handle login check inside */}
                        <button
                          className={`rounded-lg px-3 py-2 flex items-center gap-2 transition-all text-sm font-semibold ${
                            !customerId || !token
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                              : isItemInCart(agreement.id!)
                              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                              : cartLoading[agreement.id!]
                              ? "bg-blue-100 text-blue-600 cursor-wait"
                              : "bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer"
                          }`}
                          onClick={() => handleAddToCart(agreement)}
                          disabled={
                            (customerId &&
                              token &&
                              isItemInCart(agreement.id!)) ||
                            cartLoading[agreement.id!]
                          }
                        >
                          {cartLoading[agreement.id!] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span>Adding...</span>
                            </>
                          ) : !customerId || !token ? (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </>
                          ) : isItemInCart(agreement.id!) ? (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>In Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Description */}
                      <div className="px-4 py-3 bg-gray-50">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {agreement.agreementDescription ||
                            "Professional CA service available for your business needs."}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* State Selection Modal */}
      {showStateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <p className="text-lg font-semibold text-gray-900">
                Select State/UT
              </p>
              <button
                onClick={() => setShowStateModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {Object.keys(CITY_CLASSIFICATIONS)
                .sort()
                .map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedState === state
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {state}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* City Selection Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <p className="text-lg font-semibold text-gray-900">
                Select City in {selectedState}
              </p>
              <button
                onClick={() => setShowCityModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {getAvailableCities().map((city) => (
                <button
                  key={`${city.name}-${city.class}`}
                  onClick={() => handleCitySelect(city.name, city.class)}
                  className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedCity === city.name
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{city.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        city.class === "A"
                          ? "bg-yellow-100 text-yellow-800"
                          : city.class === "B"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Tier {city.class}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
