import React, { useState } from "react";
import logo1 from "../assets/img/WEBSITE (1).png";
import logo2 from "../assets/img/FREE RICE SAMPLES AND FREE RICE CONTAINER.png";
import logo3 from "../assets/img/Free AI and Gen ai training.png";
import logo4 from "../assets/img/Legal knowledge hub.png";
import logo5 from '../assets/img/study abroad.png'
import logo6 from '../assets/img/MY ROTARY.png'
import logo7 from '../assets/img/Machines manufacturing services.png'
import logo8 from '../assets/img/Career guidance.png'
import { useNavigate } from "react-router-dom";

const ServicesSlider: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent] = useState(
    "We are simply showcasing these services for you. Please refrain from registering or accessing them at this moment."
  );

  const services = [
    { image: logo1, title: "Free Rudraksha" },
    { image: logo3, title: "Free AI & GEN AI Training" },
    { image: logo4, title: "Legal Knowledge Hub" },
    { image: logo2, title: "Free Rice Samples & Steel Container" },
    { image: logo5, title: "Study Abroad" },
    { image: logo6, title: "My Rotary" },
    { image: logo7, title: "Machines Manufacturing Services" },
    { image: logo8, title: "Career Guidance" },
    { image: logo3, title: "Business Growth" },
  ];

  const navigate = useNavigate();
  const displayedServices = showAll ? services : services.slice(0, 3);

  const handleImageClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-50 min-h-[50vh] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center sm:text-left mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
          Our <span className="text-yellow-500">Services</span>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-purple-500 mt-1 mx-auto sm:mx-0 rounded-full"></div>
        </h2>
        <button
          className="bg-[#1e3a8a] text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-[#2a0d52] transition-colors duration-300"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedServices.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-xl bg-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleImageClick()}
          >
            <div className="w-full h-56 rounded-lg overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="text-center text-base font-semibold mt-2 text-gray-800">
              {service.title}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
              Service Information
            </h3>
            <p className="text-center text-base sm:text-lg text-gray-600 mb-6">
              {modalContent}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-700 transition-colors duration-300"
                onClick={handleLoginClick}
              >
                Sign In
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-500 transition-colors duration-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSlider;
