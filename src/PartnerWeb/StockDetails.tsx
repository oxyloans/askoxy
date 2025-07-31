import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  Input,
  Row,
  Col,
  Select,
  message,
} from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface StockItem {
  id: string;
  itemId: string;
  itemName: string;
  itemWeight: number;
  stockQty: number;
  buyingPrice: number;
  itemMrp: number | null;
  totalPurchasePrice: number;
  stockReceivedAt: string;
  stockHistory: any;
}

const categoryOptions = ["RICE", "GOLD", "Grocery", "FESTIVAL"];

const StockTable: React.FC = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [filteredData, setFilteredData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [category, setCategory] = useState<string>("RICE");

  useEffect(() => {
    fetchStockData(category);
  }, [category]);

  const fetchStockData = async (selectedCategory: string) => {
    setLoading(true);
    try {
      const response = await axios.get<StockItem[]>(
        `${BASE_URL}/product-service/getAllStock?Category_Type=${selectedCategory}`
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      message.error("Failed to fetch stock data. Please try again.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();

    const filtered = data.filter(
      (item) =>
        item.itemName.toLowerCase().includes(lowerValue) ||
        item.itemWeight.toString().includes(lowerValue) ||
        item.itemId.slice(-4).toLowerCase().includes(lowerValue)
    );

    setFilteredData(filtered);
  };

  const columns: ColumnsType<StockItem> = [
    {
      title: "S.No.",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 50,
      align: "center",
    },
    {
      title: "Item ID (Last 4)",
      dataIndex: "itemId",
      key: "itemId",
      width: 100,
      align: "center",
      render: (itemId: string) => `#${itemId.slice(-4)}`,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      align: "center",
      width: 250,
      key: "itemName",
    },
    {
      title: "Weight (kg)",
      dataIndex: "itemWeight",
      key: "itemWeight",
      align: "center",
    },
    {
      title: "Stock Qty",
      dataIndex: "stockQty",
      key: "stockQty",
      align: "center",
    },
    {
      title: "Buying Price",
      dataIndex: "buyingPrice",
      key: "buyingPrice",
      render: (price: number) => `₹${price}`,
      align: "center",
    },
    {
      title: "Total Purchase",
      dataIndex: "totalPurchasePrice",
      key: "totalPurchasePrice",
      render: (total: number) => `₹${total}`,
      align: "center",
    },
    {
      title: "Received Date",
      dataIndex: "stockReceivedAt",
      key: "stockReceivedAt",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: "10px" }}
      >
        <Col xs={24}>
          <Title level={3} style={{ marginBottom: 12 }}>
            Stock Inventory
          </Title>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            value={category}
            onChange={(value) => setCategory(value)}
            style={{ width: "100%" }}
          >
            {categoryOptions.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ marginLeft: "auto" }}>
          <Search
            placeholder="Search by Name, Weight or Item ID (last 4)"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
          />
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
      ) : (
        <Table<StockItem>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 100 }}
          scroll={{ x: "max-content" }}
          bordered
        />
      )}
    </div>
  );
};

export default StockTable;
