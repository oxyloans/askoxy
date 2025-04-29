import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CreditCard,
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
  const [isDeliveryTimelineModalVisible, setIsDeliveryTimelineModalVisible] = useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });
  const [merchantTransactionId, setMerchantTransactionId] = useState();
  const [showDeliveryTimelineModal, setShowDeliveryTimelineModal] = useState(false);
  const [isOneTimeFreeOfferActive, setIsOneTimeFreeOfferActive] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("profileData");
  const [isButtonDisabled, setisButtonDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freeTicketAvailable, setFreeTicketAvailable] = useState();

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

  const handleSelectTimeSlot = (
    date: string,
    timeSlot: string,
    day: string
  ) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSelectedDay(day);
    setShowTimeSlotModal(false);
    message.success(`Delivery time slot selected: ${date}, ${timeSlot}`);
    setIsDeliveryTimelineModalVisible(true);
  };

  const handleShowDeliveryTimeline = () => {
    if (isOneTimeFreeOfferActive) {
      setShowDeliveryTimelineModal(true);
    }
  };

  const renderDeliveryTimelineModal = () => {
    return (
      <Modal
        title="Delivery Timeline"
        open={isDeliveryTimelineModalVisible}
        onCancel={() => setIsDeliveryTimelineModalVisible(false)}
        footer={[
          <button 
            key="telugu" 
            onClick={() => {
              Modal.info({
                title: 'డెలివరీ సమయం',
                content: (
                  <div>
                    <p>📦 <strong>డెలివరీ సమయం:</strong> మీ ఆర్డర్‌ను 4 గంటల నుండి 4 రోజుల్లోపు డెలివరీ చేయడానికి ప్రయత్నిస్తున్నాం. మీ ప్రాంతంలో వచ్చే ఆర్డర్ల ఆధారంగా, వాటిని గ్రూప్ చేసి సమర్థవంతంగా డెలివరీ చేస్తున్నాం. 🚚</p>
                    <p>మీతో శాశ్వతమైన మంచి సంబంధం ఏర్పడాలని మేము ఆశిస్తున్నాం. మీరు మమ్మల్ని మీ స్నేహితులు, బంధువులతో షేర్ చేస్తే, మేము మరింత మందికి త్వరగా సేవలందించగలుగుతాం. 🙏</p>
                    <p>మీ సహకారం మాకు చాలా విలువైనది. ముందుగానే ధన్యవాదాలు!</p>
                  </div>
                ),
                okText: 'Close'
              });
            }}
            className="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            View in Telugu
          </button>,
          <button 
            key="english" 
            onClick={() => {
              Modal.info({
                title: 'Delivery Timeline',
                content: (
                  <div>
                    <p>📦 <strong>Delivery Timeline:</strong> Your order will be delivered within 4 hours to 4 days, depending on the volume of orders and location. We're doing our best to group nearby orders together so we can deliver more efficiently and sustainably. 🚚</p>
                    <p>With your support, we'll be able to grow and serve you even better. 🙏</p>
                    <p>Please support us by spreading the word to friends and family nearby! More orders = faster and more efficient deliveries for everyone! Thank you again!</p>
                  </div>
                ),
                okText: 'Close'
              });
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            View in English
          </button>
        ]}
        centered
        width={500}
        closeIcon={<X className="w-5 h-5" />}
      >
        <div className="text-center">
          {freeTicketAvailable === "YES" ? (
            <div>
              <Globe className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">1+1 Free Offer Active!</h3>
              <p className="mb-4">
                Choose your preferred language to view delivery timeline details.
              </p>
            </div>
          ) : (
            <div>
              <Truck className="w-16 h-16 mx-auto text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Delivery Information</h3>
              <p className="mb-4">
                Choose your preferred language to view delivery timeline details.
              </p>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  const formatDate = (date: Date, isToday: boolean = false): string => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const today = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }
    return `${day}-${month}-${year}`;
  };

  const isOrderPlacedToday = (orderDate?: string | null) => {
    if (!orderDate) return false;
    const today = new Date();
    const orderDateObj = new Date(orderDate);
    return (
      orderDateObj.getDate() === today.getDate() &&
      orderDateObj.getMonth() === today.getMonth() &&
      orderDateObj.getFullYear() === today.getFullYear()
    );
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/order-service/fetchTimeSlotlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && Array.isArray(response.data)) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const startDayOffset = 1;

        const formattedTimeSlots = [];

        for (let index = 0; index < 3; index++) {
          const dayOffset = startDayOffset + index;
          const slotDate = new Date(currentDate);
          slotDate.setDate(currentDate.getDate() + dayOffset);
          const dayIndex = (currentDay + dayOffset) % 7;
          const dayOfWeek = dayNames[dayIndex].toUpperCase();
          const formattedDate = `${String(slotDate.getDate()).padStart(
            2,
            "0"
          )}-${String(slotDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-${slotDate.getFullYear()}`;

          const slotData = response.data[index];

          if (slotData) {
            if (!slotData.isAvailable) {
              formattedTimeSlots.push({
                ...slotData,
                dayOfWeek,
                expectedDeliveryDate: formattedDate,
                timeSlot1: slotData.timeSlot1 || null,
                timeSlot2: slotData.timeSlot2 || null,
                timeSlot3: slotData.timeSlot3 || null,
                timeSlot4: slotData.timeSlot4 || null,
                isAvailable: slotData.isAvailable,
                date: formattedDate,
              });
            }
          }
        }

        setTimeSlots(formattedTimeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to fetch delivery time slots");
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
      setFreeTicketAvailable(response.data.offerElgible);
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
      setAfterWallet(usableAmount);
      setWalletMessage(response.data.message || "");
      setUsedWalletAmount(0);
    } catch (error: unknown) {
      console.error("Error fetching wallet amount:", error);
      message.error("Failed to fetch wallet balance");
      setWalletAmount(0);
      setAfterWallet(0);
      setUsedWalletAmount(0);
    }
  };

  function grandTotalfunc() {
    let total = totalAmount + deliveryBoyFee;
    let usedWallet = 0;

    // Apply coupon discount if applicable
    if (coupenApplied && coupenDetails > 0) {
      total = Math.max(0, total - coupenDetails);
    }

    // Apply wallet amount if selected
    if (useWallet && walletAmount > 0) {
      usedWallet = Math.min(walletAmount, total);
      total = Math.max(0, total - usedWallet);
    }

    // Update states
    setUsedWalletAmount(usedWallet);
    setAfterWallet(walletAmount - usedWallet);
    setGrandTotalAmount(total);

    // Automatically switch to COD if total is zero
    if (total === 0) {
      setSelectedPayment("COD");
    }
  }

  const handleCheckboxToggle = () => {
    const newValue = !useWallet;
    const potentialUsedAmount = newValue
      ? Math.min(walletAmount, grandTotalAmount || grandTotal)
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
        setUsedWalletAmount(potentialUsedAmount);
        setAfterWallet(walletAmount - potentialUsedAmount);
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

      if (useWallet && walletAmount < usedWalletAmount) {
        Modal.error({
          title: "Wallet Error",
          content: "Insufficient wallet balance",
        });
        return;
      }

      setLoading(true);

      const avail = freeTicketAvailable === "YES" ? "YES" : null;

      const response = await axios.post(
        `${BASE_URL}/order-service/orderPlacedPaymet`,
        {
          address: selectedAddress.address,
          customerId,
          flatNo: selectedAddress.flatNo,
          landMark: selectedAddress.landMark,
          orderStatus: selectedPayment,
          pincode: selectedAddress.pincode,
          walletAmount: usedWalletAmount,
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
          freeTicketAvailable: avail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data) {
        await fetchCartData();

        // GA4 Purchase Event Tracking
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "purchase", {
            transaction_id:
              response.data.paymentId || `COD_${new Date().getTime()}`,
            value: grandTotalAmount,
            currency: "INR",
            tax: subGst,
            shipping: deliveryBoyFee,
            coupon: coupenApplied ? couponCode.toUpperCase() : "",
            items: cartData.map((item) => ({
              item_id: item.itemId,
              item_name: item.itemName,
              price: parseFloat(item.itemPrice),
              quantity: parseInt(item.cartQuantity),
              item_category: "Rice",
            })),
          });
        }

        if (selectedPayment === "COD" && !response.data.paymentId) {
          Modal.success({
            content: "Order placed Successfully",
            onOk: () => navigate("/main/myorders"),
          });
        } else if (selectedPayment === "ONLINE" && response.data.paymentId) {
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
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

        Modal.confirm({
          title: "Proceed to Payment?",
          content:
            "You can choose to continue with online payment or switch to Cash on Delivery.",
          okText: "Continue Payment",
          cancelText: "Switch to COD",
          onOk() {
            window.location.href = paymentUrl;
          },
          onCancel() {
            setSelectedPayment("COD");
            message.info("Payment method changed to Cash on Delivery");
          },
        });
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

  const renderTimeSlotModal = () => {
    return (
      <Modal
        title="Select Delivery Time Slot"
        open={showTimeSlotModal}
        onCancel={() => setShowTimeSlotModal(false)}
        footer={[
          <button 
            key="delivery-info" 
            onClick={handleShowDeliveryTimeline}
            className="mr-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center"
          >
            <Truck className="w-5 h-5 mr-2" /> Delivery Info
          </button>,
          <button 
            key="close" 
            onClick={() => setShowTimeSlotModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        ]}
        centered
        width={500}
        closeIcon={<X className="w-5 h-5" />}
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {timeSlots.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No available delivery slots
            </div>
          ) : (
            timeSlots.map((slot, index) => (
              <div key={slot.id || index} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium">
                    {slot.dayOfWeek || `Day ${index + 1}`}
                  </div>
                  <div className="text-right text-gray-700">{slot.date}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    slot.timeSlot1,
                    slot.timeSlot2,
                    slot.timeSlot3,
                    slot.timeSlot4,
                  ].map(
                    (timeSlot, i) =>
                      timeSlot && (
                        <div
                          key={i}
                          className={`py-3 px-4 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition ${
                            selectedTimeSlot === timeSlot &&
                            selectedDate === slot.date
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() =>
                            handleSelectTimeSlot(
                              slot.date || "",
                              timeSlot || "",
                              slot.dayOfWeek || ""
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span>{timeSlot}</span>
                            <span className="text-xs text-green-600">
                              Available
                            </span>
                          </div>
                        </div>
                      )
                  )}
                </div>
                {index < timeSlots.length - 1 && (
                  <div className="border-b border-gray-100 mt-4"></div>
                )}
              </div>
            ))
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
                    <div className="space-y-3">
                      <div
                        className={`p-3 border rounded-md cursor-pointer flex items-center ${
                          selectedPayment === "ONLINE"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedPayment("ONLINE")}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedPayment === "ONLINE"
                              ? "border-purple-500 bg-white"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPayment === "ONLINE" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500 m-0.5"></div>
                          )}
                        </div>
                        <span className="ml-2">Online Payment</span>
                      </div>
                      <div
                        className={`p-3 border rounded-md cursor-pointer flex items-center ${
                          selectedPayment === "COD"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedPayment("COD")}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedPayment === "COD"
                              ? "border-purple-500 bg-white"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPayment === "COD" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500 m-0.5"></div>
                          )}
                        </div>
                        <span className="ml-2">Cash on Delivery</span>
                      </div>
                    </div>
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