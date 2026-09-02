# Soil Analysis GIS

## Phased Development & Soil Analysis Standards Document

**Project:** Soil Analysis GIS

**Purpose:** Soil sample collection, laboratory-value storage, soil analysis, recommendations, crop suitability assessment, soil management, and GIS visualization

**Document Type:** Development Roadmap & Technical Reference

**Current Phase:** Phase 7.3 — Thematic Map & Legend

**Status:** Phase 7.3 completed and frozen; ready for Phase 7.4

---

# 1. Project Objective

The Soil Analysis GIS application combines:

- Geographically referenced soil samples
- Laboratory soil-test results
- Standardized Indian soil interpretation rules
- Automated soil classification
- Overall soil-fertility assessment
- Soil recommendations
- Crop suitability assessment
- Soil management guidance
- REST APIs
- Leaflet/GIS visualization
- Soil-analysis dashboard
- Thematic soil visualization

The application must keep:

> **Soil-analysis logic separate from GIS visualization.**

The scientific interpretation layer must remain independently testable and authoritative.

The GIS interface consumes analysis results. It must not independently redefine scientific classification rules.

---

# 2. Development Philosophy

The mandatory architectural principle is:

> **Scientific interpretation first → tested analysis engine → API → dashboard/map visualization**

The GIS interface must never determine or contain the scientific classification rules.

The architecture is:

