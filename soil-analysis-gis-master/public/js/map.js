// ============================================================
// public/js/map.js
// ============================================================
//
// Soil Analysis GIS
//
// Leaflet map management.
//
// Phase 7.5
// Thematic Spatial Analysis & Statistical Summary
//
// Built on Phase 7.4
// Thematic Map Interaction & Analysis
//
// ============================================================

// ============================================================
// GLOBAL MAP STATE
// ============================================================

let map = null;

let soilMarkers = [];

// ============================================================
// SAMPLE LABEL STATE
// ============================================================

let sampleLabelsVisible = false;

// ============================================================
// THEMATIC MAP STATE
// ============================================================

let thematicMapParameter = "standard";

let thematicMapReports = new Map();

let thematicFilterCategory = null;

// ============================================================
// PHASE 7.5
// THEMATIC ANALYSIS STATE
// ============================================================

let thematicAnalysisStats = null;

let thematicAnalysisControl = null;

// ============================================================
// THEMATIC MAP PARAMETERS
// ============================================================

const THEMATIC_MAP_PARAMETERS = [
  {
    value: "standard",
    label: "Standard Sample View",
  },
  {
    value: "ph",
    label: "pH",
  },
  {
    value: "nitrogen",
    label: "Nitrogen",
  },
  {
    value: "phosphorus",
    label: "Phosphorus",
  },
  {
    value: "potassium",
    label: "Potassium",
  },
  {
    value: "organic_carbon",
    label: "Organic Carbon",
  },
  {
    value: "electrical_conductivity",
    label: "Electrical Conductivity",
  },
];

// ============================================================
// THEMATIC PRESENTATION CATEGORIES
// ============================================================
//
// Presentation categories only.
//
// Scientific classification is supplied by the backend.
// No scientific thresholds are implemented here.
//

const THEMATIC_PRESENTATION_CATEGORIES = [
  {
    value: "high",
    label: "High",
    symbol: "H",
    cssClass: "thematic-high",
  },
  {
    value: "medium",
    label: "Medium",
    symbol: "M",
    cssClass: "thematic-medium",
  },
  {
    value: "low",
    label: "Low",
    symbol: "L",
    cssClass: "thematic-low",
  },
  {
    value: "warning",
    label: "Warning",
    symbol: "!",
    cssClass: "thematic-warning",
  },
  {
    value: "neutral",
    label: "Neutral",
    symbol: "N",
    cssClass: "thematic-neutral",
  },
  {
    value: "unavailable",
    label: "Unavailable",
    symbol: "?",
    cssClass: "thematic-unavailable",
  },
];

// ============================================================
// MAP DEFAULTS
// ============================================================

const DEFAULT_MAP_CENTER = [17.6868, 83.2185];

const DEFAULT_MAP_ZOOM = 12;

// ============================================================
// INITIALIZE MAP
// ============================================================

function initializeMap() {
  console.log("");
  console.log("==========================================");
  console.log("Initializing Soil Analysis GIS map...");
  console.log("==========================================");

  try {
    if (typeof L === "undefined") {
      throw new Error("Leaflet library is not available.");
    }

    const mapElement = document.getElementById("map");

    if (!mapElement) {
      throw new Error("Map container #map was not found.");
    }

    initializeMapControlStyles();

    map = L.map("map").setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", handleMapClick);

    initializeThematicMapControl();

    initializeSampleLabelToggleControl();

    clearMapError();

    setTimeout(() => {
      refreshMapSize();
    }, 100);

    console.log("Leaflet map initialized successfully.");

    return true;
  } catch (error) {
    console.error("Map initialization failed:", error);

    showMapError(error.message || "Unable to initialize map.");

    return false;
  }
}

// ============================================================
// MAP CONTROL STYLES
// ============================================================

