// Unified Persistent Farmer & Land Registration Repository
// Includes Multi-Tab BroadcastChannel Synchronization & Quota Exception Safety

import { FARMERS } from './mockData';
import { FARMER_NDVI_PROFILES } from './ndviData';

const STORAGE_KEY_FARMERS = 'krishi_farmers_db_v4';
const STORAGE_KEY_LOGS = 'krishi_new_lands_log_v4';

// Web BroadcastChannel API for multi-tab state sync across browser windows
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
 ? new BroadcastChannel('krishi_multi_tab_sync')
 : null;

// Safe localStorage wrapper with quota exception handling and coordinate precision rounding
function safeSetItem(key, value) {
 try {
 localStorage.setItem(key, JSON.stringify(value));
 return true;
 } catch (e) {
 console.warn("Storage quota limit reached, trimming historical logs:", e);
 // Quota recovery: clear old logs and retry
 try {
 localStorage.removeItem(STORAGE_KEY_LOGS);
 localStorage.setItem(key, JSON.stringify(value));
 return true;
 } catch (err) {
 console.error("Critical storage error:", err);
 return false;
 }
 }
}

function initializeStore() {
 const existing = localStorage.getItem(STORAGE_KEY_FARMERS);
 if (!existing) {
 safeSetItem(STORAGE_KEY_FARMERS, FARMERS);
 }
}

export function getAllFarmers() {
 initializeStore();
 try {
 const raw = localStorage.getItem(STORAGE_KEY_FARMERS);
 return raw ? JSON.parse(raw) : FARMERS;
 } catch (e) {
 console.error("Error reading farmer repository:", e);
 return FARMERS;
 }
}

export function getNewLandRegistrations() {
 try {
 const raw = localStorage.getItem(STORAGE_KEY_LOGS);
 return raw ? JSON.parse(raw) : [];
 } catch (e) {
 return [];
 }
}

