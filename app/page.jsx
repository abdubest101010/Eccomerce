"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/Components/CartContext"; // Import the useCart hook

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the useCart hook to manage cart state
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching products: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isInCart = cartItems.some((item) => item.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-800 font-bold mt-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mt-1">
                  Stock:{" "}
                  <span
                    className={`${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {product.stock > 0 ? product.stock : "Out of Stock"}
                  </span>
                </p>
                <button
                  onClick={() =>
                    isInCart ? removeFromCart(product.id) : addToCart(product)
                  }
                  className={`mt-4 w-full ${
                    isInCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white py-2 px-4 rounded transition duration-200`}
                  disabled={product.stock <= 0}
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}