function initializeMapControlStyles() {
  if (document.getElementById("soilMapControlStyles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "soilMapControlStyles";

  style.textContent = `
    /* ========================================================
       THEMATIC MAP CONTROL
       ======================================================== */

    .soil-thematic-control {
      background: rgba(255, 255, 255, 0.96);
      padding: 8px 10px;
      border-radius: 5px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
      font-size: 12px;
      line-height: 1.35;
    }

    .soil-thematic-control-title {
      font-weight: 700;
      margin-bottom: 5px;
    }

    .soil-thematic-control-select {
      width: 100%;
      min-width: 180px;
      padding: 4px 6px;
      border: 1px solid #bbb;
      border-radius: 3px;
      background: #fff;
      font-size: 11px;
    }


    /* ========================================================
       THEMATIC LEGEND
       ======================================================== */

    .soil-thematic-legend {
      background: rgba(255, 255, 255, 0.97);
      padding: 10px 12px;
      border-radius: 6px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
      min-width: 190px;
      font-size: 11px;
      line-height: 1.35;
    }

    .soil-thematic-legend-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .soil-thematic-legend-subtitle {
      font-size: 10px;
      color: #666;
      margin-bottom: 7px;
    }

    .soil-thematic-legend-categories {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .soil-thematic-legend-item {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 2px 0;
      padding: 4px 5px;
      border: 1px solid transparent;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      text-align: left;
      font-size: 11px;
      box-sizing: border-box;
      transition:
        background 0.12s ease,
        border-color 0.12s ease;
    }

    .soil-thematic-legend-item:hover {
      background: #f3f3f3;
      border-color: #ccc;
    }

    .soil-thematic-legend-item.active {
      border-color: #555;
      background: #e8e8e8;
      font-weight: 700;
    }

    .soil-thematic-legend-symbol {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-right: 7px;
      border-radius: 50%;
      border: 2px solid #333;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .soil-thematic-legend-label {
      flex: 1;
    }

    .soil-thematic-legend-count {
      min-width: 20px;
      margin-left: 6px;
      text-align: right;
      font-weight: 700;
    }

    .soil-thematic-legend-filter {
      margin-top: 7px;
      padding-top: 7px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #555;
    }

    .soil-thematic-legend-show-all {
      width: 100%;
      margin-top: 7px;
      padding: 5px 6px;
      border: 1px solid #aaa;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
    }

    .soil-thematic-legend-show-all:hover {
      background: #f1f1f1;
    }


    /* ========================================================
       THEMATIC PRESENTATION COLORS
       
       These colors represent backend classifications.
       No scientific thresholds are defined here.
       ======================================================== */

    .soil-thematic-legend-symbol.thematic-high {
      background: #2e7d32;
      border-color: #1b5e20;
      color: #fff;
    }

    .soil-thematic-legend-symbol.thematic-medium {
      background: #f9a825;
      border-color: #c17900;
      color: #111;
    }

    .soil-thematic-legend-symbol.thematic-low {
      background: #d32f2f;
      border-color: #9a0007;
      color: #fff;
    }

    .soil-thematic-legend-symbol.thematic-warning {
      background: #ef6c00;
      border-color: #b53d00;
      color: #fff;
    }

    .soil-thematic-legend-symbol.thematic-neutral {
      background: #1976d2;
      border-color: #0d47a1;
      color: #fff;
    }

    .soil-thematic-legend-symbol.thematic-unavailable {
      background: #9e9e9e;
      border-color: #616161;
      color: #fff;
    }


    /* ========================================================
       THEMATIC MAP MARKERS
       ======================================================== */

    .soil-thematic-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #333;
      background: #fff;
      font-size: 12px;
      font-weight: 700;
      box-sizing: border-box;
    }

    .soil-thematic-marker.thematic-high {
      background: #2e7d32;
      border-color: #1b5e20;
      color: #fff;
    }

    .soil-thematic-marker.thematic-medium {
      background: #f9a825;
      border-color: #c17900;
      color: #111;
    }

    .soil-thematic-marker.thematic-low {
      background: #d32f2f;
      border-color: #9a0007;
      color: #fff;
    }

    .soil-thematic-marker.thematic-warning {
      background: #ef6c00;
      border-color: #b53d00;
      color: #fff;
    }

    .soil-thematic-marker.thematic-neutral {
      background: #1976d2;
      border-color: #0d47a1;
      color: #fff;
    }

    .soil-thematic-marker.thematic-unavailable {
      background: #9e9e9e;
      border-color: #616161;
      color: #fff;
    }


    /* ========================================================
       SAMPLE LABEL CONTROL
       ======================================================== */

    .soil-sample-label-control {
      background: rgba(255, 255, 255, 0.96);
      padding: 6px 8px;
      border-radius: 5px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
      font-size: 11px;
    }

    .soil-sample-label-button {
      border: 1px solid #aaa;
      border-radius: 3px;
      background: #fff;
      padding: 4px 7px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
    }

    .soil-sample-label-button:hover {
      background: #f1f1f1;
    }

    .soil-sample-label {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #555;
      border-radius: 3px;
      padding: 2px 4px;
      font-size: 10px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .soil-sample-label.leaflet-tooltip::before {
      display: none;
    }


    /* ========================================================
       THEMATIC ANALYSIS CONTROL
       ======================================================== */

    .soil-thematic-analysis-control {
      background: rgba(255, 255, 255, 0.96);
      padding: 10px 12px;
      border-radius: 5px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
      min-width: 210px;
      max-width: 280px;
      font-size: 11px;
      line-height: 1.35;
    }

    .soil-thematic-analysis-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .soil-thematic-analysis-subtitle {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .soil-thematic-analysis-filter {
      margin-bottom: 8px;
      padding: 4px 6px;
      border-radius: 3px;
      background: #f1f1f1;
      color: #555;
      font-size: 10px;
      font-weight: 600;
    }

    .soil-thematic-analysis-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 3px 0;
    }

    .soil-thematic-analysis-label {
      color: #555;
    }

    .soil-thematic-analysis-value {
      font-weight: 700;
      text-align: right;
    }

    .soil-thematic-analysis-section {
      margin-top: 8px;
      padding-top: 7px;
      border-top: 1px solid #ddd;
    }

    .soil-thematic-analysis-section-title {
      margin-bottom: 4px;
      font-size: 11px;
      font-weight: 700;
    }

    .soil-thematic-analysis-category {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }

    .soil-thematic-analysis-note {
      margin-top: 8px;
      padding-top: 7px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 9px;
      line-height: 1.35;
    }
  `;

  document.head.appendChild(style);
}

// ============================================================
// THEMATIC MAP CONTROL
// ============================================================

let thematicMapControl = null;

function initializeThematicMapControl() {
  if (!map || thematicMapControl) {
    return;
  }

  thematicMapControl = L.control({
    position: "topright",
  });

  thematicMapControl.onAdd = function () {
    const container = L.DomUtil.create("div", "soil-thematic-control");

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    const title = document.createElement("div");

    title.className = "soil-thematic-control-title";
    title.textContent = "Thematic Map";

    container.appendChild(title);

    const select = document.createElement("select");

    select.className = "soil-thematic-control-select";
    select.id = "thematicMapParameter";

    THEMATIC_MAP_PARAMETERS.forEach((parameter) => {
      const option = document.createElement("option");

      option.value = parameter.value;
      option.textContent = parameter.label;

      if (parameter.value === thematicMapParameter) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      setThematicMapParameter(this.value);
    });

    container.appendChild(select);

    return container;
  };

  thematicMapControl.addTo(map);
}

// ============================================================
// SET THEMATIC MAP PARAMETER
// ============================================================

function setThematicMapParameter(parameter) {
  const isValid = THEMATIC_MAP_PARAMETERS.some(
    (item) => item.value === parameter,
  );

  if (!isValid) {
    console.warn("Invalid thematic map parameter:", parameter);

    return thematicMapParameter;
  }

  thematicMapParameter = parameter;

  thematicFilterCategory = null;

  console.log("Thematic map parameter changed:", thematicMapParameter);

  applyThematicMarkerSymbology();

  updateSampleMarkerLabels();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  refreshOpenThematicInspection();

  return thematicMapParameter;
}

// ============================================================
// GET THEMATIC MAP PARAMETER
// ============================================================

function getThematicMapParameter() {
  return thematicMapParameter;
}

// ============================================================
// GET THEMATIC MAP PARAMETER LABEL
// ============================================================

function getThematicMapParameterLabel() {
  const parameter = THEMATIC_MAP_PARAMETERS.find(
    (item) => item.value === thematicMapParameter,
  );

  return parameter ? parameter.label : "Standard Sample View";
}

// ============================================================
// RESET THEMATIC MAP
// ============================================================

function resetThematicMapParameter() {
  return setThematicMapParameter("standard");
}

// ============================================================
// THEMATIC REPORT SAMPLE ID RESOLUTION
// ============================================================

function getThematicReportSampleId(report) {
  if (!report || typeof report !== "object") {
    return null;
  }

  if (report.sampleId !== undefined && report.sampleId !== null) {
    return report.sampleId;
  }

  if (report.sample_id !== undefined && report.sample_id !== null) {
    return report.sample_id;
  }

  if (report.id !== undefined && report.id !== null) {
    return report.id;
  }

  if (
    report.sample &&
    report.sample.id !== undefined &&
    report.sample.id !== null
  ) {
    return report.sample.id;
  }

  return null;
}

// ============================================================
// UPDATE THEMATIC MAP DATA
// ============================================================

function updateThematicMapData(reports) {
  thematicMapReports = new Map();

  if (!Array.isArray(reports)) {
    console.warn("Thematic map reports are not an array.");

    applyThematicMarkerSymbology();
    updateSampleMarkerLabels();
    updateThematicLegend();
    updateThematicAnalysisPanel();

    return;
  }

  reports.forEach((report) => {
    const sampleId = getThematicReportSampleId(report);

    if (sampleId !== null) {
      thematicMapReports.set(String(sampleId), report);
    } else {
      console.warn(
        "Skipping thematic report because no sample ID was found:",
        report,
      );
    }
  });

  console.log("Thematic map reports updated:", thematicMapReports.size);

  applyThematicMarkerSymbology();

  updateSampleMarkerLabels();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  refreshOpenThematicInspection();
}

// ============================================================
// UPDATE SINGLE THEMATIC MAP REPORT
// ============================================================

function updateThematicMapReport(report) {
  const sampleId = getThematicReportSampleId(report);

  if (sampleId === null) {
    console.warn(
      "Cannot update thematic report because no sample ID was found:",
      report,
    );

    return;
  }

  thematicMapReports.set(String(sampleId), report);

  console.log("Thematic map report updated for sample:", sampleId);

  applyThematicMarkerSymbology();

  updateSampleMarkerLabels();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  refreshOpenThematicInspection();
}

// ============================================================
// GET THEMATIC REPORT FOR SAMPLE
// ============================================================

function getThematicReportForSample(sampleId) {
  if (sampleId === undefined || sampleId === null) {
    return null;
  }

  return thematicMapReports.get(String(sampleId)) || null;
}

// ============================================================
// GENERIC OBJECT VALUE HELPER
// ============================================================

function getFirstDefinedValue(object, keys) {
  if (!object || typeof object !== "object") {
    return undefined;
  }

  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }

  return undefined;
}

// ============================================================
// NORMALIZE THEMATIC VALUE OBJECT
// ============================================================
//
// Converts supported backend measurement representations into:
//
// {
//   value,
//   unit,
//   classification
// }
//
// Classification is NEVER calculated here.
//

function normalizeThematicValueObject(
  rawValue,
  fallbackUnit,
  classification = null,
) {
  if (rawValue === undefined || rawValue === null) {
    return null;
  }

  if (typeof rawValue === "number" || typeof rawValue === "string") {
    return {
      value: rawValue,
      unit: fallbackUnit,
      classification,
    };
  }

  if (typeof rawValue !== "object") {
    return null;
  }

  const value = getFirstDefinedValue(rawValue, [
    "value",
    "result",
    "measurement",
    "measuredValue",
    "measured_value",
    "reading",
    "amount",
  ]);

  const unit =
    getFirstDefinedValue(rawValue, ["unit", "units"]) || fallbackUnit;

  const objectClassification = getFirstDefinedValue(rawValue, [
    "classification",
    "class",
    "category",
    "status",
  ]);

  return {
    value,
    unit,
    classification: objectClassification ?? classification ?? null,
  };
}

// ============================================================
// EXTRACT CLASSIFICATION VALUE
// ============================================================

function extractClassificationValue(value) {
  if (value === undefined || value === null) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Primitive numeric/string values are treated as
   * classification values only when this function is
   * explicitly called on a classification property.
   *
   * It does NOT mean that a laboratory measurement
   * automatically becomes a classification.
   */

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const classification = getFirstDefinedValue(value, [
      "classification",
      "class",
      "category",
      "status",
      "label",
    ]);

    if (classification !== undefined && classification !== null) {
      return String(classification);
    }
  }

  return null;
}

