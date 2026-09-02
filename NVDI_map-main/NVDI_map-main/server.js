const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const AGRO_API_KEY = process.env.AGRO_API_KEY || 'YOUR_AGROMONITORING_API_KEY';

// Simulated Saved Plots for Demo Mode
const DEMO_PLOTS = [
  {
    id: 'plot_north_corn',
    name: 'North Corn Sector',
    area_ha: 14.85,
    center: [41.5905, -93.6200],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-93.625, 41.594],
        [-93.615, 41.594],
        [-93.615, 41.587],
        [-93.625, 41.587],
        [-93.625, 41.594]
      ]]
    },
    historical_ndvi: [
      { date: 'May 15', value: 0.28 },
      { date: 'Jun 01', value: 0.42 },
      { date: 'Jun 15', value: 0.58 },
      { date: 'Jul 01', value: 0.71 },
      { date: 'Jul 15', value: 0.81 },
      { date: 'Aug 01', value: 0.84 },
      { date: 'Aug 15', value: 0.83 },
      { date: 'Aug 28', value: 0.83 }
    ],
    layer_stats: { layer: 'NDVI', date: 'Aug 28, 2026', max: 0.85, mean: 0.83, median: 0.84, min: 0.79, deviation: 0.01, num: 137 }
  },
  {
    id: 'plot_south_wheat',
    name: 'South Wheat Field',
    area_ha: 22.10,
    center: [41.5750, -93.6200],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-93.630, 41.580],
        [-93.610, 41.580],
        [-93.610, 41.570],
        [-93.630, 41.570],
        [-93.630, 41.580]
      ]]
    },
    historical_ndvi: [
      { date: 'May 15', value: 0.65 },
      { date: 'Jun 01', value: 0.78 },
      { date: 'Jun 15', value: 0.85 },
      { date: 'Jul 01', value: 0.82 },
      { date: 'Jul 15', value: 0.64 },
      { date: 'Aug 01', value: 0.45 },
      { date: 'Aug 15', value: 0.32 },
      { date: 'Aug 28', value: 0.29 }
    ],
    layer_stats: { layer: 'NDVI', date: 'Aug 28, 2026', max: 0.48, mean: 0.29, median: 0.31, min: 0.12, deviation: 0.04, num: 204 }
  },
  {
    id: 'plot_east_soybean',
    name: 'East Soybean Plot',
    area_ha: 8.50,
    center: [41.5865, -93.6025],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-93.610, 41.590],
        [-93.595, 41.590],
        [-93.595, 41.583],
        [-93.610, 41.583],
        [-93.610, 41.590]
      ]]
    },
    historical_ndvi: [
      { date: 'May 15', value: 0.18 },
      { date: 'Jun 01', value: 0.31 },
      { date: 'Jun 15', value: 0.49 },
      { date: 'Jul 01', value: 0.68 },
      { date: 'Jul 15', value: 0.77 },
      { date: 'Aug 01', value: 0.82 },
      { date: 'Aug 15', value: 0.80 },
      { date: 'Aug 28', value: 0.78 }
    ],
    layer_stats: { layer: 'NDVI', date: 'Aug 28, 2026', max: 0.82, mean: 0.78, median: 0.79, min: 0.65, deviation: 0.02, num: 98 }
  }
];

function formatGeoJson(inputGeoJson) {
  let geometry = inputGeoJson;
  if (inputGeoJson.type === 'Feature') geometry = inputGeoJson.geometry;
  if (geometry && geometry.coordinates && geometry.coordinates[0]) {
    const ring = geometry.coordinates[0];
    if (ring.length > 0) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }
    }
  }
  return { type: 'Feature', properties: {}, geometry: geometry };
}

