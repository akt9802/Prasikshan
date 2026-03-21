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

interface LecturetteQuestion {
  _id: string;
  topic_id: number;
  topic: string;
  speech: string;
}

export default function LecturetteBuilder({ token }: { token: string }) {
  const [questions, setQuestions] = useState<LecturetteQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<number | ''>('');
  const [topic, setTopic] = useState("");
  const [speech, setSpeech] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/lecturettequestions', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
      }
    } catch {
      console.error("Failed to load Lecturette questions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const startEdit = (q: LecturetteQuestion) => {
    setIsEditing(true);
    setCurrentId(q._id);
    setTopicId(q.topic_id);
    setTopic(q.topic);
    setSpeech(q.speech || "");
    setMessage({ type: '', text: '' });
  };

  const startNew = () => {
    setIsEditing(true);
    setCurrentId(null);
    setTopicId("");
    setTopic("");
    setSpeech("");
    setMessage({ type: '', text: '' });
  };

  const saveQuestion = async () => {
    if (!topic.trim() || !speech.trim()) {
      setMessage({ type: 'error', text: 'Topic and Standard Speech fields are required.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isCreate = !currentId;
      const url = isCreate ? '/api/admin/lecturettequestions' : `/api/admin/lecturettequestions?id=${currentId}`;
      const method = isCreate ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          topic_id: topicId === '' ? undefined : topicId,
          topic: topic.trim(),
          speech: speech.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: isCreate ? 'Topic added successfully!' : 'Topic updated successfully!' });
        fetchQuestions();
        if (isCreate) {
          setIsEditing(false); // Close modal automatically if creating to see list
        }
      } else {
        throw new Error(data.message || 'Failed to save question');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string, tName: string) => {
    if (!confirm(`Are you sure you want to delete topic: "${tName}"?`)) {
      setDeletingId(null);
      return;
    }

    try {
      const res = await fetch(`/api/admin/lecturettequestions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) fetchQuestions();
    } catch {
      console.error("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {!isEditing && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold" style={{ color: B.textDark }}>Lecturette Topics</h2>
              <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Manage topics and reference speeches</p>
            </div>
            <button onClick={startNew} className="px-4 py-2 rounded-lg text-xs font-bold transition-all text-white hover:opacity-90 shadow-md"
              style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})` }}>
              + Add Topic
            </button>
          </div>

          {loading ? (
             <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }}/> Loading topics...</div>
          ) : questions.length === 0 ? (
             <div className="py-8 text-center rounded-xl" style={{ background: B.iceBlue, border: '1.5px dashed rgba(18,77,150,0.20)' }}>
               <p className="text-sm font-medium" style={{ color: B.textLight }}>No Lecturette topics found.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q) => (
                <div key={q._id} className="p-5 rounded-xl flex flex-col gap-3 justify-between" style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2 inline-block" style={{ background: 'rgba(18,77,150,0.1)', color: B.navy }}>
                      ID: {q.topic_id || "N/A"}
                    </span>
                    <p className="text-sm font-bold leading-tight" style={{ color: B.textDark }}>{q.topic}</p>
                    <p className="text-xs mt-2 text-slate-500 line-clamp-3 italic leading-relaxed">{q.speech}</p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                    <button onClick={() => startEdit(q)} className="flex-1 px-2 py-2 rounded bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-200 transition-colors hover:bg-blue-100">Edit Reference</button>
                    <button onClick={() => { setDeletingId(q._id); confirmDelete(q._id, q.topic); }} className="flex-1 px-2 py-2 rounded bg-red-50 text-red-600 font-semibold text-xs border border-red-200 transition-colors hover:bg-red-100">{deletingId === q._id ? 'Deleting...' : 'Delete'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto w-full" style={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.05)' }}>
          <div className="flex items-center justify-between pb-4 mb-6" style={{ borderBottom: '1.5px dashed rgba(18,77,150,0.12)' }}>
            <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>{currentId ? `Editing Topic ID: ${topicId}` : "Create New Topic"}</h2>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200">Close Editor</button>
          </div>

          <div className="flex flex-col gap-5">


            <div>
              <label style={labelStyle}>Speech Topic Title</label>
              <input style={inputStyle} placeholder="e.g. Impact of Artificial Intelligence..." value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>Standard Reference Speech</label>
              <textarea rows={10} style={{...inputStyle, resize: 'vertical'}} placeholder="Write the ideal reference speech here..." value={speech} onChange={(e) => setSpeech(e.target.value)} />
            </div>
          </div>

          {message.text && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
               {message.text}
            </div>
          )}

          <button onClick={saveQuestion} disabled={saving} className="mt-8 w-full py-4 rounded-xl font-black text-white shadow-md transition-all disabled:opacity-70 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})` }}>
            {saving ? 'Saving Data...' : 'Save Lecturette Topic'}
          </button>
        </div>
      )}
    </div>
  );
}
