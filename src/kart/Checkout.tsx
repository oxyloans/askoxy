import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Alert, Modal } from "antd";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Tag,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";
import decryptEas from "./decryptEas";
import encryptEas from "./encryptEas";
import { Loader2, X } from "lucide-react";
import Checkbox from "antd";
import { CartContext } from "../until/CartContext";
import { log } from "console";
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
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}

// First, define an interface for the time slot data structure
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
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupenDetails, setCoupenDetails] = useState<any>(null);
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
  const [walletMessage, setWalletMessage] = useState();
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [afterWallet, setAfterWallet] = useState<number>(0);
  const [usedWalletAmount, setUsedWalletAmount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsappNumber: "",
  });
  const [merchantTransactionId, setMerchantTransactionId] = useState();
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Time slot related states
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
    console.log(trans === orderId);
    if (trans === orderId) {
      Requery(paymentId);
    }
  }, [orderId]);

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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to get 1-12 instead of 0-11
    const year = date.getFullYear();

    // Check if date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    // Return formatted date for other days
    return `${day}-${month}-${year}`; // Now using proper month number with padding
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Determine if order was placed today
        // You'll need to replace this with your actual order date
        const orderDate = null; // Replace with your actual order date variable
        const orderPlacedToday = orderDate
          ? isOrderPlacedToday(orderDate)
          : false;

        // Day names array for mapping day indices to names
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        // Always start from tomorrow (day offset 1)
        // This ensures we NEVER include today in the 3 days
        const startDayOffset = 1;

        // Process data for 3 days, starting from tomorrow
        const formattedTimeSlots = Array.from({ length: 3 }).map((_, index) => {
          // Calculate date for this slot (starting from tomorrow)
          const dayOffset = startDayOffset + index;
          const slotDate = new Date(currentDate);
          slotDate.setDate(currentDate.getDate() + dayOffset);

          // This is never today (always false)
          const isToday = false;

          // Calculate the correct day of week
          const dayIndex = (currentDay + dayOffset) % 7;
          const dayOfWeek = dayNames[dayIndex].toUpperCase(); // Convert to uppercase to match request format

          // Format the expected delivery date in DD-MM-YYYY format
          const formattedDate = `${String(slotDate.getDate()).padStart(
            2,
            "0"
          )}-${String(slotDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-${slotDate.getFullYear()}`;

          // Get the time slots from the API response or use defaults
          const slotData = response.data[index] || {
            id: `day-${dayOffset}`,
            timeSlot1: "08:00 AM-12:00 PM",
            timeSlot2: "12:00 PM-04:00 PM",
            timeSlot3: "04:00 PM-08:00 PM",
            timeSlot4: "08:00 PM-10:00 PM",
            isAvailable: true,
          };

          // Process time slots - keep all 4 slots
          let availableTimeSlots = {
            timeSlot1: slotData.timeSlot1 || "",
            timeSlot2: slotData.timeSlot2 || "",
            timeSlot3: slotData.timeSlot3 || "",
            timeSlot4: slotData.timeSlot4 || "",
          };

          // Create the formatted slot object with date display
          return {
            ...slotData,
            dayOfWeek: dayOfWeek,
            expectedDeliveryDate: formattedDate,
            timeSlot1: availableTimeSlots.timeSlot1,
            timeSlot2: availableTimeSlots.timeSlot2,
            timeSlot3: availableTimeSlots.timeSlot3,
            timeSlot4: availableTimeSlots.timeSlot4,
            date: formatDate(slotDate, isToday),
          };
        });

        setTimeSlots(formattedTimeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to fetch delivery time slots");
    }
  };

  // Then add the type annotations to your function parameters
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
      // Prepare the request body based on dynamic user input
      const requestBody = {
        dayOfWeek: selectedSlot.dayOfWeek,
        expectedDeliveryDate: selectedSlot.expectedDeliveryDate,
        timeSlot: selectedTimeSlot, // This should be the selected time slot like "08:00 AM - 12:00 PM"
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

  // Handle time slot selection
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
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = () => {
    const newValue = !useWallet;
    console.log({ newValue });
    setUseWallet(newValue);
    getWalletAmount();

    if (newValue) {
      Modal.info({
        title: "Wallet Amount Used",
        content: `You are using ₹${walletAmount} from your wallet.`,
        onOk() {
          console.log("OK clicked");
          grandTotalfunc();
        },
      });
    } else {
      // Show alert when the checkbox is unchecked
      Modal.info({
        title: "Wallet Amount Deselected",
        content: `You have removed the usage of ${walletAmount} from your wallet.`,
        onOk() {
          console.log("OK clicked");
        },
      });
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = parseInt(item.cartQuantity);
            return acc;
          },
          {}
        );
        // Fix: Use cartItemsMap and correct syntax
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
    console.log("total cart");

    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/cartItemData`,
        {
          customerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGrandTotalAmount(parseFloat(response.data.totalSumWithGstSum));
      setSubGst(response.data.totalGstSum);
      const totalDeliveryFee = response.data?.cartResponseList.reduce(
        (sum: number, item: CartData) => sum + item.deliveryBoyFee,
        0
      );
      console.log({ totalDeliveryFee });
      setDeliveryBoyFee(totalDeliveryFee);
      setTotalAmount(parseFloat(response.data.totalSumWithGstSum));
      setGrandTotal(parseFloat(response.data.totalSum));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
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

      console.log("API Response:", response.data);
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);

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
      setIsSubmitting(false); // Ensure the state is reset even in case of errors
    }
  };

  const showSampleModal = () => {
    Modal.confirm({
      title: "Special Offer!",
      content: (
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">
            Free Rice Container with Your Order!
          </p>
          <p className="mt-2">
            Buy 9 bags of 26 kg’s / 10 kg’s in 3 years or refer 9 friends and
            when they buy their first bag the container is yours forever.
          </p>
          <p className="mt-2 text-sm text-black-600">
            <b>
              * No purchase in 45 days or gap of 45 days between purchases =
              Container will be taken back
            </b>
          </p>
        </div>
      ),
      okText: isSubmitting ? "Submitting..." : "I’m Interested",
      cancelText: "Not Interested",
      okButtonProps: {
        disabled: isSubmitting,
      },
      onOk: async () => {
        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true); // Enable loading state

        try {
          await handleInterested(); // Calls "I'm Interested" logic
        } finally {
          setIsSubmitting(false); // Reset loading state
        }
      },
      onCancel: () => navigate("/main/myorders"), // Direct redirection
    });
  };

  // function for applying coupon
  const handleApplyCoupon = () => {
    const data = {
      couponCode: couponCode,
      customerId: customerId,
      subTotal: grandTotalAmount,
    };
    console.log("data ", data);
    setCoupenLoading(true);

    const response = axios
      .post(BASE_URL + "/order-service/applycoupontocustomer", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("coupen applied", response.data);
        const { discount, grandTotal } = response.data;
        message.info(response.data.message);
        setCoupenDetails(discount);
        setCoupenApplied(response.data.couponApplied);
        console.log("coupenapplied state", response.data.couponApplied);
        setCoupenLoading(false);
        // Recalculate totals after applying coupon
        grandTotalfunc();
      })
      .catch((error) => {
        console.error("Error in applying coupon:", error);
        message.error("Failed to apply coupon");
        setCoupenLoading(false);
      });
  };

  // for removing coupen code
  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);
    console.log("coupen removed");
    message.info("coupen removed successfully");
    // Recalculate totals after removing coupon
    grandTotalfunc();
  };

  // for getting wallet details
  const getWalletAmount = () => {
    const data = {
      customerId: customerId,
    };
    const response = axios
      .post(BASE_URL + "/order-service/applyWalletAmountToCustomer", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("wallet amount", response.data);
        setWalletAmount(response.data.usableWalletAmountForOrder);
        // setWalletAmount(500);
        //  message.info(response.data.message);
        setWalletMessage(response.data.message);
        setWalletTotal(
          response.data.totalSum - response.data.usableWalletAmountForOrder
        );
      })
      .catch((error) => {
        console.error(
          "Error in getting wallet amount:",
          error.response?.data || error.message
        );
        message.error("Failed to get wallet amount");
      });
  };

  const handlePayment = async () => {
    try {
      // Check for stock issues
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

      // Check if delivery time slot is selected
      if (!selectedTimeSlot) {
        Modal.error({ title: "Error", content: "Please select a time slot." });
        return;
      }

      if (grandTotalAmount === 0) {
        setSelectedPayment("COD");
      }

      setLoading(true); // Prevent multiple clicks

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
          // deliveryDate: selectedDate,
          // deliveryTimeSlot: selectedTimeSlot
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);

      if (response.status === 200 && response.data) {
        await fetchCartData(); // Ensure cart updates

        if (selectedPayment === "COD" && !response.data.paymentId) {
          // if (response.data) {
          //   // showSampleModal(); // Ensure modal appears before any navigation logic
          //   return;
          // }
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
            // amount: grandTotalAmount,
            amount: 1,
            merchantTransactionId: response.data.paymentId,
            transactionDate: new Date(),
            terminalId: "getepay.merchant128638@icici",
            udf1: withoutCountryCode,
            udf2: `${profileData.firstName} ${profileData.lastName}`,
            udf3: profileData.email,
            ru: `https://sandbox.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
            callbackUrl: `https://sandbox.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
            currency: "INR",
            paymentMode: "ALL",
            txnType: "single",
            productType: "IPG",
            txnNote: "Rice Order In Live",
            vpa: "getepay.merchant128638@icici",
          };

          console.log({ paymentData });
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
    console.log("getepayPortal", data);
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
        console.log("===getepayPortal responseurl======", responseurl);
        var data = decryptEas(responseurl);
        console.log("===getepayPortal data======");
        console.log(data);
        data = JSON.parse(data);
        localStorage.setItem("paymentId", data.paymentId);
        localStorage.setItem("merchantTransactionId", mer);
        const paymentUrl = data.paymentUrl; // Assuming API returns a payment link

        Modal.confirm({
          title: "Proceed to Payment?",
          content: "Click on Yes to continue to the payment gateway.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            window.location.href = paymentUrl; // Open link in new tab
          },
        });
      })
      .catch((error) => console.log("getepayPortal", error.response));
    setLoading(false);
  };

  function Requery(paymentId: any) {
    setLoading(false);
    console.log("requery");
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null
    ) {
      console.log("Before.....", paymentId);

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
            console.log("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            console.log({ responseurl });
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            console.log("Payment Result", data);
            setPaymentStatus(data.paymentStatus);
            console.log(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILED"
            ) {
              // clearInterval(intervalId); 294182409
              if (data.paymentStatus === "FAILED") {
                const add = sessionStorage.getItem("address");

                if (add) {
                  setSelectedAddress(JSON.parse(add) as Address); // Ensure it's parsed as Address
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
                  console.log(
                    "Order Placed with Payment API:",
                    secondResponse.data
                  );
                  localStorage.removeItem("paymentId");
                  localStorage.removeItem("merchantTransactionId");
                  fetchCartData();
                  if (secondResponse.data.status === null) {
                    // if (secondResponse.data.status) {
                    //   showSampleModal(); // Ensure modal appears before any navigation logic
                    //   return;
                    // }
                    Modal.success({
                      content: "Order placed Successfully",
                      onOk: () => {
                        navigate("/main/myorders");
                        fetchCartData();
                      },
                    });
                  } else {
                    // if (secondResponse.data.status) {
                    //   showSampleModal(); // Ensure modal appears before any navigation logic
                    //   return;
                    // }
                    Modal.success({
                      content: secondResponse.data.status,
                      onOk: () => {
                        navigate("/main/myorders");
                        fetchCartData();
                      },
                    });
                  }
                  // setLoading(false);
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
            } else {
            }
          }
        })
        .catch((error) => console.log("Payment Status", error));
    }
  }

  // Improved calculation of total amount with proper handling of GST, coupon, and wallet
  function grandTotalfunc() {
    // Start with base amount (before GST)
    let baseAmount = grandTotal;

    // Add GST
    let totalWithGst = baseAmount + subGst;

    // Add delivery fee
    let totalWithDelivery = totalWithGst + deliveryBoyFee;

    // Apply coupon discount (if applicable)
    let afterCoupon = totalWithDelivery;
    if (coupenApplied && coupenDetails) {
      afterCoupon = Math.max(0, totalWithDelivery - coupenDetails);
    }

    // Apply wallet (if applicable)
    let usedWallet = 0;
    let finalTotal = afterCoupon;

    if (useWallet && walletAmount > 0) {
      if (walletAmount >= afterCoupon) {
        usedWallet = afterCoupon;
        finalTotal = 0;
      } else {
        usedWallet = walletAmount;
        finalTotal = afterCoupon - walletAmount;
      }
    }

    // Update state variables
    setUsedWalletAmount(usedWallet);
    setAfterWallet(walletAmount - usedWallet);
    setGrandTotalAmount(finalTotal);

    // If total is zero, automatically set payment method to COD
    if (finalTotal === 0) {
      setSelectedPayment("COD");
    }

    console.log("Calculation Summary:");
    console.log("Base Amount:", baseAmount);
    console.log("GST:", subGst);
    console.log("With Delivery:", totalWithDelivery);
    console.log("After Coupon:", afterCoupon);
    console.log("Used Wallet:", usedWallet);
    console.log("Final Total:", finalTotal);
  }

  useEffect(() => {
    grandTotalfunc();
  }, [
    coupenApplied,
    useWallet,
    totalAmount,
    deliveryBoyFee,
    coupenDetails,
    walletAmount,
  ]);

  const renderTimeSlotModal = () => {
    // For debugging - check what the data contains
    // console.log("Time slots before rendering:", timeSlots);
    return (
      <Modal
        title="Select Delivery Time Slot"
        open={showTimeSlotModal}
        onCancel={() => setShowTimeSlotModal(false)}
        footer={null}
        centered
        width={500}
        closeIcon={<X className="w-5 h-5" />}
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Remove the filter for today completely, since fetchTimeSlots already handles this */}
          {timeSlots.slice(0, 3).map((slot, index) => (
            <div key={slot.id || index} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-medium">
                  {slot.dayOfWeek || `Day ${index + 1}`}
                </div>
                <div className="text-right text-gray-700">{slot.date}</div>
              </div>

              {/* Time slots grid - display all 4 slots in a responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Time Slot 1 */}
                {slot.timeSlot1 && (
                  <div
                    className={`py-3 px-4 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition ${
                      selectedTimeSlot === slot.timeSlot1 &&
                      selectedDate === slot.date
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleSelectTimeSlot(
                        slot.date || "",
                        slot.timeSlot1 || "",
                        slot.dayOfWeek || ""
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{slot.timeSlot1}</span>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                )}

                {/* Time Slot 2 */}
                {slot.timeSlot2 && (
                  <div
                    className={`py-3 px-4 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition ${
                      selectedTimeSlot === slot.timeSlot2 &&
                      selectedDate === slot.date
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleSelectTimeSlot(
                        slot.date || "",
                        slot.timeSlot2 || "",
                        slot.dayOfWeek || ""
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{slot.timeSlot2}</span>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                )}

                {/* Time Slot 3 */}
                {slot.timeSlot3 && (
                  <div
                    className={`py-3 px-4 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition ${
                      selectedTimeSlot === slot.timeSlot3 &&
                      selectedDate === slot.date
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleSelectTimeSlot(
                        slot.date || "",
                        slot.timeSlot3 || "",
                        slot.dayOfWeek || ""
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{slot.timeSlot3}</span>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                )}

                {/* Time Slot 4 */}
                {slot.timeSlot4 && (
                  <div
                    className={`py-3 px-4 border rounded-md cursor-pointer hover:bg-green-50 hover:border-green-500 transition ${
                      selectedTimeSlot === slot.timeSlot4 &&
                      selectedDate === slot.date
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleSelectTimeSlot(
                        slot.date || "",
                        slot.timeSlot4 || "",
                        slot.dayOfWeek || ""
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{slot.timeSlot4}</span>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                )}

                {/* No available slots message */}
                {!slot.timeSlot1 &&
                  !slot.timeSlot2 &&
                  !slot.timeSlot3 &&
                  !slot.timeSlot4 && (
                    <div className="py-3 px-4 border rounded-md border-gray-200 bg-gray-50 text-gray-500 col-span-full">
                      No available time slots for this day
                    </div>
                  )}
              </div>

              {index < 2 && (
                <div className="border-b border-gray-100 mt-4"></div>
              )}
            </div>
          ))}
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
                  {/* Delivery Time Slot Selection */}
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

                  {/* Cart Items */}
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

                  {/* Payment Method */}
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
                  {/* Order Summary */}
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

                    {/* Coupon Code */}
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
                          <button
                            onClick={deleteCoupen}
                            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md sm:rounded-l-none hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || coupenLoading}
                            className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-md sm:rounded-l-none hover:bg-purple-600 disabled:bg-purple-300 transition-colors"
                          >
                            {coupenLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                              "Apply"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Wallet */}
                    {walletAmount > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="useWallet"
                            checked={useWallet}
                            onChange={handleCheckboxToggle}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <label
                            htmlFor="useWallet"
                            className="ml-2 text-sm font-medium"
                          >
                            Use wallet balance (₹{walletAmount.toFixed(2)})
                          </label>
                        </div>

                        {useWallet && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Amount used: ₹{usedWalletAmount.toFixed(2)}</p>
                            <p>Remaining: ₹{afterWallet.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Place Order Button */}
                    <button
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
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
      {renderTimeSlotModal()}
    </div>
  );
};

export default CheckoutPage;
