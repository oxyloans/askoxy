import React, { useState, useRef } from "react";
import q11Image from '../assets/img/q11.jpg';
import rdImage from '../assets/img/rd.png';
import bgImage from '../assets/img/BG.png';
import html2canvas from 'html2canvas'; // Need to install this dependency

const PromoCard = () => {
    const cardRef = useRef(null);
    const [image, setImage] = useState(null);
    const [askOxyLogo, setAskOxyLogo] = useState(null);
    const [studyAbroadLogo, setStudyAbroadLogo] = useState(null);
    const [heading, setHeading] = useState("COMPUTER SCIENCE COURSE AT THE");
    const [highlightText, setHighlightText] = useState("ROBERT GORDON UNIVERSITY");
    const [cashback, setCashback] = useState("5%");
    const [offerTime, setOfferTime] = useState("10 Min");
    const [scholarship, setScholarship] = useState("100%");
    const [email, setEmail] = useState("studyabroad@askoxy.ai");
    const [phone, setPhone] = useState("89196 36330");
    const [text1, setText1] = useState("Upto");
    const [text2, setText2] = useState("Offer Letter");
    const [text3, setText3] = useState("Upto");
    const [paragraphText, setParagraphText] = useState("Apply now for the best opportunity to study abroad!");

    const [bigtext1, setBigtext1] = useState("Cashback, Save on university fees");
    const [bigtext2, setBigtext2] = useState("Share preferences on ASKOXY.AI & get a sample offer");
    const [bigtext3, setBigtext3] = useState("Scholarship for selected students");

    // Circle Badge States - Changed default text to be within 13 character limit
    const [badgeText, setBadgeText] = useState("Application deadline 30th Mar 2025");
    const [badgeColor, setBadgeColor] = useState("#fbac1a");
    const [badgeTextColor, setBadgeTextColor] = useState("#aa0600");
    const [badgeStrokeColor, setBadgeStrokeColor] = useState("#fbac1a");

    const [topSectionColor, setTopSectionColor] = useState("#005a66");
    const [sectionColor, setSectionColor] = useState("white");
    const [boxColor, setBoxColor] = useState("#fbac1a");
    const [headingColor, setHeadingColor] = useState("white");
    const [heading2Color, setHeading2Color] = useState("#fbac1a");
    const [h1, setH1] = useState("#005a66");
    const [h2, setH2] = useState("red");
    const [h3, setH3] = useState("black");

    // Function to download the card as an image
    const handleDownload = () => {
        if (cardRef.current) {
            // Display a loading message or spinner here if needed

            // Use html2canvas to capture the card as an image
            html2canvas(cardRef.current, {
                allowTaint: true,
                useCORS: true,
                scale: 2, // Higher scale for better quality
                backgroundColor: null,
                logging: false
            }).then(canvas => {
                // Convert canvas to blob
                canvas.toBlob(function (blob) {
                    // Create URL for the blob
                    const url = URL.createObjectURL(blob);

                    // Create a temporary anchor element
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'promo-card.png';

                    // Append to the document and trigger download
                    document.body.appendChild(link);
                    link.click();

                    // Clean up
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                });
            }).catch(error => {
                console.error("Error generating image:", error);
                alert("Failed to generate image. Please try again.");
            });
        }
    };

    // Function to format text with max 13 characters per line
    const formatHeadingText = (text) => {
        if (!text) return [];

        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            // If adding this word would exceed 13 chars
            if ((currentLine + ' ' + word).trim().length > 16) {
                // If current line is not empty, push it to lines
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }

                // If the word itself is longer than 13 chars, split it
                if (word.length > 16) {
                    let remainingWord = word;
                    while (remainingWord.length > 0) {
                        lines.push(remainingWord.slice(0, 16));
                        remainingWord = remainingWord.slice(16);
                    }
                } else {
                    currentLine = word;
                }
            } else {
                // Add word to current line
                currentLine = currentLine ? currentLine + ' ' + word : word;
            }
        });

        // Don't forget the last line
        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines;
    };

    // Calculate font size based on text length and number of lines
    const calculateFontSize = (text, lines) => {
        if (text.length > 16) {
            return `${Math.max(20, 28 - (text.length - 16) * 0.8)}px`;
        }
        // Reduce font size if we have many lines
        if (lines && lines.length > 2) {
            return `${Math.max(20, 28 - (lines.length - 2) * 2)}px`;
        }
        return '28px'; // Default size - reduced from 32px
    };

    // Calculate badge size - Modified to make the badge larger and responsive to text
    const calculateBadgeSize = (text) => {
        // Base size with adjustment for text length
        const baseSize = 110;
        const extraSize = Math.min(30, text.length * 2);
        return `${baseSize + extraSize}px`;
    };

    // Calculate badge font size - Modified for the 13 character restriction
    const calculateBadgeFontSize = (text) => {
        if (text.length <= 5) return '24px';
        if (text.length <= 8) return '22px';
        if (text.length <= 13) return '20px';
        return '18px'; // Default to largest safe size for longer text
    };

    // Function to format badge text with line breaks at 13 chars
    const formatBadgeText = (text) => {
        if (!text || text.length <= 13) return text;

        // Split badge text into chunks of 13 characters or less
        const lines = [];
        let remaining = text;

        while (remaining.length > 0) {
            if (remaining.length <= 13) {
                lines.push(remaining);
                break;
            }

            // Find a good breaking point (space) within first 13 chars
            let breakPoint = remaining.lastIndexOf(' ', 13);
            if (breakPoint === -1 || breakPoint === 0) {
                // No space found, just break at 13
                breakPoint = 13;
            }

            lines.push(remaining.substring(0, breakPoint).trim());
            remaining = remaining.substring(breakPoint).trim();
        }

        return lines.join('\n');
    };

    // Function to handle restricting to maximum 13 characters per line for badge
    const handleBadgeTextChange = (e) => {
        const text = e.target.value;
        setBadgeText(text);
    };

    const handleImageChange = (event, setImageFunction) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageFunction(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Format the heading texts
    const headingLines = formatHeadingText(heading);
    const highlightLines = formatHeadingText(highlightText);
    const formattedBadgeText = formatBadgeText(badgeText);

    return (
        <div className="container">
            <div style={{ display: 'flex' }}>
                <div style={{ margin: '20px' }}>
                    <div ref={cardRef} className="card" style={{ backgroundColor: sectionColor }}>
                        <div className="top-section" style={{ backgroundColor: topSectionColor }}>
                            <div className="header">
                                <div className="logo-container">
                                    {askOxyLogo && <img src={askOxyLogo} alt="ASKOXY.ai Logo" className="logo" />}
                                    {studyAbroadLogo && <img src={studyAbroadLogo} alt="Study Abroad Logo" className="logo" />}
                                </div>
                            </div>
                            <div className="content">
                                <div className="text-section">
                                    <div className="heading-container">
                                        {headingLines.map((line, index) => (
                                            <h1
                                                key={`heading-${index}`}
                                                className="heading"
                                                style={{
                                                    color: headingColor,
                                                    fontSize: calculateFontSize(line, headingLines),
                                                    lineHeight: "1.2",
                                                    margin: "5px 0"
                                                }}
                                            >
                                                {line}
                                            </h1>
                                        ))}
                                    </div>
                                    <div className="heading-container">
                                        {highlightLines.map((line, index) => (
                                            <h1
                                                key={`highlight-${index}`}
                                                className="heading highlight"
                                                style={{
                                                    color: heading2Color,
                                                    fontSize: calculateFontSize(line, highlightLines),
                                                    lineHeight: "1.2",
                                                    margin: "5px 0"
                                                }}
                                            >
                                                {line}
                                            </h1>
                                        ))}


                                    </div>
                                    <div className="paragraph-container" style={{ width: "50%" }}>
                                        <p
                                            className="paragraph-text"
                                            style={{
                                                color: headingColor,
                                                fontSize: "14px",
                                                lineHeight: "1.2",
                                                margin: "5px 0",
                                                transform: "rotate(0deg)",
                                                width: "100%",
                                                wordWrap: "break-word",
                                                overflow: "hidden",
                                                textAlign: "left"
                                            }}
                                        >
                                            {paragraphText}
                                        </p>
                                    </div>

                                </div>


                            </div>

                        </div>
                        <div className="image-container">
                            {image ? (
                                <div className="image-wrapper">
                                    <img src={image} alt="University" className="university-image" />
                                    <div
                                        className="badge-circle"
                                        style={{
                                            backgroundColor: badgeColor,
                                            border: `3px solid ${badgeStrokeColor}`,
                                            width: "150px",
                                            height: "150px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "10px",


                                        }}
                                    >
                                        <div
                                            style={{
                                                color: badgeTextColor,
                                                fontSize: calculateBadgeFontSize(badgeText),
                                                wordBreak: "break-word",
                                                textAlign: "center",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {formattedBadgeText.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < formattedBadgeText.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="default-image-container">
                                    <div className="image-placeholder">No Image</div>
                                    <div
                                        className="badge-circle-no-image"
                                        style={{
                                            backgroundColor: badgeColor,
                                            border: `3px solid ${badgeStrokeColor}`,
                                            width: "150px",
                                            height: "150px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "10px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: badgeTextColor,
                                                fontSize: calculateBadgeFontSize(badgeText),
                                                wordBreak: "break-word",
                                                textAlign: "center",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            {formattedBadgeText.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < formattedBadgeText.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bottom-section" style={{ backgroundColor: sectionColor }}>

                            <div style={{ display: 'flex' }}>
                                <div className="info-section">
                                    <div className="info-box" style={{ backgroundColor: boxColor }}>
                                        <p className="title" style={{ color: h2 }}>{text1}</p>
                                        <p className="value" style={{ color: h1 }}>{cashback}</p>
                                        <p className="subvalue" style={{ color: h3 }}>{bigtext1}</p>
                                    </div>
                                    <div className="info-box" style={{ backgroundColor: boxColor }}>
                                        <p className="title" style={{ color: h2 }}>{text2}</p>
                                        <p className="value" style={{ color: h1 }}>{offerTime}</p>
                                        <p className="subvalue" style={{ color: h3 }}>{bigtext2}</p>
                                    </div>
                                    <div className="info-box" style={{ backgroundColor: boxColor }}>
                                        <p className="title" style={{ color: h2 }}>{text3}</p>
                                        <p className="value" style={{ color: h1 }}>{scholarship}</p>
                                        <p className="subvalue" style={{ color: h3 }}>{bigtext3}</p>
                                    </div>


                                </div>

                                <div className="info-box" style={{ backgroundColor: "transparent", boxShadow: "none", top: "0px", position: "relative" }}>
                                    <img src={rdImage} alt="Feature image" className="info-image" style={{
                                        width: '215px',
                                        marginBottom: '10px',
                                        position: 'absolute',
                                        top: "-60px",
                                        right: "-60px"
                                    }} />
                                    <div style={{ position: "absolute", bottom: "0px", paddingLeft: "0px", backgroundColor: "white", borderRadius: "10px", paddingInline: "10px", paddingBlock: "5px" }}>
                                        <p className="image-heading" style={{ color: 'black', margin: "0px", padding: "0px" }}>RadhaKrishna.T</p>
                                        <p className="image-text" style={{ color: '#fbac1a', margin: "0px", padding: "0px", fontSize: "10px" }}>CEO/Co-Founder</p>
                                    </div>

                                </div>
                            </div>

                            <div className="contact-section">
                                <p className="number">📧 {email}</p>
                                <p className="number">📞 {phone}</p>
                            </div>
                        </div>

                    </div>
                    {/* Download Button */}
                    <div className="download-section">
                        <button
                            onClick={handleDownload}
                            className="download-button"
                        >
                            Download Image
                        </button>
                    </div>
                </div>


                <div style={{ margin: '20px' }}>
                    {/* File Upload Sections */}
                    <div className="color-edit-section">
                        <label>background1</label>
                        <input type="color" value={topSectionColor} onChange={(e) => setTopSectionColor(e.target.value)} />

                        <label>background2</label>
                        <input
                            type="color"
                            value={sectionColor}
                            onChange={(e) => setSectionColor(e.target.value)}
                        />

                        <label>3 boxes</label>
                        <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} />
                    </div>
                    <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }} >
                        <div className="upload-section">
                            <label>Image:</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage)} />
                        </div>
                        <div className="upload-section">
                            <label>Logo 1:   </label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setAskOxyLogo)} />
                        </div>
                        <div className="upload-section">
                            <label>Logo 2:   </label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setStudyAbroadLogo)} />
                        </div>
                    </div>

                    {/* Badge Settings - No character limit for input, but text is formatted */}
                    <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }} >

                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <label>Badge Text:</label>
                            <input
                                type="text"
                                value={badgeText}
                                onChange={handleBadgeTextChange}
                                style={{ width: "300px" }}
                            />

                        </div>
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <label>BG: </label>
                            <input
                                type="color"
                                value={badgeColor}
                                onChange={(e) => setBadgeColor(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <label>Text :</label>
                            <input
                                type="color"
                                value={badgeTextColor}
                                onChange={(e) => setBadgeTextColor(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <label>Stroke :</label>
                            <input
                                type="color"
                                value={badgeStrokeColor}
                                onChange={(e) => setBadgeStrokeColor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Text Inputs to control text inside the card */}
                    <div className="text-edit-section">
                        <h3>Edit Text Outside Card</h3>

                        <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }} >
                            <div>
                                <label>Heading1:</label>
                                <input
                                    type="text"
                                    value={heading}
                                    onChange={(e) => setHeading(e.target.value)}
                                />
                                <input type="color" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} style={{
                                    width: "50px",
                                    height: "50px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "transparent",
                                    padding: "5px",
                                    marginLeft: "0px",
                                }} />
                            </div>
                            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <label>Heading 2:</label>
                                <input
                                    type="text"
                                    value={highlightText}
                                    onChange={(e) => setHighlightText(e.target.value)}
                                />
                                <input type="color" value={heading2Color} onChange={(e) => setHeading2Color(e.target.value)} style={{
                                    width: "50px",
                                    height: "50px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "transparent",
                                    padding: "5px",
                                    marginLeft: "0px",
                                }} />
                            </div>
                        </div>

                        <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", }}>
                            <div style={{ display: 'flex', alignItems: "center", }}>
                                <label>Paragraph:</label>
                                <input
                                    type="text"
                                    value={paragraphText}
                                    onChange={(e) => setParagraphText(e.target.value)}
                                    style={{ width: "300px" }}
                                />
                            </div>
                            <input type="color" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} style={{
                                width: "50px",
                                height: "50px",
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                padding: "5px",
                                marginLeft: "0px",
                            }} />
                        </div>

                        <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>text1:</label>
                                <input
                                    type="text"
                                    value={text1}
                                    onChange={(e) => setText1(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>text2:</label>
                                <input
                                    type="text"
                                    value={text2}
                                    onChange={(e) => setText2(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>text3:</label>
                                <input
                                    type="text"
                                    value={text3}
                                    onChange={(e) => setText3(e.target.value)}
                                />
                            </div>
                            <input type="color" value={h2} onChange={(e) => setH2(e.target.value)} style={{
                                width: "50px",
                                height: "50px",
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                padding: "5px",
                                marginLeft: "0px",
                            }} />
                        </div>

                        <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>Value 1:</label>
                                <input
                                    type="text"
                                    value={cashback}
                                    onChange={(e) => setCashback(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>Value 2:</label>
                                <input
                                    type="text"
                                    value={offerTime}
                                    onChange={(e) => setOfferTime(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>Value 3:</label>
                                <input
                                    type="text"
                                    value={scholarship}
                                    onChange={(e) => setScholarship(e.target.value)}
                                />
                            </div>
                            <input type="color" value={h1} onChange={(e) => setH1(e.target.value)} style={{
                                width: "50px",
                                height: "50px",
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                padding: "5px",
                                marginLeft: "0px",
                            }} />
                        </div>

                        <div style={{ alignItems: 'center', display: "flex", justifyContent: 'center', backgroundColor: "rgb(221 221 221)", margin: "20px", padding: "10px", flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>bigtext1:</label>
                                <input
                                    type="text"
                                    value={bigtext1}
                                    onChange={(e) => setBigtext1(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>bigtext2:</label>
                                <input
                                    type="text"
                                    value={bigtext2}
                                    onChange={(e) => setBigtext2(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <label>bigtext3:</label>
                                <input
                                    type="text"
                                    value={bigtext3}
                                    onChange={(e) => setBigtext3(e.target.value)}
                                />
                            </div>
                            <input type="color" value={h3} onChange={(e) => setH3(e.target.value)} style={{
                                width: "50px",
                                height: "50px",
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                padding: "5px",
                                marginLeft: "0px",
                            }} />
                        </div>

                        <label>Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>


                </div>


            </div>


            <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background-color: #f0f0f0;
          min-height: 100vh;
        }
        .upload-section {
          margin-bottom: 10px;
        }
        .text-edit-section {
          margin-bottom: 20px;
        }
        .text-edit-section input {
          margin: 5px;
          padding: 10px;
          width: 300px;
          border: 1px solid #ccc;
        }
        .download-section {
          margin: 20px;
          display: flex;
          justify-content: center;
        }
        .download-button {
          background-color: #005a66;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .download-button:hover {
          background-color: #007a8a;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .download-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
.card {
  width: 600px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  background-color: white;
}

.card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%; /* Covers 30% of the card */
  background-image: url(${bgImage}); /* Replace with your image */
  background-size: cover;
  background-position: center;
  opacity: 0.08; /* 15% opacity */
  z-index: 1; /* Ensure it's the last layer */
  pointer-events: none; /* Makes sure it doesn't interfere with interactions */
}


        .top-section { 
          position: relative; 
          color: #fafafa;
          padding: 60px 80px 20px 20px;
          border-radius: 20px;
          transform: rotate(-3deg);
          width: 110%;
          margin-right: -5%;
          margin-top: -5%;
          background-color: rgb(0, 46, 73);
          overflow: hidden;
        }
        .top-section::before {
          content: ''; 
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url(${q11Image});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.15;
          z-index: -1;
        }
        .bottom-section {
          background-color: white;
          color: black;
          padding: 20px;
        }
        .header {
          text-align: center;
          transform: rotate(3deg);
          background-color:white;
        }
        .logo-container {
          display: flex;
          justify-content: space-between;
          width: 100px;
          height: 80px;
        }
        .logo {
          width: 205px;
          height: 40px;
          margin-top:10px;
          padding:10px;
        }
        .content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          transform: rotate(3deg);
        }
        .text-section {
          width: 60%;
          padding: 20px;
        }
        .heading-container {
          margin-bottom: 10px;
        }
        .heading {
          font-size: 28px;
          font-weight: bold;
          text-align: left;
          margin: 5px 0;
          padding: 0;
          color: white;
          line-height: 1.2;
          word-wrap: break-word;
        }
        .highlight {
          color: #fbac1a;
        }
        .image-container {
          width: 100%;
          position: absolute;
          right: -35%;
          top: 5%;

        }
        .image-wrapper {
          position: relative;
          display: inline-block;
        }
        .default-image-container {
          position: relative;
          display: inline-block
        }
        .university-image {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 6px solid white;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
          object-fit: cover;
        }
        .image-placeholder {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 6px solid white;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #555;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
        }
        .badge-circle, .badge-circle-no-image {
          position: absolute;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
          z-index: 10;
          font-weight: bold;
          text-transform: uppercase;
          padding: 4px;
          box-sizing: border-box;
          text-align: center;
        
          word-break: break-word;
        }
        .badge-circle {
          bottom: 80px;
          left: 0px;
          transform: translate(-30%, 30%);
          
        }
        .badge-circle-no-image {
          bottom: 80px;
          left: 0px;
          transform: translate(-30%, 30%);
          
          
        }
        .badge-circle span, .badge-circle-no-image span {
          display: block;
          white-space: normal;
          word-break: break-word;
          line-height: 1.1;
          padding: 2px;
          max-width: 100%;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
                  margin-bottom: 20px;
        }
        .info-box {
          background-color: #fbac1a;
          color: white;
          padding: 5px;
          border-radius: 10px;
          text-align: center;
          width: 30%;
          margin:5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          justify-content: center;
          align-items: center;
        }
        .contact-section {
          display: flex;
          justify-content: space-between;
          margin-top: 0px;
          font-size: 20px;
        }
        .value {
          font-size: 32px;
          font-weight: bold;
          margin: 0px;
          padding: 0px;
          color: #005a66;
        }
        .title {
          font-weight: bold;
          margin: 0px;
          padding: 0px;
          color: rgb(192, 0, 16);
        }
        .subvalue {
          margin: 8px;
          padding: 0px;
          color: black;
          font-weight: bold;
           font-size: 12px;
        }
        .number {
          font-size: 20px;
          padding-left: 10px;
          padding-right: 10px;
          margin: 10px;
        }




/* Large screens (default layout) */
@media screen and (min-width: 1201px) {
  .container > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
  }
  
  /* Fixed width for preview area */
  .container > div > div:first-child {
    flex: 0 0 600px;
    position: sticky;
    top: 20px;
  }
  
  /* Scrollable editing area */
  .container > div > div:last-child {
    flex: 1;
    max-width: 600px;
    overflow-y: auto;
    max-height: calc(100vh - 40px);
  }
}

/* Medium screens - maintain side-by-side with smaller preview */
@media screen and (max-width: 1200px) and (min-width: 901px) {
  .container > div {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
  }
  
  /* Make preview card smaller but maintain aspect ratio */
  .container > div > div:first-child {
    flex: 0 0 45%;
  }
  
  .container > div > div:last-child {
    flex: 0 0 50%;
  }
  
  .card {
    width: 100%;
    max-width: 500px;
    transform: scale(0.85);
    transform-origin: top left;
  }
  
  /* Adjust edit controls to fit smaller space */
  .text-edit-section input {
    width: calc(100% - 20px);
    max-width: 280px;
  }
}

/* Small tablets - still side by side but more compressed */
@media screen and (max-width: 900px) and (min-width: 701px) {
  .container > div {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
  }
  
  .container > div > div:first-child {
    flex: 0 0 40%;
  }
  
  .container > div > div:last-child {
    flex: 0 0 55%;
  }
  
  .card {
    width: 100%;
    max-width: 450px;
    transform: scale(0.75);
    transform-origin: top left;
  }
  
  /* Give more space for preview by reducing padding */
  .container {
    padding: 5px;
  }
  
  /* Make edit sections more compact */
  .text-edit-section input {
    padding: 5px;
  }
}

/* Mobile devices - create two-panel scrollable layout */
@media screen and (max-width: 700px) {
  .container {
    padding: 0;
    overflow: hidden;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Create split layout with fixed preview */
  .container > div {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Preview area takes 40% of screen height */
  .container > div > div:first-child {
    flex: 0 0 40%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  /* Card preview scaled to fit */
  .card {
    transform: scale(0.6);
    transform-origin: center center;
    max-height: 100%;
    margin: 0;
  }
  
  /* Controls area takes remaining height and scrolls */
  .container > div > div:last-child {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    max-height: 60vh;
  }
  
  /* Make controls more compact */
  .text-edit-section input {
    width: calc(100% - 10px);
    padding: 8px;
    margin: 3px;
  }
  
  /* Stack all input sections vertically */
  .text-edit-section > div {
    flex-direction: column;
  }
  
  /* Add visual separation between preview and controls */
  .container > div > div:last-child {
    border-top: 3px solid #ddd;
    background-color: #f5f5f5;
  }
  
  /* Make download button sticky at bottom */
  .download-section {
    position: sticky;
    bottom: 0;
    background-color: #f5f5f5;
    padding: 10px;
    margin: 0;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  }
}

/* Very small mobile devices */
@media screen and (max-width: 400px) {
  .card {
    transform: scale(0.5);
  }
  
  /* Further simplify form controls */
  .color-edit-section, .upload-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
      `}</style>
        </div>
    );
};

export default PromoCard;