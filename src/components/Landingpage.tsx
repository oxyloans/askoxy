import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon
import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import ProductsSection from './ProductsSection';
import Testimonials from './Testimonials';
import Footer from './Footer';

// You can customize the styling based on your project's requirements
const Landingpage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* Info Section */}
      <section>
        <InfoSection />
      </section>

      {/* Products Section */}
      {/* <section>
        <ProductsSection />
      </section> */}

      {/* Testimonials Section */}
      {/* <section>
        <Testimonials />
      </section> */}

      {/* Footer Section */}
      <footer>
        <Footer />
      </footer>

      {/* Example of how to integrate the search icon (you can place it wherever appropriate) */}
      {/* <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <FaSearch size={24} />
      </div> */}
    </>
  );
};

export default Landingpage;
