import React from 'react';
import { Wheat, ShieldCheck, Sprout, ChevronRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function RoleSelect({ onSelectRole }) {
 const { t } = useLanguage();

 return (
 <div style={{
 minHeight: '100vh',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '24px 20px 40px',
 textAlign: 'center',
 maxWidth: 500,
 margin: '0 auto'
 }}>
 {/* Relatable Agriculture Hero Card */}
 <div style={{
 position: 'relative',
 width: '100%',
 height: 140,
 borderRadius: 20,
 overflow: 'hidden',
 marginBottom: 20,
 boxShadow: '0 6px 20px rgba(43,33,24,0.12)'
 }}>
 <img
 src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
 alt="Krishi Sahayak Agriculture"
 style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
 />
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'linear-gradient(to bottom, rgba(43,33,24,0.2) 0%, rgba(43,33,24,0.85) 100%)',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'flex-end',
 padding: 14
 }}>
 <div style={{
 background: '#FAF4E6',
 borderRadius: '50%',
 width: 44,
 height: 44,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 marginBottom: 6,
 boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
 }}>
 <Wheat size={24} color="#D9A441" />
 </div>
 <span style={{ color: '#D9A441', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
 Govt Agri-Intelligence & Advisory
 </span>
 </div>
 </div>

 <h1 className="disp" style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: '#2B2118' }}>
 {t('appTitle')}
 </h1>

 <p style={{ color: '#6B5B45', marginTop: 6, marginBottom: 28, fontSize: 14, lineHeight: 1.5 }}>
 {t('appTagline')}
 </p>

 {/* Role Selection Cards */}
 <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
 <button
 onClick={() => onSelectRole('farmer')}
 className="card-hover"
 style={{
 background: '#FAF4E6',
 border: '1.5px solid #D8CBA8',
 borderLeft: '6px solid #D9A441',
 borderRadius: 16,
 padding: '18px 16px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 boxShadow: '0 2px 10px rgba(43,33,24,0.04)'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
 <div style={{
 background: 'rgba(217, 164, 65, 0.18)',
 borderRadius: 12,
 padding: 12,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}>
 <Sprout size={28} color="#D9A441" />
 </div>
 <div>
 <div className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 {t('farmerRoleTitle')}
 </div>
 <div style={{ fontSize: 12.5, color: '#6B5B45', marginTop: 3, lineHeight: 1.3 }}>
 {t('farmerRoleSub')}
 </div>
 </div>
 </div>
 <ChevronRight size={20} color="#8A7B68" />
 </button>

 <button
 onClick={() => onSelectRole('officer')}
 className="card-hover"
 style={{
 background: '#FAF4E6',
 border: '1.5px solid #D8CBA8',
 borderLeft: '6px solid #2B2118',
 borderRadius: 16,
 padding: '18px 16px',
 textAlign: 'left',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 boxShadow: '0 2px 10px rgba(43,33,24,0.04)'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
 <div style={{
 background: 'rgba(43, 33, 24, 0.1)',
 borderRadius: 12,
 padding: 12,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}>
 <ShieldCheck size={28} color="#2B2118" />
 </div>
 <div>
 <div className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 {t('officerRoleTitle')}
 </div>
 <div style={{ fontSize: 12.5, color: '#6B5B45', marginTop: 3, lineHeight: 1.3 }}>
 {t('officerRoleSub')}
 </div>
 </div>
 </div>
 <ChevronRight size={20} color="#8A7B68" />
 </button>
 </div>

 {/* Trust Badges Footer */}
 <div style={{
 marginTop: 32,
 padding: '12px 16px',
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 width: '100%',
 display: 'flex',
 justifyContent: 'space-around',
 fontSize: 11,
 color: '#6B5B45'
 }}>
 <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
 <CheckCircle2 size={13} color="#6B8F5C" /> IMD Satellite Telemetry
 </span>
 <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
 <CheckCircle2 size={13} color="#6B8F5C" /> AGMARKNET Feeds
 </span>
 <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
 <CheckCircle2 size={13} color="#6B8F5C" /> 8 Indian Languages
 </span>
 </div>
 </div>
 );
}

