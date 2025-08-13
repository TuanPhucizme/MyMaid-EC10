import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import PasswordRequirements from '../components/PasswordRequirements';
import PasswordInfo from '../components/PasswordInfo';
import { testFirebaseConnection } from '../utils/firebaseTest';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const RegisterContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #fdfdfdff 0%, #f8f8f8ff 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 500px;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  z-index: 1;
  
  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.6s ease-out 0.1s both;
`;

const RegisterTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  
  @media (max-width: 640px) {
    font-size: 1.875rem;
  }
`;

const RegisterSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  transition: color 0.2s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e5e7eb'};
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 
      0 0 0 4px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(102, 126, 234, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }

  &:focus + ${InputIcon} {
    color: #667eea;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const FormErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
`;

// Fixed height container for password components to prevent layout shift
const PasswordComponentsContainer = styled.div`
  min-height: ${props => props.$hasPassword ? '180px' : '60px'};
  transition: min-height 0.3s ease;
  overflow: visible;
  margin-top: 0.75rem;
`;

const PasswordComponentWrapper = styled.div`
  animation: ${fadeIn} 0.3s ease;
  
  &:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const RegisterFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  animation: ${slideIn} 0.6s ease-out 0.2s both;
`;

const FooterLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #764ba2;
    
    &::after {
      width: 100%;
    }
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const schema = yup.object({
  lastName: yup
    .string()
    .min(2, 'Họ và tên đệm phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên đệm không được vượt quá 50 ký tự')
    .required('Họ và tên đệm là bắt buộc'),
  firstName: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được vượt quá 50 ký tự')
    .required('Tên là bắt buộc'),
  email: yup
    .string()
    .email('Vui lòng nhập email hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu')
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Test Firebase connection first
      console.log('Testing Firebase connection...');
      const testResult = await testFirebaseConnection();
      console.log('Firebase test result:', testResult);
      
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });

      if (result.success) {
        setSuccess(true);
        // Hiển thị thông báo chi tiết hơn
        console.log('Registration successful, email verification sent');
        // Không tự động chuyển hướng, để user đọc thông báo
      } else {
        console.error('Registration failed:', result);
        setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <SuccessMessage>
            <CheckCircle size={24} />
            Đăng ký thành công! 🎉
          </SuccessMessage>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#059669', fontWeight: '600', marginBottom: '0.5rem' }}>
              ✅ Email xác thực đã được gửi!
            </p>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Vui lòng kiểm tra hộp thư email của bạn và nhấp vào liên kết xác thực để hoàn tất đăng ký.
            </p>
            <div style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#374151'
            }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Lưu ý:</strong></p>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1rem' }}>
                <li>Kiểm tra cả thư mục Spam/Junk nếu không thấy email</li>
                <li>Email có thể mất vài phút để đến</li>
                <li>Sau khi xác thực, bạn có thể đăng nhập bình thường</li>
              </ul>
            </div>
            <Link to="/login" style={{ 
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Đi đến trang đăng nhập
            </Link>
          </div>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Tạo Tài Khoản</RegisterTitle>
          <RegisterSubtitle>Bắt đầu với thông tin cơ bản</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
            show={!!error}
          />
          
          <InputRow>
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input 
                  type="text" 
                  placeholder="Họ Và Tên Đệm" 
                  $error={!!errors.lastName} 
                  {...register('lastName')} 
                />
              </InputWrapper>
              {errors.lastName && <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>}
            </InputGroup>
            
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input 
                  type="text" 
                  placeholder="Tên" 
                  $error={!!errors.firstName} 
                  {...register('firstName')} 
                />
              </InputWrapper>
              {errors.firstName && <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <Input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn" 
                $error={!!errors.email} 
                {...register('email')} 
              />
            </InputWrapper>
            {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tạo mật khẩu"
                $error={!!errors.password}
                {...register('password')}
              />
              <PasswordToggle 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          
              <PasswordComponentsContainer $hasPassword={!!watchedPassword}>
              {!watchedPassword && (
                <PasswordComponentWrapper>
                  <PasswordInfo />
                </PasswordComponentWrapper>
              )}
              {watchedPassword && (
                <>
                  <PasswordComponentWrapper>
                    <PasswordStrengthIndicator password={watchedPassword} />
                  </PasswordComponentWrapper>
                  <PasswordComponentWrapper>
                    <PasswordRequirements password={watchedPassword} />
                  </PasswordComponentWrapper>
                </>
              )}
            </PasswordComponentsContainer>
          </InputGroup>
          
          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận lại mật khẩu"
                $error={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <PasswordToggle 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                Tiếp Tục
                <ArrowRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>

        <RegisterFooter>
          Đã có tài khoản?{' '}
          <FooterLink to="/login">Đăng nhập tại đây</FooterLink>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;