import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaUserMd, 
  FaPills,
  FaUserCog
} from 'react-icons/fa';
import { logout } from '../redux/slices/AuthSlice';
import '../styles/admin.css';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/auth/login');
    } catch(error) {
      console.error('Ошибка выхода из системы:', error);
      alert('Произошла ошибка при выходе из системы');
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/admin">
            <FaUserCog className="admin-icon" /> Админ-панель
          </Link>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            <FaTachometerAlt className="nav-icon" /> Панель управления
          </Link>
          <Link to="/admin/doctors" className="admin-nav-link">
            <FaUserMd className="nav-icon" /> Врачи
          </Link>
          <Link to="/admin/medicines" className="admin-nav-link">
            <FaPills className="nav-icon" /> Лекарства
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-user">
            <span className="username">{user?.login}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Выйти
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;