import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import BASE_URL from "../Config";
import { ShoppingBag, ChevronLeft, ChevronRight, Info } from "lucide-react";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null | string;
  weight: number | string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
  bmvCoins?: number;
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
  categoryType: string; // ✅ NEW
}

type AddOnItem = {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemMrp: number;
  itemImage: string;
  weight: number;
  units: string;
  quantity: number;
  title: string;
  image: string;
  description: string;
  path: string;
  status: string;
  icon: JSX.Element;
};

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
  selectedType?: string | null;
  selectedCategory?: string | null;
  selectedWeight?: string | null;
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
  setActiveCategory,
  selectedType,
  selectedCategory,
  selectedWeight,
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category");
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
  const [isBmvModalVisible, setIsBmvModalVisible] = useState(false);
  const [comboAddOnModal, setComboAddOnModal] = useState<{
    visible: boolean;
    items: AddOnItem[];
    itemCount: number;
  }>({
    visible: false,
    items: [],
    itemCount: 0,
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
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>("ALL");
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(
    "0"
  );
  const categoryTypes = ["ALL", "RICE", "GOLD", "GROCERY", "FESTIVAL"];
  const [activeCategoryType, setActiveCategoryType] = useState<string>("ALL");
  const [activeWeightFilter, setActiveWeightFilter] = useState<string | null>(
    null
  );
  const [hasAddedComboAddOn, setHasAddedComboAddOn] = useState(false);
  const [disabledFilters, setDisabledFilters] = useState<{
    [key: string]: boolean;
  }>({});

  const itemsRef = useRef<HTMLDivElement>(null);

  const weightFilters = [
    { label: "1 KG", value: "1.0" },
    { label: "5 KG", value: "5.0" },
    { label: "10 KG", value: "10.0" },
    { label: "26 KG", value: "26.0" },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const categoryFromQuery =
      queryParams.get("category") || location.state?.selectedCategory || null;
    const typeFromQuery =
      queryParams.get("type") || location.state?.selectedType || null;
    const weight = queryParams.get("weight");

    if (categoryFromQuery) {
      setActiveCategory(categoryFromQuery);
    }

    if (typeFromQuery) {
      setActiveCategoryType(typeFromQuery.toUpperCase());
    }

    if (weight && weightFilters.some((filter) => filter.value === weight)) {
      setActiveWeightFilter(weight);
    } else {
      setActiveWeightFilter(null);
    }

    // Scroll to items
    setTimeout(() => {
      if (itemsRef.current) {
        itemsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, [location.search]);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === activeCategory) {
      setActiveCategory("");
      onCategoryClick("");
    } else {
      setActiveCategory(categoryName);
      onCategoryClick(categoryName);
    }
    setTimeout(() => {
      if (itemsRef.current) {
        itemsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      (scrollContainerRef.current as HTMLDivElement).scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      (scrollContainerRef.current as HTMLDivElement).scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
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
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is applicable once.</i>`,
          });
          newDisplayedOffers.add(`5+2_${addItem.itemId}`);
        }
      }
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
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/activeOffers`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const activeOffers = response.data || [];
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

  const handleAddToCart = async (item: Item & { status?: string }) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken || !userId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => {
        navigate("/whatapplogin");
      }, 2000);
      return;
    }

    try {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: true },
      }));

      const weight = parseFloat(String(item.weight ?? "0"));
      const isCombo = item.status === "COMBO";

      const requestBody: any = {
        customerId: userId,
        itemId: item.itemId,
        quantity: 1,
      };

      if (isCombo) {
        requestBody.status = "COMBO";
      }

      // ✅ Add item to cart
      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        requestBody,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await fetchCartData(item.itemId);

      if (!isCombo) {
        try {
          const response = await axios.get(
            `${BASE_URL}/product-service/getComboInfo/${item.itemId}`
          );
          const comboItems = response.data?.items || [];

          if (comboItems.length > 0) {
            const itemCount = comboItems.length;

            setComboAddOnModal({
              visible: true,
              items: comboItems.map((i: any) => ({
                itemId: i.individualItemId,
                itemName: i.itemName,
                itemPrice: i.itemPrice,
                itemMrp: i.itemMrp ?? i.itemPrice,
                itemImage: i.imageUrl,
                weight: i.itemWeight,
                units: i.units,
                quantity: i.quantity ?? 1,
                status: "COMBO",
                title: i.itemName,
                image: i.imageUrl,
                description: "",
                path: "",
                icon: <ShoppingBag className="text-purple-600" size={24} />,
              })),
              itemCount,
            });

            return;
          }
        } catch (comboErr) {
          console.error("Error fetching combo offer:", comboErr);
        }
      }

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
    let items: Item[] = [];

    if (!categories || categories.length === 0) return items;

    // 1️⃣ Category selected
    if (activeCategory && activeCategory !== "") {
      const categoryMatch = categories.find(
        (cat) => cat.categoryName.toLowerCase() === activeCategory.toLowerCase()
      );
      if (categoryMatch) {
        items = categoryMatch.itemsResponseDtoList || [];
      }
    }

    // 2️⃣ If no category selected, use categoryType
    if (!activeCategory || items.length === 0) {
      if (activeCategoryType === "ALL") {
        items = categories.flatMap((cat) => cat.itemsResponseDtoList || []);
      } else {
        items = categories
          .filter(
            (cat) =>
              cat.categoryType?.toUpperCase() ===
              activeCategoryType.toUpperCase()
          )
          .flatMap((cat) => cat.itemsResponseDtoList || []);
      }
    }

    // 3️⃣ Apply weight filter (optional)
    if (activeWeightFilter) {
      const filterValue = parseFloat(activeWeightFilter).toFixed(1);
      items = items.filter((item) => {
        const itemWeight = parseFloat(item.weight.toString()).toFixed(1);
        return itemWeight === filterValue;
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

      const payload: any = {
        customerId: userId,
        itemId: item.itemId,
      };

      // ✅ Include COMBO status in payload if applicable
      if (status === "COMBO") {
        payload.status = "COMBO";
      }

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

  // Add these handler functions:
  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 100);
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

  const getFilteredCategories = () => {
    if (activeCategoryType === "ALL") {
      return categories;
    }

    return categories.filter(
      (category) => category.categoryType?.toUpperCase() === activeCategoryType
    );
  };

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
  const gridCols =
    comboAddOnModal.itemCount === 1
      ? "grid-cols-1"
      : comboAddOnModal.itemCount === 2
      ? "grid-cols-2"
      : "grid-cols-3";

  return (
    <div className="bg-white shadow-lg px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
      <style>
        {`
      .offers-scroll-container::-webkit-scrollbar {
        display: none;
      }
      .offers-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}
      </style>

      {/* CategoryType Filter */}
      <div className="w-full px-1 sm:px-4 mb-3 sm:mb-4 mt-2 sm:mt-4 border-b border-gray-300">
        <div className="flex md:flex-wrap overflow-x-auto md:overflow-x-visible scrollbar-hide gap-2 sm:gap-4 pb-2 px-1 scroll-smooth snap-x">
          {categoryTypes.map((type, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveCategoryType(type);
                setActiveCategory("");
              }}
              className={`flex-shrink-0 snap-start whitespace-nowrap transition-all duration-300 text-xs sm:text-sm font-medium border-b-2 rounded-t-md px-4 py-2 ${
                activeCategoryType === type
                  ? "border-purple-600 text-purple-700 bg-purple-50"
                  : "border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300"
              } 
        w-1/2 sm:w-auto`} // 🟢 👈 Force 2 buttons per row on mobile
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Offers Modal */}
      <Modal
        title="Available Offers"
        open={isOffersModalVisible}
        onCancel={handleOffersModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 text-sm"
            onClick={handleOffersModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="95%"
        style={{ maxWidth: "600px" }}
        bodyStyle={{ maxHeight: "70vh", padding: "12px" }}
      >
        {isFetchingOffers ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-purple-600" size={24} />
          </div>
        ) : offers.length > 0 ? (
          <div
            className="space-y-3 offers-scroll-container"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {offers.map((offer) => (
              <div key={offer.id} className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-purple-800 text-sm sm:text-base">
                  {offer.offerName}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-sm">
            No offers available at the moment.
          </p>
        )}
      </Modal>

      {/* Stock Modal */}
      <Modal
        title="Stock Information"
        open={stockModal.visible}
        onCancel={() => setStockModal({ visible: false, content: "" })}
        footer={null}
        centered
        width="95%"
        style={{ maxWidth: "500px" }}
      >
        <div className="p-2">
          <p dangerouslySetInnerHTML={{ __html: stockModal.content }} />
        </div>
      </Modal>

      {/* Offer Modal */}
      <Modal
        title="Special Offer!"
        open={offerModal.visible}
        onCancel={handleOfferModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 text-sm"
            onClick={handleOfferModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="95%"
        style={{ maxWidth: "600px" }}
      >
        <div
          className="p-2"
          dangerouslySetInnerHTML={{
            __html: offerModal.content,
          }}
        />
      </Modal>

      {/* Horizontal Scrollable Categories */}
      <div className="relative w-full mb-3 sm:mb-4">
        {/* Arrows only on desktops (md and up) */}
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={scrollLeft}
            className="hidden md:block absolute left-1 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </motion.button>
        )}

        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={scrollRight}
            className="hidden md:block absolute right-1 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </motion.button>
        )}

        {/* Gradient overlays only for desktop/tablet */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrollable Content - touch-scroll on mobile only */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto md:overflow-x-hidden scrollbar-hide py-2 px-2 sm:px-4 scroll-smooth snap-x"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onScroll={handleScroll}
        >
          {getFilteredCategories().map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.categoryName)}
              className={`flex-shrink-0 snap-start flex flex-col items-center justify-center text-center p-2 transition-all duration-300 space-y-1 w-1/3 sm:w-[90px] md:w-[100px] lg:w-[110px] ${
                activeCategory === category.categoryName
                  ? "border-b-2 border-purple-500"
                  : ""
              }`}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
                  activeCategory === category.categoryName
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                {category.categoryLogo || category.categoryImage ? (
                  <img
                    src={
                      (category.categoryLogo || category.categoryImage) ?? ""
                    }
                    alt={category.categoryName}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.remove();
                      const span = document.createElement("span");
                      span.innerText = category.categoryName.charAt(0);
                      span.className = `font-bold text-xs ${
                        activeCategory === category.categoryName
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`;
                      e.currentTarget.parentElement?.appendChild(span);
                    }}
                  />
                ) : (
                  <span
                    className={`font-bold text-xs ${
                      activeCategory === category.categoryName
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  >
                    {category.categoryName.charAt(0)}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-medium leading-tight text-center line-clamp-2 ${
                  activeCategory === category.categoryName
                    ? "text-purple-600"
                    : "text-gray-700"
                }`}
              >
                {category.categoryName.length > 8
                  ? category.categoryName.substring(0, 8) + "..."
                  : category.categoryName}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Weight Filters - Only for RICE and fully visible row */}
      {activeCategoryType === "RICE" && (
        <div className="mb-3 sm:mb-5 px-2">
          <div className="flex flex-wrap gap-2 justify-start">
            {weightFilters.map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleWeightFilterClick(filter.value)}
                disabled={disabledFilters[filter.value]}
                className={`w-[70px] text-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeWeightFilter === filter.value
                    ? "bg-purple-600 text-white shadow"
                    : disabledFilters[filter.value]
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-50"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Sub Categories */}
      {getCurrentSubCategories().length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="overflow-x-auto scrollbar-hide px-2 sm:px-0">
            <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 py-2">
              {getCurrentSubCategories().map((subCategory) => (
                <motion.button
                  key={subCategory.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setActiveSubCategory(
                      activeSubCategory === subCategory.id
                        ? null
                        : subCategory.id
                    )
                  }
                  className={`flex-shrink-0 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap ${
                    activeSubCategory === subCategory.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ring-2 ring-green-300"
                      : "bg-white text-green-700 border-2 border-green-200 hover:bg-green-50 hover:border-green-400 hover:text-green-800"
                  }`}
                >
                  {subCategory.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div ref={itemsRef} className="mb-4 sm:mb-6">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4 px-2 sm:px-0">
            {getCurrentCategoryItems().map((item) => {
              const discount = calculateDiscount(item.itemMrp, item.itemPrice);
              const isInCart = cartItems[item.itemId] > 0;
              const isLoading = loadingItems.items[item.itemId];
              const loadingStatus = loadingItems.status[item.itemId];

              return (
                <div
                  key={item.itemId}
                  className="flex flex-col justify-between bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
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
                        <span className="text-purple-600 font-semibold text-sm sm:text-lg">
                          {item.itemName.charAt(0)}
                        </span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow p-2 sm:p-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-xs sm:text-base text-gray-800 line-clamp-2">
                        {item.itemName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.weight} {item.units}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm sm:text-lg font-bold text-purple-600">
                          ₹{item.itemPrice}
                        </span>
                        {item.itemMrp > item.itemPrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{item.itemMrp}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.bmvCoins !== undefined && item.bmvCoins > 0 && (
                      <div
                        className="w-full flex items-center justify-between text-xs rounded px-2 py-1 mt-1"
                        style={{ backgroundColor: "#FFF8DC", color: "#B8860B" }}
                      >
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{item.bmvCoins}</span>{" "}
                          BMVCOINS
                        </div>
                        <Info
                          className="w-4 h-4 text-black-600 cursor-pointer hover:text-purple-800"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ prevent modal from opening when clicking the icon
                            setIsBmvModalVisible(true);
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-grow"></div>

                    <div className="pt-2 sm:pt-3 mt-auto">
                      {!isInCart ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
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
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading && loadingStatus === "decrease" ? (
                              <Loader2 className="w-2 h-2 sm:w-3 sm:h-3 animate-spin" />
                            ) : (
                              <span className="text-xs sm:text-sm font-bold">
                                −
                              </span>
                            )}
                          </motion.button>
                          <span className="px-2 sm:px-3 py-1 bg-white rounded-md font-semibold text-purple-600 min-w-[1.5rem] min-w-[2.5rem] sm:min-w-[2.5rem] text-center text-xs sm:text-sm">
                            {cartItems[item.itemId] || 0}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item, true, "increase")
                            }
                            disabled={isLoading && loadingStatus === "increase"}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading && loadingStatus === "increase" ? (
                              <Loader2 className="w-2 h-2 sm:w-3 sm:h-3 animate-spin" />
                            ) : (
                              <span className="text-xs sm:text-sm font-bold">
                                +
                              </span>
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

        {/* Empty State */}
        {!loading && getCurrentCategoryItems().length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
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
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base px-4">
              {activeWeightFilter
                ? `No items available for ${activeWeightFilter} kg weight filter.`
                : "No items available in this category."}
            </p>
            {activeWeightFilter && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveWeightFilter(null)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Clear Weight Filter
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Combo Add-On Modal */}
      <Modal
        open={comboAddOnModal.visible}
        onCancel={() => {
          setComboAddOnModal({ visible: false, items: [], itemCount: 0 });
          setHasAddedComboAddOn(false);
        }}
        footer={null}
        centered
        title={
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-purple-700 mb-1">
              Special Offer Add-on
            </h3>
            <p className="text-xs text-gray-600">
              Choose your favorite add-on and save more!
            </p>
          </div>
        }
        className="special-offer-modal"
        width={
          comboAddOnModal.itemCount === 1
            ? "320px"
            : comboAddOnModal.itemCount === 2
            ? "600px"
            : "900px"
        }
        style={{ maxWidth: "95vw" }}
      >
        <div
          className={`grid gap-2 sm:gap-3 ${
            comboAddOnModal.itemCount === 1
              ? "grid-cols-1 max-w-xs mx-auto"
              : comboAddOnModal.itemCount === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : comboAddOnModal.itemCount <= 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          } justify-items-center`}
        >
          {comboAddOnModal.items.map((addonItem) => {
            const discountPercentage = addonItem.itemMrp
              ? Math.round(
                  ((addonItem.itemMrp - addonItem.itemPrice) /
                    addonItem.itemMrp) *
                    100
                )
              : 0;

            return (
              <div
                key={addonItem.itemId}
                className="bg-white border-2 border-purple-100 rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300 relative overflow-hidden w-full max-w-[280px]"
              >
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold z-10">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Selection Badge */}
                {hasAddedComboAddOn && (
                  <div className="absolute top-1.5 right-1.5 bg-purple-600 text-white rounded-full p-1 z-10">
                    <svg
                      className="w-2.5 h-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative mb-2">
                  <div className="w-2/3 sm:w-3/4 aspect-square mx-auto bg-gradient-to-br from-purple-50 to-purple-100 rounded-md overflow-hidden border border-purple-100">
                    {addonItem.itemImage ? (
                      <img
                        src={addonItem.itemImage}
                        alt={addonItem.itemName}
                        className="w-full h-full object-contain p-1.5"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback =
                              parent.querySelector(".fallback-icon");
                            if (fallback) {
                              (fallback as HTMLElement).style.display = "flex";
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="fallback-icon absolute inset-0 w-full h-full items-center justify-center text-purple-300"
                      style={{ display: addonItem.itemImage ? "none" : "flex" }}
                    >
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[2rem]">
                    {addonItem.itemName}
                  </h4>

                  {/* Price Section */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="text-purple-600 font-bold text-base sm:text-lg">
                        ₹{addonItem.itemPrice}
                      </span>
                      {addonItem.itemMrp &&
                        addonItem.itemMrp > addonItem.itemPrice && (
                          <span className="text-gray-500 text-xs line-through">
                            ₹{addonItem.itemMrp}
                          </span>
                        )}
                    </div>

                    {/* Savings Info */}
                    {addonItem.itemMrp &&
                      addonItem.itemMrp > addonItem.itemPrice && (
                        <div className="text-green-600 text-xs font-medium">
                          You save ₹{addonItem.itemMrp - addonItem.itemPrice}
                        </div>
                      )}
                  </div>

                  {/* Add Button */}
                  <motion.button
                    whileHover={{ scale: hasAddedComboAddOn ? 1 : 1.02 }}
                    whileTap={{ scale: hasAddedComboAddOn ? 1 : 0.98 }}
                    className={`w-full py-2 rounded-md font-medium text-xs transition-all duration-200 ${
                      hasAddedComboAddOn
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => {
                      if (!hasAddedComboAddOn) {
                        handleAddToCart({
                          ...(addonItem as Item),
                          status: "COMBO",
                        });
                        setHasAddedComboAddOn(true);
                        setComboAddOnModal({
                          visible: false,
                          items: [],
                          itemCount: 0,
                        });
                      } else {
                        message.warning(
                          "You can only select one optional add-on."
                        );
                      }
                    }}
                    disabled={hasAddedComboAddOn}
                  >
                    {hasAddedComboAddOn ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add-on Selected
                      </span>
                    ) : (
                      "Add Add-on"
                    )}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Info */}
        <div className="text-center p-2 sm:p-3 bg-gray-50 mx-1 sm:mx-2 mb-1 sm:mb-2 rounded-md mt-3">
          <p className="text-xs text-gray-600">
            <span className="font-medium">🎉 Special Offer:</span> Add any item
            to your combo and enjoy exclusive discounts!
          </p>
        </div>
      </Modal>

      <Modal
        title="BMVCOINS Info"
        open={isBmvModalVisible}
        onCancel={() => setIsBmvModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-gray-700 text-sm space-y-2">
          <p>
            <strong>Current Value:</strong> ₹0.02 per coin
          </p>
          <p>
            <strong>Future Value:</strong> ₹1+{" "}
            <span className="italic text-xs text-gray-500">
              (Projected value – no guarantee)
            </span>
          </p>
          <p>
            1,000 coins = <strong>₹20</strong>
          </p>
          <hr />
          <p className="font-medium text-purple-700">
            Minimum redemption amount
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>Transfer to friends and family</li>
            <li>Share with other ASKOXY.AI users</li>
            <li>Use on non-GST items</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
