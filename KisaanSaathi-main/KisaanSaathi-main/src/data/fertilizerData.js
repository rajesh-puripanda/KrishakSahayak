export const SEASONS = [
 { id: "kharif", label: "Kharif (Monsoon / June - Oct)", desc: "Rainy season, high moisture & humidity", icon: "" },
 { id: "rabi", label: "Rabi (Winter / Nov - March)", desc: "Cool weather, controlled irrigation", icon: "" },
 { id: "zaid", label: "Zaid (Summer / March - June)", desc: "High temperature, intensive watering", icon: "" }
];

export const CROPS = [
 // Vegetables
 {
 id: "tomato",
 name: "Tomato",
 label: "Tomato (टमाटर / ଟମାଟୋ)",
 category: "Vegetables",
 baseNPK: [120, 60, 80],
 daysToHarvest: 90,
 image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "onion",
 name: "Onion",
 label: "Onion (प्याज / ପିଆଜ)",
 category: "Vegetables",
 baseNPK: [100, 50, 80],
 daysToHarvest: 110,
 image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "potato",
 name: "Potato",
 label: "Potato (आलू / ଆଳୁ)",
 category: "Vegetables",
 baseNPK: [150, 80, 100],
 daysToHarvest: 100,
 image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "brinjal",
 name: "Brinjal / Eggplant",
 label: "Brinjal (बैंगन / ବାଇଗଣ)",
 category: "Vegetables",
 baseNPK: [100, 50, 50],
 daysToHarvest: 115,
 image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "chilli",
 name: "Chilli / Pepper",
 label: "Green Chilli (हरी मिर्च / ଲଙ୍କା)",
 category: "Spices & Vegetables",
 baseNPK: [120, 60, 60],
 daysToHarvest: 120,
 image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "cabbage",
 name: "Cabbage & Cauliflower",
 label: "Cabbage / Gobhi (पत्तागोभी / ବନ୍ଧାକୋବି)",
 category: "Vegetables",
 baseNPK: [120, 60, 60],
 daysToHarvest: 80,
 image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "okra",
 name: "Okra / Lady Finger",
 label: "Okra / Bhindi (भिंडी / ଭେଣ୍ଡି)",
 category: "Vegetables",
 baseNPK: [80, 40, 40],
 daysToHarvest: 65,
 image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80"
 },

 // Cereals & Grains
 {
 id: "paddy",
 name: "Paddy / Rice",
 label: "Paddy / Rice (धान / ଧାନ)",
 category: "Cereals",
 baseNPK: [100, 50, 50],
 daysToHarvest: 120,
 image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "wheat",
 name: "Wheat",
 label: "Wheat (गेहूं / ଗହମ)",
 category: "Cereals",
 baseNPK: [120, 60, 40],
 daysToHarvest: 125,
 image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "maize",
 name: "Maize / Corn",
 label: "Maize / Corn (मक्का / ମକା)",
 category: "Cereals",
 baseNPK: [120, 60, 50],
 daysToHarvest: 100,
 image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "millet",
 name: "Millets (Ragi / Bajra / Jowar)",
 label: "Millets / Ragi (मण्डुआ / ମାଣ୍ଡିଆ)",
 category: "Millets",
 baseNPK: [50, 30, 20],
 daysToHarvest: 95,
 image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
 },

 // Pulses / Legumes
 {
 id: "moong",
 name: "Green Gram / Moong Dal",
 label: "Moong Dal (मूँग / ମୁଗ)",
 category: "Pulses",
 baseNPK: [20, 40, 20],
 daysToHarvest: 65,
 image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "gram",
 name: "Chickpea / Chana",
 label: "Gram / Chana (चना / ବୁଟ)",
 category: "Pulses",
 baseNPK: [25, 50, 25],
 daysToHarvest: 105,
 image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "urad",
 name: "Black Gram / Urad",
 label: "Urad Dal (उड़द / ବିରି)",
 category: "Pulses",
 baseNPK: [20, 40, 20],
 daysToHarvest: 75,
 image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=400&q=80"
 },

 // Oilseeds & Cash Crops
 {
 id: "mustard",
 name: "Mustard / Sarson",
 label: "Mustard (सरसों / ସୋରିଷ)",
 category: "Oilseeds",
 baseNPK: [80, 40, 40],
 daysToHarvest: 105,
 image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "groundnut",
 name: "Groundnut / Peanut",
 label: "Groundnut (मूंगफली / ଚିନାବାଦାମ)",
 category: "Oilseeds",
 baseNPK: [25, 50, 75],
 daysToHarvest: 105,
 image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "cotton",
 name: "Cotton",
 label: "Cotton (कपास / କପା)",
 category: "Commercial",
 baseNPK: [150, 60, 60],
 daysToHarvest: 160,
 image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "sugarcane",
 name: "Sugarcane",
 label: "Sugarcane (गन्ना / ଆଖୁ)",
 category: "Commercial",
 baseNPK: [250, 100, 120],
 daysToHarvest: 330,
 image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "turmeric",
 name: "Turmeric / Haldi",
 label: "Turmeric (हल्दी / ହଳଦୀ)",
 category: "Spices",
 baseNPK: [120, 60, 120],
 daysToHarvest: 240,
 image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "ginger",
 name: "Ginger / Adrak",
 label: "Ginger (अदरक / ଅଦା)",
 category: "Spices",
 baseNPK: [100, 50, 100],
 daysToHarvest: 220,
 image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80"
 },
 {
 id: "banana",
 name: "Banana",
 label: "Banana (केला / କଦଳୀ)",
 category: "Horticulture",
 baseNPK: [200, 60, 300],
 daysToHarvest: 330,
 image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80"
 }
];

