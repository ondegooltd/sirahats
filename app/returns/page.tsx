"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import { RotateCcw, Shield, CheckCircle } from "lucide-react";

export default function ReturnsPage() {
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
              Returns & Exchanges
            </h1>
            <p className="text-lg text-gray-600">
              We want you to love your baskets. If you're not completely
              satisfied, we're here to help.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Return Policy */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <RotateCcw className="w-8 h-8 text-[#8BC34A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  30-Day Return Policy
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                You have 30 days from the date of delivery to return your items
                for a full refund or exchange.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    What can be returned:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Items in original condition</li>
                    <li>• Unused baskets with tags attached</li>
                    <li>• Items in original packaging</li>
                    <li>• Non-personalized items</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    What cannot be returned:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Custom or personalized items</li>
                    <li>• Items damaged by normal wear</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Items without original packaging</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* How to Return */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How to Return an Item
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Contact Us
                  </h3>
                  <p className="text-sm text-gray-600">
                    Email us at returns@sirahats.com with your order number
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Get Label
                  </h3>
                  <p className="text-sm text-gray-600">
                    We'll send you a prepaid return shipping label
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Pack & Ship
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pack your item securely and attach the return label
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Get Refund
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive your refund within 5-7 business days
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Exchanges */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-[#8BC34A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Exchanges</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Need a different size or style? We offer free exchanges within
                30 days of purchase.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Exchange Process:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Contact us to initiate an exchange</li>
                  <li>• We'll send you the new item and a return label</li>
                  <li>• Return the original item within 14 days</li>
                  <li>• No additional shipping charges for exchanges</li>
                </ul>
              </div>
            </motion.section>

            {/* Damaged Items */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#8BC34A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Damaged or Defective Items
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                If your item arrives damaged or defective, we'll make it right
                immediately.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    What to do:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Contact us within 48 hours of delivery</li>
                    <li>• Provide photos of the damaged item</li>
                    <li>• Include your order number</li>
                    <li>• Keep all original packaging</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    We'll provide:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Immediate replacement or refund</li>
                    <li>• Prepaid return label if needed</li>
                    <li>• Priority processing for replacements</li>
                    <li>• Full investigation of shipping issues</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-[#8BC34A] text-white p-8 rounded-lg text-center"
            >
              <h2 className="text-2xl font-bold mb-4">
                Need Help with a Return?
              </h2>
              <p className="mb-6">
                Our customer service team is here to help make your return
                process as smooth as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@sirahats.com"
                  className="inline-block bg-white text-[#8BC34A] px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Email Returns Team
                </a>
                <a
                  href="tel:+233300008299"
                  className="inline-block border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-[#8BC34A] transition-colors"
                >
                  Call +233 30000-8299
                </a>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
