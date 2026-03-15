"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  quantity: number;
}

export interface AppliedDiscount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  amount: number;
}

interface CartState {
  items: CartItem[];
  discount: AppliedDiscount | null;
}

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "APPLY_DISCOUNT"; discount: AppliedDiscount }
  | { type: "CLEAR_DISCOUNT" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; state: CartState };

interface CartContextValue {
  items: CartItem[];
  discount: AppliedDiscount | null;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  clearDiscount: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function getStorageKey(slug: string) {
  return `mayasura-cart-${slug}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.item, quantity: action.quantity || 1 },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => i.productId !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case "APPLY_DISCOUNT":
      return { ...state, discount: action.discount };
    case "CLEAR_DISCOUNT":
      return { ...state, discount: null };
    case "CLEAR_CART":
      return { items: [], discount: null };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

interface CartProviderProps {
  slug: string;
  children: ReactNode;
}

export function CartProvider({ slug, children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: null,
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(slug));
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        if (parsed.items && Array.isArray(parsed.items)) {
          dispatch({ type: "HYDRATE", state: parsed });
        }
      }
    } catch {
      // Ignore corrupted data
    }
  }, [slug]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(slug), JSON.stringify(state));
    } catch {
      // Storage full or unavailable
    }
  }, [state, slug]);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = state.discount?.amount || 0;
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity?: number) => {
      dispatch({ type: "ADD_ITEM", item, quantity });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
    },
    []
  );

  const applyDiscountFn = useCallback((discount: AppliedDiscount) => {
    dispatch({ type: "APPLY_DISCOUNT", discount });
  }, []);

  const clearDiscount = useCallback(() => {
    dispatch({ type: "CLEAR_DISCOUNT" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        discount: state.discount,
        itemCount,
        subtotal,
        discountAmount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        applyDiscount: applyDiscountFn,
        clearDiscount,
        clearCart,
      }}
    >
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
