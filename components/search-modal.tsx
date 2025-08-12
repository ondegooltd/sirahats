"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  inStock: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          performSearch(searchQuery);
        }, 300);
      };
    })(),
    []
  );

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);

      const response = await fetch(
        `/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      setResults(data.data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Load featured products when modal opens
      if (!hasSearched && query.trim() === "") {
        loadFeaturedProducts();
      }
    } else {
      document.body.style.overflow = "unset";
      // Reset state when modal closes
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "/api/products?limit=4&sortBy=createdAt&sortOrder=desc"
      );

      if (!response.ok) {
        throw new Error("Failed to load featured products");
      }

      const data = await response.json();
      setResults(data.data.products || []);
    } catch (error) {
      console.error("Error loading featured products:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="flex items-center p-4 border-b">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search for baskets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <button
                title="btn"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Results */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8BC34A]" />
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              ) : (
                <>
                  {query.trim() !== "" && hasSearched && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {results.length} result{results.length !== 1 ? "s" : ""}{" "}
                        for "{query}"
                      </p>
                    </div>
                  )}

                  {!hasSearched && query.trim() === "" && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Featured products</p>
                    </div>
                  )}

                  {results.length > 0 ? (
                    <div className="space-y-3">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-[#8BC34A] transition-colors truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {product.category}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900">
                                ₵{product.price.toFixed(2)}
                              </p>
                              {!product.inStock && (
                                <span className="text-xs text-red-600 font-medium">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {query.trim() !== "" ? (
                        <>
                          <p className="text-gray-500">
                            No products found for "{query}"
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Try searching for "storage", "decor", or "tote"
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">
                          Loading featured products...
                        </p>
                      )}
                    </div>
                  )}

                  {query.trim() !== "" && results.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href={`/shop?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="block text-center text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                      >
                        View all results for "{query}" →
                      </Link>
                    </div>
                  )}

                  {!hasSearched &&
                    query.trim() === "" &&
                    results.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="block text-center text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                        >
                          View all products →
                        </Link>
                      </div>
                    )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
