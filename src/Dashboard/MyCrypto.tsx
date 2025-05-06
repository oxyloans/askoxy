import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronDown,
  ChevronUp,
  Menu,
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
  // Basic state variables
  const [multichainId, setMultichainId] = useState("");
  const [bmvCoin, setBmvCoin] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState("");

  // UI state variables
  const [showBmvModal, setShowBmvModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransfersModal, setShowTransfersModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [shouldFetchTransfers, setShouldFetchTransfers] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [transfersError, setTransfersError] = useState<string | null>(null);

  // Data state
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  // Single place to define expandedTxId - at component level
  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);

  // Refs for uncontrolled inputs
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const transfersInitialized = useRef(false);

  // Transfer state
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

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Add event listener for clicking outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTransfersModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeTransfersModal();
      }
    };

    // Add event listener when modal is shown
    if (showTransfersModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTransfersModal]);

  // Fetch user data only once on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to close transfers modal with clean state
  const closeTransfersModal = () => {
    setShowTransfersModal(false);
  };

  // Toggle expanded view for a transaction
  const toggleExpand = (index: number) => {
    setExpandedTxId(expandedTxId === index ? null : index);
  };

  // Function to fetch user profile data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const response = await axios.get(
        `${BASE_URL}/user-service/getProfile/${userId}`
      );

      // Only update state if component is still mounted
      if (isMounted.current) {
        setMultichainId(response.data.multiChainId || "");
        setBmvCoin(response.data.coinAllocated || 0);
        setUserMobileNumber(response.data.mobileNumber || "");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      if (isMounted.current) {
        alert(
          "Failed to load profile: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Only fetch transfers when mobileNumber is available AND we haven't fetched before
  // This ensures we only fetch once initially, and then only on explicit refresh
  useEffect(() => {
    if (userMobileNumber && !transfersInitialized.current) {
      transfersInitialized.current = true;
      fetchTransfers();
    }
  }, [userMobileNumber]);

  // If modal is opened and shouldFetchTransfers is true, fetch transfers
  useEffect(() => {
    if (showTransfersModal && shouldFetchTransfers) {
      fetchTransfers();
      setShouldFetchTransfers(false);
    }
  }, [showTransfersModal, shouldFetchTransfers]);

  // Improved fetchTransfers function with better error handling and loading state management
  const fetchTransfers = useCallback(async () => {
    // Return early without updating state if there's no mobile number
    if (!userMobileNumber) return;

    console.log("🔄 Fetching transfers for", userMobileNumber);

    try {
      // Set loading state before starting request
      setTransfersLoading(true);
      setTransfersError(null);

      // Updated API endpoint - using the correct bmvhistory endpoint with proper formatting
      const response = await axios.get(
        `${BASE_URL}/api/user-service/bmvhistory`,
        {
          params: { mobileNumber: userMobileNumber },
          // Add timeout to prevent infinite loading state
          timeout: 15000,
          // Handle 204 responses properly (No Content)
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 204,
        }
      );

      // Guard against component unmounting during async operation
      if (!isMounted.current) return;

      // Handle 204 No Content response specifically (no transactions found)
      if (response.status === 204) {
        // Set transfers to empty array to indicate no transactions found
        setTransfers([]);
        return;
      }

      // Validate response for other success cases
      if (!response.data) {
        throw new Error("No data received from server");
      }

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }

      // Update transfers state with fresh data
      setTransfers(data);
      console.log("✅ Successfully fetched", data.length, "transfers");
    } catch (error: any) {
      console.error("Error fetching transfers:", error);

      // Only update error state if component is still mounted
      if (isMounted.current) {
        // Set specific error message based on error type
        if (error.code === "ECONNABORTED") {
          setTransfersError("Request timed out. Please try again.");
        } else if (error.response?.status === 404) {
          setTransfersError("No transfers found");
        } else if (error.response?.status === 400) {
          setTransfersError(
            "Invalid request. Please check your mobile number."
          );
        } else if (error.response?.status >= 500) {
          setTransfersError("Server error. Please try again later.");
        } else {
          setTransfersError(
            error.response?.data?.message ||
              error.message ||
              "Failed to fetch transfer history"
          );
        }
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMounted.current) {
        setTransfersLoading(false);
      }
    }
  }, [userMobileNumber]);

  // Prepare for transfer modal - ensure we have the latest data
  const handleOpenTransfersModal = () => {
    setShowTransfersModal(true);

    // Only fetch new transfers if we've successfully fetched once before
    // This prevents redundant API calls on initial open
    if (
      transfersInitialized.current &&
      (transfers.length > 0 || transfersError)
    ) {
      setShouldFetchTransfers(true);
    }
  };

  // Copy multichain ID to clipboard
  const handleCopyMultichainId = async () => {
    if (multichainId) {
      try {
        await navigator.clipboard.writeText(multichainId);
        setIsCopied(true);
        setTimeout(() => {
          if (isMounted.current) {
            setIsCopied(false);
          }
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Handle transfer submission
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

      // Simple POST with no token
      await axios.post(`${BASE_URL}/user-service/assetTransfer`, {
        from_mobile: userMobileNumber,
        to_mobile: recipientMobile,
        amount: transferAmount,
      });

      // Save transfer details for success message
      if (isMounted.current) {
        setTransferDetails({
          recipientMobile: recipientMobile,
          amount: transferAmount,
        });

        // Update success state
        setTransferStatus({ loading: false, success: true, error: null });

        // Refresh balance
        fetchUserData();

        // Reset form and close modal after delay
        setTimeout(() => {
          if (isMounted.current) {
            if (mobileInputRef.current) mobileInputRef.current.value = "";
            if (amountInputRef.current) amountInputRef.current.value = "";
            setShowTransferModal(false);
            setTransferStatus({ loading: false, success: false, error: null });

            // Mark that we need to refresh transfers list next time it's opened
            setShouldFetchTransfers(true);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Transfer error:", error);

      // Handle specific API errors
      if (isMounted.current) {
        if (error.response?.status === 400) {
          setTransferStatus({
            loading: false,
            success: false,
            error: "Invalid transfer request. Please check recipient details.",
          });
        } else if (error.response?.status === 404) {
          setTransferStatus({
            loading: false,
            success: false,
            error: "Recipient not found. Please verify the mobile number.",
          });
        } else if (error.response?.status >= 500) {
          setTransferStatus({
            loading: false,
            success: false,
            error: "Server error. Please try again later.",
          });
        } else {
          setTransferStatus({
            loading: false,
            success: false,
            error:
              error.response?.data?.message ||
              "Transfer failed. Please try again.",
          });
        }
      }
    }
  };

// BMVInfoModal Component with mobile-optimized close button
const BMVInfoModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]">
      {/* Fixed close button - completely redesigned for mobile */}
      <button
        onClick={() => setShowBmvModal(false)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                  bg-white hover:bg-gray-100 rounded-full transition-colors z-50
                  shadow-lg border border-gray-200"
        aria-label="Close modal"
      >
        <X size={16} strokeWidth={2.5} className="text-gray-700" />
      </button>

      <div className="flex items-center gap-3 mb-5">
        <img src={BMVICON} alt="BMV Coin" className="h-10" />
      </div>

      {/* Rest of BMVInfoModal content remains the same */}
      <div className="text-gray-700 space-y-4">
        <p className="text-base sm:text-lg">
          BMVCoins are our platform's native cryptocurrency that can be used
          for discounts on products and services.
        </p>

        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
          <p className="font-medium text-purple-800">Current value:</p>
          <p className="text-purple-700 text-base sm:text-lg">
            1,000 BMVCoins = ₹10 discount
          </p>
        </div>

        <div>
          <p className="font-medium text-base sm:text-lg">
            Future potential value:
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-blue-800 text-sm sm:text-base">Minimum</p>
              <p className="text-base sm:text-lg font-bold text-blue-700">
                ₹10,000
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-green-800 text-sm sm:text-base">
                Great Value
              </p>
              <p className="text-base sm:text-lg font-bold text-green-700">
                $10,000
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <p className="font-medium mb-2 sm:mb-3 text-base sm:text-lg">
            Important information:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">
                •
              </span>
              <span className="text-sm sm:text-base">
                A minimum of 20,000 BMVCoins is required for redemption.
              </span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">
                •
              </span>
              <span className="text-sm sm:text-base">
                When we reach 1 million users, BMVCoins will launch on public
                tradeable blockchains.
              </span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">
                •
              </span>
              <span className="text-sm sm:text-base">
                Expected opening value: minimum of $0.10 USD per coin.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => setShowBmvModal(false)}
        className="mt-5 sm:mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-base sm:text-lg"
      >
        Got it
      </button>
    </div>
  </div>
);

// Transfers Modal Component with fixed close button
const TransfersModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md sm:max-w-2xl mx-2 sm:mx-4 relative max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Fixed header with completely redesigned close button for mobile */}
        <div className="relative mb-6 sm:mb-6 sticky top-0 bg-white z-10 pt-3 pb-3">
          {/* Title centered for better mobile layout */}
          <div className="flex items-center justify-center">
            <div className="p-2 sm:p-3 rounded-full bg-purple-100 mr-2 sm:mr-3">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-700">
              Transfer History
            </h2>
          </div>
          
          {/* Mobile-optimized close button positioned in top-right corner */}
          <button
            onClick={closeTransfersModal}
            className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center
                      bg-white hover:bg-gray-100 rounded-full transition-colors z-50
                      shadow-lg border border-gray-200"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} className="text-gray-700" />
          </button>
        </div>

        {/* Clean divider with sufficient margin */}
        <div className="w-full h-px bg-gray-200 mb-4"></div>

        {/* Rest of the TransfersModal component remains the same */}
        <div className="flex-1 overflow-y-auto">
          {transfersLoading ? (
            // Loading state - simplified
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading transfer history...</p>
            </div>
          ) : transfersError ? (
            // Error state
            <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 mb-4">{transfersError}</p>
              <button
                onClick={() => {
                  setTransfersError(null);
                  setTransfersLoading(true);
                  fetchTransfers();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : transfers.length === 0 ? (
            // Empty state
            <div className="text-center py-8 sm:py-12">
              <div className="mb-4 flex justify-center">
                <History className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300" />
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                No transactions found.
              </p>
              <p className="text-sm sm:text-base text-gray-500 px-2">
                Your transaction history will appear here once you send or
                receive BMVCoins.
              </p>
            </div>
          ) : (
            // Transfers list - remains the same
            <div className="space-y-3 sm:space-y-4 pr-1">
              {transfers.map((transfer, index) => {
                // Correctly determine if current user is sender or receiver
                const isSent = transfer.txMobileNumber === userMobileNumber;
                const otherPartyMobile = isSent
                  ? transfer.rxMobileNumber
                  : transfer.txMobileNumber;
                const isExpanded = expandedTxId === index;

                return (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                      isExpanded
                        ? "bg-white border-purple-300 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    {/* Transaction header - always visible */}
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-2 sm:mr-3 ${
                            isSent ? "bg-red-100" : "bg-green-100"
                          }`}
                        >
                          {isSent ? (
                            <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                          ) : (
                            <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 transform rotate-180" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs sm:text-sm ${
                              isSent ? "text-red-600" : "text-green-600"
                            } font-medium`}
                          >
                            {isSent ? "Sent to" : "Received from"}
                          </p>
                          <p className="font-medium text-sm sm:text-base text-gray-800">
                            {otherPartyMobile}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center">
                        <p
                          className={`font-bold text-base sm:text-lg mr-2 ${
                            isSent ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isSent ? "-" : "+"}
                          {transfer.amountTransfer}
                        </p>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded transaction details */}
                    {isExpanded && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-3">
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">
                            Recipient Mobile
                          </p>
                          <p className="font-medium text-xs sm:text-base text-gray-800">
                            {transfer.rxMobileNumber}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">
                            From Address
                          </p>
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 break-all">
                            <p className="font-mono text-gray-800 text-xs sm:text-sm">
                              {transfer.txChainAddress ||
                                "Address not available"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">
                            To Address
                          </p>
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 break-all">
                            <p className="font-mono text-gray-800 text-xs sm:text-sm">
                              {transfer.rxChainAddress ||
                                "Address not available"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">
                            Amount
                          </p>
                          <p className="font-bold text-lg sm:text-xl text-purple-700">
                            {transfer.amountTransfer} BMVCoins
                          </p>
                        </div>

                        {transfer.txChainAddress && (
                          <button
                            className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `http://bmv.money:2750/address/${transfer.txChainAddress}`
                              );
                            }}
                          >
                            <ExternalLink size={14} className="mr-2" />
                            View on OxyChain Explorer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed footer with refresh button - remains the same */}
        {!transfersLoading && transfers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-center sticky bottom-0 bg-white">
            <button
              onClick={() => {
                setTransfersLoading(true);
                fetchTransfers();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div>
          {/* Main Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-purple-100 mb-6 sm:mb-8">
            {/* Header */}
          
<div className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 sm:px-6 py-4 sm:py-6 text-white">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
    {/* Title */}
    <h1 className="text-2xl font-bold flex items-center">
      <Coins className="mr-3" size={28} />
      My BMVCoins
    </h1>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
      <button
        onClick={handleOpenTransfersModal}
        className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center justify-center"
      >
        <History size={16} className="mr-2" />
        My Transfers
      </button>
      <button
        onClick={() => setShowBmvModal(true)}
        className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center justify-center"
      >
        <Info size={16} className="mr-2" />
        About BMVCoins
      </button>
    </div>
  </div>
</div>


            {/* Balance Section */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-wrap sm:flex-nowrap items-center">
                <img
                  src={BMVICON}
                  alt="BMV Coin"
                  className="h-8 sm:h-10 w-auto mr-3 sm:mr-4"
                />
                <div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">
                    Current Balance
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-bold text-purple-700">
                    {bmvCoin}
                  </h2>
                </div>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="ml-auto mt-3 sm:mt-0 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <SendHorizonal size={18} className="mr-2" />
                  Transfer
                </button>
              </div>
            </div>

            {/* Blockchain ID Section */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                <Shield className="mr-2" size={18} />
                Your Blockchain ID
              </h3>
              <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium overflow-hidden text-ellipsis text-xs sm:text-sm">
                  {multichainId}
                </p>
                <button
                  onClick={handleCopyMultichainId}
                  className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors ml-2 flex-shrink-0"
                  aria-label="Copy blockchain ID"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mt-2 sm:mt-3">
                <button
                  onClick={() => window.open("http://bmv.money:2750/")}
                  className="px-3 sm:px-4 py-1 sm:py-2 text-purple-600 hover:text-purple-700 transition-colors flex items-center text-xs sm:text-sm"
                >
                  <ExternalLink size={14} className="mr-2" />
                  View on OxyChain Explorer
                </button>
              </div>
            </div>

            {/* Value & Benefits */}
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="mr-2" size={18} />
                BMVCoin Value & Benefits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-1 sm:mb-2">
                    <DollarSign size={16} className="text-blue-600 mr-2" />
                    <p className="font-medium text-blue-800 text-sm sm:text-base">
                      Current Value
                    </p>
                  </div>
                  <p className="text-blue-700 text-sm sm:text-base">
                    1,000 BMVCoins = ₹10 discount on our platform
                  </p>
                </div>

                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-1 sm:mb-2">
                    <TrendingUp size={16} className="text-green-600 mr-2" />
                    <p className="font-medium text-green-800 text-sm sm:text-base">
                      Future Potential
                    </p>
                  </div>
                  <p className="text-green-700 text-sm sm:text-base">
                    Expected value up to $10,000 (₹8,00,000+)
                  </p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 bg-purple-50 p-3 sm:p-4 rounded-lg">
                <p className="font-bold text-purple-800 mb-2 text-sm sm:text-base">
                  How to use your BMVCoins:
                </p>
                <ul className="space-y-1 sm:space-y-2 text-purple-700 text-xs sm:text-sm">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">
                      •
                    </span>
                    <span>Get discounts on products and services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">
                      •
                    </span>
                    <span>Hold for future value growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 mr-2 mt-0.5">
                      •
                    </span>
                    <span>Transfer to other users</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowBmvModal(true)}
                className="mt-4 sm:mt-6 w-full p-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-colors flex items-center justify-center"
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
      {showTransferModal && <TransfersModal />}
      {showTransfersModal && <TransfersModal />}
    </div>
  );
};

export default MyCrypto;
