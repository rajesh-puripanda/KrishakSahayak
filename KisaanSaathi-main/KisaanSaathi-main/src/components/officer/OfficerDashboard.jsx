import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Search, ChevronRight, AlertTriangle, CloudRain, TrendingDown, Users, Bell, Sparkles, X, Activity, Eye, CheckCircle2, Layers, BarChart3, PieChart, FileSpreadsheet, Sprout, Beaker, Leaf } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';
import { MANDI_TREND } from '../../data/mockData';
import { getAllFarmers, getNewLandRegistrations, dismissLandRegistration } from '../../data/farmerRepository';
import { getAllSoilSamples } from '../../data/soilRepository';
import { classifySoilSample } from '../../services/soilAnalysisEngine';
import TopBar from '../common/TopBar';
import StatCard from '../common/StatCard';
import Chip from '../common/Chip';
import { riskColor, riskLabel } from '../common/Gauge';
import RegionalWeatherMap from './RegionalWeatherMap';
import JurisdictionNdviMap from './JurisdictionNdviMap';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

// Regional NDVI Historical Telemetry (7-Month Trend)
const DISTRICT_NDVI_TREND = [
  { month: 'Mar', meanNdvi: 0.42, peakNdvi: 0.58, nitrogen: 45 },
  { month: 'Apr', meanNdvi: 0.48, peakNdvi: 0.62, nitrogen: 52 },
  { month: 'May', meanNdvi: 0.55, peakNdvi: 0.70, nitrogen: 60 },
  { month: 'Jun', meanNdvi: 0.64, peakNdvi: 0.78, nitrogen: 71 },
  { month: 'Jul', meanNdvi: 0.72, peakNdvi: 0.85, nitrogen: 82 },
  { month: 'Aug', meanNdvi: 0.76, peakNdvi: 0.88, nitrogen: 86 },
  { month: 'Sep', meanNdvi: 0.74, peakNdvi: 0.86, nitrogen: 84 }
];

// District NPK Nutrient Deficit Bar Chart Data per Block
const BLOCK_NPK_DEFICIT = [
  { block: 'Balipatna', ureaKg: 420, dapKg: 280, mopKg: 190 },
  { block: 'Khurda Sadar', ureaKg: 580, dapKg: 340, mopKg: 230 },
  { block: 'Jatni', ureaKg: 310, dapKg: 190, mopKg: 140 },
  { block: 'Tangi', ureaKg: 490, dapKg: 310, mopKg: 210 },
  { block: 'Banpur', ureaKg: 380, dapKg: 240, mopKg: 160 }
];

// Crop Production Forecast Data Table
const CROP_PRODUCTION_DATA = [
  { crop: 'Paddy (Kharif)', acres: 1420, estYieldTons: 3834, harvestDate: 'Oct 20 - Nov 15', risk: 'Low Risk', statusColor: '#10b981' },
  { crop: 'Tomato', acres: 680, estYieldTons: 10200, harvestDate: 'Immediate (Glut)', risk: 'Severe Glut', statusColor: '#ef4444' },
  { crop: 'Onion', acres: 410, estYieldTons: 4920, harvestDate: 'Nov 05 - Dec 10', risk: 'Moderate', statusColor: '#f59e0b' },
  { crop: 'Wheat (Rabi)', acres: 530, estYieldTons: 1855, harvestDate: 'Feb 15 - Mar 20', risk: 'Optimal', statusColor: '#10b981' }
];

export default function OfficerDashboard({ onSelectFarmer }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [farmersList, setFarmersList] = useState(getAllFarmers());
  const [soilSamplesList, setSoilSamplesList] = useState(getAllSoilSamples());
  const [newLandLogs, setNewLandLogs] = useState(getNewLandRegistrations());
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Subscribe to real-time land registration events across tabs
  useEffect(() => {
    const handleNewLand = () => {
      setFarmersList(getAllFarmers());
      setNewLandLogs(getNewLandRegistrations());
    };

    const handleSoilUpdate = () => setSoilSamplesList(getAllSoilSamples());
    window.addEventListener('krishi_land_registered', handleNewLand);
    window.addEventListener('krishi_soil_added', handleSoilUpdate);
    return () => {
      window.removeEventListener('krishi_land_registered', handleNewLand);
      window.removeEventListener('krishi_soil_added', handleSoilUpdate);
    };
  }, []);

  const handleDismissAlert = (e, landId) => {
    e.stopPropagation();
    const updated = dismissLandRegistration(landId);
    setNewLandLogs(updated);
  };

  const highRiskCount = farmersList.filter(f => f.score >= 66).length;
  const villageCount = new Set(farmersList.map(f => f.village)).size;

  const sorted = [...farmersList].sort((a, b) => b.score - a.score);
  const filtered = sorted
    .filter(f => filter === 'All' || riskLabel(f.score) === filter)
    .filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.landId && f.landId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 20px 60px' }}>
      <TopBar title={t('officerDashboard')} />

      {/* Officer Command Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2B2118 0%, #3D3023 100%)',
        color: '#FAF4E6',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 6px 20px rgba(43,33,24,0.18)'
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#D9A441', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>
            Government Command Console • Officer Portal
          </div>
          <h2 className="disp" style={{ fontSize: 20, fontWeight: 700, margin: '3px 0 0', color: '#FAF4E6' }}>
            {user?.name || "Dr. S. K. Mohapatra"} — {user?.designation || "District Agriculture Officer"}
          </h2>
          <div style={{ fontSize: 12, color: '#D8CBA8', marginTop: 2 }}>
            📍 {user?.district || "Khurda District"}, Odisha • Sentinel-2 GIS Satellite & IMD Feeds Active
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#D8CBA8' }}>Tracked Plots</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#FAF4E6', marginTop: 2 }}>{farmersList.length}</div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#fca5a5' }}>High Distress</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', marginTop: 2 }}>{highRiskCount}</div>
          </div>
        </div>
      </div>

      {/* DISMISSABLE NEW LAND REGISTRATION NOTIFICATIONS */}
      {newLandLogs.length > 0 && (
        <div style={{
          background: '#2B2118',
          border: '1.5px solid #D9A441',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 20,
          boxShadow: '0 6px 18px rgba(43,33,24,0.18)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: '#D9A441', color: '#2B2118', padding: 6, borderRadius: '50%', display: 'flex' }}>
                <Bell size={16} />
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#D9A441', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  NEW LAND REGISTRATION ALERTS ({newLandLogs.length} PENDING REVIEW)
                </span>
                <h4 className="disp" style={{ fontSize: 15, fontWeight: 700, color: '#FAF4E6', margin: '2px 0 0' }}>
                  Newly Registered Farm Plots Awaiting Verification
                </h4>
              </div>
            </div>

            <span style={{ background: '#6B8F5C', color: '#FFF', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
              REAL-TIME SYNC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {newLandLogs.map((log) => {
              const matchedFarmer = farmersList.find(f => f.landId === log.landId || f.id === log.farmerId);
              return (
                <div
                  key={log.landId}
                  onClick={() => matchedFarmer && onSelectFarmer(matchedFarmer)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(217,164,65,0.3)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#FAF4E6', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{log.farmerName}</span>
                      <span className="mono" style={{ background: '#D9A441', color: '#000', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4 }}>
                        ID: {log.landId}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#D8CBA8', marginTop: 2 }}>
                      📍 {log.village}, Khurda • Crop: <strong>{log.crop}</strong> ({log.acres} Acres • {log.areaHa || '1.01'} HA)
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>
                        NDVI {log.ndviScore}
                      </div>
                      <div style={{ fontSize: 10, color: '#D8CBA8' }}>
                        {log.registeredAt}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDismissAlert(e, log.landId)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        color: '#fca5a5',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer'
                      }}
                      title="Mark Reviewed & Dismiss Alert"
                    >
                      <CheckCircle2 size={13} />
                      <span>Dismiss Alert</span>
                    </button>

                    <ChevronRight size={16} color="#D9A441" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP DESKTOP USP PANEL: GIS SATELLITE MAP & SPECTRAL GRAPH */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 18, marginBottom: 20 }}>
        {/* Left Column: Sentinel Satellite GIS Map */}
        <JurisdictionNdviMap onSelectFarmer={onSelectFarmer} />

        {/* Right Column: District Vegetation Telemetry & Spectral Index Panel */}
        <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: '#6B5B45', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
                  District Satellite USP Analytics
                </div>
                <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: '2px 0 0' }}>
                  Regional NDVI Vegetation Index Graph
                </h3>
              </div>
              <span className="mono" style={{ background: '#10b981', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                Peak: 0.88
              </span>
            </div>

            <p style={{ fontSize: 12, color: '#6B5B45', lineHeight: 1.4, marginBottom: 12 }}>
              Multi-spectral Sentinel-2 telemetry measuring Chlorophyll Absorption Index & Soil Moisture saturation across Khurda block fields.
            </p>

            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={DISTRICT_NDVI_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8CBA8" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#6B5B45" />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} stroke="#6B5B45" />
                <Tooltip />
                <Area type="monotone" dataKey="peakNdvi" name="Peak Plot NDVI" stroke="#10b981" fillOpacity={1} fill="url(#colorNdvi)" />
                <Line type="monotone" dataKey="meanNdvi" name="District Mean" stroke="#d97706" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid #D8CBA8' }}>
            <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#8A7B68' }}>Mean Nitrogen Index</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
                86% Optimal
              </div>
            </div>
            <div style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#8A7B68' }}>Soil Moisture Index</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#C97D34', marginTop: 2 }}>
                24% Low (Deficit)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: CROP PRODUCTION FORECAST TABLE & NPK NUTRIENT BAR CHART */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 18, marginBottom: 20 }}>
        {/* Crop Production Forecast Table */}
        <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileSpreadsheet size={18} color="#2B2118" />
              <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
                District Crop Production & Yield Forecast
              </h3>
            </div>
            <span style={{ fontSize: 11, color: '#6B5B45', fontWeight: 600 }}>Season 2024–25</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#2B2118', color: '#FAF4E6' }}>
                  <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Crop Name</th>
                  <th style={{ padding: '8px 10px' }}>Acreage</th>
                  <th style={{ padding: '8px 10px' }}>Est Yield</th>
                  <th style={{ padding: '8px 10px' }}>Harvest Window</th>
                  <th style={{ padding: '8px 10px', borderRadius: '0 6px 6px 0' }}>Risk Rating</th>
                </tr>
              </thead>
              <tbody>
                {CROP_PRODUCTION_DATA.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #D8CBA8', background: idx % 2 === 0 ? '#FFFDF9' : '#FAF4E6' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#2B2118' }}>{row.crop}</td>
                    <td className="mono" style={{ padding: '10px' }}>{row.acres} Ac</td>
                    <td className="mono" style={{ padding: '10px', fontWeight: 700 }}>{row.estYieldTons.toLocaleString('en-IN')} MT</td>
                    <td style={{ padding: '10px', color: '#6B5B45' }}>{row.harvestDate}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: 'rgba(0,0,0,0.06)', color: row.statusColor, border: `1px solid ${row.statusColor}`, padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NPK Fertilizer Requirement Bar Chart */}
        <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 size={18} color="#6B8F5C" />
              <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
                Block Soil N-P-K Demand (Bags)
              </h3>
            </div>
            <span style={{ fontSize: 11, color: '#6B8F5C', fontWeight: 600 }}>ICAR Demand</span>
          </div>

          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={BLOCK_NPK_DEFICIT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8CBA8" />
              <XAxis dataKey="block" tick={{ fontSize: 10 }} stroke="#6B5B45" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6B5B45" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="ureaKg" name="Urea Bags" fill="#6B8F5C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dapKg" name="DAP Bags" fill="#D9A441" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mopKg" name="MOP Bags" fill="#C97D34" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTRICT SOIL HEALTH & LABORATORY GIS ANALYSIS TABLE */}
      <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(107,143,92,0.2)', padding: 6, borderRadius: 8 }}>
              <Beaker size={18} color="#6B8F5C" />
            </div>
            <div>
              <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
                District Soil Health GIS & Laboratory Testing Roster
              </h3>
              <div style={{ fontSize: 11, color: '#6B5B45', marginTop: 2 }}>
                ICAR / Soil Health Card Standard Laboratory Soil Test Results across Blocks
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 700 }}>
            <span style={{ background: '#FFFDF9', border: '1px solid #D8CBA8', padding: '4px 10px', borderRadius: 8, color: '#2B2118' }}>
              Samples Tested: <strong>{soilSamplesList.length}</strong>
            </span>
            <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 8, color: '#10b981' }}>
              Mean pH: <strong>6.6 (Neutral)</strong>
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#2B2118', color: '#FAF4E6' }}>
                <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Sample Code</th>
                <th style={{ padding: '8px 10px' }}>Location / Block</th>
                <th style={{ padding: '8px 10px' }}>Texture</th>
                <th style={{ padding: '8px 10px' }}>pH</th>
                <th style={{ padding: '8px 10px' }}>N (kg/ha)</th>
                <th style={{ padding: '8px 10px' }}>P (kg/ha)</th>
                <th style={{ padding: '8px 10px' }}>K (kg/ha)</th>
                <th style={{ padding: '8px 10px' }}>OC (%)</th>
                <th style={{ padding: '8px 10px', borderRadius: '0 6px 6px 0' }}>Fertility</th>
              </tr>
            </thead>
            <tbody>
              {soilSamplesList.map((sample, idx) => {
                const analysis = classifySoilSample(sample);
                const isAcidic = sample.ph < 6.5;
                const isLowN = sample.nitrogen < 280;
                const isLowP = sample.phosphorus < 10;
                const isLowK = sample.potassium < 120;

                return (
                  <tr key={sample.id || idx} style={{ borderBottom: '1px solid #D8CBA8', background: idx % 2 === 0 ? '#FFFDF9' : '#FAF4E6' }}>
                    <td className="mono" style={{ padding: '10px', fontWeight: 800, color: '#2B2118' }}>
                      {sample.sample_code}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: '#2B2118' }}>{sample.village || 'Field Sample'}</div>
                      <div style={{ fontSize: 10, color: '#8A7B68' }}>{sample.district || 'Khurda'}</div>
                    </td>
                    <td style={{ padding: '10px', color: '#6B5B45', fontWeight: 600 }}>
                      {sample.soil_texture}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        background: isAcidic ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                        color: isAcidic ? '#ef4444' : '#10b981',
                        border: `1px solid ${isAcidic ? '#ef4444' : '#10b981'}`,
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 11
                      }}>
                        {sample.ph} ({analysis.classifications.ph.category})
                      </span>
                    </td>
                    <td className="mono" style={{ padding: '10px', fontWeight: 700, color: isLowN ? '#ef4444' : '#2B2118' }}>
                      {sample.nitrogen} {isLowN && <span style={{ fontSize: 9, color: '#ef4444' }}>[LOW]</span>}
                    </td>
                    <td className="mono" style={{ padding: '10px', fontWeight: 700, color: isLowP ? '#ef4444' : '#2B2118' }}>
                      {sample.phosphorus} {isLowP && <span style={{ fontSize: 9, color: '#ef4444' }}>[LOW]</span>}
                    </td>
                    <td className="mono" style={{ padding: '10px', fontWeight: 700, color: isLowK ? '#ef4444' : '#2B2118' }}>
                      {sample.potassium} {isLowK && <span style={{ fontSize: 9, color: '#ef4444' }}>[LOW]</span>}
                    </td>
                    <td className="mono" style={{ padding: '10px', color: '#6B5B45' }}>
                      {sample.organic_carbon}%
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        background: analysis.overallFertility === 'High' ? '#10b981' : analysis.overallFertility === 'Low' ? '#ef4444' : '#f59e0b',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: 10,
                        textTransform: 'uppercase'
                      }}>
                        {analysis.overallFertility}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* THIRD ROW: REGIONAL WEATHER MAP & MANDI VOLATILITY RADAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        {/* Block Weather Radar */}
        <RegionalWeatherMap />

        {/* Mandi Wholesale Price Radar */}
        <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingDown size={18} color="#B8492E" />
              <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
                Wholesale Mandi Volatility Index
              </h3>
            </div>
            <span style={{ fontSize: 11, color: '#B8492E', fontWeight: 600 }}>Tomato -50% (Glut Alert)</span>
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={MANDI_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8CBA8" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#6B5B45" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6B5B45" />
              <Tooltip />
              <Line type="monotone" dataKey="tomato" name="Tomato ₹/kg" stroke="#B8492E" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="onion" name="Onion ₹/kg" stroke="#C97D34" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="wheat" name="Wheat ₹/kg" stroke="#6B8F5C" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOURTH ROW: FARMER WATCHLIST ROSTER TABLE */}
      <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3 className="disp" style={{ fontSize: 17, fontWeight: 700, color: '#2B2118', margin: 0 }}>
            Farmer Distress Watchlist & Land Register
          </h3>

          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'High', 'Medium', 'Low'].map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)} label={f} />
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="#8A7B68" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search farmer name, Land ID (LND-OD-...), village, or crop..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: 8,
              border: '1px solid #D8CBA8',
              background: '#FFFDF9',
              fontSize: 13
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelectFarmer(f)}
              className="card-hover"
              style={{
                background: '#FFFDF9',
                border: '1px solid #D8CBA8',
                borderLeft: `6px solid ${riskColor(f.score)}`,
                borderRadius: 10,
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2B2118', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{f.name}</span>
                  {f.landId && (
                    <span className="mono" style={{ background: '#2B2118', color: '#D9A441', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                      {f.landId}
                    </span>
                  )}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: (f.ndviScore || 0.7) >= 0.7 ? 'rgba(16,185,129,0.15)' : (f.ndviScore || 0.7) >= 0.4 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: (f.ndviScore || 0.7) >= 0.7 ? '#10b981' : (f.ndviScore || 0.7) >= 0.4 ? '#d97706' : '#ef4444'
                  }}>
                    NDVI {f.ndviScore || 0.70}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#6B5B45', display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <MapPin size={12} /> {f.village} • {f.crop} ({f.acres} Acres)
                </div>
                <div style={{ fontSize: 11, color: '#8A7B68', marginTop: 2 }}>
                  Rainfall Deficit: {f.rainfallDeficit || 12}% • Loan due: {f.loanDueDays || 30} days
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: riskColor(f.score) }}>
                    {f.score}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: riskColor(f.score), textTransform: 'uppercase' }}>
                    {riskLabel(f.score)}
                  </div>
                </div>
                <ChevronRight size={18} color="#8A7B68" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