// ============================================================
// GET BACKEND CLASSIFICATION
// ============================================================
//
// Classification is supplied by the backend.
//
// This function ONLY retrieves classification information.
// It never calculates classification from laboratory values.
//

function getBackendClassification(report, parameter) {
  if (!report) {
    return null;
  }

  const analysis = report.analysis || {};

  const analysisValues = analysis.values || {};

  const laboratoryResults = report.laboratoryResults || {};

  const parameterDefinitions = {
    ph: ["ph", "pH"],

    nitrogen: ["nitrogen", "n"],

    phosphorus: ["phosphorus", "p"],

    potassium: ["potassium", "k"],

    organic_carbon: ["organicCarbon", "organic_carbon", "oc"],

    electrical_conductivity: [
      "electricalConductivity",
      "electrical_conductivity",
      "ec",
    ],
  };

  const keys = parameterDefinitions[parameter];

  if (!keys) {
    return null;
  }

  // ----------------------------------------------------------
  // 1. analysis.values
  // ----------------------------------------------------------

  for (const key of keys) {
    const value = analysisValues[key];

    if (value !== undefined && value !== null && typeof value === "object") {
      const classification = extractClassificationValue(value);

      if (classification !== null) {
        return classification;
      }
    }
  }

  // ----------------------------------------------------------
  // 2. analysis direct properties
  // ----------------------------------------------------------

  for (const key of keys) {
    const value = analysis[key];

    if (value !== undefined && value !== null && typeof value === "object") {
      const classification = extractClassificationValue(value);

      if (classification !== null) {
        return classification;
      }
    }
  }

  // ----------------------------------------------------------
  // 3. laboratoryResults compatibility
  // ----------------------------------------------------------

  for (const key of keys) {
    const value = laboratoryResults[key];

    if (value !== undefined && value !== null && typeof value === "object") {
      const classification = extractClassificationValue(value);

      if (classification !== null) {
        return classification;
      }
    }
  }

  // ----------------------------------------------------------
  // 4. Explicit flat classification properties
  // ----------------------------------------------------------

  const flatClassificationKeys = [
    `${parameter}Classification`,
    `${parameter}_classification`,
    `classification_${parameter}`,
  ];

  const flatClassification = getFirstDefinedValue(
    report,
    flatClassificationKeys,
  );

  if (flatClassification !== undefined && flatClassification !== null) {
    return extractClassificationValue(flatClassification);
  }

  // ----------------------------------------------------------
  // 5. Explicit classification properties inside analysis
  // ----------------------------------------------------------

  const analysisClassification = getFirstDefinedValue(analysis, [
    `${parameter}Classification`,
    `${parameter}_classification`,
    `classification_${parameter}`,
  ]);

  if (analysisClassification !== undefined && analysisClassification !== null) {
    return extractClassificationValue(analysisClassification);
  }

  return null;
}

// ============================================================
// GET THEMATIC VALUE OBJECT
// ============================================================
//
// Preferred source order:
//
// 1. Complete report direct properties
// 2. laboratoryResults
// 3. analysis
// 4. report.values
//
// Backend classification is attached when available.
//
// No classification is calculated here.
//

function getThematicValueObject(report, parameter) {
  if (!report) {
    return null;
  }

  const laboratoryResults = report.laboratoryResults || {};

  const analysis = report.analysis || {};

  const values = report.values || {};

  const backendClassification = getBackendClassification(report, parameter);

  const definitions = {
    ph: {
      unit: "pH",
      reportKeys: ["ph", "pH"],
      laboratoryKeys: ["ph", "pH"],
      analysisKeys: ["ph", "pH"],
      valueKeys: ["pH", "ph"],
    },

    nitrogen: {
      unit: "kg/ha",
      reportKeys: ["nitrogen"],
      laboratoryKeys: ["nitrogen", "n"],
      analysisKeys: ["nitrogen", "n"],
      valueKeys: ["nitrogen"],
    },

    phosphorus: {
      unit: "kg/ha",
      reportKeys: ["phosphorus"],
      laboratoryKeys: ["phosphorus", "p"],
      analysisKeys: ["phosphorus", "p"],
      valueKeys: ["phosphorus"],
    },

    potassium: {
      unit: "kg/ha",
      reportKeys: ["potassium"],
      laboratoryKeys: ["potassium", "k"],
      analysisKeys: ["potassium", "k"],
      valueKeys: ["potassium"],
    },

    organic_carbon: {
      unit: "%",
      reportKeys: ["organic_carbon", "organicCarbon"],
      laboratoryKeys: ["organic_carbon", "organicCarbon", "oc"],
      analysisKeys: ["organic_carbon", "organicCarbon", "oc"],
      valueKeys: ["organicCarbon", "organic_carbon"],
    },

    electrical_conductivity: {
      unit: "dS/m",
      reportKeys: ["electrical_conductivity", "electricalConductivity", "ec"],
      laboratoryKeys: [
        "electrical_conductivity",
        "electricalConductivity",
        "ec",
      ],
      analysisKeys: ["electrical_conductivity", "electricalConductivity", "ec"],
      valueKeys: ["electricalConductivity", "electrical_conductivity", "ec"],
    },
  };

  const definition = definitions[parameter];

  if (!definition) {
    return null;
  }

  // ----------------------------------------------------------
  // 1. Complete report direct properties
  // ----------------------------------------------------------

  let rawValue = getFirstDefinedValue(report, definition.reportKeys);

  if (rawValue !== undefined) {
    return normalizeThematicValueObject(
      rawValue,
      definition.unit,
      backendClassification,
    );
  }

  // ----------------------------------------------------------
  // 2. laboratoryResults
  // ----------------------------------------------------------

  rawValue = getFirstDefinedValue(laboratoryResults, definition.laboratoryKeys);

  if (rawValue !== undefined) {
    return normalizeThematicValueObject(
      rawValue,
      definition.unit,
      backendClassification,
    );
  }

  // ----------------------------------------------------------
  // 3. analysis
  // ----------------------------------------------------------

  rawValue = getFirstDefinedValue(analysis, definition.analysisKeys);

  if (rawValue !== undefined) {
    return normalizeThematicValueObject(
      rawValue,
      definition.unit,
      backendClassification,
    );
  }

  // ----------------------------------------------------------
  // 4. report.values
  // ----------------------------------------------------------

  rawValue = getFirstDefinedValue(values, definition.valueKeys);

  if (rawValue !== undefined) {
    return normalizeThematicValueObject(
      rawValue,
      definition.unit,
      backendClassification,
    );
  }

  return null;
}

