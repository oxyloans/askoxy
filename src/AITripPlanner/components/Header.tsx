import React from 'react';
import { StatusState } from '../types';
import logo from "../ask_oxy_white.png";

interface HeaderProps {
  status: StatusState;
}

const Header: React.FC<HeaderProps> = ({ status }) => {
  const handleHelp = () => {
    alert('🎯 AI Trip Planner\n\n✨ Features:\n• Complete itineraries\n• Real-time pricing\n• Safety ratings\n• Weather forecasts\n• Audio summaries\n\n📧 Support: contact@askoxy.ai');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <img 
            src={logo} 
            alt="AskOxy" 
            className="header-logo" 
          />
          <div className="header-text">
            <h1 className="header-title">AI Trip Planner</h1>
            <span className="header-subtitle">Powered by AskOxy.ai</span>
          </div>
        </div>
        <div className="header-right">
          <div className="status-indicator">
            <div 
              className="status-dot" 
              style={{ background: status.color }}
            ></div>
            <span className="status-text">{status.text}</span>
          </div>
          <button className="help-btn" onClick={handleHelp} title="Help & Support">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9,9a3,3 0 1,1 6,0c0,2 -3,3 -3,3"></path>
              <path d="m12,17h.01"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;