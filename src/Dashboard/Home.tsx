import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Bot,
  Info,
  ShoppingBag,
  Loader2,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Settings,
  HandCoins,
  Gem,
  Globe,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BASE_URL from "../Config";
import checkProfileCompletion from "../until/ProfileCheck";
import { CartContext } from "../until/CartContext";
import ProductOfferModals from "./ProductOffermodals";
import RiceOfferFAQs from "./Faqs";
import ProductImg1 from "../assets/img/ricecard1.png";

import CryptoImg1 from "../assets/img/bmvcoin.png";

import O8 from "../assets/img/aitemplate.png";

import O5 from "../assets/img/cashewoffer1.png";
import O6 from "../assets/img/35kg1.png";
import CB from "../assets/img/cashback offer png.png";
import Cashew from "../assets/img/rakhi1.png";
import Riceoffers from "../assets/img/rice offers.png";
import festive from "../assets/img/festive.webp";

import gold from "../assets/img/gold.png";
import allitems from "../assets/img/all items.png";
import grocerie from "../assets/img/Groceries.png";
import rice from "../assets/img/rice.png";

// Define interfaces for Offer and UserEligibleOffer
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

interface AddOnItem {
  itemId: string;
  itemName: string;
  itemImage: string | null;
  itemPrice: number;
  itemMrp: number;
  weight: string;
  units: string;
  quantity: number;
  status: string;
}

interface UserEligibleOffer {
  offerName: string;
  eligible: boolean;
  weight: number;
}

