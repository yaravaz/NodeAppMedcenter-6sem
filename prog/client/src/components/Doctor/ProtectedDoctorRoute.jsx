import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedDoctorRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { doctor, status } = useSelector((state) => state.doctor);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'doctor') {
    return <Navigate to="/" replace />;
  }

  //if (!doctor?.firstName || !doctor?.lastName || !doctor?.specialization) {
  //  return <Navigate to="/doctor/complete-profile" replace />;
  //}

  return children ? children : <Outlet />;
};

export default ProtectedDoctorRoute;