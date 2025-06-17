import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Coins,
  Copy,
  Sparkles,
  ChevronRight,
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
  Plus,
  Minus,
  HelpCircle,
} from "lucide-react";
import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png";

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
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [transfersError, setTransfersError] = useState<string | null>(null);

  // Data state
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [transferFilter, setTransferFilter] = useState<
    "all" | "sent" | "received"
  >("all");

  // Single place to define expandedTxId - at component level
  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Refs for uncontrolled inputs
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const transferModalRef = useRef<HTMLDivElement>(null);
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

      if (
        showTransferModal &&
        transferModalRef.current &&
        !transferModalRef.current.contains(event.target as Node)
      ) {
        setShowTransferModal(false);
      }
    };

    // Add event listener when modal is shown
    if (showTransfersModal || showTransferModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTransfersModal, showTransferModal]);

  // Fetch user data only once on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Filter transfers when filter changes or transfers update
  useEffect(() => {
    if (transfers.length > 0) {
      const filtered = transfers.filter((transfer) => {
        const isSent = transfer.txMobileNumber === userMobileNumber;
        if (transferFilter === "sent") return isSent;
        if (transferFilter === "received") return !isSent;
        return true; // 'all' filter
      });
      setFilteredTransfers(filtered);
    } else {
      setFilteredTransfers([]);
    }
  }, [transfers, transferFilter, userMobileNumber]);

  // Function to close transfers modal with clean state
  const closeTransfersModal = () => {
    setShowTransfersModal(false);
    setTransferFilter("all"); // Reset filter when closing
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

      const response = await axios.get(`${BASE_URL}/user-service/bmvhistory`, {
        params: { mobileNumber: userMobileNumber },
        // Add timeout to prevent infinite loading state
        timeout: 1000,
        // Handle 204 responses properly (No Content)
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 204,
      });

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

  interface NavItem {
    label: string;
    icon: React.ElementType;
    color: string;
    action: () => void;
  }

  const navItems: NavItem[] = [
    {
      label: "BMVCoin",
      icon: Info,
      color: "purple",
      action: () => setShowBmvModal(true),
    },
    {
      label: "Transfers",
      icon: History,
      color: "blue",
      action: handleOpenTransfersModal,
    },
    {
      label: "FAQs",
      icon: HelpCircle,
      color: "green",
      action: () => setShowFaqModal(true),
    },
  ];

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
                  1000
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-green-800 text-sm sm:text-base">
                  Maximum
                </p>
                <p className="text-base sm:text-lg font-bold text-green-700">
                  100000
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
                  A minimum of 1000 BMVCoins is required for redemption.
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

  // TransferModal Component
  const TransferModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={transferModalRef}
        className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]"
      >
        {/* Fixed close button - optimized for mobile */}
        <button
          onClick={() => setShowTransferModal(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                    bg-white hover:bg-gray-100 rounded-full transition-colors z-50
                    shadow-lg border border-gray-200"
          aria-label="Close modal"
        >
          <X size={16} strokeWidth={2.5} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-full bg-purple-100">
            <SendHorizonal className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Transfer BMVCoins</h2>
        </div>

        {/* Show different content based on transfer status */}
        {transferStatus.success ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Transfer Successful!
            </h3>
            <p className="text-gray-700 mb-4">
              You have successfully transferred {transferDetails.amount}{" "}
              BMVCoins to {transferDetails.recipientMobile}.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-500 mb-1">Updated Balance:</p>
              <p className="text-2xl font-bold text-purple-700">
                {bmvCoin} BMVCoins
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTransferSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="recipientMobile"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Recipient Mobile Number
                </label>
                <input
                  ref={mobileInputRef}
                  type="text"
                  id="recipientMobile"
                  placeholder="Enter 10-digit mobile number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  maxLength={10}
                  pattern="\d{10}"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Amount to Transfer
                </label>
                <div className="relative">
                  <input
                    ref={amountInputRef}
                    type="number"
                    id="amount"
                    placeholder="Enter amount"
                    min="1"
                    max={bmvCoin}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    BMVCoins
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Available: {bmvCoin} BMVCoins
                </p>
              </div>

              {transferStatus.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {transferStatus.error}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Important:</p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>All transfers are final and cannot be reversed.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>The recipient must be a registered user.</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                disabled={transferStatus.loading}
              >
                {transferStatus.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <SendHorizonal size={18} className="mr-2" />
                    Transfer Now
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // Transfers Modal Component with fixed close button and filters
  const TransfersModal = () => {
    // Sort filteredTransfers in descending order to show latest transactions first
    const sortedTransfers = [...filteredTransfers].reverse();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div
          ref={modalRef}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md sm:max-w-2xl mx-2 sm:mx-4 relative max-h-[95vh] flex flex-col overflow-hidden"
        >
          {/* Fixed header with completely redesigned close button for mobile */}
          <div className="relative mb-4 sm:mb-6 sticky top-0 bg-white z-10 pt-3 pb-3">
            {/* Title centered for better mobile layout */}
            <div className="flex items-center justify-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 mr-2 sm:mr-3 mb-2">
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

          {/* Filter buttons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setTransferFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                transferFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setTransferFilter("sent")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                transferFilter === "sent"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Minus size={16} className="mr-1" />
              Coins Sent
            </button>
            <button
              onClick={() => setTransferFilter("received")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                transferFilter === "received"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Plus size={16} className="mr-1" />
              Coins Received
            </button>
          </div>

          {/* Clean divider with sufficient margin */}
          <div className="w-full h-px bg-gray-200 mb-4"></div>

          {/* Rest of the TransfersModal component */}
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
            ) : sortedTransfers.length === 0 ? (
              // Empty state
              <div className="text-center py-8 sm:py-12">
                <div className="mb-4 flex justify-center">
                  <History className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300" />
                </div>
                <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                  No {transferFilter === "all" ? "" : transferFilter}{" "}
                  transactions found.
                </p>
                <p className="text-sm sm:text-base text-gray-500 px-2">
                  {transferFilter === "all"
                    ? "Your transaction history will appear here once you send or receive BMVCoins."
                    : `No ${transferFilter} transactions found.`}
                </p>
              </div>
            ) : (
              // Transfers list
              <div className="space-y-3 sm:space-y-4 pr-1">
                {sortedTransfers.map((transfer, index) => {
                  // Determine if current user is sender or receiver
                  const isSent = transfer.txMobileNumber === userMobileNumber;
                  // Check if this is a cashback transaction
                  const isCashback = !transfer.txMobileNumber;
                  const otherPartyMobile = isCashback
                    ? "Cashback"
                    : isSent
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
                              isSent
                                ? "bg-red-100"
                                : isCashback
                                ? "bg-yellow-100"
                                : "bg-green-100"
                            }`}
                          >
                            {isSent ? (
                              <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                            ) : (
                              <SendHorizonal
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                  isCashback ? "text-yellow-600" : "text-green-600"
                                } transform rotate-180`}
                              />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-xs sm:text-sm ${
                                isSent
                                  ? "text-red-600"
                                  : isCashback
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              } font-medium`}
                            >
                              {isCashback
                                ? "Cashback"
                                : isSent
                                ? "Sent to"
                                : "Received from"}
                            </p>
                            <p className="font-medium text-sm sm:text-base text-gray-800">
                              {otherPartyMobile}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center">
                          <p
                            className={`font-bold text-base sm:text-lg mr-2 ${
                              isSent ? "text-red-600" : isCashback ? "text-yellow-600" : "text-green-600"
                            }`}
                          >
                            {isSent && !isCashback ? "-" : "+"}
                            {transfer.amountTransfer}
                          </p>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">From</p>
                              <p className="text-sm font-medium text-gray-800 break-all">
                                {isCashback ? "Cashback" : transfer.txMobileNumber || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">To</p>
                              <p className="text-sm font-medium text-gray-800 break-all">
                                {transfer.rxMobileNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Chain Address (From)
                              </p>
                              <p className="text-sm font-medium text-gray-800 break-all">
                                {transfer.txChainAddress || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Chain Address (To)
                              </p>
                              <p className="text-sm font-medium text-gray-800 break-all">
                                {transfer.rxChainAddress || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with refresh button if there are transfers */}
          {transfers.length > 0 && !transfersLoading && (
            <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6 flex justify-center">
              <button
                onClick={() => {
                  setTransfersLoading(true);
                  fetchTransfers();
                }}
                className="px-4 py-2 flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                <History size={18} className="mr-2" />
                Refresh Transfer History
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // FAQ Modal Component
  const FaqModal = () => {
    const faqData = [
      {
        title: "Crypto vs No GST Goods",
        questions: [
          {
            question: "Can I use crypto for GST-free goods?",
            answer: "Yes, only for non-GST items like unbranded grains.",
          },
          {
            question: "Is crypto allowed for regular shopping?",
            answer: "Only if both buyer and seller agree.",
          },
          {
            question: "Are crypto rewards taxable?",
            answer: "Yes, they may be under capital gains rules.",
          },
        ],
      },
      {
        title: "GST vs 1–25kg & 26kg+",
        questions: [
          {
            question: "Why buy 26kg rice bags?",
            answer: "To avoid 5% GST on smaller packs.",
          },
          {
            question: "What's GST on 1–25kg bags?",
            answer: "5% on the bag's total value.",
          },
          {
            question: "Is GST added to unpackaged rice?",
            answer: "No, only packed goods under 25kg.",
          },
          {
            question: "Can coins be used to avoid GST?",
            answer:
              "The government may ask why using coins avoids GST. Hence, coins can be exchanged with goods for non-GST goods only.",
          },
        ],
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={() => setShowFaqModal(false)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                      bg-white hover:bg-gray-100 rounded-full transition-colors z-50
                      shadow-lg border border-gray-200"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2.5} className="text-gray-700" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-purple-100 mb-2">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqData.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {section.title}
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {section.questions.map((item, itemIndex) => {
                    const isExpanded =
                      expandedFaq === `${sectionIndex}-${itemIndex}`;
                    return (
                      <div
                        key={itemIndex}
                        className="transition-all duration-200"
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              isExpanded ? null : `${sectionIndex}-${itemIndex}`
                            )
                          }
                          className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-800 pr-4">
                            {item.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 text-gray-600">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Bar - Mobile optimized with hamburger menu */}
      <header className=" bg-white/90 backdrop-blur-sm ">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section - Enhanced for mobile */}
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2.5 rounded-xl shadow-lg">
                  <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h1 className="text-3xl sm:text-2xl mx-2 mt-2 font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MyCrypto
                </h1>
              </div>
            </div>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`group px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 flex items-center relative overflow-hidden ${
                    item.color === "purple"
                      ? "hover:text-purple-600 hover:bg-purple-50"
                      : item.color === "blue"
                      ? "hover:text-blue-600 hover:bg-blue-50"
                      : item.color === "green"
                      ? "hover:text-green-600 hover:bg-green-50"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
                      item.color === "purple"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600"
                        : item.color === "blue"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : item.color === "green"
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : ""
                    }`}
                  ></span>
                  <item.icon size={16} className="mr-2 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Animated and Enhanced */}
        <div
          className={`md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
            showMobileMenu
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 transform ${
                  showMobileMenu
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                } group ${
                  item.color === "purple"
                    ? "hover:bg-purple-50"
                    : item.color === "blue"
                    ? "hover:bg-blue-50"
                    : item.color === "green"
                    ? "hover:bg-green-50"
                    : ""
                }`}
                style={{
                  transitionDelay: showMobileMenu ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      item.color === "purple"
                        ? "bg-purple-100 group-hover:bg-purple-200"
                        : item.color === "blue"
                        ? "bg-blue-100 group-hover:bg-blue-200"
                        : item.color === "green"
                        ? "bg-green-100 group-hover:bg-green-200"
                        : ""
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={
                        item.color === "purple"
                          ? "text-purple-600"
                          : item.color === "blue"
                          ? "text-blue-600"
                          : item.color === "green"
                          ? "text-green-600"
                          : ""
                      }
                    />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                    <p className="text-xs text-gray-500">
                      {item.label === "BMVCoin" && "Learn about our token"}
                      {item.label === "Transfers" && "View transaction history"}
                      {item.label === "FAQs" && "Get help & support"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className={`transform group-hover:translate-x-1 transition-transform ${
                    item.color === "purple"
                      ? "text-purple-600"
                      : item.color === "blue"
                      ? "text-blue-600"
                      : item.color === "green"
                      ? "text-green-600"
                      : ""
                  }`}
                />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading your crypto details...</p>
          </div>
        ) : (
          // Content when loaded
          <div className="space-y-6 sm:space-y-8">
            {/* BMV Coin Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-5">
                {/* BMVCoin info */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    BMVCoin
                  </h2>
                  <button
                    onClick={() => setShowBmvModal(true)}
                    className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center"
                  >
                    <Info size={14} className="mr-1" />
                    About BMVCoin
                  </button>
                </div>

                {/* Transfer button */}
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center text-sm"
                >
                  <SendHorizonal size={16} className="mr-1.5" />
                  Transfer
                </button>
              </div>

              {/* Coin Balance */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-5 text-white mb-5">
                <p className="text-purple-200 mb-1">Your Balance</p>
                <p className="text-3xl sm:text-4xl font-bold mb-2">
                  {bmvCoin} <span className="text-lg">BMVCoins</span>
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Discounts</p>
                    <p className="text-sm text-gray-600">Save on products</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg flex items-center">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Secure</p>
                    <p className="text-sm text-gray-600">
                      Blockchain protected
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Growth</p>
                    <p className="text-sm text-gray-600">
                      Future trading value
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Multichain ID Card */}
            <div className="bg-white p-3 sm:p-5 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Your Multichain ID
              </h2>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-between mb-3 sm:mb-4">
                <div className="truncate pr-2 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                  <p className="text-xs sm:text-sm font-mono font-medium text-gray-800 truncate">
                    {multichainId || "Not available"}
                  </p>
                </div>
                <button
                  onClick={handleCopyMultichainId}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  disabled={!multichainId}
                  aria-label="Copy to clipboard"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <div className="flex items-start text-gray-600 text-xs sm:text-sm">
                <Info size={14} className="mr-1.5 mt-0.5 flex-shrink-0" />
                <p>
                  Your multichain ID is used to identify your wallet across
                  different blockchains.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showBmvModal && <BMVInfoModal />}
      {showTransferModal && <TransferModal />}
      {showTransfersModal && <TransfersModal />}
      {showFaqModal && <FaqModal />}
    </div>
  );
};

export default MyCrypto;