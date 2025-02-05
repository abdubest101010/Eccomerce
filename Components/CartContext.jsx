"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cartItems state with an empty array
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from local storage on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, []);

  // Save cart items to local storage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If the product is already in the cart, increase its quantity
        return prevCartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== productId)
    );
  };

  // Function to update the quantity of a product in the cart
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item from the cart
      removeFromCart(productId);
    } else {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Function to calculate the total amount of the cart
  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalAmount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}