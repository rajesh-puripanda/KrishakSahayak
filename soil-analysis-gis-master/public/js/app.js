// ============================================================
// public/js/app.js
// ============================================================
//
// Soil Analysis GIS
//
// Phase 7.2
// Thematic Marker Symbology Integration
//
// Responsibilities:
//
//   1. Initialize application
//   2. Initialize modal
//   3. Handle soil sample form
//   4. Load soil samples
//   5. Update dashboard statistics
//   6. Render soil samples through map.js
//   7. Handle selected soil sample
//   8. Load complete soil analysis reports
//   9. Render laboratory analysis classifications
//  10. Render soil interpretation
//  11. Render management observations
//  12. Render crop suitability
//  13. Render soil management plan
//  14. Send backend analysis classifications to map.js
//
// IMPORTANT:
//
// Scientific classification and interpretation rules remain
// exclusively in the backend.
//
// The frontend does NOT implement scientific thresholds.
//
// The dashboard consumes:
//
//   GET /api/soil-analysis/sample/:id/report
//
// map.js must be loaded BEFORE app.js.
//
// ============================================================

// ============================================================
// APPLICATION STATE
// ============================================================

let selectedSoilSample = null;

// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", initializeApplication);

// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

async function initializeApplication() {
  console.log("");
  console.log("========================================");
  console.log(" SOIL ANALYSIS GIS FRONTEND");
  console.log("========================================");

  try {
    initializeModal();

    initializeSampleForm();

    initializeRefreshButton();

    initializeSelectedSamplePanel();

    // --------------------------------------------------------
    // Initialize Leaflet map
    // --------------------------------------------------------

    if (typeof initializeMap === "function") {
      console.log("Initializing map through map.js...");

      const initialized = initializeMap();

      if (!initialized) {
        console.error("Map initialization failed.");
      }
    } else {
      console.error(
        "initializeMap() is not available. " +
          "Check that map.js is loaded before app.js.",
      );
    }

    // --------------------------------------------------------
    // Load application data
    // --------------------------------------------------------

    await loadSoilSamples();

    console.log("Frontend initialization completed.");
  } catch (error) {
    console.error("Frontend initialization failed:", error);
  }
}

// ============================================================
// MODAL
// ============================================================

function initializeModal() {
  const modal = document.getElementById("soilSampleModal");

  const closeButton = document.getElementById("closeModal");

  const cancelButton = document.getElementById("cancelSample");

  if (!modal) {
    console.warn("Soil sample modal was not found.");

    return;
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeAddSampleForm);
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", closeAddSampleForm);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeAddSampleForm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeAddSampleForm();
    }
  });
}

// ============================================================
// OPEN ADD SAMPLE FORM
// ============================================================

function openAddSampleForm(latitude, longitude) {
  const modal = document.getElementById("soilSampleModal");

  const latitudeInput = document.getElementById("latitude");

  const longitudeInput = document.getElementById("longitude");

  const sampleDateInput = document.getElementById("sampleDate");

  const formError = document.getElementById("formError");

  if (!modal) {
    return;
  }

  if (latitudeInput) {
    latitudeInput.value = Number(latitude).toFixed(7);
  }

  if (longitudeInput) {
    longitudeInput.value = Number(longitude).toFixed(7);
  }

  if (sampleDateInput && !sampleDateInput.value) {
    sampleDateInput.value = getTodayDate();
  }

  if (formError) {
    formError.textContent = "";

    formError.classList.add("hidden");
  }

  modal.classList.remove("hidden");

  const sampleCode = document.getElementById("sampleCode");

  if (sampleCode) {
    sampleCode.focus();
  }
}

// ============================================================
// CLOSE ADD SAMPLE FORM
// ============================================================

function closeAddSampleForm() {
  const modal = document.getElementById("soilSampleModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}

// ============================================================
// SAMPLE FORM
// ============================================================

function initializeSampleForm() {
  const form = document.getElementById("soilSampleForm");

  if (!form) {
    console.warn("Soil sample form was not found.");

    return;
  }

  form.addEventListener("submit", handleSampleFormSubmit);
}

// ============================================================
// FORM SUBMISSION
// ============================================================

async function handleSampleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const saveButton = document.getElementById("saveSample");

  clearFormError();

  const formData = new FormData(form);

  const payload = buildSamplePayload(formData);

  const validationError = validateSamplePayload(payload);

  if (validationError) {
    showFormError(validationError);

    return;
  }

  try {
    if (saveButton) {
      saveButton.disabled = true;

      saveButton.textContent = "Saving...";
    }

    console.log("Creating soil sample:", payload);

    const response = await fetch("/api/soil-samples", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Accept: "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Create soil sample response:", result);

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          (Array.isArray(result.errors)
            ? result.errors.join(", ")
            : "Failed to save soil sample."),
      );
    }

    console.log("Soil sample created:", result.data);

    closeAddSampleForm();

    form.reset();

    await loadSoilSamples();

    if (
      result.data &&
      result.data.id !== undefined &&
      typeof focusSampleMarker === "function"
    ) {
      focusSampleMarker(result.data.id);
    }
  } catch (error) {
    console.error("Save soil sample failed:", error);

    showFormError(error.message || "Failed to save soil sample.");
  } finally {
    if (saveButton) {
      saveButton.disabled = false;

      saveButton.textContent = "Save Sample";
    }
  }
}

// ============================================================
// BUILD SAMPLE PAYLOAD
// ============================================================

function buildSamplePayload(formData) {
  return {
    sample_code: cleanString(formData.get("sample_code")),

    latitude: numberOrNull(formData.get("latitude")),

    longitude: numberOrNull(formData.get("longitude")),

    depth_from_cm: numberOrNull(formData.get("depth_from_cm")),

    depth_to_cm: numberOrNull(formData.get("depth_to_cm")),

    sample_date: cleanString(formData.get("sample_date")) || null,

    ph: numberOrNull(formData.get("ph")),

    nitrogen: numberOrNull(formData.get("nitrogen")),

    phosphorus: numberOrNull(formData.get("phosphorus")),

    potassium: numberOrNull(formData.get("potassium")),

    organic_carbon: numberOrNull(formData.get("organic_carbon")),

    electrical_conductivity: numberOrNull(
      formData.get("electrical_conductivity"),
    ),

    soil_texture: cleanString(formData.get("soil_texture")) || null,
  };
}

