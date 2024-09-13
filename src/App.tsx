import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Erice from './components/Erice';
import Landingpage from './components/Landingpage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/erice" element={<Erice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
