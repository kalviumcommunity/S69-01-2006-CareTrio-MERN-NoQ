"use client";

import { useState } from "react";

export default function PatientPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerPatient = async () => {
    setError("");

    if (!name || !phone || !department) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined, // optional
          department,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Registration failed");
        setLoading(false);
        return;
      }

      setToken(data.token);
    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-slate-900">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Patient Registration
        </h1>

        {!token ? (
          <>
            {error && (
              <p className="mb-4 text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <input
              placeholder="Full Name *"
              className="border border-slate-300 p-3 w-full mb-4 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Phone Number *"
              className="border border-slate-300 p-3 w-full mb-4 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              placeholder="Email (optional)"
              type="email"
              className="border border-slate-300 p-3 w-full mb-4 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Department *"
              className="border border-slate-300 p-3 w-full mb-6 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <button
              onClick={registerPatient}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Generating Token..." : "Get Token"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-base mb-2 text-slate-700">
              Your Token Number
            </p>
            <p className="text-5xl font-bold text-blue-700 mb-4">
              {token}
            </p>
            <p className="text-slate-600">
              Please wait. You will be called shortly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}