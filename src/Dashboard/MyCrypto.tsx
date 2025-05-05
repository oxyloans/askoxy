import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Coins,
  Copy,
  Info,
  SendHorizonal,
  ExternalLink,
  Check,
  X,
  TrendingUp,
  Shield,
  DollarSign,
  History,
} from "lucide-react";
import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png";
import BMVCoinImage from "../assets/img/bmvcoin.png";

interface Transfer {
  txMobileNumber: string;
  rxMobileNumber: string;
  txChainAddress: string;
  rxChainAddress: string;
  amountTransfer: number;
}

const MyCrypto: React.FC = () => {
  const [multichainId, setMultichainId] = useState("");
  const [bmvCoin, setBmvCoin] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [showBmvModal, setShowBmvModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransfersModal, setShowTransfersModal] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [transfersError, setTransfersError] = useState<string | null>(null);

  // Refs for uncontrolled inputs
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const [transferStatus, setTransferStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null,
  });

  // Transfer details for the success message
  const [transferDetails, setTransferDetails] = useState({
    recipientMobile: "",
    amount: "",
  });

  useEffect(() => {
    fetchUserData(); // Fetch user profile on mount
  }, []);
  
 useEffect(() => {
  if (userMobileNumber) {
    fetchTransfers(userMobileNumber);
  }
}, [userMobileNumber]);

  

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
      const response = await axios.get(`${BASE_URL}/user-service/getProfile/${userId}`);
      setMultichainId(response.data.multiChainId);
      setBmvCoin(response.data.coinAllocated);
      const mobile = response.data.mobileNumber || "";
      setUserMobileNumber(mobile);
  
      // Call fetchTransfers once we have the mobile number
      if (mobile) {
        await fetchTransfers(mobile);
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setTransfersError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchTransfers = async (mobileNumber: string) => {
    try {
      setTransfersLoading(true);
      setTransfersError(null);
  
      if (!userMobileNumber) {
        throw new Error("User mobile number not available");
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      // API call using txMobileNumber
      const response = await axios.get(
        `${BASE_URL}/user-service/by-txMobileNumber`,
        {
          params: { txMobileNumber: userMobileNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }
  
      // Filter data into sent and received
      const sentTransfers = data.filter(
        (tx: any) => tx.txMobileNumber === userMobileNumber
      );
      const receivedTransfers = data.filter(
        (tx: any) => tx.rxMobileNumber === userMobileNumber
      );
  
      // Combine or use separately depending on your UI logic
      const allTransfers = [...sentTransfers, ...receivedTransfers];
  
      setTransfers(allTransfers);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transfer history. Please try again.";
      setTransfersError(errorMessage);
      console.error("Error fetching transfers:", error);
    } finally {
      setTransfersLoading(false);
    }
  };
  
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

        <div className="flex items-center gap-3 mb-6">
          <img src={BMVICON} alt="BMV Coin" className="h-10" />
        </div>

        <div className="text-gray-700 space-y-5">
          <p className="text-lg">
            BMVCoins are our platform's native cryptocurrency that can be used for discounts on products and services.
          </p>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-purple-800 mb-2">Current value:</p>
            <p className="text-purple-700 text-lg">1,000 BMVCoins = ₹10 discount</p>
          </div>
          
          <div>
            <p className="font-medium mb-2 text-lg">Future potential value:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-blue-800">Minimum</p>
                <p className="text-lg font-bold text-blue-700">₹10,000</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-green-800">Great Value</p>
                <p className="text-lg font-bold text-green-700">$10,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-3 text-lg">Important information:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">•</span>
                <span>A minimum of 20,000 BMVCoins is required for redemption.</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">•</span>
                <span>When we reach 1 million users, BMVCoins will launch on public tradeable blockchains.</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">•</span>
                <span>Expected opening value: minimum of $0.10 USD per coin.</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowBmvModal(false)}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
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
          <div className="p-3 rounded-full bg-purple-100 mr-3">
            <SendHorizonal className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-purple-700">
            Transfer BMVCoins
          </h2>
        </div>

        {transferStatus.success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-xl font-medium text-gray-900">
              Transfer Successful!
            </p>
            <p className="text-lg text-gray-600 mt-3 mb-6">
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
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleTransferSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="to_mobile"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Recipient Mobile Number
              </label>
              <input
                type="text"
                id="to_mobile"
                name="to_mobile"
                ref={mobileInputRef}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                maxLength={10}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="amount"
                  className="block text-lg font-medium text-gray-700"
                >
                  Amount
                </label>
                <span className="text-lg text-gray-500">
                  Available: {bmvCoin}
                </span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                ref={amountInputRef}
                placeholder="Enter amount to transfer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                required
              />
            </div>

            {transferStatus.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{transferStatus.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={transferStatus.loading}
              className={`mt-4 w-full py-4 px-4 rounded-lg font-medium text-white text-lg
                ${
                  transferStatus.loading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 transition-colors"
                }`}
            >
              {transferStatus.loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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

  const TransfersModal = () => {
    useEffect(() => {
      if (showTransfersModal && userMobileNumber) {
        fetchTransfers(userMobileNumber);
      } else if (showTransfersModal && !userMobileNumber) {
        setTransfersError("User mobile number not available");
        setTransfersLoading(false);
      }
    }, [showTransfersModal, userMobileNumber]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg mx-4 relative">
          <button
            onClick={() => setShowTransfersModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-purple-100 mr-3">
              <History className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-700">
              Transfer History
            </h2>
          </div>

          {transfersLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : transfersError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{transfersError}</p>
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg text-gray-600">No transfers found.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transfers.map((transfer, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {transfer.txMobileNumber === userMobileNumber
                          ? "Sent to"
                          : "Received from"}
                      </p>
                      <p className="font-medium text-gray-800">
                        {transfer.txMobileNumber === userMobileNumber
                          ? transfer.rxMobileNumber
                          : transfer.txMobileNumber}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${
                        transfer.txMobileNumber === userMobileNumber
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transfer.txMobileNumber === userMobileNumber ? "-" : "+"}
                      {transfer.amountTransfer} BMVCoins
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      From Address: {transfer.txChainAddress.slice(0, 6)}...
                      {transfer.txChainAddress.slice(-4)}
                    </p>
                    <p>
                      To Address: {transfer.rxChainAddress.slice(0, 6)}...
                      {transfer.rxChainAddress.slice(-4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div>
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center">
                  <Coins className="mr-3" size={28} />
                  My BMVCoins
                </h1>
                <div className="flex items-center space-x-4">
                  {/* <button
                    onClick={() => setShowTransfersModal(true)}
                    className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center"
                  >
                    <History size={16} className="mr-2" />
                    My Transfers
                  </button> */}
                  <button
                    onClick={() => setShowBmvModal(true)}
                    className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center"
                  >
                    <Info size={16} className="mr-2" />
                    About BMVCoins
                  </button>
                </div>
              </div>
            </div>
            
            {/* Balance Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <img
                  src={BMVICON}
                  alt="BMV Coin"
                  className="h-10 w-34 mr-4"
                />
                <div>
                  <p className="text-gray-500 font-medium">Current Balance</p>
                  <h2 className="text-4xl font-bold text-purple-700">{bmvCoin}</h2>
                </div>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="ml-auto px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <SendHorizonal size={18} className="mr-2" />
                  Transfer 
                </button>
              </div>
            </div>
            
            {/* Blockchain ID Section */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                <Shield className="mr-2" size={20} />
                Your Blockchain ID
              </h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium overflow-hidden text-ellipsis text-sm">{multichainId}</p>
                <button
                  onClick={handleCopyMultichainId}
                  className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors ml-2 flex-shrink-0"
                  aria-label="Copy blockchain ID"
                >
                  {isCopied ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => window.open("http://bmv.money:2750/")}
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors flex items-center text-sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  View on OxyChain Explorer
                </button>
              </div>
            </div>
            
            {/* Value & Benefits */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <TrendingUp className="mr-2" size={20} />
                BMVCoin Value & Benefits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign size={18} className="text-blue-600 mr-2" />
                    <p className="font-medium text-blue-800 mt-4">Current Value</p>
                  </div>
                  <p className="text-blue-700">1,000 BMVCoins = ₹10 discount on our platform</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp size={18} className="text-green-600 mr-2" />
                    <p className="font-medium text-green-800 mt-4">Future Potential</p>
                  </div>
                  <p className="text-green-700">Expected value up to $10,000 (₹8,00,000+)</p>
                </div>
              </div>
              
              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <p className="font-bold text-purple-800 mb-2">How to use your BMVCoins:</p>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">•</span>
                    <span>Get discounts on products and services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">•</span>
                    <span>Hold for future value growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">•</span>
                    <span>Transfer to other users</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => setShowBmvModal(true)}
                className="mt-6 w-full p-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-colors flex items-center justify-center"
              >
                <Info size={18} className="mr-2" />
                Learn More About BMVCoins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showBmvModal && <BMVInfoModal />}
      {showTransferModal && <TransferModal />}
      {showTransfersModal && <TransfersModal />}
    </div>
  );
};

export default MyCrypto;