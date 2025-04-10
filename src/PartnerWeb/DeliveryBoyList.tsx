import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  message,
  Spin,
  Card,
  Button,
  Empty,
  Input,
  Modal,
  Form,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  FileSearchOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import { useNavigate, useNavigation } from "react-router-dom";

interface DeliveryBoy {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  alterMobileNumber: string;
  isActive: string;
  testUser: boolean;
}

const DeliveryBoyList: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [filteredDeliveryBoys, setFilteredDeliveryBoys] = useState<
    DeliveryBoy[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DeliveryBoy[]>(
        `${BASE_URL}/user-service/deliveryBoyList`
      );

      const filteredDeliveryBoys = response.data.filter((boy) => !boy.testUser);

      setDeliveryBoys(filteredDeliveryBoys);
      setFilteredDeliveryBoys(filteredDeliveryBoys);
      setLoading(false);

      if (filteredDeliveryBoys.length === 0) {
        message.info("No delivery boys found");
      }
    } catch (err) {
      setLoading(false);
      message.error("Unable to load delivery boys. Please try again later.");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const filtered = deliveryBoys.filter(
      (boy) =>
        `${boy.firstName} ${boy.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        boy.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDeliveryBoys(filtered);

    if (filtered.length === 0) {
      message.info("No delivery boys match your search");
    }
  };

  const confirmStatusChange = (boy: DeliveryBoy) => {
    Modal.confirm({
      title: `Are you sure you want to ${
        boy.isActive === "true" ? "deactivate" : "activate"
      } this delivery boy?`,
      content: "This action will change the delivery boy's status.",
      okText: "Yes",
      cancelText: "No",
      onOk: () =>
        updateDeliveryBoyStatus(
          boy.userId,
          boy.isActive === "true" ? false : true
        ),
    });
  };

  const updateDeliveryBoyStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await axios.patch(`${BASE_URL}/user-service/status`, {
        id: id,
        isActive: isActive.toString(),
      });

      if (response.status === 200) {
        message.success(
          `Delivery boy status updated to ${isActive ? "Active" : "Inactive"}`
        );
        fetchDeliveryBoys();
      } else {
        message.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      message.error("Failed to update status. Please try again.");
    }
  };

  const handleUpdateDeliveryBoy = (boy: DeliveryBoy) => {
    setSelectedDeliveryBoy(boy);
    form.setFieldsValue({
      firstName: boy.firstName,
      lastName: boy.lastName,
      email: boy.email,
      whatsappNumber: boy.whatsappNumber,
      alterMobileNumber: boy.alterMobileNumber,
    });
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    setUpdateLoading(true);
    try {
      const values = await form.validateFields();

      const payload = {
        id: selectedDeliveryBoy?.userId,
        userFirstName: values.firstName,
        userLastName: values.lastName,
        whatsappNumber: values.whatsappNumber,
        alterMobileNumber: values.alterMobileNumber,
        customerEmail: values.email,
      };
      const response = await axios.patch(
        `${BASE_URL}/user-service/update`,
        payload
      );

      if (response.status === 200) {
        message.success("Delivery boy updated successfully");
        setIsUpdateModalVisible(false);
        fetchDeliveryBoys();
      } else {
        message.error(
          "Unable to update deliveryBoy. Please try after some time"
        );
      }
    } catch (error) {
      message.error("Failed to update delivery boy. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleViewOrders = (boy: DeliveryBoy) => {
    // message.info(`Viewing orders for ${boy.firstName} ${boy.lastName}`);
    localStorage.setItem("dbId", boy.userId);
    const name = boy.firstName + boy.lastName;
    localStorage.setItem("dbName", name);

    navigate(`/home/dbOrderList`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading delivery boys..." />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <Typography.Title level={2} className="mb-0">
              Delivery Boys
            </Typography.Title>

            {deliveryBoys.length > 0 && (
              <div className="flex items-center space-x-2">
                <Typography.Text type="secondary" className="hidden sm:inline">
                  Total: {filteredDeliveryBoys.length} delivery boys
                </Typography.Text>
                <Input
                  placeholder="Search Name or Email"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-48 sm:w-64"
                />
              </div>
            )}

            {deliveryBoys.length > 0 && (
              <Typography.Text type="secondary" className="sm:hidden">
                Total: {filteredDeliveryBoys.length} delivery boys
              </Typography.Text>
            )}
          </div>
        </div>

        {filteredDeliveryBoys.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen p-4">
            <Empty
              image={<FileSearchOutlined className="text-6xl text-gray-400" />}
              description={
                <Typography.Text type="secondary">
                  {searchTerm
                    ? "No Delivery Boys Found"
                    : "No Delivery Boys Available"}
                </Typography.Text>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveryBoys.map((deliveryBoy) => (
              <Card
                key={deliveryBoy.userId}
                className="w-full border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                bordered={false}
              >
                <div className="flex flex-col space-y-4">
                  {/* User ID and Orders Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>
                      User ID: #
                      <span className="text-purple-900 text-xl">
                        {deliveryBoy.userId.slice(-4)}
                      </span>
                    </Typography.Text>
                    <Button
                      type="default"
                      className="ml-2 bg-purple-400 hover:bg-purple-800 text-white"
                      onClick={() => handleViewOrders(deliveryBoy)}
                    >
                      View Orders
                    </Button>
                  </div>

                  {/* Name Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text type="secondary">Name</Typography.Text>
                    <Typography.Text strong style={{ color: "#722ed1" }}>
                      {`${deliveryBoy.firstName} ${deliveryBoy.lastName}`}
                    </Typography.Text>
                  </div>

                  {/* Email Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>Email</Typography.Text>
                    <Typography.Text>
                      {deliveryBoy.email || "N/A"}
                    </Typography.Text>
                  </div>

                  {/* WhatsApp Number Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>MobileNumber</Typography.Text>
                    <Typography.Text>
                      {deliveryBoy.whatsappNumber || "N/A"}
                    </Typography.Text>
                  </div>

                  {/* Status Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>Status</Typography.Text>
                    <Typography.Text
                      type={
                        deliveryBoy.isActive === "true" ? "success" : "danger"
                      }
                    >
                      {deliveryBoy.isActive === "true" ? "Active" : "Inactive"}
                    </Typography.Text>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-auto">
                    <Button
                      type="primary"
                      danger={deliveryBoy.isActive === "true"}
                      style={{
                        backgroundColor:
                          deliveryBoy.isActive === "true"
                            ? "#ff4d4f"
                            : "#52c41a",
                        borderColor:
                          deliveryBoy.isActive === "true"
                            ? "#ff4d4f"
                            : "#52c41a",
                      }}
                      className="flex-1"
                      onClick={() => confirmStatusChange(deliveryBoy)}
                    >
                      {deliveryBoy.isActive === "true"
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      className="flex-1"
                      onClick={() => handleUpdateDeliveryBoy(deliveryBoy)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Update Delivery Boy"
        open={isUpdateModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={() => setIsUpdateModalVisible(false)}
        okButtonProps={{ loading: updateLoading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="whatsappNumber"
            label="WhatsApp Number"
            rules={[
              { required: true, message: "Please enter WhatsApp number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="alterMobileNumber "
            label="Alter MobileNumber"
            rules={[{ message: "Please enter alter mobile number!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeliveryBoyList;