export function registerNewFarmerLand(inputData) {
 initializeStore();
 const allFarmers = getAllFarmers();

 const randomSuffix = Math.floor(1000 + Math.random() * 9000);
 const landId = `LND-OD-2024-${randomSuffix}`;
 const farmerId = Number(Date.now());

 // Round coordinates to 5 decimal places to conserve memory
 const centerLat = parseFloat((inputData.lat || (20.1700 + (Math.random() * 0.04 - 0.02))).toFixed(5));
 const centerLng = parseFloat((inputData.lng || (85.8800 + (Math.random() * 0.04 - 0.02))).toFixed(5));

 const offset = 0.0015;
 const polygon = (inputData.polygon || [
 [centerLat + offset, centerLng - offset],
 [centerLat + offset + 0.0003, centerLng + offset],
 [centerLat - offset, centerLng + offset + 0.0002],
 [centerLat - offset, centerLng - offset]
 ]).map(pt => [parseFloat(pt[0].toFixed(5)), parseFloat(pt[1].toFixed(5))]);

 const acres = parseFloat(inputData.acres) || 2.5;
 const areaHa = inputData.areaHa ? parseFloat(inputData.areaHa) : parseFloat((acres * 0.404686).toFixed(2));
 const ndviScore = parseFloat((0.68 + Math.random() * 0.20).toFixed(2));

 const ndviProfile = {
 farmerId: farmerId,
 name: inputData.name || "Kisan Sathi",
 village: inputData.village || "Balipatna",
 district: inputData.district || "Khurda",
 crop: inputData.crop || "Tomato",
 acres: acres,
 areaHa: areaHa,
 center: [centerLat, centerLng],
 polygon: polygon,
 ndviScore: ndviScore,
 ndviMax: (ndviScore + 0.05).toFixed(2),
 healthRating: ndviScore >= 0.70 ? "Optimal Vigor" : "Moderate Vigor",
 healthPillClass: ndviScore >= 0.70 ? "good" : "warn",
 nitrogenStatus: {
 "en-IN": `Land registered (${landId}). Nitrogen absorption is in healthy range.`,
 "hi-IN": `भूमि पंजीकृत (${landId})। नाइट्रोजन का स्तर स्वस्थ सीमा में है।`,
 "or-IN": `ଜମି ପଞ୍ଜିକୃତ (${landId})। ନାଇଟ୍ରୋଜେନ୍ ଶୋଷଣ ଉତ୍ତମ ଅଛି।`
 },
 moistureStatus: {
 "en-IN": "Sub-soil moisture levels stable across newly registered plot.",
 "hi-IN": "नये पंजीकृत भूखंड में मिट्टी की नमी का स्तर स्थिर है।",
 "or-IN": "ପଞ୍ଜିକୃତ ଜମିରେ ମାଟିର ଆର୍ଦ୍ରତା ସ୍ଥିର ଅଛି।"
 },
 actionPlan: {
 "en-IN": `Field satellite monitoring active for ${inputData.crop || 'crop'}. Maintain baseline irrigation and crop care.`,
 "hi-IN": `फसल सैटेलाइट निगरानी सक्रिय। मानक सिंचाई और फसल देखभाल बनाए रखें।`,
 "or-IN": `ଫସଲ ସାଟେଲାଇଟ୍ ନିରୀକ୍ଷଣ ସକ୍ରିୟ। ଜଳସେଚନ ଜାରି ରଖନ୍ତୁ।`
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.25, 0.38, 0.52, 0.64, 0.72, 0.76, 0.75, ndviScore],
 nirHistory: [0.14, 0.26, 0.38, 0.50, 0.58, 0.62, 0.61, (ndviScore - 0.1).toFixed(2)],
 rgbHistory: [0.08, 0.15, 0.22, 0.28, 0.32, 0.34, 0.33, 0.32]
 };

 const newFarmer = {
 id: farmerId,
 landId: landId,
 name: inputData.name || "Kisan Sathi",
 mobile: inputData.mobile || "9876543210",
 aadhaar: inputData.aadhaar || "Self Registered",
 village: inputData.village || "Balipatna",
 district: inputData.district || "Khurda",
 crop: inputData.crop || "Tomato",
 acres: acres,
 areaHa: areaHa,
 score: 42,
 ndviScore: ndviScore,
 ndviRating: ndviProfile.healthRating,
 rainfallDeficit: 12,
 priceDrop: 10,
 loanDueDays: 45,
 registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 ndviProfile: ndviProfile,
 loans: [],
 appliedSchemes: [],
 rentedMachines: []
 };

 const updatedFarmers = [newFarmer, ...allFarmers];
 safeSetItem(STORAGE_KEY_FARMERS, updatedFarmers);

 const currentLogs = getNewLandRegistrations();
 const newLog = {
 landId: landId,
 farmerId: farmerId,
 farmerName: newFarmer.name,
 mobile: newFarmer.mobile,
 village: newFarmer.village,
 district: newFarmer.district,
 crop: newFarmer.crop,
 acres: acres,
 areaHa: areaHa,
 ndviScore: ndviScore,
 registeredAt: newFarmer.registeredAt
 };

 const updatedLogs = [newLog, ...currentLogs];
 safeSetItem(STORAGE_KEY_LOGS, updatedLogs);

 // Dispatch custom browser event & Web BroadcastChannel message across all open tabs!
 if (typeof window !== 'undefined') {
 window.dispatchEvent(new CustomEvent('krishi_land_registered', { detail: newLog }));
 }
 if (syncChannel) {
 try {
 syncChannel.postMessage({ type: 'LAND_REGISTERED', payload: newLog });
 } catch (e) {
 console.warn("BroadcastChannel error:", e);
 }
 }

 return newFarmer;
}

// Global Multi-Tab Listener
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
 const bc = new BroadcastChannel('krishi_multi_tab_sync');
 bc.onmessage = (event) => {
 if (event.data && event.data.type === 'LAND_REGISTERED') {
 window.dispatchEvent(new CustomEvent('krishi_land_registered', { detail: event.data.payload }));
 }
 };
}

export function dismissLandRegistration(landId) {
  try {
    const currentLogs = getNewLandRegistrations();
    const updatedLogs = currentLogs.filter(log => log.landId !== landId);
    safeSetItem(STORAGE_KEY_LOGS, updatedLogs);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('krishi_land_registered'));
    }
    return updatedLogs;
  } catch (e) {
    return [];
  }
}
