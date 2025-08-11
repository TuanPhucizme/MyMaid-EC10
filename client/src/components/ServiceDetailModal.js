import React from 'react';
import styled from 'styled-components';
import { X, Tag, DollarSign, Clock } from 'lucide-react';

// --- Styled Components for the Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 1000px;
  position: relative;
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  text-transform: uppercase;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  &:hover { color: #1a202c; }
`;

const TiersTable = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem 1rem; /* Điều chỉnh padding ở đây */
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle; /* Căn giữa theo chiều dọc */
  }

  th { 
    font-weight: 500; 
    color: #6b7280; 
    background-color: #f9fafb;
  }`;

const ServiceDetailModal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        <ModalHeader>
          <ModalTitle>{service.name_service}</ModalTitle>
        </ModalHeader>
        
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>{service.description}</p>

        <h3 style={{ fontWeight: 600, marginTop: '1.5rem' }}>Các Bậc Giá</h3>
        <TiersTable>
        <thead>
            <tr>
            <th>
                {/* Đặt flexbox vào một div bên trong th */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Tag size={14} />
                <span>Nhãn</span>
                </div>
            </th>
            <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <DollarSign size={14} />
                <span>Giá</span>
                </div>
            </th>
            <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                <span>Thời gian</span>
                </div>
            </th>
            </tr>
        </thead>
        <tbody>
            {service.pricingTiers?.map((tier) => (
            <tr key={tier.id}>
                <td>{tier.label}</td>
                <td>{tier.price.toLocaleString()}đ</td>
                <td>{tier.duration} giờ</td>
            </tr>
            ))}
        </tbody>
        </TiersTable>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiceDetailModal;