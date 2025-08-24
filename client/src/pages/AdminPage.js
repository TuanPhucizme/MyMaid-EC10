import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DollarSign, ListChecks, UserCheck, User, Users, Home, Settings } from 'lucide-react';

// Import Components
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Import API services
import { adminAPI } from '../services/api';

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

const TabContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  overflow-x: auto;
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #3b82f6;
    background-color: #f8fafc;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

// --- Hàm tiện ích ---
const getPartnerStatusProps = (status) => {
  switch (status) {
    case 'active':
      return { bgColor: '#dcfce7', color: '#16a34a', text: 'Hoạt động' };
    case 'suspended':
      return { bgColor: '#fef2f2', color: '#dc2626', text: 'Tạm ngưng' };
    case 'pending':
      return { bgColor: '#fef3c7', color: '#d97706', text: 'Chờ duyệt' };
    default:
      return { bgColor: '#f3f4f6', color: '#6b7280', text: 'Không rõ' };
  }
};

const getBookingStatusProps = (status) => {
  switch (status) {
    case 'completed':
      return { bgColor: '#dcfce7', color: '#16a34a', text: 'Hoàn thành' };
    case 'confirmed':
      return { bgColor: '#e0e7ff', color: '#3b82f6', text: 'Đã xác nhận' };
    case 'in_progress':
      return { bgColor: '#fef3c7', color: '#d97706', text: 'Đang thực hiện' };
    case 'pending_confirmation':
      return { bgColor: '#f0f9ff', color: '#0369a1', text: 'Chờ xác nhận' };
    case 'pending_payment':
      return { bgColor: '#fdf4ff', color: '#a855f7', text: 'Chờ thanh toán' };
    case 'cancelled':
      return { bgColor: '#fef2f2', color: '#dc2626', text: 'Đã hủy' };
    default:
      return { bgColor: '#f3f4f6', color: '#6b7280', text: 'Không rõ' };
  }
};

