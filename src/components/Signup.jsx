import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { auth } from "../firebase";  // Import the Firebase Authentication service
import { auth } from "../../firebase";  // Import the Firebase Authentication service
import { createUserWithEmailAndPassword } from "firebase/auth";  // Modular import for Firebase auth method
import DVlogo from "../assets/DVlogo.png";
import Loader from "../Loader";  // Import the Loader component

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [accountCreated, setAccountCreated] = useState(false); // New state to track account creation
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Start loading

    // Use Firebase's createUserWithEmailAndPassword method
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user; // User object from Firebase

        // Optionally, store the user in localStorage (or you can use Firebase Firestore)
        localStorage.setItem("demoUser", JSON.stringify(user));

        // Show account creation message for 3 seconds
        setAccountCreated(true);

        // Redirect to login page after account creation
        setTimeout(() => {
          setAccountCreated(false);
          navigate("/login"); // Redirect to Login page after 3 seconds
        }, 3000);
      })
      .catch((error) => {
        setError(error.message); // Show error message from Firebase
        setLoading(false); // Stop loading
      });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT: Logo / image */}
      <div className="hidden md:flex items-center justify-center bg-gray-100">
        <img
          src={DVlogo} // replace with your logo path
          alt="Logo"
          className="max-w-xs w-2/3"
        />
      </div>

      {/* RIGHT: Sign up form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white border rounded-xl shadow p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us and get started
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* Account Created Message */}
          {accountCreated && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
              Account Created Successfully! Redirecting to login...
            </p>
          )}

          {/* Loader - Show when loading */}
          {loading ? (
            <Loader />  // Show the loader while loading
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition"
              >
                Sign Up
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
