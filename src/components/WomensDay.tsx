import React, { useState } from "react";
import "./WomensDay.css";
import WomensDay2025 from "../assets/img/WhatsApp Image 2025-03-08 at 12.08.11.png";

interface WomensDayProps {
  pdfUrl?: string;
}

const WomensDay: React.FC<WomensDayProps> = ({
  pdfUrl = "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirectDownloadUrl = (driveUrl: string) => {
    const fileId = driveUrl.split("/")[5];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);

      const directUrl = getDirectDownloadUrl(pdfUrl);
      const link = document.createElement("a");
      link.href = directUrl;
      link.download = "WomensDay_Celebration.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download the PDF. Please try again.");
      setIsDownloading(false);
    }
  };

  const openPdf = () => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="womens-day-container">
      <header className="header-section">
        <div className="logo-container">
          <span className="left-logo">ASKOXY.ai</span>
          <div className="center-logo">
            UNSTOPPABLE
            <br />
            PINK
            <br />
            FUNDING
            <br />
            SEASON - 2
          </div>
          <span className="right-logo">OXY GROUP</span>
        </div>
      </header>

      <h1 className="main-title">
        HAPPY
        <br />
        WOMEN'S DAY
      </h1>

      <div className="celebration-image-container">
        <img
          src={WomensDay2025}
          alt="Women's Day Celebration 2025"
          className="celebration-image"
        />
      </div>

      <section className="message-section">
        <h2 className="celebration-message">
          PROUD OF OUR WOMEN
          <br />
          MOTHERS, SISTERS, AND
          <br />
          GREAT FRIENDS
        </h2>
        <p className="chairman-info">
          Radhakrishna Thatavarti | OXY GROUP Chairman
        </p>
      </section>

      <div className="button-container">
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label="Download Celebration PDF"
        >
          {isDownloading ? "Downloading..." : "Download Celebration PDF"}
        </button>
        <button className="view-button" onClick={openPdf} aria-label="View PDF">
          View PDF
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WomensDay;
