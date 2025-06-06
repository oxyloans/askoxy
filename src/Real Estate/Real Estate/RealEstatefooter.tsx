// import React, { useState } from "react";
// import {
//   Home,
//   Phone,
//   Mail,
//   MapPin,
//   ArrowUp,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Instagram,
//   ChevronDown,
//   Building,
//   Key,
//   Users,
//   TrendingUp,
//   Calculator,
//   Shield,
// } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";

// type SectionKey = "services" | "properties" | "contact";

// const RealEstateFooter = () => {
//   // State for mobile accordion sections
//   const [openSections, setOpenSections] = useState({
//     services: false,
//     properties: false,
//     contact: false,
//   });

//   const toggleSection = (section: SectionKey) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 sm:py-12 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-2xl"></div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
//           {/* Company Info */}
//           <div className="col-span-1 md:col-span-2 lg:col-span-1">
//             <div className="flex items-center mb-6">
//               <div className="relative">
//                 <Home className="h-8 w-8 text-cyan-400 mr-3" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
//               </div>
//               <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
//                 Real Estate Pro
//               </span>
//             </div>
            // <p className="text-gray-300 text-sm leading-relaxed mb-6">
            //   Your trusted partner in finding the perfect property. From luxury homes to commercial spaces,
            //   we provide comprehensive real estate solutions with expert guidance and personalized service.
            // </p>
            
//             {/* Social Media Links */}
//             <div className="flex gap-3 mb-8">
//               <a
//                 href="https://www.facebook.com/RealEstatePro"
//                 aria-label="Follow us on Facebook"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 text-gray-300 hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-white/20 transition-all duration-300 group"
//               >
//                 <Facebook size={18} className="group-hover:scale-110 transition-transform" />
//               </a>
//               <a
//                 href="https://twitter.com/RealEstatePro"
//                 aria-label="Follow us on Twitter"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 text-gray-300 hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-white/20 transition-all duration-300 group"
//               >
//                 <Twitter size={18} className="group-hover:scale-110 transition-transform" />
//               </a>
//               <a
//                 href="https://www.linkedin.com/company/realestatepro"
//                 aria-label="Connect with us on LinkedIn"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 text-gray-300 hover:text-[#0077B5] hover:border-[#0077B5] hover:bg-white/20 transition-all duration-300 group"
//               >
//                 <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
//               </a>
//               <a
//                 href="https://www.instagram.com/realestatepro"
//                 aria-label="Follow us on Instagram"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 text-gray-300 hover:text-[#E4405F] hover:border-[#E4405F] hover:bg-white/20 transition-all duration-300 group"
//               >
//                 <Instagram size={18} className="group-hover:scale-110 transition-transform" />
//               </a>
//             </div>

