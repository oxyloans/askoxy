import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Truck,
  Tag,
  ShoppingBag,
  Globe,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import decryptEas from "./decryptEas";
import encryptEas from "./encryptEas";
import { Loader2, X } from "lucide-react";
import { CartContext } from "../until/CartContext";
import BASE_URL from "../Config";

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
  quantity: number;
}

interface CartData {
  deliveryBoyFee: number;
}

interface Address {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
  latitude?: number;
  longitude?: number;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}

// Update the TimeSlot interface to include the status properties
interface TimeSlot {
  id: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
  timeSlot1: string;
  timeSlot2: string;
  timeSlot3: string;
  timeSlot4: string;
  date: string;
  isToday: boolean;
  isAvailable: boolean;
  // Add these new properties as optional to maintain compatibility
  slot1Status?: boolean;
  slot2Status?: boolean;
  slot3Status?: boolean;
  slot4Status?: boolean;
}

// Type definitions
interface DayInfo {
  dayOfWeek: string;
  date: string;
  formattedDay: string;
}

// Extend the original TimeSlot interface to include formattedDay
interface ExtendedTimeSlot extends TimeSlot {
  formattedDay?: string;
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupenDetails, setCoupenDetails] = useState<number>(0);
  const [coupenLoading, setCoupenLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletTotal, setWalletTotal] = useState<number>(0);
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"ONLINE" | "COD">(
    "ONLINE"
  );
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    state?.selectedAddress || null
  );
  const [grandTotalAmount, setGrandTotalAmount] = useState<number>(0);
  const [deliveryBoyFee, setDeliveryBoyFee] = useState<number>(0);
  const [subGst, setSubGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [walletMessage, setWalletMessage] = useState<string>("");
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [afterWallet, setAfterWallet] = useState<number>(0);
  const [usedWalletAmount, setUsedWalletAmount] = useState<number>(0);
  const [isDeliveryTimelineModalVisible, setIsDeliveryTimelineModalVisible] =
    useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });
  const [merchantTransactionId, setMerchantTransactionId] = useState();
  const [showDeliveryTimelineModal, setShowDeliveryTimelineModal] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [language, setLanguage] = useState<"english" | "telugu">("english");
  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("profileData");
  const [isButtonDisabled, setisButtonDisabled] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Exchange policy
  const [exchangePolicyAccepted, setExchangePolicyAccepted] = useState(false);

  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }
  const { count, setCount } = context;

  useEffect(() => {
    fetchCartData();
    totalCart();
    getWalletAmount();
    fetchTimeSlots();
    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    const order = params.trans;
    setOrderId(order);
    if (userData) {
      setProfileData(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const trans = localStorage.getItem("merchantTransactionId");
    const paymentId = localStorage.getItem("paymentId");
    if (trans === orderId) {
      Requery(paymentId);
    }
  }, [orderId]);

  useEffect(() => {
    if (selectedTimeSlot && !isDeliveryTimelineModalVisible) {
      setIsDeliveryTimelineModalVisible(true);
    }
  }, [selectedTimeSlot]);

  // Type-safe time slot selection handler
  const handleSelectTimeSlot = (
    date: string,
    timeSlot: string,
    day: string
  ): void => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSelectedDay(day);
    setShowTimeSlotModal(false);
    message.success(`Delivery time slot selected: ${date}, ${timeSlot}`);
    setIsDeliveryTimelineModalVisible(true);
  };

  // Type definition for time slot object used in rendering
  interface TimeSlotObj {
    key: string;
    value: string | null;
  }

  const handleShowDeliveryTimeline = () => {
    setShowDeliveryTimelineModal(true);
  };
  // Replace the old renderDeliveryTimelineModal function with this one
  const renderDeliveryTimelineModal = () => {
    return (
      <Modal
        title="Delivery Information"
        open={isDeliveryTimelineModalVisible}
        onCancel={() => setIsDeliveryTimelineModalVisible(false)}
        footer={null}
        centered
        width={500}
        closeIcon={<X className="w-5 h-5" />}
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setLanguage("english")}
              className={`px-4 py-2 rounded-l-md transition-colors ${
                language === "english"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("telugu")}
              className={`px-4 py-2 rounded-r-md transition-colors ${
                language === "telugu"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              తెలుగు
            </button>
          </div>

          <div>
            <Truck className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-4">
              {language === "english"
                ? "Delivery Information"
                : "డెలివరీ సమాచారం"}
            </h3>
            <div className="mb-4 text-left bg-purple-50 p-4 rounded-lg">
              {language === "english" ? (
                <>
                  <p className="mb-3">
                    📦 <strong>Delivery Timeline:</strong> Your order will be
                    delivered within 4 hours to 4 days, depending on the volume
                    of orders and location. We're doing our best to group nearby
                    orders together so we can deliver more efficiently and
                    sustainably. 🚚
                  </p>
                  <p className="mb-3">
                    With your support, we'll be able to grow and serve you even
                    better. 🙏
                  </p>
                  <p>
                    Please support us by spreading the word to friends and
                    family nearby! More orders = faster and more efficient
                    deliveries for everyone! Thank you again!
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-3">
                    📦 <strong>డెలివరీ సమయం:</strong> మీ ఆర్డర్‌ను 4 గంటల నుండి
                    4 రోజుల్లోపు డెలివరీ చేయడానికి ప్రయత్నిస్తున్నాం. మీ
                    ప్రాంతంలో వచ్చే ఆర్డర్ల ఆధారంగా, వాటిని గ్రూప్ చేసి
                    సమర్థవంతంగా డెలివరీ చేస్తున్నాం. 🚚
                  </p>
                  <p className="mb-3">
                    మీతో శాశ్వతమైన మంచి సంబంధం ఏర్పడాలని మేము ఆశిస్తున్నాం. మీరు
                    మమ్మల్ని మీ స్నేహితులు, బంధువులతో షేర్ చేస్తే, మేము మరింత
                    మందికి త్వరగా సేవలందించగలుగుతాం. 🙏
                  </p>
                  <p>మీ సహకారం మాకు చాలా విలువైనది. ముందుగానే ధన్యవాదాలు!</p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsDeliveryTimelineModalVisible(false)}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            {language === "english" ? "Close" : "మూసివేయి"}
          </button>
        </div>
      </Modal>
    );
  };

  // Updated function to get next available days, not just the next 3 calendar days
  const getAvailableDays = (maxDays: number = 14): DayInfo[] => {
    const today = new Date();

    // Start from tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startDate = tomorrow;
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    // Generate information for the next maxDays days
    const nextDays: DayInfo[] = [];
    for (let offset = 0; offset < maxDays; offset++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + offset);

      nextDays.push({
        dayOfWeek: daysOfWeek[date.getDay()].toUpperCase(),
        date: `${String(date.getDate()).padStart(2, "0")}-${
          months[date.getMonth()]
        }-${date.getFullYear()}`,
        formattedDay: daysOfWeek[date.getDay()],
      });
    }

    return nextDays;
  };

  const fetchTimeSlots = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/order-service/fetchTimeSlotlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && Array.isArray(response.data)) {
        // Get information for the next 14 days (or adjust as needed)
        const nextDays = getAvailableDays(14);

        // Define a type for the API response slots
        interface ApiTimeSlot {
          id: string;
          dayOfWeek: string;
          timeSlot1: string | null;
          timeSlot2: string | null;
          timeSlot3: string | null;
          timeSlot4: string | null;
          isAvailable: boolean;
        }

        // Process and format time slots
        const formattedTimeSlots: ExtendedTimeSlot[] = [];

        // Iterate through days until we find 3 available days or reach the end
        for (const dayInfo of nextDays) {
          // Find matching slot for this day
          const matchingSlot = response.data.find(
            (slot: ApiTimeSlot) =>
              slot.dayOfWeek === dayInfo.dayOfWeek && slot.isAvailable === false
          );

          // If we find an available slot for this day, add it to our formatted slots
          if (matchingSlot) {
            // Check if at least one time slot is available
            const hasTimeSlot =
              matchingSlot.timeSlot1 ||
              matchingSlot.timeSlot2 ||
              matchingSlot.timeSlot3 ||
              matchingSlot.timeSlot4;

            if (hasTimeSlot) {
              formattedTimeSlots.push({
                id: matchingSlot.id,
                dayOfWeek: dayInfo.dayOfWeek,
                expectedDeliveryDate: dayInfo.date,
                timeSlot1: matchingSlot.timeSlot1,
                timeSlot2: matchingSlot.timeSlot2,
                timeSlot3: matchingSlot.timeSlot3,
                timeSlot4: matchingSlot.timeSlot4,
                isAvailable: false, // isAvailable=false means slots are available for selection
                isToday: false,
                date: dayInfo.date,
                formattedDay: dayInfo.formattedDay,
              });
            }
          }

          // If we've found 3 available days, we can stop
          if (formattedTimeSlots.length >= 3) {
            break;
          }
        }

        // Set the time slots state with what we found (might be fewer than 3)
        setTimeSlots(formattedTimeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to fetch delivery time slots");
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (
    selectedSlot: TimeSlot,
    selectedTimeSlot: string,
    selectedAddress: Address,
    customerId: string,
    selectedPayment: string,
    usedWalletAmount: number,
    couponCode: string | null,
    coupenDetails: number,
    deliveryBoyFee: number,
    grandTotalAmount: number,
    grandTotal: number,
    subGst: number,
    token: string
  ) => {
    try {
      const requestBody = {
        dayOfWeek: selectedSlot.dayOfWeek,
        expectedDeliveryDate: selectedSlot.expectedDeliveryDate,
        timeSlot: selectedTimeSlot,
        address: selectedAddress.address,
        customerId: customerId,
        flatNo: selectedAddress.flatNo,
        landMark: selectedAddress.landMark,
        orderStatus: selectedPayment,
        pincode: selectedAddress.pincode,
        walletAmount: usedWalletAmount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        couponValue: couponCode !== null ? coupenDetails : 0,
        deliveryBoyFee: deliveryBoyFee,
        amount: grandTotalAmount,
        subTotal: grandTotal,
        gstAmount: subGst,
      };

      const response = await axios.post(
        `${BASE_URL}/order-service/placeOrder`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status) {
        message.success(response.data.status);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order");
    }
  };

  const openTimeSlotModal = () => {
    setShowTimeSlotModal(true);
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = parseInt(item.cartQuantity);
            return acc;
          },
          {}
        );
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCartData(response.data?.customerCartResponseList || []);
        setCount(totalQuantity);
      } else {
        setCartData([]);
        setCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
  };

  const totalCart = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/cartItemData`,
        { customerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGrandTotalAmount(parseFloat(response.data.totalSumWithGstSum));
      setSubGst(response.data.totalGstSum);
      const totalDeliveryFee = response.data?.cartResponseList.reduce(
        (sum: number, item: CartData) => sum + item.deliveryBoyFee,
        0
      );
      setDeliveryBoyFee(totalDeliveryFee);
      setTotalAmount(parseFloat(response.data.totalSumWithGstSum));
      setGrandTotal(parseFloat(response.data.totalSum));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
  };

  const handleApplyCoupon = () => {
    const data = {
      couponCode: couponCode,
      customerId: customerId,
      subTotal: grandTotalAmount,
    };
    setCoupenLoading(true);

    axios
      .post(BASE_URL + "/order-service/applycoupontocustomer", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { discount, grandTotal } = response.data;
        message.info(response.data.message);
        setCoupenDetails(discount || 0);
        setCoupenApplied(response.data.couponApplied);
        setCoupenLoading(false);
      })
      .catch((error) => {
        console.error("Error in applying coupon:", error);
        message.error("Failed to apply coupon");
        setCoupenLoading(false);
      });
  };

  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);
    setCoupenDetails(0);
    setUseWallet(false);
    setUsedWalletAmount(0);
    setAfterWallet(walletAmount);
    message.info("Coupon removed successfully");
  };

  const getWalletAmount = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/order-service/applyWalletAmountToCustomer`,
        { customerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const usableAmount = response.data.usableWalletAmountForOrder || 0;
      setWalletAmount(usableAmount);
      setAfterWallet(usableAmount); // Initially, after wallet = available wallet
      setWalletMessage(response.data.message || "");
      setUsedWalletAmount(0); // Initially no wallet amount is used

      // Make sure to reset these states when getting new wallet information
      setUseWallet(false);
    } catch (error: unknown) {
      console.error("Error fetching wallet amount:", error);
      message.error("Failed to fetch wallet balance");
      setWalletAmount(0);
      setAfterWallet(0);
      setUsedWalletAmount(0);
      setUseWallet(false);
    }
  };

  function grandTotalfunc() {
    // Start with base amount before any discounts
    const baseTotal = totalAmount + deliveryBoyFee;
    let discountedTotal = baseTotal;

    // Apply coupon discount if applicable
    if (coupenApplied && coupenDetails > 0) {
      discountedTotal = Math.max(0, discountedTotal - coupenDetails);
    }

    // Calculate wallet usage
    let newUsedWalletAmount = 0;
    if (useWallet && walletAmount > 0) {
      // Only use what's needed from wallet, up to available amount
      newUsedWalletAmount = Math.min(walletAmount, discountedTotal);
      discountedTotal = Math.max(0, discountedTotal - newUsedWalletAmount);
    }

    // Update states correctly
    setUsedWalletAmount(newUsedWalletAmount);
    setAfterWallet(walletAmount - newUsedWalletAmount);
    setGrandTotalAmount(discountedTotal);
  }

  const handleCheckboxToggle = () => {
    const newValue = !useWallet;

    // Calculate the current total after any coupon discounts
    let currentTotal = totalAmount + deliveryBoyFee;
    if (coupenApplied && coupenDetails > 0) {
      currentTotal = Math.max(0, currentTotal - coupenDetails);
    }

    const potentialUsedAmount = newValue
      ? Math.min(walletAmount, currentTotal)
      : 0;

    Modal.confirm({
      title: newValue ? "Confirm Wallet Usage" : "Remove Wallet Usage",
      content: newValue
        ? `Use ₹${potentialUsedAmount.toFixed(
            2
          )} from your wallet balance of ₹${walletAmount.toFixed(2)}?`
        : `Stop using ₹${usedWalletAmount.toFixed(2)} from your wallet?`,
      onOk: () => {
        setUseWallet(newValue);

        if (newValue) {
          // If enabling wallet, calculate proper amount to use
          setUsedWalletAmount(potentialUsedAmount);
          setAfterWallet(walletAmount - potentialUsedAmount);
          setGrandTotalAmount(currentTotal - potentialUsedAmount);
        } else {
          // If disabling wallet, reset wallet usage and recalculate total
          setUsedWalletAmount(0);
          setAfterWallet(walletAmount);
          setGrandTotalAmount(currentTotal);
        }

        message.success(newValue ? "Wallet applied" : "Wallet removed");
      },
      onCancel: () => {
        message.info("Wallet usage unchanged");
      },
    });
  };
  useEffect(() => {
    grandTotalfunc();
  }, [
    totalAmount,
    deliveryBoyFee,
    coupenApplied,
    coupenDetails,
    useWallet,
    walletAmount,
  ]);

  const handlePayment = async () => {
    console.log("Exchange policy accepted:", exchangePolicyAccepted);

    if (!exchangePolicyAccepted) {
      Modal.warning({
        title: "Confirmation Required",
        content:
          "Please confirm that the exchange can be taken within 10 days after delivery.",
      });
      return;
    }

    try {
      const hasStockIssues = cartData.some(
        (item) =>
          parseInt(item.cartQuantity) > item.quantity || item.quantity === 0
      );

      if (hasStockIssues) {
        Modal.error({
          title: "Stock Issues",
          content:
            "Some items in your cart are out of stock or exceed available stock. Please adjust before proceeding.",
          okText: "OK",
          onOk: () => navigate("/main/mycart"),
        });
        return;
      }

      if (!selectedTimeSlot) {
        Modal.error({ title: "Error", content: "Please select a time slot." });
        return;
      }

      // Validate that wallet usage doesn't exceed available amount
      if (useWallet && usedWalletAmount > walletAmount) {
        Modal.error({
          title: "Wallet Error",
          content: "Insufficient wallet balance",
        });
        return;
      }

      setLoading(true);

      // Make sure we're passing the correct wallet amount
      const finalWalletAmount = useWallet ? usedWalletAmount : 0;

      const response = await axios.post(
        `${BASE_URL}/order-service/orderPlacedPaymet`,
        {
          address: selectedAddress.address,
          customerId,
          flatNo: selectedAddress.flatNo,
          landMark: selectedAddress.landMark,
          orderStatus: selectedPayment, // Use the selected payment method
          pincode: selectedAddress.pincode,
          walletAmount: finalWalletAmount, // Use the correct wallet amount
          couponCode: coupenApplied ? couponCode.toUpperCase() : null,
          couponValue: coupenApplied ? coupenDetails : 0,
          deliveryBoyFee,
          amount: grandTotalAmount,
          subTotal: grandTotal,
          gstAmount: subGst,
          dayOfWeek: selectedDay,
          expectedDeliveryDate: selectedDate,
          timeSlot: selectedTimeSlot,
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
          orderFrom: "WEB",
          paymentType: selectedPayment === "COD" ? 0 : 1, // Add payment type: 0 for COD, 1 for ONLINE
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle different payment flows based on selected method
      if (response.status === 200 && response.data) {
        await fetchCartData();

        // GA4 Purchase Event Tracking
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "purchase", {
            transaction_id:
              response.data.paymentId ||
              `${selectedPayment}_${new Date().getTime()}`,
            value: grandTotalAmount,
            currency: "INR",
            tax: subGst,
            shipping: deliveryBoyFee,
            coupon: coupenApplied ? couponCode.toUpperCase() : "",
            payment_type: selectedPayment,
            items: cartData.map((item) => ({
              item_id: item.itemId,
              item_name: item.itemName,
              price: parseFloat(item.itemPrice),
              quantity: parseInt(item.cartQuantity),
              item_category: "Rice",
            })),
          });
        }

        // Handle COD orders differently than online payments
        if (selectedPayment === "COD") {
          // For COD, just show success and redirect
          Modal.success({
            content: "Order placed successfully! You'll pay on delivery.",
            onOk: () => {
              navigate("/main/myorders");
              fetchCartData();
            },
          });
        } else {
          // For online payment, proceed with payment gateway
          if (response.data.paymentId) {
            const number = localStorage.getItem("whatsappNumber");
            const withoutCountryCode = number?.replace("+91", "");
            sessionStorage.setItem("address", JSON.stringify(selectedAddress));

            const paymentData = {
              mid: "1152305",
              amount: grandTotalAmount,
              merchantTransactionId: response.data.paymentId,
              transactionDate: new Date(),
              terminalId: "getepay.merchant128638@icici",
              udf1: withoutCountryCode,
              udf2: `${profileData.firstName} ${profileData.lastName}`,
              udf3: profileData.email,
              ru: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              callbackUrl: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              currency: "INR",
              paymentMode: "ALL",
              txnType: "single",
              productType: "IPG",
              txnNote: "Rice Order In Live",
              vpa: "getepay.merchant128638@icici",
            };

            getepayPortal(paymentData);
          } else {
            message.error("Order failed");
          }
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethods = () => {
    return (
      <div className="space-y-3">
        <div
          className={`p-3 border rounded-md ${
            selectedPayment === "ONLINE"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 hover:border-purple-500 bg-white hover:bg-purple-50"
          } flex items-center cursor-pointer transition-colors`}
          onClick={() => setSelectedPayment("ONLINE")}
        >
          <div className="w-4 h-4 rounded-full border border-purple-500 bg-white">
            <div
              className={`w-2 h-2 rounded-full ${
                selectedPayment === "ONLINE" ? "bg-purple-500" : ""
              } m-0.5`}
            ></div>
          </div>
          <label className="ml-2 flex-grow cursor-pointer">
            Online Payment
          </label>
        </div>

        {!showOtherOptions ? (
          <button
            onClick={() => setShowOtherOptions(true)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Other Options
          </button>
        ) : (
          <div className="space-y-3">
            <div
              className={`p-3 border rounded-md ${
                selectedPayment === "COD"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-500 bg-white hover:bg-purple-50"
              } flex items-center cursor-pointer transition-colors`}
              onClick={() => setSelectedPayment("COD")}
            >
              <div className="w-4 h-4 rounded-full border border-gray-400 bg-white">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedPayment === "COD" ? "bg-purple-500" : ""
                  } m-0.5`}
                ></div>
              </div>
              <label className="ml-2 flex-grow cursor-pointer">
                Cash on Delivery (COD)
              </label>
            </div>
            <button
              onClick={() => setShowOtherOptions(false)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-1" />
              Close Options
            </button>
          </div>
        )}
      </div>
    );
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

    await fetch(
      "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
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
        var responseurl = resultobj.response;
        var data = decryptEas(responseurl);
        data = JSON.parse(data);
        localStorage.setItem("paymentId", data.paymentId);
        localStorage.setItem("merchantTransactionId", mer);
        const paymentUrl = data.paymentUrl;
        window.location.href = paymentUrl;
      })
      .catch((error) => {
        console.log("getepayPortal", error.response);
        message.error("Failed to generate payment invoice");
      });
  };

  function Requery(paymentId: any) {
    setLoading(false);
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null
    ) {
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

      fetch("https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            var responseurl = resultobj.response;
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            setPaymentStatus(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILED"
            ) {
              if (data.paymentStatus === "FAILED") {
                const add = sessionStorage.getItem("address");
                if (add) {
                  setSelectedAddress(JSON.parse(add) as Address);
                }
              }

              if (data.paymentStatus === "SUCCESS") {
                axios({
                  method: "get",
                  url:
                    BASE_URL +
                    `/order-service/api/download/invoice?paymentId=${localStorage.getItem(
                      "merchantTransactionId"
                    )}&&userId=${customerId}`,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error("Error in payment confirmation:", error);
                  });
              }

              axios({
                method: "POST",
                url: BASE_URL + "/order-service/orderPlacedPaymet",
                data: {
                  paymentId: localStorage.getItem("merchantTransactionId"),
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((secondResponse) => {
                  localStorage.removeItem("paymentId");
                  localStorage.removeItem("merchantTransactionId");
                  fetchCartData();
                  Modal.success({
                    content: secondResponse.data.status
                      ? secondResponse.data.status
                      : "Order placed Successfully",
                    onOk: () => {
                      navigate("/main/myorders");
                      fetchCartData();
                    },
                  });
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
            }
          }
        })
        .catch((error) => console.log("Payment Status", error));
    }
  }
  const renderTimeSlotModal = (): JSX.Element => {
    return (
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-purple-700 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-500" />
              Select Delivery Time
            </div>
            <X
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setShowTimeSlotModal(false)}
            />
          </div>
        }
        open={showTimeSlotModal}
        onCancel={() => setShowTimeSlotModal(false)}
        footer={[
          <button
            key="delivery-info"
            onClick={() => {
              setShowTimeSlotModal(false);
              setTimeout(() => {
                setIsDeliveryTimelineModalVisible(true);
              }, 100);
            }}
            className="mr-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center transition-colors"
          >
            <Truck className="w-5 h-5 mr-2" /> Delivery Info
          </button>,
          <button
            key="close"
            onClick={() => setShowTimeSlotModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>,
        ]}
        centered
        width={600}
        closeIcon={null}
        className="time-slot-modal"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
          {timeSlots.length === 0 ? (
            <div className="text-center text-gray-500 p-8 flex flex-col items-center justify-center">
              <Clock className="w-16 h-16 text-purple-200 mb-4" />
              <p className="text-lg font-medium mb-2">
                No available delivery slots
              </p>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          ) : (
            <div className="space-y-6">
              {timeSlots.map((slot, index) => {
                // Create a formatted day name from dayOfWeek if formattedDay is not available
                const displayDay =
                  (slot as ExtendedTimeSlot).formattedDay ||
                  slot.dayOfWeek.charAt(0) +
                    slot.dayOfWeek.slice(1).toLowerCase();

                // Check if all timeslots have the same timing
                const uniqueTimeSlots = new Set(
                  [
                    slot.timeSlot1,
                    slot.timeSlot2,
                    slot.timeSlot3,
                    slot.timeSlot4,
                  ].filter(Boolean)
                );
                const allSameTimings = uniqueTimeSlots.size === 1;

                // Create time slot objects - handle cases where status properties might not exist
                const timeSlotObjects = [
                  {
                    key: "slot1",
                    value: slot.timeSlot1,
                    status: (slot as any).slot1Status === true,
                  },
                  {
                    key: "slot2",
                    value: slot.timeSlot2,
                    status: (slot as any).slot2Status === true,
                  },
                  {
                    key: "slot3",
                    value: slot.timeSlot3,
                    status: (slot as any).slot3Status === true,
                  },
                  {
                    key: "slot4",
                    value: slot.timeSlot4,
                    status: (slot as any).slot4Status === true,
                  },
                ];

                // If all timings are the same, only keep the first available one
                const filteredTimeSlots = allSameTimings
                  ? [
                      timeSlotObjects.find(
                        (slot) => slot.value && !slot.status
                      ) || timeSlotObjects[0],
                    ]
                  : timeSlotObjects.filter(
                      (slot) => slot.value && !slot.status
                    );

                return (
                  <div
                    key={slot.id || index}
                    className={`rounded-lg ${
                      index < timeSlots.length - 1 ? "border-b pb-6" : ""
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 shadow-sm"
                        aria-hidden="true"
                      >
                        <span className="font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-800">
                          {displayDay}
                        </div>
                        <div className="text-sm text-gray-500">{slot.date}</div>
                      </div>
                    </div>

                    {filteredTimeSlots.length === 0 ? (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-center text-gray-500">
                        No time slots available for this day
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4 pl-6 border-l-2 border-purple-100">
                        {filteredTimeSlots.map(
                          (timeSlotObj) =>
                            timeSlotObj.value && (
                              <div
                                key={`${slot.id}-${timeSlotObj.key}`}
                                onClick={() =>
                                  timeSlotObj.value &&
                                  handleSelectTimeSlot(
                                    slot.date,
                                    timeSlotObj.value,
                                    slot.dayOfWeek
                                  )
                                }
                                className={`
                                relative p-3 rounded-lg cursor-pointer transition-all duration-200
                                ${
                                  selectedTimeSlot === timeSlotObj.value &&
                                  selectedDate === slot.date
                                    ? "bg-green-50 border border-green-500 shadow-md"
                                    : "bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                                }
                              `}
                                role="button"
                                aria-selected={
                                  selectedTimeSlot === timeSlotObj.value &&
                                  selectedDate === slot.date
                                }
                                aria-label={`Select time slot ${timeSlotObj.value} on ${displayDay}`}
                                tabIndex={0}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Clock
                                      className={`w-4 h-4 mr-2 flex-shrink-0 ${
                                        selectedTimeSlot ===
                                          timeSlotObj.value &&
                                        selectedDate === slot.date
                                          ? "text-green-600"
                                          : "text-purple-500"
                                      }`}
                                    />
                                    <span
                                      className={`font-medium ${
                                        selectedTimeSlot ===
                                          timeSlotObj.value &&
                                        selectedDate === slot.date
                                          ? "text-green-800"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {timeSlotObj.value}
                                    </span>
                                  </div>
                                  {selectedTimeSlot === timeSlotObj.value &&
                                  selectedDate === slot.date ? (
                                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 text-white"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                                      Available
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <ShoppingBag className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-bold text-purple-600">
                    Checkout Details
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-purple-500" />
                        Delivery Time
                      </h3>
                      <button
                        onClick={openTimeSlotModal}
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        {selectedTimeSlot ? "Change Time" : "Select Time"}
                      </button>
                    </div>
                    {selectedTimeSlot ? (
                      <div className="p-3 bg-green-50 rounded-md border border-green-200">
                        <p className="text-green-800 font-medium">
                          {selectedDate}
                        </p>
                        <p className="text-green-700">{selectedTimeSlot}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                        <p className="text-yellow-700">
                          Please select a delivery time slot
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <ShoppingBag className="w-5 h-5 mr-2 text-purple-500" />
                      <h3 className="font-medium">
                        Order Items ({cartData.length})
                      </h3>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartData.map((item) => (
                        <div
                          key={item.itemId}
                          className="flex justify-between items-center p-2 border-b"
                        >
                          <div>
                            <p className="font-medium">{item.itemName}</p>
                            <p className="text-gray-600 text-sm">
                              Qty: {item.cartQuantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{item.itemPrice}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                      <h3 className="font-medium">Payment Method</h3>
                    </div>
                    {renderPaymentMethods()}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white border rounded-lg p-4 sticky top-4">
                    <h3 className="font-medium mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">GST</span>
                        <span>₹{subGst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span>₹{deliveryBoyFee.toFixed(2)}</span>
                      </div>
                      {coupenApplied && coupenDetails > 0 && (
                        <div className="flex justify-between py-2 text-green-600">
                          <span>Coupon Discount</span>
                          <span>-₹{coupenDetails.toFixed(2)}</span>
                        </div>
                      )}
                      {useWallet && usedWalletAmount > 0 && (
                        <div className="flex justify-between py-2 text-green-600">
                          <span>Wallet Amount</span>
                          <span>-₹{usedWalletAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total</span>
                          <span>₹{grandTotalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-4 px-2 sm:px-0">
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-1 text-purple-500" />
                        Apply Coupon
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="w-full p-2 border rounded-md sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                          disabled={coupenApplied}
                        />
                        {coupenApplied ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={deleteCoupen}
                            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md sm:rounded-l-none hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || coupenLoading}
                            className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-md sm:rounded-l-none hover:bg-purple-600 disabled:bg-purple-300 transition-colors"
                          >
                            {coupenLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                              "Apply"
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* checkbox for confirming the exchange of the items within 10 days of order*/}
                    <div className="flex items-start space-x-2 mt-4">
                      <input
                        type="checkbox"
                        id="exchangePolicy"
                        checked={exchangePolicyAccepted}
                        onChange={(e) =>
                          setExchangePolicyAccepted(e.target.checked)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="exchangePolicy"
                        className="text-sm text-gray-700"
                      >
                        You can request an exchange within 10 Days from your
                        order being delivered.
                      </label>
                    </div>

                    {walletAmount > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="useWallet"
                            checked={useWallet}
                            onChange={handleCheckboxToggle}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            disabled={walletAmount === 0 || loading}
                          />
                          <label
                            htmlFor="useWallet"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            Use wallet balance (₹{walletAmount.toFixed(2)})
                          </label>
                        </div>
                        {useWallet && (
                          <div className="mt-2 text-sm text-gray-600 space-y-1">
                            <p>Amount used: ₹{usedWalletAmount.toFixed(2)}</p>
                            <p>Remaining balance: ₹{afterWallet.toFixed(2)}</p>
                            {walletMessage && (
                              <p className="text-xs">{walletMessage}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={
                        loading || !selectedAddress || !selectedTimeSlot
                      }
                      className="w-full mt-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <>
                          {selectedPayment === "ONLINE"
                            ? "Proceed to Payment"
                            : "Place Order"}
                          <span className="ml-2">
                            ₹{grandTotalAmount.toFixed(2)}
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
      {renderTimeSlotModal()}
      {renderDeliveryTimelineModal()}
    </div>
  );
};

export default CheckoutPage;
