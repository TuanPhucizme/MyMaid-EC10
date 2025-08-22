import React from 'react';
import styled, { keyframes } from 'styled-components'; // Import keyframes if you want subtle animations
import { X, Check, AlertTriangle } from 'lucide-react'; // AlertTriangle có thể dùng cho modal cảnh báo khác

// --- Styled Components ---

// Optional: Add a subtle animation for modal entry if desired
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out; /* Add fade-in animation to the overlay */
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem; /* rounded-lg */
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-xl */
  display: flex;
  flex-direction: column; /* Stack header, body, actions vertically */
  animation: ${slideDown} 0.3s ease-out; /* Add slide-down animation to the modal content */
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb; /* border-neutral-200 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb; /* bg-neutral-50 */
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  color: #1a202c; /* text-neutral-900 */
  /* Remove flex/gap here if icon is not always part of the title prop */
  /* For this modal, title is just text as per image */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280; /* text-neutral-500 */
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem; /* rounded-md */
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6; /* bg-neutral-100 */
    color: #374151; /* text-neutral-700 */
  }
`;

const ModalBodyWrapper = styled.div`
  padding: 1.5rem; /* Padding for the main content area */
  flex-grow: 1; /* Allow body to take available space */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBody = styled.p` 
  color: #6b7280; /* text-neutral-500 */ 
  margin: 0; /* Reset margin as padding is on wrapper */
  text-align: center; 
  font-size: 1rem; /* text-base */
  line-height: 1.5;
`;

const ModalActionsWrapper = styled.div`
  padding: 1.5rem; /* Padding for action buttons area */
  border-top: 1px solid #e5e7eb; /* border-neutral-200 */
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

// Định nghĩa lại Button component để nhận variant
const Button = styled.button`
  /* Base button styles - lấy từ .btn trong index.css */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem; /* px-6 py-3 tương đương */
  border: none;
  border-radius: 0.75rem; /* rounded-lg */
  font-size: 1rem; /* text-base */
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* min-h-[44px] */
  gap: 0.5rem; /* Khoảng cách giữa icon và text */

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Variant: cancel (Hủy) - Dựa trên màu xám nhạt trong ảnh */
  ${props => props.$variant === 'cancel' && `
    background: #e5e7eb; /* bg-neutral-200 */
    color: #4b5563; /* text-neutral-700 */
    font-weight: 500; /* font-medium */

    &:hover:not(:disabled) {
      background: #d1d5db; /* bg-neutral-300 */
      transform: translateY(-1px);
    }
  `}

  /* Variant: confirm (Gửi yêu cầu) - Dựa trên màu xanh lá trong ảnh */
  ${props => props.$variant === 'confirm' && `
    background: #10b981; /* bg-emerald-500 */
    color: white;
    font-weight: 600; /* font-semibold */

    &:hover:not(:disabled) {
      background: #059669; /* bg-emerald-600 */
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); /* Custom shadow for green button */
    }
  `}
`;


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
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        </ModalHeader>
        <ModalBodyWrapper>
          <ModalBody>{message}</ModalBody>
        </ModalBodyWrapper>
        <ModalActionsWrapper>
          <Button $variant="cancel" onClick={onClose}>Hủy</Button>
          <Button $variant="confirm" onClick={onConfirm} disabled={isProcessing}>
            <Check size={16} /> {isProcessing ? 'Đang xử lý...' : confirmText}
          </Button>
        </ModalActionsWrapper>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;