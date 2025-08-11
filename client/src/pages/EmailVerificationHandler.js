import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

import { auth } from '../config/firebase';
import { applyActionCode } from 'firebase/auth';

const VerifyContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const VerifyCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  background: ${props => props.success ? '#dcfce7' : props.error ? '#fecaca' : '#e0e7ff'};
  color: ${props => props.success ? '#16a34a' : props.error ? '#dc2626' : '#3b82f6'};
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    
    // Debug: Log tất cả parameters
    console.log('URL Search Params:', Object.fromEntries(searchParams.entries()));
    console.log('oobCode:', oobCode);

    if (!oobCode) {
      setStatus('error');
      setMessage('Link xác thực không hợp lệ. Vui lòng kiểm tra email và thử lại.');
      return;
    }

    const verify = async () => {
      try {
        console.log('Applying action code:', oobCode);
        await applyActionCode(auth, oobCode);
        console.log('Email verification successful');
        setStatus('success');
        setMessage('Email của bạn đã được xác thực thành công! Bây giờ bạn có thể đăng nhập.');
      } catch (error) {
        console.error("Lỗi xác thực email:", error);
        setStatus('error');
        
        // Cải thiện error message
        let errorMessage = 'Link xác thực không hợp lệ hoặc đã hết hạn.';
        
        switch (error.code) {
          case 'auth/invalid-action-code':
            errorMessage = 'Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.';
            break;
          case 'auth/expired-action-code':
            errorMessage = 'Link xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ admin.';
            break;
          default:
            errorMessage = `Lỗi xác thực: ${error.message}`;
        }
        
        setMessage(errorMessage);
      }
    };

    verify();
  }, [searchParams]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <IconContainer>
              <Mail size={32} />
            </IconContainer>
            <Title>Đang xác thực email...</Title>
            <Message>Vui lòng đợi trong giây lát</Message>
            <LoadingSpinner />
          </>
        );

      case 'success':
        return (
          <>
            <IconContainer success>
              <CheckCircle size={32} />
            </IconContainer>
            <Title>Xác thực thành công!</Title>
            <Message>{message}</Message>
            <ActionButton onClick={handleContinue}>
              Đi đến đăng nhập
              <ArrowRight size={16} />
            </ActionButton>
          </>
        );

      case 'error':
        return (
          <>
            <IconContainer error>
              <XCircle size={32} />
            </IconContainer>
            <Title>Xác thực thất bại</Title>
            <Message>{message}</Message>
            <ActionButton onClick={handleContinue}>
              Quay lại đăng ký
              <ArrowRight size={16} />
            </ActionButton>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <VerifyContainer>
      <VerifyCard>
        {renderContent()}
      </VerifyCard>
    </VerifyContainer>
  );
};

export default EmailVerificationHandler;
