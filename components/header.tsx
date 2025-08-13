"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "@/components/search-modal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: "SHOP", href: "/shop" },
    { name: "COLLECTIONS", href: "/collections" },
    { name: "ABOUT", href: "/about" },
    { name: "STOCKISTS", href: "/stockists" },
    { name: "WHOLESALE", href: "/wholesale" },
    // { name: "INSPIRATION", href: "/inspiration" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                // src="https://lh3.googleusercontent.com/d/1sfVWXu0iICHglrKlUgF59UP-Fw8lSioI=w400"
                alt="Sirahats"
                height={100}
                width={100}
                className=""
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium text-sm transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-[#8BC34A] border-b-2 border-[#8BC34A] pb-1"
                      : "text-gray-700 hover:text-[#8BC34A]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Link
                href={!!session?.user ? "/account" : "/login"}
                className={`transition-colors ${
                  isActive("/account") || isActive("/login")
                    ? "text-[#8BC34A]"
                    : "text-gray-700 hover:text-[#8BC34A]"
                }`}
              >
                <User size={20} />
                <span className="sr-only">Account</span>
              </Link>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-[#8BC34A] transition-colors"
              >
                <Search size={20} />
                <span className="sr-only">Search</span>
              </button>

              <Link
                href="/cart"
                className={`relative transition-colors ${
                  isActive("/cart")
                    ? "text-[#8BC34A]"
                    : "text-gray-700 hover:text-[#8BC34A]"
                }`}
              >
                <ShoppingBag size={20} />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8BC34A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 hover:text-[#8BC34A] transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                <span className="sr-only">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-[#8BC34A] border-l-4 border-[#8BC34A] pl-3"
                        : "text-gray-700 hover:text-[#8BC34A]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
