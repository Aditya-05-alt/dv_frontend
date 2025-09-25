import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import Alert from "./Alert";
import Loader from "../../components/Loader";

export default function SignupForm({ auth, onSuccess, onRedirectCountdown = 3 }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Optional: store minimal data; avoid persisting full user object
      // localStorage.setItem("demoUser", JSON.stringify({ uid: user.uid, email: user.email }));

      setSuccessMsg("Account created successfully. Redirecting to login...");
      onSuccess?.(user);

      // If caller wants to auto-redirect later, they can do it in onSuccess
    } catch (err) {
      setError(err?.message || "Signup failed");
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <>
      <Alert message={error} variant="error" />
      <Alert message={successMsg} variant="success" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <TextInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <SubmitButton disabled={loading}>Sign Up</SubmitButton>
      </form>
    </>
  );
}
