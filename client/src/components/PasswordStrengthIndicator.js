import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Shield, ShieldCheck, ShieldClose, ShieldAlert } from 'lucide-react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
`;

const StrengthContainer = styled.div`
  margin-top: 12px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0.1) 0%, 
      rgba(255,255,255,0.3) 50%, 
      rgba(255,255,255,0.1) 100%);
    animation: shimmer 2s infinite;
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const StrengthProgress = styled.div`
  height: 100%;
  background: ${props => {
    switch (props.$strength) {
      case 'weak': return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
      case 'medium': return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
      case 'strong': return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
      case 'very-strong': return 'linear-gradient(90deg, #059669 0%, #047857 100%)';
      default: return 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)';
    }
  }};
  border-radius: 3px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${props => {
    switch (props.$strength) {
      case 'weak': return '25%';
      case 'medium': return '50%';
      case 'strong': return '75%';
      case 'very-strong': return '100%';
      default: return '0%';
    }
  }};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 1px;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
  }
`;

const StrengthText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => {
    switch (props.$strength) {
      case 'weak': return '#dc2626';
      case 'medium': return '#d97706';
      case 'strong': return '#059669';
      case 'very-strong': return '#047857';
      default: return '#6b7280';
    }
  }};
  transition: color 0.3s ease;
`;

const StrengthIcon = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$strength) {
      case 'weak': return 'rgba(239, 68, 68, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'strong': return 'rgba(16, 185, 129, 0.1)';
      case 'very-strong': return 'rgba(5, 150, 105, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  transition: all 0.3s ease;
`;

const StrengthLabel = styled.span`
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 11px;
`;

const FeedbackText = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 6px;
  font-weight: 500;
  line-height: 1.4;
`;

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { strength: 'none', score: 0, text: 'Nhập mật khẩu' };
    
    let score = 0;
    const feedback = [];

    // Độ dài
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Ít nhất 8 ký tự');
    }

    // Chữ hoa
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Có chữ hoa');
    }

    // Chữ thường
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Có chữ thường');
    }

    // Số
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Có số');
    }

    // Ký tự đặc biệt
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Có ký tự đặc biệt');
    }

    // Độ dài tốt
    if (password.length >= 12) {
      score += 1;
    }

    // Độ phức tạp
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
      score += 1;
    }

    let strength, text, icon;
    
    if (score <= 2) {
      strength = 'weak';
      text = 'Yếu';
      icon = <ShieldClose size={16} />;
    } else if (score <= 4) {
      strength = 'medium';
      text = 'Trung bình';
      icon = <ShieldAlert size={16} />;
    } else if (score <= 6) {
      strength = 'strong';
      text = 'Mạnh';
      icon = <Shield size={16} />;
    } else {
      strength = 'very-strong';
      text = 'Rất mạnh';
      icon = <ShieldCheck size={16} />;
    }

    return { strength, score, text, icon, feedback };
  };

  const { strength, text, icon, feedback } = calculateStrength(password);

  if (!password) {
    return (
      <StrengthContainer>
        <StrengthBar>
          <StrengthProgress $strength="none" />
        </StrengthBar>
        <StrengthText $strength="none">
          <StrengthIcon $strength="none">{icon}</StrengthIcon>
          <StrengthLabel>Nhập mật khẩu</StrengthLabel>
        </StrengthText>
      </StrengthContainer>
    );
  }

  return (
    <StrengthContainer>
      <StrengthBar>
        <StrengthProgress $strength={strength} />
      </StrengthBar>
      <StrengthText $strength={strength}>
        <StrengthIcon $strength={strength}>{icon}</StrengthIcon>
        <StrengthLabel>{text}</StrengthLabel>
      </StrengthText>
      {feedback.length > 0 && strength !== 'very-strong' && (
        <FeedbackText>
          Cần cải thiện: {feedback.slice(0, 2).join(', ')}
        </FeedbackText>
      )}
    </StrengthContainer>
  );
};

export default PasswordStrengthIndicator; 