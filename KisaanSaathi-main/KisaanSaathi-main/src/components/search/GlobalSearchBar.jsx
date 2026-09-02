import React, { useState } from 'react';
import { Search, Mic, MicOff, Volume2, Sparkles, ArrowRight, X, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAIAdvisor } from '../../hooks/useAIAdvisor';

export default function GlobalSearchBar({ onNavigateTopic }) {
 const { t, lang } = useLanguage();
 const { listening, startListening, stopListening, speak, stopSpeaking } = useSpeech();
 const { askAI, loading } = useAIAdvisor();

 const [query, setQuery] = useState('');
 const [result, setResult] = useState(null);

 const handleVoiceSearch = () => {
 if (listening) {
 stopListening();
 } else {
 startListening((voiceText) => {
 setQuery(voiceText);
 handleSearch(voiceText);
 });
 }
 };

 const handleSearch = async (textToSearch) => {
 const q = textToSearch !== undefined ? textToSearch : query;
 if (!q || !q.trim()) return;

 const res = await askAI(q);
 if (res) {
 setResult(res);
 speak(res.answer);
 }
 };

 const handleKeyDown = (e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 handleSearch();
 }
 };

 const clearResult = () => {
 setResult(null);
 stopSpeaking();
 };

 const popularQuestions = [
 { text: " Rain forecast this week?", query: "Will it rain this week?" },
 { text: " Fertilizer for tomato crop?", query: "What fertilizer for tomato?" },
 { text: " Mandi rate of tomato?", query: "What is tomato price in mandi?" },
 { text: " PM Fasal Bima subsidy?", query: "PM Fasal Bima Yojana subsidy" }
 ];

 return (
 <div style={{ marginBottom: 20 }}>
 {/* Search Omnibar Box */}
 <div
 style={{
 background: '#2B2118',
 borderRadius: 14,
 padding: '12px 14px',
 boxShadow: '0 4px 14px rgba(43,33,24,0.15)'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
 <Sparkles size={14} color="#D9A441" />
 <span style={{ color: '#D8CBA8', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
 Krishi AI Omnibar • Multilingual Voice & Knowledge Engine
 </span>
 </div>

 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <div style={{ position: 'relative', flex: 1 }}>
 <input
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 onKeyDown={handleKeyDown}
 placeholder={listening ? t('listening') : t('globalSearchPlaceholder')}
 style={{
 width: '100%',
 padding: '11px 12px',
 borderRadius: 10,
 border: '1px solid #4A3C2F',
 background: '#3A2E22',
 color: '#F2EAD8',
 fontSize: 14
 }}
 />
 {query && (
 <button
 onClick={() => setQuery('')}
 style={{
 position: 'absolute',
 right: 10,
 top: 11,
 background: 'none',
 border: 'none',
 color: '#A89B87'
 }}
 >
 <X size={16} />
 </button>
 )}
 </div>

 {/* Voice input button */}
 <button
 type="button"
 onClick={handleVoiceSearch}
 className={listening ? "mic-active" : ""}
 style={{
 width: 42,
 height: 42,
 borderRadius: '50%',
 background: listening ? '#B8492E' : '#D9A441',
 color: listening ? '#FFF' : '#2B2118',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 flexShrink: 0,
 boxShadow: listening ? '0 0 14px rgba(184,73,46,0.6)' : 'none'
 }}
 title={listening ? "Stop Listening" : "Speak your question in " + lang.label}
 >
 {listening ? <MicOff size={20} /> : <Mic size={20} />}
 </button>

 {/* Search trigger button */}
 <button
 type="button"
 onClick={() => handleSearch()}
 disabled={loading}
 style={{
 width: 42,
 height: 42,
 borderRadius: '50%',
 background: '#6B8F5C',
 color: '#FFF',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 flexShrink: 0
 }}
 title="Search"
 >
 <Search size={18} />
 </button>
 </div>

 {/* Popular query chips */}
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
 {popularQuestions.map((pq, idx) => (
 <button
 key={idx}
 onClick={() => {
 setQuery(pq.query);
 handleSearch(pq.query);
 }}
 style={{
 background: 'rgba(255,255,255,0.08)',
 color: '#D8CBA8',
 border: '1px solid rgba(216,203,168,0.2)',
 borderRadius: 14,
 padding: '3px 9px',
 fontSize: 11,
 fontWeight: 500
 }}
 >
 {pq.text}
 </button>
 ))}
 </div>
 </div>

 {/* Loading state */}
 {loading && (
 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: '12px 16px',
 marginTop: 10,
 display: 'flex',
 alignItems: 'center',
 gap: 10,
 color: '#6B5B45',
 fontSize: 13
 }}>
 <Sparkles size={16} color="#D9A441" />
 <span>Consulting Agronomical Knowledge Base & Multilingual AI...</span>
 </div>
 )}

 {/* Answer Drawer */}
 {result && (
 <div
 style={{
 background: '#FAF4E6',
 border: '2px solid #D9A441',
 borderRadius: 14,
 padding: '16px',
 marginTop: 12,
 boxShadow: '0 6px 20px rgba(43,33,24,0.08)',
 position: 'relative'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <Sparkles size={16} color="#D9A441" />
 <span style={{ fontSize: 13, fontWeight: 700, color: '#2B2118' }}>
 AI Recommendation ({lang.native})
 </span>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <button
 onClick={() => speak(result.answer)}
 style={{
 background: 'rgba(217,164,65,0.2)',
 border: '1px solid #D9A441',
 borderRadius: 6,
 padding: '4px 8px',
 color: '#2B2118',
 fontSize: 12,
 display: 'flex',
 alignItems: 'center',
 gap: 4
 }}
 title="Read Aloud"
 >
 <Volume2 size={14} color="#2B2118" />
 <span>Listen</span>
 </button>

 <button
 onClick={clearResult}
 style={{
 background: 'none',
 border: 'none',
 color: '#8A7B68',
 padding: 4
 }}
 title="Dismiss"
 >
 <X size={16} />
 </button>
 </div>
 </div>

 <p style={{ fontSize: 14, lineHeight: 1.6, color: '#2B2118' }}>
 {result.answer}
 </p>

 {/* Quick jump to matching module */}
 {result.actionTarget && onNavigateTopic && (
 <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #D8CBA8', display: 'flex', justifyContent: 'flex-end' }}>
 <button
 onClick={() => {
 onNavigateTopic(result.actionTarget);
 clearResult();
 }}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 borderRadius: 8,
 padding: '6px 12px',
 fontSize: 12,
 fontWeight: 600,
 display: 'inline-flex',
 alignItems: 'center',
 gap: 6
 }}
 >
 <Compass size={14} color="#D9A441" />
 <span>Open {result.actionTarget.toUpperCase()} Section</span>
 <ArrowRight size={13} />
 </button>
 </div>
 )}
 </div>
 )}
 </div>
 );
}
