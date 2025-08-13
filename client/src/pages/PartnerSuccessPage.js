// src/pages/PartnerRegistrationSuccessPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle2, ArrowRight } from 'lucide-react';

// --- Styled Components (Có thể tái sử dụng từ các trang khác) ---
const SuccessContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const SuccessCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  background: #dcfce7; // Màu xanh lá cây nhạt
  color: #16a34a; // Màu xanh lá cây đậm
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const PartnerRegistrationSuccessPage = () => {
  return (
    <SuccessContainer>
      <SuccessCard>
        <IconContainer>
          <CheckCircle2 size={40} />
        </IconContainer>
        <Title>Hồ sơ đã được gửi thành công!</Title>
        <Message>
          Cảm ơn bạn đã đăng ký trở thành đối tác của MyMaid. Hồ sơ của bạn đang được chúng tôi xem xét. Quá trình này có thể mất vài ngày làm việc. Chúng tôi sẽ thông báo cho bạn qua email khi có kết quả.
        </Message>
        <ActionButton to="/">
          Về trang chính
          <ArrowRight size={16} />
        </ActionButton>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default PartnerRegistrationSuccessPage;