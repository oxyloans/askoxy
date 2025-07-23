import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Package,
  Package2,
  MapPin,
  Phone,
  ShoppingBag,
  CheckCircle,
  Truck,
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
import AddressUpdateModal from "./AddressUpdate";

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

  //state declarations for the update address
  const [isAddressUpdateModalOpen, setIsAddressUpdateModalOpen] =
    useState<boolean>(false);
  const [addressFormData, setAddressFormData] = useState<{
    flatNo: string;
    landMark: string;
    address: string;
    pincode: string;
    latitude: number;
    longitude: number;
    area: string;
    houseType: string;
    residenceName: string;
  }>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
    latitude: 0,
    longitude: 0,
    area: "",
    houseType: "",
    residenceName: "",
  });
  const [addressFormErrors, setAddressFormErrors] = useState<{
    flatNo: string;
    landMark: string;
    address: string;
    pincode: string;
  }>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
  });
  const [isAddressUpdating, setIsAddressUpdating] = useState<boolean>(false);
  const [addressUpdateSuccess, setAddressUpdateSuccess] =
    useState<boolean>(false);

  //helper function to check 24 hour window
  const isWithin24Hours = (placedDate: string | null): boolean => {
    if (!placedDate) return false;
    const orderDate = new Date(placedDate);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - orderDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24;
  };

  //state declarations for fetching the delivery boy details
  const [deliveryBoyDetails, setDeliveryBoyDetails] = useState<{
    deliveryBoyName: string;
    deliveryBoyMobile: string;
  } | null>(null);

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

//   const handleDownloadInvoice = (order: OrderDetailsResponse) => {
//     try {
//       const orderDate = new Date(order.orderDate);
//       const formattedDate = orderDate.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });

//       // Add GA tracking for invoice download
//       if (typeof window !== "undefined" && window.gtag) {
//         window.gtag("event", "download_invoice", {
//           currency: "INR",
//           order_id: order.newOrderId || order.orderId,
//           value: order.grandTotal,
//         });
//       }

//     const invoiceContent = `
//   INVOICE
//   =============================
//   Order ID: ${order.newOrderId || order.orderId}
//   Date: ${formattedDate}
//   Customer: ${order.customerName}
//   Phone: ${order.customerMobile}
  
//   Items:
//   -----------------------------
//   ${order.orderItems
//     .map(
//       (item) =>
//         `${item.itemName} (${item.weight} ${item.itemUnit || "KGS"}) x ${
//           item.quantity
//         } =₹${Math.round(Number(item.quantity * item.singleItemPrice))}`
//     )
//     .join("\n")}
  
//   -----------------------------
//   Sub Total: ₹${Math.round(Number(order.subTotal || order.grandTotal))}
//   Delivery Fee: ₹${Math.round(Number(order.deliveryFee))}
//   ${order.walletAmount > 0 ? `Wallet Amount: -₹${Math.round(Number(order.walletAmount))}\n` : ""}
//   ${order.discountAmount > 0 ? `Coupon Discount: -₹${Math.round(Number(order.discountAmount))}\n` : ""}
//   ${order.gstAmount > 0 ? `GST Charges: ₹${Math.round(Number(order.gstAmount))}\n` : ""}
  
//   TOTAL: ₹${Math.round(Number(order.grandTotal))}
//   =============================
//   Payment Method: ${order.paymentType === 2 ? "Online Payment" : "Cash on Delivery"}
// `;

