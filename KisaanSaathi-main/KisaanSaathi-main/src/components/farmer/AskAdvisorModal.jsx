import React, { useState } from 'react';
import { Mic, MicOff, Search, Volume2, Sparkles, X, MessageSquare, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAIAdvisor } from '../../hooks/useAIAdvisor';

export default function AskAdvisorModal({ topic, onClose }) {
 const { lang, t } = useLanguage();
 const { listening, startListening, stopListening, speak } = useSpeech();
 const { askAI, loading } = useAIAdvisor();

 const [input, setInput] = useState('');
 const [messages, setMessages] = useState([
 {
 sender: 'ai',
 text: `Namaste! I am your Krishi Sahayak AI Advisor for ${topic || 'farming'}. How can I assist your crop today? You can type or press the microphone to speak in ${lang.native}.`
 }
 ]);

 const handleSend = async (textToSend) => {
 const q = textToSend || input;
 if (!q || !q.trim()) return;

 const userMsg = { sender: 'user', text: q };
 setMessages(prev => [...prev, userMsg]);
 setInput('');

 const res = await askAI(q, topic);
 if (res) {
 const aiMsg = { sender: 'ai', text: res.answer };
 setMessages(prev => [...prev, aiMsg]);
 speak(res.answer);
 }
 };

 const toggleMic = () => {
 if (listening) {
 stopListening();
 } else {
 startListening((txt) => {
 setInput(txt);
 handleSend(txt);
 });
 }
 };

 return (
 <div style={{
 position: 'fixed',
 inset: 0,
 background: 'rgba(43,33,24,0.75)',
 backdropFilter: 'blur(4px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: 9999,
 padding: 16
 }}>
 <div style={{
 background: '#FAF4E6',
 border: '2px solid #D8CBA8',
 borderRadius: 18,
 maxWidth: 480,
 width: '100%',
 height: '80vh',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
 overflow: 'hidden'
 }}>
 {/* Header */}
 <div style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '14px 16px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <Sparkles size={18} color="#D9A441" />
 <div>
 <div style={{ fontWeight: 700, fontSize: 14 }}>Krishi Sahayak AI Assistant</div>
 <div style={{ fontSize: 11, color: '#D8CBA8' }}>Voice in {lang.native} ({lang.label})</div>
 </div>
 </div>
 <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FAF4E6' }}>
 <X size={20} />
 </button>
 </div>

 {/* Messages Scroll Area */}
 <div style={{
 flex: 1,
 padding: '16px',
 overflowY: 'auto',
 display: 'flex',
 flexDirection: 'column',
 gap: 12
 }}>
 {messages.map((m, idx) => (
 <div
 key={idx}
 style={{
 alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
 maxWidth: '85%',
 background: m.sender === 'user' ? '#D9A441' : '#FFFDF9',
 color: '#2B2118',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: '10px 14px',
 fontSize: 13,
 lineHeight: 1.5,
 boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
 <div>{m.text}</div>
 {m.sender === 'ai' && (
 <button
 onClick={() => speak(m.text)}
 style={{ background: 'none', border: 'none', color: '#6B5B45', padding: 0 }}
 title="Play Audio"
 >
 <Volume2 size={15} color="#D9A441" />
 </button>
 )}
 </div>
 </div>
 ))}

 {loading && (
 <div style={{ alignSelf: 'flex-start', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#8A7B68' }}>
 Thinking & consulting agricultural datasets...
 </div>
 )}
 </div>

 {/* Input Bar */}
 <div style={{
 padding: '12px',
 background: '#2B2118',
 display: 'flex',
 alignItems: 'center',
 gap: 8
 }}>
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 placeholder={listening ? "Listening to your voice..." : "Type question or tap mic..."}
 style={{
 flex: 1,
 padding: '10px 12px',
 borderRadius: 8,
 border: 'none',
 background: '#3A2E22',
 color: '#FAF4E6',
 fontSize: 13
 }}
 />

 <button
 onClick={toggleMic}
 style={{
 width: 38,
 height: 38,
 borderRadius: '50%',
 background: listening ? '#B8492E' : '#D9A441',
 color: listening ? '#FFF' : '#2B2118',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 border: 'none'
 }}
 >
 {listening ? <MicOff size={18} /> : <Mic size={18} />}
 </button>

 <button
 onClick={() => handleSend()}
 style={{
 width: 38,
 height: 38,
 borderRadius: '50%',
 background: '#6B8F5C',
 color: '#FFF',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 border: 'none'
 }}
 >
 <Search size={18} />
 </button>
 </div>
 </div>
 </div>
 );
}
