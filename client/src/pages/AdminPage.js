import React, { useState, useEffect, useCallback } from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DollarSign, ListChecks, UserCheck, UserX, PlusCircle, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

//import PartnerDetailModal from '../components/PartnerDetailModal';
import ServiceEditModal from '../components/ServiceEditModal';
import ServiceDetailModal from '../components/ServiceDetailModal';

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

const AdminPage = () => {
  const navigate = useNavigate();
  //const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, bookingsThisMonth: 0, pendingPartners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //const [selectedPartner, setSelectedPartner] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null = thêm mới, object = sửa

  const [services, setServices] = useState([]);
  const [viewingService, setViewingService] = useState(null);

  const fetchAdminData = useCallback(async()=> {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Vui lòng đăng nhập.");
      
      const token = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      // 2. LẤY DỮ LIỆU THỐNG KÊ
      
      // Dùng Promise.all để gọi các API song song, tăng tốc độ tải
      const [servicesResponse] = await Promise.all([
        //fetch('http://localhost:3030/api/partners', { headers }),
        //fetch('http://localhost:3030/api/partners/stats', { headers }),
        fetch('http://localhost:3030/api/services', { headers }) // Fetch services
      ]);

      //if (!partnersResponse.ok) throw new Error('Không thể tải danh sách đối tác.');
      //if (!statsResponse.ok) throw new Error('Không thể tải dữ liệu thống kê.');
      if (!servicesResponse.ok) throw new Error('Không thể tải danh sách dịch vụ.');

      //const partnersData = await partnersResponse.json();
      //const statsData = await statsResponse.json();
      const servicesData = await servicesResponse.json();

      //setPartners(partnersData);
      //setStats(statsData);
      setServices(servicesData);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu admin:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []); // Mảng rỗng đảm bảo hàm chỉ được tạo 1 lần

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

  // useEffect(() => {
  //   console.log("Đang tải dữ liệu từ file mock...");
    
  //   // Giả lập độ trễ mạng để kiểm tra trạng thái loading
  //   const timer = setTimeout(() => {
  //     try {
  //       setPartners(mockPartners);
  //       setStats(mockStats);
  //       setIsLoading(false);
  //       console.log("Tải dữ liệu mock thành công!");
  //     } catch (err) {
  //       setError("Lỗi khi xử lý dữ liệu mock.");
  //       setIsLoading(false);
  //     }
  //   }, 1000); // Giả lập 1 giây tải dữ liệu

  //   // Dọn dẹp timer khi component bị hủy
  //   return () => clearTimeout(timer);
  // }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần


  // const handleUpdatePartnerStatus = async (partnerId, newStatus) => {
  //   if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'active' ? 'duyệt' : 'đình chỉ'} đối tác này?`)) return;

  //   try {
  //     const user = auth.currentUser;
  //     if (!user) throw new Error("Vui lòng đăng nhập lại.");
  //     const token = await user.getIdToken();
      
  //     const response = await fetch(`http://localhost:3030/api/partners/${partnerId}/status`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ status: newStatus })
  //     });

  //     if (!response.ok) {
  //       const result = await response.json();
  //       throw new Error(result.message || 'Cập nhật trạng thái thất bại.');
  //     }

  //     if (response.status === 401) {
  //       navigate('/login');
  //     }
      
  //     // ✅ SỬA LẠI LOGIC CẬP NHẬT UI
  //     // Dữ liệu từ API GET /api/partners đã được làm phẳng, nên chúng ta chỉ cần cập nhật trường 'status'
  //     setPartners(prevPartners => prevPartners.map(p => 
  //       p.uid === partnerId ? { ...p, status: newStatus } : p
  //     ));
      
  //     // Tải lại dữ liệu thống kê để cập nhật số lượng "Đối tác chờ duyệt"
  //     fetchAdminData();

  //     alert('Cập nhật trạng thái đối tác thành công!');
  //   } catch (err) {
  //     console.error("Lỗi khi cập nhật trạng thái:", err);
  //     alert(err.message);
  //   }
  // };

  //   // 4. TẠO CÁC HÀM ĐỂ MỞ/ĐÓNG MODAL
  // const handleRowClick = (partner) => {
  //   setSelectedPartner(partner);
  // };

  // const handleCloseModal = () => {
  //   setSelectedPartner(null);
  // };

  const handleOpenServiceModal = (service = null) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleSaveService = async (data, serviceId) => {
    const isEditing = !!serviceId;
    const url = isEditing ? `http://localhost:3030/api/services/${serviceId}` : 'http://localhost:3030/api/services';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Lưu dịch vụ thất bại.');
      }
      alert(`Dịch vụ đã được ${isEditing ? 'cập nhật' : 'thêm mới'} thành công!`);
      handleCloseServiceModal();
      fetchAdminData(); // Tải lại toàn bộ dữ liệu
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này? Hành động này không thể hoàn tác.")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`http://localhost:3030/api/services/${serviceId}`, {
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

      {/* <StatsGrid>
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
      </StatsGrid> */}

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
                <td onClick={(e) => e.stopPropagation()}> {/* Ngăn modal hiện khi click nút */}
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

      {/* <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Tên Đối Tác</th>
              <th>Email</th>
              <th>Ngày Đăng Ký</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(partner => {
              const status = getStatusProps(partner.status);
              return (
                <TableRow key={partner.uid} onClick={() => handleRowClick(partner)}>
                  <td>{partner.name}</td>
                  <td>{partner.email}</td>
                  <td>{new Date(partner.registeredAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <StatusBadge bgColor={status.bgColor} color={status.color}>
                      {status.text}
                    </StatusBadge>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}> {/* Ngăn modal hiện lên khi click vào nút */}
                    {/* {partner.status === 'pending_approval' && (
                      <ApproveButton onClick={() => handleUpdatePartnerStatus(partner.uid, 'active')}>
                        <UserCheck size={14} /> Duyệt
                      </ApproveButton>
                    )}
                    {partner.status === 'active' && (
                      <SuspendButton onClick={() => handleUpdatePartnerStatus(partner.uid, 'suspended')}>
                        <UserX size={14} /> Đình chỉ
                      </SuspendButton>
                    )}
                  </td>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableCard> */}

      {/* <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Tên Đối Tác</th>
              <th>Email</th>
              <th>Ngày Đăng Ký</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(partner => {
              // ✅ SỬA LẠI CÁCH TRUY CẬP DỮ LIỆU
              const status = getStatusProps(partner.status);
              return (
                <tr key={partner.uid}>
                  <td>{partner.name}</td>
                  <td>{partner.email}</td>
                  <td>{new Date(partner.registeredAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <StatusBadge bgColor={status.bgColor} color={status.color}>
                      {status.text}
                    </StatusBadge>
                  </td>
                  <td>
                    {partner.status === 'pending_approval' && (
                      <ApproveButton onClick={() => handleUpdatePartnerStatus(partner.uid, 'active')}>
                        <UserCheck size={14} /> Duyệt
                      </ApproveButton>
                    )}
                    {partner.status === 'active' && (
                      <SuspendButton onClick={() => handleUpdatePartnerStatus(partner.uid, 'suspended')}>
                        <UserX size={14} /> Đình chỉ
                      </SuspendButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableCard> */}


      {/* --- CÁC MODAL --- */}
      {/* {selectedPartner && (
        <PartnerDetailModal partner={selectedPartner} onClose={handleCloseModal} />
      )} */}

      {isServiceModalOpen && (
        <ServiceEditModal
          service={editingService}
          onClose={handleCloseServiceModal}
          onSave={handleSaveService}
        />
      )}

      {viewingService && (
        <ServiceDetailModal 
          service={viewingService} 
          onClose={() => setViewingService(null)} 
        />
      )}
    </AdminContainer>
  );
};

export default AdminPage;