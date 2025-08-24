import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import OrderDetailModal from '../components/OrderDetailModal';
import ReviewDetailModal from '../components/ReviewDetailModal';
import { getUserOrders, cancelOrder } from '../services/firebaseOrderService';
import { showUserError, showUserSuccess } from '../services/errorHandler';
import ToastNotification from '../components/ToastNotification';

import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PlayCircle, 
  Package,
  Calendar,
  MapPin,
  Phone,
  User,
  DollarSign,
  Eye,
  X,
  Star
} from 'lucide-react';

const Container = styled.div`
  min-height: calc(100vh - 4rem);
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const TabContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? '#3b82f6' : '#6b7280'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.$active ? 'white' : '#f3f4f6'};
    color: ${props => props.$active ? '#3b82f6' : '#4b5563'};
  }
`;

const TabContent = styled.div`
  padding: 1.5rem;
  min-height: 400px;
`;

const OrderList = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OrderMeta = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => {
    switch (props.status) {
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

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const DetailIcon = styled.div`
  color: #9ca3af;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  margin-bottom: 1rem;
  color: #d1d5db;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
`;



const OrderManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending_confirmation');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // State để quản lý modal xem review
  const [viewingReviewFor, setViewingReviewFor] = useState(null);

  const handleReviewClick = (order) => {
    if (order.hasBeenReviewed) {
      // Nếu đã có review, mở modal để xem
      setViewingReviewFor(order.id);
    } else {
      // Nếu chưa có, chuyển đến trang để viết review mới
      navigate(`/leave-review/${order.id}`);
    }
  };

  const tabs = React.useMemo(() => [
    {
      id: 'pending_confirmation',
      label: 'Chờ xác nhận',
      icon: Clock,
      color: '#f59e0b',
      statuses: 'pending_payment,pending_confirmation'
    },
    { 
      id: 'confirmed', 
      label: 'Đã xác nhận', 
      icon: CheckCircle,
      color: '#3b82f6',
      statuses: 'confirmed'
    },
    { 
      id: 'in_progress', 
      label: 'Đang thực hiện', 
      icon: PlayCircle,
      color: '#10b981',
      statuses: 'confirmed,in_progress,pending_completion_approval'
    },
    { 
      id: 'completed', 
      label: 'Hoàn thành', 
      icon: Package,
      color: '#059669',
      statuses: 'completed'
    },
    { 
      id: 'all', 
      label: 'Tất cả', 
      icon: Package,
      color: '#6b7280',
      statuses: 'all'
    }
  ], []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('📋 Fetching orders for user:', user.uid);

      // Lấy tất cả orders từ Firebase
      const result = await getUserOrders(user.uid);

      if (result.success) {
        let filteredOrders = result.orders;

        console.log(`📊 Total orders from Firebase: ${result.orders.length}`);
        console.log('📋 All orders:', result.orders.map(o => ({ id: o.id, status: o.status })));

        // Filter theo tab hiện tại
        const currentTab = tabs.find(tab => tab.id === activeTab);
        if (currentTab && currentTab.statuses && currentTab.statuses !== 'all') {
          const statusArray = currentTab.statuses.split(',');
          console.log(`🔍 Filtering by statuses: [${statusArray.join(', ')}]`);
          filteredOrders = result.orders.filter(order =>
            statusArray.includes(order.status)
          );
          console.log(`📊 Filtered orders: ${filteredOrders.length}`);
        }

        console.log(`✅ Loaded ${filteredOrders.length} orders for tab "${activeTab}"`);
        setOrders(filteredOrders);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      showUserError(error, 'Lỗi khi tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, tabs]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
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
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const canCancelOrder = (order) => {
    return order.status === 'pending_confirmation';
  };

  const handleCancelOrder = async (orderId, reason = 'Khách hàng yêu cầu hủy đơn') => {
    try {
      console.log('🚫 Cancelling order:', orderId, 'Reason:', reason);

      const result = await cancelOrder(orderId, reason);

      if (result.success) {
        showUserSuccess('Hủy đơn hàng thành công', 'Đơn hàng đã được hủy');
        fetchOrders(); // Refresh the list
        closeModal(); // Close modal after successful cancellation
      } else {
        throw result;
      }
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      showUserError(error, 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  const handleQuickCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy Dịch vụ này?')) {
      return;
    }
    await handleCancelOrder(orderId);
  };

  const handleConfirmCompletion = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn công việc đã được hoàn thành đúng yêu cầu?")) return;
    
    setIsProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/confirm-completion`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success('Xác nhận hoàn thành thành công!');
      setSelectedOrder(null); // Đóng modal
      await fetchOrders(); // Tải lại danh sách Dịch vụ
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (!user) {
    return (
      <Container>
        <Header>
          <Title>Quản lý Dịch vụ</Title>
          <Subtitle>Vui lòng đăng nhập để xem Dịch vụ của bạn</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Quản lý Dịch vụ</Title>
        <Subtitle>Theo dõi trạng thái và quản lý các Dịch vụ của bạn</Subtitle>
      </Header>

      <TabContainer>
        <TabButtons>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <TabButton
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </TabButton>
            );
          })}
        </TabButtons>

        <TabContent>
          {loading ? (
            <LoadingSpinner>
              <AlertCircle size={24} />
              <span style={{ marginLeft: '0.5rem' }}>Đang tải Dịch vụ...</span>
            </LoadingSpinner>
          ) : orders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Package size={48} />
              </EmptyIcon>
              <h3>Không có Dịch vụ nào</h3>
              <p>Bạn chưa có Dịch vụ nào ở trạng thái này</p>
            </EmptyState>
          ) : (
            <OrderList>
              {orders.map(order => (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderInfo>
                      <OrderTitle>
                        {order.service?.icon} {order.service?.name}
                        <StatusBadge status={order.status}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </StatusBadge>
                      </OrderTitle>
                      <OrderMeta>
                        Dịch vụ #{order.id.slice(-8)} • {formatDate(order.schedule?.date)}
                      </OrderMeta>
                    </OrderInfo>
                  </OrderHeader>

                  <OrderDetails>
                    <DetailItem>
                      <DetailIcon><Calendar size={16} /></DetailIcon>
                      {order.schedule?.date} - {order.schedule?.time}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon><MapPin size={16} /></DetailIcon>
                      {order.contact?.address}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon><User size={16} /></DetailIcon>
                      {order.partnerName || 'Đang tìm đối tác'}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon><Phone size={16} /></DetailIcon>
                      {order.partnerPhone || 'Chưa có SĐT'}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon><DollarSign size={16} /></DetailIcon>
                      {formatCurrency(order.payment?.amount)}
                    </DetailItem>
                  </OrderDetails>

                  <OrderActions>
                    <ActionButton onClick={() => openOrderDetail(order)}>
                      <Eye size={16} />
                      Xem chi tiết
                    </ActionButton>
                    
                    {canCancelOrder(order) && (
                      <ActionButton 
                        variant="danger"
                        onClick={() => handleQuickCancelOrder(order.id)}
                      >
                        <X size={16} />
                        Hủy đơn
                      </ActionButton>
                    )}

                    {/* --- NÚT ĐÁNH GIÁ MỚI --- */}
                    {order.status === 'completed' && (
                      <ActionButton 
                        variant="primary"
                        onClick={() => handleReviewClick(order)}
                      >
                        <Star size={16} />
                        {/* Hiển thị văn bản khác nhau dựa trên trạng thái review */}
                        {order.hasBeenReviewed ? 'Xem đánh giá' : 'Đánh giá'}
                      </ActionButton>
                    )}
                  </OrderActions>
                </OrderCard>
              ))}
            </OrderList>
          )}
        </TabContent>
      </TabContainer>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={closeModal}
        onConfirmCompletion={handleConfirmCompletion}
        onCancel={handleCancelOrder}
        isProcessing={isProcessing}
      />

      <ReviewDetailModal
        isOpen={!!viewingReviewFor}
        bookingId={viewingReviewFor}
        onClose={() => setViewingReviewFor(null)}
      />

      {/* Toast Notifications */}
      <ToastNotification />
    </Container>
  );
};

export default OrderManagementPage;
