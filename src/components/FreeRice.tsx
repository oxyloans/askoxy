import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  User,
  Menu,
  X,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Rice1 from "../assets/img/BUY 1 GET 1.png";
import Rice2 from "../assets/img/RICEU7.png";
import Rice3 from "../assets/img/RICEU10.png";
import Rice4 from "../assets/img/RICEU9.png";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import Retro from "../assets/img/retro.png";
import O5 from "../assets/img/tb1.png";

// Campaign Base URL
const CAMPAIGN_BASE_URL = "https://www.askoxy.ai/freerice";

// Type definitions
interface RiceProduct {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  weight: number;
}

// UTM Parameters Interface
interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

const FreeRiceBlog: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgLoadError, setImgLoadError] = useState<Record<number, boolean>>({});
  const [utmParams, setUtmParams] = useState<UTMParams>({});
  const navigate = useNavigate();

  // UTM Parameters Tracking
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const content = searchParams.get("utm_content");

    const utmData: UTMParams = {
      ...(source && { utm_source: source }),
      ...(medium && { utm_medium: medium }),
      ...(campaign && { utm_campaign: campaign }),
      ...(content && { utm_content: content }),
    };

    setUtmParams(utmData);

    // Optional: Store UTM data in sessionStorage for later use
    if (Object.keys(utmData).length > 0) {
      sessionStorage.setItem("utmData", JSON.stringify(utmData));
    }
  }, []);

  // Generate Campaign URL with UTM Parameters
  const generateCampaignUrl = (weight?: number) => {
    const baseUrl = CAMPAIGN_BASE_URL;
    const utmParams = new URLSearchParams();

    // Add default campaign parameters
    utmParams.set("utm_source", "organic");
    utmParams.set("utm_medium", "website");
    utmParams.set("utm_campaign", "free_rice_campaign_2025");

    // Add optional parameters
    if (weight) {
      utmParams.set("utm_content", `${weight}kg_rice`);
    }

    return `${baseUrl}?${utmParams.toString()}`;
  };

  // Rice product data with weights, titles and descriptions
  const riceProducts: RiceProduct[] = [
    {
      id: 1,
      imageUrl: Rice1,
      title: "Buy 1KG Rice Get 1KG FREE",
      description:
        "Enjoy premium quality rice with our limited-time Buy 1 Get 1 Free offer — ideal for small families looking for great value and taste.",
      weight: 1.0,
    },
    {
      id: 2,
      imageUrl: Rice2,
      title: "5KG Premium Rice Bag",
      description: "Buy Any 5KG Rice Bag and Get a FREE PVR Movie Ticket!",
      weight: 5.0,
    },
    {
      id: 3,
      imageUrl: Retro,
      title: "5KG Premium Rice Bag",
      description: "Buy Any 5KG Rice Bag and Get a FREE PVR Movie Ticket!",
      weight: 5.0,
    },
    {
      id: 4,
      imageUrl: O5,
      title: "5KG Premium Rice Bag",
      description: "Buy Any 5KG Rice Bag and Get a FREE PVR Movie Ticket!",
      weight: 5.0,
    },
    {
      id: 5,
      imageUrl: Rice3,
      title: "10KG Premium Rice Bag",
      description:
        "Buy a 10KG Rice Bag and Get an 18+ KG Steel Container Worth ₹1800 free!",
      weight: 10.0,
    },
    {
      id: 6,
      imageUrl: Rice4,
      title: "26KG Premium Rice Bag",
      description:
        "Buy a 26KG Rice Bag and Get an 35+ KG Steel Container Worth ₹2300 free!",
      weight: 26.0,
    },
  ];

  useEffect(() => {
    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 640 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const handleOrderNow = (weight: number) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const formattedWeight = weight.toFixed(1);
      const targetUrl = `/main/dashboard/products?weight=${formattedWeight}`;

      // Store redirect path for after authentication
      sessionStorage.setItem("redirectPath", targetUrl);

      // Generate campaign URL with current product weight
      const campaignUrl = generateCampaignUrl(weight);

      // Check if user is already logged in
      if (userId) {
        window.location.href = campaignUrl;
      } else {
        // Redirect to WhatsApp register/login page
        window.location.href = campaignUrl;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      // Generate campaign URL for sign in
      const campaignUrl = generateCampaignUrl();
      
      // Set the default redirect path to the dashboard products page
      sessionStorage.setItem("redirectPath", "/main/dashboard/products");
      
      // Redirect to WhatsApp register with campaign URL
      window.location.href = campaignUrl;
    } catch (error) {
      console.error("Sign in error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleImageError = (productId: number) => {
    setImgLoadError((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: RiceProduct }) => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300 flex flex-col h-full"
      role="button"
      tabIndex={0}
      aria-label={`Order ${product.title}`}
      onClick={() => handleOrderNow(product.weight)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOrderNow(product.weight);
        }
      }}
    >
      {/* Image container with fixed width and height */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "220px", width: "288.01px", maxWidth: "100%" }}
      >
        {imgLoadError[product.id] ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain"
            onError={() => handleImageError(product.id)}
          />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 mb-1">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {product.description}
        </p>

        <button
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition duration-300 flex items-center justify-center gap-2 mt-auto"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <ShoppingCart className="w-4 h-4" />
          {isLoading ? "Loading..." : `Order ${product.weight}KG Now`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src={AskOxyLogo}
            alt="AskOxy Logo"
            className="h-10 sm:h-12 cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="banner"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignIn}
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 shadow transition duration-300"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              <User className="w-5 h-5" />
              {isLoading ? "Loading..." : "Sign In"}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden focus:outline-none"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="sm:hidden mt-2 bg-white shadow-md rounded-lg px-4 py-2 animate-fade-in-down"
            role="menu"
          >
            <button
              onClick={handleSignIn}
              className="block w-full text-left text-purple-600 hover:text-purple-800 py-2 font-medium"
              role="menuitem"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </div>
        )}

        {/* Campaign Information */}
        <div className="text-sm text-green-600 mt-2 text-center">
          Discover Our Free Rice Campaign at <strong>www.askoxy.ai/freerice</strong>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Order Rice Online
            </h1>
            <p className="text-sm sm:text-md md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Premium quality rice delivered to your doorstep
            </p>
          </div>

          {/* Rice Product Grid with consistent card heights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {riceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Impact Message */}
          <div className="mt-10 text-center">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm max-w-3xl mx-auto">
              <h3 className="font-semibold text-lg text-purple-700 mb-2">
                Make an Impact with Your Purchase
              </h3>
              <p className="text-sm sm:text-md text-gray-700">
                Every order helps us donate rice to families in need. Join
                thousands of customers making a difference with every purchase.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeRiceBlog;