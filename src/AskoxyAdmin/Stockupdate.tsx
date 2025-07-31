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
  Form,
  Space,
  Card,
  Typography,
  Spin,
  Timeline,
  Divider,
  Select,
  Row,
  Statistic,
  
  Col,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  HistoryOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { Option } = Select;


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
  itemMrp: number | null;
  stockReceivedAt: string;
  sellingPrice: number;
  profit: number;
  loss: number;
  message: string | null;
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
   categoryType: string,
  updatedBy: string,
  stockHistory: StockHistoryItem[];
}

enum CategoryEnum {
  FESTIVAL = "FESTIVAL",
  GOLD = "GOLD",
  RICE = "RICE",
  Grocery = "Grocery",
}

const StockUpdate: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryEnum | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState({
    itemId: "",
    stockQty: 0,
    buyingPrice: 0,
    itemMrp: 0,
    totalPurchasePrice: 0,
    vendor: "",
    categoryType: "",
    updatedBy: "",
  });
  const [form] = Form.useForm();
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  // Reset stockData and selectedItem when View Modal is closed
  useEffect(() => {
    setStockData(null);
    setSelectedItem(null);
  }, []);
  const fetchProducts = async () => {
    if (!selectedCategory) {
      message.warning("Please select a category first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/getRiceBagDetails?categoryType=${selectedCategory}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
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
        categoryType: values.categoryType,
        updatedBy: values.updatedBy,
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
        const result = await response.json();

        // Close the update modal first
        setUpdateModalVisible(false);

        // Set the result data and show the result modal
        setUpdateResult(result);
        setResultModalVisible(true);

        message.success("Stock updated successfully");
        fetchProducts();
      } else {
        message.error("Failed to update stock");
      }
    } catch (error) {
      message.error("Error updating stock");
      console.error("Error:", error);
    }
  };

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

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
      categoryType: "", // new
      updatedBy: "", // new
    });
  };

  const handleViewStock = (item: ProductItem) => {
setStockData(null);
setSelectedItem(item);
setViewModalVisible(true);
fetchStockData(item.itemId);
  };
  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setStockData(null); // Reset stock data
    setSelectedItem(null); // Reset selected item
  };

  const handleCategoryChange = (value: CategoryEnum) => {
    setSelectedCategory(value);
    setProducts([]);
    setFilteredProducts([]);
    setSearchTerm("");
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "itemImage",
      key: "itemImage",
      align: "center" as const,
      render: (url: string) => (
        <Image
          width={50}
          height={50}
          src={url}
          alt="Product"
          className="rounded-lg object-cover"
          preview={false}
        />
      ),
      width: 80,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      align: "center" as const,
      key: "itemName",
      render: (name: string) => (
        <Text className="font-medium text-sm text-gray-800">{name}</Text>
      ),
      width: 200,
    },

    {
      title: "Category & Weight",
      key: "categoryWeight",
      align: "center" as const,
      render: (record: ProductItem) => (
        <div className="flex flex-col items-center gap-1">
          <Tag className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {record.categoryName || selectedCategory || "N/A"}
          </Tag>
          <Text className="text-sm font-medium text-gray-700">
            {record.weight} {record.units}
          </Text>
        </div>
      ),
      width: 140,
    },
    // {
    //   title: "Stock & Status",
    //   key: "stockStatus",
    //   align: "center" as const,
    //   render: (record: ProductItem) => (
    //     <div className="flex flex-col items-center gap-1">
    //       <Tag
    //         className={`text-xs px-2 py-0.5 rounded-full ${
    //           record.quantity > 20
    //             ? "bg-green-100 text-green-800"
    //             : record.quantity > 10
    //             ? "bg-orange-100 text-orange-800"
    //             : "bg-red-100 text-red-800"
    //         }`}
    //       >
    //         {record.quantity} bags
    //       </Tag>
    //       <Tag
    //         className={`text-xs px-2 py-0.5 rounded-full ${
    //           record.isActive === "true"
    //             ? "bg-green-100 text-green-800"
    //             : "bg-red-100 text-red-800"
    //         }`}
    //       >
    //         {record.isActive === "true" ? "Active" : "Inactive"}
    //       </Tag>
    //     </div>
    //   ),
    //   width: 120,
    // },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: (record: ProductItem) => (
        <Space direction="vertical" size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdateStock(record)}
            style={{
              width: 96,
              height: 32,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: "#1ab394",
              borderColor: "#1ab394",
              color: "#ffffff",
            }}
            className="hover:!bg-[#18a689] hover:!border-[#18a689] transition-colors duration-200"
          >
            Update
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewStock(record)}
            style={{
              width: 96,
              height: 32,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: "#1c84c6",
              borderColor: "#1c84c6",
              color: "#ffffff",
            }}
            className="hover:!bg-[#1a7bb8] hover:!border-[#1a7bb8] transition-colors duration-200"
          >
            View
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  const columns1 = [
    {
      title: "S.No",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      align: "center" as const,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQty",
      key: "stockQty",
      render: (qty: number) => `${qty} units`,
      align: "center" as const,
    },
    {
      title: "Buying Price",
      dataIndex: "buyingPrice",
      key: "buyingPrice",
      render: (price: number) => `₹${price.toLocaleString()}`,
      align: "center" as const,
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      render: (price: number) => `₹${price.toLocaleString()}`,
      align: "center" as const,
    },
    {
      title: "Weight",
      dataIndex: "itemWeight",
      key: "itemWeight",
      render: (w: number) => `${w} kg`,
      align: "center" as const,
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      align: "center" as const,
      width: 100,
      render: (p: number) => (
        <Text style={{ color: "#52c41a", fontSize: "large" }}>
          ₹{p.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Loss",
      dataIndex: "loss",
      align: "center" as const,
      key: "loss",
      width: 100,
      render: (l: number) => (
        <Text style={{ color: "#f5222d", fontSize: "large" }}>
          ₹{l.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Updated On",
      dataIndex: "stockReceivedAt",
      align: "center" as const,
      key: "stockReceivedAt",
      render: (date: string) => (
        <div>
          <Text>{new Date(date).toLocaleDateString("en-IN")}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(date).toLocaleTimeString("en-IN")}
          </Text>
        </div>
      ),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      align: "center" as const,
      render: (name: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {name}
        </Text>
      ),
    },
    {
      title: "Batch No",
      dataIndex: "batchNo",
      key: "batchNo",
      align: "center" as const,
      render: (batch: string) => (
        <Tag color="geekblue" className="text-sm px-3 py-1 rounded-md">
          {batch}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-2 max-w-full overflow-hidden">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={2} className="text-lg font-bold text-gray-800 mb-0">
            Stock Management
          </Title>
        </Col>
        <Col>
          <Text className="text-sm text-gray-600">
            {filteredProducts.length} items found
          </Text>
        </Col>
      </Row>
      <Card className="mb-6 rounded-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {/* Left side: Dropdown + Button */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="min-w-[200px]">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                Select Category *
              </Text>
              <Select
                placeholder="Choose category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full"
                size="middle"
              >
                {Object.values(CategoryEnum).map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="min-w-[120px]">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </Text>
              <Button
                type="primary"
                onClick={fetchProducts}
                loading={loading}
                disabled={!selectedCategory}
                className="w-full bg-blue-500 border-blue-500 hover:bg-blue-600 rounded-md"
                size="middle"
              >
                Get Data
              </Button>
            </div>
          </div>

          {/* Right side: Search bar */}
          <div className="flex-1 min-w-[140px] max-w-xs">
            <Text className="block text-sm font-medium text-gray-700 mb-2">
              Search Items
            </Text>
            <Input
              placeholder="Search by item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined className="text-gray-400" />}
              disabled={products.length === 0}
              className="rounded-md"
              size="middle"
              allowClear
            />
          </div>
        </div>
      </Card>
      <Table
        columns={columns}
        dataSource={filteredProducts}
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
        bordered
        locale={{
          emptyText: selectedCategory
            ? "No products found"
            : "Please select a category and click 'Get Data' to load products",
        }}
      />
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
          form.resetFields(); // Resets the form
        }}
        footer={null}
        width={600}
        className="top-5"
      >
        <div className="mt-2 space-y-4">
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
                    <Tag color="blue">
                      {selectedItem.categoryName || selectedCategory}
                    </Tag>
                    <Tag color="purple">
                      {selectedItem.weight} {selectedItem.units}
                    </Tag>
                  </Space>
                </div>
              </div>
            </Card>
          )}

          <Form
            layout="vertical"
            form={form}
            initialValues={formData}
            onFinish={updateStock}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stock Quantity"
                  name="stockQty"
                  rules={[
                    { required: true, message: "Please enter stock quantity" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter quantity"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Buying Price"
                  name="buyingPrice"
                  rules={[
                    { required: true, message: "Please enter buying price" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    addonBefore="₹"
                    placeholder="Enter price"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category Type"
                  name="categoryType"
                  rules={[
                    { required: true, message: "Please select category type" },
                  ]}
                >
                  <Select placeholder="Select category">
                    {["GOLD", "RICE", "GROCERY", "FESTIVAL"].map((cat) => (
                      <Select.Option key={cat} value={cat}>
                        {cat}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Updated By"
                  name="updatedBy"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Total Purchase Price"
                  name="totalPurchasePrice"
                  rules={[
                    {
                      required: true,
                      message: "Please enter total purchase price",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    addonBefore="₹"
                    placeholder="Enter total"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Vendor"
                  name="vendor"
                  rules={[
                    { required: true, message: "Please enter vendor name" },
                  ]}
                >
                  <Input placeholder="Enter vendor name" />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => {
                  setUpdateModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
              >
                Update Stock
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      {/* View Stock Modal - keeping the same as original */}
      <Modal
        title={
          <Space align="center" size="middle" style={{ paddingBottom: 8 }}>
            <Title level={4} style={{ margin: 0 }}>
              Stock Details & History
            </Title>
            {selectedItem && (
              <Tag color="blue" style={{ fontSize: 14 }}>
                {selectedItem.itemName}
              </Tag>
            )}
          </Space>
        }
        open={viewModalVisible}
        onCancel={ handleCloseViewModal }
        footer={[
          <Button
            key="close"
            onClick={handleCloseViewModal}
            type="primary"
            style={{
              borderRadius: 12,
              padding: "6px 24px",
              fontWeight: 600,
            }}
            size="large"
          >
            Close
          </Button>,
        ]}
        width={800}
        centered
      >
        {stockLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 64 }}
          >
            <Spin size="large" />
          </div>
        ) : stockData && selectedItem ? (
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Product Information */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "none",
                border: "1px solid #d9d9d9",
              }}
              bodyStyle={{ display: "flex", gap: 16, alignItems: "center" }}
            >
              <Image
                width={80}
                height={80}
                src={selectedItem.itemImage}
                alt="Product"
                preview={false}
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {selectedItem.itemName}
                </Title>
                <Space wrap size="middle">
                  <Tag color="blue" style={{ fontWeight: 600, fontSize: 14 }}>
                    {selectedItem.categoryName || selectedCategory}
                  </Tag>
                  <Tag color="green" style={{ fontWeight: 600, fontSize: 14 }}>
                    {selectedItem.weight} {selectedItem.units}
                  </Tag>
                  {/* <Tag
                    color={
                      selectedItem.isActive === "true" ? "success" : "error"
                    }
                    style={{ fontWeight: 600, fontSize: 14 }}
                  >
                    {selectedItem.isActive === "true" ? "Active" : "Inactive"}
                  </Tag> */}
                </Space>
              </div>
            </Card>

            {/* Current Stock Information Grid */}
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "none",
                borderColor: "#d9d9d9",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Title
                level={5}
                style={{
                  marginBottom: 16,
                  borderBottom: "1px solid #d9d9d9",
                  paddingBottom: 8,
                }}
              >
                📊 Current Stock Information
              </Title>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card
                    size="small"
                    bordered
                    style={{ borderRadius: 8, textAlign: "center" }}
                    bodyStyle={{ padding: "12px 8px" }}
                  >
                    <Statistic
                      title={<Text type="secondary">Current Stock</Text>}
                      value={`${stockData.stockQty} bags`}
                      valueStyle={{ fontSize: 22, fontWeight: "700" }}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card
                    size="small"
                    bordered
                    style={{ borderRadius: 8, textAlign: "center" }}
                    bodyStyle={{ padding: "12px 8px" }}
                  >
                    <Statistic
                      title={<Text type="secondary">Buying Price</Text>}
                      value={`₹${stockData.buyingPrice.toLocaleString()}`}
                      valueStyle={{
                        color: "#52c41a",
                        fontSize: 22,
                        fontWeight: "700",
                      }}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card
                    size="small"
                    bordered
                    style={{ borderRadius: 8, textAlign: "center" }}
                    bodyStyle={{ padding: "12px 8px" }}
                  >
                    <Statistic
                      title={<Text type="secondary">Total Purchase</Text>}
                      value={`₹${stockData.totalPurchasePrice.toLocaleString()}`}
                      valueStyle={{
                        color: "#722ed1",
                        fontSize: 22,
                        fontWeight: "700",
                      }}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card
                    size="small"
                    bordered
                    style={{ borderRadius: 8, textAlign: "center" }}
                    bodyStyle={{ padding: "12px 8px" }}
                  >
                    <Statistic
                      title={<Text type="secondary">Item Weight</Text>}
                      value={`${stockData.itemWeight} kg`}
                      valueStyle={{
                        color: "#fa8c16",
                        fontSize: 22,
                        fontWeight: "700",
                      }}
                    />
                  </Card>
                </Col>

                <Col span={16}>
                  <Card
                    size="small"
                    bordered
                    style={{ borderRadius: 8, textAlign: "center" }}
                    bodyStyle={{ padding: "12px 8px" }}
                  >
                    <Text type="secondary" strong>
                      Last Updated
                    </Text>
                    <br />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      {new Date(stockData.stockReceivedAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(stockData.stockReceivedAt).toLocaleTimeString(
                        "en-IN"
                      )}
                    </Text>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Stock History */}
            {stockData.stockHistory && stockData.stockHistory.length > 0 && (
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: "none",
                  borderColor: "#d9d9d9",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title
                  level={5}
                  style={{
                    marginBottom: 16,
                    borderBottom: "1px solid #d9d9d9",
                    paddingBottom: 8,
                  }}
                >
                  <HistoryOutlined style={{ marginRight: 8 }} />
                  Stock Update History
                </Title>
                <Table
                  columns={columns1}
                  dataSource={stockData.stockHistory.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={{ pageSize: 5 }}
                  bordered
                  scroll={{ x: "max-content" }}
                />
              </Card>
            )}
          </Space>
        ) : (
          <div style={{ textAlign: "center", padding: 64 }}>
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                margin: "0 auto 16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
              }}
            >
              📦
            </div>
            <Text type="secondary" style={{ fontSize: 18 }}>
              No stock data available
            </Text>
          </div>
        )}
      </Modal>

      <Modal
        title={null}
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
          setUpdateResult(null);
        }}
        footer={null}
        width={420}
        centered
        styles={{
          content: {
            borderRadius: "16px",
            padding: 0,
            overflow: "hidden",
          },
        }}
      >
        {updateResult && (
          <div className="bg-white">
            {/* Header */}
            <div
              className={`px-6 py-4 text-center ${
                updateResult.profit > 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-pink-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {updateResult.profit > 0 ? (
                  <CheckCircleOutlined className="text-white text-lg" />
                ) : (
                  <ExclamationCircleOutlined className="text-white text-lg" />
                )}
                <Text className="text-white font-semibold text-lg">
                  {updateResult.profit > 0 ? "Profit Made!" : "Loss Recorded"}
                </Text>
              </div>
              <Text className="text-white/90 text-sm">
                {updateResult.itemName}
              </Text>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Price Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Text className="text-blue-600 text-xs font-medium uppercase tracking-wide block mb-1">
                    Buying Price
                  </Text>
                  <Text className="text-blue-800 text-xl font-bold">
                    ₹{updateResult.buyingPrice?.toLocaleString() || "N/A"}
                  </Text>
                </div>
                {/* <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <Text className="text-green-600 text-xs font-medium uppercase tracking-wide block mb-1">
                    Selling Price
                  </Text>
                  <Text className="text-green-800 text-xl font-bold">
                    ₹{updateResult.sellingPrice?.toLocaleString() || "N/A"}
                  </Text>
                </div> */}
              </div>

              {/* Profit/Loss Highlight */}
              {/* <div
                className={`text-center p-4 rounded-lg border-2 ${
                  updateResult.profit > 0
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <Text
                  className={`text-xs font-medium uppercase tracking-wide block mb-2 ${
                    updateResult.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {updateResult.profit > 0 ? "Total Profit" : "Total Loss"}
                </Text>
                <Text
                  className={`text-3xl font-bold ${
                    updateResult.profit > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ₹
                  {updateResult.profit > 0
                    ? updateResult.profit?.toLocaleString()
                    : Math.abs(updateResult.loss)?.toLocaleString() || "0"}
                </Text>
              </div> */}

              {/* Message - Highly Highlighted */}
              {updateResult.message && (
                <div
                  className={`p-4 rounded-lg border-2 text-center shadow-lg ${
                    updateResult.profit > 0
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300"
                      : "bg-gradient-to-r from-red-100 to-pink-100 border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {updateResult.profit > 0 ? (
                      <CheckCircleOutlined className="text-green-600 text-lg" />
                    ) : (
                      <ExclamationCircleOutlined className="text-red-600 text-lg" />
                    )}
                    <Text
                      className={`font-bold text-sm uppercase tracking-wide ${
                        updateResult.profit > 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Important Message
                    </Text>
                  </div>
                  <Text
                    className={`text-base font-bold leading-relaxed ${
                      updateResult.profit > 0
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {updateResult.message}
                  </Text>
                </div>
              )}

              {/* Close Button */}
              <Button
                onClick={() => {
                  setResultModalVisible(false);
                  setUpdateResult(null);
                }}
                className="w-full h-10 rounded-lg font-medium"
                type="primary"
                size="large"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockUpdate;
