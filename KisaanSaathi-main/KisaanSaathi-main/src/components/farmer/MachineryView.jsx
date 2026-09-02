import React, { useState } from 'react';
import {
 Tractor, Phone, MapPin, CheckCircle2, ShieldCheck, AlertTriangle,
 Plus, Minus, ShoppingCart, Calendar, Info, Sparkles, X, ChevronRight,
 TrendingDown, Check, ArrowRight, Clock, User
} from 'lucide-react';
import { MACHINERY, calculateMachineryExpenditureAndROI } from '../../data/machineryData';
import TopBar from '../common/TopBar';
import Chip from '../common/Chip';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function MachineryView({ onBack }) {
 const { t } = useLanguage();
 const { user, bookMachinery } = useAuth();

 const farmerAcres = user ? user.acres || 2.5 : 2.5;
 const farmerCrop = user ? user.crop || "Tomato" : "Tomato";

 const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'rentals'
 const [category, setCategory] = useState('All');
 
 // Selected machines state: { [machineId]: durationDays }
 const [selectedFleet, setSelectedFleet] = useState({
 m1: 1 // default select Rotavator for quick preview
 });

 const [showCheckoutModal, setShowCheckoutModal] = useState(false);
 const [bookingSuccess, setBookingSuccess] = useState(false);
 const [lastBookingDetails, setLastBookingDetails] = useState(null);

 const categories = ['All', 'Tillage', 'Tractor', 'Harvest', 'Spraying', 'Sowing'];
 const filtered = category === 'All' ? MACHINERY : MACHINERY.filter(m => m.category === category);
 const sorted = [...filtered].sort((a, b) => a.pricePerDay - b.pricePerDay);

 // Build array of selected objects for ROI & calculation engine
 const selectedList = Object.entries(selectedFleet)
 .filter(([_, days]) => days > 0)
 .map(([id, days]) => {
 const machine = MACHINERY.find(m => m.id === id);
 return machine ? { machine, durationDays: days } : null;
 })
 .filter(Boolean);

 const roiAnalysis = calculateMachineryExpenditureAndROI(selectedList, farmerAcres, farmerCrop);

 const toggleSelectMachine = (machineId) => {
 setSelectedFleet(prev => {
 const next = { ...prev };
 if (next[machineId]) {
 delete next[machineId];
 } else {
 next[machineId] = 1;
 }
 return next;
 });
 };

 const updateDuration = (machineId, delta) => {
 setSelectedFleet(prev => {
 const current = prev[machineId] || 1;
 const updated = Math.max(1, Math.min(15, current + delta));
 return { ...prev, [machineId]: updated };
 });
 };

 const handleConfirmBooking = () => {
 if (selectedList.length === 0) return;
 const bookings = bookMachinery(selectedList);
 setLastBookingDetails({
 bookings,
 total: roiAnalysis.totalExpenditure,
 itemCount: selectedList.length
 });
 setBookingSuccess(true);
 };

 const myRentedList = user && user.rentedMachines ? user.rentedMachines : [];

 return (
 <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' }}>
 <TopBar title={t('topicMachinery')} onBack={onBack} />

 {/* Navigation Sub-Tabs */}
 <div style={{
 display: 'flex',
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 12,
 padding: 4,
 marginBottom: 16
 }}>
 <button
 onClick={() => setActiveTab('browse')}
 style={{
 flex: 1,
 padding: '8px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 background: activeTab === 'browse' ? '#2B2118' : 'transparent',
 color: activeTab === 'browse' ? '#FAF4E6' : '#6B5B45',
 transition: 'all 0.2s'
 }}
 >
 Explore & Rent Equipment
 </button>
 <button
 onClick={() => setActiveTab('rentals')}
 style={{
 flex: 1,
 padding: '8px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 background: activeTab === 'rentals' ? '#2B2118' : 'transparent',
 color: activeTab === 'rentals' ? '#FAF4E6' : '#6B5B45',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 transition: 'all 0.2s'
 }}
 >
 <span>My Rented Fleet</span>
 {myRentedList.length > 0 && (
 <span style={{
 background: '#D9A441',
 color: '#2B2118',
 borderRadius: 12,
 padding: '1px 7px',
 fontSize: 11,
 fontWeight: 800
 }}>
 {myRentedList.length}
 </span>
 )}
 </button>
 </div>

 {activeTab === 'browse' ? (
 <>
 {/* Farm Acreage & Loss Prevention Info Banner */}
 <div style={{
 background: '#2B2118',
 color: '#FAF4E6',
 borderRadius: 14,
 padding: '14px 16px',
 marginBottom: 16,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 boxShadow: '0 4px 16px rgba(43,33,24,0.12)'
 }}>
 <div>
 <div style={{ fontSize: 11, color: '#D8CBA8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
 Smart Equipment Feasibility
 </div>
 <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>
 Plot: <span style={{ color: '#D9A441' }}>{farmerAcres} Acres ({farmerCrop})</span>
 </div>
 <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
 Custom Hiring Centers (CHC) with subsidized rates
 </div>
 </div>
 <div style={{
 background: 'rgba(217, 164, 65, 0.2)',
 border: '1px solid #D9A441',
 borderRadius: 10,
 padding: '8px 10px',
 textAlign: 'center'
 }}>
 <div style={{ fontSize: 10, color: '#D8CBA8', textTransform: 'uppercase' }}>Selected</div>
 <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: '#D9A441' }}>
 {selectedList.length} Units
 </div>
 </div>
 </div>

 {/* REAL-TIME EXPENDITURE & ROI / LOSS ADVISORY CARD */}
 {selectedList.length > 0 && (
 <div style={{
 background: '#FAF4E6',
 border: `2px solid ${roiAnalysis.badgeColor}`,
 borderRadius: 16,
 padding: '16px',
 marginBottom: 18,
 boxShadow: '0 6px 20px rgba(43,33,24,0.08)'
 }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <Sparkles size={16} color={roiAnalysis.badgeColor} />
 <span style={{ fontSize: 12, fontWeight: 700, color: '#2B2118', textTransform: 'uppercase' }}>
 Expenditure & Loss Advisory
 </span>
 </div>
 <span style={{
 background: roiAnalysis.badgeColor,
 color: '#FFF',
 fontSize: 11,
 fontWeight: 700,
 padding: '3px 9px',
 borderRadius: 6
 }}>
 {roiAnalysis.badgeText}
 </span>
 </div>

 {/* Financial Comparison Metric Grid */}
 <div style={{
 display: 'grid',
 gridTemplateColumns: '1fr 1fr 1fr',
 gap: 8,
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '10px 8px',
 marginBottom: 10,
 textAlign: 'center'
 }}>
 <div>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>Total Rent Cost</div>
 <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: '#2B2118', marginTop: 2 }}>
 ₹{roiAnalysis.totalExpenditure.toLocaleString('en-IN')}
 </div>
 </div>

 <div>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>Manual Labor Cost</div>
 <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: '#6B5B45', marginTop: 2 }}>
 ₹{roiAnalysis.estimatedManualLaborCost.toLocaleString('en-IN')}
 </div>
 </div>

 <div>
 <div style={{ fontSize: 10, color: '#8A7B68', fontWeight: 600 }}>
 {roiAnalysis.netSavings >= 0 ? "Net Savings" : "Loss Risk"}
 </div>
 <div className="mono" style={{
 fontSize: 15,
 fontWeight: 700,
 color: roiAnalysis.netSavings >= 0 ? '#6B8F5C' : '#B8492E',
 marginTop: 2
 }}>
 {roiAnalysis.netSavings >= 0 ? `+₹${roiAnalysis.netSavings.toLocaleString('en-IN')}` : `-₹${Math.abs(roiAnalysis.netSavings).toLocaleString('en-IN')}`}
 </div>
 </div>
 </div>

 {/* Advisory Rationale text */}
 <p style={{ fontSize: 12.5, color: '#2B2118', lineHeight: 1.5, marginBottom: 12 }}>
 {roiAnalysis.detailedAdvice}
 </p>

 {/* Multi-machine Selected Summary List */}
 <div style={{ borderTop: '1px solid #D8CBA8', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: '#8A7B68', textTransform: 'uppercase' }}>
 Selected Equipment Fleet:
 </div>
 {selectedList.map(({ machine, durationDays }) => (
 <div key={machine.id} style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 fontSize: 12,
 background: '#FFFDF9',
 padding: '6px 10px',
 borderRadius: 6,
 border: '1px solid #E8DECE'
 }}>
 <span style={{ fontWeight: 600, color: '#2B2118' }}>
 {machine.name} ({durationDays} {durationDays === 1 ? 'day' : 'days'})
 </span>
 <span className="mono" style={{ fontWeight: 700, color: '#D9A441' }}>
 ₹{machine.pricePerDay * durationDays}
 </span>
 </div>
 ))}
 </div>

 <button
 onClick={() => setShowCheckoutModal(true)}
 style={{
 width: '100%',
 marginTop: 12,
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '11px',
 borderRadius: 10,
 fontWeight: 700,
 fontSize: 14,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 8,
 boxShadow: '0 4px 12px rgba(43,33,24,0.15)'
 }}
 >
 <ShoppingCart size={16} color="#D9A441" />
 <span>Book All {selectedList.length} Selected Machine(s)</span>
 <ArrowRight size={16} />
 </button>
 </div>
 )}

 {/* Category Filter Chips */}
 <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
 {categories.map((c) => (
 <Chip key={c} active={category === c} onClick={() => setCategory(c)} label={c} />
 ))}
 </div>

 {/* Machinery Roster with Relatable Pictures */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {sorted.map((m) => {
 const isSelected = !!selectedFleet[m.id];
 const days = selectedFleet[m.id] || 1;

 return (
 <div
 key={m.id}
 style={{
 background: '#FAF4E6',
 border: `1.5px solid ${isSelected ? '#D9A441' : '#D8CBA8'}`,
 borderRadius: 16,
 overflow: 'hidden',
 boxShadow: isSelected ? '0 4px 16px rgba(217,164,65,0.2)' : '0 2px 8px rgba(43,33,24,0.04)',
 transition: 'all 0.2s'
 }}
 >
 {/* Equipment Relatable Image Banner */}
 <div style={{ position: 'relative', height: 130, width: '100%', overflow: 'hidden' }}>
 <img
 src={m.image}
 alt={m.name}
 style={{
 width: '100%',
 height: '100%',
 objectFit: 'cover',
 filter: 'brightness(0.92)'
 }}
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
 fontSize: 11,
 fontWeight: 700,
 padding: '3px 8px',
 borderRadius: 6,
 display: 'flex',
 alignItems: 'center',
 gap: 4
 }}>
 <Tractor size={13} color="#D9A441" />
 <span>{m.category}</span>
 </div>

 <div style={{
 position: 'absolute',
 bottom: 10,
 right: 10,
 background: '#D9A441',
 color: '#2B2118',
 fontWeight: 800,
 fontSize: 14,
 padding: '4px 10px',
 borderRadius: 8,
 boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
 }} className="mono">
 ₹{m.pricePerDay}<span style={{ fontSize: 11, fontWeight: 500 }}>/day</span>
 </div>
 </div>

 {/* Details Content */}
 <div style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118' }}>
 {m.name}
 </h3>
 <div style={{ fontSize: 12, color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
 <MapPin size={12} color="#D9A441" /> {m.distanceKm} km away • {m.owner}
 </div>
 </div>
 </div>

 <div style={{ fontSize: 12, color: '#2B2118', marginTop: 8, background: '#FFFDF9', padding: '8px 10px', borderRadius: 8, border: '1px solid #E8DECE' }}>
 <div style={{ color: '#6B8F5C', fontWeight: 600 }}> {m.laborReplaced}</div>
 <div style={{ color: '#6B5B45', fontSize: 11, marginTop: 2 }}>{m.idealFor}</div>
 </div>

 {/* Power Requirement & Operator Tag */}
 <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
 <span style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#6B5B45' }}>
 {m.powerReq}
 </span>
 {m.operatorIncluded && (
 <span style={{ background: '#EAF3E7', border: '1px solid #6B8F5C', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#2D5A27', fontWeight: 600 }}>
 Driver Included
 </span>
 )}
 </div>

 {/* Duration Counter (if selected) */}
 {isSelected && (
 <div style={{
 marginTop: 12,
 padding: '8px 10px',
 background: '#FFF8EA',
 border: '1px solid #D9A441',
 borderRadius: 8,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between'
 }}>
 <span style={{ fontSize: 12, fontWeight: 600, color: '#2B2118' }}>
 Rental Duration:
 </span>

 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <button
 onClick={() => updateDuration(m.id, -1)}
 style={{
 width: 26,
 height: 26,
 borderRadius: 4,
 background: '#2B2118',
 color: '#FAF4E6',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}
 >
 <Minus size={14} />
 </button>

 <span className="mono" style={{ fontWeight: 700, fontSize: 14, minWidth: 45, textAlign: 'center' }}>
 {days} {days === 1 ? 'Day' : 'Days'}
 </span>

 <button
 onClick={() => updateDuration(m.id, 1)}
 style={{
 width: 26,
 height: 26,
 borderRadius: 4,
 background: '#2B2118',
 color: '#FAF4E6',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 }}
 >
 <Plus size={14} />
 </button>
 </div>
 </div>
 )}

 {/* Action Row: Call Owner & Toggle Selection */}
 <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
 <a
 href={`tel:${m.phone}`}
 style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 color: '#2B2118',
 padding: '8px 12px',
 borderRadius: 8,
 fontSize: 12,
 fontWeight: 600,
 display: 'flex',
 alignItems: 'center',
 gap: 6,
 textDecoration: 'none'
 }}
 >
 <Phone size={13} color="#D9A441" />
 <span>Call</span>
 </a>

 <button
 onClick={() => toggleSelectMachine(m.id)}
 style={{
 flex: 1,
 background: isSelected ? '#6B8F5C' : '#2B2118',
 color: '#FAF4E6',
 padding: '8px 12px',
 borderRadius: 8,
 fontSize: 13,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 transition: 'all 0.15s'
 }}
 >
 {isSelected ? (
 <>
 <CheckCircle2 size={16} />
 <span>Selected for Rent </span>
 </>
 ) : (
 <>
 <Plus size={14} color="#D9A441" />
 <span>Select & Rent</span>
 </>
 )}
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </>
 ) : (
 /* MY RENTED FLEET / BOOKED TAB */
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {myRentedList.length === 0 ? (
 <div style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderRadius: 16,
 padding: '36px 20px',
 textAlign: 'center'
 }}>
 <Tractor size={40} color="#D9A441" style={{ margin: '0 auto 10px' }} />
 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 No Active Machinery Rentals
 </h3>
 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 4, marginBottom: 16 }}>
 You have not booked any rental machinery yet. Select equipment from local Custom Hiring Centers to speed up field operations.
 </p>
 <button
 onClick={() => setActiveTab('browse')}
 style={{
 background: '#2B2118',
 color: '#FAF4E6',
 padding: '10px 18px',
 borderRadius: 8,
 fontWeight: 600,
 fontSize: 13
 }}
 >
 Browse Equipment Catalog
 </button>
 </div>
 ) : (
 myRentedList.map((r, idx) => (
 <div
 key={idx}
 style={{
 background: '#FAF4E6',
 border: '1px solid #D8CBA8',
 borderLeft: '6px solid #6B8F5C',
 borderRadius: 14,
 padding: '16px',
 boxShadow: '0 2px 8px rgba(43,33,24,0.04)'
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <span className="mono" style={{ background: '#EAF3E7', color: '#2D5A27', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
 Booking ID: {r.bookingId}
 </span>
 <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', marginTop: 4 }}>
 {r.name}
 </h3>
 </div>

 <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118' }}>
 ₹{r.totalCost}
 </div>
 </div>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '10px 12px', margin: '10px 0', fontSize: 12 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>Dispatch / Field Date:</span>
 <strong className="mono">{r.scheduledDate || "27 Aug 2024"} ({r.durationDays} Day)</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#6B5B45' }}>CHC Provider:</span>
 <strong>{r.provider}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#6B5B45' }}>Loss Prevention Benefit:</span>
 <strong style={{ color: '#6B8F5C' }}>{r.lossAnalysis}</strong>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B8F5C', fontWeight: 600 }}>
 <CheckCircle2 size={15} />
 <span>{r.status || "Confirmed & Driver Assigned"}</span>
 </div>

 <a
 href={`tel:${r.phone}`}
 style={{
 background: '#D9A441',
 color: '#2B2118',
 padding: '6px 12px',
 borderRadius: 6,
 fontSize: 12,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 4,
 textDecoration: 'none'
 }}
 >
 <Phone size={13} />
 <span>Call Driver</span>
 </a>
 </div>
 </div>
 ))
 )}
 </div>
 )}

 {/* MULTI-MACHINE CHECKOUT MODAL */}
 {showCheckoutModal && (
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
 {!bookingSuccess ? (
 <>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
 <div>
 <h3 className="disp" style={{ fontSize: 18, fontWeight: 700, color: '#2B2118' }}>
 Confirm Equipment Booking
 </h3>
 <div style={{ fontSize: 12, color: '#6B5B45' }}>
 Multi-Machine Rental for {farmerAcres} Acres ({farmerCrop})
 </div>
 </div>
 <button onClick={() => setShowCheckoutModal(false)} style={{ background: 'none', border: 'none', color: '#8A7B68' }}>
 <X size={20} />
 </button>
 </div>

 {/* Selected items summary */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
 {selectedList.map(({ machine, durationDays }) => (
 <div key={machine.id} style={{
 background: '#FFFDF9',
 border: '1px solid #D8CBA8',
 borderRadius: 10,
 padding: '10px 12px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center'
 }}>
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#2B2118' }}>{machine.name}</div>
 <div style={{ fontSize: 11, color: '#6B5B45' }}>
 {durationDays} Day(s) @ ₹{machine.pricePerDay}/day • {machine.owner}
 </div>
 </div>
 <div className="mono" style={{ fontWeight: 700, fontSize: 14, color: '#2B2118' }}>
 ₹{machine.pricePerDay * durationDays}
 </div>
 </div>
 ))}
 </div>

 {/* Total Expenditure & Feasibility verdict */}
 <div style={{
 background: '#FFF8EA',
 border: '1px solid #D9A441',
 borderRadius: 10,
 padding: '12px',
 marginBottom: 16
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
 <span style={{ fontSize: 14, fontWeight: 700 }}>Total Rental Expenditure:</span>
 <span className="mono" style={{ fontSize: 18, fontWeight: 800, color: '#2B2118' }}>
 ₹{roiAnalysis.totalExpenditure.toLocaleString('en-IN')}
 </span>
 </div>
 <div style={{ fontSize: 12, color: '#6B8F5C', fontWeight: 600 }}>
 Estimated manual labor savings: ₹{roiAnalysis.netSavings > 0 ? roiAnalysis.netSavings.toLocaleString('en-IN') : '250'}
 </div>
 </div>

 <div style={{ display: 'flex', gap: 10 }}>
 <button
 onClick={() => setShowCheckoutModal(false)}
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
 onClick={handleConfirmBooking}
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
 <span>Confirm & Book Now</span>
 </button>
 </div>
 </>
 ) : (
 /* BOOKING SUCCESS STATE */
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
 Equipment Successfully Booked!
 </h3>
 <p style={{ fontSize: 13, color: '#6B5B45', marginTop: 4, marginBottom: 16 }}>
 {lastBookingDetails?.itemCount} machine(s) confirmed for your farm. Custom Hiring Center operators have been notified.
 </p>

 <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 10, padding: '12px', marginBottom: 18, textAlign: 'left', fontSize: 12 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#8A7B68' }}>Total Payable at Delivery:</span>
 <strong className="mono" style={{ fontSize: 14 }}>₹{lastBookingDetails?.total}</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: '#8A7B68' }}>Scheduled Field Date:</span>
 <strong>Within 48 Hours</strong>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#8A7B68' }}>Status:</span>
 <strong style={{ color: '#6B8F5C' }}>Confirmed </strong>
 </div>
 </div>

 <button
 onClick={() => {
 setShowCheckoutModal(false);
 setBookingSuccess(false);
 setActiveTab('rentals');
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
 View in My Rented Fleet
 </button>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
}