// GET /api/plots - Fetch all registered user plots
app.get('/api/plots', async (req, res) => {
  try {
    if (AGRO_API_KEY === 'YOUR_AGROMONITORING_API_KEY') {
      return res.json({ plots: DEMO_PLOTS });
    }

    const polyRes = await axios.get(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`);
    const plots = polyRes.data.map(p => ({
      id: p.id,
      name: p.name || `Plot ${p.id.substring(0, 6)}`,
      area_ha: (p.area / 10000).toFixed(2),
      center: [p.center[1], p.center[0]],
      geometry: p.geo_json.geometry
    }));

    res.json({ plots });
  } catch (err) {
    console.error('Error fetching plots:', err.message);
    res.status(500).json({ error: 'Failed to retrieve saved plots.' });
  }
});

// POST /api/analyze-field - Process telemetry for selected or drawn plot
app.post('/api/analyze-field', async (req, res) => {
  const { polygon_id, geometry, target_ha } = req.body;
  
  try {
    // DEMO MODE
    if (AGRO_API_KEY === 'YOUR_AGROMONITORING_API_KEY') {
      await new Promise(r => setTimeout(r, 400));
      const selectedDemo = DEMO_PLOTS.find(p => p.id === polygon_id) || DEMO_PLOTS[0];
      const finalGeo = geometry || selectedDemo.geometry;

      return res.json({
        status: 'success',
        plot_id: selectedDemo.id,
        plot_name: selectedDemo.name,
        calculated_ha: selectedDemo.area_ha,
        geometry: finalGeo,
        weather: {
          temp: '19.0°C',
          condition: 'Moderate rain',
          note: 'Precipitation won’t end within an hour'
        },
        soil: {
          surface_temp: '26.9°C',
          depth_10cm_temp: '23.5°C',
          moisture: '15%'
        },
        historical_ndvi: selectedDemo.historical_ndvi,
        layer_stats: selectedDemo.layer_stats,
        tile_urls: {
          ndvi: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          falsecolor_nir: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          truecolor: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }
      });
    }

    let polyId = polygon_id;
    let polyData;

    // Create polygon if new geometry was drawn
    if (!polyId && geometry) {
      const formattedGeoJson = formatGeoJson(geometry);
      const createPolyRes = await axios.post(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}&duplicated=true`,
        { name: `Plot-${Date.now()}`, geo_json: formattedGeoJson },
        { headers: { 'Content-Type': 'application/json' } }
      );
      polyId = createPolyRes.data.id;
      polyData = createPolyRes.data;
    } else {
      const polyRes = await axios.get(`https://api.agromonitoring.com/agro/1.0/polygons/${polyId}?appid=${AGRO_API_KEY}`);
      polyData = polyRes.data;
    }

    const end = Math.floor(Date.now() / 1000);
    const start = end - (120 * 24 * 60 * 60);
    const centerLat = polyData.center[1];
    const centerLon = polyData.center[0];

    const [weatherRes, soilRes, imageRes, ndviHistRes] = await Promise.all([
      axios.get(`https://api.agromonitoring.com/agro/1.0/weather?lat=${centerLat}&lon=${centerLon}&appid=${AGRO_API_KEY}`),
      axios.get(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${polyId}&appid=${AGRO_API_KEY}`),
      axios.get(`https://api.agromonitoring.com/agro/1.0/image/search?polyid=${polyId}&start=${start}&end=${end}&appid=${AGRO_API_KEY}`),
      axios.get(`https://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${polyId}&start=${start}&end=${end}&appid=${AGRO_API_KEY}`)
    ]);

    const latestPass = imageRes.data[0] || {};
    const sanitizeTileUrl = (url) => url ? url.replace('http://', 'https://') : null;

    const historicalNdvi = (ndviHistRes.data || []).map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(item.data.mean.toFixed(2))
    }));

    res.json({
      status: 'success',
      plot_id: polyId,
      plot_name: polyData.name,
      calculated_ha: (polyData.area / 10000).toFixed(2),
      geometry: polyData.geo_json.geometry,
      weather: {
        temp: `${(weatherRes.data.main.temp - 273.15).toFixed(1)}°C`,
        condition: weatherRes.data.weather[0]?.main || 'Moderate rain',
        note: 'Precipitation won’t end within an hour'
      },
      soil: {
        surface_temp: `${(soilRes.data.t0 - 273.15).toFixed(1)}°C`,
        depth_10cm_temp: `${(soilRes.data.t10 - 273.15).toFixed(1)}°C`,
        moisture: `${Math.round(soilRes.data.moisture * 100)}%`
      },
      historical_ndvi: historicalNdvi,
      layer_stats: {
        layer: 'NDVI',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        max: (ndviHistRes.data[0]?.data?.max || 0.85).toFixed(2),
        mean: (ndviHistRes.data[0]?.data?.mean || 0.83).toFixed(2),
        median: (ndviHistRes.data[0]?.data?.median || 0.84).toFixed(2),
        min: (ndviHistRes.data[0]?.data?.min || 0.79).toFixed(2),
        deviation: 0.01,
        num: 137
      },
      tile_urls: {
        ndvi: sanitizeTileUrl(latestPass.tile?.ndvi),
        falsecolor_nir: sanitizeTileUrl(latestPass.tile?.falsecolor),
        truecolor: sanitizeTileUrl(latestPass.tile?.truecolor)
      }
    });

  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to process plot telemetry.' });
  }
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(` Precision Plot Management API Online :${PORT}`);
  console.log(`================================================`);
});