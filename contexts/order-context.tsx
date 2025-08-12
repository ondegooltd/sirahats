"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { CartItem } from "./cart-context"

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  estimatedDelivery: Date
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: {
    cardNumber: string
    nameOnCard: string
  }
}

interface OrderState {
  orders: Order[]
  isProcessing: boolean
  error: string | null
}

type OrderAction =
  | { type: "START_PROCESSING" }
  | { type: "PROCESS_SUCCESS"; payload: Order }
  | { type: "PROCESS_FAILURE"; payload: string }
  | { type: "CLEAR_ERROR" }

const initialState: OrderState = {
  orders: [],
  isProcessing: false,
  error: null,
}

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "START_PROCESSING":
      return { ...state, isProcessing: true, error: null }

    case "PROCESS_SUCCESS":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        isProcessing: false,
        error: null,
      }

    case "PROCESS_FAILURE":
      return {
        ...state,
        isProcessing: false,
        error: action.payload,
      }

    case "CLEAR_ERROR":
      return { ...state, error: null }

    default:
      return state
  }
}

const OrderContext = createContext<{
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  processPayment: (paymentData: {
    cardNumber: string
    expiryDate: string
    cvv: string
    nameOnCard: string
  }) => Promise<boolean>
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "estimatedDelivery">) => Promise<Order>
} | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const processPayment = async (paymentData: {
    cardNumber: string
    expiryDate: string
    cvv: string
    nameOnCard: string
  }): Promise<boolean> => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate payment validation
    const cardNumber = paymentData.cardNumber.replace(/\s/g, "")

    // Simple validation - reject if card number is all zeros or less than 16 digits
    if (cardNumber === "0000000000000000" || cardNumber.length < 16) {
      return false
    }

    // Simulate random payment failures (5% chance)
    if (Math.random() < 0.05) {
      return false
    }

    return true
  }

  const createOrder = async (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "estimatedDelivery">,
  ): Promise<Order> => {
    dispatch({ type: "START_PROCESSING" })

    try {
      // Simulate order creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const order: Order = {
        ...orderData,
        id: Date.now().toString(),
        orderNumber: `BB${Date.now().toString().slice(-6)}`,
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }

      dispatch({ type: "PROCESS_SUCCESS", payload: order })
      return order
    } catch (error) {
      dispatch({ type: "PROCESS_FAILURE", payload: "Failed to create order" })
      throw error
    }
  }

  return (
    <OrderContext.Provider value={{ state, dispatch, processPayment, createOrder }}>{children}</OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
