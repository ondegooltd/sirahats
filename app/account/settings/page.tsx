"use client";

import { motion } from "framer-motion";
import { Bell, Lock, Globe, CreditCard, Trash2, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface UserSettings {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    sms: boolean;
  };
  preferences: {
    language: string;
    currency: string;
  };
  security: {
    lastPasswordChange: string;
    twoFactorEnabled: boolean;
  };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    fetchSettings();
  }, [session?.user, router]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/settings");

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setIsSaving(true);
      console.log("Sending settings update:", updates);

      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Settings update response:", data);
        setSettings(data.data);
        toast({
          title: "Success",
          description: "Settings updated successfully",
          variant: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Settings update error:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to update settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (
    key: keyof UserSettings["notifications"]
  ) => {
    if (!settings) return;

    const updatedNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    };

    const updatedSettings = {
      ...settings,
      notifications: updatedNotifications,
    };

    setSettings(updatedSettings);
    updateSettings({ notifications: updatedNotifications });
  };

  const handlePreferenceChange = (
    key: keyof UserSettings["preferences"],
    value: string
  ) => {
    if (!settings) return;

    const updatedPreferences = {
      ...settings.preferences,
      [key]: value,
    };

    const updatedSettings = {
      ...settings,
      preferences: updatedPreferences,
    };

    setSettings(updatedSettings);
    updateSettings({ preferences: updatedPreferences });
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      signOut();
      router.push("/");
    }
  };

  if (!session?.user) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto mb-4" />
                <p className="text-gray-600">Loading settings...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load settings</p>
              <button
                onClick={fetchSettings}
                className="mt-4 text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatLastPasswordChange = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your preferences and account security
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Notifications */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-[#8BC34A] mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h2>
                {isSaving && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8BC34A] ml-2" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Order Updates</h3>
                    <p className="text-sm text-gray-600">
                      Get notified about your order status
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={() => handleNotificationChange("orderUpdates")}
                      className="sr-only peer"
                      aria-label="Toggle order updates notifications"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8BC34A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8BC34A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Promotions & Deals
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive exclusive offers and discounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.promotions}
                      onChange={() => handleNotificationChange("promotions")}
                      className="sr-only peer"
                      aria-label="Toggle promotions notifications"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8BC34A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8BC34A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-600">
                      Stay updated with our latest stories and tips
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={() => handleNotificationChange("newsletter")}
                      className="sr-only peer"
                      aria-label="Toggle newsletter notifications"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8BC34A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8BC34A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      SMS Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get text messages for important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={() => handleNotificationChange("sms")}
                      className="sr-only peer"
                      aria-label="Toggle SMS notifications"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8BC34A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8BC34A]"></div>
                  </label>
                </div>
              </div>
            </motion.section>

            {/* Security */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-[#8BC34A] mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Security
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">
                      Last changed{" "}
                      {formatLastPasswordChange(
                        settings.security.lastPasswordChange
                      )}
                    </p>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-[#8BC34A] hover:text-[#689F38] font-medium transition-colors"
                  >
                    Change Password
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button
                    disabled
                    className="text-gray-400 font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Preferences */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <Globe className="w-6 h-6 text-[#8BC34A] mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Preferences
                </h2>
                {isSaving && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8BC34A] ml-2" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Language</h3>
                    <p className="text-sm text-gray-600">
                      Choose your preferred language
                    </p>
                  </div>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) =>
                      handlePreferenceChange("language", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    aria-label="Select language preference"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Currency</h3>
                    <p className="text-sm text-gray-600">
                      Display prices in your currency
                    </p>
                  </div>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) =>
                      handlePreferenceChange("currency", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    aria-label="Select currency preference"
                  >
                    <option value="GHS">GHS (₵)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Payment Methods */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-[#8BC34A] mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Methods
                </h2>
              </div>

              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No saved payment methods</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Payment methods are managed during checkout
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white p-6 rounded-lg shadow-sm border-red-200 border"
            >
              <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-red-900">
                  Danger Zone
                </h2>
              </div>

              <div className="bg-red-50 p-4 rounded-md">
                <h3 className="font-medium text-red-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
