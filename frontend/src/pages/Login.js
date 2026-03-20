import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUser, FaOm } from 'react-icons/fa';
import { apiClient } from '../apiClient';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [role, setRole] = useState('user');   // 'user' | 'admin'
  const [mode, setMode] = useState('login');  // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const reset = () => { setError(''); };

  // ── User login ──────────────────────────────────────────────
  const handleUserLogin = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const res = await apiClient.userLogin(loginData.email, loginData.password);
      if (res.success) { loginUser(res.user); navigate('/profile'); }
      else setError(res.error || 'Invalid email or password');
    } catch (err) { setError(err.message || 'Login failed. Please try again.'); }
    setLoading(false);
  };

  // ── User register ────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault(); reset();
    if (registerData.password !== registerData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await apiClient.userRegister(registerData.name, registerData.email, registerData.phone, registerData.password);
      if (res.success) { loginUser(res.user); navigate('/profile'); }
      else setError(res.error || 'Registration failed');
    } catch (err) { setError(err.message || 'Registration failed. Please try again.'); }
    setLoading(false);
  };

  // ── Admin login ──────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const res = await apiClient.adminLogin(loginData.username, loginData.password);
      if (res.success) { loginAdmin(res.user); navigate('/admin/dashboard'); }
      else setError('Invalid admin credentials');
    } catch (err) { setError(err.message || 'Login failed. Please try again.'); }
    setLoading(false);
  };

  const switchRole = (r) => { setRole(r); setMode('login'); reset(); setLoginData({ email: '', username: '', password: '' }); };
  const switchMode = (m) => { setMode(m); reset(); };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <FaOm />
          <span>Spiritual Math</span>
        </div>

        {/* Role tabs */}
        <div className="auth-role-tabs">
          <button className={`role-tab ${role === 'user' ? 'active' : ''}`} onClick={() => switchRole('user')}>
            <FaUser /> Devotee
          </button>
          <button className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => switchRole('admin')}>
            <FaUserShield /> Admin
          </button>
        </div>

        {/* Mode tabs (only for user) */}
        {role === 'user' && (
          <div className="auth-mode-tabs">
            <button className={`mode-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>Login</button>
            <button className={`mode-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>Register</button>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        {/* ── User Login ── */}
        {role === 'user' && mode === 'login' && (
          <form className="auth-form" onSubmit={handleUserLogin}>
            <h2>Welcome Back</h2>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        )}

        {/* ── User Register ── */}
        {role === 'user' && mode === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" value={registerData.name}
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+91 XXXXX XXXXX" value={registerData.phone}
                onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={registerData.confirmPassword}
                onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>
        )}

        {/* ── Admin Login ── */}
        {role === 'admin' && (
          <form className="auth-form" onSubmit={handleAdminLogin}>
            <h2>Admin Access</h2>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="admin" value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
            </div>
            <button type="submit" className="auth-btn admin" disabled={loading}>
              {loading ? 'Logging in…' : 'Login as Admin'}
            </button>
            <p className="auth-hint">Demo: admin / admin123</p>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;
