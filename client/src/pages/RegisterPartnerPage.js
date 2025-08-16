// Các import vẫn giữ nguyên, nhưng xóa: Image as ImageIcon, UploadCloud, PortraitPreview, MAX_FILE_SIZE, SUPPORTED_IMAGE_FORMATS
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, ArrowRight, CheckCircle } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage';

// Schema validation (chỉ còn CCCD/CMND)
const schema = yup.object({
  nationalId: yup
    .string()
    .matches(/^[0-9]{9,12}$/, 'Số CCCD/CMND không hợp lệ (9 hoặc 12 số)')
    .required('Số CCCD/CMND là bắt buộc'),
});

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ===== Các styled-components giữ nguyên phần cần thiết =====
const RegisterContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #fdfdfdff 0%, #f8f8f8ff 100%);
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
  animation: ${fadeIn} 0.6s ease-out;
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
  margin-bottom: 0.75rem;
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
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e5e7eb'};
  border-radius: 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
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
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
`;

// ===== Component chính =====
const RegisterPartnerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/partners/register`,
        { nationalId: data.nationalId }, // chỉ gửi CCCD
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(res.data.message);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
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
            Đăng ký thành công!
          </SuccessMessage>
          <p style={{ color: '#6b7280' }}>
            Chào mừng bạn đã trở thành đối tác của chúng tôi.
            Bạn sẽ được chuyển hướng đến trang quản lý sau 3 giây...
          </p>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Trở thành Đối tác</RegisterTitle>
          <RegisterSubtitle>Cung cấp thông tin để xác thực và bắt đầu</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={error} onClose={() => setError('')} show={!!error} />
          
          <InputGroup>
            <InputWrapper>
              <InputIcon><User size={18} /></InputIcon>
              <Input 
                type="text" 
                placeholder="Số CCCD/CMND" 
                $error={!!errors.nationalId} 
                {...register('nationalId')} 
              />
            </InputWrapper>
            {errors.nationalId && <FormErrorMessage>{errors.nationalId.message}</FormErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Hoàn tất Đăng ký'} {!isLoading && <ArrowRight size={20} />}
          </SubmitButton>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPartnerPage;
