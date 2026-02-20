'use client';

import { useParams } from 'next/navigation';

export default function RankingUser() {
  const params = useParams();
  const username = params.username;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">👤 User Ranking Details</h1>
        <p className="text-2xl text-yellow-600 font-semibold mb-6">This is Individual User Ranking Page</p>
        <p className="text-lg text-gray-700 mb-4">Username: <span className="font-bold">{username}</span></p>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600">User ranking details and performance metrics displayed here</p>
        </div>
      </div>
    </div>
  );
}
