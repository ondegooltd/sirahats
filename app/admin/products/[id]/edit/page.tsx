"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Storage",
  "Decor",
  "Totes",
  "Kitchen",
  "Outdoor",
  "Planters",
  "Art",
  "Pet",
  "Organization",
  "Serving",
];

const origins = ["Ghana", "Senegal", "Morocco", "Kenya", "Uganda", "Rwanda"];

interface CollectionOption {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    collectionId: "",
    inStock: true,
    isNew: false,
    materials: [""],
    dimensions: "",
    origin: "",
    images: [] as (File | string)[],
  });
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [productFound, setProductFound] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load product
        const prodRes = await fetch(`/api/products/${productId}`);
        if (!prodRes.ok) {
          setProductFound(false);
          return;
        }
        const prodJson = await prodRes.json();
        const product = prodJson.data;
        setFormData({
          name: product.name || "",
          price: (product.price ?? "").toString(),
          description: product.description || "",
          category: product.category || "",
          collectionId: product.collectionId?._id || product.collectionId || "",
          inStock: Boolean(product.inStock),
          isNew: Boolean(product.isNewProduct || product.isNew),
          materials:
            Array.isArray(product.materials) && product.materials.length > 0
              ? product.materials
              : [""],
          dimensions: product.dimensions || "",
          origin: product.origin || "",
          images:
            Array.isArray(product.images) && product.images.length > 0
              ? product.images
              : [""],
        });

        // Load collections for selector
        const colRes = await fetch(`/api/collections?limit=1000`);
        if (colRes.ok) {
          const colJson = await colRes.json();
          const options: CollectionOption[] = (
            colJson.data.collections ||
            colJson.data ||
            []
          ).map((c: any) => ({ _id: c._id, name: c.name }));
          setCollections(options);
        }
      } catch (e) {
        console.error(e);
        setProductFound(false);
      } finally {
        setIsFetching(false);
      }
    };
    loadData();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData((prev) => ({ ...prev, materials: newMaterials }));
  };

  const addMaterial = () => {
    setFormData((prev) => ({ ...prev, materials: [...prev.materials, ""] }));
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      const newMaterials = formData.materials.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, materials: newMaterials }));
    }
  };

  const handleImageChange = (index: number, value: string | File) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleFileSelect = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      handleImageChange(index, file);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.price ||
        !formData.category ||
        !formData.description ||
        !formData.collectionId
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      let imageUrls: string[] = [];
      const existingImages = formData.images.filter(
        (img): img is string => typeof img === "string"
      );

      if (formData.images.some((img) => img instanceof File)) {
        toast({
          title: "Uploading Images",
          description:
            "Please wait while your new images are being uploaded...",
          variant: "default",
        });

        const formDataImages = new FormData();
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            formDataImages.append(`image${index}`, image);
          }
        });

        const uploadResponse = await fetch("/api/upload/product", {
          method: "POST",
          body: formDataImages,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload images");
        }
        const uploadResult = await uploadResponse.json();
        const newImageUrls = uploadResult.data.map((img: any) => img.url);
        imageUrls = [...existingImages, ...newImageUrls];
        toast({
          title: "Images Uploaded",
          description: `${newImageUrls.length} new image(s) uploaded successfully!`,
          variant: "success",
        });
      } else {
        imageUrls = existingImages;
      }

      if (imageUrls.length === 0) {
        imageUrls = ["/placeholder.svg?height=400&width=400"];
      }

      const updatedProduct = {
        name: formData.name,
        slug: generateSlug(formData.name),
        price: Number.parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        collectionId: formData.collectionId,
        inStock: formData.inStock,
        isNewProduct: formData.isNew,
        materials: formData.materials.filter((m) => m.trim() !== ""),
        dimensions: formData.dimensions,
        origin: formData.origin,
        images: imageUrls,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      toast({
        title: "Product Updated",
        description: `${formData.name} has been successfully updated.`,
        variant: "success",
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!productFound) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-gray-500">Loading...</div>
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
          className="flex items-center space-x-4"
        >
          <Link
            href="/admin/products"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white shadow rounded-lg"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            {/* Category and Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="collectionId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Collection *
                </label>
                <select
                  id="collectionId"
                  name="collectionId"
                  required
                  value={formData.collectionId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                >
                  <option value="">Select collection</option>
                  {collections.map((collection) => (
                    <option key={collection._id} value={collection._id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Origin
                </label>
                <select
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                >
                  <option value="">Select origin</option>
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="dimensions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                placeholder='e.g., 12" x 12" x 8"'
              />
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <div className="space-y-2">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) =>
                        handleMaterialChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      placeholder="Enter material"
                    />
                    {formData.materials.length > 1 && (
                      <button
                        title="btn"
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaterial}
                  className="flex items-center text-sm text-[#8BC34A] hover:text-[#689F38]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Material
                </button>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label htmlFor={`image-${index}`} className="sr-only">
                        Product image {index + 1}
                      </label>
                      <input
                        type="file"
                        id={`image-${index}`}
                        accept="image/*"
                        onChange={(e) => handleFileSelect(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                      />
                      {image instanceof File && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">
                            {image.name} (
                            {(image.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                          <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview of ${image.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {typeof image === "string" && image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">
                            Current image URL
                          </p>
                          <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                            <img
                              src={image}
                              alt="Current product image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center text-sm text-[#8BC34A] hover:text-[#689F38]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Image
                </button>
              </div>
            </div>

            {/* Status Options */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#8BC34A] focus:ring-[#8BC34A] border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                  In Stock
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#8BC34A] focus:ring-[#8BC34A] border-gray-300 rounded"
                />
                <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
                  New Product
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/products"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#689F38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
