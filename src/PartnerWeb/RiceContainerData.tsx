import React, { useEffect, useState } from "react";
import { partnerApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";

interface RiceContainerOrder {
  order: {
    id: string;
    orderStatus: string | null;
    grandTotal: number;
    orderDate: number;
  };
  items: {
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
  }[];
  address?: {
    address?: string | null;
    flatNo?: string | null;
    landMark?: string | null;
    pinCode?: number | string | null;
  };
  user?: {
    mobileNumber?: string | null;
    email?: string | null;
  };
}

const RICE_CONTAINER_DETAILS_URL = `${BASE_URL}/order-service/details`;
const PAGE_SIZE = 10;

const RiceContainerData: React.FC = () => {
  const [orders, setOrders] = useState<RiceContainerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await partnerApi.get<
        RiceContainerOrder | RiceContainerOrder[]
      >(RICE_CONTAINER_DETAILS_URL);
      const responseOrders = Array.isArray(response.data)
        ? response.data
        : [response.data];
      responseOrders.sort(
        (a, b) => (b.order.orderDate || 0) - (a.order.orderDate || 0)
      );
      setOrders(responseOrders);
      setCurrentPage(1);
    } catch (fetchError) {
      console.error("Error fetching rice container orders:", fetchError);
      setError("Unable to load rice container data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-purple-800">
                Rice Container Orders
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Orders returned by the order details service
              </p>
            </div>
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">
              Loading rice container orders...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No rice container orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Container
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map((orderDetails) =>
                    orderDetails.items.map((item, itemIndex) => (
                      <tr
                        key={`${orderDetails.order.id}-${item.itemId || itemIndex}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{orderDetails.order.id.slice(-8)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(
                            orderDetails.order.orderDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          <div className="text-xs text-gray-500">
                            {new Date(
                              orderDetails.order.orderDate
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.itemName}
                          <div className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(item.price || 0)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {orderDetails.user?.mobileNumber || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {orderDetails.user?.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 min-w-[240px] text-sm text-gray-700">
                          {[
                            orderDetails.address?.flatNo,
                            orderDetails.address?.address,
                            orderDetails.address?.landMark,
                            orderDetails.address?.pinCode,
                          ]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, orders.length)} of{" "}
                  {orders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiceContainerData;
