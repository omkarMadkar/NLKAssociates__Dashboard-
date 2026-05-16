const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// ROUTES
const authRoutes = require("./routes/authRoutes");

// CONFIG
dotenv.config();

// APP
const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json());


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("NLK Legal Management API Running...");
});


// API ROUTES
app.use("/api/auth", authRoutes);


// PORT
const PORT = process.env.PORT || 5000;


// SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});