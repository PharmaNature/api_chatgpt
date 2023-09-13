const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const gptRoutes = require("./routes/gptRoute.js");

// Express
const app = express();

// Cors
const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type", "authorization"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

// Body-parser
app.use(bodyParser.json());

app.use("/gpt", gptRoutes);

// Server
app.listen(8080, () => {
  console.log(`Listening on port 8080`);
});