import React, { useState } from 'react';
import {
 AlertTriangle, TrendingDown, Calendar, Award, Sprout, Tractor,
 CloudSun, ChevronRight, Droplets, Sun, ShieldCheck, Sparkles, FileText, CheckCircle2,
 Mic, MapPin, Grid, PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import TopBar from '../common/TopBar';
import Gauge, { riskColor, riskLabel } from '../common/Gauge';
import UrgentLoanBanner from '../common/UrgentLoanBanner';
import GlobalSearchBar from '../search/GlobalSearchBar';
import { CURRENT_WEATHER } from '../../data/weatherData';
import FarmerNdviVoiceView from './FarmerNdviVoiceView';
import RegisterLandModal from './RegisterLandModal';

export default function FarmerHome({ onPickTopic }) {
 const { user } = useAuth();
 const { t } = useLanguage();
 const [activeTab, setActiveTab] = useState('voiceNdvi'); // 'voiceNdvi' | 'allTools'
 const [showRegisterModal, setShowRegisterModal] = useState(false);

 const score = user ? user.score : 68;
 const loans = user ? user.loans : [];
 const appliedSchemes = user && user.appliedSchemes ? user.appliedSchemes : [];
 const rentedMachines = user && user.rentedMachines ? user.rentedMachines : [];

 const TOPICS = [
 {
 id: 'distress',
 title: t('topicDistress'),
 sub: t('topicDistressSub'),
 icon: AlertTriangle,
 color: '#B8492E',
 image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'weather',
 title: t('topicWeather'),
 sub: t('topicWeatherSub'),
 icon: CloudSun,
 color: '#2B2118',
 image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'fertilizer',
 title: t('topicFertilizer'),
 sub: t('topicFertilizerSub'),
 icon: Sprout,
 color: '#6B8F5C',
 image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'machinery',
 title: t('topicMachinery'),
 sub: t('topicMachinerySub'),
 icon: Tractor,
 color: '#D9A441',
 badge: rentedMachines.length > 0 ? `${rentedMachines.length} Rented` : null,
 image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'schemes',
 title: t('topicSchemes'),
 sub: t('topicSchemesSub'),
 icon: Award,
 color: '#6B8F5C',
 badge: appliedSchemes.length > 0 ? `${appliedSchemes.length} Applied` : null,
 image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'market',
 title: t('topicMarket'),
 sub: t('topicMarketSub'),
 icon: TrendingDown,
 color: '#C97D34',
 image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80"
 },
 {
 id: 'loans',
 title: t('topicLoans'),
 sub: t('topicLoansSub'),
 icon: Calendar,
 color: '#8A6D3B',
 image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80"
 }
 ];

 return (
 <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' }}>
 <TopBar title={t('appTitle')} />

 {/* Registration Modal */}
 {showRegisterModal && (
 <RegisterLandModal onClose={() => setShowRegisterModal(false)} />
 )}

 {/* Segmented View Toggle & Add New Land Button */}
 <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
 <div style={{
 flex: 1,
 display: 'flex',
 background: '#FAF4E6',
 border: '1.5px solid #D8CBA8',
 borderRadius: 14,
 padding: 3,
 boxShadow: '0 2px 8px rgba(43,33,24,0.06)'
 }}>
 <button
 onClick={() => setActiveTab('voiceNdvi')}
 style={{
 flex: 1,
 background: activeTab === 'voiceNdvi' ? '#2B2118' : 'transparent',
 color: activeTab === 'voiceNdvi' ? '#D9A441' : '#6B5B45',
 border: 'none',
 borderRadius: 10,
 padding: '8px 10px',
 fontSize: 12,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 4,
 cursor: 'pointer'
 }}
 >
 <Mic size={14} color={activeTab === 'voiceNdvi' ? '#D9A441' : '#6B5B45'} />
 <span>Voice & NDVI</span>
 </button>

 <button
 onClick={() => setActiveTab('allTools')}
 style={{
 flex: 1,
 background: activeTab === 'allTools' ? '#2B2118' : 'transparent',
 color: activeTab === 'allTools' ? '#D9A441' : '#6B5B45',
 border: 'none',
 borderRadius: 10,
 padding: '8px 10px',
 fontSize: 12,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 4,
 cursor: 'pointer'
 }}
 >
 <Grid size={14} color={activeTab === 'allTools' ? '#D9A441' : '#6B5B45'} />
 <span>All Services</span>
 </button>
 </div>

 {/* Add Land Plot Button */}
 <button
 onClick={() => setShowRegisterModal(true)}
 style={{
 background: '#2B2118',
 color: '#D9A441',
 border: 'none',
 borderRadius: 14,
 padding: '0 12px',
 fontSize: 12,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 cursor: 'pointer',
 boxShadow: '0 2px 8px rgba(43,33,24,0.1)'
 }}
 >
 <PlusCircle size={15} color="#D9A441" />
 <span>Add Land</span>
 </button>
 </div>

 {/* VIEW 1: Voice & NDVI Survey Mobile View */}
 {activeTab === 'voiceNdvi' && (
 <FarmerNdviVoiceView />
 )}

 {/* VIEW 2: Classic Dashboard & All Services Menu */}
 {activeTab === 'allTools' && (
 <>
 {/* Relatable Indian Agriculture Hero Header */}
 <div style={{
 position: 'relative',
 borderRadius: 18,
 overflow: 'hidden',
 marginBottom: 16,
 boxShadow: '0 6px 20px rgba(43,33,24,0.14)'
 }}>
 <img
 src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
 alt="Indian Agriculture Fields"
 style={{ width: '100%', height: 130, objectFit: 'cover', filter: 'brightness(0.75)' }}
 />
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'linear-gradient(to right, rgba(43,33,24,0.9) 0%, rgba(43,33,24,0.4) 100%)',
 padding: '16px 18px',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'space-between'
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <span style={{
 background: '#D9A441',
 color: '#2B2118',
 fontSize: 10,
 fontWeight: 800,
 padding: '2px 8px',
 borderRadius: 4,
 textTransform: 'uppercase'
 }}>
 Verified Kisan Profile
 </span>
 <h2 className="disp" style={{ color: '#FAF4E6', fontSize: 20, fontWeight: 700, marginTop: 4 }}>
 {user?.name || "Ramesh Nayak"}
 </h2>
 </div>
 <div style={{
 background: 'rgba(255,255,255,0.15)',
 backdropFilter: 'blur(4px)',
 padding: '4px 10px',
 borderRadius: 20,
 fontSize: 11,
 color: '#FAF4E6',
 fontWeight: 600
 }}>
 {user?.village || "Balipatna"}, Khurda
 </div>
 </div>

 <div style={{ display: 'flex', gap: 14, color: '#D8CBA8', fontSize: 12 }}>
 <span>Crop: <strong style={{ color: '#FAF4E6' }}>{user?.crop || "Tomato"}</strong></span>
 <span>Land: <strong style={{ color: '#FAF4E6' }}>{user?.acres || 2.5} Acres</strong></span>
 <span>Land ID: <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{user?.landId || "LND-OD-1024"}</strong></span>
 </div>
 </div>
 </div>

 {/* Distress Meter Hero Card */}
 <div
 style={{
 background: '#2B2118',
 borderRadius: 16,
 padding: '16px 18px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 14,
 boxShadow: '0 6px 20px rgba(43,33,24,0.18)'
 }}
 >
 <div>
 <div style={{ color: '#D8CBA8', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>
 {t('distressScoreLabel')}
 </div>
 <div className="mono" style={{ color: riskColor(score), fontSize: 22, fontWeight: 700, marginTop: 4 }}>
 {riskLabel(score)} • {score}/100
 </div>
 <button
 onClick={() => onPickTopic('distress')}
 style={{
 background: 'rgba(217, 164, 65, 0.2)',
 color: '#D9A441',
 border: '1px solid #D9A441',
 borderRadius: 6,
 padding: '5px 9px',
 fontSize: 11,
 fontWeight: 600,
 marginTop: 8,
 display: 'inline-flex',
 alignItems: 'center',
 gap: 4
 }}
 >
 <span>View Risk Radar</span>
 <ChevronRight size={12} />
 </button>
 </div>

 <Gauge score={score} size={105} />
 </div>

 {/* Urgent Loan Due Date Flash Warning Banner */}
 <UrgentLoanBanner loans={loans} onActionClick={onPickTopic} />

 {/* APPLIED SCHEMES QUICK STATUS CARD */}
 {appliedSchemes.length > 0 && (
 <div
 onClick={() => onPickTopic('schemes')}
 className="card-hover"
 style={{
 background: '#FAF4E6',
 border: '1.5px solid #D9A441',
 borderRadius: 14,
 padding: '12px 14px',
 marginBottom: 14,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 cursor: 'pointer'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{ background: 'rgba(217, 164, 65, 0.2)', borderRadius: 10, padding: 8 }}>
 <Award size={22} color="#D9A441" />
 </div>
 <div>
 <div style={{ fontWeight: 700, fontSize: 13.5, color: '#2B2118', display: 'flex', alignItems: 'center', gap: 6 }}>
 <span>{appliedSchemes.length} Govt Scheme(s) Active / Applied</span>
 <span style={{ background: '#6B8F5C', color: '#FFF', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
 Live DBT
 </span>
 </div>
 <div style={{ fontSize: 12, color: '#6B5B45', marginTop: 2 }}>
 Latest: <strong>{appliedSchemes[0].schemeName.split('(')[0]}</strong> — {appliedSchemes[0].status}
 </div>
 </div>
 </div>

 <ChevronRight size={18} color="#8A7B68" />
 </div>
 )}

 {/* Weather Snapshot Quick Widget */}
 <div
 onClick={() => onPickTopic('weather')}
 className="card-hover"
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 14,
 padding: '12px 14px',
 marginBottom: 16,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 cursor: 'pointer'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{ background: 'rgba(217, 164, 65, 0.15)', borderRadius: 10, padding: 8 }}>
 <Sun size={22} color="#D9A441" />
 </div>
 <div>
 <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>
 {(user?.village ? user.village + ' Village' : user?.district || 'Balipatna')} • 31°C
 </div>
 <div style={{ fontSize: 12, color: '#B8492E', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
 <Droplets size={12} /> Monsoon Deficit: {user?.rainfallDeficit || 38}% (Dry Spell)
 </div>
 </div>
 </div>

 <ChevronRight size={18} color="#8A7B68" />
 </div>

 {/* Universal AI Search Omnibar */}
 <GlobalSearchBar onNavigateTopic={onPickTopic} />

 {/* Topics Grid */}
 <div className="disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2B2118' }}>
 {t('whatDoYouNeed')}
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 {TOPICS.map((tItem) => {
 const Icon = tItem.icon;
 return (
 <button
 key={tItem.id}
 onClick={() => onPickTopic(tItem.id)}
 className="card-hover"
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 14,
 overflow: 'hidden',
 textAlign: 'left',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '0 2px 8px rgba(43,33,24,0.04)'
 }}
 >
 <div style={{ position: 'relative', height: 75, width: '100%' }}>
 <img
 src={tItem.image}
 alt={tItem.title}
 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
 />
 <div style={{
 position: 'absolute',
 top: 8,
 left: 8,
 background: 'rgba(43,33,24,0.85)',
 borderRadius: 8,
 padding: 6,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}>
 <Icon size={16} color={tItem.color === '#2B2118' ? '#D9A441' : tItem.color} />
 </div>

 {tItem.badge && (
 <div style={{
 position: 'absolute',
 top: 8,
 right: 8,
 background: '#6B8F5C',
 color: '#FFF',
 fontSize: 10,
 fontWeight: 700,
 padding: '2px 6px',
 borderRadius: 4
 }}>
 {tItem.badge}
 </div>
 )}
 </div>

 <div style={{ padding: '10px 12px 12px' }}>
 <div className="disp" style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>
 {tItem.title}
 </div>
 <div style={{ fontSize: 11, color: '#6B5B45', marginTop: 2, lineHeight: 1.3 }}>
 {tItem.sub}
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </>
 )}
 </div>
 );
}
