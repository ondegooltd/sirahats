"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

export default function EditOrderPage() {
  const [formData, setFormData] = useState({
    user: { firstName: "", lastName: "", email: "" },
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    items: [{ name: "", price: "", quantity: "" }],
    status: "pending",
    trackingNumber: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [orderFound, setOrderFound] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          setOrderFound(false);
          return;
        }
        const json = await res.json();
        const o = json.data;
        setFormData({
          user: {
            firstName: o.user?.firstName || "",
            lastName: o.user?.lastName || "",
            email: o.user?.email || "",
          },
          shippingAddress: {
            address: o.shippingAddress?.address || "",
            city: o.shippingAddress?.city || "",
            state: o.shippingAddress?.state || "",
            zipCode: o.shippingAddress?.zipCode || "",
            country: o.shippingAddress?.country || "",
          },
          items: (o.items || []).map((it: any) => ({
            name: it.name,
            price: String(it.price),
            quantity: String(it.quantity),
          })),
          status: (o.status || "pending").toLowerCase(),
          trackingNumber: o.trackingNumber || "",
          notes: o.notes || "",
        });
      } catch (e) {
        console.error(e);
        setOrderFound(false);
      } finally {
        setIsFetching(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: { ...(prev as any)[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", price: "", quantity: "" }],
    }));
  const removeItem = (index: number) => {
    if (formData.items.length > 1)
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.user.firstName || !formData.user.email) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required customer fields.",
          variant: "destructive",
        });
        return;
      }

      // Prepare payload — backend expects proper shapes; keep fields we can update
      const payload: any = {
        status: formData.status,
        trackingNumber: formData.trackingNumber,
        notes: formData.notes,
      };

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to update order");
      }

      toast({
        title: "Order Updated",
        description: "The order has been successfully updated.",
        variant: "success",
      });
      router.push(`/admin/orders/${orderId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderFound) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-gray-500">Loading...</div>
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
          className="flex items-center space-x-4"
        >
          <Link
            href={`/admin/orders/${orderId}`}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
            <p className="text-gray-600">
              Update order information and details
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white shadow rounded-lg"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Order Status & Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Order Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="trackingNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  placeholder="Enter tracking number"
                />
              </div>
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
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                placeholder="Add notes about this order"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={`/admin/orders/${orderId}`}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Order"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
