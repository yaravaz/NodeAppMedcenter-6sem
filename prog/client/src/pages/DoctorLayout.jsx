import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt, FaUserMd, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { logout } from '../redux/slices/AuthSlice';
import '../styles/doctor.css';

const DoctorLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/auth/login');
    } catch (error) {
      console.error('Ошибка выхода из системы:', error);
      alert('Произошла ошибка при выходе из системы');
    }
  };

  return (
    <div className="doctor-container">
      <aside className="doctor-sidebar">
        <div className="doctor-logo">
          <Link to="/doctor">Панель врача</Link>
        </div>
        <nav className="doctor-nav">
          <Link to="/doctor" className="doctor-nav-link">
            <FaUserMd className="nav-icon" /> Профиль
          </Link>
          <Link to="/doctor/appointments" className="doctor-nav-link">
            <FaCalendarAlt className="nav-icon" /> Мои приёмы
          </Link>
        </nav>
      </aside>

      <main className="doctor-main">
        <header className="doctor-header">
          <div className="doctor-user">
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Выйти
            </button>
          </div>
        </header>
        
        <div className="doctor-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;