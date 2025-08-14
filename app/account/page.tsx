"use client";

import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  createdAt: string;
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // State for user profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session?.user, router]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setUserProfile(data.data);
      setFormData({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch("/api/user/orders?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
      fetchUserOrders();
    }
  }, [session?.user]);

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUserProfile(data.data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const sidebarItems = [
    { id: "profile", name: "Profile", icon: User, href: "/account" },
    { id: "orders", name: "Orders", icon: Package, href: "/account/orders" },
    {
      id: "wishlist",
      name: "Wishlist",
      icon: Heart,
      href: "/account/wishlist",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      href: "/account/settings",
    },
  ];

  // Add admin link if user might have admin access
  const adminSidebarItem = {
    id: "admin",
    name: "Admin Panel",
    icon: Settings,
    href: "/admin/login",
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Account
            </h1>
            <p className="text-lg text-gray-600">
              Manage your orders, preferences, and account settings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  {isLoadingProfile ? (
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userProfile?.firstName} {userProfile?.lastName}
                      </h3>
                      <p className="text-gray-600">{userProfile?.email}</p>
                    </>
                  )}
                </div>

                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                        activeTab === item.id
                          ? "bg-[#8BC34A] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {/* Admin access link - subtle but discoverable */}
                  {session?.user?.role === "admin" && (
                    <Link
                      href={adminSidebarItem.href}
                      className="flex items-center space-x-3 p-3 rounded-md text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-4 pt-4"
                      title="Admin Access"
                    >
                      <adminSidebarItem.icon className="w-5 h-5" />
                      <span className="text-sm">{adminSidebarItem.name}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                {isLoadingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="bg-[#8BC34A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isUpdatingProfile && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <span>
                          {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Orders
                </h2>

                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Pending"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <Link
                      href="/shop"
                      className="text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors mt-2 inline-block"
                    >
                      Start shopping →
                    </Link>
                  </div>
                )}

                {orders.length > 0 && (
                  <div className="mt-6">
                    <Link
                      href="/account/orders"
                      className="text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                    >
                      View all orders →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
