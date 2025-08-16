import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, ListChecks, Bell, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

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

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #3b82f6;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2563eb;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PartnerDashboardPage = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [partner, setPartner] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, completedJobsThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

const fetchPartnerData = useCallback(async (firebaseUser) => {
    // Bắt đầu loading mỗi khi hàm được gọi
    setIsLoading(true);
    setError(null);
    try {
      const userDocRef = doc(db, "mm_users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists() || userDocSnap.data().role !== 'partner') {
        throw new Error("Bạn không có quyền truy cập trang này.");
      }
      setPartner(userDocSnap.data());

      // 2. LẤY CÔNG VIỆC CỦA TÔI (đã được gán)
      const myJobsQuery = query(
        collection(db, "mm_bookings"),
        where("partnerId", "==", firebaseUser.uid),
        orderBy("createdAt", "desc")
      );

      // 3. LẤY CÔNG VIỆC CÓ SẴN (chưa ai nhận)
      const availableJobsQuery = query(
        collection(db, "mm_bookings"),
        where("status", "==", "pending_confirmation"),
        orderBy("createdAt", "desc")
      );

      // Thực hiện cả hai truy vấn song song
      const [myJobsSnapshot, availableJobsSnapshot] = await Promise.all([
        getDocs(myJobsQuery),
        getDocs(availableJobsQuery)
      ]);

      const myJobsData = myJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const availableJobsData = availableJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setMyJobs(myJobsData);
      setAvailableJobs(availableJobsData);

      // 4. Tính toán thống kê dựa trên công việc của tôi
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      let revenue = 0;
      let completedCount = 0;
      myJobsData.forEach(job => {
        const jobDate = job.createdAt?.toDate();
        if (job.status === 'completed' && jobDate && jobDate >= startOfMonth) {
          const commissionRate = 0.8; 
          revenue += (job.summary?.totalPrice || 0) * commissionRate;
          completedCount++;
        }
      });
      setStats({ revenueThisMonth: revenue, completedJobsThisMonth: completedCount });

    } catch (err) {
      console.error("Lỗi khi tải dữ liệu partner:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        fetchPartnerData(firebaseUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, fetchPartnerData]);

  // ✅ HÀM MỚI ĐỂ NHẬN ĐƠN
  const handleAcceptJob = async (orderId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Nhận đơn thất bại.');
      }

      toast.success('Nhận đơn thành công!');
      await fetchPartnerData(auth.currentUser); // Tải lại toàn bộ dữ liệu

    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu đối tác..." />;
  }

  if (error) {
    return <DashboardContainer><ErrorMessage message={error} /></DashboardContainer>;
  }

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
            <StatValue>{myJobs.filter(job => job.status === 'confirmed').length}</StatValue>
            <StatLabel>Dịch vụ mới được giao</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <Card>
        <CardHeader><CardTitle>Việc Làm Có Sẵn ({availableJobs.length})</CardTitle></CardHeader>
        <CardContent>
          {availableJobs.length > 0 ? availableJobs.map(job => (
            <JobItem key={job.id}>
              <JobInfo>
                <ServiceName>{job.service?.name || 'Dịch vụ không xác định'}</ServiceName>
                <JobMeta>
                  Ngày: {job.schedule?.date ? new Date(job.schedule.date).toLocaleDateString('vi-VN') : 'N/A'} | 
                  Giờ: {job.schedule?.time || 'N/A'} | 
                  Địa chỉ: {job.contact?.address || 'N/A'}
                </JobMeta>
              </JobInfo>
              <Button onClick={() => handleAcceptJob(job.id)} disabled={isProcessing}>
                <CheckCircle size={16} /> Nhận Đơn
              </Button>
            </JobItem>
          )) : <EmptyState>Hiện không có việc làm nào mới.</EmptyState>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Đơn Hàng Của Tôi</CardTitle></CardHeader>
        <CardContent>
          {myJobs.length > 0 ? myJobs.map(job => (
            <JobItem key={job.id}>
              <JobInfo>
                <ServiceName>{job.service?.name || 'Dịch vụ không xác định'}</ServiceName>
                <JobMeta>
                  Ngày: {job.schedule?.date ? new Date(job.schedule.date).toLocaleDateString('vi-VN') : 'N/A'} | 
                  Giờ: {job.schedule?.time || 'N/A'} | 
                  Khách hàng: {job.contact?.name || 'N/A'}
                </JobMeta>
              </JobInfo>
              <Link to={`/booking-details/${job.id}`} className="btn">Xem chi tiết</Link>
            </JobItem>
          )) : <EmptyState>Bạn chưa nhận đơn hàng nào.</EmptyState>}
        </CardContent>
      </Card>
    </DashboardContainer>
  );
};

export default PartnerDashboardPage;