"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

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

export default function CollectionPage({ params }: CollectionPageProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = params;

  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        // Load collection by slug
        const collectionRes = await fetch(
          `/api/collections?search=${slug}&limit=1`
        );
        if (collectionRes.ok) {
          const collectionData = await collectionRes.json();
          const foundCollection = collectionData.data.collections?.[0];

          if (foundCollection) {
            setCollection(foundCollection);

            // Load products for this collection
            const productsRes = await fetch(
              `/api/products?collectionId=${foundCollection._id}&limit=1000`
            );
            if (productsRes.ok) {
              const productsData = await productsRes.json();
              setProducts(productsData.data.products || []);
            }
          }
        }
      } catch (error) {
        console.error("Error loading collection data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollectionData();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="bg-gray-200 aspect-[3/1] rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Collection Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The collection you're looking for doesn't exist.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collections
              </Link>
            </div>
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
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#8BC34A] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/collections"
                  className="hover:text-[#8BC34A] transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">{collection.name}</li>
            </ol>
          </motion.nav>

          {/* Collection Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative aspect-[3/1] overflow-hidden rounded-lg mb-8">
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {collection.name}
                  </h1>
                  <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                    {collection.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Products in {collection.name}
              </h2>
              <span className="text-gray-600">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  This collection doesn't have any products yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
                >
                  Browse All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Back to Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              href="/collections"
              className="inline-flex items-center text-[#8BC34A] hover:text-[#689F38] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Collections
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
