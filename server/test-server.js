// Simple test server to verify address routes
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server working!' });
});

// Address routes
const addressRoutes = require('./routes/addressRoutes');
app.use('/api/addresses', addressRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
