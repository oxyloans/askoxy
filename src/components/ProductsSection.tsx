// src/components/ProductsSection.tsx
import React, { useState } from 'react';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import Rice from '../assets/img/2.png';
import Loans from '../assets/img/3.png';
import Study from '../assets/img/4.png';
import Insurance from '../assets/img/5.png';
import Investments from '../assets/img/6.png';
import { Link } from 'react-router-dom';

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
    <div className="px-4 py-8 mb-5 bg-white sm:px-10 md:px-20">
      {/* Container for search about products */}
      <div className="bg-gray-200 border-2 border-purple-600 shadow-lg rounded-xl">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Left side (Search about our famous products) */}
          <div className="w-full p-6 text-white shadow-lg lg:w-1/3 bg-gradient-to-b bg-gradient-from-t from-purple-500 to-purple-900 rounded-xl">
            <h3 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">Search About Our Famous</h3>
            <h1 className="text-3xl font-bold text-yellow-500 sm:text-4xl">PRODUCTS</h1>
            <p className="mt-4 text-base sm:text-lg">
              We're here to help you achieve your goals with tailored solutions and end-to-end support.
            </p>
          </div>

          {/* Right side (Product Cards with carousel navigation) */}
          <div className="flex items-center justify-between w-full lg:w-2/3">
            {/* Left arrow */}
            <IoMdArrowDropleft
              className={`cursor-pointer ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              size={40}
              onClick={handleLeftClick}
            />

            {/* Product Cards */}
            <div className="flex justify-between w-full space-x-4 overflow-hidden">
              {visibleProducts.map((product) => (
                <div key={product.id} className="flex-grow text-center bg-white rounded-lg shadow-lg">
                  <Link to={product.img} >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="object-cover w-full h-32 mb-0 rounded-t-lg"
                    />
                    </Link>
                  <button className="block w-full py-2 mt-0 font-semibold text-white bg-purple-900 border-none rounded-b-lg cursor-pointer">
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
