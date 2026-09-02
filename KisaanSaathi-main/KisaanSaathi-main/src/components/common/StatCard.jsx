import React from 'react';

export default function StatCard({ label, value, subtext, color = '#2B2118', icon }) {
 return (
 <div
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: '14px 12px',
 textAlign: 'center',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 position: 'relative'
 }}
 >
 {icon && (
 <div style={{ marginBottom: 4, color }}>
 {icon}
 </div>
 )}
 <div className="mono" style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1.1 }}>
 {value}
 </div>
 <div style={{ fontSize: 12, fontWeight: 600, color: '#6B5B45', marginTop: 4 }}>
 {label}
 </div>
 {subtext && (
 <div style={{ fontSize: 10, color: '#8A7B68', marginTop: 2 }}>
 {subtext}
 </div>
 )}
 </div>
 );
}
