import React from 'react';
import { AlertTriangle, CloudRain, TrendingDown, Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';
import Gauge, { riskColor, riskLabel } from '../common/Gauge';
import TopBar from '../common/TopBar';
import { useLanguage } from '../../context/LanguageContext';

export default function DistressView({ farmer, onBack, onNavigate }) {
 const { t } = useLanguage();
 const score = farmer ? farmer.score : 68;
 const rainDeficit = farmer ? farmer.rainfallDeficit : 38;
 const priceDrop = farmer ? farmer.priceDrop : 45;
 const loanDays = farmer ? farmer.loanDueDays : 5;

 return (
 <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 60px' }}>
 <TopBar title={t('topicDistress')} onBack={onBack} />

 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '22px 18px', textAlign: 'center', marginBottom: 16 }}>
 <Gauge score={score} size={180} />
 <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: riskColor(score), marginTop: 6 }}>
 {riskLabel(score)} Distress Risk • {score}/100
 </div>
 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 6 }}>
 Evaluated from composite satellite rainfall data, mandi wholesale drop index, and debt maturity timeline.
 </p>
 </div>

 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px', marginBottom: 16 }}>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
 Distress Factor Breakdown
 </h3>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 {/* Factor 1 */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px 14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <CloudRain size={20} color="#B8492E" />
 <div>
 <div style={{ fontSize: 13, fontWeight: 600 }}>Rainfall Deficit (Block Level)</div>
 <div style={{ fontSize: 11, color: '#8A7B68' }}>IMD 3-week cumulative gap</div>
 </div>
 </div>
 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#B8492E' }}>
 {rainDeficit}%
 </div>
 </div>

 {/* Factor 2 */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px 14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <TrendingDown size={20} color="#B8492E" />
 <div>
 <div style={{ fontSize: 13, fontWeight: 600 }}>Crop Price Drop vs 3-Year Avg</div>
 <div style={{ fontSize: 11, color: '#8A7B68' }}>Severe market gluts detected</div>
 </div>
 </div>
 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#B8492E' }}>
 {priceDrop}%
 </div>
 </div>

 {/* Factor 3 */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px 14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <Calendar size={20} color="#C97D34" />
 <div>
 <div style={{ fontSize: 13, fontWeight: 600 }}>Active Loan Maturity</div>
 <div style={{ fontSize: 11, color: '#8A7B68' }}>Repayment deadline pressure</div>
 </div>
 </div>
 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#C97D34' }}>
 {loanDays} Days
 </div>
 </div>
 </div>
 </div>

 {/* Recommended Emergency Interventions */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px' }}>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
 Recommended Relief Actions
 </h3>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 <button
 onClick={() => onNavigate('schemes')}
 style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '12px 14px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}
 >
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>1. File PM Fasal Bima Drought Claim</div>
 <div style={{ fontSize: 11, color: '#6B5B45' }}>Initiate localized crop loss survey within 72 hrs</div>
 </div>
 <ShieldCheck size={18} color="#6B8F5C" />
 </button>

 <button
 onClick={() => onNavigate('loans')}
 style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '12px 14px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}
 >
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>2. Request KCC Loan Restructuring</div>
 <div style={{ fontSize: 11, color: '#6B5B45' }}>Convert short-term loan into 3-year term facility</div>
 </div>
 <HeartHandshake size={18} color="#D9A441" />
 </button>
 </div>
 </div>
 </div>
 );
}
