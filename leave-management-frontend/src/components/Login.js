import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
      if (result.success) {
        setMessage('Login successful! Redirecting...');
        // Redirect based on user role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        }, 1000);
        return;
      }
    } else {
      result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
        return;
      }
    }
    
    if (!result.success) {
      setMessage(result.error || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
        
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '15px' }}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Demo Admin:</strong> admin@company.com / admin123</p>
          <p><strong>Demo Employee:</strong> john@company.com / password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;