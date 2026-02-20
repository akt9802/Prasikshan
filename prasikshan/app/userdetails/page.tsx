export default function UserDetails() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">👤 User Details</h1>
        <p className="text-2xl text-orange-600 font-semibold mb-6">This is User Details Page</p>
        <p className="text-gray-700">Your profile information and settings.</p>
      </div>
    </div>
  );
}
