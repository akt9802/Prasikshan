"use client";

import React, { useState } from "react";
import Link from "next/link";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
    navy: '#124D96',
    navyDark: '#0D3A72',
    navyDeep: '#0A2A55',
    blueMid: '#2563EB',
    blueLight: '#60A5FA',
    iceBlue: '#EDF9FF',
    iceMid: '#D7F1FF',
    textDark: '#0F172A',
    textMid: '#334155',
    textMuted: '#475569',
    textLight: '#94A3B8',
};

// ── Per-test accent colors (same as userdetails page) ─────────────────────────
const TEST_COLORS: Record<string, string> = {
    OIR: '#124D96',
    PPDT: '#0891B2',
    TAT: '#7C3AED',
    WAT: '#059669',
    SRT: '#DC2626',
    LECTURETTE: '#D97706',
    PI: '#9333EA',
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'OIR' | 'PPDT' | 'TAT' | 'WAT' | 'SRT' | 'LECTURETTE' | 'PI';

// OIR: question + options[] + answer
interface OirForm { question: string; options: string[]; answer: string; }
// PPDT: image URL + stories (title + narration)
interface PpdtStory { title: string; narration: string; }
interface PpdtForm { image: string; stories: PpdtStory[]; }
// TAT: image URL
interface TatForm { image: string; }
// WAT: word + sample sentences[]
interface WatForm { word: string; sentences: string[]; }
// SRT: situation + sample_reaction
interface SrtForm { situation: string; sample_reaction: string; }
// LECTURETTE: topic + description + keyPoints[]
interface LecForm { topic: string; description: string; keyPoints: string[]; }
// PI: question (interview question)
interface PiForm { question: string; category: string; tips: string; }

const TABS: Tab[] = ['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'LECTURETTE', 'PI'];

const TAB_META: Record<Tab, { label: string; desc: string; db: string; icon: React.ReactNode }> = {
    OIR: { label: 'OIR', desc: 'MCQ — question + 4 options + answer', db: 'OirQuestion', icon: <BrainIcon /> },
    PPDT: { label: 'PPDT', desc: 'Image URL + sample stories', db: 'PpdtQuestion', icon: <ImageIcon /> },
    TAT: { label: 'TAT', desc: 'Image URL only', db: 'TatQuestion', icon: <BookIcon /> },
    WAT: { label: 'WAT', desc: 'Word + sample sentences', db: 'WAT', icon: <MsgIcon /> },
    SRT: { label: 'SRT', desc: 'Situation + sample reaction', db: 'SRT', icon: <ZapIcon /> },
    LECTURETTE: { label: 'Lecturette', desc: 'Topic + description + key points', db: 'lecturette', icon: <MicIcon /> },
    PI: { label: 'PI', desc: 'Interview question + category + tips', db: 'PIQuestion', icon: <UserIcon /> },
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function BrainIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-2.5-2.5V2z" /><path d="M9.5 2A4.5 4.5 0 005 6.5c0 1.33.58 2.52 1.5 3.35" /><path d="M9.5 7a4.5 4.5 0 00-3 8.45" /><path d="M14.5 2A2.5 2.5 0 0112 4.5" /><path d="M14.5 2A4.5 4.5 0 0119 6.5c0 1.33-.58 2.52-1.5 3.35" /><path d="M14.5 7a4.5 4.5 0 013 8.45" /></svg>;
}
function ImageIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
function BookIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>;
}
function MsgIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
}
function ZapIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function MicIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
}
function UserIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function PlusIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function TrashIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
}
function UploadIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>;
}

// ── Shared field styles ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    border: '1.5px solid rgba(18,77,150,0.18)', background: 'rgba(237,249,255,0.6)',
    color: B.textDark, outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: B.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            {children}
        </div>
    );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button type="button" onClick={onClick}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:opacity-80"
            style={{ background: `rgba(18,77,150,0.08)`, color: B.navy, border: `1px solid rgba(18,77,150,0.18)` }}>
            <PlusIcon /> {label}
        </button>
    );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" onClick={onClick}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.20)' }}>
            <TrashIcon />
        </button>
    );
}

