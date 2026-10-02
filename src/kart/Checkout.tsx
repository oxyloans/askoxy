import React, { useEffect, useState, useContext } from "react";
import { customerApi } from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, message, Modal, notification } from "antd";
import { load, Cashfree } from "@cashfreepayments/cashfree-js";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Tag,
  ShoppingBag,
  Clock,
  Loader2,
  CheckCircle2,
  Sun,
  Moon,
  Sunset,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import decryptEas from "./decryptEas";
import encryptEas from "./encryptEas";
import { CartContext } from "../until/CartContext";
import BASE_URL, { resolveAskoxyUrl } from "../Config";
import {
  calculateDeliveryFee,
  calculateDistanceDeliveryFee,
  checkEligibilityForActiveZones,
} from "./DeliveryFee";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  computeComboPricing,
  loadAgentComboDisplay,
  type ComboPricingResult,
} from "./agentComboDisplay";
import AgentComboPricingSummary from "./AgentComboPricingSummary";
import checkoutBannerImg from "../assets/img/checkout_summary_banner.jpg";

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
  quantity: number;
  status: string;
  image?: string;
  itemImage?: string;
  itemDescription?: string;
  catergoryName?: string;
  categoryName?: string;
  weight?: string | number;
  units?: string;
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

const emptyComboPricing = (): ComboPricingResult => ({
  active: false,
  display: null,
  catalogComboSubtotal: 0,
  bundlePrice: 0,
  savings: 0,
  nonComboSubtotal: 0,
  adjustedItemSubtotal: 0,
  incomplete: false,
});

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [comboPricing, setComboPricing] = useState<ComboPricingResult>(
    () =>
      (state as { agentComboPricing?: ComboPricingResult } | null)
        ?.agentComboPricing ?? emptyComboPricing(),
  );
  const [isEligibleToday, setIsEligibleToday] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [silverDiscount, setSilverDiscount] = useState<number>(0);
  const [silverGst, setSilverGst] = useState<number>(0);

  const isSilverItem = (item: CartItem) =>
    [
      item.catergoryName,
      item.categoryName,
      (item as any).categoryType,
      (item as any).category,
    ]
      .filter(Boolean)
      .some((category) => /SILVER/i.test(String(category))) ||
    /silver/i.test(item.itemName);

  useEffect(() => {
    let isMounted = true;
    const fetchSilverRates = async () => {
      const silverItems = cartData.filter(
        (item) => isSilverItem(item) && item.status !== "FREE",
      );

      if (silverItems.length === 0) {
        if (isMounted) {
          setSilverDiscount(0);
          setSilverGst(0);
        }
        return;
      }

      try {
        const ratePromises = silverItems.map(async (item) => {
          try {
            const res = await axios.get(
              `${BASE_URL}/product-service/getAllGoldAndSilverRates?itemId=${item.itemId}`,
            );
            const qty = Number(item.cartQuantity) || 1;
            const discount =
              (res.data?.discountAmount !== undefined
                ? res.data.discountAmount
                : (res.data?.gstAmount || 0)) * qty;
            const gst = (res.data?.gstAmount || 0) * qty;
            return { discount, gst };
          } catch (e) {
            console.error("Error fetching silver rates for item:", item.itemId, e);
            return { discount: 0, gst: 0 };
          }
        });

        const results = await Promise.all(ratePromises);
        if (isMounted) {
          const totalDiscount = results.reduce((sum, r) => sum + r.discount, 0);
          const totalGst = results.reduce((sum, r) => sum + r.gst, 0);
          setSilverDiscount(totalDiscount);
          setSilverGst(totalGst);
        }
      } catch (err) {
        console.error("Error calculating silver breakdown in checkout:", err);
        if (isMounted) {
          setSilverDiscount(0);
          setSilverGst(0);
        }
      }
    };

    fetchSilverRates();

    return () => {
      isMounted = false;
    };
  }, [cartData]);

  // Gold and Silver categories follow the distance-fee delivery flow.
  const isPreciousMetalOnlyCart = (items: CartItem[]): boolean =>
    items.length > 0 &&
    items.every(
      (item) =>
        [item.catergoryName, item.categoryName]
          .filter(Boolean)
          .some((category) => /GOLD|SILVER/i.test(category!)) ||
        /gold|silver/i.test(item.itemName)
    );
const getPreciousMetalCategory = (items: CartItem[]): string | null => {
  if (items.length === 0) return null;

  let hasGold = false;
  let hasSilver = false;

  items.forEach((item) => {
    const categories = [item.catergoryName, item.categoryName]
      .filter(Boolean)
      .join(" ");

    const itemName = item.itemName || "";

    if (/gold/i.test(categories) || /gold/i.test(itemName)) {
      hasGold = true;
    }

    if (/silver/i.test(categories) || /silver/i.test(itemName)) {
      hasSilver = true;
    }
  });
   console.log("hasGold:", hasGold, "hasSilver:", hasSilver);
  if (hasGold) return "GOLD";
  if (hasSilver) return "SILVER";

  return null;
};
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupenDetails, setCoupenDetails] = useState<number | null>(null);
  const [coupenLoading, setCoupenLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"ONLINE" | "COD">(
    "ONLINE",
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    state?.selectedAddress || null,
  );
  const [grandTotalAmount, setGrandTotalAmount] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(0);
  const [deliveryFeeMessage, setDeliveryFeeMessage] = useState("");
  const [isDeliveryFeeLoading, setIsDeliveryFeeLoading] = useState(false);
  const [isPreciousMetalDistanceFeeLoading, setIsPreciousMetalDistanceFeeLoading] = useState(false);
  const [handlingFee, setHandlingFee] = useState<number | null>(0);
  const [subGst, setSubGst] = useState(0);
  const [goldMakingCharges, setGoldMakingCharges] = useState<number>(0);
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
  // const [merchantTransactionId, setMerchantTransactionId] = useState<
  //   string | undefined
  // >();
  // const [showDeliveryTimelineModal, setShowDeliveryTimelineModal] =
  //   useState(false);
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
  const [exchangePolicyAccepted, setExchangePolicyAccepted] = useState(false);
  const customerId = localStorage.getItem("userId");
  const userData = localStorage.getItem("profileData");
  const [canPlaceOrder, setCanPlaceOrder] = useState(true);
  const [minOrderToPlace, setMinOrderToPlace] = useState(0);
  //states for small cart fee and service fee
  const [smallCartFee, setSmallCartFee] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
const [cashfree, setCashfree] = useState<Cashfree | null>(null);
const [orderCategory, setOrderCategory] = useState<string | boolean | null>(null);
const [cashfreeLoading, setCashfreeLoading] = useState<boolean>(false);

useEffect(() => {
  const initializeCashfree = async () => {
    const instance = await load({
      mode: "production", // Change to "production" for live environment
    });

    setCashfree(instance);
  };

  initializeCashfree();
}, []);


  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }
  const { count, setCount } = context;

  const isFreeItem = (item: CartItem) => item.status === "FREE";

  const applyComboPricingToTotals = (
    catalogSubtotal: number,
    cartItems: CartItem[],
  ) => {
    const fromNav = (state as { agentComboPricing?: ComboPricingResult } | null)
      ?.agentComboPricing;
    const display = fromNav?.display ?? loadAgentComboDisplay();
    const pricing = computeComboPricing(
      display,
      cartItems.map((item) => ({
        itemId: item.itemId,
        itemPrice: item.itemPrice,
        cartQuantity: item.cartQuantity
          ? parseInt(String(item.cartQuantity), 10)
          : 1,
        status: item.status,
      })),
    );
    setComboPricing(pricing);
    const subtotal = pricing.active
      ? pricing.adjustedItemSubtotal
      : catalogSubtotal;
    setTotalAmount(subtotal);
    setGrandTotal(subtotal);
    return subtotal;
  };

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
      const response = await customerApi.post(
        `${BASE_URL}/user-service/bmvCashBack`,
        requestBody
      );
      // Show how many coins were earned, if returned by backend
      if (response.data?.bmvCoinsEarned) {
        message.success(`You earned ${response.data.bmvCoinsEarned} BMVCOINS!`);
      } else {
        message.success("BMVCOINS have been credited to your wallet!");
      }
    } catch (error) {
      console.error("Error applying BMV cashback:", error);
      message.error("Could not credit BMVCOINS.");
    }
  };

  useEffect(() => {
    fetchCartData();
    getWalletAmount();
    
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      (async () => {
        const isEligible = await checkEligibility();
        fetchTimeSlots(isEligible);
      })();
    } else {
      fetchTimeSlots(false);
    }
    fetchAvailableCoupons();
    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    const order = params.trans;
    const orderCategoryParam = params.orderCategory;
    setOrderId(order);
    if (userData) {
      setProfileData(JSON.parse(userData));
    }
    setOrderCategory(orderCategoryParam || getPreciousMetalCategory(cartData));
  }, []);

  useEffect(() => {
    const trans = localStorage.getItem("merchantTransactionId");
    const paymentId = localStorage.getItem("paymentId");
    if (orderCategory === "GOLD" || orderCategory === "SILVER") {
      // console.log("Precious metal order detected. Skipping Cashfree verification.", getPreciousMetalCategory(cartData));
        cashfreePaymentVerification(orderId || "");
      }else if (trans === orderId && paymentId) {
            Requery(paymentId);
            }
  }, [orderId]);

  useEffect(() => {
    if (selectedTimeSlot && !isDeliveryTimelineModalVisible) {
      setIsDeliveryTimelineModalVisible(true);
    }
  }, [selectedTimeSlot]);

  const cashfreePaymentVerification = async (orderId: string) => {
    try { 
      setCashfreeLoading(true);
    await customerApi
            .post(
              `${BASE_URL}/order-service/verify-cashfree-payment/${orderId}`,{}
            )
            .then((secondResponse:any) => {
              if (secondResponse.data.paymentStatus === "SUCCESS") {
                console.log("Payment successful",secondResponse.data);
                customerApi.get(
                  `${BASE_URL}/order-service/api/download/invoice?paymentId=${localStorage.getItem(
                    "merchantTransactionId",
                  )}&userId=${customerId}`
                )
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error("Error in payment confirmation:", error);
                  });
                applyBmvCashBack();
                // localStorage.removeItem("paymentId");
                localStorage.removeItem("merchantTransactionId");
                fetchCartData();
                if (secondResponse.data.paymentStatus === "SUCCESS") {
                  Modal.success({
                    title: "Success",
                    content: "Order placed successfully.",
                    onOk: () => {
                      navigate("/main/myorders");
                      fetchCartData();
                      setCashfreeLoading(false);
                    },
                  });
                } 
              }else {
                  Modal.error({
                    title: "Payment Failed",
                    content: `Payment status: ${secondResponse.data.paymentStatus || "FAILED"}`,
                    onOk: () => {
                      setCashfreeLoading(false);
                    },
                  });
                }
            })
            .catch((error) => {
              console.error("Error in payment confirmation:", error);
              setCashfreeLoading(false);
            });
    }
  catch (error) {
      console.error("Error verifying payment:", error);
      setCashfreeLoading(false);
    }
  }

  // Place this after your interfaces
  const isRiceOnlyCart = (cartData: CartItem[] = []) => {
    return (
      cartData.length > 0 &&
      cartData.every((item) => item.itemName?.toLowerCase().includes("rice"))
    );
  };

  const handleSelectTimeSlot = (
    date: string,
    timeSlot: string,
    day: string,
  ): void => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSelectedDay(day);
    setShowTimeSlotModal(false);
    message.success(`Delivery time slot selected: ${date}, ${timeSlot}`);
    setIsDeliveryTimelineModalVisible(true);
  };
  const checkEligibility = async () => {
    try {
      const result = await checkEligibilityForActiveZones(
        selectedAddress?.latitude || 0,
        selectedAddress?.longitude || 0,
      );
      if (result.eligible) {
        setIsEligibleToday(true);
        setIsModalVisible(true);
        console.log("user today delivery status " + result.eligible);
      }
      return result.eligible;
    } catch (error) {
      console.error("Eligibility check failed:", error);
      return false;
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);

    if (isEligibleToday) {
      const todayDate = new Date();
      const formattedToday = `${String(todayDate.getDate()).padStart(
        2,
        "0",
      )}-${String(todayDate.getMonth() + 1).padStart(
        2,
        "0",
      )}-${todayDate.getFullYear()}`;

      // Find today's slot from already fetched timeSlots
      const todaySlot = timeSlots.find((slot) => slot.date === formattedToday);

      if (todaySlot) {
        // Try to auto-select the first available time slot based on status (false = available)
        let availableTimeSlot = null;
        if (todaySlot.slot1Status === false && todaySlot.timeSlot1) {
          availableTimeSlot = todaySlot.timeSlot1;
        } else if (todaySlot.slot2Status === false && todaySlot.timeSlot2) {
          availableTimeSlot = todaySlot.timeSlot2;
        } else if (todaySlot.slot3Status === false && todaySlot.timeSlot3) {
          availableTimeSlot = todaySlot.timeSlot3;
        } else if (todaySlot.slot4Status === false && todaySlot.timeSlot4) {
          availableTimeSlot = todaySlot.timeSlot4;
        }

        if (availableTimeSlot) {
          handleSelectTimeSlot(
            todaySlot.date,
            availableTimeSlot,
            todaySlot.dayOfWeek,
          );
        }
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    openTimeSlotModal();
  };

  // ✅ DELIVERY TIMELINE MODAL (updated)
  const renderDeliveryTimelineModal = () => {
    return (
      <Modal
        open={isDeliveryTimelineModalVisible}
        onCancel={() => setIsDeliveryTimelineModalVisible(false)}
        footer={null}
        centered
        destroyOnClose
        maskClosable
        width="90%"
        style={{ maxWidth: 600 }}
        bodyStyle={{
          maxHeight: "75vh",
          overflowY: "auto",
          padding: 24,
          background: "#fafafa",
        }}
        title={
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-purple-700 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-purple-500" />
              Delivery Information
            </div>
          </div>
        }
      >
        <div className="text-center">
          <div className="mb-5 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1554/1554574.png"
              alt="delivery"
              className="w-20 h-20 opacity-90"
            />
          </div>

          <div className="flex justify-center mb-4">
            <Button
              type={language === "english" ? "primary" : "default"}
              onClick={() => setLanguage("english")}
              className="rounded-l-md"
            >
              English
            </Button>
            <Button
              type={language === "telugu" ? "primary" : "default"}
              onClick={() => setLanguage("telugu")}
              className="rounded-r-md"
            >
              తెలుగు
            </Button>
          </div>

          <div className="text-left bg-white shadow-sm border border-gray-100 p-5 rounded-lg">
            {language === "english" ? (
              <>
                <p className="mb-3 leading-relaxed">
                  📦 <strong>Delivery Timeline:</strong> Your order will be
                  delivered within <b>4 hours to 4 days</b> depending on order
                  volume and location. We optimize routes to ensure faster,
                  eco-friendly deliveries. 🚚
                </p>
                <p className="mb-3">
                  We appreciate your patience and continued support. 🙏
                </p>
                <p>
                  Spread the word! More nearby orders = faster and more
                  efficient service for everyone. 💜
                </p>
              </>
            ) : (
              <>
                <p className="mb-3">
                  📦 <strong>డెలివరీ సమయం:</strong> మీ ఆర్డర్ 4 గంటల నుండి 4
                  రోజుల్లోపు డెలివరీ అవుతుంది. మీ ప్రాంతంలోని ఆర్డర్ల ఆధారంగా
                  సమర్థవంతంగా డెలివరీ జరుగుతుంది. 🚚
                </p>
                <p className="mb-3">
                  మీ సహకారం మాకు చాలా ముఖ్యమైనది. మీరు మమ్మల్ని షేర్ చేస్తే,
                  మేము మరింత మందికి త్వరగా సేవలందించగలుగుతాం. 🙏
                </p>
                <p>మా పై మీ విశ్వాసానికి ధన్యవాదాలు! 💜</p>
              </>
            )}
          </div>

          <Button
            onClick={() => setIsDeliveryTimelineModalVisible(false)}
            type="primary"
            size="large"
            className="mt-5 bg-purple-600 hover:bg-purple-700"
          >
            {language === "english" ? "Close" : "మూసివేయి"}
          </Button>
        </div>
      </Modal>
    );
  };

  const getAvailableDays = (
    maxDays: number = 14,
    includeToday: boolean,
  ): DayInfo[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startDate = includeToday ? today : tomorrow;
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
        date: `${String(date.getDate()).padStart(2, "0")}-${months[date.getMonth()]
          }-${date.getFullYear()}`,
        formattedDay: daysOfWeek[date.getDay()],
      });
    }

    return nextDays;
  };

  const fetchTimeSlots = async (isEligible: boolean): Promise<void> => {
    try {
      setLoading(true);

      const response = await customerApi.get(
        `${BASE_URL}/order-service/fetchTimeSlotlist`
      );

      if (response.data && Array.isArray(response.data)) {
        console.log("isEligibleToday", isEligible);

        const nextDays = getAvailableDays(14, isEligible);

        interface ApiTimeSlot {
          id: string;
          dayOfWeek: string;
          timeSlot1: string | null;
          timeSlot2: string | null;
          timeSlot3: string | null;
          timeSlot4: string | null;
          isAvailable: boolean;
          slot1Status?: boolean;
          slot2Status?: boolean;
          slot3Status?: boolean;
          slot4Status?: boolean;
        }

        const formattedTimeSlots: ExtendedTimeSlot[] = [];
        for (const dayInfo of nextDays) {
          const matchingSlot = response.data.find(
            (slot: ApiTimeSlot) =>
              slot.dayOfWeek === dayInfo.dayOfWeek &&
              slot.isAvailable === false, // false means available for delivery
          );

          if (matchingSlot) {
            // Get available time slots based on status flags (false = available)
            const availableSlots = [];
            if (matchingSlot.slot1Status === false && matchingSlot.timeSlot1) {
              availableSlots.push(matchingSlot.timeSlot1);
            }
            if (matchingSlot.slot2Status === false && matchingSlot.timeSlot2) {
              availableSlots.push(matchingSlot.timeSlot2);
            }
            if (matchingSlot.slot3Status === false && matchingSlot.timeSlot3) {
              availableSlots.push(matchingSlot.timeSlot3);
            }
            if (matchingSlot.slot4Status === false && matchingSlot.timeSlot4) {
              availableSlots.push(matchingSlot.timeSlot4);
            }

            // Only add if there are available slots
            if (availableSlots.length > 0) {
              formattedTimeSlots.push({
                id: matchingSlot.id,
                dayOfWeek: dayInfo.dayOfWeek,
                expectedDeliveryDate: dayInfo.date,
                timeSlot1: matchingSlot.slot1Status === false ? matchingSlot.timeSlot1 : null,
                timeSlot2: matchingSlot.slot2Status === false ? matchingSlot.timeSlot2 : null,
                timeSlot3: matchingSlot.slot3Status === false ? matchingSlot.timeSlot3 : null,
                timeSlot4: matchingSlot.slot4Status === false ? matchingSlot.timeSlot4 : null,
                isAvailable: false, // Keep original value
                isToday: false,
                date: dayInfo.date,
                formattedDay: dayInfo.formattedDay,
                slot1Status: matchingSlot.slot1Status,
                slot2Status: matchingSlot.slot2Status,
                slot3Status: matchingSlot.slot3Status,
                slot4Status: matchingSlot.slot4Status,
              });
            }
          }

          const limit = isEligible ? 4 : 3;
          console.log("limit" + limit);

          if (formattedTimeSlots.length >= limit) {
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
      const response = await customerApi.get(
        `${BASE_URL}/order-service/getAllCoupons`
      );

      if (response.data && Array.isArray(response.data)) {
        const filteredCoupons = response.data
          .filter(
            (coupon: any) =>
              coupon.isActive === true &&
              coupon.status === "PUBLIC" &&
              typeof coupon.couponValue === "number" &&
              coupon.couponValue >= 0,
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
    token: string,
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
        deliveryBoyFee: cartData.length > 0 ? (deliveryFee ?? 0) : 0,
        smallCartFee: cartData.length > 0 ? smallCartFee : 0,
        serviceFee: cartData.length > 0 ? serviceFee : 0,
        amount: grandTotalAmount,
        subTotal: grandTotal,
        gstAmount: subGst,
      };

      const response = await customerApi.post(
        `${BASE_URL}/order-service/placeOrder`,
        requestBody
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
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`
      );

      if (response.data.customerCartResponseList) {
        const cartItems = response.data.customerCartResponseList;
        setCartData(cartItems || []);

        const totalQuantity = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + (item.cartQuantity ? parseInt(item.cartQuantity) : 0),
          0,
        );
        setCount(totalQuantity);

        const amountToPay = cartItems
          .filter((item: CartItem) => ["ADD", "COMBO"].includes(item.status))
          .reduce(
            (sum: number, item: CartItem) =>
              sum + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
            0,
          );

        const gstAmount = parseFloat(response.data.totalGstAmountToPay || "0");

        let goldMakingCharges = 0;

        response.data.customerCartResponseList?.forEach((item: any) => {
          const making = parseFloat(item.goldMakingCost || 0);
          if (making > 0) {
            goldMakingCharges += making;
          }
        });

        // const actualGstWithoutMaking = gstAmount - goldMakingCharges;

        let deliveryFee: number | null = 0;
        let handlingFee = 0;
        if (
          isPreciousMetalOnlyCart(cartItems) &&
          selectedAddress?.latitude !== undefined &&
          selectedAddress?.longitude !== undefined
        ) {
          setIsPreciousMetalDistanceFeeLoading(true);
          let result;
          try {
            result = await calculateDistanceDeliveryFee(
              selectedAddress.latitude,
              selectedAddress.longitude,
            );
          } finally {
            setIsPreciousMetalDistanceFeeLoading(false);
          }
          deliveryFee = result.fee;
          handlingFee = 0;
          setCanPlaceOrder(true);
          setDeliveryFeeMessage(
            result.fee == null
              ? result.errorMessage || result.message || "Delivery fee will be calculated and collected at the time of delivery."
              : ""
          );
        } else if (
          cartItems.length > 0 &&
          selectedAddress?.latitude !== undefined &&
          selectedAddress?.longitude !== undefined
        ) {
          setIsDeliveryFeeLoading(true);
          const {
            fee,
            handlingFee: calculatedHandlingFee,
            walletApplicable: walletFlag,
            minOrderForWallet: minWallet,
            minOrderAmount: minOrderamnt,
            canPlaceOrder: canPlace,
            minOrderToPlace,
          } = await calculateDeliveryFee(
            selectedAddress.latitude,
            selectedAddress.longitude,
            amountToPay,
          );
          setIsDeliveryFeeLoading(false);
          setWalletApplicable(!!walletFlag);
          setCanPlaceOrder(canPlace);
          setMinOrderToPlace(minOrderToPlace ?? minOrderamnt);
          setMinOrderAmount(minOrderamnt);
          deliveryFee = fee ?? 0;
          handlingFee = calculatedHandlingFee;
          setDeliveryFeeMessage("");
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
            minOrderamnt,
          );
        } else if (cartItems.length > 0) {
          console.error("Latitude or Longitude is undefined");
        }

        setSubGst(gstAmount);
        setGoldMakingCharges(goldMakingCharges);
        const subtotalForFees = applyComboPricingToTotals(amountToPay, cartItems);
        setDeliveryFee(deliveryFee);
        setHandlingFee(handlingFee);

        const totalWithGst = subtotalForFees + gstAmount;
        const totalWithFees =
          totalWithGst +
          (cartItems.length > 0
            ? (deliveryFee ?? 0) + handlingFee + smallCartFee + serviceFee
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
        setComboPricing(emptyComboPricing());
      }
      console.log("cart excuted");
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
  };

  // const fetchInitialData = async () => {
  //   try {
  //     setPricesLoading(true);

  //     const cartResponse = await customerApi.get(
  //       `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`
  //     );

  //     if (cartResponse.data.customerCartResponseList) {
  //       const cartItems = cartResponse.data.customerCartResponseList;
  //       setCartData(cartItems || []);

  //       const totalQuantity = cartItems.reduce(
  //         (sum: number, item: CartItem) =>
  //           sum + (item.cartQuantity ? parseInt(item.cartQuantity) : 0),
  //         0,
  //       );
  //       setCount(totalQuantity);

  //       const amountToPay = cartItems
  //         .filter((item: CartItem) => item.status === "ADD")
  //         .reduce(
  //           (sum: number, item: CartItem) =>
  //             sum + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
  //           0,
  //         );

  //       const gstAmount = parseFloat(
  //         cartResponse.data.totalGstAmountToPay || "0",
  //       );

  //       let deliveryFee: number | null = 0;
  //       let handlingFee = 0;
  //       if (
  //         isPreciousMetalOnlyCart(cartItems) &&
  //         selectedAddress?.latitude !== undefined &&
  //         selectedAddress?.longitude !== undefined
  //       ) {
  //         setIsPreciousMetalDistanceFeeLoading(true);
  //         let result;
  //         try {
  //           result = await calculateDistanceDeliveryFee(
  //             selectedAddress.latitude,
  //             selectedAddress.longitude,
  //           );
  //         } finally {
  //           setIsPreciousMetalDistanceFeeLoading(false);
  //         }
  //         deliveryFee = result.fee;
  //         handlingFee = 0;
  //         setCanPlaceOrder(true);
  //         setDeliveryFeeMessage(
  //           result.fee == null
  //             ? result.errorMessage || result.message || "Delivery fee will be calculated and collected at the time of delivery."
  //             : ""
  //         );
  //       } else if (
  //         cartItems.length > 0 &&
  //         selectedAddress?.latitude !== undefined &&
  //         selectedAddress?.longitude !== undefined
  //       ) {
  //         console.log(
  //           "Calculating delivery fee for coordinates:",
  //           selectedAddress.latitude,
  //           selectedAddress.longitude,
  //           totalAmount,
  //         );
  //         setIsDeliveryFeeLoading(true);
  //         const { fee, handlingFee: calculatedHandlingFee } =
  //           await calculateDeliveryFee(
  //             selectedAddress.latitude,
  //             selectedAddress.longitude,
  //             amountToPay,
  //           );
  //         setIsDeliveryFeeLoading(false);
  //         deliveryFee = fee ?? 0;
  //         handlingFee = calculatedHandlingFee;
  //         setDeliveryFeeMessage("");
  //       } else if (cartItems.length > 0) {
  //         console.error("Latitude or Longitude is undefined");
  //       }

  //       setSubGst(gstAmount);
  //       const subtotalForFees = applyComboPricingToTotals(amountToPay, cartItems);
  //       setDeliveryFee(deliveryFee);
  //       setHandlingFee(handlingFee);

  //       const totalWithGst = subtotalForFees + gstAmount;
  //       const totalWithFees =
  //         totalWithGst +
  //         (cartItems.length > 0
  //           ? (deliveryFee ?? 0) + handlingFee + smallCartFee + serviceFee
  //           : 0);
  //       setGrandTotalAmount(totalWithFees);

  //       try {
  //         const walletResponse = await customerApi.post(
  //           `${BASE_URL}/order-service/applyWalletAmountToCustomer`,
  //           { customerId }
  //         );

  //         const usableAmount =
  //           walletResponse.data.usableWalletAmountForOrder || 0;
  //         setWalletAmount(usableAmount);
  //         setAfterWallet(usableAmount);
  //         setWalletMessage(walletResponse.data.message || "");
  //       } catch (walletError) {
  //         console.error("Error fetching wallet amount:", walletError);
  //       }

  //       fetchTimeSlots(isEligibleToday);

  //       requestAnimationFrame(() => {
  //         setPricesLoading(false);
  //       });
  //     } else {
  //       setCartData([]);
  //       setCount(0);
  //       setGrandTotal(0);
  //       setSubGst(0);
  //       setDeliveryFee(0);
  //       setHandlingFee(0);
  //       setTotalAmount(0);
  //       setGrandTotalAmount(0);
  //       setPricesLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching initial data:", error);
  //     message.error("Failed to load checkout data");
  //     setPricesLoading(false);
  //   }
  // };

  // const handlingFeeCalculation = (
  //   fee: number | null,
  //   handlingFee: number | null,
  // ) => {
  //   if (fee === null || handlingFee === null) {
  //     console.error("Invalid fee or handling fee received:", {
  //       fee,
  //       handlingFee,
  //     });
  //     message.error("Failed to calculate delivery fee.");
  //     return;
  //   }
  //   setDeliveryFee(fee);
  //   setHandlingFee(handlingFee);
  // };

  // const handleInterested = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     const userId = localStorage.getItem("userId");
  //     const mobileNumber = localStorage.getItem("whatsappNumber");
  //     const formData = {
  //       askOxyOfers: "FREESAMPLE",
  //       userId: userId,
  //       mobileNumber: mobileNumber,
  //       projectType: "ASKOXY",
  //     };

  //     const response = await customerApi.post(
  //       `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
  //       formData
  //     );
  //     localStorage.setItem("askOxyOfers", response.data.askData);

  //     Modal.success({
  //       title: "Thank You!",
  //       content: "Your interest has been successfully registered.",
  //       okText: "OK",
  //       onOk: () => navigate("/main/myorders"),
  //     });
  //   } catch (error) {
  //     const axiosError = error as any;
  //     if (
  //       axiosError.response?.status === 500 ||
  //       axiosError.response?.status === 400
  //     ) {
  //       message.warning("You have already participated. Thank you!");
  //     } else {
  //       console.error("API Error:", axiosError);
  //       message.error("Failed to submit your interest. Please try again.");
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleApplyCoupon = () => {
    // Validate coupon code - trim whitespace and check if empty
    const trimmedCouponCode = couponCode.trim();

    if (!trimmedCouponCode) {
      message.error("Please enter a valid coupon code");
      return;
    }

    // Check if coupon code contains only spaces
    if (trimmedCouponCode.length === 0) {
      message.error("Coupon code cannot be empty or contain only spaces");
      return;
    }

    // Additional validation for minimum length
    if (trimmedCouponCode.length < 3) {
      message.error("Please enter a valid coupon code (minimum 3 characters)");
      return;
    }

    const data = {
      couponCode: trimmedCouponCode.toUpperCase(), // Convert to uppercase for consistency
      customerId: customerId,
      subTotal: grandTotal,
    };
    setCoupenLoading(true);

    customerApi
      .post(`${BASE_URL}/order-service/applycoupontocustomer`, data)
      .then((response) => {
        const { discount, grandTotal } = response.data;
        message.info(response.data.message);
        setCoupenDetails(discount || 0);
        setCoupenApplied(response.data.couponApplied);
        setCoupenLoading(false);

        // Update the coupon code state with the trimmed and uppercase version
        setCouponCode(trimmedCouponCode.toUpperCase());
      })
      .catch((error) => {
        console.error("Error in applying coupon:", error);
        message.error("Failed to apply coupon. Please check the coupon code and try again.");
        setCoupenLoading(false);
      });
  };

  const handleSelectCoupon = async (coupon: Coupon) => {
    // Validate coupon code
    const trimmedCouponCode = coupon.couponCode.trim();

    if (!trimmedCouponCode) {
      message.error("Invalid coupon code");
      return;
    }

    setCouponCode(trimmedCouponCode.toUpperCase());
    setCoupenLoading(true);

    const data = {
      couponCode: trimmedCouponCode.toUpperCase(),
      customerId: customerId,
      subTotal: grandTotal,
    };

    try {
      const response = await customerApi.post(
        `${BASE_URL}/order-service/applycoupontocustomer`,
        data
      );

      const { discount, grandTotal } = response.data;
      message.success(`Coupon ${trimmedCouponCode.toUpperCase()} applied successfully`);
      setCoupenDetails(discount || 0);
      setCoupenApplied(response.data.couponApplied);
      setShowCouponsModal(false);
    } catch (error) {
      console.error("Error applying coupon:", error);
      message.error("Failed to apply coupon. Please try again.");
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
      const response = await customerApi.post(
        `${BASE_URL}/order-service/applyWalletAmountToCustomer`,
        { customerId }
      );

      const usableAmount = response.data.usableWalletAmountForOrder || 0;
      const isApplicable = (response.data.status ?? false) || usableAmount > 0;

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
    const effectiveDeliveryFee = cartData.length > 0 ? (deliveryFee ?? 0) : 0;
    const effectiveHandlingFee = cartData.length > 0 ? (handlingFee ?? 0) : 0;
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
    if (walletAmount === 0) {
      message.info("Wallet balance is ₹0.");
      return;
    }

    if (totalAmount < minOrderForWallet) {
      message.warning(
        `Wallet requires a minimum cart of ₹${minOrderForWallet}`,
      );
      return;
    }

    const newUseWallet = !useWallet;

    const baseAmount =
      totalAmount +
      (cartData.length > 0 ? (deliveryFee ?? 0) : 0) +
      (cartData.length > 0 ? (handlingFee ?? 0) : 0) +
      subGst -
      (coupenApplied && coupenDetails ? coupenDetails : 0);

    const walletToApply = Math.min(walletAmount, baseAmount);

    Modal.confirm({
      title: newUseWallet ? "Apply Wallet?" : "Remove Wallet?",
      content: newUseWallet
        ? `Use ₹${Number(walletToApply || 0).toFixed(2)} from your wallet?`
        : `Remove wallet usage of ₹${Number(usedWalletAmount || 0).toFixed(2)}?`,
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
    if (couponCode && !coupenApplied) {
      notification.warning({
        message: "Coupon Not Applied",
        description:
          "You entered a coupon code but didn't apply it. Please apply or remove the coupon code.",
        placement: "topRight",
      });

      return;
    }

    const isRiceCart = isRiceOnlyCart(cartData);
    if (isRiceCart && !exchangePolicyAccepted) {
      const Swal = require("sweetalert2");
      Swal.fire({
        icon: "warning",
        title: "Confirmation Required",
        text: "Please confirm that the exchange can be taken within 10 days after delivery.",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
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
          parseInt(item.cartQuantity) > item.quantity || item.quantity === 0,
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
        const Swal = require("sweetalert2");
        Swal.fire({
          icon: "warning",
          title: "Time Slot Required",
          text: "Please select a delivery time slot.",
          confirmButtonText: "OK",
          confirmButtonColor: "#f59e0b",
        });
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

      if (deliveryFee === null && !isPreciousMetalOnlyCart(cartData)) {
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
        grandTotalAmount,
      );
      const response = await customerApi.post(
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
          deliveryBoyFee: cartData.length > 0 ? (deliveryFee ?? 0) : 0,
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
          categoryName: getPreciousMetalCategory(cartData),
          returnUrl: `https://www.askoxy.ai/main/checkout?trans={paymentId}`
        }
      );

      if (response.status === 200 && response.data) {
        if (!response.data.paymentId && response.data.status) {
          setLoading(false);
          const Swal = require("sweetalert2");
          Swal.fire({
            icon: "warning",
            title: "Minimum Order Required",
            text: response.data.status,
            confirmButtonText: "Continue Shopping",
            confirmButtonColor: "#7C3AED",
            background: "#ffffff",
            color: "#333",
            width: 400,
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-lg font-semibold",
              confirmButton: "rounded-xl px-5 py-2",
            },
          }).then(() => {
            navigate("/main/mycart");
          });
          return;
        }

        await fetchCartData();

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "purchase", {
            transaction_id:
              response.data.paymentId ||
              `${selectedPayment}_${new Date().getTime()}`,
            value: grandTotalAmount,
            currency: "INR",
            tax: subGst,
            shipping: cartData.length > 0 ? (deliveryFee ?? 0) : 0,
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
          const Swal = require("sweetalert2");
          Swal.fire({
            icon: "success",
            title: "Order Placed Successfully!",
            text: "You'll pay on delivery.",
            confirmButtonText: "OK",
            confirmButtonColor: "#10b981",
          }).then(() => {
            navigate("/main/myorders");
            fetchCartData();
          });
        } else {
          if (response.data.paymentId && !response.data.paymentSessionId) {
            const number =
              localStorage.getItem("whatsappNumber") ||
              localStorage.getItem("mobileNumber");
            const withoutCountryCode = number?.replace("+91", "");
            sessionStorage.setItem("address", JSON.stringify(selectedAddress));

            const paymentData = {
              mid: process.env.REACT_APP_GETEPAY_MID || "1152305",
              amount: grandTotalAmount,
              merchantTransactionId: response.data.paymentId,
              transactionDate: new Date(),
              terminalId: process.env.REACT_APP_GETEPAY_TERMINAL_ID || "getepay.merchant128638@icici",
              udf1: withoutCountryCode || "",
              udf2: `${profileData.firstName || ""} ${profileData.lastName || ""}`,
              udf3: profileData.email || "",
              udf4: "",
              udf5: "",
              udf6: "",
              udf7: "",
              udf8: "",
              udf9: "",
              udf10: "",
              ru: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              callbackUrl: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
              currency: "INR",
              paymentMode: "ALL",
              txnType: "single",
              productType: "IPG",
              txnNote: "Rice Order In Live",
              vpa: process.env.REACT_APP_GETEPAY_VPA || "getepay.merchant128638@icici",
            };

            getepayPortal(paymentData);
          }else if (response.data.paymentId && response.data.paymentSessionId) {
              if (!cashfree) {
                message.error("Payment gateway is not ready. Please try again.");
                return;
              }

              let checkoutOptions: any = {
                    paymentSessionId: response.data.paymentSessionId,
                    returnUrl: `https://www.askoxy.ai/main/checkout?trans=${response.data.txnId}&orderCategory=${getPreciousMetalCategory(cartData)}`,
                    redirectTarget: "_self" // or "_blank", "_modal" for popup
                };
              localStorage.setItem("merchantTransactionId",response.data.paymentId)

              await  cashfree.checkout(checkoutOptions).then(function (result:any) {
                    if (result.error) {
                        console.error(result.error.message);
                    }
                    if (result.redirect) {
                        console.log("Redirection");
                    }
                });

              // await cashfree.checkout({
              //   paymentSessionId: response.data.paymentSessionId,
              //   redirectTarget: "_self",
              // });
          } else {
            message.error("Unable to process payment. Please try again.");
          }
        }
      } else {
        message.error("Unable to place order. Please try again.");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethods = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Online Payment */}
        <div
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
            selectedPayment === "ONLINE"
              ? "border-purple-600 bg-gradient-to-br from-purple-50/90 via-indigo-50/40 to-white ring-2 ring-purple-600/20 shadow-xs"
              : "border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/20 shadow-2xs"
          }`}
          onClick={() => setSelectedPayment("ONLINE")}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                selectedPayment === "ONLINE"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-gray-900">
                  Online Payment
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                  Fast & Secure
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                UPI, Cards, Net Banking
              </p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 border-2 transition-all shrink-0 ${
              selectedPayment === "ONLINE"
                ? "border-purple-600 bg-purple-600 text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {selectedPayment === "ONLINE" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Cash on Delivery */}
        <div
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
            selectedPayment === "COD"
              ? "border-purple-600 bg-gradient-to-br from-purple-50/90 via-amber-50/30 to-white ring-2 ring-purple-600/20 shadow-xs"
              : "border-gray-200 hover:border-purple-300 bg-white hover:bg-amber-50/20 shadow-2xs"
          }`}
          onClick={() => setSelectedPayment("COD")}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                selectedPayment === "COD"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-gray-900">
                  Cash on Delivery
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                  COD
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pay with cash at your doorstep
              </p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 border-2 transition-all shrink-0 ${
              selectedPayment === "COD"
                ? "border-purple-600 bg-purple-600 text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {selectedPayment === "COD" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const getepayPortal = async (data: any) => {
    const JsonData = JSON.stringify(data);
    const mer = data.merchantTransactionId;
    const ciphertext = encryptEas(JsonData);
    const newCipher = ciphertext.toUpperCase();

    try {
      const generateInvoiceUrl =
        process.env.REACT_APP_GETEPAY_GENERATE_INVOICE_URL || "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice";

      const response = await axios.post(
        generateInvoiceUrl,
        { mid: data.mid, terminalId: data.terminalId, req: newCipher },
        { headers: { "Content-Type": "application/json" } },
      );
      const resultobj = response.data;
      const responseurl = resultobj.response;
      const decryptedData = decryptEas(responseurl);
      const parsed = JSON.parse(decryptedData);
      localStorage.setItem("paymentId", parsed.paymentId);
      localStorage.setItem("merchantTransactionId", mer);
      window.location.href = parsed.paymentUrl;
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
        "Getepay Mid": process.env.REACT_APP_GETEPAY_MID || "1152305",
        "Getepay Terminal Id": process.env.REACT_APP_GETEPAY_TERMINAL_ID || "getepay.merchant128638@icici",
        "Getepay Key": process.env.REACT_APP_GETEPAY_KEY || "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": process.env.REACT_APP_GETEPAY_IV || "L8Q+DeKb+IL65ghKXP1spg==",
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
        Config["Getepay IV"],
      );
      const newCipher = ciphertext.toUpperCase();

      const invoiceStatusUrl =
        process.env.REACT_APP_GETEPAY_INVOICE_STATUS_URL || "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus";

      axios
        .post(
          invoiceStatusUrl,
          { mid: Config["Getepay Mid"], terminalId: Config["Getepay Terminal Id"], req: newCipher },
          { headers: { "Content-Type": "application/json" } },
        )
        .then((response) => {
          const resultobj = response.data;
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
                customerApi.get(
                  `${BASE_URL}/order-service/api/download/invoice?paymentId=${localStorage.getItem(
                    "merchantTransactionId",
                  )}&userId=${customerId}`
                )
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error("Error in payment confirmation:", error);
                  });
              }
            
              customerApi
                .post(
                  `${BASE_URL}/order-service/orderPlacedPaymet`,
                  {
                    paymentId: localStorage.getItem("merchantTransactionId"),
                    paymentStatus: parsedData.paymentStatus,
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
        open={showTimeSlotModal}
        onCancel={() => setShowTimeSlotModal(false)}
        centered
        destroyOnClose
        maskClosable
        width="90%"
        style={{ maxWidth: 660 }}
        bodyStyle={{
          maxHeight: "78vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #fbfaff 0%, #f7f5ff 100%)",
          padding: "20px 22px",
          borderRadius: 20,
        }}
        title={null}
        footer={[
          <div key="footer" className="flex items-center justify-between w-full pt-2">
            <Button
              key="info"
              type="default"
              icon={<Truck className="w-4 h-4 text-purple-600" />}
              onClick={() => {
                setShowTimeSlotModal(false);
                setTimeout(() => setIsDeliveryTimelineModalVisible(true), 200);
              }}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 font-medium rounded-xl text-xs flex items-center h-9 px-3.5"
            >
              Delivery Timeline Info
            </Button>
            <Button
              key="close"
              type="primary"
              onClick={() => setShowTimeSlotModal(false)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm h-9 px-6 shadow-md shadow-purple-500/25 border-none"
            >
              Done
            </Button>
          </div>
        ]}
        className="responsive-modal"
      >
        {/* Premium Gradient Header Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden mb-4">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-12 -top-6 w-20 h-20 bg-indigo-400/20 rounded-full blur-lg pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Choose Delivery Time
                </h3>
                <span className="text-[10px] sm:text-[11px] font-semibold bg-emerald-400/25 border border-emerald-300/40 text-emerald-100 px-2 py-0.5 rounded-full">
                  Express ⚡
                </span>
              </div>
              <p className="text-purple-100 text-xs sm:text-sm mt-0.5 font-normal">
                Select your preferred delivery date & convenient time slot
              </p>
            </div>
          </div>
        </div>

        {timeSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white/80 rounded-2xl border-2 border-dashed border-purple-200 my-2 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-base mb-1">
              No Delivery Slots Available Right Now
            </h4>
            <p className="text-gray-500 text-xs max-w-sm">
              Delivery slots are currently being scheduled for your location. Please check back later or proceed with standard delivery.
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-1">
            {timeSlots.map((slot: TimeSlot, index: number) => {
              const formattedDay =
                (slot as any).formattedDay || slot.dayOfWeek;
              const availableSlots = [
                slot.timeSlot1,
                slot.timeSlot2,
                slot.timeSlot3,
                slot.timeSlot4,
              ].filter(Boolean);

              const isDateSelected = selectedDate === slot.date;
              const hasSingleSlot = availableSlots.length === 1;

              // If day has only 1 slot: render sleek unified horizontal card without empty space
              if (hasSingleSlot) {
                const singleSlotTime = availableSlots[0]!;
                const isSelected =
                  selectedTimeSlot === singleSlotTime && selectedDate === slot.date;

                return (
                  <div
                    key={slot.id || index}
                    onClick={() =>
                      handleSelectTimeSlot(
                        slot.date,
                        singleSlotTime,
                        slot.dayOfWeek,
                      )
                    }
                    className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 shadow-md ring-2 ring-purple-400/20"
                        : "border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/30 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    {/* Day & Date Info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {formattedDay.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 capitalize">
                            {formattedDay}
                          </h4>
                          {index === 0 && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              Earliest
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-purple-700 font-medium">
                          {slot.date}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Slot Button */}
                    <div
                      className={`flex items-center justify-between sm:justify-end gap-3 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-600 text-white shadow-sm"
                          : "bg-purple-50/60 border-purple-200/80 text-purple-900 hover:bg-purple-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`w-4 h-4 ${
                            isSelected ? "text-white" : "text-purple-600"
                          }`}
                        />
                        <span>{singleSlotTime}</span>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-xs ml-1">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-purple-300 ml-1" />
                      )}
                    </div>
                  </div>
                );
              }

              // If day has multiple slots: render compact header + responsive slots grid
              return (
                <div
                  key={slot.id || index}
                  className={`rounded-2xl p-3.5 sm:p-4 border-2 transition-all ${
                    isDateSelected
                      ? "border-purple-400 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/50 shadow-md ring-2 ring-purple-400/20"
                      : "border-purple-100 bg-white hover:border-purple-300 shadow-xs hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {formattedDay.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-gray-900 capitalize">
                            {formattedDay}
                          </h4>
                          {index === 0 && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              Earliest
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-purple-700 font-medium">
                          {slot.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                      {availableSlots.length} Slots Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableSlots.map((slotTime, i) => {
                      const isSelected =
                        selectedTimeSlot === slotTime &&
                        selectedDate === slot.date;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            handleSelectTimeSlot(
                              slot.date,
                              slotTime!,
                              slot.dayOfWeek,
                            )
                          }
                          className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 border-purple-600 text-white shadow-md shadow-purple-500/25 scale-[1.01]"
                              : "bg-purple-50/40 border-purple-100 hover:border-purple-300 hover:bg-purple-50 text-gray-800 hover:text-purple-900 shadow-xs"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold tracking-tight">
                              {slotTime}
                            </span>
                          </div>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-xs">
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Slot Highlight Bar */}
        {selectedTimeSlot && selectedDate && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-100 font-bold">
                  Selected Slot
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {selectedDate} • {selectedTimeSlot}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-lg shadow-sm">
              Ready ✓
            </span>
          </div>
        )}
      </Modal>
    );
  };

  const renderCouponsModal = (): JSX.Element => {
    return (
      <Modal
        open={showCouponsModal}
        onCancel={() => setShowCouponsModal(false)}
        centered
        destroyOnClose
        maskClosable
        width="90%"
        style={{ maxWidth: 620 }}
        bodyStyle={{
          maxHeight: "75vh",
          overflowY: "auto",
          background: "#ffffff",
          padding: "20px 24px",
          borderRadius: 16,
        }}
        title={
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Available Coupons & Offers
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Apply exclusive discount codes to your order
              </p>
            </div>
          </div>
        }
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setShowCouponsModal(false)}
            className="bg-purple-600 hover:bg-purple-700 text-sm font-medium rounded-lg px-5"
          >
            Close
          </Button>,
        ]}
        className="responsive-modal"
      >
        {couponsLoading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-gray-500 text-xs mt-2">Loading available coupons...</p>
          </div>
        ) : availableCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200 my-2">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
              <Tag className="w-7 h-7" />
            </div>
            <h4 className="text-gray-800 font-semibold text-base mb-1">
              No Coupons Available Right Now
            </h4>
            <p className="text-gray-500 text-xs max-w-sm">
              You can still manually enter any coupon code you have in the coupon box on the checkout page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
            {availableCoupons.map((coupon: Coupon) => (
              <div
                key={coupon.couponCode}
                className="bg-gradient-to-br from-white to-purple-50/30 border border-purple-200/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-md border border-purple-200">
                      {coupon.couponCode}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Save ₹{Number(coupon.couponValue || 0).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Min. Order: ₹{Number(coupon.minOrder || 0).toFixed(2)}
                  </p>
                  {coupon.couponDesc && (
                    <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">
                      {coupon.couponDesc}
                    </p>
                  )}
                </div>
                <Button
                  type="primary"
                  block
                  size="middle"
                  loading={coupenLoading}
                  onClick={() => handleSelectCoupon(coupon)}
                  className="bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold mt-2"
                >
                  Apply Coupon
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    );
  };

  if(cashfreeLoading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  // Build flattened quick slots for the inline slots carousel
  const inlineQuickSlots: Array<{
    date: string;
    time: string;
    dayOfWeek: string;
    dayLabel: string;
    iconType: "sun" | "sunset" | "moon";
  }> = [];

  timeSlots.forEach((slot, dayIndex) => {
    const dayLabel =
      (slot as any).formattedDay ||
      (dayIndex === 0 ? "Today" : dayIndex === 1 ? "Tomorrow" : slot.dayOfWeek);
    const slotsList = [
      slot.timeSlot1,
      slot.timeSlot2,
      slot.timeSlot3,
      slot.timeSlot4,
    ].filter(Boolean);

    slotsList.forEach((slotTime, slotIndex) => {
      if (inlineQuickSlots.length < 4) {
        const lower = slotTime.toLowerCase();
        const startPart = lower.split("-")[0] || lower;
        let iconType: "sun" | "sunset" | "moon" = "sun";

        if (startPart.includes("am") && !startPart.includes("12")) {
          iconType = "sun";
        } else if (
          startPart.includes("12 pm") ||
          startPart.includes("1 pm") ||
          startPart.includes("2 pm") ||
          startPart.includes("3 pm") ||
          startPart.includes("4 pm")
        ) {
          iconType = "sunset";
        } else if (startPart.includes("pm")) {
          iconType = "moon";
        } else {
          // If timespan covers full day (e.g. 10:00 AM - 07:00 PM), differentiate by day/slot index
          const iconSeq: Array<"sun" | "sunset" | "moon"> = ["sun", "sun", "sunset", "moon"];
          iconType = iconSeq[(dayIndex + slotIndex) % iconSeq.length] || "sun";
        }

        inlineQuickSlots.push({
          date: slot.date,
          time: slotTime,
          dayOfWeek: slot.dayOfWeek,
          dayLabel:
            dayIndex === 0
              ? "Today"
              : dayIndex === 1
              ? "Tomorrow"
              : slot.dayOfWeek,
          iconType,
        });
      }
    });
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70">
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 pt-1 sm:pt-2.5 pb-6">
        <main className="min-w-0">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-purple-100 shadow-xs">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 shrink-0 border border-purple-200/60"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Checkout Details
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review items, pick your delivery slot, and complete payment
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Segregated Section Cards */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Card 1: Delivery Time Slot */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                        Delivery Time Slot
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Choose a convenient time for delivery
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openTimeSlotModal}
                    className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline transition-colors shrink-0"
                  >
                    <span>View All Slots</span>
                    <span className="text-sm">→</span>
                  </button>
                </div>

                {/* Inline Quick Slot Options */}
                {inlineQuickSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    {inlineQuickSlots.map((slotObj, idx) => {
                      const isSelected =
                        selectedDate === slotObj.date &&
                        selectedTimeSlot === slotObj.time;

                      return (
                        <div
                          key={`${slotObj.date}-${slotObj.time}-${idx}`}
                          onClick={() =>
                            handleSelectTimeSlot(
                              slotObj.date,
                              slotObj.time,
                              slotObj.dayOfWeek,
                            )
                          }
                          className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? "border-purple-500 bg-purple-50/50 shadow-2xs ring-1 ring-purple-400/20"
                              : "border-gray-200 hover:border-purple-300 bg-white shadow-2xs hover:bg-purple-50/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="shrink-0">
                              {slotObj.iconType === "sunset" ? (
                                <Sunset className="w-4 h-4 text-orange-500" />
                              ) : slotObj.iconType === "moon" ? (
                                <Moon className="w-4 h-4 text-indigo-500" />
                              ) : (
                                <Sun className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-bold leading-tight truncate ${
                                  isSelected
                                    ? "text-gray-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {slotObj.dayLabel}
                              </div>
                              <div
                                className={`text-[11px] leading-tight mt-0.5 truncate ${
                                  isSelected
                                    ? "text-purple-700 font-bold"
                                    : "text-gray-500 font-medium"
                                }`}
                              >
                                {slotObj.time}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : selectedTimeSlot ? (
                  <div
                    onClick={openTimeSlotModal}
                    className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/70 border-2 border-purple-600 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 capitalize">
                          {selectedDate}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-md border border-purple-200">
                          {selectedTimeSlot}
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Confirmed ✓
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-purple-700 font-bold hover:underline">
                      Change →
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={openTimeSlotModal}
                    className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-amber-900">
                        Please select a delivery time slot to continue
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={openTimeSlotModal}
                      className="text-xs font-bold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1 rounded-lg border border-amber-300"
                    >
                      Choose Slot →
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Order Items */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                      Order Items ({cartData.length})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Check your items and make sure everything is correct
                    </p>
                  </div>
                </div>

                {/* Table Header Row */}
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-700 bg-gray-100/90 px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase tracking-wider">
                  <div className="col-span-6 sm:col-span-5 text-gray-800">Item</div>
                  <div className="col-span-2 text-center text-gray-800">Price</div>
                  <div className="col-span-2 text-center text-gray-800">Quantity</div>
                  <div className="col-span-2 sm:col-span-3 text-right text-gray-800">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 max-h-[28rem] overflow-y-auto pr-1">
                  {cartData.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-6">Your cart is empty</p>
                  ) : (
                    cartData.map((item) => {
                      const itemImgUrl = item.image || item.itemImage;
                      const itemTotal = (
                        parseFloat(item.itemPrice || "0") *
                        parseInt(item.cartQuantity || "1")
                      ).toFixed(0);

                      return (
                        <div
                          key={item.itemId}
                          className="py-3.5 first:pt-1 grid grid-cols-12 gap-2 items-center"
                        >
                          {/* Item Thumbnail & Details */}
                          <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-gray-100 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                              {itemImgUrl ? (
                                <img
                                  src={resolveAskoxyUrl(itemImgUrl)}
                                  alt={item.itemName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                    const fallback = (e.target as HTMLElement).nextElementSibling;
                                    if (fallback) {
                                      (fallback as HTMLElement).classList.remove("hidden");
                                      (fallback as HTMLElement).classList.add("flex");
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-full h-full rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm sm:text-base ${
                                  itemImgUrl ? "hidden" : "flex"
                                }`}
                              >
                                {item.itemName ? item.itemName.charAt(0).toUpperCase() : "🛒"}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug truncate">
                                {item.itemName}
                              </h4>
                              {(item.weight || item.units) && (
                                <div className="text-xs font-bold text-gray-700 mt-0.5">
                                  {item.weight} {item.units}
                                </div>
                              )}
                              {(item.catergoryName || item.categoryName || item.itemDescription) && (
                                <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                  {item.catergoryName || item.categoryName || item.itemDescription}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-center text-xs sm:text-sm font-bold text-gray-800">
                            ₹{item.itemPrice}
                          </div>

                          {/* Quantity (non-editable clean badge) */}
                          <div className="col-span-2 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs">
                              {item.cartQuantity}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="col-span-2 sm:col-span-3 text-right text-xs sm:text-sm font-bold text-gray-900">
                            {isFreeItem(item) ? (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                FREE
                              </span>
                            ) : (
                              `₹${itemTotal}`
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Card 3: Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
                    <CreditCard className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                      Payment Method
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Choose how you want to pay
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Option 1: Online Payment */}
                  <div
                    onClick={() => setSelectedPayment("ONLINE")}
                    className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                      selectedPayment === "ONLINE"
                        ? "border-purple-400 bg-purple-50/50 shadow-2xs ring-1 ring-purple-400/20"
                        : "border-gray-200 hover:border-purple-300 bg-white shadow-2xs hover:bg-purple-50/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 leading-tight">
                            Online Payment
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Fast
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          UPI, Cards, Net Banking
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        selectedPayment === "ONLINE"
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedPayment === "ONLINE" && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  {/* Option 2: Cash on Delivery */}
                  <div
                    onClick={() => setSelectedPayment("COD")}
                    className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all flex items-center justify-between gap-3 ${
                      selectedPayment === "COD"
                        ? "border-purple-400 bg-purple-50/50 shadow-2xs ring-1 ring-purple-400/20"
                        : "border-gray-200 hover:border-purple-300 bg-white shadow-2xs hover:bg-purple-50/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 border border-gray-200">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 leading-tight">
                            Cash on Delivery
                          </span>
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                            COD
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          Pay at delivery doorstep
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        selectedPayment === "COD"
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedPayment === "COD" && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-200/90 rounded-3xl shadow-sm overflow-hidden sticky top-6">
                {/* Top Banner Image */}
                <div
                  className="relative overflow-hidden min-h-[150px] sm:min-h-[165px] bg-cover bg-right sm:bg-center p-5 sm:p-6 flex flex-col justify-start"
                  style={{
                    backgroundImage: `url(${checkoutBannerImg})`,
                  }}
                >
                  {/* Subtle soft gradient overlay so text is crystal clear */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent z-0" />

                  <div className="relative z-10 pt-1 space-y-1">
                    <h3 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md leading-tight">
                      Order Summary
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-200 drop-shadow-sm">
                      <span className="text-sm">✨</span> Fresh & Pure
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium drop-shadow-sm pt-0.5">
                      {cartData.length} {cartData.length === 1 ? "item" : "items"} in your cart
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {(comboPricing.active || comboPricing.incomplete) && (
                    <AgentComboPricingSummary
                      pricing={comboPricing}
                      compact
                    />
                  )}

                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700 font-semibold text-sm sm:text-base">Subtotal</span>
                      <span className="font-extrabold text-gray-900 text-base sm:text-lg">
                        ₹{Number(grandTotal || 0).toFixed(2)}
                      </span>
                    </div>

                    {comboPricing.active && comboPricing.savings > 0 && (
                      <div className="flex justify-between items-center py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                        <span>Combo offer savings</span>
                        <span>-₹{Number(comboPricing.savings || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {goldMakingCharges > 0 && (
                      <div className="flex justify-between py-1 text-xs sm:text-sm">
                        <span className="text-gray-600">
                          Gold Making Charges
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{Number(goldMakingCharges || 0).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {(Math.max(0, (subGst || 0) - (goldMakingCharges || 0)) > 0 || silverGst > 0) && (
                      <div className="flex justify-between py-1 text-xs sm:text-sm">
                        <span className="text-gray-600">GST</span>
                        <span className="font-medium text-gray-900">
                          ₹
                          {(
                            Math.max(0, (subGst || 0) - (goldMakingCharges || 0)) +
                            silverGst
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {silverDiscount > 0 && (
                      <div className="flex justify-between items-center py-1 text-sm sm:text-base text-emerald-700 font-semibold">
                        <span>Discount</span>
                        <span className="font-extrabold text-emerald-700">-₹{silverDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    {cartData.length > 0 && deliveryFee !== null && !isDeliveryFeeLoading && !isPreciousMetalDistanceFeeLoading && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700 font-semibold text-sm sm:text-base">Delivery Fee</span>
                        <span className="font-extrabold text-gray-900 text-base sm:text-lg">
                          ₹{(deliveryFee ?? 0).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {cartData.length > 0 && (isPreciousMetalDistanceFeeLoading || isDeliveryFeeLoading) && (
                      <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Calculating delivery charges…
                      </div>
                    )}

                    {cartData.length > 0 && !isPreciousMetalDistanceFeeLoading && !isDeliveryFeeLoading && deliveryFee === null && isPreciousMetalOnlyCart(cartData) && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                        {deliveryFeeMessage || "Delivery fee will be calculated and collected at the time of delivery."}
                      </div>
                    )}

                    {cartData.length > 0 &&
                      handlingFee !== null &&
                      handlingFee > 0 && (
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Handling Fee</span>
                          <span className="font-medium text-gray-900">₹{(handlingFee ?? 0).toFixed(2)}</span>
                        </div>
                      )}

                    {cartData.length > 0 && smallCartFee > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Small Cart Fee</span>
                        <span className="font-medium text-gray-900">₹{Number(smallCartFee || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {cartData.length > 0 && serviceFee > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-medium text-gray-900">₹{Number(serviceFee || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {coupenApplied && coupenDetails && (
                      <div className="flex justify-between items-center py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                        <span>Coupon Discount</span>
                        <span>-₹{Number(coupenDetails || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {totalAmount < 500 && (
                      <div className="mt-2.5 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium">
                        Use minimum ₹500 to skip handling fee and use wallet balance.
                      </div>
                    )}

                    {useWallet && usedWalletAmount > 0 && (
                      <div className="flex justify-between items-center py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                        <span>Wallet Deduction</span>
                        <span>-₹{Number(usedWalletAmount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Total Payable Box */}
                    <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-100/70 border border-purple-200 rounded-xl p-3.5 flex justify-between items-center shadow-2xs mt-3">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-gray-900 block leading-tight">
                          Total Payable
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Inclusive of all taxes
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-purple-700">
                        ₹{Number(grandTotalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Coupon Box */}
                  <div className="border border-dashed border-purple-300 rounded-xl p-3.5 bg-purple-50/30 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-purple-600" />
                        Apply Coupon
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenCouponsModal}
                        className="text-xs font-bold text-purple-700 bg-purple-100/80 hover:bg-purple-200 px-2.5 py-1 rounded-lg border border-purple-200 hover:underline transition-all"
                      >
                        View All Coupons {availableCoupons.length > 0 ? `(${availableCoupons.length})` : ""}
                      </button>
                    </div>

                    {/* Coupon input field */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER COUPON CODE"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 uppercase font-semibold placeholder:normal-case placeholder:font-normal bg-white transition-all"
                        disabled={coupenApplied}
                      />
                      {coupenApplied ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={deleteCoupen}
                          className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shrink-0 shadow-xs"
                        >
                          Remove
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || couponCode.trim().length < 3 || coupenLoading}
                          className="px-4 py-2 text-xs font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center min-w-[76px] shadow-xs"
                        >
                          {coupenLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* Applied Coupon Banner */}
                    {coupenApplied && (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="font-bold text-emerald-800">✓ {couponCode}</span>
                          <span>applied! Saved ₹{Number(coupenDetails || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Compact Available Offers Carousel */}
                    {!coupenApplied && availableCoupons.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[11px] font-semibold text-gray-500 mb-1.5">
                          Available Offers
                        </div>
                        <div className="flex overflow-x-auto gap-2 pb-1">
                          {availableCoupons.map((coupon: Coupon) => (
                            <div
                              key={coupon.couponCode}
                              className="p-2.5 bg-white border border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-2xs transition-all flex-none w-44 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-purple-700">
                                    {coupon.couponCode}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                                    Save ₹{Number(coupon.couponValue || 0).toFixed(0)}
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                  Min. Order ₹{Number(coupon.minOrder || 0).toFixed(0)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSelectCoupon(coupon)}
                                disabled={coupenLoading}
                                className="mt-2 text-xs font-bold text-purple-600 hover:text-purple-800 text-right hover:underline"
                              >
                                Apply Offer →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isRiceOnlyCart(cartData) && (
                    <div className="flex items-start space-x-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="exchangePolicy"
                        checked={exchangePolicyAccepted}
                        onChange={(e) =>
                          setExchangePolicyAccepted(e.target.checked)
                        }
                        className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="exchangePolicy"
                        className="text-xs text-gray-700 leading-tight cursor-pointer"
                      >
                        You can request an exchange within 10 Days from your order being delivered.
                      </label>
                    </div>
                  )}

                  {walletApplicable &&
                    totalAmount >= minOrderForWallet &&
                    walletAmount > 0 && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        ✓ Wallet applicable! You can use ₹
                        {Number(walletAmount || 0).toFixed(2)}.
                      </p>
                    )}

                  <div className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <input
                      type="checkbox"
                      id="useWallet"
                      checked={useWallet}
                      onChange={handleCheckboxToggle}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    />
                    <label
                      htmlFor="useWallet"
                      className="text-xs sm:text-sm font-bold text-gray-800 cursor-pointer select-none"
                    >
                      Use Wallet Balance (₹{Number(walletAmount || 0).toFixed(2)})
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlePayment}
                    disabled={
                      loading ||
                      isDeliveryFeeLoading ||
                      isPreciousMetalDistanceFeeLoading ||
                      !selectedAddress ||
                      !selectedTimeSlot ||
                      cartData.length === 0 ||
                      (deliveryFee === null && !isPreciousMetalOnlyCart(cartData)) ||
                      !canPlaceOrder
                    }
                    className="w-full mt-5 py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-300 disabled:to-indigo-300 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-purple-500/25 transition-all text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <div className="flex items-center justify-between w-full px-4">
                        <span>
                          {selectedPayment === "ONLINE"
                            ? "Proceed to Payment"
                            : "Place Order"}
                        </span>
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black">
                          ₹{Number(grandTotalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      {renderTimeSlotModal()}
      {renderDeliveryTimelineModal()}
      {renderCouponsModal()}
      {isEligibleToday && (
        <Modal
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          centered
          destroyOnClose
          maskClosable
          width="90%"
          style={{ maxWidth: 500 }}
          className="instant-delivery-modal"
          maskStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
          }}
          bodyStyle={{
            padding: 0,
            borderRadius: 20,
            overflow: "hidden",
            background: "transparent",
          }}
          closeIcon={null}
        >
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10"
            >
              <CloseCircleOutlined className="text-gray-600 text-lg" />
            </button>

            <div className="relative p-8 sm:p-10">
              {/* Icon and Title Section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-ping opacity-25"></div>
                  <CheckCircleOutlined className="text-3xl text-white relative z-10" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  🚀 Instant Delivery
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Content Box */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/40 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <CheckCircleOutlined className="text-sm text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      You're all set for today! ✨
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Your location qualifies for our lightning-fast instant
                      delivery service. Ready to get your order delivered in
                      record time?
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCancel}
                  block
                  size="large"
                  icon={<CloseCircleOutlined />}
                  className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-[0.98] active:scale-95"
                >
                  Maybe Later
                </Button>

                <Button
                  type="primary"
                  onClick={handleOk}
                  block
                  size="large"
                  icon={<CheckCircleOutlined />}
                  className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium rounded-xl border-none shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-[0.98] active:scale-95"
                >
                  Confirm Delivery
                </Button>
              </div>

              {/* Delivery Time Indicator */}
              <div className="mt-5 text-center">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm border border-amber-200 shadow-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    Order will be delivered today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CheckoutPage;
