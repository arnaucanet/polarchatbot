const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const { helmetMiddleware, corsMiddleware, dataRateLimit } = require("./middlewares/security");
const requestContext = require("./middlewares/requestContext");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: "32kb" }));
app.use(requestContext);
app.use("/api/v1", dataRateLimit);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
