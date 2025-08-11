const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const vnpayRouter = require('./routes/payment');
const cors = require('cors');

const serviceRoutes = require('./routes/serviceRoutes');

const userRoutes = require('./routes/userRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

const app = express();
const PORT = 3030;

app.use(cors()); // Thêm middleware CORS
app.use(express.json()); // Cho phép đọc req.body từ JSON
app.use(express.urlencoded({ extended: true })); // Cho phép đọc từ form

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);

app.use('/api/services', serviceRoutes);
app.use('/api/payment', vnpayRouter);

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});