// ============================================================
// VALIDATE SAMPLE PAYLOAD
// ============================================================

function validateSamplePayload(payload) {
  if (!payload.sample_code) {
    return "Sample Code is required.";
  }

  if (payload.latitude === null || payload.longitude === null) {
    return "Sample coordinates are required.";
  }

  if (payload.latitude < -90 || payload.latitude > 90) {
    return "Latitude must be between -90 and 90.";
  }

  if (payload.longitude < -180 || payload.longitude > 180) {
    return "Longitude must be between -180 and 180.";
  }

  if (
    payload.depth_from_cm !== null &&
    payload.depth_to_cm !== null &&
    payload.depth_to_cm < payload.depth_from_cm
  ) {
    return "Ending depth cannot be less than starting depth.";
  }

  if (payload.ph !== null && (payload.ph < 0 || payload.ph > 14)) {
    return "pH must be between 0 and 14.";
  }

  return null;
}

// ============================================================
// LOAD SOIL SAMPLES
// ============================================================

let soilSamplesLoadingPromise = null;

async function loadSoilSamples() {
  if (soilSamplesLoadingPromise) {
    console.log("Soil samples request already in progress.");

    return soilSamplesLoadingPromise;
  }

  soilSamplesLoadingPromise = (async () => {
    try {
      console.log("Loading soil samples from API...");

      const response = await fetch("/api/soil-samples", {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        cache: "no-store",
      });

      const result = await response.json();

      console.log("Soil samples API response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to retrieve soil samples.");
      }

      const samples = Array.isArray(result.data) ? result.data : [];

      console.log(`Loaded ${samples.length} soil sample(s).`);

      // ----------------------------------------------------
      // Statistics
      //
      // Statistics use laboratory measurements only.
      //
      // No scientific classification threshold is applied here.
      // ----------------------------------------------------

      updateStatistics(samples);

      // ----------------------------------------------------
      // Map
      // ----------------------------------------------------

      renderSamplesOnMap(samples);

      // ----------------------------------------------------
      // Selection
      // ----------------------------------------------------

      synchronizeSelectedSample(samples);

      // ----------------------------------------------------
      // Complete analysis reports
      // ----------------------------------------------------

      await loadSoilAnalysis(samples);

      return samples;
    } catch (error) {
      console.error("Failed to load soil samples:", error);

      updateStatistics([]);

      clearSelectedSoilSample();

      renderAnalysisError(error.message);

      renderRecommendationError(error.message);

      renderCropSuitabilityError(error.message);

      renderSoilManagementError(error.message);

      throw error;
    } finally {
      soilSamplesLoadingPromise = null;
    }
  })();

  return soilSamplesLoadingPromise;
}

// ============================================================
// RENDER SAMPLES ON MAP
// ============================================================

function renderSamplesOnMap(samples) {
  if (typeof renderSoilSamples !== "function") {
    console.error(
      "renderSoilSamples() is not available. " +
        "Check that map.js is loaded before app.js.",
    );

    return;
  }

  console.log(`Sending ${samples.length} soil sample(s) to map.js...`);

  try {
    renderSoilSamples(samples);
  } catch (error) {
    console.error("renderSoilSamples() failed:", error);
  }
}

// ============================================================
// REFRESH BUTTON
// ============================================================

function initializeRefreshButton() {
  const refreshButton = document.getElementById("refreshMap");

  if (!refreshButton) {
    console.warn("Refresh button was not found.");

    return;
  }

  refreshButton.addEventListener("click", async () => {
    refreshButton.disabled = true;

    const originalText = refreshButton.textContent;

    refreshButton.textContent = "Loading...";

    try {
      await loadSoilSamples();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      refreshButton.disabled = false;

      refreshButton.textContent = originalText;
    }
  });
}

// ============================================================
// SELECTED SOIL SAMPLE
// ============================================================

function initializeSelectedSamplePanel() {
  const container = document.getElementById("selectedSampleContainer");

  if (!container) {
    console.warn("Selected soil sample container was not found.");

    return;
  }

  renderSelectedSampleEmpty();
}

// ============================================================
// MAP -> APP CALLBACK
// ============================================================
//
// map.js calls:
//
//     window.handleSoilSampleSelected(sample)
//
// when an existing sample marker is clicked.
//
// ============================================================

window.handleSoilSampleSelected = function handleSoilSampleSelected(sample) {
  if (!sample) {
    return;
  }

  console.log("Application selected soil sample:", sample);

  selectedSoilSample = sample;

  renderSelectedSoilSample(sample);

  // ----------------------------------------------------------
  // Load the complete report for the selected sample.
  // ----------------------------------------------------------

  loadSelectedSampleReport(sample.id);
};

// ============================================================
// LOAD SELECTED SAMPLE REPORT
// ============================================================
//
// The selected sample uses the same consolidated report API
// as the dashboard.
//
// ============================================================

async function loadSelectedSampleReport(sampleId) {
  if (sampleId === null || sampleId === undefined) {
    return;
  }

  try {
    console.log(`Loading complete report for selected sample ${sampleId}...`);

    const report = await loadCompleteSoilReport(sampleId);

    console.log("Selected sample complete report:", report);

    // --------------------------------------------------------
    // Update selected sample using authoritative report data
    // --------------------------------------------------------

    if (report.sample) {
      selectedSoilSample = {
        ...selectedSoilSample,
        ...report.sample,
      };

      renderSelectedSoilSample(selectedSoilSample);
    }

    // --------------------------------------------------------
    // Update thematic map data for this report.
    //
    // map.js remains responsible for visual presentation.
    //
    // No classification rules are implemented here.
    // --------------------------------------------------------

    if (typeof updateThematicMapReport === "function") {
      updateThematicMapReport(report);
    }

    // --------------------------------------------------------
    // Render the report into the dashboard.
    //
    // These functions accept one report and therefore allow
    // the selected sample to be refreshed independently.
    // --------------------------------------------------------

    renderSingleSoilAnalysisReport(report);

    renderSingleSoilInterpretationReport(report);

    renderSingleCropSuitabilityReport(report);

    renderSingleSoilManagementReport(report);
  } catch (error) {
    console.error(
      `Failed to load complete report for selected sample ${sampleId}:`,
      error,
    );
  }
}

