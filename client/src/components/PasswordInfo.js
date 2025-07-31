import React from 'react';
import styled from 'styled-components';
import { Info } from 'lucide-react';

const InfoContainer = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const InfoIcon = styled.div`
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 1px;
`;

const InfoContent = styled.div`
  font-size: 11px;
  color: #1e40af;
  line-height: 1.4;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

const InfoText = styled.div`
  font-weight: 400;
`;

const PasswordInfo = () => {
  return (
    <InfoContainer>
      <InfoIcon>
        <Info size={14} />
      </InfoIcon>
      <InfoContent>
        <InfoTitle>Mật khẩu mạnh giúp bảo vệ tài khoản của bạn</InfoTitle>
        <InfoText>
          Sử dụng ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
        </InfoText>
      </InfoContent>
    </InfoContainer>
  );
};

export default PasswordInfo; 