import React, { useState } from 'react';
import { MapPin, Phone, CreditCard, Sprout, AlertTriangle, ShieldCheck, CheckCircle2, UserCheck, X, Activity, Droplets } from 'lucide-react';
import { ResponsiveContainer as RechartsResponsive, LineChart as RechartsLineChart, Line as RechartsLine, XAxis as RechartsXAxis, YAxis as RechartsYAxis, CartesianGrid as RechartsGrid, Tooltip as RechartsTooltip } from 'recharts';
import Gauge, { riskColor, riskLabel } from '../common/Gauge';
import TopBar from '../common/TopBar';
import NdviMapWidget from '../common/NdviMapWidget';
import { getFarmerNdviProfile } from '../../data/ndviData';

export default function FarmerDetailModal({ farmer, onBack }) {
 const [escalated, setEscalated] = useState(false);
 const [dispatched, setDispatched] = useState(false);

 if (!farmer) return null;

 // Retrieve farmer's satellite NDVI profile
 const ndviProfile = farmer.ndviProfile || getFarmerNdviProfile(farmer.id);

 // Prepare chart historical data
 const chartData = ndviProfile.historyDates.map((d, i) => ({
 date: d,
 ndvi: ndviProfile.ndviHistory[i],
 nir: ndviProfile.nirHistory[i],
 rgb: ndviProfile.rgbHistory[i]
 }));

 const nitrogenText = ndviProfile.nitrogenStatus['en-IN'];
 const moistureText = ndviProfile.moistureStatus['en-IN'];
 const actionText = ndviProfile.actionPlan['en-IN'];

 return (
 <div style={{ maxWidth: 580, margin: '0 auto', padding: '16px 16px 60px' }}>
 <TopBar title={farmer.name} onBack={onBack} />

 {/* 1. Immediate Satellite NDVI Score & Health Banner */}
 <div style={{
 background: '#2B2118',
 borderRadius: 16,
 padding: '16px 18px',
 marginBottom: 16,
 color: '#FAF4E6',
 boxShadow: '0 6px 20px rgba(43,33,24,0.18)'
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <span style={{
 background: ndviProfile.ndviScore >= 0.7 ? '#10b981' : ndviProfile.ndviScore >= 0.4 ? '#f59e0b' : '#ef4444',
 color: '#000',
 fontSize: 10,
 fontWeight: 800,
 padding: '2px 8px',
 borderRadius: 12,
 textTransform: 'uppercase'
 }}>
 {ndviProfile.healthRating}
 </span>
 <div className="disp" style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
 NDVI Score: <span className="mono" style={{ color: ndviProfile.ndviScore >= 0.7 ? '#10b981' : ndviProfile.ndviScore >= 0.4 ? '#f59e0b' : '#ef4444' }}>{ndviProfile.ndviScore}</span>
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Plot Area: {ndviProfile.areaHa} HA ({farmer.acres} Acres) • {farmer.crop} Crop
 </div>
 </div>

 <div style={{ textAlign: 'right' }}>
 <div style={{ fontSize: 10, color: '#D8CBA8', textTransform: 'uppercase' }}>Distress Risk</div>
 <div className="mono" style={{ fontSize: 24, fontWeight: 800, color: riskColor(farmer.score) }}>
 {farmer.score}/100
 </div>
 </div>
 </div>

 {/* Satellite Map Widget */}
 <div style={{ marginTop: 12 }}>
 <NdviMapWidget
 center={ndviProfile.center}
 polygonPoints={ndviProfile.polygon}
 acres={farmer.acres}
 areaHa={ndviProfile.areaHa}
 ndviScore={ndviProfile.ndviScore}
 height={220}
 />
 </div>
 </div>

 {/* 2. Historical NDVI Growth Trend Graph */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <span> Historical Vegetation Index Telemetry</span>
 <span style={{ fontSize: 11, color: '#10b981', fontFamily: 'JetBrains Mono' }}>Max: {ndviProfile.ndviMax}</span>
 </div>

 <RechartsResponsive width="100%" height={140}>
 <RechartsLineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
 <RechartsGrid strokeDasharray="3 3" stroke="#D8CBA8" />
 <RechartsXAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#6B5B45" />
 <RechartsYAxis domain={[0, 1]} tick={{ fontSize: 10 }} stroke="#6B5B45" />
 <RechartsTooltip />
 <RechartsLine type="monotone" dataKey="ndvi" name="NDVI Vigor" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
 <RechartsLine type="monotone" dataKey="nir" name="NIR Density" stroke="#ef4444" strokeWidth={1.5} dot={false} />
 </RechartsLineChart>
 </RechartsResponsive>
 </div>

 {/* 3. Agronomic Field Diagnostics */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderLeft: '5px solid #6B8F5C', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
 <h4 className="disp" style={{ fontWeight: 700, fontSize: 14, color: '#2B2118', margin: '0 0 8px' }}>
 Precision Field Diagnostics
 </h4>
 <div style={{ fontSize: 12, color: '#2B2118', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 6 }}>
 <div><strong> Nitrogen Absorption:</strong> {nitrogenText}</div>
 <div><strong> Water & Transpiration:</strong> {moistureText}</div>
 <div style={{ background: 'rgba(107, 143, 92, 0.12)', padding: '8px 10px', borderRadius: 8, marginTop: 2 }}>
 <strong style={{ color: '#6B8F5C' }}> Agronomist Prescription:</strong> {actionText}
 </div>
 </div>
 </div>

 {/* 4. Profile Details */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #D8CBA8', fontSize: 13 }}>
 <span style={{ color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 6 }}>
 <MapPin size={14} /> Village / District
 </span>
 <span style={{ fontWeight: 600 }}>{farmer.village}, {farmer.district || 'Khurda'}</span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #D8CBA8', fontSize: 13 }}>
 <span style={{ color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 6 }}>
 <Sprout size={14} /> Primary Crop & Land
 </span>
 <span style={{ fontWeight: 600 }}>{farmer.crop} ({farmer.acres || 2.5} Acres)</span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #D8CBA8', fontSize: 13 }}>
 <span style={{ color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 6 }}>
 <Phone size={14} /> Mobile Contact
 </span>
 <span className="mono" style={{ fontWeight: 600 }}>+91 {farmer.mobile}</span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
 <span style={{ color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 6 }}>
 <CreditCard size={14} /> Aadhaar Hash
 </span>
 <span className="mono" style={{ fontWeight: 600 }}>{farmer.aadhaar}</span>
 </div>
 </div>

 {/* 5. Composite Stress Metrics */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
 <h4 className="disp" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
 Composite Stress Metrics
 </h4>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '10px 12px' }}>
 <span style={{ fontSize: 13, color: '#6B5B45' }}>Rainfall Deficit vs Normal</span>
 <span className="mono" style={{ fontWeight: 700, color: farmer.rainfallDeficit > 25 ? '#B8492E' : '#6B8F5C' }}>
 {farmer.rainfallDeficit}%
 </span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '10px 12px' }}>
 <span style={{ fontSize: 13, color: '#6B5B45' }}>Crop Wholesale Price Drop</span>
 <span className="mono" style={{ fontWeight: 700, color: farmer.priceDrop > 25 ? '#B8492E' : '#6B8F5C' }}>
 {farmer.priceDrop}%
 </span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '10px 12px' }}>
 <span style={{ fontSize: 13, color: '#6B5B45' }}>Short-Term Debt Due In</span>
 <span className="mono" style={{ fontWeight: 700, color: farmer.loanDueDays < 10 ? '#B8492E' : '#C97D34' }}>
 {farmer.loanDueDays} Days
 </span>
 </div>
 </div>
 </div>

 {/* 6. Action Buttons */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 <button
 onClick={() => setEscalated(true)}
 disabled={escalated}
 style={{
 width: '100%',
 padding: '13px',
 borderRadius: 10,
 background: escalated ? '#6B8F5C' : '#B8492E',
 color: '#FFF',
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 boxShadow: '0 4px 12px rgba(184,73,46,0.25)',
 cursor: 'pointer'
 }}
 >
 {escalated ? (
 <>
 <CheckCircle2 size={18} />
 <span>Escalated to District Collectorate Emergency Fund </span>
 </>
 ) : (
 <>
 <AlertTriangle size={18} />
 <span>Escalate to District Relief Fund</span>
 </>
 )}
 </button>

 <button
 onClick={() => setDispatched(true)}
 disabled={dispatched}
 style={{
 width: '100%',
 padding: '12px',
 borderRadius: 10,
 background: dispatched ? '#FAF4E6' : '#2B2118',
 color: dispatched ? '#6B8F5C' : '#FAF4E6',
 border: dispatched ? '1.5px solid #6B8F5C' : 'none',
 fontWeight: 600,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 cursor: 'pointer'
 }}
 >
 {dispatched ? (
 <>
 <CheckCircle2 size={16} />
 <span>Field Officer Assigned & Dispatched to Village </span>
 </>
 ) : (
 <>
 <UserCheck size={16} color="#D9A441" />
 <span>Dispatch Village Agriculture Worker (VAW)</span>
 </>
 )}
 </button>
 </div>
 </div>
 );
}
