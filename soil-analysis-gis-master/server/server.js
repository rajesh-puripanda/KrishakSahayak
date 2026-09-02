// ============================================================
// server/server.js
// ============================================================
//
// Soil Analysis GIS
//
// Phase 1 — Application Foundation
//
// ============================================================

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// ============================================================
// LOAD ENVIRONMENT FIRST
// ============================================================
//
// IMPORTANT:
// dotenv must be loaded before importing the database module.
// This guarantees DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, etc.
// are available when config/db.js is loaded.
//

dotenv.config();

// ============================================================
// DATABASE
// ============================================================

const { testDatabaseConnection } = require("./config/db");

// ============================================================
// ROUTES
// ============================================================

const soilRoutes = require("./routes/soilRoutes");
const soilAnalysisRoutes = require("./routes/soilAnalysisRoutes");

// ============================================================
// APPLICATION
// ============================================================

const app = express();

const PORT = Number(process.env.PORT || 3000);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ============================================================
// STATIC FRONTEND
// ============================================================

app.use(express.static(path.join(__dirname, "..", "public")));

// ============================================================
// SOIL SAMPLE API
// ============================================================

app.use("/api/soil-samples", soilRoutes);
app.use("/api/soil-analysis", soilAnalysisRoutes);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    application: "Soil Analysis GIS",
    status: "running",
  });
});

// ============================================================
// API 404 HANDLER
// ============================================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  console.log("");
  console.log("========================================");
  console.log(" SOIL ANALYSIS GIS");
  console.log("========================================");

  try {
    console.log("Environment loaded");

    await testDatabaseConnection();

    const server = app.listen(PORT, () => {
      console.log("");
      console.log("✓ GIS Server running on port " + PORT);

      console.log("");
      console.log("Open: http://localhost:" + PORT);

      console.log("");
      console.log("========================================");
    });

    // --------------------------------------------------------
    // Graceful shutdown
    // --------------------------------------------------------

    const shutdown = async (signal) => {
      console.log("");
      console.log(`${signal} received. Shutting down server...`);

      server.close(() => {
        console.log("HTTP server stopped.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error(" SERVER STARTUP FAILED");
    console.error("========================================");

    console.error(error);

    process.exit(1);
  }
}

// ============================================================
// START
// ============================================================

startServer();
