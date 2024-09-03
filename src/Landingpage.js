import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import HM16 from './images/9.png';

import I1 from './images/ICON1.png';
import I2 from './images/ICON2.png';
import I3 from './images/ICON3.png';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faLightbulb, faHandsHelping } from '@fortawesome/free-solid-svg-icons';


function Landingpage() {
  const logo = 'ASKOXY.ai';
  const title = 'Ask | Solve | Succeed';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/erice');
  };



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
    { src: HM15, alt: 'Image 15', text: 'Health & Wellness' },
    { src: HM16, alt: 'Image 16', text: 'Erice' }
  ];

  const extendedImages = new Array(14).fill(images).flat();

  // Shuffle images once and store in a variable
  const shuffledImages = shuffleNoAdjacent([...extendedImages]);

  function shuffleNoAdjacent(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    for (let i = 1; i < array.length; i++) {
      if (array[i].src === array[i - 1].src) {
        if (i + 1 < array.length) {
          [array[i], array[i + 1]] = [array[i + 1], array[i]];
        }
      }
    }

    return array;
  }
  // animate up
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    {
      type: "Simple Ask",
      heading: "Simple Ask",
      paragraph: "Make it easy for you to get what you need"
    },
    {
      type: "Problem & Solutions",
      heading: "Problem & Solutions",
      paragraph: "Solve your problem with a solution that works."
    },
    {
      type: "End-to-End Support",
      heading: "End-to-End Support",
      paragraph: " Support you every step of the way, from start to finish."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

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

            <div>
              <img src={LOGO2} alt={logo} className="logo-image" />
              <h1 className="Landingpage-title mb-3">{title}</h1>
            </div>

            <div className="text-slider">
              <div className="text-container">
                {texts.map((text, index) => (
                  <div
                    key={index}
                    className={`text-item ${index === currentIndex ? 'active' : ''} ${index === (currentIndex - 1 + texts.length) % texts.length ? 'previous' : ''}`}
                  >
                    <FontAwesomeIcon
                      icon={index === 0 ? faQuestionCircle : index === 1 ? faLightbulb : faHandsHelping}
                      className="text-icon"
                    />
                    {text.type}
                  </div>
                ))}
              </div>
              <div className="buttons-container">
                {texts.map((text, index) => (
                  <button className="slider-button" key={index}>
                    <h3>{text.heading}</h3>
                    <p>{text.paragraph}</p>
                  </button>
                ))}
              </div>
            </div>


          </div>

          <div className="Landingpage-scroll-container">
            <div className="Landingpage-scroll-line">
              {shuffleNoAdjacent([...extendedImages]).map((item, index) => (
                <div key={index} className="Landingpage-image-container">
                  <img src={item.src} alt={item.alt} className="img-fluid" />
                  <div className="Landingpage-dummy-text">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="Landingpage-scroll-line reverse">
              {shuffleNoAdjacent([...extendedImages]).map((item, index) => (
                <div key={index} className="Landingpage-image-container">
                  <img src={item.src} alt={item.alt} className="img-fluid" />
                  <div className="Landingpage-dummy-text">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="Landingpage-scroll-line">
              {shuffleNoAdjacent([...extendedImages]).map((item, index) => (
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
