"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Trash2,
  MessageSquare,
  Reply,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  category:
    | "general"
    | "product_inquiry"
    | "shipping"
    | "custom_order"
    | "returns"
    | "wholesale";
  createdAt: string;
  repliedAt?: string;
  repliedBy?: string;
  replyMessage?: string;
  priority: "low" | "medium" | "high";
}

export default function AdminMessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || message.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        setIsUpdating(messageId);
        const response = await fetch(`/api/contact/${messageId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete message");
        }

        // Remove from local state
        setMessages(messages.filter((m) => m._id !== messageId));
        toast({
          title: "Message Deleted",
          description: "The message has been successfully deleted.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      setIsUpdating(messageId);
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }

      // Update local state
      setMessages(
        messages.map((message) =>
          message._id === messageId ? { ...message, status: "read" } : message
        )
      );
    } catch (error) {
      console.error("Error updating message:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      setIsUpdating(messageId);
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "replied" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }

      // Update local state
      setMessages(
        messages.map((message) =>
          message._id === messageId
            ? { ...message, status: "replied" }
            : message
        )
      );
      toast({
        title: "Message Replied",
        description: "The message has been marked as replied.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "product_inquiry":
        return "Product Inquiry";
      case "shipping":
        return "Shipping";
      case "custom_order":
        return "Custom Order";
      case "returns":
        return "Returns";
      case "wholesale":
        return "Wholesale";
      default:
        return "General";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto mb-4" />
            <p className="text-gray-600">Loading contact messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">
            Manage customer inquiries and support requests
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
              />
            </div>
            <select
              title="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <select
              title="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="product_inquiry">Product Inquiry</option>
              <option value="shipping">Shipping</option>
              <option value="custom_order">Custom Order</option>
              <option value="returns">Returns</option>
              <option value="wholesale">Wholesale</option>
            </select>
            <button
              onClick={fetchMessages}
              disabled={isLoading}
              className="px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Messages Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr
                    key={message._id}
                    className={`hover:bg-gray-50 ${
                      message.status === "unread" ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {message.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {message.message.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryLabel(message.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          message.status
                        )}`}
                      >
                        {message.status.charAt(0).toUpperCase() +
                          message.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === "unread") {
                              markAsRead(message._id);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => markAsReplied(message._id)}
                          disabled={isUpdating === message._id}
                          className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                          title="Mark as Replied"
                        >
                          {isUpdating === message._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Reply className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(message._id)}
                          disabled={isUpdating === message._id}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          title="Delete Message"
                        >
                          {isUpdating === message._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No messages found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Customer messages will appear here."}
              </p>
            </div>
          )}
        </motion.div>

        {/* Message Details Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Message Details
                  </h3>
                  <button
                    title="btn"
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedMessage.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedMessage.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {getCategoryLabel(selectedMessage.category)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        markAsReplied(selectedMessage._id);
                        setSelectedMessage(null);
                      }}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
                    >
                      Mark as Replied
                    </button>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