//             {/* Newsletter subscription - desktop only */}
//             <div className="hidden md:block">
//               <h4 className="font-semibold mb-4 text-white flex items-center">
//                 <Mail className="w-4 h-4 mr-2 text-cyan-400" />
//                 Stay Updated
//               </h4>
//               <div className="flex rounded-lg overflow-hidden border border-white/20">
//                 <input
//                   type="email"
//                   name="newsletter-email"
//                   aria-label="Email address for newsletter"
//                   placeholder="Enter your email"
//                   className="flex-grow px-4 py-3 text-sm bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 />
//                 <button
//                   type="button"
//                   className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
//                 >
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Services - with mobile accordion */}
//           <div>
//             <button
//               type="button"
//               aria-expanded={openSections.services}
//               aria-controls="services-content"
//               className="flex justify-between items-center mb-6 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-2 md:p-0"
//               onClick={() => toggleSection("services")}
//             >
//               <h3 className="text-lg font-semibold text-white flex items-center">
//                 <Users className="w-5 h-5 mr-2 text-cyan-400" />
//                 Our Services
//               </h3>
//               <ChevronDown
//                 className={`h-5 w-5 md:hidden transition-transform duration-300 text-cyan-400 ${
//                   openSections.services ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             <ul
//               id="services-content"
//               className={`space-y-3 text-sm text-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${
//                 openSections.services ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
//               }`}
//             >
//               {[
//                 { name: "Property Sales", icon: Key },
//                 { name: "Property Rentals", icon: Building },
//                 { name: "Property Management", icon: Shield },
//                 { name: "Investment Advisory", icon: TrendingUp },
//                 { name: "Property Valuation", icon: Calculator },
//                 { name: "Mortgage Assistance", icon: Home },
//               ].map((item, index) => (
//                 <li key={index} className="flex items-center group">
//                   <item.icon className="w-4 h-4 mr-3 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
//                   <a
//                     href="#"
//                     className="text-gray-300 hover:text-cyan-400 transition-colors hover:underline"
//                   >
//                     {item.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Property Types - with mobile accordion */}
//           <div>
//             <button
//               type="button"
//               aria-expanded={openSections.properties}
//               aria-controls="properties-content"
//               className="flex justify-between items-center mb-6 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-2 md:p-0"
//               onClick={() => toggleSection("properties")}
//             >
//               <h3 className="text-lg font-semibold text-white flex items-center">
//                 <Building className="w-5 h-5 mr-2 text-cyan-400" />
//                 Property Types
//               </h3>
//               <ChevronDown
//                 className={`h-5 w-5 md:hidden transition-transform duration-300 text-cyan-400 ${
//                   openSections.properties ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             <ul
//               id="properties-content"
//               className={`space-y-3 text-sm text-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${
//                 openSections.properties ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
//               }`}
//             >
//               {[
//                 "Residential Homes",
//                 "Luxury Apartments",
//                 "Commercial Spaces",
//                 "Industrial Properties",
//                 "Land & Plots",
//                 "Vacation Rentals",
//               ].map((property, index) => (
//                 <li key={index} className="group">
//                   <a
//                     href="#"
//                     className="text-gray-300 hover:text-cyan-400 transition-colors hover:underline flex items-center"
//                   >
//                     <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 group-hover:bg-cyan-300 transition-colors"></span>
//                     {property}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info - with mobile accordion */}
//           <div>
//             <button
//               type="button"
//               aria-expanded={openSections.contact}
//               aria-controls="contact-content"
//               className="flex justify-between items-center mb-6 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-2 md:p-0"
//               onClick={() => toggleSection("contact")}
//             >
//               <h3 className="text-lg text-white font-semibold flex items-center">
//                 <Phone className="w-5 h-5 mr-2 text-cyan-400" />
//                 Contact Us
//               </h3>
//               <ChevronDown
//                 className={`h-5 w-5 md:hidden transition-transform duration-300 text-cyan-400 ${
//                   openSections.contact ? "rotate-180" : ""
//                 }`}
//               />
//             </button>
//             <div
//               id="contact-content"
//               className={`space-y-4 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
//                 openSections.contact ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
//               }`}
//             >
//               <div className="flex items-start gap-3 group">
//                 <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:text-cyan-300 transition-colors" />
//                 <address className="not-italic text-gray-300">
//                   456 Real Estate Avenue, Suite 200
//                   <br />
//                   Downtown District, NY 10001
//                   <br />
//                   United States
//                 </address>
//               </div>

//               <div className="flex items-center gap-3 group">
//                 <FaWhatsapp className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
//                 <a
//                   href="tel:+1555123456"
//                   className="text-gray-300 hover:text-cyan-400 transition-colors"
//                 >
//                   +1 (555) 123-4567
//                 </a>
//               </div>
              
//               <div className="flex items-center gap-3 group">
//                 <Phone className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
//                 <a
//                   href="tel:+1555765432"
//                   className="text-gray-300 hover:text-cyan-400 transition-colors"
//                 >
//                   +1 (555) 765-4321
//                 </a>
//               </div>
              
//               <div className="flex items-center gap-3 group">
//                 <Mail className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
//                 <a
//                   href="mailto:info@realestatepro.com"
//                   className="text-gray-300 hover:text-cyan-400 transition-colors"
//                 >
//                   info@realestatepro.com
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Newsletter subscription - mobile only */}
//         <div className="md:hidden mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
//           <h4 className="font-semibold mb-4 text-white flex items-center">
//             <Mail className="w-4 h-4 mr-2 text-cyan-400" />
//             Stay Updated with Latest Properties
//           </h4>
//           <div className="space-y-3">
//             <input
//               type="email"
//               name="newsletter-email-mobile"
//               aria-label="Email address for newsletter"
//               placeholder="Enter your email address"
//               className="w-full px-4 py-3 text-sm bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//             />
//             <button
//               type="button"
//               className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
//             >
//               Subscribe to Newsletter
//             </button>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-white/20 my-8"></div>

