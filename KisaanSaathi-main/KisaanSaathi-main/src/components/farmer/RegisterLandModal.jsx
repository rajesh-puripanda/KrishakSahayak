import React, { useState } from 'react';
import { X, Sprout, MapPin, Mic, FileText, CheckCircle2, Sparkles, AlertTriangle, Navigation, Eye, ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import NdviMapWidget, { createAcreageBox } from '../common/NdviMapWidget';

export default function RegisterLandModal({ onClose, onSuccess }) {
 const { registerLand, loginFarmer } = useAuth();
 const { lang } = useLanguage();

 const [step, setStep] = useState(1); // 1: Details & GPS, 2: Live NDVI Preview & Acreage Box, 3: Success Confirmation
 const [name, setName] = useState('');
 const [mobile, setMobile] = useState('');
 const [village, setVillage] = useState('');
 const [district, setDistrict] = useState('Khurda');
 const [crop, setCrop] = useState('Tomato');
 const [acres, setAcres] = useState('2.5');
 const [shapePreset, setShapePreset] = useState('rectangle'); // 'rectangle' | 'strip' | 'triangle' | 'lshape'
 
 // Location GPS coordinates & custom polygon
 const [centerLat, setCenterLat] = useState(20.1785);
 const [centerLng, setCenterLng] = useState(85.8920);
 const [customPolygon, setCustomPolygon] = useState(null);
 const [calculatedHa, setCalculatedHa] = useState('1.01');
 const [previewNdviScore, setPreviewNdviScore] = useState(0.81);
 const [gpsLoading, setGpsLoading] = useState(false);

 const [submittedLand, setSubmittedLand] = useState(null);
 const [error, setError] = useState('');

 const POPULAR_CROPS = ["Tomato", "Paddy", "Onion", "Wheat", "Maize", "Cotton", "Sugarcane", "Potato", "Chilli", "Mango", "Brinjal"];
 const SHAPE_PRESETS = [
 { id: 'rectangle', label: 'Rectangle (1.2:1)' },
 { id: 'strip', label: 'Narrow Strip' },
 { id: 'triangle', label: 'Triangular Corner' },
 { id: 'lshape', label: 'L-Shape Field' }
 ];

 // Detect Live GPS Location
 const handleDetectGPS = () => {
 if (!navigator.geolocation) {
 alert("Geolocation is not supported by your browser.");
 return;
 }

 setGpsLoading(true);
 setError('');

 navigator.geolocation.getCurrentPosition(
 (pos) => {
 const lat = parseFloat(pos.coords.latitude.toFixed(5));
 const lng = parseFloat(pos.coords.longitude.toFixed(5));
 setCenterLat(lat);
 setCenterLng(lng);

 const acreagePoly = createAcreageBox(lat, lng, acres, shapePreset);
 setCustomPolygon(acreagePoly);
 setVillage("Local Block (GPS Verified)");
 setDistrict("Khurda");
 setGpsLoading(false);
 },
 (err) => {
 console.warn("GPS error:", err);
 setGpsLoading(false);
 setCenterLat(20.1785);
 setCenterLng(85.8920);
 setVillage("Balipatna");
 const fallbackPoly = createAcreageBox(20.1785, 85.8920, acres, shapePreset);
 setCustomPolygon(fallbackPoly);
 },
 { timeout: 10000, enableHighAccuracy: true }
 );
 };

 // Step 1 -> Step 2: Generate Acreage Box & Live NDVI Heatmap Preview
 const handleProceedToPreview = (e) => {
 e.preventDefault();
 if (!name.trim()) {
 setError('Please enter farmer name.');
 return;
 }
 if (!mobile.trim() || mobile.trim().length !== 10) {
 setError('Please enter a valid 10-digit mobile number.');
 return;
 }
 if (!village.trim()) {
 setError('Please enter your village or block name.');
 return;
 }

 setError('');

 // Generate exact acreage box matching user's acres and shape preset
 const acreagePoly = createAcreageBox(centerLat, centerLng, acres, shapePreset);
 setCustomPolygon(acreagePoly);
 const ha = (parseFloat(acres) * 0.404686).toFixed(2);
 setCalculatedHa(ha);

 setStep(2);
 };

 // Step 2 -> Step 3: Final Confirmation & Save to Data Repository
 const handleConfirmRegistration = () => {
 const acresNum = parseFloat(acres) || 2.5;
 const haNum = calculatedHa ? parseFloat(calculatedHa) : parseFloat((acresNum * 0.404686).toFixed(2));

 const newFarmer = registerLand({
 name: name.trim(),
 mobile: mobile.trim(),
 village: village.trim(),
 district: district.trim() || "Khurda",
 crop: crop.trim() || "Tomato",
 acres: acresNum,
 areaHa: haNum,
 lat: centerLat,
 lng: centerLng,
 polygon: customPolygon || createAcreageBox(centerLat, centerLng, acresNum, shapePreset)
 });

 setSubmittedLand(newFarmer);
 setStep(3);
 if (onSuccess) onSuccess(newFarmer);
 };

 return (
 <div style={{
 position: 'fixed',
 top: 0, left: 0, right: 0, bottom: 0,
 zIndex: 2000,
 background: 'rgba(43,33,24,0.78)',
 backdropFilter: 'blur(8px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px'
 }}>
 <div style={{
 width: '100%',
 maxWidth: 520,
 maxHeight: '92vh',
 overflowY: 'auto',
 background: '#FAF4E6',
 border: '1.5px solid #D9A441',
 borderRadius: 18,
 padding: '20px',
 boxShadow: '0 12px 32px rgba(0,0,0,0.35)'
 }}>

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <div style={{ background: 'rgba(217, 164, 65, 0.2)', padding: 6, borderRadius: 8 }}>
 <Sprout size={20} color="#D9A441" />
 </div>
 <div>
 <h3 className="disp" style={{ fontSize: 17, fontWeight: 700, color: '#2B2118', margin: 0 }}>
 Register New Land Plot
 </h3>
 <div style={{ fontSize: 11, color: '#6B5B45' }}>
 Step {step} of 3 • {step === 1 ? 'Location & Acreage Details' : step === 2 ? 'Live Satellite Acreage Box & NDVI Preview' : 'Registration Complete'}
 </div>
 </div>
 </div>

 <button
 onClick={onClose}
 style={{ background: 'none', border: 'none', color: '#8A7B68', cursor: 'pointer', padding: 4 }}
 >
 <X size={20} />
 </button>
 </div>

 {error && (
 <div style={{ background: '#FDE8E8', color: '#B8492E', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
 {error}
 </div>
 )}

 {/* STEP 1: Details & GPS Entry */}
 {step === 1 && (
 <form onSubmit={handleProceedToPreview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 
 {/* GPS Location Button */}
 <div style={{ background: '#2B2118', color: '#FAF4E6', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div>
 <div style={{ fontSize: 11, color: '#D9A441', fontWeight: 700, textTransform: 'uppercase' }}>
 Live GPS Location Autofill
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Detect device GPS coordinates anywhere
 </div>
 </div>

 <button
 type="button"
 onClick={handleDetectGPS}
 disabled={gpsLoading}
 style={{
 background: '#D9A441',
 color: '#2B2118',
 border: 'none',
 borderRadius: 8,
 padding: '8px 12px',
 fontSize: 12,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 6,
 cursor: 'pointer'
 }}
 >
 <Navigation size={14} />
 <span>{gpsLoading ? 'Detecting...' : ' Use Live GPS'}</span>
 </button>
 </div>

 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Farmer Full Name *
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="e.g. Ramesh Nayak"
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13 }}
 />
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Mobile Number *
 </label>
 <input
 type="tel"
 value={mobile}
 onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
 placeholder="10 digits"
 className="mono"
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13 }}
 />
 </div>

 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Village / Block Name *
 </label>
 <input
 type="text"
 value={village}
 onChange={(e) => setVillage(e.target.value)}
 placeholder="e.g. Balipatna / Puri Road"
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13 }}
 />
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 District / Region
 </label>
 <input
 type="text"
 value={district}
 onChange={(e) => setDistrict(e.target.value)}
 placeholder="e.g. Khurda / Cuttack / Puri"
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13 }}
 />
 </div>

 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Plot Size (Acres) *
 </label>
 <input
 type="number"
 step="0.5"
 value={acres}
 onChange={(e) => setAcres(e.target.value)}
 placeholder="e.g. 2.5"
 className="mono"
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13, fontWeight: 700 }}
 />
 </div>
 </div>

 {/* Field Contour Shape Selector */}
 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Initial Field Contour Shape
 </label>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
 {SHAPE_PRESETS.map((s) => (
 <button
 key={s.id}
 type="button"
 onClick={() => setShapePreset(s.id)}
 style={{
 background: shapePreset === s.id ? '#2B2118' : '#FFFDF9',
 color: shapePreset === s.id ? '#D9A441' : '#6B5B45',
 border: shapePreset === s.id ? '1.5px solid #D9A441' : '1px solid #D8CBA8',
 borderRadius: 8,
 padding: '7px 10px',
 fontSize: 11,
 fontWeight: 700,
 textAlign: 'left',
 cursor: 'pointer'
 }}
 >
 {s.label}
 </button>
 ))}
 </div>
 </div>

 {/* Crop Selection */}
 <div>
 <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2B2118', marginBottom: 4 }}>
 Primary Crop Cultivated
 </label>
 <input
 type="text"
 value={crop}
 onChange={(e) => setCrop(e.target.value)}
 placeholder="Enter crop name..."
 style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D8CBA8', background: '#FFFDF9', fontSize: 13, marginBottom: 6 }}
 />
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
 {POPULAR_CROPS.map((c) => (
 <button
 key={c}
 type="button"
 onClick={() => setCrop(c)}
 style={{
 background: crop === c ? '#2B2118' : '#FFFDF9',
 color: crop === c ? '#D9A441' : '#6B5B45',
 border: '1px solid #D8CBA8',
 borderRadius: 14,
 padding: '3px 8px',
 fontSize: 11,
 fontWeight: 600,
 cursor: 'pointer'
 }}
 >
 {c}
 </button>
 ))}
 </div>
 </div>

 <button
 type="submit"
 style={{
 marginTop: 10,
 background: '#D9A441',
 color: '#2B2118',
 border: 'none',
 borderRadius: 10,
 padding: '13px',
 fontSize: 14,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 cursor: 'pointer',
 boxShadow: '0 4px 12px rgba(217,164,65,0.3)'
 }}
 >
 <span>Preview {acres} Acre Satellite Box & NDVI Heatmap</span>
 <ArrowRight size={18} />
 </button>
 </form>
 )}

 {/* STEP 2: Smooth Acreage Box & Live Satellite NDVI Preview */}
 {step === 2 && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 <div style={{ background: '#2B2118', color: '#FAF4E6', borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ fontSize: 10, color: '#D9A441', fontWeight: 700, textTransform: 'uppercase' }}>
 Satellite Acreage Box ({acres} Acres • {shapePreset.toUpperCase()})
 </div>
 <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
 {name}'s {crop} Plot ({village}, {district})
 </div>
 </div>
 <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
 NDVI: {previewNdviScore} (Optimal Vigor)
 </div>
 </div>

 <p style={{ fontSize: 11, color: '#6B5B45', margin: 0 }}>
 Calculated a <strong>{acres} Acre box ({calculatedHa} HA)</strong> on satellite imagery. Drag cyan pins to reshape field contour.
 </p>

 {/* Satellite Map Widget with Automatic Acreage Box */}
 <NdviMapWidget
 center={[centerLat, centerLng]}
 polygonPoints={customPolygon}
 acres={acres}
 areaHa={calculatedHa}
 ndviScore={previewNdviScore}
 height={260}
 allowDraw={true}
 shapePreset={shapePreset}
 onPolygonChange={(newPts, newHa, newCenter) => {
 setCustomPolygon(newPts);
 setCalculatedHa(newHa);
 if (newCenter) {
 setCenterLat(newCenter[0]);
 setCenterLng(newCenter[1]);
 }
 }}
 />

 {/* Telemetry Summary */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#6B5B45' }}>Plot Area</div>
 <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#2B2118', marginTop: 2 }}>
 {acres} Acres ({calculatedHa} HA)
 </div>
 </div>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#6B5B45' }}>Vegetation Index</div>
 <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
 {previewNdviScore}
 </div>
 </div>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: 10, color: '#6B5B45' }}>Canopy Vigor</div>
 <div style={{ fontSize: 11, fontWeight: 700, color: '#6B8F5C', marginTop: 2 }}>
 Optimal Vigor
 </div>
 </div>
 </div>

 {/* Confirmation Buttons */}
 <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
 <button
 type="button"
 onClick={() => setStep(1)}
 style={{
 flex: 1,
 background: '#FFFDF9',
 color: '#2B2118',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '12px',
 fontSize: 13,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 cursor: 'pointer'
 }}
 >
 <ArrowLeft size={16} />
 <span>Edit Acres / Info</span>
 </button>

 <button
 type="button"
 onClick={handleConfirmRegistration}
 style={{
 flex: 2,
 background: '#10b981',
 color: '#FFF',
 border: 'none',
 borderRadius: 10,
 padding: '12px',
 fontSize: 14,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 cursor: 'pointer',
 boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
 }}
 >
 <CheckCircle2 size={18} />
 <span>Confirm & Register Land Plot</span>
 </button>
 </div>

 </div>
 )}

 {/* STEP 3: Success Confirmation Screen */}
 {step === 3 && submittedLand && (
 <div style={{ textAlign: 'center', padding: '16px 8px' }}>
 <div style={{ display: 'inline-flex', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: 16, borderRadius: '50%', marginBottom: 12 }}>
 <CheckCircle2 size={42} />
 </div>

 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118', margin: '0 0 6px' }}>
 Land Plot Successfully Registered!
 </h3>

 <div style={{ background: '#2B2118', color: '#FAF4E6', borderRadius: 14, padding: '14px', margin: '14px 0', textAlign: 'left' }}>
 <div style={{ fontSize: 10, color: '#D9A441', fontWeight: 800, textTransform: 'uppercase' }}>
 Unique Land Identification
 </div>
 <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: '#10b981', marginTop: 2 }}>
 {submittedLand.landId}
 </div>
 <div style={{ fontSize: 12.5, color: '#D8CBA8', marginTop: 8 }}>
 Farmer: <strong>{submittedLand.name}</strong> • Crop: <strong>{submittedLand.crop}</strong> ({submittedLand.acres} Acres)
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Location: {submittedLand.village}, {submittedLand.district}
 </div>
 <div style={{ fontSize: 11, color: '#6B8F5C', marginTop: 6, paddingTop: 6, borderTop: '1px stroke rgba(255,255,255,0.1)' }}>
 Live Satellite NDVI Vigor: <strong>{submittedLand.ndviScore}</strong> ({submittedLand.ndviRating})
 </div>
 </div>

 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 16 }}>
 Alert & map marker dispatched to Khurda District Agriculture Officer Dashboard.
 </p>

 <button
 onClick={() => {
 loginFarmer(submittedLand);
 onClose();
 }}
 style={{
 width: '100%',
 background: '#D9A441',
 color: '#2B2118',
 border: 'none',
 borderRadius: 10,
 padding: '13px',
 fontSize: 14,
 fontWeight: 700,
 cursor: 'pointer'
 }}
 >
 Open Farmer Portal Dashboard
 </button>
 </div>
 )}

 </div>
 </div>
 );
}
