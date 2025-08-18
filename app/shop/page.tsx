"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, Grid, List } from "lucide-react";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import Footer from "@/components/footer";

const PRODUCTS_PER_PAGE = 12;

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Load products and collections on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all products
        const productsRes = await fetch("/api/products?limit=1000");
        const productsData = await productsRes.json();

        // Load collections for filter
        const collectionsRes = await fetch("/api/collections?limit=1000");
        const collectionsData = await collectionsRes.json();

        if (productsRes.ok && collectionsRes.ok) {
          setProducts(productsData.data.products || []);
          setCollections(collectionsData.data.collections || []);
        }
      } catch (error) {
        console.error("Error loading shop data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCollection =
        selectedCollection === "all" ||
        product.collectionId?._id === selectedCollection ||
        product.collectionId === selectedCollection;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesStock = !inStockOnly || product.inStock;

      return matchesSearch && matchesCollection && matchesPrice && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (b.isNewProduct ? 1 : 0) - (a.isNewProduct ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCollection,
    priceRange,
    sortBy,
    inStockOnly,
  ]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCollection("all");
    setPriceRange([0, 500]);
    setSortBy("name");
    setInStockOnly(false);
    setCurrentPage(1);
  };

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
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shop All Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our complete collection of handcrafted baskets from
              master artisans
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <button
                    title="btn"
                    onClick={resetFilters}
                    className="text-sm text-[#8BC34A] hover:text-[#689F38] transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    title="input"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                {/* Collections */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection
                  </label>
                  <select
                    title="select"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  >
                    <option value="all">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection._id} value={collection._id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₵{priceRange[0]} - ₵{priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      title="input"
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Number.parseInt(e.target.value),
                          priceRange[1],
                        ])
                      }
                      className="w-full"
                    />
                    <input
                      title="input"
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number.parseInt(e.target.value),
                        ])
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      title="input"
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      In stock only
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-4 rounded-lg shadow-sm mb-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <button
                      title="btn"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center space-x-2 text-gray-700 hover:text-[#8BC34A] transition-colors"
                    >
                      <Filter size={20} />
                      <span>Filters</span>
                    </button>

                    <p className="text-gray-600">
                      {filteredAndSortedProducts.length} product
                      {filteredAndSortedProducts.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Sort */}
                    <select
                      title="select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>

                    {/* View Mode */}
                    <div className="flex border border-gray-300 rounded-md">
                      <button
                        title="btn"
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${
                          viewMode === "grid"
                            ? "bg-[#8BC34A] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        } transition-colors`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        title="btn"
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${
                          viewMode === "list"
                            ? "bg-[#8BC34A] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        } transition-colors`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                      : "space-y-6"
                  }
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* No Results */}
              {!isLoading && filteredAndSortedProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-600 text-lg mb-4">
                    No products found matching your criteria.
                  </p>
                  <button
                    title="btn"
                    onClick={resetFilters}
                    className="text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                  >
                    Clear filters to see all products
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-12 flex justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <button
                      title="btn"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          title="btn"
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-md transition-colors ${
                            currentPage === page
                              ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      title="btn"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
