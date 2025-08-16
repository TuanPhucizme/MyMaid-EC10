import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, User, Phone, FileText, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

import { auth } from '../config/firebase';

// // ✅ 1. IMPORT DỮ LIỆU MẪU
// import { mockBookingDetails } from '../mockData';

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
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [error, setError] = useState(null);

useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Mã đơn hàng không hợp lệ.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const user = auth.currentUser;
        if (!user) {
          // Nếu chưa đăng nhập, không thể lấy token
          navigate('/login');
          return;
        }
        
        const token = await user.getIdToken();
        const response = await fetch(`${API_URL}/api/orders/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || `Lỗi ${response.status}`);
        }

        const data = await response.json();
        setBooking(data);

      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Chờ auth sẵn sàng rồi mới fetch
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchBookingDetails();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [bookingId, navigate, API_URL]);

  // ... (các hàm handlers và logic render giữ nguyên)

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải chi tiết đơn hàng..." />;
  }

  if (error) {
    return <DetailPageContainer><h1>{error}</h1></DetailPageContainer>;
  }

  if (!booking) {
    return null;
  }
  const handleRequestCompletion = async () => {
    setIsProcessing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/orders/${booking.id}/request-completion`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gửi yêu cầu thất bại.');
      
      toast.success('Yêu cầu đã được gửi!');
      setIsConfirmModalOpen(false);
      // Tải lại dữ liệu trang
      // fetchBookingDetails(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportIssue = () => {
    alert(`(Chức năng đang phát triển) Báo cáo sự cố cho đơn hàng: ${booking.id}`);
    // Logic gửi báo cáo sẽ ở đây
  };

  const statusProps = getStatusProps(booking.status);
  // Ước tính thu nhập của đối tác (ví dụ: 80%)
  const partnerEarning = (booking.payment?.amount || 0) * 0.8;

  return (
    <DetailPageContainer>
      <DetailHeader>
        <HeaderInfo>
          <ServiceTitle>{booking.service?.name || 'Dịch vụ không xác định'}</ServiceTitle>
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
                  <InfoValue>{new Date(booking.schedule?.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon><Clock size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Thời gian & Thời lượng</InfoLabel>
                  <InfoValue>{booking.schedule?.time} (Ước tính {booking.schedule?.duration} giờ)</InfoValue>
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
                  <InfoValue>{booking.contact?.name}</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon><MapPin size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Địa chỉ</InfoLabel>
                  <InfoValue>
                    {booking.contact?.address}
                    <a href={generateMapsLink(booking.contact?.address)} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginLeft: '8px', textDecoration: 'underline'}}>Xem bản đồ</a>
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
                  <InfoValue>{booking.contact?.notes || 'Không có ghi chú nào.'}</InfoValue>
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
                  <InfoValue>{(booking.payment?.amount || 0).toLocaleString()}đ</InfoValue>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon style={{color: '#16a34a'}}><DollarSign size={20} /></InfoIcon>
                <InfoContent>
                  <InfoLabel>Thu nhập của bạn (Ước tính)</InfoLabel>
                  <InfoValue style={{color: '#16a34a', fontWeight: 'bold'}}>{partnerEarning.toLocaleString()}đ</InfoValue>
                </InfoContent>
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thao tác</CardTitle></CardHeader>
            <CardContent style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <ActionButton primary onClick={() => setIsConfirmModalOpen(true)}>
                <CheckCircle size={16} /> Hoàn thành công việc
              </ActionButton>
              <ActionButton as="a" href={`tel:${booking.contact?.phone}`}>
                <Phone size={16} /> Gọi cho khách hàng
              </ActionButton>
              <ActionButton onClick={handleReportIssue}>
                <AlertTriangle size={16} /> Báo cáo sự cố
              </ActionButton>
            </CardContent>
          </Card>
        </Sidebar>
      </DetailGrid>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleRequestCompletion}
        title="Xác nhận hoàn thành?"
        message="Một yêu cầu sẽ được gửi đến khách hàng để xác nhận rằng công việc đã hoàn tất. Bạn có chắc chắn không?"
        confirmText="Gửi yêu cầu"
        isProcessing={isProcessing}
      />

    </DetailPageContainer>
  );
};

export default BookingDetailPage;