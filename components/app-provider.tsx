"use client";

import { useSession } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";
import { OrderProvider } from "@/contexts/order-context";
import TopBanner from "@/components/top-banner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/toaster";
import React from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <CartProvider>
      <OrderProvider>
        {/* {!session ||
          (session?.user.role === "user" && (
            <>
              <TopBanner />
              <Header />
              </>
              ))} */}
        <main>
          <TopBanner />
          {children}
        </main>
        {/* {!session || (session?.user.role === "user" && <Footer />)} */}
        <Toaster />
      </OrderProvider>
    </CartProvider>
  );
}
