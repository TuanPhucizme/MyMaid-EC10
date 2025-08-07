import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 2px solid #f59e0b;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const BannerText = styled.div`
  color: #92400e;
  font-weight: 500;
`;

const BannerTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const BannerSubtitle = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #92400e;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(146, 64, 14, 0.1);
  }
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: #166534;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VerificationBanner = ({ user, onClose }) => {
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
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      setResendSuccess(true);
      console.log('Email verification resent to:', user.email);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error resending email verification:', error);
      setResendError('Không thể gửi lại email. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <BannerContainer>
      <BannerContent>
        <BannerLeft>
          <AlertCircle size={20} color="#92400e" />
          <BannerText>
            <BannerTitle>Email chưa được xác thực</BannerTitle>
            <BannerSubtitle>
              Vui lòng kiểm tra email <strong>{user.email}</strong> và nhấp vào liên kết xác thực
            </BannerSubtitle>
          </BannerText>
        </BannerLeft>
        
        <BannerActions>
          {resendSuccess && (
            <SuccessMessage>
              <CheckCircle size={16} />
              Email đã được gửi lại!
            </SuccessMessage>
          )}
          
          {resendError && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.5rem', 
              padding: '0.5rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              ❌ {resendError}
            </div>
          )}
          
          <ResendButton 
            onClick={handleResendEmail} 
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Mail size={16} />
                Gửi lại email
              </>
            )}
          </ResendButton>
          
          <CloseButton onClick={onClose}>
            ✕
          </CloseButton>
        </BannerActions>
      </BannerContent>
    </BannerContainer>
  );
};

export default VerificationBanner;
