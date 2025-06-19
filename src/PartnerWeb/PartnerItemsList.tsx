import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  Form,
  message,
  Button,
  Tag,
  Spin,
  Select,
  Upload,
} from "antd";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  itemBuyingPrice?: number;
}

interface ImageData {
  itemId: string;
  list: { images: string }[];
}

const { Option } = Select;

const PartnerItemsList: React.FC = () => {
  const [form] = Form.useForm();
  const [imageForm] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlForm] = Form.useForm();
  const [priceUpdateModal, setPriceUpdateModal] = useState<{
    visible: boolean;
    item: Item | null;
  }>({
    visible: false,
    item: null,
  });

  const [imageUpdateModal, setImageUpdateModal] = useState<{
    visible: boolean;
    item: Item | null;
    images: string[];
  }>({
    visible: false,
    item: null,
    images: [],
  });

  const openPriceUpdateModal = (item: Item) => {
    form.resetFields();
    setPriceUpdateModal({ visible: true, item });

    form.setFieldsValue({
      mrp: item.itemMrp,
      price: item.itemPrice,
      buyingPrice: item.itemBuyingPrice,
    });
  };

  const closePriceUpdateModal = () => {
    form.resetFields();
    setPriceUpdateModal({ visible: false, item: null });
  };

  const openImageUpdateModal = async (item: Item) => {
    try {
      const response = await axios.get<ImageData>(
        `${BASE_URL}/product-service/imagePriceBasedOnItemId?itemId=${item.itemId}`,
        {
          headers: { accept: "*/*" },
        }
      );
      setImageUpdateModal({
        visible: true,
        item,
        images: response.data.list.map((img) => img.images),
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Failed to fetch item images");
    }
  };

  const closeImageUpdateModal = () => {
    imageForm.resetFields();
    urlForm.resetFields();
    setImageUpdateModal({ visible: false, item: null, images: [] });
    setUrls([]);
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
      }));

      setItems(transformedItems);
      setFilteredItems(transformedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = item.itemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const itemStatus = item.active === true ? "active" : "inactive";
      const matchesStatus =
        statusFilter === "all" || itemStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredItems(filtered);
  }, [searchTerm, statusFilter, items]);

  const handlePriceUpdate = async (values: any) => {
    if (!priceUpdateModal.item) return;
    const { mrp, price, buyingPrice } = values;
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
        itemBuyingPrice: parseFloat(buyingPrice),
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

  const handleImageUpload = async (values: any) => {
    if (!imageUpdateModal.item) return;
    try {
      const formData = new FormData();

      // Add fileType to form data body instead of query params
      formData.append("fileType", "kyc");

      values.images.fileList.forEach((file: any) => {
        formData.append("multiPart", file.originFileObj);
      });

      await axios.patch(
        `${BASE_URL}/product-service/imagePriceUpload?itemId=${imageUpdateModal.item.itemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageUpdateModal({ visible: false, item: null, images: [] });
      message.success("Images uploaded successfully");
      fetchItems();
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error("Failed to upload images");
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

  const handleUrlAdd = () => {
    const trimmed = urlInput.trim();

    const isValid =
      /^https?:\/\/[^\s$.?#].[^\s]*$/.test(trimmed) && !urls.includes(trimmed);

    if (trimmed && isValid) {
      setUrls((prev) => [...prev, trimmed]);
      setUrlInput(""); // clear input
    }
  };

  const handleUrlRemove = (urlToRemove: string) => {
    setUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleUrlSubmit = async () => {
    try {
      const payload = {
        goldUrls: urls,
        itemId: imageUpdateModal.item?.itemId || "",
      };

      const response = await fetch(`${BASE_URL}/product-service/goldPrice`, {
        method: "PATCH",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update URLs");

      console.log("URLs updated successfully:", await response.json());
      setUrls([]);
      setUrlInput(""); // clear input on success
    } catch (error) {
      console.error("Error updating URLs:", error);
    }
  };
  return (
    <div className="mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h3 className="text-2xl font-semibold text-gray-800">
          Items Management
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 w-full md:w-auto">
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            className="w-full sm:w-40"
            size="middle"
          >
            <Option value="all">All</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          <Input
            prefix={<SearchOutlined />}
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 z-50">
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col"
          >
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

            {/* Responsive Button Layout */}
            <div className="p-1 flex flex-col gap-2 mt-auto">
              {/* Update Price Button - Always full width at top */}
              <Button
                onClick={() => openPriceUpdateModal(item)}
                className="w-full text-xs sm:text-sm"
                type="primary"
                size="small"
                style={{
                  backgroundColor: "#0958d9",
                  borderColor: "#0958d9",
                }}
              >
                Update Price
              </Button>

              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 min-h-0">
                  <Button
                    onClick={() => confirmStatusToggle(item)}
                    className="w-full text-xs truncate min-w-0"
                    size="small"
                    style={{
                      backgroundColor:
                        item.active === false ? undefined : "#22c55e",
                      color: item.active === false ? undefined : "white",
                      borderColor:
                        item.active === false ? undefined : "#22c55e",
                    }}
                    danger={item.active === false}
                    type="default"
                  >
                    {item.active === false ? "Deactive" : "Active"}
                  </Button>

                  <Button
                    onClick={() => openImageUpdateModal(item)}
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium shadow-md transition text-xs truncate min-w-0"
                    size="small"
                    type="default"
                  >
                    Images
                  </Button>
                </div>
              </div>
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
              buyingPrice: priceUpdateModal.item.itemBuyingPrice,
            }}
            onFinish={handlePriceUpdate}
          >
            <Form.Item
              name="mrp"
              label="MRP"
              rules={[{ required: true, message: "Please input MRP" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Selling Price"
              rules={[
                { required: true, message: "Please input Selling Price" },
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
            <Form.Item
              name="buyingPrice"
              label="Buying Price"
              rules={[
                { required: false, message: "Please input Buying price" },
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

      <Modal
        title="Update Images and URLs For Comparison"
        open={imageUpdateModal.visible}
        onCancel={closeImageUpdateModal}
        footer={null}
        width={600}
      >
        {imageUpdateModal.item && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Current Images:</h4>
              {imageUpdateModal.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {imageUpdateModal.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto max-h-32 object-contain rounded border border-gray-300 shadow-sm"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No images available</p>
              )}
            </div>

            <Form
              form={imageForm}
              onFinish={handleImageUpload}
              className="space-y-4"
            >
              <Form.Item
                name="images"
                label="Upload New Images"
                rules={[
                  {
                    required: true,
                    message: "Please upload at least one image",
                  },
                ]}
              >
                <Upload
                  accept="image/*"
                  multiple
                  beforeUpload={() => false}
                  listType="picture"
                  maxCount={5}
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
              <div className="flex justify-end space-x-2">
                <Button onClick={closeImageUpdateModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Upload Images
                </Button>
              </div>
            </Form>

            <Form
              form={urlForm}
              onFinish={handleUrlSubmit}
              className="mt-5 space-y-4"
            >
              <div>
                <h4 className="text-sm font-medium mb-2">Added URLs:</h4>
                {urls.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {urls.map((url, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => handleUrlRemove(url)}
                        className="max-w-[300px] truncate flex items-center bg-blue-100 px-2 py-1 rounded-full text-xs"
                      >
                        {url}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No URLs added yet</p>
                )}
                <Form.Item label="Add URLs">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter URL"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onPressEnter={(e) => {
                        e.preventDefault();
                        handleUrlAdd();
                      }}
                    />
                    <Button onClick={handleUrlAdd}>Add</Button>
                  </div>
                </Form.Item>
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={urls.length === 0}
                >
                  Submit URLs
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PartnerItemsList;
