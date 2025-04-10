import React, { useState, useEffect } from "react";
import { Input, Modal, Form, message, Button, Tag, Spin } from "antd";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";

// Define the type for the item based on the new API response
interface Item {
  itemName: string;
  quantity: number;
  units: string;
  itemMrp?: number;
  itemId: string;
  itemImage: string;
  weight: number;
  itemPrice?: number;
  active: boolean;
}

const PartnerItemsList: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [priceUpdateModal, setPriceUpdateModal] = useState<{
    visible: boolean;
    item: Item | null;
  }>({
    visible: false,
    item: null,
  });

  const openPriceUpdateModal = (item: Item) => {
    form.resetFields();
    setPriceUpdateModal({ visible: true, item });

    form.setFieldsValue({
      mrp: item.itemMrp,
      price: item.itemPrice,
    });
  };

  const closePriceUpdateModal = () => {
    form.resetFields();
    setPriceUpdateModal({ visible: false, item: null });
  };

  const calculateDiscount = (mrp: number, price: number) => {
    if (mrp == 0) return "";
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/ItemsGetTotal`
      );

      const transformedItems = response.data.map((item: Item) => ({
        ...item,
        // active: item.isActive === "true",
        // itemMrp: 1000,
        // itemPrice: 900,
      }));

      setItems(transformedItems);
      setFilteredItems(transformedItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
      message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handlePriceUpdate = async (values: any) => {
    if (!priceUpdateModal.item) return;
    const { mrp, price } = values;
    if (price > mrp) {
      message.error("Selling price cannot be higher than MRP");
      return;
    }
    try {
      const data = {
        sellerId: accessToken.id,
        itemMrp: parseFloat(mrp),
        active: priceUpdateModal.item.active,
        itemId: priceUpdateModal.item.itemId,
        itemPrice: parseFloat(price),
      };

      await axios.patch(
        `${BASE_URL}/product-service/sellerItemPriceFix`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken.token}` },
        }
      );

      setPriceUpdateModal({ visible: false, item: null });
      message.success("Price updated successfully");
      fetchItems();
    } catch (error) {
      message.error("Failed to update prices");
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusToggle = (item: Item) => {
    Modal.confirm({
      title: "Confirm Status Change",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        item.active === true ? "deactivate" : "activate"
      } ${item.itemName}?`,
      okText: "Yes",
      okType: item.active === true ? "danger" : "primary",
      cancelText: "No",
      onOk() {
        handleStatusToggle(item);
      },
    });
  };

  const handleStatusToggle = async (item: Item) => {
    try {
      const updatedStatus = !item.active;

      const data = {
        itemId: item.itemId,
        status: updatedStatus,
      };

      await axios.patch(
        `${BASE_URL}/product-service/itemActiveAndInActive`,
        data
      );

      message.success(`Item ${item.itemName} status updated`);
      fetchItems();
    } catch (error) {
      console.error("Failed to update item status", error);
      message.error("Failed to update item status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-4 ">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h3 className="text-2xl font-semibold text-gray-800">
          Items Management
        </h3>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 z-50">
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col"
          >
            {/* Offer Badge */}
            {/* {item.itemMrp &&
              item.itemPrice &&
              item.itemMrp > item.itemPrice && (
                <Tag color="purple" className="absolute top-2 left-2 z-50">
                  {calculateDiscount(item.itemMrp, item.itemPrice)}% OFF
                </Tag>
              )} */}

            <div className="aspect-square mb-3 overflow-hidden rounded-t-lg bg-gray-50">
              <img
                src={item.itemImage ?? "https://via.placeholder.com/150"}
                alt={item.itemName}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-2 space-y-1 flex-grow">
              <h3 className="font-medium text-gray-800 line-clamp-2 text-sm">
                {item.itemName}
              </h3>
              <p className="text-sm text-gray-500">
                Weight: {item.weight} {item.units}
              </p>

              {item.itemPrice && (
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{item.itemPrice}
                  </span>
                  <span className="text-sm text-red-500 line-through">
                    ₹{item.itemMrp || ""}
                  </span>
                </div>
              )}
            </div>

            <div className="p-1 flex flex-col space-y-2 mt-auto">
              <Button
                onClick={() => openPriceUpdateModal(item)}
                className="w-full"
                type="primary"
                style={{
                  backgroundColor: "#0958d9",
                  borderColor: "#0958d9",
                }}
              >
                Update Price
              </Button>
              <Button
                onClick={() => confirmStatusToggle(item)}
                className="w-full"
                style={{
                  backgroundColor:
                    item.active === false ? undefined : "#22c55e",
                  color: item.active === false ? undefined : "white",
                  borderColor: item.active === false ? undefined : "#22c55e",
                }}
                danger={item.active === false}
                type="default"
              >
                {item.active === false ? "Deactive" : "Active"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Price Update Modal */}
      <Modal
        title="Update Prices"
        open={priceUpdateModal.visible}
        onCancel={() => setPriceUpdateModal({ visible: false, item: null })}
        footer={null}
      >
        {priceUpdateModal.item && (
          <Form
            form={form}
            initialValues={{
              mrp: priceUpdateModal.item.itemMrp,
              price: priceUpdateModal.item.itemPrice,
            }}
            onFinish={handlePriceUpdate}
          >
            <Form.Item
              name="mrp"
              label="MRP"
              rules={[
                { required: true, message: "Please input MRP" },
                // { type: "number", min: 0, message: "MRP must be positive" },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Selling Price"
              rules={[
                { required: true, message: "Please input Selling Price" },
                // { type: "number", min: 0, message: "Price must be positive" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > getFieldValue("mrp")) {
                      return Promise.reject(
                        new Error("Selling price cannot be higher than MRP")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <div className="flex justify-end space-x-2">
              <Button onClick={closePriceUpdateModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update Prices
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default PartnerItemsList;
