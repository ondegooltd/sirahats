"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Headphones, Recycle } from "lucide-react";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  collectionId: any;
  inStock: boolean;
  isNewProduct: boolean;
  materials: string[];
  dimensions: string;
  origin: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured products (first 8 products)
        const productsRes = await fetch(
          "/api/products?limit=8&sortBy=createdAt&sortOrder=desc"
        );
        const productsData = await productsRes.json();

        // Load collections (first 3)
        const collectionsRes = await fetch(
          "/api/collections?limit=3&sortBy=createdAt&sortOrder=desc"
        );
        const collectionsData = await collectionsRes.json();

        if (productsRes.ok && collectionsRes.ok) {
          setFeaturedProducts(productsData.data.products || []);
          setCollections(collectionsData.data.collections || []);
        }
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <Header />
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/duznylrc6/image/upload/v1755000916/learther-straw-hat_zmdrw3.jpg?v=1740404362&width=2048"
              // src="https://babatree.com/cdn/shop/files/2025-slide.webp?v=1740404362&width=2048"
              alt="Beautiful handcrafted baskets"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Handcrafted Baskets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Discover our collection of beautiful, sustainable baskets made by
              skilled artisans
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-x-4"
            >
              <Link
                href="/shop"
                className="inline-flex items-center bg-[#8BC34A] text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-[#689F38] transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
              >
                View Collections
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular handcrafted baskets, each piece
                telling a unique story of traditional craftsmanship
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/shop"
                className="inline-flex items-center bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
              >
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Collections Preview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Collections
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our curated collections, each representing different
                styles and traditions from around the world
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-bold text-center">
                            {collection.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 group-hover:text-[#8BC34A] transition-colors">
                        {collection.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/collections"
                className="inline-flex items-center border-2 border-[#8BC34A] text-[#8BC34A] px-8 py-3 rounded-md font-medium hover:bg-[#8BC34A] hover:text-white transition-colors"
              >
                View All Collections
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Sirahats
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to bringing you the finest handcrafted baskets
                while supporting artisan communities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  description:
                    "Free shipping on orders over ¢1700 (Ghana only).",
                },
                {
                  icon: Shield,
                  title: "Quality Guarantee",
                  description: "30-day money-back guarantee",
                },
                {
                  icon: Headphones,
                  title: "Expert Support",
                  description: "Dedicated customer service team",
                },
                {
                  icon: Recycle,
                  title: "Sustainable",
                  description: "Eco-friendly and ethically sourced",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A] text-white rounded-full mb-4">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-[#8BC34A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Subscribe to our newsletter for the latest products and
                exclusive offers
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-[#8BC34A] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
