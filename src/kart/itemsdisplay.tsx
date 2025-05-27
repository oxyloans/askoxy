import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd"; // Added Modal import for Special Offers modal
import {
  ShoppingCart,
  Home,
  ChevronRight,
  Minus,
  Plus,
  Package2,
  Star,
  Bot,
  X,
  MessageCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { AxiosError } from "axios";
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

// interface CartItem {
//   itemId: string;
//   cartQuantity: number;
//   cartId: string;
//   status: string; // "ADD" or "FREE"
// }

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
  status: string;
  itemName: string;
  weight: number;
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
    items: {}, // Stores boolean values for each item
    status: {}, // Stores status strings for each item
  });
  // Added state for Special Offers modal
  const [offerModal, setOfferModal] = useState<{ visible: boolean; content: string }>({
    visible: false,
    content: "",
  });
  const [displayedOffers, setDisplayedOffers] = useState<Set<string>>(new Set());

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  const apiKey = "";

  // Added normalizeWeight function from categories.tsx
  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

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
    }
  }, [itemId, state]);

  // Updated navigation handler for related items
  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item); // Update item details immediately
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
      replace: true,
    });
  };

  // Updated fetchCartData function from categories.tsx to include Special Offers modal logic
  const fetchCartData = async (itemId: string) => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      setCartItems({});
      setCartData([]);
      setCount(0);
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

      const newDisplayedOffers = new Set(displayedOffers);

      // Check for 2+1 Offer
      const twoPlusOneItems = customerCart.filter(
        (item) => item.status === "ADD" && item.cartQuantity >= 2
      );
      for (const addItem of twoPlusOneItems) {
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
            content: `<b>2+1 Offer Is Active.</b><br><br>Buy 2 Bags of ${addItem.itemName} of ${normalizeWeight(addItem.weight)} Kg and get 1 Bag of ${freeItem.itemName} of ${normalizeWeight(freeItem.weight)} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
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
        const freeItems = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            normalizeWeight(item.weight) === 1.0 &&
            item.cartQuantity === 2
        );
        if (
          freeItems &&
          !newDisplayedOffers.has(`5+2_${addItem.itemId}`)
        ) {
          setOfferModal({
            visible: true,
            content: `<b>5+2 Offer Is Active.</b><br><br>Buy 1 Bag of ${addItem.itemName} of ${normalizeWeight(addItem.weight)} Kg and get 2 Bags of ${freeItems.itemName} of ${normalizeWeight(freeItems.weight)} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
          });
          newDisplayedOffers.add(`5+2_${addItem.itemId}`);
        }
      }

      // Free Container Offer
      const containerOfferItems = customerCart.filter(
        (item) =>
          item.status === "ADD" &&
          (normalizeWeight(item.weight) === 10.0 || normalizeWeight(item.weight) === 26.0) &&
          item.cartQuantity >= 1
      );
      for (const addItem of containerOfferItems) {
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
            content: `<b>Special Offer!</b><br>Free Container added to the cart successfully.`,
          });
          newDisplayedOffers.add(`container_${addItem.itemId}`);
        }
      }

      setCartItems(cartItemsMap);
      setCartData(customerCart);
      setCount(totalQuantity);
      localStorage.setItem("cartCount", totalQuantity.toString());
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
      setCount(0);
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

  const fetchRelatedItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showItemsForCustomrs`
      );

      console.log("Fetched Categories:", response.data);

      // Find the category that contains the selected item
      const matchingCategory = response.data.find(
        (category: any) =>
          category.itemsResponseDtoList &&
          Array.isArray(category.itemsResponseDtoList) && // Ensure it's an array
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
        // Extract related items, excluding the selected one
        const categoryItems = matchingCategory.itemsResponseDtoList
          .filter(
            (item: any) =>
              item.itemId !== itemDetails?.itemId &&
              item.itemId !== itemDetails?.itemId // Corrected logical condition
          )
          .slice(0, 4); // Limit to 4 items

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

  const handleAddToCart = async (item: Item) => {
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
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  // Function to handle removing an item completely from the cart
  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [itemId]: true },
    }));

    try {
      // Use the minusCartItem endpoint with PATCH
      await axios.patch(
        `${BASE_URL}/cart-service/cart/minusCartItem`,
        { customerId, itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Item removed from cart successfully.");
      await fetchCartData("");
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Error removing item from cart");
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: false },
      }));
    }
  };

  // Modified handleQuantityChange function
  const handleQuantityChange = async (item: Item, increment: boolean) => {
    const endpoint = increment
      ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
      : `${BASE_URL}/cart-service/cart/minusCartItem`;

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
        // Instead of using the DELETE endpoint, use minusCartItem
        // to remove the last item
        await axios.patch(
          `${BASE_URL}/cart-service/cart/minusCartItem`,
          { customerId, itemId: item.itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Item removed from cart successfully.");
      } else {
        const requestConfig = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const requestData = { customerId, itemId: item.itemId };

        if (increment) {
          await axios.post(endpoint, requestData, requestConfig);
        } else {
          try {
            const patchRes = await axios.patch(
              endpoint,
              requestData,
              requestConfig
            );
            console.log("PATCH success:", patchRes.status, patchRes.data);
          } catch (error) {
            // Check if the error is an AxiosError using 'instanceof'
            if (error instanceof AxiosError && error.response) {
              const { status, data } = error.response;
              console.warn("PATCH error response:", status, data);
              if (status === 200 || status === 204) {
                console.log("PATCH treated as error but actually succeeded.");
              } else {
                throw error; // Rethrow if the error is not handled
              }
            } else {
              console.error("Network or unknown PATCH error:", error);
              throw error; // Rethrow non-Axios errors
            }
          }
        }
      }

      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));

      try {
        await fetchCartData(item.itemId);
      } catch (err) {
        console.error("Error fetching updated cart data:", err);
        message.error("Cart updated, but failed to refresh view.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity.");
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

    const mapTypeToRole = (type: any) => {
      if (type === "sent") return "user";
      if (type === "received") return "assistant";
      return "system";
    };

    const previousMessages = messages.map((msg) => ({
      role: mapTypeToRole(msg.type),
      content: msg.text,
    }));

    // Add new user message to the conversation
    previousMessages.push({
      role: "user",
      content: newMessage.text,
    });

    // Function to get the last assistant's response safely
    const getLastAssistantMessage = (msgs: Message[]) => {
      return (
        [...msgs].reverse().find((msg) => msg.type === "received")?.text || ""
      );
    };

    // Include last assistant response
    const lastAssistantMessage = getLastAssistantMessage(messages);
    if (lastAssistantMessage) {
      previousMessages.push({
        role: "assistant",
        content: lastAssistantMessage,
      });
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: previousMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: response.data.choices[0].message.content,
          type: "system" as const,
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry, I couldn't process your request at the moment.",
          type: "system" as const,
        },
      ]);
    }
  };

  const handleChatView = (value: any) => {
    setShowChatSection(!showChatSection);
    if (messages.length == 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: `What would you like to know about ${value} this product?`,
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

  // Helper function to check if the item is explicitly added by the user
  const isItemUserAdded = (itemId: string): boolean => {
    // Check if there is at least one cart entry for this item with status "ADD"
    return cartData.some(
      (cartItem) => cartItem.itemId === itemId && cartItem.status === "ADD"
    );
  };

  // Added handler for closing Special Offers modal
  const handleOfferModalClose = () => {
    setOfferModal({ visible: false, content: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Added Special Offers Modal from categories.tsx */}
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

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
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
          {/* Left Column - Product Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Product Image Section */}
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={itemDetails?.itemImage || itemDetails?.image}
                      alt={itemDetails?.itemName}
                      className="w-full h-full object-contain transform transition-transform hover:scale-105"
                    />
                  </div>

                  {/* Enhanced Discount Badge */}
                  {itemDetails && (
                    <div className="absolute top-4 Hackett
                    right-4 flex items-center">
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

                  {/* Stock Status Badge */}
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

                {/* Product Info Section */}
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

                  {/* Price Section */}
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{itemDetails?.itemPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{itemDetails?.itemMrp || itemDetails?.priceMrp}
                    </span>
                  </div>

                  {/* Enhanced Add to Cart Section */}
                  <div className="space-y-4">
                    {itemDetails?.quantity !== 0 ? (
                      itemDetails && isItemUserAdded(itemDetails.itemId) ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                            <button
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
                            </button>
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="animate-spin text-purple-600" />
                            ) : (
                              <span className="font-medium text-purple-700">
                                {cartItems[itemDetails.itemId]}
                              </span>
                            )}
                            <button
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
                            </button>
                            {/* Delete Button */}
                            <button
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all ml-2"
                              onClick={() => {
                                if (itemDetails) {
                                  handleRemoveItem(itemDetails.itemId);
                                }
                              }}
                              disabled={loadingItems.items[itemDetails.itemId]}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          {isMaxStockReached(itemDetails) && (
                            <p className="text-yellow-600 text-sm flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" />
                              Maximum available quantity reached
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            itemDetails &&
                            !loadingItems.items[itemDetails.itemId] &&
                            handleAddToCart(itemDetails)
                          }
                          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
          transform transition-all hover:scale-105 flex items-center justify-center gap-2"
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
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-200 text-gray-600 rounded-lg 
        flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section - Enhanced */}
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
                    {itemDetails?.itemDescription}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat/Related Items */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Chat Section Toggle */}
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
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.type === "sent"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-lg ${
                              msg.type === "sent"
                                ? "bg-purple-600 text-white"
                                : "bg-purple-50 border border-purple-100"
                            }`}
                          >
                            {msg.type === "system" && (
                              <Bot className="w-4 h-4 text-purple-600 mb-1" />
                            )}
                            <span className="text-sm">{msg.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Ask about this product..."
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Related Items */}
              <div
              className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Related Items</h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                      onClick={() => handleRelatedItemClick(item)}
                    >
                      {/* Discount badge */}
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {calculateDiscount(item.itemMrp, item.itemPrice)}% OFF
                      </div>

                      {/* Item image and details */}
                      <div className="p-3">
                        <div className="h-32 bg-gray-100 rounded-md mb-3"></div>
                        <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
                          {item.itemName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            ₹{item.itemPrice}
                          </span>
                          <span className="text-gray-500 text-sm line-through">
                            ₹{item.itemMrp}
                          </span>
                        </div>

                        {/* Related item cart controls */}
                        <div className="mt-3">
                          {item.quantity !== 0 ? (
                            isItemUserAdded(item.itemId) ? (
                              <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                                <button
                                  className={`p-1.5 rounded-lg transition-all ${
                                    cartItems[item.itemId] <= 1
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item, false);
                                  }}
                                  disabled={loadingItems.items[item.itemId]}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>

                                {loadingItems.items[item.itemId] ? (
                                  <Loader2 className="animate-spin text-purple-600 w-4 h-4" />
                                ) : (
                                  <span className="font-medium text-purple-700">
                                    {cartItems[item.itemId]}
                                  </span>
                                )}

                                <button
                                  className={`p-1.5 rounded-lg transition-all ${
                                    cartItems[item.itemId] >= item.quantity
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      cartItems[item.itemId] < item.quantity
                                    ) {
                                      handleQuantityChange(item, true);
                                    }
                                  }}
                                  disabled={
                                    cartItems[item.itemId] >= item.quantity ||
                                    loadingItems.items[item.itemId]
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                {/* Delete Button for related items */}
                                <button
                                  className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(item.itemId);
                                  }}
                                  disabled={loadingItems.items[item.itemId]}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!loadingItems.items[item.itemId]) {
                                    handleAddToCart(item);
                                  }
                                }}
                                className="w-full py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 
transform transition-all flex items-center justify-center gap-1.5"
                              >
                                {loadingItems.items[item.itemId] ? (
                                  <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                  <>
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                  </>
                                )}
                              </button>
                            )
                          ) : (
                            <button
                              disabled
                              className="w-full py-2 bg-gray-200 text-gray-600 text-sm rounded-lg 
flex items-center justify-center gap-1.5 cursor-not-allowed"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Out of Stock
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDisplayPage;