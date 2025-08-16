// src/components/ConfirmationModal.js

import React from 'react';
import styled from 'styled-components';
import { X, Check, AlertTriangle } from 'lucide-react';

// --- Styled Components ---
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalBody = styled.p` color: #6b7280; margin: 1.5rem 0; text-align: center; `;
const ModalActions = styled.div` display: flex; justify-content: flex-end; gap: 1rem; `;
const Button = styled.button`...`;

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalActions>
          <Button onClick={onClose} style={{ background: '#e5e7eb' }}>Hủy</Button>
          <Button onClick={onConfirm} disabled={isProcessing} style={{ background: '#10b981', color: 'white' }}>
            <Check size={16} /> {isProcessing ? 'Đang xử lý...' : confirmText}
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;