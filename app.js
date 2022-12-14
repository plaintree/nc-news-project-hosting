const express = require("express");
const app = express();

const topicsRoute = require("./routes/topics.route");
const articlesRoute = require("./routes/articles.route");
const usersRoute = require("./routes/users.route");
const commentsRoute = require("./routes/comments.route");
const errorHandler = require("./errorHandler");

app.use(express.json());

// Handle topics routes
app.use("/api/topics", topicsRoute);

// Handle articles routes
app.use("/api/articles", articlesRoute);

// Handle users routes
app.use("/api/users", usersRoute);

// Handle comments routes
app.use("/api/comments", commentsRoute);

// Handle 404 route error
app.all("/*", errorHandler.routeNotFound404);

// Handle custom error including 400, 404, 500 status code
app.use(errorHandler.customErrorHandler);

module.exports = app;
