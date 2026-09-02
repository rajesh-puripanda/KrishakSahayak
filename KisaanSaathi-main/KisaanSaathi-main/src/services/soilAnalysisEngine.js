// ============================================================
// src/services/soilAnalysisEngine.js
// Client-Side Soil Analysis Engine (Government of India SHC Standards)
// ============================================================

export const SOIL_STANDARDS = {
  name: "Government of India Soil Health Card / Soil Testing Manual",
  version: "Baseline",
  pH: {
    unit: "pH",
    validRange: { min: 0, max: 14 },
    categories: [
      { classification: "Acidic", min: -Infinity, max: 6.5, maxInclusive: false },
      { classification: "Neutral", min: 6.5, max: 7.5, maxInclusive: true },
      { classification: "Alkaline", min: 7.5, max: Infinity, maxInclusive: false }
    ]
  },
  nitrogen: {
    unit: "kg/ha",
    validRange: { min: 0, max: Infinity },
    categories: [
      { classification: "Low", min: -Infinity, max: 280, maxInclusive: false },
      { classification: "Medium", min: 280, max: 560, maxInclusive: true },
      { classification: "High", min: 560, max: Infinity, maxInclusive: false }
    ]
  },
  phosphorus: {
    unit: "kg/ha",
    validRange: { min: 0, max: Infinity },
    categories: [
      { classification: "Low", min: -Infinity, max: 10, maxInclusive: false },
      { classification: "Medium", min: 10, max: 25, maxInclusive: true },
      { classification: "High", min: 25, max: 50, maxInclusive: true },
      { classification: "Very High", min: 50, max: Infinity, maxInclusive: false }
    ]
  },
  potassium: {
    unit: "kg/ha",
    validRange: { min: 0, max: Infinity },
    categories: [
      { classification: "Low", min: -Infinity, max: 120, maxInclusive: false },
      { classification: "Medium", min: 120, max: 280, maxInclusive: true },
      { classification: "High", min: 280, max: 600, maxInclusive: true },
      { classification: "Very High", min: 600, max: Infinity, maxInclusive: false }
    ]
  },
  organicCarbon: {
    unit: "%",
    validRange: { min: 0, max: Infinity },
    categories: [
      { classification: "Low", min: -Infinity, max: 0.5, maxInclusive: false },
      { classification: "Medium", min: 0.5, max: 0.75, maxInclusive: true },
      { classification: "High", min: 0.75, max: Infinity, maxInclusive: false }
    ]
  },
  electricalConductivity: {
    unit: "dS/m",
    validRange: { min: 0, max: Infinity },
    categories: [
      { classification: "Non-saline", min: -Infinity, max: 0.4, maxInclusive: false },
      { classification: "Very slightly saline", min: 0.4, max: 0.8, maxInclusive: false },
      { classification: "Moderately saline", min: 0.8, max: 1.6, maxInclusive: false },
      { classification: "Strongly saline", min: 1.6, max: Infinity, maxInclusive: false }
    ]
  }
};

export const SOIL_TEXTURES = [
  "Sandy", "Sandy Loam", "Loamy", "Silty Loam", "Clay Loam", "Clay", "Laterite", "Alluvial", "Black Cotton", "Red Soil"
];

const SUITABILITY_WEIGHTS = {
  texture: 40,
  soilReaction: 30,
  salinity: 30
};

const CONDITION_SCORES = {
  excellent: 1.0,
  good: 0.85,
  acceptable: 0.65,
  marginal: 0.4,
  unsuitable: 0.0
};

