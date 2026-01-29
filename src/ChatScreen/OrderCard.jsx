export default function OrderCard({ order }) {
  const statusColor =
    order.status === "Delivered"
      ? "text-green-600"
      : order.status === "Rejected"
      ? "text-red-500"
      : "text-yellow-600";

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Order ID</span>
        <span className="font-mono">{order.orderId}</span>
      </div>

      <div className="mt-2 text-sm space-y-1">
        <div>Date: <strong>{order.date}</strong></div>
        <div className={statusColor}>
          Status: <strong>{order.status}</strong>
        </div>
        <div>Total: <strong>₹{order.total}</strong></div>
        <div className="text-xs text-gray-500">
          Payment: {order.payment}
        </div>
      </div>
    </div>
  );
}
