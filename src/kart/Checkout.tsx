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
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import decryptEas from "./decryptEas";
import encryptEas from "./encryptEas";
import { CartContext } from "../until/CartContext";
import BASE_URL from "../Config";
// import DeliveryFee from "./DeliveryFee";
import { calculateDeliveryFee } from "./DeliveryFee";

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
  quantity: number;
  status: string;
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
  slot1Status?: boolean;
  slot2Status?: boolean;
  slot3Status?: boolean;
  slot4Status?: boolean;
}

interface Coupon {
  couponCode: string;
  couponValue?: number;
  isActive: boolean;
  status: string;
  couponDesc?: string;
  minOrder?: number;
}

interface DayInfo {
  dayOfWeek: string;
  date: string;
  formattedDay: string;
}

interface ExtendedTimeSlot extends TimeSlot {
  formattedDay?: string;
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupenDetails, setCoupenDetails] = useState<number | null>(null);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [coupenLoading, setCoupenLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletTotal, setWalletTotal] = useState<number>(0);
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"ONLINE" | "COD">(
    "ONLINE"
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    state?.selectedAddress || null
  );
  const [grandTotalAmount, setGrandTotalAmount] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(0);
  const [handlingFee, setHandlingFee] = useState<number | null>(0);
  const [subGst, setSubGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [walletMessage, setWalletMessage] = useState<string>("");
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [afterWallet, setAfterWallet] = useState<number>(0);
  const [usedWalletAmount, setUsedWalletAmount] = useState<number>(0);
  const [isDeliveryTimelineModalVisible, setIsDeliveryTimelineModalVisible] =
    useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });
  const [merchantTransactionId, setMerchantTransactionId] = useState<
    string | undefined
  >();
  const [showDeliveryTimelineModal, setShowDeliveryTimelineModal] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [language, setLanguage] = useState<"english" | "telugu">("english");
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [walletApplicable, setWalletApplicable] = useState(false);
  const [minOrderForWallet, setMinOrderForWallet] = useState(500);
  const [minOrderAmount, setMinOrderAmount] = useState(499);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangePolicyAccepted, setExchangePolicyAccepted] = useState(false);
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("profileData");
  //states for small cart fee and service fee
  const [smallCartFee, setSmallCartFee] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);

  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }
  const { count, setCount } = context;

  const isFreeItem = (item: CartItem) => item.status === "FREE";

  const applyBmvCashBack = async () => {
    if (!customerId) {
      console.error("Customer ID is missing");
      return;
    }

    const requestBody = {
      orderAmount: totalAmount,
      userId: customerId,
    };

    try {
      await axios.post(`${BASE_URL}/user-service/bmvCashBack`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("BMV cashback applied successfully");
    } catch (error) {
      console.error("Error applying BMV cashback:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
    getWalletAmount();
    fetchTimeSlots();
    fetchAvailableCoupons();
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
    if (trans === orderId && paymentId) {
      Requery(paymentId);
    }
  }, [orderId]);

  useEffect(() => {
    if (selectedTimeSlot && !isDeliveryTimelineModalVisible) {
      setIsDeliveryTimelineModalVisible(true);
    }
  }, [selectedTimeSlot]);

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

  const handleShowDeliveryTimeline = () => {
    setShowDeliveryTimelineModal(true);
  };

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

  const getAvailableDays = (maxDays: number = 14): DayInfo[] => {
    const today = new Date();
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const nextDays = getAvailableDays(14);

        interface ApiTimeSlot {
          id: string;
          dayOfWeek: string;
          timeSlot1: string | null;
          timeSlot2: string | null;
          timeSlot3: string | null;
          timeSlot4: string | null;
          isAvailable: boolean;
        }

        const formattedTimeSlots: ExtendedTimeSlot[] = [];
        for (const dayInfo of nextDays) {
          const matchingSlot = response.data.find(
            (slot: ApiTimeSlot) =>
              slot.dayOfWeek === dayInfo.dayOfWeek && slot.isAvailable === false
          );

          if (matchingSlot) {
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
                isAvailable: false,
                isToday: false,
                date: dayInfo.date,
                formattedDay: dayInfo.formattedDay,
              });
            }
          }

          if (formattedTimeSlots.length >= 3) {
            break;
          }
        }

        setTimeSlots(formattedTimeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to fetch delivery time slots");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCoupons = async (): Promise<void> => {
    try {
      setCouponsLoading(true);
      console.log("Fetching coupons from API...");
      const response = await axios.get(
        `${BASE_URL}/order-service/getAllCoupons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const filteredCoupons = response.data
          .filter(
            (coupon: any) =>
              coupon.isActive === true &&
              coupon.status === "PUBLIC" &&
              typeof coupon.couponValue === "number" &&
              coupon.couponValue >= 0
          )
          .map((coupon: any) => ({
            couponCode: coupon.couponCode,
            couponValue: coupon.couponValue,
            isActive: coupon.isActive,
            status: coupon.status,
            couponDesc: coupon.couponDesc,
            minOrder: coupon.minOrder,
          }));
        console.log("Filtered Coupons:", filteredCoupons);
        setAvailableCoupons(filteredCoupons);
        if (filteredCoupons.length === 0) {
          console.warn("No coupons passed the filter criteria.");
        }
      } else {
        console.warn("API response is not an array or is empty.");
        setAvailableCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching available coupons:", error);
      message.error("Failed to fetch available coupons");
      setAvailableCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleOpenCouponsModal = async () => {
    await fetchAvailableCoupons();
    setShowCouponsModal(true);
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
    deliveryFee: number | null,
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
        deliveryBoyFee: cartData.length > 0 ? deliveryFee ?? 0 : 0,
        smallCartFee: cartData.length > 0 ? smallCartFee : 0,
        serviceFee: cartData.length > 0 ? serviceFee : 0,
        amount: grandTotalAmount,
        subTotal: grandTotal,
        gstAmount: subGst,
      };

      const response = await axios.post(
        `${BASE_URL}/order-service/placeOrder`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.customerCartResponseList) {
        const cartItems = response.data.customerCartResponseList;
        setCartData(cartItems || []);

        const totalQuantity = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + (item.cartQuantity ? parseInt(item.cartQuantity) : 0),
          0
        );
        setCount(totalQuantity);

        const amountToPay = cartItems
          .filter((item: CartItem) => ["ADD", "COMBO"].includes(item.status))
          .reduce(
            (sum: number, item: CartItem) =>
              sum + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
            0
          );
        console.log("this is the amout to pay" + amountToPay);

        const gstAmount = parseFloat(response.data.totalGstAmountToPay || "0");

        let deliveryFee = 0;
        let handlingFee = 0;
        if (
          cartItems.length > 0 &&
          selectedAddress?.latitude !== undefined &&
          selectedAddress?.longitude !== undefined
        ) {
          const {
            fee,
            handlingFee: calculatedHandlingFee,
            walletApplicable: walletFlag,
            minOrderForWallet: minWallet,
            minOrderAmount: minOrderamnt,
          } = await calculateDeliveryFee(
            selectedAddress.latitude,
            selectedAddress.longitude,
            amountToPay
          );

          setWalletApplicable(walletFlag);
          setMinOrderForWallet(minWallet);
          setMinOrderAmount(minOrderamnt);
          deliveryFee = fee ?? 0;
          handlingFee = calculatedHandlingFee;
          console.log(
            "Delivery Fee:",
            fee,
            "Handling Fee:",
            calculatedHandlingFee,
            "Wallet Applicable:",
            walletFlag,
            "Min Order For Wallet:",
            minWallet,
            "Min Order For place order:",
            minOrderamnt
          );
        } else if (cartItems.length > 0) {
          console.error("Latitude or Longitude is undefined");
        }

        setSubGst(gstAmount);
        setTotalAmount(amountToPay);
        setGrandTotal(amountToPay);
        setDeliveryFee(deliveryFee);
        setHandlingFee(handlingFee);

        const totalWithGst = amountToPay + gstAmount;
        const totalWithFees =
          totalWithGst +
          (cartItems.length > 0
            ? deliveryFee + handlingFee + smallCartFee + serviceFee
            : 0);
        setGrandTotalAmount(totalWithFees);
      } else {
        setCartData([]);
        setCount(0);
        setSubGst(0);
        setDeliveryFee(0);
        setHandlingFee(0);
        setTotalAmount(0);
        setGrandTotal(0);
        setGrandTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
  };

  const fetchInitialData = async () => {
    try {
      setPricesLoading(true);

      const cartResponse = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (cartResponse.data.customerCartResponseList) {
        const cartItems = cartResponse.data.customerCartResponseList;
        setCartData(cartItems || []);

        const totalQuantity = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + (item.cartQuantity ? parseInt(item.cartQuantity) : 0),
          0
        );
        setCount(totalQuantity);

        const amountToPay = cartItems
          .filter((item: CartItem) => item.status === "ADD")
          .reduce(
            (sum: number, item: CartItem) =>
              sum + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
            0
          );

        const gstAmount = parseFloat(
          cartResponse.data.totalGstAmountToPay || "0"
        );

        let deliveryFee = 0;
        let handlingFee = 0;
        if (
          cartItems.length > 0 &&
          selectedAddress?.latitude !== undefined &&
          selectedAddress?.longitude !== undefined
        ) {
          console.log(
            "Calculating delivery fee for coordinates:",
            selectedAddress.latitude,
            selectedAddress.longitude,
            totalAmount
          );
          const { fee, handlingFee: calculatedHandlingFee } =
            await calculateDeliveryFee(
              selectedAddress.latitude,
              selectedAddress.longitude,
              amountToPay
            );
          deliveryFee = fee ?? 0;
          handlingFee = calculatedHandlingFee;
        } else if (cartItems.length > 0) {
          console.error("Latitude or Longitude is undefined");
        }

        setGrandTotal(amountToPay);
        setSubGst(gstAmount);
        setTotalAmount(amountToPay);
        setDeliveryFee(deliveryFee);
        setHandlingFee(handlingFee);

        const totalWithGst = amountToPay + gstAmount;
        const totalWithFees =
          totalWithGst +
          (cartItems.length > 0
            ? deliveryFee + handlingFee + smallCartFee + serviceFee
            : 0);
        setGrandTotalAmount(totalWithFees);

        try {
          const walletResponse = await axios.post(
            `${BASE_URL}/order-service/applyWalletAmountToCustomer`,
            { customerId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const usableAmount =
            walletResponse.data.usableWalletAmountForOrder || 0;
          setWalletAmount(usableAmount);
          setAfterWallet(usableAmount);
          setWalletMessage(walletResponse.data.message || "");
        } catch (walletError) {
          console.error("Error fetching wallet amount:", walletError);
        }

        fetchTimeSlots();

        requestAnimationFrame(() => {
          setPricesLoading(false);
        });
      } else {
        setCartData([]);
        setCount(0);
        setGrandTotal(0);
        setSubGst(0);
        setDeliveryFee(0);
        setHandlingFee(0);
        setTotalAmount(0);
        setGrandTotalAmount(0);
        setPricesLoading(false);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      message.error("Failed to load checkout data");
      setPricesLoading(false);
    }
  };

  const handlingFeeCalculation = (
    fee: number | null,
    handlingFee: number | null
  ) => {
    if (fee === null || handlingFee === null) {
      console.error("Invalid fee or handling fee received:", {
        fee,
        handlingFee,
      });
      message.error("Failed to calculate delivery fee.");
      return;
    }
    setDeliveryFee(fee);
    setHandlingFee(handlingFee);
  };

  const handleInterested = async () => {
    try {
      setIsSubmitting(true);
      const userId = localStorage.getItem("userId");
      const mobileNumber = localStorage.getItem("whatsappNumber");
      const formData = {
        askOxyOfers: "FREESAMPLE",
        userId: userId,
        mobileNumber: mobileNumber,
        projectType: "ASKOXY",
      };

      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        formData
      );
      localStorage.setItem("askOxyOfers", response.data.askData);

      Modal.success({
        title: "Thank You!",
        content: "Your interest has been successfully registered.",
        okText: "OK",
        onOk: () => navigate("/main/myorders"),
      });
    } catch (error) {
      const axiosError = error as any;
      if (
        axiosError.response?.status === 500 ||
        axiosError.response?.status === 400
      ) {
        message.warning("You have already participated. Thank you!");
      } else {
        console.error("API Error:", axiosError);
        message.error("Failed to submit your interest. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = () => {
    const data = {
      couponCode: couponCode,
      customerId: customerId,
      subTotal: grandTotal,
    };
    setCoupenLoading(true);

    axios
      .post(`${BASE_URL}/order-service/applycoupontocustomer`, data, {
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

  const handleSelectCoupon = async (coupon: Coupon) => {
    setCouponCode(coupon.couponCode);
    setCoupenLoading(true);

    const data = {
      couponCode: coupon.couponCode,
      customerId: customerId,
      subTotal: grandTotal,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/order-service/applycoupontocustomer`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { discount, grandTotal } = response.data;
      message.success(`Coupon ${coupon.couponCode} applied successfully`);
      setCoupenDetails(discount || 0);
      setCoupenApplied(response.data.couponApplied);
      setShowCouponsModal(false);
    } catch (error) {
      console.error("Error applying coupon:", error);
      message.error("Failed to apply coupon");
    } finally {
      setCoupenLoading(false);
    }
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
      const isApplicable = response.data.status ?? false;

      setWalletAmount(usableAmount);
      setAfterWallet(usableAmount);
      setWalletApplicable(isApplicable);
      setUsedWalletAmount(0);
      setUseWallet(false);
      setWalletMessage(response.data.message || "");

      if (response.data.message) {
        message.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Wallet fetch failed:", error);
      setWalletAmount(0);
      setAfterWallet(0);
      setUsedWalletAmount(0);
      setUseWallet(false);
      setWalletApplicable(false);
      setWalletMessage("Unable to check wallet status");
      message.error("Wallet check failed");
    }
  };

  function grandTotalfunc() {
    const effectiveDeliveryFee = cartData.length > 0 ? deliveryFee ?? 0 : 0;
    const effectiveHandlingFee = cartData.length > 0 ? handlingFee ?? 0 : 0;
    const baseTotal =
      totalAmount + effectiveDeliveryFee + effectiveHandlingFee + subGst;
    let discountedTotal = baseTotal;

    if (coupenApplied && coupenDetails) {
      discountedTotal = Math.max(0, discountedTotal - coupenDetails);
    }

    let newUsedWalletAmount = 0;
    if (useWallet && walletAmount > 0) {
      newUsedWalletAmount = Math.min(walletAmount, discountedTotal);
      discountedTotal = Math.max(0, discountedTotal - newUsedWalletAmount);
    }

    setUsedWalletAmount(newUsedWalletAmount);
    setAfterWallet(walletAmount - newUsedWalletAmount);
    setGrandTotalAmount(discountedTotal);
  }
  const handleCheckboxToggle = () => {
    if (
      !walletApplicable ||
      walletAmount === 0 ||
      totalAmount < minOrderForWallet
    ) {
      message.warning(
        `Wallet not applicable. Minimum cart amount should be ₹${minOrderForWallet}`
      );
      return;
    }

    const newUseWallet = !useWallet;

    const baseAmount =
      totalAmount +
      (cartData.length > 0 ? deliveryFee ?? 0 : 0) +
      (cartData.length > 0 ? handlingFee ?? 0 : 0) +
      subGst -
      (coupenApplied && coupenDetails ? coupenDetails : 0);

    const walletToApply = Math.min(walletAmount, baseAmount);

    Modal.confirm({
      title: newUseWallet ? "Apply Wallet?" : "Remove Wallet?",
      content: newUseWallet
        ? `Use ₹${walletToApply.toFixed(2)} from your wallet?`
        : `Remove wallet usage of ₹${usedWalletAmount.toFixed(2)}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setUseWallet(newUseWallet);
        setUsedWalletAmount(newUseWallet ? walletToApply : 0);
        setAfterWallet(walletAmount - (newUseWallet ? walletToApply : 0));
        setGrandTotalAmount(baseAmount - (newUseWallet ? walletToApply : 0));
        message.success(newUseWallet ? "Wallet Applied" : "Wallet Removed");
      },
    });
  };

  useEffect(() => {
    grandTotalfunc();
  }, [
    totalAmount,
    deliveryFee,
    coupenApplied,
    coupenDetails,
    useWallet,
    cartData,
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
      if (cartData.length === 0) {
        Modal.error({
          title: "Cart Empty",
          content: "Please add items to your cart before proceeding.",
          okText: "OK",
          onOk: () => navigate("/main/mycart"),
        });
        return;
      }

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

      if (useWallet && usedWalletAmount > walletAmount) {
        Modal.error({
          title: "Wallet Error",
          content: "Insufficient wallet balance",
        });
        return;
      }

      if (!selectedAddress) {
        Modal.error({ title: "Error", content: "Please select an address." });
        return;
      }

      if (deliveryFee === null) {
        Modal.error({
          title: "Error",
          content: "Delivery not available for this location.",
        });
        return;
      }

      setLoading(true);

      const finalWalletAmount = useWallet ? usedWalletAmount : 0;
      console.log(
        "Final Wallet Amount:",
        finalWalletAmount,
        "deliveryFee:",
        deliveryFee,
        "handlingFee:",
        handlingFee,
        "grandTotalAmount:",
        grandTotalAmount
      );
      const response = await axios.post(
        `${BASE_URL}/order-service/orderPlacedPaymet`,
        {
          address: selectedAddress?.address,
          customerId,
          flatNo: selectedAddress?.flatNo,
          landMark: selectedAddress?.landMark,
          orderStatus: selectedPayment,
          pincode: selectedAddress?.pincode,
          walletAmount: finalWalletAmount,
          couponCode: coupenApplied ? couponCode.toUpperCase() : null,
          couponValue: coupenDetails || 0,
          deliveryBoyFee: cartData.length > 0 ? deliveryFee ?? 0 : 0,
          amount: grandTotalAmount,
          subTotal: grandTotal,
          gstAmount: subGst,
          dayOfWeek: selectedDay,
          expectedDeliveryDate: selectedDate,
          timeSlot: selectedTimeSlot,
          latitude: selectedAddress?.latitude,
          longitude: selectedAddress?.longitude,
          orderFrom: "WEB",
          paymentType: selectedPayment === "COD" ? 0 : 1,
          handlingFee: handlingFee,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data) {
        await fetchCartData();

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "purchase", {
            transaction_id:
              response.data.paymentId ||
              `${selectedPayment}_${new Date().getTime()}`,
            value: grandTotalAmount,
            currency: "INR",
            tax: subGst,
            shipping: cartData.length > 0 ? deliveryFee ?? 0 : 0,
            coupon: coupenApplied ? couponCode.toUpperCase() : "",
            payment_type: selectedPayment,
            items: cartData.map((item) => ({
              item_id: item.itemId,
              item_name: item.itemName,
              price: parseFloat(item.itemPrice),
              quantity: parseInt(item.cartQuantity),
              item_category: "any",
              couponCode: null,
            })),
          });
        }

        if (selectedPayment === "COD") {
          applyBmvCashBack();
          Modal.success({
            content: "Order placed successfully! You'll pay on delivery.",
            onOk: () => {
              navigate("/main/myorders");
              fetchCartData();
            },
          });
        } else {
          if (response.data.paymentId) {
            const number = localStorage.getItem("number");
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
              ru: `https://amountms.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              callbackUrl: `https://ms.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              currency: "INR",
              paymentMode: "ALL",
              money: "single",
              amountType: "IPG",
              txnNote: "Rice Order In Live",
              vpa: "getepay.merchant128638@icici",
            };

            getepayPortal(paymentData);
          } else {
            message.error("Order failed");
          }
        }
      } else {
        message.error("Failed to place order");
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
    const ciphertext = encryptEas(JsonData);
    const newCipher = ciphertext.toUpperCase();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });

    try {
      const response = await fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );
      const result = await response.text();
      const resultobj = JSON.parse(result);
      const responseurl = resultobj.response;
      const decryptedData = decryptEas(responseurl);
      const data = JSON.parse(decryptedData);
      localStorage.setItem("paymentId", data.paymentId);
      localStorage.setItem("merchantTransactionId", mer);
      const paymentUrl = data.paymentUrl;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("getepayPortal error:", error);
      message.error("Failed to generate payment invoice");
    }
  };

  const Requery = (paymentId: any) => {
    setLoading(true);
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

      const ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );
      const newCipher = ciphertext.toUpperCase();

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      const raw = JSON.stringify({
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
          const resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            const responseurl = resultobj.response;
            const data = decryptEas(responseurl);
            const parsedData = JSON.parse(data);
            setPaymentStatus(parsedData.paymentStatus);
            if (
              parsedData.paymentStatus === "SUCCESS" ||
              parsedData.paymentStatus === "FAILED"
            ) {
              if (parsedData.paymentStatus === "FAILED") {
                const add = sessionStorage.getItem("address");
                if (add) {
                  setSelectedAddress(JSON.parse(add) as Address);
                }
              }

              if (parsedData.paymentStatus === "SUCCESS") {
                axios
                  .get(
                    `${BASE_URL}/order-service/api/download/invoice?paymentId=${localStorage.getItem(
                      "merchantTransactionId"
                    )}&userId=${customerId}`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error("Error in payment confirmation:", error);
                  });
              }

              axios
                .post(
                  `${BASE_URL}/order-service/orderPlacedPaymet`,
                  {
                    paymentId: localStorage.getItem("merchantTransactionId"),
                    paymentStatus: parsedData.paymentStatus,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((secondResponse) => {
                  localStorage.removeItem("paymentId");
                  localStorage.removeItem("merchantTransactionId");
                  fetchCartData();
                  applyBmvCashBack();
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
        .catch((error) => console.error("Payment Status error:", error));
    }
    setLoading(false);
  };

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
              {timeSlots.map((slot: TimeSlot, index: number) => {
                const displayDay =
                  (slot as ExtendedTimeSlot).formattedDay ||
                  slot.dayOfWeek.charAt(0) +
                    slot.dayOfWeek.slice(1).toLowerCase();

                const uniqueTimeSlots = new Set(
                  [
                    slot.timeSlot1,
                    slot.timeSlot2,
                    slot.timeSlot3,
                    slot.timeSlot4,
                  ].filter(Boolean)
                );
                const allSameTimings = uniqueTimeSlots.size === 1;

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
                                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                  selectedTimeSlot === timeSlotObj.value &&
                                  selectedDate === slot.date
                                    ? "bg-green-50 border border-green-500 shadow-md"
                                    : "bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                                }`}
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

  const renderCouponsModal = (): JSX.Element => {
    console.log("Rendering Coupons Modal, availableCoupons:", availableCoupons);
    return (
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-purple-700 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-purple-500" />
              Available Coupons
            </div>
            <X
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setShowCouponsModal(false)}
            />
          </div>
        }
        open={showCouponsModal}
        onCancel={() => setShowCouponsModal(false)}
        footer={[
          <button
            key="close"
            onClick={() => setShowCouponsModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>,
        ]}
        centered
        width={600}
        closeIcon={null}
        className="coupons-modal"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
          {couponsLoading ? (
            <div className="text-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
              <p className="text-gray-500 mt-2">Loading coupons...</p>
            </div>
          ) : availableCoupons.length === 0 ? (
            <div className="text-center text-gray-500 p-8 flex flex-col items-center justify-center">
              <Tag className="w-16 h-16 text-purple-200 mb-4" />
              <p className="text-lg font-medium mb-2">No available coupons</p>
              <p className="text-sm text-gray-400">
                Check back later for offers
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableCoupons.map((coupon: Coupon) => (
                <div
                  key={coupon.couponCode}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-purple-700">
                        {coupon.couponCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        Discount: ₹
                        {coupon.couponValue !== undefined
                          ? coupon.couponValue.toFixed(2)
                          : "0.00"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Min. Order: ₹
                        {coupon.minOrder !== undefined
                          ? coupon.minOrder.toFixed(2)
                          : "0.00"}
                      </p>
                      {coupon.couponDesc && (
                        <p className="text-sm text-gray-500 mt-1">
                          {coupon.couponDesc}
                        </p>
                      )}
                    </div>
                    <button
                      className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                      onClick={() => handleSelectCoupon(coupon)}
                      disabled={coupenLoading}
                    >
                      {coupenLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                </div>
              ))}
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
                      {cartData.length === 0 ? (
                        <p className="text-gray-600 text-center">
                          Your cart is empty
                        </p>
                      ) : (
                        cartData.map((item) => (
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
                            {isFreeItem(item) ? (
                              <p className="text-green-600 font-semibold">
                                FREE
                              </p>
                            ) : (
                              <p className="font-medium">₹{item.itemPrice}</p>
                            )}
                          </div>
                        ))
                      )}
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
                      {cartData.length > 0 && deliveryFee !== null && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      {cartData.length > 0 &&
                        handlingFee !== null &&
                        handlingFee > 0 && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Handling Fee</span>
                            <span>₹{handlingFee.toFixed(2)}</span>
                          </div>
                        )}
                      {cartData.length > 0 && smallCartFee > 0 && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Small Cart Fee</span>
                          <span>₹{smallCartFee.toFixed(2)}</span>
                        </div>
                      )}
                      {cartData.length > 0 && serviceFee > 0 && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Service Fee</span>
                          <span>₹{serviceFee.toFixed(2)}</span>
                        </div>
                      )}
                      {coupenApplied && coupenDetails && (
                        <div className="flex justify-between py-2 text-green-600">
                          <span>Coupon Discount</span>
                          <span>-₹{coupenDetails.toFixed(2)}</span>
                        </div>
                      )}
                      {totalAmount < 500 && (
                        <div className="mt-3 px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md text-sm">
                          Use minimum ₹500 to skip handling fee and use wallet
                          balance.
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
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOpenCouponsModal}
                        className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        View Available Coupons
                      </motion.button>
                    </div>

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

                    {walletApplicable && totalAmount >= minOrderForWallet ? (
                      <p className="text-sm text-green-600 mt-1">
                        Wallet applicable! You can use ₹
                        {walletAmount.toFixed(2)}.
                      </p>
                    ) : (
                      <p className="text-sm text-red-500 mt-1">
                        Wallet not applicable. Minimum order amount ₹
                        {minOrderForWallet} required.
                      </p>
                    )}

                    <div className="flex items-center space-x-2 mt-3">
                      <input
                        type="checkbox"
                        id="useWallet"
                        checked={useWallet}
                        onChange={handleCheckboxToggle}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="useWallet"
                        className="text-sm text-gray-700"
                      >
                        Use Wallet Balance (₹{walletAmount.toFixed(2)})
                      </label>
                    </div>
                    <div className="mt-3">
                      {grandTotal < minOrderAmount && (
                        <label
                          htmlFor="exchangePolicy"
                          className="text-sm text-red-500"
                        >
                          We kindly request you to add few more items, as the
                          minimum order amount is ₹{minOrderAmount} to place
                          order.
                        </label>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={
                        loading ||
                        !selectedAddress ||
                        !selectedTimeSlot ||
                        cartData.length === 0 ||
                        deliveryFee === null ||
                        grandTotal < minOrderAmount
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
            <Footer />
            {renderTimeSlotModal()}
            {renderDeliveryTimelineModal()}
            {renderCouponsModal()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
