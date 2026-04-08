import { partnerApi as axiosInstance } from "../utils/axiosInstances";
import BASE_URL from "../Config";

interface Order {
  orderId: string;
  uniqueId: string;
  orderDate: string | null;
  subTotal: number;
  grandTotal: number;
  testUser: boolean;
  orderStatus: string;
  orderAddress?: Address;
  userType: string;
  orderFrom: string;
  orderItems: OrderItems[];
  customerName?: string;
  mobileNumber?: string;
  deliveryDate?: string;
  distancefromMiyapur: string;
  expectedDeliveryDate: string;
  distancefromMythriNager: string;
  choosedLocations: string;
  deliveryBoyMobile?: string;
  deliveryBoyName: string;
  deliveryFee: Number;
}

interface OrderItems {
  itemName: string;
  quantity: string | null;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  weight: string;
  itemQty?: number;
  itemUnit: string;
}

interface Address {
  flatNo?: string;
  address?: string;
  landMark?: string;
  pincode?: string;
  googleMapLink?: string;
}

interface OrderRequest {
  id: string | null;
  itemId: string | null;
  orderId: string;
  quantity: number;
}

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
  weight: string;
}

interface DeliveryBoy {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
}

export type { Order, OrderItems, Address, ExchangeOrder, DeliveryBoy };

export const fetchOrdersByStatus = async (status: string): Promise<Order[]> => {
  const { data } = await axiosInstance.get<Order[]>(
    `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=${status}`
  );
  return data.filter((order) => !order.testUser);
};

export const fetchDeliveredOrders = async (
  startDate: string,
  endDate: string
): Promise<Order[]> => {
  const { data } = await axiosInstance.get(
    `${BASE_URL}/order-service/notification_to_dev_team_weekly?endDate=${endDate}&startDate=${startDate}&status=4`
  );
  return data
    .filter((order: any) => order.testUser === "false")
    .map((order: any) => ({
      orderId: order.orderId,
      uniqueId: order.orderId.slice(-4),
      orderDate: order.orderPlacedDate || null,
      subTotal: order.grandTotal || 0,
      grandTotal: order.grandTotal || 0,
      testUser: false,
      orderStatus: "4",
      orderAddress: {
        pincode: order.pincode?.toString() || "",
        address: order.address || "",
        googleMapLink: "",
      },
      userType: "",
      orderFrom: "",
      orderItems: order.orderItems.map((item: any) => ({
        itemName: item.itemName,
        quantity: item.itemQty ? item.itemQty.toString() : null,
        singleItemPrice: item.price,
        itemMrpPrice: item.price,
        price: item.price,
        weight: item.weight ? item.weight.toString() : "0",
      })),
      customerName: order.customerName,
      mobileNumber: order.mobileNumber,
      deliveryDate: order.deliveryDate,
    }));
};

export const fetchExchangeOrders = async (): Promise<ExchangeOrder[]> => {
  const { data } = await axiosInstance.get<ExchangeOrder[]>(
    `${BASE_URL}/order-service/getAllExchangeOrder`
  );
  return data.sort(
    (a, b) =>
      new Date(b.exchangeRequestDate).getTime() -
      new Date(a.exchangeRequestDate).getTime()
  );
};

export const fetchDeliveryBoys = async (): Promise<DeliveryBoy[]> => {
  const { data } = await axiosInstance.get<DeliveryBoy[]>(
    `${BASE_URL}/user-service/deliveryBoyList`
  );
  return data;
};

export const rejectOrder = async (
  orderId: string,
  cancelReason: string
): Promise<void> => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/order-service/reject_orders`,
    { orderId, cancelReason }
  );
  if (!data.status) throw new Error(data.message);
};

export const assignOrderToDeliveryBoy = async (
  orderId: string,
  deliveryBoyId: string,
  orderStatus: string
): Promise<void> => {
  let body: any;
  let url: string;

  if (orderStatus === "PickedUp") {
    body = { deliveryBoyId, orderId };
    url = `${BASE_URL}/order-service/swappingDeliveryBoyIds`;
  } else if (orderStatus === "2" || orderStatus === "1") {
    body = { orderId, deliveryBoyId };
    url = `${BASE_URL}/order-service/orderIdAndDbId`;
  } else {
    body = { orderId, deliverBoyId: deliveryBoyId };
    url = `${BASE_URL}/order-service/reassignOrderToDb`;
  }

  await axiosInstance.post(url, body);
};

export const orderDelivered = async (orderId: string, deliveryBoyId: string): Promise<void> => {
  let body: any;
  body = { orderId, id : deliveryBoyId };
  await axiosInstance.patch(`${BASE_URL}/order-service/weeklyMarketUpadte`, body);
}

export const assignExchangeOrder = async (
  exchangeId: string,
  deliveryBoyId: string,
  collectedNewBag: string,
  newBagBarCode: string | null
): Promise<void> => {
  await axiosInstance.patch(`${BASE_URL}/order-service/exchangeBagCollect`, {
    collectedNewBag,
    exchangeId,
    deliveryBoyId,
    newBagBarCode,
  });
};

export const reassignExchangeOrder = async (
  exchangeId: string,
  data: {
    amountCollected: string;
    remarks: string;
    returnBagWeight: string;
    deliveryBoyId: string;
    amountPaid: string;
  }
): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/order-service/exchangeOrderReassign`, {
    exchangeId,
    ...data,
  });
};

export const fetchGroupedProducts = async () => {
  const { data } = await axiosInstance.get(
    `${BASE_URL}/product-service/showGroupItemsForCustomrs`
  );
  return data;
};

export const updateOrderItem = async (orderRequest: OrderRequest) => {
  const { data } = await axiosInstance.patch(
    `${BASE_URL}/order-service/orderItemsUpdate`,
    orderRequest
  );
  return data;
};
