const express = require("express");
const app = express();

const topicsRoute = require("./routes/topics.route");
const errorHandler = require("./errorHandler");

// Handle topics routes
app.use("/api/topics", topicsRoute);

// Handle 404 route error
app.all("/*", errorHandler.routeNotFound404);

// Handle custom error including 400, 404, 500 status code
app.use(errorHandler.customErrorHandler);

module.exports = app;
