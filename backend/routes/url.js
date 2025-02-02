const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Url = require("../models/url");
const verifyToken = require("../middlewares/verifyToken");
const { parseUserAgent } = require("../utils/userAgentParser");
const crypto = require("crypto");
router.post("/", verifyToken, async (req, res) => {
  let { originalUrl, expirationDate, remarks } = req.body;
  // Validate original URL format
  if (!/^https?:\/\//.test(originalUrl)) {
    originalUrl = `https://${originalUrl}`;
  }
  try {
    // console.log(req.user);
    const salt = crypto.randomBytes(16).toString('hex')
    const urlWithSalt = originalUrl + salt
    const hash = crypto.createHash("sha256").update(urlWithSalt).digest("hex");
    const shortUrl = hash.substring(0, 8);
    const newUrl = await Url.create({
      originalUrl,
      shortUrl,
      createdBy: req.user.id,
      remarks,
      expirationDate,
    });
    // console.log(newUrl);
    res.status(201).json({
      success: true,
      newUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create short link",
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;  // Parse as integer
    const limit = parseInt(req.query.limit) || 10;  // Parse as integer
    const skip = page * limit;
    const urls = await Url.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
    const paginatedUrls = urls.slice(page * limit, (page + 1) * limit)
    const totalLinks = urls.length
    res.status(200).json({ success: true, urls, paginatedUrls, totalLinks });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get urls",
    });
  }
});
router.get("/clickdata", verifyToken, async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.user.id });
    // Flatten the array before sorting
    const clickData = urls
      .flatMap((url) => url.clickData) // Merge all clickData arrays
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp (latest first)
    // console.log("clickdata:", clickData);
    res.status(200).json({
      success: true,
      clickData: clickData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get clickData",
    });
  }
});
router.get("/analytics", verifyToken, async (req, res) => {   
  try {     
    const page = parseInt(req.query.page) || 0;  // Parse as integer
    const limit = parseInt(req.query.limit) || 10;  // Parse as integer
    const urls = await Url.find({ createdBy: req.user.id });  
      // console.log(paginatedUrls)
      
      // Flatten and transform click data
      const allClicks = urls.flatMap(url => 
          url.clickData.map(click => ({
              urlId: url._id,
              originalUrl: url.originalUrl,
              shortUrl: url.shortUrl,
              timestamp: click.timestamp,
              ipAddress: click.ipAddress,
              device: click.device,
              userAgent: click.userAgent,
              os: click.os
          }))
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      const paginatedClicks = allClicks.slice(page * limit, (page + 1) * limit)
      const totalLinks = allClicks.length
      // console.log(totalLinks)
      res.status(200).json({
          success: true,
          result: paginatedClicks,
          totalLinks

      });
  } catch (error) {
      // console.error('Analytics fetch error:', error);
      return res.status(500).json({
          success: false,
          message: "Failed to retrieve click analytics",
          error: error.message
      });
  } 
});
router.get('/search', verifyToken, async (req, res) => {
  try {
    const searchQuery = req.query.q || '';  // Get query from request
    const userId = req.user.id;  // Get user ID from token

    // Use regex for case-insensitive partial matching
    const urls = await Url.find({
      createdBy: userId,
      remarks: { $regex: searchQuery, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, urls });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Failed to search URLs' });
  }
});


router.put("/:urlId", verifyToken, async (req, res) => {
  try {
    const { urlId } = req.params;
    const { originalUrl, expirationDate, remarks } = req.body;
    const url = await Url.findOneAndUpdate(
      { _id: urlId },
      {
        originalUrl,
        remarks,
        expirationDate,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Short link updated successfully",
      updatedUrl: url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update short link",
    });
  }
});
router.get("/url/:urlId", verifyToken, async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findOne({ _id: urlId });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short link not found",
      });
    }
    res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get short link",
    });
  }
});

router.delete("/:urlId", verifyToken, async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findOneAndDelete({ _id: urlId });
    res.status(200).json({
      success: true,
      message: "Short link deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete short link",
    });
  }
});


router.get("/:id/analytics", verifyToken, async (req, res) => {
  try {
    const urlId = req.params.id;

    const url = await Url.findOne({ createdBy: req.user.id });
    if (!url) return res.status(404).json({ error: "URL not found" });

    const dateWiseClicks = await Url.aggregate([
      { $match: { shortUrl: url.shortUrl } },
      { $unwind: `$clickData` },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$clickData.timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const analytics = {
      totalClicks: url.clickData.length,
      deviceDistribution: url.clickData.reduce((acc, click) => {
        acc[click.device] = (acc[click.device] || 0) + 1;
        return acc;
      }, {}),
      osDistribution: url.clickData.reduce((acc, click) => {
        acc[click.os] = (acc[click.os] || 0) + 1;
        return acc;
      }, {}),
    };
    analytics.dateWiseClicks = dateWiseClicks;
    res.json({
      success: true,
      analytics,
      message: "Analytics fetched successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch analytics" });
  }
});

router.get("/:id/clicks", verifyToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const urlId = req.params.id;

    const url = await Url.findOne({ _id: urlId, createdBy: req.user.id });
    if (!url) return res.status(404).json({ error: "URL not found" });

    const paginatedClicks = url.clickData.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      clicks: paginatedClicks,
      totalClicks: url.clickData.length,
      totalPages: Math.ceil(url.clickData.length / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clicks" });
  }
});

module.exports = router;
