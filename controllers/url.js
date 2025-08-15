const shortid = require('shortid');
const Url = require('../models/urlModel');

exports.generateShortUrl = async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.render('index', { shortUrl: null, error: "Please provide a URL" });
    }

    const shortId = shortid.generate();
    await Url.create({ originalUrl, shortId });

    res.render('index', { shortUrl: `${req.headers.host}/${shortId}`, error: null });
};

exports.redirectToOriginal = async (req, res) => {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId });
    if (!url) return res.send("URL not found");

    url.clickCount++;
    await url.save();
    res.redirect(url.originalUrl);
};

exports.getAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId });
    if (!url) return res.send("Analytics not found");

    res.render('analytics', { shortId, clicks: url.clickCount });
};
