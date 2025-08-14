"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return calculateTotals({ ...state, items: newItems });
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return calculateTotals({ ...state, items: updatedItems });
    }

    case "SET_CART": {
      return calculateTotals({ ...state, items: action.payload });
    }

    case "SET_LOADING": {
      return { ...state, isLoading: action.payload };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

function calculateTotals(state: CartState): CartState {
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return { ...state, total, itemCount };
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (
    product: Omit<CartItem, "quantity">,
    quantity?: number
  ) => Promise<void>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session } = useSession();

  // Function to add item to cart and update API
  const addToCart = async (
    product: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Update local cart state with the correct quantity
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, update quantity
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: {
            id: product.id,
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        // If item doesn't exist, add with specified quantity
        const newItem: CartItem = {
          ...product,
          quantity: quantity,
        };
        dispatch({
          type: "SET_CART",
          payload: [...state.items, newItem],
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Sync cart with API when user logs in
  useEffect(() => {
    if (session?.user) {
      const fetchCart = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await fetch("/api/cart");
          if (response.ok) {
            const data = await response.json();
            const cartItems = data.data?.items || [];

            // Convert API cart items to local format with correct quantities
            const localItems: CartItem[] = cartItems.map((item: any) => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.images[0],
              quantity: item.quantity, // Use the actual quantity from API
              slug: item.product.slug,
            }));

            // Set the entire cart state from API data
            dispatch({ type: "SET_CART", payload: localItems });
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };

      fetchCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: "CLEAR_CART" });
    }
  }, [session?.user]);

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
