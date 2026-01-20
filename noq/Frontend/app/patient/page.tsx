"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function PatientPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [token, setToken] = useState("");

  const submitForm = async () => {
    const res = await axios.post("http://localhost:5000/register", {
      name,
      phone,
      department,
    });
    setToken(res.data.token);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link href="/" className="text-blue-600 font-medium">
        ← Back to Home
      </Link>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Patient Registration
        </h1>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded text-gray-800"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mb-3 rounded text-gray-800"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Department"
          className="border p-2 w-full mb-4 rounded text-gray-800"
          onChange={(e) => setDepartment(e.target.value)}
        />

        <button
          onClick={submitForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium"
        >
          Get Token
        </button>

        {token && (
          <p className="mt-4 text-green-600 font-bold text-center">
            Your Token: {token}
          </p>
        )}
      </div>
    </main>
  );
}
