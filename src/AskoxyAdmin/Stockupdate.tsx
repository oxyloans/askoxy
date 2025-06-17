import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  message,
  Tag,
  Image,
  Space,
  Card,
  Typography,
  Spin,
  Timeline,
  Divider,
} from "antd";
import { EyeOutlined, EditOutlined, HistoryOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

interface ProductItem {
  itemName: string;
  categoryName: string;
  weight: number;
  units: string;
  isActive: string;
  itemId: string;
  itemImage: string;
  quantity: number;
  categoryId: string;
}

interface StockHistoryItem {
  id: string;
  stockUpdatePrimaryId: string;
  itemId: string;
  itemName: string;
  itemWeight: number;
  stockQty: number;
  buyingPrice: number;
  itemMrp: number;
  stockReceivedAt: string;
}

interface StockData {
  id: string;
  itemId: string;
  itemName: string;
  itemWeight: number;
  stockQty: number;
  buyingPrice: number;
  itemMrp: number;
  totalPurchasePrice: number;
  stockReceivedAt: string;
  stockHistory: StockHistoryItem[];
}

const StockUpdate: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    stockQty: 0,
    buyingPrice: 0,
    itemMrp: 0, // Added MRP field
    totalPurchasePrice: 0,
    vendor: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/getItemsDataForAskOxy`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const filteredData = data.filter(
          (item: ProductItem) => item.weight === 26
        );
        setProducts(filteredData);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      message.error("Error fetching products");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data for a specific item
  const fetchStockData = async (itemId: string) => {
    setStockLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/get_stock/${itemId}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStockData(data);
      } else {
        message.error("Failed to fetch stock data");
      }
    } catch (error) {
      message.error("Error fetching stock data");
      console.error("Error:", error);
    } finally {
      setStockLoading(false);
    }
  };

  const updateStock = async (values: any) => {
    try {
      const updateData = {
        buyingPrice: values.buyingPrice,
        itemId: selectedItem?.itemId,
        itemMrp: values.itemMrp, 
        stockQty: values.stockQty,
        totalPurchasePrice: values.totalPurchasePrice,
        vendor: values.vendor,
      };

      const response = await fetch(`${BASE_URL}/product-service/updateStock`, {
        method: "PATCH",
        headers: {  
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        message.success("Stock updated successfully");
        setUpdateModalVisible(false);
        fetchProducts();
      } else {
        message.error("Failed to update stock");
      }
    } catch (error) {
      message.error("Error updating stock");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = (item: ProductItem) => {
    setSelectedItem(item);
    setUpdateModalVisible(true);
    setFormData({
      itemId: item.itemId,
      stockQty: 0,
      buyingPrice: 0,
      itemMrp: 0, 
      totalPurchasePrice: 0,
      vendor: "",
    });
  };

  const handleViewStock = (item: ProductItem) => {
    setSelectedItem(item);
    setViewModalVisible(true);
    fetchStockData(item.itemId);
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity > 20) return "success";
    if (quantity > 10) return "warning";
    return "error";
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "itemImage",
      key: "itemImage",
      render: (url: string) => (
        <Image
          width={50}
          height={50}
          src={url}
          alt="Product"
          className="rounded-lg object-cover"
        />
      ),
      width: 80,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (name: string) => (
        <Text className="font-medium text-sm text-gray-800">{name}</Text>
      ),
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: ProductItem) => (
        <Space direction="vertical" size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdateStock(record)}
            className="w-24 h-8 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200"
          >
            Update
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewStock(record)}
            className="w-24 h-8 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            View
          </Button>
        </Space>
      ),
      width: 100,
    },
    {
      title: "Category & Weight",
      key: "categoryWeight",
      align: "center" as const,
      render: (record: ProductItem) => (
        <div className="flex flex-col items-center gap-1">
          <Tag className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {record.categoryName}
          </Tag>
          <Text className="text-sm font-medium text-gray-700">
            {record.weight} {record.units}
          </Text>
        </div>
      ),
      width: 140,
    },

    {
      title: "Stock & Status",
      key: "stockStatus",
      align: "center" as const,
      render: (record: ProductItem) => (
        <div className="flex flex-col items-center gap-1">
          <Tag
            className={`text-xs px-2 py-0.5 rounded-full ${
              record.quantity > 20
                ? "bg-green-100 text-green-800"
                : record.quantity > 10
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {record.quantity} bags
          </Tag>
          <Tag
            className={`text-xs px-2 py-0.5 rounded-full ${
              record.isActive === "true"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {record.isActive === "true" ? "Active" : "Inactive"}
          </Tag>
        </div>
      ),
      width: 120,
    },
  ];

  return (
    <div className="p-2 max-w-full overflow-hidden">
      <Title level={2} className="text-lg font-bold text-gray-800 mb-6">
        Stock Management
      </Title>

      {/* <Card className="shadow-lg rounded-xl overflow-hidden"> */}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="itemId"
        loading={loading}
        pagination={{
          pageSize: 50,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 700 }}
        className="w-full"
        size="small"
      />
      {/* </Card> */}

      {/* Update Stock Modal */}
      <Modal
        title={
          <Text className="text-lg font-semibold text-gray-800">
            Update Stock
          </Text>
        }
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          setFormData({
            itemId: "",
            stockQty: 0,
            buyingPrice: 0,
            itemMrp: 0, 
            totalPurchasePrice: 0,
            vendor: "",
          });
        }}
        footer={null}
        width={500}
        className="top-5"
      >
        <div className="mt-4 space-y-4">
          {selectedItem && (
            <Card className="rounded-xl shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex items-center gap-4">
                <Image
                  width={60}
                  height={60}
                  src={selectedItem.itemImage}
                  alt="Product"
                  className="rounded-xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <Title level={4} className="mb-2 text-gray-800 text-lg">
                    {selectedItem.itemName}
                  </Title>
                  <Space wrap>
                    <Tag className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {selectedItem.categoryName}
                    </Tag>
                    <Tag className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {selectedItem.weight} {selectedItem.units}
                    </Tag>
                  </Space>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <InputNumber
                min={0}
                className="w-full rounded-md text-sm"
                placeholder="Enter quantity"
                value={formData.stockQty}
                onChange={(value) =>
                  setFormData({ ...formData, stockQty: value || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buying Price *
              </label>
              <InputNumber
                min={0}
                className="w-full rounded-md text-sm"
                placeholder="Enter price"
                addonBefore="₹"
                value={formData.buyingPrice}
                onChange={(value) =>
                  setFormData({ ...formData, buyingPrice: value || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRP *
              </label>
              <InputNumber
                min={0}
                className="w-full rounded-md text-sm"
                placeholder="Enter MRP"
                addonBefore="₹"
                value={formData.itemMrp}
                onChange={(value) =>
                  setFormData({ ...formData, itemMrp: value || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Purchase Price *
              </label>
              <InputNumber
                min={0}
                className="w-full rounded-md text-sm"
                placeholder="Enter total"
                addonBefore="₹"
                value={formData.totalPurchasePrice}
                onChange={(value) =>
                  setFormData({ ...formData, totalPurchasePrice: value || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor *
              </label>
              <Input
                placeholder="Enter vendor name"
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
                className="rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => {
                setUpdateModalVisible(false);
                setFormData({
                  itemId: "",
                  stockQty: 0,
                  buyingPrice: 0,
                  itemMrp: 0, // Reset MRP field
                  totalPurchasePrice: 0,
                  vendor: "",
                });
              }}
              className="rounded-md text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (
                  formData.stockQty &&
                  formData.buyingPrice &&
                  formData.itemMrp &&
                  formData.totalPurchasePrice &&
                  formData.vendor
                ) {
                  updateStock(formData);
                } else {
                  message.warning("Please fill all required fields");
                }
              }}
              className="rounded-md text-sm bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
            >
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Stock Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <EyeOutlined className="text-white text-sm" />
            </div>
            <Text className="text-lg font-semibold text-gray-800">
              Stock Details & History
            </Text>
            {selectedItem && (
              <Tag className="text-sm px-3 py-1 rounded-xl bg-blue-100 text-blue-800 ml-2">
                {selectedItem.itemName}
              </Tag>
            )}
          </div>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setStockData(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setStockData(null);
            }}
            className="rounded-xl text-sm px-6 h-10 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 hover:from-gray-600 hover:to-gray-700 font-medium"
            size="large"
          >
            Close
          </Button>,
        ]}
        width={800}
        className="top-4"
        centered
      >
        {stockLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" />
          </div>
        ) : stockData && selectedItem ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Product Information */}
            <Card className="rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex items-center gap-4">
                <Image
                  width={80}
                  height={80}
                  src={selectedItem.itemImage}
                  alt="Product"
                  className="rounded-xl object-cover shadow-lg"
                />
                <div className="flex-1">
                  <Title level={3} className="mb-3 text-gray-800 text-xl">
                    {selectedItem.itemName}
                  </Title>
                  <Space wrap>
                    <Tag className="bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-sm font-medium">
                      {selectedItem.categoryName}
                    </Tag>
                    <Tag className="bg-green-100 text-green-800 px-3 py-2 rounded-xl text-sm font-medium">
                      {selectedItem.weight} {selectedItem.units}
                    </Tag>
                    <Tag
                      color={
                        selectedItem.isActive === "true" ? "success" : "error"
                      }
                      className="px-3 py-2 rounded-xl text-sm font-medium"
                    >
                      {selectedItem.isActive === "true" ? "Active" : "Inactive"}
                    </Tag>
                  </Space>
                </div>
              </div>
            </Card>

            {/* Current Stock Information Grid */}
            <Card className="rounded-xl shadow-lg bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100">
              <Title
                level={4}
                className="mb-4 text-gray-800 text-lg border-b pb-3 flex items-center gap-2"
              >
                📊 Current Stock Information
              </Title>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    Current Stock
                  </Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {stockData.stockQty}
                  </Text>
                  <Text className="text-gray-500 text-sm ml-2">bags</Text>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    Buying Price
                  </Text>
                  <Text className="text-2xl font-bold text-emerald-600">
                    ₹{stockData.buyingPrice.toLocaleString()}
                  </Text>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    MRP
                  </Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    ₹
                    {stockData.itemMrp > 0
                      ? stockData.itemMrp.toLocaleString()
                      : "N/A"}
                  </Text>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    Total Purchase
                  </Text>
                  <Text className="text-2xl font-bold text-purple-600">
                    ₹{stockData.totalPurchasePrice.toLocaleString()}
                  </Text>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    Item Weight
                  </Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    {stockData.itemWeight}
                  </Text>
                  <Text className="text-gray-500 text-sm ml-2">kg</Text>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <Text className="text-gray-500 text-sm block mb-2 font-medium">
                    Last Updated
                  </Text>
                  <Text className="text-lg font-bold text-gray-800">
                    {new Date(stockData.stockReceivedAt).toLocaleDateString(
                      "en-IN"
                    )}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(stockData.stockReceivedAt).toLocaleTimeString(
                      "en-IN"
                    )}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Stock History */}
            {stockData.stockHistory && stockData.stockHistory.length > 0 && (
              <Card className="rounded-xl shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-100">
                <Title
                  level={4}
                  className="mb-4 text-gray-800 text-lg border-b pb-3 flex items-center gap-2"
                >
                  <HistoryOutlined className="text-orange-600" />
                  Stock Update History
                </Title>
                <Timeline
                  mode="left"
                  className="mt-4"
                  items={stockData.stockHistory.map((history, index) => ({
                    color: index === 0 ? "#10b981" : "#6b7280",
                    children: (
                      <Card className="rounded-xl shadow-sm bg-white border border-gray-200 ml-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Text className="text-gray-500 text-sm block mb-1">
                              Stock Quantity
                            </Text>
                            <Text className="text-lg font-bold text-gray-800">
                              {history.stockQty} units
                            </Text>
                          </div>
                          <div>
                            <Text className="text-gray-500 text-sm block mb-1">
                              Buying Price
                            </Text>
                            <Text className="text-lg font-bold text-emerald-600">
                              ₹{history.buyingPrice.toLocaleString()}
                            </Text>
                          </div>
                          <div>
                            <Text className="text-gray-500 text-sm block mb-1">
                              MRP
                            </Text>
                            <Text className="text-lg font-bold text-blue-600">
                              ₹{history.itemMrp > 0 ? history.itemMrp.toLocaleString() : "N/A"}
                            </Text>
                          </div>
                          <div>
                            <Text className="text-gray-500 text-sm block mb-1">
                              Weight
                            </Text>
                            <Text className="text-lg font-bold text-orange-600">
                              {history.itemWeight} kg
                            </Text>
                          </div>
                          <div className="col-span-2">
                            <Text className="text-gray-500 text-sm block mb-1">
                              Updated On
                            </Text>
                            <Text className="text-sm font-medium text-gray-800">
                              {new Date(
                                history.stockReceivedAt
                              ).toLocaleDateString("en-IN")}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {new Date(
                                history.stockReceivedAt
                              ).toLocaleTimeString("en-IN")}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    ),
                  }))}
                />
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Text className="text-2xl">📦</Text>
            </div>
            <Text className="text-gray-500 text-lg">
              No stock data available
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockUpdate;