import React, { useState, ReactNode } from "react";
import { CartContext } from "./CartContext";

// Define props type
interface UserProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <CartContext.Provider value={{ count, setCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