//       const blob = new Blob([invoiceContent], { type: "text/plain" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Invoice-${order.newOrderId || order.orderId}.txt`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error generating invoice:", error);
//       alert("Failed to download invoice. Please try again later.");
//     }
//   };


 const handleDownloadInvoice = (order: any) => {
   try {
     if (order?.invoiceUrl) {
       const link = document.createElement("a");
       link.href = order.invoiceUrl;
       link.download = `invoice_${order.orderId}.pdf`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       message.success("Invoice download started.");
     } else {
       console.error("No invoice URL found for order:", order.orderId);
       message.error("No invoice available for this order.");
     }
   } catch (error) {
     console.error("Error downloading invoice:", error);
     message.error("Failed to download invoice. Please try again.");
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

        // Fetch delivery boy details if order is in Assigned (3) or PickedUp status
        await fetchDeliveryBoyDetails(orderId, orderData.orderStatus);

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

  const openEditDeliveryTime = async () => {
    setIsEditingDeliveryTime(true);
    setShowTimeSlotPopup(false); // Initially don't show the time slot popup until day is selected
    await fetchAvailableTimeSlots(selectedOrder?.orderId || "");
  };

  const getNextAvailableDays = (): {
    dayOfWeek: string;
    formattedDay: string;
    date: string;
    isToday: boolean;
  }[] => {
    const days = [];
    // Upper case format for API matching
    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    // Formatted display version
    const formattedDaysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Always start from tomorrow, regardless of the current time
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startDate = tomorrow;

    // Get next 7 days starting from tomorrow
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayOfWeek = daysOfWeek[date.getDay()];
      const formattedDay = formattedDaysOfWeek[date.getDay()];

      // Format date as DD-MM-YYYY for API compatibility
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      days.push({
        dayOfWeek,
        formattedDay,
        date: formattedDate,
        isToday: i === 0 && date.getDate() === today.getDate(),
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
        // Get potential delivery days
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
            // In the API, isAvailable=false means the slot IS available
            const isActuallyAvailable = !apiSlot.isAvailable;

            // Create a processed time slot with all information
            allProcessedTimeSlots.push({
              id: apiSlot.id,
              dayOfWeek: apiSlot.dayOfWeek,
              isAvailable: isActuallyAvailable,
              timeSlot1: apiSlot.timeSlot1?.trim() || "",
              timeSlot2: apiSlot.timeSlot2?.trim() || "",
              timeSlot3: apiSlot.timeSlot3?.trim() || "",
              timeSlot4: apiSlot.timeSlot4?.trim() || "",
              date: dayInfo.date,
              isToday: dayInfo.isToday,
            });
          } else {
            // If not in API response, add the day as unavailable
            allProcessedTimeSlots.push({
              id: Math.random(),
              dayOfWeek: dayInfo.dayOfWeek,
              isAvailable: false,
              timeSlot1: "",
              timeSlot2: "",
              timeSlot3: "",
              timeSlot4: "",
              date: dayInfo.date,
              isToday: dayInfo.isToday,
            });
          }
        }

        // FILTER: Only keep available days
        const availableTimeSlots = allProcessedTimeSlots.filter(
          (slot) => slot.isAvailable
        );

        // Take only up to 3 available days
        const timeSlotSelection = availableTimeSlots.slice(0, 3);

        // If we don't have any available slots, show original slots as unavailable
        const timeSlotsToShow =
          timeSlotSelection.length > 0
            ? timeSlotSelection
            : allProcessedTimeSlots.slice(0, 3);

        // Set the time slots in state
        setAvailableTimeSlots(allProcessedTimeSlots);
        setTimeSlotsForTwoDays(timeSlotsToShow);

        // Initialize slot selection
        if (selectedOrder && timeSlotsToShow.length > 0) {
          const availableSlots = timeSlotsToShow.filter(
            (slot) => slot.isAvailable
          );

          if (selectedOrder.dayOfWeek && selectedOrder.timeSlot) {
            const existingSlot = timeSlotsToShow.find(
              (slot) => slot.dayOfWeek === selectedOrder.dayOfWeek
            );

            if (existingSlot && existingSlot.isAvailable) {
              setSelectedDay(existingSlot.dayOfWeek);
              setSelectedTimeSlot(selectedOrder.timeSlot);
              setSelectedDate(existingSlot.date || "");
            } else if (availableSlots.length > 0) {
              const firstAvailableSlot = availableSlots[0];
              setSelectedDay(firstAvailableSlot.dayOfWeek);
              setSelectedTimeSlot(firstAvailableSlot.timeSlot1);
              setSelectedDate(firstAvailableSlot.date || "");
            }
          } else if (availableSlots.length > 0) {
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

  const SelectedDeliveryTime: React.FC = () => {
    if (!selectedTimeSlot || !selectedDay || !selectedDate) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-700 font-medium mb-2">
          Selected Delivery Time:
        </p>
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

  const formatDayOfWeek = (day: string): string => {
    if (!day || day === "NO_SLOT") return "No Slot Available";

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
      "0": "bg-purple-50 text-purple-600",
      "1": "bg-purple-100 text-purple-700",
      "2": "bg-purple-200 text-purple-800",
      "3": "bg-purple-300 text-purple-900",
      "4": "bg-purple-400 text-purple-950",
      "5": "bg-red-100 text-red-600",
      "6": "bg-orange-100 text-orange-600",
      "7": "bg-blue-100 text-blue-600",
      PickedUp: "bg-green-100 text-green-600",
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

  const handleSelectTimeSlot = (
    date: string,
    timeSlot: string,
    dayOfWeek: string
  ) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSelectedDay(dayOfWeek);
  };

  const updateDeliveryTimeSlot = async () => {
    if (!selectedOrder || !selectedDay || !selectedDate) {
      message.warning("Please select a delivery day");
      return;
    }

    const currentSelectedSlot = timeSlotsForTwoDays.find(
      (slot) => slot.dayOfWeek === selectedDay
    );

    if (!currentSelectedSlot || !currentSelectedSlot.isAvailable) {
      message.error("The selected day is not available for delivery");
      return;
    }

    if (!selectedTimeSlot) {
      message.warning("Please select a time slot");
      return;
    }

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "update_delivery_time", {
        order_id: selectedOrder?.orderId,
        day_of_week: selectedDay,
        time_slot: selectedTimeSlot,
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
        timeout: 10000,
      });

      if (
        response.data &&
        (response.data.error || response.data.message === "error")
      ) {
        throw new Error(response.data.message || "Server returned an error");
      }

      setSelectedOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          dayOfWeek: selectedDay,
          timeSlot: selectedTimeSlot,
          expectedDeliveryDate: selectedDate,
        };
      });

      setTimeSlotUpdateSuccess(true);
      message.success("Delivery time updated successfully");

      setTimeout(() => {
        setTimeSlotUpdateSuccess(false);
        setIsEditingDeliveryTime(false);
        setShowTimeSlotPopup(false);
      }, 2000);

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

  const EditDeliveryTimeModal = () => {
    const currentSelectedSlot = timeSlotsForTwoDays.find(
      (slot) => slot.dayOfWeek === selectedDay
    );

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
                      Select Delivery Day
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
                      <DaySelectionList />
                      <TimeSlotPopupModal />
                      <EnhancedDeliveryTime />
                      {currentSelectedSlot &&
                        !currentSelectedSlot.isAvailable && (
                          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 mr-2 text-orange-600 mt-0.5" />
                              <p className="text-sm text-gray-700">
                                This day is currently unavailable for delivery.
                                Please select a different day.
                              </p>
                            </div>
                          </div>
                        )}
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
                            disabled={
                              timeSlotUpdating ||
                              !currentSelectedSlot?.isAvailable
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
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split("-").map(Number);
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${day} ${monthNames[month - 1]} ${year}`;
      }

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
    setActiveTab(slot.id);
    setSelectedDay(slot.dayOfWeek);
    setSelectedDate(slot.date || "");
    setShowTimeSlotPopup(true);
  };

  const TimeSlotPopupModal: React.FC = () => {
    if (!showTimeSlotPopup) return null;

    const selectedSlot = timeSlotsForTwoDays.find(
      (slot) => slot.id === activeTab
    );

    if (!selectedSlot) return null;

    if (!selectedSlot.isAvailable) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Unavailable Day</h2>
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
                  We're sorry, but {formatDayOfWeek(selectedSlot.dayOfWeek)} is
                  currently not available for delivery. Please select a
                  different day.
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

    const availableTimeSlots = [
      selectedSlot.timeSlot1,
      selectedSlot.timeSlot2,
      selectedSlot.timeSlot3,
      selectedSlot.timeSlot4,
    ].filter(Boolean);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-semibold">Select Time Slot</h2>
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
                    : formatDayOfWeek(selectedSlot.dayOfWeek)}{" "}
                  - {formatDeliveryDate(selectedSlot.date || "")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {availableTimeSlots.map((timeSlot, index) => (
                  <div
                    key={`timeSlot-${index}`}
                    className={`py-4 px-5 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition-all ${
                      selectedTimeSlot === timeSlot &&
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
                      <span className="font-medium text-lg">{timeSlot}</span>
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
          const isAvailable = slot.isAvailable;

          return (
            <button
              key={`day-${slot.id}`}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                isAvailable
                  ? `hover:bg-purple-50 hover:border-purple-500 ${
                      isActive
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`
                  : "border-gray-200 bg-gray-50 opacity-80"
              }`}
              onClick={() => handleDaySelection(slot)}
            >
              <div className="flex items-center">
                {isAvailable ? (
                  <CalendarDays className="w-5 h-5 mr-3 text-purple-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 text-orange-500" />
                )}
                <div className="text-left">
                  <span
                    className={`font-medium ${
                      isAvailable ? "text-gray-900" : "text-gray-500"
                    } block`}
                  >
                    {slot.isToday ? "Today" : formatDayOfWeek(slot.dayOfWeek)}
                    {!isAvailable && " (Unavailable)"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {slot.date ? formatDeliveryDate(slot.date) : ""}
                  </span>
                </div>
              </div>
              {isAvailable ? (
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

  const EnhancedDeliveryTime: React.FC = () => {
    if (!selectedDay || !selectedDate) {
      return null;
    }

    const currentSelectedSlot = timeSlotsForTwoDays.find(
      (slot) => slot.dayOfWeek === selectedDay
    );

    if (currentSelectedSlot && !currentSelectedSlot.isAvailable) {
      return (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-sm text-gray-700 font-medium mb-2">
            Selected Day (Unavailable):
          </p>
          <div className="flex items-center mt-1">
            <CalendarDays className="w-4 h-4 mr-2 text-orange-600" />
            <span className="font-medium">
              {formatDayOfWeek(selectedDay)}, {formatDeliveryDate(selectedDate)}
            </span>
          </div>
          <div className="flex items-center mt-3 text-orange-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              This day is not available for delivery
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Please select another day from the list above.
          </p>
        </div>
      );
    }

    if (selectedTimeSlot) {
      return (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-gray-700 font-medium mb-2">
            Selected Delivery Time:
          </p>
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

  //function to fetch co-ordinates for latitude and longitude
  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  //function to validate the address form
  const validateAddressForm = () => {
    const newFormErrors = {
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo.trim())
      newFormErrors.flatNo = "Flat/House number is required";
    if (!addressFormData.landMark.trim())
      newFormErrors.landMark = "Landmark is required";
    if (!addressFormData.address.trim())
      newFormErrors.address = "Address is required";
    if (!addressFormData.pincode.trim())
      newFormErrors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(addressFormData.pincode))
      newFormErrors.pincode = "Please enter a valid 6-digit PIN code";

    setAddressFormErrors(newFormErrors);
    return !Object.values(newFormErrors).some((error) => error);
  };

  //function to handle update address
  const handleUpdateAddress = async () => {
    if (!validateAddressForm()) return;
    if (!selectedOrder) return;

    try {
      setIsAddressUpdating(true);

      const fullAddress = `${addressFormData.flatNo}, ${addressFormData.landMark}, ${addressFormData.address}, ${addressFormData.pincode}`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        message.error(
          "Unable to find location coordinates. Please check the address."
        );
        return;
      }

      const token = localStorage.getItem("token");
      const requestBody = {
        address: addressFormData.address,
        area: addressFormData.area,
        flatNo: addressFormData.flatNo,
        houseType: addressFormData.houseType,
        landMark: addressFormData.landMark,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        orderId: selectedOrder.orderId,
        pincode: parseInt(addressFormData.pincode),
        residenceName: addressFormData.residenceName,
      };

      await axios.patch(
        `${BASE_URL}/order-service/orderAddressUpdate`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddressUpdateSuccess(true);
      message.success("Address updated successfully!");

      // Update the selected order's address in the state
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderAddress: {
                flatNo: addressFormData.flatNo,
                landMark: addressFormData.landMark,
                address: addressFormData.address,
                pincode: parseInt(addressFormData.pincode),
              },
            }
          : prev
      );

      // Update the orders list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrder.orderId
            ? {
                ...order,
                orderAddress: {
                  flatNo: addressFormData.flatNo,
                  landMark: addressFormData.landMark,
                  address: addressFormData.address,
                  pincode: parseInt(addressFormData.pincode),
                },
              }
            : order
        )
      );

      setTimeout(() => {
        setAddressUpdateSuccess(false);
        setIsAddressUpdateModalOpen(false);
        resetAddressForm();
      }, 2000);
    } catch (error) {
      console.error("Error updating address:", error);
      message.error("Failed to update address. Please try again.");
    } finally {
      setIsAddressUpdating(false);
    }
  };

  //function to reset the form after submission or cancellation.
  const resetAddressForm = () => {
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      latitude: 0,
      longitude: 0,
      area: "",
      houseType: "",
      residenceName: "",
    });
    setAddressFormErrors({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
    });
  };

  //function to open modal for update address modal
  const openAddressUpdateModal = (order: OrderDetailsResponse) => {
    setSelectedOrder(order);
    setAddressFormData({
      flatNo: order.orderAddress?.flatNo || "",
      landMark: order.orderAddress?.landMark || "",
      address: order.orderAddress?.address || "",
      pincode: order.orderAddress?.pincode?.toString() || "",
      latitude: 0,
      longitude: 0,
      area: "",
      houseType: "",
      residenceName: "",
    });
    setIsAddressUpdateModalOpen(true);
  };

  //function for fetching the delivery boy details
  const fetchDeliveryBoyDetails = async (
    orderId: string,
    orderStatus: string
  ) => {
    const normalizedStatus = orderStatus === "Assigned" ? "3" : orderStatus;
    if (normalizedStatus !== "3" && normalizedStatus !== "PickedUp") {
      setDeliveryBoyDetails(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = {
        orderId,
        orderStatus: normalizedStatus,
      };

      const response = await axios.post(
        `${BASE_URL}/order-service/deliveryBoyAssigneData`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data[0]) {
        setDeliveryBoyDetails({
          deliveryBoyName: response.data[0].deliveryBoyName || "N/A",
          deliveryBoyMobile: response.data[0].deliveryBoyMobile || "N/A",
        });
      } else {
        setDeliveryBoyDetails(null);
      }
    } catch (error) {
      console.error("Error fetching delivery boy details:", error);
      setDeliveryBoyDetails(null);
      message.error("Failed to fetch delivery boy details.");
    }
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
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
              Try changing your search or filter criteria.
            </p>
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
                        ₹{Math.round(Number(order.grandTotal))}
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
                      <span>₹{Math.round(selectedOrder.grandTotal)}</span>
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
                    {deliveryBoyDetails &&
                      (selectedOrder.orderStatus === "3" ||
                        selectedOrder.orderStatus === "PickedUp") && (
                        <div className="flex items-start gap-2 mt-2">
                          <Truck className="h-4 w-4 text-purple-700 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              <strong>Delivery Boy Details</strong>
                            </p>
                            <p>
                              <span className="font-medium">Name:</span>{" "}
                              {deliveryBoyDetails.deliveryBoyName}
                            </p>
                            <p>
                              <span className="font-medium">Mobile:</span>{" "}
                              {deliveryBoyDetails.deliveryBoyMobile}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                  {["0", "1", "2", "3"].includes(selectedOrder.orderStatus) && (
                    <div className="mt-3 flex flex-col gap-2">
                      <button
                        onClick={openEditDeliveryTime}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-xs font-medium"
                      >
                        <Clock className="h-4 w-4" />
                        Change Delivery Time
                      </button>
                      {isWithin24Hours(
                        selectedOrder.orderHistory.find(
                          (history) => history.placedDate
                        )?.placedDate ?? null
                      ) && (
                        <button
                          onClick={() => openAddressUpdateModal(selectedOrder)}
                          className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-xs font-medium"
                        >
                          <MapPin className="h-4 w-4" />
                          Update Address
                        </button>
                      )}
                    </div>
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
                            ₹{Math.round((item.quantity * item.singleItemPrice))}
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
                        ₹
                        {Math.round(
                          Number(
                            selectedOrder.subTotal || selectedOrder.grandTotal
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>
                        ₹{Math.round(Number(selectedOrder.deliveryFee))}
                      </span>
                    </div>
                    {selectedOrder.walletAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Wallet Amount</span>
                        <span>
                          -₹{Math.round(Number(selectedOrder.walletAmount))}
                        </span>
                      </div>
                    )}
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Coupon Discount</span>
                        <span>
                          -₹{Math.round(Number(selectedOrder.discountAmount))}
                        </span>
                      </div>
                    )}
                    {selectedOrder.gstAmount > 0 && (
                      <div className="flex justify-between">
                        <span>GST Charges</span>
                        <span>
                          ₹{Math.round(Number(selectedOrder.gstAmount))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>
                        ₹{Math.round(Number(selectedOrder.grandTotal))}
                      </span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[95vh] overflow-y-auto scrollbar-hidden">
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
                {feedbackSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Thank You for Your Feedback!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your feedback has been successfully submitted.
                    </p>
                    <button
                      onClick={closeFeedbackModal}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        How was your experience with Order #
                        {orderToRate.newOrderId ||
                          orderToRate.orderId?.slice(-4)}
                        ?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Your feedback helps us improve our services.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {feedbackOptions.map((option) => (
                        <button
                          key={option.label}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            selectedLabel === option.label
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedLabel(option.label)}
                        >
                          <span className="text-xl">{option.emoji}</span>
                          <span className="text-sm font-medium">
                            {option.text}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      ></textarea>
                    </div>
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
        <AddressUpdateModal
          isOpen={isAddressUpdateModalOpen}
          selectedOrder={selectedOrder}
          addressFormData={addressFormData}
          addressFormErrors={addressFormErrors}
          addressUpdateSuccess={addressUpdateSuccess}
          isAddressUpdating={isAddressUpdating}
          setAddressFormData={setAddressFormData}
          setIsAddressUpdateModalOpen={setIsAddressUpdateModalOpen}
          resetAddressForm={resetAddressForm}
          handleUpdateAddress={handleUpdateAddress}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
