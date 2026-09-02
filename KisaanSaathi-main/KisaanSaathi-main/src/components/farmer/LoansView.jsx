import React, { useState } from 'react';
import { Calendar, AlertCircle, ShieldAlert, CheckCircle2, FileText, ArrowRight, Percent, CreditCard, IndianRupee, Info } from 'lucide-react';
import TopBar from '../common/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { submitLoanApplication } from '../../services/apiService';

export default function LoansView({ onBack }) {
 const { t } = useLanguage();
 const { user } = useAuth();

 const [moratoriumApplied, setMoratoriumApplied] = useState(false);
 const [showKccModal, setShowKccModal] = useState(false);
 const [kccAmount, setKccAmount] = useState(150000);
 const [kccResult, setKccResult] = useState(null);
 const [kccLoading, setKccLoading] = useState(false);

 // Use farmer's real loan data, fallback to sensible defaults
 const loans = user?.loans || [
 { id: 'L-101', name: 'KCC Crop Loan - Balipatna PGB', amount: 45000, dueDays: 5, rate: '4% (Subsidized)', status: 'Critical' },
 { id: 'L-102', name: 'Drip Irrigation Term Loan - SBI', amount: 18000, dueDays: 45, rate: '7%', status: 'Normal' }
 ];

 const handleApplyKCC = () => {
 setKccLoading(true);
 setTimeout(() => {
 const result = submitLoanApplication(user || { name: 'Kisan Sathi', acres: 2.5 }, kccAmount);
 setKccResult(result);
 setKccLoading(false);
 }, 900);
 };

 const totalOutstanding = loans.reduce((s, l) => s + (l.amount || 0), 0);
 const criticalLoan = loans.find(l => l.dueDays <= 7);
 const acres = user?.acres || 2.5;
 const maxKccEligible = Math.min(300000, Math.round(acres * 60000));

 return (
 <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 60px' }}>
 <TopBar title={t('topicLoans')} onBack={onBack} />

 {/* Summary banner */}
 <div style={{ background: '#2B2118', color: '#FAF4E6', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 14px rgba(43,33,24,0.12)' }}>
 <div>
 <div style={{ fontSize: 10, color: '#D8CBA8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Credit Portfolio</div>
 <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
 {user?.name || 'Farmer'} — <span style={{ color: '#D9A441' }}>{loans.length} Active Loan{loans.length !== 1 ? 's' : ''}</span>
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Total Outstanding: <span className="mono" style={{ color: '#FAF4E6', fontWeight: 700 }}>₹{totalOutstanding.toLocaleString('en-IN')}</span>
 </div>
 </div>
 <CreditCard size={32} color="#D9A441" />
 </div>

 {/* Critical alert */}
 {criticalLoan && (
 <div style={{ background: '#FDE8E8', border: '1px solid #F05252', borderRadius: 12, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
 <AlertCircle size={20} color="#B8492E" style={{ flexShrink: 0 }} />
 <div style={{ fontSize: 13, color: '#B8492E' }}>
 <strong>Urgent:</strong> {criticalLoan.name} due in <strong>{criticalLoan.dueDays} days</strong>. Risk of penal interest if not paid.
 </div>
 </div>
 )}

 {/* Active loan cards */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
 {loans.map((l) => {
 const isUrgent = l.dueDays <= 7;
 return (
 <div key={l.id} style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderLeft: `6px solid ${isUrgent ? '#B8492E' : '#6B8F5C'}`, borderRadius: 14, padding: '16px', boxShadow: '0 2px 8px rgba(43,33,24,0.04)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <div style={{ fontWeight: 700, fontSize: 15, color: '#2B2118' }}>{l.name}</div>
 <div style={{ fontSize: 12, color: '#6B5B45', marginTop: 2 }}>Interest: {l.rate}</div>
 </div>
 <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>₹{l.amount.toLocaleString('en-IN')}</div>
 </div>
 <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #D8CBA8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
 <Calendar size={15} color={isUrgent ? '#B8492E' : '#6B8F5C'} />
 <span style={{ color: isUrgent ? '#B8492E' : '#6B5B45', fontWeight: isUrgent ? 700 : 500 }}>
 Due in <strong className="mono">{l.dueDays} days</strong>
 </span>
 </div>
 {isUrgent && (
 <span style={{ background: '#FDE8E8', color: '#B8492E', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>IMMEDIATE ACTION</span>
 )}
 </div>
 </div>
 );
 })}
 </div>

 {/* Interest subvention info */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px', marginBottom: 14 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
 <Percent size={16} color="#D9A441" />
 <h4 className="disp" style={{ fontWeight: 700, fontSize: 15 }}>3% Govt Prompt Repayment Benefit</h4>
 </div>
 <p style={{ fontSize: 13, color: '#6B5B45', lineHeight: 1.5, marginBottom: 0 }}>
 If your KCC loan is settled on or before the due date, Central Govt deposits 3% subvention, reducing your effective interest to <strong>only 4% p.a.</strong> — saving up to <span className="mono" style={{ color: '#6B8F5C', fontWeight: 700 }}>₹1,350</span> annually.
 </p>
 </div>

 {/* KCC New Loan Application */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px', marginBottom: 14 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
 <IndianRupee size={16} color="#D9A441" />
 <h4 className="disp" style={{ fontWeight: 700, fontSize: 15 }}>Apply for New KCC Crop Loan</h4>
 </div>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#6B5B45', marginBottom: 12 }}>
 <Info size={12} color="#D9A441" style={{ display: 'inline', marginRight: 4 }} />
 Based on your <strong>{acres} acres</strong>, your maximum KCC eligibility is <strong className="mono" style={{ color: '#6B8F5C' }}>₹{maxKccEligible.toLocaleString('en-IN')}</strong> at 4% subvention rate.
 </div>

 {!kccResult ? (
 <button onClick={() => setShowKccModal(true)} style={{ width: '100%', background: '#2B2118', color: '#FAF4E6', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
 <FileText size={18} color="#D9A441" />
 <span>Apply for Kisan Credit Card Loan</span>
 <ArrowRight size={16} />
 </button>
 ) : (
 <div style={{ background: '#EAF3E7', border: '1px solid #6B8F5C', borderRadius: 10, padding: '14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
 <CheckCircle2 size={20} color="#6B8F5C" />
 <span style={{ fontWeight: 700, fontSize: 14, color: '#2D5A27' }}>KCC Pre-Approved!</span>
 </div>
 <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Loan ID:</span>
 <strong className="mono">{kccResult.loanId}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Sanctioned Amount:</span>
 <strong className="mono" style={{ color: '#6B8F5C' }}>₹{kccResult.sanctionedAmount.toLocaleString('en-IN')}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Interest Rate:</span>
 <strong>{kccResult.interestRate}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Disbursement:</span>
 <strong style={{ color: '#D9A441' }}>{kccResult.disbursementDate}</strong>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Moratorium / Restructure */}
 <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '16px' }}>
 <h4 className="disp" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Drought / Price-Drop Loan Restructure</h4>
 <p style={{ fontSize: 13, color: '#6B5B45', lineHeight: 1.5, marginBottom: 14 }}>
 RBI relief guidelines allow smallholders facing &gt;33% rainfall deficit to convert short-term crop loans into a 3-year term loan with a 1-year moratorium.
 </p>
 <button onClick={() => setMoratoriumApplied(true)} disabled={moratoriumApplied} style={{ width: '100%', background: moratoriumApplied ? '#6B8F5C' : '#2B2118', color: '#FAF4E6', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
 {moratoriumApplied ? (
 <><CheckCircle2 size={18} /><span>Moratorium Application Submitted </span></>
 ) : (
 <><FileText size={18} color="#D9A441" /><span>Apply for 1-Year Loan Moratorium</span></>
 )}
 </button>
 </div>

 {/* KCC Amount Modal */}
 {showKccModal && !kccResult && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 }}>
 <div style={{ background: '#FAF4E6', border: '2px solid #D9A441', borderRadius: 18, maxWidth: 420, width: '100%', padding: 22, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118', marginBottom: 4 }}>KCC Loan Application</h3>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 16 }}>Kisan Credit Card — 4% interest with Govt subvention</p>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px', marginBottom: 14, fontSize: 12 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Farmer:</span>
 <strong>{user?.name || 'Kisan Sathi'}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Plot Size:</span>
 <strong>{acres} Acres</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Max Eligible:</span>
 <strong className="mono" style={{ color: '#6B8F5C' }}>₹{maxKccEligible.toLocaleString('en-IN')}</strong>
 </div>
 </div>

 <div style={{ marginBottom: 16 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#2B2118', marginBottom: 8 }}>
 <span>Requested Amount:</span>
 <span className="mono" style={{ color: '#D9A441' }}>₹{kccAmount.toLocaleString('en-IN')}</span>
 </div>
 <input type="range" min={10000} max={maxKccEligible} step={5000} value={kccAmount} onChange={e => setKccAmount(Number(e.target.value))} style={{ width: '100%', accentColor: '#D9A441' }} />
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8A7B68', marginTop: 4 }}>
 <span>₹10,000</span><span>₹{maxKccEligible.toLocaleString('en-IN')}</span>
 </div>
 </div>

 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={() => setShowKccModal(false)} style={{ flex: 1, background: '#FAF4E6', border: '1px solid #D8CBA8', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Cancel</button>
 <button onClick={() => { handleApplyKCC(); setShowKccModal(false); }} disabled={kccLoading} style={{ flex: 2, background: '#2B2118', color: '#FAF4E6', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
 <CheckCircle2 size={16} color="#D9A441" />
 <span>{kccLoading ? 'Processing...' : 'Submit KCC Application'}</span>
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
