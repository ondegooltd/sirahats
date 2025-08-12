"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useCart();
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

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

      // Also update the local cart context for immediate UI feedback
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
        variant: "success",
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

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to wishlist");
      }

      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-[#8BC34A] text-white px-2 py-1 text-xs font-medium rounded">
            NEW
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}

        {/* Hover Actions - Hidden on mobile, visible on md and up */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 items-center justify-center space-x-2 transition-opacity duration-300 hidden md:flex ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-white text-gray-900 p-2 rounded-full hover:bg-[#8BC34A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingBag size={16} />
          </button>
          <button
            onClick={handleAddToWishlist}
            className="bg-white text-gray-900 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
            title="Add to Wishlist"
          >
            <Heart size={16} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="Quick View"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#8BC34A] transition-colors line-clamp-2 text-sm">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 text-sm">
            ₵{product.price.toFixed(2)}
          </p>
          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
