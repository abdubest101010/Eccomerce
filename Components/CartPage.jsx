"use client";
import { useCart } from "@/Components/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function CartPage() {
  const { data: session } = useSession(); // Get session data
  const router = useRouter(); // Initialize router for navigation
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
    clearCart,
  } = useCart();

  const handleCheckout = async () => {
    // Check if the user is logged in
    if (!session) {
      // Redirect to login page if not logged in
      router.push("/login");
      return;
    }

    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

      // Fetch the Stripe session ID
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, userId: session.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Stripe session");
      }

      const { id } = await response.json();

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Total Amount</h2>
              <p className="text-gray-800 font-bold">
                ${getTotalAmount().toFixed(2)}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}