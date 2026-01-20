import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">NoQ</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        NoQ is a digital queue management system to reduce waiting time and improve
        patient-doctor coordination in hospitals and clinics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/patient">
          <div className="cursor-pointer bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-xl font-semibold text-gray-800">I am a Patient</h2>
            <p className="text-gray-500 mt-2">
              Register and get your digital token.
            </p>
          </div>
        </Link>

        <Link href="/doctor">
          <div className="cursor-pointer bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-5xl mb-4">🩺</div>
            <h2 className="text-xl font-semibold text-gray-800">I am a Doctor</h2>
            <p className="text-gray-500 mt-2">
              Manage and call patients from the queue.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
