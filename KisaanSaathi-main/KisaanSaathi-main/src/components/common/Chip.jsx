import React from 'react';

export default function Chip({ active, onClick, label, count, icon }) {
 return (
 <button
 onClick={onClick}
 style={{
 padding: '6px 14px',
 borderRadius: 999,
 fontSize: 13,
 fontWeight: active ? 600 : 500,
 border: `1px solid ${active ? '#D9A441' : '#D8CBA8'}`,
 background: active ? '#D9A441' : '#FAF4E6',
 color: active ? '#2B2118' : '#6B5B45',
 display: 'inline-flex',
 alignItems: 'center',
 gap: 6,
 transition: 'all 0.15s ease'
 }}
 >
 {icon}
 <span>{label}</span>
 {count !== undefined && (
 <span
 style={{
 background: active ? '#2B2118' : '#D8CBA8',
 color: active ? '#FAF4E6' : '#2B2118',
 fontSize: 11,
 fontWeight: 700,
 padding: '1px 6px',
 borderRadius: 10,
 marginLeft: 2
 }}
 className="mono"
 >
 {count}
 </span>
 )}
 </button>
 );
}
