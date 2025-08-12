"use client";

import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, Eye, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

interface Order {
  _id: string;
  orderNumber: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  estimatedDelivery?: string;
  items: Array<{
    _id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    product: {
      _id: string;
      name: string;
      images: string[];
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session?.user, router]);

  const fetchOrders = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/orders?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchOrders(currentPage);
    }
  }, [session?.user, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  if (!session?.user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Pending":
        return <Package className="w-5 h-5 text-gray-500" />;
      case "Cancelled":
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/account"
                className="text-[#8BC34A] hover:text-[#689F38] transition-colors"
              >
                ← Back to Account
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="h-5 w-16 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-4">
                          {[1, 2].map((j) => (
                            <div
                              key={j}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                              <div className="flex-1">
                                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                              </div>
                              <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((k) => (
                            <div key={k} className="flex justify-between">
                              <div className="h-4 w-20 bg-gray-200 rounded"></div>
                              <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Orders List */}
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className="font-semibold text-gray-900">
                              Order {order.orderNumber}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="lg:col-span-2">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            Items
                          </h3>
                          <div className="space-y-4">
                            {order.items.map((item, itemIndex) => (
                              <div
                                key={item._id || itemIndex}
                                className="flex items-center space-x-4"
                              >
                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      item.image ||
                                      item.product?.images?.[0] ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-4">
                            Order Details
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Date:</span>
                              <span className="text-gray-900">
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="text-gray-900">
                                {order.status}
                              </span>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Est. Delivery:
                                </span>
                                <span className="text-gray-900">
                                  {formatDate(order.estimatedDelivery)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">
                                {formatCurrency(order.subtotal)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="text-gray-900">
                                {formatCurrency(order.shipping)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span className="text-gray-900">
                                {formatCurrency(order.tax)}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 space-y-2">
                            <button className="w-full flex items-center justify-center space-x-2 bg-[#8BC34A] text-white py-2 px-4 rounded-md hover:bg-[#689F38] transition-colors">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                            {order.status === "Delivered" && (
                              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.prevPage!)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          page === pagination.currentPage
                            ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.nextPage!)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && orders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    No orders yet
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Start shopping to see your orders here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
                  >
                    Start Shopping
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
