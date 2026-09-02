import React from 'react';

export function riskColor(score) {
 if (score >= 66) return '#B8492E'; // Rust / High risk
 if (score >= 34) return '#C97D34'; // Amber / Moderate risk
 return '#6B8F5C'; // Sage / Low risk
}

export function riskLabel(score) {
 if (score >= 66) return 'High';
 if (score >= 34) return 'Medium';
 return 'Low';
}

export default function Gauge({ score, size = 120, showLabel = false }) {
 const clampedScore = Math.max(0, Math.min(100, score));
 const angle = (clampedScore / 100) * 180;
 const rad = (Math.PI / 180) * (180 - angle);
 const cx = size / 2;
 const cy = size * 0.9;
 const r = size * 0.42;
 const nx = cx + r * 0.78 * Math.cos(rad);
 const ny = cy - r * 0.78 * Math.sin(rad);
 const color = riskColor(clampedScore);

 const ticks = [0, 25, 50, 75, 100].map((t) => {
 const a = (Math.PI / 180) * (180 - (t / 100) * 180);
 const x1 = cx + r * 0.92 * Math.cos(a);
 const y1 = cy - r * 0.92 * Math.sin(a);
 const x2 = cx + r * 1.04 * Math.cos(a);
 const y2 = cy - r * 1.04 * Math.sin(a);
 return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2B2118" strokeWidth="2" opacity="0.4" />;
 });

 const arcPath = (start, end, col) => {
 const a1 = (Math.PI / 180) * (180 - start);
 const a2 = (Math.PI / 180) * (180 - end);
 const x1 = cx + r * Math.cos(a1);
 const y1 = cy - r * Math.sin(a1);
 const x2 = cx + r * Math.cos(a2);
 const y2 = cy - r * Math.sin(a2);
 return (
 <path
 d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
 stroke={col}
 strokeWidth={size * 0.095}
 fill="none"
 strokeLinecap="round"
 opacity="0.9"
 />
 );
 };

 return (
 <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
 <svg width={size} height={size * 0.64} viewBox={`0 0 ${size} ${size * 0.64}`}>
 {arcPath(0, 60, '#6B8F5C')}
 {arcPath(60, 120, '#C97D34')}
 {arcPath(120, 180, '#B8492E')}
 {ticks}
 {/* Animated Needle */}
 <line
 x1={cx}
 y1={cy}
 x2={nx}
 y2={ny}
 stroke="#2B2118"
 strokeWidth={Math.max(2.5, size * 0.032)}
 strokeLinecap="round"
 />
 <circle cx={cx} cy={cy} r={size * 0.048} fill="#2B2118" />
 <text
 x={cx}
 y={cy - size * 0.03}
 textAnchor="middle"
 fontFamily="JetBrains Mono"
 fontWeight="700"
 fontSize={size * 0.16}
 fill={color}
 >
 {clampedScore}
 </text>
 </svg>
 {showLabel && (
 <span style={{ color, fontSize: 13, fontWeight: 700, marginTop: -2 }} className="mono">
 {riskLabel(clampedScore)} Risk
 </span>
 )}
 </div>
 );
}
