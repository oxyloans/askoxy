import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Package,
  Package2,
  MapPin,
  Phone,
  ShoppingBag,
  CheckCircle,ArrowRight,
  Truck,ThumbsDown,ThumbsUp,
  CheckCheck,
  CreditCard,
  Banknote,
  Clock,
  FileDown,
  MessageSquare,
  Search,
  ChevronDown,
  ExternalLink,
  Eye,
  SmilePlus,
  Calendar,
  AlertCircle,
  CalendarDays,
  Check,
  ChevronRight,
} from "lucide-react";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { message } from "antd";

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
  pickUpDate: string | null;
  exchangeRequestDate?: string | null; // Added for exchange request time
}

interface TimeSlot {
  dayOfWeek: string;
  id: number;
  isAvailable: boolean;
  timeSlot1: string;
  timeSlot2: string;
  timeSlot3: string;
  timeSlot4: string;
  date?: string;
  isToday?: boolean;
   slot1Status?: boolean; // Added
  slot2Status?: boolean; // Added
  slot3Status?: boolean; // Added
  slot4Status?: boolean; // Added
}

interface Item {
  itemId: string;
  itemName: string;
  itemUrl: string | null;
  weight: string | number;
  price: number;
  itemMrpPrice: number;
  quantity: number;
  itemUnit: string | null;
  singleItemPrice: number;
  isExchanged?: boolean;
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
  discountAmount: number;
  gstAmount: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress | null; // Made optional
  orderItems: Item[];
  feedback?: FeedbackData;
  timeSlot?: string;
  dayOfWeek?: string;
  expectedDeliveryDate?: string;
  isFromExchangeTab?: boolean;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDetailsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<number | string>("details");
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = useState(true);
  const [showTimeSlotPopup, setShowTimeSlotPopup] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [allOrders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string>("");
  const [userStage, setUserStage] = useState<string>("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [orderToRate, setOrderToRate] = useState<OrderDetailsResponse | null>(
    null
  );
  const storedCustomerId = localStorage.getItem("userId");
  const [isEditingDeliveryTime, setIsEditingDeliveryTime] =
    useState<boolean>(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [timeSlotsForTwoDays, setTimeSlotsForTwoDays] = useState<TimeSlot[]>(
    []
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlotUpdating, setTimeSlotUpdating] = useState<boolean>(false);
  const [timeSlotUpdateSuccess, setTimeSlotUpdateSuccess] =
    useState<boolean>(false);

  // Variables for the Exchange functionality
  const [isExchangeModalOpen, setIsExchangeModalOpen] =
    useState<boolean>(false);
  const [exchangeItems, setExchangeItems] = useState<
    { itemId: string; reason: string; quantity: number }[]
  >([]);
  const [exchangeSubmitting, setExchangeSubmitting] = useState<boolean>(false);
  const [exchangeSuccess, setExchangeSuccess] = useState<boolean>(false);
  const [exchangeOrdersData, setExchangeOrdersData] = useState<
    OrderDetailsResponse[]
  >([]);

  //state variable for the Exchange orders button
  const [showExchangeOrders, setShowExchangeOrders] = useState<boolean>(false);

  // Helper function to check if exchange is within 10 days from delivery
  const isWithinExchangePeriod = (deliveredDate: string | null): boolean => {
    if (!deliveredDate) return false;
    const deliveryDate = new Date(deliveredDate);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - deliveryDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 10;
  };

  // Functions for the Exchange Functionality
  const openExchangeModal = (
    order: OrderDetailsResponse,
    keepDetailsOpen: boolean = false
  ) => {
    console.log("Opening exchange modal for order:", order);

    // Check if order is in Delivered status
    if (order.orderStatus !== "4") {
      message.warning("Exchange is only available for delivered orders.");
      return;
    }

    // Check if the order has already been exchanged by matching the last 4 digits
    if (hasMatchingExchangeOrder(order.orderId)) {
      message.warning("This order has already been exchanged.");
      return;
    }

    // Prevent opening exchange modal from exchange tab
    if (order.isFromExchangeTab) {
      message.warning("This order has already been exchanged.");
      return;
    }

    setSelectedOrder(order);

    // Check if order is delivered and within 10 days
    const deliveredHistory = order.orderHistory.find(
      (history) => history.deliveredDate
    );
    if (
      !deliveredHistory ||
      !isWithinExchangePeriod(deliveredHistory.deliveredDate)
    ) {
      message.error("Exchange is only allowed within 10 days from delivery.");
      return;
    }

    // Check if any items are available for exchange (not already exchanged)
    if (order.orderItems && Array.isArray(order.orderItems)) {
      const availableItems = order.orderItems.filter(
        (item) => !item.isExchanged
      );
      if (availableItems.length === 0) {
        message.error(
          "All items in this order have already been exchanged or are not eligible."
        );
        return;
      }
      setExchangeItems(
        availableItems.map((item) => ({
          itemId: item.itemId,
          reason: "",
          quantity: 1,
        }))
      );
    } else {
      setExchangeItems([]);
      message.warning("No items available for exchange in this order.");
      return;
    }

    setIsExchangeModalOpen(true);
    if (!keepDetailsOpen) {
      setIsDetailsOpen(false);
    }
  };

  const closeExchangeModal = () => {
    setIsExchangeModalOpen(false);
    setExchangeItems([]);
    setExchangeSuccess(false);
  };

  const handleExchangeQuantityChange = (itemId: string, quantity: number) => {
    setExchangeItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  const handleExchangeReasonChange = (itemId: string, reason: string) => {
    setExchangeItems((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, reason } : item))
    );
  };

  const submitExchangeRequest = async () => {
    if (!selectedOrder) return;

    const validExchangeItems = exchangeItems.filter(
      (item) => item.quantity > 0 && item.reason.trim() !== ""
    );

    if (validExchangeItems.length === 0) {
      message.warning(
        "Please select at least one item and provide a reason for exchange."
      );
      return;
    }

    // Check if items are already exchanged
    const alreadyExchanged = validExchangeItems.some((exchangeItem) => {
      const orderItem = selectedOrder.orderItems.find(
        (item) => item.itemId === exchangeItem.itemId
      );
      return orderItem?.isExchanged;
    });

    if (alreadyExchanged) {
      message.error(
        "One or more items have already been exchanged or are not eligible."
      );
      return;
    }

    // Check if the order has already been exchanged
    if (hasMatchingExchangeOrder(selectedOrder.orderId)) {
      message.error("This order has already been exchanged.");
      return;
    }

    // Check if within 10 days from delivery
    const deliveredHistory = selectedOrder.orderHistory.find(
      (history) => history.deliveredDate
    );
    if (
      !deliveredHistory ||
      !isWithinExchangePeriod(deliveredHistory.deliveredDate)
    ) {
      message.error("Exchange period of 10 days from delivery has expired.");
      return;
    }

    setExchangeSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const requestBody = {
        exchangeListItemRequest: validExchangeItems.map((item) => ({
          itemId: item.itemId,
          reason: item.reason,
        })),
        exchangeQuantity: validExchangeItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        orderId: selectedOrder.orderId,
        type: "EXCHANGE",
        userId: userId || "",
      };

      await axios.patch(
        `${BASE_URL}/order-service/exchangeOrder`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setExchangeSuccess(true);
      message.success("Exchange request submitted successfully!");

      setTimeout(() => {
        setExchangeSuccess(false);
        setIsExchangeModalOpen(false);
        setExchangeItems([]);
      }, 2000);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "submit_exchange_request", {
          order_id: selectedOrder.orderId,
          item_count: validExchangeItems.length,
        });
      }

      // Update local state to mark items as exchanged
      setSelectedOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          orderItems: prev.orderItems.map((item) => {
            if (validExchangeItems.some((ex) => ex.itemId === item.itemId)) {
              return { ...item, isExchanged: true };
            }
            return item;
          }),
        };
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrder.orderId
            ? {
                ...order,
                orderItems: order.orderItems.map((item) => {
                  if (
                    validExchangeItems.some((ex) => ex.itemId === item.itemId)
                  ) {
                    return { ...item, isExchanged: true };
                  }
                  return item;
                }),
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error submitting exchange request:", error);
      message.error("Failed to submit exchange request. Please try again.");
    } finally {
      setExchangeSubmitting(false);
    }
  };

  useEffect(() => {
    const loadAllOrders = async () => {
      if (!storedCustomerId) return;

      setCustomerId(storedCustomerId);
      setUserStage(localStorage.getItem("userStage") || "");

      try {
        const [regularOrders, exchangeOrders] = await Promise.all([
          fetchOrders(storedCustomerId),
          fetchExchangeOrders(storedCustomerId),
        ]);

        // Merge both lists into allOrders
        setOrders([...regularOrders, ...exchangeOrders]);
      } catch (error) {
        message.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllOrders();
  }, []);

  const fetchOrders = async (
    userId: string
  ): Promise<OrderDetailsResponse[]> => {
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

      const orders = response.data || [];
      const normalizedOrders = orders.map((order: any) => ({
        ...order,
        orderItems: (order.orderItem || []).map((item: any) => ({
          itemId: item.itemId,
          itemName: item.productName,
          itemUrl: null,
          weight: "1",
          price: item.price,
          itemMrpPrice: item.price,
          quantity: item.quantity,
          itemUnit: "KG",
          singleItemPrice: item.price / item.quantity || item.price,
          isExchanged: item.isExchanged || false,
        })),
      }));

      const ordersWithFeedback = await Promise.all(
        normalizedOrders.map(async (order: OrderDetailsResponse) => {
          if (order.orderStatus === "4") {
            try {
              const feedbackData = await fetchOrderFeedbackData(order.orderId);
              return { ...order, feedback: feedbackData };
            } catch (error) {
              console.error("Error fetching feedback:", error);
              return order;
            }
          }
          return order;
        })
      );

      const filteredOrders = ordersWithFeedback.filter(
        (order) => order.orderStatus !== "7"
      );

      return filteredOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExchangeOrders = async (
    userId: string
  ): Promise<OrderDetailsResponse[]> => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = `${BASE_URL}/order-service/getExchangeOrders/${userId}`;

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const exchangeOrders = response.data || [];
      const normalizedExchangeOrders = exchangeOrders.map((order: any) => ({
        orderId: order.orderId,
        orderStatus: "7",
        newOrderId: order.orderId2 || null,
        customerMobile: order.mobileNumber || "",
        customerId: userId,
        subTotal: order.itemPrice || 0,
        grandTotal: order.itemPrice || 0,
        walletAmount: 0,
        discountAmount: 0,
        gstAmount: 0,
        deliveryFee: 0,
        paymentType: 0,
        orderDate: order.exchangeRequestDate || "",
        customerName: order.userName || "",
        orderAddress: {
          flatNo: "",
          address: "",
          landMark: "",
          pincode: 0,
        },
        orderItems: [
          {
            itemId: order.itemId || "",
            itemName: order.itemName || "Unknown Item",
            itemUrl: null,
            weight: "1",
            price: order.itemPrice || 0,
            itemMrpPrice: order.itemPrice || 0,
            quantity: 1,
            itemUnit: "Unit",
            singleItemPrice: order.itemPrice || 0,
            isExchanged: true,
          },
        ],
        orderHistory: [],
      }));

      return normalizedExchangeOrders;
    } catch (error) {
      console.error("Error fetching exchange orders:", error);
      return [];
    }
  };

  //function for calling the exchange api using the exchange orders button
  const handleShowExchangeOrders = async () => {
    setIsLoading(true);
    if (!showExchangeOrders) {
      try {
        await fetchExchangeOrders(customerId);
        setShowExchangeOrders(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching exchange orders:", error);
        message.error("Failed to fetch exchange orders.");
        setIsLoading(false);
      }
    } else {
      setShowExchangeOrders(false);
      await fetchOrders(customerId); // Fully replace orders list
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = (order: OrderDetailsResponse) => {
    try {
      const orderDate = new Date(order.orderDate);
      const formattedDate = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Add GA tracking for invoice download
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "download_invoice", {
          currency: "INR",
          order_id: order.newOrderId || order.orderId,
          value: order.grandTotal,
        });
      }

      const invoiceContent = `
    INVOICE
    =============================
    Order ID: ${order.newOrderId || order.orderId}
    Date: ${formattedDate}
    Customer: ${order.customerName}
    Phone: ${order.customerMobile}
    
    Items:
    -----------------------------
    ${order.orderItems
      .map(
        (item) =>
          `${item.itemName} (${item.weight} ${item.itemUnit || "KGS"}) x ${
            item.quantity
          } = ₹${(item.quantity * item.singleItemPrice).toFixed(2)}`
      )
      .join("\n")}
    
    -----------------------------
    Sub Total: ₹${order.subTotal || order.grandTotal}
    Delivery Fee: ₹${order.deliveryFee}
    ${order.walletAmount > 0 ? `Wallet Amount: -₹${order.walletAmount}\n` : ""}
    ${
      order.discountAmount > 0
        ? `Coupon Discount: -₹${order.discountAmount}\n`
        : ""
    }
    ${order.gstAmount > 0 ? `GST Charges: ₹${order.gstAmount}\n` : ""}
    
    TOTAL: ₹${order.grandTotal}
    =============================
    Payment Method: ${
      order.paymentType === 2 ? "Online Payment" : "Cash on Delivery"
    }
    `;

      const blob = new Blob([invoiceContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${order.newOrderId || order.orderId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to download invoice. Please try again later.");
    }
  };

  const fetchOrderFeedbackData = async (
    orderId: string
  ): Promise<FeedbackData | undefined> => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const API_URL =
        userStage === "test1"
          ? `${BASE_URL}/erice-service/checkout/feedback?feedbackUserId=${customerId}&orderid=${orderId}`
          : `${BASE_URL}/order-service/feedback?feedbackUserId=${userId}&orderid=${orderId}`;

      const response = await axios({
        method: "get",
        url: API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          const feedbackItem = response.data[0];
          return {
            feedbackStatus: feedbackItem.feedbackStatus,
            comments: feedbackItem.comments || "",
          };
        }
        return undefined;
      } else if (response.data && response.data.feedbackStatus) {
        return response.data;
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      return undefined;
    }
  };

  const getProgressPercentage = (orderStatus: string | number): number => {
    const status = parseInt(orderStatus.toString(), 10);
    switch (status) {
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
        return 75;
      case 4:
        return 100;
      case 5:
      case 6:
      case 7:
        return 0;
      default:
        return 0;
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
        // Ensure orderItems is an array
        orderData.orderItems = Array.isArray(orderData.orderItems)
          ? orderData.orderItems
          : [];
        // Ensure orderAddress is an object
        orderData.orderAddress = orderData.orderAddress || {
          flatNo: "",
          address: "",
          landMark: "",
          pincode: 0,
        };
        console.log("Order details:", orderData); // Debug log
        if (orderData.orderStatus === "4" && !orderData.feedback) {
          const feedbackData = await fetchOrderFeedbackData(orderId);
          orderData.feedback = feedbackData;
        }

        setSelectedOrder(orderData);
        if (
          orderData.orderStatus === "4" &&
          hasMatchingExchangeOrder(orderData.orderId)
        ) {
          message.warning("This order has already been exchanged.");
        }

        setSelectedDay(orderData.dayOfWeek || "");
        setSelectedTimeSlot(orderData.timeSlot || "");
        setSelectedDate(orderData.expectedDeliveryDate || "");
        setIsDetailsOpen(true);

        // Add GA tracking for order view
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "view_order_details", {
            currency: "INR",
            order_id: orderData.newOrderId || orderData.orderId,
            value: orderData.grandTotal,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details.");
    }
  };

   const SelectedDeliveryTime: React.FC = () => {
    if (!selectedTimeSlot || !selectedDay || !selectedDate) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-700 font-medium mb-2">Selected Delivery Time:</p>
        <div className="flex items-center mt-1">
          <CalendarDays className="w-4 h-4 mr-2 text-purple-600" />
          <span className="font-medium">
            {formatDayOfWeek(selectedDay)}, {formatDeliveryDate(selectedDate)}
          </span>
        </div>
        <div className="flex items-center mt-1">
          <Clock className="w-4 h-4 mr-2 text-purple-600" />
          <span>{selectedTimeSlot}</span>
        </div>
      </div>
    );
  };

  const openEditDeliveryTime = async () => {
    setIsEditingDeliveryTime(true);
    setShowTimeSlotPopup(false); // Initially don't show the time slot popup until day is selected
    await fetchAvailableTimeSlots(selectedOrder?.orderId || '');
  };

  const getNextAvailableDays = (): {
    dayOfWeek: string;
    formattedDay: string;
    date: string;
    isToday: boolean
  }[] => {
    const days = [];
    // Upper case format for API matching
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    // Formatted display version
    const formattedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Always start from tomorrow, regardless of the current time
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startDate = tomorrow;
    
    // Get next 7 days starting from tomorrow (instead of just 3)
    // This gives us more potential days to find 3 available ones
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
  
      const dayOfWeek = daysOfWeek[date.getDay()];
      const formattedDay = formattedDaysOfWeek[date.getDay()];
  
      // Format date as DD-MM-YYYY for API compatibility
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
  
      days.push({
        dayOfWeek,
        formattedDay,
        date: formattedDate,
        isToday: i === 0 && date.getDate() === today.getDate()
      });
    }
  
    return days;
  };

  

  const fetchAvailableTimeSlots = async (orderId: string) => {
    setIsLoading2(true);
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(
        `${BASE_URL}/order-service/fetchTimeSlotlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data && Array.isArray(response.data)) {
        // Get potential delivery days (now up to 7 days)
        const potentialDays = getNextAvailableDays();
  
        // Process the available time slots
        const allProcessedTimeSlots: TimeSlot[] = [];
  
        // For each day of the week in our potential days
        for (const dayInfo of potentialDays) {
          // Find if this day exists in the API response
          const apiSlot = response.data.find(
            (slot: any) => slot.dayOfWeek === dayInfo.dayOfWeek
          );
  
          if (apiSlot) {
            // IMPORTANT: In the API, isAvailable=false means the day IS available (show it)
            // We no longer need to invert this value
            const showThisDay = !apiSlot.isAvailable;
            
            // Filter and deduplicate time slots
            const uniqueTimeSlots = [];
            
            // Only add time slots where slotXStatus is false (meaning show it)
            if (!apiSlot.slot1Status && apiSlot.timeSlot1?.trim()) {
              uniqueTimeSlots.push(apiSlot.timeSlot1.trim());
            }
            
            if (!apiSlot.slot2Status && apiSlot.timeSlot2?.trim() && 
                !uniqueTimeSlots.includes(apiSlot.timeSlot2.trim())) {
              uniqueTimeSlots.push(apiSlot.timeSlot2.trim());
            }
            
            if (!apiSlot.slot3Status && apiSlot.timeSlot3?.trim() && 
                !uniqueTimeSlots.includes(apiSlot.timeSlot3.trim())) {
              uniqueTimeSlots.push(apiSlot.timeSlot3.trim());
            }
            
            if (!apiSlot.slot4Status && apiSlot.timeSlot4?.trim() && 
                !uniqueTimeSlots.includes(apiSlot.timeSlot4.trim())) {
              uniqueTimeSlots.push(apiSlot.timeSlot4.trim());
            }
            
            // Create a processed time slot with all information
            allProcessedTimeSlots.push({
              id: apiSlot.id,
              dayOfWeek: apiSlot.dayOfWeek,
              isAvailable: showThisDay, // No longer inverting the value
              timeSlot1: uniqueTimeSlots[0] || '',
              timeSlot2: uniqueTimeSlots[1] || '',
              timeSlot3: uniqueTimeSlots[2] || '',
              timeSlot4: uniqueTimeSlots[3] || '',
              slot1Status: apiSlot.slot1Status,
              slot2Status: apiSlot.slot2Status,
              slot3Status: apiSlot.slot3Status,
              slot4Status: apiSlot.slot4Status,
              date: dayInfo.date,
              isToday: dayInfo.isToday
            });
          } else {
            // If not in API response, add the day as unavailable
            allProcessedTimeSlots.push({
              id: Math.random(), // Generate a random ID
              dayOfWeek: dayInfo.dayOfWeek,
              isAvailable: false, // Keep as false since day is not available
              timeSlot1: '', 
              timeSlot2: '',
              timeSlot3: '',
              timeSlot4: '',
              slot1Status: true, // Mark all slots as hidden for unavailable days
              slot2Status: true,
              slot3Status: true,
              slot4Status: true,
              date: dayInfo.date,
              isToday: dayInfo.isToday
            });
          }
        }
  
        // FILTER: Only keep available days (where isAvailable is true - meaning show the day)
        const availableTimeSlots = allProcessedTimeSlots.filter(slot => slot.isAvailable);
        
        // Take only up to 3 available days
        const timeSlotSelection = availableTimeSlots.slice(0, 3);
  
        // If we don't have any available slots, we'll still show the original slots but mark them as unavailable
        const timeSlotsToShow = timeSlotSelection.length > 0 ? timeSlotSelection : allProcessedTimeSlots.slice(0, 3);
  
        // Set the time slots in state
        setAvailableTimeSlots(allProcessedTimeSlots); // Keep all slots for reference
        setTimeSlotsForTwoDays(timeSlotsToShow); // Only show the filtered slots to user
  
        // Initialize slot selection if we have valid slots and there's a selected order
        if (selectedOrder && timeSlotsToShow.length > 0) {
          // Filter to get only available slots
          const availableSlots = timeSlotsToShow.filter(slot => slot.isAvailable);
  
          // If the order already has a day selected, use that if available in our list
          if (selectedOrder.dayOfWeek && selectedOrder.timeSlot) {
            const existingSlot = timeSlotsToShow.find(
              slot => slot.dayOfWeek === selectedOrder.dayOfWeek
            );
  
            if (existingSlot && existingSlot.isAvailable) {
              setSelectedDay(existingSlot.dayOfWeek);
              setSelectedTimeSlot(selectedOrder.timeSlot);
              setSelectedDate(existingSlot.date || "");
            } else if (availableSlots.length > 0) {
              // Default to first available day
              const firstAvailableSlot = availableSlots[0];
              setSelectedDay(firstAvailableSlot.dayOfWeek);
              setSelectedTimeSlot(firstAvailableSlot.timeSlot1);
              setSelectedDate(firstAvailableSlot.date || "");
            }
          } else if (availableSlots.length > 0) {
            // No existing selection, use first available day
            const firstAvailableSlot = availableSlots[0];
            setSelectedDay(firstAvailableSlot.dayOfWeek);
            setSelectedTimeSlot(firstAvailableSlot.timeSlot1);
            setSelectedDate(firstAvailableSlot.date || "");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to fetch available time slots");
    } finally {
      setIsLoading2(false);
    }
  };


  const formatDayOfWeek = (day: string): string => {
    if (!day || day === "NO_SLOT") return "No Slot Available";

    // Convert uppercase day to proper case format
    const dayMap: Record<string, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    };

    return dayMap[day] || day;
  };
  const submitFeedback = async (): Promise<void> => {
    if (!orderToRate || !selectedLabel) {
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

      const API_URL =
        userStage === "test1"
          ? `${BASE_URL}/erice-service/checkout/submitfeedback`
          : `${BASE_URL}/order-service/submitfeedback`;

      await axios({
        method: "post",
        url: API_URL,
        data: data,
        headers: {
          Authorizationcatalog: `Bearer ${token}`,
        },
      });

      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
        setIsFeedbackOpen(false);

        if (selectedOrder && selectedOrder.orderId === orderToRate.orderId) {
          setSelectedOrder((prev: OrderDetailsResponse | null) =>
            prev
              ? {
                  ...prev,
                  feedback: {
                    feedbackStatus: selectedLabel,
                    comments: comments,
                  },
                }
              : prev
          );
        }

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderToRate.orderId
              ? {
                  ...order,
                  feedback: {
                    feedbackStatus: selectedLabel,
                    comments: comments,
                  },
                }
              : order
          )
        );

        setSelectedLabel("");
        setComments("");
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
    // Enhanced purple palette with shadow effects
    "0": "bg-purple-50 text-purple-700 shadow-sm",
    "1": "bg-purple-100 text-purple-800 shadow",
    "2": "bg-indigo-200 text-indigo-800 shadow-md",
    "3": "bg-violet-300 text-violet-900 shadow-md",
    "4":"bg-green-300 text-green-800 font-bold shadow-md ring-1 ring-green-400",
    
    // More vibrant colors with shadows for specific statuses
    "5": "bg-red-200 text-red-700 shadow-md",
    "6": "bg-amber-200 text-amber-700 shadow-md",
    "7": "bg-sky-200 text-sky-700 shadow-md",
    
    // Special statuses with more distinctive styling
    "PickedUp": "bg-emerald-200 text-emerald-700 shadow-md",
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
      "7": "Exchanged",
      PickedUp: "Picked up",
    };
    return statusMap[status] || "Unknown";
  };

   const handleSelectTimeSlot = (date: string, timeSlot: string, dayOfWeek: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSelectedDay(dayOfWeek);
  };

  const updateDeliveryTimeSlot = async () => {
    if (!selectedOrder || !selectedDay || !selectedDate) {
      message.warning("Please select a delivery day");
      return;
    }
  
    // Find the selected slot to check availability
    const currentSelectedSlot = timeSlotsForTwoDays.find(slot => slot.dayOfWeek === selectedDay);
  
    // Check if selected slot is available
    if (!currentSelectedSlot || !currentSelectedSlot.isAvailable) {
      message.error("The selected day is not available for delivery");
      return;
    }
  
    // Check if a time slot has been selected
    if (!selectedTimeSlot) {
      message.warning("Please select a time slot");
      return;
    }
  
    // Add GA tracking for updated delivery time
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "update_delivery_time", {
        order_id: selectedOrder?.orderId,
        day_of_week: selectedDay,
        time_slot: selectedTimeSlot
      });
    }
  
    setTimeSlotUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        message.error("User ID is missing");
        return;
      }
  
      const requestUrl = `${BASE_URL}/order-service/userSelectedDiffslot`;
  
      const requestBody = {
        dayOfWeek: selectedDay,
        expectedDeliveryDate: selectedDate,
        orderId: selectedOrder.orderId,
        timeSlot: selectedTimeSlot,
        userId: userId,
      };
  
      const response = await axios.patch(requestUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout to prevent hanging requests
      });
  
      if (response.data && (response.data.error || response.data.message === "error")) {
        throw new Error(response.data.message || "Server returned an error");
      }
  
      // Update the selected order with the new time slot information
      setSelectedOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          dayOfWeek: selectedDay,
          timeSlot: selectedTimeSlot,
          expectedDeliveryDate: selectedDate,
        };
      });
  
      // Show success message
      setTimeSlotUpdateSuccess(true);
      message.success("Delivery time updated successfully");
  
      // Close popup after 2 seconds
      setTimeout(() => {
        setTimeSlotUpdateSuccess(false);
        setIsEditingDeliveryTime(false);
        setShowTimeSlotPopup(false);
      }, 2000);
  
      // Refresh orders list
      if (localStorage.getItem("userId")) {
        fetchOrders(localStorage.getItem("userId") || "");
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      message.error("Failed to update delivery time. Please try again later.");
    } finally {
      setTimeSlotUpdating(false);
    }
  };

  // This component is the Edit Delivery Time Modal template
  const EditDeliveryTimeModal = () => {
    // Find the selected slot for availability check
    const currentSelectedSlot = timeSlotsForTwoDays.find(slot => slot.dayOfWeek === selectedDay);

    return isEditingDeliveryTime && selectedOrder ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-semibold">Update Delivery Time</h2>
            <button
              onClick={() => setIsEditingDeliveryTime(false)}
              className="p-1 hover:bg-purple-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {timeSlotUpdateSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delivery Time Updated
                </h3>
                <p className="text-gray-600 mb-6">
                  Your delivery time has been successfully updated.
                </p>
                <button
                  onClick={() => setIsEditingDeliveryTime(false)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Update Delivery Day
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose your preferred delivery day
                    </p>
                  </div>
                  {isLoading2 ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                    </div>
                  ) : (
                    <>
                      {/* Use the improved day selection list component */}
                      <DaySelectionList />

                      {/* Render the time slot popup */}
                      <TimeSlotPopupModal />

                      {/* Display selected time if any */}
                      <EnhancedDeliveryTime />

                      {/* Instructions for unavailable slots */}
                      {currentSelectedSlot && !currentSelectedSlot.isAvailable && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 mr-2 text-orange-600 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              This day is currently unavailable for delivery. Please select a different day.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex space-x-3 mt-6">
                        <button
                          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                          onClick={() => setIsEditingDeliveryTime(false)}
                        >
                          Cancel
                        </button>
                        {selectedTimeSlot && selectedDay && (
                          <button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-purple-300 flex items-center justify-center shadow-sm"
                            onClick={updateDeliveryTimeSlot}
                            disabled={timeSlotUpdating || !currentSelectedSlot?.isAvailable}
                          >
                            {timeSlotUpdating ? (
                              <span className="flex items-center justify-center">
                                <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                                Updating...
                              </span>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Confirm
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    ) : null;
  };

 const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const formatDateOnly = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleWriteToUs = () => {
    if (selectedOrder) {
      localStorage.setItem("selectedOrderId", selectedOrder.orderId);
      if (selectedOrder.newOrderId) {
        localStorage.setItem("selectedOrderNewId", selectedOrder.newOrderId);
      } else {
        localStorage.removeItem("selectedOrderNewId");
      }

      navigate(`/main/writeToUs`, {
        state: {
          orderId: selectedOrder.orderId,
          orderNewId: selectedOrder.newOrderId,
          fromOrdersPage: true,
        },
      });

      setIsDetailsOpen(false);
    }
  };

  const openFeedbackModal = (order: OrderDetailsResponse) => {
    if (order.feedback) return;

    setOrderToRate(order);
    setIsFeedbackOpen(true);
    setSelectedLabel("");
    setComments("");
  };

  const closeFeedbackModal = () => {
    setIsFeedbackOpen(false);
    setOrderToRate(null);
    setSelectedLabel("");
    setComments("");
  };

  const formatDeliveryDate = (dateString: string): string => {
    if (!dateString) return "";
    if (dateString === "N/A") return "";

    try {
      // Handle DD-MM-YYYY format
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split("-").map(Number);

        // Use the correct month name
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Return formatted date
        return `${day} ${monthNames[month - 1]} ${year}`;
      }

      // Handle date object format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  const filteredOrders = allOrders
    .filter((order) => {
      // EXCLUDE exchanged orders unless explicitly showing them
      if (!showExchangeOrders && order.orderStatus === "7") return false;

      const matchesSearch =
        searchQuery === "" ||
        (order.orderId &&
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.newOrderId &&
          order.newOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        getStatusText(order.orderStatus).toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      }
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    });

  const feedbackOptions = [
    { label: "EXCELLENT", emoji: "😍", text: "Loved it!" },
    { label: "GOOD", emoji: "😊", text: "Satisfied" },
    { label: "AVERAGE", emoji: "😐", text: "Neutral" },
    { label: "BELOWAVERAGE", emoji: "😕", text: "Disappointed" },
    { label: "POOR", emoji: "😞", text: "Very Disappointed" },
  ];

  const getFeedbackDisplay = (feedbackStatus: string) => {
    const option = feedbackOptions.find((opt) => opt.label === feedbackStatus);
    return option || { emoji: "🙂", text: "Feedback Provided" };
  };

  const handleDaySelection = (slot: TimeSlot) => {
    // Always set the active tab regardless of availability (for UI purposes)
    setActiveTab(slot.id);
    setSelectedDay(slot.dayOfWeek);
    setSelectedDate(slot.date || "");
  
    // Always show the time slot popup so we can show an unavailable message if needed
    setShowTimeSlotPopup(true);
  };

  const EnhancedDeliveryTime: React.FC = () => {
  // If nothing selected, don't show anything
  if (!selectedDay || !selectedDate) {
    return null;
  }

  // Find the selected slot to check availability
  const currentSelectedSlot = timeSlotsForTwoDays.find(slot => slot.dayOfWeek === selectedDay);

  // Special case for unavailable slots
  if (currentSelectedSlot && !currentSelectedSlot.isAvailable) {
    return (
      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <p className="text-sm text-gray-700 font-medium mb-2">Selected Day (Unavailable):</p>
        <div className="flex items-center mt-1">
          <CalendarDays className="w-4 h-4 mr-2 text-orange-600" />
          <span className="font-medium">
            {formatDayOfWeek(selectedDay)}, {formatDeliveryDate(selectedDate)}
          </span>
        </div>
        <div className="flex items-center mt-3 text-orange-700">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">This day is not available for delivery</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Please select another day from the list above.
        </p>
      </div>
    );
  }

  // Normal case for available slots with selected time
  if (selectedTimeSlot) {
    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-700 font-medium mb-2">Selected Delivery Time:</p>
        <div className="flex items-center mt-1">
          <CalendarDays className="w-4 h-4 mr-2 text-purple-600" />
          <span className="font-medium">
            {formatDayOfWeek(selectedDay)}, {formatDeliveryDate(selectedDate)}
          </span>
        </div>
        <div className="flex items-center mt-1">
          <Clock className="w-4 h-4 mr-2 text-purple-600" />
          <span>{selectedTimeSlot}</span>
        </div>
      </div>
    );
  }

  // Available day selected but no time slot yet
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <p className="text-sm text-gray-700 font-medium mb-2">Selected Day:</p>
      <div className="flex items-center mt-1">
        <CalendarDays className="w-4 h-4 mr-2 text-blue-600" />
        <span className="font-medium">
          {formatDayOfWeek(selectedDay)}, {formatDeliveryDate(selectedDate)}
        </span>
      </div>
      <div className="flex items-center mt-2 text-blue-700">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {currentSelectedSlot?.isAvailable
            ? "Please select a time slot"
            : "This day is unavailable for delivery"}
        </span>
      </div>
    </div>
  );
};
  

const TimeSlotPopupModal: React.FC = () => {
  if (!showTimeSlotPopup) return null;

  const selectedSlot = timeSlotsForTwoDays.find(slot => slot.id === activeTab);

  // Only proceed if we have a selected slot
  if (!selectedSlot) return null;

  // Check if this slot is available according to our updated understanding
  if (!selectedSlot.isAvailable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-semibold">
              Unavailable Day
            </h2>
            <button
              onClick={() => setShowTimeSlotPopup(false)}
              className="p-1 hover:bg-red-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="mb-4">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                This day is unavailable for delivery
              </h3>
              <p className="text-gray-600 mb-4">
                We're sorry, but {formatDayOfWeek(selectedSlot.dayOfWeek)} is currently not available for delivery.
                Please select a different day.
              </p>

              <button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => setShowTimeSlotPopup(false)}
              >
                Select Another Day
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get non-empty and non-duplicate time slots
  const availableTimeSlots = [
    selectedSlot.timeSlot1,
    selectedSlot.timeSlot2,
    selectedSlot.timeSlot3,
    selectedSlot.timeSlot4,
  ]
  .filter(Boolean) // Remove empty slots
  .filter((slot, index, self) => self.indexOf(slot) === index); // Remove duplicates

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">
            Select Time Slot
          </h2>
          <button
            onClick={() => setShowTimeSlotPopup(false)}
            className="p-1 hover:bg-purple-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <CalendarDays className="w-5 h-5 mr-2 text-purple-500" />
              <span className="font-medium">
                {selectedSlot.isToday
                  ? "Today"
                  : formatDayOfWeek(selectedSlot.dayOfWeek)
                } - {formatDeliveryDate(selectedSlot.date || "")}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {availableTimeSlots.map((timeSlot, index) => (
                <div
                  key={`timeSlot-${index}`}
                  className={`py-4 px-5 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition-all ${selectedTimeSlot === timeSlot &&
                      selectedDate === selectedSlot.date &&
                      selectedDay === selectedSlot.dayOfWeek
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-white"
                    }`}
                  onClick={() =>
                    handleSelectTimeSlot(
                      selectedSlot.date || "",
                      timeSlot,
                      selectedSlot.dayOfWeek
                    )
                  }
                >
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="font-medium text-lg">
                      {timeSlot}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex space-x-3">
            <button
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={() => setShowTimeSlotPopup(false)}
            >
              Back
            </button>
            <button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-purple-300 flex items-center justify-center shadow-sm"
              onClick={updateDeliveryTimeSlot}
              disabled={
                timeSlotUpdating ||
                !selectedDay ||
                !selectedTimeSlot ||
                !selectedDate
              }
            >
              {timeSlotUpdating ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                  Updating...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DaySelectionList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-3 mb-4">
      {timeSlotsForTwoDays.map((slot) => {
        const isActive = activeTab === slot.id;
        // Here we're using the direct value of isAvailable, no need to invert
        const shouldShowDay = slot.isAvailable;

        return (
          <button
            key={`day-${slot.id}`}
            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${shouldShowDay
                ? `hover:bg-purple-50 hover:border-purple-500 ${isActive ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`
                : "border-gray-200 bg-gray-50 opacity-80"
              }`}
            onClick={() => handleDaySelection(slot)}
          >
            <div className="flex items-center">
              {shouldShowDay ? (
                <CalendarDays className="w-5 h-5 mr-3 text-purple-500" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 text-orange-500" />
              )}
              <div className="text-left">
                <span className={`font-medium ${shouldShowDay ? "text-gray-900" : "text-gray-500"} block`}>
                  {slot.isToday ? "Today" : formatDayOfWeek(slot.dayOfWeek)}
                  {!shouldShowDay && " (Unavailable)"}
                </span>
                <span className="text-sm text-gray-500">
                  {slot.date ? formatDeliveryDate(slot.date) : ""}
                </span>
              </div>
            </div>
            {shouldShowDay ? (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            ) : (
              <X className="h-5 w-5 text-orange-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};



  //helper function for matching the exchanged order id's with their original order id's
  const findMatchingDeliveredOrderId = (exchangeOrderId: string) => {
    const last4 = exchangeOrderId.slice(-4);
    const deliveredMatch = allOrders.find(
      (o) => o.orderStatus === "4" && o.orderId.slice(-4) === last4
    );
    return deliveredMatch?.orderId || null;
  };

  const handleExchangeOrderClick = async (exchangeOrderId: string) => {
    const matchedId = findMatchingDeliveredOrderId(exchangeOrderId);
    if (matchedId) {
      await fetchOrderDetails(matchedId);
      setSelectedOrder((prev) =>
        prev ? { ...prev, isFromExchangeTab: true } : prev
      );
      setIsDetailsOpen(true);
    } else {
      message.warning("Related original order not found.");
    }
  };

  const hasMatchingExchangeOrder = (originalOrderId: string): boolean => {
    const last4 = originalOrderId.slice(-4);
    console.log("Checking if regular order has already been exchanged:");
    console.log("Original full order ID:", originalOrderId);
    console.log("Last 4 digits:", last4);
    console.log("All exchange orders in allOrders array:");

    allOrders.forEach((order) => {
      if (order.orderStatus === "7") {
        console.log("→ Exchange Order:", {
          orderId: order.orderId,
          newOrderId: order.newOrderId,
          matches: order.orderId === last4 || order.newOrderId === last4,
        });
      }
    });

    return allOrders.some((order) => {
      return (
        order.orderStatus === "7" &&
        (order.orderId?.toLowerCase() === last4.toLowerCase() ||
          order.newOrderId?.toLowerCase() === last4.toLowerCase())
      );
    });
  };

  const ExchangeOrdersTable: React.FC = () => {
    const exchangeOrders = filteredOrders.filter(
      (order) => order.orderStatus === "7"
    );

    if (exchangeOrders.length === 0) {
      return (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm">
          <Package2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto" />
          <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium text-gray-900">
            No exchanged orders found
          </h3>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
            No orders have been exchanged yet.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-black-600 uppercase tracking-wider">
                  Items
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-black-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exchangeOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleExchangeOrderClick(order.orderId)}
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      {order.orderId.slice(-8)}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderItems[0]?.itemName || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateOnly(order.orderDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.grandTotal} (Paid)
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                  </td>
                  {/* <td className="px-4 py-4 text-sm text-gray-600">
                    <ul className="list-disc list-inside">
                      {order.orderItems.map((item) => (
                        <li key={item.itemId}>
                          {item.itemName} (Qty: {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td> */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleExchangeOrderClick(order.orderId)}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm text-gray-600 mb-1 block">
                Search Order
              </label>
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
                  <option value="exchanged">Exchanged</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="text-sm text-gray-600 mb-1 block">
                Sort By
              </label>
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

            <div className="flex-1 min-w-[140px]">
              <label className="text-sm text-gray-600 mb-1 block"> </label>
              <button
                onClick={handleShowExchangeOrders}
                className={`w-full px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors flex items-center justify-center ${
                  showExchangeOrders
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-purple-600 text-white border-purple-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Loading...
                  </>
                ) : showExchangeOrders ? (
                  "Show All Orders"
                ) : (
                  "Exchanged Orders"
                )}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : showExchangeOrders ? (
          <ExchangeOrdersTable />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm">
            <Package2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto" />
            <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium text-gray-900">
              No orders found
            </h3>
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
                      <h3 className="text-base sm:text-lg font-semibold text-purple-900">
                        #{order.newOrderId || order.orderId.slice(-4)}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Total Amount
                      </span>
                      <span className="text-xs sm:text-sm font-medium">
                        ₹{order.grandTotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Payment
                      </span>
                      <span className="text-xs sm:text-sm font-medium">
                        {order.paymentType === 2 ? "Online" : "COD"}
                      </span>
                    </div>
                    {order.orderStatus !== "6" && order.orderStatus !== "7" && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Delivery
                          </span>
                          {["0", "1", "2", "3"].includes(order.orderStatus) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                openEditDeliveryTime();
                              }}
                              className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span>Change</span>
                            </button>
                          )}
                        </div>
                        {order.expectedDeliveryDate ||
                        order.dayOfWeek ||
                        order.timeSlot ? (
                          <div className="mt-1 bg-purple-50 rounded-md p-1.5 text-xs sm:text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-700 mr-1.5" />
                              <span className="font-medium">
                                {order.expectedDeliveryDate &&
                                  formatDeliveryDate(
                                    order.expectedDeliveryDate
                                  )}
                                {order.dayOfWeek &&
                                  !order.expectedDeliveryDate &&
                                  formatDayOfWeek(order.dayOfWeek)}
                                {order.timeSlot && (
                                  <>
                                    {" "}
                                    •{" "}
                                    <span className="font-normal">
                                      {order.timeSlot}
                                    </span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 text-xs sm:text-sm text-gray-500 italic">
                            Not scheduled
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 cursor-pointer transition-all duration-300"
                    onClick={() => fetchOrderDetails(order.orderId)}
                  >
                    <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-white">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base font-medium">
                        View Order Details
                      </span>
                    </div>
                  </div>
                  {order.orderStatus === "4" &&
                    !showExchangeOrders &&
                    !order.isFromExchangeTab &&
                    !hasMatchingExchangeOrder(order.orderId) &&
                    order.orderItems?.some((item) => !item.isExchanged) && (
                      <div
                        className="bg-white hover:bg-blue-50 cursor-pointer transition-all duration-300"
                        onClick={() => openExchangeModal(order, false)}
                      >
                        <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-blue-800">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-sm sm:text-base font-medium">
                            Request Exchange
                          </span>
                        </div>
                      </div>
                    )}

                  {order.orderStatus === "4" && (
                    <div
                      className={`${
                        order.feedback
                          ? "bg-purple-100 cursor-default"
                          : "bg-white hover:bg-purple-50 cursor-pointer"
                      } transition-all duration-300`}
                      onClick={
                        order.feedback
                          ? undefined
                          : () => openFeedbackModal(order)
                      }
                    >
                      <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-purple-800">
                        {order.feedback ? (
                          <>
                            <span className="text-lg sm:text-xl">
                              {
                                getFeedbackDisplay(
                                  order.feedback.feedbackStatus
                                ).emoji
                              }
                            </span>
                            <span className="text-sm sm:text-base font-medium">
                              {
                                getFeedbackDisplay(
                                  order.feedback.feedbackStatus
                                ).text
                              }
                            </span>
                          </>
                        ) : (
                          <>
                            <SmilePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base font-medium">
                              Rate Your Experience!
                            </span>
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

    {isFeedbackOpen && orderToRate && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 z-[1000] transition-opacity duration-300">
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full shadow-xl transform transition-all duration-300 ease-out mx-auto"
      style={{
        animation: "scaleIn 0.3s ease-out forwards"
      }}
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-bold">Rate Your Experience</h2>
        <button
          onClick={closeFeedbackModal}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close feedback form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4">
        {feedbackSuccess ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3" 
                 style={{ animation: "pulse 1.5s ease-out" }}>
              <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Your feedback has been submitted.
            </p>
            <button
              onClick={closeFeedbackModal}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md transition-all duration-200 text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Order #{orderToRate.newOrderId || orderToRate.orderId?.slice(-4)}
              </p>
            </div>
            
            {/* Cool Rating Interface */}
            <div className="mb-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <ThumbsDown className="w-3 h-3" />
                  <span>Poor</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Excellent</span>
                  <ThumbsUp className="w-3 h-3" />
                </div>
              </div>
              
              <div className="flex justify-between items-center my-2 px-2">
                {feedbackOptions.map((option, index) => {
                  // Define gradient colors inline
                  const gradients = [
                    "#ff5f6d, #ffc371", // Poor (red-orange)
                    "#ff9a44, #fc6076", // Below Average (orange-pink)
                    "#f9d423, #ff4e50", // Average (yellow-red)
                    "#00b09b, #96c93d", // Good (teal-green)
                    "#42275a, #734b6d"  // Excellent (purple)
                  ];
                  const gradientColor = gradients[index] || "#6b46c1, #8b5cf6";
                  
                  return (
                    <button
                      key={option.label}
                      className={`relative transform transition-all duration-200 ${
                        selectedLabel === option.label ? "scale-125 z-10" : "hover:scale-110"
                      }`}
                      onClick={() => setSelectedLabel(option.label)}
                      style={{ 
                        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                      }}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedLabel === option.label 
                            ? "animate-pulse-subtle" 
                            : ""
                        }`}
                        style={{
                          background: selectedLabel === option.label 
                            ? `linear-gradient(45deg, ${gradientColor})` 
                            : "transparent",
                          boxShadow: selectedLabel === option.label 
                            ? "0 0 15px rgba(107, 70, 193, 0.5)" 
                            : "none"
                        }}
                      >
                        <span className="text-2xl filter drop-shadow-sm">
                          {option.emoji}
                        </span>
                      </div>
                      {selectedLabel === option.label && (
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-purple-600 dark:text-purple-400 whitespace-nowrap">
                          {option.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="h-6"></div> {/* Spacer for selected label text */}
            </div>
            
            <div className="mb-4">
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Additional comments (optional)"
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            
            <button
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 text-sm ${
                !selectedLabel 
                  ? "opacity-60 cursor-not-allowed" 
                  : "hover:from-purple-700 hover:to-indigo-700"
              }`}
              onClick={submitFeedback}
              disabled={feedbackSubmitting || !selectedLabel}
            >
              {feedbackSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}

        {isDetailsOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 z-50 overflow-auto">
            <div className="bg-white rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto scrollbar-hidden relative">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-3 sticky top-0 flex justify-between items-center rounded-t-xl z-10">
                <h2 className="text-lg font-bold">Order Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors group"
                    aria-label="Download Invoice"
                    title="Download Invoice"
                  >
                    <FileDown className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {selectedOrder?.isFromExchangeTab && (
                <div className="mt-2 flex justify-center mb-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-400 text-yellow-700 rounded-xl text-center w-full max-w-md">
                    <strong>Note:</strong> All items in this order have been
                    exchanged.
                  </div>
                </div>
              )}
              <div className="p-3 sm:p-4 space-y-4">
                <div className="flexitems-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-100">
                    {selectedOrder.orderItems[0]?.itemUrl ? (
                      <img
                        src={selectedOrder.orderItems[0].itemUrl}
                        alt="Order item"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-50">
                        <Package className="h-6 w-6 text-purple-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Order #
                      {selectedOrder.newOrderId ||
                        selectedOrder.orderId.slice(-4)}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {formatDate(selectedOrder.orderDate)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Full Order ID</span>
                      <span>{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>₹{selectedOrder.grandTotal}</span>
                    </div>
                    {selectedOrder.orderStatus === "7" && (
                      <>
                        <div className="flex justify-between">
                          <span>Exchange Request Time</span>
                          <span>
                            {selectedOrder.orderHistory.find(
                              (history) => history.exchangeRequestDate
                            )?.exchangeRequestDate
                              ? formatDate(
                                  selectedOrder.orderHistory.find(
                                    (history) => history.exchangeRequestDate
                                  )?.exchangeRequestDate
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Date</span>
                          <span>
                            {selectedOrder.orderHistory.find(
                              (history) => history.deliveredDate
                            )?.deliveredDate
                              ? formatDate(
                                  selectedOrder.orderHistory.find(
                                    (history) => history.deliveredDate
                                  )?.deliveredDate
                                )
                              : selectedOrder.expectedDeliveryDate
                              ? formatDeliveryDate(
                                  selectedOrder.expectedDeliveryDate
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Order Progress
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.orderHistory.map((history, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {history.placedDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-600">
                              Placed: {formatDate(history.placedDate)}
                            </span>
                          </div>
                        )}
                        {history.acceptedDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-600">
                              Accepted: {formatDate(history.acceptedDate)}
                            </span>
                          </div>
                        )}
                        {history.assignedDate && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-600">
                              Assigned: {formatDate(history.assignedDate)}
                            </span>
                          </div>
                        )}
                        {history.deliveredDate && (
                          <div className="flex items-center gap-2">
                            <CheckCheck className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-600">
                              Delivered: {formatDate(history.deliveredDate)}
                            </span>
                          </div>
                        )}
                        {history.canceledDate && (
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-gray-600">
                              Cancelled: {formatDate(history.canceledDate)}
                            </span>
                          </div>
                        )}
                        {history.rejectedDate && (
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-gray-600">
                              Rejected: {formatDate(history.rejectedDate)}
                            </span>
                          </div>
                        )}
                        {history.pickUpDate && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-600">
                              Picked Up: {formatDate(history.pickUpDate)}
                            </span>
                          </div>
                        )}
                        {history.exchangeRequestDate && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-600">
                              Exchange Requested:{" "}
                              {formatDate(history.exchangeRequestDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedOrder.orderStatus !== "5" &&
                    selectedOrder.orderStatus !== "6" &&
                    selectedOrder.orderStatus !== "7" && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${getProgressPercentage(
                                selectedOrder.orderStatus
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Delivery Details
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-purple-700 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        {selectedOrder.orderAddress ? (
                          <p>
                            {selectedOrder.orderAddress.flatNo || "N/A"},{" "}
                            {selectedOrder.orderAddress.address || "N/A"},{" "}
                            {selectedOrder.orderAddress.landMark || "N/A"},{" "}
                            {selectedOrder.orderAddress.pincode || "N/A"}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">
                            Address not available
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-700" />
                      <span>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedOrder.customerMobile || "N/A"}
                      </span>
                    </div>
                    {selectedOrder.orderStatus !== "6" &&
                      selectedOrder.orderStatus !== "7" && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-700" />
                          <span>
                            <span className="font-medium">
                              Expected Delivery:
                            </span>{" "}
                            {selectedOrder.expectedDeliveryDate
                              ? formatDeliveryDate(
                                  selectedOrder.expectedDeliveryDate
                                )
                              : selectedOrder.dayOfWeek
                              ? formatDayOfWeek(selectedOrder.dayOfWeek)
                              : "Not scheduled"}
                            {selectedOrder.timeSlot &&
                              ` • ${selectedOrder.timeSlot}`}
                          </span>
                        </div>
                      )}
                  </div>
                  {["0", "1", "2", "3"].includes(selectedOrder.orderStatus) && (
                    <button
                      onClick={openEditDeliveryTime}
                      className="mt-3 flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-xs font-medium"
                    >
                      <Clock className="h-4 w-4" />
                      Change Delivery Time
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Items ({selectedOrder.orderItems.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-b-0"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-100">
                          {item.itemUrl ? (
                            <img
                              src={item.itemUrl}
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-50">
                              <Package className="h-6 w-6 text-purple-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs font-medium text-gray-900">
                            {item.itemName}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {item.weight} {item.itemUnit || "KG"} • Qty:{" "}
                            {item.quantity}
                          </p>
                          <p className="text-xs font-medium">
                            ₹{(item.quantity * item.singleItemPrice).toFixed(2)}
                          </p>
                          {item.isExchanged && (
                            <p className="text-xs text-blue-600 mt-1">
                              Exchanged
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Payment Summary
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        ₹{selectedOrder.subTotal || selectedOrder.grandTotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    {selectedOrder.walletAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Wallet Amount</span>
                        <span>-₹{selectedOrder.walletAmount}</span>
                      </div>
                    )}
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Coupon Discount</span>
                        <span>-₹{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                    {selectedOrder.gstAmount > 0 && (
                      <div className="flex justify-between">
                        <span>GST Charges</span>
                        <span>₹{selectedOrder.gstAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{selectedOrder.grandTotal}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedOrder.paymentType === 2 ? (
                        <CreditCard className="h-4 w-4 text-purple-700" />
                      ) : (
                        <Banknote className="h-4 w-4 text-purple-700" />
                      )}
                      <span>
                        Paid via{" "}
                        {selectedOrder.paymentType === 2
                          ? "Online"
                          : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.orderStatus === "4" && (
                  <div className="space-y-3">
                    {selectedOrder.feedback ? (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Your Feedback
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {
                              getFeedbackDisplay(
                                selectedOrder.feedback.feedbackStatus
                              ).emoji
                            }
                          </span>
                          <span className="text-sm font-medium">
                            {
                              getFeedbackDisplay(
                                selectedOrder.feedback.feedbackStatus
                              ).text
                            }
                          </span>
                        </div>
                        {selectedOrder.feedback.comments && (
                          <p className="text-xs text-gray-600 mt-2">
                            {selectedOrder.feedback.comments}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => openFeedbackModal(selectedOrder)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <SmilePlus className="h-4 w-4" />
                        Rate Your Experience
                      </button>
                    )}
                    {selectedOrder.orderStatus === "4" &&
                      selectedOrder.orderItems &&
                      selectedOrder.orderItems.length > 0 &&
                      !selectedOrder.isFromExchangeTab &&
                      !hasMatchingExchangeOrder(selectedOrder.orderId) &&
                      selectedOrder.orderItems.some(
                        (item) => !item.isExchanged
                      ) && (
                        <button
                          onClick={() => openExchangeModal(selectedOrder, true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Request Exchange
                        </button>
                      )}
                  </div>
                )}

                <button
                  onClick={handleWriteToUs}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
{isFeedbackOpen && orderToRate && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[1000] transition-opacity duration-300">
    <div 
      className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 ease-out mx-auto overflow-hidden"
      style={{
        animation: "fadeInUp 0.4s ease-out forwards"
      }}
    >
      {/* Header with subtle pattern background */}
      <div 
        className="bg-indigo-600 text-white p-4 relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 150%, rgba(255, 255, 255, 0.15) 0%, transparent 40%)"
        }}
      >
        <div className="flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold">How was your experience?</h2>
          <button
            onClick={closeFeedbackModal}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close feedback form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Abstract decoration */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/30 rounded-full blur-xl"></div>
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-lg"></div>
      </div>
      
      <div className="p-5">
        {feedbackSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4" 
                 style={{ animation: "pulse 2s infinite ease-in-out" }}>
              <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Feedback Received
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Thank you for taking the time to share your thoughts with us!
            </p>
            <button
              onClick={closeFeedbackModal}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-lg text-sm font-medium mb-1">
                Order #{orderToRate.newOrderId || orderToRate.orderId?.slice(-4)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your feedback helps us improve our service
              </p>
            </div>
            
            {/* Rating Interface */}
            <div className="mb-6">
              <div className="flex justify-center items-center space-x-2 mb-6">
                {feedbackOptions.map((option, index) => {
                  // Define vibrant complementary gradient pairs
                  const gradients = [
                    "from-rose-500 to-orange-400", // Poor
                    "from-orange-400 to-amber-500", // Below Average
                    "from-amber-400 to-yellow-300", // Average
                    "from-teal-400 to-emerald-500", // Good
                    "from-indigo-500 to-purple-500"  // Excellent
                  ];
                  
                  return (
                    <button
                      key={option.label}
                      className={`group relative transform transition-all duration-300 ${
                        selectedLabel === option.label ? "scale-110 z-10" : "hover:scale-105"
                      }`}
                      onClick={() => setSelectedLabel(option.label)}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          selectedLabel === option.label 
                            ? `bg-gradient-to-br ${gradients[index]}` 
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        style={{
                          boxShadow: selectedLabel === option.label 
                            ? "0 5px 15px rgba(79, 70, 229, 0.4)" 
                            : "none",
                          transform: selectedLabel === option.label
                            ? "translateY(-3px)"
                            : "none"
                        }}
                      >
                        <span className="text-2xl">
                          {option.emoji}
                        </span>
                      </div>
                      <div 
                        className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                          selectedLabel === option.label
                            ? "opacity-100 text-indigo-600 dark:text-indigo-400"
                            : "opacity-0 group-hover:opacity-75 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            
            </div>
            
            <div className="mt-20 mb-5 relative">
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us more about your experience (optional)"
                className="w-full p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {comments.length}/200
              </div>
            </div>
            
            <button
              className={`w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 text-sm ${
                !selectedLabel 
                  ? "opacity-60 cursor-not-allowed from-gray-400 to-gray-500" 
                  : "hover:from-indigo-700 hover:to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30"
              }`}
              onClick={submitFeedback}
              disabled={feedbackSubmitting || !selectedLabel}
            >
              {feedbackSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Processing...
                </span>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}

        {isExchangeModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[95vh] overflow-y-auto scrollbar-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Request Exchange</h2>
                <button
                  onClick={closeExchangeModal}
                  className="p-1 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                {exchangeSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Exchange Request Submitted
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your exchange request has been successfully submitted.
                    </p>
                    <button
                      onClick={closeExchangeModal}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Exchange Items for Order #
                        {selectedOrder.newOrderId ||
                          selectedOrder.orderId?.slice(-4)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Select items to exchange and provide a reason.
                      </p>
                    </div>
                    {selectedOrder.orderItems &&
                    selectedOrder.orderItems.length > 0 ? (
                      <div className="space-y-4">
                        {selectedOrder.orderItems.map((item, index) => (
                          <div
                            key={item.itemId}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-100">
                                {item.itemUrl ? (
                                  <img
                                    src={item.itemUrl}
                                    alt={item.itemName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                    <Package className="h-6 w-6 text-purple-300" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.itemName}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {item.weight} {item.itemUnit || "KG"} • Qty
                                  Available: {item.quantity}
                                  {item.isExchanged && " • Already Exchanged"}
                                </p>
                              </div>
                            </div>
                            {!item.isExchanged ? (
                              <>
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity to Exchange
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.quantity}
                                    value={exchangeItems[index]?.quantity || 1}
                                    onChange={(e) =>
                                      handleExchangeQuantityChange(
                                        item.itemId,
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Exchange
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={exchangeItems[index]?.reason || ""}
                                    onChange={(e) =>
                                      handleExchangeReasonChange(
                                        item.itemId,
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Did not like the quality"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                  ></textarea>
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-blue-600">
                                This item is not eligible for further exchange.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Items Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          This order has no items available for exchange.
                        </p>
                        <button
                          onClick={closeExchangeModal}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    )}
                    {selectedOrder.orderItems &&
                      selectedOrder.orderItems.length > 0 && (
                        <button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-purple-300 mt-6"
                          onClick={submitExchangeRequest}
                          disabled={exchangeSubmitting}
                        >
                          {exchangeSubmitting ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                              Submitting...
                            </span>
                          ) : (
                            "Submit Exchange Request"
                          )}
                        </button>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <EditDeliveryTimeModal />
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