```text
Soil Sample Database
        │
        ▼
Soil Analysis Service
        │
        ├── pH Classification
        ├── Nitrogen Classification
        ├── Phosphorus Classification
        ├── Potassium Classification
        ├── Organic Carbon Classification
        ├── EC Classification
        └── Overall Fertility Assessment
        │
        ▼
Soil Analysis API
        │
        ├── Recommendation Services
        ├── Crop Suitability
        └── Soil Management
        │
        ▼
Dashboard / Leaflet Map
        │
        ├── Sample Visualization
        ├── Thematic Maps
        ├── Classification Symbology
        └── Thematic Legends

        3. Development Phases
Phase 1 — Project Foundation
Objective

Establish the basic Soil Analysis GIS application structure.

Components
Node.js / Express server
MySQL database
Environment configuration
Public web application
Basic API structure
Leaflet integration
Deliverables
Working Express server
Database connection
Application startup
Basic web page
Leaflet map framework
Status

COMPLETED

4. Phase 2 — Soil Sample Repository
Objective

Create persistent storage and APIs for geographically referenced soil samples.

Repository
soil_samples

The repository stores information including:

Sample ID
Sample code
Latitude
Longitude
Sampling depth
pH
Available Nitrogen
Available Phosphorus
Available Potassium
Organic Carbon
Electrical Conductivity
Laboratory values
Sample metadata
Deliverables
Soil sample database table
Repository
Controller
REST API
Sample retrieval
Sample creation/testing
Status

COMPLETED

The application currently contains multiple soil samples available for analysis and GIS testing.

5. Phase 3 — GIS Map
Objective

Display geographically referenced soil samples on a Leaflet map.

Components
Leaflet map
Sample markers
Sample popup
API-based sample loading
Geographic coordinates
Laboratory-value display
Design Rule

The GIS visualization displays stored sample information.

It does not independently calculate scientific classifications.

Status

COMPLETED

The map successfully:

Initializes Leaflet
Loads soil samples from the API
Creates geographic markers
Displays sample information
Supports marker selection
Supports sample labels
Fits the map to the available samples
6. Phase 4 — Soil Analysis

Phase 4 introduced the scientific interpretation layer.

6.1 Phase 4.1 — Soil Analysis Engine
Objective

Create a centralized, testable service responsible for interpreting soil-test measurements.

Main Service
server/services/soilAnalysisService.js
Functions

The analysis service provides classification and overall assessment functionality for:

classifyPH()

classifyNitrogen()

classifyPhosphorus()

classifyPotassium()

classifyOrganicCarbon()

classifyEC()

assessOverallFertility()

analyzeSample()
Status

COMPLETED

The analysis engine is implemented and is consumed by the analysis API.

7. Soil Analysis Standard

The baseline interpretation standard selected for this application is:

Government of India Soil Health Card / Soil Testing Manual baseline

The application records the measurement units associated with each parameter.

Thresholds are centralized and are not embedded in the GIS presentation layer.

Where interpretation depends on analytical method or extraction procedure, that dependency must be documented.

8. pH Classification
Unit

pH units

pH	Classification
< 6.5	Acidic
6.5–7.5	Neutral
> 7.5	Alkaline
Implementation
pH < 6.5        → Acidic
6.5 ≤ pH ≤ 7.5 → Neutral
pH > 7.5        → Alkaline

pH is a soil-reaction indicator and is not treated as a nutrient quantity.

9. Available Nitrogen Classification
Unit

kg/ha

Available N	Classification
< 280	Low
280–560	Medium
> 560	High
Implementation
N < 280       → Low
280 ≤ N ≤ 560 → Medium
N > 560       → High
10. Available Phosphorus Classification
Unit

kg/ha

Available P	Classification
< 10	Low
10–25	Medium
> 25–50	High
> 50	Very High
Implementation
P < 10       → Low
10 ≤ P ≤ 25  → Medium
25 < P ≤ 50  → High
P > 50       → Very High

The four-category classification is retained.

11. Available Potassium Classification
Unit

kg/ha

Available K	Classification
< 120	Low
120–280	Medium
> 280–600	High
> 600	Very High
Implementation
K < 120        → Low
120 ≤ K ≤ 280  → Medium
280 < K ≤ 600  → High
K > 600        → Very High
12. Organic Carbon Classification
Unit

%

Organic Carbon	Classification
< 0.50%	Low
0.50–0.75%	Medium
> 0.75%	High
Implementation
OC < 0.50        → Low
0.50 ≤ OC ≤ 0.75 → Medium
OC > 0.75        → High
13. Electrical Conductivity Classification
Unit

dS/m

EC	Classification
0–0.4	Non-saline
> 0.4–0.8	Very slightly saline
> 0.8–1.6	Moderately saline
> 1.6	Strongly saline
Important Note

EC interpretation depends on the soil-extract / soil-water measurement method.

The analytical convention used by the laboratory must therefore be recorded or documented.

EC is primarily a salinity indicator, not a nutrient-fertility score.

14. Overall Fertility Assessment

The application uses a transparent rule-based assessment.

It does not use an arbitrary numerical average such as:

Low = 1
Medium = 2
High = 3

unless a scientifically justified scoring system is introduced later.

Initial Rules
Low Fertility

If one or more major fertility parameters are classified Low:

N = Low

OR

P = Low

OR

K = Low

OR

Organic Carbon = Low

then:

Overall Fertility = Low
Moderate / Good Fertility

If no major nutrient/organic-carbon parameter is Low and the results are predominantly Medium/High:

Overall Fertility = Moderate / Good
High Fertility

If N, P, K and Organic Carbon are predominantly High/Very High:

Overall Fertility = High
EC

EC is reported independently as:

Non-saline
Very slightly saline
Moderately saline
Strongly saline

EC does not automatically increase or decrease the nutrient-fertility category.

15. Configuration Architecture

Thresholds are centralized rather than scattered throughout individual functions.

Recommended structure:

soilAnalysisService.js

│
├── SOIL_STANDARDS
│   ├── pH
│   ├── nitrogen
│   ├── phosphorus
│   ├── potassium
│   ├── organicCarbon
│   └── EC
│
├── classifyPH()
├── classifyNitrogen()
├── classifyPhosphorus()
├── classifyPotassium()
├── classifyOrganicCarbon()
├── classifyEC()
├── assessOverallFertility()
└── analyzeSample()

This allows the scientific standard to be changed later without rewriting the application.

16. Analysis Result Structure

The analysis API returns structured analysis information containing:

Measured value
Unit where applicable
Classification
Overall fertility
EC/salinity interpretation

Representative structure:

{
  "sampleId": 1,
  "sampleCode": "S-001",
  "analysis": {
    "pH": {
      "value": 6.8,
      "classification": "Neutral"
    },
    "nitrogen": {
      "value": 285,
      "unit": "kg/ha",
      "classification": "Medium"
    },
    "phosphorus": {
      "value": 18,
      "unit": "kg/ha",
      "classification": "Medium"
    },
    "potassium": {
      "value": 240,
      "unit": "kg/ha",
      "classification": "Medium"
    },
    "organicCarbon": {
      "value": 0.72,
      "unit": "%",
      "classification": "Medium"
    },
    "electricalConductivity": {
      "value": 0.35,
      "unit": "dS/m",
      "classification": "Non-saline"
    },
    "overallFertility": "Moderate / Good"
  }
}

The exact API structure is implementation-controlled but must preserve the separation between measurements and classifications.

17. Phase 4.1 Testing

Testing was treated as a mandatory part of the analysis engine.

Testing includes:

Normal values
Low
Medium
High
Very High
Boundary values

pH:

6.49
6.50
7.50
7.51

Nitrogen:

279
280
560
561

Phosphorus:

9
10
25
50
51

Potassium:

119
120
280
600
601

Organic Carbon:

0.49
0.50
0.75
0.76

EC:

0.39
0.40
0.80
1.60
1.61
Invalid input

The service also considers:

null
undefined
non-numeric values
negative values where invalid
missing measurements
Status

COMPLETED

18. Phase 4.1 API

The soil-analysis API provides sample analysis through:

GET /api/soil-analysis/sample/:id
Processing
Request
   │
   ▼
Sample ID
   │
   ▼
soil_samples repository
   │
   ▼
soilAnalysisService
   │
   ├── pH
   ├── N
   ├── P
   ├── K
   ├── OC
   └── EC
   │
   ▼
Overall assessment
   │
   ▼
JSON response

The API does not duplicate classification logic.

Status

COMPLETED

19. Existing Sample Validation

The actual database samples are used for validation.

For the established sample S-001:

pH             = 6.80
N              = 285 kg/ha
P              = 18 kg/ha
K              = 240 kg/ha
Organic Carbon = 0.72 %
EC              = 0.35 dS/m

Expected classifications:

pH             → Neutral
N              → Medium
P              → Medium
K              → Medium
Organic Carbon → Medium
EC              → Non-saline

Additional database samples are also available and are processed through the same analysis engine.

Status

COMPLETED

20. Phase 4.2 — Soil Analysis Dashboard
Objective

Present soil-analysis results in a usable dashboard.

Functionality
Overall soil-fertility status
pH classification
N classification
P classification
K classification
Organic Carbon classification
EC/salinity status
Laboratory values
Interpretation labels
Visual indicators

The dashboard consumes analysis results.

It does not contain scientific threshold logic.

Status

COMPLETED

21. Phase 4.3 — GIS Analysis Visualization
Objective

Connect the soil-analysis engine to the GIS visualization layer.

The GIS visualization consumes analysis results rather than reimplementing scientific rules.

Analysis information can be represented as:

Sample S-001

pH: Neutral
N: Medium
P: Medium
K: Medium
OC: Medium
EC: Non-saline

Overall:
Moderate / Good
Status

COMPLETED

22. Soil Recommendation Services

The project subsequently introduced dedicated soil recommendation functionality.

Services
server/services/soilRecommendationService.js
server/services/cropSuitabilityService.js
server/services/soilManagementService.js

These services are separated from the core soil-analysis classification engine.

The separation is intentional:

Measurement
    ↓
Classification
    ↓
Soil Interpretation
    ↓
Recommendation
    ↓
Crop Suitability
    ↓
Soil Management
Design Principle

Recommendations must consume analyzed soil information and must not redefine the underlying laboratory classification thresholds.

Status

IMPLEMENTED

23. Phase 7 — Thematic GIS Visualization

Phase 7 extends the GIS layer from simple sample display to parameter-specific thematic visualization.

Thematic visualization is presentation logic.

The scientific classifications remain authoritative in the backend analysis results.

24. Phase 7.1 — Thematic Parameter Selection
Objective

Allow the user to select a soil parameter for thematic visualization.

Supported parameters:

Standard Sample View
pH
Nitrogen
Phosphorus
Potassium
Organic Carbon
Electrical Conductivity

The map parameter selector is implemented in:

public/js/map.js
Status

COMPLETED

25. Phase 7.2 — Thematic Marker Symbology
Objective

Represent backend soil classifications using thematic map symbols.

The GIS layer receives complete soil-analysis reports from the application.

The backend classification remains authoritative.

The map does not calculate:

Low
Medium
High
Very High
Acidic
Neutral
Alkaline
Saline

Instead, it converts the received classification into a presentation category.

Presentation categories
High
Medium
Low
Warning
Neutral
Unavailable

The thematic marker system supports parameter-specific interpretation.

For example:

pH

Acidic    → Warning
Neutral   → Neutral
Alkaline  → Warning

For nutrient parameters:

High     → High
Medium   → Medium
Low      → Low

Unavailable analysis data is represented separately.

Status

COMPLETED

26. Phase 7.3 — Thematic Legend & Presentation
Objective

Provide a clear visual legend corresponding to the selected thematic parameter.

The legend is dynamically updated when the selected parameter changes.

Supported thematic parameters:

Standard Sample View
pH
Nitrogen
Phosphorus
Potassium
Organic Carbon
Electrical Conductivity

The legend reflects the interpretation categories applicable to the selected parameter.

Additional functionality

Phase 7.3 includes:

Dynamic thematic legend
Parameter-specific legend categories
Thematic marker symbols
Sample labels
Label visibility toggle
Standard marker restoration
Preservation of marker popups
Preservation of existing sample-selection functionality
Thematic data synchronization with soil-analysis reports
Current runtime validation

The application has successfully demonstrated:

10 soil samples loaded
10 soil samples rendered
10 complete analysis reports loaded
10 reports transferred to map.js

Thematic rendering has been verified for:

Standard Sample View
pH
Nitrogen
Phosphorus
Potassium
Organic Carbon
Electrical Conductivity
Status

COMPLETED AND FROZEN

27. Phase 7 Frozen Baseline

Phase 7.3 is now a frozen baseline.

The following functionality must not be changed casually in later phases:

Leaflet map initialization
        ↓
Sample loading
        ↓
Sample markers
        ↓
Analysis report loading
        ↓
Thematic parameter selection
        ↓
Backend-authoritative classification
        ↓
Thematic marker symbology
        ↓
Thematic legend
        ↓
Sample labels

Future development must build on this baseline.

If a later phase requires modification to frozen Phase 7.3 functionality, the change must be deliberate and documented.

28. Current Frontend Thematic Architecture

The primary thematic map implementation is:

public/js/map.js

The map maintains thematic state including:

Selected thematic parameter

Thematic analysis reports

Sample markers

Sample labels

Thematic legend

The application sends complete analysis reports to the map.

The map then applies presentation logic.

Conceptually:

Soil Analysis API
       │
       ▼
Complete Analysis Reports
       │
       ▼
app.js
       │
       ▼
map.js
       │
       ├── Selected Parameter
       │
       ├── Backend Classification
       │
       ├── Marker Symbology
       │
       ├── Legend
       │
       └── Sample Labels

This preserves the separation between:

Scientific Logic
        ≠
Presentation Logic
29. Scientific Governance

The application maintains a clear distinction between:

Measurement

What the laboratory reports.

Example:

N = 285 kg/ha
Classification

What the selected standard says about the measurement.

Example:

N = Medium
Interpretation

What the classification means.

Example:

Available nitrogen is in the Medium category.
Recommendation

What action may be appropriate.

Example:

Apply an appropriate nitrogen-management program.

These are different layers and must not be conflated.

30. Change-Control Rule for Thresholds

If a threshold is changed in the future, record:

Previous threshold
New threshold
Source/standard
Reason for change
Effective application version
Unit and analytical method
Impact on existing classifications

This is particularly important if the application becomes a production agricultural decision-support system.

31. Future Development

Potential future functionality includes:

Advanced crop-specific recommendations
Nutrient deficiency recommendations
Fertilizer recommendations
Crop suitability refinement
Soil amendment recommendations
Spatial interpolation
Soil fertility zoning
Historical sample comparison
Time-series soil monitoring
Sampling-density analysis
Laboratory quality-control information
State-specific interpretation standards
Crop-specific critical limits
Spatial filtering
Advanced thematic analysis
Map-based analytical queries
Reporting/export functionality

These features must build on the stable soil-analysis foundation.

32. Phase 7.4 — Next Development Phase

Phase 7.4 will be defined and implemented only after the Phase 7.3 baseline has been frozen.

The implementation must preserve:

Existing sample rendering
Existing sample popups
Existing analysis API integration
Backend-authoritative classifications
Thematic parameter selection
Thematic symbology
Thematic legend
Sample labels

Any new functionality must be added incrementally without unnecessarily rewriting stable Phase 7.3 functionality.

33. Current Project Position
Phase 1
Foundation
        │
        ▼
        COMPLETE

Phase 2
Soil Sample Repository
        │
        ▼
        COMPLETE

Phase 3
GIS Map Foundation
        │
        ▼
        COMPLETE

Phase 4
Soil Analysis
        │
        ├── Phase 4.1 Analysis Engine
        │       COMPLETE
        │
        ├── Phase 4.2 Dashboard
        │       COMPLETE
        │
        └── Phase 4.3 GIS Analysis Visualization
                COMPLETE
        │
        ▼
Phase 5 / 6
Analysis Services & Dashboard Enhancements
        │
        ▼
        COMPLETE
        │
        ▼
Phase 7
Thematic GIS Visualization
        │
        ├── Phase 7.1 Parameter Selection
        │       COMPLETE
        │
        ├── Phase 7.2 Marker Symbology
        │       COMPLETE
        │
        └── Phase 7.3 Thematic Legend & Presentation
                COMPLETE
                FROZEN
        │
        ▼
Phase 7.4
NEXT
        │
        ▼
Advanced GIS / Soil Analysis Functionality
34. Golden Rule for Future Development

Never change the dashboard or map merely to accommodate an untested soil-analysis result.

The correct sequence remains:

Scientific Standard
       ↓
Threshold Configuration
       ↓
Analysis Function
       ↓
Unit Test
       ↓
Analysis API
       ↓
Database Sample Validation
       ↓
Dashboard
       ↓
GIS Visualization
       ↓
Thematic Presentation

The GIS layer may transform authoritative classifications into visual symbols, but it must never become the source of scientific classification.

35. Project Baseline

As of the completion and freeze of Phase 7.3, the Soil Analysis GIS application has a functioning end-to-end pipeline:

Soil Sample
     ↓
MySQL Repository
     ↓
REST API
     ↓
Soil Analysis Engine
     ↓
Classification
     ↓
Overall Soil Assessment
     ↓
Recommendation / Suitability / Management Services
     ↓
Frontend
     ↓
Leaflet GIS
     ↓
Thematic Visualization
     ↓
Thematic Legend

The project is therefore ready to proceed to the next controlled development phase.

36. Document Status

Document: Soil Analysis GIS — Phased Development & Soil Analysis Standards Document

Current Phase: Phase 7.3

Phase 7.3 Status: COMPLETED AND FROZEN

Next Phase: Phase 7.4

Development Principle:

Scientific interpretation first → tested analysis → API → dashboard → GIS → thematic visualization

This document is the current baseline reference for the Soil Analysis GIS project.


### One important point

I deliberately **did not mark Phase 7.4 as completed or define detailed functionality for it**. That keeps the document synchronized with the actual state of the project rather than getting ahead of the implementation.

The next step should be to **replace the contents of the existing `Soil Analysis GIS.md` with this version**, commit that documentation update to Git, and then start Phase 7.4 from the frozen 7.3 baseline.
```

