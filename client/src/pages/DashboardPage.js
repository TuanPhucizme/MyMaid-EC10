//-------------------------------------------------------------------------------------//
// dành riêng cho partner để cập nhật công việc, quản lý dịch vụ và theo dõi đánh giá. //
//-------------------------------------------------------------------------------------//
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Users, DollarSign, ListChecks, Bell } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

// ✅ 1. IMPORT CÁC HÀM TỪ FIREBASE
import { auth, db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// --- Các styled-components được tái sử dụng và tùy chỉnh ---
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
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
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
  &:last-child { border-bottom: none; }
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
`;

const BookingStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.bgColor};
  color: ${props => props.color};
`;

const PriceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  th {
    background-color: #f9fafb;
    font-weight: 500;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;


const PartnerDashboardPage = () => {
  const navigate = useNavigate();
  
  const [partner, setPartner] = useState(null); 
  const [userProfile, setUserProfile] = useState(null);
  const [newJobs, setNewJobs] = useState([]);
  const [jobHistory, setJobHistory] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, completedJobs: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Dữ liệu bảng giá (có thể lấy từ Firestore sau này)
  const priceConversion = [
    { serviceName: 'Dọn dẹp nhà cửa', customerPrice: 150000, commission: 0.2 },
    { serviceName: 'Chăm sóc trẻ em', customerPrice: 200000, commission: 0.25 },
    { serviceName: 'Nấu ăn', customerPrice: 180000, commission: 0.2 },
  ];

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập để đảm bảo auth đã sẵn sàng
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            // BƯỚC 1: Người dùng đã đăng nhập, chúng ta có `user` object.
            // Lấy `user.uid`.
            console.log("UID của người dùng đang đăng nhập:", user.uid);

            // BƯỚC 2: Dùng UID để tạo tham chiếu trực tiếp đến document của họ.
            const userDocRef = doc(db, "users", user.uid);

            // BƯỚC 3: Lấy dữ liệu từ document đó.
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log("Dữ liệu hồ sơ từ Firestore:", userDocSnap.data());
                setUserProfile(userDocSnap.data());
            } else {
                console.log("Không tìm thấy hồ sơ người dùng trong Firestore!");
            }
        } else {
            // Người dùng đã đăng xuất
            console.log("Không có người dùng nào đăng nhập.");
        }
        setIsLoading(false);
    });

    // Dọn dẹp listener khi component bị hủy
    return () => unsubscribe();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu đối tác..." />;
  }

  if (error) {
    return <DashboardContainer><p>Lỗi: {error}</p></DashboardContainer>;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeTitle>Chào mừng, {partner?.name || 'Đối tác'}!</WelcomeTitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a"><DollarSign size={24} /></StatIcon>
          <StatContent>
            <StatValue>{stats.revenueThisMonth.toLocaleString()}đ</StatValue>
            <StatLabel>Doanh thu tháng này</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#e0e7ff" color="#3b82f6"><ListChecks size={24} /></StatIcon>
          <StatContent>
            <StatValue>{stats.completedJobs}</StatValue>
            <StatLabel>Dịch vụ hoàn thành (tháng)</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706"><Bell size={24} /></StatIcon>
          <StatContent>
            <StatValue>{newJobs.length}</StatValue>
            <StatLabel>Dịch vụ mới được giao</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          {/* Dịch vụ mới */}
          <Card>
            <CardHeader><CardTitle>Dịch vụ mới được giao</CardTitle></CardHeader>
            <CardContent>
              {newJobs.length > 0 ? newJobs.map(job => (
                <BookingItem key={job.id}>
                  <BookingInfo>
                    <ServiceName>{job.service.name}</ServiceName>
                    <BookingMeta>{new Date(job.schedule.date).toLocaleDateString('vi-VN')} - {job.schedule.time}</BookingMeta>
                    <BookingMeta>Khách hàng: {job.userName}</BookingMeta>
                  </BookingInfo>
                  <Link to={`/booking-details/${job.id}`} className="btn">Xem chi tiết</Link>
                </BookingItem>
              )) : <EmptyState>Không có dịch vụ nào mới.</EmptyState>}
            </CardContent>
          </Card>

          {/* Lịch sử dịch vụ */}
          <Card>
            <CardHeader><CardTitle>Lịch sử dịch vụ</CardTitle></CardHeader>
            <CardContent>
              {jobHistory.length > 0 ? jobHistory.map(job => (
                <BookingItem key={job.id}>
                  <BookingInfo>
                    <ServiceName>{job.service.name}</ServiceName>
                    <BookingMeta>{new Date(job.schedule.date).toLocaleDateString('vi-VN')}</BookingMeta>
                  </BookingInfo>
                  <BookingStatus 
                    bgColor={job.status === 'completed' ? '#dcfce7' : '#fecaca'}
                    color={job.status === 'completed' ? '#166534' : '#b91c1c'}
                  >
                    {job.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </BookingStatus>
                </BookingItem>
              )) : <EmptyState>Chưa có lịch sử dịch vụ.</EmptyState>}
            </CardContent>
          </Card>
        </MainContent>

        {/* Bảng giá */}
        <aside>
          <Card>
            <CardHeader><CardTitle>Bảng giá & Hoa hồng</CardTitle></CardHeader>
            <CardContent>
              <PriceTable>
                <thead>
                  <tr><th>Dịch vụ</th><th>Thu nhập</th></tr>
                </thead>
                <tbody>
                  {priceConversion.map(item => (
                    <tr key={item.serviceName}>
                      <td>{item.serviceName}</td>
                      <td>{(item.customerPrice * (1 - item.commission)).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </PriceTable>
            </CardContent>
          </Card>
        </aside>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default PartnerDashboardPage;