import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Types
interface Order {
  orderId: string;
  userId: string;
  customerName: string;
  agreementServiceName: string;
  mobileNumber: string;
  address: string;
  price?: number;
  createdAt: string;
  status: string;
}

interface UserData {
  accessToken: string;
  userId: string;
}

interface UserProfile {
  firstName: string;
  whatsappNumber?: string;
  lastName?: string;
}

interface ReduxState {
  counter: UserData;
}

const BASE_URL = "https://meta.oxyloans.com/api/"; // Base URL for API

const ServiceDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const navigate = useNavigate();

  // Profile states
  const [profileLoading, setProfileLoading] = useState(true);

  // Get userId from localStorage (this should be partnerId for this API)
  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const token = typeof window !== 'undefined' ? (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  ) : null;
  const customerId = typeof window !== 'undefined' ? (
    localStorage.getItem("customerId") ||
    localStorage.getItem("userId") ||
    userId
  ) : null;

  // API URLs
  const getOrdersApiUrl = (userId: string) => {
    return `${BASE_URL}order-service/partner/${userId}`;
  };

  // Order Action API URLs
  const getApproveOrderApiUrl = () => {
    return `${BASE_URL}order-service/CACSApproved`;
  };

  const getRejectOrderApiUrl = () => {
    return `${BASE_URL}order-service/CACSReject`;
  };

  // Get Profile API
  const getProfile = async (): Promise<UserProfile | null> => {
    if (!customerId || !token) {
      setProfileLoading(false);
      return null;
    }

    setProfileLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: `${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to fetch profile. Please try again.");
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Check if profile is complete - Check firstName
  const isProfileComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;

  const firstName = profile.firstName;
  const hasFirstName = Boolean(firstName && firstName.trim().length > 0);

  // const whatsappNumber = profile.whatsappNumber;
  // const hasWhatsappNumber = Boolean(whatsappNumber && whatsappNumber.trim().length > 0);

  console.log("Checking firstName:", firstName, "Valid:", hasFirstName);
  // console.log("Checking whatsappNumber:", whatsappNumber, "Valid:", hasWhatsappNumber);

  return hasFirstName ;
}
  // Handle profile check and navigation
  const handleProfileCheck = async () => {
    const profile = await getProfile();

    if (profile && isProfileComplete(profile)) {
      console.log("Profile is complete, showing dashboard");
      fetchOrders(); // Fetch orders only if profile is complete
    } else {
      console.log("Profile incomplete, navigating to Profile screen");
      const proceed = window.confirm(
        "Profile Incomplete. Please complete your profile to access the dashboard. Click OK to go to Profile."
      );
      if (proceed) {
        navigate("/main/profile");
      }
    }
  };

  // Fetch orders data for the partner
  const fetchOrders = async () => {
    if (!userId) {
      alert("User ID not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(getOrdersApiUrl(userId));
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch order data. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Approve Order API call
  const approveOrder = async (orderId: string) => {
    try {
      setProcessingOrderId(orderId);

      const requestBody = {
        cacsOrderId: orderId,
      };

      const response = await axios.post(getApproveOrderApiUrl(), requestBody, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.data && response.data.status === "CA_APPROVED") {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "CA_APPROVED" }
              : order
          )
        );

        alert("Order approved successfully!");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error approving order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to approve order. Please try again."
      );
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Reject Order API call
  const rejectOrder = async (orderId: string, notes = "") => {
    try {
      setProcessingOrderId(orderId);

      const requestBody = {
        cacsOrderId: orderId,
        ...(notes.trim() && { additionalNotes: notes.trim() }),
      };

      const response = await axios.post(getRejectOrderApiUrl(), requestBody, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.data && response.data.status === "CA_REJECTED") {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "CA_REJECTED" }
              : order
          )
        );

        alert("Order rejected successfully!");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error rejecting order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to reject order. Please try again."
      );
    } finally {
      setProcessingOrderId(null);
      setRejectModalVisible(false);
      setSelectedOrderId(null);
      setAdditionalNotes("");
    }
  };

  // Handle approve button press
  const handleApprove = (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this order?"
    );
    if (confirmed) {
      approveOrder(orderId);
    }
  };

  // Handle reject button press
  const handleReject = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRejectModalVisible(true);
  };

  // Submit rejection with notes
  const submitRejection = () => {
    if (selectedOrderId) {
      rejectOrder(selectedOrderId, additionalNotes);
    }
  };

  // Pull to refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Check profile and fetch orders when component mounts
  useEffect(() => {
    if (userId && token) {
      handleProfileCheck();
    }
  }, [userId, token]);

  // Helper function to get last 4 digits of userId
  const getLastFourDigits = (userIdParam: string): string => {
    return userIdParam ? userIdParam.slice(-4) : "N/A";
  };

  // Helper function to format mobile number (show last 4 digits)
  const formatMobileNumber = (mobile: string): string => {
    if (!mobile) return "N/A";
    return `****${mobile.slice(-4)}`;
  };

  // Helper function to format created date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Helper function to get order status color classes
  const getStatusColorClasses = (status: string): string => {
    switch (status) {
      case "CS_APPROVED":
      case "CA_APPROVED":
        return "bg-green-500";
      case "CA_ASSIGNED":
        return "bg-orange-500";
      case "REJECTED":
      case "CA_REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Check if order can be actioned (not already approved/rejected by CA)
  const canActionOrder = (status: string): boolean => {
    return status !== "CA_APPROVED" && status !== "CA_REJECTED";
  };

  // Render individual order card
  const renderOrderCard = (item: Order, index: number) => (
    <div key={item.orderId} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-100">
        <div className="text-lg font-bold text-gray-900 tracking-tight">
          Order ID: ...{getLastFourDigits(item.orderId)}
        </div>
        <div className={`px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider min-w-20 text-center ${getStatusColorClasses(item.status)}`}>
          {item.status}
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">User ID:</span>
          <span className="text-sm text-gray-500">....{getLastFourDigits(item.userId)}</span>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Name:</span>
          <span className="text-sm text-gray-900 font-semibold">
            {item.customerName || "N/A"}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Service:</span>
          <span className="text-sm text-gray-700 font-medium">
            {item.agreementServiceName || "N/A"}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Mobile:</span>
          <span className="text-sm text-green-600 font-semibold font-mono">
            {formatMobileNumber(item.mobileNumber)}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Address:</span>
          <span className="text-sm text-gray-500 leading-relaxed" title={item.address || "N/A"}>
            {item.address || "N/A"}
          </span>
        </div>

        {item.price && (
          <div className="flex items-start gap-3">
            <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Price:</span>
            <span className="text-base text-red-600 font-bold">₹{item.price}</span>
          </div>
        )}

        {item.createdAt && (
          <div className="flex items-start gap-3">
            <span className="font-semibold text-sm text-gray-600 min-w-20 shrink-0">Created:</span>
            <span className="text-xs text-gray-500 font-mono">{formatDate(item.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {canActionOrder(item.status) && (
        <div className="flex gap-3 mt-5 pt-4 border-t-2 border-gray-100">
          <button
            className={`flex-1 py-3.5 px-5 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 min-h-12 flex items-center justify-center gap-1.5 tracking-wide ${
              processingOrderId === item.orderId 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:shadow-lg hover:-translate-y-0.5'
            } bg-green-500 text-white shadow-lg shadow-green-500/30`}
            onClick={() => handleApprove(item.orderId)}
            disabled={processingOrderId === item.orderId}
          >
            {processingOrderId === item.orderId ? (
              <div className="text-xl animate-spin">⏳</div>
            ) : (
              <span>✓ Approve</span>
            )}
          </button>

          <button
            className={`flex-1 py-3.5 px-5 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 min-h-12 flex items-center justify-center gap-1.5 tracking-wide ${
              processingOrderId === item.orderId 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:shadow-lg hover:-translate-y-0.5'
            } bg-red-500 text-white shadow-lg shadow-red-500/30`}
            onClick={() => handleReject(item.orderId)}
            disabled={processingOrderId === item.orderId}
          >
            {processingOrderId === item.orderId ? (
              <div className="text-xl animate-spin">⏳</div>
            ) : (
              <span>✗ Reject</span>
            )}
          </button>
        </div>
      )}

      {!canActionOrder(item.status) && (
        <div className="mt-5 py-3 px-4 bg-gray-50 rounded-xl text-center border-2 border-gray-200">
          <span className="text-gray-600 text-sm font-semibold">
            {item.status === "CA_APPROVED"
              ? "✅ Approved"
              : item.status === "CA_REJECTED"
              ? "❌ Rejected"
              : "✅ Processed"}
          </span>
        </div>
      )}
    </div>
  );

  // Render loading state
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/25 min-h-18">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-xl flex justify-center items-center border-2 border-white/20">
              <span className="text-xl">🕵🏻</span>
            </div>
            <h1 className="text-xl text-white font-bold tracking-tight">Orders Dashboard</h1>
          </div>
          <button className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xl border-2 border-white/20 min-w-12 min-h-12 flex items-center justify-center hover:bg-white/25 transition-all duration-300">
            <span className="text-lg text-white font-bold">←</span>
          </button>
        </div>

        {/* Loading Content with proper padding from fixed header */}
        <div className="flex-1 flex flex-col justify-center items-center min-h-screen pt-18">
          <div className="text-5xl animate-spin">⏳</div>
          <p className="mt-4 text-base text-gray-500 font-medium">
            {profileLoading ? "Checking profile..." : "Loading orders..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Fixed Header */}
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
  px-5 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 backdrop-blur-md">
  
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-white/20 flex justify-center items-center border border-white/30">
      <span className="text-3xl leading-none">🕵🏻</span>
    </div>
    <h1 className="text-xl text-white font-bold tracking-tight">
      CA Partners Dashboard
    </h1>
  </div>

  <button 
    className="p-2.5 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center 
      hover:bg-white/30 transition-all duration-300"
    onClick={() => navigate(-1)}
  >
    <span className="text-lg text-white font-bold">←</span>
  </button>
</div>

      {/* Scrollable Main Content with proper padding from fixed header */}
      <div className="flex-1 pt-18 overflow-y-auto">
        <div className="flex flex-col gap-5 p-5 max-w-6xl mx-auto w-full">
          {/* Stats Section */}
          <div className="w-full">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex justify-around items-center">
              <div className="text-center flex-1">
                <div className="text-4xl font-extrabold text-gray-700 mb-1 leading-none">{orders.length}</div>
                <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Orders</div>
              </div>
              <div className="w-px h-10 bg-gray-200 mx-4"></div>
              <div className="text-center flex-1">
                <div className="text-4xl font-extrabold text-gray-700 mb-1 leading-none">
                  {orders.filter((o) => o.status === "CS_APPROVED" || o.status === "CA_APPROVED").length}
                </div>
                <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Approved</div>
              </div>
              <div className="w-px h-10 bg-gray-200 mx-4"></div>
              <div className="text-center flex-1">
                <div className="text-4xl font-extrabold text-gray-700 mb-1 leading-none">
                  {orders.filter((o) => o.status === "CA_REJECTED").length}
                </div>
                <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Rejected</div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Partner Orders</h2>
<button
  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
    ${refreshing 
      ? 'bg-indigo-400 text-white cursor-not-allowed' 
      : 'bg-indigo-500 text-white hover:bg-indigo-600'}`
  }
  onClick={onRefresh}
  disabled={refreshing}
