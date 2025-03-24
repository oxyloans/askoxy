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
  isToday?: boolean; // Add this property
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
  discountAmount: number;
  gstAmount: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress;
  orderItems: Item[];
  feedback?: FeedbackData;
  timeSlot?: string;
  dayOfWeek?: string;
  expectedDeliveryDate?: string;
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

  useEffect(() => {
    const storedUserStage = localStorage.getItem("userStage") || "";

    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
      setUserStage(storedUserStage);
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

      const orders = response.data || [];
      const ordersWithFeedback = await Promise.all(
        orders.map(async (order: OrderDetailsResponse) => {
          if (order.orderStatus === "4") {
            try {
              const feedbackData = await fetchOrderFeedbackData(order.orderId);
              return { ...order, feedback: feedbackData };
            } catch (error) {
              console.error(
                "Error fetching feedback for order:",
                order.orderId,
                error
              );
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

  const handleDownloadInvoice = (order: OrderDetailsResponse) => {
    try {
      const orderDate = new Date(order.orderDate);
      const formattedDate = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

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
        if (orderData.orderStatus === "4" && !orderData.feedback) {
          const feedbackData = await fetchOrderFeedbackData(orderId);
          orderData.feedback = feedbackData;
        }

        setSelectedOrder(orderData);
        setSelectedDay(orderData.dayOfWeek || "");
        setSelectedTimeSlot(orderData.timeSlot || "");
        setSelectedDate(orderData.expectedDeliveryDate || "");
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const openEditDeliveryTime = async () => {
    setIsEditingDeliveryTime(true);
    await fetchAvailableTimeSlots();
  };

  const formatDayOfWeek = (day: string): string => {
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
          Authorization: `Bearer ${token}`,
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
      PickedUp: "Picked up",
    };
    return statusMap[status] || "Unknown";
  };

  const fetchAvailableTimeSlots = async () => {
    setIsLoading2(true);
    try {
      const token = localStorage.getItem("token");
      // if (!token) throw new Error("User is not authenticated");

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
        const currentDate = new Date();
        const currentTime =
          currentDate.getHours() * 60 + currentDate.getMinutes();
        const cutoffTime = 8 * 60 + 30; // 8:30 AM in minutes
        const skipToday = currentTime >= cutoffTime;

        // Define days of the week
        const dayNames = [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ];

        // Get today's day index (0-6)
        const currentDayIndex = currentDate.getDay();
        const currentDayName = dayNames[currentDayIndex];

        // Get the next 3 days (or 2 if including today)
        const daysToFetch = skipToday ? 3 : 3; // Always fetch 3 days, we'll filter later
        const nextDays = [];

        for (let i = 0; i < daysToFetch; i++) {
          const futureDate = new Date(currentDate);
          futureDate.setDate(currentDate.getDate() + i);
          const dayIndex = futureDate.getDay();
          const dayName = dayNames[dayIndex];

          nextDays.push({
            date: futureDate,
            dayName: dayName,
            dayOffset: i,
            formattedDate: `${String(futureDate.getDate()).padStart(
              2,
              "0"
            )}-${String(futureDate.getMonth() + 1).padStart(
              2,
              "0"
            )}-${futureDate.getFullYear()}`,
          });
        }

        // Find slot data from API response for the next days
        let validSlots = [];
        let daysFound = 0;
        let dayOffset = 0;

        // Start with today or tomorrow based on time check
        const startDayOffset = skipToday ? 1 : 0;

        while (daysFound < 2 && dayOffset < 7) {
          // Look ahead max 7 days to find 2 valid days
          const checkDate = new Date(currentDate);
          checkDate.setDate(currentDate.getDate() + startDayOffset + dayOffset);
          const checkDayIndex = checkDate.getDay();
          const checkDayName = dayNames[checkDayIndex];

          // Find slot data for this day from API response
          const slotData = response.data.find(
            (slot) => slot.dayOfWeek === checkDayName
          );

          if (slotData && slotData.isAvailable) {
            const formattedDate = `${String(checkDate.getDate()).padStart(
              2,
              "0"
            )}-${String(checkDate.getMonth() + 1).padStart(
              2,
              "0"
            )}-${checkDate.getFullYear()}`;

            const isToday = startDayOffset + dayOffset === 0;

            validSlots.push({
              ...slotData,
              date: formattedDate,
              isToday: isToday,
              // Ensure all properties are present and correctly formatted
              timeSlot1: slotData.timeSlot1?.trim() || "08:00 AM - 12:00 PM",
              timeSlot2: slotData.timeSlot2?.trim() || "12:00 PM - 04:00 PM",
              timeSlot3: slotData.timeSlot3?.trim() || "04:00 PM - 08:00 PM",
              timeSlot4: slotData.timeSlot4?.trim() || "08:00 PM - 10:00 PM",
            });

            daysFound++;
          }

          dayOffset++;
        }

        console.log("Valid time slots found:", validSlots);

        if (validSlots.length === 0) {
          console.warn("No available time slots found for the next days");
          // Fallback to default slots if nothing is available
          validSlots = Array.from({ length: 2 }).map((_, index) => {
            const dayOffset = index + (skipToday ? 1 : 0);
            const slotDate = new Date(currentDate);
            slotDate.setDate(currentDate.getDate() + dayOffset);

            const dayIndex = slotDate.getDay();
            const dayOfWeek = dayNames[dayIndex];

            const formattedDate = `${String(slotDate.getDate()).padStart(
              2,
              "0"
            )}-${String(slotDate.getMonth() + 1).padStart(
              2,
              "0"
            )}-${slotDate.getFullYear()}`;

            return {
              id: `day-${dayOffset}`,
              dayOfWeek: dayOfWeek,
              date: formattedDate,
              isToday: dayOffset === 0,
              timeSlot1: "08:00 AM - 12:00 PM",
              timeSlot2: "12:00 PM - 04:00 PM",
              timeSlot3: "04:00 PM - 08:00 PM",
              timeSlot4: "08:00 PM - 10:00 PM",
              isAvailable: true,
            };
          });
        }

        setAvailableTimeSlots(validSlots);
        setTimeSlotsForTwoDays(validSlots);
        console.log("Formatted time slots:", validSlots);

        if (selectedOrder) {
          setSelectedDay(
            selectedOrder.dayOfWeek || validSlots[0]?.dayOfWeek || ""
          );
          setSelectedTimeSlot(selectedOrder.timeSlot || "");
          setSelectedDate(
            selectedOrder.expectedDeliveryDate || validSlots[0]?.date || ""
          );
        }
      } else {
        console.error("API did not return an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      if (axios.isAxiosError(error)) {
        console.error("Request details:", error.config);
        console.error("Response:", error.response?.data);
      }
    } finally {
      setIsLoading2(false);
    }
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
  const handleClearSelection = () => {
    setSelectedDay("");
    setSelectedTimeSlot("");
    setSelectedDate("");
  };

  const updateDeliveryTimeSlot = async () => {
    if (!selectedOrder || !selectedDay || !selectedTimeSlot || !selectedDate) {
      message.warning("Please select both a day and a time slot");
      return;
    }

    setTimeSlotUpdating(true);
    try {
      const token = localStorage.getItem("token");

      if (!customerId) {
        message.error("user ID is missing");
        return;
      }

      const requestUrl = BASE_URL.includes("/api")
        ? `${BASE_URL}/order-service/userSelectedDiffslot`
        : `${BASE_URL}/api/order-service/userSelectedDiffslot`;

      const requestBody = {
        dayOfWeek: selectedDay,
        expectedDeliveryDate: selectedDate,
        orderId: selectedOrder.orderId,
        timeSlot: selectedTimeSlot,
        userId: customerId,
      };

      // Add timeout to the request to prevent hanging
      const response = await axios.patch(requestUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (
        response.data &&
        (response.data.error || response.data.message === "error")
      ) {
        throw new Error(response.data.message || "Server returned an error");
      }

      setSelectedOrder((prev: OrderDetailsResponse | null) => {
        if (!prev) return null;
        return {
          ...prev,
          dayOfWeek: selectedDay,
          timeSlot: selectedTimeSlot,
          expectedDeliveryDate: selectedDate,
        };
      });

      setTimeSlotUpdateSuccess(true);
      setTimeout(() => {
        setTimeSlotUpdateSuccess(false);
        setIsEditingDeliveryTime(false);
      }, 2000);
      if (storedCustomerId) {
        fetchOrders(storedCustomerId);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Request details:", error.config);
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);

        if (error.code === "ECONNABORTED") {
          message.warning(
            "Request timed out. Please check your internet connection and try again."
          );
        } else if (error.response) {
          if (error.response.status === 401) {
            message.error("Your session has expired. Please log in again.");
          } else {
            alert(
              `Failed to update delivery time: ${
                error.response.data?.message || "Server error"
              }`
            );
          }
        } else {
          message.error(
            "Failed to update delivery time. Please try again. after some time"
          );
        }
      } else {
        message.error(
          `Failed to update delivery time: ${(error as Error).message}`
        );
      }
    } finally {
      setTimeSlotUpdating(false);
      setShowTimeSlotPopup(false);
      setIsEditingDeliveryTime(false);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
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
    if (!dateString) return "N/A";
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOrders = allOrders
    .filter((order) => {
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
                        #{order.newOrderId}
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

                    {order.orderStatus !== "6" && (
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
                              Rate Your Experience
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

        {isDetailsOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 z-50 overflow-auto">
            <div className="bg-white rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
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

              <div className="p-3 sm:p-4 space-y-4">
                <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center shadow">
                    <Package2 className="h-7 w-7 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-900">
                      Order #
                      {selectedOrder?.newOrderId ||
                        selectedOrder?.orderId?.slice(-4)}
                    </h3>
                    <div className="mt-1 text-xs text-gray-600 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-purple-700" />
                      <span>
                        <span className="font-medium">Order Date:</span>{" "}
                        {formatDate(selectedOrder.orderDate)}
                      </span>
                    </div>
                    {selectedOrder.expectedDeliveryDate ||
                    selectedOrder.dayOfWeek ||
                    selectedOrder.timeSlot ? (
                      <div className="mt-2 bg-purple-50 rounded-md gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-purple-700" />
                          <span className="font-medium">Delivery:</span>
                          <span>
                            {selectedOrder.expectedDeliveryDate &&
                              formatDeliveryDate(
                                selectedOrder.expectedDeliveryDate
                              )}
                            {selectedOrder.dayOfWeek &&
                              !selectedOrder.expectedDeliveryDate &&
                              formatDayOfWeek(selectedOrder.dayOfWeek)}
                            {selectedOrder.timeSlot && (
                              <>
                                {" "}
                                •{" "}
                                <span className="font-normal">
                                  {selectedOrder.timeSlot}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm sm:text-xs text-gray-500 italic">
                        Not scheduled
                      </div>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`px-3 py-1.5 rounded-full text-m font-medium ${getStatusColor(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                {selectedOrder.orderStatus !== "5" &&
                  selectedOrder.orderStatus !== "6" && (
                    <div className="h-2 bg-gray-100 rounded-full w-full shadow-inner">
                      <div
                        className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${getProgressPercentage(
                            selectedOrder.orderStatus
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-purple-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                        Delivery Address
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium text-gray-900">
                        {selectedOrder.customerName}
                      </p>
                      <p>
                        {selectedOrder.orderAddress?.flatNo},{" "}
                        {selectedOrder.orderAddress?.address}
                      </p>
                      <p>Landmark: {selectedOrder.orderAddress?.landMark}</p>
                      <p>Pincode: {selectedOrder.orderAddress?.pincode}</p>
                      <p className="flex items-center mt-1 bg-purple-50 p-2 rounded-lg text-sm">
                        <Phone className="h-4 w-4 mr-2 text-purple-600" />
                        {selectedOrder.customerMobile}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2 text-purple-600" />
                      Items ({selectedOrder.orderItems.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map(
                        (item: Item, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 hover:bg-purple-50/50 transition-colors rounded-lg p-2 border border-gray-100"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-purple-100 flex-shrink-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">
                              {item.itemUrl ? (
                                <img
                                  src={item.itemUrl}
                                  alt={item.itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-8 w-8 text-purple-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-gray-900">
                                {item.itemName}
                              </h3>
                              <div className="flex justify-between items-start mt-2 text-xs">
                                <div>
                                  <span className="text-gray-600 bg-gray-100 rounded-full px-2 py-1 inline-block text-xs font-medium">
                                    {item.weight} {item.itemUnit || "KGS"}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                  <p className="text-green-700 font-bold text-sm">
                                    ₹
                                    {(
                                      item.quantity * item.singleItemPrice
                                    ).toFixed(0)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                      Payment Details
                    </h4>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Sub Total</span>
                        <span className="font-medium">
                          ₹{selectedOrder.subTotal || selectedOrder.grandTotal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Delivery Fee</span>
                        <span className="font-medium">
                          ₹{selectedOrder.deliveryFee || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">GST Charges</span>
                        <span>₹{selectedOrder.gstAmount || 0}</span>
                      </div>
                      {selectedOrder.walletAmount > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Wallet Amount</span>
                          <span className="font-medium text-red-600">
                            -₹{selectedOrder.walletAmount}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Coupon Discount</span>
                        <span>- ₹{selectedOrder.discountAmount || 0}</span>
                      </div>
                      <div className="border-t border-purple-200 my-2"></div>
                      <div className="flex justify-between items-center font-bold mt-2">
                        <span>Total Amount</span>
                        <span className="text-lg text-purple-700">
                          ₹{selectedOrder.grandTotal}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center bg-white p-3 rounded-lg border border-purple-100">
                      <span className="text-gray-700 font-medium">
                        Payment Method
                      </span>
                      <span
                        className={`flex items-center px-3 py-1.5 rounded-full ${
                          selectedOrder.paymentType === 2
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {selectedOrder.paymentType === 2 ? (
                          <>
                            <CreditCard className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Online</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              Cash on Delivery
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.orderHistory && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow hover:shadow-md transition-shadow">
                      <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-600" />
                        Order Timeline
                      </h4>
                      <div className="relative pl-8 pb-1 text-sm">
                        {selectedOrder.orderHistory.map(
                          (orderHistory: OrderHistory, index: number) => (
                            <div key={index} className="space-y-3">
                              {orderHistory.placedDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow flex items-center justify-center">
                                    <ShoppingBag className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 shadow-sm">
                                    <p className="font-medium text-sm text-purple-900">
                                      Order Placed
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.placedDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.acceptedDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow flex items-center justify-center">
                                    <CheckCheck className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
                                    <p className="font-medium text-sm text-blue-900">
                                      Order Accepted
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.acceptedDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.assignedDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow flex items-center justify-center">
                                    <Package className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 shadow-sm">
                                    <p className="font-medium text-sm text-orange-900">
                                      Order Assigned
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.assignedDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.pickUpDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow flex items-center justify-center">
                                    <Truck className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
                                    <p className="font-medium text-sm text-blue-900">
                                      Order Picked Up
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.pickUpDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.deliveredDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm">
                                    <p className="font-medium text-sm text-green-900">
                                      Order Delivered
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.deliveredDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.canceledDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow flex items-center justify-center">
                                    <X className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-red-50 p-3 rounded-lg border border-red-100 shadow-sm">
                                    <p className="font-medium text-sm text-red-900">
                                      Order Canceled
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.canceledDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {orderHistory.rejectedDate && (
                                <div className="relative mb-4">
                                  <div className="absolute left-[-26px] w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow flex items-center justify-center">
                                    <X className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="bg-red-50 p-3 rounded-lg border border-red-100 shadow-sm">
                                    <p className="font-medium text-sm text-red-900">
                                      Order Rejected
                                    </p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(orderHistory.rejectedDate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.orderStatus === "4" &&
                    selectedOrder.feedback && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow hover:shadow-md transition-shadow">
                        <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                          Your Feedback
                        </h4>
                        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg">
                          <div className="text-4xl transition-transform hover:scale-110">
                            {feedbackOptions.find(
                              (option) =>
                                option.label ===
                                selectedOrder.feedback?.feedbackStatus
                            )?.emoji || "🙂"}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-purple-800 mb-2 bg-white px-3 py-1 rounded-full inline-block shadow-sm border border-purple-100">
                              {feedbackOptions.find(
                                (option) =>
                                  option.label ===
                                  selectedOrder.feedback?.feedbackStatus
                              )?.text || "Rated"}
                            </p>
                            {selectedOrder.feedback.comments && (
                              <p className="text-sm text-gray-700 italic bg-white p-2 rounded-lg border border-purple-100 shadow-sm">
                                "{selectedOrder.feedback.comments}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100 p-4 flex justify-between gap-3 mt-6 rounded-b-xl shadow-inner">
                  <button
                    onClick={handleWriteToUs}
                    className="flex-1 bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm shadow-sm hover:shadow"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Contact Us</span>
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm shadow-sm hover:shadow"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditingDeliveryTime && selectedOrder && (
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
                          {/* Day selection list */}
                          <div className="grid grid-cols-1 gap-3 mb-4">
                            {timeSlotsForTwoDays.map((slot) => (
                              <button
                                key={`day-${slot.id}`}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-all"
                                onClick={() => {
                                  setActiveTab(slot.id);
                                  setShowTimeSlotPopup(true);
                                }}
                              >
                                <div className="flex items-center">
                                  <CalendarDays className="w-5 h-5 mr-3 text-purple-500" />
                                  <div className="text-left">
                                    <span className="font-medium text-gray-900 block">
                                      {slot.isToday
                                        ? "Today"
                                        : formatDayOfWeek(slot.dayOfWeek)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {formatDeliveryDate(slot.date || "")}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </button>
                            ))}
                          </div>

                          {/* Time Slot Popup/Modal */}
                          {showTimeSlotPopup && activeTab && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                                        {(() => {
                                          const selectedDay =
                                            timeSlotsForTwoDays.find(
                                              (slot) => slot.id === activeTab
                                            );
                                          return selectedDay
                                            ? `${
                                                selectedDay.isToday
                                                  ? "Today"
                                                  : formatDayOfWeek(
                                                      selectedDay.dayOfWeek
                                                    )
                                              } - ${formatDeliveryDate(
                                                selectedDay.date || ""
                                              )}`
                                            : "";
                                        })()}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                      {(() => {
                                        const selectedSlot =
                                          timeSlotsForTwoDays.find(
                                            (slot) => slot.id === activeTab
                                          );
                                        if (!selectedSlot) return null;

                                        return [
                                          selectedSlot.timeSlot1,
                                          selectedSlot.timeSlot2,
                                          selectedSlot.timeSlot3,
                                          selectedSlot.timeSlot4,
                                        ]
                                          .filter(Boolean)
                                          .map((timeSlot, index) => (
                                            <div
                                              key={`timeSlot-${index}`}
                                              className={`py-4 px-5 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition-all ${
                                                selectedTimeSlot === timeSlot &&
                                                selectedDate ===
                                                  selectedSlot.date
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
                                          ));
                                      })()}
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                  <div className="flex space-x-3">
                                    <button
                                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                                      onClick={() =>
                                        setShowTimeSlotPopup(false)
                                      }
                                    >
                                      Back
                                    </button>
                                    <button
                                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-purple-300 flex items-center justify-center shadow-sm"
                                      onClick={() => {
                                        updateDeliveryTimeSlot();
                                      }}
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
                          )}

                          {/* Action buttons */}
                          <div className="flex space-x-3 mt-6">
                            <button
                              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                              onClick={() => setIsEditingDeliveryTime(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
                    How was your experience with Order #
                    {orderToRate.newOrderId || orderToRate.orderId?.slice(-4)}?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your feedback helps us improve our service
                  </p>
                </div>

                {feedbackSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
                    <p className="font-medium">Thank you for your feedback!</p>
                  </div>
                )}

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