// ============================================================
// SYNCHRONIZE SELECTED SAMPLE
// ============================================================

function synchronizeSelectedSample(samples) {
  if (!selectedSoilSample) {
    return;
  }

  const matchingSample = samples.find(
    (sample) => String(sample.id) === String(selectedSoilSample.id),
  );

  if (matchingSample) {
    selectedSoilSample = matchingSample;

    renderSelectedSoilSample(matchingSample);
  } else {
    clearSelectedSoilSample();
  }
}

// ============================================================
// CLEAR SELECTED SAMPLE
// ============================================================

function clearSelectedSoilSample() {
  selectedSoilSample = null;

  renderSelectedSampleEmpty();
}

// ============================================================
// EMPTY SELECTED SAMPLE
// ============================================================

function renderSelectedSampleEmpty() {
  const container = document.getElementById("selectedSampleContainer");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="selected-sample-empty">

      <strong>
        No soil sample selected
      </strong>

      <p>
        Click a soil sample marker on the map
        to view its laboratory information.
      </p>

    </div>
  `;
}

// ============================================================
// RENDER SELECTED SAMPLE
// ============================================================

function renderSelectedSoilSample(sample) {
  const container = document.getElementById("selectedSampleContainer");

  if (!container || !sample) {
    return;
  }

  const latitude = Number(sample.latitude);

  const longitude = Number(sample.longitude);

  const sampleCode = escapeHtml(sample.sample_code || "Unnamed Sample");

  const sampleDate = escapeHtml(sample.sample_date || "—");

  const depthFrom = escapeHtml(sample.depth_from_cm ?? "—");

  const depthTo = escapeHtml(sample.depth_to_cm ?? "—");

  const ph = escapeHtml(sample.ph ?? "—");

  const nitrogen = escapeHtml(sample.nitrogen ?? "—");

  const phosphorus = escapeHtml(sample.phosphorus ?? "—");

  const potassium = escapeHtml(sample.potassium ?? "—");

  const organicCarbon = escapeHtml(sample.organic_carbon ?? "—");

  const ec = escapeHtml(sample.electrical_conductivity ?? "—");

  const texture = escapeHtml(sample.soil_texture || "—");

  const formattedLatitude = Number.isFinite(latitude)
    ? latitude.toFixed(7)
    : "—";

  const formattedLongitude = Number.isFinite(longitude)
    ? longitude.toFixed(7)
    : "—";

  container.innerHTML = `

    <div class="selected-sample-card">

      <div class="selected-sample-card-header">

        <div>

          <h3>
            ${sampleCode}
          </h3>

          <p>
            Soil Sample ID:
            ${escapeHtml(sample.id ?? "—")}
          </p>

        </div>

        <button
          type="button"
          class="selected-sample-map-button"
          id="focusSelectedSample"
        >
          Locate on Map
        </button>

      </div>


      <div class="selected-sample-grid">

        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Sample Date
          </span>

          <strong>
            ${sampleDate}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Location
          </span>

          <strong>
            ${formattedLatitude},
            ${formattedLongitude}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Sampling Depth
          </span>

          <strong>
            ${depthFrom} -
            ${depthTo} cm
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Soil Texture
          </span>

          <strong>
            ${texture}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            pH
          </span>

          <strong>
            ${ph}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Nitrogen
          </span>

          <strong>
            ${nitrogen}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Phosphorus
          </span>

          <strong>
            ${phosphorus}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Potassium
          </span>

          <strong>
            ${potassium}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Organic Carbon
          </span>

          <strong>
            ${organicCarbon}
          </strong>

        </div>


        <div class="selected-sample-item">

          <span class="selected-sample-label">
            Electrical Conductivity
          </span>

          <strong>
            ${ec}
          </strong>

        </div>

      </div>

    </div>
  `;

  const focusButton = document.getElementById("focusSelectedSample");

  if (focusButton && typeof focusSampleMarker === "function") {
    focusButton.addEventListener("click", () => {
      focusSampleMarker(sample.id);
    });
  }
}

// ============================================================
// STATISTICS
// ============================================================
//
// IMPORTANT:
//
// No scientific classification threshold is applied here.
//
// Average pH is a descriptive statistic.
//
// Low nitrogen classification has intentionally been removed
// from the frontend because the frontend must not contain
// scientific threshold logic.
//
// The Low Nitrogen dashboard value is therefore derived from
// backend classifications when complete reports are loaded.
//
// ============================================================

function updateStatistics(samples) {
  const sampleCountElement = document.getElementById("sampleCount");

  const averagePhElement = document.getElementById("averagePh");

  const lowNitrogenElement = document.getElementById("lowNitrogen");

  if (!Array.isArray(samples)) {
    samples = [];
  }

  // ----------------------------------------------------------
  // Total samples
  // ----------------------------------------------------------

  if (sampleCountElement) {
    sampleCountElement.textContent = samples.length;
  }

  // ----------------------------------------------------------
  // Average pH
  // ----------------------------------------------------------

  const phValues = samples
    .map((sample) => Number(sample.ph))
    .filter((value) => Number.isFinite(value));

  if (averagePhElement) {
    if (phValues.length > 0) {
      const total = phValues.reduce((sum, value) => sum + value, 0);

      const average = total / phValues.length;

      averagePhElement.textContent = average.toFixed(2);
    } else {
      averagePhElement.textContent = "-";
    }
  }

  // ----------------------------------------------------------
  // Low nitrogen
  //
  // This value is deliberately reset here.
  //
  // It will be populated from backend report classifications
  // by updateNitrogenStatisticFromReports().
  // ----------------------------------------------------------

  if (lowNitrogenElement) {
    lowNitrogenElement.textContent = "0";
  }
}

// ============================================================
// SOIL ANALYSIS
// ============================================================
//
// Phase 7.2:
//
// One consolidated report is loaded for every sample:
//
// GET /api/soil-analysis/sample/:id/report
//
// The reports are also supplied to map.js so that the map can
// apply thematic marker symbology using backend classifications.
//
// The dashboard does not implement scientific thresholds.
//
// ============================================================

async function loadSoilAnalysis(samples) {
  const tableBody = document.getElementById("soilAnalysisTableBody");

  if (!tableBody) {
    console.warn("Soil analysis table body was not found.");

    return;
  }

  // ----------------------------------------------------------
  // Empty
  // ----------------------------------------------------------

  if (!Array.isArray(samples) || samples.length === 0) {
    // Clear thematic data when there are no samples.
    if (typeof updateThematicMapData === "function") {
      updateThematicMapData([]);
    }

    renderAnalysisEmptyState();

    renderRecommendationEmptyState();

    return;
  }

  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------

  tableBody.innerHTML = `
    <tr>
      <td
        colspan="8"
        class="analysis-loading"
      >
        Loading complete soil analysis reports...
      </td>
    </tr>
  `;

  try {
    console.log(
      `Loading complete soil analysis reports for ${samples.length} soil sample(s)...`,
    );

    const reports = await Promise.all(
      samples.map((sample) => loadCompleteSoilReport(sample.id)),
    );

    console.log("Complete soil analysis reports loaded:", reports);

    // --------------------------------------------------------
    // THEMATIC MAP DATA
    // --------------------------------------------------------
    //
    // The reports contain authoritative backend
    // classifications.
    //
    // app.js does not interpret those classifications.
    //
    // map.js is responsible only for converting them into
    // visual marker symbology.
    // --------------------------------------------------------

    if (typeof updateThematicMapData === "function") {
      console.log(
        "Sending complete soil analysis reports to map.js for thematic symbology...",
      );

      updateThematicMapData(reports);
    } else {
      console.warn(
        "updateThematicMapData() is not available. " +
          "Thematic marker symbology cannot be updated.",
      );
    }

    // --------------------------------------------------------
    // Dashboard rendering
    // --------------------------------------------------------

    renderCompleteSoilReports(samples, reports);

    updateNitrogenStatisticFromReports(reports);
  } catch (error) {
    console.error("Failed to load complete soil analysis reports:", error);

    renderAnalysisError(error.message);

    renderRecommendationError(error.message);

    renderCropSuitabilityError(error.message);

    renderSoilManagementError(error.message);
  }
}

// ============================================================
// LOAD COMPLETE SOIL ANALYSIS REPORT
// ============================================================

async function loadCompleteSoilReport(sampleId) {
  const response = await fetch(
    `/api/soil-analysis/sample/${encodeURIComponent(sampleId)}/report`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },

      cache: "no-store",
    },
  );

  if (!response.ok) {
    const responseText = await response.text();

    console.error(
      `Complete report API error for sample ${sampleId}:`,
      response.status,
      responseText,
    );

    throw new Error(
      `Complete soil analysis report request failed for sample ${sampleId}.`,
    );
  }

  const result = await response.json();

  if (
    !result ||
    result.success !== true ||
    !result.data ||
    !result.data.analysis ||
    !result.data.interpretation ||
    !result.data.cropSuitability ||
    !result.data.managementPlan
  ) {
    throw new Error(
      result?.message ||
        `Invalid complete soil analysis report for sample ${sampleId}.`,
    );
  }

  return result.data;
}

// ============================================================
// RENDER COMPLETE SOIL ANALYSIS REPORTS
// ============================================================

function renderCompleteSoilReports(samples, reports) {
  renderSoilAnalysisFromReports(samples, reports);

  renderSoilInterpretationFromReports(samples, reports);

  renderCropSuitabilityFromReports(samples, reports);

  renderSoilManagementFromReports(samples, reports);
}

// ============================================================
// RENDER ANALYSIS FROM REPORTS
// ============================================================

function renderSoilAnalysisFromReports(samples, reports) {
  const tableBody = document.getElementById("soilAnalysisTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  samples.forEach((sample, index) => {
    const report = reports[index];

    if (!report || !report.analysis) {
      return;
    }

    const analysis = report.analysis;

    const values = analysis.values || {};

    const row = document.createElement("tr");

    row.innerHTML = `

      <td class="analysis-sample">
        ${escapeHtml(
          report.sample?.sample_code || sample.sample_code || "Unnamed Sample",
        )}
      </td>

      <td>
        ${renderAnalysisValue(values.pH)}
      </td>

      <td>
        ${renderAnalysisValue(values.nitrogen)}
      </td>

      <td>
        ${renderAnalysisValue(values.phosphorus)}
      </td>

      <td>
        ${renderAnalysisValue(values.potassium)}
      </td>

      <td>
        ${renderAnalysisValue(values.organicCarbon)}
      </td>

      <td>
        ${renderAnalysisValue(values.electricalConductivity)}
      </td>

      <td class="${getFertilityClass(analysis.overallFertility)}">

        <span class="analysis-fertility-value">
          ${escapeHtml(analysis.overallFertility || "-")}
        </span>

      </td>

    `;

    tableBody.appendChild(row);
  });

  if (tableBody.children.length === 0) {
    renderAnalysisEmptyState();
  }
}

// ============================================================
// SINGLE ANALYSIS REPORT
// ============================================================

function renderSingleSoilAnalysisReport(report) {
  if (!report) {
    return;
  }

  renderSoilAnalysisFromReports(
    [
      {
        sample_code: report.sample?.sample_code,
      },
    ],
    [report],
  );
}

// ============================================================
// RENDER ANALYSIS VALUE
// ============================================================

function renderAnalysisValue(valueObject) {
  if (
    !valueObject ||
    valueObject.value === null ||
    valueObject.value === undefined ||
    valueObject.value === ""
  ) {
    return `
      <div
        class="analysis-value analysis-value-empty"
      >
        <span
          class="analysis-missing-value"
        >
          -
        </span>
      </div>
    `;
  }

  const value = valueObject.value;

  const unit = valueObject.unit || "";

  const classification = valueObject.classification || "";

  const classificationClass = getAnalysisClassificationClass(classification);

  return `
    <div class="analysis-value">

      <strong class="analysis-value-number">
        ${escapeHtml(value)}
      </strong>

      ${
        unit
          ? `
            <span class="analysis-unit">
              ${escapeHtml(unit)}
            </span>
          `
          : ""
      }

      ${
        classification
          ? `
            <span
              class="analysis-classification ${classificationClass}"
            >
              ${escapeHtml(classification)}
            </span>
          `
          : ""
      }

    </div>
  `;
}

// ============================================================
// ANALYSIS CLASSIFICATION PRESENTATION
// ============================================================

function getAnalysisClassificationClass(classification) {
  if (!classification) {
    return "";
  }

  const normalized = String(classification).trim().toLowerCase();

  switch (normalized) {
    case "high":
    case "high fertility":
    case "good":
    case "good fertility":
    case "very high":
      return "status-good";

    case "medium":
    case "moderate":
    case "moderately fertile":
    case "medium fertility":
    case "moderate fertility":
    case "moderate / good":
    case "moderate/good":
      return "status-medium";

    case "low":
    case "low fertility":
    case "poor":
    case "poor fertility":
    case "very low":
    case "very low fertility":
      return "status-low";

    case "neutral":
    case "non-saline":
      return "status-neutral";

    case "acidic":
    case "alkaline":
    case "saline":
      return "status-warning";

    default:
      return "";
  }
}

// ============================================================
// FERTILITY CLASS
// ============================================================

function getFertilityClass(fertility) {
  if (!fertility) {
    return "fertility-unknown";
  }

  const normalized = String(fertility).trim().toLowerCase();

  switch (normalized) {
    case "high":
    case "high fertility":
    case "good":
    case "good fertility":
      return "fertility-high";

    case "medium":
    case "moderate":
    case "moderately fertile":
    case "medium fertility":
    case "moderate fertility":
    case "moderate / good":
    case "moderate/good":
      return "fertility-medium";

    case "low":
    case "low fertility":
    case "poor":
    case "poor fertility":
      return "fertility-low";

    case "very low":
    case "very low fertility":
      return "fertility-very-low";

    default:
      return "fertility-unknown";
  }
}

// ============================================================
// NITROGEN STATISTIC FROM BACKEND REPORTS
// ============================================================
//
// No numerical threshold is used here.
//
// The backend classification is authoritative.
//
// Supported classifications include:
//
//   Low
//   Very Low
//
// The dashboard merely counts records whose backend
// classification indicates a low nitrogen status.
//
// ============================================================

function updateNitrogenStatisticFromReports(reports) {
  const lowNitrogenElement = document.getElementById("lowNitrogen");

  if (!lowNitrogenElement) {
    return;
  }

  if (!Array.isArray(reports)) {
    lowNitrogenElement.textContent = "0";

    return;
  }

  const lowNitrogen = reports.filter((report) => {
    const nitrogen = report?.analysis?.values?.nitrogen;

    const classification = nitrogen?.classification;

    if (!classification) {
      return false;
    }

    const normalized = String(classification).trim().toLowerCase();

    return (
      normalized === "low" ||
      normalized === "very low" ||
      normalized === "low fertility" ||
      normalized === "very low fertility"
    );
  }).length;

  lowNitrogenElement.textContent = lowNitrogen;
}

// ============================================================
// SOIL INTERPRETATION FROM REPORTS
// ============================================================

function renderSoilInterpretationFromReports(samples, reports) {
  const tableBody = document.getElementById("soilRecommendationTableBody");

  const observationsContainer = document.getElementById(
    "managementObservationsContainer",
  );

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (observationsContainer) {
    observationsContainer.innerHTML = "";
  }

  samples.forEach((sample, index) => {
    const report = reports[index];

    if (!report || !report.interpretation) {
      return;
    }

    renderInterpretationRecord(
      sample,
      report,
      tableBody,
      observationsContainer,
    );
  });

  if (tableBody.children.length === 0) {
    renderRecommendationEmptyState();
  }
}

// ============================================================
// SINGLE INTERPRETATION REPORT
// ============================================================

function renderSingleSoilInterpretationReport(report) {
  if (!report) {
    return;
  }

  const tableBody = document.getElementById("soilRecommendationTableBody");

  const observationsContainer = document.getElementById(
    "managementObservationsContainer",
  );

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (observationsContainer) {
    observationsContainer.innerHTML = "";
  }

  renderInterpretationRecord(
    report.sample || {},
    report,
    tableBody,
    observationsContainer,
  );
}

// ============================================================
// RENDER INTERPRETATION RECORD
// ============================================================

function renderInterpretationRecord(
  sample,
  report,
  tableBody,
  observationsContainer,
) {
  const interpretation = report.interpretation || {};

  const limitingNutrients = Array.isArray(interpretation.limitingNutrients)
    ? interpretation.limitingNutrients
    : [];

  const limitingNutrientText =
    limitingNutrients.length > 0
      ? limitingNutrients
          .map(
            (item) => item.nutrient || item.parameter || item.name || "Unknown",
          )
          .join(", ")
      : "None identified";

  const soilReaction = interpretation.soilReaction || {};

  const salinity = interpretation.salinity || {};

  const row = document.createElement("tr");

  row.innerHTML = `

    <td class="recommendation-sample">
      ${escapeHtml(sample.sample_code || "Unnamed Sample")}
    </td>

    <td class="${getFertilityClass(interpretation.overallFertility)}">
      <strong>
        ${escapeHtml(interpretation.overallFertility || "-")}
      </strong>
    </td>

    <td>
      ${escapeHtml(limitingNutrientText)}
    </td>

    <td>
      <strong>
        ${escapeHtml(soilReaction.classification || "-")}
      </strong>
    </td>

    <td>
      <strong>
        ${escapeHtml(salinity.classification || "-")}
      </strong>
    </td>

  `;

  tableBody.appendChild(row);

  // ----------------------------------------------------------
  // Management observations
  // ----------------------------------------------------------

  if (observationsContainer) {
    const observations = Array.isArray(interpretation.managementObservations)
      ? interpretation.managementObservations
      : [];

    const card = document.createElement("div");

    card.className = "management-observation-card";

    const heading = document.createElement("h3");

    heading.textContent = `${sample.sample_code || "Unnamed Sample"} - Management Observations`;

    card.appendChild(heading);

    if (observations.length > 0) {
      const list = document.createElement("ul");

      observations.forEach((observation) => {
        const item = document.createElement("li");

        item.textContent = observation;

        list.appendChild(item);
      });

      card.appendChild(list);
    } else {
      const paragraph = document.createElement("p");

      paragraph.textContent =
        "No specific management observations were identified.";

      card.appendChild(paragraph);
    }

    if (soilReaction.interpretation) {
      const paragraph = document.createElement("p");

      paragraph.innerHTML = `
        <strong>
          Soil Reaction:
        </strong>

        ${escapeHtml(soilReaction.interpretation)}
      `;

      card.appendChild(paragraph);
    }

    if (salinity.interpretation) {
      const paragraph = document.createElement("p");

      paragraph.innerHTML = `
        <strong>
          Salinity:
        </strong>

        ${escapeHtml(salinity.interpretation)}
      `;

      card.appendChild(paragraph);
    }

    observationsContainer.appendChild(card);
  }
}

// ============================================================
// CROP SUITABILITY FROM REPORTS
// ============================================================

function renderCropSuitabilityFromReports(samples, reports) {
  const container = document.getElementById("cropSuitabilityContainer");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  samples.forEach((sample, index) => {
    const report = reports[index];

    if (!report || !report.cropSuitability) {
      return;
    }

    renderCropSuitabilityRecord(sample, report, container);
  });

  if (container.children.length === 0) {
    container.innerHTML = `
      <div class="recommendation-empty">
        No crop suitability data available.
      </div>
    `;
  }
}

// ============================================================
// SINGLE CROP SUITABILITY REPORT
// ============================================================

function renderSingleCropSuitabilityReport(report) {
  const container = document.getElementById("cropSuitabilityContainer");

  if (!container || !report) {
    return;
  }

  container.innerHTML = "";

  renderCropSuitabilityRecord(report.sample || {}, report, container);
}

// ============================================================
// RENDER CROP SUITABILITY RECORD
// ============================================================

function renderCropSuitabilityRecord(sample, report, container) {
  const cropSuitability = report.cropSuitability || {};

  const crops = Array.isArray(cropSuitability.crops)
    ? cropSuitability.crops
    : [];

  const sampleCard = document.createElement("div");

  sampleCard.className = "crop-suitability-card";

  const heading = document.createElement("h3");

  heading.textContent = `${sample.sample_code || "Unnamed Sample"} - Crop Suitability`;

  sampleCard.appendChild(heading);

  // ----------------------------------------------------------
  // Scoring
  // ----------------------------------------------------------

  if (cropSuitability.scoring) {
    const scoring = cropSuitability.scoring;

    const scoringInfo = document.createElement("div");

    scoringInfo.className = "crop-scoring-info";

    const weights = scoring.weights || {};

    scoringInfo.innerHTML = `

      <div class="crop-scoring-method">

        <strong>
          Assessment Method:
        </strong>

        ${escapeHtml(scoring.method || "Weighted soil suitability assessment")}

      </div>

      <div class="crop-scoring-weights">

        <span>

          Soil Texture:

          <strong>
            ${escapeHtml(weights.soilTexture ?? "-")}
          </strong>

        </span>

        <span>

          Soil Reaction:

          <strong>
            ${escapeHtml(weights.soilReaction ?? "-")}
          </strong>

        </span>

        <span>

          Salinity:

          <strong>
            ${escapeHtml(weights.salinity ?? "-")}
          </strong>

        </span>

      </div>
    `;

    sampleCard.appendChild(scoringInfo);

    // --------------------------------------------------------
    // Assessment Quality
    //
    // These values are calculated by the backend.
    //
    // The frontend only presents the results and does not
    // implement any scientific completeness rules.
    // --------------------------------------------------------

    const dataCompleteness = scoring.dataCompleteness || {};

    const assessmentConfidence =
      scoring.assessmentConfidence ||
      dataCompleteness.confidence ||
      "Unavailable";

    const percentage = Number(dataCompleteness.percentage);

    const availableFactors = Number(dataCompleteness.availableFactors);

    const totalFactors = Number(dataCompleteness.totalFactors);

    const availableWeight = Number(dataCompleteness.availableWeight);

    const totalWeight = Number(dataCompleteness.totalWeight);

    const hasPercentage = Number.isFinite(percentage);

    const hasFactorCount =
      Number.isFinite(availableFactors) && Number.isFinite(totalFactors);

    const hasWeight =
      Number.isFinite(availableWeight) && Number.isFinite(totalWeight);

    const confidenceClass = getAssessmentConfidenceClass(assessmentConfidence);

    const qualityInfo = document.createElement("div");

    qualityInfo.className = "crop-assessment-quality";

    qualityInfo.innerHTML = `

      <div class="crop-assessment-quality-title">
        <strong>
          Assessment Quality
        </strong>
      </div>

      <div class="crop-assessment-quality-grid">

        <div class="crop-assessment-quality-item">

          <span>
            Assessment Confidence
          </span>

          <strong
            class="assessment-confidence-badge ${confidenceClass}"
          >
            ${escapeHtml(assessmentConfidence)}
          </strong>

        </div>

        <div class="crop-assessment-quality-item">

          <span>
            Data Completeness
          </span>

          <strong>
            ${hasPercentage ? `${escapeHtml(percentage)}%` : "Unavailable"}
          </strong>

        </div>

        <div class="crop-assessment-quality-item">

          <span>
            Factors Available
          </span>

          <strong>
            ${
              hasFactorCount
                ? `${escapeHtml(availableFactors)} / ${escapeHtml(totalFactors)}`
                : "Unavailable"
            }
          </strong>

        </div>

        <div class="crop-assessment-quality-item">

          <span>
            Available Weight
          </span>

          <strong>
            ${
              hasWeight
                ? `${escapeHtml(availableWeight)} / ${escapeHtml(totalWeight)}`
                : "Unavailable"
            }
          </strong>

        </div>

      </div>

    `;

    sampleCard.appendChild(qualityInfo);
  }

  // ----------------------------------------------------------
  // No crops
  // ----------------------------------------------------------

  if (crops.length === 0) {
    const empty = document.createElement("p");

    empty.textContent = "No crop suitability results are available.";

    sampleCard.appendChild(empty);

    container.appendChild(sampleCard);

    return;
  }

  // ----------------------------------------------------------
  // Crop table
  // ----------------------------------------------------------

  const tableWrapper = document.createElement("div");

  tableWrapper.className = "crop-table-container";

  const table = document.createElement("table");

  table.className = "crop-suitability-table";

  table.innerHTML = `

    <thead>

      <tr>

        <th>Rank</th>
        <th>Crop</th>
        <th>Category</th>
        <th>Suitability</th>
        <th>Score</th>
        <th>Texture</th>
        <th>Reaction</th>
        <th>Salinity</th>

      </tr>

    </thead>

    <tbody></tbody>

  `;

  const tbody = table.querySelector("tbody");

  crops.forEach((crop) => {
    const row = document.createElement("tr");

    const suitabilityClass = getSuitabilityClass(crop.suitability);

    const breakdown = crop.scoreBreakdown || {};

    row.innerHTML = `

      <td>
        <strong>
          ${escapeHtml(crop.rank ?? "-")}
        </strong>
      </td>

      <td class="crop-name">

        <strong>
          ${escapeHtml(crop.crop || "Unknown")}
        </strong>

      </td>

      <td>
        ${escapeHtml(crop.category || "-")}
      </td>

      <td>

        <span
          class="suitability-badge ${suitabilityClass}"
        >
          ${escapeHtml(crop.suitability || "-")}
        </span>

      </td>

      <td class="crop-score">

        <strong>
          ${escapeHtml(crop.score ?? "0")}
        </strong>

        / 100

      </td>

      <td>
        ${escapeHtml(breakdown.soilTexture ?? 0)}
      </td>

      <td>
        ${escapeHtml(breakdown.soilReaction ?? 0)}
      </td>

      <td>
        ${escapeHtml(breakdown.salinity ?? 0)}
      </td>

    `;

    tbody.appendChild(row);

    // --------------------------------------------------------
    // Detail row
    // --------------------------------------------------------

    const detailRow = document.createElement("tr");

    detailRow.className = "crop-detail-row";

    const detailCell = document.createElement("td");

    detailCell.colSpan = 8;

    const detailContainer = document.createElement("div");

    detailContainer.className = "crop-detail-container";

    const positiveFactors = Array.isArray(crop.positiveFactors)
      ? crop.positiveFactors
      : [];

    if (positiveFactors.length > 0) {
      appendDetailList(detailContainer, "Positive Factors", positiveFactors);
    }

    const limitingFactors = Array.isArray(crop.limitingFactors)
      ? crop.limitingFactors
      : [];

    if (limitingFactors.length > 0) {
      appendDetailList(detailContainer, "Limiting Factors", limitingFactors);
    }

    const managementConsiderations = Array.isArray(
      crop.managementConsiderations,
    )
      ? crop.managementConsiderations
      : [];

    if (managementConsiderations.length > 0) {
      appendDetailList(
        detailContainer,
        "Management Considerations",
        managementConsiderations,
      );
    }

    if (
      positiveFactors.length === 0 &&
      limitingFactors.length === 0 &&
      managementConsiderations.length === 0
    ) {
      const paragraph = document.createElement("p");

      paragraph.textContent =
        "No additional crop-specific considerations were identified.";

      detailContainer.appendChild(paragraph);
    }

    detailCell.appendChild(detailContainer);

    detailRow.appendChild(detailCell);

    tbody.appendChild(detailRow);
  });

  tableWrapper.appendChild(table);

  sampleCard.appendChild(tableWrapper);

  container.appendChild(sampleCard);
}

// ============================================================
// ASSESSMENT CONFIDENCE CLASS
// ============================================================
//
// Presentation only.
//
// No scientific threshold is implemented here.
//
// The backend determines the confidence value.
//
// ============================================================

function getAssessmentConfidenceClass(confidence) {
  if (!confidence) {
    return "assessment-confidence-unknown";
  }

  const normalized = String(confidence).trim().toLowerCase();

  switch (normalized) {
    case "high":
      return "assessment-confidence-high";

    case "moderate":
      return "assessment-confidence-moderate";

    case "low":
      return "assessment-confidence-low";

    case "unavailable":
      return "assessment-confidence-unavailable";

    default:
      return "assessment-confidence-unknown";
  }
}

// ============================================================
// APPEND DETAIL LIST
// ============================================================

function appendDetailList(container, titleText, items) {
  const title = document.createElement("strong");

  title.textContent = titleText;

  container.appendChild(title);

  const list = document.createElement("ul");

  items.forEach((itemText) => {
    const item = document.createElement("li");

    item.textContent = itemText;

    list.appendChild(item);
  });

  container.appendChild(list);
}

// ============================================================
// CROP SUITABILITY CLASS
// ============================================================

function getSuitabilityClass(suitability) {
  if (!suitability) {
    return "suitability-unknown";
  }

  switch (String(suitability).trim()) {
    case "Highly Suitable":
      return "suitability-high";

    case "Suitable":
      return "suitability-good";

    case "Moderately Suitable":
      return "suitability-moderate";

    case "Marginal":
      return "suitability-marginal";

    case "Unsuitable":
      return "suitability-low";

    default:
      return "suitability-unknown";
  }
}

// ============================================================
// SOIL MANAGEMENT FROM REPORTS
// ============================================================

function renderSoilManagementFromReports(samples, reports) {
  const container = document.getElementById("soilManagementContainer");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  samples.forEach((sample, index) => {
    const report = reports[index];

    if (!report || !report.managementPlan) {
      return;
    }

    renderSoilManagementRecord(sample, report, container);
  });

  if (container.children.length === 0) {
    container.innerHTML = `
      <div class="recommendation-empty">
        No soil management plan is available.
      </div>
    `;
  }
}

// ============================================================
// SINGLE SOIL MANAGEMENT REPORT
// ============================================================

function renderSingleSoilManagementReport(report) {
  const container = document.getElementById("soilManagementContainer");

  if (!container || !report) {
    return;
  }

  container.innerHTML = "";

  renderSoilManagementRecord(report.sample || {}, report, container);
}

// ============================================================
// RENDER SOIL MANAGEMENT RECORD
// ============================================================

function renderSoilManagementRecord(sample, report, container) {
  const managementPlan = report.managementPlan || {};

  const card = document.createElement("div");

  card.className = "soil-management-card";

  const heading = document.createElement("h3");

  heading.textContent = `${sample.sample_code || "Unnamed Sample"} - Management Plan`;

  card.appendChild(heading);

  // ----------------------------------------------------------
  // Overall fertility
  // ----------------------------------------------------------

  if (managementPlan.overallFertility) {
    const fertility = document.createElement("div");

    fertility.className = "management-fertility";

    fertility.innerHTML = `

      <strong>
        Overall Fertility:
      </strong>

      <span
        class="${getFertilityClass(managementPlan.overallFertility)}"
      >
        ${escapeHtml(managementPlan.overallFertility)}
      </span>

    `;

    card.appendChild(fertility);
  }

  // ----------------------------------------------------------
  // Management sections
  // ----------------------------------------------------------

  const sections = [
    {
      title: "Nutrient Management",
      key: "nutrientManagement",
    },

    {
      title: "Organic Matter Management",
      key: "organicMatterManagement",
    },

    {
      title: "Soil Reaction Management",
      key: "soilReactionManagement",
    },

    {
      title: "Salinity Management",
      key: "salinityManagement",
    },

    {
      title: "Overall Management",
      key: "overallManagement",
    },

    {
      title: "General Management",
      key: "generalManagement",
    },
  ];

  sections.forEach((section) => {
    const items = Array.isArray(managementPlan[section.key])
      ? managementPlan[section.key]
      : [];

    if (items.length === 0) {
      return;
    }

    const sectionElement = document.createElement("div");

    sectionElement.className = "management-plan-section";

    const title = document.createElement("h4");

    title.textContent = section.title;

    sectionElement.appendChild(title);

    const list = document.createElement("ul");

    items.forEach((itemText) => {
      const item = document.createElement("li");

      item.textContent = itemText;

      list.appendChild(item);
    });

    sectionElement.appendChild(list);

    card.appendChild(sectionElement);
  });

  container.appendChild(card);
}

// ============================================================
// ANALYSIS EMPTY STATE
// ============================================================

function renderAnalysisEmptyState() {
  const tableBody = document.getElementById("soilAnalysisTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `
    <tr>
      <td
        colspan="8"
        class="analysis-empty"
      >
        No soil analysis data available.
      </td>
    </tr>
  `;
}

// ============================================================
// ANALYSIS ERROR
// ============================================================

function renderAnalysisError(message) {
  const tableBody = document.getElementById("soilAnalysisTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `
    <tr>

      <td
        colspan="8"
        class="analysis-error"
      >

        Unable to load soil analysis.

        ${message ? `<br><small>${escapeHtml(message)}</small>` : ""}

      </td>

    </tr>
  `;
}

// ============================================================
// RECOMMENDATION EMPTY STATE
// ============================================================

function renderRecommendationEmptyState() {
  const tableBody = document.getElementById("soilRecommendationTableBody");

  const observationsContainer = document.getElementById(
    "managementObservationsContainer",
  );

  const cropSuitabilityContainer = document.getElementById(
    "cropSuitabilityContainer",
  );

  const soilManagementContainer = document.getElementById(
    "soilManagementContainer",
  );

  if (tableBody) {
    tableBody.innerHTML = `
      <tr>

        <td
          colspan="5"
          class="recommendation-empty"
        >
          No soil interpretation data available.
        </td>

      </tr>
    `;
  }

  if (observationsContainer) {
    observationsContainer.innerHTML = "";
  }

  if (cropSuitabilityContainer) {
    cropSuitabilityContainer.innerHTML = `
      <div class="recommendation-empty">
        No crop suitability data available.
      </div>
    `;
  }

  if (soilManagementContainer) {
    soilManagementContainer.innerHTML = `
      <div class="recommendation-empty">
        No soil management plan available.
      </div>
    `;
  }
}

// ============================================================
// RECOMMENDATION ERROR
// ============================================================

function renderRecommendationError(message) {
  const tableBody = document.getElementById("soilRecommendationTableBody");

  const observationsContainer = document.getElementById(
    "managementObservationsContainer",
  );

  if (tableBody) {
    tableBody.innerHTML = `
      <tr>

        <td
          colspan="5"
          class="recommendation-error"
        >

          Unable to load soil interpretation.

          ${message ? `<br><small>${escapeHtml(message)}</small>` : ""}

        </td>

      </tr>
    `;
  }

  if (observationsContainer) {
    observationsContainer.innerHTML = "";
  }
}

// ============================================================
// CROP SUITABILITY ERROR
// ============================================================

function renderCropSuitabilityError(message) {
  const container = document.getElementById("cropSuitabilityContainer");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="recommendation-error">

      Unable to load crop suitability.

      ${message ? `<br><small>${escapeHtml(message)}</small>` : ""}

    </div>
  `;
}

// ============================================================
// SOIL MANAGEMENT ERROR
// ============================================================

function renderSoilManagementError(message) {
  const container = document.getElementById("soilManagementContainer");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="recommendation-error">

      Unable to load soil management plan.

      ${message ? `<br><small>${escapeHtml(message)}</small>` : ""}

    </div>
  `;
}

// ============================================================
// FORM ERROR HELPERS
// ============================================================

function clearFormError() {
  const formError = document.getElementById("formError");

  if (!formError) {
    return;
  }

  formError.textContent = "";

  formError.classList.add("hidden");
}

// ============================================================

function showFormError(message) {
  const formError = document.getElementById("formError");

  if (!formError) {
    return;
  }

  formError.textContent = message || "An error occurred.";

  formError.classList.remove("hidden");
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function cleanString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

// ============================================================

function numberOrNull(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

// ============================================================

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================
// HTML ESCAPE
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
