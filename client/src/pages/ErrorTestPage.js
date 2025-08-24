import React, { useState } from 'react';
import styled from 'styled-components';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Bug, Zap } from 'lucide-react';
import { 
  showUserError, 
  showUserSuccess, 
  createError, 
  ERROR_TYPES, 
  SERVICES 
} from '../services/errorHandler';
import { showToast } from '../components/ToastNotification';
import ToastNotification from '../components/ToastNotification';
import ErrorMessage from '../components/ErrorMessage';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TestSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TestButton = styled.button`
  margin: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'error':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case 'warning':
        return `
          background: #f59e0b;
          color: white;
          &:hover { background: #d97706; }
        `;
      case 'info':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
        `;
      default:
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; }
        `;
    }
  }}
`;

const ErrorTestPage = () => {
  const [inlineError, setInlineError] = useState('');

  // Test các loại lỗi khác nhau
  const testPaymentError = () => {
    const error = createError(
      ERROR_TYPES.PAYMENT_ERROR,
      SERVICES.PAYMENT,
      'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch'
    );
    showUserError(error);
  };

  const testNetworkError = () => {
    const error = createError(
      ERROR_TYPES.NETWORK_ERROR,
      SERVICES.API_ERROR,
      'Không thể kết nối đến máy chủ'
    );
    showUserError(error);
  };

  const testValidationError = () => {
    const error = createError(
      ERROR_TYPES.VALIDATION_ERROR,
      SERVICES.ORDER,
      'Vui lòng nhập đầy đủ thông tin liên hệ'
    );
    showUserError(error);
  };

  const testAuthError = () => {
    const error = createError(
      ERROR_TYPES.AUTH_ERROR,
      SERVICES.AUTH,
      'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại'
    );
    showUserError(error);
  };

  const testServiceUnavailable = () => {
    const error = createError(
      ERROR_TYPES.SERVICE_UNAVAILABLE,
      SERVICES.VIETNAM_ADDRESS,
      'Dịch vụ tìm kiếm địa chỉ tạm thời không khả dụng'
    );
    showUserError(error);
  };

  const testGenericError = () => {
    const error = createError(
      'UNKNOWN_ERROR',
      'UNKNOWN_SERVICE',
      'Đã xảy ra lỗi không xác định'
    );
    showUserError(error);
  };

  // Test thông báo thành công
  const testSuccessMessage = () => {
    showUserSuccess('Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.', 'Thanh toán hoàn tất');
  };

  const testPaymentSuccess = () => {
    showUserSuccess('Thanh toán VNPay thành công. Mã giao dịch: #VNP123456789', 'Thanh toán thành công');
  };

  // Test toast trực tiếp
  const testToastError = () => {
    showToast.error('Đây là thông báo lỗi từ toast utility', 'Lỗi Toast');
  };

  const testToastWarning = () => {
    showToast.warning('Cảnh báo: Dịch vụ sẽ bảo trì trong 30 phút tới', 'Bảo trì hệ thống');
  };

  const testToastInfo = () => {
    showToast.info('Thông tin: Phiên bản mới đã được cập nhật', 'Cập nhật hệ thống');
  };

  // Test inline error
  const testInlineError = () => {
    setInlineError('Đây là thông báo lỗi hiển thị trực tiếp trên trang');
  };

  return (
    <TestContainer>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1f2937' }}>
        🧪 Error Handling Test Page
      </h1>

      {/* Error Types Tests */}
      <TestSection>
        <SectionTitle>
          <AlertCircle size={20} />
          Test Error Types
        </SectionTitle>
        <TestButton variant="error" onClick={testPaymentError}>
          Payment Error
        </TestButton>
        <TestButton variant="error" onClick={testNetworkError}>
          Network Error
        </TestButton>
        <TestButton variant="error" onClick={testValidationError}>
          Validation Error
        </TestButton>
        <TestButton variant="error" onClick={testAuthError}>
          Auth Error
        </TestButton>
        <TestButton variant="error" onClick={testServiceUnavailable}>
          Service Unavailable
        </TestButton>
        <TestButton variant="error" onClick={testGenericError}>
          Generic Error
        </TestButton>
      </TestSection>

      {/* Success Messages Tests */}
      <TestSection>
        <SectionTitle>
          <CheckCircle size={20} />
          Test Success Messages
        </SectionTitle>
        <TestButton variant="success" onClick={testSuccessMessage}>
          Order Success
        </TestButton>
        <TestButton variant="success" onClick={testPaymentSuccess}>
          Payment Success
        </TestButton>
      </TestSection>

      {/* Toast Utility Tests */}
      <TestSection>
        <SectionTitle>
          <Zap size={20} />
          Test Toast Utilities
        </SectionTitle>
        <TestButton variant="error" onClick={testToastError}>
          Toast Error
        </TestButton>
        <TestButton variant="warning" onClick={testToastWarning}>
          Toast Warning
        </TestButton>
        <TestButton variant="info" onClick={testToastInfo}>
          Toast Info
        </TestButton>
      </TestSection>

      {/* Inline Error Test */}
      <TestSection>
        <SectionTitle>
          <Bug size={20} />
          Test Inline Error
        </SectionTitle>
        <TestButton onClick={testInlineError}>
          Show Inline Error
        </TestButton>
        <TestButton onClick={() => setInlineError('')}>
          Clear Inline Error
        </TestButton>
        
        {inlineError && (
          <ErrorMessage 
            message={inlineError} 
            onClose={() => setInlineError('')}
            show={!!inlineError}
          />
        )}
      </TestSection>

      {/* Toast Notifications */}
      <ToastNotification />
    </TestContainer>
  );
};

export default ErrorTestPage;
