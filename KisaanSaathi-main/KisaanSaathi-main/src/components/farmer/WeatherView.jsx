import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Cloud, AlertTriangle, ShieldCheck, Calendar, RefreshCw, MapPin, Thermometer } from 'lucide-react';
import { fetchLiveWeather } from '../../services/apiService';
import TopBar from '../common/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

// Coordinate lookup for Odisha villages, talukas, and major towns
// Source: approximate WGS84 centre-points
const ODISHA_LOCATIONS = {
 // Villages in Khurda district
 'balipatna': [20.1370, 85.7730],
 'khurda': [20.1823, 85.6174],
 'tangi': [20.0606, 85.8303],
 'chilika': [19.7500, 85.3500],
 'jatni': [20.1714, 85.7093],
 'bolagarh': [20.2590, 85.6050],
 'begunia': [20.0400, 85.5600],
 'banpur': [20.0350, 85.5250],

 // Bhubaneswar & suburbs
 'bhubaneswar': [20.2961, 85.8245],
 'bbsr': [20.2961, 85.8245],
 'patia': [20.3543, 85.8207],
 'nayapalli': [20.2822, 85.8162],
 'chandrasekharpur': [20.3150, 85.8160],

 // Puri district
 'puri': [19.8135, 85.8312],
 'konark': [19.8877, 86.1045],
 'brahmagiri': [19.8300, 85.5900],

 // Cuttack district
 'cuttack': [20.4625, 85.8830],
 'choudwar': [20.5090, 85.8440],
 'mahanga': [20.5730, 85.9840],
 'kendrapara': [20.4965, 86.4180],

 // Balasore / Baleswar
 'balasore': [21.4942, 86.9319],
 'baleswar': [21.4942, 86.9319],
 'jaleswar': [21.8050, 87.2200],

 // Sambalpur
 'sambalpur': [21.4669, 83.9756],
 'burla': [21.5026, 83.8615],

 // Kalinga / Kalahandi
 'kalinga': [19.9094, 83.1685],
 'kalahandi': [19.9094, 83.1685],
 'bhawanipatna':[19.9094, 83.1685],

 // Koraput
 'koraput': [18.8125, 82.7130],
 'jeypore': [18.8550, 82.5720],

 // Rayagada
 'rayagada': [19.1671, 83.4149],

 // Ganjam
 'berhampur': [19.3150, 84.7941],
 'aska': [19.6320, 84.6650],
 'ganjam': [19.3906, 85.0530],

 // Sundargarh
 'sundargarh': [22.1175, 84.0302],
 'rourkela': [22.2604, 84.8536],

 // Keonjhar
 'keonjhar': [21.6290, 85.5830],
 'barbil': [22.1030, 85.3820],

 // Mayurbhanj
 'baripada': [21.9333, 86.7167],
 'karanjia': [21.7560, 85.9730],

 // Angul
 'angul': [20.8420, 85.1010],
 'talcher': [20.9528, 85.2302],

 // Dhenkanal
 'dhenkanal': [20.6583, 85.5979],

 // Jagatsinghpur
 'jagatsinghpur':[20.2566, 86.1727],
 'paradeep': [20.3165, 86.6115],

 // Nayagarh
 'nayagarh': [20.1283, 85.0952],

 // Bargarh
 'bargarh': [21.3344, 83.6175],

 // Bolangir / Balangir
 'bolangir': [20.7042, 83.4867],
 'balangir': [20.7042, 83.4867],

 // Jharsuguda
 'jharsuguda': [21.8553, 84.0057],
};

const DEFAULT_COORDS = [20.2961, 85.8245]; // Bhubaneswar fallback

function resolveLocationFromFarmer(user) {
 if (!user) return { coords: DEFAULT_COORDS, label: 'Bhubaneswar, Odisha (Default)' };

 // 1. Use registered plot GPS center — most accurate
 const center = user.ndviProfile?.center;
 if (center && center[0] && center[1] && Math.abs(center[0]) > 0.01) {
 const label = user.village
 ? `${user.village}, ${user.district || 'Odisha'} (Plot Location)`
 : `Plot Location (Lat ${center[0].toFixed(3)}, Lng ${center[1].toFixed(3)})`;
 return { coords: [center[0], center[1]], label };
 }

 // 2. Look up village name in our Odisha coordinates table
 if (user.village) {
 const key = user.village.toLowerCase().trim();
 if (ODISHA_LOCATIONS[key]) {
 return {
 coords: ODISHA_LOCATIONS[key],
 label: `${user.village}, ${user.district || 'Odisha'}`
 };
 }
 // Partial match — e.g. "Balipatna" → "balipatna"
 const partial = Object.keys(ODISHA_LOCATIONS).find(k => key.includes(k) || k.includes(key));
 if (partial) {
 return {
 coords: ODISHA_LOCATIONS[partial],
 label: `${user.village}, ${user.district || 'Odisha'}`
 };
 }
 }

 // 3. District-level fallback
 if (user.district) {
 const key = user.district.toLowerCase().trim();
 if (ODISHA_LOCATIONS[key]) {
 return {
 coords: ODISHA_LOCATIONS[key],
 label: `${user.district}, Odisha (District Centre)`
 };
 }
 }

 return { coords: DEFAULT_COORDS, label: 'Bhubaneswar, Odisha (Fallback)' };
}

