// src/components/CombinedSections.tsx
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon
import axios from 'axios';

const InfoSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() === '') {
      alert('Please enter a valid question');
      return;
    }

    try {
      const result = await axios.post(
        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${query}`
      );
      setResponse(result.data); // Assuming the response data you want is directly in `data`
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Something went wrong. Please try again later.');
    }
};
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
    <div className="search-placeholder1">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Ask any question..."
                  className="search-input"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Trigger redirection when Enter is pressed
                      window.location.href = `/normal?${query}`;
                    }
                  }}
                />
                <button
                  className="search-button"
                  onClick={() => {
                    // Trigger redirection when the button is clicked
                    window.location.href = `/normal?${query}`;
                  }}
                >
                  <span className="search-icon icons">&#128269;</span> {/* Placeholder for Search Icon */}
                </button>
              </div>


              {/* Optional: Display the API response */}
              {/* {response && (
    <div className="response-container">
      <h3></h3>
      <p><ReactMarkdown>{JSON.stringify(response, null, 2)}</ReactMarkdown></p>
    </div>
  )} */}
            </div>
  </div>
</div>
<style>
  {`.search-placeholder1 {
      width: 50%;
      padding: 0.4rem;
      margin-top: 2.5rem;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 1.5rem;
      position: relative;
  }

  /* Media query for smaller screens (e.g., mobile devices) */
  @media (max-width: 768px) {
      .search-placeholder1 {
          width: 80%; /* Adjust width for smaller screens */
          padding: 0.5rem; /* Slightly larger padding for better touch interaction */
          margin-top: 1.5rem; /* Reduce top margin */
          border-radius: 1rem; /* Adjust border-radius */
      }
  }

  /* Media query for very small screens (e.g., mobile phones in portrait) */
  @media (max-width: 480px) {
      .search-placeholder1 {
          width: 90%; /* Full width for very small screens */
          padding: 0.6rem; /* More padding for better usability */
          margin-top: 1rem; /* Further reduce top margin */
          border-radius: 0.75rem; /* More rounded corners */
      }
  }
      @media (max-width: 480px) {
    .search-icon {
        font-size: 1rem;
        top: 30px;
    }
}
  `}
</style>

    </div>

  );
};

export default InfoSection;
