import React from 'react';

const Header: React.FC = () => {
  return (
    <div
      className="absolute top-0 left-0 h-full mt-10"
      style={{
        width: 'calc(100% - 50%)',
        height: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px', // Adding padding for better spacing
      }}
    >
      {/* Button "AskOxy.AI" */}
      <button
        className="px-6 py-2 text-white rounded-full"
        style={{
          borderRadius: '50px',
          backgroundColor: '#351664',
          border: 'none',
        }}
      >
        ASKOXY.AI
      </button>

      <div className="flex items-center">
        <button className="mr-4">SignIn</button>
        <button>SignUp</button>
      </div>

     
    </div>
  );
};

export default Header;
