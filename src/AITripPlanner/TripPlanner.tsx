import React, { useState } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import TripResult from './components/TripResult';
import { TripFormData, TripResponse, StatusState } from './types';
import './TripPlanner.css';

const TripPlanner: React.FC = () => {
  const [status, setStatus] = useState<StatusState>({ text: 'Ready', color: '#10b981' });
  const [tripResult, setTripResult] = useState<TripResponse | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);

  const handleTripGenerated = (data: TripResponse, form: TripFormData) => {
    setTripResult(data);
    setFormData(form);
    setStatus({ text: 'Complete', color: '#10b981' });
  };

  const updateStatus = (text: string, color: string) => {
    setStatus({ text, color });
  };

  return (
    <div className="App">
      <Header status={status} />
      <div className="container">
        <div className="left-panel">
          <TripForm 
            onTripGenerated={handleTripGenerated}
            updateStatus={updateStatus}
          />
        </div>
        <div className="right-panel">
          <TripResult 
            tripResult={tripResult}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;