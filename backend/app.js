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
const WebSocket = require("ws")
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })
require("dotenv").config();
 
connectDB();

const allowedOrigins = [
  "http://localhost:5173", // Development 
  "https://mykitly.netlify.app", 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Allow cookies
    methods: "GET,POST,PUT,DELETE", // ✅ Explicitly allow these methods
  })
);
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.on('close', () => console.log('Client disconnected'))
})
app.use("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl: shortUrl });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short link not found",
      });
    }
  
    if (url.expirationDate && url.expirationDate.getTime() < Date.now()) { 
      // console.log('link has expired')
      return res.redirect(`https://kitly.netlify.app/link-expired`)
    }
    const userAgent = req.headers["user-agent"]; 
    const { device, os, isBot } = parseUserAgent(userAgent);
    if(isBot) {
      console.log('Bot detected')
      return res.status(403).json({
        success: false,
        message: "Bot detected",
      });
    }
    const clientIP = req.headers["x-forwarded-for"]?.split(',')[0] || 
                 req.socket?.remoteAddress || 
                 req.ip || 
                 "Unknown";
    url.clickData.push({
      ipAddress: clientIP,
      timestamp: new Date(),
      userAgent, 
      device,
      os,
    });
    await url.save();
    // send websocket event when shorturl is clicked
    wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message: 'Link Clicked!'}))
      }
    })
    res.redirect(url.originalUrl);
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
// function keepServerAlive() {
//   if (process.env.RENDER_EXTERNAL_URL) {
//       setInterval(async () => {
//           try {
//               const response = await axios.get(process.env.RENDER_EXTERNAL_URL);
//               console.log('Server pinged successfully');
//           } catch (error) {
//               console.error('Ping failed', error);
//           }
//       }, 10 * 60 * 1000); // Ping every 10 minutes
//   }
// }

// keepServerAlive();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
