import React from 'react';
import { ArrowLeft, Globe, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function TopBar({ title, onBack, rightAction }) {
 const { user, role, logout, setShowLanguageModal } = useAuth();
 const { lang } = useLanguage();

 return (
 <header style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 16,
 paddingBottom: 10,
 borderBottom: '1px solid rgba(216, 203, 168, 0.6)'
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 {onBack && (
 <button
 onClick={onBack}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 8,
 padding: '6px 8px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 color: '#2B2118'
 }}
 title="Go Back"
 >
 <ArrowLeft size={18} />
 </button>
 )}
 <div>
 <h1 className="disp" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>
 {title}
 </h1>
 {user && (
 <div style={{ fontSize: 12, color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
 <User size={11} /> {user.name} {user.village ? `• ${user.village}` : `• ${user.district}`}
 </div>
 )}
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 {/* Language selector toggle */}
 <button
 onClick={() => setShowLanguageModal(true)}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 8,
 padding: '5px 9px',
 fontSize: 12,
 fontWeight: 600,
 color: '#2B2118',
 display: 'flex',
 alignItems: 'center',
 gap: 5
 }}
 title="Change Language"
 >
 <Globe size={14} color="#D9A441" />
 <span>{lang.native || lang.label}</span>
 </button>

 {rightAction}

 {/* Logout button */}
 <button
 onClick={logout}
 style={{
 background: 'transparent',
 border: '1px solid #D8CBA8',
 borderRadius: 8,
 padding: '5px 7px',
 color: '#B8492E',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}
 title="Log Out"
 >
 <LogOut size={16} />
 </button>
 </div>
 </header>
 );
}
