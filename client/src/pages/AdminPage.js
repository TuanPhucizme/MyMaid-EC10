import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DollarSign, ListChecks, UserCheck, User, Users, Home } from 'lucide-react';

// Import Components
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Import Firebase
import { auth } from '../config/firebase';

// --- Styled Components ---
const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem; // Khoảng cách giữa các card
`;

const AdminHeader = styled.div`
  margin-bottom: 0; // Giảm margin vì đã có gap
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #1a202c;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
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
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
  }
  th {
    background-color: #f9fafb;
    font-weight: 600;
    color: #4b5563;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  background: ${props => props.bgColor};
  color: ${props => props.color};
`;

const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

// --- Hàm tiện ích ---
const getPartnerStatusProps = (status) => { /* ... */ };
const getBookingStatusProps = (status) => { /* ... */ };

const AdminPage = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  // States
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, bookingsThisMonth: 0, pendingPartners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Vui lòng đăng nhập.");
      
      const token = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      const [partnersResponse, statsResponse, bookingsResponse] = await Promise.all([
        fetch(`${API_URL}/api/partners`, { headers }),
        fetch(`${API_URL}/api/partners/stats`, { headers }),
        fetch(`${API_URL}/api/bookings`, { headers })
      ]);

      if (!partnersResponse.ok) throw new Error('Không thể tải danh sách đối tác.');
      if (!statsResponse.ok) throw new Error('Không thể tải dữ liệu thống kê.');
      if (!bookingsResponse.ok) throw new Error('Không thể tải lịch sử dịch vụ.');

      const partnersData = await partnersResponse.json();
      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();

      setPartners(partnersData);
      setStats(statsData);
      setBookings(bookingsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchAdminData();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, fetchAdminData]);

  if (isLoading) return <LoadingSpinner fullScreen text="Đang tải trang quản trị..." />;
  if (error) return <AdminContainer><ErrorMessage message={error} /></AdminContainer>;

  return (
    <AdminContainer>
      <AdminHeader><Title>Trang Quản Trị</Title></AdminHeader>

      {/* --- PHẦN 1: THỐNG KÊ --- */}
      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a"><DollarSign size={32} /></StatIcon>
          <StatContent>
            <StatValue>{stats.revenueThisMonth.toLocaleString()}đ</StatValue>
            <StatLabel>Doanh thu tháng này</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#e0e7ff" color="#3b82f6"><ListChecks size={32} /></StatIcon>
          <StatContent>
            <StatValue>{stats.bookingsThisMonth}</StatValue>
            <StatLabel>Số đơn tháng này</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706"><UserCheck size={32} /></StatIcon>
          <StatContent>
            <StatValue>{stats.pendingPartners}</StatValue>
            <StatLabel>Đối tác chờ duyệt</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* --- PHẦN 2: BẢNG DANH SÁCH ĐỐI TÁC --- */}
      <TableCard>
        <CardHeader><CardTitle>Danh Sách Đối Tác ({partners.length})</CardTitle></CardHeader>
        <Table>
          <thead>
            <tr>
              <th><Users size={16} /> Tên Đối Tác</th>
              <th>Trạng Thái</th>
              <th>Ngày Đăng Ký</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(partner => {
              const status = getPartnerStatusProps(partner.status);
              return (
                <tr key={partner.uid}>
                  <td>{partner.name}</td>
                  <td>
                    <StatusBadge bgColor={status.bgColor} color={status.color}>{status.text}</StatusBadge>
                  </td>
                  <td>{new Date(partner.registeredAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableCard>

      {/* --- PHẦN 3: BẢNG LỊCH SỬ GIAO DỊCH --- */}
      <TableCard>
        <CardHeader><CardTitle>Lịch Sử Giao Dịch ({bookings.length})</CardTitle></CardHeader>
        <Table>
          <thead>
            <tr>
              <th><Home size={16} /> Dịch Vụ</th>
              <th><User size={16} /> Khách Hàng</th>
              <th>Đối Tác</th>
              <th>Ngày Đặt</th>
              <th>Giá</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => {
              const status = getBookingStatusProps(booking.status);
              return (
                <tr key={booking.id}>
                  <td>{booking.service.name}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.partnerName}</td>
                  <td>{booking.createdAt.toDate().toLocaleDateString('vi-VN')}</td>
                  <td>{booking.summary.totalPrice.toLocaleString()}đ</td>
                  <td>
                    <StatusBadge bgColor={status.bgColor} color={status.color}>{status.text}</StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableCard>
    </AdminContainer>
  );
};

export default AdminPage;