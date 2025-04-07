import React, { useState, useRef } from "react";
import html2canvas from 'html2canvas'; // Need to install this dependency
import './UniversityPromo.css';
import rdImage from '../assets/img/rd.png';

const UniversityPromoCard = () => {
  const cardRef = useRef(null);

  // State variables for customizable elements
  const [logos, setLogos] = useState({
    primary: null,
    secondary: null
  });
  const [universityImages, setUniversityImages] = useState([null, null, null]);
  const [personImage, setPersonImage] = useState(null);

  // Text content states
  const [universityName, setUniversityName] = useState("LONDON METROPOLITAN");
  const [universitySubtitle, setUniversitySubtitle] = useState("UNIVERSITY");
  const [admissionDate, setAdmissionDate] = useState("ADMISSION LAST DATE : 15 MAY 2025");
  // Add new state for paragraph text
  const [admissionParagraph, setAdmissionParagraph] = useState("Apply now for exclusive fast-track admission and join our prestigious programs with world-class faculty and excellent career opportunities.");
  const [cashbackPercent, setCashbackPercent] = useState("5%");
  const [offerTime, setOfferTime] = useState("10");
  const [scholarshipPercent, setScholarshipPercent] = useState("100%");
  const [contactNumber, setContactNumber] = useState("+91 89196 36330");
  const [website, setWebsite] = useState("studyabroad@askoxy.ai");
  const [personName, setPersonName] = useState("Radhakrishna Thatavarthi");
  const [personTitle, setPersonTitle] = useState("OXY GROUP Chairman");

  // Circle text states
  const [circleTexts, setCircleTexts] = useState(["CIRCLE 1", "CIRCLE 2", "CIRCLE 3"]);

  // Colors
  const [primaryColor, setPrimaryColor] = useState("#a30000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#fbac1a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [circleColor, setCircleColor] = useState("#002566"); // Navy blue color for circles
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Background color for both sections
  const [benefitsSectionColor, setBenefitsSectionColor] = useState("#ffffff"); 
  // Add new state for admission paragraph background color
  const [admissionBgColor, setAdmissionBgColor] = useState("#f2f2f2");
  // Add new state for admission paragraph text color
  const [admissionTextColor, setAdmissionTextColor] = useState("#333333");

  // Handle image uploads
  const handleImageUpload = (e, setter, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (index !== null) {
          // For array states like universityImages
          setter(prev => {
            const newImages = [...prev];
            newImages[index] = reader.result;
            return newImages;
          });
        } else {
          // For single image states
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo uploads
  const handleLogoUpload = (e, logoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogos(prev => ({
          ...prev,
          [logoType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle circle text changes
  const handleCircleTextChange = (e, index) => {
    const newTexts = [...circleTexts];
    newTexts[index] = e.target.value;
    setCircleTexts(newTexts);
  };

  // Function to download the card as an image
  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          // Find the cloned element and make sure the shapes render correctly
          const clonedCard = clonedDoc.querySelector('.promo-card');
          if (clonedCard) {
            // Make sure all elements are rendered properly
            const leftBg = clonedCard.querySelector('.left-background');
            if (leftBg) {
              leftBg.style.clipPath = 'polygon(100% 0, 50% 51%, 100% 100%, 0 100%, 0% 50%, 0 0)';
              leftBg.style.webkitClipPath = 'polygon(100% 0, 50% 51%, 100% 100%, 0 100%, 0% 50%, 0 0)';
            }
          }
        }
      }).then(canvas => {
        canvas.toBlob(function (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'university-promo-card.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      }).catch(error => {
        console.error("Error generating image:", error);
        alert("Failed to generate image. Please try again.");
      });
    }
  };

  return (
    <div className="container">
      <div className="editor-layout">
        {/* Preview Section */}
        <div className="preview-section">
          <div ref={cardRef} className="promo-card">
            {/* Base red background layer that extends under both sections */}
            <div className="base-red-background" style={{ backgroundColor: primaryColor }}></div>

            {/* Left Section with University Images */}
            <div className="left-section" style={{ position: 'relative', backgroundColor: backgroundColor }}>
              {/* SVG overlay instead of clip-path for better compatibility */}
              <svg className="left-shape" width="100%" height="100%" viewBox="0 0 240 600" preserveAspectRatio="none">
                <path
                  d="M0,0 L240,0 L120,300 L240,600 L0,600 L0,0 Z"
                  fill={primaryColor}
                />
              </svg>

              {/* Image 3 at top */}
              <div
                className="circle-image image-top"
                style={{
                  backgroundColor: circleColor,
                  border: `4px solid ${primaryColor}`,
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
                  zIndex: 5
                }}
              >
                {universityImages[2] ? (
                  <img src={universityImages[2]} alt="University" className="uploaded-image" />
                ) : (
                  <div className="circle-text">
                    <span className="circle-text-main">CIRCLE</span>
                    <span className="circle-text-number">3</span>
                  </div>
                )}
              </div>

              {/* Image 2 at center */}
              <div
                className="circle-image image-center"
                style={{
                  backgroundColor: circleColor,
                  border: `4px solid ${primaryColor}`,
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
                  zIndex: 5
                }}
              >
                {universityImages[1] ? (
                  <img src={universityImages[1]} alt="University" className="uploaded-image" />
                ) : (
                  <div className="circle-text">
                    <span className="circle-text-main">CIRCLE</span>
                    <span className="circle-text-number">2</span>
                  </div>
                )}
              </div>

              {/* Image 1 at bottom */}
              <div
                className="circle-image image-bottom"
                style={{
                  backgroundColor: circleColor,
                  border: `4px solid ${primaryColor}`,
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
                  zIndex: 5
                }}
              >
                {universityImages[0] ? (
                  <img src={universityImages[0]} alt="University" className="uploaded-image" />
                ) : (
                  <div className="circle-text">
                    <span className="circle-text-main">CIRCLE</span>
                    <span className="circle-text-number">1</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section with University Information */}
            <div className="right-section">
              {/* Logo Section - Now with red background */}
              <div className="logo-section" style={{ backgroundColor: backgroundColor }}>
                <div className="logo-container">
                  {logos.primary && <img src={logos.primary} alt="Primary Logo" className="logo" />}
                  {!logos.primary && <div className="logo-placeholder">Primary Logo</div>}
                </div>
                <div className="logo-container">
                  {logos.secondary && <img src={logos.secondary} alt="Secondary Logo" className="logo" />}
                  {!logos.secondary && <div className="logo-placeholder">Secondary Logo</div>}
                </div>
              </div>

              {/* University Name Section */}
              <div className="university-section" style={{ backgroundColor: backgroundColor }}>
                <h2 className="university-name" style={{color: admissionTextColor }}>{universityName}</h2>
                <h1 className="university-title" style={{ color: primaryColor  }}>{universitySubtitle}</h1>
                <div className="admission-date" style={{ border: `2px solid ${admissionTextColor}` ,color: admissionTextColor }}>
                  <p>{admissionDate}</p>
                </div>
                
                {/* New paragraph after admission date */}
                <div 
                  style={{ 
           
                    color: admissionTextColor, 
                    padding: "10px", 
                    marginTop: "10px", 
                    fontSize: "14px",
                    borderRadius: "4px"
                  }}
                >
                  <p style={{ color: primaryColor , margin: 0 }}>{admissionParagraph}</p>
                </div>
              </div>

              {/* Benefits Section - Now uses the custom benefits section color */}
              <div style={{ backgroundColor: backgroundColor, padding: "10px" }}>
                <div className="benefits-section" style={{ backgroundColor: primaryColor }}>
                  <div className="benefits-container">
                    <div className="benefit-item">
                      <div className="benefit-header">
                        <span className="benefit-label" style={{  color: benefitsSectionColor }}>Upto</span>
                        <span className="benefit-value" style={{ color: accentColor }}>{cashbackPercent}</span>
                      </div>
                      <p className="benefit-desc" style={{ color: benefitsSectionColor }}>Cashback, Save on university fees</p>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-header">
                        <span className="benefit-label" style={{ color: benefitsSectionColor }}>Offer letter</span>
                        <span className="benefit-value" style={{ color: accentColor }}>{offerTime} <span className="unit">Min</span></span>
                      </div>
                      <p className="benefit-desc" style={{ color: benefitsSectionColor }}>Share preferences on ASKOXY.AI & get a sample offer</p>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-header">
                        <span className="benefit-label" style={{  color: benefitsSectionColor  }}>Upto</span>
                        <span className="benefit-value" style={{ color: accentColor }}>{scholarshipPercent}</span>
                      </div>
                      <p className="benefit-desc" style={{ color: benefitsSectionColor }}>Scholarship for selected students</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Section */}
              <div className="contact-section" style={{ backgroundColor: backgroundColor }}>
                <div className="contact-info">
                
                  <p className="contact-value" style={{ color: primaryColor }}>📞{contactNumber}</p>

         
                  <p className="contact-value" style={{ color: primaryColor }}>📧{website}</p>
                </div>

                <div className="person-section">
                 
                    <img src={rdImage} alt="Representative" className="person-image" style={{    position: "relative",width: "180px",bottom:"60px", left:"-20px"}}/>
                 
                  <div className="person-info" style={{ backgroundColor: accentColor }}>
                    <p className="person-name">{personName}</p>
                    <p className="person-title">{personTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleDownload} className="download-button">Download Image</button>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
        <div className="control-group">
            <h3>Color Settings</h3>
            <div className="control-item">
              <label>Primary Color:</label>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
            </div>
            <div className="control-item">
              <label>Secondary Color:</label>
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
            </div>
            <div className="control-item">
              <label>Text Color:</label>
              <input type="color" value={benefitsSectionColor} onChange={(e) => setBenefitsSectionColor(e.target.value)} />
            </div>
            <div className="control-item">
              <label>PERCENT </label>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
            </div>
            {/* <div className="control-item">
              <label>PERCENT TEXT:</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
            </div> */}
            {/* <div className="control-item">
              <label>Circle Color (Navy):</label>
              <input type="color" value={circleColor} onChange={(e) => setCircleColor(e.target.value)} />
            </div> */}
      
            {/* <div className="control-item">
              <label>Benefits Section Color:</label>
              <input type="color" value={benefitsSectionColor} onChange={(e) => setBenefitsSectionColor(e.target.value)} />
            </div>
         
            <div className="control-item">
              <label>Admission Paragraph Background:</label>
              <input type="color" value={admissionBgColor} onChange={(e) => setAdmissionBgColor(e.target.value)} />
            </div> */}
            <div className="control-item">
              <label>Univeristy text</label>
              <input type="color" value={admissionTextColor} onChange={(e) => setAdmissionTextColor(e.target.value)} />
            </div>
          </div>
          <div className="control-group">
            <h3>Logo Uploads</h3>
            <div className="control-item">
              <label>Primary Logo:</label>
              <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'primary')} />
            </div>
            <div className="control-item">
              <label>Secondary Logo:</label>
              <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'secondary')} />
            </div>
          </div>
          <div className="control-group">
            <h3>Circle Images & Text</h3>
            <div className="control-item">
              <label>Image Top:</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setUniversityImages, 2)} />
            </div>
       
            <div className="control-item">
              <label>Image Center :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setUniversityImages, 1)} />
            </div>

            <div className="control-item">
              <label>Image Bottom:</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setUniversityImages, 0)} />
            </div>
           
            {/* <div className="control-item">
              <label>Person Image:</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setPersonImage)} />
            </div> */}
          </div>
          <div className="control-group">
            <h3>University Information</h3>
            <div className="control-item">
       
              <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
            </div>
            <div className="control-item">
         
              <input type="text" value={universitySubtitle} onChange={(e) => setUniversitySubtitle(e.target.value)} />
            </div>
            <div className="control-item">
      
              <input type="text" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
            </div>
            {/* New control for admission paragraph */}
            <div className="control-item">
              <label>Admission Paragraph:</label>
              <textarea 
                value={admissionParagraph} 
                onChange={(e) => setAdmissionParagraph(e.target.value)}
                style={{ height: "60px", width: "100%", padding: "8px", resize: "vertical" }}
              ></textarea>
            </div>
          </div>

         

          <div className="control-group">
            <h3>Benefits Information</h3>
            <div className="control-item">
          
              <input type="text" value={cashbackPercent} onChange={(e) => setCashbackPercent(e.target.value)} />
            </div>
            <div className="control-item">
           
              <input type="text" value={offerTime} onChange={(e) => setOfferTime(e.target.value)} />
            </div>
            <div className="control-item">
      
              <input type="text" value={scholarshipPercent} onChange={(e) => setScholarshipPercent(e.target.value)} />
            </div>
          </div>

          <div className="control-group">
            <h3>Contact Information</h3>
            <div className="control-item">
             
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>
            <div className="control-item">
        
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>

          <div className="control-group">
          
            <div className="control-item">
     
              <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} />
            </div>
            <div className="control-item">
           
              <input type="text" value={personTitle} onChange={(e) => setPersonTitle(e.target.value)} />
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default UniversityPromoCard;