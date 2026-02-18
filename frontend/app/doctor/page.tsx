"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Phone, Stethoscope, FileText, Send, MessageCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

type Patient = {
  id: number;
  name: string;
  phone: string;
  department: string;
  token: string;
};

type ActivePatient = Patient & {
  patient_id: number;
  email?: string;
};

type TreatedPatient = {
  id: number;
  name: string;
  phone: string;
  department: string;
  disease: string;
  consulted_at: string;
  email?: string;
};

export default function DoctorPage() {
  const router = useRouter();
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<ActivePatient | null>(null);
  const [disease, setDisease] = useState("");
  const [medicine, setMedicine] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  
  // We need to fetch treated patients to show them and allow delete
  const [treatedPatients, setTreatedPatients] = useState<TreatedPatient[]>([]); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login"); 
    fetchQueue();
    fetchActivePatient();
    fetchTreatedPatients();
  }, []);

  const fetchQueue = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/doctor/waiting-patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setWaitingPatients(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivePatient = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/doctor/active-patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data) setCurrentPatient(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTreatedPatients = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/admin/today-patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTreatedPatients(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const callNext = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/next", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.token) {
        setCurrentPatient(data);
        fetchQueue();
        toast.success(`Calling ${data.name}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const saveConsultation = async (status: "done" | "skipped" = "done") => {
    if (!currentPatient) return;
    
    // Validation only if not skipping
    if (status === "done" && !disease) {
        toast.error("Please enter a diagnosis.");
        return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    
    // If skipping, auto-fill
    const finalDisease = status === "skipped" ? "Absent" : disease;
    const finalMedicine = status === "skipped" ? "-" : medicine;
    const finalRemarks = status === "skipped" ? "Patient skipped" : remarks;

    try {
      const res = await fetch("http://localhost:5000/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: currentPatient.patient_id,
          disease: finalDisease,
          medicine: finalMedicine,
          remarks: finalRemarks,
          status: status, // Pass status to backend
        }),
      });

      if (res.ok) {
        toast.success(status === "skipped" ? "Patient Skipped" : "Consultation Completed!");
        setCurrentPatient(null);
        setDisease("");
        setMedicine("");
        setRemarks("");
        fetchQueue();
        fetchTreatedPatients();
      } else {
        toast.error("Failed to save.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: number) => {
    // Custom toast with confirmation could be better, but native confirm is safer for now
    if (!confirm("Are you sure you want to delete this patient record?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
          toast.success("Patient deleted");
          fetchQueue();
          fetchTreatedPatients();
      } else {
          toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting patient");
    }
  };
  
  const getWhatsAppLink = () => {
    if (!currentPatient) return "#";
    const msg = `Hello ${currentPatient.name}, your test report is ready. Diagnosis: ${disease}. Medicine: ${medicine}. Remarks: ${remarks}. - CareTrio Clinic`;
    return `https://wa.me/${currentPatient.phone}?text=${encodeURIComponent(msg)}`;
  }
  
  const sendEmail = async () => {
    if (!currentPatient || !currentPatient.email) {
        toast.error("Patient has no email address.");
        return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");
    const msg = `Diagnosis: ${disease}\nMedicines: ${medicine}\nRemarks: ${remarks}`;

    try {
      const res = await fetch("http://localhost:5000/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: currentPatient.email,
          name: currentPatient.name,
          message: msg,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Email Sent! Check backend console for preview.");
        if (data.preview) {
             console.log("Email Preview:", data.preview);
             // Optionally open preview in new tab for demo purposes
             window.open(data.preview, "_blank");
        }
      } else {
        toast.error(data.message || "Failed to send email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {/* Navbar Removed (It's in Layout) */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Waiting Room</p>
              <h3 className="text-3xl font-bold text-gray-900">{waitingPatients.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <UserIcon size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Treated Today</p>
              <h3 className="text-3xl font-bold text-gray-900">{treatedPatients.length}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Stethoscope size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium">Next Token</p>
              <h3 className="text-3xl font-bold">{waitingPatients[0]?.token || "--"}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
               <span className="font-bold text-xl">#</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Waiting List Section */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Waiting Queue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Waiting Room</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                  {waitingPatients.length}
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                <AnimatePresence>
                  {waitingPatients.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p>No patients waiting</p>
                    </div>
                  ) : (
                    waitingPatients.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors flex justify-between items-center group border border-transparent hover:border-blue-100"
                      >
                        <div>
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold bg-white text-gray-600 border px-1.5 py-0.5 rounded-md shadow-sm">{p.token}</span>
                              <h3 className="font-semibold text-gray-800">{p.name}</h3>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">{p.department}</p>
                        </div>
                        <button
                          onClick={() => deletePatient(p.id)}
                          className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Treated History (With Delete) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
               <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Treated Today</h2>
               </div>
               <div className="max-h-[300px] overflow-y-auto p-2">
                  {treatedPatients.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p>No history yet</p>
                    </div>
                  ) : (
                    treatedPatients.map((p, i) => (
                      <div key={i} className="mb-2 p-4 bg-gray-50 rounded-xl flex justify-between items-center group">
                        <div>
                           <h3 className="font-semibold text-gray-800 text-sm">{p.name}</h3>
                           <p className="text-xs text-green-600 font-medium">{p.disease}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-gray-400 font-mono">
                              {new Date(p.consulted_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                           {p.id && (
                                <button
                                onClick={() => deletePatient(p.id)}
                                className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Record"
                                >
                                <Trash2 size={14} />
                                </button>
                           )}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>

          {/* Active Patient / Consultation Section */}
          <div className="lg:col-span-2">
            {!currentPatient ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500">
                  <UserIcon size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready?</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Call the next patient to begin.</p>
                <button
                  onClick={callNext}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? "Calling..." : "Call Next Patient"}
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono backdrop-blur-sm border border-white/10">
                            Token: {currentPatient.token}
                        </span>
                        <h2 className="text-2xl font-bold">{currentPatient.name}</h2>
                    </div>
                    <div className="mt-4 flex gap-4 text-blue-100 text-sm">
                      <span className="flex items-center gap-1"><Phone size={14}/> {currentPatient.phone}</span>
                      <span className="flex items-center gap-1"><FileText size={14}/> {currentPatient.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-400/20 text-green-100 border border-green-400/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      IN CONSULTATION
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis / Disease <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none placeholder:text-gray-400"
                      placeholder="e.g. Viral Fever"
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed Medicine</label>
                     <textarea
                        value={medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none h-24 resize-none placeholder:text-gray-400"
                        placeholder="e.g. Paracetamol 500mg, twice a day..."
                      />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Notes</label>
                     <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none placeholder:text-gray-400"
                        placeholder="Dietary advice, rest recommendation..."
                      />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
                     <button
                        onClick={() => saveConsultation("done")}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                     >
                        {loading ? "Saving..." : "Complete Consultation"}
                     </button>
                     
                     <button
                        onClick={() => saveConsultation("skipped")}
                        disabled={loading}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold border border-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
                        title="Mark as absent"
                     >
                        <XCircle size={20} />
                        Skip
                     </button>

                     {/* WhatsApp Link - Opens in new tab */}
                     <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-3 rounded-xl border-2 font-bold transition-all flex items-center gap-2 ${
                            disease ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => !disease && e.preventDefault()}
                     >
                        <MessageCircle size={20} />
                     </a>

                     {/* NEW: Email Button */}
                     <button
                        onClick={sendEmail}
                        disabled={loading || !currentPatient.name} // Simple check, ideally check email too
                        className="px-4 py-3 rounded-xl border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
                        title="Send Email"
                     >
                        <Mail size={20} />
                     </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Icon for Stat Cards
const UserIcon = ({size}: {size: number}) => <User size={size} />;
import { User, Mail } from "lucide-react";