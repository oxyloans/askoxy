import React, { useState, useEffect } from 'react';
import { Menu, X, Filter, Search, Package2, ChevronDown, MessageSquare, ExternalLink, Eye, SmilePlus } from 'lucide-react';
import Footer from '../components/Footer';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import  BASE_URL  from "../Config";


interface OrderAddress {
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
}

interface OrderHistory {
  placedDate: string;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
}

interface Item {
  itemName: string;
  itemUrl: string;
  weight: string;
  price: number;
  itemMrpPrice: number;
  quantity: number;
  itemUnit: string;
  singleItemPrice: number;
}

interface FeedbackData {
  feedbackStatus: string;
  comments: string;
}

interface OrderDetailsResponse {
  orderId: string;
  orderStatus: string;
  newOrderId: string | null;
  customerMobile: string;
  customerId: string;
  subTotal: number | null;
  grandTotal: number;
  walletAmount: number;
  discountAmount:number;
  gstAmount: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress;
  orderItems: Item[];
  feedback?: FeedbackData;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailsResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [allOrders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string>('');
  const [userStage, setUserStage] = useState<string>('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [orderToRate, setOrderToRate] = useState<OrderDetailsResponse | null>(null);

  
  useEffect(() => {
    // Safe localStorage access during effect, not during render
    const storedCustomerId = localStorage.getItem("userId");
    const storedUserStage = localStorage.getItem("userStage") || "";
    
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
      setUserStage(storedUserStage);
      // Only fetch orders when we have a valid customer ID
      fetchOrders(storedCustomerId);
    }
  }, []);

  const fetchOrders = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = `${BASE_URL}/order-service/getAllOrders_customerId`;
      
      const response = await axios.post(
        API_URL,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // For each delivered order, fetch feedback status
      const orders = response.data || [];
      const ordersWithFeedback = await Promise.all(
        orders.map(async (order: OrderDetailsResponse) => {
          if (order.orderStatus === "4") {
            try {
              const feedbackData = await fetchOrderFeedbackData(order.orderId);
              return { ...order, feedback: feedbackData };
            } catch (error) {
              console.error("Error fetching feedback for order:", order.orderId, error);
              return order;
            }
          }
          return order;
        })
      );
      
      setOrders(ordersWithFeedback);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderFeedbackData = async (orderId: string): Promise<FeedbackData | undefined> => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const API_URL = userStage === "test1" 
        ? `${BASE_URL}/erice-service/checkout/feedback?feedbackUserId=${customerId}&orderid=${orderId}`
        : `${BASE_URL}/order-service/feedback?feedbackUserId=${userId}&orderid=${orderId}`;
      
      const response = await axios({
        method: "get",
        url: API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Handle array response format
      if (response.data && Array.isArray(response.data)) {
        // If array has items, use the first item's data
        if (response.data.length > 0) {
          const feedbackItem = response.data[0];
          return {
            feedbackStatus: feedbackItem.feedbackStatus,
            comments: feedbackItem.comments || ""
          };
        }
        // If array is empty, return undefined to show "Rate Your Experience"
        return undefined;
      } 
      // Handle direct object response format (as in your original code)
      else if (response.data && response.data.feedbackStatus) {
        return response.data;
      }
      
      return undefined;
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      return undefined;
    }
  };

  const fetchOrderDetails = async (orderId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/order-service/getOrdersByOrderId/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data[0]) {
        const orderData = response.data[0];
        
        // If order is delivered, ensure we have feedback data
        if (orderData.orderStatus === "4" && !orderData.feedback) {
          const feedbackData = await fetchOrderFeedbackData(orderId);
          orderData.feedback = feedbackData;
        }
        
        setSelectedOrder(orderData);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const submitFeedback = async (): Promise<void> => {
    if (!orderToRate) return;
    
    if (!selectedLabel) {
      alert("Please select a rating before submitting");
      return;
    }
    
    setFeedbackSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = {
        comments: comments,
        feedbackStatus: selectedLabel,
        feedback_user_id: customerId,
        orderid: orderToRate.orderId,
      };
      
      const API_URL = userStage === "test1"
        ? `${BASE_URL}/erice-service/checkout/submitfeedback`
        : `${BASE_URL}/order-service/submitfeedback`;
      
      await axios({
        method: "post",
        url: API_URL,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
        setIsFeedbackOpen(false);
        
        // Update the selected order with feedback data if it's open
        if (selectedOrder && selectedOrder.orderId === orderToRate.orderId) {
          setSelectedOrder(prev => prev ? {
            ...prev, 
            feedback: {
              feedbackStatus: selectedLabel,
              comments: comments
            }
          } : prev);
        }
        
        // Update the feedback in the orders list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderToRate.orderId 
              ? { 
                  ...order, 
                  feedback: { 
                    feedbackStatus: selectedLabel, 
                    comments: comments 
                  } 
                } 
              : order
          )
        );
        
        // Reset the form
        setSelectedLabel('');
        setComments('');
        setOrderToRate(null);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      "0": "bg-purple-50 text-purple-600",
      "1": "bg-purple-100 text-purple-700",
      "2": "bg-purple-200 text-purple-800",
      "3": "bg-purple-300 text-purple-900",
      "4": "bg-purple-400 text-purple-950",
      "5": "bg-red-100 text-red-600",
      "6": "bg-orange-100 text-orange-600",
      "PickedUp": "bg-green-100 text-green-600",
    };
    return statusMap[status] || statusMap["0"];
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      "0": "Incomplete",
      "1": "Placed",
      "2": "Accepted",
      "3": "Assigned",
      "4": "Delivered",
      "5": "Rejected",
      "6": "Cancelled",
      "PickedUp": "Picked up",
    };
    return statusMap[status] || "Unknown";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWriteToUs = () => {
    if (selectedOrder) {
      // Store the order details in localStorage
      localStorage.setItem("selectedOrderId", selectedOrder.orderId);
      if (selectedOrder.newOrderId) {
        localStorage.setItem("selectedOrderNewId", selectedOrder.newOrderId);
      } else {
        localStorage.removeItem("selectedOrderNewId");
      }

      // Navigate to the WriteToUs page with proper state
      navigate(`/main/writeToUs`, {
        state: {
          orderId: selectedOrder.orderId,
          orderNewId: selectedOrder.newOrderId,
          fromOrdersPage: true  // Add this flag to indicate coming from orders page
        }
      });

      // Close the details modal
      setIsDetailsOpen(false);
    }
  };

  const openFeedbackModal = (order: OrderDetailsResponse) => {
    // If feedback already exists, simply show it (don't open the edit modal)
    if (order.feedback) {
      return;
    }
    
    setOrderToRate(order);
    setIsFeedbackOpen(true);
    
    // Reset form for new feedback
    setSelectedLabel('');
    setComments('');
  };
  
  const closeFeedbackModal = () => {
    setIsFeedbackOpen(false);
    setOrderToRate(null);
    setSelectedLabel('');
    setComments('');
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch = searchQuery === '' ||
      (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.newOrderId && order.newOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ||
      getStatusText(order.orderStatus).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }
    return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
  });

  // Emoji feedback options
  const feedbackOptions = [
    { label: "EXCELLENT", emoji: "😍", text: "Loved it!" },
    { label: "GOOD", emoji: "😊", text: "Satisfied" },
    { label: "AVERAGE", emoji: "😐", text: "Neutral" },
    { label: "BELOWAVERAGE", emoji: "😕", text: "Disappointed" },
    { label: "POOR", emoji: "😞", text: "Very Disappointed" }
  ];

  // Get emoji and text based on feedback status
  const getFeedbackDisplay = (feedbackStatus: string) => {
    const option = feedbackOptions.find(opt => opt.label === feedbackStatus);
    return option || { emoji: "🙂", text: "Feedback Provided" };
  };
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
  <div className="flex-1 min-w-[180px]">
    <label className="text-sm text-gray-600 mb-1 block">Search Order</label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
      <input
        type="text"
        placeholder="Search by Order ID"
        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  </div>
  
  <div className="flex-1 min-w-[140px]">
    <label className="text-sm text-gray-600 mb-1 block">Status</label>
    <div className="relative">
      <select
        className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Orders</option>
        <option value="placed">Placed</option>
        <option value="accepted">Accepted</option>
        <option value="assigned">Assigned</option>
        <option value="PickedUp">Picked Up</option>
        <option value="delivered">Delivered</option>
        <option value="rejected">Rejected</option>

      </select>
      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 pointer-events-none" />
    </div>
  </div>

  <div className="flex-1 min-w-[140px]">
    <label className="text-sm text-gray-600 mb-1 block">Sort By</label>
    <div className="relative">
      <select
        className="w-full px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 pointer-events-none" />
    </div>
  </div>
</div>

        </div>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm">
            <Package2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto" />
            <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden hover:shadow transition-all duration-300"
              >
                <div className="p-3 sm:p-5">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-purple-900">#{order.newOrderId}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Total Amount</span>
                      <span className="text-xs sm:text-sm font-medium">₹{order.grandTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Payment</span>
                      <span className="text-xs sm:text-sm font-medium">{order.paymentType === 2 ? "Online" : "COD"}</span>
                    </div>
                  </div>
                </div>

                {/* Order Action Buttons - View Details and Rate Experience */}
                <div className="grid grid-cols-1">
                  {/* View Details button */}
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 cursor-pointer transition-all duration-300"
                    onClick={() => fetchOrderDetails(order.orderId)}
                  >
                    <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-white">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base font-medium">View Order Details</span>
                    </div>
                  </div>
                  
                  {/* Display Feedback or Rate Experience button for delivered orders */}
                  {order.orderStatus === "4" && (
                    <div
                      className={`${order.feedback 
                          ? "bg-purple-100 cursor-default" 
                          : "bg-white hover:bg-purple-50 cursor-pointer"
                      } transition-all duration-300`}
                      onClick={order.feedback ? undefined : () => openFeedbackModal(order)}
                    >
                      <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-purple-800">
                        {order.feedback ? (
                          <>
                            <span className="text-lg sm:text-xl">
                              {getFeedbackDisplay(order.feedback.feedbackStatus).emoji}
                            </span>
                            <span className="text-sm sm:text-base font-medium">
                              {getFeedbackDisplay(order.feedback.feedbackStatus).text}
                            </span>
                          </>
                        ) : (
                          <>
                            <SmilePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base font-medium">Rate Your Experience</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {isDetailsOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-auto">
            <div className="bg-white rounded-lg w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 sm:p-4 sticky top-0 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-1 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center">
                  <Package2 className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-900">
                    Order #{selectedOrder?.newOrderId || selectedOrder?.orderId?.slice(-4)}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{formatDate(selectedOrder.orderDate)}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Status</h4>
                  <div className="flex items-center justify-center">
                    <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                

                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 sm:mb-3 text-sm sm:text-base">Delivery Address</h4>
                  <div className="space-y-1 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p>{selectedOrder.orderAddress.flatNo}, {selectedOrder.orderAddress.address}</p>
                    <p>Landmark: {selectedOrder.orderAddress.landMark}</p>
                    <p>Pincode: {selectedOrder.orderAddress.pincode}</p>
                    <p>Mobile: {selectedOrder.customerMobile}</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-2 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between space-y-2 sm:space-y-0 hover:border-purple-300 transition-colors"
                    >
                      {/* Item Details on the Left */}
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 cursor-pointer rounded-md overflow-hidden border border-gray-300 flex-shrink-0">
                          {item.itemUrl && (
                            <img
                              src={item.itemUrl}
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 sm:flex-auto">
                          <h3 className="font-bold text-center sm:text-left text-sm sm:text-base">{item.itemName}</h3>
                          <p className="text-xs sm:text-sm text-center sm:text-left">
                            Weight: {item.weight} {item.itemUnit || "KGS"}
                          </p>
                          <p className="text-xs sm:text-sm line-through text-red-500 text-center sm:text-left"> MRP: ₹{item.itemMrpPrice}</p>
                          <p className="text-green-600 font-bold text-sm sm:text-lg text-center sm:text-left">₹{item.singleItemPrice}</p>
                        </div>
                      </div>

                      {/* Quantity-Based Price Section on the Right */}
                      <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                        <p className="text-gray-700 text-xs sm:text-sm">Qty: {item.quantity}</p>
                        <p className="text-green-600 font-bold text-sm sm:text-base">Total: ₹{item.quantity * item.singleItemPrice}</p>
                      </div>
                    </div>
                  ))}
                  <h4 className="font-semibold text-purple-900 mb-2 sm:mb-3 text-sm sm:text-base">Payment Details</h4>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Sub Total</span>
                      <span>₹{selectedOrder.subTotal || selectedOrder.grandTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wallet Amount</span>
                      <span>- ₹{selectedOrder.walletAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coupon</span>
                    
                        <span>- ₹{selectedOrder.discountAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Charges</span>
                      <span>₹{selectedOrder.gstAmount || 0}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span>{selectedOrder.paymentType === 2 ? "Online" : "COD"}</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-purple-600">₹{selectedOrder.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.orderHistory && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">Order Timeline</h4>

                    {selectedOrder.orderHistory.map((orderHistory, index) => (
                      <div key={index} className="space-y-4">
                        {orderHistory.placedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Placed</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.placedDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.acceptedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Accepted</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.acceptedDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.assignedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Delivery Person Assigned</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.assignedDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.deliveredDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Delivered</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.deliveredDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.canceledDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            <div>
                              <p className="font-medium">Order Canceled</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.canceledDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.rejectedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            <div>
                              <p className="font-medium">Order Rejected</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.rejectedDate)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Feedback status display in order details */}
                {selectedOrder.orderStatus === "4" && selectedOrder.feedback && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">Your Feedback</h4>
                    <div className="text-center">
                      <div className="flex justify-center items-center mb-2">
                        <div className="text-4xl">
                          {feedbackOptions.find(option => option.label === selectedOrder.feedback?.feedbackStatus)?.emoji || "🙂"}
                        </div>
                      </div>
                      <p className="font-medium text-gray-700">
                        {feedbackOptions.find(option => option.label === selectedOrder.feedback?.feedbackStatus)?.text || "Rated"}
                      </p>
                      {selectedOrder.feedback.comments && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-purple-100">
                          <p className="text-gray-700">{selectedOrder.feedback.comments}</p>
                        </div>
                      )}
                      {/* Removed "Edit Feedback" button */}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleWriteToUs}
                    className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Write to Us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {isFeedbackOpen && orderToRate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Rate Your Experience</h2>
                <button
                  onClick={closeFeedbackModal}
                  className="p-1 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    How was your experience with Order #{orderToRate.newOrderId || orderToRate.orderId?.slice(-4)}?
                  </h3>
                  <p className="text-gray-600 text-sm">Your feedback helps us improve our service</p>
                </div>

                {/* Feedback success message */}
                {feedbackSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
                    <p className="font-medium">Thank you for your feedback!</p>
                  </div>
                )}

                {/* Emoji rating options */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {feedbackOptions.map((option) => (
                    <div
                      key={option.label}
                      className={`text-center cursor-pointer p-2 rounded-lg transition-all ${
                        selectedLabel === option.label
                          ? "bg-purple-100 border-2 border-purple-500"
                          : "hover:bg-purple-50 border-2 border-transparent"
                      }`}
                      onClick={() => setSelectedLabel(option.label)}
                    >
                      <div className="text-3xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.text}</div>
                    </div>
                  ))}
                </div>

                {/* Comments textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your experience..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-purple-300"
                  onClick={submitFeedback}
                  disabled={feedbackSubmitting || !selectedLabel}
                >
                  {feedbackSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;