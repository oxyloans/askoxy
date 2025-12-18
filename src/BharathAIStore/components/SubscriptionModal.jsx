import React, { useEffect, useState, useMemo } from "react";
import { Modal, Input } from "antd";
import axios from "axios";
import BASE_URL from "../../Config";
import { load } from "@cashfreepayments/cashfree-js";

/* =========================
   HELPERS
   ========================= */

// Normalize agent API response
const normalizeAgentsResponse = (resData) => {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.content)) return resData.content;
  if (Array.isArray(resData.assistants)) return resData.assistants;
  return [];
};

// Group subscription plans
const groupPlans = (apiPlans) => {
  const grouped = {};
  (apiPlans || []).forEach((item) => {
    if (!item.status) return;

    if (!grouped[item.plan]) {
      grouped[item.plan] = {
        name: item.plan,
        billingPlans: [],
      };
    }

    grouped[item.plan].billingPlans.push({
      id: item.id,
      type: item.planType,
      amount: item.planAmount,
      aiAgents: item.aiAgents || 0,
    });
  });

  return Object.values(grouped);
};

/* =========================
   COMPONENT
   ========================= */

const SubscriptionModal = ({
  open,
  onCancel,
  subscriptionPlans,
  agentId,
  userId,
}) => {
  const [cashfree, setCashfree] = useState(null);

  const [activeBillingPlanId, setActiveBillingPlanId] = useState(null);
  const [selectedBillingPlan, setSelectedBillingPlan] = useState(null);

  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);

  const [lastAssistantId, setLastAssistantId] = useState(null);
  const [hasMoreAgents, setHasMoreAgents] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); // 'PAID', 'FAILED', 'CANCEL'
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  /* =========================
     INIT CASHFREE & PAYMENT CALLBACK
     ========================= */
  useEffect(() => {
    load({ mode: "sandbox" }).then(setCashfree);
    
    // Check for payment success callback
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    if (orderId) {
      handlePaymentSuccess(orderId);
    }
  }, []);

  /* =========================
     PAYMENT SUCCESS HANDLER
     ========================= */
  const handlePaymentSuccess = async (orderId) => {
    try {
      // Verify payment status with backend
      const res = await axios.get(
        `${BASE_URL}/ai-service/cashFreePaymentCheck?orderId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );
      
      // Remove order_id from URL first
      const url = new URL(window.location.href);
      url.searchParams.delete('order_id');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      
      // Set payment status and show appropriate modal
      setPaymentOrderId(orderId);
      setPaymentStatus(res.data.order_status || 'FAILED');
      setPaymentMessage(res.data.message || '');
      onCancel(); // Close subscription modal
    } catch (err) {
      console.error('Payment verification failed:', err);
    }
  };

  const groupedPlans = groupPlans(subscriptionPlans);

  /* =========================
     FETCH AGENTS (APPROVED ONLY)
     ========================= */
  const fetchAgents = async (reset = false) => {
    if (loadingAgents) return;
    setLoadingAgents(true);

    try {
      const url =
        reset || !lastAssistantId
          ? `${BASE_URL}/ai-service/agent/getAllAssistants?limit=20`
          : `${BASE_URL}/ai-service/agent/getAllAssistants?limit=20&after=${lastAssistantId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });

      const list = normalizeAgentsResponse(res.data).filter(
        (agent) => agent.status === "APPROVED"
      );

      setAgents((prev) => (reset ? list : [...prev, ...list]));

      if (list.length > 0) {
        setLastAssistantId(res.lastId || list[list.length - 1].assistantId);
      }

      if (list.length < 20) {
        setHasMoreAgents(false);
      }
    } catch (err) {
      console.error("Failed to fetch agents", err);
    } finally {
      setLoadingAgents(false);
    }
  };

  /* =========================
     BILLING PLAN SELECT
     ========================= */
  const selectBillingPlan = (bp) => {
    setActiveBillingPlanId(bp.id);
    setSelectedBillingPlan(bp);
    setAgents([]);
    setSelectedAgents([]);
    setSearchText("");
    setLastAssistantId(null);
    setHasMoreAgents(true);
    fetchAgents(true);
  };

  /* =========================
     AGENT TOGGLE (FIXED)
     ========================= */
  const toggleAgent = (agent) => {
    const exists = selectedAgents.some(
      (a) => a.agentId === agent.agentId
    );

    if (exists) {
      setSelectedAgents((prev) =>
        prev.filter((a) => a.agentId !== agent.agentId)
      );
      return;
    }

    if (selectedAgents.length >= selectedBillingPlan.aiAgents) return;

    setSelectedAgents((prev) => [
      ...prev,
      { agentId: agent.agentId },
    ]);
  };

  /* =========================
     SEARCH API
     ========================= */
  const searchAgents = async (query) => {
    if (!query.trim()) return;
    
    try {
      const res = await axios.get(
        `https://meta.oxyloans.com/api/product-service/dynamicSearch?q=${encodeURIComponent(query)}`
      );
      
      // Filter only approved agents from search results
      const searchResults = (res.data.agents || []).filter(
        (agent) => agent.status === "APPROVED"
      );
      
      setAgents(searchResults);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  /* =========================
     SEARCH FILTER
     ========================= */
  const filteredAgents = useMemo(() => {
    if (!searchText) return agents;
    return agents.filter((a) =>
      a.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [agents, searchText]);

  /* =========================
     PAYMENT (BACKEND FORMAT)
     ========================= */
  const proceedToPayment = async () => {
    try {
      const currentURL = window.location.origin + window.location.pathname;
 
      const payload = {
        userId,
        planId: selectedBillingPlan.id,
        url: `${currentURL}?order_id={orderId}`,
        list: selectedAgents, // [{ agentId }]
      };

      const res = await axios.post(
        `${BASE_URL}/ai-service/customersPromptSubscription`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      if (cashfree && res.data.order_token) {
        cashfree.checkout({
          paymentSessionId: res.data.order_token,
          redirectTarget: "_self",
        });
      }
    } catch (err) {
      console.error("Payment initiation failed", err);
    }
  };

  /* =========================
     RENDER
     ========================= */

  return (
    <>
      {/* Payment Status Modals */}
      {/* Success Modal */}
      <Modal
        open={paymentStatus === 'PAID'}
        onCancel={() => setPaymentStatus(null)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4">
              <span className="text-4xl text-white">✅</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              🎉 Your subscription has been activated successfully!
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Order ID:</span> {paymentOrderId}
              </p>
              {paymentMessage && (
                <p className="text-sm text-gray-600 mt-2">{paymentMessage}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setPaymentStatus(null)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
          >
            🚀 Start Using Your Subscription
          </button>
        </div>
      </Modal>

      {/* Failed Modal */}
      <Modal
        open={paymentStatus === 'FAILED'}
        onCancel={() => setPaymentStatus(null)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mb-4">
              <span className="text-4xl text-white">❌</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Payment Failed!
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              😞 Sorry, your payment could not be processed.
            </p>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Order ID:</span> {paymentOrderId}
              </p>
              {paymentMessage && (
                <p className="text-sm text-red-600 mt-2 font-medium">{paymentMessage}</p>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setPaymentStatus(null);
                // Reopen subscription modal for retry
                setTimeout(() => window.location.reload(), 100);
              }}
              className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => setPaymentStatus(null)}
              className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        open={paymentStatus === 'CANCEL'}
        onCancel={() => setPaymentStatus(null)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
              <span className="text-4xl text-white">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              🚫 Your payment was cancelled or not completed.
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Order ID:</span> {paymentOrderId}
              </p>
              {paymentMessage && (
                <p className="text-sm text-orange-600 mt-2 font-medium">{paymentMessage}</p>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setPaymentStatus(null);
                setTimeout(() => window.location.reload(), 100);
              }}
              className="w-full px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              💳 Try Payment Again
            </button>
            <button
              onClick={() => setPaymentStatus(null)}
              className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Subscription Modal */}
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        centered
        width="95%"
        style={{ maxWidth: 1400 }}
      >
      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl">

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Choose Your Subscription Plan
          </h2>
          <p className="text-gray-700 text-lg">✨ Select a plan and pick your AI agents ✨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {groupedPlans.map((plan, index) => {
            const colors = [
              { bg: 'from-purple-500 to-pink-500', border: 'border-purple-200', accent: 'from-purple-400 to-pink-400' },
              { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-200', accent: 'from-blue-400 to-cyan-400' },
              { bg: 'from-green-500 to-emerald-500', border: 'border-green-200', accent: 'from-green-400 to-emerald-400' },
              { bg: 'from-orange-500 to-red-500', border: 'border-orange-200', accent: 'from-orange-400 to-red-400' },
              { bg: 'from-indigo-500 to-purple-500', border: 'border-indigo-200', accent: 'from-indigo-400 to-purple-400' }
            ];
            const color = colors[index % colors.length];
            
            return (
            <div key={plan.name} className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${color.border} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>

              <div className="text-center mb-6">
                {/* <div className={`inline-block p-3 bg-gradient-to-r ${color.bg} rounded-full mb-3`}>
                  <span className="text-2xl text-white font-bold">{plan.name.charAt(0)}</span>
                </div> */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className={`w-16 h-1 bg-gradient-to-r ${color.accent} mx-auto rounded-full`}></div>
              </div>

              <div className="space-y-3">
                {plan.billingPlans.map((bp) => (
                  <div key={bp.id}>
                    <button
                      onClick={() => selectBillingPlan(bp)}
                      className={`w-full flex justify-between items-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105
                        ${
                          activeBillingPlanId === bp.id
                            ? `bg-gradient-to-r ${color.bg} text-white shadow-lg ring-4 ring-opacity-30 ring-purple-300`
                            : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{bp.type.replace("_", " ")}</span>
                          {activeBillingPlanId === bp.id && <span className="text-yellow-300">⭐</span>}
                        </div>
                        <span className="text-sm opacity-75 flex items-center gap-1">
                          <span className="text-blue-500">🤖</span>
                          {bp.aiAgents} AI Agents
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">₹{bp.amount}</span>
                        {/* {bp.type.toLowerCase().includes('monthly') && (
                          <div className="text-xs opacity-75">per month</div>
                        )}
                        {bp.type.toLowerCase().includes('yearly') && (
                          <div className="text-xs opacity-75">per year</div>
                        )}
                        {bp.type.toLowerCase().includes('weekly') && (
                          <div className="text-xs opacity-75">per week</div>
                        )} */}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>

        {/* AGENT SELECTOR */}
        {selectedBillingPlan && (
          <div className="mt-8 bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl border-2 border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Select AI Agents
                  </h3>
                </div>
                <p className="text-gray-700 mt-1 flex items-center gap-2">
                  <span className="text-orange-500">🔥</span>
                  Choose {selectedBillingPlan.aiAgents} agents for your {selectedBillingPlan.type.replace("_", " ")} plan
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                <span className="mr-2">✅</span>
                {selectedAgents.length}/{selectedBillingPlan.aiAgents}
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Input
                  placeholder="🔍 Search approved agents..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (e.target.value.trim()) {
                      searchAgents(e.target.value);
                    } else {
                      fetchAgents(true);
                    }
                  }}
                  className="h-14 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 bg-gradient-to-r from-white to-purple-50 pl-12"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl">
                  🔍
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAgents.map((agent, index) => {
                const selected = selectedAgents.some(
                  (a) => a.agentId === agent.agentId
                );
                const disabled =
                  !selected &&
                  selectedAgents.length >= selectedBillingPlan.aiAgents;

                const agentColors = [
                  { bg: 'from-pink-400 to-rose-500', border: 'border-pink-300', selectedBg: 'from-pink-50 to-rose-50' },
                  { bg: 'from-blue-400 to-cyan-500', border: 'border-blue-300', selectedBg: 'from-blue-50 to-cyan-50' },
                  { bg: 'from-green-400 to-emerald-500', border: 'border-green-300', selectedBg: 'from-green-50 to-emerald-50' },
                  { bg: 'from-purple-400 to-violet-500', border: 'border-purple-300', selectedBg: 'from-purple-50 to-violet-50' },
                  { bg: 'from-orange-400 to-red-500', border: 'border-orange-300', selectedBg: 'from-orange-50 to-red-50' },
                  { bg: 'from-indigo-400 to-blue-500', border: 'border-indigo-300', selectedBg: 'from-indigo-50 to-blue-50' },
                  { bg: 'from-teal-400 to-green-500', border: 'border-teal-300', selectedBg: 'from-teal-50 to-green-50' },
                  { bg: 'from-yellow-400 to-orange-500', border: 'border-yellow-300', selectedBg: 'from-yellow-50 to-orange-50' }
                ];
                const agentColor = agentColors[index % agentColors.length];

                return (
                  <div
                    key={agent.agentId}
                    onClick={() =>
                      !disabled && toggleAgent(agent)
                    }
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 hover:rotate-1
                      ${
                        selected
                          ? `${agentColor.border} bg-gradient-to-br ${agentColor.selectedBg} shadow-xl ring-4 ring-opacity-30 ring-green-300`
                          : "border-gray-200 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
                      }
                      ${disabled && "opacity-40 cursor-not-allowed hover:scale-100 hover:rotate-0"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${agentColor.bg} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {agent.name?.charAt(0)?.toUpperCase() || '🤖'}
                      </div>
                      {selected && (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-gray-800 mb-1 truncate text-lg">
                      {agent.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <span className="text-blue-500">🤖</span>
                      AI Assistant
                    </div>
                    {selected && (
                      <div className="mt-2 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full text-center font-semibold">
                        ✨ Selected ✨
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {(hasMoreAgents || agents.length > 0) && (
              <div className="text-center my-8">
                <button
                  onClick={() => fetchAgents()}
                  disabled={loadingAgents}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-xl hover:shadow-2xl"
                >
                  {loadingAgents ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Loading more agents...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="animate-bounce">📥</span>
                      Load more agents
                      <span className="animate-bounce">🚀</span>
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-purple-200 to-pink-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-4">
                <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                  <span className="text-2xl">💰</span>
                  <span>Total Amount: ₹{selectedBillingPlan.amount}</span>
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <button
                disabled={selectedAgents.length !== selectedBillingPlan.aiAgents}
                onClick={proceedToPayment}
                className="w-full py-5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-2 border-green-300"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl animate-pulse">💳</span>
                  <span>Proceed to Payment</span>
                  <span className="text-2xl animate-pulse">🚀</span>
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
      </Modal>
    </>
  );
};

export default SubscriptionModal;