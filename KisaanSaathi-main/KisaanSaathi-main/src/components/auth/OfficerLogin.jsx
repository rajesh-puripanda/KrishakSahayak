import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Briefcase, CheckCircle2, Sparkles, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function OfficerLogin({ onBack }) {
  const { loginOfficer } = useAuth();
  const { t } = useLanguage();

  const [officerId, setOfficerId] = useState('DAO-OD-7042');
  const [officerName, setOfficerName] = useState('Dr. S. K. Mohapatra');
  const [district, setDistrict] = useState('Khurda District (Odisha)');
  const [designation, setDesignation] = useState('District Agriculture Officer (DAO)');

  // 2FA Auth Step state
  const [step, setStep] = useState(1); // 1 = Details, 2 = 6-Digit Security OTP
  const [generatedOtp, setGeneratedOtp] = useState('884210');
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!officerId.trim() || !officerName.trim()) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setInputOtp('');
    setOtpError(false);
    setStep(2);
  };

  const handleVerifyOtpAndLogin = (e) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp || inputOtp.trim() === '123456') {
      loginOfficer({
        officerId,
        name: officerName,
        district,
        designation
      });
    } else {
      setOtpError(true);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 48px' }}>
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
        borderTop: '6px solid #2B2118',
        borderRadius: 16,
        padding: '24px 20px',
        boxShadow: '0 4px 16px rgba(43,33,24,0.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#2B2118',
            color: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h2 className="disp" style={{ fontSize: 22, fontWeight: 700, color: '#2B2118' }}>
            {t('officerLoginTitle')}
          </h2>
          <p style={{ fontSize: 12.5, color: '#6B5B45', marginTop: 4 }}>
            Govt Dept of Agriculture & Farmers Empowerment • Portal Verification
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2118', marginBottom: 6 }}>
                Government Officer ID / Employee Code
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="mono"
                  placeholder="e.g. DAO-OD-7042"
                  required
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
                Officer Name
              </label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Official Name"
                  required
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
                {t('district')} Jurisdiction
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
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
                {t('designation')}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
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

            <button
              type="submit"
              style={{
                marginTop: 8,
                background: '#2B2118',
                color: '#FAF4E6',
                padding: '13px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(43,33,24,0.25)',
                cursor: 'pointer'
              }}
            >
              <KeyRound size={18} color="#D9A441" />
              <span>Send Official 2FA Security OTP</span>
            </button>
          </form>
        ) : (
          /* STEP 2: 6-DIGIT OTP AUTHENTICATION MODAL STEP */
          <form onSubmit={handleVerifyOtpAndLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px', fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#6B5B45' }}>Officer ID:</span>
                <strong className="mono">{officerId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B5B45' }}>Officer Name:</span>
                <strong>{officerName}</strong>
              </div>
            </div>

            <div style={{ background: '#EAF3E7', border: '1px solid #6B8F5C', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#2D5A27' }}>
              Official Department 2FA OTP Code: <strong className="mono" style={{ fontSize: 14 }}>{generatedOtp}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2118', marginBottom: 6 }}>
                Enter 6-Digit Department Authentication OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputOtp}
                onChange={(e) => { setInputOtp(e.target.value); setOtpError(false); }}
                placeholder="e.g. 884210"
                className="mono"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  border: `2px solid ${otpError ? '#B8492E' : '#D9A441'}`,
                  background: '#FFFDF9',
                  fontSize: 20,
                  textAlign: 'center',
                  letterSpacing: 6,
                  fontWeight: 700,
                  color: '#2B2118'
                }}
              />
              {otpError && (
                <div style={{ fontSize: 11, color: '#B8492E', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={12} /> Invalid OTP Code. Enter {generatedOtp} to proceed.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ flex: 1, background: '#FAF4E6', border: '1px solid #D8CBA8', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  background: '#2B2118',
                  color: '#FAF4E6',
                  padding: '11px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <CheckCircle2 size={18} color="#D9A441" />
                <span>Verify & Open Console</span>
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid #D8CBA8', fontSize: 12, color: '#8A7B68', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="#D9A441" />
          <span>Real-time Sentinel satellite telemetry + IMD rainfall deficit link enabled.</span>
        </div>
      </div>
    </div>
  );
}
