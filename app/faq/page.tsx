"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) is also available. International shipping times vary by destination.",
        },
        {
          question: "Do you offer free shipping?",
          answer:
            "Yes! We offer free carbon-neutral shipping on all orders over $450 within the United States.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email so you can monitor your package's progress.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship worldwide! International shipping rates and delivery times vary by destination. Please see our shipping page for more details.",
        },
      ],
    },
    {
      category: "Products & Materials",
      questions: [
        {
          question: "What materials are your baskets made from?",
          answer:
            "Our baskets are handcrafted from 100% natural materials including seagrass, palm leaves, water hyacinth, bamboo, and other sustainably sourced fibers.",
        },
        {
          question: "Are your baskets fair trade?",
          answer:
            "Yes! We work directly with artisan cooperatives across Africa, ensuring fair wages and supporting sustainable livelihoods for our Master Weavers.",
        },
        {
          question: "How do I care for my basket?",
          answer:
            "Keep your basket in a dry place and dust regularly with a soft brush. For deeper cleaning, use a damp cloth and mild soap, then air dry completely.",
        },
        {
          question: "Are the baskets food safe?",
          answer:
            "Our baskets are made from natural materials and are safe for storing dry goods. We recommend using a liner for direct food contact.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for items in original condition. Custom or personalized items cannot be returned unless defective.",
        },
        {
          question: "How do I return an item?",
          answer:
            "Contact us at returns@sirahats.com with your order number. We'll send you a prepaid return label and process your refund within 5-7 business days of receiving the item.",
        },
        {
          question: "Can I exchange an item for a different size?",
          answer:
            "Yes! We offer free exchanges within 30 days. Contact us to initiate an exchange and we'll send you the new item along with a return label.",
        },
        {
          question: "What if my item arrives damaged?",
          answer:
            "Contact us within 48 hours of delivery with photos of the damage. We'll immediately send a replacement or process a full refund.",
        },
      ],
    },
    {
      category: "Wholesale & Business",
      questions: [
        {
          question: "Do you offer wholesale pricing?",
          answer:
            "Yes! We work with retailers, interior designers, and other businesses. Please visit our wholesale page or contact wholesale@sirahats.com for more information.",
        },
        {
          question: "What are the minimum order requirements for wholesale?",
          answer:
            "Our minimum initial wholesale order is $250. We offer volume discounts and flexible payment terms for qualified businesses.",
        },
        {
          question: "Can I become a stockist?",
          answer:
            "We're always looking for retail partners who share our values. Please apply through our wholesale page or contact us directly to discuss partnership opportunities.",
        },
      ],
    },
  ];

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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our products, shipping, and
              policies.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <motion.section
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="bg-[#8BC34A] text-white p-6">
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => {
                    const itemIndex = categoryIndex * 100 + questionIndex;
                    const isOpen = openItems.includes(itemIndex);

                    return (
                      <div key={questionIndex}>
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-gray-600">{faq.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gray-50 p-8 rounded-lg text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our customer service team is
              here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:support@sirahats.com"
                className="inline-block border border-[#8BC34A] text-[#8BC34A] px-8 py-3 rounded-md font-medium hover:bg-[#8BC34A] hover:text-white transition-colors"
              >
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
