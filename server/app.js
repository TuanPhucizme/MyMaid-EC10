const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables từ root directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const vnpayRouter = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Thêm middleware CORS
app.use(express.json()); // Cho phép đọc req.body từ JSON
app.use(express.urlencoded({ extended: true })); // Cho phép đọc từ form

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/payment', vnpayRouter);

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});