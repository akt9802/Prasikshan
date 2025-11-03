import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Ranking() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  // Hardcoded sample data (name, number of tests) inside memo so deps don't change
  const staticSorted = useMemo(() => {
    const data = [
      { name: 'Sonia Verma', tests: 15 },
      { name: 'Ajay Kumar', tests: 12 },
      { name: 'Rahul Singh', tests: 9 },
      { name: 'Neha Sharma', tests: 7 },
      { name: 'Vikram Patel', tests: 5 },
    ];
    return data.sort((a, b) => b.tests - a.tests);
  }, []);

  const [sorted, setSorted] = useState(staticSorted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch ranked users from backend. Use Vite env if provided, else relative path.
    const base = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL) || '';
    const url = `${base}/v1/ranking`;

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body || !body.success || !Array.isArray(body.data)) {
          throw new Error('Unexpected response');
        }

        // Map backend items to the shape used in this component
        const mapped = body.data.map(u => ({
          name: u.name,
          tests: typeof u.testsTakenCount === 'number' ? u.testsTakenCount : (Array.isArray(u.testsTaken) ? u.testsTaken.length : 0),
        }));

        if (!cancelled) setSorted(mapped);
      } catch (err) {
        console.warn('Failed to load ranking, falling back to static data:', err);
        if (!cancelled) setError(err.message || 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // pick a pleasant palette for avatars
  const avatarColors = ['#E6F5FF', '#F6F3FF', '#FFF6E8', '#E8FFF5', '#FEF3F3'];
  const pickColor = name => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
    return avatarColors[Math.abs(h) % avatarColors.length];
  };

  const medalSVG = (rank) => {
    if (rank === 1) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="#F59E0B" />
        <path d="M8 14l-1 6h10l-1-6" fill="#FBBF24" />
      </svg>
    );
    if (rank === 2) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      </svg>
    );
    if (rank === 3) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="#FCD34D" />
      </svg>
    );
    return null;
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-12" style={{ background: 'linear-gradient(180deg,#f7fbff 0%, #ffffff 60%)' }}>
      <div className="w-full max-w-6xl px-6 mx-auto">
        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '2rem', margin: 0, color: '#124D96' }}>Community Rankings</h1>
              <p style={{ fontSize: '1rem', color: '#666', marginTop: 6 }}>Recent activity — based on tests taken in the last 30 days</p>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Updated just now</div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-sm text-slate-500">Loading rankings…</div>
            ) : (
              sorted.map((u, idx) => {
              const rank = idx + 1;
              const initials = u.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
              const isCurrent = (() => {
                try {
                  const userName = localStorage.getItem('userName');
                  return userName && userName === u.name;
                } catch {
                  return false;
                }
              })();

                return (
                <div
                  key={u.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/ranking/${encodeURIComponent(u.name)}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/ranking/${encodeURIComponent(u.name)}`); }}
                  className={`flex items-center justify-between gap-4 p-4 rounded-md transition transform duration-200 hover:shadow-2xl hover:-translate-y-1 border-2 cursor-pointer ${isCurrent ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div style={{ background: pickColor(u.name) }} className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-slate-900 shadow-sm">
                        {initials}
                      </div>

                      <div>
                        <div className="text-base font-medium text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{u.tests} tests completed</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {medalSVG(rank)}
                      <div className="text-sm text-slate-700 font-semibold">#{rank}</div>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>

          {error ? (
            <p className="mt-5 text-sm text-rose-600">Unable to load latest rankings: {error}. Showing sample data.</p>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Tip: rankings will soon reflect test difficulty and recency.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ranking;
