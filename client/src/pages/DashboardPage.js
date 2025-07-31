import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { userAPI } from '../services/api';
import { Calendar, Clock, Star, Users, MapPin, Phone, Mail } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#e0e7ff'};
  color: ${props => props.color || '#3b82f6'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecentBookingsCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const BookingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const ServiceName = styled.div`
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const BookingMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookingStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    if (props.status === 'completed') return '#dcfce7';
    if (props.status === 'confirmed') return '#dbeafe';
    if (props.status === 'pending') return '#fef3c7';
    return '#fecaca';
  }};
  color: ${props => {
    if (props.status === 'completed') return '#166534';
    if (props.status === 'confirmed') return '#1e40af';
    if (props.status === 'pending') return '#92400e';
    return '#dc2626';
  }};
`;

const QuickActionsCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
  margin-bottom: 1rem;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: #e0e7ff;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ContactInfo = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #6b7280;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    userAPI.getDashboard,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải dashboard..." />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <div className="card">
          <p>Lỗi khi tải dữ liệu dashboard. Vui lòng thử lại.</p>
        </div>
      </DashboardContainer>
    );
  }

  const { user, stats, recentBookings } = dashboardData?.data || {};

  // Mock data cho MyMaid
  const mockStats = {
    totalBookings: 12,
    activeBookings: 3,
    totalSpent: 2500000,
    averageRating: 4.8
  };

  const mockRecentBookings = [
    {
      id: 1,
      serviceName: 'Dọn dẹp nhà cửa',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      maidName: 'Chị Nguyễn Thị Mai',
      price: 150000
    },
    {
      id: 2,
      serviceName: 'Chăm sóc trẻ em',
      date: '2024-01-12',
      time: '14:00',
      status: 'completed',
      maidName: 'Chị Trần Thị Hoa',
      price: 200000
    },
    {
      id: 3,
      serviceName: 'Nấu ăn',
      date: '2024-01-10',
      time: '18:00',
      status: 'completed',
      maidName: 'Chị Lê Thị Lan',
      price: 180000
    }
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeTitle>Chào mừng trở lại, {user?.firstName || 'Quý khách'}!</WelcomeTitle>
        <WelcomeSubtitle>Tổng quan hoạt động dịch vụ giúp việc của bạn</WelcomeSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Calendar size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{mockStats.totalBookings}</StatValue>
            <StatLabel>Tổng số đặt dịch vụ</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{mockStats.activeBookings}</StatValue>
            <StatLabel>Đang hoạt động</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a">
            <Star size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{mockStats.averageRating}</StatValue>
            <StatLabel>Đánh giá trung bình</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fce7f3" color="#ec4899">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{mockStats.totalSpent.toLocaleString()}đ</StatValue>
            <StatLabel>Tổng chi phí</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RecentBookingsCard>
          <CardHeader>
            <CardTitle>Đặt dịch vụ gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentBookings && mockRecentBookings.length > 0 ? (
              mockRecentBookings.map((booking) => (
                <BookingItem key={booking.id}>
                  <BookingInfo>
                    <ServiceName>{booking.serviceName}</ServiceName>
                    <BookingMeta>
                      <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{booking.time}</span>
                      <span>•</span>
                      <span>{booking.maidName}</span>
                    </BookingMeta>
                  </BookingInfo>
                  <div style={{ textAlign: 'right' }}>
                    <BookingStatus status={booking.status}>
                      {booking.status === 'completed' ? 'Hoàn thành' :
                       booking.status === 'confirmed' ? 'Đã xác nhận' :
                       booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                    </BookingStatus>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {booking.price.toLocaleString()}đ
                    </div>
                  </div>
                </BookingItem>
              ))
            ) : (
              <EmptyState>
                <p>Chưa có đặt dịch vụ nào.</p>
                <Link to="/booking" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Đặt dịch vụ ngay
                </Link>
              </EmptyState>
            )}
          </CardContent>
        </RecentBookingsCard>

        <div>
          <QuickActionsCard>
            <CardTitle style={{ marginBottom: '1.5rem' }}>Thao tác nhanh</CardTitle>
            
            <ActionButton to="/booking">
              <ActionIcon>
                <Calendar size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Đặt dịch vụ mới</ActionTitle>
                <ActionDescription>Đặt người giúp việc cho nhu cầu của bạn</ActionDescription>
              </ActionContent>
            </ActionButton>

            <ActionButton to="/consultation">
              <ActionIcon>
                <Phone size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Liên hệ tư vấn</ActionTitle>
                <ActionDescription>Nhận tư vấn miễn phí về dịch vụ</ActionDescription>
              </ActionContent>
            </ActionButton>

            <ActionButton to="/pricing">
              <ActionIcon>
                <Star size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Xem bảng giá</ActionTitle>
                <ActionDescription>Tham khảo giá dịch vụ chi tiết</ActionDescription>
              </ActionContent>
            </ActionButton>

            <ActionButton to="/profile">
              <ActionIcon>
                <Users size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Hồ sơ cá nhân</ActionTitle>
                <ActionDescription>Cập nhật thông tin tài khoản</ActionDescription>
              </ActionContent>
            </ActionButton>
          </QuickActionsCard>

          <ContactInfo>
            <CardTitle style={{ marginBottom: '1rem' }}>Thông tin liên hệ</CardTitle>
            
            <ContactItem>
              <Phone size={16} />
              <span>Hotline: 1900 1234</span>
            </ContactItem>
            
            <ContactItem>
              <Mail size={16} />
              <span>Email: support@mymaid.vn</span>
            </ContactItem>
            
            <ContactItem>
              <MapPin size={16} />
              <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
            </ContactItem>
          </ContactInfo>
        </div>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
