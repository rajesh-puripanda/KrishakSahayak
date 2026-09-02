import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageModal() {
 const { showLanguageModal, setShowLanguageModal } = useAuth();
 const { lang, setLang, languages, t } = useLanguage();

 if (!showLanguageModal) return null;

 return (
 <div style={{
 position: 'fixed',
 inset: 0,
 background: 'rgba(43, 33, 24, 0.7)',
 backdropFilter: 'blur(3px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: 9999,
 padding: '20px'
 }}>
 <div style={{
 background: '#FAF4E6',
 border: '2px solid #D8CBA8',
 borderRadius: 18,
 maxWidth: 440,
 width: '100%',
 padding: '24px 20px',
 boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
 textAlign: 'center'
 }}>
 <div style={{
 background: 'rgba(217, 164, 65, 0.2)',
 borderRadius: '50%',
 width: 54,
 height: 54,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 margin: '0 auto 12px'
 }}>
 <Globe size={28} color="#D9A441" />
 </div>

 <h3 className="disp" style={{ fontSize: 22, fontWeight: 700, color: '#2B2118' }}>
 {t('selectLangTitle')}
 </h3>

 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 4, marginBottom: 20 }}>
 {t('selectLangSub')}
 </p>

 <div style={{
 display: 'grid',
 gridTemplateColumns: '1fr 1fr',
 gap: 10,
 marginBottom: 20
 }}>
 {languages.map((l) => {
 const isSelected = lang.code === l.code;
 return (
 <button
 key={l.code}
 onClick={() => setLang(l)}
 style={{
 background: isSelected ? '#D9A441' : '#FFFDF9',
 color: '#2B2118',
 border: `2px solid ${isSelected ? '#B88422' : '#D8CBA8'}`,
 borderRadius: 12,
 padding: '12px 8px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 fontWeight: 600,
 fontSize: 14,
 transition: 'all 0.15s ease'
 }}
 >
 <div style={{ textAlign: 'left', paddingLeft: 6 }}>
 <div style={{ fontWeight: 700 }}>{l.native}</div>
 <div style={{ fontSize: 11, color: isSelected ? '#3A2E22' : '#8A7B68' }}>{l.label}</div>
 </div>
 {isSelected && <Check size={18} color="#2B2118" style={{ marginRight: 6 }} />}
 </button>
 );
 })}
 </div>

 <button
 onClick={() => setShowLanguageModal(false)}
 style={{
 width: '100%',
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '13px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 15
 }}
 >
 {t('continueBtn')}
 </button>
 </div>
 </div>
 );
}