function WeatherIcon({ condition = '', size = 18 }) {
 const c = condition.toLowerCase();
 if (c.includes('rain') || c.includes('thunder') || c.includes('storm')) return <CloudRain size={size} color="#6BBFFF" />;
 if (c.includes('cloud') || c.includes('partly')) return <Cloud size={size} color="#8A7B68" />;
 return <Sun size={size} color="#D9A441" />;
}

export default function WeatherView({ onBack }) {
 const { lang, t } = useLanguage();
 const { user } = useAuth();

 const [weather, setWeather] = useState(null);
 const [loading, setLoading] = useState(true);
 const [locationLabel, setLocationLabel] = useState('');

 const loadWeather = async () => {
 setLoading(true);
 const { coords, label } = resolveLocationFromFarmer(user);
 setLocationLabel(label);
 try {
 const data = await fetchLiveWeather(coords[0], coords[1]);
 setWeather(data);
 } catch (err) {
 console.warn('Weather fetch error:', err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { loadWeather(); }, [user?.village, user?.ndviProfile?.center]);

 const advisoryText = weather?.advisory?.[lang?.code] || weather?.advisory?.['en-IN'] || 'Postpone fertilizer application if heavy rain expected.';

 return (
 <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 60px' }}>
 <TopBar title={t('topicWeather')} onBack={onBack} />

 {/* Hero Weather Card */}
 <div style={{ background: 'linear-gradient(135deg, #2B2118 0%, #3D3023 100%)', color: '#FAF4E6', borderRadius: 16, padding: '20px', marginBottom: 16, boxShadow: '0 8px 24px rgba(43,33,24,0.15)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div style={{ flex: 1, paddingRight: 10 }}>
 <div style={{ color: '#D8CBA8', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>
 Live Open-Meteo · Farmer Location
 </div>
 <div style={{ fontSize: 13, color: '#FAF4E6', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
 <MapPin size={12} color="#D9A441" style={{ flexShrink: 0 }} />
 <span>{locationLabel || 'Detecting location...'}</span>
 </div>
 </div>
 <button onClick={loadWeather} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <RefreshCw size={16} color="#D9A441" style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
 </button>
 </div>

 <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '16px 0 8px' }}>
 <span className="mono" style={{ fontSize: 52, fontWeight: 700, color: '#D9A441', lineHeight: 1 }}>
 {loading ? '—' : (weather?.temp || '31°C')}
 </span>
 <div>
 <div style={{ fontSize: 14, color: '#FAF4E6', fontWeight: 600 }}>
 {loading ? 'Fetching live data...' : (weather?.condition || 'Clear')}
 </div>
 {!loading && weather && (
 <div style={{ fontSize: 11, color: '#D8CBA8', marginTop: 2 }}>UV: {weather.uvIndex}</div>
 )}
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(216,203,168,0.2)' }}>
 <div>
 <div style={{ color: '#D8CBA8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
 <Droplets size={12} /> Humidity
 </div>
 <div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 3 }}>
 {weather?.humidity || '—'}
 </div>
 </div>
 <div>
 <div style={{ color: '#D8CBA8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
 <Wind size={12} /> Wind
 </div>
 <div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 3 }}>
 {weather?.wind || '—'}
 </div>
 </div>
 <div>
 <div style={{ color: '#D8CBA8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
 <CloudRain size={12} /> 24h Rain
 </div>
 <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: '#6BBFFF', marginTop: 3 }}>
 {weather?.rainfall24h || '—'}
 </div>
 </div>
 </div>
 </div>

 {/* Advisory */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderLeft: '6px solid #B8492E', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
 <AlertTriangle size={18} color="#B8492E" />
 <span style={{ fontWeight: 700, fontSize: 15, color: '#2B2118' }}>Agrometeorological Alert</span>
 </div>
 <p style={{ fontSize: 13, color: '#6B5B45', lineHeight: 1.6, margin: 0 }}>{advisoryText}</p>
 </div>

 {/* 5-Day Forecast */}
 {(weather?.forecast || []).length > 0 && (
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
 <Calendar size={16} color="#D9A441" />
 <span className="disp" style={{ fontWeight: 700, fontSize: 15, color: '#2B2118' }}>5-Day Forecast</span>
 <span style={{ fontSize: 10, color: '#8A7B68' }}>· Open-Meteo</span>
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {weather.forecast.map((f, idx) => (
 <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8 }}>
 <div style={{ width: 72, fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{f.day}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B5B45', flex: 1 }}>
 <WeatherIcon condition={f.condition} size={16} />
 <span>{f.condition}</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 {f.precip > 0 && <span style={{ fontSize: 11, color: '#6B8F5C' }} className="mono">{f.precip} mm</span>}
 <span className="mono" style={{ fontWeight: 700, fontSize: 13 }}>{f.tempHigh}° / {f.tempLow}°</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Farm Action Plan */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
 <ShieldCheck size={16} color="#6B8F5C" />
 <span className="disp" style={{ fontWeight: 700, fontSize: 15 }}>Recommended Agronomic Actions</span>
 </div>
 <ul style={{ fontSize: 13, color: '#6B5B45', lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
 <li>Postpone nitrogenous fertilizer broadcasting until morning clear window (6–10 AM).</li>
 <li>Apply straw mulch around vegetable beds to prevent surface evaporation.</li>
 <li>Use drip irrigation during early morning to maximize root absorption efficiency.</li>
 <li>Check soil moisture before next irrigation — avoid waterlogging during monsoon.</li>
 </ul>
 </div>
 </div>
 );
}
