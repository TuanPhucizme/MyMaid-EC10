// src/components/PartnerApprovalModal.js

import React from 'react';
import styled from 'styled-components';
import { X, Mail, Phone, Home, CreditCard, Check, XCircle } from 'lucide-react';

// --- Styled Components ---
const ModalOverlay = styled.div`...`; // Sao chép từ các modal khác
const ModalContent = styled.div`...`;
const CloseButton = styled.button`...`;
const ModalHeader = styled.div`...`;
const ModalTitle = styled.h2`...`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1.5rem;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 0.75rem;
  object-fit: cover;
  border: 1px solid #e5e7eb;
`;

const InfoColumn = styled.div``;
const DetailItem = styled.div` margin-bottom: 1rem; `;
const DetailLabel = styled.p` font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; `;
const DetailValue = styled.p` font-weight: 500; color: #1a202c; display: flex; align-items: center; gap: 0.5rem; `;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  &:disabled { cursor: not-allowed; opacity: 0.7; }
`;

const RejectButton = styled(ActionButton)`
  background: #fee2e2;
  color: #b91c1c;
`;

const ApproveButton = styled(ActionButton)`
  background: #dcfce7;
  color: #166534;
`;

const PartnerApprovalModal = ({ partner, onApprove, onReject, onClose, isProcessing }) => {
  if (!partner) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        <ModalHeader>
          <ModalTitle>Duyệt Hồ Sơ Đối Tác</ModalTitle>
        </ModalHeader>
        
        <ContentGrid>
          <Avatar src={partner.photoURL || 'https://via.placeholder.com/150'} alt={partner.name} />
          <InfoColumn>
            <DetailItem>
              <DetailLabel>Họ và tên</DetailLabel>
              <DetailValue>{partner.name}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Email</DetailLabel>
              <DetailValue><Mail size={14} /> {partner.email}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Số điện thoại</DetailLabel>
              <DetailValue><Phone size={14} /> {partner.phone}</DetailValue>
            </DetailItem>
          </InfoColumn>
        </ContentGrid>
        
        <div style={{ marginTop: '1.5rem' }}>
          <DetailItem>
            <DetailLabel>Địa chỉ</DetailLabel>
            <DetailValue><Home size={14} /> {partner.address}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Số CCCD</DetailLabel>
            <DetailValue><CreditCard size={14} /> {partner.idNumber}</DetailValue>
          </DetailItem>
        </div>

        <ModalActions>
          <RejectButton onClick={() => onReject(partner.uid)} disabled={isProcessing}>
            <XCircle size={16} /> Từ chối
          </RejectButton>
          <ApproveButton onClick={() => onApprove(partner.uid)} disabled={isProcessing}>
            <Check size={16} /> Duyệt hồ sơ
          </ApproveButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PartnerApprovalModal;