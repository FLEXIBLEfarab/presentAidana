const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing (needed for Telegram webhook)
app.use(express.json());

// Start Telegram bot if BOT_TOKEN is set
const BOT_TOKEN = process.env.BOT_TOKEN;
if (BOT_TOKEN) {
  require('./telegram-bot').start(app, BOT_TOKEN);
} else {
  console.log('ℹ️  BOT_TOKEN not set — Telegram bot disabled');
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`💖 Server running on http://localhost:${PORT}`);
});
