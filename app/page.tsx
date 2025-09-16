"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Recycle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { featuredProducts as sampleProducts } from "@/data/products";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProducts, setScrollProducts] = useState<Product[]>([]);

  // Carousel slides data
  const carouselSlides = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/duznylrc6/image/upload/v1755000916/learther-straw-hat_zmdrw3.jpg?v=1740404362&width=2048",
      title: "Handcrafted Baskets",
      subtitle:
        "Discover our collection of beautiful, sustainable baskets made by skilled artisans",
      primaryButton: { text: "Shop Now", href: "/shop" },
      secondaryButton: { text: "View Collections", href: "/collections" },
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/duznylrc6/image/upload/v1755000932/Home-image_sty0rq.jpg?height=400&width=600",
      title: "Authentic Ghanaian Products",
      subtitle:
        "Premium leather bags, straw products, and shea butter from local artisans",
      primaryButton: { text: "Explore Products", href: "/shop" },
      secondaryButton: { text: "Learn More", href: "/about" },
    },
    {
      id: 3,
      image:
        "https://res.cloudinary.com/duznylrc6/image/upload/v1755000943/seated_weaver_gctuh3.jpg?v=1740404362&width=2048",
      title: "Sustainable & Ethical",
      subtitle: "Supporting women artisans and sustainable practices in Ghana",
      primaryButton: { text: "Our Story", href: "/about" },
      secondaryButton: { text: "Wholesale", href: "/wholesale" },
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured products (first 8 products)
        const productsRes = await fetch(
          "/api/products?limit=4&sortBy=createdAt&sortOrder=desc"
        );
        const productsData = await productsRes.json();

        // Load scroll products (more products for horizontal scroll)
        const scrollProductsRes = await fetch(
          "/api/products?limit=12&sortBy=createdAt&sortOrder=desc"
        );
        const scrollProductsData = await scrollProductsRes.json();

        // Load collections (first 3)
        const collectionsRes = await fetch(
          "/api/collections?limit=3&sortBy=createdAt&sortOrder=desc"
        );
        const collectionsData = await collectionsRes.json();

        if (productsRes.ok && collectionsRes.ok) {
          console.log("Featured products data:", productsData);
          console.log("Scroll products data:", scrollProductsData);
          const apiProducts = productsData.data?.products || [];
          const apiScrollProducts = scrollProductsData.data?.products || [];

          // Use API data if available, otherwise fall back to sample data
          const mappedSampleProducts = sampleProducts.map((product) => ({
            ...product,
            isNewProduct: product.isNew || false,
            createdAt: product.createdAt.toString(),
            updatedAt: product.updatedAt.toString(),
          }));
          setFeaturedProducts(
            apiProducts.length > 0
              ? apiProducts
              : mappedSampleProducts.slice(0, 8)
          );
          setScrollProducts(
            apiScrollProducts.length > 0
              ? apiScrollProducts
              : mappedSampleProducts.slice(0, 12)
          );
          setCollections(collectionsData.data?.collections || []);
        } else {
          console.log("API responses not ok:", {
            productsRes: productsRes.ok,
            collectionsRes: collectionsRes.ok,
          });
          // Use sample data as fallback
          const mappedSampleProducts = sampleProducts.map((product) => ({
            ...product,
            isNewProduct: product.isNew || false,
            createdAt: product.createdAt.toString(),
            updatedAt: product.updatedAt.toString(),
          }));
          setFeaturedProducts(mappedSampleProducts.slice(0, 8));
          setScrollProducts(mappedSampleProducts.slice(0, 12));
        }
      } catch (error) {
        console.error("Error loading home page data:", error);
        // Use sample data as fallback in case of error
        const mappedSampleProducts = sampleProducts.map((product) => ({
          ...product,
          isNewProduct: product.isNew || false,
          createdAt: product.createdAt.toString(),
          updatedAt: product.updatedAt.toString(),
        }));
        setFeaturedProducts(mappedSampleProducts.slice(0, 8));
        setScrollProducts(mappedSampleProducts.slice(0, 12));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Horizontal scroll functionality
  const scrollLeft = () => {
    const container = document.getElementById("horizontal-scroll-container");
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("horizontal-scroll-container");
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <Header />
        {/* Hero Carousel */}
        <section className="relative md:h-screen h-[80vh] overflow-hidden">
          {/* Carousel Container */}
          <div className="relative w-full h-full">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
              </div>
            ))}

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <motion.h1
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  {carouselSlides[currentSlide].title}
                </motion.h1>
                <motion.p
                  key={`subtitle-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl mb-8 text-gray-200"
                >
                  {carouselSlides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  key={`buttons-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-x-2 md:space-x-4"
                >
                  <Link
                    href={carouselSlides[currentSlide].primaryButton.href}
                    className="inline-flex m-3 items-center bg-[#8BC34A] text-white px-4 py-2 md:px-8 md:py-4 rounded-md text-sm md:text-lg font-medium hover:bg-[#689F38] transition-colors"
                  >
                    {carouselSlides[currentSlide].primaryButton.text}
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                  <Link
                    href={carouselSlides[currentSlide].secondaryButton.href}
                    className="inline-flex items-center border-2 border-white text-white px-4 py-2 md:px-8 md:py-4 rounded-md text-sm md:text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    {carouselSlides[currentSlide].secondaryButton.text}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1 md:space-x-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-2">
                  Latest Products
                </h2>
                <p className="md:text-lg text-gray-600">
                  Discover our newest handcrafted creations
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex space-x-1 md:space-x-2">
                <button
                  onClick={scrollLeft}
                  className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex space-x-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                id="horizontal-scroll-container"
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
              >
                {scrollProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-64"
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                See Our Artisans at Work
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch the skilled craftsmanship and traditional techniques that
                go into creating our beautiful products
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source
                    src="https://res.cloudinary.com/duznylrc6/video/upload/v1758031451/WhatsApp_Video_2025-09-16_at_13.08.06_1_o3hhut.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
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
