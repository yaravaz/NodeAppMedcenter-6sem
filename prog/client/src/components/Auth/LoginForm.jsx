import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, fetchUserData } from '../../redux/slices/AuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/authForm.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const { currentPatient } = useSelector((state) => state.patient);

  const [userlogin, setLogin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isPatientEmpty = (patient) => {
    return !patient?.First_Name || !patient?.Last_Name || !patient?.Birthdate;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setPasswordError('');

    try {
      const result = await dispatch(login({ login: userlogin, password })).unwrap();
      const token = result.accessToken;
      await dispatch(fetchUserData(token));
      if (isPatientEmpty(currentPatient)) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      console.log(err.response?.data.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form">
        <h2>Вход в систему</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Логин" 
            value={userlogin} 
            onChange={(e) => setLogin(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Войти</button>
        </form>
        {loginError && <span className="error-span">{loginError}</span>}
        {passwordError && <span className="error-span">{passwordError}</span>}
        {error && <span className="server-error">{error}</span>}

        <div className="auth-form-footer">
          Ещё нет аккаунта? <Link to="/auth/register">Зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;