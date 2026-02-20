export default function DisplayFiveQuestion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Display Five Questions</h1>
        <p className="text-xl text-blue-600 font-semibold mb-4">This is Five Question Display Page</p>
        <div className="text-gray-700">
          <p>Question 1: Sample question...</p>
          <p>Question 2: Sample question...</p>
          <p>Question 3: Sample question...</p>
          <p>Question 4: Sample question...</p>
          <p>Question 5: Sample question...</p>
        </div>
      </div>
    </div>
  );
}