1. Phase 7.5 scope

I propose five components.

7.5.1 Thematic Summary

When a thematic parameter is selected, display a compact summary such as:

Nitrogen

Category Samples
High 2
Medium 6
Low 2
Total 10

And potentially:

Minimum
Maximum
Average
Number of samples

This gives the user an immediate statistical overview.

7.5.2 Spatial Distribution Analysis

The map should identify the spatial distribution of the selected parameter.

For example:

Nitrogen: 6 Medium, 2 High, 2 Low

The user can visually see whether Low or High samples are concentrated in a particular part of the surveyed area.

We should not call this a statistically proven spatial cluster unless we actually implement a statistical clustering method.

So the initial implementation will be visual/spatial distribution analysis, not advanced geostatistics.

7.5.3 Selected Category Statistics

When the user clicks:

Medium

the map already filters the six Medium samples.

Phase 7.5 can additionally show:

Nitrogen — Medium

Samples: 6
Minimum: ...
Maximum: ...
Average: ...

This is a natural extension of the Phase 7.4 filtering functionality.

7.5.4 Map Statistics Panel

We can introduce a small GIS analysis panel, for example:

SOIL THEMATIC ANALYSIS

Parameter
Nitrogen

Samples
10

Average
...

Range
... – ...

Distribution
High 2
Medium 6
Low 2

