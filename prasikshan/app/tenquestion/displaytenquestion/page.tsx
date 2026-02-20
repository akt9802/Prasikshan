export default function DisplayTenQuestion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Display Ten Questions</h1>
        <p className="text-xl text-cyan-600 font-semibold mb-4">This is Ten Question Display Page</p>
        <div className="text-gray-700">
          <p>Question 1 to 10: Sample questions...</p>
        </div>
      </div>
    </div>
  );
}
