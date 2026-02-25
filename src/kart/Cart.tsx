import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { isWithinRadius } from "./LocationCheck";
import { Button, message, Modal, Input, Tag } from "antd";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";
// import DeliveryFee from "./DeliveryFee";
import { calculateDeliveryFee } from "./DeliveryFee";
import { RiArrowDropDownLine } from "react-icons/ri";

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
  const [isItemTotalDropdownOpen, setIsItemTotalDropdownOpen] =
    useState<boolean>(false);
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

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { setCount } = context;

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedAddresses = response.data;
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

      const response = await axios.post(
        `${BASE_URL}/reference-service/referenceoffer`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
      onCancel: () => {},
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
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

        await axios.delete(
          `${BASE_URL}/cart-service/cart/removeFreeContainer`,
          {
            data: {
              id: containerItem.cartId,
              customerId,
              itemId: containerItem.itemId,
              status: "FREE",
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
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

      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        setCartTotal(
          cartWithFreeItems.reduce(
            (total: number, item: CartItem) =>
              total + (item.itemPrice ? parseFloat(item.itemPrice) : 0),
            0
          )
        );
        setTotalGstAmount(response.data.totalGstAmountToPay || 0); // Set the total GST amount
        setSaveAmount(response.data.saveAmount || 0);
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
    if (!addressFormData.pincode.trim())
      errors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(addressFormData.pincode))
      errors.pincode = "Please enter a valid 6-digit PIN code";

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
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        message.error(
          "Unable to find location coordinates. Please check the address."
        );
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      console.log({ withinRadius });

      if (!withinRadius.isWithin) {
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
        await axios.put(
          `${BASE_URL}/user-service/updateAddress/${editingAddressId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Address updated successfully.", 5);
      } else {
        await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      setError(apiError.response?.data?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
      setIsAddressModalOpen(false);
      setSuccessMessage("");
      setError("");
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

      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: item.itemId,
          status: isFreeItem ? "FREE" : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

        await axios.patch(
          `${BASE_URL}/cart-service/cart/minusCartItem`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemId: item.itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
        await axios.delete(
          `${BASE_URL}/cart-service/cart/removeFreeContainer`,
          {
            data: {
              id: cartIdToRemove,
              customerId,
              itemId: itemIdToRemove,
              status: "FREE",
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: {
            id: cartIdToRemove,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
    if (isCheckoutDisabled()) {
      Modal.error({
        title: "Stock Issues",
        content:
          "Unable to proceed with checkout. Please remove out-of-stock items or adjust quantities to match available stock.",
      });
      return;
    }

    if (!cartData || cartData.length === 0) {
      message.error("Your cart is empty, Please Add At least one Item");
      return;
    }

    if (!selectedAddress) {
      message.error("Please select an address");
      return;
    }

    if (deliveryFee === null) {
      message.error("Delivery is not available for the selected address");
      return;
    }

    const isAddressValid = await handleAddressChange(selectedAddress);
    if (isAddressValid?.isWithin) {
      navigate("/main/checkout", { state: { selectedAddress, deliveryFee } });
    }
  };

  const handleAddressModalClose = () => {
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
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "declined",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
              await axios.put(
                `${BASE_URL}/user-service/updateAddress/${selectedAddress.id}`,
                {
                  ...updatedAddress,
                  latitude: coordinates.lat.toString(),
                  longitude: coordinates.lng.toString(),
                  userId: customerId,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
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
    const hasStockIssues = cartData.some(
      (item) => item.quantity === 0 || item.cartQuantity > item.quantity
    );
    setCheckoutError(hasStockIssues);
  }, [cartData]);

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      if (
        selectedAddress?.latitude !== undefined &&
        selectedAddress?.longitude !== undefined &&
        !isNaN(cartTotal)
      ) {
        const result = await calculateDeliveryFee(
          selectedAddress.latitude,
          selectedAddress.longitude,
          cartTotal
        );
        setDeliveryFee(result.fee);
        setHandlingFee(result.handlingFee);
        console.log("Delivery fees calculated:", result);
      }
    };

    fetchDeliveryFee();
  }, [selectedAddress, cartTotal]);

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

    if (!withinRadius.isWithin) {
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

  const isCheckoutDisabled = (): boolean => {
    if (!selectedAddress) {
      return true;
    }
    if (!cartData || cartData.length === 0) {
      return true;
    }
    if (deliveryFee === null) {
      return true;
    }

    const hasOutOfStockItems = cartData.some((item) => item.quantity === 0);
    if (hasOutOfStockItems) {
      return true;
    }

    const hasExceededStockItems = cartData.some((item) => {
      const quantity =
        item.status === "FREE"
          ? freeCartItems[item.itemId] || 0
          : regularCartItems[item.itemId] || 0;
      return quantity > item.quantity;
    });
    if (hasExceededStockItems) {
      return true;
    }

    return false;
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
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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
      onCancel: () => {},
    });
  };

  const totalGoldGst = cartData.reduce(
    (sum, item) => sum + (item.goldGst ?? 0),
    0
  );
  const chargesWithoutGoldGst = totalGstAmount - totalGoldGst;

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
  `}
      </style>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <main className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
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
                  cartData.map((item) => (
                    <div
                      key={item.itemId}
                      className="relative rounded-xl bg-white p-2 sm:p-3 shadow-sm ring-1 ring-gray-100 mb-2 sm:mb-3"
                    >
                      {/* gradient */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-purple-50/80 to-transparent" />

                      <div className="relative z-10">
                        {/* ROW 1 */}
                        <div className="flex items-start gap-2 sm:gap-3 min-w-0 pr-1">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/main/itemsdisplay/${item.itemId}`, {
                                state: { item },
                              })
                            }
                            className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                            aria-label={`View ${item.itemName}`}
                          >
                            <img
                              src={item.image}
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            {item.quantity < 6 && item.quantity > 0 && (
                              <p className="text-[10px] sm:text-xs text-red-500 leading-none mb-0.5">
                                Only {item.quantity} left
                              </p>
                            )}
                            <h3 className="text-sm sm:text-base font-semibold text-purple-700 leading-snug break-words line-clamp-3">
                              {item.itemName}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">
                              {item.weight} {item.units}
                            </p>
                          </div>

                          {item.status !== "ADD" && (
                            <div className="hidden sm:block">
                              <Tag
                                color={
                                  item.status === "FREE" ? "green" : "blue"
                                }
                                className="text-[11px]"
                              >
                                {item.status === "FREE" ? "FREE" : "COMBO"}
                              </Tag>
                            </div>
                          )}
                        </div>

                        {/* ROW 2: price + qty (desktop Save is HERE, mobile Save is not) */}
                        <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-bold text-purple-900">
                              ₹{item.itemPrice}
                            </span>
                            {item.priceMrp && Number(item.priceMrp) > 0 && (
                              <span className="text-[11px] sm:text-xs line-through text-gray-400">
                                ₹{item.priceMrp}
                              </span>
                            )}
                          </div>
                          <div className="flex-1" />

                          {item.quantity !== 0 ? (
                            item.status === "ADD" ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center h-9 border border-purple-500 rounded-lg">
                                  <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    className="w-9 h-9 flex items-center justify-center text-purple-600"
                                    onClick={() => handleDecrease(item)}
                                    disabled={loadingItems[item.itemId]}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={16} />
                                  </motion.button>

                                  <div className="px-2 min-w-[28px] text-center">
                                    {loadingItems[item.itemId] ? (
                                      <Loader2 className="animate-spin text-purple-600 w-4 h-4" />
                                    ) : (
                                      <span className="text-sm font-medium text-purple-700">
                                        {regularCartItems[item.itemId] || 0}
                                      </span>
                                    )}
                                  </div>

                                  <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    className={`w-9 h-9 flex items-center justify-center text-purple-600 ${
                                      (regularCartItems[item.itemId] || 0) >=
                                      item.quantity
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (
                                        (regularCartItems[item.itemId] || 0) <
                                        item.quantity
                                      )
                                        handleIncrease(item);
                                    }}
                                    disabled={
                                      (regularCartItems[item.itemId] || 0) >=
                                        item.quantity ||
                                      loadingItems[item.itemId]
                                    }
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={16} />
                                  </motion.button>
                                </div>

                                <p className="text-sm sm:text-base font-bold text-purple-700 mt-4">
                                  ₹
                                  {Number(
                                    Number(item.itemPrice) *
                                    (regularCartItems[item.itemId] || 0)
                                  ).toFixed(2)}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Tag
                                  color={
                                    item.status === "FREE" ? "green" : "blue"
                                  }
                                  className="text-[11px] sm:hidden"
                                >
                                  {item.status === "FREE" ? "FREE" : "COMBO"}
                                </Tag>

                                <div className="flex items-center h-9 border border-gray-300 rounded-lg opacity-60">
                                  <button
                                    className="w-9 h-9 text-gray-400 cursor-not-allowed"
                                    disabled
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <div className="px-2 min-w-[28px] text-center">
                                    <span className="text-sm font-medium text-gray-600">
                                      {item.cartQuantity}
                                    </span>
                                  </div>
                                  <button
                                    className="w-9 h-9 text-gray-400 cursor-not-allowed"
                                    disabled
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>

                                <p className="text-sm sm:text-base font-bold text-purple-700">
                                  ₹
                                  {Number(
                                    Number(item.itemPrice) * item.cartQuantity
                                  ).toFixed(2)}
                                </p>
                              </div>
                            )
                          ) : (
                            <div className="text-xs font-semibold text-red-500">
                              OUT OF STOCK
                            </div>
                          )}
                        </div>

                        {/* ROW 3: MOBILE-ONLY Save + Delete (single row) */}
                        <div className="flex justify-between items-center mt-1 block sm:hidden">
                          {typeof item.saveAmount === "number" &&
                          item.saveAmount > 0 ? (
                            <p className="text-[12px] text-green-600 font-medium truncate">
                              Save ₹{Number(item.saveAmount || 0).toFixed(2)} (
                              {item.savePercentage ?? 0}% OFF)
                            </p>
                          ) : (
                            <span />
                          )}

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 shrink-0"
                            onClick={async () => {
                              await removeCartItem(item);
                            }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={17} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>

            <div className="w-full lg:w-1/4 lg:sticky lg:top-4 self-start">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
                <div className="flex items-center w-full min-w-0 mb-4">
                  {/* Title shrinks gracefully and never overlaps */}
                  <h2 className="flex-1 min-w-0 pr-2 text-lg lg:text-base font-semibold text-gray-900 truncate">
                    Delivery Address
                  </h2>

                  {/* Compact, good-looking button pinned right */}
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    aria-label="Add delivery address"
                    className="flex-none w-1/4 inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-full
               bg-green-600 text-white text-xs sm:text-sm font-medium whitespace-nowrap
               shadow-sm hover:bg-green-700 active:bg-green-800 
               focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                  >
                    <span className="text-base leading-none font-bold">+</span>
                    <span>Add</span>
                  </button>
                </div>

                {selectedAddress === null ? (
                  <p>No addresses found.</p>
                ) : (
                  <p className="mb-2 text-gray-700 break-words">
                    {selectedAddress?.flatNo}, {selectedAddress?.address},{" "}
                    {selectedAddress?.landMark}, {selectedAddress?.pincode}
                  </p>
                )}
                <div className="mb-4">
                  <label className="block font-bold text-gray-700 mb-1">
                    Select Address
                  </label>
                  <select
                    value={selectedAddress?.address || ""}
                    onChange={(e) => {
                      const sel = addresses.find(
                        (a) => a.address === e.target.value
                      );
                      if (sel) handleAddressChange(sel);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm break-words"
                  >
                    <option value="">Choose an Address</option>
                    {addresses.map((address, index) => (
                      <option key={index} value={address.address}>
                        {address.flatNo}, {address.address}, {address.landMark},{" "}
                        {address.pincode}
                      </option>
                    ))}
                  </select>
                </div>
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
                          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                            isItemTotalDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <span>
                        ₹
                        {Number(
                          (cartData
                            ?.filter((item) => item.status !== "FREE")
                            .reduce(
                              (acc, item) =>
                                acc +
                                parseFloat(item.itemPrice) *
                                  (regularCartItems[item.itemId] || 0),
                              0
                            ) || 0) +
                          totalGstAmount +
                          (cartData.length > 0 ? handlingFee || 0 : 0)
                        ).toFixed(2)}
                      </span>
                    </button>
                    {isItemTotalDropdownOpen && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Askoxy.ai has no role to play in the taxes and charges
                          being levied by the government
                        </p>
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Item Cost</span>
                          <span>
                            ₹
                            {cartData
                              ?.filter((item) => item.status !== "FREE")
                              .reduce(
                                (acc, item) =>
                                  acc +
                                  parseFloat(item.itemPrice) *
                                    (regularCartItems[item.itemId] || 0),
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm mt-1">
                          <span>Charges</span>
                          <span>
                            ₹
                            {chargesWithoutGoldGst.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {totalGoldGst > 0 && (
                          <div>
                            {/* {totalGoldMakingCost > 0 && (
                              <div className="text-gray-700 text-sm flex justify-between">
                                <span>Gold Making Cost</span>
                                <span>
                                  ₹
                                  {totalGoldMakingCost.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            )} */}

                            <div className="flex justify-between text-gray-700 text-sm mt-1">
                              <span>GST</span>
                              <span>
                                ₹
                                {totalGoldGst.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
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
                    <div className="flex justify-between mb-2 text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">
                        {deliveryFee === null
                          ? "N/A"
                          : `₹${Number(deliveryFee || 0).toFixed(2)}`}
                      </span>
                    </div>
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
                    className={`w-full py-3 px-6 rounded-lg transition ${
                      isCheckoutDisabled() || deliveryFee === null
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gradient-to-r from-purple-700 to-purple-500 hover:bg-purple-800 text-white"
                    }`}
                    onClick={() => handleToProcess()}
                    disabled={isCheckoutDisabled() || deliveryFee === null}
                  >
                    {isCheckoutDisabled()
                      ? !selectedAddress
                        ? "Select an Address to Proceed"
                        : !cartData || cartData.length === 0
                        ? "Cart is Empty"
                        : "Cannot Checkout - Stock Issues"
                      : deliveryFee === null
                      ? "Delivery Not Available"
                      : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>

            {isAddressModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h2>
                    <button
                      onClick={handleAddressModalClose}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Flat/House No"
                      value={addressFormData.flatNo}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          flatNo: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {addressFormErrors.flatNo && (
                      <p className="text-red-500 text-sm">
                        {addressFormErrors.flatNo}
                      </p>
                    )}

                    <input
                      type="text"
                      placeholder="Landmark"
                      value={addressFormData.landMark}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          landMark: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {addressFormErrors.landmark && (
                      <p className="text-red-500 text-sm">
                        {addressFormErrors.landmark}
                      </p>
                    )}

                    <input
                      type="text"
                      placeholder="Address"
                      value={addressFormData.address}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {addressFormErrors.address && (
                      <p className="text-red-500 text-sm">
                        {addressFormErrors.address}
                      </p>
                    )}

                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={addressFormData.pincode}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          pincode: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {addressFormErrors.pincode && (
                      <p className="text-red-500 text-sm">
                        {addressFormErrors.pincode}
                      </p>
                    )}

                    <select
                      value={addressFormData.addressType}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          addressType: e.target.value as
                            | "Home"
                            | "Work"
                            | "Others",
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleAddressModalClose}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddressSubmit}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                    >
                      {editingAddressId ? "Update Address" : "Save Address"}
                    </button>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default CartPage;
