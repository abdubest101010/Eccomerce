"use client";

import Link from "next/link";
import { useCart } from "@/Components/CartContext"; // Import the useCart hook

export default function Navigation() {
  const { cartItems, getTotalAmount } = useCart(); // Access cartItems and getTotalAmount from the context

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              My Store
            </Link>
          </div>

          {/* Cart icon and Sign-in button on the right */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Counter and Total Amount */}
            <Link href="/cart" className="relative text-gray-800 hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart Counter (positioned at the top-right corner) */}
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Display Total Amount */}
            <div className="text-gray-800 font-bold">
              Total: ${getTotalAmount().toFixed(2)}
            </div>

            {/* Sign-in Button */}
            <Link
              href="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}