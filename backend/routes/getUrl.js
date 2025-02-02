const express = require('express');
const Url = require('../models/url');
const { parseUserAgent } = require('../utils/userAgentParser');
const router = express.Router()

router.get("/", async (req, res) => {
    try {
      const { shortUrl } = req.params;
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

module.exports = router