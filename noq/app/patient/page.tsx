export default function PatientPage() {
  const queueNumber = 12;
  const currentServing = 9;

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Patient Queue Status</h1>

      <div className="max-w-md bg-gray-100 p-6 rounded-xl shadow">
        <p className="text-lg">
          <strong>Your Queue Number:</strong> {queueNumber}
        </p>
        <p className="text-lg mt-2">
          <strong>Currently Serving:</strong> {currentServing}
        </p>

        <p className="mt-4 text-blue-600">
          Please be ready when your number is close.
        </p>
      </div>
    </main>
  );
}
