// ===========================
// 1. Load environment + config
// ===========================
require("dotenv").config();
const config = require("./config/mongodb");
config.mongoConnection();

// ===========================
// 2. Core + Middleware modules
// ===========================
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("node:path");

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const jsendMiddleware = require("./middlewares/jsendMid");
const rateLimiter = require("./middlewares/rate");
const errorHandler = require("./middlewares/errorHandler");
const notFoundHandler = require("./middlewares/notfoundroutes");
const logger = require("./middlewares/logger");

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const reviewRoute = require("./routes/review");
const adminRoute = require("./routes/admin");
const paymentRoute = require("./routes/payment");
const webhookRoute = require("./routes/webhook");
const healthRoute = require("./routes/health");
docsRoutes = require("./docs/config");

const app = express();

// ===========================
// 3. Global Middleware Setup
// ===========================

app.use("/api/payment/webhook", webhookRoute);

// JSON and Form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Security and performance
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || `http://localhost:5500`,
    credentials: process.env.CORS_CREDENTIALS === "true" || true,
  })
);
app.use(compression());

// Logging
app.use(logger);

// jsend formatter
app.use(jsendMiddleware);

// Rate limiting
app.use(rateLimiter);

// ===========================
// 4. Routes
// ===========================
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/health", healthRoute);
docsRoutes(app);
// ===========================
// 5. 404 Handler (Should be AFTER all routes)
// ===========================
app.use(notFoundHandler);

// ===========================
// 6. Global Error Handler (Final)
// ===========================
app.use(errorHandler);

// ===========================
// 7. Server Listen
// ===========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
