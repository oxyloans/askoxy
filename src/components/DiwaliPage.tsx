import React from "react";
import diyasImage from "../assets/img/diwalli.jpeg"; 
import sweetsImage from "../assets/img/sweets.jpeg"; 
import "./DiwaliPage.css";
import Header1 from "./Header1";
import Footer from "./Footer";
import Firecracker from "./Firecracker"; 

const DiwaliPage: React.FC = () => {
  const whatsappNumber = "9160463697"; 

  const handleWhatsAppClick = () => {
    const message =
      "All the best to study abroad aspirants applying for Jan Intake";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Header1 />
      <div className="container1">
        <div className="header">
          <br></br>
          <br></br>
          <h1
            className="m-2 diwali-title"
            style={{ color: "rgba(121, 32, 199, 1)", margin: "2rem" }}
          >
            Happy Diwali from Oxy Group!
          </h1>
          <h3 className="diwali-subtitle">
            Celebrate this Diwali with Oxy Group! Get a free set of 6 diyas  delivered to your doorstep. Just send us a message on
            WhatsApp!
          </h3>
        </div>

        <div className="diwali-images">
          <div className="image-container">
            <img src={diyasImage} alt="Diwali Diyas" className="diwali-diya" />
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
          <h2 className="offer-title">Free Diwali Diyas Offer!</h2>
          <p className="offer-description">
            We are giving a set of 6 diyas at no cost with free delivery!
          </p>
          <p>Click the button below to send us a message on WhatsApp.</p>
          <p className="whatsapp-message">
            "All the best to study abroad aspirants applying for the January
            intake!"
          </p>
          {/* <p>We will deliver the diyas and sweets to your address for free.</p> */}
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
