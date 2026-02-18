"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type QueueStatus = {
  current: {
    token: string;
    doctor_id: number;
    // We could join doctor name here if needed, but for now just token is enough for MVP
  } | null;
  upcoming: {
    token: string;
  }[];
};

export default function QueuePage() {
  const [status, setStatus] = useState<QueueStatus>({ current: null, upcoming: [] });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/queue-status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (err) {
        console.error("Queue poll error", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 font-sans">
      <header className="absolute top-0 w-full p-8 flex justify-between items-center border-b border-white/10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          CareTrio Clinic
        </h1>
        <div className="text-xl text-slate-400 font-mono">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 text-center lg:text-left items-center pt-20">
        
        {/* LEFT: Current Token */}
        <div className="flex flex-col items-center lg:items-start justify-center">
          <h2 className="text-2xl uppercase tracking-widest text-blue-400 font-semibold mb-6">Now Serving</h2>
          
          <AnimatePresence mode="wait">
            {status.current ? (
              <motion.div
                key={status.current.token}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-blue-600 rounded-[3rem] p-16 shadow-[0_0_80px_-10px_rgba(37,99,235,0.5)] border-4 border-blue-400/30"
              >
                <span className="text-[12rem] font-black leading-none tracking-tighter drop-shadow-lg">
                  {status.current.token}
                </span>
                <p className="text-2xl mt-4 text-blue-100 font-medium text-center">Please proceed to Doctor</p>
              </motion.div>
            ) : (
                <div className="p-16 border-4 border-dashed border-slate-700 rounded-[3rem]">
                    <span className="text-6xl font-bold text-slate-700">--</span>
                </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Upcoming List */}
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 h-full max-h-[600px] flex flex-col">
          <h3 className="text-xl uppercase tracking-wide text-slate-400 font-semibold mb-8 pb-4 border-b border-white/10">
            Up Next
          </h3>
          
          <div className="space-y-4 flex-1 overflow-hidden">
             {status.upcoming.length === 0 ? (
                <p className="text-slate-500 text-center py-10 text-xl">Queue is empty</p>
             ) : (
                status.upcoming.map((p, i) => (
                    <motion.div 
                        key={p.token}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between bg-slate-800 p-6 rounded-2xl border border-slate-700"
                    >
                        <span className="text-2xl text-slate-400 font-mono">#{i + 1}</span>
                        <span className="text-5xl font-bold text-white">{p.token}</span>
                    </motion.div>
                ))
             )}
          </div>
        </div>

      </div>
      
      <footer className="absolute bottom-6 text-slate-600 text-sm">
        Queue updates automatically • No need to refresh
      </footer>
    </div>
  );
}
