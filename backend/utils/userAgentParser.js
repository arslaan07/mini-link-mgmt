const UAParser = require("ua-parser-js");

const BOT_USER_AGENTS = [
    "WhatsApp", 
    "TelegramBot", 
    "facebookexternalhit", 
    "Twitterbot", 
    "LinkedInBot", 
    "Discordbot", 
    "Slackbot", 
    "Googlebot", 
    "bingbot"
];

function parseUserAgent(userAgent = "") {
    const parser = new UAParser();
    parser.setUA(userAgent); // Explicitly set the user agent

    const device = parser.getDevice().type || "Desktop";
    const os = parser.getOS().name || "Unknown";

    // Check if the user agent belongs to a known bot
    const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

    return { device, os, isBot };
}

module.exports = { parseUserAgent };
