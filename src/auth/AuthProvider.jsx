import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase"; // Import the auth instance from firebase.js
import { onAuthStateChanged, signOut } from "firebase/auth"; // Modular imports for auth methods

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext); // Returns user, loading, setUser, and logout
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If user is logged in
        setUser(firebaseUser);
        localStorage.setItem("demoUser", JSON.stringify(firebaseUser));
      } else {
        // If no user is logged in
        setUser(null);
        localStorage.removeItem("demoUser");
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup the listener
  }, []);

  const logout = () => {
    signOut(auth) // Firebase sign-out
      .then(() => {
        setUser(null);
        localStorage.removeItem("demoUser");
      })
      .catch((error) => console.error("Logout error: ", error));
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
