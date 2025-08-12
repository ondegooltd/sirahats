"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import { Package, Truck, Users, Award, DollarSign, Clock } from "lucide-react";

export default function WholesalePage() {
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Wholesale Partnership
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our network of retail partners and bring authentic African
              craftsmanship to your customers.
            </p>
          </motion.div>

          {/* Benefits */}
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Why Partner with Sirahats?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: "Premium Quality",
                  description:
                    "Handcrafted baskets made by skilled artisans using traditional techniques and premium materials.",
                },
                {
                  icon: DollarSign,
                  title: "Competitive Pricing",
                  description:
                    "Attractive wholesale margins with volume discounts and flexible payment terms.",
                },
                {
                  icon: Truck,
                  title: "Reliable Shipping",
                  description:
                    "Fast, secure shipping with tracking and insurance. Free shipping on orders over $500.",
                },
                {
                  icon: Users,
                  title: "Marketing Support",
                  description:
                    "Product photography, descriptions, and marketing materials to help you sell effectively.",
                },
                {
                  icon: Package,
                  title: "Diverse Inventory",
                  description:
                    "Wide range of styles, sizes, and price points to suit different customer preferences.",
                },
                {
                  icon: Clock,
                  title: "Quick Turnaround",
                  description:
                    "Most orders ship within 2-3 business days with expedited options available.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border text-center"
                >
                  <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-16 bg-gray-50 p-8 rounded-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Partnership Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Minimum Requirements
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Established retail business with valid tax ID</li>
                    <li>
                      • Physical storefront or established online presence
                    </li>
                    <li>• Minimum initial order of $250</li>
                    <li>• Commitment to brand values and quality standards</li>
                    <li>• Professional product presentation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Preferred Partners
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Home decor and lifestyle retailers</li>
                    <li>• Sustainable and eco-friendly stores</li>
                    <li>• Art galleries and craft boutiques</li>
                    <li>• Interior design showrooms</li>
                    <li>• Fair trade and ethical retailers</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Application Form */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Apply for Wholesale Account
              </h2>

              <form className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="retail-store">Retail Store</option>
                    <option value="online-store">Online Store</option>
                    <option value="interior-design">Interior Design</option>
                    <option value="gallery">Art Gallery</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="taxId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tax ID / EIN *
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tell us about your business
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe your business, target customers, and why you'd like to carry Sirahats products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8BC34A] text-white py-3 px-6 rounded-md font-medium hover:bg-[#689F38] transition-colors"
                >
                  Submit Application
                </button>
              </form>
            </motion.div>
          </section>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gray-50 p-8 rounded-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions?
            </h2>
            <p className="text-gray-600 mb-4">
              Our wholesale team is here to help you get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:wholesale@sirahats.com"
                className="inline-block bg-[#8BC34A] text-white px-6 py-2 rounded-md font-medium hover:bg-[#689F38] transition-colors"
              >
                Email Wholesale Team
              </a>
              <a
                href="tel:+15551234567"
                className="inline-block border border-[#8BC34A] text-[#8BC34A] px-6 py-2 rounded-md font-medium hover:bg-[#8BC34A] hover:text-white transition-colors"
              >
                Call (555) 123-4567
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
