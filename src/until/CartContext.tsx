import { createContext } from "react";

// Define the shape of the context data
interface CartContextType {
  count: number;
  setCount: (count: number) => void;
}

// Create context with default undefined to enforce usage inside a provider
export const CartContext = createContext<CartContextType | undefined>(undefined);
