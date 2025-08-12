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
                About Sirahats
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Celebrating the artistry and heritage of African basket weaving
                through generations of Master Weavers
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
                  Sirahats was founded with a simple yet profound mission: to
                  preserve and celebrate the ancient art of African basket
                  weaving while providing sustainable livelihoods for skilled
                  artisans across the continent.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our journey began when we witnessed the extraordinary talent
                  of Master Weavers whose skills have been passed down through
                  generations. These artisans possess an innate ability to
                  transform natural materials into functional works of art that
                  tell stories of tradition, culture, and resilience.
                </p>
                <p className="text-lg text-gray-600">
                  Today, we work directly with weaving cooperatives in Ghana,
                  Senegal, Morocco, Kenya, Uganda, and Rwanda, ensuring fair
                  trade practices and supporting entire communities through the
                  preservation of their cultural heritage.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-96 rounded-lg overflow-hidden"
              >
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Artisan at work"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are committed to creating a sustainable bridge between
                traditional African craftsmanship and the global market,
                ensuring that these beautiful traditions continue to thrive for
                future generations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sustainability
                </h3>
                <p className="text-gray-600">
                  We use only natural, sustainably sourced materials and support
                  eco-friendly practices in all our operations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Fair Trade
                </h3>
                <p className="text-gray-600">
                  We ensure fair compensation for all artisans and maintain
                  transparent, ethical business practices.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Artistry
                </h3>
                <p className="text-gray-600">
                  We celebrate and preserve traditional weaving techniques while
                  encouraging innovation and creativity.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Artisans */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Meet Our Master Weavers
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Behind every basket is a skilled artisan with years of
                experience and a deep connection to their craft. These Master
                Weavers are the heart and soul of Sirahats.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=128&width=128`}
                      alt={`Master Weaver ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Artisan Name
                  </h3>
                  <p className="text-gray-600 mb-2">Master Weaver from Ghana</p>
                  <p className="text-sm text-gray-500">
                    "Weaving is not just my craft, it's my heritage and my gift
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
