import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp, Activity, Sprout, Droplets, Sun, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAIAdvisor } from '../../hooks/useAIAdvisor';
import NdviMapWidget from '../common/NdviMapWidget';
import { getFarmerNdviProfile, DEMO_VOICE_PROMPTS } from '../../data/ndviData';

export default function FarmerNdviVoiceView() {
 const { user } = useAuth();
 const { lang, t } = useLanguage();
 const { listening, speaking, transcript, startListening, stopListening, speak, stopSpeaking } = useSpeech();
 const { askAI, loading: aiLoading } = useAIAdvisor();

 // Get active farmer's NDVI satellite telemetry
 // Use farmer's own ndviProfile (from registration) first, fall back to static data for pre-seeded farmers
 const farmerId = user?.id || 1;
 const ndviProfile = user?.ndviProfile || getFarmerNdviProfile(farmerId);

 const [activeLayer, setActiveLayer] = useState('ndvi');
 const [showHistoryChart, setShowHistoryChart] = useState(true);
 const [voiceResponseText, setVoiceResponseText] = useState(null);
 const [voiceQueryEcho, setVoiceQueryEcho] = useState(null);
 const [isMuted, setIsMuted] = useState(false);

 // Suggested prompt chips based on selected language
 const suggestedPrompts = DEMO_VOICE_PROMPTS[lang.code] || DEMO_VOICE_PROMPTS['en-IN'];

 // Agronomist recommendations in active language
 const currentLangKey = lang.code === 'hi-IN' ? 'hi-IN' : lang.code === 'or-IN' ? 'or-IN' : 'en-IN';
 const nitrogenAdvice = ndviProfile.nitrogenStatus[currentLangKey] || ndviProfile.nitrogenStatus['en-IN'];
 const moistureAdvice = ndviProfile.moistureStatus[currentLangKey] || ndviProfile.moistureStatus['en-IN'];
 const actionPlanAdvice = ndviProfile.actionPlan[currentLangKey] || ndviProfile.actionPlan['en-IN'];

 // Prepare chart data
 const chartData = ndviProfile.historyDates.map((d, i) => ({
 date: d,
 ndvi: ndviProfile.ndviHistory[i],
 nir: ndviProfile.nirHistory[i],
 rgb: ndviProfile.rgbHistory[i]
 }));

 // Handle user speech query execution
 const processQuery = async (queryText) => {
 if (!queryText || !queryText.trim()) return;

 setVoiceQueryEcho(queryText);
 setVoiceResponseText(lang.code === 'hi-IN' ? 'सलाह तैयार की जा रही है...' : lang.code === 'or-IN' ? 'ପରାମର୍ଶ ପ୍ରସ୍ତୁତ ହେଉଛି...' : 'Analyzing farm telemetry...');

 const res = await askAI(queryText);
 if (res && res.answer) {
 setVoiceResponseText(res.answer);
 if (!isMuted) {
 speak(res.answer);
 }
 } else {
 const fallback = lang.code === 'hi-IN' 
 ? 'क्षमा करें, मैं आपके सवाल का जवाब नहीं ढूँढ पाया। कृपया दोबारा प्रयास करें।' 
 : lang.code === 'or-IN'
 ? 'ଦୁଃଖିତ, ଆପଣଙ୍କ ପ୍ରଶ୍ନର ଉତ୍ତର ମିଳିଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।'
 : 'Sorry, I could not generate an answer right now. Please try again.';
 setVoiceResponseText(fallback);
 if (!isMuted) speak(fallback);
 }
 };

 // Toggle Microphone
 const handleMicClick = () => {
 if (speaking) {
 stopSpeaking();
 return;
 }

 if (listening) {
 stopListening();
 return;
 }

 startListening((text) => {
 processQuery(text);
 });
 };

 return (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 24 }}>

 {/* 1. Top Section: Small NDVI Satellite Map Widget */}
 <div style={{ background: '#2B2118', borderRadius: 16, padding: '12px', boxShadow: '0 6px 20px rgba(43,33,24,0.18)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
 <div>
 <div style={{ fontSize: 10, fontWeight: 700, color: '#D9A441', letterSpacing: 0.8, textTransform: 'uppercase' }}>
 Live Satellite Field Telemetry
 </div>
 <div className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#FAF4E6', marginTop: 2 }}>
 {ndviProfile.name}'s Farm Plot ({ndviProfile.crop})
 </div>
 </div>

 <div style={{
 background: ndviProfile.ndviScore >= 0.7 ? 'rgba(16, 185, 129, 0.2)' : ndviProfile.ndviScore >= 0.4 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
 border: `1px solid ${ndviProfile.ndviScore >= 0.7 ? '#10b981' : ndviProfile.ndviScore >= 0.4 ? '#f59e0b' : '#ef4444'}`,
 color: ndviProfile.ndviScore >= 0.7 ? '#10b981' : ndviProfile.ndviScore >= 0.4 ? '#f59e0b' : '#ef4444',
 padding: '4px 10px',
 borderRadius: 20,
 fontSize: 11,
 fontWeight: 700
 }}>
 {ndviProfile.healthRating}
 </div>
 </div>

 {/* Satellite Map Widget */}
 <NdviMapWidget
 center={ndviProfile.center}
 polygonPoints={ndviProfile.polygon}
 acres={ndviProfile.acres}
 areaHa={ndviProfile.areaHa}
 ndviScore={ndviProfile.ndviScore}
 height={230}
 onTelemetryChange={(layer) => setActiveLayer(layer)}
 />

 {/* Telemetry Stats Grid */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
 <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#D8CBA8' }}>Plot Area</div>
 <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#FAF4E6', marginTop: 2 }}>
 {ndviProfile.areaHa} HA
 </div>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#D8CBA8' }}>Peak NDVI</div>
 <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
 {ndviProfile.ndviMax}
 </div>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#D8CBA8' }}>Mean Vigor</div>
 <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#D9A441', marginTop: 2 }}>
 {ndviProfile.ndviScore}
 </div>
 </div>
 </div>
 </div>

 {/* 2. Agronomist Recommendation Card */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderLeft: '5px solid #6B8F5C', borderRadius: 14, padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#6B8F5C', display: 'flex', alignItems: 'center', gap: 6 }}>
 <Sprout size={16} /> Agronomist Field Advisory
 </div>
 <button
 onClick={() => setShowHistoryChart(!showHistoryChart)}
 style={{ background: 'transparent', border: 'none', color: '#8A7B68', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
 >
 <span>{showHistoryChart ? 'Hide Trend' : 'View Trend'}</span>
 {showHistoryChart ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
 </button>
 </div>

 <div style={{ fontSize: 12, color: '#2B2118', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 6 }}>
 <div><strong> Nitrogen & Chlorophyll:</strong> {nitrogenAdvice}</div>
 <div><strong> Water & Moisture:</strong> {moistureAdvice}</div>
 <div style={{ background: 'rgba(107, 143, 92, 0.12)', padding: '8px 10px', borderRadius: 8, marginTop: 2 }}>
 <strong style={{ color: '#6B8F5C' }}> Farmers Action Plan:</strong> {actionPlanAdvice}
 </div>
 </div>

 {/* Expandable Historical Index Chart */}
 {showHistoryChart && (
 <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px stroke #D8CBA8' }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: '#6B5B45', marginBottom: 6 }}>
 Season Historical NDVI Trend (May – Aug)
 </div>
 <ResponsiveContainer width="100%" height={120}>
 <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#E6DCB8" />
 <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#6B5B45" />
 <YAxis domain={[0, 1]} tick={{ fontSize: 9 }} stroke="#6B5B45" />
 <Tooltip />
 <Line type="monotone" dataKey="ndvi" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 )}
 </div>

 {/* 3. Bottom Section: Multilingual Voice Assistant Engine */}
 <div style={{ background: '#FAF4E6', border: '1.5px solid #D9A441', borderRadius: 18, padding: '18px 16px', boxShadow: '0 4px 16px rgba(43,33,24,0.06)' }}>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <Sparkles size={18} color="#D9A441" />
 <h3 className="disp" style={{ fontSize: 15, fontWeight: 700, color: '#2B2118', margin: 0 }}>
 {lang.code === 'hi-IN' ? 'कृषि मित्र आवाज़ सहायक' : lang.code === 'or-IN' ? 'କୃଷି ବନ୍ଧୁ ଭଏସ୍ ସହାୟକ' : 'Kisan Voice AI Advisor'}
 </h3>
 </div>

 <button
 onClick={() => setIsMuted(!isMuted)}
 style={{
 background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 164, 65, 0.15)',
 border: 'none',
 borderRadius: 20,
 padding: '4px 10px',
 fontSize: 11,
 fontWeight: 600,
 color: isMuted ? '#ef4444' : '#2B2118',
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 cursor: 'pointer'
 }}
 >
 {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
 <span>{isMuted ? 'Muted' : 'Audio On'}</span>
 </button>
 </div>

 {/* Suggested Quick Prompt Chips */}
 <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
 {suggestedPrompts.map((p, idx) => (
 <button
 key={idx}
 onClick={() => processQuery(p.question)}
 style={{
 whiteSpace: 'nowrap',
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 20,
 padding: '6px 12px',
 fontSize: 11,
 fontWeight: 600,
 color: '#2B2118',
 cursor: 'pointer'
 }}
 >
 {p.question}
 </button>
 ))}
 </div>

 {/* User Query & Local-Language Answer Display Container */}
 {(voiceQueryEcho || voiceResponseText || aiLoading) && (
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
 {voiceQueryEcho && (
 <div style={{ fontSize: 12, color: '#8A7B68', fontStyle: 'italic', marginBottom: 6 }}>
 " {voiceQueryEcho} "
 </div>
 )}

 <div style={{ fontSize: 13.5, color: '#2B2118', fontWeight: 600, lineHeight: 1.45 }}>
 {aiLoading ? (
 <span style={{ color: '#D9A441' }}>
 {lang.code === 'hi-IN' ? 'विश्लेषण चल रहा है...' : lang.code === 'or-IN' ? 'ବିଶ୍ଳେଷଣ ଚାଲିଛି...' : 'Analyzing...'}
 </span>
 ) : (
 voiceResponseText
 )}
 </div>
 </div>
 )}

 {/* HUGE Voice Microphone Speak Button */}
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
 
 <button
 onClick={handleMicClick}
 style={{
 position: 'relative',
 width: 82,
 height: 82,
 borderRadius: '50%',
 background: listening
 ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
 : speaking
 ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
 : 'linear-gradient(135deg, #D9A441 0%, #2B2118 100%)',
 color: '#FFF',
 border: 'none',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 cursor: 'pointer',
 boxShadow: listening
 ? '0 0 0 12px rgba(239,68,68,0.25), 0 8px 24px rgba(239,68,68,0.4)'
 : speaking
 ? '0 0 0 12px rgba(16,185,129,0.25), 0 8px 24px rgba(16,185,129,0.4)'
 : '0 8px 24px rgba(43,33,24,0.3)',
 transition: 'all 0.3s ease'
 }}
 >
 {listening ? (
 <MicOff size={36} />
 ) : speaking ? (
 <Volume2 size={36} />
 ) : (
 <Mic size={36} />
 )}
 </button>

 <div style={{ marginTop: 10, textAlign: 'center' }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>
 {listening
 ? (lang.code === 'hi-IN' ? 'सुन रहा हूँ... बोलें' : lang.code === 'or-IN' ? 'ଶୁଣୁଛି... କୁହନ୍ତୁ' : 'Listening... Speak now')
 : speaking
 ? (lang.code === 'hi-IN' ? 'सलाहकार बोल रहा है...' : lang.code === 'or-IN' ? 'ପରାମର୍ଶଦାତା କହୁଛନ୍ତି...' : 'Speaking answer...')
 : (lang.code === 'hi-IN' ? 'बोलने के लिए बड़ा बटन दबाएं' : lang.code === 'or-IN' ? 'କହିବା ପାଇଁ ଦବାନ୍ତୁ' : 'Tap big button & speak in your language')}
 </div>
 <div style={{ fontSize: 11, color: '#8A7B68', marginTop: 2 }}>
 {lang.code === 'hi-IN' ? 'अपनी फसल, NDVI या मौसम के बारे में पूछें' : lang.code === 'or-IN' ? 'ନିଜ ଫସଲ କିମ୍ବା ପାଣିପାଗ ବିଷୟରେ ପଚାରନ୍ତୁ' : 'Ask any query in Hindi, Odia, or English'}
 </div>
 </div>

 </div>

 </div>

 </div>
 );
}
