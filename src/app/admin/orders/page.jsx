"use client";
import { useEffect, useState } from "react";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  }

  async function handleStatusChange(id, status) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) fetchOrders();
    else alert(data.message);
  }

  return (
    <div>
      <h1 className="text-3xl font-medium mb-8 text-black">Orders</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b last:border-0 align-top"
                >
                  <td className="py-4 font-medium text-gray-500">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="py-4 text-gray-500">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="py-4 text-gray-500">
                    {order.items.length} item(s)
                  </td>
                  <td className="py-4 text-gray-500">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-4 text-gray-500">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-black transition-colors"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
