const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");

// Routes
const mountRoutes = require("./routes");

// Connect with database
dbConnection();

// Express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("/{*splat}", cors());

// Compress all responses
app.use(compression());

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

// Development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Bazarna Store API is running 🚀",
  });
});

// Mount Routes
mountRoutes(app);

// Handle undefined routes
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start server
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);

  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
