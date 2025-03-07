import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import { isWithinRadius } from "./LocationCheck";
import { Button, message, Modal, } from "antd";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { LoadingOutlined } from "@ant-design/icons";
import  BASE_URL  from "../Config";

interface Address {
  id?: string;
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  priceMrp: number | string;
  image: string;
  itemDescription: string;
  units: string;
  weight: string;
  cartQuantity: number;
  cartId: string;
  quantity: number;
}

interface AddressFormData {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [checkoutError, setCheckoutError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });

  const [addressFormErrors, setAddressFormErrors] = useState({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
  });

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { setCount } = context;

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data);
      setSelectedAddress(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        setCartItems(cartItemsMap);
        const totalQuantity = Object.values(
          cartItemsMap as Record<string, number>
        ).reduce((sum, qty) => sum + qty, 0);
        setCount(totalQuantity);
      } else {
        setCartItems({});
        setCount(0);
      }

      // IMPORTANT CHANGE: Don't filter out items with quantity = 0
      // const updatedCart = response.data?.customerCartResponseList.filter(
      //   (item: CartItem) => item.quantity > 0
      // );

      // Use all items including out-of-stock ones
      const updatedCart = response.data?.customerCartResponseList || [];

      // Check for stock issues in all items
      const outOfStockItems = updatedCart.filter(
        (item: CartItem) => item.cartQuantity > item.quantity
      );

      if (outOfStockItems.length > 0) {
        setCheckoutError(true);
        alert(
          `Please decrease the quantity for: ${outOfStockItems
            .map((item: CartItem) => item.itemName)
            .join(", ")} before proceeding to checkout.`
        );
      }

      // Set cart data with ALL items including out-of-stock ones
      setCartData(response.data?.customerCartResponseList || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      return null;
    }
  };

  const validateAddressForm = () => {
    const errors = {
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo.trim())
      errors.flatNo = "Flat/House number is required";
    if (!addressFormData.landMark.trim())
      errors.landmark = "Landmark is required";
    if (!addressFormData.address.trim()) errors.address = "Address is required";
    if (!addressFormData.pincode.trim())
      errors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(addressFormData.pincode))
      errors.pincode = "Please enter a valid 6-digit PIN code";

    setAddressFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleAddressSubmit = async (): Promise<void> => {
    if (!validateAddressForm()) return;

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const fullAddress = `${addressFormData.flatNo}, ${addressFormData.landMark}, ${addressFormData.address}, ${addressFormData.pincode}`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        message.error(
          "Unable to find location coordinates. Please check the address."
        );
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      console.log({ withinRadius });

      if (!withinRadius.isWithin) {
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
        Modal.error({
          title: "Delivery Unavailable",
          content: (
            <>
              <p>
                Sorry! We're unable to deliver to this address as it is{" "}
                {withinRadius.distanceInKm} km away, beyond our 20 km delivery
                radius. Please select another saved address within the radius or
                add a new one to proceed. We appreciate your understanding!
              </p>
              {/* Wrapping buttons inside a flex container */}
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="default" onClick={() => Modal.destroyAll()}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.destroyAll();
                    setIsAddressModalOpen(true);
                  }}
                >
                  Add New Address
                </Button>
              </div>
            </>
          ),
          footer: null, // Removes default "Ok" button
        });
        return;
      }

      const data = {
        userId: customerId,
        flatNo: addressFormData.flatNo,
        landMark: addressFormData.landMark,
        address: addressFormData.address,
        pincode: addressFormData.pincode,
        addressType: addressFormData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingAddressId) {
        await axios.put(
          `${BASE_URL}/user-service/updateAddress/${editingAddressId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Address updated successfully.", 5);
      } else {
        await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address added successfully.", 5);
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
      }

      setError("");
      await fetchAddresses();
      setTimeout(resetAddressForm, 3000);
    } catch (err) {
      setSuccessMessage("");
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
      setIsAddressModalOpen(false);
      setSuccessMessage("");
      setError("");
    }
  };

  const handleIncrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const currentQuantity = cartItems[item.itemId] || 0;

      // Check if increasing would exceed available stock
      if (currentQuantity >= item.quantity) {
        message.warning(`Only ${item.quantity} units available in stock`);
        setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
        return;
      }

      const newQuantity = currentQuantity + 1;

      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const currentQuantity = cartItems[item.itemId];
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemId: item.itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update local state immediately
        setCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));

        // Update cart data
        await fetchCartData();
      } else {
        // If quantity is 1, remove the item
        await removeCartItem(item);
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const removeCartItem = async (item: CartItem) => {
    try {
      await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
        data: {
          id: item.cartId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove item from local state immediately
      setCartData((prev) =>
        prev.filter((cartItem) => cartItem.cartId !== item.cartId)
      );
      setCartItems((prev) => {
        const updated = { ...prev };
        delete updated[item.itemId];
        return updated;
      });

      // Update total count in cart context
      const updatedCount = Object.entries(cartItems)
        .filter(([key]) => key !== String(item.itemId)) // Ensure key comparison works correctly
        .reduce((sum, [, qty]) => sum + qty, 0);

      // Check if cart is now empty
      if (Object.keys(cartItems).length === 1) {
        // Since we're checking before the state update
        window.location.reload();
      }

      message.success("Item removed from cart successfully.", 5);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      message.error("Failed to remove item");
    }
  };

  const resetAddressForm = () => {
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
    setAddressFormErrors({
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleToProcess = async () => {
    // First check if there are out of stock items
    if (isCheckoutDisabled()) {
      Modal.error({
        title: "Stock Issues",
        content:
          "Unable to proceed with checkout. Please remove out-of-stock items or adjust quantities to match available stock.",
      });
      return;
    }

    if (!cartData || cartData.length === 0) {
      message.error("Your cart is empty, Please Add At least one Item");
      return;
    }

    if (!selectedAddress) {
      message.error("Please select an address");
      return;
    }

    const isAddressValid = await handleAddressChange(selectedAddress);
    if (isAddressValid?.isWithin) {
      navigate("/main/checkout", { state: { selectedAddress } });
    }
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setSuccessMessage("");
    setError("");
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
  };

  useEffect(() => {
    fetchCartData();
    fetchAddresses();
  }, []);

  // Add a separate useEffect to check stock status whenever cartData changes
  useEffect(() => {
    // Check for stock issues
    const hasStockIssues = cartData.some(
      (item) => item.quantity === 0 || item.cartQuantity > item.quantity
    );
    setCheckoutError(hasStockIssues);
  }, [cartData]);

  const handleAddressChange = async (selectedAddress: Address) => {
    const fullAddress = `${selectedAddress?.flatNo}, ${selectedAddress?.landMark}, ${selectedAddress?.address}, ${selectedAddress?.pincode}`;
    const coordinates = await getCoordinates(fullAddress);

    if (!coordinates) {
      message.error(
        "Unable to find location coordinates. Please check the address."
      );
      return;
    }

    const withinRadius = await isWithinRadius(coordinates);
    console.log({ withinRadius });

    if (!withinRadius.isWithin) {
      Modal.error({
        title: "Delivery Unavailable",
        content: (
          <>
            <p>
              Sorry! We're unable to deliver to this address as it is{" "}
              {withinRadius.distanceInKm} km away, beyond our 20 km delivery
              radius. Please select another saved address within the radius or
              add a new one to proceed. We appreciate your understanding!
            </p>
            {/* Wrapping buttons inside a flex container */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="default" onClick={() => Modal.destroyAll()}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  Modal.destroyAll();
                  setIsAddressModalOpen(true);
                }}
              >
                Add New Address
              </Button>
            </div>
          </>
        ),
        footer: null, // Removes default "Ok" button
      });

      const updatedWithinRadius = {
        ...withinRadius,
        isWithin: false,
      };

      return updatedWithinRadius;
    }
    setSelectedAddress(selectedAddress);
    return withinRadius;
  };

  const handleCartData = async () => {};

  const isCheckoutDisabled = (): boolean => {
    // Check if cart is empty
    if (!cartData || cartData.length === 0) {
      return true;
    }

    // Check if any item is completely out of stock (quantity = 0)
    const hasOutOfStockItems = cartData.some((item) => item.quantity === 0);
    if (hasOutOfStockItems) {
      return true;
    }

    // Check if any item quantity exceeds available stock
    const hasExceededStockItems = cartData.some(
      (item) => item.cartQuantity > item.quantity
    );
    if (hasExceededStockItems) {
      return true;
    }

    return false;
  };

  const removeOutOfStockItems = async () => {
    try {
      const updatedCart = cartData.filter((item) => item.quantity > 0);
      setCartData(updatedCart);

      // Update the cart items state
      const updatedCartItems = updatedCart.reduce((acc, item) => {
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {} as { [key: string]: number });

      setCartItems(updatedCartItems);

      // Update the total quantity in the cart context
      const totalQuantity = Object.values(updatedCartItems).reduce(
        (sum, qty) => sum + qty,
        0
      );
      setCount(totalQuantity);

      // Remove out-of-stock items from the backend
      const outOfStockItems = cartData.filter((item) => item.quantity === 0);
      for (const item of outOfStockItems) {
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: {
            id: item.cartId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      message.success("Out-of-stock items removed successfully.");
    } catch (error) {
      console.error("Failed to remove out-of-stock items:", error);
      message.error("Failed to remove out-of-stock items");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : !cartData || cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                  <button
                    onClick={() => navigate("/main/dashboard/products")}
                    className=" bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                  >
                    Browse items
                  </button>
                </div>
              ) : (
                cartData.map((item) => (
                  <div
                    key={item.itemId}
                    className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-20 h-20 bg-gray-200 cursor-pointer"
                        onClick={() =>
                          navigate(`/main/itemsdisplay/${item.itemId}`, {
                            state: { item },
                          })
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        {/* Display available stock quantity */}
                        {item.quantity < 6 && (
                          <p className="text-xs text-red-500">
                            Only {item.quantity} item left
                          </p>
                        )}
                        <h3 className="font-bold text-gray-800 truncate flex-1">
                          {item.itemName}
                        </h3>
                        <p className="text-sm text-center md:text-left">
                          Weight: {item.weight} {item.units}
                        </p>
                        <p className="text-sm line-through text-red-500 text-center md:text-left">
                          MRP: ₹{item.priceMrp}
                        </p>
                        <p className="text-green-600 font-bold md:text-left">
                          ₹{item.itemPrice}
                        </p>
                      </div>
                    </div>

                    {item.quantity !== 0 ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center justify-between space-x-4 w-full">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1"
                              onClick={() => handleDecrease(item)}
                              disabled={loadingItems[item.itemId]}
                            >
                              -
                            </button>
                            {loadingItems[item.itemId] ?
                            <LoadingOutlined
                                  style={{ fontSize: 16, color: "#722ED1" }}
                                  spin
                                />
                  :
                            <span className="px-3 py-1">
                              {cartItems[item.itemId]}
                            </span>
}
                            <button
                              className={`px-3 py-1 ${
                                cartItems[item.itemId] >= item.quantity
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (cartItems[item.itemId] < item.quantity) {
                                  handleIncrease(item);
                                }
                              }}
                              disabled={
                                cartItems[item.itemId] >= item.quantity ||
                                loadingItems[item.itemId]
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            onClick={async () => {
                              await removeCartItem(item);
                            }}
                            aria-label="Delete item from cart"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="w-full flex justify-center mt-4">
                          <p className="text-purple-600 font-bold whitespace-nowrap text-m">
                            Total : ₹
                            {(
                              parseFloat(item.itemPrice) *
                              (cartItems[item.itemId] || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <p className="text-red-600 font-bold whitespace-nowrap text-m">
                          Out of Stock
                        </p>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                          onClick={async () => {
                            await removeCartItem(item);
                          }}
                          aria-label="Delete item from cart"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </main>

          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border broder-black-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Delivery Address</h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <span>+</span> Add
                </button>
              </div>
              {selectedAddress === null ? (
                <p>No addresses found.</p>
              ) : (
                <span className="flex justify-between mb-2 text-gray-700">
                  {selectedAddress.flatNo}, {selectedAddress.address},{" "}
                  {selectedAddress.landMark}, {selectedAddress.pincode}
                </span>
              )}
              <div className="mb-4">
                <label className="block font-bold text-gray-700  mb-1">
                  Select Address
                </label>
                <select
                  value={selectedAddress?.address || ""}
                  onChange={(e) => {
                    const selected = addresses.find(
                      (addr) => addr.address === e.target.value
                    );

                    if (selected) {
                      handleAddressChange(selected);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose an Address</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address.address}>
                      {address.flatNo}, {address.address}, {address.landMark},{" "}
                      {address.pincode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹
                      {cartData
                        ?.reduce(
                          (acc, item) =>
                            acc +
                            parseFloat(item.itemPrice) * item.cartQuantity,
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-800 font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹
                      {cartData
                        ?.reduce(
                          (acc, item) =>
                            acc +
                            parseFloat(item.itemPrice) * item.cartQuantity,
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {/* Display out of stock messages */}
                  {cartData?.some((item) => item.quantity === 0) && (
                    <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">
                      <p className="font-semibold">
                        Some items in your cart are out of stock:
                      </p>
                      <ul className="ml-4 mt-1 list-disc">
                        {cartData
                          .filter((item) => item.quantity === 0)
                          .map((item) => (
                            <li key={item.itemId}>
                              {item.itemName} is out of stock
                            </li>
                          ))}
                      </ul>
                      <p className="mt-2 text-sm">
                        Please remove these items to proceed with checkout.
                      </p>
                    </div>
                  )}

                  {/* Display warning for items where cart quantity exceeds stock */}
                  {cartData?.some(
                    (item) =>
                      item.cartQuantity > item.quantity && item.quantity > 0
                  ) && (
                    <div className="mb-3 p-3 bg-yellow-100 text-yellow-700 rounded">
                      <p className="font-semibold">
                        Quantity adjustments needed:
                      </p>
                      <ul className="ml-4 mt-1 list-disc">
                        {cartData
                          .filter(
                            (item) =>
                              item.cartQuantity > item.quantity &&
                              item.quantity > 0
                          )
                          .map((item) => (
                            <li key={item.itemId}>
                              {item.itemName} - Only {item.quantity} in stock
                              (you have {item.cartQuantity})
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className={`w-full py-3 px-6 rounded-lg transition ${
                      isCheckoutDisabled()
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gradient-to-r from-purple-700 to-purple-500 hover:bg-purple-800 text-white"
                    }`}
                    onClick={() => handleToProcess()}
                    disabled={isCheckoutDisabled()}
                  >
                    {isCheckoutDisabled()
                      ? "Cannot Checkout - Stock Issues"
                      : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Modal */}
          {isAddressModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h2>
                  <button
                    onClick={handleAddressModalClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Flat/House No"
                    value={addressFormData.flatNo}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        flatNo: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.flatNo && (
                    <p className="text-red-500 text-sm">
                      {addressFormErrors.flatNo}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="Landmark"
                    value={addressFormData.landMark}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        landMark: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.landmark && (
                    <p className="text-red-500 text-sm">
                      {addressFormErrors.landmark}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="Address"
                    value={addressFormData.address}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.address && (
                    <p className="text-red-500 text-sm">
                      {addressFormErrors.address}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={addressFormData.pincode}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        pincode: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.pincode && (
                    <p className="text-red-500 text-sm">
                      {addressFormErrors.pincode}
                    </p>
                  )}

                  <select
                    value={addressFormData.addressType}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        addressType: e.target.value as
                          | "Home"
                          | "Work"
                          | "Others",
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={handleAddressModalClose}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                  >
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