export const PREVIOUS_CROPS = [
 {
 id: "pulses",
 name: "Legumes / Pulses (Moong, Urad, Gram, Cowpea)",
 label: "Legumes / Pulses (दालें / ଡାଲି ଜାତୀୟ ଫସଲ)",
 nCredit: 25,
 pCredit: 10,
 note: "Biological Rhizobium nodules fixed nitrogen in root zone. Saves 20-25% urea fertilizer requirement."
 },
 {
 id: "paddy",
 name: "Paddy / Heavy Cereals (Rice, Wheat, Maize)",
 label: "Paddy / Cereals (धान / ଗହମ / ଧାନ ଜାତୀୟ)",
 nCredit: -10,
 pCredit: -5,
 note: "Heavy nutrient feeder. Topsoil nitrogen and zinc depleted. Extra basal dose recommended."
 },
 {
 id: "vegetables",
 name: "Vegetables / Solanaceous (Tomato, Brinjal, Chilli)",
 label: "Vegetables (सब्जियां / ପନିପରିବା)",
 nCredit: 0,
 pCredit: -15,
 note: "Potash and phosphorus depleted. Ensure balanced basal DAP + MOP application."
 },
 {
 id: "oilseeds",
 name: "Oilseeds (Mustard, Groundnut, Sesame)",
 label: "Oilseeds (तिलहन / ତୈଳବୀଜ)",
 nCredit: 5,
 pCredit: 0,
 note: "Moderate soil fertility impact. Adding 5kg zinc sulphate & gypsum boosts sulfur."
 },
 {
 id: "sugarcane_cotton",
 name: "Sugarcane / Cotton (Long Duration)",
 label: "Commercial Crops (गन्ना / कपास / ଆଖୁ / କପା)",
 nCredit: -20,
 pCredit: -10,
 note: "Extensive nutrient withdrawal. Substantial organic farmyard manure (FYM) required."
 },
 {
 id: "fallow",
 name: "Fallow Land / Green Manure (Dhaincha, Sunn Hemp)",
 label: "Fallow / Green Manure (परती भूमि / ସବୁଜ ଖତ)",
 nCredit: 20,
 pCredit: 5,
 note: "Soil rested & organic biomass incorporated. Boosts soil microbial activity."
 }
];

export const SOIL_TYPES = [
 { id: "alluvial_loam", label: "Loamy / Alluvial Soil (दोमट मिट्टी / ଦୋରସା ମାଟି)", nMod: 1.0, kMod: 1.0, retention: "High", splitCount: 2 },
 { id: "sandy", label: "Sandy / Sandy Loam (बलुई मिट्टी / ବାଲିଆ ମାଟି)", nMod: 1.15, kMod: 1.2, retention: "Low (leaching risk - requires split doses)", splitCount: 4 },
 { id: "black_clay", label: "Black Cotton / Heavy Clay (काली मिट्टी / କଳା ମଟାଳ ମାଟି)", nMod: 0.95, kMod: 0.85, retention: "Very High nutrient retention", splitCount: 2 },
 { id: "red_laterite", label: "Red Laterite Soil (लाल / लैटराइट मिट्टी / ଲାଲ୍ ମାଟି)", nMod: 1.1, kMod: 1.1, retention: "Medium (Acidic tendency, add lime/SSP)", splitCount: 3 }
];

/**
 * Intelligent fertilizer calculation engine supporting both preset crop IDs
 * and dynamic search / free-text entered crops.
 */
