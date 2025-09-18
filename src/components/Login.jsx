import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";  // Import Firebase Authentication
import { signInWithEmailAndPassword } from "firebase/auth";  // Firebase Authentication method
import DVlogo from "../assets/DVlogo.png";
import Loader from "../components/Loader";  // Import the Loader component

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // State to control loading
  const [error, setError] = useState(null);  // State for handling error messages
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);  // Start loading

    // Firebase sign-in process
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in as:", user);
        
        // Redirect to the dashboard after successful login
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(error.message);  // Show error message from Firebase
        setLoading(false);  // Stop loading
      });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT: Logo or image */}
      <div className="hidden md:flex items-center justify-center bg-blue-500">
        <img
          src={DVlogo}
          alt="Logo"
          className="max-w-xs w-2/3"
        />
      </div>

      {/* RIGHT: Login form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white border rounded-xl shadow p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to continue
            </p>
          </div>

          {/* Show Error if there's an error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Show Loader if loading is true */}
          {loading ? (
            <Loader />  // Show the loader while loading
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
              >
                Login
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
