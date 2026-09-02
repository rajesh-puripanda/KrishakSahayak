import React, { useState, useEffect, useCallback } from 'react';
import { TrendingDown, TrendingUp, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TopBar from '../common/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { fetchLiveMandiPrices } from '../../services/apiService';

const TREND_DATA = {
 tomato: [{day:'Mon',price:18},{day:'Tue',price:17},{day:'Wed',price:15},{day:'Thu',price:12},{day:'Fri',price:11},{day:'Sat',price:10},{day:'Sun',price:9}],
 onion: [{day:'Mon',price:22},{day:'Tue',price:21},{day:'Wed',price:23},{day:'Thu',price:20},{day:'Fri',price:19},{day:'Sat',price:18},{day:'Sun',price:17}],
 paddy: [{day:'Mon',price:21},{day:'Tue',price:21},{day:'Wed',price:22},{day:'Thu',price:22},{day:'Fri',price:22},{day:'Sat',price:23},{day:'Sun',price:23}],
 wheat: [{day:'Mon',price:24},{day:'Tue',price:24},{day:'Wed',price:25},{day:'Thu',price:25},{day:'Fri',price:26},{day:'Sat',price:26},{day:'Sun',price:27}],
 potato: [{day:'Mon',price:17},{day:'Tue',price:16},{day:'Wed',price:16},{day:'Thu',price:15},{day:'Fri',price:15},{day:'Sat',price:15},{day:'Sun',price:16}]
};
const CROP_KEYS = ['tomato','onion','paddy','wheat','potato'];
const CROP_COLORS = {tomato:'#B8492E',onion:'#C97D34',paddy:'#6B8F5C',wheat:'#8B6E3A',potato:'#7B68AA'};
const NEARBY = [
 {mandi:'Balipatna APMC (Local)',distanceKm:4,pricePer:9,label:'Lowest — Local Glut'},
 {mandi:'Bhubaneswar Unit-1 Mandi',distanceKm:18,pricePer:14,label:'Best Price +₹5/kg'},
 {mandi:'Jatni Wholesale Market',distanceKm:14,pricePer:13,label:'Good — Stable'},
 {mandi:'Cuttack Malgodown',distanceKm:32,pricePer:16,label:'Highest — Long Haul'}
];

export default function MandiView({ onBack }) {
 const { t } = useLanguage();
 const [selectedCrop, setSelectedCrop] = useState('tomato');
 const [mandiData, setMandiData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [lastUpdated, setLastUpdated] = useState(null);

 const loadMandiData = useCallback(async () => {
 setLoading(true);
 try {
 const prices = await fetchLiveMandiPrices('Khurda');
 setMandiData(prices);
 setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
 } catch (err) {
 console.warn('MandiView fetch error:', err);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => { loadMandiData(); }, [loadMandiData]);

 const trendData = TREND_DATA[selectedCrop] || TREND_DATA.tomato;
 const cropColor = CROP_COLORS[selectedCrop] || '#2B2118';
 const weekDelta = (((trendData[6].price - trendData[0].price) / trendData[0].price) * 100).toFixed(1);
 const isDown = Number(weekDelta) < 0;
 const crashAlert = mandiData.find(item =>
 item.crop.toLowerCase().includes(selectedCrop) && item.trend === 'CRASH'
 );

 return (
 <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 60px' }}>
 <TopBar title={t('topicMarket')} onBack={onBack} />

 {/* Header banner */}
 <div style={{ background: '#2B2118', color: '#FAF4E6', borderRadius: 14, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div>
 <div style={{ fontSize: 10, color: '#D8CBA8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>AGMARKNET / eNAM Live Feeds</div>
 <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>Today Mandi Rates</div>
 {lastUpdated && <div style={{ fontSize: 11, color: '#D8CBA8', marginTop: 1 }}>Updated: {lastUpdated}</div>}
 </div>
 <button onClick={loadMandiData} disabled={loading} style={{ background: 'rgba(217,164,65,0.2)', border: '1px solid #D9A441', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, color: '#D9A441', fontSize: 12, fontWeight: 600 }}>
 {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={14} />}
 {loading ? 'Loading...' : 'Refresh'}
 </button>
 </div>

 {/* Live price cards */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
 {loading && mandiData.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '24px', color: '#8A7B68', fontSize: 13 }}>
 <Loader2 size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
 Fetching live mandi rates...
 </div>
 ) : mandiData.map((item) => {
 const key = CROP_KEYS.find(k => item.crop.toLowerCase().includes(k)) || 'tomato';
 const isSelected = key === selectedCrop;
 const isCrash = item.trend === 'CRASH';
 const itemDown = item.change < 0;
 return (
 <button key={item.id} onClick={() => setSelectedCrop(key)}
 style={{ background: isSelected ? '#FFF8EA' : '#FAF4E6', border: `1.5px solid ${isSelected ? '#D9A441' : isCrash ? '#F05252' : '#D8CBA8'}`, borderLeft: `5px solid ${isCrash ? '#B8492E' : itemDown ? '#C97D34' : '#6B8F5C'}`, borderRadius: 12, padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: isSelected ? '0 4px 12px rgba(217,164,65,0.15)' : 'none', transition: 'all 0.15s' }}>
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{item.crop}</div>
 <div style={{ fontSize: 11, color: '#8A7B68', marginTop: 2 }}>{item.mandi}</div>
 {isCrash && <div style={{ fontSize: 10, color: '#B8492E', fontWeight: 700, marginTop: 3 }}>Warning: {item.status}</div>}
 </div>
 <div style={{ textAlign: 'right' }}>
 <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: '#2B2118' }}>
 ₹{item.price}<span style={{ fontSize: 11, fontWeight: 400 }}>/{item.unit}</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginTop: 2, color: itemDown ? '#B8492E' : '#6B8F5C', fontSize: 11, fontWeight: 700 }}>
 {itemDown ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
 {itemDown ? '' : '+'}{item.change}%
 </div>
 </div>
 </button>
 );
 })}
 </div>

 {/* 7-Day chart */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px', marginBottom: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
 <div>
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase' }}>7-Day Price Trend</div>
 <h3 className="disp" style={{ fontSize: 15, fontWeight: 700, color: '#2B2118', textTransform: 'capitalize' }}>{selectedCrop} — ₹/kg</h3>
 </div>
 <div style={{ background: isDown ? '#FDE8E8' : '#EAF3E7', color: isDown ? '#B8492E' : '#6B8F5C', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
 {isDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {weekDelta}% (7D)
 </div>
 </div>
 <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
 {CROP_KEYS.map(c => (
 <button key={c} onClick={() => setSelectedCrop(c)}
 style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: selectedCrop === c ? '#2B2118' : '#FAF4E6', color: selectedCrop === c ? '#FAF4E6' : '#6B5B45', border: '1px solid #D8CBA8' }}>
 {c}
 </button>
 ))}
 </div>
 <ResponsiveContainer width="100%" height={180}>
 <LineChart data={trendData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#D8CBA8" />
 <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6B5B45" />
 <YAxis tick={{ fontSize: 11 }} stroke="#6B5B45" />
 <Tooltip formatter={(v) => [`₹${v}/kg`, selectedCrop]} contentStyle={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 8, fontSize: 12 }} />
 <Line type="monotone" dataKey="price" stroke={cropColor} strokeWidth={3} dot={{ r: 4, fill: cropColor }} activeDot={{ r: 6 }} />
 </LineChart>
 </ResponsiveContainer>
 {crashAlert && (
 <div style={{ marginTop: 12, background: '#FDE8E8', border: '1px solid #F05252', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#B8492E' }}>
 <TrendingDown size={18} />
 <span><strong>{crashAlert.crop.split('(')[0].trim()}</strong> price dropped <strong>{Math.abs(crashAlert.change)}%</strong> — consider delay-selling or seeking alternate Mandis.</span>
 </div>
 )}
 </div>

 {/* Nearby mandi comparison */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px' }}>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Compare Nearby Mandis</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 {NEARBY.map((m, idx) => (
 <div key={idx} style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{m.mandi}</div>
 <div style={{ fontSize: 11, color: '#8A7B68', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
 <MapPin size={11} /> {m.distanceKm} km away
 </div>
 <div style={{ fontSize: 10, color: m.pricePer >= 14 ? '#6B8F5C' : '#B8492E', fontWeight: 600, marginTop: 2 }}>{m.label}</div>
 </div>
 <div style={{ textAlign: 'right' }}>
 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: m.pricePer >= 14 ? '#6B8F5C' : '#B8492E' }}>₹{m.pricePer}/kg</div>
 <div style={{ fontSize: 11, color: '#6B5B45', textTransform: 'capitalize' }}>{selectedCrop} Rate</div>
 </div>
 </div>
 ))}
 </div>
 <div style={{ marginTop: 12, background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#6B5B45' }}>
 <strong>Advisory:</strong> Transporting to Bhubaneswar Unit-1 (18 km) nets ₹5/kg more.
 For 1 tonne load, extra <strong style={{ color: '#6B8F5C' }}>₹5,000</strong> after transport cost ~₹1,200.
 </div>
 </div>
 </div>
 );
}
