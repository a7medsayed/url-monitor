const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const checkRoutes = require("./routes/checkRoutes");
const config = require("config");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const basicAuth = require("express-basic-auth");
const { startTasks } = require("./services/checkService");
const axios = require("axios");
const { checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Api Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const configDb = config.get("database");
// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

axios.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  }
);

startTasks();
// database connection
const dbURI = `mongodb+srv://${configDb.username}:${configDb.password}@cluster0.qe3tq.mongodb.net/${configDb.database}`;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.use(authRoutes);
app.use(checkRoutes);

module.exports = app;
