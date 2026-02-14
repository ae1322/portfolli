const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ----- Middleware -----
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// ----- Health check -----
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----- Routes -----
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/admin', require('./routes/admin'));

// ----- Error handler -----
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ----- Start -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
