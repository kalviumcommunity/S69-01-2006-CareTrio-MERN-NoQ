"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function DoctorPage() {
  const [current, setCurrent] = useState("");

  const callNext = async () => {
    const res = await axios.get("http://localhost:5000/next");
    setCurrent(res.data.token || "No patients waiting");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link href="/" className="text-blue-600 font-medium">
        ← Back to Home
      </Link>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Doctor Dashboard
        </h1>

        <button
          onClick={callNext}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-medium"
        >
          Call Next Patient
        </button>

        <p className="mt-4 text-blue-700 font-bold">
          Now Serving: {current}
        </p>
      </div>
    </main>
  );
}
