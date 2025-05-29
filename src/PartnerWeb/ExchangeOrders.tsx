import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Space,
  Typography,
  Spin,
  Button,
  message,
  Modal,
  Radio,
  Empty,
  Select,
  Form,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, RefreshCw } from "lucide-react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";

// Define the type for exchange order data
interface ExchangeOrder {
  orderId: string;
  orderId2: string;
  userId: string | null;
  itemId: string | null;
  itemName: string;
  itemPrice: number;
  userName: string;
  orderType: string | null;
  reason: string;
  exchangeRequestDate: string;
  daysDifference: number;
  mobileNumber: string;
  orderAddress: string;
  exchangeId: string;
  status: string;
}
type DeliveryBoy = {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
};

const { Title } = Typography;

const ExchangeOrdersPage = () => {
  const navigate = useNavigate();
  const [exchangeOrders, setExchangeOrders] = useState<ExchangeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<ExchangeOrder | null>(
    null
  );
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<ExchangeOrder[]>([]);
  const [takingNewBag, setTakingNewBag] = useState<string | null>(null);
  const [newBagBarcode, setNewBagBarcode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    newBagBarcodes:"",
    returnBagWeight: "",
    amountCollected: "",
    remarks: "",
  });
  // New state for status filter
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const fetchExchangeOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/order-service/getAllExchangeOrder`
      );
      const data = await response.json();
      setExchangeOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeOrders();
  }, []);

  const fetchDeliveryBoys = async (record: ExchangeOrder) => {
    setSelectedRecord(record);
    setdbLoading1(true);
    try {
      const url = `${BASE_URL}/user-service/deliveryBoyList`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        message.error(
          "Failed to get DilveryBoy list please try after sometime."
        );
      }
      const data = await response.json();
      setDeliveryBoys(data);
      setdbModalVisible(true);
    } catch (error) {
      message.warning(
        "Failed to get DilveryBoy list please try after sometime."
      );
    } finally {
      setdbLoading1(false);
    }
  };

  const handleViewDetails = (order: ExchangeOrder) => {
    localStorage.setItem("orderId", order.orderId2);
    navigate(`/home/orderDetails`);
  };

  useEffect(() => {
    let results = exchangeOrders;

    // Apply search filter
    if (searchText !== "") {
      results = results.filter((order) =>
        order.orderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      results = results.filter((order) => {
        if (selectedStatus === "Pending") return order.status === "EXCHANGEREQUESTED";
        if (selectedStatus === "Assigned") return order.status === "ASSIGNTOCOLLECT";
        if (selectedStatus === "Delivered") return order.status === "RECOMPLETED";
        return true;
      });
    }

    setFilteredOrders(results);
  }, [searchText, exchangeOrders, selectedStatus]);

  const columns: ColumnsType<ExchangeOrder> = [
    {
      title: "Customer Info",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      render: (orderId: string, record: ExchangeOrder) => (
        <div className="flex flex-col items-start gap-1">
          <a
            onClick={() => handleViewDetails(record)}
            className="text-blue-600 font-semibold hover:underline text-lg"
          >
            {orderId}
          </a>
          <div className="text-gray-700 text-sm">{record.userName}</div>
          <div className="flex flex-wrap gap-2 mt-1 text-xs">
            {record.mobileNumber.trim() && (
              <Tag color="blue" className="px-2 py-0.5 rounded-full text-xs">
                {record.mobileNumber}
              </Tag>
            )}
            {record.status && (
              <div className="px-2 py-0.5 bg-green-100 text-green-800 border border-green-200 rounded-full font-medium">
                {{
                  RECOMPLETED: "Delivered",
                  EXCHANGEREQUESTED: "Pending",
                  ASSIGNTOCOLLECT: "Assigned",
                }[record.status] || record.status}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Item Details",
      key: "itemDetails",
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-sm">{record.itemName}</span>
          <span className="text-xs text-red-600">₹{record.itemPrice}</span>
        </div>
      ),
    },
    {
      title: "Address",
      key: "address",
      width: 200,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-sm">{record.orderAddress}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "reason",
      width: 80,
      render: (_: any, record: ExchangeOrder) => {
        return (
          <div className="flex flex-wrap gap-2 justify-start">
            {record.status === "EXCHANGEREQUESTED" && (
              <Button
                type="primary"
                size="small"
                className="!bg-green-500 hover:!bg-green-600 text-white px-2 py-1 rounded-lg text-xs h-auto w-auto sm:w-auto"
                onClick={() => fetchDeliveryBoys(record)}
              >
                Re-Assign
              </Button>
            )}
            <Button
              type="primary"
              className="rounded-lg text-sm h-auto sm:w-auto px-2 py-1 w-full sm:mr-2"
              size="small"
              onClick={() => {
                showModal(record);
              }}
            >
              Details
            </Button>
          </div>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 150,
    },
    {
      title: "Request Date",
      dataIndex: "exchangeRequestDate",
      key: "exchangeRequestDate",
      width: 120,
      render: (date: string, record) => {
        const parsedDate = new Date(date);
        const formattedDate = `${parsedDate.toLocaleString("en-US", {
          month: "short",
        })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;

        return (
          <div className="relative min-h-[60px]">
            <div className="pt-7">
              <div>
                <span>{formattedDate}</span>
              </div>
              <div>
                <strong>Diff :</strong>{" "}
                <span
                  className={
                    record.daysDifference <= 3
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {record.daysDifference}
                </span>
                <span> days</span>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const handleCancelCLick = () => {
    setTakingNewBag(null);
    setNewBagBarcode("");
    setdbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  const handleAssign = async (exchangeId: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setdbLoading(true);
    let data = {
      collectedNewBag: takingNewBag,
      exchangeId: exchangeId,
      deliveryBoyId: selectedDeliveryBoy.userId,
      newBagBarCode: newBagBarcode === "" ? null : newBagBarcode,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/order-service/exchangeBagCollect`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        message.error("Failed to assign to delveryboy");
      } else {
        message.success("Order assigned successfully!");
        setdbModalVisible(false);
      }
    } catch (error) {
      message.error("Failed to assign order.");
    } finally {
      setdbLoading(false);
      setdbModalVisible(false);
      setSelectedDeliveryBoy(null);
      setTakingNewBag(null);
      setNewBagBarcode("");
    }
  };

  const showModal = (record: ExchangeOrder) => {
    console.log({ record });
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      newBagBarcodes:"",
      returnBagWeight: "",
      amountCollected: "",
      remarks: "",
    });
    setIsModalOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOk = async () => {
    const requestData = {
      amountCollected: formData.amountCollected,
      exchangeId: selectedRecord?.exchangeId,
      remarks: formData.remarks,
      returnBagWeight: formData.returnBagWeight,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/order-service/exchangeOrderReassign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        message.success("Data submitted successfully!");
        setIsModalOpen(false);
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      message.error("Something went wrong!");
    } finally {
      handleCancel();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Title level={4} className="mb-4 md:mb-0">
          Exchange Orders
        </Title>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Search className="text-gray-400" size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Pending", "Assigned", "Delivered"].map((status) => (
          <Button
            key={status}
            type={selectedStatus === status ? "primary" : "default"}
            onClick={() => setSelectedStatus(status)}
            className={`${
              selectedStatus === status
                ? "!bg-blue-500 hover:!bg-blue-600"
                : "!bg-gray-100 hover:!bg-gray-200"
            } !text-sm !px-4 !py-1 !rounded-full`}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey={(record, index) => `${record.orderId}_${index}`}
            pagination={{ pageSize: 50, showSizeChanger: false }}
            className="max-w-full"
            scroll={{ x: "max-content" }}
            bordered
          />
        </div>
      )}

      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={handleCancelCLick}
        footer={[
          <Button key="cancel" onClick={handleCancelCLick}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            loading={dbLoading}
            onClick={() => {
              if (!selectedDeliveryBoy) {
                message.error("Please select a delivery boy");
                return;
              }
              if (takingNewBag === undefined) {
                message.error(
                  "Please select if delivery boy is taking a new bag"
                );
                return;
              }
              if (takingNewBag === "yes" && !newBagBarcode) {
                message.error("Please enter the new bag barcode");
                return;
              }

              handleAssign(selectedRecord?.exchangeId ?? "");
            }}
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Select Delivery Boy <span className="text-red-500">*</span>
              </label>
              <Radio.Group
                onChange={(e) => {
                  const selectedBoy = deliveryBoys.find(
                    (boy) => boy.userId === e.target.value
                  );
                  setSelectedDeliveryBoy(selectedBoy);
                }}
                value={selectedDeliveryBoy?.userId}
              >
                <Space direction="vertical">
                  {deliveryBoys
                    .filter((boy) => boy.isActive === "true")
                    .map((boy) => (
                      <Radio key={boy.userId} value={boy.userId}>
                        {`${boy.firstName} ${boy.lastName} (${boy.whatsappNumber})`}
                      </Radio>
                    ))}
                </Space>
              </Radio.Group>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Taking New Bag <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Select option"
                style={{ width: "100%" }}
                onChange={setTakingNewBag}
                value={takingNewBag}
              >
                <Select.Option value="yes">Yes</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>
            </div>

            {takingNewBag === "yes" && (
              <div>
                <label className="block mb-2 font-medium">
                  New Bag Barcode <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter barcode"
                  value={newBagBarcode}
                  onChange={(e) => setNewBagBarcode(e.target.value)}
                  maxLength={13}
                />
              </div>
            )}
          </div>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>
      <Modal
        title="Update Return Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form layout="vertical" className="space-y-4">
          <Form.Item label="Return Bag Quantity">
            <Input
              name="returnBagWeight"
              value={formData.returnBagWeight}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="!rounded-lg"
            />
          </Form.Item>
          <Form.Item label="New Bag Barcode">
            <Input
              name="newBagBarcodes"
              value={formData.amountCollected}
              onChange={handleChange}
              placeholder="Enter barcode"
              className="!rounded-lg"
            />
          </Form.Item>

          <Form.Item label="Amount Collected">
            <Input
              name="amountCollected"
              value={formData.amountCollected}
              onChange={handleChange}
              placeholder="Enter amount"
              className="!rounded-lg"
            />
          </Form.Item>

          <Form.Item label="Remarks">
            <Input.TextArea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              className="!rounded-lg"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExchangeOrdersPage;