import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import styled from 'styled-components';

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
  firstName: yup.string().min(2).max(50).required("First name is required"),
  lastName: yup.string().min(2).max(50).required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().matches(/^\d{10}$/, "Số điện thoại phải gồm 10 chữ số").required("Số điện thoại là bắt buộc"),
  address: yup.string().min(5).max(100).required("Địa chỉ là bắt buộc"),
  cccd: yup.string().matches(/^\d{12}$/, "CCCD phải gồm đúng 12 chữ số").required("Số CCCD là bắt buộc"),
  avatar: yup.mixed().test("required", "Ảnh đại diện là bắt buộc", value => value && value.length > 0),
});

const RegisterPartnerPage = () => {
  const {user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // ✅ TẠO FORM DATA ĐỂ GỬI FILE
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("cccd", data.cccd);
      formData.append("avatar", data.avatar[0]); // lấy file đầu tiên

      const result = await registerUser(formData); // ← NOTE: cần xử lý FormData ở hàm registerUser
      if (result.success) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Đăng Kí Đối Tác</RegisterTitle>
          <RegisterSubtitle>Tham gia Cùng MyMaid</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputRow>
            <InputGroup>
              <InputIcon><User size={20} /></InputIcon>
              <Input placeholder="First name" error={errors.firstName} {...register('firstName')} />
              {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputIcon><User size={20} /></InputIcon>
              <Input placeholder="Last name" error={errors.lastName} {...register('lastName')} />
              {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <InputIcon><Mail size={20} /></InputIcon>
            <Input type="email" placeholder="Email" error={errors.email} {...register('email')} />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputIcon><Mail size={20} /></InputIcon>
            <Input placeholder="Số Điện Thoại" error={errors.phone} {...register('phone')} />
            {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputIcon><Lock size={20} /></InputIcon>
            <Input placeholder='Địa chỉ Thường Trú' error={errors.address} {...register('address')} />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </InputGroup>

          {/* CCCD */}
          <InputGroup>
            <InputIcon><User size={20} /></InputIcon>
            <Input placeholder="Số CCCD" error={errors.cccd} {...register("cccd")} />
            {errors.cccd && <ErrorMessage>{errors.cccd.message}</ErrorMessage>}
          </InputGroup>

          {/* Ảnh đại diện */}
          <InputGroup>
            <InputIcon><User size={20} /></InputIcon>
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              style={{ paddingLeft: "2.5rem" }}
            />
            {errors.avatar && <ErrorMessage>{errors.avatar.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </SubmitButton>
          </InputGroup>

        </Form>

      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPartnerPage;
