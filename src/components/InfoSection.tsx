// src/components/CombinedSections.tsx
import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon

const InfoSection: React.FC = () => {
  return (
    <div className="py-8">
      {/* Advice Section */}
      <div className="bg-white px-6 md:px-10 py-5">
        <div className="flex flex-col md:flex-row justify-around items-center gap-6">
          {/* First Div: Simple Ask */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/4 mb-6 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="text-purple-700 text-xl font-semibold mb-6 md:mb-10">Simple Ask</h3>
              <p className="text-gray-600">
                Get instant answers or connect with a mentor who can guide you further.
              </p>
            </div>
          </div>

          {/* Second Div: Heading, Problem & Solutions */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/3 mb-6 md:mb-0">
            {/* Heading */}
            <h2 className="text-center text-yellow-600 text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              We're not just about advice
            </h2>
            <p className="text-center text-gray-600 text-sm md:text-lg">
              We're here to help you achieve your<br /> goals with tailored solutions and end-to-end support.
            </p>
            {/* Added 'Click here to know more' */}
            <a href="/" className="text-blue-600 hover:underline mb-6 md:mb-8">Click here to know more &gt;&gt;</a>

            {/* Problem & Solutions */}
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="text-purple-700 text-xl font-semibold mb-6 md:mb-10">Problem & Solutions</h3>
              <p className="text-gray-600">
                Get instant answers or connect with a mentor who can guide you further. We make it
                easy to find the help you need.
              </p>
            </div>
          </div>

          {/* Third Div: End-to-End Support */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/4 mb-6 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="text-purple-700 text-xl font-semibold mb-6 md:mb-10">End-to-End Support</h3>
              <p className="text-gray-600">
                Get instant answers or connect with a mentor who can guide you further.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-purple-700 bg-gradient-to-b from-purple-500 to-purple-900 py-8 text-center">
        <h2 className="text-yellow-500 text-2xl md:text-3xl font-bold mb-4">Search anything you want</h2>
        <p className="text-gray-300 text-sm md:text-lg mb-6">
          We're here to help you achieve your goals with tailored solutions and end-to-end support.
        </p>
        <div className="flex justify-center items-center">
          {/* Icon and input grouped together */}
          <div className="relative w-full md:w-3/5">
            <input
              type="text"
              placeholder="Search..."
              className="p-3 w-full rounded-[20px] focus:outline-none focus:ring-3 focus:ring-yellow-500 pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
