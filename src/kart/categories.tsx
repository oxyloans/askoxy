import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, AlertCircle, Loader2 } from "lucide-react";
import  checkProfileCompletion  from "../until/ProfileCheck";
import  BASE_URL  from "../Config";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units:string;
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
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {}, // Stores boolean values for each item
    status: {}, // Stores status strings for each item
  });

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
        console.log({ cartItemsMap });

        // Fix: Use cartItemsMap and correct syntax
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
    // Reset subcategory when category changes
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
    
    if(!checkProfileCompletion()){
      console.log(checkProfileCompletion());
      Modal.error({
        title: "Profile Incomplete",
        content: "Please complete your profile to add items to the cart.",
        onOk: () => navigate("/main/profile"),
      }); 
      // message.warning("Please complete your profile to add items to the cart.");
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
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId: userId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchCartData("");

      message.success(response.data.errorMessage);
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

      if(!checkProfileCompletion()){
        console.log(checkProfileCompletion());
        Modal.error({
          title: "Profile Incomplete",
          content: "Please complete your profile to add items to the cart.",
          onOk: () => navigate("/main/profile"),
        }); 
        // message.warning("Please complete your profile to add items to the cart.");
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

    // If no subcategory is selected, show all items
    if (!activeSubCategory) {
      return currentCategory.itemsResponseDtoList;
    }
    return currentCategory.itemsResponseDtoList;
  };

  const getCurrentSubCategories = () => {
    if (!activeCategory) return [];
    const category = categories.find(
      (cat) => cat.categoryName === activeCategory
    );
    return category?.subCategories || [];
  };

  return (
    <div className="bg-white shadow-lg px-3 sm:px-6 lg:px-6 py-3">
      {/* Category Tabs */}
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

      {/* Subcategories */}
      {getCurrentSubCategories().length > 0 && (
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 pb-2">
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
            {getCurrentSubCategories().map((subCategory, index) => (
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
              {/* Discount Label - Updated to match reference design */}
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
                    {/* Custom shape for bottom edge */}
                    <div
                      className="absolute bottom-0 right-0 transform translate-y 
                      border-t-4 border-r-4 
                      xs:border-t-6 xs:border-r-6 
                      sm:border-t-8 sm:border-r-8 
                      border-t-purple-600 border-r-transparent"
                    ></div>
                  </div>
                )}

              {/* Stock Status Badge */}
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
                {/* Image Container */}
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

                {/* Product Details */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] text-sm">
                    {item.itemName}
                  </h3>
                  <p className="text-sm text-gray-500">
                  Weight : {item.weight}{item.units}
                  </p>

                  {/* Price Section - Updated layout */}
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

                  {/* Add to Cart Button Section */}
                  {item.quantity !== 0 ? (
                    cartItems[item.itemId] > 0 ? (
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
                          {/* {loadingItems.items[item.itemId] &&
                          loadingItems.status[item.itemId] == "sub" ? (
                            <Loader2 className="mr-1 animate-spin inline-block" />
                          ) : (
                            "-"
                          )} */}
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
                            loadingItems.items[item.itemId]
                          }
                        >
                          {/* {loadingItems.items[item.itemId] &&
                          loadingItems.status[item.itemId] == "Add" ? (
                            <Loader2 className="mr-1 animate-spin inline-block" />
                          ) : (
                            "+"
                          )} */}
                          +
                        </motion.button>
                      </div>
                    ) : (
                      <>
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
                      </>
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
