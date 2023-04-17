require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/error");

// Start express app
const app = express();

app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// 1) Global Middlewares
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Limit requests from same API
const limiter = rateLimit({
  // 100 requests with the same ip in 1 hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Cors
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 3) Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
