import React, { useState, useEffect, useCallback } from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DollarSign, ListChecks, UserCheck, UserX, PlusCircle, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

//import PartnerDetailModal from '../components/PartnerDetailModal';
import ServiceEditModal from '../components/ServiceEditModal';
import ServiceDetailModal from '../components/ServiceDetailModal';

import PartnerApprovalModal from '../components/PartnerApprovalModal';

// // 1. IMPORT CÁC HÀM TỪ FIREBASE
import { auth, db } from '../config/firebase';
// import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

import { mockPartners, mockStats } from '../mockData'; // Đảm bảo đường dẫn đúng

// --- Styled Components ---
const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const AdminHeader = styled.div`
  margin-bottom: 2rem;
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
  margin-bottom: 2.5rem;
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
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
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

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ApproveButton = styled(ActionButton)`
  background-color: #dcfce7;
  color: #166534;
  border-color: #166534;
`;

const SuspendButton = styled(ActionButton)`
  background-color: #fee2e2;
  color: #b91c1c;
  border-color: #b91c1c;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background: #059669; }
`;

// Hàm tiện ích
const getStatusProps = (status) => {
  switch (status) {
    case 'active': return { text: 'Hoạt động', bgColor: '#dcfce7', color: '#166534' };
    case 'pending_approval': return { text: 'Chờ duyệt', bgColor: '#fef3c7', color: '#92400e' };
    case 'suspended': return { text: 'Đình chỉ', bgColor: '#fee2e2', color: '#b91c1c' };
    default: return { text: status, bgColor: '#e5e7eb', color: '#4b5563' };
  }
};

const displayPriceRange = (tiers) => {
  // Kiểm tra nếu pricingTiers không hợp lệ
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return 'Chưa có giá';
  }

  // Nếu chỉ có một bậc giá
  if (tiers.length === 1) {
    return `${(tiers[0].price || 0).toLocaleString()}đ`;
  }

  // Nếu có nhiều bậc giá, tìm min và max
  const prices = tiers.map(tier => tier.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
};

const API_URL = process.env.REACT_APP_API_URL;

const AdminPage = () => {
  const navigate = useNavigate();
  //const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, bookingsThisMonth: 0, pendingPartners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //const [selectedPartner, setSelectedPartner] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null = thêm mới, object = sửa
  const [isSaving, setIsSaving] = useState(false);

  const [services, setServices] = useState([]);
  const [viewingService, setViewingService] = useState(null);

  const [pendingPartners, setPendingPartners] = useState([]);
  const [viewingPartner, setViewingPartner] = useState(null); // State để mở modal duyệt
  const [isProcessing, setIsProcessing] = useState(false); // State cho nút trong modal

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Vui lòng đăng nhập.");
      
      const token = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      // Gọi các API song song
      const [statsResponse, servicesResponse, pendingPartnersResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/partners/stats`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/services`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/partners/pending`, { headers })
      ]);

      if (!statsResponse.ok) throw new Error('Không thể tải dữ liệu thống kê.');
      if (!servicesResponse.ok) throw new Error('Không thể tải danh sách dịch vụ.');

      const statsData = await statsResponse.json();
      const servicesData = await servicesResponse.json();
      const pendingData = await pendingPartnersResponse.json();

      setStats(statsData);
      setServices(servicesData);
      setPendingPartners(pendingData);

    } catch (err) {
      console.error("Lỗi khi tải dữ liệu admin:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // Thêm API_URL vào dependency array

  // ✅ 2. SỬ DỤNG useEffect GỌI API THẬT
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Giả định user này đã được xác thực là admin bởi AdminRoute
        fetchAdminData();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, fetchAdminData]);

  // --- Các hàm xử lý Service ---
  const handleOpenServiceModal = (service = null) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleSaveService = async (data, serviceId) => {
    setIsSaving(true); // Bắt đầu trạng thái "đang lưu"
    
    const isEditing = !!serviceId;
    const url = isEditing ? `${API_URL}/api/services/${serviceId}` : `${API_URL}/api/services`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Lưu dịch vụ thất bại.');
      }

      // Chỉ đóng modal và tải lại dữ liệu SAU KHI thành công
      handleCloseServiceModal();
      await fetchAdminData(); // Chờ tải lại dữ liệu xong
      
      // Hiển thị thông báo thành công cuối cùng
      alert(`Dịch vụ đã được ${isEditing ? 'cập nhật' : 'thêm mới'} thành công!`);

    } catch (err) {
      // Nếu có lỗi, chỉ hiển thị lỗi và KHÔNG đóng modal
      alert(err.message);
    } finally {
      setIsSaving(false); // Kết thúc trạng thái "đang lưu"
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Xóa dịch vụ thất bại.');
      alert('Xóa dịch vụ thành công!');
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

    const handleUpdatePartnerStatus = async (partnerId, newStatus, successMessage) => {
    setIsProcessing(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Vui lòng đăng nhập lại.");
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_URL}/api/partners/${partnerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Cập nhật trạng thái thất bại.');
      
      alert(successMessage);
      setViewingPartner(null); // Đóng modal sau khi thành công
      await fetchAdminData(); // Tải lại toàn bộ dữ liệu
      
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải trang quản trị..." />;
  }

  if (error) {
    return <AdminContainer><ErrorMessage message={error} /></AdminContainer>;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <Title>Trang Quản Trị</Title>
      </AdminHeader>

      <TableCard>
        <CardHeader>
          <CardTitle>Đối Tác Chờ Duyệt ({pendingPartners.length})</CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <th>Tên Đối Tác</th>
              <th>Email</th>
              <th>Ngày Đăng Ký</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {pendingPartners.map(partner => (
              <tr key={partner.uid}>
                <td>{partner.name}</td>
                <td>{partner.email}</td>
                <td>{new Date(partner.registeredAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <ActionButton onClick={() => setViewingPartner(partner)} style={{color: '#2563eb'}}>
                    Xem chi tiết
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

       <TableCard style={{ marginTop: '2.5rem' }}>
        <CardHeader>
          <CardTitle>Quản Lý Dịch Vụ</CardTitle>
          <AddButton onClick={() => handleOpenServiceModal()}>
            <PlusCircle size={16} /> Thêm Dịch Vụ
          </AddButton>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <th>Tên Dịch Vụ</th>
              <th>Khoảng Giá</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} onClick={() => setViewingService(service)}>
                <td>{service.name_service}</td>
                <td>{displayPriceRange(service.pricingTiers)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <ActionButton onClick={() => handleOpenServiceModal(service)} style={{ color: '#2563eb' }}>
                    <Edit size={14} /> Sửa
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteService(service.id)} style={{ color: '#b91c1c' }}>
                    <Trash2 size={14} /> Xóa
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      {isServiceModalOpen && (
        <ServiceEditModal
          service={editingService}
          onClose={handleCloseServiceModal}
          onSave={handleSaveService}
          isSaving={isSaving} 
        />
      )}

      {viewingService && (
        <ServiceDetailModal 
          service={viewingService} 
          onClose={() => setViewingService(null)} 
        />
      )}

      {viewingPartner && (
        <PartnerApprovalModal
          partner={viewingPartner}
          onClose={() => setViewingPartner(null)}
          isProcessing={isProcessing}
          onApprove={(partnerId) => handleUpdatePartnerStatus(partnerId, 'active', 'Duyệt đối tác thành công!')}
          onReject={(partnerId) => handleUpdatePartnerStatus(partnerId, 'suspended', 'Đã từ chối/đình chỉ đối tác.')}
        />
      )}
    </AdminContainer>
  );
};

export default AdminPage;