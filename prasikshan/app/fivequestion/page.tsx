export default function FiveQuestion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">❓ Five Question Test</h1>
        <p className="text-2xl text-blue-600 font-semibold mb-6">This is Five Question Test Page</p>
        <p className="text-gray-700 mb-6">Practice with 5 questions to test your knowledge</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded font-semibold">Start Test</button>
      </div>
    </div>
  );
}
