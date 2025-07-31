import React from 'react';
import styled from 'styled-components';
import { Check, X } from 'lucide-react';

const RequirementsContainer = styled.div`
  margin-top: 8px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const RequirementsTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-bottom: 4px;
  color: ${props => props.met ? '#059669' : '#6b7280'};
`;

const RequirementIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.met ? '#059669' : '#9ca3af'};
`;

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      id: 'length',
      text: 'Ít nhất 8 ký tự',
      test: (pwd) => pwd.length >= 8
    },
    {
      id: 'uppercase',
      text: 'Có chữ hoa (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      id: 'lowercase',
      text: 'Có chữ thường (a-z)',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      id: 'number',
      text: 'Có số (0-9)',
      test: (pwd) => /\d/.test(pwd)
    },
    {
      id: 'special',
      text: 'Có ký tự đặc biệt (!@#$%^&*)',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    }
  ];

  const metRequirements = requirements.map(req => ({
    ...req,
    met: req.test(password)
  }));

  const allMet = metRequirements.every(req => req.met);

  if (!password) {
    return (
      <RequirementsContainer>
        <RequirementsTitle>Yêu cầu mật khẩu:</RequirementsTitle>
        {requirements.map(req => (
          <RequirementItem key={req.id} met={false}>
            <RequirementIcon met={false}>
              <X size={12} />
            </RequirementIcon>
            {req.text}
          </RequirementItem>
        ))}
      </RequirementsContainer>
    );
  }

  return (
    <RequirementsContainer>
      <RequirementsTitle>
        Yêu cầu mật khẩu {allMet && '✓'}
      </RequirementsTitle>
      {metRequirements.map(req => (
        <RequirementItem key={req.id} met={req.met}>
          <RequirementIcon met={req.met}>
            {req.met ? <Check size={12} /> : <X size={12} />}
          </RequirementIcon>
          {req.text}
        </RequirementItem>
      ))}
    </RequirementsContainer>
  );
};

export default PasswordRequirements; 