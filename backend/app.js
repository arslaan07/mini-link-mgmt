const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const connectDB = require("./connection/mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

connectDB();

const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://link-manage.netlify.app", // Production (REMOVE trailing `/`)
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Allow cookies
    methods: "GET,POST,PUT,DELETE", // ✅ Explicitly allow these methods
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
function keepServerAlive() {
  if (process.env.RENDER_EXTERNAL_URL) {
      setInterval(async () => {
          try {
              const response = await axios.get(process.env.RENDER_EXTERNAL_URL);
              console.log('Server pinged successfully');
          } catch (error) {
              console.error('Ping failed', error);
          }
      }, 10 * 60 * 1000); // Ping every 10 minutes
  }
}

// Call the function
keepServerAlive();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
