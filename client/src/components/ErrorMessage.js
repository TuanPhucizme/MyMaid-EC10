import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertCircle, X } from 'lucide-react';

const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin: 16px 0;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  line-height: 1.5;
  animation: ${slideInDown} 0.4s ease-out, ${shake} 0.6s ease-out 0.4s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  }
  
  &:hover {
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.15);
    transform: translateY(-1px);
    transition: all 0.3s ease;
  }
`;

const ErrorIcon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.1);
  animation: ${shake} 0.6s ease-out 0.6s;
`;

const ErrorText = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 13px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ErrorMessage = ({ message, onClose, show = true }) => {
  if (!show || !message) return null;

  return (
    <ErrorContainer>
      <ErrorIcon>
        <AlertCircle size={16} />
      </ErrorIcon>
      <ErrorText>{message}</ErrorText>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Đóng thông báo lỗi">
          <X size={16} />
        </CloseButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage; 