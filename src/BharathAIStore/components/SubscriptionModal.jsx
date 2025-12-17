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

  /* =========================
     INIT CASHFREE
     ========================= */
  useEffect(() => {
    load({ mode: "sandbox" }).then(setCashfree);
  }, []);

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
        setLastAssistantId(list[list.length - 1].agentId);
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
    const currentURL = window.location.origin + window.location.pathname;

    const payload = {
      agentId,
      userId,
      planId: selectedBillingPlan.id,
      paymentId: "",
      status: "INITIATED",
      url: `${currentURL}?order_id={orderId}`,
      list: selectedAgents, // [{ agentId }]
    };

    const res = await axios.post(
      `${BASE_URL}/ai-service/customersPromptSubscription1`,
      payload
    );

    cashfree.checkout({
      paymentSessionId: res.data.order_token,
      redirectTarget: "_self",
    });
  };

  /* =========================
     RENDER
     ========================= */

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: 1200 }}
    >
      <div className="p-8 bg-slate-50 rounded-xl">

        <h2 className="text-3xl font-bold text-center mb-8">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedPlans.map((plan) => (
            <div key={plan.name} className="bg-white p-6 rounded-xl shadow">

              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

              {plan.billingPlans.map((bp) => (
                <div key={bp.id} className="mb-4">

                  {/* Billing Plan */}
                  <button
                    onClick={() => selectBillingPlan(bp)}
                    className={`w-full flex justify-between px-4 py-3 rounded-lg
                      ${
                        activeBillingPlanId === bp.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                  >
                    <span>{bp.type.replace("_", " ")}</span>
                    <span>₹{bp.amount}</span>
                  </button>

                  {/* AGENT SELECTOR (ONLY HERE) */}
                  {activeBillingPlanId === bp.id && (
                    <div className="mt-4 border rounded-lg p-4 bg-gray-50">

                      <div className="flex justify-between mb-3">
                        <strong>Select Agents</strong>
                        <span>
                          {selectedAgents.length}/{bp.aiAgents}
                        </span>
                      </div>

                      <Input
                        placeholder="Search approved agents..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="mb-3"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredAgents.map((agent) => {
                          const selected = selectedAgents.some(
                            (a) => a.agentId === agent.agentId
                          );
                          const disabled =
                            !selected &&
                            selectedAgents.length >= bp.aiAgents;

                          return (
                            <div
                              key={agent.agentId}
                              onClick={() =>
                                !disabled && toggleAgent(agent)
                              }
                              className={`p-3 border rounded cursor-pointer transition
                                ${
                                  selected
                                    ? "border-indigo-600 bg-indigo-100"
                                    : "border-gray-300"
                                }
                                ${disabled && "opacity-40 cursor-not-allowed"}
                              `}
                            >
                              <div className="font-semibold">
                                {agent.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                AI Assistant
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {hasMoreAgents && (
                        <button
                          onClick={() => fetchAgents()}
                          disabled={loadingAgents}
                          className="mt-3 text-sm text-indigo-600 disabled:opacity-50"
                        >
                          {loadingAgents ? "Loading..." : "Load more"}
                        </button>
                      )}

                      <button
                        disabled={selectedAgents.length !== bp.aiAgents}
                        onClick={proceedToPayment}
                        className="mt-4 w-full py-3 bg-green-600 text-white rounded disabled:opacity-50"
                      >
                        Proceed to Payment
                      </button>

                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
