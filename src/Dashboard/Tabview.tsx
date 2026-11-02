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
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png";
import customerApi from "../utils/axiosInstances";

// Standalone BMV Information Modal
const BMVInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
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
              BMVCOINS are digital reward tokens powered by{" "}
              <strong>OXYCHAIN</strong>, our private blockchain. They work like
              cashback points for your purchases.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  Current Value: <span className="text-purple-600 font-bold">₹0.02 per coin</span>
                </span>

                <span className="text-purple-700 font-bold">
                  1000 BMVCOINS = ₹20
                </span>
              </div>
            </div>

            <ul className="mt-3 space-y-1 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                Use on <strong>non-GST items</strong> like cash
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                Track your coin balance anytime from your{" "}
                <strong>AskOxy dashboard</strong>
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
                  <strong>Transfer or receive</strong> coins with friends and
                  family on AskOxy
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-500 mt-1">📊</span>
                <div>View transactions and coin status in your profile</div>
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
              <strong>Note:</strong> BMVCOINS are bonus rewards. Prices remain
              competitive even without them.
            </p>
            <p className="text-sm text-gray-600">
              Use wisely — earn, redeem, and grow with AskOxy!
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            Got it
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Standalone Transfer BMVCOINS Modal with Manual Validation (No Form Submit / No Data Clearing)
interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  senderMobile: string;
  onSuccess: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  senderMobile,
  onSuccess,
}) => {
  const [recipientMobile, setRecipientMobile] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    recipientMobile: "",
    amount: "",
  });

  // Only reset inputs when modal is closed, NEVER while it is open or when errors occur
  useEffect(() => {
    if (!isOpen) {
      setRecipientMobile("");
      setTransferAmount("");
      setMobileError("");
      setAmountError("");
      setGeneralError(null);
      setLoading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const balance = Number(availableBalance) || 0;
  const cleanSender = (senderMobile || localStorage.getItem("mobileNumber") || "")
    .replace(/\D/g, "")
    .slice(-10);

  // Manual Validation Helper for Mobile Number
  const validateMobileManual = (val: string): string => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      return "Recipient mobile number is required.";
    }
    // Block 0000000000 or all zeroes explicitly
    if (/^0+$/.test(clean) || clean === "0000000000") {
      return "Invalid mobile number. 0000000000 is not allowed.";
    }
    // Block any repeating 10 identical digits (e.g. 1111111111, 9999999999)
    if (/^(\d)\1{9}$/.test(clean)) {
      return `Invalid mobile number. Repeated digits (${clean}) are not allowed.`;
    }
    // Indian numbers must start with 6, 7, 8, or 9
    if (/^[0-5]/.test(clean)) {
      return `Mobile number must start with 6, 7, 8, or 9 (cannot start with ${clean[0]}).`;
    }
    // Must be exactly 10 digits
    if (clean.length < 10) {
      return `Please enter complete 10-digit mobile number (${clean.length}/10 digits entered).`;
    }
    if (!/^[6-9]\d{9}$/.test(clean)) {
      return "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }
    // Prevent self-transfer
    if (cleanSender && clean === cleanSender) {
      return "You cannot transfer BMVCOINS to your own mobile number.";
    }
    return "";
  };

  // Manual Validation Helper for Amount
  const validateAmountManual = (val: string): string => {
    if (!val || !val.trim()) {
      return "Transfer amount is required.";
    }
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      return "Please enter a valid amount of at least 1 BMVCOIN.";
    }
    if (balance <= 0) {
      return "You have 0 BMVCOINS available to transfer.";
    }
    if (num > balance) {
      return `Insufficient balance! You have ${balance} BMVCOINS, but entered ${num}.`;
    }
    return "";
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setRecipientMobile(val);
    setGeneralError(null);

    // Live validation feedback
    if (val.length > 0) {
      setMobileError(validateMobileManual(val));
    } else {
      setMobileError("");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setTransferAmount(val);
    setGeneralError(null);

    // Live validation feedback without wiping input
    if (val.length > 0) {
      setAmountError(validateAmountManual(val));
    } else {
      setAmountError("");
    }
  };

  // Pure Manual Validation on Transfer Click (No form submit, never clears input data)
  const handleManualTransfer = async () => {
    const mErr = validateMobileManual(recipientMobile);
    const aErr = validateAmountManual(transferAmount);

    setMobileError(mErr);
    setAmountError(aErr);

    if (mErr || aErr) {
      setGeneralError(mErr || aErr);
      return; // Do NOT clear recipientMobile or transferAmount! Keep user inputs intact!
    }

    try {
      setLoading(true);
      setGeneralError(null);

      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
      const sender = senderMobile || localStorage.getItem("mobileNumber") || "";
      const cleanRecipient = recipientMobile.replace(/\D/g, "");

      await customerApi.post(
        `${BASE_URL}/user-service/assetTransfer`,
        {
          from_mobile: sender,
          to_mobile: cleanRecipient,
          amount: transferAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransferDetails({
        recipientMobile: cleanRecipient,
        amount: transferAmount,
      });

      setLoading(false);
      setSuccess(true);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      // Keep input data completely intact on error
      const rawMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Transfer failed. Please check recipient mobile number and try again.";
      setGeneralError(rawMsg);
    }
  };

  const handleCloseModal = () => {
    setRecipientMobile("");
    setTransferAmount("");
    setMobileError("");
    setAmountError("");
    setGeneralError(null);
    setLoading(false);
    setSuccess(false);
    onClose();
  };

  const cleanRecipient = recipientMobile.replace(/\D/g, "");
  const numAmount = Number(transferAmount);
  const isMobileValid = cleanRecipient.length === 10 && !mobileError;
  const isAmountValid = transferAmount !== "" && !isNaN(numAmount) && numAmount > 0 && numAmount <= balance && !amountError;
  const remainingBalance = balance - (isAmountValid ? numAmount : 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-2xl w-full max-w-md mx-auto relative border border-slate-100">
        <button
          type="button"
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
            <SendHorizonal className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Transfer BMVCOINS
            </h2>
            <p className="text-xs text-gray-500">
              Send coins instantly to any registered mobile number
            </p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Transfer Successful!
            </h3>
            <div className="mt-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-2xl font-black text-purple-700">
                {transferDetails.amount}{" "}
                <span className="text-sm font-semibold text-purple-600">
                  BMVCOINS
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                transferred to{" "}
                <strong className="text-gray-900">
                  +91 {transferDetails.recipientMobile}
                </strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseModal}
              className="mt-6 w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition shadow-md shadow-purple-200 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recipient Mobile Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="to_mobile"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Recipient Mobile Number <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-semibold text-gray-400">
                  {cleanRecipient.length}/10
                </span>
              </div>
              <div
                className={`flex items-center rounded-xl border bg-white transition-all shadow-sm overflow-hidden ${
                  mobileError
                    ? "border-red-500 ring-2 ring-red-100"
                    : isMobileValid
                    ? "border-green-500 ring-2 ring-green-100"
                    : "border-gray-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100"
                }`}
              >
                <span className="px-3.5 py-3 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50 border-r border-gray-200 select-none flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  id="to_mobile"
                  name="to_mobile"
                 
                  value={recipientMobile}
                  onChange={handleMobileChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleManualTransfer();
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                {isMobileValid && (
                  <div className="pr-3 text-green-600" title="Valid mobile number">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </div>
                )}
              </div>
              {mobileError && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{mobileError}</span>
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="amount"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Transfer Amount <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Available: {balance} Coins
                </span>
              </div>
              <div
                className={`flex items-center rounded-xl border bg-white transition-all shadow-sm overflow-hidden ${
                  amountError
                    ? "border-red-500 ring-2 ring-red-100"
                    : isAmountValid
                    ? "border-green-500 ring-2 ring-green-100"
                    : "border-gray-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100"
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  id="amount"
                  name="amount"
                  value={transferAmount}
                  onChange={handleAmountChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleManualTransfer();
                    }
                  }}
                  placeholder="Enter coin amount"
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <span className="px-3.5 py-2.5 text-xs font-bold text-gray-500 select-none">
                  BMV
                </span>
              </div>

              {/* Remaining Balance Preview or Error */}
              {isAmountValid ? (
                <p className="mt-1.5 text-xs text-gray-500 flex items-center justify-between">
                  <span>Balance after transfer:</span>
                  <strong className="text-gray-800 font-bold">{remainingBalance} Coins</strong>
                </p>
              ) : numAmount > balance ? (
                <div className="mt-1.5 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    Insufficient balance: You have <strong>{balance}</strong> BMVCOINS, but entered <strong>{numAmount}</strong>.
                  </span>
                </div>
              ) : null}

              {amountError && numAmount <= balance && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{amountError}</span>
                </p>
              )}
            </div>

            {/* Status General Error Banner */}
            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start gap-2 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="font-semibold flex-1">{generalError}</p>
              </div>
            )}

            {/* Transfer Action Button (Manual Trigger, Always Clickable to show errors, No HTML Form Submit) */}
            <button
              type="button"
              onClick={handleManualTransfer}
              disabled={loading || balance <= 0}
              className={`mt-4 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loading || balance <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:opacity-95 shadow-purple-200 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <span>Transfer BMVCOINS →</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
      const response = await customerApi.get(
        `${BASE_URL}/user-service/getProfile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMultichainId(response.data.multiChainId || "");
      setBmvCoin(Number(response.data.coinAllocated) || 0);
      setUserMobileNumber(response.data.mobileNumber || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const pathTab = pathSegments[2]; // Extracts "dashboard"

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
      <BMVInfoModal
        isOpen={showBmvModal}
        onClose={() => setShowBmvModal(false)}
      />
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        availableBalance={Number(bmvCoin) || 0}
        senderMobile={userMobileNumber || localStorage.getItem("mobileNumber") || ""}
        onSuccess={() => {
          fetchUserData();
        }}
      />
    </div>
  );
};

export default Tabview;
