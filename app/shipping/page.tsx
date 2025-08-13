"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import { Truck, Package, Globe, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-gray-600">
              Fast, secure, and carbon-neutral shipping for all your basket
              orders.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Shipping Options */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="w-8 h-8 text-[#8BC34A] mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Standard Shipping
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-3">5-7 business days</p>
                  <p className="text-lg font-semibold text-gray-900">₵20.00</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Free on orders over ₵450
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Package className="w-8 h-8 text-[#8BC34A] mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Express Shipping
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-3">2-3 business days</p>
                  <p className="text-lg font-semibold text-gray-900">₵50.00</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Available for most locations
                  </p>
                </div>
              </div>
            </motion.section>

            {/* International Shipping */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-[#8BC34A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  International Shipping
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                We ship worldwide! International shipping rates and delivery
                times vary by destination.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Canada</h3>
                  <p className="text-gray-600">7-10 business days</p>
                  <p className="font-semibold">Starting at $20</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Europe</h3>
                  <p className="text-gray-600">10-14 business days</p>
                  <p className="font-semibold">Starting at $35</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Rest of World
                  </h3>
                  <p className="text-gray-600">14-21 business days</p>
                  <p className="font-semibold">Starting at $45</p>
                </div>
              </div>
            </motion.section>

            {/* Processing Time */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-[#8BC34A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Processing Time
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                Most orders are processed and shipped within 1-2 business days.
                Custom orders may take 3-5 business days.
              </p>

              <ul className="space-y-2 text-gray-600">
                <li>• Orders placed before 2 PM EST ship the same day</li>
                <li>• Weekend orders are processed on Monday</li>
                <li>• Holiday processing times may vary</li>
                <li>
                  • You'll receive tracking information once your order ships
                </li>
              </ul>
            </motion.section>

            {/* Packaging */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gray-50 p-8 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sustainable Packaging
              </h2>

              <p className="text-gray-600 mb-4">
                We're committed to protecting both your baskets and the
                environment:
              </p>

              <ul className="space-y-2 text-gray-600">
                <li>• 100% recyclable packaging materials</li>
                <li>• Minimal packaging to reduce waste</li>
                <li>• Biodegradable packing peanuts when needed</li>
                <li>• Carbon-neutral shipping on all orders</li>
              </ul>
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