export function calculateFertilizerPlan(seasonId, cropInput, prevCropInput, soilId, farmAcres = 1) {
 // 1. Resolve Crop: Check if matching ID, matching name, or custom user text
 let crop = null;
 let customCropName = null;

 if (typeof cropInput === 'string') {
 const clean = cropInput.toLowerCase().trim();
 crop = CROPS.find(c => c.id === clean || c.name.toLowerCase().includes(clean) || c.label.toLowerCase().includes(clean));
 if (!crop) {
 customCropName = cropInput.trim();
 // Generate scientific fallback profile for arbitrary typed crop
 let baseNPK = [110, 50, 60];
 let days = 90;
 if (clean.includes('dal') || clean.includes('pulse') || clean.includes('gram') || clean.includes('bean')) {
 baseNPK = [25, 45, 25];
 days = 75;
 } else if (clean.includes('fruit') || clean.includes('tree') || clean.includes('cane') || clean.includes('mango')) {
 baseNPK = [180, 80, 150];
 days = 300;
 } else if (clean.includes('root') || clean.includes('yam') || clean.includes('radish') || clean.includes('carrot')) {
 baseNPK = [100, 50, 90];
 days = 80;
 }
 crop = {
 id: 'custom-' + clean.replace(/\s+/g, '-'),
 name: customCropName,
 label: `${customCropName} (Custom Farm Crop)`,
 category: "Farmer Specified Crop",
 baseNPK,
 daysToHarvest: days,
 image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
 };
 }
 } else if (cropInput && cropInput.baseNPK) {
 crop = cropInput;
 } else {
 crop = CROPS[0];
 }

 // 2. Resolve Previous Crop: Check preset or text
 let prev = null;
 if (typeof prevCropInput === 'string') {
 const cleanPrev = prevCropInput.toLowerCase().trim();
 prev = PREVIOUS_CROPS.find(p => p.id === cleanPrev || p.name.toLowerCase().includes(cleanPrev) || p.label.toLowerCase().includes(cleanPrev));
 if (!prev) {
 if (cleanPrev.includes('pulse') || cleanPrev.includes('dal') || cleanPrev.includes('gram') || cleanPrev.includes('moong')) {
 prev = PREVIOUS_CROPS[0]; // Legume bonus
 } else if (cleanPrev.includes('paddy') || cleanPrev.includes('rice') || cleanPrev.includes('wheat') || cleanPrev.includes('corn')) {
 prev = PREVIOUS_CROPS[1]; // Heavy feeder
 } else {
 prev = {
 id: "custom-prev",
 name: prevCropInput,
 label: prevCropInput,
 nCredit: 0,
 pCredit: 0,
 note: `Previous rotation of ${prevCropInput} accounted for in balanced basal dosage.`
 };
 }
 }
 } else {
 prev = PREVIOUS_CROPS[0];
 }

 const soil = SOIL_TYPES.find(s => s.id === soilId) || SOIL_TYPES[0];

 const toAcre = 1 / 2.47;

 let n_req = Math.max(10, (crop.baseNPK[0] - (prev.nCredit || 0)) * soil.nMod) * toAcre;
 let p_req = Math.max(10, (crop.baseNPK[1] - (prev.pCredit || 0))) * toAcre;
 let k_req = Math.max(10, (crop.baseNPK[2] * soil.kMod)) * toAcre;

 const dapKg = Math.round((p_req / 0.46) * farmAcres);
 const nSuppliedByDap = dapKg * 0.18;
 const remainingN = Math.max(0, (n_req * farmAcres) - nSuppliedByDap);
 const ureaKg = Math.round(remainingN / 0.46);
 const mopKg = Math.round((k_req / 0.60) * farmAcres);

 const basalUrea = Math.round(ureaKg * (soil.splitCount === 4 ? 0.20 : 0.33));
 const top1Urea = Math.round(ureaKg * (soil.splitCount === 4 ? 0.30 : 0.34));
 const top2Urea = Math.max(0, ureaKg - basalUrea - top1Urea);

 return {
 cropId: crop.id,
 cropName: crop.label,
 cropRawName: crop.name,
 cropImage: crop.image,
 daysToHarvest: crop.daysToHarvest,
 soilType: soil.label,
 prevCropName: prev.label || prev.name,
 prevCropNote: prev.note,
 targetNPK: `${Math.round(n_req * farmAcres)} : ${Math.round(p_req * farmAcres)} : ${Math.round(k_req * farmAcres)} kg N:P:K (for ${farmAcres} acre)`,
 totalCommercial: {
 dapKg,
 ureaKg,
 mopKg,
 zincSulphateKg: Math.round(5 * farmAcres)
 },
 schedule: {
 basal: {
 stage: "At Sowing / Seed Bed Preparation (Basal)",
 items: [
 `DAP: ${dapKg} kg (Full phosphorus requirement for strong root establishment)`,
 `MOP (Potash): ${Math.round(mopKg * 0.6)} kg (Basal potassium)`,
 `Neem Coated Urea: ${basalUrea} kg (Starter vegetative nitrogen)`,
 `Well-rotted Farmyard Manure (FYM): ${Math.round(2000 * farmAcres)} kg`
 ]
 },
 topDressing1: {
 stage: "20 - 30 Days After Sowing (Active Vegetative Tillering / Growth)",
 items: [
 `Neem Coated Urea: ${top1Urea} kg`,
 `Zinc Sulphate (21% Zn): ${Math.round(5 * farmAcres)} kg`,
 `Water application: Irrigate immediately after broadcasting`
 ]
 },
 topDressing2: {
 stage: "45 - 55 Days After Sowing (Panicle Initiation / Flowering / Fruiting)",
 items: [
 `Neem Coated Urea: ${top2Urea} kg`,
 `MOP (Remaining Potash for grain/fruit firmness): ${Math.round(mopKg * 0.4)} kg`,
 `Foliar spray: 19:19:19 water soluble NPK @ 5g/liter if dry spell persists`
 ]
 }
 },
 biofertilizers: [
 "Trichoderma viride @ 1kg/acre mixed with 50kg farmyard manure for soil-borne fungal protection.",
 "Azospirillum / Rhizobium & PSB (Phosphate Solubilizing Bacteria) seed slurry inoculation."
 ]
 };
}