The panel should update dynamically when the thematic parameter changes.

If a category filter is active, the panel can optionally switch to:

FILTERED VIEW

Category
Medium

Samples
6

Average
...
7.5.5 No Interpolation Yet

This is important.

I recommend not introducing:

IDW interpolation
Kriging
raster generation
heatmaps
contour maps
soil fertility surfaces

in 7.5.

Those require additional scientific decisions regarding:

sampling density
spatial distribution
interpolation method
distance weighting
variogram assumptions
minimum sample requirements
validation

They deserve their own carefully designed phase later.

2. Architecture

The architecture should remain:

                    DATABASE
                       │
                       ▼
                Soil Measurements
                       │
                       ▼
              Backend Soil Analysis
                       │
             Classification + Values
                       │
                       ▼
                 REST API
                       │
                       ▼
                Frontend / GIS
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    Thematic Markers          Analysis Panel
          │                         │
          ▼                         ▼
       Leaflet              Statistics / Summary

The critical rule remains:

The frontend does not calculate scientific soil classifications.

It consumes the backend's measurement/classification data and presents it spatially.

3. Backend vs Frontend responsibilities
   Backend

Backend remains responsible for:

measured values
units
classifications
scientific thresholds
soil analysis
validation
future statistical calculations where appropriate
Frontend

