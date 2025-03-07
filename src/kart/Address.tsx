import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import { FaBars, FaTimes, FaHome, FaBriefcase, FaMapMarkerAlt, FaTrash, FaPen } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { isWithinRadius } from "./LocationCheck";
import { message } from "antd";
import BASE_URL from "../Config";


interface Address {
  id?: string;
  flatNo: string;
  landmark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

const ManageAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<Address>({
    flatNo: '',
    landmark: '',
    address: '',
    pincode: '',
    addressType: 'Home',
  });
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    flatNo: '',
    landmark: '',
    address: '',
    pincode: '',
  });

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchAddresses();
    const count = parseInt(localStorage.getItem("cartCount") || "0");
    setCartCount(count);
    checkLocation();
  }, []);

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location accessed successfully");
      },
      (error) => {
        message.error("Please enable location services to add addresses");
      }
    );
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching addresses:", error);
      message.error("Failed to load addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const validateForm = () => {
    const newFormErrors = {
      flatNo: '',
      landmark: '',
      address: '',
      pincode: '',
    };

    if (!formData.flatNo.trim()) newFormErrors.flatNo = 'Flat/House number is required';
    if (!formData.landmark.trim()) newFormErrors.landmark = 'Landmark is required';
    if (!formData.address.trim()) newFormErrors.address = 'Address is required';
    if (!formData.pincode.trim()) newFormErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newFormErrors.pincode = 'Please enter a valid 6-digit PIN code';

    setFormErrors(newFormErrors);
    return !Object.values(newFormErrors).some(error => error);
  };

  const handleAddAddress = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      const fullAddress = `${formData.flatNo}, ${formData.landmark}, ${formData.address}, ${formData.pincode}`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        message.error("Unable to find location coordinates. Please check the address.");
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      if (!withinRadius) {
        message.error("Sorry, we do not deliver to this location");
        return;
      }

      const data = {
        userId: customerId,
        flatNo: formData.flatNo,
        landMark: formData.landmark,
        address: formData.address,
        pincode: formData.pincode,
        addressType: formData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingId) {
        await axios.put(`${BASE_URL}/user-service/updateAddress/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address added successfully!", 5);
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      message.error("Failed to save address. Please try again."); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData(address);
    setEditingId(address.id || null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/user-service/deleteAddress/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Address deleted successfully!");
      await fetchAddresses();
    } catch (error) {
      message.error("Failed to delete address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      flatNo: '',
      landmark: '',
      address: '',
      pincode: '',
      addressType: 'Home',
    });
    setFormErrors({
      flatNo: '',
      landmark: '',
      address: '',
      pincode: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return <FaHome className="text-purple-600" />;
      case 'Work':
        return <FaBriefcase className="text-purple-600" />;
      default:
        return <FaMapMarkerAlt className="text-purple-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`lg:w-64 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            {/* <Sidebar /> */}
          </div>

          <main className="flex-1">
            <div className="flex-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Manage Address</h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    <FaMapMarkerAlt />
                    Add New Address
                  </button>
                )}
              </div>

              {/* {(error || successMessage) && (
                <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {error || successMessage}
                </div>
              )} */}

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
                </div>
              )}

              {!isLoading && !showForm && addresses.length === 0 && (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                  <p className="text-gray-500">Add your first address to get started!</p>
                </div>
              )}

              {!showForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          {getAddressTypeIcon(address.addressType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {address.addressType}
                            </span>
                          </div>
                          <h3 className="mt-2 font-medium text-gray-900">{address.flatNo}</h3>
                          <p className="mt-1 text-sm text-gray-500">{address.landmark}</p>
                          <p className="mt-1 text-sm text-gray-500">{address.address}</p>
                          <p className="mt-1 text-sm text-gray-500">PIN: {address.pincode}</p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                            aria-label="Edit address"
                          >
                            <FaPen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => address.id && handleDeleteAddress(address.id)}
                            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                            aria-label="Delete address"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w- mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flat/House Number
                        </label>
                        <input
                          type="text"
                          value={formData.flatNo}
                          onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                          placeholder="Enter flat/house number"
                        />
                        {formErrors.flatNo && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.flatNo}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          value={formData.landmark}
                          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                          placeholder="Enter landmark"
                        />
                        {formErrors.landmark && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.landmark}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complete Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none"
                        placeholder="Enter complete address"
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                          placeholder="Enter 6-digit PIN code"
                          maxLength={6}
                        />
                        {formErrors.pincode && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Type
                        </label>
                        <div className="relative">
                          <select
                            value={formData.addressType}
                            onChange={(e) => setFormData({ ...formData, addressType: e.target.value as 'Home' | 'Work' | 'Others' })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white transition-shadow"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Others">Others</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            {editingId ? 'Updating...' : 'Adding...'}
                          </>
                        ) : (
                          editingId ? 'Update Address' : 'Add Address'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageAddressesPage;