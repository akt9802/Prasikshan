import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OirScore from "../Charts/OirScore.jsx";
import MonthlyTest from "../Charts/MonthlyTest.jsx";
import PPDTScore from "../Charts/PPDTScore.jsx";
import TotalTest from "../Charts/TotalTest.jsx";
import TatScore from "../Charts/TatScore.jsx";
import WatScore from "../Charts/WatScore.jsx";
import SrtScore from "../Charts/SrtScore.jsx";
import LecturetteScore from "../Charts/LecturetteScore.jsx";
import Footer from "../Footer/Footer.jsx";

function RankingUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState('OIR');

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

          {/* Charts Container (like UserDetails) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, justifyItems: 'center', marginTop: 24 }}>
            <div style={{ width: '100%', maxWidth: 700 }}>
              <TotalTest userDetails={user} />
            </div>
            <div style={{ width: '100%', maxWidth: 700 }}>
              <MonthlyTest userDetails={user} />
            </div>
          </div>

          {/* Test Score Selection Section (reuse patterns from UserDetails) */}
          <div style={{ margin: '40px 0', padding: 30, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 1200 }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#124D96', marginBottom: 20 }}>Check Test Scores</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <button onClick={() => setSelectedTest('OIR')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'OIR' ? '#0f3d6b' : '#1E5799', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>OIR</button>
                <button onClick={() => setSelectedTest('PPDT')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'PPDT' ? '#009688' : '#00C49F', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>PPDT</button>
                <button onClick={() => setSelectedTest('TAT')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'TAT' ? '#e6940a' : '#FFA500', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>TAT</button>
                <button onClick={() => setSelectedTest('WAT')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'WAT' ? '#e6692e' : '#FF8042', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>WAT</button>
                <button onClick={() => setSelectedTest('SRT')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'SRT' ? '#6c63d2' : '#8884d8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>SRT</button>
                <button onClick={() => setSelectedTest('LECTURETTE')} style={{ padding: '12px 16px', backgroundColor: selectedTest === 'LECTURETTE' ? '#6bb36b' : '#82ca9d', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>LECTURETTE</button>
              </div>

              <div style={{ borderRadius: 8, minHeight: 240 }}>
                {(() => {
                  switch (selectedTest) {
                    case 'OIR': return <OirScore userDetails={user} />;
                    case 'PPDT': return <PPDTScore userDetails={user} />;
                    case 'TAT': return <TatScore userDetails={user} />;
                    case 'WAT': return <WatScore userDetails={user} />;
                    case 'SRT': return <SrtScore userDetails={user} />;
                    case 'LECTURETTE': return <LecturetteScore userDetails={user} />;
                    default: return <OirScore userDetails={user} />;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingUser;
