import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, User, Phone, FileText, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// ✅ 1. IMPORT DỮ LIỆU MẪU
import { mockBookingDetails } from '../mockData';

// --- Styled Components ---
const DetailPageContainer = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderInfo = styled.div``;

const ServiceTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1a202c;
`;

const BookingId = styled.p`
  color: #6b7280;
  font-family: monospace;
`;

const StatusBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: capitalize;
  background: ${props => props.bgColor};
  color: ${props => props.color};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  &:last-child { margin-bottom: 0; }
`;

const InfoIcon = styled.div`
  color: #3b82f6;
  margin-top: 2px;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.p`
  font-weight: 500;
  color: #1a202c;
`;

const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.primary ? '#10b981' : '#f3f4f6'};
  color: ${props => props.primary ? 'white' : '#374151'};

  &:hover {
    opacity: 0.9;
  }
`;

// Hàm tiện ích
const getStatusProps = (status) => {
  switch (status) {
    case 'completed': return { text: 'Hoàn thành', bgColor: '#dcfce7', color: '#166534' };
    case 'confirmed': return { text: 'Đã xác nhận', bgColor: '#dbeafe', color: '#1e40af' };
    case 'cancelled': return { text: 'Đã hủy', bgColor: '#fecaca', color: '#b91c1c' };
    default: return { text: 'Chờ xác nhận', bgColor: '#fef3c7', color: '#92400e' };
  }
};

const generateMapsLink = (address) => {
  const query = encodeURIComponent(`${address.street}, ${address.district}, ${address.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const BookingDetailPage = () => {
  const { bookingId } = useParams(); // Lấy ID từ URL, ví dụ: /booking-details/job-abc-123
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API/Firestore dựa trên bookingId
    console.log("Fetching details for booking ID:", bookingId);
    
    // Giả lập độ trễ mạng
    const timer = setTimeout(() => {
      setBooking(mockBookingDetails);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [bookingId]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải chi tiết đơn hàng..." />;
  }

  if (!booking) {
    return <DetailPageContainer><h1>Không tìm thấy đơn hàng</h1></DetailPageContainer>;
  }

  const statusProps = getStatusProps(booking.status);

  return (
    <DetailPageContainer>
      <DetailHeader>
        <HeaderInfo>
          <ServiceTitle>{booking.service.name}</ServiceTitle>
          <BookingId>Mã đơn hàng: {booking.id}</BookingId>
        </HeaderInfo>
        <StatusBadge bgColor={statusProps.bgColor} color={statusProps.color}>
          {statusProps.text}
        </StatusBadge>
      </DetailHeader>

      <DetailGrid>
        <MainContent>
          <Card>
            <CardHeader><CardTitle>Thông tin lịch hẹn</CardTitle></CardHeader>
            <CardContent>
              <InfoRow>
                <InfoIcon><Calendar size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Ngày làm việc</InfoLabel>
                  <InfoValue>{new Date(booking.schedule.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon><Clock size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Thời gian & Thời lượng</InfoLabel>
                  <InfoValue>{booking.schedule.time} (Ước tính {booking.schedule.area.duration} giờ)</InfoValue>
                </InfoContent>
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thông tin khách hàng</CardTitle></CardHeader>
            <CardContent>
              <InfoRow>
                <InfoIcon><User size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Tên khách hàng</InfoLabel>
                  <InfoValue>{booking.contact.name}</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon><MapPin size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Địa chỉ</InfoLabel>
                  <InfoValue>
                    {`${booking.address.street}, ${booking.address.district}, ${booking.address.city}`}
                    <a href={generateMapsLink(booking.address)} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginLeft: '8px', textDecoration: 'underline'}}>Xem bản đồ</a>
                  </InfoValue>
                </InfoContent>
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ghi chú đặc biệt</CardTitle></CardHeader>
            <CardContent>
              <InfoRow>
                <InfoIcon><FileText size={20} /></InfoIcon>
                <InfoContent>
                  <InfoValue>{booking.notes || 'Không có ghi chú nào.'}</InfoValue>
                </InfoContent>
              </InfoRow>
            </CardContent>
          </Card>
        </MainContent>

        <Sidebar>
          <Card>
            <CardHeader><CardTitle>Chi tiết thanh toán</CardTitle></CardHeader>
            <CardContent>
              <InfoRow>
                <InfoIcon><DollarSign size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Khách hàng trả</InfoLabel>
                  <InfoValue>{booking.summary.totalPrice.toLocaleString()}đ</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon style={{color: '#16a34a'}}><DollarSign size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Thu nhập của bạn (Ước tính)</InfoLabel>
                  <InfoValue style={{color: '#16a34a', fontWeight: 'bold'}}>{booking.summary.partnerEarning.toLocaleString()}đ</InfoValue>
                </InfoContent>
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thao tác</CardTitle></CardHeader>
            <CardContent style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <ActionButton primary>
                <CheckCircle size={16} /> Hoàn thành công việc
              </ActionButton>
              <ActionButton as="a" href={`tel:${booking.contact.phone}`}>
                <Phone size={16} /> Gọi cho khách hàng
              </ActionButton>
              <ActionButton>
                <AlertTriangle size={16} /> Báo cáo sự cố
              </ActionButton>
            </CardContent>
          </Card>
        </Sidebar>
      </DetailGrid>
    </DetailPageContainer>
  );
};

export default BookingDetailPage;