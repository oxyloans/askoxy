import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Copy,
  Sparkles,
  
  Info,
  SendHorizontal,
  ExternalLink,
  Check,
  X,
  TrendingUp,
  Shield,
  DollarSign,
  History,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  HelpCircle,
  Gift,
  Users,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";
import BASE_URL from "../Config";
import dayjs from "dayjs";
import axiosInstance from "../utils/axiosInstance";



interface Transfer {
  txMobileNumber: string;
  rxMobileNumber: string;
  txChainAddress: string;
  rxChainAddress: string;
  amountTransfer: number;
  transferAt?: string;
  type?: string;
  status?: string | null;
}



// Transfer form kept outside MyCrypto to preserve focus while users type.
interface TransferModalProps {
  balance: number;
  senderMobile: string;
  onClose: () => void;
  onSuccess: () => void;
}

const validateMobile = (value: string, senderMobile: string): string => {
  if (!value) return "Enter the recipient's mobile number.";
  if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit mobile number.";
  if (value === senderMobile.replace(/\D/g, "").slice(-10))
    return "You cannot transfer coins to yourself.";
  return "";
};

const transferErrorMessage = (error: unknown): string => {
  const e = error as {
    code?: string;
    response?: { status?: number; data?: { error?: string; message?: string } };
  };
  const status = e.response?.status;
  const raw = `${e.response?.data?.error || ""} ${e.response?.data?.message || ""}`.toLowerCase();
  if (/not registered|not found|does not exist|invalid recipient|user not exist/.test(raw))
    return "This mobile number is not registered.";
  if (/insufficient|low balance|not enough/.test(raw))
    return "Not enough BMVCOINS. Enter a smaller amount.";
  if (/same mobile|self transfer|yourself/.test(raw))
    return "You cannot transfer coins to yourself.";
  if (/invalid amount|minimum amount/.test(raw))
    return "Enter a valid transfer amount.";
  if (status === 404) return "This mobile number is not registered.";
  if (status === 401 || status === 403) return "Your session has expired. Please log in again.";
  if (status === 400 || status === 422) return "Please check the mobile number and amount.";
  if (status === 429) return "Too many requests. Please try again shortly.";
  if (e.code === "ECONNABORTED" || e.code === "ERR_NETWORK" || !e.response)
    return "Transfer status is uncertain. Check your history before retrying.";
  return "Transfer could not be completed. Please try again.";
};

const TransferModal: React.FC<TransferModalProps> = ({ balance, senderMobile, onClose, onSuccess }) => {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState({ mobile: false, amount: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const submitted = useRef(false);

  const mobileError = validateMobile(mobile, senderMobile);
  const numericAmount = Number(amount);
  const amountError = !amount
    ? "Enter the amount to transfer."
    : !/^\d+(?:\.\d{1,2})?$/.test(amount) || !Number.isFinite(numericAmount) || numericAmount <= 0
    ? "Enter a valid amount greater than zero."
    : numericAmount > balance
    ? "Not enough BMVCOINS. Enter a smaller amount."
    : "";
  const valid = !mobileError && !amountError;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ mobile: true, amount: true });
    setError("");
    if (!valid || loading || submitted.current) return;
    submitted.current = true;
    setLoading(true);
    try {
      await axiosInstance.post(`${BASE_URL}/user-service/assetTransfer`, {
        from_mobile: senderMobile,
        to_mobile: mobile,
        amount: amount,
      }, { timeout: 20000 });
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(transferErrorMessage(err));
    } finally {
      submitted.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="transfer-title" className="w-full max-w-md max-h-[95dvh] sm:max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 rounded-xl bg-purple-100 p-2.5"><SendHorizontal className="h-5 w-5 text-purple-700" /></span>
            <h2 id="transfer-title" className="text-lg sm:text-xl font-bold text-gray-900">Transfer BMVCOINS</h2>
          </div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close transfer window" className="shrink-0 rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        {success ? (
          <div role="status" className="space-y-4 text-center py-5">
            <Check className="h-12 w-12 mx-auto rounded-full bg-green-100 p-2 text-green-700" />
            <h3 className="text-xl font-bold text-green-700">Transfer successful!</h3>
            <p className="text-sm text-gray-700">{amount} BMVCOINS sent to {mobile}.</p>
            <button type="button" onClick={onClose} className="w-full rounded-xl bg-purple-700 py-3 text-white font-semibold">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="recipientMobile" className="mb-1.5 block text-sm font-semibold text-gray-700">Recipient mobile number</label>
              <input id="recipientMobile" type="tel" inputMode="numeric" autoComplete="off" enterKeyHint="next"
                value={mobile} maxLength={10} placeholder="10-digit mobile number"
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                onBlur={() => setTouched((prev) => ({ ...prev, mobile: true }))}
                aria-invalid={touched.mobile && !!mobileError} aria-describedby="mobile-feedback"
                className={`block w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-200 ${touched.mobile && mobileError ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`} />
              <p id="mobile-feedback" aria-live="polite" className={`mt-1 text-xs ${touched.mobile && mobileError ? "text-red-600" : mobile.length === 10 && !mobileError ? "text-green-700" : "text-gray-500"}`}>
                {touched.mobile && mobileError ? mobileError : mobile.length === 10 && !mobileError ? "Mobile number format is valid." : "Enter a registered Indian mobile number."}
              </p>
            </div>
            <div>
              <div className="mb-1.5 flex flex-wrap justify-between gap-1 text-sm">
                <label htmlFor="transferAmount" className="font-semibold text-gray-700">Amount</label>
                <span className="text-gray-500">Available: {balance.toLocaleString("en-IN")} BMVCOINS</span>
              </div>
              <input id="transferAmount" type="text" inputMode="decimal" value={amount} placeholder="Enter coins"
                onChange={(e) => { setAmount(e.target.value.replace(/[^\d.]/g, "").slice(0, 16)); setError(""); }}
                onBlur={() => setTouched((prev) => ({ ...prev, amount: true }))}
                aria-invalid={touched.amount && !!amountError} aria-describedby="amount-feedback"
                className={`block w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-200 ${touched.amount && amountError ? "border-red-500" : "border-gray-300 focus:border-purple-500"}`} />
              {touched.amount && amountError && <p id="amount-feedback" role="alert" className="mt-1 text-xs text-red-600">{amountError}</p>}
            </div>
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">Transfers cannot be reversed. Confirm the recipient's number before sending.</p>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</div>}
            <button type="submit" disabled={loading || !valid} className="w-full min-h-12 rounded-xl bg-purple-700 px-4 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Processing..." : "Transfer BMVCOINS"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

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
  const [shouldFetchTransfers, setShouldFetchTransfers] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
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
  const modalRef = useRef<HTMLDivElement>(null);
  const transfersInitialized = useRef(false);

const formatIST = (dateString?: string) => {
  if (!dateString) return "—";

  try {
    // Parse the date string exactly as received from API
    const date = dayjs(dateString);
    if (!date.isValid()) return "—";
    return date.format("DD MMM YYYY");
  } catch (error) {
    console.error('Date parsing error:', error);
    return "—";
  }
};

  const getTransferDirection = (transfer: Transfer) => {
    const apiType = (transfer.type || "").toLowerCase();

    if (apiType === "debit") {
      return {
        isSent: true,
        label: "Debited",
        amountPrefix: "-",
        amountColor: "text-red-600",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        Icon: Minus,
        counterparty: transfer.rxMobileNumber || "Unknown",
      };
    }

    if (apiType === "credit") {
      return {
        isSent: false,
        label: "Credited",
        amountPrefix: "+",
        amountColor: "text-green-600",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        Icon: Plus,
        counterparty: transfer.txMobileNumber || "Unknown",
      };
    }

    const fallbackSent = transfer.txMobileNumber === userMobileNumber;

    return {
      isSent: fallbackSent,
      label: fallbackSent ? "Debited" : "Credited",
      amountPrefix: fallbackSent ? "-" : "+",
      amountColor: fallbackSent ? "text-red-600" : "text-green-600",
      iconBg: fallbackSent ? "bg-red-100" : "bg-green-100",
      iconColor: fallbackSent ? "text-red-600" : "text-green-600",
      Icon: fallbackSent ? Minus : Plus,
      counterparty: fallbackSent
        ? transfer.rxMobileNumber || "Unknown"
        : transfer.txMobileNumber || "Unknown",
    };
  };

  const sortTransfersByDate = (items: Transfer[]) => {
    return [...items].sort((a, b) => {
      const dateA = a.transferAt ? new Date(a.transferAt).getTime() : 0;
      const dateB = b.transferAt ? new Date(b.transferAt).getTime() : 0;
      return dateB - dateA;
    });
  };
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

    };

    if (showTransfersModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTransfersModal]);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

useEffect(() => {
  if (transfers.length > 0) {
    const filtered = transfers.filter((transfer) => {
      const apiType = (transfer.type || "").toLowerCase();
      const isSent =
        apiType === "debit"
          ? true
          : apiType === "credit"
            ? false
            : transfer.txMobileNumber === userMobileNumber;

      if (transferFilter === "sent") return isSent;
      if (transferFilter === "received") return !isSent;
      return true;
    });

    setFilteredTransfers(sortTransfersByDate(filtered));
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
      setProfileError(null);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const response = await axiosInstance.get(
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
        setProfileError("Unable to load your wallet. Please try again.");
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

      const response = await axiosInstance.get(`${BASE_URL}/user-service/bmvhistory`, {
        params: { mobileNumber: userMobileNumber },
        timeout: 15000,
        validateStatus: (status: number) =>
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
          setTransfers([]);
          setTransfersError(null);
        } else if (error.response?.status === 400) {
          setTransfersError("Unable to load transactions. Please try again.");
        } else if (error.response?.status >= 500) {
          setTransfersError("Server error. Please try again later.");
        } else {
          setTransfersError("Unable to load transactions. Please try again.");
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
  const meta = getTransferDirection(transfer);
  const isExpanded = expandedTxId === index;
  const IconComponent = meta.Icon;
  return (
    <div
      key={index}
      className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow"
    >
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => toggleExpand(index)}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className={`p-2.5 rounded-2xl ${meta.iconBg}`}>
            <IconComponent className={`h-5 w-5 ${meta.iconColor}`} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {meta.label}
            </p>

            <p className="text-sm text-gray-500 mt-0.5">
              {meta.isSent ? "To" : "From"} {meta.counterparty}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {formatIST(transfer.transferAt)}
            </p>

            {transfer.status && (
              <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {transfer.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className={`text-lg sm:text-xl font-bold ${meta.amountColor}`}>
              {meta.amountPrefix}
              {transfer.amountTransfer}
            </p>
            <p className="text-[11px] text-gray-400">BMVCOINS</p>
          </div>

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
              <p className="text-gray-500 mb-1">From Address</p>
              <p className="font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-xl">
                {transfer.txChainAddress || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">To Address</p>
              <p className="font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-xl">
                {transfer.rxChainAddress || "—"}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 min-w-0">
        {profileError && (
          <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{profileError}</span>
            <button type="button" onClick={() => void fetchUserData()} className="font-semibold underline">Retry</button>
          </div>
        )}
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
                    disabled={isLoading || !!profileError || !userMobileNumber || bmvCoin <= 0}
                    className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendHorizontal className="h-5 w-5" />
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
  {sortTransfersByDate(filteredTransfers)
    .slice(0, 3)
    .map((transfer, index) => {
      const meta = getTransferDirection(transfer);
      const IconComponent = meta.Icon;

      return (
        <div
          key={index}
          className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl ${meta.iconBg}`}>
              <IconComponent className={`h-5 w-5 ${meta.iconColor}`} />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {meta.label}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {meta.isSent ? "To" : "From"} {meta.counterparty}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatIST(transfer.transferAt)}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className={`text-lg font-bold ${meta.amountColor}`}>
              {meta.amountPrefix}
              {transfer.amountTransfer}
            </p>
            <p className="text-[11px] text-gray-400">BMVCOINS</p>
          </div>
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
      {showTransferModal && (
        <TransferModal
          balance={bmvCoin}
          senderMobile={userMobileNumber}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            void fetchUserData();
            void fetchTransfers();
          }}
        />
      )}
      {showTransfersModal && <TransfersModal />}
      {showFaqModal && <FAQModal />}
    </>
  );
};

export default MyCrypto;