import React from 'react';
import '../styles/auth.css';

const AuthPage = ({ children }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
};

export default AuthPage;