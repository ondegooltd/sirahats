"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import Header from "@/components/header";

interface BuyNowFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
}

export default function BuyNowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState<BuyNowFormData>({
    email: session?.user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ghana",
    phone: "",
  });

  const productId = searchParams.get("productId");
  const productSlug = searchParams.get("slug");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  useEffect(() => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with purchase.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!productId && !productSlug) {
      toast({
        title: "Product Required",
        description: "No product selected for purchase.",
        variant: "destructive",
      });
      router.push("/shop");
      return;
    }

    // Load product details
    const loadProduct = async () => {
      try {
        let url = "";
        if (productId) {
          url = `/api/products/${productId}`;
        } else if (productSlug) {
          url = `/api/products?search=${productSlug}&limit=1`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const productData = productId ? data.data : data.data.products?.[0];
          if (productData) {
            setProduct(productData);
          } else {
            toast({
              title: "Product Not Found",
              description: "The selected product could not be found.",
              variant: "destructive",
            });
            router.push("/shop");
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
        router.push("/shop");
      }
    };

    loadProduct();
  }, [session?.user, productId, productSlug, router, toast]);

  const subtotal = product ? product.price * quantity : 0;
  const shipping = subtotal >= 450 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.email &&
          formData.firstName &&
          formData.lastName &&
          formData.phone
        );
      case 2:
        return !!(
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        );
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const createOrder = async () => {
    if (!product) {
      throw new Error("Product not found");
    }

    try {
      const orderData = {
        items: [
          {
            product: product._id,
            quantity: quantity,
            price: product.price,
            name: product.name,
            image: product.images[0],
          },
        ],
        subtotal,
        shipping,
        tax,
        total,
        status: "Pending",
        paymentStatus: "Pending",
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        user: session?.user.id,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const initializePayment = async (order: any) => {
    try {
      const reference = `BUYNOW_${order._id}_${Date.now()}`;

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          email: formData.email,
          reference,
          order_id: order._id,
          callback_url: `${window.location.origin}/checkout/success?orderId=${order._id}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error initializing payment:", error);
      throw error;
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsInitializingPayment(true);

    try {
      // Create order first
      const order = await createOrder();

      // Initialize payment
      const paymentData = await initializePayment(order);

      // Store order ID in sessionStorage for payment success handling
      sessionStorage.setItem("buyNowOrderId", order._id);

      // Redirect to Paystack payment page
      window.location.href = paymentData.authorization_url;
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsInitializingPayment(false);
    }
  };

  if (!session?.user || !product) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Buy Now</h1>
            <div className="w-16" />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-[#8BC34A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-[#8BC34A]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State/Region *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                        >
                          <option value="Ghana">Ghana</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Information
                    </h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Secure Payment with Paystack
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will be redirected to Paystack's secure payment page
                        to complete your purchase. We accept all major credit
                        cards, mobile money, and bank transfers.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isProcessing && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      <span>
                        {isProcessing ? "Processing..." : "Proceed to Payment"}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Product Details */}
                {product && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">Qty: {quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Shield size={16} />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck size={16} />
                    <span>
                      Free shipping on orders over {formatCurrency(1700)} (Ghana
                      only)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
