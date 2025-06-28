import React, { useState, useEffect, useRef } from "react";
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
  categoryLogo?: string;
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
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [stockModal, setStockModal] = useState<{
    visible: boolean;
    content: string;
  }>({
    visible: false,
    content: "",
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

  // Ref for scrolling to items section
  const itemsRef = useRef<HTMLDivElement>(null);

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

  const handleCategoryClick = (categoryName: string) => {
    // If the same category is clicked again, deselect it
    if (categoryName === activeCategory) {
      onCategoryClick(""); // Set no active category
      return;
    }

    onCategoryClick(categoryName);

    // Scroll to items section after a short delay
    setTimeout(() => {
      if (itemsRef.current) {
        itemsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

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
          continue;
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
          continue;
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
          continue;
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

        const isExcluded = userEligibleOffers.some(
          (eligibleOffer: UserEligibleOffer) => {
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
          }
        );

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
        if (goldBarItemIds.includes(item.itemId)) {
          return false;
        }
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

  // Filter out "All Items" category
  const filteredCategories = categories.filter(
    (category) => category.categoryName.toLowerCase() !== "all items"
  );
  
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className="flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
      >
        <div className="aspect-square bg-gray-200"></div>
        <div className="flex flex-col flex-grow p-3 sm:p-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="mt-2 h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="mt-auto pt-3 h-9 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);


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
        title="Stock Information"
        open={stockModal.visible}
        onCancel={() => setStockModal({ visible: false, content: "" })}
        footer={null}
        centered
      >
        <p dangerouslySetInnerHTML={{ __html: stockModal.content }} />
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

    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-3 mb-6">
  {filteredCategories.map((category, index) => (
    <motion.button
      key={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleCategoryClick(category.categoryName)}
      className={`flex flex-col items-center justify-center text-center rounded-xl p-2 sm:p-3 transition-all duration-300 space-y-1 ${
        activeCategory === category.categoryName
          ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-600 border border-purple-300 shadow-md"
          : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Category Image or Initial - Square with rounded corners */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 border border-white shadow-sm flex items-center justify-center">
        {category.categoryLogo || category.categoryImage ? (
          <img
            src={(category.categoryLogo || category.categoryImage) ?? ""}
            alt={category.categoryName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.remove();
              const span = document.createElement("span");
              span.innerText = category.categoryName.charAt(0);
              span.className =
                "text-purple-600 font-bold text-[10px] sm:text-sm";
              e.currentTarget.parentElement?.appendChild(span);
            }}
          />
        ) : (
          <span className="text-purple-600 font-bold text-[12px] sm:text-sm">
            {category.categoryName.charAt(0)}
          </span>
        )}
      </div>

      {/* Category Name - larger, bold, and active color */}
      <p
        className={`text-[12px] sm:text-sm font-bold leading-tight text-center line-clamp-2 ${
          activeCategory === category.categoryName
            ? "text-purple-600"
            : "text-gray-700"
        }`}
      >
        {category.categoryName}
      </p>
    </motion.button>
  ))}
</div>

      {/* Weight Filters Section */}
      {activeCategory && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {weightFilters.map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWeightFilterClick(filter.value)}
                disabled={disabledFilters[filter.value]}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeWeightFilter === filter.value
                    ? "bg-purple-600 text-white shadow-lg"
                    : disabledFilters[filter.value]
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Section */}
      {getCurrentSubCategories().length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {getCurrentSubCategories().map((subCategory) => (
              <motion.button
                key={subCategory.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setActiveSubCategory(
                    activeSubCategory === subCategory.id ? null : subCategory.id
                  )
                }
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSubCategory === subCategory.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-white text-green-600 border border-green-200 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                {subCategory.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Items Section */}
      <div ref={itemsRef} className="mb-6">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {getCurrentCategoryItems().map((item) => {
              const discount = calculateDiscount(item.itemMrp, item.itemPrice);
              const isInCart = cartItems[item.itemId] > 0;
              const isLoading = loadingItems.items[item.itemId];
              const loadingStatus = loadingItems.status[item.itemId];

              return (
                <div
                  key={item.itemId}
                  className="flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div
                    className="aspect-square relative overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    {item.itemImage ? (
                      <img
                        src={item.itemImage}
                        alt={item.itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.itemName
                          )}&background=f3f4f6&color=6b7280&size=200`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                        <span className="text-purple-600 font-semibold text-lg">
                          {item.itemName.charAt(0)}
                        </span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-grow p-3 sm:p-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
                        {item.itemName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.weight} {item.units}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">
                          ₹{item.itemPrice}
                        </span>
                        {item.itemMrp > item.itemPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.itemMrp}
                          </span>
                        )}
                      </div>
                      {/* Stock Info Button */}
                      {/* <button
            className="text-xs text-blue-500 underline"
            onClick={() =>
              setStockModal({
                visible: true,
                content:
                  item.quantity === 0
                    ? `<strong>${item.itemName}</strong> is currently <span style="color:red;">out of stock</span>.`
                    : `Only <strong>${item.quantity}</strong> left in stock for <strong>${item.itemName}</strong>.`,
              })
            }
          >
            Stock Info
          </button> */}
                    </div>

                    <div className="flex-grow"></div>

                    {/* Add to Cart or Quantity Selector */}
                    <div className="pt-3 mt-auto">
                      {!isInCart ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-3 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              <span>Add to Cart</span>
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item, false, "decrease")
                            }
                            disabled={isLoading && loadingStatus === "decrease"}
                            className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading && loadingStatus === "decrease" ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span className="text-sm font-bold">−</span>
                            )}
                          </motion.button>

                          <span className="px-3 py-1 bg-white rounded-md font-semibold text-purple-600 min-w-[2rem] text-center">
                            {cartItems[item.itemId] || 0}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item, true, "increase")
                            }
                            disabled={isLoading && loadingStatus === "increase"}
                            className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading && loadingStatus === "increase" ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span className="text-sm font-bold">+</span>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Items Message */}
        {!loading && getCurrentCategoryItems().length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m8-8v2m0 6V9.5m0 0L10 12l2-2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              {activeWeightFilter
                ? `No items available for ${activeWeightFilter} kg weight filter.`
                : "No items available in this category."}
            </p>
            {activeWeightFilter && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveWeightFilter(null)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Weight Filter
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
