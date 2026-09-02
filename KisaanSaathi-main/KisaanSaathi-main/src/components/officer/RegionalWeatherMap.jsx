import React from 'react';
import { CloudRain, AlertTriangle, MapPin } from 'lucide-react';

export default function RegionalWeatherMap() {
 const villages = [
 { name: "Balipatna Block", deficit: 38, status: "Critical Drought", color: "#B8492E" },
 { name: "Chilika Coastal", deficit: 51, status: "Severe Deficit", color: "#B8492E" },
 { name: "Tangi Block", deficit: 18, status: "Moderate Deficit", color: "#C97D34" },
 { name: "Khurda Sadar", deficit: 22, status: "Moderate Deficit", color: "#C97D34" },
 { name: "Jatni Urban Block", deficit: 8, status: "Normal Range", color: "#6B8F5C" }
 ];

 return (
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px', marginBottom: 18 }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <CloudRain size={18} color="#B8492E" />
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118' }}>
 Block-Level Rainfall Deficit Radar
 </h3>
 </div>
 <span style={{ fontSize: 11, color: '#8A7B68' }} className="mono">IMD Doppler Telemetry</span>
 </div>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {villages.map((v, idx) => (
 <div
 key={idx}
 style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderLeft: `5px solid ${v.color}`,
 borderRadius: 8,
 padding: '10px 12px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}
 >
 <div>
 <div style={{ fontWeight: 600, fontSize: 13, color: '#2B2118' }}>{v.name}</div>
 <div style={{ fontSize: 11, color: '#6B5B45', marginTop: 1 }}>{v.status}</div>
 </div>

 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: v.color }}>
 -{v.deficit}%
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
