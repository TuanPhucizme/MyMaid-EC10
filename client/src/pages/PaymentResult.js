import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle2, XCircle, FileText, DollarSign, Banknote, Calendar } from 'lucide-react';
import { showUserError, showUserSuccess } from '../services/errorHandler';
import ToastNotification from '../components/ToastNotification';

// --- TÁI SỬ DỤNG CÁC STYLED COMPONENTS TỪ PaymentDetailPage ---
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
  padding: 2.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

// --- COMPONENT MỚI CHO ICON TRẠNG THÁI ---
const StatusIcon = styled.div`
  margin-bottom: 1.5rem;
  color: ${props => (props.success ? '#10b981' : '#ef4444')};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const StatusMessage = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
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

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

// --- HÀM TIỆN ÍCH ---
const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return `${parseInt(amount, 10).toLocaleString('vi-VN')} VNĐ`;
};

const formatDateTime = (vnpayDate) => {
    if (!vnpayDate || vnpayDate.length !== 14) return 'N/A';
    const year = vnpayDate.substring(0, 4);
    const month = vnpayDate.substring(4, 6);
    const day = vnpayDate.substring(6, 8);
    const hour = vnpayDate.substring(8, 10);
    const minute = vnpayDate.substring(10, 12);
    const second = vnpayDate.substring(12, 14);
    return `${hour}:${minute}:${second} - ${day}/${month}/${year}`;
};

const getErrorMessage = (code) => {
    switch (code) {
        case '07': return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên hệ VNPAY).';
        case '09': return 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking.';
        case '10': return 'Thẻ/Tài khoản đã bị khóa.';
        case '11': return 'Giao dịch không thành công do hết hạn chờ thanh toán.';
        case '12': return 'Thẻ/Tài khoản không đủ số dư.';
        case '13': return 'Bạn đã nhập sai mật khẩu xác thực (OTP).';
        case '24': return 'Bạn đã hủy giao dịch.';
        case '51': return 'Tài khoản của bạn không đủ số dư.';
        case '65': return 'Tài khoản của bạn đã vượt quá hạn mức giao dịch trong ngày.';
        case '99': return 'Các lỗi khác (do VNPAY xử lý).';
        default: return 'Giao dịch không thành công. Vui lòng thử lại.';
    }
}

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const updateOrderAfterPayment = async (paymentInfo) => {
    try {
      // Import payment service
      const { processVNPayReturn } = await import('../services/paymentService');

      // Process VNPay return with Firebase
      const result = await processVNPayReturn(paymentInfo);

      if (result.success) {
        console.log('✅ Cập nhật đơn hàng thành công:', result.orderId);
        setOrderId(result.orderId);
        showUserSuccess(result.message || 'Thanh toán thành công!', 'VNPay');
      } else {
        console.error('❌ Lỗi khi cập nhật đơn hàng:', result.error);
        showUserError(result, 'Có lỗi xảy ra khi cập nhật đơn hàng');
      }
    } catch (error) {
      console.error('❌ Lỗi khi xử lý kết quả thanh toán:', error);
      // Show user-friendly error
      showUserError(error, 'Có lỗi xảy ra khi xử lý kết quả thanh toán. Vui lòng liên hệ hỗ trợ.');
    }
  };

  useEffect(() => {
    // Check if this is from navigation state (cash payment)
    if (location.state) {
      const { success, orderId, paymentMethod, message } = location.state;
      setIsSuccess(success);
      setOrderId(orderId);
      setPaymentInfo({
        paymentMethod,
        message,
        orderId
      });

      if (success) {
        localStorage.removeItem('bookingDetails');
      }
      return;
    }

    // Handle VNPay return
    const params = new URLSearchParams(location.search);
    const responseCode = params.get('vnp_ResponseCode');

    if (responseCode) {
      const info = {
        amount: params.get('vnp_Amount') ? params.get('vnp_Amount') / 100 : 0,
        bankCode: params.get('vnp_BankCode'),
        transactionNo: params.get('vnp_TransactionNo'),
        payDate: params.get('vnp_PayDate'),
        orderInfo: params.get('vnp_OrderInfo'),
        responseCode,
        vnp_TxnRef: params.get('vnp_TxnRef')
      };

      setPaymentInfo(info);
      setIsSuccess(responseCode === '00');

      if (responseCode === '00') {
        // Cập nhật trạng thái đơn hàng thành công
        updateOrderAfterPayment(info);
        localStorage.removeItem('bookingDetails');
      }
    } else {
      // No payment info found, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const handleRetry = () => {
    const storedBooking = localStorage.getItem('bookingDetails');
    if (storedBooking) {
      // Chuyển hướng về trang thanh toán với dữ liệu đã lưu
      navigate('/payment', { state: { bookingDetails: JSON.parse(storedBooking) } });
    } else {
      alert('Không tìm thấy dữ liệu đặt hàng. Vui lòng đặt lại dịch vụ.');
      navigate('/booking');
    }
  };

  if (!paymentInfo) {
    return <PaymentContainer>Đang tải kết quả...</PaymentContainer>;
  }

  return (
    <PaymentContainer>
      <PaymentCard>
        {isSuccess ? (
          <>
            <StatusIcon success>
              <CheckCircle2 size={80} strokeWidth={1.5} />
            </StatusIcon>
            <SectionTitle>Thanh toán thành công</SectionTitle>
            <StatusMessage>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</StatusMessage>
            
            {/* Hiển thị thông tin dựa trên phương thức thanh toán */}
            {paymentInfo.paymentMethod === 'cash' ? (
              <>
                <InfoRow>
                  <IconWrapper><CheckCircle2 size={20} /></IconWrapper>
                  <InfoText>
                    <Label>Phương thức thanh toán</Label>
                    <Value>Thanh toán khi hoàn thành</Value>
                  </InfoText>
                </InfoRow>
                <InfoRow>
                  <IconWrapper><FileText size={20} /></IconWrapper>
                  <InfoText>
                    <Label>Mã đơn hàng</Label>
                    <Value>{orderId || paymentInfo.orderId}</Value>
                  </InfoText>
                </InfoRow>
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: '16px 0',
                  textAlign: 'left'
                }}>
                  <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>
                    <strong>Lưu ý:</strong> Bạn sẽ thanh toán bằng tiền mặt sau khi maid hoàn thành dịch vụ.
                    Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.
                  </p>
                </div>
              </>
            ) : (
              <>
                <InfoRow>
                  <IconWrapper><DollarSign size={20} /></IconWrapper>
                  <InfoText>
                    <Label>Số tiền</Label>
                    <Value>{formatCurrency(paymentInfo.amount)}</Value>
                  </InfoText>
                </InfoRow>
                {paymentInfo.bankCode && (
                  <InfoRow>
                    <IconWrapper><Banknote size={20} /></IconWrapper>
                    <InfoText>
                      <Label>Ngân hàng</Label>
                      <Value>{paymentInfo.bankCode}</Value>
                    </InfoText>
                  </InfoRow>
                )}
                {paymentInfo.transactionNo && (
                  <InfoRow>
                    <IconWrapper><FileText size={20} /></IconWrapper>
                    <InfoText>
                      <Label>Mã giao dịch VNPAY</Label>
                      <Value>{paymentInfo.transactionNo}</Value>
                    </InfoText>
                  </InfoRow>
                )}
              </>
            )}
            <InfoRow>
              <IconWrapper><Calendar size={20} /></IconWrapper>
              <InfoText>
                <Label>Thời gian thanh toán</Label>
                <Value>{formatDateTime(paymentInfo.payDate)}</Value>
              </InfoText>
            </InfoRow>
            <ActionButton onClick={() => navigate('/my-orders')}>Xem đơn hàng</ActionButton>
            <ActionButton onClick={() => navigate('/')}>Về trang chủ</ActionButton>
          </>
        ) : (
          <>
            <StatusIcon>
              <XCircle size={80} strokeWidth={1.5} />
            </StatusIcon>
            <SectionTitle>Thanh toán thất bại</SectionTitle>
            <StatusMessage>{getErrorMessage(paymentInfo.responseCode)}</StatusMessage>

            <InfoRow>
              <IconWrapper><FileText size={20} /></IconWrapper>
              <InfoText>
                <Label>Nội dung</Label>
                <Value>{paymentInfo.orderInfo || 'Không có thông tin'}</Value>
              </InfoText>
            </InfoRow>
            <InfoRow>
              <IconWrapper><DollarSign size={20} /></IconWrapper>
              <InfoText>
                <Label>Số tiền</Label>
                <Value>{formatCurrency(paymentInfo.amount)}</Value>
              </InfoText>
            </InfoRow>
            <ActionButton onClick={handleRetry}>Thử lại thanh toán</ActionButton>
          </>
        )}
      </PaymentCard>

      {/* Toast Notifications */}
      <ToastNotification />
    </PaymentContainer>
  );
};

export default PaymentResultPage;