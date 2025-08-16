"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-gray-600" },
  {
    value: "processing",
    label: "Processing",
    icon: Package,
    color: "text-yellow-600",
  },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-blue-600" },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
  },
];

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to load order");
        const json = await res.json();
        setOrder(json.data);
        setTrackingNumber(json.data?.trackingNumber || "");
        setNotes(json.data?.notes || "");
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Failed to load order",
          variant: "destructive",
        });
      }
    };
    loadOrder();
  }, [orderId]);

  const updateOrderStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      const json = await res.json();
      setOrder(json.data);
      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTrackingInfo = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber, notes }),
      });
      if (!res.ok) throw new Error("Failed to update tracking information");
      const json = await res.json();
      setOrder(json.data);
      toast({
        title: "Tracking Updated",
        description: "Tracking information has been updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tracking information.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Awaiting Payment":
        return "bg-gray-100 text-gray-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentStatus = statusOptions.find(
    (s) => s.value === (order?.status || "").toLowerCase()
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/orders"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order?.orderNumber || ""}
              </h1>
              {order && (
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Link
            href={`/admin/orders/${orderId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Order
          </Link>
        </motion.div>

        {!order ? (
          <div className="py-24 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Update */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Status
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  {currentStatus && (
                    <div className="flex items-center space-x-2">
                      <currentStatus.icon
                        className={`w-5 h-5 ${currentStatus.color}`}
                      />
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          (order.status || "").toLowerCase()
                        )}`}
                      >
                        {currentStatus.label}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => updateOrderStatus(status.value)}
                      disabled={
                        isUpdating ||
                        (order.status || "").toLowerCase() === status.value
                      }
                      className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                        (order.status || "").toLowerCase() === status.value
                          ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <status.icon className="w-4 h-4 mx-auto mb-1" />
                      {status.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items{" "}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus || "Not Paid"}
                  </span>
                </h3>
                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₵{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        ₵{order.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        ₵{order.shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">
                        ₵{order.tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ₵{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tracking Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tracking & Notes
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="tracking"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Order Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      placeholder="Add notes about this order"
                    />
                  </div>
                  <button
                    onClick={updateTrackingInfo}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Tracking Info"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Customer & Address Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{order.user?.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white shadow rounded-lg p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-900">
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
