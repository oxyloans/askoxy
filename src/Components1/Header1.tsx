import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogOut, User, Ticket, Car } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthorInfo from "../components/AuthorInfo";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import Fr from "../assets/img/logo.png";

interface HeaderProps {
  toggleSidebar: () => void;
}
interface ProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dob: string | null;
  address: string | null;
  city: string | null;
  pinCode: string | null;
  consent: string | null;
  message: string | null;
  organization: string | null;
  designation: string | null;
  educationDetailsModelList: null;
  state: string | null;
  country: string | null;
  nationality: string | null;
  emailVerified: boolean;
  panVerified: boolean | null;
  whatsappVerified: boolean | null;
  name: string | null;
  multiChainId: string | null;
  coinAllocated: number | null;
}

const Header1: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data); // Set the profile data to state
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("mobileNumber", response.data.mobileNumber);
      })
      .catch((error) => {
        console.error("There was an error making the request:", error);
      });
  }, []);
  //[#351664]
  return (
    <header className={`bg-white w-full text-black shadow-md p-3`}>
      <div className="mx-auto flex justify-between items-center">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleSidebar} // Ensure this calls the toggleSidebar function
          className="lg:hidden p-2 text-black rounded"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-[#351664] font-bold" />
        </button>

        {/* Sidebar Component */}

        {/* Logo Section */}
        <button
          className="flex items-center text-2xl font-bold bg-transparent border-none cursor-pointer focus:outline-none"
          aria-label="Go to home"
        >
          {/* <span className="text-white">ASKOXY</span>
          <span className="text-[#ffa800]">.AI</span> */}
          <img src={Fr} alt="logo" className="w-28 pl-4 h-17" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative lg:block">
          <button
            onClick={() => {
             
              navigate("/whatsapplogin");
            }}
            className="flex items-center w-full px-4 py-3 hover:bg-gray-100 rounded-b-lg transition-all duration-150"
            role="menuitem"
          >
            <LogOut className="mr-3 text-gray-600" size={24} />
            <span className="font-bold text-[#351664]">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header1;
