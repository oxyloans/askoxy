import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon
// import HeroSection from './HeroSection';
// import InfoSection from './InfoSection';
// import ProductsSection from './ProductsSection';
// import Testimonials from './Testimonials';
import Header from './Header';
import ServicesSlider from './ServicesSlider';
import HorizontalScrollGallery from './ServicesUI';
import FreeGPTs from './FreeGPTs';
import BMVCoinPromo from './BMVCoinPromo';
import OXYGroupCompanies from './OXYGroupCompanies';
import Footer from './Footer';
import OurPeople from './OurTeam';
import PdfPages from './Presentation';

// You can customize the styling based on your project's requirements
const Landingpage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
     
    <Header/>
     

      {/* Info Section */}
      
      
     <section> <HorizontalScrollGallery/></section>
     <section className='mt-0'>
        <ServicesSlider />
        </section>
        
      <FreeGPTs />
      <OurPeople/>
     
      <BMVCoinPromo />
      <PdfPages/>
     
        <OXYGroupCompanies />
    

      {/* Products Section */}
      {/* <section>
        <ProductsSection />
      </section> */}

      {/* Testimonials Section */}
      {/* <section>
        <Testimonials />
      </section> */}

      {/* Footer Section */}
     
        <Footer />
      

      
    </>
  );
};

export default Landingpage;
