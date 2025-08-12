"use client";

import { motion } from "framer-motion";
import {
  Package,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

const stats = [
  {
    name: "Total Products",
    value: "12",
    icon: Package,
    change: "+2",
    changeType: "increase",
  },
  {
    name: "Total Orders",
    value: "48",
    icon: FileText,
    change: "+12",
    changeType: "increase",
  },
  {
    name: "Total Users",
    value: "156",
    icon: Users,
    change: "+8",
    changeType: "increase",
  },
  {
    name: "Revenue",
    value: "$12,450",
    icon: DollarSign,
    change: "+15%",
    changeType: "increase",
  },
];

const recentOrders = [
  {
    id: "BB123456",
    customer: "John Doe",
    amount: "$89.00",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "BB123457",
    customer: "Jane Smith",
    amount: "$125.00",
    status: "Processing",
    date: "2024-01-15",
  },
  {
    id: "BB123458",
    customer: "Mike Johnson",
    amount: "$65.00",
    status: "Shipped",
    date: "2024-01-14",
  },
  {
    id: "BB123459",
    customer: "Sarah Wilson",
    amount: "$200.00",
    status: "Pending",
    date: "2024-01-14",
  },
];

const quickActions = [
  {
    name: "Add Product",
    href: "/admin/products/new",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    name: "View Orders",
    href: "/admin/orders",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    name: "Manage Users",
    href: "/admin/users",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    color: "bg-orange-500",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#8BC34A] rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span
                      className={`rounded-lg inline-flex p-3 ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {action.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
