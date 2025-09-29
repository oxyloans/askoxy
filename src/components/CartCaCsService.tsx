import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Types
interface CartItem {
  id: string;
  agreementServiceName: string;
  agreementServiceId: string;
  description?: string;
  status: string;
  createdAt?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface AddressForm {
  address: string;
  city: string;
  state: string;
  pincode: string;
  additionalNotes: string;
}

const CartCaCsService: React.FC = () => {
  // State management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<Record<string, boolean>>({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Address form states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>({
    address: '',
    city: '',
    state: '',
    pincode: '',
    additionalNotes: ''
  });

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Get values from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");
    const customerId = localStorage.getItem("customerId") ||
      localStorage.getItem("userId") ||
      userId;

  // Navigation hook
  const navigate = useNavigate();

  // Fetch user profile details
  const getProfile = async (): Promise<UserProfile | null> => {
    if (!customerId || !token) {
      return null;
    }

    setProfileLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: `http://meta.oxyloans.com/api/user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile fetched:", response.data);
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Check if profile is complete - simplified to check only firstName
  const isProfileComplete = (profile: UserProfile | null): boolean => {
    if (!profile) return false;
    
    const firstName = profile.firstName;
    const hasFirstName = Boolean(firstName && firstName.trim().length > 0);
    
    console.log("Checking firstName:", firstName, "Valid:", hasFirstName);
    return hasFirstName;
  };

  // Fetch cart items and profile when component mounts
  useEffect(() => {
    if (userId && token) {
      fetchCartItems();
      getProfile();
    }
  }, [userId, token]);

  // Fetch cart items from API
  const fetchCartItems = async (isRefresh = false) => {
    if (!userId || !token) {
      alert("Please login to view your cart.");
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `https://meta.oxyloans.com/api/cart-service/cart/view?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Cart items fetched:", response.data);

      if (response.data && Array.isArray(response.data)) {
        // Filter out items with status "REMOVE"
        const activeCartItems = response.data.filter((item: CartItem) => 
          item.status !== "REMOVE" && item.status !== "remove"
        );
        setCartItems(activeCartItems);
        
        console.log("Active cart items after filtering:", activeCartItems);
      } else {
        setCartItems([]);
      }
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
      
      let errorMessage = "Failed to load cart items. Please try again.";
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          errorMessage = "Please login again to view your cart.";
        } else if (status === 404) {
          errorMessage = "Cart not found.";
          setCartItems([]); // Set empty cart for 404
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      if (error.response?.status !== 404) {
        alert(errorMessage);
      }
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const onRefresh = () => {
    fetchCartItems(true);
    getProfile();
  };

  // Remove item from cart
  const handleRemoveFromCart = async (cartItemId: string, itemName: string) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${itemName}" from your cart?`);
    
    if (!confirmed) return;

    try {
      setRemoveLoading(prev => ({ ...prev, [cartItemId]: true }));

      const response = await axios.delete(
        `https://meta.oxyloans.com/api/cart-service/cart/remove/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item removed from cart:", response.data);

      // Remove item from local state
      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== cartItemId)
      );

      alert("Item removed from cart successfully!");

    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      
      let errorMessage = "Failed to remove item from cart. Please try again.";
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          errorMessage = "Please login again to modify your cart.";
        } else if (status === 404) {
          errorMessage = "Item not found in cart.";
          // Remove from local state anyway since it's not found
          setCartItems(prevItems => 
            prevItems.filter(item => item.id !== cartItemId)
          );
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(errorMessage);
      
    } finally {
      setRemoveLoading(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  // Validate address form
  const validateAddressForm = (): boolean => {
    const { address, city, state, pincode, additionalNotes } = addressForm;
    
    if (!address.trim()) {
      alert("Please enter your address");
      return false;
    }
    
    if (!city.trim()) {
      alert("Please enter your city");
      return false;
    }
    
    if (!state.trim()) {
      alert("Please enter your state");
      return false;
    }
    
    if (!pincode.trim()) {
      alert("Please enter your pincode");
      return false;
    }
    
    if (!additionalNotes.trim()) {
      alert("Please enter additional notes");
      return false;
    }
    
    // Validate pincode format (should be 6 digits)
    if (!/^\d{6}$/.test(pincode.trim())) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }
    
    return true;
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to place an order.");
      return;
    }

    setProfileLoading(true);
    
    try {
      // Get profile data
      const profile = await getProfile();
      
      if (!profile) {
        const retry = window.confirm("Unable to fetch profile information. Please try again.");
        if (retry) {
          handleProceedToCheckout();
        }
        return;
      }

      // Check if firstName exists
      if (!isProfileComplete(profile)) {
        const goToProfile = window.confirm("Please add your first name to continue with the order. Go to profile?");
        if (goToProfile) {
          // Navigate to profile
          navigate("/profile", { state: { returnScreen: "CartCaCsService" } });
        }
        return;
      }

      // firstName exists, proceed to address modal
      setShowAddressModal(true);
      
    } catch (error) {
      console.error("Error in checkout process:", error);
      const retry = window.confirm("Something went wrong. Please try again.");
      if (retry) {
        handleProceedToCheckout();
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Place order function
  const handlePlaceOrder = async () => {
    if (!validateAddressForm()) {
      return;
    }

    setShowAddressModal(false);

    try {
      setOrderLoading(true);

      // Prepare full address string
      const fullAddress = `${addressForm.address}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`;

      // Prepare order data
      const orderData = {
        additionalNotes: addressForm.additionalNotes,
        address: fullAddress,
        paymentMode: "ONLINE",
        price: 50000,
        userId: userId
      };

      console.log("Placing order with data:", orderData);

      const response = await axios.post(
        "http://meta.oxyloans.com/api/order-service/CACSOrderPlace",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order placed successfully:", response.data);

      if (response.data && response.data.status === "SUBMITTED") {
        // Clear the cart and form after successful order
        setCartItems([]);
        setAddressForm({
          address: '',
          city: '',
          state: '',
          pincode: '',
          additionalNotes: ''
        });

        alert(`Order Placed Successfully!\nOrder ID: ${response.data.orderId}\nStatus: ${response.data.status}\n\n${response.data.message}`);
        
        navigate("/main/servicecalist");
      } else {
        throw new Error("Unexpected response format");
      }

    } catch (error: any) {
      console.error("Error placing order:", error);
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          errorMessage = "Please login again to place an order.";
        } else if (status === 400) {
          errorMessage = "Invalid order data. Please check your information.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(errorMessage);
      
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculate total items
  const getTotalItems = (): number => {
    return cartItems.length;
  };
    const handleGoBack = () => {
    navigate("/main/caserviceitems");
  };

  // Navigate back to services
  const handleContinueShopping = () => {
    navigate(-1);
  };

  // Header component
  const renderHeader = () => (
    <div className="pt-4 pb-3 px-5 shadow-md">
      <div className="flex justify-between items-center">

        {/* Left Section - Back + Title + Item Count */}
        <div className="flex items-start space-x-3">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Title + Items */}
      <div>
  <h1 className="text-2xl font-bold leading-tight bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">My Cart</h1>
  <p className="text-sm text-black-600">
    {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
  </p>
</div>
      </div>

        <button
          onClick={() => navigate("/main/servicecalist")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          {/* Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          {/* Label */}
          <span>My History</span>
        </button>
    </div>
  </div>
);
    
  // Profile status indicator
  const renderProfileStatus = () => {
    if (!userProfile) return null;

    const hasFirstName = isProfileComplete(userProfile);
    
    return (
      <div className={`rounded-xl p-3 mb-4 border ${hasFirstName ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${hasFirstName ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {hasFirstName ? (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-semibold flex-1 ${hasFirstName ? 'text-green-700' : 'text-yellow-700'}`}>
            {hasFirstName ? 'Profile Ready' : 'First Name Required'}
          </span>
          {!hasFirstName && (
            <button
              onClick={() => navigate("/profile", { state: { returnScreen: "CartCaCsService" } })}
              className="bg-yellow-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-yellow-700 transition-colors"
            >
              Add Name
            </button>
          )}
        </div>
      </div>
    );
  };

  // Address form modal
  const renderAddressModal = () => {
    if (!showAddressModal) return null;

    return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
    
    {/* Modal Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Enter Delivery Address</h2>
      <button
        onClick={() => setShowAddressModal(false)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Form Fields */}
    <div className="p-6 overflow-y-auto flex-1 space-y-5">
      
      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 resize-none"
          placeholder="House no, Street, Locality"
          value={addressForm.address}
          onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
          rows={2}
        />
      </div>

      {/* City & State in row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            placeholder="Enter city"
            value={addressForm.city}
            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            placeholder="Enter state"
            value={addressForm.state}
            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
          />
        </div>
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
        <input
          type="text"
          maxLength={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          placeholder="6-digit pincode"
          value={addressForm.pincode}
          onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 resize-none"
          placeholder="Landmark, instructions, etc."
          value={addressForm.additionalNotes}
          onChange={(e) => setAddressForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
          rows={2}
        />
      </div>
    </div>

    {/* Footer Actions */}
    <div className="flex gap-3 p-5 border-t border-gray-200">
      <button
        onClick={() => setShowAddressModal(false)}
        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handlePlaceOrder}
        disabled={orderLoading}
        className={`flex-[2] bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 ${
          orderLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {orderLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Placing...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  </div>
</div>
     
     
    );
  };

  // Empty cart component
  const renderEmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="mb-6">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m-5 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Your cart is empty</h3>
      <p className="text-base text-gray-500 text-center mb-8">
        Add some services to get started
      </p>
      <button
        onClick={handleContinueShopping}
        className="bg-purple-800 text-white py-4 px-8 rounded-xl font-bold hover:bg-purple-900 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Continue For Services</span>
      </button>
    </div>
  );

  // Cart item component
  const renderCartItem = (item: CartItem, index: number) => {
    const isRemoving = removeLoading[item.id];
    
    return (
      <div key={item.id || index} className="bg-white rounded-lg shadow-sm border border-gray-100 mb-3">
        <div className="flex items-center p-4">
          {/* Service Info */}
          <div className="flex-1 pr-3">
           <h5 className="text-base mb-2 leading-tight">
  <span className="text-black font-medium">ServiceId :</span>{" "}
  <span className="text-red-600 font-bold">
   ...... {item.agreementServiceId ? item.agreementServiceId.slice(-4) : "N/A"}
  </span>
</h5>

         <h4 className="text-base mb-2 leading-tight">
  <span className="text-black">ServiceName :</span>{" "}
  <span className="text-blue-600 font-bold">
    {item.agreementServiceName || 'Service Name'}
  </span>
</h4>
            {item.createdAt && (
              <p className="text-xs text-gray-400 italic">
                Added: {new Date(item.createdAt).toLocaleDateString()} 
                {/* {new Date(item.createdAt).toLocaleTimeString()} */}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={() => handleRemoveFromCart(item.id, item.agreementServiceName)}
              disabled={isRemoving}
              className={`p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors ${
                isRemoving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isRemoving ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent"></div>
              ) : (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-800 border-t-transparent mb-4"></div>
          <p className="text-base text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {renderHeader()}
      
     <div className="max-w-4xl mx-auto space-y-6">
  
  {cartItems.length === 0 ? (
    renderEmptyCart()
  ) : (
    <div className="space-y-6 p-4">
      {/* Profile Status */}
      {renderProfileStatus()}
<div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-gray-900">🛒 Cart Summary</h2>
    {/* Simple Refresh Button */}
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className="px-2 py-1 bg-violet-600 text-white text-xs rounded-md hover:bg-violet-700 transition disabled:opacity-50"
    >
      {refreshing ? "Refreshing..." : "Refresh"}
    </button>
  </div>
  <p className="text-gray-600 text-sm mt-1">
    You have{" "}
    <span className="font-semibold text-purple-700">{getTotalItems()}</span>{" "}
    {getTotalItems() === 1 ? "service" : "services"} in your cart.
  </p>
</div>

{/* Cart Items */}
<div className="space-y-3 mt-3">
  {cartItems.map((item, index) => renderCartItem(item, index))}
</div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={handleContinueShopping}
          className="flex-1 bg-slate-100 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors border border-slate-200"
        >
          + Add More Services
        </button>

        <button
          onClick={handleProceedToCheckout}
          disabled={profileLoading}
          className={`flex-1 bg-purple-700 text-white py-4 px-6 rounded-xl font-bold hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 ${
            profileLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {profileLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Checking Profile...</span>
            </>
          ) : (
            <>
              <span>Proceed to Checkout</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {renderAddressModal()}
    </div>
  );
};
export default CartCaCsService;