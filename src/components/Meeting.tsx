import React from 'react';
import meeting from "../assets/img/meeting.jpeg";
import './Card.css';
import Header1 from './Header1';
import Footer from './Footer';

const Meeting: React.FC = () => {
  return (
    <>  <Header1 />
      <div className="container1">
      
        <div className="header">
          <h1 style={{ color: 'rgba(121, 32, 199, 1)', fontWeight: '700' }}>Gen AI for ALL</h1>
          <h3 style={{ color: '#555', fontWeight: '400' }}>Join us for an insightful session exploring the capabilities and applications of Generative AI for learners, developers, entrepreneurs, and investors.</h3>
        </div>
        <div className="template-card">
          <div className="image-container">
            <img
              src={meeting} // Replace with your actual image URL
              alt="Gen AI for ALL"
            />
          </div>
          <div className="details">
            <h2 style={{ color: 'rgba(121, 32, 199, 1)', fontWeight: '600' }}>Gen AI for ALL</h2>
            <p>Google Meet, Gen AI For ALL</p>
            <p>Saturday, October 19 · 11:00am – 12:00pm</p>
            <p>Gen AI for learners, developers, architects, entrepreneurs, investors, and fund houses.</p>
            <p>Greetings!! Today, 11 am deep dive session is confirmed, Google Meet link will be shared soon.</p>
            <div className="buttons">
              <a href="https://meet.google.com/chq-svdm-tcz" className="button demo" target="_blank" rel="noopener noreferrer">
                Join Video Call
              </a>
            </div>
          </div>
        </div>
      
      </div>
      <Footer />
    </>
  );
};

export default Meeting;
