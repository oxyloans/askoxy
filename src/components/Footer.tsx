import React from 'react';
import Logo from '../assets/img/logo3.png';

const Footer: React.FC = () => {
  return (
    <footer className="p-8 bg-white text-white shadow text-center">
      {/* Grid Layout for Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        {/* Information Section */}
        <div className="flex flex-col items-center ">
          <img src={Logo} className='mb-4' style={{ width: '155px', height: '26px' }} alt="Logo" />
          <p className="text-sm leading-relaxed text-black">
            <span className='text-yellow-500 font-bold'>Disclaimer:</span> AskOxy.AI delivers boundless freedom with unlimited ChatGPT prompts, enabling learners, researchers, and businesses to innovate without cost constraints.
          </p>
        </div>

        {/* Information Section */}
        {/* <div className="flex flex-col">
          <h5 className="font-semibold mb-2 text-black">Information</h5>
          <div className="flex flex-col space-y-1 text-gray-400">
            <a href="#" className="hover:no-underline">Shop Pay</a>
            <a href="#" className="hover:no-underline">Help Center</a>
            <a href="#" className="hover:no-underline">For Brands</a>
          </div>
        </div> */}

        {/* Social Section */}
        {/* <div className="flex flex-col">
          <h5 className="font-semibold mb-2 text-black">Social</h5>
          <div className="flex flex-col space-y-1 text-gray-400">
            <a href="#" className="hover:no-underline">Twitter</a>
            <a href="#" className="hover:no-underline">Instagram</a>
          </div>
        </div> */}

        {/* Legal Section */}
        {/* <div className="flex flex-col">
          <h5 className="font-semibold mb-2 text-black">Legal</h5>
          <div className="flex flex-col space-y-1 text-gray-400">
            <a href="#" className="hover:no-underline">Terms of Service</a>
            <a href="#" className="hover:no-underline">Privacy Policy</a>
            <a href="#" className="hover:no-underline">Do Not Sell or Share My Personal Information</a>
          </div>
        </div> */}
      </div>

      {/* Copyright */}
      <p className="text-md text-black">
        &copy; 2024 <span className='text-purple-400 font-bold'>ASKOXY.AI</span> All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
