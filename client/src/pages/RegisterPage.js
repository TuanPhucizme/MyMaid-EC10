import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import PasswordRequirements from '../components/PasswordRequirements';
import PasswordInfo from '../components/PasswordInfo';

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

const FormErrorMessage = styled.span`
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

const schema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(''); // Clear previous errors
    try {
      const { confirmPassword, ...userData } = data;
      
      // Kiểm tra độ mạnh mật khẩu trước khi đăng ký
      const password = data.password;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 8;
      
      if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        setError('Mật khẩu phải đáp ứng tất cả yêu cầu bảo mật');
        setIsLoading(false);
        return;
      }
      
      const result = await registerUser(userData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Create Account</RegisterTitle>
          <RegisterSubtitle>Join FactCheck to start verifying information</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage 
            message={error} 
            onClose={() => setError('')}
            show={!!error}
          />
          <InputRow>
            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <Input
                type="text"
                placeholder="First name"
                error={errors.firstName}
                {...register('firstName')}
              />
              {errors.firstName && (
                <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <Input
                type="text"
                placeholder="Last name"
                error={errors.lastName}
                {...register('lastName')}
              />
              {errors.lastName && (
                <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>
              )}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              placeholder="Enter your email"
              error={errors.email}
              {...register('email')}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              error={errors.password}
              {...register('password')}
              onChange={(e) => {
                setPasswordValue(e.target.value);
                register('password').onChange(e);
              }}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
            {!passwordValue && <PasswordInfo />}
            {passwordValue && <PasswordStrengthIndicator password={passwordValue} />}
            {passwordValue && <PasswordRequirements password={passwordValue} />}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
            {errors.confirmPassword && (
              <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>
            )}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner" style={{ width: '1rem', height: '1rem' }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </SubmitButton>
        </Form>

        <RegisterFooter>
          Already have an account?{' '}
          <FooterLink to="/login">Sign in here</FooterLink>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
