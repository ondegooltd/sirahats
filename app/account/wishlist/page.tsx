"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

interface WishlistProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  category: string;
  inStock: boolean;
}

interface RecommendedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  category: string;
  inStock: boolean;
  collectionId?: {
    name: string;
    slug: string;
  };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const { dispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session?.user, router]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      setWishlistItems(data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true);
      const response = await fetch("/api/products/recommendations");
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      setRecommendedProducts(data.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Don't show error toast for recommendations as it's not critical
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchWishlist();
      fetchRecommendations();
    }
  }, [session?.user]);

  const removeFromWishlist = async (productId: string) => {
    try {
      setIsRemoving(productId);
      const response = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      const data = await response.json();
      setWishlistItems(data.data);

      // Refresh recommendations after removing from wishlist
      fetchRecommendations();

      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  const addToCart = async (product: WishlistProduct | RecommendedProduct) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          slug: product.slug,
        },
      });

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  if (!session?.user) {
    return null;
  }

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
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/account"
                className="text-[#8BC34A] hover:text-[#689F38] transition-colors"
              >
                ← Back to Account
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {isLoading
                ? "Loading..."
                : `${wishlistItems.length} ${
                    wishlistItems.length === 1 ? "item" : "items"
                  } saved for later`}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse"
                >
                  <div className="relative aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden group"
                    >
                      <div className="relative">
                        <Link href={`/product/${item.slug}`}>
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          disabled={isRemoving === item._id}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {isRemoving === item._id ? (
                            <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                          ) : (
                            <X className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      <div className="p-4">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-medium text-gray-900 mb-1 hover:text-[#8BC34A] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.category}
                        </p>
                        <p className="font-semibold text-gray-900 mb-4">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="space-y-2">
                          <button
                            onClick={() => addToCart(item)}
                            disabled={!item.inStock}
                            className="w-full flex items-center justify-center space-x-2 bg-[#8BC34A] text-white py-2 px-4 rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>
                              {item.inStock ? "Add to Cart" : "Out of Stock"}
                            </span>
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            disabled={isRemoving === item._id}
                            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            {isRemoving === item._id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Your wishlist is empty
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Start adding items to your wishlist to see them here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors"
                  >
                    Start Shopping
                  </Link>
                </motion.div>
              )}

              {/* Recommendations */}
              {wishlistItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-16"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    You might also like
                  </h2>

                  {isLoadingRecommendations ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse"
                        >
                          <div className="relative aspect-square bg-gray-200"></div>
                          <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recommendedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {recommendedProducts.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-white rounded-lg shadow-sm border overflow-hidden group"
                        >
                          <div className="relative">
                            <Link href={`/product/${product.slug}`}>
                              <div className="relative aspect-square overflow-hidden">
                                <Image
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </Link>
                          </div>

                          <div className="p-4">
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#8BC34A] transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 mb-2">
                              {product.category}
                            </p>
                            <p className="font-semibold text-gray-900 mb-4">
                              {formatCurrency(product.price)}
                            </p>

                            <button
                              onClick={() => addToCart(product)}
                              disabled={!product.inStock}
                              className="w-full flex items-center justify-center space-x-2 bg-[#8BC34A] text-white py-2 px-4 rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>
                                {product.inStock
                                  ? "Add to Cart"
                                  : "Out of Stock"}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        No recommendations available at the moment.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