// ============================================================
// GET THEMATIC CLASSIFICATION
// ============================================================

function getThematicClassification(report, parameter) {
  if (!report) {
    return null;
  }

  const valueObject = getThematicValueObject(report, parameter);

  if (valueObject && valueObject.classification) {
    return String(valueObject.classification);
  }

  return getBackendClassification(report, parameter);
}

// ============================================================
// GET THEMATIC DISPLAY VALUE
// ============================================================

function getThematicDisplayValue(report, parameter) {
  const valueObject = getThematicValueObject(report, parameter);

  if (!valueObject) {
    return null;
  }

  if (valueObject.value !== undefined && valueObject.value !== null) {
    return valueObject.value;
  }

  if (valueObject.result !== undefined && valueObject.result !== null) {
    return valueObject.result;
  }

  if (
    valueObject.measurement !== undefined &&
    valueObject.measurement !== null
  ) {
    return valueObject.measurement;
  }

  return null;
}

// ============================================================
// GET THEMATIC UNIT
// ============================================================

function getThematicUnit(report, parameter) {
  if (report) {
    const valueObject = getThematicValueObject(report, parameter);

    if (valueObject && valueObject.unit) {
      return valueObject.unit;
    }
  }

  switch (parameter) {
    case "ph":
      return "pH";

    case "nitrogen":
    case "phosphorus":
    case "potassium":
      return "kg/ha";

    case "organic_carbon":
      return "%";

    case "electrical_conductivity":
      return "dS/m";

    default:
      return "";
  }
}

// ============================================================
// GET THEMATIC PRESENTATION CATEGORY
// ============================================================
//
// This is a presentation mapping only.
//
// Scientific classification remains backend-controlled.
//

function getThematicPresentationCategory(classification) {
  if (classification === null || classification === undefined) {
    return "unavailable";
  }

  const normalized = String(classification).trim().toLowerCase();

  switch (normalized) {
    case "high":
    case "high fertility":
    case "good":
    case "good fertility":
    case "very high":
    case "very high fertility":
      return "high";

    case "medium":
    case "moderate":
    case "moderately fertile":
    case "medium fertility":
    case "moderate fertility":
      return "medium";

    case "low":
    case "low fertility":
    case "poor":
    case "poor fertility":
    case "very low":
    case "very low fertility":
      return "low";

    case "acidic":
    case "alkaline":
    case "saline":
      return "warning";

    case "neutral":
    case "non-saline":
      return "neutral";

    default:
      return "unavailable";
  }
}

// ============================================================
// CREATE STANDARD MARKER ICON
// ============================================================

