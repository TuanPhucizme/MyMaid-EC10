import React from 'react';
// Bỏ useNavigate vì không dùng đến trong logic này
// import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CreditCard, DollarSign, FileText } from 'lucide-react';

// --- PHẦN GIAO DIỆN GIỮ NGUYÊN ---
const PaymentContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const PaymentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  color: #3b82f6;
  margin-right: 1rem;
`;

const InfoText = styled.div`
  flex-grow: 1;
`;

const Label = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Value = styled.p`
  margin: 0;
  font-weight: 500;
  color: #111827;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }
`;

const PaymentDetailPage = () => {
  // const navigate = useNavigate(); // Không cần thiết nếu chỉ chuyển hướng bằng window.location.href

  // --- HÀM XỬ LÝ THANH TOÁN ĐÃ ĐƯỢC CẬP NHẬT ---
  const handlePayment = () => {
    // URL và body đã được cập nhật để khớp với API server Express
    fetch('http://localhost:3030/api/payment/create_payment_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Body chỉ chứa các trường mà backend mới yêu cầu
      body: JSON.stringify({
        amount: 500000,
        language: 'vn',
        bankCode: '' // Để trống để người dùng chọn ngân hàng trên cổng VNPAY
      })
    })
      .then(res => {
        if (!res.ok) {
          // Nếu server trả về lỗi, ném ra lỗi để nhảy vào .catch
          throw new Error('Lỗi từ server: ' + res.status);
        }
        return res.json();
      })
      .then(data => {
        // Kiểm tra xem server có trả về paymentUrl không
        if (data && data.paymentUrl) {
          // Nếu có, chuyển hướng người dùng đến URL đó
          window.location.href = data.paymentUrl;
        } else {
          // Nếu không, thông báo lỗi
          console.error('Không nhận được URL thanh toán từ server.');
          alert('Không thể lấy được URL thanh toán. Vui lòng kiểm tra lại.');
        }
      })
      .catch(err => {
        // Bắt lỗi mạng hoặc lỗi từ server
        console.error('Lỗi khi tạo yêu cầu thanh toán:', err);
        alert('Có lỗi xảy ra khi kết nối đến máy chủ thanh toán. Vui lòng thử lại sau.');
      });
  };

  return (
    <PaymentContainer>
      <PaymentCard>
        <SectionTitle>Chi Tiết Hợp Đồng</SectionTitle>

        <InfoRow>
          <IconWrapper><FileText size={24} /></IconWrapper>
          <InfoText>
            <Label>Dịch vụ</Label>
            <Value>Dọn dẹp nhà theo giờ</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper><FileText size={24} /></IconWrapper>
          <InfoText>
            <Label>Đơn Vị Dịch Vụ</Label>
            <Value>Nhóm ABC</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper><DollarSign size={24} /></IconWrapper>
          <InfoText>
            <Label>Giá tiền</Label>
            <Value>500,000 VNĐ</Value>
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconWrapper><CreditCard size={24} /></IconWrapper>
          <InfoText>
            <Label>Phương thức thanh toán</Label>
            <Value>VNPay</Value>
          </InfoText>
        </InfoRow>

        <PayButton onClick={handlePayment}>Thanh toán ngay</PayButton>
      </PaymentCard>
    </PaymentContainer>
  );
};

export default PaymentDetailPage;