import React from 'react';

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

// Left side big image
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

export default function UnicornGrid() {
  const handleNavigation = (route: string) => {
    console.log(`Navigating to: ${route}`);
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Background with Gradient */}
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(180deg, #3d0b62 0%, #5a0994 50%, #7507c4 100%)'
        }}
      >
        {/* Decorative floating elements - only golden circles and basic shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          
          {/* Purple and gold line decorations - positioned like in image */}
          <img
            src={purpleLines}
            alt=""
            className="absolute top-56 left-24 w-20 h-20 opacity-40"
          />
          <img
            src={goldLines}
            alt=""
            className="absolute bottom-56 right-32 w-24 h-24 opacity-50"
          />
        </div>

        {/* Main Content Container */}
        <div className="relative max-w-none w-full flex items-center justify-between px-16 py-8">
          
          {/* Left Side: Phone/App mockup */}
          <div className="flex-1 flex justify-center items-center pr-8">
            <div className="relative max-w-lg">
              <img
                src={leftImage}
                alt="ASKOXY.AI Super App"
                className="w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side: Services Grid */}
          <div className="flex-1 flex justify-center items-center pl-8">
            <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-lg">
              
              {/* Grid container - 3x3 layout exactly like image */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {gridImages.map(({ id, src, route }) => (
                  <div
                    key={id}
                    onClick={() => handleNavigation(route)}
                    className="aspect-square bg-gray-100 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 flex items-center justify-center"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNavigation(route);
                      }
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom action buttons exactly like in image */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-3 rounded-2xl font-medium flex items-center gap-3 hover:shadow-lg transition-all duration-200 text-sm">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 text-base">🛒</span>
                  </div>
                  <span className="text-left leading-tight">Buy products or services directly as a consumer.</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-2xl font-medium flex items-center gap-3 hover:shadow-lg transition-all duration-200 text-sm">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base">🤝</span>
                  </div>
                  <span className="text-left leading-tight">Partner with us to grow your business today.</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}