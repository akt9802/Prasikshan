"use client";

import React, { useState, useEffect, useCallback } from "react";

// ── Brand palette ──────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96', navyDark: '#0D3A72',
  iceBlue: '#EDF9FF', iceMid: '#D7F1FF',
  textDark: '#0F172A', textMid: '#334155', textMuted: '#475569', textLight: '#94A3B8',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  border: '1.5px solid rgba(18,77,150,0.18)', background: 'rgba(237,249,255,0.6)',
  color: B.textDark, outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, color: B.textMuted, letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: '6px', display: 'block',
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const PlusIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const RefreshIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg>;
const EditIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const XIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// ── Types ──────────────────────────────────────────────────────────────────────
interface WatQuestion { word: string; sentences: string[]; }
interface WatSetRecord { _id: string; setName: string; createdAt: string; }

const SET_SIZE = 60;
const EMPTY_WAT = (): WatQuestion => ({ word: '', sentences: ['', ''] });
const INITIAL_WAT = (): WatQuestion[] => Array.from({ length: SET_SIZE }, EMPTY_WAT);

// ── Component ──────────────────────────────────────────────────────────────────
export default function WatSetBuilder({ token }: { token: string }) {
  const [setName, setSetName] = useState('');
  const [questions, setQuestions] = useState<WatQuestion[]>(INITIAL_WAT());
  const [currentQ, setCurrentQ] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [existingSets, setExistingSets] = useState<WatSetRecord[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const fetchSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      const res = await fetch('/api/admin/watsets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setExistingSets(data.sets);
    } catch {/* ignore */} finally { setLoadingSets(false); }
  }, [token]);

  useEffect(() => { fetchSets(); }, [fetchSets]);

  const q = questions[currentQ];

  // A question is "done" if it has a non-empty word and at least one non-empty sentence
  const filledCount = questions.filter(q => q.word.trim() && q.sentences.some(s => s.trim())).length;

  const updateQ = (patch: Partial<WatQuestion>) =>
    setQuestions(prev => prev.map((item, i) => i === currentQ ? { ...item, ...patch } : item));

  const updateSentence = (sIdx: number, val: string) => {
    const newSentences = [...q.sentences];
    newSentences[sIdx] = val;
    updateQ({ sentences: newSentences });
  };

  const addSentence = () => updateQ({ sentences: [...q.sentences, ''] });

  const removeSentence = (sIdx: number) => {
    if (q.sentences.length <= 1) return;
    updateQ({ sentences: q.sentences.filter((_, i) => i !== sIdx) });
  };

  const handleEdit = async (id: string) => {
    setLoadingEdit(true); setSaveStatus('idle');
    try {
      const res = await fetch(`/api/admin/watsets?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.set) {
        const loaded: WatQuestion[] = data.set.questions.map((q: WatQuestion) => ({
          word: q.word,
          sentences: q.sentences.length > 0 ? q.sentences : ['', ''],
        }));
        while (loaded.length < SET_SIZE) loaded.push(EMPTY_WAT());
        setQuestions(loaded.slice(0, SET_SIZE));
        setSetName(data.set.setName);
        setEditingId(id);
        setCurrentQ(0);
        document.getElementById('watset-builder')?.scrollIntoView({ behavior: 'smooth' });
      } else { setSaveStatus('error'); setSaveMessage('Failed to load set for editing.'); }
    } catch { setSaveStatus('error'); setSaveMessage('Network error loading set.'); }
    finally { setLoadingEdit(false); }
  };

  const cancelEdit = () => {
    setEditingId(null); setSetName('');
    setQuestions(INITIAL_WAT()); setCurrentQ(0); setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!setName.trim()) { setSaveStatus('error'); setSaveMessage('Please enter a Set Name.'); return; }
    if (filledCount < SET_SIZE) {
      setSaveStatus('error');
      setSaveMessage(`${SET_SIZE - filledCount} words are incomplete. Fill all ${SET_SIZE} before saving.`);
      return;
    }
    setSaving(true); setSaveStatus('idle');
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/admin/watsets?id=${editingId}` : '/api/admin/watsets';
      const method = isEdit ? 'PUT' : 'POST';

      // Clean: remove blank trailing sentences
      const cleanedQuestions = questions.map(q => ({
        word: q.word.trim(),
        sentences: q.sentences.map(s => s.trim()).filter(Boolean),
      }));

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ setName: setName.trim(), questions: cleanedQuestions }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('success'); setSaveMessage(data.message);
        if (!editingId) { setSetName(''); setQuestions(INITIAL_WAT()); setCurrentQ(0); }
        setEditingId(null);
        fetchSets();
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else { setSaveStatus('error'); setSaveMessage(data.message); }
    } catch { setSaveStatus('error'); setSaveMessage('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/watsets?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) fetchSets();
    } catch {/* ignore */} finally { setDeletingId(null); }
  };

  // Dot colour for navigator
  const dotStyle = (idx: number): React.CSSProperties => {
    const isCur = idx === currentQ;
    const isDone = questions[idx].word.trim() && questions[idx].sentences.some(s => s.trim());
    if (isCur) return { background: `linear-gradient(135deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 2px 8px rgba(18,77,150,0.30)' };
    if (isDone) return { background: 'linear-gradient(135deg,#15803D,#047857)', color: '#fff' };
    return { background: B.iceMid, color: B.textMuted };
  };

  return (
    <div className="flex flex-col gap-8">

      {/* ── Existing Sets ── */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold" style={{ color: B.textDark }}>Existing WAT Sets</h2>
            <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Manage sets currently in the database</p>
          </div>
          <button onClick={fetchSets}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80"
            style={{ background: 'rgba(18,77,150,0.08)', color: B.navy, border: '1px solid rgba(18,77,150,0.18)' }}>
            <RefreshIcon /> Refresh
          </button>
        </div>

        {loadingSets ? (
          <div className="flex items-center gap-3 py-6">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
            <span className="text-sm" style={{ color: B.textMuted }}>Loading sets…</span>
          </div>
        ) : existingSets.length === 0 ? (
          <div className="py-8 text-center rounded-xl" style={{ background: B.iceBlue, border: '1.5px dashed rgba(18,77,150,0.20)' }}>
            <p className="text-sm font-medium" style={{ color: B.textLight }}>No WAT sets found. Create one below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingSets.map(set => (
              <div key={set._id} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: B.textDark }}>{set.setName}</p>
                  <p className="text-xs mt-0.5" style={{ color: B.textLight }}>
                    Created: {new Date(set.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(set._id)} disabled={loadingEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ background: 'rgba(18,77,150,0.08)', color: B.navy, border: '1px solid rgba(18,77,150,0.20)' }}>
                    {loadingEdit && editingId === set._id
                      ? <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                      : <EditIcon />}
                    Edit
                  </button>
                  <button onClick={() => handleDelete(set._id, set.setName)} disabled={deletingId === set._id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                    {deletingId === set._id
                      ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <TrashIcon />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Set Builder ── */}
      <div id="watset-builder" className="rounded-2xl p-6 sm:p-8"
        style={{
          background: 'rgba(255,255,255,0.78)',
          border: `1.5px solid ${editingId ? 'rgba(18,77,150,0.35)' : 'rgba(18,77,150,0.13)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: editingId ? '0 0 0 3px rgba(18,77,150,0.10)' : 'none',
        }}>

        {/* Builder header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-5"
          style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
          <div>
            {editingId ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(18,77,150,0.12)', color: B.navy }}>EDIT MODE</span>
                </div>
                <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>Editing: {setName || '…'}</h2>
                <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Modify words & sentences then click Save</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>Create New WAT Set</h2>
                <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Fill in all {SET_SIZE} words then save the set</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {editingId && (
              <button onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                <XIcon /> Cancel Edit
              </button>
            )}
            {/* Progress pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
              style={{
                background: filledCount === SET_SIZE ? 'rgba(21,128,61,0.10)' : 'rgba(18,77,150,0.07)',
                border: `1.5px solid ${filledCount === SET_SIZE ? 'rgba(21,128,61,0.3)' : 'rgba(18,77,150,0.18)'}`,
              }}>
              <span className="text-2xl font-black" style={{ color: filledCount === SET_SIZE ? '#15803D' : B.navy }}>{filledCount}</span>
              <span className="text-xs font-bold" style={{ color: B.textMuted }}>/ {SET_SIZE} done</span>
            </div>
          </div>
        </div>

        {/* Set Name */}
        <div className="mb-6">
          <label style={labelStyle}>Set Name</label>
          <input style={inputStyle} placeholder="e.g. WAT Set 1, WAT Set 2…"
            value={setName} onChange={e => setSetName(e.target.value)} />
        </div>

        {/* Main Workspace: Left Nav, Right Editor */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ── Left Column: Navigator ── */}
          <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-6">
            <div className="mb-2 flex items-center justify-between">
              <label style={{ ...labelStyle, marginBottom: 0 }}>Word Navigator</label>
              <span className="text-[10px] font-black px-2 py-0.5 rounded text-white" style={{ background: filledCount === SET_SIZE ? '#15803D' : B.navy }}>{filledCount} / {SET_SIZE}</span>
            </div>
            
            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-6 gap-2 p-4 rounded-xl" style={{ background: B.iceBlue, border: '1.5px solid rgba(18,77,150,0.12)' }}>
              {questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentQ(idx)}
                  className="h-9 rounded-lg text-xs font-black transition-all duration-200 hover:scale-105"
                  style={dotStyle(idx)}>
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(18,77,150,0.08)' }}>
              {[
                { color: `linear-gradient(135deg,${B.navyDark},${B.navy})`, label: 'Current' },
                { color: 'linear-gradient(135deg,#15803D,#047857)', label: 'Complete' },
                { color: B.iceMid, label: 'Empty', text: B.textMuted },
              ].map(({ color, label, text }) => (
                <div key={label} className="flex items-center gap-1.5 shrink-0">
                  <div className="w-3.5 h-3.5 rounded-md shrink-0" style={{ background: color }} />
                  <span className="text-[11px] font-bold" style={{ color: text || B.textMid }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column: Editor & Action ── */}
          <div className="flex-1 w-full min-w-0">
            {/* Current Word Editor */}
            <div className="rounded-xl p-5 sm:p-7 flex flex-col gap-6" style={{ background: `rgba(18,77,150,0.03)`, border: '1.5px solid rgba(18,77,150,0.15)', boxShadow: 'inset 0 4px 20px rgba(255,255,255,0.6)' }}>
              {/* Nav controls */}
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1.5px dashed rgba(18,77,150,0.12)' }}>
                <span className="text-sm font-black px-4 py-1.5 rounded-full" style={{ background: `rgba(18,77,150,0.10)`, color: B.navy }}>
                  Word {currentQ + 1} / {SET_SIZE}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.6)', color: B.navy, border: '1.5px solid rgba(18,77,150,0.15)' }}>
                    ← Prev
                  </button>
                  <button onClick={() => setCurrentQ(Math.min(SET_SIZE - 1, currentQ + 1))} disabled={currentQ === SET_SIZE - 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-30"
                    style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})`, color: '#fff', border: '1.5px solid transparent' }}>
                    Next →
                  </button>
                </div>
              </div>

              {/* Word input */}
              <div>
                <label style={labelStyle}>Word</label>
                <input style={{ ...inputStyle, background: '#fff', border: '1.5px solid rgba(18,77,150,0.22)' }} placeholder="e.g. valor, courage, integrity…"
                  value={q.word} onChange={e => updateQ({ word: e.target.value })} />
              </div>

              {/* Example Sentences */}
              <div>
                <label style={labelStyle}>Example Sentences</label>
                <div className="flex flex-col gap-3">
                  {q.sentences.map((sentence, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5">
                      <span className="w-8 h-8 mt-1.5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                        style={{ background: sentence.trim() ? '#15803D' : B.navy }}>
                        {sIdx + 1}
                      </span>
                      <textarea
                        rows={2}
                        style={{ ...inputStyle, background: sentence.trim() ? 'rgba(21,128,61,0.03)' : '#fff', border: sentence.trim() ? '1.5px solid rgba(21,128,61,0.3)' : '1.5px solid rgba(18,77,150,0.22)', resize: 'vertical' }}
                        placeholder={`Example sentence ${sIdx + 1}…`}
                        value={sentence}
                        onChange={e => updateSentence(sIdx, e.target.value)}
                      />
                      {q.sentences.length > 1 && (
                        <button type="button" onClick={() => removeSentence(sIdx)}
                          className="p-2 mt-1.5 rounded-lg transition-all hover:bg-red-50 hover:opacity-80 shrink-0 group"
                          style={{ color: '#DC2626', border: '1.5px solid rgba(220,38,38,0.20)' }}>
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {q.sentences.length < 5 && (
                  <button type="button" onClick={addSentence}
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: `rgba(18,77,150,0.06)`, color: B.navy, border: `1.5px dashed rgba(18,77,150,0.3)` }}>
                    <PlusIcon /> Add Sentence
                  </button>
                )}
              </div>
            </div>

            {/* Status message */}
            {saveStatus !== 'idle' && (
              <div className="mt-6 px-4 py-4 rounded-xl text-sm font-bold flex items-center gap-2.5 shadow-sm"
                style={{
                  background: saveStatus === 'success' ? '#F0FDF4' : '#FEF2F2',
                  color: saveStatus === 'success' ? '#15803D' : '#DC2626',
                  border: `1.5px solid ${saveStatus === 'success' ? 'rgba(21,128,61,0.3)' : 'rgba(220,38,38,0.3)'}`,
                }}>
                {saveStatus === 'success' ? <CheckIcon /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                )}
                {saveMessage}
              </div>
            )}

            {/* Save Button */}
            <button onClick={handleSave} disabled={saving}
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[15px] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 shadow-md"
              style={{ background: saving ? B.textMuted : `linear-gradient(135deg,${B.navyDark},${B.navy})`, color: '#fff' }}>
              {saving ? (
                <><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Saving Set…</>
              ) : (
                <><SaveIcon /> Save WAT Set ({filledCount}/{SET_SIZE} words filled)</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
