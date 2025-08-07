import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

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

const slideDown = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
`;

const RequirementsContainer = styled.div`
  margin-top: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeInUp} 0.4s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const RequirementsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const RequirementsTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RequirementsIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.allMet ? '#10b981' : '#6b7280'};
  transition: all 0.3s ease;
`;

const ChevronIcon = styled.div`
  color: #9ca3af;
  transition: transform 0.3s ease;
  transform: rotate(${props => props.isOpen ? '180deg' : '0deg'});
`;

const RequirementsList = styled.div`
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${props => props.isOpen ? slideDown : 'none'} 0.3s ease-out;
`;

const RequirementsContent = styled.div`
  padding: 0 16px 16px;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 8px;
  color: ${props => props.met ? '#059669' : '#6b7280'};
  transition: all 0.3s ease;
  padding: 6px 8px;
  border-radius: 6px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RequirementIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.met ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)'};
  color: ${props => props.met ? '#10b981' : '#9ca3af'};
  transition: all 0.3s ease;
  flex-shrink: 0;
`;

const RequirementText = styled.span`
  font-weight: 500;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${props => props.progress}%;
`;

const PasswordRequirements = ({ password }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
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
  const progress = (metRequirements.filter(req => req.met).length / requirements.length) * 100;

  if (!password) {
    return (
      <RequirementsContainer>
        <RequirementsHeader onClick={() => setIsOpen(!isOpen)}>
          <RequirementsTitle>
            <RequirementsIcon allMet={false}>
              <X size={16} />
            </RequirementsIcon>
            Yêu cầu mật khẩu
          </RequirementsTitle>
          <ChevronIcon isOpen={isOpen}>
            <ChevronDown size={16} />
          </ChevronIcon>
        </RequirementsHeader>
        <RequirementsList isOpen={isOpen}>
          <RequirementsContent>
            {requirements.map(req => (
              <RequirementItem key={req.id} met={false}>
                <RequirementIcon met={false}>
                  <X size={12} />
                </RequirementIcon>
                <RequirementText>{req.text}</RequirementText>
              </RequirementItem>
            ))}
            <ProgressBar>
              <ProgressFill progress={0} />
            </ProgressBar>
          </RequirementsContent>
        </RequirementsList>
      </RequirementsContainer>
    );
  }

  return (
    <RequirementsContainer>
      <RequirementsHeader onClick={() => setIsOpen(!isOpen)}>
        <RequirementsTitle>
          <RequirementsIcon allMet={allMet}>
            {allMet ? <Check size={16} /> : <X size={16} />}
          </RequirementsIcon>
          Yêu cầu mật khẩu {allMet && '✓'}
        </RequirementsTitle>
        <ChevronIcon isOpen={isOpen}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </RequirementsHeader>
      <RequirementsList isOpen={isOpen}>
        <RequirementsContent>
          {metRequirements.map(req => (
            <RequirementItem key={req.id} met={req.met}>
              <RequirementIcon met={req.met}>
                {req.met ? <Check size={12} /> : <X size={12} />}
              </RequirementIcon>
              <RequirementText>{req.text}</RequirementText>
            </RequirementItem>
          ))}
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
        </RequirementsContent>
      </RequirementsList>
    </RequirementsContainer>
  );
};

export default PasswordRequirements; 