>
  <span className="text-base">{refreshing ? "🔄" : "🔄"}</span>
  {refreshing ? "Refreshing..." : "Refresh"}
</button>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-15 px-5 bg-white rounded-2xl shadow-lg text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-base text-gray-500 font-medium mb-6">No orders found</p>
                <button 
                  className="py-3 px-6 bg-indigo-500 text-white border-none rounded-xl cursor-pointer text-sm font-semibold hover:bg-indigo-600 transition-all duration-300"
                  onClick={fetchOrders}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((item, index) => renderOrderCard(item, index))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalVisible && (
        <div 
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRejectModalVisible(false);
              setSelectedOrderId(null);
              setAdditionalNotes("");
            }
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-90vh overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 pb-5 border-b-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
              <button 
                className="w-9 h-9 rounded-full bg-gray-100 border-none cursor-pointer text-xl text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
                onClick={() => {
                  setRejectModalVisible(false);
                  setSelectedOrderId(null);
                  setAdditionalNotes("");
                }}
              >
                ×
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mx-6 my-4 font-medium">
              Please provide additional notes for rejection (optional):
            </p>

            <textarea
              className="w-full mx-6 mb-6 p-3 border-2 border-gray-200 rounded-xl text-sm resize-y outline-none min-h-24 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              style={{ width: 'calc(100% - 3rem)' }}
              placeholder="Enter rejection reason..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
            />

            <div className="flex gap-3 p-5 bg-gray-50">
              <button
                className="flex-1 py-3 px-5 border-none rounded-xl text-sm font-semibold cursor-pointer min-h-12 flex items-center justify-center bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300"
                onClick={() => {
                  setRejectModalVisible(false);
                  setSelectedOrderId(null);
                  setAdditionalNotes("");
                }}
              >
                Cancel
              </button>

              <button
                className="flex-1 py-3 px-5 border-none rounded-xl text-sm font-semibold cursor-pointer min-h-12 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={submitRejection}
                disabled={processingOrderId !== null}
              >
                {processingOrderId ? (
                  <div className="text-xl animate-spin">⏳</div>
                ) : (
                  "Reject Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDashboard;