import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Header: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle the click event
  const handleSignInClick = () => {
    navigate('/login'); // Redirect to the login page
  };

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
        padding: '0 20px',
      }}
    >
      {/* Button "AskOxy.AI" */}
      <button
        className="px-6 py-2 text-black rounded-full font-bold"
        style={{
          borderRadius: '50px',
          backgroundColor: '#f9cc15',
          border: 'none',
        }}
      >
        ASKOXY.AI
      </button>

      <div className="flex items-center " style={{width:'auto',height:'auto',backgroundColor:'white',padding:7,paddingInline:20, borderRadius:50,color:'black',textAlign:'center',fontWeight:'bold'}}>
        {/* SignIn button with redirection functionality */}
        <button className="" onClick={handleSignInClick}>SignIn</button>
      </div>
    </div>
  );
};

export default Header;
