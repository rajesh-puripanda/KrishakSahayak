import React, { useState } from 'react';
import {
 Sprout, RotateCcw, Volume2, Sparkles, CheckCircle2, ChevronRight,
 Search, X, PlusCircle, Check, Info, ArrowLeft, Layers, Calendar,
 ShieldCheck, Droplets, Sun, CloudRain
} from 'lucide-react';
import { SEASONS, CROPS, PREVIOUS_CROPS, SOIL_TYPES, calculateFertilizerPlan } from '../../data/fertilizerData';
import TopBar from '../common/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAuth } from '../../context/AuthContext';

export default function FertilizerAdvisor({ onBack }) {
 const { t, lang } = useLanguage();
 const { user } = useAuth();
 const { speak } = useSpeech();

 const [step, setStep] = useState(1);
 const [season, setSeason] = useState(SEASONS[0].id);

 // Question 2: Crop selection / search state
 const [cropSearchQuery, setCropSearchQuery] = useState('');
 const [selectedCrop, setSelectedCrop] = useState(CROPS[0]); // Object or { id, name, label, etc. }

 // Question 3: Previous crop selection / search state
 const [prevCropSearchQuery, setPrevCropSearchQuery] = useState('');
 const [selectedPrevCrop, setSelectedPrevCrop] = useState(PREVIOUS_CROPS[0]); // Object

 // Question 4: Soil & Area
 const [soil, setSoil] = useState(SOIL_TYPES[0].id);
 const [acres, setAcres] = useState(user?.acres || 2.0);

 const [result, setResult] = useState(null);

 // Filter crops based on search query in Question 2
 const filteredCrops = CROPS.filter(c =>
 c.name.toLowerCase().includes(cropSearchQuery.toLowerCase()) ||
 c.label.toLowerCase().includes(cropSearchQuery.toLowerCase()) ||
 c.category.toLowerCase().includes(cropSearchQuery.toLowerCase())
 );

 // Filter previous crops based on search query in Question 3
 const filteredPrevCrops = PREVIOUS_CROPS.filter(p =>
 p.name.toLowerCase().includes(prevCropSearchQuery.toLowerCase()) ||
 p.label.toLowerCase().includes(prevCropSearchQuery.toLowerCase()) ||
 p.note.toLowerCase().includes(prevCropSearchQuery.toLowerCase())
 );

 // Custom crop handler when farmer enters an unlisted crop name in Question 2
 const handleSelectCustomCrop = (customText) => {
 const trimmed = customText.trim();
 if (!trimmed) return;
 const customObj = {
 id: "custom-" + trimmed.toLowerCase().replace(/\s+/g, '-'),
 name: trimmed,
 label: `${trimmed} (Custom Farm Crop)`,
 category: "Custom Entered Crop",
 baseNPK: [110, 50, 60],
 daysToHarvest: 90,
 image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
 };
 setSelectedCrop(customObj);
 setCropSearchQuery('');
 };

 // Custom previous crop handler in Question 3
 const handleSelectCustomPrevCrop = (customText) => {
 const trimmed = customText.trim();
 if (!trimmed) return;
 const customPrevObj = {
 id: "custom-prev-" + trimmed.toLowerCase().replace(/\s+/g, '-'),
 name: trimmed,
 label: trimmed,
 nCredit: 0,
 pCredit: 0,
 note: `Custom previous rotation of ${trimmed} accounted for in basal planning.`
 };
 setSelectedPrevCrop(customPrevObj);
 setPrevCropSearchQuery('');
 };

 const handleCalculate = () => {
 const plan = calculateFertilizerPlan(season, selectedCrop, selectedPrevCrop, soil, acres);
 setResult(plan);

 const speechSummary = `Prescription for ${plan.cropRawName || plan.cropName} on ${acres} acres: Apply ${plan.totalCommercial.dapKg} kg DAP, ${plan.totalCommercial.ureaKg} kg Neem Urea in splits, and ${plan.totalCommercial.mopKg} kg Potash.`;
 speak(speechSummary);
 };

 const handleReset = () => {
 setResult(null);
 setStep(1);
 setCropSearchQuery('');
 setPrevCropSearchQuery('');
 };

 return (
 <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' }}>
 <TopBar title={t('topicFertilizer')} onBack={onBack} />

 {!result ? (
 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 18,
 padding: '20px 18px',
 boxShadow: '0 4px 18px rgba(43,33,24,0.06)'
 }}>
 {/* Wizard Step Progress Header */}
 <div style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 18,
 borderBottom: '1px solid #D8CBA8',
 paddingBottom: 12
 }}>
 <div>
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase', letterSpacing: 0.8 }}>
 Precision Agronomy Engine
 </div>
 <h2 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118', marginTop: 2 }}>
 {t('fertWizardTitle')}
 </h2>
 </div>
 <div className="mono" style={{
 background: '#2B2118',
 color: '#D9A441',
 fontWeight: 700,
 padding: '4px 10px',
 borderRadius: 20,
 fontSize: 12
 }}>
 Step {step} of 4
 </div>
 </div>

 {/* STEP 1: SEASON (QUESTION 1) */}
 {step === 1 && (
 <div>
 <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#2B2118', marginBottom: 4 }}>
 {t('step1Season')}
 </label>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 14 }}>
 Select the planting climate and seasonal irrigation window:
 </p>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 {SEASONS.map((s) => (
 <button
 key={s.id}
 onClick={() => setSeason(s.id)}
 style={{
 background: season === s.id ? '#D9A441' : '#FFFDF9',
 border: `1.5px solid ${season === s.id ? '#B88422' : '#D8CBA8'}`,
 borderRadius: 12,
 padding: '14px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 transition: 'all 0.15s'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <span style={{ fontSize: 22 }}>{s.icon}</span>
 <div>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>{s.label}</div>
 <div style={{ fontSize: 12, color: season === s.id ? '#3A2E22' : '#6B5B45', marginTop: 2 }}>{s.desc}</div>
 </div>
 </div>
 {season === s.id && <CheckCircle2 size={20} color="#2B2118" />}
 </button>
 ))}
 </div>

 <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end' }}>
 <button
 onClick={() => setStep(2)}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px 20px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 gap: 6
 }}
 >
 <span>Next: Select / Type Crop</span>
 <ChevronRight size={16} color="#D9A441" />
 </button>
 </div>
 </div>
 )}

 {/* STEP 2: CROP TO PLANT (QUESTION 2 - SEARCH & FREE-FORM ENTER BAR) */}
 {step === 2 && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
 <label style={{ fontSize: 14, fontWeight: 700, color: '#2B2118' }}>
 {t('step2Crop')} (Question 2)
 </label>
 <span style={{ fontSize: 11, background: '#EAF3E7', color: '#2D5A27', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
 Open Search / Free Entry
 </span>
 </div>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 12 }}>
 Search or enter <strong>any crop name</strong> without restrictions:
 </p>

 {/* SEARCH & ENTER BAR */}
 <div style={{ position: 'relative', marginBottom: 14 }}>
 <Search size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
 <input
 type="text"
 value={cropSearchQuery}
 onChange={(e) => setCropSearchQuery(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && cropSearchQuery.trim()) {
 e.preventDefault();
 handleSelectCustomCrop(cropSearchQuery);
 }
 }}
 placeholder="Type crop name (e.g. Sugarcane, Mustard, Potato, Cotton, Chilli)..."
 style={{
 width: '100%',
 padding: '11px 40px 11px 38px',
 borderRadius: 10,
 border: '2px solid #D9A441',
 background: '#FFFDF9',
 fontSize: 13.5,
 color: '#2B2118',
 boxShadow: '0 2px 8px rgba(217,164,65,0.15)'
 }}
 />
 {cropSearchQuery && (
 <button
 onClick={() => setCropSearchQuery('')}
 style={{
 position: 'absolute',
 right: 10,
 top: 11,
 background: 'none',
 border: 'none',
 color: '#8A7B68'
 }}
 >
 <X size={18} />
 </button>
 )}
 </div>

 {/* Custom Crop Quick-Add Button (if typed something not in instant match) */}
 {cropSearchQuery.trim().length > 0 && (
 <button
 onClick={() => handleSelectCustomCrop(cropSearchQuery)}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '10px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 600,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 12
 }}
 >
 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <PlusCircle size={16} color="#D9A441" />
 <span>Use Custom Crop: <strong>"{cropSearchQuery.trim()}"</strong></span>
 </span>
 <span style={{ fontSize: 11, color: '#D9A441' }}>Auto Calculate NPK</span>
 </button>
 )}

 {/* Currently Selected Crop Banner */}
 {selectedCrop && (
 <div style={{
 background: '#FFF8EA',
 border: '1.5px solid #D9A441',
 borderRadius: 12,
 padding: '10px 12px',
 marginBottom: 14,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <img
 src={selectedCrop.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"}
 alt={selectedCrop.name}
 style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
 />
 <div>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>
 {selectedCrop.label || selectedCrop.name}
 </div>
 <div style={{ fontSize: 11, color: '#6B5B45' }}>
 {selectedCrop.category} • ~{selectedCrop.daysToHarvest || 90} Days duration
 </div>
 </div>
 </div>
 <span style={{ background: '#6B8F5C', color: '#FFF', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
 Active Choice 
 </span>
 </div>
 )}

 {/* Crop Search Results & Popular Crops Grid */}
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase', marginBottom: 8 }}>
 {cropSearchQuery ? `Search Results (${filteredCrops.length})` : "Popular Crops Library (Tap to Pick):"}
 </div>

 <div style={{
 display: 'grid',
 gridTemplateColumns: '1fr 1fr',
 gap: 8,
 maxHeight: 250,
 overflowY: 'auto',
 paddingRight: 4
 }}>
 {filteredCrops.map((c) => {
 const isCur = selectedCrop?.id === c.id;
 return (
 <button
 key={c.id}
 onClick={() => {
 setSelectedCrop(c);
 setCropSearchQuery('');
 }}
 style={{
 background: isCur ? '#D9A441' : '#FFFDF9',
 border: `1.5px solid ${isCur ? '#B88422' : '#D8CBA8'}`,
 borderRadius: 10,
 padding: '8px 10px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 gap: 8,
 transition: 'all 0.15s'
 }}
 >
 <img
 src={c.image}
 alt={c.name}
 style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
 />
 <div style={{ overflow: 'hidden' }}>
 <div style={{ fontWeight: 700, fontSize: 12.5, color: '#2B2118', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
 {c.name}
 </div>
 <div style={{ fontSize: 10, color: isCur ? '#3A2E22' : '#8A7B68' }}>
 {c.category}
 </div>
 </div>
 </button>
 );
 })}
 </div>

 <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
 <button
 onClick={() => setStep(1)}
 style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
 >
 Back
 </button>
 <button
 onClick={() => setStep(3)}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px 20px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 gap: 6
 }}
 >
 <span>Next: Previous Crop</span>
 <ChevronRight size={16} color="#D9A441" />
 </button>
 </div>
 </div>
 )}

 {/* STEP 3: PREVIOUS CROP IN SOIL (QUESTION 3 - SEARCH & ENTER BAR) */}
 {step === 3 && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
 <label style={{ fontSize: 14, fontWeight: 700, color: '#2B2118' }}>
 {t('step3PrevCrop')} (Question 3)
 </label>
 <span style={{ fontSize: 11, background: '#EAF3E7', color: '#2D5A27', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
 Open Search / Free Entry
 </span>
 </div>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 12 }}>
 Search or type the previous crop grown to calculate biological nitrogen credits:
 </p>

 {/* SEARCH & ENTER BAR FOR QUESTION 3 */}
 <div style={{ position: 'relative', marginBottom: 14 }}>
 <Search size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
 <input
 type="text"
 value={prevCropSearchQuery}
 onChange={(e) => setPrevCropSearchQuery(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && prevCropSearchQuery.trim()) {
 e.preventDefault();
 handleSelectCustomPrevCrop(prevCropSearchQuery);
 }
 }}
 placeholder="Type previous crop (e.g. Moong/Pulses, Paddy, Fallow, Vegetables)..."
 style={{
 width: '100%',
 padding: '11px 40px 11px 38px',
 borderRadius: 10,
 border: '2px solid #D9A441',
 background: '#FFFDF9',
 fontSize: 13.5,
 color: '#2B2118',
 boxShadow: '0 2px 8px rgba(217,164,65,0.15)'
 }}
 />
 {prevCropSearchQuery && (
 <button
 onClick={() => setPrevCropSearchQuery('')}
 style={{
 position: 'absolute',
 right: 10,
 top: 11,
 background: 'none',
 border: 'none',
 color: '#8A7B68'
 }}
 >
 <X size={18} />
 </button>
 )}
 </div>

 {/* Custom previous crop button */}
 {prevCropSearchQuery.trim().length > 0 && (
 <button
 onClick={() => handleSelectCustomPrevCrop(prevCropSearchQuery)}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '10px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 600,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 12
 }}
 >
 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <PlusCircle size={16} color="#D9A441" />
 <span>Set Previous Crop: <strong>"{prevCropSearchQuery.trim()}"</strong></span>
 </span>
 <span style={{ fontSize: 11, color: '#D9A441' }}>Select</span>
 </button>
 )}

 {/* Selected Previous Crop Card */}
 {selectedPrevCrop && (
 <div style={{
 background: '#FFF8EA',
 border: '1.5px solid #D9A441',
 borderRadius: 12,
 padding: '10px 12px',
 marginBottom: 14
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>
 {selectedPrevCrop.label || selectedPrevCrop.name}
 </div>
 <span style={{ background: '#6B8F5C', color: '#FFF', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
 Selected 
 </span>
 </div>
 <div style={{ fontSize: 11.5, color: '#6B5B45', marginTop: 3 }}>
 {selectedPrevCrop.note}
 </div>
 </div>
 )}

 {/* Previous Crops List */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
 {filteredPrevCrops.map((p) => {
 const isCur = selectedPrevCrop?.id === p.id;
 return (
 <button
 key={p.id}
 onClick={() => {
 setSelectedPrevCrop(p);
 setPrevCropSearchQuery('');
 }}
 style={{
 background: isCur ? '#D9A441' : '#FFFDF9',
 border: `1.5px solid ${isCur ? '#B88422' : '#D8CBA8'}`,
 borderRadius: 10,
 padding: '10px 12px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}
 >
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{p.label || p.name}</div>
 <div style={{ fontSize: 11, color: isCur ? '#3A2E22' : '#6B5B45', marginTop: 2 }}>{p.note}</div>
 </div>
 {isCur && <Check size={18} color="#2B2118" style={{ flexShrink: 0 }} />}
 </button>
 );
 })}
 </div>

 <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
 <button
 onClick={() => setStep(2)}
 style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
 >
 Back
 </button>
 <button
 onClick={() => setStep(4)}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px 20px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 gap: 6
 }}
 >
 <span>Next: Soil & Acreage</span>
 <ChevronRight size={16} color="#D9A441" />
 </button>
 </div>
 </div>
 )}

 {/* STEP 4: SOIL & FARM AREA (QUESTION 4) */}
 {step === 4 && (
 <div>
 <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#2B2118', marginBottom: 4 }}>
 {t('step4Soil')}
 </label>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 14 }}>
 Soil texture determines fertilizer leaching resistance and split broadcasting schedule:
 </p>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
 {SOIL_TYPES.map((s) => (
 <button
 key={s.id}
 onClick={() => setSoil(s.id)}
 style={{
 background: soil === s.id ? '#D9A441' : '#FFFDF9',
 border: `1.5px solid ${soil === s.id ? '#B88422' : '#D8CBA8'}`,
 borderRadius: 12,
 padding: '12px 14px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}
 >
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{s.label}</div>
 <div style={{ fontSize: 11, color: soil === s.id ? '#3A2E22' : '#6B5B45', marginTop: 2 }}>
 Retention: {s.retention} • {s.splitCount} Split Dosages
 </div>
 </div>
 {soil === s.id && <CheckCircle2 size={18} color="#2B2118" />}
 </button>
 ))}
 </div>

 {/* Cultivated Farm Area Slider */}
 <div style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: '14px',
 marginBottom: 18
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
 <span style={{ fontSize: 13, fontWeight: 700, color: '#2B2118' }}>Cultivated Farm Area:</span>
 <span className="mono" style={{ fontWeight: 800, color: '#2B2118', fontSize: 16 }}>
 {acres} Acres
 </span>
 </div>
 <input
 type="range"
 min="0.5"
 max="10"
 step="0.5"
 value={acres}
 onChange={(e) => setAcres(parseFloat(e.target.value))}
 style={{ width: '100%', accentColor: '#D9A441' }}
 />
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8A7B68', marginTop: 4 }}>
 <span>0.5 Acre (Smallholder)</span>
 <span>5 Acres</span>
 <span>10 Acres</span>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <button
 onClick={() => setStep(3)}
 style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
 >
 Back
 </button>
 <button
 onClick={handleCalculate}
 style={{
 background: '#6B8F5C',
 color: '#FFF',
 padding: '12px 22px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 gap: 8,
 boxShadow: '0 4px 14px rgba(107,143,92,0.35)'
 }}
 >
 <Sparkles size={16} />
 <span>{t('calculateFert')}</span>
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 /* RESULTS VIEW */
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 {/* Header Card with Relatable Crop Picture */}
 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 18,
 overflow: 'hidden',
 boxShadow: '0 4px 16px rgba(43,33,24,0.06)'
 }}>
 {/* Banner Image */}
 <div style={{ position: 'relative', height: 110, width: '100%' }}>
 <img
 src={result.cropImage || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"}
 alt={result.cropName}
 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
 />
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'linear-gradient(to bottom, rgba(43,33,24,0.2) 0%, rgba(43,33,24,0.85) 100%)'
 }} />
 <div style={{ position: 'absolute', bottom: 10, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
 <div>
 <span style={{ background: '#D9A441', color: '#2B2118', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
 Personalized Prescription
 </span>
 <h3 className="disp" style={{ fontSize: 19, fontWeight: 700, color: '#FAF4E6', marginTop: 2 }}>
 {result.cropRawName || result.cropName} ({acres} Acres)
 </h3>
 </div>

 <button
 onClick={() => speak(`Prescription for ${result.cropRawName || result.cropName} on ${acres} acres: Apply ${result.totalCommercial.dapKg} kg DAP, ${result.totalCommercial.ureaKg} kg Neem Urea in splits, and ${result.totalCommercial.mopKg} kg Potash.`)}
 style={{
 background: '#FAF4E6',
 color: '#2B2118',
 border: 'none',
 borderRadius: 8,
 padding: '6px 10px',
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 fontSize: 12,
 fontWeight: 700
 }}
 >
 <Volume2 size={15} color="#D9A441" />
 <span>Listen</span>
 </button>
 </div>
 </div>

 <div style={{ padding: '14px 16px' }}>
 <div style={{ fontSize: 12, color: '#6B5B45', display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
 <span>Soil: <strong>{result.soilType}</strong></span>
 <span>Rotation: <strong>{result.prevCropName}</strong></span>
 </div>

 {/* Total Commercial Bags Grid */}
 <div style={{
 display: 'grid',
 gridTemplateColumns: '1fr 1fr 1fr',
 gap: 8,
 paddingTop: 10,
 borderTop: '1px solid #D8CBA8'
 }}>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', padding: '10px 6px', borderRadius: 10, textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>DAP (18-46-0)</div>
 <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: '#2B2118', marginTop: 2 }}>
 {result.totalCommercial.dapKg} kg
 </div>
 <div style={{ fontSize: 9.5, color: '#6B8F5C' }}>Full Basal</div>
 </div>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', padding: '10px 6px', borderRadius: 10, textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>Neem Urea (46%)</div>
 <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: '#2B2118', marginTop: 2 }}>
 {result.totalCommercial.ureaKg} kg
 </div>
 <div style={{ fontSize: 9.5, color: '#D9A441' }}>In Split Doses</div>
 </div>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', padding: '10px 6px', borderRadius: 10, textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>MOP Potash (60%)</div>
 <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: '#2B2118', marginTop: 2 }}>
 {result.totalCommercial.mopKg} kg
 </div>
 <div style={{ fontSize: 9.5, color: '#B8492E' }}>Root & Grain Firm</div>
 </div>
 </div>
 </div>
 </div>

 {/* 3-Stage Application Schedule */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px' }}>
 <h4 className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2B2118' }}>
 Timed Application Schedule
 </h4>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {/* Basal */}
 <div style={{ background: '#FFFDF9', borderLeft: '4px solid #6B8F5C', borderRadius: 8, padding: '10px 12px' }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#6B8F5C' }}>
 1. {result.schedule.basal.stage}
 </div>
 <ul style={{ fontSize: 12, color: '#2B2118', marginTop: 4, paddingLeft: 16, lineHeight: 1.5 }}>
 {result.schedule.basal.items.map((item, idx) => (
 <li key={idx}>{item}</li>
 ))}
 </ul>
 </div>

 {/* 1st Top Dressing */}
 <div style={{ background: '#FFFDF9', borderLeft: '4px solid #D9A441', borderRadius: 8, padding: '10px 12px' }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#D9A441' }}>
 2. {result.schedule.topDressing1.stage}
 </div>
 <ul style={{ fontSize: 12, color: '#2B2118', marginTop: 4, paddingLeft: 16, lineHeight: 1.5 }}>
 {result.schedule.topDressing1.items.map((item, idx) => (
 <li key={idx}>{item}</li>
 ))}
 </ul>
 </div>

 {/* 2nd Top Dressing */}
 <div style={{ background: '#FFFDF9', borderLeft: '4px solid #C97D34', borderRadius: 8, padding: '10px 12px' }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#C97D34' }}>
 3. {result.schedule.topDressing2.stage}
 </div>
 <ul style={{ fontSize: 12, color: '#2B2118', marginTop: 4, paddingLeft: 16, lineHeight: 1.5 }}>
 {result.schedule.topDressing2.items.map((item, idx) => (
 <li key={idx}>{item}</li>
 ))}
 </ul>
 </div>
 </div>
 </div>

 {/* Bio-fertilizer & Soil Health */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px' }}>
 <h4 className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#2B2118' }}>
 Organic & Bio-Stimulants
 </h4>
 <ul style={{ fontSize: 12, color: '#6B5B45', paddingLeft: 16, lineHeight: 1.5 }}>
 {result.biofertilizers.map((bio, idx) => (
 <li key={idx}>{bio}</li>
 ))}
 </ul>
 </div>

 <button
 onClick={handleReset}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 color: '#2B2118',
 padding: '12px',
 borderRadius: 10,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8
 }}
 >
 <RotateCcw size={16} />
 <span>Calculate Another Crop / Field</span>
 </button>
 </div>
 )}
 </div>
 );
}

