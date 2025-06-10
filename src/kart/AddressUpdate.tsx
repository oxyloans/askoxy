import React from 'react';
import { X, CheckCircle } from 'lucide-react';

// Define interfaces within the same file
interface OrderAddress {
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
}

interface OrderHistory {
  placedDate: string;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
  pickUpDate: string | null;
  exchangeRequestDate?: string | null;
}

interface Item {
  itemId: string;
  itemName: string;
  itemUrl: string | null;
  weight: string | number;
  price: number;
  itemMrpPrice: number;
  quantity: number;
  itemUnit: string | null;
  singleItemPrice: number;
  isExchanged?: boolean;
}

interface FeedbackData {
  feedbackStatus: string;
  comments: string;
}

interface OrderDetailsResponse {
  orderId: string;
  orderStatus: string;
  newOrderId: string | null;
  customerMobile: string;
  customerId: string;
  subTotal: number | null;
  grandTotal: number;
  walletAmount: number;
  discountAmount: number;
  gstAmount: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress | null;
  orderItems: Item[];
  feedback?: FeedbackData;
  timeSlot?: string;
  dayOfWeek?: string;
  expectedDeliveryDate?: string;
  isFromExchangeTab?: boolean;
}

interface AddressUpdateModalProps {
  isOpen: boolean;
  selectedOrder: OrderDetailsResponse | null;
  addressFormData: {
    flatNo: string;
    landMark: string;
    address: string;
    pincode: string;
    latitude: number;
    longitude: number;
    area: string;
    houseType: string;
    residenceName: string;
  };
  addressFormErrors: {
    flatNo: string;
    landMark: string;
    address: string;
    pincode: string;
  };
  addressUpdateSuccess: boolean;
  isAddressUpdating: boolean;
  setAddressFormData: React.Dispatch<React.SetStateAction<{
    flatNo: string;
    landMark: string;
    address: string;
    pincode: string;
    latitude: number;
    longitude: number;
    area: string;
    houseType: string;
    residenceName: string;
  }>>;
  setIsAddressUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetAddressForm: () => void;
  handleUpdateAddress: () => void;
}

const AddressUpdateModal: React.FC<AddressUpdateModalProps> = ({
  isOpen,
  selectedOrder,
  addressFormData,
  addressFormErrors,
  addressUpdateSuccess,
  isAddressUpdating,
  setAddressFormData,
  setIsAddressUpdateModalOpen,
  resetAddressForm,
  handleUpdateAddress,
}) => {
  if (!isOpen || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[95vh] overflow-y-auto scrollbar-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Update Address</h2>
          <button
            onClick={() => setIsAddressUpdateModalOpen(false)}
            className="p-1 hover:bg-purple-700 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {addressUpdateSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Address Updated Successfully
              </h3>
              <p className="text-gray-600 mb-6">
                The address for your order has been updated.
              </p>
              <button
                onClick={() => setIsAddressUpdateModalOpen(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat/House Number
                  </label>
                  <input
                    type="text"
                    value={addressFormData.flatNo}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, flatNo: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter flat/house number"
                  />
                  {addressFormErrors.flatNo && (
                    <p className="mt-1 text-sm text-red-600">{addressFormErrors.flatNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addressFormData.landMark}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, landMark: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter landmark"
                  />
                  {addressFormErrors.landMark && (
                    <p className="mt-1 text-sm text-red-600">{addressFormErrors.landMark}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complete Address
                </label>
                <textarea
                  value={addressFormData.address}
                  onChange={(e) =>
                    setAddressFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none"
                  placeholder="Enter complete address"
                />
                {addressFormErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{addressFormErrors.address}</p>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={addressFormData.pincode}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter 6-digit PIN code"
                    maxLength={6}
                  />
                  {addressFormErrors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{addressFormErrors.pincode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    value={addressFormData.area}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, area: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter area"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Type
                  </label>
                  <input
                    type="text"
                    value={addressFormData.houseType}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, houseType: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter house type (e.g., Apartment, Villa)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Residence Name
                  </label>
                  <input
                    type="text"
                    value={addressFormData.residenceName}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        residenceName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                    placeholder="Enter residence name"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressUpdateModalOpen(false);
                    resetAddressForm();
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateAddress}
                  disabled={isAddressUpdating}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddressUpdating ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Address'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressUpdateModal;