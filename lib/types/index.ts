export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  collectionId: string;
  isNew?: boolean;
  inStock: boolean;
  materials: string[];
  dimensions: string;
  origin: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imagePublicId?: string;
  productCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Order {
  _id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: {
    _id: string;
    product: Product | string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  tracking?: string | null;
  estimatedDelivery?: string | Date;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod?: {
    cardNumber: string;
    nameOnCard: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
