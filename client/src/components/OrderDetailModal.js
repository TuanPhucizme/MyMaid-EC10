import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  PlayCircle,
  XCircle,
  CreditCard,
  FileText,
  MessageSquare,
  UserCheck
} from 'lucide-react';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a202c;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => {
    switch (props.status) {
      case 'pending_payment':
        return 'background: #fef3c7; color: #92400e;';
      case 'pending_confirmation':
        return 'background: #fef3c7; color: #92400e;';
      case 'confirmed':
        return 'background: #dbeafe; color: #1d4ed8;';
      case 'in_progress':
        return 'background: #d1fae5; color: #065f46;';
      case 'completed':
        return 'background: #d1fae5; color: #065f46;';
      case 'cancelled':
        return 'background: #fee2e2; color: #dc2626;';
      default:
        return 'background: #f3f4f6; color: #6b7280;';
    }
  }}
`;

const TimelineContainer = styled.div`
  position: relative;
`;

const TimelineItem = styled.div`
  display: flex;
  padding: 1rem 0;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 1rem;
    top: 3rem;
    width: 2px;
    height: calc(100% - 2rem);
    background: #e5e7eb;
    margin-top: -1rem;
  }
`;

const TimelineIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  background: ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  z-index: 1;
  position: relative;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const TimelineTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const TimelineNote = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #3b82f6;
        color: white;
        border: 1px solid #3b82f6;
        &:hover { background: #2563eb; }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: #dc2626;
        color: white;
        border: 1px solid #dc2626;
        &:hover { background: #b91c1c; }
      `;
    } else {
      return `
        background: white;
        color: #6b7280;
        border: 1px solid #d1d5db;
        &:hover { background: #f9fafb; color: #374151; }
      `;
    }
  }}
