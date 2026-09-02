import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Layers } from 'lucide-react';
import { getAllFarmers } from '../../data/farmerRepository';

export default function JurisdictionNdviMap({ onSelectFarmer }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [farmers, setFarmers] = useState(getAllFarmers());

  // Listen to new land registration events across tabs in real-time!
  useEffect(() => {
    const handleUpdate = () => {
      setFarmers(getAllFarmers());
    };
    window.addEventListener('krishi_land_registered', handleUpdate);
    return () => window.removeEventListener('krishi_land_registered', handleUpdate);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = window.L;
    if (!L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([20.06, 85.62], 10);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dark Sentinel Satellite Base Map
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    const boundsGroup = [];

    // Render Polygons and Markers safely with responsive badge wrapping
    farmers.forEach((farmer) => {
      const profile = farmer.ndviProfile;
      if (!profile || !profile.polygon) return;

      const ndvi = farmer.ndviScore || 0.70;
      const strokeColor = ndvi >= 0.70 ? '#10b981' : ndvi >= 0.40 ? '#f59e0b' : '#ef4444';
      const fillColor = ndvi >= 0.70 ? 'rgba(16, 185, 129, 0.35)' : ndvi >= 0.40 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)';

      // Render Field Polygon
      const polygon = L.polygon(profile.polygon, {
        color: strokeColor,
        weight: 3,
        fillColor: fillColor,
        fillOpacity: 0.5
      }).addTo(map);

      boundsGroup.push(...profile.polygon);

      // Create Custom Pin Marker Element with Text-Wrap Fix & Auto Sizing
      const markerContainer = document.createElement('div');
      markerContainer.style.cssText = `
        background: ${strokeColor};
        color: #000;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10.5px;
        padding: 3px 8px;
        border-radius: 12px;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: max-content;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      markerContainer.textContent = `${farmer.name.split(' ')[0]}: ${ndvi}`;

      const customIcon = L.divIcon({
        className: 'jurisdiction-marker-badge',
        html: markerContainer,
        iconSize: null, // Auto size so text never wraps or clips!
        iconAnchor: [35, 12]
      });

      const marker = L.marker(profile.center, { icon: customIcon }).addTo(map);

      // Safe Popup DOM Node Construction to eliminate XSS
      const popupContent = document.createElement('div');
      popupContent.style.padding = '4px';
      popupContent.style.minWidth = '220px';
      popupContent.style.fontFamily = 'sans-serif';

      const healthHeader = document.createElement('div');
      healthHeader.style.cssText = `font-size: 10px; text-transform: uppercase; font-weight: 700; color: ${strokeColor}; letter-spacing: 0.5px;`;
      healthHeader.textContent = `${profile.healthRating} (NDVI: ${ndvi})`;
      popupContent.appendChild(healthHeader);

      const nameRow = document.createElement('div');
      nameRow.style.cssText = 'font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px; display: flex; align-items: center; justify-content: space-between;';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = farmer.name;
      nameRow.appendChild(nameSpan);

      if (farmer.landId) {
        const idSpan = document.createElement('span');
        idSpan.style.cssText = 'font-size:10px; background:#2B2118; color:#D9A441; padding:1px 5px; border-radius:4px; font-family:monospace;';
        idSpan.textContent = farmer.landId;
        nameRow.appendChild(idSpan);
      }
      popupContent.appendChild(nameRow);

      const locationRow = document.createElement('div');
      locationRow.style.cssText = 'font-size: 11px; color: #475569; margin-top: 2px;';
      locationRow.textContent = `📍 ${farmer.village}, ${farmer.district || 'Khurda'} • ${farmer.crop} (${farmer.acres} Acres)`;
      popupContent.appendChild(locationRow);

      const inspectBtn = document.createElement('button');
      inspectBtn.textContent = 'View Farmer Telemetry';
      inspectBtn.style.cssText = `
        width: 100%;
        margin-top: 8px;
        background: #2B2118;
        color: #D9A441;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      `;
      inspectBtn.onclick = () => {
        if (onSelectFarmer) onSelectFarmer(farmer);
      };
      popupContent.appendChild(inspectBtn);

      polygon.bindPopup(popupContent);
      marker.bindPopup(popupContent);
    });

    if (boundsGroup.length > 0) {
      try {
        map.fitBounds(boundsGroup, { padding: [30, 30] });
      } catch (e) {}
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [farmers, onSelectFarmer]);

  const healthyCount = farmers.filter(f => (f.ndviScore || 0.7) >= 0.7).length;
  const moderateCount = farmers.filter(f => (f.ndviScore || 0.7) >= 0.4 && (f.ndviScore || 0.7) < 0.7).length;
  const criticalCount = farmers.filter(f => (f.ndviScore || 0.7) < 0.4).length;

  return (
    <div style={{ background: '#FAF4E6', border: '1px solid #D8CBA8', borderRadius: 16, padding: '16px', marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={18} color="#2B2118" />
            <h3 className="disp" style={{ fontSize: 16, fontWeight: 700, color: '#2B2118', margin: 0 }}>
              District Jurisdiction Satellite Survey Map
            </h3>
          </div>
          <div style={{ fontSize: 11, color: '#6B5B45', marginTop: 2 }}>
            Khurda District • {farmers.length} Registered Farm Plots Active
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, fontSize: 10, fontWeight: 700 }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '2px 8px', borderRadius: 12 }}>
            Healthy ({healthyCount})
          </span>
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid #d97706', padding: '2px 8px', borderRadius: 12 }}>
            Stress ({moderateCount})
          </span>
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '2px 8px', borderRadius: 12 }}>
            Severe ({criticalCount})
          </span>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: 360,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #D8CBA8',
          boxShadow: '0 4px 12px rgba(43,33,24,0.1)'
        }}
      />
    </div>
  );
}
