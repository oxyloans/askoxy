import React, { useState, useEffect } from 'react';

// Import images for 9 grid items
import s1 from '../assets/img/s1.png';
import s2 from '../assets/img/s2.png';
import s3 from '../assets/img/s3.png';
import s4 from '../assets/img/s4.png';
import s5 from '../assets/img/s5.png';
import s6 from '../assets/img/s6.png';
import s7 from '../assets/img/s7.png';
import s8 from '../assets/img/s8.png';
import s9 from '../assets/img/s9.png';

// Left side big image (phone)
import leftImage from '../assets/img/megahero.png';

// Two background PNGs for decorative elements
import purpleLines from '../assets/img/purplelines.png';
import goldLines from '../assets/img/goldlines.png';

const gridImages = [
  { id: 's1', src: s1, route: '/ai-blockchain' },
  { id: 's2', src: s2, route: '/ca-cs-services' },
  { id: 's3', src: s3, route: '/gold-silver-diamonds' },
  { id: 's4', src: s4, route: '/lend-earn' },
  { id: 's5', src: s5, route: '/nyaya-gpt' },
  { id: 's6', src: s6, route: '/real-estate' },
  { id: 's7', src: s7, route: '/rice-robo-ecommerce' },
  { id: 's8', src: s8, route: '/software-training' },
  { id: 's9', src: s9, route: '/study-abroad' },
];

const servicesData = [
  {
    id: 's1',
    name: 'AI & Blockchain Services',
    route: '/ai-blockchain',
    description: 'Advanced AI solutions and blockchain technology services to transform your business operations.',
    features: ['Smart Contracts', 'AI Automation', 'Blockchain Development']
  },
  {
    id: 's2',
    name: 'CA | CS Services',
    route: '/ca-cs-services',
    description: 'Professional chartered accountant and company secretary services for your business compliance.',
    features: ['Tax Planning', 'Legal Compliance', 'Financial Advisory']
  },
  {
    id: 's3',
    name: 'GOLD, Silver & Diamonds',
    route: '/gold-silver-diamonds',
    description: 'Premium precious metals and diamond trading with guaranteed authenticity and best prices.',
    features: ['Certified Quality', 'Best Rates', 'Secure Trading']
  },
  {
    id: 's4',
    name: 'Loans & Investments',
    route: '/lend-earn',
    description: 'Smart lending solutions and investment opportunities to grow your wealth securely.',
    features: ['Low Interest', 'Quick Approval', 'High Returns']
  },
  {
    id: 's5',
    name: 'NYAYA GPT',
    route: '/nyaya-gpt',
    description: 'AI-powered legal assistant providing instant legal advice and documentation support.',
    features: ['Legal Advice', 'Document Drafting', '24/7 Support']
  },
  {
    id: 's6',
    name: 'Fractional Ownership',
    route: '/real-estate',
    description: 'Invest in premium real estate with fractional ownership and earn passive income.',
    features: ['Low Investment', 'High Returns', 'Property Management']
  },
  {
    id: 's7',
    name: 'RICT 2 ROBO ECommerce',
    route: '/rice-robo-ecommerce',
    description: 'Automated e-commerce solutions with robotic fulfillment and AI-driven operations.',
    features: ['Automation', 'Fast Delivery', 'AI Analytics']
  },
  {
    id: 's8',
    name: 'SOFTWARE TRAINING',
    route: '/software-training',
    description: 'Comprehensive software training programs to enhance your technical skills and career.',
    features: ['Expert Trainers', 'Hands-on Learning', 'Job Assistance']
  },
  {
    id: 's9',
    name: 'STUDY ABROAD',
    route: '/study-abroad',
    description: 'Complete guidance for studying abroad including admissions, visas, and scholarships.',
    features: ['University Selection', 'Visa Support', 'Scholarship Guidance']
  }
];

