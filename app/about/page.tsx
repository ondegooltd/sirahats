"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Header />{" "}
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-[#8BC34A] to-[#689F38]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About Sirahats Ghana
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                A Ghanaian owned business focusing on producing, packaging, and
                selling locally woven straw products, leather products and shea
                butter products using environmentally friendly and sustainable
                local resources.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Sirahats Ghana is a Ghanaian owned business focusing on
                  producing, packaging, and selling locally woven straw
                  products, leather products and shea butter products. These
                  products are all produced using local resources which are
                  environmentally friendly and sustainable.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  This is part of our policy to contribute to reduce the effects
                  of climate change. We are committed to creating a sustainable
                  bridge between traditional Ghanaian craftsmanship and the
                  global market, ensuring that these beautiful traditions
                  continue to thrive for future generations.
                </p>
                <p className="text-lg text-gray-600">
                  Sirahats as an entity will always produce exclusive Authentic
                  handmade products for its consumer.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-96 rounded-lg overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/duznylrc6/image/upload/v1755000932/Home-image_sty0rq.jpg?height=400&width=600"
                  // src="/placeholder.svg?height=400&width=600"
                  alt="Artisan at work"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We Produce */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What We Produce
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We specialize in three main categories of authentic Ghanaian
                products, all crafted using traditional methods and sustainable
                local resources.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🧺</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Straw Products
                </h3>
                <p className="text-gray-600">
                  Handwoven baskets and straw products crafted by skilled
                  artisans using traditional techniques passed down through
                  generations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👜</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Leather Bags
                </h3>
                <p className="text-gray-600">
                  Premium leather bags and accessories made from locally sourced
                  materials, combining traditional craftsmanship with modern
                  design.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🧴</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Shea Butter
                </h3>
                <p className="text-gray-600">
                  Pure, natural shea butter products extracted using traditional
                  methods, providing nourishment and care for skin and hair.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Pricing */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our prices are very competitive. All our products are of high
                quality and designed with the consumer in mind.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Us
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                We are an organization made of young people committed to
                collaborating with local women to produce the best products for
                our consumers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Women Empowerment
                </h3>
                <p className="text-gray-600">
                  Through our business model, we train and use rural women in
                  the weaving and packing of our products, providing them with
                  sustainable livelihood.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Competitive Prices
                </h3>
                <p className="text-gray-600">
                  Sirahats has competitive prices for all our products. We're
                  dedicated to offering the finest handcrafted products while
                  supporting community development.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center bg-white p-8 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Authentic Handcrafted
                </h3>
                <p className="text-gray-600">
                  We're dedicated to offering the finest handcrafted baskets,
                  leather goods, and shea butter products while empowering women
                  artisans.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Where Are We Located */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Where Are We Located
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are located within Bolgatanga and Vea within the Upper East
                Region of Ghana, West Africa.
              </p>
            </motion.div>

            <div className="bg-gradient-to-r from-[#8BC34A] to-[#689F38] rounded-lg p-8 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Upper East Region, Ghana
              </h3>
              <p className="text-lg mb-2">Bolgatanga and Vea</p>
              <p className="text-sm opacity-90">West Africa</p>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Behind every product is a skilled artisan with years of
                experience and a deep connection to their craft. These talented
                individuals are the heart and soul of Sirahats Ghana.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=128&width=128`}
                      alt={`Team Member ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Team Member Name
                  </h3>
                  <p className="text-gray-600 mb-2">Artisan from Ghana</p>
                  <p className="text-sm text-gray-500">
                    "Crafting is not just my skill, it's my heritage and my gift
                    to the world."
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
