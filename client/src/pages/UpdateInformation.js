import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Phone, Home, User as GenderIcon } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
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


const FormErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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

const UpdateFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
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
  const [step1Data, setStep1Data] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // 1. LẤY DỮ LIỆU TỪ BƯỚC 1 KHI TẢI TRANG
  useEffect(() => {
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      setStep1Data(JSON.parse(storedData));
    } else {
      // Nếu không có dữ liệu, người dùng không thể ở trang này
      alert("Vui lòng hoàn tất bước đăng ký đầu tiên.");
      navigate('/register');
    }
  }, [navigate]);

  // 2. HÀM SUBMIT CUỐI CÙNG
  const onSubmit = async (dataStep2) => {
    setIsLoading(true);
    setError('');
    try {
      // 3. KẾT HỢP DỮ LIỆU TỪ 2 BƯỚC
      const finalUserData = { ...step1Data, ...dataStep2 };

      // 4. THỰC HIỆN LOGIC FIREBASE
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        finalUserData.email,
        finalUserData.password
      );
      const user = userCredential.user;

      // Tạo hồ sơ trong Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: `${finalUserData.firstName} ${finalUserData.lastName}`,
        email: finalUserData.email,
        phone: finalUserData.phone,
        address: finalUserData.address,
        gender: finalUserData.gender,
        role: 'customer',
        createdAt: new Date(),
      });

      // 5. DỌN DẸP VÀ HOÀN TẤT
      sessionStorage.removeItem('registrationData');
      alert('Tạo tài khoản thành công! Vui lòng đăng nhập để tiếp tục.');
      navigate('/login');

    } catch (err) {
      console.error("Lỗi khi tạo tài khoản:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã tồn tại. Vui lòng quay lại và sử dụng email khác.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị loading trong khi chờ useEffect kiểm tra
  if (!step1Data) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <UpdateContainer>
      <UpdateCard>
        <UpdateHeader>
          <UpdateTitle>Cập nhật thông tin</UpdateTitle>
          <UpdateSubtitle>cá nhân</UpdateSubtitle>
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