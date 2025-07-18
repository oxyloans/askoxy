import { Dashboard } from "@mui/icons-material";
import axios from "axios";
import {
 Users,
  Check,
  Coins,
  Copy,
  HelpCircle,
  ShoppingCart,
 TrendingUp,
  SendHorizonal,
 ArrowRight,
  X,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png"; // Make sure to import the BMVICON


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
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => setShowBmvModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="text-purple-600" size={28} />
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
                Welcome to BMVCOINS
              </h2>
            </div>
          </div>

          {/* What are BMVCoins */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              What are BMVCOINS?
            </h3>
            <p className="text-gray-700 mb-3">
              BMVCOINS are digital reward tokens powered by <strong>OXYCHAIN</strong>, our private blockchain.
              They work like cashback points for your purchases.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Value:</span>
                <span className="text-purple-700 font-bold">1000 BMVCOINS = ₹20</span>
              </div>
              <div className="text-sm text-gray-600">₹0.02 per coin</div>
            </div>
            <ul className="mt-3 space-y-1 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                Use on <strong>non-GST items</strong> like cash
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                Track your coin balance anytime from your <strong>AskOxy dashboard</strong>
              </li>
            </ul>
          </div>

          {/* How to Use */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💸</span>
              How to Use BMVCOINS?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 mt-1">✅</span>
                <div>
                  <strong>Redeem when you reach ₹200 (10,000 coins)</strong>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="text-blue-500 mt-1" size={16} />
                <div>
                  <strong>Transfer or receive</strong> coins with friends and family on AskOxy
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-500 mt-1">📊</span>
                <div>
                  View transactions and coin status in your profile
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="text-orange-500" size={20} />
              What's Next?
            </h3>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                We're working to list BMVCOINS on exchanges soon.
              </p>
              <p className="text-gray-700 mb-2">
                Once listed, today's ₹0.02 coin could grow into ₹1+.
              </p>
              <p className="text-sm text-gray-600 italic">
                (Projected value – no guarantee. Loyalty matters!)
              </p>
            </div>
          </div>

          {/* Keep Shopping */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingCart className="text-green-500" size={20} />
              Keep Shopping. Keep Earning.
            </h3>
            <p className="text-gray-700 mb-2">
              Use BMVCOINS to save every day.
            </p>
            <p className="text-sm text-gray-600">
              Powered by <strong>OXYCHAIN</strong>. Backed by your trust.
            </p>
          </div>

          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Note:</strong> BMVCOINS are bonus rewards. Prices remain competitive even without them.
            </p>
            <p className="text-sm text-gray-600">
              Use wisely — earn, redeem, and grow with AskOxy!
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowBmvModal(false)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Got it
            <ArrowRight size={16} />
          </button>
        </div>
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
            Transfer BMVCOINS
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
              {transferDetails.amount} BMVCOINS transferred to{" "}
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
                "Transfer BMVCOINS"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`top-0 w-full z-10 bg-white px-4 py-2 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-2xl overflow-x-auto flex items-center">
          {/* Optional: Tab buttons go here if needed */}
        </div>
      </div>

      {isVisible && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4 w-full">
          {/* Blockchain ID Section */}
   
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-lg w-full sm:w-auto text-center">
            {/* Blockchain ID Text */}
            <button
              className="text-sm font-medium text-purple-600 break-words text-center"
              onClick={() => window.open("http://bmv.money:2750/")}
            >
              Blockchain ID: {multichainId}
            </button>

            {/* Copy Button with Text */}
            <button
              onClick={handleCopyMultichainId}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded transition-colors text-sm"
              aria-label="Copy multichain ID"
            >
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{isCopied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* BMV Coins Section */}
          <div className="bg-white p-3 rounded-lg shadow-lg w-full sm:w-auto flex flex-col items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 w-full">
              <div
                className="flex items-center cursor-pointer justify-center"
                onClick={() => setShowBmvModal(true)}
              >
                <img
                  src={BMVICON}
                  alt="BMV Coin"
                  className="h-6 sm:h-8 mr-2 hover:opacity-80 transition-opacity"
                />
                <span className="text-sm sm:text-base font-bold text-purple-600">
                  {bmvCoin}
                </span>
                <HelpCircle size={16} className="text-purple-600 ml-1" />
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                className="p-2 bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex items-center text-xs sm:text-sm justify-center"
                aria-label="Transfer BMV Coins"
              >
                <SendHorizonal className="w-4 h-4 mr-1" />
                <span>Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showBmvModal && <BMVInfoModal />}
      {showTransferModal && <TransferModal />}
    </div>
  );
};

export default Tabview;
