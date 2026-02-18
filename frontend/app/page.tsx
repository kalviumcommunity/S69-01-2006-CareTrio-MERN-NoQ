"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Clock, ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  /* 
    BACKGROUND IMAGE GUIDE:
    1. Your image must be named "background.png" (or jpg) in "frontend/public".
    2. We found "background.png" in your public folder, so we are using it.
    3. The class is: bg-[url('/background.png')]
  */
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    // Fixed: Use inline style to avoid Tailwind JIT path resolution errors
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
 
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-10/40 to-white/5 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-6 inline-block">
                Smart Healthcare Management
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Skip the Waiting Room. <br/>
                <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                   Prioritize Your Health.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Connect with top doctors, book appointments instantly, and track your queue status in real-time. No more wasted hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* 1. Book Appointment - ALWAYS VISIBLE */}
                <Link 
                  href="/patient" 
                  className="px-8 py-4 bg-blue-600 rounded-xl text-white font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  Book Appointment <ArrowRight size={20} />
                </Link>

                {/* 2. View Queue - ALWAYS VISIBLE */}
                <Link 
                  href="/queue" 
                  className="px-8 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-lg hover:bg-slate-50 hover:border-blue-200 transition flex items-center justify-center gap-2"
                >
                  <Activity size={20} className="text-blue-500"/>
                  View Live Queue
                </Link>

                {/* 3. Doctor Button - Toggle Label Only */}
                <Link
                   href={isLoggedIn ? "/doctor" : "/login"}
                   className="px-8 py-4 bg-slate-800 rounded-xl text-white font-bold text-lg hover:bg-slate-900 transition shadow-lg shadow-slate-400 flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                   {isLoggedIn ? "Doctor Dashboard" : "Doctor Login"} <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </section>

      {/* Live Queue Banner (TV Mode CTA) */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                 <Clock size={32} className="text-blue-400" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold mb-1">Check Live Queue Status</h2>
                 <p className="text-slate-400">See who is being served right now on the public display.</p>
              </div>
           </div>
           <Link 
              href="/queue"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap"
           >
              Open Live TV Mode <ArrowRight size={18} />
           </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white" id="about">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Why NoQ?</h2>
               <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  We built NoQ to solve the chaos of crowded waiting rooms. Our platform ensures efficient patient flow updates, so you wait comfortably at home, not the clinic.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { icon: Clock, title: "Zero Wait Time", desc: "Track your token live and arrive only when it's your turn." },
                  { icon: ShieldCheck, title: "Secure Records", desc: "Your prescriptions and history are safely stored and accessible." },
                  { icon: Phone, title: "Instant Updates", desc: "Get notified via WhatsApp or Email as soon as your turn arrives." }
               ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center hover:shadow-xl hover:shadow-blue-50 transition-all hover:-translate-y-1">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto mb-6 flex items-center justify-center text-blue-600">
                        <item.icon size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                     <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contact / Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                     <span className="text-xl font-bold text-slate-900">NoQ</span>
                  </div>
                  <p className="text-slate-500 max-w-xs">
                     Revolutionizing clinic management with smart, seamless, and secure technology.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                  <ul className="space-y-3 text-slate-600">
                     <li><Link href="/patient" className="hover:text-blue-600 transition">Book Appointment</Link></li>
                     <li><Link href="/login" className="hover:text-blue-600 transition">Doctor Login</Link></li>
                     <li><Link href="/queue" className="hover:text-blue-600 transition">Live Status</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
                  <ul className="space-y-3 text-slate-600">
                     <li className="flex items-center gap-2"><Mail size={16}/> support@noq.com</li>
                     <li className="flex items-center gap-2"><Phone size={16}/> +1 (555) 123-4567</li>
                     <li className="flex items-center gap-2"><MapPin size={16}/> 123 Health St, Tech City</li>
                  </ul>
               </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8 text-center text-slate-400 text-sm">
               © 2026 NoQ Healthcare Systems. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}