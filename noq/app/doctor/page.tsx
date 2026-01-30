export default function DoctorPage() {
  const currentNumber = 9;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-md">
        <p className="text-lg mb-4">
          <strong>Currently Serving:</strong> {currentNumber}
        </p>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Next Patient
        </button>
      </div>
    </main>
  );
}
