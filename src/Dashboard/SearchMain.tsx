// SearchMain.tsx
import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Image,
  Typography,
  Spin,
  Empty,
  Badge,
  Tag,
  Button,
  Space,
  Divider,
  Alert,
} from "antd";
import { ArrowLeft, Loader2, Home, ChevronRight } from "lucide-react";
import BASE_URL from "../Config";
import axios from "axios";
import { message } from "antd";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// Interfaces
interface Agent {
  agentId: string;
  assistantId: string;
  name: string;
  description: string;
  instructions: string | null;
  status: string;
  profileImagePath: string;
  imageUrl: string;
  activeStatus: boolean;
}

interface Product {
  itemName: string;
  itemMrp: number;
  units: any;
  itemImage: string;
  weight: number;
  saveAmount: number;
  itemId: string;
  itemDescription: string;
  savePercentage: number | null;
  itemPrice: number;
  bmvCoins: number;
  quantity: number;
  barcodeValue: any;
}

interface Category {
  categoryLogo: string;
  itemsResponseDtoList: Product[];
  categoryName: string;
}

interface ApiResponse {
  agents: Agent[];
  items: Category[];
  empty: boolean;
}

interface CartItem {
  itemId: string;
  cartId: string;
  cartQuantity: number;
  status: string;
}

