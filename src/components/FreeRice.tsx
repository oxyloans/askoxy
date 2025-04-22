import React, { useState } from "react";
import { ArrowUpRight, User, Menu, X } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Rice1 from "../assets/img/BUY 1 GET 1.png";
import Rice2 from "../assets/img/BUY 1 GET 1 2.png";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";

const FreeRiceBlog: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample GIF data - in a real application, this might come from an API or database
  const riceGifs = [
    {
      id: 1,
      title: "Rice Farming",
      description: "Traditional methods of rice cultivation across Asia",
      imageUrl: Rice1,
    },
    {
      id: 2,
      title: "Rice Varieties",
      description: "Explore different types of rice from around the world",
      imageUrl: Rice2,
    },
    {
      id: 3,
      title: "Rice Harvesting",
      description: "Modern and traditional harvesting techniques",
      // For missing image, using a placeholder
      imageUrl: null,
    },
  ];

  const navigate = useNavigate();

  const handleSignIn = () => {
    window.location.href = "/whatsappregister";
  };

  // Function to handle click on GIF
  const handleGifClick = () => {
    window.location.href = "/whatsappregister";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={AskOxyLogo}
              className="h-8 w-auto sm:h-12 object-contain cursor-pointer"
              alt="AskOxyLogo"
            />
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
              Free Rice
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Exploring the world of rice and helping fight hunger one click at
              a time
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {riceGifs.map((gif) => (
              <div
                key={gif.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleGifClick}
                aria-label={`Click to read more about ${gif.title}`}
                role="button"
              >
                <div className="relative">
                  {gif.imageUrl ? (
                    <img
                      src={gif.imageUrl}
                      alt={gif.title}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Image not available</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    {gif.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {gif.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              Click on any image to support our cause and fight world hunger
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FreeRiceBlog;
