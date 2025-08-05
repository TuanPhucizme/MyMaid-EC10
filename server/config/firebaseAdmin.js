// server/config/firebaseAdmin.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Điều chỉnh đường dẫn nếu cần

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };