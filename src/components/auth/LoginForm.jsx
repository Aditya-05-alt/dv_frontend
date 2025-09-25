import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import ErrorAlert from "./ErrorAlert";
import Loader from "../../components/Loader"; 
import spinner from "../../assets/spinner2.gif"// adjust if your Loader path differs

export default function LoginForm({ auth, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.(user);
    } catch (err) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  if (loading) return <Loader gifSrc={spinner} size={75} label="" />;

  return (
    <>
      <ErrorAlert message={error} />
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
        <SubmitButton>Login</SubmitButton>
      </form>
    </>
  );
}