export const CROP_PROFILES = [
  {
    name: "Rice",
    category: "Cereal",
    texture: {
      excellent: ["Clay Loam", "Clay", "Alluvial"],
      good: ["Loamy", "Silty Loam"],
      acceptable: ["Sandy Loam"],
      marginal: ["Sandy", "Laterite"]
    },
    soilReaction: {
      excellent: ["Acidic", "Neutral"],
      good: [],
      acceptable: ["Alkaline"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline", "Moderately saline"],
      acceptable: [],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Maize",
    category: "Cereal",
    texture: {
      excellent: ["Loamy", "Sandy Loam", "Alluvial"],
      good: ["Clay Loam", "Red Soil"],
      acceptable: ["Clay"],
      marginal: ["Sandy"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Acidic", "Alkaline"],
      acceptable: [],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Groundnut",
    category: "Oilseed",
    texture: {
      excellent: ["Sandy Loam", "Loamy", "Red Soil"],
      good: ["Sandy", "Laterite"],
      acceptable: ["Clay Loam"],
      marginal: ["Clay"]
    },
    soilReaction: {
      excellent: ["Acidic", "Neutral"],
      good: [],
      acceptable: ["Alkaline"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Cotton",
    category: "Fibre",
    texture: {
      excellent: ["Loamy", "Clay Loam", "Black Cotton"],
      good: ["Clay"],
      acceptable: ["Sandy Loam", "Alluvial"],
      marginal: ["Sandy"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Alkaline"],
      acceptable: ["Acidic"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline", "Moderately saline"],
      acceptable: [],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Red Gram (Pigeon Pea)",
    category: "Pulse",
    texture: {
      excellent: ["Sandy Loam", "Loamy", "Red Soil"],
      good: ["Clay Loam"],
      acceptable: ["Sandy"],
      marginal: ["Clay"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Alkaline"],
      acceptable: ["Acidic"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Black Gram",
    category: "Pulse",
    texture: {
      excellent: ["Loamy", "Sandy Loam", "Alluvial"],
      good: ["Clay Loam", "Black Cotton"],
      acceptable: ["Sandy"],
      marginal: ["Clay"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Acidic", "Alkaline"],
      acceptable: [],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Green Gram",
    category: "Pulse",
    texture: {
      excellent: ["Sandy Loam", "Alluvial"],
      good: ["Loamy", "Sandy"],
      acceptable: ["Clay Loam"],
      marginal: ["Clay"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Acidic", "Alkaline"],
      acceptable: [],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Soybean",
    category: "Oilseed",
    texture: {
      excellent: ["Loamy", "Clay Loam", "Black Cotton"],
      good: ["Sandy Loam"],
      acceptable: ["Clay"],
      marginal: ["Sandy"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Acidic"],
      acceptable: ["Alkaline"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Wheat",
    category: "Cereal",
    texture: {
      excellent: ["Loamy", "Clay Loam", "Alluvial"],
      good: ["Sandy Loam"],
      acceptable: ["Clay"],
      marginal: ["Sandy"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Alkaline"],
      acceptable: ["Acidic"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  },
  {
    name: "Sugarcane",
    category: "Commercial Crop",
    texture: {
      excellent: ["Loamy", "Clay Loam", "Alluvial"],
      good: ["Clay", "Black Cotton"],
      acceptable: ["Sandy Loam"],
      marginal: ["Sandy"]
    },
    soilReaction: {
      excellent: ["Neutral"],
      good: ["Alkaline"],
      acceptable: ["Acidic"],
      marginal: []
    },
    salinity: {
      excellent: ["Non-saline"],
      good: ["Very slightly saline"],
      acceptable: ["Moderately saline"],
      marginal: ["Strongly saline"]
    }
  }
];

function isMissing(val) {
  return val === null || val === undefined || val === "";
}

export function classifyParam(value, standardKey) {
  if (isMissing(value)) return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  const std = SOIL_STANDARDS[standardKey];
  if (!std) return null;

  const cat = std.categories.find(c => {
    const meetsMin = num >= c.min;
    const meetsMax = c.maxInclusive ? num <= c.max : num < c.max;
    return meetsMin && meetsMax;
  });

  return cat ? cat.classification : null;
}

export function assessOverallFertility(classifications) {
  if (!classifications) return "Unavailable";
  const { nitrogen, phosphorus, potassium, organicCarbon } = classifications;
  const vals = [nitrogen, phosphorus, potassium, organicCarbon].filter(v => v !== null && v !== undefined);

  if (vals.length === 0) return "Unavailable";
  if (vals.some(v => v === "Low")) return "Low";

  const highCount = vals.filter(v => v === "High" || v === "Very High").length;
  if (highCount >= 3) return "High";

  return "Moderate / Good";
}

export function classifySoilSample(sample) {
  if (!sample || typeof sample !== 'object') throw new Error("Soil sample is required");

  const phVal = isMissing(sample.ph) ? null : Number(sample.ph);
  const nVal = isMissing(sample.nitrogen) ? null : Number(sample.nitrogen);
  const pVal = isMissing(sample.phosphorus) ? null : Number(sample.phosphorus);
  const kVal = isMissing(sample.potassium) ? null : Number(sample.potassium);
  const ocVal = isMissing(sample.organic_carbon) ? null : Number(sample.organic_carbon);
  const ecVal = isMissing(sample.electrical_conductivity) ? null : Number(sample.electrical_conductivity);

  const classifications = {
    ph: { value: phVal, unit: "pH", category: classifyParam(phVal, "pH") },
    nitrogen: { value: nVal, unit: "kg/ha", category: classifyParam(nVal, "nitrogen") },
    phosphorus: { value: pVal, unit: "kg/ha", category: classifyParam(pVal, "phosphorus") },
    potassium: { value: kVal, unit: "kg/ha", category: classifyParam(kVal, "potassium") },
    organicCarbon: { value: ocVal, unit: "%", category: classifyParam(ocVal, "organicCarbon") },
    electricalConductivity: { value: ecVal, unit: "dS/m", category: classifyParam(ecVal, "electricalConductivity") }
  };

  const overall = assessOverallFertility({
    nitrogen: classifications.nitrogen.category,
    phosphorus: classifications.phosphorus.category,
    potassium: classifications.potassium.category,
    organicCarbon: classifications.organicCarbon.category
  });

  return {
    standard: SOIL_STANDARDS.name,
    soilTexture: sample.soil_texture || sample.soilTexture || "Clay Loam",
    values: {
      pH: { value: phVal, unit: "pH", classification: classifications.ph.category },
      nitrogen: { value: nVal, unit: "kg/ha", classification: classifications.nitrogen.category },
      phosphorus: { value: pVal, unit: "kg/ha", classification: classifications.phosphorus.category },
      potassium: { value: kVal, unit: "kg/ha", classification: classifications.potassium.category },
      organicCarbon: { value: ocVal, unit: "%", classification: classifications.organicCarbon.category },
      electricalConductivity: { value: ecVal, unit: "dS/m", classification: classifications.electricalConductivity.category }
    },
    classifications,
    overallFertility: overall
  };
}

function evaluateCondition(value, profile) {
  if (isMissing(value) || !profile) return { score: 0, level: null, available: false };

  if (profile.excellent && profile.excellent.includes(value)) return { score: CONDITION_SCORES.excellent, level: "Excellent", available: true };
  if (profile.good && profile.good.includes(value)) return { score: CONDITION_SCORES.good, level: "Good", available: true };
  if (profile.acceptable && profile.acceptable.includes(value)) return { score: CONDITION_SCORES.acceptable, level: "Acceptable", available: true };
  if (profile.marginal && profile.marginal.includes(value)) return { score: CONDITION_SCORES.marginal, level: "Marginal", available: true };

  return { score: CONDITION_SCORES.unsuitable, level: "Unsuitable", available: true };
}

function classifySuitability(score) {
  if (score >= 80) return "Highly Suitable";
  if (score >= 65) return "Suitable";
  if (score >= 50) return "Moderately Suitable";
  if (score >= 35) return "Marginal";
  return "Unsuitable";
}

export function evaluateCropSuitability(sample) {
  const analysis = classifySoilSample(sample);
  const texture = analysis.soilTexture;
  const reaction = analysis.values.pH.classification;
  const salinity = analysis.values.electricalConductivity.classification;

  return CROP_PROFILES.map(crop => {
    const texCond = evaluateCondition(texture, crop.texture);
    const reactCond = evaluateCondition(reaction, crop.soilReaction);
    const salCond = evaluateCondition(salinity, crop.salinity);

    let totalWeight = 0;
    let earnedWeight = 0;

    if (texCond.available) {
      totalWeight += SUITABILITY_WEIGHTS.texture;
      earnedWeight += texCond.score * SUITABILITY_WEIGHTS.texture;
    }
    if (reactCond.available) {
      totalWeight += SUITABILITY_WEIGHTS.soilReaction;
      earnedWeight += reactCond.score * SUITABILITY_WEIGHTS.soilReaction;
    }
    if (salCond.available) {
      totalWeight += SUITABILITY_WEIGHTS.salinity;
      earnedWeight += salCond.score * SUITABILITY_WEIGHTS.salinity;
    }

    const finalScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    const rating = classifySuitability(finalScore);

    const limitingFactors = [];
    const positiveFactors = [];

    if (texCond.available) {
      if (texCond.level === 'Excellent' || texCond.level === 'Good') positiveFactors.push(`Soil texture (${texture})`);
      else if (texCond.level === 'Marginal' || texCond.level === 'Unsuitable') limitingFactors.push(`Texture (${texture})`);
    }
    if (reactCond.available) {
      if (reactCond.level === 'Excellent' || reactCond.level === 'Good') positiveFactors.push(`Soil pH (${reaction})`);
      else if (reactCond.level === 'Marginal' || reactCond.level === 'Unsuitable') limitingFactors.push(`pH (${reaction})`);
    }
    if (salCond.available) {
      if (salCond.level === 'Excellent' || salCond.level === 'Good') positiveFactors.push(`Salinity level (${salinity})`);
      else if (salCond.level === 'Marginal' || salCond.level === 'Unsuitable') limitingFactors.push(`Salinity (${salinity})`);
    }

    return {
      name: crop.name,
      category: crop.category,
      score: finalScore,
      rating,
      positiveFactors,
      limitingFactors,
      textureScore: texCond.level,
      reactionScore: reactCond.level,
      salinityScore: salCond.level
    };
  }).sort((a, b) => b.score - a.score);
}

export function generateRecommendations(sample) {
  const analysis = classifySoilSample(sample);
  const limitingNutrients = [];
  const nutrientDefs = [
    { key: "nitrogen", name: "Nitrogen" },
    { key: "phosphorus", name: "Phosphorus" },
    { key: "potassium", name: "Potassium" },
    { key: "organicCarbon", name: "Organic Carbon" }
  ];

  nutrientDefs.forEach(n => {
    if (analysis.values[n.key]?.classification === "Low") {
      limitingNutrients.push(n.name);
    }
  });

  const pH = analysis.values.pH;
  let reactionInterp = "Soil reaction is generally favorable.";
  if (pH.classification === 'Acidic') reactionInterp = "Soil is acidic (pH < 6.5). Acid-sensitive crops may need lime or dolomite application.";
  if (pH.classification === 'Alkaline') reactionInterp = "Soil is alkaline (pH > 7.5). Micronutrient availability (Zinc, Iron) may be restricted. Apply gypsum if sodic.";

  const ec = analysis.values.electricalConductivity;
  let salinityInterp = "Soil salinity is within normal safe range.";
  if (ec.classification === 'Moderately saline' || ec.classification === 'Strongly saline') {
    salinityInterp = `Salinity is ${ec.classification}. Ensure good drainage and leaching to prevent salt buildup.`;
  }

  return {
    overallFertility: analysis.overallFertility,
    limitingNutrients,
    soilReaction: { classification: pH.classification, value: pH.value, interpretation: reactionInterp },
    salinity: { classification: ec.classification, value: ec.value, interpretation: salinityInterp }
  };
}

export function generateManagementPlan(sample) {
  const recs = generateRecommendations(sample);

  const nutrientPlan = [];
  if (recs.limitingNutrients.length === 0) {
    nutrientPlan.push("All tested major nutrients are at Medium or High levels. Practice balanced maintenance fertilizer application.");
  } else {
    recs.limitingNutrients.forEach(n => {
      if (n === 'Nitrogen') nutrientPlan.push("Nitrogen is Low (< 280 kg/ha): Apply basal dose of DAP + split top-dressing of Neem Coated Urea at 25 and 45 DAS.");
      if (n === 'Phosphorus') nutrientPlan.push("Phosphorus is Low (< 10 kg/ha): Incorporate Single Super Phosphate (SSP) or DAP as basal dose at sowing.");
      if (n === 'Potassium') nutrientPlan.push("Potassium is Low (< 120 kg/ha): Apply Muriate of Potash (MOP) to boost disease resistance and grain quality.");
      if (n === 'Organic Carbon') nutrientPlan.push("Organic Carbon is Low (< 0.50%): Incorporate 5-10 tonnes/ha Farm Yard Manure (FYM) or green manure (Dhaincha/Sunhemp).");
    });
  }

  const reactionPlan = [];
  if (recs.soilReaction.classification === 'Acidic') {
    reactionPlan.push("Apply agricultural lime @ 2-4 quintals/acre based on buffer pH test to neutralize acidity.");
    reactionPlan.push("Prefer rock phosphate and basic slag over superphosphates in acidic soils.");
  } else if (recs.soilReaction.classification === 'Alkaline') {
    reactionPlan.push("Apply gypsum @ 1-2 tonnes/acre if exchangeable sodium percentage (ESP) is high.");
    reactionPlan.push("Use ammonium sulphate or urea to slightly lower rhizosphere pH.");
  } else {
    reactionPlan.push("Soil pH is neutral (6.5 - 7.5). Ideal for almost all Kharif and Rabi field crops.");
  }

  const organicPlan = [
    "Apply compost or vermicompost @ 2 tonnes/acre annually to build soil microbial activity.",
    "Retain crop stubble and avoid residue burning to preserve soil organic carbon."
  ];

  const salinityPlan = [];
  if (recs.salinity.classification === 'Non-saline' || recs.salinity.classification === 'Very slightly saline') {
    salinityPlan.push("Salinity is within safe range (EC < 0.8 dS/m). Maintain standard irrigation schedules.");
  } else {
    salinityPlan.push("Provide surface and subsurface drainage channels to flush accumulated salts.");
    salinityPlan.push("Use good quality low-salinity irrigation water and practice ridge planting.");
  }

  return {
    nutrientManagement: nutrientPlan,
    soilReactionManagement: reactionPlan,
    organicMatterManagement: organicPlan,
    salinityManagement: salinityPlan,
    generalGuidance: [
      "Retest soil every 2-3 years through your local Krishi Vigyan Kendra (KVK).",
      "Adopt integrated nutrient management (INM) blending organic manures with biofertilizers."
    ]
  };
}

export function generateFullReport(sample) {
  const analysis = classifySoilSample(sample);
  const cropSuitability = evaluateCropSuitability(sample);
  const recommendations = generateRecommendations(sample);
  const managementPlan = generateManagementPlan(sample);

  return {
    sampleMetadata: {
      sampleCode: sample.sample_code || 'LAB-TEST',
      latitude: sample.latitude,
      longitude: sample.longitude,
      depth: `${sample.depth_from_cm || 0}-${sample.depth_to_cm || 15} cm`,
      texture: analysis.soilTexture,
      sampleDate: sample.sample_date || new Date().toISOString().split('T')[0]
    },
    rawMeasurements: analysis.values,
    classifications: analysis.classifications,
    overallFertility: analysis.overallFertility,
    recommendations,
    cropSuitability,
    managementPlan,
    generatedAt: new Date().toISOString()
  };
}
