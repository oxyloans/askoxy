import React, { useState } from "react";
import { ArrowUpRight, User, Menu, X } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Rice1 from "../assets/img/BUY 1 GET 1.png";
import Rice2 from "../assets/img/BUY 1 GET 1 2.png";
import Rice3 from "../assets/img/orderriceonline.png";
import Rice4 from "../assets/img/RICEU1.png";
import Rice5 from "../assets/img/RICEU2.png";
import Rice6 from "../assets/img/RICEU3.png";
import Rice7 from "../assets/img/RICEU4.png";
import Rice8 from "../assets/img/RICEU5.png";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";

const FreeRiceBlog: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Updated to include weight parameters
  const riceGifs = [
    { id: 1, imageUrl: Rice1, weight: 1.0 },
    { id: 2, imageUrl: Rice2, weight: 1.0 },
    { id: 3, imageUrl: Rice3, weight: 1.0 },
    { id: 4, imageUrl: Rice4, weight: 26.0 },
    { id: 5, imageUrl: Rice5, weight: 26.0 },
    { id: 6, imageUrl: Rice6, weight: 26.0 },
    { id: 7, imageUrl: Rice7, weight: 26.0 },
    { id: 8, imageUrl: Rice8, weight: 26.0 },
  ];

  const handleImageClick = (weight:any) => {
    const userId = localStorage.getItem("userId");

    // Format weight with decimal point preserved
    const formattedWeight = weight.toFixed(1);
    const targetUrl = `/main/dashboard/products?weight=${formattedWeight}`;

    // Store the target URL in sessionStorage to use after login/registration
    sessionStorage.setItem("redirectPath", targetUrl);

    if (!userId) {
      // Redirect to login/registration
      window.location.href = "/whatsappregister";
    } else {
      // Direct to products with weight parameter
      window.location.href = targetUrl;
    }
  };

  const handleSignIn = () => {
    window.location.href = "/whatsappregister";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src={AskOxyLogo}
            alt="AskOxy Logo"
            className="h-10 sm:h-12 cursor-pointer transition-transform hover:scale-105"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignIn}
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 shadow transition duration-300"
            >
              <User className="w-5 h-5" />
              Sign In
            </button>
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 bg-white shadow-md rounded-lg px-4 py-2 animate-fade-in-down">
            <button
              onClick={handleSignIn}
              className="block w-full text-left text-purple-600 hover:text-purple-800 py-2 font-medium"
            >
              Sign In
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Order Rice Online
            </h1>
            <p className="text-md sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Choose from premium rice offers and help feed those in need with
              every order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {riceGifs.map((gif) => (
              <div
                key={gif.id}
                className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition duration-300 cursor-pointer group"
                onClick={() => handleImageClick(gif.weight)}
              >
                <div className="aspect-w-16 aspect-h-10">
                  <img
                    src={gif.imageUrl}
                    alt={`Rice Promo ${gif.id} - ${gif.weight}kg`}
                    className="w-full h-full object-cover transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <button
              onClick={handleSignIn}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-full hover:bg-purple-700 transition duration-300 shadow-md hover:shadow-xl"
            >
              Order Now
              <ArrowUpRight className="ml-2" size={20} />
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Every purchase helps a family in need. Join the movement today!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeRiceBlog;
