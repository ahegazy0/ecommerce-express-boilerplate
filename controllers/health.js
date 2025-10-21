const mongoose = require("mongoose");
const wrapAsync = require("../utils/catchAsync");

const healthCheck = wrapAsync(async (req, res) => {
  const healthStatus = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    services: {
      database: "disconnected",
      server: "running",
    },
  };

  // Check database connection
  try {
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
      healthStatus.services.database = "connected";
      // Ping database
      await mongoose.connection.db.admin().ping();
    } else {
      healthStatus.services.database = "disconnected";
      healthStatus.status = "DEGRADED";
    }
  } catch (error) {
    healthStatus.services.database = "error";
    healthStatus.status = "DEGRADED";
    healthStatus.databaseError = error.message;
  }

  const statusCode = healthStatus.status === "OK" ? 200 : 503;

  return res.jsend.success(healthStatus, statusCode);
});

module.exports = {
  healthCheck,
};
