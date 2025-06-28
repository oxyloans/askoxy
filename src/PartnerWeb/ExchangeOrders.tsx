import React, { useState, useEffect, useRef } from "react";
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
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, Package, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdCurrencyRupee, MdScale } from "react-icons/md";
import {
  ExchangeOrder,
  DeliveryBoy,
  fetchExchangeOrders,
  fetchDeliveryBoys,
  assignExchangeOrder,
  reassignExchangeOrder,
} from "./partnerapi";

const { Title } = Typography;

const ExchangeOrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const [exchangeOrders, setExchangeOrders] = useState<ExchangeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<ExchangeOrder | null>(
    null
  );
  const [dbLoading1, setDbLoading1] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setDbModalVisible] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<ExchangeOrder[]>([]);
  const [takingNewBag, setTakingNewBag] = useState<string | null>(null);
  const [newBagBarcode, setNewBagBarcode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    newBagBarcodes: "",
    returnBagWeight: "",
    amountCollected: "",
    remarks: "",
    deliveryBoyId: "",
    amountPaid: "",
  });
  const [showValidation, setShowValidation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch exchange orders on component mount
  useEffect(() => {
    loadExchangeOrders();
  }, []);

  const loadExchangeOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchExchangeOrders();
      setExchangeOrders(data);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch exchange orders.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    loadExchangeOrders();
  };

  useEffect(() => {
    let results = exchangeOrders;

    if (searchText !== "") {
      results = results.filter((order) =>
        order.orderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "All") {
      results = results.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(results);
  }, [searchText, exchangeOrders, selectedStatus]);

  // Restore scroll position after orders are loaded
  useEffect(() => {
    if (!loading && filteredOrders.length > 0) {
      const savedOrderId = localStorage.getItem("orderId");
      if (savedOrderId) {
        // Find the index of the order in filteredOrders
        const orderIndex = filteredOrders.findIndex(
          (order) => order.orderId2 === savedOrderId
        );
        if (orderIndex !== -1) {
          const rowKey = `${filteredOrders[orderIndex].orderId}_${orderIndex}`;
          const targetRow = document.querySelector(`[data-row-key="${rowKey}"]`);
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
            localStorage.removeItem("orderId");
          }
        } else {
          // Check the full exchangeOrders array for pagination
          const fullOrderIndex = exchangeOrders.findIndex(
            (order) => order.orderId2 === savedOrderId
          );
          if (fullOrderIndex !== -1) {
            // Calculate the target page (1-based indexing for Ant Design Table)
            const targetPage = Math.ceil((fullOrderIndex + 1) / pagination.pageSize);
            setPagination((prev) => ({ ...prev, current: targetPage }));
            // Wait for the table to update to the correct page
            setTimeout(() => {
              const updatedRowKey = `${exchangeOrders[fullOrderIndex].orderId}_${fullOrderIndex}`;
              const updatedRow = document.querySelector(
                `[data-row-key="${updatedRowKey}"]`
              );
              if (updatedRow) {
                updatedRow.scrollIntoView({ behavior: "smooth", block: "center" });
              }
              localStorage.removeItem("orderId");
            }, 0);
          } else {
            message.info(
              "The previously viewed exchange order is not visible in the current view."
            );
            localStorage.removeItem("orderId");
          }
        }
      }
    }
  }, [loading, filteredOrders, exchangeOrders, pagination.pageSize]);

  const fetchDeliveryBoysList = async (record?: ExchangeOrder) => {
    if (record) {
      setSelectedRecord(record);
    }
    setDbLoading1(true);
    try {
      const data = await fetchDeliveryBoys();
      setDeliveryBoys(data);
      if (record) {
        setDbModalVisible(true);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to fetch delivery boys.");
    } finally {
      setDbLoading1(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchDeliveryBoysList();
    }
  }, [isModalOpen]);

  const handleViewDetails = (order: ExchangeOrder) => {
    localStorage.setItem("orderId", order.orderId2);
    navigate(`/home/orderDetails`);
  };

  const calculateUsedBagAmount = (
    originalWeight: string,
    remainingWeight: string,
    price: number
  ) => {
    const originalWeightNum = parseFloat(originalWeight);
    const remainingWeightNum = parseFloat(remainingWeight);

    if (
      originalWeightNum <= 0 ||
      remainingWeightNum < 0 ||
      price <= 0 ||
      isNaN(remainingWeightNum)
    ) {
      return "0.00";
    }

    const usedWeight = originalWeightNum - remainingWeightNum;
    if (usedWeight < 0) return "0.00";

    const pricePerKg = price / originalWeightNum;
    const usedBagAmount = usedWeight * pricePerKg;

    return usedBagAmount.toFixed(2);
  };

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
                {record.status}
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
          <div className="flex gap-2 text-xs text-gray-700 mt-1 items-center">
            {record.itemPrice && (
              <span className="flex items-center text-red-600 font-medium text-xs">
                ₹{record.itemPrice}
              </span>
            )}
            {record.weight && (
              <span className="flex items-center">
                weight: {record.weight} kgs
              </span>
            )}
          </div>
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
      key: "action",
      width: 80,
      render: (_: any, record: ExchangeOrder) => (
        <div className="flex flex-wrap gap-2 justify-start">
          {record.status === "EXCHANGEREQUESTED" && (
            <Button
              type="primary"
              size="small"
              className="!bg-green-500 hover:!bg-green-600 text-white px-2 py-1 rounded-lg text-xs h-auto w-auto sm:w-auto"
              onClick={() => fetchDeliveryBoysList(record)}
            >
              Assign
            </Button>
          )}
          {record.status === "ASSIGNTOCOLLECT" && (
            <Button
              type="primary"
              size="small"
              className="!bg-green-500 hover:!bg-green-600 text-white px-2 py-1 rounded-lg text-xs h-auto w-auto sm:w-auto"
              onClick={() => fetchDeliveryBoysList(record)}
            >
              Re-Assign
            </Button>
          )}
          <Button
            type="primary"
            className="rounded-lg text-sm h-auto sm:w-auto px-2 py-1 w-full sm:mr-2"
            size="small"
            onClick={() => showModal(record)}
          >
            Details
          </Button>
        </div>
      ),
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
                <strong>Diff:</strong>{" "}
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

  const handleCancelClick = () => {
    setTakingNewBag(null);
    setNewBagBarcode("");
    setDbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  const handleAssign = async (exchangeId: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    if (!takingNewBag) {
      message.warning("Please select New Bag status.");
      return;
    }
    setDbLoading(true);
    try {
      await assignExchangeOrder(
        exchangeId,
        selectedDeliveryBoy.userId,
        takingNewBag,
        newBagBarcode || null
      );
      message.success("Order assigned successfully!");
      setDbModalVisible(false);
      onRefresh();
    } catch (error: any) {
      message.error(error.message || "Failed to assign order.");
    } finally {
      setDbLoading(false);
      setDbModalVisible(false);
      setSelectedDeliveryBoy(null);
      setTakingNewBag(null);
      setNewBagBarcode("");
    }
  };

  const showModal = (record: ExchangeOrder) => {
    setSelectedRecord(record);
    setFormData({
      newBagBarcodes: "",
      returnBagWeight: record.weight,
      amountCollected: "0.00",
      remarks: "",
      deliveryBoyId: "",
      amountPaid: "",
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setShowValidation(false);
    setFormData({
      newBagBarcodes: "",
      returnBagWeight: "",
      amountCollected: "",
      remarks: "",
      deliveryBoyId: "",
      amountPaid: "",
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

  const handleDeliveryBoyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryBoyId: value,
    }));
  };

  const handleWeightChange = (value: number | null) => {
    const newWeight = value?.toString() || "";
    setFormData((prev) => ({
      ...prev,
      returnBagWeight: newWeight,
    }));

    if (selectedRecord && value !== null) {
      const newAmount = calculateUsedBagAmount(
        selectedRecord.weight,
        newWeight,
        selectedRecord.itemPrice
      );
      setFormData((prev) => ({
        ...prev,
        amountCollected: newAmount,
      }));
    }
  };

  const handleAmountChange = (value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      amountCollected: value?.toFixed(2) || "",
    }));
  };

  const handleAmountPaidChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      amountPaid: value,
    }));
  };

  const handleOk = async () => {
    setShowValidation(true);

    const errors: string[] = [];

    if (
      !formData.returnBagWeight ||
      isNaN(parseFloat(formData.returnBagWeight))
    ) {
      errors.push("Remaining Bag Weight is required.");
    }

    if (
      !formData.amountCollected ||
      isNaN(parseFloat(formData.amountCollected))
    ) {
      errors.push("Amount for Used Weight is required.");
    }

    if (!formData.amountPaid) {
      errors.push("Please select if the amount is paid.");
    }

    if (!formData.deliveryBoyId) {
      errors.push("Please select a delivery boy.");
    }

    if (errors.length > 0) {
      message.error(
        <>
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </>
      );
      return;
    }

    try {
      await reassignExchangeOrder(selectedRecord?.exchangeId || "", formData);
      message.success("Data submitted successfully!");
      setIsModalOpen(false);
      setShowValidation(false);
      onRefresh();
    } catch (error: any) {
      message.error(error.message || "Something went wrong!");
    } finally {
      handleCancel();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Title level={4} className="mb-4 md:mb-0 text-gray-800">
          Exchange Orders
        </Title>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Search className="text-gray-400" size={16} />}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "All",
          "EXCHANGEREQUESTED",
          "ASSIGNTOCOLLECT",
          "COLLECTED",
          "CANCELLED",
          "RECOMPLETED",
        ].map((status) => (
          <Button
            key={status}
            type={selectedStatus === status ? "primary" : "default"}
            onClick={() => setSelectedStatus(status)}
            className={`${
              selectedStatus === status
                ? "!bg-blue-600 hover:!bg-blue-700"
                : "!bg-white hover:!bg-gray-100 !text-gray-700 !border-gray-300"
            } !text-sm !px-4 !py-1 !rounded-full !shadow-sm`}
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
        <div className="overflow-x-auto bg-white rounded-lg shadow" ref={tableRef}>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey={(record, index) => `${record.orderId}_${index}`}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: false,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            className="max-w-full"
            scroll={{ x: "max-content" }}
            bordered
          />
        </div>
      )}

      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={handleCancelClick}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancelClick}
            className="rounded-lg"
          >
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
              if (takingNewBag === null) {
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
            className="!bg-blue-600 hover:!bg-blue-700 rounded-lg"
          >
            Assign
          </Button>,
        ]}
        className="rounded-lg"
      >
        {dbLoading1 ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <div className="space-y-4">
            <div>
              <Radio.Group
                onChange={(e) => {
                  const selectedBoy = deliveryBoys.find(
                    (boy) => boy.userId === e.target.value
                  );
                  setSelectedDeliveryBoy(selectedBoy || null);
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
              <label className="block mb-2 font-medium text-gray-700">
                Taking New Bag <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Select option"
                style={{ width: "100%" }}
                onChange={setTakingNewBag}
                value={takingNewBag}
                className="rounded-lg"
              >
                <Select.Option value="yes">Yes</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>
            </div>
            {takingNewBag === "yes" && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  New Bag Barcode <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter barcode"
                  value={newBagBarcode}
                  onChange={(e) => setNewBagBarcode(e.target.value)}
                  maxLength={13}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>

      <Modal
        title={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        width={600}
        className="rounded-lg"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="rounded-lg border-gray-300"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="!bg-blue-600 hover:!bg-blue-700 rounded-lg"
          >
            Submit
          </Button>,
        ]}
      >
        <div className="space-y-6 p-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Exchange Details
            </h2>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <User size={18} />
                <span className="font-semibold">
                  {selectedRecord?.userName}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Package size={18} />
                <span className="font-semibold">
                  {selectedRecord?.itemName}
                </span>
              </div>
            </div>
          </div>

          <Form layout="vertical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Remaining Bag Weight (kg)
                    <MdScale className="inline ml-2 text-gray-500" />
                  </span>
                }
                required
                validateStatus={
                  showValidation && !formData.returnBagWeight ? "error" : ""
                }
                help={
                  showValidation && !formData.returnBagWeight ? "Required" : ""
                }
              >
                <InputNumber
                  value={parseFloat(formData.returnBagWeight) || 0}
                  onChange={handleWeightChange}
                  placeholder="Enter remaining weight in kg"
                  className="w-full rounded-lg"
                  suffix="kg"
                  min={0}
                  max={parseFloat(selectedRecord?.weight || "20")}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Amount for Used Weight (₹)
                    <MdCurrencyRupee className="inline ml-2 text-gray-500" />
                  </span>
                }
                required
                validateStatus={
                  showValidation && !formData.amountCollected ? "error" : ""
                }
                help={
                  showValidation && !formData.amountCollected ? "Required" : ""
                }
              >
                <InputNumber
                  value={parseFloat(formData.amountCollected) || 0}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className="w-full rounded-lg"
                  prefix="₹"
                  min={0}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Amount Paid
                </span>
              }
              required
              validateStatus={
                showValidation && !formData.amountPaid ? "error" : ""
              }
              help={showValidation && !formData.amountPaid ? "Required" : ""}
            >
              <Select
                placeholder="Select option"
                value={formData.amountPaid}
                onChange={handleAmountPaidChange}
                className="rounded-lg"
              >
                <Select.Option value="yes">Yes</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Select Delivery Boy
                </span>
              }
              required
              validateStatus={
                showValidation && !formData.deliveryBoyId ? "error" : ""
              }
              help={showValidation && !formData.deliveryBoyId ? "Required" : ""}
            >
              <Select
                placeholder="Select a delivery boy"
                value={formData.deliveryBoyId}
                onChange={handleDeliveryBoyChange}
                className="rounded-lg"
                loading={dbLoading1}
              >
                {deliveryBoys
                  .filter((boy) => boy.isActive === "true")
                  .map((boy) => (
                    <Select.Option key={boy.userId} value={boy.userId}>
                      {`${boy.firstName} ${boy.lastName} (${boy.whatsappNumber})`}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  New Bag Barcodes (Optional)
                </span>
              }
            >
              <Input
                name="newBagBarcodes"
                value={formData.newBagBarcodes}
                onChange={handleChange}
                placeholder="Enter new bag barcode"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Remarks</span>}
            >
              <Input.TextArea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks"
                className="rounded-lg"
                rows={3}
              />
            </Form.Item>
          </Form>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <span className="text-yellow-800 text-sm font-medium">
              Note: All fields except remarks are mandatory.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExchangeOrdersTable;