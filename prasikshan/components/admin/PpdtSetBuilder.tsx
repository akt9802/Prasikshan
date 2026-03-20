"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

interface Story { title: string; narration: string; }
interface PPDTQuestion { _id: number; image: string; stories: Story[]; createdAt?: string; }

export default function PpdtSetBuilder({ token }: { token: string }) {
  const [questions, setQuestions] = useState<PPDTQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [stories, setStories] = useState<Story[]>([{ title: '', narration: '' }]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ppdtquestions', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
      }
    } catch {
      console.error("Failed to load PPDT questions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startEdit = (q: PPDTQuestion) => {
    setIsEditing(true);
    setCurrentId(q._id);
    setImagePreview(q.image);
    setImageFile(null); // Clear file since we have existing
    setStories(q.stories?.length ? q.stories : [{ title: '', narration: '' }]);
    setMessage({ type: '', text: '' });
  };

  const startNew = () => {
    setIsEditing(true);
    setCurrentId(Date.now()); // Temporary ID
    setImageFile(null);
    setImagePreview('');
    setStories([{ title: '', narration: '' }]);
    setMessage({ type: '', text: '' });
  };

  const saveQuestion = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let finalImageUrl = imagePreview;

      // 1. Upload new image if selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: formData,
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload image.");
        
        finalImageUrl = uploadData.secure_url;
        setUploadingImage(false);
      }

      if (!finalImageUrl) throw new Error("Image is required.");

      // 2. Save PPDT Question data
      const res = await fetch('/api/admin/ppdtquestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          _id: currentId,
          image: finalImageUrl,
          stories: stories
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'PPDT Question saved successfully!' });
        fetchQuestions();
        setIsEditing(false);
      } else {
        throw new Error(data.message || 'Failed to save question');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setUploadingImage(false);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/ppdtquestions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) fetchQuestions();
    } catch {
      // Fallback if network fails
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
              <h2 className="text-base font-extrabold" style={{ color: B.textDark }}>PPDT Questions Repository</h2>
              <p className="text-xs mt-0.5" style={{ color: B.textLight }}>Manage images and sample stories</p>
            </div>
            <button onClick={startNew} className="px-4 py-2 rounded-lg text-xs font-bold transition-all text-white hover:opacity-90 shadow-md"
              style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})` }}>
              + Create New PPDT
            </button>
          </div>

          {loading ? (
             <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }}/> Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q) => (
                <div key={q._id} className="p-4 rounded-xl flex flex-col gap-3" style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <p className="text-sm font-bold" style={{ color: B.textDark }}>ID: {q._id}</p>
                  <div className="w-full h-32 relative rounded-lg overflow-hidden border">
                    <Image src={q.image} alt="PPDT Image" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {deletingId === q._id ? (
                      <>
                         <button onClick={() => confirmDelete(q._id)} className="flex-1 px-2 py-1.5 rounded bg-red-600 text-white font-semibold text-xs border border-red-700">Sure?</button>
                         <button onClick={() => setDeletingId(null)} className="flex-1 px-2 py-1.5 rounded bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-300">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(q)} className="flex-1 px-2 py-1.5 rounded bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-200">Edit</button>
                        <button onClick={() => setDeletingId(q._id)} className="flex-1 px-2 py-1.5 rounded bg-red-50 text-red-600 font-semibold text-xs border border-red-200">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.05)' }}>
          <div className="flex items-center justify-between pb-4 mb-6" style={{ borderBottom: '1.5px dashed rgba(18,77,150,0.12)' }}>
            <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>{currentId && currentId < 1000000 ? `Editing PPDT ID: ${currentId}` : "Create New PPDT"}</h2>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200">Cancel</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
               <label style={labelStyle}>PPDT Image</label>
               <input type="file" accept="image/*" onChange={handleFileSelect} className="mb-4 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
               <div className="w-full h-64 relative rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden" style={{ borderColor: imagePreview ? 'transparent' : 'rgba(18,77,150,0.3)', background: B.iceBlue }}>
                 {imagePreview ? (
                   <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                 ) : (
                   <span className="text-sm text-gray-400 font-semibold">No Image Selected</span>
                 )}
               </div>
            </div>

            {/* Stories Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label style={{...labelStyle, marginBottom: 0}}>Sample Stories</label>
                <button onClick={() => setStories([...stories, {title: '', narration: ''}])} className="text-xs font-bold text-blue-600">+ Add Sample Story</button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-4">
                {stories.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-xl relative" style={{ background: 'rgba(18,77,150,0.03)', border: '1px solid rgba(18,77,150,0.1)' }}>
                    {stories.length > 1 && (
                       <button onClick={() => setStories(stories.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-500 font-bold text-xs p-1">X</button>
                    )}
                    <input style={{...inputStyle, marginBottom: '8px', background: '#fff'}} placeholder="Story Title..." value={s.title} onChange={(e) => {
                      const newS = [...stories]; newS[idx].title = e.target.value; setStories(newS);
                    }} />
                    <textarea rows={4} style={{...inputStyle, background: '#fff'}} placeholder="Write the sample narration..." value={s.narration} onChange={(e) => {
                      const newS = [...stories]; newS[idx].narration = e.target.value; setStories(newS);
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
               {message.text}
            </div>
          )}

          <button onClick={saveQuestion} disabled={saving} className="mt-8 w-full py-4 rounded-xl font-black text-white shadow-md transition-all disabled:opacity-70"
            style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})` }}>
            {uploadingImage ? 'Uploading Image to Cloudinary...' : saving ? 'Saving Question...' : 'Save PPDT Question'}
          </button>
        </div>
      )}
    </div>
  );
}
