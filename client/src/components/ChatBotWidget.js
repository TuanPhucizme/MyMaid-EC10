// components/ChatBotWidget.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { MessageCircle, X } from 'lucide-react';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #667eea;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background-color: #5a67d8;
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 350px;
  max-height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  z-index: 998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
`;

const ChatHeader = styled.div`
  background: #667eea;
  color: white;
  padding: 1rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  background: #f9fafb;
`;

const ChatMessage = styled.div`
  margin-bottom: 0.75rem;
  text-align: ${(props) => (props.from === 'user' ? 'right' : 'left')};
  span {
    display: inline-block;
    background: ${(props) => (props.from === 'user' ? '#667eea' : '#e5e7eb')};
    color: ${(props) => (props.from === 'user' ? 'white' : '#1f2937')};
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    max-width: 75%;
  }
`;

const ChatInputWrapper = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 1rem;
`;

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const userMessage = input.trim();
      setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
      setInput('');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:3030/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        setMessages((prev) => [...prev, { from: 'bot', text: data.reply }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: '❌ Lỗi khi phản hồi từ AI. Vui lòng thử lại.' }
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            Trợ lý ảo
            <X style={{ cursor: 'pointer' }} size={20} onClick={() => setIsOpen(false)} />
          </ChatHeader>

          <ChatBody>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} from={msg.from}>
                <span>{msg.text}</span>
              </ChatMessage>
            ))}
            {loading && (
              <ChatMessage from="bot">
                <span>Đang xử lý...</span>
              </ChatMessage>
            )}
          </ChatBody>

          <ChatInputWrapper>
            <ChatInput
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSend}
              disabled={loading}
            />
          </ChatInputWrapper>
        </ChatWindow>
      )}

      <FloatingButton onClick={() => setIsOpen(!isOpen)} aria-label="Chat với trợ lý">
        {isOpen ? <X /> : <MessageCircle />}
      </FloatingButton>
    </>
  );
};

export default ChatBotWidget;
