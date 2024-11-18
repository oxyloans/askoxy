import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
interface AuthorInfoProps {
  name: string;
  location: string;
  email: string;
  icon?: React.ReactNode;  // Optional prop for avatar image URL
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ name, location, email, icon }) => {
  const [showInfo, setShowInfo] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  // Effect to handle clicks outside the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowInfo(false); // Close popover if clicked outside
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  return (
    <div className="relative inline-block mr-1">
      {/* Author's Name Initial or Icon */}
      <span
        className="flex items-center justify-center text-blue-500 cursor-pointer font-semibold h-11 w-11 bg-white rounded-full border border-gray-300 shadow-md"
        onClick={toggleInfo}
      >
        {name.charAt(0)} {/* Dynamically set this to the first letter of the author's name */}
      </span>

      {/* Popover for Author Info */}
      {showInfo && (
        <div 
          ref={popoverRef} // Attach ref here
          className="absolute z-10 mt-2 w-64 max-w-xs bg-white border border-gray-300 shadow-lg rounded-lg p-4 transform translate-y-2 right-1"
        >
          <div className="flex items-center space-x-4">
            {/* Author's Avatar */}
            {icon ? (
             <FaUserCircle />

            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            )}

            {/* Author's Info */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-bold text-gray-800">
                UserId: {localStorage.getItem("userId")?.slice(-5)}
              </h4>
             {name && <><p className="text-md text-gray-600"> {name}</p></>} 
                {name && <><p className="text-md text-gray-600">Location: {location}</p></>}
                {name && <><p className="text-md text-gray-600">{email}</p></>}
             <Link to="/Examplecomponet"><button
  className="bg-blue-500 text-white py-1 px-2 rounded-full text-xs"
  style={{ width: '4rem' }}
>
  Edit
</button></Link> 

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
