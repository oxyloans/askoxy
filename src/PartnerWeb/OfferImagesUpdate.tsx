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
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps } from "antd/es/upload";
import BASE_URL from "../Config";

const { TabPane } = Tabs;
const { Option } = Select;

interface PaymentStatus {
  id: string;
  paymentStatus: string;
  status: boolean;
}

interface OfferImage {
  id: string;
  imageUrl: string;
  status: boolean;
}

const UpdateOffers: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentStatus[]>([]);
  const [offerImages, setOfferImages] = useState<OfferImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [formData, setFormData] = useState({ paymentStatus: "", status: true });
  const [editingPayment, setEditingPayment] = useState<PaymentStatus | null>(
    null
  );

  // Fetch payment status data
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/getCodAndOnlinePaymetStatus`
      );
      const data = await response.json();
      setPaymentData(data);
    } catch (error) {
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
      setOfferImages(data);
    } catch (error) {
      message.error("Failed to fetch offer images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchOfferImages();
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

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("multiPart", file);
    formData.append("fileType", "kyc");

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
      handleImageUpload(file);
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
      render: (url) => (
        <img
          src={url}
          alt="Offer"
          className="w-16 h-16 object-cover rounded-lg shadow-sm"
        />
      ),
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 truncate max-w-xs block"
        >
          {url}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
                  pageSize: 10,
                  showSizeChanger: true,
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
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
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
          onCancel={() => setImageModalVisible(false)}
          footer={null}
        >
          <div className="text-center py-8">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} size="large">
                Select Image
              </Button>
            </Upload>
            <p className="text-gray-500 mt-4">
              Choose an offer image to upload <span className="font-bold">(Below 1MB).</span>
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateOffers;
