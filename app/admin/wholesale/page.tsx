"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Check,
  X,
  Clock,
  Loader2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

interface WholesaleApplication {
  _id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  businessType: string;
  address: string;
  taxId: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export default function AdminWholesalePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState<WholesaleApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<WholesaleApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wholesale");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data.data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load wholesale applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      setIsUpdating(appId);
      const response = await fetch(`/api/wholesale/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      // Update local state
      setApplications(
        applications.map((app) =>
          app._id === appId ? { ...app, status: newStatus as any } : app
        )
      );

      toast({
        title: "Application Updated",
        description: `Application has been ${newStatus}.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteApplication = async (appId: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        setIsUpdating(appId);
        const response = await fetch(`/api/wholesale/${appId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete application");
        }

        // Remove from local state
        setApplications(applications.filter((app) => app._id !== appId));

        toast({
          title: "Application Deleted",
          description: "Application has been successfully deleted.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting application:", error);
        toast({
          title: "Error",
          description: "Failed to delete application",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredApplications.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredApplications.map((app) => app._id));
    }
  };

  const handleSelectItem = (appId: string) => {
    setSelectedItems((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select applications to update.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating("bulk");

      // Update each selected application
      const updatePromises = selectedItems.map((appId) =>
        fetch(`/api/wholesale/${appId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
      );

      await Promise.all(updatePromises);

      // Update local state
      setApplications(
        applications.map((app) =>
          selectedItems.includes(app._id)
            ? { ...app, status: newStatus as any }
            : app
        )
      );

      setSelectedItems([]);

      toast({
        title: "Bulk Update Complete",
        description: `${selectedItems.length} applications have been ${newStatus}.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast({
        title: "Bulk Update Failed",
        description: "Failed to update some applications.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto mb-4" />
            <p className="text-gray-600">Loading wholesale applications...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Wholesale Applications
          </h1>
          <p className="text-gray-600">
            Review and manage wholesale partnership requests
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={fetchApplications}
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

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedItems.length} application(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => bulkUpdateStatus("approved")}
                    disabled={isUpdating === "bulk"}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isUpdating === "bulk" ? "Updating..." : "Approve All"}
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("rejected")}
                    disabled={isUpdating === "bulk"}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isUpdating === "bulk" ? "Updating..." : "Reject All"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredApplications.length &&
                        filteredApplications.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                      title="Select all applications"
                      aria-label="Select all applications"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(app._id)}
                        onChange={() => handleSelectItem(app._id)}
                        className="rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                        title={`Select application ${app.businessName}`}
                        aria-label={`Select application ${app.businessName}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.businessType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.contactName}
                      </div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.businessType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateApplicationStatus(app._id, "approved")
                              }
                              disabled={isUpdating === app._id}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              title="Approve"
                            >
                              {isUpdating === app._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                updateApplicationStatus(app._id, "rejected")
                              }
                              disabled={isUpdating === app._id}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              title="Reject"
                            >
                              {isUpdating === app._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteApplication(app._id)}
                          disabled={isUpdating === app._id}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          title="Delete Application"
                        >
                          {isUpdating === app._id ? (
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

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Search className="w-full h-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No applications found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Wholesale applications will appear here."}
              </p>
            </div>
          )}
        </motion.div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Application Details
                  </h3>
                  <button
                    title="btn"
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.businessName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.contactName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.website || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Type
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.businessType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tax ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.taxId}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.address}
                      </p>
                    </div>
                  </div>

                  {selectedApplication.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.message}
                      </p>
                    </div>
                  )}

                  {selectedApplication.status === "pending" && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        title="btn"
                        onClick={() => {
                          updateApplicationStatus(
                            selectedApplication._id,
                            "rejected"
                          );
                          setSelectedApplication(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        title="btn"
                        onClick={() => {
                          updateApplicationStatus(
                            selectedApplication._id,
                            "approved"
                          );
                          setSelectedApplication(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
