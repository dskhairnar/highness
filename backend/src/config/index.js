require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  strapi: {
    url: process.env.STRAPI_URL || "http://localhost:1337/api",
    token: process.env.STRAPI_TOKEN,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};
