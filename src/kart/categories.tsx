import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Package,
  AlertCircle,
  Loader2,
  Italic,
} from "lucide-react";
import checkProfileCompletion from "../until/ProfileCheck";
import BASE_URL from "../Config";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
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

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
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
  const [disabledFilters, setDisabledFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [selectedFilter, setSelectedFilter] = useState<string | null>("ALL");
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(
    "0"
  );
  const [activeWeightFilter, setActiveWeightFilter] = useState<string | null>(
    null
  );
  //1+1 free rice bag
  const [hasShownOnePlusOne, setHasShownOnePlusOne] = useState(false);
  const onePlusOneModalShownRef = useRef(false);
  const [freeItemsMap, setFreeItemsMap] = useState<{ [key: string]: number }>(
    {}
  );
  //Free Movie tickets for 5 kg rice bag
  const movieOfferModalShownRef = useRef(false);
  const [hasShownMovieOffer, setHasShownMovieOffer] = useState(
    localStorage.getItem("movieOfferClaimed") === "true"
  );
  const [movieOfferMap, setMovieOfferMap] = useState<{
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

  const fetchCartData = async (itemId: string) => {
    const Id = localStorage.getItem("userId");

    if (itemId !== "") {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: true },
      }));
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${Id}`
      );

      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data?.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );

        localStorage.setItem(
          "cartCount",
          response.data?.customerCartResponseList.length.toString()
        );
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCartItems(cartItemsMap);
        updateCartCount(totalQuantity);

        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
        }));
      } else {
        setCartItems({});
        localStorage.setItem("cartCount", "0");
        updateCartCount(0);
      }
      setCartData(response.data.customerCartResponseList);
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: false },
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: false },
      }));
    }
  };

  useEffect(() => {
    fetchCartData("");
  }, []);

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
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId: userId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // GA4 Add to Cart Event Tracking
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

      // Check for movie ticket offer (5kg bags) first
      await maybeShowMovieOfferModal(item);
      // Check for 1+1 offer (1kg bags) if no 5kg offer was shown
      if (!movieOfferModalShownRef.current) {
        await maybeShowOnePlusOneModal(item);
      }

      await fetchCartData(item.itemId);
      message.success("Item added to cart successfully.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
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

  const handleQuantityChange = async (
    item: Item,
    increment: boolean,
    status: string
  ) => {
    if (cartItems[item.itemId] === item.quantity && increment) {
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
    try {
      const endpoint = increment
        ? `${BASE_URL}/cart-service/cart/incrementCartData`
        : `${BASE_URL}/cart-service/cart/decrementCartData`;

      if (!increment && cartItems[item.itemId] <= 1) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [item.itemId]: true },
          status: { ...prev.status, [item.itemId]: status },
        }));
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
          setLoadingItems((prev) => ({
            ...prev,
            items: { ...prev.items, [item.itemId]: false },
            status: { ...prev.status, [item.itemId]: "" },
          }));
          message.success("Item removed from cart successfully.");

          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "remove_from_cart", {
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
        } else {
          setLoadingItems((prev) => ({
            ...prev,
            items: { ...prev.items, [item.itemId]: false },
            status: { ...prev.status, [item.itemId]: "" },
          }));
          message.success("Sorry, Please try again");
        }
      } else {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [item.itemId]: true },
          status: { ...prev.status, [item.itemId]: status },
        }));
        const response = await axios.patch(endpoint, {
          customerId,
          itemId: item.itemId,
        });
        if (response) {
          setLoadingItems((prev) => ({
            ...prev,
            items: { ...prev.items, [item.itemId]: false },
            status: { ...prev.status, [item.itemId]: "" },
          }));

          if (typeof window !== "undefined" && window.gtag) {
            window.gtag(
              "event",
              increment ? "add_to_cart" : "remove_from_cart",
              {
                currency: "INR",
                value: item.itemPrice,
                items: [
                  {
                    item_id: item.itemId,
                    item_name: item.itemName,
                    price: item.itemPrice,
                    quantity: 1,
                    item_category: activeCategory || "General",
                    action: increment ? "increment" : "decrement",
                  },
                ],
              }
            );
          }
        } else {
          setLoadingItems((prev) => ({
            ...prev,
            items: { ...prev.items, [item.itemId]: false },
            status: { ...prev.status, [item.itemId]: "" },
          }));
          message.success("Sorry, Please try again");
        }
      }
      fetchCartData(item.itemId);
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
const getCurrentCategoryItems = () => {
  const currentCategory =
    categories.find((cat) => cat.categoryName === activeCategory) ||
    categories[0];
  if (!currentCategory) return [];

  let items = currentCategory.itemsResponseDtoList;

  if (activeWeightFilter) {
    items = items.filter((item) => {
      const itemWeight = parseFloat(item.weight).toFixed(1);
      return itemWeight === activeWeightFilter;
    });
  }

  return items;
};
  const getCurrentSubCategories = () => {
    if (!activeCategory) return [];
    const category = categories.find(
      (cat) => cat.categoryName === activeCategory
    );
    return category?.subCategories || [];
  };
const handleWeightFilterClick = (value: string) => {
  // If currently active, deactivate it
  if (activeWeightFilter === value) {
    setActiveWeightFilter(null);
  } else {
    // Otherwise set as active
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
  // const handleResetFilters = () => {
  //   setActiveWeightFilter(null);
  //   setSelectedFilterKey("0");
  //   setSelectedFilter("ALL");
  // };

  // 1+1 free rice bag modal starts here

  const checkOnePlusOneStatus = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/oneKgOffer?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const offeravail = response.data?.cartQuantity || 0;
      console.log("1+1 Offer available quantity:", offeravail);
      return offeravail >= 2;
    } catch (error) {
      console.error("Failed to fetch 1+1 offer availability:", error);
      return true; // Default to true to avoid showing modal on error
    }
  };

  const findOneKgBag = (item: Item): Item | null => {
    const weight = parseFloat(item.weight?.toString() || "0");
    if (weight === 1 && item.units?.toLowerCase().includes("kg")) {
      return item;
    }
    return null;
  };

  const showOnePlusOneModal = (item: Item) => {
    const accessToken = localStorage.getItem("accessToken");
    Modal.confirm({
      title: "🎁 1 + 1 Offer on 1kg Rice Bag!",
      content: (
        <p>
          You're eligible for our exclusive <strong>1Kg + 1Kg offer</strong>!
          Get another <strong>{item.itemName}</strong> absolutely free.
          <br />
          <br />
          <strong>Please Note:</strong> The 1kg + 1kg Free Offer is valid only
          once per user and applies exclusively to 1kg rice bags. This offer can
          only be redeemed once per address and is applicable on the first
          successful delivery only. Once claimed, it cannot be reused. Grab it
          while it lasts!
        </p>
      ),
      okText: "Add Free Bag",
      cancelText: "No Thanks",
      onOk: async () => {
        try {
          const currentQuantity = cartItems[item.itemId] || 1; // Use 1 as fallback since item is already added

          await axios.patch(
            `${BASE_URL}/cart-service/cart/incrementCartData`,
            {
              cartQuantity: currentQuantity + 1,
              customerId,
              itemId: item.itemId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          setFreeItemsMap((prev) => ({
            ...prev,
            [item.itemId]: 1,
          }));

          message.success(`1+1 offer applied! 1 free ${item.itemName} added.`);
          await fetchCartData(item.itemId);
        } catch (err) {
          console.error("1+1 offer failed:", err);
          message.error("Unable to apply the 1+1 offer. Please try again.");
        }
      },
      onCancel: async () => {
        // No action needed; item is already added
      },
    });
  };

  const maybeShowOnePlusOneModal = async (item: Item) => {
    if (onePlusOneModalShownRef.current) return;

    const eligibleBag = findOneKgBag(item);
    if (!eligibleBag) return;

    const isOfferClaimed = await checkOnePlusOneStatus();
    if (isOfferClaimed || hasShownOnePlusOne) return;

    onePlusOneModalShownRef.current = true;
    setHasShownOnePlusOne(true);

    showOnePlusOneModal(eligibleBag);
  };

  //Free Movie Ticket upon buying 5 kg rice bag modal

  // const checkMovieOfferStatus = async (): Promise<boolean> => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/cart-service/cart/freeTicketsforCustomer?customerId=${customerId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     const freeTickets = response.data?.freeTickets || null;
  //     console.log("Movie ticket offer freeTickets:", freeTickets);
  //     return freeTickets !== null; // Return true if offer is claimed (not null), false if available (null)
  //   } catch (error) {
  //     console.error("Failed to fetch movie ticket offer status:", error);
  //     return true; // Default to true to avoid showing modal on error
  //   }
  // };

  const checkMovieOfferStatus = async (): Promise<boolean> => {
    const offerClaimed = localStorage.getItem("movieOfferClaimed") === "true";
    console.log("Movie ticket offer claimed (localStorage):", offerClaimed);
    return offerClaimed;
  };

  const findFiveKgBag = (item: Item): Item | null => {
    const weight = parseFloat(item.weight?.toString() || "0");
    if (weight === 5 && item.units?.toLowerCase().includes("kg")) {
      return item;
    }
    return null;
  };

  // const showMovieOfferModal = (item: Item) => {
  //   Modal.confirm({
  //     title: "🎬 Free Movie Ticket Offer!",
  //     content: (
  //       <p>
  //         Congratulations! You're eligible for a{" "}
  //         <strong>Free Movie Ticket</strong> to the latest{" "}
  //         <strong>HIT: The Third Case</strong> movie with your purchase of a{" "}
  //         <strong>5kg {item.itemName}</strong>!
  //         <br />
  //         <br />
  //         <strong>Please Note:</strong> The Free Movie Ticket Offer is valid
  //         only once per user and applies exclusively to 5kg rice bags only. This
  //         offer can only be redeemed once per address and is applicable on the
  //         first successful delivery only. Once claimed, it cannot be reused.
  //         Grab it while it lasts!
  //       </p>
  //     ),
  //     okText: "Claim Movie Ticket",
  //     cancelText: "No Thanks",
  //     onOk: async () => {
  //       try {
  //         setMovieOfferMap((prev) => ({
  //           ...prev,
  //           [item.itemId]: true,
  //         }));
  //         message.success(
  //           "Movie ticket offer claimed! Details will be shared upon delivery."
  //         );
  //         await fetchCartData(item.itemId);
  //       } catch (err) {
  //         console.error("Movie ticket offer claim failed:", err);
  //         message.error(
  //           "Unable to claim the movie ticket offer. Please try again."
  //         );
  //       }
  //     },
  //     onCancel: async () => {
  //       // No action needed; item is already added
  //     },
  //   });
  // };

  const showMovieOfferModal = (item: Item) => {
    Modal.confirm({
      title: "🎁 Special Offer!",
      content: (
        <p>
          🎉 Congratulations! You're eligible for a Free PVR Movie Ticket to
          watch <strong>HIT: The Third Case</strong> with your purchase of a 5KG
          rice bag! <br />
          <br />
          ✅ Offer valid only once per user
          <br /> 🎟 Applicable exclusively on 5KG rice bags
          <br /> 🚚 Redeemable on your first successful delivery only
          <br />❗ Once claimed, the offer cannot be reused
          <br />
          <br />
          🔥 Grab yours while it lasts — enjoy the movie on us
        </p>
      ),
      okText: "Claim Movie Ticket",
      cancelText: "No Thanks",
      onOk: async () => {
        try {
          // Simulate offer claim by updating localStorage
          localStorage.setItem("movieOfferClaimed", "true");
          setHasShownMovieOffer(true);

          setMovieOfferMap((prev) => ({
            ...prev,
            [item.itemId]: true,
          }));

          message.success(
            "Movie ticket offer claimed! Details will be shared upon delivery."
          );
          await fetchCartData(item.itemId);
        } catch (err) {
          console.error("Movie ticket offer claim failed:", err);
          message.error(
            "Unable to claim the movie ticket offer. Please try again."
          );
        }
      },
      onCancel: async () => {
        // No action needed; item is already added
      },
    });
  };

  const maybeShowMovieOfferModal = async (item: Item) => {
    if (movieOfferModalShownRef.current) return;

    const eligibleBag = findFiveKgBag(item);
    if (!eligibleBag) return;

    const isOfferClaimed = await checkMovieOfferStatus();
    if (isOfferClaimed) return;

    movieOfferModalShownRef.current = true;
    showMovieOfferModal(eligibleBag);
  };

  return (
    <div className="bg-white shadow-lg px-4 sm:px-6 lg:px-8 py-4">
      {/* Category Tabs */}
      <div className="mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 pb-4">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.categoryName
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100"
              }`}
              onClick={() => {
                onCategoryClick(category.categoryName);
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "select_content", {
                    content_type: "category",
                    content_id: category.categoryName,
                  });
                }
              }}
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

      {/* Weight Filter Section */}
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

      {/* Subcategories */}
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
              onClick={() => {
                setActiveSubCategory(null);
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "select_content", {
                    content_type: "subcategory",
                    content_id: "all",
                    parent_category: activeCategory,
                  });
                }
              }}
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
                onClick={() => {
                  setActiveSubCategory(subCategory.id);
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "select_content", {
                      content_type: "subcategory",
                      content_id: subCategory.id,
                      content_name: subCategory.name,
                      parent_category: activeCategory,
                    });
                  }
                }}
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
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              {item.itemMrp &&
                item.itemPrice &&
                item.itemMrp > item.itemPrice && (
                  <div className="absolute left-0 top-0 z-10 w-auto">
                    <div
                      className="bg-purple-600 text-white text-[10px] sm:text-xs font-bold 
                    px-2 sm:px-3 py-0.5 sm:py-1 flex items-center"
                    >
                      {calculateDiscount(item.itemMrp, item.itemPrice)}%
                      <span className="ml-1 text-[8px] sm:text-[10px]">
                        Off
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 right-0 transform translate-y 
                    border-t-4 sm:border-t-6 border-r-4 sm:border-r-6 
                    border-t-purple-600 border-r-transparent"
                    ></div>
                  </div>
                )}

              {item.quantity === 0 ? (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10"></div>
              ) : item.quantity < 6 ? (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
                  <span
                    className="bg-yellow-500 text-white text-[8px] sm:text-xs 
                    font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
                  >
                    Only {item.quantity} left
                  </span>
                </div>
              ) : null}

              <div
                className="p-4 cursor-pointer flex-grow"
                onClick={() => {
                  onItemClick(item);
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "select_item", {
                      currency: "INR",
                      value: item.itemPrice,
                      items: [
                        {
                          item_id: item.itemId,
                          item_name: item.itemName,
                          price: item.itemPrice,
                          item_category: activeCategory || "General",
                          item_variant: activeSubCategory || "default",
                        },
                      ],
                    });
                  }
                }}
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
                  <h3 className="font-medium text-gray-800 line-clamp-3 min-h-[2.5rem] text-sm">
                    {item.itemName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Weight: {item.weight}{" "}
                    {item.units == "pcs"
                      ? "Pc"
                      : item.weight == "1"
                      ? "Kg"
                      : "Kgs"}
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
                </div>
              </div>

              {/* Add to Cart Button Section */}
              <div className="px-4 pb-4">
                {item.quantity !== 0 ? (
                  cartItems[item.itemId] > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1 h-10">
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
                            {cartItems[item.itemId]}
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
                      {freeItemsMap[item.itemId] && (
                        <p className="text-sm text-green-600 font-medium">
                          🎁 1 Free bag (1+1 Offer Applied)
                        </p>
                      )}
                      {movieOfferMap[item.itemId] && (
                        <p className="text-sm text-blue-600 font-medium">
                          🎬 Free Movie Ticket Claimed
                        </p>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-10 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg transition-all duration-300 hover:shadow-md flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
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
                    className="w-full h-10 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed flex items-center justify-center"
                    disabled
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof window !== "undefined" && window.gtag) {
                        window.gtag("event", "view_item_unavailable", {
                          item_id: item.itemId,
                          item_name: item.itemName,
                          item_category: activeCategory || "General",
                        });
                      }
                    }}
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Categories;
