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
  Gift,
  Users,
  Zap,
  Target,
  ArrowRight,
  Star,
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
      label: "BMVCOINS",
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

  // Simplified BMVInfoModal Component - Web and Mobile Responsive
  const BMVInfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setShowBmvModal(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                  bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-50"
          aria-label="Close modal"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-full">
              <img src={BMVICON} alt="BMV Coin" className="h-6 w-full" />
            </div>
            <h1 className="text-xl font-bold">Welcome to BMVCOINS</h1>
          </div>
          <p className="text-purple-100 text-sm">Your Digital Reward Tokens</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* What are BMVCoins */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                What are BMVCOINS?
              </h2>
            </div>
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              BMVCOINS are digital reward tokens powered by{" "}
              <strong>OXYCHAIN</strong>. They work like cashback points for your
              purchases.
            </p>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-center">
                <div className="text-purple-600 font-bold text-base">
                  ₹0.02 per coin
                </div>
                <div className="text-sm text-gray-600">1000 BMVCOINS = ₹20</div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                How to Use
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Redeem at ₹200 (10,000 coins)
                  </p>
                  <p className="text-xs text-gray-600">
                    Minimum redemption amount
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Transfer to friends and family
                  </p>
                  <p className="text-xs text-gray-600">
                    Share with other ASKOXY.AI users
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Use on non-GST items
                  </p>
                  <p className="text-xs text-gray-600">Works like cash</p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Value */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Future Potential
              </h2>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              We're working to list BMVCOINS on exchanges soon.
            </p>
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <div className="font-medium">Today</div>
                  <div className="text-yellow-600 font-bold">₹0.02</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className="text-center">
                  <div className="font-medium">Projected</div>
                  <div className="text-green-600 font-bold">₹1+</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2 italic">
              *Projected value - no guarantee
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Key Features
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Powered by OXYCHAIN</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Track in AskOxy dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Transferable between users
                </span>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              <strong>Note:</strong> BMVCOINS are bonus rewards. Prices remain
              competitive even without them. Use wisely — earn, redeem, and grow
              with AskOxy!
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 pt-0">
          <button
            onClick={() => setShowBmvModal(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 
                    rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 
                    font-medium text-sm shadow-lg"
          >
            Got it! Let's Start Earning
          </button>
        </div>
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
          <h2 className="text-xl font-bold text-gray-800">Transfer BMVCOINS</h2>
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
              BMVCOINS to {transferDetails.recipientMobile}.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-500 mb-1">Updated Balance:</p>
              <p className="text-2xl font-bold text-purple-700">
                {bmvCoin} BMVCOINS
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
                    BMVCOINS
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Available: {bmvCoin} BMVCOINS
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
                className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={transferStatus.loading}
              >
                {transferStatus.loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  "Transfer BMVCOINS"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // TransfersModal Component
  const TransfersModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Fixed header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Transfer History
            </h2>
          </div>
          <button
            onClick={closeTransfersModal}
            className="w-8 h-8 flex items-center justify-center 
                      bg-white hover:bg-gray-100 rounded-full transition-colors
                      shadow-lg border border-gray-200"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2.5} className="text-gray-700" />
          </button>
        </div>

        {/* Filter buttons */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "sent", label: "Sent" },
              { key: "received", label: "Received" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTransferFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  transferFilter === key
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {transfersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading transfers...</span>
            </div>
          ) : transfersError ? (
            <div className="text-center py-8">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-4">
                {transfersError}
              </div>
              <button
                onClick={fetchTransfers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transfers found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransfers.map((transfer, index) => {
                const isSent = transfer.txMobileNumber === userMobileNumber;
                const isExpanded = expandedTxId === index;

                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            isSent ? "bg-red-100" : "bg-green-100"
                          }`}
                        >
                          {isSent ? (
                            <Minus className="h-5 w-5 text-red-600" />
                          ) : (
                            <Plus className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {isSent ? "Sent to" : "Received from"}{" "}
                            {isSent
                              ? transfer.rxMobileNumber
                              : transfer.txMobileNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transfer.amountTransfer} BMVCOINS
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold ${
                            isSent ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isSent ? "-" : "+"}
                          {transfer.amountTransfer}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">From Address:</p>
                            <p className="font-mono text-gray-800 break-all">
                              {transfer.txChainAddress}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">To Address:</p>
                            <p className="font-mono text-gray-800 break-all">
                              {transfer.rxChainAddress}
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
      </div>
    </div>
  );

  // FAQ Modal Component
  const FAQModal = () => {
    const faqs = [
      {
        id: "what-are-bmvcoins",
        question: "What are BMVCOINS?",
        answer:
          "BMVCOINS are digital reward tokens powered by OXYCHAIN blockchain. They work like cashback points for your purchases, with a current value of ₹0.02 per coin.",
      },
      {
        id: "how-to-earn",
        question: "How do I earn BMVCOINS?",
        answer:
          "You earn BMVCOINS through purchases on AskOxy platform. They are automatically credited to your account as bonus rewards.",
      },
      {
        id: "how-to-use",
        question: "How can I use BMVCOINS?",
        answer:
          "You can use BMVCOINS on non-GST items like cash. The minimum redemption threshold is ₹200 (10,000 coins). You can also transfer coins to other users.",
      },
      {
        id: "transfer-coins",
        question: "Can I transfer BMVCOINS to others?",
        answer:
          "Yes! You can transfer BMVCOINS to any registered AskOxy user using their mobile number. All transfers are final and cannot be reversed.",
      },
      {
        id: "future-value",
        question: "Will BMVCOINS increase in value?",
        answer:
          "We're working to list BMVCOINS on exchanges. While current value is ₹0.02 per coin, projected value could be ₹1+ per coin. However, this is a projection with no guarantee.",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <HelpCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Frequently Asked Questions
              </h2>
            </div>
            <button
              onClick={() => setShowFaqModal(false)}
              className="w-8 h-8 flex items-center justify-center 
                        bg-white hover:bg-gray-100 rounded-full transition-colors
                        shadow-lg border border-gray-200"
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={2.5} className="text-gray-700" />
            </button>
          </div>

          {/* FAQ Content */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                My Crypto
              </h1>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                    ${
                      item.color === "purple"
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : item.color === "blue"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                      ${
                        item.color === "purple"
                          ? "bg-purple-100 text-purple-700"
                          : item.color === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    BMVCOIN Balance
                  </h2>
                  <p className="text-gray-600">Your digital reward tokens</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 mb-2">Current Balance</p>
                    <p className="text-4xl sm:text-5xl font-bold">
                      {bmvCoin.toLocaleString()}
                    </p>
                    <p className="text-purple-100 mt-2">BMVCOINS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 mb-2">Equivalent Value</p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      ₹{(bmvCoin * 0.02).toFixed(2)}
                    </p>
                    <p className="text-purple-100 mt-2">@ ₹0.02 per coin</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  <SendHorizonal className="h-5 w-5" />
                  <span>Transfer Coins</span>
                </button>
                <button
                  onClick={handleOpenTransfersModal}
                  className="flex items-center justify-center gap-3 p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  <History className="h-5 w-5" />
                  <span>View History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Address Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Wallet Address
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-2">
                    Your Multichain ID
                  </p>
                  <p className="font-mono text-sm break-all text-gray-800">
                    {multichainId || "Not available"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Copy Address Button */}
                  <button
                    onClick={handleCopyMultichainId}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!multichainId}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Open Explorer Button */}
                  <a
                    href="http://bmv.money:2750/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🔗 <span>OXYCHIAN</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Rate</span>
                  <span className="font-bold text-green-600">₹0.02/coin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-purple-600">
                    ₹{(bmvCoin * 0.02).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Blockchain</span>
                  <span className="font-bold text-blue-600">OXYCHAIN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBmvModal && <BMVInfoModal />}
      {showTransferModal && <TransferModal />}
      {showTransfersModal && <TransfersModal />}
      {showFaqModal && <FAQModal />}
    </div>
  );
};

export default MyCrypto;
