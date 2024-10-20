import React from 'react';
import diyasImage from "../assets/img/diwalli.jpeg"; // Replace with actual diya image
import sweetsImage from "../assets/img/sweets.jpeg"; // Replace with actual sweets image
import './DiwaliPage.css';
import Header1 from './Header1';
import Footer from './Footer';
import Firecracker from './Firecracker'; // Import the Firecracker component

const DiwaliPage: React.FC = () => {
  const whatsappNumber = '8143271105'; // WhatsApp number

  const handleWhatsAppClick = () => {
    const message = "All the best to study abroad aspirants applying for Jan Intake";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Header1 />
      <div className="container1">
        <div className="header">
          <h1 className="diwali-title"  style={{color:'rgba(121, 32, 199, 1)'}}>Happy Diwali from Oxy Group!</h1>
          <h3 className="diwali-subtitle">
            Celebrate this Diwali with Oxy Group! Get a free set of 6 diyas and sweets delivered to your doorstep. Just send us a message on WhatsApp!
          </h3>
        </div>

        <div className="diwali-images">
          <div className="image-container">
            <img
              src={diyasImage}
              alt="Diwali Diyas"
              className="diwali-diya"
            />
          </div>
          {/* <div className="image-container">
            <img
              src={sweetsImage}
              alt="Diwali Sweets"
              className="diwali-sweets"
            />
          </div> */}
        </div>

        <div className="details">
          <h2 className="offer-title">Free Diwali Diyas and Sweets Offer</h2>
          <p className="offer-description">We are giving away a set of 6 diyas and delicious sweets at no cost with free delivery!</p>
          <p>Click the button below to send us a WhatsApp message with your location and the message:</p>
          <p className="whatsapp-message">"All the best to study abroad aspirants applying for Jan Intake"</p>
          <p>We will deliver the diyas and sweets to your address for free.</p>
          <div className="buttons">
            <button onClick={handleWhatsAppClick} className="button demo">
              Send WhatsApp Message
            </button>
          </div>
        </div>
      </div>

      {/* Firecracker Animation */}
      <Firecracker />

      {/* Tracer Rocket Animation */}
      {/* <div className="rocket-container">
        <div className="rocket"></div>
        <div className="rocket-trail"></div>
      </div> */}

      <Footer />
    </>
  );
};

export default DiwaliPage;