const AdminPage = () => {
  const navigate = useNavigate();

  // States
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    revenueThisMonth: 0,
    bookingsThisMonth: 0,
    pendingPartners: 0,
    totalUsers: 0,
    totalOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, orders, partners

  // --- Data Fetching ---
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all data using adminAPI
      const [partnersResponse, usersResponse, ordersResponse] = await Promise.all([
        adminAPI.getAllPartners({ limit: 50 }),
        adminAPI.getAllUsers({ limit: 50 }),
        adminAPI.getAllOrders({ limit: 50 })
      ]);

      setPartners(partnersResponse.data || []);
      setUsers(usersResponse.data.users || []);
      setOrders(ordersResponse.data.orders || []);

      // Calculate stats from the data
      const totalUsers = usersResponse.data.pagination?.total || usersResponse.data.users?.length || 0;
      const totalOrders = ordersResponse.data.pagination?.total || ordersResponse.data.orders?.length || 0;
      const pendingPartners = partnersResponse.data?.filter(p => p.operational?.status === 'pending')?.length || 0;

      // Calculate revenue from completed orders
      const completedOrders = ordersResponse.data.orders?.filter(order => order.status === 'completed') || [];
      const revenueThisMonth = completedOrders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          return sum + (order.payment?.amount || 0);
        }
        return sum;
      }, 0);

      const bookingsThisMonth = ordersResponse.data.orders?.filter(order => {
        const orderDate = new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })?.length || 0;

      setStats({
        revenueThisMonth,
        bookingsThisMonth,
        pendingPartners,
        totalUsers,
        totalOrders
      });

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data when component mounts
    fetchAdminData();
  }, [fetchAdminData]);

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
        <StatCard>
          <StatIcon bgColor="#f3e8ff" color="#8b5cf6"><Users size={32} /></StatIcon>
          <StatContent>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Tổng người dùng</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#fef2f2" color="#ef4444"><Settings size={32} /></StatIcon>
          <StatContent>
            <StatValue>{stats.totalOrders}</StatValue>
            <StatLabel>Tổng đơn hàng</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* --- PHẦN 2: TABS NAVIGATION --- */}
      <TabContainer>
        <TabList>
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Tổng quan
          </TabButton>
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            👥 Người dùng ({users.length})
          </TabButton>
          <TabButton
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          >
            📋 Đơn hàng ({orders.length})
          </TabButton>
          <TabButton
            active={activeTab === 'partners'}
            onClick={() => setActiveTab('partners')}
          >
            🤝 Đối tác ({partners.length})
          </TabButton>
        </TabList>
      </TabContainer>

      {/* --- PHẦN 3: TAB CONTENT --- */}

      {/* Overview Tab */}
      <TabContent active={activeTab === 'overview'}>
        <TableCard>
          <CardHeader><CardTitle>Hoạt động gần đây</CardTitle></CardHeader>
          <div style={{ padding: '1.5rem' }}>
            <p>Trang tổng quan sẽ hiển thị các hoạt động gần đây, biểu đồ thống kê, và thông tin tổng quan về hệ thống.</p>
          </div>
        </TableCard>
      </TabContent>

      {/* Users Tab */}
      <TabContent active={activeTab === 'users'}>
        <TableCard>
          <CardHeader><CardTitle>Danh Sách Người Dùng ({users.length})</CardTitle></CardHeader>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th><User size={16} /> Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                    <td>{user.email}</td>
                    <td>
                      <StatusBadge
                        bgColor={user.role === 'admin' ? '#fef3c7' : user.role === 'partner' ? '#e0e7ff' : '#f0f9ff'}
                        color={user.role === 'admin' ? '#d97706' : user.role === 'partner' ? '#3b82f6' : '#0369a1'}
                      >
                        {user.role === 'admin' ? 'Quản trị' : user.role === 'partner' ? 'Đối tác' : 'Khách hàng'}
                      </StatusBadge>
                    </td>
                    <td>
                      <StatusBadge
                        bgColor={user.status === 'active' ? '#dcfce7' : '#fef2f2'}
                        color={user.status === 'active' ? '#16a34a' : '#dc2626'}
                      >
                        {user.status === 'active' ? 'Hoạt động' : 'Chờ xác thực'}
                      </StatusBadge>
                    </td>
                    <td>
                      {user.createdAt ?
                        new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </TableCard>
      </TabContent>

      {/* Orders Tab */}
      <TabContent active={activeTab === 'orders'}>
        <TableCard>
          <CardHeader><CardTitle>Danh Sách Đơn Hàng ({orders.length})</CardTitle></CardHeader>
          <TableContainer>
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
                {orders.map(order => {
                  const status = getBookingStatusProps(order.status);
                  return (
                    <tr key={order.id}>
                      <td>{order.service?.name || 'N/A'}</td>
                      <td>{order.customerInfo?.name || order.contact?.name || 'N/A'}</td>
                      <td>{order.partnerInfo?.name || 'Chưa gán'}</td>
                      <td>
                        {order.createdAt ?
                          new Date(order.createdAt.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'
                        }
                      </td>
                      <td>{order.payment?.amount ? order.payment.amount.toLocaleString() + 'đ' : 'N/A'}</td>
                      <td>
                        <StatusBadge bgColor={status.bgColor} color={status.color}>{status.text}</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        </TableCard>
      </TabContent>

      {/* Partners Tab */}
      <TabContent active={activeTab === 'partners'}>
        <TableCard>
          <CardHeader><CardTitle>Danh Sách Đối Tác ({partners.length})</CardTitle></CardHeader>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th><Users size={16} /> Tên Đối Tác</th>
                  <th>Email</th>
                  <th>Trạng Thái</th>
                  <th>Đánh giá</th>
                  <th>Công việc hoàn thành</th>
                  <th>Ngày Đăng Ký</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(partner => {
                  const status = getPartnerStatusProps(partner.operational?.status || 'pending');
                  return (
                    <tr key={partner.userId}>
                      <td>{partner.name || 'N/A'}</td>
                      <td>{partner.email || 'N/A'}</td>
                      <td>
                        <StatusBadge bgColor={status.bgColor} color={status.color}>{status.text}</StatusBadge>
                      </td>
                      <td>
                        {partner.operational?.rating?.average ?
                          `${partner.operational.rating.average.toFixed(1)} (${partner.operational.rating.count})`
                          : 'Chưa có'
                        }
                      </td>
                      <td>{partner.operational?.jobsCompleted || 0}</td>
                      <td>
                        {partner.registeredAt ?
                          new Date(partner.registeredAt.seconds ? partner.registeredAt.seconds * 1000 : partner.registeredAt).toLocaleDateString('vi-VN')
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        </TableCard>
      </TabContent>
    </AdminContainer>
  );
};

export default AdminPage;