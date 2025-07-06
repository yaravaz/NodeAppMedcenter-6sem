import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { logout as logoutAction } from '../redux/slices/AuthSlice';
import { message } from 'antd';
import '../styles/layout.css';

const Layout = ({ hideAuthButtons = false }) => {
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = (e) => {
    e.preventDefault();
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
          try {
              setShowProfileMenu(false)
              await dispatch(logoutAction()).unwrap();
              navigate('/');
              message.success('Вы успешно вышли из системы');
          } catch (error) {
              console.error('Ошибка выхода из системы:', error);
              message.error('Произошла ошибка при выходе из системы');
          }
  };

  const handleProfileClick = (e) => {
    if (!showProfileMenu) {
      window.location.href = '/appointments';
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">МедЦентр</Link>
          
          <div className="nav-links">
            <Link to="/doctors_list">Врачи</Link>
            <Link to="/services">Услуги</Link>
            <Link to="/about">О клинике</Link>
          </div>

          {!hideAuthButtons && (
            <div className="auth-section">
              {user ? (
                <div className="profile-menu-container" ref={profileMenuRef}>
                  <span className="username">{user.login}</span>
                  <Link 
                    to="/appointments" 
                    className="profile-link"
                    onClick={handleProfileClick}
                    onMouseEnter={() => setShowProfileMenu(true)}
                  >
                    <FaUserCircle size={24} />
                  </Link>
                  
                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <Link 
                        to="/appointments" 
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Мои записи
                      </Link>
                      <Link 
                        to="/me" 
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Мой профиль
                      </Link>
                      <Link 
                        to="/medical-results" 
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Результаты обследований
                      </Link>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/auth/logout" 
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="dropdown-icon" />
                        Выйти
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/auth/login" className="btn home-login-btn">Войти</Link>
                  <Link to="/auth/register" className="btn btn-outline">Регистрация</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <p>© 2025 Медицинский центр</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;