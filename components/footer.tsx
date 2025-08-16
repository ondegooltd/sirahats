import Link from "next/link";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="">
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

            <p className="text-gray-400 text-sm">
              Handcrafted baskets by Master Weavers showcasing extraordinary
              skills and innate talent.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/collections"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/stockists"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Stockists
                </Link>
              </li> */}
              {/* Hidden admin link - only visible to logged-in users */}
              {session?.user && session?.user.role === "admin" && (
                <li>
                  <Link
                    href="/admin/login"
                    className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
                    title="Admin Access"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/wholesale"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Wholesale
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
              />
              <button
                type="submit"
                className="w-full bg-[#8BC34A] text-white py-2 rounded-md hover:bg-[#689F38] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Sirahats Basket Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
