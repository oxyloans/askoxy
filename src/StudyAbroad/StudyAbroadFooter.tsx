import React, { useState } from "react";
import { Globe, Phone, Mail, MapPin, ArrowUp, Facebook, Twitter, Linkedin, Instagram, ChevronDown } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';

type SectionKey = 'destinations' | 'services' | 'contact';

const StudyAbroadFooter = () => {
  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    destinations: false,
    services: false,
    contact: false
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white text-gray-800 py-10 shadow-lg border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">StudyAbroad</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              StudentX simplifies university admissions globally with AI-powered matching. Explore courses, connect with alumni, and get personalized recommendations for your academic journey.
            </p>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.facebook.com/StudyAbroadAskoxy"
                aria-label="Facebook"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all"
              >
                <Facebook size={18} />
              </a>
              {/* <a
                href="#"
                aria-label="Twitter"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all"
              >
                <Twitter size={18} />
              </a> */}
              <a
                href="https://www.linkedin.com/company/89893468/admin/dashboard/"
                aria-label="LinkedIn"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/studyabroad_askoxy.ai/"
                aria-label="Instagram"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>
            
            {/* Newsletter subscription - desktop only */}
            <div className="hidden md:block">
              <h4 className="font-semibold mb-3 text-sm">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-grow px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-l focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-r text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Study Destinations - with mobile accordion */}
          <div>
            <div 
              className="flex justify-between items-center mb-4 cursor-pointer md:cursor-default"
              onClick={() => toggleSection('destinations')}
            >
              <h3 className="text-lg font-semibold">Study Destinations</h3>
              <ChevronDown 
                className={`h-5 w-5 md:hidden transition-transform ${openSections.destinations ? 'rotate-180' : ''}`} 
              />
            </div>
            <ul className={`space-y-2 text-sm overflow-hidden transition-all duration-300 ease-in-out ${openSections.destinations ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
              {[
                { country: "USA", link: "#usa" },
                { country: "United Kingdom", link: "#uk" },
                { country: "Germany", link: "#germany" },
                { country: "Canada", link: "#canada" },
                { country: "Australia", link: "#australia" },
                { country: "New Zealand", link: "#newzealand" }
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="text-gray-600 hover:text-purple-600 transition-colors hover:underline"
                  >
                    {item.country}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - with mobile accordion */}
          <div>
            <div 
              className="flex justify-between items-center mb-4 cursor-pointer md:cursor-default"
              onClick={() => toggleSection('services')}
            >
              <h3 className="text-lg font-semibold">Our Services</h3>
              <ChevronDown 
                className={`h-5 w-5 md:hidden transition-transform ${openSections.services ? 'rotate-180' : ''}`} 
              />
            </div>
            <ul className={`space-y-2 text-sm overflow-hidden transition-all duration-300 ease-in-out ${openSections.services ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
              {[
                "University Selection",
                "Application Assistance",
                "Visa Guidance",
                "Scholarship Support",
                "Test Preparation",
                "Accommodation Help"
              ].map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors hover:underline"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - with mobile accordion */}
          <div>
            <div 
              className="flex justify-between items-center mb-4 cursor-pointer md:cursor-default"
              onClick={() => toggleSection('contact')}
            >
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <ChevronDown 
                className={`h-5 w-5 md:hidden transition-transform ${openSections.contact ? 'rotate-180' : ''}`} 
              />
            </div>
            <div className={`space-y-4 text-sm overflow-hidden transition-all duration-300 ease-in-out ${openSections.contact ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <address className="not-italic text-gray-600">
                  CC-03, Block-C, Indu Fortune Fields - The Annexe
                  KPHB Colony, K P H B Phase 9, Kukatpally, Hyderabad<br />
                  Telangana 500085
                </address>
              </div>
              
              <div className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 text-purple-600" />
                <a
                  // href="+918919636330"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  89196 36330
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <a
                  // href="studyabroad@askoxy.ai"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  studyabroad@askoxy.ai
                </a>
              </div>
              {/* <div className="flex items-center gap-3">         
                <a
                  href=""
                  className="text-Purple-600 hover:text-purple-600 transition-colors"
                >
                  CIN : U72900TG2020PTC140756
                </a>
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Newsletter subscription - mobile only */}
        <div className="md:hidden mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm">Subscribe to our newsletter</h4>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
            />
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} StudyAbroad Global. All rights reserved.
            </p>
          </div>
          
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default StudyAbroadFooter;