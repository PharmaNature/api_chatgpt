const express = require("express");
const session = require('express-session')
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

// creation de la session 
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}))

// Body-parser
app.use(bodyParser.json());

app.use("/gpt", gptRoutes);

// Server
app.listen(8080, () => {
  console.log(`Listening on port 8080`);
});