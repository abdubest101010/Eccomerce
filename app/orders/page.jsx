"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component for optimized images

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/order?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data.orders); // Log the orders to verify the structure
          setOrders(data.orders);
        } else {
          console.error("Failed to fetch orders:", response.statusText);
        }
      }
    };
  
    fetchOrders();
  }, [session]);

  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Items:</h3>
                <ul className="space-y-3">
                  {order.products.map((orderProduct) => (
                    <li key={orderProduct.id} className="flex items-center space-x-4">
                      {/* Display product image */}
                      <div className="w-16 h-16 relative flex-shrink-0">
                        {orderProduct.product.imageUrl ? (
                          <Image
                            src={orderProduct.product.imageUrl}
                            alt={orderProduct.product.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{orderProduct.product.name}</p>
                        <p className="text-gray-600">
                          ${orderProduct.product.price.toFixed(2)} x {orderProduct.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}