import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import {Phone} from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

import { auth, db } from '../config/firebase';
import { doc, updateDoc } from "firebase/firestore"; // Chỉ cần updateDoc

// --- Styled Components (có thể tái sử dụng từ RegisterPage) ---
const UpdateContainer = styled.div`
  min-height: calc(120vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #edf0f4ff;
`;

const UpdateCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const UpdateHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const UpdateTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const UpdateSubtitle = styled.p`
  color: #6b7280;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const schema = yup.object({
  phone: yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
  address: yup.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự').required('Địa chỉ là bắt buộc'),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Vui lòng chọn giới tính').required('Giới tính là bắt buộc'),
});

const UpdateInformationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
      }

      // A. TẠO THAM CHIẾU ĐẾN DOCUMENT CỦA USER
      const userDocRef = doc(db, "mm_users", user.uid);

      // B. CẬP NHẬT HỒ SƠ VỚI THÔNG TIN MỚI
      await updateDoc(userDocRef, {
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        status: 'active', // Cập nhật trạng thái thành "hoạt động"
      });

      // C. HOÀN TẤT
      alert('Cập nhật hồ sơ thành công! Chào mừng bạn đến với MyMaid.');
      navigate('/'); // Chuyển đến trang chủ

    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthLoading) {
  return (
      <div className="card">
        <p>Đang tải dữ liệu...</p>
      </div>
    );  
  }

  return (
    <UpdateContainer>
      <UpdateCard>
        <UpdateHeader>
          <UpdateTitle>Hoàn Tất Hồ Sơ</UpdateTitle>
          <UpdateSubtitle>Vui lòng cung cấp thêm một vài thông tin cá nhân</UpdateSubtitle>
        </UpdateHeader>
        <FormGroup>
        <Label>Giới tính</Label>
        <select {...register('gender')}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
        </select>
        {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
        </FormGroup>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={error} onClose={() => setError('')} show={!!error} />
        
            <FormGroup>
                <InputIcon><Phone size={20} /></InputIcon>
                <Label>Số điện thoại</Label>
                <Input {...register('phone')} />
                {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
            </FormGroup>
        
          <FormGroup>
            <Label>Địa chỉ</Label>
            <Input {...register('address')} />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Đang tạo tài khoản...' : 'Hoàn Tất Đăng Ký'}
          </SubmitButton>
        </Form>
      </UpdateCard>
    </UpdateContainer>
  );
};

export default UpdateInformationPage;