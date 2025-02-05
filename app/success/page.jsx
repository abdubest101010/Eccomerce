export default function SuccessPage() {
    return (
      <div className="max-w-5xl mx-auto my-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
        <a
          href="/"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Continue Shopping
        </a>
      </div>
    );
  }
