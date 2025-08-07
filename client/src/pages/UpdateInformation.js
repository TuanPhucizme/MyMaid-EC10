import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled, { keyframes } from 'styled-components';
import { Phone, MapPin, User, ArrowRight, CheckCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

import { auth, db } from '../config/firebase';
import { doc, updateDoc } from "firebase/firestore";

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

const UpdateContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const UpdateCard = styled.div`
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

const UpdateHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.6s ease-out 0.1s both;
`;

const UpdateTitle = styled.h1`
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

const UpdateSubtitle = styled.p`
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
  border: 2px solid ${props => props.error ? '#ef4444' : '#e5e7eb'};
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

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.error ? '#ef4444' : '#e5e7eb'};
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  line-height: 1.5;
  appearance: none;
  cursor: pointer;

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
`;

const FormErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
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
  phone: yup
    .string()
    .matches(/^(84|0[3578])\d{8}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  address: yup
    .string()
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .required('Địa chỉ là bắt buộc'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Vui lòng chọn giới tính')
    .required('Giới tính là bắt buộc'),
});

const UpdateInformationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        // Nếu không có ai đăng nhập, không cho phép ở lại trang này
        navigate('/login');
      } else if (!user.emailVerified) {
        // Nếu email chưa xác thực, cũng không cho phép
        alert("Vui lòng xác thực email của bạn trước.");
        navigate('/login');
      }
      // Nếu đã đăng nhập và xác thực, dừng loading
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
      }

      // Tạo tham chiếu đến document của user
      const userDocRef = doc(db, "mm_users", user.uid);

      // Cập nhật hồ sơ với thông tin mới
      await updateDoc(userDocRef, {
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        status: 'active', // Cập nhật trạng thái thành "hoạt động"
        updatedAt: new Date(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/'); // Chuyển đến trang chủ
      }, 2000);

    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <UpdateContainer>
        <UpdateCard>
          <div style={{ textAlign: 'center' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p style={{ color: '#6b7280' }}>Đang tải dữ liệu...</p>
          </div>
        </UpdateCard>
      </UpdateContainer>
    );  
  }

  if (success) {
    return (
      <UpdateContainer>
        <UpdateCard>
          <SuccessMessage>
            <CheckCircle size={24} />
            Cập nhật hồ sơ thành công! Chào mừng bạn đến với MyMaid.
          </SuccessMessage>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Bạn sẽ được chuyển hướng đến trang chủ sau 2 giây...
            </p>
          </div>
        </UpdateCard>
      </UpdateContainer>
    );
  }

  return (
    <UpdateContainer>
      <UpdateCard>
        <UpdateHeader>
          <UpdateTitle>Hoàn Tất Hồ Sơ</UpdateTitle>
          <UpdateSubtitle>Vui lòng cung cấp thêm một vài thông tin cá nhân</UpdateSubtitle>
        </UpdateHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
            show={!!error}
          />
          
          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <User size={18} />
              </InputIcon>
              <Select 
                error={!!errors.gender}
                {...register('gender')}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Select>
            </InputWrapper>
            {errors.gender && <FormErrorMessage>{errors.gender.message}</FormErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <Phone size={18} />
              </InputIcon>
              <Input 
                type="tel"
                placeholder="Số điện thoại (VD: 0901234567)"
                error={!!errors.phone}
                {...register('phone')}
              />
            </InputWrapper>
            {errors.phone && <FormErrorMessage>{errors.phone.message}</FormErrorMessage>}
          </InputGroup>
        
          <InputGroup>
            <InputWrapper>
              <InputIcon>
                <MapPin size={18} />
              </InputIcon>
              <Input 
                type="text"
                placeholder="Địa chỉ của bạn"
                error={!!errors.address}
                {...register('address')}
              />
            </InputWrapper>
            {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                Hoàn Tất Đăng Ký
                <ArrowRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>
      </UpdateCard>
    </UpdateContainer>
  );
};

export default UpdateInformationPage;