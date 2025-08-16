const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const bodyParser = require('body-parser');

const vnpayRouter = require('./routes/payment');
const cors = require('cors');

const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
console.log('Loading address routes...');
const addressRoutes = require('./routes/addressRoutes');
console.log('Address routes loaded:', typeof addressRoutes);

// Load environment variables từ root directory

console.log('Loading routes...');
const userRoutes = require('./routes/userRoutes');
console.log('User routes loaded');
const partnerRoutes = require('./routes/partnerRoutes');
console.log('Partner routes loaded');
const orderRoutes = require('./routes/orderRoutes');
console.log('Order routes loaded');
const bookingRoutes = require('./routes/bookingRoutes');
console.log('Booking routes loaded');
const serviceRoutes = require('./routes/serviceRoutes');
console.log('Service routes loaded');

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

try {
  app.use('/api/orders', orderRoutes);
  console.log('Order routes mounted at /api/orders');
} catch (error) {
  console.error('Error mounting order routes:', error);
}

try {
  console.log('About to mount address routes...');
  console.log('addressRoutes type:', typeof addressRoutes);
  console.log('addressRoutes stack length:', addressRoutes.stack ? addressRoutes.stack.length : 'undefined');
  app.use('/api/addresses', addressRoutes);
  console.log('Address routes mounted at /api/addresses');

  // Test direct route
  app.get('/api/addresses/direct-test', (req, res) => {
    res.json({ message: 'Direct address route working!' });
  });
  console.log('Direct address test route added');
} catch (error) {
  console.error('Error mounting address routes:', error);
}

// Debug: Log all registered routes
console.log('Registered routes:');
console.log('- /api/users/*');
console.log('- /api/partners/*');
console.log('- /api/services/*');
console.log('- /api/payment/*');
console.log('- /api/orders/*');
console.log('- /api/addresses/*');

// Test route registration
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Test route working');
});
console.log('Test route /test added');

// Test route để generate token cho test avatar upload
app.get('/generate-test-token', async (req, res) => {
  try {
    const { auth } = require('./config/firebaseAdmin');
    const testUserId = 'ZyESr5wCHIfnrgQPNAHUAurC1nA2';
    
    console.log('🔑 [TEST TOKEN] Generating token for user:', testUserId);
    const customToken = await auth.createCustomToken(testUserId);
    
    res.json({
      success: true,
      token: customToken,
      userId: testUserId,
      message: 'Test token generated successfully'
    });
  } catch (error) {
    console.error('💥 [TEST TOKEN] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to generate test token'
    });
  }
});
console.log('Test route /generate-test-token added');

// Route để enable Firebase Storage
app.get('/enable-storage', async (req, res) => {
  try {
    console.log('🔧 [ENABLE STORAGE] Request received');
    const { enableFirebaseStorage } = require('./scripts/enableFirebaseStorage');
    
    const bucketName = await enableFirebaseStorage();
    
    res.json({
      success: true,
      bucketName: bucketName,
      message: 'Firebase Storage enabled successfully',
      instruction: 'You can now upload files to this bucket'
    });
  } catch (error) {
    console.error('💥 [ENABLE STORAGE] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to enable Firebase Storage',
      instruction: 'Please enable Firebase Storage manually in Firebase Console'
    });
  }
});
console.log('Test route /enable-storage added');

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

app.use('/api/bookings', bookingRoutes);

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