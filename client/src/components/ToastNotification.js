import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOutRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const ToastItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 320px;
  max-width: 480px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  pointer-events: auto;
  animation: ${props => props.$isExiting ? slideOutRight : slideInRight} 0.3s ease-out;
  
  ${props => {
    switch (props.$type) {
      case 'error':
        return `
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #fecaca;
          color: #dc2626;
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          color: #16a34a;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fde68a;
          color: #d97706;
        `;
      case 'info':
      default:
        return `
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
          color: #2563eb;
        `;
    }
  }}
`;

const ToastIcon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.8;
  word-wrap: break-word;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'error':
      return <AlertCircle size={20} />;
    case 'success':
      return <CheckCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
    default:
      return <Info size={20} />;
  }
};

const getTitle = (type) => {
  switch (type) {
    case 'error':
      return 'Lỗi';
    case 'success':
      return 'Thành công';
    case 'warning':
      return 'Cảnh báo';
    case 'info':
    default:
      return 'Thông báo';
  }
};

const Toast = ({ id, type, message, title, duration, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  return (
    <ToastItem $type={type} $isExiting={isExiting}>
      <ToastIcon>
        {getIcon(type)}
      </ToastIcon>
      <ToastContent>
        <ToastTitle>{title || getTitle(type)}</ToastTitle>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <CloseButton onClick={handleClose} aria-label="Đóng thông báo">
        <X size={16} />
      </CloseButton>
    </ToastItem>
  );
};

const ToastNotification = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleUserError = (event) => {
      const { message, error, title } = event.detail;

      addToast({
        type: 'error',
        message: message,
        title: title,
        duration: 5000
      });
    };

    const handleUserSuccess = (event) => {
      const { message, title } = event.detail;

      addToast({
        type: 'success',
        message: message,
        title: title,
        duration: 3000
      });
    };

    const handleUserWarning = (event) => {
      const { message, title } = event.detail;

      addToast({
        type: 'warning',
        message: message,
        title: title,
        duration: 4000
      });
    };

    const handleUserInfo = (event) => {
      const { message, title } = event.detail;

      addToast({
        type: 'info',
        message: message,
        title: title,
        duration: 3000
      });
    };

    window.addEventListener('userError', handleUserError);
    window.addEventListener('userSuccess', handleUserSuccess);
    window.addEventListener('userWarning', handleUserWarning);
    window.addEventListener('userInfo', handleUserInfo);

    return () => {
      window.removeEventListener('userError', handleUserError);
      window.removeEventListener('userSuccess', handleUserSuccess);
      window.removeEventListener('userWarning', handleUserWarning);
      window.removeEventListener('userInfo', handleUserInfo);
    };
  }, []);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ...toast }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={removeToast}
        />
      ))}
    </ToastContainer>
  );
};

// Utility functions để trigger toast từ bất kỳ đâu
export const showToast = {
  error: (message, title = null) => {
    const event = new CustomEvent('userError', {
      detail: { message, title }
    });
    window.dispatchEvent(event);
  },
  
  success: (message, title = null) => {
    const event = new CustomEvent('userSuccess', {
      detail: { message, title }
    });
    window.dispatchEvent(event);
  },
  
  warning: (message, title = null) => {
    const event = new CustomEvent('userWarning', {
      detail: { message, title }
    });
    window.dispatchEvent(event);
  },
  
  info: (message, title = null) => {
    const event = new CustomEvent('userInfo', {
      detail: { message, title }
    });
    window.dispatchEvent(event);
  }
};

export default ToastNotification;
