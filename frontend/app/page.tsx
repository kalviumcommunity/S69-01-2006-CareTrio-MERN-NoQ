'use client'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="bg-slate-100">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
              Modern Healthcare,
              <span className="text-blue-600"> Simplified</span>
            </h2>

            <p className="mt-6 text-slate-700 text-lg">
              NoQ helps hospitals manage patient queues digitally — reducing
              waiting chaos, improving doctor efficiency, and delivering a
              smoother patient experience.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/patient"
                className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-center"
              >
                I am a Patient
              </a>
              <a
                href="/doctor"
                className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-800 font-medium hover:border-blue-600 hover:text-blue-600 transition text-center"
              >
                I am a Doctor
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-10"
          >
            <ul className="space-y-5">
              {[
                'Digital Token System',
                'Live Queue Management',
                'Secure Patient Records',
                'Doctor Admin Dashboard',
              ].map((f) => (
                <li key={f} className="flex items-center gap-4">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="font-medium text-slate-800">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How NoQ Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-slate-50">
              <div className="text-4xl mb-4">🧾</div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Patient Registers
              </h4>
              <p className="text-slate-600">
                Patient enters basic details and receives a digital token.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50">
              <div className="text-4xl mb-4">🩺</div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Doctor Manages Queue
              </h4>
              <p className="text-slate-600">
                Doctor calls patients in order and records consultation details.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Admin Dashboard
              </h4>
              <p className="text-slate-600">
                Doctors can view patients treated today with full records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / FOOTNOTE */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-700 text-lg">
            Built for Tier-2 and Tier-3 hospitals, NoQ is a lightweight, affordable
            solution that works even on low internet speeds.
          </p>
        </div>
      </section>
    </main>
  )
}