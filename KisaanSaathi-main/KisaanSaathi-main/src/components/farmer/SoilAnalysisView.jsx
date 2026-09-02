import React, { useState, useEffect, useMemo } from 'react';
import { Sprout, Droplets, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, PlusCircle, X, MapPin, Beaker, Leaf, BarChart3, FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSoilSamples, addSoilSample, getSamplesForLocation } from '../../data/soilRepository';
import { classifySoilSample, evaluateCropSuitability, generateManagementPlan, generateFullReport } from '../../services/soilAnalysisEngine';

// Color mapping for soil classification badges
const classColor = (cls) => {
  const c = (cls || '').toLowerCase();
  if (c === 'low' || c === 'acidic' || c === 'strongly saline') return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '#ef4444' };
  if (c === 'medium' || c === 'very slightly saline' || c === 'moderately saline') return { bg: 'rgba(245,158,11,0.12)', color: '#d97706', border: '#d97706' };
  if (c === 'high' || c === 'very high' || c === 'neutral' || c === 'non-saline') return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: '#10b981' };
  if (c === 'alkaline') return { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '#8b5cf6' };
  return { bg: 'rgba(107,91,69,0.1)', color: '#6B5B45', border: '#D8CBA8' };
};

const fertilityColor = (f) => {
  const fl = (f || '').toLowerCase();
  if (fl.includes('high')) return { bg: '#10b981', text: '#fff' };
  if (fl.includes('moderate') || fl.includes('good')) return { bg: '#f59e0b', text: '#fff' };
  return { bg: '#ef4444', text: '#fff' };
};

const Badge = ({ label }) => {
  const s = classColor(label);
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
      {label}
    </span>
  );
};

export default function SoilAnalysisView({ onBack }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [samples, setSamples] = useState([]);
  const [activeSample, setActiveSample] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    ph: '', nitrogen: '', phosphorus: '', potassium: '',
    organic_carbon: '', electrical_conductivity: '', soil_texture: 'Clay Loam',
    depth_from_cm: '0', depth_to_cm: '15', latitude: '', longitude: ''
  });
  const [formError, setFormError] = useState('');

  // Load samples and auto-match to farmer location
  useEffect(() => {
    const allSamples = getAllSoilSamples();
    setSamples(allSamples);

    // Auto-match nearest sample to farmer's registered land
    if (user?.ndviProfile?.center) {
      const [lat, lng] = user.ndviProfile.center;
      const nearest = getSamplesForLocation(lat, lng, 50);
      if (nearest.length > 0) {
        setActiveSample(nearest[0]);
      } else if (allSamples.length > 0) {
        setActiveSample(allSamples[0]);
      }
    } else if (allSamples.length > 0) {
      setActiveSample(allSamples[0]);
    }
  }, [user]);

  // Generate full report for active sample
  const report = useMemo(() => {
    if (!activeSample) return null;
    try {
      return generateFullReport(activeSample);
    } catch (e) {
      console.warn('Soil report generation error:', e);
      return null;
    }
  }, [activeSample]);

  const handleAddSample = () => {
    setFormError('');
    const ph = parseFloat(formData.ph);
    const n = parseFloat(formData.nitrogen);
    const p = parseFloat(formData.phosphorus);
    const k = parseFloat(formData.potassium);
    const oc = parseFloat(formData.organic_carbon);
    const ec = parseFloat(formData.electrical_conductivity);

    if (isNaN(ph) || ph < 0 || ph > 14) { setFormError('pH must be between 0 and 14'); return; }
    if (isNaN(n) || n < 0) { setFormError('Nitrogen (kg/ha) is required'); return; }
    if (isNaN(p) || p < 0) { setFormError('Phosphorus (kg/ha) is required'); return; }
    if (isNaN(k) || k < 0) { setFormError('Potassium (kg/ha) is required'); return; }

    let lat = parseFloat(formData.latitude);
    let lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      if (user?.ndviProfile?.center) {
        [lat, lng] = user.ndviProfile.center;
      } else {
        lat = 20.17; lng = 85.89;
      }
    }

    const newSample = addSoilSample({
      latitude: lat,
      longitude: lng,
      depth_from_cm: parseFloat(formData.depth_from_cm) || 0,
      depth_to_cm: parseFloat(formData.depth_to_cm) || 15,
      ph, nitrogen: n, phosphorus: p, potassium: k,
      organic_carbon: isNaN(oc) ? null : oc,
      electrical_conductivity: isNaN(ec) ? null : ec,
      soil_texture: formData.soil_texture || 'Clay Loam'
    });

    setSamples(getAllSoilSamples());
    setActiveSample(newSample);
    setShowAddForm(false);
    setFormData({ ph: '', nitrogen: '', phosphorus: '', potassium: '', organic_carbon: '', electrical_conductivity: '', soil_texture: 'Clay Loam', depth_from_cm: '0', depth_to_cm: '15', latitude: '', longitude: '' });
  };

  const classifications = report?.classifications;
  const cropSuitability = report?.cropSuitability;
  const management = report?.managementPlan;
  const recommendations = report?.recommendations;

  return (
    <div style={onBack ? { maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' } : {}}>
      {/* Optional Full-Page Back Header */}
      {onBack && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: '#FAF4E6',
              border: '1px solid #D8CBA8',
              borderRadius: 10,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#2B2118',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2B2118' }}>
            Soil Health Card & GIS Advisor
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(107,143,92,0.2)', padding: 6, borderRadius: 8 }}>
            <Beaker size={18} color="#6B8F5C" />
          </div>
          <div>
            <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
              Soil Health Analysis
            </h3>
            <div style={{ fontSize: 11, color: '#6B5B45' }}>
              Govt. of India Soil Health Card Standards
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          style={{ background: '#2B2118', color: '#D9A441', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <PlusCircle size={14} /> Add Soil Report
        </button>
      </div>

      {/* Sample Selector */}
      {samples.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {samples.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSample(s)}
              style={{
                background: activeSample?.id === s.id ? '#2B2118' : '#FAF4E6',
                color: activeSample?.id === s.id ? '#D9A441' : '#6B5B45',
                border: `1.5px solid ${activeSample?.id === s.id ? '#D9A441' : '#D8CBA8'}`,
                borderRadius: 10, padding: '6px 10px', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
              }}
            >
              {s.sample_code}
            </button>
          ))}
        </div>
      )}

      {/* No Sample State */}
      {!activeSample && (
        <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: 24, textAlign: 'center' }}>
          <Sprout size={32} color="#D8CBA8" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#6B5B45' }}>No Soil Test Data Available</div>
          <div style={{ fontSize: 12, color: '#8A7B68', marginTop: 4 }}>Add your Soil Health Card test results to get crop recommendations and fertility analysis.</div>
        </div>
      )}

      {/* Main Report */}
      {report && classifications && (
        <>
          {/* Overall Fertility Badge */}
          <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6B5B45', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overall Fertility</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#2B2118', marginTop: 2 }}>{activeSample?.sample_code}</div>
                <div style={{ fontSize: 11, color: '#8A7B68', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} /> {activeSample?.soil_texture} • Depth {activeSample?.depth_from_cm}-{activeSample?.depth_to_cm} cm
                </div>
              </div>
              <div style={{
                background: fertilityColor(classifications.overallFertility).bg,
                color: fertilityColor(classifications.overallFertility).text,
                padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 800, textTransform: 'uppercase'
              }}>
                {classifications.overallFertility}
              </div>
            </div>
          </div>

          {/* Nutrient Classification Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'pH (Reaction)', value: activeSample?.ph, unit: '', cls: classifications.ph?.category },
              { label: 'Nitrogen (N)', value: activeSample?.nitrogen, unit: ' kg/ha', cls: classifications.nitrogen?.category },
              { label: 'Phosphorus (P)', value: activeSample?.phosphorus, unit: ' kg/ha', cls: classifications.phosphorus?.category },
              { label: 'Potassium (K)', value: activeSample?.potassium, unit: ' kg/ha', cls: classifications.potassium?.category },
              { label: 'Organic Carbon', value: activeSample?.organic_carbon, unit: '%', cls: classifications.organicCarbon?.category },
              { label: 'EC (Salinity)', value: activeSample?.electrical_conductivity, unit: ' dS/m', cls: classifications.electricalConductivity?.category }
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#8A7B68', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#2B2118', fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.value != null ? item.value : '--'}<span style={{ fontSize: 10, fontWeight: 500, color: '#8A7B68' }}>{item.unit}</span>
                  </span>
                  <Badge label={item.cls || 'N/A'} />
                </div>
              </div>
            ))}
          </div>

          {/* Limiting Nutrients Alert */}
          {recommendations?.limitingNutrients && recommendations.limitingNutrients.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>Limiting Nutrients Detected</div>
                <div style={{ fontSize: 11, color: '#6B5B45', marginTop: 2 }}>
                  {recommendations.limitingNutrients.join(', ')} — these nutrients are below optimal levels and will limit crop yield.
                </div>
              </div>
            </div>
          )}

          {/* Crop Suitability Rankings */}
          {cropSuitability && cropSuitability.length > 0 && (
            <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
              <button
                onClick={() => setShowCropDetails(!showCropDetails)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Leaf size={15} color="#6B8F5C" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2B2118' }}>Crop Suitability Rankings</span>
                </div>
                {showCropDetails ? <ChevronUp size={16} color="#6B5B45" /> : <ChevronDown size={16} color="#6B5B45" />}
              </button>

              {/* Top 5 crops always visible */}
              <div style={{ marginTop: 10 }}>
                {cropSuitability.slice(0, showCropDetails ? 10 : 5).map((crop, idx) => {
                  const scoreColor = crop.score >= 80 ? '#10b981' : crop.score >= 65 ? '#22c55e' : crop.score >= 50 ? '#f59e0b' : crop.score >= 35 ? '#f97316' : '#ef4444';
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: idx < (showCropDetails ? 9 : 4) ? '1px solid #EDE5D0' : 'none' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: scoreColor, color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#2B2118' }}>{crop.name}</div>
                        <div style={{ fontSize: 10, color: '#8A7B68' }}>{crop.category}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: scoreColor, fontFamily: 'JetBrains Mono, monospace' }}>{crop.score}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: scoreColor, textTransform: 'uppercase' }}>{crop.rating}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Management Plan */}
          {management && (
            <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
              <button
                onClick={() => setShowManagement(!showManagement)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={15} color="#D9A441" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2B2118' }}>Soil Management Plan</span>
                </div>
                {showManagement ? <ChevronUp size={16} color="#6B5B45" /> : <ChevronDown size={16} color="#6B5B45" />}
              </button>

              {showManagement && (
                <div style={{ marginTop: 10 }}>
                  {Object.entries(management).map(([key, items], idx) => {
                    if (!items || (Array.isArray(items) && items.length === 0)) return null;
                    const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                    const itemList = Array.isArray(items) ? items : [items];
                    return (
                      <div key={idx} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B5B45', textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
                        {itemList.map((item, i) => (
                          <div key={i} style={{ fontSize: 11, color: '#2B2118', padding: '4px 0', paddingLeft: 10, borderLeft: '2px solid #D9A441', marginBottom: 3 }}>
                            {typeof item === 'string' ? item : JSON.stringify(item)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Soil Report Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
          background: 'rgba(43,33,24,0.78)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto',
            background: '#FAF4E6', border: '1.5px solid #D9A441', borderRadius: 18, padding: 20,
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Beaker size={18} color="#D9A441" />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#2B2118' }}>Add Soil Test Report</span>
              </div>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#6B5B45" />
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#6B5B45', marginBottom: 14 }}>
              Enter values from your Soil Health Card issued by KVK / Soil Testing Lab.
            </div>

            {formError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#ef4444', fontWeight: 600, marginBottom: 10 }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { key: 'ph', label: 'pH', placeholder: 'e.g. 6.5' },
                { key: 'nitrogen', label: 'Nitrogen (kg/ha)', placeholder: 'e.g. 280' },
                { key: 'phosphorus', label: 'Phosphorus (kg/ha)', placeholder: 'e.g. 15' },
                { key: 'potassium', label: 'Potassium (kg/ha)', placeholder: 'e.g. 200' },
                { key: 'organic_carbon', label: 'Organic Carbon (%)', placeholder: 'e.g. 0.65' },
                { key: 'electrical_conductivity', label: 'EC (dS/m)', placeholder: 'e.g. 0.45' }
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: '#6B5B45', display: 'block', marginBottom: 3 }}>{f.label}</label>
                  <input
                    type="number"
                    step="any"
                    value={formData[f.key]}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '8px 10px', border: '1.5px solid #D8CBA8', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, background: '#FFFDF9', color: '#2B2118',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#6B5B45', display: 'block', marginBottom: 3 }}>Soil Texture</label>
              <select
                value={formData.soil_texture}
                onChange={e => setFormData(prev => ({ ...prev, soil_texture: e.target.value }))}
                style={{
                  width: '100%', padding: '8px 10px', border: '1.5px solid #D8CBA8', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, background: '#FFFDF9', color: '#2B2118', outline: 'none'
                }}
              >
                {['Clay', 'Clay Loam', 'Silt Loam', 'Sandy Loam', 'Loamy', 'Sandy Clay', 'Laterite', 'Alluvial', 'Black Cotton', 'Red Soil'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddSample}
              style={{
                width: '100%', marginTop: 14, background: '#2B2118', color: '#D9A441',
                border: 'none', borderRadius: 12, padding: '12px', fontSize: 14,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              Analyze Soil Health
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
