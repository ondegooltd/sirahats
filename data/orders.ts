import { Order } from "@/lib/types";

export const orders: Order[] = [
  {
    _id: "#12345",
    date: "March 15, 2024",
    status: "Delivered",
    total: 89.0,
    items: [
      {
        _id: "#12344",
        name: "Woven Storage Basket",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 89.0,
        product: "",
      },
    ],
    tracking: "1Z999AA1234567890",
    estimatedDelivery: "March 18, 2024",
  },
  {
    _id: "#12344",
    date: "March 10, 2024",
    status: "Shipped",
    total: 125.0,
    items: [
      {
        _id: "",
        name: "Market Tote Basket",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 125.0,
        product: "",
      },
    ],
    tracking: "1Z999AA1234567891",
    estimatedDelivery: "March 16, 2024",
  },
  {
    _id: "#12343",
    date: "March 5, 2024",
    status: "Processing",
    total: 65.0,
    items: [
      {
        _id: "",
        name: "Decorative Wall Basket",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 65.0,
        product: "",
      },
    ],
    tracking: null,
    estimatedDelivery: "March 12, 2024",
  },
  {
    _id: "#12342",
    date: "February 28, 2024",
    status: "Delivered",
    total: 45.0,
    items: [
      {
        _id: "",
        name: "Fruit Bowl Basket",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 45.0,
        product: "",
      },
    ],
    tracking: "1Z999AA1234567892",
    estimatedDelivery: "March 3, 2024",
  },
];
