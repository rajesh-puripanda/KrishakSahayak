// ============================================================
// src/data/soilRepository.js
// Client-Side Soil Repository (localStorage persistence)
// ============================================================

const STORAGE_KEY_SOIL = 'krishi_soil_samples_v1';

// 6 Seed Samples across Khurda, Puri, and Cuttack (Odisha)
const INITIAL_SOIL_SAMPLES = [
  {
    id: 1,
    sample_code: 'OD-KH-BAL-001',
    district: 'Khurda',
    village: 'Balipatna',
    latitude: 20.1785,
    longitude: 85.8920,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-15',
    ph: 6.2,
    nitrogen: 310,
    phosphorus: 18,
    potassium: 245,
    organic_carbon: 0.68,
    electrical_conductivity: 0.35,
    soil_texture: 'Clay Loam'
  },
  {
    id: 2,
    sample_code: 'OD-KH-JAT-002',
    district: 'Khurda',
    village: 'Jatni',
    latitude: 20.1580,
    longitude: 85.7030,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-18',
    ph: 5.8,
    nitrogen: 220,
    phosphorus: 8,
    potassium: 150,
    organic_carbon: 0.42,
    electrical_conductivity: 0.28,
    soil_texture: 'Sandy Loam'
  },
  {
    id: 3,
    sample_code: 'OD-PU-PIP-003',
    district: 'Puri',
    village: 'Pipili',
    latitude: 20.1140,
    longitude: 85.8320,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-20',
    ph: 7.2,
    nitrogen: 480,
    phosphorus: 32,
    potassium: 310,
    organic_carbon: 0.82,
    electrical_conductivity: 0.55,
    soil_texture: 'Clay'
  },
  {
    id: 4,
    sample_code: 'OD-CT-SAD-004',
    district: 'Cuttack',
    village: 'Cuttack Sadar',
    latitude: 20.4625,
    longitude: 85.8828,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-22',
    ph: 6.8,
    nitrogen: 350,
    phosphorus: 22,
    potassium: 200,
    organic_carbon: 0.71,
    electrical_conductivity: 0.42,
    soil_texture: 'Silty Loam'
  },
  {
    id: 5,
    sample_code: 'OD-KH-BBSR-005',
    district: 'Khurda',
    village: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-25',
    ph: 5.5,
    nitrogen: 180,
    phosphorus: 6,
    potassium: 110,
    organic_carbon: 0.38,
    electrical_conductivity: 0.22,
    soil_texture: 'Laterite'
  },
  {
    id: 6,
    sample_code: 'OD-PU-CHK-006',
    district: 'Puri',
    village: 'Chilika Coastal',
    latitude: 19.7200,
    longitude: 85.3200,
    depth_from_cm: 0,
    depth_to_cm: 15,
    sample_date: '2024-08-28',
    ph: 8.1,
    nitrogen: 290,
    phosphorus: 15,
    potassium: 380,
    organic_carbon: 0.55,
    electrical_conductivity: 1.85,
    soil_texture: 'Clay'
  }
];

export function getAllSoilSamples() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOIL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SOIL, JSON.stringify(INITIAL_SOIL_SAMPLES));
      return INITIAL_SOIL_SAMPLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SOIL_SAMPLES;
  }
}

export function addSoilSample(inputData) {
  const current = getAllSoilSamples();
  const nextId = current.length > 0 ? Math.max(...current.map(s => s.id || 0)) + 1 : 1;
  const sampleCode = inputData.sample_code || `OD-SOIL-${nextId.toString().padStart(3, '0')}`;

  const newSample = {
    id: nextId,
    sample_code: sampleCode,
    district: inputData.district || 'Khurda',
    village: inputData.village || 'Local Field',
    latitude: parseFloat(inputData.latitude) || 20.1785,
    longitude: parseFloat(inputData.longitude) || 85.8920,
    depth_from_cm: parseFloat(inputData.depth_from_cm) || 0,
    depth_to_cm: parseFloat(inputData.depth_to_cm) || 15,
    sample_date: inputData.sample_date || new Date().toISOString().split('T')[0],
    ph: parseFloat(inputData.ph) || 6.5,
    nitrogen: parseFloat(inputData.nitrogen) || 300,
    phosphorus: parseFloat(inputData.phosphorus) || 20,
    potassium: parseFloat(inputData.potassium) || 200,
    organic_carbon: inputData.organic_carbon != null ? parseFloat(inputData.organic_carbon) : 0.60,
    electrical_conductivity: inputData.electrical_conductivity != null ? parseFloat(inputData.electrical_conductivity) : 0.35,
    soil_texture: inputData.soil_texture || 'Clay Loam',
    createdAt: new Date().toISOString()
  };

  const updated = [newSample, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_SOIL, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('krishi_soil_added', { detail: newSample }));
  } catch (e) {}

  return newSample;
}

export function getSoilSampleById(id) {
  const list = getAllSoilSamples();
  return list.find(s => s.id === Number(id) || s.id === id) || null;
}

export function deleteSoilSample(id) {
  const current = getAllSoilSamples();
  const filtered = current.filter(s => s.id !== Number(id) && s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_SOIL, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('krishi_soil_added'));
  } catch (e) {}
  return filtered;
}

// Haversine distance helper (in km)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getSamplesForLocation(lat, lng, radiusKm = 100) {
  const all = getAllSoilSamples();
  if (!lat || !lng) return all;

  return all
    .map(sample => ({
      ...sample,
      distanceKm: Math.round(getDistanceKm(lat, lng, sample.latitude, sample.longitude) * 10) / 10
    }))
    .filter(sample => sample.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
