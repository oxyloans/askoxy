import React, { useState } from "react";
import diyasImage from "../assets/img/Diwali2.jpg";
import sweetsImage from "../assets/img/sweets.jpeg";
import "./DiwaliPage.css";
import Header1 from "./Header1";
import Footer from "./Footer";
import Firecracker from "./Firecracker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const Happy_Diwali: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const whatsappNumber = "9160463697";

  const handleWhatsAppClick = () => {
    const message = `Hi, thanks for the initiative! Please deliver Diyas to my residence. Sharing Google coordinates.

    \n   Best wishes to students heading to the US & UK for higher studies`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Header1 />
      <div className="event-container" style={{ paddingBottom: "100px" }}>
        <div className="event-content">
          <div className="diwali-images">
            <div className="image-container">
              <img
                src={diyasImage}
                alt="Diwali Diyas"
                className="diwali-diya"
              />
            </div>
          </div>
          <div className="event-details">
            <h1
              className="diwali-title"
              style={{ color: "rgba(121, 32, 199, 1)" }}
            >
              Happy Diwali from Oxy Group!
            </h1>
            <h3 className="diwali-subtitle">
              Celebrate this Diwali with Oxy Group! Get a free set of 6 diyas
              delivered to your doorstep. Just send us a message on WhatsApp!
            </h3>
            <h2 className="offer-title">Green Diwali with Clay Diyas</h2>
            <p className="offer-description">
              We are gifting a set of 6 clay diyas with free delivery!
            </p>
            <p>Click the button below to send us a message on WhatsApp.</p>
            <p className="whatsapp-message">
              "All the best to study abroad aspirants applying for the January
              intake!"
            </p>
            <div className="buttons">
              <button onClick={handleWhatsAppClick} className="button demo">
                <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />{" "}
                Send WhatsApp Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="carousel-container">
        <button className="carousel-button prev-button" onClick={goToPrevious}>
          &#9664;
        </button>
        <div className="carousel-images">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-image ${index === currentIndex ? "active" : ""}`}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
        <button className="carousel-button next-button" onClick={goToNext}>
          &#9654;
        </button>
      </div> */}
      <div>
        <h1 style={{ textAlign: "center", margin: "50px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
          </b>{" "}
          Companies
        </h1>

        <div className="event-container1">
          <div className="event-content1">
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img1} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              {/* <h2 className="subtitle2" >
                Oxyloans is a P2P NBFC
              </h2> */}
              <h1 className="diwali-title1" style={{ color: "#0a6fba" }}>
                Lend & Earn 1.5% - 2.5% Monthly RoI
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px" }}
              >
                OxyLoans.com is an RBI-approved P2P NBFC, a revolutionary
                fintech platform. We onboard tax-paying Individuals, and HNIs as
                Lenders. We enable lenders/ investors to exchange funds directly
                with borrowers. Our proprietary algorithms include credit
                scoring, underwriting, and loan agreement preparation.
              </h3>
              <h3 className="diwali-subtitle1" style={{ fontWeight: "bold" }}>
                ₹1000000000+<b>DISBURSAL</b> <br></br> 30000+ <b>LENDERS</b>
                <br></br> 270000+ <b>BORROWERS</b>
              </h3>
              <div className="buttons">
                <a
                  href="https://oxyloans.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="button demo">Start Lending</button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#c26c27" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img2} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#c26c27" }}>
                Fractional Investments in Lands & Buildings
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                OXYBRICKS is the first Blockchain platform that enables
                fractional investment in lands & buildings: a Blockchain tech
                platform that allows principal guarantee, monthly earnings, and
                property appreciation.
              </h3>

              <div className="buttons">
                <a
                  href="https://oxybricks.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#c26c27" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#05a446" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img6} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#05a446" }}>
                Order . Rice . Online
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{
                  padding: "0px",
                  margin: "0px",
                  paddingBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                Free Delivery | All Over Hyderabad
              </h3>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                All type of rice brands available. Sri Lalitha, Kurnool, RRI,
                Cow brand, Sree Maateja, Kolam Rice, Surya Teja’s Brand, Gajraj
                Evergreen, Shubodayam, 5 Star, JSR
              </h3>
              <h3
                className="diwali-subtitle1"
                style={{
                  padding: "0px",
                  margin: "0px",
                  paddingBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                Return & Exchange Guarantee | Available Now : Steamed & Raw Rice
              </h3>

              <div className="buttons">
                <a
                  href="https://erice.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#05a446" }}
                  >
                    order rice
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#583e99" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img4} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#583e99" }}>
                All your ideas at one place
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                BMV.Money is an Bridgital Marketplace connecting stakeholders in
                global immigration services, property management, machinery
                purchases, startup mentoring, and job orientation programs.
              </h3>

              <div className="buttons">
                <a
                  href="https://bmv.money/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#583e99" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#189c9e" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img5} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#189c9e" }}>
                Find your dream home
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                XPERT HOMES is a leading property management company offering
                transparent, high-quality services. We help property owners
                maximize ROI and find verified tenants through our comprehensive
                360° management solutions.
              </h3>

              <div className="buttons">
                <a
                  href="https://xperthomes.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#189c9e" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Group Section */}
        <div className="px-6 py-5 bg-[#f1f1f1] md:p-10">
          <h2 className="mb-4 text-2xl font-bold text-center text-purple-700 md:text-3xl">
            OxyGroup Companies
          </h2>
          <div className="relative w-full max-w-[800px] mx-auto overflow-hidden">
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-white rounded-full left-2 top-1/2"
              onClick={handlePrev}
            >
              ←
            </button>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, idx) => (
                <div key={idx} className="flex-shrink-0 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-white rounded-full right-2 top-1/2"
              onClick={handleNext}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* <Firecracker /> */}
      <Footer />
    </>
  );
};

export default Happy_Diwali;
