// src/components/CombinedSections.tsx
import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon
import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import ProductsSection from './ProductsSection';
import Testimonials from './Testimonials';
import Footer from './Footer';


const Landingpage: React.FC = () => {
  return (
      <>
    <HeroSection/>

   <InfoSection/>
   <ProductsSection/>
   <Testimonials/>
   <Footer/></>
  );
};

export default Landingpage;
