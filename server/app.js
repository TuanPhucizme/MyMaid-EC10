const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const vnpayRouter = require('./routes/payment');
const cors = require('cors');

const serviceRoutes = require('./routes/serviceRoutes');

// Load environment variables từ root directory

console.log('Loading routes...');
const userRoutes = require('./routes/userRoutes');
console.log('User routes loaded');
const partnerRoutes = require('./routes/partnerRoutes');
console.log('Partner routes loaded');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Express app created');
console.log('App type:', typeof app);
console.log('App methods:', Object.getOwnPropertyNames(app));
console.log('App prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(app)));

app.use(cors()); // Thêm middleware CORS
console.log('CORS middleware added');
app.use(express.json()); // Cho phép đọc req.body từ JSON
console.log('JSON middleware added');
app.use(express.urlencoded({ extended: true })); // Cho phép đọc từ form
console.log('URL encoded middleware added');

app.use(bodyParser.json());
console.log('Body parser JSON middleware added');
app.use(bodyParser.urlencoded({ extended: true }));
console.log('Body parser URL encoded middleware added');

console.log('Mounting routes...');
try {
  console.log('About to mount user routes...');
  console.log('userRoutes type:', typeof userRoutes);
  console.log('userRoutes stack length:', userRoutes.stack ? userRoutes.stack.length : 'undefined');
  console.log('userRoutes stack:', userRoutes.stack.map(layer => layer.route ? `${Object.keys(layer.route.methods)} ${layer.route.path}` : 'middleware'));
  app.use('/api/users', userRoutes);
  console.log('User routes mounted at /api/users');
  
  // Check if routes were actually added
  console.log('Checking app.router after mounting user routes...');
  if (app.router && app.router.stack) {
    console.log('App router stack length after mounting user routes:', app.router.stack.length);
    const routeLayers = app.router.stack.filter(layer => layer.route);
    console.log('Route layers after mounting user routes:', routeLayers.length);
    routeLayers.forEach(layer => {
      console.log(`Route: ${Object.keys(layer.route.methods)} ${layer.route.path}`);
    });
  } else {
    console.log('App router not available after mounting user routes');
  }
} catch (error) {
  console.error('Error mounting user routes:', error);
  console.error('Error stack:', error.stack);
}

try {
  app.use('/api/partners', partnerRoutes);
  console.log('Partner routes mounted at /api/partners');
} catch (error) {
  console.error('Error mounting partner routes:', error);
}

try {
  app.use('/api/services', serviceRoutes);
  console.log('Service routes mounted at /api/services');
} catch (error) {
  console.error('Error mounting service routes:', error);
}

try {
  app.use('/api/payment', vnpayRouter);
  console.log('Payment routes mounted at /api/payment');
} catch (error) {
  console.error('Error mounting payment routes:', error);
}

// Debug: Log all registered routes
console.log('Registered routes:');
console.log('- /api/users/*');
console.log('- /api/partners/*');
console.log('- /api/services/*');
console.log('- /api/payment/*');

// Test route registration
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Test route working');
});
console.log('Test route /test added');

// Debug: Check if routes are actually registered
console.log('Checking app.router after adding test route...');
if (app.router && app.router.stack) {
  console.log('App router stack length:', app.router.stack.length);
  const routeLayers = app.router.stack.filter(layer => layer.route);
  console.log('Route layers:', routeLayers.length);
  routeLayers.forEach(layer => {
    console.log(`Route: ${Object.keys(layer.route.methods)} ${layer.route.path}`);
  });
} else {
  console.log('App router not available yet');
}

// Start server with route checking
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
  
  // Check routes after server starts
  console.log('Checking routes after server starts...');
  if (app.router && app.router.stack) {
    console.log('App router stack length:', app.router.stack.length);
    const routeLayers = app.router.stack.filter(layer => layer.route);
    console.log('Route layers:', routeLayers.length);
    routeLayers.forEach(layer => {
      console.log(`Route: ${Object.keys(layer.route.methods)} ${layer.route.path}`);
    });
  } else {
    console.log('App router still not available');
  }
});