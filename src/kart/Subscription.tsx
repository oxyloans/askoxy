import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import {
  Menu,
  X,
  Check,
  AlertCircle,
  Loader2,
  HelpCircle,
  RefreshCw,
  ArrowDownCircle, ArrowDownUp,
  CheckCircle,
  Zap,
  Calendar,
  Clock, Lock,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { message, Modal, Tabs, Empty } from 'antd';
import decryptEas from './decryptEas';
import encryptEas from './encryptEas';
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../Config";
import { log } from "node:console";

// Types
type SubscriptionPlan = {
  amount: number;
  getAmount: number;
  limitAmount: number;
  planId: string;
  status: boolean;
};

interface UserSubscriptionPlan {
  subscriptionId: string;
  status: boolean;
  message: string;
  planId: string;
}

interface SubscriptionHistoryItem {
  id: string;
  planId: string;
  customerId: string;
  amount: number;
  getAmount: number;
  limitAmount: number;
  active: boolean;
  payAmount: number;
  createdAt: string;
  paymentStatus: string;
  planName?: string;
}

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

interface ProfileData {
  userFirstName: string;
  userLastName: string;
  customerEmail: string;
}

interface TabPaneProps {
  tab: string;
  key: string;
  children: React.ReactNode;
}

// Components
const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const baseStyles = "rounded-lg p-4 flex items-start gap-3 shadow-sm";
  const variantStyles = variant === 'destructive'
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-purple-50 text-purple-700 border border-purple-200';

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <div className="text-sm font-medium">{children}</div>
);

const TabPane: React.FC<TabPaneProps> = ({ children }) => <>{children}</>;