function createStandardMarkerIcon() {
  return L.divIcon({
    className: "",

    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3388ff;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.45);
        "
      ></div>
    `,

    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
}

// ============================================================
// CREATE THEMATIC MARKER ICON
// ============================================================

function createThematicMarkerIcon(category) {
  const definition = THEMATIC_PRESENTATION_CATEGORIES.find(
    (item) => item.value === category,
  );

  const symbol = definition ? definition.symbol : "?";

  const cssClass = definition ? definition.cssClass : "thematic-unavailable";

  return L.divIcon({
    className: "",

    html: `
      <div
        class="soil-thematic-marker ${cssClass}"
      >
        ${escapeHtml(symbol)}
      </div>
    `,

    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

// ============================================================
// APPLY THEMATIC MARKER SYMBOLOGY
// ============================================================

function applyThematicMarkerSymbology() {
  soilMarkers.forEach((marker) => {
    if (!marker) {
      return;
    }

    if (thematicMapParameter === "standard") {
      marker.setIcon(createStandardMarkerIcon());

      marker.thematicCategory = "standard";

      marker.thematicClassification = null;

      return;
    }

    const report = getThematicReportForSample(marker.soilSampleId);

    const classification = getThematicClassification(
      report,
      thematicMapParameter,
    );

    const category = getThematicPresentationCategory(classification);

    marker.thematicCategory = category;

    marker.thematicClassification = classification;

    marker.setIcon(createThematicMarkerIcon(category));
  });

  applyThematicMarkerFiltering();
}

// ============================================================
// SET THEMATIC FILTER CATEGORY
// ============================================================

function setThematicFilterCategory(category) {
  if (thematicMapParameter === "standard") {
    console.warn("Thematic filtering is not available in standard view.");

    return false;
  }

  const validCategory = THEMATIC_PRESENTATION_CATEGORIES.some(
    (item) => item.value === category,
  );

  if (!validCategory) {
    console.warn("Invalid thematic filter category:", category);

    return false;
  }

  if (thematicFilterCategory === category) {
    thematicFilterCategory = null;
  } else {
    thematicFilterCategory = category;
  }

  console.log("Thematic filter category:", thematicFilterCategory);

  applyThematicMarkerFiltering();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  return thematicFilterCategory;
}

// ============================================================
// CLEAR THEMATIC FILTER
// ============================================================

function clearThematicFilter() {
  thematicFilterCategory = null;

  applyThematicMarkerFiltering();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  return true;
}

// ============================================================
// GET THEMATIC FILTER CATEGORY
// ============================================================

function getThematicFilterCategory() {
  return thematicFilterCategory;
}

// ============================================================
// APPLY THEMATIC MARKER FILTERING
// ============================================================

function applyThematicMarkerFiltering() {
  soilMarkers.forEach((marker) => {
    if (!marker) {
      return;
    }

    const shouldShow =
      !thematicFilterCategory ||
      marker.thematicCategory === thematicFilterCategory;

    if (shouldShow) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
    } else {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    }
  });

  /*
   * Filtering must never alter
   * the user's label preference.
   */
  updateSampleMarkerLabels();
}

// ============================================================
// THEMATIC LEGEND CONTROL
// ============================================================

let thematicLegendControl = null;

// ============================================================
// UPDATE THEMATIC LEGEND
// ============================================================

function updateThematicLegend() {
  if (!map) {
    return;
  }

  if (thematicMapParameter === "standard") {
    removeThematicLegend();

    return;
  }

  if (!thematicLegendControl) {
    thematicLegendControl = L.control({
      position: "bottomright",
    });

    thematicLegendControl.onAdd = function () {
      const container = L.DomUtil.create("div", "soil-thematic-legend");

      L.DomEvent.disableClickPropagation(container);

      L.DomEvent.disableScrollPropagation(container);

      return container;
    };

    thematicLegendControl.addTo(map);
  }

  const container = thematicLegendControl.getContainer();

  if (!container) {
    return;
  }

  const parameterLabel = getThematicMapParameterLabel();

  const categoryCounts = getThematicCategoryCounts();

  const categories = getLegendCategoriesForParameter();

  const filterText = thematicFilterCategory
    ? `Filtered: ${getThematicCategoryLabel(thematicFilterCategory)}`
    : "Click a category to filter";

  const categoryHtml = categories
    .map((category) => {
      const definition = THEMATIC_PRESENTATION_CATEGORIES.find(
        (item) => item.value === category,
      );

      if (!definition) {
        return "";
      }

      const countValue = categoryCounts[category] || 0;

      const active = thematicFilterCategory === category;

      return `
          <button
            type="button"
            class="soil-thematic-legend-item${active ? " active" : ""}"
            data-thematic-category="${escapeHtml(category)}"
            aria-pressed="${active ? "true" : "false"}"
          >
            <span
              class="soil-thematic-legend-symbol ${definition.cssClass}"
            >
              ${escapeHtml(definition.symbol)}
            </span>

            <span
              class="soil-thematic-legend-label"
            >
              ${escapeHtml(definition.label)}
            </span>

            <span
              class="soil-thematic-legend-count"
            >
              ${countValue}
            </span>
          </button>
        `;
    })
    .join("");

  container.innerHTML = `
    <div
      class="soil-thematic-legend-title"
    >
      ${escapeHtml(parameterLabel)}
    </div>

    <div
      class="soil-thematic-legend-subtitle"
    >
      Classification from soil analysis
    </div>

    ${categoryHtml}

    <div
      class="soil-thematic-legend-filter"
    >
      ${escapeHtml(filterText)}
    </div>

    <button
      type="button"
      class="soil-thematic-legend-show-all"
      id="thematicShowAllSamples"
    >
      Show All Samples
    </button>
  `;

  const categoryButtons = container.querySelectorAll(
    "[data-thematic-category]",
  );

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setThematicFilterCategory(this.dataset.thematicCategory);
    });
  });

  const showAllButton = container.querySelector("#thematicShowAllSamples");

  if (showAllButton) {
    showAllButton.addEventListener("click", function () {
      clearThematicFilter();
    });
  }
}

// ============================================================
// GET LEGEND CATEGORIES FOR PARAMETER
// ============================================================

function getLegendCategoriesForParameter() {
  switch (thematicMapParameter) {
    case "ph":
      return ["warning", "neutral", "unavailable"];

    case "electrical_conductivity":
      return ["warning", "neutral", "unavailable"];

    default:
      return ["high", "medium", "low", "unavailable"];
  }
}

// ============================================================
// UPDATE THEMATIC LEGEND
// ============================================================

function updateThematicLegend() {
  if (!map) {
    return;
  }

  // ----------------------------------------------------------
  // STANDARD MAP
  // ----------------------------------------------------------

  if (thematicMapParameter === "standard") {
    removeThematicLegend();

    return;
  }

  // ----------------------------------------------------------
  // CREATE LEGEND CONTROL
  // ----------------------------------------------------------

  if (!thematicLegendControl) {
    thematicLegendControl = L.control({
      position: "bottomright",
    });

    thematicLegendControl.onAdd = function () {
      const container = L.DomUtil.create("div", "soil-thematic-legend");

      // ------------------------------------------------------
      // IMPORTANT:
      // Prevent legend clicks and scrolling from propagating
      // to the Leaflet map.
      //
      // This prevents clicking a legend category from opening
      // the "Add New Sample" form.
      // ------------------------------------------------------

      L.DomEvent.disableClickPropagation(container);

      L.DomEvent.disableScrollPropagation(container);

      return container;
    };

    thematicLegendControl.addTo(map);
  }

  const container = thematicLegendControl.getContainer();

  if (!container) {
    return;
  }

  // ----------------------------------------------------------
  // PARAMETER INFORMATION
  // ----------------------------------------------------------

  const parameterLabel = getThematicMapParameterLabel();

  const categoryCounts = getThematicCategoryCounts();

  const categories = getLegendCategoriesForParameter();

  const filterText = thematicFilterCategory
    ? `Filtered: ${getThematicCategoryLabel(thematicFilterCategory)}`
    : "Click a category to filter";

  // ----------------------------------------------------------
  // CATEGORY HTML
  // ----------------------------------------------------------

  const categoryHtml = categories
    .map((category) => {
      const definition = THEMATIC_PRESENTATION_CATEGORIES.find(
        (item) => item.value === category,
      );

      if (!definition) {
        return "";
      }

      const countValue = categoryCounts[category] || 0;

      const active = thematicFilterCategory === category;

      return `
        <button
          type="button"
          class="soil-thematic-legend-item${active ? " active" : ""}"
          data-thematic-category="${escapeHtml(category)}"
          aria-pressed="${active ? "true" : "false"}"
          title="Filter samples by ${escapeHtml(definition.label)}"
        >
          <span
            class="soil-thematic-legend-symbol ${definition.cssClass}"
          >
            ${escapeHtml(definition.symbol)}
          </span>

          <span
            class="soil-thematic-legend-label"
          >
            ${escapeHtml(definition.label)}
          </span>

          <span
            class="soil-thematic-legend-count"
          >
            ${countValue}
          </span>
        </button>
      `;
    })
    .join("");

  // ----------------------------------------------------------
  // LEGEND CONTENT
  // ----------------------------------------------------------

  container.innerHTML = `
    <div
      class="soil-thematic-legend-title"
    >
      ${escapeHtml(parameterLabel)}
    </div>

    <div
      class="soil-thematic-legend-subtitle"
    >
      Classification from soil analysis
    </div>

    <div
      class="soil-thematic-legend-categories"
    >
      ${categoryHtml}
    </div>

    <div
      class="soil-thematic-legend-filter"
    >
      ${escapeHtml(filterText)}
    </div>

    <button
      type="button"
      class="soil-thematic-legend-show-all"
      id="thematicShowAllSamples"
    >
      Show All Samples
    </button>
  `;

  // ----------------------------------------------------------
  // CATEGORY BUTTON EVENTS
  // ----------------------------------------------------------

  const categoryButtons = container.querySelectorAll(
    "[data-thematic-category]",
  );

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      // Prevent Leaflet map click handler.
      event.preventDefault();
      event.stopPropagation();

      const category = this.dataset.thematicCategory;

      if (!category) {
        return;
      }

      setThematicFilterCategory(category);
    });
  });

  // ----------------------------------------------------------
  // SHOW ALL BUTTON
  // ----------------------------------------------------------

  const showAllButton = container.querySelector("#thematicShowAllSamples");

  if (showAllButton) {
    showAllButton.addEventListener("click", function (event) {
      // Prevent Leaflet map click handler.
      event.preventDefault();
      event.stopPropagation();

      clearThematicFilter();
    });
  }
}
// ============================================================
// GET THEMATIC CATEGORY COUNTS
// ============================================================

function getThematicCategoryCounts() {
  const counts = {
    high: 0,
    medium: 0,
    low: 0,
    warning: 0,
    neutral: 0,
    unavailable: 0,
  };

  soilMarkers.forEach((marker) => {
    if (!marker || marker.thematicCategory === "standard") {
      return;
    }

    const category = marker.thematicCategory;

    if (Object.prototype.hasOwnProperty.call(counts, category)) {
      counts[category] += 1;
    }
  });

  return counts;
}

// ============================================================
// GET THEMATIC CATEGORY LABEL
// ============================================================

function getThematicCategoryLabel(category) {
  const definition = THEMATIC_PRESENTATION_CATEGORIES.find(
    (item) => item.value === category,
  );

  return definition ? definition.label : category;
}

// ============================================================
// REMOVE THEMATIC LEGEND
// ============================================================

function removeThematicLegend() {
  if (!map || !thematicLegendControl) {
    return;
  }

  map.removeControl(thematicLegendControl);

  thematicLegendControl = null;
}

// ============================================================
// SAMPLE LABEL TOGGLE CONTROL
// ============================================================

let sampleLabelToggleControl = null;

// ============================================================
// INITIALIZE SAMPLE LABEL TOGGLE CONTROL
// ============================================================

function initializeSampleLabelToggleControl() {
  if (!map || sampleLabelToggleControl) {
    return;
  }

  sampleLabelToggleControl = L.control({
    position: "topright",
  });

  sampleLabelToggleControl.onAdd = function () {
    const container = L.DomUtil.create("div", "soil-sample-label-control");

    L.DomEvent.disableClickPropagation(container);

    L.DomEvent.disableScrollPropagation(container);

    const button = document.createElement("button");

    button.type = "button";
    button.id = "sampleLabelToggle";
    button.className = "soil-sample-label-button";

    button.addEventListener("click", function () {
      toggleSampleLabels();
    });

    updateSampleLabelToggleButton(button);

    container.appendChild(button);

    return container;
  };

  sampleLabelToggleControl.addTo(map);
}

// ============================================================
// TOGGLE SAMPLE LABELS
// ============================================================

function toggleSampleLabels() {
  sampleLabelsVisible = !sampleLabelsVisible;

  updateSampleMarkerLabels();

  if (sampleLabelToggleControl) {
    const button = document.getElementById("sampleLabelToggle");

    if (button) {
      updateSampleLabelToggleButton(button);
    }
  }

  return sampleLabelsVisible;
}

// ============================================================
// SET SAMPLE LABEL VISIBILITY
// ============================================================

function setSampleLabelsVisible(visible) {
  sampleLabelsVisible = Boolean(visible);

  updateSampleMarkerLabels();

  if (sampleLabelToggleControl) {
    const button = document.getElementById("sampleLabelToggle");

    if (button) {
      updateSampleLabelToggleButton(button);
    }
  }

  return sampleLabelsVisible;
}

// ============================================================
// UPDATE SAMPLE LABEL TOGGLE BUTTON
// ============================================================

function updateSampleLabelToggleButton(button) {
  if (!button) {
    return;
  }

  button.textContent = sampleLabelsVisible ? "Labels: ON" : "Labels: OFF";

  button.setAttribute("aria-pressed", sampleLabelsVisible ? "true" : "false");
}

// ============================================================
// BUILD SAMPLE LABEL
// ============================================================

function buildSampleLabel(sample) {
  if (!sample) {
    return "";
  }

  return sample.sample_code || sample.sampleCode || `Sample ${sample.id || ""}`;
}

// ============================================================
// BIND SAMPLE MARKER LABEL
// ============================================================

function bindSampleMarkerLabel(marker, sample) {
  if (!marker || !sample) {
    return;
  }

  const label = buildSampleLabel(sample);

  if (!label) {
    return;
  }

  marker.bindTooltip(escapeHtml(label), {
    permanent: false,
    direction: "top",
    offset: [0, -12],
    className: "soil-sample-label",
  });
}

// ============================================================
// UPDATE SAMPLE MARKER LABELS
// ============================================================

function updateSampleMarkerLabels() {
  soilMarkers.forEach((marker) => {
    if (!marker) {
      return;
    }

    if (sampleLabelsVisible && map.hasLayer(marker)) {
      const sample = marker.soilSample;

      const label = buildSampleLabel(sample);

      if (label) {
        if (!marker.getTooltip()) {
          bindSampleMarkerLabel(marker, sample);
        }

        marker.openTooltip();
      }
    } else {
      if (marker.getTooltip()) {
        marker.closeTooltip();
      }
    }
  });
}

// ============================================================
// RESTORE SAMPLE MARKER LABEL
// ============================================================

function restoreSampleMarkerLabel(marker) {
  if (!marker) {
    return;
  }

  if (sampleLabelsVisible && map && map.hasLayer(marker)) {
    const sample = marker.soilSample;

    const label = buildSampleLabel(sample);

    if (label) {
      if (!marker.getTooltip()) {
        bindSampleMarkerLabel(marker, sample);
      }

      marker.openTooltip();
    }
  }
}

// ============================================================
// RENDER SOIL SAMPLES
// ============================================================

function renderSoilSamples(samples) {
  console.log(
    "Rendering soil samples:",
    Array.isArray(samples) ? samples.length : 0,
  );

  clearMarkers();

  if (!Array.isArray(samples)) {
    console.warn("Soil samples must be an array.");

    return;
  }

  samples.forEach((sample) => {
    addSampleMarker(sample);
  });

  applyThematicMarkerSymbology();

  updateSampleMarkerLabels();

  updateThematicLegend();

  updateThematicAnalysisPanel();

  fitMapToSamples(samples);
}

// ============================================================
// ADD SOIL SAMPLE MARKER
// ============================================================

function addSampleMarker(sample) {
  if (!map || !sample) {
    return null;
  }

  const latitude = Number(sample.latitude);

  const longitude = Number(sample.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn("Invalid sample coordinates:", sample);

    return null;
  }

  const marker = L.marker([latitude, longitude], {
    icon: createStandardMarkerIcon(),
  }).addTo(map);

  marker.soilSample = sample;

  marker.soilSampleId = sample.id;

  marker.thematicCategory = "standard";

  marker.thematicClassification = null;

  marker.bindPopup(buildSamplePopup(sample), {
    maxWidth: 360,
  });

  bindSampleMarkerLabel(marker, sample);

  marker.on("click", function () {
    handleSampleMarkerClick(sample);

    restoreSampleMarkerLabel(marker);
  });

  marker.on("popupopen", function () {
    refreshMarkerPopup(marker);

    restoreSampleMarkerLabel(marker);
  });

  marker.on("popupclose", function () {
    restoreSampleMarkerLabel(marker);
  });

  marker.on("tooltipclose", function () {
    if (sampleLabelsVisible) {
      restoreSampleMarkerLabel(marker);
    }
  });

  soilMarkers.push(marker);

  return marker;
}

// ============================================================
// HANDLE SAMPLE MARKER CLICK
// ============================================================

function handleSampleMarkerClick(sample) {
  if (typeof window.handleSoilSampleSelected === "function") {
    window.handleSoilSampleSelected(sample);
  }
}

// ============================================================
// BUILD THEMATIC INSPECTION
// ============================================================

function buildThematicInspection(sample) {
  if (!sample || thematicMapParameter === "standard") {
    return "";
  }

  const report = getThematicReportForSample(sample.id);

  const parameterLabel = getThematicMapParameterLabel();

  const value = getThematicDisplayValue(report, thematicMapParameter);

  const unit = getThematicUnit(report, thematicMapParameter);

  const classification = getThematicClassification(
    report,
    thematicMapParameter,
  );

  const category = getThematicPresentationCategory(classification);

  return `
    <div
      style="
        margin-top:10px;
        padding-top:8px;
        border-top:1px solid #ddd;
      "
    >
      <div
        style="
          font-weight:700;
          margin-bottom:5px;
        "
      >
        Thematic Inspection
      </div>

      <div>
        <strong>Parameter:</strong>
        ${escapeHtml(parameterLabel)}
      </div>

      <div>
        <strong>Measured Value:</strong>
        ${
          value !== null && value !== undefined
            ? escapeHtml(String(value))
            : "—"
        }
        ${unit ? ` ${escapeHtml(unit)}` : ""}
      </div>

      <div>
        <strong>Classification:</strong>
        ${classification ? escapeHtml(String(classification)) : "—"}
      </div>

      <div>
        <strong>Map Category:</strong>
        ${escapeHtml(getThematicCategoryLabel(category))}
      </div>
    </div>
  `;
}

// ============================================================
// BUILD SAMPLE POPUP
// ============================================================

function buildSamplePopup(sample) {
  if (!sample) {
    return "No sample information available.";
  }

  const latitude = Number(sample.latitude);
  const longitude = Number(sample.longitude);

  const depthFrom = sample.depth_from_cm ?? sample.depthFromCm ?? "—";

  const depthTo = sample.depth_to_cm ?? sample.depthToCm ?? "—";

  const pH = sample.ph ?? sample.pH ?? "—";

  const nitrogen = sample.nitrogen ?? "—";

  const phosphorus = sample.phosphorus ?? "—";

  const potassium = sample.potassium ?? "—";

  const organicCarbon = sample.organic_carbon ?? sample.organicCarbon ?? "—";

  const electricalConductivity =
    sample.electrical_conductivity ?? sample.electricalConductivity ?? "—";

  const texture = sample.texture ?? sample.soil_texture ?? "—";

  const sampleCode =
    sample.sample_code ?? sample.sampleCode ?? `Sample ${sample.id ?? "—"}`;

  const formattedLatitude = Number.isFinite(latitude)
    ? latitude.toFixed(5)
    : "—";

  const formattedLongitude = Number.isFinite(longitude)
    ? longitude.toFixed(5)
    : "—";

  return `
    <div
      style="
        font-size:12px;
        line-height:1.45;
      "
    >
      <div
        style="
          font-size:14px;
          font-weight:700;
          margin-bottom:7px;
        "
      >
        ${escapeHtml(String(sampleCode))}
      </div>

      <div>
        <strong>Location:</strong>
        ${formattedLatitude},
        ${formattedLongitude}
      </div>

      <div>
        <strong>Depth:</strong>
        ${escapeHtml(String(depthFrom))}
        –
        ${escapeHtml(String(depthTo))} cm
      </div>

      <div
        style="
          margin-top:7px;
          padding-top:6px;
          border-top:1px solid #ddd;
        "
      >
        <strong>Soil Properties</strong>
      </div>

      <div>
        <strong>pH:</strong>
        ${escapeHtml(String(pH))}
      </div>

      <div>
        <strong>Nitrogen:</strong>
        ${escapeHtml(String(nitrogen))} kg/ha
      </div>

      <div>
        <strong>Phosphorus:</strong>
        ${escapeHtml(String(phosphorus))} kg/ha
      </div>

      <div>
        <strong>Potassium:</strong>
        ${escapeHtml(String(potassium))} kg/ha
      </div>

      <div>
        <strong>Organic Carbon:</strong>
        ${escapeHtml(String(organicCarbon))} %
      </div>

      <div>
        <strong>Electrical Conductivity:</strong>
        ${escapeHtml(String(electricalConductivity))} dS/m
      </div>

      <div>
        <strong>Texture:</strong>
        ${escapeHtml(String(texture))}
      </div>

      ${buildThematicInspection(sample)}
    </div>
  `;
}

// ============================================================
// REFRESH MARKER POPUP
// ============================================================

function refreshMarkerPopup(marker) {
  if (!marker || !marker.soilSample) {
    return;
  }

  marker.setPopupContent(buildSamplePopup(marker.soilSample));
}

// ============================================================
// REFRESH OPEN THEMATIC INSPECTION
// ============================================================

function refreshOpenThematicInspection() {
  soilMarkers.forEach((marker) => {
    if (!marker) {
      return;
    }

    if (map && map.hasLayer(marker) && marker.isPopupOpen()) {
      refreshMarkerPopup(marker);
    }
  });
}

// ============================================================
// PHASE 7.5
// THEMATIC SPATIAL ANALYSIS & STATISTICAL SUMMARY
// ============================================================

// ============================================================
// GET THEMATIC STATISTIC UNIT
// ============================================================

function getThematicStatisticUnit(parameter) {
  return getThematicUnit(null, parameter);
}

// ============================================================
// GET NUMERIC THEMATIC VALUE
// ============================================================

function getNumericThematicValue(report, parameter) {
  const value = getThematicDisplayValue(report, parameter);

  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
}

// ============================================================
// FORMAT THEMATIC STATISTIC VALUE
// ============================================================

function formatThematicStatisticValue(value, parameter) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  const unit = getThematicStatisticUnit(parameter);

  if (!unit) {
    return numericValue.toFixed(2);
  }

  return `${numericValue.toFixed(2)} ${unit}`;
}

// ============================================================
// GET THEMATIC REPORT CATEGORY
// ============================================================

function getThematicReportCategory(report, parameter) {
  const classification = getThematicClassification(report, parameter);

  return getThematicPresentationCategory(classification);
}

// ============================================================
// GET REPORTS PARTICIPATING IN ANALYSIS
// ============================================================

function getThematicAnalysisReports() {
  if (thematicMapParameter === "standard") {
    return [];
  }

  const reports = Array.from(thematicMapReports.values());

  if (!thematicFilterCategory) {
    return reports;
  }

  return reports.filter((report) => {
    return (
      getThematicReportCategory(report, thematicMapParameter) ===
      thematicFilterCategory
    );
  });
}

// ============================================================
// CALCULATE THEMATIC ANALYSIS STATISTICS
// ============================================================

function calculateThematicAnalysisStats() {
  if (thematicMapParameter === "standard") {
    return null;
  }

  const parameter = thematicMapParameter;

  const reports = getThematicAnalysisReports();

  const categoryCounts = {
    high: 0,
    medium: 0,
    low: 0,
    warning: 0,
    neutral: 0,
    unavailable: 0,
  };

  const values = [];

  reports.forEach((report) => {
    const category = getThematicReportCategory(report, parameter);

    if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
      categoryCounts[category] += 1;
    }

    const numericValue = getNumericThematicValue(report, parameter);

    if (numericValue !== null) {
      values.push(numericValue);
    }
  });

  let minimum = null;
  let maximum = null;
  let average = null;

  if (values.length > 0) {
    minimum = Math.min(...values);

    maximum = Math.max(...values);

    const total = values.reduce((sum, value) => sum + value, 0);

    average = total / values.length;
  }

  return {
    parameter,

    parameterLabel: getThematicMapParameterLabel(),

    filterCategory: thematicFilterCategory,

    sampleCount: reports.length,

    measuredSampleCount: values.length,

    average,

    minimum,

    maximum,

    categoryCounts,
  };
}

// ============================================================
// GET THEMATIC ANALYSIS STATISTICS
// ============================================================

function getThematicAnalysisStats() {
  thematicAnalysisStats = calculateThematicAnalysisStats();

  return thematicAnalysisStats;
}

// ============================================================
// INITIALIZE THEMATIC ANALYSIS CONTROL
// ============================================================

function initializeThematicAnalysisControl() {
  if (!map) {
    return null;
  }

  if (thematicAnalysisControl) {
    return thematicAnalysisControl;
  }

  thematicAnalysisControl = L.control({
    position: "bottomleft",
  });

  thematicAnalysisControl.onAdd = function () {
    const container = L.DomUtil.create("div", "soil-thematic-analysis-control");

    container.id = "soilThematicAnalysis";

    L.DomEvent.disableClickPropagation(container);

    L.DomEvent.disableScrollPropagation(container);

    return container;
  };

  thematicAnalysisControl.addTo(map);

  return thematicAnalysisControl;
}

// ============================================================
// REMOVE THEMATIC ANALYSIS CONTROL
// ============================================================

function removeThematicAnalysisControl() {
  if (!map || !thematicAnalysisControl) {
    return;
  }

  map.removeControl(thematicAnalysisControl);

  thematicAnalysisControl = null;
}

// ============================================================
// UPDATE THEMATIC ANALYSIS PANEL
// ============================================================

function updateThematicAnalysisPanel() {
  if (!map) {
    return;
  }

  if (thematicMapParameter === "standard") {
    thematicAnalysisStats = null;

    removeThematicAnalysisControl();

    return;
  }

  initializeThematicAnalysisControl();

  if (!thematicAnalysisControl) {
    return;
  }

  const container = document.getElementById("soilThematicAnalysis");

  if (!container) {
    return;
  }

  thematicAnalysisStats = calculateThematicAnalysisStats();

  if (!thematicAnalysisStats) {
    return;
  }

  const stats = thematicAnalysisStats;

  const filterText = stats.filterCategory
    ? `Filtered category: ${getThematicCategoryLabel(stats.filterCategory)}`
    : "All thematic samples";

  const legendCategories = getLegendCategoriesForParameter();

  const categoryRows = legendCategories
    .map((category) => {
      const count = stats.categoryCounts[category] || 0;

      const definition = THEMATIC_PRESENTATION_CATEGORIES.find(
        (item) => item.value === category,
      );

      const label = definition ? definition.label : category;

      return `
          <div
            class="soil-thematic-analysis-category"
          >
            <span>
              ${escapeHtml(label)}
            </span>

            <strong>
              ${count}
            </strong>
          </div>
        `;
    })
    .join("");

  container.innerHTML = `
    <div
      class="soil-thematic-analysis-title"
    >
      Thematic Analysis
    </div>

    <div
      class="soil-thematic-analysis-subtitle"
    >
      ${escapeHtml(stats.parameterLabel)}
    </div>

    <div
      class="soil-thematic-analysis-filter"
    >
      ${escapeHtml(filterText)}
    </div>

    <div
      class="soil-thematic-analysis-row"
    >
      <span
        class="soil-thematic-analysis-label"
      >
        Samples
      </span>

      <span
        class="soil-thematic-analysis-value"
      >
        ${stats.sampleCount}
      </span>
    </div>

    <div
      class="soil-thematic-analysis-row"
    >
      <span
        class="soil-thematic-analysis-label"
      >
        Measured
      </span>

      <span
        class="soil-thematic-analysis-value"
      >
        ${stats.measuredSampleCount}
      </span>
    </div>

    <div
      class="soil-thematic-analysis-row"
    >
      <span
        class="soil-thematic-analysis-label"
      >
        Average
      </span>

      <span
        class="soil-thematic-analysis-value"
      >
        ${formatThematicStatisticValue(stats.average, stats.parameter)}
      </span>
    </div>

    <div
      class="soil-thematic-analysis-row"
    >
      <span
        class="soil-thematic-analysis-label"
      >
        Minimum
      </span>

      <span
        class="soil-thematic-analysis-value"
      >
        ${formatThematicStatisticValue(stats.minimum, stats.parameter)}
      </span>
    </div>

    <div
      class="soil-thematic-analysis-row"
    >
      <span
        class="soil-thematic-analysis-label"
      >
        Maximum
      </span>

      <span
        class="soil-thematic-analysis-value"
      >
        ${formatThematicStatisticValue(stats.maximum, stats.parameter)}
      </span>
    </div>

    <div
      class="soil-thematic-analysis-section"
    >
      <div
        class="soil-thematic-analysis-section-title"
      >
        Classification Distribution
      </div>

      ${categoryRows}
    </div>

    <div
      class="soil-thematic-analysis-note"
    >
      Statistics are calculated from
      available measured sample values.
      No interpolation or geostatistical
      surface is generated in this phase.
    </div>
  `;
}

// ============================================================
// REFRESH THEMATIC ANALYSIS
// ============================================================

function refreshThematicAnalysis() {
  thematicAnalysisStats = calculateThematicAnalysisStats();

  updateThematicAnalysisPanel();

  return thematicAnalysisStats;
}

// ============================================================
// FIT MAP TO SAMPLES
// ============================================================

function fitMapToSamples(samples) {
  if (!map || !Array.isArray(samples) || samples.length === 0) {
    return;
  }

  const validCoordinates = samples
    .map((sample) => {
      const latitude = Number(sample.latitude);

      const longitude = Number(sample.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return [latitude, longitude];
    })
    .filter(Boolean);

  if (validCoordinates.length === 0) {
    return;
  }

  if (validCoordinates.length === 1) {
    map.setView(validCoordinates[0], 14);

    return;
  }

  const bounds = L.latLngBounds(validCoordinates);

  map.fitBounds(bounds, {
    padding: [30, 30],
    maxZoom: 15,
  });
}

// ============================================================
// CLEAR ALL SAMPLE MARKERS
// ============================================================

function clearMarkers() {
  soilMarkers.forEach((marker) => {
    if (map && map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });

  soilMarkers = [];

  thematicMapReports.clear();

  thematicFilterCategory = null;

  thematicAnalysisStats = null;

  updateThematicLegend();

  updateThematicAnalysisPanel();
}

// ============================================================
// GET SAMPLE MARKER
// ============================================================

function getSampleMarker(sampleId) {
  if (sampleId === undefined || sampleId === null) {
    return null;
  }

  return (
    soilMarkers.find(
      (marker) => marker && String(marker.soilSampleId) === String(sampleId),
    ) || null
  );
}

// ============================================================
// FOCUS SAMPLE MARKER
// ============================================================

function focusSampleMarker(sampleId) {
  const marker = getSampleMarker(sampleId);

  if (!marker || !map) {
    return false;
  }

  if (
    thematicFilterCategory &&
    marker.thematicCategory !== thematicFilterCategory
  ) {
    clearThematicFilter();
  }

  const latitude = marker.getLatLng().lat;

  const longitude = marker.getLatLng().lng;

  map.setView([latitude, longitude], Math.max(map.getZoom(), 14));

  marker.openPopup();

  restoreSampleMarkerLabel(marker);

  return true;
}

// ============================================================
// REFRESH MAP SIZE
// ============================================================

function refreshMapSize() {
  if (!map) {
    return;
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

// ============================================================
// HANDLE MAP CLICK
// ============================================================

function handleMapClick(event) {
  const latitude = event.latlng.lat;

  const longitude = event.latlng.lng;

  console.log("Map clicked:", latitude, longitude);

  if (typeof openAddSampleForm === "function") {
    openAddSampleForm(latitude, longitude);
  } else {
    console.error("openAddSampleForm() is not available in app.js.");
  }
}

// ============================================================
// SHOW MAP ERROR
// ============================================================

function showMapError(message) {
  const element = document.getElementById("mapError");

  if (!element) {
    return;
  }

  element.textContent = message || "Unable to load map.";

  element.classList.remove("hidden");
}

// ============================================================
// CLEAR MAP ERROR
// ============================================================

function clearMapError() {
  const element = document.getElementById("mapError");

  if (!element) {
    return;
  }

  element.textContent = "";

  element.classList.add("hidden");
}

// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
// PUBLIC API
// ============================================================

window.initializeMap = initializeMap;

window.renderSoilSamples = renderSoilSamples;

window.addSampleMarker = addSampleMarker;

window.focusSampleMarker = focusSampleMarker;

window.getSampleMarker = getSampleMarker;

window.refreshMapSize = refreshMapSize;

// ============================================================
// SAMPLE LABEL PUBLIC API
// ============================================================

window.toggleSampleLabels = toggleSampleLabels;

window.setSampleLabelsVisible = setSampleLabelsVisible;

window.areSampleLabelsVisible = () => sampleLabelsVisible;

// ============================================================
// THEMATIC MAP PUBLIC API
// ============================================================

window.setThematicMapParameter = setThematicMapParameter;

window.getThematicMapParameter = getThematicMapParameter;

window.getThematicMapParameterLabel = getThematicMapParameterLabel;

window.resetThematicMapParameter = resetThematicMapParameter;

window.updateThematicMapData = updateThematicMapData;

window.updateThematicMapReport = updateThematicMapReport;

window.getThematicReportForSample = getThematicReportForSample;

// ============================================================
// THEMATIC FILTER PUBLIC API
// ============================================================

window.setThematicFilterCategory = setThematicFilterCategory;

window.clearThematicFilter = clearThematicFilter;

window.getThematicFilterCategory = getThematicFilterCategory;

// ============================================================
// PHASE 7.5 PUBLIC API
// ============================================================

window.getThematicAnalysisStats = getThematicAnalysisStats;

window.refreshThematicAnalysis = refreshThematicAnalysis;

// ============================================================
// FINAL LOAD MESSAGE
// ============================================================

console.log(
  "map.js loaded successfully. Phase 7.5 thematic spatial analysis and statistical summary enabled.",
);
