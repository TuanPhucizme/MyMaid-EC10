import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Home, CreditCard } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

//IMPORT CÁC HÀM TỪ FIREBASE
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RegisterContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const RegisterSubtitle = styled.p`
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: #6b7280;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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

const RegisterFooter = styled.div`
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
// ✅ THÊM CCCD & ẢNH ĐẠI DIỆN VÀO SCHEMA
const schema = yup.object({
  phone: yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại phải hợp lệ").required("Số điện thoại là bắt buộc"),
  address: yup.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự").max(100).required("Địa chỉ là bắt buộc"),
  cccd: yup.string().matches(/^\d{12}$/, "CCCD phải gồm đúng 12 chữ số").required("Số CCCD là bắt buộc"),
  avatar: yup.mixed().test("required", "Ảnh đại diện là bắt buộc", value => value && value.length > 0),
});

const RegisterPartnerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Lấy thông tin người dùng hiện tại từ AuthContext
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "mm_users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser({ ...user, ...userData });
          // Điền sẵn tất cả dữ liệu đã biết vào form
          reset({
            phone: userData.phone || '',
            address: userData.address || '',
          });
        } else {
          // Xử lý trường hợp hiếm gặp: user có trong Auth nhưng không có trong Firestore
          setError("Không tìm thấy hồ sơ người dùng.");
        }
      } else {
        // Nếu không có user, điều hướng ngay lập tức
        navigate('/login');
      }
      // Dù thành công hay thất bại, cũng kết thúc trạng thái loading xác thực
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, reset]);

const onSubmit = async (data) => {
    if (!currentUser) {
      setError("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const avatarFile = data.avatar[0];
      const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(avatarRef, avatarFile);
      const photoURL = await getDownloadURL(avatarRef);

      // BƯỚC C: CẬP NHẬT DOCUMENT TRONG FIRESTORE
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        role: 'partner', // Nâng cấp vai trò
        phone: data.phone,
        address: data.address,
        photoURL: photoURL, // Lưu URL ảnh mới
        partnerInfo: {
          cccd: data.cccd,
          status: 'pending_approval', // Trạng thái chờ duyệt
          rating: 0,
          jobsCompleted: 0,
        }
      });

      alert('Đăng ký đối tác thành công! Hồ sơ của bạn đang chờ được duyệt.');
      navigate('/dashboard'); // Chuyển đến dashboard của partner

    } catch (err) {
      console.error("Lỗi khi đăng ký đối tác:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <LoadingSpinner text="Đang kiểm tra thông tin đăng nhập..." />;
  }

  // 2. Nếu đã xác thực xong mà không có user, không render gì cả (useEffect đã điều hướng)
  if (!currentUser) {
    return null; 
  }

 return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Đăng Ký Đối Tác</RegisterTitle>
          <RegisterSubtitle>Hoàn tất hồ sơ để bắt đầu nhận việc</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={error} onClose={() => setError('')} show={!!error} />

          {/* Hiển thị thông tin không thể sửa */}
          <InputGroup>
            <InputIcon><User size={20} /></InputIcon>
            <Input value={`${currentUser.lastname} ${currentUser.firstname}`} readOnly disabled />
          </InputGroup>
          <InputGroup>
            <InputIcon><Mail size={20} /></InputIcon>
            <Input value={currentUser.email || ''} readOnly disabled />
          </InputGroup>

          {/* Các trường cần điền */}
          <InputGroup>
            <InputIcon><Phone size={20} /></InputIcon>
            <Input placeholder="Số Điện Thoại" error={!!errors.phone} {...register('phone')} />
            {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputIcon><Home size={20} /></InputIcon>
            <Input placeholder='Địa chỉ Thường Trú' error={!!errors.address} {...register('address')} />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputIcon><CreditCard size={20} /></InputIcon>
            <Input placeholder="Số CCCD" error={!!errors.cccd} {...register("cccd")} />
            {errors.cccd && <ErrorMessage>{errors.cccd.message}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <label style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Ảnh chân dung</label>
            <Input
              type="file"
              accept="image/*"
              error={!!errors.avatar}
              {...register("avatar")}
            />
            {errors.avatar && <ErrorMessage>{errors.avatar.message}</ErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Đang gửi hồ sơ..." : "Hoàn Tất Đăng Ký"}
          </SubmitButton>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPartnerPage;