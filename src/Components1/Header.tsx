import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogOut, User, Ticket, Car } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthorInfo from "../components/AuthorInfo";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import Fr from '../assets/img/logo.png'

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

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
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
    <header className={`bg-white w-full text-black shadow-md p-2`}>
      <div className="mx-auto flex justify-between items-center">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleSidebar} // Ensure this calls the toggleSidebar function
          className="lg:hidden p-2 text-black rounded-lg hover:bg-gray-100 transition-all duration-200"
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
        {/* Profile Dropdown */}
        <div className="relative lg:block">
          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 transition-all duration-150"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            aria-label="Open profile menu"
          >
            {/* Profile Image */}
            <img
              className="rounded-full w-8 border border-gray-200"
              src="https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_5-512.png"
              alt="Profile"
            />
            {/* First Name */}
            <h3 className="text-[#351664] hidden lg:block font-bold">
              {profileData?.firstName || "Profile"}
            </h3>
            {/* Dropdown Icon */}
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 z-50"
              role="menu"
            >
              {/* Close on Outside Click */}
              <div
                onClick={() => setIsProfileOpen(false)}
                className="fixed inset-0 z-40"
              ></div>

              {/* Menu Items */}
              <div className="relative z-50">
                {/* Ticket History */}
                <a
                  href="/dashboard/ticket-history"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 rounded-t-lg transition-all duration-150"
                  role="menuitem"
                >
                  <Ticket className="mr-3 text-gray-600" size={22} />
                  <span className="font-bold text-[#351664]">
                    Ticket History
                  </span>
                </a>

                {/* Profile Updated */}
                <a
                  href="/dashboard/user-profile"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition-all duration-150"
                  role="menuitem"
                >
                  <FaUserEdit className="mr-3 text-gray-600" size={24} />
                  <span className="font-bold text-[#351664]">
                    Profile Updated
                  </span>
                </a>

                {/* Logout */}
                <button
                  onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("email");
                    navigate("/");
                  }}
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-100 rounded-b-lg transition-all duration-150"
                  role="menuitem"
                >
                  <LogOut className="mr-3 text-gray-600" size={24} />
                  <span className="font-bold text-[#351664]">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
