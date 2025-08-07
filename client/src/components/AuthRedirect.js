import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Không redirect khi đang loading hoặc không có user
    if (loading || !user) return;

    // Các trang không cần redirect
    const excludedPaths = [
      '/login',
      '/register', 
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/update-information'
    ];

    // Nếu đang ở trang excluded, không redirect
    if (excludedPaths.includes(location.pathname)) return;

    // Nếu user cần setup profile và không phải đang ở trang update-information
    if (user.needsProfileSetup && location.pathname !== '/update-information') {
      console.log('User needs profile setup, redirecting to /update-information');
      navigate('/update-information', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  return children;
};

export default AuthRedirect;
