require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const { generateShortUrl, redirectToOriginal, getAnalytics } = require('./controllers/url');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('index', { shortUrl: null, error: null }));
app.post('/shorten', generateShortUrl);
app.get('/:shortId', redirectToOriginal);
app.get('/analytics/:shortId', getAnalytics);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
