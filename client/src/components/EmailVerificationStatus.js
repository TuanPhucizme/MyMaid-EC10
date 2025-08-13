import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  background: ${props => props.$status === 'verified' ? '#f0fdf4' : '#fef3c7'};
  border: 1px solid ${props => props.$status === 'verified' ? '#bbf7d0' : '#fde68a'};
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1rem 0;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StatusTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$status === 'verified' ? '#166534' : '#92400e'};
  margin: 0;
`;

const StatusMessage = styled.p`
  color: ${props => props.$status === 'verified' ? '#166534' : '#92400e'};
  font-size: 0.875rem;
  margin: 0.5rem 0;
`;

const ResendButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmailVerificationStatus = ({ user }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendEmail = async () => {
    if (!user) return;
    
    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/update-information`,
        handleCodeInApp: true,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      setResendSuccess(true);
      console.log('Email verification resent to:', user.email);
    } catch (error) {
      console.error('Error resending email verification:', error);
      setResendError('Không thể gửi lại email. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  if (!user) return null;

  if (user.emailVerified) {
    return (
      <StatusContainer $status="verified">
        <StatusHeader>
          <CheckCircle size={20} color="#166534" />
          <StatusTitle $status="verified">Email đã được xác thực</StatusTitle>
        </StatusHeader>
        <StatusMessage $status="verified">
          Tài khoản của bạn đã được xác thực thành công. Bạn có thể sử dụng đầy đủ các tính năng của hệ thống.
        </StatusMessage>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer $status="pending">
      <StatusHeader>
        <AlertCircle size={20} color="#92400e" />
        <StatusTitle $status="pending">Email chưa được xác thực</StatusTitle>
      </StatusHeader>
      <StatusMessage $status="pending">
        Vui lòng kiểm tra email <strong>{user.email}</strong> và nhấp vào liên kết xác thực để hoàn tất đăng ký.
      </StatusMessage>
      
      {resendSuccess && (
        <div style={{ 
          background: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: '0.5rem', 
          padding: '0.5rem', 
          marginTop: '0.5rem',
          color: '#166534',
          fontSize: '0.875rem'
        }}>
          ✅ Email xác thực đã được gửi lại thành công!
        </div>
      )}
      
      {resendError && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.5rem', 
          padding: '0.5rem', 
          marginTop: '0.5rem',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          ❌ {resendError}
        </div>
      )}
      
      <ResendButton 
        onClick={handleResendEmail} 
        disabled={isResending}
        style={{ marginTop: '0.75rem' }}
      >
        {isResending ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Mail size={16} />
            Gửi lại email xác thực
          </>
        )}
      </ResendButton>
    </StatusContainer>
  );
};

export default EmailVerificationStatus;
