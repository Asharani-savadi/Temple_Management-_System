import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../apiClient';
import { useAuth } from '../context/AuthContext';
import './UserLogin.css';

function UserLogin() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.userLogin(loginData.email, loginData.password);
      if (res.success) {
        loginUser(res.user);
        navigate('/profile');
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.userRegister(
        registerData.name, registerData.email, registerData.phone, registerData.password
      );
      if (res.success) {
        loginUser(res.user);
        navigate('/profile');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="user-login-page">
      <div className="user-login-container">
        <div className="user-login-tabs">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserLogin;
