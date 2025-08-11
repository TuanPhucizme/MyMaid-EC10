import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, ListChecks, Bell } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

//import { mockPartner, mockBookings } from '../mockData'; // Đảm bảo đường dẫn đúng

//1. IMPORT CÁC HÀM TỪ FIREBASE
import { auth, db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

// --- Styled Components ---
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #1a202c;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
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

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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

const CardContent = styled.div`
  padding: 0.5rem 1.5rem 1.5rem;
`;

const JobItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

const JobInfo = styled.div`
  flex: 1;
`;

const ServiceName = styled.div`
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const JobMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const PartnerDashboardPage = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [newJobs, setNewJobs] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, completedJobsThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async (firebaseUser) => {
      try {
        // 1. KIỂM TRA VAI TRÒ CỦA NGƯỜI DÙNG
        const userDocRef = doc(db, "mm_users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists() || userDocSnap.data().role !== 'partner') {
          throw new Error("Bạn không có quyền truy cập trang này.");
        }
        setPartner(userDocSnap.data());

        // 2. LẤY TẤT CẢ CÔNG VIỆC ĐƯỢC GÁN CHO PARTNER NÀY
        const bookingsColRef = collection(db, "bookings");
        const q = query(
          bookingsColRef,
          where("partnerId", "==", firebaseUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const allJobs = [];
        querySnapshot.forEach(doc => allJobs.push({ id: doc.id, ...doc.data() }));

        // 3. PHÂN LOẠI CÔNG VIỆC VÀ TÍNH TOÁN THỐNG KÊ
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        let revenue = 0;
        let completedCount = 0;
        const newAssignedJobs = [];

        allJobs.forEach(job => {
          const jobDate = job.createdAt.toDate();
          
          // Lọc các đơn mới được đặt (chưa hoàn thành)
          if (job.status === 'confirmed') {
            newAssignedJobs.push(job);
          }

          // Tính toán thống kê cho các đơn đã hoàn thành trong tháng này
          if (job.status === 'completed' && jobDate >= startOfMonth) {
            // Giả sử hoa hồng 20% cho đối tác
            const commissionRate = 0.8; 
            revenue += job.summary.totalPrice * commissionRate;
            completedCount++;
          }
        });

        setNewJobs(newAssignedJobs);
        setStats({ revenueThisMonth: revenue, completedJobsThisMonth: completedCount });

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu partner:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        fetchPartnerData(firebaseUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu đối tác..." />;
  }

  if (error) {
    return <DashboardContainer><ErrorMessage message={error} /></DashboardContainer>;
  }

  // // Sử dụng dữ liệu mẫu để mô phỏng
  // // ✅ 4. TẠO MỘT useEffect MỚI ĐỂ XỬ LÝ MOCK DATA
  // useEffect(() => {
  //   // Giả lập việc xử lý dữ liệu như khi lấy từ Firebase
  //   const processMockData = () => {
  //     const now = new Date();
  //     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
  //     let revenue = 0;
  //     let completedCount = 0;
  //     const newAssignedJobs = [];

  //     mockBookings.forEach(job => {
  //       const jobDate = new Date(job.createdAt);
        
  //       if (job.status === 'confirmed') {
  //         newAssignedJobs.push(job);
  //       }

  //       if (job.status === 'completed' && jobDate >= startOfMonth) {
  //         const commissionRate = 0.8; 
  //         revenue += job.summary.totalPrice * commissionRate;
  //         completedCount++;
  //       }
  //     });

  //     setNewJobs(newAssignedJobs);
  //     setStats({ revenueThisMonth: revenue, completedJobsThisMonth: completedCount });
  //     setIsLoading(false); // Kết thúc loading
  //   };

  //   // Giả lập độ trễ mạng
  //   const timer = setTimeout(processMockData, 500); 

  //   return () => clearTimeout(timer); // Dọn dẹp timer
  // }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần

  // if (isLoading) {
  //   return <LoadingSpinner fullScreen text="Đang tải dữ liệu đối tác..." />;
  // }

  // if (error) {
  //   return <DashboardContainer><ErrorMessage message={error} /></DashboardContainer>;
  // }


  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeTitle>Chào mừng, {partner?.name || 'Đối tác'}!</WelcomeTitle>
      </DashboardHeader>

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
            <StatValue>{stats.completedJobsThisMonth}</StatValue>
            <StatLabel>Dịch vụ hoàn thành (tháng)</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706"><Bell size={32} /></StatIcon>
          <StatContent>
            <StatValue>{newJobs.length}</StatValue>
            <StatLabel>Dịch vụ mới được giao</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <Card>
        <CardHeader><CardTitle>Đơn vừa được đặt</CardTitle></CardHeader>
        <CardContent>
          {newJobs.length > 0 ? newJobs.map(job => (
            <JobItem key={job.id}>
              <JobInfo>
                <ServiceName>{job.service.name}</ServiceName>
                <JobMeta>
                  Ngày: {new Date(job.schedule.date).toLocaleDateString('vi-VN')} | 
                  Giờ: {job.schedule.time} | 
                  Khách hàng: {job.contact.name}
                </JobMeta>
              </JobInfo>
              <Link to={`/booking-details/${job.id}`} className="btn">Xem chi tiết</Link>
            </JobItem>
          )) : <EmptyState>Hiện tại không có dịch vụ nào mới được giao cho bạn.</EmptyState>}
        </CardContent>
      </Card>
      
      {/* Bạn có thể thêm Card Lịch sử công việc ở đây nếu muốn */}

    </DashboardContainer>
  );
};

export default PartnerDashboardPage;