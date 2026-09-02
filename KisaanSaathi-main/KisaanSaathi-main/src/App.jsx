import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

// Auth Components
import RoleSelect from './components/auth/RoleSelect';
import FarmerLogin from './components/auth/FarmerLogin';
import OfficerLogin from './components/auth/OfficerLogin';
import LanguageModal from './components/auth/LanguageModal';

// Farmer Components
import FarmerHome from './components/farmer/FarmerHome';
import WeatherView from './components/farmer/WeatherView';
import DistressView from './components/farmer/DistressView';
import MandiView from './components/farmer/MandiView';
import LoansView from './components/farmer/LoansView';
import SchemesView from './components/farmer/SchemesView';
import FertilizerAdvisor from './components/farmer/FertilizerAdvisor';
import MachineryView from './components/farmer/MachineryView';

// Officer Components
import OfficerDashboard from './components/officer/OfficerDashboard';
import FarmerDetailModal from './components/officer/FarmerDetailModal';

export default function App() {
 const { role, user } = useAuth();
 const { lang } = useLanguage();

 // Navigation states
 const [selectedRoleForLogin, setSelectedRoleForLogin] = useState(null);
 const [farmerTopic, setFarmerTopic] = useState(null); // 'distress' | 'weather' | 'market' | 'loans' | 'schemes' | 'fertilizer' | 'machinery'
 const [selectedFarmerForOfficer, setSelectedFarmerForOfficer] = useState(null);

 // 1. Role Selection Splash Screen (if not logged in and no portal chosen)
 if (!role && !selectedRoleForLogin) {
 return (
 <main style={{ minHeight: '100vh', background: '#F2EAD8' }}>
 <RoleSelect onSelectRole={setSelectedRoleForLogin} />
 </main>
 );
 }

 // 2. Farmer Login Screen
 if (!role && selectedRoleForLogin === 'farmer') {
 return (
 <main style={{ minHeight: '100vh', background: '#F2EAD8' }}>
 <FarmerLogin onBack={() => setSelectedRoleForLogin(null)} />
 </main>
 );
 }

 // 3. Officer Login Screen
 if (!role && selectedRoleForLogin === 'officer') {
 return (
 <main style={{ minHeight: '100vh', background: '#F2EAD8' }}>
 <OfficerLogin onBack={() => setSelectedRoleForLogin(null)} />
 </main>
 );
 }

 // 4. Authenticated Farmer Portal
 if (role === 'farmer') {
 return (
 <main style={{ minHeight: '100vh', background: '#F2EAD8' }}>
 <LanguageModal />

 {!farmerTopic && (
 <FarmerHome onPickTopic={setFarmerTopic} />
 )}

 {farmerTopic === 'weather' && (
 <WeatherView onBack={() => setFarmerTopic(null)} />
 )}

 {farmerTopic === 'distress' && (
 <DistressView
 farmer={user}
 onBack={() => setFarmerTopic(null)}
 onNavigate={(topic) => setFarmerTopic(topic)}
 />
 )}

 {farmerTopic === 'market' && (
 <MandiView onBack={() => setFarmerTopic(null)} />
 )}

 {farmerTopic === 'loans' && (
 <LoansView farmer={user} onBack={() => setFarmerTopic(null)} />
 )}

 {farmerTopic === 'schemes' && (
 <SchemesView onBack={() => setFarmerTopic(null)} />
 )}

 {farmerTopic === 'fertilizer' && (
 <FertilizerAdvisor onBack={() => setFarmerTopic(null)} />
 )}

 {farmerTopic === 'machinery' && (
 <MachineryView onBack={() => setFarmerTopic(null)} />
 )}
 </main>
 );
 }

 // 5. Authenticated Officer Portal
 if (role === 'officer') {
 return (
 <main style={{ minHeight: '100vh', background: '#F2EAD8' }}>
 <LanguageModal />

 {!selectedFarmerForOfficer ? (
 <OfficerDashboard onSelectFarmer={setSelectedFarmerForOfficer} />
 ) : (
 <FarmerDetailModal
 farmer={selectedFarmerForOfficer}
 onBack={() => setSelectedFarmerForOfficer(null)}
 />
 )}
 </main>
 );
 }

 return null;
}
