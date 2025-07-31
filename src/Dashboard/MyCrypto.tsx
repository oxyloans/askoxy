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

  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Refs
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

  const [transferDetails, setTransferDetails] = useState({
    recipientMobile: "",
    amount: "",
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Event listeners for modals
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

    if (showTransfersModal || showTransferModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTransfersModal, showTransferModal]);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Filter transfers
  useEffect(() => {
    if (transfers.length > 0) {
      const filtered = transfers.filter((transfer) => {
        const isSent = transfer.txMobileNumber === userMobileNumber;
        if (transferFilter === "sent") return isSent;
        if (transferFilter === "received") return !isSent;
        return true;
      });
      setFilteredTransfers(filtered);
    } else {
      setFilteredTransfers([]);
    }
  }, [transfers, transferFilter, userMobileNumber]);

  const closeTransfersModal = () => {
    setShowTransfersModal(false);
    setTransferFilter("all");
  };

  const toggleExpand = (index: number) => {
    setExpandedTxId(expandedTxId === index ? null : index);
  };

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

  useEffect(() => {
    if (userMobileNumber && !transfersInitialized.current) {
      transfersInitialized.current = true;
      fetchTransfers();
    }
  }, [userMobileNumber]);

  useEffect(() => {
    if (showTransfersModal && shouldFetchTransfers) {
      fetchTransfers();
      setShouldFetchTransfers(false);
    }
  }, [showTransfersModal, shouldFetchTransfers]);

  const fetchTransfers = useCallback(async () => {
    if (!userMobileNumber) return;

    try {
      setTransfersLoading(true);
      setTransfersError(null);

      const response = await axios.get(`${BASE_URL}/user-service/bmvhistory`, {
        params: { mobileNumber: userMobileNumber },
        timeout: 1000,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 204,
      });

      if (!isMounted.current) return;

      if (response.status === 204) {
        setTransfers([]);
        return;
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format from server");
      }

      setTransfers(response.data);
    } catch (error: any) {
      console.error("Error fetching transfers:", error);

      if (isMounted.current) {
        if (error.code === "ECONNABORTED") {
          setTransfersError("Request timed out. Please try again.");
        } else if (error.response?.status === 404) {
          setTransfersError("No transfers found");
        } else if (error.response?.status === 400) {
          setTransfersError("Invalid request. Please check your mobile number.");
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
      if (isMounted.current) {
        setTransfersLoading(false);
      }
    }
  }, [userMobileNumber]);

  const handleOpenTransfersModal = () => {
    setShowTransfersModal(true);
    if (transfersInitialized.current && (transfers.length > 0 || transfersError)) {
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

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipientMobile = mobileInputRef.current?.value || "";
    const transferAmount = amountInputRef.current?.value || "";

    if (!recipientMobile || !transferAmount) {
      setTransferStatus({
        loading: false,
        success: false,
        error: "Please fill in all fields",
      });
      return;
    }

    if (recipientMobile.length !== 10 || !/^\d{10}$/.test(recipientMobile)) {
      setTransferStatus({
        loading: false,
        success: false,
        error: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

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

      await axios.post(`${BASE_URL}/user-service/assetTransfer`, {
        from_mobile: userMobileNumber,
        to_mobile: recipientMobile,
        amount: transferAmount,
      });

      if (isMounted.current) {
        setTransferDetails({
          recipientMobile: recipientMobile,
          amount: transferAmount,
        });

        setTransferStatus({ loading: false, success: true, error: null });
        fetchUserData();

        setTimeout(() => {
          if (isMounted.current) {
            if (mobileInputRef.current) mobileInputRef.current.value = "";
            if (amountInputRef.current) amountInputRef.current.value = "";
            setShowTransferModal(false);
            setTransferStatus({ loading: false, success: false, error: null });
            setShouldFetchTransfers(true);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Transfer error:", error);

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

  // BMVInfoModal Component
  const BMVInfoModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] ">
        <button
          onClick={() => setShowBmvModal(false)}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center 
                  bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-50"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center gap-3 mb-2">
            {/* <div className="p-2 bg-white rounded-full">
              <img src={BMVICON} alt="BMV Coin" className="h-7 w-7" />
            </div> */}
            <h1 className="text-2xl font-bold">Welcome to BMVCOINS</h1>
          </div>
          <p className="text-purple-100 text-sm">Your Digital Reward Tokens</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-purple-50/80 p-5 rounded-xl border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                What are BMVCOINS?
              </h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              BMVCOINS are digital reward tokens powered by{" "}
              <strong>OXYCHAIN</strong>. They work like cashback points for your
              purchases.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <div className="text-center">
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹0.02 per coin
                </p>
                <div className="text-md text-purple-500 mt-1">
                  1000 BMVCOINS = ₹20
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50/80 p-5 rounded-xl border border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                How to Use
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded-full mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Redeem at ₹200 (10,000 coins)
                  </p>
                  <p className="text-xs text-gray-600">
                    Minimum redemption amount
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded-full mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Transfer to friends and family
                  </p>
                  <p className="text-xs text-gray-600">
                    Share with other ASKOXY.AI users
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded-full mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Use on non-GST items
                  </p>
                  <p className="text-xs text-gray-600">Works like cash</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50/80 p-5 rounded-xl border border-yellow-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Future Potential
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              We're working to list BMVCOINS on exchanges soon.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-500">Today</div>
                  <div className="text-xl font-bold text-yellow-600">₹0.02</div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 mx-4" />
                <div className="text-center">
                  <div className="font-medium text-gray-500">Projected</div>
                  <div className="text-xl font-bold text-green-600">₹1+</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2 italic">
              *Projected value - no guarantee
            </p>
          </div>

          <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Key Features
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Powered by OXYCHAIN</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  Track in AskOxy dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  Transferable between users
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Note:</strong> BMVCOINS are bonus rewards. Prices remain
              competitive even without them. Use wisely — earn, redeem, and grow
              with AskOxy!
            </p>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={() => setShowBmvModal(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 
                    rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 
                    font-medium text-sm shadow-lg hover:shadow-xl"
          >
            Got it! Let's Start Earning
          </button>
        </div>
      </div>
    </div>
  );

  // TransferModal Component
  const TransferModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={transferModalRef}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative overflow-y-auto max-h-[90vh] "
      >
        <button
          onClick={() => setShowTransferModal(false)}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center 
                    bg-white hover:bg-gray-100 rounded-full transition-colors z-50
                    shadow-lg border border-gray-200"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={2.5} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-purple-100">
            <SendHorizonal className="h-7 w-7 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Transfer BMVCOINS</h2>
        </div>

        {transferStatus.success ? (
          <div className="text-center py-4">
            <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-3">
              Transfer Successful!
            </h3>
            <p className="text-gray-700 mb-5">
              You have successfully transferred {transferDetails.amount}{" "}
              BMVCOINS to {transferDetails.recipientMobile}.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl mb-5">
              <p className="text-gray-500 mb-1">Updated Balance:</p>
              <p className="text-3xl font-bold text-purple-700">
                {bmvCoin} BMVCOINS
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTransferSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="recipientMobile"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Recipient Mobile Number
                </label>
                <input
                  ref={mobileInputRef}
                  type="text"
                  id="recipientMobile"
                  placeholder="Enter 10-digit mobile number"
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  maxLength={10}
                  pattern="\d{10}"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-gray-700 font-medium mb-2"
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
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  />
                  <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    BMVCOINS
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Available: <span className="font-medium">{bmvCoin} BMVCOINS</span>
                </p>
              </div>

              {transferStatus.error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {transferStatus.error}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm mb-2 font-medium">Important:</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>All transfers are final and cannot be reversed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>The recipient must be a registered user.</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full p-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                disabled={transferStatus.loading}
              >
                {transferStatus.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col "
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <History className="h-7 w-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Transfer History
            </h2>
          </div>
          <button
            onClick={closeTransfersModal}
            className="w-9 h-9 flex items-center justify-center 
                      bg-white hover:bg-gray-100 rounded-full transition-colors
                      shadow-lg border border-gray-200"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} className="text-gray-700" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 bg-gray-50 border-b sticky top-16 z-10">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "sent", label: "Sent" },
              { key: "received", label: "Received" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTransferFilter(key as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  transferFilter === key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {transfersLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-gray-600">Loading transfers...</span>
            </div>
          ) : transfersError ? (
            <div className="text-center py-10">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-5">
                {transfersError}
              </div>
              <button
                onClick={fetchTransfers}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
              >
                Try Again
              </button>
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="text-center py-10">
              <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transfers found</p>
              <button
                onClick={fetchTransfers}
                className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransfers.map((transfer, index) => {
                const isSent = transfer.txMobileNumber === userMobileNumber;
                const isExpanded = expandedTxId === index;

                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
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
                            <Minus className="h-6 w-6 text-red-600" />
                          ) : (
                            <Plus className="h-6 w-6 text-green-600" />
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
                          className={`text-xl font-bold ${
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
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">From Address:</p>
                            <p className="font-mono text-gray-800 break-all bg-gray-50 p-2.5 rounded-lg">
                              {transfer.txChainAddress}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">To Address:</p>
                            <p className="font-mono text-gray-800 break-all bg-gray-50 p-2.5 rounded-lg">
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh] ">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <HelpCircle className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Frequently Asked Questions
              </h2>
            </div>
            <button
              onClick={() => setShowFaqModal(false)}
              className="w-9 h-9 flex items-center justify-center 
                        bg-white hover:bg-gray-100 rounded-full transition-colors
                        shadow-lg border border-gray-200"
              aria-label="Close modal"
            >
              <X size={18} strokeWidth={2.5} className="text-gray-700" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
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
                    <div className="px-4 pb-4 -mt-2">
                      <p className="text-gray-700">{faq.answer}</p>
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
    return (
    <>
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BMVCOINS Card */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Your BMVCOINS Balance</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{bmvCoin}</span>
                    <span className="text-lg">BMVCOINS</span>
                  </div>
                  <p className="text-purple-100 mt-2">
                    ≈ ₹{(bmvCoin * 0.02).toFixed(2)} (₹0.02 per coin)
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-purple-100 mb-1">Blockchain ID:</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs sm:text-sm break-all bg-purple-800/30 p-2 rounded-lg">
                        {multichainId || "Loading..."}
                      </p>
                      <button
                        onClick={handleCopyMultichainId}
                        className="p-2 bg-purple-800/50 rounded-lg hover:bg-purple-800/70 transition-colors"
                        disabled={!multichainId}
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowBmvModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Info className="h-5 w-5" />
                    <span>Learn More</span>
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <SendHorizonal className="h-5 w-5" />
                    <span>Transfer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Wallet Address
                </h3>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm mb-2">
                    Your Multichain ID
                  </p>
                  <p className="font-mono text-sm break-all text-gray-800">
                    {multichainId || "Not available"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopyMultichainId}
                    className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
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
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href="http://bmv.money:2750/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>View Explorer</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-5">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Current Rate</span>
                  <span className="font-bold text-green-600">₹0.02/coin</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-bold text-purple-600">
                    ₹{(bmvCoin * 0.02).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Blockchain</span>
                  <span className="font-bold text-blue-600">OXYCHAIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <History className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Recent Transactions
                  </h3>
                </div>
                <button
                  onClick={handleOpenTransfersModal}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {transfersLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : transfersError ? (
                <div className="text-center py-10">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-4">
                    {transfersError}
                  </div>
                  <button
                    onClick={fetchTransfers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredTransfers.length === 0 ? (
                <div className="text-center py-10">
                  <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent transactions</p>
                  <button
                    onClick={fetchTransfers}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransfers.slice(0, 3).map((transfer, index) => {
                    const isSent = transfer.txMobileNumber === userMobileNumber;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${
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
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            isSent ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isSent ? "-" : "+"}
                          {transfer.amountTransfer}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     {/* Modals */}
      {showBmvModal && <BMVInfoModal />}
      {showTransferModal && <TransferModal />}
      {showTransfersModal && <TransfersModal />}
      {showFaqModal && <FAQModal />}
    </>
  );
};

export default MyCrypto;
