import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Package,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Loader,
  TrendingUp,
  BarChart3,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import BASE_URL from "../Config";
// Type definitions
interface ListItem {
  itemId: string;
  itemName: string;
  qty: number;
  weight?: number;
  itemAddedDate?: string;
  offerPrice?: number;
  imageUrl?: string;
}
interface Market {
  marketId: string;
  marketName: string;
  leadName?: string;
  address?: string;
  openDate?: string;
  latitude?: number;
  longitude?: number;
  listItems?: ListItem[];
}
interface MarketResponse {
  content: Market[];
  totalPages: number;
  totalElements: number;
  number: number;
}
interface OfflineItem {
  offlineUserItemsId: string;
  itemName: string;
  qty: number;
  weight?: number;
  itemAddAt?: string;
  status?: string;
  price: number;
}
interface OfflinePayment {
  orderPaymentId: string;
  paymentStatus: string;
  paidDate?: string;
  paidAmount: number;
  totalGst: number;
  totalQty: number;
  paymentType?: string;
  paymentId?: string;
  offlineItems?: OfflineItem[];
}

interface UserInfo {
  userOfflineOrdersId: string;
  userName: string;
  mobileNumber?: string;
  address?: string;
  offlinePayments?: OfflinePayment[];
}

interface MarketUsersResponse {
  marketName: string;
  listMarketUserInfo: UserInfo[];
}