// Product Skeleton Component
const ProductSkeleton: React.FC<{ index: number }> = ({ index }) => {
  return (
    <motion.div
      key={`skeleton-${index}`}
      custom={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden relative transform transition-all duration-200 border border-gray-100"
    >
      <div className="p-3">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3 mt-2" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-full mt-2" />
        </div>
      </div>
    </motion.div>
  );
};

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

interface HeaderImage {
  id: string | number;
  src: string;
  alt?: string;
  path: string;
  onClick?: () => void;
}

interface DashboardItem {
  id?: string;
  itemId?: string;
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  itemName?: string;
  itemImage?: string | null;
  itemPrice?: number;
  itemMrp?: number;
  quantity?: number;
  weight?: string;
  units?: string;
  isCombo?: boolean;
  status?: string;
  bmvCoins?: number;
}

interface Item {
  itemName: string;
  itemId: string;
  itemImage: string | null;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
  categoryName: string;
  categoryType?: string;
  bmvCoins?: number;
}

interface Category {
  categoryName: string;
  categoryImage: string | null;
  itemsResponseDtoList: Item[];
  subCategories: any[];
}

const Home: React.FC = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Home must be used within a CartProvider");
  }
  const { count, setCount } = context;
  const [products, setProducts] = useState<DashboardItem[]>([]);
  const [displayProducts, setDisplayProducts] = useState<DashboardItem[]>([]);
  const [displayCount, setDisplayCount] = useState(5);
  const [services, setServices] = useState<DashboardItem[]>([]);
  const [freeGPTs, setFreeGPTs] = useState<DashboardItem[]>([]);
  const [cryptocurrency, setCryptocurrency] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  // const [hoveredImage, setHoveredImage] = useState<string | number | null>(
  //   null
  // );
  const [isHovered, setIsHovered] = useState(false); // NEW: State to track hover status
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const IMAGES_PER_SET = 3;
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [bmvModalItem, setBmvModalItem] = useState<DashboardItem | null>(null);

  const [activeCategoryType, setActiveCategoryType] = useState<string>("");
  const [isBmvModalVisible, setIsBmvModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    "All Items"
  );
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAddedComboAddOn, setHasAddedComboAddOn] = useState(false);
  const navigate = useNavigate();
  const categoriesFetched = useRef(false);
  const initialDataFetched = useRef(false);

  // New states for offers modal
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

  // Existing states
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [comboAddOnModal, setComboAddOnModal] = useState<{
    visible: boolean;
    items: AddOnItem[];
    itemCount: number;
  }>({
    visible: false,
    items: [],
    itemCount: 0,
  });

  const updateCartCount = useCallback(
    (count: number) => {
      setCartCount(count);
      setCount(count);
    },
    [setCount]
  );

  const weightFilters = [
    { label: "1 KG", value: "1.0" },
    { label: "5 KG", value: "5.0" },
    { label: "10 KG", value: "10.0" },
    { label: "26 KG", value: "26.0" },
  ];
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);

  const fetchCartData = useCallback(
    async (itemId: string = "") => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      if (itemId !== "") {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: true },
        }));
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${userId}`
        );

        const cartList = response.data?.customerCartResponseList || [];

        if (cartList.length > 0) {
          const cartItemsMap = cartList.reduce(
            (acc: Record<string, number>, item: CartItem) => {
              acc[item.itemId] = Number(item.cartQuantity) || 0;
              return acc;
            },
            {}
          );

          const totalQuantity = Object.values(cartItemsMap).reduce(
            (sum: number, qty: unknown) => {
              return sum + (typeof qty === "number" ? qty : 0);
            },
            0
          );

          setCartItems(cartItemsMap);
          setCartData(cartList);
          localStorage.setItem("cartCount", cartList.length.toString());
          setCartCount(Math.round(totalQuantity));
          setCount(Math.round(totalQuantity));
        } else {
          setCartItems({});
          setCartData([]);
          localStorage.setItem("cartCount", "0");
          setCartCount(0);
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        if (itemId !== "") {
          setLoadingItems((prev) => ({
            ...prev,
            items: { ...prev.items, [itemId]: false },
          }));
        }
      }
    },
    [updateCartCount, setCount]
  );

  const {
    handleItemAddedToCart,
    freeItemsMap,
    movieOfferMap,
    setFreeItemsMap,
    setMovieOfferMap,
  } = ProductOfferModals({
    fetchCartData,
    cartData,
    cartItems,
  });

  // New function to normalize weight
  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

  // New function to fetch user-eligible offers
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

  // New function to fetch active offers
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
      console.log("Filtered offers:", filteredOffers);

      if (filteredOffers.length > 0) {
        await fetchCartData();
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      message.error("Failed to load offers.");
      setOffers([]);
    } finally {
      setIsFetchingOffers(false);
    }
  };

  const sortItemsByName = (items: Item[]): Item[] => {
    return [...items]
      .filter((item) => item.quantity > 0)
      .sort((a, b) => a.itemName.localeCompare(b.itemName));
  };

  const updateProducts = (items: Item[]) => {
    setProductsLoading(true);
    const productItems = items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        itemId: item.itemId,
        title: item.itemName,
        image: item.itemImage || ProductImg1,
        description: `₹${item.itemPrice || 0}`,
        path: `/item/${item.itemId}`,
        icon: <ShoppingBag className="text-purple-600" size={24} />,
        itemPrice: item.itemPrice,
        itemMrp: item.itemMrp,
        quantity: item.quantity,
        weight: item.weight,
        units: item.units,
        itemName: item.itemName,
        itemImage: item.itemImage,
        bmvCoins: item.bmvCoins,
      }));

    setProducts(productItems);
    setTimeout(() => {
      setProductsLoading(false);
    }, 300);
  };

  const fetchCategories = useCallback(async () => {
    if (categoriesFetched.current) return;

    setProductsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showGroupItemsForCustomrs`
      );
      const data = response.data || [];

      // Log raw API response for debugging
      console.log("Raw API Response:", response.data);

      // Collect all unique items grouped by categoryType
      const uniqueItemsMap = new Map<string, Item>();
      data.forEach(
        (categoryGroup: { categoryType: string; categories: Category[] }) => {
          categoryGroup.categories.forEach((category: Category) => {
            category.itemsResponseDtoList.forEach((item: Item) => {
              if (item.quantity > 0) {
                const normalizedName = item.itemName.trim().toLowerCase();
                if (
                  !Array.from(uniqueItemsMap.values()).some(
                    (existing: Item) =>
                      existing.itemName.trim().toLowerCase() === normalizedName
                  )
                ) {
                  uniqueItemsMap.set(item.itemId, {
                    ...item,
                    categoryName: category.categoryName || "Uncategorized",
                    categoryType: categoryGroup.categoryType,
                  });
                }
              }
            });
          });
        }
      );

      const uniqueItemsList = Array.from(uniqueItemsMap.values());
      const sortedUniqueItems = sortItemsByName(uniqueItemsList);

      // Log unique items to verify category assignments
      console.log(
        "Unique Items:",
        uniqueItemsList.map((item: Item) => ({
          itemName: item.itemName,
          itemId: item.itemId,
          categoryName: item.categoryName,
          categoryType: item.categoryType,
          quantity: item.quantity,
        }))
      );

      // Filter items by categoryType
      const allItems = sortedUniqueItems;
      // Prioritize "Cashew nuts upto ₹40 cashback" in Groceries filter
      const groceryItems = sortedUniqueItems
        .filter((item: Item) => item.categoryType?.toLowerCase() === "grocery")
        .sort((a, b) => {
          const aIsCashew = a.categoryName
            ?.toLowerCase()
            .includes("cashew nuts");
          const bIsCashew = b.categoryName
            ?.toLowerCase()
            .includes("cashew nuts");
          if (aIsCashew && !bIsCashew) return -1;
          if (!aIsCashew && bIsCashew) return 1;
          return a.itemName.localeCompare(b.itemName);
        });
      const riceItems = sortedUniqueItems.filter(
        (item: Item) => item.categoryType?.toLowerCase() === "rice"
      );
      const goldItems = sortedUniqueItems.filter(
        (item: Item) => item.categoryType?.toLowerCase() === "gold"
      );
      const rakhiItems = sortedUniqueItems.filter(
        (item: Item) =>
          item.categoryType?.toLowerCase() === "silver" &&
          item.categoryName?.toLowerCase() === "silver"
      );
      // Log filtered items to verify correct categorization
      console.log("All Items Count:", allItems.length);
      console.log("Grocery Items Count:", groceryItems.length);
      console.log(
        "Grocery Items:",
        groceryItems.map((item: Item) => ({
          itemName: item.itemName,
          itemId: item.itemId,
          categoryName: item.categoryName,
        }))
      );
      console.log("Rice Items Count:", riceItems.length);
      console.log("Gold Items Count:", goldItems.length);

      // Define default category images
      const defaultCategoryImages: Record<string, string> = {
        "All Items": allitems,
        Groceries: grocerie,
        Rice: rice,
        Gold: gold,
        Silver: festive,
      };

      // Create fixed categories with images
      const allCategories: Category[] = [
        {
          categoryName: "All Items",
          categoryImage: defaultCategoryImages["All Items"],
          itemsResponseDtoList: allItems,
          subCategories: [],
        },
        {
          categoryName: "Groceries",
          categoryImage: defaultCategoryImages["Groceries"],
          itemsResponseDtoList: groceryItems,
          subCategories: [],
        },
        {
          categoryName: "Rice",
          categoryImage: defaultCategoryImages["Rice"],
          itemsResponseDtoList: riceItems,
          subCategories: [],
        },
        {
          categoryName: "Gold",
          categoryImage: defaultCategoryImages["Gold"],
          itemsResponseDtoList: goldItems,
          subCategories: [],
        },
        {
          categoryName: "Silver", // show "Silver" but fetches SILVER items
          categoryImage: defaultCategoryImages["Silver"],
          itemsResponseDtoList: rakhiItems,
          subCategories: [],
        },
      ];

      // // Log final categories
      // console.log(
      //   "Final Categories:",
      //   allCategories.map((cat) => ({
      //     categoryName: cat.categoryName,
      //     itemCount: cat.itemsResponseDtoList.length,
      //   }))
      // );

      setCategories(allCategories);
      updateProducts(allItems);
      setActiveCategory("All Items"); // Set default category
      categoriesFetched.current = true;
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories. Please try again.");
    } finally {
      setProductsLoading(false);
      setLoading(false);
    }
  }, []);

  // Update useEffect for initial data loading to include offers fetching
  useEffect(() => {
    if (initialDataFetched.current) return;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        setServices(fetchServices());
        setFreeGPTs(fetchFreeGPTs());
        setCryptocurrency(fetchCryptocurrency());
        await fetchCartData();
        await fetchCategories();
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        if (userId && accessToken) {
          await fetchUserEligibleOffers(userId);
        }
        initialDataFetched.current = true;
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchCartData, fetchCategories]);

  const [currentSet, setCurrentSet] = useState(0);

  // New useEffect to trigger offers modal
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
  }, [userEligibleOffers, offers.length]);

  // Existing useEffect for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerImageVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const headerImages: HeaderImage[] = [
    {
      id: "Agent Create",
      src: O8,
      alt: "Agent Create",
      path: "/main/agentcreate",
      onClick: () => {
        navigate("/main/agentcreate");
      },
    },
    {
      id: "Cashback1",
      src: CB,
      alt: "Cashback Offer",
      path: "/main/dashboard/products",
      onClick: () => {
        navigate("/main/dashboard/products", {
          state: { selectedCategory: "All Items" },
        });
      },
    },
    {
      id: "Cashew Offer",
      src: Cashew,
      alt: "Cashew Offer",
      path: "/main/dashboard/products?type=RICE&weight=1.0",
      onClick: () => {
        navigate("/main/dashboard/products?type=RICE&weight=1.0");
      },
    },
    {
      id: "Rice Offer",
      src: Riceoffers,
      alt: "Rice Offer",
      path: "/main/dashboard/products?type=RICE&weight=5.0",
      onClick: () => {
        navigate("/main/dashboard/products?type=RICE&weight=5.0");
      },
    },
    {
      id: "26kg Offer",
      src: O5,
      alt: "26kg Offer",
      path: "/main/dashboard/products?weight=10.0",
      onClick: () => {
        navigate("/main/dashboard/products?type=RICE&weight=10.0");
      },
    },
    {
      id: "26kg Offer",
      src: O6,
      alt: "26kg Offer",
      path: "/main/dashboard/products?weight=26.0",
      onClick: () => {
        navigate("/main/dashboard/products?type=RICE&weight=26.0");
      },
    },
  ];

  const totalSets = Math.ceil(headerImages.length / IMAGES_PER_SET);
  useEffect(() => {
    if (isHovered) return; // NEW: Skip interval if an image is being hovered
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % totalSets);
    }, 4500);

    return () => clearInterval(interval);
  }, [headerImages.length, isHovered]);

  const handleItemClick = (item: Item | DashboardItem) => {
    if ("itemId" in item && item.itemId) {
      navigate(`/main/itemsdisplay/${item.itemId}`, {
        state: {
          itemId: item.itemId,
        },
      });
    }
  };

  const fetchServices = (): DashboardItem[] => {
    return [
      {
        id: "1",
        title: "OxyLoans",
        image: "https://iili.io/FENcMAb.md.png",
        description: "Earn up to 24% P.A. on your investments",
        path: "/main/service/oxyloans-service",
        icon: <HandCoins className="text-purple-600" size={24} />,
      },
      {
        id: "2",
        title: "Study Abroad",
        image: "https://i.ibb.co/8LhJDQTn/study-abroad1.png",
        description: "Complete guidance for international education",
        path: "/studyabroad",
        icon: <Globe className="text-purple-600" size={24} />,
      },
      {
        id: "3",
        title: "Free AI & Gen AI Training",
        image: "https://iili.io/FGCrmbV.md.png",
        description: "Receive a sacred Rudraksha bead",
        path: "/main/services/freeai-genai",
        icon: <Gem className="text-purple-600" size={24} />,
      },
    ];
  };

  const fetchFreeGPTs = (): DashboardItem[] => {
    return [
      {
        id: "1",
        title: "OXYGPT",
        image:
          "https://i.ibb.co/7dFHq44H/study-abroad-b44df112b4ab2a4c2bc9.png",
        description: "AI-powered guidance for all services",
        path: "/genoxy",
        icon: <Bot className="text-white" size={24} />,
      },
    ];
  };

  const fetchCryptocurrency = (): DashboardItem[] => {
    return [
      {
        id: "1",
        title: "Cryptocurrency",
        image: CryptoImg1,
        description: "Track and manage your BMV cryptocurrency",
        path: "/main/crypto",
        icon: <Coins className="text-white" size={24} />,
      },
    ];
  };

  const calculateDiscount = (mrp: number, price: number): number => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleAddToCart = async (item: DashboardItem) => {
    if (!item.itemId) return;

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
        items: { ...prev.items, [item.itemId as string]: true },
      }));

      const weight = parseFloat(item.weight ?? "0");
      const isCombo = item.status === "COMBO";

      const requestBody: any = {
        customerId: userId,
        itemId: item.itemId,
        quantity: 1,
      };

      if (isCombo) {
        requestBody.status = "COMBO";
      }

      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        requestBody,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await fetchCartData(item.itemId);
      message.success(response.data.errorMessage);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "add_to_cart", {
          currency: "INR",
          value: item.itemPrice,
          items: [
            {
              item_id: item.itemId,
              item_name: item.itemName,
              price: item.itemPrice,
              quantity: 1,
              item_category: activeCategory || "General",
            },
          ],
        });
      }

      setTimeout(async () => {
        await handleItemAddedToCart(item);
      }, 300);

      // ✅ Prevent re-opening modal if already added
      if (isCombo && hasAddedComboAddOn) {
        return; // Skip fetching modal again
      }

      if (!isCombo && !hasAddedComboAddOn) {
        try {
          const res = await axios.get(
            `${BASE_URL}/product-service/getComboInfo/${item.itemId}`
          );
          const comboData = res.data;

          if (comboData && comboData.items?.length > 0) {
            const itemCount = comboData.items.length;

            setComboAddOnModal({
              visible: true,
              items: comboData.items.map((i: any) => ({
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
              itemCount, // pass count to customize modal layout
            });
          }
        } catch (error) {
          console.error("Failed to fetch combo info:", error);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId as string]: false },
      }));
    }
  };

  const gridCols =
    comboAddOnModal.itemCount === 1
      ? "grid-cols-1"
      : comboAddOnModal.itemCount === 2
      ? "grid-cols-2"
      : "grid-cols-3";

  const handleQuantityChange = async (
    item: DashboardItem,
    increment: boolean
  ) => {
    if (!item.itemId) return;

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      message.warning("Please login to update cart");
      return;
    }

    if (
      item.quantity !== undefined &&
      cartItems[item.itemId] === item.quantity &&
      increment
    ) {
      message.warning("Sorry, Maximum quantity reached.");
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

    const status = increment ? "add" : "remove";

    try {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId as string]: true },
        status: { ...prev.status, [item.itemId as string]: status },
      }));

      if (!increment && cartItems[item.itemId] <= 1) {
        const targetCartId = cartData.find(
          (cart) => cart.itemId === item.itemId
        )?.cartId;

        const response = await axios.delete(
          `${BASE_URL}/cart-service/cart/remove`,
          {
            data: { id: targetCartId },
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response) {
          message.success("Item removed from cart successfully.");
        } else {
          message.error("Sorry, Please try again");
        }
      } else {
        const endpoint = increment
          ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
          : `${BASE_URL}/cart-service/cart/minusCartItem`;

        const requestBody: any = {
          customerId: userId,
          itemId: item.itemId,
        };

        if (item.status === "COMBO") {
          requestBody.status = "COMBO";
        }

        const method = increment ? "post" : "patch";

        const response = await axios[method](endpoint, requestBody, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response) {
          message.error("Sorry, Please try again");
        }
      }

      await fetchCartData(item.itemId);

      if (increment) {
        setTimeout(async () => {
          await handleItemAddedToCart(item);
        }, 300);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId as string]: false },
        status: { ...prev.status, [item.itemId as string]: "" },
      }));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(147, 51, 234, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
      },
    },
  };

  const renderProductItem = (item: DashboardItem, index: number) => {
    if (item.quantity === 0) {
      return null;
    }

    const weight = parseFloat(item.weight || "0");
    const hasOffer = weight === 1 || weight === 5;

    return (
      <motion.div
        key={item.itemId ?? item.id}
        custom={index}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        variants={cardVariants}
        layoutId={`product-${item.itemId ?? item.id}`}
        onHoverStart={() => setHoveredProduct(item.itemId ?? item.id ?? null)}
        onHoverEnd={() => setHoveredProduct(null)}
        className="bg-white rounded-xl shadow-sm overflow-hidden relative transform transition-all duration-200 border border-gray-100 hover:border-purple-200"
      >
        {item.itemMrp && item.itemPrice && item.itemMrp > item.itemPrice && (
          <div className="absolute left-0 top-0 z-10 w-auto">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-[10px] xs:text-xs sm:text-sm font-bold px-2 py-1 flex items-center">
              {calculateDiscount(item.itemMrp, item.itemPrice)}%
              <span className="ml-1 text-[8px] xs:text-[10px] sm:text-xs">
                Off
              </span>
            </div>
            <div className="absolute bottom-0 right-0 transform translate-y border-t-4 border-r-4 sm:border-t-8 sm:border-r-8 border-t-purple-600 border-r-transparent"></div>
          </div>
        )}

        <div
          className="p-3 cursor-pointer"
          onClick={() => handleItemClick(item)}
        >
          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50 relative group">
            <motion.img
              src={item.image ?? "https://via.placeholder.com/150"}
              alt={item.title}
              className="w-full h-full object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />

            {hoveredProduct === (item.itemId ?? item.id) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-purple-600 bg-opacity-5 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white bg-opacity-90 px-3 py-2 rounded-full shadow-sm"
                >
                  <span className="text-purple-700 font-medium text-sm">
                    Quick View
                  </span>
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] text-sm hover:text-purple-600 transition-colors">
              {item.title}
            </h3>
            {/* <p className="text-sm text-gray-500">
              Weight: {item.weight}{" "}
              {item.units === "pcs"
                ? "Pc"
                : item.units === "gms" && item.weight === "1"
                ? "Gm"
                : item.weight === "1" && item.units === "kg"
                ? "Kg"
                : item.units}
            </p> */}

            <p className="text-sm text-gray-500">
              Weight: {item.weight}{" "}
              {item.units === "pcs"
                ? "Pc"
                : item.units === "gms" && item.weight === "1"
                ? "Gm"
                : item.weight === "1" && item.units === "kg"
                ? "Kg"
                : item.units}
            </p>

            {item.bmvCoins !== undefined && item.bmvCoins > 0 && (
              <div className="text-xs bg-purple-100 text-yellow-800 rounded px-2 py-1 mt-1 inline-flex items-center justify-center gap-1 transform mx-auto">
                Earn: <span className="font-bold">{item.bmvCoins}</span>{" "}
                BMVCOINS
                <Info
                  className="w-4 h-4 text-black-600 cursor-pointer hover:text-purple-800"
                  // 👇 Updated onClick: set both modal item and visibility
                  onClick={(e) => {
                    e.stopPropagation();
                    setBmvModalItem(item); // Store the clicked product for the modal
                    setIsBmvModalVisible(true); // Show the modal
                  }}
                />
              </div>
            )}

            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹{item.itemPrice ?? 0}
              </span>
              {item.itemMrp &&
                item.itemPrice &&
                item.itemMrp > item.itemPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{item.itemMrp}
                  </span>
                )}
            </div>

            {item.itemId && cartItems[item.itemId] > 0 ? (
              <motion.div
                className="flex items-center justify-between bg-purple-50 rounded-lg p-1 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(item, false);
                  }}
                  disabled={
                    item.itemId
                      ? loadingItems.items[item.itemId]
                      : false || localStorage.getItem("TypeLogin") === "Caller"
                  }
                >
                  {item.itemId &&
                  loadingItems.items[item.itemId] &&
                  loadingItems.status[item.itemId] === "remove" ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "-"
                  )}
                </motion.button>

                <motion.span
                  className="font-medium text-purple-700"
                  key={item.itemId ? cartItems[item.itemId] : 0}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.itemId ? cartItems[item.itemId] : 0}
                  {item.itemId && freeItemsMap[item.itemId] && weight === 1 && (
                    <span className="bg-green-100 text-green-600 text-xs ml-1 px-1 rounded">
                      +1 Free
                    </span>
                  )}
                </motion.span>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 ${
                    item.itemId &&
                    item.quantity &&
                    cartItems[item.itemId] >= item.quantity
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      item.itemId &&
                      item.quantity &&
                      cartItems[item.itemId] < item.quantity
                    ) {
                      handleQuantityChange(item, true);
                    }
                  }}
                  disabled={
                    item.itemId && item.quantity
                      ? cartItems[item.itemId] >= item.quantity ||
                        loadingItems.items[item.itemId] ||
                        (item.itemPrice === 1 && cartItems[item.itemId] >= 1)
                      : true || localStorage.getItem("TypeLogin") === "Caller"
                  }
                >
                  {item.itemId &&
                  loadingItems.items[item.itemId] &&
                  loadingItems.status[item.itemId] === "add" ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "+"
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#8b5cf6" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 mt-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg transition-all duration-300 hover:shadow-md text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                  console.log(
                    "Add to cart clicked",
                    localStorage.getItem("TypeLogin")
                  );
                  console.log(
                    item.itemId ? loadingItems.items[item.itemId] : false
                  );
                }}
                disabled={
                  (item.itemId && loadingItems.items[item.itemId]) ||
                  localStorage.getItem("TypeLogin") === "Caller"
                }
              >
                {item.itemId && loadingItems.items[item.itemId] ? (
                  <Loader2
                    className="mr-2 animate-spin inline-block"
                    size={16}
                  />
                ) : (
                  "Add to Cart"
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    let validProducts = products.filter((product) => {
      if (product.quantity === undefined || product.quantity <= 0) return false;

      if (searchTerm.trim() !== "") {
        return product.title.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    });

    if (selectedWeight && activeCategory === "Rice") {
      validProducts = validProducts.filter(
        (product) =>
          parseFloat(product.weight ?? "0") === parseFloat(selectedWeight)
      );
    }

    setDisplayProducts(
      validProducts.slice(0, Math.min(displayCount, validProducts.length))
    );
  }, [products, displayCount, searchTerm, selectedWeight, activeCategory]);

  // *** Updated viewAllProducts function ***
  const viewAllProducts = () => {
    const selectedCategory = activeCategory || "All Items";
    // NEW: Define a mapping of category names to their corresponding category types
    const categoryTypeMap: Record<string, string> = {
      "All Items": "ALL",
      Groceries: "GROCERY",
      Rice: "RICE",
      Gold: "GOLD",
      Silver: "SILVER",
    };

    // NEW: Get the category type based on the active category
    const selectedType = categoryTypeMap[selectedCategory] || "ALL";

    // NEW: Construct query parameters to include type and weight (if applicable)
    const queryParams = new URLSearchParams();
    queryParams.append("type", selectedType.toUpperCase());
    if (selectedWeight && selectedCategory === "Rice") {
      queryParams.append("weight", selectedWeight);
    }

    // NEW: Navigate to the products page with the correct query parameters
    navigate(`/main/dashboard/products?${queryParams.toString()}`, {
      state: { selectedCategory },
    });
  };

  const viewAllServices = () => {
    navigate("/main/dashboard/myservices");
  };

  const handleCategoryChange = (categoryName: string) => {
    if (activeCategory === categoryName) return;

    setActiveCategory(categoryName);
    setProductsLoading(true);

    const category = categories.find(
      (cat) => cat.categoryName === categoryName
    );
    // NEW: Define a mapping of category names to their corresponding category types
    const categoryTypeMap: Record<string, string> = {
      "All Items": "ALL",
      Groceries: "GROCERY",
      Rice: "RICE",
      Gold: "GOLD",
      Silver: "SILVER",
    };

    // NEW: Update the active category type based on the selected category
    setActiveCategoryType(categoryTypeMap[categoryName] || "ALL");

    if (category) {
      const productItems = category.itemsResponseDtoList
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          itemId: item.itemId,
          title: item.itemName,
          image: item.itemImage || ProductImg1,
          description: `₹${item.itemPrice || 0}`,
          path: `/item/${item.itemId}`,
          icon: <ShoppingBag className="text-purple-600" size={24} />,
          itemPrice: item.itemPrice,
          itemMrp: item.itemMrp,
          quantity: item.quantity,
          weight: item.weight,
          units: item.units,
          itemName: item.itemName,
          itemImage: item.itemImage,
        }));

      console.log(`Products for category ${categoryName}:`, productItems);
      setProducts(productItems);
      setDisplayCount(5);
      setSearchTerm("");
      setSelectedWeight(null);
      // NEW: Scroll to the products section smoothly after category change
      // Updated scrolling logic to fix mobile responsiveness
      setTimeout(() => {
        if (productsRef.current) {
          try {
            // Get the element's position relative to the document for precise scrolling
            const rect = productsRef.current.getBoundingClientRect();
            const scrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - 50; // Offset to ensure visibility above headers

            // First attempt with scrollIntoView for smooth scrolling
            productsRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Fallback to window.scrollTo for better mobile compatibility
            window.scrollTo({
              top: targetY,
              behavior: "smooth",
            });

            // Debug log to verify scroll position
            console.log(`Scrolled to products section at Y: ${targetY}`);
          } catch (error) {
            // Log any errors during scrolling for debugging
            console.error("Error during scroll to products section:", error);
          }
        } else {
          // Warn if the productsRef is not available
          console.warn("productsRef.current is not available for scrolling");
        }
        setProductsLoading(false);
      }, 500); // Increased timeout from 300ms to 500ms to ensure DOM rendering on mobile
    } else {
      console.warn(`Category ${categoryName} not found`);
      setProducts([]);
      setProductsLoading(false);
    }
  };

  const categoryVariants = {
    inactive: {
      color: "#6B7280",
      backgroundColor: "#F9FAFB",
      border: "1px solid #E5E7EB",
      boxShadow: "none",
    },
    active: {
      color: "#FFFFFF",
      backgroundColor: "#8B5CF6",
      border: "1px solid #7C3AED",
      boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3)",
    },
  };

  const serviceCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const digitialServiceVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const renderDigitalServiceCard = (
    item: DashboardItem,
    index: number,
    type: "gpt" | "crypto"
  ) => {
    const bgGradient =
      type === "gpt"
        ? "from-blue-600 to-indigo-700"
        : "from-yellow-500 to-amber-600";
    const iconBg =
      type === "gpt"
        ? "from-blue-600 to-indigo-700"
        : "from-yellow-500 to-amber-600";

    const iconColor = type === "gpt" ? "text-blue-200" : "text-amber-200";

    return (
      <motion.div
        key={`${type}-${item.id}`}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={digitialServiceVariants}
        whileHover="hover"
        className="rounded-xl overflow-hidden relative transform transition-all duration-200"
        onClick={() => navigate(item.path)}
      >
        <div className={`bg-gradient-to-r ${bgGradient} p-4 h-full`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-white text-opacity-80 text-sm">
                {item.description}
              </p>

              <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-3 py-1.5 text-sm flex items-center">
                Explore <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b ${iconBg}`}
            >
              {React.cloneElement(item.icon as React.ReactElement, {
                className: iconColor,
                size: 22,
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const loadMoreProducts = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // New function to handle offers modal close
  const handleOffersModalClose = () => {
    setIsOffersModalVisible(false);
  };

  return (
    <div className="min-h-screen">
      {/* New styles for offers modal scrollbar */}
      <style>
        {`
          .offers-scroll-container {
            overflow-y: auto;
            max-height: 50vh;
          }
          .offers-scroll-container::-webkit-scrollbar {
            display: block;
            width: 8px;
          }
          .offers-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .offers-scroll-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .offers-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          .offers-scroll-container {
            -ms-overflow-style: auto;
            scrollbar-width: auto;
          }
        `}
      </style>

      {/* New Offers Modal */}
      <Modal
        title=""
        open={isOffersModalVisible}
        onCancel={handleOffersModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all font-medium"
            onClick={handleOffersModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="95%"
        style={{ maxWidth: "950px" }}
        bodyStyle={{ padding: "20px", overflow: "hidden" }}
      >
        {isFetchingOffers ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-purple-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Special Offers (Scrollable) */}
            <div className="flex flex-col h-[65vh]">
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <ShoppingBag className="text-purple-600" size={20} />
                <h3 className="font-bold text-lg text-purple-800">
                  Special Offers
                </h3>
                <div className="flex-1"></div>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all font-medium"
                  onClick={() => navigate("/offer")}
                >
                  View All Offers
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {offers.length > 0 ? (
                    offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-md cursor-pointer"
                      >
                        <h3 className="font-semibold text-purple-900 text-sm leading-relaxed break-words">
                          {offer.offerName}
                        </h3>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      No offers available at the moment.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - AI Mode (Same height as offers) */}
            <div className="flex flex-col h-[65vh]">
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <Sparkles className="text-purple-600" size={22} />
                <h3 className="font-bold text-xl text-purple-800">
                  AI-Powered Shopping
                </h3>
              </div>

              {/* AI Mode Card - Properly sized and centered */}
              <div className="flex-1 flex items-center justify-center p-2">
                <div className="w-full max-w-sm p-5 bg-gradient-to-br from-purple-50 via-amber-50 to-yellow-50 rounded-xl border-2 border-purple-300 shadow-lg">
                  {/* AI Mode Title with Icon */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full blur-sm opacity-30"></div>
                        <div className="relative p-2 bg-gradient-to-br from-purple-600 via-purple-700 to-amber-600 rounded-full shadow-md">
                          <Sparkles
                            className="text-white"
                            size={20}
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                        AI Mode
                      </h2>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                      <Zap className="text-amber-500" size={14} />
                      <div className="h-px w-8 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Try AI Mode to explore more about{" "}
                      <span className="font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent">
                        Askoxy.ai
                      </span>
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex-shrink-0 mt-1.5"></div>
                      <span className="break-words leading-relaxed">
                        Personalized recommendations
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex-shrink-0 mt-1.5"></div>
                      <span className="break-words leading-relaxed">
                        Smart product comparison
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex-shrink-0 mt-1.5"></div>
                      <span className="break-words leading-relaxed">
                        Natural language search
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex-shrink-0 mt-1.5"></div>
                      <span className="break-words leading-relaxed">
                        Instant shopping assistance
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => {
                      if ((window as any).openAiChat) {
                        (window as any).openAiChat();
                        handleOffersModalClose();
                      }
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-amber-600 text-white text-base font-bold rounded-lg hover:from-purple-700 hover:via-purple-800 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} />
                    <span className="whitespace-nowrap">Try AI Mode</span>
                  </button>

                  {/* Bottom Badge */}
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full">
                      <Sparkles className="text-amber-600" size={12} />
                      <span className="text-sm font-semibold text-amber-800">
                        Powered by AI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Header Images Section */}
      <div className="w-full py-2">
        <div className="px-2 sm:px-3 md:px-4 lg:px-5 mx-auto max-w-7xl">
          <div className="relative" style={{ minHeight: "180px" }}>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3"
              style={{ perspective: 1000 }}
            >
              <AnimatePresence mode="wait">
                {headerImages
                  .slice(
                    currentSet * (isMobile ? 1 : IMAGES_PER_SET),
                    currentSet * (isMobile ? 1 : IMAGES_PER_SET) +
                      (isMobile ? 1 : IMAGES_PER_SET)
                  )

                  .map((image, idx) => (
                    <motion.div
                      key={`${image.id}-${currentSet}-${idx}`}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="cursor-pointer overflow-hidden rounded-lg flex items-center justify-center"
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        height: isMobile ? "100px" : "160px",
                      }}
                      onClick={image.onClick}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      whileHover={{
                        scale: 1.2,
                        rotateY: 0,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || "Header"}
                        className="max-h-full max-w-full object-contain rounded-lg"
                        style={{
                          borderRadius: "12px",
                        }}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <section ref={productsRef} className="mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            {/* Heading - Left Side */}
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <ShoppingBag className="text-purple-600 mr-2" size={20} />
              Our Products
            </h2>

            {/* Button - Right Side */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center justify-center hover:bg-purple-700 transition-colors"
              onClick={viewAllProducts}
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </div>

          {/* Filter Tabs as Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
            <AnimatePresence>
              {categories.map((category, index) => (
                <motion.div
                  key={category.categoryName}
                  custom={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 3px 10px rgba(147, 51, 234, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden relative border border-gray-100 ${
                    activeCategory === category.categoryName
                      ? "border-purple-200"
                      : ""
                  } cursor-pointer`}
                  onClick={() => handleCategoryChange(category.categoryName)}
                >
                  <div className="aspect-square mb-2 overflow-hidden rounded-md bg-gray-50 relative">
                    <motion.img
                      src={
                        category.categoryImage ||
                        "https://via.placeholder.com/120"
                      }
                      alt={category.categoryName}
                      className="w-full h-full object-contain"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    />
                    {activeCategory === category.categoryName && (
                      <motion.div
                        className="absolute inset-0 bg-purple-600 bg-opacity-10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {/* <Star className="text-purple-600" size={20} /> */}
                      </motion.div>
                    )}
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="font-bold text-gray-800 text-md hover:text-purple-600 transition-colors">
                      {category.categoryName}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {activeCategory === "Rice" && (
            <div className="mb-6 flex flex-wrap gap-3">
              {weightFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setSelectedWeight(
                      selectedWeight === filter.value ? null : filter.value
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedWeight === filter.value
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
          {/* Product Items (Shown when a category is selected) */}
          {activeCategory && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              <AnimatePresence>
                {productsLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} index={index} />
                  ))
                ) : displayProducts.length > 0 ? (
                  displayProducts.map((product, index) =>
                    renderProductItem(product, index)
                  )
                ) : (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-gray-500">
                      No products found for this category. Please try another
                      category or check back later.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Load More and View All Buttons */}
          {activeCategory &&
            !productsLoading &&
            products.length > displayProducts.length && (
              <div className="mt-8 text-center flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMoreProducts}
                  className="bg-purple-100 text-purple-700 px-6 py-2 rounded-lg font-medium inline-flex items-center"
                >
                  Load More
                  <TrendingUp size={16} className="ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center hover:bg-purple-700 transition-colors"
                  onClick={viewAllProducts}
                >
                  View All
                  <ArrowRight size={16} className="ml-1" />
                </motion.button>
              </div>
            )}
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Settings className="text-purple-600 mr-2" size={20} />
              Our Services
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center hover:bg-purple-700 transition-colors"
              onClick={viewAllServices}
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-service-${index}`}
                    className="rounded-xl overflow-hidden animate-pulse bg-transparent"
                  >
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4 text-center">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ))
              : services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={serviceCardVariants}
                    className="rounded-xl overflow-hidden bg-transparent cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate(service.path)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-contain transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-gray-900 font-bold text-lg">
                        {service.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
          </div>
        </section>

        {/* Digital Services Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Free GPTs Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Bot className="mr-2 text-purple-600" size={24} />
                OXYGPT
              </h2>
              <button
                onClick={() => navigate("/genoxy")}
                className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full font-medium flex items-center text-sm transition"
                aria-label="Explore OXYGpt"
              >
                Explore <ArrowRight size={16} className="ml-2" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-5">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl animate-pulse h-24 flex items-center px-4"
                    >
                      <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse mr-4"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                        <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
              ) : freeGPTs.length > 0 ? (
                freeGPTs.map((item, index) =>
                  renderDigitalServiceCard(item, index, "gpt")
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="mx-auto mb-3 text-gray-400" size={32} />
                  <p>No GENOXY available at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Cryptocurrency Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Coins className="mr-2 text-purple-600" size={24} />
                Cryptocurrency
              </h2>
              <button
                onClick={() => navigate("/main/crypto")}
                className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full font-medium flex items-center text-sm transition"
                aria-label="Explore Cryptocurrency"
              >
                Explore <ArrowRight size={16} className="ml-2" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-5">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-xl animate-pulse h-24 flex items-center px-4"
                    >
                      <div className="w-12 h-12 bg-amber-200 rounded-full animate-pulse mr-4"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                        <div className="h-3 bg-amber-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
              ) : cryptocurrency.length > 0 ? (
                cryptocurrency.map((item, index) =>
                  renderDigitalServiceCard(item, index, "crypto")
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coins className="mx-auto mb-3 text-gray-400" size={32} />
                  <p>No cryptocurrency data available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Promotional Offers Modal */}
      <Modal
        visible={showOffersModal}
        onCancel={() => setShowOffersModal(false)}
        footer={null}
        width={1000}
        centered
        bodyStyle={{ padding: 0 }}
        className="promotional-offers-modal"
      >
        <div className="p-0">
          <RiceOfferFAQs />
        </div>
      </Modal>

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
            <h3 className="text-lg font-bold text-purple-700 mb-1">
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
            ? 300
            : comboAddOnModal.itemCount === 2
            ? 500
            : 700
        }
      >
        <div className={`grid gap-4 ${gridCols}`}>
          {comboAddOnModal.items.map((addonItem) => {
            // Calculate discount percentage (assuming you have itemMRP field)
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
                className="bg-white border-2 border-purple-100 rounded-lg p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300 relative overflow-hidden"
              >
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold z-10">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Selection Badge */}
                {hasAddedComboAddOn && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 z-10">
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

                {/* Square Image Container */}
                <div className="relative mb-2">
                  <div className="w-4/5 aspect-square mx-auto bg-gradient-to-br from-purple-50 to-purple-100 rounded-md overflow-hidden border border-purple-100">
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
                        className="w-10 h-10"
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
                  <div className="mb-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="text-purple-600 font-bold text-lg">
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
                          itemId: addonItem.itemId,
                          itemName: addonItem.itemName,
                          itemImage: addonItem.itemImage,
                          itemPrice: addonItem.itemPrice,
                          itemMrp: addonItem.itemMrp,
                          weight: addonItem.weight,
                          quantity: addonItem.quantity,
                          units: addonItem.units,
                          status: "COMBO",
                          title: addonItem.itemName,
                          image:
                            addonItem.itemImage ||
                            "https://via.placeholder.com/150",
                          description: `₹${addonItem.itemPrice}`,
                          path: "",
                          icon: (
                            <ShoppingBag
                              className="text-purple-600"
                              size={24}
                            />
                          ),
                        });
                        setHasAddedComboAddOn(true);
                        setTimeout(() => {
                          setComboAddOnModal({
                            visible: false,
                            items: [],
                            itemCount: 0,
                          });
                        }, 500);
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
        <div className="text-center p-3 bg-gray-50 mx-3 mb-3 rounded-md">
          <p className="text-xs text-gray-600">
            <span className="font-medium">🎉 Special Offer:</span> Add any item
            to your combo and enjoy exclusive discounts!
          </p>
        </div>
      </Modal>

      <Modal
        title={
          <span className="text-xl sm:text-2xl font-extrabold text-purple-700 flex items-center gap-2">
            BMVCOINS Info
          </span>
        }
        open={isBmvModalVisible}
        onCancel={() => setIsBmvModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-gray-700 text-sm space-y-5 pb-2">
          {/* MAIN: Show GET coins and INR conversion as BIG highlight */}
          {typeof bmvModalItem?.bmvCoins === "number" &&
          bmvModalItem.bmvCoins > 0 ? (
            <div className="text-center mb-3">
              {/* MAIN VALUE */}
              <div className="inline-block bg-gradient-to-br from-purple-100 via-purple-50 to-white border border-purple-300 rounded-2xl px-8 py-6 shadow-sm mb-2">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-800">
                  Get{" "}
                  <span className="text-purple-700">
                    {bmvModalItem.bmvCoins}
                  </span>{" "}
                  coins
                  <span className="mx-2 text-purple-600 text-2xl font-semibold">
                    =
                  </span>
                  <span className="text-green-700 font-bold">
                    ₹{(bmvModalItem.bmvCoins * 0.02).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* FUTURE VALUE */}
              <div className="mt-2 text-xs sm:text-sm text-purple-800 bg-purple-50 rounded-lg py-2 px-4 inline-block shadow-sm font-medium">
                <span className="underline decoration-dotted">
                  Future value :
                </span>
                <span className="text-base sm:text-lg font-bold text-purple-900 ml-1">
                  ₹{bmvModalItem.bmvCoins}
                </span>
                <span className="text-yellow-500 font-extrabold ml-1">*</span>
              </div>
              <div className="italic text-xs text-gray-400 mt-1">
                (*No guarantee on future value)
              </div>
            </div>
          ) : (
            <div className="text-center mb-3">
              <div className="inline-block bg-gradient-to-br from-purple-100 via-purple-50 to-white border border-purple-300 rounded-2xl px-8 py-6 shadow-sm mb-2">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-800">
                  Get <span className="text-purple-700">1,000</span> coins
                  <span className="mx-2 text-purple-400 text-2xl font-semibold">
                    =
                  </span>
                  <span className="text-green-700 font-bold">₹20.00</span>
                </div>
              </div>
              <div className="mt-2 text-xs sm:text-sm text-purple-800 bg-purple-50 rounded-lg py-2 px-4 inline-block shadow-sm font-medium">
                <span className="underline decoration-dotted">
                  Future value :
                </span>
                <span className="text-base sm:text-lg font-bold text-purple-900 ml-1">
                  ₹1,000
                </span>
                <span className="text-yellow-500 font-extrabold ml-1">*</span>
              </div>
              <div className="italic text-xs text-gray-400 mt-1">
                (*No guarantee on future value)
              </div>
            </div>
          )}

          <div className="border-t border-purple-200 my-4" />

          <div className="font-medium text-purple-700 text-base mb-1">
            Redemption & Usage
          </div>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Transfer to friends and family</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Share with other ASKOXY.AI users</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Use on non-GST items</span>
            </li>
          </ul>

          <div className="mt-2 text-xs text-gray-500">
            <span className="font-semibold text-purple-700">Note:</span> Minimum
            redemption amount applies
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
