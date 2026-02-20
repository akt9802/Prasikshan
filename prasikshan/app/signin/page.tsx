export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign In</h1>
        <p className="text-center text-lg text-blue-600 mb-8">This is Sign In Page</p>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-blue-600 text-white p-3 rounded font-semibold">Sign In</button>
        </form>
      </div>
    </div>
  );
}
