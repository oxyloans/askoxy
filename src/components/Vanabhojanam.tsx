import React,{useState} from "react";
import "./Freerudraksha.css";
import WhatsApp from "../assets/img/WhatsApp.jpeg";
import WhatsApp2 from "../assets/img/WhatsApp2.jpeg";
import Header1 from "./Header1";
import Footer from "./Footer";
import Header2 from "./Header2";
import  './DiwaliPage.css'
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

const Vanabhojanam: React.FC = () => {

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
    <div>
     
      <div className="main-container">
        <div className="container">
          {/* Header */}
          <header className="header">
            <h1 style={{ color: "rgba(91, 5, 213, 0.85)" }}>Vanabhojanam</h1>
          </header>
          {/* Main Content */}
          <div className="worlds">
            <section className="spiritual-world">
              <h2>Urban SpringSanto</h2>
              <img
                src={''}
                alt="Urban spring santo"
                className="world-image"
              />
            </section>
            <section className="ai-world">
              <h2>AI & Generative AI World</h2>
              <img src={""} alt="Urban spring" className="world-image" />
            </section>
          </div>
          {/* Details Section */}
          <div className="details">
            <p>
              <strong>1 Crore Rudra Abhishekam</strong> After the Abhishekam,
              Rudraksha will be distributed for free.
            </p>
            <p>
              Every home will receive free training in AI and Generative AI,
              enabling a continuous income stream.
            </p>
          </div>
          <div className="details">
            <p>
              <strong>
                రెండు లోకాలు ఆధ్యాత్మిక లోకం ఎఐ & జనరేటివ్ ఎఐ లోకం కోటి
                రుద్రాభిషేకం.
              </strong>{" "}
              అభిషేకం తర్వాత రుద్రాక్షలను ఉచితంగా పంచబడతాయి.
            </p>
            <p>
              ప్రతి ఇంటికి ఎఐ మరియు జనరేటివ్ ఎఐలో ఉచిత శిక్షణ అందించబడుతుంది,
              దీని ద్వారా నిరంతర ఆదాయం సాధించగలరు.
            </p>
          </div>
          <div className="buttons"  style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <button onClick={handleWhatsAppClick} className="button demo">
              <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />{" "}
              Send WhatsApp Message
            </button>
          </div>

        </div>
        <div>
        <h1 style={{ textAlign: "center", margin: "50px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
          </b>{" "}
          <span className="text-[#FFA500]">Companies</span>
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
        <h1 style={{ textAlign: "center", margin: "10px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
          </b>{" "}
          <span className="text-[#FFA500]">Companies</span>
        </h1>


  <div className="relative w-full max-w-[800px] mx-auto overflow-hidden">
    <button
      className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full left-2 top-1/2 hover:bg-blue-700" // Adds blue background and white text color
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
      className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full right-2 top-1/2 hover:bg-blue-700" // Adds blue background and white text color
      onClick={handleNext}
    >
      →
    </button>
  </div>
</div>

      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vanabhojanam;
