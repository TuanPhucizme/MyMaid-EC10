import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import styled, { keyframes } from 'styled-components'; // ✅ Thêm keyframes
import ErrorMessage from '../components/ErrorMessage';
import EmailVerificationStatus from '../components/EmailVerificationStatus';
import { doc, getDoc } from 'firebase/firestore'; // Import getDoc
import { db } from '../config/firebase'; // Import db

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const LoginContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #fdfdfdff 0%, #f8f8f8ff 100%);
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 450px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.6s ease-out 0.1s both;
`;

const LoginTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
`;

const LoginSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
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

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
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
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const FormErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
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
    &::before { left: 100%; }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginFooter = styled.div`
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
  transition: color 0.2s ease;
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
    &::after { width: 100%; }
  }
`;

const schema = yup.object({
  email: yup.string().email('Vui lòng nhập email hợp lệ').required('Email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc')
});

const LoginPage = () => {
  // --- LOGIC GIỮ NGUYÊN ---
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
       // Hàm login chỉ xác thực, trả về user object của Firebase Auth
      const result = await login(data.email, data.password);
      
      if (result.success && result.user) {
        // LẤY HỒ SƠ TỪ FIRESTORE ĐỂ KIỂM TRA VAI TRÒ
        const userDocRef = doc(db, "mm_users", result.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userProfile = userDocSnap.data();
          if (userProfile.role === 'partner') {
            navigate('/dashboard-partner', { replace: true }); // Chuyển partner đến dashboard
          } 
          else if (userProfile.role === 'admin') {
            navigate('/admin', { replace: true }); // Chuyển admin đến trang admin
          }
          else {
            navigate('/', { replace: true }); // Chuyển customer về trang chủ
          }
        } else {
          // Xử lý trường hợp hiếm gặp
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Chào Mừng Trở Lại</LoginTitle>
          <LoginSubtitle>Đăng nhập vào tài khoản của bạn</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
            show={!!error}
          />
          
          {user && !user.emailVerified && (
            <EmailVerificationStatus user={user} />
          )}

          {/* ✅ 3. CẬP NHẬT LẠI CẤU TRÚC JSX CỦA INPUT */}
          <InputGroup>
            <InputWrapper>
              <InputIcon><Mail size={20} /></InputIcon>
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                $error={!!errors.email}
                {...register('email')}
              />
            </InputWrapper>
            {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputWrapper>
              <InputIcon><Lock size={20} /></InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu của bạn"
                $error={!!errors.password}
                {...register('password')}
              />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </SubmitButton>
        </Form>

        <LoginFooter>
          <FooterLink to="/forgot-password">Quên mật khẩu?</FooterLink>
          <div>
            Bạn chưa có tài khoản?{' '}
            <FooterLink to="/register">Đăng ký tại đây</FooterLink>
          </div>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;