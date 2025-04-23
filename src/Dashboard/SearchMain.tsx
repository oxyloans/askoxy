import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Home,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import BASE_URL from "../Config";
import { CartContext } from "../until/CartContext";

interface SearchItem {
  itemId: string;   
  itemName: string;
  itemMrp: number;
  units: string | null;
  itemImage: string;
  weight: number;
  saveAmount: number;
  itemDescription: string;
  savePercentage: number | null;
  itemPrice: number;
  quantity: number;
  categoryName: string;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

interface LocationState {
  searchResults: SearchItem[];
  categoryName?: string;
}

const SearchMain: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const { searchResults, categoryName } = (location.state as LocationState) || {
    searchResults: [],
    categoryName: undefined,
  };
  console.log("SearchMain received:", { searchResults, categoryName });

  const [cartItems, setCartItems] = React.useState<Record<string, number>>({});
  const [cartData, setCartData] = React.useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = React.useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [deleteLoading, setDeleteLoading] = React.useState<
    Record<string, boolean>
  >({});

  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }
  const { setCount } = context;

  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const filteredSearchResults = searchResults
    .filter((item) => item.itemMrp > 0 && item.categoryName !== "Sample Rice") // Exclude items with itemMrp of 0 and sample rice
    .sort((a, b) => {
      const weightOrder = [1, 5, 10, 25, 26]; // Define the preferred weight order
      const aIndex = weightOrder.indexOf(a.weight);
      const bIndex = weightOrder.indexOf(b.weight);

      // If both weights are in the preferred order, sort by their index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only 'a' is in the preferred order, it comes first
      if (aIndex !== -1) {
        return -1;
      }
      // If only 'b' is in the preferred order, it comes first
      if (bIndex !== -1) {
        return 1;
      }
      // If neither is in the preferred order, sort by weight numerically (e.g., 26 kg comes last)
      return a.weight - b.weight;
    });

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: any) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCount(totalQuantity);
        setCartItems(cartItemsMap);
        setCartData(response.data.customerCartResponseList);
      } else {
        setCartItems({});
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  React.useEffect(() => {
    if (customerId && token) {
      fetchCartData();
    }
  }, [customerId, token]);

  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem("profileData");
    console.log("profileData", profileData);

    if (profileData) {
      const parsedData = JSON.parse(profileData);
      console.log("parsedData", parsedData);
      return !!(parsedData.userFirstName && parsedData.userFirstName !== "");
    }
    return false;
  };

  const handleAddToCart = async (item: SearchItem) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    if (!token || !customerId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => navigate("/whatsapplogin"), 2000);
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Item added to cart successfully.");
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cartItemsMap = response.data.customerCartResponseList.reduce(
        (acc: Record<string, number>, cartItem: any) => {
          acc[cartItem.itemId] = cartItem.cartQuantity || 0;
          return acc;
        },
        {}
      );
      const totalQuantity = Object.values(
        cartItemsMap as Record<string, number>
      ).reduce((sum, qty) => sum + qty, 0);
      setCount(totalQuantity);
      setCartItems(cartItemsMap);
      setCartData(response.data.customerCartResponseList);
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

  const handleQuantityChange = async (item: SearchItem, increment: boolean) => {
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
      return;
    }
    const endpoint = increment
      ? `${BASE_URL}/cart-service/cart/incrementCartData`
      : `${BASE_URL}/cart-service/cart/decrementCartData`;

    if (cartItems[item.itemId] === item.quantity && increment) {
      message.warning("Sorry, Maximum quantity reached.");
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    try {
      if (!increment && cartItems[item.itemId] <= 1) {
        const targetCartId = cartData.find(
          (cart) => cart.itemId === item.itemId
        )?.cartId;
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: { id: targetCartId },
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Item removed from cart successfully.");
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [item.itemId]: false },
        }));
      } else {
        await axios.patch(
          endpoint,
          { customerId, itemId: item.itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleItemClick = (item: SearchItem) => {
    console.log(item);
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <button
            onClick={() => navigate("/main/dashboard/products")}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-purple-600 font-medium">Search Results</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Search Results (Full Width) */}
          <div className="lg:col-span-12 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-start mb-4">
                <button
                  onClick={handleBack}
                  className="mr-2 text-gray-600 hover:text-gray-800 flex items-center"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-6 h-6 mb-2" />
                </button>
                <h2 className="text-xl font-bold flex items-center mb-2">
                  {categoryName ? `${categoryName} Products` : "Search Results"}
                </h2>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((item, index) => (
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
                                {calculateDiscount(
                                  item.itemMrp,
                                  item.itemPrice
                                )}
                                %
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
                        {item.quantity &&
                          item.quantity < 6 &&
                          item.quantity > 0 && (
                            <div className="absolute top-0.5 xs:top-1 sm:top-2 right-0.5 xs:right-1 sm:right-2 z-10">
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
                          )}
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50 relative group">
                            <img
                              src={item.itemImage}
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
                              {item.units || ""}
                            </p>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{item.itemPrice}
                              </span>
                              {item.itemMrp &&
                                item.itemMrp > item.itemPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.itemMrp}
                                  </span>
                                )}
                            </div>
                            {item.quantity !== 0 ? (
                              cartItems[item.itemId] > 0 ? (
                                <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1 mt-2">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(item, false);
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
                                      cartItems[item.itemId] >=
                                      (item.quantity || Infinity)
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        cartItems[item.itemId] <
                                        (item.quantity || Infinity)
                                      ) {
                                        handleQuantityChange(item, true);
                                      }
                                    }}
                                    disabled={
                                      cartItems[item.itemId] >=
                                        (item.quantity || Infinity) ||
                                      loadingItems.items[item.itemId]
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
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500 text-lg">No results found.</p>
                      <button
                        onClick={handleBack}
                        className="mt-4 text-purple-600 hover:text-purple-800 underline"
                      >
                        Go back to search
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchMain;
