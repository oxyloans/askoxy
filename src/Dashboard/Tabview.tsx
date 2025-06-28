import { Dashboard } from "@mui/icons-material";
import axios from "axios";
import {
  Bot,
  Check,
  Coins,
  Copy,
  HelpCircle,
  Info,
  Settings,
  SendHorizonal,
  ShoppingBag,
  X,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardMain from "./Dashboardmain";
import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png"; // Make sure to import the BMVICON

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

const Tabview = () => {
  const [multichainId, setMultichainId] = useState("");
  const [bmvCoin, setBmvCoin] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showBmvModal, setShowBmvModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState("");

  // Refs for uncontrolled inputs
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const [transferStatus, setTransferStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null,
  });

  // Add state to store transfer details for the success message
  const [transferDetails, setTransferDetails] = useState({
    recipientMobile: "",
    amount: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Fetch multichain ID and BMV coin
    fetchUserData();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pathTab = location.pathname.split("/").pop();

    if (pathTab) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/main/dashboard/${tab}`);
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/user-service/getProfile/${userId}`
      );
      setMultichainId(response.data.multiChainId);
      setBmvCoin(response.data.coinAllocated);
      setUserMobileNumber(response.data.mobileNumber || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const pathTab = pathSegments[2]; // Extracts "dashboard"

    console.log(pathTab);

    if (pathTab === "dashboard") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname]);

  const handleCopyMultichainId = async () => {
    if (multichainId) {
      try {
        await navigator.clipboard.writeText(multichainId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get values from refs
    const recipientMobile = mobileInputRef.current?.value || "";
    const transferAmount = amountInputRef.current?.value || "";

    // Validate form
    if (!recipientMobile || !transferAmount) {
      setTransferStatus({
        loading: false,
        success: false,
        error: "Please fill in all fields",
      });
      return;
    }

    // Validate mobile number
    if (recipientMobile.length !== 10 || !/^\d{10}$/.test(recipientMobile)) {
      setTransferStatus({
        loading: false,
        success: false,
        error: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    // Validate amount
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || amount > bmvCoin) {
      setTransferStatus({
        loading: false,
        success: false,
        error: `Please enter a valid amount between 1 and ${bmvCoin}`,
      });
      return;
    }

    try {
      setTransferStatus({ loading: true, success: false, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/user-service/assetTransfer`,
        {
          from_mobile: userMobileNumber,
          to_mobile: recipientMobile,
          amount: transferAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Save the transfer details for the success message
      setTransferDetails({
        recipientMobile: recipientMobile,
        amount: transferAmount,
      });

      // Handle successful transfer
      setTransferStatus({ loading: false, success: true, error: null });

      // Refresh coin balance
      fetchUserData();

      // Reset form and close modal after delay
      setTimeout(() => {
        if (mobileInputRef.current) mobileInputRef.current.value = "";
        if (amountInputRef.current) amountInputRef.current.value = "";
        setShowTransferModal(false);
        setTransferStatus({ loading: false, success: false, error: null });
      }, 2000);
    } catch (error: any) {
      setTransferStatus({
        loading: false,
        success: false,
        error:
          error.response?.data?.message || "Transfer failed. Please try again.",
      });
    }
  };

  const TabButton: React.FC<{
    tab: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
  }> = ({ tab, icon, label, count }) => (
    <button
      onClick={() => handleTabClick(tab)}
      className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 relative
          ${
            activeTab === tab
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "hover:bg-gray-100 text-gray-600"
          }
        `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const BMVInfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={() => setShowBmvModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-purple-700">
            How to use BMVCoins?
          </h2>
        </div>

        <div className="text-gray-700 space-y-3">
          <p>
            You can collect BMVCoins and use them to get discounts on rice bags,
            as well as other products and services.
          </p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="font-medium">Current value:</p>
            <p>1,000 BMVCoins = ₹10 discount</p>
          </div>
          <p className="font-medium">Important information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>A minimum of 20,000 BMVCoins is required for redemption.</li>
            <li>The discount value may change in the future.</li>
          </ul>
        </div>

        <button
          onClick={() => setShowBmvModal(false)}
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );

  const TransferModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={() => {
            setShowTransferModal(false);
            setTransferStatus({ loading: false, success: false, error: null });
            if (mobileInputRef.current) mobileInputRef.current.value = "";
            if (amountInputRef.current) amountInputRef.current.value = "";
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center mb-6">
          <div className="p-2 rounded-full bg-purple-100 mr-3">
            <SendHorizonal className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-purple-700">
            Transfer BMVCoins
          </h2>
        </div>

        {transferStatus.success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              Transfer Successful!
            </p>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              {transferDetails.amount} BMVCoins transferred to{" "}
              {transferDetails.recipientMobile}
            </p>
            <button
              onClick={() => {
                setShowTransferModal(false);
                setTransferStatus({
                  loading: false,
                  success: false,
                  error: null,
                });
                if (mobileInputRef.current) mobileInputRef.current.value = "";
                if (amountInputRef.current) amountInputRef.current.value = "";
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleTransferSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="to_mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Mobile Number
              </label>
              <input
                type="text"
                id="to_mobile"
                name="to_mobile"
                ref={mobileInputRef}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={10}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <span className="text-sm text-gray-500">
                  Available: {bmvCoin}
                </span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                ref={amountInputRef}
                placeholder="Enter amount to transfer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {transferStatus.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{transferStatus.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={transferStatus.loading}
              className={`mt-4 w-full py-3 px-4 rounded-lg font-medium text-white
                ${
                  transferStatus.loading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 transition-colors"
                }`}
            >
              {transferStatus.loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Transfer BMVCoins"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`
   top-0 w-100% z-10 bg-white px-4 py-2 
   transition-shadow duration-300
   ${isScrolled ? "shadow-md" : ""}
  `}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-2xl overflow-x-auto items-center">
          {/* <div className="grid grid-cols-2 pt-4 md:grid-cols-4 gap-2 md:gap-4 justify-center ">
            <TabButton
              tab="products"
              icon={<ShoppingBag size={20} />}
              label="Products"
            />
            <TabButton
              tab="services"
              icon={<Settings size={20} />}
              label="Services"
            />
            <TabButton
              tab="freegpts"
              icon={<Bot size={20} />}
              label="Free GPTs"
            />
            <TabButton
              tab="bmvcoin"
              icon={<Coins size={20} />}
              label="Cryptocurrency"
            />
          </div> */}
        </div>
      </div>

      {isVisible && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Blockchain ID Section */}
          <div className="flex items-center overflow-hidden gap-2 bg-white p-3 rounded-lg shadow-lg w-full md:w-auto mt-4">
            <button
              className="text-sm font-medium text-purple-600"
              onClick={() => window.open("http://bmv.money:2750/")}
            >
              Blockchain ID: {multichainId}
            </button>

            <button
              onClick={handleCopyMultichainId}
              className="p-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded transition-colors"
              aria-label="Copy multichain ID"
            >
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* BMV Coins Section - Updated with clickable image and transfer button */}
          <div className="bg-white p-3 rounded-lg shadow-lg w-full md:w-auto">
            <div className="flex items-center justify-end">
              <div
                className="flex items-center cursor-pointer mr-4"
                onClick={() => setShowBmvModal(true)}
              >
                <img
                  src={BMVICON}
                  alt="BMV Coin"
                  className="h-8 mr-2 hover:opacity-80 transition-opacity"
                />
                <span className="text-m font-bold text-purple-600 mr-1">
                  {bmvCoin}
                </span>
                <HelpCircle size={18} className="text-purple-600 ml-1" />
              </div>

              {/* New Transfer Button */}
              <button
                onClick={() => setShowTransferModal(true)}
                className="p-2 bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex items-center"
                aria-label="Transfer BMV Coins"
              >
                <SendHorizonal className="w-4 h-4 mr-1" />
                <span className="text-xs">Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BMV Info Modal */}
      {showBmvModal && <BMVInfoModal />}

      {/* Transfer Modal */}
      {showTransferModal && <TransferModal />}
    </div>
  );
};

export default Tabview;
