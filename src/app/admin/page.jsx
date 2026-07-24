import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export default async function AdminDashboard() {
  await connectDB();

  const [totalProducts, totalOrders, totalUsers, recentOrders] =
    await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const revenue = totalRevenue[0]?.total || 0;

  return (
    <div>
      <h1 className="text-3xl font-medium mb-8 text-black">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Products" value={totalProducts} />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Revenue" value={`$${revenue.toFixed(2)}`} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-black">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Customer</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-b last:border-0">
                <td className="py-3 text-gray-500">
                  {order.user?.name || "N/A"}
                </td>
                <td className="py-3 text-gray-500">
                  {order.user?.email || "N/A"}
                </td>
                <td className="py-3 text-gray-500">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="py-3 text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-500">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-medium text-gray-500">{value}</p>
    </div>
  );
}
