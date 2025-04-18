import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { isWithinRadius } from "./LocationCheck";
import { Button, message, Modal } from "antd";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

interface Address {
  id?: string;
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  priceMrp: number | string;
  image: string;
  itemDescription: string;
  units: string;
  weight: string | number | null;
  cartQuantity: number;
  cartId: string;
  quantity: number;
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

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [selectedPlan, setSelectedPlan] = useState<"planA" | "planB" | null>(
    null
  );
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] =
    useState<boolean>(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState<
    "planA" | "planB" | null
  >(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [checkoutError, setCheckoutError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });

  const modalDisplayedRef = useRef<boolean>(false);
  const [addressFormErrors, setAddressFormErrors] = useState({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
  });
  const CONTAINER_ITEM_IDS = {
    HEAVY_BAG: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61", // 26kg container
    LIGHT_BAG: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3", // 10kg container
  };

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const [containerPreference, setContainerPreference] = useState<string | null>(
    null
  );
  const [hasShownOnePlusOne, setHasShownOnePlusOne] = useState(false);
  const onePlusOneConfirmedRef = useRef<boolean>(false);
  const containerModalCompletedRef = useRef<boolean>(false);
  const onePlusOneModalShownRef = useRef(false);
  const [freeItemsMap, setFreeItemsMap] = useState<{ [key: string]: number }>(
    {}
  );
  const checkOnePlusOneStatus = async (): Promise<boolean> => {
    const claimed = localStorage.getItem("onePlusOneClaimed") === "true";
    onePlusOneConfirmedRef.current = claimed;
  
    let offeravail = 0;
  
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/oneKgOffer?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      offeravail = response.data?.cartQuantity || 0;
      console.log("1+1 Offer available quantity:", offeravail);
    } catch (error) {
      console.error("Failed to fetch 1+1 offer availability:", error);
    }
  
    // ✅ Return true (already claimed or no offer left), else false
    return claimed || offeravail > 2;
  };
  
  const setOnePlusOneClaimed = async () => {
    // Simulated future backend call to persist offer usage
    localStorage.setItem("onePlusOneClaimed", "true");
    onePlusOneConfirmedRef.current = true;
  };

  const maybeShowOnePlusOneModal = async () => {
    if (onePlusOneModalShownRef.current) return; // 🚫 Already shown

    const hasClaimed = await checkOnePlusOneStatus();
    if (hasClaimed || hasShownOnePlusOne) return;

    const eligibleBag = findOneKgBag();
    if (!eligibleBag) return;

    onePlusOneModalShownRef.current = true; // ✅ Mark as shown
    setHasShownOnePlusOne(true);

    setTimeout(() => showOnePlusOneModal(eligibleBag), 300);
  };

  const findOneKgBag = (): CartItem | null => {
    const oneKgBags = cartData.filter((item) => {
      const weight = parseFloat(item.weight?.toString() || "0");
      return weight === 1 && item.units?.toLowerCase().includes("kg");
    });

    if (oneKgBags.length === 0) return null;
    // Sort by itemPrice and return the cheapest
    return oneKgBags.reduce((minItem, currentItem) =>
      parseFloat(currentItem.itemPrice) < parseFloat(minItem.itemPrice)
        ? currentItem
        : minItem
    );
  };

  const parseWeight = (weight: unknown): number => {
    console.log("Parsing weight:", weight);
    if (typeof weight === "number") {
      console.log(`Weight is a number: ${weight}`);
      return weight;
    }
    if (typeof weight !== "string" || !weight) {
      console.warn(`Invalid weight value: ${weight}, defaulting to 0`);
      return 0;
    }
    const match = weight.match(/(\d+(\.\d+)?)/);
    const result = match ? parseFloat(match[0]) : 0;
    console.log(`Parsed string ${weight} to ${result}`);
    return result;
  };

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
      setAddresses(response.data);
      setSelectedAddress(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    const initializeCartPage = async () => {
      setIsLoading(true);
      try {
        const [cartResponse, preference] = await Promise.all([
          fetchCartData(),
          fetchContainerPreference(),
        ]);
        console.log("Initialization complete - preference:", preference); // Debug log
        setContainerPreference(preference);
      } catch (error) {
        console.error("Error initializing cart page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCartPage();
  }, []);

  useEffect(() => {
    const checkAndShowFallbackOnePlusOne = async () => {
      if (onePlusOneModalShownRef.current) return;

      const hasClaimed = await checkOnePlusOneStatus();
      const eligibleBag = findOneKgBag();

      if (
        cartData.length > 0 &&
        !hasClaimed &&
        !modalDisplayedRef.current &&
        eligibleBag
      ) {
        onePlusOneModalShownRef.current = true;
        setHasShownOnePlusOne(true);
        setTimeout(() => showOnePlusOneModal(eligibleBag), 300);
      }
    };

    checkAndShowFallbackOnePlusOne();
  }, [cartData]);

  useEffect(() => {
    if (
      cartData.length > 0 &&
      containerPreference?.toLowerCase() !== "interested" &&
      !modalDisplayedRef.current
    ) {
      console.log(
        "Triggering showContainerModal - cartData:",
        cartData.length,
        "containerPreference:",
        containerPreference
      );
      showContainerModal();
    } else {
      console.log(
        "Modal not triggered - containerPreference:",
        containerPreference,
        "modalDisplayed:",
        modalDisplayedRef.current
      );
    }
  }, [cartData, containerPreference]);

  useEffect(() => {
    if (isPlanDetailsModalOpen && currentPlanDetails) {
      Modal.info({
        title:
          currentPlanDetails === "planA"
            ? "Free Steel Container Policy"
            : "Referral Program",
        content: (
          <div className="space-y-4 text-left">
            {currentPlanDetails === "planA" ? (
              <>
                {/* <h3 className="text-lg font-semibold">
                  Plan A: Free Steel Container
                </h3> */}
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>
                    Buy 9 bags of rice in 3 years to keep the container forever
                  </li>
                  <li>
                    Refer 9 friends who make a purchase – keep the container
                  </li>
                  <li>Gap of 90 days = container is taken back</li>
                </ul>
              </>
            ) : (
              <>
                {/* <h3 className="text-lg font-semibold">
                  Plan B: Referral Program
                </h3> */}
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
    }
  }, [isPlanDetailsModalOpen, currentPlanDetails]);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        setCartItems(cartItemsMap);
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCount(totalQuantity);
      } else {
        setCartItems({});
        setCount(0);
      }
      const updatedCart = response.data?.customerCartResponseList || [];
      const outOfStockItems = updatedCart.filter(
        (item: CartItem) => item.cartQuantity > item.quantity
      );
      if (outOfStockItems.length > 0) {
        setCheckoutError(true);
        alert(
          `Please decrease the quantity for: ${outOfStockItems
            .map((item: CartItem) => item.itemName)
            .join(", ")} before proceeding to checkout.`
        );
      }
      setCartData(response.data?.customerCartResponseList || []);
      console.log("Cart Data:", response.data?.customerCartResponseList);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContainerPreference = async (): Promise<string | null> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const status = response.data.freeContainerStatus
        ? response.data.freeContainerStatus.toLowerCase()
        : null;
      console.log("Fetched container preference:", status); // Debug log
      return status;
    } catch (error) {
      console.error("Error fetching container preference:", error);
      return null;
    }
  };

  const handleInterested = async () => {
    try {
      const hasContainer = cartData.some((item) =>
        [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
          item.itemId
        )
      );
      if (hasContainer) {
        message.info("You have already opted for a container.");
        modalDisplayedRef.current = true;
        return;
      }

      let containerItemId: string;

      const hasHeavyBag = cartData.some((item) => {
        const weight = parseWeight(item.weight);
        return weight > 10;
      });

      const hasValidLightBag = cartData.some((item) => {
        const weight = parseWeight(item.weight);
        return weight <= 10 && weight !== 1 && weight !== 5;
      });

      if (hasHeavyBag) {
        containerItemId = CONTAINER_ITEM_IDS.HEAVY_BAG;
      } else if (hasValidLightBag) {
        containerItemId = CONTAINER_ITEM_IDS.LIGHT_BAG;
      } else {
        message.info("No eligible items for a free container.");
        return;
      }

      const containerItemData = {
        itemId: containerItemId,
        customerId: customerId,
        cartQuantity: 1,
        itemPrice: 0,
      };

      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        containerItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      modalDisplayedRef.current = true;
      message.success("Free container added to your cart at ₹0.");
      await fetchCartData();
    } catch (error) {
      console.error("Error adding container to cart:", error);
      message.error("Failed to add free container. Please try again.");
    }
  };

  const showContainerModal = () => {
    if (
      containerPreference?.toLowerCase() === "interested" ||
      modalDisplayedRef.current
    ) {
      return;
    }

    const hasContainer = cartData.some((item) =>
      [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
        item.itemId
      )
    );
    if (hasContainer) {
      modalDisplayedRef.current = true;
      return;
    }

    const hasHeavyBag = cartData.some((item) => parseWeight(item.weight) > 10);
    const hasValidLightBag = cartData.some((item) => {
      const weight = parseWeight(item.weight);
      return weight <= 10 && weight !== 1 && weight !== 5;
    });

    if (!hasHeavyBag && !hasValidLightBag) {
      return;
    }

    modalDisplayedRef.current = true;

    let selected: "planA" | "planB" | null = selectedPlan;

    const PlanModalContent = () => {
      const [tempPlan, setTempPlan] = useState<"planA" | "planB" | null>(
        selectedPlan
      );

      useEffect(() => {
        selected = tempPlan;
      }, [tempPlan]);

      const planDetails: Record<"planA" | "planB", JSX.Element> = {
        planA: (
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>Buy 9 bags of rice in 3 years to keep the container forever</li>
            <li>Refer 9 friends who make a purchase – keep the container</li>
            <li>Gap of 90 days = container is taken back</li>
            <li>
              Choose the plan that best suits your needs for long-term
              convenience
            </li>
          </ul>
        ),
        planB: (
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>Refer friends using your unique link</li>
            <li>They must sign up and buy rice</li>
            <li>You get a free container + ₹50 cashback</li>
            <li>
              Choose the plan that best suits your needs for long-term
              convenience
            </li>
          </ul>
        ),
      };

      return (
        <div className="text-center">
          <p className="mt-2">
            Get a free steel container! Buy 9 bags of 26 kgs / 10 kgs in 3 years
            or refer 9 friends and when they buy their first bag, the container
            is yours forever.
          </p>
          <p className="mt-2 text-sm text-gray-600 font-semibold">
            * No purchase in 90 days or gap of 90 days between purchases =
            Container will be taken back
          </p>
          <p className="mt-1 text-sm text-gray-700 italic">
            Choose the plan that best suits your needs and enjoy exclusive
            benefits.
          </p>

          <div className="mt-4 space-y-4">
            {["planA", "planB"].map((planKey) => (
              <div className="flex items-center" key={planKey}>
                <input
                  type="radio"
                  name="planSelection"
                  checked={tempPlan === planKey}
                  onChange={() => setTempPlan(planKey as "planA" | "planB")}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPlanDetails(planKey as "planA" | "planB");
                    setIsPlanDetailsModalOpen(true);
                  }}
                  className={`w-full py-2 px-4 rounded-lg text-left transition-colors ${
                    tempPlan === planKey
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {planKey === "planA"
                    ? "Plan A: Free Steel Container Policy"
                    : "Plan B: Referral Program"}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };

    Modal.confirm({
      title: "Special Offer!",
      content: <PlanModalContent />,
      okText: "Confirm Selection",
      cancelText: "Cancel",
      onOk: async () => {
        if (!selected) {
          message.info("Please select a plan before confirming.");
          return Promise.reject();
        }
        setSelectedPlan(selected);
        await handleInterested();
        containerModalCompletedRef.current = true; // mark container modal done
        await maybeShowOnePlusOneModal();
      },
      onCancel: async () => {
        setSelectedPlan(null);
        containerModalCompletedRef.current = true; // mark container modal done
        await maybeShowOnePlusOneModal();
      },
    });
  };

  const showOnePlusOneModal = (item: CartItem) => {
    Modal.confirm({
      title: "🎁 1+1 Offer on 1kg Rice!",
      content: (
        <p>
          You're eligible for our <strong>1+1 offer</strong>! Get another{" "}
          <strong>{item.itemName}</strong> absolutely free.
        </p>
      ),
      okText: "Add Free Bag",
      cancelText: "No Thanks",
      onOk: async () => {
        try {
          const currentQuantity = cartItems[item.itemId] || 0;

          // Increase the item quantity
          await axios.patch(
            `${BASE_URL}/cart-service/cart/incrementCartData`,
            {
              cartQuantity: currentQuantity + 1,
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

          // Save free item count in state
          setFreeItemsMap((prev) => ({
            ...prev,
            [item.itemId]: 1,
          }));

          await setOnePlusOneClaimed();
          message.success(`1+1 offer applied! 1 free ${item.itemName} added.`);
          await fetchCartData();
        } catch (err) {
          console.error("1+1 offer failed:", err);
          message.error("Unable to apply the 1+1 offer. Please try again.");
        }
      },
    });
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
                {withinRadius.distanceInKm} km away, beyond our 20 km delivery
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
      const currentQuantity = cartItems[item.itemId] || 0;

      if (currentQuantity >= item.quantity) {
        message.warning(`Only ${item.quantity} units available in stock`);
        setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
        return;
      }

      const newQuantity = currentQuantity + 1;

      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
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
      const currentQuantity = cartItems[item.itemId];
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
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

        setCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));

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
      await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
        data: {
          id: item.cartId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCartData((prev) =>
        prev.filter((cartItem) => cartItem.cartId !== item.cartId)
      );
      setCartItems((prev) => {
        const updated = { ...prev };
        delete updated[item.itemId];
        return updated;
      });

      const updatedCount = Object.entries(cartItems)
        .filter(([key]) => key !== String(item.itemId))
        .reduce((sum, [, qty]) => sum + qty, 0);

      if (Object.keys(cartItems).length === 1) {
        window.location.reload();
      }

      message.success("Item removed from cart successfully.", 5);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      message.error("Failed to remove item");
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

    const isAddressValid = await handleAddressChange(selectedAddress);
    if (isAddressValid?.isWithin) {
      navigate("/main/checkout", { state: { selectedAddress } });
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

  useEffect(() => {
    fetchCartData();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const hasStockIssues = cartData.some(
      (item) => item.quantity === 0 || item.cartQuantity > item.quantity
    );
    setCheckoutError(hasStockIssues);
  }, [cartData]);

  const handleAddressChange = async (selectedAddress: Address) => {
    const fullAddress = `${selectedAddress?.flatNo}, ${selectedAddress?.landMark}, ${selectedAddress?.address}, ${selectedAddress?.pincode}`;
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
      Modal.error({
        title: "Delivery Unavailable",
        content: (
          <>
            <p>
              Sorry! We're unable to deliver to this address as it is{" "}
              {withinRadius.distanceInKm} km away, beyond our 20 km delivery
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

      const updatedWithinRadius = {
        ...withinRadius,
        isWithin: false,
      };

      return updatedWithinRadius;
    }
    setSelectedAddress(selectedAddress);
    return withinRadius;
  };

  const handleCartData = async () => {};

  const isCheckoutDisabled = (): boolean => {
    if (!cartData || cartData.length === 0) {
      return true;
    }

    const hasOutOfStockItems = cartData.some((item) => item.quantity === 0);
    if (hasOutOfStockItems) {
      return true;
    }

    const hasExceededStockItems = cartData.some(
      (item) => item.cartQuantity > item.quantity
    );
    if (hasExceededStockItems) {
      return true;
    }

    return false;
  };

  const removeOutOfStockItems = async () => {
    try {
      const updatedCart = cartData.filter((item) => item.quantity > 0);
      setCartData(updatedCart);

      const updatedCartItems = updatedCart.reduce((acc, item) => {
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {} as { [key: string]: number });

      setCartItems(updatedCartItems);

      const totalQuantity = Object.values(updatedCartItems).reduce(
        (sum, qty) => sum + qty,
        0
      );
      setCount(totalQuantity);

      const outOfStockItems = cartData.filter((item) => item.quantity === 0);
      for (const item of outOfStockItems) {
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: {
            id: item.cartId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      message.success("Out-of-stock items removed successfully.");
    } catch (error) {
      console.error("Failed to remove out-of-stock items:", error);
      message.error("Failed to remove out-of-stock items");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : !cartData || cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                  <button
                    onClick={() => navigate("/main/dashboard/products")}
                    className=" bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                  >
                    Browse items
                  </button>
                </div>
              ) : (
                cartData.map((item) => (
                  <div
                    key={item.itemId}
                    className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row w-full"
                  >
                    <div className="flex flex-1 mb-4 md:mb-0">
                      <div
                        className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 cursor-pointer shadow-sm"
                        onClick={() =>
                          navigate(`/main/itemsdisplay/${item.itemId}`, {
                            state: { item },
                          })
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex flex-col justify-center">
                        {item.quantity < 6 && item.quantity > 0 && (
                          <p className="text-xs font-medium text-red-500 mb-1">
                            Only {item.quantity}{" "}
                            {item.quantity === 1 ? "item" : "items"} left
                          </p>
                        )}
                        <h3 className="text-smc md:text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                          {item.itemName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Weight: {item.weight}{" "}
                          {item.units == "pcs"
                            ? "Pc"
                            : item.weight == "1"
                            ? "Kg"
                            : "Kgs"}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm line-through text-gray-400 mr-2">
                            ₹{item.priceMrp}
                          </p>
                          {parseFloat(item.itemPrice) === 0 ? (
                            <p className="text-green-600 font-bold">Free 🎉</p>
                          ) : (
                            <p className="text-green-600 font-bold">
                              ₹{item.itemPrice}
                            </p>
                          )}
                          {freeItemsMap[item.itemId] && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              🎁 1 Free bag (1+1 Offer Applied)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.quantity !== 0 ? (
                      <div className="flex flex-col md:items-end justify-center space-y-3 w-full md:w-auto">
                        <div className="flex items-center justify-between md:justify-end w-full">
                          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 hover:shadow-md transition-shadow"
                              onClick={() => handleDecrease(item)}
                              disabled={loadingItems[item.itemId]}
                              aria-label="Decrease quantity"
                            >
                              <span className="font-medium">-</span>
                            </motion.button>

                            <div className="px-4">
                              {loadingItems[item.itemId] ? (
                                <Loader2 className="animate-spin text-purple-600" />
                              ) : (
                                <span className="font-medium text-purple-700">
                                  {cartItems[item.itemId]}
                                </span>
                              )}
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className={`w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 hover:shadow-md transition-shadow ${
                                cartItems[item.itemId] >= item.quantity
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (cartItems[item.itemId] < item.quantity) {
                                  handleIncrease(item);
                                }
                              }}
                              disabled={
                                cartItems[item.itemId] >= item.quantity ||
                                loadingItems[item.itemId]
                              }
                              aria-label="Increase quantity"
                            >
                              <span className="font-medium">+</span>
                            </motion.button>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="ml-4 bg-red-500 hover:bg-red-600 hover:shadow-md text-white w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center"
                            onClick={async () => {
                              await removeCartItem(item);
                            }}
                            aria-label="Delete item from cart"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>

                        <div className="w-full flex justify-end">
                          <p className="text-purple-700 font-bold text-base">
                            Total: ₹
                            {(
                              parseFloat(item.itemPrice) *
                              (cartItems[item.itemId] || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:items-end justify-center space-y-3 w-full md:w-auto">
                        <p className="text-red-600 font-bold text-base mb-2">
                          Out of Stock
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 hover:bg-red-600 hover:shadow-md text-white px-4 py-2 rounded-md transition-all duration-200 text-sm flex items-center justify-center"
                          onClick={async () => {
                            await removeCartItem(item);
                          }}
                          aria-label="Delete item from cart"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </main>

          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border broder-black-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Delivery Address</h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <span>+</span> Add
                </button>
              </div>
              {selectedAddress === null ? (
                <p>No addresses found.</p>
              ) : (
                <span className="flex justify-between mb-2 text-gray-700">
                  {selectedAddress.flatNo}, {selectedAddress.address},{" "}
                  {selectedAddress.landMark}, {selectedAddress.pincode}
                </span>
              )}
              <div className="mb-4">
                <label className="block font-bold text-gray-700  mb-1">
                  Select Address
                </label>
                <select
                  value={selectedAddress?.address || ""}
                  onChange={(e) => {
                    const selected = addresses.find(
                      (addr) => addr.address === e.target.value
                    );

                    if (selected) {
                      handleAddressChange(selected);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹
                      {cartData
                        ?.filter((item) => parseFloat(item.itemPrice) > 0)
                        .reduce(
                          (acc, item) =>
                            acc +
                            parseFloat(item.itemPrice) * item.cartQuantity,
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-800 font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹
                      {cartData
                        ?.reduce(
                          (acc, item) =>
                            acc +
                            parseFloat(item.itemPrice) * item.cartQuantity,
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
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
                      isCheckoutDisabled()
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gradient-to-r from-purple-700 to-purple-500 hover:bg-purple-800 text-white"
                    }`}
                    onClick={() => handleToProcess()}
                    disabled={isCheckoutDisabled()}
                  >
                    {isCheckoutDisabled()
                      ? "Cannot Checkout - Stock Issues"
                      : "Proceed to Checkout"}
                  </button>
                </div>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
