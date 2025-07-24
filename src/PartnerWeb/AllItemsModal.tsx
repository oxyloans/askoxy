import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  InputNumber,
  message,
  Badge,
  Tabs,
  Card,
  Image,
  Spin,
  Input,
  Empty,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import { fetchGroupedProducts, updateOrderItem } from "./partnerapi";

const { Search } = Input;

interface Item {
  itemId: string;
  itemName: string;
  itemMrp: number;
  itemPrice: number;
  units: string;
  itemImage: string;
  weight: number;
  saveAmount: number;
  savePercentage: number;
  itemDescription: string;
  quantity: number;
  barcodeValue?: string;
}

interface Category {
  categoryName: string;
  categoryLogo?: string;
  itemsResponseDtoList: Item[];
}

interface ProductGroup {
  categoryType: string;
  categories: Category[];
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  units: string;
  weight: number;
}

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // ✅ new prop
  orderId: string;
  id: string;
  modalMessage: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  orderId,
  id,
  modalMessage,
  onSuccess, 
}) => {
  const [productData, setProductData] = useState<ProductGroup[]>([]);
  const [filteredData, setFilteredData] = useState<ProductGroup[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemForChange, setSelectedItemForChange] = useState<
    string | null
  >(null);

  // Check if modal is in "adding" mode
  const isAddingMode = modalMessage.toLowerCase().includes("add");

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const data = await fetchGroupedProducts();
      setProductData(data);
      setFilteredData(data);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Error fetching product data:", error);
      message.error("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("this is orderId " + orderId);
    console.log("this is id" + id);

    if (visible) {
      fetchProductData();
      // Reset selected item when modal opens
      setSelectedItemForChange(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(productData);
      return;
    }

    const filtered = productData
      .map((group) => ({
        ...group,
        categories: group.categories
          .map((category) => ({
            ...category,
            itemsResponseDtoList: category.itemsResponseDtoList.filter((item) =>
              item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          }))
          .filter((category) => category.itemsResponseDtoList.length > 0),
      }))
      .filter((group) => group.categories.length > 0);

    setFilteredData(filtered);
  }, [searchTerm, productData]);

  const handleCancel = () => {
    onClose();
    setCartItems([]);
    setSearchTerm("");
    setSelectedItemForChange(null);
  };

  const addToCart = (item: Item, quantity: number = 1) => {
    if (quantity <= 0) {
      message.warning("Please enter a valid quantity");
      return;
    }

    // In changing mode, only allow one item to be selected
    if (!isAddingMode) {
      if (selectedItemForChange && selectedItemForChange !== item.itemId) {
        message.warning("You can only change one item at a time");
        return;
      }
      setSelectedItemForChange(item.itemId);
    }

    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.itemId === item.itemId
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      const newCartItem: CartItem = {
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        quantity: quantity,
        units: item.units,
        weight: item.weight,
      };
      setCartItems([...cartItems, newCartItem]);
    }

    message.success(`${item.itemName} added to cart!`);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.itemId !== itemId));

    // If removing the selected item in change mode, reset selection
    if (!isAddingMode && selectedItemForChange === itemId) {
      setSelectedItemForChange(null);
    }

    message.info("Item removed from cart");
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.itemId === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      message.warning("Please add items to cart before placing order");
      return;
    }

    setSubmitting(true);
    try {
      const updatePromises = cartItems.map((item) => {
        const requestData: any = {
          itemId: item.itemId,
          orderId: orderId,
          quantity: item.quantity,
        };

        // Only include id for changing mode
        if (!isAddingMode) {
          requestData.id = id;
        }

        return updateOrderItem(requestData);
      });

      await Promise.all(updatePromises);
      message.success("Items updated successfully!");
setCartItems([]);
setSelectedItemForChange(null);
onSuccess(); // ✅ call parent's callback to refresh and close modal
    } catch (error) {
      console.error("Error updating items:", error);
      message.error("Failed to update items. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    const cartItem = cartItems.find(
      (cartItem) => cartItem.itemId === item.itemId
    );

    // In changing mode, hide add button if another item is selected
    const shouldHideAddButton =
      !isAddingMode &&
      selectedItemForChange &&
      selectedItemForChange !== item.itemId &&
      !cartItem;

    return (
      <Card
        className="h-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        bodyStyle={{ padding: "12px" }}
        cover={
          <div className="h-24 overflow-hidden bg-gray-50">
            <Image
              alt={item.itemName}
              src={item.itemImage}
              className="w-full h-full object-contain"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJGpQOBJJN..."
              preview={false}
            />
          </div>
        }
      >
        <div className="space-y-2">
          <h4 className="font-medium text-xs line-clamp-2 min-h-[2rem] text-gray-800">
            {item.itemName}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-green-600">
                ₹{item.itemPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                ₹{item.itemMrp.toFixed(2)}
              </span>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
              {item.savePercentage}% OFF
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              weight: {item.weight} {item.units}
            </span>

            {cartItem ? (
              <div className="flex items-center gap-1">
                <Button
                  icon={<MinusOutlined />}
                  size="small"
                  type="text"
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() =>
                    updateCartQuantity(item.itemId, cartItem.quantity - 1)
                  }
                />
                <span className="font-medium text-xs min-w-[20px] text-center">
                  {cartItem.quantity}
                </span>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  type="text"
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() =>
                    updateCartQuantity(item.itemId, cartItem.quantity + 1)
                  }
                />
              </div>
            ) : (
              !shouldHideAddButton && (
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => addToCart(item, 1)}
                  disabled={item.quantity === 0}
                  className="text-xs px-2 h-6"
                >
                  Add
                </Button>
              )
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderCategories = (categories: Category[]) => {
    if (categories.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <Empty description="No items found" />
        </div>
      );
    }

    return categories.map((category, index) => (
      <div key={index} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {category.categoryLogo && (
            <img
              src={category.categoryLogo}
              alt={category.categoryName}
              className="w-6 h-6 object-contain"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {category.categoryName}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {category.itemsResponseDtoList.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      </div>
    ));
  };

  const tabItems = filteredData.map((group) => ({
    key: group.categoryType,
    label: (
      <span className="text-sm font-medium">
        {group.categoryType.replace("_", " ")}
      </span>
    ),
    children: (
      <div className="max-h-[500px] overflow-y-auto pr-2">
        {renderCategories(group.categories)}
      </div>
    ),
  }));

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.itemPrice * item.quantity,
    0
  );

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{modalMessage} Items</span>
          {cartItems.length > 0 && (
            <Badge count={totalItems} className="mr-10">
              <ShoppingCartOutlined className="text-xl text-blue-600" />
            </Badge>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width="95%"
      style={{ maxWidth: "1400px" }}
      footer={
        <div className="flex items-center justify-between">
          <div className="text-left">
            {cartItems.length > 0 && (
              <div className="text-sm text-gray-600">
                <div>Items: {totalItems}</div>
                <div className="font-semibold text-lg text-gray-800">
                  Total: ₹{totalAmount.toFixed(2)}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={submitOrder}
              loading={submitting}
              disabled={cartItems.length === 0}
              icon={<ShoppingCartOutlined />}
              size="large"
            >
              {isAddingMode ? "Add Items" : "Update Item"} ({cartItems.length})
            </Button>
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading products..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-3 border rounded-lg">
            <Search
              placeholder="Search items by name..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Mode Indicator */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Mode:{" "}
                {isAddingMode
                  ? "Adding Items (Multiple items allowed)"
                  : "Changing Item (Single item only)"}
              </span>
              {!isAddingMode && selectedItemForChange && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    setSelectedItemForChange(null);
                    setCartItems([]);
                  }}
                  className="text-blue-600"
                >
                  Reset Selection
                </Button>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 text-blue-800">
                Cart Summary:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm truncate mr-2 flex-1">
                      {item.itemName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {item.quantity} bag{item.quantity > 1 ? "s" : ""} ×{" "}
                        {item.weight} {item.units} ={" "}
                        <strong>
                          {item.weight * item.quantity} {item.units}
                        </strong>
                      </span>
                      <span className="font-medium text-sm min-w-[60px] text-right">
                        ₹{(item.itemPrice * item.quantity).toFixed(2)}
                      </span>

                      <Button
                        size="small"
                        danger
                        type="text"
                        onClick={() => removeFromCart(item.itemId)}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Tabs */}
          {filteredData.length > 0 ? (
            <Tabs
              items={tabItems}
              type="card"
              className="custom-tabs"
              size="small"
            />
          ) : searchTerm ? (
            <div className="text-center py-12">
              <Empty
                description={
                  <span className="text-gray-500">
                    No products found for "{searchTerm}"
                  </span>
                }
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products available
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
