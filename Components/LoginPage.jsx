"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function LoginPage() {
  const router = useRouter(); // Initialize router for navigation

  // Get the current URL (e.g., /cart)
  const currentPath = window.location.pathname;

  const handleGoogleSignIn = () => {
    // Pass the current path as the callbackUrl
    signIn("google", { callbackUrl: `${currentPath}` });
  };

  const handleCredentialSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: `${currentPath}`, // Pass the current path as the callbackUrl
    });

    if (result.error) {
      alert(result.error);
    } else {
      // Redirect to the current page after successful login
      router.push(currentPath);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 mb-4"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>
        <div className="text-center text-gray-500 mb-4">OR</div>
        {/* Credential Sign-In Form */}
        <form onSubmit={handleCredentialSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Sign in with Email
          </button>
        </form>
      </div>
    </div>
  );
}