const MarketReport = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [marketUsers, setMarketUsers] = useState<MarketUsersResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedMarkets, setExpandedMarkets] = useState<
    Record<string, boolean>
  >({});
  const [showAllItems, setShowAllItems] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async (page: number = 0, size: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/getAllMarket?page=${page}&size=${size}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MarketResponse = await response.json();

      setMarkets(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.number || 0);
    } catch (error) {
      console.error("Error fetching markets:", error);
      setError("Failed to fetch markets. Please try again.");
      setMarkets([]);
    }
    setLoading(false);
  };

  const fetchMarketUsers = async (marketId: string) => {
    setUserLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/getMarketUsers?marketId=${marketId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MarketUsersResponse = await response.json();

      setMarketUsers(data);
      setSelectedMarket(marketId);
    } catch (error) {
      console.error("Error fetching market users:", error);
      setError("Failed to fetch market users. Please try again.");
      setMarketUsers(null);
    }
    setUserLoading(false);
  };

  const toggleMarketExpansion = (marketId: string) => {
    setExpandedMarkets((prev) => ({
      ...prev,
      [marketId]: !prev[marketId],
    }));
  };

  const toggleShowAllItems = (marketId: string) => {
    setShowAllItems((prev) => ({
      ...prev,
      [marketId]: !prev[marketId],
    }));
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const filteredMarkets = markets.filter(
    (market) =>
      market.marketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      market.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      market.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
  );

  const calculateMarketStats = (market: Market) => {
    if (!market.listItems || market.listItems.length === 0) {
      return { totalItems: 0, uniqueItems: 0, totalValue: 0 };
    }
    const totalItems = market.listItems.reduce(
      (sum: number, item: ListItem) => sum + (item.qty || 0),
      0
    );
    const uniqueItems = market.listItems.length;
    const totalValue = market.listItems.reduce(
      (sum: number, item: ListItem) =>
        sum + (item.offerPrice || 0) * (item.qty || 0),
      0
    );
    return { totalItems, uniqueItems, totalValue };
  };

  const calculateUserOrderStats = (userInfo: UserInfo) => {
    if (!userInfo.offlinePayments || userInfo.offlinePayments.length === 0) {
      return { totalOrders: 0, totalAmount: 0, totalItems: 0 };
    }

    const totalOrders = userInfo.offlinePayments.length;
    const totalAmount = userInfo.offlinePayments.reduce(
      (sum: number, payment: OfflinePayment) => sum + (payment.paidAmount || 0),
      0
    );
    const totalItems = userInfo.offlinePayments.reduce(
      (sum: number, payment: OfflinePayment) =>
        sum +
        (payment.offlineItems?.reduce(
          (itemSum: number, item: OfflineItem) => itemSum + (item.qty || 0),
          0
        ) || 0),
      0
    );

    return { totalOrders, totalAmount, totalItems };
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchMarkets(newPage);
    }
  };

  const getHighlightClass = (totalItems: number, totalValue: number) => {
    if (totalItems > 100 && totalValue > 50000) {
      return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200";
    }
    if (totalItems > 50 && totalValue > 20000) {
      return "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200";
    }
    return "bg-white border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Market Report Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Market analysis and insights • {totalElements} markets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => fetchMarkets(currentPage)}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Markets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Markets Overview
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {filteredMarkets.length} of {markets.length} markets
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-gray-500 mt-4">Loading markets...</p>
                  </div>
                ) : filteredMarkets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No markets found</p>
                  </div>
                ) : (
                  filteredMarkets.map((market) => {
                    const { totalItems, uniqueItems, totalValue } =
                      calculateMarketStats(market);
                    const isExpanded = expandedMarkets[market.marketId];
                    const showAll = showAllItems[market.marketId];
                    const displayedItems = showAll
                      ? market.listItems
                      : market.listItems?.slice(0, 6);

                    return (
                      <div
                        key={market.marketId}
                        className={`p-6 hover:bg-blue-50 transition-colors ${getHighlightClass(
                          totalItems,
                          totalValue
                        )}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                          {/* Left Side - Main Content */}
                          <div className="flex-1">
                            {/* Header with Market Name and View Users Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-900">
                                {market.marketName || "Unnamed Market"}
                              </h3>

                              <button
                                onClick={() =>
                                  fetchMarketUsers(market.marketId)
                                }
                                className="flex items-center mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                View Users
                              </button>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                              {/* Unique Items */}
                              <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 shadow-sm">
                                <Package className="w-6 h-6 text-blue-600 mb-2" />
                                <p className="text-xl font-bold text-gray-900">
                                  {uniqueItems}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Unique Items
                                </p>
                              </div>

                              {/* Total Quantity */}
                              <div className="flex flex-col items-center bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-4 shadow-sm">
                                <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
                                <p className="text-xl font-bold text-gray-900">
                                  {totalItems}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Total Quantity
                                </p>
                              </div>

                              {/* Total Value */}
                              <div className="flex flex-col items-center bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4 shadow-sm">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6 text-purple-600 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2m0 12c1.1 0 2-.9 2-2s-.9-2-2-2m0 0v-4m0 4v4m0-12v2m0 8v2"
                                  />
                                </svg>
                                <p className="text-xl font-bold text-gray-900">
                                  ₹{totalValue.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Total Value
                                </p>
                              </div>
                            </div>

                            {/* Market Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Lead:</span>&nbsp;
                                {market.leadName || "No lead assigned"}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Open Date:</span>
                                &nbsp;
                                {market.openDate || "No date set"}
                              </div>
                              <div className="flex items-center md:col-span-2">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Address:</span>
                                &nbsp;
                                {market.address || "No address provided"}
                              </div>
                            </div>

                            {/* Coordinates if available */}
                            {market.latitude && market.longitude && (
                              <div className="mt-2 text-xs text-gray-400">
                                Coordinates: {market.latitude},{" "}
                                {market.longitude}
                              </div>
                            )}
                          </div>

                          {/* Right Side - Expand Button */}
                          {market.listItems && market.listItems.length > 0 && (
                            <div className="self-start sm:self-center">
                              <button
                                onClick={() =>
                                  toggleMarketExpansion(market.marketId)
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                aria-label="Toggle Details"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Expanded Items */}
                        {isExpanded &&
                          market.listItems &&
                          market.listItems.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">
                                  Available Items
                                </h4>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-gray-600">
                                    {displayedItems?.length} of{" "}
                                    {market.listItems.length} items
                                  </span>
                                  {market.listItems.length > 6 && (
                                    <button
                                      onClick={() =>
                                        toggleShowAllItems(market.marketId)
                                      }
                                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                      {showAll
                                        ? "Show Less"
                                        : `Show All (${market.listItems.length})`}
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayedItems?.map((item) => (
                                  <div
                                    key={item.itemId}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    {item.imageUrl && (
                                      <img
                                        src={item.imageUrl}
                                        alt={item.itemName}
                                        className="w-12 h-12 object-cover rounded-lg"
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.style.display = "none";
                                        }}
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.itemName || "Unnamed Item"}
                                      </p>
                                      <div className="text-xs text-gray-500">
                                        <span>Qty: {item.qty || 0}</span>
                                        {item.weight && (
                                          <span>
                                            {" "}
                                            | Weight: {item.weight}kg
                                          </span>
                                        )}
                                        {item.itemAddedDate && (
                                          <span>
                                            {" "}
                                            | Added: {item.itemAddedDate}
                                          </span>
                                        )}
                                      </div>
                                      {item.offerPrice && (
                                        <p className="text-xs text-green-600 font-medium">
                                          Offer: ₹{item.offerPrice}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="p-6 border-t bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Page {currentPage + 1} of {totalPages} ({totalElements}{" "}
                      total markets)
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-600">
                        {currentPage + 1}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Market Users Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Market Users
                </h2>
                {selectedMarket && marketUsers && (
                  <p className="text-sm text-gray-500 mt-1">
                    {marketUsers.marketName} •{" "}
                    {marketUsers.listMarketUserInfo?.length || 0} users
                  </p>
                )}
              </div>

              {!selectedMarket ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a market to view users and orders</p>
                </div>
              ) : userLoading ? (
                <div className="p-8 text-center">
                  <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
                  <p className="text-gray-500 mt-4">Loading users...</p>
                </div>
              ) : marketUsers &&
                marketUsers.listMarketUserInfo &&
                marketUsers.listMarketUserInfo.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {marketUsers.listMarketUserInfo.map((user) => {
                    const { totalOrders, totalAmount, totalItems } =
                      calculateUserOrderStats(user);

                    return (
                      <div key={user.userOfflineOrdersId} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {user.userName || "Unknown User"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {user.mobileNumber || "No phone"}
                            </p>
                            {user.address && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {user.address}
                              </p>
                            )}

                            {/* User Stats */}
                            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="font-semibold text-blue-600">
                                  {totalOrders}
                                </div>
                                <div className="text-gray-500">Orders</div>
                              </div>
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="font-semibold text-green-600">
                                  ₹{totalAmount.toFixed(2)}
                                </div>
                                <div className="text-gray-500">Total</div>
                              </div>
                              <div className="text-center p-2 bg-purple-50 rounded">
                                <div className="font-semibold text-purple-600">
                                  {totalItems}
                                </div>
                                <div className="text-gray-500">Items</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Orders */}
                        {user.offlinePayments &&
                          user.offlinePayments.map((payment, idx) => (
                            <div
                              key={payment.orderPaymentId || idx}
                              className="mt-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    payment.paymentStatus === "SUCCESS"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payment.paymentStatus || "PENDING"}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {payment.paidDate || "No date"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                <div>
                                  <span className="text-gray-500">Amount:</span>
                                  <span className="font-semibold ml-1">
                                    ₹{payment.paidAmount || 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">GST:</span>
                                  <span className="font-semibold ml-1">
                                    ₹{payment.totalGst || 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Items:</span>
                                  <span className="font-semibold ml-1">
                                    {payment.totalQty || 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Method:</span>
                                  <span className="font-semibold ml-1">
                                    {payment.paymentType || "N/A"}
                                  </span>
                                </div>
                              </div>

                              {payment.paymentId && (
                                <div className="text-xs text-gray-400 mb-3">
                                  Payment ID: {payment.paymentId}
                                </div>
                              )}

                              {/* Items */}
                              {payment.offlineItems &&
                                payment.offlineItems.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700">
                                      Items:
                                    </h5>
                                    {payment.offlineItems.map(
                                      (item, itemIdx) => (
                                        <div
                                          key={
                                            item.offlineUserItemsId || itemIdx
                                          }
                                          className="flex items-center justify-between text-sm p-2 bg-white rounded"
                                        >
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                              {item.itemName || "Unknown Item"}
                                            </p>
                                            <div className="text-gray-500 text-xs">
                                              <span>
                                                Weight: {item.weight || 0}kg
                                              </span>
                                              {item.itemAddAt && (
                                                <span>
                                                  {" "}
                                                  | Added: {item.itemAddAt}
                                                </span>
                                              )}
                                              {item.status && (
                                                <span>
                                                  {" "}
                                                  | Status: {item.status}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold">
                                              ₹{item.price || 0}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                              Qty: {item.qty || 0}
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No users found for this market</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketReport;
