import React, { useState } from 'react';
import {
 Award, CheckCircle2, ArrowRight, ShieldCheck, FileText,
 Clock, AlertCircle, Sparkles, Check, X, ExternalLink,
 ChevronRight, Building2, User, Phone, Download
} from 'lucide-react';
import { SCHEMES, SCHEME_CATEGORIES } from '../../data/schemesData';
import TopBar from '../common/TopBar';
import Chip from '../common/Chip';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function SchemesView({ onBack }) {
 const { t } = useLanguage();
 const { user, applyToScheme } = useAuth();

 const [activeTab, setActiveTab] = useState('applied'); // 'applied' | 'explore'
 const [category, setCategory] = useState('All');
 
 // Apply Modal state
 const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
 const [applySuccess, setApplySuccess] = useState(false);
 const [newApplicationNo, setNewApplicationNo] = useState('');

 const appliedSchemes = user && user.appliedSchemes ? user.appliedSchemes : [];
 const filtered = category === 'All' ? SCHEMES : SCHEMES.filter(s => s.category.includes(category));

 const handleApply = (scheme) => {
 setSelectedSchemeForApply(scheme);
 setApplySuccess(false);
 };

 const handleConfirmApply = () => {
 if (!selectedSchemeForApply) return;
 const newRecord = applyToScheme(selectedSchemeForApply);
 setNewApplicationNo(newRecord?.applicationNo || 'PM-SCHEME-' + Math.floor(10000 + Math.random() * 90000));
 setApplySuccess(true);
 };

 return (
 <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' }}>
 <TopBar title={t('topicSchemes')} onBack={onBack} />

 {/* Main Tab Switcher */}
 <div style={{
 display: 'flex',
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: 4,
 marginBottom: 16
 }}>
 <button
 onClick={() => setActiveTab('applied')}
 style={{
 flex: 1,
 padding: '9px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 background: activeTab === 'applied' ? '#2B2118' : 'transparent',
 color: activeTab === 'applied' ? '#FAF4E6' : '#6B5B45',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 transition: 'all 0.2s'
 }}
 >
 <Award size={15} color={activeTab === 'applied' ? '#D9A441' : '#8A7B68'} />
 <span>My Applied Schemes</span>
 {appliedSchemes.length > 0 && (
 <span style={{
 background: '#D9A441',
 color: '#2B2118',
 borderRadius: 12,
 padding: '1px 7px',
 fontSize: 11,
 fontWeight: 800
 }}>
 {appliedSchemes.length}
 </span>
 )}
 </button>

 <button
 onClick={() => setActiveTab('explore')}
 style={{
 flex: 1,
 padding: '9px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 background: activeTab === 'explore' ? '#2B2118' : 'transparent',
 color: activeTab === 'explore' ? '#FAF4E6' : '#6B5B45',
 transition: 'all 0.2s'
 }}
 >
 Explore All Govt Subsidies
 </button>
 </div>

 {activeTab === 'applied' ? (
 /* TAB 1: MY APPLIED SCHEMES (STATUS & TRACKER) */
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {/* Header Banner */}
 <div style={{
 background: '#2B2118',
 color: '#FAF4E6',
 borderRadius: 14,
 padding: '14px 16px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 boxShadow: '0 4px 14px rgba(43,33,24,0.12)'
 }}>
 <div>
 <div style={{ fontSize: 11, color: '#D8CBA8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
 Direct Benefit Transfer (DBT) Portal
 </div>
 <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
 Farmer: <span style={{ color: '#D9A441' }}>{user?.name || "Ramesh Nayak"}</span>
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Aadhaar Seeding: <span style={{ color: '#6B8F5C', fontWeight: 600 }}>Active (DBT Linked)</span>
 </div>
 </div>
 <ShieldCheck size={32} color="#D9A441" />
 </div>

 {appliedSchemes.length === 0 ? (
 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 16,
 padding: '36px 20px',
 textAlign: 'center'
 }}>
 <FileText size={40} color="#D9A441" style={{ margin: '0 auto 10px' }} />
 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 No Schemes Applied Yet
 </h3>
 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 4, marginBottom: 16 }}>
 You have not applied for any government schemes or subsidies. Explore our database to secure crop insurance, machinery subsidies, and micro-irrigation grants.
 </p>
 <button
 onClick={() => setActiveTab('explore')}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '10px 18px',
 borderRadius: 8,
 fontWeight: 600,
 fontSize: 13
 }}
 >
 Browse & Apply for Schemes
 </button>
 </div>
 ) : (
 appliedSchemes.map((app) => {
 const stepNum = app.statusStep || 1;

 return (
 <div
 key={app.id}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderLeft: `6px solid ${stepNum === 4 ? '#6B8F5C' : '#D9A441'}`,
 borderRadius: 16,
 padding: '16px',
 boxShadow: '0 2px 10px rgba(43,33,24,0.05)'
 }}
 >
 {/* Scheme Card Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <span className="mono" style={{
 background: '#E8DECE',
 color: '#2B2118',
 fontSize: 10,
 fontWeight: 700,
 padding: '2px 7px',
 borderRadius: 4
 }}>
 Ref: {app.applicationNo}
 </span>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', marginTop: 4 }}>
 {app.schemeName}
 </h3>
 <div style={{ fontSize: 11.5, color: '#6B5B45', marginTop: 2 }}>
 Category: {app.category} • Applied on: <strong>{app.appliedDate}</strong>
 </div>
 </div>

 <div style={{ textAlign: 'right' }}>
 <span style={{
 background: stepNum === 4 ? '#6B8F5C' : '#D9A441',
 color: stepNum === 4 ? '#FFF' : '#2B2118',
 fontSize: 11,
 fontWeight: 700,
 padding: '3px 8px',
 borderRadius: 6
 }}>
 {app.status}
 </span>
 </div>
 </div>

 {/* 4-Step Visual Progress Bar */}
 <div style={{ margin: '16px 0 12px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 6 }}>
 {/* Connecting line */}
 <div style={{
 position: 'absolute',
 top: 10,
 left: 15,
 right: 15,
 height: 3,
 background: '#D8CBA8',
 zIndex: 1
 }} />
 <div style={{
 position: 'absolute',
 top: 10,
 left: 15,
 width: stepNum === 1 ? '0%' : stepNum === 2 ? '33%' : stepNum === 3 ? '66%' : '100%',
 height: 3,
 background: '#6B8F5C',
 zIndex: 2,
 transition: 'width 0.4s ease'
 }} />

 {/* Step 1 */}
 <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: 60 }}>
 <div style={{
 width: 22,
 height: 22,
 borderRadius: '50%',
 background: stepNum >= 1 ? '#6B8F5C' : '#FAF4E6',
 color: '#FFF',
 border: `2px solid ${stepNum >= 1 ? '#6B8F5C' : '#D8CBA8'}`,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 10,
 fontWeight: 700,
 margin: '0 auto'
 }}>
 {stepNum >= 1 ? '' : '1'}
 </div>
 <div style={{ fontSize: 9.5, fontWeight: 600, color: stepNum >= 1 ? '#2B2118' : '#8A7B68', marginTop: 4 }}>
 Submitted
 </div>
 </div>

 {/* Step 2 */}
 <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: 60 }}>
 <div style={{
 width: 22,
 height: 22,
 borderRadius: '50%',
 background: stepNum >= 2 ? '#6B8F5C' : '#FAF4E6',
 color: '#FFF',
 border: `2px solid ${stepNum >= 2 ? '#6B8F5C' : '#D8CBA8'}`,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 10,
 fontWeight: 700,
 margin: '0 auto'
 }}>
 {stepNum >= 2 ? '' : '2'}
 </div>
 <div style={{ fontSize: 9.5, fontWeight: 600, color: stepNum >= 2 ? '#2B2118' : '#8A7B68', marginTop: 4 }}>
 Verified
 </div>
 </div>

 {/* Step 3 */}
 <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: 60 }}>
 <div style={{
 width: 22,
 height: 22,
 borderRadius: '50%',
 background: stepNum >= 3 ? '#6B8F5C' : '#FAF4E6',
 color: '#FFF',
 border: `2px solid ${stepNum >= 3 ? '#6B8F5C' : '#D8CBA8'}`,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 10,
 fontWeight: 700,
 margin: '0 auto'
 }}>
 {stepNum >= 3 ? '' : '3'}
 </div>
 <div style={{ fontSize: 9.5, fontWeight: 600, color: stepNum >= 3 ? '#2B2118' : '#8A7B68', marginTop: 4 }}>
 Inspection
 </div>
 </div>

 {/* Step 4 */}
 <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: 60 }}>
 <div style={{
 width: 22,
 height: 22,
 borderRadius: '50%',
 background: stepNum >= 4 ? '#6B8F5C' : '#FAF4E6',
 color: '#FFF',
 border: `2px solid ${stepNum >= 4 ? '#6B8F5C' : '#D8CBA8'}`,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 10,
 fontWeight: 700,
 margin: '0 auto'
 }}>
 {stepNum >= 4 ? '' : '4'}
 </div>
 <div style={{ fontSize: 9.5, fontWeight: 600, color: stepNum >= 4 ? '#6B8F5C' : '#8A7B68', marginTop: 4 }}>
 Disbursed
 </div>
 </div>
 </div>
 </div>

 {/* Status Message Info Box */}
 <div style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '10px 12px',
 fontSize: 12,
 color: '#2B2118',
 marginBottom: 10
 }}>
 <div style={{ fontWeight: 600, color: '#6B8F5C', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
 <Clock size={13} />
 <span>Latest Update:</span>
 </div>
 <div>{app.statusMessage}</div>
 </div>

 {/* Claim Amount & Bank Information */}
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
 <span style={{ color: '#6B5B45' }}>Benefit / Sanctioned Value:</span>
 <strong style={{ color: '#6B8F5C' }}>{app.claimAmount}</strong>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10 }}>
 <span style={{ color: '#6B5B45' }}>Mapped Bank Account:</span>
 <span className="mono" style={{ color: '#2B2118', fontWeight: 600 }}>{app.bankAccount}</span>
 </div>

 {/* Document Checklist Pills */}
 {app.documentChecklist && app.documentChecklist.length > 0 && (
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid #E8DECE' }}>
 {app.documentChecklist.map((doc, i) => (
 <span key={i} style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#6B5B45' }}>
 {doc}
 </span>
 ))}
 </div>
 )}
 </div>
 );
 })
 )}
 </div>
 ) : (
 /* TAB 2: EXPLORE ALL SCHEMES */
 <div>
 {/* Category Pills */}
 <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
 {SCHEME_CATEGORIES.map((c) => (
 <Chip key={c} active={category === c} onClick={() => setCategory(c)} label={c} />
 ))}
 </div>

 {/* Schemes Roster with Relatable Pictures */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {filtered.map((s) => (
 <div
 key={s.id}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 16,
 overflow: 'hidden',
 boxShadow: '0 2px 8px rgba(43,33,24,0.04)'
 }}
 >
 {/* Scheme Header Relatable Banner */}
 <div style={{ position: 'relative', height: 120, width: '100%' }}>
 <img
 src={s.image}
 alt={s.name}
 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
 onError={(e) => {
 e.target.src = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80";
 }}
 />
 <div style={{
 position: 'absolute',
 top: 10,
 left: 10,
 background: 'rgba(43,33,24,0.85)',
 backdropFilter: 'blur(4px)',
 color: '#FAF4E6',
 fontSize: 10.5,
 fontWeight: 700,
 padding: '3px 8px',
 borderRadius: 6
 }}>
 {s.category}
 </div>

 <div style={{
 position: 'absolute',
 bottom: 10,
 right: 10,
 background: '#6B8F5C',
 color: '#FFF',
 fontSize: 11,
 fontWeight: 700,
 padding: '3px 8px',
 borderRadius: 6
 }}>
 {s.badge}
 </div>
 </div>

 <div style={{ padding: '14px 16px' }}>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118' }}>
 {s.name}
 </h3>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px 10px', margin: '10px 0', fontSize: 12 }}>
 <div style={{ color: '#6B8F5C', fontWeight: 700 }}>Benefit: {s.subsidy}</div>
 <div style={{ color: '#8A7B68', fontSize: 11, marginTop: 2 }}>{s.ministry}</div>
 </div>

 <p style={{ fontSize: 12.5, color: '#6B5B45', lineHeight: 1.5, marginBottom: 8 }}>
 {s.blurb}
 </p>

 <div style={{ fontSize: 11.5, color: '#8A7B68', marginBottom: 12 }}>
 <strong>Eligibility:</strong> {s.eligibility}
 </div>

 <button
 onClick={() => handleApply(s)}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 boxShadow: '0 2px 8px rgba(43,33,24,0.12)'
 }}
 >
 <Sparkles size={15} color="#D9A441" />
 <span>Apply for Scheme with 1-Tap</span>
 <ArrowRight size={14} />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* 1-TAP SCHEME APPLICATION MODAL */}
 {selectedSchemeForApply && (
 <div style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(0,0,0,0.65)',
 backdropFilter: 'blur(4px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: 16,
 zIndex: 1000
 }}>
 <div style={{
 background: '#FAF4E6',
 border: '2px solid #D9A441',
 borderRadius: 18,
 maxWidth: 440,
 width: '100%',
 padding: 20,
 boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
 maxHeight: '90vh',
 overflowY: 'auto'
 }}>
 {!applySuccess ? (
 <>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
 <div>
 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 Apply for Govt Scheme
 </h3>
 <div style={{ fontSize: 11.5, color: '#6B5B45' }}>
 Auto-verified via Aadhaar e-KYC & Land RoR
 </div>
 </div>
 <button onClick={() => setSelectedSchemeForApply(null)} style={{ background: 'none', border: 'none', color: '#8A7B68' }}>
 <X size={20} />
 </button>
 </div>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px', marginBottom: 14 }}>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118', marginBottom: 2 }}>
 {selectedSchemeForApply.name}
 </div>
 <div style={{ fontSize: 12, color: '#6B8F5C', fontWeight: 600 }}>
 Subsidy / Support: {selectedSchemeForApply.subsidy}
 </div>
 </div>

 {/* Pre-filled Farmer Profile Details */}
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase', marginBottom: 6 }}>
 Verified Farmer Credentials:
 </div>
 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '10px 12px', fontSize: 12, marginBottom: 14 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Applicant Name:</span>
 <strong>{user?.name || "Ramesh Nayak"}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Aadhaar Hash:</span>
 <strong className="mono">{user?.aadhaar || "5432 1098 7654"}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Village & District:</span>
 <strong>{user?.village || "Balipatna"}, Khurda</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Cultivated Plot:</span>
 <strong>{user?.acres || 2.5} Acres ({user?.crop || "Tomato"})</strong>
 </div>
 </div>

 {/* Required Documents Tagging */}
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase', marginBottom: 6 }}>
 Attached Documents for e-Filing:
 </div>
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
 {(selectedSchemeForApply.documentsRequired || ["Aadhaar Copy", "Land Record (RoR)", "Bank Passbook"]).map((d, idx) => (
 <span key={idx} style={{ background: '#EAF3E7', border: '1px solid #6B8F5C', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#2D5A27', fontWeight: 600 }}>
 {d} Auto-Attached
 </span>
 ))}
 </div>

 <div style={{ display: 'flex', gap: 10 }}>
 <button
 onClick={() => setSelectedSchemeForApply(null)}
 style={{
 flex: 1,
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 padding: '11px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 600
 }}
 >
 Cancel
 </button>
 <button
 onClick={handleConfirmApply}
 style={{
 flex: 2,
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6
 }}
 >
 <CheckCircle2 size={16} color="#D9A441" />
 <span>Submit e-Application</span>
 </button>
 </div>
 </>
 ) : (
 /* APPLICATION SUBMISSION SUCCESS */
 <div style={{ textAlign: 'center', padding: '10px 0' }}>
 <div style={{
 width: 56,
 height: 56,
 borderRadius: '50%',
 background: '#EAF3E7',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 margin: '0 auto 12px'
 }}>
 <CheckCircle2 size={32} color="#6B8F5C" />
 </div>

 <h3 className="disp" style={{ fontSize: 20, fontWeight: 700, color: '#2B2118' }}>
 Application Submitted Successfully!
 </h3>
 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 4, marginBottom: 16 }}>
 Your application has been registered with the Block Agriculture Officer.
 </p>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px', marginBottom: 18, textAlign: 'left', fontSize: 12 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#8A7B68' }}>Application Ref No:</span>
 <strong className="mono" style={{ color: '#2B2118' }}>{newApplicationNo}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#8A7B68' }}>Scheme:</span>
 <strong>{selectedSchemeForApply.name}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#8A7B68' }}>Live Status:</span>
 <strong style={{ color: '#D9A441' }}>Under Verification by VAW</strong>
 </div>
 </div>

 <button
 onClick={() => {
 setSelectedSchemeForApply(null);
 setApplySuccess(false);
 setActiveTab('applied');
 }}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '12px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14
 }}
 >
 Track in My Applied Schemes
 </button>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
}

