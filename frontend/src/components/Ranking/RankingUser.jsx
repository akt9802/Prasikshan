import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RankingUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const base = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL) || '';
        const res = await fetch(`${base}/v1/ranking`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body || !body.success || !Array.isArray(body.data)) throw new Error('Unexpected response');

        const decoded = decodeURIComponent(username || '');
        const found = body.data.find(u => u.name === decoded || encodeURIComponent(u.name) === username);
        if (!cancelled) setUser(found || { name: decoded, testsTakenCount: 0, testsTaken: [] });
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  if (loading) return <div className="p-6">Loading user…</div>;
  if (error) return <div className="p-6 text-rose-600">Error: {error}</div>;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: 20 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24 }}>
          <button
            onClick={() => navigate('/ranking')}
            style={{
              display: 'inline-block',
              marginBottom: 12,
              color: '#374151',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Back to rankings
          </button>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
              {user && user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : ''}
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#124D96' }}>{user?.name}</h2>
              <div style={{ marginTop: 6, color: '#6b7280' }}>Tests taken: {user?.testsTakenCount ?? (user?.testsTaken?.length ?? 0)}</div>
            </div>
          </div>

          <section style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Recent tests</h3>
            <div style={{ marginTop: 12 }}>
              {(user && Array.isArray(user.testsTaken) && user.testsTaken.length > 0) ? (
                user.testsTaken.slice(0,10).map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f8fafc', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ color: '#0f172a' }}>{t.testName}</div>
                    <div style={{ color: '#374151', fontWeight: 600 }}>{t.score} pts</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280' }}>No tests recorded yet for this user.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RankingUser;
