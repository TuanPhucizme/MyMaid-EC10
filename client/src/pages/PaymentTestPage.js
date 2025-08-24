import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle, AlertCircle, Database, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { processCashPayment, validatePaymentData, getAvailablePaymentMethods } from '../services/paymentService';
import { createOrder, getUserOrders, ORDER_STATUS } from '../services/firebaseOrderService';
import { showUserError } from '../services/errorHandler';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TestCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TestButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin: 8px 8px 8px 0;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  background: ${props => 
    props.type === 'success' ? '#dcfce7' : 
    props.type === 'error' ? '#fee2e2' : 
    '#fef3c7'
  };
  border: 1px solid ${props => 
    props.type === 'success' ? '#bbf7d0' : 
    props.type === 'error' ? '#fecaca' : 
    '#fde68a'
  };
  color: ${props => 
    props.type === 'success' ? '#166534' : 
    props.type === 'error' ? '#991b1b' : 
    '#92400e'
  };
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  font-size: 14px;
`;

const PaymentTestPage = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (type, message, data = null) => {
    const result = {
      id: Date.now(),
      type,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  // Test Firebase Order Creation
  const testCreateOrder = async () => {
    if (!user) {
      addResult('error', 'Vui lòng đăng nhập để test tạo đơn hàng');
      return;
    }

    setIsLoading(true);
    try {
      const mockOrderData = {
        service: {
          id: 'house-cleaning',
          name: 'Dọn dẹp nhà cửa',
          icon: '🏠',
          category: 'cleaning'
        },
        schedule: {
          date: '2024-01-15',
          time: '09:00',
          duration: 2,
          frequency: 'one-time'
        },
        contact: {
          name: 'Test User',
          phone: '0123456789',
          email: 'test@example.com',
          address: 'Test Address, Quận 1, TP.HCM',
          notes: 'Test order from PaymentTestPage'
        },
        payment: {
          amount: 200000,
          method: 'cash'
        }
      };

      const result = await createOrder(mockOrderData, user.uid);
      addResult('success', 'Tạo đơn hàng thành công!', result);
    } catch (error) {
      addResult('error', 'Lỗi tạo đơn hàng: ' + error.error?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test Get User Orders
  const testGetUserOrders = async () => {
    if (!user) {
      addResult('error', 'Vui lòng đăng nhập để test lấy đơn hàng');
      return;
    }

    setIsLoading(true);
    try {
      const result = await getUserOrders(user.uid);
      addResult('success', `Lấy danh sách đơn hàng thành công! Tìm thấy ${result.orders.length} đơn hàng`, result);
    } catch (error) {
      addResult('error', 'Lỗi lấy đơn hàng: ' + error.error?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test Cash Payment
  const testCashPayment = async () => {
    if (!user) {
      addResult('error', 'Vui lòng đăng nhập để test thanh toán');
      return;
    }

    setIsLoading(true);
    try {
      const mockOrderData = {
        service: {
          id: 'house-cleaning',
          name: 'Dọn dẹp nhà cửa',
          icon: '🏠'
        },
        schedule: {
          date: '2024-01-15',
          time: '14:00',
          duration: 3
        },
        contact: {
          name: 'Test Cash Payment',
          phone: '0987654321',
          email: 'cash@test.com',
          address: 'Cash Payment Test Address'
        },
        payment: {
          amount: 300000,
          method: 'cash'
        }
      };

      const result = await processCashPayment(mockOrderData, user.uid);
      addResult('success', 'Thanh toán tiền mặt thành công!', result);
    } catch (error) {
      addResult('error', 'Lỗi thanh toán: ' + error.error?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test Payment Methods
  const testPaymentMethods = () => {
    try {
      const methods = getAvailablePaymentMethods();
      addResult('success', 'Lấy phương thức thanh toán thành công!', methods);
    } catch (error) {
      addResult('error', 'Lỗi lấy phương thức thanh toán: ' + error.message);
    }
  };

  // Test Error Handling
  const testErrorHandling = () => {
    try {
      // Test validation error
      validatePaymentData({});
    } catch (error) {
      addResult('warning', 'Test validation error thành công!', error);
    }
  };

  return (
    <TestContainer>
      <h1>🧪 Payment & Firebase Test Page</h1>
      
      <TestCard>
        <h2>👤 User Status</h2>
        {user ? (
          <ResultBox type="success">
            <CheckCircle className="inline w-4 h-4 mr-2" />
            Đã đăng nhập: {user.email}
          </ResultBox>
        ) : (
          <ResultBox type="error">
            <XCircle className="inline w-4 h-4 mr-2" />
            Chưa đăng nhập - Vui lòng đăng nhập để test đầy đủ tính năng
          </ResultBox>
        )}
      </TestCard>

      <TestCard>
        <h2>🔧 Test Functions</h2>
        <div>
          <TestButton onClick={testCreateOrder} disabled={isLoading || !user}>
            <Database className="inline w-4 h-4 mr-2" />
            Test Tạo Đơn Hàng Firebase
          </TestButton>
          
          <TestButton onClick={testGetUserOrders} disabled={isLoading || !user}>
            <Database className="inline w-4 h-4 mr-2" />
            Test Lấy Đơn Hàng User
          </TestButton>
          
          <TestButton onClick={testCashPayment} disabled={isLoading || !user}>
            <DollarSign className="inline w-4 h-4 mr-2" />
            Test Thanh Toán Tiền Mặt
          </TestButton>
          
          <TestButton onClick={testPaymentMethods} disabled={isLoading}>
            <CreditCard className="inline w-4 h-4 mr-2" />
            Test Phương Thức Thanh Toán
          </TestButton>
          
          <TestButton onClick={testErrorHandling} disabled={isLoading}>
            <AlertCircle className="inline w-4 h-4 mr-2" />
            Test Error Handling
          </TestButton>
        </div>
        
        {isLoading && (
          <ResultBox type="warning">
            ⏳ Đang xử lý test...
          </ResultBox>
        )}
      </TestCard>

      <TestCard>
        <h2>📊 Test Results</h2>
        {testResults.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Chưa có kết quả test nào. Hãy chạy các test ở trên.</p>
        ) : (
          <div>
            {testResults.map((result) => (
              <ResultBox key={result.id} type={result.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <strong>{result.timestamp}</strong> - {result.message}
                    {result.data && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontSize: '12px' }}>
                          Xem chi tiết data
                        </summary>
                        <pre style={{ 
                          background: 'rgba(0,0,0,0.1)', 
                          padding: '8px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          overflow: 'auto',
                          marginTop: '4px'
                        }}>
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </ResultBox>
            ))}
          </div>
        )}
      </TestCard>

      <TestCard>
        <h2>📝 Hướng dẫn Test</h2>
        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <h4>🎯 Mục đích:</h4>
          <ul>
            <li>Test tính năng tạo đơn hàng trong Firebase</li>
            <li>Test thanh toán tiền mặt (cash payment)</li>
            <li>Test error handling khi localhost không khả dụng</li>
            <li>Kiểm tra tích hợp Firebase Firestore</li>
          </ul>
          
          <h4>📋 Các bước test:</h4>
          <ol>
            <li>Đăng nhập vào hệ thống</li>
            <li>Chạy "Test Tạo Đơn Hàng Firebase" để tạo đơn hàng mẫu</li>
            <li>Chạy "Test Lấy Đơn Hàng User" để xem danh sách đơn hàng</li>
            <li>Chạy "Test Thanh Toán Tiền Mặt" để test flow thanh toán</li>
            <li>Kiểm tra kết quả trong Firebase Console</li>
          </ol>
        </div>
      </TestCard>
    </TestContainer>
  );
};

export default PaymentTestPage;
