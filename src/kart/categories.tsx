import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import checkProfileCompletion from "../until/ProfileCheck";
import BASE_URL from "../Config";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null | string;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
}

interface SubCategory {
  id: string;
  name: string;
  image?: string | null;
}

interface Category {
  categoryName: string;
  categoryImage: string | null;
  itemsResponseDtoList: Item[];
  subCategories?: SubCategory[];
}

interface Offer {
  id: string;
  offerName: string;
  minQtyKg: number;
  minQty: number;
  freeItemName: string;
  freeItemId: string;
  freeGivenItemId: string;
  freeQty: number;
  freeOnce: boolean;
  active: boolean;
  offerCreatedAt: number;
}

interface UserEligibleOffer {
  offerName: string;

  eligible: boolean;
  weight: number;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
  status: string;
  itemName: string;
  weight: number;
}

interface CategoriesProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
  loading: boolean;
  cart: { [key: string]: number };
  onItemClick: (item: Item) => void;
  updateCart: (cart: { [key: string]: number }) => void;
  customerId: string;
  updateCartCount: (count: number) => void;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  loading,
  cart,
  onItemClick,
  updateCart,
  customerId,
  updateCartCount,
}) => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null
  );
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userEligibleOffers, setUserEligibleOffers] = useState<
    UserEligibleOffer[]
  >([]);
  const [isOffersModalVisible, setIsOffersModalVisible] = useState(false);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const [displayedOffers, setDisplayedOffers] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("displayedOffers");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [offerModal, setOfferModal] = useState<{
    visible: boolean;
    content: string;
  }>({
    visible: false,
    content: "",
  });
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });

  const location = useLocation();

  const [selectedFilter, setSelectedFilter] = useState<string | null>("ALL");
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(
    "0"
  );
  const [activeWeightFilter, setActiveWeightFilter] = useState<string | null>(
    null
  );

  const [disabledFilters, setDisabledFilters] = useState<{
    [key: string]: boolean;
  }>({});

  const weightFilters = [
    { label: "1 KG", value: "1.0" },
    { label: "5 KG", value: "5.0" },
    { label: "10 KG", value: "10.0" },
    { label: "26 KG", value: "26.0" },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const weight = queryParams.get("weight");
    if (weight && weightFilters.some((filter) => filter.value === weight)) {
      setActiveWeightFilter(weight);
    } else {
      setActiveWeightFilter(null);
    }
  }, [location.search]);

  const handleWeightFilterClick = (value: string) => {
    if (activeWeightFilter === value) {
      setActiveWeightFilter(null);
    } else {
      setActiveWeightFilter(value);
    }

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "toggle_weight_filter", {
        filter_value: value,
        new_state: activeWeightFilter === value ? "off" : "on",
      });
    }

    setSelectedFilterKey("0");
    setSelectedFilter("ALL");
  };

  const fetchCartData = async (itemId: string = "") => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      setCartItems({});
      setCartData([]);
      updateCartCount(0);
      localStorage.setItem("cartCount", "0");
      return;
    }

    if (itemId) {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: true },
      }));
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const customerCart: CartItem[] =
        response.data?.customerCartResponseList || [];

      console.log("fetchCartData API response:", response.data);

      const cartItemsMap: Record<string, number> = customerCart.reduce(
        (acc: Record<string, number>, item: CartItem) => {
          if (item.status === "ADD") {
            const quantity = item.cartQuantity ?? 0;
            acc[item.itemId] = (acc[item.itemId] ?? 0) + quantity;
            console.log(
              `Item ${item.itemId}: quantity=${quantity}, status=${item.status}`
            );
          }
          return acc;
        },
        {}
      );

      const totalQuantity: number = customerCart.reduce(
        (sum: number, item: CartItem) => {
          const quantity = item.cartQuantity ?? 0;
          return sum + quantity;
        },
        0
      );

      console.log("fetchCartData: ", {
        cartItemsMap,
        totalQuantity,
        customerCart,
      });

      const goldBarItemIds = [
        "619bd23a-0267-46da-88da-30977037225a",
        "4fca7ab8-bfc6-446a-9405-1aba1912d90a",
      ];

      const newDisplayedOffers = new Set(displayedOffers);

      // Check for 2+1 Offer
      const twoPlusOneItems = customerCart.filter(
        (item) => item.status === "ADD" && item.cartQuantity >= 2
      );
      for (const addItem of twoPlusOneItems) {
        if (goldBarItemIds.includes(addItem.itemId)) {
          continue; // Skip gold bar items
        }
        const freeItem = customerCart.find(
          (item) =>
            item.itemId === addItem.itemId &&
            item.status === "FREE" &&
            item.cartQuantity === 1 &&
            normalizeWeight(item.weight) === 1.0
        );
        if (
          freeItem &&
          normalizeWeight(addItem.weight) === 1.0 &&
          !newDisplayedOffers.has(`2+1_${addItem.itemId}`)
        ) {
          setOfferModal({
            visible: true,
            content: `<b>2+1 Offer Is Active.</b><br><br>Buy Two Bags of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get One Bag of ${
              freeItem.itemName
            } of ${normalizeWeight(
              freeItem.weight
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
          });
          newDisplayedOffers.add(`2+1_${addItem.itemId}`);
        }
      }

      // Check for 5+2 Offer
      const fivePlusTwoItems = customerCart.filter(
        (item) =>
          item.status === "ADD" &&
          normalizeWeight(item.weight) === 5.0 &&
          item.cartQuantity >= 1
      );
      for (const addItem of fivePlusTwoItems) {
        if (goldBarItemIds.includes(addItem.itemId)) {
          continue; // Skip gold bar items
        }
        const freeItems = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            normalizeWeight(item.weight) === 1.0 &&
            item.cartQuantity === 2
        );
        if (freeItems && !newDisplayedOffers.has(`5+2_${addItem.itemId}`)) {
          setOfferModal({
            visible: true,
            content: `<b>5+2 Offer Is Active.</b><br><br>Buy One Bag of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get Two Bags of ${
              freeItems.itemName
            } of ${normalizeWeight(
              freeItems.weight
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
          });
          newDisplayedOffers.add(`5+2_${addItem.itemId}`);
        }
      }

      // Free Container Offer
      const containerOfferItems = customerCart.filter(
        (item) =>
          item.status === "ADD" &&
          (normalizeWeight(item.weight) === 10.0 ||
            normalizeWeight(item.weight) === 26.0) &&
          item.cartQuantity >= 1
      );
      for (const addItem of containerOfferItems) {
        if (goldBarItemIds.includes(addItem.itemId)) {
          continue; // Skip gold bar items
        }
        const freeContainer = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            item.cartQuantity === 1 &&
            item.itemName.toLowerCase().includes("storage")
        );
        if (
          freeContainer &&
          !newDisplayedOffers.has(`container_${addItem.itemId}`)
        ) {
          setOfferModal({
            visible: true,
            content: `<br>Free Container added to the cart successfully.`,
          });
          newDisplayedOffers.add(`container_${addItem.itemId}`);
        }
      }

      setCartItems(cartItemsMap);
      setCartData(customerCart);
      updateCart(cartItemsMap);
      updateCartCount(totalQuantity);
      localStorage.setItem("cartCount", totalQuantity.toString());
      localStorage.setItem(
        "displayedOffers",
        JSON.stringify(Array.from(newDisplayedOffers))
      );
      setDisplayedOffers(newDisplayedOffers);

      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems({});
      setCartData([]);
      updateCart({});
      updateCartCount(0);
      localStorage.setItem("cartCount", "0");
      message.error("Failed to fetch cart data.");
      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
    }
  };

  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

  const fetchUserEligibleOffers = async (userId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userEligibleOffer/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const normalizedOffers = (response.data || []).map(
        (offer: UserEligibleOffer) => ({
          ...offer,
          weight: normalizeWeight(offer.weight),
        })
      );
      setUserEligibleOffers(normalizedOffers);
      console.log("User eligible offers:", normalizedOffers);
    } catch (error) {
      console.error("Error fetching user-eligible offers:", error);
      message.error("Failed to load user-eligible offers.");
      setUserEligibleOffers([]);
    }
  };

  const fetchOffers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsFetchingOffers(true);
    try {
      const offersResponse = await axios.get(
        `${BASE_URL}/cart-service/cart/activeOffers`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const activeOffers = offersResponse.data || [];

      const filteredOffers = activeOffers.filter((offer: Offer) => {
        const offerMinQtyKg = normalizeWeight(offer.minQtyKg);
        if (offerMinQtyKg === null) {
          console.warn(
            `Offer ${offer.offerName} has invalid minQtyKg: ${offer.minQtyKg}`
          );
          return true;
        }

        const isExcluded = userEligibleOffers.some((eligibleOffer) => {
          const eligibleWeight = normalizeWeight(eligibleOffer.weight);
          if (eligibleWeight === null) {
            console.warn(
              `Invalid weight for eligible offer ${eligibleOffer.offerName}: ${eligibleOffer.weight}`
            );
            return false;
          }

          const isEligible = eligibleOffer.eligible === true;
          const isWeightMatch =
            Math.abs(eligibleWeight - offerMinQtyKg) < 0.0001;

          return isEligible && isWeightMatch;
        });

        return !isExcluded;
      });

      setOffers(filteredOffers);
      setIsFetchingOffers(false);
      console.log("Filtered offers:", filteredOffers);

      if (filteredOffers.length > 0) {
        await fetchCartData();
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      message.error("Failed to load offers.");
      setOffers([]);
      setIsFetchingOffers(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const hasShownOffers = localStorage.getItem("hasShownOffers");

    if (userId && accessToken) {
      fetchCartData();
      if (!hasShownOffers) {
        fetchUserEligibleOffers(userId);
      }
    }
  }, []);

  useEffect(() => {
    const hasShownOffers = localStorage.getItem("hasShownOffers");
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (
      userId &&
      accessToken &&
      !hasShownOffers &&
      userEligibleOffers.length >= 0
    ) {
      fetchOffers().then(() => {
        if (offers.length > 0) {
          setIsOffersModalVisible(true);
          localStorage.setItem("hasShownOffers", "true");
        }
      });
    }
  }, [userEligibleOffers]);

  useEffect(() => {
    setActiveSubCategory(null);
  }, [activeCategory]);

  const handleAddToCart = async (item: Item) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken || !userId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => {
        navigate("/whatapplogin");
      }, 2000);
      return;
    }

    if (!checkProfileCompletion()) {
      Modal.error({
        title: "Profile Incomplete",
        content: "Please complete your profile to add items to the cart.",
        onOk: () => navigate("/main/profile"),
      });
      setTimeout(() => {
        navigate("/main/profile");
      }, 4000);
      return;
    }

    try {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: true },
      }));
      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        { customerId: userId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      await fetchCartData(item.itemId);
      message.success("Item added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add item to cart.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const calculateDiscount = (mrp: number | string, price: number): number => {
    const mrpNum = typeof mrp === "string" ? parseFloat(mrp) : mrp;
    return Math.round(((mrpNum - price) / mrpNum) * 100);
  };

  const getCurrentCategoryItems = () => {
    const currentCategory =
      categories.find((cat) => cat.categoryName === activeCategory) ||
      categories[0];
    if (!currentCategory) return [];

    const goldBarItemIds = [
      "619bd23a-0267-46da-88da-30977037225a",
      "4fca7ab8-bfc6-446a-9405-1aba1912d90a",
    ];

    let items = currentCategory.itemsResponseDtoList;

    if (activeWeightFilter) {
      items = items.filter((item) => {
        // Exclude gold bar items when a weight filter is active
        if (goldBarItemIds.includes(item.itemId)) {
          return false;
        }
        // Apply weight filter for other items
        const itemWeight = parseFloat(item.weight).toFixed(1);
        return itemWeight === activeWeightFilter;
      });
    }

    return items;
  };

  const handleQuantityChange = async (
    item: Item,
    increment: boolean,
    status: string
  ) => {
    if (cartItems[item.itemId] === item.quantity && increment) {
      message.warning("Sorry, Maximum quantity reached.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      message.error("Please login to update cart.");
      return;
    }

    try {
      const endpoint = increment
        ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
        : `${BASE_URL}/cart-service/cart/minusCartItem`;

      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: true },
        status: { ...prev.status, [item.itemId]: status },
      }));

      const payload = {
        customerId: userId,
        itemId: item.itemId,
      };

      await axios[increment ? "post" : "patch"](endpoint, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await fetchCartData(item.itemId);

      console.log(
        `handleQuantityChange: Item ${item.itemId}, increment: ${increment}, new cartItems: `,
        cartItems
      );

      message.success(
        increment
          ? "Item quantity increased"
          : cartItems[item.itemId] <= 1
          ? "Item removed from cart successfully."
          : "Item quantity decreased"
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
        status: { ...prev.status, [item.itemId]: "" },
      }));
    }
  };

  const getCurrentSubCategories = () => {
    if (!activeCategory) return [];
    const category = categories.find(
      (cat) => cat.categoryName === activeCategory
    );
    return category?.subCategories || [];
  };

  const handleOffersModalClose = () => {
    setIsOffersModalVisible(false);
  };

  const handleOfferModalClose = () => {
    setOfferModal({ visible: false, content: "" });
  };

  const isItemUserAdded = (itemId: string): boolean => {
    return cartData.some(
      (cartItem) => cartItem.itemId === itemId && cartItem.status === "ADD"
    );
  };

  return (
    <div className="bg-white shadow-lg px-3 sm:px-6 lg:px-6 py-3">
      <style>
        {`
          .offers-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .offers-scroll-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <Modal
        title="Available Offers"
        open={isOffersModalVisible}
        onCancel={handleOffersModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900"
            onClick={handleOffersModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "600px" }}
        bodyStyle={{ maxHeight: "60vh", padding: "16px" }}
      >
        {isFetchingOffers ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-purple-600" />
          </div>
        ) : offers.length > 0 ? (
          <div
            className="space-y-4 offers-scroll-container"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-purple-800">
                  {offer.offerName}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No offers available at the moment.</p>
        )}
      </Modal>

      <Modal
        title="Special Offer!"
        open={offerModal.visible}
        onCancel={handleOfferModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900"
            onClick={handleOfferModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "600px" }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: offerModal.content,
          }}
        />
      </Modal>

      <div className="mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.categoryName
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100"
              }`}
              onClick={() => onCategoryClick(category.categoryName)}
            >
              <div className="flex items-center space-x-2">
                {category.categoryImage && (
                  <img
                    src={category.categoryImage}
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{category.categoryName}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center space-x-3 pb-2">
          {weightFilters.map((filter, index) => (
            <motion.button
              key={index}
              whileHover={{
                scale:
                  filter.value === "1.0" && disabledFilters[filter.value]
                    ? 1
                    : 1.02,
              }}
              whileTap={{
                scale:
                  filter.value === "1.0" && disabledFilters[filter.value]
                    ? 1
                    : 0.98,
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter.value === "1.0" && disabledFilters[filter.value]
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                  : filter.value === activeWeightFilter
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-purple-50 border border-purple-100"
              }`}
              onClick={() => handleWeightFilterClick(filter.value)}
              disabled={filter.value === "1.0" && disabledFilters[filter.value]}
              title={
                filter.value === "1.0" && disabledFilters[filter.value]
                  ? "Disabled. Click Reset to enable."
                  : ""
              }
            >
              {filter.label}
              {filter.value === "1.0" && (
                <span className="ml-1 text-xs">
                  {disabledFilters[filter.value] ? "(Disabled)" : ""}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {getCurrentSubCategories().length > 0 && (
        <div className="mb-6 overflow-x-auto scrollbar whitespace-nowrap">
          <div className="flex space-x-3 pb-2 w-max">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                !activeSubCategory
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSubCategory(null)}
            >
              All
            </motion.button>
            {getCurrentSubCategories().map((subCategory) => (
              <motion.button
                key={subCategory.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSubCategory === subCategory.id
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSubCategory(subCategory.id)}
              >
                <div className="flex items-center space-x-2">
                  {subCategory.image && (
                    <img
                      src={subCategory.image}
                      alt=""
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span>{subCategory.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${activeSubCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {getCurrentCategoryItems().map((item, index) => (
            <motion.div
              key={item.itemId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              {item.itemMrp &&
                item.itemPrice &&
                item.itemMrp > item.itemPrice && (
                  <div className="absolute left-0 top-0 z-10 w-auto">
                    <div
                      className="bg-purple-600 text-white text-[10px] xs:text-xs sm:text-sm font-bold 
                    px-1.5 xs:px-2 sm:px-3 lg:px-4 
                    py-0.5 xs:py-0.5 sm:py-1 
                    flex items-center"
                    >
                      {calculateDiscount(item.itemMrp, item.itemPrice)}%
                      <span className="ml-0.5 xs:ml-1 text-[8px] xs:text-[10px] sm:text-xs">
                        Off
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 right-0 transform translate-y 
                    border-t-4 border-r-4 
                    xs:border-t-6 xs:border-r-6 
                    sm:border-t-8 sm:border-r-8 
                    border-t-purple-600 border-r-transparent"
                    ></div>
                  </div>
                )}

              {item.quantity === 0 ? (
                <div
                  className="absolute top-0.5 xs:top-1 sm:top-2 
                  right-0.5 xs:right-1 sm:right-2 z-10"
                ></div>
              ) : item.quantity < 6 ? (
                <div
                  className="absolute top-0.5 xs:top-1 sm:top-2 
                  right-0.5 xs:right-1 sm:right-2 z-10"
                >
                  <span
                    className="bg-yellow-500 text-white 
                    text-[8px] xs:text-[10px] sm:text-xs 
                    font-medium 
                    px-1.5 xs:px-2 sm:px-3 
                    py-0.5 xs:py-0.5 sm:py-1 
                    rounded-full whitespace-nowrap"
                  >
                    Only {item.quantity} left
                  </span>
                </div>
              ) : null}

              <div
                className="p-4 cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50 relative group">
                  <img
                    src={item.itemImage ?? "https://via.placeholder.com/150"}
                    alt={item.itemName}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] text-sm">
                    {item.itemName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Weight: {item.weight}{" "}
                    {item.units == "pcs"
                      ? "Pc"
                      : item.weight == "1"
                      ? "Kg"
                      : item.units}
                  </p>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.itemPrice}
                    </span>
                    {item.itemMrp && item.itemMrp > item.itemPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.itemMrp}
                      </span>
                    )}
                  </div>

                  {item.quantity !== 0 ? (
                    isItemUserAdded(item.itemId) ? (
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1 mt-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, false, "sub");
                          }}
                          disabled={loadingItems.items[item.itemId]}
                        >
                          -
                        </motion.button>
                        {loadingItems.items[item.itemId] ? (
                          <Loader2 className="animate-spin text-purple-600" />
                        ) : (
                          <span className="font-medium text-purple-700">
                            {cartItems[item.itemId] || 0}
                          </span>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className={`w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 ${
                            cartItems[item.itemId] >= item.quantity
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (cartItems[item.itemId] < item.quantity) {
                              handleQuantityChange(item, true, "Add");
                            }
                          }}
                          disabled={
                            cartItems[item.itemId] >= item.quantity ||
                            loadingItems.items[item.itemId] ||
                            (item.itemPrice === 1 &&
                              cartItems[item.itemId] >= 1)
                          }
                        >
                          +
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 mt-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg transition-all duration-300 hover:shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        disabled={loadingItems.items[item.itemId]}
                      >
                        {loadingItems.items[item.itemId] ? (
                          <Loader2 className="mr-2 animate-spin inline-block" />
                        ) : (
                          "Add to Cart"
                        )}
                      </motion.button>
                    )
                  ) : (
                    <button
                      className="w-full py-2 mt-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Categories;