//         {/* Bottom Section */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
//           <div className="flex flex-col md:flex-row items-center gap-4">
//             <p className="text-center text-gray-300 md:text-left">
//               &copy; {new Date().getFullYear()} Real Estate Pro. All rights reserved.
//             </p>
//             <div className="flex gap-6 text-gray-400">
//               <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
//               <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
//               <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={scrollToTop}
//             className="flex items-center text-gray-300 hover:text-cyan-400 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg px-3 py-2"
//             aria-label="Scroll to top of page"
//           >
//             <span className="mr-2">Back to top</span>
//             <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
//           </button>
//         </div>
//       </div>
//     </footer>
//   );
// };


// export default RealEstateFooter;





import React, { useState } from "react";
import {
  Cpu,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type SectionKey = "solutions" | "technologies" | "contact";

const RealEstateFooter = () => {
  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    solutions: false,
    technologies: false,
    contact: false,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 sm:py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Cpu className="h-8 w-8 text-cyan-600 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                Real Estate Pro
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your trusted partner in finding the perfect property. From luxury
              homes to commercial spaces, we provide comprehensive real estate
              solutions with expert guidance and personalized service.
            </p>

            <div className="flex gap-4 mb-6">
              <a
                href="https://www.facebook.com/AIBlockchainIT"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/AIBlockchainIT"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/aiblockchainit"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#0077B5] hover:border-[#0077B5] transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/aiblockchainit"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#E4405F] hover:border-[#E4405F] transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Newsletter subscription - desktop only */}
            <div className="hidden md:block">
              <h4 className="font-semibold mb-3 text-sm">
                Subscribe to our newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  name="newsletter-email"
                  aria-label="Email address"
                  placeholder="Your Email"
                  className="flex-grow px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-l focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
                />
                <button
                  type="button"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-r text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Solutions - with mobile accordion */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.solutions}
              aria-controls="solutions-content"
              className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={() => toggleSection("solutions")}
            >
              <h3 className="text-lg font-semibold">Our Solutions</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.solutions ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              id="solutions-content"
              className={`space-y-2 text-sm text-white overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.solutions ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {[
                "AI Consulting",
                "Blockchain Development",
                "Smart Contracts",
                "Data Analytics",
                "Cybersecurity",
                "Cloud Integration",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-cyan-600 transition-colors hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies - with mobile accordion */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.technologies}
              aria-controls="technologies-content"
              className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={() => toggleSection("technologies")}
            >
              <h3 className="text-lg font-semibold">Technologies</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.technologies ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              id="technologies-content"
              className={`space-y-2 text-sm text-white overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.technologies ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {[
                "Artificial Intelligence",
                "Machine Learning",
                "Ethereum & Solidity",
                "Hyperledger Fabric",
                "IoT Integration",
                "Big Data Platforms",
              ].map((tech, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-cyan-600 transition-colors hover:underline"
                  >
                    {tech}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - with mobile accordion */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.contact}
              aria-controls="contact-content"
              className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={() => toggleSection("contact")}
            >
              <h3 className="text-lg text-white font-semibold">Contact Us</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.contact ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id="contact-content"
              className={`space-y-4 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.contact ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <address className="not-italic text-white">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
                </address>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 text-cyan-600" />
                <a
                  href="tel:+1234567890"
                  className="text-white hover:text-cyan-600 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-600" />
                <a
                  href="mailto:contact@aiblockchainit.com"
                  className="text-white hover:text-cyan-600 transition-colors"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter subscription - mobile only */}
        <div className="md:hidden mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm">
            Subscribe to our newsletter
          </h4>
          <div className="space-y-2">
            <input
              type="email"
              name="newsletter-email-mobile"
              aria-label="Email address"
              placeholder="Your Email"
              className="w-full px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
            />
            <button
              type="button"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-center text-white md:text-left">
              &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
              rights reserved.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-cyan-600 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Scroll to top"
          >
            <span className="mr-2 text-white">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default RealEstateFooter;
