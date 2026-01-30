export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-4">NOQ</h1>
      <p className="text-gray-600 mb-8 text-center">
        A smart queue management system for appointments
      </p>

      <div className="flex gap-6">
        <a
          href="/patient"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          I am a Patient
        </a>

        <a
          href="/doctor"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          I am a Doctor
        </a>
      </div>
    </main>
  );
}
