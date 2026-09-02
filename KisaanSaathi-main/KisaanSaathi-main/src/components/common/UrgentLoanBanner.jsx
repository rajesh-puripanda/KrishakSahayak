import React, { useState } from 'react';
import { AlertCircle, Bell, BellOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function UrgentLoanBanner({ loans, onActionClick }) {
 const { t } = useLanguage();
 const [muted, setMuted] = useState(false);

 if (!loans || loans.length === 0) return null;

 // Find most critical loan with dueDays <= 7
 const urgentLoan = loans.find(l => l.dueDays <= 7);
 if (!urgentLoan) return null;

 const playBeep = () => {
 try {
 const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
 const osc = audioCtx.createOscillator();
 const gain = audioCtx.createGain();
 osc.type = 'sine';
 osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
 gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
 osc.connect(gain);
 gain.connect(audioCtx.destination);
 osc.start();
 osc.stop(audioCtx.currentTime + 0.5);
 } catch (e) {}
 };

 return (
 <div
 className="pulse-alarm"
 style={{
 background: '#B8492E',
 color: '#FAF4E6',
 borderRadius: 12,
 padding: '14px 16px',
 marginBottom: 18,
 display: 'flex',
 flexDirection: 'column',
 gap: 8,
 position: 'relative'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <ShieldAlert size={20} color="#FFD166" />
 <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: '#FFD166' }}>
 {t('urgentLoanWarning')}
 </span>
 </div>

 <button
 onClick={() => {
 setMuted(!muted);
 if (muted) playBeep();
 }}
 style={{
 background: 'rgba(255, 255, 255, 0.15)',
 border: 'none',
 borderRadius: 6,
 padding: '4px 8px',
 color: '#FAF4E6',
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 fontSize: 11
 }}
 title={muted ? "Sound Alert Off" : "Sound Alert Active"}
 >
 {muted ? <BellOff size={13} /> : <Bell size={13} />}
 <span>{muted ? "Muted" : "Alarm"}</span>
 </button>
 </div>

 <div style={{ fontSize: 14, lineHeight: 1.4 }}>
 <strong>{urgentLoan.name} (₹{urgentLoan.amount.toLocaleString('en-IN')})</strong>
 <div style={{ marginTop: 2, color: '#FCE7D2', fontSize: 13 }}>
 {t('loanDueIn')} <span className="mono" style={{ fontWeight: 700, color: '#FFF', fontSize: 15, background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4 }}>{urgentLoan.dueDays} {t('days')}</span>. Timely payment saves 3% interest subvention penalty.
 </div>
 </div>

 {onActionClick && (
 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
 <button
 onClick={() => onActionClick('loans')}
 style={{
 background: '#FAF4E6',
 color: '#B8492E',
 padding: '6px 14px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 display: 'inline-flex',
 alignItems: 'center',
 gap: 6
 }}
 >
 <span>{t('viewMoratorium')}</span>
 <ArrowRight size={14} />
 </button>
 </div>
 )}
 </div>
 );
}
