import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
`;

const Title = styled.h2`
  color: #1f2937;
  margin-bottom: 1rem;
`;

const OrderCard = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;
  
  &:hover {
    background: #2563eb;
  }
`;

const DebugOrdersPage = () => {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const addDebugInfo = (info) => {
    setDebugInfo(prev => prev + '\n' + info);
    console.log(info);
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      addDebugInfo('🔍 Getting all orders...');
      
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(ordersQuery);
      
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      setAllOrders(orders);
      addDebugInfo(`📊 Found ${orders.length} total orders`);
      
    } catch (error) {
      addDebugInfo(`❌ Error getting all orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async () => {
    if (!user) {
      addDebugInfo('❌ No user logged in');
      return;
    }

    try {
      setLoading(true);
      addDebugInfo(`🔍 Getting orders for user: ${user.uid}`);
      
      const userOrdersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(userOrdersQuery);
      
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      setUserOrders(orders);
      addDebugInfo(`📊 Found ${orders.length} orders for current user`);
      
    } catch (error) {
      addDebugInfo(`❌ Error getting user orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  useEffect(() => {
    if (user) {
      addDebugInfo(`👤 Current user: ${user.uid}`);
      addDebugInfo(`📧 Email: ${user.email}`);
    }
  }, [user]);

  return (
    <Container>
      <Title>🔧 Debug Orders Page</Title>
      
      <Section>
        <h3>Controls</h3>
        <Button onClick={getAllOrders} disabled={loading}>
          Get All Orders
        </Button>
        <Button onClick={getUserOrders} disabled={loading}>
          Get My Orders
        </Button>
        <Button onClick={clearDebug}>
          Clear Debug
        </Button>
      </Section>

      <Section>
        <h3>Debug Info</h3>
        <pre style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '4px', fontSize: '12px' }}>
          {debugInfo || 'No debug info yet...'}
        </pre>
      </Section>

      <Section>
        <h3>All Orders ({allOrders.length})</h3>
        {allOrders.map(order => (
          <OrderCard key={order.id}>
            <strong>ID:</strong> {order.id}<br/>
            <strong>User ID:</strong> {order.userId}<br/>
            <strong>Status:</strong> {order.status}<br/>
            <strong>Created:</strong> {order.createdAt?.toDate?.()?.toString() || order.createdAt?.toString() || 'N/A'}<br/>
            <strong>Service:</strong> {order.service?.name || 'N/A'}<br/>
            <strong>Amount:</strong> {order.payment?.amount || 'N/A'}
          </OrderCard>
        ))}
      </Section>

      <Section>
        <h3>My Orders ({userOrders.length})</h3>
        {userOrders.map(order => (
          <OrderCard key={order.id}>
            <strong>ID:</strong> {order.id}<br/>
            <strong>Status:</strong> {order.status}<br/>
            <strong>Created:</strong> {order.createdAt?.toDate?.()?.toString() || order.createdAt?.toString() || 'N/A'}<br/>
            <strong>Service:</strong> {order.service?.name || 'N/A'}<br/>
            <strong>Amount:</strong> {order.payment?.amount || 'N/A'}
          </OrderCard>
        ))}
      </Section>
    </Container>
  );
};

export default DebugOrdersPage;