`;

const OrderDetailModal = ({ order, isOpen, onClose, onCancel, onConfirmCompletion, isProcessing = false }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusIcon = (status) => {
    const icons = {
      'pending_payment': Clock,
      'pending_confirmation': Clock,
      'confirmed': CheckCircle,
      'in_progress': PlayCircle,
      'completed': Package,
      'cancelled': XCircle
    };
    const Icon = icons[status] || AlertCircle;
    return <Icon size={16} />;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending_payment': 'Chờ thanh toán',
      'pending_confirmation': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'in_progress': 'Đang thực hiện',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const canCancelOrder = () => {
    return order.status === 'pending_confirmation' || order.status === 'confirmed';
  };
  const canConfirmCompletion = () => {
    return order.status === 'pending_completion_approval';
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn');
      return;
    }
    if (onCancel) {
      await onCancel(order.id, cancelReason);
      setShowCancelForm(false);
      setCancelReason('');
    }
  };

  const handleConfirmCompletion = async () => {
    if (onConfirmCompletion) {
      await onConfirmCompletion(order.id);
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {order.service?.icon} Chi tiết đơn hàng #{order.id.slice(-8)}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Trạng thái hiện tại */}
          <Section>
            <SectionTitle>
              <AlertCircle size={16} />
              Trạng thái đơn hàng
            </SectionTitle>
            <StatusBadge status={order.status}>
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </StatusBadge>
          </Section>

          {/* Thông tin dịch vụ */}
          <Section>
            <SectionTitle>
              <Package size={16} />
              Thông tin dịch vụ
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <Package size={12} />
                  Dịch vụ
                </InfoLabel>
                <InfoValue>{order.service?.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <Calendar size={12} />
                  Ngày & Giờ
                </InfoLabel>
                <InfoValue>{order.schedule?.date} - {order.schedule?.time}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <Clock size={12} />
                  Thời gian thực hiện
                </InfoLabel>
                <InfoValue>{order.schedule?.duration} giờ</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <DollarSign size={12} />
                  Tổng tiền
                </InfoLabel>
                <InfoValue>{formatCurrency(order.payment?.amount)}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Thông tin khách hàng */}
          <Section>
            <SectionTitle>
              <User size={16} />
              Thông tin liên hệ
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <User size={12} />
                  Họ tên
                </InfoLabel>
                <InfoValue>{order.contact?.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <Phone size={12} />
                  Số điện thoại
                </InfoLabel>
                <InfoValue>{order.contact?.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <MapPin size={12} />
                  Địa chỉ
                </InfoLabel>
                <InfoValue>{order.contact?.address}</InfoValue>
              </InfoItem>
              {order.contact?.notes && (
                <InfoItem>
                  <InfoLabel>
                    <MessageSquare size={12} />
                    Ghi chú
                  </InfoLabel>
                  <InfoValue>{order.contact.notes}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          {/* ✅ BƯỚC 2: THÊM KHU VỰC HIỂN THỊ THÔNG TIN ĐỐI TÁC */}
          {/* Chỉ hiển thị khi đơn hàng đã có đối tác */}
          {order.partnerId && (
            <Section>
              <SectionTitle>
                <UserCheck size={16} />
                Thông tin Đối tác
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>
                    <User size={12} />
                    Người thực hiện
                  </InfoLabel>
                  <InfoValue>{order.partnerName || 'Đang cập nhật...'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>
                    <User size={12} />
                    Số điện thoại
                  </InfoLabel>
                    <InfoValue>{order.partnerPhone|| 'Đang cập nhật...'}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>
          )}

          {/* Thông tin thanh toán */}
          {order.payment && (
            <Section>
              <SectionTitle>
                <CreditCard size={16} />
                Thông tin thanh toán
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>
                    <CreditCard size={12} />
                    Phương thức
                  </InfoLabel>
                  <InfoValue>VNPay</InfoValue>
                </InfoItem>
                {order.payment.vnpayTransactionId && (
                  <InfoItem>
                    <InfoLabel>
                      <FileText size={12} />
                      Mã giao dịch
                    </InfoLabel>
                    <InfoValue>{order.payment.vnpayTransactionId}</InfoValue>
                  </InfoItem>
                )}
                {order.payment.vnpayBankCode && (
                  <InfoItem>
                    <InfoLabel>
                      <CreditCard size={12} />
                      Ngân hàng
                    </InfoLabel>
                    <InfoValue>{order.payment.vnpayBankCode}</InfoValue>
                  </InfoItem>
                )}
                {order.payment.paidAt && (
                  <InfoItem>
                    <InfoLabel>
                      <Clock size={12} />
                      Thời gian thanh toán
                    </InfoLabel>
                    <InfoValue>{formatDate(order.payment.paidAt)}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>
          )}

          {/* Lịch sử trạng thái */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <Section>
              <SectionTitle>
                <Clock size={16} />
                Lịch sử trạng thái
              </SectionTitle>
              <TimelineContainer>
                {order.statusHistory.map((history, index) => (
                  <TimelineItem key={`${history.status}-${history.timestamp || index}`}>
                    <TimelineIcon active={index === order.statusHistory.length - 1}>
                      {getStatusIcon(history.status)}
                    </TimelineIcon>
                    <TimelineContent>
                      <TimelineTitle>{getStatusText(history.status)}</TimelineTitle>
                      <TimelineTime>{formatDate(history.timestamp)}</TimelineTime>
                      {history.note && (
                        <TimelineNote>{history.note}</TimelineNote>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </Section>
          )}

          {/* Form hủy đơn */}
          {showCancelForm && (
            <Section>
              <SectionTitle>
                <XCircle size={16} />
                Lý do hủy đơn
              </SectionTitle>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn hàng..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </Section>
          )}

          {/* Nút hành động */}
          <ActionButtons>
            {/* Nút Hủy Đơn */}
            {!showCancelForm && canCancelOrder() && (
              <ActionButton 
                variant="danger"
                onClick={() => setShowCancelForm(true)}
                disabled={isProcessing}
              >
                <XCircle size={16} /> Hủy đơn hàng
              </ActionButton>
            )}

            {showCancelForm && (
              <>
                <ActionButton onClick={() => setShowCancelForm(false)}>
                  Quay lại
                </ActionButton>
                <ActionButton 
                  variant="danger"
                  onClick={handleCancelOrder}
                >
                  <XCircle size={16} />
                  Xác nhận hủy
                </ActionButton>
              </>
            )}

            {/* Nút Xác Nhận Hoàn Thành */}
            {canConfirmCompletion() && (
              <ActionButton 
                variant="primary"
                onClick={handleConfirmCompletion}
                disabled={isProcessing}
              >
                <CheckCircle size={16} /> {isProcessing ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
              </ActionButton>
            )}
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

OrderDetailModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    service: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string
    }),
    schedule: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      duration: PropTypes.number
    }),
    contact: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      notes: PropTypes.string
    }),
    partnerId: PropTypes.string,
    partnerName: PropTypes.string,
    partnerPhone: PropTypes.string,
    payment: PropTypes.shape({
      amount: PropTypes.number,
      vnpayTransactionId: PropTypes.string,
      vnpayBankCode: PropTypes.string,
      paidAt: PropTypes.string
    }),
    statusHistory: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.string,
      timestamp: PropTypes.string,
      note: PropTypes.string
    }))
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirmCompletion: PropTypes.func,
  isProcessing: PropTypes.bool
};

OrderDetailModal.defaultProps = {
  order: null,
  onCancel: null,
  onUpdate: null,
  onConfirmCompletion: null,
  isProcessing: false
};

export default OrderDetailModal;
