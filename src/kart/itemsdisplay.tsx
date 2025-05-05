import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import {
  ShoppingCart,
  Home,
  ChevronRight,
  Minus,
  Plus,
  Tag,
  Package2,
  Star,
  Bot,
  X,
  MessageCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import ValidationPopup from "./ValidationPopup";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";

import BASE_URL from "../Config";

interface Item {
  itemId: string;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemMrp: number;
  priceMrp: number | string;
  weight: string;
  itemUrl: string;
  itemPrice: number;
  itemWeight: number;
  weightUnit: string;
  units: string;
  category: string;
  image: string;
  quantity: number;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

interface Message {
  id: number;
  text: string;
  type: "sent" | "received" | "system";
}

const ItemDisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(
    state?.item || null
  );
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const [showChatSection, setShowChatSection] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });

  const [chatFeatureComingSoon, setChatFeatureComingSoon] = useState(true);

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  const apiKey = "";

  const fetchItemDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showItemsForCustomrs`
      );
      const allItems = response.data.flatMap(
        (category: any) => category.itemsResponseDtoList
      );
      const item = allItems.find((item: Item) => item.itemId === id);
      if (item) {
        setItemDetails(item);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (itemId) {
      if (!state?.item) {
        fetchItemDetails(itemId);
      } else {
        setItemDetails(state.item);
      }
      fetchCartData("");
      fetchRelatedItems();
    }
  }, [itemId, state]);

  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item);
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
      replace: true,
    });
  };

  const fetchCartData = async (itemId: string) => {
    if (itemId !== "") {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: true },
      }));
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCartItems(cartItemsMap);
        setCount(totalQuantity);
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
        }));
      } else {
        setCartItems({});
        setCount(0);
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
        }));
      }
      setCartData(response.data.customerCartResponseList);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: false },
      }));
    }
  };

  const handleProfileRedirect = () => {
    setShowValidationPopup(false);
    handleNavigation("/main/profile");
  };

  const fetchRelatedItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showItemsForCustomrs`
      );

      console.log("Fetched Categories:", response.data);

      const matchingCategory = response.data.find(
        (category: any) =>
          category.itemsResponseDtoList &&
          Array.isArray(category.itemsResponseDtoList) &&
          category.itemsResponseDtoList.some(
            (item: any) =>
              item.itemId === itemDetails?.itemId ||
              item.itemId === itemDetails?.itemId
          )
      );

      if (
        matchingCategory &&
        Array.isArray(matchingCategory.itemsResponseDtoList)
      ) {
        const categoryItems = matchingCategory.itemsResponseDtoList
          .filter(
            (item: any) =>
              item.itemId !== itemDetails?.itemId &&
              item.itemId !== itemDetails?.itemId
          )
          .slice(0, 4);

        console.log("Related Items:", categoryItems);
        setRelatedItems(categoryItems);
      } else {
        console.log("No matching category found for this item.");
        setRelatedItems([]);
      }
    } catch (error) {
      console.error("Error fetching related items:", error);
    }
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem("profileData");
    console.log("profileData", profileData);

    if (profileData) {
      const parsedData = JSON.parse(profileData);
      console.log("parsedData", parsedData);
      return !!(
        parsedData.userFirstName &&
        parsedData.userFirstName != ""
      );
    }
    return false;
  };

  const handleAddToCart = async (item: Item) => {
    if (!token || !customerId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => navigate("/whatsapplogin"), 2000);
      return;
    }
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
              item_category: item.category || "Rice",
            },
          ],
        });
      }

      await fetchCartData("");
      message.success("Item added to cart successfully.");

      setTimeout(() => {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [item.itemId]: false },
        }));
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleQuantityChange = async (item: Item, increment: boolean) => {
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

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "remove_from_cart", {
            currency: "INR",
            value: item.itemPrice * (cartItems[item.itemId] || 0),
            items: [
              {
                item_id: item.itemId,
                item_name: item.itemName,
                price: item.itemPrice,
                quantity: cartItems[item.itemId] || 0,
                item_category: item.category || "Rice",
              },
            ],
          });
        }

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

        if (typeof window !== "undefined" && window.gtag) {
          const eventName = increment ? "add_to_cart" : "remove_from_cart";
          window.gtag("event", eventName, {
            currency: "INR",
            value: item.itemPrice,
            items: [
              {
                item_id: item.itemId,
                item_name: item.itemName,
                price: item.itemPrice,
                quantity: 1,
                item_category: item.category || "Rice",
              },
            ],
          });
        }
      }
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
      fetchCartData(item.itemId);
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length,
      text: inputMessage,
      type: "sent" as const,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 2,
        text: "Our product assistant feature is coming soon! We appreciate your interest. Check back later for personalized product assistance.",
        type: "system" as const,
      },
    ]);
  };

  const handleChatView = (value: any) => {
    setShowChatSection(!showChatSection);
    if (messages.length === 0 && showChatSection === false) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: `Our intelligent product assistant feature is coming soon! You'll be able to ask questions about ${value} and get helpful answers.`,
          type: "system" as const,
        },
      ]);
    }
  };

  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (quantity <= 5)
      return {
        text: `Only ${quantity} left!`,
        color: "bg-yellow-100 text-yellow-600",
      };
    return { text: "In Stock", color: "bg-green-100 text-green-600" };
  };

  const isMaxStockReached = (item: Item) => {
    return cartItems[item.itemId] >= item.quantity;
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <button
            onClick={() => navigate("/main/dashboard/products")}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Categories</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-purple-600 font-medium">
            {itemDetails?.category}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={itemDetails?.itemImage || itemDetails?.image}
                      alt={itemDetails?.itemName}
                      className="w-full h-full object-contain transform transition-transform hover:scale-105"
                    />
                  </div>
                  {itemDetails && (
                    <div className="absolute top-4 right-4 flex items-center">
                      <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        {calculateDiscount(
                          Number(itemDetails.itemMrp) ||
                          Number(itemDetails.priceMrp),
                          Number(itemDetails.itemPrice)
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                  {itemDetails && (
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                          getStockStatus(itemDetails.quantity).color
                        }`}
                      >
                        {itemDetails.quantity <= 5 && (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {getStockStatus(itemDetails.quantity).text}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {itemDetails?.itemName}
                    </h1>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-600">(4.8/5)</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{itemDetails?.itemPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{itemDetails?.itemMrp || itemDetails?.priceMrp}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {itemDetails?.quantity !== 0 ? (
                      itemDetails && cartItems[itemDetails.itemId] ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-2 rounded-lg transition-all ${
                                cartItems[itemDetails.itemId] <= 1
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                              }`}
                              onClick={() =>
                                itemDetails &&
                                handleQuantityChange(itemDetails, false)
                              }
                              disabled={loadingItems.items[itemDetails.itemId]}
                            >
                              <Minus className="w-5 h-5" />
                            </motion.button>
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="animate-spin text-purple-600" />
                            ) : (
                              <span className="font-medium text-purple-700">
                                {cartItems[itemDetails.itemId]}
                              </span>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-2 rounded-lg transition-all ${
                                isMaxStockReached(itemDetails)
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                              }`}
                              onClick={() =>
                                !isMaxStockReached(itemDetails) &&
                                handleQuantityChange(itemDetails, true)
                              }
                              disabled={
                                cartItems[itemDetails.itemId] >=
                                itemDetails.quantity ||
                                loadingItems.items[itemDetails.itemId] ||
                                (itemDetails.itemPrice === 1 &&
                                  cartItems[itemDetails.itemId] >= 1)
                              }
                            >
                              <Plus className="w-5 h-5" />
                            </motion.button>
                          </div>
                          {isMaxStockReached(itemDetails) && (
                            <p className="text-yellow-600 text-sm flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" />
                              Maximum available quantity reached
                            </p>
                          )}
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            itemDetails &&
                            !loadingItems.items[itemDetails.itemId] &&
                            handleAddToCart(itemDetails)
                          }
                          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform transition-all flex items-center justify-center gap-2"
                        >
                          {itemDetails &&
                          loadingItems.items[itemDetails.itemId] ? (
                            <Loader2 className="mr-2 animate-spin inline-block" />
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                            </>
                          )}
                        </motion.button>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                  <Package2 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">
                    {itemDetails?.itemWeight || itemDetails?.weight}
                    {itemDetails?.weightUnit || itemDetails?.units}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                  <span className="font-medium">
                    {itemDetails?.itemDescription || "No description available."}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {showChatSection ? "Product Assistant" : "Need Help?"}
                  </h2>
                  <button
                    onClick={() => handleChatView(itemDetails?.itemName)}
                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                  >
                    {showChatSection ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {showChatSection && (
                  <div className="h-[400px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.type === "sent" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`${
                              msg.type === "sent"
                                ? "bg-purple-600 text-white"
                                : msg.type === "system"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-gray-100 text-gray-800"
                            } rounded-lg p-3 max-w-[80%]`}
                          >
                            {msg.type === "system" ? (
                              <div className="flex items-start gap-2">
                                <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>{msg.text}</div>
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setInputMessage(e.target.value)
                        }
                        placeholder="Ask about this product..."
                        className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
                {!showChatSection && chatFeatureComingSoon && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Have questions about this product? Our AI assistant can help
                      you with product information, recommendations, and more.
                    </p>
                    <button
                      onClick={() => handleChatView(itemDetails?.itemName)}
                      className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2"
                    >
                      <Bot className="w-5 h-5" />
                      Chat with Product Assistant
                    </button>
                  </div>
                )}
              </div>

              {relatedItems.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
                  <div className="space-y-4">
                    {relatedItems.slice(0, 3).map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleRelatedItemClick(item)}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.itemImage || item.image}
                            alt={item.itemName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {item.itemName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 font-medium">
                              ₹{item.itemPrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.itemMrp || item.priceMrp}
                            </span>
                          </div>
                        </div>
                        {item.quantity > 0 ? (
                          cartItems[item.itemId] ? (
                            <div className="flex items-center gap-1">
                              <button
                                className="p-1 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(item, false);
                                }}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-medium w-6 text-center">
                                {cartItems[item.itemId]}
                              </span>
                              <button
                                className={`p-1 rounded-md ${
                                  cartItems[item.itemId] >= item.quantity
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  !isMaxStockReached(item) && handleQuantityChange(item, true);
                                }}
                                disabled={cartItems[item.itemId] >= item.quantity}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                            >
                             <ShoppingCart className="w-4 h-4" />
                            </button>
                          )
                        ) : (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                            Out of stock
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => navigate("/main/dashboard/products")}
                      className="w-full py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      View More Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showValidationPopup && (
        <ValidationPopup
          isOpen={showValidationPopup}
          onClose={() => setShowValidationPopup(false)}
          onAction={handleProfileRedirect}
        />
      )}

      <Footer />
    </div>
  );
};

export default ItemDisplayPage;