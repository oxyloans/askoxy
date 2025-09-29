import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  RefreshCw,
  Building2,
  User,
  Phone,
  MessageSquare,
  StickyNote,
  ChevronRight,
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  CreditCard,
  UserCheck,
  Clock3,
  Shield,
  ShieldCheck,
  UserX,
  ShieldX,
  Ban
} from "lucide-react";

const API_BASE_URL = "https://meta.oxyloans.com";

// Order Status Enum - matching backend
const ORDER_STATUS = {
  SUBMITTED: 'SUBMITTED',
  CA_APPROVED: 'CA_APPROVED',
  CA_ASSIGNED: 'CA_ASSIGNED',
  CA_REJECTED: 'CA_REJECTED',
  CS_APPROVED: 'CS_APPROVED',
  CS_REJECTED: 'CS_REJECTED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

interface Order {
  orderId: string;
  status: OrderStatus;
  agreementServiceName?: string;
  serviceName?: string;
  address?: string;
  amount?: number;
  price?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  mobileNumber?: string;
  whatsAppNumber?: string;
  additionalNotes?: string;
}

interface UserData {
  accessToken: string;
  userId: string;
}

interface StatusCounts {
  active: number;
  completed: number;
  rejected: number;
}

const ServiceCAList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get user data from Redux
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");
  const customerId = localStorage.getItem("customerId") ||
    localStorage.getItem("userId") ||
    userId;

  // Helper functions
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.log("Date parsing error:", error);
      return dateString;
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price && price !== 0) return "N/A";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getStatusColor = (status?: OrderStatus): string => {
    if (!status) return "text-gray-500";
    const statusUpper = status.toUpperCase() as OrderStatus;
    const colors: Record<OrderStatus, string> = {
      [ORDER_STATUS.SUBMITTED]: "text-orange-600",
      [ORDER_STATUS.CA_APPROVED]: "text-green-600",
      [ORDER_STATUS.CA_ASSIGNED]: "text-blue-600",
      [ORDER_STATUS.CA_REJECTED]: "text-red-600",
      [ORDER_STATUS.CS_APPROVED]: "text-green-600",
      [ORDER_STATUS.CS_REJECTED]: "text-red-600",
      [ORDER_STATUS.PAYMENT_PENDING]: "text-orange-600",
      [ORDER_STATUS.PAYMENT_COMPLETED]: "text-green-600",
      [ORDER_STATUS.ACTIVE]: "text-cyan-600",
      [ORDER_STATUS.COMPLETED]: "text-green-600",
      [ORDER_STATUS.CANCELLED]: "text-red-600",
    };
    return colors[statusUpper] || "text-gray-500";
  };

  const getStatusBgColor = (status?: OrderStatus): string => {
    if (!status) return "bg-gray-50";
    const statusUpper = status.toUpperCase() as OrderStatus;
    const bgColors: Record<OrderStatus, string> = {
      [ORDER_STATUS.SUBMITTED]: "bg-orange-50",
      [ORDER_STATUS.CA_APPROVED]: "bg-green-50",
      [ORDER_STATUS.CA_ASSIGNED]: "bg-blue-50",
      [ORDER_STATUS.CA_REJECTED]: "bg-red-50",
      [ORDER_STATUS.CS_APPROVED]: "bg-green-50",
      [ORDER_STATUS.CS_REJECTED]: "bg-red-50",
      [ORDER_STATUS.PAYMENT_PENDING]: "bg-orange-50",
      [ORDER_STATUS.PAYMENT_COMPLETED]: "bg-green-50",
      [ORDER_STATUS.ACTIVE]: "bg-cyan-50",
      [ORDER_STATUS.COMPLETED]: "bg-green-50",
      [ORDER_STATUS.CANCELLED]: "bg-red-50",
    };
    return bgColors[statusUpper] || "bg-gray-50";
  };

  const getStatusIcon = (status?: OrderStatus) => {
    if (!status) return AlertCircle;
    const statusUpper = status.toUpperCase() as OrderStatus;
    const icons: Record<OrderStatus, React.ComponentType<any>> = {
      [ORDER_STATUS.SUBMITTED]: Clock3,
      [ORDER_STATUS.CA_APPROVED]: ShieldCheck,
      [ORDER_STATUS.CA_ASSIGNED]: UserCheck,
      [ORDER_STATUS.CA_REJECTED]: ShieldX,
      [ORDER_STATUS.CS_APPROVED]: CheckCircle,
      [ORDER_STATUS.CS_REJECTED]: XCircle,
      [ORDER_STATUS.PAYMENT_PENDING]: CreditCard,
      [ORDER_STATUS.PAYMENT_COMPLETED]: CheckCircle,
      [ORDER_STATUS.ACTIVE]: Play,
      [ORDER_STATUS.COMPLETED]: CheckCircle,
      [ORDER_STATUS.CANCELLED]: Ban,
    };
    return icons[statusUpper] || AlertCircle;
  };

  const formatStatus = (status?: OrderStatus): string => {
    if (!status) return "Unknown";
    const statusUpper = status.toUpperCase() as OrderStatus;
    const statusLabels: Record<OrderStatus, string> = {
      [ORDER_STATUS.SUBMITTED]: "Submitted",
      [ORDER_STATUS.CA_APPROVED]: "CA Approved",
      [ORDER_STATUS.CA_ASSIGNED]: "CA Assigned",
      [ORDER_STATUS.CA_REJECTED]: "CA Rejected",
      [ORDER_STATUS.CS_APPROVED]: "CS Approved",
      [ORDER_STATUS.CS_REJECTED]: "CS Rejected",
      [ORDER_STATUS.PAYMENT_PENDING]: "Payment Pending",
      [ORDER_STATUS.PAYMENT_COMPLETED]: "Payment Completed",
      [ORDER_STATUS.ACTIVE]: "Active",
      [ORDER_STATUS.COMPLETED]: "Completed",
      [ORDER_STATUS.CANCELLED]: "Cancelled",
    };
    return statusLabels[statusUpper] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusPriority = (status?: OrderStatus): number => {
    if (!status) return 999;
    const statusUpper = status.toUpperCase() as OrderStatus;
    const priorities: Record<OrderStatus, number> = {
      [ORDER_STATUS.SUBMITTED]: 1,
      [ORDER_STATUS.CA_ASSIGNED]: 2,
      [ORDER_STATUS.PAYMENT_PENDING]: 3,
      [ORDER_STATUS.ACTIVE]: 4,
      [ORDER_STATUS.CA_APPROVED]: 5,
      [ORDER_STATUS.CS_APPROVED]: 6,
      [ORDER_STATUS.PAYMENT_COMPLETED]: 7,
      [ORDER_STATUS.COMPLETED]: 8,
      [ORDER_STATUS.CA_REJECTED]: 9,
      [ORDER_STATUS.CS_REJECTED]: 10,
      [ORDER_STATUS.CANCELLED]: 11,
    };
    return priorities[statusUpper] || 999;
  };

  // API call to fetch orders
  const fetchOrders = useCallback(async (isRefresh = false) => {
    console.log("Fetching orders - userId:", userId, "token:", token ? "present" : "missing");

    if (!userId) {
      console.log("No userId found");
      setLoading(false);
      setRefreshing(false);
      alert("Authentication Error: Please login to view your orders");
      return;
    }

    if (!token) {
      console.log("No token found");
      setLoading(false);
      setRefreshing(false);
      alert("Authentication Error: Session expired. Please login again");
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const url = `${API_BASE_URL}/api/order-service/CACSUser/${userId}`;
      console.log("Fetching from URL:", url);

      const response = await axios({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        timeout: 15000, // 15 second timeout
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.data) {
        // Handle both array and single object responses
        let ordersData = Array.isArray(response.data) ? response.data : [response.data];
        
        // Sort orders by priority and then by date (newest first)
        const sortedOrders = ordersData.sort((a: Order, b: Order) => {
          const priorityA = getStatusPriority(a.status);
          const priorityB = getStatusPriority(b.status);
          
          // First sort by priority (lower number = higher priority)
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // If same priority, sort by creation date (newest first)
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });

        console.log("Setting orders:", sortedOrders.length);
        setOrders(sortedOrders);
      } else {
        console.log("No data received");
        setOrders([]);
      }

    } catch (error: any) {
      console.error("Error fetching orders:", error);
      
      let errorMessage = "Failed to fetch orders";
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        if (status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (status === 404) {
          console.log("No orders found (404)");
          setOrders([]);
          setLoading(false);
          setRefreshing(false);
          return;
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = `Error ${status}: Unable to fetch orders`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = "Request timeout. Please try again.";
      }

    //   if (confirm(`${errorMessage}\n\nWould you like to retry?`)) {
    //     fetchOrders(isRefresh);
    //   }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, token]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    console.log("Component mounted or dependencies changed, fetching orders");
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    console.log("Manual refresh triggered");
    fetchOrders(true);
  };
      const handleGoBack = () => {
    navigate("/main/caserviceitems");
  };

  const handleOrderPress = (order: Order) => {
    // Navigate to order details screen
    // navigate(`/order-details/${order.orderId}`, { state: { order } });
    console.log("Order pressed:", order.orderId);
  };

  const getStatusGroupCounts = (): StatusCounts => {
    const counts: StatusCounts = {
      active: 0,
      completed: 0,
      rejected: 0
    };

    orders.forEach(order => {
      const status = order.status?.toUpperCase() as OrderStatus;
      switch (status) {
        case ORDER_STATUS.SUBMITTED:
        case ORDER_STATUS.PAYMENT_PENDING:
        case ORDER_STATUS.CA_ASSIGNED:
          // counts.urgent++;
          break;
        case ORDER_STATUS.ACTIVE:
        case ORDER_STATUS.CA_APPROVED:
        case ORDER_STATUS.CS_APPROVED:
        case ORDER_STATUS.PAYMENT_COMPLETED:
          counts.active++;
          break;
        case ORDER_STATUS.COMPLETED:
          counts.completed++;
          break;
        case ORDER_STATUS.CA_REJECTED:
        case ORDER_STATUS.CS_REJECTED:
        case ORDER_STATUS.CANCELLED:
          counts.rejected++;
          break;
      }
    });

    return counts;
  };

  // Order card component
  const OrderCard: React.FC<{ order: Order; index: number }> = ({ order, index }) => {
    const StatusIcon = getStatusIcon(order.status);

    return (
      <div
        className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
        onClick={() => handleOrderPress(order)}
      >
  
  {/* Header with Order ID and Status */}
  <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
    <div className="flex-1 mr-3">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
        Order #{index + 1}
      </p>
        <span className="text-green-600 font-bold">
   ...... {order.orderId ? order.orderId.slice(-4) : "N/A"}
  </span>
    </div>
    <div
      className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 min-w-[110px] justify-center ${getStatusBgColor(
        order.status
      )} ${getStatusColor(order.status)}`}
    >
      <StatusIcon size={12} />
      <span className="text-xs font-bold uppercase text-center tracking-wide">
        {formatStatus(order.status)}
      </span>
    </div>
  </div>

  {/* Order Details */}
  <div className="space-y-3">
    {/* Service Name */}
    <div className="flex items-start gap-2">
      <Building2 size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-500 font-medium w-28">Service Name:</span>
      <span
        className={`text-sm font-semibold flex-1 ${
          order.agreementServiceName ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {order.agreementServiceName?.trim() ||
          order.serviceName?.trim() ||
          "Service not specified"}
      </span>
    </div>

    {/* Address */}
    {order.address && (
      <div className="flex items-start gap-2">
        <MapPin size={16} className="text-gray-200 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-gray-500 font-medium w-28">Address:</span>
        <span className="text-sm text-gray-900 flex-1 line-clamp-2">
          {order.address}
        </span>
      </div>
    )}

    {/* Ordered Date */}
    <div className="flex items-start gap-2">
      <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-500 font-medium w-28">Ordered Date:</span>
      <span className="text-sm text-gray-900 flex-1">
        {formatDate(order.createdAt)}
      </span>
    </div>

    {/* Additional Notes */}
    {order.additionalNotes && (
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <StickyNote size={16} className="text-gray-400" />
          <span className="text-xs text-gray-500 font-semibold uppercase">
            Notes
          </span>
        </div>
        <p className="text-sm text-gray-700 italic leading-relaxed pl-6 line-clamp-3">
          {order.additionalNotes}
        </p>
      </div>
    )}
  </div>

  {/* Action Indicator */}
  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
    <ChevronRight size={20} className="text-gray-400" />
  </div>
</div>
     
    );
  };

  // Loading state
  

  const statusCounts = getStatusGroupCounts();

  return (  
   <div className="text-2xl font-bold text-amber-800 leading-tight">
<div className="pt-4 pb-3 px-5 shadow-md">
  <div className="flex justify-between items-center">
    
    {/* Left Section - Back + Title */}
    <div className="flex items-center space-x-3">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="p-2 text-amber-800 hover:bg-grey-100 rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Title */}
      <div>
  <h1 className="text-2xl font-bold leading-tight bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
    My History
  </h1>
  <p className="text-sm text-gray-700 font-medium">
    {orders.length} {orders.length === 1 ? "order" : "orders"}
  </p>
</div>
    </div>
    
   
   
  </div>
</div>
  {/* Status Summary */}
  {orders.length > 0 && (
    <div className="mx-4 -mt-6 rounded-2xl bg-white shadow-lg p-5 border border-gray-100">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center bg-cyan-50 rounded-xl p-3">
          <p className="text-2xl font-extrabold text-cyan-700">{statusCounts.active}</p>
          <p className="text-sm text-gray-700 font-medium">Active</p>
        </div>
        <div className="flex flex-col items-center bg-green-50 rounded-xl p-3">
          <p className="text-2xl font-extrabold text-green-700">{statusCounts.completed}</p>
          <p className="text-sm text-gray-700 font-medium">Completed</p>
        </div>
        <div className="flex flex-col items-center bg-red-50 rounded-xl p-3">
          <p className="text-2xl font-extrabold text-red-700">{statusCounts.rejected}</p>
          <p className="text-sm text-gray-700 font-medium">Issues</p>
        </div>
      </div>
    </div>
  )}

  {/* Orders List */}
  <div className="p-5">
    {orders.length === 0 ? (
      /* Empty State */
      <div className="flex flex-col items-center justify-center py-24">
        <Receipt size={90} className="text-gray-400 mb-5" />
        <h3 className="text-2xl font-semibold text-gray-700">No orders found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mt-2 mb-6">
          {!userId || !token
            ? "Please login to view your orders"
            : "You haven't placed any orders yet"}
        </p>
        <button
  onClick={onRefresh}
  disabled={refreshing}
  className="flex items-center gap-1 px-2 py-1 bg-violet-600 text-white text-xs rounded-md hover:bg-violet-700 transition disabled:opacity-50"
>
  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
  Refresh
</button>
      </div>
    ) : (
      /* Orders List */
      <div className="space-y-5">
        {/* Refresh Button */}
        <div className="flex justify-end">
  <button
    onClick={onRefresh}
    disabled={refreshing}
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white shadow hover:bg-gray-100 transition disabled:opacity-50"
  >
    <RefreshCw
      size={14}
      className={refreshing ? "animate-spin text-blue-500" : "text-gray-500"}
    />
    {refreshing ? "Refreshing..." : "Refresh"}
  </button>
</div>


        {orders.map((order, index) => (
          <div key={order.orderId ? `${order.orderId}_${index}` : `order_${index}`}>
            <OrderCard order={order} index={index} />
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default ServiceCAList;