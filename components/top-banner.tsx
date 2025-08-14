"use client";

import {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function TopBanner() {
  return (
    <div className="bg-[#8BC34A] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Facebook size={16} />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Instagram size={16} />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <MessageCircle size={16} />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Twitter size={16} />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Youtube size={16} />
            </Link>
          </div>
        </div>

        <div className="hidden md:block text-center flex-1">
          <span>
            Free Carbon-Offset Shipping on orders from ₵450 GHS. Exclusions
            Apply.
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <select
            title="t"
            className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
          >
            <option value="USD" className="text-black">
              Ghana (GHS ₵)
            </option>
            <option value="USD" className="text-black">
              United States (USD $)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
