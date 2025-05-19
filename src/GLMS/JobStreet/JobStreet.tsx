import React, { useEffect }from "react";
import { Menu, X } from "lucide-react";
import Askoxylogo from "../../assets/img/askoxylogostatic.png";
import GlmsImage from "../../assets/Job_Street_Image.jpeg.jpg";

const JobStreet: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Initialize GA4 tracking on component mount
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'js_page_view', {
        page_title: 'JobStreet Page',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleGLMSClick = () => {
    window.location.href = "/glms";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center">
      <img
        src={Askoxylogo}
        alt="AskOxy Logo"
        className="h-10 cursor-pointer transition-transform hover:scale-105"
        onClick={handleLogoClick}
        tabIndex={0}
        role="banner"
      />
    </div>

    {/* Desktop GLMS Button */}
    <div className="hidden md:block">
      <button
        onClick={handleGLMSClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
      >
        GLMS
      </button>
    </div>

    {/* Mobile Menu Toggle */}
    <button
      onClick={toggleMobileMenu}
      className="md:hidden p-2 ml-4 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
      aria-expanded={mobileMenuOpen}
    >
      {mobileMenuOpen ? (
        <X size={24} className="text-gray-600" />
      ) : (
        <Menu size={24} className="text-gray-600" />
      )}
    </button>
  </div>

  {/* Mobile Menu Items */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-white shadow px-4 pb-4">
      <button
        onClick={handleGLMSClick}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
      >
        GLMS
      </button>
    </div>
  )}
</header>


      {/* Main Image Content */}
      <main className="flex-grow pt-24 px-4 bg-gray-50 flex items-center justify-center">
        <div className="w-[250px] h-[510px]">
          <img
            src={GlmsImage}
            alt="GLMS Main Visual"
            className="w-[350px] h-[500px] rounded-lg shadow-lg object-cover"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Global Loans Management Systems. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default JobStreet;
