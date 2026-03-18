"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96', navyDark: '#0D3A72', navyDeep: '#0A2A55',
  blueMid: '#2563EB', blueLight: '#60A5FA',
  iceBlue: '#EDF9FF', iceMid: '#D7F1FF',
  textDark: '#0F172A', textMid: '#334155', textMuted: '#475569', textLight: '#94A3B8',
};

const TEST_COLORS: Record<string, string> = {
  OIR: '#124D96', PPDT: '#0891B2', TAT: '#7C3AED',
  WAT: '#059669', SRT: '#DC2626', LECTURETTE: '#D97706', PI: '#9333EA',
};
type Tab = 'OIR' | 'PPDT' | 'TAT' | 'WAT' | 'SRT' | 'LECTURETTE' | 'PI';
const TABS: Tab[] = ['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'LECTURETTE', 'PI'];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const BrainIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-2.5-2.5V2z" /><path d="M9.5 2A4.5 4.5 0 005 6.5c0 1.33.58 2.52 1.5 3.35" /><path d="M9.5 7a4.5 4.5 0 00-3 8.45" /><path d="M14.5 2A2.5 2.5 0 0112 4.5" /><path d="M14.5 2A4.5 4.5 0 0119 6.5c0 1.33-.58 2.52-1.5 3.35" /><path d="M14.5 7a4.5 4.5 0 013 8.45" /></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>;
const MsgIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
const ZapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const MicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const RefreshIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg>;
const EditIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const XIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  OIR: <BrainIcon />, PPDT: <ImageIcon />, TAT: <BookIcon />,
  WAT: <MsgIcon />, SRT: <ZapIcon />, LECTURETTE: <MicIcon />, PI: <UserIcon />,
};

// ── Shared field styles ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  border: '1.5px solid rgba(18,77,150,0.18)', background: 'rgba(237,249,255,0.6)',
  color: B.textDark, outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, color: B.textMuted, letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: '6px', display: 'block',
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface OirQuestion { question: string; options: string[]; answer: string; }
interface OirSetRecord { _id: string; setName: string; createdAt: string; }

const EMPTY_QUESTION = (): OirQuestion => ({ question: '', options: ['', '', '', ''], answer: '' });
const INITIAL_QUESTIONS = (): OirQuestion[] => Array.from({ length: 40 }, EMPTY_QUESTION);

// ── OIR Set Builder ───────────────────────────────────────────────────────────
function OirSetBuilder({ token }: { token: string }) {
  const [setName, setSetName] = useState('');
  const [questions, setQuestions] = useState<OirQuestion[]>(INITIAL_QUESTIONS());
  const [currentQ, setCurrentQ] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [existingSets, setExistingSets] = useState<OirSetRecord[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const fetchSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      const res = await fetch('/api/admin/oirsets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setExistingSets(data.sets);
    } catch {/* ignore */} finally { setLoadingSets(false); }
  }, [token]);

  useEffect(() => { fetchSets(); }, [fetchSets]);

  const q = questions[currentQ];
  const filledCount = questions.filter(q => q.question.trim() && q.answer.trim()).length;

  const updateQ = (patch: Partial<OirQuestion>) =>
    setQuestions(prev => prev.map((item, i) => i === currentQ ? { ...item, ...patch } : item));

  const updateOption = (optIdx: number, val: string) => {
    const newOpts = [...q.options];
    newOpts[optIdx] = val;
    updateQ({ options: newOpts });
  };

  // Load a set into the builder for editing
  const handleEdit = async (id: string) => {
    setLoadingEdit(true);
    setSaveStatus('idle');
    try {
      const res = await fetch(`/api/admin/oirsets?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.set) {
        // Pad to 40 if the set has fewer questions (safety net)
        const loaded: OirQuestion[] = data.set.questions.map((q: OirQuestion) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        }));
        while (loaded.length < 40) loaded.push(EMPTY_QUESTION());
        setQuestions(loaded.slice(0, 40));
        setSetName(data.set.setName);
        setEditingId(id);
        setCurrentQ(0);
        // Scroll builder into view
        document.getElementById('oirset-builder')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setSaveStatus('error'); setSaveMessage('Failed to load set for editing.');
      }
    } catch { setSaveStatus('error'); setSaveMessage('Network error loading set.'); }
    finally { setLoadingEdit(false); }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSetName('');
    setQuestions(INITIAL_QUESTIONS());
    setCurrentQ(0);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!setName.trim()) { setSaveStatus('error'); setSaveMessage('Please enter a Set Name.'); return; }
    if (filledCount < 40) { setSaveStatus('error'); setSaveMessage(`${40 - filledCount} questions are incomplete. Fill all 40 before saving.`); return; }

    setSaving(true); setSaveStatus('idle');
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/admin/oirsets?id=${editingId}` : '/api/admin/oirsets';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ setName: setName.trim(), questions }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('success'); setSaveMessage(data.message);
        // If editing, stay in context; if creating, reset
        if (!editingId) {
          setSetName(''); setQuestions(INITIAL_QUESTIONS()); setCurrentQ(0);
        }
        setEditingId(null);
        fetchSets();
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        setSaveStatus('error'); setSaveMessage(data.message);
      }
    } catch { setSaveStatus('error'); setSaveMessage('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/oirsets?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) fetchSets();
    } catch {/* ignore */} finally { setDeletingId(null); }
  };

  // Dot colour for question navigator
  const dotStyle = (idx: number): React.CSSProperties => {
    const isCur = idx === currentQ;
    const isDone = questions[idx].question.trim() && questions[idx].answer.trim();
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
            <h2 className="text-base font-extrabold" style={{ color: B.textDark }}>Existing OIR Sets</h2>
            <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Manage sets currently in the database</p>
          </div>
          <button onClick={fetchSets} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80"
            style={{ background: `rgba(18,77,150,0.08)`, color: B.navy, border: `1px solid rgba(18,77,150,0.18)` }}>
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
            <p className="text-sm font-medium" style={{ color: B.textLight }}>No OIR sets found. Create one below.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
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
                  {/* Edit button */}
                  <button onClick={() => handleEdit(set._id)} disabled={loadingEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ background: `rgba(18,77,150,0.08)`, color: B.navy, border: `1px solid rgba(18,77,150,0.20)` }}>
                    {loadingEdit && editingId === set._id
                      ? <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                      : <EditIcon />}
                    Edit
                  </button>
                  {/* Delete button */}
                  <button onClick={() => handleDelete(set._id, set.setName)} disabled={deletingId === set._id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                    {deletingId === set._id ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <TrashIcon />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Set Builder ── */}
      <div id="oirset-builder" className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.78)', border: `1.5px solid ${editingId ? 'rgba(18,77,150,0.35)' : 'rgba(18,77,150,0.13)'}`, backdropFilter: 'blur(12px)', boxShadow: editingId ? `0 0 0 3px rgba(18,77,150,0.10)` : 'none' }}>
        {/* Builder header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-5" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
          <div>
            {editingId ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `rgba(18,77,150,0.12)`, color: B.navy }}>EDIT MODE</span>
                </div>
                <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>Editing: {setName || '…'}</h2>
                <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Modify questions then click Save to update the set</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>Create New OIR Set</h2>
                <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Fill in all 40 questions then save the set</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Cancel edit button */}
            {editingId && (
              <button onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                <XIcon /> Cancel Edit
              </button>
            )}
            {/* Progress pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
              style={{ background: filledCount === 40 ? 'rgba(21,128,61,0.10)' : 'rgba(18,77,150,0.07)', border: `1.5px solid ${filledCount === 40 ? 'rgba(21,128,61,0.3)' : 'rgba(18,77,150,0.18)'}` }}>
              <span className="text-2xl font-black" style={{ color: filledCount === 40 ? '#15803D' : B.navy }}>{filledCount}</span>
              <span className="text-xs font-bold" style={{ color: B.textMuted }}>/ 40 done</span>
            </div>
          </div>
        </div>

        {/* Set Name */}
        <div className="mb-6">
          <label style={labelStyle}>Set Name</label>
          <input style={inputStyle} placeholder="e.g. Set 2, Set 3…" value={setName}
            onChange={e => setSetName(e.target.value)} />
        </div>

        {/* Question Navigator */}
        <div className="mb-6">
          <label style={labelStyle}>Questions Navigator</label>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-4 rounded-xl" style={{ background: B.iceBlue, border: '1.5px solid rgba(18,77,150,0.12)' }}>
            {questions.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentQ(idx)}
                className="h-9 rounded-lg text-xs font-black transition-all duration-200 hover:scale-110"
                style={dotStyle(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            {[
              { color: `linear-gradient(135deg,${B.navyDark},${B.navy})`, label: 'Current' },
              { color: 'linear-gradient(135deg,#15803D,#047857)', label: 'Complete' },
              { color: B.iceMid, label: 'Empty', text: B.textMuted },
            ].map(({ color, label, text }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md shrink-0" style={{ background: color }} />
                <span className="text-xs" style={{ color: text || B.textMid }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Question Editor */}
        <div className="rounded-xl p-5 flex flex-col gap-5" style={{ background: `rgba(18,77,150,0.04)`, border: '1.5px solid rgba(18,77,150,0.14)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black px-3 py-1 rounded-full"
              style={{ background: `rgba(18,77,150,0.10)`, color: B.navy }}>
              Q {currentQ + 1} / 40
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-30"
                style={{ background: 'rgba(18,77,150,0.08)', color: B.navy, border: '1px solid rgba(18,77,150,0.18)' }}>
                ← Prev
              </button>
              <button onClick={() => setCurrentQ(Math.min(39, currentQ + 1))} disabled={currentQ === 39}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-30"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff' }}>
                Next →
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label style={labelStyle}>Question</label>
            <textarea rows={3} style={inputStyle} placeholder="Enter the question text…"
              value={q.question} onChange={e => updateQ({ question: e.target.value })} />
          </div>

          {/* Options */}
          <div>
            <label style={labelStyle}>Options</label>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: q.answer === opt && opt ? '#15803D' : B.navy }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input style={inputStyle} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt} onChange={e => updateOption(i, e.target.value)} />
                  {q.options.length > 2 && (
                    <button type="button" onClick={() => updateQ({ options: q.options.filter((_, j) => j !== i), answer: q.answer === opt ? '' : q.answer })}
                      className="p-1.5 rounded-lg transition-all hover:opacity-80 shrink-0"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {q.options.length < 6 && (
              <button type="button" onClick={() => updateQ({ options: [...q.options, ''] })}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:opacity-80"
                style={{ background: `rgba(18,77,150,0.08)`, color: B.navy, border: `1px solid rgba(18,77,150,0.18)` }}>
                <PlusIcon /> Add Option
              </button>
            )}
          </div>

          {/* Correct Answer */}
          <div>
            <label style={labelStyle}>Correct Answer</label>
            <select style={inputStyle} value={q.answer} onChange={e => updateQ({ answer: e.target.value })}>
              <option value="">Select correct option…</option>
              {q.options.map((opt, i) => opt && (
                <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status message */}
        {saveStatus !== 'idle' && (
          <div className="mt-5 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{
              background: saveStatus === 'success' ? 'rgba(21,128,61,0.10)' : 'rgba(220,38,38,0.08)',
              color: saveStatus === 'success' ? '#15803D' : '#DC2626',
              border: `1.5px solid ${saveStatus === 'success' ? 'rgba(21,128,61,0.25)' : 'rgba(220,38,38,0.22)'}`,
            }}>
            {saveStatus === 'success' ? <CheckIcon /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            )}
            {saveMessage}
          </div>
        )}

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving}
          className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: saving ? B.textMuted : `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 6px 20px rgba(18,77,150,0.28)' }}>
          {saving ? (
            <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Saving Set…</>
          ) : (
            <><SaveIcon /> Save OIR Set ({filledCount}/40 questions filled)</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Placeholder for other test tabs ──────────────────────────────────────────
function ComingSoon({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: `${TEST_COLORS[tab]}15`, color: TEST_COLORS[tab], border: `1.5px solid ${TEST_COLORS[tab]}30` }}>
        {TAB_ICONS[tab]}
      </div>
      <h3 className="text-lg font-extrabold mb-2" style={{ color: B.textDark }}>{tab} Manager</h3>
      <p className="text-sm" style={{ color: B.textLight }}>Full question management for {tab} coming soon.</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('OIR');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const t = localStorage.getItem('token');
        if (!t) { router.push('/signin'); return; }

        const res = await fetch('/api/auth/userdetails', { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json();

        if (data.success && data.user?.role === 'admin') {
          setAuthorized(true);
          setToken(t);
        }
      } catch {/* access denied */} finally { setLoading(false); }
    };
    checkAdmin();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Verifying access…</p>
      </div>
    </div>
  );

  if (!authorized) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.78)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <div>
          <p className="text-lg font-semibold" style={{ color: B.textDark }}>Access Denied</p>
          <p className="text-sm mt-1" style={{ color: B.textLight }}>You don't have permission to access this page</p>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 rounded-lg font-semibold text-sm" style={{ background: B.navy, color: '#fff' }}>
          Go Back Home
        </button>
      </div>
    </div>
  );

  const tc = TEST_COLORS[activeTab];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 40%,#c8e8f8 100%)` }}>
      {/* ── Hero header ── */}
      <div className="py-10 px-6 md:px-12" style={{ background: `linear-gradient(135deg,${B.navyDeep} 0%,${B.navyDark} 50%,${B.navy} 100%)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(255,255,255,0.10)', color: B.blueLight, border: '1px solid rgba(255,255,255,0.15)' }}>
              Admin Panel
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Test Content Manager</h1>
            <p className="text-sm font-medium mt-2" style={{ color: 'rgba(191,219,254,0.75)' }}>
              Upload and manage questions & sets for all SSB test modules
            </p>
          </div>
          <Link href="/" className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.20)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Site
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* ── Tab bar (no sidebar) ── */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
              style={{
                background: activeTab === tab ? `${TEST_COLORS[tab]}18` : 'rgba(255,255,255,0.65)',
                border: activeTab === tab ? `2px solid ${TEST_COLORS[tab]}55` : '1.5px solid rgba(18,77,150,0.12)',
                boxShadow: activeTab === tab ? `0 4px 16px ${TEST_COLORS[tab]}25` : '0 2px 8px rgba(18,77,150,0.06)',
                backdropFilter: 'blur(8px)',
              }}>
              <div className="flex justify-center mb-1.5" style={{ color: TEST_COLORS[tab] }}>{TAB_ICONS[tab]}</div>
              <p className="text-xs font-black" style={{ color: activeTab === tab ? TEST_COLORS[tab] : B.textMuted }}>{tab}</p>
            </button>
          ))}
        </div>

        {/* ── Active tab label ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${tc}15`, color: tc, border: `1.5px solid ${tc}30` }}>
            {TAB_ICONS[activeTab]}
          </div>
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>{activeTab} Manager</h2>
            <p className="text-xs" style={{ color: B.textLight }}>
              {activeTab === 'OIR' ? 'Create sets of 40 MCQ questions for the OIR test' : `Manage ${activeTab} content`}
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        {activeTab === 'OIR' ? <OirSetBuilder token={token} /> : <ComingSoon tab={activeTab} />}
      </div>
    </div>
  );
}
