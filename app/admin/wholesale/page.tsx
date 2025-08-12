"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Check, X, Clock } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

// Mock wholesale applications data
const mockApplications = [
  {
    id: "1",
    businessName: "Artisan Home Decor",
    contactName: "Sarah Johnson",
    email: "sarah@artisanhome.com",
    phone: "+1 (555) 123-4567",
    website: "www.artisanhome.com",
    businessType: "Retail Store",
    yearsInBusiness: "5",
    location: "San Francisco, CA",
    taxId: "12-3456789",
    resaleCertificate: "Yes",
    estimatedMonthlyOrders: "$2,000 - $5,000",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    message:
      "We are interested in carrying your beautiful handwoven baskets in our store. We specialize in artisan home decor and believe your products would be a perfect fit for our customers.",
  },
  {
    id: "2",
    businessName: "Green Living Co.",
    contactName: "Michael Chen",
    email: "mike@greenliving.com",
    phone: "+1 (555) 234-5678",
    website: "www.greenliving.com",
    businessType: "Online Store",
    yearsInBusiness: "3",
    location: "Portland, OR",
    taxId: "98-7654321",
    resaleCertificate: "Yes",
    estimatedMonthlyOrders: "$1,000 - $2,000",
    status: "approved",
    submittedAt: "2024-01-12T14:20:00Z",
    message:
      "We focus on sustainable and eco-friendly home products. Your baskets align perfectly with our brand values.",
  },
  {
    id: "3",
    businessName: "Coastal Boutique",
    contactName: "Emma Davis",
    email: "emma@coastalboutique.com",
    phone: "+1 (555) 345-6789",
    website: "www.coastalboutique.com",
    businessType: "Boutique",
    yearsInBusiness: "2",
    location: "Miami, FL",
    taxId: "45-6789123",
    resaleCertificate: "No",
    estimatedMonthlyOrders: "$500 - $1,000",
    status: "rejected",
    submittedAt: "2024-01-10T09:15:00Z",
    message:
      "Looking to add unique storage solutions to our coastal-themed boutique.",
  },
];

export default function AdminWholesalePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState(mockApplications);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { toast } = useToast();

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateApplicationStatus = (appId: string, newStatus: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
    toast({
      title: "Application Updated",
      description: `Application has been ${newStatus}.`,
      variant: "success",
    });
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
          </div>
        </motion.div>

        {/* Applications Table */}
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
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Orders
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
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.location}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.estimatedMonthlyOrders}
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
                                updateApplicationStatus(app.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateApplicationStatus(app.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                        {selectedApplication.website}
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
                        Years in Business
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.yearsInBusiness}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.location}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Resale Certificate
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.resaleCertificate}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estimated Monthly Orders
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.estimatedMonthlyOrders}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedApplication.message}
                    </p>
                  </div>

                  {selectedApplication.status === "pending" && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        title="btn"
                        onClick={() => {
                          updateApplicationStatus(
                            selectedApplication.id,
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
                            selectedApplication.id,
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
