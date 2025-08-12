"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Order Not Found",
        description: "No order ID provided.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    const fetchOrderAndVerifyPayment = async () => {
      try {
        setIsLoading(true);

        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order");
        }
        const orderData = await orderResponse.json();
        setOrder(orderData.data);

        // Verify payment if reference is provided
        if (reference || trxref) {
          const paymentRef = reference || trxref;
          const paymentResponse = await fetch(
            `/api/payment?reference=${paymentRef}`
          );
          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            setPaymentStatus(paymentData.data.status);

            if (paymentData.data.status === "success") {
              toast({
                title: "Payment Successful!",
                description: "Your payment has been processed successfully.",
                variant: "success",
              });
            } else {
              toast({
                title: "Payment Pending",
                description:
                  "Your payment is being processed. You will receive a confirmation shortly.",
                variant: "default",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderAndVerifyPayment();
  }, [orderId, reference, trxref, router, toast]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The specified order could not be found.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const estimatedDelivery = new Date(
    order.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
            {paymentStatus === "success" && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Payment completed successfully
                </p>
              </div>
            )}
            {paymentStatus === "pending" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⏳ Payment is being processed. You will receive a confirmation
                  shortly.
                </p>
              </div>
            )}
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <span className="text-sm text-gray-600">
                Order #{order.orderNumber}
              </span>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item: any) => (
                <div
                  key={`${item.product._id}-${item.product.slug}`}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {order.shipping === 0
                    ? "Free"
                    : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  {formatCurrency(order.tax)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Estimated Delivery
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Order Confirmed
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    order.status === "processing" ||
                    order.status === "shipped" ||
                    order.status === "delivered"
                      ? "bg-[#8BC34A]"
                      : "bg-gray-200"
                  }`}
                >
                  <Package
                    className={`w-5 h-5 ${
                      order.status === "processing" ||
                      order.status === "shipped" ||
                      order.status === "delivered"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm ${
                    order.status === "processing" ||
                    order.status === "shipped" ||
                    order.status === "delivered"
                      ? "font-medium text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {order.status === "pending" ? "Processing" : order.status}
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 rounded"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    order.status === "shipped" || order.status === "delivered"
                      ? "bg-[#8BC34A]"
                      : "bg-gray-200"
                  }`}
                >
                  <Truck
                    className={`w-5 h-5 ${
                      order.status === "shipped" || order.status === "delivered"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm ${
                    order.status === "shipped" || order.status === "delivered"
                      ? "font-medium text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  Shipped
                </span>
              </div>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-[#8BC34A] text-white rounded-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-2">
              Thank You for Supporting Artisans
            </h2>
            <p className="text-sm opacity-90">
              Your purchase directly supports skilled artisans and their
              communities across Africa. Each handcrafted piece tells a story of
              tradition, skill, and cultural heritage.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/account/orders"
              className="flex items-center justify-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors border border-gray-300"
            >
              <Package className="w-5 h-5" />
              <span>View Order History</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center space-x-2 bg-[#8BC34A] text-white px-6 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
