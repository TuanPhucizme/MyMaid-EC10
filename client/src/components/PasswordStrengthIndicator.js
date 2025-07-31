import React from 'react';
import styled from 'styled-components';
import { Shield, ShieldCheck, ShieldClose, ShieldAlert } from 'lucide-react';

const StrengthContainer = styled.div`
  margin-top: 8px;
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const StrengthProgress = styled.div`
  height: 100%;
  background-color: ${props => {
    switch (props.strength) {
      case 'weak': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'strong': return '#10b981';
      case 'very-strong': return '#059669';
      default: return '#e5e7eb';
    }
  }};
  transition: width 0.3s ease, background-color 0.3s ease;
  width: ${props => {
    switch (props.strength) {
      case 'weak': return '25%';
      case 'medium': return '50%';
      case 'strong': return '75%';
      case 'very-strong': return '100%';
      default: return '0%';
    }
  }};
`;

const StrengthText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => {
    switch (props.strength) {
      case 'weak': return '#dc2626';
      case 'medium': return '#d97706';
      case 'strong': return '#059669';
      case 'very-strong': return '#047857';
      default: return '#6b7280';
    }
  }};
`;

const StrengthIcon = styled.div`
  display: flex;
  align-items: center;
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
      icon = <ShieldClose size={14} />;
    } else if (score <= 4) {
      strength = 'medium';
      text = 'Trung bình';
      icon = <ShieldAlert size={14} />;
    } else if (score <= 6) {
      strength = 'strong';
      text = 'Mạnh';
      icon = <Shield size={14} />;
    } else {
      strength = 'very-strong';
      text = 'Rất mạnh';
      icon = <ShieldCheck size={14} />;
    }

    return { strength, score, text, icon, feedback };
  };

  const { strength, text, icon, feedback } = calculateStrength(password);

  if (!password) {
    return (
      <StrengthContainer>
        <StrengthBar>
          <StrengthProgress strength="none" />
        </StrengthBar>
        <StrengthText strength="none">
          <StrengthIcon>{icon}</StrengthIcon>
          {text}
        </StrengthText>
      </StrengthContainer>
    );
  }

  return (
    <StrengthContainer>
      <StrengthBar>
        <StrengthProgress strength={strength} />
      </StrengthBar>
      <StrengthText strength={strength}>
        <StrengthIcon>{icon}</StrengthIcon>
        {text}
      </StrengthText>
      {feedback.length > 0 && strength !== 'very-strong' && (
        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
          {feedback.slice(0, 2).join(', ')}
        </div>
      )}
    </StrengthContainer>
  );
};

export default PasswordStrengthIndicator; 