
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useGtagPageView = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (!window.gtag) return;
    
    // Send pageview with path
    window.gtag('config', 'G-7F5MXCYZ7W', {
      page_path: location.pathname + location.search
    });
    
  }, [location]);
};