const SearchMain: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { setCount } = context;
  const query = (location.state as { searchQuery?: string })?.searchQuery || "";
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
  }>({
    items: {},
  });

  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const MIN_SEARCH_LENGTH = 3;
  // ✅ Helpers: hide empty / null / undefined / 0.0 values from UI
  const isValidText = (v: any) => {
    if (v === null || v === undefined) return false;
    const s = String(v).trim();
    if (!s) return false;
    const lower = s.toLowerCase();
    if (
      lower === "null" ||
      lower === "undefined" ||
      lower === "na" ||
      lower === "n/a"
    )
      return false;
    return true;
  };

  const isValidNumber = (v: any) => {
    if (v === null || v === undefined) return false;
    const n = Number(v);
    if (!Number.isFinite(n)) return false;
    return n > 0; // ✅ 0.0 / 0 will be treated as invalid (not displayed)
  };

  const isValidImageUrl = (url: any) => {
    if (!isValidText(url)) return false;
    const s = String(url).trim();
    if (s.includes("placehold") || s.includes("placeholder")) return false;
    return true;
  };
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      fetchSearchData(trimmedQuery);
    } else {
      setData(null);
      setError("Search query too short (min 3 characters)");
    }
  }, [query]);

  const fetchSearchData = async (q: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/product-service/dynamicSearch`,
        {
          params: { q },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      const firstValid = (response.data?.items || []).find((cat) => {
        const hasValidName = isValidText(cat.categoryName);
        const list = Array.isArray(cat.itemsResponseDtoList)
          ? cat.itemsResponseDtoList
          : [];
        const hasValidItems = list.some(
          (p) => isValidNumber(p.itemPrice) && isValidNumber(p.itemMrp)
        );
        return hasValidName && hasValidItems;
      });
      setSelectedCategory(firstValid?.categoryName || null);
    } catch (err) {
      console.error("Error fetching search data:", err);
      setError("Failed to fetch search results. Please try again.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      if (!customerId || !token) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.customerCartResponseList) {
          const cartItemsMap = response.data.customerCartResponseList.reduce(
            (acc: Record<string, number>, item: CartItem) => {
              if (item.status !== "FREE") {
                acc[item.itemId] =
                  (acc[item.itemId] || 0) + (item.cartQuantity || 0);
              }
              return acc;
            },
            {}
          );
          setCartItems(cartItemsMap);
          setCartData(response.data.customerCartResponseList);
        } else {
          setCartItems({});
          setCartData([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartData();
  }, [customerId, token]);

  const calculateDiscount = (mrp: number, price: number) => {
    if (mrp === 0) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleAddToCart = async (item: Product) => {
    if (!token || !customerId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => navigate("/whatsapplogin"), 2000);
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Item added to cart successfully.");

      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cartItemsMap = response.data.customerCartResponseList.reduce(
        (acc: Record<string, number>, cartItem: CartItem) => {
          if (cartItem.status !== "FREE") {
            acc[cartItem.itemId] =
              (acc[cartItem.itemId] || 0) + (cartItem.cartQuantity || 0);
          }
          return acc;
        },
        {}
      );
      setCartItems(cartItemsMap);
      setCartData(response.data.customerCartResponseList);
      setCount(
        (Object.values(cartItemsMap) as number[]).reduce(
          (acc, quantity) => acc + quantity,
          0
        )
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleQuantityChange = async (item: Product, increment: boolean) => {
    if (!token || !customerId) return;
    if (cartItems[item.itemId] === item.quantity && increment) {
      message.warning("Sorry, Maximum quantity reached.");
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    try {
      const endpoint = increment
        ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
        : `${BASE_URL}/cart-service/cart/minusCartItem`;
      const method = increment ? "post" : "patch";

      if (!increment && cartItems[item.itemId] <= 1) {
        const targetCartId = cartData.find(
          (cart) => cart.itemId === item.itemId
        )?.cartId;
        if (targetCartId) {
          await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
            data: { id: targetCartId },
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Item removed from cart successfully.");
        }
      } else {
        await axios[method](
          endpoint,
          { customerId, itemId: item.itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cartItemsMap = response.data.customerCartResponseList.reduce(
        (acc: Record<string, number>, cartItem: CartItem) => {
          if (cartItem.status !== "FREE") {
            acc[cartItem.itemId] =
              (acc[cartItem.itemId] || 0) + (cartItem.cartQuantity || 0);
          }
          return acc;
        },
        {}
      );
      setCartItems(cartItemsMap);
      setCartData(response.data.customerCartResponseList);
      setCount(
        (Object.values(cartItemsMap) as number[]).reduce(
          (acc, quantity) => acc + quantity,
          0
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleItemClick = (item: Product) => {
    navigate(`/main/itemsdisplay/${item.itemId}`);
  };

  const handleAgentClick = (agent: Agent) => {
    navigate(`/${agent.assistantId}/${agent.agentId}/${agent.name}`);
  };

  const isItemUserAdded = (itemId: string): boolean => {
    return cartData.some(
      (cartItem) => cartItem.itemId === itemId && cartItem.status === "ADD"
    );
  };

  const hasNoResults =
    data?.empty || (!data?.agents.length && !data?.items.length);

  // CRITICAL FILTER: Remove items with itemPrice <= 0 OR itemMrp <= 0 OR quantity <= 0
  const filteredData = useMemo(() => {
    if (!data) return null;

    // 1) Filter items inside categories
    const cleanedCategories: Category[] = (data.items || [])
      .map((cat) => {
        const items = Array.isArray(cat.itemsResponseDtoList)
          ? cat.itemsResponseDtoList
          : [];

        const cleanedItems = items.filter((prod) => {
          // ✅ don’t show if price/mrp is 0.0 or null or undefined
          if (!isValidNumber(prod.itemPrice)) return false;
          if (!isValidNumber(prod.itemMrp)) return false;

          // quantity filter? keep it OPTIONAL. Many times quantity can be 0 but still show.
          // If you want to hide out-of-stock, enable this:
          // if (!isValidNumber(prod.quantity)) return false;

          return true;
        });

        return {
          ...cat,
          // ✅ hide logo if invalid (we’ll also hide while rendering)
          categoryLogo: isValidImageUrl(cat.categoryLogo)
            ? cat.categoryLogo
            : "",
          // ✅ hide name if invalid
          categoryName: isValidText(cat.categoryName) ? cat.categoryName : "",
          itemsResponseDtoList: cleanedItems,
        };
      })
      // remove categories that have no valid name OR no valid items
      .filter(
        (cat) =>
          isValidText(cat.categoryName) && cat.itemsResponseDtoList.length > 0
      );

    // 2) Apply selectedCategory
    let finalCategories: Category[] = cleanedCategories;

    if (isValidText(selectedCategory)) {
      const chosen = cleanedCategories.find(
        (c) => c.categoryName === selectedCategory
      );
      finalCategories = chosen ? [chosen] : cleanedCategories;
    }

    // 3) Filter agents minimal safety (optional)
    const cleanedAgents: Agent[] = (data.agents || []).filter((a) =>
      isValidText(a?.name)
    );

    return {
      ...data,
      agents: cleanedAgents,
      items: finalCategories,
    };
  }, [data, selectedCategory]);

  if (!query || query.trim().length < MIN_SEARCH_LENGTH) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <Alert
          message="Query too short or missing. Minimum 3 characters required."
          type="warning"
          showIcon
          action={<Button onClick={handleBack}>Go Back</Button>}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 16px" }}>
        {/* Breadcrumb */}
        <Space style={{ marginBottom: 16 }}>
          <Home
            size={18}
            onClick={() => navigate("/main/dashboard/home")}
            style={{ color: "#5c3391", cursor: "pointer" }}
          />
          <ChevronRight size={16} color="#999" />
          <Text>Search: "{query}"</Text>
        </Space>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" tip="Loading results..." />
          </div>
        )}

        {error && !isLoading && (
          <Alert
            message={error}
            type="error"
            showIcon
            action={
              <Button onClick={() => fetchSearchData(query)}>Try Again</Button>
            }
          />
        )}

        {!isLoading && hasNoResults && (
          <Empty
            description="No results found. Try a different search term."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleBack}>
              New Search
            </Button>
          </Empty>
        )}

        {!isLoading && !hasNoResults && filteredData && (
          <>
            {/* Products Section */}
            {filteredData.items.length > 0 && (
              <>
                {/* Category Selection - REDUCED SIZE */}
                {/* Category Selection - MOBILE HORIZONTAL SCROLLABLE */}
                <div
                  style={{
                    marginBottom: 12,
                    overflowX: "auto", // 🔥 horizontal scroll only
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex", // ✅ keep items in one row
                      gap: 8,
                      paddingBottom: 4,
                      minWidth: "max-content", // ✅ prevents squishing
                    }}
                  >
                    {filteredData.items.map((category) => {
                      // ✅ if category name is invalid, don’t render at all
                      if (!isValidText(category.categoryName)) return null;

                      const isSelected =
                        selectedCategory === category.categoryName;

                      return (
                        <Card
                          key={category.categoryName}
                          hoverable
                          onClick={() =>
                            handleCategorySelect(category.categoryName)
                          }
                          style={{
                            textAlign: "center",
                            width: 85,
                            height: 100,
                            border: isSelected
                              ? "2px solid #5c3391"
                              : "1px solid #e8e8e8",
                            borderRadius: 10,
                            background: "#fff",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            boxShadow: isSelected
                              ? "0 3px 8px rgba(92, 51, 145, 0.2)"
                              : "0 2px 4px rgba(0,0,0,0.05)",
                            flexShrink: 0,
                          }}
                          bodyStyle={{
                            padding: "8px 6px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* ✅ Category Image ONLY if valid */}
                          {isValidImageUrl(category.categoryLogo) && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                marginBottom: 6,
                              }}
                            >
                              <Image
                                src={category.categoryLogo}
                                alt={category.categoryName}
                                height={48}
                                width={48}
                                preview={false}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  border: isSelected
                                    ? "2px solid #5c3391"
                                    : "1px solid #ddd",
                                  padding: 3,
                                  background: isSelected
                                    ? "#f5f0ff"
                                    : "#fafafa",
                                  transition: "all 0.3s ease",
                                }}
                                fallback=""
                              />
                            </div>
                          )}

                          {/* ✅ Category Name ONLY if valid */}
                          {isValidText(category.categoryName) && (
                            <Text
                              strong
                              style={{
                                fontSize: 11,
                                lineHeight: "14px",
                                color: isSelected ? "#5c3391" : "#333",
                                textAlign: "center",
                                marginTop: 2,
                                whiteSpace: "normal",
                              }}
                            >
                              {category.categoryName}
                            </Text>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
                {/* Products Grid */}
                {filteredData.items.map((category) => (
                  <div key={category.categoryName} style={{ marginBottom: 24 }}>
                    {/* Category Title */}
                    {isValidText(category.categoryName) && (
                      <Title
                        level={4}
                        style={{
                          marginBottom: 12,
                          marginTop: 12,
                          color: "#5c3391",
                          fontWeight: 700,
                          textAlign: "left",
                        }}
                      >
                        {category.categoryName}
                      </Title>
                    )}
                    {category.itemsResponseDtoList.length === 0 ? (
                      <Alert
                        message={`No items available in ${category.categoryName}`}
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    ) : (
                      <Row gutter={[16, 16]} justify="start">
                        {category.itemsResponseDtoList.map((product) => {
                          // ✅ HARD GUARD: if price/mrp invalid -> DON’T render
                          if (
                            !isValidNumber(product.itemPrice) ||
                            !isValidNumber(product.itemMrp)
                          ) {
                            return null;
                          }

                          const discount = calculateDiscount(
                            product.itemMrp,
                            product.itemPrice
                          );

                          // ✅ Weight show only if >0
                          const showWeight = isValidNumber(product.weight);

                          // ✅ BMV show only if >0
                          const showCoins = isValidNumber(product.bmvCoins);

                          return (
                            <Col
                              xs={24}
                              sm={12}
                              md={8}
                              lg={6}
                              key={product.itemId}
                            >
                              <Badge.Ribbon
                                text={`${discount}% Off`}
                                color="#8b3eea"
                                style={{
                                  display: discount > 0 ? "block" : "none",
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                <Card
                                  hoverable
                                  onClick={() => handleItemClick(product)}
                                  style={{
                                    height: 420, // ✅ fixed card height
                                    borderRadius: 12,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                  bodyStyle={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: 16,
                                    height: "100%",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(-4px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 8px 16px rgba(92, 51, 145, 0.15)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 8px rgba(0, 0, 0, 0.08)";
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: 180,
                                      borderRadius: 10,
                                      background: "#f9f9f9",
                                      overflow: "hidden",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginBottom: 12,
                                    }}
                                  >
                                    {isValidImageUrl(product.itemImage) ? (
                                      <Image
                                        src={product.itemImage}
                                        alt={product.itemName}
                                        height={180}
                                        width="100%"
                                        preview={false}
                                        style={{
                                          objectFit: "contain",
                                          borderRadius: 10,
                                        }}
                                        fallback=""
                                      />
                                    ) : (
                                      <div
                                        style={{ color: "#999", fontSize: 12 }}
                                      >
                                        No Image
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Info */}
                                  <div
                                    style={{
                                      flexGrow: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>
                                      {/* ✅ Item Name only if valid */}
                                      {isValidText(product.itemName) ? (
                                        <Title
                                          level={5}
                                          ellipsis={{ rows: 2 }}
                                          style={{
                                            marginBottom: 8,
                                            fontWeight: 600,
                                            color: "#1a1a1a",
                                            fontSize: 15,
                                            lineHeight: 1.4,
                                            minHeight: 42,
                                          }}
                                        >
                                          {product.itemName}
                                        </Title>
                                      ) : (
                                        <Title
                                          level={5}
                                          style={{ marginBottom: 8 }}
                                        >
                                          Item
                                        </Title>
                                      )}

                                      {/* ✅ Weight only if valid */}
                                      {showWeight && (
                                        <Text
                                          type="secondary"
                                          style={{
                                            fontSize: 13,
                                            display: "block",
                                            marginBottom: 10,
                                            color: "#666",
                                          }}
                                        >
                                          Weight: {product.weight} kg
                                        </Text>
                                      )}

                                      {/* ✅ BMV Coins only if valid */}
                                      {showCoins && (
                                        <Tag
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #fff4e6 0%, #ffe7ba 100%)",
                                            color: "#d46b08",
                                            border: "1px solid #ffd591",
                                            fontWeight: 600,
                                            fontSize: 11,
                                            padding: "2px 8px",
                                            marginBottom: 10,
                                            display: "inline-block",
                                          }}
                                        >
                                          Earn {product.bmvCoins} BMVCOINS
                                        </Tag>
                                      )}

                                      {/* ✅ Price Section ONLY if valid (already guarded) */}
                                      <div
                                        style={{
                                          marginBottom: 12,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                        }}
                                      >
                                        <Text
                                          strong
                                          style={{
                                            fontSize: 22,
                                            color: "#1a1a1a",
                                            fontWeight: 700,
                                          }}
                                        >
                                          ₹
                                          {Number(
                                            product.itemPrice
                                          ).toLocaleString()}
                                        </Text>
                                        <Text
                                          delete
                                          type="secondary"
                                          style={{
                                            fontSize: 14,
                                            color: "#999",
                                          }}
                                        >
                                          ₹
                                          {Number(
                                            product.itemMrp
                                          ).toLocaleString()}
                                        </Text>
                                      </div>
                                    </div>

                                    {/* Add / Quantity Buttons */}
                                    <div onClick={(e) => e.stopPropagation()}>
                                      {isItemUserAdded(product.itemId) ? (
                                        <Space.Compact
                                          style={{ width: "100%" }}
                                        >
                                          <Button
                                            icon={<MinusOutlined />}
                                            onClick={() =>
                                              handleQuantityChange(
                                                product,
                                                false
                                              )
                                            }
                                            loading={
                                              loadingItems.items[product.itemId]
                                            }
                                            style={{
                                              flex: 1,
                                              height: 44,
                                              backgroundColor: "#5c3391",
                                              borderColor: "#5c3391",
                                              color: "white",
                                              fontWeight: 600,
                                            }}
                                          />
                                          <Button
                                            style={{
                                              flex: 1,
                                              height: 44,
                                              backgroundColor: "white",
                                              color: "#5c3391",
                                              fontWeight: "bold",
                                              fontSize: 16,
                                              border: "1px solid #5c3391",
                                            }}
                                          >
                                            {cartItems[product.itemId] || 0}
                                          </Button>
                                          <Button
                                            icon={<PlusOutlined />}
                                            onClick={() =>
                                              handleQuantityChange(
                                                product,
                                                true
                                              )
                                            }
                                            disabled={
                                              (cartItems[product.itemId] ||
                                                0) >=
                                              Number(product.quantity || 0)
                                            }
                                            loading={
                                              loadingItems.items[product.itemId]
                                            }
                                            style={{
                                              flex: 1,
                                              height: 44,
                                              backgroundColor: "#5c3391",
                                              borderColor: "#5c3391",
                                              color: "white",
                                              fontWeight: 600,
                                            }}
                                          />
                                        </Space.Compact>
                                      ) : (
                                        <Button
                                          type="primary"
                                          block
                                          onClick={() =>
                                            handleAddToCart(product)
                                          }
                                          loading={
                                            loadingItems.items[product.itemId]
                                          }
                                          style={{
                                            height: 44,
                                            background:
                                              "linear-gradient(135deg, #5c3391 0%, #7b3fb8 100%)",
                                            border: "none",
                                            fontWeight: 700,
                                            fontSize: 15,
                                            borderRadius: 8,
                                            marginTop: "auto",
                                          }}
                                        >
                                          🛒 Add to Cart
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </Badge.Ribbon>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </div>
                ))}
              </>
            )}
            {filteredData.agents.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <Title
                  level={4}
                  style={{
                    marginBottom: 16,
                    color: "#5c3391",
                    fontWeight: 700,
                  }}
                >
                  AI Assistants
                </Title>

                <Row gutter={[16, 16]}>
                  {filteredData.agents.map((agent, index) => {
                    const initials = agent.name
                      ? agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "AI";

                    const bgColors = [
                      "#5c3391",
                      "#312c74",
                      "#8e44ad",
                      "#9b59b6",
                      "#6a1b9a",
                      "#4a148c",
                      "#7b1fa2",
                    ];
                    const color = bgColors[index % bgColors.length];

                    const agentImg = agent.imageUrl || agent.profileImagePath;
                    const showAgentImg = isValidImageUrl(agentImg);

                    return (
                      <Col xs={24} sm={12} md={8} lg={6} key={agent.agentId}>
                        <Badge.Ribbon
                          text={agent.status}
                          color={agent.activeStatus ? "green" : "red"}
                        >
                          <Card
                            hoverable
                            onClick={() => handleAgentClick(agent)}
                            style={{
                              height: 380,
                              borderRadius: 12,
                              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                              transition: "all 0.3s ease",
                            }}
                            bodyStyle={{
                              padding: 16,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* ✅ Image with 4-side rounded */}
                            <div
                              style={{
                                width: "100%",
                                height: 180,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 12, // ✅ rounded 4 sides
                                background: "#fafafa",
                                overflow: "hidden",
                                marginBottom: 12,
                              }}
                            >
                              {showAgentImg ? (
                                <Image
                                  src={agentImg}
                                  alt={agent.name}
                                  height={180}
                                  width="100%"
                                  preview={false}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: 12, // ✅ rounded 4 sides
                                  }}
                                  fallback=""
                                />
                              ) : (
                                <div
                                  style={{
                                    height: 90,
                                    width: 90,
                                    borderRadius: 14,
                                    backgroundColor: color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    color: "white",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {initials}
                                </div>
                              )}
                            </div>

                            {/* Agent Info */}
                            <div style={{ textAlign: "left" }}>
                              <Title
                                level={5}
                                ellipsis
                                style={{
                                  marginBottom: 6,
                                  color: "#333",
                                  fontWeight: 600,
                                }}
                              >
                                {agent.name}
                              </Title>

                              <Paragraph
                                type="secondary"
                                ellipsis={{ rows: 3 }}
                                style={{ fontSize: 13, color: "#555" }}
                              >
                                {agent.description ||
                                  "No description available"}
                              </Paragraph>

                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAgentClick(agent);
                                }}
                                style={{
                                  backgroundColor: "#008cba",
                                  color: "white",
                                  border: "none",
                                  width: "100%",
                                  marginTop: 10,
                                  borderRadius: 10,
                                  fontWeight: 600,
                                  height: 42,
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchMain;
