"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PatientRecord = {
  name: string;
  phone: string;
  department: string;
  disease: string;
  consulted_at: string;
};

export default function DoctorPage() {
  const router = useRouter();

  const [currentPatient, setCurrentPatient] = useState<{
    patient_id: number;
    token: string;
    name: string;
  } | null>(null);

  const [disease, setDisease] = useState("");
  const [message, setMessage] = useState("");
  const [todayPatients, setTodayPatients] = useState<PatientRecord[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else fetchTodayPatients();
  }, [router]);

  // Fetch today's patients
  const fetchTodayPatients = async () => {
    setLoadingTable(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:5000/admin/today-patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setTodayPatients(data || []);
    } catch {
      // silent fail for demo safety
    }
    setLoadingTable(false);
  };

  // Call next patient
  const callNextPatient = async () => {
    setMessage("");
    setDisease("");

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("http://localhost:5000/next", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.message) {
        setMessage(data.message || "No patients waiting");
        setCurrentPatient(null);
        return;
      }

      setCurrentPatient({
        patient_id: data.patient_id,
        token: data.token,
        name: data.name,
      });
    } catch {
      setMessage("Server error");
    }
  };

  // Save consultation
  const saveConsultation = async () => {
    if (!currentPatient || !disease.trim()) {
      setMessage("Please enter disease details");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("http://localhost:5000/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: currentPatient.patient_id,
          disease,
        }),
      });

      if (!res.ok) {
        setMessage("Failed to save consultation");
        return;
      }

      setMessage("Consultation saved successfully");
      setCurrentPatient(null);
      setDisease("");
      fetchTodayPatients(); // refresh admin table
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <main className="min-h-screen p-6 bg-slate-100 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">
          Doctor Dashboard
        </h1>

        {/* Queue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-slate-900">
          <button
            onClick={callNextPatient}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Call Next Patient
          </button>

          {message && (
            <p className="mt-4 text-center text-slate-700 font-medium">
              {message}
            </p>
          )}

          {currentPatient && (
            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-lg mb-1">
                <span className="font-semibold">Token:</span>{" "}
                {currentPatient.token}
              </p>
              <p className="text-lg mb-3">
                <span className="font-semibold">Name:</span>{" "}
                {currentPatient.name}
              </p>

              <textarea
                placeholder="Enter disease / diagnosis"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full border border-slate-300 p-3 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              <button
                onClick={saveConsultation}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Save Consultation
              </button>
            </div>
          )}
        </div>

        {/* Admin Table */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Patients Treated Today
          </h2>

          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            {loadingTable ? (
              <p className="p-6 text-slate-600">Loading...</p>
            ) : todayPatients.length === 0 ? (
              <p className="p-6 text-slate-600">
                No patients treated today.
              </p>
            ) : (
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Disease</th>
                    <th className="px-6 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {todayPatients.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-3">{p.name}</td>
                      <td className="px-6 py-3">{p.phone}</td>
                      <td className="px-6 py-3">{p.department}</td>
                      <td className="px-6 py-3">{p.disease}</td>
                      <td className="px-6 py-3">
                        {new Date(p.consulted_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}