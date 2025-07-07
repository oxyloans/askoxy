import React, { useEffect, useState,useRef, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { message, Modal } from "antd";
import ReactMarkdown from "react-markdown"; // ✅ At top of file

import {
  ShoppingCart,
  Home,
  ChevronRight,
  Minus,
  Plus,
  Package2,
  Star,
  Bot,
  Send,
  X,
  MessageCircle,
  AlertCircle,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Maximize2,
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
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

interface GoldPriceUrl {
  id: string;
  goLdUrls: string | null;
  description: string;
}

interface FullscreenImage extends GoldImage {
  index: number;
}
interface GoldImage {
  [key: string]: any;
  id: string;
  imageUrl: string;
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
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [fullscreenImage, setFullscreenImage] =
    useState<FullscreenImage | null>(null);
  const [wasModalOpen, setWasModalOpen] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const [showChatSection, setShowChatSection] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [modalData, setModalData] = useState<{
    images: GoldImage[];
    urls: string[];
  }>({ images: [], urls: [] });
  const [offerModal, setOfferModal] = useState<{
    visible: boolean;
    content: string;
  }>({
    visible: false,
    content: "",
  });
  const [goldPriceUrls, setGoldPriceUrls] = useState<
    GoldPriceUrl | undefined
  >();
  const [goldPriceModal, setGoldPriceModal] = useState<{
    visible: boolean;
    urls: string[];
    images: GoldImage[];
  }>({
    visible: false,
    urls: [],
    images: [],
  });
  const [displayedOffers, setDisplayedOffers] = useState<Set<string>>(
    new Set()
  );

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  const apiKey = "";

  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

  const fetchItemImages = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/ImagesViewBasedOnItemId?itemId=${id}`
      );
      console.log("Item images response:", response.data);
      setItemImages(response.data || []);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error("Error fetching item images:", error);
      setItemImages([]);
    }
  };
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchItemDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showGroupItemsForCustomrs`
      );
      const allItems = response.data.flatMap((group: any) =>
        group.categories.flatMap((category: any) =>
          category.itemsResponseDtoList.map((item: any) => ({
            ...item,
            category: category.categoryName,
          }))
        )
      );
      const item = allItems.find((item: Item) => item.itemId === id);
      if (item) {
        setItemDetails(item);
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
        fetchItemImages(itemId);
      }
      fetchCartData("");
      fetchRelatedItems();
    }
  }, [itemId, state]);

  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item);
    fetchItemImages(item.itemId);
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
      replace: true,
    });
  };

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

      const newDisplayedOffers = new Set(displayedOffers);

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
            content: `<b>2+1 Offer Is Active.</b><br><br>Buy 2 Bags of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get 1 Bag of ${
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
        const freeItems = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            normalizeWeight(item.weight) === 1.0 &&
            item.cartQuantity === 2
        );
        if (freeItems && !newDisplayedOffers.has(`5+2_${addItem.itemId}`)) {
          setOfferModal({
            visible: true,
            content: `<b>5+2 Offer Is Active.</b><br><br>Buy 1 Bag of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get 2 Bags of ${
              freeItems.itemName
            } of ${normalizeWeight(
              freeItems.weight
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
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
        `${BASE_URL}/product-service/showGroupItemsForCustomrs`
      );

      console.log("Fetched Categories:", response.data);

      const matchingCategory = response.data
        .flatMap((group: any) => group.categories)
        .find((category: any) =>
          category.itemsResponseDtoList.some(
            (item: any) => item.itemId === itemDetails.itemId
          )
        );

      if (
        matchingCategory &&
        Array.isArray(matchingCategory.itemsResponseDtoList)
      ) {
        const categoryItems = matchingCategory.itemsResponseDtoList
          .filter((item: any) => item.itemId !== itemDetails.itemId)
          .slice(0, 4)
          .map((item: any) => ({
            ...item,
            category: matchingCategory.categoryName,
          }));

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

  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [itemId]: true },
    }));

    try {
      const cartItemToRemove = cartData.find(
        (item) => item.itemId === itemId && item.status === "ADD"
      );

      if (!cartItemToRemove) {
        message.error("Item not found in cart");
        return;
      }

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
            if (error instanceof AxiosError && error.response) {
              const { status, data } = error.response;
              console.warn("PATCH error response:", status, data);
              if (status === 200 || status === 204) {
                console.log("PATCH treated as error but actually succeeded.");
              } else {
                throw error;
              }
            } else {
              console.error("Network or unknown PATCH error:", error);
              throw error;
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

  // const handleSendMessage = async () => {
  //   if (!inputMessage.trim()) return;

  //   const newMessage = {
  //     id: messages.length,
  //     text: inputMessage,
  //     type: "sent" as const,
  //   };
  //   setMessages((prev) => [...prev, newMessage]);
  //   setInputMessage("");

  //   const mapTypeToRole = (type: any) => {
  //     if (type === "sent") return "user";
  //     if (type === "received") return "assistant";
  //     return "system";
  //   };

  //   const previousMessages = messages.map((msg) => ({
  //     role: mapTypeToRole(msg.type),
  //     content: msg.text,
  //   }));

  //   previousMessages.push({
  //     role: "user",
  //     content: newMessage.text,
  //   });

  //   const getLastAssistantMessage = (msgs: Message[]) => {
  //     return (
  //       [...msgs].reverse().find((msg) => msg.type === "received")?.text || ""
  //     );
  //   };

  //   const lastAssistantMessage = getLastAssistantMessage(messages);
  //   if (lastAssistantMessage) {
  //     previousMessages.push({
  //       role: "assistant",
  //       content: lastAssistantMessage,
  //     });
  //   }

  //   try {
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         model: "gpt-4-turbo",
  //         messages: previousMessages,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${apiKey}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: messages.length + 2,
  //         text: response.data.choices[0].message.content,
  //         type: "system" as const,
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Error getting AI response:", error);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: messages.length + 2,
  //         text: "Sorry, I couldn't process your request at the moment.",
  //         type: "system" as const,
  //       },
  //     ]);
  //   }
  // };

  // const handleChatView = (value: any) => {
  //   setShowChatSection(!showChatSection);
  //   if (messages.length == 0) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: messages.length + 1,
  //         text: `What would you like to know about ${value} this product?`,
  //         type: "system" as const,
  //       },
  //     ]);
  //   }
  // };


  const handleChatView = async (productName: string) => {
    setShowChatSection(true);

    const introMessage: Message = {
      id: messages.length,
     text: `Can you tell me about "${productName}"?`,
content: `Can you tell me about "${productName}"?`,

      type: "sent",
      role: "user",
    
    };
    

    const updatedMessages = [introMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessages),
      });

      const data = await response.text();
      const isImageUrl = data.startsWith("http");

      const assistantReply: Message = {
        role: "assistant",
        content: data,
        isImage: isImageUrl,
        id: updatedMessages.length,
        text: isImageUrl ? "" : data, // show text unless it's an image
        type: "received",
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...updatedMessages,
        {
          id: updatedMessages.length,
          text: "❌ Sorry, I couldn't fetch product info right now.",
          type: "system",
          role: "assistant",
          content: "❌ Sorry, I couldn't fetch product info right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    // Message shown to user: only original inputMessage
    const userMsg: Message = {
      role: "user",
      content: inputMessage,   // user sees only original input
      text: inputMessage,
      id: messages.length,
      type: "sent",
    };
  
    // Prepare messages for backend with appended " Minimum 20 Words"
    const backendMessages = [
      ...messages,
      {
        ...userMsg,
        content: inputMessage + "Minimum 15 Words", // appended only for backend
      },
    ];
  
    // Update UI with original message only
    setMessages([...messages, userMsg]);
    setInputMessage("");
    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendMessages),  // send modified content here
      });
  
      const data = await response.text();
      const isImageUrl = data.startsWith("http");
  
      const assistantReply: Message = {
        role: "assistant",
        content: data,
        text: isImageUrl ? "" : data,
        isImage: isImageUrl,
        id: messages.length + 1,
        type: "received",
      };
  
      setMessages(prev => [...prev, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 1,
          text: "❌ Something went wrong. Please try again.",
          type: "system",
          role: "assistant",
          content: "❌ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  
  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return {
        text: "Out of Stock",
        color:
          "bg-red- Valuable insights from xAI team members, directly to your inbox 100 text-red-600",
      };
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

  const isItemUserAdded = (itemId: string): boolean => {
    return cartData.some(
      (cartItem) => cartItem.itemId === itemId && cartItem.status === "ADD"
    );
  };

  const handleOfferModalClose = () => {
    setOfferModal({ visible: false, content: "" });
  };

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

  const getAllImages = () => {
    const images = [];

    if (itemDetails?.itemImage || itemDetails?.image) {
      images.push({
        imageId: "existing",
        imageUrl: itemDetails.itemImage || itemDetails.image,
        itemId: itemDetails.itemId,
      });
    }

    if (itemImages && itemImages.length > 0) {
      images.push(...itemImages);
    }

    return images;
  };

  const fetchGoldDetails = async (id: string) => {
    try {
      const [imagesResponse, urlsResponse] = await Promise.all([
        axios.get(
          `${BASE_URL}/product-service/imagePriceBasedOnItemId?itemId=${id}`
        ),
        axios.get(
          `${BASE_URL}/product-service/goldUrsBasedOnItemId?itemId=${id}`
        ),
      ]);

      const rawImages = imagesResponse.data?.list || [];
      const images: GoldImage[] = rawImages.map(
        (img: { images: string }, index: number) => ({
          id: `image-${index}`,
          imageUrl: img.images,
        })
      );

      const urlsRaw = urlsResponse.data?.goLdUrls || "";
      const urls = urlsRaw
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean);

      return { images, urls };
    } catch (error) {
      console.error("Error fetching gold details:", error);
      return { images: [], urls: [] };
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && fullscreenImage) {
        closeFullscreen();
      }
    };

    if (fullscreenImage) {
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [fullscreenImage]);

  const openFullscreen = (image: GoldImage, index: number): void => {
    setFullscreenImage({ ...image, index });
    handleGoldPriceModalClose();
  };

  const closeFullscreen = (): void => {
    setFullscreenImage(null);
  };

  const handleComparePrices = async () => {
    if (!itemId) return;
    const { images, urls } = await fetchGoldDetails(itemId);
    setModalData({ images, urls });
    setGoldPriceModal({ visible: true, images, urls });
  };

  const goldItemIds = [
    "619bd23a-0267-46da-88da-30977037225a",
    "4fca7ab8-bfc6-446a-9405-1aba1912d90a",
  ];

  const handleGoldPriceModalClose = () => {
    setGoldPriceModal({ visible: false, urls: [], images: [] });
  };

  return (
    <div className="min-h-screen">
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
            __html: DOMPurify.sanitize(offerModal.content),
          }}
        />
      </Modal>

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
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    {getAllImages().length > 0 ? (
                      <>
                        <img
                          src={getAllImages()[currentImageIndex]?.imageUrl}
                          alt={itemDetails?.itemName}
                          onClick={() =>
                            openFullscreen(
                              {
                                ...getAllImages()[currentImageIndex],
                                id:
                                  getAllImages()[currentImageIndex].imageId ||
                                  "image-fallback",
                              },
                              currentImageIndex
                            )
                          }
                          onMouseMove={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const x =
                              ((e.clientX - rect.left) / rect.width) * 100;
                            const y =
                              ((e.clientY - rect.top) / rect.height) * 100;
                            e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transformOrigin = "center";
                          }}
                          className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 ease-in-out hover:scale-[2]"
                        />

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

                  {/* {itemDetails && goldItemIds.includes(itemDetails.itemId) && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleComparePrices}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>Compare Prices</span>
                      </button>
                    </div>
                  )} */}
                </div>
                <div className="space-y-4">
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
                        <span className="ml-2 text-sm text-gray-600">
                          (4.8)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{itemDetails?.itemPrice}
                      </span>
                      {itemDetails?.itemMrp &&
                        itemDetails.itemMrp > itemDetails.itemPrice && (
                          <>
                            <span className="text-xl text-gray-500 line-through">
                              ₹{itemDetails.itemMrp}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                              {calculateDiscount(
                                itemDetails.itemMrp,
                                itemDetails.itemPrice
                              )}
                              % OFF
                            </span>
                          </>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Weight: {itemDetails?.itemWeight || itemDetails?.weight}
                      {itemDetails?.weightUnit || itemDetails?.units}
                    </p>
                  </div>

                  {itemDetails && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                      <div
                        className={`px-3 py-1 rounded-full ${
                          getStockStatus(itemDetails.quantity).color
                        }`}
                      >
                        {getStockStatus(itemDetails.quantity).text}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {itemDetails && (
                      <div className="space-y-3">
                        {isItemUserAdded(itemDetails.itemId) ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-purple-50 rounded-lg p-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(itemDetails, false)
                                }
                                disabled={
                                  loadingItems.items[itemDetails.itemId] ||
                                  localStorage.getItem("TypeLogin") === "Caller"
                                }
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
                                onClick={() =>
                                  handleQuantityChange(itemDetails, true)
                                }
                                disabled={
                                  loadingItems.items[itemDetails.itemId] ||
                                  isMaxStockReached(itemDetails) ||
                                  localStorage.getItem("TypeLogin") === "Caller"
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
                              onClick={() =>
                                handleRemoveItem(itemDetails.itemId)
                              }
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
                              itemDetails.quantity === 0 ||
                              localStorage.getItem("TypeLogin") === "Caller"
                            }
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                            <span>
                              {itemDetails.quantity === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                            </span>
                          </button>
                        )}

                        {isMaxStockReached(itemDetails) && (
                          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">
                              Maximum available quantity reached
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleChatView(itemDetails?.itemName ?? "")}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
                  >
                    <Bot className="w-5 h-5" />
                    <span>Ask AI about this product</span>
                  </button>
                </div>
              </div>
              {itemDetails?.itemDescription && (
                <div className="mt-4 w-full">
                  <h3 className="font-bold text-purple-700 mb-2 font-bold">
                    Description :
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed w-full">
                    {itemDetails.itemDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            {showChatSection ? (
              <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-lg p-4 transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold flex items-center gap-2 text-gray-800">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span>Product Assistant</span>
                  </h3>
                  <button
                    onClick={() => setShowChatSection(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Chat Body */}
                <div className="border rounded-lg flex flex-col h-[24rem] sm:h-[26rem]">
                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "sent"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg text-sm leading-snug break-words ${
                            message.type === "sent"
                              ? "bg-purple-600 text-white"
                              : message.type === "system"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <ReactMarkdown className="prose prose-sm max-w-none">
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {/* Loading Indicator */}
                    {loading && (
                      <div className="text-center text-sm text-gray-500">
                        AI is thinking...
                      </div>
                    )}

                    {/* Auto-scroll anchor */}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="border-t px-3 py-2">
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Ask about this product..."
                        className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
                        aria-label="Ask about product"
                      />

                      <button
                        onClick={handleSendMessage}
                        disabled={loading || inputMessage.trim() === ""}
                        className={`ml-2 transition-colors ${
                          inputMessage.trim()
                            ? "text-purple-600 hover:text-purple-800"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                              {(item.itemWeight || item.weight) +
                                " " +
                                (item.weightUnit || item.units || "")}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-purple-600 text-sm">
                                ₹{item.itemPrice}
                              </span>
                              {item.itemMrp &&
                                item.itemMrp > item.itemPrice && (
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
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Compare Gold Prices"
        open={goldPriceModal.visible}
        onCancel={handleGoldPriceModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900"
            onClick={handleGoldPriceModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "600px" }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gold Item Images
            </h3>
            {goldPriceModal.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {goldPriceModal.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={`Gold item ${index + 1}`}
                      className="w-full h-32 object-contain rounded-lg bg-gray-50 cursor-pointer transition-transform hover:scale-105"
                      onClick={() => openFullscreen(image, index)}
                    />
                    <div
                      className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => openFullscreen(image, index)}
                    >
                      <Maximize2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No additional images available.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Today Gold Price Comparison Links
            </h3>

            {goldPriceModal.urls.length > 0 ? (
              <ul className="space-y-2">
                {goldPriceModal.urls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No price comparison links available.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[9999]"
          onClick={closeFullscreen}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
              onClick={closeFullscreen}
              title="Close fullscreen"
            >
              <X size={24} />
            </button>

            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
              Press ESC to close
            </div>

            <img
              src={fullscreenImage.imageUrl}
              alt={`Gold item ${fullscreenImage.index + 1} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              Image {fullscreenImage.index + 1} of {modalData.images.length}
            </div>

            {modalData.images.length > 1 && (
              <>
                {fullscreenImage.index > 0 && (
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const prevIndex = fullscreenImage.index - 1;
                      setFullscreenImage({
                        ...modalData.images[prevIndex],
                        index: prevIndex,
                      });
                    }}
                    title="Previous image"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {fullscreenImage.index < modalData.images.length - 1 && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextIndex = fullscreenImage.index + 1;
                      setFullscreenImage({
                        ...modalData.images[nextIndex],
                        index: nextIndex,
                      });
                    }}
                    title="Next image"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};



export default ItemDisplayPage;