Frontend handles:

marker presentation
filtering
counts
displaying statistics
map interaction
analysis-panel presentation

This keeps our architecture clean.

4. Proposed new frontend state

We can introduce something along these lines:

let thematicAnalysisStats = null;

and derive the display statistics from the existing thematicMapReports.

We should reuse the existing analysis data, rather than making another API call for every map interaction.

5. User interaction

The intended workflow becomes:

Step 1

User selects:

Nitrogen

Step 2

Map changes to nitrogen thematic symbology.

Step 3

Legend shows:

High 2
Medium 6
Low 2
Unavailable 0
Step 4

Analysis panel shows:

Nitrogen Analysis

Samples: 10
Average: ...
Minimum: ...
Maximum: ...

High: 2
Medium: 6
Low: 2
Step 5

User clicks Medium.

Map shows only the six Medium samples.

Panel changes to:

Nitrogen — Medium

Samples: 6
Average: ...
Minimum: ...
Maximum: ...
Step 6

User clicks Show All Samples.

Map and statistics return to the complete dataset.

And, importantly, Labels ON/OFF continues to remain independent, exactly as we fixed in 7.4.

6. Parameters covered

Phase 7.5 should work consistently for:

pH
Nitrogen
Phosphorus
Potassium
Organic Carbon
Electrical Conductivity