const SubscriptionCard: React.FC<{
  plan: SubscriptionPlan;
  isSelected: boolean;
  planDetails: UserSubscriptionPlan;
  Loading: { [key: string]: boolean };
  onSubscribe: (planId: string) => void;
}> = ({ plan, isSelected, onSubscribe, planDetails, Loading }) => {
  // State for FAQ modal
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Calculate bonus amount
  const bonusAmount = plan.getAmount - plan.amount;
  const isPremiumPlan = plan.amount === 99000;

  // Get plan name based on amount
  const getPlanName = (amount: number) => {
    switch (amount) {
      case 10000: return "Starter Plan";
      case 20000: return "Basic Plan";
      case 30000: return "Silver Plan";
      case 40000: return "Gold Plan";
      case 50000: return "Platinum Plan";
      case 60000: return "Diamond Plan";
      case 70000: return "Elite Plan";
      case 90000: return "Ultra Plan";
      case 99000: return "Premium Plan";
      default: return isPremiumPlan ? "Premium Plan" : "Standard Plan";
    }
  };

  // Premium plan FAQ data
  const premiumFaqs = [

    {
      question: "Can I use both my advance and wallet balance for purchases?",
      answer: "Yes, you can use both your advance and wallet balance for purchases."
    },
    {
      question: "What if I withdraw on the 40th day?",
      answer: "You will receive the wallet amount in proportion to the days completed. For example, if you withdraw after 40 days, you will receive ₹2,667 (₹2,000 for the first 30 days + ₹667 for the extra 10 days)."
    },
    {
      question: "What happens if I withdraw my advance before 30 days?",
      answer: "No, you cannot withdraw within the first 30 days as the lock period is not completed.",
    },
    {
      question: "Is there a limit on how many times I can withdraw my advance?",
      answer: "No, you can withdraw your full advance anytime, but your wallet earnings will be added only for the completed days."
    },
    {
      question: "Will I keep earning ₹2,000 every month indefinitely?",
      answer: "You will receive ₹2,000 every month as long as the ₹99,000 advance remains in your account and the 30-day period is completed."
    },
    {
      question: "Can I add more advance later to increase my earnings?",
      answer: "Currently, the earnings are based on a fixed advance of ₹99,000. Any changes will be communicated in the future."
    },
    {
      question: "Will my wallet balance expire if I don't use it?",
      answer: "No, your wallet balance will not expire. It will accumulate indefinitely month after month."
    },
    {
      question: "Can I withdraw my wallet balance instead of using it for purchases?",
      answer: "No, the wallet balance can only be used for purchases and cannot be withdrawn."
    }
  ];

  return (
    <>
      <div
        id={plan.planId}
        className={`relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full ${isPremiumPlan ? "bg-purple-50" : "bg-white"
          } ${isSelected
            ? "border-2 border-purple-500 shadow-lg"
            : "border border-gray-200 hover:border-purple-300 hover:shadow-md"
          }`}
      >
        {/* Enhanced top accent - taller for premium */}
        <div className={`w-full ${isPremiumPlan ? "h-2 bg-gradient-to-r from-purple-500 to-purple-700" : "h-1 bg-purple-500"}`}></div>

        {/* Popular badge for premium plan */}
        {isPremiumPlan && (
          <div className="absolute top-0 right-0">
            <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
              BEST VALUE
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="p-4 sm:p-5 flex-grow">
          {/* Plan Title */}
          <div className="text-center mb-4">
            <h3 className={`text-lg font-bold ${isPremiumPlan ? "text-purple-800" : "text-purple-600"}`}>
              {getPlanName(plan.amount)}
            </h3>
            <div className={`h-px w-16 ${isPremiumPlan ? "bg-purple-400" : "bg-purple-300"} mx-auto mt-2`}></div>
          </div>

          {/* Pay Amount Section */}
          <div className="mb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isPremiumPlan ? "text-purple-700" : "text-gray-600"}`}>Pay</span>
              <span className={`text-xl font-bold ${isPremiumPlan ? "text-purple-800" : "text-gray-800"}`}>
                ₹{plan.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Get Wallet Balance */}
          <div className={`mb-4 p-3 rounded border ${isPremiumPlan
            ? "bg-purple-100 border-purple-200 shadow-sm"
            : "bg-gray-50 border-gray-200"
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isPremiumPlan ? "text-purple-700" : "text-purple-600"}`}>Get in your wallet</span>
              <span className={`text-xl font-bold ${isPremiumPlan ? "text-purple-700" : "text-purple-600"}`}>
                ₹{plan.getAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              {bonusAmount > 0 && (
                <span className={`
      text-sm font-bold
      ${isPremiumPlan ? "text-green-700" : "text-green-600"}
      bg-gradient-to-r from-green-50 to-green-100
      px-3 py-1
      rounded-full
      shadow-sm
      hover:shadow-md transition-shadow duration-300
      border border-green-200
      flex items-center
      transform hover:scale-105 transition-transform duration-300
    `}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L10 9.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
                  </svg>
                  +₹{bonusAmount.toLocaleString()} bonus
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4 className={`text-sm font-bold ${isPremiumPlan ? "text-purple-800" : "text-gray-700"} mb-2`}>Benefits</h4>
            <ul className="space-y-2">
              {/* Monthly Usage Limit - Only for non-premium plans */}
              {/* {!isPremiumPlan && (
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5">
                    <CheckCircle size={16} />
                  </div>
                  <span className="ml-2 text-sm font-bold text-gray-600">
                    ₹{plan.limitAmount.toLocaleString()} Monthly usage limit
                  </span>
                </li>
              )} */}

              {/* Plan-specific features */}
              {isPremiumPlan ? (
                <>
                  {/* <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">
                      <RefreshCw size={16} />
                    </div>
                    <div className="ml-2">
                      <span className="text-sm font-bold text-purple-700">
                        ₹2,000 added after 30 days
                      </span>
                    </div>
                  </li> */}
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">
                      <Lock size={16} />
                    </div>
                    <div className="ml-2">
                      <span className="text-sm font-bold text-purple-700">
                        Minimum Lock Period: 30 days for first withdrawal; then withdraw ₹99,000 anytime
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">
                      <ArrowDownCircle size={16} />
                    </div>
                    <div className="ml-2">
                      <span className="text-sm font-bold text-purple-700">
                        Monthly Added: ₹2,000 to your wallet
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-600 mt-0.5">
                      <Zap size={16} />
                    </div>
                    <div className="ml-2">
                      <span className="text-sm font-bold text-purple-700">
                        Instant wallet credit
                      </span>
                    </div>
                  </li>

                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5">
                      <Zap size={16} />
                    </div>
                    <span className="ml-2 text-sm font-bold text-gray-600">
                      Instant wallet credit
                    </span>
                  </li>
                  {/* New Tenure Feature for non-premium plans */}
                  {/* <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5">
                      <Calendar size={16} />
                    </div>
                    <span className="ml-2 text-sm font-bold text-gray-600">
                      {Math.ceil((plan.getAmount - plan.limitAmount) / plan.limitAmount)} months tenure with unused balance carry forward
                    </span>
                  </li> */}
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-purple-500 rounded-full p-1">
            <CheckCircle size={14} className="text-white" />
          </div>
        )}

        {/* Button section */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
          {isPremiumPlan && (
            <button
              onClick={() => setShowFaqModal(true)}
              className="w-full mb-2 py-1.5 px-3 rounded text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              <span className="flex items-center justify-center">
                <HelpCircle size={12} className="mr-1" />
                FAQS
              </span>
            </button>
          )}

          <button
            onClick={() => onSubscribe(plan.planId)}
            className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors
              ${isSelected || planDetails?.planId === plan.planId
                ? isPremiumPlan
                  ? "bg-purple-700 text-white hover:bg-purple-800 shadow-md"
                  : "bg-purple-600 text-white hover:bg-purple-700"
                : isPremiumPlan
                  ? "bg-white border border-purple-600 text-purple-700 hover:bg-purple-50"
                  : "bg-white border border-purple-500 text-purple-600 hover:bg-purple-50"
              }`}
            disabled={isSelected || planDetails?.status || Loading[plan.planId]}
          >
            {Loading[plan.planId] ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span>Processing...</span>
              </span>
            ) : isSelected ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Selected</span>
              </span>
            ) : planDetails?.planId === plan.planId ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Current Plan</span>
              </span>
            ) : (
              <span>{isPremiumPlan ? "Get Premium" : "Choose Plan"}</span>
            )}
          </button>
        </div>
      </div>

      {/* FAQ Modal */}
      {showFaqModal && isPremiumPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-bold text-purple-800">Premium Plan - Frequently Asked Questions</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowFaqModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {premiumFaqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">{index + 1}. {faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TransactionHistoryCard: React.FC<{ transaction: SubscriptionHistoryItem }> = ({ transaction }) => {
  const statusColor = {
    SUCCESS: 'bg-green-100 text-green-800',
    FAILURE: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  }[transaction.paymentStatus] || 'bg-gray-100 text-gray-800';

  // Check the full transaction and its createdAt field
  console.log("Transaction createdAt:", transaction.createdAt);

  const formatDate = (timestamp?: any) => {
    if (!timestamp) {
      console.error("Timestamp is undefined or null");
      return "Invalid Date";
    }

    const parsedTimestamp = Number(timestamp);

    if (isNaN(parsedTimestamp)) {
      console.error("Invalid timestamp:", timestamp);
      return "Invalid Date";
    }

    return new Date(parsedTimestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // AM/PM format
    });
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Plan Amount: ₹{transaction.amount.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500">
                Wallet Balance: ₹{transaction.getAmount.toLocaleString()} |
                Usage Limit: ₹{transaction.limitAmount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {transaction.paymentStatus}
          </span>
          <p className="text-sm text-gray-600">Transaction ID: {transaction.id.slice(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
};

const SubscriptionHistorySkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div key={item} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="flex animate-pulse items-center gap-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const Subscription: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [plandetails, setPlanDetails] = useState<UserSubscriptionPlan>();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    userFirstName: '',
    userLastName: '',
    customerEmail: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("1");

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    getPlans();
    userPlanDetails();
    getSubscriptionHistory();

    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    const subscriptionID = params.trans;
    setSubscriptionId(subscriptionID);

    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
    const userData = localStorage.getItem('profileData');
    if (userData) {
      setProfileData(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const trans = localStorage.getItem('merchantTransactionId');
    const paymentId = localStorage.getItem('paymentId');
    if (trans === subscriptionId) {
      Requery(paymentId);
    }
  }, [subscriptionId]);





  const getSubscriptionHistory = async () => {
    if (!userId) return;

    setIsHistoryLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/order-service/getallsubscriptionsforacustomer?customerId=${userId}`,
        {

        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (Array.isArray(response.data)) {
        // Sort by transaction date (newest first)
        const sortedHistory = response.data
          .filter(item => item.transcationDate && !isNaN(item.transcationDate)) // Filter invalid dates
          .sort((a, b) => b.transcationDate - a.transcationDate);
        setSubscriptionHistory(sortedHistory);
      } else {
        setSubscriptionHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch subscription history:', error);
      message.error('Failed to load subscription history');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleSubscribe = async (planId: string, amount: number) => {
    setSelectedPlan(planId);
    setLoading((prev) => ({
      ...prev,
      [planId]: true
    }));
    setIsLoading(true);
    // Track plan selection
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "select_subscription_plan", {
        plan_id: planId,
        value: amount,
        currency: "INR"
      });
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/order-service/userSubscriptionAmount`,
        {
          planId,
          customerId: localStorage.getItem('userId'),
          amount
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (response.data.paymentId) {
        const number = localStorage.getItem('whatsappNumber');
        const withoutCountryCode = number?.replace("+91", "");

        const data = {
          mid: "1152305",
          amount: amount,
          // amount: 1,
          merchantTransactionId: response.data.paymentId,
          transactionDate: new Date(),
          terminalId: "getepay.merchant128638@icici",
          udf1: withoutCountryCode,
          udf2: `${profileData.userFirstName}  ${profileData.userLastName}`,
          udf3: profileData.customerEmail,
          udf4: "",
          udf5: "",
          udf6: "",
          udf7: "",
          udf8: "",
          udf9: "",
          udf10: "",
          ru: `https://www.askoxy.ai/main/subscription?trans=${response.data.paymentId}`,
          callbackUrl: `https://www.askoxy.ai/main/subscription?trans=${response.data.paymentId}`,
          currency: "INR",
          paymentMode: "ALL",
          bankId: "",
          txnType: "single",
          productType: "IPG",
          txnNote: "Subscription In Live",
          vpa: "getepay.merchant128638@icici",
        };

        // Initiate payment
        getepayPortal(data);
      }
    } catch (error) {
      console.log(error);
      setLoading((prev) => ({
        ...prev,
        [planId]: false
      }));
      setIsLoading(false);
      setSelectedPlan(null);
      message.error('Failed to initiate subscription');
    }
  };

  const getepayPortal = async (data: any) => {
    const JsonData = JSON.stringify(data);
    const mer = data.merchantTransactionId;

    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });

    try {
      const response = await fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      const result = await response.text();
      var resultobj = JSON.parse(result);
      var responseurl = resultobj.response;
      var data = decryptEas(responseurl);
      data = JSON.parse(data);

      localStorage.setItem("paymentId", data.paymentId);
      localStorage.setItem("merchantTransactionId", mer);
      const paymentUrl = data.paymentUrl;

      Modal.confirm({
        title: "Proceed to Payment?",
        content: "Click Yes to continue to the payment gateway.",
        okText: "Yes",
        cancelText: "No",
        onOk() {
          window.location.href = paymentUrl;
        },
        onCancel() {
          setSelectedPlan(null);
          setLoading((prev) => ({
            ...prev,
            [selectedPlan as string]: false
          }));
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.log("getepayPortal error:", error);
      setLoading((prev) => ({
        ...prev,
        [selectedPlan as string]: false
      }));
      setIsLoading(false);
      message.error('Payment processing failed');
    }
  };

  function Requery(paymentId: any) {
    setLoading((prev) => ({
      ...prev,
      [selectedPlan as string]: true
    }));
    setIsLoading(true);

    if (paymentStatus === "PENDING" || paymentStatus === "" || paymentStatus === null) {
      const Config = {
        "Getepay Mid": 1152305,
        "Getepay Terminal Id": "getepay.merchant128638@icici",
        "Getepay Key": "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": "L8Q+DeKb+IL65ghKXP1spg==",
      };

      const JsonData = {
        mid: Config["Getepay Mid"],
        paymentId: parseInt(paymentId),
        referenceNo: "",
        status: "",
        terminalId: Config["Getepay Terminal Id"],
        vpa: "",
      };

      var ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );

      var newCipher = ciphertext.toUpperCase();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      var raw = JSON.stringify({
        mid: Config["Getepay Mid"],
        terminalId: Config["Getepay Terminal Id"],
        req: newCipher,
      });

      fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      )
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            var responseurl = resultobj.response;
            var data = decryptEas(responseurl);
            data = JSON.parse(data);

            setPaymentStatus(data.paymentStatus);

            if (data.paymentStatus == "SUCCESS" || data.paymentStatus == "FAILURE") {
              axios({
                method: "POST",
                url: `${BASE_URL}/order-service/userSubscriptionAmount`,
                data: {
                  paymentId: localStorage.getItem('merchantTransactionId'),
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((secondResponse) => {
                  // Inside the Requery function where payment is successful
                  if (data.paymentStatus === "SUCCESS") {
                    // Track successful subscription
                    if (typeof window !== "undefined" && window.gtag) {
                      // Find the selected plan to get its amount
                      const selectedPlanData = subscriptionPlans.find(plan => plan.planId === selectedPlan);

                      window.gtag("event", "subscription_complete", {
                        transaction_id: localStorage.getItem('merchantTransactionId'),
                        value: selectedPlanData ? selectedPlanData.amount : 0,
                        currency: "INR",
                        payment_type: "online"
                      });
                    }

                    Modal.success({
                      content: "Subscription Added Successfully",
                      onOk: () => {
                        navigate("/main/wallet");
                      },
                    });
                  } else {
                    Modal.error({
                      content: "Payment was not successful. Please try again.",
                      onOk: () => {
                        // Refresh page or reset state
                        window.location.reload();
                      },
                    });
                  }

                  // Refresh subscription history
                  getSubscriptionHistory();
                  setIsLoading(false);
                  localStorage.removeItem('paymentId');
                  localStorage.removeItem('merchantTransactionId');
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                  setIsLoading(false);
                  message.error('Failed to confirm payment');
                });
            }
          }
        })
        .catch((error) => {
          console.log("Payment Status error:", error);
          setIsLoading(false);
        });
    }
  }

  const getPlans = async () => {
    try {
      const response = await axios.get<SubscriptionPlan[]>(`${BASE_URL}/order-service/getAllPlans`);
      const sortedData = response.data.sort((a, b) => a.amount - b.amount);
      setSubscriptionPlans(sortedData);
      // Track view subscription plans
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "view_subscription_plans", {
          plan_count: sortedData.length,
          currency: "INR"
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      message.error('Failed to load subscription plans');
    }
  };

  const userPlanDetails = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/order-service/getSubscriptionsDetailsForaCustomer`,
        {
          customerId: localStorage.getItem('userId'),
          active: true
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      setPlanDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch user subscription details:', error);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // Refresh subscription history when switching to history tab
    if (key === "2") {
      getSubscriptionHistory();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Perfect Plan
              </h1>
              <p className="text-lg text-gray-600">
                Subscribe & Save Up to Minimum ₹900 – Maximum ₹8,100 – Hassle-Free Fresh Rice Delivery!
              </p>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              className="mb-6"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Available Plans
                    </span>
                  ),
                  children: (
                    <>
                      {plandetails?.status && (
                        <Alert variant="destructive" className="mb-8">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <AlertDescription>
                            You already have an active subscription. Please complete your current subscription before choosing a new plan.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {subscriptionPlans.map((plan) => (
                          plan.status && (
                            <SubscriptionCard
                              key={plan.planId}
                              plan={plan}
                              isSelected={selectedPlan === plan.planId}
                              onSubscribe={() => handleSubscribe(plan.planId, plan.amount)}
                              Loading={loading}
                              planDetails={plandetails || {} as UserSubscriptionPlan}
                            />
                          )
                        ))}
                      </div>
                    </>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span className="flex items-center gap-2">
                      <ArrowDownUp size={20} />
                      Transaction History
                    </span>
                  ),
                  children: (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Your Subscription History</h2>
                        <button
                          onClick={getSubscriptionHistory}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <Loader2 className={`h-4 w-4 ${isHistoryLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>

                      {isHistoryLoading ? (
                        <SubscriptionHistorySkeleton />
                      ) : subscriptionHistory.length > 0 ? (
                        <div className="space-y-4">
                          {subscriptionHistory.map((transaction) => (
                            <TransactionHistoryCard
                              key={transaction.id}
                              transaction={transaction}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8">
                          <Empty
                            description="No subscription history found"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;