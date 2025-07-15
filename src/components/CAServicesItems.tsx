import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  ArrowRight,
  X,
  MessageCircle,
} from "lucide-react";
import Header from "./Header";
import BASE_URL from "../Config";

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
  "ANDAMAN & NICOBAR ISLANDS": { A: [], B: [], C: ["All cities"] },
  "ANDHRA PRADESH": {
    A: [],
    B: ["Vijayawada", "Greater Visakhapatnam", "Guntur", "Nellore"],
    C: ["Other Cities"],
  },
  "ARUNACHAL PRADESH": { A: [], B: [], C: ["All cities"] },
  ASSAM: { A: [], B: ["Guwahati"], C: ["Other Cities"] },
  BIHAR: { A: [], B: ["Patna"], C: ["Other Cities"] },
  CHANDIGARH: { A: [], B: ["Chandigarh"], C: [] },
  CHHATTISGARH: {
    A: [],
    B: ["Durg-Bhilai Nagar", "Raipur"],
    C: ["Other Cities"],
  },
  "DADRA & NAGAR HAVELI": { A: [], B: [], C: ["All cities"] },
  "DAMAN & DIU": { A: [], B: [], C: ["All cities"] },
  DELHI: { A: ["Delhi"], B: [], C: [] },
  GOA: { A: [], B: [], C: ["All cities"] },
  GUJARAT: {
    A: ["Ahmedabad"],
    B: ["Rajkot", "Jamnagar", "Bhavnagar", "Vadodara", "Surat"],
    C: ["Other Cities"],
  },
  HARYANA: { A: [], B: ["Faridabad", "Gurgaon"], C: ["Other Cities"] },
  "HIMACHAL PRADESH": { A: [], B: [], C: ["All cities"] },
  "JAMMU & KASHMIR": { A: [], B: ["Srinagar", "Jammu"], C: ["Other Cities"] },
  JHARKHAND: {
    A: [],
    B: ["Jamshedpur", "Dhanbad", "Ranchi", "Bokro Stell City"],
    C: ["Other Cities"],
  },
  KARNATAKA: {
    A: ["Bengaluru"],
    B: ["Belgaum", "Hubli-Dharwad", "Mangalore", "Mysore", "Gulbarga"],
    C: ["Other Cities"],
  },
  KERALA: {
    A: [],
    B: [
      "Kozhikode",
      "Kochi",
      "Thiruvanathapuram",
      "Thrissur",
      "Malappuram",
      "Kannur",
      "Kollam",
    ],
    C: ["Other Cities"],
  },
  LAKSHADWEEP: { A: [], B: [], C: ["All cities"] },
  "MADHYA PRADESH": {
    A: [],
    B: ["Gwalior", "Indore", "Bhopal", "Jabalpur", "Ujjain"],
    C: ["Other Cities"],
  },
  MAHARASHTRA: {
    A: ["Greater Mumbai", "Pune"],
    B: [
      "Amravati",
      "Nagpur",
      "Aurangabad",
      "Nashik",
      "Bhiwandi",
      "Solapur",
      "Kolhapur",
      "Vasai-Virar City",
      "Malegaon",
      "Nansws-Waghala",
      "Sangli",
    ],
    C: ["Other Cities"],
  },
  MANIPUR: { A: [], B: [], C: ["All cities"] },
  MEGHALAYA: { A: [], B: [], C: ["All cities"] },
  MIZORAM: { A: [], B: [], C: ["All cities"] },
  NAGALAND: { A: [], B: [], C: ["All cities"] },
  ODISHA: {
    A: [],
    B: ["Cuttack", "Bhubaneswar", "Rourkela"],
    C: ["Other Cities"],
  },
  PUDUCHERRY: { A: [], B: ["Puducherry/ Pondicherry"], C: [] },
  PUNJAB: {
    A: [],
    B: ["Amritsar", "Jalandhar", "Ludhiana"],
    C: ["Other Cities"],
  },
  RAJASTHAN: {
    A: [],
    B: ["Bikaner", "Jaipur", "Jodhpur", "Kota", "Ajmer"],
    C: ["Other Cities"],
  },
  SIKKIM: { A: [], B: [], C: ["All cities"] },
  "TAMIL NADU": {
    A: ["Chennai"],
    B: [],
    C: [
      "Salem",
      "Tiruppur",
      "Coimbatore",
      "Tiruchirappalli",
      "Madurai",
      "Erode",
      "Other Cities",
    ],
  },
  TELANGANA: { A: ["Hyderabad"], B: [], C: ["Warangal", "Other Cities"] },
  TRIPURA: { A: [], B: [], C: ["All cities"] },
  "UTTAR PRADESH": {
    A: [],
    B: [
      "Moradabad",
      "Meerut",
      "Ghaziabad",
      "Aligarh",
      "Agra",
      "Bareilly",
      "Lucknow",
      "Kanpur",
      "Allahabad",
      "Gorakhpur",
      "Varanasi",
      "Saharanpur",
      "Noida",
      "Firozabad",
      "Jhansi",
    ],
    C: ["Other Cities"],
  },
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
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filteredAgreements, setFilteredAgreements] = useState<Agreement[]>([]);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCityClass, setSelectedCityClass] = useState<string | null>(
    null
  );
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const userId = localStorage.getItem("userId");
  // Navigation states
  const [currentView, setCurrentView] = useState<
    "CATEGORIES" | "SUBCATEGORIES" | "AGREEMENTS"
  >("CATEGORIES");

  // Fetch all data initially
  useEffect(() => {
    fetchAllData();
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

  const handleServiceSelection = (agreement: Agreement) => {
    const serviceName = agreement.agreementName;
    const categoryName = selectedCategory?.name;
    const subCategoryName = selectedSubCategory || "";
    const price = getPriceForCityTier(agreement);

    let message = `Hello, I'm interested in your CA services.

Service: ${serviceName}`;

    if (categoryName) {
      message += `
Category: ${categoryName}`;
    }

    if (subCategoryName) {
      message += `
Subcategory: ${subCategoryName}`;
    }

    if (selectedCity && selectedState) {
      message += `
Location: ${selectedCity}, ${selectedState}`;
    }

    if (price) {
      message += `
Price: ${formatPrice(price)}`;
    }

    message += `

Please provide more details about this service and confirm the pricing.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918978455447?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleGeneralWhatsAppContact = () => {
    const categoryName = selectedCategory?.name;
    const subCategoryName = selectedSubCategory || "";

    let message = `Hello, I'm interested in your CA services.

Category: ${categoryName}`;

    if (subCategoryName) {
      message += `
Subcategory: ${subCategoryName}`;
    }

    if (selectedCity && selectedState) {
      message += `
Location: ${selectedCity}, ${selectedState}`;
    }

    message += `

Please provide more details about your services and pricing.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918978455447?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
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
          </div>
        )}
      </div>  

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Location & Service Info Bar */}
        {currentView === "AGREEMENTS" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Location Selection - Left Side */}
              <div className="flex flex-wrap gap-2 items-center">
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
              </div>

              {/* Service Info - Right Side */}
              <div className="text-right">
                <p className="text-sm text-blue-700 font-medium">
                  {selectedCity
                    ? `Pricing for ${selectedCity} | Click service for WhatsApp`
                    : "Select location for pricing | Click service for WhatsApp"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Categories View - Column Layout */}
        {currentView === "CATEGORIES" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                Professional Chartered Accountant Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a service category to get started
              </p>
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
                      {/* Service Header with WhatsApp in same container */}
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

                        {/* WhatsApp Button in same container */}
                        <div
                          className="bg-green-100 hover:bg-green-200 cursor-pointer transition-all rounded-lg px-3 py-2 flex items-center gap-2"
                          onClick={() => handleServiceSelection(agreement)}
                        >
                          <i className="fab fa-whatsapp text-green-600 text-lg"></i>
                          <span className="text-sm font-semibold text-green-800">
                            Contact
                          </span>
                        </div>
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
