import React, { useState } from 'react';
import { ArrowLeft, User, Phone, CreditCard, Sparkles, CheckCircle2, PlusCircle, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAllFarmers } from '../../data/farmerRepository';
import RegisterLandModal from '../farmer/RegisterLandModal';

export default function FarmerLogin({ onBack }) {
 const { loginFarmer } = useAuth();
 const { t } = useLanguage();

 const [name, setName] = useState('');
 const [mobile, setMobile] = useState('');
 const [aadhaar, setAadhaar] = useState('');
 const [error, setError] = useState('');
 const [showRegisterModal, setShowRegisterModal] = useState(false);

 // OTP Verification State
 const [showOtpModal, setShowOtpModal] = useState(false);
 const [otpInput, setOtpInput] = useState('');
 const [generatedOtp, setGeneratedOtp] = useState('');
 const [pendingFarmerData, setPendingFarmerData] = useState(null);

 const farmers = getAllFarmers();

 const handleAadhaarChange = (e) => {
 const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
 const formatted = raw.replace(/(\d{4})(?=\d)/g, ' ');
 setAadhaar(formatted);
 };

 const handleMobileChange = (e) => {
 const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
 setMobile(raw);
 };

 const handleSubmit = (e) => {
 e.preventDefault();

 if (!name.trim() && !mobile.trim() && !aadhaar.trim()) {
 setError('Please enter your Mobile Number or Name to proceed.');
 return;
 }

 if (mobile.trim() && mobile.trim().length !== 10) {
 setError('Mobile number should be 10 digits.');
 return;
 }

 setError('');
 
 // Generate simulated 6-digit SMS OTP code
 const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
 setGeneratedOtp(mockOtp);
 setPendingFarmerData({
 name: name.trim() || (mobile ? `Kisan ${mobile.slice(-4)}` : "Ramesh Nayak"),
 mobile: mobile.trim() || "9876543212",
 aadhaar: aadhaar.trim() || "Optional / Unverified"
 });
 setShowOtpModal(true);
 };

 const handleVerifyOtp = (e) => {
 e.preventDefault();
 if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '123456') {
 setError('Invalid OTP code. Use test OTP: ' + generatedOtp);
 return;
 }

 setShowOtpModal(false);
 if (pendingFarmerData) {
 loginFarmer(pendingFarmerData);
 }
 };

 const fillDemo = (farmer) => {
 setName(farmer.name);
 setMobile(farmer.mobile);
 setAadhaar(farmer.aadhaar || '');
 setError('');
 };

 return (
 <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 48px' }}>
 
 {/* Registration Modal Popup */}
 {showRegisterModal && (
 <RegisterLandModal onClose={() => setShowRegisterModal(false)} />
 )}

 {/* Simulated 6-Digit SMS OTP Verification Security Modal */}
 {showOtpModal && (
 <div style={{
 position: 'fixed',
 top: 0, left: 0, right: 0, bottom: 0,
 zIndex: 2500,
 background: 'rgba(43,33,24,0.85)',
 backdropFilter: 'blur(6px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px'
 }}>
 <div style={{
 width: '100%',
 maxWidth: 380,
 background: '#FAF4E6',
 border: '1.5px solid #D9A441',
 borderRadius: 16,
 padding: '24px 20px',
 textAlign: 'center',
 boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
 }}>
 <div style={{ display: 'inline-flex', background: 'rgba(217,164,65,0.2)', color: '#D9A441', padding: 12, borderRadius: '50%', marginBottom: 10 }}>
 <ShieldCheck size={32} />
 </div>

 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118', margin: '0 0 4px' }}>
 Security SMS Verification
 </h3>
 <p style={{ fontSize: 12, color: '#6B5B45', marginBottom: 14 }}>
 Sent 6-digit OTP code to <strong>+91 {pendingFarmerData?.mobile}</strong>
 </p>

 <div style={{ background: '#2B2118', color: '#10b981', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', fontWeight: 700, marginBottom: 16 }}>
 Test SMS OTP Code: {generatedOtp}
 </div>

 <form onSubmit={handleVerifyOtp}>
 <input
 type="text"
 maxLength={6}
 value={otpInput}
 onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
 placeholder="Enter 6-digit OTP"
 className="mono"
 style={{
 width: '100%',
 padding: '12px',
 borderRadius: 10,
 border: '1.5px solid #D9A441',
 background: '#FFFDF9',
 fontSize: 18,
 textAlign: 'center',
 letterSpacing: 6,
 fontWeight: 700,
 marginBottom: 14
 }}
 />

 <button
 type="submit"
 style={{
 width: '100%',
 background: '#D9A441',
 color: '#2B2118',
 border: 'none',
 borderRadius: 10,
 padding: '12px',
 fontSize: 14,
 fontWeight: 700,
 cursor: 'pointer'
 }}
 >
 Verify OTP & Access Portal
 </button>
 </form>
 </div>
 </div>
 )}

 <button
 onClick={onBack}
 style={{
 background: 'none',
 border: 'none',
 display: 'flex',
 alignItems: 'center',
 gap: 6,
 color: '#6B5B45',
 fontSize: 14,
 marginBottom: 20,
 cursor: 'pointer'
 }}
 >
 <ArrowLeft size={18} />
 <span>Back to Portal Selection</span>
 </button>

 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 16,
 padding: '24px 20px',
 boxShadow: '0 4px 16px rgba(43,33,24,0.06)'
 }}>
 <div style={{
 position: 'relative',
 height: 110,
 borderRadius: 12,
 overflow: 'hidden',
 marginBottom: 16
 }}>
 <img
 src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80"
 alt="Kisan Login"
 style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
 />
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'linear-gradient(to top, rgba(43,33,24,0.9) 0%, rgba(43,33,24,0.3) 100%)',
 display: 'flex',
 alignItems: 'flex-end',
 padding: 12
 }}>
 <div>
 <span style={{ background: '#D9A441', color: '#2B2118', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
 Flexible Kisan Access
 </span>
 <h2 className="disp" style={{ fontSize: 20, fontWeight: 700, color: '#FAF4E6', marginTop: 2 }}>
 {t('farmerLoginTitle')}
 </h2>
 </div>
 </div>
 </div>

 <p style={{ fontSize: 13, color: '#6B5B45', marginBottom: 18, textAlign: 'center', lineHeight: 1.4 }}>
 Enter your Mobile Number or Name to access your farm advisory & satellite telemetry.
 </p>

 {error && (
 <div style={{
 background: '#FDE8E8',
 border: '1px solid #F05252',
 color: '#B8492E',
 borderRadius: 8,
 padding: '10px 12px',
 fontSize: 13,
 marginBottom: 16
 }}>
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 
 <div>
 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2118', marginBottom: 6 }}>
 {t('mobileNumber')} (10 Digits)
 </label>
 <div style={{ position: 'relative' }}>
 <Phone size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
 <input
 type="tel"
 value={mobile}
 onChange={handleMobileChange}
 placeholder="e.g. 9876543212"
 className="mono"
 style={{
 width: '100%',
 padding: '11px 12px 11px 40px',
 borderRadius: 10,
 border: '1px solid #D8CBA8',
 background: '#FFFDF9',
 fontSize: 14,
 color: '#2B2118'
 }}
 />
 </div>
 </div>

 <div>
 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2118', marginBottom: 6 }}>
 {t('fullName')}
 </label>
 <div style={{ position: 'relative' }}>
 <User size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="e.g. Ramesh Nayak"
 style={{
 width: '100%',
 padding: '11px 12px 11px 40px',
 borderRadius: 10,
 border: '1px solid #D8CBA8',
 background: '#FFFDF9',
 fontSize: 14,
 color: '#2B2118'
 }}
 />
 </div>
 </div>

 <div>
 <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8A7B68', marginBottom: 6 }}>
 {t('aadhaarNumber')} <span style={{ fontSize: 11, color: '#6B8F5C' }}>(Optional)</span>
 </label>
 <div style={{ position: 'relative' }}>
 <CreditCard size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
 <input
 type="text"
 value={aadhaar}
 onChange={handleAadhaarChange}
 placeholder="12-digit Aadhaar (Optional)"
 className="mono"
 style={{
 width: '100%',
 padding: '11px 12px 11px 40px',
 borderRadius: 10,
 border: '1px solid #D8CBA8',
 background: '#FFFDF9',
 fontSize: 14,
 letterSpacing: 1,
 color: '#2B2118'
 }}
 />
 </div>
 </div>

 <button
 type="submit"
 style={{
 marginTop: 6,
 background: '#D9A441',
 color: '#2B2118',
 padding: '13px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 15,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 boxShadow: '0 4px 12px rgba(217,164,65,0.3)',
 cursor: 'pointer'
 }}
 >
 <CheckCircle2 size={18} />
 <span>{t('loginBtn')}</span>
 </button>
 </form>

 {/* Register New Land / Farmer Button */}
 <div style={{ marginTop: 16, textAlign: 'center' }}>
 <button
 onClick={() => setShowRegisterModal(true)}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#D9A441',
 border: '1px solid #D9A441',
 borderRadius: 10,
 padding: '12px',
 fontSize: 13.5,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 cursor: 'pointer'
 }}
 >
 <PlusCircle size={18} />
 <span> New Farmer? Register Land Plot (Form / Voice)</span>
 </button>
 </div>

 {/* Demo profiles for quick testing */}
 <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #D8CBA8' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#8A7B68', marginBottom: 10, textTransform: 'uppercase' }}>
 <Sparkles size={14} color="#D9A441" />
 <span>{t('demoLogins')}</span>
 </div>

 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
 {farmers.slice(0, 3).map((f) => (
 <button
 key={f.id}
 onClick={() => fillDemo(f)}
 style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 8,
 padding: '8px 12px',
 textAlign: 'left',
 fontSize: 12,
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 cursor: 'pointer'
 }}
 >
 <div>
 <strong>{f.name}</strong> ({f.crop}, {f.village})
 </div>
 <span style={{ color: '#D9A441', fontWeight: 600 }}>Fill Data</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
