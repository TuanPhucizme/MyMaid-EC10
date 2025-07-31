const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const vnpayRouter = require('./routes/payment');
const cors = require('cors');

const app = express();
const PORT = 3030;

app.use(cors()); // Thêm middleware CORS
app.use(express.json()); // Cho phép đọc req.body từ JSON
app.use(express.urlencoded({ extended: true })); // Cho phép đọc từ form

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/payment', vnpayRouter);

app.listen(PORT, () => {
  console.log(`✅ VNPay server is running at http://localhost:${PORT}`);
});