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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
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

interface ItemImage {
  imageId: string;
  imageUrl: string;
  itemId: string;
}

const ItemDisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(
    state?.item || null
  );
  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // New function to fetch item images
  const fetchItemImages = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/ImagesViewBasedOnItemId?itemId=${id}`
      );
      console.log("Item images response:", response.data);
      setItemImages(response.data || []);
      setCurrentImageIndex(0); // Reset to first image when new images are loaded
    } catch (error) {
      console.error("Error fetching item images:", error);
      setItemImages([]);
    }
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
        // Fetch images for this item
        await fetchItemImages(id);
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
        // Fetch images even if item details are passed via state
        fetchItemImages(itemId);
      }
      fetchCartData("");
      fetchRelatedItems();
    }
  }, [itemId, state]);

  // Updated navigation handler for related items
  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item); // Update item details immediately
    fetchItemImages(item.itemId); // Fetch images for the new item
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
    if (!itemDetails) return;
    
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showItemsForCustomrs`
      );

      console.log("Fetched Categories:", response.data);

      // Find the category that contains the selected item
      const matchingCategory = response.data.find(
        (category: any) =>
          category.itemsResponseDtoList &&
          Array.isArray(category.itemsResponseDtoList) &&
          category.itemsResponseDtoList.some(
            (item: any) => item.itemId === itemDetails.itemId
          )
      );

      if (matchingCategory && Array.isArray(matchingCategory.itemsResponseDtoList)) {
        // Extract related items, excluding the selected one
        const categoryItems = matchingCategory.itemsResponseDtoList
          .filter((item: any) => item.itemId !== itemDetails.itemId)
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

  // Update fetchRelatedItems when itemDetails changes
  useEffect(() => {
    if (itemDetails) {
      fetchRelatedItems();
    }
  }, [itemDetails]);

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

  // Updated function to handle removing an item completely from the cart
  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [itemId]: true },
    }));

    try {
      // Find the cart item to remove
      const cartItemToRemove = cartData.find(
        (item) => item.itemId === itemId && item.status === "ADD"
      );

      if (!cartItemToRemove) {
        message.error("Item not found in cart");
        return;
      }

      // Use the PATCH endpoint for removing items
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

  // Image navigation functions
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? getAllImages().length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === getAllImages().length - 1 ? 0 : prev + 1
    );
  };

  // Function to get all images (existing + new from API)
  const getAllImages = () => {
    const images = [];
    
    // Add existing item image if available
    if (itemDetails?.itemImage || itemDetails?.image) {
      images.push({
        imageId: 'existing',
        imageUrl: itemDetails.itemImage || itemDetails.image,
        itemId: itemDetails.itemId
      });
    }
    
    // Add images from API
    if (itemImages && itemImages.length > 0) {
      images.push(...itemImages);
    }
    
    return images;
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
                {/* Enhanced Product Image Section with Gallery */}
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    {getAllImages().length > 0 ? (
                      <>
                        <img
                          src={getAllImages()[currentImageIndex]?.imageUrl}
                          alt={itemDetails?.itemName}
                          className="w-full h-full object-contain transform transition-transform hover:scale-105"
                        />

                        {/* Image Navigation Controls */}
                        {getAllImages().length > 1 && (
                          <>
                            <button
                              onClick={handlePrevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                            >
                              <ChevronRightIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package2 className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  {getAllImages().length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {getAllImages().map((image, index) => (
                        <button
                          key={image.imageId}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-purple-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image.imageUrl}
                            alt={`${itemDetails?.itemName} ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {itemDetails?.itemName}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{itemDetails?.itemPrice}
                      </span>
                      {itemDetails?.itemMrp && itemDetails.itemMrp > itemDetails.itemPrice && (
                        <>
                          <span className="text-xl text-gray-500 line-through">
                            ₹{itemDetails.itemMrp}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                            {calculateDiscount(itemDetails.itemMrp, itemDetails.itemPrice)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Weight: {itemDetails?.itemWeight || itemDetails?.weight}
                    {itemDetails?.weightUnit || itemDetails?.units}
                    </p>
                  </div>

                  {/* Stock Status */}
                  {itemDetails && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                      <div className={`px-3 py-1 rounded-full ${getStockStatus(itemDetails.quantity).color}`}>
                        {getStockStatus(itemDetails.quantity).text}
                      </div>
                    </div>
                  )}

                  {/* Product Description */}
                  {itemDetails?.itemDescription && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {itemDetails.itemDescription}
                      </p>
                    </div>
                  )}

                  {/* Add to Cart Section */}
                  <div className="border-t pt-4">
                    {itemDetails && (
                      <div className="space-y-3">
                        {isItemUserAdded(itemDetails.itemId) ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-purple-50 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(itemDetails, false)}
                                disabled={loadingItems.items[itemDetails.itemId]}
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {loadingItems.items[itemDetails.itemId] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                              </button>
                              <span className="px-4 py-2 font-medium text-purple-600">
                                {cartItems[itemDetails.itemId] || 0}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(itemDetails, true)}
                                disabled={
                                  loadingItems.items[itemDetails.itemId] ||
                                  isMaxStockReached(itemDetails)
                                }
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {loadingItems.items[itemDetails.itemId] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(itemDetails.itemId)}
                              disabled={loadingItems.items[itemDetails.itemId]}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Remove from cart"
                            >
                              {loadingItems.items[itemDetails.itemId] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(itemDetails)}
                            disabled={
                              loadingItems.items[itemDetails.itemId] ||
                              itemDetails.quantity === 0
                            }
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                            <span>
                              {itemDetails.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </span>
                          </button>
                        )}
                        
                        {isMaxStockReached(itemDetails) && (
                          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Maximum available quantity reached</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Button */}
                  <button
                    onClick={() => handleChatView(itemDetails?.itemName)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
                  >
                    <Bot className="w-5 h-5" />
                    <span>Ask AI about this product</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            {showChatSection && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Product Assistant</span>
                  </h3>
                  <button
                    onClick={() => setShowChatSection(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="h-64 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "sent" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.type === "sent"
                              ? "bg-purple-600 text-white"
                              : message.type === "system"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask about this product..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Related Products */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Related Products</h3>
              
              {relatedItems.length > 0 ? (
                <div className="space-y-4">
                  {relatedItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleRelatedItemClick(item)}
                    >
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.itemImage || item.image ? (
                            <img
                              src={item.itemImage || item.image}
                              alt={item.itemName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package2 className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {item.itemName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
  {(item.itemWeight || item.weight) + ' ' + (item.weightUnit || item.units || '')}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-purple-600 text-sm">
                              ₹{item.itemPrice}
                            </span>
                            {item.itemMrp && item.itemMrp > item.itemPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{item.itemMrp}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No related products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ItemDisplayPage;