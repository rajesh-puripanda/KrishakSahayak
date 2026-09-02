import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, RefreshCw, CheckCircle, Edit3, Trash2, Move, AlertTriangle } from 'lucide-react';

// Helper function to check if two line segments (p1-p2) and (p3-p4) intersect
function linesIntersect(p1, p2, p3, p4) {
 const ccw = (A, B, C) => (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
 return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

// Check polygon self-intersection (hourglass shape detector)
export function checkSelfIntersection(pts) {
 if (!pts || pts.length < 4) return false;
 const n = pts.length;
 for (let i = 0; i < n; i++) {
 for (let j = i + 2; j < n; j++) {
 if (i === 0 && j === n - 1) continue;
 const p1 = Array.isArray(pts[i]) ? pts[i] : [pts[i].lat, pts[i].lng];
 const p2 = Array.isArray(pts[(i + 1) % n]) ? pts[(i + 1) % n] : [pts[(i + 1) % n].lat, pts[(i + 1) % n].lng];
 const p3 = Array.isArray(pts[j]) ? pts[j] : [pts[j].lat, pts[j].lng];
 const p4 = Array.isArray(pts[(j + 1) % n]) ? pts[(j + 1) % n] : [pts[(j + 1) % n].lat, pts[(j + 1) % n].lng];
 if (linesIntersect(p1, p2, p3, p4)) return true;
 }
 }
 return false;
}

// Helper function to generate field boundary shape presets matching exact acreage
export function createAcreageBox(centerLat, centerLng, acres = 2.5, shapePreset = 'rectangle') {
 const acresNum = parseFloat(acres) || 2.5;
 const areaM2 = acresNum * 4046.86;

 const metersPerDegreeLat = 111320;
 const metersPerDegreeLng = 111320 * Math.cos((centerLat * Math.PI) / 180);

 if (shapePreset === 'strip') {
 // Narrow Strip Field (Aspect ratio 2.5 : 1)
 const widthMeters = Math.sqrt(areaM2 * 2.5);
 const heightMeters = areaM2 / widthMeters;
 const halfLat = (heightMeters / 2) / metersPerDegreeLat;
 const halfLng = (widthMeters / 2) / metersPerDegreeLng;
 return [
 [centerLat + halfLat, centerLng - halfLng],
 [centerLat + halfLat, centerLng + halfLng],
 [centerLat - halfLat, centerLng + halfLng],
 [centerLat - halfLat, centerLng - halfLng]
 ];
 } else if (shapePreset === 'triangle') {
 // Triangular Corner Plot
 const sideMeters = Math.sqrt((areaM2 * 2) / Math.sin(Math.PI / 3));
 const heightMeters = (sideMeters * Math.sqrt(3)) / 2;
 const halfLat = (heightMeters / 2) / metersPerDegreeLat;
 const halfLng = (sideMeters / 2) / metersPerDegreeLng;
 return [
 [centerLat + halfLat, centerLng],
 [centerLat - halfLat, centerLng + halfLng],
 [centerLat - halfLat, centerLng - halfLng]
 ];
 } else if (shapePreset === 'lshape') {
 // 6-Point L-Shape Corner Field
 const unitMeters = Math.sqrt(areaM2 / 3);
 const dLat = unitMeters / metersPerDegreeLat;
 const dLng = unitMeters / metersPerDegreeLng;
 return [
 [centerLat + dLat, centerLng - dLng],
 [centerLat + dLat, centerLng + dLng],
 [centerLat - dLat, centerLng + dLng],
 [centerLat - dLat, centerLng],
 [centerLat, centerLng],
 [centerLat, centerLng - dLng]
 ];
 } else {
 // Default Rectangle Plot (Aspect ratio 1.2 : 1)
 const widthMeters = Math.sqrt(areaM2 * 1.2);
 const heightMeters = areaM2 / widthMeters;
 const halfLat = (heightMeters / 2) / metersPerDegreeLat;
 const halfLng = (widthMeters / 2) / metersPerDegreeLng;
 return [
 [centerLat + halfLat, centerLng - halfLng],
 [centerLat + halfLat, centerLng + halfLng],
 [centerLat - halfLat, centerLng + halfLng],
 [centerLat - halfLat, centerLng - halfLng]
 ];
 }
}

export default function NdviMapWidget({
 center = [20.1785, 85.8920],
 polygonPoints,
 acres = 2.5,
 areaHa = 1.01,
 ndviScore = 0.83,
 height = 270,
 allowDraw = false,
 shapePreset = 'rectangle',
 onPolygonChange,
 onTelemetryChange
}) {
 const mapContainerRef = useRef(null);
 const mapInstanceRef = useRef(null);
 const clippedPaneRef = useRef(null);
 const polygonRef = useRef(null);
 const activeTileLayerRef = useRef(null);
 const vertexMarkersRef = useRef([]);
 const animFrameRef = useRef(null);

 const [activeLayer, setActiveLayer] = useState('ndvi'); // 'ndvi' | 'nir' | 'truecolor'
 const [calculatedArea, setCalculatedArea] = useState(areaHa);
 const [isSelfIntersecting, setIsSelfIntersecting] = useState(false);

 // Absolute geodesic polygon area calculation
 const calcArea = (pts) => {
 if (!pts || pts.length < 3) return 0;
 let area = 0;
 const RAD = Math.PI / 180;
 const R = 6378137;
 for (let i = 0; i < pts.length; i++) {
 const p1 = Array.isArray(pts[i]) ? pts[i] : [pts[i].lat, pts[i].lng];
 const p2 = Array.isArray(pts[(i + 1) % pts.length]) ? pts[(i + 1) % pts.length] : [pts[(i + 1) % pts.length].lat, pts[(i + 1) % pts.length].lng];
 area += (p2[1] * RAD - p1[1] * RAD) * (2 + Math.sin(p1[0] * RAD) + Math.sin(p2[0] * RAD));
 }
 return (Math.abs((area * R * R) / 2.0) / 10000).toFixed(2);
 };

 // 60 FPS Optimized SVG Clip Path Mask Update
 const updateClipMask = () => {
 if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

 animFrameRef.current = requestAnimationFrame(() => {
 const map = mapInstanceRef.current;
 const clippedPane = clippedPaneRef.current;
 const polygon = polygonRef.current;

 if (!map || !clippedPane || !polygon) {
 if (clippedPane) clippedPane.style.clipPath = 'none';
 return;
 }

 try {
 const latLngs = polygon.getLatLngs()[0];
 if (!latLngs || latLngs.length < 3) {
 clippedPane.style.clipPath = 'none';
 return;
 }
 const layerPoints = latLngs.map(ll => map.latLngToLayerPoint(ll));
 const clipStr = layerPoints.map(p => `${Math.round(p.x)}px ${Math.round(p.y)}px`).join(', ');
 clippedPane.style.clipPath = `polygon(${clipStr})`;
 } catch (e) {
 console.warn("Clip path update:", e);
 }
 });
 };

 const activePolygonPoints = polygonPoints || createAcreageBox(center[0], center[1], acres, shapePreset);

 // Render Draggable Vertex Handles for Reshaping Boundary
 const renderDraggableHandles = (pts) => {
 const L = window.L;
 const map = mapInstanceRef.current;
 if (!L || !map) return;

 vertexMarkersRef.current.forEach(m => map.removeLayer(m));
 vertexMarkersRef.current = [];

 if (!allowDraw) return;

 pts.forEach((pt, index) => {
 const lat = Array.isArray(pt) ? pt[0] : pt.lat;
 const lng = Array.isArray(pt) ? pt[1] : pt.lng;

 const handleIcon = L.divIcon({
 className: 'drag-handle-marker',
 html: `<div style="
 background: #00f2fe;
 width: 14px;
 height: 14px;
 border-radius: 50%;
 border: 2px solid #ffffff;
 box-shadow: 0 0 10px #00f2fe;
 cursor: grab;
 "></div>`,
 iconSize: [14, 14],
 iconAnchor: [7, 7]
 });

 const marker = L.marker([lat, lng], {
 icon: handleIcon,
 draggable: true
 }).addTo(map);

 const onDrag = () => {
 const newLatLngs = vertexMarkersRef.current.map(m => m.getLatLng());
 if (polygonRef.current) {
 polygonRef.current.setLatLngs(newLatLngs);
 }
 updateClipMask();
 const formattedPts = newLatLngs.map(ll => [parseFloat(ll.lat.toFixed(5)), parseFloat(ll.lng.toFixed(5))]);
 
 // Self-intersection check
 const hasIntersection = checkSelfIntersection(formattedPts);
 setIsSelfIntersecting(hasIntersection);

 const ha = calcArea(formattedPts);
 setCalculatedArea(ha);
 if (onPolygonChange) onPolygonChange(formattedPts, ha);
 };

 marker.on('drag', onDrag);
 marker.on('dragend', onDrag);

 vertexMarkersRef.current.push(marker);
 });
 };

 // Initialize Leaflet Map (Reused across renders via mapInstanceRef)
 useEffect(() => {
 if (!mapContainerRef.current) return;
 const L = window.L;
 if (!L) return;

 if (!mapInstanceRef.current) {
 const map = L.map(mapContainerRef.current, {
 zoomControl: false,
 attributionControl: false
 }).setView(center, 16);

 L.control.zoom({ position: 'topright' }).addTo(map);

 L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 maxZoom: 19
 }).addTo(map);

 map.createPane('clippedTilePane');
 const clippedPane = map.getPane('clippedTilePane');
 clippedPane.style.zIndex = 450;
 clippedPaneRef.current = clippedPane;

 activeTileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 pane: 'clippedTilePane',
 maxZoom: 19
 }).addTo(map);

 mapInstanceRef.current = map;
 map.on('move zoom viewreset resize', updateClipMask);

 if (allowDraw) {
 map.on('click', (e) => {
 const newLat = parseFloat(e.latlng.lat.toFixed(5));
 const newLng = parseFloat(e.latlng.lng.toFixed(5));
 const newPolyPoints = createAcreageBox(newLat, newLng, acres, shapePreset);

 if (polygonRef.current) map.removeLayer(polygonRef.current);
 const poly = L.polygon(newPolyPoints, {
 color: '#00f2fe',
 weight: 3,
 fillColor: 'transparent',
 fillOpacity: 0,
 dashArray: '4, 4'
 }).addTo(map);
 polygonRef.current = poly;
 updateClipMask();

 const ha = calcArea(newPolyPoints);
 setCalculatedArea(ha);
 renderDraggableHandles(newPolyPoints);
 if (onPolygonChange) onPolygonChange(newPolyPoints, ha, [newLat, newLng]);
 });
 }
 } else {
 // Reuse existing Leaflet map instance smoothly without tearing down DOM!
 mapInstanceRef.current.setView(center, 16);
 }

 // Draw polygon
 if (polygonRef.current) mapInstanceRef.current.removeLayer(polygonRef.current);

 if (activePolygonPoints && activePolygonPoints.length >= 3) {
 const poly = L.polygon(activePolygonPoints, {
 color: isSelfIntersecting ? '#ef4444' : '#00f2fe',
 weight: 3,
 fillColor: 'transparent',
 fillOpacity: 0,
 dashArray: '4, 4'
 }).addTo(mapInstanceRef.current);
 polygonRef.current = poly;
 mapInstanceRef.current.fitBounds(poly.getBounds(), { padding: [40, 40] });
 updateClipMask();
 renderDraggableHandles(activePolygonPoints);
 }

 return () => {
 if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
 };
 }, [center[0], center[1], acres, shapePreset, allowDraw]);

 // Apply spectral layer CSS filters
 useEffect(() => {
 const pane = clippedPaneRef.current;
 if (!pane) return;

 if (activeLayer === 'ndvi') {
 pane.style.filter = 'url(#ndvi-filter) saturate(2.4) contrast(1.4)';
 } else if (activeLayer === 'nir') {
 pane.style.filter = 'url(#nir-filter) saturate(2.8) contrast(1.5)';
 } else {
 pane.style.filter = 'none';
 }

 updateClipMask();
 }, [activeLayer]);

 const handleLayerSwitch = (layer) => {
 setActiveLayer(layer);
 if (onTelemetryChange) {
 onTelemetryChange(layer, calculatedArea);
 }
 };

 return (
 <div style={{ position: 'relative', width: '100%', borderRadius: 14, overflow: 'hidden', border: isSelfIntersecting ? '2px solid #ef4444' : '1px solid #D8CBA8', background: '#020617' }}>
 
 {/* SVG Hardware Accelerated Spectral Color Matrices */}
 <svg style={{ display: 'none' }}>
 <defs>
 <filter id="ndvi-filter">
 <feColorMatrix type="matrix" values="
 -0.5 2.2 -0.2 0.0 0.1
 1.8 -0.5 -0.2 0.0 0.0
 -0.8 -0.8 2.5 0.0 0.0
 0.0 0.0 0.0 1.0 0.0"/>
 </filter>
 <filter id="nir-filter">
 <feColorMatrix type="matrix" values="
 0.2 2.2 0.0 0.0 0.1
 0.0 0.2 0.1 0.0 0.0
 0.1 0.0 0.8 0.0 0.0
 0.0 0.0 0.0 1.0 0.0"/>
 </filter>
 </defs>
 </svg>

 {/* Layer Picker Controls Header */}
 <div style={{
 position: 'absolute',
 top: 10,
 left: 10,
 zIndex: 500,
 background: 'rgba(11, 17, 32, 0.88)',
 backdropFilter: 'blur(8px)',
 border: '1px solid rgba(0, 242, 254, 0.3)',
 borderRadius: 8,
 padding: '3px 4px',
 display: 'flex',
 gap: 4
 }}>
 <button
 onClick={() => handleLayerSwitch('ndvi')}
 style={{
 background: activeLayer === 'ndvi' ? '#00f2fe' : 'transparent',
 color: activeLayer === 'ndvi' ? '#000' : '#94a3b8',
 border: 'none',
 borderRadius: 6,
 padding: '4px 8px',
 fontSize: 10,
 fontWeight: 700,
 cursor: 'pointer',
 transition: 'all 0.2s'
 }}
 >
 NDVI Heatmap
 </button>
 <button
 onClick={() => handleLayerSwitch('nir')}
 style={{
 background: activeLayer === 'nir' ? '#ef4444' : 'transparent',
 color: activeLayer === 'nir' ? '#fff' : '#94a3b8',
 border: 'none',
 borderRadius: 6,
 padding: '4px 8px',
 fontSize: 10,
 fontWeight: 700,
 cursor: 'pointer',
 transition: 'all 0.2s'
 }}
 >
 NIR Infrared
 </button>
 <button
 onClick={() => handleLayerSwitch('truecolor')}
 style={{
 background: activeLayer === 'truecolor' ? '#64748b' : 'transparent',
 color: activeLayer === 'truecolor' ? '#fff' : '#94a3b8',
 border: 'none',
 borderRadius: 6,
 padding: '4px 8px',
 fontSize: 10,
 fontWeight: 700,
 cursor: 'pointer',
 transition: 'all 0.2s'
 }}
 >
 RGB Color
 </button>
 </div>

 {/* Self-Intersection Warning Banner */}
 {isSelfIntersecting && (
 <div style={{
 position: 'absolute',
 top: 42,
 left: 10,
 right: 10,
 zIndex: 550,
 background: 'rgba(239, 68, 68, 0.9)',
 color: '#fff',
 padding: '4px 10px',
 borderRadius: 6,
 fontSize: 10,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 6
 }}>
 <AlertTriangle size={14} />
 <span>Warning: Self-intersecting boundary detected. Drag pins to untangle field pins.</span>
 </div>
 )}

 {/* Draggable Handles Indicator */}
 {allowDraw && !isSelfIntersecting && (
 <div style={{
 position: 'absolute',
 top: 10,
 left: 260,
 zIndex: 500,
 background: 'rgba(0, 242, 254, 0.15)',
 color: '#00f2fe',
 border: '1px solid rgba(0, 242, 254, 0.4)',
 borderRadius: 8,
 padding: '4px 8px',
 fontSize: 10,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 4
 }}>
 <Move size={12} />
 <span>Drag Pins to Reshape</span>
 </div>
 )}

 {/* Telemetry Badge Top Right */}
 <div style={{
 position: 'absolute',
 top: 10,
 right: 42,
 zIndex: 500,
 background: 'rgba(11, 17, 32, 0.88)',
 backdropFilter: 'blur(8px)',
 border: '1px solid rgba(16, 185, 129, 0.4)',
 borderRadius: 8,
 padding: '4px 10px',
 color: '#10b981',
 fontSize: 11,
 fontWeight: 700,
 display: 'flex',
 alignItems: 'center',
 gap: 6
 }}>
 <span>NDVI: {ndviScore}</span>
 <span style={{ color: '#94a3b8', fontSize: 10 }}>({acres} Acres • {calculatedArea} HA)</span>
 </div>

 {/* Map Canvas Container */}
 <div ref={mapContainerRef} style={{ width: '100%', height: height }} />

 {/* Map Legend Overlay at Bottom */}
 <div style={{
 position: 'absolute',
 bottom: 8,
 left: 10,
 right: 10,
 zIndex: 500,
 background: 'rgba(6, 9, 17, 0.90)',
 backdropFilter: 'blur(6px)',
 border: '1px solid rgba(0, 242, 254, 0.25)',
 borderRadius: 8,
 padding: '6px 12px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 color: '#f8fafc'
 }}>
 <div style={{ fontSize: 9, fontWeight: 700, color: '#00f2fe', fontFamily: 'JetBrains Mono, monospace' }}>
 {activeLayer === 'ndvi' ? 'NDVI VEGETATION VIGOR' : activeLayer === 'nir' ? 'FALSE-COLOR NIR DENSITY' : 'TRUE COLOR SATELLITE'}
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 8, color: '#94a3b8' }}>0.0 LOW</span>
 <div style={{
 height: 6,
 width: 100,
 borderRadius: 3,
 background: activeLayer === 'ndvi'
 ? 'linear-gradient(to right, #d73027, #f46d43, #fdae61, #fee08b, #d9ef8b, #a6d96a, #1a9850)'
 : activeLayer === 'nir'
 ? 'linear-gradient(to right, #000000, #800000, #cc0000, #ff3333, #ff9999)'
 : 'linear-gradient(to right, #2d3748, #4a5568, #a0aec0, #cbd5e0)'
 }} />
 <span style={{ fontSize: 8, color: '#94a3b8' }}>1.0 HIGH</span>
 </div>
 </div>

 </div>
 );
}
