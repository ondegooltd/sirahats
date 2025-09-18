"use client";

import { motion } from "framer-motion";
import {
  Package,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [productsRes, ordersRes, usersRes, messagesRes] =
          await Promise.all([
            fetch("/api/products"),
            fetch("/api/orders"),
            fetch("/api/admin/users"),
            fetch("/api/contact"),
          ]);

        const [productsData, ordersData, usersData, messagesData] =
          await Promise.all([
            productsRes.json(),
            ordersRes.json(),
            usersRes.json(),
            messagesRes.json(),
          ]);

        // Calculate stats
        const totalProducts = productsData.data?.products?.length || 0;
        const totalOrders = ordersData.data?.orders?.length || 0;
        const totalUsers = usersData.data?.users?.length || 0;
        const totalRevenue =
          ordersData.data?.orders?.reduce(
            (sum: number, order: any) =>
              order.status === "completed"
                ? sum + (order.totalAmount || 0)
                : sum,
            0
          ) || 0;

        // Get recent orders (last 5)
        const recentOrdersData =
          ordersData.data?.orders?.slice(0, 5).map((order: any) => ({
            _id: order._id,
            orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
            customerName:
              order.user?.firstName + " " + order.user?.lastName ||
              order.shippingAddress?.name ||
              "Unknown",
            totalAmount: order.totalAmount || 0,
            status: order.status || "pending",
            createdAt: order.createdAt || new Date().toISOString(),
          })) || [];

        setStats({
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
        });
        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#8BC34A]" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
          {[
            {
              name: "Total Products",
              value: stats.totalProducts.toString(),
              icon: Package,
            },
            {
              name: "Total Orders",
              value: stats.totalOrders.toString(),
              icon: FileText,
            },
            {
              name: "Total Users",
              value: stats.totalUsers.toString(),
              icon: Users,
            },
            {
              name: "Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: DollarSign,
            },
          ].map((stat, index) => (
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
                    {stat.name === "Revenue" ? (
                      <span className="h-6 w-6 text-gray-400 text-2xl">₵</span>
                    ) : (
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    )}
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
                <Link
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
                </Link>
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
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
