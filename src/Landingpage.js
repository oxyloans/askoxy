import React from 'react';
import './Landingpage.css';
import bg from './images/bg.png';
import LOGO2 from './images/logo2.png';
import HM1 from './images/6.png';
import HM2 from './images/8.png';
import HM3 from './images/7.png';
import HM4 from './images/4.1.png';
import HM5 from './images/5.png';
import HM6 from './images/V1.png';
import HM7 from './images/V2.png';
import HM8 from './images/V3.png';
import HM9 from './images/V4.png';
import HM10 from './images/V5.png';
import HM11 from './images/V6.png';
import HM12 from './images/V8.png';
import HM13 from './images/V7.png';
import HM14 from './images/V9.png';
import HM15 from './images/V11.png';

function Landingpage() {
  const logo = 'ASKOXY.ai';
  const title = 'Any question to your abroad plan';

  const images = [
    { src: HM1, alt: 'Image 1', text: 'IT & AI Services' },
    { src: HM2, alt: 'Image 2', text: 'Legal Services' },
    { src: HM3, alt: 'Image 3', text: 'Builder Loans' },
    { src: HM4, alt: 'Image 4', text: 'Rental Services' },
    { src: HM5, alt: 'Image 5', text: 'Global Education' },

    { src: HM6, alt: 'Image 6', text: 'Groceries' },
    { src: HM7, alt: 'Image 7', text: 'Games' },
    { src: HM8, alt: 'Image 8', text: 'Tickets' },
    { src: HM9, alt: 'Image 9', text: 'Transportation' },
    { src: HM10, alt: 'Image 10', text: 'Streetwear' },
    { src: HM11, alt: 'Image 11', text: 'Automotive' },
    { src: HM12, alt: 'Image 12', text: 'Food & Beverage' },
    { src: HM13, alt: 'Image 13', text: 'Travel' },
    { src: HM14, alt: 'Image 14', text: 'Education' },
    { src: HM15, alt: 'Image 15', text: 'Health & Wellness' }
  ];

  const extendedImages = [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images,];

  function shuffleNoAdjacent(array) {
    // Initial shuffle
    let shuffled = array.sort(() => Math.random() - 0.5);
  
    for (let i = 0; i < shuffled.length - 3; i++) {
      // Check for duplicates in the next three positions
      if (
        shuffled[i].src === shuffled[i + 1].src ||
        shuffled[i].src === shuffled[i + 2].src ||
        shuffled[i].src === shuffled[i + 3].src
      ) {
        let j = i + 3;
        // Find a suitable image that isn't the same as the current image
        while (
          j < shuffled.length &&
          (shuffled[i].src === shuffled[j].src)
        ) {
          j++;
        }
        if (j < shuffled.length) {
          // Swap the images
          [shuffled[i + 3], shuffled[j]] = [shuffled[j], shuffled[i + 3]];
        }
      }
    }
  
    // Final shuffle to randomize the rest without breaking the no-adjacency rule
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
  
    return shuffled;
  }
  
  

  return (
    <div className="Landingpage d-flex flex-column min-vh-100">
      <main className="Landingpage-main d-flex flex-grow-1 align-items-center justify-content-center">
        <div className="Landingpage-center-div position-relative w-100 h-120 d-flex flex-column align-items-center justify-content-center">
          <div
            className="Landingpage-second-sub-div d-flex flex-column align-items-center justify-content-center text-center"
            style={{
              backgroundImage: `url(${bg})`,
              // width: '55%',
              // height: '70%',
            }}
          >
            <img src={LOGO2} alt={logo} className="logo-image" />
            <h1 className="Landingpage-title mb-3">{title}</h1>
            <input
              type="text"
              className="Landingpage-search form-control w-75 mx-auto"
              placeholder="Looking for Universities..."
              style={{ width: '30%', padding: '12px' }} />
          </div>

          <div className="Landingpage-scroll-container">
            <div className="Landingpage-scroll-line">
              {shuffleNoAdjacent(extendedImages).map((item, index) => (
                <div key={index} className="Landingpage-image-container">
                  <img src={item.src} alt={item.alt} className="img-fluid" />
                  <div className="Landingpage-dummy-text">{item.text}</div>
                </div>
              ))}
            </div>

            {/* This line will scroll from right to left */}
            <div className="Landingpage-scroll-line reverse">
              {shuffleNoAdjacent(extendedImages).map((item, index) => (
                <div key={index} className="Landingpage-image-container">
                  <img src={item.src} alt={item.alt} className="img-fluid" />
                  <div className="Landingpage-dummy-text">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="Landingpage-scroll-line">
              {shuffleNoAdjacent(extendedImages).map((item, index) => (
                <div key={index} className="Landingpage-image-container">
                  <img src={item.src} alt={item.alt} className="img-fluid" />
                  <div className="Landingpage-dummy-text">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landingpage;
