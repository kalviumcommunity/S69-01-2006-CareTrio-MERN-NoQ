"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Doctor Signup</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          placeholder="Name"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}