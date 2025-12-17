import React, { useState } from 'react';
import axios from 'axios';
import { TripFormData, TripResponse } from '../types';

interface TripFormProps {
  onTripGenerated: (data: TripResponse, form: TripFormData) => void;
  updateStatus: (text: string, color: string) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onTripGenerated, updateStatus }) => {
  const [formData, setFormData] = useState<TripFormData>({
    name: '',
    city: '',
    departure_city: 'New York',
    num_days: 5,
    no_of_persons: 2,
    mobile_number: '',
    budget_range: 'medium',
    currency: 'USD',
    multi_cities: [],
    model: 'gpt-4o-mini',
    travel_date: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'multi_cities') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(city => city.trim()).filter(city => city)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'num_days' || name === 'no_of_persons' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateStatus('Generating...', '#f59e0b');

    try {
      // const baseUrl = process.env.NODE_ENV === 'development' 
      //   ? 'http://127.0.0.1:8000' 
      //   : 'https://5fupmayclj.execute-api.ap-south-1.amazonaws.com/dev2';
       const baseUrl = process.env.NODE_ENV === 'development' 
        ? "https://5fupmayclj.execute-api.ap-south-1.amazonaws.com/dev2"
        : "https://5fupmayclj.execute-api.ap-south-1.amazonaws.com/dev2";

      const response = await axios.post(`${baseUrl}/trip-plan`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      onTripGenerated(response.data, formData);
    } catch (error) {
      console.error('Error generating trip:', error);
      updateStatus('Error', '#ef4444');
      alert('Failed to generate trip plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-content">
       {/* <img src="./assets/ask_oxy_white.png" alt="AskOxy Logo" className="logo" /> */}
      
     {/* <div className="welcome-section">
        <h1 className="welcome-title">Plan Your Journey</h1>
        <p className="welcome-subtitle">AI-powered travel itineraries 🌍</p>
        <div className="instructions">
          <p className="instruction-text">✨ Fill in your details below to get a personalized trip plan</p>
          <div className="features-list">
            <span className="feature-item">📍 Smart destinations</span>
            <span className="feature-item">💰 Real-time pricing</span>
            <span className="feature-item">🛡️ Safety ratings</span>
            <span className="feature-item">🌤️ Weather forecasts</span>
          </div>
        </div>
      </div> */}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">Destination</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City or country"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="departure_city">From</label>
              <input
                type="text"
                id="departure_city"
                name="departure_city"
                value={formData.departure_city}
                onChange={handleInputChange}
                placeholder="Your city"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_days">Days <span className="field-hint">(1-30)</span></label>
              <input
                type="number"
                id="num_days"
                name="num_days"
                value={formData.num_days}
                onChange={handleInputChange}
                min="1"
                max="30"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="no_of_persons">Travelers <span className="field-hint">(1-20)</span></label>
              <input
                type="number"
                id="no_of_persons"
                name="no_of_persons"
                value={formData.no_of_persons}
                onChange={handleInputChange}
                min="1"
                max="20"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                type="text"
                id="mobile_number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget_range">Budget</label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleInputChange}
              >
                <option value="budget">💰 Budget</option>
                <option value="medium">💳 Medium</option>
                <option value="luxury">💎 Luxury</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="travel_date">Travel Date</label>
              <input
                type="date"
                id="travel_date"
                name="travel_date"
                value={formData.travel_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="INR">🇮🇳 INR (₹)</option>
                <option value="USD">🇺🇸 USD ($)</option>
                <option value="EUR">🇪🇺 EUR (€)</option>
                <option value="GBP">🇬🇧 GBP (£)</option>
                <option value="JPY">🇯🇵 JPY (¥)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="multi_cities">Additional Cities <span className="field-hint">(Optional)</span></label>
              <input
                type="text"
                id="multi_cities"
                name="multi_cities"
                value={formData.multi_cities.join(', ')}
                onChange={handleInputChange}
                placeholder="Paris, Rome, Barcelona"
              />
              <small className="field-help">💡 Separate multiple cities with commas for multi-city trips</small>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Generating...' : '✈️ Generate Trip Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripForm;