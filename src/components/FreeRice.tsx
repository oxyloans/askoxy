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
// import Rice1 from "../assets/img/o3.png";
// import Rice2 from "../assets/img/RICEU7.png";
// import Rice3 from "../assets/img/35kg1.png";
// import Rice4 from "../assets/img/26kg.png";
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
// import Retro from "../assets/img/retro.png";
// import O5 from "../assets/img/tb1.png";

import Rice4 from "../assets/img/3 (4).png";
import Rice2 from "../assets/img/3 (2).png";
import Rice3 from "../assets/img/3 (1).png";
import Rice1 from "../assets/img/3 (3).png";

// Campaign Base URL - ensure this is correct
const CAMPAIGN_BASE_URL = "https://www.askoxy.ai/freerice";

// Authentication URLs
const LOGIN_URL = "/whatsapplogin";
const REGISTER_URL = "/whatsappregister";

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
    let baseUrl = CAMPAIGN_BASE_URL;
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
    imageUrl:
      "https://i.ibb.co/vCZr4JhQ/Whats-App-Image-2025-06-24-at-11-40-40-5952be46.jpg",
    title: "Get ₹20 cashback on your first order of a 2 KG rice bag.",
    description: "Get ₹20 cashback on your first order of a 2 KG rice bag.",
    weight: 1.0,
  },
  {
    id: 2,
    imageUrl:
      "https://i.ibb.co/cKY19SPt/Whats-App-Image-2025-06-24-at-11-40-40-03b6ee95.jpg",
    title: "Get ₹30 cashback on your first order of a 5 KG rice bag.",
    description: "Get ₹30 cashback on your first order of a 5 KG rice bag.",
    weight: 5.0,
  },
  {
    id: 3,
    imageUrl: Rice4,
    title: "10KG Premium Rice Bag",
    description:
      "Buy a 10KG Rice Bag and Get an 18+ KG Steel Container Worth ₹1800 free!",
    weight: 10.0,
  },
  {
    id: 4,
    imageUrl: Rice3,
    title: "26KG Premium Rice Bag",
    description:
      "Buy a 26KG Rice Bag and Get a 35+ KG Steel Container Worth ₹2300 free!",
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
      const targetPath = `/main/dashboard/products?weight=${formattedWeight}`;

      // Store the redirect path in both localStorage and sessionStorage
      localStorage.setItem("redirectPath", targetPath);
      sessionStorage.setItem("redirectPath", targetPath);

      // Also store as returnUrl and next which are common parameter names
      localStorage.setItem("returnUrl", targetPath);
      sessionStorage.setItem("returnUrl", targetPath);
      localStorage.setItem("next", targetPath);
      sessionStorage.setItem("next", targetPath);

      // Check if user is already logged in
      if (userId) {
        // Use React Router's navigate for SPA navigation when already logged in
        navigate(targetPath);
      } else {
        // If not logged in, redirect to WhatsApp registration with the target path
        // Try multiple parameter names that might be expected by the auth system
        const registerUrl = `${REGISTER_URL}?redirect=${encodeURIComponent(
          targetPath
        )}`;

        // Force a full page reload for authentication
        window.location.href = registerUrl;
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
      // Set the default redirect path to the dashboard products page
      const redirectPath = "/main/dashboard/products";

      // Store the redirect path in multiple storage locations
      localStorage.setItem("redirectPath", redirectPath);
      sessionStorage.setItem("redirectPath", redirectPath);
      localStorage.setItem("returnUrl", redirectPath);
      sessionStorage.setItem("returnUrl", redirectPath);
      localStorage.setItem("next", redirectPath);
      sessionStorage.setItem("next", redirectPath);

      // Redirect to WhatsApp login with the redirect parameter
      const loginUrl = `${LOGIN_URL}?redirect=${encodeURIComponent(
        redirectPath
      )}`;

      // Force a full page reload for authentication
      window.location.href = loginUrl;
    } catch (error) {
      console.error("Sign in error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    // For logo click, navigate is fine since we're not crossing auth boundaries
    navigate("/");
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
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300 flex flex-col h-full cursor-pointer"
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
        style={{ height: "220px", maxWidth: "100%" }}
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
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src={AskOxyLogo}
            alt="RiceOrder Logo"
            className="h-10 sm:h-12 cursor-pointer transition-transform hover:scale-110 focus:scale-110"
            tabIndex={0}
            role="banner"
            onClick={handleLogoClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLogoClick();
              }
            }}
          />
          <div className="flex items-center gap-6">
            <a
              href={LOGIN_URL}
              onClick={(e) => {
                e.preventDefault();
                handleSignIn();
                return false;
              }}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
              aria-busy={isLoading}
            >
              <User className="w-5 h-5" />
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Sign In"
              )}
            </a>
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
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
            className="sm:hidden mt-3 bg-white shadow-lg rounded-xl px-4 py-3 animate-slide-down"
            role="menu"
          >
            <a
              href={LOGIN_URL}
              onClick={(e) => {
                e.preventDefault();
                handleSignIn();
                return false;
              }}
              className="block w-full text-left text-indigo-600 hover:text-indigo-800 py-2.5 font-medium transition-colors duration-200"
              role="menuitem"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">
              Order Premium Rice Online
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
              Discover our curated selection of high-quality rice, delivered
              fresh to your door.
            </p>
          </div>

          {/* Rice Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {riceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Impact Message */}
          {/* <div className="mt-12 sm:mt-16 text-center">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md max-w-4xl mx-auto">
              <h3 className="font-semibold text-xl text-indigo-700 mb-3">
                Your Purchase Makes a Difference
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                With every order, we donate rice to families in need. Join our
                community of conscious shoppers creating positive impact.
              </p>
            </div>
          </div> */}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeRiceBlog;