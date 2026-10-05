import React, { useContext, useEffect, useRef, useState } from "react";
import { customerApi } from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  X,
  Trash2,
  Info,
  Gift,
  Package,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  Gem,
  CheckCircle2,
  PartyPopper,
  MapPin,
  MapPinned,
  Map,
  Navigation,
  Check,
  Home,
  Briefcase,
  Building,
  ShoppingBag,
  ShoppingCart,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";
import { isWithinRadius } from "./LocationCheck";
import { Button, message, Modal, Input, Tag, Tooltip } from "antd";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { LocationMapPicker } from "./LocationMapPicker";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL, { resolveAskoxyUrl } from "../Config";
// import DeliveryFee from "./DeliveryFee";
import {
  calculateDeliveryFee,
  calculateDistanceDeliveryFee,
} from "./DeliveryFee";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  clearAgentComboDisplay,
  computeComboPricing,
  isComboItemInCart,
  loadAgentComboDisplay,
  saveAgentComboDisplay,
  type AgentComboDisplayPayload,
  type ComboPricingResult,
} from "./agentComboDisplay";
import AgentComboPricingSummary from "./AgentComboPricingSummary";
import { getActiveCombos } from "../ChatScreen/agentApi";
import cart_banner from "../assets/img/cart_banner.png"

interface Address {
  id?: string;
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
  latitude?: number;
  longitude?: number;
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  priceMrp: number | string;
  image: string;
  itemDescription: string;
  units: string;
  weight: string;
  gstAmount?: number; // Made optional as it’s not used for non-gold items
  totalGstAmountToPay: number; // Added for non-gold items GST
  cartQuantity: number;
  cartId: string;
  status: string;
  quantity: number;
  freeQuantity?: number;
  promotionType?: string;
  goldMakingCost?: number;
  goldGst?: number;
  goldMakingCostAndGst?: number;
  combo?: boolean;
  saveAmount?: number;
  savePercentage?: number;
  catergoryName?: string;
  categoryName?: string;
}

interface AddressFormData {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ContainerEligibility {
  eligible: boolean;
  reason?: string;
  containerType?: "HEAVY_BAG" | "LIGHT_BAG";
  containerId?: string;
}

const CartPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comboPricing, setComboPricing] = useState<ComboPricingResult>({
    active: false,
    display: null,
    catalogComboSubtotal: 0,
    bundlePrice: 0,
    savings: 0,
    nonComboSubtotal: 0,
    adjustedItemSubtotal: 0,
    incomplete: false,
  });
  const [isItemTotalDropdownOpen, setIsItemTotalDropdownOpen] =
    useState<boolean>(true);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [coordinatesReady, setCoordinatesReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressSelectModalOpen, setIsAddressSelectModalOpen] =
    useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [checkoutError, setCheckoutError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
  const mobileNumberRaw = localStorage.getItem("mobileNumber") || "";
  const rawNumber = mobileNumberRaw || whatsappNumber;
  const [selectedPlan, setSelectedPlan] = useState<string[]>([]);
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [forcePlanModalDisplay, setForcePlanModalDisplay] = useState(false);
  const isFreeItem = (item: any) => item.status === "FREE";
  const modalDisplayedRef = useRef<boolean>(false);

  const [regularCartItems, setRegularCartItems] = useState<{
    [key: string]: number;
  }>({});
  const [freeCartItems, setFreeCartItems] = useState<{ [key: string]: number }>(
    {}
  );
  const [totalGstAmount, setTotalGstAmount] = useState<number>(0);
  const [saveAmount, setSaveAmount] = useState<number>(0);
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] =
    useState<boolean>(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState<
    "planA" | "planB" | null
  >(null);
  const [containerPreference, setContainerPreference] = useState<string | null>(
    null
  );
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isReferralModalVisible, setIsReferralModalVisible] =
    useState<boolean>(false);
  const [mobileNumbers, setMobileNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string>("");
  const containerExistsRef = useRef<boolean>(false);
  const [handlingFee, setHandlingFee] = useState<number | null>(0);
  //states for delivery fee
  const [deliveryFee, setDeliveryFee] = useState<number | null>(0);
  const [deliveryFeeMessage, setDeliveryFeeMessage] = useState("");
  const [isDeliveryFeeLoading, setIsDeliveryFeeLoading] = useState(false);
  const [isPreciousMetalDistanceFeeLoading, setIsPreciousMetalDistanceFeeLoading] = useState(false);
  const lastDeliveryFeeRequestKeyRef = useRef<string>("");
  //states for small cart fee and serivce charges
  // const [smallCartFee, setSmallCartFee] = useState<number>(0);
  // const [serviceFee, setServiceFee] = useState<number>(0);

  const CONTAINER_ITEM_IDS = {
    HEAVY_BAG: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
    LIGHT_BAG: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
  };

  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });

  const [addressFormErrors, setAddressFormErrors] = useState({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
  });

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    { type: "success" | "error" | "info"; message: string } | null
  >(null);
  const [detectedCoordinates, setDetectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [openedMapFromAddressModal, setOpenedMapFromAddressModal] = useState(false);

  const handleOpenMapPicker = () => {
    if (isAddressModalOpen) {
      setOpenedMapFromAddressModal(true);
      setIsAddressModalOpen(false);
    }
    setIsMapPickerOpen(true);
  };

  const handleMapLocationConfirmed = (data: {
    flatNo: string;
    landmark: string;
    address: string;
    pincode: string;
    lat?: number;
    lng?: number;
  }) => {
    if (data.lat && data.lng) {
      setDetectedCoordinates({ lat: data.lat, lng: data.lng });
    }
    setAddressFormData((prev) => ({
      ...prev,
      flatNo: data.flatNo || prev.flatNo,
      landMark: data.landmark || prev.landMark,
      address: data.address || prev.address,
      pincode: data.pincode || prev.pincode,
    }));
    setAddressFormErrors((prev) => ({
      ...prev,
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    }));
    setLocationStatus({
      type: "success",
      message: "Location selected from map.",
    });

    setIsMapPickerOpen(false);
    setIsAddressModalOpen(true);
    setOpenedMapFromAddressModal(false);
  };

  const handleMapPickerClose = () => {
    setIsMapPickerOpen(false);
    if (openedMapFromAddressModal) {
      setIsAddressModalOpen(true);
      setOpenedMapFromAddressModal(false);
    }
  };

  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { setCount } = context;

  const [silverDiscount, setSilverDiscount] = useState<number>(0);
  const [silverGst, setSilverGst] = useState<number>(0);
  const [showSilverGstModal, setShowSilverGstModal] = useState<boolean>(false);
  const [silverGstModalShown, setSilverGstModalShown] = useState<boolean>(false);

  useEffect(() => {
    if ((silverDiscount > 0 || silverGst > 0) && !silverGstModalShown) {
      const timer = setTimeout(() => {
        setShowSilverGstModal(true);
        setSilverGstModalShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [silverDiscount, silverGst, silverGstModalShown]);

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
            const qty = regularCartItems[item.itemId] || item.cartQuantity || 1;
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
        console.error("Error calculating silver breakdown in cart:", err);
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
  }, [cartData, regularCartItems]);

  // Gold and Silver use the distance-fee delivery flow. Prefer the category
  // returned by the cart API; the name check keeps older cart responses working.
  const isPreciousMetalItem = (item: CartItem) =>
    [item.catergoryName, item.categoryName, (item as any).categoryType, (item as any).category]
      .filter(Boolean)
      .some((category) => /GOLD|SILVER/i.test(String(category))) ||
    /gold|silver/i.test(item.itemName);
  const hasPreciousMetalItems = (items: CartItem[] = cartData) =>
    items.some(isPreciousMetalItem);
  const isPreciousMetalOnlyCart = (items: CartItem[] = cartData) =>
    items.length > 0 && items.every(isPreciousMetalItem);
  const PRECIOUS_METAL_MIXED_CART_FEE_DISTANCE_KM = 40;
  const PRECIOUS_METAL_MIXED_CART_REMOVE_DISTANCE_KM = 100;
  const getOutOfServiceItems = (items: CartItem[] = cartData) =>
    items.filter((item) => !isPreciousMetalItem(item));
  const formatItemNames = (items: CartItem[]) => {
    const names = items.map((item) => item.itemName.trim()).filter(Boolean);
    if (names.length === 0) return "the selected item";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
  };

  const handleRemoveNonPreciousMetalItems = async (customItems?: CartItem[]) => {
    const itemsToRemove = customItems || cartData.filter((item) => !isPreciousMetalItem(item));
    if (itemsToRemove.length === 0) return true;

    try {
      await Promise.all(
        itemsToRemove.map((item) =>
          item.status === "FREE"
            ? customerApi.delete(`${BASE_URL}/cart-service/cart/removeFreeContainer`, {
                data: {
                  id: item.cartId,
                  customerId,
                  itemId: item.itemId,
                  status: "FREE",
                },
              })
            : customerApi.delete(`${BASE_URL}/cart-service/cart/remove`, {
                data: { id: item.cartId },
              })
        )
      );
      await fetchCartData();
      message.success("General items removed. Cart now contains only Gold & Silver items.");
      return true;
    } catch (error) {
      console.error("Failed to remove non-Gold/Silver items:", error);
      message.error("Could not remove general items. Please try again.");
      return false;
    }
  };

  const refreshComboPricing = (
    items: CartItem[],
    quantityMap: Record<string, number>,
  ) => {
    const fromState = (
      location.state as { agentComboDisplay?: AgentComboDisplayPayload } | null
    )?.agentComboDisplay;
    const display = fromState ?? loadAgentComboDisplay();
    const pricing = computeComboPricing(display, items, quantityMap);
    setComboPricing(pricing);
    if (!pricing.active && !pricing.incomplete && !pricing.display) {
      clearAgentComboDisplay();
    }
    return pricing;
  };

  const syncComboFromServer = async (
    items: CartItem[],
    quantityMap: Record<string, number>,
  ) => {
    if (!customerId) return;
    const stored = loadAgentComboDisplay();
    if (!stored) return;
    try {
      const offers = await getActiveCombos(customerId);
      const match = offers.find((o) => o.comboOfferId === stored.comboOfferId);
      if (!match) {
        clearAgentComboDisplay();
        refreshComboPricing(items, quantityMap);
        return;
      }
      saveAgentComboDisplay(match);
    } catch {
      /* keep session payload */
    }
    refreshComboPricing(items, quantityMap);
  };

  const fetchAddresses = async () => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`
      );
      const fetchedAddresses = [...response.data].reverse();
      let defaultAddress = fetchedAddresses[0] || null;

      if (
        defaultAddress &&
        (!defaultAddress.latitude || !defaultAddress.longitude)
      ) {
        const fullAddress = `${defaultAddress.flatNo}, ${defaultAddress.landMark}, ${defaultAddress.address}, ${defaultAddress.pincode}`;
        const coordinates = await getCoordinates(fullAddress);
        if (coordinates) {
          defaultAddress = {
            ...defaultAddress,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          };
        } else {
          console.warn("Could not fetch coordinates for address:", fullAddress);
          message.warning(
            "Unable to fetch coordinates for the selected address."
          );
        }
      }

      setAddresses(fetchedAddresses);
      setSelectedAddress(defaultAddress);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      message.error("Failed to load addresses. Please try again.");
    }
  };

  const updateContainerPreference = async (
    preferenceTypes: string[],
    collectedNumb: string[]
  ) => {
    try {
      const itemIds = cartData.map((item) => item.itemId);

      let trimmed = rawNumber.trim();
      let mobilenumber =
        trimmed.length > 10 ? trimmed.replace(/^(\+91|91)/, "") : trimmed;

      const requestBody: any = {
        created_at: new Date().toISOString(),
        itemIds: itemIds,
        mobilenumber: mobilenumber,
        referenceMobileNumbers: collectedNumb,
        user_id: customerId,
      };

      if (preferenceTypes.includes("planA")) {
        requestBody.plana = "YES";
      }

      if (preferenceTypes.includes("planB")) {
        requestBody.planb = "YES";
      }

      const response = await customerApi.post(
        `${BASE_URL}/reference-service/referenceoffer`,
        requestBody,
        {
          validateStatus: () => true,
        }
      );

      console.log(
        "updateContainerPreference response:",
        response.status,
        response.data
      );

      if (response.status === 400) {
        const errorMessage = response.data.message || "";
        if (
          errorMessage.toLowerCase().includes("reference offer already exists")
        ) {
          Modal.info({
            title: "Plan Already Selected",
            content: (
              <p>
                You have already opted for a plan. Please proceed to checkout to
                avail the free container offer.
              </p>
            ),
            okText: "Proceed to Checkout",
            onOk: () => {
              if (selectedAddress) {
                navigate("/main/checkout", { state: { selectedAddress } });
              } else {
                message.error(
                  "Please select an address before proceeding to checkout."
                );
              }
            },
            cancelButtonProps: { style: { display: "none" } },
          });
          return false;
        }
        message.error(errorMessage || "Something went wrong.", 5);
        return false;
      }

      if (response.status === 200) {
        const resData = response.data;
        const messages = [];

        const isPlanA = preferenceTypes.includes("planA");
        const isPlanB = preferenceTypes.includes("planB");

        const alreadySaved = Array.isArray(resData.alreadySavedReferences)
          ? resData.alreadySavedReferences
          : [];
        const newlySaved = Array.isArray(resData.newlySavedReferences)
          ? resData.newlySavedReferences
          : [];

        if ((isPlanA && isPlanB) || isPlanB) {
          if (alreadySaved.length > 0 && newlySaved.length > 0) {
            messages.push(
              `Already referred numbers: ${alreadySaved.join(", ")}. ` +
              `Newly referred numbers: ${newlySaved.join(", ")}.`
            );
          } else if (alreadySaved.length > 0) {
            messages.push(
              `These numbers are already referred: ${alreadySaved.join(", ")}`
            );
          } else if (newlySaved.length > 0) {
            messages.push(
              `The following numbers have been referred successfully: ${newlySaved.join(
                ", "
              )}`
            );
          }
        } else if (isPlanA) {
          messages.push("Plan A updated successfully.");
        } else if (isPlanB) {
          if (alreadySaved.length > 0 && newlySaved.length === 0) {
            messages.push(
              `These numbers are referred successfully: ${alreadySaved.join(
                ", "
              )}`
            );
          }

          if (alreadySaved.length === 0 && newlySaved.length > 0) {
            messages.push(
              `The following numbers have been referred successfully: ${newlySaved.join(
                ", "
              )}`
            );
          }
        }

        if (messages.length > 0) {
          message.success({
            content: messages.join(" "),
            duration: 8,
          });
        } else {
          message.success({
            content: resData.message || "Plans updated successfully.",
            duration: 5,
          });
        }

        return true;
      }

      message.error("Unexpected response from the server.");
      return false;
    } catch (error) {
      console.error("Error submitting reference offer:", error);
      message.error("Failed to submit reference offer.");
      return false;
    }
  };

  const handleReferralOk = async () => {
    if (mobileNumbers.length === 0) {
      message.error("Please enter at least one mobile number.");
      return;
    }

    const prefUpdated = await updateContainerPreference(
      selectedPlans,
      mobileNumbers
    );

    if (prefUpdated) {
      try {
        await customerApi.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      const eligibility = checkEligibilityForContainer(cartData);
      if (eligibility.eligible && eligibility.containerType) {
        await addContainerToCart(
          eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG"
        );
      }
    }

    setIsReferralModalVisible(false);
  };

  const handleReferralCancel = async () => {
    Modal.confirm({
      title: "Decline Referral Offer?",
      content:
        "Are you sure you want to cancel? This will remove the free container from your cart and you will not be able to avail the referral offer.",
      okText: "Yes, Cancel",
      cancelText: "Go Back",
      onOk: async () => {
        try {
          await removeContainerFromCart();
          setIsReferralModalVisible(false);
          setSelectedPlans([]);
          message.info(
            "Referral offer cancelled and free container removed from cart."
          );
        } catch (error) {
          console.error("Error cancelling referral offer:", error);
          message.error("Failed to cancel referral offer");
        }
      },
      onCancel: () => { },
    });
  };

  const handleModalClose = () => {
    Modal.confirm({
      title: "Are you sure you want to close?",
      content:
        "Are you sure you want to close? Without adding at least one mobile number, the container will not be added to your cart and the offer will not be applied.",
      okText: "Yes, Close",
      cancelText: "Stay",
      onOk() {
        setIsReferralModalVisible(false);
      },
    });
  };

  const handleAddNumber = () => {
    if (
      !currentNumber ||
      currentNumber.length !== 10 ||
      !/^[6-9]\d{9}$/.test(currentNumber)
    ) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (mobileNumbers.includes(currentNumber)) {
      message.error("This mobile number is already added");
      return;
    }
    if (currentNumber === rawNumber) {
      message.error("Adding your own number is not allowed.");
      return;
    }

    setMobileNumbers([...mobileNumbers, currentNumber]);
    setCurrentNumber("");
  };

  const handleRemoveNumber = (index: number) => {
    const newNumbers = [...mobileNumbers];
    newNumbers.splice(index, 1);
    setMobileNumbers(newNumbers);
  };

  const showContainerModal = () => {
    console.log("Showing container modal");
    setIsPlanModalVisible(true);
    modalDisplayedRef.current = true;
  };

  useEffect(() => {
    if (cartData.length === 0) {
      modalDisplayedRef.current = false;
      containerExistsRef.current = false;
    }
  }, [cartData.length]);

  useEffect(() => {
    const checkAndShowModal = async () => {
      if (cartData.length > 0 && !modalDisplayedRef.current) {
        const freeContainer = cartData.find(
          (item) =>
            [
              CONTAINER_ITEM_IDS.HEAVY_BAG,
              CONTAINER_ITEM_IDS.LIGHT_BAG,
            ].includes(item.itemId) && item.status === "FREE"
        );

        if (freeContainer) {
          console.log(
            "Free container found in cart, showing container plans modal"
          );
          showContainerModal();
          containerExistsRef.current = true;
        }
      }
    };

    checkAndShowModal();
  }, [cartData]);

  const fetchContainerPreference = async (): Promise<string | null> => {
    try {
      console.log(
        `Fetching container preference for customer ID: ${customerId}`
      );
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${customerId}`
      );

      if (response && response.data) {
        const status = response.data.freeContainerStatus
          ? response.data.freeContainerStatus.toLowerCase()
          : null;
        console.log("Fetched container preference:", status);
        return status;
      }
      console.log("No container preference found, returning null");
      return null;
    } catch (error) {
      console.error("Error fetching container preference:", error);
      return null;
    }
  };

  const parseWeight = (weight: unknown): number => {
    if (typeof weight === "number") {
      return weight;
    }
    if (typeof weight !== "string" || !weight) {
      console.warn(`Invalid weight value: ${weight}, defaulting to 0`);
      return 0;
    }
    const cleanedWeight = weight.replace(/[^0-9.]/g, "");
    const result = parseFloat(cleanedWeight) || 0;
    console.log(`Parsed weight ${weight} to ${result}`);
    return result;
  };

  const checkEligibilityForContainer = (
    cartItems: CartItem[]
  ): ContainerEligibility => {
    console.log("Checking eligibility with items:", cartItems);

    if (!cartItems || cartItems.length === 0) {
      return { eligible: false, reason: "empty_cart" };
    }

    const hasContainer = cartItems.some(
      (item) =>
        [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
          item.itemId
        ) && item.status !== "FREE"
    );

    if (hasContainer) {
      console.log("Non-free container already in cart");
      return { eligible: false, reason: "already_has_container" };
    }

    const freeContainer = cartItems.find(
      (item) =>
        [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
          item.itemId
        ) && item.status === "FREE"
    );

    if (freeContainer) {
      console.log("Free container found in cart, allowing eligibility");
      return {
        eligible: true,
        containerType:
          freeContainer.itemId === CONTAINER_ITEM_IDS.HEAVY_BAG
            ? "HEAVY_BAG"
            : "LIGHT_BAG",
        containerId: freeContainer.itemId,
      };
    }

    const hasHeavyRice = cartItems.some((item) => {
      const weight = parseWeight(item.weight);
      const isHeavyRice =
        item.itemName.toLowerCase().includes("rice") &&
        weight >= 25 &&
        weight <= 27 &&
        item.status !== "FREE";

      if (isHeavyRice) {
        console.log(`Found 26kg rice: ${item.itemName}, weight: ${weight}kg`);
      }
      return isHeavyRice;
    });

    const hasLightRice = cartItems.some((item) => {
      const weight = parseWeight(item.weight);
      const isLightRice =
        item.itemName.toLowerCase().includes("rice") &&
        weight >= 9 &&
        weight <= 11 &&
        item.status !== "FREE";

      if (isLightRice) {
        console.log(`Found 10kg rice: ${item.itemName}, weight: ${weight}kg`);
      }
      return isLightRice;
    });

    if (hasHeavyRice) {
      return {
        eligible: true,
        containerType: "HEAVY_BAG",
        containerId: CONTAINER_ITEM_IDS.HEAVY_BAG,
      };
    } else if (hasLightRice) {
      return {
        eligible: true,
        containerType: "LIGHT_BAG",
        containerId: CONTAINER_ITEM_IDS.LIGHT_BAG,
      };
    }

    console.log("No eligible rice items found for container");
    return { eligible: false, reason: "no_eligible_items" };
  };

  const addContainerToCart = async (
    containerType: "HEAVY_BAG" | "LIGHT_BAG"
  ) => {
    try {
      const containerId = CONTAINER_ITEM_IDS[containerType];
      console.log(
        `Adding container to cart: ${containerType}, ID: ${containerId}`
      );

      message.success("Free container added to your cart!");
      await fetchCartData();
      containerExistsRef.current = true;
      return true;
    } catch (error) {
      console.error("Failed to add container to cart:", error);
      message.error("Failed to add container to your cart");
      return false;
    }
  };

  const removeContainerFromCart = async () => {
    try {
      const containerItem = cartData.find(
        (item) =>
          [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
            item.itemId
          ) && item.status === "FREE"
      );

      if (containerItem) {
        console.log(
          `Removing free container from cart: ID ${containerItem.itemId}, cartId ${containerItem.cartId}`
        );

        await customerApi.delete(
          `${BASE_URL}/cart-service/cart/removeFreeContainer`,
          {
            data: {
              id: containerItem.cartId,
              customerId,
              itemId: containerItem.itemId,
              status: "FREE",
            },
          }
        );

        await fetchCartData();
        containerExistsRef.current = false;
        return true;
      } else {
        console.log("No container found in cart to remove");
        return false;
      }
    } catch (error) {
      console.error("Failed to remove container from cart:", error);
      message.error("Failed to remove container from cart");
      return false;
    }
  };

  const fetchCartData = async () => {
    try {
      console.log("Fetching cart data for customer ID:", customerId);

      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`
      );

      console.log("API Response:", response.data);

      if (response.data.customerCartResponseList) {
        const cartItems = response.data.customerCartResponseList;
        const totalQuantity = cartItems.reduce(
          (sum: number, item: CartItem) => sum + (item.cartQuantity || 0),
          0
        );

        console.log(
          `Fetched ${cartItems.length} items in cart, Total GST: ${response.data.totalGstAmountToPay}`
        );

        const hasContainer = cartItems.some((item: CartItem) =>
          [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
            item.itemId
          )
        );

        containerExistsRef.current = hasContainer;
        console.log(`Container exists in cart: ${hasContainer}`);

        const regularItemsMap = cartItems
          .filter((item: CartItem) => item.status !== "FREE")
          .reduce((acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          }, {});

        const freeItemsMap = cartItems
          .filter((item: CartItem) => item.status === "FREE")
          .reduce((acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          }, {});

        setRegularCartItems(regularItemsMap);
        setFreeCartItems(freeItemsMap);

        setCount(totalQuantity);

        const cartWithFreeItems = response.data?.customerCartResponseList || [];

        cartWithFreeItems.forEach((item: CartItem) => {
          if (
            item.itemName.toLowerCase().includes("rice") &&
            item.weight &&
            parseFloat(item.weight) >= 5
          ) {
            const freeItems = Math.floor(item.cartQuantity / 5) * 2;
            item.freeQuantity = freeItems;
          } else if (
            item.itemName.toLowerCase().includes("rice") &&
            item.weight &&
            parseFloat(item.weight) === 1 &&
            item.status === "FREE"
          ) {
            item.freeQuantity = 1;
          }
        });

        const outOfStockItems = cartWithFreeItems.filter(
          (item: CartItem) => item.cartQuantity > item.quantity
        );

        if (outOfStockItems.length > 0) {
          setCheckoutError(true);
          message.warning(
            `Please decrease the quantity for: ${outOfStockItems
              .map((item: CartItem) => item.itemName)
              .join(", ")} before proceeding to checkout.`,
            5
          );
        }

        setCartData(cartWithFreeItems);
        const pricing = refreshComboPricing(cartWithFreeItems, regularItemsMap);
        const catalogItemTotal = cartWithFreeItems
          .filter((item: CartItem) => item.status !== "FREE")
          .reduce(
            (acc: number, item: CartItem) =>
              acc +
              parseFloat(item.itemPrice) * (regularItemsMap[item.itemId] || 0),
            0,
          );
        setCartTotal(
          pricing.active ? pricing.adjustedItemSubtotal : catalogItemTotal,
        );
        setTotalGstAmount(response.data.totalGstAmountToPay || 0); // Set the total GST amount
        setSaveAmount(response.data.saveAmount || 0);
        void syncComboFromServer(cartWithFreeItems, regularItemsMap);
        return cartWithFreeItems;
      } else {
        console.warn(
          "No customerCartResponseList in response, setting empty cart"
        );
        setRegularCartItems({});
        setFreeCartItems({});
        setCount(0);
        setCartData([]);
        setTotalGstAmount(0); // Reset GST amount
        return [];
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios Error:",
          error.response?.status,
          error.response?.data || error.message
        );
      }
      setRegularCartItems({});
      setFreeCartItems({});
      setCount(0);
      setCartData([]);
      setTotalGstAmount(0); // Reset GST amount on error
      message.error("Failed to load cart data. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      return null;
    }
  };

  const parseLocationResult = (result: any) => {
    const components: any[] = result?.address_components || [];
    const get = (type: string) =>
      components.find((component) => component.types?.includes(type))?.long_name || "";

    const premise = get("premise");
    const subpremise = get("subpremise");
    const streetNumber = get("street_number");
    const building = get("building");
    const flatNoParts = [premise, subpremise, building, streetNumber].filter(Boolean);
    const flatNo = flatNoParts.length > 0 ? Array.from(new Set(flatNoParts)).join(", ") : "";

    const route = get("route");
    const neighborhood = get("neighborhood");
    const sublocality3 = get("sublocality_level_3");
    const sublocality2 = get("sublocality_level_2");
    const sublocality1 = get("sublocality_level_1");
    const locality = get("locality");
    const district = get("administrative_area_level_2");
    const pincode = get("postal_code");

    const landMark = route || neighborhood || sublocality3 || sublocality2 || sublocality1 || "";
    const parts = [
      route,
      neighborhood,
      sublocality3,
      sublocality2,
      sublocality1,
      locality || district,
    ].filter(Boolean);
    const address = Array.from(new Set(parts)).join(", ") || (result?.formatted_address || "")
      .replace(/,?\s*India$/i, "")
      .replace(/,?\s*\d{6}(?:\s*,?\s*[^,]+)?$/i, "")
      .trim();

    return { flatNo, landMark, address, pincode };
  };

  const clearDetectedCoordinates = () => {
    setDetectedCoordinates(null);
    if (locationStatus?.type === "success") setLocationStatus(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        type: "error",
        message: "Current location is not supported by this browser. Please enter your address manually.",
      });
      return;
    }

    setIsFetchingLocation(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setDetectedCoordinates({ lat, lng });

        try {
          const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
          );
          const result = response.data?.results?.[0];

          if (response.data?.status === "OK" && result) {
            const parsed = parseLocationResult(result);
            setAddressFormData((prev) => ({
              ...prev,
              ...(parsed.flatNo ? { flatNo: parsed.flatNo } : {}),
              landMark: parsed.landMark || prev.landMark,
              address: parsed.address || prev.address,
              pincode: parsed.pincode || prev.pincode,
            }));
            setAddressFormErrors((prev) => ({
              ...prev,
              flatNo: "",
              landmark: "",
              address: "",
              pincode: "",
            }));
            setLocationStatus({
              type: "success",
              message: "Location detected successfully. Please review your address details below.",
            });
          } else {
            setLocationStatus({
              type: "error",
              message: "Location detected, but address details could not be parsed. Please enter manually.",
            });
          }
        } catch {
          setLocationStatus({
            type: "error",
            message: "Address lookup failed. Please enter details manually.",
          });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (geoError) => {
        const errorMessage =
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission was blocked. Allow location access for this site in your browser settings, then try again."
            : geoError.code === geoError.POSITION_UNAVAILABLE
              ? "Your location is currently unavailable. Check device location services or enter the address manually."
              : geoError.code === geoError.TIMEOUT
                ? "Location detection timed out. Please try again or enter the address manually."
                : "We couldn't detect your location. Please try again or enter the address manually.";
        setDetectedCoordinates(null);
        setLocationStatus({ type: "error", message: errorMessage });
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const validateAddressForm = () => {
    const errors = {
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo.trim())
      errors.flatNo = "Flat/House number is required";
    if (!addressFormData.landMark.trim())
      errors.landmark = "Landmark is required";
    if (!addressFormData.address.trim()) errors.address = "Address is required";

    const pincode = addressFormData.pincode?.trim();
    if (!pincode) {
      errors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      errors.pincode = "Please enter a valid 6-digit PIN code";
    } else if (/^0+$/.test(pincode) || ['000000', '555555', '666666'].includes(pincode)) {
      errors.pincode = "Please enter a valid PIN code";
    }

    setAddressFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleAddressSubmit = async (): Promise<void> => {
    if (!validateAddressForm()) return;

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const fullAddress = `${addressFormData.flatNo}, ${addressFormData.landMark}, ${addressFormData.address}, ${addressFormData.pincode}`;
      const coordinates = detectedCoordinates || (await getCoordinates(fullAddress));

      if (!coordinates) {
        setError("Unable to find location. Please verify your address details.");
        setTimeout(() => setError(""), 5000);
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      console.log({ withinRadius });

      if (!withinRadius.isWithin && !hasPreciousMetalItems()) {
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
        Modal.error({
          title: "Delivery Unavailable",
          content: (
            <>
              <p>
                Sorry! We're unable to deliver to this address as it is{" "}
                {withinRadius.distanceInKm} km away, beyond our 25 km delivery
                radius. Please select another saved address within the radius or
                add a new one to proceed. We appreciate your understanding!
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="default" onClick={() => Modal.destroyAll()}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.destroyAll();
                    setIsAddressModalOpen(true);
                  }}
                >
                  Add New Address
                </Button>
              </div>
            </>
          ),
          footer: null,
        });
        return;
      }

      const data = {
        userId: customerId,
        flatNo: addressFormData.flatNo,
        landMark: addressFormData.landMark,
        address: addressFormData.address,
        pincode: addressFormData.pincode,
        addressType: addressFormData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingAddressId) {
        await customerApi.put(
          `${BASE_URL}/user-service/updateAddress/${editingAddressId}`,
          data
        );
        message.success("Address updated successfully.", 5);
      } else {
        await customerApi.post(`${BASE_URL}/user-service/addAddress`, data);
        message.success("Address added successfully.", 5);
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
      }

      setError("");
      await fetchAddresses();
      setTimeout(resetAddressForm, 3000);
    } catch (err) {
      setSuccessMessage("");
      const apiError = err as ApiError;
      const errorMsg = apiError.response?.data?.message || "Failed to save address. Please try again.";
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
      if (!error) {
        setIsAddressModalOpen(false);
      }
    }
  };

  const handleIncrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    try {
      const isFreeItem = item.status === "FREE";
      const currentQuantity = isFreeItem
        ? freeCartItems[item.itemId] || 0
        : regularCartItems[item.itemId] || 0;

      if (currentQuantity >= item.quantity) {
        message.warning(`Only ${item.quantity} units available in stock`);
        setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
        return;
      }

      const newQuantity = currentQuantity + 1;

      await customerApi.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: item.itemId,
          status: isFreeItem ? "FREE" : undefined,
        }
      );

      if (isFreeItem) {
        setFreeCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));
      } else {
        setRegularCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));
        const currentCount = context.count || 0;
        setCount(currentCount + 1);
      }

      await fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    try {
      const isFreeItem = item.status === "FREE";
      const currentQuantity = isFreeItem
        ? freeCartItems[item.itemId]
        : regularCartItems[item.itemId];

      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await customerApi.patch(
          `${BASE_URL}/cart-service/cart/minusCartItem`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemId: item.itemId,
          }
        );

        if (isFreeItem) {
          setFreeCartItems((prev) => ({
            ...prev,
            [item.itemId]: newQuantity,
          }));
        } else {
          setRegularCartItems((prev) => ({
            ...prev,
            [item.itemId]: newQuantity,
          }));
          const currentCount = context.count || 0;
          setCount(Math.max(0, currentCount - 1));
        }

        await fetchCartData();
      } else {
        await removeCartItem(item);
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const removeCartItem = async (item: CartItem) => {
    try {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

      const itemIdToRemove = item.itemId;
      const cartIdToRemove = item.cartId;

      const isFreeItem = item.status === "FREE";
      const isEligibleRice =
        item.itemName.toLowerCase().includes("rice") &&
        (parseWeight(item.weight) === 10 || parseWeight(item.weight) === 26);
      const isContainer = [
        CONTAINER_ITEM_IDS.HEAVY_BAG,
        CONTAINER_ITEM_IDS.LIGHT_BAG,
      ].includes(itemIdToRemove);

      console.log(
        `Removing item: ${item.itemName}, ID: ${itemIdToRemove}, cartId: ${cartIdToRemove}, ` +
        `isFreeItem: ${isFreeItem}, isEligibleRice: ${isEligibleRice}, isContainer: ${isContainer}`
      );

      if (isFreeItem) {
        await customerApi.delete(
          `${BASE_URL}/cart-service/cart/removeFreeContainer`,
          {
            data: {
              id: cartIdToRemove,
              customerId,
              itemId: itemIdToRemove,
              status: "FREE",
            },
          }
        );
      } else {
        await customerApi.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: {
            id: cartIdToRemove,
          },
        });
      }

      if (isEligibleRice && containerExistsRef.current) {
        const remainingRiceItems = cartData.filter(
          (ci) =>
            ci.itemId !== itemIdToRemove &&
            ci.itemName.toLowerCase().includes("rice") &&
            (parseWeight(ci.weight) === 10 || parseWeight(ci.weight) === 26)
        );

        if (remainingRiceItems.length === 0) {
          console.log("Removing container after rice removal");
          await removeContainerFromCart();
        }
      }

      if (isContainer) {
        console.log("Container removed from cart, updating preference");
        containerExistsRef.current = false;
      }

      setCartData((prev) => prev.filter((ci) => ci.cartId !== cartIdToRemove));

      if (isFreeItem) {
        setFreeCartItems((prev) => {
          const updated = { ...prev };
          delete updated[itemIdToRemove];
          return updated;
        });
      } else {
        setRegularCartItems((prev) => {
          const updated = { ...prev };
          delete updated[itemIdToRemove];
          return updated;
        });
        const currentCount = context.count || 0;
        setCount(Math.max(0, currentCount - (item.cartQuantity || 0)));
      }

      const updatedCartData = await fetchCartData();

      if (!updatedCartData || updatedCartData.length === 0) {
        window.location.reload();
      }

      message.success("Item removed from cart successfully.", 5);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );
      }
      message.error("Failed to remove item");

      await fetchCartData();
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const resetAddressForm = () => {
    setDetectedCoordinates(null);
    setLocationStatus(null);
    setIsFetchingLocation(false);
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
    setAddressFormErrors({
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleToProcess = async () => {
    if (!cartData || cartData.length === 0) {
      message.error("Your cart is empty, Please Add At least one Item");
      return;
    }

    if (!selectedAddress) {
      message.error("Please select an address");
      return;
    }

    if (isDeliveryFeeLoading || isPreciousMetalDistanceFeeLoading) {
      message.info("Please wait while the delivery fee is calculated");
      return;
    }

    let checkoutItems = cartData;
    let preciousMetalDistanceFee: number | null | undefined;
    let skipNormalRadiusCheck = false;

    if (hasPreciousMetalItems(checkoutItems)) {
      // Gold and Silver items must be ordered separately from general products.
      if (!isPreciousMetalOnlyCart(checkoutItems)) {
        const nonPreciousMetalItems = checkoutItems.filter((item) => !isPreciousMetalItem(item));
        const removedNames = formatItemNames(nonPreciousMetalItems);

        // Show confirmation modal with Cancel and Proceed buttons BEFORE removing items
        const shouldProceed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: "Gold & Silver Order",
            centered: true,
            okText: "Proceed to Checkout",
            cancelText: "Cancel",
            okButtonProps: {
              className: "bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl",
            },
            cancelButtonProps: {
              className: "border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50",
            },
            content: (
              <div className="space-y-2 py-1">
                <p className="text-sm font-semibold text-gray-800">
                  Gold & Silver items must be ordered separately.
                </p>
                <p className="text-xs text-purple-700 font-medium bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                  Proceeding will remove general item(s) (<strong>{removedNames}</strong>) from your cart for this order.
                </p>
              </div>
            ),
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!shouldProceed) {
          return; // User clicked Cancel; stop checkout and keep all items in cart intact!
        }

        try {
          await Promise.all(
            nonPreciousMetalItems.map((item) =>
              item.status === "FREE"
                ? customerApi.delete(`${BASE_URL}/cart-service/cart/removeFreeContainer`, {
                    data: {
                      id: item.cartId,
                      customerId,
                      itemId: item.itemId,
                      status: "FREE",
                    },
                  })
                : customerApi.delete(`${BASE_URL}/cart-service/cart/remove`, {
                    data: { id: item.cartId },
                  })
            )
          );
          checkoutItems = (await fetchCartData()) || [];
          if (!isPreciousMetalOnlyCart(checkoutItems)) {
            message.error("Could not prepare the Gold/Silver-only order. Please try again.");
            return;
          }
        } catch (error) {
          console.error("Failed to remove non-Gold/Silver items:", error);
          message.error("Could not prepare the Gold/Silver-only order. Please try again.");
          return;
        }
      }

      skipNormalRadiusCheck = true;

      const coordinates =
        selectedAddress.latitude !== undefined && selectedAddress.longitude !== undefined
          ? { lat: selectedAddress.latitude, lng: selectedAddress.longitude }
          : await getCoordinates(
              `${selectedAddress.flatNo}, ${selectedAddress.landMark}, ${selectedAddress.address}, ${selectedAddress.pincode}`
            );

      if (!coordinates) {
        message.error("Unable to find location coordinates. Please check the address.");
        return;
      }

      const distanceResult = await calculateDistanceDeliveryFee(
        coordinates.lat,
        coordinates.lng,
      );
      preciousMetalDistanceFee = distanceResult.fee;
    }

    const effectiveDeliveryFee = isPreciousMetalOnlyCart(checkoutItems)
      ? (preciousMetalDistanceFee ?? 0)
      : deliveryFee;

    if (effectiveDeliveryFee === null && !isPreciousMetalOnlyCart(checkoutItems)) {
      const outOfServiceItems = getOutOfServiceItems(checkoutItems);
      Modal.error({
        title: "Out of Service Range",
        content: (
          <>
            <p>
              Delivery is not available for the selected address.
              {outOfServiceItems.length > 0 ? (
                <>
                  {" "}
                  Remove <strong>{formatItemNames(outOfServiceItems)}</strong> to
                  continue. Gold and silver items will remain in the cart.
                </>
              ) : (
                " Please choose another address within the service area."
              )}
            </p>
          </>
        ),
      });
      return;
    }

    if (hasStockIssues()) {
      Modal.error({
        title: "Stock Issues",
        content:
          "Unable to proceed with checkout. Please remove out-of-stock items or adjust quantities to match available stock.",
      });
      return;
    }

    const isAddressValid = skipNormalRadiusCheck
      ? { isWithin: true }
      : await handleAddressChange(selectedAddress);
    if (isAddressValid?.isWithin) {
      navigate("/main/checkout", {
        state: {
          selectedAddress,
          deliveryFee: effectiveDeliveryFee,
          agentComboPricing: comboPricing.active ? comboPricing : null,
        },
      });
    }
  };

  const handleAddressModalClose = () => {
    setDetectedCoordinates(null);
    setLocationStatus(null);
    setIsFetchingLocation(false);
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setSuccessMessage("");
    setError("");
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
  };

  const handleInterested = async (selectedPlanTypes: string[]) => {
    modalDisplayedRef.current = true;

    if (selectedPlanTypes.length === 0) {
      console.log("User declined container offer");
      if (containerExistsRef.current) {
        await removeContainerFromCart();
      }
      try {
        await customerApi.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "declined",
          }
        );
        message.info("Container preference updated");
      } catch (error) {
        console.error("Error updating container preference:", error);
      }
      return false;
    }

    const eligibility = checkEligibilityForContainer(cartData);
    setSelectedPlans(selectedPlanTypes);

    if (!eligibility.eligible) {
      if (eligibility.reason === "already_has_container") {
        message.info("You have already opted for a container.");
      } else {
        message.info("No eligible items for a free container.");
      }
      return false;
    }

    if (selectedPlanTypes.includes("planB") && mobileNumbers.length === 0) {
      setMobileNumbers([]);
      setCurrentNumber("");
      setIsReferralModalVisible(true);
      return false;
    }

    const prefUpdated = await updateContainerPreference(
      selectedPlanTypes,
      mobileNumbers
    );

    if (prefUpdated === true) {
      try {
        await customerApi.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      const success = await addContainerToCart(
        eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG"
      );
      return success;
    }
    return false;
  };

  const forceShowContainerModal = () => {
    setForcePlanModalDisplay(true);
    modalDisplayedRef.current = false;
  };

  useEffect(() => {
    if (isPlanDetailsModalOpen && currentPlanDetails) {
      try {
        Modal.info({
          title:
            currentPlanDetails === "planA"
              ? "Free Steel Container Policy"
              : "Referral Program",
          content: (
            <div className="space-y-4 text-left">
              {currentPlanDetails === "planA" ? (
                <>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>
                      Buy 9 bags of rice in 3 years to keep the container
                      forever
                    </li>
                    <li>
                      Refer 9 friends who make a purchase – keep the container
                    </li>
                    <li>Gap of 90 days = container is taken back</li>
                  </ul>
                </>
              ) : (
                <>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Refer friends using your unique link</li>
                    <li>They must sign up and buy rice</li>
                    <li>You get a free container + ₹50 cashback</li>
                  </ul>
                </>
              )}
            </div>
          ),
          onOk: () => setIsPlanDetailsModalOpen(false),
          okText: "Close",
          cancelButtonProps: { style: { display: "none" } },
        });
      } catch (error) {
        console.error("Error displaying plan details modal:", error);
      }
    }
  }, [isPlanDetailsModalOpen, currentPlanDetails]);

  useEffect(() => {
    const initializeCartPage = async () => {
      setIsLoading(true);
      setCoordinatesReady(false); // Reset coordinates readiness
      try {
        console.log("Initializing cart page...");
        await fetchAddresses();

        // Ensure selectedAddress has valid coordinates
        if (
          selectedAddress &&
          (!selectedAddress.latitude || !selectedAddress.longitude)
        ) {
          const fullAddress = `${selectedAddress.flatNo}, ${selectedAddress.landMark}, ${selectedAddress.address}, ${selectedAddress.pincode}`;
          console.log(
            "Fetching coordinates for selected address:",
            fullAddress
          );
          const coordinates = await getCoordinates(fullAddress);
          if (
            coordinates &&
            !isNaN(coordinates.lat) &&
            !isNaN(coordinates.lng)
          ) {
            const updatedAddress = {
              ...selectedAddress,
              latitude: coordinates.lat,
              longitude: coordinates.lng,
            };
            setSelectedAddress(updatedAddress);
            setCoordinatesReady(true); // Mark coordinates as ready
            // Optionally update backend with coordinates
            try {
              await customerApi.put(
                `${BASE_URL}/user-service/updateAddress/${selectedAddress.id}`,
                {
                  ...updatedAddress,
                  latitude: coordinates.lat.toString(),
                  longitude: coordinates.lng.toString(),
                  userId: customerId,
                }
              );
            } catch (error) {
              console.error("Error updating address with coordinates:", error);
            }
          } else {
            console.warn(
              "Could not fetch valid coordinates for address:",
              fullAddress
            );
            message.warning(
              "Unable to fetch coordinates for the selected address."
            );
            setSelectedAddress(null); // Reset to avoid invalid coordinates
            setCoordinatesReady(false);
          }
        } else if (
          selectedAddress &&
          selectedAddress.latitude &&
          selectedAddress.longitude
        ) {
          setCoordinatesReady(true); // Coordinates already valid
        } else {
          setCoordinatesReady(false); // No valid address
        }

        const [cartResponse, preference] = await Promise.all([
          fetchCartData(),
          fetchContainerPreference(),
        ]);
        console.log("Initialization complete - preference:", preference);
        setContainerPreference(preference);

        modalDisplayedRef.current = false;
        console.log("Free container modal is disabled");
      } catch (error) {
        console.error("Error initializing cart page:", error);
        message.error("Failed to load cart data. Please try again.");
        setCoordinatesReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCartPage();
  }, []);

  useEffect(() => {
    if (!cartData.length) {
      setComboPricing({
        active: false,
        display: null,
        catalogComboSubtotal: 0,
        bundlePrice: 0,
        savings: 0,
        nonComboSubtotal: 0,
        adjustedItemSubtotal: 0,
        incomplete: false,
      });
      return;
    }
    refreshComboPricing(cartData, regularCartItems);
  }, [cartData, regularCartItems, location.state]);

  useEffect(() => {
    const hasStockIssues = cartData.some(
      (item) => item.quantity === 0 || item.cartQuantity > item.quantity
    );
    setCheckoutError(hasStockIssues);
  }, [cartData]);

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      // Wait for the cart response before choosing a delivery API. Without
      // this guard, the old fee API can run once before Gold/Silver is identified.
      if (cartData.length === 0) {
        lastDeliveryFeeRequestKeyRef.current = "";
        return;
      }

      if (
        hasPreciousMetalItems() &&
        selectedAddress?.latitude !== undefined &&
        selectedAddress?.longitude !== undefined
      ) {
        setIsPreciousMetalDistanceFeeLoading(true);
        let distanceResult;
        try {
          distanceResult = await calculateDistanceDeliveryFee(
            selectedAddress.latitude,
            selectedAddress.longitude,
          );
        } finally {
          setIsPreciousMetalDistanceFeeLoading(false);
        }

        if (isPreciousMetalOnlyCart()) {
          setDeliveryFee(distanceResult.fee);
          setHandlingFee(0);
          setDeliveryFeeMessage(
            distanceResult.fee == null
              ? distanceResult.errorMessage || distanceResult.message || "Delivery fee will be calculated and collected at the time of delivery."
              : ""
          );
          return;
        }

        // A mixed Gold/Silver cart may use the normal fee API only up to 40 km.
        if (distanceResult.distance > PRECIOUS_METAL_MIXED_CART_FEE_DISTANCE_KM) {
          lastDeliveryFeeRequestKeyRef.current = "";
          setDeliveryFee(null);
          setHandlingFee(0);
          return;
        }
      }

      if (
        selectedAddress?.latitude !== undefined &&
        selectedAddress?.longitude !== undefined &&
        !isNaN(cartTotal)
      ) {
        const requestKey = `${selectedAddress.latitude}:${selectedAddress.longitude}:${cartTotal}`;
        if (lastDeliveryFeeRequestKeyRef.current === requestKey) return;
        lastDeliveryFeeRequestKeyRef.current = requestKey;

        setIsDeliveryFeeLoading(true);
        try {
          const result = await calculateDeliveryFee(
            selectedAddress.latitude,
            selectedAddress.longitude,
            cartTotal
          );
          setDeliveryFee(result.fee);
          setHandlingFee(result.handlingFee);
          setDeliveryFeeMessage("");
          console.log("Delivery fees calculated:", result);
        } finally {
          setIsDeliveryFeeLoading(false);
        }
      } else {
        lastDeliveryFeeRequestKeyRef.current = "";
      }
    };

    fetchDeliveryFee();
  }, [cartData, selectedAddress?.latitude, selectedAddress?.longitude, cartTotal]);

  const handleAddressChange = async (selectedAddress: Address) => {
    const fullAddress = `${selectedAddress?.flatNo}, ${selectedAddress?.landMark}, ${selectedAddress?.address}, ${selectedAddress?.pincode}`;
    const coordinates = await getCoordinates(fullAddress);

    if (!coordinates || isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
      message.error(
        "Unable to find location coordinates. Please check the address."
      );
      setCoordinatesReady(false);
      return { isWithin: false };
    }

    const withinRadius = await isWithinRadius(coordinates);
    console.log({ withinRadius });

    if (!withinRadius.isWithin && !hasPreciousMetalItems()) {
      Modal.error({
        title: "Delivery Unavailable",
        content: (
          <>
            <p>
              Sorry! We're unable to deliver to this address as it is{" "}
              {withinRadius.distanceInKm} km away, beyond our 25 km delivery
              radius. Please select another saved address within the radius or
              add a new one to proceed. We appreciate your understanding!
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="default" onClick={() => Modal.destroyAll()}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  Modal.destroyAll();
                  setIsAddressModalOpen(true);
                }}
              >
                Add New Address
              </Button>
            </div>
          </>
        ),
        footer: null,
      });
      setCoordinatesReady(false);
      return { ...withinRadius, isWithin: false };
    }

    setSelectedAddress({
      ...selectedAddress,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
    setCoordinatesReady(true); // Mark coordinates as ready
    return withinRadius;
  };

  const hasStockIssues = (): boolean => {
    const hasOutOfStockItems = cartData.some((item) => item.quantity === 0);
    if (hasOutOfStockItems) return true;

    const hasExceededStockItems = cartData.some((item) => {
      const quantity =
        item.status === "FREE"
          ? freeCartItems[item.itemId] || 0
          : regularCartItems[item.itemId] || 0;
      return quantity > item.quantity;
    });
    return hasExceededStockItems;
  };

  const isCheckoutDisabled = (): boolean => {
    return (
      !selectedAddress ||
      !cartData ||
      cartData.length === 0 ||
      (deliveryFee === null && !hasPreciousMetalItems()) ||
      hasStockIssues()
    );
  };

  const getCheckoutButtonLabel = (): string => {
    if (!selectedAddress) return "Select an Address to Proceed";
    if (!cartData || cartData.length === 0) return "Cart is Empty";
    if (deliveryFee === null && !hasPreciousMetalItems()) return "Delivery Not Available";
    if (hasStockIssues()) return "Cannot Checkout - Stock Issues";
    return "Proceed to Checkout";
  };

  const removeOutOfStockItems = async () => {
    try {
      const outOfStockItems = cartData.filter((item) => item.quantity === 0);

      for (const item of outOfStockItems) {
        await removeCartItem(item);
      }

      message.success("Out-of-stock items removed successfully.");
      await fetchCartData();
    } catch (error) {
      console.error("Failed to remove out-of-stock items:", error);
      message.error("Failed to remove out-of-stock items");
      await fetchCartData();
    }
  };

  const handleConfirmReferrals = async () => {
    if (selectedPlans.includes("planB") && mobileNumbers.length === 0) {
      message.error("Please add at least one referral mobile number");
      return;
    }

    setIsReferralModalVisible(false);

    const eligibility = checkEligibilityForContainer(cartData);
    if (!eligibility.eligible || !eligibility.containerType) {
      message.error("Something went wrong. Please try again.");
      return;
    }

    const res = await updateContainerPreference(selectedPlans, mobileNumbers);
    if (res) {
      try {
        await customerApi.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      await addContainerToCart(
        eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG"
      );
    }
  };

  const handlePlanOk = async () => {
    const freeContainer = cartData.find(
      (item) =>
        [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
          item.itemId
        ) && item.status === "FREE"
    );

    if (selectedPlan.length === 0) {
      Modal.confirm({
        title: "Decline Free Container?",
        content:
          "You haven't selected any plan. Are you sure you want to decline the free container offer?",
        okText: "Yes, Cancel",
        cancelText: "Go Back",
        onOk: async () => {
          try {
            await removeContainerFromCart();
            setIsPlanModalVisible(false);
            modalDisplayedRef.current = true;
          } catch (error) {
            console.error("Error declining container offer:", error);
            message.error("Failed to decline container offer");
          }
        },
      });
      return;
    }

    let successMessage = "";
    if (selectedPlan.includes("planA") && selectedPlan.includes("planB")) {
      successMessage = "Both Plan A and Plan B have been selected successfully";
    } else if (selectedPlan.includes("planA")) {
      successMessage = "Plan A has been selected successfully";
    } else if (selectedPlan.includes("planB")) {
      successMessage = "Plan B has been selected successfully";
    }

    message.success({
      content: successMessage,
      duration: 5,
    });

    setIsPlanModalVisible(false);
    modalDisplayedRef.current = true;

    if (freeContainer) {
      const containerType =
        freeContainer.itemId === CONTAINER_ITEM_IDS.HEAVY_BAG
          ? "HEAVY_BAG"
          : "LIGHT_BAG";

      if (selectedPlan.includes("planB")) {
        setMobileNumbers([]);
        setCurrentNumber("");
        setIsReferralModalVisible(true);
      } else {
        const success = await handleInterested(selectedPlan);
        if (success) {
          message.info("Free container is already in your cart.");
        }
      }
      return;
    }

    const eligibility = checkEligibilityForContainer(cartData);
    if (!eligibility.eligible || !eligibility.containerType) {
      message.error("Something went wrong. No eligible container found.");
      return;
    }

    if (selectedPlan.includes("planB")) {
      setMobileNumbers([]);
      setCurrentNumber("");
      setIsReferralModalVisible(true);
    } else {
      const success = await handleInterested(selectedPlan);
      if (success) {
        message.info("Free container added to your cart.");
      }
    }
  };

  const handlePlanCancel = async () => {
    Modal.confirm({
      title: "Decline Container Offer?",
      content:
        "Are you sure you want to decline the free container offer? You can always select this offer later from your cart.",
      okText: "Yes, Cancel",
      cancelText: "Stay",
      onOk: async () => {
        try {
          await removeContainerFromCart();
        } catch (error) {
          console.error("Error declining container offer:", error);
          message.error("Failed to decline container offer");
        }

        setIsPlanModalVisible(false);
      },
      onCancel: () => { },
    });
  };

  const totalGoldGst = cartData.reduce(
    (sum, item) => sum + (item.goldGst ?? 0),
    0
  );
  const chargesWithoutGoldGst = totalGstAmount - totalGoldGst;

  const catalogItemCost =
    cartData
      ?.filter((item) => item.status !== "FREE")
      .reduce(
        (acc, item) =>
          acc +
          parseFloat(item.itemPrice) * (regularCartItems[item.itemId] || 0),
        0,
      ) || 0;

  const itemCostSubtotal = comboPricing.active
    ? comboPricing.adjustedItemSubtotal
    : catalogItemCost;

  const itemTotalWithGstAndHandling =
    itemCostSubtotal +
    totalGstAmount +
    (cartData.length > 0 ? handlingFee || 0 : 0);

  return (
    <div className="flex flex-col min-h-screen">
      <style>
        {`
    .container-modal-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .container-modal-content h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .container-modal-content p {
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }
    .container-modal-content ul {
      padding-left: 20px;
      margin: 8px 0;
    }
    .container-modal-content li {
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .container-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px;
      border-top: 1px solid #e8e8e8;
      margin-top: 16px;
    }

    .silver-offer-modal .ant-modal-content {
      border-radius: 32px;
      overflow: hidden;
      padding: 0;
      box-shadow: 0 25px 60px -12px rgba(88, 28, 135, 0.25), 0 8px 24px -8px rgba(0,0,0,0.08);
      border: 1px solid rgba(196, 181, 253, 0.35);
      animation: modalGlow 3s ease-in-out infinite;
    }

    @keyframes modalGlow {
      0%, 100% {
        box-shadow: 0 25px 60px -12px rgba(88, 28, 135, 0.25), 0 0 0 0 rgba(168, 85, 247, 0.15);
      }
      50% {
        box-shadow: 0 25px 70px -10px rgba(88, 28, 135, 0.35), 0 0 0 10px rgba(168, 85, 247, 0.06);
      }
    }

    @keyframes shimmerSweep {
      0% { transform: translateX(-150%) skewX(-15deg); }
      100% { transform: translateX(250%) skewX(-15deg); }
    }

    .silver-offer-shine {
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
      animation: shimmerSweep 3.5s ease-in-out infinite;
      pointer-events: none;
    }

    .silver-offer-modal .ant-modal-close {
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .silver-offer-modal .ant-modal-close:hover {
      background: rgba(255,255,255,0.95);
    }

    .silver-offer-modal .ant-modal-body {
      padding: 0;
    }

    .premium-address-modal .ant-modal-content {
      border-radius: 28px;
      overflow: hidden;
      padding: 0;
      box-shadow: 0 25px 60px -15px rgba(88, 28, 135, 0.25), 0 10px 30px -10px rgba(0,0,0,0.1);
      border: 1px solid rgba(196, 181, 253, 0.4);
    }

    .premium-address-modal .ant-modal-body {
      padding: 0;
    }

    .premium-address-modal .ant-modal-header {
      display: none;
    }

    .address-custom-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .address-custom-scroll::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 9999px;
    }

    .address-custom-scroll::-webkit-scrollbar-thumb {
      background: #d8b4fe;
      border-radius: 9999px;
    }

    .address-custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #a855f7;
    }

    /* Prevent modal opening from causing layout shift / jumping */
    html {
      scrollbar-gutter: stable;
    }
    body {
      overflow-y: scroll;
    }
    body.ant-scrolling-effect,
    body[style*="overflow"] {
      overflow-y: scroll !important;
      width: 100% !important;
      padding-right: 0px !important;
      margin-right: 0px !important;
    }
  `}
      </style>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 pt-2 sm:pt-3 px-3 sm:px-5 pb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <main className="flex-1 min-w-0">
              {/* Top Banner Header with Image Background */}
              {cartData && cartData.length > 0 && (
                <div className="mb-4 relative rounded-2xl overflow-hidden border border-emerald-200/80 shadow-2xs min-h-[82px] sm:min-h-[92px] flex items-center bg-[#def4e4]">
                  {/* Background Image */}
                  <img
                    src={cart_banner}
                    alt="Cart Banner"
                    className="absolute inset-0 w-full h-full object-cover object-left sm:object-center pointer-events-none"
                  />

                  {/* Overlay Content positioned clearly to the right of the cart logo */}
                  <div className="relative z-10 pl-[5.5rem] sm:pl-24 md:pl-28 pr-2 sm:pr-4 py-2 sm:py-3 max-w-[82%] sm:max-w-[55%]">
                    <h2 className="text-sm sm:text-lg md:text-xl font-black text-gray-900 tracking-tight leading-tight">
                      My Cart <span className="text-emerald-950 font-bold">({cartData.length})</span>
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-700 mt-0.5 font-medium leading-snug">
                      Review your items, update quantity or remove items
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-3.5 sm:p-5 space-y-2.5 sm:space-y-3.5">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  </div>
                ) : !cartData || cartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <h2 className="text-xl font-bold mb-4">
                      Your cart is empty
                    </h2>
                    <button
                      onClick={() => navigate("/main/dashboard/products")}
                      className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-purple-500"
                    >
                      Browse items
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Mixed Cart Notice Banner */}
                    {hasPreciousMetalItems(cartData) && !isPreciousMetalOnlyCart(cartData) && (
                      <div className="p-3 sm:p-3.5 mb-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
                            ⚠️
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                              Gold & Silver Separate Order
                            </h4>
                            <p className="text-xs text-amber-800/90 font-medium leading-snug">
                              Gold & Silver items are ordered separately. General products will be removed at checkout.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNonPreciousMetalItems()}
                          className="w-full sm:w-auto shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer text-center"
                        >
                          Keep Gold/Silver Only
                        </button>
                      </div>
                    )}

                    {/* Unified Desktop Table Header Row */}
                    <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-bold text-gray-600 bg-gray-50/90 px-4 py-2.5 rounded-xl border border-gray-100 uppercase tracking-wider">
                      <div className="col-span-6 text-gray-700">Item</div>
                      <div className="col-span-2 text-center text-gray-700">Price</div>
                      <div className="col-span-2 text-center text-gray-700">Quantity</div>
                      <div className="col-span-2 text-right text-gray-700">Total</div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2.5 sm:space-y-0 sm:divide-y sm:divide-gray-100">
                      {cartData.map((item) => {
                        const itemQty =
                          item.status === "ADD"
                            ? regularCartItems[item.itemId] || item.cartQuantity || 1
                            : item.cartQuantity || 1;
                        const itemTotal = (
                          parseFloat(item.itemPrice || "0") * itemQty
                        ).toFixed(2);

                        return (
                          <React.Fragment key={item.itemId}>
                            {/* MOBILE VIEW (Card Layout) */}
                            <div className="block sm:hidden p-3.5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
                              {/* Row 1: Image & Name */}
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  onClick={() =>
                                    navigate(`/main/itemsdisplay/${item.itemId}`, {
                                      state: { item },
                                    })
                                  }
                                  className="w-16 h-16 rounded-xl bg-white border border-gray-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden cursor-pointer"
                                >
                                  {item.image ? (
                                    <img
                                      src={resolveAskoxyUrl(item.image)}
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
                                    className={`w-full h-full rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base ${
                                      item.image ? "hidden" : "flex"
                                    }`}
                                  >
                                    {item.itemName ? item.itemName.charAt(0).toUpperCase() : "🛒"}
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  {item.quantity < 6 && item.quantity > 0 && (
                                    <p className="text-[10px] text-red-500 font-bold leading-none mb-0.5">
                                      Only {item.quantity} left
                                    </p>
                                  )}
                                  <h4
                                    onClick={() =>
                                      navigate(`/main/itemsdisplay/${item.itemId}`, {
                                        state: { item },
                                      })
                                    }
                                    className="font-semibold text-sm text-purple-900 leading-snug break-words hover:text-purple-700 cursor-pointer"
                                  >
                                    {item.itemName}
                                  </h4>
                                  {(item.weight || item.units) && (
                                    <div className="text-sm font-semibold text-purple-700 mt-0.5">
                                      {item.weight} {item.units}
                                    </div>
                                  )}
                                  {comboPricing.active &&
                                    isComboItemInCart(
                                      item.itemId,
                                      comboPricing.display,
                                    ) && (
                                      <Tag color="purple" className="text-[10px] mt-0.5 font-medium">
                                        Combo offer item
                                      </Tag>
                                    )}
                                </div>
                              </div>

                              {/* Row 2: Price, Stepper & Total */}
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                                {/* Price */}
                                <div className="flex items-baseline gap-1.5 shrink-0">
                                  <span className="text-base font-bold text-purple-900">
                                    ₹{item.itemPrice}
                                  </span>
                                  {item.priceMrp && Number(item.priceMrp) > 0 && (
                                    <span className="text-xs line-through text-gray-400">
                                      ₹{item.priceMrp}
                                    </span>
                                  )}
                                </div>

                                {/* Stepper */}
                                <div className="flex items-center justify-center">
                                  {item.quantity === 0 ? (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                                      OUT OF STOCK
                                    </span>
                                  ) : item.status === "ADD" ? (
                                    <div className="flex items-center h-8 border border-purple-300 bg-purple-50/40 rounded-xl overflow-hidden shadow-2xs">
                                      <button
                                        onClick={() => handleDecrease(item)}
                                        disabled={loadingItems[item.itemId]}
                                        className="w-7 h-7 flex items-center justify-center text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <div className="px-1.5 min-w-[24px] text-center">
                                        {loadingItems[item.itemId] ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 inline" />
                                        ) : (
                                          <span className="text-xs font-bold text-purple-900">
                                            {regularCartItems[item.itemId] || 0}
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => {
                                          if (
                                            (regularCartItems[item.itemId] || 0) <
                                            item.quantity
                                          ) {
                                            handleIncrease(item);
                                          }
                                        }}
                                        disabled={
                                          (regularCartItems[item.itemId] || 0) >=
                                            item.quantity ||
                                          loadingItems[item.itemId]
                                        }
                                        className={`w-7 h-7 flex items-center justify-center text-purple-700 hover:bg-purple-100 ${
                                          (regularCartItems[item.itemId] || 0) >=
                                          item.quantity
                                            ? "opacity-40 cursor-not-allowed"
                                            : ""
                                        }`}
                                        aria-label="Increase quantity"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <Tag
                                        color={item.status === "FREE" ? "green" : "blue"}
                                        className="text-[11px] font-bold"
                                      >
                                        {item.status === "FREE" ? "FREE" : "COMBO"}
                                      </Tag>
                                      <div className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center">
                                        {item.cartQuantity}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Total */}
                                <div className="text-right shrink-0">
                                  <span className="text-base font-bold text-purple-950">
                                    {isFreeItem(item) ? (
                                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        FREE
                                      </span>
                                    ) : (
                                      `₹${itemTotal}`
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Row 3: Savings */}
                              {typeof item.saveAmount === "number" && item.saveAmount > 0 && (
                                <div className="text-sm font-bold text-emerald-600 pt-0.5">
                                  Save ₹{Number(item.saveAmount).toFixed(2)} ({item.savePercentage ?? 0}% OFF)
                                </div>
                              )}
                            </div>

                            {/* DESKTOP VIEW (Table Row) */}
                            <div className="hidden sm:grid py-4 first:pt-1 grid-cols-12 gap-2 sm:gap-3 items-center">
                              {/* Col 1: Item Thumbnail & Details */}
                              <div className="col-span-6 flex items-center gap-3 sm:gap-4 min-w-0">
                                <div
                                  onClick={() =>
                                    navigate(`/main/itemsdisplay/${item.itemId}`, {
                                      state: { item },
                                    })
                                  }
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-purple-100 p-1.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden cursor-pointer hover:shadow-md hover:border-purple-300 transition-all"
                                >
                                  {item.image ? (
                                    <img
                                      src={resolveAskoxyUrl(item.image)}
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
                                    className={`w-full h-full rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg sm:text-xl ${
                                      item.image ? "hidden" : "flex"
                                    }`}
                                  >
                                    {item.itemName ? item.itemName.charAt(0).toUpperCase() : "🛒"}
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  {item.quantity < 6 && item.quantity > 0 && (
                                    <p className="text-[10px] sm:text-xs text-red-500 font-bold leading-none mb-1">
                                      Only {item.quantity} left
                                    </p>
                                  )}
                                  <h4
                                    onClick={() =>
                                      navigate(`/main/itemsdisplay/${item.itemId}`, {
                                        state: { item },
                                      })
                                    }
                                    className="font-normal text-sm sm:text-base text-gray-900 leading-snug break-words hover:text-purple-700 cursor-pointer transition-colors"
                                    title={item.itemName}
                                  >
                                    {item.itemName}
                                  </h4>
                                  {(item.weight || item.units) && (
                                    <div className="text-sm sm:text-base font-semibold text-purple-700 mt-1">
                                      {item.weight} {item.units}
                                    </div>
                                  )}
                                  {comboPricing.active &&
                                    isComboItemInCart(
                                      item.itemId,
                                      comboPricing.display,
                                    ) && (
                                      <Tag color="purple" className="text-[10px] mt-1 font-semibold">
                                        Combo offer item
                                      </Tag>
                                    )}
                                  {typeof item.saveAmount === "number" && item.saveAmount > 0 && (
                                    <div className="text-sm sm:text-base font-bold text-emerald-600 mt-1">
                                      Save ₹{Number(item.saveAmount).toFixed(2)} ({item.savePercentage ?? 0}% OFF)
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Col 2: Price */}
                              <div className="col-span-2 text-center">
                                <span className="text-sm sm:text-base font-bold text-gray-900 block">
                                  ₹{item.itemPrice}
                                </span>
                                {item.priceMrp && Number(item.priceMrp) > 0 && (
                                  <span className="text-[11px] sm:text-xs line-through text-gray-400 block mt-0.5">
                                    ₹{item.priceMrp}
                                  </span>
                                )}
                              </div>

                              {/* Col 3: Quantity Controls */}
                              <div className="col-span-2 flex items-center justify-center">
                                {item.quantity === 0 ? (
                                  <span className="text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg text-center">
                                    OUT OF STOCK
                                  </span>
                                ) : item.status === "ADD" ? (
                                  <div className="flex items-center h-8 sm:h-9 border border-purple-200 bg-purple-50/60 rounded-xl overflow-hidden shadow-2xs">
                                    <button
                                      onClick={() => handleDecrease(item)}
                                      disabled={loadingItems[item.itemId]}
                                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="px-1 sm:px-2 min-w-[24px] sm:min-w-[28px] text-center">
                                      {loadingItems[item.itemId] ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 inline" />
                                      ) : (
                                        <span className="text-xs sm:text-sm font-black text-purple-900">
                                          {regularCartItems[item.itemId] || 0}
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => {
                                        if (
                                          (regularCartItems[item.itemId] || 0) <
                                          item.quantity
                                        ) {
                                          handleIncrease(item);
                                        }
                                      }}
                                      disabled={
                                        (regularCartItems[item.itemId] || 0) >=
                                          item.quantity ||
                                        loadingItems[item.itemId]
                                      }
                                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-purple-700 hover:bg-purple-100 transition-colors ${
                                        (regularCartItems[item.itemId] || 0) >=
                                        item.quantity
                                          ? "opacity-40 cursor-not-allowed"
                                          : ""
                                      }`}
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <Tag
                                      color={
                                        item.status === "FREE" ? "green" : "blue"
                                      }
                                      className="text-[11px] font-bold"
                                    >
                                      {item.status === "FREE" ? "FREE" : "COMBO"}
                                    </Tag>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm flex items-center justify-center">
                                      {item.cartQuantity}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Col 4: Total */}
                              <div className="col-span-2 text-right">
                                <span className="text-sm sm:text-base font-black text-purple-950 block">
                                  {isFreeItem(item) ? (
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                      FREE
                                    </span>
                                  ) : (
                                    `₹${itemTotal}`
                                  )}
                                </span>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </main>

            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:sticky lg:top-4 self-start">
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6 border border-gray-200">
                <div className="flex items-center justify-between w-full min-w-0 mb-3.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      Delivery Address
                    </h2>
                  </div>

                  {addresses.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setIsAddressSelectModalOpen(true)}
                      aria-label="Change delivery address"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
               bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs sm:text-sm font-semibold
               transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
                    >
                      Change/Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        resetAddressForm();
                        setIsAddressModalOpen(true);
                      }}
                      aria-label="Add delivery address"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
               bg-green-600 text-white text-xs sm:text-sm font-medium whitespace-nowrap
               shadow-sm hover:bg-green-700 active:bg-green-800 
               focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 cursor-pointer"
                    >
                      <span className="text-base leading-none font-bold">+</span>
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {selectedAddress ? (
                  <div className="bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 border border-purple-200 rounded-xl p-3.5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/90 border border-purple-200 px-2 py-0.5 rounded-md">
                        {selectedAddress.addressType === "Work" ? (
                          <Briefcase className="w-3 h-3" />
                        ) : selectedAddress.addressType === "Others" ? (
                          <Building className="w-3 h-3" />
                        ) : (
                          <Home className="w-3 h-3" />
                        )}
                        {selectedAddress.addressType || "Home"}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {/flat|house|h\.no|door|plot/i.test(selectedAddress.flatNo)
                          ? selectedAddress.flatNo
                          : `House / Flat: ${selectedAddress.flatNo}`}
                      </span>
                    </div>
                    <p className="text-[14px] leading-relaxed text-gray-600 font-normal break-words">
                      {[
                        selectedAddress.landMark,
                        selectedAddress.address,
                        `PIN: ${selectedAddress.pincode}`,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 px-3 border border-dashed border-gray-300 rounded-xl bg-gray-50/60">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">
                      No delivery address selected.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (addresses.length > 0) {
                          setIsAddressSelectModalOpen(true);
                        } else {
                          resetAddressForm();
                          setIsAddressModalOpen(true);
                        }
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline cursor-pointer"
                    >
                      {addresses.length > 0 ? "Select from saved addresses" : "+ Add a delivery address"}
                    </button>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="mb-2">
                    <button
                      className="w-full flex justify-between items-center text-gray-700 font-semibold text-sm"
                      onClick={() =>
                        setIsItemTotalDropdownOpen((prev) => !prev)
                      }
                      aria-expanded={isItemTotalDropdownOpen}
                    >
                      <div className="flex items-center">
                        <span className="border-b border-dashed border-gray-400 pb-1">
                          Item Total & GST
                        </span>
                        <RiArrowDropDownLine
                          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isItemTotalDropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                      <span>₹{Number(itemTotalWithGstAndHandling).toFixed(2)}</span>
                    </button>
                    {isItemTotalDropdownOpen && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Item Cost</span>
                          <span>₹{itemCostSubtotal.toFixed(2)}</span>
                        </div>
                        {comboPricing.active && comboPricing.savings > 0 && (
                          <div className="flex justify-between text-emerald-700 text-sm mt-1">
                            <span>Combo offer savings</span>
                            <span>-₹{comboPricing.savings.toFixed(2)}</span>
                          </div>
                        )}
                        {chargesWithoutGoldGst > 0 && (
                          <div className="flex justify-between text-gray-700 text-sm mt-1">
                            <span>Making Charges</span>
                            <span>
                              ₹
                              {chargesWithoutGoldGst.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}

                        {totalGoldGst > 0 && (
                          <div className="flex justify-between text-gray-700 text-sm mt-1">
                            <span>{silverGst > 0 ? "Gold GST (3%)" : "GST (3%)"}</span>
                            <span>₹{totalGoldGst.toFixed(2)}</span>
                          </div>
                        )}

                        {silverGst > 0 && (
                          <div className="flex justify-between text-gray-700 text-sm mt-1">
                            <span>Silver GST (3%)</span>
                            <span>₹{silverGst.toFixed(2)}</span>
                          </div>
                        )}

                        {silverDiscount > 0 && (
                          <div className="flex justify-between text-emerald-700 text-sm mt-1 font-medium items-center">
                            <span className="flex items-center gap-1">
                              Discount
                              <Tooltip title="Silver Discount (100% GST Waived)">
                                <Info className="w-3.5 h-3.5 text-emerald-600 cursor-pointer hover:text-emerald-800" />
                              </Tooltip>
                            </span>
                            <span className="font-bold">-₹{silverDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        {cartData.length > 0 && ( // Conditionally render handling fee
                          <div className="flex justify-between text-gray-700 text-sm mt-1">
                            <span>Handling Fee</span>
                            <span>₹{(handlingFee || 0).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {cartData.length > 0 && (
                    isPreciousMetalDistanceFeeLoading || isDeliveryFeeLoading ? (
                      <div className="mb-2 flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculating delivery charges…
                      </div>
                    ) : deliveryFee === null && isPreciousMetalOnlyCart() ? (
                      <div className="mb-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                        {deliveryFeeMessage || "Delivery fee will be calculated and collected at the time of delivery."}
                      </div>
                    ) : (
                      <div className="flex justify-between mb-2 text-gray-700">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">
                          {deliveryFee === null
                            ? "N/A"
                            : `₹${Number(deliveryFee || 0).toFixed(2)}`}
                        </span>
                      </div>
                    )
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between text-gray-800 font-bold text-lg">
                      <div className="flex flex-col">
                        <span>To Pay</span>
                        <span className="text-sm text-gray-600 font-medium">
                          (incl. of all taxes and fees)
                        </span>
                      </div>
                      <span>
                        ₹
                        {(() => {
                          const itemTotal =
                            cartData
                              ?.filter((item) => item.status !== "FREE")
                              .reduce(
                                (acc, item) =>
                                  acc +
                                  parseFloat(item.itemPrice) *
                                  (regularCartItems[item.itemId] || 0),
                                0
                              ) || 0;

                          const deliveryFeeTotal =
                            cartData?.length > 0 ? deliveryFee || 0 : 0;
                          const handlingFeeTotal =
                            cartData?.length > 0 ? handlingFee || 0 : 0; // Only include handlingFee if cart has items

                          return Number(
                            itemTotal +
                            totalGstAmount +
                            deliveryFeeTotal +
                            handlingFeeTotal
                          ).toFixed(2);
                        })() || "0.00"}
                      </span>
                    </div>
                  </div>

                  {cartData?.some((item) => item.quantity === 0) && (
                    <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">
                      <p className="font-semibold">
                        Some items in your cart are out of stock:
                      </p>
                      <ul className="ml-4 mt-1 list-disc">
                        {cartData
                          .filter((item) => item.quantity === 0)
                          .map((item) => (
                            <li key={item.itemId}>
                              {item.itemName} is out of stock
                            </li>
                          ))}
                      </ul>
                      <p className="mt-2 text-sm">
                        Please remove these items to proceed with checkout.
                      </p>
                      <button
                        onClick={removeOutOfStockItems}
                        className="mt-2 w-full bg-red-600 text-white text-sm py-1 px-3 rounded"
                      >
                        Remove all out-of-stock items
                      </button>
                    </div>
                  )}
                  {cartData?.some(
                    (item) =>
                      item.cartQuantity > item.quantity && item.quantity > 0
                  ) && (
                      <div className="mb-3 p-3 bg-yellow-100 text-yellow-700 rounded">
                        <p className="font-semibold">
                          Quantity adjustments needed:
                        </p>
                        <ul className="ml-4 mt-1 list-disc">
                          {cartData
                            .filter(
                              (item) =>
                                item.cartQuantity > item.quantity &&
                                item.quantity > 0
                            )
                            .map((item) => (
                              <li key={item.itemId}>
                                {item.itemName} - Only {item.quantity} in stock
                                (you have {item.cartQuantity})
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  {cartData?.some(
                    (item) =>
                      item.cartQuantity > item.quantity && item.quantity > 0
                  ) && (
                      <div className="mb-3 p-3 bg-yellow-100 text-yellow-700 rounded">
                        <p className="font-semibold">
                          Quantity adjustments needed:
                        </p>
                        <ul className="ml-4 mt-1 list-disc">
                          {cartData
                            .filter(
                              (item) =>
                                item.cartQuantity > item.quantity &&
                                item.quantity > 0
                            )
                            .map((item) => (
                              <li key={item.itemId}>
                                {item.itemName} - Only {item.quantity} in stock
                                (you have {item.cartQuantity})
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  <button
                    className={`w-full py-3 px-6 rounded-lg transition ${isCheckoutDisabled()
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gradient-to-r from-purple-700 to-purple-500 hover:bg-purple-800 text-white"
                      }`}
                    onClick={() => handleToProcess()}
                    disabled={isCheckoutDisabled()}
                  >
                    {getCheckoutButtonLabel()}
                  </button>
                </div>
              </div>
            </div>

            {isAddressModalOpen && (
              <Modal
                open={isAddressModalOpen}
                onCancel={handleAddressModalClose}
                footer={null}
                centered
                width={520}
                closeIcon={null}
                className="premium-address-modal"
              >
                <div className="relative">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white p-5 sm:p-6 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute left-1/3 -bottom-10 w-40 h-20 rounded-full bg-pink-400/20 blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                          {editingAddressId ? (
                            <MapPin className="w-5 h-5 text-white" />
                          ) : (
                            <Plus className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
                          </h3>
                          <p className="text-xs text-purple-100 font-medium mt-0.5">
                            Please provide complete details for timely delivery
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddressModalClose}
                        aria-label="Close modal"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-5 sm:p-6 bg-gradient-to-b from-gray-50/40 to-white space-y-4">
                    {addressFormData.address && (
                      <div className="p-3 bg-purple-50/80 border border-purple-100 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-7 w-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                              YOUR LOCATION
                            </span>
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {addressFormData.address}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenMapPicker}
                          className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Use your current location or manually Select location on map to guide delivery partners.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isFetchingLocation}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-purple-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isFetchingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600 shrink-0" />
                        ) : (
                          <MapPinned className="h-4 w-4 text-purple-600 shrink-0" />
                        )}
                        <span className="whitespace-nowrap">{isFetchingLocation ? "Detecting location…" : "Use your current location"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenMapPicker}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50/80 text-purple-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
                      >
                        <Map className="h-4 w-4 text-purple-600 shrink-0" />
                        <span className="whitespace-nowrap">Select location on Map</span>
                      </button>
                    </div>
                    {locationStatus && locationStatus.type !== "info" && (
                      <p
                        className={`mt-2 text-xs font-medium text-center ${
                          locationStatus.type === "error"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {locationStatus.message}
                      </p>
                    )}

                    {/* Divider OR */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="w-full border-t border-gray-200"></div>
                      <span className="absolute bg-white px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        OR
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/80 mb-1.5">
                        Flat / House / Door No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 402, House No 12-3, Door No 5"
                        value={addressFormData.flatNo}
                        onChange={(e) =>
                          setAddressFormData((prev) => ({
                            ...prev,
                            flatNo: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-2xs"
                      />
                      {addressFormErrors.flatNo && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {addressFormErrors.flatNo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/80 mb-1.5">
                        Landmark <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near City Hospital, Opposite Metro Station"
                        value={addressFormData.landMark}
                        onChange={(e) => {
                          setAddressFormData((prev) => ({
                            ...prev,
                            landMark: e.target.value,
                          }));
                          clearDetectedCoordinates();
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-2xs"
                      />
                      {addressFormErrors.landmark && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {addressFormErrors.landmark}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/80 mb-1.5">
                        Complete Address / Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Road No 2, Banjara Hills"
                        value={addressFormData.address}
                        onChange={(e) => {
                          setAddressFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }));
                          clearDetectedCoordinates();
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-2xs"
                      />
                      {addressFormErrors.address && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {addressFormErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/80 mb-1.5">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 500081"
                          maxLength={6}
                          value={addressFormData.pincode}
                          onChange={(e) => {
                            setAddressFormData((prev) => ({
                              ...prev,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                            }));
                            clearDetectedCoordinates();
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-2xs"
                        />
                        {addressFormErrors.pincode && (
                          <p className="text-red-500 text-xs mt-1 font-medium">
                            {addressFormErrors.pincode}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/80 mb-1.5">
                          Address Type
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { type: "Home", icon: Home },
                            { type: "Work", icon: Briefcase },
                            { type: "Others", icon: Building },
                          ].map(({ type, icon: Icon }) => {
                            const isSelected = addressFormData.addressType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  setAddressFormData((prev) => ({
                                    ...prev,
                                    addressType: type as "Home" | "Work" | "Others",
                                  }))
                                }
                                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                  isSelected
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-xs"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50/40"
                                }`}
                              >
                                <Icon className="w-3 h-3 shrink-0" />
                                <span>{type}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {error}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleAddressModalClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddressSubmit}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-200 hover:shadow-lg transition-all cursor-pointer"
                      >
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {isReferralModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Refer Friends</h2>
                    <button
                      onClick={handleReferralCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Enter mobile numbers of friends to refer (Plan B).
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter mobile number"
                        value={currentNumber}
                        onChange={(e) => setCurrentNumber(e.target.value)}
                        maxLength={10}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <Button
                        type="primary"
                        onClick={handleAddNumber}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Add
                      </Button>
                    </div>
                    {mobileNumbers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Added Numbers:</p>
                        <div className="space-y-1">
                          {mobileNumbers.map((number, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                            >
                              <span>{number}</span>
                              <Button
                                type="link"
                                onClick={() => handleRemoveNumber(index)}
                                className="text-red-500"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button
                      onClick={handleReferralCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleConfirmReferrals}
                      className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(isPlanModalVisible || forcePlanModalDisplay) && (
              <Modal
                title="Choose Your Free Container Plan"
                open={isPlanModalVisible || forcePlanModalDisplay}
                onOk={handlePlanOk}
                onCancel={handlePlanCancel}
                okText="Confirm"
                cancelText="Cancel"
                footer={
                  <div className="container-modal-footer">
                    <Button
                      key="cancel"
                      onClick={handlePlanCancel}
                      className="bg-gray-300 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      key="submit"
                      type="primary"
                      onClick={handlePlanOk}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Confirm
                    </Button>
                  </div>
                }
                className="container-modal"
              >
                <div className="container-modal-content">
                  <div>
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPlan.includes("planA")}
                        onChange={() => {
                          setSelectedPlan((prev) =>
                            prev.includes("planA")
                              ? prev.filter((p) => p !== "planA")
                              : [...prev, "planA"]
                          );
                        }}
                        className="mt-1"
                      />
                      <div>
                        <h3>Plan A: Free Steel Container Policy</h3>
                        <p>
                          Get a free steel container with your rice purchase,
                          subject to our policy.
                        </p>
                        <ul className="list-disc pl-5">
                          <li>
                            Buy 9 bags of rice in 3 years to keep the container
                            forever.
                          </li>
                          <li>
                            Refer 9 friends who make a purchase – keep the
                            container.
                          </li>
                          <li>Gap of 90 days = container is taken back.</li>
                        </ul>
                        <Button
                          type="link"
                          onClick={() => {
                            setCurrentPlanDetails("planA");
                            setIsPlanDetailsModalOpen(true);
                          }}
                          className="p-0 text-purple-500"
                        >
                          <Info size={16} className="inline mr-1" />
                          View Details
                        </Button>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPlan.includes("planB")}
                        onChange={() => {
                          setSelectedPlan((prev) =>
                            prev.includes("planB")
                              ? prev.filter((p) => p !== "planB")
                              : [...prev, "planB"]
                          );
                        }}
                        className="mt-1"
                      />
                      <div>
                        <h3>Plan B: Referral Program</h3>
                        <p>Earn a free container by referring friends.</p>
                        <ul className="list-disc pl-5">
                          <li>Refer friends using your unique link.</li>
                          <li>They must sign up and buy rice.</li>
                          <li>You get a free container + ₹50 cashback.</li>
                        </ul>
                        <Button
                          type="link"
                          onClick={() => {
                            setCurrentPlanDetails("planB");
                            setIsPlanDetailsModalOpen(true);
                          }}
                          className="p-0 text-purple-500"
                        >
                          <Info size={16} className="inline mr-1" />
                          View Details
                        </Button>
                      </div>
                    </label>
                  </div>
                </div>
              </Modal>
            )}
            {/* {coordinatesReady &&
          selectedAddress?.latitude &&
          selectedAddress?.longitude ? (
            <DeliveryFee
              userLat={selectedAddress.latitude}
              userLng={selectedAddress.longitude}
              cartAmount={ cartTotal }
              onFeeCalculated={(fee,handlingFee) =>handlingFeeCalculation(fee,handlingFee)}
            />
          ) : null} */}
          </div>
        </div>
      </div>
      <Footer />

      {/* Silver GST Waiver Congratulations Modal */}
      <Modal
        open={showSilverGstModal}
        onCancel={() => setShowSilverGstModal(false)}
        footer={null}
        centered
        width={420}
        style={{ maxWidth: "calc(100vw - 32px)", margin: "0 auto" }}
        closeIcon={<X className="w-4 h-4 text-slate-500" />}
        className="silver-offer-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-purple-50 via-white to-amber-50/40 ring-1 ring-purple-200/60"
        >
          <div className="silver-offer-shine" />

          {/* Soft glow background blobs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-200/50 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-amber-200/40 blur-3xl pointer-events-none"
          />

          {/* Floating animated sparkles */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 15, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 left-7 text-purple-400 pointer-events-none"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute top-8 right-8 text-amber-400 pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <div className="relative pt-8 pb-6 px-6 text-center">
            {/* Animated Glowing Celebration Icon */}
            <div className="relative mx-auto mb-3.5 w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#a855f7,#f59e0b,#a855f7)] opacity-60 blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 to-amber-300"
              />
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-200"
              >
                <PartyPopper className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            {/* Highlighted Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight"
            >
              GST & Making Charges on Us 🎉
            </motion.h2>

            {/* Sub-headline Statement Card (Emerald Green Theme) */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl py-2.5 px-3.5 mb-3.5 text-center shadow-xs"
            >
              <p className="text-sm font-black text-emerald-950 leading-snug">
                ✨ Exclusive for <span className="text-emerald-700 underline decoration-emerald-400 decoration-2">Silver Purchases</span>
              </p>
              <p className="text-xs font-semibold text-emerald-800/90 mt-0.5">
                Zero Making Charges + 100% GST Covered by Askoxy.ai!
              </p>
            </motion.div>

            {/* Dashed GST & Making Charges Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-3.5 mb-3.5 text-left space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-medium">GST (3%)</span>
                <span className="font-bold text-slate-900">
                  ₹{(silverDiscount || silverGst).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-medium">Making Charges</span>
                <span className="font-bold text-emerald-700">₹0</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-slate-900">Askoxy.ai GST Waiver:</span>
                </div>
                <span className="text-sm font-black text-emerald-600">
                  -₹{(silverDiscount || silverGst).toFixed(2)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-2.5 py-1.5 font-medium">
                <span>Your Net Extra Charges</span>
                <span className="font-bold text-emerald-700">₹0.00 (Zero Extra Tax)</span>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-4 flex-wrap"
            >
              <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-800">
                <Gem className="w-3.5 h-3.5 text-purple-600" />
                Valid Only on Silver
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Tax Covered
              </span>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, boxShadow: "0 12px 24px -8px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSilverGstModal(false)}
              className="relative overflow-hidden w-full py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 shadow-lg shadow-purple-200 transition-all cursor-pointer"
            >
              <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              Awesome, Got It!
            </motion.button>
          </div>
        </motion.div>
      </Modal>

      {/* Select Delivery Address Modal */}
      <Modal
        open={isAddressSelectModalOpen}
        onCancel={() => setIsAddressSelectModalOpen(false)}
        footer={null}
        centered
        width={540}
        closeIcon={null}
        className="premium-address-modal"
      >
        <div className="relative">
          {/* Vibrant Medium Purple Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 -bottom-10 w-40 h-20 rounded-full bg-pink-400/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Select Delivery Address
                  </h3>
                  <p className="text-xs text-purple-100 font-medium mt-0.5">
                    Choose where you want your order delivered
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressSelectModalOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 bg-gradient-to-b from-gray-50/40 to-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900/70">
                Saved Addresses ({addresses.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddressSelectModalOpen(false);
                  resetAddressForm();
                  setIsAddressModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-3.5 py-1.5 rounded-full shadow-sm shadow-purple-200 hover:shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-10 px-4 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/40">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <MapPin className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1">
                  No saved addresses found
                </h4>
                <p className="text-xs text-gray-500 mb-5 max-w-xs mx-auto">
                  Add your delivery address to proceed with your order smoothly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressSelectModalOpen(false);
                    resetAddressForm();
                    setIsAddressModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-purple-200 transition-all cursor-pointer"
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="address-custom-scroll space-y-3 max-h-[380px] overflow-y-auto pr-1.5 py-1">
                {addresses.map((address) => {
                  const isSelected = selectedAddress?.id === address.id;
                  return (
                    <div
                      key={address.id}
                      onClick={async () => {
                        await handleAddressChange(address);
                        setIsAddressSelectModalOpen(false);
                      }}
                      className={`group cursor-pointer w-full text-left rounded-2xl p-4 transition-all duration-200 flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border-2 border-purple-500 shadow-sm ring-2 ring-purple-300/30"
                          : "bg-white hover:bg-purple-50/30 border border-gray-200 hover:border-purple-300 hover:shadow-xs"
                      }`}
                    >
                      {/* Radio / Selection Indicator */}
                      <div className="mt-0.5 shrink-0">
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-purple-600 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs"
                              : "border-gray-300 bg-white group-hover:border-purple-400"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          )}
                        </span>
                      </div>

                      {/* Address Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              address.addressType === "Work"
                                ? "text-indigo-700 bg-indigo-100/90 border-indigo-200/80"
                                : address.addressType === "Others"
                                ? "text-amber-800 bg-amber-100/90 border-amber-200/80"
                                : "text-purple-700 bg-purple-100/90 border-purple-200/80"
                            }`}
                          >
                            {address.addressType === "Work" ? (
                              <Briefcase className="w-3 h-3" />
                            ) : address.addressType === "Others" ? (
                              <Building className="w-3 h-3" />
                            ) : (
                              <Home className="w-3 h-3" />
                            )}
                            {address.addressType || "Home"}
                          </span>

                          <span className="text-sm font-bold text-gray-800">
                            {/flat|house|h\.no|door|plot/i.test(address.flatNo)
                              ? address.flatNo
                              : `House / Flat: ${address.flatNo}`}
                          </span>

                          {isSelected && (
                            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Delivering Here
                            </span>
                          )}
                        </div>

                        <p className="text-[14px] leading-relaxed text-gray-600 font-normal break-words">
                          {[
                            address.landMark,
                            address.address,
                            `PIN: ${address.pincode}`,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <LocationMapPicker
        isOpen={isMapPickerOpen}
        onClose={handleMapPickerClose}
        onConfirmLocation={handleMapLocationConfirmed}
        initialCoords={detectedCoordinates}
      />
    </div>
  );
};

export default CartPage;
