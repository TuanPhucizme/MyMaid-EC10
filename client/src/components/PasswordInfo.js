import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Info, Shield, Lock, Eye } from 'lucide-react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const InfoContainer = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${fadeInUp} 0.4s ease-out;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  }
  
  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }
`;

const InfoIcon = styled.div`
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
  padding: 8px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  animation: ${pulse} 2s infinite;
`;

const InfoContent = styled.div`
  flex: 1;
  font-size: 12px;
  color: #1e40af;
  line-height: 1.5;
`;

const InfoTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoText = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
`;

const SecurityTips = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
`;

const TipsTitle = styled.div`
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 6px;
  color: #1e3a8a;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TipItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-bottom: 4px;
  color: #1e40af;
  font-weight: 500;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '•';
    color: #3b82f6;
    font-weight: bold;
  }
`;

const PasswordInfo = () => {
  return (
    <InfoContainer>
      <InfoIcon>
        <Shield size={18} />
      </InfoIcon>
      <InfoContent>
        <InfoTitle>
          <Lock size={14} />
          Mật khẩu mạnh giúp bảo vệ tài khoản của bạn
        </InfoTitle>
        <InfoText>
          Sử dụng ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để tạo mật khẩu an toàn.
        </InfoText>
        
        <SecurityTips>
          <TipsTitle>Mẹo bảo mật:</TipsTitle>
          <TipsList>
            <TipItem>Không sử dụng thông tin cá nhân dễ đoán</TipItem>
            <TipItem>Tránh sử dụng cùng mật khẩu cho nhiều tài khoản</TipItem>
            <TipItem>Thay đổi mật khẩu định kỳ</TipItem>
          </TipsList>
        </SecurityTips>
      </InfoContent>
    </InfoContainer>
  );
};

export default PasswordInfo; 