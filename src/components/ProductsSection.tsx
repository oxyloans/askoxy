// src/components/ProductsSection.tsx
import React, { useState } from 'react';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import Rice from '../assets/img/2.png';
import Loans from '../assets/img/3.png';
import Study from '../assets/img/4.png';
import Insurance from '../assets/img/5.png';
import Investments from '../assets/img/6.png';

const ProductsSection: React.FC = () => {
  const products = [
    { id: 1, name: 'Buy Rice', img: Rice },
    { id: 2, name: 'Loans', img: Loans },
    { id: 3, name: 'Study Abroad', img: Study },
    { id: 4, name: 'Insurance', img: Insurance },
    { id: 5, name: 'Investments', img: Investments },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const visibleProducts = products.slice(startIndex, startIndex + 3);

  const handleLeftClick = () => {
    setStartIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleRightClick = () => {
    setStartIndex((prevIndex) =>
      prevIndex < products.length - 3 ? prevIndex + 1 : products.length - 3
    );
  };

  return (
    <div className="bg-white py-8 px-4 sm:px-10 md:px-20 mb-5">
      {/* Container for search about products */}
      <div className="bg-gray-200 rounded-xl border-2 border-purple-600 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Left side (Search about our famous products) */}
          <div className="w-full lg:w-1/3 bg-gradient-to-b bg-gradient-from-t from-purple-500 to-purple-900 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-2">Search About Our Famous</h3>
            <h1 className="text-yellow-500 text-3xl sm:text-4xl font-bold">PRODUCTS</h1>
            <p className="text-base sm:text-lg mt-4">
              We're here to help you achieve your goals with tailored solutions and end-to-end support.
            </p>
          </div>

          {/* Right side (Product Cards with carousel navigation) */}
          <div className="w-full lg:w-2/3 flex items-center justify-between">
            {/* Left arrow */}
            <IoMdArrowDropleft
              className={`cursor-pointer ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              size={40}
              onClick={handleLeftClick}
            />

            {/* Product Cards */}
            <div className="flex justify-between w-full space-x-4 overflow-hidden">
              {visibleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg flex-grow text-center">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-t-lg mb-0"
                  />
                  <button className="bg-purple-900 text-white font-semibold mt-0 w-full py-2 rounded-b-lg border-none cursor-pointer block">
                    {product.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <IoMdArrowDropright
              className={`cursor-pointer ${startIndex === products.length - 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              size={40}
              onClick={handleRightClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