However, the interpretation of the statistics must respect the parameter.

For example:

pH

Minimum: 5.9
Maximum: 8.1
Average: 6.9

while classification remains:

Acidic
Neutral
Alkaline

For EC:

Non-saline
Very slightly saline
Moderately saline
Strongly saline

The statistical values are measurements; the categories remain backend classifications.

7. What we should NOT change

We should preserve everything that is already working:

Phase 7.3
thematic parameter selector
marker symbology
legend
category counts
sample labels
standard map view
Phase 7.4
category filtering
Show All Samples
inspection popup
active category indication
label ON/OFF behavior
existing map interactions

Phase 7.5 should build on these, not replace them.

8. Testing plan

Before committing Phase 7.5, we'll test each parameter.

Functional
Select pH
Select N
Select P
Select K
Select OC
Select EC
Confirm statistics change correctly
Filtering
Click High
Click Medium
Click Low
Confirm statistics correspond to visible samples
Show All Samples
Confirm statistics return to complete dataset
Labels

Test both:

Labels ON → filter → labels remain ON
Labels OFF → filter → labels remain OFF
Standard view

Return to:

Standard Sample View

and confirm the existing map behavior remains unchanged.

Regression

Confirm:

popups
sample labels
marker clicks
map fitting
thematic legend
category counts

all continue working.

9. Git checkpoint

We currently have:

e3f6a35 Complete Phase 7.4 thematic map interaction

So our development sequence becomes:

e3f6a35
│
▼
Phase 7.5 development
│
├── implementation
├── testing
├── bug fixes
└── regression testing
│
▼
Phase 7.5 Git commit

That gives us a clean rollback point if necessary.

Phase 7.5 definition

I would formally record it as:

Phase 7.5 — Thematic Spatial Analysis & Statistical Summary
Extend the thematic GIS from category visualization and filtering into spatially contextualized statistical analysis of soil parameters. Provide parameter-level and filtered-category summaries using existing backend measurements and classifications, while preserving the separation between scientific analysis and GIS presentation. No interpolation or geostatistical surface generation is included in this phase.

That is the phase I recommend we implement next.
