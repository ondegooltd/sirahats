"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function StockistsPage() {
  const stockists = [
    {
      name: "Artisan Home Gallery",
      address: "123 Design District, New York, NY 10001",
      phone: "+1 (212) 555-0123",
      email: "info@artisanhome.com",
      hours: "Mon-Sat: 10AM-7PM, Sun: 12PM-5PM",
      region: "Northeast",
    },
    {
      name: "Sustainable Living Store",
      address: "456 Green Street, San Francisco, CA 94102",
      phone: "+1 (415) 555-0456",
      email: "hello@sustainableliving.com",
      hours: "Mon-Sun: 9AM-8PM",
      region: "West Coast",
    },
    {
      name: "Heritage Crafts Boutique",
      address: "789 Main Street, Austin, TX 78701",
      phone: "+1 (512) 555-0789",
      email: "contact@heritagecrafts.com",
      hours: "Tue-Sat: 11AM-6PM, Sun: 1PM-5PM",
      region: "Southwest",
    },
    {
      name: "Coastal Home Decor",
      address: "321 Ocean Avenue, Miami, FL 33139",
      phone: "+1 (305) 555-0321",
      email: "info@coastalhome.com",
      hours: "Mon-Sat: 10AM-6PM, Sun: 12PM-4PM",
      region: "Southeast",
    },
    {
      name: "Urban Nest",
      address: "654 Michigan Avenue, Chicago, IL 60611",
      phone: "+1 (312) 555-0654",
      email: "hello@urbannest.com",
      hours: "Mon-Fri: 10AM-8PM, Sat-Sun: 10AM-6PM",
      region: "Midwest",
    },
    {
      name: "Mountain Home Co.",
      address: "987 Pearl Street, Boulder, CO 80302",
      phone: "+1 (303) 555-0987",
      email: "info@mountainhome.com",
      hours: "Mon-Sat: 9AM-7PM, Sun: 11AM-5PM",
      region: "Mountain West",
    },
  ];

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
              Find Our Stockists
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover Sirahats baskets at these carefully selected retail
              partners across the United States.
            </p>
          </motion.div>

          {/* Stockists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stockists.map((stockist, index) => (
              <motion.div
                key={stockist.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {stockist.name}
                  </h3>
                  <span className="inline-block bg-[#8BC34A] text-white px-3 py-1 rounded-full text-sm">
                    {stockist.region}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#8BC34A] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{stockist.address}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#8BC34A] flex-shrink-0" />
                    <a
                      href={`tel:${stockist.phone}`}
                      className="text-gray-600 text-sm hover:text-[#8BC34A] transition-colors"
                    >
                      {stockist.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#8BC34A] flex-shrink-0" />
                    <a
                      href={`mailto:${stockist.email}`}
                      className="text-gray-600 text-sm hover:text-[#8BC34A] transition-colors"
                    >
                      {stockist.email}
                    </a>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#8BC34A] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{stockist.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Become a Stockist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-gray-50 p-8 rounded-lg text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Become a Stockist
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Interested in carrying Sirahats baskets in your store? We'd love
              to partner with retailers who share our values of sustainability
              and craftsmanship.
            </p>
            <a
              href="/wholesale"
              className="inline-block bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
            >
              Learn About Wholesale
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
