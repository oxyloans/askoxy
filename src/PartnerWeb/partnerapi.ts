import axios from "axios";
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
  expectedDeliveryDate:string;
  distancefromMythriNager: string;
  choosedLocations: string;
  deliveryBoyMobile?:string;
  deliveryBoyName:string;

}

interface OrderItems {
  itemName: string;
  quantity: string | null;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  weight: string;
  itemQty?: number;
}

interface Address {
  flatNo?: string;
  address?: string;
  landMark?: string;
  pincode?: string;
  googleMapLink?: string;
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

const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");

export const fetchOrdersByStatus = async (status: string): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(
      `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=${status}`,
      { headers: { Authorization: `Bearer ${accessToken.token}` } }
    );
    return response.data.filter((order) => !order.testUser);
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    throw new Error("Unable to load orders. Please try again later.");
  }
};

export const fetchDeliveredOrders = async (
  startDate: string,
  endDate: string
): Promise<Order[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/order-service/notification_to_dev_team_weekly?endDate=${endDate}&startDate=${startDate}&status=4`,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${accessToken.token}`,
        },
      }
    );
    return response.data
      .filter((order: any) => !order.testUser)
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
  } catch (error: any) {
    console.error("Error fetching delivered orders:", error);
    throw new Error(
      error.response?.data?.message || "Unable to load delivered orders."
    );
  }
};

export const fetchExchangeOrders = async (): Promise<ExchangeOrder[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/order-service/getAllExchangeOrder`,
      {
        headers: { Authorization: `Bearer ${accessToken.token}` },
      }
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.sort(
      (a: ExchangeOrder, b: ExchangeOrder) =>
        new Date(b.exchangeRequestDate).getTime() -
        new Date(a.exchangeRequestDate).getTime()
    );
  } catch {
    throw new Error("Error fetching exchange orders.");
  }
};

export const fetchDeliveryBoys = async (): Promise<DeliveryBoy[]> => {
  try {
    const response = await fetch(`${BASE_URL}/user-service/deliveryBoyList`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    throw new Error("Failed to get Delivery Boy list.");
  }
};

export const rejectOrder = async (
  orderId: string,
  cancelReason: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/order-service/reject_orders`,
      { orderId, cancelReason },
      { headers: { Authorization: `Bearer ${accessToken.token}` } }
    );
    if (!response.data.status) throw new Error(response.data.message);
  } catch {
    throw new Error("Failed to reject order.");
  }
};

export const assignOrderToDeliveryBoy = async (
  orderId: string,
  deliveryBoyId: string,
  orderStatus: string
): Promise<void> => {
  let data: any;
  let apiUrl: string;

  if (orderStatus === "PickedUp") {
    data = {
      deliveryBoyId,
      orderId,
    };
    apiUrl = `${BASE_URL}/order-service/swappingDeliveryBoyIds`;
  } else if (orderStatus === "2" || orderStatus === "1") {
    data = {
      orderId,
      deliveryBoyId,
    };
    apiUrl = `${BASE_URL}/order-service/orderIdAndDbId`;
  } else {
    data = {
      orderId,
      deliverBoyId: deliveryBoyId,
    };
    apiUrl = `${BASE_URL}/order-service/reassignOrderToDb`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error();
  } catch {
    throw new Error("Failed to assign order.");
  }
};


export const assignExchangeOrder = async (
  exchangeId: string,
  deliveryBoyId: string,
  collectedNewBag: string,
  newBagBarCode: string | null
): Promise<void> => {
  try {
    const response = await fetch(
      `${BASE_URL}/order-service/exchangeBagCollect`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectedNewBag,
          exchangeId,
          deliveryBoyId,
          newBagBarCode,
        }),
      }
    );
    if (!response.ok) throw new Error();
  } catch {
    throw new Error("Failed to assign order.");
  }
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
  try {
    const response = await fetch(
      `${BASE_URL}/order-service/exchangeOrderReassign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exchangeId, ...data }),
      }
    );
    if (!response.ok) throw new Error();
  } catch {
    throw new Error("Something went wrong!");
  }
};
