import React,{useEffect} from 'react';
import { Modal } from 'antd';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../Config';
import PaymentSuccessModal from './PaymentSuccessModal';
import { load } from "@cashfreepayments/cashfree-js";

const SubscriptionModal = ({
  open,
  onCancel,
  subscriptionPlans,
  loadingPlans,
  agentId,
  userId,
}) => {

  const [paymentSessionId, setPaymentSessionId] = React.useState(null);
  const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = React.useState(false);


  let cashfree;
   var initializeSDK = async function () {
      cashfree = await load({
        mode: "sandbox",
      });
    };

    useEffect(() => {
    initializeSDK();
    }, [paymentSessionId]);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSessionId = urlParams.get("order_id");
      setPaymentSessionId(paymentSessionId);
      if (paymentSessionId) {
          axios.get(`${BASE_URL}/ai-service/cashFreePaymetStatus?orderId=${paymentSessionId}`,{
            "headers": {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('accessToken')|| ""}`
           }
          })
            .then((response) => {
              console.log("Payment successful:", response.data.payment_status);
              // alert("Payment successful!");
              if(response.data.payment_status === "SUCCESS"){
              setPaymentSuccessModalOpen(true);
              }
            })
            .catch((error) => {
              console.error("Error processing payment:", error);
            });
      }
    
    }, []);
    
  const paymentHandler = (planId) => {
    const currentURL = window.location.origin + window.location.pathname;
    alert(currentURL);
     
    const requestBody = {
      "agentId": agentId,
      "planId": planId,
      "url": currentURL+"?order_id={orderId}",
      "userId": userId
    }
    axios.post(`${BASE_URL}/ai-service/customersPromptSubscription`, requestBody)
      .then(response => {
        const { url } = response.data;
        setPaymentSessionId(response.data.order_token);
         let checkoutOptions = {
      paymentSessionId:response.data.order_token ,
      redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);
      })
      .catch(error => {
        console.error('Error creating payment:', error);
      });
  }

  return (
    <>
    <Modal
      open={open}
       closable={{ closeIcon: <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold cursor-pointer">&times;</span> }}
      onCancel={onCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: '1100px',top: 20, }}
      centered
      title={""}
      className="no-border-modal"
     styles={{
    content: { border: "none", padding: 0, background: "transparent",borderRadius: '25px' },
    header: { display: "none" },
    }}
     
    >
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10 md:p-12 mb-10 relative border-none outline-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"></div>
        <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Choose Your Plan</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Unlock unlimited AI conversations and premium features</p>
        </div>
        
        {loadingPlans ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm text-gray-500">Loading plans...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {subscriptionPlans.map((plan, index) => {
              const isRecommended = index === 1;
              const planTypeFormatted = plan.planType.toLowerCase().replace('_', ' ');
              
              return (
                <div 
                  key={plan.id}
                  className={`relative backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isRecommended 
                      ? 'shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-800 dark:via-indigo-900/10 dark:to-purple-900/10' 
                      : 'shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 md:p-6">
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        isRecommended 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <span className={`text-2xl font-bold ${
                          isRecommended ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {planTypeFormatted.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-2">
                        {planTypeFormatted}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{plan.planAmount}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">/{planTypeFormatted.split(' ')[0]}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Unlimited AI conversations</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Advanced AI models</span>
                      </div>
                      {isRecommended && (
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Exclusive features</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => paymentHandler(plan.id)}
                      className={`group w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                        isRecommended 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white hover:from-indigo-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:shadow-lg'
                      }`}
                    >
                      <span className="relative z-10">{isRecommended ? 'Get Started' : 'Select Plan'}</span>
                      {isRecommended && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {subscriptionPlans.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No subscription plans available at the moment.</p>
              </div>
            )}
          </div>
        )}
        
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30-day money-back guarantee
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <PaymentSuccessModal
      open={paymentSuccessModalOpen}
      onClose={() => setPaymentSuccessModalOpen(false)}
    />
    </>
  );
};

export default SubscriptionModal;