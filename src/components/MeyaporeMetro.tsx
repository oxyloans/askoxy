import React, { useState, useEffect } from "react";
import {
  
  User,
  Menu,
  X,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Rice4 from "../assets/img/3 (4).png";
import Rice2 from "../assets/img/3 (2).png";
import Rice3 from "../assets/img/3 (1).png";
import Rice1 from "../assets/img/3 (3).png";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";


// Campaign Base URL
const CAMPAIGN_BASE_URL = "https://www.askoxy.ai/miyapurmetro";

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

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

const MeyaporeMetro: React.FC = () => {
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

    if (Object.keys(utmData).length > 0) {
      sessionStorage.setItem("utmData", JSON.stringify(utmData));
    }
  }, []);

  // Generate Campaign URL with UTM Parameters
  const generateCampaignUrl = (weight?: number) => {
    let baseUrl = CAMPAIGN_BASE_URL;
    const utmParams = new URLSearchParams();

    utmParams.set("utm_source", "organic");
    utmParams.set("utm_medium", "website");
    utmParams.set("utm_campaign", "free_rice_campaign_2025");

    if (weight) {
      utmParams.set("utm_content", `${weight}kg_rice`);
    }

    return `${baseUrl}?${utmParams.toString()}`;
  };

  // Rice product data
  const riceProducts: RiceProduct[] = [
    {
      id: 1,
      imageUrl: Rice1,
      title: "Buy 2 KG Rice Get 1 KG FREE",
      description:
        "Premium quality rice with a Buy 2 Get 1 Free offer, perfect for small families.",
      weight: 1.0,
    },
    {
      id: 2,
      imageUrl: Rice2,
      title: "5 KG Premium Rice Bag and Get 2 KG Rice Free",
      description: "Buy a 5 KG Rice Bag and Get 2 KG Rice Free",
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

      localStorage.setItem("redirectPath", targetPath);
      sessionStorage.setItem("redirectPath", targetPath);
      localStorage.setItem("returnUrl", targetPath);
      sessionStorage.setItem("returnUrl", targetPath);
      localStorage.setItem("next", targetPath);
      sessionStorage.setItem("next", targetPath);

      if (userId) {
        navigate(targetPath);
      } else {
        const registerUrl = `${REGISTER_URL}?redirect=${encodeURIComponent(
          targetPath
        )}`;
        window.location.href = registerUrl;
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const redirectPath = "/main/dashboard/products";

      localStorage.setItem("redirectPath", redirectPath);
      sessionStorage.setItem("redirectPath", redirectPath);
      localStorage.setItem("returnUrl", redirectPath);
      sessionStorage.setItem("returnUrl", redirectPath);
      localStorage.setItem("next", redirectPath);
      sessionStorage.setItem("next", redirectPath);

      const loginUrl = `${REGISTER_URL}?redirect=${encodeURIComponent(
        redirectPath
      )}`;
      window.location.href = loginUrl;
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

//   const handleLogoClick = () => {
//     navigate("/");
//   };

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
      className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 flex flex-col h-full cursor-pointer border border-gray-100 hover:border-indigo-200"
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
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "200px" }}
      >
        {imgLoadError[product.id] ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-4"
            onError={() => handleImageError(product.id)}
          />
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 mb-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>
        <button
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 flex items-center justify-center gap-2 mt-auto shadow-md"
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
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="bg-white shadow-lg px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src={AskOxyLogo}
            alt="RiceOrder Logo"
            className="h-10 sm:h-12 cursor-pointer transition-transform hover:scale-105 focus:scale-105"
            tabIndex={0}
            role="banner"
            // onClick={handleLogoClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // handleLogoClick();
              }
            }}
          />
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={REGISTER_URL}
              onClick={(e) => {
                e.preventDefault();
                handleSignIn();
                return false;
              }}
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 text-sm font-medium"
              aria-busy={isLoading}
            >
              <User className="w-4 h-4" />
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
            className="sm:hidden mt-4 bg-white shadow-lg rounded-xl px-4 py-3 animate-slide-down"
            role="menu"
          >
            <a
              href={REGISTER_URL}
              onClick={(e) => {
                e.preventDefault();
                handleSignIn();
                return false;
              }}
              className="block w-full text-left text-indigo-600 hover:text-indigo-800 py-2.5 font-medium transition-colors duration-200 text-sm"
              role="menuitem"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-1xl sm:text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Premium Rice Now at Miyapur Metro Station – Book Online, Free
              Delivery to Your Home!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
                Free Rice! Free Container! Explore our premium selection of
                top-quality rice, delivered fresh to your doorstep.
              </p>
            </p>
          </div>

          {/* Rice Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {riceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Impact Message */}
          <div className="mt-10 sm:mt-14 text-center">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md max-w-4xl mx-auto">
              <h3 className="font-semibold text-lg sm:text-xl text-indigo-700 mb-3">
                Your Purchase Makes a Difference
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                With every order, we donate rice to families in need. Join our
                community of conscious shoppers creating positive impact.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MeyaporeMetro;
