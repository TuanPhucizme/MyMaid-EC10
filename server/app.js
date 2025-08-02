// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const vnpayRouter = require('./routes/payment');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router: VNPay
app.use('/api/payment', vnpayRouter);

// Chatbot Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatSessions = new Map(); // Lưu session theo userId

// Route: Chat Gemini
app.post('/chat', async (req, res) => {
  let { userId, message } = req.body;

  // Nếu không có userId thì tạo mặc định để test
  if (!userId) {
    userId = 'guest-user';
  }

  if (!message) {
    return res.status(400).json({ reply: '⚠️ Vui lòng nhập câu hỏi.' });
  }

  try {
    // Nếu chưa có session thì tạo mới
    if (!chatSessions.has(userId)) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const chat = model.startChat({
        history: [], // Lịch sử trống ban đầu
        generationConfig: {
          temperature: 0.7,
        },
        systemInstruction: {
            parts: [
              {
                text: `Bạn là trợ lý ảo của MyMaid — nền tảng cung cấp dịch vụ dọn dẹp nhà chuyên nghiệp.
        Bạn chỉ tư vấn về các dịch vụ như dọn dẹp theo giờ, theo ngày, theo nhóm hoặc cá nhân.
        Nếu người dùng hỏi điều không liên quan, hãy trả lời: "Tôi chỉ hỗ trợ về dịch vụ của MyMaid. Bạn có muốn tìm hiểu thêm không?"`,
              },
            ],
            role: 'user',
          },
      });

      chatSessions.set(userId, chat);
    }

    const chat = chatSessions.get(userId);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    res.status(500).json({ reply: '❌ Đã xảy ra lỗi AI. Thử lại sau.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
