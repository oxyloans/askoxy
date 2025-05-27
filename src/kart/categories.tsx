import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, AlertCircle, Loader2 } from "lucide-react";
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
  status: string; // "ADD" or "FREE"
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
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userEligibleOffers, setUserEligibleOffers] = useState<UserEligibleOffer[]>([]);
  const [isOffersModalVisible, setIsOffersModalVisible] = useState(false);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });

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

      const customerCart: CartItem[] = response.data?.customerCartResponseList || [];

      // Log raw API response for debugging
      console.log("fetchCartData API response:", response.data);

      // Create cart items map for non-free items only (for UI display)
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

      // Calculate total quantity, including both free and non-free items
      const totalQuantity: number = customerCart.reduce(
        (sum: number, item: CartItem) => {
          const quantity = item.cartQuantity ?? 0;
          return sum + quantity; // Include all items (FREE and ADD)
        },
        0
      );

      // Log for debugging
      console.log("fetchCartData: ", {
        cartItemsMap,
        totalQuantity,
        customerCart,
      });

      // Update states
      setCartItems(cartItemsMap);
      setCartData(customerCart); // Keep all items (including FREE) in cartData
      updateCart(cartItemsMap);
      updateCartCount(totalQuantity);
      localStorage.setItem("cartCount", totalQuantity.toString());

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
      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
      message.error("Failed to fetch cart data.");
    }
  };

  // Function to normalize weight values (remove units, convert to number)
  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

  // Function to fetch user-eligible offers
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

  // Function to fetch and filter active offers
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

      // Re-fetch cart data to ensure free items from offers are included
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

  // Fetch user-eligible offers and cart data on mount
  useEffect(() => {
    const hasShownOffers = localStorage.getItem("hasShownOffers");
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      fetchCartData();
      if (!hasShownOffers) {
        fetchUserEligibleOffers(userId);
      }
    }
  }, []);

  // Fetch offers only after userEligibleOffers is updated
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

      if (!increment) {
        message.success(
          cartItems[item.itemId] <= 1
            ? "Item removed from cart successfully."
            : "Item quantity decreased"
        );
      } else {
        message.success("Item quantity increased");
      }
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
    return currentCategory.itemsResponseDtoList;
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

  // Helper function to check if the item is explicitly added by the user
  const isItemUserAdded = (itemId: string): boolean => {
    // Check if there is at least one cart entry for this item with status "ADD"
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
                    Weight: {item.weight}
                    {item.units}
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