import React, { useState, useEffect } from "react";
import {
  Table,
  Switch,
  Button,
  Modal,
  Input,
  Select,
  Upload,
  Card,
  Tabs,
  message,
  Space,
  Form,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps } from "antd/es/upload";
import BASE_URL from "../Config";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface PaymentStatus {
  id: string;
  paymentStatus: string;
  status: boolean;
}

interface OfferImage {
  id: string;
  imageUrl: string;
  status: boolean;
  webNavigation: string | null;
  mobileNavigation: string | null;
  targetParam: string | null;
}

interface ImageFormData {
  webNavigation: string;
  mobileNavigation: string;
  targetParam: string;
}

interface MinOrderAmount {
  orderAmount: number;
  id: string;
}

interface BMVDescription {
  id: string;
  discription: string;
}

const UpdateOffers: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentStatus[]>([]);
  const [offerImages, setOfferImages] = useState<OfferImage[]>([]);
  const [minOrderAmount, setMinOrderAmount] = useState<MinOrderAmount | null>(
    null
  );
  const [bmvDescriptions, setBmvDescriptions] = useState<BMVDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [orderAmountModalVisible, setOrderAmountModalVisible] = useState(false);
  const [bmvModalVisible, setBmvModalVisible] = useState(false);
  const [formData, setFormData] = useState({ paymentStatus: "", status: true });
  const [imageFormData, setImageFormData] = useState<ImageFormData>({
    webNavigation: "",
    mobileNavigation: "",
    targetParam: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentStatus | null>(
    null
  );
  const [editingBmvDescription, setEditingBmvDescription] =
    useState<BMVDescription | null>(null);
  const [newOrderAmount, setNewOrderAmount] = useState<number>(0);
  const [bmvDescriptionText, setBmvDescriptionText] = useState<string>("");
  const [isAddingBmvDescription, setIsAddingBmvDescription] =
    useState<boolean>(false);

  // Fetch payment status data
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/getCodAndOnlinePaymetStatus`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setPaymentData(data);
      } else {
        message.error("Invalid payment data received");
        setPaymentData([]);
      }
    } catch (error) {
      setPaymentData([]);
      message.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch offer images data
  const fetchOfferImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/getOfferImages`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setOfferImages(data);
      } else {
        message.error("Invalid offer image data received");
        setOfferImages([]);
      }
    } catch (error) {
      setOfferImages([]);
      message.error("Failed to fetch offer images");
    } finally {
      setLoading(false);
    }
  };

  const fetchMinOrderAmount = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/allMinimumOrders`
      );
      const data = await response.json();
      console.log("Fetched minimum order data:", data);
      if (data && data.orderAmount !== undefined && data.id) {
        setMinOrderAmount(data);
        setNewOrderAmount(data.orderAmount);
      } else {
        message.error("Invalid minimum order amount data received");
        setMinOrderAmount(null);
        setNewOrderAmount(0);
      }
    } catch (error) {
      console.error("Error fetching minimum order amount:", error);
      setMinOrderAmount(null);
      setNewOrderAmount(0);
      message.error("Failed to fetch minimum order amount");
    } finally {
      setLoading(false);
    }
  };

  // Fetch BMV descriptions data
  const fetchBmvDescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/allBmvDiscriptionData`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setBmvDescriptions(data);
      } else {
        message.error("Invalid BMV description data received");
        setBmvDescriptions([]);
      }
    } catch (error) {
      setBmvDescriptions([]);
      message.error("Failed to fetch BMV descriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchOfferImages();
    fetchMinOrderAmount();
    fetchBmvDescriptions();
  }, []);

  // Handle payment status toggle
  const handlePaymentStatusToggle = async (record: PaymentStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/onlineAndCodAtiveAndInactive`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: record.id,
            paymentStatus: record.paymentStatus,
            status: !record.status,
          }),
        }
      );

      if (response.ok) {
        message.success("Payment status updated successfully");
        fetchPaymentData();
      } else {
        message.error("Failed to update payment status");
      }
    } catch (error) {
      message.error("Error updating payment status");
    }
  };

  // Handle image status toggle
  const handleImageStatusToggle = async (record: OfferImage) => {
    try {
      const response = await fetch(
        `${BASE_URL}/product-service/imageinactiveAndActive`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: record.id,
            status: !record.status,
          }),
        }
      );

      if (response.ok) {
        message.success("Image status updated successfully");
        fetchOfferImages();
      } else {
        message.error("Failed to update image status");
      }
    } catch (error) {
      message.error("Error updating image status");
    }
  };

  // Handle minimum order amount update
  const handleOrderAmountUpdate = async () => {
    if (!minOrderAmount || !minOrderAmount.id) {
      message.error("No minimum order amount data available");
      return;
    }

    if (newOrderAmount <= 0) {
      message.error("Order amount must be greater than 0");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/order-service/minimumOrderAmountUpdate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: minOrderAmount.id,
            amount: newOrderAmount,
          }),
        }
      );

      if (response.ok) {
        message.success("Minimum order amount updated successfully");
        setOrderAmountModalVisible(false);
        await fetchMinOrderAmount();
      } else {
        const errorData = await response.text();
        message.error("Failed to update minimum order amount");
      }
    } catch (error) {
      console.error("Error updating minimum order amount:", error);
      message.error("Error updating minimum order amount");
    }
  };

  const handleBmvDescriptionUpdate = async () => {
    if (!bmvDescriptionText.trim()) {
      message.error("Description cannot be empty");
      return;
    }

    try {
      if (!isAddingBmvDescription && !editingBmvDescription?.id) {
        message.error("No BMV description selected for editing");
        return;
      }

      const payload: Record<string, any> = {
        discription: bmvDescriptionText.trim(),
      };

      if (!isAddingBmvDescription) {
        payload.id = editingBmvDescription?.id;
      }

      const response = await fetch(
        `${BASE_URL}/user-service/bmvDiscriptionUpdate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        message.success(
          `BMV description ${
            isAddingBmvDescription ? "added" : "updated"
          } successfully`
        );
        setBmvModalVisible(false);
        setEditingBmvDescription(null);
        setBmvDescriptionText("");
        setIsAddingBmvDescription(false);
        await fetchBmvDescriptions();
      } else {
        message.error(
          `Failed to ${
            isAddingBmvDescription ? "add" : "update"
          } BMV description`
        );
      }
    } catch (error) {
      console.error(
        `Error ${
          isAddingBmvDescription ? "adding" : "updating"
        } BMV description:`,
        error
      );
      message.error(
        `Error ${
          isAddingBmvDescription ? "adding" : "updating"
        } BMV description`
      );
    }
  };

  const handlePaymentSubmit = async (values: any) => {
    try {
      const url = editingPayment
        ? `${BASE_URL}/order-service/onlineAndCodAtiveAndInactive`
        : `${BASE_URL}/order-service/codAndOnlineStatusSaving`;

      const method = editingPayment ? "PATCH" : "POST";

      const body = editingPayment
        ? {
            id: editingPayment.id,
            paymentStatus: values.paymentStatus,
            status: values.status,
          }
        : {
            paymentStatus: values.paymentStatus,
            status: values.status,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        message.success(
          `Payment status ${editingPayment ? "updated" : "added"} successfully`
        );
        setPaymentModalVisible(false);
        setEditingPayment(null);
        setFormData({ paymentStatus: "", status: true });
        fetchPaymentData();
      } else {
        message.error(
          `Failed to ${editingPayment ? "update" : "add"} payment status`
        );
      }
    } catch (error) {
      message.error("Error saving payment status");
    }
  };

  // Handle image upload with additional fields
  const handleImageUpload = async () => {
    if (!selectedFile) {
      message.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("multiPart", selectedFile);
    formData.append("fileType", "kyc");

    // Pass null if fields are empty, otherwise pass the actual value
    formData.append(
      "webNavigation",
      imageFormData.webNavigation.trim() || "null"
    );
    formData.append(
      "mobileNavigation",
      imageFormData.mobileNavigation.trim() || "null"
    );
    formData.append("targetParam", imageFormData.targetParam.trim() || "null");

    try {
      const response = await fetch(
        `${BASE_URL}/product-service/offerImageUpload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Image uploaded successfully");
        setImageModalVisible(false);
        setSelectedFile(null);
        setImageFormData({
          webNavigation: "",
          mobileNavigation: "",
          targetParam: "",
        });
        fetchOfferImages();
      } else {
        message.error("Failed to upload image");
      }
    } catch (error) {
      message.error("Error uploading image");
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file);
      return false;
    },
    showUploadList: false,
  };

  // Payment status table columns
  const paymentColumns: ColumnsType<PaymentStatus> = [
    {
      title: "Payment Type",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handlePaymentStatusToggle(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setEditingPayment(record);
            setFormData({
              paymentStatus: record.paymentStatus,
              status: record.status,
            });
            setPaymentModalVisible(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  // Offer images table columns
  const imageColumns: ColumnsType<OfferImage> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 160,
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <img
            src={url}
            alt="Offer"
            className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
          />
        </a>
      ),
    },
    {
      title: "Web Navigation",
      dataIndex: "webNavigation",
      key: "webNavigation",
      width: 230,
      render: (text) => (
        <span className="text-gray-700">{text || "Not set"}</span>
      ),
    },
    {
      title: "Mobile Navigation",
      dataIndex: "mobileNavigation",
      key: "mobileNavigation",
      width: 220,
      render: (text) => (
        <span className="text-gray-700">{text || "Not set"}</span>
      ),
    },
    {
      title: "Target Param",
      dataIndex: "targetParam",
      key: "targetParam",
      width: 220,
      render: (text) => (
        <span className="text-gray-700">{text || "Not set"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleImageStatusToggle(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  // BMV descriptions table columns
  const bmvColumns: ColumnsType<BMVDescription> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 250,
      render: (text) => (
        <span className="font-mono text-sm text-gray-600">{text}</span>
      ),
    },
    {
      title: "Description Preview",
      dataIndex: "discription",
      key: "discription",
      render: (text) => (
        <div className="max-w-md">
          <div className="text-gray-800 line-clamp-3">
            {text.length > 100 ? `${text.substring(0, 100)}...` : text}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setIsAddingBmvDescription(false);
            setEditingBmvDescription(record);
            setBmvDescriptionText(record.discription);
            setBmvModalVisible(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Offer Images & Payment Types
          </h1>
        </div>

        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Payment Methods" key="1">
            <Card className="shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Payment Status Management
                </h2>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingPayment(null);
                    setFormData({ paymentStatus: "", status: true });
                    setPaymentModalVisible(true);
                  }}
                >
                  Add Payment Method
                </Button>
              </div>
              <Table
                columns={paymentColumns}
                dataSource={paymentData}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 50,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Offer Images" key="2">
            <Card className="shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Offer Images Management
                </h2>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setImageModalVisible(true)}
                >
                  Upload Image
                </Button>
              </div>
              <Table
                columns={imageColumns}
                dataSource={offerImages}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 50,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Min Order Amount" key="3">
            <Card className="shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Minimum Order Amount Management
                </h2>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    if (minOrderAmount) {
                      setNewOrderAmount(minOrderAmount.orderAmount);
                      setOrderAmountModalVisible(true);
                    }
                  }}
                  disabled={!minOrderAmount}
                >
                  Update Amount
                </Button>
              </div>

              {minOrderAmount ? (
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Current Minimum Order Amount
                      </h3>
                      <p className="text-gray-600 mb-4">
                        ID: {minOrderAmount.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 flex items-center">
                        <DollarOutlined className="mr-2" />₹
                        {minOrderAmount.orderAmount}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {loading
                      ? "Loading..."
                      : "No minimum order amount data available"}
                  </p>
                </div>
              )}
            </Card>
          </TabPane>

          <TabPane tab="BMV Descriptions" key="4">
            <Card className="shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  BMV Description Management
                </h2>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsAddingBmvDescription(true);
                    setEditingBmvDescription(null);
                    setBmvDescriptionText("");
                    setBmvModalVisible(true);
                  }}
                >
                  Add Description
                </Button>
              </div>
              <Table
                columns={bmvColumns}
                dataSource={bmvDescriptions}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </TabPane>
        </Tabs>

        {/* Payment Modal */}
        <Modal
          title={editingPayment ? "Edit Payment Method" : "Add Payment Method"}
          open={paymentModalVisible}
          onCancel={() => {
            setPaymentModalVisible(false);
            setEditingPayment(null);
            setFormData({ paymentStatus: "", status: true });
          }}
          footer={null}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type
              </label>
              <Select
                placeholder="Select payment type"
                className="w-full"
                value={formData.paymentStatus}
                onChange={(value) =>
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <Option value="COD">Cash on Delivery</Option>
                <Option value="ONLINE">Online Payment</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Switch
                checked={formData.status}
                onChange={(checked) =>
                  setFormData({ ...formData, status: checked })
                }
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  setPaymentModalVisible(false);
                  setEditingPayment(null);
                  setFormData({ paymentStatus: "", status: true });
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (formData.paymentStatus) {
                    handlePaymentSubmit(formData);
                  } else {
                    message.error("Please select payment type");
                  }
                }}
              >
                {editingPayment ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Image Upload Modal */}
        <Modal
          title="Upload Offer Image"
          open={imageModalVisible}
          onCancel={() => {
            setImageModalVisible(false);
            setSelectedFile(null);
            setImageFormData({
              webNavigation: "",
              mobileNavigation: "",
              targetParam: "",
            });
          }}
          footer={null}
          width={600}
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="large">
                  {selectedFile ? "Change Image" : "Select Image"}
                </Button>
              </Upload>
              {selectedFile && (
                <p className="text-green-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
              <p className="text-gray-500 mt-2">
                Choose an offer image to upload{" "}
                <span className="font-bold">(Below 1MB)</span>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web Navigation
                </label>
                <Input
                  placeholder="Enter web navigation URL or path"
                  value={imageFormData.webNavigation}
                  onChange={(e) =>
                    setImageFormData({
                      ...imageFormData,
                      webNavigation: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Navigation
                </label>
                <Input
                  placeholder="Enter mobile navigation URL or path"
                  value={imageFormData.mobileNavigation}
                  onChange={(e) =>
                    setImageFormData({
                      ...imageFormData,
                      mobileNavigation: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Parameter
                </label>
                <Input
                  placeholder="Enter target parameter"
                  value={imageFormData.targetParam}
                  onChange={(e) =>
                    setImageFormData({
                      ...imageFormData,
                      targetParam: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  setImageModalVisible(false);
                  setSelectedFile(null);
                  setImageFormData({
                    webNavigation: "",
                    mobileNavigation: "",
                    targetParam: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleImageUpload}
                disabled={!selectedFile}
              >
                Upload Image
              </Button>
            </div>
          </div>
        </Modal>

        {/* Order Amount Update Modal */}
        <Modal
          title="Update Minimum Order Amount"
          open={orderAmountModalVisible}
          onCancel={() => {
            setOrderAmountModalVisible(false);
            setNewOrderAmount(minOrderAmount?.orderAmount || 0);
          }}
          footer={null}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Amount: ₹{minOrderAmount?.orderAmount || 0}
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Minimum Order Amount (₹)
              </label>
              <InputNumber
                placeholder="Enter new minimum order amount"
                className="w-full"
                value={newOrderAmount}
                onChange={(value) => setNewOrderAmount(value || 0)}
                min={1}
                precision={0}
                size="large"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  setOrderAmountModalVisible(false);
                  setNewOrderAmount(minOrderAmount?.orderAmount || 0);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleOrderAmountUpdate}
                disabled={newOrderAmount <= 0}
              >
                Update Amount
              </Button>
            </div>
          </div>
        </Modal>

        {/* BMV Description Modal */}
        <Modal
          title={
            isAddingBmvDescription
              ? "Add BMV Description"
              : "Update BMV Description"
          }
          open={bmvModalVisible}
          onCancel={() => {
            setBmvModalVisible(false);
            setEditingBmvDescription(null);
            setBmvDescriptionText("");
            setIsAddingBmvDescription(false);
          }}
          footer={null}
          width={800}
        >
          <div className="space-y-4">
            {!isAddingBmvDescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description ID: {editingBmvDescription?.id}
                </label>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description Content
              </label>
              <TextArea
                placeholder="Enter BMV description content"
                value={bmvDescriptionText}
                onChange={(e) => setBmvDescriptionText(e.target.value)}
                rows={15}
                showCount
                maxLength={5000}
              />
              <p className="text-gray-500 text-sm mt-1">
                You can use Markdown formatting for better presentation
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  setBmvModalVisible(false);
                  setEditingBmvDescription(null);
                  setBmvDescriptionText("");
                  setIsAddingBmvDescription(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleBmvDescriptionUpdate}
                disabled={!bmvDescriptionText.trim()}
              >
                {isAddingBmvDescription
                  ? "Add Description"
                  : "Update Description"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateOffers;
