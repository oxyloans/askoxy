// src/components/CombinedSections.tsx
import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon

const InfoSection: React.FC = () => {
  return (
    <div className="py-8">
      {/* Advice Section */}
      <div className="px-6 py-5 bg-white md:p-10">
        <div className="flex flex-col items-center justify-around gap-6 md:flex-row">
          {/* First Div: Simple Ask */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/4 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">Simple Ask</h3>
              <p className="text-gray-600">
              Get instant answers or connect with a mentor who can guide you further.
              </p>
            </div>
          </div>

          {/* Second Div: Heading, Problem & Solutions */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/3 md:mb-0">
            {/* Heading */}
            <h2 className="mb-2 text-2xl font-bold text-center text-yellow-600 md:text-3xl md:mb-6">
              We're not just about advice
            </h2>
            <p className="text-sm text-center text-gray-600 md:text-lg mb-8">
            AskOxy.AI is more than just unlimited ChatGPT prompts. We're committed to helping you achieve your goals by enabling unlimited queries, assigning mentors, arranging funding, discussing tailored solutions, and providing end-to-end support.
            </p>
            {/* Added 'Click here to know more' */}
          

            {/* Problem & Solutions */}
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">Effective Solve</h3>
              <p className="text-gray-600">
              We equip you with mentors, funding, and comprehensive platform solutions to overcome obstacles and progress seamlessly.
              </p>
            </div>
          </div>

          {/* Third Div: End-to-End Support */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/4 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">Guaranteed Success</h3>
              <p className="text-gray-600">
              Our end-to-end support ensures comprehensive backing for projects or companies with a clear vision and mission, complemented by Simple Ask and Effective Solve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
    <div className="py-8 text-center bg-purple-700 bg-gradient-to-b from-purple-500 to-purple-900">
  <h2 className="mb-4 text-2xl font-bold text-yellow-500 md:text-3xl">
    Search anything you want
  </h2>
  <p className="mb-6 text-sm text-gray-300 md:text-lg">
    We're here to help you achieve your goals with tailored solutions and end-to-end support.
  </p>

  <div className="flex items-center justify-center">
    {/* Icon and input grouped together */}
    <div className="relative flex w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
      <input
        type="text"
        placeholder="Search..."
        className="p-3 w-full rounded-[20px] focus:outline-none focus:ring-3 focus:ring-yellow-500 pr-10" // Add padding on the right for the icon
      />
      {/* Move the icon to the right */}
      <FaSearch
        className="absolute text-gray-400 transform -translate-y-1/2 right-5 top-1/2"
        size={20}
      />
    </div>
  </div>
</div>

    </div>
  );
};

export default InfoSection;
