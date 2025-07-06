import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, fetchUserData } from '../../redux/slices/AuthSlice';
import { createEmptyPatient } from '../../redux/slices/PatientSlice';
import '../../styles/authForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, user, token } = useSelector((state) => state.auth);
  const { currentPatient } = useSelector((state) => state.patient);

  const [userlogin, setLogin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user && token && currentPatient) {
      console.log("USER:");
      console.log(user);
      console.log("currentPatient:");
      console.log(currentPatient);
      if (isPatientEmpty(currentPatient)) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    }
  }, [user, token, currentPatient, navigate]);

  const isPatientEmpty = (patient) => {
    return !patient?.First_Name || !patient?.Last_Name || !patient?.Birthdate;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError('');
    setPasswordError('');

    try {
      const result = await dispatch(register({ login: userlogin, password })).unwrap();
      
      await dispatch(fetchUserData(result.accessToken));
      
      if (result.user?.ID) {
        await dispatch(createEmptyPatient({
          userId: result.user.ID,
          token: result.accessToken
        }));
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('Логин уже занят')) {
        setLoginError(err.message);
      } else {
        setLoginError('Ошибка регистрации');
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Логин" 
          value={userlogin} 
          onChange={(e) => setLogin(e.target.value)} 
          required 
        />
        {loginError && <span className="error-span">{loginError}</span>}
        
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6}
        />
        {passwordError && <span className="error-span">{passwordError}</span>}
        
        <button type="submit">Зарегистрироваться</button>
        </form>
        
        {error && <span className="server-error">{error}</span>}
        
        <div className="auth-form-footer">
          Уже есть аккаунт? <Link to="/auth/login">Войдите</Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;