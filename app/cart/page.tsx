"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to update your cart.",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      setUpdatingItem(id);
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      // Update local state for immediate UI feedback
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (id: string) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to update your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      setRemovingItem(id);
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update local state for immediate UI feedback
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setRemovingItem(null);
    }
  };

  // Show loading state while cart is being fetched
  if (state.isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto mb-4" />
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (state.items.length === 0) {
    return (
      <>
        <Header />{" "}
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover our beautiful collection of handcrafted baskets.
              </p>
              <Link
                href="/collections"
                className="inline-block bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in
              your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-0">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            title="btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updatingItem === item.id}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            {updatingItem === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                          </button>
                          <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            title="btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingItem === item.id}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            {updatingItem === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          title="btn"
                          onClick={() => removeItem(item.id)}
                          disabled={removingItem === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        >
                          {removingItem === item.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(state.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {state.total >= 450 ? "Free" : formatCurrency(15)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      {formatCurrency(state.total * 0.08)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">
                        {formatCurrency(
                          state.total +
                            (state.total >= 450 ? 0 : 15) +
                            state.total * 0.08
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {state.total < 450 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
                    <p className="text-sm text-yellow-800">
                      Add {formatCurrency(450 - state.total)} more for free
                      shipping!
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="w-full bg-[#8BC34A] text-white py-3 px-6 rounded-md font-medium hover:bg-[#689F38] transition-colors mb-4 text-center block"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/collections"
                  className="block text-center text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
