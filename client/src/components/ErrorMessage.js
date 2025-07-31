import React from 'react';
import styled from 'styled-components';
import { AlertCircle, X } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 16px 0;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  line-height: 1.5;
`;

const ErrorIcon = styled(AlertCircle)`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #dc2626;
`;

const ErrorText = styled.div`
  flex: 1;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fecaca;
  }
`;

const ErrorMessage = ({ message, onClose, show = true }) => {
  if (!show || !message) return null;

  return (
    <ErrorContainer>
      <ErrorIcon />
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