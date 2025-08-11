// src/components/PartnerDetailModal.js

import React from 'react';
import styled from 'styled-components';
import { X, Mail, Phone, Star, ListChecks, CreditCard } from 'lucide-react';

// --- Styled Components for the Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  &:hover { color: #1a202c; }
`;

const Avatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
`;

const HeaderInfo = styled.div``;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const DetailItem = styled.div``;

const DetailLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const maskIdNumber = (idNumber) => {
  if (!idNumber || idNumber.length < 12) {
    return 'Không hợp lệ';
  }
  // Hiển thị 4 số đầu và 4 số cuối, che 4 số ở giữa
  return `${idNumber.substring(0, 4)} **** ${idNumber.substring(8)}`;
};

const PartnerDetailModal = ({ partner, onClose }) => {
  if (!partner) return null;

  // Ngăn việc click vào nội dung modal làm đóng modal
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={handleContentClick}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        
        <ModalHeader>
            <Avatar 
            src={partner.photoURL || 'https://i.pravatar.cc/150'} // Dùng ảnh thật hoặc ảnh mặc định
            alt={partner.name} 
            />
            <HeaderInfo>
            <ModalTitle>{partner.name}</ModalTitle>
            <p style={{ color: '#6b7280' }}>Chi tiết hồ sơ đối tác</p>
            </HeaderInfo>
        </ModalHeader>

        <DetailGrid>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue><Mail size={16} /> {partner.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Số điện thoại</DetailLabel>
            <DetailValue><Phone size={16} /> {partner.phone || 'Chưa có'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Đánh giá</DetailLabel>
            <DetailValue><Star size={16} /> {partner.rating} / 5</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Việc đã hoàn thành</DetailLabel>
            <DetailValue><ListChecks size={16} /> {partner.jobsCompleted}</DetailValue>
          </DetailItem>
                    {/* ✅ THÊM TRƯỜNG CCCD ĐÃ MÃ HÓA */}
          <DetailItem>
            <DetailLabel>Số CCCD (Bảo mật)</DetailLabel>
            <DetailValue>
              <CreditCard size={16} /> {maskIdNumber(partner.idNumber)}
            </DetailValue>
          </DetailItem>
        </DetailGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PartnerDetailModal;