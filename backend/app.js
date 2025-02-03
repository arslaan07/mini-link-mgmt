const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const connectDB = require("./connection/mongoose");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const cors = require("cors");
const Url = require("./models/url");
const { parseUserAgent } = require("./utils/userAgentParser");
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
app.use("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    // console.log(shortUrl);
    // console.log(req.params)
    const url = await Url.findOne({ shortUrl: shortUrl });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short link not found",
      });
    }
    const userAgent = req.headers["user-agent"];
    const { device, os } = parseUserAgent(userAgent);
    url.clickData.push({
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      timestamp: new Date(),
      userAgent,
      device,
      os,
    });
    await url.save();
    // console.log(url.originalUrl)
    res.redirect(url.originalUrl);
    // res.json("hello world")
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
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
