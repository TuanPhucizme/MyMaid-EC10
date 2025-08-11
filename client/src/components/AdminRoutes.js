// src/components/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../config/firebase';
import { doc } from 'firebase/firestore';

const AdminRoute = () => {
  const [user, authLoading, authError] = useAuthState(auth);
  const userDocRef = user ? doc(db, 'mm_users', user.uid) : null;
  const [profile, profileLoading, profileError] = useDocumentData(userDocRef);

  if (authLoading || profileLoading) {
    return <LoadingSpinner fullScreen text="Đang xác thực quyền truy cập..." />;
  }

  if (authError || profileError) {
    console.error("Lỗi xác thực:", authError || profileError);
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    alert("Tài khoản của bạn không hợp lệ. Vui lòng liên hệ quản trị viên.");
    return <Navigate to="/" replace />;
  }

  if (profile.role !== 'admin') {
    alert("Bạn không có quyền truy cập trang này.");
    return <Navigate to="/" replace />;
  }

  // Nếu tất cả đều ổn, cho phép render các trang con
  return <Outlet />;
};

export default AdminRoute;