export default function UnicornGrid() {
  const [activeService, setActiveService] = useState(0);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const [phoneAnimation, setPhoneAnimation] = useState(false);

   const handleNavigation = (route: string) => {
    console.log(`Navigating to: ${route}`);
    // Add your navigation logic here
  };

  const handlePhoneClick = () => {
    setPhoneAnimation(true);
    // Simulate page refresh or navigation
    setTimeout(() => {
      console.log('Page refreshed/navigated');
      setPhoneAnimation(false);
    }, 1000);
  };

  const handleLearnMore = () => {
    const currentService = servicesData[activeService];
    handleNavigation(currentService.route);
  };

  // Auto-rotate services for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % servicesData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentService = servicesData[activeService];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Background with Gradient */}
      <div 
        className="min-h-screen flex flex-col relative"
        style={{
          background: 'linear-gradient(135deg, #3d0b62 0%, #5a0994 30%, #7507c4 70%, #8b5cf6 100%)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-purple-300 opacity-20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full animate-ping"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 lg:p-8 z-10">
          <div className="text-yellow-400">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider">ASKOXY.AI</h1>
            <p className="text-xs sm:text-sm lg:text-base text-yellow-300 font-medium">AI-Z Marketplace</p>
          </div>
          <button className="flex items-center gap-2 bg-yellow-400 text-purple-900 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
            <span>Sign In</span>
            <span className="text-lg">👤</span>
          </button>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-16 py-4 sm:py-8 gap-6 sm:gap-8 lg:gap-16">
          
          {/* Left Side: Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-yellow-400 mb-4 sm:mb-6 leading-tight">
              SMART ANSWERS.
              <br />
              OPEN ACCESS.
            </h2>
            <div className="w-16 sm:w-24 lg:w-32 h-1 bg-yellow-400 mb-4 sm:mb-6 mx-auto lg:mx-0 rounded-full"></div>
            
            {/* Dynamic Content Based on Active Service */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-bold mb-2 sm:mb-3">
                {currentService.name}
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 leading-relaxed">
                {currentService.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                {currentService.features.map((feature, index) => (
                  <span key={index} className="bg-purple-700 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={handleLearnMore}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            >
              Click for More →
            </button>
          </div>

          {/* Right Side: Phone Image with Animation */}
          <div className="flex-1 flex justify-center items-center lg:justify-end">
            <div 
              className={`relative transition-all duration-500 transform cursor-pointer ${
                isPhoneHovered ? '-translate-y-4 scale-105' : ''
              } ${phoneAnimation ? 'animate-pulse scale-110' : ''}`}
              onMouseEnter={() => setIsPhoneHovered(true)}
              onMouseLeave={() => setIsPhoneHovered(false)}
              onClick={handlePhoneClick}
            >
              <div className="relative">
                <img
                  src={leftImage}
                  alt="ASKOXY.AI Super App"
                  className="w-48 sm:w-64 lg:w-80 xl:w-96 object-contain drop-shadow-2xl filter hover:brightness-110 transition-all duration-300"
                  draggable={false}
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-purple-600 opacity-20 rounded-3xl blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Services Section */}
        <div className="px-4 sm:px-6 lg:px-16 pb-6 sm:pb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-7xl mx-auto">
            
            {/* Services Grid - Horizontal Scrollable */}
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {gridImages.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => {
                      setActiveService(index);
                      handleNavigation(image.route);
                    }}
                    onMouseEnter={() => setActiveService(index)}
                    className={`flex-shrink-0 bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center text-center min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] ${
                      index === activeService 
                        ? 'ring-2 ring-purple-500 bg-purple-50 scale-105 shadow-lg transform' 
                        : 'hover:bg-gray-100'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveService(index);
                        handleNavigation(image.route);
                      }
                    }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center">
                      <img
                        src={image.src}
                        alt={servicesData[index]?.name || ''}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                        draggable={false}
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 leading-tight text-center px-1">
                      {servicesData[index]?.name.split(' ').slice(0, 2).join(' ') || ''}
                    </h3>
                  </div>
                ))}
              </div>
              
              {/* Scroll Indicators */}
              <div className="flex justify-center mt-4 gap-1">
                {Array.from({ length: Math.ceil(gridImages.length / 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}