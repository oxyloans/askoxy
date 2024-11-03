import React from "react";
import "./Freerudraksha.css";
import WhatsApp from "../assets/img/WhatsApp.jpeg";
import WhatsApp2 from "../assets/img/WhatsApp2.jpeg";
import Header1 from "./Header1";
import Footer from "./Footer";
import Header2 from "./Header2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Freerudraksha: React.FC = () => {



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
      <Header2 />

      <div className="main-container" style={{ marginTop: "5rem" }}>
        <div className="container">
          {/* Header */}
          <header className="header">
            <h1 style={{ color: "rgba(91, 5, 213, 0.85)" }}>The Two Worlds</h1>
          </header>
          {/* Main Content */}
          <div className="worlds">
            <section className="spiritual-world">
              <h2>Spiritual World</h2>
              <img
                src={WhatsApp}
                alt="Spiritual World"
                className="world-image"
              />
            </section>
            <section className="ai-world">
              <h2>AI & Generative AI World</h2>
              <img src={WhatsApp2} alt="AI World" className="world-image" />
            </section>
          </div>
          {/* Details Section */}
          <div className="details">
            <p>
              <strong>1 crore Rudra Abhishekam:</strong> After the Abhishekam,
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
      </div>
      <Footer />
    </div>
  );
};

export default Freerudraksha;
