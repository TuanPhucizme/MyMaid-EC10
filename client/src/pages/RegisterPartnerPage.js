import React, { useState, useEffect, Link } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Image as ImageIcon, ArrowRight, CheckCircle, UploadCloud } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Cần axios để gửi form data
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

//IMPORT CÁC HÀM TỪ FIREBASE
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


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

const FileUploadWrapper = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  
  &:hover {
    border-color: #667eea;
  }
`;

const PortraitPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 1rem;
  border: 3px solid #667eea;
`;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png'];

// Schema validation
const schema = yup.object({
  nationalId: yup
    .string()
    .matches(/^[0-9]{9,12}$/, 'Số CCCD/CMND không hợp lệ (9 hoặc 12 số)')
    .required('Số CCCD/CMND là bắt buộc'),
portrait: yup
    .mixed()
    // Test 1: Kiểm tra xem file có tồn tại không (thay thế cho .required())
    .test(
      'required',
      'Vui lòng chọn ảnh chân dung',
      (value) => value && value.length > 0
    )
    // Test 2: Kiểm tra kích thước file
    .test(
      'fileSize',
      'Kích thước file quá lớn, tối đa 5MB',
      (value) => {
        // Nếu không có file, không cần kiểm tra kích thước (test 'required' sẽ xử lý)
        // Điều này ngăn lỗi sai "quá kích thước"
        if (!value || value.length === 0) return true;
        
        // Nếu có file, thực hiện kiểm tra kích thước
        return value[0].size <= MAX_FILE_SIZE;
      }
    )
    // Test 3: Kiểm tra loại file
    .test(
      'fileType',
      'Chỉ hỗ trợ định dạng ảnh .jpg, .jpeg, .png',
      (value) => {
        // Tương tự, nếu không có file thì không cần kiểm tra
        if (!value || value.length === 0) return true;
        
        // Nếu có file, thực hiện kiểm tra định dạng
        return SUPPORTED_IMAGE_FORMATS.includes(value[0].type);
      }
    ),
});

const RegisterPartnerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [portraitPreview, setPortraitPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    mode : "onChange",
  });

  const watchedPortrait = watch('portrait');

// 4. Sử dụng `useEffect` để xử lý side effect (cập nhật preview)
  useEffect(() => {
    // Nếu có file được chọn (watchedPortrait là một FileList)
    if (watchedPortrait && watchedPortrait.length > 0) {
      const file = watchedPortrait[0];
      const newPreviewUrl = URL.createObjectURL(file);
      setPortraitPreview(newPreviewUrl);

      // Quan trọng: Dọn dẹp URL cũ để tránh rò rỉ bộ nhớ
      return () => URL.revokeObjectURL(newPreviewUrl);
    }
    // Nếu không có file nào được chọn, xóa preview
    else {
      setPortraitPreview(null);
    }
  }, [watchedPortrait]); // Chạy lại effect này mỗi khi `watchedPortrait` thay đổi
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('nationalId', data.nationalId);
    formData.append('portrait', data.portrait[0]);

    try {
      const token = await user.getIdToken();
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/partners/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success(res.data.message);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000); // Chuyển về trang dashboard sau 3s

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
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                        Chào mừng bạn đã trở thành đối tác của chúng tôi.
                        Bạn sẽ được chuyển hướng đến trang quản lý sau 3 giây...
                    </p>
                </div>
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
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
            show={!!error}
          />
          
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
            
          <InputGroup>
            <FileUploadWrapper onClick={() => document.getElementById('portrait-upload').click()}>
              <input 
                id="portrait-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                {...register('portrait')}
              />
              <UploadCloud size={32} color="#667eea" />
              <p>Nhấp để tải lên ảnh chân dung</p>
              {portraitPreview && <PortraitPreview src={portraitPreview} alt="Xem trước ảnh chân dung" />}
            </FileUploadWrapper>
            {errors.portrait && <FormErrorMessage>{errors.portrait.message}</FormErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Hoàn tất Đăng ký'}
            {!isLoading && <ArrowRight size={20} />}
          </SubmitButton>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPartnerPage;