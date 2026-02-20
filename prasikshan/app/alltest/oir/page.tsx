export default function OirInstruction() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🧠 OIR Test</h1>
        <p className="text-2xl text-red-600 font-semibold mb-6">Officer Intelligence Rating - Instructions</p>
        <p className="text-gray-700 mb-6">This is OIR Instruction Page</p>
        <button className="bg-red-600 text-white px-8 py-3 rounded font-semibold">Start Test</button>
      </div>
    </div>
  );
}
