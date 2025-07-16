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
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, Package, User } from "lucide-react";
import { MdCurrencyRupee, MdScale } from "react-icons/md";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  Order,
  ExchangeOrder,
  DeliveryBoy,
  fetchOrdersByStatus,
  fetchExchangeOrders,
  fetchDeliveryBoys,
  rejectOrder,
  assignOrderToDeliveryBoy,
  assignExchangeOrder,
  reassignExchangeOrder,
} from "./partnerapi";
import dayjs from "dayjs";

const { Title } = Typography;
const { TabPane } = Tabs;

const OrdersPage: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [exchangeOrders, setExchangeOrders] = useState<ExchangeOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredExchangeOrders, setFilteredExchangeOrders] = useState<
    ExchangeOrder[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchText1, setSearchText1] = useState<string>("");
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setDbModalVisible] = useState(false);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [dbLoading1, setDbLoading1] = useState<boolean>(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedExchangeOrder, setSelectedExchangeOrder] =
    useState<ExchangeOrder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [takingNewBag, setTakingNewBag] = useState<string | null>(null);
  const [newBagBarcode, setNewBagBarcode] = useState<string>("");
  const [formData, setFormData] = useState({
    newBagBarcodes: "",
    returnBagWeight: "",
    amountCollected: "",
    remarks: "",
    deliveryBoyId: "",
    amountPaid: "",
  });
  const [showValidation, setShowValidation] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table container

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await fetchOrdersByStatus(status || "1");
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setLoading(false);
      if (fetchedOrders.length === 0) {
        message.info("No orders found");
      }
    } catch (err) {
      setLoading(false);
      message.error("unable to load the orders at this time");
    }
  };

  const loadExchangeOrders = async () => {
    try {
      setLoading(true);
      const fetchedExchangeOrders = await fetchExchangeOrders();
      setExchangeOrders(fetchedExchangeOrders);

      if (status === "1") {
        const filtered = fetchedExchangeOrders.filter(
          (order) => order.status === "EXCHANGEREQUESTED"
        );
        setFilteredExchangeOrders(filtered);
      } else if (status === "3") {
        const filtered = fetchedExchangeOrders.filter(
          (order) =>
            order.status !== "EXCHANGEREQUESTED" &&
            order.status !== "RECOMPLETED" &&
            order.status !== "CANCELLED"
        );
        setFilteredExchangeOrders(filtered);
      } else {
        setFilteredExchangeOrders(fetchedExchangeOrders);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error("unable to load orders at this time");
    }
  };

  useEffect(() => {
    loadOrders();
    loadExchangeOrders();
  }, [status]);

  useEffect(() => {
    let results = orders;
    if (searchText1 !== "") {
      results = results.filter((order) =>
        order.uniqueId.toLowerCase().includes(searchText1.toLowerCase())
      );
    }
    setFilteredOrders(results);
    if (results.length === 0 && searchText1) {
      message.info("No orders match your search");
    }
  }, [searchText1, orders]);

  useEffect(() => {
    let results = exchangeOrders;
    if (searchText !== "") {
      results = results.filter((order) =>
        order.orderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (results.length === 0 && searchText) {
      message.info("No orders match your search");
    }
    setFilteredExchangeOrders(results);
  }, [searchText]);

  // Restore scroll position after orders are loaded
  useEffect(() => {
    if (!loading && orders.length > 0) {
      const savedOrderId = localStorage.getItem("partner_orderId");
      if (savedOrderId) {
        // Check if the order is in the current filteredOrders
        const targetRow = document.querySelector(
          `[data-row-key="${savedOrderId}"]`
        );
        if (targetRow) {
          targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
          localStorage.removeItem("partner_orderId");
        } else {
          // Try to find the order in the full orders list (for pagination)
          const orderIndex = orders.findIndex(
            (order) => order.orderId === savedOrderId
          );
          if (orderIndex !== -1) {
            // Calculate the page number (1-based indexing for Ant Design Table)
            const targetPage = Math.ceil((orderIndex + 1) / pageSize);
            setCurrentPage(targetPage);
            // Wait for the next render to ensure the Table updates to the correct page
            setTimeout(() => {
              const updatedRow = document.querySelector(
                `[data-row-key="${savedOrderId}"]`
              );
              if (updatedRow) {
                updatedRow.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
              localStorage.removeItem("partner_orderId");
            }, 0);
          } else {
            // Order not found in the full dataset
            message.info("The previously viewed order is not available.");
            localStorage.removeItem("partner_orderId");
          }
        }
      }
    }
  }, [loading, orders, filteredOrders]);

  const fetchDeliveryBoysHandler = async (order?: Order | ExchangeOrder) => {
    setDbLoading1(true);
    try {
      const data = await fetchDeliveryBoys();
      setDeliveryBoys(data);
      if (order) {
        if ("orderId" in order && "uniqueId" in order) {
          setSelectedOrder(order);
        } else {
          setSelectedExchangeOrder(order);
        }
        setDbModalVisible(true);
      }
    } catch (error) {
      message.warning("error.message");
    } finally {
      setDbLoading1(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  const handleSearch1 = (value: string) => {
    setSearchText1(value);
  };

  const handleOrderDetails = (order: Order | ExchangeOrder) => {
    const orderId = (order as ExchangeOrder).orderId2
      ? (order as ExchangeOrder).orderId2
      : (order as Order).orderId;
    // Save orderId and scroll position
    localStorage.setItem("partner_orderId", orderId);
    if (tableRef.current) {
      localStorage.setItem("partner_scrollPosition", window.scrollY.toString());
    }
    navigate(`/home/orderDetails`);
  };

  const showRejectConfirmation = (order: Order) => {
    setSelectedOrder(order);
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setIsModalVisible(true);
      },
    });
  };

  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      setConfirmLoading(true);
      await rejectOrder(selectedOrder?.orderId ?? "", rejectReason);
      message.success("Order rejected successfully");
      setIsModalVisible(false);
      rejectForm.resetFields();
      loadOrders();
    } catch (error) {
      message.error("error.message");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleAssign = async (
    id: string,
    type: "order" | "exchange",
    orderStatus?: string
  ) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setDbLoading(true);
    try {
      if (type === "order" && orderStatus) {
        await assignOrderToDeliveryBoy(
          id,
          selectedDeliveryBoy.userId,
          orderStatus
        );
        message.success("Order assigned successfully!");
        loadOrders();
      } else if (type === "exchange") {
        if (!takingNewBag) {
          message.warning("Please select New Bag status.");
          return;
        }
        if (takingNewBag === "yes" && !newBagBarcode) {
          message.warning("Please enter the new bag barcode.");
          return;
        }
        await assignExchangeOrder(
          id,
          selectedDeliveryBoy.userId,
          takingNewBag,
          newBagBarcode || null
        );
        message.success("Exchange order assigned successfully!");
        loadExchangeOrders();
      }
      setDbModalVisible(false);
      setSelectedDeliveryBoy(null);
      setTakingNewBag(null);
      setNewBagBarcode("");
    } catch (error) {
      message.error("error.message");
    } finally {
      setDbLoading(false);
    }
  };

  const handleCancelClick = () => {
    setDbModalVisible(false);
    setSelectedDeliveryBoy(null);
    setTakingNewBag(null);
    setNewBagBarcode("");
    setSelectedOrder(null);
    setSelectedExchangeOrder(null);
  };

  const showExchangeModal = (record: ExchangeOrder) => {
    setSelectedExchangeOrder(record);
    setFormData({
      newBagBarcodes: "",
      returnBagWeight: record.weight,
      amountCollected: "0.00",
      remarks: "",
      deliveryBoyId: "",
      amountPaid: "",
    });
    setIsExchangeModalOpen(true);
    fetchDeliveryBoysHandler();
  };

  const handleExchangeCancel = () => {
    setFormData({
      newBagBarcodes: "",
      returnBagWeight: "",
      amountCollected: "",
      remarks: "",
      deliveryBoyId: "",
      amountPaid: "",
    });
    setIsExchangeModalOpen(false);
  };

  const handleExchangeChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryBoyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, deliveryBoyId: value }));
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

  const handleWeightChange = (value: number | null) => {
    const newWeight = value?.toString() || "";
    setFormData((prev) => ({ ...prev, returnBagWeight: newWeight }));
    if (selectedExchangeOrder && value !== null) {
      const newAmount = calculateUsedBagAmount(
        selectedExchangeOrder.weight,
        newWeight,
        selectedExchangeOrder.itemPrice
      );
      setFormData((prev) => ({ ...prev, amountCollected: newAmount }));
    }
  };

  const handleAmountChange = (value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      amountCollected: value?.toFixed(2) || "",
    }));
  };

  const handleAmountPaidChange = (value: string) => {
    setFormData((prev) => ({ ...prev, amountPaid: value }));
  };

  const handleExchangeOk = async () => {
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
      await reassignExchangeOrder(
        selectedExchangeOrder?.exchangeId ?? "",
        formData
      );
      message.success("Data submitted successfully!");
      setIsExchangeModalOpen(false);
      setShowValidation(false);
      loadExchangeOrders();
    } catch (error: any) {
      message.error(error.message || "Something went wrong!");
    } finally {
      handleExchangeCancel();
    }
  };

  const getActionButtons = (status: string, record: any) => {
    const buttonClasses =
      "relative overflow-hidden transition-all duration-300 ease-in-out w-10 md:w-auto px-2 flex justify-center items-center";

    switch (status) {
      case "1":
      case "2":
        return (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-blue-500 hover:bg-blue-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoysHandler(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">A</span>
                  <span className="hidden group-hover:block">Assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </div>
        );

      case "3":
      case "PickedUp":
        return (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-green-500 hover:bg-green-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoysHandler(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">RA</span>
                  <span className="hidden group-hover:block">Re-assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const newOrderColumns: ColumnsType<Order> = [
    {
      title: "Order Info",
      dataIndex: "uniqueId",
      key: "uniqueId",
      width: 120,
      render: (uniqueId: string, record: Order) => (
        <div className="flex flex-col items-start gap-1">
          <a
            onClick={() => handleOrderDetails(record)}
            className="text-blue-600 font-semibold hover:underline text-lg"
          >
            #{uniqueId}
          </a>
          {record.orderFrom && (
            <Tag color="green" className="w-fit text-xs">
              {record.orderFrom}
            </Tag>
          )}
          <Tag color="blue" className="px-2 py-0.5 rounded-full text-xs">
            {record.userType}
          </Tag>
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 140,
      render: (record: {
        orderDate: string;
        grandTotal: number;
        expectedDeliveryDate: string;
      }) => {
        const formattedDate = new Date(record.orderDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
        const formattedAmount = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(record.grandTotal);

        return (
          <div>
            <div className="text-gray-800">
              <strong>Order date:</strong> {formattedDate}
            </div>
            <div className="text-green-600 font-medium">{formattedAmount}</div>
            {record.expectedDeliveryDate && (
              <div>
                <strong>Expected date:</strong>{" "}
                {record.expectedDeliveryDate
                  ? dayjs(record.expectedDeliveryDate, "DD-MM-YYYY").format(
                      "MMM DD, YYYY"
                    )
                  : "Not provided"}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Delivery Address",
      dataIndex: "orderAddress",
      key: "orderAddress",
      width: 200,
      sorter: (a, b) =>
        String(a.orderAddress?.pincode || "").localeCompare(
          String(b.orderAddress?.pincode || "")
        ),
      render: (_: any, record: any) => {
        const address = record.orderAddress;
        return (
          <div className="w-[200px] h-[120px] overflow-y-auto overflow-x-hidden scrollbar-hide text-sm leading-5">
            {address ? (
              <>
                <div>
                  {`${address.flatNo || "N/A"}, ${address.address || "N/A"}, ${
                    address.landMark || "N/A"
                  }, ${address.pincode || "N/A"}`}
                </div>
                {address.googleMapLink && (
                  <a
                    href={address.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-1 inline-block"
                  >
                    <EnvironmentOutlined className="mr-1" />
                    View Location
                  </a>
                )}
              </>
            ) : (
              "No Address Available"
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 200,
      render: (text: string, record: any) => {
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col md:flex-row items-center gap-2">
              {getActionButtons(text, record)}

              <div className="group relative">
                <Button
                  type="primary"
                  className="w-full md:w-auto px-2 bg-purple-500 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                  onClick={() => handleOrderDetails(record)}
                >
                  <div className="flex items-center">
                    <span className="group-hover:hidden">View</span>
                    <span className="hidden group-hover:block">
                      ViewDetails
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              {record.deliveryBoyName && (
                <div className="flex justify-between w-full gap-1 text-sm">
                  <strong>asgn : </strong> <span>{record.deliveryBoyName}</span>
                </div>
              )}
              {record.deliveryBoyMobile && (
                <div className="flex justify-between w-full text-sm">
                  <strong>mbl:</strong>
                  <span>{record.deliveryBoyMobile}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Items",
      key: "items",
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="mt-2 max-h-[80px] overflow-y-auto scrollbar-hide">
            {record.orderItems?.map((item, index) => (
              <div key={index} className="flex flex-col mb-2">
                <span className="text-green-700 font-semibold text-sm">
                  {item.itemName}
                </span>
                <div className="flex gap-2 text-xs text-gray-700">
                  <span className="text-red-600">₹{item.price}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Weight: {item.weight}kgs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const exchangeOrderColumns: ColumnsType<ExchangeOrder> = [
    {
      title: "Customer Info",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      render: (exchangeId: string, record: ExchangeOrder) => (
        <div className="flex flex-col items-start gap-1">
          <a
            onClick={() => handleOrderDetails(record)}
            className="text-blue-600 font-semibold hover:underline text-lg"
          >
            {exchangeId.slice(-4)}
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
      width: 150,
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
      width: 160,
      render: (_, record) => (
        <div className="w-[240px] h-[120px] overflow-y-auto overflow-x-hidden scrollbar-hide text-sm flex flex-col gap-2">
          <span className="text-sm">{record.orderAddress}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1 justify-start">
          {(record.status === "EXCHANGEREQUESTED" ||
            record.status === "ASSIGNTOCOLLECT") && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-medium py-1 px-2 rounded min-w-[70px] h-7"
              onClick={() => fetchDeliveryBoysHandler(record)}
            >
              {record.status === "EXCHANGEREQUESTED" ? "Assign" : "Re-Assign"}
            </button>
          )}

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium py-1 px-2 rounded min-w-[60px] h-7"
            onClick={() => showExchangeModal(record)}
          >
            Details
          </button>
        </div>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
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
          <div>
            <div>{formattedDate}</div>
            <div>
              <strong>Diff:</strong>{" "}
              <span
                className={
                  record.daysDifference <= 3 ? "text-green-500" : "text-red-500"
                }
              >
                {record.daysDifference}
              </span>{" "}
              days
            </div>
          </div>
        );
      },
    },
  ];

  const name = status === "1" ? "New Orders" : "Assigned Orders";
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between flex-wrap">
        <Title level={4} className="text-gray-800 mb-0">
          Orders Management
        </Title>

        <div className="flex gap-4 text-sm text-gray-500">
          <p>
            {name}: {filteredOrders.length}
          </p>
          <p>Exchange: {filteredExchangeOrders.length}</p>
        </div>
      </div>

      <Tabs defaultActiveKey={name}>
        <TabPane tab={name} key="new-orders">
          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            <Input
              placeholder="Search Order ID"
              value={searchText1}
              onChange={(e) => handleSearch1(e.target.value)}
              prefix={<SearchOutlined />}
              className="rounded-lg w-full sm:w-64"
            />
          </div>
          {loading ? (
            <div className="flex justify-center my-12">
              <Spin size="large" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <Empty
              image={<FileSearchOutlined className="text-6xl text-gray-400" />}
              description={
                <Typography.Text type="secondary">
                  {searchText ? "No Orders Found" : "No Orders Found"}
                </Typography.Text>
              }
            />
          ) : (
            <div ref={tableRef}>
              <Table
                dataSource={filteredOrders}
                columns={newOrderColumns}
                rowKey="orderId"
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: false,
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page),
                }}
                className="max-w-full"
                scroll={{ x: "max-content" }}
                bordered
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="Exchange Orders" key="exchange-orders">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <Input
                placeholder="Search orders..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<Search className="text-gray-400" size={16} />}
                className="rounded-lg w-full sm:w-64"
              />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center my-12">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={filteredExchangeOrders}
              columns={exchangeOrderColumns}
              rowKey={(record, index) => `${record.orderId}_${index}`}
              pagination={{ pageSize: 50, showSizeChanger: false }}
              className="max-w-full"
              scroll={{ x: "max-content" }}
              bordered
            />
          )}
        </TabPane>
      </Tabs>

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
            onClick={() =>
              handleAssign(
                selectedOrder?.orderId ||
                  selectedExchangeOrder?.exchangeId ||
                  "",
                selectedOrder ? "order" : "exchange",
                status
              )
            }
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
            {selectedExchangeOrder && (
              <>
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
              </>
            )}
          </div>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>

      <Modal
        title="Provide Rejection Reason"
        open={isModalVisible}
        onOk={handleFinalReject}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={confirmLoading}
        className="rounded-lg"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="Rejection Reason"
            rules={[
              {
                required: true,
                message: "Please provide a reason for rejection",
              },
              { min: 6, message: "Reason must be at least 6 characters long" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Please provide a detailed reason for rejecting this order"
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={null}
        open={isExchangeModalOpen}
        onOk={handleExchangeOk}
        onCancel={handleExchangeCancel}
        okText="Submit"
        cancelText="Cancel"
        width={600}
        className="rounded-lg"
        footer={[
          <Button
            key="cancel"
            onClick={handleExchangeCancel}
            className="rounded-lg border-gray-300"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleExchangeOk}
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
                  {selectedExchangeOrder?.userName}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Package size={18} />
                <span className="font-semibold">
                  {selectedExchangeOrder?.itemName}
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
                  max={parseFloat(selectedExchangeOrder?.weight || "20")}
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
                <span className="text-gray-700 font-medium">Amount Paid</span>
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
                onChange={handleExchangeChange}
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
                onChange={handleExchangeChange}
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

export default OrdersPage;
