// src/components/ProductsSection.tsx
import React, { useState, useEffect } from 'react';
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
  const [productsToShow, setProductsToShow] = useState(3);

  // Dynamically update the number of products to show based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProductsToShow(1); // Show 1 product on mobile screens
      } else {
        setProductsToShow(3); // Show 3 products on larger screens
      }
    };

    handleResize(); // Call once to set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const visibleProducts = products.slice(startIndex, startIndex + productsToShow);

  const handleLeftClick = () => {
    setStartIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : products.length - productsToShow
    );
  };

  const handleRightClick = () => {
    setStartIndex((prevIndex) =>
      prevIndex < products.length - productsToShow ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="products-section">
      <div className="products-container">
        <div className="left-section">
          <h2 >Search About Our Famous</h2>
          <h1>PRODUCTS</h1>
          <p>
            We're here to help you achieve your goals with tailored solutions and end-to-end support.
          </p>
        </div>

        {/* Right side (Product Cards with arrows) */}
        <div className="right-section">
          <IoMdArrowDropleft
            className={`arrow ${startIndex === 0 ? 'disabled' : ''}`}
            size={40}
            onClick={handleLeftClick}
          />

          {/* Product Cards */}
          <div className="product-cards">
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.img}
                  alt={product.name}
                  className="product-image"
                />
                <button className="product-button">
                  {product.name}
                </button>
              </div>
            ))}
          </div>

          <IoMdArrowDropright
            className={`arrow ${startIndex === products.length - productsToShow ? 'disabled' : ''}`}
            size={40}
            onClick={handleRightClick}
          />
        </div>
      </div>

      {/* CSS Styles with Media Queries */}
      <style>{`
        .products-section {
          padding: 2rem;
          background-color: white;
        }

        .products-container {
          display: flex;
          justify-content: space-between;
          background-color: #f3f4f6;
          border: 2px solid #6b21a8;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .left-section {
          flex: 1;
          padding: 1.5rem;
          background: linear-gradient(to bottom, #6b21a8, #4c1d95);
          color: white;
          border-radius: 1rem;
        }

        .left-section h1 {
          color: #fbbf24;
        }

        .right-section {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .arrow {
          cursor: pointer;
        }

        .disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .product-cards {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
        }

        .product-card {
          flex-grow: 1;
          text-align: center;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }

        .product-image {
          object-fit: cover;
          width: 100%;
          height: 200px; /* Fixed height */
          margin-bottom: 1rem;
          border-radius: 0.5rem;
        }

        .product-button {
          display: block;
          width: 100%;
          padding: 0.5rem;
          background-color: #4c1d95;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          border-radius: 0.5rem;
        }

        .product-button:hover {
          background-color: #6b21a8;
        }

        /* Media Queries for mobile view */
        @media (max-width: 768px) {
         .products-container {
         flex-direction: column;
         padding:1rem
        }

          .right-section {
            flex-direction: row;
            padding-top:30px
          }

          .product-cards {
            display: flex;
            justify-content: center;
            gap: 0;
          }

          .product-card {
            width: 100%; /* Show one product card at a time */
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsSection;