// ── OIR Form ──────────────────────────────────────────────────────────────────
function OirForm() {
    const [form, setForm] = useState<OirForm>({ question: '', options: ['', '', '', ''], answer: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('OIR Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ question: '', options: ['', '', '', ''], answer: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Question">
                <textarea rows={3} style={inputStyle} placeholder="Enter the question text…"
                    value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} required />
            </Field>

            <Field label="Options (min 2)">
                <div className="flex flex-col gap-2">
                    {form.options.map((opt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                                style={{ background: B.navy }}>{String.fromCharCode(65 + i)}</span>
                            <input style={inputStyle} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                value={opt} onChange={e => setForm(f => { const o = [...f.options]; o[i] = e.target.value; return { ...f, options: o }; })} required />
                            {form.options.length > 2 && <RemoveBtn onClick={() => setForm(f => ({ ...f, options: f.options.filter((_, j) => j !== i) }))} />}
                        </div>
                    ))}
                </div>
                {form.options.length < 6 && <div className="mt-2"><AddBtn label="Add Option" onClick={() => setForm(f => ({ ...f, options: [...f.options, ''] }))} /></div>}
            </Field>

            <Field label="Correct Answer">
                <select style={inputStyle} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} required>
                    <option value="">Select correct option…</option>
                    {form.options.map((opt, i) => opt && <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>)}
                </select>
            </Field>

            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── PPDT Form ─────────────────────────────────────────────────────────────────
function PpdtForm() {
    const [form, setForm] = useState<PpdtForm>({ image: '', stories: [{ title: '', narration: '' }] });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('PPDT Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ image: '', stories: [{ title: '', narration: '' }] });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Image URL">
                <input style={inputStyle} type="url" placeholder="https://…/image.jpg"
                    value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required />
            </Field>

            <Field label="Sample Stories">
                <div className="flex flex-col gap-4">
                    {form.stories.map((s, i) => (
                        <div key={i} className="p-4 rounded-xl flex flex-col gap-3" style={{ background: 'rgba(18,77,150,0.04)', border: '1px solid rgba(18,77,150,0.12)' }}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black" style={{ color: B.navy }}>Story {i + 1}</span>
                                {form.stories.length > 1 && <RemoveBtn onClick={() => setForm(f => ({ ...f, stories: f.stories.filter((_, j) => j !== i) }))} />}
                            </div>
                            <input style={inputStyle} placeholder="Story title…"
                                value={s.title} onChange={e => setForm(f => { const ss = [...f.stories]; ss[i] = { ...ss[i], title: e.target.value }; return { ...f, stories: ss }; })} required />
                            <textarea rows={3} style={inputStyle} placeholder="Story narration…"
                                value={s.narration} onChange={e => setForm(f => { const ss = [...f.stories]; ss[i] = { ...ss[i], narration: e.target.value }; return { ...f, stories: ss }; })} required />
                        </div>
                    ))}
                </div>
                <div className="mt-2"><AddBtn label="Add Story" onClick={() => setForm(f => ({ ...f, stories: [...f.stories, { title: '', narration: '' }] }))} /></div>
            </Field>

            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── TAT Form ──────────────────────────────────────────────────────────────────
function TatForm() {
    const [form, setForm] = useState<TatForm>({ image: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('TAT Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ image: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Image URL">
                <input style={inputStyle} type="url" placeholder="https://…/tat-image.jpg"
                    value={form.image} onChange={e => setForm({ image: e.target.value })} required />
            </Field>
            {form.image && (
                <div>
                    <label style={labelStyle}>Preview</label>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="TAT preview" className="rounded-xl max-h-56 object-cover w-full"
                        style={{ border: '1.5px solid rgba(18,77,150,0.18)' }} onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
            )}
            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── WAT Form ──────────────────────────────────────────────────────────────────
function WatForm() {
    const [form, setForm] = useState<WatForm>({ word: '', sentences: [''] });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('WAT Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ word: '', sentences: [''] });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Word">
                <input style={inputStyle} placeholder="e.g. Courage" value={form.word}
                    onChange={e => setForm(f => ({ ...f, word: e.target.value }))} required />
            </Field>

            <Field label="Sample Sentences (model answers)">
                <div className="flex flex-col gap-2">
                    {form.sentences.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input style={inputStyle} placeholder={`Sentence ${i + 1}…`} value={s}
                                onChange={e => setForm(f => { const ss = [...f.sentences]; ss[i] = e.target.value; return { ...f, sentences: ss }; })} required />
                            {form.sentences.length > 1 && <RemoveBtn onClick={() => setForm(f => ({ ...f, sentences: f.sentences.filter((_, j) => j !== i) }))} />}
                        </div>
                    ))}
                </div>
                <div className="mt-2"><AddBtn label="Add Sentence" onClick={() => setForm(f => ({ ...f, sentences: [...f.sentences, ''] }))} /></div>
            </Field>

            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── SRT Form ──────────────────────────────────────────────────────────────────
function SrtForm() {
    const [form, setForm] = useState<SrtForm>({ situation: '', sample_reaction: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('SRT Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ situation: '', sample_reaction: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Situation">
                <textarea rows={4} style={inputStyle} placeholder="Describe the situation the candidate faces…"
                    value={form.situation} onChange={e => setForm(f => ({ ...f, situation: e.target.value }))} required />
            </Field>
            <Field label="Sample Reaction (model answer)">
                <textarea rows={3} style={inputStyle} placeholder="What an ideal officer would do…"
                    value={form.sample_reaction} onChange={e => setForm(f => ({ ...f, sample_reaction: e.target.value }))} required />
            </Field>
            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── Lecturette Form ───────────────────────────────────────────────────────────
function LecForm() {
    const [form, setForm] = useState<LecForm>({ topic: '', description: '', keyPoints: [''] });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Lecturette payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ topic: '', description: '', keyPoints: [''] });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Topic">
                <input style={inputStyle} placeholder="e.g. Role of Youth in Nation Building"
                    value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} required />
            </Field>
            <Field label="Brief Description">
                <textarea rows={3} style={inputStyle} placeholder="Context or background of the topic…"
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </Field>
            <Field label="Key Points to Cover">
                <div className="flex flex-col gap-2">
                    {form.keyPoints.map((kp, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input style={inputStyle} placeholder={`Key point ${i + 1}…`} value={kp}
                                onChange={e => setForm(f => { const kps = [...f.keyPoints]; kps[i] = e.target.value; return { ...f, keyPoints: kps }; })} required />
                            {form.keyPoints.length > 1 && <RemoveBtn onClick={() => setForm(f => ({ ...f, keyPoints: f.keyPoints.filter((_, j) => j !== i) }))} />}
                        </div>
                    ))}
                </div>
                <div className="mt-2"><AddBtn label="Add Key Point" onClick={() => setForm(f => ({ ...f, keyPoints: [...f.keyPoints, ''] }))} /></div>
            </Field>
            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── PI Form ───────────────────────────────────────────────────────────────────
function PiForm() {
    const [form, setForm] = useState<PiForm>({ question: '', category: '', tips: '' });
    const [submitted, setSubmitted] = useState(false);

    const PI_CATEGORIES = ['Personal Background', 'Current Affairs', 'Defense Knowledge', 'Leadership', 'Situational', 'Self-Assessment'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('PI Question payload:', form);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm({ question: '', category: '', tips: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Question">
                <textarea rows={2} style={inputStyle} placeholder="e.g. Tell me about yourself."
                    value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} required />
            </Field>
            <Field label="Category">
                <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select category…</option>
                    {PI_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </Field>
            <Field label="Answer Tips / Model Points">
                <textarea rows={4} style={inputStyle} placeholder="What points should a good answer include…"
                    value={form.tips} onChange={e => setForm(f => ({ ...f, tips: e.target.value }))} required />
            </Field>
            <SubmitBtn submitted={submitted} />
        </form>
    );
}

// ── Submit button ─────────────────────────────────────────────────────────────
function SubmitBtn({ submitted }: { submitted: boolean }) {
    return (
        <button type="submit"
            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: submitted ? 'linear-gradient(90deg,#059669,#047857)' : `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.25)' }}
        >
            {submitted ? (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Saved!</>
            ) : (
                <><UploadIcon /> Upload Question</>
            )}
        </button>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('OIR');
    const tc = TEST_COLORS[activeTab];

    const FORMS: Record<Tab, React.ReactNode> = {
        OIR: <OirForm />, PPDT: <PpdtForm />, TAT: <TatForm />,
        WAT: <WatForm />, SRT: <SrtForm />, LECTURETTE: <LecForm />, PI: <PiForm />,
    };

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
                            Upload questions for all SSB test modules — OIR, PPDT, TAT, WAT, SRT, Lecturette, PI
                        </p>
                    </div>
                    <Link href="/"
                        className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                        style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.20)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Site
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
                            style={{
                                background: activeTab === tab ? `${TEST_COLORS[tab]}18` : 'rgba(255,255,255,0.65)',
                                border: activeTab === tab ? `1.5px solid ${TEST_COLORS[tab]}50` : '1.5px solid rgba(18,77,150,0.12)',
                                boxShadow: activeTab === tab ? `0 4px 16px ${TEST_COLORS[tab]}25` : '0 2px 8px rgba(18,77,150,0.06)',
                                backdropFilter: 'blur(8px)',
                            }}>
                            <div className="flex justify-center mb-1.5" style={{ color: TEST_COLORS[tab] }}>{TAB_META[tab].icon}</div>
                            <p className="text-xs font-black" style={{ color: activeTab === tab ? TEST_COLORS[tab] : B.textMuted }}>{tab}</p>
                        </button>
                    ))}
                </div>

                {/* ── Two-column layout: tab sidebar + form ── */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-52 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {TABS.map(tab => {
                            const active = activeTab === tab;
                            const color = TEST_COLORS[tab];
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap lg:whitespace-normal text-left"
                                    style={{
                                        background: active ? `${color}14` : 'rgba(255,255,255,0.55)',
                                        border: active ? `1.5px solid ${color}40` : '1.5px solid rgba(18,77,150,0.10)',
                                        color: active ? color : B.textMuted,
                                        backdropFilter: 'blur(8px)',
                                    }}>
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                                    <div className="lg:block">
                                        <div>{TAB_META[tab].label}</div>
                                        <div className="text-xs font-normal opacity-70 hidden lg:block">{TAB_META[tab].db}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Form Panel */}
                    <div className="flex-1 rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.75)', border: `1.5px solid rgba(18,77,150,0.13)`, backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(18,77,150,0.08)' }}>
                        {/* Panel header */}
                        <div className="flex items-start justify-between mb-7 pb-5" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${tc}15`, color: tc, border: `1.5px solid ${tc}30` }}>
                                    {TAB_META[activeTab].icon}
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>{TAB_META[activeTab].label} — Add Question</h2>
                                    <p className="text-xs mt-0.5" style={{ color: B.textLight }}>DB collection: <code style={{ color: tc }}>{TAB_META[activeTab].db}</code> · {TAB_META[activeTab].desc}</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: `${tc}12`, color: tc, border: `1px solid ${tc}30` }}>
                                {activeTab}
                            </span>
                        </div>

                        {FORMS[activeTab]}
                    </div>
                </div>
            </div>
        </div>
    );
}
