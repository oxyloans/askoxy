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
  ShoppingBag,
  Briefcase,
  Loader2,
  Droplet,
  Star,
  TrendingUp,
  ArrowRight,
  Search,
  ChevronRight,
  Settings,
  HandCoins,
  Gem,
  Globe,
  Package,
  Gift,
  Ticket,
  Info,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BASE_URL from "../Config";
import checkProfileCompletion from "../until/ProfileCheck";
import { CartContext } from "../until/CartContext";
import ProductOfferModals from "./ProductOffermodals";
import RiceOfferFAQs from "./Faqs";
import ProductImg1 from "../assets/img/ricecard1.png";
import ProductImg2 from "../assets/img/ricecard2.png";
import ServiceImg1 from "../assets/img/oxyloasntemp (1).png";
import ServiceImg2 from "../assets/img/study abroad.png";
import GPTImg1 from "../assets/img/study abroad.png";
import CryptoImg1 from "../assets/img/bmvcoin.png";
import RudrakshaImage from "../assets/img/freerudraksha.png";
import offer5kg from "../assets/img/5offer.png";
import offer2kgRice from "../assets/img/2offer.png";
import O1 from "../assets/img/o1.png";
import O2 from "../assets/img/o2.png";
import O8 from "../assets/img/StudyAbroda.png";
import O3 from "../assets/img/2offer.png";
import O4 from "../assets/img/o4.png";
import O5 from "../assets/img/tb1.png";
import O6 from "../assets/img/26kg.png";
import CB from "../assets/img/cashback offer png.png"
import Cashew from "../assets/img/cashewoffer1.png"
import Riceoffers from "../assets/img/rice offers.png"
import O7 from "../assets/img/5offer.png";
import O9 from "../assets/img/35kg1.png";

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
  const [hoveredImage, setHoveredImage] = useState<string | number | null>(
    null
  );
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
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

  const updateCartCount = useCallback(
    (count: number) => {
      setCartCount(count);
      setCount(count);
    },
    [setCount]
  );

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
        `${BASE_URL}/product-service/showItemsForCustomrs`
      );
      const data: Category[] = response.data;

      const uniqueItemsMap = new Map();
      data.forEach((category) => {
        category.itemsResponseDtoList.forEach((item) => {
          if (item.quantity > 0) {
            const normalizedName = item.itemName.trim().toLowerCase();
            if (
              !Array.from(uniqueItemsMap.values()).some(
                (existing) =>
                  existing.itemName.trim().toLowerCase() === normalizedName
              )
            ) {
              uniqueItemsMap.set(item.itemId, item);
            }
          }
        });
      });

      const uniqueItemsList = Array.from(uniqueItemsMap.values());
      const sortedUniqueItems = sortItemsByName(uniqueItemsList);

      const allCategories: Category[] = [
        {
          categoryName: "All Items",
          categoryImage: null,
          itemsResponseDtoList: sortedUniqueItems,
          subCategories: [],
        },
        ...data.map((category) => ({
          ...category,
          itemsResponseDtoList: sortItemsByName(category.itemsResponseDtoList),
          subCategories: category.subCategories || [],
        })),
      ];

      setCategories(allCategories);
      updateProducts(sortedUniqueItems);
      categoriesFetched.current = true;
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchCartData, fetchCategories]);

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
      scale: 1.05,
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
      id: "Cashback1",
      src: CB,
      alt: "Products",
      path: "/main/dashboard/products",
    },
   {
  id: "Cashew Offer",
  alt: "Products",
  src: Cashew,
  path: "/main/dashboard/products",
  onClick: () => {
    setActiveCategory("Cashew nuts upto ₹40 cashback");
    navigate("/main/dashboard/products");
  }
}
    ,
    {
      id: "Cashback2",
      src: Riceoffers,
      alt: "Products",
      path: "/main/dashboard/products?weight=5.0",
    },
    {
      id: "o1",
      src: O6,
      alt: "Products",
      path: "/main/dashboard/products?weight=10.0",
    },
    {
      id: "o6",
      src: O9,
      alt: "Products",
      path: "/main/dashboard/products?weight=26.0",
    },
    {
      id: "o2",
      src: O8,
      alt: "Study Abroad",
      path: "/studyabroad",
    },
  ];

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
        image: ServiceImg1,
        description: "Earn up to 24% P.A. on your investments",
        path: "/main/service/oxyloans-service",
        icon: <HandCoins className="text-purple-600" size={24} />,
      },
      {
        id: "2",
        title: "Study Abroad",
        image:
          "https://i.ibb.co/7dFHq44H/study-abroad-b44df112b4ab2a4c2bc9.png",
        description: "Complete guidance for international education",
        path: "/studyabroad",
        icon: <Globe className="text-purple-600" size={24} />,
      },
      {
        id: "3",
        title: "Free Rudraksha",
        image: RudrakshaImage,
        description: "Receive a sacred Rudraksha bead",
        path: "/main/services/freerudraksha",
        icon: <Gem className="text-purple-600" size={24} />,
      },
    ];
  };

  const fetchFreeGPTs = (): DashboardItem[] => {
    return [
      {
        id: "1",
        title: "Free GPTs",
        image:
          "https://i.ibb.co/7dFHq44H/study-abroad-b44df112b4ab2a4c2bc9.png",
        description: "AI-powered guidance for studying abroad",
        path: "/main/dashboard/freegpts",
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
        path: "/main/dashboard/bmvcoin",
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

      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        { customerId: userId, itemId: item.itemId, quantity: 1 },
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId as string]: false },
      }));
    }
  };

  const handleQuantityChange = async (
    item: DashboardItem,
    increment: boolean
  ) => {
    if (!item.itemId) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
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

        const response = await axios.patch(endpoint, {
          customerId: userId,
          itemId: item.itemId,
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
    const validProducts = products.filter((product) => {
      if (product.quantity === undefined || product.quantity <= 0) return false;

      if (searchTerm.trim() !== "") {
        return product.title.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    });

    setDisplayProducts(
      validProducts.slice(0, Math.min(displayCount, validProducts.length))
    );
  }, [products, displayCount, searchTerm]);

  const viewAllProducts = () => {
    navigate("/main/dashboard/products");
  };

  const viewAllServices = () => {
    navigate("/main/dashboard/services");
  };

  const handleCategoryChange = (categoryName: string) => {
    if (activeCategory === categoryName) return;

    setActiveCategory(categoryName);
    setProductsLoading(true);

    const category = categories.find(
      (cat) => cat.categoryName === categoryName
    );

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

      setProducts(productItems);
      setDisplayCount(5);
      setSearchTerm("");

      setTimeout(() => {
        setProductsLoading(false);
      }, 300);
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
      {/* Header Images Section */}
 <div className="w-full py-1 md:py-2">
  <div className="px-1 sm:px-2 md:px-3 lg:px-4 mx-auto max-w-7xl">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-2 md:gap-2 lg:gap-3">
      {headerImages.map((image) => (
        <motion.div
          key={image.id}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            rotateY: 5
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="cursor-pointer overflow-hidden rounded-lg transition-all duration-300"
          onHoverStart={() => setHoveredImage(image.id)}
          onHoverEnd={() => setHoveredImage(null)}
          onClick={() => navigate(image.path)}
        >
          <div className="relative w-full overflow-hidden rounded-lg">
            <motion.img
              src={image.src}
              alt={image.alt || "Header image"}
              className="w-full h-auto object-contain rounded-lg"
              animate={{ 
                scale: hoveredImage === image.id ? 1.02 : 1
              }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
              whileHover={{
                filter: "brightness(1.1) contrast(1.05)"
              }}
              style={{
                filter: hoveredImage === image.id ? "brightness(1.1) contrast(1.05)" : "brightness(1) contrast(1)"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredImage === image.id ? 0.1 : 0
              }}
              style={{
                background: "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section ref={productsRef} className="mb-12">
          <div className="flex items-center mb-4 gap-10">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <ShoppingBag className="text-purple-600 mr-2" size={20} />
              Our Products
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 mb-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center hover:bg-purple-700 transition-colors"
              onClick={viewAllProducts}
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </div>

          <div className="mb-6 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.categoryName}
                  animate={
                    activeCategory === category.categoryName
                      ? "active"
                      : "inactive"
                  }
                  variants={categoryVariants}
                  whileHover={
                    activeCategory !== category.categoryName
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.categoryName)}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {category.categoryName}
                </motion.button>
              ))}
            </div>
          </div>

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
                    No products found. Try a different search or category.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {!productsLoading && products.length > displayProducts.length && (
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
          <div className="flex items-center mb-4 gap-10">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Settings className="text-purple-600 mr-2" size={20} />
              Our Services
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 mb-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center hover:bg-purple-700 transition-colors"
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
                    className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                    onClick={() => navigate(service.path)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-40"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg drop-shadow-md">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 text-sm">
                        {service.description}
                      </p>
                      <button className="mt-3 text-purple-600 font-medium text-sm flex items-center">
                        Learn More
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
          </div>
        </section>

        {/* Digital Services Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Bot className="mr-2 text-purple-600" size={24} />
                Free GPTs
              </h2>
              <button
                onClick={() => navigate("/main/dashboard/freegpts")}
                className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-medium flex items-center text-sm transition-colors"
                aria-label="Explore Free GPTs"
              >
                Explore <ArrowRight size={16} className="ml-2" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg animate-pulse h-24 flex items-center px-4"
                      >
                        <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse mr-4"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-blue-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-blue-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))
                : freeGPTs.map((item, index) =>
                    renderDigitalServiceCard(item, index, "gpt")
                  )}
            </div>

            {!loading && freeGPTs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bot className="mx-auto mb-3 text-gray-400" size={32} />
                <p>No free GPTs available at the moment</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Coins className="mr-2 text-purple-600" size={24} />
                Cryptocurrency
              </h2>
              <button
                onClick={() => navigate("/main/dashboard/bmvcoin")}
                className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-medium flex items-center text-sm transition-colors"
                aria-label="Explore Cryptocurrency"
              >
                Explore <ArrowRight size={16} className="ml-2" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-lg animate-pulse h-24 flex items-center px-4"
                      >
                        <div className="w-12 h-12 bg-amber-200 rounded-full animate-pulse mr-4"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-amber-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-amber-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))
                : cryptocurrency.map((item, index) =>
                    renderDigitalServiceCard(item, index, "crypto")
                  )}
            </div>

            {!loading && cryptocurrency.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Coins className="mx-auto mb-3 text-gray-400" size={32} />
                <p>No cryptocurrency data available at the moment</p>
              </div>
            )}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
