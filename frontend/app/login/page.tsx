"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/doctor");
    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-slate-900">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Doctor Login
        </h1>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="border border-slate-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-slate-300 p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}