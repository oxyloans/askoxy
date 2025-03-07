import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Menu, X, Check, AlertCircle, Loader2, ArrowDownUp, Calendar, Clock, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { message, Modal, Tabs, Empty } from 'antd';
import decryptEas from './decryptEas';
import encryptEas from './encryptEas'; 
import { motion, AnimatePresence } from "framer-motion";
import  BASE_URL  from "../Config";
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
  planId : string;
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
}> = ({ plan, isSelected, onSubscribe, planDetails, Loading }) => (
  <div
    id={plan.planId}
    className={`relative rounded-xl border ${
      isSelected 
        ? 'border-purple-600 ring-2 ring-purple-600 ring-opacity-50' 
        : 'border-gray-200'
    } bg-white shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col h-full transform hover:-translate-y-1`}
  >
    <div className="p-6 flex-grow">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            ₹{plan.amount.toLocaleString()}
          </h2>
          <p className="text-lg font-medium text-purple-600">
            Wallet Balance: ₹{plan.getAmount.toLocaleString()}
          </p>
          <p className="text-gray-600">
            Monthly Usage Limit: ₹{plan.limitAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 pt-0">
      <button
        onClick={() => onSubscribe(plan.planId)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 
          ${isSelected || planDetails?.planId === plan.planId
            ? 'bg-purple-700 text-white shadow-lg cursor-not-allowed'
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } transform hover:scale-[1.02]`}
        disabled={isSelected || planDetails?.status || Loading[plan.planId]}
      >
        {Loading[plan.planId] ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Processing...
          </span>
        ) : isSelected ? 'Selected' : planDetails?.planId === plan.planId ? 'Subscribed' : 'Choose Plan'}
      </button>
    </div>
  </div>
);

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
    if(userData){
      setProfileData(JSON.parse(userData));
    }
  }, []);
  
  useEffect(() => {
    const trans = localStorage.getItem('merchantTransactionId');
    const paymentId = localStorage.getItem('paymentId');
    if(trans === subscriptionId){
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

  const handleSubscribe = async(planId: string, amount: number) => {
    setSelectedPlan(planId);
    setLoading((prev) => ({
      ...prev,
      [planId]: true
    }));
    setIsLoading(true);
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
      
      if(response.data.paymentId){
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
          ru: `https://sandbox.askoxy.ai/main/subscription?trans=${response.data.paymentId}`,
          callbackUrl: `https://sandbox.askoxy.ai/main/subscription?trans=${response.data.paymentId}`,
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
    } catch(error) {
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
                  if (data.paymentStatus === "SUCCESS") {
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
              Subscribe & Save Upto ₹500 – Hassle-Free Fresh Rice Delivery!
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