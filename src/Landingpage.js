import React from 'react';
import './Landingpage.css';
import bg from './images/bg.png';
import LOGO2 from './images/logo3.png';
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

import I1 from './images/ICON1.png';
import I2 from './images/ICON2.png';
import I3 from './images/ICON3.png';



function Landingpage() {
  const logo = 'ASKOXY.ai';
  const title = 'Ask | Solve | Succeed';

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

            }}
          >
            <img src={LOGO2} alt={logo} className="logo-image" />
            <h1 className="Landingpage-title mb-3">{title}</h1>
            {/* <input
              type="text"
              className="Landingpage-search form-control w-75 mx-auto"
              placeholder="Looking for Universities..."
              style={{ width: '30%', padding: '12px' }} /> */}
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

      
      <div class="three-boxes-section" >
        <div class="main-heading-container">
          <h2 class="main-heading">We’re not just about advice</h2>
          <p class="main-subtitle">We're here to help you achieve your goals with tailored solutions and end-to-end support.</p>
        </div>

        <div class="box-container">
          <div class="box">
            <img src={I1} alt="Image 1" class="box-image" />
            <h3 class="box-heading">Simple Ask</h3>
            <p class="box-subtitle">Get instant answers or connect with a mentor who can guide you further. We make it easy to find the help you need.</p>
          </div>
          <div class="box">
            <img src={I2} alt="Image 2" class="box-image" />
            <h3 class="box-heading">Problem & Solutions</h3>
            <p class="box-subtitle">Describe your problem, and we’ll give you three practical solutions. Need more help? We connect you with experts and arrange the necessary funds to put the solution into action</p>
          </div>
          <div class="box">
            <img src={I3} alt="Image 3" class="box-image" />
            <h3 class="box-heading"> End-to-End Support</h3>
            <p class="box-subtitle">From identifying the problem to implementing the solution, we provide comprehensive support. Whether it’s guidance, mentorship, or financial assistance, we’re with you every step of the way.</p>
          </div>
        </div>
      </div>


      <div className="introduction-section">
        <div className="intro-content">
          <h2 className="intro-heading">We’re not just about advice</h2>
          <p className="intro-text">We're here to help you achieve your goals with tailored solutions and end-to-end support.</p>
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search..." />
          </div>
        </div>
      </div>


       <div class="info-section">
        <div class="section-header">
          <h2 class="section-title">Ready to Start? Choose Your Path</h2>
          <p class="section-description">We're here to help you achieve your goals with tailored solutions and end-to-end support.</p>
        </div>


      </div>

      <div class="testimonials-section">
        <h2 class="section-title">Testimonials</h2>
        <p class="section-description"></p>
        <div class="testimonials-container">
          <div class="testimonial">
            <p class="testimonial-text">"The service was amazing! Highly recommend."</p>
            <p class="testimonial-author">- Client 1</p>
          </div>
          <div class="testimonial">
            <p class="testimonial-text">"A seamless experience from start to finish."</p>
            <p class="testimonial-author">- Client 2</p>
          </div>
          <div class="testimonial">
            <p class="testimonial-text">"Outstanding support and great results!"</p>
            <p class="testimonial-author">- Client 3</p>
          </div>

          <div class="testimonial">
            <p class="testimonial-text">"The service was amazing! Highly recommend."</p>
            <p class="testimonial-author">- Client 1</p>
          </div>
          <div class="testimonial">
            <p class="testimonial-text">"A seamless experience from start to finish."</p>
            <p class="testimonial-author">- Client 2</p>
          </div>
          <div class="testimonial">
            <p class="testimonial-text">"Outstanding support and great results!"</p>
            <p class="testimonial-author">- Client 3</p>
          </div>
        </div>
      </div>




    </div>



  );
}

export default Landingpage;
